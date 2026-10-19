import { NextRequest, NextResponse } from "next/server";

import registryIndex from "@/registry.json";
import { baseRegistryItems } from "@/registry/generated";
import { radixRegistryItems } from "@/registry/generated/styles/radix";
import { isBaseUiStyle, KNOWN_STYLES } from "@/lib/registry-style";

/**
 * Per-style registry items: `/r/{style}/{name}.json`.
 *
 * The shadcn CLI fills `{style}` from the app's components.json when the
 * namespace is registered as `https://onchain-ui.dev/r/{style}/{name}.json`.
 * Base UI styles (`base-*`) get the source as written. Every other style
 * (`new-york`, `default`, `radix-*`) gets the Radix build from
 * scripts/lib/to-radix.mjs. Added 2026-10-19: a new-york app installing the
 * Base UI source got `<TooltipTrigger render={…} />`, which Radix ignores.
 *
 * `/r/{name}.json` keeps serving the Base UI source, so existing installs and
 * saved namespace URLs behave as before.
 */
export function generateStaticParams() {
  return KNOWN_STYLES.flatMap((style) =>
    ["registry", ...Object.keys(baseRegistryItems)].flatMap((name) => [
      { style, name },
      { style, name: `${name}.json` },
    ])
  );
}

const responseHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ style: string; name: string }> }
) {
  const { style, name: rawName } = await params;
  const name = rawName.replace(/\.json$/, "");

  if (name === "registry") {
    return NextResponse.json(registryIndex, { headers: responseHeaders });
  }

  const items = isBaseUiStyle(style) ? baseRegistryItems : radixRegistryItems;
  const item = items[name as keyof typeof items];

  if (!item) {
    return NextResponse.json(
      { error: `Component "${name}" not found` },
      { status: 404 }
    );
  }

  return NextResponse.json(item, { headers: responseHeaders });
}
