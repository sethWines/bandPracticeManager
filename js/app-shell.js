/**
 * Shared app chrome: theme on document, favicon, mobile menu, watermark classes.
 * Classic script for file:// — load before page scripts. API: window.BandAppShell + exposeShellOnWindow().
 */
(function (window) {
    'use strict';

    /** URL-encoded stroke for favicons — matches legacy HTML (grey uses red accent for icon) */
    var FAVICON_THEME_COLORS = {
        grey: '%23d84315',
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

    function getStoredTheme(defaultTheme) {
        defaultTheme = defaultTheme === undefined ? 'grey' : defaultTheme;
        return localStorage.getItem('bandOrganizerTheme') || defaultTheme;
    }

    function applyThemeToDocument(theme) {
        var root = document.documentElement;
        var body = document.body;
        if (theme === 'grey') {
            root.removeAttribute('data-theme');
            if (body) body.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', theme);
            if (body) body.setAttribute('data-theme', theme);
        }
        localStorage.setItem('bandOrganizerTheme', theme);
    }

    function syncThemeSelectors(theme) {
        var desktopSelector = document.getElementById('themeSelector');
        var mobileSelector = document.getElementById('mobileThemeSelector');
        if (desktopSelector) desktopSelector.value = theme;
        if (mobileSelector) mobileSelector.value = theme;
    }

    function updateFaviconForTheme(theme) {
        var link = document.querySelector("link[rel*='icon']");
        if (!link) return;

        var color = FAVICON_THEME_COLORS[theme] || '%23d84315';
        var watermarkType = localStorage.getItem('watermark') || 'guitar';

        if (watermarkType === 'drum') {
            link.href = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 24' preserveAspectRatio='xMidYMid meet'><g transform='scale(1.4) translate(-2, -2)'><circle cx='23' cy='17' r='4.5' fill='none' stroke='" + color + "' stroke-width='2.5'/><line x1='16' y1='21.5' x2='16' y2='2' stroke='" + color + "' stroke-width='2.5' stroke-linecap='round'/><line x1='11' y1='5' x2='21' y2='5' stroke='" + color + "' stroke-width='2.5' stroke-linecap='round'/><line x1='18' y1='8' x2='28' y2='8' stroke='" + color + "' stroke-width='2.5' stroke-linecap='round'/><line x1='21' y1='10' x2='26' y2='10' stroke='" + color + "' stroke-width='2.5' stroke-linecap='round'/><line x1='7' y1='12.5' x2='18' y2='12.5' stroke='" + color + "' stroke-width='2.5' stroke-linecap='round'/><line x1='30' y1='12.5' x2='30' y2='2' stroke='" + color + "' stroke-width='2.5' stroke-linecap='round'/><line x1='25' y1='5' x2='35' y2='5' stroke='" + color + "' stroke-width='2.5' stroke-linecap='round'/><line x1='27' y1='8' x2='33' y2='8' stroke='" + color + "' stroke-width='2.5' stroke-linecap='round'/><line x1='26' y1='14' x2='31' y2='14' stroke='" + color + "' stroke-width='2.5' stroke-linecap='round'/></g></svg>";
        } else if (watermarkType === 'blackdoubt') {
            link.href = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40' fill='none' stroke='" + color + "' stroke-width='2' stroke-linecap='round'><path d='M 20 3 L 37 20 L 20 37 L 3 20 Z' stroke='" + color + "' fill='none' stroke-width='2'/><circle cx='20' cy='20' r='13' stroke='" + color + "' fill='none' stroke-width='2'/><text x='20' y='20' font-size='20' font-family='serif' text-anchor='middle' dominant-baseline='central' fill='" + color + "' stroke='none'>𝔅</text></svg>";
        } else {
            link.href = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='" + color + "' stroke-width='2.5' stroke-linecap='round'><circle cx='12' cy='17' r='4.5'/><line x1='12' y1='12.5' x2='12' y2='2'/><line x1='9' y1='5' x2='15' y2='5'/><line x1='9' y1='8' x2='15' y2='8'/></svg>";
        }
    }

    function loadTheme(options) {
        options = options || {};
        var defaultTheme = options.defaultTheme !== undefined ? options.defaultTheme : 'grey';
        var theme = getStoredTheme(defaultTheme);
        applyThemeToDocument(theme);
        syncThemeSelectors(theme);
        updateFaviconForTheme(theme);
        return theme;
    }

    function changeTheme(theme) {
        applyThemeToDocument(theme);
        syncThemeSelectors(theme);
        updateFaviconForTheme(theme);
    }

    function toggleMobileMenu() {
        var menu = document.getElementById('mobileMenu');
        if (menu) menu.classList.toggle('active');
    }

    function applyWatermarkFromStorage() {
        if (!document.body || document.body.classList.contains('bpm-no-shell-watermark')) return;
        var type = localStorage.getItem('watermark') || 'guitar';
        document.body.classList.remove('drum-watermark', 'blackdoubt-watermark');
        if (type === 'drum') document.body.classList.add('drum-watermark');
        else if (type === 'blackdoubt') document.body.classList.add('blackdoubt-watermark');
    }

    function exposeShellOnWindow() {
        window.changeTheme = changeTheme;
        window.toggleMobileMenu = toggleMobileMenu;
        window.loadTheme = loadTheme;
        window.updateFaviconForTheme = updateFaviconForTheme;
        window.applyWatermarkFromStorage = applyWatermarkFromStorage;
    }

    window.BandAppShell = {
        getStoredTheme: getStoredTheme,
        applyThemeToDocument: applyThemeToDocument,
        syncThemeSelectors: syncThemeSelectors,
        updateFaviconForTheme: updateFaviconForTheme,
        loadTheme: loadTheme,
        changeTheme: changeTheme,
        toggleMobileMenu: toggleMobileMenu,
        applyWatermarkFromStorage: applyWatermarkFromStorage,
        exposeShellOnWindow: exposeShellOnWindow
    };
})(typeof window !== 'undefined' ? window : this);
