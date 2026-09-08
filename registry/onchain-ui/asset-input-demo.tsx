"use client";

import { useState } from "react";
import { AssetInput } from "./asset-input";
import { Button } from "@/components/ui/button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

const assets = {
  USDC: { decimals: 6, spendable: "1250.123456" },
  ETH: { decimals: 18, spendable: "0.249999999999999999" },
};

export default function AssetInputDemo() {
  const [symbol, setSymbol] = useState<keyof typeof assets>("USDC");
  const [value, setValue] = useState("");
  const asset = assets[symbol];

  return (
    <div className="grid w-full max-w-md gap-3">
      <AssetInput
        label="Sell"
        value={value}
        onValueChange={setValue}
        decimals={asset.decimals}
        asset={
          <NativeSelect
            aria-label="Sell asset"
            value={symbol}
            onChange={(event) => {
              setSymbol(event.target.value as keyof typeof assets);
              setValue("");
            }}
            className="max-w-full"
          >
            <NativeSelectOption value="USDC">USDC</NativeSelectOption>
            <NativeSelectOption value="ETH">ETH</NativeSelectOption>
          </NativeSelect>
        }
        description="Enter an amount to request a quote."
        footer={
          <>
            <span className="min-w-0 break-all">Available: {asset.spendable} {symbol}</span>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => setValue(asset.spendable)}
              className="ml-auto"
            >
              Max
            </Button>
          </>
        }
      />
      <p className="text-xs text-muted-foreground">Sample balances. The app supplies the picker and spendable amount.</p>
    </div>
  );
}

export function AssetInputStatesDemo() {
  const [value, setValue] = useState("1500");
  return (
    <div className="grid w-full max-w-md gap-3">
      <AssetInput
        label="Sell"
        value={value}
        onValueChange={setValue}
        decimals={6}
        asset={<span className="font-medium">USDC</span>}
        error={Number(value) > 1250 ? "Insufficient USDC balance." : undefined}
        footer="Balance: 1,250 USDC"
      />
      <AssetInput
        label="Receive (estimated)"
        value="0.42"
        readOnly
        asset={<span className="font-medium">ETH</span>}
        description="Example quote supplied by the app."
      />
      <AssetInput
        label="Deposit"
        value=""
        disabled
        asset={<Button type="button" variant="outline" disabled>Select asset</Button>}
        description="Connect your wallet to continue."
      />
    </div>
  );
}

export function AssetInputPairDemo() {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  return (
    <div className="grid w-full max-w-md gap-3">
      <AssetInput label="First deposit" value={first} onValueChange={setFirst} decimals={18} asset={<span className="font-medium">ETH</span>} />
      <AssetInput label="Second deposit" value={second} onValueChange={setSecond} decimals={6} asset={<span className="font-medium">USDC</span>} />
    </div>
  );
}
