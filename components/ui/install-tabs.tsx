import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/ui/copy-button";

interface InstallTabsProps {
  /** CLI command run through the package runner, e.g. "shadcn add https://.../asset-row.json" */
  command?: string;
  /** Package list installed as dependencies, e.g. "wagmi@2 viem" */
  packages?: string;
}

function buildVariants({ command, packages }: InstallTabsProps) {
  if (command) {
    return [
      { id: "npm", text: `npx ${command}` },
      { id: "pnpm", text: `pnpm dlx ${command}` },
      { id: "bun", text: `bunx ${command}` },
    ];
  }

  return [
    { id: "npm", text: `npm install ${packages}` },
    { id: "pnpm", text: `pnpm add ${packages}` },
    { id: "bun", text: `bun add ${packages}` },
  ];
}

export function InstallTabs(props: InstallTabsProps) {
  const variants = buildVariants(props);

  return (
    <Tabs defaultValue="npm" className="my-4 gap-1">
      <TabsList>
        {variants.map((variant) => (
          <TabsTrigger key={variant.id} value={variant.id} className="px-3">
            {variant.id}
          </TabsTrigger>
        ))}
      </TabsList>

      {variants.map((variant) => (
        <TabsContent key={variant.id} value={variant.id}>
          <div className="not-prose flex items-center justify-between gap-3 rounded-lg border border-border bg-zinc-950 py-1 pr-1 pl-4">
            <pre className="overflow-x-auto py-2 font-mono text-[0.8125rem] text-zinc-100">
              <code>{variant.text}</code>
            </pre>
            <CopyButton code={variant.text} className="shrink-0" />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
