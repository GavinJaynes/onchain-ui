import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";

import addressDisplay from "@/registry/meta/address-display.json";
import addressIdentity from "@/registry/meta/address-identity.json";
import assetRow from "@/registry/meta/asset-row.json";
import networkLogo from "@/registry/meta/network-logo.json";
import tokenBalance from "@/registry/meta/token-balance.json";
import tokenLogo from "@/registry/meta/token-logo.json";
import tokenPrice from "@/registry/meta/token-price.json";
import tokenStack from "@/registry/meta/token-stack.json";

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
  "network-logo": networkLogo,
  "token-balance": tokenBalance,
  "token-logo": tokenLogo,
  "token-price": tokenPrice,
  "token-stack": tokenStack,
} satisfies Record<string, RegistryItem>;

const sourceFiles: Record<string, string> = {
  "components/ui/tooltip.tsx": readSourceFile(
    "../../../components/ui/tooltip.tsx"
  ),
  "lib/onchain/format.ts": readSourceFile("../../../lib/onchain/format.ts"),
  "lib/onchain/resolvers.ts": readSourceFile("../../../lib/onchain/resolvers.ts"),
  "registry/onchain-ui/address-display.tsx": readSourceFile(
    "../../../registry/onchain-ui/address-display.tsx"
  ),
  "registry/onchain-ui/address-identity.tsx": readSourceFile(
    "../../../registry/onchain-ui/address-identity.tsx"
  ),
  "registry/onchain-ui/asset-row.tsx": readSourceFile(
    "../../../registry/onchain-ui/asset-row.tsx"
  ),
  "registry/onchain-ui/network-logo.tsx": readSourceFile(
    "../../../registry/onchain-ui/network-logo.tsx"
  ),
  "registry/onchain-ui/token-balance.tsx": readSourceFile(
    "../../../registry/onchain-ui/token-balance.tsx"
  ),
  "registry/onchain-ui/token-logo.tsx": readSourceFile(
    "../../../registry/onchain-ui/token-logo.tsx"
  ),
  "registry/onchain-ui/token-price.tsx": readSourceFile(
    "../../../registry/onchain-ui/token-price.tsx"
  ),
  "registry/onchain-ui/token-stack.tsx": readSourceFile(
    "../../../registry/onchain-ui/token-stack.tsx"
  ),
};

function readSourceFile(path: string) {
  return readFileSync(new URL(path, import.meta.url), "utf-8");
}

export function generateStaticParams() {
  return Object.keys(registryItems).map((name) => ({ name }));
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const meta = registryItems[name as keyof typeof registryItems];

  if (!meta) {
    return NextResponse.json(
      { error: `Component "${name}" not found` },
      { status: 404 }
    );
  }

  const files = meta.files.map((file) => ({
    ...file,
    content: sourceFiles[file.path] ?? "",
  }));

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
