"use client";

import { ChevronDownIcon, LoaderCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddressIdentity } from "./address-identity";
import { NetworkLogo } from "./network-logo";
import type { Address } from "viem";
import type { ComponentProps } from "react";

export interface WalletButtonProps
  // `name` is the resolved account name, not the button's form name.
  extends Omit<ComponentProps<"button">, "name"> {
  /** Connected wallet address */
  address: Address;
  /** Connected chain id. Renders a network mark when set */
  chainId?: number | null | undefined;
  /** Resolved name override, e.g. vitalik.eth. Skips resolution when set */
  name?: string | null | undefined;
  /** Avatar URL override */
  avatarUrl?: string | null | undefined;
  /** Show a spinner in place of the chevron */
  isPending?: boolean | undefined;
  /** Show the network mark. Default: true */
  showNetwork?: boolean | undefined;
  /** Show the trailing chevron. Default: true */
  showChevron?: boolean | undefined;
  /** Visual size. Default: "default" */
  size?: "sm" | "default" | undefined;
}

const buttonSizes = {
  sm: "h-7 gap-1.5 py-0.5 pr-1.5 pl-1",
  default: "h-8 gap-2 py-1 pr-2 pl-1.5",
} as const;

const avatarSizes = {
  sm: "size-5",
  default: "size-6",
} as const;

/**
 * The connected-wallet pill: identity, network, and a disclosure chevron.
 *
 * It renders a plain button and forwards every prop, so it drops straight into
 * a menu trigger (`<DropdownMenuTrigger render={<WalletButton … />} />`) or
 * takes an `onClick` of its own.
 */
export function WalletButton({
  address,
  chainId,
  name,
  avatarUrl,
  isPending = false,
  showNetwork = true,
  showChevron = true,
  size = "default",
  className,
  ...props
}: WalletButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex shrink-0 items-center rounded-lg border border-border bg-background",
        "transition-colors duration-150 outline-none",
        "hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:opacity-50",
        buttonSizes[size],
        className
      )}
      {...props}
    >
      <AddressIdentity
        address={address}
        name={name}
        avatarUrl={avatarUrl}
        // The whole pill is the click target; the copy and explorer controls
        // would be nested interactive elements inside it.
        showCopy={false}
        showExplorer={false}
        avatarClassName={avatarSizes[size]}
        className="pointer-events-none"
      />

      {showNetwork && chainId != null && (
        <NetworkLogo chainId={chainId} size="xs" />
      )}

      {isPending ? (
        <LoaderCircleIcon
          className="size-3.5 animate-spin text-muted-foreground"
          aria-hidden="true"
        />
      ) : (
        showChevron && (
          <ChevronDownIcon
            className="size-3.5 text-muted-foreground"
            aria-hidden="true"
          />
        )
      )}
    </button>
  );
}
