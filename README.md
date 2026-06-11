<div align="center">

<br/>

<img src="public/assets/logo-white.svg" alt="StreamVault" width="560" />

<br/>
<br/>

![StreamVault Demo](public/assets/video.gif)

<br/>

### [▶ Live Demo](https://petrnzi.github.io/streamvault/)

<br/>

![Version](https://img.shields.io/badge/version-1.0.0-9146FF?style=flat-square)
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

StreamVault fixes this with:
- One scrolling feed for all three platforms
- Color-coded **source labels** on every message — instant recognition
- **Stream Intelligence Panel** — live hype meter, chat velocity, keyword trends, platform split
- **OBS Browser Source mode** — the aggregated chat becomes a stream overlay

---

## Features

<table>
<tr>
<td width="50%" valign="top">

### 💬 Chat Core
- Real-time messages from **Twitch**, **Kick**, and **X**
- Platform logo on every message — instant source recognition
- Platform filter toggles (show/hide per source)
- Keyword search with 150ms debounce
- Auto-scroll with "N new messages" badge when paused
- First-time chatter detection & highlighting
- Sub/follow event banners with gold gradient
- @mention auto-highlight in platform color
- Animated gradient username for **subscribers & verified** users (`#1DA1F2 → #00E701 → #8956FB`)
- White username + platform logo for regular users

</td>
<td width="50%" valign="top">

### 📊 Stream Intelligence Panel
- **Hype Meter** — SVG semicircle gauge, spring-animated needle, zones: Calm / Hype / 🔥 Lit
- **Chat Velocity** — messages/min with 60s sparkline history chart
- **Platform Split** — proportional animated activity bar per platform
- **Trending Words** — top 5 keywords from last 30 seconds (stop-word filtered)
- **Active Users** — unique chatters in last 60 seconds
- All widgets update every second — zero perceived latency

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🎬 OBS Browser Source (`/obs`)
- Fully transparent background for stream overlays
- Three visual styles: `pill`, `line`, `ghost`
- Per-message TTL — messages auto-expire and fade out
- Stack direction: `bottom` (default) or `top`
- Fully configurable via URL params — no UI needed
- GPU-composited with `will-change: transform`

</td>
<td width="50%" valign="top">

### ⚙️ Settings & Config
- Font size slider (11–20px) with live preview
- Compact mode for high-density feeds
- Toggle timestamps & user badges independently
- Max messages cap: 100 / 200 / 500
- X integration: Demo Mode or API Mode (Bearer Token)
- CSV export of full session chat log
- All settings persisted in `localStorage`

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
│  │                    parseMessage()   (XSS-safe URL validator)  │   │
│  │                    colorForUsername() (hash → HSL)            │   │
│  │                    Burst mode: 5–10 msg/s every 90–120s       │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                          │                                          │
│                    useMessages(maxMessages)                         │
│                          │                                          │
│          ┌───────────────┴────────────────┐                         │
│          │                                │                         │
│   useChatAnalytics()               ChatFeed + ChatMessage           │
│   ┌───────────────────┐             ┌───────────────────────┐       │
│   │ Hype Meter        │             │ Framer Motion enter   │       │
│   │ Velocity sparkline│             │ Platform logo badge   │       │
│   │ Platform split    │             │ Premium gradient name │       │
│   │ Top keywords      │             │ Action bar on hover   │       │
│   │ Active users      │             │ Auto-scroll / pause   │       │
│   └───────────────────┘             └───────────────────────┘       │
│                                                                     │
│  Routes: / (main dashboard)  ·  /obs (OBS transparent overlay)     │
└─────────────────────────────────────────────────────────────────────┘

→ Replace MockChatEngine with a Socket.io backend to connect
  live Twitch IRC, Kick Pusher WebSocket, and X API v2.
```

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| UI Framework | React + TypeScript | 19 / 5.8 |
| Build Tool | Vite | 7 |
| Router | React Router | 7 |
| Styling | Tailwind CSS | v4 |
| Animation | Framer Motion | 12 |
| Charts | Recharts | 3 |
| Icons | Lucide React | 0.575 |
| Fonts | Geist Sans + Geist Mono | 5.x |

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/petrnzi/streamvault.git
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

# Preview production build locally
npm run preview
```

### Optional: X (Twitter) API

```bash
cp .env.example .env.local
# Edit .env.local and add your Bearer Token
```

Then open **Settings → X Integration → API Mode**.

> **Security:** Bearer Tokens are stored only in memory for the session. Never written to `localStorage`.

---

## OBS Browser Source Setup

1. In OBS → **Add Source → Browser Source**
2. URL: `https://petrnzi.github.io/streamvault/#/obs`
3. Width: `400` · Height: `800`
4. ✅ **Shutdown source when not visible**

**Customize with URL params:**

```
#/obs?platforms=twitch,kick,x&ttl=25&fontSize=15&style=pill&position=bottom
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
├── public/
│   └── assets/               # Brand assets served at /assets/
│       ├── logo.svg
│       ├── logo-white.svg
│       ├── logo-dark.svg
│       ├── logo-twitch.svg
│       ├── logo-kick.svg
│       └── logo-x.svg
├── src/
│   ├── components/
│   │   ├── chat/             # ChatFeed + ChatMessage
│   │   ├── intelligence/     # HypeMeter, VelocityCard, PlatformSplit,
│   │   │                     # TopKeywords, ActiveUsers
│   │   ├── layout/           # AppHeader, LeftSidebar, IntelligencePanel,
│   │   │                     # StatusBar, SettingsPanel
│   │   └── ui/               # PlatformBadge, PlatformLogo, UserAvatar,
│   │                         # UserBadges, SwitchToggle
│   ├── engine/
│   │   └── MockChatEngine.ts # Simulated multi-platform stream with burst mode
│   ├── hooks/
│   │   ├── useChatAnalytics.ts
│   │   ├── useDebounce.ts
│   │   ├── useInterval.ts
│   │   ├── useMessages.ts
│   │   └── useSettings.ts
│   ├── lib/
│   │   ├── colorUtils.ts     # Username → deterministic HSL color
│   │   ├── formatters.ts     # Time, number, duration formatters
│   │   ├── platforms.ts      # Platform metadata (name, color, letter)
│   │   ├── textParser.ts     # Message → typed segments (XSS-safe)
│   │   └── utils.ts          # cn() Tailwind merge helper
│   ├── pages/
│   │   ├── Index.tsx         # Main dashboard (/)
│   │   └── OBSMode.tsx       # OBS overlay (/obs)
│   ├── types/
│   │   ├── chat.ts           # ChatMessage, ChatAuthor, Badge, Segment
│   │   ├── platform.ts       # Platform, PlatformStatus
│   │   └── settings.ts       # AppSettings
│   ├── main.tsx              # App entry point
│   └── styles.css            # Tailwind v4 theme + global styles
├── .env.example
├── index.html
├── package.json
└── vite.config.ts
```

---

## Connecting Real Platform APIs

The app ships with a realistic mock engine. To connect real platforms, replace `MockChatEngine` with a Socket.io backend:

| Platform | Protocol | Auth |
|----------|---------|------|
| **Twitch** | IRC WebSocket via `tmi.js` | None (anonymous read) |
| **Kick** | Pusher WebSocket (`ws-us2.pusher.com`) | None (public channels) |
| **X / Twitter** | REST API v2 polling | Bearer Token (free tier) |

Real-time X streaming requires the Basic plan ($100/mo). The free tier supports ~500k tweet reads/month via search polling.

---

## Roadmap

- [ ] Real Socket.io backend with live platform connectors
- [ ] Sound alerts — Web Audio API for sub/raid notifications  
- [ ] Multi-channel support — connect multiple channels per platform
- [ ] Message pinning — persistent pinned messages at feed top
- [ ] Clip detection — auto-detect "clip it" spikes
- [ ] Mobile layout — bottom sheet panels for small screens

---

## License

MIT — see [LICENSE](./LICENSE)

---

<div align="center">

Built with ❤️ for the **[MarketBubble $10k Vibe Code Challenge](https://x.com/marketbubble)**

*StreamVault — One window. Every voice.*

</div>
