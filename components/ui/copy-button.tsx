"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyButton({ code, className }: { code: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy code"
      className={cn(
        "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs",
        "text-zinc-400 transition-colors hover:text-zinc-100",
        className
      )}
    >
      {copied ? (
        <>
          <CheckIcon className="size-3.5" />
          Copied
        </>
      ) : (
        <>
          <CopyIcon className="size-3.5" />
          Copy
        </>
      )}
    </button>
  );
}
