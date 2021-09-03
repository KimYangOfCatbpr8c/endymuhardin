module wijmo.grid {
    'use strict';

    /**
     * Handles the grid's keyboard commands.
     */
    export class _KeyboardHandler {
        _g: FlexGrid;

        /**
         * Initializes a new instance of the @see:_KeyboardHandler class.
         *
         * @param g @see:FlexGrid that owns this @see:_KeyboardHandler.
         */
        constructor(g: FlexGrid) {
            this._g = g;
            g.addEventListener(g.hostElement, 'keypress', this._keypress.bind(this));
            g.addEventListener(g.hostElement, 'keydown', this._keydown.bind(this));
        }

        // handles the key down event (selection)
        /*private*/ _keydown(e: KeyboardEvent) {
            var g = this._g,
                sel = g.selection,
                ctrl = e.ctrlKey || e.metaKey,
                shift = e.shiftKey,
                target = <HTMLElement>e.target,
                handled = true;

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
                var gr = <GroupRow>tryCast(g.rows[sel.row], GroupRow),
                    ecv = <collections.IEditableCollectionView>tryCast(g.collectionView, 'IEditableCollectionView'),
                    keyCode = e.keyCode;

                // handle clipboard
                if (g.autoClipboard) {

                    // copy: ctrl+c or ctrl+Insert
                    if (ctrl && (keyCode == 67 || keyCode == 45)) {
                        var args = new CellRangeEventArgs(g.cells, sel);
                        if (g.onCopying(args)) {
                            var text = g.getClipString();
                            Clipboard.copy(text);
                            g.onCopied(args);
                        }
                        e.stopPropagation();
                        return;
                    }

                    // paste: ctrl+v or shift+Insert
                    if ((ctrl && keyCode == 86) || (shift && keyCode == 45)) {
                        if (!g.isReadOnly) {
                            var args = new CellRangeEventArgs(g.cells, sel);
                            if (g.onPasting(args)) {
                                Clipboard.paste((text) => {
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
                        case Key.Left:
                            keyCode = Key.Right;
                            break;
                        case Key.Right:
                            keyCode = Key.Left;
                            break;
                    }
                }

                // default key handling
                switch (keyCode) {
                    case 65: // ctrl+A: select all
                        if (ctrl) {
                            g.select(new CellRange(0, 0, g.rows.length - 1, g.columns.length - 1));
                        } else {
                            handled = false;
                        }
                        break;
                    case Key.Left:
                        if (sel.isValid && sel.col == 0 && gr != null && !gr.isCollapsed && gr.hasChildren) {
                            gr.isCollapsed = true;
                        } else {
                            this._moveSel(SelMove.None, ctrl ? SelMove.Home : SelMove.Prev, shift);
                        }
                        break;
                    case Key.Right:
                        if (sel.isValid && sel.col == 0 && gr != null && gr.isCollapsed) {
                            gr.isCollapsed = false;
                        } else {
                            this._moveSel(SelMove.None, ctrl ? SelMove.End : SelMove.Next, shift);
                        }
                        break;
                    case Key.Up: // alt-up toggles the ListBox
                        if (e.altKey && g._edtHdl._toggleListBox(this._g.selection)) {
                            break;
                        }
                        this._moveSel(ctrl ? SelMove.Home : SelMove.Prev, SelMove.None, shift);
                        break;
                    case Key.Down: // alt-down opens the ListBox
                        if (e.altKey && g._edtHdl._toggleListBox(this._g.selection)) {
                            break;
                        }
                        this._moveSel(ctrl ? SelMove.End : SelMove.Next, SelMove.None, shift);
                        break;
                    case Key.PageUp:
                        this._moveSel(SelMove.PrevPage, SelMove.None, shift);
                        break;
                    case Key.PageDown:
                        this._moveSel(SelMove.NextPage, SelMove.None, shift);
                        break;
                    case Key.Home:
                        this._moveSel(ctrl ? SelMove.Home : SelMove.None, SelMove.Home, shift);
                        break;
                    case Key.End:
                        this._moveSel(ctrl ? SelMove.End : SelMove.None, SelMove.End, shift);
                        break;
                    case Key.Tab:
                        this._moveSel(SelMove.None, shift ? SelMove.PrevCell : SelMove.NextCell, false);
                        break;
                    case Key.Enter:
                        this._moveSel(shift ? SelMove.Prev : SelMove.Next, SelMove.None, false);
                        if (!shift && ecv && ecv.currentEditItem != null) {
                            g._edtHdl._commitRowEdits(); // in case we're at the last row (TFS 105989)
                        }
                        break;
                    case Key.Escape:
                        if (ecv) {
                            if (ecv.currentAddItem || ecv.currentEditItem) {
                                // fire rowEditEnding/Ended events with cancel set to true
                                // the event handlers can use this to restore deep bindings
                                var ee = new CellRangeEventArgs(g.cells, g.selection);
                                ee.cancel = true;
                                g.onRowEditEnding(ee);
                                if (ecv.currentAddItem) {
                                    ecv.cancelNew();
                                }
                                if (ecv.currentEditItem) {
                                    ecv.cancelEdit();
                                }
                                g.onRowEditEnded(ee);
                            }
                        }
                        g._mouseHdl.resetMouseState();
                        break;
                    case Key.Delete:
                    case Key.Back: // Mac keyboards don't have a Delete key, so honor Back here as well
                        handled = this._deleteSel();
                        break;
                    case Key.F2:
                        handled = this._startEditing(true, e);
                        break;
                    case Key.F4:
                        handled = g._edtHdl._toggleListBox(this._g.selection);
                        break;
                    case Key.Space:
                        handled = this._startEditing(true, e);
                        if (handled) {
                            setTimeout(() => {
                                var edt = g.activeEditor;
                                if (edt) {
                                    if (edt.type == 'checkbox') {
                                        edt.checked = !edt.checked;
                                        g.finishEditing();
                                    } else {
                                        setSelectionRange(edt, edt.value.length);
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
        }

        // handles the key press event (start editing or try auto-complete)
        private _keypress(e: KeyboardEvent) {

            // forward key to editor (auto-complete) or handle ourselves
            var g = this._g;
            if (g.activeEditor) {
                g._edtHdl._keypress(e);
            } else if (e.charCode > Key.Space) {
                if (this._startEditing(false, e) && g.activeEditor) {
                    setTimeout(() => {
                        var edt = g.activeEditor;
                        if (edt && edt.type != 'checkbox') {
                            edt.value = String.fromCharCode(e.charCode); // FireFox needs this...
                            setSelectionRange(edt, 1);
                            edt.dispatchEvent(g._edtHdl._evtInput); // to apply mask (TFS 131232)
                            g._edtHdl._keypress(e); // to start auto-complete
                        }
                    });
                }
            }
            e.stopPropagation();
        }

        // move the selection
        private _moveSel(rowMove: SelMove, colMove: SelMove, extend: boolean) {
            if (this._g.selectionMode != SelectionMode.None) {
                this._g._selHdl.moveSelection(rowMove, colMove, extend);
            }
        }

        // delete the selected rows
        private _deleteSel(): boolean {
            var g = this._g,
                ecv = <collections.IEditableCollectionView>tryCast(g.collectionView, 'IEditableCollectionView'),
                sel = g.selection,
                rows = g.rows,
                selRows = [];

            // if g.allowDelete and ecv.canRemove, and not editing/adding, (TFS 87718)
            // and the grid allows deleting items, then delete selected rows
            if (g.allowDelete && !g.isReadOnly &&
                (ecv == null || (ecv.canRemove && !ecv.isAddingNew && !ecv.isEditingItem))) {

                // get selected rows
                switch (g.selectionMode) {
                    case SelectionMode.CellRange:
                        if (sel.leftCol == 0 && sel.rightCol == g.columns.length - 1) {
                            for (var i = sel.topRow; i > -1 && i <= sel.bottomRow; i++) {
                                selRows.push(rows[i]);
                            }
                        }
                        break;
                    case SelectionMode.ListBox:
                        for (var i = 0; i < rows.length; i++) {
                            if (rows[i].isSelected) {
                                selRows.push(rows[i]);
                            }
                        }
                        break;
                    case SelectionMode.Row:
                        if (sel.topRow > -1) {
                            selRows.push(rows[sel.topRow]);
                        }
                        break;
                    case SelectionMode.RowRange:
                        for (var i = sel.topRow; i > -1 && i <= sel.bottomRow; i++) {
                            selRows.push(rows[i]);
                        }
                        break;
                }
            }

            // finish with row deletion
            if (selRows.length > 0) {

                // begin updates
                if (ecv) ecv.beginUpdate();
                g.beginUpdate();

                // delete selected rows
                var rng = new CellRange(),
                    e = new CellRangeEventArgs(g.cells, rng);
                for (var i = selRows.length - 1; i >= 0; i--) {
                    var r = selRows[i];
                    rng.row = rng.row2 = r.index;
                    if (g.onDeletingRow(e)) {
                        if (ecv && r.dataItem) {
                            ecv.remove(r.dataItem);
                        } else {
                            g.rows.removeAt(r.index);
                        }
                        g.onDeletedRow(e);
                    }
                }

                // finish updates
                g.endUpdate();
                if (ecv) ecv.endUpdate();

                // make sure one row is selected in ListBox mode (TFS 82683)
                if (g.selectionMode == SelectionMode.ListBox) {
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
                if (bcol.isRequired == false || (bcol.isRequired == null && bcol.dataType == DataType.String)) { // TFS 94192
                    if (g.getCellData(sel.row, sel.col, true)) {
                        if (this._startEditing(false, e, sel.row, sel.col)) {
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
        }

        // start editing and pass the event that caused the edit to start
        private _startEditing(fullEdit: boolean, evt: any, r?: number, c?: number): boolean {
            return this._g._edtHdl.startEditing(fullEdit, r, c, true, evt);
        }
    }
}
