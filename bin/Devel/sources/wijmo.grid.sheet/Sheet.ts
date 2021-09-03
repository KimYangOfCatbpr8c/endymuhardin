module wijmo.grid.sheet {
	'use strict';

	/**
	 * Represents a sheet within the @see:FlexSheet control.
	 */
	export class Sheet {
		private _name: string;
		private _owner: FlexSheet; 
		private _rowCount: number;
		private _columnCount: number;
		private _visible: boolean = true;
		_unboundSortDesc = new wijmo.collections.ObservableArray();
		private _currentStyledCells: any = {};
		private _currentMergedRanges: any = {};
        private _grid: FlexGrid;
        private _selectionRanges: wijmo.collections.ObservableArray;
        private _isEmptyGrid = false;
        _rowSettings = [];
		_filterDefinition: string;
        _scrollPosition: Point = new Point();
        _freezeHiddenRowCnt: number = 0;
        _freezeHiddenColumnCnt: number = 0;

		/**
		 * Initializes a new instance of the @see:FlexSheet class.
		 *
		 * @param owner The owner @see: FlexSheet control.
		 * @param grid The associated @see:FlexGrid control used to store the sheet data. If not specified then the 
         * new <b>FlexGrid</b> control will be created.
		 * @param sheetName The name of the sheet within the @see:FlexSheet control.
		 * @param rows The row count for the sheet.
		 * @param cols The column count for the sheet.
		 */
		constructor(owner?: FlexSheet, grid?: FlexGrid, sheetName?: string, rows?: number, cols?: number) {
			var self = this,
				insertRows: number,
				insertCols: number,
				i: number;

			self._owner = owner;
			self._name = sheetName;
			if (isNumber(rows) && !isNaN(rows) && rows >= 0) {
				self._rowCount = rows;
			} else {
				self._rowCount = 200;
			}

			if (isNumber(cols) && !isNaN(cols) && cols >= 0) {
				self._columnCount = cols;
			} else {
				self._columnCount = 20;
			}

			self._grid = grid || this._createGrid();
			self._grid.itemsSourceChanged.addHandler(this._gridItemsSourceChanged, this);

			self._unboundSortDesc.collectionChanged.addHandler(function () {
				var arr = self._unboundSortDesc,
					i: number,
					sd: _UnboundSortDescription;

				for (i = 0; i < arr.length; i++) {
					sd = tryCast(arr[i], _UnboundSortDescription);
					if (!sd) {
						throw 'sortDescriptions array must contain SortDescription objects.';
					}
				}

                if (self._owner) {
                    self._owner.rows.beginUpdate();
                    self._owner.rows.sort(self._compareRows());
                    self._owner.rows.endUpdate();
                    self._owner.rows._dirty = true;
                    self._owner.rows._update();

                    //Synch with current sheet.
                    if (self._owner.selectedSheet) {
                        self._owner._copyTo(self._owner.selectedSheet);
                        self._owner._copyFrom(self._owner.selectedSheet);
                    }
                }
			});
		}

		/**
		 * Gets the associated @see:FlexGrid control used to store the sheet data.
		 */
		get grid(): FlexGrid {
			return this._grid;
		}

		/**
		 * Gets or sets the name of the sheet.
		 */
		get name(): string {
			return this._name;
		}
		set name(value: string) {
			if (!isNullOrWhiteSpace(value) && ((this._name && this._name.toLowerCase() !== value.toLowerCase()) || !this._name)) { 
				this._name = value;
				this._grid['wj_sheetInfo'].name = value;
				this.onNameChanged(new wijmo.EventArgs());
			}
		}

		/**
		 * Gets or sets the sheet visibility.
		 */
		get visible(): boolean {
			return this._visible;
		}
        set visible(value: boolean) {
            if (this._visible !== value) {
                this._visible = value;
                this._grid['wj_sheetInfo'].visible = value;
                this.onVisibleChanged(new wijmo.EventArgs());
            }
		}

		/**
		 * Gets or sets the number of rows in the sheet.
		 */
		get rowCount(): number {
			if (this._grid != null) {
				return this._grid.rows.length;
			}
			return 0;
        }
        set rowCount(value: number) {
            var rowIndex: number;
            if (isNumber(value) && !isNaN(value) && value >= 0 && this._rowCount !== value) {
                if (this._rowCount < value) {
                    for (rowIndex = 0; rowIndex < (value - this._rowCount); rowIndex++) {
                        this._grid.rows.push(new Row());
                    }
                } else {
                    this._grid.rows.splice(value, this._rowCount - value);
                }
                this._rowCount = value;

                // If the sheet is current selected sheet of the flexsheet, we should synchronize the updating of the sheet to the flexsheet.
                if (this._owner && this._owner.selectedSheet && this._name === this._owner.selectedSheet.name) {
                    this._owner._copyFrom(this, true);
                }
            }
        }

		/**
		 * Gets or sets the number of columns in the sheet.
		 */
		get columnCount(): number {
			if (this._grid != null) {
				return this._grid.columns.length;
			}
			return 0;
        }
        set columnCount(value: number) {
            var colIndex: number;
            if (isNumber(value) && !isNaN(value) && value >= 0 && this._columnCount !== value) {
                if (this._columnCount < value) {
                    for (colIndex = 0; colIndex < (value - this._columnCount); colIndex++) {
                        this._grid.columns.push(new Column());
                    }
                } else {
                    this._grid.columns.splice(value, this._columnCount - value);
                }
                this._columnCount = value;

                // If the sheet is current seleced sheet of the flexsheet, we should synchronize the updating of the sheet to the flexsheet.
                if (this._owner && this._owner.selectedSheet && this._name === this._owner.selectedSheet.name) {
                    this._owner._copyFrom(this, true);
                }
            }
        }

		/**
		 * Gets the selection array.
		 */
        get selectionRanges(): wijmo.collections.ObservableArray {
			if (!this._selectionRanges) {
                this._selectionRanges = new wijmo.collections.ObservableArray();
                this._selectionRanges.collectionChanged.addHandler(() => {
                    var selectionCnt: number,
                        lastSelection: CellRange;
                    if (this._owner && !this._owner._isClicking) {
                        selectionCnt = this._selectionRanges.length;
                        if (selectionCnt > 0) {
                            lastSelection = this._selectionRanges[selectionCnt - 1];
                            if (lastSelection && lastSelection instanceof CellRange) {
                                this._owner.selection = lastSelection;
                            }
                        }
                        if (selectionCnt > 1) {
                            this._owner._enableMulSel = true;
                        }
                        this._owner.refresh();
                        this._owner._enableMulSel = false;
                    }
                }, this);
			}
			return this._selectionRanges;
        }

		/**
         * Gets or sets the array or @see:ICollectionView for the @see:FlexGrid instance of the sheet.
         */
		get itemsSource(): any {
			if (this._grid != null) {
				return this._grid.itemsSource;
			}
			return null;
		}
		set itemsSource(value: any) {
			if (this._grid == null) {
				this._createGrid();
				this._grid.itemsSourceChanged.addHandler(this._gridItemsSourceChanged, this);
            } 

            if (this._isEmptyGrid) {
                this._clearGrid();
            }

			this._grid.itemsSource = value;
		}

		/*
		 * Gets or sets the styled cells
		 * This property uses the cell index as the key and stores the @ICellStyle object as the value.
		 * { 1: { fontFamily: xxxx, fontSize: xxxx, .... }, 2: {...}, ... }
		 */
		get _styledCells(): any {
			if (!this._currentStyledCells) {
				this._currentStyledCells = {};
			}
			return this._currentStyledCells;
		}
		set _styledCells(value: any) {
			this._currentStyledCells = value;
		}

		/*
		 * Gets or sets the merge ranges.
		 * This property uses the cell index as the key and stores the @CellRange object as the value.
		 * { 1: CellRange(row = 1, col = 1, row2 = 3, col2 = 4), 2: CellRange(), ...}
		 */
		get _mergedRanges(): any {
			if (!this._currentMergedRanges) {
				this._currentMergedRanges = {};
			}
			return this._currentMergedRanges;
		}
		set _mergedRanges(value: any) {
			this._currentMergedRanges = value;
        }

		/**
		 * Occurs after the sheet name has changed.
		 */
		nameChanged = new Event();
		/**
		 * Raises the @see:nameChanged event.
		 */
		onNameChanged(e: wijmo.EventArgs) {
			this.nameChanged.raise(this, e);
        }

        /**
		 * Occurs after the visible of sheet has changed.
		 */
        visibleChanged = new Event();
        /**
		 * Raises the @see:visibleChanged event.
		 */
        onVisibleChanged(e: wijmo.EventArgs) {
            this.visibleChanged.raise(this, e);
        }

		/**
		 * Gets the style of specified cell.
		 *
		 * @param rowIndex the row index of the specified cell.
		 * @param columnIndex the column index of the specified cell.
		 */
		getCellStyle(rowIndex: number, columnIndex: number): ICellStyle {
			var cellIndex: number,
				rowCnt = this._grid.rows.length,
				colCnt = this._grid.columns.length;

			if (rowIndex >= rowCnt || columnIndex >= colCnt) {
				return null;
			}

			cellIndex = rowIndex * colCnt + columnIndex;

			return this._styledCells[cellIndex];
        }

        // Attach the sheet to the @see: FlexSheet control as owner.
        _attachOwner(owner: FlexSheet) {
            if (this._owner !== owner) {
                this._owner = owner;
            }
        }

		// Update the sheet name with valid name.
		_setValidName(validName: string) {
			this._name = validName;
			this._grid['wj_sheetInfo'].name = validName;
        }

        // Store the row settings FlexSheet.
        _storeRowSettings() {
            var rowIdx = 0,
                row: Row;

            this._rowSettings = [];
            for (; rowIdx < this._grid.rows.length; rowIdx++) {
                row = this._owner.rows[rowIdx];
                if (row) {
                    this._rowSettings[rowIdx] = {
                        height: row.height
                    }
                }
            }
        }

        // Set the row settings to the sheet grid.
        _setRowSettings() {
            var rowIdx = 0,
                rowSettings: any;

            for (; rowIdx < this._rowSettings.length; rowIdx++) {
                rowSettings = this._rowSettings[rowIdx];
                if (rowSettings) {
                    this._grid.rows[rowIdx].height = rowSettings.height;
                }
            }
        }

		// comparison function used in rows sort for unbound sheet.
		private _compareRows() {
			var self = this,
				sortDesc = this._unboundSortDesc;

			return function (a, b) {
				for (var i = 0; i < sortDesc.length; i++) {

					// get values
					var sd = <_UnboundSortDescription>sortDesc[i],
						v1 = a._ubv ? a._ubv[sd.column._hash] : '',
						v2 = b._ubv ? b._ubv[sd.column._hash] : '';

					// if the cell value is formula, we should try to evaluate this formula.
					if (isString(v1) && v1[0] === '=') {
                        v1 = self._owner.evaluate(v1);
                        if (!isPrimitive(v1)) {
                            v1 = v1.value;
                        }
					}
					if (isString(v2) && v2[0] === '=') {
                        v2 = self._owner.evaluate(v2);
                        if (!isPrimitive(v2)) {
                            v2 = v2.value;
                        }
					}

					// check for NaN (isNaN returns true for NaN but also for non-numbers)
					if (v1 !== v1) v1 = null;
					if (v2 !== v2) v2 = null;

					// ignore case when sorting  (but add the original string to keep the 
					// strings different and the sort consistent, 'aa' between 'AA' and 'bb')
					if (isString(v1)) v1 = v1.toLowerCase() + v1;
                    if (isString(v2)) v2 = v2.toLowerCase() + v2;

					// compare the values (at last!)
					var cmp = (v1 < v2) ? -1 : (v1 > v2) ? +1 : 0;
					if (cmp !== 0) {
						return sd.ascending ? +cmp : -cmp;
					}
				}
				return 0;
			}
		}

		// Create a blank flexsheet.
		private _createGrid(): FlexGrid {
			var hostElement = document.createElement('div'),
				grid: FlexGrid,
				column: Column,
				colIndex: number,
				rowIndex: number;

            this._isEmptyGrid = true;
			// We should append the host element of the data grid of current sheet to body before creating data grid,
			// this will make the host element to inherit the style of body (TFS 121713)
			hostElement.style.visibility = 'hidden';
			document.body.appendChild(hostElement);
			grid = new FlexGrid(hostElement);
			document.body.removeChild(hostElement);
			for (rowIndex = 0; rowIndex < this._rowCount; rowIndex++) {
				grid.rows.push(new Row());
			}

			for (colIndex = 0; colIndex < this._columnCount; colIndex++) {
				column = new Column();
				// Setting the required property of the column to false for the data grid of current sheet.
				// TFS #126125
                column.isRequired = false;
				grid.columns.push(column);
			}

			// Add header row for the grid of the bind sheet.
			grid.loadedRows.addHandler(() => {
				if (grid.itemsSource && !(grid.rows[0] instanceof HeaderRow)) {
					grid.rows.insert(0, new HeaderRow());
				}
			});

			// Add sheet related info into the flexgrid.
			// This property contains the name, style of cells and merge cells of current sheet.
			grid['wj_sheetInfo'] = {
				name: this.name,
				visible: this.visible,
				styledCells: this._styledCells,
				mergedRanges: this._mergedRanges
			};

			return grid;
		}

		// Clear the grid of the sheet.
		private _clearGrid() {
			this._grid.rows.clear();
			this._grid.columns.clear();
			this._grid.columnHeaders.columns.clear();
			this._grid.rowHeaders.rows.clear();
		}

		// Items source changed handler for the grid of the sheet.
		private _gridItemsSourceChanged() {
			// If the sheet is current seleced sheet of the flexsheet, we should synchronize the updating of the sheet to the flexsheet.
            if (this._owner && this._owner.selectedSheet && this._name === this._owner.selectedSheet.name) {
				this._owner._copyFrom(this, false);
			}
		}
	}

	/**
	 * Defines the collection of the @see:Sheet objects.
	 */
	export class SheetCollection extends wijmo.collections.ObservableArray {
        private _current: number = -1;

        /**
		 * Occurs when the @see:SheetCollection is cleared.
		 */
        sheetCleared = new Event();
        /**
		 * Raises the sheetCleared event.
		 */
        onSheetCleared() {
            this.sheetCleared.raise(this, new EventArgs());
        }

		/**
		 * Gets or sets the index of the currently selected sheet.
		 */
		get selectedIndex(): number {
			return this._current;
		}
		set selectedIndex(index: number) {
			this._moveCurrentTo(index);
		}

		/**
		 * Occurs when the <b>selectedIndex</b> property changes.
		 */
		selectedSheetChanged  = new Event();
		/**
         * Raises the <b>currentChanged</b> event.
         *
         * @param e @see:PropertyChangedEventArgs that contains the event data.
         */
		onSelectedSheetChanged(e: PropertyChangedEventArgs) {
			this.selectedSheetChanged.raise(this, e);
		}

		/**
		 * Inserts an item at a specific position in the array.
		 * Overrides the insert method of its base class @see:ObservableArray. 
		 *
		 * @param index Position where the item will be added.
		 * @param item Item to add to the array.
		 */
        insert(index: number, item: any) {
            var name: string;
            name = item.name ? this.getValidSheetName(item) : this._getUniqueName();
            if (name !== item.name) {
                item.name = name;
            }
            super.insert(index, item);
            this._postprocessSheet(<Sheet>item);
        }

        /**
         * Adds one or more items to the end of the array.
         * Overrides the push method of its base class @see:ObservableArray. 
         *
         * @param ...item One or more items to add to the array.
         * @return The new length of the array.
         */
        push(...item: any[]): number {
            var currentLength = this.length,
                idx = 0,
                name: string;
            for (; idx < item.length; idx++) {
                name = item[idx].name ? this.getValidSheetName(item[idx]) : this._getUniqueName();
                if (name !== item[idx].name) {
                    item[idx].name = name;
                }
                super.push(item[idx]);
                this._postprocessSheet(<Sheet>item[idx]);
            }
            return this.length;
        }

        /**
         * Removes and/or adds items to the array.
         * Overrides the splice method of its base class @see:ObservableArray. 
         *
         * @param index Position where items will be added or removed.
         * @param count Number of items to remove from the array.
         * @param item Item to add to the array.
         * @return An array containing the removed elements.
         */
        splice(index: number, count: number, item?: any): any[] {
            var name: string;
            if (item) {
                name = item.name ? this.getValidSheetName(item) : this._getUniqueName();
                if (name !== item.name) {
                    item.name = name;
                }
                this._postprocessSheet(<Sheet>item);
                return super.splice(index, count, item);
            } else {
                return super.splice(index, count, item);
            }
        }

		/**
		 * Removes an item at a specific position in the array.
		 * Overrides the removeAt method of its base class @see:ObservableArray. 
		 *
		 * @param index Position of the item to remove.
		 */
		removeAt(index: number) {
			var succeeded = this.hide(index);
            if (succeeded) {
                super.removeAt(index);
                if (index < this.selectedIndex) {
                    this._current -= 1;
                }
			}
		}

		/**
		 * Occurs after the name of the sheet in the collection has changed.
		 */
		sheetNameChanged = new Event();
		/**
		 * Raises the <b>sheetNameChanged</b> event.
		 */
		onSheetNameChanged(e: wijmo.collections.NotifyCollectionChangedEventArgs) {
			this.sheetNameChanged.raise(this, e);
        }

        /**
		 * Occurs after the visible of the sheet in the collection has changed.
		 */
        sheetVisibleChanged = new Event();
		/**
		 * Raises the <b>sheetVisibleChanged</b> event.
		 */
        onSheetVisibleChanged(e: wijmo.collections.NotifyCollectionChangedEventArgs) {
            this.sheetVisibleChanged.raise(this, e);
        }

		/**
		 * Selects the first sheet in the @see:FlexSheet control.
		 */
		selectFirst(): boolean {
			return this._moveCurrentTo(0);
		}

		/**
		 * Selects the last sheet in the owner @see:FlexSheet control.
		 */
		selectLast(): boolean {
			return this._moveCurrentTo(this.length - 1);
		}

		/**
		 * Selects the previous sheet in the owner @see:FlexSheet control.
		 */
		selectPrevious(): boolean {
			return this._moveCurrentTo(this._current - 1);
		}

		/**
		 * Select the next sheet in the owner @see:FlexSheet control.
		 */
		selectNext(): boolean {
			return this._moveCurrentTo(this._current + 1);
		}

		/**
		 * Hides the sheet at the specified position.
		 *
		 * @param pos The position of the sheet to hide.
		 */
		hide(pos: number): boolean {
			var succeeded = false;
			if (pos < 0 && pos >= this.length) {
				return false;
			}
			if (!this[pos].visible) {
				return false;
			}
			this[pos].visible = false;

			return true;
		}

		/**
		 * Unhide and selects the @see:Sheet at the specified position.
		 *
		 * @param pos The position of the sheet to show.
		 */
		show(pos: number): boolean {
			var succeeded = false;
			if (pos < 0 && pos >= this.length) {
				return false;
			}
			this[pos].visible = true;
			this._moveCurrentTo(pos);
			return true;
		}

		/**
		 * Clear the SheetCollection.
		 */
		clear() {
			super.clear();
            this._current = -1;

            this.onSheetCleared();
		}

		/**
		 * Checks whether the sheet name is valid.
		 *
		 * @param sheet The @see:Sheet for which the name needs to check.
		 */
		isValidSheetName(sheet: Sheet): boolean {
			var sheetIndex = this._getSheetIndexFrom(sheet.name),
				currentSheetIndex = this.indexOf(sheet);

			return (sheetIndex === -1 || sheetIndex === currentSheetIndex);
		}

		/**
		 * Gets the valid name for the sheet.
		 *
		 * @param currentSheet The @see:Sheet need get the valid name.
		 */
		getValidSheetName(currentSheet: Sheet): string {
			var validName = currentSheet.name,
				index = 1,
				currentSheetIndex = this.indexOf(currentSheet),
				sheetIndex: number;

			do {
				sheetIndex = this._getSheetIndexFrom(validName);
				if (sheetIndex === -1 || sheetIndex === currentSheetIndex) {
					break;
				} else {
					validName = currentSheet.name.concat((index + 1).toString());
				}
				index = index + 1;
			} while (true);

			return validName;
		}

		// Move the current index to indicated position.
		private _moveCurrentTo(pos: number): boolean {
			var searchedPos = pos,
				e: PropertyChangedEventArgs;

			if (pos < 0 || pos >= this.length) {
				return false;
            }
            if (this._current < searchedPos || searchedPos === 0) {
                while (searchedPos < this.length && !this[searchedPos].visible) {
                    searchedPos++;
                }
            } else if (this._current > searchedPos) {
                while (searchedPos >= 0 && !this[searchedPos].visible) {
                    searchedPos--;
                }
            }
			if (searchedPos === this.length) {
				searchedPos = pos;
				while (searchedPos >= 0 && !this[searchedPos].visible) {
					searchedPos--;
				}
			}

			if (searchedPos < 0) {
				return false;
			}

			if (searchedPos !== this._current) {
				e = new PropertyChangedEventArgs('sheetIndex', this._current, searchedPos);
				this._current = searchedPos;
				this.onSelectedSheetChanged(e);
			}

			return true;
		}

		// Get the index for the sheet in the SheetCollection.
		private _getSheetIndexFrom(sheetName: string): number {
			var result = -1,
				sheet: Sheet,
				name: string;

            if (!sheetName) {
                return result;
            }

			sheetName = sheetName.toLowerCase();
			for (var i = 0; i < this.length; i++) {
				sheet = <Sheet>this[i];
				name = sheet.name ? sheet.name.toLowerCase() : '';
				if (name === sheetName) {
					return i;
				}
			}
			return result;
        }

        // Post process the newly added sheet. 
        private _postprocessSheet(item: Sheet) {
            var self = this;

            // Update the sheet name via the sheetNameChanged event handler.
            item.nameChanged.addHandler(() => {
                var e: wijmo.collections.NotifyCollectionChangedEventArgs,
                    index = self._getSheetIndexFrom(item.name);

                if (!self.isValidSheetName(item)) {
                    item._setValidName(self.getValidSheetName(item));
                }
                e = new wijmo.collections.NotifyCollectionChangedEventArgs(wijmo.collections.NotifyCollectionChangedAction.Change, item, isNumber(index) ? index : self.length - 1);
                self.onSheetNameChanged(e);
            });

            item.visibleChanged.addHandler(() => {
                var index = self._getSheetIndexFrom(item.name),
                    e = new wijmo.collections.NotifyCollectionChangedEventArgs(wijmo.collections.NotifyCollectionChangedAction.Change, item, isNumber(index) ? index : self.length - 1);
                self.onSheetVisibleChanged(e);
            });
        }

		// Get the unique name for the sheet in the SheetCollection.
		private _getUniqueName(): string {
			var validName = 'Sheet1',
				index = 0;
			do {
				if (this._getSheetIndexFrom(validName) === -1) {
					break;
				} else {
					validName = 'Sheet'.concat((index + 1).toString());
				}
				index = index + 1;
			} while (true);

			return validName;
		}
	}

	/*
	 * Represents the control that shows tabs for switching between @see:FlexSheet sheets.
	 */
	export class _SheetTabs extends wijmo.Control {
        private _sheets: SheetCollection;
        private _sheetContainer: HTMLElement;
		private _tabContainer: HTMLElement;
		private _sheetPage: HTMLElement;
		private _newSheet: HTMLElement;
        private _owner: FlexSheet;
        private _rtl = false;
        private _sheetTabClicked = false;

		static controlTemplate = '<div wj-part="sheet-container" class="wj-sheet" style="height:100%;position:relative">' +
			'<div wj-part="sheet-page" class="wj-btn-group wj-sheet-page">' + // Sheets pageg
			'<button type="button" class="wj-btn wj-btn-default">' +
			'<span class="wj-sheet-icon wj-glyph-step-backward"></span>' +
			'</button>' +
			'<button type="button" class="wj-btn wj-btn-default">' +
			'<span class="wj-sheet-icon wj-glyph-left"></span>' +
			'</button>' +
			'<button type="button" class="wj-btn wj-btn-default">' +
			'<span class="wj-sheet-icon wj-glyph-right"></span>' +
			'</button>' +
			'<button type="button" class="wj-btn wj-btn-default">' +
			'<span class="wj-sheet-icon wj-glyph-step-forward"></span>' +
			'</button>' +
			'</div>' +
			'<div class="wj-sheet-tab" style="height:100%;overflow:hidden">' + //Sheet Tabs
			'<ul wj-part="container"></ul>' +
			'</div>' +
			'<div wj-part="new-sheet" class="wj-new-sheet"><span class="wj-sheet-icon wj-glyph-file"></span></div>' +
			'</div>';

		/*
		 * Initializes a new instance of the @see:_SheetTabs class.
		 *
		 * @param element The DOM element that will host the control, or a selector for the host element (e.g. '#theCtrl').
		 * @param owner The @see: FlexSheet control what the SheetTabs control works with.
		 * @param options JavaScript object containing initialization data for the control.
		 */
		constructor(element: any, owner: FlexSheet, options?: any) {
			super(element, options);
			var self = this;

			self._owner = owner;
            self._sheets = owner.sheets;
            self._rtl = getComputedStyle(self._owner.hostElement).direction == 'rtl';

			if (self.hostElement.attributes['tabindex']) {
				self.hostElement.attributes.removeNamedItem('tabindex');
			}

			self._initControl();
			self.deferUpdate(() => {
				if (options) {
					self.initialize(options);
				}
			});
		}

		/*
		 * Override to refresh the control.
		 *
		 * @param fullUpdate Whether to update the control layout as well as the content.
		 */
		refresh(fullUpdate) {
			this._tabContainer.innerHTML = '';
            this._tabContainer.innerHTML = this._getSheetTabs();
            if (this._rtl) {
                this._adjustSheetsPosition();
            }
			this._adjustSize();
		}

		// The items source changed event handler.
		private _sourceChanged(sender: any, e: wijmo.EventArgs = wijmo.collections.NotifyCollectionChangedEventArgs.reset) {
			var eArgs: wijmo.collections.NotifyCollectionChangedEventArgs = <wijmo.collections.NotifyCollectionChangedEventArgs> e,
				index: number;

			switch (eArgs.action) {
				case wijmo.collections.NotifyCollectionChangedAction.Add:
					index = eArgs.index - 1;
					if (index < 0) {
						index = 0;
					}
					this._tabContainer.innerHTML = '';
                    this._tabContainer.innerHTML = this._getSheetTabs();
                    if (this._rtl) {
                        this._adjustSheetsPosition();
                    }
					this._adjustSize();
					break;
				case wijmo.collections.NotifyCollectionChangedAction.Remove:
                    this._tabContainer.removeChild(this._tabContainer.children[eArgs.index]);
                    if (this._tabContainer.hasChildNodes()) {
                        this._updateTabActive(eArgs.index, true);
                    }
					this._adjustSize();
					break;
				default:
					this.invalidate();
					break;
			}
		}

		// The current changed of the item source event handler.
		private _selectedSheetChanged(sender: any, e: PropertyChangedEventArgs) {
			this._updateTabActive(e.oldValue, false);
            this._updateTabActive(e.newValue, true);
            if (this._sheetTabClicked) {
                this._sheetTabClicked = false;
            } else {
                this._scrollToActiveSheet(e.newValue, e.oldValue);
            }
			this._adjustSize();
		}

		// Initialize the SheetTabs control.
		private _initControl() {
			var self = this;

			//apply template
            self.applyTemplate('', self.getTemplate(), {
                _sheetContainer: 'sheet-container',
				_tabContainer: 'container',
				_sheetPage: 'sheet-page',
				_newSheet: 'new-sheet'
			});
			//init opts

            if (self._rtl) {
                self._sheetPage.style.right = '0px';
                self._tabContainer.parentElement.style.right = self._sheetPage.clientWidth + 'px';
                self._tabContainer.style.right = '0px';
                self._tabContainer.style.cssFloat = 'right';
                self._newSheet.style.right = (self._sheetPage.clientWidth + self._tabContainer.parentElement.clientWidth) + 'px';
            }

            self.addEventListener(self._newSheet, 'click', (evt: MouseEvent) => {
                var oldIndex = self._owner.selectedSheetIndex;
				self._owner.addUnboundSheet();
                self._scrollToActiveSheet(self._owner.selectedSheetIndex, oldIndex);
			});

			self._sheets.collectionChanged.addHandler(self._sourceChanged, self);
            self._sheets.selectedSheetChanged.addHandler(self._selectedSheetChanged, self);
            self._sheets.sheetNameChanged.addHandler(self._updateSheetName, self);
            self._sheets.sheetVisibleChanged.addHandler(self._updateTabShown, self);

			self._initSheetPage();
			self._initSheetTab();
		}

		// Initialize the sheet tab part.
		private _initSheetTab() {
			var self = this;

			self.addEventListener(self._tabContainer, 'mousedown', (evt: MouseEvent) => {
				var li = <HTMLElement>evt.target,
					idx;

                if (li instanceof HTMLLIElement) {
                    self._sheetTabClicked = true;

                    idx = self._getItemIndex(self._tabContainer, li);

                    self._scrollSheetTabContainer(li);

                    if (idx > -1) {
                        self._sheets.selectedIndex = idx;
                    }
                }
			});
			//todo
			//contextmenu
		}

		// Initialize the sheet pager part.
		private _initSheetPage() {
			var self = this;

			self.hostElement.querySelector('div.wj-sheet-page').addEventListener('click', (e: MouseEvent) => {
                var btn = (<HTMLElement>e.target).toString() === '[object HTMLButtonElement]' ? <HTMLElement>e.target : (<HTMLElement>e.target).parentElement,
                    index = self._getItemIndex(self._sheetPage, btn),
                    currentSheetTab: HTMLElement;

                if (self._sheets.length === 0) {
                    return;
                }

				switch (index) {
                    case 0:
                        if (self._rtl) {
                            self._sheets.selectLast();
                        } else {
                            self._sheets.selectFirst();
                        }
						break;
                    case 1:
                        if (self._rtl) {
                            self._sheets.selectNext();
                        } else {
                            self._sheets.selectPrevious();
                        }
						break;
                    case 2:
                        if (self._rtl) {
                            self._sheets.selectPrevious();
                        } else {
                            self._sheets.selectNext();
                        }
						break;
                    case 3:
                        if (self._rtl) {
                            self._sheets.selectFirst();
                        } else {
                            self._sheets.selectLast();
                        }
						break;
				}
			});
		}

		// Get markup for the sheet tabs
		private _getSheetTabs(): string {
			var html = '',
				i: number;
                
            for (i = 0; i < this._sheets.length; i++) {
                html += this._getSheetElement(this._sheets[i], this._sheets.selectedIndex === i);
            }
			return html;
		}

		// Get the markup for a sheet tab.
		private _getSheetElement(sheetItem: Sheet, isActive=false): string {
			var result = '<li';
			if (!sheetItem.visible) {
				result += ' class="hidden"';
			} else if (isActive) {
				result += ' class="active"';
			}
			result += '>' + sheetItem.name + '</li>';
			return result;
		}

		// Update the active state for the sheet tabs.
		private _updateTabActive(pos: number, active: boolean) {
			if (pos < 0 || pos >= this._tabContainer.children.length) {
				return;
			}
			if (active) {
				addClass(<HTMLElement>this._tabContainer.children[pos], 'active');
			} else {
				removeClass(<HTMLElement>this._tabContainer.children[pos], 'active');
            }
		}

		// Update the show or hide state for the sheet tabs
        private _updateTabShown(sender: any, e: wijmo.collections.NotifyCollectionChangedEventArgs) {
			if (e.index < 0 || e.index >= this._tabContainer.children.length) {
				return;
			}
			if (!e.item.visible) {
				addClass(<HTMLElement>this._tabContainer.children[e.index], 'hidden');
			} else {
				removeClass(<HTMLElement>this._tabContainer.children[e.index], 'hidden');
            }
            this._adjustSize();
		}

		// Adjust the size of the SheetTabs control.
		_adjustSize() {
			//adjust the size
			var sheetCount = this._tabContainer.childElementCount,
				index: number,
				containerMaxWidth: number,
				width: number = 0,
				scrollLeft = 0;

			if (this.hostElement.style.display === 'none') {
				return;
			}

			// Get the scroll left of the tab container, before setting the size of the size of the tab container. (TFS 142788)
			scrollLeft = this._tabContainer.parentElement.scrollLeft;

			// Before adjusting the size of the sheet tab, we should reset the size to ''. (TFS #139846)
			this._tabContainer.parentElement.style.width = '';
			this._tabContainer.style.width = '';
			this._sheetPage.parentElement.style.width = '';

			for (index = 0; index < sheetCount; index++) {
				width += (<HTMLElement>this._tabContainer.children[index]).offsetWidth + 1;
			}
			containerMaxWidth = this.hostElement.offsetWidth - this._sheetPage.offsetWidth - this._newSheet.offsetWidth - 2;
			this._tabContainer.parentElement.style.width = (width > containerMaxWidth ? containerMaxWidth : width) + 'px';
			this._tabContainer.style.width = width + 'px';
			this._sheetPage.parentElement.style.width = this._sheetPage.offsetWidth + this._newSheet.offsetWidth + this._tabContainer.parentElement.offsetWidth + 3 + 'px';

			// Reset the scroll left for the tab container. (TFS 142788)
			this._tabContainer.parentElement.scrollLeft = scrollLeft;
		}

		// Get the index of the element in its parent container.
		private _getItemIndex(container:HTMLElement, item: HTMLElement): number {
			var idx = 0;
			for (; idx < container.children.length; idx++) {
				if (container.children[idx] === item) {
					return idx;
				}
			}
			return -1;
		}

		// Update the sheet tab name.
		private _updateSheetName(sender: any, e: wijmo.collections.NotifyCollectionChangedEventArgs) {
			(<HTMLElement>this._tabContainer.querySelectorAll('li')[e.index]).textContent = e.item.name;
			this._adjustSize();
        }

		// Scroll the sheet tab container to display the invisible or partial visible sheet tab.
        private _scrollSheetTabContainer(currentSheetTab: HTMLElement) {
            var scrollLeft = this._tabContainer.parentElement.scrollLeft,
                sheetPageSize = this._sheetPage.offsetWidth,
                newSheetSize = this._newSheet.offsetWidth,
                containerSize = this._tabContainer.parentElement.offsetWidth,
                containerOffset: number;

            if (this._rtl) {
                switch (FlexGrid['_getRtlMode']()) {
                    case 'rev':
                        containerOffset = -this._tabContainer.offsetLeft;
                        if (containerOffset + currentSheetTab.offsetLeft + currentSheetTab.offsetWidth > containerSize + scrollLeft) {
                            this._tabContainer.parentElement.scrollLeft += currentSheetTab.offsetWidth;
                        } else if (containerOffset + currentSheetTab.offsetLeft < scrollLeft) {
                            this._tabContainer.parentElement.scrollLeft -= currentSheetTab.offsetWidth;
                        }
                        break;
                    case 'neg':
                        if (currentSheetTab.offsetLeft < scrollLeft) {
                            this._tabContainer.parentElement.scrollLeft -= currentSheetTab.offsetWidth;
                        } else if (currentSheetTab.offsetLeft + currentSheetTab.offsetWidth > containerSize + scrollLeft) {
                            this._tabContainer.parentElement.scrollLeft += currentSheetTab.offsetWidth;
                        }
                        break;
                    default:
                        if (currentSheetTab.offsetLeft - newSheetSize + scrollLeft < 0) {
                            this._tabContainer.parentElement.scrollLeft += currentSheetTab.offsetWidth;
                        } else if (currentSheetTab.offsetLeft + currentSheetTab.offsetWidth - newSheetSize + scrollLeft > containerSize) {
                            this._tabContainer.parentElement.scrollLeft -= currentSheetTab.offsetWidth;
                        }
                        break;
                }
            } else {
                if (currentSheetTab.offsetLeft + currentSheetTab.offsetWidth - sheetPageSize > containerSize + scrollLeft) {
                    this._tabContainer.parentElement.scrollLeft += currentSheetTab.offsetWidth;
                } else if (currentSheetTab.offsetLeft - sheetPageSize < scrollLeft) {
                    this._tabContainer.parentElement.scrollLeft -= currentSheetTab.offsetWidth;
                }
            }
        }

        // Adjust the position of each sheet tab for 'rtl' direction.
        private _adjustSheetsPosition() {
            var sheets = this._tabContainer.querySelectorAll('li'),
                position = 0,
                sheet: HTMLElement,
                index: number;

            for (index = 0; index < sheets.length; index++) {
                sheet = <HTMLElement>sheets[index];
                sheet.style.cssFloat = 'right';
                sheet.style.right = position + 'px';
                position += (<HTMLElement>sheets[index]).clientWidth;
            }
        }

        // Scroll to the active sheet tab.
        private _scrollToActiveSheet(newIndex: number, oldIndex: number) {
            var sheets = this._tabContainer.querySelectorAll('li'),
                activeSheet: HTMLElement,
                scrollLeft: number,
                i: number;

            if (this._tabContainer.clientWidth > this._tabContainer.parentElement.clientWidth) {
                scrollLeft = this._tabContainer.clientWidth - this._tabContainer.parentElement.clientWidth;
            } else {
                scrollLeft = 0;
            }

            if (sheets.length > 0 && newIndex < sheets.length && oldIndex < sheets.length) {
                if ((newIndex === 0 && !this._rtl) || (newIndex === sheets.length - 1 && this._rtl)) {
                    
                    if (this._rtl) {
                        switch (FlexGrid['_getRtlMode']()) {
                            case 'rev':
                                this._tabContainer.parentElement.scrollLeft = 0;
                                break;
                            case 'neg':
                                this._tabContainer.parentElement.scrollLeft = -scrollLeft;
                                break;
                            default:
                                this._tabContainer.parentElement.scrollLeft = scrollLeft;
                                break;
                        }
                    } else {
                        this._tabContainer.parentElement.scrollLeft = 0;
                    }
                    return;
                }

                if ((newIndex === 0 && this._rtl) || (newIndex === sheets.length - 1 && !this._rtl)) {
                    if (this._rtl) {
                        switch (FlexGrid['_getRtlMode']()) {
                            case 'rev':
                                this._tabContainer.parentElement.scrollLeft = scrollLeft;
                                break;
                            case 'neg':
                                this._tabContainer.parentElement.scrollLeft = 0;
                                break;
                            default:
                                this._tabContainer.parentElement.scrollLeft = 0;
                                break;
                        }
                    } else {
                        this._tabContainer.parentElement.scrollLeft = scrollLeft;
                    }
                    return;
                }

                if (newIndex >= oldIndex) {
                    for (i = oldIndex + 1; i <= newIndex; i++) {
                        activeSheet = <HTMLElement>sheets[i];
                        this._scrollSheetTabContainer(activeSheet);
                    }
                } else {
                    for (i = oldIndex - 1; i >= newIndex; i--) {
                        activeSheet = <HTMLElement>sheets[i];
                        this._scrollSheetTabContainer(activeSheet);
                    }
                }
            }
        }
	}

	/*
	 * Defines the class defining @see:FlexSheet column sorting criterion.
	 */
	export class _UnboundSortDescription {
		private _column: wijmo.grid.Column;
		private _ascending: boolean;

		/*
		 * Initializes a new instance of the @see:UnboundSortDescription class.
		 *
		 * @param column The column to sort the rows by.
		 * @param ascending The sort order.
		 */
		constructor(column: wijmo.grid.Column, ascending: boolean) {
			this._column = column;
			this._ascending = ascending;
		}

		/*
		 * Gets the column to sort the rows by.
		 */
		get column(): wijmo.grid.Column {
			return this._column;
		}

		/*
		 * Gets the sort order.
		 */
		get ascending(): boolean {
			return this._ascending;
		}
	}
}