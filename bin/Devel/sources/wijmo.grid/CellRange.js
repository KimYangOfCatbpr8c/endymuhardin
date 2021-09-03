var wijmo;
(function (wijmo) {
    var grid;
    (function (grid) {
        'use strict';
        /**
         * Represents a rectangular group of cells defined by two row indices and
         * two column indices.
         */
        var CellRange = (function () {
            /**
             * Initializes a new instance of the @see:CellRange class.
             *
             * @param r The index of the first row in the range (defaults to -1).
             * @param c The index of the first column in the range (defaults to -1).
             * @param r2 The index of the last row in the range (defaults to <b>r</b>).
             * @param c2 The index of the last column in the range (defaults to <b>c</b>).
             */
            function CellRange(r, c, r2, c2) {
                if (r === void 0) { r = -1; }
                if (c === void 0) { c = -1; }
                if (r2 === void 0) { r2 = r; }
                if (c2 === void 0) { c2 = c; }
                this.setRange(r, c, r2, c2);
            }
            /**
             * Initializes an existing @see:CellRange.
             *
             * @param r The index of the first row in the range (defaults to -1).
             * @param c The index of the first column in the range (defaults to -1).
             * @param r2 The index of the last row in the range (defaults to <b>r</b>).
             * @param c2 The index of the last column in the range (defaults to <b>c</b>).
             */
            CellRange.prototype.setRange = function (r, c, r2, c2) {
                if (r === void 0) { r = -1; }
                if (c === void 0) { c = -1; }
                if (r2 === void 0) { r2 = r; }
                if (c2 === void 0) { c2 = c; }
                this._row = wijmo.asInt(r);
                this._col = wijmo.asInt(c);
                this._row2 = wijmo.asInt(r2);
                this._col2 = wijmo.asInt(c2);
            };
            Object.defineProperty(CellRange.prototype, "row", {
                /**
                 * Gets or sets the index of the first row in the range.
                 */
                get: function () {
                    return this._row;
                },
                set: function (value) {
                    this._row = wijmo.asInt(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CellRange.prototype, "col", {
                /**
                 * Gets or sets the index of the first column in the range.
                 */
                get: function () {
                    return this._col;
                },
                set: function (value) {
                    this._col = wijmo.asInt(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CellRange.prototype, "row2", {
                /**
                 * Gets or sets the index of the second row in the range.
                 */
                get: function () {
                    return this._row2;
                },
                set: function (value) {
                    this._row2 = wijmo.asInt(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CellRange.prototype, "col2", {
                /**
                 * Gets or sets the index of the second column in the range.
                 */
                get: function () {
                    return this._col2;
                },
                set: function (value) {
                    this._col2 = wijmo.asInt(value);
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Creates a copy of the range.
             */
            CellRange.prototype.clone = function () {
                return new CellRange(this._row, this._col, this._row2, this._col2);
            };
            Object.defineProperty(CellRange.prototype, "rowSpan", {
                /**
                 * Gets the number of rows in the range.
                 */
                get: function () {
                    return Math.abs(this._row2 - this._row) + 1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CellRange.prototype, "columnSpan", {
                /**
                 * Gets the number of columns in the range.
                 */
                get: function () {
                    return Math.abs(this._col2 - this._col) + 1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CellRange.prototype, "topRow", {
                /**
                 * Gets the index of the top row in the range.
                 */
                get: function () {
                    return Math.min(this._row, this._row2);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CellRange.prototype, "bottomRow", {
                /**
                 * Gets the index of the bottom row in the range.
                 */
                get: function () {
                    return Math.max(this._row, this._row2);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CellRange.prototype, "leftCol", {
                /**
                 * Gets the index of the leftmost column in the range.
                 */
                get: function () {
                    return Math.min(this._col, this._col2);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CellRange.prototype, "rightCol", {
                /**
                 * Gets the index of the rightmost column in the range.
                 */
                get: function () {
                    return Math.max(this._col, this._col2);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CellRange.prototype, "isValid", {
                /**
                 * Checks whether the range contains valid row and column indices
                 * (row and column values are zero or greater).
                 */
                get: function () {
                    return this._row > -1 && this._col > -1 && this._row2 > -1 && this._col2 > -1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CellRange.prototype, "isSingleCell", {
                /**
                 * Checks whether this range corresponds to a single cell (beginning and ending rows have
                 * the same index, and beginning and ending columns have the same index).
                 */
                get: function () {
                    return this._row == this._row2 && this._col == this._col2;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Checks whether the range contains another range or a specific cell.
             *
             * @param r The CellRange object or row index to find.
             * @param c The column index (required if the r parameter is not a CellRange object).
             */
            CellRange.prototype.contains = function (r, c) {
                // first parameter may be a cell range
                var rng = wijmo.tryCast(r, CellRange);
                if (rng) {
                    return rng.topRow >= this.topRow && rng.bottomRow <= this.bottomRow &&
                        rng.leftCol >= this.leftCol && rng.rightCol <= this.rightCol;
                }
                // check specific cell
                if (wijmo.isInt(r) && wijmo.isInt(c)) {
                    return r >= this.topRow && r <= this.bottomRow &&
                        c >= this.leftCol && c <= this.rightCol;
                }
                // anything else is an error
                throw 'contains expects a CellRange or row/column indices.';
            };
            /**
             * Checks whether the range contains a given row.
             *
             * @param r The index of the row to find.
             */
            CellRange.prototype.containsRow = function (r) {
                return wijmo.asInt(r) >= this.topRow && r <= this.bottomRow;
            };
            /**
             * Checks whether the range contains a given column.
             *
             * @param c The index of the column to find.
             */
            CellRange.prototype.containsColumn = function (c) {
                return wijmo.asInt(c) >= this.leftCol && c <= this.rightCol;
            };
            /**
             * Checks whether the range intersects another range.
             *
             * @param rng The CellRange object to check.
             */
            CellRange.prototype.intersects = function (rng) {
                return this.intersectsRow(rng) && this.intersectsColumn(rng);
            };
            /**
             * Checks whether the range intersects the rows in another range.
             *
             * @param rng The CellRange object to check.
             */
            CellRange.prototype.intersectsRow = function (rng) {
                return rng && !(this.bottomRow < rng.topRow || this.topRow > rng.bottomRow);
            };
            /**
             * Checks whether the range intersects the columns in another range.
             *
             * @param rng The CellRange object to check.
             */
            CellRange.prototype.intersectsColumn = function (rng) {
                return rng && !(this.rightCol < rng.leftCol || this.leftCol > rng.rightCol);
            };
            /**
             * Gets the rendered size of this range.
             *
             * @param p The @see:GridPanel object that contains the range.
             * @return A @see:Size object that represents the sum of row heights and column widths in the range.
             */
            CellRange.prototype.getRenderSize = function (p) {
                var sz = new wijmo.Size(0, 0);
                if (this.isValid) {
                    for (var r = this.topRow; r <= this.bottomRow; r++) {
                        sz.height += p.rows[r].renderSize;
                    }
                    for (var c = this.leftCol; c <= this.rightCol; c++) {
                        sz.width += p.columns[c].renderSize;
                    }
                }
                return sz;
            };
            /**
             * Checks whether the range equals another range.
             *
             * @param rng The CellRange object to compare to this range.
             */
            CellRange.prototype.equals = function (rng) {
                return (rng instanceof CellRange) &&
                    this._row == rng._row && this._col == rng._col &&
                    this._row2 == rng._row2 && this._col2 == rng._col2;
            };
            return CellRange;
        }());
        grid.CellRange = CellRange;
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=CellRange.js.map