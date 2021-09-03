var wijmo;
(function (wijmo) {
    var grid;
    (function (grid) {
        var filter;
        (function (filter) {
            'use strict';
            /**
             * Defines a condition filter for a column on a @see:FlexGrid control.
             *
             * Condition filters contain two conditions that may be combined
             * using an 'and' or an 'or' operator.
             *
             * This class is used by the @see:FlexGridFilter class; you will
             * rarely use it directly.
             */
            var ConditionFilter = (function () {
                /**
                 * Initializes a new instance of the @see:ConditionFilter class.
                 *
                 * @param column The column to filter.
                 */
                function ConditionFilter(column) {
                    this._c1 = new filter.FilterCondition();
                    this._c2 = new filter.FilterCondition();
                    this._and = true;
                    this._col = column;
                    this._bnd = column.binding ? new wijmo.Binding(column.binding) : null;
                }
                Object.defineProperty(ConditionFilter.prototype, "condition1", {
                    /**
                     * Gets the first condition in the filter.
                     */
                    get: function () {
                        return this._c1;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ConditionFilter.prototype, "condition2", {
                    /**
                     * Gets the second condition in the filter.
                     */
                    get: function () {
                        return this._c2;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ConditionFilter.prototype, "and", {
                    /**
                     * Gets a value that indicates whether to combine the two conditions
                     * with an AND or an OR operator.
                     */
                    get: function () {
                        return this._and;
                    },
                    set: function (value) {
                        this._and = wijmo.asBoolean(value);
                        this._bnd = this._col && this._col.binding // REVIEW: why is this needed?
                            ? new wijmo.Binding(this._col.binding)
                            : null;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ConditionFilter.prototype, "column", {
                    // ** IColumnFilter
                    /**
                     * Gets the @see:Column to filter.
                     */
                    get: function () {
                        return this._col;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ConditionFilter.prototype, "isActive", {
                    /**
                     * Gets a value that indicates whether the filter is active.
                     *
                     * The filter is active if at least one of the two conditions
                     * has its operator and value set to a valid combination.
                     */
                    get: function () {
                        return this._c1.isActive || this._c2.isActive;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Returns a value indicating whether a value passes this filter.
                 *
                 * @param value The value to test.
                 */
                ConditionFilter.prototype.apply = function (value) {
                    var col = this._col, c1 = this._c1, c2 = this._c2;
                    // no binding or not active? accept everything
                    if (!this._bnd || !this.isActive) {
                        return true;
                    }
                    // retrieve the value
                    value = this._bnd.getValue(value);
                    if (col.dataMap) {
                        value = col.dataMap.getDisplayValue(value);
                    }
                    else if (wijmo.isDate(value)) {
                        if (wijmo.isString(c1.value) || wijmo.isString(c2.value)) {
                            value = wijmo.Globalize.format(value, col.format);
                        }
                    }
                    else if (wijmo.isNumber(value)) {
                        value = wijmo.Globalize.parseFloat(wijmo.Globalize.format(value, col.format));
                    }
                    // apply conditions
                    var rv1 = c1.apply(value), rv2 = c2.apply(value);
                    // combine results
                    if (c1.isActive && c2.isActive) {
                        return this._and ? rv1 && rv2 : rv1 || rv2;
                    }
                    else {
                        return c1.isActive ? rv1 : c2.isActive ? rv2 : true;
                    }
                };
                /**
                 * Clears the filter.
                 */
                ConditionFilter.prototype.clear = function () {
                    this._c1.clear();
                    this._c2.clear();
                    this.and = true;
                };
                // ** IQueryInterface
                /**
                 * Returns true if the caller queries for a supported interface.
                 *
                 * @param interfaceName Name of the interface to look for.
                 */
                ConditionFilter.prototype.implementsInterface = function (interfaceName) {
                    return interfaceName == 'IColumnFilter';
                };
                return ConditionFilter;
            }());
            filter.ConditionFilter = ConditionFilter;
        })(filter = grid.filter || (grid.filter = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ConditionFilter.js.map