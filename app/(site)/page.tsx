import Image from "next/image";
import Link from "next/link";

function UsdcLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 2000 2000" aria-hidden="true" className={className}>
      <circle cx="1000" cy="1000" r="1000" fill="#2775CA" />
      <path
        d="M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 112.5-137.5 112.5c-108.34 0-145.84-45.84-158.34-108.34-4.16-16.66-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.17c16.66 104.16 83.33 179.16 220.83 200v100c0 16.66 12.5 29.16 33.33 33.33h62.5c16.67 0 29.17-12.5 33.34-33.33v-100c125-20.84 208.33-108.34 208.33-220.84Z"
        fill="white"
      />
      <path
        d="M787.5 1595.83c-325-116.66-491.67-479.16-370.83-800 62.5-175 200-308.33 370.83-370.83 16.67-8.33 25-20.83 25-41.67V325c0-16.67-8.33-29.17-25-33.33-4.17 0-12.5 0-16.67 4.16-395.83 125-612.5 545.84-487.5 941.67 75 233.33 254.17 412.5 487.5 487.5 16.67 8.33 33.34 0 37.5-16.67 4.17-4.16 4.17-8.33 4.17-16.66v-58.34c0-12.5-12.5-29.16-25-37.5Zm441.67-1300c-16.67-8.33-33.34 0-37.5 16.67-4.17 4.17-4.17 8.33-4.17 16.67v58.33c0 16.67 12.5 33.33 25 41.67 325 116.66 491.67 479.16 370.83 800-62.5 175-200 308.33-370.83 370.83-16.67 8.33-25 20.83-25 41.67V1700c0 16.67 8.33 29.17 25 33.33 4.17 0 12.5 0 16.67-4.16 395.83-125 612.5-545.84 487.5-941.67-75-237.5-258.34-416.67-487.5-491.67Z"
        fill="white"
      />
    </svg>
  );
}

function EthereumLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <circle cx="16" cy="16" r="16" fill="#627EEA" />
      <g fill="#FFF">
        <path fillOpacity=".602" d="M16.498 4v8.87l7.497 3.35z" />
        <path d="M16.498 4L9 16.22l7.498-3.35z" />
        <path fillOpacity=".602" d="M16.498 21.968v6.027L24 17.616z" />
        <path d="M16.498 27.995v-6.028L9 17.616z" />
        <path fillOpacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z" />
        <path fillOpacity=".602" d="M9 16.22l7.498 4.353v-7.701z" />
      </g>
    </svg>
  );
}

function BitcoinLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <circle cx="16" cy="16" r="16" fill="#F7931A" />
      <path
        d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538Zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11Zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733Z"
        fill="white"
      />
    </svg>
  );
}

function BaseBadge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 146 146" aria-hidden="true" className={className}>
      <circle
        cx="73"
        cy="73"
        r="69"
        fill="#0052FF"
        stroke="var(--background)"
        strokeWidth="8"
      />
      <path
        d="M73.323 123.729C101.617 123.729 124.553 100.832 124.553 72.5875C124.553 44.343 101.617 21.4463 73.323 21.4463C46.4795 21.4463 24.4581 42.0558 22.271 68.2887H89.9859V76.8864H22.271C24.4581 103.119 46.4795 123.729 73.323 123.729Z"
        fill="white"
        transform="translate(73 73) scale(0.93) translate(-73 -73)"
      />
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
                <code>npx shadcn add https://onchain-ui.dev/r/token-stack.json</code>
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
