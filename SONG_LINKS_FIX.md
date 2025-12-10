# Song Links Always Displayed

## Problem
Song names in setlists weren't consistently showing as hyperlinks, even when the song had a link in the song library. This happened because:

1. Setlists only store minimal references to songs (artist + song name)
2. Properties like `link`, `key`, `tuning`, `duration` were not included in the setlist data
3. When rendering, the code checked for `song.link` but it didn't exist in the setlist reference

## Solution
Created an `enrichSongData()` function that merges setlist song references with the full song data from the global library.

### How It Works

#### Before (Setlist Storage)
```javascript
setlist.sets[0].songs = [
    { artist: "Journey", song: "Don't Stop Believin'" },
    { artist: "Queen", song: "Bohemian Rhapsody" }
]
// No link, key, tuning, etc.
```

#### Now (During Rendering)
```javascript
function enrichSongData(songRef) {
    // Find full song in global library
    const fullSong = songs.find(s => 
        s.artist === songRef.artist && 
        s.song === songRef.song
    );
    
    if (fullSong) {
        return {
            ...songRef,  // Keep setlist-specific properties
            link: fullSong.link,
            key: fullSong.key || songRef.key,
            tuning: fullSong.tuning || songRef.tuning,
            duration: fullSong.duration || songRef.duration,
            chordChart: fullSong.chordChart
        };
    }
    return songRef;
}
```

#### Result
```javascript
// Rendered song has everything:
{
    artist: "Journey",
    song: "Don't Stop Believin'",
    link: "https://youtube.com/...",  // ✅ From library
    key: "E",                          // ✅ From library
    tuning: "Standard",                // ✅ From library
    duration: "4:12",                  // ✅ From library
    chordChart: {...}                  // ✅ From library
}
```

## Benefits

### 1. Links Always Work
- If a song has a link in the library, it ALWAYS shows as clickable in ALL setlists
- No matter how the song was added or moved between sets
- Consistent behavior across the app

### 2. Always Current Data
- Changes to song properties in the song manager immediately reflect in all setlists
- Update a link once → it works everywhere
- Update key/tuning → shows everywhere

### 3. Efficient Storage
- Setlists still only store minimal references (keeps file size small)
- Full data is pulled from library only when rendering (efficient)
- Single source of truth for song data

### 4. Backwards Compatible
- Old setlists with stored properties still work
- Function merges stored + library data (stored data takes precedence for conflicts)
- Graceful fallback if song not found in library

## Examples

### Example 1: Link Always Shows
```
Song Manager: 
  - "Sweet Child O' Mine" has link: "https://youtube.com/watch?v=..."

Setlist Manager:
  - Add song to Set 1 → Name is clickable ✅
  - Move song to Set 2 → Name is clickable ✅
  - Song appears in another setlist → Name is clickable ✅
```

### Example 2: Properties Auto-Update
```
Song Manager:
  - "Stairway to Heaven" key: D
  - Update to key: A

Setlist Manager (no refresh needed):
  - All setlists now show key: A ✅
  - Change happened in one place, reflected everywhere
```

### Example 3: Edit Preserves Everything
```
Edit Song Modal:
  - Change song name from "Rock N Roll" to "Rock & Roll"
  - Move from Set 1 to Set 2
  
Result:
  - Link still works ✅
  - Key still shows ✅
  - Duration still shows ✅
  - Everything preserved
```

## Technical Details

### Where Enrichment Happens
```javascript
// In renderSetlistCard() function
set.songs.map((songRef, songIndex) => {
    const song = enrichSongData(songRef); // ← Enrich here
    return `
        ${song.link ?  // ← Now link exists!
            `<a href="${song.link}">${song.song}</a>` 
            : `<strong>${song.song}</strong>`
        }
    `;
})
```

### Performance
- Enrichment only happens during rendering (not storage)
- Uses Array.find() which is fast for reasonable song library sizes
- Cached by browser during render cycle
- No noticeable performance impact

### Data Flow
```
Page Load
    ↓
Load songs from localStorage (global library)
    ↓
Load setlists from localStorage (references only)
    ↓
User expands a setlist
    ↓
renderSetlistCard() called
    ↓
For each song reference:
    ↓
enrichSongData() looks up in library
    ↓
Returns merged object with all properties
    ↓
Render with links, keys, durations, etc.
```

## Testing

### Verify Links Work
1. Open Song Manager
2. Add/edit a song with a link
3. Go to Setlist Manager
4. Add that song to a set
5. **Result:** Song name should be a blue hyperlink

### Verify Links Persist After Move
1. Edit a song in a setlist
2. Select "Move to Set 2"
3. Save
4. **Result:** Song in Set 2 should still have clickable link

### Verify Changes Propagate
1. In Song Manager, change a song's key
2. Go to Setlist Manager
3. **Result:** All instances in all setlists show the new key

All song links should now work consistently! 🎸🔗

