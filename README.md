<div align="center">

<img src="assets/logo-white.svg" alt="StreamVault" width="280" />

<br/>
<br/>

<video src="assets/live-demo.mp4" width="800" autoplay loop muted playsinline></video>

> *If the video doesn't render above, watch the **[▶ Live Demo](https://your-username.github.io/streamvault)***

<br/>

**[▶ Live Demo](https://your-username.github.io/streamvault)** · **[GitHub](https://github.com/your-username/streamvault)**

<br/>

![Version](https://img.shields.io/badge/version-1.0.0-9146FF?style=flat-square&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-00CC7A?style=flat-square)

</div>

---

## What is StreamVault?

StreamVault is a **unified real-time chat aggregator** built for professional streamers who multistream across platforms. Instead of managing three separate browser tabs, StreamVault brings every voice into a single, dark-premium interface — with live analytics that tell you *exactly* what your audience is feeling.

> **One window. Every voice.** Built for the [MarketBubble $10k Vibe Code Challenge](https://x.com/marketbubble).

---

## The Problem It Solves

Multi-platform streamers face a real operational problem: Twitch, Kick, and X chats move simultaneously, on separate windows, with no unified view. Missing a highlight moment, a first-time chatter, or a raid announcement on the wrong tab is the norm — not the exception.

StreamVault solves this by:
- Aggregating all three platforms into **one scrolling feed**
- Labeling every message with its **source platform** (color-coded, instant recognition)
- Providing **Stream Intelligence** — a live analytics panel that tracks hype, trending words, chat velocity, and active users in real time
- Offering an **OBS Browser Source mode** — so the aggregated chat becomes a stream overlay

---

## Features

<table>
<tr>
<td width="50%" valign="top">

### 💬 Chat Core
- Real-time messages from **Twitch**, **Kick**, and **X**
- Color-coded platform source labels on every message
- Platform filter toggles (show/hide per source)
- Keyword search with 150ms debounce
- Auto-scroll with "N new messages" badge when paused
- First-time chatter detection & highlighting
- Sub/follow event banners with gold gradient
- @mention auto-highlight in platform color
- Animated gradient username for **premium users** (subscribers & verified)

</td>
<td width="50%" valign="top">

### 📊 Stream Intelligence Panel
- **Hype Meter** — SVG semicircle gauge, spring-animated needle
- **Chat Velocity** — messages/min with sparkline history chart
- **Platform Split** — proportional activity bar, animated
- **Trending Words** — top 5 keywords from last 30 seconds
- **Active Users** — unique chatters in last 60 seconds
- All analytics update every second, zero latency

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🎬 OBS Browser Source (`/obs`)
- Transparent background for stream overlays
- Three visual styles: `pill`, `line`, `ghost`
- Per-message TTL (auto-expire, default 25s)
- Fully configurable via URL params
- Optimized for GPU compositing

</td>
<td width="50%" valign="top">

### ⚙️ Settings & Config
- Font size slider (11–20px), live preview
- Compact mode for high-density feeds
- Toggle timestamps & user badges
- Max messages cap (100 / 200 / 500)
- X API Mode with Bearer Token input
- CSV export of full chat log
- All settings persisted in localStorage

</td>
</tr>
</table>

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         StreamVault                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  MockChatEngine (src/engine/)                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Twitch 60% ──┐                                              │   │
│  │  Kick    30% ──┼──► generateMessage() ──► Listener.forEach() │   │
│  │  X       10% ──┘         ↑                                   │   │
│  │                    parseMessage()                            │   │
│  │                    colorForUsername()                        │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                          │                                          │
│                    useMessages(maxMessages)                         │
│                          │                                          │
│          ┌───────────────┴────────────────┐                         │
│          │                                │                         │
│   useChatAnalytics()               ChatFeed + ChatMessage           │
│   ┌───────────────────┐             ┌───────────────────────┐       │
│   │ Hype Meter        │             │ Framer Motion enter   │       │
│   │ Velocity sparkline│             │ Platform badge        │       │
│   │ Platform split    │             │ Premium gradient name │       │
│   │ Top keywords      │             │ Action bar on hover   │       │
│   │ Active users      │             │ Auto-scroll / pause   │       │
│   └───────────────────┘             └───────────────────────┘       │
│                                                                     │
│  Routes: / (main app)  ·  /obs (OBS overlay)                       │
└─────────────────────────────────────────────────────────────────────┘

Replace MockChatEngine with a real Socket.io backend
to connect to live Twitch IRC, Kick Pusher, and X API v2.
```

---

## Tech Stack

```
                    StreamVault
                        │
          ┌─────────────┼─────────────┐
          │             │             │
        Stack      Analytics       Infra
          │             │             │
  ┌───────┼──────┐  ┌───┼───┐  ┌─────┼─────┐
  │       │      │  │       │  │           │
React  Vite  TS  │ Recharts  │ TanStack   Vite
 19    7   5.8   │ Framer    │  Router   Tailwind
              Motion      CSS v4
                          Lucide
                          Geist
```

| Layer | Technology | Version |
|-------|-----------|---------|
| UI Framework | React + TypeScript | 19 / 5.8 |
| Build Tool | Vite | 7 |
| Router | TanStack Router (file-based) | 1.x |
| Styling | Tailwind CSS | v4 |
| Animation | Framer Motion | 12 |
| Charts | Recharts | 3 |
| Icons | Lucide React | 0.575 |
| Fonts | Geist Sans + Geist Mono | 5.x |

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/your-username/streamvault.git
cd streamvault

# 2. Install
npm install

# 3. Run
npm run dev
# → http://localhost:5173
```

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Optional: X (Twitter) API

```bash
cp .env.example .env.local
# Edit .env.local:
# VITE_X_BEARER_TOKEN=your_token_here
```

Then open **Settings → X Integration → API Mode** and enter your Bearer Token.

---

## OBS Setup

1. In OBS → **Add Source → Browser Source**
2. URL: `https://your-domain.com/obs`
3. Width: `400` · Height: `800`
4. ✅ **Shutdown source when not visible**

**Customize with URL params:**

```
/obs?platforms=twitch,kick,x&ttl=25&fontSize=15&style=pill&position=bottom
```

| Param | Default | Options |
|-------|---------|---------|
| `platforms` | `twitch,kick,x` | comma-separated |
| `ttl` | `25` | seconds before message fades |
| `fontSize` | `15` | px |
| `style` | `pill` | `pill` · `line` · `ghost` |
| `position` | `bottom` | `bottom` · `top` |
| `maxMessages` | `30` | count |

---

## Project Structure

```
streamvault/
├── assets/                    # Brand assets (logos, fonts, media)
├── src/
│   ├── components/
│   │   ├── chat/              # ChatFeed + ChatMessage
│   │   ├── intelligence/      # HypeMeter, VelocityCard, PlatformSplit,
│   │   │                      # TopKeywords, ActiveUsers
│   │   ├── layout/            # AppHeader, LeftSidebar, IntelligencePanel,
│   │   │                      # StatusBar, SettingsPanel
│   │   └── ui/                # PlatformBadge, UserAvatar, UserBadges,
│   │                          # SwitchToggle
│   ├── engine/
│   │   └── MockChatEngine.ts  # Simulated multi-platform stream
│   ├── hooks/
│   │   ├── useChatAnalytics.ts
│   │   ├── useDebounce.ts
│   │   ├── useInterval.ts
│   │   ├── useMessages.ts
│   │   └── useSettings.ts
│   ├── lib/
│   │   ├── colorUtils.ts      # Username → deterministic color
│   │   ├── formatters.ts      # Time, number, duration formatters
│   │   ├── platforms.ts       # Platform metadata (name, color, letter)
│   │   ├── textParser.ts      # Message → typed segments (XSS-safe)
│   │   └── utils.ts           # cn() Tailwind merge helper
│   ├── routes/
│   │   ├── __root.tsx         # App shell, error/404 boundaries
│   │   ├── index.tsx          # Main dashboard (/)
│   │   └── obs.tsx            # OBS overlay (/obs)
│   ├── types/
│   │   ├── chat.ts            # ChatMessage, ChatAuthor, Badge, Segment
│   │   ├── platform.ts        # Platform, PlatformStatus
│   │   └── settings.ts        # AppSettings
│   └── styles.css             # Tailwind v4 theme + global styles
├── .env.example
├── package.json
└── vite.config.ts
```

---

## Roadmap

The current version ships with a realistic mock engine. The natural next step is a lightweight Node.js backend that bridges real platform APIs:

- [ ] **Twitch** — tmi.js IRC WebSocket (anonymous read, no auth needed)
- [ ] **Kick** — Pusher WebSocket (`ws-us2.pusher.com`, public channels)
- [ ] **X API v2** — Filtered stream or search polling (Bearer Token)
- [ ] **Sound alerts** — Web Audio API for sub/raid notifications
- [ ] **Multi-channel** — Connect multiple channels per platform
- [ ] **Message pinning** — Persistent pinned messages at feed top
- [ ] **Clip detection** — Auto-detect "clip it" spikes for auto-clipping

---

## X Integration Notes

| Mode | Setup | Rate Limit |
|------|-------|-----------|
| **Demo Mode** (default) | No config needed | Unlimited (simulated) |
| **API Mode** | Bearer Token required | ~500k reads/month (free tier) |
| **Real-time streaming** | X API Basic plan | $100/mo |

> **Security:** Bearer Tokens are stored **only in memory** for the duration of the session. They are never written to `localStorage` or any persistent storage.

---

## License

MIT — see [LICENSE](./LICENSE)

---

<div align="center">

Built with ❤️ for the **[MarketBubble $10k Vibe Code Challenge](https://x.com/marketbubble)**

*StreamVault — One window. Every voice.*

<img src="assets/logo.svg" alt="StreamVault" width="40" />

</div>
