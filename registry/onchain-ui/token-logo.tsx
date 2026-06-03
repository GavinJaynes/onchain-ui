"use client";

import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";

const sizeClasses = {
  xs: "size-5 text-[9px]",
  sm: "size-6 text-[10px]",
  md: "size-8 text-xs",
  lg: "size-10 text-sm",
  xl: "size-12 text-base",
} as const;

export interface TokenLogoProps {
  /** Token image URL */
  src?: string | null;
  /** Token symbol, used for alt text and fallback initials */
  symbol?: string | null;
  /** Token name, used for alt text */
  name?: string | null;
  /** Token contract address, used as a fallback label */
  address?: string | null;
  /** Visual size. Default: md */
  size?: keyof typeof sizeClasses;
  /** Custom fallback content when the image is missing or fails */
  fallback?: ReactNode;
  /** Show an animated tooltip. Default: false */
  showTooltip?: boolean;
  /** Tooltip content. Defaults to name, symbol, then address. */
  tooltipContent?: ReactNode;
  /** Applied to the root wrapper */
  className?: string;
  /** Applied to the image */
  imageClassName?: string;
  /** Applied to the fallback */
  fallbackClassName?: string;
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
  size = "md",
  fallback,
  showTooltip = false,
  tooltipContent,
  className,
  imageClassName,
  fallbackClassName,
}: TokenLogoProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const shouldShowImage = Boolean(src) && !hasImageError;

  const alt = useMemo(() => {
    if (name && symbol) return `${name} (${symbol})`;
    return name ?? symbol ?? address ?? "Token";
  }, [address, name, symbol]);

  const tooltip = tooltipContent ?? name ?? symbol ?? address;

  const logo = (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted font-medium text-muted-foreground",
        sizeClasses[size],
        className
      )}
    >
      {shouldShowImage ? (
        <img
          src={src ?? undefined}
          alt={alt}
          className={cn("size-full object-cover", imageClassName)}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setHasImageError(true)}
        />
      ) : (
        <span className={cn("select-none", fallbackClassName)}>
          {fallback ?? getFallbackText({ address, name, symbol })}
        </span>
      )}
    </span>
  );

  if (!showTooltip) return logo;

  return <Tooltip content={tooltip}>{logo}</Tooltip>;
}
