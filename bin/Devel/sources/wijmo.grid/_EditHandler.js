var wijmo;
(function (wijmo) {
    var grid;
    (function (grid) {
        'use strict';
        /**
         * Handles the grid's editing.
         */
        var _EditHandler = (function () {
            /**
             * Initializes a new instance of the @see:_EditHandler class.
             *
             * @param g @see:FlexGrid that owns this @see:_EditHandler.
             */
            function _EditHandler(g) {
                var _this = this;
                this._fullEdit = false;
                this._list = null;
                this._g = g;
                // raise input event when selecting from ListBox
                this._evtInput = document.createEvent('HTMLEvents');
                this._evtInput.initEvent('input', true, false);
                // finish editing when selection changes (commit row edits if row changed)
                g.selectionChanging.addHandler(function (s, e) {
                    // exit edit mode
                    _this.finishEditing();
                    // commit any pending edits
                    var oldrow = g._selHdl._sel.row;
                    if (oldrow != e.row) {
                        var len = g.rows.length, olditem = oldrow > -1 && oldrow < len ? g.rows[oldrow].dataItem : null, newitem = e.row > -1 && e.row < len ? g.rows[e.row].dataItem : null;
                        if (olditem != newitem) {
                            _this._commitRowEdits();
                        }
                    }
                });
                // commit row edits when losing focus
                g.lostFocus.addHandler(function () {
                    if (!_this._g.containsFocus()) {
                        var ae = wijmo.getActiveElement(); // TFS 121877, 122033 Bootstrap modal issue
                        if (!ae || getComputedStyle(ae).position != 'fixed') {
                            _this._commitRowEdits();
                        }
                    }
                });
                // commit edits when clicking non-cells (e.g. sort, drag, resize),
                // start editing when clicking on checkboxes
                g.addEventListener(g.hostElement, 'mousedown', function (e) {
                    // start actions on left button only: TFS 114623
                    if (e.defaultPrevented || e.button != 0) {
                        return;
                    }
                    // not while resizing...
                    if (g._mouseHdl._szRowCol) {
                        return;
                    }
                    // handle the event as usual
                    var sel = g.selection, ht = g.hitTest(e);
                    _this._htDown = null;
                    _this._cancelClick = false;
                    if (ht.cellType != grid.CellType.Cell && ht.cellType != grid.CellType.None) {
                        // mouse down on non-cell area: commit any pending edits
                        // **REVIEW: this is a fix for TFS 98332
                        if (!_this._lbx || !wijmo.contains(_this._lbx.hostElement, e.target)) {
                            _this._commitRowEdits();
                        }
                    }
                    else if (ht.cellType != grid.CellType.None) {
                        // start editing when clicking on checkboxes that are not the active editor
                        var edt = wijmo.tryCast(e.target, HTMLInputElement);
                        if (edt && edt.type == 'checkbox' && wijmo.hasClass(edt.parentElement, 'wj-cell')) {
                            if (edt != _this.activeEditor) {
                                // start editing the item that was clicked
                                _this.startEditing(false, ht.row, ht.col);
                                // toggle check after editing started
                                setTimeout(function () {
                                    edt = _this.activeEditor;
                                    if (edt && edt.type == 'checkbox') {
                                        edt.checked = !edt.checked;
                                        edt.focus(); // TFS 135943
                                        _this.finishEditing();
                                    }
                                    else {
                                        _this._cancelClick = true;
                                    }
                                });
                            }
                            else {
                                _this.finishEditing();
                            }
                        }
                        // handle drop-down items (even on editors)
                        var icon = document.elementFromPoint(e.clientX, e.clientY);
                        if (wijmo.closest(icon, '.' + grid.CellFactory._WJC_DROPDOWN)) {
                            _this._toggleListBox(ht.range);
                            _this._htDown = null;
                            e.preventDefault();
                            return;
                        }
                        // if the click was on the cursor cell, save the hit test info
                        // to start editing when we get the click event later 
                        if (edt == null && ht.row == sel.row && ht.col == sel.col) {
                            _this._htDown = ht;
                        }
                    }
                }, true);
                // start editing when the user clicks the selected cell
                g.addEventListener(g.hostElement, 'click', function (e) {
                    // prevent clicking on checkboxes when startEditing failed
                    if (_this._cancelClick) {
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                    }
                    // start editing when clicking a cell without an active editor
                    if (_this._htDown && !_this.activeEditor) {
                        var ht = g.hitTest(e);
                        if (ht.range.equals(_this._htDown.range)) {
                            _this.startEditing(true, ht.row, ht.col);
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
             * @return True if the edit operation started successfully.
             */
            _EditHandler.prototype.startEditing = function (fullEdit, r, c, focus) {
                if (fullEdit === void 0) { fullEdit = true; }
                // default row/col to current selection
                var g = this._g;
                r = wijmo.asNumber(r, true, true);
                c = wijmo.asNumber(c, true, true);
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
                    rng = new grid.CellRange(r, c);
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
                var e = new grid.CellRangeEventArgs(g.cells, rng);
                if (!g.onBeginningEdit(e)) {
                    return false;
                }
                // start editing item
                var ecv = wijmo.tryCast(g.collectionView, 'IEditableCollectionView');
                if (ecv) {
                    item = g.rows[r].dataItem;
                    ecv.editItem(item);
                }
                // save editing parameters
                this._fullEdit = fullEdit;
                this._rng = rng;
                this._list = null;
                var map = g.columns[c].dataMap;
                if (map) {
                    this._list = map.getDisplayValues(item);
                }
                // refresh to create and activate editor
                g.refresh(false);
                var edt = this._edt;
                if (edt) {
                    if (edt.type == 'checkbox') {
                        this._fullEdit = false; // no full edit on checkboxes...
                    }
                    else if (focus) {
                        wijmo.setSelectionRange(edt, 0, edt.value.length);
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
            };
            /**
             * Commits any pending edits and exits edit mode.
             *
             * @param cancel Whether pending edits should be canceled or committed.
             * @return True if the edit operation finished successfully.
             */
            _EditHandler.prototype.finishEditing = function (cancel) {
                if (cancel === void 0) { cancel = false; }
                // make sure we're editing
                var edt = this._edt;
                if (!edt) {
                    this._removeListBox();
                    return true;
                }
                // get parameters
                var g = this._g, rng = this._rng, e = new grid.CellRangeEventArgs(g.cells, rng), focus = this._g.containsFocus();
                // remove focus from editor
                // (to commit edits, important when using cell template editors)
                if (g.activeEditor && focus) {
                    var ctl = wijmo.Control.getControl(wijmo.closest(wijmo.getActiveElement(), '.wj-control'));
                    if (ctl && ctl != this._g) {
                        ctl.onLostFocus(e);
                    }
                }
                // edit ending
                e.cancel = cancel;
                g.onCellEditEnding(e);
                // apply edits
                if (!e.cancel) {
                    var value = edt.type == 'checkbox' ? edt.checked : edt.value;
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
            };
            Object.defineProperty(_EditHandler.prototype, "activeEditor", {
                /**
                 * Gets the <b>HTMLInputElement</b> that represents the cell editor currently active.
                 */
                get: function () {
                    return this._edt;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_EditHandler.prototype, "editRange", {
                /**
                 * Gets a @see:CellRange that identifies the cell currently being edited.
                 */
                get: function () {
                    return this._rng;
                },
                enumerable: true,
                configurable: true
            });
            // ** implementation
            // checks whether a cell can be edited
            _EditHandler.prototype._allowEditing = function (r, c) {
                var g = this._g;
                if (g.isReadOnly || g.selectionMode == grid.SelectionMode.None)
                    return false;
                if (r < 0 || r >= g.rows.length || g.rows[r].isReadOnly || !g.rows[r].isVisible)
                    return false;
                if (c < 0 || c >= g.columns.length || g.columns[c].isReadOnly || !g.columns[c].isVisible)
                    return false;
                if (g._getBindingColumn(g.cells, r, g.columns[c]).isReadOnly)
                    return false;
                return true;
            };
            // finish editing the current item
            _EditHandler.prototype._commitRowEdits = function () {
                this.finishEditing();
                var g = this._g, ecv = wijmo.tryCast(g.collectionView, 'IEditableCollectionView');
                if (ecv) {
                    if (ecv.currentEditItem) {
                        var e = new grid.CellRangeEventArgs(g.cells, g.selection);
                        g.onRowEditEnding(e);
                        ecv.commitEdit();
                        g.onRowEditEnded(e);
                    }
                }
            };
            // handles keyDown events while editing
            // returns true if the key was handled, false if the grid should handle it
            _EditHandler.prototype._keydown = function (e) {
                switch (e.keyCode) {
                    // F2 toggles edit mode
                    case wijmo.Key.F2:
                        this._fullEdit = !this._fullEdit;
                        e.preventDefault();
                        return true;
                    // F4 toggles ListBox
                    case wijmo.Key.F4:
                        this._toggleListBox(this._g.selection);
                        e.preventDefault();
                        return true;
                    // space toggles checkboxes
                    case wijmo.Key.Space:
                        var edt = this._edt;
                        if (edt && edt.type == 'checkbox') {
                            edt.checked = !edt.checked;
                            this.finishEditing();
                            e.preventDefault();
                        }
                        return true;
                    // enter, tab, escape finish editing
                    case wijmo.Key.Enter:
                    case wijmo.Key.Tab:
                        this.finishEditing();
                        return false;
                    case wijmo.Key.Escape:
                        this.finishEditing(true);
                        return true;
                    // cursor keys: ListBox selection/finish editing if not in full edit mode
                    case wijmo.Key.Up:
                    case wijmo.Key.Down:
                    case wijmo.Key.Left:
                    case wijmo.Key.Right:
                    case wijmo.Key.PageUp:
                    case wijmo.Key.PageDown:
                    case wijmo.Key.Home:
                    case wijmo.Key.End:
                        // if the ListBox is active, let it handle the key
                        if (this._lbx) {
                            return this._keydownListBox(e);
                        }
                        // open ListBox on alt up/down
                        if (e.altKey) {
                            switch (e.keyCode) {
                                case wijmo.Key.Up:
                                case wijmo.Key.Down:
                                    this._toggleListBox(this._g.selection);
                                    e.preventDefault();
                                    return true;
                            }
                        }
                        // finish editing if not in full-edit mode
                        if (!this._fullEdit) {
                            this.finishEditing();
                            return false;
                        }
                }
                // return true to let editor handle the key (not the grid)
                return true;
            };
            // handles keydown events when ListBox is visible
            _EditHandler.prototype._keydownListBox = function (e) {
                var handled = true;
                if (this._lbx) {
                    switch (e.keyCode) {
                        case wijmo.Key.Up:
                            if (e.altKey) {
                                this._toggleListBox(this._g.selection);
                            }
                            else if (this._lbx.selectedIndex > 0) {
                                this._lbx.selectedIndex--;
                            }
                            break;
                        case wijmo.Key.Down:
                            if (e.altKey) {
                                this._toggleListBox(this._g.selection);
                            }
                            else {
                                this._lbx.selectedIndex++;
                            }
                            break;
                        case wijmo.Key.Home:
                        case wijmo.Key.PageUp:
                            this._lbx.selectedIndex = 0;
                            break;
                        case wijmo.Key.End:
                        case wijmo.Key.PageDown:
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
            };
            // handles keyPress events while editing
            _EditHandler.prototype._keypress = function (e) {
                // auto-complete based on dataMap
                var edt = this._edt;
                if (edt && edt.type != 'checkbox' && e.target == edt &&
                    this._list && this._list.length > 0 && e.charCode >= 32) {
                    // get text up to selection start
                    var start = edt.selectionStart, text = edt.value.substr(0, start);
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
                            wijmo.setSelectionRange(edt, start, this._list[i].length);
                            edt.dispatchEvent(this._evtInput);
                            // eat the key and be done
                            e.preventDefault();
                            break;
                        }
                    }
                }
            };
            // shows the drop-down element for a cell (if it is not already visible)
            _EditHandler.prototype._toggleListBox = function (rng) {
                var g = this._g;
                // close select element if any; if this is the same cell, we're done
                if (this._lbx) {
                    this._removeListBox();
                    if (g.selection.contains(rng)) {
                        if (g.activeEditor) {
                            g.activeEditor.focus();
                        }
                        else if (!g.containsFocus()) {
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
                if (!wijmo.input || !this.startEditing(true, rng.row, rng.col, !lbxFocus)) {
                    return false;
                }
                // create and initialize the ListBox
                this._lbx = this._createListBox();
                this._lbx.showSelection();
                if (lbxFocus) {
                    this._lbx.focus();
                }
                return true;
            };
            // create the ListBox and add it to the document
            _EditHandler.prototype._createListBox = function () {
                var _this = this;
                var g = this._g, rng = this._rng, row = g.rows[rng.row], col = g._getBindingColumn(g.cells, rng.row, g.columns[rng.col]), div = document.createElement('div'), lbx = new wijmo.input.ListBox(div);
                // configure ListBox
                wijmo.addClass(div, 'wj-dropdown-panel');
                lbx.maxHeight = row.renderHeight * 4;
                lbx.itemsSource = col.dataMap.getDisplayValues(row.dataItem);
                lbx.selectedValue = g.activeEditor
                    ? g.activeEditor.value
                    : g.getCellData(rng.row, rng.col, true);
                wijmo.addClass(div, col.dropDownCssClass);
                // close ListBox on clicks
                lbx.addEventListener(lbx.hostElement, 'click', function () {
                    _this._removeListBox();
                    _this.finishEditing();
                });
                // close ListBox when losing focus
                lbx.lostFocus.addHandler(function () {
                    _this._removeListBox();
                });
                // update editor when the selected index changes
                lbx.selectedIndexChanged.addHandler(function () {
                    var edt = g.activeEditor;
                    if (edt) {
                        edt.value = _this._lbx.selectedValue;
                        edt.dispatchEvent(_this._evtInput);
                        wijmo.setSelectionRange(edt, 0, edt.value.length);
                    }
                });
                // show the popup
                wijmo.showPopup(div, g.getCellBoundingRect(rng.row, rng.col));
                // done
                return lbx;
            };
            // remove the ListBox element from the DOM and disconnect its event handlers
            _EditHandler.prototype._removeListBox = function () {
                if (this._lbx) {
                    wijmo.hidePopup(this._lbx.hostElement, true);
                    this._lbx.dispose();
                    this._lbx = null;
                }
            };
            return _EditHandler;
        }());
        grid._EditHandler = _EditHandler;
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_EditHandler.js.map