# 🎯 Spinner Wheel

A modern, interactive spinner wheel web application for making random selections and decisions. Perfect for games, giveaways, classroom activities, and decision-making!

## ✨ Features

- 🎨 **Modern, Responsive Design** - Beautiful gradient UI that works on all devices
- 🎡 **Interactive Spinner Wheel** - Smooth animations and realistic physics
- 💾 **Local Storage** - Your options are automatically saved and persist between sessions
- 📤 **Export/Import** - Download your configurations as JSON files and reload them anytime
- ⚙️ **Customizable Settings** - Control sound effects, confetti, and spin duration
- 🎉 **Celebration Effects** - Confetti animation and sound effects when a winner is selected
- 📱 **Mobile Friendly** - Fully responsive design works great on phones and tablets

## 🚀 Getting Started

This is a static site that requires no build process or dependencies!

### Running Locally

Simply open `index.html` in your web browser:

```bash
# If you have Python installed, you can serve it locally:
python3 -m http.server 8000

# Or with Node.js:
npx serve .
```

Then navigate to `http://localhost:8000` in your browser.

### Deployment

#### Deploy to Netlify

1. Push this repository to GitHub
2. Connect your repository to [Netlify](https://netlify.com)
3. Netlify will automatically detect the configuration from `netlify.toml`
4. Your site will be live in minutes!

Or use the Netlify CLI:

```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 📖 How to Use

1. **Add Options**: Type your options in the input field and click "Add" or press Enter
2. **Edit Options**: Click on any option in the list to edit it
3. **Remove Options**: Click the "Remove" button next to any option
4. **Spin the Wheel**: Click the "SPIN" button in the center of the wheel
5. **Export/Import**: Save your configurations or load previously saved ones
6. **Customize**: Adjust settings like sound effects, confetti, and spin duration

## 🛠️ Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid, Flexbox, and animations
- **Vanilla JavaScript** - No frameworks, pure ES6+ JavaScript
- **Canvas API** - For rendering the spinner wheel
- **Local Storage API** - For persisting user data
- **Web Audio API** - For sound effects

## 🔮 Future Enhancements

- 🗺️ **CesiumJS Integration** - Add location-based features with interactive maps
- ☁️ **Backend Integration** - Sync configurations across devices using Render.com backend
- 🎨 **Custom Colors** - Allow users to choose custom color schemes
- 📊 **History/Statistics** - Track spin history and winner statistics
- 👥 **Multi-wheel Support** - Manage multiple different wheels
- 🔗 **Shareable Links** - Share wheel configurations via URLs

## 📁 Project Structure

```
Spinner1/
├── index.html          # Main HTML file
├── styles.css          # All styles and animations
├── app.js             # Application logic and wheel functionality
├── netlify.toml       # Netlify deployment configuration
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by [Wheel of Names](https://wheelofnames.com)
- Built for deployment on [Netlify](https://netlify.com)
- Future backend support via [Render](https://render.com)

---

Made with ❤️ for decision making and fun!