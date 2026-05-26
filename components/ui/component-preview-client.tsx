"use client";

import dynamic from "next/dynamic";
import { Suspense, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckIcon, CopyIcon } from "lucide-react";

const demoComponents: Record<string, React.ComponentType> = {
  "address-display": dynamic(() =>
    import("@/components/demos/address-display-demo").then((m) => ({
      default: m.AddressDisplayDemo,
    }))
  ),
};

interface ComponentPreviewClientProps {
  name: string;
  highlightedCode: string;
  rawCode: string;
}

export function ComponentPreviewClient({
  name,
  highlightedCode,
  rawCode,
}: ComponentPreviewClientProps) {
  const Demo = demoComponents[name];
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(rawCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Tabs defaultValue="preview" className="my-6">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>

      <TabsContent value="preview">
        <div className="flex min-h-52 items-center justify-center rounded-lg border border-border bg-background p-10">
          {Demo ? (
            <Suspense
              fallback={
                <span className="text-xs text-muted-foreground animate-pulse">
                  Loading…
                </span>
              }
            >
              <Demo />
            </Suspense>
          ) : (
            <p className="text-xs text-muted-foreground">
              Demo not found: {name}
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="code">
        <div className="relative rounded-lg border border-border overflow-hidden">
          <button
            onClick={handleCopy}
            className="absolute right-3 top-3 z-10 flex items-center justify-center rounded-md border border-border bg-background p-1.5 text-muted-foreground transition-colors hover:text-foreground"
            title="Copy code"
          >
            {copied ? (
              <CheckIcon className="size-3.5" />
            ) : (
              <CopyIcon className="size-3.5" />
            )}
          </button>
          <div
            className="[&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:text-sm [&_pre]:leading-6 [&_.line]:block [&_.line]:min-h-[1lh]"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
