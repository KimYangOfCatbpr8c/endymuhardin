module wijmo.grid.sheet {
	'use strict';

	/**
	 * Controls undo and redo operations in the @see:FlexSheet.
	 */
	export class UndoStack {
		private MAX_STACK_SIZE = 500;
		private _owner: FlexSheet;
		private _stack = [];
		private _pointer = -1;
		private _pendingAction: _UndoAction;
		private _resizingTriggered = false;

		/**
		 * Initializes a new instance of the @see:UndoStack class.
		 *
		 * @param owner The @see:FlexSheet control that the @see:UndoStack works for.
		 */
        constructor(owner: FlexSheet) {
            var self = this;

            self._owner = owner;

			// Handles the cell edit action for editing cell
            self._owner.prepareCellForEdit.addHandler(self._initCellEditAction, self);
            self._owner.cellEditEnded.addHandler(() => {
				// For edit cell content.
                if (self._pendingAction instanceof _EditAction && !(<_EditAction>self._pendingAction).isPaste) {
                    self._afterProcessCellEditAction(self);
				}
            }, self);

            // Handles the cell edit action for copy\paste operation
            self._owner.pasting.addHandler(self._initCellEditActionForPasting, self);
            self._owner.pastingCell.addHandler((sender: FlexGrid, e: CellRangeEventArgs) => {
                if (self._pendingAction instanceof _EditAction) {
                    (<_EditAction>self._pendingAction).updateForPasting(e.range);
                }
            }, self);
            self._owner.pasted.addHandler(() => {
				// For paste content to the cell.
                if (self._pendingAction instanceof _EditAction && (<_EditAction>self._pendingAction).isPaste) {
                    self._afterProcessCellEditAction(self);
				}
            }, self);

			// Handles the resize column action
            self._owner.resizingColumn.addHandler((sender: FlexGrid, e: CellRangeEventArgs) => {
                if (!self._resizingTriggered) {
                    self._pendingAction = new _ColumnResizeAction(self._owner, e.panel, e.col);
                    self._resizingTriggered = true;
				}
            }, self)
            self._owner.resizedColumn.addHandler((sender: FlexGrid, e: CellRangeEventArgs) => {
                if (self._pendingAction instanceof _ColumnResizeAction && self._pendingAction.saveNewState()) {
                    self._addAction(self._pendingAction);
				}
                self._pendingAction = null;
                self._resizingTriggered = false;
            }, self);

			// Handles the resize row action
            self._owner.resizingRow.addHandler((sender: FlexGrid, e: CellRangeEventArgs) => {
                if (!self._resizingTriggered) {
                    self._pendingAction = new _RowResizeAction(self._owner, e.panel, e.row);
                    self._resizingTriggered = true;
				}
            }, self);
            self._owner.resizedRow.addHandler((sender: FlexGrid, e: CellRangeEventArgs) => {
                if (self._pendingAction instanceof _RowResizeAction && self._pendingAction.saveNewState()) {
                    self._addAction(self._pendingAction);
				}
                self._pendingAction = null;
                self._resizingTriggered = false;
            }, self);

			// Handle the changing rows\columns position action.
            self._owner.draggingRowColumn.addHandler((sender: FlexGrid, e: DraggingRowColumnEventArgs) => {
				if (e.isShiftKey) {
					if (e.isDraggingRows) {
                        self._pendingAction = new _RowsChangedAction(self._owner);
					} else {
                        self._pendingAction = new _ColumnsChangedAction(self._owner);
					}
				}
            }, self);
            self._owner.droppingRowColumn.addHandler(() => {
                if (self._pendingAction && self._pendingAction.saveNewState()) {
                    self._addAction(self._pendingAction);
				}
                self._pendingAction = null;
            }, self);
		}

		/**
		 * Checks whether the undo action can be performed.
		 */
		get canUndo(): boolean {
			return this._pointer > -1 && this._pointer < this._stack.length;
		}

		/**
		 * Checks whether the redo action can be performed.
		 */
		get canRedo(): boolean {
			return this._pointer + 1 > -1 && this._pointer + 1 < this._stack.length;
		}

		/**
		 * Occurs after the undo stack has changed.
		 */
		undoStackChanged = new Event();
		/**
		 * Raises the <b>undoStackChanged</b> event.
		 */
		onUndoStackChanged() {
			this.undoStackChanged.raise(this);
		}

		/**
		 * Undo the latest action.
		 */
		undo() {
			var action: _UndoAction;
			if (this.canUndo) {
				action = this._stack[this._pointer];
				this._beforeUndoRedo(action);
				action.undo();
				this._pointer--;
				this.onUndoStackChanged();
			}
		}

		/**
		 * Redo the latest undone action.
		 */
		redo() {
			var action: _UndoAction;
			if (this.canRedo) {
				this._pointer++;
				action = this._stack[this._pointer];
				this._beforeUndoRedo(action);
				action.redo();
				this.onUndoStackChanged();
			}
		}

		/*
		 * Add the undo action into the undo stack.
		 *
		 * @param action The @see:_UndoAction undo/redo processing actions.
		 */
		_addAction(action: _UndoAction) {
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
		}

		/**
		 * Clears the undo stack.
		 */
		clear() {
			this._stack.length = 0;
		}

        // initialize the cell edit action.
        private _initCellEditAction(sender: any, args: CellRangeEventArgs) {
            this._pendingAction = new _EditAction(this._owner, args.range);
		}

		// initialize the cell edit action for pasting action.
		private _initCellEditActionForPasting() {
            this._pendingAction = new _EditAction(this._owner);
			(<_EditAction>this._pendingAction).markIsPaste();
        }

		// after processing the cell edit action.
		private _afterProcessCellEditAction(self: UndoStack) {
			if (self._pendingAction instanceof _EditAction && self._pendingAction.saveNewState()) {
				self._addAction(this._pendingAction);
			}
			self._pendingAction = null;
		}

		// Called before an action is undone or redone.
		private _beforeUndoRedo(action: _UndoAction) {
			this._owner.selectedSheetIndex = action.sheetIndex;
		}
	}
}