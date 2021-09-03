module wijmo.grid.multirow {
    'use strict';

    /**
     * Provides custom merging for @see:MultiRow controls.
     */
    export class _MergeManager extends MergeManager {

        /**
         * Gets a @see:CellRange that specifies the merged extent of a cell
         * in a @see:GridPanel.
         *
         * @param p The @see:GridPanel that contains the range.
         * @param r The index of the row that contains the cell.
         * @param c The index of the column that contains the cell.
         * @param clip Specifies whether to clip the merged range to the grid's current view range.
         * @return A @see:CellRange that specifies the merged range, or null if the cell is not merged.
         */
        getMergedRange(p: GridPanel, r: number, c: number, clip = true): CellRange {
            var grid = <MultiRow>p.grid;

            // handle group rows
            switch (p.cellType) {
                case CellType.Cell:
                case CellType.RowHeader:
                    if (p.rows[r] instanceof GroupRow) {
                        return super.getMergedRange(p, r, c, clip);
                    }
            }

            // other cells
            switch (p.cellType) {

                // merge cells in cells and column headers panels
                case CellType.Cell:
                case CellType.ColumnHeader:

                    // get the group range
                    var group = <_CellGroup>grid._cellGroupsByColumn[c];
                    assert(group instanceof _CellGroup, 'Failed to get the group!');
                    if (p.cellType == CellType.ColumnHeader && grid.collapsedHeaders) {
                        r = -1; // handle collapsed headers
                    }
                    var rng = group.getMergedRange(p, r, c);

                    // prevent merging across frozen column boundary (TFS 192385)
                    if (rng && p.columns.frozen) {
                        var frz = p.columns.frozen;
                        if (rng.col < frz && rng.col2 >= frz) {
                            if (c < frz) {
                                rng.col2 = frz - 1;
                            } else {
                                rng.col = frz;
                            }
                        }
                    }

                    // prevent merging across frozen row boundary (TFS 192385)
                    if (rng && p.rows.frozen) {
                        var frz = p.rows.frozen;
                        if (rng.row < frz && rng.row2 >= frz) {
                            if (r < frz) {
                                rng.row2 = frz - 1;
                            } else {
                                rng.row = frz;
                            }
                        }
                    }

                    // return the range
                    return rng;//group.getMergedRange(p, r, c);

                // merge cells in row headers panel
                case CellType.RowHeader:
                    var rpi = grid._rowsPerItem,
                        row = <_MultiRow>p.rows[r],
                        top = r - row.recordIndex;
                    return new CellRange(top, 0, top + rpi - 1, p.columns.length - 1);

                // merge cells in top/left cell
                case CellType.TopLeft:
                    return new CellRange(0, 0, p.rows.length - 1, p.columns.length - 1);
            }

            // no merging
            return null;
        }
    }
}