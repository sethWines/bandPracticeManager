/**
 * Full JSON export/import for setlists + song library merge (timestamp rules).
 * Plain script (no ES modules) so it works when opening HTML via file:// — assigns window.PortableSetlist.
 */
(function () {
    'use strict';

    var PORTABLE_FORMAT = 'bandPracticeManager-setlist';
    var PORTABLE_VERSION = 1;

    function generateSetlistId() {
        return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 11);
    }

    function deepClone(obj) {
        if (obj === undefined) return undefined;
        return JSON.parse(JSON.stringify(obj));
    }

    function normStr(v) {
        if (v == null) return '';
        return String(v).trim();
    }

    function songKeyFromSong(s) {
        var a = normStr(s.artist);
        var t = normStr(s.song);
        if (!a || !t) return null;
        return a + '\0' + t;
    }

    function parseTs(v) {
        if (v == null || v === '') return null;
        var d = new Date(v);
        return Number.isNaN(d.getTime()) ? null : d;
    }

    function shouldApplyImport(importTs, localTs) {
        var id = parseTs(importTs);
        var ld = parseTs(localTs);
        if (id === null || ld === null) return true;
        return id.getTime() > ld.getTime();
    }

    function ensureSets(setlist) {
        if (setlist.sets && Array.isArray(setlist.sets)) {
            return setlist.sets.map(function (set) {
                return {
                    name: set.name || 'Set',
                    songs: Array.isArray(set.songs) ? set.songs : []
                };
            });
        }
        return [
            {
                name: '1st Set',
                songs: Array.isArray(setlist.songs) ? setlist.songs : []
            }
        ];
    }

    function enrichSlotForExport(slot, songs) {
        if (!slot || typeof slot !== 'object') return deepClone(slot);
        var byIdOnly = slot.songId != null && (!normStr(slot.song) || !normStr(slot.artist));
        var full = null;
        if (byIdOnly) {
            full = songs.find(function (s) {
                return s.id === slot.songId;
            });
        } else {
            full = songs.find(function (s) {
                return normStr(s.artist) === normStr(slot.artist) && normStr(s.song) === normStr(slot.song);
            });
        }
        if (full) {
            return deepClone(
                Object.assign({}, slot, full, {
                    artist: full.artist,
                    song: full.song,
                    link: full.link,
                    key: full.key != null && full.key !== '' ? full.key : slot.key,
                    tuning: full.tuning != null && full.tuning !== '' ? full.tuning : slot.tuning,
                    duration: full.duration != null && full.duration !== '' ? full.duration : slot.duration,
                    chordChart: full.chordChart != null ? full.chordChart : slot.chordChart
                })
            );
        }
        return deepClone(slot);
    }

    function normalizeSetlistForExport(setlist, songs) {
        var sets = ensureSets(setlist);
        return {
            name: setlist.name,
            band: setlist.band,
            id: setlist.id,
            sets: sets.map(function (set) {
                return {
                    name: set.name,
                    songs: set.songs.map(function (slot) {
                        return enrichSlotForExport(slot, songs);
                    })
                };
            })
        };
    }

    function buildExportPayload(setlistsToExport, songs) {
        var exportedAt = new Date().toISOString();
        return {
            format: PORTABLE_FORMAT,
            version: PORTABLE_VERSION,
            exportedAt: exportedAt,
            setlists: setlistsToExport.map(function (sl) {
                return normalizeSetlistForExport(sl, songs);
            })
        };
    }

    function validateImportPayload(payload) {
        if (!payload || typeof payload !== 'object') {
            throw new Error('Invalid file: expected a JSON object.');
        }
        if (payload.format !== PORTABLE_FORMAT) {
            throw new Error('Unknown format (expected "' + PORTABLE_FORMAT + '").');
        }
        if (payload.version !== PORTABLE_VERSION) {
            throw new Error('Unsupported version ' + payload.version + ' (expected ' + PORTABLE_VERSION + ').');
        }
        if (!Array.isArray(payload.setlists)) {
            throw new Error('Invalid payload: setlists must be an array.');
        }
    }

    function collectImportSongSnapshots(setlists) {
        var map = new Map();
        for (var si = 0; si < setlists.length; si++) {
            var sl = setlists[si];
            var sets = ensureSets(sl);
            for (var ti = 0; ti < sets.length; ti++) {
                var set = sets[ti];
                var songArr = set.songs || [];
                for (var ui = 0; ui < songArr.length; ui++) {
                    var slot = songArr[ui];
                    var k = songKeyFromSong(slot);
                    if (k) {
                        map.set(k, deepClone(slot));
                    }
                }
            }
        }
        return map;
    }

    function mergeOneSong(local, imported, exportedAt) {
        var stats = {
            added: 0,
            metaFromImport: 0,
            metaKeptLocal: 0,
            chordFromImport: 0,
            chordKeptLocal: 0
        };

        if (!local) {
            var song = deepClone(imported);
            song.id = Date.now() + Math.random();
            song.createdAt = imported.createdAt || new Date().toISOString();
            song.updatedAt = imported.updatedAt || new Date().toISOString();
            if (imported.chordChart != null) {
                song.chordChartUpdatedAt =
                    imported.chordChartUpdatedAt ||
                    imported.updatedAt ||
                    exportedAt ||
                    new Date().toISOString();
            } else {
                song.chordChart = null;
                song.chordChartUpdatedAt = null;
            }
            stats.added = 1;
            return { song: song, stats: stats };
        }

        var metaApply = shouldApplyImport(imported.updatedAt, local.updatedAt);
        var chordImportTs =
            imported.chordChartUpdatedAt !== undefined && imported.chordChartUpdatedAt !== null
                ? imported.chordChartUpdatedAt
                : imported.updatedAt;
        var chordLocalTs =
            local.chordChartUpdatedAt !== undefined && local.chordChartUpdatedAt !== null
                ? local.chordChartUpdatedAt
                : local.updatedAt;
        var chordApply = shouldApplyImport(chordImportTs, chordLocalTs);

        var out = deepClone(local);

        if (metaApply) {
            var keys = Object.keys(imported);
            for (var ki = 0; ki < keys.length; ki++) {
                var k = keys[ki];
                if (k === 'id' || k === 'chordChart' || k === 'chordChartUpdatedAt') continue;
                out[k] = deepClone(imported[k]);
            }
            if (imported.updatedAt != null) {
                out.updatedAt = imported.updatedAt;
            }
            stats.metaFromImport = 1;
        } else {
            stats.metaKeptLocal = 1;
        }

        if (chordApply) {
            out.chordChart = imported.chordChart != null ? deepClone(imported.chordChart) : null;
            out.chordChartUpdatedAt =
                imported.chordChart != null
                    ? imported.chordChartUpdatedAt ||
                      imported.updatedAt ||
                      exportedAt ||
                      new Date().toISOString()
                    : null;
            stats.chordFromImport = 1;
        } else {
            stats.chordKeptLocal = 1;
        }

        return { song: out, stats: stats };
    }

    function addStats(total, part) {
        total.songsAdded += part.added;
        total.songsMetaFromImport += part.metaFromImport;
        total.songsMetaKeptLocal += part.metaKeptLocal;
        total.songsChordFromImport += part.chordFromImport;
        total.songsChordKeptLocal += part.chordKeptLocal;
    }

    function resolveSlotToCanonical(slot, canonicalByKey, songsOut) {
        if (!slot || typeof slot !== 'object') return deepClone(slot);
        var k = songKeyFromSong(slot);
        if (k && canonicalByKey.has(k)) {
            return canonicalByKey.get(k);
        }
        if (slot.songId != null) {
            var found = songsOut.find(function (s) {
                return s.id === slot.songId;
            });
            if (found) return found;
        }
        return deepClone(slot);
    }

    function mergeImportPayload(payload, state) {
        var exportedAt = payload.exportedAt || null;
        var stats = {
            songsAdded: 0,
            songsMetaFromImport: 0,
            songsMetaKeptLocal: 0,
            songsChordFromImport: 0,
            songsChordKeptLocal: 0,
            setlistsImported: payload.setlists.length
        };

        var songsOut = state.songs.map(function (s) {
            return deepClone(s);
        });
        var keyToIndex = new Map();
        for (var i = 0; i < songsOut.length; i++) {
            var sk = songKeyFromSong(songsOut[i]);
            if (sk) keyToIndex.set(sk, i);
        }

        var importSnapshots = collectImportSongSnapshots(payload.setlists);

        importSnapshots.forEach(function (imp, key) {
            var idx = keyToIndex.get(key);
            if (idx === undefined) {
                var added = mergeOneSong(null, imp, exportedAt);
                songsOut.push(added.song);
                keyToIndex.set(key, songsOut.length - 1);
                addStats(stats, added.stats);
            } else {
                var merged = mergeOneSong(songsOut[idx], imp, exportedAt);
                songsOut[idx] = merged.song;
                addStats(stats, merged.stats);
            }
        });

        var canonicalByKey = new Map();
        for (var ci = 0; ci < songsOut.length; ci++) {
            var cs = songsOut[ci];
            var ck = songKeyFromSong(cs);
            if (ck) canonicalByKey.set(ck, cs);
        }

        var newSetlists = [];
        for (var li = 0; li < payload.setlists.length; li++) {
            var sl = payload.setlists[li];
            var sets = ensureSets(sl);
            newSetlists.push({
                name: sl.name,
                band: sl.band,
                id: sl.id || generateSetlistId(),
                sets: sets.map(function (set) {
                    return {
                        name: set.name,
                        songs: set.songs.map(function (slot) {
                            return resolveSlotToCanonical(slot, canonicalByKey, songsOut);
                        })
                    };
                })
            });
        }

        var setlistsOut = state.setlists.concat(newSetlists);

        return { songs: songsOut, setlists: setlistsOut, stats: stats };
    }

    function downloadJsonPayload(payload, filename) {
        var dataStr = JSON.stringify(payload, null, 2);
        var blob = new Blob([dataStr], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }

    window.PortableSetlist = {
        PORTABLE_FORMAT: PORTABLE_FORMAT,
        PORTABLE_VERSION: PORTABLE_VERSION,
        generateSetlistId: generateSetlistId,
        deepClone: deepClone,
        normStr: normStr,
        songKeyFromSong: songKeyFromSong,
        shouldApplyImport: shouldApplyImport,
        enrichSlotForExport: enrichSlotForExport,
        normalizeSetlistForExport: normalizeSetlistForExport,
        buildExportPayload: buildExportPayload,
        validateImportPayload: validateImportPayload,
        collectImportSongSnapshots: collectImportSongSnapshots,
        mergeImportPayload: mergeImportPayload,
        downloadJsonPayload: downloadJsonPayload
    };
})();
