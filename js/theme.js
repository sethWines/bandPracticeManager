/**
 * Theme management for Band Manager
 */

import { Storage, STORAGE_KEYS } from './storage.js';

export const THEMES = {
    GREY: 'grey',
    RED: 'red',
    BLUE: 'blue',
    GREEN: 'green',
    PURPLE: 'purple',
    CYAN: 'cyan',
    AMBER: 'amber',
    PINK: 'pink',
    TEAL: 'teal',
    COPPER: 'copper',
    SUNRISE: 'sunrise',
    SUNSET: 'sunset',
    SYNTHWAVE: 'synthwave',
    PRISM: 'prism'
};

/** Must match every `[data-theme="..."]` block in css/themes.css and HTML <select> options */
export const THEME_COLORS = {
    grey: '#6b7280',
    red: '#d84315',
    blue: '#1976d2',
    green: '#388e3c',
    purple: '#7b1fa2',
    cyan: '#00838f',
    amber: '#f57c00',
    pink: '#c2185b',
    teal: '#14b8a6',
    copper: '#b87333',
    sunrise: '#ffb700',
    sunset: '#ff8c00',
    synthwave: '#a78bfa',
    prism: '#14b8a6'
};

/** URL-encoded stroke color for dynamic favicon SVG (leading %23) */
export const THEME_COLOR_FAVICON_ENCODED = {
    grey: '%236b7280',
    red: '%23d84315',
    blue: '%231976d2',
    green: '%23388e3c',
    purple: '%237b1fa2',
    cyan: '%2300838f',
    amber: '%23f57c00',
    pink: '%23c2185b',
    teal: '%2314b8a6',
    copper: '%23b87333',
    sunrise: '%23ffb700',
    sunset: '%23ff8c00',
    synthwave: '%23a78bfa',
    prism: '%2314b8a6'
};

/**
 * Load and apply saved theme
 */
export function loadTheme() {
    const theme = Storage.get(STORAGE_KEYS.THEME, THEMES.GREY);
    applyTheme(theme);
    return theme;
}

/**
 * Apply theme to document
 * @param {string} theme - Theme name
 */
export function applyTheme(theme) {
    const root = document.documentElement;
    const body = document.body;
    if (theme === THEMES.GREY) {
        root.removeAttribute('data-theme');
        if (body) body.removeAttribute('data-theme');
    } else {
        root.setAttribute('data-theme', theme);
        if (body) body.setAttribute('data-theme', theme);
    }
    Storage.set(STORAGE_KEYS.THEME, theme);
}

/**
 * Get hex color for theme
 * @param {string} theme - Theme name
 * @returns {string} Hex color code
 */
export function getThemeColor(theme) {
    return THEME_COLORS[theme] || THEME_COLORS.grey;
}

