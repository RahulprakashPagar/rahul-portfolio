# Rahul Pagar · Data Analyst Portfolio

A 3D, motion-rich, dark-themed personal portfolio built with **vanilla HTML/CSS/JS + Three.js**. No frameworks, no build step. Drop it on Vercel/Netlify and it just runs.

## ✨ What's inside

- **3D Hero** — Three.js wireframe icosahedron data sphere with orbiting nodes & rings (mouse-reactive parallax)
- **Particle background** — 1,200 GPU-rendered particles + connecting data lines, additive blending
- **Custom cursor** — dot + ring with magnetic hover state
- **Boot loader** — terminal-style splash on first load
- **3D tilt cards** — gyroscope-style hover on every project & stack card
- **Animated stat counters** — eased number rolls on scroll
- **Scroll reveal** — staggered fade-up via IntersectionObserver
- **Live Dublin clock** in the footer
- **Project category filters** — pure JS, no framework
- **Contact form** — falls back to native mailto on submit
- **Marquee tech ticker** under the hero
- **Animated SVG charts** for each project visual
- **Fully responsive** — collapses cleanly to mobile

## 🎨 Design system

- **Aesthetic:** "Living Data Observatory" — deep navy cosmos × electric cyan/teal × violet × amber data accents
- **Typography:** Sora (display) + JetBrains Mono (code/labels) + Fraunces (italic flourishes)
- **Color tokens:** `--accent-1` cyan `#38e3c5`, `--accent-2` violet `#7c5cff`, `--accent-3` amber `#ffb547`
- All colors live as CSS variables in `:root` — easy to retheme

## 📁 Structure

```
portfolio/
├── index.html          # Single-page structure
├── styles.css          # All styling + responsive breakpoints
├── app.js              # Three.js + interactions
├── vercel.json         # Caching + security headers
└── assets/
    ├── profile.jpeg    # Your headshot
    └── CV_Rahul_Pagar.pdf
```

## 🚀 Deploy to Vercel (recommended)

**Option A — drag & drop (fastest):**

1. Go to https://vercel.com/new
2. Drag the entire `portfolio` folder onto the page
3. Click **Deploy**. Done. You'll get a `https://your-project.vercel.app` URL in ~30 seconds.

**Option B — GitHub + Vercel (best for ongoing edits):**

```bash
cd portfolio
git init
git add .
git commit -m "initial: data analyst portfolio"
git branch -M main
git remote add origin https://github.com/RahulprakashPagar/portfolio.git
git push -u origin main
```

Then on Vercel:
1. https://vercel.com/new → **Import** your GitHub repo
2. Framework preset: **Other** (it's plain HTML)
3. Build command: leave blank · Output dir: `./`
4. Click **Deploy**

Every `git push` to main now auto-deploys.

**Option C — Netlify:**

```bash
npx netlify-cli deploy --prod --dir=.
```

Or drag-drop the folder at https://app.netlify.com/drop.

## 🌐 Add a custom domain

After deploy, in Vercel → Project → **Settings → Domains** → add your domain (e.g. `rahulpagar.com`). Vercel handles SSL automatically.

## 🛠️ Quick edits

- **Update content** → edit `index.html`. Sections are clearly labeled with `<!-- ===== SECTION ===== -->` comments.
- **Swap colors** → edit the `:root` block at the top of `styles.css`.
- **Replace photo** → drop a new file at `assets/profile.jpeg` (square or 4:5 portrait works best).
- **Update CV** → replace `assets/CV_Rahul_Pagar.pdf`.
- **Tweak 3D scene** → look for the `HERO 3D DATA SPHERE` block in `app.js`.

## 📋 Browser support

- Chromium (Chrome, Edge, Brave, Arc) — full experience
- Firefox — full experience
- Safari — full experience (custom cursor auto-disables on touch)
- Mobile — 3D hero hides; particle bg + tilt simplify automatically

## 🧪 Test locally

No build step needed. Just:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve

# Or just double-click index.html (Three.js CDN works file://)
```

Open `http://localhost:8000`.

## 📝 Notes

- Three.js is loaded from Cloudflare CDN (r128) — no npm install needed.
- Fonts come from Google Fonts with `preconnect`.
- The contact form opens the user's mail client (no backend). Want a real backend? Drop in [Formspree](https://formspree.io/) or [Web3Forms](https://web3forms.com/) — change the `<form>` action attribute and remove the JS preventDefault.
- For analytics, Vercel Analytics is one click in the dashboard.

## 🎯 Performance

- ~80 KB total HTML/CSS/JS gzipped (excl. Three.js CDN)
- Particle bg uses `requestAnimationFrame` only when tab is visible
- All animations are CSS-driven where possible (GPU-accelerated)
- Images: profile photo is the only raster asset; everything else is SVG

Built with care. Push hard, ship pretty.
