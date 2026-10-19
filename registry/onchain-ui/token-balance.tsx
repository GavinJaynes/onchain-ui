import { cn } from "@/lib/utils";
import {
  parseNumericValue,
  type NumericValue,
} from "@/lib/onchain/format";
import { TokenLogo, type TokenLogoProps } from "./token-logo";
import { TokenPrice, type TokenPriceProps } from "./token-price";
import type { ReactNode } from "react";

type BalanceValue = NumericValue;

export interface TokenBalanceProps {
  /** Token amount */
  amount: BalanceValue;
  /** Token symbol, shown after the amount */
  symbol?: string | null | undefined;
  /** Token name, used for logo alt text */
  name?: string | null | undefined;
  /** Token image URL */
  src?: string | null | undefined;
  /** Token contract address, used for icon inference and as a fallback label */
  address?: string | null | undefined;
  /** EVM chain id, used with address to infer a token icon */
  chainId?: number | null | undefined;
  /** Whether the asset is the chain's native currency */
  isNative?: boolean | undefined;
  /** Fiat value for the token balance */
  fiatValue?: TokenPriceProps["value"] | undefined;
  /** Fiat value percentage change */
  change?: TokenPriceProps["change"] | undefined;
  /** Show the token logo. Default: true */
  showLogo?: boolean | undefined;
  /** Show fiat value when provided. Default: true */
  showFiatValue?: boolean | undefined;
  /** Locale passed to Intl.NumberFormat */
  locale?: string | undefined;
  /** Maximum fraction digits for the token amount. Default: 4 */
  maximumFractionDigits?: number | undefined;
  /** Minimum fraction digits for the token amount */
  minimumFractionDigits?: number | undefined;
  /** Value shown when amount is null, undefined, empty, or invalid. Default: -- */
  fallback?: ReactNode | undefined;
  /** Props passed to TokenLogo */
  logoProps?: Partial<TokenLogoProps> | undefined;
  /** Props passed to TokenPrice */
  priceProps?: Partial<TokenPriceProps> | undefined;
  /** Applied to the root wrapper */
  className?: string | undefined;
  /** Applied to the amount line */
  amountClassName?: string | undefined;
  /** Applied to the fiat value line */
  fiatClassName?: string | undefined;
}

function formatAmount({
  locale,
  maximumFractionDigits,
  minimumFractionDigits,
  value,
}: {
  locale?: string | undefined;
  maximumFractionDigits: number;
  minimumFractionDigits?: number | undefined;
  value: number;
}) {
  return new Intl.NumberFormat(locale, {
    // Intl.NumberFormat throws a RangeError when min > max
    maximumFractionDigits: Math.max(
      maximumFractionDigits,
      minimumFractionDigits ?? 0
    ),
    minimumFractionDigits,
  }).format(value);
}

export function TokenBalance({
  amount,
  symbol,
  name,
  src,
  address,
  chainId,
  isNative = false,
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
  const parsedAmount = parseNumericValue(amount);
  const hasFiatValue =
    showFiatValue && fiatValue !== null && fiatValue !== undefined && fiatValue !== "";

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      {showLogo && (
        <TokenLogo
          address={address}
          chainId={chainId}
          isNative={isNative}
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
