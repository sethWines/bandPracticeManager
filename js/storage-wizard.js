/**
 * Storage Wizard
 * Centralized data management for Band Practice Manager
 * Handles CSV/JSON import/export and data clearing operations
 */

let currentDevice = 'Desktop';
let actionCallbacks = [];
let pendingImportData = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    detectAndDisplayDevice();
});

// Load theme from localStorage (same as Song Manager)
function loadTheme() {
    const savedTheme = localStorage.getItem('bandOrganizerTheme') || 'grey';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Device detection
function detectDevice() {
    const ua = navigator.userAgent;
    const platform = navigator.platform;
    
    // Check for iPad (including iPadOS 13+ which reports as Mac)
    if (/iPad/.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
        return 'iPad';
    }
    
    // Check for iPhone
    if (/iPhone/.test(ua)) {
        return 'iPhone';
    }
    
    // Check for Android devices
    if (/Android/.test(ua)) {
        // Differentiate phone vs tablet based on Mobile keyword
        if (/Mobile/.test(ua)) {
            return 'Android Phone';
        } else {
            return 'Android Tablet';
        }
    }
    
    return 'Desktop';
}

// Detect and display device information
function detectAndDisplayDevice() {
    currentDevice = detectDevice();
    const deviceNameEl = document.getElementById('deviceName');
    const deviceIconEl = document.getElementById('deviceIcon');
    
    deviceNameEl.textContent = currentDevice;
    deviceIconEl.innerHTML = getDeviceIcon(currentDevice);
}

// Get device-specific icon
function getDeviceIcon(device) {
    const icons = {
        'iPhone': `
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
            </svg>
        `,
        'iPad': `
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2">
                <rect x="3" y="2" width="18" height="20" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
            </svg>
        `,
        'Android Phone': `
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
                <circle cx="12" cy="5" r="0.5" fill="var(--primary-color)"/>
            </svg>
        `,
        'Android Tablet': `
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2">
                <rect x="2" y="3" width="20" height="18" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
            </svg>
        `,
        'Desktop': `
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
        `
    };
    
    return icons[device] || icons['Desktop'];
}

// Get icon SVG by name
function getIconSVG(iconName) {
    const icons = {
        'mail': `
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
            </svg>
        `,
        'folder': `
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
        `,
        'upload': `
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
        `,
        'download': `
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
        `,
        'search': `
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
        `,
        'cloud': `
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
            </svg>
        `,
        'file': `
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
            </svg>
        `,
        'check': `
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
        `,
        'warning': `
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
        `
    };
    
    return icons[iconName] || icons['file'];
}

// ===========================
// CSV Import Wizard
// ===========================
function startCSVImportWizard() {
    hideAllWizards();
    document.getElementById('csvImportWizard').style.display = 'block';
    
    const steps = getCSVImportSteps(currentDevice);
    renderSteps(steps, 'csvImportSteps');
}

function getCSVImportSteps(device) {
    const iosSteps = [
        {
            title: 'Step 1: Get Your CSV File',
            description: 'First, make sure you have the CSV file on your device. You can:<br>• Email yourself the CSV file and open it<br>• Download from cloud storage (Google Drive, Dropbox, iCloud)<br>• Receive via AirDrop from a Mac or another iOS device',
            icon: 'mail',
            actions: []
        },
        {
            title: 'Step 2: Save to Files App',
            description: 'When you receive or download the CSV file:<br>• <strong>Long-press</strong> the CSV file attachment or download<br>• Tap <strong>"Save to Files"</strong> or <strong>"Share"</strong> → <strong>"Save to Files"</strong><br>• Choose location: <strong>iCloud Drive</strong> (recommended) or <strong>"On My ' + device + '"</strong><br>• Tap <strong>"Save"</strong> and remember where you saved it!',
            icon: 'folder',
            actions: []
        },
        {
            title: 'Step 3: Import Your CSV',
            description: 'Now you\'re ready to import! Click the button below to select your CSV file.',
            icon: 'upload',
            actions: [
                { label: '📂 Select CSV File', action: 'triggerCSVFilePicker' }
            ]
        }
    ];
    
    const androidSteps = [
        {
            title: 'Step 1: Get Your CSV File',
            description: 'First, make sure you have the CSV file on your device. You can:<br>• Email yourself the CSV file and download it<br>• Download from cloud storage (Google Drive, Dropbox)<br>• Transfer via USB or Bluetooth',
            icon: 'mail',
            actions: []
        },
        {
            title: 'Step 2: File Location',
            description: 'Downloaded files typically go to:<br>• <strong>Downloads</strong> folder in your file manager<br>• You can use the <strong>Files</strong> app or <strong>My Files</strong> app to browse<br>• Files are usually in: <strong>/storage/emulated/0/Download/</strong><br><br>Remember where your file is located!',
            icon: 'folder',
            actions: []
        },
        {
            title: 'Step 3: Import Your CSV',
            description: 'Now you\'re ready to import! Click the button below to select your CSV file.',
            icon: 'upload',
            actions: [
                { label: '📂 Select CSV File', action: 'triggerCSVFilePicker' }
            ]
        }
    ];
    
    const desktopSteps = [
        {
            title: 'Step 1: Locate Your CSV File',
            description: 'Make sure you know where your CSV file is saved on your computer. Common locations:<br>• Downloads folder<br>• Documents folder<br>• Desktop<br>• Cloud storage folder (Dropbox, Google Drive, etc.)',
            icon: 'search',
            actions: []
        },
        {
            title: 'Step 2: Import Your CSV',
            description: 'Click the button below to select your CSV file.',
            icon: 'upload',
            actions: [
                { label: '📂 Select CSV File', action: 'triggerCSVFilePicker' }
            ]
        }
    ];
    
    if (device === 'iPhone' || device === 'iPad') {
        return iosSteps;
    } else if (device === 'Android Phone' || device === 'Android Tablet') {
        return androidSteps;
    } else {
        return desktopSteps;
    }
}

// ===========================
// JSON Import Wizard
// ===========================
function startJSONImportWizard() {
    hideAllWizards();
    document.getElementById('jsonImportWizard').style.display = 'block';
    
    const steps = getJSONImportSteps(currentDevice);
    renderSteps(steps, 'jsonImportSteps');
}

function getJSONImportSteps(device) {
    const commonStep = {
        title: 'Select Your Backup File',
        description: 'Choose your JSON backup file to restore all songs, chord charts, and setlists.<br><br><strong>⚠️ Warning:</strong> This will replace your current data!',
        icon: 'upload',
        actions: [
            { label: '📂 Select Backup File', action: 'triggerJSONFilePicker' }
        ]
    };
    
    return [commonStep];
}

// ===========================
// JSON Export Wizard
// ===========================
function startJSONExportWizard() {
    hideAllWizards();
    document.getElementById('jsonExportWizard').style.display = 'block';
    
    const steps = getJSONExportSteps(currentDevice);
    renderSteps(steps, 'jsonExportSteps');
}

function getJSONExportSteps(device) {
    const iosSteps = [
        {
            title: 'Step 1: Create Backup',
            description: 'Click the button below to create and download your backup file.<br><br><strong>What\'s included:</strong> All songs, chord charts, setlists, and settings.',
            icon: 'download',
            actions: [
                { label: '💾 Download Backup Now', action: 'triggerJSONExport' }
            ]
        },
        {
            title: 'Step 2: Find Downloaded File',
            description: 'Your backup file was downloaded to:<br>• Safari: <strong>Files app</strong> → <strong>"On My ' + device + '"</strong> → <strong>"Downloads"</strong><br>• Chrome: <strong>Files app</strong> → <strong>"On My ' + device + '"</strong> → <strong>"Downloads"</strong><br><br>Look for a file named <code>band-practice-manager-backup-*.json</code>',
            icon: 'search',
            actions: []
        },
        {
            title: 'Step 3: Move to iCloud Drive (Recommended)',
            description: 'For safety, move your backup to iCloud Drive:<br>1. Open the <strong>Files</strong> app<br>2. Navigate to <strong>"On My ' + device + '"</strong> → <strong>"Downloads"</strong><br>3. <strong>Long-press</strong> the backup file<br>4. Tap <strong>"Move"</strong><br>5. Choose <strong>"iCloud Drive"</strong><br>6. (Optional) Create a folder: <strong>"Band Manager Backups"</strong><br>7. Tap <strong>"Move"</strong> to confirm<br><br>Now your backup is safe in the cloud!',
            icon: 'cloud',
            actions: []
        }
    ];
    
    const androidSteps = [
        {
            title: 'Step 1: Create Backup',
            description: 'Click the button below to download your backup file.<br><br><strong>What\'s included:</strong> All songs, chord charts, setlists, and settings.',
            icon: 'download',
            actions: [
                { label: '💾 Download Backup Now', action: 'triggerJSONExport' }
            ]
        },
        {
            title: 'Step 2: Find Downloaded File',
            description: 'Your backup file was downloaded to:<br>• <strong>Downloads</strong> folder<br>• Use the <strong>Files</strong> app or <strong>My Files</strong> app<br>• Usually: <strong>/storage/emulated/0/Download/</strong><br><br>Look for a file named <code>band-practice-manager-backup-*.json</code>',
            icon: 'search',
            actions: []
        },
        {
            title: 'Step 3: Move to Cloud Storage (Recommended)',
            description: 'For safety, move your backup to cloud storage:<br>1. Open your <strong>Files</strong> app<br>2. Navigate to <strong>Downloads</strong><br>3. Long-press the backup file<br>4. Tap <strong>"Share"</strong> or <strong>"Move"</strong><br>5. Choose <strong>Google Drive</strong>, <strong>Dropbox</strong>, or another cloud service<br>6. Save in a folder like <strong>"Band Manager Backups"</strong><br><br>Your backup is now safe in the cloud!',
            icon: 'cloud',
            actions: []
        }
    ];
    
    const desktopSteps = [
        {
            title: 'Step 1: Create Backup',
            description: 'Click the button below to download your backup file.<br><br><strong>What\'s included:</strong> All songs, chord charts, setlists, and settings.',
            icon: 'download',
            actions: [
                { label: '💾 Download Backup Now', action: 'triggerJSONExport' }
            ]
        },
        {
            title: 'Step 2: Organize Your Backup',
            description: 'Consider organizing your backups:<br>1. Create a dedicated folder (e.g., <strong>"Band Manager Backups"</strong>)<br>2. Move the backup file there<br>3. Keep the last 3-4 backups<br>4. Delete older backups to save space<br><br><strong>Backup regularly:</strong> Weekly if actively updating, or before major changes!',
            icon: 'folder',
            actions: []
        },
        {
            title: 'Step 3: Cloud Backup (Recommended)',
            description: 'For extra safety, save a copy to cloud storage:<br>• <strong>Google Drive</strong><br>• <strong>Dropbox</strong><br>• <strong>OneDrive</strong><br>• <strong>iCloud Drive</strong><br><br>This protects your data even if your computer fails!',
            icon: 'cloud',
            actions: []
        }
    ];
    
    if (device === 'iPhone' || device === 'iPad') {
        return iosSteps;
    } else if (device === 'Android Phone' || device === 'Android Tablet') {
        return androidSteps;
    } else {
        return desktopSteps;
    }
}

// ===========================
// CSV Export Wizard
// ===========================
function startCSVExportWizard() {
    hideAllWizards();
    document.getElementById('csvExportWizard').style.display = 'block';
    
    const steps = [{
        title: 'Export Songs to CSV',
        description: 'Click the button below to download your songs as a CSV file. This format is great for editing in spreadsheet applications.',
        icon: 'download',
        actions: [
            { label: '📄 Download CSV File', action: 'triggerCSVExport' }
        ]
    }];
    
    renderSteps(steps, 'csvExportSteps');
}

// ===========================
// Clear All Wizard
// ===========================
function startClearAllWizard() {
    hideAllWizards();
    document.getElementById('clearAllWizard').style.display = 'block';
    
    const currentSongs = JSON.parse(localStorage.getItem('songDatabase') || '[]');
    const currentSetlists = JSON.parse(localStorage.getItem('bandSetlists') || '[]');
    
    const steps = [
        {
            title: 'Step 1: Understand What Will Be Deleted',
            description: `<strong style="color: #dc2626;">⚠️ WARNING: This action cannot be undone!</strong><br><br>The following will be permanently deleted:<br>• <strong>${currentSongs.length} songs</strong> (including chord charts)<br>• <strong>${currentSetlists.length} setlists</strong><br>• All settings and preferences<br><br><strong style="color: var(--primary-light);">💡 Tip:</strong> Create a backup first using the Export JSON Backup option!`,
            icon: 'warning',
            actions: []
        },
        {
            title: 'Step 2: Confirm Deletion',
            description: 'If you\'re absolutely sure you want to delete everything, click the button below. This action is permanent and cannot be reversed.',
            icon: 'warning',
            actions: [
                { label: '🗑️ Delete All Data', action: 'executeClearAll' }
            ]
        }
    ];
    
    renderSteps(steps, 'clearAllSteps');
}

// ===========================
// Helper Functions
// ===========================
function hideAllWizards() {
    document.getElementById('taskSelection').style.display = 'none';
    document.getElementById('csvImportWizard').style.display = 'none';
    document.getElementById('jsonImportWizard').style.display = 'none';
    document.getElementById('jsonExportWizard').style.display = 'none';
    document.getElementById('csvExportWizard').style.display = 'none';
    document.getElementById('clearAllWizard').style.display = 'none';
    document.getElementById('importPreviewPanel').style.display = 'none';
    document.getElementById('successPanel').style.display = 'none';
}

function backToTaskSelection() {
    hideAllWizards();
    document.getElementById('taskSelection').style.display = 'block';
}

// Render wizard steps
function renderSteps(steps, containerId) {
    const container = document.getElementById(containerId);
    actionCallbacks = []; // Reset action callbacks
    
    const stepsHTML = steps.map((step, index) => {
        // Store action callbacks
        if (step.actions && step.actions.length > 0) {
            actionCallbacks[index] = step.actions.map(action => {
                if (typeof action.action === 'string') {
                    return window[action.action];
                }
                return action.action;
            });
        }
        
        const actionsHTML = step.actions && step.actions.length > 0 ? step.actions.map((action, actionIndex) => 
            `<button class="btn-primary action-btn" onclick="executeAction(${index}, ${actionIndex})">
                ${action.label}
            </button>`
        ).join('') : '';
        
        return `
            <div class="wizard-step" data-step="${index}">
                <div class="step-number">${index + 1}</div>
                <div class="step-content">
                    <h3>${step.title}</h3>
                    <p>${step.description}</p>
                    ${actionsHTML}
                </div>
                <div class="step-icon">
                    ${getIconSVG(step.icon)}
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = stepsHTML;
}

// Execute action callback
function executeAction(stepIndex, actionIndex) {
    if (actionCallbacks[stepIndex] && actionCallbacks[stepIndex][actionIndex]) {
        actionCallbacks[stepIndex][actionIndex]();
    }
}

// ===========================
// File Operations
// ===========================

// CSV Import
function triggerCSVFilePicker() {
    const fileInput = document.getElementById('csvFileInput');
    fileInput.onchange = handleCSVImport;
    fileInput.click();
}

function handleCSVImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.name.endsWith('.csv')) {
        showNotification('⚠ Please select a CSV file.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csv = e.target.result;
            const lines = csv.split('\n').filter(line => line.trim());
            
            if (lines.length < 2) {
                showNotification('CSV file is empty or invalid!', 'error');
                return;
            }
            
            // Parse CSV and show preview
            const parsedSongs = parseCSVData(csv);
            showImportPreview(parsedSongs, 'csv');
            
        } catch (error) {
            console.error('CSV Import error:', error);
            showNotification('Error reading CSV file: ' + error.message, 'error');
        }
    };
    reader.readAsText(file);
    
    event.target.value = '';
}

function parseCSVData(csv) {
    const lines = csv.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const fieldMap = {
        'artist': 'artist',
        'album': 'album',
        'song': 'song',
        'link': 'link',
        'tuning': 'tuning',
        'bands': 'bands',
        'key': 'key',
        'first note': 'firstNote',
        'firstnote': 'firstNote',
        'last note': 'lastNote',
        'lastnote': 'lastNote'
    };

    const headerIndexMap = {};
    headers.forEach((header, index) => {
        const mappedField = fieldMap[header];
        if (mappedField) {
            headerIndexMap[mappedField] = index;
        }
    });

    if (headerIndexMap.artist === undefined || headerIndexMap.song === undefined) {
        throw new Error('CSV must have "Artist" and "Song" columns!');
    }

    const songs = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length === 0) continue;

        const newSong = {
            artist: values[headerIndexMap.artist]?.trim() || '',
            song: values[headerIndexMap.song]?.trim() || '',
            album: values[headerIndexMap.album]?.trim() || '',
            link: values[headerIndexMap.link]?.trim() || '',
            tuning: values[headerIndexMap.tuning]?.trim() || '',
            bands: values[headerIndexMap.bands]?.trim() || '',
            key: values[headerIndexMap.key]?.trim() || '',
            firstNote: values[headerIndexMap.firstNote]?.trim() || '',
            lastNote: values[headerIndexMap.lastNote]?.trim() || ''
        };

        if (newSong.artist && newSong.song) {
            songs.push(newSong);
        }
    }
    
    return songs;
}

function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    values.push(current);
    return values;
}

// JSON Import
function triggerJSONFilePicker() {
    const fileInput = document.getElementById('jsonFileInput');
    fileInput.onchange = handleJSONImport;
    fileInput.click();
}

function handleJSONImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.name.endsWith('.json')) {
        showNotification('⚠ Please select a JSON file.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validate structure
            if (!data.version || !data.exportDate) {
                showNotification('Invalid backup file format!', 'error');
                return;
            }
            
            // Parse nested JSON strings if needed
            let songs = data.songs;
            if (typeof songs === 'string') {
                songs = JSON.parse(songs);
            }
            
            let setlists = data.setlists;
            if (typeof setlists === 'string') {
                setlists = JSON.parse(setlists);
            }
            
            // Show preview
            showImportPreview({ songs, setlists, data }, 'json');
            
        } catch (error) {
            console.error('JSON Import error:', error);
            showNotification('Error reading backup file: ' + error.message, 'error');
        }
    };
    reader.readAsText(file);
    
    event.target.value = '';
}

// JSON Export
function triggerJSONExport() {
    const songs = localStorage.getItem('songDatabase') || localStorage.getItem('bandSongs');
    const setlists = localStorage.getItem('bandSetlists');
    const theme = localStorage.getItem('bandOrganizerTheme');
    const watermark = localStorage.getItem('watermark');
    const columnVisibility = localStorage.getItem('columnVisibility');
    const rightSidebarCollapsed = localStorage.getItem('rightSidebarCollapsed');
    
    const exportData = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        songs: songs,
        setlists: setlists,
        theme: theme,
        watermark: watermark,
        columnVisibility: columnVisibility,
        rightSidebarCollapsed: rightSidebarCollapsed
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `band-practice-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('✓ Backup downloaded successfully!', 'success');
}

// CSV Export
function triggerCSVExport() {
    const songs = JSON.parse(localStorage.getItem('songDatabase') || localStorage.getItem('bandSongs') || '[]');
    
    if (songs.length === 0) {
        showNotification('No songs to export!', 'error');
        return;
    }
    
    const headers = ['Artist', 'Song', 'Album', 'Key', 'Tuning', 'First Note', 'Last Note', 'Bands', 'Link'];
    const csvRows = [headers.join(',')];
    
    songs.forEach(song => {
        const row = [
            escapeCSV(song.artist || ''),
            escapeCSV(song.song || ''),
            escapeCSV(song.album || ''),
            escapeCSV(song.key || ''),
            escapeCSV(song.tuning || ''),
            escapeCSV(song.firstNote || ''),
            escapeCSV(song.lastNote || ''),
            escapeCSV(song.bands || ''),
            escapeCSV(song.link || '')
        ];
        csvRows.push(row.join(','));
    });
    
    const csv = csvRows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `band-practice-manager-songs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification(`✓ ${songs.length} songs exported to CSV!`, 'success');
}

function escapeCSV(value) {
    if (!value) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

// Clear All Data
function executeClearAll() {
    const confirmMsg = 'Type "DELETE ALL" to confirm that you want to permanently delete all your data:';
    const userInput = prompt(confirmMsg);
    
    if (userInput !== 'DELETE ALL') {
        showNotification('Clear all cancelled - data is safe.', 'success');
        return;
    }
    
    // Clear all localStorage
    localStorage.removeItem('songDatabase');
    localStorage.removeItem('bandSongs');
    localStorage.removeItem('bandSetlists');
    localStorage.removeItem('songTrash');
    localStorage.removeItem('bandSongsTrash');
    
    showSuccessPanel(
        '🗑️ All Data Cleared',
        'All songs, chord charts, setlists, and trash have been permanently deleted.'
    );
}

// ===========================
// Import Preview
// ===========================
function showImportPreview(data, type) {
    hideAllWizards();
    
    if (type === 'csv') {
        pendingImportData = { songs: data, type: 'csv' };
        
        const statsHTML = `
            <div class="preview-stat">
                <div class="preview-stat-number">${data.length}</div>
                <div class="preview-stat-label">Songs to Import</div>
            </div>
        `;
        
        document.getElementById('previewStats').innerHTML = statsHTML;
    } else if (type === 'json') {
        pendingImportData = { ...data, type: 'json' };
        
        const songsCount = Array.isArray(data.songs) ? data.songs.length : 0;
        const setlistsCount = Array.isArray(data.setlists) ? data.setlists.length : 0;
        
        const statsHTML = `
            <div class="preview-stat">
                <div class="preview-stat-number">${songsCount}</div>
                <div class="preview-stat-label">Songs (with chord charts)</div>
            </div>
            <div class="preview-stat">
                <div class="preview-stat-number">${setlistsCount}</div>
                <div class="preview-stat-label">Setlists</div>
            </div>
        `;
        
        document.getElementById('previewStats').innerHTML = statsHTML;
    }
    
    document.getElementById('importPreviewPanel').style.display = 'flex';
}

function confirmImportPreview() {
    if (!pendingImportData) return;
    
    try {
        if (pendingImportData.type === 'csv') {
            // Append to existing songs
            const existing = JSON.parse(localStorage.getItem('songDatabase') || '[]');
            const combined = [...existing, ...pendingImportData.songs];
            
            localStorage.setItem('songDatabase', JSON.stringify(combined));
            localStorage.setItem('bandSongs', JSON.stringify(combined));
            
            // Verify write
            const verify = localStorage.getItem('songDatabase');
            if (!verify) {
                throw new Error('Failed to write to localStorage');
            }
            
            showSuccessPanel(
                '✓ CSV Import Successful!',
                `${pendingImportData.songs.length} songs imported successfully.`
            );
        } else if (pendingImportData.type === 'json') {
            // Replace all data
            const { songs, setlists, data } = pendingImportData;
            
            if (songs && Array.isArray(songs)) {
                localStorage.setItem('songDatabase', JSON.stringify(songs));
                localStorage.setItem('bandSongs', JSON.stringify(songs));
            }
            
            if (setlists) {
                if (typeof setlists === 'string') {
                    localStorage.setItem('bandSetlists', setlists);
                } else {
                    localStorage.setItem('bandSetlists', JSON.stringify(setlists));
                }
            }
            
            // Restore settings
            if (data.theme) localStorage.setItem('bandOrganizerTheme', data.theme);
            if (data.watermark) localStorage.setItem('watermark', data.watermark);
            if (data.columnVisibility) localStorage.setItem('columnVisibility', data.columnVisibility);
            if (data.rightSidebarCollapsed) localStorage.setItem('rightSidebarCollapsed', data.rightSidebarCollapsed);
            
            // Verify write
            const verify = localStorage.getItem('songDatabase');
            if (!verify) {
                throw new Error('Failed to write to localStorage');
            }
            
            const songsCount = Array.isArray(songs) ? songs.length : 0;
            const setlistsCount = Array.isArray(setlists) ? setlists.length : 0;
            
            showSuccessPanel(
                '✓ JSON Restore Successful!',
                `${songsCount} songs and ${setlistsCount} setlists restored successfully.`
            );
        }
        
        pendingImportData = null;
        
    } catch (error) {
        console.error('Import confirmation error:', error);
        showNotification('Error: ' + error.message, 'error');
    }
}

function cancelImportPreview() {
    pendingImportData = null;
    document.getElementById('importPreviewPanel').style.display = 'none';
    backToTaskSelection();
}

// ===========================
// Success Panel
// ===========================
function showSuccessPanel(title, message) {
    hideAllWizards();
    
    document.getElementById('successTitle').textContent = title;
    document.getElementById('successMessage').textContent = message;
    document.getElementById('successPanel').style.display = 'flex';
}

function goToSongManager() {
    window.location.href = 'song-manager.html';
}

// ===========================
// Notifications
// ===========================
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const messageEl = document.getElementById('notificationMessage');
    
    messageEl.textContent = message;
    notification.className = 'notification-toast ' + type + ' show';
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// ===========================
// Navigation
// ===========================
function goBack() {
    if (window.opener) {
        window.close();
    } else {
        window.location.href = 'song-manager.html';
    }
}

