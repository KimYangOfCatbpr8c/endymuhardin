module wijmo.grid.sheet {
	'use strict';

	/**
	 * Maintains sorting of the selected @see:Sheet of the @see:FlexSheet. 
	 */
	export class SortManager {
		private _sortDescriptions: wijmo.collections.CollectionView;
		private _owner: FlexSheet;
		_committedList: ColumnSortDescription[];

		/**
		 * Initializes a new instance of the @see:SortManager class.
		 *
		 * @param owner The @see:FlexSheet control that owns this <b>SortManager</b>.
		 */
		constructor(owner: FlexSheet) {
			this._owner = owner;
			this._sortDescriptions = new wijmo.collections.CollectionView();
			this._committedList = [new ColumnSortDescription(-1, true)];
			this._sortDescriptions.newItemCreator = () => {
				return new ColumnSortDescription(-1, true);
			}

			this._refresh();
		}

		/**
		 * Gets or sets the collection of the sort descriptions represented by the  @see:ColumnSortDescription objects.
		 */
		get sortDescriptions(): wijmo.collections.CollectionView {
			return this._sortDescriptions;
		}
		set sortDescriptions(value: wijmo.collections.CollectionView) {
			this._sortDescriptions = value;

			this.commitSort(true);
			this._refresh();
		}

		/**
		 * Adds a blank sorting level to the sort descriptions.
         *
         * @param columnIndex The index of the column in the FlexSheet control.
         * @param ascending The sort order for the sort level.
		 */
        addSortLevel(columnIndex?: number, ascending: boolean = true) {
            var item = this._sortDescriptions.addNew();
            if (columnIndex != null && !isNaN(columnIndex) && isInt(columnIndex)) {
                item.columnIndex = columnIndex;
            }
            item.ascending = ascending;
			this._sortDescriptions.commitNew();
		}

		/**
		 * Removes the current sorting level from the sort descriptions.
		 *
		 * @param columnIndex The index of the column in the FlexSheet control.
		 */
		deleteSortLevel(columnIndex?: number) {
			var item: any;

			if (columnIndex != null) {
				item = this._getSortItem(columnIndex);
			} else {
				item = this._sortDescriptions.currentItem;
			}
			if (item) {
				this._sortDescriptions.remove(item);
			}
		}

		/**
		 * Adds a copy of the current sorting level to the sort descriptions.
		 */
		copySortLevel() {
			var item = this._sortDescriptions.currentItem;
			if (item) {
				var newItem = this._sortDescriptions.addNew();
				newItem.columnIndex = parseInt(item.columnIndex);
				newItem.ascending = item.ascending;
				this._sortDescriptions.commitNew();
			}
		}

		/**
		 * Updates the current sort level.
		 *
		 * @param columnIndex The column index for the sort level.
		 * @param ascending The sort order for the sort level.
		 */
		editSortLevel(columnIndex?: number, ascending?: boolean) {
			if (columnIndex != null) {
				this._sortDescriptions.currentItem.columnIndex = columnIndex;
			}
			if (ascending != null) {
				this._sortDescriptions.currentItem.ascending = ascending;
			}
		}

		/**
		 * Moves the current sorting level to a new position.
		 *
		 * @param offset The offset to move the current level by.
		 */
		moveSortLevel(offset: number) {
			var item = this._sortDescriptions.currentItem;
			if (item) {
				var arr = this._sortDescriptions.sourceCollection,
					index = arr.indexOf(item),
					newIndex = index + offset;
				if (index > -1 && newIndex > -1) {
					arr.splice(index, 1);
					arr.splice(newIndex, 0, item);
					this._sortDescriptions.refresh();
					this._sortDescriptions.moveCurrentTo(item);
				}
			}
        }

        /**
         * Check whether the sort item of specific column exists or not 
         *
         * @param columnIndex The index of the column in the FlexSheet control.
         */
        checkSortItemExists(columnIndex): number {
            var i = 0,
                sortItemCnt = this._sortDescriptions.itemCount,
                sortItem: any;

            for (; i < sortItemCnt; i++) {
                sortItem = this._sortDescriptions.items[i];

                if (+sortItem.columnIndex === columnIndex) {
                    return i;
                }
            }

            return -1;
        }

		/**
		 * Commits the current sort descriptions to the FlexSheet control.
		 *
		 * @param undoable The boolean value indicating whether the commit sort action is undoable.
		 */
		commitSort(undoable = true) {
			var sd: any,
				newSortDesc: wijmo.collections.SortDescription,
				bindSortDesc: wijmo.collections.ObservableArray,
				dataBindSortDesc: wijmo.collections.ObservableArray,
				i: number,
                unSortDesc: wijmo.collections.ObservableArray,
				sortAction: _SortColumnAction,
				unboundRows: any,
				isCVItemsSource: boolean = this._owner.itemsSource && this._owner.itemsSource instanceof wijmo.collections.CollectionView;

            if (!this._owner.selectedSheet) {
                return;
            }

            unSortDesc = this._owner.selectedSheet._unboundSortDesc;
			if (undoable) {
				sortAction = new _SortColumnAction(this._owner);
			}

			if (this._sortDescriptions.itemCount > 0) {
				this._committedList = this._sortDescriptions.items.slice();
			} else {
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
					Object.keys(unboundRows).forEach((key) => {
						this._owner.rows.splice(+key, 0, unboundRows[key]);
					});
				}
			} else {
				// Update sorting for the unbound booksheet.
				unSortDesc.clear();
				for (i = 0; i < this._sortDescriptions.itemCount; i++) {
					sd = this._sortDescriptions.items[i];

					if (sd.columnIndex > -1) {
						unSortDesc.push(new _UnboundSortDescription(this._owner.columns[sd.columnIndex], sd.ascending));
					}
				}
            }

			if (undoable) {
				sortAction.saveNewState();
				this._owner.undoStack._addAction(sortAction);
			}
		}

		/**
		 * Cancel the current sort descriptions to the FlexSheet control.
		 */
		cancelSort() {
			this._sortDescriptions.sourceCollection = this._committedList.slice();

			this._refresh();
        }

		// Updates the <b>sorts</b> collection based on the current @see:Sheet sort conditions.
		_refresh() {
			var sortList = [],
				i: number,
                sd: any;

            if (!this._owner.selectedSheet) {
                return;
            }

			if (this._owner.collectionView && this._owner.collectionView.sortDescriptions.length > 0) {
				for (i = 0; i < this._owner.collectionView.sortDescriptions.length; i++) {
					sd = this._owner.collectionView.sortDescriptions[i];
					sortList.push(new ColumnSortDescription(this._getColumnIndex(sd.property), sd.ascending));
				}
			} else if (this._owner.selectedSheet && this._owner.selectedSheet._unboundSortDesc.length > 0) {
				for (i = 0; i < this._owner.selectedSheet._unboundSortDesc.length; i++) {
					sd = this._owner.selectedSheet._unboundSortDesc[i];
					sortList.push(new ColumnSortDescription(sd.column.index, sd.ascending));
				}
			} else {
				sortList.push(new ColumnSortDescription(-1, true));
			}
			this._sortDescriptions.sourceCollection = sortList;
		}

		// Get the index of the column by the binding property.
		private _getColumnIndex(property: string): number {
			var i = 0,
				colCnt = this._owner.columns.length;

			for (; i < colCnt; i++) {
				if (this._owner.columns[i].binding === property) {
					return i;
				}
			}
			return -1;
		}

		// Get the sort item via the column index
        private _getSortItem(columnIndex: number): any {
            var index = this.checkSortItemExists(columnIndex);

            if (index > -1) {
                return this._sortDescriptions.items[index];
            }

			return undefined;
		}

		// Scan the unbound row of the bound sheet.
		private _scanUnboundRows(): any {
			var rowIndex: number,
				processingRow: wijmo.grid.Row,
				unboundRows: any;

			for (rowIndex = 0; rowIndex < this._owner.rows.length; rowIndex++) {
				processingRow = this._owner.rows[rowIndex];
				if (!processingRow.dataItem) {
					if (!(processingRow instanceof HeaderRow)) {
						if (!unboundRows) {
							unboundRows = {};
						}
						unboundRows[rowIndex] = processingRow;
					}
				}
			}

			return unboundRows;
		}
	}

	/**
	 * Describes a @see:FlexSheet column sorting criterion. 
	 */
	export class ColumnSortDescription {
		private _columnIndex: number;
		private _ascending: boolean;

		/**
		 * Initializes a new instance of the @see:ColumnSortDescription class.
		 *
		 * @param columnIndex Indicates which column to sort the rows by.
		 * @param ascending The sort order.
		 */
		constructor(columnIndex: number, ascending: boolean) {
			this._columnIndex = columnIndex;
			this._ascending = ascending;
		}

		/**
		 * Gets or sets the column index.
		 */
		get columnIndex(): number {
			return this._columnIndex;
		}
		set columnIndex(value: number) {
			this._columnIndex = value;
		}

		/**
		 * Gets or sets the ascending.
		 */
		get ascending(): boolean {
			return this._ascending;
		}
		set ascending(value: boolean) {
			this._ascending = value;
		}
	}
}