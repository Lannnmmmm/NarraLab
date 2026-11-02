import { useMemo } from "react";
import { renderMarkdown } from "../markdown";

// HTML hasil renderMarkdown sudah disterilkan (lihat markdown.ts).
export default function Prose({ text }: { text: string }) {
  const html = useMemo(() => renderMarkdown(text), [text]);
  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
}
