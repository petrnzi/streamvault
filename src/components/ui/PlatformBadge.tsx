import type { Platform } from "@/types";
import { PlatformLogo } from "./PlatformLogo";

/**
 * Platform source badge shown on every chat message.
 * No background/border — the SVG logos already have their own styling.
 */
export function PlatformBadge({ platform }: { platform: Platform }) {
  return <PlatformLogo platform={platform} size={16} />;
}
