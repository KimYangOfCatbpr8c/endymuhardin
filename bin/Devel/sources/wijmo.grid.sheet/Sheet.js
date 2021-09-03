var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var grid;
    (function (grid_1) {
        var sheet;
        (function (sheet_1) {
            'use strict';
            /**
             * Represents a sheet within the @see:FlexSheet control.
             */
            var Sheet = (function () {
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
                function Sheet(owner, grid, sheetName, rows, cols) {
                    this._visible = true;
                    this._unboundSortDesc = new wijmo.collections.ObservableArray();
                    this._currentStyledCells = {};
                    this._currentMergedRanges = {};
                    this._isEmptyGrid = false;
                    this._scrollPosition = new wijmo.Point();
                    this._freezeHiddenRowCnt = 0;
                    this._freezeHiddenColumnCnt = 0;
                    /**
                     * Occurs after the sheet name has changed.
                     */
                    this.nameChanged = new wijmo.Event();
                    /**
                     * Occurs after the visible of sheet has changed.
                     */
                    this.visibleChanged = new wijmo.Event();
                    var self = this, insertRows, insertCols, i;
                    self._owner = owner;
                    self._name = sheetName;
                    if (wijmo.isNumber(rows) && !isNaN(rows) && rows >= 0) {
                        self._rowCount = rows;
                    }
                    else {
                        self._rowCount = 200;
                    }
                    if (wijmo.isNumber(cols) && !isNaN(cols) && cols >= 0) {
                        self._columnCount = cols;
                    }
                    else {
                        self._columnCount = 20;
                    }
                    self._grid = grid || this._createGrid();
                    self._grid.itemsSourceChanged.addHandler(this._gridItemsSourceChanged, this);
                    self._unboundSortDesc.collectionChanged.addHandler(function () {
                        var arr = self._unboundSortDesc, i, sd;
                        for (i = 0; i < arr.length; i++) {
                            sd = wijmo.tryCast(arr[i], _UnboundSortDescription);
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
                Object.defineProperty(Sheet.prototype, "grid", {
                    /**
                     * Gets the associated @see:FlexGrid control used to store the sheet data.
                     */
                    get: function () {
                        return this._grid;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Sheet.prototype, "name", {
                    /**
                     * Gets or sets the name of the sheet.
                     */
                    get: function () {
                        return this._name;
                    },
                    set: function (value) {
                        if (!wijmo.isNullOrWhiteSpace(value) && ((this._name && this._name.toLowerCase() !== value.toLowerCase()) || !this._name)) {
                            this._name = value;
                            this._grid['wj_sheetInfo'].name = value;
                            this.onNameChanged(new wijmo.EventArgs());
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Sheet.prototype, "visible", {
                    /**
                     * Gets or sets the sheet visibility.
                     */
                    get: function () {
                        return this._visible;
                    },
                    set: function (value) {
                        if (this._visible !== value) {
                            this._visible = value;
                            this._grid['wj_sheetInfo'].visible = value;
                            this.onVisibleChanged(new wijmo.EventArgs());
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Sheet.prototype, "rowCount", {
                    /**
                     * Gets or sets the number of rows in the sheet.
                     */
                    get: function () {
                        if (this._grid != null) {
                            return this._grid.rows.length;
                        }
                        return 0;
                    },
                    set: function (value) {
                        var rowIndex;
                        if (wijmo.isNumber(value) && !isNaN(value) && value >= 0 && this._rowCount !== value) {
                            if (this._rowCount < value) {
                                for (rowIndex = 0; rowIndex < (value - this._rowCount); rowIndex++) {
                                    this._grid.rows.push(new grid_1.Row());
                                }
                            }
                            else {
                                this._grid.rows.splice(value, this._rowCount - value);
                            }
                            this._rowCount = value;
                            // If the sheet is current selected sheet of the flexsheet, we should synchronize the updating of the sheet to the flexsheet.
                            if (this._owner && this._owner.selectedSheet && this._name === this._owner.selectedSheet.name) {
                                this._owner._copyFrom(this, true);
                            }
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Sheet.prototype, "columnCount", {
                    /**
                     * Gets or sets the number of columns in the sheet.
                     */
                    get: function () {
                        if (this._grid != null) {
                            return this._grid.columns.length;
                        }
                        return 0;
                    },
                    set: function (value) {
                        var colIndex;
                        if (wijmo.isNumber(value) && !isNaN(value) && value >= 0 && this._columnCount !== value) {
                            if (this._columnCount < value) {
                                for (colIndex = 0; colIndex < (value - this._columnCount); colIndex++) {
                                    this._grid.columns.push(new grid_1.Column());
                                }
                            }
                            else {
                                this._grid.columns.splice(value, this._columnCount - value);
                            }
                            this._columnCount = value;
                            // If the sheet is current seleced sheet of the flexsheet, we should synchronize the updating of the sheet to the flexsheet.
                            if (this._owner && this._owner.selectedSheet && this._name === this._owner.selectedSheet.name) {
                                this._owner._copyFrom(this, true);
                            }
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Sheet.prototype, "selectionRanges", {
                    /**
                     * Gets the selection array.
                     */
                    get: function () {
                        var _this = this;
                        if (!this._selectionRanges) {
                            this._selectionRanges = new wijmo.collections.ObservableArray();
                            this._selectionRanges.collectionChanged.addHandler(function () {
                                var selectionCnt, lastSelection;
                                if (_this._owner && !_this._owner._isClicking) {
                                    selectionCnt = _this._selectionRanges.length;
                                    if (selectionCnt > 0) {
                                        lastSelection = _this._selectionRanges[selectionCnt - 1];
                                        if (lastSelection && lastSelection instanceof grid_1.CellRange) {
                                            _this._owner.selection = lastSelection;
                                        }
                                    }
                                    if (selectionCnt > 1) {
                                        _this._owner._enableMulSel = true;
                                    }
                                    _this._owner.refresh();
                                    _this._owner._enableMulSel = false;
                                }
                            }, this);
                        }
                        return this._selectionRanges;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Sheet.prototype, "itemsSource", {
                    /**
                     * Gets or sets the array or @see:ICollectionView for the @see:FlexGrid instance of the sheet.
                     */
                    get: function () {
                        if (this._grid != null) {
                            return this._grid.itemsSource;
                        }
                        return null;
                    },
                    set: function (value) {
                        if (this._grid == null) {
                            this._createGrid();
                            this._grid.itemsSourceChanged.addHandler(this._gridItemsSourceChanged, this);
                        }
                        if (this._isEmptyGrid) {
                            this._clearGrid();
                        }
                        this._grid.itemsSource = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Sheet.prototype, "_styledCells", {
                    /*
                     * Gets or sets the styled cells
                     * This property uses the cell index as the key and stores the @ICellStyle object as the value.
                     * { 1: { fontFamily: xxxx, fontSize: xxxx, .... }, 2: {...}, ... }
                     */
                    get: function () {
                        if (!this._currentStyledCells) {
                            this._currentStyledCells = {};
                        }
                        return this._currentStyledCells;
                    },
                    set: function (value) {
                        this._currentStyledCells = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Sheet.prototype, "_mergedRanges", {
                    /*
                     * Gets or sets the merge ranges.
                     * This property uses the cell index as the key and stores the @CellRange object as the value.
                     * { 1: CellRange(row = 1, col = 1, row2 = 3, col2 = 4), 2: CellRange(), ...}
                     */
                    get: function () {
                        if (!this._currentMergedRanges) {
                            this._currentMergedRanges = {};
                        }
                        return this._currentMergedRanges;
                    },
                    set: function (value) {
                        this._currentMergedRanges = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Raises the @see:nameChanged event.
                 */
                Sheet.prototype.onNameChanged = function (e) {
                    this.nameChanged.raise(this, e);
                };
                /**
                 * Raises the @see:visibleChanged event.
                 */
                Sheet.prototype.onVisibleChanged = function (e) {
                    this.visibleChanged.raise(this, e);
                };
                /**
                 * Gets the style of specified cell.
                 *
                 * @param rowIndex the row index of the specified cell.
                 * @param columnIndex the column index of the specified cell.
                 */
                Sheet.prototype.getCellStyle = function (rowIndex, columnIndex) {
                    var cellIndex, rowCnt = this._grid.rows.length, colCnt = this._grid.columns.length;
                    if (rowIndex >= rowCnt || columnIndex >= colCnt) {
                        return null;
                    }
                    cellIndex = rowIndex * colCnt + columnIndex;
                    return this._styledCells[cellIndex];
                };
                // Attach the sheet to the @see: FlexSheet control as owner.
                Sheet.prototype._attachOwner = function (owner) {
                    if (this._owner !== owner) {
                        this._owner = owner;
                    }
                };
                // Update the sheet name with valid name.
                Sheet.prototype._setValidName = function (validName) {
                    this._name = validName;
                    this._grid['wj_sheetInfo'].name = validName;
                };
                // comparison function used in rows sort for unbound sheet.
                Sheet.prototype._compareRows = function () {
                    var self = this, sortDesc = this._unboundSortDesc;
                    return function (a, b) {
                        for (var i = 0; i < sortDesc.length; i++) {
                            // get values
                            var sd = sortDesc[i], v1 = a._ubv ? a._ubv[sd.column._hash] : '', v2 = b._ubv ? b._ubv[sd.column._hash] : '';
                            // if the cell value is formula, we should try to evaluate this formula.
                            if (wijmo.isString(v1) && v1[0] === '=') {
                                v1 = self._owner.evaluate(v1);
                                if (!wijmo.isPrimitive(v1)) {
                                    v1 = v1.value;
                                }
                            }
                            if (wijmo.isString(v2) && v2[0] === '=') {
                                v2 = self._owner.evaluate(v2);
                                if (!wijmo.isPrimitive(v2)) {
                                    v2 = v2.value;
                                }
                            }
                            // check for NaN (isNaN returns true for NaN but also for non-numbers)
                            if (v1 !== v1)
                                v1 = null;
                            if (v2 !== v2)
                                v2 = null;
                            // ignore case when sorting  (but add the original string to keep the 
                            // strings different and the sort consistent, 'aa' between 'AA' and 'bb')
                            if (wijmo.isString(v1))
                                v1 = v1.toLowerCase() + v1;
                            if (wijmo.isString(v2))
                                v2 = v2.toLowerCase() + v2;
                            // compare the values (at last!)
                            var cmp = (v1 < v2) ? -1 : (v1 > v2) ? +1 : 0;
                            if (cmp !== 0) {
                                return sd.ascending ? +cmp : -cmp;
                            }
                        }
                        return 0;
                    };
                };
                // Create a blank flexsheet.
                Sheet.prototype._createGrid = function () {
                    var hostElement = document.createElement('div'), grid, column, colIndex, rowIndex;
                    this._isEmptyGrid = true;
                    // We should append the host element of the data grid of current sheet to body before creating data grid,
                    // this will make the host element to inherit the style of body (TFS 121713)
                    hostElement.style.visibility = 'hidden';
                    document.body.appendChild(hostElement);
                    grid = new grid_1.FlexGrid(hostElement);
                    document.body.removeChild(hostElement);
                    for (rowIndex = 0; rowIndex < this._rowCount; rowIndex++) {
                        grid.rows.push(new grid_1.Row());
                    }
                    for (colIndex = 0; colIndex < this._columnCount; colIndex++) {
                        column = new grid_1.Column();
                        // Setting the required property of the column to false for the data grid of current sheet.
                        // TFS #126125
                        column.isRequired = false;
                        grid.columns.push(column);
                    }
                    // Add header row for the grid of the bind sheet.
                    grid.loadedRows.addHandler(function () {
                        if (grid.itemsSource && !(grid.rows[0] instanceof sheet_1.HeaderRow)) {
                            grid.rows.insert(0, new sheet_1.HeaderRow());
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
                };
                // Clear the grid of the sheet.
                Sheet.prototype._clearGrid = function () {
                    this._grid.rows.clear();
                    this._grid.columns.clear();
                    this._grid.columnHeaders.columns.clear();
                    this._grid.rowHeaders.rows.clear();
                };
                // Items source changed handler for the grid of the sheet.
                Sheet.prototype._gridItemsSourceChanged = function () {
                    // If the sheet is current seleced sheet of the flexsheet, we should synchronize the updating of the sheet to the flexsheet.
                    if (this._owner && this._owner.selectedSheet && this._name === this._owner.selectedSheet.name) {
                        this._owner._copyFrom(this, false);
                    }
                };
                return Sheet;
            }());
            sheet_1.Sheet = Sheet;
            /**
             * Defines the collection of the @see:Sheet objects.
             */
            var SheetCollection = (function (_super) {
                __extends(SheetCollection, _super);
                function SheetCollection() {
                    _super.apply(this, arguments);
                    this._current = -1;
                    /**
                     * Occurs when the @see:SheetCollection is cleared.
                     */
                    this.sheetCleared = new wijmo.Event();
                    /**
                     * Occurs when the <b>selectedIndex</b> property changes.
                     */
                    this.selectedSheetChanged = new wijmo.Event();
                    /**
                     * Occurs after the name of the sheet in the collection has changed.
                     */
                    this.sheetNameChanged = new wijmo.Event();
                    /**
                     * Occurs after the visible of the sheet in the collection has changed.
                     */
                    this.sheetVisibleChanged = new wijmo.Event();
                }
                /**
                 * Raises the sheetCleared event.
                 */
                SheetCollection.prototype.onSheetCleared = function () {
                    this.sheetCleared.raise(this, new wijmo.EventArgs());
                };
                Object.defineProperty(SheetCollection.prototype, "selectedIndex", {
                    /**
                     * Gets or sets the index of the currently selected sheet.
                     */
                    get: function () {
                        return this._current;
                    },
                    set: function (index) {
                        this._moveCurrentTo(index);
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Raises the <b>currentChanged</b> event.
                 *
                 * @param e @see:PropertyChangedEventArgs that contains the event data.
                 */
                SheetCollection.prototype.onSelectedSheetChanged = function (e) {
                    this.selectedSheetChanged.raise(this, e);
                };
                /**
                 * Inserts an item at a specific position in the array.
                 * Overrides the insert method of its base class @see:ObservableArray.
                 *
                 * @param index Position where the item will be added.
                 * @param item Item to add to the array.
                 */
                SheetCollection.prototype.insert = function (index, item) {
                    var name;
                    name = item.name ? this.getValidSheetName(item) : this._getUniqueName();
                    if (name !== item.name) {
                        item.name = name;
                    }
                    _super.prototype.insert.call(this, index, item);
                    this._postprocessSheet(item);
                };
                /**
                 * Adds one or more items to the end of the array.
                 * Overrides the push method of its base class @see:ObservableArray.
                 *
                 * @param ...item One or more items to add to the array.
                 * @return The new length of the array.
                 */
                SheetCollection.prototype.push = function () {
                    var item = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        item[_i - 0] = arguments[_i];
                    }
                    var currentLength = this.length, idx = 0, name;
                    for (; idx < item.length; idx++) {
                        name = item[idx].name ? this.getValidSheetName(item[idx]) : this._getUniqueName();
                        if (name !== item[idx].name) {
                            item[idx].name = name;
                        }
                        _super.prototype.push.call(this, item[idx]);
                        this._postprocessSheet(item[idx]);
                    }
                    return this.length;
                };
                /**
                 * Removes and/or adds items to the array.
                 * Overrides the splice method of its base class @see:ObservableArray.
                 *
                 * @param index Position where items will be added or removed.
                 * @param count Number of items to remove from the array.
                 * @param item Item to add to the array.
                 * @return An array containing the removed elements.
                 */
                SheetCollection.prototype.splice = function (index, count, item) {
                    var name;
                    if (item) {
                        name = item.name ? this.getValidSheetName(item) : this._getUniqueName();
                        if (name !== item.name) {
                            item.name = name;
                        }
                        this._postprocessSheet(item);
                        return _super.prototype.splice.call(this, index, count, item);
                    }
                    else {
                        return _super.prototype.splice.call(this, index, count, item);
                    }
                };
                /**
                 * Removes an item at a specific position in the array.
                 * Overrides the removeAt method of its base class @see:ObservableArray.
                 *
                 * @param index Position of the item to remove.
                 */
                SheetCollection.prototype.removeAt = function (index) {
                    var succeeded = this.hide(index);
                    if (succeeded) {
                        _super.prototype.removeAt.call(this, index);
                        if (index < this.selectedIndex) {
                            this._current -= 1;
                        }
                    }
                };
                /**
                 * Raises the <b>sheetNameChanged</b> event.
                 */
                SheetCollection.prototype.onSheetNameChanged = function (e) {
                    this.sheetNameChanged.raise(this, e);
                };
                /**
                 * Raises the <b>sheetVisibleChanged</b> event.
                 */
                SheetCollection.prototype.onSheetVisibleChanged = function (e) {
                    this.sheetVisibleChanged.raise(this, e);
                };
                /**
                 * Selects the first sheet in the @see:FlexSheet control.
                 */
                SheetCollection.prototype.selectFirst = function () {
                    return this._moveCurrentTo(0);
                };
                /**
                 * Selects the last sheet in the owner @see:FlexSheet control.
                 */
                SheetCollection.prototype.selectLast = function () {
                    return this._moveCurrentTo(this.length - 1);
                };
                /**
                 * Selects the previous sheet in the owner @see:FlexSheet control.
                 */
                SheetCollection.prototype.selectPrevious = function () {
                    return this._moveCurrentTo(this._current - 1);
                };
                /**
                 * Select the next sheet in the owner @see:FlexSheet control.
                 */
                SheetCollection.prototype.selectNext = function () {
                    return this._moveCurrentTo(this._current + 1);
                };
                /**
                 * Hides the sheet at the specified position.
                 *
                 * @param pos The position of the sheet to hide.
                 */
                SheetCollection.prototype.hide = function (pos) {
                    var succeeded = false;
                    if (pos < 0 && pos >= this.length) {
                        return false;
                    }
                    if (!this[pos].visible) {
                        return false;
                    }
                    this[pos].visible = false;
                    return true;
                };
                /**
                 * Unhide and selects the @see:Sheet at the specified position.
                 *
                 * @param pos The position of the sheet to show.
                 */
                SheetCollection.prototype.show = function (pos) {
                    var succeeded = false;
                    if (pos < 0 && pos >= this.length) {
                        return false;
                    }
                    this[pos].visible = true;
                    this._moveCurrentTo(pos);
                    return true;
                };
                /**
                 * Clear the SheetCollection.
                 */
                SheetCollection.prototype.clear = function () {
                    _super.prototype.clear.call(this);
                    this._current = -1;
                    this.onSheetCleared();
                };
                /**
                 * Checks whether the sheet name is valid.
                 *
                 * @param sheet The @see:Sheet for which the name needs to check.
                 */
                SheetCollection.prototype.isValidSheetName = function (sheet) {
                    var sheetIndex = this._getSheetIndexFrom(sheet.name), currentSheetIndex = this.indexOf(sheet);
                    return (sheetIndex === -1 || sheetIndex === currentSheetIndex);
                };
                /**
                 * Gets the valid name for the sheet.
                 *
                 * @param currentSheet The @see:Sheet need get the valid name.
                 */
                SheetCollection.prototype.getValidSheetName = function (currentSheet) {
                    var validName = currentSheet.name, index = 1, currentSheetIndex = this.indexOf(currentSheet), sheetIndex;
                    do {
                        sheetIndex = this._getSheetIndexFrom(validName);
                        if (sheetIndex === -1 || sheetIndex === currentSheetIndex) {
                            break;
                        }
                        else {
                            validName = currentSheet.name.concat((index + 1).toString());
                        }
                        index = index + 1;
                    } while (true);
                    return validName;
                };
                // Move the current index to indicated position.
                SheetCollection.prototype._moveCurrentTo = function (pos) {
                    var searchedPos = pos, e;
                    if (pos < 0 || pos >= this.length) {
                        return false;
                    }
                    if (this._current < searchedPos || searchedPos === 0) {
                        while (searchedPos < this.length && !this[searchedPos].visible) {
                            searchedPos++;
                        }
                    }
                    else if (this._current > searchedPos) {
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
                        e = new wijmo.PropertyChangedEventArgs('sheetIndex', this._current, searchedPos);
                        this._current = searchedPos;
                        this.onSelectedSheetChanged(e);
                    }
                    return true;
                };
                // Get the index for the sheet in the SheetCollection.
                SheetCollection.prototype._getSheetIndexFrom = function (sheetName) {
                    var result = -1, sheet, name;
                    if (!sheetName) {
                        return result;
                    }
                    sheetName = sheetName.toLowerCase();
                    for (var i = 0; i < this.length; i++) {
                        sheet = this[i];
                        name = sheet.name ? sheet.name.toLowerCase() : '';
                        if (name === sheetName) {
                            return i;
                        }
                    }
                    return result;
                };
                // Post process the newly added sheet. 
                SheetCollection.prototype._postprocessSheet = function (item) {
                    var self = this;
                    // Update the sheet name via the sheetNameChanged event handler.
                    item.nameChanged.addHandler(function () {
                        var e, index = self._getSheetIndexFrom(item.name);
                        if (!self.isValidSheetName(item)) {
                            item._setValidName(self.getValidSheetName(item));
                        }
                        e = new wijmo.collections.NotifyCollectionChangedEventArgs(wijmo.collections.NotifyCollectionChangedAction.Change, item, wijmo.isNumber(index) ? index : self.length - 1);
                        self.onSheetNameChanged(e);
                    });
                    item.visibleChanged.addHandler(function () {
                        var index = self._getSheetIndexFrom(item.name), e = new wijmo.collections.NotifyCollectionChangedEventArgs(wijmo.collections.NotifyCollectionChangedAction.Change, item, wijmo.isNumber(index) ? index : self.length - 1);
                        self.onSheetVisibleChanged(e);
                    });
                };
                // Get the unique name for the sheet in the SheetCollection.
                SheetCollection.prototype._getUniqueName = function () {
                    var validName = 'Sheet1', index = 0;
                    do {
                        if (this._getSheetIndexFrom(validName) === -1) {
                            break;
                        }
                        else {
                            validName = 'Sheet'.concat((index + 1).toString());
                        }
                        index = index + 1;
                    } while (true);
                    return validName;
                };
                return SheetCollection;
            }(wijmo.collections.ObservableArray));
            sheet_1.SheetCollection = SheetCollection;
            /*
             * Represents the control that shows tabs for switching between @see:FlexSheet sheets.
             */
            var _SheetTabs = (function (_super) {
                __extends(_SheetTabs, _super);
                /*
                 * Initializes a new instance of the @see:_SheetTabs class.
                 *
                 * @param element The DOM element that will host the control, or a selector for the host element (e.g. '#theCtrl').
                 * @param owner The @see: FlexSheet control what the SheetTabs control works with.
                 * @param options JavaScript object containing initialization data for the control.
                 */
                function _SheetTabs(element, owner, options) {
                    _super.call(this, element, options);
                    this._rtl = false;
                    this._sheetTabClicked = false;
                    var self = this;
                    self._owner = owner;
                    self._sheets = owner.sheets;
                    self._rtl = getComputedStyle(self._owner.hostElement).direction == 'rtl';
                    if (self.hostElement.attributes['tabindex']) {
                        self.hostElement.attributes.removeNamedItem('tabindex');
                    }
                    self._initControl();
                    self.deferUpdate(function () {
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
                _SheetTabs.prototype.refresh = function (fullUpdate) {
                    this._tabContainer.innerHTML = '';
                    this._tabContainer.innerHTML = this._getSheetTabs();
                    if (this._rtl) {
                        this._adjustSheetsPosition();
                    }
                    this._adjustSize();
                };
                // The items source changed event handler.
                _SheetTabs.prototype._sourceChanged = function (sender, e) {
                    if (e === void 0) { e = wijmo.collections.NotifyCollectionChangedEventArgs.reset; }
                    var eArgs = e, index;
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
                };
                // The current changed of the item source event handler.
                _SheetTabs.prototype._selectedSheetChanged = function (sender, e) {
                    this._updateTabActive(e.oldValue, false);
                    this._updateTabActive(e.newValue, true);
                    if (this._sheetTabClicked) {
                        this._sheetTabClicked = false;
                    }
                    else {
                        this._scrollToActiveSheet(e.newValue, e.oldValue);
                    }
                    this._adjustSize();
                };
                // Initialize the SheetTabs control.
                _SheetTabs.prototype._initControl = function () {
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
                    self.addEventListener(self._newSheet, 'click', function (evt) {
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
                };
                // Initialize the sheet tab part.
                _SheetTabs.prototype._initSheetTab = function () {
                    var self = this;
                    self.addEventListener(self._tabContainer, 'mousedown', function (evt) {
                        var li = evt.target, idx;
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
                };
                // Initialize the sheet pager part.
                _SheetTabs.prototype._initSheetPage = function () {
                    var self = this;
                    self.hostElement.querySelector('div.wj-sheet-page').addEventListener('click', function (e) {
                        var btn = e.target.toString() === '[object HTMLButtonElement]' ? e.target : e.target.parentElement, index = self._getItemIndex(self._sheetPage, btn), currentSheetTab;
                        if (self._sheets.length === 0) {
                            return;
                        }
                        switch (index) {
                            case 0:
                                if (self._rtl) {
                                    self._sheets.selectLast();
                                }
                                else {
                                    self._sheets.selectFirst();
                                }
                                break;
                            case 1:
                                if (self._rtl) {
                                    self._sheets.selectNext();
                                }
                                else {
                                    self._sheets.selectPrevious();
                                }
                                break;
                            case 2:
                                if (self._rtl) {
                                    self._sheets.selectPrevious();
                                }
                                else {
                                    self._sheets.selectNext();
                                }
                                break;
                            case 3:
                                if (self._rtl) {
                                    self._sheets.selectFirst();
                                }
                                else {
                                    self._sheets.selectLast();
                                }
                                break;
                        }
                    });
                };
                // Get markup for the sheet tabs
                _SheetTabs.prototype._getSheetTabs = function () {
                    var html = '', i;
                    for (i = 0; i < this._sheets.length; i++) {
                        html += this._getSheetElement(this._sheets[i], this._sheets.selectedIndex === i);
                    }
                    return html;
                };
                // Get the markup for a sheet tab.
                _SheetTabs.prototype._getSheetElement = function (sheetItem, isActive) {
                    if (isActive === void 0) { isActive = false; }
                    var result = '<li';
                    if (!sheetItem.visible) {
                        result += ' class="hidden"';
                    }
                    else if (isActive) {
                        result += ' class="active"';
                    }
                    result += '>' + sheetItem.name + '</li>';
                    return result;
                };
                // Update the active state for the sheet tabs.
                _SheetTabs.prototype._updateTabActive = function (pos, active) {
                    if (pos < 0 || pos >= this._tabContainer.children.length) {
                        return;
                    }
                    if (active) {
                        wijmo.addClass(this._tabContainer.children[pos], 'active');
                    }
                    else {
                        wijmo.removeClass(this._tabContainer.children[pos], 'active');
                    }
                };
                // Update the show or hide state for the sheet tabs
                _SheetTabs.prototype._updateTabShown = function (sender, e) {
                    if (e.index < 0 || e.index >= this._tabContainer.children.length) {
                        return;
                    }
                    if (!e.item.visible) {
                        wijmo.addClass(this._tabContainer.children[e.index], 'hidden');
                    }
                    else {
                        wijmo.removeClass(this._tabContainer.children[e.index], 'hidden');
                    }
                    this._adjustSize();
                };
                // Adjust the size of the SheetTabs control.
                _SheetTabs.prototype._adjustSize = function () {
                    //adjust the size
                    var sheetCount = this._tabContainer.childElementCount, index, containerMaxWidth, width = 0, scrollLeft = 0;
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
                        width += this._tabContainer.children[index].offsetWidth + 1;
                    }
                    containerMaxWidth = this.hostElement.offsetWidth - this._sheetPage.offsetWidth - this._newSheet.offsetWidth - 2;
                    this._tabContainer.parentElement.style.width = (width > containerMaxWidth ? containerMaxWidth : width) + 'px';
                    this._tabContainer.style.width = width + 'px';
                    this._sheetPage.parentElement.style.width = this._sheetPage.offsetWidth + this._newSheet.offsetWidth + this._tabContainer.parentElement.offsetWidth + 3 + 'px';
                    // Reset the scroll left for the tab container. (TFS 142788)
                    this._tabContainer.parentElement.scrollLeft = scrollLeft;
                };
                // Get the index of the element in its parent container.
                _SheetTabs.prototype._getItemIndex = function (container, item) {
                    var idx = 0;
                    for (; idx < container.children.length; idx++) {
                        if (container.children[idx] === item) {
                            return idx;
                        }
                    }
                    return -1;
                };
                // Update the sheet tab name.
                _SheetTabs.prototype._updateSheetName = function (sender, e) {
                    this._tabContainer.querySelectorAll('li')[e.index].textContent = e.item.name;
                    this._adjustSize();
                };
                // Scroll the sheet tab container to display the invisible or partial visible sheet tab.
                _SheetTabs.prototype._scrollSheetTabContainer = function (currentSheetTab) {
                    var scrollLeft = this._tabContainer.parentElement.scrollLeft, sheetPageSize = this._sheetPage.offsetWidth, newSheetSize = this._newSheet.offsetWidth, containerSize = this._tabContainer.parentElement.offsetWidth, containerOffset;
                    if (this._rtl) {
                        switch (grid_1.FlexGrid['_getRtlMode']()) {
                            case 'rev':
                                containerOffset = -this._tabContainer.offsetLeft;
                                if (containerOffset + currentSheetTab.offsetLeft + currentSheetTab.offsetWidth > containerSize + scrollLeft) {
                                    this._tabContainer.parentElement.scrollLeft += currentSheetTab.offsetWidth;
                                }
                                else if (containerOffset + currentSheetTab.offsetLeft < scrollLeft) {
                                    this._tabContainer.parentElement.scrollLeft -= currentSheetTab.offsetWidth;
                                }
                                break;
                            case 'neg':
                                if (currentSheetTab.offsetLeft < scrollLeft) {
                                    this._tabContainer.parentElement.scrollLeft -= currentSheetTab.offsetWidth;
                                }
                                else if (currentSheetTab.offsetLeft + currentSheetTab.offsetWidth > containerSize + scrollLeft) {
                                    this._tabContainer.parentElement.scrollLeft += currentSheetTab.offsetWidth;
                                }
                                break;
                            default:
                                if (currentSheetTab.offsetLeft - newSheetSize + scrollLeft < 0) {
                                    this._tabContainer.parentElement.scrollLeft += currentSheetTab.offsetWidth;
                                }
                                else if (currentSheetTab.offsetLeft + currentSheetTab.offsetWidth - newSheetSize + scrollLeft > containerSize) {
                                    this._tabContainer.parentElement.scrollLeft -= currentSheetTab.offsetWidth;
                                }
                                break;
                        }
                    }
                    else {
                        if (currentSheetTab.offsetLeft + currentSheetTab.offsetWidth - sheetPageSize > containerSize + scrollLeft) {
                            this._tabContainer.parentElement.scrollLeft += currentSheetTab.offsetWidth;
                        }
                        else if (currentSheetTab.offsetLeft - sheetPageSize < scrollLeft) {
                            this._tabContainer.parentElement.scrollLeft -= currentSheetTab.offsetWidth;
                        }
                    }
                };
                // Adjust the position of each sheet tab for 'rtl' direction.
                _SheetTabs.prototype._adjustSheetsPosition = function () {
                    var sheets = this._tabContainer.querySelectorAll('li'), position = 0, sheet, index;
                    for (index = 0; index < sheets.length; index++) {
                        sheet = sheets[index];
                        sheet.style.cssFloat = 'right';
                        sheet.style.right = position + 'px';
                        position += sheets[index].clientWidth;
                    }
                };
                // Scroll to the active sheet tab.
                _SheetTabs.prototype._scrollToActiveSheet = function (newIndex, oldIndex) {
                    var sheets = this._tabContainer.querySelectorAll('li'), activeSheet, scrollLeft, i;
                    if (this._tabContainer.clientWidth > this._tabContainer.parentElement.clientWidth) {
                        scrollLeft = this._tabContainer.clientWidth - this._tabContainer.parentElement.clientWidth;
                    }
                    else {
                        scrollLeft = 0;
                    }
                    if (sheets.length > 0 && newIndex < sheets.length && oldIndex < sheets.length) {
                        if ((newIndex === 0 && !this._rtl) || (newIndex === sheets.length - 1 && this._rtl)) {
                            if (this._rtl) {
                                switch (grid_1.FlexGrid['_getRtlMode']()) {
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
                            }
                            else {
                                this._tabContainer.parentElement.scrollLeft = 0;
                            }
                            return;
                        }
                        if ((newIndex === 0 && this._rtl) || (newIndex === sheets.length - 1 && !this._rtl)) {
                            if (this._rtl) {
                                switch (grid_1.FlexGrid['_getRtlMode']()) {
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
                            }
                            else {
                                this._tabContainer.parentElement.scrollLeft = scrollLeft;
                            }
                            return;
                        }
                        if (newIndex >= oldIndex) {
                            for (i = oldIndex + 1; i <= newIndex; i++) {
                                activeSheet = sheets[i];
                                this._scrollSheetTabContainer(activeSheet);
                            }
                        }
                        else {
                            for (i = oldIndex - 1; i >= newIndex; i--) {
                                activeSheet = sheets[i];
                                this._scrollSheetTabContainer(activeSheet);
                            }
                        }
                    }
                };
                _SheetTabs.controlTemplate = '<div wj-part="sheet-container" class="wj-sheet" style="height:100%;position:relative">' +
                    '<div wj-part="sheet-page" class="wj-btn-group wj-sheet-page">' +
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
                    '<div class="wj-sheet-tab" style="height:100%;overflow:hidden">' +
                    '<ul wj-part="container"></ul>' +
                    '</div>' +
                    '<div wj-part="new-sheet" class="wj-new-sheet"><span class="wj-sheet-icon wj-glyph-file"></span></div>' +
                    '</div>';
                return _SheetTabs;
            }(wijmo.Control));
            sheet_1._SheetTabs = _SheetTabs;
            /*
             * Defines the class defining @see:FlexSheet column sorting criterion.
             */
            var _UnboundSortDescription = (function () {
                /*
                 * Initializes a new instance of the @see:UnboundSortDescription class.
                 *
                 * @param column The column to sort the rows by.
                 * @param ascending The sort order.
                 */
                function _UnboundSortDescription(column, ascending) {
                    this._column = column;
                    this._ascending = ascending;
                }
                Object.defineProperty(_UnboundSortDescription.prototype, "column", {
                    /*
                     * Gets the column to sort the rows by.
                     */
                    get: function () {
                        return this._column;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_UnboundSortDescription.prototype, "ascending", {
                    /*
                     * Gets the sort order.
                     */
                    get: function () {
                        return this._ascending;
                    },
                    enumerable: true,
                    configurable: true
                });
                return _UnboundSortDescription;
            }());
            sheet_1._UnboundSortDescription = _UnboundSortDescription;
        })(sheet = grid_1.sheet || (grid_1.sheet = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Sheet.js.map