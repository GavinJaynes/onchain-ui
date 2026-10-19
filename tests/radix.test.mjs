import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { assertNoBaseOnlyApis, toRadix } from "../scripts/lib/to-radix.mjs";
import { isBaseUiStyle } from "../lib/registry-style.ts";

const radixDir = path.join(process.cwd(), "registry", "generated", "styles", "radix");

test("toRadix turns a render prop trigger into asChild with the element as child", () => {
  assert.equal(
    toRadix(`const a = <TooltipTrigger render={logo} />;`),
    `const a = <TooltipTrigger asChild>{logo}</TooltipTrigger>;`
  );
  assert.equal(
    toRadix(`const a = <DropdownMenuTrigger disabled render={<Button size="sm" />} />;`),
    `const a = <DropdownMenuTrigger disabled asChild><Button size="sm" /></DropdownMenuTrigger>;`
  );
});

test("toRadix drops closeOnClick and leaves other code alone", () => {
  const source = `const a = (\n  <DropdownMenuRadioItem\n    value="1"\n    closeOnClick\n    className="x"\n  />\n);`;
  assert.equal(
    toRadix(source),
    `const a = (\n  <DropdownMenuRadioItem\n    value="1"\n    className="x"\n  />\n);`
  );
  const untouched = `const b = <Tooltip><TooltipContent side="top">x</TooltipContent></Tooltip>;`;
  assert.equal(toRadix(untouched), untouched);
});

test("assertNoBaseOnlyApis ignores comments but catches code", () => {
  assert.doesNotThrow(() => assertNoBaseOnlyApis(`/** use render={<X />} */\nconst a = 1;`, "a.tsx"));
  assert.throws(() => assertNoBaseOnlyApis(`const a = <T render={x} />;`, "a.tsx"), /render prop/);
});

test("every Radix registry item is free of Base UI-only APIs", async () => {
  const files = (await readdir(radixDir)).filter((f) => f.endsWith(".json"));
  assert.ok(files.length > 0, "the Radix build is generated");
  for (const file of files) {
    const item = JSON.parse(await readFile(path.join(radixDir, file), "utf-8"));
    for (const f of item.files.filter((f) => f.path.endsWith(".tsx"))) {
      assertNoBaseOnlyApis(f.content, `${file}:${f.path}`);
    }
  }
});

test("base-* styles get the Base UI build and every other style gets Radix", () => {
  for (const style of ["base-nova", "base-vega"]) assert.equal(isBaseUiStyle(style), true);
  for (const style of ["new-york", "default", "radix-nova", "radix-vega"]) assert.equal(isBaseUiStyle(style), false);
});
