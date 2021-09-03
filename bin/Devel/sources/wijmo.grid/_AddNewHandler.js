var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var grid;
    (function (grid) {
        'use strict';
        /**
         * Manages the new row template used to add rows to the grid.
         */
        var _AddNewHandler = (function () {
            /**
             * Initializes a new instance of the @see:_AddNewHandler class.
             *
             * @param g @see:FlexGrid that owns this @see:_AddNewHandler.
             */
            function _AddNewHandler(g) {
                this._nrt = new _NewRowTemplate();
                this._g = g;
                this._keydownBnd = this._keydown.bind(this);
                this._attach();
            }
            Object.defineProperty(_AddNewHandler.prototype, "newRowAtTop", {
                /**
                 * Gets or sets a value that indicates whether the new row template should be located
                 * at the top of the grid or at the bottom.
                 */
                get: function () {
                    return this._top;
                },
                set: function (value) {
                    if (value != this.newRowAtTop) {
                        this._top = wijmo.asBoolean(value);
                        this.updateNewRowTemplate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Updates the new row template to ensure it's visible only if the grid is
             * bound to a data source that supports adding new items, and that it is
             * in the right position.
             */
            _AddNewHandler.prototype.updateNewRowTemplate = function () {
                // get variables
                var ecv = wijmo.tryCast(this._g.collectionView, 'IEditableCollectionView'), g = this._g, rows = g.rows;
                // see if we need a new row template
                var needTemplate = ecv && ecv.canAddNew && g.allowAddNew && !g.isReadOnly;
                // get current template index
                var index = rows.indexOf(this._nrt), newRowPos = this._top ? 0 : rows.length - 1, insert = false;
                // update template position
                if (!needTemplate && index > -1) {
                    var sel = g.selection; // move selection away from the row being deleted
                    if (sel.row == index) {
                        g.select(sel.row - 1, sel.col);
                    }
                    rows.removeAt(index);
                }
                else if (needTemplate) {
                    if (index < 0) {
                        insert = true;
                    }
                    else if (index != newRowPos) {
                        rows.removeAt(index);
                        insert = true;
                    }
                    // add the new row template at the proper position
                    if (insert) {
                        if (this._top) {
                            rows.insert(0, this._nrt);
                        }
                        else {
                            rows.push(this._nrt);
                        }
                    }
                    // make sure the new row template is not collapsed
                    if (this._nrt) {
                        this._nrt._setFlag(grid.RowColFlags.ParentCollapsed, false);
                    }
                }
            };
            // ** implementation
            // add/remove handlers to manage the new row template
            /*protected*/ _AddNewHandler.prototype._attach = function () {
                var g = this._g;
                if (g) {
                    g.beginningEdit.addHandler(this._beginningEdit, this);
                    g.pastingCell.addHandler(this._beginningEdit, this);
                    g.rowEditEnded.addHandler(this._rowEditEnded, this);
                    g.loadedRows.addHandler(this.updateNewRowTemplate, this);
                    g.hostElement.addEventListener('keydown', this._keydownBnd, true);
                }
            };
            /*protected*/ _AddNewHandler.prototype._detach = function () {
                var g = this._g;
                if (g) {
                    g.beginningEdit.removeHandler(this._beginningEdit);
                    g.pastingCell.removeHandler(this._beginningEdit);
                    g.rowEditEnded.removeHandler(this._rowEditEnded);
                    g.loadedRows.removeHandler(this.updateNewRowTemplate);
                    g.hostElement.removeEventListener('keydown', this._keydownBnd, true);
                }
            };
            // cancel new row at top addition on Escape (same as new row at bottom)
            /*protected*/ _AddNewHandler.prototype._keydown = function (e) {
                if (!e.defaultPrevented && e.keyCode == wijmo.Key.Escape) {
                    if (this._g.activeEditor == null && this._top && this._nrt.dataItem) {
                        this._nrt.dataItem = null;
                        this._g.invalidate();
                    }
                }
            };
            // beginning edit, add new item if necessary
            /*protected*/ _AddNewHandler.prototype._beginningEdit = function (sender, e) {
                if (!e.cancel) {
                    var row = this._g.rows[e.row];
                    if (wijmo.tryCast(row, _NewRowTemplate)) {
                        var ecv = wijmo.tryCast(this._g.collectionView, 'IEditableCollectionView');
                        if (ecv && ecv.canAddNew) {
                            // add new row at the top
                            if (this._top) {
                                if (this._nrt.dataItem == null) {
                                    // create new item
                                    var newItem = null, src = ecv.sourceCollection, creator = ecv['newItemCreator'];
                                    if (wijmo.isFunction(creator)) {
                                        newItem = creator();
                                    }
                                    else if (src && src.length) {
                                        newItem = new src[0].constructor();
                                    }
                                    else {
                                        newItem = {};
                                    }
                                    // assign new item to new row template
                                    this._nrt.dataItem = newItem;
                                }
                            }
                            else {
                                var newItem = (ecv.currentAddItem && ecv.currentAddItem == row.dataItem) ? ecv.currentAddItem : ecv.addNew();
                                ecv.moveCurrentTo(newItem);
                                this.updateNewRowTemplate();
                                // update now to ensure the editor will get a fresh layout (TFS 96705)
                                this._g.refresh(true);
                                // fire row added event (user can customize the new row or cancel)
                                this._g.onRowAdded(e);
                                if (e.cancel) {
                                    ecv.cancelNew();
                                }
                            }
                        }
                    }
                }
            };
            // row has been edited, commit if this is the new row
            /*protected*/ _AddNewHandler.prototype._rowEditEnded = function (sender, e) {
                var _this = this;
                var ecv = wijmo.tryCast(this._g.collectionView, 'IEditableCollectionView'), item = this._nrt.dataItem;
                if (ecv) {
                    // adding at the bottom
                    if (ecv.isAddingNew) {
                        ecv.commitNew();
                    }
                    else if (item && !e.cancel) {
                        // clear row template data
                        this._nrt.dataItem = null;
                        // add new item to collection view
                        var newItem = ecv.addNew();
                        for (var k in item) {
                            newItem[k] = item[k];
                        }
                        ecv.commitNew();
                        // move selection back to new row template
                        setTimeout(function () {
                            _this._g.select(0, _this._g.columns.firstVisibleIndex);
                        }, 20);
                    }
                }
            };
            return _AddNewHandler;
        }());
        grid._AddNewHandler = _AddNewHandler;
        /**
         * Represents a row template used to add items to the source collection.
         */
        var _NewRowTemplate = (function (_super) {
            __extends(_NewRowTemplate, _super);
            function _NewRowTemplate() {
                _super.apply(this, arguments);
            }
            return _NewRowTemplate;
        }(grid.Row));
        grid._NewRowTemplate = _NewRowTemplate;
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_AddNewHandler.js.map