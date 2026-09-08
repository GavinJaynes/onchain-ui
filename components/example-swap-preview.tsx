"use client";

import { useState } from "react";
import { ArrowDown } from "lucide-react";
import { formatUnits, parseUnits } from "viem";

import { Button } from "@/components/ui/button";
import { AssetInput } from "@/registry/onchain-ui/asset-input";
import { NetworkLogo } from "@/registry/onchain-ui/network-logo";
import { TokenLogo } from "@/registry/onchain-ui/token-logo";

const EXAMPLE_BALANCE = "1.5";

export function ExampleSwapPreview() {
  const [amount, setAmount] = useState("0.25");
  // Keep the preview exact in base units; the fixed rate is illustrative.
  const received = amount === "" || amount === "."
    ? ""
    : formatUnits(
        (parseUnits(amount, 18) * BigInt(2500)) / BigInt(10 ** 12),
        6,
      );

  return (
    <div className="flex min-w-0 flex-col justify-center bg-[radial-gradient(ellipse_at_top,var(--accent),transparent_75%)] p-5 sm:p-10">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-5 flex items-center justify-between gap-3">
          <p className="text-sm font-medium">Try the inputs</p>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <NetworkLogo chainId={1} size="xs" />
            Ethereum
          </span>
        </div>
        <AssetInput
          label="Sell"
          value={amount}
          onValueChange={setAmount}
          decimals={18}
          asset={
            <span className="flex items-center gap-2 font-medium">
              <TokenLogo chainId={1} isNative symbol="ETH" size="sm" />
              ETH
            </span>
          }
          footer={
            <>
              <span>Example balance: {EXAMPLE_BALANCE} ETH</span>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                className="ml-auto"
                onClick={() => setAmount(EXAMPLE_BALANCE)}
              >
                Max
              </Button>
            </>
          }
          className="bg-background/80"
        />
        <div className="flex justify-center py-2" aria-hidden="true">
          <ArrowDown className="size-4 text-muted-foreground" />
        </div>
        <AssetInput
          label="Receive (example)"
          value={received}
          readOnly
          asset={
            <span className="flex items-center gap-2 font-medium">
              <TokenLogo
                chainId={1}
                address="0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                symbol="USDC"
                size="sm"
              />
              USDC
            </span>
          }
          description="Illustrative rate: 1 ETH = 2,500 USDC."
          className="bg-background/80"
        />
        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          Edit the amount or try Max. Explore live pricing and wallet connection
          in the full example app.
        </p>
      </div>
    </div>
  );
}
