/**
 * Utility functions for Band Manager
 */

/**
 * Escape CSV field value
 * @param {string} value - Field value
 * @returns {string} Escaped value
 */
export function escapeCSV(value) {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

/**
 * Parse CSV line handling quoted fields
 * @param {string} line - CSV line
 * @returns {Array} Parsed fields
 */
export function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                current += '"';
                i++; // Skip next quote
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
 * Download file
 * @param {string} content - File content
 * @param {string} filename - File name
 * @param {string} mimeType - MIME type
 */
export function downloadFile(content, filename, mimeType = 'text/csv') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Format date for filename
 * @returns {string} Formatted date (YYYY-MM-DD)
 */
export function getDateString() {
    return new Date().toISOString().slice(0, 10);
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function - ensures function is called at most once per interval
 * @param {Function} func - Function to throttle
 * @param {number} limit - Minimum time between calls in ms
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Show modal
 * @param {string} modalId - Modal element ID
 */
export function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Hide modal
 * @param {string} modalId - Modal element ID
 */
export function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

/**
 * Search filter - check if text matches search terms
 * @param {string} text - Text to search
 * @param {Array} searchTerms - Array of search terms
 * @returns {boolean} Whether text matches all terms
 */
export function matchesSearch(text, searchTerms) {
    if (!searchTerms || searchTerms.length === 0) return true;
    const lowerText = (text || '').toLowerCase();
    return searchTerms.every(term => lowerText.includes(term.toLowerCase()));
}

/**
 * Extract search terms from search query (handles quoted phrases)
 * @param {string} query - Search query
 * @returns {Array} Array of search terms
 */
export function extractSearchTerms(query) {
    if (!query) return [];
    
    const terms = [];
    const quotedPhrases = query.match(/"([^"]*)"/g) || [];
    
    // Extract quoted phrases
    quotedPhrases.forEach(phrase => {
        terms.push(phrase.replace(/"/g, ''));
    });
    
    // Remove quoted phrases from query and split remaining words
    let remaining = query;
    quotedPhrases.forEach(phrase => {
        remaining = remaining.replace(phrase, '');
    });
    
    const words = remaining.trim().split(/\s+/).filter(w => w);
    terms.push(...words);
    
    return terms;
}

