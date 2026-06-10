<div align="center">

<br/>

<img src="assets/logo-white.svg" alt="StreamVault" width="560" />

<br/>
<br/>

https://github.com/user-attachments/assets/live-demo.mp4

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

StreamVault is a **unified real-time chat aggregator** built for professional streamers who multistream across platforms. Instead of managing three separate browser tabs, StreamVault brings every voice into a single, dark-premium interface — with live analytics that tell you exactly what your audience is feeling.

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
- Keyword search with debounce
- Auto-scroll with "N new messages" badge when paused
- First-time chatter detection & highlighting
- Sub/follow event banners
- @mention auto-highlight in platform color
- Animated gradient username for **subscribers & verified** users

</td>
<td width="50%" valign="top">

### 📊 Stream Intelligence Panel
- **Hype Meter** — SVG gauge, spring-animated needle
- **Chat Velocity** — messages/min with sparkline chart
- **Platform Split** — proportional activity bar
- **Trending Words** — top 5 keywords, last 30 seconds
- **Active Users** — unique chatters, last 60 seconds
- Updates every second, zero latency

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🎬 OBS Browser Source (`/obs`)
- Transparent background for stream overlays
- Three styles: `pill`, `line`, `ghost`
- Per-message TTL auto-expire
- Fully configurable via URL params

</td>
<td width="50%" valign="top">

### ⚙️ Settings
- Font size slider, compact mode
- Toggle timestamps & badges
- Max messages cap (100 / 200 / 500)
- X API Mode with Bearer Token
- CSV export of chat log

</td>
</tr>
</table>

---

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                    StreamVault                       │
├──────────────────────────────────────────────────────┤
│  MockChatEngine                                      │
│  Twitch 60% ──┐                                      │
│  Kick    30% ──┼──► generateMessage() ──► listeners  │
│  X       10% ──┘         ↑                           │
│                    parseMessage() + colorUtils()     │
├──────────────────────────────────────────────────────┤
│  useMessages(maxMessages)  ←  subscriber hook        │
├───────────────────┬──────────────────────────────────┤
│  useChatAnalytics │  ChatFeed + ChatMessage           │
│  ┌─────────────┐  │  ┌──────────────────────────┐    │
│  │ Hype Meter  │  │  │ Framer Motion enter anim │    │
│  │ Velocity    │  │  │ Platform logo badge      │    │
│  │ Keywords    │  │  │ Premium gradient username│    │
│  │ Active users│  │  │ Auto-scroll / pause      │    │
│  └─────────────┘  │  └──────────────────────────┘    │
└───────────────────┴──────────────────────────────────┘
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
git clone https://github.com/your-username/streamvault.git
cd streamvault
npm install
npm run dev
# → http://localhost:5173
```

---

## OBS Setup

```
/obs?platforms=twitch,kick,x&ttl=25&fontSize=15&style=pill
```

| Param | Default | Options |
|-------|---------|---------|
| `platforms` | `twitch,kick,x` | comma-separated |
| `ttl` | `25` | seconds before message fades |
| `fontSize` | `15` | px |
| `style` | `pill` | `pill` · `line` · `ghost` |
| `position` | `bottom` | `bottom` · `top` |

---

## License

MIT

---

<div align="center">

Built for the **[MarketBubble $10k Vibe Code Challenge](https://x.com/marketbubble)**

*StreamVault — One window. Every voice.*

</div>
