"use client";

import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { getTokenIcon } from "@/lib/onchain/crypto-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const sizeClasses = {
  xs: "size-5 text-[9px]",
  sm: "size-6 text-[10px]",
  md: "size-8 text-xs",
  lg: "size-10 text-sm",
  xl: "size-12 text-base",
} as const;

// Pixel sizes for layouts that size marks in px rather than steps. The font
// tracks the named sizes (~3/8 of the diameter) with a floor for legibility.
// Kept as numbers for a literal style object: shadcn/lint's no-inline-styles
// cannot check a computed one.
function getPixelFontSize(size: number) {
  return Math.max(8, Math.round(size * 0.375));
}

export interface TokenLogoProps {
  /** Token image URL. Always wins over inferred icons */
  src?: string | null | undefined;
  /** Token symbol, used for alt text and fallback initials */
  symbol?: string | null | undefined;
  /** Token name, used for alt text */
  name?: string | null | undefined;
  /** Token contract address, used for icon inference and as a fallback label */
  address?: string | null | undefined;
  /** EVM chain id, used with address to infer an icon via the crypto-icons adapter */
  chainId?: number | null | undefined;
  /** Use the native-currency icon rather than the wrapped token at `address` */
  isNative?: boolean | undefined;
  /** Named size, or a diameter in pixels such as 28. Default: md */
  size?: keyof typeof sizeClasses | number | undefined;
  /** Custom fallback content when the image is missing or fails */
  fallback?: ReactNode | undefined;
  /** Show an animated tooltip. Default: false */
  showTooltip?: boolean | undefined;
  /** Tooltip content. Defaults to name, symbol, then address. */
  tooltipContent?: ReactNode | undefined;
  /**
   * `tile` draws the image on a bordered muted circle. `bare` draws it on
   * nothing, for logos that bring their own padding on a transparent canvas,
   * where a tile reads as a ring around every mark. Default: tile
   */
  variant?: "tile" | "bare" | undefined;
  /** Load the image eagerly at high priority, for logos above the fold */
  priority?: boolean | undefined;
  /** Applied to the root wrapper */
  className?: string | undefined;
  /** Applied to the image */
  imageClassName?: string | undefined;
  /** Applied to the fallback */
  fallbackClassName?: string | undefined;
}

function getFallbackText({
  address,
  name,
  symbol,
}: Pick<TokenLogoProps, "address" | "name" | "symbol">) {
  if (symbol) return symbol.slice(0, 4).toUpperCase();
  if (name) return name.slice(0, 2).toUpperCase();
  if (address) return address.slice(2, 4).toUpperCase();
  return "?";
}

export function TokenLogo({
  src,
  symbol,
  name,
  address,
  chainId,
  isNative = false,
  size = "md",
  fallback,
  showTooltip = false,
  tooltipContent,
  variant = "tile",
  priority = false,
  className,
  imageClassName,
  fallbackClassName,
}: TokenLogoProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  // Explicit src wins; otherwise ask the crypto-icons adapter.
  const inferredIcon = useMemo(
    () =>
      src ? null : getTokenIcon({ chainId, address, isNative, symbol }),
    [address, chainId, isNative, src, symbol]
  );
  const resolvedSrc =
    src ?? (typeof inferredIcon === "string" ? inferredIcon : null);
  const inferredNode =
    inferredIcon != null && typeof inferredIcon !== "string"
      ? inferredIcon
      : null;
  const shouldShowImage = Boolean(resolvedSrc) && failedSrc !== resolvedSrc;

  const alt = useMemo(() => {
    if (name && symbol) return `${name} (${symbol})`;
    return name ?? symbol ?? address ?? "Token";
  }, [address, name, symbol]);

  const tooltip = tooltipContent ?? name ?? symbol ?? address;

  // The fallback keeps its tile in every variant, so a missing logo is still
  // a visible shape.
  const bare = variant === "bare" && (shouldShowImage || inferredNode != null);
  const px = typeof size === "number" ? size : undefined;

  const logo = (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-medium text-muted-foreground",
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
          className={cn(
            "size-full",
            variant === "bare" ? "object-contain" : "object-cover",
            imageClassName
          )}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailedSrc(resolvedSrc)}
        />
      ) : inferredNode ? (
        inferredNode
      ) : (
        <span className={cn("select-none", fallbackClassName)}>
          {fallback ?? getFallbackText({ address, name, symbol })}
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
