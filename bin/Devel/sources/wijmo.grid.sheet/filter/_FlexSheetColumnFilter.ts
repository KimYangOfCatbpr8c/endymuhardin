module wijmo.grid.sheet {
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
    export class _FlexSheetColumnFilter extends wijmo.grid.filter.ColumnFilter {
        /*
         * Initializes a new instance of the @see:FlexSheetColumnFilter class.
         *
         * @param owner The @see:FlexSheetFilter that owns this column filter.
         * @param column The @see:Column to filter.
         */
        constructor(owner: _FlexSheetFilter, column: Column) {
            super(owner, column);
            
            this['_valueFilter'] = new _FlexSheetValueFilter(column);
            this['_conditionFilter'] = new _FlexSheetConditionFilter(column);
        }
    }
}