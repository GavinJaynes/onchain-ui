import Image from "next/image";
import Link from "next/link";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/ui/copy-button";

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

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* 3.5rem offset matches the h-14 fumadocs home nav */}
      <section className="mx-auto flex min-h-[calc(100svh-3.5rem)] w-full max-w-6xl flex-col justify-center px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="min-w-0 space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="inline-flex size-1.5 rounded-full bg-emerald-500" />
              v0.1.0 / open source / shadcn registry / wagmi + viem
            </div>

            <div className="space-y-5">
              <Image
                src="/logo-mark.svg"
                alt="onchain-ui"
                width={64}
                height={64}
                priority
                className="size-14 rounded-xl ring-1 ring-border/70 dark:invert"
              />

              <h1 className="max-w-3xl text-4xl font-medium leading-[1.06] tracking-[-0.022em] text-balance text-foreground md:text-5xl xl:text-6xl">
                Copy&#8209;paste web3 components for shadcn apps.
              </h1>

              <p className="max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
                Wallet identity, token logos, chain context, icon stacks, and
                market UI primitives built for teams shipping onchain products.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/docs"
                className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Browse components
              </Link>
              <a
                href="https://github.com/GavinJaynes/onchain-ui"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-secondary/50 px-5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary"
              >
                GitHub
              </a>
            </div>

            <Tabs
              defaultValue="npm"
              className="max-w-xl gap-0 overflow-hidden rounded-lg border border-border bg-card"
            >
              <div className="flex items-center justify-between border-b border-border bg-secondary/40 py-1.5 pr-2 pl-4">
                <span className="font-mono text-xs text-muted-foreground">
                  install
                </span>
                <TabsList className="h-7 bg-transparent p-0">
                  {installVariants.map((variant) => (
                    <TabsTrigger
                      key={variant.id}
                      value={variant.id}
                      className="px-2.5 text-xs"
                    >
                      {variant.id}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              {installVariants.map((variant) => (
                <TabsContent key={variant.id} value={variant.id}>
                  <div className="flex items-center justify-between gap-3 py-1 pr-1 pl-4">
                    <pre className="overflow-x-auto py-2 text-left font-mono text-sm text-foreground/90">
                      <code>{variant.text}</code>
                    </pre>
                    <CopyButton
                      code={variant.text}
                      className="shrink-0 text-muted-foreground hover:text-foreground"
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="relative min-w-0">
            <div className="rounded-xl border border-border bg-card p-2.5">
              <div className="grid gap-2">
                {components.map((component) => (
                  <Link
                    key={component.name}
                    href={component.href}
                    className="group grid min-h-18 gap-4 rounded-lg border border-border/70 bg-background/50 p-4 transition-colors hover:border-border hover:bg-secondary/50 sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-sm font-medium leading-5 text-foreground">
                        {component.name}
                      </p>
                      <p className="text-xs leading-5 text-muted-foreground">
                        {component.description}
                      </p>
                    </div>
                    <div className="flex min-h-10 items-center text-foreground sm:justify-end">
                      {component.preview}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
