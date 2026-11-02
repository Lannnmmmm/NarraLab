import { useEffect, useState } from "react";
import { readStore, writeStore } from "./storage";

export type ThemePref = "system" | "light" | "dark";

const KEY = "narralab:theme";
const QUERY = "(prefers-color-scheme: dark)";

function resolve(pref: ThemePref): "light" | "dark" {
  if (pref === "system") return window.matchMedia(QUERY).matches ? "dark" : "light";
  return pref;
}

export function useTheme() {
  const [pref, setPref] = useState<ThemePref>(() => {
    const saved = readStore(KEY);
    return saved === "light" || saved === "dark" ? saved : "system";
  });

  useEffect(() => {
    const apply = () => {
      document.documentElement.dataset.theme = resolve(pref);
    };
    apply();
    writeStore(KEY, pref);

    if (pref !== "system") return;
    const mq = window.matchMedia(QUERY);
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [pref]);

  return [pref, setPref] as const;
}
