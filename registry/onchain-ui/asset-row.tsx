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
  /** A second line under the name, e.g. the symbol and contract address */
  description?: ReactNode | undefined;
  /**
   * Replaces the token logo and network badge, e.g. with a TokenStack for a
   * basket or LP position
   */
  logo?: ReactNode | undefined;
  /**
   * Formats the right-side amount instead of "1,234.5678 SYMBOL", for apps
   * with a house number style
   */
  formatAmount?: ((amount: number) => ReactNode) | undefined;
  /** Row density. `sm` suits pickers and dense lists. Default: default */
  size?: "default" | "sm" | undefined;
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
  /** Props passed to TokenPrice, e.g. `format` and `formatChange` */
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

// Spacing and type per size. `default` is the portfolio-card row; `sm` is a
// dense list row, e.g. a token picker inside a menu or dialog.
const sizeClasses = {
  default: {
    root: "gap-4 px-1 py-3",
    identity: "gap-3",
    name: "text-base font-medium leading-tight",
    secondary: "text-sm",
    value: "text-base",
    valueWeight: "font-semibold",
    logo: "xl",
    network: "xs",
  },
  sm: {
    root: "gap-3 px-3 py-2.5",
    identity: "gap-3",
    name: "text-sm font-medium",
    secondary: "text-xs",
    value: "text-sm",
    valueWeight: "font-medium",
    logo: "md",
    network: "xs",
  },
} as const;

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
  description,
  logo,
  hideAmount = false,
  locale,
  maximumFractionDigits = 4,
  formatAmount: formatAmountProp,
  size = "default",
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
  const hasDescription = description != null && description !== false;
  const s = sizeClasses[size];

  // Spans throughout, so the row can sit inside a <button> or <a> (a picker
  // row is usually one); div and p are not valid there.
  return (
    <span
      data-slot="asset-row"
      className={cn(
        "flex w-full min-w-0 items-center justify-between rounded-lg",
        s.root,
        className
      )}
    >
      <span
        className={cn(
          "flex min-w-0 flex-1 items-center",
          s.identity,
          identityClassName
        )}
      >
        <span className="relative shrink-0">
          {logo ?? (
            <>
              <TokenLogo
                address={address}
                chainId={chainId}
                isNative={isNative}
                name={name}
                size={s.logo}
                src={src}
                symbol={symbol}
                {...logoProps}
              />
              {hasNetwork && (
                <NetworkLogo
                  chainId={chainId}
                  className="absolute -bottom-1 -right-1 ring-2 ring-background"
                  name={networkName}
                  size={s.network}
                  src={networkSrc}
                  {...networkLogoProps}
                />
              )}
            </>
          )}
        </span>

        <span className="block min-w-0 flex-1">
          <span className="flex min-w-0 items-baseline gap-2">
            <span className={cn("block truncate", s.name)}>
              {name ?? symbol}
            </span>
            {subtitle && (
              <span className={cn("truncate text-muted-foreground", s.secondary)}>
                {subtitle}
              </span>
            )}
          </span>
          {hasDescription && (
            <span
              className={cn(
                "flex min-w-0 items-center gap-1.5 text-muted-foreground",
                s.secondary
              )}
            >
              {description}
            </span>
          )}
          {hasChange && (
            <TokenPrice
              {...priceProps}
              value={null}
              fallback={null}
              change={change}
              className="mt-1 gap-0"
              priceClassName="hidden"
              changeClassName={cn(s.secondary, priceProps?.changeClassName)}
            />
          )}
        </span>
      </span>

      <span className={cn("grid shrink-0 gap-1 text-right", valueClassName)}>
        {hasValue && (
          <TokenPrice
            {...priceProps}
            value={value}
            change={null}
            className={cn("justify-end", s.value, priceProps?.className)}
            priceClassName={cn(s.valueWeight, priceProps?.priceClassName)}
          />
        )}
        {!hideAmount && parsedAmount !== null && (
          <span
            className={cn(
              "block font-mono text-muted-foreground tabular-nums",
              s.secondary
            )}
          >
            {formatAmountProp
              ? formatAmountProp(parsedAmount)
              : `${formatAmount({ locale, maximumFractionDigits, value: parsedAmount })} ${symbol}`}
          </span>
        )}
      </span>
    </span>
  );
}
