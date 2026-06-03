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

const defaultMainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const defaultBaseClient = createPublicClient({
  chain: base,
  transport: http(),
});

function getMainnetClient(options?: OnchainResolverOptions) {
  return options?.mainnetClient ?? defaultMainnetClient;
}

function getBaseClient(options?: OnchainResolverOptions) {
  return options?.baseClient ?? defaultBaseClient;
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

export async function resolveNameAvatar(
  name: string,
  options?: OnchainResolverOptions
) {
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
