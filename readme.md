# ECSPY v2.0 — Full Release Package

**Your Ultimate Shopify & WordPress Intelligence Platform**

---

## 📦 Package Contents

```
ecspy-release/
├── landing/
│   └── index.html          ← Marketing landing page (open directly in browser)
├── app/
│   └── index.html          ← Full SaaS dashboard (open directly in browser)
├── extension/
│   └── popup.html          ← Chrome extension popup UI
└── manifest/
    ├── manifest.json        ← Chrome Extension Manifest V3
    ├── background.js        ← Service worker (credit system, caching, messaging)
    ├── content.js           ← Page injector (platform detection, app detection, launcher)
    └── icons/               ← Add your 16x16, 32x32, 48x48, 128x128 PNG icons here
```

---

## 🚀 Quick Start

### Option 1 — Open Locally (Instant Preview)
Just open any HTML file directly in your browser:
- `landing/index.html` → Marketing site
- `app/index.html` → Full platform dashboard
- `extension/popup.html` → Extension UI preview

### Option 2 — Deploy to Web (Recommended)
Upload to any static host:

**Netlify (Free):**
```bash
# Drag & drop the entire ecspy-release/ folder to netlify.com/drop
# Your site is live in 30 seconds
```

**Vercel (Free):**
```bash
npm i -g vercel
cd ecspy-release
vercel deploy
```

**GitHub Pages (Free):**
```bash
git init && git add . && git commit -m "ECSPY v2 release"
git push to your GitHub repo
# Enable Pages in repo Settings → Pages → Deploy from /root
```

### Option 3 — Install as Chrome Extension
1. Copy all files from `manifest/` folder into a new folder
2. Copy `extension/popup.html` into the same folder (rename to `popup.html`)
3. Add icon images (16, 32, 48, 128px PNG) to `icons/` subfolder
4. Open Chrome → `chrome://extensions/`
5. Enable **Developer Mode** (top right toggle)
6. Click **Load unpacked** → select your extension folder
7. ECSPY icon appears in your Chrome toolbar ✓

---

## 🛠 Platform Features — v2.0

### Dashboard
- Live stats: stores tracked, winning products, ads, keywords
- Revenue trend charts (Chart.js)
- Activity feed with real-time alerts
- Top niches breakdown with progress bars

### Spy Tools
| Tool | Credits | Description |
|------|---------|-------------|
| Shopify Spy | 2/search | Full store database, 47K+ stores |
| WordPress Spy | 2/search | WooCommerce plugin & theme detection |
| Store Deep Spy | 2/store | Full profile: products, apps, traffic breakdown |
| Bulk Analyzer | 5/store | Batch analyze up to 500 stores |

### Products & Ads
| Tool | Credits | Description |
|------|---------|-------------|
| Winning Products | 1/search | Trending products with viral scoring |
| Ad Spy | 1/search | FB, TikTok, Instagram, Google ads |
| Supplier Finder | 3/lookup | AliExpress, CJ, DHgate sourcing |

### Research
| Tool | Credits | Description |
|------|---------|-------------|
| Keywords | Free | Trend tracking, CPC, competition |
| Theme Detector | 1/detect | Shopify & WP theme fingerprinting |
| TDK Analyzer | Free | Title, description, keyword scoring |
| Whois Lookup | Free | Full domain registration data |
| Competitor Compare | 2/report | Side-by-side competitor table |

### Tools
| Tool | Credits | Description |
|------|---------|-------------|
| Margin Calculator | Free | Full P&L calculator with chart |
| Content Manager | Free | Pages, Posts, Products, Categories, Tags, Attributes |
| SEO Editor | Free | Title, description, keywords, Google preview |
| AI Writer | 1/gen | Product descriptions, meta tags, ad copy, blog posts |
| AI Assistant | 1/query | Niche analysis, strategy, product research |

### Credit Plans
| Plan | Price | Credits | Best For |
|------|-------|---------|----------|
| Starter | Free | 100/mo | Beginners |
| Pro | $49/mo | 2,000/mo | Active sellers |
| Business | $149/mo | 10,000/mo | Agencies & power users |

---

## 🔧 Customization

### Change Brand Colors
In any HTML file, update the CSS variables:
```css
:root {
  --or: #f07820;     /* Primary orange */
  --or2: #ff9540;    /* Orange hover */
  --bg: #07080d;     /* Background */
  --t1: #f0f2ff;     /* Primary text */
}
```

### Connect Real API
In `manifest/background.js`, replace the demo data section:
```javascript
// Replace this demo block:
const data = { domain, platform, revenue: ... };

// With your real API call:
const res = await fetch(`https://your-api.com/analyze?url=${encodeURIComponent(url)}`, {
  headers: { 'Authorization': `Bearer ${YOUR_API_KEY}` }
});
const data = await res.json();
```

### Connect Real AI
In `app/index.html`, find the `aiR` object and replace with an API call:
```javascript
const res = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: { 'x-api-key': YOUR_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
  body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1000, messages: [{ role: 'user', content: text }] })
});
```

---

## 📋 Tech Stack
- **Frontend:** Vanilla HTML/CSS/JavaScript (zero dependencies for HTML files)
- **Charts:** Chart.js 4.4.0 (CDN)
- **Fonts:** Syne + Inter (Google Fonts)
- **Extension:** Chrome Manifest V3, Service Workers
- **AI:** Built-in responses (no API key required) — swap for any LLM

---

## 🌐 Recommended Hosting
- **Landing page:** Netlify, Vercel, Cloudflare Pages (all free)
- **App:** Same static host — or convert to Next.js/React for dynamic features
- **Extension:** Chrome Web Store ($5 one-time developer fee)
- **Database:** Supabase (free tier) for user accounts and credit tracking
- **Payments:** Stripe (for credit purchases and plan upgrades)

---

## 📞 Support
- Website: https://ecspy.net
- Email: support@ecspy.net
- Twitter: @ecspy_net

---

**ECSPY v2.0 — © 2026 ECSPY Inc. All rights reserved.**
