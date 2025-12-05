/**
 * Chord Chart utilities for Band Manager
 */

export const COMPONENT_TYPES = {
    INTRO: 'Intro',
    VERSE: 'Verse',
    CHORUS: 'Chorus',
    PRE_CHORUS: 'Pre-Chorus',
    BRIDGE: 'Bridge',
    SOLO: 'Solo',
    INTERLUDE: 'Interlude',
    OUTRO: 'Outro',
    TAG: 'Tag/Coda'
};

export const ChordChartManager = {
    /**
     * Parse chords from text (both inline [C] and separate line formats)
     * @param {string} text - Text containing chords
     * @returns {Array} Array of chord objects with positions
     */
    parseChords(text) {
        const chords = [];
        // Match [chord] patterns
        const regex = /\[([^\]]+)\]/g;
        let match;
        
        while ((match = regex.exec(text)) !== null) {
            chords.push({
                chord: match[1],
                position: match.index,
                length: match[0].length
            });
        }
        
        return chords;
    },

    /**
     * Extract plain lyrics (remove chord markers)
     * @param {string} text - Text with chord markers
     * @returns {string} Plain text without chord markers
     */
    extractLyrics(text) {
        return text.replace(/\[([^\]]+)\]/g, '');
    },

    /**
     * Format chord line to position chords above lyrics
     * @param {string} lyrics - Lyric line
     * @param {string} chordLine - Line containing chords
     * @returns {Object} Object with chord and lyric lines
     */
    formatChordLine(lyrics, chordLine) {
        return {
            chords: chordLine.trim(),
            lyrics: lyrics.trim()
        };
    },

    /**
     * Convert inline chords to separate chord line
     * @param {string} text - Text with inline [C] chords
     * @returns {Object} Object with separate chord and lyric lines
     */
    inlineToChordLine(text) {
        const chords = this.parseChords(text);
        const lyrics = this.extractLyrics(text);
        
        if (chords.length === 0) {
            return { chords: '', lyrics: lyrics };
        }
        
        // Build chord line with proper spacing
        let chordLine = '';
        let lastPos = 0;
        
        chords.forEach(chord => {
            // Calculate position in lyrics (accounting for removed brackets)
            const lyricsPos = chord.position - (chordLine.length);
            const spaces = Math.max(0, lyricsPos - lastPos);
            chordLine += ' '.repeat(spaces) + chord.chord;
            lastPos = lyricsPos + chord.chord.length;
        });
        
        return {
            chords: chordLine,
            lyrics: lyrics
        };
    },

    /**
     * Auto-number components by type
     * @param {Array} components - Array of component objects
     * @returns {Array} Components with updated numbering
     */
    autoNumber(components) {
        const counts = {};
        
        // First pass: count each type
        components.forEach(comp => {
            counts[comp.type] = (counts[comp.type] || 0) + 1;
        });
        
        // Second pass: assign numbers
        const currentCounts = {};
        
        return components.map(comp => {
            const type = comp.type;
            const totalOfType = counts[type];
            
            currentCounts[type] = (currentCounts[type] || 0) + 1;
            const number = currentCounts[type];
            
            // Only add number if there are multiple of this type
            const displayName = totalOfType > 1 
                ? `${type} ${number}` 
                : type;
            
            return {
                ...comp,
                displayName,
                number: totalOfType > 1 ? number : null
            };
        });
    },

    /**
     * Generate print-ready HTML for chord chart
     * @param {Object} chart - Chart data with components
     * @param {Object} song - Song metadata
     * @param {Object} options - Print options (fontSize, scaleToFit)
     * @returns {string} HTML string for printing
     */
    generatePrintView(chart, song, options = {}) {
        const { fontSize = 14, scaleToFit = false } = options;
        
        let html = `
            <div class="print-container" style="font-size: ${fontSize}px;">
                <div class="print-header">
                    <h1>${song.song}</h1>
                    <h2>${song.artist}</h2>
                    <div class="print-meta">
                        ${song.key ? `<span>Key: ${song.key}</span>` : ''}
                        ${song.tuning ? `<span>Tuning: ${song.tuning}</span>` : ''}
                        ${song.duration ? `<span>Duration: ${song.duration}</span>` : ''}
                    </div>
                </div>
                <div class="print-body">
        `;
        
        chart.components.forEach(comp => {
            html += `
                <div class="print-component">
                    <h3>${comp.displayName}</h3>
                    <div class="print-lyrics">
            `;
            
            const lines = comp.lyrics.split('\n');
            lines.forEach(line => {
                if (line.trim()) {
                    // Check if line has inline chords
                    if (line.includes('[')) {
                        const formatted = this.inlineToChordLine(line);
                        if (formatted.chords) {
                            html += `<div class="chord-line">${formatted.chords}</div>`;
                        }
                        html += `<div class="lyric-line">${formatted.lyrics}</div>`;
                    } else {
                        html += `<div class="lyric-line">${line}</div>`;
                    }
                }
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
        
        return html;
    },

    /**
     * Validate chart data structure
     * @param {Object} chart - Chart data to validate
     * @returns {Object} Validation result with isValid and errors
     */
    validateChart(chart) {
        const errors = [];
        
        if (!chart) {
            return { isValid: false, errors: ['Chart data is null or undefined'] };
        }
        
        if (!Array.isArray(chart.components)) {
            errors.push('Chart must have a components array');
        }
        
        if (chart.components) {
            chart.components.forEach((comp, idx) => {
                if (!comp.type) {
                    errors.push(`Component ${idx} missing type`);
                }
                if (!Object.values(COMPONENT_TYPES).includes(comp.type)) {
                    errors.push(`Component ${idx} has invalid type: ${comp.type}`);
                }
                if (typeof comp.lyrics !== 'string') {
                    errors.push(`Component ${idx} lyrics must be a string`);
                }
            });
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    },

    /**
     * Create a new empty component
     * @param {string} type - Component type
     * @returns {Object} New component object
     */
    createComponent(type) {
        return {
            id: Date.now() + Math.random(), // Unique ID
            type: type,
            displayName: type,
            lyrics: '',
            number: null
        };
    },

    /**
     * Create a new empty chart
     * @returns {Object} New chart object
     */
    createEmptyChart() {
        return {
            components: [],
            settings: {
                defaultChordFormat: 'inline', // 'inline' or 'separate'
                showChordDiagrams: false,
                fontSize: 14
            }
        };
    }
};

