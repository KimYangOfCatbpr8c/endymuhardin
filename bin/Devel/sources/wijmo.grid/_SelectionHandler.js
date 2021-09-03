var wijmo;
(function (wijmo) {
    var grid;
    (function (grid) {
        'use strict';
        /**
         * Specifies constants that define the selection behavior.
         */
        (function (SelectionMode) {
            /** The user cannot select cells using the mouse or keyboard. */
            SelectionMode[SelectionMode["None"] = 0] = "None";
            /** The user can select only a single cell at a time. */
            SelectionMode[SelectionMode["Cell"] = 1] = "Cell";
            /** The user can select contiguous blocks of cells. */
            SelectionMode[SelectionMode["CellRange"] = 2] = "CellRange";
            /** The user can select a single row at a time. */
            SelectionMode[SelectionMode["Row"] = 3] = "Row";
            /** The user can select contiguous rows. */
            SelectionMode[SelectionMode["RowRange"] = 4] = "RowRange";
            /** The user can select non-contiguous rows. */
            SelectionMode[SelectionMode["ListBox"] = 5] = "ListBox";
        })(grid.SelectionMode || (grid.SelectionMode = {}));
        var SelectionMode = grid.SelectionMode;
        /**
         * Specifies constants that represent the selected state of a cell.
         */
        (function (SelectedState) {
            /** The cell is not selected. */
            SelectedState[SelectedState["None"] = 0] = "None";
            /** The cell is selected but is not the active cell. */
            SelectedState[SelectedState["Selected"] = 1] = "Selected";
            /** The cell is selected and is the active cell. */
            SelectedState[SelectedState["Cursor"] = 2] = "Cursor";
        })(grid.SelectedState || (grid.SelectedState = {}));
        var SelectedState = grid.SelectedState;
        /**
         * Specifies constants that represent a type of movement for the selection.
         */
        (function (SelMove) {
            /** Do not change the selection. */
            SelMove[SelMove["None"] = 0] = "None";
            /** Select the next visible cell. */
            SelMove[SelMove["Next"] = 1] = "Next";
            /** Select the previous visible cell. */
            SelMove[SelMove["Prev"] = 2] = "Prev";
            /** Select the first visible cell in the next page. */
            SelMove[SelMove["NextPage"] = 3] = "NextPage";
            /** Select the first visible cell in the previous page. */
            SelMove[SelMove["PrevPage"] = 4] = "PrevPage";
            /** Select the first visible cell. */
            SelMove[SelMove["Home"] = 5] = "Home";
            /** Select the last visible cell. */
            SelMove[SelMove["End"] = 6] = "End";
            /** Select the next visible cell skipping rows if necessary. */
            SelMove[SelMove["NextCell"] = 7] = "NextCell";
            /** Select the previous visible cell skipping rows if necessary. */
            SelMove[SelMove["PrevCell"] = 8] = "PrevCell";
        })(grid.SelMove || (grid.SelMove = {}));
        var SelMove = grid.SelMove;
        /**
         * Handles the grid's selection.
         */
        var _SelectionHandler = (function () {
            /**
             * Initializes a new instance of the @see:_SelectionHandler class.
             *
             * @param g @see:FlexGrid that owns this @see:_SelectionHandler.
             */
            function _SelectionHandler(g) {
                this._sel = new grid.CellRange(0, 0);
                this._mode = SelectionMode.CellRange;
                this._g = g;
            }
            Object.defineProperty(_SelectionHandler.prototype, "selectionMode", {
                /**
                 * Gets or sets the current selection mode.
                 */
                get: function () {
                    return this._mode;
                },
                set: function (value) {
                    if (value != this._mode) {
                        // update ListBox selection when switching modes
                        if (value == SelectionMode.ListBox || this._mode == SelectionMode.ListBox) {
                            var rows = this._g.rows;
                            for (var i = 0; i < rows.length; i++) {
                                var row = rows[i], sel = (value == SelectionMode.ListBox) ? this._sel.containsRow(i) : false;
                                row._setFlag(grid.RowColFlags.Selected, sel, true);
                            }
                        }
                        // collapse selection when switching to None/Cell/Row modes (TFS 130691)
                        switch (value) {
                            case SelectionMode.None:
                                this._sel.setRange(-1, -1);
                                break;
                            case SelectionMode.Cell:
                                this._sel.row2 = this._sel.row;
                                this._sel.col2 = this._sel.col;
                                break;
                            case SelectionMode.Row:
                                this._sel.row2 = this._sel.row;
                                break;
                        }
                        // apply new mode
                        this._mode = value;
                        this._g.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SelectionHandler.prototype, "selection", {
                /**
                 * Gets or sets the current selection.
                 */
                get: function () {
                    return this._sel;
                },
                set: function (value) {
                    this.select(value);
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Selects a cell range and optionally scrolls it into view.
             *
             * @param rng Range to select.
             * @param show Whether to scroll the new selection into view.
             */
            _SelectionHandler.prototype.select = function (rng, show) {
                if (show === void 0) { show = true; }
                // allow passing in row and column indices
                if (wijmo.isNumber(rng) && wijmo.isNumber(show)) {
                    rng = new grid.CellRange(rng, show);
                    show = true;
                }
                rng = wijmo.asType(rng, grid.CellRange);
                // get old and new selections
                var g = this._g, oldSel = this._sel, newSel = rng, lbMode = false;
                // adjust for selection mode
                switch (g.selectionMode) {
                    // Cell mode: collapse range into single cell
                    case SelectionMode.Cell:
                        rng.row2 = rng.row;
                        rng.col2 = rng.col;
                        break;
                    // Row mode: collapse range into single row
                    case SelectionMode.Row:
                        rng.row2 = rng.row;
                        break;
                    // ListBox mode: remember because handling is quite different
                    case SelectionMode.ListBox:
                        lbMode = true;
                        break;
                }
                // check if the selection really is changing
                // (special handling for ListBox mode when re-selecting items)
                var noChange = newSel.equals(oldSel);
                if (lbMode && newSel.row > -1 && !g.rows[newSel.row].isSelected) {
                    noChange = false;
                }
                // no change? done
                if (noChange) {
                    if (show) {
                        g.scrollIntoView(newSel.row, newSel.col);
                    }
                    return;
                }
                // raise selectionChanging event
                var e = new grid.CellRangeEventArgs(g.cells, newSel);
                if (!g.onSelectionChanging(e)) {
                    return;
                }
                // ListBox mode: update Selected flag and refresh to show changes
                // (after firing the selectionChanging cancelable event)
                if (lbMode) {
                    for (var i = 0; i < g.rows.length; i++) {
                        g.rows[i]._setFlag(grid.RowColFlags.Selected, newSel.containsRow(i), true);
                    }
                    g.refreshCells(false, true, true);
                }
                // validate selection after the change
                newSel.row = Math.min(newSel.row, g.rows.length - 1);
                newSel.row2 = Math.min(newSel.row2, g.rows.length - 1);
                // update selection
                this._sel = newSel;
                // show the new selection
                g.refreshCells(false, true, true);
                if (show) {
                    g.scrollIntoView(newSel.row, newSel.col);
                }
                // update collectionView cursor
                if (g.collectionView) {
                    var index = g._getCvIndex(newSel.row);
                    g.collectionView.moveCurrentToPosition(index);
                }
                // raise selectionChanged event
                g.onSelectionChanged(e);
            };
            /**
             * Moves the selection by a specified amount in the vertical and horizontal directions.
             * @param rowMove How to move the row selection.
             * @param colMove How to move the column selection.
             * @param extend Whether to extend the current selection or start a new one.
             */
            _SelectionHandler.prototype.moveSelection = function (rowMove, colMove, extend) {
                var row, col, g = this._g, rows = g.rows, cols = g.columns, rng = this._getReferenceCell(rowMove, colMove, extend), pageSize = Math.max(0, g._szClient.height - g.columnHeaders.height);
                // handle next cell with wrapping
                if (colMove == SelMove.NextCell) {
                    col = cols.getNextCell(rng.col, SelMove.Next, pageSize);
                    row = rng.row;
                    if (col == rng.col) {
                        row = rows.getNextCell(row, SelMove.Next, pageSize);
                        if (row > rng.row) {
                            col = cols.getNextCell(0, SelMove.Next, pageSize);
                            col = cols.getNextCell(col, SelMove.Prev, pageSize);
                        }
                    }
                    g.select(row, col);
                }
                else if (colMove == SelMove.PrevCell) {
                    col = cols.getNextCell(rng.col, SelMove.Prev, pageSize);
                    row = rng.row;
                    if (col == rng.col) {
                        row = rows.getNextCell(row, SelMove.Prev, pageSize);
                        if (row < rng.row) {
                            col = cols.getNextCell(cols.length - 1, SelMove.Prev, pageSize);
                            col = cols.getNextCell(col, SelMove.Next, pageSize);
                        }
                    }
                    g.select(row, col);
                }
                else {
                    // get target row, column
                    row = rows.getNextCell(rng.row, rowMove, pageSize);
                    col = cols.getNextCell(rng.col, colMove, pageSize);
                    // extend or select
                    if (extend) {
                        var sel = g._selHdl._sel;
                        g.select(new grid.CellRange(row, col, sel.row2, sel.col2));
                    }
                    else {
                        g.select(row, col);
                    }
                }
            };
            // get reference cell for selection change, taking merging into account
            _SelectionHandler.prototype._getReferenceCell = function (rowMove, colMove, extend) {
                var g = this._g, sel = g._selHdl._sel, rng = g.getMergedRange(g.cells, sel.row, sel.col);
                // not merging? use selection as a reference
                if (!rng || rng.isSingleCell) {
                    return sel;
                }
                // clone range and set reference cell within the range
                rng = rng.clone();
                switch (rowMove) {
                    case SelMove.Next:
                    case SelMove.NextCell:
                        rng.row = rng.bottomRow;
                        break;
                    case SelMove.None:
                        rng.row = sel.row;
                        break;
                }
                switch (colMove) {
                    case SelMove.Next:
                    case SelMove.NextCell:
                        rng.col = rng.rightCol;
                        break;
                    case SelMove.None:
                        rng.col = sel.col;
                        break;
                }
                // done
                return rng;
            };
            // adjusts a selection to reflect the current selection mode
            /*private*/ _SelectionHandler.prototype._adjustSelection = function (rng) {
                switch (this._mode) {
                    case SelectionMode.Cell:
                        return new grid.CellRange(rng.row, rng.col, rng.row, rng.col);
                    case SelectionMode.Row:
                        return new grid.CellRange(rng.row, 0, rng.row, this._g.columns.length - 1);
                    case SelectionMode.RowRange:
                    case SelectionMode.ListBox:
                        return new grid.CellRange(rng.row, 0, rng.row2, this._g.columns.length - 1);
                }
                return rng;
            };
            return _SelectionHandler;
        }());
        grid._SelectionHandler = _SelectionHandler;
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_SelectionHandler.js.map