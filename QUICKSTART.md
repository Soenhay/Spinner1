# Quick Start Guide

This app is now built with React + Vite. Follow these steps to run and deploy it.

## ✅ Prerequisites

- Node.js 18 or newer
- Git (optional, for deployment via GitHub)

On Windows PowerShell, if npm scripts are blocked by policy, run with `npm.cmd run <script>`.

## 🚀 Run Locally (Development)

```bash
npm install
npm run dev
```

Open the printed local URL in your browser.

## � Build and Preview (Production)

```bash
npm run build
npm run preview
```

This generates a `dist/` folder and serves it locally for a sanity check.

## 🌐 Deploy to Netlify

This repo includes `netlify.toml` with:

- Build command: `npm run build`
- Publish: `dist`
- SPA redirect

### Option 1: GitHub Integration (recommended)
1. Push the repository to GitHub
2. Connect it in the Netlify dashboard
3. Deploy — Netlify will use the provided config automatically

### Option 2: Netlify CLI
```bash
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod --dir=dist
```

## 🎯 How to Use

1. Add options via the input + Add (or press Enter)
2. Edit labels inline
3. Set weights with slider/number (higher = more likely)
4. Pick a slice color
5. Reorder using the ≡ drag handle
6. Click SPIN to pick a winner
7. Settings: toggle Sound, Confetti, Spin Duration, and Equal-size slices (probability-only)
8. Export/Import your configuration as JSON

Notes:
- Equal-size slices mode draws equal visual segments while still selecting winners by weight.
- If your OS prefers reduced motion, the app minimizes or skips animations.

## 💾 Data Persistence

Options and settings are saved in LocalStorage and loaded automatically.

## � Troubleshooting

**PowerShell blocks npm scripts**
- Use `npm.cmd run dev` (or adjust your execution policy if appropriate)

**Nothing happens on SPIN when reduced motion is on**
- That’s expected: we skip the animated spin and jump to the result for accessibility

**Deploy succeeds but route 404s**
- Ensure the SPA redirect is enabled (provided in `netlify.toml`)

**Import fails**
- Use a JSON file previously exported by the app

## 🔮 Coming Soon

- Export wheel as SVG/PNG
- Shareable permalinks and embed codes
- Theme presets and palettes

## 🎉 Enjoy!

Have fun making decisions with your spinner wheel!
