# Quick Reference - Performance Optimizations

## New Module APIs

### SongManager (`js/song-manager.js`)

```javascript
import { SongManager } from './js/song-manager.js';

const manager = new SongManager();

// Load songs (automatic caching)
manager.loadSongs();

// Search (debounced automatically)
manager.debouncedSearch('artist name');

// Get paginated results
const page = manager.getPagedResults();
// { songs: [...], totalSongs: 1000, currentPage: 1, totalPages: 10, rowsPerPage: 100 }

// Navigate pages
manager.goToPage(5);
manager.setRowsPerPage(50);

// CRUD operations
manager.addSong({ artist: 'Artist', song: 'Song', ... });
manager.updateSong(songId, { artist: 'New Artist' });
manager.deleteSongs([id1, id2, id3]);
manager.bulkUpdateSongs([id1, id2], { bands: 'Band Name' });

// Sort
manager.sortBy('artist', 'asc');

// Get stats (cached)
const stats = manager.getStats();
// { totalSongs, totalArtists, totalBands, avgDuration, ... }

// Export/Import
const csv = manager.exportToCSV();
const result = manager.importFromCSV(csvContent);
```

### TableRenderer (`js/table-renderer.js`)

```javascript
import { TableRenderer } from './js/table-renderer.js';

const renderer = new TableRenderer(containerElement, {
    rowHeight: 40,
    buffer: 5,
    columns: [
        {
            key: 'artist',
            label: 'Artist',
            sortable: true,
            width: '150px',
            render: (value, row) => {
                // Optional custom renderer
                return value;
            }
        },
        // ... more columns
    ],
    onRowClick: (row) => console.log('Clicked:', row),
    onRowSelect: (selectedIds) => console.log('Selected:', selectedIds),
    onSort: (column, direction) => {
        // Handle sorting
        songManager.sortBy(column, direction);
        refreshTable();
    }
});

// Set data
renderer.setData(songs);

// Get selection
const selected = renderer.getSelectedRows();

// Clear selection
renderer.clearSelection();

// Toggle column visibility
renderer.toggleColumn('album', false); // Hide
renderer.toggleColumn('album', true);  // Show

// Scroll to row
renderer.scrollToRow(42);

// Refresh display
renderer.refresh();
```

### UI Utilities (`js/ui-utils.js`)

```javascript
import { toast, loading, progress, keyboard } from './js/ui-utils.js';

// Toast notifications
toast.success('Song saved!');
toast.error('Failed to delete');
toast.warning('Please select a song');
toast.info('Tip: Use Ctrl+F to search');

// Loading overlay
loading.show('Processing...');
await doSomething();
loading.hide();

// Progress bar
progress.show('Importing Songs', 'Processing...', () => {
    // Cancel callback
    cancelled = true;
});
progress.update(50, 'Halfway done!', '50% complete');
progress.hide();

// Keyboard shortcuts
keyboard.register('Ctrl+F', () => {
    document.getElementById('search').focus();
}, 'Focus search');

keyboard.register('Ctrl+N', () => {
    openAddSongModal();
}, 'New song');
```

### Enhanced Storage (`js/storage.js`)

```javascript
import { Storage, STORAGE_KEYS } from './js/storage.js';

// Get with caching
const songs = Storage.get(STORAGE_KEYS.SONGS, []);

// Set with caching
Storage.set(STORAGE_KEYS.SONGS, songs);

// Clear cache
Storage.clearCache(STORAGE_KEYS.SONGS); // Specific key
Storage.clearCache(); // All keys

// Get storage info
const info = Storage.getStorageInfo();
// { used, usedMB, estimatedLimit, percentUsed }

// Get cache stats
const stats = Storage.getCacheStats();
// { cacheSize, cacheEnabled, keys: [...] }
```

### Performance Monitoring (`js/performance.js`)

```javascript
import { perfMonitor, enableSlowOperationLogging } from './js/performance.js';

// Enable slow operation warnings
enableSlowOperationLogging(100); // Warn if >100ms

// Measure operation
const result = await perfMonitor.measure('searchSongs', async () => {
    return await searchOperation();
});

// Get performance report
const report = perfMonitor.generateReport();
perfMonitor.logReport(); // Console output

// Start continuous monitoring
perfMonitor.startContinuousMonitoring((report) => {
    updatePerfDisplay(report);
});

// Stop monitoring
perfMonitor.stopContinuousMonitoring();

// Performance marks
perfMonitor.mark('search-start');
// ... do work
perfMonitor.mark('search-end');
perfMonitor.measureBetween('search-operation', 'search-start', 'search-end');
```

### Utilities (`js/utils.js`)

```javascript
import { debounce, throttle, escapeCSV, parseCSVLine } from './js/utils.js';

// Debounce function calls
const debouncedSearch = debounce((query) => {
    performSearch(query);
}, 300);

// Throttle scroll events
const throttledScroll = throttle(() => {
    updateScrollPosition();
}, 100);

// CSV utilities
const escaped = escapeCSV('Value with, comma');
const fields = parseCSVLine('Artist,"Song, Name",Album');
```

## Common Patterns

### Initialize Song Manager with Table

```javascript
let songManager;
let tableRenderer;

document.addEventListener('DOMContentLoaded', () => {
    // Create manager
    songManager = new SongManager();
    songManager.loadSongs();
    
    // Create table
    tableRenderer = new TableRenderer(
        document.getElementById('tableContainer'),
        {
            columns: [...],
            onSort: (col, dir) => {
                songManager.sortBy(col, dir);
                refreshTable();
            }
        }
    );
    
    // Initial render
    refreshTable();
    
    // Setup search
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', (e) => {
        songManager.debouncedSearch(e.target.value);
        setTimeout(refreshTable, 350);
    });
});

function refreshTable() {
    const page = songManager.getPagedResults();
    tableRenderer.setData(page.songs);
    updatePagination(page);
}
```

### Bulk Operations with Progress

```javascript
async function bulkDelete(songIds) {
    let cancelled = false;
    
    progress.show('Deleting Songs', 'Starting...', () => {
        cancelled = true;
    });
    
    try {
        for (let i = 0; i < songIds.length; i++) {
            if (cancelled) break;
            
            await deleteSong(songIds[i]);
            
            const percent = ((i + 1) / songIds.length) * 100;
            progress.update(
                percent,
                `Deleted ${i + 1} of ${songIds.length}`,
                `${Math.floor(percent)}% complete`
            );
        }
        
        toast.success(`Deleted ${songIds.length} songs`);
    } catch (error) {
        toast.error('Delete failed: ' + error.message);
    } finally {
        progress.hide();
        refreshTable();
    }
}
```

### CSV Import with Error Handling

```javascript
async function importCSV(file) {
    loading.show('Importing songs...');
    
    try {
        const content = await file.text();
        const result = songManager.importFromCSV(content);
        
        if (result.errors.length > 0) {
            toast.warning(`Imported ${result.imported} songs with ${result.errors.length} errors`);
            console.error('Import errors:', result.errors);
        } else {
            toast.success(`Successfully imported ${result.imported} songs!`);
        }
        
        refreshTable();
    } catch (error) {
        toast.error('Import failed: ' + error.message);
    } finally {
        loading.hide();
    }
}
```

## Performance Tips

1. **Always use debounced methods** for user input (search, filters)
2. **Batch updates** instead of multiple individual saves
3. **Use immediate save** only for critical operations (delete)
4. **Clear caches** when data structure changes significantly
5. **Monitor performance** in development with perfMonitor
6. **Set appropriate rowsPerPage** based on dataset size
7. **Use custom renderers** sparingly (they affect virtual scroll performance)
8. **Implement pagination** for datasets > 100 items

## Troubleshooting

### Table not updating after data change
```javascript
// After modifying songs
songManager.applyCurrentFilters();
refreshTable();
```

### Search results not refreshing
```javascript
// Clear search cache
songManager.searchCache.clear();
songManager.debouncedSearch(query);
```

### Performance still slow
```javascript
// Check cache status
console.log(songManager.getCacheStats());
console.log(Storage.getCacheStats());

// Enable performance monitoring
enableSlowOperationLogging(100);
perfMonitor.logReport();
```

### Virtual scrolling glitchy
```javascript
// Ensure container has height
// Check rowHeight matches actual rows
tableRenderer.options.rowHeight = 40; // Adjust if needed
tableRenderer.refresh();
```

## Migration Checklist

- [ ] Add module script tags
- [ ] Import new modules
- [ ] Replace table rendering with TableRenderer
- [ ] Replace localStorage calls with songManager
- [ ] Add pagination HTML elements
- [ ] Setup keyboard shortcuts
- [ ] Add toast container (automatic)
- [ ] Test with large dataset
- [ ] Verify mobile responsiveness
- [ ] Check browser console for errors
- [ ] Profile performance improvements

