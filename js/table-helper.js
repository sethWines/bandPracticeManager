/**
 * Table pagination helper — reduces DOM size for large libraries (file:// compatible)
 */
(function (global) {
    'use strict';

    function PaginatedTable(options) {
        this.rowsPerPage = options.rowsPerPage || 100;
        this.currentPage = 1;
        this.totalItems = 0;
        this.onPageChange = options.onPageChange || function () {};
        this.containerId = options.containerId || 'paginationControls';
    }

    PaginatedTable.prototype.setTotal = function (count) {
        this.totalItems = count;
        if (this.currentPage > this.getTotalPages()) {
            this.currentPage = Math.max(1, this.getTotalPages());
        }
    };

    PaginatedTable.prototype.getTotalPages = function () {
        return Math.max(1, Math.ceil(this.totalItems / this.rowsPerPage));
    };

    PaginatedTable.prototype.slice = function (items) {
        var start = (this.currentPage - 1) * this.rowsPerPage;
        return items.slice(start, start + this.rowsPerPage);
    };

    PaginatedTable.prototype.goToPage = function (page) {
        this.currentPage = Math.min(Math.max(1, page), this.getTotalPages());
        this.renderControls();
        this.onPageChange(this.currentPage);
    };

    PaginatedTable.prototype.setRowsPerPage = function (n) {
        this.rowsPerPage = n;
        this.currentPage = 1;
        this.renderControls();
        this.onPageChange(this.currentPage);
    };

    PaginatedTable.prototype.renderControls = function () {
        var el = document.getElementById(this.containerId);
        if (!el) return;
        var totalPages = this.getTotalPages();
        var start = this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.rowsPerPage + 1;
        var end = Math.min(this.currentPage * this.rowsPerPage, this.totalItems);

        el.innerHTML =
            '<div class="pagination-info">Showing ' + start + '–' + end + ' of ' + this.totalItems + '</div>' +
            '<div class="pagination-buttons">' +
            '<button type="button" class="btn btn-secondary btn-sm" ' + (this.currentPage <= 1 ? 'disabled' : '') +
            ' onclick="songPagination.goToPage(' + (this.currentPage - 1) + ')">Prev</button>' +
            '<span class="pagination-info">Page ' + this.currentPage + ' / ' + totalPages + '</span>' +
            '<button type="button" class="btn btn-secondary btn-sm" ' + (this.currentPage >= totalPages ? 'disabled' : '') +
            ' onclick="songPagination.goToPage(' + (this.currentPage + 1) + ')">Next</button>' +
            '</div>' +
            '<div class="rows-per-page"><label for="rowsPerPageSelect">Rows</label>' +
            '<select id="rowsPerPageSelect" onchange="songPagination.setRowsPerPage(parseInt(this.value,10))">' +
            [25, 50, 100, 250].map(function (n) {
                return '<option value="' + n + '"' + (n === this.rowsPerPage ? ' selected' : '') + '>' + n + '</option>';
            }.bind(this)).join('') +
            '</select></div>';
    };

    global.PaginatedTable = PaginatedTable;
})(typeof window !== 'undefined' ? window : this);
