/**
 * Version Management
 * Adds version tag to page headers (file:// compatible)
 */

async function getVersion() {
    const isFileProtocol = window.location.protocol === 'file:';

    if (!isFileProtocol) {
        try {
            const response = await fetch('./version.txt').catch(() => null);
            if (response && response.ok) {
                const version = await response.text();
                return version.trim();
            }
        } catch (e) {
            // use fallback
        }
    }

    const metaVersion = document.querySelector('meta[name="app-version"]');
    if (metaVersion) {
        return metaVersion.content;
    }

    return 'v2.3.0';
}

async function addVersionToTitle() {
    const version = await getVersion();
    const titleElement = document.querySelector('title');

    if (titleElement) {
        const currentTitle = titleElement.textContent;
        if (!currentTitle.includes('[')) {
            titleElement.textContent = `${currentTitle} [${version}]`;
        }
    }

    const h1Element = document.querySelector('.header h1, header h1');
    if (!h1Element || h1Element.querySelector('.version-tag')) {
        return;
    }

    let titleTextNode = null;
    for (let node of h1Element.childNodes) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            titleTextNode = node;
            break;
        }
    }

    if (!titleTextNode) {
        return;
    }

    const titleBlock = document.createElement('span');
    titleBlock.className = 'header-title-block';

    const titleText = document.createElement('span');
    titleText.className = 'header-title-text';
    titleText.textContent = titleTextNode.textContent.trim();

    const versionSpan = document.createElement('span');
    versionSpan.className = 'version-tag';
    versionSpan.textContent = version;

    titleBlock.appendChild(titleText);
    titleBlock.appendChild(versionSpan);
    titleTextNode.replaceWith(titleBlock);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addVersionToTitle);
} else {
    addVersionToTitle();
}

window.BandPracticeManager = window.BandPracticeManager || {};
window.BandPracticeManager.getVersion = getVersion;
window.BandPracticeManager.addVersionToTitle = addVersionToTitle;

function autoSaveActiveConfig() {
    try {
        const configManagerData = localStorage.getItem('configManager');
        if (!configManagerData) return;

        const configManager = JSON.parse(configManagerData);
        if (!configManager.activeConfigId) return;

        const activeConfig = configManager.configurations.find(c => c.id === configManager.activeConfigId);
        if (!activeConfig) return;

        const songs = localStorage.getItem('songDatabase') || localStorage.getItem('bandSongs');
        const setlists = localStorage.getItem('bandSetlists');
        const theme = localStorage.getItem('bandOrganizerTheme');
        const watermark = localStorage.getItem('watermark');
        const columnVisibility = localStorage.getItem('columnVisibility');
        const rightSidebarCollapsed = localStorage.getItem('rightSidebarCollapsed');

        activeConfig.data = {
            songs: songs,
            setlists: setlists,
            theme: theme,
            watermark: watermark,
            columnVisibility: columnVisibility,
            rightSidebarCollapsed: rightSidebarCollapsed
        };
        activeConfig.lastModified = new Date().toISOString();

        localStorage.setItem('configManager', JSON.stringify(configManager));
    } catch (error) {
        console.error('Error auto-saving config:', error);
    }
}

window.addEventListener('beforeunload', autoSaveActiveConfig);
setInterval(autoSaveActiveConfig, 30000);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoSaveActiveConfig);
} else {
    autoSaveActiveConfig();
}
