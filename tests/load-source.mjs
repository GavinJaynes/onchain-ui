import { existsSync, readFileSync } from "node:fs";
import { createRequire, registerHooks } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

// Exercise the shipped TS/TSX using the existing Node 24 test runner and
// TypeScript dependency. No generated test copies or browser mocks required.
const root = path.resolve(import.meta.dirname, "..");
registerHooks({
  resolve(specifier, context, nextResolve) {
    let candidate;
    if (specifier.startsWith("@/")) {
      candidate = path.join(root, specifier.slice(2));
    } else if (specifier.startsWith(".") && context.parentURL?.startsWith("file:")) {
      candidate = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);
    }
    if (candidate && !candidate.includes(`${path.sep}node_modules${path.sep}`)) {
      const resolved = [candidate, `${candidate}.ts`, `${candidate}.tsx`]
        .find((file) => /\.tsx?$/.test(file) && existsSync(file));
      if (resolved) return { url: pathToFileURL(resolved).href, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.startsWith("file:") && /\.tsx?$/.test(url) && !url.includes("/node_modules/")) {
      return {
        format: "commonjs",
        shortCircuit: true,
        source: ts.transpileModule(readFileSync(fileURLToPath(url), "utf8"), {
          compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2022,
            jsx: ts.JsxEmit.ReactJSX,
            esModuleInterop: true,
          },
          fileName: fileURLToPath(url),
        }).outputText,
      };
    }
    return nextLoad(url, context);
  },
});

const require = createRequire(import.meta.url);
export const loadSource = (file) => require(path.join(root, file));
