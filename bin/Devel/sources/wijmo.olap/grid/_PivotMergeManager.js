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
         * Provides custom merging for @see:PivotGrid controls.
         */
        var _PivotMergeManager = (function (_super) {
            __extends(_PivotMergeManager, _super);
            function _PivotMergeManager() {
                _super.apply(this, arguments);
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
            _PivotMergeManager.prototype.getMergedRange = function (p, r, c, clip) {
                if (clip === void 0) { clip = true; }
                // get the engine from the grid
                var view = p.grid.collectionView;
                this._ng = view instanceof olap.PivotCollectionView
                    ? view.engine
                    : null;
                // not connected? use default implementation
                if (!this._ng) {
                    return _super.prototype.getMergedRange.call(this, p, r, c, clip);
                }
                // merge row and column headers
                switch (p.cellType) {
                    case wijmo.grid.CellType.RowHeader:
                        var rng = clip ? p.viewRange : null;
                        return this._getMergedRowHeaderRange(p, r, c, rng);
                    case wijmo.grid.CellType.ColumnHeader:
                        var rng = clip ? p.viewRange : null;
                        return this._getMergedColumnHeaderRange(p, r, c, rng);
                }
                // not merged
                return null;
            };
            // get merged row header cells
            _PivotMergeManager.prototype._getMergedRowHeaderRange = function (p, r, c, rng) {
                var val = p.getCellData(r, c, false), rstVal = c > 0 ? p.getCellData(r, c - 1, false) : null;
                // expand range left and right (totals)
                var rowLevel = this._ng._getRowLevel(r);
                if (rowLevel > -1 && c >= rowLevel) {
                    var c1, c2, cMin = rng ? rng.col : 0, cMax = rng ? rng.col2 : p.columns.length - 1;
                    for (c1 = c; c1 > cMin; c1--) {
                        if (p.getCellData(r, c1 - 1, false) != val) {
                            break;
                        }
                    }
                    for (c2 = c; c2 < cMax; c2++) {
                        if (p.getCellData(r, c2 + 1, false) != val) {
                            break;
                        }
                    }
                    return c1 != c2
                        ? new wijmo.grid.CellRange(r, c1, r, c2) // merged columns
                        : null; // not merged
                }
                // expand range up and down
                var r1, r2, rMin = rng ? rng.row : 0, rMax = rng ? rng.row2 : p.rows.length - 1;
                for (r1 = r; r1 > rMin; r1--) {
                    if (p.getCellData(r1 - 1, c, false) != val) {
                        break;
                    }
                    if (rstVal && p.getCellData(r1 - 1, c - 1, false) != rstVal) {
                        break;
                    }
                }
                for (r2 = r; r2 < rMax; r2++) {
                    if (p.getCellData(r2 + 1, c, false) != val) {
                        break;
                    }
                    if (rstVal && p.getCellData(r2 + 1, c - 1, false) != rstVal) {
                        break;
                    }
                }
                if (r1 != r2) {
                    return new wijmo.grid.CellRange(r1, c, r2, c);
                }
                // not merged
                return null;
            };
            // get merged column header cells
            _PivotMergeManager.prototype._getMergedColumnHeaderRange = function (p, r, c, rng) {
                var key = this._ng._getKey(p.columns[c].binding), val = p.getCellData(r, c, false), rstVal = r > 0 ? p.getCellData(r - 1, c, false) : null;
                // expand range up and down (totals)
                var colLevel = this._ng._getColLevel(key);
                if (colLevel > -1 && r >= colLevel) {
                    var r1, r2, rMin = rng ? rng.row : 0, rMax = rng ? rng.row2 : p.rows.length - 1;
                    for (r1 = r; r1 > rMin; r1--) {
                        if (p.getCellData(r1 - 1, c, false) != val) {
                            break;
                        }
                    }
                    for (r2 = r; r2 < rMax; r2++) {
                        if (p.getCellData(r2 + 1, c, false) != val) {
                            break;
                        }
                    }
                    if (r1 != r2) {
                        return new wijmo.grid.CellRange(r1, c, r2, c);
                    }
                }
                // expand range left and right
                var c1, c2, cMin = rng ? rng.col : 0, cMax = rng ? rng.col2 : p.columns.length - 1;
                for (c1 = c; c1 > cMin; c1--) {
                    if (p.getCellData(r, c1 - 1, false) != val) {
                        break;
                    }
                    if (rstVal && p.getCellData(r - 1, c1 - 1, false) != rstVal) {
                        break;
                    }
                }
                for (c2 = c; c2 < cMax; c2++) {
                    if (p.getCellData(r, c2 + 1, false) != val) {
                        break;
                    }
                    if (rstVal && p.getCellData(r - 1, c2 + 1, false) != rstVal) {
                        break;
                    }
                }
                if (c1 != c2) {
                    return new wijmo.grid.CellRange(r, c1, r, c2);
                }
                // not merged
                return null;
            };
            return _PivotMergeManager;
        }(wijmo.grid.MergeManager));
        olap._PivotMergeManager = _PivotMergeManager;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_PivotMergeManager.js.map