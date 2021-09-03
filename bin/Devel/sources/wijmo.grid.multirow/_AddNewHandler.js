var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var grid;
    (function (grid_1) {
        var multirow;
        (function (multirow) {
            'use strict';
            /**
             * Manages the new row template used to add rows to the grid.
             */
            var _AddNewHandler = (function (_super) {
                __extends(_AddNewHandler, _super);
                /**
                 * Initializes a new instance of the @see:_AddNewHandler class.
                 *
                 * @param grid @see:FlexGrid that owns this @see:_AddNewHandler.
                 */
                function _AddNewHandler(grid) {
                    // detach old handler
                    var old = grid._addHdl;
                    old._detach();
                    // attach this handler instead
                    _super.call(this, grid);
                }
                /**
                 * Updates the new row template to ensure that it is visible only when the grid is
                 * bound to a data source that supports adding new items, and that it is
                 * in the right position.
                 */
                _AddNewHandler.prototype.updateNewRowTemplate = function () {
                    // get variables
                    var ecv = wijmo.tryCast(this._g.collectionView, 'IEditableCollectionView'), g = this._g, rows = g.rows;
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
                };
                return _AddNewHandler;
            }(wijmo.grid._AddNewHandler));
            multirow._AddNewHandler = _AddNewHandler;
            /**
             * Represents a row template used to add items to the source collection.
             */
            var _NewRowTemplate = (function (_super) {
                __extends(_NewRowTemplate, _super);
                function _NewRowTemplate(indexInRecord) {
                    _super.call(this);
                    this._idxRecord = indexInRecord;
                }
                Object.defineProperty(_NewRowTemplate.prototype, "recordIndex", {
                    get: function () {
                        return this._idxRecord;
                    },
                    enumerable: true,
                    configurable: true
                });
                return _NewRowTemplate;
            }(wijmo.grid._NewRowTemplate));
        })(multirow = grid_1.multirow || (grid_1.multirow = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_AddNewHandler.js.map