var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var grid;
    (function (grid) {
        var multirow;
        (function (multirow) {
            'use strict';
            /**
             * Extends the @see:Column class with <b>colspan</b> property to
             * describe a cell in a @see:_CellGroup.
             */
            var _Cell = (function (_super) {
                __extends(_Cell, _super);
                /**
                 * Initializes a new instance of the @see:_Cell class.
                 *
                 * @param options JavaScript object containing initialization data for the @see:_Cell.
                 */
                function _Cell(options) {
                    _super.call(this);
                    this._row = this._col = 0;
                    this._rowspan = this._colspan = 1;
                    if (options) {
                        wijmo.copy(this, options);
                    }
                }
                Object.defineProperty(_Cell.prototype, "colspan", {
                    /**
                     * Gets or sets the number of physical columns spanned by the @see:_Cell.
                     */
                    get: function () {
                        return this._colspan;
                    },
                    set: function (value) {
                        this._colspan = wijmo.asInt(value, false, true);
                    },
                    enumerable: true,
                    configurable: true
                });
                return _Cell;
            }(grid.Column));
            multirow._Cell = _Cell;
        })(multirow = grid.multirow || (grid.multirow = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_Cell.js.map