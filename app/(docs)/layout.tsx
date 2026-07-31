import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { ThemeSwitch } from "fumadocs-ui/layouts/shared/slots/theme-switch";
import type { ReactNode } from "react";
import { baseOptions } from "@/app/layout.config";
import { SidebarFolderHeading } from "@/components/docs/sidebar-folder-heading";
import { source } from "@/lib/source";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      {...baseOptions}
      links={baseOptions.links?.filter(
        (link) => !("text" in link) || link.text !== "Docs",
      )}
      themeSwitch={{ enabled: false }}
      nav={{
        ...baseOptions.nav,
        children: <ThemeSwitch className="rounded-md border-0 p-0.5" />,
      }}
      sidebar={{
        components: { Folder: SidebarFolderHeading },
      }}
    >
      {children}
    </DocsLayout>
  );
}
