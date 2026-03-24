# Band Practice Manager — Data model

Canonical reference for `localStorage` and portable JSON. Implementation details for setlist merge: [`js/setlist-portable.js`](../js/setlist-portable.js).

## Primary data

| Key | Type | Description |
|-----|------|-------------|
| `songDatabase` | JSON string: `Song[]` | Primary song library. Writes should mirror to `bandSongs` where the app does dual-write. |
| `bandSongs` | JSON string: `Song[]` | Legacy/backup mirror of songs. Read: prefer `songDatabase` then fallback `bandSongs`. |
| `bandSetlists` | JSON string: `Setlist[]` | Setlists with embedded song snapshots per slot. |

### `Song` (typical fields)

- `id` — string/number (where generated)
- `artist`, `song`, `album`, `link`, `tuning`, `bands`, `key`, `firstNote`, `lastNote`, `duration`
- `chordChart` — optional `{ capo, tuning, components[], preferredScrollSpeed }`
- `updatedAt`, `chordChartUpdatedAt` — ISO strings for portable import merge (see `setlist-portable.js`)

### `Setlist`

- `name`, `band`, optional `id`
- `sets`: `[{ name, songs: Song[] }]`

## Trash / recovery

| Key | Description |
|-----|-------------|
| `songTrash` | JSON string: deleted songs (Song Manager). |
| `bandSongsTrash` | Legacy trash key (some code paths). |

## UI / preferences

| Key | Description |
|-----|-------------|
| `bandOrganizerTheme` | Theme id: `grey`, `red`, `blue`, `green`, `purple`, `cyan`, `amber`, `pink`, `teal`, `copper`, `sunrise`, `sunset`, `synthwave`, `prism`. |
| `watermark` | `guitar` \| `drum` \| `blackdoubt` |
| `hiddenColumns` | JSON: column visibility for Song Manager table (current implementation). |
| `columnVisibility` | String or JSON — used in full JSON backup / Storage Wizard; may overlap conceptually with `hiddenColumns`. |
| `columnWidths` | JSON object of column → width |
| `tableDensity` | Table row density preference |
| `savedFilters` | Saved filter presets |
| `statsPreferences` | Stats dashboard preferences |
| `leftSidebarCollapsed` | Song Manager |
| `rightSidebarCollapsed` | Setlist Manager (and backup) |
| `rightPanelCollapsed` | Chord Chart Editor |
| `setlistManagerSession` | Expanded cards, scroll (Setlist Manager) |
| `editSongSearch` | Cross-page scratch |
| `pendingCSVImport`, `pendingCSVFilename` | Mobile CSV handoff |
| `spotifyClientId`, `spotifyClientSecret` | Optional Spotify integration (Song Manager) |

## Other

| Key | Description |
|-----|-------------|
| `configManager` | Storage Wizard configuration snapshots (`version.js` / wizard). |
| `chordChartAutosave` | Autosave scratch (per `STORAGE_KEYS`) |

## Portable setlist JSON

- Envelope: `format: "bandPracticeManager-setlist"`, `version`, `exportedAt`, `setlists[]`
- Import merge: match songs by `artist` + `song` (trimmed); timestamp rules in `setlist-portable.js`

## Module constants

Use [`STORAGE_KEYS` in `js/storage.js`](../js/storage.js) in new ES module code for consistency.
