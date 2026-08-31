import Link from "next/link";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/ui/copy-button";
import { OnchainFlare } from "@/components/onchain-flare";
import { ExampleShowcaseMedia } from "@/components/example-showcase-media";

import { AddressDisplay } from "@/registry/onchain-ui/address-display";
import { AddressIdentity } from "@/registry/onchain-ui/address-identity";
import { NetworkLogo } from "@/registry/onchain-ui/network-logo";
import { TokenLogo } from "@/registry/onchain-ui/token-logo";
import { TokenStack } from "@/registry/onchain-ui/token-stack";
import type { Address } from "viem";

const VITALIK = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" as Address;

const ETH = {
  symbol: "ETH",
  name: "Ethereum",
  src: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
};
const USDC = {
  symbol: "USDC",
  name: "USD Coin",
  src: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
};
const AERO = {
  symbol: "AERO",
  name: "Aerodrome",
  src: "https://assets.coingecko.com/coins/images/31745/large/token.png",
};

// Every preview below renders the actual registry components — the same code
// `shadcn add` puts in your app. No mockups.
const components = [
  {
    name: "AddressDisplay",
    href: "/docs/components/address-display",
    description: "Copy-ready addresses with ENS-safe formatting.",
    preview: (
      <AddressDisplay
        address={VITALIK}
        showCopy={false}
        showExplorer={false}
        addressClassName="text-sm text-foreground/78"
      />
    ),
  },
  {
    name: "AddressIdentity",
    href: "/docs/components/address-identity",
    description: "Avatar, name, label, and address in one primitive.",
    preview: (
      <AddressIdentity
        address={VITALIK}
        name="vitalik.eth"
        avatarUrl="https://metadata.ens.domains/mainnet/avatar/vitalik.eth"
        showCopy={false}
        showExplorer={false}
        avatarClassName="size-9 ring-1 ring-border/70"
        contentClassName="text-sm text-foreground/84"
      />
    ),
  },
  {
    name: "TokenLogo",
    href: "/docs/components/token-logo",
    description: "Asset and network marks for onchain balances.",
    preview: (
      <span className="relative">
        <TokenLogo {...USDC} size="xl" className="ring-1 ring-border/70" />
        <NetworkLogo
          chainId={8453}
          size="sm"
          className="absolute -right-0.5 -bottom-0.5 ring-2 ring-card/80"
        />
      </span>
    ),
  },
  {
    name: "TokenStack",
    href: "/docs/components/token-stack",
    description: "Overlapping token groups for baskets and pools.",
    preview: (
      <TokenStack
        tokens={[
          ETH,
          USDC,
          AERO,
          { symbol: "WBTC", name: "Wrapped Bitcoin" },
          { symbol: "LINK", name: "Chainlink" },
          { symbol: "UNI", name: "Uniswap" },
        ]}
        limit={3}
        size="lg"
        itemClassName="ring-border/80"
        overflowClassName="ring-border/80"
      />
    ),
  },
];

const INSTALL_COMMAND = "shadcn add @onchain-ui/token-stack";

const installVariants = [
  { id: "npm", text: `npx ${INSTALL_COMMAND}` },
  { id: "pnpm", text: `pnpm dlx ${INSTALL_COMMAND}` },
  { id: "bun", text: `bunx ${INSTALL_COMMAND}` },
];

const demoComponents = [
  "Connect Wallet",
  "Address Identity",
  "Chain Select",
  "Asset Row",
  "Token Logo",
  "Network Logo",
  "Token Price",
  "Token Stack",
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* 3.5rem offset matches the h-14 fumadocs home nav */}
      <section className="relative isolate flex w-full flex-col justify-start overflow-hidden bg-[#02030a] lg:min-h-[calc(100svh-3.5rem)] lg:justify-center">
        <OnchainFlare />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,10,0.06)_0%,rgba(2,3,10,0.12)_32%,rgba(2,3,10,0.96)_49%,#02030a_62%)] lg:bg-[linear-gradient(90deg,rgba(2,3,10,0.98)_0%,rgba(2,3,10,0.82)_34%,rgba(2,3,10,0.18)_62%,rgba(2,3,10,0)_100%)]" />
        <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-0 px-6 pb-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-12 lg:py-20">
          <div className="h-[42svh] min-h-72 lg:hidden" aria-hidden="true" />

          <div className="min-w-0 space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/48 backdrop-blur-sm">
              <span className="inline-flex size-1.5 rounded-full bg-emerald-500" />
              <span className="sm:hidden">Open source / shadcn registry</span>
              <span className="hidden sm:inline">
                v0.1.0 / open source / shadcn registry / wagmi + viem
              </span>
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-medium leading-[1.06] tracking-[-0.022em] text-balance text-white md:text-5xl xl:text-6xl">
                Copy&#8209;paste web3 components for shadcn apps.
              </h1>

              <p className="hidden max-w-xl text-base leading-7 text-white/52 sm:block md:text-lg">
                Wallet identity, token logos, chain context, icon stacks, and
                market UI primitives built for teams shipping onchain products.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/docs"
                className="inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-black transition-colors hover:bg-white/88"
              >
                Browse components
              </Link>
              <a
                href="https://github.com/GavinJaynes/onchain-ui"
                target="_blank"
                rel="noreferrer"
                className="hidden h-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-5 text-sm font-medium text-white/78 backdrop-blur-sm transition-colors hover:bg-white/[0.09] hover:text-white sm:inline-flex"
              >
                GitHub
              </a>
            </div>

            <Tabs
              defaultValue="npm"
              className="hidden max-w-xl gap-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur-md sm:flex"
            >
              <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] py-1.5 pr-2 pl-4">
                <span className="font-mono text-xs text-white/38">
                  install
                </span>
                <TabsList className="h-7 bg-transparent p-0">
                  {installVariants.map((variant) => (
                    <TabsTrigger
                      key={variant.id}
                      value={variant.id}
                      className="px-2.5 text-xs text-white/38 hover:text-white data-active:bg-white/10 data-active:text-white dark:data-active:bg-white/10"
                    >
                      {variant.id}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              {installVariants.map((variant) => (
                <TabsContent key={variant.id} value={variant.id}>
                  <div className="flex items-center justify-between gap-3 py-1 pr-1 pl-4">
                    <pre className="overflow-x-auto py-2 text-left font-mono text-sm text-white/82">
                      <code>{variant.text}</code>
                    </pre>
                    <CopyButton
                      code={variant.text}
                      className="shrink-0 text-white/38 hover:text-white"
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

        </div>
      </section>

      <section className="border-t border-border/70 bg-secondary/20">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Composed in practice
            </p>
            <h2 className="text-3xl font-medium tracking-[-0.02em] text-balance text-foreground md:text-4xl">
              From registry primitives to a complete onchain flow.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              The example app dogfoods the same source-installed components you
              get from the registry—composed into a working multichain swap UI.
            </p>
          </div>

          <div className="grid overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:grid-cols-[1.55fr_0.75fr]">
            <ExampleShowcaseMedia />

            <div className="flex flex-col justify-between border-t border-border p-6 sm:p-8 lg:border-t-0 lg:border-l">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Live example
                </div>
                <h3 className="text-2xl font-medium tracking-tight text-foreground">
                  A swap interface built from source you own.
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Wallet state, asset discovery, chain context, live pricing,
                  and route details—assembled without a locked component SDK.
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  {demoComponents.map((component) => (
                    <span
                      key={component}
                      className="rounded-md border border-border bg-background px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
                    >
                      {component}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <a
                  href="https://example.onchain-ui.dev/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Open example ↗
                </a>
                <a
                  href="https://github.com/GavinJaynes/onchain-ui"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  View source
                </a>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                The primitives
              </p>
              <h3 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">
                Small pieces. Production-ready details.
              </h3>
            </div>
            <Link
              href="/docs"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Browse all documentation →
            </Link>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {components.map((component) => (
              <Link
                key={component.name}
                href={component.href}
                className="group overflow-hidden rounded-xl border border-border bg-card transition duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md"
              >
                <div className="flex min-h-32 items-center justify-center border-b border-border bg-[radial-gradient(circle_at_center,var(--accent),transparent_72%)] p-6 text-foreground">
                  {component.preview}
                </div>
                <div className="p-4">
                  <p className="font-mono text-sm font-medium text-foreground">
                    {component.name}
                  </p>
                  <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                    {component.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
