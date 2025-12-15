# Grean Tulsi – Landing Page (Static)

This is a **single-page landing site** designed for **GitHub Pages** (no React, no build tools).

## What’s included
- Buttons:
  - Order on WhatsApp
  - Call now
  - Open in Google Maps
- Menu + prices:
  - Search + category filters
  - Collapsible category sections
  - PDF open/download + optional preview
- Address + hours

## Before you publish (IMPORTANT)
Open `script.js` and update:
- `CONFIG.whatsappNumber`
- `CONFIG.callNumber1/2/3`
- `CONFIG.hoursText` (if needed)

Also update:
- Address text in `index.html` if it changes.

## Deploy to GitHub Pages
1. Create a new GitHub repo (example: `grean-tulsi-landing`)
2. Upload all files from this folder to the repo root.
3. GitHub → **Settings** → **Pages**
4. Source: **Deploy from a branch**
5. Branch: **main** / folder: **root**
6. Save → Your site will be live on a `github.io` URL.

## Custom domain (optional)
You can attach a custom domain later from GitHub Pages settings.  
For a simple menu site, **paid hosting is unnecessary** — only buy a domain if you want a nicer URL.

## Updating menu later
- Replace `assets/menu.pdf` with the new PDF
- Update `assets/menu-data.js` / `assets/menu.json` accordingly (or tell me and I’ll regenerate it)
