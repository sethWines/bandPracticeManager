# Mobile Reordering & Version Fixes

## Version Display Fixed ✅

### Problem
All pages were showing **v2.1.0** instead of **v2.3.0** because each HTML file had a hardcoded meta tag.

### Solution
Updated **all 5 HTML files** to v2.3.0:
- `setlist-manager.html`
- `song-manager.html`
- `show-time.html`
- `chord-chart-editor.html`
- `storage-wizard.html`

### Files That Control Version

1. **version.txt** (v2.3.0) - For HTTP/HTTPS servers
2. **js/version.js** line 33 (v2.3.0) - Fallback for file://
3. **Meta tags in each HTML** (v2.3.0) - Priority override

Now all pages show **v2.3.0** in the title tag!

---

## Mobile Song Reordering Added 📱⬆️⬇️

### Problem
On mobile devices, drag-and-drop doesn't work well for reordering songs in setlists. Touch screens make it difficult to drag items precisely.

### Solution
Added compact up/down arrow buttons that appear **only on mobile** (screens ≤768px wide).

### Features

**Up/Down Arrows:**
- Small, compact buttons (24x24px)
- Positioned at the left side of each song
- Stacked vertically (up arrow on top, down arrow below)
- Automatically disabled when:
  - Up arrow disabled on first song
  - Down arrow disabled on last song
- SVG icons for crisp display on all screens

**Mobile-Only:**
- Hidden on desktop (drag-and-drop still works)
- Visible only on mobile devices
- No print (excluded from printed setlists)

### How It Works

```javascript
// Move song up (swap with previous)
function moveSongUp(setlistIndex, setIndex, songIndex) {
    if (songIndex === 0) return; // Already at top
    
    const set = setlists[setlistIndex].sets[setIndex];
    const song = set.songs[songIndex];
    
    // Swap positions
    set.songs[songIndex] = set.songs[songIndex - 1];
    set.songs[songIndex - 1] = song;
    
    saveSetlistsToStorage();
    renderSetlistCenter();
}
```

### Visual Design

**Desktop (>768px):**
```
[#] Sweet Child O' Mine                [3:45] [📊] [✏️] [🗑️]
    Guns N' Roses • Key: E
```

**Mobile (≤768px):**
```
[⬆️] [#] Sweet Child O' Mine           [3:45] [📊] [✏️] [🗑️]
[⬇️]     Guns N' Roses • Key: E
```

The arrows are compact and don't take much space, positioned before the song number.

### CSS Implementation

```css
/* Hide reorder buttons by default (desktop) */
.mobile-reorder-buttons {
    display: none;
}

/* Show on mobile */
@media (max-width: 768px) {
    .mobile-reorder-buttons {
        display: flex !important;
        flex-direction: column;
        gap: 2px;
    }
}

/* Small button style */
.icon-btn-small {
    padding: 4px;
    min-width: 24px;
    min-height: 24px;
}

.icon-btn-small:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}
```

### User Experience

**On Mobile:**
1. Open a setlist
2. Expand a set to see songs
3. See small up/down arrows next to each song
4. Tap ⬆️ to move song up
5. Tap ⬇️ to move song down
6. Changes save immediately

**Smart Disabling:**
- First song: ⬆️ is disabled (grayed out)
- Last song: ⬇️ is disabled (grayed out)
- Can't move songs out of bounds

**Smooth Operation:**
- Instant visual feedback
- No reload needed
- Works offline
- No accidental drags

### Accessibility

- **Touch-friendly:** 24x24px targets (exceeds minimum)
- **Visual feedback:** Disabled state is clear
- **Title attributes:** Hover shows "Move Up" / "Move Down"
- **No conflicts:** Works alongside existing buttons

### Benefits

| Feature | Desktop | Mobile |
|---------|---------|--------|
| **Drag & Drop** | ✅ Works great | ❌ Difficult |
| **Up/Down Arrows** | Hidden (not needed) | ✅ Perfect! |
| **Touch Targets** | N/A | ✅ 24px (accessible) |
| **Visual Clutter** | Clean | Minimal |

### Testing

**To Test Mobile View:**
1. Open setlist-manager.html
2. Open DevTools (F12)
3. Click device toolbar icon (Ctrl+Shift+M)
4. Select mobile device or resize to <768px width
5. Open a setlist and expand a set
6. You should see the up/down arrows!

**Test Functionality:**
- [ ] Arrows appear only on mobile view
- [ ] Up arrow moves song up
- [ ] Down arrow moves song down
- [ ] First song: up arrow disabled
- [ ] Last song: down arrow disabled
- [ ] Changes persist after refresh
- [ ] Arrows hidden on desktop view

### Version Updates

This feature is part of **v2.3.0** release:
- Mobile song reordering
- Version display fixes across all pages
- Improved mobile UX

### Files Modified

1. **setlist-manager.html**
   - Added mobile reorder buttons HTML
   - Added CSS for mobile display
   - Added `moveSongUp()` function
   - Added `moveSongDown()` function
   - Updated meta tag to v2.3.0

2. **song-manager.html**
   - Updated meta tag to v2.3.0

3. **show-time.html**
   - Updated meta tag to v2.3.0

4. **chord-chart-editor.html**
   - Updated meta tag to v2.3.0

5. **storage-wizard.html**
   - Updated meta tag to v2.3.0

6. **js/version.js**
   - Updated fallback to v2.3.0

7. **version.txt**
   - Updated to v2.3.0

## Summary

✅ **Version fixed** - All pages now show v2.3.0
✅ **Mobile reordering added** - Up/down arrows for mobile users
✅ **No desktop impact** - Arrows hidden on desktop, drag-and-drop still works
✅ **Accessible** - Touch-friendly 24px buttons
✅ **Smart** - Disabled when at boundaries

Mobile users can now easily reorder songs without struggling with drag-and-drop! 📱✨

