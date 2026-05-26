"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const demoComponents: Record<string, React.ComponentType> = {
  "address-display": dynamic(() =>
    import("@/components/demos/address-display-demo").then((m) => ({
      default: m.AddressDisplayDemo,
    }))
  ),
};

interface ComponentPreviewProps {
  name: string;
  code: string;
  className?: string;
}

export function ComponentPreview({ name, code, className }: ComponentPreviewProps) {
  const Demo = demoComponents[name];

  return (
    <Tabs defaultValue="preview" className={cn("my-6", className)}>
      <TabsList className="h-9 w-fit rounded-none border-b border-border bg-transparent p-0">
        <TabsTrigger
          value="preview"
          className="rounded-none border-b-2 border-transparent px-4 pb-2 pt-1 text-sm font-medium text-muted-foreground shadow-none data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none"
        >
          Preview
        </TabsTrigger>
        <TabsTrigger
          value="code"
          className="rounded-none border-b-2 border-transparent px-4 pb-2 pt-1 text-sm font-medium text-muted-foreground shadow-none data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none"
        >
          Code
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="preview"
        className="mt-0 flex min-h-40 items-center justify-center rounded-b-lg rounded-tr-lg border border-t-0 border-border bg-background p-10"
      >
        {Demo ? (
          <Suspense
            fallback={
              <div className="text-xs text-muted-foreground animate-pulse">
                Loading…
              </div>
            }
          >
            <Demo />
          </Suspense>
        ) : (
          <p className="text-xs text-muted-foreground">Demo not found: {name}</p>
        )}
      </TabsContent>

      <TabsContent value="code" className="mt-0">
        <pre className="overflow-x-auto rounded-b-lg rounded-tr-lg border border-t-0 border-border bg-fd-secondary p-4 text-sm leading-relaxed">
          <code className="font-mono">{code}</code>
        </pre>
      </TabsContent>
    </Tabs>
  );
}
