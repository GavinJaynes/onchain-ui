"use client";

import { toast } from "sonner";
import { CopyIcon, ExternalLinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { truncateAddress } from "@/lib/onchain/format";
import type { Address } from "viem";
import type { ReactNode } from "react";

export interface AddressDisplayProps {
  /** EVM wallet address */
  address: Address;
  /** Display label. The copied value is always the underlying address. */
  label?: ReactNode;
  /** Applied to the root wrapper */
  className?: string;
  /** Applied to the address text or copy trigger */
  addressClassName?: string;
  /** Truncate the address. Default: true */
  truncate?: boolean;
  /** Number of characters to show at each end when truncated. Default: 4 */
  truncateChars?: number;
  /** Show copy-to-clipboard button. Default: true */
  showCopy?: boolean;
  /** Show block explorer link. Default: true */
  showExplorer?: boolean;
  /** Full explorer URL e.g. "https://basescan.org/address/0x..." */
  explorerUrl?: string;
  /** Icon rendered before the address when copy is enabled */
  copyIcon?: ReactNode;
  /** Icon rendered for the explorer link */
  explorerIcon?: ReactNode;
}

export function AddressDisplay({
  address,
  label,
  className,
  addressClassName,
  truncate = true,
  truncateChars = 4,
  showCopy = true,
  showExplorer = true,
  explorerUrl,
  copyIcon = <CopyIcon className="size-3 shrink-0" />,
  explorerIcon = <ExternalLinkIcon className="size-3 shrink-0" />,
}: AddressDisplayProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied");
  };

  const href = explorerUrl ?? `https://etherscan.io/address/${address}`;
  const displayLabel =
    label ?? (truncate ? truncateAddress(address, truncateChars) : address);
  const labelClassName = truncate ? "whitespace-nowrap" : "break-all";

  return (
    <div className={cn("flex min-w-0 items-center gap-1.5", className)}>
      {showCopy ? (
        <button
          type="button"
          onClick={handleCopy}
          title="Copy address"
          className={cn(
            "flex min-w-0 items-center gap-1.5 font-mono text-xs text-muted-foreground",
            "hover:text-foreground cursor-copy transition-colors duration-150",
            addressClassName
          )}
        >
          {copyIcon}
          <span className={labelClassName}>{displayLabel}</span>
        </button>
      ) : (
        <span
          className={cn(
            "min-w-0 font-mono text-xs text-muted-foreground",
            labelClassName,
            addressClassName
          )}
        >
          {displayLabel}
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
          {explorerIcon}
        </a>
      )}
    </div>
  );
}
