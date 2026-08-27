"use client";

import { useConnect, useConnection, useDisconnect } from "wagmi";
import { LogOutIcon, WalletIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAvailableConnectors } from "@/hooks/use-available-connectors";
import { AddressIdentity } from "./address-identity";
import { ConnectorList } from "./connector-list";
import { WalletButton } from "./wallet-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Derived from the hook rather than wagmi's generic `Connector`: apps that
// augment `Register` get their own connector union, which the generic type is
// not assignable to.
type ProbedConnector = ReturnType<
  typeof useAvailableConnectors
>["connectors"][number];

export interface ConnectWalletProps {
  /** Label for the disconnected trigger. Default: "Connect wallet" */
  label?: string;
  /** Show the network mark on the connected pill. Default: true */
  showNetwork?: boolean;
  /** Visual size. Default: "default" */
  size?: "sm" | "default";
  /** Called when a connection attempt fails */
  onError?: (error: Error) => void;
  /** Applied to the trigger */
  className?: string;
  /** Applied to the menu */
  contentClassName?: string;
}

const triggerSizes = {
  sm: "h-7 gap-1.5 px-2 text-xs",
  default: "h-8 gap-2 px-2.5 text-[0.8rem]",
} as const;

function toOption(connector: ProbedConnector) {
  return {
    id: connector.uid,
    // wagmi names the legacy window.ethereum fallback "Injected" — wallet
    // plumbing jargon nobody picks a wallet by.
    name: connector.id === "injected" ? "Browser wallet" : connector.name,
    icon: connector.icon,
  };
}

/**
 * Connect, show, and disconnect a wallet.
 *
 * This is the wired block: it owns the wagmi calls so the pieces it composes —
 * `WalletButton`, `ConnectorList`, `AddressIdentity` — stay presentational and
 * testable with plain data. Swap any of them without touching this file.
 */
export function ConnectWallet({
  label = "Connect wallet",
  showNetwork = true,
  size = "default",
  onError,
  className,
  contentClassName,
}: ConnectWalletProps) {
  const { address, chainId, isConnected } = useConnection();
  const connect = useConnect();
  const disconnect = useDisconnect();
  const { connectors, isProbing } = useAvailableConnectors();

  const handleConnect = (connectorId: string) => {
    const connector = connectors.find((entry) => entry.uid === connectorId);
    if (!connector) return;

    connect.mutate(
      { connector },
      { onError: (error) => onError?.(error) }
    );
  };

  // `variables.connector` may be a bare CreateConnectorFn, which has no uid.
  const pendingConnector = connect.isPending
    ? connect.variables?.connector
    : undefined;
  const pendingConnectorId =
    pendingConnector && "uid" in pendingConnector ? pendingConnector.uid : null;

  const triggerClassName = cn(
    "inline-flex shrink-0 items-center rounded-lg border border-border bg-background font-medium whitespace-nowrap",
    "transition-colors duration-150 outline-none",
    "hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-50",
    triggerSizes[size],
    className
  );

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <WalletButton
              address={address}
              chainId={chainId}
              showNetwork={showNetwork}
              size={size}
              className={className}
            />
          }
        />
        <DropdownMenuContent
          align="end"
          className={cn("w-56", contentClassName)}
        >
          <div className="px-2 py-1.5">
            <AddressIdentity address={address} chainId={chainId} />
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => disconnect.mutate()}>
            <LogOutIcon />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Exactly one wallet: a menu of one is a worse click than connecting.
  if (!isProbing && connectors.length === 1) {
    return (
      <button
        type="button"
        disabled={connect.isPending}
        onClick={() => handleConnect(connectors[0].uid)}
        className={triggerClassName}
      >
        <WalletIcon className="size-4" aria-hidden="true" />
        {connect.isPending ? "Connecting…" : label}
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isProbing || connect.isPending}
        className={triggerClassName}
      >
        <WalletIcon className="size-4" aria-hidden="true" />
        {connect.isPending ? "Connecting…" : label}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={cn("w-60", contentClassName)}>
        <ConnectorList
          connectors={connectors.map(toOption)}
          onSelect={handleConnect}
          pendingId={pendingConnectorId}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
