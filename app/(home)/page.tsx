import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <div className="max-w-2xl space-y-6">
        <div className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
          Open source · shadcn registry · wagmi + viem
        </div>

        <h1 className="text-5xl font-bold tracking-tight">
          onchain-ui
        </h1>

        <p className="text-xl text-muted-foreground">
          A collection of copy-paste web3 UI components for your shadcn project.
          Wallet addresses, token balances, portfolio charts, and more.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/docs"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            Browse Components
          </Link>
          <a
            href="https://github.com/onchain-ui/onchain-ui"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
          >
            GitHub
          </a>
        </div>

        <div className="pt-8 text-sm text-muted-foreground">
          <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
            npx shadcn add https://onchain-ui.dev/r/address-display
          </code>
        </div>
      </div>
    </main>
  );
}
