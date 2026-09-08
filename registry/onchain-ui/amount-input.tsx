"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface AmountInputProps
  extends Omit<
    ComponentProps<"input">,
    "type" | "inputMode" | "value" | "defaultValue" | "onChange" | "min" | "max" | "step"
  > {
  /** Unformatted decimal string. Empty and incomplete values are valid while editing. */
  value: string;
  /** Receives accepted edits without numeric conversion or rounding. */
  onValueChange?: (value: string) => void;
  /** Maximum fractional digits. Omit for unrestricted precision; 0 allows integers only. */
  decimals?: number;
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

export function AmountInput({
  value,
  onValueChange,
  decimals,
  readOnly = !onValueChange,
  disabled,
  className,
  placeholder = "0",
  ...props
}: AmountInputProps) {
  return (
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
        className
      )}
    />
  );
}
