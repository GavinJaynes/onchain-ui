"use client";

import { toast } from "sonner";
import { CopyIcon, ExternalLinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { truncateAddress } from "@/lib/onchain/format";
import { getDefaultChainId, getExplorerUrl } from "@/lib/onchain/config";
import type { Address } from "viem";
import type { ReactNode } from "react";

export interface AddressDisplayProps {
  /** EVM wallet address */
  address: Address;
  /** Display label. The copied value is always the underlying address. */
  label?: ReactNode | undefined;
  /** Applied to the root wrapper */
  className?: string | undefined;
  /** Applied to the address text or copy trigger */
  addressClassName?: string | undefined;
  /** Truncate the address. Default: true */
  truncate?: boolean | undefined;
  /** Number of characters to show at each end when truncated. Default: 4 */
  truncateChars?: number | undefined;
  /** Show copy-to-clipboard button. Default: true */
  showCopy?: boolean | undefined;
  /** Show block explorer link. Default: true */
  showExplorer?: boolean | undefined;
  /** EVM chain id used to pick a known block explorer. Default: onchainConfig.defaultChainId, else 1 */
  chainId?: number | null | undefined;
  /** Full explorer URL override e.g. "https://basescan.org/address/0x..." */
  explorerUrl?: string | undefined;
  /** Icon rendered before the address when copy is enabled */
  copyIcon?: ReactNode | undefined;
  /** Icon rendered for the explorer link */
  explorerIcon?: ReactNode | undefined;
  /** Type size of the address. Default: xs */
  size?: keyof typeof sizeClasses | undefined;
}

// A variant rather than a className override, so the address can match a
// dense table or the sentence around it.
const sizeClasses = { "2xs": "text-[0.625rem]", xs: "text-xs", sm: "text-sm" } as const;

export function AddressDisplay({
  address,
  label,
  className,
  addressClassName,
  truncate = true,
  truncateChars = 4,
  showCopy = true,
  showExplorer = true,
  chainId,
  explorerUrl,
  copyIcon = <CopyIcon className="size-3 shrink-0" />,
  explorerIcon = <ExternalLinkIcon className="size-3 shrink-0" />,
  size = "xs",
}: AddressDisplayProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      toast.success("Address copied");
    } catch {
      toast.error("Could not copy address");
    }
  };

  // No chain id means the configured default (mainnet unless set). A chain id we
  // do not recognise is different: linking it to Etherscan would point at a
  // page about a different chain's address space. Drop the link instead and
  // let `explorerUrl` cover the long tail.
  const explorerBase = getExplorerUrl(chainId ?? getDefaultChainId());
  const href =
    explorerUrl ??
    (explorerBase ? `${explorerBase}/address/${address}` : null);
  const displayLabel =
    label ?? (truncate ? truncateAddress(address, truncateChars) : address);
  const labelClassName = truncate ? "whitespace-nowrap" : "break-all";

  return (
    // A span, so the address can sit inside a sentence or a table cell's text
    // (a div is invalid inside <p>).
    <span className={cn("inline-flex min-w-0 items-center gap-1.5", className)}>
      {showCopy ? (
        <button
          type="button"
          onClick={handleCopy}
          title="Copy address"
          className={cn(
            "flex min-w-0 items-center gap-1.5 font-mono text-muted-foreground",
            sizeClasses[size],
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
            "min-w-0 font-mono text-muted-foreground",
            sizeClasses[size],
            labelClassName,
            addressClassName
          )}
        >
          {displayLabel}
        </span>
      )}

      {showExplorer && href && (
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
    </span>
  );
}
