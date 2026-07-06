import { NextRequest, NextResponse } from "next/server";

import registryIndex from "@/registry.json";
import addressDisplay from "@/registry/generated/address-display.json";
import addressIdentity from "@/registry/generated/address-identity.json";
import assetRow from "@/registry/generated/asset-row.json";
import cryptoIcons from "@/registry/generated/crypto-icons.json";
import networkLogo from "@/registry/generated/network-logo.json";
import tokenBalance from "@/registry/generated/token-balance.json";
import tokenLogo from "@/registry/generated/token-logo.json";
import tokenPrice from "@/registry/generated/token-price.json";
import tokenStack from "@/registry/generated/token-stack.json";

type RegistryFile = {
  path: string;
  type: string;
  target: string;
  content?: string;
};

type RegistryItem = {
  name: string;
  files: RegistryFile[];
  [key: string]: unknown;
};

const registryItems = {
  "address-display": addressDisplay,
  "address-identity": addressIdentity,
  "asset-row": assetRow,
  "crypto-icons": cryptoIcons,
  "network-logo": networkLogo,
  "token-balance": tokenBalance,
  "token-logo": tokenLogo,
  "token-price": tokenPrice,
  "token-stack": tokenStack,
} satisfies Record<string, RegistryItem>;

export function generateStaticParams() {
  // Every item is reachable with and without a .json suffix, plus the
  // registry index itself — MCP clients and namespaced registry configs
  // request /r/registry.json and /r/{name}.json.
  return ["registry", ...Object.keys(registryItems)].flatMap((name) => [
    { name },
    { name: `${name}.json` },
  ]);
}

const responseHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name: rawName } = await params;
  const name = rawName.replace(/\.json$/, "");

  if (name === "registry") {
    return NextResponse.json(registryIndex, { headers: responseHeaders });
  }

  const meta = registryItems[name as keyof typeof registryItems];

  if (!meta) {
    return NextResponse.json(
      { error: `Component "${name}" not found` },
      { status: 404 }
    );
  }

  return NextResponse.json(meta, { headers: responseHeaders });
}
