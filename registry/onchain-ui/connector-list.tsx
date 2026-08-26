"use client";

import { LoaderCircleIcon, WalletIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface ConnectorOption {
  /** Stable connector id, passed back to `onSelect` */
  id: string;
  /** Wallet name, e.g. "MetaMask" */
  name: string;
  /** Wallet icon. EIP-6963 wallets announce a data URI */
  icon?: string | null;
  /** Secondary line, e.g. "Installed" or "Scan with your phone" */
  description?: ReactNode;
  /** Render but do not allow selection */
  disabled?: boolean;
}

export interface ConnectorListProps {
  /** Wallets the user can pick from */
  connectors: Array<ConnectorOption>;
  /** Called with the id of the wallet the user picked */
  onSelect: (connectorId: string) => void;
  /** Connector currently being connected. Blocks further selection */
  pendingId?: string | null;
  /** Disable every row */
  disabled?: boolean;
  /** Shown when `connectors` is empty */
  emptyMessage?: ReactNode;
  /** Applied to the list wrapper */
  className?: string;
  /** Applied to each row */
  itemClassName?: string;
}

function ConnectorIcon({ connector }: { connector: ConnectorOption }) {
  if (connector.icon) {
    return (
      <img
        src={connector.icon}
        alt=""
        className="size-5 shrink-0 rounded"
        aria-hidden="true"
      />
    );
  }
  return <WalletIcon className="size-5 shrink-0 text-muted-foreground" />;
}

export function ConnectorList({
  connectors,
  onSelect,
  pendingId,
  disabled = false,
  emptyMessage = "No compatible wallet connection is available on this device.",
  className,
  itemClassName,
}: ConnectorListProps) {
  if (connectors.length === 0) {
    return (
      <p
        className={cn(
          "px-2 py-6 text-center text-xs text-balance text-muted-foreground",
          className
        )}
      >
        {emptyMessage}
      </p>
    );
  }

  const isPending = pendingId != null;

  return (
    <div className={cn("grid gap-0.5", className)}>
      {connectors.map((connector) => (
        <button
          key={connector.id}
          type="button"
          disabled={disabled || connector.disabled || isPending}
          onClick={() => onSelect(connector.id)}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm",
            "transition-colors duration-150 outline-none",
            "hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:pointer-events-none disabled:opacity-50",
            itemClassName
          )}
        >
          <ConnectorIcon connector={connector} />

          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium">{connector.name}</span>
            {connector.description && (
              <span className="block truncate text-xs text-muted-foreground">
                {connector.description}
              </span>
            )}
          </span>

          {pendingId === connector.id && (
            <LoaderCircleIcon
              className="size-4 shrink-0 animate-spin text-muted-foreground"
              aria-hidden="true"
            />
          )}
        </button>
      ))}
    </div>
  );
}
