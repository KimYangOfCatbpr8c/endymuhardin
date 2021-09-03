module wijmo.grid.detail {
    'use strict';

    /**
     * Merge manager class used by the @see:FlexGridDetailProvider class.
     *
     * The @see:DetailMergeManager merges detail cells (cells in a @see:DetailRow)
     * into a single detail cell that spans all grid columns.
     */
    export class DetailMergeManager extends MergeManager {

        /**
         * Initializes a new instance of the @see:DetailMergeManager class.
         *
         * @param grid The @see:FlexGrid object that owns this @see:DetailMergeManager.
         */
        constructor(grid: FlexGrid) {
            super(grid);
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
            switch (p.cellType) {

                // merge detail cells all the way across
                case CellType.Cell:
                    if (p.rows[r] instanceof DetailRow) {
                        return new CellRange(r, 0, r, p.columns.length - 1);
                    }
                    break;

                // merge row headers for main and detail rows
                case CellType.RowHeader:
                    if (p.rows[r] instanceof DetailRow) {
                        return new CellRange(r - 1, c, r, c);
                    } else if (r < p.rows.length - 1 && p.rows[r + 1] instanceof DetailRow) {
                        return new CellRange(r, c, r + 1, c);
                    }
                    break;
            }

            // allow base class
            return super.getMergedRange(p, r, c, clip);
        }
   }
}