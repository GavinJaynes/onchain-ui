"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { ReactElement, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  children: ReactElement;
  content: ReactNode;
  delay?: number;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

export function Tooltip({
  children,
  content,
  delay = 200,
  side = "top",
  className,
}: TooltipProps) {
  if (!content) return children;

  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger delay={delay} render={children} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={side} sideOffset={6}>
          <BaseTooltip.Popup
            className={cn(
              "z-50 max-w-64 rounded-md border bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-md outline-none",
              "origin-[var(--transform-origin)] transition-[opacity,transform] duration-150",
              "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
              "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
              className
            )}
          >
            {content}
            <BaseTooltip.Arrow className="fill-popover" />
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}

