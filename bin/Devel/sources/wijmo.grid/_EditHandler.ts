module wijmo.grid {
    'use strict';

    /**
     * Handles the grid's editing.
     */
    export class _EditHandler {
        _g: FlexGrid;
        _rng: CellRange;
        _edt: HTMLInputElement;
        _lbx: input.ListBox;
        _htDown: HitTestInfo;
        _cancelClick: boolean;
        _fullEdit = false;
        _list = null;
        _evtInput: any;

        /**
         * Initializes a new instance of the @see:_EditHandler class.
         *
         * @param g @see:FlexGrid that owns this @see:_EditHandler.
         */
        constructor(g: FlexGrid) {
            this._g = g;

            // raise input event when selecting from ListBox
            this._evtInput = document.createEvent('HTMLEvents');
            this._evtInput.initEvent('input', true, false);

            // finish editing when selection changes (commit row edits if row changed)
            g.selectionChanging.addHandler((s, e: CellRangeEventArgs) => {
                if (this.finishEditing()) {
                    var oldrow = g._selHdl._sel.row;
                    if (oldrow != e.row) {
                        var len = g.rows.length,
                            olditem = oldrow > -1 && oldrow < len ? g.rows[oldrow].dataItem : null,
                            newitem = e.row > -1 && e.row < len ? g.rows[e.row].dataItem : null;
                        if (olditem != newitem) {
                            this._commitRowEdits();
                        }
                    }
                } else {
                    e.cancel = true; // staying in edit mode, keep selection
                }
            });

            // commit row edits when losing focus
            g.lostFocus.addHandler(() => {
                if (!this._g.containsFocus()) {
                    var ae = getActiveElement(); // TFS 121877, 122033 Bootstrap modal issue
                    if (!ae || getComputedStyle(ae).position != 'fixed') {
                        this._commitRowEdits();
                    }
                }
            });

            // commit edits when clicking non-cells (e.g. sort, drag, resize),
            // start editing when clicking on checkboxes
            g.addEventListener(g.hostElement, 'mousedown', (e) => {

                // start actions on left button only: TFS 114623
                if (e.defaultPrevented || e.button != 0) { 
                    return;
                }

                // not while resizing...
                if (g._mouseHdl._szRowCol) {
                    return;
                }

                // handle the event as usual
                var sel = g.selection,
                    ht = g.hitTest(e);
                this._htDown = null;
                this._cancelClick = false;
                if (ht.cellType != CellType.Cell && ht.cellType != CellType.None) {

                    // mouse down on non-cell area: commit any pending edits
                    // **REVIEW: this is a fix for TFS 98332
                    if (!this._lbx || !contains(this._lbx.hostElement, <HTMLElement>e.target)) {
                        this._commitRowEdits();
                    }

                } else if (ht.cellType != CellType.None) {

                    // start editing when clicking on checkboxes that are not the active editor
                    var edt = <HTMLInputElement>tryCast(e.target, HTMLInputElement);
                    if (edt && edt.type == 'checkbox' && hasClass(edt.parentElement, 'wj-cell')) {
                        if (edt != this.activeEditor) {

                            // start editing the item that was clicked
                            this.startEditing(false, ht.row, ht.col);

                            // toggle check after editing started
                            setTimeout(() => {
                                edt = this.activeEditor;
                                if (edt && edt.type == 'checkbox') {
                                    edt.checked = !edt.checked;
                                    edt.focus(); // TFS 135943
                                    this.finishEditing();
                                } else {
                                    this._cancelClick = true;
                                }
                            });
                        } else {
                            this.finishEditing();
                        }
                    }

                    // handle drop-down items (even on editors)
                    var icon = document.elementFromPoint(e.clientX, e.clientY);
                    if (closest(icon, '.' + CellFactory._WJC_DROPDOWN)) {
                        this._toggleListBox(e, ht.range);
                        this._htDown = null;
                        e.preventDefault();
                        return;
                    }

                    // if the click was on the cursor cell, save the hit test info
                    // to start editing when we get the click event later 
                    if (edt == null && ht.row == sel.row && ht.col == sel.col) {
                        this._htDown = ht;
                    }
                }
            }, true);

            // start editing when the user clicks the selected cell
            g.addEventListener(g.hostElement, 'click', (e) => {

                // prevent clicking on checkboxes when startEditing failed
                if (this._cancelClick) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }

                // start editing when clicking a cell without an active editor
                if (this._htDown && !this.activeEditor) {
                    var ht = g.hitTest(e);
                    if (ht.range.equals(this._htDown.range)) {
                        this.startEditing(true, ht.row, ht.col, true, e);
                    }
                }
            }, true);
        }
        /**
         * Starts editing a given cell.
         *
         * @param fullEdit Whether to stay in edit mode when the user presses the cursor keys. Defaults to false.
         * @param r Index of the row to be edited. Defaults to the currently selected row.
         * @param c Index of the column to be edited. Defaults to the currently selected column.
         * @param focus Whether to give the editor the focus. Defaults to true.
         * @param evt Event that triggered this action (usually a keypress or keydown).
         * @return True if the edit operation started successfully.
         */
        startEditing(fullEdit = true, r?: number, c?: number, focus?: boolean, evt?: any): boolean {

            // default row/col to current selection
            var g = this._g;
            r = asNumber(r, true, true);
            c = asNumber(c, true, true);
            if (r == null) {
                r = g.selection.row;
            }
            if (c == null) {
                c = g.selection.col;
            }

            // default focus to true
            if (focus == null) {
                focus = true;
            }

            // check that the cell is editable
            if (!this._allowEditing(r, c)) {
                return false;
            }

            // get edit range
            var rng = g.getMergedRange(g.cells, r, c);
            if (!rng) {
                rng = new CellRange(r, c);
            }

            // get item to be edited
            var item = g.rows[r].dataItem;

            // make sure cell is selected
            g.select(rng, true);

            // check that we still have the same item after moving the selection (TFS 110143)
            if (!g.rows[r] || item != g.rows[r].dataItem) {
                return false;
            }

            // no work if we are already editing this cell
            if (rng.equals(this._rng)) {
                return true;
            }

            // start editing cell
            var e = new CellRangeEventArgs(g.cells, rng, evt);
            if (!g.onBeginningEdit(e)) {
                return false;
            }

            // start editing item
            var ecv = tryCast(g.collectionView, 'IEditableCollectionView');
            if (ecv) {
                item = g.rows[r].dataItem;
                var rowEditStarting = item != ecv.currentEditItem;
                if (rowEditStarting) {
                    g.onRowEditStarting(e);
                }
                ecv.editItem(item);
                if (rowEditStarting) {
                    g.onRowEditStarted(e);
                }
            }

            // save editing parameters
            this._fullEdit = fullEdit;
            this._rng = rng;
            this._list = null;
            var map = <DataMap>g.columns[c].dataMap;
            if (map) {
                this._list = map.getDisplayValues(item);
            }

            // refresh to create and activate editor
            g.refresh(false);
            var edt = this._edt;
            if (edt) {
                if (edt.type == 'checkbox') {
                    this._fullEdit = false; // no full edit on checkboxes...
                } else if (focus) {
                    setSelectionRange(edt, 0, edt.value.length);
                }
                g.onPrepareCellForEdit(e);

                // give the editor the focus in case it doesn't have it
                // NOTE: this happens on Android, it's strange...
                edt = this._edt;
                if (edt && focus) {
                    edt.focus();
                }
            }

            // done
            return true;
        }
        /**
         * Commits any pending edits and exits edit mode.
         *
         * @param cancel Whether pending edits should be canceled or committed.
         * @return True if the edit operation finished successfully.
         */
        finishEditing(cancel = false): boolean {

            // make sure we're editing
            var edt = this._edt;
            if (!edt) {
                this._removeListBox();
                return true;
            }

            // get parameters
            var g = this._g,
                rng = this._rng,
                e = new CellEditEndingEventArgs(g.cells, rng),
                focus = this._g.containsFocus();

            // remove focus from editor
            // (to commit edits, important when using cell template editors)
            if (edt && focus) {
                var ctl = wijmo.Control.getControl(closest(getActiveElement(), '.wj-control'));
                if (ctl && ctl != this._g) { // TFS 203106
                    ctl.onLostFocus(e);
                }
            }

            // validate edits
            e.cancel = cancel;
            if (!cancel && g.validateEdits) {
                var error = this._getValidationError();
                if (error) {
                    wijmo.toggleClass(edt.parentElement, 'wj-state-invalid', true);
                    edt.parentElement.title = error;
                    e.cancel = e.stayInEditMode = true;
                }
            }

            // stay in edit mode if the grid has focus and validation fails
            if (!g.onCellEditEnding(e) && e.stayInEditMode && focus) {
                if (focus && edt) {
                    setTimeout(() => {
                        edt.select();
                    });
                }
                return false; // continue editing
            }

            // apply edits
            if (!e.cancel) {
                var value: any = edt.type == 'checkbox' ? edt.checked : edt.value;
                for (var r = rng.topRow; r <= rng.bottomRow && r < g.rows.length; r++) {
                    for (var c = rng.leftCol; c <= rng.rightCol && c < g.columns.length; c++) {
                        g.cells.setCellData(r, c, value, true);
                    }
                }
            }

            // dispose of editor
            this._edt = null;
            this._rng = null;
            this._list = null;
            this._removeListBox();

            // refresh to replace the editor with regular content
            g.refresh(false);

            // restore focus
            if (focus) {
                g.focus();
            }

            // edit ended
            g.onCellEditEnded(e);

            // done
            return true;
        }
        /**
         * Gets the <b>HTMLInputElement</b> that represents the cell editor currently active.
         */
        get activeEditor(): HTMLInputElement {
            return this._edt;
        }
        /**
         * Gets a @see:CellRange that identifies the cell currently being edited.
         */
        get editRange(): CellRange {
            return this._rng;
        }

        // ** implementation

        // gets a validation error for the cell currently being edited
        _getValidationError(): string {
            var g = this._g,
                view = g.collectionView,
                getError = view ? view['getError'] : null;

            // check that the grid is bound to a validating collection
            if (isFunction(getError)) {
                var rng = this._rng,
                    col = g._getBindingColumn(g.cells, rng.row, g.columns[rng.col]),
                    item = g.rows[rng.row].dataItem,
                    binding = col.binding,
                    dataType = col.dataType,
                    edt = this._edt,
                    val = edt.type == 'checkbox' ? edt.checked : edt.value,
                    error = null;

                // coerce the value
                val = wijmo.changeType(val, dataType, col.format);
                if (wijmo.getType(val) == dataType) {

                    // validate the cell
                    var oldVal = col._binding.getValue(item);
                    col._binding.setValue(item, val);
                    error = getError(item, binding);
                    col._binding.setValue(item, oldVal);
                    return error;
                }
            }

            // no errors found
            return null;
        }

        // checks whether a cell can be edited
        _allowEditing(r: number, c: number): boolean {
            var g = this._g;
            if (g.isReadOnly || g.selectionMode == SelectionMode.None) return false;
            if (r < 0 || r >= g.rows.length || g.rows[r].isReadOnly || !g.rows[r].isVisible) return false;
            if (c < 0 || c >= g.columns.length) return false;
            var col = g._getBindingColumn(g.cells, r, g.columns[c]);
            if (col && (col.isReadOnly || !col.isVisible)) return false;
            return true;
        }

        // finish editing the current item
        _commitRowEdits() {
            this.finishEditing();
            var g = this._g,
                ecv = tryCast(g.collectionView, 'IEditableCollectionView');
            if (ecv) {
                if (ecv.currentEditItem) { // || ecv.currentAddItem) { // TFS: 206038
                    var e = new CellRangeEventArgs(g.cells, g.selection);
                    g.onRowEditEnding(e);
                    ecv.commitEdit();
                    g.onRowEditEnded(e);
                }
            }
        }

        // handles keyDown events while editing
        // returns true if the key was handled, false if the grid should handle it
        _keydown(e: KeyboardEvent): boolean {
            switch (e.keyCode) {

                // F2 toggles edit mode
                case Key.F2:
                    this._fullEdit = !this._fullEdit;
                    e.preventDefault();
                    return true;

                // F4 toggles ListBox
                case Key.F4:
                    this._toggleListBox(e);
                    e.preventDefault();
                    return true;

                // space toggles checkboxes
                case Key.Space:
                    var edt = this._edt;
                    if (edt && edt.type == 'checkbox') {
                        edt.checked = !edt.checked;
                        this.finishEditing();
                        e.preventDefault();
                    }
                    return true;

                // enter, tab, escape finish editing
                case Key.Enter:
                case Key.Tab:
                    e.preventDefault();
                    return !this.finishEditing(); // let grid handle key if editing finished
                case Key.Escape:
                    e.preventDefault();
                    this.finishEditing(true);
                    return true;

                // cursor keys: ListBox selection/finish editing if not in full edit mode
                case Key.Up:
                case Key.Down:
                case Key.Left:
                case Key.Right:
                case Key.PageUp:
                case Key.PageDown:
                case Key.Home:
                case Key.End:

                    // if the ListBox is active, let it handle the key
                    if (this._lbx) {
                        return this._keydownListBox(e);
                    }

                    // open ListBox on alt up/down
                    if (e.altKey) {
                        switch (e.keyCode) {
                            case Key.Up:
                            case Key.Down:
                                this._toggleListBox(e);
                                e.preventDefault();
                                return true;
                        }
                    }

                    // finish editing if not in full-edit mode
                    if (!this._fullEdit) {
                        if (this.finishEditing()) {
                            return false;
                        }
                    }
            }

            // key has been handled
            return true;
        }

        // handles keydown events when ListBox is visible
        _keydownListBox(e: KeyboardEvent) {
            var handled = true;
            if (this._lbx) {
                switch (e.keyCode) {
                    case Key.Up:
                        if (e.altKey) {
                            this._toggleListBox(e);
                        } else if (this._lbx.selectedIndex > 0) {
                            this._lbx.selectedIndex--;
                        }
                        break;
                    case Key.Down:
                        if (e.altKey) {
                            this._toggleListBox(e);
                        } else {
                            this._lbx.selectedIndex++;
                        }
                        break;
                    case Key.Home:
                    case Key.PageUp:
                        this._lbx.selectedIndex = 0;
                        break;
                    case Key.End:
                    case Key.PageDown:
                        this._lbx.selectedIndex = this._lbx.collectionView.items.length - 1;
                        break;
                    default:
                        handled = false;
                        break;
                }
            }

            // if handled, we're done
            if (handled) {
                e.preventDefault();
                return true;
            }

            // return false to let the grid handle the key
            return false;
        }

        // handles keyPress events while editing
        _keypress(e: KeyboardEvent) {

            // auto-complete based on dataMap
            var edt = this._edt;
            if (edt && edt.type != 'checkbox' && e.target == edt &&
                this._list && this._list.length > 0 && e.charCode >= 32) {

                // get text up to selection start
                var start = edt.selectionStart,
                    text = edt.value.substr(0, start);

                // add the new char if the source element is the editor
                // (but not if the source element is the grid!)
                if (e.target == edt) {
                    start++;
                    text += String.fromCharCode(e.charCode);
                }

                // convert to lower-case for matching
                text = text.toLowerCase();

                // look for a match
                for (var i = 0; i < this._list.length; i++) {
                    if (this._list[i].toLowerCase().indexOf(text) == 0) {

                        // found the match, update text and selection
                        edt.value = this._list[i];
                        setSelectionRange(edt, start, this._list[i].length);
                        edt.dispatchEvent(this._evtInput);

                        // eat the key and be done
                        e.preventDefault();
                        break;
                    }
                }
            }
        }

        // shows the drop-down element for a cell (if it is not already visible)
        _toggleListBox(evt: any, rng?: CellRange): boolean {
            var g = this._g;

            // if a range was not specified, use current selection
            if (!rng) {
                rng = g.selection;
            }

            // close select element if any; if this is the same cell, we're done
            if (this._lbx) {
                this._removeListBox();
                if (g.selection.contains(rng)) {
                    if (g.activeEditor) {
                        g.activeEditor.focus();
                    } else if (!g.containsFocus()) {
                        g.focus();
                    }
                    return true;
                }
            }

            // if this was a touch, give focus to ListBox to hide soft keyboard
            var lbxFocus = g.isTouching;

            // check that we have a drop-down
            var bcol = g._getBindingColumn(g.cells, rng.row, g.columns[rng.col]);
            if (!wijmo.input || !bcol.dataMap || bcol.showDropDown === false) {
                return false;
            }

            // start editing so we can position the select element
            if (!wijmo.input || !this.startEditing(true, rng.row, rng.col, !lbxFocus, evt)) {
                return false;
            }

            // create and initialize the ListBox
            this._lbx = this._createListBox();
            this._lbx.showSelection();
            if (lbxFocus) {
                this._lbx.focus();
            }
            return true;
        }

        // create the ListBox and add it to the document
        private _createListBox(): input.ListBox {
            var g = this._g,
                rng = this._rng,
                row = g.rows[rng.row],
                col = g._getBindingColumn(g.cells, rng.row, g.columns[rng.col]),
                div = document.createElement('div'),
                lbx = new input.ListBox(div);

            // configure ListBox
            addClass(div, 'wj-dropdown-panel');
            lbx.maxHeight = row.renderHeight * 4;
            lbx.itemsSource = col.dataMap.getDisplayValues(row.dataItem);
            lbx.selectedValue = g.activeEditor
                ? g.activeEditor.value
                : g.getCellData(rng.row, rng.col, true);
            addClass(div, col.dropDownCssClass);

            // close ListBox on clicks
            lbx.addEventListener(lbx.hostElement, 'click', () => {
                this._removeListBox();
                this.finishEditing();
            });

            // close ListBox when losing focus
            lbx.lostFocus.addHandler(() => {
                this._removeListBox();
            });

            // update editor when the selected index changes
            lbx.selectedIndexChanged.addHandler(() => {
                var edt = g.activeEditor;
                if (edt) {
                    edt.value = this._lbx.selectedValue;
                    edt.dispatchEvent(this._evtInput);
                    setSelectionRange(edt, 0, edt.value.length);
                }
            });

            // show the popup
            showPopup(div, g.getCellBoundingRect(rng.row, rng.col));

            // done
            return lbx;
        }

        // remove the ListBox element from the DOM and disconnect its event handlers
        private _removeListBox() {
            if (this._lbx) {
                hidePopup(this._lbx.hostElement, true);
                this._lbx.dispose();
                this._lbx = null;
            }
        }
    }
}