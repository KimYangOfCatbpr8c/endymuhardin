module wijmo.grid {
    'use strict';

    /**
     * Specifies constants that define the type of cell in a @see:GridPanel.
     */
    export enum CellType {
        /** Unknown or invalid cell type. */
        None,
        /** Regular data cell. */
        Cell,
        /** Column header cell. */
        ColumnHeader,
        /** Row header cell. */
        RowHeader,
        /** Top-left cell. */
        TopLeft,
        /** Column footer cell. */
        ColumnFooter,
        /** Bottom left cell (at the intersection of the row header and column footer cells). **/
        BottomLeft
    }

    /**
     * Represents a logical part of the grid, such as the column headers, row headers,
     * and scrollable data part.
     */
    export class GridPanel {
        private _g: FlexGrid;
        private _ct: CellType;
        private _e: HTMLElement;
        private _rows: RowCollection;
        private _cols: ColumnCollection;
        private _offsetY = 0;
        private _rng: CellRange; // buffered view range
        private _rowIdx: number[]; // index of the last cell element in each row
        private static _evtBlur;

        /**
         * Initializes a new instance of the @see:GridPanel class.
         *
         * @param g The @see:FlexGrid object that owns the panel.
         * @param cellType The type of cell in the panel.
         * @param rows The rows displayed in the panel.
         * @param cols The columns displayed in the panel.
         * @param element The HTMLElement that hosts the cells in the control.
         */
        constructor(g: FlexGrid, cellType: CellType, rows: RowCollection, cols: ColumnCollection, element: HTMLElement) {
            this._g = asType(g, FlexGrid);
            this._ct = asInt(cellType);
            this._rows = asType(rows, RowCollection);
            this._cols = asType(cols, ColumnCollection);
            this._e = asType(element, HTMLElement);
            this._rng = new CellRange();

            // dispatch blur event for focused cells before recycling the panel
            if (!GridPanel._evtBlur) {
                GridPanel._evtBlur = document.createEvent('HTMLEvents');
                GridPanel._evtBlur.initEvent('blur', true, false);
            }
        }
        /**
         * Gets the grid that owns the panel.
         */
        get grid(): FlexGrid {
            return this._g;
        }
        /**
         * Gets the type of cell contained in the panel.
         */
        get cellType(): CellType {
            return this._ct;
        }
        /**
         * Gets a @see:CellRange that indicates the range of cells currently visible on the panel.
         */
        get viewRange(): CellRange {
            return this._getViewRange(false);
        }
        /**
         * Gets the total width of the content in the panel.
         */
        get width(): number {
            return this._cols.getTotalSize();
        }
        /**
         * Gets the total height of the content in this panel.
         */
        get height(): number {
            return this._rows.getTotalSize();
        }
        /**
         * Gets the panel's row collection.
         */
        get rows(): RowCollection {
            return this._rows;
        }
        /**
         * Gets the panel's column collection.
         */
        get columns(): ColumnCollection {
            return this._cols;
        }
        /**
         * Gets the value stored in a cell in the panel.
         *
         * @param r The row index of the cell.
         * @param c The index, name, or binding of the column that contains the cell.
         * @param formatted Whether to format the value for display.
         */
        getCellData(r: number, c: any, formatted: boolean): any {
            var row = <Row>this._rows[asNumber(r, false, true)],
                col: Column,
                value = null;

            // get column index by name or binding
            if (isString(c)) {
                c = this._cols.indexOf(c);
                if (c < 0) {
                    throw 'Invalid column name or binding.';
                }
            }

            // get column
            col = <Column>this._cols[asNumber(c, false, true)];

            // get binding column (MultiRow grid may have multiple display columns for each physical column)
            var bcol = this._g ? this._g._getBindingColumn(this, r, col) : col;

            // get bound value from data item using binding
            if (bcol.binding && row.dataItem &&
                !(row.dataItem instanceof collections.CollectionViewGroup)) { // TFS 108841
                value = bcol._binding.getValue(row.dataItem);
            } else if (row._ubv) { // get unbound value
                value = row._ubv[col._hash];
            }

            // special values for row and column headers, aggregates
            if (value == null) {
                switch (this._ct) {
                    case CellType.ColumnHeader:
                        if (r == this._rows.length - 1 || bcol != col) {
                            value = bcol.header;
                        }
                        break;
                    case CellType.ColumnFooter:
                        if (bcol.aggregate != Aggregate.None && row instanceof GroupRow) {
                            var icv = this._g.collectionView;
                            if (icv) {
                                var cv = <collections.CollectionView>tryCast(icv, collections.CollectionView);
                                value = cv
                                    ? cv.getAggregate(bcol.aggregate, bcol.binding)
                                    : getAggregate(bcol.aggregate, icv.items, bcol.binding);
                            }
                        }
                        break;
                    case CellType.Cell:
                        if (bcol.aggregate != Aggregate.None && row instanceof GroupRow) {
                            var group = <collections.CollectionViewGroup>tryCast(row.dataItem, collections.CollectionViewGroup);
                            if (group) {
                                value = group.getAggregate(bcol.aggregate, bcol.binding, this._g.collectionView);
                            }
                        }
                        break;
                }
            }

            // format value if requested, never return null
            if (formatted) {
                if (this.cellType == CellType.Cell && bcol.dataMap) {
                    value = bcol.dataMap.getDisplayValue(value);
                }
                value = value != null ? Globalize.format(value, bcol.format) : '';
            }

            // done
            return value;
        }
        /**
         * Sets the content of a cell in the panel.
         *
         * @param r The index of the row that contains the cell.
         * @param c The index, name, or binding of the column that contains the cell.
         * @param value The value to store in the cell.
         * @param coerce Whether to change the value automatically to match the column's data type.
         * @param invalidate Whether to invalidate the grid to show the change.
         * @return Returns true if the value is stored successfully, false otherwise (failed cast).
         */
        setCellData(r: number, c: any, value: any, coerce = true, invalidate = true): boolean {
            var row = <Row>this._rows[asNumber(r, false, true)],
                col: Column;

            // get column index by name or binding
            if (isString(c)) {
                c = this._cols.indexOf(c);
                if (c < 0) {
                    throw 'Invalid column name or binding.';
                }
            }

            // get column
            col = <Column>this._cols[asNumber(c, false, true)];

            // get binding column (MultiRow grid may have multiple display columns for each physical column)
            var bcol = this._g ? this._g._getBindingColumn(this, r, col) : col;

            // handle dataMap, coercion, type-checking
            if (this._ct == CellType.Cell) {

                // honor dataMap
                if (bcol.dataMap && value != null) {
                    if (bcol.isRequired || (value != '' && value != null)) { // TFS 107058
                        var map = bcol.dataMap,
                            key = map.getKeyValue(value);
                        if (key == null) {
                            if (!map.isEditable || map.displayMemberPath != map.selectedValuePath) {
                                return false; // not on map, not editable? cancel edits
                            }
                        } else {
                            value = key; // got the key, use it instead of the value
                        }
                    }
                }

                // get target type
                var targetType = DataType.Object;
                if (bcol.dataType) {
                    targetType = bcol.dataType;
                } else {
                    var current = this.getCellData(r, c, false);
                    targetType = getType(current);
                }

                // honor 'isRequired' property
                if (isBoolean(bcol.isRequired)) {
                    if (!bcol.isRequired && (value === '' || value === null)) {
                        value = null; // setting to null
                        coerce = false;
                    } else if (bcol.isRequired && (value === '' || value === null)) {
                        return false; // value is required
                    }
                }

                // coerce type if required
                if (coerce) {
                    value = changeType(value, targetType, bcol.format);
                    if (targetType != DataType.Object && getType(value) != targetType) {
                        return false; // wrong data type
                    }
                }
            }

            // store value
            if (row.dataItem && bcol.binding) {
                var binding = bcol._binding,
                    item = row.dataItem,
                    oldValue = binding.getValue(item);
                if (value !== oldValue && !DateTime.equals(value, oldValue)) {

                    // set the value
                    binding.setValue(item, value);

                    // track changes in CollectionView if this is not the current edit item (e.g. when pasting)
                    var view = <collections.CollectionView>this._g.collectionView;
                    if (view instanceof collections.CollectionView && item != view.currentEditItem) {
                        var e = new collections.NotifyCollectionChangedEventArgs(collections.NotifyCollectionChangedAction.Change, item, view.items.indexOf(item));
                        view.onCollectionChanged(e);
                    }
                }
            } else {
                if (!row._ubv) row._ubv = {};
                row._ubv[col._hash] = value;
            }

            // invalidate
            if (invalidate && this._g) {
                this._g.invalidate();
            }

            // done
            return true;
        }
        /**
         * Gets a cell's bounds in viewport coordinates.
         *
         * The returned value is a @see:Rect object which contains the position and dimensions 
         * of the cell in viewport coordinates.
         * The viewport coordinates are the same as those used by the 
         * <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element.getBoundingClientRect"
         * target="_blank">getBoundingClientRect</a> method.
         *
         * @param r The index of the row that contains the cell.
         * @param c The index of the column that contains the cell.
         * @param raw Whether to return the rectangle in raw panel coordinates as opposed to viewport coordinates.
         */
        getCellBoundingRect(r: number, c: number, raw?: boolean): Rect {

            // get rect in panel coordinates
            var row = this.rows[r],
                col = this.columns[c],
                rc = new Rect(col.pos, row.pos, col.renderSize, row.renderSize);

            // adjust for rtl
            if (this._g._rtl) {
                rc.left = this.hostElement.clientWidth - rc.right;

                // account for scrollbars in non-ie browsers
                if (!isIE()) { 
                    var root = this.hostElement.parentElement;
                    rc.left -= root.offsetWidth - root.clientWidth;
                }
            }

            // adjust for panel position
            if (!raw) {
                var rcp = this.hostElement.getBoundingClientRect();
                rc.left += rcp.left;
                rc.top += rcp.top - this._offsetY;
            }

            // account for frozen rows/columns (TFS 105593)
            if (r < this.rows.frozen) {
                rc.top -= this._g.scrollPosition.y;
            }
            if (c < this.columns.frozen) {
                rc.left -= this._g.scrollPosition.x * (this._g._rtl ? -1 : +1);
            }

            // done
            return rc;
        }
        /**
         * Gets a @see:SelectedState value that indicates the selected state of a cell.
         *
         * @param r Row index of the cell to inspect.
         * @param c Column index of the cell to inspect.
         * @param rng @see:CellRange that contains the cell to inspect.
         */
        getSelectedState(r: number, c: number, rng: CellRange): SelectedState {
            var g = this._g,
                mode = g.selectionMode,
                sel = g._selHdl._sel;
            if (mode != SelectionMode.None) {
                switch (this._ct) {

                    // regular cells
                    case CellType.Cell:

                        // handle merged ranges
                        if (!rng) {
                            rng = g.getMergedRange(this, r, c);
                        }
                        if (rng) {
                            if (rng.contains(sel.row, sel.col)) {
                                return g.showMarquee ? SelectedState.None : SelectedState.Cursor;
                            } else if (rng.intersects(sel)) {
                                return SelectedState.Selected;
                            }
                        }

                        // cursor (if not showing marquee)
                        if (sel.row == r && sel.col == c) {
                            return g.showMarquee ? SelectedState.None : SelectedState.Cursor;
                        }

                        // special case: row/col selected property
                        if (g.rows[r].isSelected || g.columns[c].isSelected) {
                            return SelectedState.Selected;
                        }

                        // adjust for selection mode
                        sel = g._selHdl._adjustSelection(sel);

                        // ListBox mode (already checked for selected rows/cols)
                        if (mode == SelectionMode.ListBox) {
                            return SelectedState.None;
                        }

                        // regular ranges
                        return sel.containsRow(r) && sel.containsColumn(c)
                            ? SelectedState.Selected
                            : SelectedState.None;

                    // column headers
                    case CellType.ColumnHeader:
                        if (g.showSelectedHeaders & HeadersVisibility.Column) {
                            if (g.columns[c].isSelected || sel.containsColumn(c) || sel.intersectsColumn(rng)) {
                                if (rng) r = rng.bottomRow;
                                if (r == this.rows.length - 1) {
                                    return SelectedState.Selected;
                                }
                            }
                        }
                        break;

                    // row headers
                    case CellType.RowHeader:
                        if (g.showSelectedHeaders & HeadersVisibility.Row) {
                            if (g.rows[r].isSelected || sel.containsRow(r) || sel.intersectsRow(rng)) {
                                if (rng) c = rng.rightCol;
                                if (c == this.columns.length - 1) {
                                    return SelectedState.Selected;
                                }
                            }
                        }
                        break;
                }
            }

            // not selected
            return SelectedState.None;
        }
        /**
         * Gets the host element for the panel.
         */
        get hostElement(): HTMLElement {
            return this._e;
        }

        // ** implementation

        /* -- do not document, this is internal --
         * Gets the Y offset for cells in the panel.
         */
        _getOffsetY(): number {
            return this._offsetY;
        }

        /* -- do not document, this is internal --
         * Updates the cell elements in the panel.
         * @param recycle Whether to recycle existing elements or start from scratch.
         * @param state Whether to keep existing elements and update their state.
         * @param offsetY Scroll position to use when updating the panel.
         */
        _updateContent(recycle: boolean, state: boolean, offsetY: number) {
            var r: number, c: number,
                ctr: number,
                cell: HTMLElement,
                g = this._g,
                rows = this._rows,
                cols = this._cols,
                ct = this._ct;

            // scroll headers into position
            if (ct == CellType.ColumnHeader || ct == CellType.ColumnFooter || ct == CellType.RowHeader) {
                var sp = g._ptScrl,
                    s = this._e.style;
                if (ct == CellType.RowHeader) { // scroll row headers vertically
                    s.top = sp.y + 'px';
                } else { // scroll column headers/footers horizontally
                    if (g._rtl) {
                        s.right = sp.x + 'px';
                    } else {
                        s.left = sp.x + 'px';
                    }
                }
            }

            // update offset (and don't recycle if it changed!)
            if (this._offsetY != offsetY) {
                recycle = false;
                this._offsetY = offsetY;
            }

            // calculate new view range and buffered view range
            var vrng = this._getViewRange(false),
                rng = this._getViewRange(true); // (recycle && g.isTouching) ? this._getViewRange(true) : vrng;

            // done if recycling, not updating state, and old range contains new (unbuffered)
            // this happens a lot while scrolling by small amounts (< 1 cell)
            if (recycle && !state && !rows.frozen && !cols.frozen && this._rng.contains(vrng)) {
                return;
            }

            // if not recycling or if the range changed, ignore 'cells' refresh list
            if (!recycle || !rng.equals(this._rng)) {
                state = false;
            }

            // clear content if not recycling
            if (!recycle) {
                var ae = getActiveElement(),
                    eFocus = contains(this._e, ae) ? ae : null,
                    cf = this._g.cellFactory;

                // give cell factory a chance to dispose of the cells
                for (var i = 0; i < this._e.childElementCount; i++) {
                    cf.disposeCell(<HTMLElement>this._e.children[i]);
                }

                // clear content
                setText(this._e, null);

                // update focus state in case the editor was disposed
                if (eFocus) {
                    eFocus.dispatchEvent(GridPanel._evtBlur);
                }

                // clear row indices
                this._rowIdx = [];
            }

            // reorder cells to optimize scrolling (headers too)
            if (recycle && this._ct != CellType.TopLeft) {
                this._reorderCells(rng, this._rng);
            }

            // save new ranges
            this._rng = rng;

            // go create/update the cells
            // (render frozen cells last so we don't need z-index!)
            ctr = 0;
            this._rowIdx = [];
            for (r = rng.topRow; r <= rng.bottomRow && r > -1; r++) { // not frozen
                this._rowIdx.push(ctr);
                ctr = this._renderRow(r, rng, false, state, ctr);
            }
            this._rowIdx.push(ctr); // one past last cell
            for (r = rng.topRow; r <= rng.bottomRow && r > -1; r++) { // frozen col
                ctr = this._renderRow(r, rng, true, state, ctr);
            }
            for (r = 0; r < rows.frozen && r < rows.length; r++) { // frozen row
                ctr = this._renderRow(r, rng, false, state, ctr);
            }
            for (r = 0; r < rows.frozen && r < rows.length; r++) { // frozen row/col
                ctr = this._renderRow(r, rng, true, state, ctr);
            }

            // show the cells we are using, hide the others
            var cnt = this._e.childElementCount;
            for (var i = ctr; i < cnt; i++) {
                cell = <HTMLElement>this._e.children[i];
                cell.style.display = 'none';
            }
        }

        // reorder cells within the panel to optimize scrolling performance
        _reorderCells(rngNew: CellRange, rngOld: CellRange) {

            // sanity
            if (!this._rowIdx || this._rows.frozen > 0 || this._cols.frozen > 0 ||
                rngNew.columnSpan != rngOld.columnSpan || rngNew.rowSpan != rngOld.rowSpan ||
                !rngOld.isValid || !rngNew.isValid || !rngNew.intersects(rngOld)) {
                return;
            }

            // vertical scrolling
            if (rngNew.row != rngOld.row) {
                var delta = rngNew.row - rngOld.row,
                    limit = Math.max(1, rngNew.rowSpan - 1);
                if (delta != 0 && Math.abs(delta) < limit) {
                
                    // down:
                    // remove cells from the top and append to bottom
                    if (delta > 0) {
                        var rng = this._createRange(0, this._rowIdx[delta]);
                        this._e.appendChild(rng.extractContents());
                    }

                    // up:
                    // remove cells from the bottom and insert at the top
                    if (delta < 0) {
                        var last = this._rowIdx.length - 1,
                            rng = this._createRange(this._rowIdx[last + delta], this._rowIdx[last]);
                            this._e.insertBefore(rng.extractContents(), this._e.firstChild);
                        }
                    }
                }

            // horizontal scrolling
            if (rngNew.col != rngOld.col) {
                var delta = rngNew.col - rngOld.col,
                    limit = Math.max(1, rngNew.columnSpan - 1);
                if (delta != 0 && Math.abs(delta) < limit) {
    
                    // scan each row in the view and move the elements within
                    var cnt = this._e.childElementCount;
                    for (var i = 0; i < this._rowIdx.length - 1; i++) {
                        var row = this.rows[rngNew.topRow + i];
                        if (!(row instanceof GroupRow)) {

                            // get cell range for this row
                            var start = this._rowIdx[i],
                                end = this._rowIdx[i + 1];

                            // right:
                            // move first 'delta' elements to the end of the row range
                            if (delta > 0 && start + delta <= cnt) { // TFS 201620
                                var rng = this._createRange(start, start + delta);
                                this._e.insertBefore(rng.extractContents(), this._e.children[end]);
                            }

                            // left:
                            // move last 'delta' elements to the start of the row range
                            if (delta < 0 && end + delta - 1 >= 0) { // TFS 152906
                                var rng = this._createRange(end + delta - 1, end - 1);
                                this._e.insertBefore(rng.extractContents(), this._e.children[start]);
                            }
                        }
                    }
                }
            }
        }

        // creates a range of cells that can be moved to optimize rendering
        _createRange(start: number, end: number) {
            var rng = document.createRange();
            rng.setStart(this._e, start);
            rng.setEnd(this._e, end);
            return rng;
        }

        // renders a row
        _renderRow(r: number, rng: CellRange, frozen: boolean, state: boolean, ctr: number): number {

            // skip hidden rows
            if ((<Row>this.rows[r]).renderSize <= 0) {
                return ctr;
            }

            // render each cell in the row
            if (frozen) {
                for (var c = 0; c < this.columns.frozen && c < this.columns.length; c++) {
                    ctr = this._renderCell(r, c, rng, state, ctr);
                }
            } else {
                for (var c = <number>rng.leftCol; c <= rng.rightCol && c > -1; c++) {
                    ctr = this._renderCell(r, c, rng, state, ctr);
                }
            }

            // return updated counter
            return ctr;
        }

        // renders a cell
        _renderCell(r: number, c: number, rng: CellRange, state: boolean, ctr: number): number {

            // skip over cells that have been merged over
            var g = this._g,
                mrng = g.getMergedRange(this, r, c);
            if (mrng) {
                for (var over = Math.max(rng.row, mrng.row); over < r; over++) {
                    if (this.rows[over].isVisible) return ctr;
                }
                for (var over = Math.max(rng.col, mrng.col); over < c; over++) {
                    if (this.columns[over].isVisible) return ctr;
                }
            }

            // skip hidden and non-merged columns
            if ((<Column>this.columns[c]).renderSize <= 0) {
                if (!mrng || mrng.getRenderSize(this).width <= 0) {
                    return ctr;
                }
            }

            // try recycling a cell
            var cell = <HTMLElement>this._e.childNodes[ctr++];

            // update selected state
            if (cell && state) {
                var selState = this.getSelectedState(r, c, mrng);
                toggleClass(cell, 'wj-state-selected', selState == SelectedState.Cursor);
                toggleClass(cell, 'wj-state-multi-selected', selState == SelectedState.Selected);
                return ctr;
            }

            // create or recycle cell
            // NOTE: make cells focusable so we can give the focus to them rather
            // than to the grid, which causes browsers to try and scroll the whole
            // grid into view.
            if (!cell) {
                cell = document.createElement('div');
                cell.tabIndex = 0;
                this._e.appendChild(cell);
            }

            // set/update cell content/style
            g.cellFactory.updateCell(this, r, c, cell, mrng);

            // return updated counter
            return ctr;
        }

        // gets the range of cells currently visible,
        // optionally adding a buffer for inertial scrolling
        _getViewRange(buffer: boolean): CellRange {
            var g = this._g,
                sp = g._ptScrl,
                rows = this._rows,
                cols = this._cols,
                rng = new CellRange(0, 0, rows.length - 1, cols.length - 1);

            // calculate range
            if (this._ct == CellType.Cell || this._ct == CellType.RowHeader) {
                var y = -sp.y + this._offsetY,
                    h = g._szClient.height,
                    fz = Math.min(rows.frozen, rows.length - 1);

                // account for frozen rows
                if (fz > 0) {
                    var fzs = rows[fz - 1].pos;
                    y += fzs;
                    h -= fzs;
                }

                // set row range
                rng.row = Math.min(rows.length - 1, Math.max(rows.frozen, rows.getItemAt(y + 1)));
                rng.row2 = rows.getItemAt(y + h);
            }
            if (this._ct == CellType.Cell || this._ct == CellType.ColumnHeader) {
                var x = -sp.x,
                    w = g._szClient.width,
                    fz = Math.min(cols.frozen, cols.length - 1);

                // account for frozen columns
                if (fz > 0) {
                    var fzs = cols[fz - 1].pos;
                    x += fzs;
                    w -= fzs;
                }

                // set column range
                rng.col = Math.min(cols.length - 1, Math.max(cols.frozen, cols.getItemAt(x + 1)));
                rng.col2 = cols.getItemAt(x + w);
            }

            // add buffer
            if (buffer && this._ct == CellType.Cell) {
                var sz = g.isTouching ? 6 : 1;
                rng.row = Math.max(rng.row - sz, 0);
                rng.row2 = Math.min(rng.row2 + sz, rows.length - 1);
                rng.col = Math.max(rng.col - 1, 0);
                rng.col2 = Math.min(rng.col2 + 1, cols.length - 1);
            }

            // handle case where all rows/cols are frozen
            if (rows.length <= rows.frozen) {
                rng.row = rng.row2 = -1;
            }
            if (cols.length <= cols.frozen) {
                rng.col = rng.col2 = -1;
            }

            // return viewrange
            return rng;
        }

        // gets the point where the frozen area ends
        _getFrozenPos(): Point {
            var fzr = this._rows.frozen,
                fzc = this._cols.frozen,
                fzrow = fzr > 0 ? this._rows[fzr - 1] : null,
                fzcol = fzc > 0 ? this._cols[fzc - 1] : null,
                fzy = fzrow ? fzrow.pos + fzrow.renderSize : 0,
                fzx = fzcol ? fzcol.pos + fzcol.renderSize : 0;
            return new Point(fzx, fzy);
        }
    }
}
