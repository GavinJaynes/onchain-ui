import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./load-source.mjs";

const { AmountInput, isAmountInputValue } = loadSource("registry/onchain-ui/amount-input.tsx");
const { AssetInput } = loadSource("registry/onchain-ui/asset-input.tsx");

test("amount editing preserves incomplete values and exact decimal strings", () => {
  const values = ["", ".", "0.", ".5", "1.00", "0001.50", "0.000000000000000001", "9007199254740993.123456789012345678"];
  const changes = [];
  const input = AmountInput({ value: "", onValueChange: (value) => changes.push(value), decimals: 18 });
  for (const value of values) input.props.onChange({ target: { value } });
  assert.deepEqual(changes, values);
});

test("invalid edits are rejected whole without changing their meaning", () => {
  const changes = [];
  const input = AmountInput({ value: "12", onValueChange: (value) => changes.push(value), decimals: 6 });
  for (const value of ["1e3", "-1", "+1", "1,000", "1,5", "1.2.3", " 1 ", "1\n", "NaN", "Infinity", "0x10", "１２", "1.1234567"]) {
    input.props.onChange({ target: { value } });
  }
  assert.deepEqual(changes, []);
});

test("precision limits support integer tokens and do not round", () => {
  assert.equal(isAmountInputValue("123", 0), true);
  assert.equal(isAmountInputValue("", 0), true);
  assert.equal(isAmountInputValue("1.", 0), false);
  assert.equal(isAmountInputValue(".1", 0), false);
  assert.equal(isAmountInputValue("1.123456", 6), true);
  assert.equal(isAmountInputValue("1.1234560", 6), false);
  assert.equal(isAmountInputValue(`0.${"1".repeat(80)}`), true);
  for (const decimals of [-1, 1.5, NaN, Infinity]) {
    assert.equal(isAmountInputValue("1", decimals), false);
  }
});

test("read-only and disabled inputs never emit edits and external values stay intact", () => {
  for (const state of [{ readOnly: true }, { disabled: true }]) {
    const input = AmountInput({ value: "9007199254740993.000000000000000001", onValueChange: () => assert.fail("unexpected edit"), ...state });
    input.props.onChange({ target: { value: "2" } });
    assert.equal(input.props.value, "9007199254740993.000000000000000001");
  }
  assert.equal(AmountInput({ value: "1" }).props.readOnly, true);
});

test("native form props and refs reach the text input", () => {
  const ref = { current: null };
  const onBlur = () => {};
  const input = AmountInput({ value: "1.00", name: "sellAmount", ref, onBlur, required: true, "aria-label": "Sell amount" });
  assert.equal(input.props.type, "text");
  assert.equal(input.props.inputMode, "decimal");
  assert.equal(input.props.ref, ref);
  assert.equal(input.props.onBlur, onBlur);
  assert.equal(input.props.name, "sellAmount");
  assert.equal(input.props.required, true);
});

test("asset field associates its label, description, error and caller help", () => {
  const html = renderToStaticMarkup(createElement(AssetInput, {
    id: "sell", label: "Sell", value: "10", description: "Estimated value", error: "Insufficient balance", "aria-describedby": "fees",
  }));
  assert.match(html, /<label[^>]*for="sell"/);
  assert.match(html, /aria-describedby="fees sell-description sell-error"/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /<div[^>]*role="alert"[^>]*id="sell-error"/);
});

test("asset fields get unique IDs and disable slot controls with a fieldset", () => {
  const html = renderToStaticMarkup(createElement("form", null,
    createElement(AssetInput, { label: "First", value: "", disabled: true, asset: createElement("button", { type: "button" }, "Select") }),
    createElement(AssetInput, { label: "Second", value: "", readOnly: true }),
  ));
  const ids = [...html.matchAll(/<input[^>]*id="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, 2);
  assert.equal(new Set(ids).size, 2);
  assert.match(html, /<fieldset[^>]*disabled=""/);
  assert.doesNotMatch(html, /aria-invalid="true"/);
});
