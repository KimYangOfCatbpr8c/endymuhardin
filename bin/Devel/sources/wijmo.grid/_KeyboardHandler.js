var wijmo;
(function (wijmo) {
    var grid;
    (function (grid) {
        'use strict';
        /**
         * Handles the grid's keyboard commands.
         */
        var _KeyboardHandler = (function () {
            /**
             * Initializes a new instance of the @see:_KeyboardHandler class.
             *
             * @param g @see:FlexGrid that owns this @see:_KeyboardHandler.
             */
            function _KeyboardHandler(g) {
                this._g = g;
                g.addEventListener(g.hostElement, 'keypress', this._keypress.bind(this));
                g.addEventListener(g.hostElement, 'keydown', this._keydown.bind(this));
            }
            // handles the key down event (selection)
            /*private*/ _KeyboardHandler.prototype._keydown = function (e) {
                var g = this._g, sel = g.selection, ctrl = e.ctrlKey || e.metaKey, shift = e.shiftKey, target = e.target, handled = true;
                if (g.isRangeValid(sel) && !e.defaultPrevented) {
                    // allow input elements that don't belong to us to handle keys (TFS 131138, 191989)
                    if (!g.activeEditor && g._isInputElement(target) && !target.getAttribute('wj-part')) {
                        return;
                    }
                    // pre-process keys while editor is active
                    if (g.activeEditor && g._edtHdl._keydown(e)) {
                        return;
                    }
                    // get the variables we need
                    var gr = wijmo.tryCast(g.rows[sel.row], grid.GroupRow), ecv = wijmo.tryCast(g.collectionView, 'IEditableCollectionView'), keyCode = e.keyCode;
                    // handle clipboard
                    if (g.autoClipboard) {
                        // copy: ctrl+c or ctrl+Insert
                        if (ctrl && (keyCode == 67 || keyCode == 45)) {
                            var args = new grid.CellRangeEventArgs(g.cells, sel);
                            if (g.onCopying(args)) {
                                var text = g.getClipString();
                                wijmo.Clipboard.copy(text);
                                g.onCopied(args);
                            }
                            e.stopPropagation();
                            return;
                        }
                        // paste: ctrl+v or shift+Insert
                        if ((ctrl && keyCode == 86) || (shift && keyCode == 45)) {
                            if (!g.isReadOnly) {
                                var args = new grid.CellRangeEventArgs(g.cells, sel);
                                if (g.onPasting(args)) {
                                    wijmo.Clipboard.paste(function (text) {
                                        g.setClipString(text);
                                        g.onPasted(args);
                                    });
                                }
                            }
                            e.stopPropagation();
                            return;
                        }
                    }
                    // reverse left/right keys when rendering in right-to-left
                    if (g._rtl) {
                        switch (keyCode) {
                            case wijmo.Key.Left:
                                keyCode = wijmo.Key.Right;
                                break;
                            case wijmo.Key.Right:
                                keyCode = wijmo.Key.Left;
                                break;
                        }
                    }
                    // default key handling
                    switch (keyCode) {
                        case 65:
                            if (ctrl) {
                                g.select(new grid.CellRange(0, 0, g.rows.length - 1, g.columns.length - 1));
                            }
                            else {
                                handled = false;
                            }
                            break;
                        case wijmo.Key.Left:
                            if (sel.isValid && sel.col == 0 && gr != null && !gr.isCollapsed && gr.hasChildren) {
                                gr.isCollapsed = true;
                            }
                            else {
                                this._moveSel(grid.SelMove.None, ctrl ? grid.SelMove.Home : grid.SelMove.Prev, shift);
                            }
                            break;
                        case wijmo.Key.Right:
                            if (sel.isValid && sel.col == 0 && gr != null && gr.isCollapsed) {
                                gr.isCollapsed = false;
                            }
                            else {
                                this._moveSel(grid.SelMove.None, ctrl ? grid.SelMove.End : grid.SelMove.Next, shift);
                            }
                            break;
                        case wijmo.Key.Up:
                            if (e.altKey && g._edtHdl._toggleListBox(this._g.selection)) {
                                break;
                            }
                            this._moveSel(ctrl ? grid.SelMove.Home : grid.SelMove.Prev, grid.SelMove.None, shift);
                            break;
                        case wijmo.Key.Down:
                            if (e.altKey && g._edtHdl._toggleListBox(this._g.selection)) {
                                break;
                            }
                            this._moveSel(ctrl ? grid.SelMove.End : grid.SelMove.Next, grid.SelMove.None, shift);
                            break;
                        case wijmo.Key.PageUp:
                            this._moveSel(grid.SelMove.PrevPage, grid.SelMove.None, shift);
                            break;
                        case wijmo.Key.PageDown:
                            this._moveSel(grid.SelMove.NextPage, grid.SelMove.None, shift);
                            break;
                        case wijmo.Key.Home:
                            this._moveSel(ctrl ? grid.SelMove.Home : grid.SelMove.None, grid.SelMove.Home, shift);
                            break;
                        case wijmo.Key.End:
                            this._moveSel(ctrl ? grid.SelMove.End : grid.SelMove.None, grid.SelMove.End, shift);
                            break;
                        case wijmo.Key.Tab:
                            this._moveSel(grid.SelMove.None, shift ? grid.SelMove.PrevCell : grid.SelMove.NextCell, false);
                            break;
                        case wijmo.Key.Enter:
                            this._moveSel(shift ? grid.SelMove.Prev : grid.SelMove.Next, grid.SelMove.None, false);
                            if (!shift && ecv && ecv.currentEditItem != null) {
                                g._edtHdl._commitRowEdits(); // in case we're at the last row (TFS 105989)
                            }
                            break;
                        case wijmo.Key.Escape:
                            if (ecv) {
                                if (ecv.currentEditItem != null) {
                                    ecv.cancelEdit();
                                }
                                if (ecv.currentAddItem != null) {
                                    ecv.cancelNew();
                                }
                            }
                            g._mouseHdl.resetMouseState();
                            break;
                        case wijmo.Key.Delete:
                            handled = this._deleteSel();
                            break;
                        case wijmo.Key.F2:
                            handled = g.startEditing(true);
                            break;
                        case wijmo.Key.F4:
                            handled = g._edtHdl._toggleListBox(this._g.selection);
                            break;
                        case wijmo.Key.Space:
                            handled = g.startEditing(true);
                            if (handled) {
                                setTimeout(function () {
                                    var edt = g.activeEditor;
                                    if (edt) {
                                        if (edt.type == 'checkbox') {
                                            edt.checked = !edt.checked;
                                            g.finishEditing();
                                        }
                                        else {
                                            wijmo.setSelectionRange(edt, edt.value.length);
                                        }
                                    }
                                });
                            }
                            break;
                        default:
                            handled = false;
                            break;
                    }
                    if (handled) {
                        g.focus(); // http://wijmo.com/topic/angular-2-focus-issue-with-wj-input-number-as-rendering-cell-of-flexgrid/
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            };
            // handles the key press event (start editing or try auto-complete)
            _KeyboardHandler.prototype._keypress = function (e) {
                // forward key to editor (auto-complete) or handle ourselves
                var g = this._g;
                if (g.activeEditor) {
                    g._edtHdl._keypress(e);
                }
                else if (e.charCode > wijmo.Key.Space) {
                    if (g.startEditing(false) && g.activeEditor) {
                        setTimeout(function () {
                            var edt = g.activeEditor;
                            if (edt && edt.type != 'checkbox') {
                                edt.value = String.fromCharCode(e.charCode); // FireFox needs this...
                                wijmo.setSelectionRange(edt, 1);
                                edt.dispatchEvent(g._edtHdl._evtInput); // to apply mask (TFS 131232)
                                g._edtHdl._keypress(e); // to start auto-complete
                            }
                        });
                    }
                }
                e.stopPropagation();
            };
            // move the selection
            _KeyboardHandler.prototype._moveSel = function (rowMove, colMove, extend) {
                if (this._g.selectionMode != grid.SelectionMode.None) {
                    this._g._selHdl.moveSelection(rowMove, colMove, extend);
                }
            };
            // delete the selected rows
            _KeyboardHandler.prototype._deleteSel = function () {
                var g = this._g, ecv = wijmo.tryCast(g.collectionView, 'IEditableCollectionView'), sel = g.selection, rows = g.rows, selRows = [];
                // if g.allowDelete and ecv.canRemove, and not editing/adding, (TFS 87718)
                // and the grid allows deleting items, then delete selected rows
                if (g.allowDelete && !g.isReadOnly &&
                    (ecv == null || (ecv.canRemove && !ecv.isAddingNew && !ecv.isEditingItem))) {
                    // get selected rows
                    switch (g.selectionMode) {
                        case grid.SelectionMode.CellRange:
                            if (sel.leftCol == 0 && sel.rightCol == g.columns.length - 1) {
                                for (var i = sel.topRow; i > -1 && i <= sel.bottomRow; i++) {
                                    selRows.push(rows[i]);
                                }
                            }
                            break;
                        case grid.SelectionMode.ListBox:
                            for (var i = 0; i < rows.length; i++) {
                                if (rows[i].isSelected) {
                                    selRows.push(rows[i]);
                                }
                            }
                            break;
                        case grid.SelectionMode.Row:
                            if (sel.topRow > -1) {
                                selRows.push(rows[sel.topRow]);
                            }
                            break;
                        case grid.SelectionMode.RowRange:
                            for (var i = sel.topRow; i > -1 && i <= sel.bottomRow; i++) {
                                selRows.push(rows[i]);
                            }
                            break;
                    }
                }
                // finish with row deletion
                if (selRows.length > 0) {
                    // begin updates
                    if (ecv)
                        ecv.beginUpdate();
                    g.beginUpdate();
                    // delete selected rows
                    var rng = new grid.CellRange(), e = new grid.CellRangeEventArgs(g.cells, rng);
                    for (var i = selRows.length - 1; i >= 0; i--) {
                        var r = selRows[i];
                        rng.row = rng.row2 = r.index;
                        if (g.onDeletingRow(e)) {
                            if (ecv && r.dataItem) {
                                ecv.remove(r.dataItem);
                            }
                            else {
                                g.rows.removeAt(r.index);
                            }
                            g.onDeletedRow(e);
                        }
                    }
                    // finish updates
                    g.endUpdate();
                    if (ecv)
                        ecv.endUpdate();
                    // make sure one row is selected in ListBox mode (TFS 82683)
                    if (g.selectionMode == grid.SelectionMode.ListBox) {
                        var index = g.selection.row;
                        if (index > -1 && index < g.rows.length) {
                            g.rows[index].isSelected = true;
                        }
                    }
                    // handle childItemsPath (TFS 87577)
                    if (g.childItemsPath && g.collectionView) {
                        g.collectionView.refresh();
                    }
                    // all done
                    return true;
                }
                // delete cell content (if there is any) (TFS 94178)
                if (!g.isReadOnly && selRows.length == 0 && sel.isSingleCell) {
                    var bcol = g._getBindingColumn(g.cells, sel.row, g.columns[sel.col]);
                    if (bcol.isRequired == false || (bcol.isRequired == null && bcol.dataType == wijmo.DataType.String)) {
                        if (g.getCellData(sel.row, sel.col, true)) {
                            if (g.startEditing(false, sel.row, sel.col)) {
                                g.setCellData(sel.row, sel.col, '', true); // TFS 118470
                                g.finishEditing(true);
                                g.invalidate();
                                return true;
                            }
                        }
                    }
                }
                // no deletion
                return false;
            };
            return _KeyboardHandler;
        }());
        grid._KeyboardHandler = _KeyboardHandler;
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_KeyboardHandler.js.map