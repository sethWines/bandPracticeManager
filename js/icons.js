/**
 * SVG Icon utilities for Band Manager
 * Provides consistent icon rendering across the application
 */

/**
 * Create SVG icon element
 * @param {string} pathData - SVG path data
 * @param {number} size - Icon size in pixels
 * @param {string} color - Icon color (default: currentColor)
 * @returns {string} SVG HTML string
 */
export function createIcon(pathData, size = 24, color = 'currentColor') {
    return `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="${pathData}" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
}

/**
 * Guitar icon SVG
 * @param {number} size - Icon size
 * @param {string} color - Icon color
 * @returns {string} Guitar icon HTML
 */
export function guitarIcon(size = 60, color = 'var(--primary-color)') {
    return `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="17" r="4.5" stroke="${color}" stroke-width="2" fill="none"/>
            <line x1="12" y1="12.5" x2="12" y2="2" stroke="${color}" stroke-width="2"/>
            <line x1="9" y1="5" x2="15" y2="5" stroke="${color}" stroke-width="2"/>
            <line x1="9" y1="8" x2="15" y2="8" stroke="${color}" stroke-width="2"/>
        </svg>
    `;
}

/**
 * Drum icon SVG
 * @param {number} width - Icon width
 * @param {number} height - Icon height
 * @param {string} color - Icon color
 * @returns {string} Drum icon HTML
 */
export function drumIcon(width = 60, height = 60, color = 'var(--primary-color)') {
    return `
        <svg width="${width}" height="${height}" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="15" cy="14" r="4.5" stroke="${color}" stroke-width="1.5" fill="none"/>
            <line x1="15" y1="18.5" x2="15" y2="24" stroke="${color}" stroke-width="1.5"/>
            <line x1="10" y1="10" x2="5" y2="10" stroke="${color}" stroke-width="1.5"/>
            <line x1="20" y1="12" x2="28" y2="8" stroke="${color}" stroke-width="1.5"/>
            <line x1="30" y1="2" x2="30" y2="24" stroke="${color}" stroke-width="1.5"/>
            <line x1="28" y1="4" x2="32" y2="4" stroke="${color}" stroke-width="1.5"/>
            <line x1="27" y1="8" x2="33" y2="8" stroke="${color}" stroke-width="1.5"/>
            <line x1="22" y1="16" x2="26" y2="16" stroke="${color}" stroke-width="1.5"/>
        </svg>
    `;
}

/**
 * Common UI icons
 */
export const ICONS = {
    // Actions
    ADD: 'M12 5v14m-7-7h14',
    EDIT: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
    DELETE: 'M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
    CLOSE: 'M18 6L6 18M6 6l12 12',
    SAVE: 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z',
    
    // File operations
    UPLOAD: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m14-7l-5-5m0 0L7 8m5-5v12',
    DOWNLOAD: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4 -7l5 5m0 0l5-5m-5 5V3',
    FILE: 'M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z',
    
    // UI controls
    FILTER: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
    SEARCH: 'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z',
    SETTINGS: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    EYE: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z',
    EYE_OFF: 'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24',
    
    // Navigation
    LINK: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71',
    CHECK: 'M20 6L9 17l-5-5',
    CHEVRON_DOWN: 'M6 9l6 6 6-6',
    CHEVRON_UP: 'M18 15l-6-6-6 6',
    
    // Media
    PLAY: 'M5 3l14 9-14 9V3z',
    PAUSE: 'M10 4H6v16h4V4zM18 4h-4v16h4V4z',
    MUSIC: 'M9 18V5l12-2v13',
    
    // Special
    TRASH: 'M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
    COPY: 'M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.242a2 2 0 0 0-.602-1.43L16.083 2.57A2 2 0 0 0 14.685 2H10a2 2 0 0 0-2 2z',
    COLUMNS: 'M12 3v18m9-9H3'
};

/**
 * Render an icon from the ICONS collection
 * @param {string} iconName - Name of icon from ICONS
 * @param {number} size - Icon size
 * @param {string} color - Icon color
 * @returns {string} SVG HTML string
 */
export function getIcon(iconName, size = 24, color = 'currentColor') {
    const pathData = ICONS[iconName.toUpperCase()];
    if (!pathData) {
        console.warn(`Icon "${iconName}" not found`);
        return '';
    }
    return createIcon(pathData, size, color);
}

/**
 * Create a clickable icon button
 * @param {string} iconName - Name of icon
 * @param {string} title - Tooltip text
 * @param {string} onClick - Click handler
 * @param {string} className - Additional CSS classes
 * @returns {string} Button HTML
 */
export function iconButton(iconName, title, onClick, className = '') {
    const icon = getIcon(iconName, 20);
    return `
        <button class="icon-btn ${className}" 
                title="${title}" 
                onclick="${onClick}"
                aria-label="${title}">
            ${icon}
        </button>
    `;
}

