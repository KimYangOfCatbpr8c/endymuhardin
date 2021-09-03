var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var grid;
    (function (grid) {
        'use strict';
        /**
         * Provides arguments for @see:CellRange events.
         */
        var CellRangeEventArgs = (function (_super) {
            __extends(CellRangeEventArgs, _super);
            /**
             * Initializes a new instance of the @see:CellRangeEventArgs class.
             *
             * @param p @see:GridPanel that contains the range.
             * @param rng Range of cells affected by the event.
             * @param data Data related to the event.
             */
            function CellRangeEventArgs(p, rng, data) {
                _super.call(this);
                this._p = wijmo.asType(p, grid.GridPanel);
                this._rng = wijmo.asType(rng, grid.CellRange);
                this._data = data;
            }
            Object.defineProperty(CellRangeEventArgs.prototype, "panel", {
                /**
                 * Gets the @see:GridPanel affected by this event.
                 */
                get: function () {
                    return this._p;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CellRangeEventArgs.prototype, "range", {
                /**
                 * Gets the @see:CellRange affected by this event.
                 */
                get: function () {
                    return this._rng.clone();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CellRangeEventArgs.prototype, "row", {
                /**
                 * Gets the row affected by this event.
                 */
                get: function () {
                    return this._rng.row;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CellRangeEventArgs.prototype, "col", {
                /**
                 * Gets the column affected by this event.
                 */
                get: function () {
                    return this._rng.col;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CellRangeEventArgs.prototype, "data", {
                /**
                 * Gets or sets the data associated with the event.
                 */
                get: function () {
                    return this._data;
                },
                set: function (value) {
                    this._data = value;
                },
                enumerable: true,
                configurable: true
            });
            return CellRangeEventArgs;
        }(wijmo.CancelEventArgs));
        grid.CellRangeEventArgs = CellRangeEventArgs;
        /**
         * Provides arguments for the @see:FlexGrid.formatItem event.
         */
        var FormatItemEventArgs = (function (_super) {
            __extends(FormatItemEventArgs, _super);
            /**
            * Initializes a new instance of the @see:FormatItemEventArgs class.
            *
            * @param p @see:GridPanel that contains the range.
            * @param rng Range of cells affected by the event.
            * @param cell Element that represents the grid cell to be formatted.
            */
            function FormatItemEventArgs(p, rng, cell) {
                _super.call(this, p, rng);
                this._cell = wijmo.asType(cell, HTMLElement);
            }
            Object.defineProperty(FormatItemEventArgs.prototype, "cell", {
                /**
                 * Gets a reference to the element that represents the grid cell to be formatted.
                 */
                get: function () {
                    return this._cell;
                },
                enumerable: true,
                configurable: true
            });
            return FormatItemEventArgs;
        }(CellRangeEventArgs));
        grid.FormatItemEventArgs = FormatItemEventArgs;
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=EventArgs.js.map