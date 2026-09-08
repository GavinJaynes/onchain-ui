"use client";

import { useState } from "react";
import { AmountInput } from "./amount-input";
import { useId } from "react";
import { Label } from "@/components/ui/label";

export default function AmountInputDemo() {
  const [value, setValue] = useState("");
  const id = useId();
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor={id}>Amount</Label>
      <AmountInput id={id} value={value} onValueChange={setValue} decimals={18} />
      <p className="text-xs text-muted-foreground">Up to 18 decimal places. Try 0.000000000000000001.</p>
    </div>
  );
}
