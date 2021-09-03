module wijmo.olap {
    'use strict';

    /**
     * Extends the @see:CollectionView class to preserve the position of subtotal rows
     * when sorting.
     */
    export class PivotCollectionView extends collections.CollectionView {
        private _ng: PivotEngine;

        /**
         * Initializes a new instance of the @see:PivotCollectionView class.
         * 
         * @param engine @see:PivotEngine that owns this collection.
         */
        constructor(engine: PivotEngine) {
            super();
            this._ng = asType(engine, PivotEngine, false);
        }

        //** object model

        /**
         * Gets a reference to the @see:PivotEngine that owns this view.
         */
        get engine(): PivotEngine {
            return this._ng;
        }

        // ** overrides

        // sorts items between subtotals
        _performSort(items: any[]) {
            var ng = this._ng;

            // scan all items
            for (var start = 0; start < items.length; start++) {

                // skip totals
                if (ng._getRowLevel(start) > -1) {
                    continue;
                }

                // find last item that is not a total
                var end = start;
                for (; end < items.length - 1; end++) {
                    if (ng._getRowLevel(end + 1) > -1) {
                        break;
                    }
                }

                // sort items between start and end
                if (end > start) {
                    var arr = items.slice(start, end + 1);
                    super._performSort(arr);
                    for (var i = 0; i < arr.length; i++) {
                        items[start + i] = arr[i];
                    }
                }

                // move on to next item
                start = end;
            }
        }
    }
}