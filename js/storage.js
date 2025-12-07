/**
 * LocalStorage utility functions for Band Manager with caching
 */

// In-memory cache to reduce localStorage reads
const memoryCache = new Map();
let cacheEnabled = true;

export const Storage = {
    /**
     * Get data from localStorage (with caching)
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*} Parsed data or default value
     */
    get(key, defaultValue = null) {
        try {
            // Check memory cache first
            if (cacheEnabled && memoryCache.has(key)) {
                return memoryCache.get(key);
            }
            
            const item = localStorage.getItem(key);
            const value = item ? JSON.parse(item) : defaultValue;
            
            // Cache the result
            if (cacheEnabled && value !== null) {
                memoryCache.set(key, value);
            }
            
            return value;
        } catch (error) {
            console.error(`Error reading from localStorage (${key}):`, error);
            return defaultValue;
        }
    },

    /**
     * Save data to localStorage (updates cache)
     * @param {string} key - Storage key
     * @param {*} value - Data to save
     * @returns {boolean} Success status
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            
            // Update cache
            if (cacheEnabled) {
                memoryCache.set(key, value);
            }
            
            return true;
        } catch (error) {
            console.error(`Error writing to localStorage (${key}):`, error);
            
            // Check if quota exceeded
            if (error.name === 'QuotaExceededError') {
                console.warn('LocalStorage quota exceeded. Consider clearing old data.');
            }
            
            return false;
        }
    },

    /**
     * Remove item from localStorage (clears cache)
     * @param {string} key - Storage key
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            memoryCache.delete(key);
        } catch (error) {
            console.error(`Error removing from localStorage (${key}):`, error);
        }
    },

    /**
     * Clear all localStorage (clears cache)
     */
    clear() {
        try {
            localStorage.clear();
            memoryCache.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    },

    /**
     * Clear memory cache for a specific key
     * @param {string} key - Storage key
     */
    clearCache(key) {
        if (key) {
            memoryCache.delete(key);
        } else {
            memoryCache.clear();
        }
    },

    /**
     * Enable/disable caching
     * @param {boolean} enabled - Whether to enable caching
     */
    setCacheEnabled(enabled) {
        cacheEnabled = enabled;
        if (!enabled) {
            memoryCache.clear();
        }
    },

    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            cacheSize: memoryCache.size,
            cacheEnabled,
            keys: Array.from(memoryCache.keys())
        };
    },

    /**
     * Get storage usage info
     */
    getStorageInfo() {
        let totalSize = 0;
        
        try {
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    const item = localStorage.getItem(key);
                    if (item) {
                        totalSize += item.length + key.length;
                    }
                }
            }
        } catch (error) {
            console.error('Error calculating storage size:', error);
        }
        
        return {
            used: totalSize,
            usedMB: (totalSize / 1024 / 1024).toFixed(2),
            estimatedLimit: 5 * 1024 * 1024, // Typical 5MB limit
            percentUsed: ((totalSize / (5 * 1024 * 1024)) * 100).toFixed(1)
        };
    }
};

// Storage keys used across the application
export const STORAGE_KEYS = {
    // Primary data
    SONGS: 'songDatabase',              // Main song database (also uses 'bandSongs' for backup)
    SONGS_LEGACY: 'bandSongs',          // Legacy key for backward compatibility
    SETLISTS: 'bandSetlists',           // Setlist data
    TRASH: 'songTrash',                 // Deleted songs trash
    TRASH_LEGACY: 'bandSongsTrash',     // Legacy trash key
    
    // UI preferences
    THEME: 'bandOrganizerTheme',        // Active theme name
    WATERMARK: 'watermark',             // Watermark preference (guitar/drum)
    COLUMN_VISIBILITY: 'hiddenColumns', // Hidden table columns
    TABLE_DENSITY: 'tableDensity',      // Table row density
    COLUMN_WIDTHS: 'columnWidths',      // Custom column widths
    
    // Features
    SAVED_FILTERS: 'savedFilters',      // Saved filter presets
    STATS_PREFERENCES: 'statsPreferences', // Statistics display preferences
    EDIT_SONG_SEARCH: 'editSongSearch', // Temporary cross-page song search
    CHORD_CHART_AUTOSAVE: 'chordChartAutosave' // Temporary save during editing
};

