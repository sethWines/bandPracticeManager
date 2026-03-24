# Band Practice Manager — UI shell

Single source of truth for shared chrome. Theme tokens live in [`css/themes.css`](../css/themes.css). Layout, header, and watermarks: [`css/layout.css`](../css/layout.css) + [`css/shell.css`](../css/shell.css).

## Routes (multi-page)

| File | Title (pattern) |
|------|-----------------|
| `song-manager.html` | Song Manager |
| `setlist-manager.html` | Setlist Manager |
| `chord-chart-editor.html` | Chord Chart Editor |
| `show-time.html` | Show Time |
| `storage-wizard.html` | Storage Wizard |

Nav order: **Songs** → **Setlists** → **Charts** → **Show Time** → **Storage** (Storage Wizard page includes Storage link; Song Manager may omit self-link style).

## Header (desktop)

- `.header` — glass bar, full width
- `h1` — 20px title, optional leading SVG (guitar 20×20; drum 40×20 where used)
- `.header-controls` — `.nav-links` + `#themeSelector.theme-selector`
- `.mobile-menu-btn` — hamburger, visible ≤768px

## Mobile menu

- `#mobileMenu.mobile-menu-overlay` — `.active` toggles visibility
- Sections: **Navigate** (all routes + SVG icons), **Theme** (`#mobileThemeSelector`)
- Close: `.mobile-menu-close`

## Theme selector options (must match CSS)

`grey`, `red`, `blue`, `green`, `purple`, `cyan`, `teal`, `copper`, `amber`, `pink`, `sunrise`, `sunset`, `synthwave`, `prism`

- Grey: remove `data-theme` from `document.documentElement` (or `body` per page — be consistent with [`js/app-shell.js`](../js/app-shell.js))
- Others: `document.documentElement.setAttribute('data-theme', theme)`

## Watermarks

- Keys: `guitar` (default), `drum`, `blackdoubt`
- Default stack lives in [`css/shell.css`](../css/shell.css) on `body::before` / `body::after` (skipped when `<body class="bpm-no-shell-watermark">`, e.g. Show Time).
- `body.drum-watermark` / `body.blackdoubt-watermark` + `.blackdoubt-watermark-overlay` element
- Song Manager & Show Time: clickable title icons to switch (where implemented)
- BlackDoubt icon in Song Manager: only if a setlist named `BlackDoubt` exists (case-insensitive)

## Version badge

- `<meta name="app-version" content="vX.Y.Z">` in each HTML file
- [`version.txt`](../version.txt) and scripts `update-version.bat` / `update-version.sh`
- [`js/version.js`](../js/version.js) updates `document.title` and optional badge

## Favicon

- SVG data URI; color from theme + shape from watermark (guitar / drum / blackdoubt)
- Shared implementation: [`js/app-shell.js`](../js/app-shell.js) `updateFaviconForTheme`

## Design rules

- Use CSS variables (`--primary-*`, `--text-*`); avoid raw hex in page-specific CSS except rare cases
- Buttons: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger` (danger stays red, not themed)
- Touch targets ≥ 44×44px on mobile
- Icons: inline SVG, `stroke-width: 2` for UI icons; nav icons 16–18px

## JS entry pattern (`file://`)

- Load [`js/app-shell.js`](../js/app-shell.js) first (defines `window.BandAppShell` and, after `exposeShellOnWindow()`, `changeTheme`, `loadTheme`, etc.).
- Then load the page script: [`js/storage-wizard.js`](../js/storage-wizard.js) or [`js/entries/<page>-chrome.js`](../js/entries/) for Songs / Setlists / Charts.
- No `type="module"` required; no dev server required for the main app pages.
