import { useEffect, useState } from "react";
import type { SiteIndex } from "./types";

const base = import.meta.env.BASE_URL;
const url = (path: string) => `${base}${path}`;

async function fetchOk(path: string): Promise<Response> {
  const res = await fetch(url(path), { cache: "no-cache" });
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return res;
}

export type IndexState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: SiteIndex };

export function useIndex(): IndexState {
  const [state, setState] = useState<IndexState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetchOk("content/index.json")
      .then((res) => res.json() as Promise<SiteIndex>)
      .then((data) => {
        if (!cancelled) setState({ status: "ready", data });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            message: err instanceof Error ? err.message : String(err),
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

export type TextState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; text: string };

export function useText(path: string | null): TextState {
  const [state, setState] = useState<TextState>({ status: "idle" });

  useEffect(() => {
    if (!path) {
      setState({ status: "idle" });
      return;
    }
    let cancelled = false;
    setState({ status: "loading" });
    fetchOk(path)
      .then((res) => res.text())
      .then((text) => {
        if (!cancelled) setState({ status: "ready", text });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  return state;
}
