var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var grid;
    (function (grid_1) {
        var detail;
        (function (detail) {
            'use strict';
            /**
             * Merge manager class used by the @see:FlexGridDetailProvider class.
             *
             * The @see:DetailMergeManager merges detail cells (cells in a @see:DetailRow)
             * into a single detail cell that spans all grid columns.
             */
            var DetailMergeManager = (function (_super) {
                __extends(DetailMergeManager, _super);
                /**
                 * Initializes a new instance of the @see:DetailMergeManager class.
                 *
                 * @param grid The @see:FlexGrid object that owns this @see:DetailMergeManager.
                 */
                function DetailMergeManager(grid) {
                    _super.call(this, grid);
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
                DetailMergeManager.prototype.getMergedRange = function (p, r, c, clip) {
                    if (clip === void 0) { clip = true; }
                    switch (p.cellType) {
                        // merge detail cells all the way across
                        case grid_1.CellType.Cell:
                            if (p.rows[r] instanceof detail.DetailRow) {
                                return new grid_1.CellRange(r, 0, r, p.columns.length - 1);
                            }
                            break;
                        // merge row headers for main and detail rows
                        case grid_1.CellType.RowHeader:
                            if (p.rows[r] instanceof detail.DetailRow) {
                                return new grid_1.CellRange(r - 1, c, r, c);
                            }
                            else if (r < p.rows.length - 1 && p.rows[r + 1] instanceof detail.DetailRow) {
                                return new grid_1.CellRange(r, c, r + 1, c);
                            }
                            break;
                    }
                    // allow base class
                    return _super.prototype.getMergedRange.call(this, p, r, c, clip);
                };
                return DetailMergeManager;
            }(grid_1.MergeManager));
            detail.DetailMergeManager = DetailMergeManager;
        })(detail = grid_1.detail || (grid_1.detail = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=DetailMergeManager.js.map