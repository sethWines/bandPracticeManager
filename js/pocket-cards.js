/**
 * Pocket card printing for setlists (file:// compatible)
 * One or more cards per set — two-column song layout, continuation cards when needed.
 */
(function (global) {
    'use strict';

    var CARD_SIZES = {
        wallet: { width: '3.5in', height: '2in', label: 'Wallet / Business (3.5 × 2 in)' },
        credit: { width: '3.375in', height: '2.125in', label: 'Credit Card (3.375 × 2.125 in)' }
    };

    // Approximate songs per card (two columns); tuned for print card height
    var PAGE_CAPACITY = {
        wallet: { withArtist: 14, withoutArtist: 18 },
        credit: { withArtist: 16, withoutArtist: 20 }
    };

    function escapeHtml(value) {
        if (global.SongData && global.SongData.escapeHtml) {
            return global.SongData.escapeHtml(value);
        }
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function getThemeColor() {
        if (global.AppShell && global.AppShell.getThemeColor) {
            var theme = document.body.getAttribute('data-theme') || 'grey';
            return global.AppShell.getThemeColor(theme);
        }
        return '#d84315';
    }

    function getSetCards(setlist) {
        var sets = setlist.sets || [{ name: 'Set', songs: setlist.songs || [] }];
        return sets.map(function (set, setIdx) {
            return {
                setName: set.name || ('Set ' + (setIdx + 1)),
                setIndex: setIdx + 1,
                setlistName: setlist.name || '',
                band: setlist.band || '',
                songs: (set.songs || []).map(function (song, songIdx) {
                    return {
                        song: song.song || '',
                        artist: song.artist || '',
                        position: songIdx + 1
                    };
                })
            };
        });
    }

    function getPageCapacity(sizeKey, showArtist) {
        var size = PAGE_CAPACITY[sizeKey] || PAGE_CAPACITY.wallet;
        return showArtist !== false ? size.withArtist : size.withoutArtist;
    }

    function paginateSet(setCard, options, sizeKey) {
        var capacity = getPageCapacity(sizeKey || 'wallet', options.showArtist);
        var songs = setCard.songs || [];
        if (!songs.length) {
            return [];
        }

        var pages = [];
        for (var i = 0; i < songs.length; i += capacity) {
            pages.push({
                setName: setCard.setName,
                setIndex: setCard.setIndex,
                setlistName: setCard.setlistName,
                band: setCard.band,
                songs: songs.slice(i, i + capacity),
                pageIndex: 0,
                pageTotal: 0
            });
        }

        var total = pages.length;
        pages.forEach(function (page, idx) {
            page.pageIndex = idx + 1;
            page.pageTotal = total;
        });
        return pages;
    }

    function buildPrintPages(setlist, options) {
        options = options || {};
        var sizeKey = options.size || 'wallet';
        var pages = [];
        getSetCards(setlist).forEach(function (setCard) {
            if (!setCard.songs.length) {
                return;
            }
            paginateSet(setCard, options, sizeKey).forEach(function (page) {
                pages.push(page);
            });
        });
        return pages;
    }

    function getSongCountClass(count) {
        if (count <= 4) return 'songs-few';
        if (count <= 8) return 'songs-medium';
        return 'songs-many';
    }

    function buildHeaderHtml(page, options) {
        options = options || {};
        var showContext = options.showContext !== false;
        var continuation = page.pageTotal > 1
            ? '<span class="card-continuation">' + page.pageIndex + '/' + page.pageTotal + '</span>'
            : '';

        var header = '<div class="card-header card-header-subtle">' +
            '<div class="card-header-row">' +
            '<span class="card-set-name">' + escapeHtml(page.setName) + '</span>' +
            continuation +
            '</div>';

        if (showContext && (page.setlistName || page.band)) {
            header += '<div class="card-context">' + escapeHtml(page.setlistName) +
                (page.band ? ' · ' + escapeHtml(page.band) : '') + '</div>';
        }

        header += '</div>';
        return header;
    }

    function buildSongItemHtml(s, showArtist) {
        return '<li class="card-song-item">' +
            '<span class="card-song-num">' + s.position + '.</span>' +
            '<span class="card-song-body">' +
            '<span class="card-song">' + escapeHtml(s.song) + '</span>' +
            (showArtist && s.artist ? '<span class="card-artist">' + escapeHtml(s.artist) + '</span>' : '') +
            '</span></li>';
    }

    function buildPageInnerHtml(page, options) {
        options = options || {};
        var showArtist = options.showArtist !== false;
        var songCountClass = getSongCountClass(page.songs.length);
        var header = buildHeaderHtml(page, options);

        if (!page.songs.length) {
            return header + '<div class="card-empty">No songs in this set</div>';
        }

        var songsHtml = page.songs.map(function (s) {
            return buildSongItemHtml(s, showArtist);
        }).join('');

        return header +
            '<ol class="card-song-list card-song-list-cols ' + songCountClass + '">' + songsHtml + '</ol>';
    }

    function getSamplePrintPage(setlist, options) {
        options = options || {};
        var pages = buildPrintPages(setlist, options);
        if (pages.length) {
            return pages[0];
        }

        return {
            setName: '1st Set',
            setIndex: 1,
            setlistName: setlist && setlist.name ? setlist.name : 'Setlist Name',
            band: setlist && setlist.band ? setlist.band : 'Band Name',
            songs: [
                { song: 'Song Title', artist: 'Artist Name', position: 1 },
                { song: 'Another Song', artist: 'Artist Name', position: 2 },
                { song: 'Third Song', artist: 'Artist Name', position: 3 },
                { song: 'Fourth Song', artist: 'Artist Name', position: 4 }
            ],
            pageIndex: 1,
            pageTotal: 1
        };
    }

    function getSampleSetCard(setlist) {
        var cards = getSetCards(setlist);
        var withSongs = cards.filter(function (c) { return c.songs.length > 0; });
        return withSongs[0] || cards[0] || getSamplePrintPage(setlist, {});
    }

    function getCardStyles(themeColor) {
        return (
            '@page { size: letter; margin: 0.25in; }' +
            '* { box-sizing: border-box; }' +
            'body { margin: 0; padding: 0.25in; font-family: Arial, Helvetica, sans-serif; color: #111; background: #fff; }' +
            '.cards-grid { display: flex; flex-wrap: wrap; gap: 0.12in; align-content: flex-start; }' +
            '.pocket-card, .pocket-card-preview { border: 1px solid #333; border-radius: 0.08in;' +
            ' display: flex; flex-direction: column; justify-content: flex-start; align-items: stretch;' +
            ' text-align: left; page-break-inside: avoid; overflow: hidden;' +
            ' box-shadow: inset 0 0 0 2px ' + themeColor + '22; }' +
            '.card-header-subtle { flex-shrink: 0; padding-bottom: 0.03in; margin-bottom: 0.03in; border-bottom: 1px solid #e8e8e8; }' +
            '.card-header-row { display: flex; align-items: baseline; justify-content: space-between; gap: 0.06in; }' +
            '.card-set-name { font-size: 6.5pt; font-weight: 600; color: #444; line-height: 1.15; letter-spacing: 0.02em; }' +
            '.card-continuation { font-size: 5.5pt; color: #aaa; font-weight: 500; white-space: nowrap; flex-shrink: 0; }' +
            '.card-context { font-size: 5pt; color: #aaa; margin-top: 0.015in; line-height: 1.15; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 400; }' +
            '.card-song-list { list-style: none; margin: 0; padding: 0; flex: 1; overflow: hidden; }' +
            '.card-song-list-cols { column-count: 2; column-gap: 0.08in; column-fill: auto; }' +
            '.card-song-item { display: flex; align-items: flex-start; gap: 0.03in; margin-bottom: 0.012in; line-height: 1.05; break-inside: avoid; -webkit-column-break-inside: avoid; page-break-inside: avoid; }' +
            '.card-song-num { font-size: 5pt; color: #aaa; min-width: 0.12in; flex-shrink: 0; padding-top: 0.006in; }' +
            '.card-song-body { display: flex; flex-direction: column; min-width: 0; flex: 1; }' +
            '.songs-few .card-song { font-size: 7.5pt; font-weight: 800; color: #000; word-wrap: break-word; overflow-wrap: anywhere; }' +
            '.songs-few .card-artist { font-size: 5pt; color: #555; margin-top: 0.004in; line-height: 1.05; }' +
            '.songs-medium .card-song { font-size: 6.5pt; font-weight: 800; color: #000; word-wrap: break-word; overflow-wrap: anywhere; }' +
            '.songs-medium .card-artist { font-size: 4.75pt; color: #555; margin-top: 0.002in; line-height: 1.05; }' +
            '.songs-many .card-song { font-size: 5.75pt; font-weight: 800; color: #000; word-wrap: break-word; overflow-wrap: anywhere; }' +
            '.songs-many .card-artist { font-size: 4.5pt; color: #555; line-height: 1.05; }' +
            '.card-empty { font-size: 7pt; color: #999; font-style: italic; text-align: center; padding: 0.08in 0; }' +
            '@media print { body { padding: 0; } .pocket-card { box-shadow: none; } }'
        );
    }

    function renderPreviewHtml(setlist, options) {
        options = options || {};
        var sizeKey = options.size || 'wallet';
        var themeColor = getThemeColor();
        var page = getSamplePrintPage(setlist || {
            name: 'Setlist',
            band: 'Band',
            sets: [{
                name: '1st Set',
                songs: [
                    { song: 'Song Title', artist: 'Artist Name' },
                    { song: 'Another Song', artist: 'Artist Name' },
                    { song: 'Third Song', artist: 'Artist Name' },
                    { song: 'Fourth Song', artist: 'Artist Name' }
                ]
            }]
        }, options);
        var sizeClass = sizeKey === 'credit' ? 'size-credit' : 'size-wallet';
        return (
            '<div class="pocket-card-preview ' + sizeClass + '" style="box-shadow: inset 0 0 0 2px ' + themeColor + '22;">' +
            buildPageInnerHtml(page, options) +
            '</div>'
        );
    }

    function buildPrintHtml(setlist, options) {
        options = options || {};
        var sizeKey = options.size || 'wallet';
        var size = CARD_SIZES[sizeKey] || CARD_SIZES.wallet;
        var themeColor = getThemeColor();
        var pages = buildPrintPages(setlist, options);

        if (!pages.length) {
            return '<html><body><p>No songs in this setlist.</p></body></html>';
        }

        var cardHtml = pages.map(function (page) {
            return (
                '<div class="pocket-card" style="width:' + size.width + ';height:' + size.height + ';padding:0.07in 0.09in;">' +
                buildPageInnerHtml(page, options) +
                '</div>'
            );
        }).join('');

        return (
            '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Pocket Cards - ' +
            escapeHtml(setlist.name) + '</title><style>' +
            getCardStyles(themeColor) +
            '</style></head><body><div class="cards-grid">' + cardHtml + '</div></body></html>'
        );
    }

    function printPocketCards(setlist, options) {
        if (!setlist) return false;
        var html = buildPrintHtml(setlist, options);
        var printWindow = window.open('', '_blank', 'width=900,height=700');
        if (!printWindow) {
            alert('Pop-up blocked. Please allow pop-ups to print pocket cards.');
            return false;
        }
        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(function () {
            printWindow.print();
        }, 300);
        return true;
    }

    global.PocketCards = {
        CARD_SIZES: CARD_SIZES,
        getSetCards: getSetCards,
        buildPrintPages: buildPrintPages,
        getSamplePrintPage: getSamplePrintPage,
        getSampleSetCard: getSampleSetCard,
        getSampleCard: getSamplePrintPage,
        renderPreviewHtml: renderPreviewHtml,
        buildPrintHtml: buildPrintHtml,
        printPocketCards: printPocketCards
    };
})(typeof window !== 'undefined' ? window : this);
