export function AlphaBanner() {
  return (
    <div className="border-b bg-muted/45 px-4 py-2 text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
        <span className="inline-flex w-fit items-center rounded-md border bg-background px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-normal text-foreground">
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
