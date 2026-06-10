import { motion } from "framer-motion";
import type { Platform } from "@/types";
import { PLATFORM_META } from "@/lib/platforms";
import { formatNumber } from "@/lib/formatters";

export function PlatformSplit({ counts }: { counts: Record<Platform, number> }) {
  const total = counts.twitch + counts.kick + counts.x;
  const platforms: Platform[] = ["twitch", "kick", "x"];

  return (
    <div className="rounded-xl border border-border-subtle bg-elevated p-4">
      <div className="font-mono text-2xs tracking-[0.1em] text-text-muted">
        PLATFORM ACTIVITY
      </div>

      <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-[#1A1A26]">
        {platforms.map((p) => {
          const pct = total > 0 ? (counts[p] / total) * 100 : 0;
          if (pct === 0) return null;
          return (
            <motion.div
              key={p}
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
              style={{ background: PLATFORM_META[p].color }}
            />
          );
        })}
      </div>

      <div className="mt-3 space-y-1.5">
        {platforms.map((p) => {
          const pct = total > 0 ? Math.round((counts[p] / total) * 100) : 0;
          const meta = PLATFORM_META[p];
          return (
            <div key={p} className="flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: meta.color }}
              />
              <span className="text-[12px] text-text-secondary">{meta.name}</span>
              <div className="relative ml-1 h-[3px] w-10 rounded-full bg-[#1A1A26]">
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ width: `${pct}%`, background: meta.color }}
                />
              </div>
              <span className="font-mono text-[11px] text-text-secondary">{pct}%</span>
              <span className="ml-auto font-mono text-[11px] text-text-muted">
                {formatNumber(counts[p])}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
