import type { PlatformStatus } from "@/types";
import { PLATFORM_META } from "@/lib/platforms";
import { PlatformLogo } from "@/components/ui/PlatformLogo";
import { formatDuration, formatNumber } from "@/lib/formatters";

export function StatusBar({
  statuses,
  msgPerMin,
  total,
  uptimeMs,
}: {
  statuses: PlatformStatus[];
  msgPerMin: number;
  total: number;
  uptimeMs: number;
}) {
  const connectedAll = statuses.every((s) => s.connected);
  const connectedAny = statuses.some((s) => s.connected);
  const mainColor = connectedAll ? "#00CC7A" : connectedAny ? "#F0A500" : "#FF3B3B";
  const rateColor =
    msgPerMin > 200 ? "#FF3B3B" : msgPerMin > 120 ? "#F0A500" : msgPerMin > 60 ? "#EEEEF5" : "#9090A8";

  return (
    <footer className="flex h-7 flex-shrink-0 items-center gap-4 border-t border-border-subtle bg-surface px-5 font-mono text-[11px] text-text-secondary">
      {/* Main connection status */}
      <div className="flex items-center gap-1.5">
        <span className="pulse-dot h-1.5 w-1.5 rounded-full" style={{ background: mainColor }} />
        <span style={{ color: mainColor }}>
          {connectedAll ? "Connected" : connectedAny ? "Partial" : "Offline"}
        </span>
      </div>

      <span className="text-border-subtle">|</span>

      {/* Per-platform status with logo */}
      <div className="flex items-center gap-3">
        {statuses.map((s) => (
          <span key={s.platform} className="flex items-center gap-1">
            <span style={{ opacity: s.connected ? 1 : 0.35 }}>
              <PlatformLogo platform={s.platform} size={12} />
            </span>
            <span
              className="h-[5px] w-[5px] rounded-full"
              style={{ background: s.connected ? PLATFORM_META[s.platform].color : "#303048" }}
            />
          </span>
        ))}
      </div>

      <span className="text-border-subtle">|</span>
      <span style={{ color: rateColor }}>{msgPerMin} msg/min</span>
      <span className="text-border-subtle">|</span>
      <span>{formatNumber(total)} total</span>
      <span className="text-border-subtle">|</span>
      <span>⌛ {formatDuration(uptimeMs)}</span>
      <span className="ml-auto text-text-disabled">StreamVault v1.0.0</span>
    </footer>
  );
}
