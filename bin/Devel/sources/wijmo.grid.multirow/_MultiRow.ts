module wijmo.grid.multirow {
    'use strict';

    /**
     * Extends the @see:Row to provide additional information for multi-row records.
     */
    export class _MultiRow extends Row {
        _idxData: number;
        _idxRecord: number;

        /**
         * Initializes a new instance of the @see:Row class.
         *
         * @param dataItem The data item this row is bound to.
         * @param dataIndex The index of the record within the items source.
         * @param recordIndex The index of this row within the record (data item).
         */
        constructor(dataItem: any, dataIndex: number, recordIndex: number) {
            super(dataItem);
            this._idxData = dataIndex;
            this._idxRecord = recordIndex;
        }
        /**
         * Gets the index of this row within the record (data item) it represents.
         */
        get recordIndex(): number {
            return this._idxRecord;
        }
        /**
         * Gets the index of this row within the data source collection.
         */
        get dataIndex(): number {
            return this._idxData;
        }
    }
}