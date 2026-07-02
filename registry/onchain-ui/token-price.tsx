import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  parseNumericValue,
  type NumericValue,
} from "@/lib/onchain/format";
import type { ReactNode } from "react";

type PriceValue = NumericValue;
type Trend = "down" | "neutral" | "up";

const trendClasses = {
  down: "text-red-600 dark:text-red-400",
  neutral: "text-muted-foreground",
  up: "text-emerald-600 dark:text-emerald-400",
} as const;

export interface TokenPriceProps {
  /** Token price value */
  value: PriceValue;
  /** ISO 4217 currency code. Default: USD */
  currency?: string;
  /** Locale passed to Intl.NumberFormat */
  locale?: string;
  /** Use compact notation, e.g. $3.2K */
  compact?: boolean;
  /** Value shown when price is null, undefined, empty, or invalid. Default: -- */
  fallback?: ReactNode;
  /** Minimum fraction digits for the price */
  minimumFractionDigits?: number;
  /** Maximum fraction digits for the price */
  maximumFractionDigits?: number;
  /** 24h-style percentage change, e.g. -2.34 means -2.34% */
  change?: number | null;
  /** Override the derived change direction */
  trend?: Trend;
  /** Show trend icon before the change. Default: true */
  showChangeIcon?: boolean;
  /** Fraction digits for the change value. Default: 2 */
  changeFractionDigits?: number;
  /** Hide the plus sign for positive changes. Default: false */
  hidePositiveSign?: boolean;
  /** Applied to the root wrapper */
  className?: string;
  /** Applied to the formatted price */
  priceClassName?: string;
  /** Applied to the change badge */
  changeClassName?: string;
}

function getMaximumFractionDigits(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1) return 2;
  if (abs >= 0.01) return 4;
  return 6;
}

function formatPrice({
  compact,
  currency,
  locale,
  maximumFractionDigits,
  minimumFractionDigits,
  value,
}: {
  compact: boolean;
  currency: string;
  locale?: string;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  value: number;
}) {
  const abs = Math.abs(value);
  const hasExplicitDigits =
    maximumFractionDigits !== undefined || minimumFractionDigits !== undefined;

  // Sub-cent prices round to $0.00 with fraction digits; keep the leading
  // significant figures instead, e.g. $0.00000041.
  if (!hasExplicitDigits && abs > 0 && abs < 0.01) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      notation: compact ? "compact" : "standard",
      maximumSignificantDigits: 2,
    }).format(value);
  }

  const resolvedMaximumFractionDigits =
    maximumFractionDigits ?? getMaximumFractionDigits(value);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    notation: compact ? "compact" : "standard",
    minimumFractionDigits,
    // Intl.NumberFormat throws a RangeError when min > max
    maximumFractionDigits: Math.max(
      resolvedMaximumFractionDigits,
      minimumFractionDigits ?? 0
    ),
  }).format(value);
}

function getTrend(change?: number | null): Trend {
  if (!change) return "neutral";
  return change > 0 ? "up" : "down";
}

function formatChange(
  change: number,
  fractionDigits: number,
  hidePositiveSign: boolean
) {
  const sign = change > 0 && !hidePositiveSign ? "+" : "";
  return `${sign}${change.toFixed(fractionDigits)}%`;
}

function TrendIcon({ trend }: { trend: Trend }) {
  if (trend === "up") return <ArrowUpIcon className="size-3" />;
  if (trend === "down") return <ArrowDownIcon className="size-3" />;
  return <MinusIcon className="size-3" />;
}

export function TokenPrice({
  value,
  currency = "USD",
  locale,
  compact = false,
  fallback = "--",
  minimumFractionDigits,
  maximumFractionDigits,
  change,
  trend,
  showChangeIcon = true,
  changeFractionDigits = 2,
  hidePositiveSign = false,
  className,
  priceClassName,
  changeClassName,
}: TokenPriceProps) {
  const parsedValue = parseNumericValue(value);
  const shouldShowChange = typeof change === "number" && Number.isFinite(change);
  const derivedTrend = trend ?? getTrend(change);

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className={cn("font-mono tabular-nums", priceClassName)}>
        {parsedValue === null
          ? fallback
          : formatPrice({
              compact,
              currency,
              locale,
              maximumFractionDigits,
              minimumFractionDigits,
              value: parsedValue,
            })}
      </span>

      {shouldShowChange && (
        <span
          className={cn(
            "inline-flex items-center gap-0.5 font-mono text-xs tabular-nums",
            trendClasses[derivedTrend],
            changeClassName
          )}
        >
          {showChangeIcon && <TrendIcon trend={derivedTrend} />}
          {formatChange(change, changeFractionDigits, hidePositiveSign)}
        </span>
      )}
    </span>
  );
}
