/**
 * UI Utilities - Loading indicators, toasts, and visual feedback
 */

/**
 * Toast notification system
 */
export class ToastManager {
    constructor() {
        this.container = null;
        this.toasts = [];
        this.init();
    }

    init() {
        // Create toast container if it doesn't exist
        this.container = document.querySelector('.toast-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    }

    /**
     * Show a toast notification
     * @param {string} message - Message to display
     * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
     * @param {number} duration - Duration in ms (0 = persistent)
     */
    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = this.getIcon(type);
        const text = document.createElement('span');
        text.textContent = message;
        
        toast.appendChild(icon);
        toast.appendChild(text);
        
        this.container.appendChild(toast);
        this.toasts.push(toast);
        
        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                this.remove(toast);
            }, duration);
        }
        
        return toast;
    }

    /**
     * Get icon element for toast type
     */
    getIcon(type) {
        const icon = document.createElement('span');
        icon.style.fontSize = '18px';
        
        switch (type) {
            case 'success':
                icon.textContent = '✓';
                icon.style.color = '#4ade80';
                break;
            case 'error':
                icon.textContent = '✕';
                icon.style.color = '#ff6b3d';
                break;
            case 'warning':
                icon.textContent = '⚠';
                icon.style.color = '#fbbf24';
                break;
            case 'info':
            default:
                icon.textContent = 'ℹ';
                icon.style.color = '#60a5fa';
                break;
        }
        
        return icon;
    }

    /**
     * Remove a toast
     */
    remove(toast) {
        toast.classList.add('hiding');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            const index = this.toasts.indexOf(toast);
            if (index > -1) {
                this.toasts.splice(index, 1);
            }
        }, 300);
    }

    /**
     * Clear all toasts
     */
    clearAll() {
        this.toasts.forEach(toast => this.remove(toast));
    }

    // Convenience methods
    success(message, duration = 3000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 5000) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration = 4000) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 3000) {
        return this.show(message, 'info', duration);
    }
}

// Global toast instance
export const toast = new ToastManager();

/**
 * Loading overlay manager
 */
export class LoadingManager {
    constructor() {
        this.overlay = null;
        this.activeLoaders = 0;
    }

    /**
     * Show loading overlay
     * @param {string} message - Optional loading message
     */
    show(message = 'Loading...') {
        this.activeLoaders++;
        
        if (!this.overlay) {
            this.overlay = document.createElement('div');
            this.overlay.className = 'loading-overlay';
            
            const spinner = document.createElement('div');
            spinner.className = 'loading-spinner';
            
            const text = document.createElement('div');
            text.className = 'loading-text';
            text.textContent = message;
            text.style.color = 'var(--primary-light)';
            text.style.marginTop = '15px';
            text.style.fontSize = '14px';
            
            const container = document.createElement('div');
            container.style.textAlign = 'center';
            container.appendChild(spinner);
            container.appendChild(text);
            
            this.overlay.appendChild(container);
            document.body.appendChild(this.overlay);
        }
    }

    /**
     * Hide loading overlay
     */
    hide() {
        this.activeLoaders = Math.max(0, this.activeLoaders - 1);
        
        if (this.activeLoaders === 0 && this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
            this.overlay = null;
        }
    }

    /**
     * Force hide all loaders
     */
    hideAll() {
        this.activeLoaders = 0;
        this.hide();
    }
}

// Global loading instance
export const loading = new LoadingManager();

/**
 * Progress bar manager
 */
export class ProgressManager {
    constructor(containerId = 'progressModal') {
        this.containerId = containerId;
        this.modal = null;
        this.progressBar = null;
        this.titleEl = null;
        this.messageEl = null;
        this.statsEl = null;
        this.cancelBtn = null;
        this.onCancel = null;
    }

    /**
     * Show progress modal
     * @param {string} title - Progress title
     * @param {string} message - Progress message
     * @param {Function} onCancel - Cancel callback
     */
    show(title = 'Processing...', message = '', onCancel = null) {
        this.modal = document.getElementById(this.containerId);
        if (!this.modal) {
            console.error('Progress modal not found');
            return;
        }
        
        this.progressBar = this.modal.querySelector('#progressBar');
        this.titleEl = this.modal.querySelector('#progressTitle');
        this.messageEl = this.modal.querySelector('#progressMessage');
        this.statsEl = this.modal.querySelector('#progressStats');
        this.cancelBtn = this.modal.querySelector('#progressCancelBtn');
        
        if (this.titleEl) this.titleEl.textContent = title;
        if (this.messageEl) this.messageEl.textContent = message;
        if (this.statsEl) this.statsEl.textContent = '';
        if (this.progressBar) this.progressBar.style.width = '0%';
        
        this.onCancel = onCancel;
        
        if (this.cancelBtn) {
            if (onCancel) {
                this.cancelBtn.style.display = 'inline-block';
                this.cancelBtn.onclick = () => {
                    if (this.onCancel) {
                        this.onCancel();
                    }
                };
            } else {
                this.cancelBtn.style.display = 'none';
            }
        }
        
        this.modal.style.display = 'flex';
    }

    /**
     * Update progress
     * @param {number} percent - Progress percentage (0-100)
     * @param {string} message - Updated message
     * @param {string} stats - Stats text
     */
    update(percent, message = null, stats = null) {
        if (this.progressBar) {
            this.progressBar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
        }
        
        if (message && this.messageEl) {
            this.messageEl.textContent = message;
        }
        
        if (stats && this.statsEl) {
            this.statsEl.textContent = stats;
        }
    }

    /**
     * Hide progress modal
     */
    hide() {
        if (this.modal) {
            this.modal.style.display = 'none';
        }
        this.onCancel = null;
    }
}

// Global progress instance
export const progress = new ProgressManager();

/**
 * Skeleton loader generator
 */
export function createSkeletonLoader(width = '100%', height = '20px') {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-loader';
    skeleton.style.width = width;
    skeleton.style.height = height;
    return skeleton;
}

/**
 * Create skeleton table rows
 */
export function createSkeletonTable(rows = 10, columns = 5) {
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');
        
        for (let j = 0; j < columns; j++) {
            const td = document.createElement('td');
            td.style.padding = '8px 12px';
            td.appendChild(createSkeletonLoader('80%', '16px'));
            tr.appendChild(td);
        }
        
        fragment.appendChild(tr);
    }
    
    return fragment;
}

/**
 * Debounce helper with visual feedback
 */
export function debounceWithFeedback(func, wait, feedbackEl = null) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            if (feedbackEl) {
                feedbackEl.classList.remove('searching');
            }
            func(...args);
        };
        
        clearTimeout(timeout);
        
        if (feedbackEl) {
            feedbackEl.classList.add('searching');
        }
        
        timeout = setTimeout(later, wait);
    };
}

/**
 * Confirm dialog with custom styling
 */
export function confirm(message, title = 'Confirm') {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        
        const content = document.createElement('div');
        content.className = 'modal-content';
        content.style.maxWidth = '400px';
        
        const header = document.createElement('div');
        header.className = 'modal-header';
        const h2 = document.createElement('h2');
        h2.textContent = title;
        header.appendChild(h2);
        
        const body = document.createElement('div');
        body.className = 'modal-body';
        body.style.padding = '20px';
        body.textContent = message;
        
        const footer = document.createElement('div');
        footer.className = 'modal-footer';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.onclick = () => {
            document.body.removeChild(modal);
            resolve(false);
        };
        
        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'btn btn-danger';
        confirmBtn.textContent = 'Confirm';
        confirmBtn.onclick = () => {
            document.body.removeChild(modal);
            resolve(true);
        };
        
        footer.appendChild(cancelBtn);
        footer.appendChild(confirmBtn);
        
        content.appendChild(header);
        content.appendChild(body);
        content.appendChild(footer);
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Focus confirm button
        confirmBtn.focus();
        
        // ESC to cancel
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', handleEsc);
                resolve(false);
            }
        };
        document.addEventListener('keydown', handleEsc);
    });
}

/**
 * Keyboard shortcut manager
 */
export class KeyboardShortcutManager {
    constructor() {
        this.shortcuts = new Map();
        this.init();
    }

    init() {
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    /**
     * Register a keyboard shortcut
     * @param {string} key - Key combination (e.g., 'Ctrl+S', 'Ctrl+F')
     * @param {Function} callback - Callback function
     * @param {string} description - Description for help
     */
    register(key, callback, description = '') {
        this.shortcuts.set(key.toLowerCase(), { callback, description });
    }

    /**
     * Unregister a shortcut
     */
    unregister(key) {
        this.shortcuts.delete(key.toLowerCase());
    }

    /**
     * Handle keydown events
     */
    handleKeydown(e) {
        // Don't trigger if typing in input/textarea
        if (e.target.tagName === 'INPUT' || 
            e.target.tagName === 'TEXTAREA' ||
            e.target.isContentEditable) {
            return;
        }
        
        let key = '';
        
        if (e.ctrlKey || e.metaKey) key += 'Ctrl+';
        if (e.altKey) key += 'Alt+';
        if (e.shiftKey) key += 'Shift+';
        
        key += e.key.toUpperCase();
        
        const shortcut = this.shortcuts.get(key.toLowerCase());
        
        if (shortcut) {
            e.preventDefault();
            shortcut.callback(e);
        }
    }

    /**
     * Get all registered shortcuts
     */
    getShortcuts() {
        return Array.from(this.shortcuts.entries()).map(([key, data]) => ({
            key,
            description: data.description
        }));
    }
}

// Global keyboard shortcut manager
export const keyboard = new KeyboardShortcutManager();

