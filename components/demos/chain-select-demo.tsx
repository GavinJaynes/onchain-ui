"use client";

import { useState } from "react";
import { ChainSelect } from "@/registry/onchain-ui/chain-select";

const chains = [
  { id: 1, name: "Ethereum" },
  { id: 8453, name: "Base" },
  { id: 42161, name: "Arbitrum One" },
  { id: 10, name: "Optimism" },
  { id: 137, name: "Polygon" },
];

export function ChainSelectDemo() {
  const [chainId, setChainId] = useState<number | null>(8453);

  return <ChainSelect chains={chains} value={chainId} onSelect={setChainId} />;
}

export function ChainSelectDemoUnsupported() {
  // 5315 is a real chain (Uzmi Network) that this app does not support — the
  // state a wallet lands in after switching networks outside the app.
  const [chainId, setChainId] = useState<number | null>(5315);

  return <ChainSelect chains={chains} value={chainId} onSelect={setChainId} />;
}

export function ChainSelectDemoDisconnected() {
  const [chainId, setChainId] = useState<number | null>(null);

  return <ChainSelect chains={chains} value={chainId} onSelect={setChainId} />;
}

export function ChainSelectDemoPending() {
  return (
    <ChainSelect
      chains={chains}
      value={8453}
      pendingChainId={42161}
      onSelect={() => {}}
    />
  );
}

export function ChainSelectDemoSizes() {
  const [chainId, setChainId] = useState<number | null>(1);

  return (
    <div className="flex items-center gap-3">
      <ChainSelect
        chains={chains}
        value={chainId}
        onSelect={setChainId}
        size="sm"
      />
      <ChainSelect chains={chains} value={chainId} onSelect={setChainId} />
      <ChainSelect
        chains={chains}
        value={chainId}
        onSelect={setChainId}
        showLabel={false}
      />
    </div>
  );
}
