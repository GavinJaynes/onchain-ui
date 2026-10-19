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
  /** Named size, or a diameter in pixels such as 16. Default: md */
  size?: keyof typeof sizeClasses | number | undefined;
  /**
   * `tile` draws the mark on a bordered muted circle. `bare` draws it on
   * nothing, for full-bleed brand art that should not sit in a ring. Default: tile
   */
  variant?: "tile" | "bare" | undefined;
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

// Pixel sizes follow the named steps: up to xs/sm (24px) fits three
// characters, larger fits four. The font tracks ~1/3 of the diameter.
function getMaxChars(size: keyof typeof sizeClasses | number) {
  if (typeof size !== "number") return fallbackMaxChars[size];
  return size <= 24 ? 3 : 4;
}

function getPixelFontSize(size: number) {
  return Math.max(7, Math.round(size * 0.33));
}

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
  variant = "tile",
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

  const px = typeof size === "number" ? size : undefined;
  // The fallback keeps its tile in every variant, so an unknown network is
  // still a visible shape.
  const bare = variant === "bare" && (shouldShowImage || (knownIcon != null && !fallback));

  const logo = (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-muted-foreground",
        bare ? null : "border bg-muted",
        px === undefined ? sizeClasses[size as keyof typeof sizeClasses] : null,
        className
      )}
      style={{
        width: px,
        height: px,
        fontSize: px === undefined ? undefined : getPixelFontSize(px),
      }}
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
              maxChars: getMaxChars(size),
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
