# Roadmap

This is a working roadmap for future Onchain UI sessions. It is intentionally practical: each section should turn into shippable tasks, tests, or documentation.

## 1. Automated Testing

Add enough test coverage to catch regressions before publishing.

- Add unit tests for formatting helpers in `lib/onchain`.
- Add component render tests for registry components.
- Add route tests for `/r/[name]` registry responses.
- Verify every registry item includes the expected files and content.
- Add at least one CI workflow that runs build, typecheck, lint, and tests.

## 2. Publish the Registry

Get the public shadcn registry into a reliable launch shape.

- Confirm `onchain-ui.dev` deployment target and DNS.
- Verify `registry.json` resolves publicly.
- Verify each `/r/<component-name>` endpoint works in production.
- Test `npx shadcn add https://onchain-ui.dev/r/<component-name>` against a fresh shadcn app.
- Decide whether registry item URLs should be versioned or kept latest-only for now.
- Add release/publish notes to the README or docs.

## 3. Manual Component and DX Testing

Use the components the way a real developer would.

- Install each registry item into a fresh app.
- Confirm dependencies install cleanly.
- Confirm imported paths match shadcn conventions.
- Check copy buttons, explorer links, tooltips, fallbacks, and loading states.
- Test in light and dark mode.
- Test narrow/mobile layouts for long addresses, token names, and large balances.
- Note any confusing props, naming, defaults, or docs examples.

## 4. Mini App for Dogfooding

Build a small product-like app that uses the registry components together.

- Create a compact wallet/portfolio screen.
- Include address identity, asset rows, token logos, network logos, balances, and prices.
- Use realistic mock data first.
- Optionally wire in wagmi/viem data later.
- Use the mini app to catch composition, spacing, and data-shape problems.
- Keep it separate from marketing/docs so it feels like a real consumer app.

## 5. Standards

Expand the standards docs so components stay consistent as the registry grows.

- Extend icon resolution standards.
- Document the `chainId`-first contract for network logos: `<NetworkLogo chainId={8453} />` should work for supported chains.
- Document token icon resolution separately from network icon resolution; token symbols are not canonical.
- Define recommended token metadata and network metadata shapes.
- Add formatting standards for balances, prices, percentages, and tiny values.
- Add address and identity resolution standards.
- Add accessibility standards for copy buttons, tooltips, links, and loading states.
- Add dependency standards for when registry items may introduce new packages.
- Add component API standards for names, prop defaults, className escape hatches, and fallback behavior.

## 6. Recipes

Add a Recipes section for bigger implementation patterns that should not become custom components.

- Wallet connection recipe using wagmi/viem and a recommended wallet UI library where appropriate.
- Portfolio table recipe using TanStack Table plus virtualization instead of rebuilding table behavior.
- Token selector recipe with search, recent tokens, token metadata, network badges, and unknown-token fallbacks.
- Transaction history recipe with explorer links, status treatment, address display, and network context.
- Swap quote recipe with route/token stack, price impact, slippage, quote expiry, and loading states.
- Index/basket recipe inspired by INDX: token stack, allocation, basket value, and market movement.
- Make recipes clearly separate from installable primitives: recipes recommend libraries and composition patterns.

## 7. Crypto Icon System

Decide how onchain-ui should support crypto icon variety without making every component depend on one icon package.

- Keep `NetworkLogo` simple: supported `chainId` values should render built-in logos automatically.
- Keep explicit overrides: `src`, `fallback`, and eventual `icon` or render hooks should win over built-ins.
- Consider a local `crypto-icons.tsx` adapter file that components can import.
- Explore an optional Cryptocons-backed adapter or registry variant.
- Keep the default bundle small; support common networks first and let long-tail chains use explicit overrides.
- Treat token icons differently from network icons: prefer token metadata `logoURI` and avoid symbol-only identity.
- Add docs explaining that obscure chains/tokens should never render broken images or blank UI.

## 8. Real-World Examples

Build examples that show the primitives working together in product-like web3 screens.

- Mock wallet portfolio using `AddressIdentity`, `AssetRow`, `TokenBalance`, `NetworkLogo`, and `TokenPrice`.
- Market/watchlist screen using `AssetRow` without balances.
- Index/basket screen using `TokenStack`, allocation, price, and change.
- Token selector screen using token metadata, chain filtering, and logo fallbacks.
- Keep these examples closer to app UI than marketing UI.
- Use the examples to discover missing props, awkward data shapes, spacing issues, and mobile problems.

## 9. Project Presentation

Keep the project useful first, but make it easy to evaluate as personal work.

- Improve README with the project story, install examples, implemented components, and roadmap.
- Add a short design-decisions section: shadcn registry, copy-paste ownership, wagmi/viem, icon resolution, recipes, and standards.
- Make docs polished enough to demonstrate product taste and engineering judgment.
- Keep the repository under the personal GitHub account unless there is a later reason to move to an org.
- Prefer a stable public domain for registry install URLs so repo ownership can change without breaking installs.

## Near-Term Suggested Order

1. Add registry response tests.
2. Stabilize `NetworkLogo` and the icon resolution story.
3. Build the mini app with mock data.
4. Manually install every registry item into a fresh app.
5. Add first Recipes pages: wallet connection and portfolio table.
6. Expand standards based on what the mini app reveals.
7. Polish README and project presentation.
8. Publish once the install flow and docs feel boringly reliable.
