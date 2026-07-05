import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddressIdentity } from "@/registry/onchain-ui/address-identity";
import { AssetRow } from "@/registry/onchain-ui/asset-row";
import { TokenBalance } from "@/registry/onchain-ui/token-balance";
import { TokenPrice } from "@/registry/onchain-ui/token-price";
import { TokenStack } from "@/registry/onchain-ui/token-stack";
import type { Address } from "viem";

// garlic🧄.base.eth — resolves live through the Basename L2 resolver.
const WALLET = "0x02506c126A8d6dB0FE0CdfFf77f5007822FE7a16" as Address;

const holdings = [
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
  {
    symbol: "AERO",
    name: "Aerodrome",
    src: "https://assets.coingecko.com/coins/images/31745/large/token.png",
    amount: 925.348,
    value: 692.14,
    change: -4.16,
    chainId: 8453,
    networkName: "Base",
  },
];

export function ExamplePortfolio() {
  const total = holdings.reduce((sum, asset) => sum + asset.value, 0);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="border-b">
        <CardDescription>Total balance</CardDescription>
        <CardTitle className="flex items-baseline gap-2 text-2xl tabular-nums">
          {total.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
          <TokenPrice value={null} fallback={null} change={1.24} />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {holdings.map((asset) => (
          <AssetRow key={asset.symbol} {...asset} />
        ))}
      </CardContent>
    </Card>
  );
}

export function ExampleWalletHeader() {
  return (
    <Card
      size="sm"
      className="w-full max-w-md flex-row items-center justify-between gap-4 px-4"
    >
      <AddressIdentity address={WALLET} chainId={8453} />
      <TokenBalance
        amount={1.2845}
        symbol="ETH"
        fiatValue={4163.91}
        src="https://assets.coingecko.com/coins/images/279/large/ethereum.png"
      />
    </Card>
  );
}

const pools = [
  {
    name: "ETH / USDC",
    venue: "Uniswap v3",
    detail: "0.05% fee tier",
    value: 12480.55,
    change: 3.2,
    tokens: [holdings[0], holdings[1]],
  },
  {
    name: "AERO / USDC",
    venue: "Aerodrome",
    detail: "Volatile pool",
    value: 3211.08,
    change: -1.8,
    tokens: [holdings[2], holdings[1]],
  },
];

export function ExamplePoolPositions() {
  return (
    <div className="grid w-full max-w-md gap-2">
      {pools.map((pool) => (
        <Card
          key={pool.name}
          size="sm"
          className="flex-row items-center justify-between gap-4 px-3"
        >
          <div className="flex min-w-0 items-center gap-3">
            <TokenStack tokens={pool.tokens} showTooltip />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium leading-none">
                  {pool.name}
                </p>
                <Badge variant="secondary">{pool.venue}</Badge>
              </div>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {pool.detail}
              </p>
            </div>
          </div>
          <TokenPrice
            value={pool.value}
            change={pool.change}
            className="shrink-0 justify-end"
          />
        </Card>
      ))}
    </div>
  );
}
