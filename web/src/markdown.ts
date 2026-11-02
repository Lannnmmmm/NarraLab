import { Marked } from "marked";

// Naskah ditulis oleh AI dan repo ini publik, jadi HTML mentah di dalam Markdown
// tidak pernah dirender: tag dijadikan teks biasa, dan tautan berskema berbahaya
// (javascript:, data:, dst.) dibuang.

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const hasScheme = (href: string) => /^[a-z][a-z0-9+.-]*:/i.test(href);
const isSafeHref = (href: string) => !hasScheme(href) || /^(https?:|mailto:)/i.test(href);

const md = new Marked({ gfm: true, breaks: false });

md.use({
  renderer: {
    html({ text }) {
      return escapeHtml(text);
    },
    image({ text }) {
      return escapeHtml(text);
    },
    link({ href, title, tokens }) {
      const inner = this.parser.parseInline(tokens);
      if (!isSafeHref(href)) return inner;
      const t = title ? ` title="${escapeHtml(title)}"` : "";
      return `<a href="${escapeHtml(href)}"${t} target="_blank" rel="noopener noreferrer">${inner}</a>`;
    },
  },
});

export function renderMarkdown(source: string): string {
  return md.parse(source, { async: false });
}
