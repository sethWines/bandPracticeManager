# Mobile & Tablet User Guide
## Band Practice Manager

**Version:** 1.0  
**Last Updated:** December 8, 2024

---

## 🎯 New! Interactive Mobile Guide Wizard

**Prefer a step-by-step interactive guide?**

Access the **Mobile Guide Wizard** from the Song Manager mobile menu (☰ → 📱 Mobile Guide). The wizard:
- Auto-detects your device type (iPhone, iPad, Android)
- Provides interactive step-by-step instructions
- Offers action buttons to trigger file operations directly
- Guides you through importing CSV files or backing up data

This document serves as a comprehensive reference. For quick, device-specific guidance, use the wizard!

---

## Table of Contents

1. [Introduction](#introduction)
2. [How Storage Works on Mobile](#how-storage-works-on-mobile)
3. [Getting Started](#getting-started)
4. [iPad & iPhone Users](#ipad--iphone-users)
5. [Android Tablet Users](#android-tablet-users)
6. [Backup & Data Transfer](#backup--data-transfer)
7. [Touch Gestures](#touch-gestures)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)

---

## Introduction

The Band Practice Manager is a **fully functional web app** that works on tablets and smartphones! It stores all your data locally on your device, so you can use it anywhere - even without an internet connection (after the first load).

**Key Points:**
- ✅ Works on iPad, iPhone, Android tablets, and Android phones
- ✅ All data stored locally on your device (private and secure)
- ✅ Works offline (after initial page load)
- ✅ No account required, no cloud storage
- ❌ Data doesn't automatically sync between devices (see Backup section)

---

## How Storage Works on Mobile

### What is localStorage?

The app uses **localStorage** - a built-in browser feature that saves data directly on your device. Think of it like a mini database that lives in your browser.

**Where is your data stored?**
- **iPad/iPhone**: In Safari's storage (or Chrome if you use Chrome)
- **Android**: In Chrome's storage (or Firefox if you use Firefox)
- **Location**: Stored on the device itself, NOT in the cloud

**Important Facts:**
- ✅ Data persists even when you close the browser
- ✅ Data stays on your device (private and secure)
- ✅ No internet required to use the app (after first load)
- ❌ Data is tied to the browser (Safari data ≠ Chrome data)
- ❌ Clearing browser data will delete your songs/setlists
- ❌ Uninstalling the browser will delete your data

---

## Getting Started

### First Time Setup

1. **Open your browser** (Safari on iPad/iPhone, Chrome on Android)
2. **Navigate to the app** (the URL where you access Band Practice Manager)
3. **Bookmark it or Add to Home Screen** (see instructions below)
4. **Start adding songs** in the Song Manager
5. **Create setlists** in the Setlist Manager

### Recommended Browsers

**iPad/iPhone:**
- ✅ **Safari** (Best choice - optimized for iOS)
- ✅ Chrome (Also works well)
- ⚠️ Avoid third-party browsers (may have storage limitations)

**Android Tablets:**
- ✅ **Chrome** (Best choice - most reliable)
- ✅ Firefox (Also works well)
- ⚠️ Samsung Internet (Works but test storage persistence)

---

## iPad & iPhone Users

### Add to Home Screen (App-Like Experience)

Make the Band Practice Manager feel like a native app!

**Steps:**
1. Open **Safari** and navigate to the app
2. Tap the **Share button** (square with arrow pointing up)
3. Scroll down and tap **"Add to Home Screen"**
4. Edit the name if desired (defaults to "Band Manager")
5. Tap **"Add"**

**Benefits:**
- Opens in fullscreen (no browser UI)
- Appears as an app icon on your home screen
- Faster access
- More screen space for your setlists

### Touch Gestures

**Song Drag-and-Drop:**
- **Tap and hold** a song for 0.5 seconds
- **Drag** to move it within the set or to another set
- **Release** to drop it in the new position
- Green line shows where it will land

**Set Reordering:**
- Use the **⬆️ and ⬇️ arrow buttons** on each set header
- Sets automatically renumber (1st Set, 2nd Set, etc.)

**Expand/Collapse Sets:**
- **Tap** the set header to expand or collapse
- State is remembered when you refresh (F5)
- CTRL+F5 resets to all collapsed

### Known Limitations on iOS

- **Private Browsing**: localStorage doesn't persist in Private Mode
- **Storage Quota**: Safari allows ~5-10MB of localStorage (plenty for thousands of songs)
- **Browser Cache**: If you clear Safari data, your songs/setlists will be deleted
- **No Auto-Sync**: Data doesn't sync between your iPad and iPhone automatically

---

## Android Tablet Users

### Install as App (PWA)

Chrome on Android can "install" web apps!

**Steps:**
1. Open **Chrome** and navigate to the app
2. Tap the **three dots menu** (⋮) in the top right
3. Tap **"Install app"** or **"Add to Home screen"**
4. Follow the prompts
5. The app will appear on your home screen

**Benefits:**
- Opens as a standalone app
- No browser UI clutter
- Works offline
- Faster startup

### Touch Gestures

Same as iOS - see [Touch Gestures](#touch-gestures) above.

### Known Limitations on Android

- **Storage Quota**: Chrome allows ~5-10MB of localStorage
- **Browser Data**: Clearing Chrome data deletes your songs/setlists
- **Separate Storage**: Chrome data ≠ Firefox data (pick one browser and stick with it)

---

## Backup & Data Transfer

### Why You Should Backup

Since your data is stored locally, it can be lost if:
- You clear browser cache/data
- You uninstall the browser
- Your device gets reset or replaced
- The browser has an issue

### How to Backup (Export All Data)

**On ANY page** (Song Manager or Setlist Manager):

1. Look for the **"Backup"** button in the header
2. Click **"Backup"**
3. A JSON file will download (e.g., `band-practice-manager-backup-2024-12-08.json`)
4. **Save this file somewhere safe:**
   - Cloud storage (Google Drive, iCloud, Dropbox)
   - Email it to yourself
   - Transfer to your computer

**Backup Frequency:**
- 📅 Weekly if you're actively updating songs/setlists
- 📅 After major changes (adding many songs, creating new setlists)
- 📅 Before clearing browser data or updating your device

### How to Restore (Import All Data)

**To restore from backup:**

1. Click the **"Restore"** button in the header
2. Select your backup JSON file
3. Confirm the restoration (this will overwrite current data!)
4. The page will reload with all your data restored

### Transfer Data Between Devices

Want your setlists on both your iPad and phone?

**Steps:**
1. **On Device 1** (e.g., iPad):
   - Click **"Backup"**
   - Save the JSON file to cloud storage or email it

2. **On Device 2** (e.g., Android tablet):
   - Download the JSON file from cloud/email
   - Open Band Practice Manager
   - Click **"Restore"**
   - Select the JSON file
   - All your data is now on Device 2!

**Note:** This is a manual process. Data doesn't sync automatically.

---

## Working with Files on iPhone & iPad

### Understanding iOS File Access

When you tap "Import from CSV File" in the app, iOS will open the **Files app picker**. This lets you browse and select files from various locations on your device.

### File Locations on iOS

**1. iCloud Drive** (Recommended)
- Files sync across all your Apple devices automatically
- Accessible even if you clear browser data
- Requires iCloud storage space
- Survives device upgrades and resets
- Path: Files app → "iCloud Drive"

**2. On My iPhone/iPad** (Local Storage)
- Files stored directly on the device
- Faster access (no internet needed)
- Organized by app (Downloads, Files, etc.)
- Deleted if you uninstall apps or reset device
- Path: Files app → "On My iPhone" or "On My iPad"

**3. Third-Party Cloud Services**
- Google Drive, Dropbox, OneDrive, etc.
- Available if you have their apps installed
- Requires internet connection
- Cross-platform compatible

### How to Import CSV Files on iOS

**Step 1: Get Your CSV File onto Your Device**

**Option A - Email Method:**
1. Open the email containing the CSV file on your iPhone/iPad
2. **Long-press** the CSV attachment
3. Tap **"Save to Files"**
4. Choose location:
   - **iCloud Drive** (recommended for safety)
   - **On My iPhone/iPad** → **Downloads** (faster access)
5. Tap **"Save"**
6. Remember where you saved it!

**Option B - Cloud Storage Method:**
1. Open your cloud storage app (Google Drive, Dropbox, etc.)
2. Navigate to your CSV file
3. Tap the **"..."** or **"Share"** menu
4. Select **"Export"** or **"Save to Files"**
5. Choose a location (iCloud Drive recommended)
6. Tap **"Save"**

**Option C - AirDrop Method:**
1. On your Mac: Right-click CSV file → **Share** → **AirDrop**
2. Select your iPhone/iPad
3. On iOS device: Accept the file
4. File automatically goes to **Downloads** folder
5. Access via Files app → "On My iPhone" → "Downloads"

**Step 2: Import in Band Practice Manager**

1. Open **Song Manager** in Safari or Chrome
2. Tap the mobile menu button (**☰**)
3. Tap **"Import Songs"** or use the **Mobile Guide Wizard**
4. Tap **"Import from CSV File"**
5. iOS Files picker will open
6. Navigate to where you saved the file:
   - Tap "iCloud Drive" or "On My iPhone/iPad"
   - Navigate to the folder (e.g., Downloads)
7. Tap your CSV file to select it
8. The import preview will show in Band Practice Manager

**Step 3: Confirm Import**

1. Review the songs in the preview table
2. Check/uncheck songs you want to include
3. Tap **"✓ Confirm Import"**
4. Your songs are now loaded!

### How to Save Backup Files on iOS

**Where Backup Files Go:**

When you tap "Backup" in Song Manager:
- **Safari**: File goes to **Downloads** (On My iPhone/iPad → Downloads)
- **Chrome**: File also goes to **Downloads**

**Step 1: Download Backup**

1. In Song Manager, tap **"Backup"** button
2. File downloads automatically
3. Look for: `band-practice-manager-backup-2024-12-08.json`

**Step 2: Move to iCloud Drive (Recommended)**

To protect your backup:

1. Open the **Files** app
2. Tap **"Browse"** at the bottom
3. Navigate to **"On My iPhone"** or **"On My iPad"**
4. Tap **"Downloads"**
5. Find your backup file (starts with `band-practice-manager-backup-`)
6. **Long-press** the backup file
7. Tap **"Move"** from the menu
8. Navigate to **"iCloud Drive"**
9. (Optional) Create a new folder:
   - Tap the **folder icon** with "+"
   - Name it **"Band Manager Backups"**
   - Tap **"Done"**
10. Tap **"Move"** to confirm

**Now your backup is safe in iCloud!**

**Step 3: Organize Old Backups**

To keep your storage clean:

1. Open **Files** app
2. Navigate to your backup folder
3. View your backups by date (newest first)
4. **Swipe left** on old backups
5. Tap **"Delete"**
6. Keep the last 3-4 backups (in case one is corrupted)

**Deleted files go to "Recently Deleted" for 30 days before permanent deletion.**

### Troubleshooting iOS File Operations

**Problem: "No files found" when trying to import**

**Solutions:**
- Ensure the file has `.csv` extension (not `.txt` or `.numbers`)
- Check that the file is in an accessible location (not in a restricted app folder)
- Try moving the file to iCloud Drive first, then import from there
- Open the file in Numbers app to verify it's valid, then export as CSV

**Problem: "Cannot open file" error**

**Solutions:**
- The CSV file might be corrupted
- Open it in Numbers or Excel on your device to verify
- If corrupted, re-download from the source
- Check file permissions (long-press → "Get Info")

**Problem: Files app picker doesn't show iCloud Drive**

**Solutions:**
1. Go to **Settings** → **[Your Name]** → **iCloud**
2. Ensure **iCloud Drive** is turned **ON**
3. Scroll down to **Files** app
4. Ensure it has permission to access iCloud Drive
5. Restart your device if needed

**Problem: Downloaded backup file disappeared**

**Solutions:**
1. Open **Files** app → **Browse**
2. Check **"On My iPhone"** → **"Downloads"**
3. Check **"Recently Deleted"** folder (files stay 30 days)
4. Check **iCloud Drive** if you moved it earlier
5. If not found, re-download from Band Practice Manager

**Problem: File picker is too slow or unresponsive**

**Solutions:**
1. Close other apps running in background
2. Restart your iPhone/iPad
3. Ensure you have free storage space (Settings → General → iPhone Storage)
4. Try using a different browser (Safari vs Chrome)

### iOS Best Practices

**For CSV Imports:**
- Always save CSV files to **iCloud Drive** for easy access
- Create a dedicated folder: "Band Manager CSV Files"
- Keep original CSV files even after importing (for re-importing later)
- Test small CSV files first to verify format

**For Backups:**
- Set a weekly reminder to backup your data
- Store backups in **iCloud Drive** for safety
- Keep multiple backup versions (last 3-4)
- Email yourself a backup copy for extra safety
- Before iOS updates, create a fresh backup

**File Management:**
- Organize files into folders by date or purpose
- Delete old backups to free up storage
- Use iCloud Drive for important files
- Use "On My iPhone" for temporary files

### iOS Files App Tips

**Quick Actions:**
- **Long-press** a file for options (Move, Delete, Share, etc.)
- **Swipe left** on a file to quickly delete
- **Drag and drop** files between folders (iPad only)
- **Two-finger pinch** to zoom thumbnail size

**Sorting:**
- Tap **"..."** menu → **"Sort By"**
- Options: Name, Date, Size, Tags
- View as: Grid or List

**Search:**
- Pull down on any folder view to reveal search bar
- Search by filename, date, or tags
- Works across all locations (iCloud, local, cloud services)

**Favorites:**
- **Long-press** a folder → **"Favorite"**
- Access favorites from sidebar for quick navigation

---

## Touch Gestures

### Song Drag-and-Drop

**Within a Set:**
1. **Tap and hold** a song for 0.5 seconds until it becomes semi-transparent
2. **Drag** the song up or down
3. Watch for the **green line** showing drop position
4. **Release** to drop

**Between Sets:**
1. **Expand both sets** (tap the set headers)
2. **Tap and hold** a song
3. **Drag** to the other set
4. **Drop** where you want it

**Visual Feedback:**
- Dragged song becomes transparent (40% opacity)
- Green line shows where it will drop
- Song numbers update automatically after drop

### Set Reordering

Use the **⬆️ Up** and **⬇️ Down** arrow buttons:
- Tap to move a set up or down in the order
- Set names update automatically (1st Set → 2nd Set, etc.)
- Expand/collapse state is preserved

### Expand/Collapse

- **Single tap** on a set header to expand or collapse
- State is remembered across normal refreshes
- CTRL+F5 resets everything to collapsed

---

## Troubleshooting

### "My songs/setlists disappeared!"

**Possible causes:**
1. **Browser data was cleared**
   - iOS: Settings → Safari → Clear History and Website Data
   - Android: Chrome → Settings → Privacy → Clear Browsing Data
   - **Solution:** Restore from your most recent backup

2. **Using a different browser**
   - Safari data ≠ Chrome data
   - **Solution:** Stick to one browser or export/import between them

3. **Private/Incognito Mode**
   - Data doesn't persist in private browsing
   - **Solution:** Use normal browsing mode

4. **Browser updated or device reset**
   - Updates shouldn't clear data, but it can happen
   - **Solution:** Restore from backup

### Drag-and-Drop Not Working on Tablet

**Try these:**
1. **Tap and hold** for a full second before dragging
2. **Expand the target set** before dragging (can't drop into collapsed sets)
3. **Use arrow buttons** as alternative for set reordering
4. **Try a different browser** (Safari vs Chrome)
5. **Update your browser** to the latest version

### "Invalid backup file format" Error

**Causes:**
- File is corrupted
- Wrong file selected (not a Band Practice Manager backup)
- Very old backup from incompatible version

**Solutions:**
- Try a different backup file
- Ensure you're selecting a `.json` file from the "Backup" button
- Contact support if all backups fail

### App Runs Slowly on Tablet

**Tips:**
1. **Close other browser tabs** (frees up memory)
2. **Restart your browser**
3. **Restart your device**
4. **Clear old browser cache** (but NOT localStorage data!)
5. **Use a newer device** (app works best on recent iOS/Android versions)

---

## Best Practices

### Data Management

1. **Backup Weekly**
   - Set a reminder to export your data every week
   - Keep the last 3-4 backups (in case one is corrupted)

2. **Backup Before Major Changes**
   - Before bulk importing songs
   - Before editing many setlists
   - Before updating your device OS

3. **Store Backups in Multiple Places**
   - Cloud storage (Google Drive, iCloud)
   - Email to yourself
   - Computer hard drive
   - USB drive (if transferring to computer)

### Device Usage

1. **Pick One Browser and Stick With It**
   - All your data stays in that browser
   - Switching browsers means exporting/importing

2. **Don't Use Private/Incognito Mode**
   - Data won't persist
   - Use normal browsing mode

3. **Add to Home Screen**
   - Better experience
   - Faster access
   - More screen space

4. **Keep Browser Updated**
   - Latest features
   - Bug fixes
   - Better performance

### Multi-Device Workflow

If you use multiple devices (iPad + phone, phone + tablet), establish a workflow:

**Option 1: Primary Device**
- Keep ONE device as your "main" device
- Only make changes there
- Export and import to secondary devices when needed

**Option 2: Manual Sync**
- After each practice session, export from the device you used
- Save to cloud storage
- Import on your other devices
- Last export always has the latest data

**Option 3: Computer as Hub**
- Make changes on your computer
- Export before practice
- Import to your tablet/phone
- Use tablet/phone in read-only mode during practice

---

## Platform-Specific Tips

### iOS (iPad/iPhone)

**Storage Location:**
- `/var/mobile/Applications/Safari/Library/WebKit/WebsiteData/LocalStorage/`
- (You can't access this directly, but it's good to know)

**Storage Limit:** ~5-10MB (enough for thousands of songs)

**Backup Recommendation:**
- Export to **iCloud Drive** for easy access across Apple devices
- Files app → iCloud Drive → Create "Band Manager Backups" folder

**Installing:**
- Use Safari's "Add to Home Screen" feature
- Icon will appear on your home screen with other apps

### Android (Tablets & Phones)

**Storage Location:**
- `/data/data/com.android.chrome/app_chrome/Default/Local Storage/`
- (You can't access this directly, but it's good to know)

**Storage Limit:** ~5-10MB (enough for thousands of songs)

**Backup Recommendation:**
- Export to **Google Drive** for cloud backup
- Or use "Files" app → Downloads → Move to Drive

**Installing:**
- Chrome's "Install app" or "Add to Home screen"
- Works like a native app

---

## Technical Details

### What Data is Stored?

The backup file contains:
- **Songs**: All your songs with artist, album, key, tuning, duration, etc.
- **Setlists**: All setlists with their sets and song arrangements
- **Theme**: Your selected color theme preference
- **Watermark**: Guitar or drum watermark preference
- **Settings**: Column visibility, sidebar collapse state

### File Format

Backups are saved as **JSON** (JavaScript Object Notation):
- Human-readable text format
- Can be opened in any text editor
- Compatible across all devices and platforms
- File name: `band-practice-manager-backup-YYYY-MM-DD.json`

### Browser Compatibility

**Tested and Working:**
- iOS Safari 14+
- iOS Chrome 90+
- Android Chrome 90+
- Android Firefox 88+

**Not Recommended:**
- Very old browsers (pre-2020)
- Opera Mini (limited localStorage support)
- UC Browser (unreliable storage)

---

## Frequently Asked Questions

### Q: Can I use this on my phone?

**A:** Yes! It works on phones, but the interface is optimized for tablets and larger screens. Some features (like viewing large setlists) work better on tablets or desktops.

### Q: Do I need internet to use this?

**A:** After the first load, the app works **offline**. Your data is stored locally, so you don't need internet to view or edit your songs/setlists. You only need internet to initially load the page or after clearing browser cache.

### Q: Will my data sync between my iPad and phone?

**A:** No, not automatically. You need to manually export from one device and import to the other. See [Transfer Data Between Devices](#transfer-data-between-devices).

### Q: How much data can I store?

**A:** Most browsers allow 5-10MB of localStorage, which is enough for:
- **5,000+ songs** with full metadata
- **100+ setlists** with multiple sets
- All your settings and preferences

### Q: What if I get a new tablet?

**A:** 
1. Export your data from the old tablet (Backup button)
2. Save the backup file to cloud storage or email it
3. On your new tablet, open the app
4. Import the backup file (Restore button)
5. All done!

### Q: Can multiple band members use this on their own devices?

**A:** Yes! Each person can:
- Install the app on their own device
- Import a shared backup file to get the same songs/setlists
- Make their own changes
- Export and share updates with the band

**Note:** There's no automatic syncing, so you'll need to manually share backup files when changes are made.

### Q: Is my data secure?

**A:** Yes! Your data:
- Stays on YOUR device only
- Isn't sent to any server
- Isn't shared with anyone
- Isn't uploaded to the cloud (unless you choose to backup there)

### Q: Can I use this during a live show?

**A:** Absolutely! The **Show Time** mode is designed exactly for this:
- Large, readable text
- Swipe to navigate through songs
- Works offline
- No distractions

---

## Quick Start Checklist

- [ ] Open app in recommended browser (Safari/Chrome)
- [ ] Add to Home Screen for app-like experience
- [ ] Add your first few songs
- [ ] Create your first setlist
- [ ] Test drag-and-drop on a song
- [ ] Create your first backup (Backup button)
- [ ] Save backup file to cloud storage
- [ ] Set a weekly reminder to backup

---

## Support

If you encounter issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Make sure your browser is up to date
3. Try the app in a different browser
4. Create a backup before trying to fix anything
5. Refer to the main [README.md](README.md) for general app documentation

---

**Happy practicing!** 🎸🥁🎹

