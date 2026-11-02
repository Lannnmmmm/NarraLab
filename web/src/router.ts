import { useEffect, useState } from "react";

// Routing berbasis hash (#/...) supaya jalan di GitHub Pages tanpa konfigurasi server.

export type Route =
  | { page: "library" }
  | { page: "chapter"; number: number; version: number | null }
  | { page: "canon"; id: string | null }
  | { page: "notfound" };

export function parseHash(hash: string): Route {
  const parts = hash
    .replace(/^#\/?/, "")
    .split("/")
    .filter(Boolean)
    .map((p) => {
      try {
        return decodeURIComponent(p);
      } catch {
        return p;
      }
    });

  if (parts.length === 0) return { page: "library" };

  if (parts[0] === "bab") {
    const number = Number(parts[1]);
    if (!Number.isInteger(number) || number < 1) return { page: "notfound" };
    const v = parts[2]?.match(/^v(\d+)$/);
    return { page: "chapter", number, version: v ? Number(v[1]) : null };
  }

  if (parts[0] === "canon") return { page: "canon", id: parts[1] ?? null };

  return { page: "notfound" };
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route;
}

export const hrefLibrary = () => "#/";

export const hrefChapter = (number: number, version?: number | null) =>
  `#/bab/${number}${version ? `/v${version}` : ""}`;

export const hrefCanon = (id?: string | null) => `#/canon${id ? `/${id}` : ""}`;
