# Arvostra — V1 Static Website (Netlify & GitHub Pages Ready)

Minimalist Digital Studio & Technology Solutions Marketplace (`https://arvostra.com`), founded by Rahul Adepu.

## Architecture

- **Framework:** Next.js 15 (`output: "export"`, `trailingSlash: true`) + React 19 + TypeScript
- **Styling & Motion:** Tailwind CSS + custom `--arv-*` tokens + GSAP ScrollTrigger (with `prefers-reduced-motion` support)
- **Static Output:** Builds pure HTML/CSS/JS to `out/` with `out/.nojekyll`, `out/404.html`, `out/sitemap.xml`, `out/robots.txt`, and `out/__forms.html`
- **Form Delivery (Serverless-Free):**
  1. **Web3Forms** (`NEXT_PUBLIC_WEB3FORMS_KEY`) — works identically on GitHub Pages, Netlify, and custom domains (\$0 free tier)
  2. **Formspree / Webhook** (`NEXT_PUBLIC_FORMSPREE_ENDPOINT` / `NEXT_PUBLIC_INQUIRY_WEBHOOK_URL`) — optional static endpoints
  3. **Netlify Forms Auto-Detect** (`public/__forms.html` + `netlify.toml`) — works automatically out of the box when deployed on Netlify
  4. **Honest Fallback** — If no relay is configured, displays a pre-filled `mailto:rahuladepu99@gmail.com` link and one-click `Copy Project Brief` button instead of falsely claiming delivery

## Local Development & Static Preview

```bash
npm install
npm run dev      # Development server at http://localhost:3000
npm run build    # Static export to ./out
npm run typecheck
```

## Deploy to Netlify

1. Connect the Git repository in Netlify (or drag-and-drop `out/`).
2. `netlify.toml` automatically configures:
   - Build command: `npm run build`
   - Publish directory: `out`
   - `NEXT_PUBLIC_ENABLE_NETLIFY_FORMS=true` (activates Netlify Forms via `public/__forms.html`)
   - Security headers & immutable asset caching
3. In Netlify Dashboard → **Forms** → **Form notifications**, add an email notification to `rahuladepu99@gmail.com` (or set `NEXT_PUBLIC_WEB3FORMS_KEY`).
4. Add custom domain `arvostra.com` in Netlify → **Domain management**.

## Deploy to GitHub Pages

1. Push to GitHub `main` branch — `.github/workflows/deploy-github-pages.yml` builds `out/` automatically.
2. In GitHub repo → **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Configure form delivery:
   - Get a free access key at [web3forms.com](https://web3forms.com) for `rahuladepu99@gmail.com`.
   - Add it as a GitHub Repository Secret: `NEXT_PUBLIC_WEB3FORMS_KEY`.
4. Domain / Subpath options:
   - **Custom domain (`arvostra.com`):** Add Repo Variable `CUSTOM_DOMAIN=arvostra.com`, leave `NEXT_PUBLIC_BASE_PATH` empty, and configure DNS (`A` records to GitHub Pages IPs `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` + `www` `CNAME` to `rahuladepu.github.io`).
   - **Project subpath (`https://rahuladepu.github.io/<repo>/`):** Set Repo Variable `NEXT_PUBLIC_BASE_PATH=/<repo>` and `NEXT_PUBLIC_SITE_URL=https://rahuladepu.github.io/<repo>`.
# Arvostra
