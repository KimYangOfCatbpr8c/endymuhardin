var wijmo;
(function (wijmo) {
    var grid;
    (function (grid) {
        var sheet;
        (function (sheet) {
            'use strict';
            /**
             * Maintains sorting of the selected @see:Sheet of the @see:FlexSheet.
             */
            var SortManager = (function () {
                /**
                 * Initializes a new instance of the @see:SortManager class.
                 *
                 * @param owner The @see:FlexSheet control that owns this <b>SortManager</b>.
                 */
                function SortManager(owner) {
                    this._owner = owner;
                    this._sortDescriptions = new wijmo.collections.CollectionView();
                    this._committedList = [new ColumnSortDescription(-1, true)];
                    this._sortDescriptions.newItemCreator = function () {
                        return new ColumnSortDescription(-1, true);
                    };
                    this._refresh();
                }
                Object.defineProperty(SortManager.prototype, "sortDescriptions", {
                    /**
                     * Gets or sets the collection of the sort descriptions represented by the  @see:ColumnSortDescription objects.
                     */
                    get: function () {
                        return this._sortDescriptions;
                    },
                    set: function (value) {
                        this._sortDescriptions = value;
                        this.commitSort(true);
                        this._refresh();
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Adds a blank sorting level to the sort descriptions.
                 *
                 * @param columnIndex The index of the column in the FlexSheet control.
                 * @param ascending The sort order for the sort level.
                 */
                SortManager.prototype.addSortLevel = function (columnIndex, ascending) {
                    if (ascending === void 0) { ascending = true; }
                    var item = this._sortDescriptions.addNew();
                    if (columnIndex != null && !isNaN(columnIndex) && wijmo.isInt(columnIndex)) {
                        item.columnIndex = columnIndex;
                    }
                    item.ascending = ascending;
                    this._sortDescriptions.commitNew();
                };
                /**
                 * Removes the current sorting level from the sort descriptions.
                 *
                 * @param columnIndex The index of the column in the FlexSheet control.
                 */
                SortManager.prototype.deleteSortLevel = function (columnIndex) {
                    var item;
                    if (columnIndex != null) {
                        item = this._getSortItem(columnIndex);
                    }
                    else {
                        item = this._sortDescriptions.currentItem;
                    }
                    if (item) {
                        this._sortDescriptions.remove(item);
                    }
                };
                /**
                 * Adds a copy of the current sorting level to the sort descriptions.
                 */
                SortManager.prototype.copySortLevel = function () {
                    var item = this._sortDescriptions.currentItem;
                    if (item) {
                        var newItem = this._sortDescriptions.addNew();
                        newItem.columnIndex = parseInt(item.columnIndex);
                        newItem.ascending = item.ascending;
                        this._sortDescriptions.commitNew();
                    }
                };
                /**
                 * Updates the current sort level.
                 *
                 * @param columnIndex The column index for the sort level.
                 * @param ascending The sort order for the sort level.
                 */
                SortManager.prototype.editSortLevel = function (columnIndex, ascending) {
                    if (columnIndex != null) {
                        this._sortDescriptions.currentItem.columnIndex = columnIndex;
                    }
                    if (ascending != null) {
                        this._sortDescriptions.currentItem.ascending = ascending;
                    }
                };
                /**
                 * Moves the current sorting level to a new position.
                 *
                 * @param offset The offset to move the current level by.
                 */
                SortManager.prototype.moveSortLevel = function (offset) {
                    var item = this._sortDescriptions.currentItem;
                    if (item) {
                        var arr = this._sortDescriptions.sourceCollection, index = arr.indexOf(item), newIndex = index + offset;
                        if (index > -1 && newIndex > -1) {
                            arr.splice(index, 1);
                            arr.splice(newIndex, 0, item);
                            this._sortDescriptions.refresh();
                            this._sortDescriptions.moveCurrentTo(item);
                        }
                    }
                };
                /**
                 * Check whether the sort item of specific column exists or not
                 *
                 * @param columnIndex The index of the column in the FlexSheet control.
                 */
                SortManager.prototype.checkSortItemExists = function (columnIndex) {
                    var i = 0, sortItemCnt = this._sortDescriptions.itemCount, sortItem;
                    for (; i < sortItemCnt; i++) {
                        sortItem = this._sortDescriptions.items[i];
                        if (+sortItem.columnIndex === columnIndex) {
                            return i;
                        }
                    }
                    return -1;
                };
                /**
                 * Commits the current sort descriptions to the FlexSheet control.
                 *
                 * @param undoable The boolean value indicating whether the commit sort action is undoable.
                 */
                SortManager.prototype.commitSort = function (undoable) {
                    var _this = this;
                    if (undoable === void 0) { undoable = true; }
                    var sd, newSortDesc, bindSortDesc, dataBindSortDesc, i, unSortDesc, sortAction, unboundRows, isCVItemsSource = this._owner.itemsSource && this._owner.itemsSource instanceof wijmo.collections.CollectionView;
                    if (!this._owner.selectedSheet) {
                        return;
                    }
                    unSortDesc = this._owner.selectedSheet._unboundSortDesc;
                    if (undoable) {
                        sortAction = new sheet._SortColumnAction(this._owner);
                    }
                    if (this._sortDescriptions.itemCount > 0) {
                        this._committedList = this._sortDescriptions.items.slice();
                    }
                    else {
                        this._committedList = [new ColumnSortDescription(-1, true)];
                    }
                    if (this._owner.collectionView) {
                        // Try to get the unbound row in the bound sheet.
                        unboundRows = this._scanUnboundRows();
                        // Update sorting for the bind booksheet
                        this._owner.collectionView.beginUpdate();
                        this._owner.selectedSheet.grid.collectionView.beginUpdate();
                        bindSortDesc = this._owner.collectionView.sortDescriptions;
                        bindSortDesc.clear();
                        // Synch the sorts for the grid of current sheet.
                        if (isCVItemsSource === false) {
                            dataBindSortDesc = this._owner.selectedSheet.grid.collectionView.sortDescriptions;
                            dataBindSortDesc.clear();
                        }
                        for (i = 0; i < this._sortDescriptions.itemCount; i++) {
                            sd = this._sortDescriptions.items[i];
                            if (sd.columnIndex > -1) {
                                newSortDesc = new wijmo.collections.SortDescription(this._owner.columns[sd.columnIndex].binding, sd.ascending);
                                bindSortDesc.push(newSortDesc);
                                // Synch the sorts for the grid of current sheet.
                                if (isCVItemsSource === false) {
                                    dataBindSortDesc.push(newSortDesc);
                                }
                            }
                        }
                        this._owner.collectionView.endUpdate();
                        this._owner.selectedSheet.grid.collectionView.endUpdate();
                        // Re-insert the unbound row into the sheet.
                        if (unboundRows) {
                            Object.keys(unboundRows).forEach(function (key) {
                                _this._owner.rows.splice(+key, 0, unboundRows[key]);
                            });
                        }
                    }
                    else {
                        // Update sorting for the unbound booksheet.
                        unSortDesc.clear();
                        for (i = 0; i < this._sortDescriptions.itemCount; i++) {
                            sd = this._sortDescriptions.items[i];
                            if (sd.columnIndex > -1) {
                                unSortDesc.push(new sheet._UnboundSortDescription(this._owner.columns[sd.columnIndex], sd.ascending));
                            }
                        }
                    }
                    this._owner._filter.apply();
                    if (undoable) {
                        sortAction.saveNewState();
                        this._owner.undoStack._addAction(sortAction);
                    }
                };
                /**
                 * Cancel the current sort descriptions to the FlexSheet control.
                 */
                SortManager.prototype.cancelSort = function () {
                    this._sortDescriptions.sourceCollection = this._committedList.slice();
                    this._refresh();
                };
                // Updates the <b>sorts</b> collection based on the current @see:Sheet sort conditions.
                SortManager.prototype._refresh = function () {
                    var sortList = [], i, sd;
                    if (!this._owner.selectedSheet) {
                        return;
                    }
                    if (this._owner.collectionView && this._owner.collectionView.sortDescriptions.length > 0) {
                        for (i = 0; i < this._owner.collectionView.sortDescriptions.length; i++) {
                            sd = this._owner.collectionView.sortDescriptions[i];
                            sortList.push(new ColumnSortDescription(this._getColumnIndex(sd.property), sd.ascending));
                        }
                    }
                    else if (this._owner.selectedSheet && this._owner.selectedSheet._unboundSortDesc.length > 0) {
                        for (i = 0; i < this._owner.selectedSheet._unboundSortDesc.length; i++) {
                            sd = this._owner.selectedSheet._unboundSortDesc[i];
                            sortList.push(new ColumnSortDescription(sd.column.index, sd.ascending));
                        }
                    }
                    else {
                        sortList.push(new ColumnSortDescription(-1, true));
                    }
                    this._sortDescriptions.sourceCollection = sortList;
                };
                // Get the index of the column by the binding property.
                SortManager.prototype._getColumnIndex = function (property) {
                    var i = 0, colCnt = this._owner.columns.length;
                    for (; i < colCnt; i++) {
                        if (this._owner.columns[i].binding === property) {
                            return i;
                        }
                    }
                    return -1;
                };
                // Get the sort item via the column index
                SortManager.prototype._getSortItem = function (columnIndex) {
                    var index = this.checkSortItemExists(columnIndex);
                    if (index > -1) {
                        return this._sortDescriptions.items[index];
                    }
                    return undefined;
                };
                // Scan the unbound row of the bound sheet.
                SortManager.prototype._scanUnboundRows = function () {
                    var rowIndex, processingRow, unboundRows;
                    for (rowIndex = 0; rowIndex < this._owner.rows.length; rowIndex++) {
                        processingRow = this._owner.rows[rowIndex];
                        if (!processingRow.dataItem) {
                            if (!(processingRow instanceof sheet.HeaderRow)) {
                                if (!unboundRows) {
                                    unboundRows = {};
                                }
                                unboundRows[rowIndex] = processingRow;
                            }
                        }
                    }
                    return unboundRows;
                };
                return SortManager;
            }());
            sheet.SortManager = SortManager;
            /**
             * Describes a @see:FlexSheet column sorting criterion.
             */
            var ColumnSortDescription = (function () {
                /**
                 * Initializes a new instance of the @see:ColumnSortDescription class.
                 *
                 * @param columnIndex Indicates which column to sort the rows by.
                 * @param ascending The sort order.
                 */
                function ColumnSortDescription(columnIndex, ascending) {
                    this._columnIndex = columnIndex;
                    this._ascending = ascending;
                }
                Object.defineProperty(ColumnSortDescription.prototype, "columnIndex", {
                    /**
                     * Gets or sets the column index.
                     */
                    get: function () {
                        return this._columnIndex;
                    },
                    set: function (value) {
                        this._columnIndex = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ColumnSortDescription.prototype, "ascending", {
                    /**
                     * Gets or sets the ascending.
                     */
                    get: function () {
                        return this._ascending;
                    },
                    set: function (value) {
                        this._ascending = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                return ColumnSortDescription;
            }());
            sheet.ColumnSortDescription = ColumnSortDescription;
        })(sheet = grid.sheet || (grid.sheet = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=SortManager.js.map