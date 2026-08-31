# Browser Compatibility Checklist

Band Practice Manager is designed to run by **opening HTML files directly** in a modern browser (`file://`). No server, install, or build step is required.

## Supported browsers

| Browser | Minimum | Notes |
|---------|---------|-------|
| Chrome | 90+ | Primary test target |
| Edge | 90+ | Chromium-based |
| Firefox | 88+ | Full support |
| Safari | 14+ | iOS/macOS; verify CSV download paths |

## Required platform features

- JavaScript enabled
- `localStorage` (typically 5–10 MB per origin)
- File API (`input type="file"`, `FileReader`)
- CSS custom properties
- Native drag-and-drop (setlist reordering)

## Direct file launch (`file://`)

**Works without a server:**
- All pages, navigation, themes, CRUD, import/export, print/pocket cards
- Data persists in browser localStorage for that file origin

**Limitations on `file://`:**
- Service worker / PWA offline cache is **not used**
- `version.txt` fetch is skipped; version comes from `<meta name="app-version">`
- Some browsers restrict pop-up print windows — allow pop-ups for pocket cards
- CSV/JSON downloads go to the browser default download folder

## Manual test matrix

Use a **clean browser profile** or export backup first. Sample data: `samples/sample-songs.csv`

### Song Manager
- [ ] Add, edit, delete song
- [ ] Search, filter, sort, column visibility
- [ ] Bulk edit / bulk delete
- [ ] **Bulk Import Songs** — CSV file
- [ ] **Bulk Import Songs** — paste from spreadsheet
- [ ] Import preview: new, update, duplicate-in-file
- [ ] Duplicate policy: keep / update / skip per row
- [ ] Export CSV / JSON
- [ ] Undo after import
- [ ] Theme persists after refresh

### Setlist Manager
- [ ] Create setlist, add songs, drag reorder
- [ ] Full-sheet print
- [ ] **Pocket Cards** — wallet size, artist shown
- [ ] **Pocket Cards** — credit size, artist omitted
- [ ] JSON export/import

### Other pages
- [ ] Chord chart save/reopen
- [ ] Show Time navigation
- [ ] Storage Wizard backup/restore

## Import test fixtures

| File | Purpose |
|------|---------|
| `samples/sample-songs.csv` | Valid baseline (20 songs) |
| `samples/import-fixtures/duplicate-rows.csv` | Same artist+song twice in file |
| `samples/import-fixtures/update-conflicts.csv` | Changed metadata for existing songs |
| `samples/import-fixtures/invalid-rows.csv` | Missing required fields |

## Known constraints

- Data does not sync between devices or browsers
- localStorage quota may limit very large libraries with chord charts
- Spotify integration has been removed; use CSV bulk import instead
