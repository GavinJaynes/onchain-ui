"use client";

import { TokenLogo } from "@/registry/onchain-ui/token-logo";
import { TokenStack } from "@/registry/onchain-ui/token-stack";

const TOKENS = [
  {
    symbol: "ETH",
    name: "Ethereum",
    src: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    src: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
  },
  {
    symbol: "AERO",
    name: "Aerodrome",
    src: "https://assets.coingecko.com/coins/images/31745/large/token.png",
  },
  {
    symbol: "cbBTC",
    name: "Coinbase Wrapped BTC",
    src: "https://assets.coingecko.com/coins/images/40143/large/cbbtc.webp",
  },
  {
    symbol: "WELL",
    name: "Moonwell",
    src: "https://assets.coingecko.com/coins/images/26133/large/WELL.png",
  },
  {
    symbol: "MORPHO",
    name: "Morpho",
    src: "https://assets.coingecko.com/coins/images/29837/large/Morpho-token-icon.png",
  },
];

export function TokenStackDemo() {
  return <TokenStack tokens={TOKENS.slice(0, 4)} />;
}

export function TokenStackDemoOverflow() {
  return <TokenStack tokens={TOKENS} limit={4} />;
}

export function TokenStackDemoTooltip() {
  return <TokenStack tokens={TOKENS} limit={4} showTooltip />;
}

export function TokenStackDemoSizes() {
  return (
    <div className="flex items-center gap-6">
      <TokenStack tokens={TOKENS.slice(0, 3)} size="sm" />
      <TokenStack tokens={TOKENS.slice(0, 3)} size="md" />
      <TokenStack tokens={TOKENS.slice(0, 3)} size="lg" />
    </div>
  );
}

export function TokenStackDemoCustomRender() {
  return (
    <TokenStack
      tokens={TOKENS.slice(0, 4)}
      renderToken={(token) => (
        <TokenLogo
          symbol={token.symbol}
          name={token.name}
          fallback={token.symbol?.slice(0, 1)}
          className="border-primary/30 bg-primary/10 text-primary"
        />
      )}
    />
  );
}
