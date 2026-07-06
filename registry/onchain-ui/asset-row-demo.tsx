import { AssetRow } from "./asset-row";

const assets = [
  {
    symbol: "ETH",
    name: "Ethereum",
    src: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    amount: 1.2845,
    value: 4163.91,
    change: 2.41,
    chainId: 1,
    networkName: "Ethereum",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    src: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
    amount: 1842.2,
    value: 1842.2,
    change: 0.01,
    chainId: 8453,
    networkName: "Base",
  },
];

export default function AssetRowDemo() {
  return (
    <div className="flex min-h-svh items-center justify-center p-8">
      <div className="grid w-full max-w-md gap-2">
        {assets.map((asset) => (
          <AssetRow key={asset.symbol} {...asset} />
        ))}
      </div>
    </div>
  );
}
