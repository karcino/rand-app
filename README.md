# RAND

Single-file bundled web app, packaged as an installable PWA (offline-capable,
touch-friendly) for iPhone and Android.

- **Live (GitHub Pages):** https://karcino.github.io/rand-app/
- **Live (Vercel):** added after first Vercel deploy

## Install on phone
- **iPhone (Safari):** Share → *Add to Home Screen*
- **Android (Chrome):** menu ⋮ → *Install app* / *Add to Home screen*

## Files
- `index.html` — the bundled app (with injected PWA + touch config)
- `manifest.webmanifest` — PWA manifest
- `sw.js` — service worker (offline cache; bump `CACHE` on redeploy)
- `icon.svg`, `icon-*.png`, `apple-touch-icon-180.png` — icons
