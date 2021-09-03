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
        /**
         * Extends the @see:FlexGrid control to display pivot tables.
         *
         * To use this control, set its @see:itemsSource property to an instance of a
         * @see:PivotPanel control or to a @see:PivotEngine.
         */
        var PivotGrid = (function (_super) {
            __extends(PivotGrid, _super);
            /**
             * Initializes a new instance of the @see:PivotGrid class.
             *
             * @param element The DOM element that will host the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options JavaScript object containing initialization data for the control.
             */
            function PivotGrid(element, options) {
                _super.call(this, element);
                this._showDetailOnDoubleClick = true;
                this._collapsibleSubtotals = true;
                this._customCtxMenu = true;
                this._showRowFieldSort = false;
                this._centerVert = true;
                // add class name to enable styling
                wijmo.addClass(this.hostElement, 'wj-pivotgrid');
                // change some defaults
                this.isReadOnly = true;
                this.deferResizing = true;
                this.showAlternatingRows = false;
                this.autoGenerateColumns = false;
                this.allowDragging = wijmo.grid.AllowDragging.None;
                this.mergeManager = new olap._PivotMergeManager(this);
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
                this._ctxMenu = new olap._GridContextMenu();
                this._ctxMenu.attach(this);
            }
            Object.defineProperty(PivotGrid.prototype, "engine", {
                /**
                 * Gets a reference to the @see:PivotEngine that owns this @see:PivotGrid.
                 */
                get: function () {
                    return this._ng;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotGrid.prototype, "showDetailOnDoubleClick", {
                /**
                 * Gets or sets a value that determines whether the grid should show a popup containing
                 * the detail records when the user double-clicks a cell.
                 */
                get: function () {
                    return this._showDetailOnDoubleClick;
                },
                set: function (value) {
                    this._showDetailOnDoubleClick = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotGrid.prototype, "showRowFieldSort", {
                /**
                 * Gets or sets a value that determines whether the grid should display
                 * sort indicators in the column headers for row fields.
                 *
                 * Unlike regular column headers, row fields are always sorted, either
                 * in ascending or descending order. If you set this property to true,
                 * sort icons will always be displayed over any row field headers.
                 */
                get: function () {
                    return this._showRowFieldSort;
                },
                set: function (value) {
                    if (value != this._showRowFieldSort) {
                        this._showRowFieldSort = wijmo.asBoolean(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotGrid.prototype, "customContextMenu", {
                /**
                 * Gets or sets a value that determines whether the grid should provide a custom context menu.
                 *
                 * The custom context menu includes commands for changing field settings,
                 * removing fields, or showing detail records for the grid cells.
                 */
                get: function () {
                    return this._customCtxMenu;
                },
                set: function (value) {
                    this._customCtxMenu = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotGrid.prototype, "collapsibleSubtotals", {
                /**
                 * Gets or sets a value that determines whether the grid should allow users to collapse
                 * and expand subtotal groups of rows and columns.
                 */
                get: function () {
                    return this._collapsibleSubtotals;
                },
                set: function (value) {
                    if (value != this._collapsibleSubtotals) {
                        this._collapsibleSubtotals = wijmo.asBoolean(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotGrid.prototype, "centerHeadersVertically", {
                /**
                 * Gets or sets a value that determines whether the content of header cells should be
                 * vertically centered.
                 */
                get: function () {
                    return this._centerVert;
                },
                set: function (value) {
                    if (value != this._centerVert) {
                        this._centerVert = wijmo.asBoolean(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Gets an array containing the records summarized by a given grid cell.
             *
             * @param row Index of the row that contains the cell.
             * @param col Index of the column that contains the cell.
             */
            PivotGrid.prototype.getDetail = function (row, col) {
                var item = this.rows[wijmo.asInt(row)].dataItem, binding = this.columns[wijmo.asInt(col)].binding;
                return this._ng.getDetail(item, binding);
            };
            /**
             * Shows a dialog containing details for a given grid cell.
             *
             * @param row Index of the row that contains the cell.
             * @param col Index of the column that contains the cell.
             */
            PivotGrid.prototype.showDetail = function (row, col) {
                var dd = new olap.DetailDialog(document.createElement('div'));
                dd.showDetail(this, new wijmo.grid.CellRange(row, col));
                var dlg = new wijmo.input.Popup(document.createElement('div'));
                dlg.content = dd.hostElement;
                dlg.show(true);
            };
            // ** overrides
            // refresh menu items in case culture changed
            PivotGrid.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                this._ctxMenu.refresh();
                _super.prototype.refresh.call(this, fullUpdate);
            };
            // overridden to accept PivotPanel and PivotEngine as well as ICollectionView sources
            PivotGrid.prototype._getCollectionView = function (value) {
                if (value instanceof olap.PivotPanel) {
                    value = value.engine.pivotView;
                }
                else if (value instanceof olap.PivotEngine) {
                    value = value.pivotView;
                }
                return wijmo.asCollectionView(value);
            };
            // overridden to connect to PivotEngine events
            PivotGrid.prototype.onItemsSourceChanged = function () {
                // disconnect old engine
                if (this._ng) {
                    this._ng.updatedView.removeHandler(this._updatedView, this);
                }
                // get new engine
                var cv = this.collectionView;
                this._ng = cv instanceof olap.PivotCollectionView
                    ? cv.engine
                    : null;
                // connect new engine
                if (this._ng) {
                    this._ng.updatedView.addHandler(this._updatedView, this);
                }
                this._updatedView();
                // fire event as usual
                _super.prototype.onItemsSourceChanged.call(this);
            };
            // overridden to save column widths into view definition
            PivotGrid.prototype.onResizedColumn = function (e) {
                var ng = this._ng;
                if (ng) {
                    // resized fixed column
                    if (e.panel == this.topLeftCells && e.col < ng.rowFields.length) {
                        var fld = ng.rowFields[e.col];
                        fld.width = e.panel.columns[e.col].renderWidth;
                    }
                    // resized scrollable column
                    if (e.panel == this.columnHeaders && ng.valueFields.length > 0) {
                        var fld = ng.valueFields[e.col % ng.valueFields.length];
                        fld.width = e.panel.columns[e.col].renderWidth;
                    }
                }
                // raise the event
                _super.prototype.onResizedColumn.call(this, e);
            };
            // ** implementation
            // reset the grid layout/bindings when the pivot view is updated
            PivotGrid.prototype._updatedView = function () {
                // update fixed row/column counts
                this._updateFixedCounts();
                // clear scrollable rows/columns
                this.columns.clear();
                this.rows.clear();
            };
            // update fixed cell content after loading rows
            PivotGrid.prototype.onLoadedRows = function (e) {
                // generate columns and headers if necessary
                if (this.columns.length == 0) {
                    // if we have data, generate columns
                    var cv = this.collectionView;
                    if (cv && cv.items.length) {
                        var item = cv.items[0];
                        for (var key in item) {
                            if (key != olap._PivotKey._ROW_KEY_NAME) {
                                var col = new wijmo.grid.Column({
                                    binding: key,
                                    dataType: item[key] != null ? wijmo.getType(item[key]) : wijmo.DataType.Number
                                });
                                this.columns.push(col);
                            }
                        }
                    }
                }
                // update row/column headers
                this._updateFixedContent();
                // fire event as usual
                _super.prototype.onLoadedRows.call(this, e);
            };
            // update the number of fixed rows and columns
            PivotGrid.prototype._updateFixedCounts = function () {
                var ng = this._ng, hasView = ng && ng.isViewDefined, cnt;
                // fixed columns
                cnt = Math.max(1, hasView ? ng.rowFields.length : 1);
                this._setLength(this.topLeftCells.columns, cnt);
                // fixed rows
                var cnt = Math.max(1, hasView ? ng.columnFields.length : 1);
                if (ng && ng.columnFields.length && ng.valueFields.length > 1) {
                    cnt++;
                }
                this._setLength(this.topLeftCells.rows, cnt);
            };
            PivotGrid.prototype._setLength = function (arr, cnt) {
                while (arr.length < cnt) {
                    arr.push(arr instanceof wijmo.grid.ColumnCollection ? new wijmo.grid.Column() : new wijmo.grid.Row());
                }
                while (arr.length > cnt) {
                    arr.removeAt(arr.length - 1);
                }
            };
            // update the content of the fixed cells
            PivotGrid.prototype._updateFixedContent = function () {
                var ng = this._ng, hasView = ng && ng.isViewDefined;
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
                    var k = p.rows[r].dataItem[olap._PivotKey._ROW_KEY_NAME];
                    wijmo.assert(k instanceof olap._PivotKey, 'missing PivotKey for row...');
                    for (var c = 0; c < p.columns.length; c++) {
                        var value = k.getValue(c, true);
                        p.setCellData(r, c, value, false, false);
                    }
                }
                // populate column headers
                p = this.columnHeaders;
                for (var c = 0; c < p.columns.length; c++) {
                    var k = ng._getKey(p.columns[c].binding);
                    wijmo.assert(k instanceof olap._PivotKey, 'missing PivotKey for column...');
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
                    var col = p.columns[c], fld = (c < ng.rowFields.length ? ng.rowFields[c] : null);
                    col.width = (fld && wijmo.isNumber(fld.width)) ? fld.width : this.columns.defaultSize;
                    col.wordWrap = fld ? fld.wordWrap : null;
                    col.align = null;
                }
                p = this.cells;
                for (var c = 0; c < p.columns.length; c++) {
                    var col = p.columns[c], fld = (ng.valueFields.length ? ng.valueFields[c % ng.valueFields.length] : null);
                    col.width = (fld && wijmo.isNumber(fld.width)) ? fld.width : this.columns.defaultSize;
                    col.wordWrap = fld ? fld.wordWrap : null;
                    col.format = fld ? fld.format : null;
                }
            };
            // customize the grid display
            PivotGrid.prototype._formatItem = function (s, e) {
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
                var rowLevel = ng._getRowLevel(e.row), colLevel = ng._getColLevel(e.panel.columns[e.col].binding);
                wijmo.toggleClass(e.cell, 'wj-aggregate', rowLevel > -1 || colLevel > -1);
                // add collapse/expand icons
                if (this._collapsibleSubtotals) {
                    // collapsible row
                    if (e.panel == this.rowHeaders && ng.showRowTotals == olap.ShowTotals.Subtotals) {
                        var rng = this.getMergedRange(e.panel, e.row, e.col, false) || e.range;
                        if (e.col < ng.rowFields.length - 1 && rng.rowSpan > 1) {
                            e.cell.innerHTML = this._getCollapsedGlyph(this._getRowCollapsed(rng)) + e.cell.innerHTML;
                        }
                    }
                    // collapsible column
                    if (e.panel == this.columnHeaders && ng.showColumnTotals == olap.ShowTotals.Subtotals) {
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
                    wijmo.toggleClass(e.cell, 'wj-sort-asc', !fld.descending);
                    wijmo.toggleClass(e.cell, 'wj-sort-desc', fld.descending);
                    e.cell.innerHTML += ' <span class="wj-glyph-' + (fld.descending ? 'down' : 'up') + '"></span>';
                }
                // center-align header cells vertically
                if (this._centerVert && e.cell.hasChildNodes) {
                    if (e.panel == this.rowHeaders || e.panel == this.columnHeaders) {
                        // surround cell content in a vertically centered table-cell div
                        var div = wijmo.createElement('<div style="display:table-cell;vertical-align:middle"></div>');
                        if (!this._docRange) {
                            this._docRange = document.createRange();
                        }
                        this._docRange.selectNodeContents(e.cell);
                        this._docRange.surroundContents(div);
                        // make the cell display as a table
                        wijmo.setCss(e.cell, {
                            display: 'table',
                            tableLayout: 'fixed',
                            paddingTop: 0,
                            paddingBottom: 0
                        });
                    }
                }
            };
            PivotGrid.prototype._getCollapsedGlyph = function (collapsed) {
                return '<div style="display:inline-block;cursor:pointer" ' + PivotGrid._WJA_COLLAPSE + '>' +
                    '<span class="wj-glyph-' + (collapsed ? 'plus' : 'minus') + '"></span>' +
                    '</div>&nbsp';
            };
            // mouse handling
            PivotGrid.prototype._mousedown = function (e) {
                // make sure we want this event
                if (e.defaultPrevented || e.button != 0) {
                    this._htDown = null;
                    return;
                }
                // save mouse down position to use later on mouse up
                this._htDown = this.hitTest(e);
                // collapse/expand on mousedown
                var icon = wijmo.closest(e.target, '[' + PivotGrid._WJA_COLLAPSE + ']');
                if (icon != null && this._htDown.panel != null) {
                    var rng = this._htDown.range;
                    switch (this._htDown.panel.cellType) {
                        case wijmo.grid.CellType.RowHeader:
                            var collapsed = this._getRowCollapsed(rng);
                            if (e.shiftKey || e.ctrlKey) {
                                this._collapseRowsToLevel(rng.col + (collapsed ? 2 : 1));
                            }
                            else {
                                this._setRowCollapsed(rng, !collapsed);
                            }
                            break;
                        case wijmo.grid.CellType.ColumnHeader:
                            var collapsed = this._getColCollapsed(rng);
                            if (e.shiftKey || e.ctrlKey) {
                                this._collapseColsToLevel(rng.row + (collapsed ? 2 : 1));
                            }
                            else {
                                this._setColCollapsed(rng, !collapsed);
                            }
                            break;
                    }
                    this._htDown = null;
                    e.preventDefault();
                }
            };
            PivotGrid.prototype._mouseup = function (e) {
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
                var ng = this._ng, topLeft = this.topLeftCells;
                if (ht.panel == topLeft && ht.row == topLeft.rows.length - 1 && ht.col > -1) {
                    if (this.allowSorting && ht.panel.columns[ht.col].allowSorting) {
                        var args = new wijmo.grid.CellRangeEventArgs(ht.panel, ht.range);
                        if (this.onSortingColumn(args)) {
                            ng.pivotView.sortDescriptions.clear();
                            var fld = ng.rowFields[ht.col];
                            fld.descending = !fld.descending;
                            this.onSortedColumn(args);
                        }
                    }
                    e.preventDefault();
                }
            };
            PivotGrid.prototype._dblclick = function (e) {
                // check that we want this event
                if (!e.defaultPrevented && this._showDetailOnDoubleClick) {
                    var ht = this._htDown;
                    if (ht && ht.panel == this.cells) {
                        this.showDetail(ht.row, ht.col);
                    }
                }
            };
            // ** row groups
            PivotGrid.prototype._getRowLevel = function (row) {
                return this._ng._getRowLevel(row);
            };
            PivotGrid.prototype._getGroupedRows = function (rng) {
                var level = rng.col + 1, start, end;
                if (this._ng.totalsBeforeData) {
                    // expand up to find total row, then down over data rows
                    for (start = rng.row; start > 0; start--) {
                        if (this._getRowLevel(start) == level)
                            break;
                    }
                    for (end = rng.row; end < this.rows.length - 1; end++) {
                        var lvl = this._getRowLevel(end + 1);
                        if (lvl > -1 && lvl <= level)
                            break;
                    }
                    // exclude totals from group
                    start++;
                }
                else {
                    // expand down to find total row, then up over data rows
                    for (end = rng.row; end < this.rows.length; end++) {
                        if (this._getRowLevel(end) == level)
                            break;
                    }
                    for (start = rng.row; start > 0; start--) {
                        var lvl = this._getRowLevel(start - 1);
                        if (lvl > -1 && lvl <= level)
                            break;
                    }
                    // exclude totals from group
                    end--;
                }
                return end >= start // TFS 190950
                    ? new wijmo.grid.CellRange(start, rng.col, end, rng.col2)
                    : rng;
            };
            PivotGrid.prototype._getRowCollapsed = function (rng) {
                rng = this._getGroupedRows(rng);
                for (var r = rng.row; r <= rng.row2; r++) {
                    if (this.rows[r].isVisible) {
                        return false;
                    }
                }
                return true;
            };
            PivotGrid.prototype._setRowCollapsed = function (rng, collapse) {
                var _this = this;
                this.deferUpdate(function () {
                    rng = _this._getGroupedRows(rng);
                    for (var r = rng.row; r <= rng.row2; r++) {
                        _this.rows[r].visible = !collapse;
                    }
                });
            };
            PivotGrid.prototype._toggleRowCollapsed = function (rng) {
                this._setRowCollapsed(rng, !this._getRowCollapsed(rng));
            };
            PivotGrid.prototype._collapseRowsToLevel = function (level) {
                var _this = this;
                if (level >= this._ng.rowFields.length) {
                    level = -1; // show all
                }
                this.deferUpdate(function () {
                    for (var r = 0; r < _this.rows.length; r++) {
                        if (level < 0) {
                            _this.rows[r].visible = true;
                        }
                        else {
                            var rl = _this._getRowLevel(r);
                            _this.rows[r].visible = rl > -1 && rl <= level;
                        }
                    }
                });
            };
            // ** column groups
            PivotGrid.prototype._getColLevel = function (col) {
                return this._ng._getColLevel(this.columns[col].binding);
            };
            PivotGrid.prototype._getGroupedCols = function (rng) {
                var level = rng.row + 1, start, end;
                if (this._ng.totalsBeforeData) {
                    // expand left to find total column, then right over data columns
                    for (start = rng.col; start > 0; start--) {
                        if (this._getColLevel(start) == level)
                            break;
                    }
                    for (end = rng.col; end < this.columns.length - 1; end++) {
                        var lvl = this._getColLevel(end + 1);
                        if (lvl > -1 && lvl <= level)
                            break;
                    }
                    // exclude totals from group
                    start++;
                }
                else {
                    // expand right to find total column, then left over data columns
                    for (end = rng.col; end < this.columns.length; end++) {
                        if (this._getColLevel(end) == level)
                            break;
                    }
                    for (start = rng.col; start > 0; start--) {
                        var lvl = this._getColLevel(start - 1);
                        if (lvl > -1 && lvl <= level)
                            break;
                    }
                    // exclude totals from group
                    end--;
                }
                return end >= start // TFS 190950
                    ? new wijmo.grid.CellRange(rng.row, start, rng.row2, end)
                    : rng;
            };
            PivotGrid.prototype._getColCollapsed = function (rng) {
                rng = this._getGroupedCols(rng);
                for (var c = rng.col; c <= rng.col2; c++) {
                    if (this.columns[c].isVisible) {
                        return false;
                    }
                }
                return true;
            };
            PivotGrid.prototype._setColCollapsed = function (rng, collapse) {
                var _this = this;
                this.deferUpdate(function () {
                    rng = _this._getGroupedCols(rng);
                    for (var c = rng.col; c <= rng.col2; c++) {
                        _this.columns[c].visible = !collapse;
                    }
                });
            };
            PivotGrid.prototype._toggleColCollapsed = function (rng) {
                this._setColCollapsed(rng, !this._getColCollapsed(rng));
            };
            PivotGrid.prototype._collapseColsToLevel = function (level) {
                var _this = this;
                if (level >= this._ng.columnFields.length) {
                    level = -1; // show all
                }
                this.deferUpdate(function () {
                    for (var c = 0; c < _this.columns.length; c++) {
                        if (level < 0) {
                            _this.columns[c].visible = true;
                        }
                        else {
                            var cl = _this._getColLevel(c);
                            _this.columns[c].visible = cl > -1 && cl <= level;
                        }
                    }
                });
            };
            PivotGrid._WJA_COLLAPSE = 'wj-pivot-collapse';
            return PivotGrid;
        }(wijmo.grid.FlexGrid));
        olap.PivotGrid = PivotGrid;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=PivotGrid.js.map