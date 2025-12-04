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
    TEAL: 'teal'
};

export const THEME_COLORS = {
    grey: '#6b7280',
    red: '#d84315',
    blue: '#1976d2',
    green: '#388e3c',
    purple: '#7b1fa2',
    cyan: '#00838f',
    amber: '#f57c00',
    pink: '#c2185b',
    teal: '#14b8a6'
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
    if (theme === THEMES.GREY) {
        document.body.removeAttribute('data-theme');
    } else {
        document.body.setAttribute('data-theme', theme);
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

