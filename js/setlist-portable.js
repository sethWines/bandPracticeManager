/**
 * Full JSON export/import for setlists + song library merge (timestamp rules).
 */

export const PORTABLE_FORMAT = 'bandPracticeManager-setlist';
export const PORTABLE_VERSION = 1;

export function generateSetlistId() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}

export function deepClone(obj) {
    if (obj === undefined) return undefined;
    return JSON.parse(JSON.stringify(obj));
}

export function normStr(v) {
    if (v == null) return '';
    return String(v).trim();
}

export function songKeyFromSong(s) {
    const a = normStr(s.artist);
    const t = normStr(s.song);
    if (!a || !t) return null;
    return `${a}\0${t}`;
}

function parseTs(v) {
    if (v == null || v === '') return null;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Apply import when either side has no valid timestamp, or import is strictly newer than local.
 */
export function shouldApplyImport(importTs, localTs) {
    const id = parseTs(importTs);
    const ld = parseTs(localTs);
    if (id === null || ld === null) return true;
    return id.getTime() > ld.getTime();
}

function ensureSets(setlist) {
    if (setlist.sets && Array.isArray(setlist.sets)) {
        return setlist.sets.map((set) => ({
            name: set.name || 'Set',
            songs: Array.isArray(set.songs) ? set.songs : []
        }));
    }
    return [
        {
            name: '1st Set',
            songs: Array.isArray(setlist.songs) ? setlist.songs : []
        }
    ];
}

/**
 * Enrich a setlist slot with the song library row (same idea as setlist-manager enrichSongData).
 */
export function enrichSlotForExport(slot, songs) {
    if (!slot || typeof slot !== 'object') return deepClone(slot);
    const byIdOnly = slot.songId != null && (!normStr(slot.song) || !normStr(slot.artist));
    let full = null;
    if (byIdOnly) {
        full = songs.find((s) => s.id === slot.songId);
    } else {
        full = songs.find(
            (s) => normStr(s.artist) === normStr(slot.artist) && normStr(s.song) === normStr(slot.song)
        );
    }
    if (full) {
        return deepClone({
            ...slot,
            ...full,
            artist: full.artist,
            song: full.song,
            link: full.link,
            key: full.key != null && full.key !== '' ? full.key : slot.key,
            tuning: full.tuning != null && full.tuning !== '' ? full.tuning : slot.tuning,
            duration: full.duration != null && full.duration !== '' ? full.duration : slot.duration,
            chordChart: full.chordChart != null ? full.chordChart : slot.chordChart
        });
    }
    return deepClone(slot);
}

export function normalizeSetlistForExport(setlist, songs) {
    const sets = ensureSets(setlist);
    return {
        name: setlist.name,
        band: setlist.band,
        id: setlist.id,
        sets: sets.map((set) => ({
            name: set.name,
            songs: set.songs.map((slot) => enrichSlotForExport(slot, songs))
        }))
    };
}

/**
 * @param {object[]} setlistsToExport - subset or all setlists
 * @param {object[]} songs - full song library
 */
export function buildExportPayload(setlistsToExport, songs) {
    const exportedAt = new Date().toISOString();
    return {
        format: PORTABLE_FORMAT,
        version: PORTABLE_VERSION,
        exportedAt,
        setlists: setlistsToExport.map((sl) => normalizeSetlistForExport(sl, songs))
    };
}

export function validateImportPayload(payload) {
    if (!payload || typeof payload !== 'object') {
        throw new Error('Invalid file: expected a JSON object.');
    }
    if (payload.format !== PORTABLE_FORMAT) {
        throw new Error(`Unknown format (expected "${PORTABLE_FORMAT}").`);
    }
    if (payload.version !== PORTABLE_VERSION) {
        throw new Error(`Unsupported version ${payload.version} (expected ${PORTABLE_VERSION}).`);
    }
    if (!Array.isArray(payload.setlists)) {
        throw new Error('Invalid payload: setlists must be an array.');
    }
}

/**
 * Last occurrence wins per songKey.
 */
export function collectImportSongSnapshots(setlists) {
    const map = new Map();
    for (const sl of setlists) {
        const sets = ensureSets(sl);
        for (const set of sets) {
            for (const slot of set.songs) {
                const k = songKeyFromSong(slot);
                if (k) {
                    map.set(k, deepClone(slot));
                }
            }
        }
    }
    return map;
}

function mergeOneSong(local, imported, exportedAt) {
    const stats = {
        added: 0,
        metaFromImport: 0,
        metaKeptLocal: 0,
        chordFromImport: 0,
        chordKeptLocal: 0
    };

    if (!local) {
        const song = deepClone(imported);
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
        return { song, stats };
    }

    const metaApply = shouldApplyImport(imported.updatedAt, local.updatedAt);
    const chordImportTs = imported.chordChartUpdatedAt ?? imported.updatedAt;
    const chordLocalTs = local.chordChartUpdatedAt ?? local.updatedAt;
    const chordApply = shouldApplyImport(chordImportTs, chordLocalTs);

    const out = deepClone(local);

    if (metaApply) {
        for (const k of Object.keys(imported)) {
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

    return { song: out, stats };
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
    const k = songKeyFromSong(slot);
    if (k && canonicalByKey.has(k)) {
        return canonicalByKey.get(k);
    }
    if (slot.songId != null) {
        const found = songsOut.find((s) => s.id === slot.songId);
        if (found) return found;
    }
    return deepClone(slot);
}

/**
 * @param {object} payload - validated import envelope
 * @param {{ songs: object[], setlists: object[] }} state - current library + setlists
 * @returns {{ songs: object[], setlists: object[], stats: object }}
 */
export function mergeImportPayload(payload, state) {
    const exportedAt = payload.exportedAt || null;
    const stats = {
        songsAdded: 0,
        songsMetaFromImport: 0,
        songsMetaKeptLocal: 0,
        songsChordFromImport: 0,
        songsChordKeptLocal: 0,
        setlistsImported: payload.setlists.length
    };

    const songsOut = state.songs.map((s) => deepClone(s));
    const keyToIndex = new Map();
    for (let i = 0; i < songsOut.length; i++) {
        const k = songKeyFromSong(songsOut[i]);
        if (k) keyToIndex.set(k, i);
    }

    const importSnapshots = collectImportSongSnapshots(payload.setlists);

    for (const [key, imp] of importSnapshots) {
        const idx = keyToIndex.get(key);
        if (idx === undefined) {
            const { song, stats: st } = mergeOneSong(null, imp, exportedAt);
            songsOut.push(song);
            keyToIndex.set(key, songsOut.length - 1);
            addStats(stats, st);
        } else {
            const { song, stats: st } = mergeOneSong(songsOut[idx], imp, exportedAt);
            songsOut[idx] = song;
            addStats(stats, st);
        }
    }

    const canonicalByKey = new Map();
    for (const s of songsOut) {
        const k = songKeyFromSong(s);
        if (k) canonicalByKey.set(k, s);
    }

    const newSetlists = [];
    for (const sl of payload.setlists) {
        const sets = ensureSets(sl);
        const copy = {
            name: sl.name,
            band: sl.band,
            id: sl.id || generateSetlistId(),
            sets: sets.map((set) => ({
                name: set.name,
                songs: set.songs.map((slot) => resolveSlotToCanonical(slot, canonicalByKey, songsOut))
            }))
        };
        newSetlists.push(copy);
    }

    const setlistsOut = [...state.setlists, ...newSetlists];

    return { songs: songsOut, setlists: setlistsOut, stats };
}

export function downloadJsonPayload(payload, filename) {
    const dataStr = JSON.stringify(payload, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}
