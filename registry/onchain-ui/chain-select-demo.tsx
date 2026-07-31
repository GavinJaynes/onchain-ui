"use client";

import { useState } from "react";
import { ChainSelect } from "./chain-select";

const chains = [
  { id: 1, name: "Ethereum" },
  { id: 8453, name: "Base" },
  { id: 42161, name: "Arbitrum One" },
  { id: 10, name: "Optimism" },
  { id: 137, name: "Polygon" },
];

export default function ChainSelectDemo() {
  const [chainId, setChainId] = useState<number | null>(8453);

  return (
    <div className="flex min-h-svh items-center justify-center p-8">
      <ChainSelect chains={chains} value={chainId} onSelect={setChainId} />
    </div>
  );
}
