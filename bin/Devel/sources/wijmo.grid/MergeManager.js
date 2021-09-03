var wijmo;
(function (wijmo) {
    var grid;
    (function (grid) {
        'use strict';
        /**
         * Specifies constants that define which areas of the grid support cell merging.
         */
        (function (AllowMerging) {
            /** No merging. */
            AllowMerging[AllowMerging["None"] = 0] = "None";
            /** Merge scrollable cells. */
            AllowMerging[AllowMerging["Cells"] = 1] = "Cells";
            /** Merge column headers. */
            AllowMerging[AllowMerging["ColumnHeaders"] = 2] = "ColumnHeaders";
            /** Merge row headers. */
            AllowMerging[AllowMerging["RowHeaders"] = 4] = "RowHeaders";
            /** Merge column and row headers. */
            AllowMerging[AllowMerging["AllHeaders"] = 6] = "AllHeaders";
            /** Merge all areas. */
            AllowMerging[AllowMerging["All"] = 7] = "All";
        })(grid.AllowMerging || (grid.AllowMerging = {}));
        var AllowMerging = grid.AllowMerging;
        /**
         * Defines the @see:FlexGrid's cell merging behavior.
         *
         * An instance of this class is automatically created and assigned to
         * the grid's @see:FlexGrid.mergeManager property to implement the
         * grid's default merging behavior.
         *
         * If you want to customize the default merging behavior, create a class
         * that derives from @see:MergeManager and override the @see:getMergedRange
         * method.
         */
        var MergeManager = (function () {
            /**
             * Initializes a new instance of the @see:MergeManager class.
             *
             * @param g The @see:FlexGrid object that owns this @see:MergeManager.
             */
            function MergeManager(g) {
                this._g = g;
            }
            /**
             * Gets a @see:CellRange that specifies the merged extent of a cell
             * in a @see:GridPanel.
             *
             * @param p The @see:GridPanel that contains the range.
             * @param r The index of the row that contains the cell.
             * @param c The index of the column that contains the cell.
             * @param clip Whether to clip the merged range to the grid's current view range.
             * @return A @see:CellRange that specifies the merged range, or null if the cell is not merged.
             */
            MergeManager.prototype.getMergedRange = function (p, r, c, clip) {
                if (clip === void 0) { clip = true; }
                var rng, vr, ct = p.cellType, cols = p.columns, rows = p.rows, row = rows[r], col = cols[c];
                // no merging in new row template (TFS 82235)
                if (row instanceof grid._NewRowTemplate) {
                    return null;
                }
                // merge cells in group rows
                if (row instanceof grid.GroupRow && row.dataItem instanceof wijmo.collections.CollectionViewGroup) {
                    rng = new grid.CellRange(r, c);
                    // expand left and right preserving aggregates
                    if (col.aggregate == wijmo.Aggregate.None) {
                        while (rng.col > 0 &&
                            cols[rng.col - 1].aggregate == wijmo.Aggregate.None &&
                            rng.col != cols.frozen) {
                            rng.col--;
                        }
                        while (rng.col2 < cols.length - 1 &&
                            cols[rng.col2 + 1].aggregate == wijmo.Aggregate.None &&
                            rng.col2 + 1 != cols.frozen) {
                            rng.col2++;
                        }
                    }
                    // don't start range with invisible columns
                    while (rng.col < c && !cols[rng.col].visible) {
                        rng.col++;
                    }
                    // return merged range
                    return rng.isSingleCell ? null : rng;
                }
                // honor grid's allowMerging setting
                var done = false;
                switch (this._g.allowMerging) {
                    case AllowMerging.None:
                        done = true;
                        break;
                    case AllowMerging.Cells:
                        done = ct != grid.CellType.Cell;
                        break;
                    case AllowMerging.ColumnHeaders:
                        done = ct != grid.CellType.ColumnHeader && ct != grid.CellType.TopLeft;
                        break;
                    case AllowMerging.RowHeaders:
                        done = ct != grid.CellType.RowHeader && ct != grid.CellType.TopLeft;
                        break;
                    case AllowMerging.AllHeaders:
                        done = ct == grid.CellType.Cell;
                        break;
                }
                if (done) {
                    return null;
                }
                // merge up and down columns
                if (cols[c].allowMerging) {
                    rng = new grid.CellRange(r, c);
                    // clip to current viewport
                    var rMin = 0, rMax = rows.length - 1;
                    if (r >= rows.frozen) {
                        if (clip && (ct == grid.CellType.Cell || ct == grid.CellType.RowHeader)) {
                            vr = p._getViewRange(true);
                            rMin = vr.topRow;
                            rMax = vr.bottomRow;
                        }
                    }
                    else {
                        rMax = rows.frozen - 1;
                    }
                    // expand up and down
                    for (var tr = r - 1; tr >= rMin && this._mergeCell(p, tr, c, r, c); tr--) {
                        rng.row = tr;
                    }
                    for (var br = r + 1; br <= rMax && this._mergeCell(p, r, c, br, c); br++) {
                        rng.row2 = br;
                    }
                    // don't start range with invisible rows
                    while (rng.row < r && !rows[rng.row].visible) {
                        rng.row++;
                    }
                    // done
                    if (!rng.isSingleCell) {
                        return rng;
                    }
                }
                // merge left and right along rows
                if (rows[r].allowMerging) {
                    rng = new grid.CellRange(r, c);
                    // get merging limits
                    var cMin = 0, cMax = cols.length - 1;
                    if (c >= cols.frozen) {
                        if (clip && (ct == grid.CellType.Cell || ct == grid.CellType.ColumnHeader)) {
                            vr = p._getViewRange(true);
                            cMin = vr.leftCol;
                            cMax = vr.rightCol;
                        }
                    }
                    else {
                        cMax = cols.frozen - 1;
                    }
                    // expand left and right
                    for (var cl = c - 1; cl >= cMin && this._mergeCell(p, r, cl, r, c); cl--) {
                        rng.col = cl;
                    }
                    for (var cr = c + 1; cr <= cMax && this._mergeCell(p, r, c, r, cr); cr++) {
                        rng.col2 = cr;
                    }
                    // don't start range with invisible columns
                    while (rng.col < c && !cols[rng.col].visible) {
                        rng.col++;
                    }
                    // done
                    if (!rng.isSingleCell) {
                        return rng;
                    }
                }
                // no merging...
                return null;
            };
            // check whether two cells should be merged
            MergeManager.prototype._mergeCell = function (p, r1, c1, r2, c2) {
                // group rows and new row templates are handled separately
                var row1 = p.rows[r1], row2 = p.rows[r2];
                if (row1 instanceof grid.GroupRow || row1 instanceof grid._NewRowTemplate ||
                    row2 instanceof grid.GroupRow || row2 instanceof grid._NewRowTemplate) {
                    return false;
                }
                // no merging across freezing boundaries
                if (r1 != r2 && p.rows.isFrozen(r1) != p.rows.isFrozen(r2)) {
                    return false;
                }
                if (c1 != c2 && p.columns.isFrozen(c1) != p.columns.isFrozen(c2)) {
                    return false;
                }
                // no vertical merging if the range is already merged horizontally
                if (r1 != r2) {
                    if (c1 > 0) {
                        if ((row1.allowMerging && this._mergeCell(p, r1, c1 - 1, r1, c1)) ||
                            (row2.allowMerging && this._mergeCell(p, r2, c1 - 1, r2, c1))) {
                            return false;
                        }
                    }
                    if (c2 < p.columns.length - 1) {
                        if ((row1.allowMerging && this._mergeCell(p, r1, c2, r1, c2 + 1)) ||
                            (row2.allowMerging && this._mergeCell(p, r2, c2, r2, c2 + 1))) {
                            return false;
                        }
                    }
                }
                // no merging if the data is different
                if (p.getCellData(r1, c1, true) != p.getCellData(r2, c2, true)) {
                    return false;
                }
                // OK to merge
                return true;
            };
            return MergeManager;
        }());
        grid.MergeManager = MergeManager;
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=MergeManager.js.map