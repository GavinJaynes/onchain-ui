import { codeToHtml } from "shiki";
import { ComponentPreviewClient } from "./component-preview-client";

interface ComponentPreviewProps {
  name: string;
  code: string;
}

export async function ComponentPreview({ name, code }: ComponentPreviewProps) {
  const raw = code.trim();

  const highlightedCode = await codeToHtml(raw, {
    lang: "tsx",
    themes: {
      light: "github-light",
      dark: "github-dark-dimmed",
    },
    defaultColor: false,
  });

  return (
    <ComponentPreviewClient
      name={name}
      highlightedCode={highlightedCode}
      rawCode={raw}
    />
  );
}
