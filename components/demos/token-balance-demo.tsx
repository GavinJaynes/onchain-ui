import { TokenBalance } from "@/registry/onchain-ui/token-balance";

export function TokenBalanceDemo() {
  return (
    <TokenBalance
      amount={1.2845}
      symbol="ETH"
      name="Ethereum"
      src="https://assets.coingecko.com/coins/images/279/large/ethereum.png"
      fiatValue={4163.91}
      change={2.41}
    />
  );
}

export function TokenBalanceDemoList() {
  return (
    <div className="grid gap-4">
      <TokenBalance
        amount={1.2845}
        symbol="ETH"
        name="Ethereum"
        src="https://assets.coingecko.com/coins/images/279/large/ethereum.png"
        fiatValue={4163.91}
        change={2.41}
      />
      <TokenBalance
        amount={1842.2}
        symbol="USDC"
        name="USD Coin"
        src="https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png"
        fiatValue={1842.2}
        change={0.01}
      />
      <TokenBalance
        amount={925.348}
        symbol="AERO"
        name="Aerodrome"
        src="https://assets.coingecko.com/coins/images/31745/large/token.png"
        fiatValue={692.14}
        change={-4.16}
      />
    </div>
  );
}

export function TokenBalanceDemoCompact() {
  return (
    <TokenBalance
      amount={0.128934}
      symbol="cbBTC"
      name="Coinbase Wrapped BTC"
      src="https://assets.coingecko.com/coins/images/40143/large/cbbtc.webp"
      fiatValue={13248.12}
      logoProps={{ size: "lg" }}
      priceProps={{ compact: true, showChangeIcon: false }}
    />
  );
}
