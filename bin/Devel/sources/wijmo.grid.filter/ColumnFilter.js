var wijmo;
(function (wijmo) {
    var grid;
    (function (grid) {
        var filter;
        (function (filter) {
            'use strict';
            /**
             * Defines a filter for a column on a @see:FlexGrid control.
             *
             * The @see:ColumnFilter contains a @see:ConditionFilter and a
             * @see:ValueFilter; only one of them may be active at a time.
             *
             * This class is used by the @see:FlexGridFilter class; you
             * rarely use it directly.
             */
            var ColumnFilter = (function () {
                /**
                 * Initializes a new instance of the @see:ColumnFilter class.
                 *
                 * @param owner The @see:FlexGridFilter that owns this column filter.
                 * @param column The @see:Column to filter.
                 */
                function ColumnFilter(owner, column) {
                    this._owner = owner;
                    this._col = column;
                    this._valueFilter = new filter.ValueFilter(column);
                    this._conditionFilter = new filter.ConditionFilter(column);
                }
                Object.defineProperty(ColumnFilter.prototype, "filterType", {
                    /**
                     * Gets or sets the types of filtering provided by this filter.
                     *
                     * Setting this property to null causes the filter to use the value
                     * defined by the owner filter's @see:FlexGridFilter.defaultFilterType
                     * property.
                     */
                    get: function () {
                        return this._filterType != null ? this._filterType : this._owner.defaultFilterType;
                    },
                    set: function (value) {
                        if (value != this._filterType) {
                            var wasActive = this.isActive;
                            this.clear();
                            this._filterType = wijmo.asEnum(value, filter.FilterType, true);
                            if (wasActive) {
                                this._owner.apply();
                            }
                            else if (this._col.grid) {
                                this._col.grid.invalidate();
                            }
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ColumnFilter.prototype, "valueFilter", {
                    /**
                     * Gets the @see:ValueFilter in this @see:ColumnFilter.
                     */
                    get: function () {
                        return this._valueFilter;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ColumnFilter.prototype, "conditionFilter", {
                    /**
                     * Gets the @see:ConditionFilter in this @see:ColumnFilter.
                     */
                    get: function () {
                        return this._conditionFilter;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ColumnFilter.prototype, "column", {
                    // ** IColumnFilter
                    /**
                     * Gets the @see:Column being filtered.
                     */
                    get: function () {
                        return this._col;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ColumnFilter.prototype, "isActive", {
                    /**
                     * Gets a value that indicates whether the filter is active.
                     */
                    get: function () {
                        return this._conditionFilter.isActive || this._valueFilter.isActive;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Gets a value that indicates whether a value passes the filter.
                 *
                 * @param value The value to test.
                 */
                ColumnFilter.prototype.apply = function (value) {
                    return this._conditionFilter.apply(value) && this._valueFilter.apply(value);
                };
                /**
                 * Clears the filter.
                 */
                ColumnFilter.prototype.clear = function () {
                    this._valueFilter.clear();
                    this._conditionFilter.clear();
                };
                // ** IQueryInterface
                /**
                 * Returns true if the caller queries for a supported interface.
                 *
                 * @param interfaceName Name of the interface to look for.
                 */
                ColumnFilter.prototype.implementsInterface = function (interfaceName) {
                    return interfaceName == 'IColumnFilter';
                };
                return ColumnFilter;
            }());
            filter.ColumnFilter = ColumnFilter;
        })(filter = grid.filter || (grid.filter = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ColumnFilter.js.map