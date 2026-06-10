import type { Platform } from "@/types";

interface Props {
  platform: Platform;
  size?: number;
  className?: string;
}

export function PlatformLogo({ platform, size = 16, className }: Props) {
  const src = `../../../public/assets/logo-${platform}.svg`;
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
