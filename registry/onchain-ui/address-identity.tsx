"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  name?: string | null | undefined;
  /** Avatar URL override */
  avatarUrl?: string | null | undefined;
  /** Resolve ENS/Base name and avatar. Default: true */
  resolveIdentity?: boolean | undefined;
  /** Resolver client and lookup overrides */
  resolverOptions?: OnchainResolverOptions | undefined;
  /** Show avatar when available. Default: true */
  showAvatar?: boolean | undefined;
  /** Applied to the root wrapper */
  className?: string | undefined;
  /** Applied to the avatar */
  avatarClassName?: string | undefined;
  /** Applied to the identity text group */
  contentClassName?: string | undefined;
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
  const identityKey = `${address}:${name ?? ""}:${avatarUrl ?? ""}:${resolveIdentity}`;
  const [resolvedIdentity, setResolvedIdentity] = useState<{
    key: string;
    identity: OnchainIdentity;
  } | null>(null);
  const [avatarFailure, setAvatarFailure] = useState<{
    src: string;
    attempts: number;
  } | null>(null);

  // Read resolver options through a ref so inline object literals don't
  // retrigger resolution on every render.
  const resolverOptionsRef = useRef(resolverOptions);
  useEffect(() => {
    resolverOptionsRef.current = resolverOptions;
  });

  useEffect(() => {
    if (!resolveIdentity || (name && avatarUrl)) return;

    let isMounted = true;
    const options = resolverOptionsRef.current;

    const identityPromise = name
      ? resolveNameAvatar(name, options).then((avatar) => ({
          address,
          name,
          avatar,
          source: name.endsWith(".base.eth") ? "basename" : "ens",
        }) satisfies OnchainIdentity)
      : resolveOnchainIdentity(address, options);

    identityPromise
      .then((result) => {
        if (isMounted) {
          setResolvedIdentity({ key: identityKey, identity: result });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [address, avatarUrl, identityKey, name, resolveIdentity]);

  const activeIdentity =
    resolvedIdentity?.key === identityKey ? resolvedIdentity.identity : null;
  const displayName = name ?? activeIdentity?.name ?? null;
  const resolvedAvatar = avatarUrl ?? activeIdentity?.avatar ?? null;
  const displayAvatar =
    resolvedAvatar !== null &&
    !(avatarFailure?.src === resolvedAvatar && avatarFailure.attempts >= 2)
      ? resolvedAvatar
      : null;
  const isLoading =
    resolveIdentity && !(name && avatarUrl) && activeIdentity === null;
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
              key={`${displayAvatar}:${avatarFailure?.src === displayAvatar ? avatarFailure.attempts : 0}`}
              src={displayAvatar}
              alt=""
              className="size-full object-cover"
              referrerPolicy="no-referrer"
              onError={() =>
                setAvatarFailure((failure) => ({
                  src: displayAvatar,
                  attempts:
                    failure?.src === displayAvatar ? failure.attempts + 1 : 1,
                }))
              }
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
