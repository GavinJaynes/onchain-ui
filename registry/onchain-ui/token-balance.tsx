import { cn } from "@/lib/utils";
import { TokenLogo, type TokenLogoProps } from "./token-logo";
import { TokenPrice, type TokenPriceProps } from "./token-price";
import type { ReactNode } from "react";

type BalanceValue = number | string | null | undefined;

export interface TokenBalanceProps {
  /** Token amount */
  amount: BalanceValue;
  /** Token symbol, shown after the amount */
  symbol?: string | null;
  /** Token name, used for logo alt text */
  name?: string | null;
  /** Token image URL */
  src?: string | null;
  /** Token contract address, used as a fallback label */
  address?: string | null;
  /** Fiat value for the token balance */
  fiatValue?: TokenPriceProps["value"];
  /** Fiat value percentage change */
  change?: TokenPriceProps["change"];
  /** Show the token logo. Default: true */
  showLogo?: boolean;
  /** Show fiat value when provided. Default: true */
  showFiatValue?: boolean;
  /** Locale passed to Intl.NumberFormat */
  locale?: string;
  /** Maximum fraction digits for the token amount. Default: 4 */
  maximumFractionDigits?: number;
  /** Minimum fraction digits for the token amount */
  minimumFractionDigits?: number;
  /** Value shown when amount is null, undefined, empty, or invalid. Default: -- */
  fallback?: ReactNode;
  /** Props passed to TokenLogo */
  logoProps?: Partial<TokenLogoProps>;
  /** Props passed to TokenPrice */
  priceProps?: Partial<TokenPriceProps>;
  /** Applied to the root wrapper */
  className?: string;
  /** Applied to the amount line */
  amountClassName?: string;
  /** Applied to the fiat value line */
  fiatClassName?: string;
}

function parseBalanceValue(value: BalanceValue) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function formatAmount({
  locale,
  maximumFractionDigits,
  minimumFractionDigits,
  value,
}: {
  locale?: string;
  maximumFractionDigits: number;
  minimumFractionDigits?: number;
  value: number;
}) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits,
    minimumFractionDigits,
  }).format(value);
}

export function TokenBalance({
  amount,
  symbol,
  name,
  src,
  address,
  fiatValue,
  change,
  showLogo = true,
  showFiatValue = true,
  locale,
  maximumFractionDigits = 4,
  minimumFractionDigits,
  fallback = "--",
  logoProps,
  priceProps,
  className,
  amountClassName,
  fiatClassName,
}: TokenBalanceProps) {
  const parsedAmount = parseBalanceValue(amount);
  const hasFiatValue =
    showFiatValue && fiatValue !== null && fiatValue !== undefined && fiatValue !== "";

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      {showLogo && (
        <TokenLogo
          address={address}
          name={name}
          src={src}
          symbol={symbol}
          {...logoProps}
        />
      )}

      <div className="grid min-w-0 gap-0.5">
        <div
          className={cn(
            "font-mono text-sm font-medium tabular-nums",
            amountClassName
          )}
        >
          {parsedAmount === null
            ? fallback
            : formatAmount({
                locale,
                maximumFractionDigits,
                minimumFractionDigits,
                value: parsedAmount,
              })}
          {symbol && <span className="ml-1 text-muted-foreground">{symbol}</span>}
        </div>

        {hasFiatValue && (
          <TokenPrice
            value={fiatValue}
            change={change}
            className={cn("text-xs text-muted-foreground", fiatClassName)}
            priceClassName="font-mono"
            {...priceProps}
          />
        )}
      </div>
    </div>
  );
}
