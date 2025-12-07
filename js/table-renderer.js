/**
 * Table Renderer with Virtual Scrolling
 * Efficiently renders large tables by only displaying visible rows
 */

export class TableRenderer {
    constructor(containerEl, options = {}) {
        this.container = containerEl;
        this.options = {
            rowHeight: 40, // Default row height in pixels
            buffer: 5,      // Number of extra rows to render above/below viewport
            columns: [],
            onRowClick: null,
            onRowSelect: null,
            selectable: true,
            ...options
        };
        
        this.data = [];
        this.selectedRows = new Set();
        this.hiddenColumns = new Set();
        this.sortColumn = null;
        this.sortDirection = 'asc';
        
        // Virtual scrolling state
        this.scrollTop = 0;
        this.viewportHeight = 0;
        this.totalHeight = 0;
        this.visibleStart = 0;
        this.visibleEnd = 0;
        
        this.init();
    }

    /**
     * Initialize the table structure
     */
    init() {
        this.container.innerHTML = '';
        this.container.className = 'virtual-table';
        
        // Create wrapper for sticky header
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'virtual-table-wrapper';
        
        // Header container (sticky)
        this.headerContainer = document.createElement('div');
        this.headerContainer.className = 'virtual-table-header';
        
        // Body container (scrollable)
        this.bodyContainer = document.createElement('div');
        this.bodyContainer.className = 'virtual-table-body';
        
        // Spacer div for total height (enables proper scrollbar)
        this.spacer = document.createElement('div');
        this.spacer.className = 'virtual-table-spacer';
        this.spacer.style.position = 'absolute';
        this.spacer.style.top = '0';
        this.spacer.style.left = '0';
        this.spacer.style.width = '1px';
        this.spacer.style.pointerEvents = 'none';
        
        // Content container (holds visible rows)
        this.contentContainer = document.createElement('div');
        this.contentContainer.className = 'virtual-table-content';
        this.contentContainer.style.position = 'relative';
        
        this.bodyContainer.appendChild(this.spacer);
        this.bodyContainer.appendChild(this.contentContainer);
        
        this.wrapper.appendChild(this.headerContainer);
        this.wrapper.appendChild(this.bodyContainer);
        this.container.appendChild(this.wrapper);
        
        // Setup scroll listener
        this.bodyContainer.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Render header
        this.renderHeader();
        
        // Measure viewport height
        this.updateViewportHeight();
    }

    /**
     * Update viewport height measurement
     */
    updateViewportHeight() {
        this.viewportHeight = this.bodyContainer.clientHeight;
    }

    /**
     * Render table header
     */
    renderHeader() {
        const table = document.createElement('table');
        table.className = 'table-header';
        
        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        
        // Checkbox column
        if (this.options.selectable) {
            const th = document.createElement('th');
            th.className = 'col-checkbox';
            th.style.width = '40px';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = 'selectAll';
            checkbox.addEventListener('change', (e) => this.handleSelectAll(e.target.checked));
            
            th.appendChild(checkbox);
            tr.appendChild(th);
        }
        
        // Data columns
        this.options.columns.forEach(col => {
            if (this.hiddenColumns.has(col.key)) return;
            
            const th = document.createElement('th');
            th.className = `col-${col.key}`;
            th.style.width = col.width || 'auto';
            th.dataset.column = col.key;
            
            // Header content
            const headerContent = document.createElement('div');
            headerContent.className = 'header-content';
            headerContent.textContent = col.label;
            
            // Sort indicator
            if (col.sortable !== false) {
                th.classList.add('sortable');
                th.addEventListener('click', () => this.handleSort(col.key));
                
                if (this.sortColumn === col.key) {
                    const sortIcon = document.createElement('span');
                    sortIcon.className = 'sort-icon';
                    sortIcon.textContent = this.sortDirection === 'asc' ? ' ▲' : ' ▼';
                    headerContent.appendChild(sortIcon);
                }
            }
            
            th.appendChild(headerContent);
            tr.appendChild(th);
        });
        
        thead.appendChild(tr);
        table.appendChild(thead);
        this.headerContainer.innerHTML = '';
        this.headerContainer.appendChild(table);
    }

    /**
     * Set data and trigger render
     */
    setData(data) {
        this.data = data;
        this.totalHeight = data.length * this.options.rowHeight;
        this.spacer.style.height = `${this.totalHeight}px`;
        this.updateViewportHeight();
        this.render();
    }

    /**
     * Handle scroll event
     */
    handleScroll() {
        this.scrollTop = this.bodyContainer.scrollTop;
        
        // Use requestAnimationFrame for smooth scrolling
        if (!this.scrollRAF) {
            this.scrollRAF = requestAnimationFrame(() => {
                this.render();
                this.scrollRAF = null;
            });
        }
    }

    /**
     * Calculate visible row range
     */
    calculateVisibleRange() {
        const startIndex = Math.floor(this.scrollTop / this.options.rowHeight);
        const endIndex = Math.ceil((this.scrollTop + this.viewportHeight) / this.options.rowHeight);
        
        // Add buffer
        this.visibleStart = Math.max(0, startIndex - this.options.buffer);
        this.visibleEnd = Math.min(this.data.length, endIndex + this.options.buffer);
    }

    /**
     * Render visible rows
     */
    render() {
        const startTime = performance.now();
        
        this.calculateVisibleRange();
        
        const fragment = document.createDocumentFragment();
        const table = document.createElement('table');
        table.className = 'table-body';
        const tbody = document.createElement('tbody');
        
        // Set offset for proper positioning
        const offsetY = this.visibleStart * this.options.rowHeight;
        table.style.transform = `translateY(${offsetY}px)`;
        
        // Render visible rows
        for (let i = this.visibleStart; i < this.visibleEnd; i++) {
            const row = this.data[i];
            if (!row) continue;
            
            const tr = this.renderRow(row, i);
            tbody.appendChild(tr);
        }
        
        table.appendChild(tbody);
        fragment.appendChild(table);
        
        // Replace content
        this.contentContainer.innerHTML = '';
        this.contentContainer.appendChild(fragment);
        
        const renderTime = performance.now() - startTime;
        if (renderTime > 16) { // More than one frame
            console.warn(`Slow render: ${renderTime.toFixed(2)}ms for ${this.visibleEnd - this.visibleStart} rows`);
        }
    }

    /**
     * Render a single row
     */
    renderRow(rowData, index) {
        const tr = document.createElement('tr');
        tr.dataset.index = index;
        tr.dataset.id = rowData.id || index;
        
        if (this.selectedRows.has(rowData.id || index)) {
            tr.classList.add('selected');
        }
        
        // Checkbox column
        if (this.options.selectable) {
            const td = document.createElement('td');
            td.className = 'col-checkbox';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = this.selectedRows.has(rowData.id || index);
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                this.handleRowSelect(rowData.id || index, e.target.checked);
            });
            
            td.appendChild(checkbox);
            tr.appendChild(td);
        }
        
        // Data columns
        this.options.columns.forEach(col => {
            if (this.hiddenColumns.has(col.key)) return;
            
            const td = document.createElement('td');
            td.className = `col-${col.key}`;
            
            let value = rowData[col.key];
            
            // Custom renderer
            if (col.render) {
                value = col.render(value, rowData, index);
            }
            
            // Handle different value types
            if (value instanceof HTMLElement) {
                td.appendChild(value);
            } else if (value !== null && value !== undefined) {
                td.textContent = value;
            }
            
            tr.appendChild(td);
        });
        
        // Row click handler
        if (this.options.onRowClick) {
            tr.addEventListener('click', () => {
                this.options.onRowClick(rowData, index);
            });
            tr.style.cursor = 'pointer';
        }
        
        return tr;
    }

    /**
     * Handle row selection
     */
    handleRowSelect(id, selected) {
        if (selected) {
            this.selectedRows.add(id);
        } else {
            this.selectedRows.delete(id);
        }
        
        // Update select all checkbox
        const selectAll = this.headerContainer.querySelector('#selectAll');
        if (selectAll) {
            selectAll.checked = this.selectedRows.size === this.data.length;
            selectAll.indeterminate = this.selectedRows.size > 0 && this.selectedRows.size < this.data.length;
        }
        
        if (this.options.onRowSelect) {
            this.options.onRowSelect(Array.from(this.selectedRows));
        }
        
        this.render(); // Re-render to update visual state
    }

    /**
     * Handle select all checkbox
     */
    handleSelectAll(selected) {
        if (selected) {
            this.data.forEach(row => {
                this.selectedRows.add(row.id || this.data.indexOf(row));
            });
        } else {
            this.selectedRows.clear();
        }
        
        if (this.options.onRowSelect) {
            this.options.onRowSelect(Array.from(this.selectedRows));
        }
        
        this.render();
    }

    /**
     * Handle column sort
     */
    handleSort(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        
        this.renderHeader();
        
        // Emit sort event - actual sorting should be done by parent
        if (this.options.onSort) {
            this.options.onSort(this.sortColumn, this.sortDirection);
        }
    }

    /**
     * Get selected row IDs
     */
    getSelectedRows() {
        return Array.from(this.selectedRows);
    }

    /**
     * Clear selection
     */
    clearSelection() {
        this.selectedRows.clear();
        const selectAll = this.headerContainer.querySelector('#selectAll');
        if (selectAll) {
            selectAll.checked = false;
            selectAll.indeterminate = false;
        }
        this.render();
    }

    /**
     * Show/hide column
     */
    toggleColumn(columnKey, visible) {
        if (visible) {
            this.hiddenColumns.delete(columnKey);
        } else {
            this.hiddenColumns.add(columnKey);
        }
        
        this.renderHeader();
        this.render();
    }

    /**
     * Scroll to specific row
     */
    scrollToRow(index) {
        const targetScroll = index * this.options.rowHeight;
        this.bodyContainer.scrollTop = targetScroll;
    }

    /**
     * Refresh display (useful after external data changes)
     */
    refresh() {
        this.updateViewportHeight();
        this.render();
    }

    /**
     * Destroy the table and clean up
     */
    destroy() {
        if (this.scrollRAF) {
            cancelAnimationFrame(this.scrollRAF);
        }
        this.container.innerHTML = '';
    }
}

