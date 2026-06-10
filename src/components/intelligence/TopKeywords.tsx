import type { Platform } from "@/types";
import { PLATFORM_META } from "@/lib/platforms";

export function TopKeywords({
  items,
}: {
  items: { word: string; count: number; topPlatform: Platform }[];
}) {
  const max = items[0]?.count ?? 1;

  return (
    <div className="rounded-xl border border-border-subtle bg-elevated p-4">
      <div className="font-mono text-2xs tracking-[0.1em] text-text-muted">
        TRENDING WORDS · LAST 30S
      </div>
      <div className="mt-3 space-y-1.5">
        {items.length === 0 && (
          <div className="py-2 text-[11px] text-text-muted">Listening…</div>
        )}
        {items.map((k, i) => {
          const pct = (k.count / max) * 100;
          const color = PLATFORM_META[k.topPlatform].color;
          return (
            <div key={k.word} className="flex items-center gap-2 py-0.5">
              <span className="w-4 font-mono text-2xs text-text-disabled">
                #{i + 1}
              </span>
              <span className="min-w-0 truncate text-[12px] font-medium text-text-primary">
                {k.word}
              </span>
              <div className="relative ml-2 h-[3px] flex-1 overflow-hidden rounded-full bg-[#1A1A26]">
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${color}, ${color}33)`,
                  }}
                />
              </div>
              <span className="font-mono text-[11px] text-text-muted">{k.count}×</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
