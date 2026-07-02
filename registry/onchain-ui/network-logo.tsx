"use client";

import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { getNetworkIcon } from "@/lib/onchain/crypto-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const sizeClasses = {
  xs: "size-5 text-[8px]",
  sm: "size-6 text-[9px]",
  md: "size-8 text-[10px]",
  lg: "size-10 text-xs",
  xl: "size-12 text-sm",
} as const;

const knownNetworks = {
  1: { name: "Ethereum", symbol: "ETH" },
  10: { name: "Optimism", symbol: "OP" },
  137: { name: "Polygon", symbol: "POL" },
  8453: { name: "Base", symbol: "BASE" },
  42161: { name: "Arbitrum", symbol: "ARB" },
} as const;

export interface NetworkLogoProps {
  /** EVM chain id */
  chainId?: number | null;
  /** Network image URL override */
  src?: string | null;
  /** Network name, used for alt text and fallback */
  name?: string | null;
  /** Short network symbol, used for fallback */
  symbol?: string | null;
  /** Visual size. Default: md */
  size?: keyof typeof sizeClasses;
  /** Custom fallback content for unsupported chains */
  fallback?: ReactNode;
  /** Show an animated tooltip. Default: false */
  showTooltip?: boolean;
  /** Tooltip content. Defaults to network name, symbol, then chain id */
  tooltipContent?: ReactNode;
  /** Applied to the root wrapper */
  className?: string;
  /** Applied to the image */
  imageClassName?: string;
  /** Applied to the fallback */
  fallbackClassName?: string;
}

function getKnownNetwork(chainId?: number | null) {
  if (!chainId) return null;
  return knownNetworks[chainId as keyof typeof knownNetworks] ?? null;
}

function getFallbackText({
  chainId,
  name,
  symbol,
}: Pick<NetworkLogoProps, "chainId" | "name" | "symbol">) {
  if (symbol) return symbol.slice(0, 4).toUpperCase();
  if (name) return name.slice(0, 2).toUpperCase();
  if (chainId) return String(chainId);
  return "?";
}

export function NetworkLogo({
  chainId,
  src,
  name,
  symbol,
  size = "md",
  fallback,
  showTooltip = false,
  tooltipContent,
  className,
  imageClassName,
  fallbackClassName,
}: NetworkLogoProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const knownNetwork = getKnownNetwork(chainId);

  // Explicit src wins; otherwise ask the crypto-icons adapter.
  const adapterIcon = src ? null : getNetworkIcon(chainId);
  const resolvedSrc =
    src ?? (typeof adapterIcon === "string" ? adapterIcon : null);
  const knownIcon =
    adapterIcon != null && typeof adapterIcon !== "string"
      ? adapterIcon
      : null;
  const displayName = name ?? knownNetwork?.name ?? null;
  const displaySymbol = symbol ?? knownNetwork?.symbol ?? null;
  const shouldShowImage = Boolean(resolvedSrc) && failedSrc !== resolvedSrc;

  const alt = useMemo(() => {
    if (displayName && displaySymbol) return `${displayName} (${displaySymbol})`;
    return displayName ?? displaySymbol ?? String(chainId ?? "Network");
  }, [chainId, displayName, displaySymbol]);

  const tooltip = tooltipContent ?? displayName ?? displaySymbol ?? chainId;

  const logo = (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted font-semibold text-muted-foreground",
        sizeClasses[size],
        className
      )}
    >
      {shouldShowImage ? (
        <img
          src={resolvedSrc ?? undefined}
          alt={alt}
          className={cn("size-full object-cover", imageClassName)}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailedSrc(resolvedSrc)}
        />
      ) : knownIcon && !fallback ? (
        knownIcon
      ) : (
        <span className={cn("select-none", fallbackClassName)}>
          {fallback ??
            getFallbackText({
              chainId,
              name: displayName,
              symbol: displaySymbol,
            })}
        </span>
      )}
    </span>
  );

  if (!showTooltip || tooltip == null) return logo;

  return (
    <Tooltip>
      <TooltipTrigger render={logo} />
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
