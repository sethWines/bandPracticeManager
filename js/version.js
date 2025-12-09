/**
 * Version Management
 * Adds git branch/version tag to page titles
 */

// Get version from git branch or fallback
async function getVersion() {
    // Check if we're on file:// protocol (local files)
    const isFileProtocol = window.location.protocol === 'file:';
    
    // Only try to fetch if we're on http/https (not file://)
    if (!isFileProtocol) {
        try {
            // Try to get version from a generated version file (if exists)
            const response = await fetch('./version.txt').catch(() => null);
            if (response && response.ok) {
                const version = await response.text();
                return version.trim();
            }
        } catch (e) {
            // Silently fail - will use fallback below
        }
    }
    
    // Fallback: try to parse from git branch in document
    // This will be set during build or can be manually updated
    const metaVersion = document.querySelector('meta[name="app-version"]');
    if (metaVersion) {
        return metaVersion.content;
    }
    
    // Default fallback
    return 'v2.1.0';
}

// Add version to page title
async function addVersionToTitle() {
    const version = await getVersion();
    const titleElement = document.querySelector('title');
    
    if (titleElement) {
        const currentTitle = titleElement.textContent;
        // Only add version if not already present
        if (!currentTitle.includes('[')) {
            titleElement.textContent = `${currentTitle} [${version}]`;
        }
    }
    
    // Add version tag below the title text (right-aligned to title width)
    const h1Element = document.querySelector('.header h1, header h1, h1');
    if (h1Element && !h1Element.querySelector('.version-tag')) {
        // Find the text node with the title
        let titleTextNode = null;
        for (let node of h1Element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                titleTextNode = node;
                break;
            }
        }
        
        if (titleTextNode) {
            // Wrap title text and version in a container
            const titleContent = document.createElement('div');
            titleContent.style.display = 'inline-flex';
            titleContent.style.flexDirection = 'column';
            titleContent.style.alignItems = 'flex-end';  // Right-align within the title width
            titleContent.style.gap = '2px';
            
            const titleText = document.createElement('span');
            titleText.textContent = titleTextNode.textContent;
            titleText.style.whiteSpace = 'nowrap';
            
            const versionSpan = document.createElement('span');
            versionSpan.className = 'version-tag';
            versionSpan.textContent = version;
            
            // Style the version tag (bolder and right-aligned to title)
            versionSpan.style.fontSize = '0.45em';
            versionSpan.style.opacity = '0.7';
            versionSpan.style.fontWeight = '600';
            versionSpan.style.letterSpacing = '0.5px';
            versionSpan.style.whiteSpace = 'nowrap';
            
            titleContent.appendChild(titleText);
            titleContent.appendChild(versionSpan);
            
            titleTextNode.replaceWith(titleContent);
        }
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addVersionToTitle);
} else {
    addVersionToTitle();
}

// Export for manual use if needed
window.BandPracticeManager = window.BandPracticeManager || {};
window.BandPracticeManager.getVersion = getVersion;
window.BandPracticeManager.addVersionToTitle = addVersionToTitle;

