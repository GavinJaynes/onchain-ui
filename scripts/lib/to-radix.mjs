import ts from "typescript";

/**
 * Rewrites a registry source written against Base UI (the docs site's base)
 * into the Radix dialect, so `/r/{style}/{name}.json` can serve shadcn apps on
 * either primitive library.
 *
 * Added 2026-10-19 after installing into bskts, a new-york (Radix) app: the
 * CLI resolves `tooltip` to the app's own Radix tooltip, and Base UI's
 * `<TooltipTrigger render={el} />` does nothing there. Only the APIs that
 * differ are touched, by AST position, so the rest of the file stays as
 * written:
 *
 * - `<XTrigger render={el} />` becomes `<XTrigger asChild>{el}</XTrigger>`.
 * - `closeOnClick` is dropped: Radix menu items close on select by default.
 *
 * Anything else Base UI-only should be written portably in the source (see
 * ChainSelect's string radio values). `assertNoBaseOnlyApis` fails the build
 * if a new one slips in.
 */
export function toRadix(source, fileName = "file.tsx") {
  const sf = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const edits = [];
  const text = (node) => source.slice(node.getStart(sf), node.getEnd());

  const visit = (node) => {
    if (ts.isJsxSelfClosingElement(node) && text(node.tagName).endsWith("Trigger")) {
      const props = node.attributes.properties;
      const render = props.find((p) => ts.isJsxAttribute(p) && p.name.getText(sf) === "render");
      if (render && render.initializer && ts.isJsxExpression(render.initializer)) {
        const child = render.initializer.expression;
        const rest = props.filter((p) => p !== render).map(text);
        const tag = text(node.tagName);
        const attrs = [...rest, "asChild"].join(" ");
        // A bare identifier needs braces as a child; JSX can be inlined as is.
        const inner = ts.isJsxElement(child) || ts.isJsxSelfClosingElement(child) ? text(child) : `{${text(child)}}`;
        edits.push({ start: node.getStart(sf), end: node.getEnd(), text: `<${tag} ${attrs}>${inner}</${tag}>` });
        return; // the child was copied verbatim; nothing inside needs rewriting
      }
    }
    if (ts.isJsxAttribute(node) && node.name.getText(sf) === "closeOnClick") {
      // take the whitespace before the attribute with it
      let start = node.getStart(sf);
      while (start > 0 && /\s/.test(source[start - 1])) start--;
      edits.push({ start, end: node.getEnd(), text: "" });
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);

  let out = source;
  for (const e of edits.sort((a, b) => b.start - a.start)) {
    out = out.slice(0, e.start) + e.text + out.slice(e.end);
  }
  return out;
}

const BASE_ONLY = [
  { re: /\brender=\{/, why: "Base UI render prop" },
  { re: /\bcloseOnClick\b/, why: "Base UI menu prop" },
  { re: /@base-ui\/react/, why: "Base UI import" },
];

/** Throws when a Radix-dialect source still uses a Base UI-only API. */
export function assertNoBaseOnlyApis(source, fileName) {
  // Comments may mention the Base UI form (wallet-button documents it).
  const code = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
  for (const { re, why } of BASE_ONLY) {
    if (re.test(code)) throw new Error(`${fileName}: ${why} survives the Radix build (${re})`);
  }
}
