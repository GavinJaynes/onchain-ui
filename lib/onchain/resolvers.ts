import {
  createPublicClient,
  encodePacked,
  http,
  isAddress,
  keccak256,
  namehash,
  type Address,
  type Hex,
  type PublicClient,
} from "viem";
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

// The default clients use each chain's public RPC endpoint. Public endpoints
// are rate limited and fine for demos; pass your own clients through
// `OnchainResolverOptions` in production.
function createDefaultMainnetClient() {
  return createPublicClient({ chain: mainnet, transport: http() });
}

function createDefaultBaseClient() {
  return createPublicClient({ chain: base, transport: http() });
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

function hasCustomResolverConfig(options?: OnchainResolverOptions) {
  return Boolean(
    options?.mainnetClient ??
      options?.baseClient ??
      options?.basenameResolverAddress
  );
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

export async function resolveEnsName(
  address: Address,
  options?: OnchainResolverOptions
) {
  try {
    return await getMainnetClient(options).getEnsName({ address });
  } catch {
    return null;
  }
}

export async function resolveBasename(
  address: Address,
  options?: OnchainResolverOptions
) {
  try {
    const reverseNode = convertReverseNodeToBytes(address, base.id);

    const name = await getBaseClient(options).readContract({
      abi: baseNamesAbi,
      address: getBasenameResolverAddress(options),
      functionName: "name",
      args: [reverseNode],
    });

    return name || null;
  } catch {
    return null;
  }
}

// Session-level caches so repeated lookups (portfolio rows, remounts) don't
// refetch. Keyed lookups share in-flight promises, deduping concurrent calls.
// Skipped when custom clients are provided, since results may differ.
const avatarCache = new Map<string, Promise<string | null>>();
const identityCache = new Map<string, Promise<OnchainIdentity>>();

export async function resolveNameAvatar(
  name: string,
  options?: OnchainResolverOptions
) {
  if (!hasCustomResolverConfig(options)) {
    const cached = avatarCache.get(name);
    if (cached) return cached;

    const promise = fetchNameAvatar(name, options);
    avatarCache.set(name, promise);
    return promise;
  }

  return fetchNameAvatar(name, options);
}

async function fetchNameAvatar(name: string, options?: OnchainResolverOptions) {
  try {
    if (name.endsWith(".base.eth")) {
      return await getBaseClient(options).getEnsAvatar({
        name,
        universalResolverAddress: getBasenameResolverAddress(options),
      });
    }

    return await getMainnetClient(options).getEnsAvatar({ name });
  } catch {
    return null;
  }
}

export async function resolveAddress(
  input: string,
  options?: OnchainResolverOptions
): Promise<Address | null> {
  if (isAddress(input)) return input;

  try {
    if (input.endsWith(".base.eth")) {
      return await getBaseClient(options).getEnsAddress({
        name: input,
        universalResolverAddress: getBasenameResolverAddress(options),
      });
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

  if (!hasCustomResolverConfig(options)) {
    const cacheKey = `${address.toLowerCase()}:${reverseLookupOrder.join(",")}`;
    const cached = identityCache.get(cacheKey);
    if (cached) return cached;

    const promise = fetchOnchainIdentity(address, reverseLookupOrder, options);
    identityCache.set(cacheKey, promise);
    return promise;
  }

  return fetchOnchainIdentity(address, reverseLookupOrder, options);
}

async function fetchOnchainIdentity(
  address: Address,
  reverseLookupOrder: Array<"ens" | "basename">,
  options?: OnchainResolverOptions
): Promise<OnchainIdentity> {
  for (const source of reverseLookupOrder) {
    const name =
      source === "basename"
        ? await resolveBasename(address, options)
        : await resolveEnsName(address, options);

    if (name) {
      return {
        address,
        name,
        avatar: await resolveNameAvatar(name, options),
        source,
      };
    }
  }

  return {
    address,
    name: null,
    avatar: null,
    source: null,
  };
}
