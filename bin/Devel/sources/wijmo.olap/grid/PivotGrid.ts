module wijmo.olap {
    'use strict';

    /**
     * Extends the @see:FlexGrid control to display pivot tables.
     *
     * To use this control, set its @see:itemsSource property to an instance of a 
     * @see:PivotPanel control or to a @see:PivotEngine.
     */
    export class PivotGrid extends grid.FlexGrid {
        private _ng: PivotEngine;
        private _htDown: grid.HitTestInfo;
        private _showDetailOnDoubleClick = true;
        private _collapsibleSubtotals = true;
        private _customCtxMenu = true;
        private _ctxMenu: _GridContextMenu;
        private _showRowFieldSort = false;
        private _centerVert = true;
        private _docRange: Range;

        static _WJA_COLLAPSE = 'wj-pivot-collapse';

        /**
         * Initializes a new instance of the @see:PivotGrid class.
         *
         * @param element The DOM element that will host the control, or a selector for the host element (e.g. '#theCtrl').
         * @param options JavaScript object containing initialization data for the control.
         */
        constructor(element: any, options?) {
            super(element);

            // add class name to enable styling
            addClass(this.hostElement, 'wj-pivotgrid');

            // change some defaults
            this.isReadOnly = true;
            this.deferResizing = true;
            this.showAlternatingRows = false;
            this.autoGenerateColumns = false;
            this.allowDragging = grid.AllowDragging.None;
            this.mergeManager = new _PivotMergeManager(this);
            this.customContextMenu = true;

            // apply options
            this.initialize(options);

            // customize cell rendering
            this.formatItem.addHandler(this._formatItem, this);

            // customize mouse handling
            this.addEventListener(this.hostElement, 'mousedown', this._mousedown.bind(this), true);
            this.addEventListener(this.hostElement, 'mouseup', this._mouseup.bind(this), true);
            this.addEventListener(this.hostElement, 'dblclick', this._dblclick.bind(this), true);

            // custom context menu
            this._ctxMenu = new _GridContextMenu();
            this._ctxMenu.attach(this);
        }

        /**
         * Gets a reference to the @see:PivotEngine that owns this @see:PivotGrid.
         */
        get engine(): PivotEngine {
            return this._ng;
        }
        /**
         * Gets or sets a value that determines whether the grid should show a popup containing
         * the detail records when the user double-clicks a cell.
         */
        get showDetailOnDoubleClick(): boolean {
            return this._showDetailOnDoubleClick;
        }
        set showDetailOnDoubleClick(value: boolean) {
            this._showDetailOnDoubleClick = asBoolean(value);
        }
        /**
         * Gets or sets a value that determines whether the grid should display 
         * sort indicators in the column headers for row fields.
         *
         * Unlike regular column headers, row fields are always sorted, either
         * in ascending or descending order. If you set this property to true,
         * sort icons will always be displayed over any row field headers.
         */
        get showRowFieldSort(): boolean {
            return this._showRowFieldSort;
        }
        set showRowFieldSort(value: boolean) {
            if (value != this._showRowFieldSort) {
                this._showRowFieldSort = asBoolean(value);
                this.invalidate();
            }
        }
        /**
         * Gets or sets a value that determines whether the grid should provide a custom context menu.
         *
         * The custom context menu includes commands for changing field settings, 
         * removing fields, or showing detail records for the grid cells.
         */
        get customContextMenu(): boolean {
            return this._customCtxMenu;
        }
        set customContextMenu(value: boolean) {
            this._customCtxMenu = asBoolean(value);
        }
        /**
         * Gets or sets a value that determines whether the grid should allow users to collapse 
         * and expand subtotal groups of rows and columns. 
         */
        get collapsibleSubtotals(): boolean {
            return this._collapsibleSubtotals;
        }
        set collapsibleSubtotals(value: boolean) {
            if (value != this._collapsibleSubtotals) {
                this._collapsibleSubtotals = asBoolean(value);
                this.invalidate();
            }
        }
        /**
         * Gets or sets a value that determines whether the content of header cells should be 
         * vertically centered.
         */
        get centerHeadersVertically(): boolean {
            return this._centerVert;
        }
        set centerHeadersVertically(value: boolean) {
            if (value != this._centerVert) {
                this._centerVert = asBoolean(value);
                this.invalidate();
            }
        }
        /**
         * Gets an array containing the records summarized by a given grid cell.
         * 
         * @param row Index of the row that contains the cell.
         * @param col Index of the column that contains the cell.
         */
        getDetail(row: number, col: number) {
            var item = this.rows[asInt(row)].dataItem,
                binding = this.columns[asInt(col)].binding;
            return this._ng.getDetail(item, binding);
        }
        /**
         * Shows a dialog containing details for a given grid cell.
         * 
         * @param row Index of the row that contains the cell.
         * @param col Index of the column that contains the cell.
         */
        showDetail(row: number, col: number) {
            var dd = new DetailDialog(document.createElement('div'));
            dd.showDetail(this, new wijmo.grid.CellRange(row, col));
            var dlg = new input.Popup(document.createElement('div'));
            dlg.content = dd.hostElement;
            dlg.show(true);
        }

        // ** overrides

        // refresh menu items in case culture changed
        refresh(fullUpdate = true) {
            this._ctxMenu.refresh();
            super.refresh(fullUpdate);
        }

        // overridden to accept PivotPanel and PivotEngine as well as ICollectionView sources
        _getCollectionView(value: any): collections.ICollectionView {
            if (value instanceof PivotPanel) {
                value = (<PivotPanel>value).engine.pivotView;
            } else if (value instanceof PivotEngine) {
                value = (<PivotEngine>value).pivotView;
            }
            return asCollectionView(value);
        }

        // overridden to connect to PivotEngine events
        onItemsSourceChanged() {

            // disconnect old engine
            if (this._ng) {
                this._ng.updatedView.removeHandler(this._updatedView, this);
            }

            // get new engine
            var cv = this.collectionView;
            this._ng = cv instanceof PivotCollectionView
                ? (<PivotCollectionView>cv).engine
                : null;

            // connect new engine
            if (this._ng) {
                this._ng.updatedView.addHandler(this._updatedView, this);
            }
            this._updatedView();

            // fire event as usual
            super.onItemsSourceChanged();
        }

        // overridden to save column widths into view definition
        onResizedColumn(e: grid.CellRangeEventArgs) {
            var ng = this._ng;
            if (ng) {

                // resized fixed column
                if (e.panel == this.topLeftCells && e.col < ng.rowFields.length) {
                    var fld = <PivotField>ng.rowFields[e.col];
                    fld.width = e.panel.columns[e.col].renderWidth;
                }

                // resized scrollable column
                if (e.panel == this.columnHeaders && ng.valueFields.length > 0) {
                    var fld = <PivotField>ng.valueFields[e.col % ng.valueFields.length];
                    fld.width = e.panel.columns[e.col].renderWidth;
                }
            }

            // raise the event
            super.onResizedColumn(e);
        }

        // ** implementation

        // reset the grid layout/bindings when the pivot view is updated
        _updatedView() {

            // update fixed row/column counts
            this._updateFixedCounts();

            // clear scrollable rows/columns
            this.columns.clear();
            this.rows.clear();
        }

        // update fixed cell content after loading rows
        onLoadedRows(e?: EventArgs) {

            // generate columns and headers if necessary
            if (this.columns.length == 0) {

                // if we have data, generate columns
                var cv = this.collectionView;
                if (cv && cv.items.length) {
                    var item = cv.items[0];
                    for (var key in item) {
                        if (key != _PivotKey._ROW_KEY_NAME) {
                            var col = new grid.Column({
                                binding: key,
                                dataType: item[key] != null ? getType(item[key]) : DataType.Number
                            });
                            this.columns.push(col);
                        }
                    }
                }
            }

            // update row/column headers
            this._updateFixedContent();

            // fire event as usual
            super.onLoadedRows(e);
        }

        // update the number of fixed rows and columns
        _updateFixedCounts() {
            var ng = this._ng,
                hasView = ng && ng.isViewDefined,
                cnt: number;
        
            // fixed columns
            cnt = Math.max(1, hasView ? ng.rowFields.length : 1);
            this._setLength(this.topLeftCells.columns, cnt);

            // fixed rows
            var cnt = Math.max(1, hasView ? ng.columnFields.length : 1);
            if (ng && ng.columnFields.length && ng.valueFields.length > 1) {
                cnt++;
            }
            this._setLength(this.topLeftCells.rows, cnt);
        }
        _setLength(arr: collections.ObservableArray, cnt: number) {
            while (arr.length < cnt) {
                arr.push(arr instanceof grid.ColumnCollection ? new grid.Column() : new grid.Row());
            }
            while (arr.length > cnt) {
                arr.removeAt(arr.length - 1);
            }
        }

        // update the content of the fixed cells
        _updateFixedContent() {
            var ng = this._ng,
                hasView = ng && ng.isViewDefined;

            // if no view, clear top-left (single) cell and be done
            if (!hasView) {
                this.topLeftCells.setCellData(0, 0, null);
                return;
            }

            // populate top-left cells
            var p = this.topLeftCells;
            for (var r = 0; r < p.rows.length; r++) {
                for (var c = 0; c < p.columns.length; c++) {
                    var value = ng.rowFields.length && r == p.rows.length - 1
                        ? ng.rowFields[c].header
                        : '';
                    p.setCellData(r, c, value, false, false);
                }
            }

            // populate row headers
            p = this.rowHeaders;
            for (var r = 0; r < p.rows.length; r++) {
                var k = <_PivotKey>p.rows[r].dataItem[_PivotKey._ROW_KEY_NAME];
                assert(k instanceof _PivotKey, 'missing PivotKey for row...');
                for (var c = 0; c < p.columns.length; c++) {
                    var value = k.getValue(c, true);
                    p.setCellData(r, c, value, false, false);
                }
            }

            // populate column headers
            p = this.columnHeaders;
            for (var c = 0; c < p.columns.length; c++) {
                var k = ng._getKey(p.columns[c].binding);
                assert(k instanceof _PivotKey, 'missing PivotKey for column...');
                for (var r = 0; r < p.rows.length; r++) {
                    var value = (r == p.rows.length - 1 && ng.valueFields.length > 1)
                        ? ng.valueFields[c % ng.valueFields.length].header
                        : k.getValue(r, true);
                    p.setCellData(r, c, value, false, false);
                }
            }

            // set column widths
            p = this.topLeftCells;
            for (var c = 0; c < p.columns.length; c++) {
                var col = <grid.Column>p.columns[c],
                    fld = <PivotField>(c < ng.rowFields.length ? ng.rowFields[c] : null);
                col.width = (fld && isNumber(fld.width)) ? fld.width : this.columns.defaultSize;
                col.wordWrap = fld ? fld.wordWrap : null;
                col.align = null;
            }
            p = this.cells;
            for (var c = 0; c < p.columns.length; c++) {
                var col = <grid.Column>p.columns[c],
                    fld = <PivotField>(ng.valueFields.length ? ng.valueFields[c % ng.valueFields.length] : null);
                col.width = (fld && isNumber(fld.width)) ? fld.width : this.columns.defaultSize;
                col.wordWrap = fld ? fld.wordWrap : null;
                col.format = fld ? fld.format : null;
            }
        }

        // customize the grid display
        _formatItem(s, e: grid.FormatItemEventArgs) {
            var ng = this._ng;

            // make sure we're connected
            if (!ng) {
                return;
            }

            // let CSS align the column headers
            if (e.panel == this.columnHeaders) {
                if (ng.valueFields.length < 2 || e.row < e.panel.rows.length - 1) {
                    e.cell.style.textAlign = '';
                }
            }

            // apply wj-group class name to total rows and columns
            var rowLevel = ng._getRowLevel(e.row),
                colLevel = ng._getColLevel(e.panel.columns[e.col].binding);
            toggleClass(e.cell, 'wj-aggregate', rowLevel > -1 || colLevel > -1);

            // add collapse/expand icons
            if (this._collapsibleSubtotals) {

                // collapsible row
                if (e.panel == this.rowHeaders && ng.showRowTotals == ShowTotals.Subtotals) {
                    var rng = this.getMergedRange(e.panel, e.row, e.col, false) || e.range;
                    if (e.col < ng.rowFields.length - 1 && rng.rowSpan > 1) {
                        e.cell.innerHTML = this._getCollapsedGlyph(this._getRowCollapsed(rng)) + e.cell.innerHTML;
                    }
                }

                // collapsible column
                if (e.panel == this.columnHeaders && ng.showColumnTotals == ShowTotals.Subtotals) {
                    var rng = this.getMergedRange(e.panel, e.row, e.col, false) || e.range;
                    if (e.row < ng.columnFields.length - 1 && rng.columnSpan > 1) {
                        e.cell.innerHTML = this._getCollapsedGlyph(this._getColCollapsed(rng)) + e.cell.innerHTML;
                    }
                }
            }

            // show sort icons on row field headers
            if (e.panel == this.topLeftCells && this.showRowFieldSort &&
                e.col < ng.rowFields.length && e.row == this._getSortRowIndex()) {
                var fld = ng.rowFields[e.col];
                toggleClass(e.cell, 'wj-sort-asc', !fld.descending);
                toggleClass(e.cell, 'wj-sort-desc', fld.descending);
                e.cell.innerHTML += ' <span class="wj-glyph-' + (fld.descending ? 'down' : 'up') + '"></span>';
            }

            // center-align header cells vertically
            if (this._centerVert && e.cell.hasChildNodes) {
                if (e.panel == this.rowHeaders || e.panel == this.columnHeaders) {

                    // surround cell content in a vertically centered table-cell div
                    var div = createElement('<div style="display:table-cell;vertical-align:middle"></div>');
                    if (!this._docRange) {
                        this._docRange = document.createRange();
                    }
                    this._docRange.selectNodeContents(e.cell);
                    this._docRange.surroundContents(div);

                    // make the cell display as a table
                    setCss(e.cell, {
                        display: 'table',
                        tableLayout: 'fixed',
                        paddingTop: 0, // remove top/bottom padding to work around Safari bug
                        paddingBottom: 0
                    });
                }
            }
        }
        _getCollapsedGlyph(collapsed: boolean): string {
            return '<div style="display:inline-block;cursor:pointer" ' + PivotGrid._WJA_COLLAPSE + '>' +
                     '<span class="wj-glyph-' + (collapsed ? 'plus' : 'minus') + '"></span>' +
                   '</div>&nbsp';
        }

        // mouse handling
        _mousedown(e: MouseEvent) {

            // make sure we want this event
            if (e.defaultPrevented || e.button != 0) {
                this._htDown = null;
                return;
            }

            // save mouse down position to use later on mouse up
            this._htDown = this.hitTest(e);

            // collapse/expand on mousedown
            var icon = closest(e.target, '[' + PivotGrid._WJA_COLLAPSE + ']');
            if (icon != null && this._htDown.panel != null) {
                var rng = this._htDown.range;
                switch (this._htDown.panel.cellType) {
                    case grid.CellType.RowHeader:
                        var collapsed = this._getRowCollapsed(rng);
                        if (e.shiftKey || e.ctrlKey) {
                            this._collapseRowsToLevel(rng.col + (collapsed ? 2 : 1));
                        } else {
                            this._setRowCollapsed(rng, !collapsed);
                        }
                        break;
                    case grid.CellType.ColumnHeader:
                        var collapsed = this._getColCollapsed(rng);
                        if (e.shiftKey || e.ctrlKey) {
                            this._collapseColsToLevel(rng.row + (collapsed ? 2 : 1));
                        } else {
                            this._setColCollapsed(rng, !collapsed);
                        }
                        break;
                }
                this._htDown = null;
                e.preventDefault();
            }
        }
        _mouseup(e: MouseEvent) {

            // make sure we want this event
            if (!this._htDown || e.defaultPrevented || this.hostElement.style.cursor == 'col-resize') {
                return;
            }

            // make sure this is the same cell where the mouse was pressed
            var ht = this.hitTest(e);
            if (this._htDown.panel != ht.panel || !ht.range.equals(this._htDown.range)) {
                return;
            }

            // toggle sort direction when user clicks the row field headers
            var ng = this._ng,
                topLeft = this.topLeftCells;
            if (ht.panel == topLeft && ht.row == topLeft.rows.length - 1 && ht.col > -1) {
                if (this.allowSorting && ht.panel.columns[ht.col].allowSorting) {
                    var args = new wijmo.grid.CellRangeEventArgs(ht.panel, ht.range);
                    if (this.onSortingColumn(args)) {
                        ng.pivotView.sortDescriptions.clear();
                        var fld = <PivotField>ng.rowFields[ht.col];
                        fld.descending = !fld.descending;
                        this.onSortedColumn(args)
                    }
                }
                e.preventDefault();
            }
        }
        _dblclick(e: MouseEvent) {

            // check that we want this event
            if (!e.defaultPrevented && this._showDetailOnDoubleClick) {
                var ht = this._htDown;
                if (ht && ht.panel == this.cells) {
                    this.showDetail(ht.row, ht.col);
                }
            }
        }

        // ** row groups
        _getRowLevel(row: number): number {
            return this._ng._getRowLevel(row);
        }
        _getGroupedRows(rng: grid.CellRange): grid.CellRange {
            var level = rng.col + 1,
                start: number,
                end: number;

            if (this._ng.totalsBeforeData) { 

                // expand up to find total row, then down over data rows
                for (start = rng.row; start > 0; start--) {
                    if (this._getRowLevel(start) == level) break;
                }
                for (end = rng.row; end < this.rows.length - 1; end++) {
                    var lvl = this._getRowLevel(end + 1);
                    if (lvl > -1 && lvl <= level) break;
                }

                // exclude totals from group
                start++; 
            } else { 

                // expand down to find total row, then up over data rows
                for (end = rng.row; end < this.rows.length; end++) {
                    if (this._getRowLevel(end) == level) break;
                }
                for (start = rng.row; start > 0; start--) {
                    var lvl = this._getRowLevel(start - 1);
                    if (lvl > -1 && lvl <= level) break;
                }

                // exclude totals from group
                end--; 
            }

            return end >= start // TFS 190950
                ? new grid.CellRange(start, rng.col, end, rng.col2)
                : rng;
        }
        _getRowCollapsed(rng: grid.CellRange): boolean {
            rng = this._getGroupedRows(rng);
            for (var r = rng.row; r <= rng.row2; r++) {
                if (this.rows[r].isVisible) {
                    return false;
                }
            }
            return true;
        }
        _setRowCollapsed(rng: grid.CellRange, collapse: boolean) {
            this.deferUpdate(() => {
                rng = this._getGroupedRows(rng);
                for (var r = rng.row; r <= rng.row2; r++) {
                    this.rows[r].visible = !collapse;
                }
            });
        }
        _toggleRowCollapsed(rng: grid.CellRange) {
            this._setRowCollapsed(rng, !this._getRowCollapsed(rng));
        }
        _collapseRowsToLevel(level: number) {
            if (level >= this._ng.rowFields.length) {
                level = -1; // show all
            }
            this.deferUpdate(() => {
                for (var r = 0; r < this.rows.length; r++) {
                    if (level < 0) {
                        this.rows[r].visible = true;
                    } else {
                        var rl = this._getRowLevel(r);
                        this.rows[r].visible = rl > -1 && rl <= level;
                    }
                }
            });
        }

        // ** column groups
        _getColLevel(col: number): number {
            return this._ng._getColLevel(this.columns[col].binding);
        }
        _getGroupedCols(rng: grid.CellRange): grid.CellRange {
            var level = rng.row + 1,
                start: number,
                end: number;

            if (this._ng.totalsBeforeData) { 

                // expand left to find total column, then right over data columns
                for (start = rng.col; start > 0; start--) {
                    if (this._getColLevel(start) == level) break;
                }
                for (end = rng.col; end < this.columns.length - 1; end++) {
                    var lvl = this._getColLevel(end + 1);
                    if (lvl > -1 && lvl <= level) break;
                }

                // exclude totals from group
                start++; 

            } else {

                // expand right to find total column, then left over data columns
                for (end = rng.col; end < this.columns.length; end++) {
                    if (this._getColLevel(end) == level) break;
                }
                for (start = rng.col; start > 0; start--) {
                    var lvl = this._getColLevel(start - 1);
                    if (lvl > -1 && lvl <= level) break;
                }

                // exclude totals from group
                end--; 
            }

            return end >= start // TFS 190950
                ? new grid.CellRange(rng.row, start, rng.row2, end)
                : rng;
        }
        _getColCollapsed(rng: grid.CellRange): boolean {
            rng = this._getGroupedCols(rng);
            for (var c = rng.col; c <= rng.col2; c++) {
                if (this.columns[c].isVisible) {
                    return false;
                }
            }
            return true;
        }
        _setColCollapsed(rng: grid.CellRange, collapse: boolean) {
            this.deferUpdate(() => {
                rng = this._getGroupedCols(rng);
                for (var c = rng.col; c <= rng.col2; c++) {
                    this.columns[c].visible = !collapse;
                }
            });
        }
        _toggleColCollapsed(rng: grid.CellRange) {
            this._setColCollapsed(rng, !this._getColCollapsed(rng));
        }
        _collapseColsToLevel(level: number) {
            if (level >= this._ng.columnFields.length) {
                level = -1; // show all
            }
            this.deferUpdate(() => {
                for (var c = 0; c < this.columns.length; c++) {
                    if (level < 0) {
                        this.columns[c].visible = true;
                    } else {
                        var cl = this._getColLevel(c);
                        this.columns[c].visible = cl > -1 && cl <= level;
                    }
                }
            });
        }
    }
}