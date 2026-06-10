import type { Platform } from "./platform";

export interface AppSettings {
  fontSize: number;
  compactMode: boolean;
  showTimestamps: boolean;
  showBadges: boolean;
  maxMessages: number;
  soundOnHighlight: boolean;
  soundOnEvent: boolean;
  activePlatforms: Platform[];
  xMode: "demo" | "api";
  xBearerToken?: string;
  xSearchQuery?: string;
}
