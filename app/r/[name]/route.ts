import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;

  const metaPath = join(process.cwd(), "registry", "meta", `${name}.json`);

  if (!existsSync(metaPath)) {
    return NextResponse.json(
      { error: `Component "${name}" not found` },
      { status: 404 }
    );
  }

  const meta = JSON.parse(readFileSync(metaPath, "utf-8"));

  // Inject file content into each file entry
  const files = meta.files.map((file: { path: string; type: string; target: string }) => {
    const sourcePath = join(process.cwd(), file.path);
    const content = existsSync(sourcePath)
      ? readFileSync(sourcePath, "utf-8")
      : "";
    return { ...file, content };
  });

  return NextResponse.json(
    { ...meta, files },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
