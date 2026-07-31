"use client";

import { useState } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import { mock } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectorList } from "@/registry/onchain-ui/connector-list";
import { WalletButton } from "@/registry/onchain-ui/wallet-button";
import { ConnectWallet } from "@/registry/onchain-ui/connect-wallet";

const DEMO_ACCOUNT = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as const;

// The docs site has no wallet extension, so the live block runs against wagmi's
// mock connector. It signs nothing — the demo never builds a transaction.
const demoConfig = createConfig({
  chains: [mainnet, base],
  connectors: [mock({ accounts: [DEMO_ACCOUNT], features: {} })],
  transports: {
    [mainnet.id]: http("https://ethereum-rpc.publicnode.com"),
    [base.id]: http("https://mainnet.base.org"),
  },
});

const queryClient = new QueryClient();

export function ConnectWalletDemo() {
  return (
    <WagmiProvider config={demoConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectWallet />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

const wallets = [
  { id: "io.metamask", name: "MetaMask", description: "Installed" },
  { id: "io.rabby", name: "Rabby", description: "Installed" },
  { id: "com.coinbase.wallet", name: "Coinbase Wallet" },
];

export function ConnectorListDemo() {
  const [pendingId, setPendingId] = useState<string | null>(null);

  return (
    <div className="w-60 rounded-xl border p-1">
      <ConnectorList
        connectors={wallets}
        pendingId={pendingId}
        onSelect={(id) => {
          setPendingId(id);
          setTimeout(() => setPendingId(null), 1600);
        }}
      />
    </div>
  );
}

export function ConnectorListDemoEmpty() {
  return (
    <div className="w-60 rounded-xl border p-1">
      <ConnectorList connectors={[]} onSelect={() => {}} />
    </div>
  );
}

export function WalletButtonDemo() {
  return (
    <WalletButton
      address={DEMO_ACCOUNT}
      chainId={1}
      onClick={() => {}}
    />
  );
}

export function WalletButtonDemoStates() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <WalletButton address={DEMO_ACCOUNT} chainId={8453} size="sm" />
      <WalletButton address={DEMO_ACCOUNT} chainId={8453} />
      <WalletButton address={DEMO_ACCOUNT} showNetwork={false} />
      <WalletButton address={DEMO_ACCOUNT} chainId={1} isPending />
    </div>
  );
}
