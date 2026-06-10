import { useMemo, useState } from "react";
import type { ChatMessage, Platform } from "@/types";
import { useInterval } from "@/hooks/useInterval";

const STOP_WORDS = new Set([
  "this", "that", "with", "have", "from", "they", "been", "were", "will",
  "your", "what", "when", "then", "just", "some", "into", "more", "also",
  "http", "https", "www", "lmao", "haha", "omg", "wtf", "the", "and",
  "for", "are", "but", "you", "not", "all", "out", "get", "got", "like",
  "really", "going", "still", "today", "stream", "chat",
]);

export interface Analytics {
  msgPerMin: number;
  msgPerMinPrev: number;
  hype: number;
  sparkline: { v: number }[];
  platformCounts: Record<Platform, number>;
  totalLastMinute: number;
  topKeywords: { word: string; count: number; topPlatform: Platform }[];
  activeUsers: number;
}

export function useChatAnalytics(messages: ChatMessage[]): Analytics {
  const [tick, setTick] = useState(0);
  useInterval(() => setTick((t) => t + 1), 1000);

  return useMemo(() => {
    const now = Date.now();
    const w10 = messages.filter((m) => now - m.timestamp < 10_000);
    const w60 = messages.filter((m) => now - m.timestamp < 60_000);
    const w120to60 = messages.filter(
      (m) => now - m.timestamp < 120_000 && now - m.timestamp >= 60_000,
    );

    const baseline = w60.length / 6;
    const hype = baseline > 0 ? Math.min(200, (w10.length / baseline) * 100) : 0;

    // Sparkline: 12 buckets × 5 seconds = last 60 seconds of history
    const sparkline: { v: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const start = now - (i + 1) * 5_000;
      const end = now - i * 5_000;
      sparkline.push({
        v: messages.filter((m) => m.timestamp >= start && m.timestamp < end).length,
      });
    }

    const platformCounts: Record<Platform, number> = { twitch: 0, kick: 0, x: 0 };
    for (const m of w60) platformCounts[m.platform]++;

    // Top keywords from the last 30 seconds
    const w30 = messages.filter((m) => now - m.timestamp < 30_000);
    const wordMap = new Map<string, { count: number; platforms: Record<Platform, number> }>();
    for (const m of w30) {
      const words = m.content.raw.toLowerCase().match(/\b[a-z]{4,}\b/g) ?? [];
      for (const w of words) {
        if (STOP_WORDS.has(w) || w.startsWith("http")) continue;
        const entry = wordMap.get(w) ?? { count: 0, platforms: { twitch: 0, kick: 0, x: 0 } };
        entry.count++;
        entry.platforms[m.platform]++;
        wordMap.set(w, entry);
      }
    }

    const topKeywords = [...wordMap.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([word, v]) => {
        const topPlatform = (
          Object.entries(v.platforms).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "twitch"
        ) as Platform;
        return { word, count: v.count, topPlatform };
      });

    const activeUsers = new Set(w60.map((m) => m.author.username)).size;

    return {
      msgPerMin: w60.length,
      msgPerMinPrev: w120to60.length,
      hype: Math.round(hype),
      sparkline,
      platformCounts,
      totalLastMinute: w60.length,
      topKeywords,
      activeUsers,
    };
    // Intentional: recompute only on message count change + 1s tick,
    // not on deep message reference equality (avoids expensive re-renders).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, tick]);
}
