module wijmo.grid {
    'use strict';

    /**
     * Contains information about the part of a @see:FlexGrid control that exists at 
     * a specified page coordinate.
     */
    export class HitTestInfo {
        _g: FlexGrid;
        _p: GridPanel;
        _pt: Point;
        _row = -1;
        _col = -1;
        _edge = 0; // left, top, right, bottom: 1, 2, 4, 8
        static _SZEDGE = [5, 30]; // distance to cell border (mouse, touch)
        
        /**
         * Initializes a new instance of the @see:HitTestInfo class.
         *
         * @param grid The @see:FlexGrid control or @see:GridPanel to investigate.
         * @param pt The @see:Point object in page coordinates to investigate.
         */
        constructor(grid: any, pt: any) {
            var g: FlexGrid;

            // check parameters
            if (grid instanceof FlexGrid) {
                g = this._g = grid;
            } else if (grid instanceof GridPanel) {
                this._p = grid;
                g = this._g = this._p.grid;
            } else {
                throw 'First parameter should be a FlexGrid or GridPanel.';
            }
            pt = mouseToPage(pt);
            this._pt = pt.clone();

            // get the variables we need
            var rc = g.controlRect,
                sz = g._szClient,
                tlp = g.topLeftCells,
                etl = g._eTL,
                hdrVis = g.headersVisibility,
                hv = HeadersVisibility,
                tlWid = (hdrVis & hv.Row) ? tlp.columns.getTotalSize() : 0,
                tlHei = (hdrVis & hv.Column) ? tlp.rows.getTotalSize() : 0,
                tlHeiSticky = (hdrVis & hv.Column) ? tlHei + etl.offsetTop : 0,
                ebl = g._eBL,
                blHei = ebl.offsetHeight;

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
                if (pt.y <= tlHeiSticky) { // topleft/columnheaders
                    this._p = pt.x <= tlWid ? g.topLeftCells : g.columnHeaders;
                } else if (pt.y <= ebl.offsetTop) { // rowheaders/cells
                    this._p = pt.x <= tlWid ? g.rowHeaders : g.cells;
                } else { // bottomleft/columnfooters
                    this._p = pt.x <= tlWid ? g.bottomLeftCells : g.columnFooters;
                }
            }

            // if we have a panel, get the coordinates
            if (this._p != null) {

                // account for frozen rows/cols
                var rows = this._p.rows,
                    cols = this._p.columns,
                    ct = this._p.cellType,
                    ptFrz = this._p._getFrozenPos(),
                    totHei =
                        (ct == CellType.TopLeft || ct == CellType.ColumnHeader) ? tlHei :
                        (ct == CellType.BottomLeft || ct == CellType.ColumnFooter) ? blHei :
                        rows.getTotalSize(),
                    totWid =
                        (ct == CellType.TopLeft || ct == CellType.BottomLeft || ct == CellType.RowHeader) ? tlWid :
                        cols.getTotalSize();

                // adjust y for scrolling/freezing
                if (ct == CellType.RowHeader || ct == CellType.Cell) {
                    pt.y -= tlHei; // discount header height without 'stickiness'
                    if (pt.y > ptFrz.y || ptFrz.y <= 0) {
                        pt.y -= g._ptScrl.y;
                        pt.y += this._p._getOffsetY(); // account for IE's CSS limitations...
                    }
                } else if (ct == CellType.BottomLeft || ct == CellType.ColumnFooter) {
                    pt.y -= ebl.offsetTop;
                }

                // adjust x for scrolling/freezing
                if (ct == CellType.ColumnHeader || ct == CellType.Cell || ct == CellType.ColumnFooter) {
                    pt.x -= tlWid;
                    if (pt.x > ptFrz.x || ptFrz.x <= 0) {
                        pt.x -= g._ptScrl.x;
                    }
                }

                // enable mouse operations while in "sticky" mode
                if (ct == CellType.ColumnHeader || ct == CellType.TopLeft) {
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
        /**
         * Gets the point in control coordinates that this @see:HitTestInfo refers to.
         */
        get point(): Point {
            return this._pt;
        }
        /**
         * Gets the cell type at the specified position.
         */
        get cellType(): CellType {
            return this._p ? this._p.cellType : grid.CellType.None;
        }
        /**
         * Gets the grid panel at the specified position.
         */
        get panel(): GridPanel {
            return this._p;
        }
        /**
         * Gets the row index of the cell at the specified position.
         */
        get row(): number {
            return this._row;
        }
        /**
         * Gets the column index of the cell at the specified position.
         */
        get col(): number {
            return this._col;
        }
        /**
         * Gets the cell range at the specified position.
         */
        get range(): CellRange {
            return new CellRange(this._row, this._col);
        }
        /**
         * Gets a value that indicates whether the mouse is near the left edge of the cell.
         */
        get edgeLeft(): boolean {
            return (this._edge & 1) != 0;
        }
        /**
         * Gets a value that indicates whether the mouse is near the top edge of the cell.
         */
        get edgeTop(): boolean {
            return (this._edge & 2) != 0;
        }
        /**
         * Gets a value that indicates whether the mouse is near the right edge of the cell.
         */
        get edgeRight(): boolean {
            return (this._edge & 4) != 0;
        }
        /**
         * Gets a value that indicates whether the mouse is near the bottom edge of the cell.
         */
        get edgeBottom(): boolean {
            return (this._edge & 8) != 0;
        }
   }
}