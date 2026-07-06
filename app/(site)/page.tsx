import Image from "next/image";
import Link from "next/link";

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

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-6xl flex-col justify-center px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="min-w-0 space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1 text-xs text-muted-foreground ring-1 ring-background/70 backdrop-blur-xl">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
              </span>
              Alpha / open source / shadcn registry / wagmi + viem
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

              <h1 className="max-w-3xl bg-linear-to-b from-foreground via-foreground to-foreground/62 bg-clip-text text-5xl font-semibold tracking-tight text-balance text-transparent md:text-6xl xl:text-7xl">
                Copy-paste web3 components for shadcn apps.
              </h1>

              <p className="max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                Wallet identity, token logos, chain context, icon stacks, and
                market UI primitives built for teams shipping onchain products.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/docs"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground ring-1 ring-primary/10 transition-all hover:-translate-y-px hover:bg-primary/92 hover:ring-primary/20"
              >
                Browse components
              </Link>
              <a
                href="https://github.com/GavinJaynes/onchain-ui"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-card/60 px-5 text-sm font-medium ring-1 ring-background/70 backdrop-blur-xl transition-all hover:-translate-y-px hover:border-ring/40 hover:bg-accent/70 hover:text-accent-foreground"
              >
                GitHub
              </a>
            </div>

            <div className="max-w-xl overflow-hidden rounded-lg border border-border/70 bg-card/70 ring-1 ring-background/70 backdrop-blur-xl">
              <div className="overflow-hidden rounded-[calc(var(--radius)-1px)]">
                <div className="flex items-center justify-between border-b border-border/70 bg-muted/25 px-4 py-2">
                  <span className="font-mono text-xs text-muted-foreground">
                    install
                  </span>
                  <span className="text-xs text-muted-foreground/80">
                    registry item
                  </span>
                </div>
                <pre className="overflow-x-auto p-4 text-left font-mono text-sm text-foreground/90">
                  <code>
                    npx shadcn add https://onchain-ui.dev/r/token-stack.json
                  </code>
                </pre>
              </div>
            </div>
          </div>

          <div className="relative min-w-0">
            <div className="rounded-2xl border border-border bg-card/95 p-3 ring-1 ring-foreground/6 dark:border-white/14 dark:bg-[oklch(0.17_0.008_247)]">
              <div className="rounded-[calc(var(--radius-xl)-1px)]">
                <div className="grid gap-2.5">
                  {components.map((component) => (
                    <Link
                      key={component.name}
                      href={component.href}
                      className="group grid min-h-18 gap-4 rounded-md border border-border/85 bg-background/96 p-4 ring-1 ring-foreground/4 transition-all hover:-translate-y-0.5 hover:border-ring/45 hover:bg-card hover:ring-ring/20 dark:border-white/10 dark:bg-[oklch(0.205_0.01_247)] dark:hover:bg-[oklch(0.225_0.012_247)] sm:grid-cols-[1fr_auto] sm:items-center"
                    >
                      <div className="min-w-0">
                        <p className="font-mono text-sm font-semibold leading-5 text-foreground">
                          {component.name}
                        </p>
                        <p className="text-xs leading-5 text-muted-foreground">
                          {component.description}
                        </p>
                      </div>
                      <div className="flex min-h-10 items-center text-foreground transition-opacity group-hover:opacity-100 sm:justify-end">
                        {component.preview}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
