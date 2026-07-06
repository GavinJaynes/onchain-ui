export function AlphaBanner() {
  return (
    <div className="border-b border-border/70 bg-card/55 px-4 py-2 text-sm text-muted-foreground backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
        <span className="inline-flex w-fit items-center rounded-md border border-border/70 bg-background/70 px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-normal text-foreground ring-1 ring-background/70">
          Alpha
        </span>
        <span>
          onchain-ui is experimental. Components, docs, and registry URLs may
          change before a stable release.
        </span>
      </div>
    </div>
  );
}
