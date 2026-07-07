import {
  createPublicClient,
  encodePacked,
  fallback,
  http,
  isAddress,
  keccak256,
  namehash,
  zeroAddress,
  type Address,
  type Hex,
  type PublicClient,
} from "viem";
import { normalize, parseAvatarRecord } from "viem/ens";
import { base, mainnet } from "viem/chains";

export const BASENAME_L2_RESOLVER_ADDRESS =
  "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD";

const baseNamesAbi = [
  {
    inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "node", type: "bytes32" },
      { internalType: "string", name: "key", type: "string" },
    ],
    name: "text",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }],
    name: "addr",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export interface OnchainResolverOptions {
  mainnetClient?: PublicClient;
  baseClient?: PublicClient;
  basenameResolverAddress?: Address;
  reverseLookupOrder?: Array<"ens" | "basename">;
}

export interface OnchainIdentity {
  address: Address;
  name: string | null;
  avatar: string | null;
  source: "ens" | "basename" | null;
}

// The default clients use each chain's public RPC endpoint, with a fallback:
// viem's default mainnet endpoint (eth.merkle.io) aggressively rate limits
// some IPs, which would otherwise silently break name resolution. Public
// endpoints are fine for demos; pass your own clients through
// `OnchainResolverOptions` in production.
function createDefaultMainnetClient() {
  return createPublicClient({
    chain: mainnet,
    transport: fallback([
      http(),
      http("https://ethereum-rpc.publicnode.com"),
    ]),
  });
}

function createDefaultBaseClient() {
  return createPublicClient({
    chain: base,
    transport: fallback([http(), http("https://base-rpc.publicnode.com")]),
  });
}

let defaultMainnetClient:
  | ReturnType<typeof createDefaultMainnetClient>
  | undefined;
let defaultBaseClient: ReturnType<typeof createDefaultBaseClient> | undefined;

function getMainnetClient(options?: OnchainResolverOptions) {
  if (options?.mainnetClient) return options.mainnetClient;
  if (!defaultMainnetClient) defaultMainnetClient = createDefaultMainnetClient();
  return defaultMainnetClient;
}

function getBaseClient(options?: OnchainResolverOptions) {
  if (options?.baseClient) return options.baseClient;
  if (!defaultBaseClient) defaultBaseClient = createDefaultBaseClient();
  return defaultBaseClient;
}

function getBasenameResolverAddress(options?: OnchainResolverOptions) {
  return options?.basenameResolverAddress ?? BASENAME_L2_RESOLVER_ADDRESS;
}

export function convertChainIdToCoinType(chainId: number): string {
  if (chainId === mainnet.id) return "addr";

  const coinType = (0x80000000 | chainId) >>> 0;
  return coinType.toString(16).toUpperCase();
}

export function convertReverseNodeToBytes(address: Address, chainId: number) {
  const addressFormatted = address.toLowerCase() as Address;
  const addressNode = keccak256(addressFormatted.substring(2) as Hex);
  const chainCoinType = convertChainIdToCoinType(chainId);
  const baseReverseNode = namehash(`${chainCoinType}.reverse`);

  return keccak256(
    encodePacked(["bytes32", "bytes32"], [baseReverseNode, addressNode])
  );
}

// Internal lookups report failures instead of collapsing them into null, so
// callers can tell "no record exists" (cacheable) from "the RPC call failed"
// (must not be cached). The exported resolve* functions keep returning null
// for both.
type LookupResult<T> = { value: T; failed: boolean };

async function lookupEnsName(
  address: Address,
  options?: OnchainResolverOptions
): Promise<LookupResult<string | null>> {
  try {
    const name = await getMainnetClient(options).getEnsName({ address });
    return { value: name, failed: false };
  } catch {
    return { value: null, failed: true };
  }
}

async function lookupBasename(
  address: Address,
  options?: OnchainResolverOptions
): Promise<LookupResult<string | null>> {
  try {
    const reverseNode = convertReverseNodeToBytes(address, base.id);

    const name = await getBaseClient(options).readContract({
      abi: baseNamesAbi,
      address: getBasenameResolverAddress(options),
      functionName: "name",
      args: [reverseNode],
    });

    return { value: name || null, failed: false };
  } catch {
    return { value: null, failed: true };
  }
}

export async function resolveEnsName(
  address: Address,
  options?: OnchainResolverOptions
) {
  return (await lookupEnsName(address, options)).value;
}

export async function resolveBasename(
  address: Address,
  options?: OnchainResolverOptions
) {
  return (await lookupBasename(address, options)).value;
}

// Session-level caches so repeated lookups (portfolio rows, remounts) don't
// refetch. Keyed lookups share in-flight promises, deduping concurrent calls.
// Failed lookups are evicted once settled so transient RPC errors are retried
// instead of pinning "no result" for the whole session.
//
// Caches are scoped per resolver config: results from different clients or a
// different Basename resolver must not mix. Scopes are keyed on the client
// instances via WeakMap so a custom client keeps request deduplication, and
// short-lived clients get garbage collected along with their cache.
type ResolverCaches = {
  avatar: Map<string, Promise<LookupResult<string | null>>>;
  identity: Map<string, Promise<LookupResult<OnchainIdentity>>>;
};

const defaultMainnetScope = {};
const defaultBaseScope = {};

const cacheScopes = new WeakMap<
  object,
  WeakMap<object, Map<string, ResolverCaches>>
>();

function getResolverCaches(options?: OnchainResolverOptions): ResolverCaches {
  const mainnetScope = options?.mainnetClient ?? defaultMainnetScope;
  const baseScope = options?.baseClient ?? defaultBaseScope;
  const resolverAddress = getBasenameResolverAddress(options).toLowerCase();

  let baseScopes = cacheScopes.get(mainnetScope);
  if (!baseScopes) {
    baseScopes = new WeakMap();
    cacheScopes.set(mainnetScope, baseScopes);
  }

  let resolverScopes = baseScopes.get(baseScope);
  if (!resolverScopes) {
    resolverScopes = new Map();
    baseScopes.set(baseScope, resolverScopes);
  }

  let caches = resolverScopes.get(resolverAddress);
  if (!caches) {
    caches = { avatar: new Map(), identity: new Map() };
    resolverScopes.set(resolverAddress, caches);
  }

  return caches;
}

export async function resolveNameAvatar(
  name: string,
  options?: OnchainResolverOptions
) {
  return (await lookupNameAvatarCached(name, options)).value;
}

async function lookupNameAvatarCached(
  name: string,
  options?: OnchainResolverOptions
): Promise<LookupResult<string | null>> {
  const cache = getResolverCaches(options).avatar;

  const cached = cache.get(name);
  if (cached) return cached;

  const promise = lookupNameAvatar(name, options);
  cache.set(name, promise);

  const result = await promise;
  if (result.failed) cache.delete(name);
  return result;
}

async function lookupNameAvatar(
  name: string,
  options?: OnchainResolverOptions
): Promise<LookupResult<string | null>> {
  try {
    if (name.endsWith(".base.eth")) {
      // The Basename L2 resolver is a plain resolver, not an ENS universal
      // resolver, so viem's getEnsAvatar reverts against it. Read the avatar
      // text record directly instead.
      const client = getBaseClient(options);
      const record = await client.readContract({
        abi: baseNamesAbi,
        address: getBasenameResolverAddress(options),
        functionName: "text",
        args: [namehash(normalize(name)), "avatar"],
      });

      if (!record) return { value: null, failed: false };
      return { value: await parseAvatarRecord(client, { record }), failed: false };
    }

    const avatar = await getMainnetClient(options).getEnsAvatar({ name });
    return { value: avatar, failed: false };
  } catch {
    return { value: null, failed: true };
  }
}

export async function resolveAddress(
  input: string,
  options?: OnchainResolverOptions
): Promise<Address | null> {
  if (isAddress(input)) return input;

  try {
    if (input.endsWith(".base.eth")) {
      // Direct resolver read; see fetchNameAvatar for why getEnsAddress with
      // a universalResolverAddress override does not work for Basenames.
      const address = await getBaseClient(options).readContract({
        abi: baseNamesAbi,
        address: getBasenameResolverAddress(options),
        functionName: "addr",
        args: [namehash(normalize(input))],
      });

      return address && address !== zeroAddress ? address : null;
    }

    if (input.endsWith(".eth")) {
      return await getMainnetClient(options).getEnsAddress({ name: input });
    }
  } catch {
    return null;
  }

  return null;
}

export async function resolveOnchainIdentity(
  address: Address,
  options?: OnchainResolverOptions
): Promise<OnchainIdentity> {
  const reverseLookupOrder = options?.reverseLookupOrder ?? [
    "basename",
    "ens",
  ];

  const cache = getResolverCaches(options).identity;
  const cacheKey = `${address.toLowerCase()}:${reverseLookupOrder.join(",")}`;

  const cached = cache.get(cacheKey);
  if (cached) return (await cached).value;

  const promise = lookupOnchainIdentity(address, reverseLookupOrder, options);
  cache.set(cacheKey, promise);

  const result = await promise;
  if (result.failed) cache.delete(cacheKey);
  return result.value;
}

async function lookupOnchainIdentity(
  address: Address,
  reverseLookupOrder: Array<"ens" | "basename">,
  options?: OnchainResolverOptions
): Promise<LookupResult<OnchainIdentity>> {
  let failed = false;

  for (const source of reverseLookupOrder) {
    const name =
      source === "basename"
        ? await lookupBasename(address, options)
        : await lookupEnsName(address, options);

    if (name.failed) failed = true;

    if (name.value) {
      const avatar = await lookupNameAvatarCached(name.value, options);

      return {
        value: {
          address,
          name: name.value,
          avatar: avatar.value,
          source,
        },
        failed: failed || avatar.failed,
      };
    }
  }

  return {
    value: {
      address,
      name: null,
      avatar: null,
      source: null,
    },
    failed,
  };
}
