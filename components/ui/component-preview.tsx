import { codeToHtml } from "shiki";
import { ComponentPreviewClient } from "./component-preview-client";

interface ComponentPreviewProps {
  name: string;
  code: string;
}

export async function ComponentPreview({ name, code }: ComponentPreviewProps) {
  const highlightedCode = await codeToHtml(code.trim(), {
    lang: "tsx",
    themes: {
      light: "github-light",
      dark: "github-dark-dimmed",
    },
    defaultColor: false,
  });

  return <ComponentPreviewClient name={name} highlightedCode={highlightedCode} />;
}
