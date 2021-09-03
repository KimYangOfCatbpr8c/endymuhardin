var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Defines the @see:FlexSheet control and associated classes.
 *
 * The @see:FlexSheet control extends the @see:FlexGrid control to provide Excel-like
 * features.
 */
var wijmo;
(function (wijmo) {
    var grid;
    (function (grid_1) {
        var sheet;
        (function (sheet_1) {
            'use strict';
            var FlexSheetFunctions = [
                { name: 'abs', description: 'Returns the absolute value of a number.' },
                { name: 'acos', description: 'Returns the arccosine of a number.' },
                { name: 'and', description: 'Returns TRUE if all of its arguments are TRUE.' },
                { name: 'asin', description: 'Returns the arcsine of a number.' },
                { name: 'atan', description: 'Returns the arctangent of a number.' },
                { name: 'atan2', description: 'Returns the arctangent from x- and y-coordinates.' },
                { name: 'average', description: 'Returns the average of its arguments.' },
                { name: 'ceiling', description: 'Rounds a number to the nearest integer or to the nearest multiple of significance.' },
                { name: 'char', description: 'Returns the character specified by the code number.' },
                { name: 'choose', description: 'Chooses a value from a list of values.' },
                { name: 'code', description: 'Returns a numeric code for the first character in a text string.' },
                { name: 'column', description: 'Returns the column number of a reference.' },
                { name: 'columns', description: 'Returns the number of columns in a reference.' },
                { name: 'concatenate', description: 'Joins several text items into one text item.' },
                { name: 'cos', description: 'Returns the cosine of a number.' },
                { name: 'count', description: 'Counts how many numbers are in the list of arguments.' },
                { name: 'counta', description: 'Counts how many values are in the list of arguments.' },
                { name: 'countblank', description: 'Counts the number of blank cells within a range.' },
                { name: 'countif', description: 'Counts the number of cells within a range that meet the given criteria.' },
                { name: 'countifs', description: 'Counts the number of cells within a range that meet multiple criteria.' },
                { name: 'date', description: 'Returns the serial number of a particular date.' },
                { name: 'datedif', description: 'Calculates the number of days, months, or years between two dates.' },
                { name: 'day', description: 'Converts a serial number to a day of the month.' },
                { name: 'dcount', description: 'Counts the cells that contain numbers in a database.' },
                { name: 'exp', description: 'Returns e raised to the power of a given number.' },
                { name: 'false', description: 'Returns the logical value FALSE.' },
                { name: 'find', description: 'Finds one text value within another (case-sensitive).' },
                { name: 'floor', description: 'Rounds a number down, toward zero.' },
                { name: 'hlookup', description: 'Looks in the top row of an array and returns the value of the indicated cell.' },
                { name: 'hour', description: 'Converts a serial number to an hour.' },
                { name: 'if', description: 'Specifies a logical test to perform.' },
                { name: 'index', description: 'Uses an index to choose a value from a reference.' },
                { name: 'left', description: 'Returns the leftmost characters from a text value.' },
                { name: 'len', description: 'Returns the number of characters in a text string.' },
                { name: 'ln', description: 'Returns the natural logarithm of a number.' },
                { name: 'lower', description: 'Converts text to lowercase.' },
                { name: 'max', description: 'Returns the maximum value in a list of arguments.' },
                { name: 'mid', description: 'Returns a specific number of characters from a text string starting at the position you specify.' },
                { name: 'min', description: 'Returns the minimum value in a list of arguments.' },
                { name: 'mod', description: 'Returns the remainder from division.' },
                { name: 'month', description: 'Converts a serial number to a month.' },
                { name: 'not', description: 'Reverses the logic of its argument.' },
                { name: 'now', description: 'Returns the serial number of the current date and time.' },
                { name: 'or', description: 'Returns TRUE if any argument is TRUE.' },
                { name: 'pi', description: 'Returns the value of pi.' },
                { name: 'power', description: 'Returns the result of a number raised to a power.' },
                { name: 'product', description: 'Multiplies its arguments.' },
                { name: 'proper', description: 'Capitalizes the first letter in each word of a text value.' },
                { name: 'rand', description: 'Returns a random number between 0 and 1.' },
                { name: 'rank', description: 'Returns the rank of a number in a list of numbers.' },
                { name: 'rate', description: 'Returns the interest rate per period of an annuity.' },
                { name: 'replace', description: 'Replaces characters within text.' },
                { name: 'rept', description: 'Repeats text a given number of times.' },
                { name: 'right', description: 'Returns the rightmost characters from a text value.' },
                { name: 'round', description: 'Rounds a number to a specified number of digits.' },
                { name: 'rounddown', description: 'Rounds a number down, toward zero.' },
                { name: 'roundup', description: 'Rounds a number up, away from zero.' },
                { name: 'row', description: 'Returns the row number of a reference.' },
                { name: 'rows', description: 'Returns the number of rows in a reference.' },
                { name: 'search', description: 'Finds one text value within another (not case-sensitive).' },
                { name: 'sin', description: 'Returns the sine of the given angle.' },
                { name: 'sqrt', description: 'Returns a positive square root.' },
                { name: 'stdev', description: 'Estimates standard deviation based on a sample.' },
                { name: 'stdevp', description: 'Calculates standard deviation based on the entire population.' },
                { name: 'substitute', description: 'Substitutes new text for old text in a text string.' },
                { name: 'subtotal', description: 'Returns a subtotal in a list or database.' },
                { name: 'sum', description: 'Adds its arguments.' },
                { name: 'sumif', description: 'Adds the cells specified by a given criteria.' },
                { name: 'sumifs', description: 'Adds the cells in a range that meet multiple criteria.' },
                { name: 'tan', description: 'Returns the tangent of a number.' },
                { name: 'text', description: 'Formats a number and converts it to text.' },
                { name: 'time', description: 'Returns the serial number of a particular time.' },
                { name: 'today', description: 'Returns the serial number of today\'s date.' },
                { name: 'trim', description: 'Removes spaces from text.' },
                { name: 'true', description: 'Returns the logical value TRUE.' },
                { name: 'trunc', description: 'Truncates a number to an integer.' },
                { name: 'upper', description: 'Converts text to uppercase.' },
                { name: 'value', description: 'Converts a text argument to a number.' },
                { name: 'var', description: 'Estimates variance based on a sample.' },
                { name: 'varp', description: 'Calculates variance based on the entire population.' },
                { name: 'year', description: 'Converts a serial number to a year.' },
            ];
            /**
             * Defines the @see:FlexSheet control.
             *
             * The @see:FlexSheet control extends the @see:FlexGrid control to provide Excel-like
             * features such as a calculation engine, multiple sheets, undo/redo, and
             * XLSX import/export.
             */
            var FlexSheet = (function (_super) {
                __extends(FlexSheet, _super);
                /**
                 * Initializes a new instance of the @see:FlexSheet class.
                 *
                 * @param element The DOM element that will host the control, or a jQuery selector (e.g. '#theCtrl').
                 * @param options JavaScript object containing initialization data for the control.
                 */
                function FlexSheet(element, options) {
                    _super.call(this, element, options);
                    this._selectedSheetIndex = -1;
                    this._columnHeaderClicked = false;
                    this._addingSheet = false;
                    this._mouseMoveHdl = this._mouseMove.bind(this);
                    this._clickHdl = this._click.bind(this);
                    this._touchStartHdl = this._touchStart.bind(this);
                    this._touchEndHdl = this._touchEnd.bind(this);
                    this._isClicking = false;
                    /**
                     * Occurs when current sheet index changed.
                     */
                    this.selectedSheetChanged = new wijmo.Event();
                    /**
                     * Occurs when dragging the rows or the columns of the <b>FlexSheet</b>.
                     */
                    this.draggingRowColumn = new wijmo.Event();
                    /**
                     * Occurs when dropping the rows or the columns of the <b>FlexSheet</b>.
                     */
                    this.droppingRowColumn = new wijmo.Event();
                    /**
                     * Occurs after the @see:FlexSheet loads the @see:Workbook instance
                     */
                    this.loaded = new wijmo.Event();
                    /**
                     * Occurs when the @see:FlexSheet meets the unknown formula.
                     */
                    this.unknownFunction = new wijmo.Event();
                    /**
                     * Occurs when the @see:FlexSheet is cleared.
                     */
                    this.sheetCleared = new wijmo.Event();
                    this['_eCt'].style.backgroundColor = 'white';
                    // We will use the native scrollbar of the flexgrid instead of the custom scrollbar of flexsheet (TFS 121971)
                    //this['_root'].style.overflowX = 'hidden';
                    wijmo.addClass(this.hostElement, 'wj-flexsheet');
                    // Set the default font to Arial of the FlexSheet control (TFS 127769) 
                    wijmo.setCss(this.hostElement, {
                        fontFamily: 'Arial'
                    });
                    this['_cf'] = new sheet_1._FlexSheetCellFactory();
                    // initialize the splitter, the sheet tab and the hscrollbar.
                    this._init();
                    this.showSort = false;
                    this.allowSorting = false;
                    this.showGroups = false;
                    this.showMarquee = true;
                    this.showSelectedHeaders = grid_1.HeadersVisibility.All;
                    this.allowResizing = grid_1.AllowResizing.Both;
                    this.allowDragging = grid_1.AllowDragging.None;
                }
                Object.defineProperty(FlexSheet.prototype, "sheets", {
                    /**
                     * Gets the collection of @see:Sheet objects representing workbook sheets.
                     */
                    get: function () {
                        if (!this._sheets) {
                            this._sheets = new sheet_1.SheetCollection();
                            this._sheets.selectedSheetChanged.addHandler(this._selectedSheetChange, this);
                            this._sheets.collectionChanged.addHandler(this._sourceChange, this);
                            this._sheets.sheetVisibleChanged.addHandler(this._sheetVisibleChange, this);
                            this._sheets.sheetCleared.addHandler(this.onSheetCleared, this);
                        }
                        return this._sheets;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexSheet.prototype, "selectedSheetIndex", {
                    /**
                     * Gets or sets the index of the current sheet in the @see:FlexSheet.
                     */
                    get: function () {
                        return this._selectedSheetIndex;
                    },
                    set: function (value) {
                        if (value !== this._selectedSheetIndex) {
                            this._showSheet(value);
                            this._sheets.selectedIndex = value;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexSheet.prototype, "selectedSheet", {
                    /**
                     * Gets the current @see:Sheet in the <b>FlexSheet</b>.
                     */
                    get: function () {
                        return this._sheets[this._selectedSheetIndex];
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexSheet.prototype, "isFunctionListOpen", {
                    /**
                     * Gets a value indicating whether the function list is opened.
                     */
                    get: function () {
                        return this._functionListHost && this._functionListHost.style.display !== 'none';
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexSheet.prototype, "isTabHolderVisible", {
                    /**
                     * Gets or sets a value indicating whether the TabHolder is visible.
                     */
                    get: function () {
                        return this._tabHolder.visible;
                    },
                    set: function (value) {
                        if (value !== this._tabHolder.visible) {
                            if (value) {
                                this._divContainer.style.height = (this._divContainer.parentElement.clientHeight - this._tabHolder.getSheetBlanketSize()) + 'px';
                            }
                            else {
                                this._divContainer.style.height = this._divContainer.parentElement.clientHeight + 'px';
                            }
                            this._tabHolder.visible = value;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexSheet.prototype, "undoStack", {
                    /**
                     * Gets the @see:UndoStack instance that controls undo and redo operations of the <b>FlexSheet</b>.
                     */
                    get: function () {
                        return this._undoStack;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FlexSheet.prototype, "sortManager", {
                    /**
                     * Gets the @see:SortManager instance that controls <b>FlexSheet</b> sorting.
                     */
                    get: function () {
                        return this._sortManager;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Raises the currentSheetChanged event.
                 *
                 * @param e @see:PropertyChangedEventArgs that contains the event data.
                 */
                FlexSheet.prototype.onSelectedSheetChanged = function (e) {
                    this._sortManager._refresh();
                    this.selectedSheetChanged.raise(this, e);
                };
                /**
                 * Raises the draggingRowColumn event.
                 */
                FlexSheet.prototype.onDraggingRowColumn = function (e) {
                    this.draggingRowColumn.raise(this, e);
                };
                /**
                 * Raises the droppingRowColumn event.
                 */
                FlexSheet.prototype.onDroppingRowColumn = function () {
                    this.droppingRowColumn.raise(this, new wijmo.EventArgs());
                };
                /**
                 * Raises the loaded event.
                 */
                FlexSheet.prototype.onLoaded = function () {
                    var self = this;
                    if (self._toRefresh) {
                        clearTimeout(self._toRefresh);
                        self._toRefresh = null;
                    }
                    self._toRefresh = setTimeout(function () {
                        self.rows._dirty = true;
                        self.columns._dirty = true;
                        self.invalidate();
                    }, 10);
                    self.loaded.raise(this, new wijmo.EventArgs());
                };
                /**
                 * Raises the unknownFunction event.
                 */
                FlexSheet.prototype.onUnknownFunction = function (e) {
                    this.unknownFunction.raise(this, e);
                };
                /**
                 * Raises the sheetCleared event.
                 */
                FlexSheet.prototype.onSheetCleared = function () {
                    this.sheetCleared.raise(this, new wijmo.EventArgs());
                };
                /**
                 * Overridden to refresh the sheet and the TabHolder.
                 *
                 * @param fullUpdate Whether to update the control layout as well as the content.
                 */
                FlexSheet.prototype.refresh = function (fullUpdate) {
                    if (fullUpdate === void 0) { fullUpdate = true; }
                    this._divContainer.style.height = (this._divContainer.parentElement.clientHeight - (this.isTabHolderVisible ? this._tabHolder.getSheetBlanketSize() : 0)) + 'px';
                    if (!this.preserveSelectedState && !!this.selectedSheet) {
                        this.selectedSheet.selectionRanges.clear();
                        this.selectedSheet.selectionRanges.push(this.selection);
                    }
                    _super.prototype.refresh.call(this, fullUpdate);
                    this._tabHolder.adjustSize();
                };
                /**
                 * Overrides the setCellData function of the base class.
                 *
                 * @param r Index of the row that contains the cell.
                 * @param c Index, name, or binding of the column that contains the cell.
                 * @param value Value to store in the cell.
                 * @param coerce Whether to change the value automatically to match the column's data type.
                 * @return True if the value was stored successfully, false otherwise.
                 */
                FlexSheet.prototype.setCellData = function (r, c, value, coerce) {
                    if (coerce === void 0) { coerce = false; }
                    var isFormula = wijmo.isString(value) && value.length > 1 && value[0] === '=';
                    this._calcEngine._clearExpressionCache();
                    return this.cells.setCellData(r, c, value, coerce && !isFormula);
                };
                /**
                 * Overrides the base class method to take into account the function list.
                 */
                FlexSheet.prototype.containsFocus = function () {
                    return this.isFunctionListOpen || _super.prototype.containsFocus.call(this);
                };
                /**
                 * Add an unbound @see:Sheet to the <b>FlexSheet</b>.
                 *
                 * @param sheetName The name of the Sheet.
                 * @param rows The row count of the Sheet.
                 * @param cols The column count of the Sheet.
                 * @param pos The position in the <b>sheets</b> collection.
                 * @param grid The @see:FlexGrid instance associated with the @see:Sheet. If not specified then new @see:FlexGrid instance
                 * will be created.
                 */
                FlexSheet.prototype.addUnboundSheet = function (sheetName, rows, cols, pos, grid) {
                    var sheet = this._addSheet(sheetName, rows, cols, pos, grid);
                    if (sheet.selectionRanges.length === 0) {
                        // Store current selection in the selection array for multiple selection.
                        sheet.selectionRanges.push(this.selection);
                    }
                    return sheet;
                };
                /**
                 * Add a bound @see:Sheet to the <b>FlexSheet</b>.
                 *
                 * @param sheetName The name of the @see:Sheet.
                 * @param source The items source for the @see:Sheet.
                 * @param pos The position in the <b>sheets</b> collection.
                 * @param grid The @see:FlexGrid instance associated with the @see:Sheet. If not specified then new @see:FlexGrid instance
                 * will be created.
                 */
                FlexSheet.prototype.addBoundSheet = function (sheetName, source, pos, grid) {
                    var sheet = this._addSheet(sheetName, 0, 0, pos, grid);
                    if (source) {
                        sheet.itemsSource = source;
                    }
                    if (sheet.selectionRanges.length === 0) {
                        // Store current selection in the selection array for multiple selection.
                        sheet.selectionRanges.push(this.selection);
                    }
                    return sheet;
                };
                /**
                 * Apply the style to a range of cells.
                 *
                 * @param cellStyle The @see:ICellStyle object to apply.
                 * @param cells An array of @see:CellRange objects to apply the style to. If not specified then
                 * style is applied to the currently selected cells.
                 * @param isPreview Indicates whether the applied style is just for preview.
                 */
                FlexSheet.prototype.applyCellsStyle = function (cellStyle, cells, isPreview) {
                    if (isPreview === void 0) { isPreview = false; }
                    var rowIndex, colIndex, ranges = cells || [this.selection], range, index, cellStyleAction;
                    if (!this.selectedSheet) {
                        return;
                    }
                    // Cancel current applied style.
                    if (!cellStyle && this._cloneStyle) {
                        this.selectedSheet._styledCells = JSON.parse(JSON.stringify(this._cloneStyle));
                        this._cloneStyle = null;
                        this.refresh(false);
                        return;
                    }
                    // Apply cells style for the cell range of the FlexSheet control.
                    if (ranges) {
                        if (!cells && !isPreview) {
                            cellStyleAction = new sheet_1._CellStyleAction(this, this._cloneStyle);
                            this._cloneStyle = null;
                        }
                        else if (isPreview && !this._cloneStyle) {
                            this._cloneStyle = JSON.parse(JSON.stringify(this.selectedSheet._styledCells));
                        }
                        for (index = 0; index < ranges.length; index++) {
                            range = ranges[index];
                            for (rowIndex = range.topRow; rowIndex <= range.bottomRow; rowIndex++) {
                                for (colIndex = range.leftCol; colIndex <= range.rightCol; colIndex++) {
                                    this._applyStyleForCell(rowIndex, colIndex, cellStyle);
                                }
                            }
                        }
                        if (!cells && !isPreview) {
                            cellStyleAction.saveNewState();
                            this._undoStack._addAction(cellStyleAction);
                        }
                    }
                    if (!cells) {
                        this.refresh(false);
                    }
                };
                /**
                 * Freeze or unfreeze the columns and rows of the <b>FlexSheet</b> control.
                 */
                FlexSheet.prototype.freezeAtCursor = function () {
                    var self = this, rowIndex, colIndex, frozenColumns, frozenRows, row, column;
                    if (!self.selectedSheet) {
                        return;
                    }
                    if (self.selection && self.frozenRows === 0 && self.frozenColumns === 0) {
                        // hide rows\cols scrolled above and scrolled left of the view range
                        // so the user can freeze arbitrary parts of the grid 
                        // (not necessarily starting with the first row/column)
                        if (self._ptScrl.y < 0) {
                            for (rowIndex = 0; rowIndex < self.selection.topRow - 1; rowIndex++) {
                                row = self.rows[rowIndex];
                                if (!(row instanceof HeaderRow)) {
                                    if (row._pos + self._ptScrl.y < 0) {
                                        row.visible = false;
                                    }
                                    else {
                                        self.selectedSheet._freezeHiddenRowCnt = rowIndex;
                                        break;
                                    }
                                }
                            }
                        }
                        if (self._ptScrl.x < 0) {
                            for (colIndex = 0; colIndex < self.selection.leftCol - 1; colIndex++) {
                                column = self.columns[colIndex];
                                if (column._pos + self._ptScrl.x < 0) {
                                    self.columns[colIndex].visible = false;
                                }
                                else {
                                    self.selectedSheet._freezeHiddenColumnCnt = colIndex;
                                    break;
                                }
                            }
                        }
                        // freeze
                        frozenColumns = self.selection.leftCol > 0 ? self.selection.leftCol : 0;
                        frozenRows = self.selection.topRow > 0 ? self.selection.topRow : 0;
                    }
                    else {
                        // unhide
                        for (rowIndex = 0; rowIndex < self.frozenRows - 1; rowIndex++) {
                            self.rows[rowIndex].visible = true;
                        }
                        for (colIndex = 0; colIndex < self.frozenColumns - 1; colIndex++) {
                            self.columns[colIndex].visible = true;
                        }
                        // Apply the filter of the FlexSheet again after resetting the visible of the rows. (TFS 204887)
                        self._filter.apply();
                        // unfreeze
                        frozenColumns = 0;
                        frozenRows = 0;
                        self.selectedSheet._freezeHiddenRowCnt = 0;
                        self.selectedSheet._freezeHiddenColumnCnt = 0;
                    }
                    // Synch to the grid of current sheet.
                    self.frozenRows = self.selectedSheet.grid.frozenRows = frozenRows;
                    self.frozenColumns = self.selectedSheet.grid.frozenColumns = frozenColumns;
                    setTimeout(function () {
                        self.rows._dirty = true;
                        self.columns._dirty = true;
                        self.invalidate();
                        self.scrollIntoView(self.selection.topRow, self.selection.leftCol);
                    }, 10);
                };
                /**
                 * Show the filter editor.
                 */
                FlexSheet.prototype.showColumnFilter = function () {
                    var selectedCol = this.selection.col > 0 ? this.selection.col : 0;
                    if (this.columns.length > 0) {
                        this._filter.editColumnFilter(this.columns[selectedCol]);
                    }
                };
                /**
                 * Clears the content of the <b>FlexSheet</b> control.
                 */
                FlexSheet.prototype.clear = function () {
                    this.selection = new grid_1.CellRange();
                    this.sheets.clear();
                    this._selectedSheetIndex = -1;
                    this.columns.clear();
                    this.rows.clear();
                    this.columnHeaders.columns.clear();
                    this.rowHeaders.rows.clear();
                    this._undoStack.clear();
                    this._ptScrl = new wijmo.Point();
                    this._clearCalcEngine();
                    this.addUnboundSheet();
                };
                /**
                 * Gets the @see:IFormatState object describing formatting of the selected cells.
                 *
                 * @return The @see:IFormatState object containing formatting properties.
                 */
                FlexSheet.prototype.getSelectionFormatState = function () {
                    var rowIndex, colIndex, rowCount = this.rows.length, columnCount = this.columns.length, formatState = {
                        isBold: false,
                        isItalic: false,
                        isUnderline: false,
                        textAlign: 'left',
                        isMergedCell: false
                    };
                    // If there is no rows or columns in the flexsheet, we should return the default format state (TFS 122628)
                    if (rowCount === 0 || columnCount === 0) {
                        return formatState;
                    }
                    // Check the selected cells
                    if (this.selection) {
                        if (this.selection.row >= rowCount || this.selection.row2 >= rowCount
                            || this.selection.col >= columnCount || this.selection.col2 >= columnCount) {
                            return formatState;
                        }
                        for (rowIndex = this.selection.topRow; rowIndex <= this.selection.bottomRow; rowIndex++) {
                            for (colIndex = this.selection.leftCol; colIndex <= this.selection.rightCol; colIndex++) {
                                this._checkCellFormat(rowIndex, colIndex, formatState);
                            }
                        }
                    }
                    return formatState;
                };
                /**
                 * Inserts rows in the current @see:Sheet of the <b>FlexSheet</b> control.
                 *
                 * @param index The position where new rows should be added. If not specified then rows will be added
                 * before the first row of the current selection.
                 * @param count The numbers of rows to add. If not specified then one row will be added.
                 */
                FlexSheet.prototype.insertRows = function (index, count) {
                    var rowIndex = wijmo.isNumber(index) && index >= 0 ? index :
                        (this.selection && this.selection.topRow > -1) ? this.selection.topRow : 0, rowCount = wijmo.isNumber(count) ? count : 1, insRowAction = new sheet_1._RowsChangedAction(this), currentRow = this.rows[rowIndex], i;
                    if (!this.selectedSheet) {
                        return;
                    }
                    // We disable inserting rows manually for the bound sheet.
                    // Because it will cause the synch issue between the itemsSource and the sheet.
                    if (this.itemsSource) {
                        return;
                    }
                    this._clearCalcEngine();
                    this.finishEditing();
                    // The header row of the bound sheet should always in the top of the flexsheet.
                    // The new should be added below the header row. (TFS #124391.)
                    if (rowIndex === 0 && currentRow && currentRow.constructor === HeaderRow) {
                        rowIndex = 1;
                    }
                    // We should update styled cells hash before adding rows.
                    this._updateCellsForUpdatingRow(this.rows.length, rowIndex, rowCount);
                    // Update the affected formulas.
                    insRowAction._affecedFormulas = this._updateAffectedFormula(rowIndex, rowCount, true, true);
                    this.rows.beginUpdate();
                    for (i = 0; i < rowCount; i++) {
                        this.rows.insert(rowIndex, new grid_1.Row());
                    }
                    this.rows.endUpdate();
                    if (!this.selection || this.selection.row === -1 || this.selection.col === -1) {
                        this.selection = new grid_1.CellRange(0, 0);
                    }
                    // Synch with current sheet.
                    this._copyTo(this.selectedSheet);
                    insRowAction.saveNewState();
                    this._undoStack._addAction(insRowAction);
                };
                /**
                 * Deletes rows from the current @see:Sheet of the <b>FlexSheet</b> control.
                 *
                 * @param index The starting index of the deleting rows. If not specified then rows will be deleted
                 * starting from the first row of the current selection.
                 * @param count The numbers of rows to delete. If not specified then one row will be deleted.
                 */
                FlexSheet.prototype.deleteRows = function (index, count) {
                    var rowCount = wijmo.isNumber(count) && count >= 0 ? count :
                        (this.selection && this.selection.topRow > -1) ? this.selection.bottomRow - this.selection.topRow + 1 : 1, firstRowIndex = wijmo.isNumber(index) && index >= 0 ? index :
                        (this.selection && this.selection.topRow > -1) ? this.selection.topRow : -1, lastRowIndex = wijmo.isNumber(index) && index >= 0 ? index + rowCount - 1 :
                        (this.selection && this.selection.topRow > -1) ? this.selection.bottomRow : -1, delRowAction = new sheet_1._RowsChangedAction(this), rowDeleted = false, deletingRow, deletingRowIndex, currentRowsLength;
                    if (!this.selectedSheet) {
                        return;
                    }
                    // We disable deleting rows manually for the bound sheet.
                    // Because it will cause the synch issue between the itemsSource and the sheet.
                    if (this.itemsSource) {
                        return;
                    }
                    this._clearCalcEngine();
                    this.finishEditing();
                    if (firstRowIndex > -1 && lastRowIndex > -1) {
                        // We should update styled cells hash before deleting rows.
                        this._updateCellsForUpdatingRow(this.rows.length, firstRowIndex, rowCount, true);
                        // Update the affected formulas.
                        delRowAction._affecedFormulas = this._updateAffectedFormula(lastRowIndex, lastRowIndex - firstRowIndex + 1, false, true);
                        this.rows.beginUpdate();
                        for (; lastRowIndex >= firstRowIndex; lastRowIndex--) {
                            deletingRow = this.rows[lastRowIndex];
                            // The header row of the bound sheet is a specific row.
                            // So it hasn't to be deleted manually.
                            if (deletingRow && deletingRow.constructor === HeaderRow) {
                                continue;
                            }
                            // if we remove the rows in the bound sheet,
                            // we need remove the row related item in the itemsSource of the flexsheet. (TFS 121651)
                            if (deletingRow.dataItem && this.collectionView) {
                                this.collectionView.beginUpdate();
                                deletingRowIndex = this._getCvIndex(lastRowIndex);
                                if (deletingRowIndex > -1) {
                                    this.itemsSource.splice(lastRowIndex - 1, 1);
                                }
                                this.collectionView.endUpdate();
                            }
                            else {
                                this.rows.removeAt(lastRowIndex);
                            }
                            rowDeleted = true;
                        }
                        this.rows.endUpdate();
                        currentRowsLength = this.rows.length;
                        if (currentRowsLength === 0) {
                            this.selectedSheet.selectionRanges.clear();
                            this.select(new grid_1.CellRange());
                        }
                        else if (lastRowIndex === currentRowsLength - 1) {
                            this.select(new grid_1.CellRange(lastRowIndex, 0, lastRowIndex, this.columns.length - 1));
                        }
                        else {
                            this.select(new grid_1.CellRange(this.selection.topRow, this.selection.col, this.selection.topRow, this.selection.col2));
                        }
                        // Synch with current sheet.
                        this._copyTo(this.selectedSheet);
                        if (rowDeleted) {
                            delRowAction.saveNewState();
                            this._undoStack._addAction(delRowAction);
                        }
                    }
                };
                /**
                 * Inserts columns in the current @see:Sheet of the <b>FlexSheet</b> control.
                 *
                 * @param index The position where new columns should be added. If not specified then columns will be added
                 * before the left column of the current selection.
                 * @param count The numbers of columns to add. If not specified then one column will be added.
                 */
                FlexSheet.prototype.insertColumns = function (index, count) {
                    var columnIndex = wijmo.isNumber(index) && index >= 0 ? index :
                        this.selection && this.selection.leftCol > -1 ? this.selection.leftCol : 0, colCount = wijmo.isNumber(count) ? count : 1, insColumnAction = new sheet_1._ColumnsChangedAction(this), i;
                    if (!this.selectedSheet) {
                        return;
                    }
                    // We disable inserting columns manually for the bound sheet.
                    // Because it will cause the synch issue between the itemsSource and the sheet.
                    if (this.itemsSource) {
                        return;
                    }
                    this._clearCalcEngine();
                    this.finishEditing();
                    // We should update styled cells hash before adding columns.
                    this._updateCellsForUpdatingColumn(this.columns.length, columnIndex, colCount);
                    // Update the affected formulas.
                    insColumnAction._affectedFormulas = this._updateAffectedFormula(columnIndex, colCount, true, false);
                    this.columns.beginUpdate();
                    for (i = 0; i < colCount; i++) {
                        this.columns.insert(columnIndex, new grid_1.Column());
                    }
                    this.columns.endUpdate();
                    if (!this.selection || this.selection.row === -1 || this.selection.col === -1) {
                        this.selection = new grid_1.CellRange(0, 0);
                    }
                    // Synch with current sheet.
                    this._copyTo(this.selectedSheet);
                    insColumnAction.saveNewState();
                    this._undoStack._addAction(insColumnAction);
                };
                /**
                 * Deletes columns from the current @see:Sheet of the <b>FlexSheet</b> control.
                 *
                 * @param index The starting index of the deleting columns. If not specified then columns will be deleted
                 * starting from the first column of the current selection.
                 * @param count The numbers of columns to delete. If not specified then one column will be deleted.
                 */
                FlexSheet.prototype.deleteColumns = function (index, count) {
                    var currentColumnLength, colCount = wijmo.isNumber(count) && count >= 0 ? count :
                        (this.selection && this.selection.leftCol > -1) ? this.selection.rightCol - this.selection.leftCol + 1 : 1, firstColIndex = wijmo.isNumber(index) && index >= 0 ? index :
                        (this.selection && this.selection.leftCol > -1) ? this.selection.leftCol : -1, lastColIndex = wijmo.isNumber(index) && index >= 0 ? index + colCount - 1 :
                        (this.selection && this.selection.leftCol > -1) ? this.selection.rightCol : -1, delColumnAction = new sheet_1._ColumnsChangedAction(this);
                    if (!this.selectedSheet) {
                        return;
                    }
                    // We disable deleting columns manually for the bound sheet.
                    // Because it will cause the synch issue between the itemsSource and the sheet.
                    if (this.itemsSource) {
                        return;
                    }
                    this._clearCalcEngine();
                    this.finishEditing();
                    if (firstColIndex > -1 && lastColIndex > -1) {
                        // We should update styled cells hash before deleting columns.
                        this._updateCellsForUpdatingColumn(this.columns.length, firstColIndex, colCount, true);
                        // Update the affected formulas.
                        delColumnAction._affectedFormulas = this._updateAffectedFormula(lastColIndex, lastColIndex - firstColIndex + 1, false, false);
                        this.columns.beginUpdate();
                        for (; lastColIndex >= firstColIndex; lastColIndex--) {
                            this.columns.removeAt(lastColIndex);
                            this._sortManager.deleteSortLevel(lastColIndex);
                        }
                        this.columns.endUpdate();
                        this._sortManager.commitSort(false);
                        currentColumnLength = this.columns.length;
                        if (currentColumnLength === 0) {
                            this.selectedSheet.selectionRanges.clear();
                            this.select(new grid_1.CellRange());
                        }
                        else if (lastColIndex === currentColumnLength - 1) {
                            this.select(new grid_1.CellRange(0, lastColIndex, this.rows.length - 1, lastColIndex));
                        }
                        else {
                            this.select(new grid_1.CellRange(this.selection.row, this.selection.leftCol, this.selection.row2, this.selection.leftCol));
                        }
                        // Synch with current sheet.
                        this._copyTo(this.selectedSheet);
                        delColumnAction.saveNewState();
                        this._undoStack._addAction(delColumnAction);
                    }
                };
                /**
                 * Merges the selected @see:CellRange into one cell.
                 *
                 * @param cells The @see:CellRange to merge.
                 */
                FlexSheet.prototype.mergeRange = function (cells) {
                    var rowIndex, colIndex, cellIndex, mergedRange, range = cells || this.selection, mergedCellExists = false, cellMergeAction;
                    if (!this.selectedSheet) {
                        return;
                    }
                    if (range) {
                        if (range.rowSpan === 1 && range.columnSpan === 1) {
                            return;
                        }
                        if (!cells) {
                            cellMergeAction = new sheet_1._CellMergeAction(this);
                        }
                        if (!this._resetMergedRange(range)) {
                            for (rowIndex = range.topRow; rowIndex <= range.bottomRow; rowIndex++) {
                                for (colIndex = range.leftCol; colIndex <= range.rightCol; colIndex++) {
                                    cellIndex = rowIndex * this.columns.length + colIndex;
                                    this.selectedSheet._mergedRanges[cellIndex] = new grid_1.CellRange(range.topRow, range.leftCol, range.bottomRow, range.rightCol);
                                }
                            }
                        }
                        if (!cells) {
                            cellMergeAction.saveNewState();
                            this._undoStack._addAction(cellMergeAction);
                        }
                    }
                    if (!cells) {
                        this.refresh();
                    }
                };
                /**
                 * Gets a @see:CellRange that specifies the merged extent of a cell
                 * in a @see:GridPanel.
                 * This method overrides the getMergedRange method of its parent class FlexGrid
                 *
                 * @param panel @see:GridPanel that contains the range.
                 * @param r Index of the row that contains the cell.
                 * @param c Index of the column that contains the cell.
                 * @param clip Whether to clip the merged range to the grid's current view range.
                 * @return A @see:CellRange that specifies the merged range, or null if the cell is not merged.
                 */
                FlexSheet.prototype.getMergedRange = function (panel, r, c, clip) {
                    if (clip === void 0) { clip = true; }
                    var cellIndex = r * this.columns.length + c, mergedRange = this.selectedSheet ? this.selectedSheet._mergedRanges[cellIndex] : null, topRow, bottonRow, leftCol, rightCol;
                    if (panel === this.cells && mergedRange) {
                        // Adjust the merged cell with the frozen pane.
                        if (!mergedRange.isSingleCell && (this.frozenRows > 0 || this.frozenColumns > 0)
                            && ((mergedRange.topRow < this.frozenRows && mergedRange.bottomRow >= this.frozenRows)
                                || (mergedRange.leftCol < this.frozenColumns && mergedRange.rightCol >= this.frozenColumns))) {
                            topRow = mergedRange.topRow;
                            bottonRow = mergedRange.bottomRow;
                            leftCol = mergedRange.leftCol;
                            rightCol = mergedRange.rightCol;
                            if (r >= this.frozenRows && mergedRange.topRow < this.frozenRows) {
                                topRow = this.frozenRows;
                            }
                            if (r < this.frozenRows && mergedRange.bottomRow >= this.frozenRows) {
                                bottonRow = this.frozenRows - 1;
                            }
                            if (bottonRow >= this.rows.length) {
                                bottonRow = this.rows.length - 1;
                            }
                            if (c >= this.frozenColumns && mergedRange.leftCol < this.frozenColumns) {
                                leftCol = this.frozenColumns;
                            }
                            if (c < this.frozenColumns && mergedRange.rightCol >= this.frozenColumns) {
                                rightCol = this.frozenColumns - 1;
                            }
                            if (rightCol >= this.columns.length) {
                                rightCol = this.columns.length - 1;
                            }
                            return new grid_1.CellRange(topRow, leftCol, bottonRow, rightCol);
                        }
                        if (mergedRange.bottomRow >= this.rows.length) {
                            return new grid_1.CellRange(mergedRange.topRow, mergedRange.leftCol, this.rows.length - 1, mergedRange.rightCol);
                        }
                        if (mergedRange.rightCol >= this.columns.length) {
                            return new grid_1.CellRange(mergedRange.topRow, mergedRange.leftCol, mergedRange.bottomRow, this.columns.length - 1);
                        }
                        return mergedRange.clone();
                    }
                    // Only when there are columns in current sheet, it will get the merge range from parent flexgrid. (TFS #142348, #143544)
                    if (c >= 0 && this.columns && this.columns.length > c && r >= 0 && this.rows && this.rows.length > c) {
                        return _super.prototype.getMergedRange.call(this, panel, r, c, clip);
                    }
                    return null;
                };
                /**
                 * Evaluates a formula.
                 *
                 * @see:FlexSheet formulas follow the Excel syntax, including a large subset of the
                 * functions supported by Excel. A complete list of the functions supported by
                 * @see:FlexSheet can be found here:
                 * <a href="static/FlexSheetFunctions.html">FlexSheet Functions</a>.
                 *
                 * @param formula The formula to evaluate. The formula may start with an optional equals sign ('=').
                 * @param format If specified, defines the .Net format that will be applied to the evaluated value.
                 * @param sheet The @see:Sheet whose data will be used for evaluation.
                 *              If not specified then the current sheet is used.
                 */
                FlexSheet.prototype.evaluate = function (formula, format, sheet) {
                    return this._evaluate(formula, format, sheet);
                };
                /**
                 * Gets the evaluated cell value.
                 *
                 * Unlike the <b>getCellData</b> method that returns a raw data that can be a value or a formula, the <b>getCellValue</b>
                 * method always returns an evaluated value, that is if the cell contains a formula then it will be evaluated first and the
                 * resulting value will be returned.
                 *
                 * @param rowIndex The row index of the cell.
                 * @param colIndex The column index of the cell.
                 * @param formatted Indicates whether to return an original or a formatted value of the cell.
                 * @param sheet The @see:Sheet whose value to evaluate. If not specified then the data from current sheet
                 * is used.
                 */
                FlexSheet.prototype.getCellValue = function (rowIndex, colIndex, formatted, sheet) {
                    if (formatted === void 0) { formatted = false; }
                    var col = this.columns[colIndex], cellIndex = rowIndex * this.columns.length + colIndex, styleInfo, format, cellVal;
                    styleInfo = sheet ? sheet._styledCells[cellIndex] : (this.selectedSheet ? this.selectedSheet._styledCells[cellIndex] : null);
                    format = styleInfo && styleInfo.format ? styleInfo.format : '';
                    cellVal = sheet ? sheet.grid.getCellData(rowIndex, colIndex, false) : this.getCellData(rowIndex, colIndex, false);
                    if (wijmo.isString(cellVal) && cellVal[0] === '=') {
                        cellVal = this._evaluate(cellVal, formatted ? format : '', sheet, rowIndex, colIndex);
                    }
                    if (wijmo.isPrimitive(cellVal)) {
                        if (formatted) {
                            if (col.dataMap) {
                                cellVal = col.dataMap.getDisplayValue(cellVal);
                            }
                            cellVal = cellVal != null ? wijmo.Globalize.format(cellVal, format || col.format) : '';
                        }
                    }
                    else if (cellVal) {
                        if (formatted) {
                            cellVal = wijmo.Globalize.format(cellVal.value, format || cellVal.format || col.format);
                        }
                        else {
                            cellVal = cellVal.value;
                        }
                    }
                    return cellVal == null ? '' : cellVal;
                };
                /**
                 * Open the function list.
                 *
                 * @param target The DOM element that toggle the function list.
                 */
                FlexSheet.prototype.showFunctionList = function (target) {
                    var self = this, functionOffset = self._cumulativeOffset(target), rootOffset = self._cumulativeOffset(self['_root']), offsetTop, offsetLeft;
                    self._functionTarget = wijmo.tryCast(target, HTMLInputElement);
                    if (self._functionTarget && self._functionTarget.value && self._functionTarget.value[0] === '=') {
                        self._functionList._cv.filter = function (item) {
                            var text = item['actualvalue'].toLowerCase(), searchIndex = self._getCurrentFormulaIndex(self._functionTarget.value), searchText;
                            if (searchIndex === -1) {
                                searchIndex = 0;
                            }
                            searchText = self._functionTarget.value.substr(searchIndex + 1).trim().toLowerCase();
                            if ((searchText.length > 0 && text.indexOf(searchText) === 0) || self._functionTarget.value === '=') {
                                return true;
                            }
                            return false;
                        };
                        self._functionList.selectedIndex = 0;
                        offsetTop = functionOffset.y + target.clientHeight + 2 + (wijmo.hasClass(target, 'wj-grid-editor') ? this._ptScrl.y : 0);
                        offsetLeft = functionOffset.x + (wijmo.hasClass(target, 'wj-grid-editor') ? this._ptScrl.x : 0);
                        wijmo.setCss(self._functionListHost, {
                            height: self._functionList._cv.items.length > 5 ? '218px' : 'auto',
                            display: self._functionList._cv.items.length > 0 ? 'block' : 'none',
                            top: '',
                            left: ''
                        });
                        self._functionListHost.scrollTop = 0;
                        if (self._functionListHost.offsetHeight + offsetTop > rootOffset.y + self['_root'].offsetHeight) {
                            offsetTop = offsetTop - target.clientHeight - self._functionListHost.offsetHeight - 5;
                        }
                        else {
                            offsetTop += 5;
                        }
                        if (self._functionListHost.offsetWidth + offsetLeft > rootOffset.x + self['_root'].offsetWidth) {
                            offsetLeft = rootOffset.x + self['_root'].offsetWidth - self._functionListHost.offsetWidth;
                        }
                        wijmo.setCss(self._functionListHost, {
                            top: offsetTop,
                            left: offsetLeft
                        });
                    }
                    else {
                        self.hideFunctionList();
                    }
                };
                /**
                 * Close the function list.
                 */
                FlexSheet.prototype.hideFunctionList = function () {
                    this._functionListHost.style.display = 'none';
                };
                /**
                 * Select previous function in the function list.
                 */
                FlexSheet.prototype.selectPreviousFunction = function () {
                    var index = this._functionList.selectedIndex;
                    if (index > 0) {
                        this._functionList.selectedIndex--;
                    }
                };
                /**
                 * Select next function in the function list.
                 */
                FlexSheet.prototype.selectNextFunction = function () {
                    var index = this._functionList.selectedIndex;
                    if (index < this._functionList.itemsSource.length) {
                        this._functionList.selectedIndex++;
                    }
                };
                /**
                 * Inserts the selected function from the function list to the cell value editor.
                 */
                FlexSheet.prototype.applyFunctionToCell = function () {
                    var self = this, currentFormulaIndex;
                    if (self._functionTarget) {
                        currentFormulaIndex = self._getCurrentFormulaIndex(self._functionTarget.value);
                        if (currentFormulaIndex === -1) {
                            currentFormulaIndex = self._functionTarget.value.indexOf('=');
                        }
                        else {
                            currentFormulaIndex += 1;
                        }
                        self._functionTarget.value = self._functionTarget.value.substring(0, currentFormulaIndex) + self._functionList.selectedValue + '(';
                        if (self._functionTarget.value[0] !== '=') {
                            self._functionTarget.value = '=' + self._functionTarget.value;
                        }
                        self._functionTarget.focus();
                        self.hideFunctionList();
                    }
                };
                /**
                 * Saves the <b>FlexSheet</b> to xlsx file.
                 *
                 * For example:
                 * <pre>// This sample exports FlexSheet content to an xlsx
                 * // click.
                 * &nbsp;
                 * // HTML
                 * &lt;button
                 *     onclick="saveXlsx('FlexSheet.xlsx')"&gt;
                 *     Save
                 * &lt;/button&gt;
                 * &nbsp;
                 * // JavaScript
                 * function saveXlsx(fileName) {
                 *     // Save the flexGrid to xlsx file.
                 *     flexsheet.save(fileName);
                 * }</pre>
                 *
                 * @param fileName Name of the file that will be generated.
                 * @return A workbook instance containing the generated xlsx file content.
                 */
                FlexSheet.prototype.save = function (fileName) {
                    var workbook = this._saveToWorkbook();
                    if (fileName) {
                        workbook.save(fileName);
                    }
                    return workbook;
                };
                /*
                 * Save the <b>FlexSheet</b> to Workbook Object Model represented by the @see:IWorkbook interface.
                 *
                 * @return The @see:IWorkbook instance representing export results.
                 */
                FlexSheet.prototype.saveToWorkbookOM = function () {
                    var workbook = this._saveToWorkbook();
                    return workbook._serialize();
                };
                /**
                 * Loads the workbook into the <b>FlexSheet</b>.
                 *
                 * For example:
                 * <pre>// This sample opens an xlsx file chosen via Open File
                 * // dialog and fills FlexSheet
                 * &nbsp;
                 * // HTML
                 * &lt;input type="file"
                 *     id="importFile"
                 *     accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                 * /&gt;
                 * &lt;div id="flexHost"&gt;&lt;/&gt;
                 * &nbsp;
                 * // JavaScript
                 * var flexSheet = new wijmo.grid.FlexSheet("#flexHost"),
                 *     importFile = document.getElementById('importFile');
                 * &nbsp;
                 * importFile.addEventListener('change', function () {
                 *     loadWorkbook();
                 * });
                 * &nbsp;
                 * function loadWorkbook() {
                 *     var reader,
                 *         file = importFile.files[0];
                 *     if (file) {
                 *         reader = new FileReader();
                 *         reader.onload = function (e) {
                 *             flexSheet.load(reader.result);
                 *         };
                 *         reader.readAsArrayBuffer(file);
                 *     }
                 * }</pre>
                 *
                 * @param workbook An Workbook instance or a Blob instance or a base 64 stirng or an ArrayBuffer containing xlsx file content.
                 */
                FlexSheet.prototype.load = function (workbook) {
                    var workbookInstance, reader, self = this;
                    if (workbook instanceof Blob) {
                        reader = new FileReader();
                        reader.onload = function () {
                            var fileContent = reader.result;
                            fileContent = wijmo.xlsx.Workbook._base64EncArr(new Uint8Array(fileContent));
                            workbookInstance = new wijmo.xlsx.Workbook();
                            workbookInstance.load(fileContent);
                            self._loadFromWorkbook(workbookInstance);
                        };
                        reader.readAsArrayBuffer(workbook);
                    }
                    else if (workbook instanceof wijmo.xlsx.Workbook) {
                        self._loadFromWorkbook(workbook);
                    }
                    else {
                        if (workbook instanceof ArrayBuffer) {
                            workbook = wijmo.xlsx.Workbook._base64EncArr(new Uint8Array(workbook));
                        }
                        else if (!wijmo.isString(workbook)) {
                            throw 'Invalid workbook.';
                        }
                        workbookInstance = new wijmo.xlsx.Workbook();
                        workbookInstance.load(workbook);
                        self._loadFromWorkbook(workbookInstance);
                    }
                };
                /*
                 * Load the Workbook Object Model instance into the <b>FlexSheet</b>.
                 *
                 * @param workbook The Workbook Object Model instance to load data from.
                 */
                FlexSheet.prototype.loadFromWorkbookOM = function (workbook) {
                    var grids = [], workbookInstance;
                    if (workbook instanceof wijmo.xlsx.Workbook) {
                        workbookInstance = workbook;
                    }
                    else {
                        workbookInstance = new wijmo.xlsx.Workbook();
                        workbookInstance._deserialize(workbook);
                    }
                    this._loadFromWorkbook(workbookInstance);
                };
                /**
                 * Undo the last user action.
                 */
                FlexSheet.prototype.undo = function () {
                    var self = this;
                    // The undo should wait until other operations have done. (TFS 189582) 
                    setTimeout(function () {
                        self._undoStack.undo();
                    }, 100);
                };
                /**
                 * Redo the last user action.
                 */
                FlexSheet.prototype.redo = function () {
                    var self = this;
                    // The redo should wait until other operations have done. (TFS 189582) 
                    setTimeout(function () {
                        self._undoStack.redo();
                    }, 100);
                };
                /**
                 * Selects a cell range and optionally scrolls it into view.
                 *
                 * @see:FlexSheet overrides this method to adjust the selection cell range for the merged cells in the @see:FlexSheet.
                 *
                 * @param rng The cell range to select.
                 * @param show Indicates whether to scroll the new selection into view.
                 */
                FlexSheet.prototype.select = function (rng, show) {
                    if (show === void 0) { show = true; }
                    var mergedRange, rowIndex, colIndex;
                    if (rng.rowSpan !== this.rows.length && rng.columnSpan !== this.columns.length) {
                        for (rowIndex = rng.topRow; rowIndex <= rng.bottomRow; rowIndex++) {
                            for (colIndex = rng.leftCol; colIndex <= rng.rightCol; colIndex++) {
                                mergedRange = this.getMergedRange(this.cells, rowIndex, colIndex);
                                if (mergedRange && !rng.equals(mergedRange)) {
                                    if (rng.row <= rng.row2) {
                                        rng.row = Math.min(rng.topRow, mergedRange.topRow);
                                        rng.row2 = Math.max(rng.bottomRow, mergedRange.bottomRow);
                                    }
                                    else {
                                        rng.row = Math.max(rng.bottomRow, mergedRange.bottomRow);
                                        rng.row2 = Math.min(rng.topRow, mergedRange.topRow);
                                    }
                                    if (rng.col <= rng.col2) {
                                        rng.col = Math.min(rng.leftCol, mergedRange.leftCol);
                                        rng.col2 = Math.max(rng.rightCol, mergedRange.rightCol);
                                    }
                                    else {
                                        rng.col = Math.max(rng.rightCol, mergedRange.rightCol);
                                        rng.col2 = Math.min(rng.leftCol, mergedRange.leftCol);
                                    }
                                }
                            }
                        }
                    }
                    if (this.collectionView) {
                        // When select all cells in the bound sheet, we should ignore the header row of the bound sheet.
                        // This updating is for TFS issue #128358
                        if (rng.topRow === 0 && rng.bottomRow === this.rows.length - 1
                            && rng.leftCol === 0 && rng.rightCol === this.columns.length - 1) {
                            rng.row = 1;
                            rng.row2 = this.rows.length - 1;
                        }
                    }
                    _super.prototype.select.call(this, rng, show);
                };
                /**
                 * Add custom function in @see:FlexSheet.
                 * @param name the name of the custom function.
                 * @param func the custom function.
                 * @param description the description of the custom function, it will be shown in the function autocompletion of the @see:FlexSheet.
                 * @param minParamsCount the minimum count of the parameter that the function need.
                 * @param maxParamsCount the maximum count of the parameter that the function need.
                 *        If the count of the parameters in the custom function is arbitrary, the minParamsCount and maxParamsCount should be set to null.
                 */
                FlexSheet.prototype.addCustomFunction = function (name, func, description, minParamsCount, maxParamsCount) {
                    this._calcEngine.addCustomFunction(name, func, minParamsCount, maxParamsCount);
                    this._addCustomFunctionDescription(name, description);
                };
                /**
                 * Disposes of the control by removing its association with the host element.
                 */
                FlexSheet.prototype.dispose = function () {
                    var userAgent = window.navigator.userAgent;
                    document.removeEventListener('mousemove', this._mouseMoveHdl);
                    document.body.removeEventListener('click', this._clickHdl);
                    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
                        document.body.removeEventListener('touchstart', this._touchStartHdl);
                        document.body.removeEventListener('touchend', this._touchEndHdl);
                    }
                    _super.prototype.dispose.call(this);
                };
                /**
                 * Parses a string into rows and columns and applies the content to a given range.
                 *
                 * Override the <b>setClipString</b> method of @see:FlexGrid.
                 *
                 * @param text Tab and newline delimited text to parse into the grid.
                 * @param rng @see:CellRange to copy. If omitted, the current selection is used.
                 */
                FlexSheet.prototype.setClipString = function (text, rng) {
                    var autoRange = rng == null, pasted = false, rngPaste, row, copiedRow, copiedCol, col, lines, cells, cellData, matches, isUpdated, i, cellRefIndex, cellRef, cellAddress, updatedCellRef, rowDiff, colDiff, e;
                    if (!this._copiedRange) {
                        _super.prototype.setClipString.call(this, text, rng);
                        return;
                    }
                    rng = rng ? wijmo.asType(rng, grid_1.CellRange) : this.selection;
                    // normalize text
                    text = wijmo.asString(text).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
                    if (text && text[text.length - 1] == '\n') {
                        text = text.substring(0, text.length - 1);
                    }
                    if (autoRange && !rng.isSingleCell) {
                        text = this._expandClipString(text, rng);
                    }
                    // keep track of paste range to select later
                    rngPaste = new grid_1.CellRange(rng.topRow, rng.leftCol);
                    // copy lines to rows
                    this.beginUpdate();
                    row = rng.topRow;
                    copiedRow = this._copiedRange.topRow;
                    rowDiff = row - copiedRow;
                    lines = text.split('\n');
                    for (i = 0; i < lines.length && row < this.rows.length; i++, row++) {
                        // skip invisible row, keep clip line
                        if (!this.rows[row].isVisible) {
                            i--;
                            continue;
                        }
                        // copy cells to columns
                        cells = lines[i].split('\t');
                        copiedCol = this._copiedRange.leftCol;
                        col = rng.leftCol;
                        colDiff = col - copiedCol;
                        for (var j = 0; j < cells.length && col < this.columns.length; j++, col++) {
                            // skip invisible column, keep clip cell
                            if (!this.columns[col].isVisible) {
                                j--;
                                continue;
                            }
                            // assign cell
                            if (!this.columns[col].isReadOnly && !this.rows[row].isReadOnly) {
                                cellData = cells[j];
                                if (!!cellData && typeof cellData === 'string' && cellData[0] === '=' && (rowDiff !== 0 || colDiff !== 0)) {
                                    matches = cellData.match(/(?=\b\D)\$?[A-Za-z]+\$?\d+/g);
                                    if (!!matches && matches.length > 0) {
                                        for (cellRefIndex = 0; cellRefIndex < matches.length; cellRefIndex++) {
                                            cellRef = matches[cellRefIndex];
                                            if (cellRef.toLowerCase() !== 'atan2') {
                                                cellAddress = wijmo.xlsx.Workbook.tableAddress(cellRef);
                                                cellAddress.row += rowDiff;
                                                cellAddress.col += colDiff;
                                                updatedCellRef = wijmo.xlsx.Workbook.xlsxAddress(cellAddress.row, cellAddress.col, cellAddress.absRow, cellAddress.absCol);
                                                cellData = cellData.replace(cellRef, updatedCellRef);
                                            }
                                        }
                                    }
                                }
                                // raise events so user can cancel the paste
                                e = new grid_1.CellRangeEventArgs(this.cells, new grid_1.CellRange(row, col), cellData);
                                if (this.onPastingCell(e)) {
                                    if (this.cells.setCellData(row, col, cellData)) {
                                        this.onPastedCell(e);
                                        pasted = true;
                                    }
                                }
                                // update paste range
                                rngPaste.row2 = Math.max(rngPaste.row2, row);
                                rngPaste.col2 = Math.max(rngPaste.col2, col);
                            }
                        }
                    }
                    this.endUpdate();
                    // done, refresh view to update sorting/filtering 
                    if (this.collectionView && pasted) {
                        this.collectionView.refresh();
                    }
                    // select pasted range
                    this.select(rngPaste);
                };
                // Override the getCvIndex method of its parent class FlexGrid
                FlexSheet.prototype._getCvIndex = function (index) {
                    var row;
                    if (index > -1 && this.collectionView) {
                        row = this.rows[index];
                        if (row instanceof HeaderRow) {
                            return index;
                        }
                        if (row.dataItem) {
                            return _super.prototype._getCvIndex.call(this, index);
                        }
                        return this.collectionView.currentPosition;
                    }
                    return -1;
                };
                // Initialize the FlexSheet control
                FlexSheet.prototype._init = function () {
                    var _this = this;
                    var self = this, userAgent = window.navigator.userAgent, mouseUp = function (e) {
                        document.removeEventListener('mouseup', mouseUp);
                        self._mouseUp(e);
                    };
                    self._divContainer = self.hostElement.querySelector('[wj-part="container"]');
                    self._tabHolder = new sheet_1._TabHolder(self.hostElement.querySelector('[wj-part="tab-holder"]'), self);
                    self._contextMenu = new sheet_1._ContextMenu(self.hostElement.querySelector('[wj-part="context-menu"]'), self);
                    self['_gpCells'] = new FlexSheetPanel(self, grid_1.CellType.Cell, self.rows, self.columns, self['_eCt']);
                    self['_gpCHdr'] = new FlexSheetPanel(self, grid_1.CellType.ColumnHeader, self['_hdrRows'], self.columns, self['_eCHdrCt']);
                    self['_gpRHdr'] = new FlexSheetPanel(self, grid_1.CellType.RowHeader, self.rows, self['_hdrCols'], self['_eRHdrCt']);
                    self['_gpTL'] = new FlexSheetPanel(self, grid_1.CellType.TopLeft, self['_hdrRows'], self['_hdrCols'], self['_eTLCt']);
                    self._sortManager = new sheet_1.SortManager(self);
                    self._filter = new sheet_1._FlexSheetFilter(self);
                    self._filter.filterApplied.addHandler(function () {
                        if (self._wholeColumnsSelected) {
                            self.selection = new grid_1.CellRange(self.selection.topRow, self.selection.col, self.rows.length - 1, self.selection.col2);
                        }
                    });
                    self._calcEngine = new sheet_1._CalcEngine(self);
                    self._calcEngine.unknownFunction.addHandler(function (sender, e) {
                        self.onUnknownFunction(e);
                    }, self);
                    self._initFuncsList();
                    self._undoStack = new sheet_1.UndoStack(self);
                    // Add header row for the bind sheet.
                    self.loadedRows.addHandler(function () {
                        if (self.itemsSource && !(self.rows[0] instanceof HeaderRow)) {
                            self.rows.insert(0, new HeaderRow());
                        }
                    });
                    // Setting the required property of the column to false for the bound sheet.
                    // TFS #126125
                    self.itemsSourceChanged.addHandler(function () {
                        var colIndex;
                        for (colIndex = 0; colIndex < self.columns.length; colIndex++) {
                            self.columns[colIndex].isRequired = false;
                        }
                    });
                    // Store the copied range for updating cell reference of the formula when pasting. (TFS 190785)
                    self.copied.addHandler(function (sender, args) {
                        self._copiedRange = args.range;
                    });
                    // If the rows\columns of FlexSheet were cleared, we should reset merged cells, styled cells and selection of current sheet to null. (TFS 140344)
                    self.rows.collectionChanged.addHandler(function (sender, e) {
                        self._clearForEmptySheet('rows');
                    }, self);
                    self.columns.collectionChanged.addHandler(function (sender, e) {
                        self._clearForEmptySheet('columns');
                    }, self);
                    self.addEventListener(self.hostElement, 'mousedown', function (e) {
                        document.addEventListener('mouseup', mouseUp);
                        // Only when the target is the child of the root container of the FlexSheet control, 
                        // it will deal with the mouse down event handler of the FlexSheet control. (TFS 152995)
                        if (self._isDescendant(self._divContainer, e.target)) {
                            self._mouseDown(e);
                        }
                    }, true);
                    self.addEventListener(self.hostElement, 'drop', function () {
                        self._columnHeaderClicked = false;
                    });
                    self.addEventListener(self.hostElement, 'contextmenu', function (e) {
                        var ht, selectedRow, selectedCol, colPos, rowPos, point, newSelection;
                        if (e.defaultPrevented) {
                            return;
                        }
                        if (!self._edtHdl.activeEditor) {
                            // Handle the hitTest for the keyboard context menu event in IE
                            // Since it can't get the correct position for the keyboard context menu event in IE (TFS 122943)
                            if (e.pageX === 0 && e.pageY === 0
                                && self.selection.row > -1 && self.selection.col > -1
                                && self.rows.length > 0 && self.columns.length > 0) {
                                selectedCol = self.columns[self.selection.col];
                                selectedRow = self.rows[self.selection.row];
                                colPos = selectedCol.pos + self.hostElement.offsetLeft + _this._ptScrl.x;
                                rowPos = selectedRow.pos + self.hostElement.offsetTop + _this._ptScrl.y;
                                point = new wijmo.Point(colPos + selectedCol.renderSize, rowPos + selectedRow.renderSize);
                                ht = self.hitTest(colPos, rowPos);
                            }
                            else {
                                ht = self.hitTest(e);
                            }
                            e.preventDefault();
                            if (ht && ht.cellType !== grid_1.CellType.None) {
                                // Disable add\remove rows\columns for bound sheet.
                                if (!_this.itemsSource) {
                                    self._contextMenu.show(e, point);
                                }
                                newSelection = new grid_1.CellRange(ht.row, ht.col);
                                if (ht.cellType === grid_1.CellType.Cell && !newSelection.intersects(self.selection)) {
                                    if (self.selectedSheet) {
                                        self.selectedSheet.selectionRanges.clear();
                                    }
                                    self.selection = newSelection;
                                    self.selectedSheet.selectionRanges.push(newSelection);
                                }
                            }
                        }
                    });
                    self.prepareCellForEdit.addHandler(self._prepareCellForEditHandler, self);
                    self.cellEditEnded.addHandler(function () {
                        setTimeout(function () {
                            self.hideFunctionList();
                        }, 200);
                    });
                    self.cellEditEnding.addHandler(function () {
                        self._clearCalcEngine();
                    });
                    self.pasted.addHandler(function () {
                        self._clearCalcEngine();
                    });
                    self.addEventListener(self.hostElement, 'keydown', function (e) {
                        var selectionCnt, args, text;
                        if (e.ctrlKey) {
                            if (e.keyCode === 89) {
                                self.finishEditing();
                                self.redo();
                                e.preventDefault();
                            }
                            if (e.keyCode === 90) {
                                self.finishEditing();
                                self.undo();
                                e.preventDefault();
                            }
                            if (!!self.selectedSheet && e.keyCode === 65) {
                                self.selectedSheet.selectionRanges.clear();
                                self.selectedSheet.selectionRanges.push(self.selection);
                            }
                            // Processing for 'Cut' operation. (TFS 191694)
                            if (e.keyCode === 88) {
                                self.finishEditing();
                                args = new grid_1.CellRangeEventArgs(self.cells, self.selection);
                                if (self.onCopying(args)) {
                                    text = self.getClipString();
                                    wijmo.Clipboard.copy(text);
                                    self.deferUpdate(function () {
                                        var row, col, bcol, contentDeleted = false, delAction = new sheet_1._EditAction(self);
                                        for (row = self.selection.topRow; row <= self.selection.bottomRow; row++) {
                                            for (col = self.selection.leftCol; col <= self.selection.rightCol; col++) {
                                                bcol = self._getBindingColumn(self.cells, row, self.columns[col]);
                                                if (bcol.isRequired == false || (bcol.isRequired == null && bcol.dataType == wijmo.DataType.String)) {
                                                    if (self.getCellData(row, col, true)) {
                                                        self.setCellData(row, col, '', true);
                                                        contentDeleted = true;
                                                    }
                                                }
                                            }
                                        }
                                        if (contentDeleted) {
                                            delAction.saveNewState();
                                            self._undoStack._addAction(delAction);
                                        }
                                    });
                                    self.onCopied(args);
                                }
                                e.stopPropagation();
                                return;
                            }
                        }
                        // When press 'Esc' key, we should hide the context menu (TFS 122527)
                        if (e.keyCode === wijmo.Key.Escape) {
                            self._contextMenu.hide();
                            e.preventDefault();
                        }
                        if (e.keyCode === wijmo.Key.Delete && !self._edtHdl.activeEditor) {
                            self._delSeletionContent();
                            e.preventDefault();
                        }
                        if (!!self.selectedSheet && (e.keyCode === wijmo.Key.Left || e.keyCode === wijmo.Key.Right
                            || e.keyCode === wijmo.Key.Up || e.keyCode === wijmo.Key.Down
                            || e.keyCode === wijmo.Key.PageUp || e.keyCode === wijmo.Key.PageDown
                            || e.keyCode === wijmo.Key.Home || e.keyCode === wijmo.Key.End
                            || e.keyCode === wijmo.Key.Tab || e.keyCode === wijmo.Key.Enter)) {
                            selectionCnt = self.selectedSheet.selectionRanges.length;
                            if (selectionCnt > 0) {
                                self.selectedSheet.selectionRanges[selectionCnt - 1] = self.selection;
                            }
                        }
                    });
                    document.body.addEventListener('click', self._clickHdl);
                    document.addEventListener('mousemove', self._mouseMoveHdl);
                    // Show/hide the customize context menu for iPad or iPhone 
                    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
                        document.body.addEventListener('touchstart', self._touchStartHdl);
                        document.body.addEventListener('touchend', self._touchEndHdl);
                    }
                    // After dropping in flexsheet, the flexsheet._htDown should be reset to null. (TFS #142369)
                    self.addEventListener(self.hostElement, 'drop', function () {
                        self._htDown = null;
                    });
                };
                // initialize the function autocomplete list
                FlexSheet.prototype._initFuncsList = function () {
                    var self = this;
                    self._functionListHost = document.createElement('div');
                    wijmo.addClass(self._functionListHost, 'wj-flexsheet-formula-list');
                    document.querySelector('body').appendChild(self._functionListHost);
                    self._functionListHost.style.display = 'none';
                    self._functionListHost.style.position = 'absolute';
                    self._functionList = new wijmo.input.ListBox(self._functionListHost);
                    self._functionList.isContentHtml = true;
                    self._functionList.itemsSource = self._getFunctions();
                    self._functionList.displayMemberPath = 'displayValue';
                    self._functionList.selectedValuePath = 'actualvalue';
                    self.addEventListener(self._functionListHost, 'click', self.applyFunctionToCell.bind(self));
                    self.addEventListener(self._functionListHost, 'keydown', function (e) {
                        // When press 'Esc' key in the host element of the function list,
                        // the function list should be hidden and make the host element of the flexsheet get focus. (TFS 142370)
                        if (e.keyCode === wijmo.Key.Escape) {
                            self.hideFunctionList();
                            self.hostElement.focus();
                            e.preventDefault();
                        }
                        // When press 'Enter' key in the host element of the function list,
                        // the selected function of the function should be applied to the selected cell
                        // and make the host element of the flexsheet get focus.
                        if (e.keyCode === wijmo.Key.Enter) {
                            self.applyFunctionToCell();
                            self.hostElement.focus();
                            e.preventDefault();
                        }
                    });
                };
                // Organize the functions data the function list box
                FlexSheet.prototype._getFunctions = function () {
                    var functions = [], i = 0, func;
                    for (; i < FlexSheetFunctions.length; i++) {
                        func = FlexSheetFunctions[i];
                        functions.push({
                            displayValue: '<div class="wj-flexsheet-formula-name">' + func.name + '</div><div class="wj-flexsheet-formula-description">' + func.description + '</div>',
                            actualvalue: func.name
                        });
                    }
                    return functions;
                };
                // Add the description of the custom function in flexsheet.
                FlexSheet.prototype._addCustomFunctionDescription = function (name, description) {
                    var customFuncDesc = {
                        displayValue: '<div class="wj-flexsheet-formula-name">' + name + '</div>' + (description ? '<div class="wj-flexsheet-formula-description">' + description + '</div>' : ''),
                        actualvalue: name
                    }, funcList = this._functionList.itemsSource, funcIndex = -1, i = 0, funcDesc;
                    for (; i < funcList.length; i++) {
                        funcDesc = funcList[i];
                        if (funcDesc.actualvalue === name) {
                            funcIndex = i;
                            break;
                        }
                    }
                    if (funcIndex > -1) {
                        funcList.splice(funcIndex, 1, customFuncDesc);
                    }
                    else {
                        funcList.push(customFuncDesc);
                    }
                };
                // Get current processing formula index.
                FlexSheet.prototype._getCurrentFormulaIndex = function (searchText) {
                    var searchIndex = -1;
                    ['+', '-', '*', '/', '^', '(', '&'].forEach(function (val) {
                        var index = searchText.lastIndexOf(val);
                        if (index > searchIndex) {
                            searchIndex = index;
                        }
                    });
                    return searchIndex;
                };
                // Prepare cell for edit event handler.
                // This event handler will attach keydown, keyup and blur event handler for the edit cell.
                FlexSheet.prototype._prepareCellForEditHandler = function () {
                    var self = this, edt = self._edtHdl._edt;
                    if (!edt) {
                        return;
                    }
                    // bind keydown event handler for the edit cell.
                    self.addEventListener(edt, 'keydown', function (e) {
                        if (self.isFunctionListOpen) {
                            switch (e.keyCode) {
                                case wijmo.Key.Up:
                                    self.selectPreviousFunction();
                                    e.preventDefault();
                                    break;
                                case wijmo.Key.Down:
                                    self.selectNextFunction();
                                    e.preventDefault();
                                    break;
                                case wijmo.Key.Tab:
                                case wijmo.Key.Enter:
                                    self.applyFunctionToCell();
                                    e.preventDefault();
                                    break;
                                case wijmo.Key.Escape:
                                    self.hideFunctionList();
                                    e.preventDefault();
                                    break;
                            }
                        }
                    });
                    // bind the keyup event handler for the edit cell.
                    self.addEventListener(edt, 'keyup', function (e) {
                        if ((e.keyCode > 40 || e.keyCode < 32) && e.keyCode !== wijmo.Key.Tab && e.keyCode !== wijmo.Key.Escape) {
                            setTimeout(function () {
                                self.showFunctionList(edt);
                            }, 0);
                        }
                    });
                };
                // Add new sheet into the flexsheet.
                FlexSheet.prototype._addSheet = function (sheetName, rows, cols, pos, grid) {
                    var sheet = new sheet_1.Sheet(this, grid, sheetName, rows, cols);
                    if (!this.sheets.isValidSheetName(sheet)) {
                        sheet._setValidName(this.sheets.getValidSheetName(sheet));
                    }
                    if (typeof (pos) === 'number') {
                        if (pos < 0) {
                            pos = 0;
                        }
                        if (pos >= this.sheets.length) {
                            pos = this.sheets.length;
                        }
                    }
                    else {
                        pos = this.sheets.length;
                    }
                    this.sheets.insert(pos, sheet);
                    // If the new sheet is added before current selected sheet, we should adjust the index of current selected sheet. (TFS 143291)
                    if (pos <= this._selectedSheetIndex) {
                        this._selectedSheetIndex += 1;
                    }
                    this.selectedSheetIndex = pos;
                    return sheet;
                };
                // Show specific sheet in the FlexSheet.
                FlexSheet.prototype._showSheet = function (index) {
                    var oldSheet, newSheet;
                    if (!this.sheets || !this.sheets.length || index >= this.sheets.length
                        || index < 0 || index === this.selectedSheetIndex
                        || (this.sheets[index] && !this.sheets[index].visible)) {
                        return;
                    }
                    // finish any pending edits in the old sheet data.
                    this.finishEditing();
                    // save the old sheet data
                    if (this.selectedSheetIndex > -1 && this.selectedSheetIndex < this.sheets.length) {
                        this._copyTo(this.sheets[this.selectedSheetIndex]);
                        this._resetFilterDefinition();
                    }
                    // show the new sheet data
                    if (this.sheets[index]) {
                        this._selectedSheetIndex = index;
                        this._copyFrom(this.sheets[index]);
                    }
                    this._filter.closeEditor();
                };
                // Current sheet changed event handler.
                FlexSheet.prototype._selectedSheetChange = function (sender, e) {
                    this._showSheet(e.newValue);
                    this.invalidate(true);
                    this.onSelectedSheetChanged(e);
                };
                // SheetCollection changed event handler.
                FlexSheet.prototype._sourceChange = function (sender, e) {
                    var item;
                    if (e.action === wijmo.collections.NotifyCollectionChangedAction.Add || e.action === wijmo.collections.NotifyCollectionChangedAction.Change) {
                        item = e.item;
                        item._attachOwner(this);
                        if (e.action === wijmo.collections.NotifyCollectionChangedAction.Add) {
                            this._addingSheet = true;
                            if (e.index <= this.selectedSheetIndex) {
                                this._selectedSheetIndex += 1;
                            }
                        }
                        else {
                            if (e.index === this.selectedSheetIndex) {
                                this._copyFrom(e.item, true);
                            }
                        }
                        this.selectedSheetIndex = e.index;
                    }
                    else if (e.action === wijmo.collections.NotifyCollectionChangedAction.Reset) {
                        for (var i = 0; i < this.sheets.length; i++) {
                            item = this.sheets[i];
                            item._attachOwner(this);
                        }
                        if (this.sheets.length > 0) {
                            if (this.selectedSheetIndex === 0) {
                                this._copyFrom(this.selectedSheet, true);
                            }
                            this.selectedSheetIndex = 0;
                        }
                        else {
                            this.rows.clear();
                            this.columns.clear();
                            this._selectedSheetIndex = -1;
                        }
                    }
                    else {
                        if (this.sheets.length > 0) {
                            if (this.selectedSheetIndex >= this.sheets.length) {
                                this.selectedSheetIndex = 0;
                            }
                            else if (this.selectedSheetIndex > e.index) {
                                this._selectedSheetIndex -= 1;
                            }
                        }
                        else {
                            this.rows.clear();
                            this.columns.clear();
                            this._selectedSheetIndex = -1;
                        }
                    }
                    this.invalidate(true);
                };
                // Sheet visible changed event handler.
                FlexSheet.prototype._sheetVisibleChange = function (sender, e) {
                    if (!e.item.visible) {
                        if (e.index === this.selectedSheetIndex) {
                            if (this.selectedSheetIndex === this.sheets.length - 1) {
                                this.selectedSheetIndex = e.index - 1;
                            }
                            else {
                                this.selectedSheetIndex = e.index + 1;
                            }
                        }
                    }
                };
                // apply the styles for the selected cells.
                FlexSheet.prototype._applyStyleForCell = function (rowIndex, colIndex, cellStyle) {
                    var self = this, row = self.rows[rowIndex], currentCellStyle, mergeRange, cellIndex;
                    // Will ignore the cells in the HeaderRow. 
                    if (row instanceof HeaderRow || !row.isVisible) {
                        return;
                    }
                    cellIndex = rowIndex * self.columns.length + colIndex;
                    // Handle the merged range style.
                    mergeRange = self.selectedSheet._mergedRanges[cellIndex];
                    if (mergeRange) {
                        cellIndex = mergeRange.topRow * self.columns.length + mergeRange.leftCol;
                    }
                    currentCellStyle = self.selectedSheet._styledCells[cellIndex];
                    // Add new cell style for the cell.
                    if (!currentCellStyle) {
                        self.selectedSheet._styledCells[cellIndex] = {
                            className: cellStyle.className,
                            textAlign: cellStyle.textAlign,
                            verticalAlign: cellStyle.verticalAlign,
                            fontStyle: cellStyle.fontStyle,
                            fontWeight: cellStyle.fontWeight,
                            fontFamily: cellStyle.fontFamily,
                            fontSize: cellStyle.fontSize,
                            textDecoration: cellStyle.textDecoration,
                            backgroundColor: cellStyle.backgroundColor,
                            color: cellStyle.color,
                            format: cellStyle.format
                        };
                    }
                    else {
                        // Update the cell style.
                        currentCellStyle.className = cellStyle.className === 'normal' ? '' : cellStyle.className || currentCellStyle.className;
                        currentCellStyle.textAlign = cellStyle.textAlign || currentCellStyle.textAlign;
                        currentCellStyle.verticalAlign = cellStyle.verticalAlign || currentCellStyle.verticalAlign;
                        currentCellStyle.fontFamily = cellStyle.fontFamily || currentCellStyle.fontFamily;
                        currentCellStyle.fontSize = cellStyle.fontSize || currentCellStyle.fontSize;
                        currentCellStyle.backgroundColor = cellStyle.backgroundColor || currentCellStyle.backgroundColor;
                        currentCellStyle.color = cellStyle.color || currentCellStyle.color;
                        currentCellStyle.fontStyle = cellStyle.fontStyle === 'none' ? '' : cellStyle.fontStyle || currentCellStyle.fontStyle;
                        currentCellStyle.fontWeight = cellStyle.fontWeight === 'none' ? '' : cellStyle.fontWeight || currentCellStyle.fontWeight;
                        currentCellStyle.textDecoration = cellStyle.textDecoration === 'none' ? '' : cellStyle.textDecoration || currentCellStyle.textDecoration;
                        currentCellStyle.format = cellStyle.format || currentCellStyle.format;
                    }
                };
                // Check the format states for the cells of the selection.
                FlexSheet.prototype._checkCellFormat = function (rowIndex, colIndex, formatState) {
                    //return;
                    var cellIndex = rowIndex * this.columns.length + colIndex, mergeRange, cellStyle;
                    if (!this.selectedSheet) {
                        return;
                    }
                    mergeRange = this.selectedSheet._mergedRanges[cellIndex];
                    if (mergeRange) {
                        formatState.isMergedCell = true;
                        cellIndex = mergeRange.topRow * this.columns.length + mergeRange.leftCol;
                    }
                    cellStyle = this.selectedSheet._styledCells[cellIndex];
                    // get the format states for the cells of the selection.
                    if (cellStyle) {
                        formatState.isBold = formatState.isBold || cellStyle.fontWeight === 'bold';
                        formatState.isItalic = formatState.isItalic || cellStyle.fontStyle === 'italic';
                        formatState.isUnderline = formatState.isUnderline || cellStyle.textDecoration === 'underline';
                    }
                    // get text align state for the selected cells.
                    if (rowIndex === this.selection.row && colIndex === this.selection.col) {
                        if (cellStyle && cellStyle.textAlign) {
                            formatState.textAlign = cellStyle.textAlign;
                        }
                        else if (colIndex > -1) {
                            formatState.textAlign = this.columns[colIndex].getAlignment() || formatState.textAlign;
                        }
                    }
                };
                // Reset the merged range.
                FlexSheet.prototype._resetMergedRange = function (range) {
                    var rowIndex, colIndex, cellIndex, mergeRowIndex, mergeColIndex, mergeCellIndex, mergedCell, mergedCellExists = false;
                    for (rowIndex = range.topRow; rowIndex <= range.bottomRow; rowIndex++) {
                        for (colIndex = range.leftCol; colIndex <= range.rightCol; colIndex++) {
                            cellIndex = rowIndex * this.columns.length + colIndex;
                            mergedCell = this.selectedSheet._mergedRanges[cellIndex];
                            // Reset the merged state of each cell inside current merged range.
                            if (mergedCell) {
                                mergedCellExists = true;
                                for (mergeRowIndex = mergedCell.topRow; mergeRowIndex <= mergedCell.bottomRow; mergeRowIndex++) {
                                    for (mergeColIndex = mergedCell.leftCol; mergeColIndex <= mergedCell.rightCol; mergeColIndex++) {
                                        mergeCellIndex = mergeRowIndex * this.columns.length + mergeColIndex;
                                        {
                                            delete this.selectedSheet._mergedRanges[mergeCellIndex];
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return mergedCellExists;
                };
                // update the styledCells hash and mergedRange hash for add\delete rows.
                FlexSheet.prototype._updateCellsForUpdatingRow = function (originalRowCount, index, count, isDelete) {
                    var _this = this;
                    //return;
                    var startIndex, cellIndex, newCellIndex, cellStyle, mergeRange, updatedMergeCell = {}, originalCellCount = originalRowCount * this.columns.length;
                    // update for deleting rows.
                    if (isDelete) {
                        startIndex = index * this.columns.length;
                        for (cellIndex = startIndex; cellIndex < originalCellCount; cellIndex++) {
                            newCellIndex = cellIndex - count * this.columns.length;
                            // Update the styledCells hash
                            cellStyle = this.selectedSheet._styledCells[cellIndex];
                            if (cellStyle) {
                                // if the cell is behind the delete cell range, we should update the cell index for the cell to store the style.
                                // if the cell is inside the delete cell range, it need be deleted directly.
                                if (cellIndex >= (index + count) * this.columns.length) {
                                    this.selectedSheet._styledCells[newCellIndex] = cellStyle;
                                }
                                delete this.selectedSheet._styledCells[cellIndex];
                            }
                            // Update the mergedRange hash
                            mergeRange = this.selectedSheet._mergedRanges[cellIndex];
                            if (mergeRange) {
                                if (index <= mergeRange.topRow && index + count > mergeRange.bottomRow) {
                                    // if the delete rows contain the merge cell range
                                    // we will delete the merge cell range directly.
                                    delete this.selectedSheet._mergedRanges[cellIndex];
                                }
                                else if (mergeRange.bottomRow < index || mergeRange.topRow >= index + count) {
                                    // Update the merge range when the deleted row is outside current merge cell range.
                                    if (mergeRange.topRow > index) {
                                        mergeRange.row -= count;
                                    }
                                    mergeRange.row2 -= count;
                                    this.selectedSheet._mergedRanges[newCellIndex] = mergeRange;
                                    delete this.selectedSheet._mergedRanges[cellIndex];
                                }
                                else {
                                    // Update the merge range when the deleted rows intersect with current merge cell range.
                                    this._updateCellMergeRangeForRow(mergeRange, index, count, updatedMergeCell, true);
                                }
                            }
                        }
                    }
                    else {
                        // Update for adding rows.
                        startIndex = index * this.columns.length - 1;
                        for (cellIndex = originalCellCount - 1; cellIndex > startIndex; cellIndex--) {
                            newCellIndex = cellIndex + this.columns.length * count;
                            // Update the styledCells hash
                            cellStyle = this.selectedSheet._styledCells[cellIndex];
                            if (cellStyle) {
                                this.selectedSheet._styledCells[newCellIndex] = cellStyle;
                                delete this.selectedSheet._styledCells[cellIndex];
                            }
                            // Update the mergedRange hash
                            mergeRange = this.selectedSheet._mergedRanges[cellIndex];
                            if (mergeRange) {
                                if (mergeRange.topRow < index && mergeRange.bottomRow >= index) {
                                    // Update the merge range when the added row is inside current merge cell range.
                                    this._updateCellMergeRangeForRow(mergeRange, index, count, updatedMergeCell);
                                }
                                else {
                                    // Update the merge range when the added row is outside current merge cell range.
                                    mergeRange.row += count;
                                    mergeRange.row2 += count;
                                    this.selectedSheet._mergedRanges[newCellIndex] = mergeRange;
                                    delete this.selectedSheet._mergedRanges[cellIndex];
                                }
                            }
                        }
                    }
                    Object.keys(updatedMergeCell).forEach(function (key) {
                        _this.selectedSheet._mergedRanges[key] = updatedMergeCell[key];
                    });
                };
                // Update the merge cell range when the add\delete rows intersect with current merge cell range.
                FlexSheet.prototype._updateCellMergeRangeForRow = function (currentRange, index, count, updatedMergeCell, isDelete) {
                    //return;
                    var rowIndex, columnIndex, cellIndex, newCellIndex, i, mergeRange, cloneRange;
                    if (isDelete) {
                        // Update the merge cell range for deleting rows.
                        for (rowIndex = currentRange.topRow; rowIndex <= currentRange.bottomRow; rowIndex++) {
                            for (columnIndex = currentRange.leftCol; columnIndex <= currentRange.rightCol; columnIndex++) {
                                cellIndex = rowIndex * this.columns.length + columnIndex;
                                newCellIndex = cellIndex - count * this.columns.length;
                                mergeRange = this.selectedSheet._mergedRanges[cellIndex];
                                if (mergeRange) {
                                    cloneRange = mergeRange.clone();
                                    // when the first delete row is above the merge cell range
                                    // we should adjust the topRow of the merge cell rang via the first delete row.
                                    if (cloneRange.row > index) {
                                        cloneRange.row -= cloneRange.row - index;
                                    }
                                    // when the last delete row is behind the merge cell range.
                                    // we should adjust the bottomRow of the merge cell rang via the first delete row.
                                    if (cloneRange.row2 < index + count - 1) {
                                        cloneRange.row2 -= cloneRange.row2 - index + 1;
                                    }
                                    else {
                                        cloneRange.row2 -= count;
                                    }
                                    if (rowIndex < index) {
                                        updatedMergeCell[cellIndex] = cloneRange;
                                    }
                                    else {
                                        if (rowIndex >= index + count) {
                                            updatedMergeCell[newCellIndex] = cloneRange;
                                        }
                                        delete this.selectedSheet._mergedRanges[cellIndex];
                                    }
                                }
                            }
                        }
                    }
                    else {
                        // Update the merge cell range for adding row.
                        for (rowIndex = currentRange.bottomRow; rowIndex >= currentRange.topRow; rowIndex--) {
                            for (columnIndex = currentRange.rightCol; columnIndex >= currentRange.leftCol; columnIndex--) {
                                cellIndex = rowIndex * this.columns.length + columnIndex;
                                mergeRange = this.selectedSheet._mergedRanges[cellIndex];
                                if (mergeRange) {
                                    cloneRange = mergeRange.clone();
                                    cloneRange.row2 += count;
                                    if (rowIndex < index) {
                                        updatedMergeCell[cellIndex] = cloneRange.clone();
                                    }
                                    for (i = 1; i <= count; i++) {
                                        newCellIndex = cellIndex + this.columns.length * i;
                                        updatedMergeCell[newCellIndex] = cloneRange;
                                    }
                                    delete this.selectedSheet._mergedRanges[cellIndex];
                                }
                            }
                        }
                    }
                };
                // update styledCells hash and mergedRange hash for add\delete columns.
                FlexSheet.prototype._updateCellsForUpdatingColumn = function (originalColumnCount, index, count, isDelete) {
                    var _this = this;
                    var cellIndex, newCellIndex, cellStyle, rowIndex, columnIndex, mergeRange, updatedMergeCell = {}, originalCellCount = this.rows.length * originalColumnCount;
                    // Update for deleting columns.
                    if (isDelete) {
                        for (cellIndex = index; cellIndex < originalCellCount; cellIndex++) {
                            rowIndex = Math.floor(cellIndex / originalColumnCount);
                            columnIndex = cellIndex % originalColumnCount;
                            newCellIndex = cellIndex - (count * (rowIndex + (columnIndex >= index ? 1 : 0)));
                            // Update the styledCells hash
                            cellStyle = this.selectedSheet._styledCells[cellIndex];
                            if (cellStyle) {
                                // if the cell is outside the delete cell range, we should update the cell index for the cell to store the style.
                                // otherwise it need be deleted directly.
                                if (columnIndex < index || columnIndex >= index + count) {
                                    this.selectedSheet._styledCells[newCellIndex] = cellStyle;
                                }
                                delete this.selectedSheet._styledCells[cellIndex];
                            }
                            // Update the mergedRange hash
                            mergeRange = this.selectedSheet._mergedRanges[cellIndex];
                            if (mergeRange) {
                                if (index <= mergeRange.leftCol && index + count > mergeRange.rightCol) {
                                    // if the delete columns contain the merge cell range
                                    // we will delete the merge cell range directly.
                                    delete this.selectedSheet._mergedRanges[cellIndex];
                                }
                                else if (mergeRange.rightCol < index || mergeRange.leftCol >= index + count) {
                                    // Update the merge range when the deleted column is outside current merge cell range.
                                    if (mergeRange.leftCol >= index) {
                                        mergeRange.col -= count;
                                        mergeRange.col2 -= count;
                                    }
                                    this.selectedSheet._mergedRanges[newCellIndex] = mergeRange;
                                    delete this.selectedSheet._mergedRanges[cellIndex];
                                }
                                else {
                                    // Update the merge range when the deleted columns intersect with current merge cell range.
                                    this._updateCellMergeRangeForColumn(mergeRange, index, count, originalColumnCount, updatedMergeCell, true);
                                }
                            }
                        }
                    }
                    else {
                        // Update for adding columns.
                        for (cellIndex = originalCellCount - 1; cellIndex >= index; cellIndex--) {
                            rowIndex = Math.floor(cellIndex / originalColumnCount);
                            columnIndex = cellIndex % originalColumnCount;
                            newCellIndex = cellIndex + rowIndex * count + (columnIndex >= index ? 1 : 0);
                            // Update the styledCells hash
                            cellStyle = this.selectedSheet._styledCells[cellIndex];
                            if (cellStyle) {
                                this.selectedSheet._styledCells[newCellIndex] = cellStyle;
                                delete this.selectedSheet._styledCells[cellIndex];
                            }
                            // Update the mergedRange hash
                            mergeRange = this.selectedSheet._mergedRanges[cellIndex];
                            if (mergeRange) {
                                if (mergeRange.leftCol < index && mergeRange.rightCol >= index) {
                                    // Update the merge range when the added column is inside current merge cell range.
                                    this._updateCellMergeRangeForColumn(mergeRange, index, count, originalColumnCount, updatedMergeCell);
                                }
                                else {
                                    // Update the merge range when the added column is outside current merge cell range.
                                    if (mergeRange.leftCol >= index) {
                                        mergeRange.col += count;
                                        mergeRange.col2 += count;
                                    }
                                    this.selectedSheet._mergedRanges[newCellIndex] = mergeRange;
                                    delete this.selectedSheet._mergedRanges[cellIndex];
                                }
                            }
                        }
                    }
                    Object.keys(updatedMergeCell).forEach(function (key) {
                        _this.selectedSheet._mergedRanges[key] = updatedMergeCell[key];
                    });
                };
                // Update the merge cell range when the add\delete columns intersect with current merge cell range.
                FlexSheet.prototype._updateCellMergeRangeForColumn = function (currentRange, index, count, originalColumnCount, updatedMergeCell, isDelete) {
                    var rowIndex, columnIndex, cellIndex, newCellIndex, i, mergeRange, cloneRange;
                    if (isDelete) {
                        // Update the merge cell range for deleting columns.
                        for (rowIndex = currentRange.topRow; rowIndex <= currentRange.bottomRow; rowIndex++) {
                            for (columnIndex = currentRange.leftCol; columnIndex <= currentRange.rightCol; columnIndex++) {
                                cellIndex = rowIndex * originalColumnCount + columnIndex;
                                newCellIndex = cellIndex - (count * (rowIndex + (columnIndex >= index ? 1 : 0)));
                                mergeRange = this.selectedSheet._mergedRanges[cellIndex];
                                if (mergeRange) {
                                    cloneRange = mergeRange.clone();
                                    // when the first delete column is before with merge cell range
                                    // we should adjust the leftCol of the merge cell rang via the first delete column.
                                    if (cloneRange.col > index) {
                                        cloneRange.col -= cloneRange.col - index;
                                    }
                                    // when the last delete row is behind the merge cell range.
                                    // we should adjust the bottomRow of the merge cell rang via the first delete row.
                                    if (cloneRange.col2 < index + count - 1) {
                                        cloneRange.col2 -= cloneRange.col2 - index + 1;
                                    }
                                    else {
                                        cloneRange.col2 -= count;
                                    }
                                    if (columnIndex < index || columnIndex >= index + count) {
                                        updatedMergeCell[newCellIndex] = cloneRange;
                                    }
                                    delete this.selectedSheet._mergedRanges[cellIndex];
                                }
                            }
                        }
                    }
                    else {
                        // Update the merge cell range for adding column.
                        for (rowIndex = currentRange.bottomRow; rowIndex >= currentRange.topRow; rowIndex--) {
                            for (columnIndex = currentRange.rightCol; columnIndex >= currentRange.leftCol; columnIndex--) {
                                cellIndex = rowIndex * originalColumnCount + columnIndex;
                                newCellIndex = cellIndex + rowIndex * count + (columnIndex >= index ? 1 : 0);
                                mergeRange = this.selectedSheet._mergedRanges[cellIndex];
                                if (mergeRange) {
                                    cloneRange = mergeRange.clone();
                                    cloneRange.col2 += count;
                                    if (columnIndex === index) {
                                        updatedMergeCell[newCellIndex - 1] = cloneRange.clone();
                                    }
                                    if (columnIndex >= index) {
                                        for (i = 0; i < count; i++) {
                                            updatedMergeCell[newCellIndex + i] = cloneRange;
                                        }
                                    }
                                    else {
                                        updatedMergeCell[newCellIndex] = cloneRange;
                                    }
                                    delete this.selectedSheet._mergedRanges[cellIndex];
                                }
                            }
                        }
                    }
                };
                // Clone the mergedRange of the Flexsheet
                FlexSheet.prototype._cloneMergedCells = function () {
                    var copy, mergedRanges;
                    if (!this.selectedSheet) {
                        return null;
                    }
                    mergedRanges = this.selectedSheet._mergedRanges;
                    // Handle the 3 simple types, and null or undefined
                    if (null == mergedRanges || "object" !== typeof mergedRanges)
                        return mergedRanges;
                    // Handle Object
                    if (mergedRanges instanceof Object) {
                        copy = {};
                        for (var attr in mergedRanges) {
                            if (mergedRanges.hasOwnProperty(attr)) {
                                if (mergedRanges[attr] && mergedRanges[attr].clone) {
                                    copy[attr] = mergedRanges[attr].clone();
                                }
                            }
                        }
                        return copy;
                    }
                    throw new Error("Unable to copy obj! Its type isn't supported.");
                };
                // Evaluate specified formula for flexsheet.
                FlexSheet.prototype._evaluate = function (formula, format, sheet, rowIndex, columnIndex) {
                    if (formula && formula.length > 1) {
                        formula = formula[0] === '=' ? formula : '=' + formula;
                        return this._calcEngine.evaluate(formula, format, sheet, rowIndex, columnIndex);
                    }
                    return formula;
                };
                // Copy the current flex sheet to the flexgrid of current sheet.
                FlexSheet.prototype._copyTo = function (sheet) {
                    var originAutoGenerateColumns = sheet.grid.autoGenerateColumns, colIndex, rowIndex, i;
                    sheet.grid.selection = new grid_1.CellRange();
                    sheet.grid.rows.clear();
                    sheet.grid.columns.clear();
                    sheet.grid.columnHeaders.columns.clear();
                    sheet.grid.rowHeaders.rows.clear();
                    if (this.itemsSource) {
                        sheet.grid.autoGenerateColumns = false;
                        sheet.itemsSource = this.itemsSource;
                        sheet.grid.collectionView.beginUpdate();
                        if (!(sheet.grid.itemsSource instanceof wijmo.collections.CollectionView)) {
                            sheet.grid.collectionView.sortDescriptions.clear();
                            for (i = 0; i < this.collectionView.sortDescriptions.length; i++) {
                                sheet.grid.collectionView.sortDescriptions.push(this.collectionView.sortDescriptions[i]);
                            }
                        }
                    }
                    else {
                        sheet.itemsSource = null;
                        for (rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
                            sheet.grid.rows.push(this.rows[rowIndex]);
                        }
                    }
                    sheet._filterDefinition = this._filter.filterDefinition;
                    for (colIndex = 0; colIndex < this.columns.length; colIndex++) {
                        sheet.grid.columns.push(this.columns[colIndex]);
                    }
                    if (sheet.grid.collectionView) {
                        this._resetMappedColumns(sheet.grid);
                        sheet.grid.collectionView.endUpdate();
                    }
                    sheet.grid.autoGenerateColumns = originAutoGenerateColumns;
                    sheet.grid.frozenRows = this.frozenRows;
                    sheet.grid.frozenColumns = this.frozenColumns;
                    sheet.grid.selection = this.selection;
                    sheet._scrollPosition = this.scrollPosition;
                    this.columns._dirty = true;
                    this.rows._dirty = true;
                };
                // Copy the flexgrid of current sheet to flexsheet.
                FlexSheet.prototype._copyFrom = function (sheet, needRefresh) {
                    if (needRefresh === void 0) { needRefresh = true; }
                    var self = this, originAutoGenerateColumns = self.autoGenerateColumns, colIndex, rowIndex, i, row;
                    self._isCopyingOrUndoing = true;
                    self._dragable = false;
                    self.rows.clear();
                    self.columns.clear();
                    self.columnHeaders.columns.clear();
                    self.rowHeaders.rows.clear();
                    self.selection = new grid_1.CellRange();
                    if (sheet.selectionRanges.length > 1 && self.selectionMode === grid_1.SelectionMode.CellRange) {
                        self._enableMulSel = true;
                    }
                    if (sheet.itemsSource) {
                        self.autoGenerateColumns = false;
                        self.itemsSource = sheet.itemsSource;
                        self.collectionView.beginUpdate();
                        if (!(self.itemsSource instanceof wijmo.collections.CollectionView)) {
                            self.collectionView.sortDescriptions.clear();
                            for (i = 0; i < sheet.grid.collectionView.sortDescriptions.length; i++) {
                                self.collectionView.sortDescriptions.push(sheet.grid.collectionView.sortDescriptions[i]);
                            }
                        }
                    }
                    else {
                        self.itemsSource = null;
                        for (rowIndex = 0; rowIndex < sheet.grid.rows.length; rowIndex++) {
                            self.rows.push(sheet.grid.rows[rowIndex]);
                        }
                    }
                    for (colIndex = 0; colIndex < sheet.grid.columns.length; colIndex++) {
                        self.columns.push(sheet.grid.columns[colIndex]);
                    }
                    if (self.collectionView) {
                        self._resetMappedColumns(self);
                        self.collectionView.endUpdate();
                        self.collectionView.collectionChanged.addHandler(function (sender, e) {
                            if (e.action === wijmo.collections.NotifyCollectionChangedAction.Reset) {
                                self.invalidate();
                            }
                        }, self);
                    }
                    if (self.rows.length && self.columns.length) {
                        self.selection = sheet.grid.selection;
                    }
                    if (sheet._filterDefinition) {
                        self._filter.filterDefinition = sheet._filterDefinition;
                    }
                    self.autoGenerateColumns = originAutoGenerateColumns;
                    // Hide the invisible row/column after freezing. (TFS 152188)
                    if (sheet._freezeHiddenRowCnt > 0) {
                        for (rowIndex = 0; rowIndex < sheet._freezeHiddenRowCnt; rowIndex++) {
                            row = self.rows[rowIndex];
                            if (!(row instanceof HeaderRow)) {
                                row.visible = false;
                            }
                        }
                    }
                    if (sheet._freezeHiddenColumnCnt > 0) {
                        for (colIndex = 0; colIndex < sheet._freezeHiddenColumnCnt; colIndex++) {
                            self.columns[colIndex].visible = false;
                        }
                    }
                    self.frozenRows = sheet.grid.frozenRows;
                    self.frozenColumns = sheet.grid.frozenColumns;
                    self._isCopyingOrUndoing = false;
                    if (self._addingSheet) {
                        if (self._toRefresh) {
                            clearTimeout(self._toRefresh);
                            self._toRefresh = null;
                        }
                        self._toRefresh = setTimeout(function () {
                            self.rows._dirty = true;
                            self.columns._dirty = true;
                            self.invalidate();
                        }, 10);
                        self._addingSheet = false;
                    }
                    else if (needRefresh) {
                        self.refresh();
                    }
                    self.scrollPosition = sheet._scrollPosition;
                };
                // Reset the _mappedColumns hash for the flexgrid. 
                FlexSheet.prototype._resetMappedColumns = function (flex) {
                    var col, sds, i = 0;
                    flex._mappedColumns = null;
                    if (flex.collectionView) {
                        sds = flex.collectionView.sortDescriptions;
                        for (; i < sds.length; i++) {
                            col = flex.columns.getColumn(sds[i].property);
                            if (col && col.dataMap) {
                                if (!flex._mappedColumns) {
                                    flex._mappedColumns = {};
                                }
                                flex._mappedColumns[col.binding] = col.dataMap;
                            }
                        }
                    }
                };
                // reset the filter definition for the flexsheet.
                FlexSheet.prototype._resetFilterDefinition = function () {
                    this._filter.filterDefinition = JSON.stringify({
                        defaultFilterType: wijmo.grid.filter.FilterType.Both,
                        filters: []
                    });
                };
                // Load the workbook instance to the flexsheet
                FlexSheet.prototype._loadFromWorkbook = function (workbook) {
                    var sheetCount, sheetIndex = 0, self = this;
                    if (workbook.sheets == null || workbook.sheets.length === 0) {
                        return;
                    }
                    self.clear();
                    self._reservedContent = workbook.reservedContent;
                    sheetCount = workbook.sheets.length;
                    for (; sheetIndex < sheetCount; sheetIndex++) {
                        if (sheetIndex > 0) {
                            self.addUnboundSheet();
                        }
                        wijmo.grid.xlsx.FlexGridXlsxConverter.load(self.selectedSheet.grid, workbook, { sheetIndex: sheetIndex, includeColumnHeaders: false });
                        if (self.selectedSheet.grid['wj_sheetInfo']) {
                            self.selectedSheet.name = self.selectedSheet.grid['wj_sheetInfo'].name;
                            self.selectedSheet.visible = self.selectedSheet.grid['wj_sheetInfo'].visible;
                            self.selectedSheet._styledCells = self.selectedSheet.grid['wj_sheetInfo'].styledCells;
                            self.selectedSheet._mergedRanges = self.selectedSheet.grid['wj_sheetInfo'].mergedRanges;
                        }
                        self._copyFrom(self.selectedSheet, false);
                    }
                    if (workbook.activeWorksheet != null && workbook.activeWorksheet > -1 && workbook.activeWorksheet < self.sheets.length) {
                        self.selectedSheetIndex = workbook.activeWorksheet;
                    }
                    else {
                        self.selectedSheetIndex = 0;
                    }
                    self.onLoaded();
                };
                // Save the flexsheet to the workbook instance.
                FlexSheet.prototype._saveToWorkbook = function () {
                    var mainBook, tmpBook, currentSheet, sheetIndex;
                    if (this.sheets.length === 0) {
                        throw 'The flexsheet is empty.';
                    }
                    currentSheet = this.sheets[0];
                    mainBook = wijmo.grid.xlsx.FlexGridXlsxConverter.save(currentSheet.grid, { sheetName: currentSheet.name, sheetVisible: currentSheet.visible, includeColumnHeaders: false });
                    mainBook.reservedContent = this._reservedContent;
                    for (sheetIndex = 1; sheetIndex < this.sheets.length; sheetIndex++) {
                        currentSheet = this.sheets[sheetIndex];
                        tmpBook = wijmo.grid.xlsx.FlexGridXlsxConverter.save(currentSheet.grid, { sheetName: currentSheet.name, sheetVisible: currentSheet.visible, includeColumnHeaders: false });
                        mainBook._addWorkSheet(tmpBook.sheets[0], sheetIndex);
                    }
                    mainBook.activeWorksheet = this.selectedSheetIndex;
                    return mainBook;
                };
                // mouseDown event handler.
                // This event handler for handling selecting columns
                FlexSheet.prototype._mouseDown = function (e) {
                    var userAgent = window.navigator.userAgent, ht = this.hitTest(e), cols = this.columns, currentRange, colIndex, selected, newSelection, edt;
                    this._wholeColumnsSelected = false;
                    if (this._dragable) {
                        this._isDragging = true;
                        this._draggingMarker = document.createElement('div');
                        wijmo.setCss(this._draggingMarker, {
                            position: 'absolute',
                            display: 'none',
                            borderStyle: 'dotted',
                            cursor: 'move'
                        });
                        document.body.appendChild(this._draggingMarker);
                        this._draggingTooltip = new wijmo.Tooltip();
                        this._draggingCells = this.selection;
                        if (this.selectedSheet) {
                            this.selectedSheet.selectionRanges.clear();
                        }
                        this.onDraggingRowColumn(new DraggingRowColumnEventArgs(this._draggingRow, e.shiftKey));
                        e.preventDefault();
                        return;
                    }
                    // Set the _htDown of the _EditHandler, when the slection of the FlexSheet contains the range of current hitDown (TFS #139847)
                    if (ht.cellType !== grid_1.CellType.None) {
                        edt = wijmo.tryCast(e.target, HTMLInputElement);
                        if (edt == null && this._checkHitWithinSelection(ht)) {
                            this._edtHdl._htDown = ht;
                        }
                        this._isClicking = true;
                    }
                    if (this.selectionMode === grid_1.SelectionMode.CellRange) {
                        if (e.ctrlKey) {
                            if (!this._enableMulSel) {
                                this._enableMulSel = true;
                            }
                        }
                        else {
                            if (ht.cellType !== grid_1.CellType.None) {
                                if (this.selectedSheet) {
                                    this.selectedSheet.selectionRanges.clear();
                                }
                                if (this._enableMulSel) {
                                    this.refresh(false);
                                }
                                this._enableMulSel = false;
                            }
                        }
                    }
                    else {
                        this._enableMulSel = false;
                        if (this.selectedSheet) {
                            this.selectedSheet.selectionRanges.clear();
                        }
                    }
                    this._htDown = ht;
                    // If there is no rows or columns in the flexsheet, we don't need deal with anything in the mouse down event(TFS 122628)
                    if (this.rows.length === 0 || this.columns.length === 0) {
                        return;
                    }
                    if (!userAgent.match(/iPad/i) && !userAgent.match(/iPhone/i)) {
                        this._contextMenu.hide();
                    }
                    if (this.selectionMode !== grid_1.SelectionMode.CellRange) {
                        return;
                    }
                    // When right click the row header, we should select current row. (TFS 121167)
                    if (ht.cellType === grid_1.CellType.RowHeader && e.which === 3) {
                        newSelection = new grid_1.CellRange(ht.row, 0, ht.row, this.columns.length - 1);
                        if (!this.selection.contains(newSelection)) {
                            this.selection = newSelection;
                        }
                        return;
                    }
                    if (ht.cellType !== grid_1.CellType.ColumnHeader && ht.cellType !== grid_1.CellType.None) {
                        return;
                    }
                    if (ht.col > -1 && this.columns[ht.col].isSelected) {
                        return;
                    }
                    if (!wijmo.hasClass(e.target, 'wj-cell') || ht.edgeRight) {
                        return;
                    }
                    this._columnHeaderClicked = true;
                    this._wholeColumnsSelected = true;
                    if (e.shiftKey) {
                        this._multiSelectColumns(ht);
                    }
                    else {
                        currentRange = new grid_1.CellRange(this.itemsSource ? 1 : 0, ht.col, this.rows.length - 1, ht.col);
                        if (e.which === 3 && this.selection.contains(currentRange)) {
                            return;
                        }
                        this.select(currentRange);
                    }
                };
                // mouseMove event handler
                // This event handler for handling multiple selecting columns.
                FlexSheet.prototype._mouseMove = function (e) {
                    var ht = this.hitTest(e), selection = this.selection, rowCnt = this.rows.length, colCnt = this.columns.length, cursor = this.hostElement.style.cursor, isTopRow;
                    if (this._isDragging) {
                        this.hostElement.style.cursor = 'move';
                        this._showDraggingMarker(e);
                        return;
                    }
                    if (this.itemsSource) {
                        isTopRow = selection.topRow === 0 || selection.topRow === 1;
                    }
                    else {
                        isTopRow = selection.topRow === 0;
                    }
                    if (selection && ht.cellType !== grid_1.CellType.None && !this.itemsSource) {
                        this._draggingColumn = isTopRow && selection.bottomRow === rowCnt - 1;
                        this._draggingRow = selection.leftCol === 0 && selection.rightCol === colCnt - 1;
                        if (ht.cellType === grid_1.CellType.Cell) {
                            if (this._draggingColumn && (((ht.col === selection.leftCol - 1 || ht.col === selection.rightCol) && ht.edgeRight)
                                || (ht.row === rowCnt - 1 && ht.edgeBottom))) {
                                cursor = 'move';
                            }
                            if (this._draggingRow && !this._containsGroupRows(selection) && ((ht.row === selection.topRow - 1 || ht.row === selection.bottomRow) && ht.edgeBottom
                                || (ht.col === colCnt - 1 && ht.edgeRight))) {
                                cursor = 'move';
                            }
                        }
                        else if (ht.cellType === grid_1.CellType.ColumnHeader) {
                            if (ht.edgeBottom) {
                                if (this._draggingColumn && (ht.col >= selection.leftCol && ht.col <= selection.rightCol)) {
                                    cursor = 'move';
                                }
                                else if (this._draggingRow && selection.topRow === 0) {
                                    cursor = 'move';
                                }
                            }
                        }
                        else if (ht.cellType === grid_1.CellType.RowHeader) {
                            if (ht.edgeRight) {
                                if (this._draggingColumn && selection.leftCol === 0) {
                                    cursor = 'move';
                                }
                                else if (this._draggingRow && (ht.row >= selection.topRow && ht.row <= selection.bottomRow) && !this._containsGroupRows(selection)) {
                                    cursor = 'move';
                                }
                            }
                        }
                        if (cursor === 'move') {
                            this._dragable = true;
                        }
                        else {
                            this._dragable = false;
                        }
                        this.hostElement.style.cursor = cursor;
                    }
                    if (!this._htDown || !this._htDown.panel) {
                        return;
                    }
                    ht = new grid_1.HitTestInfo(this._htDown.panel, e);
                    this._multiSelectColumns(ht);
                    this.scrollIntoView(ht.row, ht.col);
                };
                // mouseUp event handler.
                // This event handler for resetting the variable for handling multiple select columns
                FlexSheet.prototype._mouseUp = function (e) {
                    if (this._isDragging) {
                        if (!this._draggingCells.equals(this._dropRange)) {
                            this._handleDropping(e);
                            this.onDroppingRowColumn();
                        }
                        this._draggingCells = null;
                        this._dropRange = null;
                        document.body.removeChild(this._draggingMarker);
                        this._draggingMarker = null;
                        this._draggingTooltip.hide();
                        this._draggingTooltip = null;
                        this._isDragging = false;
                        this._draggingColumn = false;
                        this._draggingRow = false;
                    }
                    if (this._htDown && this._htDown.cellType !== grid_1.CellType.None && this.selection.isValid && this.selectedSheet) {
                        // Store current selection in the selection array for multiple selection.
                        if (this.selectionMode === grid_1.SelectionMode.ListBox || this.selectionMode === grid_1.SelectionMode.Row || this.selectionMode === grid_1.SelectionMode.RowRange) {
                            this.selectedSheet.selectionRanges.push(new grid_1.CellRange(this.selection.row, 0, this.selection.row2, this.columns.length - 1));
                        }
                        else if (this._htDown.cellType === grid_1.CellType.TopLeft) {
                            this.selectedSheet.selectionRanges.push(new grid_1.CellRange(this.selectedSheet.itemsSource ? 1 : 0, 0, this.rows.length - 1, this.columns.length - 1));
                        }
                        else {
                            this.selectedSheet.selectionRanges.push(this.selection);
                        }
                        this._enableMulSel = false;
                    }
                    this._isClicking = false;
                    this._columnHeaderClicked = false;
                    this._htDown = null;
                };
                // Click event handler.
                FlexSheet.prototype._click = function () {
                    var self = this, userAgent = window.navigator.userAgent;
                    // When click in the body, we also need hide the context menu.
                    if (!userAgent.match(/iPad/i) && !userAgent.match(/iPhone/i)) {
                        self._contextMenu.hide();
                    }
                    setTimeout(function () {
                        self.hideFunctionList();
                    }, 200);
                };
                // touch start event handler for iOS device
                FlexSheet.prototype._touchStart = function (e) {
                    var self = this;
                    if (!wijmo.hasClass(e.target, 'wj-context-menu-item')) {
                        self._contextMenu.hide();
                    }
                    self._longClickTimer = setTimeout(function () {
                        var ht;
                        ht = self.hitTest(e);
                        if (ht && ht.cellType !== grid_1.CellType.None && !self.itemsSource) {
                            self._contextMenu.show(undefined, new wijmo.Point(e.pageX + 10, e.pageY + 10));
                        }
                    }, 500);
                };
                // touch end event handler for iOS device
                FlexSheet.prototype._touchEnd = function () {
                    clearTimeout(this._longClickTimer);
                };
                // Show the dragging marker while the mouse moving.
                FlexSheet.prototype._showDraggingMarker = function (e) {
                    var hitInfo = new grid_1.HitTestInfo(this.cells, e), selection = this.selection, colCnt = this.columns.length, rowCnt = this.rows.length, scrollOffset = this._cumulativeScrollOffset(this.hostElement), rootBounds = this['_root'].getBoundingClientRect(), rootOffsetX = rootBounds.left + scrollOffset.x, rootOffsetY = rootBounds.top + scrollOffset.y, hitCellBounds, selectionCnt, hit, height, width, rootSize, i, content, css;
                    this.scrollIntoView(hitInfo.row, hitInfo.col);
                    if (this._draggingColumn) {
                        selectionCnt = selection.rightCol - selection.leftCol + 1;
                        hit = hitInfo.col;
                        width = 0;
                        if (hit < 0 || hit + selectionCnt > colCnt) {
                            hit = colCnt - selectionCnt;
                        }
                        hitCellBounds = this.cells.getCellBoundingRect(0, hit);
                        rootSize = this['_root'].offsetHeight - this['_eCHdr'].offsetHeight;
                        height = this.cells.height;
                        height = height > rootSize ? rootSize : height;
                        for (i = 0; i < selectionCnt; i++) {
                            width += this.columns[hit + i].renderSize;
                        }
                        content = FlexSheet.convertNumberToAlpha(hit) + ' : ' + FlexSheet.convertNumberToAlpha(hit + selectionCnt - 1);
                        if (this._dropRange) {
                            this._dropRange.col = hit;
                            this._dropRange.col2 = hit + selectionCnt - 1;
                        }
                        else {
                            this._dropRange = new grid_1.CellRange(0, hit, this.rows.length - 1, hit + selectionCnt - 1);
                        }
                    }
                    else if (this._draggingRow) {
                        selectionCnt = selection.bottomRow - selection.topRow + 1;
                        hit = hitInfo.row;
                        height = 0;
                        if (hit < 0 || hit + selectionCnt > rowCnt) {
                            hit = rowCnt - selectionCnt;
                        }
                        hitCellBounds = this.cells.getCellBoundingRect(hit, 0);
                        rootSize = this['_root'].offsetWidth - this['_eRHdr'].offsetWidth;
                        for (i = 0; i < selectionCnt; i++) {
                            height += this.rows[hit + i].renderSize;
                        }
                        width = this.cells.width;
                        width = width > rootSize ? rootSize : width;
                        content = (hit + 1) + ' : ' + (hit + selectionCnt);
                        if (this._dropRange) {
                            this._dropRange.row = hit;
                            this._dropRange.row2 = hit + selectionCnt - 1;
                        }
                        else {
                            this._dropRange = new grid_1.CellRange(hit, 0, hit + selectionCnt - 1, this.columns.length - 1);
                        }
                    }
                    if (!hitCellBounds) {
                        return;
                    }
                    css = {
                        display: 'inline',
                        zIndex: '9999',
                        opacity: 0.5,
                        top: hitCellBounds.top - (this._draggingColumn ? this._ptScrl.y : 0) + scrollOffset.y,
                        left: hitCellBounds.left - (this._draggingRow ? this._ptScrl.x : 0) + scrollOffset.x,
                        height: height,
                        width: width
                    };
                    hitCellBounds.top = hitCellBounds.top - (this._draggingColumn ? this._ptScrl.y : 0);
                    hitCellBounds.left = hitCellBounds.left - (this._draggingRow ? this._ptScrl.x : 0);
                    if (this._rtl && this._draggingRow) {
                        css.left = css.left - width + hitCellBounds.width + 2 * this._ptScrl.x;
                        hitCellBounds.left = hitCellBounds.left + 2 * this._ptScrl.x;
                    }
                    if (this._draggingRow) {
                        if (rootOffsetX + this['_eRHdr'].offsetWidth !== css.left || rootOffsetY + this['_root'].offsetHeight < css.top + css.height) {
                            return;
                        }
                    }
                    else {
                        if (rootOffsetY + this['_eCHdr'].offsetHeight !== css.top || rootOffsetX + this['_root'].offsetWidth < css.left + css.width) {
                            return;
                        }
                    }
                    wijmo.setCss(this._draggingMarker, css);
                    this._draggingTooltip.show(this.hostElement, content, hitCellBounds);
                };
                // Handle dropping rows or columns.
                FlexSheet.prototype._handleDropping = function (e) {
                    var self = this, srcRowIndex, srcColIndex, desRowIndex, desColIndex, moveCellsAction;
                    if (!self.selectedSheet || !self._draggingCells || !self._dropRange || self._containsMergedCells(self._draggingCells) || self._containsMergedCells(self._dropRange)) {
                        return;
                    }
                    self._clearCalcEngine();
                    if ((self._draggingColumn && self._draggingCells.leftCol > self._dropRange.leftCol)
                        || (self._draggingRow && self._draggingCells.topRow > self._dropRange.topRow)) {
                        // Handle changing the columns or rows position.
                        if (e.shiftKey) {
                            if (self._draggingColumn) {
                                desColIndex = self._dropRange.leftCol;
                                for (srcColIndex = self._draggingCells.leftCol; srcColIndex <= self._draggingCells.rightCol; srcColIndex++) {
                                    self.columns.moveElement(srcColIndex, desColIndex);
                                    desColIndex++;
                                }
                            }
                            else if (self._draggingRow) {
                                desRowIndex = self._dropRange.topRow;
                                for (srcRowIndex = self._draggingCells.topRow; srcRowIndex <= self._draggingCells.bottomRow; srcRowIndex++) {
                                    self.rows.moveElement(srcRowIndex, desRowIndex);
                                    desRowIndex++;
                                }
                            }
                            self._exchangeCellStyle(true);
                        }
                        else {
                            // Handle moving or copying the cell content.
                            moveCellsAction = new sheet_1._MoveCellsAction(self, self._draggingCells, self._dropRange, e.ctrlKey);
                            desRowIndex = self._dropRange.topRow;
                            for (srcRowIndex = self._draggingCells.topRow; srcRowIndex <= self._draggingCells.bottomRow; srcRowIndex++) {
                                desColIndex = self._dropRange.leftCol;
                                for (srcColIndex = self._draggingCells.leftCol; srcColIndex <= self._draggingCells.rightCol; srcColIndex++) {
                                    self._moveCellContent(srcRowIndex, srcColIndex, desRowIndex, desColIndex, e.ctrlKey);
                                    if (self._draggingColumn && desRowIndex === self._dropRange.topRow) {
                                        self.columns[desColIndex].dataType = self.columns[srcColIndex].dataType ? self.columns[srcColIndex].dataType : wijmo.DataType.Object;
                                        self.columns[desColIndex].align = self.columns[srcColIndex].align;
                                        self.columns[desColIndex].format = self.columns[srcColIndex].format;
                                        if (!e.ctrlKey) {
                                            self.columns[srcColIndex].dataType = wijmo.DataType.Object;
                                            self.columns[srcColIndex].align = null;
                                            self.columns[srcColIndex].format = null;
                                        }
                                    }
                                    desColIndex++;
                                }
                                desRowIndex++;
                            }
                            if (self._draggingColumn && !e.ctrlKey) {
                                desColIndex = self._dropRange.leftCol;
                                for (srcColIndex = self._draggingCells.leftCol; srcColIndex <= self._draggingCells.rightCol; srcColIndex++) {
                                    self._updateColumnFiler(srcColIndex, desColIndex);
                                    desColIndex++;
                                }
                            }
                            if (moveCellsAction.saveNewState()) {
                                self._undoStack._addAction(moveCellsAction);
                            }
                        }
                    }
                    else if ((self._draggingColumn && self._draggingCells.leftCol < self._dropRange.leftCol)
                        || (self._draggingRow && self._draggingCells.topRow < self._dropRange.topRow)) {
                        // Handle changing the columns or rows position.
                        if (e.shiftKey) {
                            if (self._draggingColumn) {
                                desColIndex = self._dropRange.rightCol;
                                for (srcColIndex = self._draggingCells.rightCol; srcColIndex >= self._draggingCells.leftCol; srcColIndex--) {
                                    self.columns.moveElement(srcColIndex, desColIndex);
                                    desColIndex--;
                                }
                            }
                            else if (self._draggingRow) {
                                desRowIndex = self._dropRange.bottomRow;
                                for (srcRowIndex = self._draggingCells.bottomRow; srcRowIndex >= self._draggingCells.topRow; srcRowIndex--) {
                                    self.rows.moveElement(srcRowIndex, desRowIndex);
                                    desRowIndex--;
                                }
                            }
                            self._exchangeCellStyle(false);
                        }
                        else {
                            // Handle moving or copying the cell content.
                            moveCellsAction = new sheet_1._MoveCellsAction(self, self._draggingCells, self._dropRange, e.ctrlKey);
                            desRowIndex = self._dropRange.bottomRow;
                            for (srcRowIndex = self._draggingCells.bottomRow; srcRowIndex >= self._draggingCells.topRow; srcRowIndex--) {
                                desColIndex = self._dropRange.rightCol;
                                for (srcColIndex = self._draggingCells.rightCol; srcColIndex >= self._draggingCells.leftCol; srcColIndex--) {
                                    self._moveCellContent(srcRowIndex, srcColIndex, desRowIndex, desColIndex, e.ctrlKey);
                                    if (self._draggingColumn && desRowIndex === self._dropRange.bottomRow) {
                                        self.columns[desColIndex].dataType = self.columns[srcColIndex].dataType ? self.columns[srcColIndex].dataType : wijmo.DataType.Object;
                                        self.columns[desColIndex].align = self.columns[srcColIndex].align;
                                        self.columns[desColIndex].format = self.columns[srcColIndex].format;
                                        if (!e.ctrlKey) {
                                            self.columns[srcColIndex].dataType = wijmo.DataType.Object;
                                            self.columns[srcColIndex].align = null;
                                            self.columns[srcColIndex].format = null;
                                        }
                                    }
                                    desColIndex--;
                                }
                                desRowIndex--;
                            }
                            if (self._draggingColumn && !e.ctrlKey) {
                                desColIndex = self._dropRange.rightCol;
                                for (srcColIndex = self._draggingCells.rightCol; srcColIndex >= self._draggingCells.leftCol; srcColIndex--) {
                                    self._updateColumnFiler(srcColIndex, desColIndex);
                                    desColIndex--;
                                }
                            }
                            if (moveCellsAction.saveNewState()) {
                                self._undoStack._addAction(moveCellsAction);
                            }
                        }
                    }
                    self.select(self._dropRange);
                    self.selectedSheet.selectionRanges.push(self.selection);
                    // Ensure that the host element of FlexSheet get focus after dropping. (TFS 142888)
                    self.hostElement.focus();
                };
                // Move the content and style of the source cell to the destination cell.
                FlexSheet.prototype._moveCellContent = function (srcRowIndex, srcColIndex, desRowIndex, desColIndex, isCopyContent) {
                    var val = this.getCellData(srcRowIndex, srcColIndex, false), srcCellIndex = srcRowIndex * this.columns.length + srcColIndex, desCellIndex = desRowIndex * this.columns.length + desColIndex, srcCellStyle = this.selectedSheet._styledCells[srcCellIndex];
                    this.setCellData(desRowIndex, desColIndex, val);
                    // Copy the cell style of the source cell to the destination cell.
                    if (srcCellStyle) {
                        this.selectedSheet._styledCells[desCellIndex] = JSON.parse(JSON.stringify(srcCellStyle));
                    }
                    else {
                        delete this.selectedSheet._styledCells[desCellIndex];
                    }
                    // If we just move the columns or the rows, we need remove the content and styles of the cells in the columns or the rows.
                    if (!isCopyContent) {
                        this.setCellData(srcRowIndex, srcColIndex, undefined);
                        delete this.selectedSheet._styledCells[srcCellIndex];
                    }
                };
                // Exchange the cell style for changing the rows or columns position.
                FlexSheet.prototype._exchangeCellStyle = function (isReverse) {
                    var rowIndex, colIndex, cellIndex, newCellIndex, draggingRange, index = 0, srcCellStyles = [];
                    // Store the style of the source cells and delete the style of the source cells.
                    // Since the stored style will be moved to the destination cells.
                    for (rowIndex = this._draggingCells.topRow; rowIndex <= this._draggingCells.bottomRow; rowIndex++) {
                        for (colIndex = this._draggingCells.leftCol; colIndex <= this._draggingCells.rightCol; colIndex++) {
                            cellIndex = rowIndex * this.columns.length + colIndex;
                            if (this.selectedSheet._styledCells[cellIndex]) {
                                srcCellStyles.push(JSON.parse(JSON.stringify(this.selectedSheet._styledCells[cellIndex])));
                                delete this.selectedSheet._styledCells[cellIndex];
                            }
                            else {
                                srcCellStyles.push(undefined);
                            }
                        }
                    }
                    // Adjust the style of the cells that is between the dragging cells and the drop range.
                    if (isReverse) {
                        if (this._draggingColumn) {
                            draggingRange = this._draggingCells.rightCol - this._draggingCells.leftCol + 1;
                            for (colIndex = this._draggingCells.leftCol - 1; colIndex >= this._dropRange.leftCol; colIndex--) {
                                for (rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
                                    cellIndex = rowIndex * this.columns.length + colIndex;
                                    newCellIndex = rowIndex * this.columns.length + colIndex + draggingRange;
                                    if (this.selectedSheet._styledCells[cellIndex]) {
                                        this.selectedSheet._styledCells[newCellIndex] = JSON.parse(JSON.stringify(this.selectedSheet._styledCells[cellIndex]));
                                        delete this.selectedSheet._styledCells[cellIndex];
                                    }
                                    else {
                                        delete this.selectedSheet._styledCells[newCellIndex];
                                    }
                                }
                            }
                        }
                        else if (this._draggingRow) {
                            draggingRange = this._draggingCells.bottomRow - this._draggingCells.topRow + 1;
                            for (rowIndex = this._draggingCells.topRow - 1; rowIndex >= this._dropRange.topRow; rowIndex--) {
                                for (colIndex = 0; colIndex < this.columns.length; colIndex++) {
                                    cellIndex = rowIndex * this.columns.length + colIndex;
                                    newCellIndex = (rowIndex + draggingRange) * this.columns.length + colIndex;
                                    if (this.selectedSheet._styledCells[cellIndex]) {
                                        this.selectedSheet._styledCells[newCellIndex] = JSON.parse(JSON.stringify(this.selectedSheet._styledCells[cellIndex]));
                                        delete this.selectedSheet._styledCells[cellIndex];
                                    }
                                    else {
                                        delete this.selectedSheet._styledCells[newCellIndex];
                                    }
                                }
                            }
                        }
                    }
                    else {
                        if (this._draggingColumn) {
                            draggingRange = this._draggingCells.rightCol - this._draggingCells.leftCol + 1;
                            for (colIndex = this._draggingCells.rightCol + 1; colIndex <= this._dropRange.rightCol; colIndex++) {
                                for (rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
                                    cellIndex = rowIndex * this.columns.length + colIndex;
                                    newCellIndex = rowIndex * this.columns.length + colIndex - draggingRange;
                                    if (this.selectedSheet._styledCells[cellIndex]) {
                                        this.selectedSheet._styledCells[newCellIndex] = JSON.parse(JSON.stringify(this.selectedSheet._styledCells[cellIndex]));
                                        delete this.selectedSheet._styledCells[cellIndex];
                                    }
                                    else {
                                        delete this.selectedSheet._styledCells[newCellIndex];
                                    }
                                }
                            }
                        }
                        else if (this._draggingRow) {
                            draggingRange = this._draggingCells.bottomRow - this._draggingCells.topRow + 1;
                            for (rowIndex = this._draggingCells.bottomRow + 1; rowIndex <= this._dropRange.bottomRow; rowIndex++) {
                                for (colIndex = 0; colIndex < this.columns.length; colIndex++) {
                                    cellIndex = rowIndex * this.columns.length + colIndex;
                                    newCellIndex = (rowIndex - draggingRange) * this.columns.length + colIndex;
                                    if (this.selectedSheet._styledCells[cellIndex]) {
                                        this.selectedSheet._styledCells[newCellIndex] = JSON.parse(JSON.stringify(this.selectedSheet._styledCells[cellIndex]));
                                        delete this.selectedSheet._styledCells[cellIndex];
                                    }
                                    else {
                                        delete this.selectedSheet._styledCells[newCellIndex];
                                    }
                                }
                            }
                        }
                    }
                    // Set the stored the style of the source cells to the destination cells.
                    for (rowIndex = this._dropRange.topRow; rowIndex <= this._dropRange.bottomRow; rowIndex++) {
                        for (colIndex = this._dropRange.leftCol; colIndex <= this._dropRange.rightCol; colIndex++) {
                            cellIndex = rowIndex * this.columns.length + colIndex;
                            if (srcCellStyles[index]) {
                                this.selectedSheet._styledCells[cellIndex] = srcCellStyles[index];
                            }
                            else {
                                delete this.selectedSheet._styledCells[cellIndex];
                            }
                            index++;
                        }
                    }
                };
                // Check whether the specific cell range contains merged cells.
                FlexSheet.prototype._containsMergedCells = function (rng) {
                    var rowIndex, colIndex, cellIndex, mergedRange;
                    if (!this.selectedSheet) {
                        return false;
                    }
                    for (rowIndex = rng.topRow; rowIndex <= rng.bottomRow; rowIndex++) {
                        for (colIndex = rng.leftCol; colIndex <= rng.rightCol; colIndex++) {
                            cellIndex = rowIndex * this.columns.length + colIndex;
                            mergedRange = this.selectedSheet._mergedRanges[cellIndex];
                            if (mergedRange && mergedRange.isValid && !mergedRange.isSingleCell) {
                                return true;
                            }
                        }
                    }
                    return false;
                };
                // Multiple select columns processing.
                FlexSheet.prototype._multiSelectColumns = function (ht) {
                    var range;
                    if (ht && this._columnHeaderClicked) {
                        range = new grid_1.CellRange(ht.row, ht.col);
                        range.row = 0;
                        range.row2 = this.rows.length - 1;
                        range.col2 = this.selection.col2;
                        this.select(range);
                    }
                };
                // Gets the absolute offset for the element.
                FlexSheet.prototype._cumulativeOffset = function (element) {
                    var top = 0, left = 0;
                    do {
                        top += element.offsetTop || 0;
                        left += element.offsetLeft || 0;
                        element = element.offsetParent;
                    } while (element);
                    return new wijmo.Point(left, top);
                };
                // Gets the absolute scroll offset for the element.
                FlexSheet.prototype._cumulativeScrollOffset = function (element) {
                    var scrollTop = 0, scrollLeft = 0;
                    do {
                        scrollTop += element.scrollTop || 0;
                        scrollLeft += element.scrollLeft || 0;
                        element = element.offsetParent;
                    } while (element && !(element instanceof HTMLBodyElement));
                    // Chrome and Safari always use document.body.scrollTop, 
                    // while IE and Firefox use document.body.scrollTop for quirks mode and document.documentElement.scrollTop for standard mode. 
                    // So we need check both the document.body.scrollTop and document.documentElement.scrollTop (TFS 142679)
                    scrollTop += document.body.scrollTop || document.documentElement.scrollTop;
                    scrollLeft += document.body.scrollLeft || document.documentElement.scrollLeft;
                    return new wijmo.Point(scrollLeft, scrollTop);
                };
                // Check whether current hit is within current selection.
                FlexSheet.prototype._checkHitWithinSelection = function (ht) {
                    var cellIndex, mergedRange;
                    if (ht != null && ht.cellType === grid_1.CellType.Cell) {
                        mergedRange = this.getMergedRange(this.cells, ht.row, ht.col);
                        if (mergedRange && mergedRange.intersects(this.selection)) {
                            return true;
                        }
                        if (this.selection.row === ht.row && this.selection.col === ht.col) {
                            return true;
                        }
                    }
                    return false;
                };
                // Clear the merged cells, styled cells and selection for the empty sheet.
                FlexSheet.prototype._clearForEmptySheet = function (rowsOrColumns) {
                    if (this.selectedSheet && this[rowsOrColumns].length === 0 && this._isCopyingOrUndoing !== true) {
                        this.selectedSheet._mergedRanges = null;
                        this.selectedSheet._styledCells = null;
                        this.select(new grid_1.CellRange());
                    }
                };
                // Check whether the specified cell range contains Group Row.
                FlexSheet.prototype._containsGroupRows = function (cellRange) {
                    var rowIndex, row;
                    for (rowIndex = cellRange.topRow; rowIndex <= cellRange.bottomRow; rowIndex++) {
                        row = this.rows[rowIndex];
                        if (row instanceof grid_1.GroupRow) {
                            return true;
                        }
                    }
                    return false;
                };
                // Delete the content of the selected cells.
                FlexSheet.prototype._delSeletionContent = function () {
                    var self = this, selections = self.selectedSheet.selectionRanges;
                    if (self.isReadOnly) {
                        return;
                    }
                    self.deferUpdate(function () {
                        var selection, index, colIndex, rowIndex, bcol, contentDeleted = false, delAction = new sheet_1._EditAction(self);
                        for (index = 0; index < selections.length; index++) {
                            selection = selections[index];
                            for (rowIndex = selection.topRow; rowIndex <= selection.bottomRow; rowIndex++) {
                                for (colIndex = selection.leftCol; colIndex <= selection.rightCol; colIndex++) {
                                    bcol = self._getBindingColumn(self.cells, rowIndex, self.columns[colIndex]);
                                    if (bcol.isRequired == false || (bcol.isRequired == null && bcol.dataType == wijmo.DataType.String)) {
                                        if (self.getCellData(rowIndex, colIndex, true)) {
                                            self.setCellData(rowIndex, colIndex, '', true);
                                            contentDeleted = true;
                                        }
                                    }
                                }
                            }
                        }
                        if (contentDeleted) {
                            delAction.saveNewState();
                            self._undoStack._addAction(delAction);
                        }
                    });
                };
                // Update the affected formulas for inserting/removing row/columns.
                FlexSheet.prototype._updateAffectedFormula = function (index, count, isAdding, isRow) {
                    var rowIndex, colIndex, newRowIndex, newColIndex, cellData, matches, cellRefIndex, isUpdated, cellRef, updatedCellRef, oldFormulas = [], newFormulas = [], cellAddress;
                    for (rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
                        for (colIndex = 0; colIndex < this.columns.length; colIndex++) {
                            var cellData = this.getCellData(rowIndex, colIndex, false);
                            if (!!cellData && typeof cellData === 'string' && cellData[0] === '=') {
                                matches = cellData.match(/(?=\b\D)\$?[A-Za-z]+\$?\d+/g);
                                if (!!matches && matches.length > 0) {
                                    isUpdated = false;
                                    for (cellRefIndex = 0; cellRefIndex < matches.length; cellRefIndex++) {
                                        cellRef = matches[cellRefIndex];
                                        if (cellRef.toLowerCase() !== 'atan2') {
                                            cellAddress = wijmo.xlsx.Workbook.tableAddress(cellRef);
                                            if (isRow) {
                                                if (cellAddress.row > index) {
                                                    if (isAdding) {
                                                        cellAddress.row += count;
                                                    }
                                                    else {
                                                        cellAddress.row -= count;
                                                    }
                                                    if (!isUpdated) {
                                                        isUpdated = true;
                                                        oldFormulas.push({
                                                            point: new wijmo.Point(rowIndex, colIndex),
                                                            formula: cellData
                                                        });
                                                    }
                                                }
                                            }
                                            else {
                                                if (cellAddress.col > index) {
                                                    if (isAdding) {
                                                        cellAddress.col += count;
                                                    }
                                                    else {
                                                        cellAddress.col -= count;
                                                    }
                                                    if (!isUpdated) {
                                                        isUpdated = true;
                                                        oldFormulas.push({
                                                            point: new wijmo.Point(rowIndex, colIndex),
                                                            formula: cellData
                                                        });
                                                    }
                                                }
                                            }
                                            updatedCellRef = wijmo.xlsx.Workbook.xlsxAddress(cellAddress.row, cellAddress.col, cellAddress.absRow, cellAddress.absCol);
                                            cellData = cellData.replace(cellRef, updatedCellRef);
                                        }
                                    }
                                    if (isUpdated) {
                                        this.setCellData(rowIndex, colIndex, cellData);
                                        newRowIndex = rowIndex;
                                        newColIndex = colIndex;
                                        if (isRow) {
                                            if (rowIndex > index) {
                                                if (isAdding) {
                                                    newRowIndex += count;
                                                }
                                                else {
                                                    newRowIndex -= count;
                                                }
                                            }
                                        }
                                        else {
                                            if (colIndex > index) {
                                                if (isAdding) {
                                                    newColIndex += count;
                                                }
                                                else {
                                                    newColIndex -= count;
                                                }
                                            }
                                        }
                                        newFormulas.push({
                                            point: new wijmo.Point(newRowIndex, newColIndex),
                                            formula: cellData
                                        });
                                    }
                                }
                            }
                        }
                    }
                    return {
                        oldFormulas: oldFormulas,
                        newFormulas: newFormulas
                    };
                };
                // Update the column filter for moving the column. 
                FlexSheet.prototype._updateColumnFiler = function (srcColIndex, descColIndex) {
                    var filterDef = JSON.parse(this._filter.filterDefinition);
                    for (var i = 0; i < filterDef.filters.length; i++) {
                        var filter = filterDef.filters[i];
                        if (filter.columnIndex === srcColIndex) {
                            filter.columnIndex = descColIndex;
                            break;
                        }
                    }
                    this._filter.filterDefinition = JSON.stringify(filterDef);
                };
                // Chech the specific element is the child of other element.
                FlexSheet.prototype._isDescendant = function (paranet, child) {
                    var node = child.parentNode;
                    while (node != null) {
                        if (node === paranet) {
                            return true;
                        }
                        node = node.parentNode;
                    }
                    return false;
                };
                // Clear the expression cache of the CalcEngine.
                FlexSheet.prototype._clearCalcEngine = function () {
                    this._calcEngine._clearExpressionCache();
                };
                /**
                 * Converts the number value to its corresponding alpha value.
                 * For instance: 0, 1, 2...to a, b, c...
                 * @param c The number value need to be converted.
                 */
                FlexSheet.convertNumberToAlpha = function (c) {
                    var content = '', dCount, pos;
                    if (c >= 0) {
                        do {
                            dCount = Math.floor(c / 26);
                            pos = c % 26;
                            content = String.fromCharCode(pos + 65) + content;
                            c = dCount - 1;
                        } while (dCount);
                    }
                    return content;
                };
                /**
                 * Overrides the template used to instantiate @see:FlexSheet control.
                 */
                FlexSheet.controlTemplate = '<div style="width:100%;height:100%">' +
                    '<div wj-part="container" style="width:100%">' +
                    grid_1.FlexGrid.controlTemplate +
                    '</div>' +
                    '<div wj-part="tab-holder" style="width:100%; min-width:100px">' +
                    '</div>' +
                    '<div wj-part="context-menu" style="display:none;z-index:100"></div>' +
                    '</div>';
                return FlexSheet;
            }(grid_1.FlexGrid));
            sheet_1.FlexSheet = FlexSheet;
            /**
             * Provides arguments for the @see:FlexSheet.draggingRowColumn event.
             */
            var DraggingRowColumnEventArgs = (function (_super) {
                __extends(DraggingRowColumnEventArgs, _super);
                /**
                 * Initializes a new instance of the @see:DraggingRowColumnEventArgs class.
                 *
                 * @param isDraggingRows Indicates whether the dragging event is triggered due to dragging rows or columns.
                 * @param isShiftKey Indicates whether the shift key is pressed when dragging.
                 */
                function DraggingRowColumnEventArgs(isDraggingRows, isShiftKey) {
                    _super.call(this);
                    this._isDraggingRows = isDraggingRows;
                    this._isShiftKey = isShiftKey;
                }
                Object.defineProperty(DraggingRowColumnEventArgs.prototype, "isDraggingRows", {
                    /**
                     * Gets a value indicating whether the event refers to dragging rows or columns.
                     */
                    get: function () {
                        return this._isDraggingRows;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(DraggingRowColumnEventArgs.prototype, "isShiftKey", {
                    /**
                     * Gets a value indicating whether the shift key is pressed.
                     */
                    get: function () {
                        return this._isShiftKey;
                    },
                    enumerable: true,
                    configurable: true
                });
                return DraggingRowColumnEventArgs;
            }(wijmo.EventArgs));
            sheet_1.DraggingRowColumnEventArgs = DraggingRowColumnEventArgs;
            /**
             * Provides arguments for unknown function events.
             */
            var UnknownFunctionEventArgs = (function (_super) {
                __extends(UnknownFunctionEventArgs, _super);
                /**
                 * Initializes a new instance of the @see:UnknownFunctionEventArgs class.
                 *
                 * @param funcName The name of the unknown function.
                 * @param params The parameters' value list of the nuknown function.
                 */
                function UnknownFunctionEventArgs(funcName, params) {
                    _super.call(this);
                    this._funcName = funcName;
                    this._params = params;
                }
                Object.defineProperty(UnknownFunctionEventArgs.prototype, "funcName", {
                    /**
                     * Gets the name of the unknown function.
                     */
                    get: function () {
                        return this._funcName;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UnknownFunctionEventArgs.prototype, "params", {
                    /**
                     * Gets the parameters' value list of the nuknown function.
                     */
                    get: function () {
                        return this._params;
                    },
                    enumerable: true,
                    configurable: true
                });
                return UnknownFunctionEventArgs;
            }(wijmo.EventArgs));
            sheet_1.UnknownFunctionEventArgs = UnknownFunctionEventArgs;
            /**
             * Defines the extension of the @see:GridPanel class, which is used by <b>FlexSheet</b> where
             * the base @see:FlexGrid class uses @see:GridPanel. For example, the <b>cells</b> property returns an instance
             * of this class.
             */
            var FlexSheetPanel = (function (_super) {
                __extends(FlexSheetPanel, _super);
                /**
                 * Initializes a new instance of the @see:FlexSheetPanel class.
                 *
                 * @param grid The @see:FlexGrid object that owns the panel.
                 * @param cellType The type of cell in the panel.
                 * @param rows The rows displayed in the panel.
                 * @param cols The columns displayed in the panel.
                 * @param element The HTMLElement that hosts the cells in the control.
                 */
                function FlexSheetPanel(grid, cellType, rows, cols, element) {
                    _super.call(this, grid, cellType, rows, cols, element);
                }
                /**
                 * Gets a @see:SelectedState value that indicates the selected state of a cell.
                 *
                 * Overrides this method to support multiple selection showSelectedHeaders for @see:FlexSheet
                 *
                 * @param r Specifies Row index of the cell.
                 * @param c Specifies Column index of the cell.
                 * @param rng @see:CellRange that contains the cell that would be included.
                 */
                FlexSheetPanel.prototype.getSelectedState = function (r, c, rng) {
                    var selections, selectionCnt, index, selection, selectedState, mergedRange;
                    if (!this.grid) {
                        return undefined;
                    }
                    mergedRange = this.grid.getMergedRange(this, r, c);
                    selections = this.grid.selectedSheet ? this.grid.selectedSheet.selectionRanges : null;
                    selectedState = _super.prototype.getSelectedState.call(this, r, c, rng);
                    selectionCnt = selections ? selections.length : 0;
                    if (selectedState === grid_1.SelectedState.None && selectionCnt > 0 && this.grid._enableMulSel) {
                        for (index = 0; index < selections.length; index++) {
                            selection = selections[index];
                            if (selection && selection instanceof grid_1.CellRange) {
                                if (this.cellType === grid_1.CellType.Cell) {
                                    if (mergedRange) {
                                        if (mergedRange.contains(selection.row, selection.col)) {
                                            if (index === selectionCnt - 1 && !this.grid._isClicking) {
                                                return this.grid.showMarquee ? grid_1.SelectedState.None : grid_1.SelectedState.Cursor;
                                            }
                                            return grid_1.SelectedState.Selected;
                                        }
                                        if (mergedRange.intersects(selection)) {
                                            return grid_1.SelectedState.Selected;
                                        }
                                    }
                                    if (selection.row === r && selection.col === c) {
                                        if (index === selectionCnt - 1 && !this.grid._isClicking) {
                                            return this.grid.showMarquee ? grid_1.SelectedState.None : grid_1.SelectedState.Cursor;
                                        }
                                        return grid_1.SelectedState.Selected;
                                    }
                                    if (selection.contains(r, c)) {
                                        return grid_1.SelectedState.Selected;
                                    }
                                }
                                if (this.grid.showSelectedHeaders & grid_1.HeadersVisibility.Row
                                    && this.cellType === grid_1.CellType.RowHeader
                                    && selection.containsRow(r)) {
                                    return grid_1.SelectedState.Selected;
                                }
                                if (this.grid.showSelectedHeaders & grid_1.HeadersVisibility.Column
                                    && this.cellType === grid_1.CellType.ColumnHeader
                                    && selection.containsColumn(c)) {
                                    return grid_1.SelectedState.Selected;
                                }
                            }
                        }
                    }
                    return selectedState;
                };
                /**
                 * Sets the content of a cell in the panel.
                 *
                 * @param r The index of the row that contains the cell.
                 * @param c The index, name, or binding of the column that contains the cell.
                 * @param value The value to store in the cell.
                 * @param coerce A value indicating whether to change the value automatically to match the column's data type.
                 * @return Returns true if the value is stored successfully, otherwise false (failed cast).
                 */
                FlexSheetPanel.prototype.setCellData = function (r, c, value, coerce) {
                    if (coerce === void 0) { coerce = true; }
                    var parsedDateVal;
                    if (coerce && value && wijmo.isString(value)) {
                        if (!isNaN(+value)) {
                            value = +value;
                        }
                        else if (value[0] !== '=') {
                            parsedDateVal = wijmo.Globalize.parseDate(value, '');
                            if (parsedDateVal) {
                                value = parsedDateVal;
                            }
                        }
                    }
                    // When the cell data is formula, we shall not force to change the data type of the cell data.
                    if (value && wijmo.isString(value) && value[0] === '=') {
                        coerce = false;
                    }
                    return _super.prototype.setCellData.call(this, r, c, value, coerce);
                };
                // renders a cell
                // It overrides the _renderCell method of the parent class GridPanel.
                FlexSheetPanel.prototype._renderCell = function (r, c, vrng, state, ctr) {
                    var cell = this.hostElement.childNodes[ctr], cellStyle, cellIndex = r * this.grid.columns.length + c, mr = this.grid.getMergedRange(this, r, c);
                    ctr = _super.prototype._renderCell.call(this, r, c, vrng, state, ctr);
                    if (this.cellType !== wijmo.grid.CellType.Cell) {
                        return ctr;
                    }
                    // skip over cells that have been merged over
                    if (mr) {
                        if (cellIndex > mr.topRow * this.grid.columns.length + mr.leftCol) {
                            return ctr;
                        }
                    }
                    if (wijmo.hasClass(cell, 'wj-state-selected') || wijmo.hasClass(cell, 'wj-state-multi-selected')) {
                        // If the cell is selected state, we'll remove the custom background color and font color style.
                        cell.style.backgroundColor = '';
                        cell.style.color = '';
                    }
                    else if (this.grid.selectedSheet) {
                        // If the cell removes selected state, we'll resume the custom background color and font color style.
                        cellStyle = this.grid.selectedSheet._styledCells[cellIndex];
                        if (cell && cellStyle) {
                            cell.style.backgroundColor = cellStyle.backgroundColor;
                            cell.style.color = cellStyle.color;
                        }
                    }
                    return ctr;
                };
                return FlexSheetPanel;
            }(grid_1.GridPanel));
            sheet_1.FlexSheetPanel = FlexSheetPanel;
            /**
             * Represents a row used to display column header information for a bound sheet.
             */
            var HeaderRow = (function (_super) {
                __extends(HeaderRow, _super);
                /**
                * Initializes a new instance of the HeaderRow class.
                */
                function HeaderRow() {
                    _super.call(this);
                    this.isReadOnly = true;
                }
                return HeaderRow;
            }(grid_1.Row));
            sheet_1.HeaderRow = HeaderRow;
        })(sheet = grid_1.sheet || (grid_1.sheet = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=FlexSheet.js.map