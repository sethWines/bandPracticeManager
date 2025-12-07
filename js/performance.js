/**
 * Performance Monitoring Utilities
 * Tracks and reports on app performance metrics
 */

export class PerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoad: null,
            domReady: null,
            firstContentfulPaint: null,
            renderTimes: [],
            searchTimes: [],
            saveTimes: []
        };
        
        this.init();
    }

    init() {
        // Capture page load metrics
        if (window.performance && window.performance.timing) {
            window.addEventListener('load', () => {
                this.captureLoadMetrics();
            });
        }
        
        // Observe First Contentful Paint
        this.observeFCP();
    }

    /**
     * Capture page load metrics
     */
    captureLoadMetrics() {
        const perfData = window.performance.timing;
        const navigationStart = perfData.navigationStart;
        
        this.metrics.pageLoad = perfData.loadEventEnd - navigationStart;
        this.metrics.domReady = perfData.domContentLoadedEventEnd - navigationStart;
        
        console.log(`⚡ Page Load: ${this.metrics.pageLoad}ms`);
        console.log(`⚡ DOM Ready: ${this.metrics.domReady}ms`);
    }

    /**
     * Observe First Contentful Paint
     */
    observeFCP() {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.name === 'first-contentful-paint') {
                            this.metrics.firstContentfulPaint = entry.startTime;
                            console.log(`⚡ First Contentful Paint: ${entry.startTime.toFixed(2)}ms`);
                        }
                    }
                });
                
                observer.observe({ entryTypes: ['paint'] });
            } catch (e) {
                // PerformanceObserver not supported
            }
        }
    }

    /**
     * Measure function execution time
     * @param {string} name - Operation name
     * @param {Function} fn - Function to measure
     * @returns {*} Function result
     */
    async measure(name, fn) {
        const start = performance.now();
        
        try {
            const result = await fn();
            const duration = performance.now() - start;
            
            this.recordMetric(name, duration);
            
            if (duration > 100) {
                console.warn(`⚠️ Slow operation: ${name} took ${duration.toFixed(2)}ms`);
            } else {
                console.log(`⚡ ${name}: ${duration.toFixed(2)}ms`);
            }
            
            return result;
        } catch (error) {
            const duration = performance.now() - start;
            console.error(`❌ ${name} failed after ${duration.toFixed(2)}ms:`, error);
            throw error;
        }
    }

    /**
     * Record a metric
     */
    recordMetric(name, duration) {
        const category = this.categorizeMetric(name);
        
        if (category && this.metrics[category]) {
            this.metrics[category].push({
                timestamp: Date.now(),
                duration
            });
            
            // Keep only last 100 measurements
            if (this.metrics[category].length > 100) {
                this.metrics[category].shift();
            }
        }
    }

    /**
     * Categorize metric by name
     */
    categorizeMetric(name) {
        const lowerName = name.toLowerCase();
        
        if (lowerName.includes('render')) return 'renderTimes';
        if (lowerName.includes('search')) return 'searchTimes';
        if (lowerName.includes('save')) return 'saveTimes';
        
        return null;
    }

    /**
     * Get average time for a category
     */
    getAverageTime(category) {
        const times = this.metrics[category];
        if (!times || times.length === 0) return 0;
        
        const sum = times.reduce((acc, t) => acc + t.duration, 0);
        return sum / times.length;
    }

    /**
     * Get memory usage (if available)
     */
    getMemoryUsage() {
        if (performance.memory) {
            return {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit,
                usedMB: (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2),
                totalMB: (performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2),
                limitMB: (performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2),
                percentUsed: ((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100).toFixed(1)
            };
        }
        
        return null;
    }

    /**
     * Get DOM statistics
     */
    getDOMStats() {
        return {
            totalNodes: document.getElementsByTagName('*').length,
            bodyNodes: document.body.getElementsByTagName('*').length,
            divs: document.getElementsByTagName('div').length,
            tables: document.getElementsByTagName('table').length,
            tableRows: document.getElementsByTagName('tr').length
        };
    }

    /**
     * Generate performance report
     */
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            load: {
                pageLoad: this.metrics.pageLoad,
                domReady: this.metrics.domReady,
                firstContentfulPaint: this.metrics.firstContentfulPaint
            },
            operations: {
                avgRenderTime: this.getAverageTime('renderTimes'),
                avgSearchTime: this.getAverageTime('searchTimes'),
                avgSaveTime: this.getAverageTime('saveTimes'),
                renderCount: this.metrics.renderTimes.length,
                searchCount: this.metrics.searchTimes.length,
                saveCount: this.metrics.saveTimes.length
            },
            memory: this.getMemoryUsage(),
            dom: this.getDOMStats()
        };
        
        return report;
    }

    /**
     * Log performance report to console
     */
    logReport() {
        const report = this.generateReport();
        
        console.group('⚡ Performance Report');
        console.log('Load Metrics:', report.load);
        console.log('Operation Metrics:', report.operations);
        console.log('Memory Usage:', report.memory);
        console.log('DOM Stats:', report.dom);
        console.groupEnd();
        
        return report;
    }

    /**
     * Start continuous monitoring (updates every second)
     */
    startContinuousMonitoring(callback) {
        this.monitoringInterval = setInterval(() => {
            const report = this.generateReport();
            if (callback) {
                callback(report);
            }
        }, 1000);
    }

    /**
     * Stop continuous monitoring
     */
    stopContinuousMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
    }

    /**
     * Mark a custom performance mark
     */
    mark(name) {
        if (window.performance && performance.mark) {
            performance.mark(name);
        }
    }

    /**
     * Measure between two marks
     */
    measureBetween(name, startMark, endMark) {
        if (window.performance && performance.measure) {
            try {
                performance.measure(name, startMark, endMark);
                const measures = performance.getEntriesByName(name);
                if (measures.length > 0) {
                    const duration = measures[measures.length - 1].duration;
                    console.log(`⚡ ${name}: ${duration.toFixed(2)}ms`);
                    return duration;
                }
            } catch (e) {
                console.warn('Performance measurement failed:', e);
            }
        }
        return null;
    }

    /**
     * Clear all performance marks and measures
     */
    clearMarks() {
        if (window.performance) {
            performance.clearMarks();
            performance.clearMeasures();
        }
    }
}

// Global performance monitor instance
export const perfMonitor = new PerformanceMonitor();

/**
 * Decorator function to measure method performance
 * Usage: @measurePerformance('OperationName')
 */
export function measurePerformance(name) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        
        descriptor.value = async function (...args) {
            return perfMonitor.measure(name || propertyKey, async () => {
                return originalMethod.apply(this, args);
            });
        };
        
        return descriptor;
    };
}

/**
 * Simple performance wrapper function
 * @param {string} name - Operation name
 * @param {Function} fn - Function to wrap
 * @returns {Function} Wrapped function
 */
export function withPerformanceTracking(name, fn) {
    return async (...args) => {
        return perfMonitor.measure(name, async () => {
            return fn(...args);
        });
    };
}

/**
 * Log slow operations warning
 * @param {number} threshold - Threshold in ms (default 100)
 */
export function enableSlowOperationLogging(threshold = 100) {
    if (!window.performance || !performance.observe) return;
    
    try {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.duration > threshold) {
                    console.warn(
                        `⚠️ Slow operation detected: ${entry.name} took ${entry.duration.toFixed(2)}ms`,
                        entry
                    );
                }
            }
        });
        
        observer.observe({ entryTypes: ['measure'] });
        console.log(`⚡ Slow operation logging enabled (threshold: ${threshold}ms)`);
    } catch (e) {
        console.warn('Performance observation not supported:', e);
    }
}

/**
 * Measure frame rate
 */
export class FPSMonitor {
    constructor() {
        this.fps = 0;
        this.frames = 0;
        this.lastTime = performance.now();
        this.running = false;
    }

    start() {
        this.running = true;
        this.measure();
    }

    stop() {
        this.running = false;
    }

    measure() {
        if (!this.running) return;
        
        this.frames++;
        const currentTime = performance.now();
        
        if (currentTime >= this.lastTime + 1000) {
            this.fps = Math.round((this.frames * 1000) / (currentTime - this.lastTime));
            this.frames = 0;
            this.lastTime = currentTime;
        }
        
        requestAnimationFrame(() => this.measure());
    }

    getFPS() {
        return this.fps;
    }
}

