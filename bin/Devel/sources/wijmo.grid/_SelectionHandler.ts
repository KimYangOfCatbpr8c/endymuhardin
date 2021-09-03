module wijmo.grid {
    'use strict';

    /**
     * Specifies constants that define the selection behavior.
     */
    export enum SelectionMode {
        /** The user cannot select cells using the mouse or keyboard. */
        None,
        /** The user can select only a single cell at a time. */
        Cell,
        /** The user can select contiguous blocks of cells. */
        CellRange,
        /** The user can select a single row at a time. */
        Row,
        /** The user can select contiguous rows. */
        RowRange,
        /** The user can select non-contiguous rows. */
        ListBox
    }

    /**
     * Specifies constants that represent the selected state of a cell.
     */
    export enum SelectedState {
        /** The cell is not selected. */
        None,
        /** The cell is selected but is not the active cell. */
        Selected,
        /** The cell is selected and is the active cell. */
        Cursor,
    }

    /**
     * Specifies constants that represent a type of movement for the selection.
     */
    export enum SelMove {
        /** Do not change the selection. */
        None,
        /** Select the next visible cell. */
        Next,
        /** Select the previous visible cell. */
        Prev,
        /** Select the first visible cell in the next page. */
        NextPage,
        /** Select the first visible cell in the previous page. */
        PrevPage,
        /** Select the first visible cell. */
        Home,
        /** Select the last visible cell. */
        End,
        /** Select the next visible cell skipping rows if necessary. */
        NextCell,
        /** Select the previous visible cell skipping rows if necessary. */
        PrevCell
    }

    /**
     * Handles the grid's selection.
     */
    export class _SelectionHandler {
        _g: FlexGrid;
        _sel = new CellRange(0, 0);
        _mode = SelectionMode.CellRange;

        /**
         * Initializes a new instance of the @see:_SelectionHandler class.
         *
         * @param g @see:FlexGrid that owns this @see:_SelectionHandler.
         */
        constructor(g: FlexGrid) {
            this._g = g;
        }

        /**
         * Gets or sets the current selection mode.
         */
        get selectionMode(): SelectionMode {
            return this._mode;
        }
        set selectionMode(value: SelectionMode) {
            if (value != this._mode) {

                // update ListBox selection when switching modes
                if (value == SelectionMode.ListBox || this._mode == SelectionMode.ListBox) {
                    var rows = this._g.rows;
                    for (var i = 0; i < rows.length; i++) {
                        var row = rows[i],
                            sel = (value == SelectionMode.ListBox) ? this._sel.containsRow(i) : false;
                        row._setFlag(RowColFlags.Selected, sel, true);
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
        }
        /**
         * Gets or sets the current selection.
         */
        get selection(): CellRange {
            return this._sel;
        }
        set selection(value: CellRange) {
            this.select(value);
        }
        /**
         * Selects a cell range and optionally scrolls it into view.
         *
         * @param rng Range to select.
         * @param show Whether to scroll the new selection into view.
         */
        select(rng: any, show: any = true) {

            // allow passing in row and column indices
            if (isNumber(rng) && isNumber(show)) {
                rng = new CellRange(<number>rng, <number>show);
                show = true;
            }
            rng = asType(rng, CellRange);

            // get old and new selections
            var g = this._g,
                oldSel = this._sel,
                newSel = rng,
                lbMode = false;

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
            var e = new CellRangeEventArgs(g.cells, newSel);
            if (!g.onSelectionChanging(e)) {
                return;
            }

            // ListBox mode: update Selected flag and refresh to show changes
            // (after firing the selectionChanging cancelable event)
            if (lbMode) {
                for (var i = 0; i < g.rows.length; i++) {
                    (<Row>g.rows[i])._setFlag(RowColFlags.Selected, newSel.containsRow(i), true);
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
        }
        /**
         * Moves the selection by a specified amount in the vertical and horizontal directions.
         * @param rowMove How to move the row selection.
         * @param colMove How to move the column selection.
         * @param extend Whether to extend the current selection or start a new one.
         */
        moveSelection(rowMove: SelMove, colMove: SelMove, extend: boolean) {
            var row, col,
                g = this._g,
                rows = g.rows,
                cols = g.columns,
                rng = this._getReferenceCell(rowMove, colMove, extend),
                pageSize = Math.max(0, g._szClient.height - g.columnHeaders.height);

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

            } else if (colMove == SelMove.PrevCell) {

                col = cols.getNextCell(rng.col, SelMove.Prev, pageSize);
                row = rng.row;
                if (col == rng.col) { // reached first column, wrap to previous row
                    row = rows.getNextCell(row, SelMove.Prev, pageSize);
                    if (row < rng.row) {
                        col = cols.getNextCell(cols.length - 1, SelMove.Prev, pageSize);
                        col = cols.getNextCell(col, SelMove.Next, pageSize);
                    }
                }
                g.select(row, col);

            } else {

                // get target row, column
                row = rows.getNextCell(rng.row, rowMove, pageSize);
                col = cols.getNextCell(rng.col, colMove, pageSize);

                // extend or select
                if (extend) {
                    var sel = g._selHdl._sel;
                    g.select(new CellRange(row, col, sel.row2, sel.col2));
                } else {
                    g.select(row, col);
                }
            }
        }

        // get reference cell for selection change, taking merging into account
        private _getReferenceCell(rowMove: SelMove, colMove: SelMove, extend: boolean): CellRange {
            var g = this._g,
                sel = g._selHdl._sel,
                rng = g.getMergedRange(g.cells, sel.row, sel.col);

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
        }

        // adjusts a selection to reflect the current selection mode
        /*private*/ _adjustSelection(rng: CellRange): CellRange {
            switch (this._mode) {
                case SelectionMode.Cell:
                    return new CellRange(rng.row, rng.col, rng.row, rng.col);
                case SelectionMode.Row:
                    return new CellRange(rng.row, 0, rng.row, this._g.columns.length - 1);
                case SelectionMode.RowRange:
                case SelectionMode.ListBox:
                    return new CellRange(rng.row, 0, rng.row2, this._g.columns.length - 1);
            }
            return rng;
        }
    }
}
