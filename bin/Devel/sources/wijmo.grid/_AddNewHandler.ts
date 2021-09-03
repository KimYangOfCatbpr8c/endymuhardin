module wijmo.grid {
    'use strict';

    /**
     * Manages the new row template used to add rows to the grid.
     */
    export class _AddNewHandler {
        protected _g: FlexGrid;
        protected _nrt = new _NewRowTemplate();
        protected _keydownBnd: any;
        protected _top: boolean;

        /**
         * Initializes a new instance of the @see:_AddNewHandler class.
         *
         * @param g @see:FlexGrid that owns this @see:_AddNewHandler.
         */
        constructor(g: FlexGrid) {
            this._g = g;
            this._keydownBnd = this._keydown.bind(this);
            this._attach();
        }

        /**
         * Gets or sets a value that indicates whether the new row template should be located
         * at the top of the grid or at the bottom.
         */
        get newRowAtTop(): boolean {
            return this._top;
        }
        set newRowAtTop(value: boolean) {
            if (value != this.newRowAtTop) {
                this._top = asBoolean(value);
                this.updateNewRowTemplate();
            }
        }
        /**
         * Updates the new row template to ensure it's visible only if the grid is
         * bound to a data source that supports adding new items, and that it is 
         * in the right position.
         */
        updateNewRowTemplate() {

            // get variables
            var ecv = <collections.IEditableCollectionView>tryCast(this._g.collectionView, 'IEditableCollectionView'),
                g = this._g,
                rows = g.rows;

            // see if we need a new row template
            var needTemplate = ecv && ecv.canAddNew && g.allowAddNew && !g.isReadOnly;

            // get current template index
            var index = rows.indexOf(this._nrt),
                newRowPos = this._top ? 0 : rows.length - 1,
                insert = false;

            // update template position
            if (!needTemplate && index > -1) { // not needed but present, remove it
                var sel = g.selection; // move selection away from the row being deleted
                if (sel.row == index) {
                    g.select(sel.row - 1, sel.col);
                }
                rows.removeAt(index);
            } else if (needTemplate) {
                if (index < 0) { // needed but not present, add it now
                    insert = true;
                } else if (index != newRowPos) { // position template
                    rows.removeAt(index);
                    insert = true;
                }

                // add the new row template at the proper position
                if (insert) {
                    if (this._top) {
                        rows.insert(0, this._nrt);
                    } else {
                        rows.push(this._nrt);
                    }
                }

                // make sure the new row template is not collapsed
                if (this._nrt) {
                    this._nrt._setFlag(RowColFlags.ParentCollapsed, false);
                }
            }
        }

        // ** implementation

        // add/remove handlers to manage the new row template
        /*protected*/ _attach() {
            var g = this._g;
            if (g) {
                g.beginningEdit.addHandler(this._beginningEdit, this);
                g.pastingCell.addHandler(this._beginningEdit, this);
                g.rowEditEnded.addHandler(this._rowEditEnded, this);
                g.loadedRows.addHandler(this.updateNewRowTemplate, this);
                g.hostElement.addEventListener('keydown', this._keydownBnd, true);
            }
        }
        /*protected*/ _detach() {
            var g = this._g;
            if (g) {
                g.beginningEdit.removeHandler(this._beginningEdit);
                g.pastingCell.removeHandler(this._beginningEdit);
                g.rowEditEnded.removeHandler(this._rowEditEnded);
                g.loadedRows.removeHandler(this.updateNewRowTemplate);
                g.hostElement.removeEventListener('keydown', this._keydownBnd, true);
            }
        }

        // cancel new row at top addition on Escape (same as new row at bottom)
        /*protected*/ _keydown(e: KeyboardEvent) {
            if (!e.defaultPrevented && e.keyCode == Key.Escape) {
                if (this._g.activeEditor == null && this._top && this._nrt.dataItem) {
                    this._nrt.dataItem = null;
                    this._g.invalidate();
                }
            }
        }

        // beginning edit, add new item if necessary
        /*protected*/ _beginningEdit(sender, e: CellRangeEventArgs) {
            if (!e.cancel) {
                var row = this._g.rows[e.row];
                if (tryCast(row, _NewRowTemplate)) {
                    var ecv = <collections.IEditableCollectionView>tryCast(this._g.collectionView, 'IEditableCollectionView');
                    if (ecv && ecv.canAddNew) {

                        // add new row at the top
                        if (this._top) {
                            if (this._nrt.dataItem == null) {

                                // create new item
                                var newItem = null,
                                    src = ecv.sourceCollection,
                                    creator = ecv['newItemCreator'];
                                if (wijmo.isFunction(creator)) {
                                    newItem = creator();
                                } else if (src && src.length) {
                                    newItem = new src[0].constructor();
                                } else {
                                    newItem = {};
                                }

                                // assign new item to new row template
                                this._nrt.dataItem = newItem;
                            }

                        // add new row at the bottom (TFS 145498)
                        } else {
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
        }

        // row has been edited, commit if this is the new row
        /*protected*/ _rowEditEnded(sender, e: CellRangeEventArgs) {
            var ecv = <collections.IEditableCollectionView>tryCast(this._g.collectionView, 'IEditableCollectionView'),
                item = this._nrt.dataItem;
            if (ecv) {

                // adding at the bottom
                if (ecv.isAddingNew) {
                    ecv.commitNew();

                // adding at the top
                } else if (item && !e.cancel) {

                    // clear row template data
                    this._nrt.dataItem = null;

                    // add new item to collection view
                    var newItem = ecv.addNew();
                    for (var k in item) {
                        newItem[k] = item[k];
                    }
                    ecv.commitNew();

                    // move selection back to new row template
                    setTimeout(() => {
                        this._g.select(0, this._g.columns.firstVisibleIndex);
                    }, 20);
                }
            }
        }
    }

    /**
     * Represents a row template used to add items to the source collection.
     */
    export class _NewRowTemplate extends Row {
    }
}