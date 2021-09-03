var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        /**
         * Extends the @see:CollectionView class to preserve the position of subtotal rows
         * when sorting.
         */
        var PivotCollectionView = (function (_super) {
            __extends(PivotCollectionView, _super);
            /**
             * Initializes a new instance of the @see:PivotCollectionView class.
             *
             * @param engine @see:PivotEngine that owns this collection.
             */
            function PivotCollectionView(engine) {
                _super.call(this);
                this._ng = wijmo.asType(engine, olap.PivotEngine, false);
            }
            Object.defineProperty(PivotCollectionView.prototype, "engine", {
                //** object model
                /**
                 * Gets a reference to the @see:PivotEngine that owns this view.
                 */
                get: function () {
                    return this._ng;
                },
                enumerable: true,
                configurable: true
            });
            // ** overrides
            // sorts items between subtotals
            PivotCollectionView.prototype._performSort = function (items) {
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
                        _super.prototype._performSort.call(this, arr);
                        for (var i = 0; i < arr.length; i++) {
                            items[start + i] = arr[i];
                        }
                    }
                    // move on to next item
                    start = end;
                }
            };
            return PivotCollectionView;
        }(wijmo.collections.CollectionView));
        olap.PivotCollectionView = PivotCollectionView;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=PivotCollectionView.js.map