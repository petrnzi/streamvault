# StreamVault Assets

This folder contains all brand and media assets used in both the application and the repository.

## Files

| File | Format | Used in |
|------|--------|---------|
| `logo.svg` | SVG | App header, browser tab favicon |
| `logo-white.svg` | SVG | README header, dark backgrounds |
| `logo-dark.svg` | SVG | Light backgrounds, print |
| `logo-twitch.svg` | SVG | Platform badges, README |
| `logo-kick.svg` | SVG | Platform badges, README |
| `logo-x.svg` | SVG | Platform badges, README |
| `logo-twitter.png` | PNG 512×512 | Social sharing (OG image) |
| `live-demo.mp4` | MP4 1080p | README demo video |

## Fonts

The app uses **SF Pro Display / SF Pro Text** (Apple system font, licensed for use on Apple platforms).
On non-Apple systems it falls back to **Geist** by Vercel (open source, included via npm).

To add SF Pro for web use, place the font files in `public/fonts/` and update `src/styles.css`.

## Adding Binary Assets

Place the following files here manually (not tracked by Git if > 5MB):
- `logo-twitter.png` — 512×512 PNG, transparent or white background
- `live-demo.mp4` — Screen recording of the live app, 1080p60, max 60s

For the demo video, use the `/obs` route for a clean overlay recording.
