"use client";

import { AddressDisplay } from "@/registry/onchain-ui/address-display";

const DEMO_ADDRESS = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

export function AddressDisplayDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-xs text-muted-foreground mb-1">Default</p>
        <AddressDisplay address={DEMO_ADDRESS} />
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <p className="text-xs text-muted-foreground mb-1">Base explorer</p>
        <AddressDisplay
          address={DEMO_ADDRESS}
          explorerUrl={`https://basescan.org/address/${DEMO_ADDRESS}`}
        />
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <p className="text-xs text-muted-foreground mb-1">Full address, no explorer</p>
        <AddressDisplay
          address={DEMO_ADDRESS}
          truncate={false}
          showExplorer={false}
        />
      </div>
    </div>
  );
}
