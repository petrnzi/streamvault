import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useMessages } from "@/hooks/useMessages";
import { useInterval } from "@/hooks/useInterval";
import { PLATFORM_META } from "@/lib/platforms";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import type { Platform } from "@/types";

function useObsParams() {
  const p = new URLSearchParams(window.location.search);
  return {
    platforms: (p.get("platforms")?.split(",") as Platform[]) ?? (["twitch", "kick", "x"] as Platform[]),
    ttl: Number(p.get("ttl") ?? 25) * 1000,
    fontSize: Number(p.get("fontSize") ?? 15),
    style: (p.get("style") ?? "pill") as "pill" | "line" | "ghost",
    position: (p.get("position") ?? "bottom") as "bottom" | "top",
    maxMessages: Number(p.get("maxMessages") ?? 30),
  };
}

export function OBSMode() {
  useEffect(() => {
    document.body.style.background = "transparent";
    document.documentElement.style.background = "transparent";
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.background = "";
      document.documentElement.style.background = "";
      document.body.style.overflow = "";
    };
  }, []);

  const [now, setNow] = useState(() => Date.now());
  useInterval(() => setNow(Date.now()), 1000);

  const { platforms, ttl, fontSize, style, position, maxMessages } = useObsParams();
  const messages = useMessages();

  const visible = messages
    .filter((m) => platforms.includes(m.platform))
    .filter((m) => now - m.timestamp < ttl)
    .slice(-maxMessages);

  return (
    <div
      className="fixed inset-0 flex p-4"
      style={{ background: "transparent", alignItems: position === "bottom" ? "flex-end" : "flex-start" }}
    >
      <div className="flex w-full flex-col gap-1.5">
        <AnimatePresence initial={false}>
          {visible.map((m) => {
            const meta = PLATFORM_META[m.platform];
            const baseStyle: React.CSSProperties =
              style === "pill"
                ? { background: "rgba(10,10,20,0.85)", backdropFilter: "blur(4px)", borderRadius: 12, padding: "8px 12px" }
                : style === "line"
                ? { borderLeft: `3px solid ${meta.color}`, paddingLeft: 10, paddingTop: 4, paddingBottom: 4 }
                : { padding: "4px 0", textShadow: "0 2px 8px rgba(0,0,0,0.9)" };
            return (
              <motion.div
                key={m.id}
                layout="position"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ ...baseStyle, fontSize, color: "#EEEEF5" }}
                className="font-sans"
              >
                <span className="mr-2 inline-flex items-center gap-1.5 align-middle">
                  <PlatformBadge platform={m.platform} />
                  <span style={{ color: m.author.color }} className="font-semibold">
                    {m.author.displayName}
                  </span>
                </span>
                <span>{m.content.raw}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
