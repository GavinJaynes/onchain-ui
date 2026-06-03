"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { truncateAddress } from "@/lib/onchain/format";
import {
  resolveOnchainIdentity,
  resolveNameAvatar,
  type OnchainIdentity,
  type OnchainResolverOptions,
} from "@/lib/onchain/resolvers";
import {
  AddressDisplay,
  type AddressDisplayProps,
} from "./address-display";
import type { Address } from "viem";

export interface AddressIdentityProps
  extends Omit<AddressDisplayProps, "label" | "address"> {
  /** EVM wallet address */
  address: Address;
  /** Resolved name override, e.g. vitalik.eth or alice.base.eth */
  name?: string | null;
  /** Avatar URL override */
  avatarUrl?: string | null;
  /** Resolve ENS/Base name and avatar. Default: true */
  resolveIdentity?: boolean;
  /** Resolver client and lookup overrides */
  resolverOptions?: OnchainResolverOptions;
  /** Show avatar when available. Default: true */
  showAvatar?: boolean;
  /** Applied to the root wrapper */
  className?: string;
  /** Applied to the avatar */
  avatarClassName?: string;
  /** Applied to the identity text group */
  contentClassName?: string;
}

export function AddressIdentity({
  address,
  name,
  avatarUrl,
  resolveIdentity = true,
  resolverOptions,
  showAvatar = true,
  className,
  avatarClassName,
  contentClassName,
  truncate = true,
  truncateChars = 4,
  ...addressDisplayProps
}: AddressIdentityProps) {
  const [identity, setIdentity] = useState<OnchainIdentity | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!resolveIdentity || (name && avatarUrl)) return;

    let isMounted = true;
    setIsLoading(true);

    const identityPromise = name
      ? resolveNameAvatar(name, resolverOptions).then((avatar) => ({
          address,
          name,
          avatar,
          source: name.endsWith(".base.eth") ? "basename" : "ens",
        }) satisfies OnchainIdentity)
      : resolveOnchainIdentity(address, resolverOptions);

    setIdentity(null);

    identityPromise
      .then((result) => {
        if (isMounted) setIdentity(result);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [address, avatarUrl, name, resolveIdentity, resolverOptions]);

  const displayName = name ?? identity?.name ?? null;
  const displayAvatar = avatarUrl ?? identity?.avatar ?? null;
  const fallbackLabel = truncate
    ? truncateAddress(address, truncateChars)
    : address;
  const label = displayName ?? fallbackLabel;

  const avatarFallback = useMemo(() => {
    if (displayName) return displayName.slice(0, 2).toUpperCase();
    return address.slice(2, 4).toUpperCase();
  }, [address, displayName]);

  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      {showAvatar && (
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted text-[10px] font-medium text-muted-foreground",
            isLoading && "animate-pulse",
            avatarClassName
          )}
          aria-hidden="true"
        >
          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt=""
              className="size-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            avatarFallback
          )}
        </span>
      )}

      <AddressDisplay
        address={address}
        label={label}
        truncate={truncate}
        truncateChars={truncateChars}
        className={contentClassName}
        {...addressDisplayProps}
      />
    </div>
  );
}
