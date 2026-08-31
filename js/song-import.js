/**
 * Bulk song import — preview, duplicate review, safe merge (file:// compatible)
 */
(function (global) {
    'use strict';

    var SD = global.SongData;

    function parsePastedData(text) {
        var lines = text.split('\n').filter(function (l) { return l.trim(); });
        var songs = [];
        lines.forEach(function (line) {
            var artist = '';
            var song = '';
            var album = '';
            var extra = {};
            if (line.indexOf('\t') >= 0) {
                var parts = line.split('\t').map(function (p) { return p.trim(); });
                artist = parts[0] || '';
                song = parts[1] || '';
                album = parts[2] || '';
                if (parts[3]) extra.tuning = parts[3];
                if (parts[4]) extra.bands = parts[4];
                if (parts[5]) extra.key = parts[5];
            } else if (line.indexOf(' - ') >= 0) {
                var dashParts = line.split(' - ');
                artist = (dashParts[0] || '').trim();
                song = dashParts.slice(1).join(' - ').trim();
            } else if (line.indexOf(',') >= 0) {
                var commaParts = line.split(',').map(function (p) { return p.trim(); });
                artist = commaParts[0] || '';
                song = commaParts[1] || '';
                album = commaParts[2] || '';
                if (commaParts[3]) extra.tuning = commaParts[3];
                if (commaParts[4]) extra.bands = commaParts[4];
                if (commaParts[5]) extra.key = commaParts[5];
            } else {
                song = line.trim();
            }
            if (artist || song) {
                songs.push(SD.normalizeSong(Object.assign({ artist: artist, song: song, album: album }, extra)));
            }
        });
        return songs;
    }

    function songsToCSV(songs) {
        var headers = ['Artist', 'Song', 'Album', 'Link', 'Tuning', 'Bands', 'Key', 'First Note', 'Last Note', 'Duration'];
        var lines = [headers.join(',')];
        songs.forEach(function (s) {
            lines.push([
                SD.escapeCSV(s.artist), SD.escapeCSV(s.song), SD.escapeCSV(s.album || ''),
                SD.escapeCSV(s.link || ''), SD.escapeCSV(s.tuning || ''), SD.escapeCSV(s.bands || ''),
                SD.escapeCSV(s.key || ''), SD.escapeCSV(s.firstNote || ''), SD.escapeCSV(s.lastNote || ''),
                SD.escapeCSV(s.duration || '')
            ].join(','));
        });
        return lines.join('\n');
    }

    function parseCSVContent(csv, existingSongs) {
        var lines = csv.split(/\r?\n/).filter(function (l) { return l.trim(); });
        var result = {
            importData: [],
            errors: [],
            stats: { new: 0, update: 0, duplicate: 0, invalid: 0 }
        };
        if (lines.length < 2) {
            result.errors.push('CSV file is empty or has no data rows.');
            return result;
        }

        var headers = SD.parseCSVLine(lines[0]).map(function (h) { return h.trim().toLowerCase(); });
        var headerIndexMap = {};
        headers.forEach(function (header, index) {
            var mapped = SD.CSV_HEADER_MAP[header];
            if (mapped) headerIndexMap[mapped] = index;
        });

        if (headerIndexMap.artist === undefined || headerIndexMap.song === undefined) {
            result.errors.push('CSV must include Artist and Song columns.');
            return result;
        }

        var csvSongs = [];
        for (var i = 1; i < lines.length; i++) {
            var values = SD.parseCSVLine(lines[i]);
            if (!values.length) continue;
            var row = SD.normalizeSong({
                artist: values[headerIndexMap.artist] || '',
                song: values[headerIndexMap.song] || '',
                album: headerIndexMap.album !== undefined ? values[headerIndexMap.album] : '',
                link: headerIndexMap.link !== undefined ? values[headerIndexMap.link] : '',
                tuning: headerIndexMap.tuning !== undefined ? values[headerIndexMap.tuning] : '',
                bands: headerIndexMap.bands !== undefined ? values[headerIndexMap.bands] : '',
                tags: headerIndexMap.tags !== undefined ? values[headerIndexMap.tags] : '',
                key: headerIndexMap.key !== undefined ? values[headerIndexMap.key] : '',
                firstNote: headerIndexMap.firstNote !== undefined ? values[headerIndexMap.firstNote] : '',
                lastNote: headerIndexMap.lastNote !== undefined ? values[headerIndexMap.lastNote] : '',
                duration: headerIndexMap.duration !== undefined ? values[headerIndexMap.duration] : '',
                csvLineNumber: i + 1
            });
            if (!row.artist || !row.song) {
                result.stats.invalid++;
                result.errors.push('Line ' + (i + 1) + ': missing artist or song title.');
                continue;
            }
            csvSongs.push(row);
        }

        var songIndex = SD.buildSongIndex(existingSongs || []);
        var processedKeys = new Set();

        csvSongs.forEach(function (csvSong) {
            var key = SD.songKey(csvSong.artist, csvSong.song);
            var csvDuplicates = csvSongs.filter(function (s) {
                return SD.songKey(s.artist, s.song) === key;
            });

            if (csvDuplicates.length > 1 && !processedKeys.has(key)) {
                processedKeys.add(key);
                result.importData.push({
                    type: 'csv-duplicate',
                    duplicates: csvDuplicates,
                    selectedDuplicate: 0,
                    duplicateAction: 'update',
                    artist: csvSong.artist,
                    songName: csvSong.song,
                    selected: true
                });
                result.stats.duplicate++;
            } else if (csvDuplicates.length === 1) {
                var existingIdx = songIndex.get(key);
                if (existingIdx !== undefined) {
                    var existing = existingSongs[existingIdx];
                    var changes = SD.getFieldChanges(existing, csvSong);
                    if (changes.length > 0) {
                        result.importData.push({
                            type: 'update',
                            index: existingIdx,
                            oldSong: existing,
                            newSong: csvSong,
                            changes: changes,
                            duplicateAction: 'update',
                            selected: true
                        });
                        result.stats.update++;
                    }
                } else {
                    result.importData.push({
                        type: 'new',
                        newSong: csvSong,
                        selected: true
                    });
                    result.stats.new++;
                }
            }
        });

        return result;
    }

    function applyImport(importData, existingSongs, itemResolver) {
        var songs = existingSongs.slice();
        var applied = 0;
        var skipped = 0;

        importData.forEach(function (item, idx) {
            if (item.selected === false) {
                skipped++;
                return;
            }
            var resolved = itemResolver ? itemResolver(item, idx) : item;

            if (resolved.type === 'csv-duplicate') {
                var pick = resolved.duplicates[resolved.selectedDuplicate || 0];
                var key = SD.songKey(pick.artist, pick.song);
                var existingIdx = songs.findIndex(function (s) {
                    return SD.songKey(s.artist, s.song) === key;
                });
                if (resolved.duplicateAction === 'skip') {
                    skipped++;
                    return;
                }
                if (existingIdx >= 0) {
                    if (resolved.duplicateAction === 'keep') {
                        skipped++;
                        return;
                    }
                    songs[existingIdx] = SD.mergeSongUpdate(songs[existingIdx], pick);
                } else {
                    songs.push(SD.createNewSong(pick));
                }
                applied++;
            } else if (resolved.type === 'update') {
                if (resolved.duplicateAction === 'skip' || resolved.duplicateAction === 'keep') {
                    skipped++;
                    return;
                }
                songs[resolved.index] = SD.mergeSongUpdate(songs[resolved.index], resolved.newSong);
                applied++;
            } else if (resolved.type === 'new') {
                songs.push(SD.createNewSong(resolved.newSong));
                applied++;
            }
        });

        return { songs: songs, applied: applied, skipped: skipped };
    }

    function formatFieldName(field) {
        var names = {
            firstNote: 'First Note',
            lastNote: 'Last Note',
            practiceStatus: 'Status'
        };
        return names[field] || (field.charAt(0).toUpperCase() + field.slice(1));
    }

    global.SongImport = {
        parsePastedData: parsePastedData,
        songsToCSV: songsToCSV,
        parseCSVContent: parseCSVContent,
        applyImport: applyImport,
        formatFieldName: formatFieldName
    };
})(typeof window !== 'undefined' ? window : this);
