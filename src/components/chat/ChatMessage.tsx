import { memo } from "react";
import { motion } from "framer-motion";
import { Bookmark, Flag, Heart, Pin, Repeat2 } from "lucide-react";
import type { ChatMessage as Msg, MessageSegment } from "@/types";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { UserBadges } from "@/components/ui/UserBadges";
import { PLATFORM_META } from "@/lib/platforms";
import { formatTime, formatNumber } from "@/lib/formatters";

// ── Platform username colors ───────────────────────────────────────────────────

const PLATFORM_USERNAME_COLOR: Record<string, string> = {
  twitch: "#8956FB",
  kick: "#00E701",
  x: "#1DA1F2",
};

// ── Premium animated gradient (subscribers + verified) ────────────────────────

const PREMIUM_GRADIENT_STYLE: React.CSSProperties = {
  background: "linear-gradient(90deg, #1DA1F2, #00E701, #8956FB, #1DA1F2)",
  backgroundSize: "300% 100%",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  animation: "premiumGradient 1.8s linear infinite",
};

// ── Animation ──────────────────────────────────────────────────────────────────

const variants = {
  hidden: { opacity: 0, y: 6, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

// ── Segment renderer ───────────────────────────────────────────────────────────

function Segment({ seg, color }: { seg: MessageSegment; color: string }) {
  if (seg.type === "text") return <>{seg.content}</>;
  if (seg.type === "mention")
    return <span style={{ color }} className="font-medium">@{seg.username}</span>;
  if (seg.type === "link")
    return (
      <a href={seg.url} target="_blank" rel="noreferrer noopener" style={{ color }}
        className="underline-offset-2 hover:underline">
        {seg.display}
      </a>
    );
  if (seg.type === "hashtag")
    return <span style={{ color }} className="font-medium">#{seg.tag}</span>;
  if (seg.type === "emote")
    return <span className="text-text-muted">[{seg.name}]</span>;
  return null;
}

// ── Component ──────────────────────────────────────────────────────────────────

interface Props {
  message: Msg;
  showTimestamp: boolean;
  showBadges: boolean;
  fontSize: number;
  compact: boolean;
}

function ChatMessageInner({ message, showTimestamp, showBadges, fontSize, compact }: Props) {
  const meta = PLATFORM_META[message.platform];
  const isEvent = message.isSubEvent || message.isFollowEvent;
  const padY = compact ? 6 : 10;
  const isPremium = message.author.isSubscriber || message.author.isVerified;
  const usernameColor = PLATFORM_USERNAME_COLOR[message.platform] ?? "#EEEEF5";

  let extraStyle: React.CSSProperties = {};
  let banner: React.ReactNode = null;

  if (isEvent) {
    extraStyle = {
      background: "linear-gradient(90deg, rgba(240,165,0,0.12) 0%, transparent 100%)",
      borderLeft: "2px solid #F0A500",
    };
  } else if (message.isFirstTime) {
    extraStyle = { borderLeft: "2px solid #00CC7A" };
    banner = (
      <div className="mb-1 font-mono text-2xs tracking-wider text-success">✦ FIRST MESSAGE</div>
    );
  } else if (message.content.hasMention) {
    extraStyle = {
      background: `${meta.color}10`,
      borderLeft: `2px solid ${meta.color}`,
    };
  }

  return (
    <motion.div
      layout="position"
      variants={variants}
      initial="hidden"
      animate="visible"
      className="group relative flex items-start gap-2.5 transition-colors duration-200 hover:bg-[#0F0F18]"
      style={{ padding: `${padY}px 16px`, ...extraStyle }}
    >
      <UserAvatar author={message.author} platform={message.platform} />

      <div className="min-w-0 flex-1">
        {banner}

        {/* Single line: badge · username · user-badges · timestamp · message */}
        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
          {showBadges && (
            <span className="inline-flex items-center self-center">
              <PlatformBadge platform={message.platform} />
            </span>
          )}

          {/* Username */}
          {isPremium ? (
            <span
              className="cursor-pointer font-semibold transition-[filter] hover:brightness-125"
              style={{ ...PREMIUM_GRADIENT_STYLE, fontSize: 13, flexShrink: 0 }}
            >
              {message.author.displayName}
            </span>
          ) : (
            <span
              className="cursor-pointer font-semibold transition-[filter] hover:brightness-125"
              style={{ color: usernameColor, fontSize: 13, flexShrink: 0 }}
            >
              {message.author.displayName}
            </span>
          )}

          {/* User role badges */}
          {showBadges && (
            <span className="inline-flex items-center self-center">
              <UserBadges badges={message.author.badges} platform={message.platform} />
            </span>
          )}

          {/* Colon separator */}
          <span className="font-semibold text-text-muted" style={{ fontSize: 13 }}>:</span>

          {/* Message inline */}
          {message.isDeleted ? (
            <span className="text-text-muted line-through" style={{ fontSize }}>
              🔇 Message removed
            </span>
          ) : (
            <span
              className="break-words text-text-primary"
              style={{
                fontSize,
                lineHeight: 1.55,
                fontStyle: isEvent ? "italic" : undefined,
              }}
            >
              {isEvent && <span className="mr-1">{message.isSubEvent ? "⭐" : "🔔"}</span>}
              {message.content.segments.map((s, i) => (
                <Segment key={i} seg={s} color={meta.color} />
              ))}
              {message.xMeta && message.xMeta.likes > 10 && (
                <span className="ml-2 inline-flex items-center gap-1 font-mono text-2xs text-text-muted">
                  <Heart size={10} /> {formatNumber(message.xMeta.likes)}
                  {message.xMeta.retweets > 5 && (
                    <><Repeat2 size={10} className="ml-1" />{formatNumber(message.xMeta.retweets)}</>
                  )}
                </span>
              )}
            </span>
          )}

          {/* Timestamp — pushed to end */}
          {showTimestamp && (
            <span className="ml-auto font-mono text-2xs text-text-disabled self-center">
              {formatTime(message.timestamp)}
            </span>
          )}
        </div>
      </div>

      {/* Hover action bar */}
      <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 translate-x-1.5 items-center gap-1.5 rounded-md border border-border-default bg-overlay px-2 py-1 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100">
        <button aria-label="Highlight message" className="text-text-muted hover:text-text-secondary"><Bookmark size={14} /></button>
        <button aria-label="Pin message" className="text-text-muted hover:text-text-secondary"><Pin size={14} /></button>
        <button aria-label="Report message" className="text-text-muted hover:text-text-secondary"><Flag size={14} /></button>
      </div>
    </motion.div>
  );
}

export const ChatMessage = memo(ChatMessageInner);
