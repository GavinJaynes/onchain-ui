# onchain-ui

[![CI](https://github.com/GavinJaynes/onchain-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/GavinJaynes/onchain-ui/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![shadcn registry](https://img.shields.io/badge/shadcn-registry-black?logo=shadcnui&logoColor=white)](https://onchain-ui.dev)

Copy-paste web3 UI components for shadcn apps.

onchain-ui is an open source [shadcn registry](https://ui.shadcn.com/docs/registry) for wallet connections, address identity, and token displays. Install components into your app as source code, then edit their styles and pass in your data.

[Read the docs and try the live examples](https://onchain-ui.dev).

## Install

onchain-ui is listed in the [shadcn registry directory](https://ui.shadcn.com/registries). Add any component through the `@onchain-ui` namespace:

```bash
npx shadcn add @onchain-ui/asset-row
# or: pnpm dlx shadcn add … / bunx shadcn add …
```

The CLI saves the namespace when you first add a component. You can also register it beforehand:

```bash
npx shadcn registry add @onchain-ui
```

Direct item URLs work too: `npx shadcn add https://onchain-ui.dev/r/asset-row.json`.

## Components

| Component | Description |
| --- | --- |
| [Address display](https://onchain-ui.dev/docs/components/address-display) | Truncated address with copy and block explorer link |
| [Address identity](https://onchain-ui.dev/docs/components/address-identity) | ENS name or Basename resolution with avatar |
| [Token logo](https://onchain-ui.dev/docs/components/token-logo) | Token image with fallback text when no image loads |
| [Token stack](https://onchain-ui.dev/docs/components/token-stack) | Overlapping logos with an overflow count |
| [Token price](https://onchain-ui.dev/docs/components/token-price) | Price formatting with percentage change and trend color |
| [Network logo](https://onchain-ui.dev/docs/components/network-logo) | Built-in chain logos and fallback text |
| [Token balance](https://onchain-ui.dev/docs/components/token-balance) | Amount with optional logo, fiat value, and change |
| [Asset row](https://onchain-ui.dev/docs/components/asset-row) | Token details and holding value in one row |
| [Amount input](https://onchain-ui.dev/docs/components/amount-input) | Decimal string input that preserves precision while editing |
| [Asset input](https://onchain-ui.dev/docs/components/asset-input) | Labeled amount field with slots for token selection, balances, and actions |
| [Chain select](https://onchain-ui.dev/docs/components/chain-select) | Network selector for wallet switching or filtering |
| [Connect wallet](https://onchain-ui.dev/docs/components/connect-wallet) | Wallet picker and account menu using wagmi |
| [Crypto icons](https://onchain-ui.dev/docs/standards/crypto-icons) | Editable token and network icon lookup functions |

See [Examples](https://onchain-ui.dev/docs/examples) for a portfolio card, wallet header, and pool positions. The [Recipes](https://onchain-ui.dev/docs/recipes/wallet-connection) show how to connect components to wagmi, TanStack Query, and TanStack Table.

## Use with AI assistants

The [shadcn MCP server](https://onchain-ui.dev/docs/mcp) reads the component index at [`/r/registry.json`](https://onchain-ui.dev/r/registry.json) so AI assistants can browse and install components. Component pages also include links to open supported demos in v0.

## Why

Wallet and portfolio screens need truncated addresses, name resolution, token icons, and formatted amounts. onchain-ui provides these as editable shadcn registry items.

The components target EVM chains and use viem for address handling and identity resolution. `ConnectWallet` adds wallet connections through wagmi.

## Status

onchain-ui is pre-1.0. Registry URLs use the stable `/r/{name}.json` format. Component APIs may change between minor versions.

## Local development

```bash
npm install     # install dependencies
npm run dev     # docs site at http://localhost:3000
npm run test    # registry contracts, component rendering, and input interaction tests
npm run build   # registry + site build
```

### Tests

Tests use Node 24's built-in test runner. Input interaction tests mount the actual
registry components with Testing Library and jsdom, exercising typing, pasting,
selection, focus, disabled/read-only states, error associations, and exact form
values. They run with the rest of the suite through `npm test` and in CI.

### wagmi, viem, and Tempo Accounts compatibility

The docs app and published registry items pin wagmi, viem, and the Tempo Accounts peer to the exact stack tested in CI. Their Tempo APIs can change across minor releases, so do not upgrade these dependencies in isolation or replace the exact versions with ranges.

Current tested stack: `wagmi@3.7.6`, `viem@2.55.19`, and `accounts@0.14.0`.

Check the stack monthly and before each release:

1. Read all three changelogs, paying particular attention to Tempo and connector changes.
2. Update the stack together with `npm install --save-exact wagmi@<version> viem@<version> accounts@<version>`.
3. Update the matching dependency pins in `registry/meta/`; the registry contract tests enforce that they match `package.json`.
4. Run `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build`.
5. Smoke-test `shadcn add @onchain-ui/connect-wallet` in a newly initialized shadcn app before publishing.

## Project structure

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

The build generates `registry.json` and `registry/generated/`. To change registry items, edit `registry/meta/` and the source components, then run `npm run registry:build`.

## Contributing

Open an issue or pull request with a bug fix, docs correction, or component proposal. For a new component, describe where you use it and include an example.

## Author

Created and maintained by [Gavin Jaynes](https://github.com/GavinJaynes).
