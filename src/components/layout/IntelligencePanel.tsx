import type { Analytics } from "@/hooks/useChatAnalytics";
import { HypeMeter } from "@/components/intelligence/HypeMeter";
import { VelocityCard } from "@/components/intelligence/VelocityCard";
import { PlatformSplit } from "@/components/intelligence/PlatformSplit";
import { TopKeywords } from "@/components/intelligence/TopKeywords";
import { ActiveUsers } from "@/components/intelligence/ActiveUsers";

interface Props {
  analytics: Analytics;
}

export function IntelligencePanel({ analytics }: Props) {
  return (
    <aside className="flex h-full w-[300px] flex-shrink-0 flex-col overflow-y-auto border-l border-border-subtle bg-surface p-4">
      <div className="mb-4 font-mono text-2xs tracking-[0.12em] text-text-muted">
        STREAM INTEL
      </div>
      <div className="flex flex-col gap-3">
        <HypeMeter hype={analytics.hype} />
        <VelocityCard
          msgPerMin={analytics.msgPerMin}
          prev={analytics.msgPerMinPrev}
          sparkline={analytics.sparkline}
        />
        <PlatformSplit counts={analytics.platformCounts} />
        <TopKeywords items={analytics.topKeywords} />
        <ActiveUsers count={analytics.activeUsers} />
      </div>
    </aside>
  );
}
