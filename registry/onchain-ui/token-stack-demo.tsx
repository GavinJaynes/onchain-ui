import { TokenStack } from "./token-stack";

const tokens = [
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
  { symbol: "WBTC", name: "Wrapped Bitcoin" },
  { symbol: "LINK", name: "Chainlink" },
];

export default function TokenStackDemo() {
  return (
    <div className="flex min-h-svh items-center justify-center p-8">
      <TokenStack tokens={tokens} limit={3} size="lg" />
    </div>
  );
}
