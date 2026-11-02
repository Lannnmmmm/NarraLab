import { useEffect, useState } from "react";

// localStorage bisa melempar error (mode privat, data situs diblokir),
// jadi semua akses dibungkus try/catch dan aplikasi tetap jalan tanpanya.

export function readStore(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStore(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // diabaikan
  }
}

export function usePersistentState<T extends object>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const raw = readStore(key);
    if (!raw) return initial;
    try {
      return { ...initial, ...JSON.parse(raw) };
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    writeStore(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
