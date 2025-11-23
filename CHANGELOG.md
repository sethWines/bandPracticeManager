# Changelog

All notable changes to the Band Manager application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Dynamic Favicon**: Browser tab favicon now changes to match the selected watermark (guitar or drum icon)
  - Drum favicon optimized with larger size and bolder strokes for better visibility
  - Favicon automatically updates when switching watermarks in Song Manager
  - Both pages (Song Manager and Setlist Manager) reflect the favicon preference

### Changed
- **Browser Tab Title**: Changed from "Band Song Manager" to "Song Manager" for clarity

---

## [1.0.0] - 2024-11-23

### Added
- **Interactive Background Watermarks**
  - Toggle between guitar and drum watermarks by clicking title icons
  - Watermark preference persists across sessions via localStorage
  - Synchronized across both Song Manager and Setlist Manager pages
  - 15% opacity for subtle visual effect
  - Smooth fade transitions between watermarks

- **Glassmorphism UI Effect**
  - Semi-transparent control panes with frosted glass effect
  - `backdrop-filter: blur(10px)` for modern aesthetic
  - Subtle borders and shadows for depth

- **Advanced Search & Filtering**
  - Multi-word search with support for quoted phrases (e.g., `"drop d"`)
  - Multiple filters per column with OR logic
  - Exact match filtering (no partial matches)
  - Special `(empty)` filter option to find songs with missing values
  - Filter suggestions always show all available values
  - Real-time search result counters in theme color for Songs, Artists, and Bands

- **Column Visibility Toggle**
  - Show/hide any table column via "Columns" button
  - Column preferences persist in localStorage
  - Hidden columns remain in data, just not displayed

- **Enhanced Table Layout**
  - Actions column moved to first position
  - Compact action icons (pencil for edit, x for delete) with tooltips
  - Link column positioned between Actions and Artist
  - Table header hover effects use theme colors

- **Custom SVG Icons Throughout**
  - All control buttons use styled SVG icons (no emojis)
  - Icons match theme colors with drop-shadow effects
  - Guitar and drum icons in page titles (clickable for watermark toggle)
  - Drum icon displayed before band names in setlist cards

- **Enhanced Theming System**
  - Added **Teal** theme (#14b8a6)
  - Added **Copper** theme (#b87333)
  - Total of 9 color themes available
  - Custom checkbox styling that follows theme colors
  - "Clear All Data" button always stays red regardless of theme

- **Compact UI Layout**
  - Reduced padding and margins in control panes
  - Smaller button sizes and tighter spacing
  - More efficient use of screen space

### Changed
- **Button Styling**: Removed glow effects for cleaner, more modern appearance
- **Page Title**: "Song Organizer" renamed to "Song Manager"
- **File Structure**: `song-organizer.html` renamed to `song-manager.html`

### Technical Details
- localStorage keys: `bandSongs`, `setlists`, `bandOrganizerTheme`, `watermark`, `columnVisibility`
- Watermark CSS uses `body::before` (guitar) and `body::after` (drum) pseudo-elements
- Column visibility managed via `display: none` on table cells
- Filter logic: OR within same column, AND between different columns

---

## Project Information

**Repository**: Band Manager - Song & Setlist Organizer  
**Technologies**: HTML5, CSS3, Vanilla JavaScript (ES6+), localStorage API  
**Requirements**: Modern web browser (Chrome, Firefox, Safari, Edge)  
**No Dependencies**: Works completely offline, no build process required

### Quick Start
```bash
git clone https://github.com/yourusername/bandPracticeManager.git
cd bandPracticeManager
start song-manager.html  # Windows
# open song-manager.html  # macOS
# xdg-open song-manager.html  # Linux
```

---

## Versioning Notes

- **Major version** (X.0.0): Breaking changes or major feature overhauls
- **Minor version** (0.X.0): New features, significant enhancements
- **Patch version** (0.0.X): Bug fixes, minor improvements

[Unreleased]: https://github.com/yourusername/bandPracticeManager/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/yourusername/bandPracticeManager/releases/tag/v1.0.0

