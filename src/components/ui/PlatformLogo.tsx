import type { Platform } from "@/types";

interface Props {
  platform: Platform;
  /** Size in px — default 16 */
  size?: number;
  className?: string;
}

/**
 * Renders the official platform logo from /assets/.
 * Falls back to a colored letter if the asset fails to load.
 */
export function PlatformLogo({ platform, size = 16, className }: Props) {
  const src = `/assets/logo-${platform}.svg`;
  const alt = platform === "x" ? "X (Twitter)" : platform.charAt(0).toUpperCase() + platform.slice(1);

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
      style={{ display: "inline-block", flexShrink: 0 }}
      draggable={false}
    />
  );
}
