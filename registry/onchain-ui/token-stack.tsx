"use client";

import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";
import { TokenLogo, type TokenLogoProps } from "./token-logo";
import type { ReactNode } from "react";

export interface TokenStackItem
  extends Pick<TokenLogoProps, "address" | "fallback" | "name" | "src" | "symbol"> {
  id?: string;
}

export interface TokenStackProps {
  /** Tokens to display in the stack */
  tokens: TokenStackItem[];
  /** Maximum visible tokens before overflow. Default: 5 */
  limit?: number;
  /** Token logo size. Default: md */
  size?: TokenLogoProps["size"];
  /** Overlap direction. Default: left */
  direction?: "left" | "right";
  /** Show overflow count when tokens exceed limit. Default: true */
  showOverflow?: boolean;
  /** Custom overflow renderer */
  renderOverflow?: (count: number) => ReactNode;
  /** Custom token renderer for icon libraries or chain overlays */
  renderToken?: (token: TokenStackItem, index: number) => ReactNode;
  /** Show animated tooltips for tokens. Default: false */
  showTooltip?: boolean;
  /** Token tooltip content. Defaults to name, symbol, then address. */
  getTooltipContent?: (token: TokenStackItem, index: number) => ReactNode;
  /** Overflow tooltip content. Defaults to hidden token symbols/names. */
  getOverflowTooltipContent?: (tokens: TokenStackItem[]) => ReactNode;
  /** Accessible label for the group */
  "aria-label"?: string;
  /** Applied to the root wrapper */
  className?: string;
  /** Applied to each token wrapper */
  itemClassName?: string;
  /** Applied to the overflow item */
  overflowClassName?: string;
}

const overlapClasses = {
  left: "-space-x-2",
  right: "space-x-reverse -space-x-2",
} as const;

const overflowSizeClasses = {
  xs: "size-5 text-[9px]",
  sm: "size-6 text-[10px]",
  md: "size-8 text-xs",
  lg: "size-10 text-sm",
  xl: "size-12 text-base",
} as const;

function getTokenKey(token: TokenStackItem, index: number) {
  return token.id ?? token.address ?? token.symbol ?? token.name ?? index;
}

export function TokenStack({
  tokens,
  limit = 5,
  size = "md",
  direction = "left",
  showOverflow = true,
  renderOverflow,
  renderToken,
  showTooltip = false,
  getTooltipContent,
  getOverflowTooltipContent,
  "aria-label": ariaLabel = "Token stack",
  className,
  itemClassName,
  overflowClassName,
}: TokenStackProps) {
  const visibleTokens = tokens.slice(0, limit);
  const hiddenTokens = tokens.slice(limit);
  const overflowCount = Math.max(tokens.length - visibleTokens.length, 0);

  const getDefaultTooltipContent = (token: TokenStackItem) =>
    token.name ?? token.symbol ?? token.address;

  const getDefaultOverflowTooltipContent = () => (
    <div className="flex flex-col gap-1">
      {hiddenTokens.map((token, index) => (
        <span key={getTokenKey(token, index)}>
          {token.symbol ?? token.name ?? token.address}
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={cn("flex items-center", overlapClasses[direction], className)}
      aria-label={ariaLabel}
      role="list"
    >
      {visibleTokens.map((token, index) => {
        const item = (
          <span
            key={getTokenKey(token, index)}
            className={cn(
              "relative inline-flex rounded-full ring-2 ring-background",
              "hover:z-10",
              itemClassName
            )}
            title={!showTooltip ? token.name ?? token.symbol ?? undefined : undefined}
            role="listitem"
            style={{
              zIndex:
                direction === "left" ? visibleTokens.length - index : index + 1,
            }}
          >
            {renderToken ? (
              renderToken(token, index)
            ) : (
              <TokenLogo
                address={token.address}
                fallback={token.fallback}
                name={token.name}
                size={size}
                src={token.src}
                symbol={token.symbol}
              />
            )}
          </span>
        );

        if (!showTooltip) return item;

        return (
          <Tooltip
            key={getTokenKey(token, index)}
            content={
              getTooltipContent
                ? getTooltipContent(token, index)
                : getDefaultTooltipContent(token)
            }
          >
            {item}
          </Tooltip>
        );
      })}

      {showOverflow && overflowCount > 0 && (
        showTooltip ? (
          <Tooltip
            content={
              getOverflowTooltipContent
                ? getOverflowTooltipContent(hiddenTokens)
                : getDefaultOverflowTooltipContent()
            }
          >
            <span
              className={cn(
                "relative inline-flex shrink-0 items-center justify-center rounded-full border bg-muted font-medium text-muted-foreground ring-2 ring-background",
                overflowSizeClasses[size],
                overflowClassName
              )}
              aria-label={`${overflowCount} more tokens`}
              role="listitem"
            >
              {renderOverflow ? renderOverflow(overflowCount) : `+${overflowCount}`}
            </span>
          </Tooltip>
        ) : (
          <span
            className={cn(
              "relative inline-flex shrink-0 items-center justify-center rounded-full border bg-muted font-medium text-muted-foreground ring-2 ring-background",
              overflowSizeClasses[size],
              overflowClassName
            )}
            aria-label={`${overflowCount} more tokens`}
            role="listitem"
          >
            {renderOverflow ? renderOverflow(overflowCount) : `+${overflowCount}`}
          </span>
        )
      )}
    </div>
  );
}
