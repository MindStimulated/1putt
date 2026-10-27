# 1Putt Site — Project Notes

Static marketing site for the 1Putt golf alignment tool. Plain HTML/CSS/JS,
no build step, no framework — deploys straight to GitHub Pages.

## Status

Treated by the user as a work-in-progress / inspiration reference, not an
active client deliverable (contrast with the Kathleen & Company project in
the sibling folder, which is live client work). Checkout, email capture,
analytics, and legal pages are intentionally stubbed — see `README.md` in
this repo for the full punch list of what's left before it could take real
orders.

## Infrastructure

- **Live working copy**: `/Volumes/MOVESPEED/Projects/1putt-site-v2` — a real
  git clone of `github.com/MindStimulated/1putt-site-v2`, `main` branch.
  Created 2026-10-19 from the user's `1putt-site-updated` download (adds
  contact/shipping/privacy pages and homepage/style/script updates). MOVESPEED
  is ExFAT, so this repo has `core.fileMode false` set locally and `._*`
  AppleDouble sidecar files excluded via `.git/info/exclude`; both are
  local-only, not committed.
- **Hosting** — live in two places, both auto-deploying from `main`; the
  user chose (2026-10-27) to keep both up:
  - **Netlify**: `https://superlative-donut-758429.netlify.app` (project
    `superlative-donut-758429`, site ID
    `b69a056c-96b0-4c17-9e19-8b399c6f4dab`). Linked to the repo through the
    Netlify GitHub app, whose repo access is "only select repositories" — a
    new repo has to be added at github.com/settings/installations before
    Netlify can see it. Build settings come from `netlify.toml` (publish
    repo root, no build command). Netlify turned on site protection (team
    login) by default; the user switched it to public. If the site suddenly
    returns 401 / "Login Redirect", check Visitor access first. Netlify
    rewrites `.html` links to short URLs (`/shipping`) and adds its own
    comment + script tag when serving; both are expected.
  - **GitHub Pages**: `main` branch, `/ (root)`, at
    `https://mindstimulated.github.io/1putt-site-v2/`.
  - No custom domain on either yet. `og:url`/`og:image` in `index.html`
    still point at the original `/1putt-site/` URL.
- **Relationship to `1putt-site`**: the original version is a separate repo
  (`github.com/MindStimulated/1putt-site`, working copy at
  `/Volumes/MOVESPEED/Projects/1putt-site`) and stays live at its own URL. The
  user chose to publish this as a separate site rather than replace it, so
  don't sync changes between the two unless asked.
- `DEPLOY.md` has the pre-launch checklist (checkout, email signup, og:url/
  og:image, placeholder photos, etc.).

## Design system (for future edits)

- Concept: "precision instrument catalog" — machined aluminum tool,
  spec-sheet data, alternating graphite/paper sections, sparing red accent
  pulled from the product's own racing-stripe marking.
- Tokens live at the top of `css/styles.css`: a consolidated ink/steel
  color scale (`--ink`, `--ink-2`, `--ink-3`, `--cream`, `--steel`,
  `--steel-2`) plus a `--shadow-sm/md/lg` elevation system — reuse these
  rather than introducing new one-off hex values or shadows.
- Three font families only: `--font-display` (Archivo Expanded, headlines
  + large numerals), `--font-body` (IBM Plex Sans, running text),
  `--font-mono` (IBM Plex Mono, reserved for small structural/spec-sheet
  labels — kickers, step indices — not headline numerals).
- Header, footer, and nav colors are explicitly signed off by the user as
  final — don't restyle them without being asked.
