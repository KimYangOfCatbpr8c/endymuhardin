module wijmo.grid {
    'use strict';

    // allow resizing by dragging regular cells as well as headers
    var _AR_ALLCELLS = 4;

    /**
     * Specifies constants that define the row/column sizing behavior.
     */
    export enum AllowResizing {
        /** The user may not resize rows or columns. */
        None = 0,
        /** The user may resize columns by dragging the edge of the column headers. */
        Columns = 1,
        /** The user may resize rows by dragging the edge of the row headers. */
        Rows = 2,
        /** The user may resize rows and columns by dragging the edge of the headers. */
        Both = Rows | Columns, // 3
        /** The user may resize columns by dragging the edge of any cell. */
        ColumnsAllCells = Columns | _AR_ALLCELLS, // 5
        /** The user may resize rows by dragging the edge of any cell. */
        RowsAllCells = Rows | _AR_ALLCELLS, // 6
        /** The user may resize rows and columns by dragging the edge of any cell. */
        BothAllCells = Both | _AR_ALLCELLS // 7
    }

    /**
     * Specifies constants that define the row/column auto-sizing behavior.
     */
    export enum AutoSizeMode {
        /** Autosizing is disabled. */
        None = 0,
        /** Autosizing accounts for header cells. */
        Headers = 1,
        /** Autosizing accounts for data cells. */
        Cells = 2,
        /** Autosizing accounts for header and data cells. */
        Both = Headers | Cells
    }

    /**
     * Specifies constants that define the row/column dragging behavior.
     */
    export enum AllowDragging {
        /** The user may not drag rows or columns. */
        None = 0,
        /** The user may drag columns. */
        Columns = 1,
        /** The user may drag rows. */
        Rows = 2,
        /** The user may drag rows and columns. */
        Both = Rows | Columns
    }

    /**
     * Handles the grid's mouse commands.
     */
    export class _MouseHandler {
        _g: FlexGrid;
        _htDown: HitTestInfo;
        _eMouse: MouseEvent;
        _lbSelState: boolean;
        _lbSelRows: Object;
        _szRowCol: RowCol;
        _szStart: number;
        _szArgs: CellRangeEventArgs;
        _dragSource: any;
        _dvMarker: HTMLElement;
        _rngTarget: CellRange;

        static _SZ_MIN = 0; // minimum size allowed when resizing rows/cols

        /**
         * Initializes a new instance of the @see:_MouseHandler class.
         *
         * @param g @see:FlexGrid that owns this @see:_MouseHandler.
         */
        constructor(g: FlexGrid) {
            var host = g.hostElement;
            this._g = g;

            // mouse events: 
            // when the user presses the mouse on the control, hook up handlers to 
            // mouse move/up on the *document*, and unhook on mouse up.
            // this simulates a mouse capture (nice idea from ngGrid).
            // note: use 'document' and not 'window'; that doesn't work on Android.
            g.addEventListener(host, 'mousedown', (e: MouseEvent) => {

                // start actions on left button only: TFS 114623
                if (!e.defaultPrevented && e.button == 0) { 

                    // make sure the target does not belong to another nested grid: TFS 200695
                    // when starting drag right after edit, target parent is null: TFS 211338
                    if (closest(e.target, '.wj-flexgrid') == this._g.hostElement ||
                        (<HTMLElement>e.target).parentElement == null) {
                        g.addEventListener(document, 'mousemove', mouseMove);
                        g.addEventListener(document, 'mouseup', mouseUp);
                        this._mousedown(e);
                    }
                }
            });
            var mouseMove = (e: MouseEvent) => {
                this._mousemove(e);
            };
            var mouseUp = (e: MouseEvent) => {
                g.removeEventListener(document, 'mousemove');
                g.removeEventListener(document, 'mouseup');
                this._mouseup(e);
            };

            // offer to resize on mousemove (pressing the button not required)
            g.addEventListener(host, 'mousemove', this._hover.bind(this));

            // double-click to auto-size rows/columns and to enter edit mode
            g.addEventListener(host, 'dblclick', this._dblclick.bind(this));

            // prevent user from selecting grid content (as text)
            g.addEventListener(host, 'selectstart', (e) => {
                if (e.target.tagName != 'INPUT') {
                    e.preventDefault();
                }
            });

            // prevent wheel from propagating to parent elements
            g.addEventListener(host, 'wheel', (e: WheelEvent) => {
                var root = g.cells.hostElement.parentElement;
                if (root.scrollHeight > root.offsetHeight) {
                    if ((e.deltaY < 0 && root.scrollTop == 0) ||
                        (e.deltaY > 0 && root.scrollTop + root.offsetHeight >= root.scrollHeight)) {
                        if (wijmo.closest(e.target, '.wj-flexgrid') == g.hostElement) { // to handle nested grids
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }
                }
            });

            // row and column dragging
            g.addEventListener(host, 'dragstart', this._dragstart.bind(this));
            g.addEventListener(host, 'dragover', this._dragover.bind(this));
            g.addEventListener(host, 'dragleave', this._dragover.bind(this));
            g.addEventListener(host, 'drop', this._drop.bind(this));
            g.addEventListener(host, 'dragend', this._dragend.bind(this));

            // create target indicator element
            this._dvMarker = createElement('<div class="wj-marker">&nbsp;</div>');
        }

        /**
         * Resets the mouse state.
         */
        resetMouseState() {

            // because dragEnd fires too late in FireFox...
            if (this._dragSource) {
                this._dragSource.style.opacity = 1;
            }
            this._showDragMarker(null);

            // reset cursor state (if the grid hasn't been disposed)
            var host = this._g.hostElement;
            if (host) {
                host.style.cursor = 'default';
            }

            // remove event listeners just in case
            var g = this._g;
            g.removeEventListener(document, 'mousemove');
            g.removeEventListener(document, 'mouseup');

            // reset everything else
            this._htDown = null;
            this._lbSelRows = null;
            this._szRowCol = null;
            this._szArgs = null;
            this._dragSource = null;
        }

        // handles the mouse down event
        private _mousedown(e: MouseEvent) {
            var g = this._g;

            // make sure control bounds are refreshed before hit-testing 
            // (in case a container has scrolled)
            g._rcBounds = null;
            var ht = g.hitTest(e),
                ct = ht.cellType;

            // ignore clicks on unknown areas
            if (ct == CellType.None) {
                g.finishEditing();
                return;
            }

            // if the user clicked an active editor, let the editor handle things
            if (ct == CellType.Cell && g.editRange && g.editRange.contains(ht.range)) {
                return;
            }

            // ignore clicks on focused input elements (TFS 135271)
            var ae = getActiveElement();
            if (e.target == ae && g._isInputElement(e.target)) {
                return;
            }

            // unless the target has the focus, give it to the grid (TFS 81949, 102177, 120430)
            if (e.target != ae) {
                g.focus();
            }

            // check where the mouse is
            this._htDown = ht;
            this._eMouse = e;

            // handle resizing
            if (this._szRowCol != null) {
                this._handleResizing(e);
                return;
            }

            // starting cell selection? special handling for ListBox mode
            switch (ct) {
                case CellType.Cell:
                    if (e.ctrlKey && g.selectionMode == SelectionMode.ListBox) {
                        this._startListBoxSelection(ht.row);
                    }
                    this._mouseSelect(e, e.shiftKey);
                    break;
                case CellType.RowHeader:
                    if ((this._g.allowDragging & AllowDragging.Rows) == 0) {
                        if (e.ctrlKey && g.selectionMode == SelectionMode.ListBox) {
                            this._startListBoxSelection(ht.row);
                        }
                        this._mouseSelect(e, e.shiftKey);
                    }
                    break;
            }

            // handle collapse/expand (after selecting the cell)
            if (ct == CellType.Cell && g.rows.maxGroupLevel > -1) {
                var gr = <GroupRow>tryCast(g.rows[ht.row], GroupRow),
                    icon = closest(e.target, '.' + CellFactory._WJC_COLLAPSE);
                if (gr && icon) { // TFS 150397
                    if (e.ctrlKey) {

                        // ctrl+click: collapse/expand entire outline to this level
                        g.collapseGroupsToLevel(gr.isCollapsed ? gr.level + 1 : gr.level);

                    } else {

                        // simple click: toggle this group
                        gr.isCollapsed = !gr.isCollapsed;
                    }

                    // done with the mouse
                    this.resetMouseState();
                    e.preventDefault();
                    return;
                }
            }
        }

        // handles the mouse move event
        private _mousemove(e: MouseEvent) {
            if (this._htDown != null) {

                // in case we lost the focus or the button (TFS 145149)
                // note that e.which doesn't work correctly in FireFox: https://bugzilla.mozilla.org/show_bug.cgi?id=1048294
                setTimeout(() => {
                    if (!e.which || !this._g.containsFocus()) {
                        this.resetMouseState();
                    }
                });

                // handle the event as usual
                this._eMouse = e;
                if (this._szRowCol) {
                    this._handleResizing(e);
                } else {
                    switch (this._htDown.cellType) {
                        case CellType.Cell:
                            this._mouseSelect(e, true);
                            break;
                        case CellType.RowHeader:
                            if ((this._g.allowDragging & AllowDragging.Rows) == 0) {
                                this._mouseSelect(e, true);
                            }
                            break;
                    }
                }
            }
        }

        // handles the mouse up event
        private _mouseup(e: MouseEvent) {

            // IE raises mouseup while touch-dragging...???
            if (this._dragSource && this._g.isTouching) {
                return;
            }

            // select all cells, finish resizing, sorting
            var htd = this._htDown;
            if (htd && htd.cellType == CellType.TopLeft && !this._szArgs && !e.defaultPrevented) {
                var g = this._g,
                    ht = g.hitTest(e);
                if (ht.panel == htd.panel && ht.row == htd.row && ht.col == htd.col) {
                    var rng = g.getMergedRange(htd.panel, htd.row, htd.col) || ht.range;
                    if (rng.row == 0 && rng.col == 0) {
                        g.select(new CellRange(0, 0, g.rows.length - 1, g.columns.length - 1));
                    }
                }
            } else if (this._szArgs) {
                this._finishResizing(e);
            } else {
                this._handleSort(e);
            }

            // done with the mouse
            this.resetMouseState();
        }

        // handles double-clicks
        private _dblclick(e: MouseEvent) {
            var g = this._g,
                ht = g.hitTest(e),
                ct = ht.cellType,
                sel = g.selection,
                rng = ht.range,
                args: CellRangeEventArgs;

            // ignore if already handled
            if (e.defaultPrevented) {
                return;
            }

            // auto-size columns
            if (ht.edgeRight && (g.allowResizing & AllowResizing.Columns)) {
                if (ct == CellType.ColumnHeader || (ct == CellType.Cell && (g.allowResizing & _AR_ALLCELLS))) {
                    e.preventDefault();
                    if (e.ctrlKey && sel.containsColumn(ht.col)) {
                        rng = sel;
                    }
                    for (var c = rng.leftCol; c <= rng.rightCol; c++) {
                        if (g.columns[c].allowResizing) {
                            args = new CellRangeEventArgs(g.cells, new CellRange(-1, c));
                            if (g.onAutoSizingColumn(args) && g.onResizingColumn(args)) {
                                g.autoSizeColumn(c);
                                g.onResizedColumn(args);
                                g.onAutoSizedColumn(args);
                            }
                        }
                    }
                } else if (ct == CellType.TopLeft) {
                    if (g.topLeftCells.columns[ht.col].allowResizing) {
                        e.preventDefault();
                        args = new CellRangeEventArgs(g.topLeftCells, new CellRange(-1, ht.col));
                        if (g.onAutoSizingColumn(args) && g.onResizingColumn(args)) {
                            g.autoSizeColumn(ht.col, true);
                            g.onAutoSizedColumn(args);
                            g.onResizedColumn(args);
                        }
                    }
                }
                this.resetMouseState();
                return;
            }

            // auto-size rows
            if (ht.edgeBottom && (g.allowResizing & AllowResizing.Rows)) {
                if (ct == CellType.RowHeader || (ct == CellType.Cell && (g.allowResizing & _AR_ALLCELLS))) {
                    if (e.ctrlKey && sel.containsRow(ht.row)) {
                        rng = sel;
                    }
                    for (var r = rng.topRow; r <= rng.bottomRow; r++) {
                        if (g.rows[r].allowResizing) {
                            args = new CellRangeEventArgs(g.cells, new CellRange(r, -1));
                            if (g.onAutoSizingRow(args) && g.onResizingRow(args)) {
                                g.autoSizeRow(r);
                                g.onResizedRow(args);
                                g.onAutoSizedRow(args);
                            }
                        }
                    }
                } else if (ct == CellType.TopLeft) {
                    if (g.topLeftCells.rows[ht.row].allowResizing) {
                        args = new CellRangeEventArgs(g.topLeftCells, new CellRange(ht.row, -1));
                        if (g.onAutoSizingRow(args) && g.onResizingRow(args)) {
                            g.autoSizeRow(ht.row, true);
                            g.onResizedRow(args);
                            g.onAutoSizedRow(args);
                        }
                    }
                }
                this.resetMouseState();
            }
        }

        // offer to resize rows/columns
        private _hover(e: MouseEvent) {

            // make sure we're hovering
            if (this._htDown == null) {
                var g = this._g,
                    ht = g.hitTest(e),
                    p = ht.panel,
                    ct = ht.cellType,
                    cursor = 'default';

                // find which row/column is being resized
                this._szRowCol = null;
                if (ct == CellType.ColumnHeader || ct == CellType.TopLeft || (ct == CellType.Cell && (g.allowResizing & _AR_ALLCELLS))) {
                    if (ht.edgeRight && (g.allowResizing & AllowResizing.Columns) != 0) {
                        this._szRowCol = this._getResizeCol(ht);
                    }
                }
                if (ct == CellType.RowHeader || ct == CellType.TopLeft || (ct == CellType.Cell && (g.allowResizing & _AR_ALLCELLS))) {
                    if (ht.edgeBottom && (g.allowResizing & AllowResizing.Rows) != 0) {
                        this._szRowCol = this._getResizeRow(ht);
                    }
                }

                // keep track of element to resize and original size
                if (this._szRowCol instanceof Column) {
                    cursor = 'col-resize';
                } else if (this._szRowCol instanceof Row) {
                    cursor = 'row-resize';
                }
                this._szStart = this._szRowCol ? this._szRowCol.renderSize : 0;

                // update the cursor to provide user feedback
                g.hostElement.style.cursor = cursor;
            }
        }
        private _getResizeCol(ht: HitTestInfo): Column {

            // start with the column under the mouse
            var cols = ht.panel.columns,
                col = cols[ht.col];

            // if the next column in the panel is visible but collapsed, switch
            for (var c = ht.col + 1; c < cols.length; c++) {
                var newCol = cols[c];
                if (newCol.visible) {
                    if (newCol.size < 1) {
                        col = newCol;
                    }
                    break;
                }
            }

            // if this is the last column on a fixed panel, and the first
            // column on the cells panel is visible but collapsed, switch
            if (ht.col == cols.length - 1) {
                if (ht.cellType == CellType.TopLeft || ht.cellType == CellType.RowHeader) {
                    cols = this._g.columns;
                    for (var c = 0; c < cols.length; c++) {
                        var newCol = cols[c];
                        if (newCol.visible) {
                            if (newCol.size < 1) {
                                col = newCol;
                            }
                            break;
                        }
                    }
                }
            }

            // return the column we got
            return col.allowResizing ? col : null;
        }
        private _getResizeRow(ht: HitTestInfo): Row {

            // start with the row under the mouse
            var rows = ht.panel.rows,
                row = rows[ht.row];

            // if the next row in the panel is visible but collapsed, switch
            for (var r = ht.row + 1; r < rows.length; r++) {
                var newRow = rows[r];
                if (newRow.visible) {
                    if (newRow.size < 1) {
                        row = newRow;
                    }
                    break;
                }
            }

            // if this is the last row on a fixed panel, and the first
            // row on the cells panel is visible but collapsed, switch
            if (ht.row == rows.length - 1) {
                if (ht.cellType == CellType.TopLeft || ht.cellType == CellType.ColumnHeader) {
                    rows = this._g.rows;
                    for (var r = 0; r < rows.length; r++) {
                        var newRow = rows[r];
                        if (newRow.visible) {
                            if (newRow.size < 1) {
                                row = newRow;
                            }
                            break;
                        }
                    }
                }
            }

            // return the column we got
            return row.allowResizing ? row : null;
        }

        // handles mouse moves while the button is pressed on the cell area
        private _mouseSelect(e: MouseEvent, extend: boolean) {
            if (this._htDown && this._htDown.panel && this._g.selectionMode != SelectionMode.None) {

                // handle the selection
                var ht = new HitTestInfo(this._htDown.panel, e);
                this._handleSelection(ht, extend);

                // done, prevent selection of content outside the grid
                // (unless the click was on an element that wants/needs it!!! TFS 191989)
                if (!this._g._isInputElement(e.target)) {
                    e.preventDefault();
                }

                // keep calling this if the user keeps the mouse outside the control without moving it
                // but don't do this in IE9, it can keep scrolling forever... TFS 110374
                // NOTE: doesn't seem to be an issue anymore, but keep the check to avoid potential regressions.
                if (!isIE9() && e.button >= 0) {
                    ht = new HitTestInfo(this._g, e);
                    if (ht.cellType != CellType.Cell && ht.cellType != CellType.RowHeader) {
                        setTimeout(() => {
                            this._mouseSelect(this._eMouse, extend);
                        }, 100);
                    }
                }
            }
        }

        // handle row and column resizing
        private _handleResizing(e: MouseEvent) {

            // prevent browser from selecting cell content
            e.preventDefault();

            // resizing column
            if (this._szRowCol instanceof Column) {
                var g = this._g,
                    pageX = e.clientX + pageXOffset, // e.pageXY doesn't work well in Chrome/zoom/touch
                    sz = Math.round(Math.max(_MouseHandler._SZ_MIN, this._szStart + (pageX - this._htDown.point.x) * (g._rtl ? -1 : 1)));
                if (this._szRowCol.renderSize != sz) {
                    if (this._szArgs == null) {
                        var panel = g.rowHeaders.columns.indexOf(this._szRowCol) > -1 ? g.rowHeaders : g.cells;
                        this._szArgs = new CellRangeEventArgs(panel, new CellRange(-1, this._szRowCol.index));
                    }
                    this._szArgs.cancel = false;
                    if (g.onResizingColumn(this._szArgs)) { // TFS 144204
                        if (g.deferResizing || g.isTouching) {
                            this._showResizeMarker(sz);
                        } else {
                            (<Column>this._szRowCol).width = sz;
                        }
                    }
                }
            }

            // resizing row
            if (this._szRowCol instanceof Row) {
                var g = this._g,
                    pageY = e.clientY + pageYOffset, // e.pageXY doesn't work well in Chrome/zoom/touch
                    sz = Math.round(Math.max(_MouseHandler._SZ_MIN, this._szStart + (pageY - this._htDown.point.y)));
                if (this._szRowCol.renderSize != sz) {
                    if (this._szArgs == null) {
                        var panel = g.columnHeaders.rows.indexOf(this._szRowCol) > -1 ? g.columnHeaders : g.cells;
                        this._szArgs = new CellRangeEventArgs(panel, new CellRange(this._szRowCol.index, -1));
                    }
                    this._szArgs.cancel = false;
                    if (g.onResizingRow(this._szArgs)) { // TFS 144204
                        if (g.deferResizing || g.isTouching) {
                            this._showResizeMarker(sz);
                        } else {
                            (<Row>this._szRowCol).height = sz;
                        }
                    }
                }
            }
        }

        // drag-drop handling (dragging rows/columns)
        private _dragstart(e: DragEvent) {
            var g = this._g,
                ht = this._htDown;

            // make sure this is event is ours
            if (!ht) {
                return;
            }

            // get drag source element (if we're not resizing)
            this._dragSource = null;
            if (!this._szRowCol) {
                var args = new CellRangeEventArgs(g.cells, ht.range);
                if (ht.cellType == CellType.ColumnHeader && (g.allowDragging & AllowDragging.Columns) &&
                    ht.col > -1 && g.columns[ht.col].allowDragging) {
                    if (g.onDraggingColumn(args)) {
                        this._dragSource = e.target;
                    }
                } else if (ht.cellType == CellType.RowHeader && (g.allowDragging & AllowDragging.Rows) &&
                    ht.row > -1 && g.rows[ht.row].allowDragging) {
                    var row = g.rows[ht.row];
                    if (!(row instanceof GroupRow) && !(row instanceof _NewRowTemplate)) {
                        if (g.onDraggingRow(args)) {
                            this._dragSource = e.target;
                        }
                    }
                }
            }

            // if we have a valid source, set opacity; ow prevent dragging
            if (this._dragSource && e.dataTransfer) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text', ''); // required in FireFox (note: 'text/html' throws in IE!)
                this._dragSource.style.opacity = .5;
                e.stopPropagation(); // prevent parent grids from cancelling the event (TFS 120810)
                g.beginUpdate(); // suspend updates while dragging
            } else {
                e.preventDefault();
            }
        }
        private _dragend(e: DragEvent) {
            this._g.endUpdate(); // restore updates after dragging
            this.resetMouseState();
        }
        private _dragover(e: DragEvent) {
            var g = this._g,
                ht = g.hitTest(e),
                valid = false;

            // check whether the move is valid
            if (this._htDown && ht.cellType == this._htDown.cellType) {
                if (ht.cellType == CellType.ColumnHeader) {
                    valid = g.columns.canMoveElement(this._htDown.col, ht.col);
                } else if (ht.cellType == CellType.RowHeader) {
                    valid = g.rows.canMoveElement(this._htDown.row, ht.row);
                }
            }

            // if valid, prevent default to allow drop
            if (valid) {
                e.dataTransfer.dropEffect = 'move';
                e.preventDefault();
                this._showDragMarker(ht);
            } else {
                this._showDragMarker(null);
            }
        }
        private _drop(e: DragEvent) {
            var g = this._g,
                ht = g.hitTest(e),
                args = new CellRangeEventArgs(g.cells, ht.range);

            // move the row/col to a new position
            if (this._htDown && ht.cellType == this._htDown.cellType) {
                var sel = g.selection;
                if (ht.cellType == CellType.ColumnHeader) {
                    g.columns.moveElement(this._htDown.col, ht.col);
                    g.select(sel.row, ht.col);
                    g.onDraggedColumn(args);
                } else if (ht.cellType == CellType.RowHeader) {
                    g.rows.moveElement(this._htDown.row, ht.row);
                    g.select(ht.row, sel.col);
                    g.onDraggedRow(args);
                }
            }
            this.resetMouseState();
        }

        // updates the marker to show the new size of the row/col being resized
        private _showResizeMarker(sz: number) {
            var g = this._g;

            // add marker element to panel
            var t = this._dvMarker;
            if (!t.parentElement) {
                g.cells.hostElement.appendChild(t);
            }

            // update marker position
            var css: any,
                ct = this._szArgs.panel.cellType;
            if (this._szRowCol instanceof Column) {
                css = {
                    display: '',
                    left: this._szRowCol.pos + sz - 1,
                    top: 0,
                    right: '',
                    bottom: 0,
                    width: 3,
                    height: '',
                    zIndex: 1000
                }
                if (g._rtl) {
                    css.left = t.parentElement.clientWidth - css.left - css.width;
                }
                if (ct == CellType.TopLeft || ct == CellType.RowHeader) {
                    css.left -= g.topLeftCells.hostElement.offsetWidth;
                }
            } else { 
                css = {
                    left: 0,
                    top: this._szRowCol.pos + sz - 1,
                    right: 0,
                    bottom: '',
                    width: '',
                    height: 3,
                    zIndex: 1000
                }
                if (ct == CellType.TopLeft || ct == CellType.ColumnHeader) {
                    css.top -= g.topLeftCells.hostElement.offsetHeight;
                }
            }

            // apply new position
            setCss(t, css);
        }

        // updates the marker to show the position where the row/col will be inserted
        private _showDragMarker(ht: HitTestInfo) {
            var g = this._g;

            // remove target indicator if no HitTestInfo
            var t = this._dvMarker;
            if (!ht) {
                if (t.parentElement) {
                    t.parentElement.removeChild(t);
                }
                this._rngTarget = null;
                return;
            }

            // avoid work/flicker
            if (ht.range.equals(this._rngTarget)) {
                return;
            }
            this._rngTarget = ht.range;

            // add marker element to panel
            if (!t.parentElement) {
                ht.panel.hostElement.appendChild(t);
            }

            // update marker position
            var css: any = {
                display: '',
                left: 0,
                top: 0,
                width: 6,
                height: 6
            };
            switch (ht.cellType) {
                case CellType.ColumnHeader:
                    css.height = ht.panel.height;
                    var col = g.columns[ht.col];
                    css.left = col.pos - css.width / 2;
                    if (ht.col > this._htDown.col) {
                        css.left += col.renderWidth;
                    }
                    if (g._rtl) {
                        css.left = t.parentElement.clientWidth - css.left - css.width;
                    }
                    break;
                case CellType.RowHeader:
                    css.width = ht.panel.width;
                    var row = g.rows[ht.row];
                    css.top = row.pos - css.height / 2;
                    if (ht.row > this._htDown.row) {
                        css.top += row.renderHeight;
                    }
                    break;
            }

            // update marker
            setCss(t, css);
        }

        // raises the ResizedRow/Column events and 
        // applies the new size to the selection if the control key is pressed
        private _finishResizing(e: MouseEvent) {
            var g = this._g,
                sel = g.selection,
                ctrl = this._eMouse.ctrlKey,
                args = this._szArgs,
                pageX = e.clientX + pageXOffset, // e.pageXY doesn't work well in Chrome/zoom/touch
                pageY = e.clientY + pageYOffset,
                rc: number,
                sz;

            // finish column sizing
            if (args && !args.cancel && args.col > -1) { // TFS 144204

                // apply new size, fire event
                rc = args.col;
                sz = Math.round(Math.max(_MouseHandler._SZ_MIN, this._szStart + (pageX - this._htDown.point.x) * (this._g._rtl ? -1 : 1)));
                args.panel.columns[rc].width = Math.round(sz);
                g.onResizedColumn(args);

                // apply new size to selection if the control key is pressed
                if (ctrl && this._htDown.cellType == CellType.ColumnHeader && sel.containsColumn(rc)) {
                    for (var c = sel.leftCol; c <= sel.rightCol; c++) {
                        if (g.columns[c].allowResizing && c != rc) {
                            args = new CellRangeEventArgs(g.cells, new CellRange(-1, c));
                            if (g.onResizingColumn(args)) {
                                g.columns[c].size = g.columns[rc].size;
                                g.onResizedColumn(args);
                            }
                        }
                    }
                }
            }

            // finish row sizing
            if (args && !args.cancel && args.row > -1) { // TFS 144204

                // apply new size, fire event
                rc = args.row;
                sz = Math.round(Math.max(_MouseHandler._SZ_MIN, this._szStart + (pageY - this._htDown.point.y)));
                args.panel.rows[rc].height = Math.round(sz);
                g.onResizedRow(args);

                // apply new size to selection if the control key is pressed
                if (ctrl && this._htDown.cellType == CellType.RowHeader && sel.containsRow(rc)) {
                    for (var r = sel.topRow; r <= sel.bottomRow; r++) {
                        if (g.rows[r].allowResizing && r != rc) {
                            args = new CellRangeEventArgs(g.cells, new CellRange(r, -1));
                            if (g.onResizingRow(args)) { // TFS 144204
                                g.rows[r].size = g.rows[rc].size;
                                g.onResizedRow(args);
                            }
                        }
                    }
                }
            }
        }

        // start ListBox selection by keeping track of which rows were selected 
        // when the action started
        private _startListBoxSelection(row: number) {
            var rows = this._g.rows;
            this._lbSelState = !rows[row].isSelected;
            this._lbSelRows = {};
            for (var r = 0; r < rows.length; r++) {
                if (rows[r].isSelected) {
                    this._lbSelRows[r] = true;
                }
            }
        }

        // handle mouse selection
        private _handleSelection(ht: HitTestInfo, extend: boolean) {
            var g = this._g,
                rows = g.rows,
                sel = g._selHdl._sel,
                rng = new CellRange(ht.row, ht.col);

            // check that the selection is valid
            if (ht.row > -1 && ht.col > -1) {
                if (this._lbSelRows != null) {

                    // special handling for ListBox mode
                    var changed = false;
                    rng = new CellRange(ht.row, ht.col, this._htDown.row, this._htDown.col);
                    for (var r = 0; r < rows.length; r++) {
                        var selected = rng.containsRow(r) ? this._lbSelState : this._lbSelRows[r] != null;
                        if (selected != rows[r].isSelected) {
                            var e = new CellRangeEventArgs(g.cells, new CellRange(r, sel.col, r, sel.col2));
                            if (g.onSelectionChanging(e)) {
                                rows[r]._setFlag(RowColFlags.Selected, selected, true);
                                changed = true;
                                //rows[r].isSelected = selected; // this invalidates
                                g.onSelectionChanged(e);
                            }
                        }
                    }

                    // if the selection changed, refresh cells to show the change
                    if (changed) {
                        g.refreshCells(false, true, true);
                    }

                    // and scroll the selection into view
                    g.scrollIntoView(ht.row, ht.col);

                } else {

                    // row headers, select the whole row
                    if (ht.cellType == CellType.RowHeader) {
                        rng.col = 0;
                        rng.col2 = g.columns.length - 1;
                    }
                    
                    // extend range if that was asked
                    if (extend) {
                        rng.row2 = sel.row2;
                        rng.col2 = sel.col2;
                    }

                    // select
                    g.select(rng);
                }
            }
        }

        // handle mouse sort
        private _handleSort(e: MouseEvent) {
            var g = this._g,
                cv = g.collectionView,
                ht = g.hitTest(e);

            if (this._htDown && ht.cellType == this._htDown.cellType && ht.col == this._htDown.col && 
                ht.cellType == CellType.ColumnHeader && !ht.edgeRight && ht.col > -1 &&
                cv && cv.canSort && g.allowSorting) {

                // get row that was clicked accounting for merging
                var rng = g.getMergedRange(ht.panel, ht.row, ht.col),
                    row = rng ? rng.row2 : ht.row;
                
                // get column and binding column
                var col = g.columns[ht.col],
                    bcol = g._getBindingColumn(ht.panel, ht.row, col);

                // if the click was on the sort row, sort
                if (row == g._getSortRowIndex() || col != bcol) {
                    var currSort = bcol.currentSort,
                        asc = currSort != '+';
                    if (bcol.allowSorting && bcol.binding) {

                        // can't remove sort from unsorted column
                        if (!currSort && e.ctrlKey) return;

                        // raise sorting column
                        var args = new CellRangeEventArgs(g.columnHeaders, new CellRange(-1, ht.col));
                        if (g.onSortingColumn(args)) {

                            // update sort
                            var sds = cv.sortDescriptions;
                            if (e.ctrlKey) {
                                sds.clear();
                            } else {
                                sds.splice(0, sds.length, new collections.SortDescription(bcol._getBindingSort(), asc));
                            }

                            // raise sorted column
                            g.onSortedColumn(args);
                        }
                    }
                }
            }
        }
    }
}