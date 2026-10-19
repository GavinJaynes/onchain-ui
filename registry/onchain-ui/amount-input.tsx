"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

// Props come from the app's own Input rather than a bare <input>, so variants
// the app added to it (bskts has an `amount` variant for money forms) pass
// straight through.
export interface AmountInputProps
  extends Omit<
    ComponentProps<typeof Input>,
    "type" | "inputMode" | "value" | "defaultValue" | "onChange" | "min" | "max" | "step"
  > {
  /** Unformatted decimal string. Empty and incomplete values are valid while editing. */
  value: string;
  /** Receives accepted edits without numeric conversion or rounding. */
  onValueChange?: ((value: string) => void) | undefined;
  /** Maximum fractional digits. Omit for unrestricted precision; 0 allows integers only. */
  decimals?: number | undefined;
  /**
   * Shown inside the field at the end, e.g. a unit such as "USDC". The text
   * is padded so it never runs under it. Decorative: name the unit in the
   * field's label too.
   */
  suffix?: ReactNode | undefined;
}

/** Checks editing syntax, not whether an amount is ready for a transaction. */
export function isAmountInputValue(value: string, decimals?: number): boolean {
  if (decimals !== undefined && (!Number.isInteger(decimals) || decimals < 0)) {
    return false;
  }
  if (!/^[0-9]*(\.[0-9]*)?$/.test(value)) return false;
  const point = value.indexOf(".");
  return point === -1 || decimals === undefined ||
    (decimals > 0 && value.length - point - 1 <= decimals);
}

// AmountInput stays hook-free (the tests call it as a plain function and read
// the element it returns). Only a suffixed field mounts this measuring part.
// It measures the suffix so the input's end padding clears it at any font or
// label length. Before the first measurement (and during SSR) a 3.5rem guess
// keeps short units like "ETH" or "USDC" clear.
function SuffixedAmountInput({
  input,
  suffix,
}: {
  input: (suffixPadding: string) => ReactNode;
  suffix: ReactNode;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span data-slot="amount-input-group" className="relative flex w-full min-w-0 items-center">
      {input(width === null ? "3.5rem" : `calc(${width}px + 1.25rem)`)}
      <span
        ref={ref}
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-xs text-muted-foreground"
      >
        {suffix}
      </span>
    </span>
  );
}

export function AmountInput({
  value,
  onValueChange,
  decimals,
  readOnly = !onValueChange,
  disabled,
  className,
  placeholder = "0",
  suffix,
  style,
  ...props
}: AmountInputProps) {
  const input = (suffixPadding?: string) => (
    <Input
      autoComplete="off"
      spellCheck={false}
      size={1}
      {...props}
      data-slot="amount-input"
      type="text"
      inputMode="decimal"
      value={value}
      placeholder={placeholder}
      readOnly={readOnly}
      disabled={disabled}
      onChange={(event) => {
        const next = event.target.value;
        if (!disabled && !readOnly && isAmountInputValue(next, decimals)) {
          onValueChange?.(next);
        }
      }}
      className={cn(
        "font-mono tabular-nums",
        suffixPadding && "pe-(--amount-input-suffix)",
        className
      )}
      style={
        suffixPadding
          ? ({ ...style, "--amount-input-suffix": suffixPadding } as CSSProperties)
          : style
      }
    />
  );

  if (suffix == null || suffix === false) return input();
  return <SuffixedAmountInput input={input} suffix={suffix} />;
}
