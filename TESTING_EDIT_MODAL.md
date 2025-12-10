# Testing the Edit Song Modal

## How to Test the Save Button

### Open Browser Console
1. Press **F12** to open Developer Tools
2. Click on the **Console** tab
3. Keep it open while testing

### Test the Edit Flow

1. **Open a setlist** in the setlist manager
2. **Expand a set** to see songs
3. **Click the edit button** (pencil icon) on any song

### Expected Console Output When Clicking Edit

You should see:
```
[Edit Song] Called with artist: [artist name] song: [song name]
[Edit Song] Setlist: 0 Set: 1 Song position: 3
[Edit Song] Song index in library: 42
[Edit Song] Found song: {artist: "...", song: "...", ...}
[Edit Song] Working with setlist: [setlist name]
[Edit Song] Opening modal
```

### Test the Save Button

When the modal opens:

1. **Try clicking the Save Changes button**
2. **Watch the console**

### Expected Console Output When Clicking Save

You should see:
```
[Button] Save button clicked directly
[Save Edit] ===== SAVE BUTTON CLICKED =====
[Save Edit] Event: SubmitEvent {...}
[Save Edit] Saving changes for song: {...}
[Save Edit] Updated song data: {...}
[Save Edit] Saved to global song library
[Save Edit] Complete
```

## Troubleshooting

### If Nothing Happens When You Click Save

**Check 1: Is the button visible?**
- The button should be at the bottom of the modal
- It should say "Save Changes"
- It should be blue/primary colored

**Check 2: Does the button click?**
- Look in console for: `[Button] Save button clicked directly`
- If you see this, the button IS clicking
- If you don't see this, there's a CSS/HTML issue

**Check 3: Does the form submit?**
- Look in console for: `[Save Edit] ===== SAVE BUTTON CLICKED =====`
- If you see the button click but NOT this, the form submission is blocked
- If you see this, the function IS being called

**Check 4: Does the function complete?**
- Look for: `[Save Edit] Complete` at the end
- If you don't see this, check for errors in between

### Common Issues

#### Issue: Button doesn't click at all
**Cause:** CSS is blocking the button or it's not in the DOM
**Fix:** Check that the modal HTML is properly closed and the button is inside the form

#### Issue: Button clicks but form doesn't submit
**Cause:** Form onsubmit handler not connected or preventDefault elsewhere
**Fix:** Check that the form has `onsubmit="saveSongEdit(event)"`

#### Issue: Form submits but gets error "No song context found"
**Cause:** The `editingSongContext` variable is null
**Fix:** Make sure you clicked edit button before trying to save

#### Issue: Form submits but page reloads
**Cause:** `event.preventDefault()` not being called
**Fix:** Make sure the first line in saveSongEdit is `event.preventDefault()`

## Manual Testing Checklist

- [ ] Click edit button on a song
- [ ] Modal opens with song data filled in
- [ ] See console log: "Opening modal"
- [ ] Change the key field (e.g., from C to G)
- [ ] Click "Save Changes" button
- [ ] See console log: "Save button clicked directly"
- [ ] See console log: "SAVE BUTTON CLICKED"
- [ ] See console log: "Complete"
- [ ] Modal closes
- [ ] See alert: "Song updated successfully!"
- [ ] Song shows new key in the setlist

## Advanced Testing

### Test Move to Set
1. Open edit modal on a song in Set 1
2. Change "Move to Set" dropdown to "Set 2"
3. Click Save
4. Song should move from Set 1 to Set 2

### Test Global Updates
1. Note a song appears in multiple setlists
2. Edit it from one setlist
3. Change the key
4. Save
5. Open other setlists
6. Verify the key updated everywhere

### Test Name Change
1. Edit a song
2. Change artist or song name
3. Save
4. Verify all references updated in all setlists

## If Still Not Working

Share the **exact console output** you see, including:
- What logs appear when you click edit
- What logs appear when you click save
- Any error messages in red
- Any warnings in yellow

This will help identify exactly where the issue is!

