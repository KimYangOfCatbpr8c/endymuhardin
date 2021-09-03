module wijmo.olap {
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
    }

    /**
     * Represents a dialog used to display details for a grid cell.
     */
    export class DetailDialog extends Control {

        // child grid
        private _g: wijmo.grid.FlexGrid;

        // child elements
        private _sCnt: HTMLElement;
        private _dSummary: HTMLElement;
        private _dGrid: HTMLElement;
        private _btnOK: HTMLElement;
        private _gHdr: HTMLElement;

        /**
         * Gets or sets the template used to instantiate @see:PivotFieldEditor controls.
         */
        static controlTemplate = '<div>' +

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

        /**
         * Initializes a new instance of the @see:DetailDialog class.
         *
         * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
         * @param options The JavaScript object containing initialization data for the control.
         */
        constructor(element: any, options?) {
            super(element, null, true);

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
            var g = culture.olap.DetailDialog;
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
        showDetail(ownerGrid: PivotGrid, cell: wijmo.grid.CellRange) {

            // populate child grid
            this._g.itemsSource = ownerGrid.getDetail(cell.row, cell.col);

            // update caption
            var cnt = this._g.rows.length,
                ng = ownerGrid.engine,
                g = culture.olap.DetailDialog;
            this._sCnt.textContent = format(cnt > 1 ? g.items : g.item, cnt);

            // update summary
            var summary = '';

            // row info
            var rowKey = ownerGrid.rows[cell.row].dataItem[_PivotKey._ROW_KEY_NAME],
                rowHdr = this._getHeader(rowKey);
            if (rowHdr) {
                summary += g.row + ': <b>' + escapeHtml(rowHdr) + '</b><br>';
            }

            // column info
            var colKey = ng._getKey(ownerGrid.columns[cell.col].binding),
                colHdr = this._getHeader(colKey);
            if (colHdr) {
                summary += g.col + ': <b>' + escapeHtml(colHdr) + '</b><br>';
            }

            // value info
            var valFlds = ng.valueFields,
                valFld = valFlds[cell.col % valFlds.length],
                valHdr = valFld.header,
                val = ownerGrid.getCellData(cell.row, cell.col, true);
            summary += escapeHtml(valHdr) + ': <b>' + escapeHtml(val) + '</b>';

            // show it
            this._dSummary.innerHTML = summary;
        }

        // gets the headers that describe a key
        _getHeader(key: _PivotKey) {
            if (key.values.length) {
                var arr = [];
                for (var i = 0; i < key.values.length; i++) {
                    arr.push(key.getValue(i, true));
                }
                return arr.join(' - ');
            }
            return null;
        }
    }
}