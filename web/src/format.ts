import type { Status } from "./types";

export const STATUS_LABEL: Record<Status, string> = {
  draf: "Draf",
  direvisi: "Direvisi",
  final: "Final",
};

export function formatDate(value: string): string {
  if (!value) return "";
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export function formatNumber(n: number): string {
  return n.toLocaleString("id-ID");
}

export function readingMinutes(words: number): number {
  return Math.max(1, Math.round(words / 200));
}
