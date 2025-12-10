# Fix: Edit Song Button Not Working

## Problem
When clicking the edit button (pencil icon) on a song in the setlist, nothing was happening. The modal was not opening.

## Root Cause
The edit button was using an inline `onclick` attribute with `escapeHtml()` to escape the artist and song names:

```html
<button onclick="editSongFromSetlist('${escapeHtml(song.artist)}', '${escapeHtml(song.song)}')">
```

The `escapeHtml()` function converts characters like `'` (apostrophe) to `&#39;` which is correct for HTML content, but when used inside a JavaScript string in an `onclick` attribute, it breaks the JavaScript syntax.

**Example of the problem:**
- Song: "Don't Stop Believin'"
- After escapeHtml: "Don&#39;t Stop Believin&#39;"
- In onclick: `onclick="editSongFromSetlist('Journey', 'Don&#39;t Stop Believin&#39;')"`
- This creates invalid JavaScript that silently fails

## Solution
Changed from inline `onclick` handlers to **data attributes** with **event delegation**:

### 1. Updated Button HTML
Changed from:
```html
<button onclick="editSongFromSetlist('${escapeHtml(song.artist)}', '${escapeHtml(song.song)}')">
```

To:
```html
<button class="icon-btn no-print edit-song-btn" 
        data-artist="${escapeHtml(song.artist)}" 
        data-song="${escapeHtml(song.song)}">
```

### 2. Added Event Delegation
Created a new function `setupEditSongButtons()` that uses event delegation:

```javascript
function setupEditSongButtons() {
    document.addEventListener('click', function(e) {
        const editBtn = e.target.closest('.edit-song-btn');
        if (editBtn) {
            const artist = editBtn.getAttribute('data-artist');
            const song = editBtn.getAttribute('data-song');
            if (artist && song) {
                editSongFromSetlist(artist, song);
            }
        }
    });
}
```

This is called during page initialization.

### 3. Added Debug Logging
Enhanced the `editSongFromSetlist()` function with comprehensive console logging:
- Logs the artist and song being edited
- Logs if the song is found in the library
- Logs which set and position the song is in
- Logs when the modal opens

## Benefits of This Approach

1. **Works with Special Characters**: Data attributes properly handle HTML entities
2. **Event Delegation**: Only one event listener for all edit buttons (better performance)
3. **Dynamic Content**: Works even if buttons are added after page load
4. **Easier Debugging**: Console logs show exactly what's happening
5. **Cleaner HTML**: Separates structure from behavior

## Testing

To test the fix:
1. Open the browser console (F12)
2. Click the edit button on any song in a setlist
3. You should see console logs like:
   ```
   [Edit Song] Called with artist: Journey song: Don't Stop Believin'
   [Edit Song] Song index in library: 42
   [Edit Song] Found song: {artist: "Journey", song: "Don't Stop Believin'", ...}
   [Edit Song] Found in set: 0 position: 3
   [Edit Song] Opening modal
   ```
4. The edit modal should open with all fields populated

## What Works Now

- ✅ Edit button works on songs with apostrophes (e.g., "Don't Stop")
- ✅ Edit button works on songs with quotes (e.g., "She's So "Cool"")
- ✅ Edit button works on songs with ampersands (e.g., "Rock & Roll")
- ✅ Edit button works on songs with special characters
- ✅ Console provides clear debugging information
- ✅ Event delegation ensures it works after re-rendering

## Related Files Changed

- `setlist-manager.html` - Updated button HTML and added event delegation

