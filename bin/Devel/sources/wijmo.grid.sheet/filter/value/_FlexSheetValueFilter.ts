module wijmo.grid.sheet {
    'use strict';

    /*
     * Defines a value filter for a column on a @see:FlexSheet control.
     *
     * Value filters contain an explicit list of values that should be 
     * displayed by the sheet.
     */
    export class _FlexSheetValueFilter extends wijmo.grid.filter.ValueFilter {
        /*
         * Gets a value that indicates whether a value passes the filter.
         *
         * @param value The value to test.
         */
        apply(value): boolean {
            var flexSheet = <FlexSheet>this.column.grid;

            if (!(flexSheet instanceof FlexSheet)) {
                return false;
            }

            // values? accept everything
            if (!this.showValues || !Object.keys(this.showValues).length) {
                return true;
            }

            value = flexSheet.getCellValue(value, this.column.index, true);

            // apply conditions
            return this.showValues[value] != undefined;
        }
    }
}