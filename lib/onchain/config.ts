import { arbitrum, base, mainnet, optimism, polygon } from "viem/chains";
import type { AssetGatewayUrls, Chain, PublicClient } from "viem";

/** The small client surface identity resolution actually consumes. */
export type OnchainReadClient = Pick<
  PublicClient,
  "getEnsAddress" | "getEnsAvatar" | "getEnsName" | "readContract"
>;

/**
 * The single place onchain-ui components look for app-wide settings.
 *
 * This file is yours: edit it once and every component follows. There is no
 * provider and no context — components import these functions directly, so
 * they work the same in a server component, a test, or a non-React consumer.
 *
 * Per-instance overrides always win. `<NetworkLogo name="…" />` and
 * `<AddressDisplay explorerUrl="…" />` beat anything configured here.
 */

export interface OnchainUIConfig {
  /**
   * Chains your app supports. Supplies block explorer URLs and display names
   * for networks that have no built-in entry below.
   *
   * Using wagmi? Point this at the config you already wrote:
   *
   * ```ts
   * import { wagmiConfig } from "@/lib/onchain/wagmi";
   * chains: wagmiConfig.chains,
   * ```
   */
  chains: readonly Chain[];

  /**
   * Returns a viem client for reads that are not tied to a rendered component
   * — currently ENS and Basename resolution. Leave undefined to use the public
   * endpoints below.
   *
   * Using wagmi? Share its transports instead of configuring RPC twice:
   *
   * ```ts
   * import { getPublicClient } from "@wagmi/core";
   * import { wagmiConfig } from "@/lib/onchain/wagmi";
   * getClient: (chainId) => getPublicClient(wagmiConfig, { chainId }),
   * ```
   */
  getClient?: (chainId: number) => OnchainReadClient | undefined;

  /**
   * Public gateways used to turn IPFS and Arweave avatar records into URLs.
   * Replace these with your own gateway in production when reliability or
   * rate limits matter.
   */
  avatarGatewayUrls?: AssetGatewayUrls;
}

export const onchainConfig: OnchainUIConfig = {
  chains: [mainnet, base, arbitrum, optimism, polygon],
  avatarGatewayUrls: {
    ipfs: "https://gateway.pinata.cloud",
    arweave: "https://arweave.net",
  },
};

/**
 * Curated network names and symbols.
 *
 * These are deliberately not derived from the viem chain: `chain.name` gives
 * "OP Mainnet" where a badge wants "Optimism", and `nativeCurrency.symbol`
 * gives "ETH" for Base, Optimism, and Arbitrum alike, which is useless as a
 * network mark. Chains absent here fall back to the configured chain's name.
 */
const knownNetworks: Partial<
  Record<number, { name: string; symbol: string }>
> = {
  1: { name: "Ethereum", symbol: "ETH" },
  10: { name: "Optimism", symbol: "OP" },
  137: { name: "Polygon", symbol: "POL" },
  8453: { name: "Base", symbol: "BASE" },
  42161: { name: "Arbitrum", symbol: "ARB" },
};

function findChain(chainId?: number | null) {
  if (chainId == null) return null;
  return onchainConfig.chains.find((chain) => chain.id === chainId) ?? null;
}

export interface NetworkMeta {
  name: string | null;
  symbol: string | null;
}

/** Display name and symbol for a chain, or nulls when it is unrecognised. */
export function getNetworkMeta(chainId?: number | null): NetworkMeta {
  if (chainId == null) return { name: null, symbol: null };

  const known = knownNetworks[chainId];
  if (known) return known;

  return { name: findChain(chainId)?.name ?? null, symbol: null };
}

/**
 * Block explorer base URL for a chain, or null when we have none.
 *
 * Derived from the configured chains rather than a second hardcoded map —
 * viem's chain objects already carry `blockExplorers`. Null is a real answer:
 * an address on an unrecognised chain does not exist in mainnet's address
 * space, so callers render no link rather than a misleading one.
 */
export function getExplorerUrl(chainId?: number | null): string | null {
  const chain = findChain(chainId);
  return chain?.blockExplorers?.default.url ?? null;
}

/** A read client for `chainId`, if the app configured one. */
export function getConfiguredClient(
  chainId: number
): OnchainReadClient | undefined {
  return onchainConfig.getClient?.(chainId);
}

/** App-wide gateways for ENS and Basename avatar assets, if configured. */
export function getConfiguredAvatarGatewayUrls(): AssetGatewayUrls | undefined {
  return onchainConfig.avatarGatewayUrls;
}
