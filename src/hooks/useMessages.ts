import { useEffect, useState } from "react";
import type { ChatMessage } from "@/types";
import { mockChatEngine } from "@/engine/MockChatEngine";

/**
 * Subscribes to the mock chat engine and returns the accumulated message list.
 *
 * @param maxMessages - Maximum number of messages to keep in state.
 *   When exceeded, the oldest messages are trimmed to `maxMessages * 0.8`
 *   to avoid trimming on every single new message.
 */
export function useMessages(maxMessages = 500) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const trimTo = Math.floor(maxMessages * 0.8);

    const unsub = mockChatEngine.subscribe((msg) => {
      setMessages((prev) => {
        const next = prev.length >= maxMessages ? prev.slice(-trimTo) : prev;
        return [...next, msg];
      });
    });

    mockChatEngine.start();

    return () => {
      unsub();
    };
  }, [maxMessages]);

  return messages;
}
