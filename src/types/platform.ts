export type Platform = "twitch" | "kick" | "x";

export interface PlatformStatus {
  platform: Platform;
  connected: boolean;
  connecting: boolean;
  channels: string[];
  messagesReceived: number;
}
