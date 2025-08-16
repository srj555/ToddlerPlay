# Toddler Play — 1–2 Year Olds (Multi‑Page, Static, GH Pages Ready)

**Zero-dependency** HTML/CSS/JS app for toddlers with **huge tap targets**, **smooth animations**, **bold contrast themes**, and **gentle sounds**.

Pages (Phase 1)
- 🫧 **Pop Bubbles** — tap floating bubbles to pop.
- 🐾 **Animal Sounds** — big animal cards with spoken names + playful "woof/meow" voices.
- 🥁 **Drum Pads** — giant colorful pads (kick/snare/hat/toms) using WebAudio.
- 🌈 **Color Splash** — tap/swipe to cycle colors; voice announces color.

Features
- 1‑tap **Theme switcher** with curated palettes (Candy Pop, Ocean Breeze, Sunset Sorbet, Forest Mint, High Contrast).
- **LocalStorage** remembers theme.
- **Soft confetti** burst on milestones (10 pops, etc.).
- GitHub Actions workflow to deploy to **GitHub Pages**.

## Run
Double-click `index.html` or start a tiny server:
```bash
python3 -m http.server 8000
```

## Deploy to GitHub Pages
Push this folder to a repo → Settings → Pages → choose **GitHub Actions**.
The included `.github/workflows/pages.yml` deploys on push to `main` or `master`.