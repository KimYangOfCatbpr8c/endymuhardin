module wijmo.grid.multirow {
    'use strict';

    /**
     * Extends the @see:Column class with <b>colspan</b> property to
     * describe a cell in a @see:_CellGroup.
     */
    export class _Cell extends Column {
        _row: number;
        _col: number;
        _colspan: number;
        _rowspan: number;

        /**
         * Initializes a new instance of the @see:_Cell class.
         *
         * @param options JavaScript object containing initialization data for the @see:_Cell.
         */
        constructor(options?: any) {
            super();
            this._row = this._col = 0;
            this._rowspan = this._colspan = 1;
            if (options) {
                copy(this, options);
            }
        }

        /**
         * Gets or sets the number of physical columns spanned by the @see:_Cell.
         */
        get colspan(): number {
            return this._colspan;
        }
        set colspan(value: number) {
            this._colspan = asInt(value, false, true);
        }
    }
}