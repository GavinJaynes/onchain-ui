# onchain-ui

Copy-paste web3 UI components for shadcn apps.

onchain-ui is an open source shadcn registry for product teams building onchain interfaces. The components are designed for wallet identity, token displays, chain context, balances, market values, and portfolio rows.

The project is built with Next.js, Fumadocs, Tailwind CSS, shadcn, wagmi, and viem.

## Status

This repo is early and moving quickly. The current focus is a small, useful registry of composable primitives rather than a broad component library.

The registry currently includes:

| Component | Install |
| --- | --- |
| Address Display | `npx shadcn add https://onchain-ui.dev/r/address-display` |
| Address Identity | `npx shadcn add https://onchain-ui.dev/r/address-identity` |
| Token Logo | `npx shadcn add https://onchain-ui.dev/r/token-logo` |
| Token Stack | `npx shadcn add https://onchain-ui.dev/r/token-stack` |
| Token Price | `npx shadcn add https://onchain-ui.dev/r/token-price` |
| Network Logo | `npx shadcn add https://onchain-ui.dev/r/network-logo` |
| Token Balance | `npx shadcn add https://onchain-ui.dev/r/token-balance` |
| Asset Row | `npx shadcn add https://onchain-ui.dev/r/asset-row` |
| Crypto Icons (adapter) | `npx shadcn add https://onchain-ui.dev/r/crypto-icons` |

## Why

Most crypto apps rebuild the same UI pieces: truncated addresses, ENS/Base name display, token icons, network badges, token amounts, price changes, and portfolio rows.

onchain-ui packages those patterns as shadcn registry items so the code lands inside your app. You can inspect it, edit it, replace icons, change styling, and wire it into your own data layer.

## Usage

Install any component directly with the shadcn CLI:

```bash
npx shadcn add https://onchain-ui.dev/r/address-display
```

Registry items include their required component files and small helper utilities. Some components also depend on common packages such as `viem`, `sonner`, `lucide-react`, and `@base-ui/react`.

## Local Development

Install dependencies:

```bash
npm install
```

Run the docs site:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Build the site and registry routes:

```bash
npm run build
```

Run registry contract tests:

```bash
npm run test
```

## Project Structure

```txt
app/
  (site)/            Home page
  (docs)/            Documentation pages
  r/[name]/route.ts  shadcn registry item endpoint
components/
  demos/             Live examples used in docs
  ui/                Local docs UI helpers
content/docs/        MDX documentation
lib/onchain/         Shared onchain utilities
registry/
  meta/              Registry item metadata
  onchain-ui/        Source components distributed by the registry
```

## Registry

The public registry index lives in `registry.json`.

Individual registry item URLs follow this shape:

```txt
https://onchain-ui.dev/r/<component-name>
```

For local development, the same route is available at:

```txt
http://localhost:3000/r/<component-name>
```

## Contributing

Issues and pull requests are welcome. The best contributions are small, practical components that solve repeated onchain product UI needs while staying easy to copy, inspect, and customize.

## Author

Created and maintained by [Gavin Jaynes](https://github.com/GavinJaynes).
