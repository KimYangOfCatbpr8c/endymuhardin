/**
 * Extension that provides detail rows for @see:FlexGrid controls.
 */
var wijmo;
(function (wijmo) {
    var grid;
    (function (grid_1) {
        var detail;
        (function (detail) {
            'use strict';
            /**
             * Specifies when and how the row details are displayed.
             */
            (function (DetailVisibilityMode) {
                /**
                 * Details are shown or hidden in code, using the
                 * @see:FlexGridDetailProvider.showDetail and
                 * @see:FlexGridDetailProvider.hideDetail methods.
                 */
                DetailVisibilityMode[DetailVisibilityMode["Code"] = 0] = "Code";
                /**
                 * Details are shown for the row that is currently selected.
                 */
                DetailVisibilityMode[DetailVisibilityMode["Selection"] = 1] = "Selection";
                /**
                 * Details are shown or hidden using buttons added to the row headers.
                 * Only one row may be expanded at a time.
                 */
                DetailVisibilityMode[DetailVisibilityMode["ExpandSingle"] = 2] = "ExpandSingle";
                /**
                 * Details are shown or hidden using buttons added to the row headers.
                 * Multiple rows may be expanded at a time.
                 */
                DetailVisibilityMode[DetailVisibilityMode["ExpandMulti"] = 3] = "ExpandMulti";
            })(detail.DetailVisibilityMode || (detail.DetailVisibilityMode = {}));
            var DetailVisibilityMode = detail.DetailVisibilityMode;
            /**
             * Implements detail rows for @see:FlexGrid controls.
             *
             * To add detail rows to a @see:FlexGrid control, create an instance of a
             * @see:FlexGridDetailProvider and set the @see:createDetailCell property
             * to a function that creates elements to be displayed in the detail cells.
             *
             * For example:
             *
             * <pre>// create FlexGrid to show categories
             * var gridCat = new wijmo.grid.FlexGrid('#gridCat');
             * gridCat.itemsSource = getCategories();
             * // add detail rows showing products in each category
             * var detailProvider = new wijmo.grid.detail.FlexGridDetailProvider(gridCat);
             * detailProvider.createDetailCell = function (row) {
             *   var cell = document.createElement('div');
             *   var gridProducts = new wijmo.grid.FlexGrid(cell);
             *   gridProducts.itemsSource = getProducts(row.dataItem.CategoryID);
             *   return cell;
             * }</pre>
             *
             * The @see:FlexGridDetailProvider provides a @see:detailVisibilityMode property
             * that determines when the detail rows should be displayed. The default value for
             * this property is <b>ExpandSingle</b>, which adds collapse/expand icons to the
             * row headers.
             */
            var FlexGridDetailProvider = (function () {
                /**
                 * Initializes a new instance of the @see:FlexGridDetailProvider class.
                 *
                 * @param grid @see:FlexGrid that will receive detail rows.
                 */
                function FlexGridDetailProvider(grid) {
                    var _this = this;
                    this._mode = DetailVisibilityMode.ExpandSingle;
                    this._g = grid;
                    // custom merging for cells and row headers
                    grid.mergeManager = new detail.DetailMergeManager(grid);
                    // expand/collapse detail
                    grid.rowHeaders.hostElement.addEventListener('click', this._hdrClick.bind(this));
                    // show details, collapse/expand icons
                    grid.formatItem.addHandler(this._formatItem, this);
                    // show details for selected cell
                    grid.selectionChanged.addHandler(this._selectionChanged, this);
                    // refresh controls to update layout when detail rows are resized
                    grid.resizedRow.addHandler(this._resizedRow, this);
                    // hide all details when grid is refreshed
                    grid.loadingRows.addHandler(function () {
                        _this.hideDetail();
                    });
                    // hide detail when dragging row
                    grid.draggingRow.addHandler(function (s, e) {
                        _this.hideDetail(e.row);
                    });
                    // keep detail row at the start even with frozen columns (TFS 131863)
                    grid.formatItem.addHandler(function (s, e) {
                        if (e.panel == s.cells) {
                            var row = s.rows[e.row];
                            if (row instanceof detail.DetailRow) {
                                e.cell.style.left = '0';
                            }
                        }
                    });
                }
                Object.defineProperty(FlexGridDetailProvider.prototype, "grid", {
                    // ** object model
                    /**
                     * Gets the @see:FlexGrid that owns this @see:FlexGridDetailProvider.
                     */
                    get: function () {
                        return this._g;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridDetailProvider.prototype, "detailVisibilityMode", {
                    /**
                     * Gets or sets a value that determines when row details are displayed.
                     */
                    get: function () {
                        return this._mode;
                    },
                    set: function (value) {
                        if (value != this._mode) {
                            this._mode = wijmo.asEnum(value, DetailVisibilityMode);
                            this.hideDetail();
                            this._g.invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridDetailProvider.prototype, "maxHeight", {
                    /**
                     * Gets or sets the maximum height of the detail rows, in pixels.
                     */
                    get: function () {
                        return this._maxHeight;
                    },
                    set: function (value) {
                        this._maxHeight = wijmo.asNumber(value, true);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridDetailProvider.prototype, "createDetailCell", {
                    /**
                     * Gets or sets the callback function that creates detail cells.
                     *
                     * The callback function takes a @see:Row as a parameter and
                     * returns an HTML element representing the row details.
                     * For example:
                     *
                     * <pre>// create detail cells for a given row
                     * dp.createDetailCell = function (row) {
                     *   var cell = document.createElement('div');
                     *   var detailGrid = new wijmo.grid.FlexGrid(cell, {
                     *     itemsSource: getProducts(row.dataItem.CategoryID),
                     *     headersVisibility: wijmo.grid.HeadersVisibility.Column
                     *   });
                     *   return cell;
                     * };</pre>
                     */
                    get: function () {
                        return this._createDetailCellFn;
                    },
                    set: function (value) {
                        this._createDetailCellFn = wijmo.asFunction(value, true);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridDetailProvider.prototype, "disposeDetailCell", {
                    /**
                     * Gets or sets the callback function that disposes of detail cells.
                     *
                     * The callback function takes a @see:Row as a parameter and
                     * disposes of any resources associated with the detail cell.
                     *
                     * This function is optional. Use it in cases where the
                     * @see:createDetailCell function allocates resources that are not
                     * automatically garbage-collected.
                     */
                    get: function () {
                        return this._disposeDetailCellFn;
                    },
                    set: function (value) {
                        this._disposeDetailCellFn = wijmo.asFunction(value, true);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexGridDetailProvider.prototype, "rowHasDetail", {
                    /**
                     * Gets or sets the callback function that determines whether a row
                     * has details.
                     *
                     * The callback function takes a @see:Row as a parameter and
                     * returns a boolean value that indicates whether the row has
                     * details. For example:
                     *
                     * <pre>// remove details from items with odd CategoryID
                     * dp.rowHasDetail = function (row) {
                     *   return row.dataItem.CategoryID % 2 == 0;
                     * };</pre>
                     *
                     * Setting this property to null indicates all rows have details.
                     */
                    get: function () {
                        return this._rowHasDetailFn;
                    },
                    set: function (value) {
                        this._rowHasDetailFn = wijmo.asFunction(value, true);
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Gets a value that determines if a row's details are visible.
                 *
                 * @param row Row or index of the row to investigate.
                 */
                FlexGridDetailProvider.prototype.isDetailVisible = function (row) {
                    var rows = this._g.rows;
                    row = this._toIndex(row);
                    if (rows[row] instanceof detail.DetailRow) {
                        return true;
                    }
                    if (row < rows.length - 1 && rows[row + 1] instanceof detail.DetailRow) {
                        return true;
                    }
                    return false;
                };
                /**
                 * Gets a value that determines if a row has details to show.
                 *
                 * @param row Row or index of the row to investigate.
                 */
                FlexGridDetailProvider.prototype.isDetailAvailable = function (row) {
                    var rows = this._g.rows;
                    row = this._toIndex(row);
                    return this._hasDetail(row);
                };
                /**
                 * Hides the detail row for a given row.
                 *
                 * @param row Row or index of the row that will have its details hidden.
                 * This parameter is optional. If not provided, all detail rows are hidden.
                 */
                FlexGridDetailProvider.prototype.hideDetail = function (row) {
                    var rows = this._g.rows;
                    // if 'row' is not provided, hide all details
                    if (row == null) {
                        for (var r = 0; r < rows.length; r++) {
                            if (rows[r] instanceof detail.DetailRow) {
                                this.hideDetail(r);
                            }
                        }
                        return;
                    }
                    // remove detail for a given row
                    row = this._toIndex(row);
                    // skip to next row if this is the main row
                    if (!(rows[row] instanceof detail.DetailRow) &&
                        row < rows.length - 1 &&
                        rows[row + 1] instanceof detail.DetailRow) {
                        row++;
                    }
                    // if we have a detail row, dispose of any child controls 
                    // (to avoid memory leaks) and remove the row
                    if (rows[row] instanceof detail.DetailRow) {
                        if (this.disposeDetailCell) {
                            this.disposeDetailCell(rows[row]);
                        }
                        wijmo.Control.disposeAll(rows[row].detail);
                        rows.removeAt(row);
                    }
                };
                /**
                 * Shows the detail row for a given row.
                 *
                 * @param row Row or index of the row that will have its details shown.
                 * @param hideOthers Whether to hide details for all other rows.
                 */
                FlexGridDetailProvider.prototype.showDetail = function (row, hideOthers) {
                    if (hideOthers === void 0) { hideOthers = false; }
                    var rows = this._g.rows;
                    // convert rows into indices
                    row = this._toIndex(row);
                    // show this
                    if (!this.isDetailVisible(row) && this._hasDetail(row)) {
                        // create detail row and cell element
                        var detailRow = new detail.DetailRow(rows[row]);
                        detailRow.detail = this._createDetailCell(rows[row]);
                        // insert new detail row below the current row and show it
                        if (detailRow.detail) {
                            rows.insert(row + 1, detailRow);
                            this._g.scrollIntoView(row, -1);
                        }
                    }
                    // hide others
                    if (hideOthers) {
                        var sel = this._g.selection, updateSelection = false;
                        if (row > 0 && rows[row] instanceof detail.DetailRow) {
                            row--;
                        }
                        for (var r = 0; r < rows.length - 1; r++) {
                            if (r != row && rows[r + 1] instanceof detail.DetailRow) {
                                this.hideDetail(r);
                                if (r < row) {
                                    row--;
                                }
                                if (r < sel.row) {
                                    sel.row--;
                                    sel.row2--;
                                    updateSelection = true;
                                }
                            }
                        }
                        if (updateSelection) {
                            this._g.select(sel, false);
                        }
                    }
                };
                // ** implementation
                // convert Row objects into row indices
                FlexGridDetailProvider.prototype._toIndex = function (row) {
                    if (row instanceof grid_1.Row) {
                        row = row.index;
                    }
                    return wijmo.asNumber(row, false, true);
                };
                // expand/collapse detail row
                FlexGridDetailProvider.prototype._hdrClick = function (e) {
                    if (this._mode == DetailVisibilityMode.ExpandMulti || this._mode == DetailVisibilityMode.ExpandSingle) {
                        var g = this._g, ht = g.hitTest(e);
                        if (ht.row > -1) {
                            var row = g.rows[ht.row];
                            if (this.isDetailVisible(ht.row)) {
                                this.hideDetail(ht.row);
                            }
                            else {
                                g.select(new grid_1.CellRange(ht.row, 0, ht.row, g.columns.length - 1));
                                this.showDetail(ht.row, this._mode == DetailVisibilityMode.ExpandSingle);
                            }
                            e.preventDefault();
                        }
                    }
                };
                // expand selected row (but not too often)
                FlexGridDetailProvider.prototype._selectionChanged = function (s, e) {
                    var _this = this;
                    if (this._mode == DetailVisibilityMode.Selection) {
                        if (this._toSel) {
                            clearTimeout(this._toSel);
                        }
                        this._toSel = setTimeout(function () {
                            if (s.selection.row > -1) {
                                _this.showDetail(s.selection.row, true);
                            }
                            else {
                                _this.hideDetail();
                            }
                        }, 300);
                    }
                };
                // show details, collapse/expand icons
                FlexGridDetailProvider.prototype._formatItem = function (s, e) {
                    var g = this._g, row = e.panel.rows[e.row];
                    // show detail in detail row
                    if (e.panel == g.cells && row instanceof detail.DetailRow && row.detail != null) {
                        // add detail to cell
                        wijmo.addClass(e.cell, 'wj-detail');
                        e.cell.textContent = '';
                        e.cell.style.textAlign = ''; // TFS 130035
                        e.cell.appendChild(row.detail);
                        // set row height (once)
                        if (row.height == null) {
                            // make sure controls in detail cell are properly sized
                            wijmo.Control.refreshAll(e.cell);
                            // calculate height needed for the detail plus padding
                            var cs = getComputedStyle(e.cell), h = row.detail.scrollHeight + parseInt(cs.paddingTop) + parseInt(cs.paddingBottom);
                            // honor max height
                            if (this._maxHeight > 0 && h > this._maxHeight) {
                                h = this._maxHeight;
                            }
                            // apply height
                            row.height = h;
                            // make the cell element fill the row
                            if (!row.detail.style.height) {
                                row.detail.style.height = '100%';
                            }
                            // make inner FlexGrid controls fill the row
                            var gridHost = row.detail.querySelector('.wj-flexgrid');
                            if (gridHost && !gridHost.style.height) {
                                gridHost.style.height = '100%';
                            }
                        }
                        else {
                            setTimeout(function () {
                                wijmo.Control.refreshAll(row.detail);
                            });
                        }
                    }
                    // show collapse/expand icon
                    if (this._mode == DetailVisibilityMode.ExpandMulti ||
                        this._mode == DetailVisibilityMode.ExpandSingle) {
                        // if this row has details, add collapse/expand icons
                        if (e.panel == g.rowHeaders && e.col == 0 && this._hasDetail(e.row)) {
                            // if the next row is, the icon is a 'minus' (collapse)
                            var minus = e.row < g.rows.length - 1 && g.rows[e.row + 1] instanceof detail.DetailRow;
                            // show icon
                            e.cell.innerHTML = minus
                                ? '<span class="wj-glyph-minus"></span>'
                                : '<span class="wj-glyph-plus"></span>';
                        }
                    }
                };
                // refresh controls to update layout when detail rows are resized
                FlexGridDetailProvider.prototype._resizedRow = function (s, e) {
                    var row = e.panel.rows[e.row];
                    if (row instanceof detail.DetailRow && row.detail) {
                        wijmo.Control.refreshAll(row.detail);
                    }
                };
                // check if a row has details currently visible
                FlexGridDetailProvider.prototype._hasVisibleDetail = function (row) {
                    return row instanceof detail.DetailRow || row instanceof grid_1.GroupRow || row instanceof grid_1._NewRowTemplate
                        ? false
                        : true;
                };
                // check if a row has details to show
                FlexGridDetailProvider.prototype._hasDetail = function (row) {
                    return wijmo.isFunction(this._rowHasDetailFn)
                        ? this._rowHasDetailFn(this._g.rows[row])
                        : true;
                };
                // creates the cell element that will show details for a given row
                FlexGridDetailProvider.prototype._createDetailCell = function (row, col) {
                    return this.createDetailCell
                        ? this.createDetailCell(row, col)
                        : null;
                };
                return FlexGridDetailProvider;
            }());
            detail.FlexGridDetailProvider = FlexGridDetailProvider;
        })(detail = grid_1.detail || (grid_1.detail = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=FlexGridDetailProvider.js.map