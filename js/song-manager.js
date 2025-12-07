/**
 * Song Manager Core Logic
 * Extracted from song-manager.html for better performance and maintainability
 */

import { Storage, STORAGE_KEYS } from './storage.js';
import { debounce, extractSearchTerms, matchesSearch } from './utils.js';

/**
 * Song Manager Class - Handles all song database operations
 */
export class SongManager {
    constructor() {
        this.songs = [];
        this.filteredSongs = [];
        this.searchCache = new Map();
        this.statsCache = null;
        this.currentPage = 1;
        this.rowsPerPage = 100;
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.activeFilters = {};
        this.hiddenColumns = new Set();
        
        // Debounced methods
        this.debouncedSearch = debounce(this.performSearch.bind(this), 300);
        this.debouncedFilter = debounce(this.performFilter.bind(this), 200);
        this.debouncedSave = debounce(this.saveToStorage.bind(this), 500);
    }

    /**
     * Load songs from localStorage with caching
     */
    loadSongs() {
        const startTime = performance.now();
        
        // Try primary key first, fall back to legacy
        let songs = Storage.get(STORAGE_KEYS.SONGS);
        if (!songs || songs.length === 0) {
            songs = Storage.get(STORAGE_KEYS.SONGS_LEGACY, []);
        }
        
        this.songs = songs;
        this.filteredSongs = [...this.songs];
        
        // Invalidate caches
        this.searchCache.clear();
        this.statsCache = null;
        
        const loadTime = performance.now() - startTime;
        console.log(`Loaded ${this.songs.length} songs in ${loadTime.toFixed(2)}ms`);
        
        return this.songs;
    }

    /**
     * Save songs to localStorage (debounced by default)
     * @param {boolean} immediate - If true, save immediately without debounce
     */
    saveSongs(immediate = false) {
        if (immediate) {
            this.saveToStorage();
        } else {
            this.debouncedSave();
        }
    }

    /**
     * Actual save operation
     */
    saveToStorage() {
        const startTime = performance.now();
        
        // Save to both keys for compatibility
        Storage.set(STORAGE_KEYS.SONGS, this.songs);
        Storage.set(STORAGE_KEYS.SONGS_LEGACY, this.songs);
        
        // Invalidate stats cache
        this.statsCache = null;
        
        const saveTime = performance.now() - startTime;
        if (saveTime > 100) {
            console.warn(`Slow save operation: ${saveTime.toFixed(2)}ms for ${this.songs.length} songs`);
        }
    }

    /**
     * Add a new song
     */
    addSong(songData) {
        const song = {
            id: Date.now() + Math.random(), // Unique ID
            ...songData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.songs.push(song);
        this.saveSongs();
        this.applyCurrentFilters();
        
        return song;
    }

    /**
     * Update an existing song
     */
    updateSong(songId, updates) {
        const index = this.songs.findIndex(s => s.id === songId);
        if (index === -1) return false;
        
        this.songs[index] = {
            ...this.songs[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        this.saveSongs();
        this.applyCurrentFilters();
        
        return true;
    }

    /**
     * Delete songs by IDs
     */
    deleteSongs(songIds) {
        const idsSet = new Set(songIds);
        this.songs = this.songs.filter(s => !idsSet.has(s.id));
        
        this.saveSongs(true); // Immediate save for deletes
        this.applyCurrentFilters();
    }

    /**
     * Bulk update songs
     */
    bulkUpdateSongs(songIds, updates) {
        const idsSet = new Set(songIds);
        const timestamp = new Date().toISOString();
        
        this.songs = this.songs.map(song => {
            if (idsSet.has(song.id)) {
                return {
                    ...song,
                    ...updates,
                    updatedAt: timestamp
                };
            }
            return song;
        });
        
        this.saveSongs(true);
        this.applyCurrentFilters();
    }

    /**
     * Perform search with caching
     */
    performSearch(query) {
        const startTime = performance.now();
        
        if (!query || query.trim() === '') {
            this.filteredSongs = [...this.songs];
            this.currentPage = 1;
            return this.getPagedResults();
        }
        
        // Check cache
        const cacheKey = query.toLowerCase();
        if (this.searchCache.has(cacheKey)) {
            this.filteredSongs = this.searchCache.get(cacheKey);
            this.currentPage = 1;
            return this.getPagedResults();
        }
        
        const searchTerms = extractSearchTerms(query);
        
        this.filteredSongs = this.songs.filter(song => {
            const searchText = [
                song.artist,
                song.song,
                song.album,
                song.tuning,
                song.key,
                song.firstNote,
                song.lastNote,
                song.bands,
                song.tags,
                song.link1,
                song.link2
            ].join(' ');
            
            return matchesSearch(searchText, searchTerms);
        });
        
        // Cache result
        this.searchCache.set(cacheKey, this.filteredSongs);
        
        // Limit cache size
        if (this.searchCache.size > 50) {
            const firstKey = this.searchCache.keys().next().value;
            this.searchCache.delete(firstKey);
        }
        
        this.currentPage = 1;
        
        const searchTime = performance.now() - startTime;
        console.log(`Search completed in ${searchTime.toFixed(2)}ms - ${this.filteredSongs.length} results`);
        
        return this.getPagedResults();
    }

    /**
     * Apply filters to songs
     */
    performFilter(filters) {
        this.activeFilters = filters;
        this.applyCurrentFilters();
    }

    /**
     * Apply current filters to songs
     */
    applyCurrentFilters() {
        let results = [...this.songs];
        
        // Apply each filter
        Object.keys(this.activeFilters).forEach(column => {
            const filterValue = this.activeFilters[column];
            if (filterValue && filterValue.trim() !== '') {
                results = results.filter(song => {
                    const value = String(song[column] || '').toLowerCase();
                    return value.includes(filterValue.toLowerCase());
                });
            }
        });
        
        this.filteredSongs = results;
        this.currentPage = 1;
        
        // Clear search cache as filters changed
        this.searchCache.clear();
    }

    /**
     * Sort songs by column
     */
    sortBy(column, direction = 'asc') {
        this.sortColumn = column;
        this.sortDirection = direction;
        
        this.filteredSongs.sort((a, b) => {
            let aVal = a[column] || '';
            let bVal = b[column] || '';
            
            // Handle numeric values
            if (column === 'duration') {
                aVal = this.durationToSeconds(aVal);
                bVal = this.durationToSeconds(bVal);
            }
            
            // String comparison
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }
            
            if (aVal < bVal) return direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    /**
     * Convert duration string to seconds for sorting
     */
    durationToSeconds(duration) {
        if (!duration) return 0;
        const parts = duration.split(':');
        if (parts.length === 2) {
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        }
        return 0;
    }

    /**
     * Get paginated results
     */
    getPagedResults() {
        const start = (this.currentPage - 1) * this.rowsPerPage;
        const end = start + this.rowsPerPage;
        
        return {
            songs: this.filteredSongs.slice(start, end),
            totalSongs: this.filteredSongs.length,
            totalPages: Math.ceil(this.filteredSongs.length / this.rowsPerPage),
            currentPage: this.currentPage,
            rowsPerPage: this.rowsPerPage
        };
    }

    /**
     * Set rows per page and reset to page 1
     */
    setRowsPerPage(rows) {
        this.rowsPerPage = parseInt(rows);
        this.currentPage = 1;
    }

    /**
     * Navigate to specific page
     */
    goToPage(page) {
        const totalPages = Math.ceil(this.filteredSongs.length / this.rowsPerPage);
        this.currentPage = Math.max(1, Math.min(page, totalPages));
        return this.getPagedResults();
    }

    /**
     * Get statistics (cached)
     */
    getStats() {
        if (this.statsCache) {
            return this.statsCache;
        }
        
        const startTime = performance.now();
        
        const artists = new Set();
        const bands = new Set();
        const tags = new Set();
        let totalDuration = 0;
        let songsWithDuration = 0;
        
        this.songs.forEach(song => {
            if (song.artist) artists.add(song.artist.toLowerCase());
            
            if (song.bands) {
                song.bands.split(',').forEach(b => {
                    const band = b.trim();
                    if (band) bands.add(band.toLowerCase());
                });
            }
            
            if (song.tags) {
                song.tags.split(',').forEach(t => {
                    const tag = t.trim();
                    if (tag) tags.add(tag.toLowerCase());
                });
            }
            
            if (song.duration) {
                const seconds = this.durationToSeconds(song.duration);
                if (seconds > 0) {
                    totalDuration += seconds;
                    songsWithDuration++;
                }
            }
        });
        
        const avgDuration = songsWithDuration > 0 
            ? Math.floor(totalDuration / songsWithDuration)
            : 0;
        
        const avgMinutes = Math.floor(avgDuration / 60);
        const avgSeconds = avgDuration % 60;
        
        this.statsCache = {
            totalSongs: this.songs.length,
            totalArtists: artists.size,
            totalBands: bands.size,
            totalTags: tags.size,
            avgDuration: `${avgMinutes}:${avgSeconds.toString().padStart(2, '0')}`,
            avgDurationSeconds: avgDuration
        };
        
        const statsTime = performance.now() - startTime;
        console.log(`Stats calculated in ${statsTime.toFixed(2)}ms`);
        
        return this.statsCache;
    }

    /**
     * Get unique values for a column (for filters/autocomplete)
     */
    getUniqueValues(column) {
        const values = new Set();
        this.songs.forEach(song => {
            const value = song[column];
            if (value) {
                if (column === 'bands' || column === 'tags') {
                    // Split comma-separated values
                    value.split(',').forEach(v => {
                        const trimmed = v.trim();
                        if (trimmed) values.add(trimmed);
                    });
                } else {
                    values.add(value);
                }
            }
        });
        return Array.from(values).sort();
    }

    /**
     * Export songs to CSV
     */
    exportToCSV() {
        const headers = [
            'Artist', 'Song', 'Album', 'Tuning', 'Key', 
            'First Note', 'Last Note', 'Duration', 'Bands', 'Tags',
            'Link 1', 'Link 2'
        ];
        
        const escapeCSV = (value) => {
            if (value === null || value === undefined) return '';
            const str = String(value);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };
        
        let csv = headers.join(',') + '\n';
        
        this.songs.forEach(song => {
            const row = [
                song.artist,
                song.song,
                song.album,
                song.tuning,
                song.key,
                song.firstNote,
                song.lastNote,
                song.duration,
                song.bands,
                song.tags,
                song.link1,
                song.link2
            ].map(escapeCSV);
            
            csv += row.join(',') + '\n';
        });
        
        return csv;
    }

    /**
     * Import songs from CSV
     */
    importFromCSV(csvContent) {
        const lines = csvContent.split('\n');
        const imported = [];
        const errors = [];
        
        // Skip header row
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            try {
                const fields = this.parseCSVLine(line);
                
                if (fields.length >= 2) { // At least artist and song required
                    const song = {
                        id: Date.now() + Math.random(),
                        artist: fields[0] || '',
                        song: fields[1] || '',
                        album: fields[2] || '',
                        tuning: fields[3] || '',
                        key: fields[4] || '',
                        firstNote: fields[5] || '',
                        lastNote: fields[6] || '',
                        duration: fields[7] || '',
                        bands: fields[8] || '',
                        tags: fields[9] || '',
                        link1: fields[10] || '',
                        link2: fields[11] || '',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };
                    
                    imported.push(song);
                }
            } catch (error) {
                errors.push(`Line ${i + 1}: ${error.message}`);
            }
        }
        
        if (imported.length > 0) {
            this.songs.push(...imported);
            this.saveSongs(true);
            this.applyCurrentFilters();
        }
        
        return { imported: imported.length, errors };
    }

    /**
     * Parse CSV line handling quoted fields
     */
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];
            
            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        return result;
    }

    /**
     * Clear all caches
     */
    clearCaches() {
        this.searchCache.clear();
        this.statsCache = null;
        console.log('All caches cleared');
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            searchCacheSize: this.searchCache.size,
            statsCache: this.statsCache ? 'cached' : 'empty',
            memorySongCount: this.songs.length,
            filteredCount: this.filteredSongs.length
        };
    }
}

