# Version Management Guide

## Current Version: v2.3.0

## How Versions Work

The app displays the version tag below page titles (e.g., "Song Manager **v2.3.0**").

### Version Sources (in order of priority)

1. **version.txt** (when served over HTTP/HTTPS)
   - Location: Root directory
   - Only works when app is served from a web server
   - Does NOT work with `file://` protocol

2. **Meta tag** (optional)
   - Add `<meta name="app-version" content="v2.3.0">` to HTML head
   - Useful for static deployments

3. **Fallback in version.js** (line 33)
   - **IMPORTANT:** This is what displays when running locally with `file://`
   - Must be manually updated when releasing new versions

## How to Update Version

### For a New Release

Update **TWO** files:

#### 1. version.txt
```
v2.3.0
```

#### 2. js/version.js (line 33)
```javascript
// Default fallback - UPDATE THIS WHEN RELEASING NEW VERSION
return 'v2.3.0';
```

### Quick Update Script

You can use the provided scripts to update both files at once:

**Windows:**
```batch
update-version.bat v2.3.0
```

**Linux/Mac:**
```bash
./update-version.sh v2.3.0
```

These scripts will:
- Update version.txt
- Update the fallback in version.js
- Display confirmation

## About the CORS Error

When running from `file://` protocol, you'll see:
```
Access to internal resource at 'file:///.../manifest.json' 
from origin 'null' has been blocked by CORS policy
```

**This is HARMLESS and expected:**
- Browsers block cross-origin requests for local files
- The manifest.json is only for PWA features (install as app)
- PWA features only work on HTTP/HTTPS servers anyway
- All core functionality works fine without it

**To avoid the error:**
1. Run from a local web server (e.g., `python -m http.server`)
2. OR just ignore it - it doesn't affect anything

## Version Display Logic

```javascript
async function getVersion() {
    // Running locally?
    if (window.location.protocol === 'file:') {
        // Can't fetch version.txt → use fallback
        return 'v2.3.0';  // ← THIS LINE
    }
    
    // Try to fetch version.txt
    try {
        const response = await fetch('./version.txt');
        if (response.ok) {
            return (await response.text()).trim();
        }
    } catch (e) {
        // Fetch failed → use fallback
    }
    
    // Check for meta tag
    const meta = document.querySelector('meta[name="app-version"]');
    if (meta) {
        return meta.content;
    }
    
    // Last resort fallback
    return 'v2.3.0';  // ← THIS LINE
}
```

## Where Version Appears

1. **Browser Tab Title**
   - "Song Manager [v2.3.0]"
   - "Setlist Manager [v2.3.0]"

2. **Page Header**
   - Below the main title (h1)
   - Right-aligned under the title text
   - Smaller, semi-transparent text
   - Example:
     ```
     Song Manager
            v2.3.0
     ```

3. **JavaScript Access**
   ```javascript
   // Get current version
   const version = await window.BandPracticeManager.getVersion();
   console.log(version); // "v2.3.0"
   ```

## Testing Version Display

### Test Locally (file://)
1. Open any HTML file directly in browser
2. Check page title in tab → should show "[v2.3.0]"
3. Check under page heading → should show "v2.3.0"
4. Open console → should NOT show errors about version
5. **Expected:** Uses fallback from version.js

### Test on Server (http://)
1. Run `python -m http.server 8000` in project root
2. Open http://localhost:8000/song-manager.html
3. Check version display
4. **Expected:** Loads from version.txt

## Version History

- **v2.3.0** - Inline song editing, link fixes, SVG icons
- **v2.2.0** - (deprecated, rolled into v2.3.0)
- **v2.1.0** - Previous stable release
- **v2.0.0** - Performance & architecture overhaul

## Checklist for New Release

When bumping version:

- [ ] Update `version.txt`
- [ ] Update fallback in `js/version.js` (line 33)
- [ ] Update CHANGELOG.md
- [ ] Update RELEASE notes
- [ ] Test version displays correctly
- [ ] Commit with message: "Release v2.3.0"
- [ ] Tag commit: `git tag v2.3.0`
- [ ] Push with tags: `git push origin main --tags`

## Common Issues

### "Still showing old version"
**Solution:** Hard refresh (Ctrl+Shift+R) or clear browser cache

### "Version shows as undefined"
**Solution:** Check version.js is loaded (should see in Network tab)

### "CORS error prevents version loading"
**Solution:** This is expected for file:// - version.js fallback will work

### "Version doesn't match git branch"
**Solution:** Update both version.txt AND version.js fallback

## Notes

- Version format: `v{major}.{minor}.{patch}`
- Always prefix with lowercase 'v'
- Keep fallback in version.js in sync with version.txt
- The fallback is what users see when running locally
- CORS errors are cosmetic only - ignore them

