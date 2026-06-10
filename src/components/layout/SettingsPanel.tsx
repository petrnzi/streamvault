import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Info, X } from "lucide-react";
import { useState } from "react";
import type { AppSettings, ChatMessage } from "@/types";
import { Toggle } from "@/components/ui/SwitchToggle";

interface Props {
  open: boolean;
  onClose: () => void;
  settings: AppSettings;
  setSettings: (updater: (s: AppSettings) => AppSettings) => void;
  messages: ChatMessage[];
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border-subtle px-5 py-4">
      <div className="mb-3 font-mono text-2xs tracking-[0.1em] text-text-muted">
        {title.toUpperCase()}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[12px] text-text-secondary">{label}</span>
      {children}
    </div>
  );
}

function exportCSV(messages: ChatMessage[]) {
  const rows = [
    ["timestamp", "platform", "channel", "username", "message"].join(","),
    ...messages.map((m) =>
      [
        new Date(m.timestamp).toISOString(),
        m.platform,
        m.channel,
        m.author.username,
        `"${m.content.raw.replace(/"/g, '""')}"`,
      ].join(",")
    ),
  ].join("\n");
  const blob = new Blob([rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `streamvault-chat-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function SettingsPanel({ open, onClose, settings, setSettings, messages }: Props) {
  const [showToken, setShowToken] = useState(false);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 backdrop-blur-sm"
            style={{ background: "rgba(5,5,10,0.7)" }}
          />
          <motion.aside
            initial={{ x: 360 }}
            animate={{ x: 0 }}
            exit={{ x: 360 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 z-50 flex h-full w-[360px] flex-col overflow-y-auto border-l border-border-subtle bg-surface"
          >
            <div className="flex h-[52px] flex-shrink-0 items-center justify-between border-b border-border-subtle px-5">
              <h2 className="text-[16px] font-semibold text-text-primary">Settings</h2>
              <button
                onClick={onClose}
                className="text-text-muted hover:text-text-primary"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <Section title="Display">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[12px] text-text-secondary">Font size</span>
                  <span className="font-mono text-[11px] text-text-muted">
                    {settings.fontSize}px
                  </span>
                </div>
                <input
                  type="range"
                  min={11}
                  max={20}
                  value={settings.fontSize}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, fontSize: Number(e.target.value) }))
                  }
                  className="w-full accent-twitch"
                />
              </div>
              <Row label="Compact mode">
                <Toggle
                  checked={settings.compactMode}
                  onChange={(v) => setSettings((s) => ({ ...s, compactMode: v }))}
                />
              </Row>
              <Row label="Show timestamps">
                <Toggle
                  checked={settings.showTimestamps}
                  onChange={(v) => setSettings((s) => ({ ...s, showTimestamps: v }))}
                />
              </Row>
              <Row label="Show badges">
                <Toggle
                  checked={settings.showBadges}
                  onChange={(v) => setSettings((s) => ({ ...s, showBadges: v }))}
                />
              </Row>
              <Row label="Max messages">
                <div className="inline-flex overflow-hidden rounded-md border border-border-subtle">
                  {[100, 200, 500].map((n) => (
                    <button
                      key={n}
                      onClick={() => setSettings((s) => ({ ...s, maxMessages: n }))}
                      className="px-3 py-1 font-mono text-[11px] transition-colors"
                      style={{
                        background: settings.maxMessages === n ? "#9146FF" : "transparent",
                        color: settings.maxMessages === n ? "#fff" : "#9090A8",
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </Row>
            </Section>

            <Section title="X Integration">
              <div className="flex gap-2">
                {(["demo", "api"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setSettings((s) => ({ ...s, xMode: m }))}
                    className="flex-1 rounded-md border px-3 py-2 text-[12px] capitalize transition-colors"
                    style={{
                      borderColor: settings.xMode === m ? "#9146FF" : "#1A1A26",
                      background: settings.xMode === m ? "rgba(145,70,255,0.1)" : "transparent",
                      color: settings.xMode === m ? "#fff" : "#9090A8",
                    }}
                  >
                    {m === "demo" ? "Demo Mode" : "API Mode"}
                  </button>
                ))}
              </div>
              {settings.xMode === "api" && (
                <>
                  <div className="relative">
                    <input
                      type={showToken ? "text" : "password"}
                      placeholder="Bearer token"
                      value={settings.xBearerToken ?? ""}
                      onChange={(e) =>
                        setSettings((s) => ({ ...s, xBearerToken: e.target.value }))
                      }
                      className="w-full rounded-md border border-border-subtle bg-elevated px-3 py-2 pr-9 font-mono text-[12px] text-text-primary outline-none focus:border-twitch"
                    />
                    <button
                      onClick={() => setShowToken((v) => !v)}
                      className="absolute top-1/2 right-2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                    >
                      {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <input
                    placeholder="Search query (e.g. #ad)"
                    value={settings.xSearchQuery ?? ""}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, xSearchQuery: e.target.value }))
                    }
                    className="w-full rounded-md border border-border-subtle bg-elevated px-3 py-2 text-[12px] text-text-primary outline-none focus:border-twitch"
                  />
                </>
              )}
              <div className="flex gap-2 rounded-md border border-border-subtle bg-elevated p-2.5 text-[11px] text-text-muted">
                <Info size={14} className="mt-0.5 flex-shrink-0" />
                <span>
                  X free tier limits requests to ~1/15min. Demo mode simulates a steady stream.
                </span>
              </div>
            </Section>

            <Section title="Notifications">
              <Row label="Sound on highlight">
                <Toggle
                  checked={settings.soundOnHighlight}
                  onChange={(v) => setSettings((s) => ({ ...s, soundOnHighlight: v }))}
                />
              </Row>
              <Row label="Sound on sub / follow">
                <Toggle
                  checked={settings.soundOnEvent}
                  onChange={(v) => setSettings((s) => ({ ...s, soundOnEvent: v }))}
                />
              </Row>
            </Section>

            <Section title="Export">
              <button
                onClick={() => exportCSV(messages)}
                className="w-full rounded-md border border-border-default bg-elevated py-2 text-[12px] text-text-primary transition-colors hover:border-twitch hover:text-twitch"
              >
                Export Chat Log (CSV)
              </button>
            </Section>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
