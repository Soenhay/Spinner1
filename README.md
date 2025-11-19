# 🎯 Spinner Wheel

A modern, interactive spinner wheel for random selections and decisions. Built with React + Vite, rendered on Canvas, and deployed-friendly for Netlify.

## ✨ Features

- 🎨 Modern, responsive UI
- 🎡 Smooth spinning with easing; top pointer shows result
- �️ Weights per option (probability control)
- 🟦 Per-slice color pickers
- ↕️ Drag handle to reorder options
- 🟰 Equal-size slices (probability-only mode): equal visual segments while selection remains weighted
- 💾 LocalStorage persistence (options + settings)
- 📤 Export/Import JSON
- 🔊 Sound effect on win (toggle)
- 🎊 Confetti on win (toggle)
- 🧭 Reduced-motion support (skips animations when preferred)
- 📱 Mobile-friendly

## 🚀 Getting Started

Requires Node.js 18+.

### Install and run (development)

```bash
npm install
npm run dev
```

The dev server prints a local URL; open it in your browser.

On Windows PowerShell, if you hit script policy issues, you can run with `npm.cmd run dev` instead.

### Production build

```bash
npm run build
npm run preview
```

`preview` serves the built `dist/` locally for a quick sanity check.

## 🌐 Deployment

This project includes a `netlify.toml` with:

- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirect configured

Steps:
1. Push to GitHub
2. Connect the repo on Netlify
3. Deploy (Netlify will use the provided config)

## 📖 How to Use

1. Add an option via the input + Add, or press Enter
2. Edit labels inline
3. Set a weight with the slider/number field (higher = more likely to win)
4. Pick a slice color
5. Reorder by dragging the ≡ handle on the left
6. Spin using the center SPIN button
7. Toggle Settings: Sound, Confetti, Spin duration, and Equal-size slices
8. Export/Import your configuration as JSON

Notes:
- Equal-size slices mode draws equal visual segments, but still selects winners by weight.
- If your system prefers reduced motion, the app skips spinning animation and jumps to the result.

## 🛠️ Technology Stack

- React + Vite
- Canvas 2D API for wheel rendering
- CSS Grid/Flexbox, animations
- LocalStorage for persistence
- Web Audio API for sound

## � Project Structure

```
Spinner1/
├── index.html
├── netlify.toml
├── styles.css
├── src/
│   ├── main.jsx
│   ├── index.css
│   ├── App.jsx
│   └── components/
│       ├── SpinnerApp.jsx
│       └── OptionsPanel.jsx
├── package.json
└── README.md
```

## ♿ Accessibility

- Respects `prefers-reduced-motion`
- High-contrast pointer and centered result announcement

## � Next Ideas

- Export wheel as SVG/PNG; embed code; shareable permalinks
- Theme presets and palettes
- PWA/offline support
- Lightweight analytics with privacy toggle
- Spin history and statistics

## 🤝 Contributing

Contributions are welcome! Please open issues or pull requests with ideas or fixes.

## 📄 License

MIT License

## 🙏 Acknowledgments

- Inspired by [Wheel of Names](https://wheelofnames.com)
- Optimized for deployment on [Netlify](https://netlify.com)

---

Made with ❤️ for decision making and fun!