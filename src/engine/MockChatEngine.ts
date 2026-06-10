import { v4 as uuid } from "uuid";
import type { Badge, ChatMessage, Platform } from "@/types";
import { colorForUsername } from "@/lib/colorUtils";
import { parseMessage } from "@/lib/textParser";

// ── Pools ──────────────────────────────────────────────────────────────────────

const USERNAMES = [
  "xXDarkNova99Xx", "pogchampion", "streamwatcher2000", "LilPepper_",
  "GoldFishBrain", "NeonWolf47", "chatspammer404", "ModeratorBot",
  "SubGifter_Max", "lurker_no_more", "TriHard7Fan", "JessicaPlays",
  "HypeTrainConductor", "FirstTimeChatting", "OldSchoolViewer",
  "ToxicSoloQueuePlayer", "NiceGuyActually", "DonatorDave",
  "StreamSniper1", "ContentConsumer", "PassiveAggressive_", "PogO_",
  "VelvetRogue", "MidnightApex", "QuietStorm", "PixelPriest",
];

const MESSAGES = [
  "POGGERS", "this is actually insane", "W", "bro what", "LOL",
  "how long has he been playing", "first time in chat hello",
  "monkaS", "@streamer sick play dude", "sub hype!!!",
  "actually impressive ngl", "pls play the other game next",
  "KEKW", "this stream is going crazy", "W + ratio",
  "been watching for 3 hours lol send help", "chat is wild today",
  "GGs", "come check out my stream too", "does he know?",
  "the music is too loud", "peak entertainment", "certified moment",
  "I just woke up what happened", "5Head play actually",
  "[PogChamp] [PogChamp] [PogChamp]", "no way that landed",
  "clip it!!!", "this is the best stream today", "gaming gaming gaming",
  "check out https://streamvault.app it is sick",
  "#raid incoming get ready", "actually clean", "raw skill",
];

const CHANNELS: Record<Platform, string[]> = {
  twitch: ["xqc", "shroud", "pokimane"],
  kick: ["adin", "trainwreckstv"],
  x: ["live-thread", "gaming-news"],
};

// ── Timing constants ───────────────────────────────────────────────────────────

/** Burst triggers every 90–120 seconds */
const BURST_INTERVAL_MIN = 90_000;
const BURST_INTERVAL_RANGE = 30_000;
/** Burst lasts 15 seconds */
const BURST_DURATION = 15_000;
/** Normal inter-message delay: 600–3400 ms */
const NORMAL_MIN = 600;
const NORMAL_RANGE = 2_800;
/** Burst inter-message delay: 100–300 ms */
const BURST_MIN = 100;
const BURST_RANGE = 200;
/** Safety cap: max messages emitted during a single burst */
const MAX_BURST_MESSAGES = 150;

// ── Helpers ────────────────────────────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function maybeBadges(platform: Platform): {
  badges: Badge[];
  isMod: boolean;
  isSub: boolean;
  isStreamer: boolean;
  isVerified: boolean;
} {
  const badges: Badge[] = [];
  const r = Math.random();
  let isStreamer = false, isMod = false, isSub = false, isVerified = false;

  if (r < 0.02) {
    badges.push({ type: "broadcaster", label: "Broadcaster" });
    isStreamer = true;
  } else if (r < 0.07) {
    badges.push({ type: "moderator", label: "Moderator" });
    isMod = true;
  } else if (r < 0.12) {
    badges.push({ type: "vip", label: "VIP" });
  }
  if (Math.random() < 0.18) {
    badges.push({ type: "subscriber", label: "Subscriber" });
    isSub = true;
  }
  if (platform === "kick" && Math.random() < 0.08) {
    badges.push({ type: "og", label: "OG" });
  }
  if (platform === "x" && Math.random() < 0.35) {
    badges.push({ type: "verified", label: "Verified" });
    isVerified = true;
  }
  return { badges, isMod, isSub, isStreamer, isVerified };
}

function generateMessage(): ChatMessage {
  const roll = Math.random();
  // Platform distribution: 60% Twitch, 30% Kick, 10% X
  const platform: Platform = roll < 0.6 ? "twitch" : roll < 0.9 ? "kick" : "x";
  const username =
    pick(USERNAMES) + (Math.random() < 0.3 ? Math.floor(Math.random() * 999) : "");
  const raw = pick(MESSAGES);
  const { badges, isMod, isSub, isStreamer, isVerified } = maybeBadges(platform);
  const parsed = parseMessage(raw);
  const now = Date.now();

  const isSubEvent = Math.random() < 0.04;
  const isFollowEvent = !isSubEvent && Math.random() < 0.03;
  const isFirstTime = Math.random() < 0.02;

  return {
    id: uuid(),
    platform,
    channel: pick(CHANNELS[platform]),
    author: {
      username,
      displayName: username,
      color: colorForUsername(username),
      badges,
      isStreamer,
      isModerator: isMod,
      isSubscriber: isSub,
      isVerified,
    },
    content: { raw, ...parsed },
    timestamp: now,
    receivedAt: now,
    isSubEvent: isSubEvent || undefined,
    isFollowEvent: isFollowEvent || undefined,
    isFirstTime: isFirstTime || undefined,
    xMeta:
      platform === "x"
        ? {
            tweetId: uuid(),
            likes: Math.floor(Math.random() * 800),
            retweets: Math.floor(Math.random() * 200),
            isReply: Math.random() < 0.25,
          }
        : undefined,
  };
}

// ── Engine ─────────────────────────────────────────────────────────────────────

type Listener = (msg: ChatMessage) => void;

/**
 * Simulates a realistic multi-platform chat stream with burst patterns.
 *
 * Normal mode: 1 message every 0.6–3.4 seconds
 * Burst mode: fires every 90–120s, lasts 15s at ~5–10 msg/s
 *
 * Usage:
 *   const unsub = mockChatEngine.subscribe(msg => setMessages(prev => [...prev, msg]));
 *   mockChatEngine.start();
 *   // cleanup:
 *   unsub();
 */
export class MockChatEngine {
  private listeners = new Set<Listener>();
  private timeout: ReturnType<typeof setTimeout> | null = null;
  private burstUntil = 0;
  private nextBurstAt = Date.now() + BURST_INTERVAL_MIN;
  private burstCount = 0;
  private running = false;

  /** Start the message generation loop. Idempotent. */
  start() {
    if (this.running) return;
    this.running = true;
    this.schedule();
  }

  /** Stop the message generation loop. Clears any pending timeout. */
  stop() {
    this.running = false;
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  /**
   * Subscribe to incoming messages.
   * @returns Unsubscribe function — call it in your cleanup (useEffect return).
   */
  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit() {
    const msg = generateMessage();
    this.listeners.forEach((fn) => fn(msg));
  }

  private schedule() {
    if (!this.running) return;

    const now = Date.now();

    // Trigger a new burst?
    if (now >= this.nextBurstAt) {
      this.burstUntil = now + BURST_DURATION;
      this.burstCount = 0;
      this.nextBurstAt =
        now + BURST_INTERVAL_MIN + Math.random() * BURST_INTERVAL_RANGE;
    }

    // Safety: end burst early if message cap reached
    const inBurst = now < this.burstUntil && this.burstCount < MAX_BURST_MESSAGES;

    const delay = inBurst
      ? BURST_MIN + Math.random() * BURST_RANGE
      : NORMAL_MIN + Math.random() * NORMAL_RANGE;

    this.timeout = setTimeout(() => {
      this.emit();
      if (inBurst) this.burstCount++;
      this.schedule();
    }, delay);
  }
}

/** Singleton instance shared across the application */
export const mockChatEngine = new MockChatEngine();
