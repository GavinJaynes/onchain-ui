"use client";

import type * as PageTree from "fumadocs-core/page-tree";
import type { ReactNode } from "react";

export function SidebarFolderHeading({
  item,
  children,
}: {
  item: PageTree.Folder;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5 my-4">
      <div className="px-2 pt-4 pb-1 text-xs font-medium text-fd-muted-foreground first:pt-0">
        {item.name}
      </div>
      {children}
    </div>
  );
}
