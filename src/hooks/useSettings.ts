import { useEffect, useState } from "react";
import type { AppSettings } from "@/types";

const STORAGE_KEY = "streamvault-settings";

const DEFAULTS: AppSettings = {
  fontSize: 13,
  compactMode: false,
  showTimestamps: true,
  showBadges: true,
  maxMessages: 500,
  soundOnHighlight: false,
  soundOnEvent: false,
  activePlatforms: ["twitch", "kick", "x"],
  xMode: "demo",
};

/**
 * Persists app settings to localStorage.
 *
 * Security note: xBearerToken is intentionally excluded from localStorage
 * because it is a sensitive API credential. It lives only in React state
 * for the duration of the session and must be re-entered on each page load.
 */
export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    if (typeof window === "undefined") return DEFAULTS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULTS;
      const parsed = JSON.parse(raw) as Partial<AppSettings>;
      // Explicitly omit xBearerToken even if it was previously stored
      const { xBearerToken: _dropped, ...safe } = parsed;
      void _dropped;
      return { ...DEFAULTS, ...safe };
    } catch {
      return DEFAULTS;
    }
  });

  useEffect(() => {
    try {
      // Persist everything except the bearer token
      const { xBearerToken: _excluded, ...persistable } = settings;
      void _excluded;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
    } catch {
      // localStorage may be unavailable (private browsing, storage full, etc.)
    }
  }, [settings]);

  return [settings, setSettings] as const;
}
