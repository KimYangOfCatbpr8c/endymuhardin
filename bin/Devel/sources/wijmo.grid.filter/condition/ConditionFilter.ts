module wijmo.grid.filter {
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
    export class ConditionFilter implements IColumnFilter {
        private _col: Column;
        private _bnd: Binding;
        private _c1 = new FilterCondition();
        private _c2 = new FilterCondition();
        private _and = true;

        /**
         * Initializes a new instance of the @see:ConditionFilter class.
         *
         * @param column The column to filter.
         */
        constructor(column: Column) {
            this._col = column;
            this._bnd = column.binding ? new Binding(column.binding) : null;
        }
        /**
         * Gets the first condition in the filter.
         */
        get condition1(): FilterCondition {
            return this._c1;
        }
        /**
         * Gets the second condition in the filter.
         */
        get condition2(): FilterCondition {
            return this._c2;
        }
        /**
         * Gets a value that indicates whether to combine the two conditions 
         * with an AND or an OR operator.
         */
        get and(): boolean {
            return this._and;
        }
        set and(value: boolean) {
            this._and = asBoolean(value);
            this._bnd = this._col && this._col.binding // REVIEW: why is this needed?
                ? new Binding(this._col.binding)
                : null;
        }

        // ** IColumnFilter

        /**
         * Gets the @see:Column to filter.
         */
        get column(): Column {
            return this._col;
        }
        /**
         * Gets a value that indicates whether the filter is active.
         *
         * The filter is active if at least one of the two conditions
         * has its operator and value set to a valid combination.
         */
        get isActive(): boolean {
            return this._c1.isActive || this._c2.isActive;
        }
        /**
         * Returns a value indicating whether a value passes this filter.
         *
         * @param value The value to test.
         */
        apply(value): boolean {
            var col = this._col,
                c1 = this._c1,
                c2 = this._c2;

            // no binding or not active? accept everything
            if (!this._bnd || !this.isActive) {
                return true;
            }

            // retrieve the value
            value = this._bnd.getValue(value);
            if (col.dataMap) {
                value = col.dataMap.getDisplayValue(value);
            } else if (isDate(value)) {
                if (isString(c1.value) || isString(c2.value)) { // comparing times
                    value = Globalize.format(value, col.format);
                }
            } else if (isNumber(value)) { // use same precision for numbers (TFS 124098)
                value = Globalize.parseFloat(Globalize.format(value, col.format));
            }

            // apply conditions
            var rv1 = c1.apply(value),
                rv2 = c2.apply(value);

            // combine results
            if (c1.isActive && c2.isActive) {
                return this._and ? rv1 && rv2 : rv1 || rv2;
            } else {
                return c1.isActive ? rv1 : c2.isActive ? rv2 : true;
            }
        }
        /**
         * Clears the filter.
         */
        clear() {
            this._c1.clear();
            this._c2.clear();
            this.and = true;
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