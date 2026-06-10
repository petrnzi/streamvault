import { useState } from "react";
import { Plus, Search, X } from "lucide-react";
import type { Platform, PlatformStatus } from "@/types";
import { PLATFORM_META } from "@/lib/platforms";
import { PlatformLogo } from "@/components/ui/PlatformLogo";
import { Toggle } from "@/components/ui/SwitchToggle";
import { formatDuration, formatNumber } from "@/lib/formatters";

interface Props {
  statuses: PlatformStatus[];
  onTogglePlatform: (p: Platform) => void;
  onAddChannel: (p: Platform, channel: string) => void;
  onRemoveChannel: (p: Platform, channel: string) => void;
  searchQuery: string;
  onSearch: (q: string) => void;
  highlightMentions: boolean;
  onHighlightMentions: (v: boolean) => void;
  totalMessages: number;
  uptimeMs: number;
  activeCount: number;
}

function PlatformCard({
  status,
  onToggle,
  onAdd,
  onRemove,
}: {
  status: PlatformStatus;
  onToggle: () => void;
  onAdd: (c: string) => void;
  onRemove: (c: string) => void;
}) {
  const meta = PLATFORM_META[status.platform];
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState("");

  return (
    <div
      className="mb-2 rounded-xl border bg-elevated p-3 transition-all duration-200"
      style={{
        borderColor: status.connected ? `${meta.color}50` : "#1A1A26",
        borderLeftWidth: status.connected ? 2 : 1,
        borderLeftColor: status.connected ? meta.color : "#1A1A26",
        opacity: status.connected ? 1 : 0.6,
      }}
    >
      <div className="flex items-center gap-2">
        {/* Platform logo instead of letter */}
        <PlatformLogo
          platform={status.platform}
          size={18}
          className={status.connected ? "" : "grayscale opacity-50"}
        />
        <span className="text-[13px] font-medium text-text-primary">{meta.name}</span>
        <div className="ml-auto">
          <Toggle checked={status.connected} onChange={onToggle} color={meta.color} />
        </div>
      </div>

      <div className="mt-1.5 text-[11px] text-text-muted">
        {status.connected ? (
          <>
            <span className="text-success">Connected</span>
            {status.channels.length > 0 && (
              <span className="text-text-muted">
                {" "}· {status.channels[0]}
                {status.channels.length > 1 ? ` +${status.channels.length - 1}` : ""}
              </span>
            )}
          </>
        ) : (
          "Disconnected"
        )}
      </div>

      {status.channels.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {status.channels.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1 rounded-full bg-border-subtle px-2 py-0.5 text-[11px] text-text-secondary"
            >
              #{c}
              <button
                onClick={() => onRemove(c)}
                className="text-text-muted hover:text-text-primary"
                aria-label={`Remove ${c}`}
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="mt-2 inline-flex items-center gap-1 text-[11px] text-text-muted transition-colors hover:text-text-primary"
        style={{ color: open ? meta.color : undefined }}
      >
        <Plus size={11} /> Add channel
      </button>
      <div
        className="overflow-hidden transition-all duration-200"
        style={{ maxHeight: open ? 60 : 0 }}
      >
        <div className="mt-2 flex items-center gap-1">
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && val.trim()) {
                onAdd(val.trim());
                setVal("");
                setOpen(false);
              }
            }}
            placeholder="channel name"
            className="w-full rounded-md border border-border-subtle bg-void px-2 py-1 text-[12px] text-text-primary outline-none focus:border-twitch"
          />
        </div>
      </div>
    </div>
  );
}

export function LeftSidebar(props: Props) {
  return (
    <aside className="flex h-full w-[260px] flex-shrink-0 flex-col overflow-y-auto border-r border-border-subtle bg-surface p-4">
      <div className="mb-3 font-mono text-2xs tracking-[0.1em] text-text-muted">SOURCES</div>

      {props.statuses.map((s) => (
        <PlatformCard
          key={s.platform}
          status={s}
          onToggle={() => props.onTogglePlatform(s.platform)}
          onAdd={(c) => props.onAddChannel(s.platform, c)}
          onRemove={(c) => props.onRemoveChannel(s.platform, c)}
        />
      ))}

      <div className="mb-3 mt-5 font-mono text-2xs tracking-[0.1em] text-text-muted">FILTERS</div>

      <div className="relative">
        <Search
          size={14}
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <input
          value={props.searchQuery}
          onChange={(e) => props.onSearch(e.target.value)}
          placeholder="Search messages…"
          className="w-full rounded-lg border border-border-subtle bg-elevated py-2 pl-7 pr-7 text-[13px] text-text-primary placeholder:text-text-disabled outline-none transition-shadow focus:border-twitch focus:shadow-[0_0_0_3px_rgba(145,70,255,0.1)]"
        />
        {props.searchQuery && (
          <button
            onClick={() => props.onSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
          >
            <X size={12} />
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[12px] text-text-secondary">Highlight mentions</span>
        <Toggle
          checked={props.highlightMentions}
          onChange={props.onHighlightMentions}
          size="sm"
        />
      </div>

      {/* Session stats */}
      <div className="mt-auto border-t border-border-subtle pt-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="font-mono text-[16px] font-medium text-text-primary">
              {formatNumber(props.totalMessages)}
            </div>
            <div className="mt-0.5 text-[10px] tracking-wider text-text-muted">TOTAL</div>
          </div>
          <div>
            <div className="font-mono text-[16px] font-medium text-text-primary">
              {formatDuration(props.uptimeMs)}
            </div>
            <div className="mt-0.5 text-[10px] tracking-wider text-text-muted">UPTIME</div>
          </div>
          <div>
            <div className="font-mono text-[16px] font-medium text-text-primary">
              {props.activeCount}/3
            </div>
            <div className="mt-0.5 text-[10px] tracking-wider text-text-muted">ACTIVE</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
