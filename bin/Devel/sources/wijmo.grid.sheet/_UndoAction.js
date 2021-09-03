var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var grid;
    (function (grid) {
        var sheet;
        (function (sheet) {
            'use strict';
            /*
             * Base class for Flexsheet undo/redo actions.
             */
            var _UndoAction = (function () {
                /*
                 * Initializes a new instance of the @see:_UndoAction class.
                 *
                 * @param owner The @see: FlexSheet control that the @see:_UndoAction works for.
                 */
                function _UndoAction(owner) {
                    this._owner = owner;
                    this._sheetIndex = owner.selectedSheetIndex;
                }
                Object.defineProperty(_UndoAction.prototype, "sheetIndex", {
                    /*
                     * Gets the index of the sheet that the undo action wokrs for.
                     */
                    get: function () {
                        return this._sheetIndex;
                    },
                    enumerable: true,
                    configurable: true
                });
                /*
                 * Executes undo of the undo action
                 */
                _UndoAction.prototype.undo = function () {
                    throw 'This abstract method must be overrided.';
                };
                /*
                 * Executes redo of the undo action
                 */
                _UndoAction.prototype.redo = function () {
                    throw 'This abstract method must be overrided.';
                };
                /*
                 * Saves the current flexsheet state.
                 */
                _UndoAction.prototype.saveNewState = function () {
                    throw 'This abstract method must be overrided.';
                };
                return _UndoAction;
            }());
            sheet._UndoAction = _UndoAction;
            /*
             * Defines the _EditAction class.
             *
             * It deals with the undo\redo for editing value of the flexsheet cells.
             */
            var _EditAction = (function (_super) {
                __extends(_EditAction, _super);
                /*
                 * Initializes a new instance of the @see:_EditAction class.
                 *
                 * @param owner The @see: FlexSheet control that the _EditAction works for.
                 * @param selection The @CellRange of current editing cell.
                 */
                function _EditAction(owner, selection) {
                    var index, selection, rowIndex, colIndex, val;
                    _super.call(this, owner);
                    this._isPaste = false;
                    this._selections = selection ? [selection] : owner.selectedSheet.selectionRanges.slice();
                    this._oldValues = [];
                    for (index = 0; index < this._selections.length; index++) {
                        selection = this._selections[index];
                        for (rowIndex = selection.topRow; rowIndex <= selection.bottomRow; rowIndex++) {
                            for (colIndex = selection.leftCol; colIndex <= selection.rightCol; colIndex++) {
                                val = owner.getCellData(rowIndex, colIndex, !!owner.columns[colIndex].dataMap);
                                val = val == undefined ? '' : val;
                                this._oldValues.push(val);
                            }
                        }
                    }
                }
                Object.defineProperty(_EditAction.prototype, "isPaste", {
                    /*
                     * Gets the isPaste state to indicate the edit action works for edit cell or copy/paste.
                     */
                    get: function () {
                        return this._isPaste;
                    },
                    enumerable: true,
                    configurable: true
                });
                /*
                 * Overrides the undo method of its base class @see:_UndoAction.
                 */
                _EditAction.prototype.undo = function () {
                    var i = 0, index, selection, rowIndex, colIndex;
                    this._owner._clearCalcEngine();
                    this._owner.selectedSheet.selectionRanges.clear();
                    for (index = 0; index < this._selections.length; index++) {
                        selection = this._selections[index];
                        for (rowIndex = selection.topRow; rowIndex <= selection.bottomRow; rowIndex++) {
                            for (colIndex = selection.leftCol; colIndex <= selection.rightCol; colIndex++) {
                                this._owner.setCellData(rowIndex, colIndex, this._oldValues[i]);
                                i++;
                            }
                        }
                        this._owner.selectedSheet.selectionRanges.push(selection);
                    }
                    this._owner.refresh(false);
                };
                /*
                 * Overrides the redo method of its base class @see:_UndoAction.
                 */
                _EditAction.prototype.redo = function () {
                    var i = 0, index, selection, rowIndex, colIndex;
                    this._owner._clearCalcEngine();
                    this._owner.selectedSheet.selectionRanges.clear();
                    for (index = 0; index < this._selections.length; index++) {
                        selection = this._selections[index];
                        for (rowIndex = selection.topRow; rowIndex <= selection.bottomRow; rowIndex++) {
                            for (colIndex = selection.leftCol; colIndex <= selection.rightCol; colIndex++) {
                                this._owner.setCellData(rowIndex, colIndex, this._newValues[i]);
                                i++;
                            }
                        }
                        this._owner.selectedSheet.selectionRanges.push(selection);
                    }
                    this._owner.refresh(false);
                };
                /*
                 * Overrides the saveNewState of its base class @see:_UndoAction.
                 */
                _EditAction.prototype.saveNewState = function () {
                    var index, selection, rowIndex, currentCol, rowIndex, colIndex, val;
                    this._newValues = [];
                    for (index = 0; index < this._selections.length; index++) {
                        selection = this._selections[index];
                        for (rowIndex = selection.topRow; rowIndex <= selection.bottomRow; rowIndex++) {
                            for (colIndex = selection.leftCol; colIndex <= selection.rightCol; colIndex++) {
                                currentCol = this._owner.columns[colIndex];
                                if (!currentCol) {
                                    return false;
                                }
                                val = this._owner.getCellData(rowIndex, colIndex, !!currentCol.dataMap);
                                val = val == undefined ? '' : val;
                                this._newValues.push(val);
                            }
                        }
                    }
                    return !this._checkActionState();
                };
                /*
                 * Mark the cell edit action works for paste action.
                 */
                _EditAction.prototype.markIsPaste = function () {
                    this._isPaste = true;
                };
                /*
                 * Update the edit action for pasting.
                 *
                 * @param rng the @see:CellRange used to update the edit action
                 */
                _EditAction.prototype.updateForPasting = function (rng) {
                    var selection = this._selections[this._selections.length - 1], val = this._owner.getCellData(rng.row, rng.col, !!this._owner.columns[rng.col].dataMap);
                    if (!this._addingValue) {
                        this._addingValue = true;
                        this._oldValues = [];
                    }
                    val = val == undefined ? '' : val;
                    this._oldValues.push(val);
                    selection.row2 = Math.max(selection.row2, rng.row2);
                    selection.col2 = Math.max(selection.col2, rng.col2);
                };
                // Check whether the values changed after editing.
                _EditAction.prototype._checkActionState = function () {
                    var i;
                    if (this._oldValues.length !== this._newValues.length) {
                        return false;
                    }
                    for (i = 0; i < this._oldValues.length; i++) {
                        if (this._oldValues[i] !== this._newValues[i]) {
                            return false;
                        }
                    }
                    return true;
                };
                return _EditAction;
            }(_UndoAction));
            sheet._EditAction = _EditAction;
            /*
             * Defines the _ColumnResizeAction class.
             *
             * It deals with the undo/redo for resize the column of the flexsheet.
             */
            var _ColumnResizeAction = (function (_super) {
                __extends(_ColumnResizeAction, _super);
                /*
                 * Initializes a new instance of the @see:_ColumnResizeAction class.
                 *
                 * @param owner The @see: FlexSheet control that the _ColumnResizeAction works for.
                 * @param panel The @see: GridPanel indicates the resizing column belongs to which part of the FlexSheet.
                 * @param colIndex it indicates which column is resizing.
                 */
                function _ColumnResizeAction(owner, panel, colIndex) {
                    _super.call(this, owner);
                    this._panel = panel;
                    this._colIndex = colIndex;
                    this._oldColWidth = panel.columns[colIndex].width;
                }
                /*
                 * Overrides the undo method of its base class @see:_UndoAction.
                 */
                _ColumnResizeAction.prototype.undo = function () {
                    this._panel.columns[this._colIndex].width = this._oldColWidth;
                };
                /*
                 * Overrides the redo method of its base class @see:_UndoAction.
                 */
                _ColumnResizeAction.prototype.redo = function () {
                    this._panel.columns[this._colIndex].width = this._newColWidth;
                };
                /*
                 * Overrides the saveNewState method of its base class @see:_UndoAction.
                 */
                _ColumnResizeAction.prototype.saveNewState = function () {
                    this._newColWidth = this._panel.columns[this._colIndex].width;
                    if (this._oldColWidth === this._newColWidth) {
                        return false;
                    }
                    return true;
                };
                return _ColumnResizeAction;
            }(_UndoAction));
            sheet._ColumnResizeAction = _ColumnResizeAction;
            /*
             * Defines the _RowResizeAction class.
             *
             * It deals with the undo\redo for resize the row of the flexsheet.
             */
            var _RowResizeAction = (function (_super) {
                __extends(_RowResizeAction, _super);
                /*
                 * Initializes a new instance of the @see:_RowResizeAction class.
                 *
                 * @param owner The @see: FlexSheet control that the _RowResizeAction works for.
                 * @param panel The @see: GridPanel indicates the resizing row belongs to which part of the FlexSheet.
                 * @param rowIndex it indicates which row is resizing.
                 */
                function _RowResizeAction(owner, panel, rowIndex) {
                    _super.call(this, owner);
                    this._panel = panel;
                    this._rowIndex = rowIndex;
                    this._oldRowHeight = panel.rows[rowIndex].height;
                }
                /*
                 * Overrides the undo method of its base class @see:_UndoAction.
                 */
                _RowResizeAction.prototype.undo = function () {
                    this._panel.rows[this._rowIndex].height = this._oldRowHeight;
                };
                /*
                 * Overrides the redo method of its base class @see:_UndoAction.
                 */
                _RowResizeAction.prototype.redo = function () {
                    this._panel.rows[this._rowIndex].height = this._newRowHeight;
                };
                /*
                 * Overrides the saveNewState method of its base class @see:_UndoAction.
                 */
                _RowResizeAction.prototype.saveNewState = function () {
                    this._newRowHeight = this._panel.rows[this._rowIndex].height;
                    if (this._oldRowHeight === this._newRowHeight) {
                        return false;
                    }
                    return true;
                };
                return _RowResizeAction;
            }(_UndoAction));
            sheet._RowResizeAction = _RowResizeAction;
            /*
             * Defines the _InsertDeleteColumnAction class.
             *
             * It deals with the undo\redo for insert or delete column of the flexsheet.
             */
            var _ColumnsChangedAction = (function (_super) {
                __extends(_ColumnsChangedAction, _super);
                /*
                 * Initializes a new instance of the @see:_InsertDeleteColumnAction class.
                 *
                 * @param owner The @see: FlexSheet control that the _InsertDeleteColumnAction works for.
                 */
                function _ColumnsChangedAction(owner) {
                    var colIndex, columns = [];
                    _super.call(this, owner);
                    this._selection = owner.selection;
                    for (colIndex = 0; colIndex < owner.columns.length; colIndex++) {
                        columns.push(owner.columns[colIndex]);
                    }
                    this._oldValue = {
                        columns: columns,
                        sortList: owner.sortManager._committedList.slice(),
                        styledCells: owner.selectedSheet ? JSON.parse(JSON.stringify(owner.selectedSheet._styledCells)) : null,
                        mergedCells: owner._cloneMergedCells()
                    };
                }
                /*
                 * Overrides the undo method of its base class @see:_UndoAction.
                 */
                _ColumnsChangedAction.prototype.undo = function () {
                    var colIndex, i, formulaObj, oldFormulas, self = this;
                    if (!self._owner.selectedSheet) {
                        return;
                    }
                    self._owner._clearCalcEngine();
                    self._owner.finishEditing();
                    self._owner.columns.clear();
                    self._owner.selectedSheet._styledCells = undefined;
                    self._owner.selectedSheet._mergedRanges = undefined;
                    self._owner.columns.beginUpdate();
                    for (colIndex = 0; colIndex < self._oldValue.columns.length; colIndex++) {
                        self._owner.columns.push(self._oldValue.columns[colIndex]);
                    }
                    self._owner.columns.endUpdate();
                    self._owner.selectedSheet._styledCells = self._oldValue.styledCells;
                    self._owner.selectedSheet._mergedRanges = self._oldValue.mergedCells;
                    if (self._affectedFormulas) {
                        oldFormulas = self._affectedFormulas.oldFormulas;
                    }
                    self._owner.deferUpdate(function () {
                        self._owner.selection = self._selection;
                        // Set the 'old' formulas for redo.
                        if (!!oldFormulas && oldFormulas.length > 0) {
                            for (i = 0; i < oldFormulas.length; i++) {
                                formulaObj = oldFormulas[i];
                                self._owner.setCellData(formulaObj.point.x, formulaObj.point.y, formulaObj.formula);
                            }
                        }
                        // Synch with current sheet.
                        self._owner._copyTo(self._owner.selectedSheet);
                        self._owner._copyFrom(self._owner.selectedSheet);
                    });
                    // Synch the cell style for current sheet.
                    self._owner.selectedSheet.grid['wj_sheetInfo'].styledCells = self._owner.selectedSheet._styledCells;
                    // Synch the merged range for current sheet.
                    self._owner.selectedSheet.grid['wj_sheetInfo'].mergedRanges = self._owner.selectedSheet._mergedRanges;
                    self._owner.sortManager.sortDescriptions.sourceCollection = self._oldValue.sortList.slice();
                    self._owner.sortManager.commitSort(false);
                    self._owner.sortManager._refresh();
                    self._owner.selection = self._selection;
                    self._owner.refresh(true);
                    setTimeout(function () {
                        self._owner.rows._dirty = true;
                        self._owner.columns._dirty = true;
                        self._owner.refresh(true);
                    }, 10);
                };
                /*
                 * Overrides the redo method of its base class @see:_UndoAction.
                 */
                _ColumnsChangedAction.prototype.redo = function () {
                    var colIndex, i, formulaObj, newFormulas, self = this;
                    if (!self._owner.selectedSheet) {
                        return;
                    }
                    self._owner._clearCalcEngine();
                    self._owner.finishEditing();
                    self._owner.columns.clear();
                    self._owner.selectedSheet._styledCells = undefined;
                    self._owner.selectedSheet._mergedRanges = undefined;
                    self._owner.columns.beginUpdate();
                    for (colIndex = 0; colIndex < self._newValue.columns.length; colIndex++) {
                        self._owner.columns.push(self._newValue.columns[colIndex]);
                    }
                    self._owner.columns.endUpdate();
                    self._owner.selectedSheet._styledCells = self._newValue.styledCells;
                    self._owner.selectedSheet._mergedRanges = self._newValue.mergedCells;
                    if (self._affectedFormulas) {
                        newFormulas = self._affectedFormulas.newFormulas;
                    }
                    self._owner.deferUpdate(function () {
                        self._owner.selection = self._selection;
                        // Set the 'new' formulas for redo.
                        if (!!newFormulas && newFormulas.length > 0) {
                            for (i = 0; i < newFormulas.length; i++) {
                                formulaObj = newFormulas[i];
                                self._owner.setCellData(formulaObj.point.x, formulaObj.point.y, formulaObj.formula);
                            }
                        }
                        // Synch with current sheet.
                        self._owner._copyTo(self._owner.selectedSheet);
                        self._owner._copyFrom(self._owner.selectedSheet);
                    });
                    // Synch the cell style for current sheet.
                    self._owner.selectedSheet.grid['wj_sheetInfo'].styledCells = self._owner.selectedSheet._styledCells;
                    // Synch the merged range for current sheet.
                    self._owner.selectedSheet.grid['wj_sheetInfo'].mergedRanges = self._owner.selectedSheet._mergedRanges;
                    self._owner.sortManager.sortDescriptions.sourceCollection = self._newValue.sortList.slice();
                    self._owner.sortManager.commitSort(false);
                    self._owner.sortManager._refresh();
                    self._owner.selection = self._selection;
                    self._owner.refresh(true);
                    setTimeout(function () {
                        self._owner.rows._dirty = true;
                        self._owner.columns._dirty = true;
                        self._owner.refresh(true);
                    }, 10);
                };
                /*
                 * Overrides the saveNewState method of its base class @see:_UndoAction.
                 */
                _ColumnsChangedAction.prototype.saveNewState = function () {
                    var colIndex, columns = [];
                    for (colIndex = 0; colIndex < this._owner.columns.length; colIndex++) {
                        columns.push(this._owner.columns[colIndex]);
                    }
                    this._newValue = {
                        columns: columns,
                        sortList: this._owner.sortManager._committedList.slice(),
                        styledCells: this._owner.selectedSheet ? JSON.parse(JSON.stringify(this._owner.selectedSheet._styledCells)) : null,
                        mergedCells: this._owner._cloneMergedCells()
                    };
                    return true;
                };
                return _ColumnsChangedAction;
            }(_UndoAction));
            sheet._ColumnsChangedAction = _ColumnsChangedAction;
            /*
             * Defines the _InsertDeleteRowAction class.
             *
             * It deals with the undo\redo for insert or delete row of the flexsheet.
             */
            var _RowsChangedAction = (function (_super) {
                __extends(_RowsChangedAction, _super);
                /*
                 * Initializes a new instance of the @see:_InsertDeleteRowAction class.
                 *
                 * @param owner The @see: FlexSheet control that the _InsertDeleteRowAction works for.
                 */
                function _RowsChangedAction(owner) {
                    var rowIndex, colIndex, rows = [], columns = [];
                    _super.call(this, owner);
                    this._selection = owner.selection;
                    for (rowIndex = 0; rowIndex < owner.rows.length; rowIndex++) {
                        rows.push(owner.rows[rowIndex]);
                    }
                    for (colIndex = 0; colIndex < owner.columns.length; colIndex++) {
                        columns.push(owner.columns[colIndex]);
                    }
                    this._oldValue = {
                        rows: rows,
                        columns: columns,
                        itemsSource: owner.itemsSource ? owner.itemsSource.slice() : undefined,
                        styledCells: owner.selectedSheet ? JSON.parse(JSON.stringify(owner.selectedSheet._styledCells)) : null,
                        mergedCells: owner._cloneMergedCells()
                    };
                }
                /*
                 * Overrides the undo method of its base class @see:_UndoAction.
                 */
                _RowsChangedAction.prototype.undo = function () {
                    var rowIndex, colIndex, i, processingRow, formulaObj, oldFormulas, self = this, dataSourceBinding = !!self._oldValue.itemsSource;
                    if (!self._owner.selectedSheet) {
                        return;
                    }
                    self._owner._clearCalcEngine();
                    self._owner.finishEditing();
                    self._owner.columns.clear();
                    self._owner.rows.clear();
                    self._owner.selectedSheet._styledCells = undefined;
                    self._owner.selectedSheet._mergedRanges = undefined;
                    if (dataSourceBinding) {
                        self._owner.autoGenerateColumns = false;
                        self._owner.itemsSource = self._oldValue.itemsSource.slice();
                    }
                    self._owner.rows.beginUpdate();
                    for (rowIndex = 0; rowIndex < self._oldValue.rows.length; rowIndex++) {
                        processingRow = self._oldValue.rows[rowIndex];
                        if (dataSourceBinding) {
                            if (!processingRow.dataItem && !(processingRow instanceof sheet.HeaderRow)) {
                                self._owner.rows.splice(rowIndex, 0, processingRow);
                            }
                        }
                        else {
                            self._owner.rows.push(processingRow);
                        }
                    }
                    for (colIndex = 0; colIndex < self._oldValue.columns.length; colIndex++) {
                        self._owner.columns.push(self._oldValue.columns[colIndex]);
                    }
                    self._owner.rows.endUpdate();
                    self._owner.selectedSheet._styledCells = self._oldValue.styledCells;
                    self._owner.selectedSheet._mergedRanges = self._oldValue.mergedCells;
                    if (self._affecedFormulas) {
                        oldFormulas = self._affecedFormulas.oldFormulas;
                    }
                    self._owner.deferUpdate(function () {
                        self._owner.selection = self._selection;
                        // Set the 'old' formulas for redo.
                        if (!!oldFormulas && oldFormulas.length > 0) {
                            for (i = 0; i < oldFormulas.length; i++) {
                                formulaObj = oldFormulas[i];
                                self._owner.setCellData(formulaObj.point.x, formulaObj.point.y, formulaObj.formula);
                            }
                        }
                        // Synch with current sheet.
                        self._owner._copyTo(self._owner.selectedSheet);
                        self._owner._copyFrom(self._owner.selectedSheet);
                    });
                    // Synch the cell style for current sheet.
                    self._owner.selectedSheet.grid['wj_sheetInfo'].styledCells = self._owner.selectedSheet._styledCells;
                    // Synch the merged range for current sheet.
                    self._owner.selectedSheet.grid['wj_sheetInfo'].mergedRanges = self._owner.selectedSheet._mergedRanges;
                    self._owner.selection = self._selection;
                    self._owner.refresh(true);
                    setTimeout(function () {
                        self._owner.rows._dirty = true;
                        self._owner.columns._dirty = true;
                        self._owner.refresh(true);
                    }, 10);
                };
                /*
                 * Overrides the redo method of its base class @see:_UndoAction.
                 */
                _RowsChangedAction.prototype.redo = function () {
                    var rowIndex, colIndex, i, processingRow, formulaObj, newFormulas, self = this, dataSourceBinding = !!self._newValue.itemsSource;
                    if (!self._owner.selectedSheet) {
                        return;
                    }
                    self._owner._clearCalcEngine();
                    self._owner.finishEditing();
                    self._owner.columns.clear();
                    self._owner.rows.clear();
                    self._owner.selectedSheet._styledCells = undefined;
                    self._owner.selectedSheet._mergedRanges = undefined;
                    if (dataSourceBinding) {
                        self._owner.autoGenerateColumns = false;
                        self._owner.itemsSource = self._newValue.itemsSource.slice();
                    }
                    self._owner.rows.beginUpdate();
                    for (rowIndex = 0; rowIndex < self._newValue.rows.length; rowIndex++) {
                        processingRow = self._newValue.rows[rowIndex];
                        if (dataSourceBinding) {
                            if (!processingRow.dataItem && !(processingRow instanceof sheet.HeaderRow)) {
                                self._owner.rows.splice(rowIndex, 0, processingRow);
                            }
                        }
                        else {
                            self._owner.rows.push(processingRow);
                        }
                    }
                    for (colIndex = 0; colIndex < self._newValue.columns.length; colIndex++) {
                        self._owner.columns.push(self._newValue.columns[colIndex]);
                    }
                    self._owner.rows.endUpdate();
                    self._owner.selectedSheet._styledCells = self._newValue.styledCells;
                    self._owner.selectedSheet._mergedRanges = self._newValue.mergedCells;
                    if (self._affecedFormulas) {
                        newFormulas = self._affecedFormulas.newFormulas;
                    }
                    self._owner.deferUpdate(function () {
                        // Set the 'new' formulas for redo.
                        if (!!newFormulas && newFormulas.length > 0) {
                            for (i = 0; i < newFormulas.length; i++) {
                                formulaObj = newFormulas[i];
                                self._owner.setCellData(formulaObj.point.x, formulaObj.point.y, formulaObj.formula);
                            }
                        }
                        // Synch with current sheet.
                        self._owner._copyTo(self._owner.selectedSheet);
                        self._owner._copyFrom(self._owner.selectedSheet);
                    });
                    // Synch the cell style for current sheet.
                    self._owner.selectedSheet.grid['wj_sheetInfo'].styledCells = self._owner.selectedSheet._styledCells;
                    // Synch the merged range for current sheet.
                    self._owner.selectedSheet.grid['wj_sheetInfo'].mergedRanges = self._owner.selectedSheet._mergedRanges;
                    self._owner.selection = self._selection;
                    self._owner.refresh(true);
                    setTimeout(function () {
                        self._owner.rows._dirty = true;
                        self._owner.columns._dirty = true;
                        self._owner.refresh(true);
                    }, 10);
                };
                /*
                 * Overrides the saveNewState method of its base class @see:_UndoAction.
                 */
                _RowsChangedAction.prototype.saveNewState = function () {
                    var rowIndex, colIndex, rows = [], columns = [];
                    for (rowIndex = 0; rowIndex < this._owner.rows.length; rowIndex++) {
                        rows.push(this._owner.rows[rowIndex]);
                    }
                    for (colIndex = 0; colIndex < this._owner.columns.length; colIndex++) {
                        columns.push(this._owner.columns[colIndex]);
                    }
                    this._newValue = {
                        rows: rows,
                        columns: columns,
                        itemsSource: this._owner.itemsSource ? this._owner.itemsSource.slice() : undefined,
                        styledCells: this._owner.selectedSheet ? JSON.parse(JSON.stringify(this._owner.selectedSheet._styledCells)) : null,
                        mergedCells: this._owner._cloneMergedCells()
                    };
                    return true;
                };
                return _RowsChangedAction;
            }(_UndoAction));
            sheet._RowsChangedAction = _RowsChangedAction;
            /*
             * Defines the _CellStyleAction class.
             *
             * It deals with the undo\redo for applying style for the cells of the flexsheet.
             */
            var _CellStyleAction = (function (_super) {
                __extends(_CellStyleAction, _super);
                /*
                 * Initializes a new instance of the @see:_CellStyleAction class.
                 *
                 * @param owner The @see: FlexSheet control that the _CellStyleAction works for.
                 * @param styledCells Current styled cells of the @see: FlexSheet control.
                 */
                function _CellStyleAction(owner, styledCells) {
                    _super.call(this, owner);
                    this._oldStyledCells = styledCells ? JSON.parse(JSON.stringify(styledCells)) : (owner.selectedSheet ? JSON.parse(JSON.stringify(owner.selectedSheet._styledCells)) : null);
                }
                /*
                 * Overrides the undo method of its base class @see:_UndoAction.
                 */
                _CellStyleAction.prototype.undo = function () {
                    if (!this._owner.selectedSheet) {
                        return;
                    }
                    this._owner.selectedSheet._styledCells = JSON.parse(JSON.stringify(this._oldStyledCells));
                    this._owner.selectedSheet.grid['wj_sheetInfo'].styledCells = this._owner.selectedSheet._styledCells;
                    this._owner.refresh(false);
                };
                /*
                 * Overrides the redo method of its base class @see:_UndoAction.
                 */
                _CellStyleAction.prototype.redo = function () {
                    if (!this._owner.selectedSheet) {
                        return;
                    }
                    this._owner.selectedSheet._styledCells = JSON.parse(JSON.stringify(this._newStyledCells));
                    this._owner.selectedSheet.grid['wj_sheetInfo'].styledCells = this._owner.selectedSheet._styledCells;
                    this._owner.refresh(false);
                };
                /*
                 * Overrides the saveNewState method of its base class @see:_UndoAction.
                 */
                _CellStyleAction.prototype.saveNewState = function () {
                    this._newStyledCells = this._owner.selectedSheet ? JSON.parse(JSON.stringify(this._owner.selectedSheet._styledCells)) : null;
                    return true;
                };
                return _CellStyleAction;
            }(_UndoAction));
            sheet._CellStyleAction = _CellStyleAction;
            /*
             * Defines the _CellMergeAction class.
             *
             * It deals with the undo\redo for merging the cells of the flexsheet.
             */
            var _CellMergeAction = (function (_super) {
                __extends(_CellMergeAction, _super);
                /*
                 * Initializes a new instance of the @see:_CellMergeAction class.
                 *
                 * @param owner The @see: FlexSheet control that the _CellMergeAction works for.
                 */
                function _CellMergeAction(owner) {
                    _super.call(this, owner);
                    this._oldMergedCells = owner._cloneMergedCells();
                }
                /*
                 * Overrides the undo method of its base class @see:_UndoAction.
                 */
                _CellMergeAction.prototype.undo = function () {
                    if (!this._owner.selectedSheet) {
                        return;
                    }
                    this._owner._clearCalcEngine();
                    this._owner.selectedSheet._mergedRanges = this._oldMergedCells;
                    this._owner.selectedSheet.grid['wj_sheetInfo'].mergedRanges = this._owner.selectedSheet._mergedRanges;
                    this._owner.refresh(true);
                };
                /*
                 * Overrides the redo method of its base class @see:_UndoAction.
                 */
                _CellMergeAction.prototype.redo = function () {
                    if (!this._owner.selectedSheet) {
                        return;
                    }
                    this._owner._clearCalcEngine();
                    this._owner.selectedSheet._mergedRanges = this._newMergedCells;
                    this._owner.selectedSheet.grid['wj_sheetInfo'].mergedRanges = this._owner.selectedSheet._mergedRanges;
                    this._owner.refresh(true);
                };
                /*
                 * Overrides the saveNewState method of its base class @see:_UndoAction.
                 */
                _CellMergeAction.prototype.saveNewState = function () {
                    this._newMergedCells = this._owner._cloneMergedCells();
                    return true;
                };
                return _CellMergeAction;
            }(_UndoAction));
            sheet._CellMergeAction = _CellMergeAction;
            /*
             * Defines the _SortColumnAction class.
             *
             * It deals with the undo\redo for sort columns of the flexsheet.
             */
            var _SortColumnAction = (function (_super) {
                __extends(_SortColumnAction, _super);
                /*
                 * Initializes a new instance of the @see:_CellMergeAction class.
                 *
                 * @param owner The @see: FlexSheet control that the @see:_CellMergeAction works for.
                 */
                function _SortColumnAction(owner) {
                    var rowIndex, colIndex, columns = [], rows = [];
                    _super.call(this, owner);
                    if (!owner.itemsSource) {
                        for (rowIndex = 0; rowIndex < owner.rows.length; rowIndex++) {
                            rows.push(owner.rows[rowIndex]);
                        }
                        for (colIndex = 0; colIndex < owner.columns.length; colIndex++) {
                            columns.push(owner.columns[colIndex]);
                        }
                    }
                    this._oldValue = {
                        sortList: owner.sortManager._committedList.slice(),
                        rows: rows,
                        columns: columns
                    };
                }
                /*
                 * Overrides the undo method of its base class @see:_UndoAction.
                 */
                _SortColumnAction.prototype.undo = function () {
                    var _this = this;
                    var rowIndex, colIndex;
                    if (!this._owner.selectedSheet) {
                        return;
                    }
                    this._owner._clearCalcEngine();
                    this._owner.sortManager.sortDescriptions.sourceCollection = this._oldValue.sortList.slice();
                    this._owner.sortManager.commitSort(false);
                    this._owner.sortManager._refresh();
                    if (!this._owner.itemsSource) {
                        this._owner._isCopyingOrUndoing = true;
                        this._owner.rows.clear();
                        this._owner.columns.clear();
                        this._owner.selectedSheet.grid.rows.clear();
                        this._owner.selectedSheet.grid.columns.clear();
                        for (rowIndex = 0; rowIndex < this._oldValue.rows.length; rowIndex++) {
                            this._owner.rows.push(this._oldValue.rows[rowIndex]);
                            // Synch the rows of the grid for current sheet.
                            this._owner.selectedSheet.grid.rows.push(this._oldValue.rows[rowIndex]);
                        }
                        for (colIndex = 0; colIndex < this._oldValue.columns.length; colIndex++) {
                            this._owner.columns.push(this._oldValue.columns[colIndex]);
                            // Synch the columns of the grid for current sheet.
                            this._owner.selectedSheet.grid.columns.push(this._oldValue.columns[colIndex]);
                        }
                        this._owner._isCopyingOrUndoing = false;
                        setTimeout(function () {
                            _this._owner.rows._dirty = true;
                            _this._owner.columns._dirty = true;
                            _this._owner.refresh(true);
                        }, 10);
                    }
                };
                /*
                 * Overrides the redo method of its base class @see:_UndoAction.
                 */
                _SortColumnAction.prototype.redo = function () {
                    var _this = this;
                    var rowIndex, colIndex;
                    if (!this._owner.selectedSheet) {
                        return;
                    }
                    this._owner._clearCalcEngine();
                    this._owner.sortManager.sortDescriptions.sourceCollection = this._newValue.sortList.slice();
                    this._owner.sortManager.commitSort(false);
                    this._owner.sortManager._refresh();
                    if (!this._owner.itemsSource) {
                        this._owner._isCopyingOrUndoing = true;
                        this._owner.rows.clear();
                        this._owner.columns.clear();
                        this._owner.selectedSheet.grid.rows.clear();
                        this._owner.selectedSheet.grid.columns.clear();
                        for (rowIndex = 0; rowIndex < this._newValue.rows.length; rowIndex++) {
                            this._owner.rows.push(this._newValue.rows[rowIndex]);
                            // Synch the rows of the grid for current sheet.
                            this._owner.selectedSheet.grid.rows.push(this._newValue.rows[rowIndex]);
                        }
                        for (colIndex = 0; colIndex < this._newValue.columns.length; colIndex++) {
                            this._owner.columns.push(this._newValue.columns[colIndex]);
                            // Synch the columns of the grid for current sheet.
                            this._owner.selectedSheet.grid.columns.push(this._newValue.columns[colIndex]);
                        }
                        this._owner._isCopyingOrUndoing = false;
                        setTimeout(function () {
                            _this._owner.rows._dirty = true;
                            _this._owner.columns._dirty = true;
                            _this._owner.refresh(true);
                        }, 10);
                    }
                };
                /*
                 * Overrides the saveNewState method of its base class @see:_UndoAction.
                 */
                _SortColumnAction.prototype.saveNewState = function () {
                    var rowIndex, colIndex, columns = [], rows = [];
                    if (!this._owner.itemsSource) {
                        for (rowIndex = 0; rowIndex < this._owner.rows.length; rowIndex++) {
                            rows.push(this._owner.rows[rowIndex]);
                        }
                        for (colIndex = 0; colIndex < this._owner.columns.length; colIndex++) {
                            columns.push(this._owner.columns[colIndex]);
                        }
                    }
                    this._newValue = {
                        sortList: this._owner.sortManager._committedList.slice(),
                        rows: rows,
                        columns: columns
                    };
                    return true;
                };
                return _SortColumnAction;
            }(_UndoAction));
            sheet._SortColumnAction = _SortColumnAction;
            /*
             * Defines the _MoveCellsAction class.
             *
             * It deals with drag & drop the rows or columns to move or copy the cells action.
             */
            var _MoveCellsAction = (function (_super) {
                __extends(_MoveCellsAction, _super);
                /*
                 * Initializes a new instance of the @see:_MoveCellsAction class.
                 *
                 * @param owner The @see: FlexSheet control that the @see:_MoveCellsAction works for.
                 * @param draggingCells The @see: CellRange contains dragging target cells.
                 * @param droppingCells The @see: CellRange contains the dropping target cells.
                 * @param isCopyCells Indicates whether the action is moving or copying the cells.
                 */
                function _MoveCellsAction(owner, draggingCells, droppingCells, isCopyCells) {
                    var rowIndex, colIndex, cellIndex, val, cellStyle;
                    _super.call(this, owner);
                    if (!owner.selectedSheet) {
                        return;
                    }
                    if (draggingCells.topRow === 0 && draggingCells.bottomRow === owner.rows.length - 1) {
                        this._isDraggingColumns = true;
                    }
                    else {
                        this._isDraggingColumns = false;
                    }
                    this._isCopyCells = isCopyCells;
                    this._dragRange = draggingCells;
                    this._dropRange = droppingCells;
                    this._oldDroppingCells = [];
                    this._oldDroppingColumnSetting = {};
                    for (rowIndex = droppingCells.topRow; rowIndex <= droppingCells.bottomRow; rowIndex++) {
                        for (colIndex = droppingCells.leftCol; colIndex <= droppingCells.rightCol; colIndex++) {
                            if (this._isDraggingColumns) {
                                if (!this._oldDroppingColumnSetting[colIndex]) {
                                    this._oldDroppingColumnSetting[colIndex] = {
                                        dataType: owner.columns[colIndex].dataType,
                                        align: owner.columns[colIndex].align,
                                        format: owner.columns[colIndex].format
                                    };
                                }
                            }
                            cellIndex = rowIndex * this._owner.columns.length + colIndex;
                            if (this._owner.selectedSheet._styledCells[cellIndex]) {
                                cellStyle = JSON.parse(JSON.stringify(this._owner.selectedSheet._styledCells[cellIndex]));
                            }
                            else {
                                cellStyle = undefined;
                            }
                            val = this._owner.getCellData(rowIndex, colIndex, false);
                            this._oldDroppingCells.push({
                                rowIndex: rowIndex,
                                columnIndex: colIndex,
                                cellContent: val,
                                cellStyle: cellStyle
                            });
                        }
                    }
                    if (!isCopyCells) {
                        this._draggingCells = [];
                        this._draggingColumnSetting = {};
                        for (rowIndex = draggingCells.topRow; rowIndex <= draggingCells.bottomRow; rowIndex++) {
                            for (colIndex = draggingCells.leftCol; colIndex <= draggingCells.rightCol; colIndex++) {
                                if (this._isDraggingColumns) {
                                    if (!this._draggingColumnSetting[colIndex]) {
                                        this._draggingColumnSetting[colIndex] = {
                                            dataType: owner.columns[colIndex].dataType,
                                            align: owner.columns[colIndex].align,
                                            format: owner.columns[colIndex].format
                                        };
                                    }
                                }
                                cellIndex = rowIndex * this._owner.columns.length + colIndex;
                                if (this._owner.selectedSheet._styledCells[cellIndex]) {
                                    cellStyle = JSON.parse(JSON.stringify(this._owner.selectedSheet._styledCells[cellIndex]));
                                }
                                else {
                                    cellStyle = undefined;
                                }
                                val = this._owner.getCellData(rowIndex, colIndex, false);
                                this._draggingCells.push({
                                    rowIndex: rowIndex,
                                    columnIndex: colIndex,
                                    cellContent: val,
                                    cellStyle: cellStyle
                                });
                            }
                        }
                    }
                }
                /*
                 * Overrides the undo method of its base class @see:_UndoAction.
                 */
                _MoveCellsAction.prototype.undo = function () {
                    var self = this, index, moveCellActionValue, cellIndex, val, cellStyle, srcColIndex, descColIndex;
                    if (!self._owner.selectedSheet) {
                        return;
                    }
                    self._owner._clearCalcEngine();
                    for (index = 0; index < self._oldDroppingCells.length; index++) {
                        moveCellActionValue = self._oldDroppingCells[index];
                        self._owner.setCellData(moveCellActionValue.rowIndex, moveCellActionValue.columnIndex, moveCellActionValue.cellContent);
                        cellIndex = moveCellActionValue.rowIndex * self._owner.columns.length + moveCellActionValue.columnIndex;
                        if (moveCellActionValue.cellStyle) {
                            self._owner.selectedSheet._styledCells[cellIndex] = moveCellActionValue.cellStyle;
                        }
                        else {
                            delete self._owner.selectedSheet._styledCells[cellIndex];
                        }
                    }
                    if (self._isDraggingColumns && !!self._oldDroppingColumnSetting) {
                        Object.keys(self._oldDroppingColumnSetting).forEach(function (key) {
                            self._owner.columns[+key].dataType = self._oldDroppingColumnSetting[+key].dataType ? self._oldDroppingColumnSetting[+key].dataType : wijmo.DataType.Object;
                            self._owner.columns[+key].align = self._oldDroppingColumnSetting[+key].align;
                            self._owner.columns[+key].format = self._oldDroppingColumnSetting[+key].format;
                        });
                    }
                    if (!self._isCopyCells) {
                        for (index = 0; index < self._draggingCells.length; index++) {
                            moveCellActionValue = self._draggingCells[index];
                            self._owner.setCellData(moveCellActionValue.rowIndex, moveCellActionValue.columnIndex, moveCellActionValue.cellContent);
                            cellIndex = moveCellActionValue.rowIndex * self._owner.columns.length + moveCellActionValue.columnIndex;
                            if (moveCellActionValue.cellStyle) {
                                self._owner.selectedSheet._styledCells[cellIndex] = moveCellActionValue.cellStyle;
                            }
                        }
                        if (self._isDraggingColumns && !!self._draggingColumnSetting) {
                            Object.keys(self._draggingColumnSetting).forEach(function (key) {
                                self._owner.columns[+key].dataType = self._draggingColumnSetting[+key].dataType ? self._draggingColumnSetting[+key].dataType : wijmo.DataType.Object;
                                self._owner.columns[+key].align = self._draggingColumnSetting[+key].align;
                                self._owner.columns[+key].format = self._draggingColumnSetting[+key].format;
                            });
                        }
                        if (self._isDraggingColumns) {
                            if (self._dragRange.leftCol < self._dropRange.leftCol) {
                                descColIndex = self._dragRange.leftCol;
                                for (srcColIndex = self._dropRange.leftCol; srcColIndex <= self._dropRange.rightCol; srcColIndex++) {
                                    self._owner._updateColumnFiler(srcColIndex, descColIndex);
                                    descColIndex++;
                                }
                            }
                            else {
                                descColIndex = self._dragRange.rightCol;
                                for (srcColIndex = self._dropRange.rightCol; srcColIndex >= self._dropRange.leftCol; srcColIndex--) {
                                    self._owner._updateColumnFiler(srcColIndex, descColIndex);
                                    descColIndex--;
                                }
                            }
                        }
                    }
                };
                /*
                 * Overrides the redo method of its base class @see:_UndoAction.
                 */
                _MoveCellsAction.prototype.redo = function () {
                    var self = this, index, moveCellActionValue, cellIndex, val, cellStyle, srcColIndex, descColIndex;
                    if (!self._owner.selectedSheet) {
                        return;
                    }
                    self._owner._clearCalcEngine();
                    if (!self._isCopyCells) {
                        for (index = 0; index < self._draggingCells.length; index++) {
                            moveCellActionValue = self._draggingCells[index];
                            self._owner.setCellData(moveCellActionValue.rowIndex, moveCellActionValue.columnIndex, null);
                            cellIndex = moveCellActionValue.rowIndex * self._owner.columns.length + moveCellActionValue.columnIndex;
                            if (self._owner.selectedSheet._styledCells[cellIndex]) {
                                delete self._owner.selectedSheet._styledCells[cellIndex];
                            }
                        }
                        if (self._isDraggingColumns && !!self._draggingColumnSetting) {
                            Object.keys(self._draggingColumnSetting).forEach(function (key) {
                                self._owner.columns[+key].dataType = wijmo.DataType.Object;
                                self._owner.columns[+key].align = null;
                                self._owner.columns[+key].format = null;
                            });
                        }
                    }
                    for (index = 0; index < self._newDroppingCells.length; index++) {
                        moveCellActionValue = self._newDroppingCells[index];
                        self._owner.setCellData(moveCellActionValue.rowIndex, moveCellActionValue.columnIndex, moveCellActionValue.cellContent);
                        cellIndex = moveCellActionValue.rowIndex * self._owner.columns.length + moveCellActionValue.columnIndex;
                        if (moveCellActionValue.cellStyle) {
                            self._owner.selectedSheet._styledCells[cellIndex] = moveCellActionValue.cellStyle;
                        }
                        else {
                            delete self._owner.selectedSheet._styledCells[cellIndex];
                        }
                    }
                    if (self._isDraggingColumns && !!self._newDroppingColumnSetting) {
                        Object.keys(self._newDroppingColumnSetting).forEach(function (key) {
                            self._owner.columns[+key].dataType = self._newDroppingColumnSetting[+key].dataType ? self._newDroppingColumnSetting[+key].dataType : wijmo.DataType.Object;
                            self._owner.columns[+key].align = self._newDroppingColumnSetting[+key].align;
                            self._owner.columns[+key].format = self._newDroppingColumnSetting[+key].format;
                        });
                    }
                    if (self._isDraggingColumns && !self._isCopyCells) {
                        if (self._dragRange.leftCol > self._dropRange.leftCol) {
                            descColIndex = self._dropRange.leftCol;
                            for (srcColIndex = self._dragRange.leftCol; srcColIndex <= self._dragRange.rightCol; srcColIndex++) {
                                self._owner._updateColumnFiler(srcColIndex, descColIndex);
                                descColIndex++;
                            }
                        }
                        else {
                            descColIndex = self._dropRange.rightCol;
                            for (srcColIndex = self._dragRange.rightCol; srcColIndex >= self._dragRange.leftCol; srcColIndex--) {
                                self._owner._updateColumnFiler(srcColIndex, descColIndex);
                                descColIndex--;
                            }
                        }
                    }
                };
                /*
                 * Overrides the saveNewState method of its base class @see:_UndoAction.
                 */
                _MoveCellsAction.prototype.saveNewState = function () {
                    var rowIndex, colIndex, cellIndex, val, cellStyle;
                    if (!this._owner.selectedSheet) {
                        return false;
                    }
                    if (this._dropRange) {
                        this._newDroppingCells = [];
                        this._newDroppingColumnSetting = {};
                        for (rowIndex = this._dropRange.topRow; rowIndex <= this._dropRange.bottomRow; rowIndex++) {
                            for (colIndex = this._dropRange.leftCol; colIndex <= this._dropRange.rightCol; colIndex++) {
                                if (this._isDraggingColumns) {
                                    if (!this._newDroppingColumnSetting[colIndex]) {
                                        this._newDroppingColumnSetting[colIndex] = {
                                            dataType: this._owner.columns[colIndex].dataType,
                                            align: this._owner.columns[colIndex].align,
                                            format: this._owner.columns[colIndex].format
                                        };
                                    }
                                }
                                cellIndex = rowIndex * this._owner.columns.length + colIndex;
                                if (this._owner.selectedSheet._styledCells[cellIndex]) {
                                    cellStyle = JSON.parse(JSON.stringify(this._owner.selectedSheet._styledCells[cellIndex]));
                                }
                                else {
                                    cellStyle = undefined;
                                }
                                val = this._owner.getCellData(rowIndex, colIndex, false);
                                this._newDroppingCells.push({
                                    rowIndex: rowIndex,
                                    columnIndex: colIndex,
                                    cellContent: val,
                                    cellStyle: cellStyle
                                });
                            }
                        }
                        return true;
                    }
                    return false;
                };
                return _MoveCellsAction;
            }(_UndoAction));
            sheet._MoveCellsAction = _MoveCellsAction;
        })(sheet = grid.sheet || (grid.sheet = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_UndoAction.js.map