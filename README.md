# Arvostra — V1 Website (Vite + React + TypeScript)

Minimalist Digital Studio & Technology Solutions Marketplace (`https://arvostra.com`), founded by Rahul Adepu.

## Simple, Zero-Friction Static Stack

- **Stack:** Vite 6 + React 19 + TypeScript + Pure CSS (`--arv-*` tokens) + GSAP ScrollTrigger
- **Relative Asset Paths (`base: "./"`):** Works identically with zero path configuration on:
  - GitHub Pages project URLs (e.g., `https://rahuladepu.github.io/Arvostra/`)
  - GitHub Pages custom domains (`https://arvostra.com/`)
  - Netlify (`*.netlify.app` or `https://arvostra.com/`)
- **Default Light Mode + Natural Dark Mode:** Loads in warm cream light mode by default, with a persistent sun/moon toggle to Midnight Pine dark mode.
- **Multi-Page Static Output (`dist/`):**
  - `dist/index.html` — Main studio showcase, live demos, services, process, founder, FAQ, and Project Inquiry
  - `dist/feedback.html` — Dedicated Bug Report & Suggestions page
  - `dist/404.html` — Self-contained interactive Arvostra Comic 404 page (works at any nested URL depth)
  - `dist/__forms.html` — Netlify Forms auto-detection blueprint (`arvostra-inquiry` & `arvostra-feedback`)

## Local Commands

```bash
npm install
npm run dev       # Local dev server
npm run typecheck # Strict TypeScript check
npm run build     # Outputs pure static files to ./dist
npm run preview   # Preview ./dist locally
```

## Deploy to GitHub Pages

1. Push to `main` — `.github/workflows/deploy-github-pages.yml` automatically builds `dist/` and deploys it.
2. In GitHub → **Settings → Pages**, set **Source** to **GitHub Actions**.
3. For automated email delivery on GitHub Pages, get a free key at [web3forms.com](https://web3forms.com) for `rahuladepu99@gmail.com` and add it as Repository Secret `VITE_WEB3FORMS_KEY` (without it, forms honestly provide a pre-filled `mailto:` + Copy Brief fallback).
4. When connecting custom domain `arvostra.com`, add Repository Variable `CUSTOM_DOMAIN=arvostra.com`.

## Deploy to Netlify

1. Import the Git repository (or drag-and-drop `dist/`). `netlify.toml` sets `command = "npm run build"`, `publish = "dist"`, and `VITE_ENABLE_NETLIFY_FORMS = "true"`.
2. In Netlify → **Forms → Form notifications**, set email alerts to `rahuladepu99@gmail.com` for both `arvostra-inquiry` and `arvostra-feedback`.
