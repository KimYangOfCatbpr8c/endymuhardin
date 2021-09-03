var wijmo;
(function (wijmo) {
    var grid;
    (function (grid_1) {
        'use strict';
        /**
         * Contains information about the part of a @see:FlexGrid control that exists at
         * a specified page coordinate.
         */
        var HitTestInfo = (function () {
            /**
             * Initializes a new instance of the @see:HitTestInfo class.
             *
             * @param grid The @see:FlexGrid control or @see:GridPanel to investigate.
             * @param pt The @see:Point object in page coordinates to investigate.
             */
            function HitTestInfo(grid, pt) {
                this._row = -1;
                this._col = -1;
                this._edge = 0; // left, top, right, bottom: 1, 2, 4, 8
                var g;
                // check parameters
                if (grid instanceof grid_1.FlexGrid) {
                    g = this._g = grid;
                }
                else if (grid instanceof grid_1.GridPanel) {
                    this._p = grid;
                    g = this._g = this._p.grid;
                }
                else {
                    throw 'First parameter should be a FlexGrid or GridPanel.';
                }
                pt = wijmo.mouseToPage(pt);
                this._pt = pt.clone();
                // get the variables we need
                var rc = g.controlRect, sz = g._szClient, tlp = g.topLeftCells, etl = g._eTL, hdrVis = g.headersVisibility, hv = grid_1.HeadersVisibility, tlWid = (hdrVis & hv.Row) ? tlp.columns.getTotalSize() : 0, tlHei = (hdrVis & hv.Column) ? tlp.rows.getTotalSize() : 0, tlHeiSticky = (hdrVis & hv.Column) ? tlHei + etl.offsetTop : 0, ebl = g._eBL, blHei = ebl.offsetHeight;
                // convert page to control coordinates
                pt.x = Math.max(0, pt.x - rc.left);
                pt.y = Math.max(0, pt.y - rc.top);
                // account for right to left
                if (this._g._rtl) {
                    pt.x = rc.width - pt.x;
                }
                // find out which panel was clicked
                if (!this._p &&
                    pt.x >= 0 && pt.y >= etl.offsetTop &&
                    sz && pt.x <= sz.width + tlWid && pt.y <= sz.height + tlHeiSticky) {
                    if (pt.y <= tlHeiSticky) {
                        this._p = pt.x <= tlWid ? g.topLeftCells : g.columnHeaders;
                    }
                    else if (pt.y <= ebl.offsetTop) {
                        this._p = pt.x <= tlWid ? g.rowHeaders : g.cells;
                    }
                    else {
                        this._p = pt.x <= tlWid ? g.bottomLeftCells : g.columnFooters;
                    }
                }
                // if we have a panel, get the coordinates
                if (this._p != null) {
                    // account for frozen rows/cols
                    var rows = this._p.rows, cols = this._p.columns, ct = this._p.cellType, ptFrz = this._p._getFrozenPos(), totHei = (ct == grid_1.CellType.TopLeft || ct == grid_1.CellType.ColumnHeader) ? tlHei :
                        (ct == grid_1.CellType.BottomLeft || ct == grid_1.CellType.ColumnFooter) ? blHei :
                            rows.getTotalSize(), totWid = (ct == grid_1.CellType.TopLeft || ct == grid_1.CellType.BottomLeft || ct == grid_1.CellType.RowHeader) ? tlWid :
                        cols.getTotalSize();
                    // adjust y for scrolling/freezing
                    if (ct == grid_1.CellType.RowHeader || ct == grid_1.CellType.Cell) {
                        pt.y -= tlHei; // discount header height without 'stickiness'
                        if (pt.y > ptFrz.y || ptFrz.y <= 0) {
                            pt.y -= g._ptScrl.y;
                            pt.y += this._p._getOffsetY(); // account for IE's CSS limitations...
                        }
                    }
                    else if (ct == grid_1.CellType.BottomLeft || ct == grid_1.CellType.ColumnFooter) {
                        pt.y -= ebl.offsetTop;
                    }
                    // adjust x for scrolling/freezing
                    if (ct == grid_1.CellType.ColumnHeader || ct == grid_1.CellType.Cell || ct == grid_1.CellType.ColumnFooter) {
                        pt.x -= tlWid;
                        if (pt.x > ptFrz.x || ptFrz.x <= 0) {
                            pt.x -= g._ptScrl.x;
                        }
                    }
                    // enable mouse operations while in "sticky" mode
                    if (ct == grid_1.CellType.ColumnHeader || ct == grid_1.CellType.TopLeft) {
                        pt.y -= (tlHeiSticky - tlHei);
                    }
                    // get row and column
                    this._row = pt.y > totHei ? -1 : rows.getItemAt(pt.y);
                    this._col = pt.x > totWid ? -1 : cols.getItemAt(pt.x);
                    if (this._row < 0 || this._col < 0) {
                        this._p = null;
                        return;
                    }
                    // get edges (larger if touching)
                    this._edge = 0;
                    var szEdge = HitTestInfo._SZEDGE[this._g.isTouching ? 1 : 0];
                    if (this._col > -1) {
                        var col = cols[this._col];
                        if (pt.x - col.pos <= szEdge) {
                            this._edge |= 1; // left
                        }
                        if (col.pos + col.renderSize - pt.x <= szEdge) {
                            this._edge |= 4; // right
                        }
                    }
                    if (this._row > -1) {
                        var row = rows[this._row];
                        if (pt.y - row.pos <= szEdge) {
                            this._edge |= 2; // top
                        }
                        if (row.pos + row.renderSize - pt.y <= szEdge) {
                            this._edge |= 8; // bottom
                        }
                    }
                }
            }
            Object.defineProperty(HitTestInfo.prototype, "point", {
                /**
                 * Gets the point in control coordinates that this @see:HitTestInfo refers to.
                 */
                get: function () {
                    return this._pt;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HitTestInfo.prototype, "cellType", {
                /**
                 * Gets the cell type at the specified position.
                 */
                get: function () {
                    return this._p ? this._p.cellType : grid.CellType.None;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HitTestInfo.prototype, "panel", {
                /**
                 * Gets the grid panel at the specified position.
                 */
                get: function () {
                    return this._p;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HitTestInfo.prototype, "row", {
                /**
                 * Gets the row index of the cell at the specified position.
                 */
                get: function () {
                    return this._row;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HitTestInfo.prototype, "col", {
                /**
                 * Gets the column index of the cell at the specified position.
                 */
                get: function () {
                    return this._col;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HitTestInfo.prototype, "range", {
                /**
                 * Gets the cell range at the specified position.
                 */
                get: function () {
                    return new grid_1.CellRange(this._row, this._col);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HitTestInfo.prototype, "edgeLeft", {
                /**
                 * Gets a value that indicates whether the mouse is near the left edge of the cell.
                 */
                get: function () {
                    return (this._edge & 1) != 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HitTestInfo.prototype, "edgeTop", {
                /**
                 * Gets a value that indicates whether the mouse is near the top edge of the cell.
                 */
                get: function () {
                    return (this._edge & 2) != 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HitTestInfo.prototype, "edgeRight", {
                /**
                 * Gets a value that indicates whether the mouse is near the right edge of the cell.
                 */
                get: function () {
                    return (this._edge & 4) != 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HitTestInfo.prototype, "edgeBottom", {
                /**
                 * Gets a value that indicates whether the mouse is near the bottom edge of the cell.
                 */
                get: function () {
                    return (this._edge & 8) != 0;
                },
                enumerable: true,
                configurable: true
            });
            HitTestInfo._SZEDGE = [5, 30]; // distance to cell border (mouse, touch)
            return HitTestInfo;
        }());
        grid_1.HitTestInfo = HitTestInfo;
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=HitTestInfo.js.map