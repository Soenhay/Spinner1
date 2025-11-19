# Quick Start Guide

## 🚀 Running Locally

Choose one of these methods:

### Method 1: Python
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000

### Method 2: Node.js
```bash
npx serve .
```

### Method 3: Just open the file
Simply double-click `index.html` (some features like local storage work better with a server)

## 📤 Deploy to Netlify

### Option 1: Netlify UI
1. Go to https://app.netlify.com/
2. Drag and drop this folder
3. Done! Your site is live

### Option 2: Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Option 3: GitHub Integration
1. Push this repository to GitHub
2. Connect repository in Netlify dashboard
3. Netlify auto-detects configuration
4. Site deploys automatically on every push

## 🎯 How to Use

1. **Add Options**: Type in the input field and click "Add" or press Enter
2. **Edit Options**: Click on any option text to edit it
3. **Remove Options**: Click the "Remove" button next to an option
4. **Spin**: Click the "SPIN" button in the center of the wheel
5. **Export**: Click "Export" to download your configuration as JSON
6. **Import**: Click "Import" to load a previously saved configuration
7. **Settings**: Customize sound, confetti, and spin duration

## 💾 Data Persistence

Your options and settings are automatically saved in your browser's local storage. They will be there when you return!

## 🔮 Coming Soon

- 🗺️ CesiumJS map integration for location-based features
- ☁️ Cloud sync with backend (Render.com)
- 🎨 Custom color themes
- 📊 Spin history and statistics

## 📝 Notes

- No build process required
- No dependencies to install
- Pure HTML, CSS, and JavaScript
- Works offline (after first load)
- Mobile-friendly and responsive

## 🐛 Troubleshooting

**Issue**: Options not saving
- **Solution**: Make sure you're using a web server (not file:// protocol)

**Issue**: Sound not working
- **Solution**: Some browsers require user interaction first. Click the page, then try again.

**Issue**: Import not working
- **Solution**: Make sure you're importing a valid JSON file created by the export function

## 🎉 Enjoy!

Have fun making decisions with your spinner wheel!
