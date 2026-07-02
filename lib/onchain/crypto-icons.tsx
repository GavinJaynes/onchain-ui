import { getAddress } from "viem";
import type { ReactNode } from "react";

/**
 * Crypto icon adapter.
 *
 * This file is the single seam onchain-ui components use to resolve token and
 * network icons — the crypto equivalent of shadcn's icon library setting.
 * Swap the implementations to point at your icon package, token list, CDN, or
 * indexer; the component contract stays the same.
 *
 * Both functions may return:
 * - a string, treated as an image URL
 * - a ReactNode, rendered directly in place of the image
 * - null, meaning "unknown" — components fall back to readable initials
 *
 * Explicit props (`src`, `fallback`) always win over this adapter.
 */

export type CryptoIcon = string | ReactNode | null;

export interface TokenIconQuery {
  /** EVM chain id the token lives on */
  chainId?: number | null;
  /** Token contract address */
  address?: string | null;
  /** Token symbol. Unused by the default adapter: symbols are not canonical */
  symbol?: string | null;
}

// Chain folder names in the Trust Wallet assets repo.
const trustWalletChainFolders: Record<number, string> = {
  1: "ethereum",
  10: "optimism",
  137: "polygon",
  8453: "base",
  42161: "arbitrum",
};

/**
 * Resolves a token icon from the community-maintained Trust Wallet assets
 * repo by chain id and contract address. Coverage is good for established
 * tokens; misses degrade to the component's initials fallback.
 *
 * This default is fine for demos and prototypes. In production, prefer your
 * own token metadata (`src`) or point this function at your token list or
 * CDN.
 */
export function getTokenIcon(query: TokenIconQuery): CryptoIcon {
  const { chainId, address } = query;
  if (chainId == null || !address) return null;

  const chainFolder = trustWalletChainFolders[chainId];
  if (!chainFolder) return null;

  try {
    // The repo stores assets under EIP-55 checksummed addresses.
    const checksummed = getAddress(address);
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chainFolder}/assets/${checksummed}/logo.png`;
  } catch {
    return null;
  }
}

function EthereumMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <circle cx="16" cy="16" r="16" fill="#111827" />
      <path d="m16 5 6.5 11L16 19.75 9.5 16 16 5Z" fill="#E5E7EB" />
      <path
        d="m16 21.05 6.5-3.75L16 27l-6.5-9.7 6.5 3.75Z"
        fill="#9CA3AF"
      />
      <path d="m16 5v14.75L9.5 16 16 5Z" fill="#F9FAFB" />
    </svg>
  );
}

function BaseMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 146 146" aria-hidden="true" className={className}>
      <circle cx="73" cy="73" r="73" fill="#0052FF" />
      <path
        d="M73.323 123.729C101.617 123.729 124.553 100.832 124.553 72.5875C124.553 44.343 101.617 21.4463 73.323 21.4463C46.4795 21.4463 24.4581 42.0558 22.271 68.2887H89.9859V76.8864H22.271C24.4581 103.119 46.4795 123.729 73.323 123.729Z"
        fill="white"
      />
    </svg>
  );
}

function OptimismMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <circle cx="16" cy="16" r="16" fill="#FF0420" />
      <path
        d="M8.25 18.95c-1.15 0-1.9-.72-1.9-1.8 0-.18.03-.42.07-.62l.28-1.35c.33-1.58 1.35-2.35 2.98-2.35h1.15c1.15 0 1.9.72 1.9 1.8 0 .18-.03.42-.07.62l-.28 1.35c-.33 1.58-1.35 2.35-2.98 2.35H8.25Zm.35-1.42h1.1c.55 0 .86-.27.98-.83l.33-1.55c.02-.1.03-.2.03-.28 0-.38-.25-.62-.68-.62h-1.1c-.55 0-.86.27-.98.83l-.33 1.55a1.5 1.5 0 0 0-.03.28c0 .38.25.62.68.62Zm5.17 1.35 1.25-5.97h3.13c1.28 0 2.03.72 2.03 1.8 0 1.55-1.02 2.58-2.68 2.58h-1.55l-.33 1.59h-1.85Zm2.45-2.93h1.37c.5 0 .8-.3.8-.83 0-.38-.23-.62-.65-.62H16.5l-.28 1.45Zm4.7 2.93 1.25-5.97h1.85l-1.25 5.97h-1.85Z"
        fill="white"
      />
    </svg>
  );
}

function ArbitrumMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <circle cx="16" cy="16" r="16" fill="#213147" />
      <path
        d="M16 5.5 25 10.7v10.6l-9 5.2-9-5.2V10.7l9-5.2Z"
        fill="#28A0F0"
      />
      <path
        d="M16 7.75 23.05 11.8v8.4L16 24.25 8.95 20.2v-8.4L16 7.75Z"
        fill="#213147"
      />
      <path d="m13.35 21.1 6.15-10.75h2.25L15.6 21.1h-2.25Z" fill="#12AAFF" />
      <path d="m10.25 21.1 6.15-10.75h2.25L12.5 21.1h-2.25Z" fill="white" />
    </svg>
  );
}

function PolygonMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <circle cx="16" cy="16" r="16" fill="#8247E5" />
      <path
        d="m20.8 12.55-3.45-2a2.7 2.7 0 0 0-2.7 0l-3.45 2a2.7 2.7 0 0 0-1.35 2.34v2.22c0 .96.52 1.84 1.35 2.34l3.45 2a2.7 2.7 0 0 0 2.7 0l3.45-2a2.7 2.7 0 0 0 1.35-2.34v-2.22a2.7 2.7 0 0 0-1.35-2.34Zm-1.1 4.56c0 .17-.1.34-.25.42L16 19.54a.48.48 0 0 1-.48 0l-3.45-2.01a.49.49 0 0 1-.25-.42v-2.22c0-.17.1-.34.25-.42l3.45-2.01a.48.48 0 0 1 .48 0l3.45 2.01c.15.08.25.25.25.42v2.22Z"
        fill="white"
      />
      <path
        d="m23.15 10.1-3.45-2a2.7 2.7 0 0 0-2.7 0l-1.6.93 2.22 1.28.72-.42a.48.48 0 0 1 .48 0l3.45 2.01c.15.08.25.25.25.42v2.22c0 .17-.1.34-.25.42l-.72.42v2.56l1.6-.93a2.7 2.7 0 0 0 1.35-2.34v-2.22a2.7 2.7 0 0 0-1.35-2.34Z"
        fill="white"
      />
    </svg>
  );
}

/**
 * Resolves a network icon by chain id. The default adapter ships crisp inline
 * marks for common chains so `<NetworkLogo chainId={8453} />` works offline
 * with zero configuration.
 */
export function getNetworkIcon(chainId?: number | null): CryptoIcon {
  if (chainId === 1) return <EthereumMark className="size-full" />;
  if (chainId === 10) return <OptimismMark className="size-full" />;
  if (chainId === 137) return <PolygonMark className="size-full" />;
  if (chainId === 8453) return <BaseMark className="size-full" />;
  if (chainId === 42161) return <ArbitrumMark className="size-full" />;
  return null;
}
