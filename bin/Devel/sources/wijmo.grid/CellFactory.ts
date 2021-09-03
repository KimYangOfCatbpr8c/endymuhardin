module wijmo.grid {
    'use strict';

    /**
     * Creates HTML elements that represent cells within a @see:FlexGrid control.
     */
    export class CellFactory {
        static _WJC_COLLAPSE = 'wj-elem-collapse';
        static _WJC_DROPDOWN = 'wj-elem-dropdown';
        static _ddIcon: HTMLElement;
        static _fmtRng: CellRange;

        /**
         * Creates or updates a cell in the grid.
         *
         * @param p The @see:GridPanel that contains the cell.
         * @param r The index of the row that contains the cell.
         * @param c The index of the column that contains the cell.
         * @param cell The element that represents the cell.
         * @param rng The @see:CellRange object that contains the cell's 
         * merged range, or null if the cell is not merged.
         * @param updateContent Whether to update the cell's content as
         * well as its position and style.
         */
        public updateCell(p: GridPanel, r: number, c: number, cell: HTMLElement, rng?: CellRange, updateContent?: boolean) {
            var g = p.grid,
                ct = p.cellType,
                rows = p.rows,
                cols = p.columns,
                row = rows[r],
                col = cols[c],
                r2 = r,
                c2 = c,
                gr = <GroupRow>tryCast(row, GroupRow),
                nr = tryCast(row, _NewRowTemplate),
                cellWidth = col.renderWidth,
                cellHeight = row.renderHeight,
                cl = 'wj-cell',
                css: any = { display: '' },
                canSkip = (updateContent != false); // don't skip if not updating content

            // clear cells that have child elements before re-using them
            // this is a workaround for a bug in IE that affects templates
            // strangely, setting the cell's innerHTML to '' doesn't help...
            if (updateContent != false && cell.firstElementChild &&
                (cell.childNodes.length != 1 || (<HTMLInputElement>cell.firstElementChild).type != 'checkbox')) {
                setText(cell, null);
                canSkip = false;
            }

            // adjust for merged ranges
            if (rng && !rng.isSingleCell) {
                r = rng.row;
                c = rng.col;
                r2 = rng.row2;
                c2 = rng.col2;
                row = rows[r];
                col = cols[c];
                gr = <GroupRow>tryCast(row, GroupRow);
                var sz = rng.getRenderSize(p);
                cellHeight = sz.height;
                cellWidth = sz.width;
            }

            // get column to use for binding (usually the same as col, but not on MultiRow)
            var bcol = g._getBindingColumn(p, r, col);

            // get cell position accounting for frozen rows/columns
            // in IE, frozen cells: will be moved to a fixed div, so adjust the scroll position for that
            // in other browsers, they will remain in the cells div, so adjust for that instead
            // (not when editing...)
            var cpos = col.pos,
                rpos = row.pos;
            if (isIE() && ct == CellType.Cell && !g.editRange) {
                if (r < rows.frozen && c >= cols.frozen) {
                    cpos += g._ptScrl.x;
                }
                if (c < cols.frozen && r >= rows.frozen) {
                    rpos += g._ptScrl.y;
                }
            } else { // header cells: just remove the scroll position
                if (r < rows.frozen) {
                    rpos -= g._ptScrl.y;
                }
                if (c < cols.frozen) {
                    cpos -= g._ptScrl.x;
                }
            }

            // size and position
            if (g._rtl) {
                css.right = cpos + 'px';
            } else {
                css.left = cpos + 'px';
            }
            css.top = (rpos - p._getOffsetY()) + 'px';
            css.width = cellWidth + 'px';
            css.height = cellHeight + 'px';

            // selector classes that only apply to regular cells
            if (ct == CellType.Cell) {
                if (gr) {
                    cl += ' wj-group';
                }
                if (g.showAlternatingRows && r % 2 != 0) {
                    cl += ' wj-alt';
                }
                if (r < rows.frozen || c < cols.frozen) {
                    cl += ' wj-frozen';
                }
                if (nr) {
                    cl += ' wj-new';
                }
                if (row.cssClass) {
                    cl += ' ' + row.cssClass;
                }
                if (bcol.cssClass) {
                    cl += ' ' + bcol.cssClass;
                }
            } else {
                cl += ' wj-header';
                if (g.showAlternatingRows && r % 2 != 0) {
                    cl += ' wj-header-alt';
                }
            }

            // errors
            var view = g.collectionView;
            if (view && g.showErrors) {
                if (ct == CellType.Cell) {
                    var getError = view['getError'];
                    if (isFunction(getError)) {
                        cell.title = '';
                        var error = getError(row.dataItem, bcol.binding);
                        if (error) {
                            cl += ' wj-state-invalid';
                            cell.title = error;
                        }
                    }
                } else if (ct == CellType.RowHeader) {
                    var getError = view['getError'];
                    if (isFunction(getError)) {
                        for (var i = 0; i < g.columns.length; i++) {
                            var bce = g._getBindingColumn(p, r, g.columns[i]);
                            if (getError(row.dataItem, bce.binding)) {
                                cl += ' wj-state-invalid';
                                break;
                            }
                        }
                    }
                }
            }

            // selected state
            var selState = p.getSelectedState(r, c, rng);
            if (selState != SelectedState.None && ct == CellType.Cell &&
                col.dataType != DataType.Boolean && g.editRange && g.editRange.contains(r, c)) {
                selState = SelectedState.None;
            }
            switch (selState) {
                case SelectedState.Cursor:
                    cl += ' wj-state-selected';
                    break;
                case SelectedState.Selected:
                    cl += ' wj-state-multi-selected';
                    break;
            }

            // frozen area boundary
            if (r2 == rows.frozen - 1) {
                cl += ' wj-frozen-row';
            }
            if (c2 == cols.frozen - 1) {
                cl += ' wj-frozen-col';
            }

            // word-wrapping
            if (col.wordWrap || row.wordWrap) {
                cl += ' wj-wrap';
            }

            // optimization: skip cell update if possible
            if (canSkip && cl == cell.className) {
                var s = cell.style;
                if (s.top == css.top && s.width == css.width && s.height == css.height) {
                    if ((g._rtl && s.right == css.right) || (!g._rtl && s.left == css.left)) {
                        if (s.display) {
                            cell.style.display = '';
                            //s.display == ''; // this doesn't work... weird
                        }
                        return;
                    }
                }
            }

            // alignment
            css.textAlign = bcol.getAlignment();
            // TODO: vertical alignment?

            // group row indentation
            if (ct == CellType.Cell) {
                if (g.rows.maxGroupLevel > -1) {
                    css.paddingLeft = css.paddingRight = '';
                    if (c == g.columns.firstVisibleIndex && g.treeIndent) {
                        var level = gr ? Math.max(0, gr.level) : (g.rows.maxGroupLevel + 1),
                            indent = g.treeIndent * level + g._cellPadding;
                        if (g._rtl) {
                            css.paddingRight = indent;
                        } else {
                            css.paddingLeft = indent;
                        }
                    }
                }
            }

            // cell content
            if (updateContent != false) {
                var data = p.getCellData(r, c, false),
                    content = p.getCellData(r, c, true);
                if (ct == CellType.Cell && c == g.columns.firstVisibleIndex &&
                    gr && gr.hasChildren && !this._isEditingCell(g, r, c)) {

                    // collapse/expand outline
                    if (!content) {
                        content = gr.getGroupHeader();
                    }
                    cell.innerHTML = this._getTreeIcon(gr) + ' ' + content;
                    css.textAlign = '';

                } else if (ct == CellType.ColumnHeader && bcol.currentSort && g.showSort && (r2 == g._getSortRowIndex() || bcol != col)) {

                    // add sort class names to allow easier customization
                    cl += ' wj-sort-' + (bcol.currentSort == '+' ? 'asc' : 'desc');

                    // column header with sort sign
                    cell.innerHTML = escapeHtml(content) + '&nbsp;' + this._getSortIcon(bcol);

                } else if (ct == CellType.RowHeader && c == g.rowHeaders.columns.length - 1 && !content) {

                    // edit/new item template indicators
                    // (using glyphs for extra CSS control)
                    var ecv = <collections.IEditableCollectionView>g.collectionView,
                        editItem = ecv ? ecv.currentEditItem : null;
                    if (editItem && row.dataItem == editItem) {
                        //content = '\u270E'; // pencil icon indicates item being edited
                        cell.innerHTML = '<span class="wj-glyph-pencil"></span>';
                    } else if (tryCast(row, _NewRowTemplate)) {
                        //content = '*'; // asterisk indicates new row template
                        cell.innerHTML = '<span class="wj-glyph-asterisk"></span>';
                    }
                    //setText(cell, content);

                } else if (ct == CellType.Cell && bcol.dataType == DataType.Boolean && (!gr || isBoolean(data))) { // TFS 122709

                    // re-use/create checkbox
                    // (re-using allows selecting and checking/unchecking with a single click)
                    var chk = <HTMLInputElement>cell.firstChild;
                    if (!(chk instanceof HTMLInputElement) || chk.type != 'checkbox') {
                        cell.innerHTML = '<input type="checkbox"/>';
                        chk = <HTMLInputElement>cell.firstChild;
                    }

                    // initialize/update checkbox value
                    chk.checked = data == true ? true : false;
                    chk.indeterminate = data == null;

                    // disable checkbox if it is not editable (so user can't click it)
                    chk.disabled = !g._edtHdl._allowEditing(r, c);
                    if (chk.disabled) {
                        chk.style.cursor = 'default';
                    }

                    // assign editor to grid
                    if (g.editRange && g.editRange.contains(r, c)) {
                        g._edtHdl._edt = chk;
                    }

                } else if (ct == CellType.Cell && this._isEditingCell(g, r, c)) {

                    // select input type (important for mobile devices)
                    var inpType = bcol.inputType;
                    if (!bcol.inputType) {
                        inpType = bcol.dataType == DataType.Number && !bcol.dataMap ? 'tel' : 'text';
                    }

                    // get editor value (use full precision when editing floating point values)
                    // this is a little tricky: TFS 123276, 134218, 135336
                    if (!bcol.dataMap && !bcol.mask) {
                        var val = <number>p.getCellData(r, c, false);
                        if (isNumber(val)) {
                            var fmt = bcol.format;
                            if (fmt && val != Math.round(val)) {
                                fmt = bcol.format.replace(/([a-z])(\d*)(.*)/ig, '$0112$3');
                            }
                            content = Globalize.formatNumber(val, fmt, true);
                        }
                    }

                    // create/initialize editor
                    cell.innerHTML = '<input type="' + inpType + '" class="wj-grid-editor wj-form-control">';
                    var edt = <HTMLInputElement>cell.children[0];
                    edt.value = content;
                    edt.style.textAlign = bcol.getAlignment(); // right-align numbers when editing
                    css.padding = '0px'; // no padding on cell div (the editor has it)

                    // apply mask, if any
                    if (bcol.mask) {
                        var mp = new _MaskProvider(edt, bcol.mask);
                    }

                    // assign editor to grid
                    g._edtHdl._edt = edt;

                } else {

                    // regular content
                    if (ct == CellType.Cell && (row.isContentHtml || bcol.isContentHtml)) {
                        cell.innerHTML = content;
                    } else {
                        setText(cell, content);
                    }
                }

                // add drop-down element to the cell if the column:
                // a) has a dataMap,
                // b) has showDropDown set to not false (null or true)
                // c) is editable
                if (ct == CellType.Cell && wijmo.input &&
                    bcol.dataMap && bcol.showDropDown !== false && g._edtHdl._allowEditing(r, c)) {

                    // create icon once
                    if (!CellFactory._ddIcon) {
                        CellFactory._ddIcon = createElement(
                            '<div class="' + CellFactory._WJC_DROPDOWN + '"><span class="wj-glyph-down"></span></div>'
                        );
                    }

                    // clone icon and add clone to cell
                    var dd = <HTMLElement>CellFactory._ddIcon.cloneNode(true);
                    cell.appendChild(dd);
                }
            }

            // make row/col headers draggable
            switch (ct) {
                case CellType.RowHeader:
                    cell.removeAttribute('draggable');
                    if (!gr && !nr && (g.allowDragging & AllowDragging.Rows) != 0) {
                        cell.setAttribute('draggable', 'true');
                    }
                    break;
                case CellType.ColumnHeader:
                    cell.removeAttribute('draggable');
                    if ((g.allowDragging & AllowDragging.Columns) != 0) {
                        cell.setAttribute('draggable', 'true');
                    }
                    break;
            }

            // apply class specifier to cell
            if (cell.className != cl) {
                cell.className = cl;
            }

            // apply style to cell
            setCss(cell, css);

            // customize the cell
            if (g.itemFormatter) {
                g.itemFormatter(p, r, c, cell);
            }
            if (g.formatItem.hasHandlers) {
                var rng = CellFactory._fmtRng;
                if (!rng) { // avoid allocating a new CellRange each time (this may get called a lot!)
                    rng = CellFactory._fmtRng = new CellRange(r, c, r2, c2);
                } else {
                    rng.setRange(r, c, r2, c2);
                }
                var e = new FormatItemEventArgs(p, rng, cell);
                g.onFormatItem(e);
            }
        }
        /**
         * Disposes of a cell element and releases all resources associated with it.
         *
         * @param cell The element that represents the cell.
         */
        public disposeCell(cell: HTMLElement) {
            // no action needed for standard cells...
        }

        // ** implementation

        // determines whether the grid is currently editing a cell
        private _isEditingCell(g: FlexGrid, r: number, c: number): boolean {
            return g.editRange && g.editRange.contains(r, c);
        }

        // get an element to create a collapse/expand icon
        // NOTE: the _WJC_COLLAPSE class is used by the mouse handler to identify
        // the collapse/expand button/element.
        private _getTreeIcon(gr: GroupRow): string {
            var glyph = 'wj-glyph-' +
                (gr.isCollapsed ? '' : 'down-') +
                (gr.grid._rtl ? 'left' : 'right');
            return '<span class="' + CellFactory._WJC_COLLAPSE + ' ' + glyph + '"></span>';
        }

        // get an element to create a sort up/down icon
        private _getSortIcon(col: Column): string {
            return '<span class="wj-glyph-' + (col.currentSort == '+' ? 'up' : 'down') + '"></span>';
        }
    }
}
