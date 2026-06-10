import { Heart, Radio, Shield, Star } from "lucide-react";
import type { Badge as BadgeT, Platform } from "@/types";
import { PLATFORM_META } from "@/lib/platforms";

export function UserBadges({ badges, platform }: { badges: BadgeT[]; platform: Platform }) {
  if (!badges.length) return null;
  return (
    <span className="inline-flex items-center gap-[3px]">
      {badges.map((b, i) => {
        if (b.type === "broadcaster")
          return <Radio key={i} size={11} className="text-live" />;
        if (b.type === "moderator")
          return <Shield key={i} size={11} className="text-success" />;
        if (b.type === "vip")
          return <Star key={i} size={11} className="text-gold" />;
        if (b.type === "subscriber")
          return (
            <Heart key={i} size={11} style={{ color: PLATFORM_META[platform].color }} />
          );
        if (b.type === "verified")
          return (
            <svg key={i} width={11} height={11} viewBox="0 0 24 24" fill="#1D9BF0">
              <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
            </svg>
          );
        if (b.type === "og")
          return (
            <span
              key={i}
              className="rounded-[3px] px-1 font-mono text-[8px] font-bold"
              style={{ background: "rgba(83,252,24,0.15)", color: "#53FC18" }}
            >
              OG
            </span>
          );
        return null;
      })}
    </span>
  );
}
