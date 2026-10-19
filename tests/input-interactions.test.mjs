import { dom } from "./dom-environment.mjs";
import assert from "node:assert/strict";
import { after, afterEach, test } from "node:test";
import { createElement as h, createRef, useState } from "react";
import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { loadSource } from "./load-source.mjs";

const { AmountInput } = loadSource("registry/onchain-ui/amount-input.tsx");
const { AssetInput } = loadSource("registry/onchain-ui/asset-input.tsx");

afterEach(cleanup);
after(() => dom.window.close());

function EditableAmount({ initial = "", ...props }) {
  const [value, onValueChange] = useState(initial);
  return h(AmountInput, { "aria-label": "Amount", ...props, value, onValueChange });
}

test("typing, blur and deletion preserve decimal editing states in the real input", async () => {
  const user = userEvent.setup();
  const view = render(h(EditableAmount, { decimals: 18 }));
  const input = view.getByRole("textbox", { name: "Amount" });
  await user.type(input, "0.");
  assert.equal(input.value, "0.");
  await user.type(input, "100");
  await user.tab();
  assert.equal(input.value, "0.100");
  await user.clear(input);
  assert.equal(input.value, "");
  await user.type(input, ".");
  assert.equal(input.value, ".");
});

test("pasting rejects an entire malformed or over-precision value", async () => {
  const user = userEvent.setup();
  const view = render(h(EditableAmount, { initial: "12.50", decimals: 6 }));
  const input = view.getByRole("textbox", { name: "Amount" });
  await user.click(input);
  for (const value of ["1e3", "-1", "1,000", "1.2.3", "1.1234567"]) {
    await user.keyboard("{Control>}a{/Control}");
    await user.paste(value);
    assert.equal(input.value, "12.50", `Rejected paste: ${value}`);
  }
});

test("selection replacement and arrow navigation never round or step amounts", async () => {
  const user = userEvent.setup();
  const view = render(h(EditableAmount, { initial: "12.34", decimals: 2 }));
  const input = view.getByRole("textbox", { name: "Amount" });
  await user.click(input);
  input.setSelectionRange(0, 2);
  await user.type(input, "9", { skipClick: true });
  assert.equal(input.value, "9.34");
  await user.keyboard("{ArrowUp}{ArrowDown}");
  assert.equal(input.value, "9.34");
  assert.equal(input.type, "text");
  assert.equal(input.inputMode, "decimal");
});

test("form submission and the forwarded ref preserve the exact amount string", async () => {
  const user = userEvent.setup();
  const ref = createRef();
  const exact = "9007199254740993.123456789012345678";
  let submitted;
  const view = render(h("form", {
    onSubmit: (event) => {
      event.preventDefault();
      submitted = new dom.window.FormData(event.currentTarget).get("amount");
    },
  }, h(EditableAmount, { name: "amount", decimals: 18, ref }), h("button", { type: "submit" }, "Review")));
  const input = view.getByRole("textbox", { name: "Amount" });
  assert.equal(ref.current, input);
  await user.click(input);
  await user.paste(exact);
  await user.click(view.getByRole("button", { name: "Review" }));
  assert.equal(submitted, exact);
});

test("asset labels focus the right field and error associations update", async () => {
  const user = userEvent.setup();
  const props = { label: "Sell", value: "1", description: "Estimate", "aria-describedby": "fees" };
  const view = render(h(AssetInput, { ...props, error: "Insufficient balance" }));
  const input = view.getByRole("textbox", { name: "Sell" });
  await user.click(view.getByText("Sell", { selector: "label" }));
  assert.equal(dom.window.document.activeElement, input);
  assert.equal(input.getAttribute("aria-invalid"), "true");
  assert.equal(input.getAttribute("aria-describedby"), `fees ${input.id}-description ${input.id}-error`);
  assert.equal(view.getByRole("alert").id, `${input.id}-error`);
  view.rerender(h(AssetInput, props));
  assert.equal(view.queryByRole("alert"), null);
  assert.notEqual(input.getAttribute("aria-invalid"), "true");
  assert.equal(input.getAttribute("aria-describedby"), `fees ${input.id}-description`);
});

test("a disabled asset field blocks input and native slot buttons", async () => {
  const user = userEvent.setup();
  let actions = 0;
  const view = render(h(AssetInput, {
    label: "Sell", value: "1", disabled: true,
    onValueChange: () => actions++,
    asset: h("button", { type: "button", onClick: () => actions++ }, "Select token"),
    footer: h("button", { type: "button", onClick: () => actions++ }, "Max"),
  }));
  await user.click(view.getByRole("button", { name: "Max" }));
  await user.click(view.getByRole("button", { name: "Select token" }));
  await user.type(view.getByRole("textbox", { name: "Sell" }), "2");
  assert.equal(actions, 0);
  assert.equal(view.getByRole("textbox", { name: "Sell" }).value, "1");
});

test("read-only receive fields allow token selection and parent quote updates", async () => {
  const user = userEvent.setup();
  let selections = 0;
  const props = {
    label: "Receive", readOnly: true,
    asset: h("button", { type: "button", onClick: () => selections++ }, "Select token"),
  };
  const view = render(h(AssetInput, { ...props, value: "0.42" }));
  const input = view.getByRole("textbox", { name: "Receive" });
  await user.type(input, "5");
  await user.click(view.getByRole("button", { name: "Select token" }));
  assert.equal(input.value, "0.42");
  assert.equal(selections, 1);
  view.rerender(h(AssetInput, { ...props, value: "0.123456789012345678" }));
  assert.equal(input.value, "0.123456789012345678");
});

test("a token precision change does not silently round an existing value", async () => {
  const user = userEvent.setup();
  const view = render(h(EditableAmount, { initial: "1.12345678", decimals: 18 }));
  const input = view.getByRole("textbox", { name: "Amount" });
  view.rerender(h(EditableAmount, { initial: "1.12345678", decimals: 6 }));
  assert.equal(input.value, "1.12345678");
  await user.clear(input);
  await user.type(input, "1.1234567");
  assert.equal(input.value, "1.123456");
});

test("a suffix sits inside the field, stays out of the accessible name, and pads the text clear of it", async () => {
  const user = userEvent.setup();
  const view = render(h(EditableAmount, { decimals: 6, suffix: "USDC" }));
  const input = view.getByRole("textbox", { name: "Amount" });
  const group = input.closest('[data-slot="amount-input-group"]');
  assert.ok(group, "the input is wrapped in a group");
  const suffix = view.getByText("USDC");
  assert.equal(suffix.getAttribute("aria-hidden"), "true");
  assert.ok(input.style.getPropertyValue("--amount-input-suffix"), "end padding is set");
  await user.type(input, "1.25");
  assert.equal(input.value, "1.25");
});

test("without a suffix the field renders bare, as before", () => {
  const view = render(h(EditableAmount, {}));
  const input = view.getByRole("textbox", { name: "Amount" });
  assert.equal(input.closest('[data-slot="amount-input-group"]'), null);
  assert.equal(input.style.getPropertyValue("--amount-input-suffix"), "");
});
