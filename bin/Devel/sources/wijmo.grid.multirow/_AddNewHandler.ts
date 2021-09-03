module wijmo.grid.multirow {
    'use strict';

    /**
     * Manages the new row template used to add rows to the grid.
     */
    export class _AddNewHandler extends wijmo.grid._AddNewHandler {

        /**
         * Initializes a new instance of the @see:_AddNewHandler class.
         *
         * @param grid @see:FlexGrid that owns this @see:_AddNewHandler.
         */
        constructor(grid: FlexGrid) {

            // detach old handler
            var old = grid._addHdl;
            old._detach();

            // attach this handler instead
            super(grid);
        }

        /**
         * Updates the new row template to ensure that it is visible only when the grid is
         * bound to a data source that supports adding new items, and that it is 
         * in the right position.
         */
        updateNewRowTemplate() {

            // get variables
            var ecv = <collections.IEditableCollectionView>tryCast(this._g.collectionView, 'IEditableCollectionView'),
                g = <MultiRow>this._g,
                rows = g.rows;

            // see if we need a new row template
            var needTemplate = ecv && ecv.canAddNew && g.allowAddNew && !g.isReadOnly;

            // see if we have new row template
            var hasTemplate = true;
            for (var i = rows.length - g.rowsPerItem; i < rows.length; i++) {
                if (!(rows[i] instanceof _NewRowTemplate)) {
                    hasTemplate = false;
                    break;
                }
            }

            // add template
            if (needTemplate && !hasTemplate) {
                for (var i = 0; i < g.rowsPerItem; i++) {
                    var nrt = new _NewRowTemplate(i);
                    rows.push(nrt);
                }
            }

            // remove template
            if (!needTemplate && hasTemplate) {
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i] instanceof _NewRowTemplate) {
                        rows.removeAt(i);
                        i--;
                    }
                }
            }
        }
    }

    /**
     * Represents a row template used to add items to the source collection.
     */
    class _NewRowTemplate extends wijmo.grid._NewRowTemplate {
        _idxRecord: number;
        constructor(indexInRecord: number) {
            super();
            this._idxRecord = indexInRecord;
        }
        get recordIndex(): number {
            return this._idxRecord;
        }
    }
}
