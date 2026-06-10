import type { ChatAuthor, Platform } from "@/types";
import { avatarColors, initialOf } from "@/lib/colorUtils";
import { PLATFORM_META } from "@/lib/platforms";

export function UserAvatar({ author, platform }: { author: ChatAuthor; platform: Platform }) {
  const c = avatarColors(author.username);
  const ring = PLATFORM_META[platform].color;
  return (
    <div
      className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center overflow-hidden rounded-full text-[12px] font-semibold"
      style={{
        background: c.bg,
        color: c.fg,
        boxShadow: `0 0 0 1.5px ${ring}66`,
      }}
    >
      {author.avatarUrl ? (
        <img
          src={author.avatarUrl}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        initialOf(author.displayName)
      )}
    </div>
  );
}
