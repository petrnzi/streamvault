import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { IntelligencePanel } from "@/components/layout/IntelligencePanel";
import { StatusBar } from "@/components/layout/StatusBar";
import { ChatFeed } from "@/components/chat/ChatFeed";
import { SettingsPanel } from "@/components/layout/SettingsPanel";
import { useMessages } from "@/hooks/useMessages";
import { useChatAnalytics } from "@/hooks/useChatAnalytics";
import { useSettings } from "@/hooks/useSettings";
import { useInterval } from "@/hooks/useInterval";
import type { Platform, PlatformStatus } from "@/types";

export function Index() {
  const navigate = useNavigate();
  const [settings, setSettings] = useSettings();
  const messages = useMessages(settings.maxMessages);
  const analytics = useChatAnalytics(messages);

  const [search, setSearch] = useState("");
  const [highlightMentions, setHighlightMentions] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [latency, setLatency] = useState(24);
  const [sessionStart] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());

  useInterval(() => setNow(Date.now()), 1000);
  useInterval(() => setLatency(18 + Math.floor(Math.random() * 40)), 4000);

  const [channels, setChannels] = useState<Record<Platform, string[]>>({
    twitch: ["xqc"],
    kick: ["adin"],
    x: ["live-thread"],
  });

  const statuses: PlatformStatus[] = useMemo(
    () =>
      (["twitch", "kick", "x"] as Platform[]).map((p) => ({
        platform: p,
        connected: settings.activePlatforms.includes(p),
        connecting: false,
        channels: channels[p],
        messagesReceived: analytics.platformCounts[p] ?? 0,
      })),
    [settings.activePlatforms, channels, analytics.platformCounts],
  );

  const togglePlatform = (p: Platform) => {
    setSettings((s) => ({
      ...s,
      activePlatforms: s.activePlatforms.includes(p)
        ? s.activePlatforms.filter((x) => x !== p)
        : [...s.activePlatforms, p],
    }));
  };

  const addChannel = (p: Platform, channel: string) =>
    setChannels((prev) => ({ ...prev, [p]: [...new Set([...prev[p], channel])] }));

  const removeChannel = (p: Platform, channel: string) =>
    setChannels((prev) => ({ ...prev, [p]: prev[p].filter((x) => x !== channel) }));

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-void">
      <AppHeader
        statuses={statuses}
        latency={latency}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenObs={() => navigate("/obs")}
      />
      <div className="flex min-h-0 flex-1">
        <LeftSidebar
          statuses={statuses}
          onTogglePlatform={togglePlatform}
          onAddChannel={addChannel}
          onRemoveChannel={removeChannel}
          searchQuery={search}
          onSearch={setSearch}
          highlightMentions={highlightMentions}
          onHighlightMentions={setHighlightMentions}
          totalMessages={messages.length}
          uptimeMs={now - sessionStart}
          activeCount={settings.activePlatforms.length}
        />
        <ChatFeed
          messages={messages}
          activePlatforms={settings.activePlatforms}
          onTogglePlatform={togglePlatform}
          fontSize={settings.fontSize}
          showTimestamps={settings.showTimestamps}
          showBadges={settings.showBadges}
          compact={settings.compactMode}
          searchQuery={search}
        />
        <IntelligencePanel analytics={analytics} />
      </div>
      <StatusBar
        statuses={statuses}
        msgPerMin={analytics.msgPerMin}
        total={messages.length}
        uptimeMs={now - sessionStart}
      />
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        setSettings={setSettings}
        messages={messages}
      />
    </div>
  );
}
