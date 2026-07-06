import { codeToHtml } from "shiki";
import type { ShikiTransformer } from "shiki";
import { Suspense } from "react";
import { ChevronDownIcon } from "lucide-react";
import { CopyButton } from "./copy-button";

// Inject layout + spacing via inline styles so they beat any inherited CSS
// (fumadocs prose sets a large line-height that would otherwise propagate).
// data-line-numbers / data-line are still stamped for the ::before counter CSS.
const transformerLineNumbers: ShikiTransformer = {
  pre(node) {
    const s = (node.properties.style as string) ?? "";
    node.properties.style = `${s};background-color:#09090b;padding:0;`;
  },
  code(node) {
    node.properties["data-line-numbers"] = "";
    const s = (node.properties.style as string) ?? "";
    node.properties.style =
      `${s};display:block;font-size:0.8125rem;line-height:1.5;` +
      `background:transparent;counter-reset:line;`;
  },
  line(node) {
    node.properties["data-line"] = "";
    const s = (node.properties.style as string) ?? "";
    // white-space:pre on the line span guarantees leading spaces in tokens
    // (e.g. "  return") are never collapsed by any inherited CSS rule
    node.properties.style =
      `${s};display:block;padding:0 1.25rem;min-height:1.5em;white-space:pre;`;
  },
  postprocess(html) {
    // Shiki inserts a \n between every line span as pretty-printing. In a
    // white-space:pre context those newlines render as full blank lines.
    // Strip them directly from the serialised HTML rather than fighting CSS.
    return html.replace(/\n(<span class="line)/g, "$1");
  },
};

type DemoLoader = () => Promise<{ default: React.ComponentType }>;

const demos: Record<string, DemoLoader> = {
  "address-display": () =>
    import("@/components/demos/address-display-demo").then((m) => ({
      default: m.AddressDisplayDemo,
    })),
  "address-display-base": () =>
    import("@/components/demos/address-display-demo").then((m) => ({
      default: m.AddressDisplayDemoBase,
    })),
  "address-display-full": () =>
    import("@/components/demos/address-display-demo").then((m) => ({
      default: m.AddressDisplayDemoFull,
    })),
  "address-display-copy-only": () =>
    import("@/components/demos/address-display-demo").then((m) => ({
      default: m.AddressDisplayDemoCopyOnly,
    })),
  "address-identity": () =>
    import("@/components/demos/address-identity-demo").then((m) => ({
      default: m.AddressIdentityDemo,
    })),
  "address-identity-resolved": () =>
    import("@/components/demos/address-identity-demo").then((m) => ({
      default: m.AddressIdentityDemoResolved,
    })),
  "address-identity-fallback": () =>
    import("@/components/demos/address-identity-demo").then((m) => ({
      default: m.AddressIdentityDemoFallback,
    })),
  "address-identity-no-avatar": () =>
    import("@/components/demos/address-identity-demo").then((m) => ({
      default: m.AddressIdentityDemoNoAvatar,
    })),
  "token-logo": () =>
    import("@/components/demos/token-logo-demo").then((m) => ({
      default: m.TokenLogoDemo,
    })),
  "token-logo-inferred": () =>
    import("@/components/demos/token-logo-demo").then((m) => ({
      default: m.TokenLogoDemoInferred,
    })),
  "token-logo-fallback": () =>
    import("@/components/demos/token-logo-demo").then((m) => ({
      default: m.TokenLogoDemoFallback,
    })),
  "token-logo-sizes": () =>
    import("@/components/demos/token-logo-demo").then((m) => ({
      default: m.TokenLogoDemoSizes,
    })),
  "token-logo-custom-fallback": () =>
    import("@/components/demos/token-logo-demo").then((m) => ({
      default: m.TokenLogoDemoCustomFallback,
    })),
  "token-logo-tooltip": () =>
    import("@/components/demos/token-logo-demo").then((m) => ({
      default: m.TokenLogoDemoTooltip,
    })),
  "token-stack": () =>
    import("@/components/demos/token-stack-demo").then((m) => ({
      default: m.TokenStackDemo,
    })),
  "token-stack-overflow": () =>
    import("@/components/demos/token-stack-demo").then((m) => ({
      default: m.TokenStackDemoOverflow,
    })),
  "token-stack-tooltip": () =>
    import("@/components/demos/token-stack-demo").then((m) => ({
      default: m.TokenStackDemoTooltip,
    })),
  "token-stack-sizes": () =>
    import("@/components/demos/token-stack-demo").then((m) => ({
      default: m.TokenStackDemoSizes,
    })),
  "token-stack-custom-render": () =>
    import("@/components/demos/token-stack-demo").then((m) => ({
      default: m.TokenStackDemoCustomRender,
    })),
  "token-price": () =>
    import("@/components/demos/token-price-demo").then((m) => ({
      default: m.TokenPriceDemo,
    })),
  "token-price-changes": () =>
    import("@/components/demos/token-price-demo").then((m) => ({
      default: m.TokenPriceDemoChanges,
    })),
  "token-price-small-values": () =>
    import("@/components/demos/token-price-demo").then((m) => ({
      default: m.TokenPriceDemoSmallValues,
    })),
  "token-price-compact": () =>
    import("@/components/demos/token-price-demo").then((m) => ({
      default: m.TokenPriceDemoCompact,
    })),
  "token-price-custom": () =>
    import("@/components/demos/token-price-demo").then((m) => ({
      default: m.TokenPriceDemoCustom,
    })),
  "network-logo": () =>
    import("@/components/demos/network-logo-demo").then((m) => ({
      default: m.NetworkLogoDemo,
    })),
  "network-logo-networks": () =>
    import("@/components/demos/network-logo-demo").then((m) => ({
      default: m.NetworkLogoDemoNetworks,
    })),
  "network-logo-sizes": () =>
    import("@/components/demos/network-logo-demo").then((m) => ({
      default: m.NetworkLogoDemoSizes,
    })),
  "network-logo-custom": () =>
    import("@/components/demos/network-logo-demo").then((m) => ({
      default: m.NetworkLogoDemoCustom,
    })),
  "token-balance": () =>
    import("@/components/demos/token-balance-demo").then((m) => ({
      default: m.TokenBalanceDemo,
    })),
  "token-balance-list": () =>
    import("@/components/demos/token-balance-demo").then((m) => ({
      default: m.TokenBalanceDemoList,
    })),
  "token-balance-compact": () =>
    import("@/components/demos/token-balance-demo").then((m) => ({
      default: m.TokenBalanceDemoCompact,
    })),
  "asset-row": () =>
    import("@/components/demos/asset-row-demo").then((m) => ({
      default: m.AssetRowDemo,
    })),
  "asset-row-portfolio": () =>
    import("@/components/demos/asset-row-demo").then((m) => ({
      default: m.AssetRowDemoPortfolio,
    })),
  "asset-row-watchlist": () =>
    import("@/components/demos/asset-row-demo").then((m) => ({
      default: m.AssetRowDemoWatchlist,
    })),
  "example-portfolio": () =>
    import("@/components/demos/examples-demo").then((m) => ({
      default: m.ExamplePortfolio,
    })),
  "example-wallet-header": () =>
    import("@/components/demos/examples-demo").then((m) => ({
      default: m.ExampleWalletHeader,
    })),
  "example-pool-positions": () =>
    import("@/components/demos/examples-demo").then((m) => ({
      default: m.ExamplePoolPositions,
    })),
};

async function Demo({ name }: { name: string }) {
  const load = demos[name];
  if (!load)
    return (
      <p className="text-xs text-muted-foreground">Demo not found: {name}</p>
    );
  const { default: Component } = await load();
  return <Component />;
}

interface ComponentPreviewProps {
  name: string;
  code: string;
  codeOpen?: boolean;
}

export async function ComponentPreview({
  name,
  code,
  codeOpen = true,
}: ComponentPreviewProps) {
  const raw = code.trim();

  const highlightedCode = await codeToHtml(raw, {
    lang: "tsx",
    themes: {
      light: "github-light",
      dark: "github-dark-dimmed",
    },
    defaultColor: false,
    transformers: [transformerLineNumbers],
  });

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border/70 bg-card/70 ring-1 ring-background/70">
      {/* Preview */}
      <div className="flex min-h-40 items-center justify-center bg-background/70 p-10">
        <Suspense
          fallback={
            <span className="text-xs text-muted-foreground animate-pulse">
              Loading...
            </span>
          }
        >
          <Demo name={name} />
        </Suspense>
      </div>

      <details
        className="group border-t border-border bg-zinc-950"
        open={codeOpen}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-2 text-xs text-zinc-400 transition-colors hover:text-zinc-100 [&::-webkit-details-marker]:hidden">
          <ChevronDownIcon className="size-3.5 transition-transform group-open:rotate-180" />
          <span className="font-mono text-zinc-500">{name}.tsx</span>
          <span className="ml-auto text-zinc-500 group-open:hidden">
            Show code
          </span>
          <span className="ml-auto hidden text-zinc-500 group-open:inline">
            Hide code
          </span>
        </summary>

        {/* Code header */}
        <div className="flex items-center justify-end border-t border-zinc-800 px-4 py-2">
          <CopyButton code={raw} />
        </div>

        {/* Code block */}
        <div
          className="not-fumadocs-codeblock overflow-hidden [&_pre]:bg-zinc-950 [&_pre]:outline-none [&_code]:bg-transparent"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </details>
    </div>
  );
}
