/**
 * Song data contract — classic script (file:// compatible)
 * Centralizes IDs, duplicate keys, normalization, and safe merge.
 */
(function (global) {
    'use strict';

    var STORAGE_KEYS = {
        SONGS: 'songDatabase',
        SONGS_LEGACY: 'bandSongs',
        SETLISTS: 'bandSetlists',
        THEME: 'bandOrganizerTheme'
    };

    var SONG_FIELDS = [
        'artist', 'song', 'album', 'link', 'tuning', 'bands', 'tags',
        'key', 'firstNote', 'lastNote', 'duration', 'year', 'genre',
        'tempo', 'notes', 'practiceStatus', 'playCount', 'lastPlayed'
    ];

    var IMPORT_FIELDS = [
        'artist', 'song', 'album', 'link', 'tuning', 'bands',
        'key', 'firstNote', 'lastNote', 'duration', 'tags'
    ];

    var CSV_HEADER_MAP = {
        'artist': 'artist',
        'album': 'album',
        'song': 'song',
        'title': 'song',
        'link': 'link',
        'url': 'link',
        'tuning': 'tuning',
        'bands': 'bands',
        'band': 'bands',
        'tags': 'tags',
        'key': 'key',
        'first note': 'firstNote',
        'firstnote': 'firstNote',
        'last note': 'lastNote',
        'lastnote': 'lastNote',
        'duration': 'duration',
        'length': 'duration'
    };

    function generateId() {
        return 'song_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
    }

    function songKey(artist, song) {
        return (String(artist || '').trim().toLowerCase() + '\0' + String(song || '').trim().toLowerCase());
    }

    function escapeHtml(value) {
        if (value === null || value === undefined) return '';
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function escapeCSV(value) {
        if (value === null || value === undefined) return '';
        var str = String(value);
        if (str.indexOf(',') >= 0 || str.indexOf('"') >= 0 || str.indexOf('\n') >= 0) {
            return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
    }

    function parseCSVLine(line) {
        var values = [];
        var current = '';
        var inQuotes = false;
        for (var i = 0; i < line.length; i++) {
            var char = line[i];
            var next = line[i + 1];
            if (char === '"') {
                if (inQuotes && next === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim());
        return values.map(function (v) {
            return v.replace(/^"|"$/g, '').replace(/""/g, '"');
        });
    }

    function normalizeLink(song) {
        if (song.link) return song.link;
        if (song.link1) return song.link1;
        if (song.link2) return song.link2;
        return '';
    }

    function normalizeSong(raw) {
        var song = Object.assign({}, raw || {});
        song.artist = String(song.artist || '').trim();
        song.song = String(song.song || '').trim();
        song.album = String(song.album || '').trim();
        song.link = String(normalizeLink(song) || '').trim();
        song.tuning = String(song.tuning || '').trim();
        song.bands = String(song.bands || '').trim();
        song.tags = String(song.tags || '').trim();
        song.key = String(song.key || '').trim();
        song.firstNote = String(song.firstNote || '').trim();
        song.lastNote = String(song.lastNote || '').trim();
        song.duration = String(song.duration || '').trim();
        delete song.link1;
        delete song.link2;
        return song;
    }

    function buildSongIndex(songs) {
        var index = new Map();
        (songs || []).forEach(function (s, idx) {
            if (s && s.artist && s.song) {
                index.set(songKey(s.artist, s.song), idx);
            }
        });
        return index;
    }

    function getFieldChanges(existing, incoming) {
        var changes = [];
        IMPORT_FIELDS.forEach(function (field) {
            var oldVal = existing[field] || '';
            var newVal = incoming[field] || '';
            if (oldVal !== newVal) {
                changes.push({ field: field, oldValue: oldVal, newValue: newVal });
            }
        });
        return changes;
    }

    function mergeSongUpdate(existing, incoming) {
        var merged = Object.assign({}, existing);
        IMPORT_FIELDS.forEach(function (field) {
            if (incoming[field] !== undefined && incoming[field] !== '') {
                merged[field] = incoming[field];
            }
        });
        merged.updatedAt = new Date().toISOString();
        if (!merged.id) merged.id = generateId();
        if (!merged.createdAt) merged.createdAt = merged.updatedAt;
        return merged;
    }

    function createNewSong(incoming) {
        var now = new Date().toISOString();
        var song = normalizeSong(incoming);
        song.id = generateId();
        song.createdAt = now;
        song.updatedAt = now;
        song.playCount = song.playCount || 0;
        song.chordChart = song.chordChart || null;
        return song;
    }

    function loadSongs() {
        try {
            var raw = localStorage.getItem(STORAGE_KEYS.SONGS) || localStorage.getItem(STORAGE_KEYS.SONGS_LEGACY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('Failed to load songs:', e);
            return [];
        }
    }

    function saveSongs(songs) {
        localStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(songs));
        localStorage.setItem(STORAGE_KEYS.SONGS_LEGACY, JSON.stringify(songs));
    }

    /** Minimal chart object so Show Time can store scroll/font prefs without chart content. */
    function ensureChordChartShell(song) {
        if (!song.chordChart || typeof song.chordChart !== 'object') {
            song.chordChart = {
                components: [],
                settings: { defaultChordFormat: 'inline', showChordDiagrams: false, fontSize: 14 }
            };
        } else if (!Array.isArray(song.chordChart.components)) {
            song.chordChart.components = [];
        }
        return song.chordChart;
    }

    /**
     * Persist Show Time scroll speed / font size on the song's chordChart.
     * Bumps chordChartUpdatedAt so export/import merge picks up the latest prefs.
     */
    function saveChordChartPreferences(artist, songTitle, prefs) {
        var songs = loadSongs();
        var key = songKey(artist, songTitle);
        var idx = -1;
        for (var i = 0; i < songs.length; i++) {
            if (songKey(songs[i].artist, songs[i].song) === key) {
                idx = i;
                break;
            }
        }
        if (idx < 0) return null;

        var song = songs[idx];
        var chart = ensureChordChartShell(song);
        if (prefs && prefs.preferredScrollSpeed != null) {
            chart.preferredScrollSpeed = prefs.preferredScrollSpeed;
        }
        if (prefs && prefs.preferredFontSize != null) {
            chart.preferredFontSize = prefs.preferredFontSize;
        }

        var nowIso = new Date().toISOString();
        song.chordChartUpdatedAt = nowIso;
        song.updatedAt = nowIso;
        songs[idx] = song;
        saveSongs(songs);
        return song;
    }

    function exportAllData() {
        var payload = {
            format: 'bandPracticeManager-backup',
            version: 1,
            exportedAt: new Date().toISOString(),
            songs: loadSongs(),
            setlists: JSON.parse(localStorage.getItem(STORAGE_KEYS.SETLISTS) || '[]'),
            theme: localStorage.getItem(STORAGE_KEYS.THEME) || 'grey',
            watermark: localStorage.getItem('watermark') || 'guitar'
        };
        var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'band-practice-manager-backup-' + new Date().toISOString().split('T')[0] + '.json';
        a.click();
        URL.revokeObjectURL(url);
        return payload;
    }

    function cleanupLegacyKeys() {
        localStorage.removeItem('spotifyClientId');
        localStorage.removeItem('spotifyClientSecret');
    }

    global.SongData = {
        STORAGE_KEYS: STORAGE_KEYS,
        SONG_FIELDS: SONG_FIELDS,
        IMPORT_FIELDS: IMPORT_FIELDS,
        CSV_HEADER_MAP: CSV_HEADER_MAP,
        generateId: generateId,
        songKey: songKey,
        escapeHtml: escapeHtml,
        escapeCSV: escapeCSV,
        parseCSVLine: parseCSVLine,
        normalizeSong: normalizeSong,
        buildSongIndex: buildSongIndex,
        getFieldChanges: getFieldChanges,
        mergeSongUpdate: mergeSongUpdate,
        createNewSong: createNewSong,
        loadSongs: loadSongs,
        saveSongs: saveSongs,
        ensureChordChartShell: ensureChordChartShell,
        saveChordChartPreferences: saveChordChartPreferences,
        exportAllData: exportAllData,
        cleanupLegacyKeys: cleanupLegacyKeys
    };

    global.generateId = generateId;
    global.exportAllData = exportAllData;
})(typeof window !== 'undefined' ? window : this);
