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
             * Defines a filter for a column on a @see:FlexSheet control.
             *
             * The @see:FlexSheetColumnFilter contains a @see:FlexSheetConditionFilter and a
             * @see:FlexSheetValueFilter; only one of them may be active at a time.
             *
             * This class is used by the @see:FlexSheetFilter class; you
             * rarely use it directly.
             */
            var _FlexSheetColumnFilter = (function (_super) {
                __extends(_FlexSheetColumnFilter, _super);
                /*
                 * Initializes a new instance of the @see:FlexSheetColumnFilter class.
                 *
                 * @param owner The @see:FlexSheetFilter that owns this column filter.
                 * @param column The @see:Column to filter.
                 */
                function _FlexSheetColumnFilter(owner, column) {
                    _super.call(this, owner, column);
                    this['_valueFilter'] = new sheet._FlexSheetValueFilter(column);
                    this['_conditionFilter'] = new sheet._FlexSheetConditionFilter(column);
                }
                return _FlexSheetColumnFilter;
            }(wijmo.grid.filter.ColumnFilter));
            sheet._FlexSheetColumnFilter = _FlexSheetColumnFilter;
        })(sheet = grid.sheet || (grid.sheet = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_FlexSheetColumnFilter.js.map