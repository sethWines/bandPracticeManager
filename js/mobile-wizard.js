/**
 * Mobile Guide Wizard
 * Interactive step-by-step guide for importing files and managing backups on mobile devices
 */

let currentDevice = 'Desktop';
let actionCallbacks = [];

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
        `
    };
    
    return icons[iconName] || icons['file'];
}

// Start Import Wizard
function startImportWizard() {
    document.getElementById('taskSelection').style.display = 'none';
    document.getElementById('importWizard').style.display = 'block';
    
    const steps = getImportSteps(currentDevice);
    renderSteps(steps, 'importSteps');
}

// Start Backup Wizard
function startBackupWizard() {
    document.getElementById('taskSelection').style.display = 'none';
    document.getElementById('backupWizard').style.display = 'block';
    
    const steps = getBackupSteps(currentDevice);
    renderSteps(steps, 'backupSteps');
}

// Back to task selection
function backToTaskSelection() {
    document.getElementById('taskSelection').style.display = 'block';
    document.getElementById('importWizard').style.display = 'none';
    document.getElementById('backupWizard').style.display = 'none';
}

// Get import steps based on device
function getImportSteps(device) {
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
            title: 'Step 3: Import in Band Manager',
            description: 'Now you\'re ready to import! Click the button below to select your CSV file. The file will be ready for import when you open Song Manager.',
            icon: 'upload',
            actions: [
                { label: '📂 Open File Picker', action: 'triggerFilePicker' }
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
            title: 'Step 3: Import in Band Manager',
            description: 'Now you\'re ready to import! Click the button below to select your CSV file. The file will be ready for import when you open Song Manager.',
            icon: 'upload',
            actions: [
                { label: '📂 Open File Picker', action: 'triggerFilePicker' }
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
            title: 'Step 2: Import in Band Manager',
            description: 'Click the button below to select your CSV file. The file will be ready for import when you open Song Manager.',
            icon: 'upload',
            actions: [
                { label: '📂 Open File Picker', action: 'triggerFilePicker' }
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

// Get backup steps based on device
function getBackupSteps(device) {
    const iosSteps = [
        {
            title: 'Step 1: Create Backup',
            description: 'Click the button below to create and download your backup file. If Song Manager is open, the backup will start immediately. Otherwise, you\'ll be taken to Song Manager to complete the backup.<br><br><strong>What\'s included:</strong> All songs, setlists, settings, and preferences.',
            icon: 'download',
            actions: [
                { label: '💾 Download Backup Now', action: 'triggerBackup' }
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
            description: 'Click the button below to download your backup file. The file will be saved with today\'s date in the filename.<br><br><strong>What\'s included:</strong> All songs, setlists, settings, and preferences.',
            icon: 'download',
            actions: [
                { label: '💾 Download Backup Now', action: 'triggerBackup' }
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
            description: 'Click the button below to download your backup file. The browser will save it to your default downloads location (usually your Downloads folder).<br><br><strong>What\'s included:</strong> All songs, setlists, settings, and preferences.',
            icon: 'download',
            actions: [
                { label: '💾 Download Backup Now', action: 'triggerBackup' }
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

// Trigger file picker in parent window OR standalone
function triggerFilePicker() {
    // First, try to trigger in parent window (if opened from Song Manager)
    if (window.opener) {
        try {
            const csvFileInput = window.opener.document.getElementById('csvFile');
            if (csvFileInput) {
                csvFileInput.click();
                showNotification('✓ File picker opened in Song Manager. Select your CSV file.');
                return;
            }
        } catch (e) {
            // Parent window access failed, fall through to standalone mode
        }
    }
    
    // Standalone mode - use our own file input
    const fileInput = document.getElementById('csvFileInput');
    if (fileInput) {
        fileInput.onchange = handleCSVImport;
        fileInput.click();
        showNotification('✓ Select your CSV file to import.');
    } else {
        showNotification('⚠ File picker not available.', 'error');
    }
}

// Handle CSV import in standalone mode
function handleCSVImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.name.endsWith('.csv')) {
        showNotification('⚠ Please select a CSV file.', 'error');
        return;
    }
    
    showNotification('✓ CSV file selected: ' + file.name + '. Redirecting to Song Manager...', 'success');
    
    // Store file info in localStorage for Song Manager to pick up
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            localStorage.setItem('pendingCSVImport', e.target.result);
            localStorage.setItem('pendingCSVFilename', file.name);
            
            // Redirect to Song Manager after a brief delay
            setTimeout(() => {
                window.location.href = 'song-manager.html';
            }, 800);
        } catch (err) {
            showNotification('⚠ File too large for browser storage. Please use Song Manager directly.', 'error');
        }
    };
    reader.readAsText(file);
    
    // Clear the input for next use
    event.target.value = '';
}

// Trigger backup in parent window OR provide download link
function triggerBackup() {
    // First, try to trigger in parent window (if opened from Song Manager)
    if (window.opener) {
        try {
            if (typeof window.opener.exportAllData === 'function') {
                window.opener.exportAllData();
                showNotification('✓ Backup download started! Check your downloads folder.');
                return;
            }
        } catch (e) {
            // Parent window access failed, fall through to standalone mode
        }
    }
    
    // Standalone mode - redirect to Song Manager with backup action
    showNotification('📱 Opening Song Manager to create backup...', 'success');
    setTimeout(() => {
        window.location.href = 'song-manager.html?action=backup';
    }, 1500);
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const messageEl = document.getElementById('notificationMessage');
    
    messageEl.textContent = message;
    notification.className = 'notification-toast ' + type + ' show';
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// Go back to Song Manager
function goBack() {
    if (window.opener) {
        window.close();
    } else {
        // Fallback if opened directly
        window.location.href = 'song-manager.html';
    }
}

