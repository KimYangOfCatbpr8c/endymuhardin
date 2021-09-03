var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var grid;
    (function (grid_1) {
        var multirow;
        (function (multirow) {
            'use strict';
            /**
             * Provides custom merging for @see:MultiRow controls.
             */
            var _MergeManager = (function (_super) {
                __extends(_MergeManager, _super);
                function _MergeManager() {
                    _super.apply(this, arguments);
                }
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
                _MergeManager.prototype.getMergedRange = function (p, r, c, clip) {
                    if (clip === void 0) { clip = true; }
                    var grid = p.grid;
                    // handle group rows
                    switch (p.cellType) {
                        case grid_1.CellType.Cell:
                        case grid_1.CellType.RowHeader:
                            if (p.rows[r] instanceof grid_1.GroupRow) {
                                return _super.prototype.getMergedRange.call(this, p, r, c, clip);
                            }
                    }
                    // other cells
                    switch (p.cellType) {
                        // merge cells in cells and column headers panels
                        case grid_1.CellType.Cell:
                        case grid_1.CellType.ColumnHeader:
                            // get the group range
                            var group = grid._cellGroupsByColumn[c];
                            wijmo.assert(group instanceof multirow._CellGroup, 'Failed to get the group!');
                            if (p.cellType == grid_1.CellType.ColumnHeader && grid.collapsedHeaders) {
                                r = -1; // handle collapsed headers
                            }
                            var rng = group.getMergedRange(p, r, c);
                            // prevent merging across frozen column boundary (TFS 192385)
                            if (rng && p.columns.frozen) {
                                var frz = p.columns.frozen;
                                if (rng.col < frz && rng.col2 >= frz) {
                                    if (c < frz) {
                                        rng.col2 = frz - 1;
                                    }
                                    else {
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
                                    }
                                    else {
                                        rng.row = frz;
                                    }
                                }
                            }
                            // return the range
                            return rng; //group.getMergedRange(p, r, c);
                        // merge cells in row headers panel
                        case grid_1.CellType.RowHeader:
                            var rpi = grid._rowsPerItem, row = p.rows[r], top = r - row.recordIndex;
                            return new grid_1.CellRange(top, 0, top + rpi - 1, p.columns.length - 1);
                        // merge cells in top/left cell
                        case grid_1.CellType.TopLeft:
                            return new grid_1.CellRange(0, 0, p.rows.length - 1, p.columns.length - 1);
                    }
                    // no merging
                    return null;
                };
                return _MergeManager;
            }(grid_1.MergeManager));
            multirow._MergeManager = _MergeManager;
        })(multirow = grid_1.multirow || (grid_1.multirow = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_MergeManager.js.map