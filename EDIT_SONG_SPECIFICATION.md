# Edit Song Modal - Complete Specification

## Overview
The edit song modal allows editing song attributes from within a setlist view. Changes to song attributes (artist, album, key, etc.) affect the song globally across ALL setlists, while the "Move to Set" option only affects the specific setlist instance.

## How It Works

### Data Model

#### Song Library (Global)
- All songs are stored in the global `songs` array in localStorage
- When you edit a song's attributes (artist, album, key, tuning, etc.), it updates the master record
- **These changes affect the song everywhere it appears** in all setlists

#### Setlist References
- Setlists store **references** to songs (just artist + song name)
- Each setlist can have multiple sets
- Each set contains an array of song references: `{artist: "...", song: "..."}`
- The same song can appear in multiple sets and multiple setlists

### Edit Flow

```
User clicks edit button on song in Set 2 of "Summer Tour" setlist
    ↓
Modal opens with all song data from the global library
    ↓
User edits fields (e.g., changes key from C to G, adds tuning info)
    ↓
User optionally selects "Move to Set 3" from dropdown
    ↓
User clicks Save
    ↓
1. Update global song library (affects ALL instances everywhere)
2. If artist/song name changed, update references in ALL setlists
3. If "Move to Set" selected, move reference in THIS setlist only
    ↓
Changes saved, modal closes, view refreshes
```

### What Gets Updated Where

| Change Type | Scope | Effect |
|------------|-------|--------|
| **Artist name** | Global | Updates in song library + ALL setlist references everywhere |
| **Song name** | Global | Updates in song library + ALL setlist references everywhere |
| **Album** | Global | Updates song library, visible everywhere |
| **Key** | Global | Updates song library, visible everywhere |
| **Tuning** | Global | Updates song library, visible everywhere |
| **Tags** | Global | Updates song library, visible everywhere |
| **Duration** | Global | Updates song library, visible everywhere |
| **Practice Status** | Global | Updates song library, visible everywhere |
| **First/Last Note** | Global | Updates song library, visible everywhere |
| **Link** | Global | Updates song library, visible everywhere |
| **Bands** | Global | Updates song library, visible everywhere |
| **Move to Set** | Local | Only affects THIS setlist - moves song reference to different set |

## Technical Implementation

### Button Data Attributes
Each edit button stores context about where the song is:

```html
<button class="edit-song-btn" 
        data-artist="Journey" 
        data-song="Don't Stop Believin'"
        data-setlist-index="0"
        data-set-index="1"
        data-song-index="3">
```

This tells us:
- Which song (artist + name)
- Which setlist (index 0)
- Which set within that setlist (index 1)
- Which position in that set (index 3)

### Event Delegation
Instead of inline onclick handlers, we use event delegation:

```javascript
document.addEventListener('click', function(e) {
    const editBtn = e.target.closest('.edit-song-btn');
    if (editBtn) {
        // Get all the data attributes
        const artist = editBtn.getAttribute('data-artist');
        const song = editBtn.getAttribute('data-song');
        const setlistIndex = parseInt(editBtn.getAttribute('data-setlist-index'));
        const setIndex = parseInt(editBtn.getAttribute('data-set-index'));
        const songIndex = parseInt(editBtn.getAttribute('data-song-index'));
        
        // Call edit function with full context
        editSongFromSetlist(artist, song, setlistIndex, setIndex, songIndex);
    }
});
```

### Edit Context Storage
When the modal opens, we store context:

```javascript
editingSongContext = {
    songIndex: 42,                    // Index in global songs array
    originalArtist: "Journey",        // Original artist name
    originalSong: "Don't Stop...",    // Original song name
    setlistIndex: 0,                  // Which setlist
    currentSetIndex: 1,               // Which set in that setlist
    currentSongIndex: 3               // Position in that set
};
```

This allows the save function to know:
1. Which song to update in the global library
2. Which references to update if name changes
3. Which setlist/set to move the song within (if requested)

### Save Logic

```javascript
function saveSongEdit(event) {
    // 1. Update global song library
    songs[editingSongContext.songIndex] = updatedSong;
    saveSongs();  // Save to localStorage
    
    // 2. If artist/song name changed, update ALL references
    if (artistChanged || songChanged) {
        setlists.forEach(setlist => {
            setlist.sets.forEach(set => {
                set.songs.forEach(song => {
                    if (matches old artist/song) {
                        song.artist = newArtist;
                        song.song = newSong;
                    }
                });
            });
        });
    }
    
    // 3. If moving to different set, only affect THIS setlist
    if (targetSetIndex !== currentSetIndex) {
        currentSet.songs.splice(currentSongIndex, 1);  // Remove from current
        targetSet.songs.push({artist, song});          // Add to target
    }
    
    // 4. Save setlists and refresh view
    saveSetlistsToStorage();
    renderSetlistCenter();
}
```

## Example Scenarios

### Scenario 1: Edit Key, Keep in Same Set
**Setup:**
- Song "Sweet Child O' Mine" is in Set 2 of "Summer Tour"
- Same song also appears in Set 1 of "Fall Tour"

**Action:**
- Click edit on song in Summer Tour → Set 2
- Change key from E to D
- Keep in current set
- Save

**Result:**
- Key changes to D in global library
- Both instances (Summer Tour AND Fall Tour) now show key as D
- Song stays in Set 2 of Summer Tour

### Scenario 2: Edit Key + Move to Different Set
**Setup:**
- Song "Sweet Child O' Mine" is in Set 2 of "Summer Tour"
- Same song also appears in Set 1 of "Fall Tour"

**Action:**
- Click edit on song in Summer Tour → Set 2
- Change key from E to D
- Select "Move to Set 3"
- Save

**Result:**
- Key changes to D in global library
- Both instances show key as D
- In Summer Tour: song moves from Set 2 to Set 3
- In Fall Tour: song stays in Set 1 (unchanged)

### Scenario 3: Rename Song
**Setup:**
- Song "Rock and Roll" is in multiple setlists
- Artist is "Led Zeppelin"

**Action:**
- Click edit from any setlist
- Change song name to "Rock & Roll" (add ampersand)
- Save

**Result:**
- Song name updates in global library
- ALL references in ALL setlists update automatically
- Song maintains its position in all sets

## Move to Set Dropdown

The dropdown shows:
- "Keep in current set" (default)
- All OTHER sets in the SAME setlist

Example: Editing a song in "Summer Tour" Set 2
```
Dropdown options:
- Keep in current set
- Set 1
- Set 3
- Set 4
```
(Set 2 is NOT shown since that's the current set)

## Benefits of This Design

1. **Consistent Data**: Song attributes are stored once, used everywhere
2. **Flexible Setlists**: Same song can appear multiple times with different set assignments
3. **Easy Updates**: Change key once, it updates everywhere
4. **Set Management**: Move songs between sets without removing/re-adding
5. **Context Awareness**: Edit button knows exactly where the song is
6. **Safe Renaming**: If you rename a song, all references update automatically

## Debugging

All functions include console logging:

```
[Edit Song] Called with artist: Journey song: Don't Stop Believin'
[Edit Song] Setlist: 0 Set: 1 Song position: 3
[Edit Song] Song index in library: 42
[Edit Song] Found song: {...}
[Edit Song] Working with setlist: Summer Tour
[Edit Song] Opening modal

[Save Edit] Saving changes for song: {...}
[Save Edit] Updated song data: {...}
[Save Edit] Saved to global song library
[Save Edit] Moving song from set 1 to set 2
[Save Edit] Song moved successfully
[Save Edit] Complete
```

Open browser console (F12) to see these logs when testing.

