# Edit Song Modal Update

## Overview
Updated the Setlist Manager to allow editing songs directly in a modal instead of navigating to the Song Manager page.

## Changes Made

### 1. New Edit Song Modal
Added a comprehensive edit modal (`#editSongModal`) that includes:
- All song fields (artist, song name, album, link, tuning, bands, tags, duration, practice status, key, first note, last note)
- **Move to Set** dropdown - allows moving the song to a different set within the setlist
- Save Changes and Cancel buttons
- Responsive design with scrollable content

### 2. Updated JavaScript Functions

#### `editSongFromSetlist(artist, songName)`
**Old behavior:** Opened song-manager.html in a new tab with search parameters

**New behavior:**
- Opens a modal editor within the setlist manager
- Finds the song in the global songs array
- Populates all form fields with current song data
- Tracks the song's current position in the setlist
- Populates a dropdown with other sets the song can be moved to
- Stores editing context for later use

#### New: `closeEditSongModal()`
- Closes the edit modal
- Clears editing context

#### New: `saveSongEdit(event)`
- Updates the song in the global songs array
- Updates all instances of the song across all sets if artist/name changed
- Moves the song to a different set if requested
- Saves changes to localStorage
- Refreshes the setlist display
- Shows success messages

### 3. Enhanced Modal Functionality
- Added click-outside-to-close functionality for all modals
- Added ESC key support to close any active modal
- Modal content is scrollable for mobile/small screens

### 4. Tracking Context
New global variable `editingSongContext` tracks:
- `songIndex` - Index in the global songs array
- `originalArtist` - Original artist name (for updating references)
- `originalSong` - Original song name (for updating references)
- `currentSetIndex` - Which set the song is currently in
- `currentSongIndex` - Position within that set

## Features

### Inline Editing
- Edit songs without leaving the setlist manager
- All song fields are editable
- Changes immediately reflected in both the song library and setlist

### Move Between Sets
- Optional "Move to Set" dropdown appears in the edit form
- Only shows sets OTHER than the current set
- Moving a song removes it from the current set and adds it to the target set
- Confirmation message shows which sets were involved

### Synchronization
- Changes to artist/song name are propagated to ALL instances across ALL sets
- Preserves metadata (play count, last played, created date, chord chart)
- Saves to both songs library and setlists

## User Experience

### Before
1. Click edit button on a song
2. New tab opens with song manager
3. Search for the song
4. Edit the song
5. Save changes
6. Switch back to setlist tab
7. Refresh to see changes

### After
1. Click edit button on a song
2. Modal opens with all song data pre-filled
3. Edit fields as needed
4. Optionally select a different set to move to
5. Click "Save Changes"
6. Changes immediately visible in the setlist

## Technical Details

### Modal Structure
```html
<div id="editSongModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Edit Song</h2>
            <span class="close" onclick="closeEditSongModal()">&times;</span>
        </div>
        <form id="editSongForm" onsubmit="saveSongEdit(event)">
            <!-- All song fields -->
            <!-- Move to Set dropdown -->
            <!-- Save/Cancel buttons -->
        </form>
    </div>
</div>
```

### Data Flow
1. **Click Edit** → `editSongFromSetlist(artist, songName)` called
2. **Find Song** → Locate in global `songs` array and current setlist
3. **Populate Form** → Fill all fields with current values
4. **Show Modal** → Display the edit form
5. **User Edits** → Modify fields and/or select new set
6. **Submit Form** → `saveSongEdit(event)` called
7. **Update Data** → Modify `songs` array and setlist structure
8. **Save** → Write to localStorage
9. **Refresh UI** → Re-render setlist display
10. **Close Modal** → Hide the form

### Keyboard Shortcuts
- **ESC** - Close any active modal

### Click Behavior
- Clicking outside the modal content area closes the modal
- Clicking the X button closes the modal
- Clicking Cancel button closes the modal

## Benefits

1. **Faster Workflow** - No page navigation required
2. **Better Context** - Stay on the setlist while editing
3. **Set Management** - Move songs between sets without removing/re-adding
4. **Immediate Feedback** - See changes instantly
5. **Mobile Friendly** - Scrollable modal works on all screen sizes
6. **Data Integrity** - All instances of a song are updated consistently

## Testing Checklist

- [ ] Edit a song's basic info (artist, song name)
- [ ] Edit a song's metadata (tags, tuning, key, etc.)
- [ ] Move a song to a different set
- [ ] Edit a song that appears in multiple sets
- [ ] Cancel editing (no changes saved)
- [ ] Close modal with ESC key
- [ ] Close modal by clicking outside
- [ ] Test on mobile devices (scrolling)
- [ ] Verify changes persist after page reload
- [ ] Verify chord charts are preserved

## Future Enhancements (Optional)

- Add ability to duplicate song to another set while keeping original
- Add bulk edit for multiple songs
- Add preview of how song appears in chord chart editor
- Add validation for duration format
- Add auto-save draft functionality

