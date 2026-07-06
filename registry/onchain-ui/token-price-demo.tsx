import { TokenPrice } from "./token-price";

export default function TokenPriceDemo() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 p-8">
      <TokenPrice value={2456.78} change={2.34} />
      <TokenPrice value={0.9998} change={-0.01} />
      <TokenPrice value={0.00000041} change={12.5} />
    </div>
  );
}
