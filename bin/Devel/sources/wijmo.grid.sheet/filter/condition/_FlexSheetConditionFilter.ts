module wijmo.grid.sheet {
    'use strict';

    /*
     * Defines a condition filter for a column on a @see:FlexSheet control.
     *
     * Condition filters contain two conditions that may be combined
     * using an 'and' or an 'or' operator.
     *
     * This class is used by the @see:FlexSheetFilter class; you will
     * rarely use it directly.
     */
    export class _FlexSheetConditionFilter extends wijmo.grid.filter.ConditionFilter {
       /*
        * Returns a value indicating whether a value passes this filter.
        *
        * @param value The value to test.
        */
        apply(value): boolean {
            var col = this.column,
                flexSheet = <FlexSheet>col.grid,
                c1 = this.condition1,
                c2 = this.condition2,
                compareVal: any,
                compareVal1: any,
                compareVal2: any;

            if (!(flexSheet instanceof FlexSheet)) {
                return false;
            }

            // no binding or not active? accept everything
            if (!this.isActive) {
                return true;
            }

            // retrieve the value
            compareVal = flexSheet.getCellValue(value, col.index);
            compareVal1 = compareVal2 = compareVal;
            if (col.dataMap) {
                compareVal = col.dataMap.getDisplayValue(compareVal);
                compareVal1 = compareVal2 = compareVal;
            } else if (isDate(compareVal)) {
                if (isString(c1.value) || isString(c2.value)) { // comparing times
                    compareVal = flexSheet.getCellValue(value, col.index, true);
                    compareVal1 = compareVal2 = compareVal;
                }
            } else if (isNumber(compareVal)) { 
                compareVal = Globalize.parseFloat(flexSheet.getCellValue(value, col.index, true));
                compareVal1 = compareVal2 = compareVal;
                if (compareVal === 0 && !col.dataType) {
                    if (c1.isActive && c1.value === '') {
                        compareVal1 = null;
                    } 
                    if (c2.isActive && c2.value === '') {
                        compareVal2 = null;
                    }
                }
            }

            // apply conditions
            var rv1 = c1.apply(compareVal1),
                rv2 = c2.apply(compareVal2);

            // combine results
            if (c1.isActive && c2.isActive) {
                return this.and ? rv1 && rv2 : rv1 || rv2;
            } else {
                return c1.isActive ? rv1 : c2.isActive ? rv2 : true;
            }
        }
    }
}