import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import type { ChatMessage as Msg, Platform } from "@/types";
import { ChatMessage } from "./ChatMessage";
import { PLATFORM_META } from "@/lib/platforms";
import { PlatformLogo } from "@/components/ui/PlatformLogo";
import { formatNumber } from "@/lib/formatters";
import { useDebounce } from "@/hooks/useDebounce";

interface Props {
  messages: Msg[];
  activePlatforms: Platform[];
  onTogglePlatform: (p: Platform) => void;
  fontSize: number;
  showTimestamps: boolean;
  showBadges: boolean;
  compact: boolean;
  searchQuery: string;
}

export function ChatFeed({
  messages, activePlatforms, onTogglePlatform,
  fontSize, showTimestamps, showBadges, compact, searchQuery,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef(true);
  const [pendingCount, setPendingCount] = useState(0);

  const debouncedSearch = useDebounce(searchQuery.trim().toLowerCase(), 150);

  const filtered = useMemo(() => {
    const q = debouncedSearch;
    return messages.filter((m) => {
      if (!activePlatforms.includes(m.platform)) return false;
      if (q && !m.content.raw.toLowerCase().includes(q) && !m.author.username.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [messages, activePlatforms, debouncedSearch]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (autoScrollRef.current) {
      el.scrollTop = el.scrollHeight;
      setPendingCount(0);
    } else {
      setPendingCount((c) => c + 1);
    }
  }, [filtered.length]);

  const onScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distance < 40) { autoScrollRef.current = true; setPendingCount(0); }
    else { autoScrollRef.current = false; }
  };

  const scrollToBottom = () => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    autoScrollRef.current = true;
    setPendingCount(0);
  };

  return (
    <div className="relative flex h-full min-w-0 flex-1 flex-col bg-void">

      {/* Platform filter bar */}
      <div className="flex h-11 items-center gap-2 border-b border-border-subtle bg-surface px-4">
        {(["twitch", "kick", "x"] as Platform[]).map((p) => {
          const m = PLATFORM_META[p];
          const active = activePlatforms.includes(p);
          return (
            <button
              key={p}
              onClick={() => onTogglePlatform(p)}
              aria-pressed={active}
              aria-label={`Toggle ${m.name}`}
              className="inline-flex h-7 items-center justify-center gap-1.5 rounded-full px-3 font-mono text-[11px] font-bold transition-all duration-150"
              style={{
                background: active ? `${m.color}1f` : "#111119",
                border: `1px solid ${active ? m.color : "#1A1A26"}`,
                color: active ? m.color : "#505068",
                opacity: active ? 1 : 0.5,
              }}
            >
              {/* Logo directly — no extra wrapper/border */}
              <PlatformLogo platform={p} size={14} />
              {m.name}
            </button>
          );
        })}
        <div className="ml-auto font-mono text-[11px] text-text-muted">
          {formatNumber(filtered.length)} messages
        </div>
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="relative flex-1 overflow-y-auto overflow-x-hidden"
        style={{ willChange: "transform" }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {filtered.map((m) => (
            <ChatMessage
              key={m.id}
              message={m}
              showTimestamp={showTimestamps}
              showBadges={showBadges}
              fontSize={fontSize}
              compact={compact}
            />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {pendingCount > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.18 }}
            onClick={scrollToBottom}
            className="absolute bottom-4 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2 font-sans text-[12px] font-medium text-white"
            style={{ background: "#9146FF", boxShadow: "0 4px 16px rgba(145,70,255,0.4)" }}
          >
            <ArrowDown size={14} />
            {pendingCount} new {pendingCount === 1 ? "message" : "messages"}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
