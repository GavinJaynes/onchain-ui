"use client";

import { AddressDisplay } from "@/registry/onchain-ui/address-display";

const ADDR = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

export function AddressDisplayDemo() {
  return <AddressDisplay address={ADDR} />;
}

export function AddressDisplayDemoBase() {
  return <AddressDisplay address={ADDR} chainId={8453} />;
}

export function AddressDisplayDemoFull() {
  return (
    <AddressDisplay
      address={ADDR}
      truncate={false}
      showExplorer={false}
    />
  );
}

export function AddressDisplayDemoCopyOnly() {
  return <AddressDisplay address={ADDR} showExplorer={false} />;
}
