import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;

  try {
    const filePath = join(process.cwd(), "public", "r", `${name}.json`);
    const content = readFileSync(filePath, "utf-8");
    const json = JSON.parse(content);

    return NextResponse.json(json, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json(
      { error: `Component "${name}" not found` },
      { status: 404 }
    );
  }
}
