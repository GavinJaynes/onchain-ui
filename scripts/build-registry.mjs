import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const metaDir = path.join(root, "registry", "meta");
const generatedDir = path.join(root, "registry", "generated");

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

for (const metaFile of metaFiles) {
  const item = await buildRegistryItem(metaFile);
  await writeFile(
    path.join(generatedDir, metaFile),
    `${JSON.stringify(item, null, 2)}\n`
  );
}
