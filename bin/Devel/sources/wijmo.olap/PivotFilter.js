var wijmo;
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        /**
         * Represents a filter used to select values for a @see:PivotField.
         */
        var PivotFilter = (function () {
            /**
             * Initializes a new instance of the @see:PivotFilter class.
             *
             * @param field @see:PivotField that owns this filter.
             */
            function PivotFilter(field) {
                this._fld = field;
                // REVIEW
                // use the field as a 'pseudo-column' to build value and condition filters;
                // properties in common:
                //   binding, format, dataType, isContentHtml, collectionView
                var col = field;
                this._valueFilter = new wijmo.grid.filter.ValueFilter(col);
                this._conditionFilter = new wijmo.grid.filter.ConditionFilter(col);
            }
            Object.defineProperty(PivotFilter.prototype, "filterType", {
                // ** object model
                /**
                 * Gets or sets the types of filtering provided by this filter.
                 *
                 * Setting this property to null causes the filter to use the value
                 * defined by the owner filter's @see:FlexGridFilter.defaultFilterType
                 * property.
                 */
                get: function () {
                    return this._filterType != null ? this._filterType : this._fld.engine.defaultFilterType;
                },
                set: function (value) {
                    if (value != this._filterType) {
                        this._filterType = wijmo.asEnum(value, wijmo.grid.filter.FilterType, true);
                        this.clear();
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Gets a value that indicates whether a value passes the filter.
             *
             * @param value The value to test.
             */
            PivotFilter.prototype.apply = function (value) {
                return this._conditionFilter.apply(value) && this._valueFilter.apply(value);
            };
            Object.defineProperty(PivotFilter.prototype, "isActive", {
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
             * Clears the filter.
             */
            PivotFilter.prototype.clear = function () {
                var changed = false;
                if (this._valueFilter.isActive) {
                    this._valueFilter.clear();
                    changed = true;
                }
                if (this._conditionFilter.isActive) {
                    this._valueFilter.clear();
                    changed = true;
                }
                if (changed) {
                    this._fld.onPropertyChanged(new wijmo.PropertyChangedEventArgs('filter', null, null));
                }
            };
            Object.defineProperty(PivotFilter.prototype, "valueFilter", {
                /**
                 * Gets the @see:ValueFilter in this @see:PivotFilter.
                 */
                get: function () {
                    return this._valueFilter;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotFilter.prototype, "conditionFilter", {
                /**
                 * Gets the @see:ConditionFilter in this @see:PivotFilter.
                 */
                get: function () {
                    return this._conditionFilter;
                },
                enumerable: true,
                configurable: true
            });
            return PivotFilter;
        }());
        olap.PivotFilter = PivotFilter;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=PivotFilter.js.map