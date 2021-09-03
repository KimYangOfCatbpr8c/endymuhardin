var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var grid;
    (function (grid) {
        var detail;
        (function (detail) {
            'use strict';
            /**
             * Row that contains a single detail cell spanning all grid columns.
             */
            var DetailRow = (function (_super) {
                __extends(DetailRow, _super);
                /**
                 * Initializes a new instance of the @see:DetailRow class.
                 *
                 * @param parentRow @see:Row that this @see:DetailRow provides details for.
                 */
                function DetailRow(parentRow) {
                    _super.call(this);
                    this.isReadOnly = true;
                }
                Object.defineProperty(DetailRow.prototype, "detail", {
                    /**
                     * Gets or sets the HTML element that represents the detail cell in this @see:DetailRow.
                     */
                    get: function () {
                        return this._detail;
                    },
                    set: function (value) {
                        this._detail = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                return DetailRow;
            }(grid.Row));
            detail.DetailRow = DetailRow;
        })(detail = grid.detail || (grid.detail = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=DetailRow.js.map