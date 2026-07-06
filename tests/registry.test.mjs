import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const registryIndexPath = path.join(root, "registry.json");
const metaDir = path.join(root, "registry", "meta");
const generatedDir = path.join(root, "registry", "generated");
const registryRoutePath = path.join(root, "app", "r", "[name]", "route.ts");

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf-8"));
}

async function getRegistryIndex() {
  return readJson(registryIndexPath);
}

async function getMetaFiles() {
  return (await readdir(metaDir))
    .filter((file) => file.endsWith(".json"))
    .sort();
}

async function getMetaItems() {
  const files = await getMetaFiles();
  return Promise.all(
    files.map(async (file) => ({
      file,
      item: await readJson(path.join(metaDir, file)),
    }))
  );
}

async function getGeneratedItem(name) {
  return readJson(path.join(generatedDir, `${name}.json`));
}

test("registry index is in sync with registry metadata", async () => {
  const registry = await getRegistryIndex();
  const metaItems = await getMetaItems();

  assert.equal(registry.name, "onchain-ui");
  assert.equal(registry.homepage, "https://onchain-ui.dev");
  assert.equal(registry.items.length, metaItems.length);

  const indexNames = registry.items.map((item) => item.name).sort();
  const metaNames = metaItems.map(({ item }) => item.name).sort();

  assert.deepEqual(indexNames, metaNames);
  assert.equal(new Set(indexNames).size, indexNames.length);
});

const allowedItemTypes = ["registry:ui", "registry:lib"];

test("registry index entries follow the registry.json spec", async () => {
  const registry = await getRegistryIndex();

  assert.equal(registry.$schema, "https://ui.shadcn.com/schema/registry.json");

  for (const item of registry.items) {
    assert.ok(
      allowedItemTypes.includes(item.type),
      `${item.name} has unexpected type ${item.type}`
    );
    assert.ok(item.title, `${item.name} is missing a title`);
    assert.ok(item.description, `${item.name} is missing a description`);
    assert.ok(
      Array.isArray(item.files) && item.files.length > 0,
      `${item.name} must list its files in the index`
    );

    for (const file of item.files) {
      assert.ok(file.path, `${item.name} has an index file without a path`);
      assert.ok(file.type, `${item.name} has an index file without a type`);
      assert.ok(file.target, `${item.name} has an index file without a target`);
      // The shadcn directory requires index items to omit file content.
      assert.equal(
        file.content,
        undefined,
        `${item.name} index files must not inline content`
      );
    }
  }
});

test("registry metadata files are valid and reference real source files", async () => {
  const metaItems = await getMetaItems();

  for (const { file, item } of metaItems) {
    assert.equal(file, `${item.name}.json`);
    assert.ok(
      allowedItemTypes.includes(item.type),
      `${item.name} has unexpected type ${item.type}`
    );
    assert.ok(item.title, `${item.name} is missing a title`);
    assert.ok(item.description, `${item.name} is missing a description`);
    assert.ok(Array.isArray(item.dependencies), `${item.name} dependencies must be an array`);
    assert.ok(
      Array.isArray(item.devDependencies),
      `${item.name} devDependencies must be an array`
    );
    assert.ok(
      Array.isArray(item.registryDependencies),
      `${item.name} registryDependencies must be an array`
    );
    assert.ok(Array.isArray(item.files), `${item.name} files must be an array`);
    assert.ok(item.files.length > 0, `${item.name} must include at least one file`);

    for (const sourceFile of item.files) {
      assert.ok(sourceFile.path, `${item.name} has a file without a path`);
      assert.ok(sourceFile.type, `${item.name} has a file without a type`);
      assert.ok(sourceFile.target, `${item.name} has a file without a target`);

      const fullPath = path.join(root, sourceFile.path);
      const sourceStat = await stat(fullPath);
      const content = await readFile(fullPath, "utf-8");

      assert.ok(sourceStat.isFile(), `${sourceFile.path} is not a file`);
      assert.ok(content.trim().length > 0, `${sourceFile.path} is empty`);
    }
  }
});

test("generated registry items include source file content", async () => {
  const metaItems = await getMetaItems();

  for (const { item } of metaItems) {
    const generated = await getGeneratedItem(item.name);

    assert.equal(generated.name, item.name);
    assert.equal(generated.files.length, item.files.length);

    for (const file of generated.files) {
      const sourceContent = await readFile(path.join(root, file.path), "utf-8");

      assert.ok(file.content, `${item.name} generated ${file.path} has no content`);
      assert.equal(file.content, sourceContent);
    }
  }
});

test("registry route statically imports every generated registry item", async () => {
  const routeSource = await readFile(registryRoutePath, "utf-8");
  const metaItems = await getMetaItems();

  for (const { item } of metaItems) {
    assert.ok(
      routeSource.includes(`@/registry/generated/${item.name}.json`),
      `route.ts does not import generated ${item.name}.json`
    );

    assert.match(
      routeSource,
      new RegExp(`"${item.name}"\\s*:`),
      `route.ts does not include ${item.name} in registryItems`
    );
  }
});

test("registry route serves the index and .json suffixed names", async () => {
  const routeSource = await readFile(registryRoutePath, "utf-8");

  assert.ok(
    routeSource.includes('@/registry.json'),
    "route.ts does not import the registry index"
  );
  assert.ok(
    routeSource.includes('name === "registry"'),
    "route.ts does not serve the registry index endpoint"
  );
  assert.ok(
    routeSource.includes('replace(/\\.json$/, "")'),
    "route.ts does not strip .json suffixes"
  );
});
