var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var grid;
    (function (grid) {
        var sheet;
        (function (sheet) {
            'use strict';
            /*
             * Defines a value filter for a column on a @see:FlexSheet control.
             *
             * Value filters contain an explicit list of values that should be
             * displayed by the sheet.
             */
            var _FlexSheetValueFilter = (function (_super) {
                __extends(_FlexSheetValueFilter, _super);
                function _FlexSheetValueFilter() {
                    _super.apply(this, arguments);
                }
                /*
                 * Gets a value that indicates whether a value passes the filter.
                 *
                 * @param value The value to test.
                 */
                _FlexSheetValueFilter.prototype.apply = function (value) {
                    var flexSheet = this.column.grid;
                    if (!(flexSheet instanceof sheet.FlexSheet)) {
                        return false;
                    }
                    // values? accept everything
                    if (!this.showValues || !Object.keys(this.showValues).length) {
                        return true;
                    }
                    value = flexSheet.getCellValue(value, this.column.index, true);
                    // apply conditions
                    return this.showValues[value] != undefined;
                };
                return _FlexSheetValueFilter;
            }(wijmo.grid.filter.ValueFilter));
            sheet._FlexSheetValueFilter = _FlexSheetValueFilter;
        })(sheet = grid.sheet || (grid.sheet = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_FlexSheetValueFilter.js.map