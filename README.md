# onchain-ui

[![CI](https://github.com/GavinJaynes/onchain-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/GavinJaynes/onchain-ui/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![shadcn registry](https://img.shields.io/badge/shadcn-registry-black?logo=shadcnui&logoColor=white)](https://onchain-ui.dev)

Copy-paste web3 UI components for shadcn apps.

onchain-ui is an open source [shadcn registry](https://ui.shadcn.com/docs/registry) for product teams building onchain interfaces: wallet identity, token displays, chain context, balances, market values, and portfolio rows. Components install into your app as source code — inspect them, restyle them, and wire them into your own data layer.

**Docs, live examples, and recipes: [onchain-ui.dev](https://onchain-ui.dev)**

## Install

Add any component with the shadcn CLI:

```bash
npx shadcn add https://onchain-ui.dev/r/asset-row.json
# or: pnpm dlx shadcn add … / bunx shadcn add …
```

Or configure the registry namespace once in your `components.json`:

```json
{
  "registries": {
    "@onchain-ui": "https://onchain-ui.dev/r/{name}.json"
  }
}
```

```bash
npx shadcn add @onchain-ui/asset-row
```

## Components

| Component | Description |
| --- | --- |
| [Address Display](https://onchain-ui.dev/docs/components/address-display) | Truncated address with copy and block explorer link |
| [Address Identity](https://onchain-ui.dev/docs/components/address-identity) | Live ENS / Basename resolution with avatar |
| [Token Logo](https://onchain-ui.dev/docs/components/token-logo) | Token image with resilient fallbacks |
| [Token Stack](https://onchain-ui.dev/docs/components/token-stack) | Overlapping logos for pools, baskets, and routes |
| [Token Price](https://onchain-ui.dev/docs/components/token-price) | Price formatting with change and trend color |
| [Network Logo](https://onchain-ui.dev/docs/components/network-logo) | Chain logo with known-chain fallbacks |
| [Token Balance](https://onchain-ui.dev/docs/components/token-balance) | Amount with optional logo, fiat value, and change |
| [Asset Row](https://onchain-ui.dev/docs/components/asset-row) | Composed portfolio / watchlist row |
| [Crypto Icons](https://onchain-ui.dev/docs/standards/crypto-icons) | Swappable token/network icon adapter |

See [Examples](https://onchain-ui.dev/docs/examples) for composed surfaces (portfolio card, wallet header, pool positions) and [Recipes](https://onchain-ui.dev/docs/recipes/wallet-connection) for wiring components to wagmi, TanStack Query, and TanStack Table.

## Use with AI assistants

The registry is MCP-compatible — its index is served at [`/r/registry.json`](https://onchain-ui.dev/r/registry.json), so assistants like Claude Code and Cursor can browse and install components through the [shadcn MCP server](https://onchain-ui.dev/docs/mcp). Items can also be opened directly in v0 from each docs page.

## Why

Most crypto apps rebuild the same UI pieces: truncated addresses, ENS/Base name display, token icons, network badges, token amounts, price changes, and portfolio rows.

onchain-ui packages those patterns as shadcn registry items so the code lands inside your app — no wrapper library, no lock-in. Components are EVM-first and built on the same viem primitives as wagmi.

## Status

Alpha. The current focus is a small, useful registry of composable primitives rather than a broad component library. APIs and registry URLs may change before a stable release.

## Local Development

```bash
npm install     # install dependencies
npm run dev     # docs site at http://localhost:3000
npm run test    # registry contract tests
npm run build   # registry + site build
```

## Project Structure

```txt
app/
  (site)/            Home page
  (docs)/            Documentation pages
  r/[name]/route.ts  Registry endpoints (/r/registry.json, /r/<name>.json)
components/
  demos/             Live examples used in docs
  ui/                Local docs UI helpers
content/docs/        MDX documentation (components, examples, recipes, standards)
lib/onchain/         Shared onchain utilities
registry/
  meta/              Registry item metadata (source of truth)
  onchain-ui/        Source components distributed by the registry
scripts/
  build-registry.mjs Generates registry.json and registry/generated/
```

`registry.json` and `registry/generated/` are build artifacts — edit `registry/meta/` and the source components, then run `npm run registry:build`.

## Contributing

Issues and pull requests are welcome. The best contributions are small, practical components that solve repeated onchain product UI needs while staying easy to copy, inspect, and customize.

## Author

Created and maintained by [Gavin Jaynes](https://github.com/GavinJaynes).
