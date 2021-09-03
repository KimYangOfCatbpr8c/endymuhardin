module wijmo.grid.multirow {
    'use strict';

    /**
     * Describes a group of cells that may span multiple rows and columns.
     */
    export class _CellGroup extends _Cell {
        _g: MultiRow;               // owner grid
        _colstart = 0;              // index of the column where this group starts
        _cells: _Cell[];            // list of binding columns in this group
        _rng: CellRange[];          // array of ranges with merge range offsets for cells in this group
        _cols: ColumnCollection;    // array of columns to use for binding cells in this group

        /**
         * Initializes a new instance of the @see:_CellGroup class.
         *
         * @param grid @see:MultiRow that owns the @see:_CellGroup.
         * @param options JavaScript object containing initialization data for the new @see:_CellGroup.
         */
        constructor(grid: MultiRow, options?: any) {
            super();

            // save reference to owner grid
            this._g = grid;

            // parse options
            if (options) {
                copy(this, options);
            }
            if (!this._cells) {
                throw 'Cell group with no cells?';
            }

            // count rows/columns
            var r = 0,
                c = 0;
            for (var i = 0; i < this._cells.length; i++) {
                var cell = <_Cell>this._cells[i];

                // if the cell doesn't fit in this row, start a new row
                if (c + cell.colspan > this._colspan) {
                    r++;
                    c = 0;
                }

                // store cell position within the group
                cell._row = r;
                cell._col = c;

                // update column and continue
                c += cell.colspan;
            }
            this._rowspan = r + 1;

            // adjust colspans to fill every row
            for (var i = 0; i < this._cells.length; i++) {
                var cell = <_Cell>this._cells[i];
                if (i == this._cells.length - 1 || this._cells[i + 1]._row > cell._row) {
                    c = cell._col;
                    cell._colspan = this._colspan - c;
                }
            }
        }

        // method used in JSON-style initialization
        _copy(key: string, value: any): boolean {
            if (key == 'cells') {
                this._cells = [];
                if (isArray(value)) {
                    for (var i = 0; i < value.length; i++) {
                        var cell = new _Cell(value[i]);
                        if (!value[i].header && cell.binding) {
                            value.header = toHeaderCase(cell.binding);
                        }
                        this._cells.push(cell);
                        this._colspan = Math.max(this._colspan, cell.colspan);
                    }
                }
                return true;
            }
            return false;
        }

        // required for JSON-style initialization
        get cells(): _Cell[] {
            return this._cells;
        }

        // calculate merged ranges
        closeGroup(rowsPerItem: number) {

            // adjust rowspan to match longest group in the grid
            if (rowsPerItem > this._rowspan) {
                for (var i = 0; i < this._cells.length; i++) {
                    var cell = this._cells[i];
                    if (cell._row == this._rowspan - 1) {
                        cell._rowspan = rowsPerItem - cell._row;
                    }
                }
                this._rowspan = rowsPerItem;
            }

            // create arrays with binding columns and merge ranges for each cell
            this._cols = new ColumnCollection(this._g, this._g.columns.defaultSize);
            this._rng = new Array(rowsPerItem * this._colspan);
            for (var i = 0; i < this._cells.length; i++) {
                var cell = <_Cell>this._cells[i];
                for (var r = 0; r < cell._rowspan; r++) {
                    for (var c = 0; c < cell._colspan; c++) {
                        var index = (cell._row + r) * this._colspan + (cell._col) + c;

                        // save binding column for this cell offset
                        // (using 'setAt' to handle list ownership)
                        this._cols.setAt(index, cell);
                        //console.log('binding[' + index + '] = ' + cell.binding);

                        // save merge range for this cell offset
                        var rng = new CellRange(0 - r, 0 - c, 0 - r + cell._rowspan - 1, 0 - c + cell._colspan - 1);
                        if (!rng.isSingleCell) {
                            //console.log('rng[' + index + '] = ' + format('({row},{col})-({row2},{col2})', rng));
                            this._rng[index] = rng;
                        }
                    }
                }
            }

            // add extra range for collapsed group headers
            this._rng[-1] = new CellRange(0, this._colstart, 0, this._colstart + this._colspan - 1);
        }

        // get the preferred column width for a column in the group
        getColumnWidth(c: number): any {
            for (var i = 0; i < this._cells.length; i++) {
                var cell = this._cells[i];
                if (cell._col == c && cell.colspan == 1) {
                    return cell.width;
                }
            }
            return null;
        }

        // get merged range for a cell in this group
        getMergedRange(p: GridPanel, r: number, c: number): CellRange {

            // merged column header range
            if (r < 0) {
                return this._rng[-1];
            }

            // regular cell range
            var row = <_MultiRow>p.rows[r],
                rs = row.recordIndex != null ? row.recordIndex : r % this._rowspan,
                cs = c - this._colstart,
                rng = this._rng[rs * this._colspan + cs];
            return rng
                ? new CellRange(r + rng.row, c + rng.col, r + rng.row2, c + rng.col2)
                : null;
        }

        // get the binding column for a cell in this group
        getBindingColumn(p: GridPanel, r: number, c: number): Column {

            // merged column header binding
            // return 'this' to render the collapsed column header
            if (r < 0) {
                return this;
            }

            // regular cells
            var row = <_MultiRow>p.rows[r],
                rs = row.recordIndex != null ? row.recordIndex : r % this._rowspan,
                cs = c - this._colstart;
            return this._cols[rs * this._colspan + cs];
        }
    }
}