import type { Platform } from "@/types";

export const PLATFORM_META: Record<
  Platform,
  { name: string; letter: string; color: string; mutedClass: string; textClass: string; borderClass: string }
> = {
  twitch: {
    name: "Twitch",
    letter: "T",
    color: "#9146FF",
    mutedClass: "bg-twitch-muted",
    textClass: "text-twitch",
    borderClass: "border-twitch",
  },
  kick: {
    name: "Kick",
    letter: "K",
    color: "#53FC18",
    mutedClass: "bg-kick-muted",
    textClass: "text-kick",
    borderClass: "border-kick",
  },
  x: {
    name: "X",
    letter: "𝕏",
    color: "#E7E9EA",
    mutedClass: "bg-x-muted",
    textClass: "text-x",
    borderClass: "border-x",
  },
};
