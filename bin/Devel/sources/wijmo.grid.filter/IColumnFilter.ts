module wijmo.grid.filter {
    'use strict';

    /**
     * Defines a filter for a column on a @see:FlexGrid control.
     *
     * This class is used by the @see:FlexGridFilter class; you 
     * rarely use it directly.
     */
    export interface IColumnFilter {
        column: Column;
        isActive: boolean;
        apply(value): boolean;
        clear(): void;
    }
}