module wijmo.grid.filter {
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
    export class ColumnFilter implements IColumnFilter {
        private _owner: FlexGridFilter;
        private _col: Column;
        private _valueFilter: ValueFilter;
        private _conditionFilter: ConditionFilter;
        private _filterType: FilterType;

        /**
         * Initializes a new instance of the @see:ColumnFilter class.
         *
         * @param owner The @see:FlexGridFilter that owns this column filter.
         * @param column The @see:Column to filter.
         */
        constructor(owner: FlexGridFilter, column: Column) {
            this._owner = owner;
            this._col = column;
            this._valueFilter = new ValueFilter(column);
            this._conditionFilter = new ConditionFilter(column);
        }

        /**
         * Gets or sets the types of filtering provided by this filter.
         *
         * Setting this property to null causes the filter to use the value
         * defined by the owner filter's @see:FlexGridFilter.defaultFilterType
         * property.
         */
        get filterType() : FilterType {
            return this._filterType != null ? this._filterType : this._owner.defaultFilterType;
        }
        set filterType(value: FilterType) {
            if (value != this._filterType) {
                var wasActive = this.isActive;
                this.clear();
                this._filterType = asEnum(value, FilterType, true);
                if (wasActive) {
                    this._owner.apply();
                } else if (this._col.grid) {
                    this._col.grid.invalidate();
                }
            }
        }
        /**
         * Gets the @see:ValueFilter in this @see:ColumnFilter.
         */
        get valueFilter() : ValueFilter {
            return this._valueFilter;
        }
        /**
         * Gets the @see:ConditionFilter in this @see:ColumnFilter.
         */
        get conditionFilter() : ConditionFilter {
            return this._conditionFilter;
        }

        // ** IColumnFilter

        /**
         * Gets the @see:Column being filtered.
         */
        get column(): Column {
            return this._col;
        }
        /**
         * Gets a value that indicates whether the filter is active.
         */
        get isActive(): boolean {
            return this._conditionFilter.isActive || this._valueFilter.isActive;
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
         * Clears the filter.
         */
        clear() {
            this._valueFilter.clear();
            this._conditionFilter.clear();
        }

        // ** IQueryInterface

        /**
         * Returns true if the caller queries for a supported interface.
         *
         * @param interfaceName Name of the interface to look for.
         */
        implementsInterface(interfaceName: string): boolean {
            return interfaceName == 'IColumnFilter';
        }
    }
}
