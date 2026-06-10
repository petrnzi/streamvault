import type { MessageSegment } from "@/types";

// ── Constants ──────────────────────────────────────────────────────────────────

const URL_RE = /(https?:\/\/[^\s]+)/g;
const MENTION_RE = /@([a-zA-Z0-9_]{2,25})/g;
const HASHTAG_RE = /#([a-zA-Z0-9_]{2,40})/g;
const EMOTE_RE = /\[([A-Z][a-zA-Z0-9]+)\]/g;

/** Hard cap to prevent regex DoS on malicious long inputs */
const MAX_MESSAGE_LENGTH = 500;

const ALLOWED_PROTOCOLS = ["http:", "https:"];

// ── Types ──────────────────────────────────────────────────────────────────────

interface Match {
  start: number;
  end: number;
  segment: MessageSegment;
}

export interface ParsedMessage {
  segments: MessageSegment[];
  hasEmotes: boolean;
  hasMention: boolean;
  hasLink: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Validates that a URL uses an allowed protocol.
 * Prevents javascript: and data: XSS vectors.
 */
function isSafeUrl(url: string): boolean {
  try {
    return ALLOWED_PROTOCOLS.includes(new URL(url).protocol);
  } catch {
    return false;
  }
}

// ── Parser ─────────────────────────────────────────────────────────────────────

/**
 * Parses a raw chat message string into typed segments.
 * Handles plain text, URLs, @mentions, #hashtags, and [Emote] tokens.
 *
 * Security guarantees:
 * - Input is capped at MAX_MESSAGE_LENGTH to prevent ReDoS
 * - URLs are validated for safe protocols (no javascript:, data:)
 * - Falls back to plain-text segment on any parsing error
 */
export function parseMessage(raw: string): ParsedMessage {
  const safeRaw = raw.slice(0, MAX_MESSAGE_LENGTH);

  try {
    const matches: Match[] = [];

    for (const m of safeRaw.matchAll(URL_RE)) {
      const url = m[1];
      if (isSafeUrl(url)) {
        matches.push({
          start: m.index!,
          end: m.index! + m[0].length,
          segment: { type: "link", url, display: url },
        });
      }
    }
    for (const m of safeRaw.matchAll(MENTION_RE)) {
      matches.push({
        start: m.index!,
        end: m.index! + m[0].length,
        segment: { type: "mention", username: m[1] },
      });
    }
    for (const m of safeRaw.matchAll(HASHTAG_RE)) {
      matches.push({
        start: m.index!,
        end: m.index! + m[0].length,
        segment: { type: "hashtag", tag: m[1] },
      });
    }
    for (const m of safeRaw.matchAll(EMOTE_RE)) {
      matches.push({
        start: m.index!,
        end: m.index! + m[0].length,
        segment: { type: "emote", id: m[1], name: m[1] },
      });
    }

    matches.sort((a, b) => a.start - b.start);

    const segments: MessageSegment[] = [];
    let cursor = 0;

    for (const m of matches) {
      if (m.start < cursor) continue;
      if (m.start > cursor) {
        segments.push({ type: "text", content: safeRaw.slice(cursor, m.start) });
      }
      segments.push(m.segment);
      cursor = m.end;
    }
    if (cursor < safeRaw.length) {
      segments.push({ type: "text", content: safeRaw.slice(cursor) });
    }
    if (segments.length === 0) {
      segments.push({ type: "text", content: safeRaw });
    }

    return {
      segments,
      hasEmotes: segments.some((s) => s.type === "emote"),
      hasMention: segments.some((s) => s.type === "mention"),
      hasLink: segments.some((s) => s.type === "link"),
    };
  } catch (err) {
    // Fallback: treat entire message as plain text
    console.error("[StreamVault] Message parsing failed:", err);
    return {
      segments: [{ type: "text", content: safeRaw }],
      hasEmotes: false,
      hasMention: false,
      hasLink: false,
    };
  }
}
