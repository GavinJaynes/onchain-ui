"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";

const sizeClasses = {
  xs: "size-5 text-[8px]",
  sm: "size-6 text-[9px]",
  md: "size-8 text-[10px]",
  lg: "size-10 text-xs",
  xl: "size-12 text-sm",
} as const;

function EthereumMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <circle cx="16" cy="16" r="16" fill="#111827" />
      <path d="m16 5 6.5 11L16 19.75 9.5 16 16 5Z" fill="#E5E7EB" />
      <path
        d="m16 21.05 6.5-3.75L16 27l-6.5-9.7 6.5 3.75Z"
        fill="#9CA3AF"
      />
      <path d="m16 5v14.75L9.5 16 16 5Z" fill="#F9FAFB" />
    </svg>
  );
}

function BaseMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <circle cx="16" cy="16" r="16" fill="#0052FF" />
      <path d="M8.5 16h15" stroke="white" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

function OptimismMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <circle cx="16" cy="16" r="16" fill="#FF0420" />
      <path
        d="M8.25 18.95c-1.15 0-1.9-.72-1.9-1.8 0-.18.03-.42.07-.62l.28-1.35c.33-1.58 1.35-2.35 2.98-2.35h1.15c1.15 0 1.9.72 1.9 1.8 0 .18-.03.42-.07.62l-.28 1.35c-.33 1.58-1.35 2.35-2.98 2.35H8.25Zm.35-1.42h1.1c.55 0 .86-.27.98-.83l.33-1.55c.02-.1.03-.2.03-.28 0-.38-.25-.62-.68-.62h-1.1c-.55 0-.86.27-.98.83l-.33 1.55a1.5 1.5 0 0 0-.03.28c0 .38.25.62.68.62Zm5.17 1.35 1.25-5.97h3.13c1.28 0 2.03.72 2.03 1.8 0 1.55-1.02 2.58-2.68 2.58h-1.55l-.33 1.59h-1.85Zm2.45-2.93h1.37c.5 0 .8-.3.8-.83 0-.38-.23-.62-.65-.62H16.5l-.28 1.45Zm4.7 2.93 1.25-5.97h1.85l-1.25 5.97h-1.85Z"
        fill="white"
      />
    </svg>
  );
}

function ArbitrumMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <circle cx="16" cy="16" r="16" fill="#213147" />
      <path
        d="M16 5.5 25 10.7v10.6l-9 5.2-9-5.2V10.7l9-5.2Z"
        fill="#28A0F0"
      />
      <path
        d="M16 7.75 23.05 11.8v8.4L16 24.25 8.95 20.2v-8.4L16 7.75Z"
        fill="#213147"
      />
      <path d="m13.35 21.1 6.15-10.75h2.25L15.6 21.1h-2.25Z" fill="#12AAFF" />
      <path d="m10.25 21.1 6.15-10.75h2.25L12.5 21.1h-2.25Z" fill="white" />
    </svg>
  );
}

function PolygonMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <circle cx="16" cy="16" r="16" fill="#8247E5" />
      <path
        d="m20.8 12.55-3.45-2a2.7 2.7 0 0 0-2.7 0l-3.45 2a2.7 2.7 0 0 0-1.35 2.34v2.22c0 .96.52 1.84 1.35 2.34l3.45 2a2.7 2.7 0 0 0 2.7 0l3.45-2a2.7 2.7 0 0 0 1.35-2.34v-2.22a2.7 2.7 0 0 0-1.35-2.34Zm-1.1 4.56c0 .17-.1.34-.25.42L16 19.54a.48.48 0 0 1-.48 0l-3.45-2.01a.49.49 0 0 1-.25-.42v-2.22c0-.17.1-.34.25-.42l3.45-2.01a.48.48 0 0 1 .48 0l3.45 2.01c.15.08.25.25.25.42v2.22Z"
        fill="white"
      />
      <path
        d="m23.15 10.1-3.45-2a2.7 2.7 0 0 0-2.7 0l-1.6.93 2.22 1.28.72-.42a.48.48 0 0 1 .48 0l3.45 2.01c.15.08.25.25.25.42v2.22c0 .17-.1.34-.25.42l-.72.42v2.56l1.6-.93a2.7 2.7 0 0 0 1.35-2.34v-2.22a2.7 2.7 0 0 0-1.35-2.34Z"
        fill="white"
      />
    </svg>
  );
}

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

function getKnownNetworkIcon(chainId?: number | null) {
  if (chainId === 1) return <EthereumMark className="size-full" />;
  if (chainId === 10) return <OptimismMark className="size-full" />;
  if (chainId === 137) return <PolygonMark className="size-full" />;
  if (chainId === 8453) return <BaseMark className="size-full" />;
  if (chainId === 42161) return <ArbitrumMark className="size-full" />;
  return null;
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
  const [hasImageError, setHasImageError] = useState(false);
  const knownNetwork = getKnownNetwork(chainId);
  const knownIcon = getKnownNetworkIcon(chainId);
  const displayName = name ?? knownNetwork?.name ?? null;
  const displaySymbol = symbol ?? knownNetwork?.symbol ?? null;
  const shouldShowImage = Boolean(src) && !hasImageError;

  useEffect(() => {
    setHasImageError(false);
  }, [src]);

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
          src={src ?? undefined}
          alt={alt}
          className={cn("size-full object-cover", imageClassName)}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setHasImageError(true)}
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

  if (!showTooltip) return logo;

  return <Tooltip content={tooltip}>{logo}</Tooltip>;
}
