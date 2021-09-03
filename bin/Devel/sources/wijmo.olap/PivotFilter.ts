module wijmo.olap {
    'use strict';

    /**
     * Represents a filter used to select values for a @see:PivotField.
     */
    export class PivotFilter {
        private _fld: PivotField;
        private _valueFilter: grid.filter.ValueFilter;
        private _conditionFilter: grid.filter.ConditionFilter;
        private _filterType: grid.filter.FilterType;

        /**
         * Initializes a new instance of the @see:PivotFilter class.
         *
         * @param field @see:PivotField that owns this filter.
         */
        constructor(field: PivotField) {
            this._fld = field;

            // REVIEW
            // use the field as a 'pseudo-column' to build value and condition filters;
            // properties in common:
            //   binding, format, dataType, isContentHtml, collectionView
            var col = <any>field;

            this._valueFilter = new grid.filter.ValueFilter(col);
            this._conditionFilter = new grid.filter.ConditionFilter(col);
        }

        // ** object model

        /**
         * Gets or sets the types of filtering provided by this filter.
         *
         * Setting this property to null causes the filter to use the value
         * defined by the owner filter's @see:FlexGridFilter.defaultFilterType
         * property.
         */
        get filterType(): grid.filter.FilterType {
            return this._filterType != null ? this._filterType : this._fld.engine.defaultFilterType;
        }
        set filterType(value: grid.filter.FilterType) {
            if (value != this._filterType) {
                this._filterType = asEnum(value, grid.filter.FilterType, true);
                this.clear();
            }
        }
        /**
         * Gets a value that indicates whether a value passes the filter.
         *
         * @param value The value to test.
         */
        apply(value): boolean {
            return this._conditionFilter.apply(value) && this._valueFilter.apply(value);
        }
        /**
         * Gets a value that indicates whether the filter is active.
         */
        get isActive(): boolean {
            return this._conditionFilter.isActive || this._valueFilter.isActive;
        }
        /**
         * Clears the filter.
         */
        clear(): void {
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
                this._fld.onPropertyChanged(new PropertyChangedEventArgs('filter', null, null));
            }
        }
        /**
         * Gets the @see:ValueFilter in this @see:PivotFilter.
         */
        get valueFilter(): grid.filter.ValueFilter {
            return this._valueFilter;
        }
        /**
         * Gets the @see:ConditionFilter in this @see:PivotFilter.
         */
        get conditionFilter(): grid.filter.ConditionFilter {
            return this._conditionFilter;
        }
    }
}