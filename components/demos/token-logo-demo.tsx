"use client";

import { TokenLogo } from "@/registry/onchain-ui/token-logo";

export function TokenLogoDemo() {
  return (
    <TokenLogo
      src="https://assets.coingecko.com/coins/images/279/large/ethereum.png"
      symbol="ETH"
      name="Ethereum"
    />
  );
}

export function TokenLogoDemoFallback() {
  return <TokenLogo symbol="USDC" name="USD Coin" />;
}

export function TokenLogoDemoSizes() {
  return (
    <div className="flex items-center gap-3">
      <TokenLogo symbol="ETH" size="xs" />
      <TokenLogo symbol="ETH" size="sm" />
      <TokenLogo symbol="ETH" size="md" />
      <TokenLogo symbol="ETH" size="lg" />
      <TokenLogo symbol="ETH" size="xl" />
    </div>
  );
}

export function TokenLogoDemoCustomFallback() {
  return (
    <TokenLogo
      symbol="WETH"
      fallback="Ξ"
      className="border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-300"
    />
  );
}

export function TokenLogoDemoTooltip() {
  return (
    <TokenLogo
      src="https://assets.coingecko.com/coins/images/279/large/ethereum.png"
      symbol="ETH"
      name="Ethereum"
      showTooltip
    />
  );
}
