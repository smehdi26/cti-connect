import { useEffect, useState } from "react";

export type NavMode = "top" | "side";

const MODE_KEY = "cti-nav-mode";
const COLLAPSE_KEY = "cti-nav-collapsed";
const EVENT = "cti-nav-preferences";

function emit() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
}

export function readNavMode(): NavMode {
  if (typeof window === "undefined") return "top";
  return localStorage.getItem(MODE_KEY) === "side" ? "side" : "top";
}

export function writeNavMode(mode: NavMode) {
  localStorage.setItem(MODE_KEY, mode);
  emit();
}

export function readNavCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(COLLAPSE_KEY) === "1";
}

export function writeNavCollapsed(collapsed: boolean) {
  localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0");
  emit();
}

/** Shared, cross-component navigation preferences (persisted in localStorage). */
export function useNavPreferences() {
  const [mode, setMode] = useState<NavMode>("top");
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setMode(readNavMode());
      setCollapsed(readNavCollapsed());
    };
    sync();
    setReady(true);
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return {
    mode,
    collapsed,
    ready,
    setMode: (next: NavMode) => {
      setMode(next);
      writeNavMode(next);
    },
    toggleMode: () => {
      const next: NavMode = readNavMode() === "top" ? "side" : "top";
      setMode(next);
      writeNavMode(next);
    },
    setCollapsed: (next: boolean) => {
      setCollapsed(next);
      writeNavCollapsed(next);
    },
    toggleCollapsed: () => {
      const next = !readNavCollapsed();
      setCollapsed(next);
      writeNavCollapsed(next);
    },
  };
}
