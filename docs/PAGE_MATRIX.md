# Band Practice Manager — Page matrix

Acceptance-focused checklist per route. Full behavior spec: [`prompt.txt`](../prompt.txt), APIs: [`QUICK_REFERENCE.md`](../QUICK_REFERENCE.md).

## Song Manager (`song-manager.html`)

**Jobs:** CRUD songs, search/filter/sort, bulk edit/delete, CSV import/export, column visibility, optional chord chart link, stats, watermark toggles.

**Scripts:** [`js/app-shell.js`](../js/app-shell.js) then [`js/entries/song-manager-chrome.js`](../js/entries/song-manager-chrome.js) (theme + watermark sync; works on `file://`).

**Depends:** `songDatabase`/`bandSongs`, `hiddenColumns`, filters, trash keys; optional [`js/song-manager.js`](../js/song-manager.js) + [`js/table-renderer.js`](../js/table-renderer.js) when modularized.

**Checks:**

- [ ] Multi-word + quoted phrase search
- [ ] Column filters: OR within column, AND across columns; exact match; `(empty)`
- [ ] Sort toggles; column hide/show persists
- [ ] Bulk edit/delete; select-all respects filtered set only
- [ ] Dual-write songs to `songDatabase` + `bandSongs`
- [ ] Theme + watermark + favicon sync
- [ ] BlackDoubt icon when setlist named BlackDoubt exists

## Setlist Manager (`setlist-manager.html`)

**Jobs:** CRUD setlists, add songs from library, DnD reorder, print, CSV export, portable JSON export/import.

**Scripts:** `app-shell.js` then [`js/entries/setlist-chrome.js`](../js/entries/setlist-chrome.js)

**Depends:** `bandSetlists`, songs read from `songDatabase`/`bandSongs`; [`js/setlist-portable.js`](../js/setlist-portable.js); `setlistManagerSession`, `rightSidebarCollapsed`.

**Checks:**

- [ ] Create/edit/delete setlist; correct name vs band fields
- [ ] Song picker search matches Song Manager semantics
- [ ] DnD reorder stable (indices, no stuck drag state)
- [ ] Print: page breaks per set; theme-aware
- [ ] Portable JSON import merge timestamps (`updatedAt`, `chordChartUpdatedAt`)

## Chord Chart Editor (`chord-chart-editor.html`)

**Jobs:** Pick song, edit `chordChart` components, DnD components, capo/tuning/scroll speed, save to song in library.

**Scripts:** `app-shell.js` then [`js/entries/chord-chart-chrome.js`](../js/entries/chord-chart-chrome.js)

**Depends:** `songDatabase`; `rightPanelCollapsed`; sets `chordChartUpdatedAt` on save.

**Checks:**

- [ ] All component types (lyrics, chords, tab, section, blank, spacer)
- [ ] Save updates library song; Show Time sees changes
- [ ] Mobile menu + theme

## Show Time (`show-time.html`)

**Jobs:** Pick setlist, performance view, prev/next, chord display, auto-scroll, watermark.

**Depends:** `bandSetlists`, `songDatabase`; watermark localStorage.

**Checks:**

- [ ] Fullscreen/readable performance layout
- [ ] Auto-scroll start/stop + speed
- [ ] Navigate songs; progress indicator
- [ ] Watermark toggle where specified

## Storage Wizard (`storage-wizard.html`)

**Jobs:** CSV export songs/setlists, full JSON backup/restore, clear data, config manager, mobile-friendly downloads.

**Scripts:** [`js/app-shell.js`](../js/app-shell.js) then [`js/storage-wizard.js`](../js/storage-wizard.js) (classic scripts, `file://` OK).

**Depends:** [`css/mobile-wizard.css`](../css/mobile-wizard.css).

**Checks:**

- [ ] JSON includes songs, setlists, theme, watermark, columnVisibility, rightSidebarCollapsed
- [ ] Import restores without data loss; validation errors surfaced
- [ ] Clear all with confirmation

## Cross-page

- [ ] Same nav + mobile menu on all pages
- [ ] Theme choice persists (`bandOrganizerTheme`)
- [ ] Watermark persists (`watermark`)
- [ ] Version in title via `version.js`
