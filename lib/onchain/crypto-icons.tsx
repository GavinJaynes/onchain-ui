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
      <circle cx="16" cy="16" r="16" fill="#627EEA" />
      <g fill="#FFF">
        <path fillOpacity=".602" d="M16.498 4v8.87l7.497 3.35z" />
        <path d="M16.498 4L9 16.22l7.498-3.35z" />
        <path fillOpacity=".602" d="M16.498 21.968v6.027L24 17.616z" />
        <path d="M16.498 27.995v-6.028L9 17.616z" />
        <path fillOpacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z" />
        <path fillOpacity=".602" d="M9 16.22l7.498 4.353v-7.701z" />
      </g>
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
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="12" fill="#FF0420" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.85865 15.3781C5.43829 15.7927 6.18265 16 7.09173 16C8.19009 16 9.06774 15.7517 9.72466 15.2553C10.3809 14.7516 10.8427 13.9926 11.1099 12.978C11.2703 12.3558 11.4079 11.7149 11.5226 11.0554C11.5598 10.8196 11.5788 10.6231 11.5795 10.4659C11.5795 9.94787 11.4459 9.50377 11.1786 9.13373C10.9039 8.74954 10.5214 8.4555 10.0793 8.28884C9.61364 8.09628 9.08706 8 8.49956 8C6.34017 8 5.00078 9.01845 4.48139 11.0554C4.29802 11.804 4.15686 12.4448 4.05796 12.978C4.02335 13.176 4.00397 13.3764 4 13.5773C4 14.3554 4.28622 14.9557 4.85865 15.3781ZM8.99176 12.9112C8.77268 13.762 8.16848 14.3161 7.25186 14.3161C6.34508 14.3161 6.03561 13.703 6.19869 12.9112C6.33623 12.1927 6.47377 11.5852 6.61132 11.0888C6.8471 10.1702 7.40316 9.68389 8.35023 9.68389C9.25407 9.68389 9.5488 10.2891 9.3926 11.0888C9.3009 11.6075 9.16729 12.215 8.99176 12.9112ZM12.4608 15.9204C12.5059 15.9728 12.5691 15.999 12.6504 15.999H14.1653C14.2427 15.9981 14.3174 15.9703 14.3765 15.9204C14.4423 15.8699 14.4862 15.796 14.4993 15.7141L14.9778 13.4742H16.5182C17.4909 13.4742 18.2513 13.0026 18.8083 12.583C19.3729 12.1638 19.7477 11.5162 19.9332 10.6398C19.9784 10.4342 20.0006 10.236 20 10.0454C20 9.38327 19.7477 8.87666 19.2435 8.5256C18.7457 8.1752 18.0849 8 17.2609 8H14.2989C14.2209 8.00126 14.1458 8.02976 14.0867 8.08056C14.0222 8.13166 13.9788 8.20477 13.9649 8.28589L12.4274 15.7141C12.411 15.7846 12.423 15.8587 12.4608 15.9204ZM17.874 10.6172C17.7345 11.2293 17.201 11.7893 16.5742 11.7893H15.2941L15.7352 9.68389H17.0713C17.5262 9.68389 17.9064 9.77428 17.9064 10.2743C17.9064 10.3726 17.8963 10.4868 17.874 10.6172Z"
        fill="white"
      />
    </svg>
  );
}

function ArbitrumMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="12" fill="#213147" />
      <path
        d="M13.203 13.2158L12.4164 15.3402C12.3951 15.3993 12.3951 15.4636 12.4164 15.5227L13.7695 19.178L15.3346 18.2879L13.4562 13.2158C13.4136 13.099 13.2456 13.099 13.203 13.2158Z"
        fill="white"
      />
      <path
        d="M14.78 9.64306C14.7373 9.52621 14.5693 9.52621 14.5267 9.64306L13.7402 11.7674C13.7188 11.8265 13.7188 11.8909 13.7402 11.9499L15.9571 17.9345L17.5221 17.0443L14.78 9.64306Z"
        fill="white"
      />
      <path
        d="M11.9985 4.9913C12.0371 4.9913 12.0758 5.0018 12.1104 5.02019L18.0787 8.41424C18.148 8.45363 18.1907 8.52716 18.1907 8.60462V15.3914C18.1907 15.4702 18.148 15.5424 18.0787 15.5818L12.1104 18.9759C12.0772 18.9955 12.0371 19.0047 11.9985 19.0047C11.9598 19.0047 11.9211 18.9943 11.8865 18.9759L5.91826 15.5844C5.84894 15.545 5.80628 15.4715 5.80628 15.3941V8.60593C5.80628 8.52716 5.84894 8.45494 5.91826 8.41555L11.8865 5.0215C11.9211 5.0018 11.9598 4.9913 11.9985 4.9913ZM11.9985 4C11.7865 4 11.5732 4.05383 11.3826 4.16281L5.41568 7.55555C5.03442 7.77219 4.7998 8.17265 4.7998 8.60593V15.3927C4.7998 15.826 5.03442 16.2265 5.41568 16.4431L11.3839 19.8371C11.5745 19.9448 11.7865 20 11.9998 20C12.2118 20 12.425 19.9462 12.6157 19.8371L18.5839 16.4431C18.9652 16.2265 19.1998 15.826 19.1998 15.3927V8.60593C19.1998 8.17265 18.9652 7.77219 18.5839 7.55555L12.6143 4.16281C12.4237 4.05383 12.2104 4 11.9985 4Z"
        fill="white"
      />
      <path d="M8.05225 17.9426L8.60149 16.4615L9.70662 17.3662L8.67348 18.2958L8.05225 17.9426Z" fill="white" />
      <path
        d="M11.4965 8.12012H9.98351C9.87019 8.12012 9.76888 8.1897 9.73022 8.29474L6.48682 17.0523L8.05186 17.9425L11.6232 8.29868C11.6565 8.21203 11.5912 8.12012 11.4965 8.12012Z"
        fill="white"
      />
      <path
        d="M14.144 8.12012H12.6309C12.5176 8.12012 12.4163 8.1897 12.3776 8.29474L8.67432 18.2944L10.2393 19.1846L14.2706 8.29868C14.3026 8.21203 14.2373 8.12012 14.144 8.12012Z"
        fill="white"
      />
    </svg>
  );
}

function PolygonMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <defs>
        <linearGradient
          id="onchain-ui-polygon-bg"
          x1="3.948"
          y1="16.617"
          x2="19.217"
          y2="7.645"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#A726C1" />
          <stop offset="0.88" stopColor="#803BDF" />
          <stop offset="1" stopColor="#7B3FE4" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="12" fill="url(#onchain-ui-polygon-bg)" />
      <path
        d="M15.8794 14.8595L19.6745 12.6947C19.8757 12.5797 20 12.3664 20 12.1375V7.80782C20 7.57894 19.8757 7.36569 19.6745 7.25069L15.8794 5.08583C15.6782 4.97083 15.4284 4.97195 15.2284 5.08583L11.4332 7.25069C11.232 7.36569 11.1077 7.57894 11.1077 7.80782V15.545L8.44614 17.0623L5.78456 15.545V12.5093L8.44614 10.992L10.2013 11.9935V9.95705L8.77163 9.1409C8.67331 9.08508 8.56029 9.05493 8.44614 9.05493C8.33199 9.05493 8.21897 9.08508 8.12065 9.1409L4.32549 11.3058C4.12432 11.4208 4 11.634 4 11.8629V16.1926C4 16.4215 4.12432 16.6347 4.32549 16.7497L8.12065 18.9146C8.32182 19.0285 8.57046 19.0285 8.77163 18.9146L12.5668 16.7497C12.768 16.6347 12.8923 16.4215 12.8923 16.1926V8.45538L12.9397 8.42859L15.5527 6.93808L18.2143 8.45538V11.4911L15.5527 13.0084L13.7998 12.0092V14.0456L15.2272 14.8595C15.4284 14.9734 15.6782 14.9734 15.8782 14.8595H15.8794Z"
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
