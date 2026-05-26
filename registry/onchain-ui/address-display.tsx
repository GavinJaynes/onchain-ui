"use client";

import { toast } from "sonner";
import { CopyIcon, ExternalLinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Address } from "viem";

function truncateAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

interface AddressDisplayProps {
  /** EVM wallet address */
  address: Address;
  className?: string;
  /** Truncate the address. Default: true */
  truncate?: boolean;
  /** Number of trailing chars to show when truncated. Default: 4 */
  truncateChars?: number;
  /** Show copy-to-clipboard button. Default: true */
  showCopy?: boolean;
  /** Show block explorer link. Default: true */
  showExplorer?: boolean;
  /** Full explorer URL e.g. "https://basescan.org/address/0x..." */
  explorerUrl?: string;
}

export function AddressDisplay({
  address,
  className,
  truncate = true,
  truncateChars = 4,
  showCopy = true,
  showExplorer = true,
  explorerUrl,
}: AddressDisplayProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied");
  };

  const href = explorerUrl ?? `https://etherscan.io/address/${address}`;
  const label = truncate ? truncateAddress(address, truncateChars) : address;

  return (
    <div className="flex items-center gap-1.5">
      {showCopy ? (
        <button
          type="button"
          onClick={handleCopy}
          title="Copy address"
          className={cn(
            "flex items-center gap-1.5 font-mono text-xs text-muted-foreground",
            "hover:text-foreground cursor-copy transition-colors duration-150",
            className
          )}
        >
          <CopyIcon className="size-3 shrink-0" />
          {label}
        </button>
      ) : (
        <span className={cn("font-mono text-xs text-muted-foreground", className)}>
          {label}
        </span>
      )}

      {showExplorer && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title="View on explorer"
          className="text-muted-foreground hover:text-foreground transition-colors duration-150"
        >
          <ExternalLinkIcon className="size-3 shrink-0" />
        </a>
      )}
    </div>
  );
}
