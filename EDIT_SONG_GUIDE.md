# Quick Guide: Edit Songs in Setlist Manager

## How to Edit a Song from Your Setlist

### Step 1: Click the Edit Button
In your setlist, find the song you want to edit and click the **pencil icon** (✏️) next to it.

### Step 2: Edit Modal Opens
A modal window will appear with all the song's information pre-filled:
- Artist Name
- Song Name
- Album
- Link (YouTube, Spotify, etc.)
- Tuning
- Bands
- Tags
- Duration
- Practice Status
- Key
- First Note
- Last Note

### Step 3: Make Your Changes
Edit any fields you want to update. All changes will be saved to both:
- The global song library
- All instances of this song in your setlists

### Step 4: (Optional) Move to Different Set
At the bottom of the form, you'll see a **"Move to Set"** dropdown:
- By default, it's set to "Keep in current set"
- If you want to move the song to a different set, select the target set from the dropdown
- The song will be removed from its current set and added to the selected set

### Step 5: Save or Cancel
- Click **"Save Changes"** to save your edits
- Click **"Cancel"** or press **ESC** or click outside the modal to cancel

### Step 6: See Results
- Your changes are immediately visible in the setlist
- A confirmation message appears
- If you moved the song, it shows which sets were involved

## Tips

### Quick Close Options
You can close the modal in three ways:
1. Click the **X** button in the top-right corner
2. Press the **ESC** key on your keyboard
3. Click anywhere outside the modal window

### Moving Songs Between Sets
This is useful when you want to:
- Rearrange your setlist structure
- Balance the length of different sets
- Move a song from Set 1 to Set 2 (or any other set)
- Reorganize your show flow

### What Gets Updated
When you edit a song:
- ✅ The song in your global library is updated
- ✅ All instances of this song across ALL setlists are updated
- ✅ Metadata like play count and chord charts are preserved
- ✅ Changes are saved to localStorage immediately

### Mobile Usage
- The modal is fully scrollable on mobile devices
- All form fields are touch-friendly
- The "Move to Set" dropdown works on all screen sizes

## Example Workflow

**Scenario:** You want to change a song's key and move it from Set 1 to Set 2

1. Click edit button on the song in Set 1
2. Modal opens with all current information
3. Change the "Key" field (e.g., from "C" to "G")
4. Scroll down to "Move to Set" dropdown
5. Select "Set 2" from the dropdown
6. Click "Save Changes"
7. Success! The song now appears in Set 2 with the new key

**Result:**
- Song is in Set 2 (removed from Set 1)
- Key is updated everywhere the song appears
- All other song data remains unchanged

## Comparison to Old Method

### Before (Opening Song Manager)
1. Click edit → Opens new tab
2. Search for song in Song Manager
3. Edit the song
4. Save
5. Switch back to Setlist tab
6. Manually remove from Set 1
7. Manually add to Set 2

**Time: ~60-90 seconds**

### Now (Inline Modal)
1. Click edit → Modal opens
2. Edit fields
3. Select new set (optional)
4. Click Save

**Time: ~10-15 seconds**

---

## Need Help?

If you encounter any issues:
- Make sure you have the latest version
- Check that your songs are properly saved in the Song Manager
- Try refreshing the page if the modal doesn't appear
- Check browser console (F12) for any errors

