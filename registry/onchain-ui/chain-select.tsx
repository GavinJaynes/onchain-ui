"use client";

import { useMemo, type ReactNode } from "react";
import {
  ChevronDownIcon,
  EarthIcon,
  LoaderCircleIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NetworkLogo } from "./network-logo";
import { getNetworkMeta } from "@/lib/onchain/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ChainSelectOption {
  /** EVM chain id */
  id: number;
  /** Display name. Falls back to the built-in network name, then the chain id */
  name?: string | null | undefined;
  /** Network image URL override, forwarded to NetworkLogo */
  logoSrc?: string | null | undefined;
  /** Short symbol, used for the logo fallback */
  symbol?: string | null | undefined;
  /** Render but do not allow selection */
  disabled?: boolean | undefined;
  /** Rendered after the name, e.g. a "Testnet" badge */
  badge?: ReactNode | undefined;
}

export interface ChainSelectProps {
  /** Selectable chains, usually the ones your app is configured for */
  chains: Array<ChainSelectOption>;
  /** Selected chain id. Null when disconnected or showing all networks */
  value?: number | null | undefined;
  /** Called with the chain id the user picked */
  onSelect: (chainId: number) => void;
  /** Called when the optional all-networks item is picked */
  onClear?: (() => void) | undefined;
  /** Renders an item that clears the selected chain, e.g. "All networks" */
  allLabel?: string | undefined;
  /** Chain id currently being switched to. Blocks further selection */
  pendingChainId?: number | null | undefined;
  /** Disable the whole control */
  disabled?: boolean | undefined;
  /** Trigger label when `value` is null. Default: "Select network" */
  placeholder?: string | undefined;
  /**
   * Trigger label when `value` is set but missing from `chains` — a wallet on a
   * network the app does not support. Default: "Unsupported network"
   */
  unsupportedLabel?: string | undefined;
  /** Heading above the menu items. Default: "Switch network" */
  menuLabel?: ReactNode | undefined;
  /** Show the network name in the trigger. Default: true */
  showLabel?: boolean | undefined;
  /** Visual size. Default: "default" */
  size?: "sm" | "default" | undefined;
  /** Menu alignment against the trigger. Default: "start" */
  align?: "start" | "center" | "end" | undefined;
  /** Applied to the trigger */
  className?: string | undefined;
  /** Applied to the menu */
  contentClassName?: string | undefined;
}

// The "all networks" radio value. Not a chain id, so it can never collide.
const ALL_VALUE = "all";

const triggerSizes = {
  sm: "h-7 gap-1.5 px-2 text-xs",
  default: "h-8 gap-2 px-2.5 text-[0.8rem]",
} as const;

const logoSizes = {
  sm: "xs",
  default: "sm",
} as const;

export function ChainSelect({
  chains,
  value,
  onSelect,
  onClear,
  allLabel,
  pendingChainId,
  disabled = false,
  placeholder = "Select network",
  unsupportedLabel = "Unsupported network",
  menuLabel = "Switch network",
  showLabel = true,
  size = "default",
  align = "start",
  className,
  contentClassName,
}: ChainSelectProps) {
  const selected = useMemo(
    () => chains.find((chain) => chain.id === value) ?? null,
    [chains, value]
  );

  // A connected chain that is not in `chains` is the wrong-network case: the
  // wallet is somewhere the app cannot serve. Say so instead of rendering a
  // bare chain id and hoping the user works it out.
  const isUnsupported = value != null && selected === null;
  const isPending = pendingChainId != null;
  const logoSize = logoSizes[size];

  // Explicit name wins, then the curated network name, then the placeholder.
  // Falling back through the config means a caller can pass bare chain ids and
  // still get "Optimism" rather than viem's "OP Mainnet".
  const chainLabel = (chain: ChainSelectOption) =>
    chain.name ?? getNetworkMeta(chain.id).name ?? `Chain ${chain.id}`;

  const triggerLabel = isUnsupported
    ? unsupportedLabel
    : selected
      ? chainLabel(selected)
      : (allLabel ?? placeholder);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled || isPending || chains.length === 0}
        aria-label={showLabel ? undefined : triggerLabel}
        data-unsupported={isUnsupported || undefined}
        className={cn(
          "inline-flex shrink-0 items-center rounded-lg border border-border bg-background font-medium whitespace-nowrap",
          "transition-colors duration-150 outline-none",
          "hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
          "disabled:pointer-events-none disabled:opacity-50",
          "data-unsupported:border-destructive/40 data-unsupported:text-destructive",
          triggerSizes[size],
          className
        )}
      >
        {isPending ? (
          <LoaderCircleIcon
            className={cn("animate-spin", size === "sm" ? "size-3.5" : "size-4")}
            aria-hidden="true"
          />
        ) : value == null && allLabel ? (
          <EarthIcon
            className={cn(size === "sm" ? "size-5" : "size-6")}
            aria-hidden="true"
          />
        ) : value == null ? (
          // Nothing is connected, so there is no chain to illustrate. An empty
          // slot holds the trigger's width without inventing a network.
          <span
            className={cn(
              "shrink-0 rounded-full border border-dashed border-border",
              size === "sm" ? "size-5" : "size-6"
            )}
            aria-hidden="true"
          />
        ) : (
          <NetworkLogo
            chainId={value}
            src={selected?.logoSrc}
            name={selected?.name}
            symbol={selected?.symbol}
            size={logoSize}
            // The warning glyph replaces the chain-id text fallback, which does
            // not fit the logo at these sizes.
            fallback={
              isUnsupported ? (
                <TriangleAlertIcon className="size-3.5" />
              ) : undefined
            }
            className={cn(
              isUnsupported && "border-destructive/40 text-destructive"
            )}
          />
        )}

        {showLabel && <span className="min-w-0 truncate">{triggerLabel}</span>}

        <ChevronDownIcon
          className={cn(
            "text-muted-foreground",
            size === "sm" ? "size-3" : "size-3.5"
          )}
          aria-hidden="true"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align} className={cn("w-52", contentClassName)}>
        {/* String values: Radix radio groups only carry strings, and Base UI
            accepts them too, so one source works on either base. */}
        <DropdownMenuRadioGroup
          value={value == null ? ALL_VALUE : String(value)}
          onValueChange={(next: unknown) => {
            if (next == null || next === ALL_VALUE) {
              onClear?.();
              return;
            }
            onSelect(Number(next));
          }}
        >
          {/* GroupLabel reads its group from context, so it has to live inside
              the radio group rather than above it. */}
          {menuLabel && <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>}

          {allLabel && onClear && (
            <DropdownMenuRadioItem
              value={ALL_VALUE}
              disabled={isPending}
              closeOnClick
              className="gap-2 py-1.5"
            >
              <EarthIcon className="size-5" aria-hidden="true" />
              <span className="min-w-0 truncate">{allLabel}</span>
            </DropdownMenuRadioItem>
          )}

          {chains.map((chain) => (
            <DropdownMenuRadioItem
              key={chain.id}
              value={String(chain.id)}
              disabled={chain.disabled || isPending}
              // Radio items keep the menu open by default, which suits a
              // settings menu. Picking a network is a one-shot action.
              closeOnClick
              className="gap-2 py-1.5"
            >
              <NetworkLogo
                chainId={chain.id}
                src={chain.logoSrc}
                name={chain.name}
                symbol={chain.symbol}
                size="xs"
              />
              <span className="min-w-0 truncate">
                {chainLabel(chain)}
              </span>
              {chain.badge}
              {pendingChainId === chain.id && (
                <LoaderCircleIcon
                  className="ml-auto size-3.5 animate-spin text-muted-foreground"
                  aria-hidden="true"
                />
              )}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
