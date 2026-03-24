/**
 * Setlist Manager — shared theme + watermark (mobile menu stays in page inline script).
 * Requires js/app-shell.js first (file://).
 */
(function () {
    var S = window.BandAppShell;
    if (!S) return;
    window.changeTheme = S.changeTheme;
    window.loadTheme = function () {
        return S.loadTheme({ defaultTheme: 'grey' });
    };
    window.updateFaviconForTheme = S.updateFaviconForTheme;
    S.loadTheme({ defaultTheme: 'grey' });
    S.applyWatermarkFromStorage();
})();
