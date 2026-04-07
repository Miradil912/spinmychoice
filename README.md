# 🌀 Life Spin — Your Daily Oracle

A beautiful, fully-featured spin wheel web app for daily life decisions, health tips, personal growth advice, and inspirational quotes.

**[Live Demo →](https://lifespin.app)** | **[GitHub Pages Deploy](https://yourusername.github.io/life-spin)**

---

## ✨ Features

- 🎡 **Smooth Spin Wheel** — Canvas-powered with realistic physics deceleration
- 📚 **1,000+ Messages** (expandable to 10,000+) across 4 categories
- 🌍 **10 Languages** — EN, ES, FR, DE, HI, JA, AR, PT, ZH, RU
- 🎲 **Dual RNG** — Standard `Math.random()` or Casino-grade `crypto.getRandomValues()`
- 🖼 **Download Result** — PNG card (1080×1080) or PDF
- 📱 **Web Share API** — Share to any app natively
- 🔊 **Voice Output** — Web Speech API reads your result aloud
- 🕐 **Spin History** — Last 50 spins saved to localStorage
- 🌙 **Dark / Light Mode** — Preference remembered
- ♿ **Accessible** — ARIA labels, keyboard navigation, semantic HTML
- 📈 **SEO Ready** — Open Graph, Twitter Cards, JSON-LD structured data
- 💰 **Monetization Ready** — AdSense placeholders, Pro modal with Stripe hooks, donation button
- 📦 **Zero Backend Required** — Pure static files, deploy anywhere

---

## 🚀 Quick Start

### Run Locally

```bash
git clone https://github.com/yourusername/life-spin.git
cd life-spin
python -m http.server 8000
# Open http://localhost:8000
```

Or with Node.js:
```bash
npx serve .
```

### Deploy to GitHub Pages

1. Push to GitHub
2. Go to **Settings → Pages → Source → main / root**
3. Your site is live at `https://yourusername.github.io/life-spin`

Or use the included GitHub Action (push to `main` auto-deploys):

```yaml
# .github/workflows/deploy.yml (create this file)
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

---

## 📁 File Structure

```
life-spin/
├── index.html              # Main app (single-page)
├── css/
│   └── style.css           # Full styles with CSS variables & dark/light
├── js/
│   ├── wheel.js            # Canvas wheel engine + spin physics
│   ├── i18n.js             # Translations for 10 languages
│   ├── download.js         # PNG card builder + PDF export
│   └── monetization.js     # Ad hooks, Pro modal, donation
├── data/
│   └── messages.json       # All messages (expandable)
├── robots.txt
├── sitemap.xml
└── README.md
```

---

## 🎨 Customization

### Add More Messages

Edit `data/messages.json`. Structure:
```json
{
  "decision": ["Message 1", "Message 2", ...],
  "health":   ["Drink water", ...],
  "personal": ["Journal today", ...],
  "inspire":  ["You are enough", ...]
}
```

### Add a Language

In `js/i18n.js`, add a new key to the `TRANSLATIONS` object:
```js
tr: {
  tagline: "Günlük Rehberiniz",
  title: "Hayat Çarkını Çevir",
  // ...all keys
}
```

Then add an `<option value="tr">🇹🇷 TR</option>` to the lang select in `index.html`.

### Enable Google AdSense

Replace the ad placeholder divs in `index.html`:
```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-YOUR_ID"
     data-ad-slot="YOUR_SLOT"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
```

### Enable Stripe Pro

In `js/monetization.js`, replace the `proCheckoutBtn` handler:
```js
window.location.href = 'https://buy.stripe.com/YOUR_LINK';
```

---

## 🎲 RNG Modes

| Mode | Algorithm | Use Case |
|------|-----------|----------|
| Standard | `Math.random()` (Xorshift) | Default, fast |
| Casino-grade | `crypto.getRandomValues()` | Maximum fairness |

Toggle in the UI or set programmatically:
```js
wheel.useCryptoRng = true;
```

---

## 📥 Download Feature

Results are exported as:

- **PNG** — 1080×1080 branded card with gradient background, category badge, message, and timestamp
- **PDF** — Same card in PDF format via jsPDF

Both files are named `life-spin-result-<timestamp>.png/pdf`.

---

## ♿ Accessibility

- All interactive elements have `aria-label` attributes
- Keyboard navigation: Tab to wheel, Enter/Space to spin
- `aria-live="polite"` on result panel for screen readers
- High-contrast colors throughout
- RTL support for Arabic

---

## 📊 Performance Tips

- Messages are loaded once and cached in-memory
- Canvas rendering is requestAnimationFrame-optimized
- Fonts loaded via Google Fonts with `display=swap`
- No heavy frameworks — pure vanilla JS (~15KB total)

---

## 🛠 Optional Python Backend

For large message databases (50K+ entries), use the optional Flask API:

```bash
cd backend
pip install flask
python api.py
```

Then in `index.html`, replace the fetch URL:
```js
const res = await fetch(`http://localhost:5000/api/random-message?lang=${i18n.currentLang}`);
```

---

## 📜 License

MIT — free for personal and commercial use.

---

## 💬 Credits

Built with:
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [jsPDF](https://github.com/parallax/jsPDF)
- [Google Fonts](https://fonts.google.com) (Playfair Display, DM Sans, Cinzel)

---

*Made with ❤️ · [lifespin.app](https://lifespin.app)*
