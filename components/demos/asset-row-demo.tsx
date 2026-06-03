import { AssetRow } from "@/registry/onchain-ui/asset-row";

const assets = [
  {
    symbol: "ETH",
    name: "Ethereum",
    src: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    amount: 1.2845,
    value: 4163.91,
    change: 2.41,
    chainId: 1,
    subtitle: "Wallet balance",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    src: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
    amount: 1842.2,
    value: 1842.2,
    change: 0.01,
    chainId: 8453,
    subtitle: "Base",
  },
  {
    symbol: "AERO",
    name: "Aerodrome",
    src: "https://assets.coingecko.com/coins/images/31745/large/token.png",
    amount: 925.348,
    value: 692.14,
    change: -4.16,
    chainId: 8453,
    subtitle: "Liquidity rewards",
  },
];

export function AssetRowDemo() {
  return <AssetRow {...assets[1]} />;
}

export function AssetRowDemoPortfolio() {
  return (
    <div className="grid w-full max-w-md gap-2">
      {assets.map((asset) => (
        <AssetRow key={asset.symbol} {...asset} />
      ))}
    </div>
  );
}

export function AssetRowDemoWatchlist() {
  return (
    <div className="grid w-full max-w-md gap-2">
      {assets.map((asset) => (
        <AssetRow
          key={asset.symbol}
          {...asset}
          hideAmount
          subtitle={asset.chainId === 8453 ? "Base" : "Ethereum"}
          value={asset.value / Math.max(asset.amount, 1)}
          priceProps={{ showChangeIcon: false }}
        />
      ))}
    </div>
  );
}
