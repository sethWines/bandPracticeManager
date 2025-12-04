/**
 * LocalStorage utility functions for Band Manager
 */

export const Storage = {
    /**
     * Get data from localStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*} Parsed data or default value
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error reading from localStorage (${key}):`, error);
            return defaultValue;
        }
    },

    /**
     * Save data to localStorage
     * @param {string} key - Storage key
     * @param {*} value - Data to save
     * @returns {boolean} Success status
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error writing to localStorage (${key}):`, error);
            return false;
        }
    },

    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing from localStorage (${key}):`, error);
        }
    },

    /**
     * Clear all localStorage
     */
    clear() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
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
    EDIT_SONG_SEARCH: 'editSongSearch'  // Temporary cross-page song search
};

