import { cn } from "@/lib/utils";
import { NetworkLogo, type NetworkLogoProps } from "./network-logo";
import { TokenLogo, type TokenLogoProps } from "./token-logo";
import { TokenPrice, type TokenPriceProps } from "./token-price";
import type { ReactNode } from "react";

type AmountValue = number | string | null | undefined;

export interface AssetRowProps {
  /** Token symbol */
  symbol: string;
  /** Token name */
  name?: string | null;
  /** Token image URL */
  src?: string | null;
  /** Token contract address */
  address?: string | null;
  /** Token amount held by the user */
  amount?: AmountValue;
  /** Fiat value for the position */
  value?: TokenPriceProps["value"];
  /** Price or position change percentage */
  change?: TokenPriceProps["change"];
  /** Optional network chain id for the logo badge */
  chainId?: number | null;
  /** Optional network name for the logo badge */
  networkName?: string | null;
  /** Optional network image URL for the logo badge */
  networkSrc?: string | null;
  /** Secondary metadata shown under the token name */
  subtitle?: ReactNode;
  /** Hide the right-side amount. Default: false */
  hideAmount?: boolean;
  /** Locale passed to Intl.NumberFormat */
  locale?: string;
  /** Maximum fraction digits for the token amount. Default: 4 */
  maximumFractionDigits?: number;
  /** Props passed to TokenLogo */
  logoProps?: Partial<TokenLogoProps>;
  /** Props passed to NetworkLogo */
  networkLogoProps?: Partial<NetworkLogoProps>;
  /** Props passed to TokenPrice */
  priceProps?: Partial<TokenPriceProps>;
  /** Applied to the root wrapper */
  className?: string;
  /** Applied to the token identity block */
  identityClassName?: string;
  /** Applied to the right-side value block */
  valueClassName?: string;
}

function parseAmountValue(value: AmountValue) {
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
  value,
}: {
  locale?: string;
  maximumFractionDigits: number;
  value: number;
}) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits,
  }).format(value);
}

export function AssetRow({
  symbol,
  name,
  src,
  address,
  amount,
  value,
  change,
  chainId,
  networkName,
  networkSrc,
  subtitle,
  hideAmount = false,
  locale,
  maximumFractionDigits = 4,
  logoProps,
  networkLogoProps,
  priceProps,
  className,
  identityClassName,
  valueClassName,
}: AssetRowProps) {
  const parsedAmount = parseAmountValue(amount);
  const hasNetwork = Boolean(chainId || networkName || networkSrc);
  const hasValue = value !== null && value !== undefined && value !== "";

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-4 rounded-lg border bg-card p-3",
        className
      )}
    >
      <div className={cn("flex min-w-0 items-center gap-3", identityClassName)}>
        <span className="relative shrink-0">
          <TokenLogo
            address={address}
            name={name}
            size="lg"
            src={src}
            symbol={symbol}
            {...logoProps}
          />
          {hasNetwork && (
            <NetworkLogo
              chainId={chainId}
              className="absolute -bottom-1 -right-1 ring-2 ring-card"
              name={networkName}
              size="xs"
              src={networkSrc}
              {...networkLogoProps}
            />
          )}
        </span>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate font-medium leading-none">{symbol}</p>
            {name && (
              <p className="truncate text-sm text-muted-foreground">{name}</p>
            )}
          </div>
          {subtitle && (
            <div className="mt-1 truncate text-xs text-muted-foreground">
              {subtitle}
            </div>
          )}
        </div>
      </div>

      <div className={cn("grid shrink-0 gap-1 text-right", valueClassName)}>
        {hasValue && (
          <TokenPrice
            value={value}
            change={change}
            className="justify-end"
            {...priceProps}
          />
        )}
        {!hideAmount && parsedAmount !== null && (
          <p className="font-mono text-xs text-muted-foreground tabular-nums">
            {formatAmount({ locale, maximumFractionDigits, value: parsedAmount })}{" "}
            {symbol}
          </p>
        )}
      </div>
    </div>
  );
}
