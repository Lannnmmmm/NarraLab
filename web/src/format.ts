import type { Status } from "./types";

export const STATUS_LABEL: Record<Status, string> = {
  draf: "Draf",
  direvisi: "Direvisi",
  final: "Terbit",
};

export function formatDate(value: string): string {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export function formatNumber(value: number): string {
  return value.toLocaleString("id-ID");
}

export function readingMinutes(words: number): number {
  return Math.max(1, Math.round(words / 200));
}
