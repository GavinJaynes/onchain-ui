import { TokenPrice } from "@/registry/onchain-ui/token-price";

export function TokenPriceDemo() {
  return <TokenPrice value={3241.82} change={2.41} />;
}

export function TokenPriceDemoChanges() {
  return (
    <div className="grid gap-3">
      <TokenPrice value={3241.82} change={2.41} />
      <TokenPrice value={0.9978} change={-0.12} />
      <TokenPrice value={1} change={0} />
    </div>
  );
}

export function TokenPriceDemoSmallValues() {
  return (
    <div className="grid gap-3">
      <TokenPrice value={0.9978} change={0.02} />
      <TokenPrice value={0.034567} change={-4.16} />
      <TokenPrice value={0.00012891} change={12.08} />
    </div>
  );
}

export function TokenPriceDemoCompact() {
  return <TokenPrice value={1234567.89} change={8.24} compact />;
}

export function TokenPriceDemoCustom() {
  return (
    <TokenPrice
      value={184.42}
      change={-3.18}
      className="rounded-md border bg-card px-3 py-2"
      priceClassName="text-lg font-semibold"
      changeClassName="rounded-sm bg-red-500/10 px-1.5 py-0.5"
    />
  );
}
