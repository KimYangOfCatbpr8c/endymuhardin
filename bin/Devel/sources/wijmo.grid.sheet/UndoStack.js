var wijmo;
(function (wijmo) {
    var grid;
    (function (grid) {
        var sheet;
        (function (sheet) {
            'use strict';
            /**
             * Controls undo and redo operations in the @see:FlexSheet.
             */
            var UndoStack = (function () {
                /**
                 * Initializes a new instance of the @see:UndoStack class.
                 *
                 * @param owner The @see:FlexSheet control that the @see:UndoStack works for.
                 */
                function UndoStack(owner) {
                    this.MAX_STACK_SIZE = 500;
                    this._stack = [];
                    this._pointer = -1;
                    this._resizingTriggered = false;
                    /**
                     * Occurs after the undo stack has changed.
                     */
                    this.undoStackChanged = new wijmo.Event();
                    var self = this;
                    self._owner = owner;
                    // Handles the cell edit action for editing cell
                    self._owner.prepareCellForEdit.addHandler(self._initCellEditAction, self);
                    self._owner.cellEditEnded.addHandler(function () {
                        // For edit cell content.
                        if (self._pendingAction instanceof sheet._EditAction && !self._pendingAction.isPaste) {
                            self._afterProcessCellEditAction(self);
                        }
                    }, self);
                    // Handles the cell edit action for copy\paste operation
                    self._owner.pasting.addHandler(self._initCellEditActionForPasting, self);
                    self._owner.pastingCell.addHandler(function (sender, e) {
                        if (self._pendingAction instanceof sheet._EditAction) {
                            self._pendingAction.updateForPasting(e.range);
                        }
                    }, self);
                    self._owner.pasted.addHandler(function () {
                        // For paste content to the cell.
                        if (self._pendingAction instanceof sheet._EditAction && self._pendingAction.isPaste) {
                            self._afterProcessCellEditAction(self);
                        }
                    }, self);
                    // Handles the resize column action
                    self._owner.resizingColumn.addHandler(function (sender, e) {
                        if (!self._resizingTriggered) {
                            self._pendingAction = new sheet._ColumnResizeAction(self._owner, e.panel, e.col);
                            self._resizingTriggered = true;
                        }
                    }, self);
                    self._owner.resizedColumn.addHandler(function (sender, e) {
                        if (self._pendingAction instanceof sheet._ColumnResizeAction && self._pendingAction.saveNewState()) {
                            self._addAction(self._pendingAction);
                        }
                        self._pendingAction = null;
                        self._resizingTriggered = false;
                    }, self);
                    // Handles the resize row action
                    self._owner.resizingRow.addHandler(function (sender, e) {
                        if (!self._resizingTriggered) {
                            self._pendingAction = new sheet._RowResizeAction(self._owner, e.panel, e.row);
                            self._resizingTriggered = true;
                        }
                    }, self);
                    self._owner.resizedRow.addHandler(function (sender, e) {
                        if (self._pendingAction instanceof sheet._RowResizeAction && self._pendingAction.saveNewState()) {
                            self._addAction(self._pendingAction);
                        }
                        self._pendingAction = null;
                        self._resizingTriggered = false;
                    }, self);
                    // Handle the changing rows\columns position action.
                    self._owner.draggingRowColumn.addHandler(function (sender, e) {
                        if (e.isShiftKey) {
                            if (e.isDraggingRows) {
                                self._pendingAction = new sheet._RowsChangedAction(self._owner);
                            }
                            else {
                                self._pendingAction = new sheet._ColumnsChangedAction(self._owner);
                            }
                        }
                    }, self);
                    self._owner.droppingRowColumn.addHandler(function () {
                        if (self._pendingAction && self._pendingAction.saveNewState()) {
                            self._addAction(self._pendingAction);
                        }
                        self._pendingAction = null;
                    }, self);
                }
                Object.defineProperty(UndoStack.prototype, "canUndo", {
                    /**
                     * Checks whether the undo action can be performed.
                     */
                    get: function () {
                        return this._pointer > -1 && this._pointer < this._stack.length;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(UndoStack.prototype, "canRedo", {
                    /**
                     * Checks whether the redo action can be performed.
                     */
                    get: function () {
                        return this._pointer + 1 > -1 && this._pointer + 1 < this._stack.length;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Raises the <b>undoStackChanged</b> event.
                 */
                UndoStack.prototype.onUndoStackChanged = function () {
                    this.undoStackChanged.raise(this);
                };
                /**
                 * Undo the latest action.
                 */
                UndoStack.prototype.undo = function () {
                    var action;
                    if (this.canUndo) {
                        action = this._stack[this._pointer];
                        this._beforeUndoRedo(action);
                        action.undo();
                        this._pointer--;
                        this.onUndoStackChanged();
                    }
                };
                /**
                 * Redo the latest undone action.
                 */
                UndoStack.prototype.redo = function () {
                    var action;
                    if (this.canRedo) {
                        this._pointer++;
                        action = this._stack[this._pointer];
                        this._beforeUndoRedo(action);
                        action.redo();
                        this.onUndoStackChanged();
                    }
                };
                /*
                 * Add the undo action into the undo stack.
                 *
                 * @param action The @see:_UndoAction undo/redo processing actions.
                 */
                UndoStack.prototype._addAction = function (action) {
                    // trim stack
                    if (this._stack.length > 0 && this._stack.length > this._pointer + 1) {
                        this._stack.splice(this._pointer + 1, this._stack.length - this._pointer - 1);
                    }
                    if (this._stack.length >= this.MAX_STACK_SIZE) {
                        this._stack.splice(0, this._stack.length - this.MAX_STACK_SIZE + 1);
                    }
                    // update pointer and add action to stack
                    this._pointer = this._stack.length;
                    this._stack.push(action);
                    this.onUndoStackChanged();
                };
                /**
                 * Clears the undo stack.
                 */
                UndoStack.prototype.clear = function () {
                    this._stack.length = 0;
                };
                // initialize the cell edit action.
                UndoStack.prototype._initCellEditAction = function (sender, args) {
                    this._pendingAction = new sheet._EditAction(this._owner, args.range);
                };
                // initialize the cell edit action for pasting action.
                UndoStack.prototype._initCellEditActionForPasting = function () {
                    this._pendingAction = new sheet._EditAction(this._owner);
                    this._pendingAction.markIsPaste();
                };
                // after processing the cell edit action.
                UndoStack.prototype._afterProcessCellEditAction = function (self) {
                    if (self._pendingAction instanceof sheet._EditAction && self._pendingAction.saveNewState()) {
                        self._addAction(this._pendingAction);
                    }
                    self._pendingAction = null;
                };
                // Called before an action is undone or redone.
                UndoStack.prototype._beforeUndoRedo = function (action) {
                    this._owner.selectedSheetIndex = action.sheetIndex;
                };
                return UndoStack;
            }());
            sheet.UndoStack = UndoStack;
        })(sheet = grid.sheet || (grid.sheet = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=UndoStack.js.map