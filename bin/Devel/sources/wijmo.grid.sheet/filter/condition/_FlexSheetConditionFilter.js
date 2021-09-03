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
             * Defines a condition filter for a column on a @see:FlexSheet control.
             *
             * Condition filters contain two conditions that may be combined
             * using an 'and' or an 'or' operator.
             *
             * This class is used by the @see:FlexSheetFilter class; you will
             * rarely use it directly.
             */
            var _FlexSheetConditionFilter = (function (_super) {
                __extends(_FlexSheetConditionFilter, _super);
                function _FlexSheetConditionFilter() {
                    _super.apply(this, arguments);
                }
                /*
                 * Returns a value indicating whether a value passes this filter.
                 *
                 * @param value The value to test.
                 */
                _FlexSheetConditionFilter.prototype.apply = function (value) {
                    var col = this.column, flexSheet = col.grid, c1 = this.condition1, c2 = this.condition2, compareVal, compareVal1, compareVal2;
                    if (!(flexSheet instanceof sheet.FlexSheet)) {
                        return false;
                    }
                    // no binding or not active? accept everything
                    if (!this.isActive) {
                        return true;
                    }
                    // retrieve the value
                    compareVal = flexSheet.getCellValue(value, col.index);
                    compareVal1 = compareVal2 = compareVal;
                    if (col.dataMap) {
                        compareVal = col.dataMap.getDisplayValue(compareVal);
                        compareVal1 = compareVal2 = compareVal;
                    }
                    else if (wijmo.isDate(compareVal)) {
                        if (wijmo.isString(c1.value) || wijmo.isString(c2.value)) {
                            compareVal = flexSheet.getCellValue(value, col.index, true);
                            compareVal1 = compareVal2 = compareVal;
                        }
                    }
                    else if (wijmo.isNumber(compareVal)) {
                        compareVal = wijmo.Globalize.parseFloat(flexSheet.getCellValue(value, col.index, true));
                        compareVal1 = compareVal2 = compareVal;
                        if (compareVal === 0 && !col.dataType) {
                            if (c1.isActive && c1.value === '') {
                                compareVal1 = null;
                            }
                            if (c2.isActive && c2.value === '') {
                                compareVal2 = null;
                            }
                        }
                    }
                    // apply conditions
                    var rv1 = c1.apply(compareVal1), rv2 = c2.apply(compareVal2);
                    // combine results
                    if (c1.isActive && c2.isActive) {
                        return this.and ? rv1 && rv2 : rv1 || rv2;
                    }
                    else {
                        return c1.isActive ? rv1 : c2.isActive ? rv2 : true;
                    }
                };
                return _FlexSheetConditionFilter;
            }(wijmo.grid.filter.ConditionFilter));
            sheet._FlexSheetConditionFilter = _FlexSheetConditionFilter;
        })(sheet = grid.sheet || (grid.sheet = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_FlexSheetConditionFilter.js.map