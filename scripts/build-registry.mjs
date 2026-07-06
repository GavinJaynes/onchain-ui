import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const metaDir = path.join(root, "registry", "meta");
const generatedDir = path.join(root, "registry", "generated");
const registryIndexPath = path.join(root, "registry.json");

const REGISTRY_NAME = "onchain-ui";
const REGISTRY_HOMEPAGE = "https://onchain-ui.dev";

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf-8"));
}

async function buildRegistryItem(metaFile) {
  const metaPath = path.join(metaDir, metaFile);
  const item = await readJson(metaPath);

  const files = await Promise.all(
    item.files.map(async (file) => ({
      ...file,
      content: await readFile(path.join(root, file.path), "utf-8"),
    }))
  );

  return {
    ...item,
    files,
  };
}

await rm(generatedDir, { recursive: true, force: true });
await mkdir(generatedDir, { recursive: true });

const metaFiles = (await readdir(metaDir))
  .filter((file) => file.endsWith(".json"))
  .sort();

const metaItems = [];

for (const metaFile of metaFiles) {
  const item = await buildRegistryItem(metaFile);
  metaItems.push(item);
  await writeFile(
    path.join(generatedDir, metaFile),
    `${JSON.stringify(item, null, 2)}\n`
  );
}

// The root registry.json is the public index (served at /r/registry.json for
// MCP clients and submitted to the shadcn directory). Per the registry spec,
// index items list files without their content.
const registryIndex = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: REGISTRY_NAME,
  homepage: REGISTRY_HOMEPAGE,
  items: metaItems.map((item) => ({
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    ...(item.dependencies?.length ? { dependencies: item.dependencies } : {}),
    ...(item.registryDependencies?.length
      ? { registryDependencies: item.registryDependencies }
      : {}),
    files: item.files.map(({ path: filePath, type, target }) => ({
      path: filePath,
      type,
      target,
    })),
  })),
};

await writeFile(
  registryIndexPath,
  `${JSON.stringify(registryIndex, null, 2)}\n`
);
