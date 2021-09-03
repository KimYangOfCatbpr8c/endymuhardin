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
             * Extends the @see:Row to provide additional information for multi-row records.
             */
            var _MultiRow = (function (_super) {
                __extends(_MultiRow, _super);
                /**
                 * Initializes a new instance of the @see:Row class.
                 *
                 * @param dataItem The data item this row is bound to.
                 * @param dataIndex The index of the record within the items source.
                 * @param recordIndex The index of this row within the record (data item).
                 */
                function _MultiRow(dataItem, dataIndex, recordIndex) {
                    _super.call(this, dataItem);
                    this._idxData = dataIndex;
                    this._idxRecord = recordIndex;
                }
                Object.defineProperty(_MultiRow.prototype, "recordIndex", {
                    /**
                     * Gets the index of this row within the record (data item) it represents.
                     */
                    get: function () {
                        return this._idxRecord;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_MultiRow.prototype, "dataIndex", {
                    /**
                     * Gets the index of this row within the data source collection.
                     */
                    get: function () {
                        return this._idxData;
                    },
                    enumerable: true,
                    configurable: true
                });
                return _MultiRow;
            }(grid.Row));
            multirow._MultiRow = _MultiRow;
        })(multirow = grid.multirow || (grid.multirow = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_MultiRow.js.map