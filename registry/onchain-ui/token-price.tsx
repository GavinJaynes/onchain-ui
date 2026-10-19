import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  parseNumericValue,
  type NumericValue,
} from "@/lib/onchain/format";
import type { ReactNode } from "react";

type PriceValue = NumericValue;
type Trend = "down" | "neutral" | "up";

// `positive` and `negative` are theme tokens, like `destructive`: the registry
// item adds `--positive` and `--negative` to your CSS for light and dark mode
// (keeping any values you already define), so you retheme gains and losses in
// your stylesheet rather than here.
const trendClasses = {
  down: "text-negative",
  neutral: "text-muted-foreground",
  up: "text-positive",
} as const;

export interface TokenPriceProps {
  /** Token price value */
  value: PriceValue;
  /** ISO 4217 currency code. Default: USD */
  currency?: string | undefined;
  /** Locale passed to Intl.NumberFormat */
  locale?: string | undefined;
  /** Use compact notation, e.g. $3.2K */
  compact?: boolean | undefined;
  /** Value shown when price is null, undefined, empty, or invalid. Default: -- */
  fallback?: ReactNode | undefined;
  /** Minimum fraction digits for the price */
  minimumFractionDigits?: number | undefined;
  /** Maximum fraction digits for the price */
  maximumFractionDigits?: number | undefined;
  /** 24h-style percentage change, e.g. -2.34 means -2.34% */
  change?: number | null | undefined;
  /** Override the derived change direction */
  trend?: Trend | undefined;
  /** Show trend icon before the change. Default: true */
  showChangeIcon?: boolean | undefined;
  /** Fraction digits for the change value. Default: 2 */
  changeFractionDigits?: number | undefined;
  /** Hide the plus sign for positive changes. Default: false */
  hidePositiveSign?: boolean | undefined;
  /**
   * Formats the price instead of Intl.NumberFormat, for apps with a house
   * number style. Receives the parsed number; currency, locale, compact and
   * the fraction digit props are then unused.
   */
  format?: ((value: number) => ReactNode) | undefined;
  /**
   * Formats the change instead of the default "+2.34%". Receives `change` as
   * passed, so an app that stores fractions (0.0234) can format them itself.
   */
  formatChange?: ((change: number) => ReactNode) | undefined;
  /** Applied to the root wrapper */
  className?: string | undefined;
  /** Applied to the formatted price */
  priceClassName?: string | undefined;
  /** Applied to the change badge */
  changeClassName?: string | undefined;
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
  locale?: string | undefined;
  maximumFractionDigits?: number | undefined;
  minimumFractionDigits?: number | undefined;
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

function formatPercent(
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
  format,
  formatChange,
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
          : format
            ? format(parsedValue)
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
          {formatChange
            ? formatChange(change)
            : formatPercent(change, changeFractionDigits, hidePositiveSign)}
        </span>
      )}
    </span>
  );
}
