"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
}

export function ComponentPreviewClient({
  name,
  highlightedCode,
}: ComponentPreviewClientProps) {
  const Demo = demoComponents[name];

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
        <div
          className="[&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:text-sm [&_pre]:leading-relaxed [&_pre]:border [&_pre]:border-border"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </TabsContent>
    </Tabs>
  );
}
