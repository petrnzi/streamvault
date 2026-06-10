import { Monitor, Settings } from "lucide-react";
import type { PlatformStatus } from "@/types";
import { PLATFORM_META } from "@/lib/platforms";
import { PlatformLogo } from "@/components/ui/PlatformLogo";

interface Props {
  statuses: PlatformStatus[];
  latency: number;
  onOpenSettings: () => void;
  onOpenObs: () => void;
}

function StatusDot({ status }: { status: PlatformStatus }) {
  const meta = PLATFORM_META[status.platform];
  if (status.connecting) {
    return <span className="pulse-dot-fast h-[7px] w-[7px] rounded-full" style={{ background: "#F0A500" }} />;
  }
  if (status.connected) {
    return <span className="pulse-dot h-[7px] w-[7px] rounded-full" style={{ background: meta.color }} />;
  }
  return <span className="h-[7px] w-[7px] rounded-full bg-text-disabled" />;
}

export function AppHeader({ statuses, latency, onOpenSettings, onOpenObs }: Props) {
  const latencyColor = latency < 30 ? "#00CC7A" : latency < 80 ? "#F0A500" : "#FF3B3B";

  return (
    <header className="relative flex h-[52px] flex-shrink-0 items-center border-b border-border-subtle bg-surface px-5">
      <div className="flex items-center gap-3">
        <img
          src={`${import.meta.env.BASE_URL}assets/logo-white.svg`}
          alt="StreamVault"
          height={38}
          style={{ height: 38, width: "auto" }}
          draggable={false}
        />
        <span className="h-4 w-px bg-border-subtle" />
        <span className="inline-flex items-center gap-1.5">
          <span className="pulse-live h-[6px] w-[6px] rounded-full" style={{ background: "#FF3B3B" }} />
          <span className="font-mono text-[10px] font-medium tracking-[0.08em] text-live">LIVE</span>
        </span>
      </div>

      <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-5">
        {statuses.map((s) => {
          const meta = PLATFORM_META[s.platform];
          return (
            <div key={s.platform} className="flex items-center gap-1.5">
              <StatusDot status={s} />
              <span className="flex items-center gap-1">
                <PlatformLogo
                  platform={s.platform}
                  size={13}
                  className={s.connected ? "" : "opacity-40 grayscale"}
                />
                <span className="text-[12px]" style={{ color: s.connected ? "#9090A8" : "#505068" }}>
                  {meta.name}
                </span>
              </span>
              {s.connected && s.messagesReceived > 0 && (
                <span
                  className="rounded-full bg-border-subtle px-1.5 text-2xs"
                  style={{ color: meta.color }}
                >
                  {s.messagesReceived}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <span
          className="inline-flex items-center rounded-full border border-border-subtle bg-elevated px-2 py-0.5 font-mono text-[11px]"
          style={{ color: latencyColor }}
        >
          {latency}ms
        </span>
        <button
          onClick={onOpenSettings}
          aria-label="Open settings"
          className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors duration-150 hover:bg-elevated hover:text-text-secondary"
        >
          <Settings size={16} />
        </button>
        <button
          onClick={onOpenObs}
          aria-label="Open OBS overlay mode"
          className="group inline-flex items-center gap-1.5 rounded-full border border-border-default bg-elevated px-3 py-1 text-[12px] text-text-secondary transition-all duration-200 hover:border-twitch hover:bg-twitch-muted hover:text-twitch"
        >
          <Monitor size={13} />
          OBS Mode
        </button>
      </div>
    </header>
  );
}
