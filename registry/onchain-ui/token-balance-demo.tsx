import { TokenBalance } from "./token-balance";

export default function TokenBalanceDemo() {
  return (
    <div className="flex min-h-svh items-center justify-center p-8">
      <TokenBalance
        amount={1.4321}
        symbol="ETH"
        fiatValue={4982.11}
        change={2.4}
        src="https://assets.coingecko.com/coins/images/279/large/ethereum.png"
      />
    </div>
  );
}
