module wijmo.grid {
    'use strict';

    /**
     * Specifies constants that define which areas of the grid support cell merging.
     */
    export enum AllowMerging
    {
        /** No merging. */ 
        None = 0,
        /** Merge scrollable cells. */ 
        Cells = 1,
        /** Merge column headers. */
        ColumnHeaders = 2,
        /** Merge row headers. */
        RowHeaders = 4,
        /** Merge column and row headers. */
        AllHeaders = ColumnHeaders | RowHeaders,
        /** Merge all areas. */
        All = Cells | AllHeaders
    }

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
    export class MergeManager {
        _g: FlexGrid;

        /**
         * Initializes a new instance of the @see:MergeManager class.
         *
         * @param g The @see:FlexGrid object that owns this @see:MergeManager.
         */
        constructor(g: FlexGrid) {
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
        getMergedRange(p: GridPanel, r: number, c: number, clip = true): CellRange {
            var rng: CellRange,
                vr: CellRange,
                ct = p.cellType,
                cols = p.columns,
                rows = p.rows,
                row = rows[r],
                col = cols[c];

            // no merging in new row template (TFS 82235)
            if (row instanceof _NewRowTemplate) {
                return null;
            }

            // merge cells in group rows
            if (row instanceof GroupRow && row.dataItem instanceof collections.CollectionViewGroup) {
                rng = new CellRange(r, c);

                // expand left and right preserving aggregates
                if (col.aggregate == Aggregate.None) {
                    while (rng.col > 0 &&
                        cols[rng.col - 1].aggregate == Aggregate.None &&
                        rng.col != cols.frozen) {
                        rng.col--;
                    }
                    while (rng.col2 < cols.length - 1 &&
                        cols[rng.col2 + 1].aggregate == Aggregate.None &&
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
                    done = ct != CellType.Cell;
                    break;
                case AllowMerging.ColumnHeaders:
                    done = ct != CellType.ColumnHeader && ct != CellType.TopLeft;
                    break;
                case AllowMerging.RowHeaders:
                    done = ct != CellType.RowHeader && ct != CellType.TopLeft;
                    break;
                case AllowMerging.AllHeaders:
                    done = ct == CellType.Cell;
                    break;
            }
            if (done) {
                return null;
            }

            // merge up and down columns
            if (cols[c].allowMerging) {
                rng = new CellRange(r, c);

                // clip to current viewport
                var rMin = 0,
                    rMax = rows.length - 1;
                if (r >= rows.frozen) {
                    if (clip && (ct == CellType.Cell || ct == CellType.RowHeader)) {
                        vr = p._getViewRange(true);
                        rMin = vr.topRow;
                        rMax = vr.bottomRow;
                    }
                } else {
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
                rng = new CellRange(r, c);

                // get merging limits
                var cMin = 0,
                    cMax = cols.length - 1;
                if (c >= cols.frozen) {
                    if (clip && (ct == CellType.Cell || ct == CellType.ColumnHeader)) {
                        vr = p._getViewRange(true);
                        cMin = vr.leftCol;
                        cMax = vr.rightCol;
                    }
                } else {
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
        }

        // check whether two cells should be merged
        _mergeCell(p: GridPanel, r1: number, c1: number, r2: number, c2: number) {

            // group rows and new row templates are handled separately
            var row1 = p.rows[r1],
                row2 = p.rows[r2];
            if (row1 instanceof GroupRow || row1 instanceof _NewRowTemplate ||
                row2 instanceof GroupRow || row2 instanceof _NewRowTemplate) {
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
        }
    }
}
