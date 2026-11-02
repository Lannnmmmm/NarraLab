import { useEffect, useState } from "react";

// Routing berbasis hash (#/...) supaya jalan di GitHub Pages tanpa konfigurasi server.

export type Route =
  | { page: "library" }
  | { page: "studio" }
  | { page: "chapter"; number: number; version: number | null }
  | { page: "notfound" };

export function parseHash(hash: string): Route {
  const parts = hash
    .replace(/^#\/?/, "")
    .split("/")
    .filter(Boolean)
    .map((part) => {
      try {
        return decodeURIComponent(part);
      } catch {
        return part;
      }
    });

  if (parts.length === 0) return { page: "library" };
  if (parts[0] === "studio" && parts.length === 1) return { page: "studio" };

  if (parts[0] === "bab") {
    const number = Number(parts[1]);
    if (!Number.isInteger(number) || number < 1) return { page: "notfound" };
    const version = parts[2]?.match(/^v(\d+)$/);
    return { page: "chapter", number, version: version ? Number(version[1]) : null };
  }

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
export const hrefStudio = () => "#/studio";

export const hrefChapter = (number: number, version?: number | null) =>
  `#/bab/${number}${version ? `/v${version}` : ""}`;
