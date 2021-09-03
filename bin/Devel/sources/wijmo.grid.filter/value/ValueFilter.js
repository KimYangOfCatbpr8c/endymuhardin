var wijmo;
(function (wijmo) {
    var grid;
    (function (grid) {
        var filter;
        (function (filter) {
            'use strict';
            /**
             * Defines a value filter for a column on a @see:FlexGrid control.
             *
             * Value filters contain an explicit list of values that should be
             * displayed by the grid.
             */
            var ValueFilter = (function () {
                /**
                 * Initializes a new instance of the @see:ValueFilter class.
                 *
                 * @param column The column to filter.
                 */
                function ValueFilter(column) {
                    this._maxValues = 250;
                    this._sortValues = true;
                    this._col = column;
                    this._bnd = column.binding ? new wijmo.Binding(column.binding) : null;
                }
                Object.defineProperty(ValueFilter.prototype, "showValues", {
                    /**
                     * Gets or sets an object with all the formatted values that should be shown on the value list.
                     */
                    get: function () {
                        return this._values;
                    },
                    set: function (value) {
                        this._values = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ValueFilter.prototype, "filterText", {
                    /**
                     * Gets or sets a string used to filter the list of display values.
                     */
                    get: function () {
                        return this._filterText;
                    },
                    set: function (value) {
                        this._filterText = wijmo.asString(value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ValueFilter.prototype, "maxValues", {
                    /**
                     * Gets or sets the maximum number of elements on the list of display values.
                     *
                     * Adding too many items to the list makes searching difficult and hurts
                     * performance. This property limits the number of items displayed at any time,
                     * but users can still use the search box to filter the items they are
                     * interested in.
                     *
                     * This property is set to 250 by default.
                     *
                     * This code changes the value to 1,000,000, effectively listing all unique
                     * values for the field:
                     *
                     * <pre>// change the maxItems property for the 'id' column:
                     * var f = new wijmo.grid.filter.FlexGridFilter(s);
                     * f.getColumnFilter('id').valueFilter.maxValues = 1000000;</pre>
                     */
                    get: function () {
                        return this._maxValues;
                    },
                    set: function (value) {
                        this._maxValues = wijmo.asNumber(value, false, true);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ValueFilter.prototype, "uniqueValues", {
                    /**
                     * Gets or sets an array containing the unique values to be displayed on the list.
                     *
                     * If this property is set to null, the list will be filled based on the grid data.
                     *
                     * Explicitly assigning the list of unique values is more efficient than building
                     * the list from the data, and is required for value filters to work properly when
                     * the data is filtered on the server (because in this case some values might not
                     * be present on the client so the list will be incomplete).
                     *
                     * By default, the filter editor will sort the unique values when displaying them
                     * to the user. If you want to prevent that and show the values in the order you
                     * provided, set the @see:sortValues property to false.
                     *
                     * For example, the code below provides a list of countries to be used in the
                     * @see:ValueFilter for the column bound to the 'country' field:
                     *
                     * <pre>// create filter for a FlexGrid
                     * var filter = new wijmo.grid.filter.FlexGridFilter(grid);
                     * // assign list of unique values to country filter
                     * var cf = filter.getColumnFilter('country');
                     * cf.valueFilter.uniqueValues = countries;</pre>
                     */
                    get: function () {
                        return this._uniqueValues;
                    },
                    set: function (value) {
                        this._uniqueValues = wijmo.asArray(value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ValueFilter.prototype, "sortValues", {
                    /**
                     * Gets or sets a value that determines whether the values should be sorted
                     * when displayed in the editor.
                     *
                     * This property is especially useful when you are using the @see:uniqueValues
                     * to provide a custom list of values property and you would like to preserve
                     * the order of the values.
                     */
                    get: function () {
                        return this._sortValues;
                    },
                    set: function (value) {
                        this._sortValues = wijmo.asBoolean(value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ValueFilter.prototype, "column", {
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
                Object.defineProperty(ValueFilter.prototype, "isActive", {
                    /**
                     * Gets a value that indicates whether the filter is active.
                     *
                     * The filter is active if there is at least one value is selected.
                     */
                    get: function () {
                        return this._values != null && Object.keys(this._values).length > 0;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Gets a value that indicates whether a value passes the filter.
                 *
                 * @param value The value to test.
                 */
                ValueFilter.prototype.apply = function (value) {
                    var col = this.column;
                    // no binding or no values? accept everything
                    if (!this._bnd || !this._values || !Object.keys(this._values).length) {
                        return true;
                    }
                    // retrieve the formatted value
                    value = this._bnd.getValue(value);
                    value = col.dataMap
                        ? col.dataMap.getDisplayValue(value)
                        : wijmo.Globalize.format(value, col.format);
                    // apply conditions
                    return this._values[value] != undefined;
                };
                /**
                 * Clears the filter.
                 */
                ValueFilter.prototype.clear = function () {
                    this.showValues = null;
                    this.filterText = null;
                };
                // ** IQueryInterface
                /**
                 * Returns true if the caller queries for a supported interface.
                 *
                 * @param interfaceName Name of the interface to look for.
                 */
                ValueFilter.prototype.implementsInterface = function (interfaceName) {
                    return interfaceName == 'IColumnFilter';
                };
                return ValueFilter;
            }());
            filter.ValueFilter = ValueFilter;
        })(filter = grid.filter || (grid.filter = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ValueFilter.js.map