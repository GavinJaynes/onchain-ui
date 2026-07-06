import { TokenLogo } from "./token-logo";

export default function TokenLogoDemo() {
  return (
    <div className="flex min-h-svh items-center justify-center gap-4 p-8">
      <TokenLogo
        symbol="USDC"
        name="USD Coin"
        src="https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png"
        size="lg"
      />
      <TokenLogo symbol="WBTC" name="Wrapped Bitcoin" size="lg" />
    </div>
  );
}
