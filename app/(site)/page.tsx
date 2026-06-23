import Image from "next/image";
import Link from "next/link";

function UsdcLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <circle cx="16" cy="16" r="16" fill="#2775CA" />
      <path
        d="M12.25 10.1a6.75 6.75 0 0 0 0 11.8M19.75 10.1a6.75 6.75 0 0 1 0 11.8"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 8.5v15M13.25 19.15c.5 1 1.55 1.5 2.75 1.5 1.55 0 2.75-.75 2.75-2.05 0-1.15-.85-1.7-2.95-2.25-1.95-.5-2.95-1.25-2.95-2.65 0-1.45 1.25-2.35 3.05-2.35 1.25 0 2.25.45 2.8 1.25"
        stroke="white"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EthereumLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <circle cx="16" cy="16" r="16" fill="#111827" />
      <path d="m16 5 6.5 11L16 19.75 9.5 16 16 5Z" fill="#E5E7EB" />
      <path
        d="m16 21.05 6.5-3.75L16 27l-6.5-9.7 6.5 3.75Z"
        fill="#9CA3AF"
      />
      <path d="m16 5v14.75L9.5 16 16 5Z" fill="#F9FAFB" />
    </svg>
  );
}

function BitcoinLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <circle cx="16" cy="16" r="16" fill="#F7931A" />
      <path
        d="M18.9 15.35c1.25-.45 1.95-1.25 1.75-2.65-.25-1.9-1.9-2.55-4.05-2.75V7.5h-1.5v2.4h-1.2V7.5h-1.5v2.4H9.95v1.6h1.2c.7 0 .85.18.85.72v7.55c0 .55-.15.73-.85.73h-1.2v1.6h2.45v2.4h1.5v-2.4h1.2v2.4h1.5v-2.43c2.55-.18 4.35-.98 4.55-3.15.15-1.65-.7-2.75-2.25-3.57Zm-4.95-3.75h1.8c1.15 0 2 .35 2 1.45 0 1-.75 1.45-1.95 1.45h-1.85v-2.9Zm2.25 8.85h-2.25v-3.35h2.25c1.35 0 2.05.58 2.05 1.65 0 1.1-.78 1.7-2.05 1.7Z"
        fill="white"
      />
    </svg>
  );
}

function BaseBadge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" className={className}>
      <circle
        cx="9"
        cy="9"
        r="8.5"
        fill="#0052FF"
        stroke="hsl(var(--background))"
      />
      <path d="M6 9h6" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

const components = [
  {
    name: "AddressDisplay",
    href: "/docs/components/address-display",
    description: "Copy-ready addresses with ENS-safe formatting.",
    preview: (
      <div className="flex items-center gap-2 rounded-md border bg-muted px-2.5 py-1.5 font-mono text-xs">
        <span className="size-2 rounded-full bg-emerald-500" aria-hidden />
        <span>0x8ba1...e7a3</span>
      </div>
    ),
  },
  {
    name: "AddressIdentity",
    href: "/docs/components/address-identity",
    description: "Avatar, name, label, and address in one primitive.",
    preview: (
      <div className="flex items-center gap-2">
        <div className="grid size-9 place-items-center rounded-full border bg-foreground text-[10px] font-semibold text-background">
          VB
        </div>
        <div className="min-w-0 text-right">
          <p className="font-mono text-xs text-foreground">vitalik.eth</p>
          <p className="font-mono text-[10px] text-muted-foreground">
            0xd8dA...96045
          </p>
        </div>
      </div>
    ),
  },
  {
    name: "TokenLogo",
    href: "/docs/components/token-logo",
    description: "Asset and network marks for onchain balances.",
    preview: (
      <div className="relative">
        <UsdcLogo className="size-10 drop-shadow-sm" />
        <BaseBadge className="absolute -bottom-0.5 -right-0.5 size-4" />
      </div>
    ),
  },
  {
    name: "TokenStack",
    href: "/docs/components/token-stack",
    description: "Overlapping token groups for baskets and pools.",
    preview: (
      <div className="flex -space-x-2">
        <span className="rounded-full border-2 border-card">
          <UsdcLogo className="size-8" />
        </span>
        <span className="rounded-full border-2 border-card">
          <EthereumLogo className="size-8" />
        </span>
        <span className="rounded-full border-2 border-card">
          <BitcoinLogo className="size-8" />
        </span>
        <span className="grid size-8 place-items-center rounded-full border-2 border-card bg-muted text-[9px] font-semibold text-muted-foreground">
          +3
        </span>
      </div>
    ),
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-6xl flex-col justify-center px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground shadow-sm">
              <span className="size-1.5 rounded-full bg-foreground" />
              Alpha / open source / shadcn registry / wagmi + viem
            </div>

            <div className="space-y-5">
              <Image
                src="/logo-mark.svg"
                alt="onchain-ui"
                width={64}
                height={64}
                priority
                className="size-14 dark:invert"
              />

              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-balance md:text-7xl">
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
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Browse components
              </Link>
              <a
                href="https://github.com/GavinJaynes/onchain-ui"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-5 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                GitHub
              </a>
            </div>

            <div className="max-w-xl overflow-hidden rounded-lg border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b px-4 py-2">
                <span className="font-mono text-xs text-muted-foreground">
                  install
                </span>
                <span className="text-xs text-muted-foreground">
                  registry item
                </span>
              </div>
              <pre className="overflow-x-auto p-4 text-left font-mono text-sm">
                <code>npx shadcn add https://onchain-ui.dev/r/token-stack</code>
              </pre>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-xl border bg-card p-3 shadow-sm">
              <div className="grid gap-2">
                {components.map((component) => (
                  <Link
                    key={component.name}
                    href={component.href}
                    className="grid gap-4 rounded-md border bg-background p-4 transition-colors hover:bg-muted/40 sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-sm">{component.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {component.description}
                      </p>
                    </div>
                    <div className="flex min-h-10 items-center sm:justify-end">
                      {component.preview}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="mx-auto mt-4 grid max-w-sm grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
              <span>identity</span>
              <span>assets</span>
              <span>markets</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
