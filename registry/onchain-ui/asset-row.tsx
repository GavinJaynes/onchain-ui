import { cn } from "@/lib/utils";
import {
  parseNumericValue,
  type NumericValue,
} from "@/lib/onchain/format";
import { NetworkLogo, type NetworkLogoProps } from "./network-logo";
import { TokenLogo, type TokenLogoProps } from "./token-logo";
import { TokenPrice, type TokenPriceProps } from "./token-price";
import type { ReactNode } from "react";

type AmountValue = NumericValue;

export interface AssetRowProps {
  /** Token symbol */
  symbol: string;
  /** Token name */
  name?: string | null | undefined;
  /** Token image URL */
  src?: string | null | undefined;
  /** Token contract address */
  address?: string | null | undefined;
  /** Whether the asset is the chain's native currency */
  isNative?: boolean | undefined;
  /** Token amount held by the user */
  amount?: AmountValue | undefined;
  /** Fiat value for the position */
  value?: TokenPriceProps["value"] | undefined;
  /** Price or position change percentage */
  change?: TokenPriceProps["change"] | undefined;
  /** Optional network chain id for the logo badge */
  chainId?: number | null | undefined;
  /** Optional network name for the logo badge */
  networkName?: string | null | undefined;
  /** Optional network image URL for the logo badge */
  networkSrc?: string | null | undefined;
  /** Secondary metadata shown beside the token name */
  subtitle?: ReactNode | undefined;
  /** Hide the right-side amount. Default: false */
  hideAmount?: boolean | undefined;
  /** Locale passed to Intl.NumberFormat */
  locale?: string | undefined;
  /** Maximum fraction digits for the token amount. Default: 4 */
  maximumFractionDigits?: number | undefined;
  /** Props passed to TokenLogo */
  logoProps?: Partial<TokenLogoProps> | undefined;
  /** Props passed to NetworkLogo */
  networkLogoProps?: Partial<NetworkLogoProps> | undefined;
  /** Props passed to TokenPrice */
  priceProps?: Partial<TokenPriceProps> | undefined;
  /** Applied to the root wrapper */
  className?: string | undefined;
  /** Applied to the token identity block */
  identityClassName?: string | undefined;
  /** Applied to the right-side value block */
  valueClassName?: string | undefined;
}

function formatAmount({
  locale,
  maximumFractionDigits,
  value,
}: {
  locale?: string | undefined;
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
  isNative = false,
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
  const parsedAmount = parseNumericValue(amount);
  const hasNetwork = Boolean(chainId || networkName || networkSrc);
  const hasValue = value !== null && value !== undefined && value !== "";
  const hasChange = typeof change === "number" && Number.isFinite(change);

  return (
    <div
      className={cn(
        "flex w-full min-w-0 items-center justify-between gap-4 rounded-lg px-1 py-3",
        className
      )}
    >
      <div
        className={cn(
          "flex min-w-0 flex-1 items-center gap-3",
          identityClassName
        )}
      >
        <span className="relative shrink-0">
          <TokenLogo
            address={address}
            chainId={chainId}
            isNative={isNative}
            name={name}
            size="xl"
            src={src}
            symbol={symbol}
            {...logoProps}
          />
          {hasNetwork && (
            <NetworkLogo
              chainId={chainId}
              className="absolute -bottom-1 -right-1 ring-2 ring-background"
              name={networkName}
              size="xs"
              src={networkSrc}
              {...networkLogoProps}
            />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-baseline gap-2">
            <p className="truncate text-base font-medium leading-tight">
              {name ?? symbol}
            </p>
            {subtitle && (
              <span className="truncate text-sm text-muted-foreground">
                {subtitle}
              </span>
            )}
          </div>
          {hasChange && (
            <TokenPrice
              {...priceProps}
              value={null}
              fallback={null}
              change={change}
              className="mt-1 gap-0"
              priceClassName="hidden"
              changeClassName={cn("text-sm", priceProps?.changeClassName)}
            />
          )}
        </div>
      </div>

      <div className={cn("grid shrink-0 gap-1 text-right", valueClassName)}>
        {hasValue && (
          <TokenPrice
            {...priceProps}
            value={value}
            change={null}
            className={cn("justify-end text-base", priceProps?.className)}
            priceClassName={cn("font-semibold", priceProps?.priceClassName)}
          />
        )}
        {!hideAmount && parsedAmount !== null && (
          <p className="font-mono text-sm text-muted-foreground tabular-nums">
            {formatAmount({ locale, maximumFractionDigits, value: parsedAmount })}{" "}
            {symbol}
          </p>
        )}
      </div>
    </div>
  );
}
