import type { Platform } from "./platform";

export type BadgeType =
  | "broadcaster"
  | "moderator"
  | "vip"
  | "subscriber"
  | "prime"
  | "verified"
  | "og"
  | "partner"
  | "bits";

export interface Badge {
  type: BadgeType;
  label: string;
  imageUrl?: string;
}

export type MessageSegment =
  | { type: "text"; content: string }
  | { type: "emote"; id: string; name: string; url?: string }
  | { type: "mention"; username: string }
  | { type: "link"; url: string; display: string }
  | { type: "hashtag"; tag: string };

export interface ChatAuthor {
  username: string;
  displayName: string;
  color: string;
  avatarUrl?: string;
  badges: Badge[];
  isStreamer: boolean;
  isModerator: boolean;
  isSubscriber: boolean;
  isVerified: boolean;
}

export interface ChatMessage {
  id: string;
  platform: Platform;
  channel: string;
  author: ChatAuthor;
  content: {
    raw: string;
    segments: MessageSegment[];
    hasEmotes: boolean;
    hasMention: boolean;
    hasLink: boolean;
  };
  timestamp: number;
  receivedAt: number;
  isSubEvent?: boolean;
  isFollowEvent?: boolean;
  isRaidEvent?: boolean;
  isFirstTime?: boolean;
  isDeleted?: boolean;
  xMeta?: {
    tweetId: string;
    likes: number;
    retweets: number;
    isReply: boolean;
  };
}
