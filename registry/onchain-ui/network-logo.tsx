"use client";

import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { getNetworkIcon } from "@/lib/onchain/crypto-icons";
import { getNetworkMeta } from "@/lib/onchain/config";
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

export interface NetworkLogoProps {
  /** EVM chain id */
  chainId?: number | null | undefined;
  /** Network image URL override */
  src?: string | null | undefined;
  /** Network name, used for alt text and fallback */
  name?: string | null | undefined;
  /** Short network symbol, used for fallback */
  symbol?: string | null | undefined;
  /** Visual size. Default: md */
  size?: keyof typeof sizeClasses | undefined;
  /** Custom fallback content for unsupported chains */
  fallback?: ReactNode | undefined;
  /** Show an animated tooltip. Default: false */
  showTooltip?: boolean | undefined;
  /** Tooltip content. Defaults to network name, symbol, then chain id */
  tooltipContent?: ReactNode | undefined;
  /** Applied to the root wrapper */
  className?: string | undefined;
  /** Applied to the image */
  imageClassName?: string | undefined;
  /** Applied to the fallback */
  fallbackClassName?: string | undefined;
}

// How many characters fit inside the circle at each size, measured rather than
// derived: the font and the circle do not grow in step, so the limit is not a
// constant ratio. Values leave ~20% slack so glyphs never touch the border.
const fallbackMaxChars = {
  xs: 3,
  sm: 3,
  md: 4,
  lg: 4,
  xl: 4,
} as const;

function getFallbackText({
  chainId,
  name,
  symbol,
  maxChars,
}: Pick<NetworkLogoProps, "chainId" | "name" | "symbol"> & {
  maxChars: number;
}) {
  if (symbol) return symbol.slice(0, Math.min(4, maxChars)).toUpperCase();
  if (name) return name.slice(0, 2).toUpperCase();
  // A chain id is only shown when it fits whole. Truncating one produces a
  // different, real-looking chain id, which is worse than admitting we do not
  // recognise the network — the full id stays in `alt` and the tooltip.
  if (chainId != null) {
    const id = String(chainId);
    if (id.length <= maxChars) return id;
  }
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
  const knownNetwork = getNetworkMeta(chainId);

  // Explicit src wins; otherwise ask the crypto-icons adapter.
  const adapterIcon = src ? null : getNetworkIcon(chainId);
  const resolvedSrc =
    src ?? (typeof adapterIcon === "string" ? adapterIcon : null);
  const knownIcon =
    adapterIcon != null && typeof adapterIcon !== "string"
      ? adapterIcon
      : null;
  const displayName = name ?? knownNetwork.name;
  const displaySymbol = symbol ?? knownNetwork.symbol;
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
              maxChars: fallbackMaxChars[size],
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
