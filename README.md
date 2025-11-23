
# Band Manager - Song & Setlist Organizer

A powerful, browser-based application for musicians to organize their song library and create performance setlists. Built with vanilla JavaScript and designed to work completely offline using browser localStorage.

## Quick Start

Get started in seconds:

```bash
# Clone the repository
git clone https://github.com/yourusername/bandPracticeManager.git

# Navigate to the project directory
cd bandPracticeManager

# Open the Song Manager in your browser
start song-manager.html
# On macOS: open song-manager.html
# On Linux: xdg-open song-manager.html
```

That's it! No installation, no dependencies, no build process. Just open the HTML file and start organizing your music. 🎸

## Table of Contents

- [Quick Start](#quick-start)
- [Use Case](#use-case)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
- [Use Case Examples](#use-case-examples)
- [Technical Details](#technical-details)
- [Project Structure](#project-structure)
- [Available Themes](#available-themes)
- [Tips & Best Practices](#tips--best-practices)
- [Data Management](#data-management)
- [Known Limitations](#known-limitations)
- [Contributing](#contributing)
- [License](#license)

---

## Use Case

**Band Manager** is designed for:
- **Musicians and Bands** who need to manage large song catalogs
- **Cover Bands** tracking songs from multiple artists and albums
- **Solo Performers** organizing repertoire for different venues
- **Music Teachers** managing teaching materials and student playlists
- **Anyone** who wants to organize songs and create structured setlists for performances

[↑ Back to Top](#band-manager---song--setlist-organizer)

---

## Key Features

### Song Database Management
- Store unlimited songs with detailed metadata:
  - Artist, Song Title, Album
  - Guitar Tuning (Standard, Drop D, etc.)
  - Musical Key and First/Last Notes
  - Song Duration
  - Band/Tag assignments
  - Reference links (YouTube, tabs, etc.)
- **Advanced Search**: Multi-word search across all fields
- **Column Filtering**: Add filters for specific criteria
- **Column Visibility**: Show/hide columns as needed
- **Sortable Columns**: Click headers to sort data
- **Bulk Operations**: Edit or delete multiple songs at once
- **CSV Import/Export**: Easy data backup and migration

### Setlist Manager
- Create professional setlists for performances
- Organize songs into multiple sets (1st Set, 2nd Set, etc.)
- **Drag-and-Drop Reordering**: Easily arrange song order
- **Print-Ready Output**: Generate formatted setlists for printing
- **Multiple Setlists**: Manage different shows or venues
- **CSV Export**: Share setlists with band members

### Customization & Themes
- **9 Color Themes**: Choose your style
  - Grey (Default), Red/Orange, Blue, Green, Purple, Cyan, Amber, Pink, Teal
- **Dark Mode Interface**: Easy on the eyes during late-night practice
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Synchronized Theming**: Theme selection syncs between Song Manager and Setlist Manager

### Data Persistence & Privacy
- **No Server Required**: All data stored in your browser
- **Privacy First**: Your song data never leaves your device
- **Automatic Saving**: Changes saved instantly
- **Easy Backup**: Export to CSV for safekeeping

[↑ Back to Top](#band-manager---song--setlist-organizer)

---

## Getting Started

### Installation

1. **Clone or Download** this repository
2. **Open** `song-manager.html` in any modern web browser
3. **Start Adding Songs** - No installation or setup required!

### Basic Usage

#### Managing Your Song Library

1. **Add Songs**
   - Click "Add Song" button
   - Fill in song details (Artist, Title, Album, etc.)
   - Add optional metadata (tuning, key, links)
   - Click "Save"

2. **Search & Filter**
   - Use the search bar for quick lookups (supports multi-word search)
   - Add column filters for precise results
   - Sort by any column with a single click
   - Show/hide columns using the "Columns" button

3. **Bulk Operations**
   - Select multiple songs with checkboxes
   - Use "Bulk Edit" to update common fields
   - "Bulk Delete" to remove multiple songs

4. **Import/Export**
   - Export your entire library to CSV
   - Import songs from CSV files
   - Perfect for backups or sharing

#### Creating Setlists

1. **Open Setlist Manager**
   - Click "Setlist Manager" link from Song Manager
   - Or open `setlist-manager.html` directly

2. **Create New Setlist**
   - Click "Create Setlist"
   - Enter setlist name and band name
   - Choose number of sets (1, 2, 3, etc.)

3. **Add Songs to Sets**
   - Click "Add Songs" for any set
   - Search and select songs from your library
   - Songs are copied to the setlist

4. **Arrange Songs**
   - Drag and drop songs to reorder
   - Move songs between sets if needed

5. **Print or Export**
   - Click "Print" to create formatted output
   - Use "Export" to save as CSV
   - Share with band members!

[↑ Back to Top](#band-manager---song--setlist-organizer)

---

## Use Case Examples

### Example 1: Cover Band Manager
**Scenario**: You play in multiple cover bands and need to track which songs work for each group.

**Solution**:
- Tag songs with band names in the "Bands" field
- Filter by band to see each group's repertoire
- Create separate setlists for each band's performances
- Track different tunings and keys for each guitarist

### Example 2: Acoustic Set Planner
**Scenario**: You perform solo acoustic shows and need to plan balanced setlists.

**Solution**:
- Organize songs by key and tempo
- Use filters to find songs in complementary keys
- Create setlists with good variety (fast/slow, major/minor)
- Print setlists for venue coordinators

### Example 3: Music Teacher's Songbook
**Scenario**: You teach guitar and need to organize songs by difficulty and style.

**Solution**:
- Track songs by tuning for beginner students
- Add reference links to tabs and videos
- Create setlists for recitals and practice sessions
- Export song lists for students

### Example 4: Band Practice Coordinator
**Scenario**: Your band learns new songs constantly and needs to track progress.

**Solution**:
- Import entire catalog from spreadsheet
- Tag songs as "Learned", "In Progress", "Next Up"
- Create practice setlists for rehearsals
- Share exported CSVs with band members

[↑ Back to Top](#band-manager---song--setlist-organizer)

---

## Technical Details

### Technology Stack
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Variables for theming
- **Vanilla JavaScript (ES6+)** - No frameworks required
- **localStorage API** - Client-side data persistence
- **Print API** - Professional setlist printing
- **Custom SVG Icons** - Styled guitar and drum icons

### Browser Requirements
- Any modern browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- localStorage support (enabled by default)

### Data Storage
- **Songs**: Stored in localStorage key `"bandSongs"`
- **Setlists**: Stored in localStorage key `"setlists"`
- **Theme**: Stored in localStorage key `"bandOrganizerTheme"`
- **Column Visibility**: Stored in localStorage key `"columnVisibility"`
- **No Backend**: Everything runs client-side

### Privacy & Security
- All data stored locally in your browser
- No data sent to external servers
- No tracking or analytics
- No account or login required
- Export your data anytime

[↑ Back to Top](#band-manager---song--setlist-organizer)

---

## Project Structure

```
bandPracticeManager/
├── song-manager.html        # Main song database interface
├── setlist-manager.html     # Setlist creation and management
├── sample-songs.csv         # Example data for testing
├── prompt.txt               # Complete recreation guide
├── .gitignore               # Protects personal data
└── README.md                # This file
```

[↑ Back to Top](#band-manager---song--setlist-organizer)

---

## Available Themes

Choose from 9 beautiful color schemes:
- **Grey** - Professional default
- **Red/Orange** - Bold and energetic
- **Blue** - Cool and calm
- **Green** - Natural and balanced
- **Purple** - Creative and unique
- **Cyan** - Modern and tech
- **Amber** - Warm and inviting
- **Pink** - Vibrant and fun
- **Teal** - Fresh and aquatic

Themes sync between Song Manager and Setlist Manager automatically!

[↑ Back to Top](#band-manager---song--setlist-organizer)

---

## Tips & Best Practices

### Organization Tips
1. **Use Consistent Naming**: Keep artist/album names consistent
2. **Tag Everything**: Use the "Bands" field for flexible grouping
3. **Add Links**: Include YouTube or tab links for quick reference
4. **Track Tunings**: Essential for multi-guitar setups
5. **Export Regularly**: Create CSV backups of your library

### Setlist Creation Tips
1. **Balance Energy**: Mix fast and slow songs
2. **Key Transitions**: Use the Key field to plan smooth transitions
3. **Know Your Tunings**: Group songs by tuning to minimize guitar changes
4. **Test Print**: Preview before the gig
5. **Multiple Versions**: Create different setlists for different venues

### Performance Tips
1. **Print Setlists**: Have physical backups
2. **Export CSVs**: Share with band members before shows
3. **Note First/Last**: Use First/Last Note fields for smooth transitions
4. **Update After Shows**: Mark songs that worked well

[↑ Back to Top](#band-manager---song--setlist-organizer)

---

## Data Management

### Backup Your Data
```bash
1. Open Song Manager
2. Click "Export to CSV"
3. Save file in a safe location
4. Repeat periodically for backups
```

### Restore From Backup
```bash
1. Open Song Manager
2. Click "Import CSV"
3. Select your backup file
4. Review preview and confirm
```

### Clear All Data
If you need to start fresh:
1. Open browser developer tools (F12)
2. Go to Application > Local Storage
3. Delete `bandSongs` and `setlists` keys
4. Refresh the page

**OR** use the "Clear All Data" button in Song Manager (requires confirmation)

[↑ Back to Top](#band-manager---song--setlist-organizer)

---

## Known Limitations

- Data is browser-specific (doesn't sync between devices)
- localStorage size limit (~5-10MB depending on browser)
- No cloud sync or multi-user features
- No collaborative editing
- Requires manual backups via CSV export

[↑ Back to Top](#band-manager---song--setlist-organizer)

---

## Contributing

This is an open-source project! Feel free to:
- Report bugs or issues
- Suggest new features
- Submit pull requests
- Fork for your own use
- Share with other musicians

[↑ Back to Top](#band-manager---song--setlist-organizer)

---

## License

This project is open source and free to use. No attribution required, though always appreciated!

[↑ Back to Top](#band-manager---song--setlist-organizer)

---

## Happy Organizing!

Whether you're managing a massive cover band repertoire or organizing your solo acoustic sets, Band Manager helps you stay organized and ready to perform. Rock on!

---

**Questions or Issues?** Open an issue on GitHub or reach out to the community!

**Found this useful?** Give it a star and share with your fellow musicians!

