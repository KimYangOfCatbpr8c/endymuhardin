module wijmo.grid.detail {
    'use strict';

    /**
     * Row that contains a single detail cell spanning all grid columns.
     */
    export class DetailRow extends Row {
        _detail: HTMLElement;

        /**
         * Initializes a new instance of the @see:DetailRow class.
         * 
         * @param parentRow @see:Row that this @see:DetailRow provides details for.
         */
        constructor(parentRow: Row) {
            super();
            this.isReadOnly = true;
        }

        /**
         * Gets or sets the HTML element that represents the detail cell in this @see:DetailRow.
         */
        get detail() : HTMLElement {
            return this._detail;
        }
        set detail(value: HTMLElement) {
            this._detail = value;
        }
    }
}