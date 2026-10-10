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

test("connector list blocks selection during connection and handles an empty list", () => {
  assert.match(render("connector-list", "ConnectorList", { connectors: [], onSelect: () => {} }), /No compatible wallet/);
  const html = render("connector-list", "ConnectorList", { connectors: [{ id: "a", name: "Wallet A" }, { id: "b", name: "Wallet B" }], pendingId: "a", onSelect: () => {} });
  assert.equal([...html.matchAll(/<button[^>]*disabled=""/g)].length, 2);
});
