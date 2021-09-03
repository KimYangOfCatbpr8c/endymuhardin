var wijmo;
(function (wijmo) {
    var grid;
    (function (grid) {
        'use strict';
        /**
         * Specifies constants that define the type of cell in a @see:GridPanel.
         */
        (function (CellType) {
            /** Unknown or invalid cell type. */
            CellType[CellType["None"] = 0] = "None";
            /** Regular data cell. */
            CellType[CellType["Cell"] = 1] = "Cell";
            /** Column header cell. */
            CellType[CellType["ColumnHeader"] = 2] = "ColumnHeader";
            /** Row header cell. */
            CellType[CellType["RowHeader"] = 3] = "RowHeader";
            /** Top-left cell. */
            CellType[CellType["TopLeft"] = 4] = "TopLeft";
            /** Column footer cell. */
            CellType[CellType["ColumnFooter"] = 5] = "ColumnFooter";
            /** Bottom left cell (at the intersection of the row header and column footer cells). **/
            CellType[CellType["BottomLeft"] = 6] = "BottomLeft";
        })(grid.CellType || (grid.CellType = {}));
        var CellType = grid.CellType;
        /**
         * Represents a logical part of the grid, such as the column headers, row headers,
         * and scrollable data part.
         */
        var GridPanel = (function () {
            /**
             * Initializes a new instance of the @see:GridPanel class.
             *
             * @param g The @see:FlexGrid object that owns the panel.
             * @param cellType The type of cell in the panel.
             * @param rows The rows displayed in the panel.
             * @param cols The columns displayed in the panel.
             * @param element The HTMLElement that hosts the cells in the control.
             */
            function GridPanel(g, cellType, rows, cols, element) {
                this._offsetY = 0;
                this._g = wijmo.asType(g, grid.FlexGrid);
                this._ct = wijmo.asInt(cellType);
                this._rows = wijmo.asType(rows, grid.RowCollection);
                this._cols = wijmo.asType(cols, grid.ColumnCollection);
                this._e = wijmo.asType(element, HTMLElement);
                this._rng = new grid.CellRange();
                // dispatch blur event for focused cells before recycling the panel
                if (!GridPanel._evtBlur) {
                    GridPanel._evtBlur = document.createEvent('HTMLEvents');
                    GridPanel._evtBlur.initEvent('blur', true, false);
                }
            }
            Object.defineProperty(GridPanel.prototype, "grid", {
                /**
                 * Gets the grid that owns the panel.
                 */
                get: function () {
                    return this._g;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GridPanel.prototype, "cellType", {
                /**
                 * Gets the type of cell contained in the panel.
                 */
                get: function () {
                    return this._ct;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GridPanel.prototype, "viewRange", {
                /**
                 * Gets a @see:CellRange that indicates the range of cells currently visible on the panel.
                 */
                get: function () {
                    return this._getViewRange(false);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GridPanel.prototype, "width", {
                /**
                 * Gets the total width of the content in the panel.
                 */
                get: function () {
                    return this._cols.getTotalSize();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GridPanel.prototype, "height", {
                /**
                 * Gets the total height of the content in this panel.
                 */
                get: function () {
                    return this._rows.getTotalSize();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GridPanel.prototype, "rows", {
                /**
                 * Gets the panel's row collection.
                 */
                get: function () {
                    return this._rows;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GridPanel.prototype, "columns", {
                /**
                 * Gets the panel's column collection.
                 */
                get: function () {
                    return this._cols;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Gets the value stored in a cell in the panel.
             *
             * @param r The row index of the cell.
             * @param c The index, name, or binding of the column that contains the cell.
             * @param formatted Whether to format the value for display.
             */
            GridPanel.prototype.getCellData = function (r, c, formatted) {
                var row = this._rows[wijmo.asNumber(r, false, true)], col, value = null;
                // get column index by name or binding
                if (wijmo.isString(c)) {
                    c = this._cols.indexOf(c);
                    if (c < 0) {
                        throw 'Invalid column name or binding.';
                    }
                }
                // get column
                col = this._cols[wijmo.asNumber(c, false, true)];
                // get binding column (MultiRow grid may have multiple display columns for each physical column)
                var bcol = this._g ? this._g._getBindingColumn(this, r, col) : col;
                // get bound value from data item using binding
                if (bcol.binding && row.dataItem &&
                    !(row.dataItem instanceof wijmo.collections.CollectionViewGroup)) {
                    value = bcol._binding.getValue(row.dataItem);
                }
                else if (row._ubv) {
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
                            if (bcol.aggregate != wijmo.Aggregate.None && row instanceof grid.GroupRow) {
                                var icv = this._g.collectionView;
                                if (icv) {
                                    var cv = wijmo.tryCast(icv, wijmo.collections.CollectionView);
                                    value = cv
                                        ? cv.getAggregate(bcol.aggregate, bcol.binding)
                                        : wijmo.getAggregate(bcol.aggregate, icv.items, bcol.binding);
                                }
                            }
                            break;
                        case CellType.Cell:
                            if (bcol.aggregate != wijmo.Aggregate.None && row instanceof grid.GroupRow) {
                                var group = wijmo.tryCast(row.dataItem, wijmo.collections.CollectionViewGroup);
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
                    value = value != null ? wijmo.Globalize.format(value, bcol.format) : '';
                }
                // done
                return value;
            };
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
            GridPanel.prototype.setCellData = function (r, c, value, coerce, invalidate) {
                if (coerce === void 0) { coerce = true; }
                if (invalidate === void 0) { invalidate = true; }
                var row = this._rows[wijmo.asNumber(r, false, true)], col;
                // get column index by name or binding
                if (wijmo.isString(c)) {
                    c = this._cols.indexOf(c);
                    if (c < 0) {
                        throw 'Invalid column name or binding.';
                    }
                }
                // get column
                col = this._cols[wijmo.asNumber(c, false, true)];
                // get binding column (MultiRow grid may have multiple display columns for each physical column)
                var bcol = this._g ? this._g._getBindingColumn(this, r, col) : col;
                // handle dataMap, coercion, type-checking
                if (this._ct == CellType.Cell) {
                    // honor dataMap
                    if (bcol.dataMap && value != null) {
                        if (bcol.isRequired || (value != '' && value != null)) {
                            var map = bcol.dataMap, key = map.getKeyValue(value);
                            if (key == null) {
                                if (!map.isEditable || map.displayMemberPath != map.selectedValuePath) {
                                    return false; // not on map, not editable? cancel edits
                                }
                            }
                            else {
                                value = key; // got the key, use it instead of the value
                            }
                        }
                    }
                    // get target type
                    var targetType = wijmo.DataType.Object;
                    if (bcol.dataType) {
                        targetType = bcol.dataType;
                    }
                    else {
                        var current = this.getCellData(r, c, false);
                        targetType = wijmo.getType(current);
                    }
                    // honor 'isRequired' property
                    if (wijmo.isBoolean(bcol.isRequired)) {
                        if (!bcol.isRequired && (value === '' || value === null)) {
                            value = null; // setting to null
                            coerce = false;
                        }
                        else if (bcol.isRequired && (value === '' || value === null)) {
                            return false; // value is required
                        }
                    }
                    // coerce type if required
                    if (coerce) {
                        value = wijmo.changeType(value, targetType, bcol.format);
                        if (targetType != wijmo.DataType.Object && wijmo.getType(value) != targetType) {
                            return false; // wrong data type
                        }
                    }
                }
                // store value
                if (row.dataItem && bcol.binding) {
                    var binding = bcol._binding, item = row.dataItem, oldValue = binding.getValue(item);
                    if (value !== oldValue && !wijmo.DateTime.equals(value, oldValue)) {
                        // set the value
                        binding.setValue(item, value);
                        // track changes in CollectionView if this is not the current edit item (e.g. when pasting)
                        var view = this._g.collectionView;
                        if (view instanceof wijmo.collections.CollectionView && item != view.currentEditItem) {
                            var e = new wijmo.collections.NotifyCollectionChangedEventArgs(wijmo.collections.NotifyCollectionChangedAction.Change, item, view.items.indexOf(item));
                            view.onCollectionChanged(e);
                        }
                    }
                }
                else {
                    if (!row._ubv)
                        row._ubv = {};
                    row._ubv[col._hash] = value;
                }
                // invalidate
                if (invalidate && this._g) {
                    this._g.invalidate();
                }
                // done
                return true;
            };
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
            GridPanel.prototype.getCellBoundingRect = function (r, c, raw) {
                // get rect in panel coordinates
                var row = this.rows[r], col = this.columns[c], rc = new wijmo.Rect(col.pos, row.pos, col.renderSize, row.renderSize);
                // adjust for rtl
                if (this._g._rtl) {
                    rc.left = this.hostElement.clientWidth - rc.right;
                    // account for scrollbars in non-ie browsers
                    if (!wijmo.isIE()) {
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
            };
            /**
             * Gets a @see:SelectedState value that indicates the selected state of a cell.
             *
             * @param r Row index of the cell to inspect.
             * @param c Column index of the cell to inspect.
             * @param rng @see:CellRange that contains the cell to inspect.
             */
            GridPanel.prototype.getSelectedState = function (r, c, rng) {
                var g = this._g, mode = g.selectionMode, sel = g._selHdl._sel;
                if (mode != grid.SelectionMode.None) {
                    switch (this._ct) {
                        // regular cells
                        case CellType.Cell:
                            // handle merged ranges
                            if (!rng) {
                                rng = g.getMergedRange(this, r, c);
                            }
                            if (rng) {
                                if (rng.contains(sel.row, sel.col)) {
                                    return g.showMarquee ? grid.SelectedState.None : grid.SelectedState.Cursor;
                                }
                                else if (rng.intersects(sel)) {
                                    return grid.SelectedState.Selected;
                                }
                            }
                            // cursor (if not showing marquee)
                            if (sel.row == r && sel.col == c) {
                                return g.showMarquee ? grid.SelectedState.None : grid.SelectedState.Cursor;
                            }
                            // special case: row/col selected property
                            if (g.rows[r].isSelected || g.columns[c].isSelected) {
                                return grid.SelectedState.Selected;
                            }
                            // adjust for selection mode
                            sel = g._selHdl._adjustSelection(sel);
                            // ListBox mode (already checked for selected rows/cols)
                            if (mode == grid.SelectionMode.ListBox) {
                                return grid.SelectedState.None;
                            }
                            // regular ranges
                            return sel.containsRow(r) && sel.containsColumn(c)
                                ? grid.SelectedState.Selected
                                : grid.SelectedState.None;
                        // column headers
                        case CellType.ColumnHeader:
                            if (g.showSelectedHeaders & grid.HeadersVisibility.Column) {
                                if (g.columns[c].isSelected || sel.containsColumn(c) || sel.intersectsColumn(rng)) {
                                    if (rng)
                                        r = rng.bottomRow;
                                    if (r == this.rows.length - 1) {
                                        return grid.SelectedState.Selected;
                                    }
                                }
                            }
                            break;
                        // row headers
                        case CellType.RowHeader:
                            if (g.showSelectedHeaders & grid.HeadersVisibility.Row) {
                                if (g.rows[r].isSelected || sel.containsRow(r) || sel.intersectsRow(rng)) {
                                    if (rng)
                                        c = rng.rightCol;
                                    if (c == this.columns.length - 1) {
                                        return grid.SelectedState.Selected;
                                    }
                                }
                            }
                            break;
                    }
                }
                // not selected
                return grid.SelectedState.None;
            };
            Object.defineProperty(GridPanel.prototype, "hostElement", {
                /**
                 * Gets the host element for the panel.
                 */
                get: function () {
                    return this._e;
                },
                enumerable: true,
                configurable: true
            });
            // ** implementation
            /* -- do not document, this is internal --
             * Gets the Y offset for cells in the panel.
             */
            GridPanel.prototype._getOffsetY = function () {
                return this._offsetY;
            };
            /* -- do not document, this is internal --
             * Updates the cell elements in the panel.
             * @param recycle Whether to recycle existing elements or start from scratch.
             * @param state Whether to keep existing elements and update their state.
             * @param offsetY Scroll position to use when updating the panel.
             */
            GridPanel.prototype._updateContent = function (recycle, state, offsetY) {
                var r, c, ctr, cell, g = this._g, rows = this._rows, cols = this._cols, ct = this._ct;
                // scroll headers into position
                if (ct == CellType.ColumnHeader || ct == CellType.ColumnFooter || ct == CellType.RowHeader) {
                    var sp = g._ptScrl, s = this._e.style;
                    if (ct == CellType.RowHeader) {
                        s.top = sp.y + 'px';
                    }
                    else {
                        if (g._rtl) {
                            s.right = sp.x + 'px';
                        }
                        else {
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
                var vrng = this._getViewRange(false), rng = this._getViewRange(true); // (recycle && g.isTouching) ? this._getViewRange(true) : vrng;
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
                    var ae = wijmo.getActiveElement(), eFocus = wijmo.contains(this._e, ae) ? ae : null, cf = this._g.cellFactory;
                    // give cell factory a chance to dispose of the cells
                    for (var i = 0; i < this._e.childElementCount; i++) {
                        cf.disposeCell(this._e.children[i]);
                    }
                    // clear content
                    wijmo.setText(this._e, null);
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
                for (r = rng.topRow; r <= rng.bottomRow && r > -1; r++) {
                    this._rowIdx.push(ctr);
                    ctr = this._renderRow(r, rng, false, state, ctr);
                }
                this._rowIdx.push(ctr); // one past last cell
                for (r = rng.topRow; r <= rng.bottomRow && r > -1; r++) {
                    ctr = this._renderRow(r, rng, true, state, ctr);
                }
                for (r = 0; r < rows.frozen && r < rows.length; r++) {
                    ctr = this._renderRow(r, rng, false, state, ctr);
                }
                for (r = 0; r < rows.frozen && r < rows.length; r++) {
                    ctr = this._renderRow(r, rng, true, state, ctr);
                }
                // show the cells we are using, hide the others
                var cnt = this._e.childElementCount;
                for (var i = ctr; i < cnt; i++) {
                    cell = this._e.children[i];
                    cell.style.display = 'none';
                }
            };
            // reorder cells within the panel to optimize scrolling performance
            GridPanel.prototype._reorderCells = function (rngNew, rngOld) {
                // sanity
                if (!this._rowIdx || this._rows.frozen > 0 || this._cols.frozen > 0 ||
                    rngNew.columnSpan != rngOld.columnSpan || rngNew.rowSpan != rngOld.rowSpan ||
                    !rngOld.isValid || !rngNew.isValid || !rngNew.intersects(rngOld)) {
                    return;
                }
                // vertical scrolling
                if (rngNew.row != rngOld.row) {
                    var delta = rngNew.row - rngOld.row, limit = Math.max(1, rngNew.rowSpan - 1);
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
                            var last = this._rowIdx.length - 1, rng = this._createRange(this._rowIdx[last + delta], this._rowIdx[last]);
                            this._e.insertBefore(rng.extractContents(), this._e.firstChild);
                        }
                    }
                }
                // horizontal scrolling
                if (rngNew.col != rngOld.col) {
                    var delta = rngNew.col - rngOld.col, limit = Math.max(1, rngNew.columnSpan - 1);
                    if (delta != 0 && Math.abs(delta) < limit) {
                        // scan each row in the view and move the elements within
                        var cnt = this._e.childElementCount;
                        for (var i = 0; i < this._rowIdx.length - 1; i++) {
                            var row = this.rows[rngNew.topRow + i];
                            if (!(row instanceof grid.GroupRow)) {
                                // get cell range for this row
                                var start = this._rowIdx[i], end = this._rowIdx[i + 1];
                                // right:
                                // move first 'delta' elements to the end of the row range
                                if (delta > 0 && start + delta <= cnt) {
                                    var rng = this._createRange(start, start + delta);
                                    this._e.insertBefore(rng.extractContents(), this._e.children[end]);
                                }
                                // left:
                                // move last 'delta' elements to the start of the row range
                                if (delta < 0 && end + delta - 1 >= 0) {
                                    var rng = this._createRange(end + delta - 1, end - 1);
                                    this._e.insertBefore(rng.extractContents(), this._e.children[start]);
                                }
                            }
                        }
                    }
                }
            };
            // creates a range of cells that can be moved to optimize rendering
            GridPanel.prototype._createRange = function (start, end) {
                var rng = document.createRange();
                rng.setStart(this._e, start);
                rng.setEnd(this._e, end);
                return rng;
            };
            // renders a row
            GridPanel.prototype._renderRow = function (r, rng, frozen, state, ctr) {
                // skip hidden rows
                if (this.rows[r].renderSize <= 0) {
                    return ctr;
                }
                // render each cell in the row
                if (frozen) {
                    for (var c = 0; c < this.columns.frozen && c < this.columns.length; c++) {
                        ctr = this._renderCell(r, c, rng, state, ctr);
                    }
                }
                else {
                    for (var c = rng.leftCol; c <= rng.rightCol && c > -1; c++) {
                        ctr = this._renderCell(r, c, rng, state, ctr);
                    }
                }
                // return updated counter
                return ctr;
            };
            // renders a cell
            GridPanel.prototype._renderCell = function (r, c, rng, state, ctr) {
                // skip over cells that have been merged over
                var g = this._g, mrng = g.getMergedRange(this, r, c);
                if (mrng) {
                    for (var over = Math.max(rng.row, mrng.row); over < r; over++) {
                        if (this.rows[over].isVisible)
                            return ctr;
                    }
                    for (var over = Math.max(rng.col, mrng.col); over < c; over++) {
                        if (this.columns[over].isVisible)
                            return ctr;
                    }
                }
                // skip hidden and non-merged columns
                if (this.columns[c].renderSize <= 0) {
                    if (!mrng || mrng.getRenderSize(this).width <= 0) {
                        return ctr;
                    }
                }
                // try recycling a cell
                var cell = this._e.childNodes[ctr++];
                // update selected state
                if (cell && state) {
                    var selState = this.getSelectedState(r, c, mrng);
                    wijmo.toggleClass(cell, 'wj-state-selected', selState == grid.SelectedState.Cursor);
                    wijmo.toggleClass(cell, 'wj-state-multi-selected', selState == grid.SelectedState.Selected);
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
            };
            // gets the range of cells currently visible,
            // optionally adding a buffer for inertial scrolling
            GridPanel.prototype._getViewRange = function (buffer) {
                var g = this._g, sp = g._ptScrl, rows = this._rows, cols = this._cols, rng = new grid.CellRange(0, 0, rows.length - 1, cols.length - 1);
                // calculate range
                if (this._ct == CellType.Cell || this._ct == CellType.RowHeader) {
                    var y = -sp.y + this._offsetY, h = g._szClient.height, fz = Math.min(rows.frozen, rows.length - 1);
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
                    var x = -sp.x, w = g._szClient.width, fz = Math.min(cols.frozen, cols.length - 1);
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
            };
            // gets the point where the frozen area ends
            GridPanel.prototype._getFrozenPos = function () {
                var fzr = this._rows.frozen, fzc = this._cols.frozen, fzrow = fzr > 0 ? this._rows[fzr - 1] : null, fzcol = fzc > 0 ? this._cols[fzc - 1] : null, fzy = fzrow ? fzrow.pos + fzrow.renderSize : 0, fzx = fzcol ? fzcol.pos + fzcol.renderSize : 0;
                return new wijmo.Point(fzx, fzy);
            };
            return GridPanel;
        }());
        grid.GridPanel = GridPanel;
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=GridPanel.js.map