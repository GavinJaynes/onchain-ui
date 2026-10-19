import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./load-source.mjs";

const render = (file, name, props) => renderToStaticMarkup(createElement(loadSource(`registry/onchain-ui/${file}.tsx`)[name], props));
const address = "0x0000000000000000000000000000000000000001";

test("price and balance displays handle unavailable, tiny, and conflicting digit inputs", () => {
  for (const value of [null, undefined, "", NaN, Infinity]) {
    assert.match(render("token-price", "TokenPrice", { value }), /--/);
  }
  assert.match(render("token-price", "TokenPrice", { value: 0.00000041, locale: "en-US" }), /0\.00000041/);
  assert.match(render("token-balance", "TokenBalance", { amount: 1.2, showLogo: false, minimumFractionDigits: 6, maximumFractionDigits: 2, locale: "en-US" }), /1\.200000/);
  assert.doesNotMatch(render("token-price", "TokenPrice", { value: 1, change: NaN }), /NaN/);
});

test("address display copies the underlying address and omits unknown explorer links", async () => {
  const { AddressDisplay } = loadSource("registry/onchain-ui/address-display.tsx");
  const original = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  let copied;
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: { clipboard: { writeText: async (value) => { copied = value; } } } });
  try {
    const element = AddressDisplay({ address, label: "Account", chainId: 999999 });
    await element.props.children[0].props.onClick();
    assert.equal(copied, address);
    const html = render("address-display", "AddressDisplay", { address, chainId: 999999 });
    assert.doesNotMatch(html, /<a /);
    assert.match(render("address-display", "AddressDisplay", { address }), /etherscan\.io\/address\//);
  } finally {
    if (original) Object.defineProperty(globalThis, "navigator", original);
    else delete globalThis.navigator;
  }
});

test("logos, stacks, and rows render useful fallback states", () => {
  assert.match(render("token-logo", "TokenLogo", { symbol: "TEST" }), /TEST/);
  assert.match(render("network-logo", "NetworkLogo", { chainId: 987654, size: "xs" }), /\?/);
  const stack = render("token-stack", "TokenStack", { tokens: [{ symbol: "AAA" }, { symbol: "BBB" }, { symbol: "CCC" }], limit: 1 });
  assert.match(stack, /2 more tokens/);
  const row = render("asset-row", "AssetRow", { symbol: "TEST", amount: null, value: null });
  assert.match(row, /TEST/);
  assert.doesNotMatch(row, /NaN|\$0\.00/);
});

test("price change colours use theme tokens", () => {
  assert.match(render("token-price", "TokenPrice", { value: 1, change: 2.5 }), /text-positive/);
  assert.match(render("token-price", "TokenPrice", { value: 1, change: -2.5 }), /text-negative/);
  assert.match(render("token-price", "TokenPrice", { value: 1, change: 0 }), /text-muted-foreground/);
});

test("Robinhood Chain is a known network with its Blockscout explorer", () => {
  const { getExplorerUrl, getNetworkMeta } = loadSource("lib/onchain/config.ts");
  assert.deepEqual(getNetworkMeta(4663), { name: "Robinhood Chain", symbol: "RH" });
  assert.equal(getExplorerUrl(4663), "https://robinhoodchain.blockscout.com");
  assert.match(render("address-display", "AddressDisplay", { address, chainId: 4663 }), /href="https:\/\/robinhoodchain\.blockscout\.com\/address\/0x0+1"/);
  const logo = render("network-logo", "NetworkLogo", { chainId: 4663, size: "xs" });
  assert.match(logo, />RH</);
});

test("token logos and stacks accept a pixel size", () => {
  const logo = render("token-logo", "TokenLogo", { symbol: "ETH", size: 28 });
  assert.match(logo, /style="width:28px;height:28px;font-size:11px"/);
  assert.doesNotMatch(logo, /size-8/);
  const stack = render("token-stack", "TokenStack", { tokens: [{ symbol: "AAA" }, { symbol: "BBB" }], limit: 1, size: 28 });
  assert.equal([...stack.matchAll(/width:28px;height:28px/g)].length, 2);
});

test("connector list blocks selection during connection and handles an empty list", () => {
  assert.match(render("connector-list", "ConnectorList", { connectors: [], onSelect: () => {} }), /No compatible wallet/);
  const html = render("connector-list", "ConnectorList", { connectors: [{ id: "a", name: "Wallet A" }, { id: "b", name: "Wallet B" }], pendingId: "a", onSelect: () => {} });
  assert.equal([...html.matchAll(/<button[^>]*disabled=""/g)].length, 2);
});

test("house formats replace the Intl defaults for price, change and amount", () => {
  const price = render("token-price", "TokenPrice", {
    value: 1234.5,
    change: 0.0374,
    format: (v) => `$${Math.round(v)}`,
    formatChange: (c) => `+${(c * 100).toFixed(2)}%`,
  });
  assert.match(price, /\$1235/);
  assert.match(price, /\+3\.74%/);
  assert.doesNotMatch(price, /1,234\.50/);

  const row = render("asset-row", "AssetRow", {
    symbol: "MAG6",
    amount: 1.5,
    formatAmount: (n) => `${n} units`,
  });
  assert.match(row, /1\.5 units/);
  assert.doesNotMatch(row, /1\.5 MAG6/, "the default amount format is replaced");
});

test("asset row takes a logo slot, a description line and a small size, in button-safe markup", () => {
  const row = render("asset-row", "AssetRow", {
    symbol: "MAG6",
    name: "Mega-cap Tech",
    size: "sm",
    logo: createElement("i", { "data-testid": "custom-logo" }),
    description: "MAG6 · 0x6A19…f6d9",
  });
  assert.match(row, /data-testid="custom-logo"/);
  assert.doesNotMatch(row, /<img/, "the default TokenLogo is replaced");
  assert.match(row, /MAG6 · 0x6A19…f6d9/);
  assert.match(row, /py-2\.5/);
  assert.doesNotMatch(row, /<(div|p)[\s>]/, "only phrasing content, valid inside <button>");
});
