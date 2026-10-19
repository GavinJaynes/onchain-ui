"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AmountInput, type AmountInputProps } from "./amount-input";
import { FieldSet, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";

export interface AssetInputProps extends Omit<AmountInputProps, "className"> {
  /** Visible label connected to the amount input. */
  label: ReactNode;
  /** Token identity or your app's picker trigger. */
  asset?: ReactNode | undefined;
  /** Supporting text, such as a fiat estimate. Connected via aria-describedby. */
  description?: ReactNode | undefined;
  /** Validation message. Marks the input invalid and connects the message. */
  error?: ReactNode | undefined;
  /** Balance, Max actions, or other app-owned supporting content. */
  footer?: ReactNode | undefined;
  /** Applied to the field container. */
  className?: string | undefined;
  /** Applied to the amount input. */
  inputClassName?: string | undefined;
}

export function AssetInput({
  label,
  asset,
  description,
  error,
  footer,
  className,
  inputClassName,
  id,
  disabled,
  "aria-describedby": describedBy,
  "aria-invalid": ariaInvalid,
  ...props
}: AssetInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasDescription = description != null && description !== false;
  const hasError = error != null && error !== false && error !== "";
  const invalid = hasError || ariaInvalid;
  const descriptionIds = [
    describedBy,
    hasDescription ? `${inputId}-description` : undefined,
    hasError ? `${inputId}-error` : undefined,
  ].filter(Boolean).join(" ") || undefined;

  return (
    <FieldSet
      disabled={disabled}
      data-slot="asset-input"
      data-invalid={invalid || undefined}
      className={cn(
        "m-0 grid min-w-0 gap-3 rounded-xl border border-input bg-muted/30 p-4",
        "focus-within:border-ring data-[invalid=true]:border-destructive disabled:opacity-50",
        className
      )}
    >
      <FieldLabel htmlFor={inputId} className="text-sm font-medium text-muted-foreground">
        {label}
      </FieldLabel>
      <div className="flex min-w-0 items-center gap-3">
        {asset != null && <div className="min-w-0 max-w-[50%] shrink-0">{asset}</div>}
        <AmountInput
          {...props}
          id={inputId}
          disabled={disabled}
          aria-describedby={descriptionIds}
          aria-invalid={invalid}
          className={cn(
            "h-auto flex-1 rounded-sm border-0 bg-transparent px-0 py-1 text-right text-3xl tracking-tight shadow-none focus-visible:ring-2 disabled:opacity-100 md:text-3xl dark:bg-transparent",
            inputClassName
          )}
        />
      </div>
      {hasDescription && (
        <FieldDescription id={`${inputId}-description`}>
          {description}
        </FieldDescription>
      )}
      {footer != null && <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs text-muted-foreground">{footer}</div>}
      {hasError && (
        <FieldError id={`${inputId}-error`}>
          {error}
        </FieldError>
      )}
    </FieldSet>
  );
}
