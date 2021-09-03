var wijmo;
(function (wijmo) {
    var grid;
    (function (grid) {
        'use strict';
        /**
         * Creates HTML elements that represent cells within a @see:FlexGrid control.
         */
        var CellFactory = (function () {
            function CellFactory() {
            }
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
            CellFactory.prototype.updateCell = function (p, r, c, cell, rng, updateContent) {
                var g = p.grid, ct = p.cellType, rows = p.rows, cols = p.columns, row = rows[r], col = cols[c], r2 = r, c2 = c, gr = wijmo.tryCast(row, grid.GroupRow), nr = wijmo.tryCast(row, grid._NewRowTemplate), cellWidth = col.renderWidth, cellHeight = row.renderHeight, cl = 'wj-cell', css = { display: '' }, canSkip = (updateContent != false); // don't skip if not updating content
                // clear cells that have child elements before re-using them
                // this is a workaround for a bug in IE that affects templates
                // strangely, setting the cell's innerHTML to '' doesn't help...
                if (updateContent != false && cell.firstElementChild &&
                    (cell.childNodes.length != 1 || cell.firstElementChild.type != 'checkbox')) {
                    wijmo.setText(cell, null);
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
                    gr = wijmo.tryCast(row, grid.GroupRow);
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
                var cpos = col.pos, rpos = row.pos;
                if (wijmo.isIE() && ct == grid.CellType.Cell && !g.editRange) {
                    if (r < rows.frozen && c >= cols.frozen) {
                        cpos += g._ptScrl.x;
                    }
                    if (c < cols.frozen && r >= rows.frozen) {
                        rpos += g._ptScrl.y;
                    }
                }
                else {
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
                }
                else {
                    css.left = cpos + 'px';
                }
                css.top = (rpos - p._getOffsetY()) + 'px';
                css.width = cellWidth + 'px';
                css.height = cellHeight + 'px';
                // selector classes that only apply to regular cells
                if (ct == grid.CellType.Cell) {
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
                }
                else {
                    cl += ' wj-header';
                    if (g.showAlternatingRows && r % 2 != 0) {
                        cl += ' wj-header-alt';
                    }
                }
                // selected state
                var selState = p.getSelectedState(r, c, rng);
                if (selState != grid.SelectedState.None && ct == grid.CellType.Cell &&
                    col.dataType != wijmo.DataType.Boolean && g.editRange && g.editRange.contains(r, c)) {
                    selState = grid.SelectedState.None;
                }
                switch (selState) {
                    case grid.SelectedState.Cursor:
                        cl += ' wj-state-selected';
                        break;
                    case grid.SelectedState.Selected:
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
                            }
                            return;
                        }
                    }
                }
                // alignment
                css.textAlign = bcol.getAlignment();
                // TODO: vertical alignment?
                // group row indentation
                if (ct == grid.CellType.Cell) {
                    if (g.rows.maxGroupLevel > -1) {
                        css.paddingLeft = css.paddingRight = '';
                        if (c == g.columns.firstVisibleIndex && g.treeIndent) {
                            var level = gr ? Math.max(0, gr.level) : (g.rows.maxGroupLevel + 1), indent = g.treeIndent * level + g._cellPadding;
                            if (g._rtl) {
                                css.paddingRight = indent;
                            }
                            else {
                                css.paddingLeft = indent;
                            }
                        }
                    }
                }
                // cell content
                if (updateContent != false) {
                    var data = p.getCellData(r, c, false), content = p.getCellData(r, c, true);
                    if (ct == grid.CellType.Cell && c == g.columns.firstVisibleIndex &&
                        gr && gr.hasChildren && !this._isEditingCell(g, r, c)) {
                        // collapse/expand outline
                        if (!content) {
                            content = gr.getGroupHeader();
                        }
                        cell.innerHTML = this._getTreeIcon(gr) + ' ' + content;
                        css.textAlign = '';
                    }
                    else if (ct == grid.CellType.ColumnHeader && bcol.currentSort && g.showSort && (r2 == g._getSortRowIndex() || bcol != col)) {
                        // add sort class names to allow easier customization
                        cl += ' wj-sort-' + (bcol.currentSort == '+' ? 'asc' : 'desc');
                        // column header with sort sign
                        cell.innerHTML = wijmo.escapeHtml(content) + '&nbsp;' + this._getSortIcon(bcol);
                    }
                    else if (ct == grid.CellType.RowHeader && c == g.rowHeaders.columns.length - 1 && !content) {
                        // edit/new item template indicators
                        var ecv = g.collectionView, editItem = ecv ? ecv.currentEditItem : null;
                        if (editItem && row.dataItem == editItem) {
                            content = '\u270E'; // pencil icon indicates item being edited
                        }
                        else if (wijmo.tryCast(row, grid._NewRowTemplate)) {
                            content = '*'; // asterisk indicates new row template
                        }
                        wijmo.setText(cell, content);
                    }
                    else if (ct == grid.CellType.Cell && bcol.dataType == wijmo.DataType.Boolean && (!gr || wijmo.isBoolean(data))) {
                        // re-use/create checkbox
                        // (re-using allows selecting and checking/unchecking with a single click)
                        var chk = cell.firstChild;
                        if (!(chk instanceof HTMLInputElement) || chk.type != 'checkbox') {
                            cell.innerHTML = '<input type="checkbox"/>';
                            chk = cell.firstChild;
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
                    }
                    else if (ct == grid.CellType.Cell && this._isEditingCell(g, r, c)) {
                        // select input type (important for mobile devices)
                        var inpType = bcol.inputType;
                        if (!bcol.inputType) {
                            inpType = bcol.dataType == wijmo.DataType.Number && !bcol.dataMap ? 'tel' : 'text';
                        }
                        // get editor value (use full precision when editing floating point values)
                        // this is a little tricky: TFS 123276, 134218, 135336
                        if (!bcol.dataMap && !bcol.mask) {
                            var val = p.getCellData(r, c, false);
                            if (wijmo.isNumber(val)) {
                                var fmt = bcol.format;
                                if (fmt && val != Math.round(val)) {
                                    fmt = bcol.format.replace(/([a-z])(\d*)(.*)/ig, '$0112$3');
                                }
                                content = wijmo.Globalize.formatNumber(val, fmt, true);
                            }
                        }
                        // create/initialize editor
                        cell.innerHTML = '<input type="' + inpType + '" class="wj-grid-editor wj-form-control">';
                        var edt = cell.children[0];
                        edt.value = content;
                        edt.style.textAlign = bcol.getAlignment(); // right-align numbers when editing
                        css.padding = '0px'; // no padding on cell div (the editor has it)
                        // apply mask, if any
                        if (bcol.mask) {
                            var mp = new wijmo._MaskProvider(edt, bcol.mask);
                        }
                        // assign editor to grid
                        g._edtHdl._edt = edt;
                    }
                    else {
                        // regular content
                        if (ct == grid.CellType.Cell && (row.isContentHtml || bcol.isContentHtml)) {
                            cell.innerHTML = content;
                        }
                        else {
                            wijmo.setText(cell, content);
                        }
                    }
                    // add drop-down element to the cell if the column:
                    // a) has a dataMap,
                    // b) has showDropDown set to not false (null or true)
                    // c) is editable
                    if (ct == grid.CellType.Cell && wijmo.input &&
                        bcol.dataMap && bcol.showDropDown !== false && g._edtHdl._allowEditing(r, c)) {
                        // create icon once
                        if (!CellFactory._ddIcon) {
                            CellFactory._ddIcon = wijmo.createElement('<div class="' + CellFactory._WJC_DROPDOWN + '"><span class="wj-glyph-down"></span></div>');
                        }
                        // clone icon and add clone to cell
                        var dd = CellFactory._ddIcon.cloneNode(true);
                        cell.appendChild(dd);
                    }
                }
                // make row/col headers draggable
                switch (ct) {
                    case grid.CellType.RowHeader:
                        cell.removeAttribute('draggable');
                        if (!gr && !nr && (g.allowDragging & grid.AllowDragging.Rows) != 0) {
                            cell.setAttribute('draggable', 'true');
                        }
                        break;
                    case grid.CellType.ColumnHeader:
                        cell.removeAttribute('draggable');
                        if ((g.allowDragging & grid.AllowDragging.Columns) != 0) {
                            cell.setAttribute('draggable', 'true');
                        }
                        break;
                }
                // apply class specifier to cell
                if (cell.className != cl) {
                    cell.className = cl;
                }
                // apply style to cell
                wijmo.setCss(cell, css);
                // customize the cell
                if (g.itemFormatter) {
                    g.itemFormatter(p, r, c, cell);
                }
                if (g.formatItem.hasHandlers) {
                    var rng = CellFactory._fmtRng;
                    if (!rng) {
                        rng = CellFactory._fmtRng = new grid.CellRange(r, c, r2, c2);
                    }
                    else {
                        rng.setRange(r, c, r2, c2);
                    }
                    var e = new grid.FormatItemEventArgs(p, rng, cell);
                    g.onFormatItem(e);
                }
            };
            /**
             * Disposes of a cell element and releases all resources associated with it.
             *
             * @param cell The element that represents the cell.
             */
            CellFactory.prototype.disposeCell = function (cell) {
                // no action needed for standard cells...
            };
            // ** implementation
            // determines whether the grid is currently editing a cell
            CellFactory.prototype._isEditingCell = function (g, r, c) {
                return g.editRange && g.editRange.contains(r, c);
            };
            // get an element to create a collapse/expand icon
            // NOTE: the _WJC_COLLAPSE class is used by the mouse handler to identify
            // the collapse/expand button/element.
            CellFactory.prototype._getTreeIcon = function (gr) {
                var glyph = 'wj-glyph-' +
                    (gr.isCollapsed ? '' : 'down-') +
                    (gr.grid._rtl ? 'left' : 'right');
                return '<span class="' + CellFactory._WJC_COLLAPSE + ' ' + glyph + '"></span>';
            };
            // get an element to create a sort up/down icon
            CellFactory.prototype._getSortIcon = function (col) {
                return '<span class="wj-glyph-' + (col.currentSort == '+' ? 'up' : 'down') + '"></span>';
            };
            CellFactory._WJC_COLLAPSE = 'wj-elem-collapse';
            CellFactory._WJC_DROPDOWN = 'wj-elem-dropdown';
            return CellFactory;
        }());
        grid.CellFactory = CellFactory;
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=CellFactory.js.map