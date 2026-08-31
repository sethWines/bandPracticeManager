/**
 * Shared app shell — theme, toast, mobile menu (file:// compatible)
 */
(function (global) {
    'use strict';

    var THEME_COLORS = {
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
        synthwave: '#ff006e',
        prism: '#9d4edd'
    };

    var THEME_STORAGE_KEY = 'bandOrganizerTheme';

    function ensureToastContainer() {
        var container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    function showToast(message, type) {
        type = type || 'info';
        var container = ensureToastContainer();
        var toast = document.createElement('div');
        toast.className = 'toast ' + type;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(function () {
            toast.classList.add('hiding');
            setTimeout(function () {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 300);
        }, 3500);
    }

    function applyTheme(theme) {
        if (!theme || theme === 'grey') {
            document.body.removeAttribute('data-theme');
        } else {
            document.body.setAttribute('data-theme', theme);
        }
        localStorage.setItem(THEME_STORAGE_KEY, theme || 'grey');
        var selectors = document.querySelectorAll('#themeSelector, #mobileThemeSelector');
        selectors.forEach(function (sel) {
            if (sel && sel.value !== theme) sel.value = theme || 'grey';
        });
    }

    function changeTheme(theme) {
        applyTheme(theme);
    }

    function loadTheme() {
        var theme = localStorage.getItem(THEME_STORAGE_KEY) || 'grey';
        applyTheme(theme);
        return theme;
    }

    function getThemeColor(theme) {
        return THEME_COLORS[theme] || THEME_COLORS.grey;
    }

    function toggleMobileMenu() {
        var menu = document.getElementById('mobileMenu');
        if (!menu) return;
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    }

    function initAppShell(options) {
        options = options || {};
        loadTheme();
        if (options.activePage) {
            document.querySelectorAll('.nav-link[data-page]').forEach(function (link) {
                if (link.getAttribute('data-page') === options.activePage) {
                    link.classList.add('nav-link-active');
                }
            });
        }
    }

    global.AppShell = {
        THEME_COLORS: THEME_COLORS,
        showToast: showToast,
        applyTheme: applyTheme,
        changeTheme: changeTheme,
        loadTheme: loadTheme,
        getThemeColor: getThemeColor,
        toggleMobileMenu: toggleMobileMenu,
        initAppShell: initAppShell
    };

    if (typeof global.changeTheme !== 'function') {
        global.changeTheme = changeTheme;
    }
    if (typeof global.toggleMobileMenu !== 'function') {
        global.toggleMobileMenu = toggleMobileMenu;
    }
    if (typeof global.showToast !== 'function') {
        global.showToast = showToast;
    }
    if (typeof global.getThemeColor !== 'function') {
        global.getThemeColor = getThemeColor;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { loadTheme(); });
    } else {
        loadTheme();
    }
})(typeof window !== 'undefined' ? window : this);
