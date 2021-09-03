var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        // globalization
        wijmo.culture.olap = wijmo.culture.olap || {};
        wijmo.culture.olap.DetailDialog = {
            header: 'Detail View:',
            ok: 'OK',
            items: '{cnt:n0} items',
            item: '{cnt} item',
            row: 'Row',
            col: 'Column'
        };
        /**
         * Represents a dialog used to display details for a grid cell.
         */
        var DetailDialog = (function (_super) {
            __extends(DetailDialog, _super);
            /**
             * Initializes a new instance of the @see:DetailDialog class.
             *
             * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function DetailDialog(element, options) {
                _super.call(this, element, null, true);
                // instantiate and apply template
                var tpl = this.getTemplate();
                this.applyTemplate('wj-control wj-content wj-detaildialog', tpl, {
                    _sCnt: 'sp-cnt',
                    _dSummary: 'div-summary',
                    _dGrid: 'div-grid',
                    _btnOK: 'btn-ok',
                    _gHdr: 'g-hdr'
                });
                // globalization
                var g = wijmo.culture.olap.DetailDialog;
                this._gHdr.textContent = g.header;
                this._btnOK.textContent = g.ok;
                // create child grid
                this._g = new wijmo.grid.FlexGrid(this._dGrid, {
                    isReadOnly: true
                });
                // apply options
                this.initialize(options);
            }
            // populates the dialog to show the detail for a given cell
            DetailDialog.prototype.showDetail = function (ownerGrid, cell) {
                // populate child grid
                this._g.itemsSource = ownerGrid.getDetail(cell.row, cell.col);
                // update caption
                var cnt = this._g.rows.length, ng = ownerGrid.engine, g = wijmo.culture.olap.DetailDialog;
                this._sCnt.textContent = wijmo.format(cnt > 1 ? g.items : g.item, cnt);
                // update summary
                var summary = '';
                // row info
                var rowKey = ownerGrid.rows[cell.row].dataItem[olap._PivotKey._ROW_KEY_NAME], rowHdr = this._getHeader(rowKey);
                if (rowHdr) {
                    summary += g.row + ': <b>' + wijmo.escapeHtml(rowHdr) + '</b><br>';
                }
                // column info
                var colKey = ng._getKey(ownerGrid.columns[cell.col].binding), colHdr = this._getHeader(colKey);
                if (colHdr) {
                    summary += g.col + ': <b>' + wijmo.escapeHtml(colHdr) + '</b><br>';
                }
                // value info
                var valFlds = ng.valueFields, valFld = valFlds[cell.col % valFlds.length], valHdr = valFld.header, val = ownerGrid.getCellData(cell.row, cell.col, true);
                summary += wijmo.escapeHtml(valHdr) + ': <b>' + wijmo.escapeHtml(val) + '</b>';
                // show it
                this._dSummary.innerHTML = summary;
            };
            // gets the headers that describe a key
            DetailDialog.prototype._getHeader = function (key) {
                if (key.values.length) {
                    var arr = [];
                    for (var i = 0; i < key.values.length; i++) {
                        arr.push(key.getValue(i, true));
                    }
                    return arr.join(' - ');
                }
                return null;
            };
            /**
             * Gets or sets the template used to instantiate @see:PivotFieldEditor controls.
             */
            DetailDialog.controlTemplate = '<div>' +
                // header
                '<div class="wj-dialog-header">' +
                '<span wj-part="g-hdr">Detail View:</span> <span wj-part="sp-cnt"></span>' +
                '</div>' +
                // body
                '<div class="wj-dialog-body">' +
                '<div wj-part="div-summary"></div>' +
                '<div wj-part="div-grid"></div>' +
                '</div>' +
                // footer
                '<div class="wj-dialog-footer">' +
                '<a class="wj-hide" wj-part="btn-ok" href="" tabindex="-1" draggable="false">OK</a>&nbsp;&nbsp;' +
                '</div>' +
                '</div>';
            return DetailDialog;
        }(wijmo.Control));
        olap.DetailDialog = DetailDialog;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=DetailDialog.js.map