/**
 * Defines the @see:MultiRow control and its associated classes.
 */
module wijmo.grid.multirow {
    'use strict';

    /**
     * Extends the @see:FlexGrid control to provide multiple rows per item.
     *
     * Use the <b>layoutDefinition</b> property to define the layout of the rows 
     * used to display each data item.
     *
     * A few @see:FlexGrid properties are disabled in the @see:MultiRow control
     * because they would interfere with the custom multi-row layouts.
     * The list of disabled properties includes @see:FlexGrid.allowMerging and
     * @see:FlexGrid.childItemsPath.
     */
    export class MultiRow extends FlexGrid {
        _rowsPerItem = 1;
        _layoutDef: any[];
        _cellBindingGroups: _CellGroup[] = [];
        _cellGroupsByColumn: any;
        _centerVert = true;
        _collapsedHeaders = false;
        _btnCollapse: HTMLElement;

        /**
         * Initializes a new instance of the @see:MultiRow class.
         * 
         * In most cases, the <b>options</b> parameter will include the value for the
         * @see:layoutDefinition property.
         *
         * @param element The DOM element that will host the control, or a selector for the host element (e.g. '#theCtrl').
         * @param options JavaScript object containing initialization data for the control.
         */
        constructor(element: any, options?) {
            super(element);

            // add class name to enable styling
            addClass(this.hostElement, 'wj-multirow');

            // add header collapse/expand button
            var hdr = this.columnHeaders.hostElement.parentElement,
                btn = createElement('<div class="wj-hdr-collapse"><span></span></div>');
            btn.style.display = 'none';
            hdr.appendChild(btn);
            this._btnCollapse = btn;
            this._updateButtonGlyph();

            // handle mousedown on collapse/expand button (not click: TFS 190572)
            this.addEventListener(btn, 'mousedown', (e: MouseEvent) => {
                this.collapsedHeaders = !this.collapsedHeaders;
                e.preventDefault();
            }, true);

            // change some defaults
            this.autoGenerateColumns = false;
            this.allowDragging = grid.AllowDragging.None;
            this.mergeManager = new _MergeManager(this);

            // custom AddNewHandler
            this._addHdl = new _AddNewHandler(this);

            // customize cell rendering
            this.formatItem.addHandler(this._formatItem, this);

            // select multi-row items when clicking the row headers
            this.addEventListener(this.rowHeaders.hostElement, 'click', (e: MouseEvent) => {
                var ht = this.hitTest(e);
                if (ht.panel == this.rowHeaders && ht.row > -1) {
                    var row = <_MultiRow>this.rows[ht.row];
                    if (row.recordIndex != null) {
                        var top = row.index - row.recordIndex;
                        this.select(new CellRange(top, 0, top + this.rowsPerItem - 1, this.columns.length - 1));
                    }
                }
            });

            // apply options after everything else is ready
            this.initialize(options);
        }

        /**
         * Gets or sets an array that defines the layout of the rows used to display each data item.
         *
         * The array contains a list of cell group objects which have the following properties:
         *
         * <ul>
         * <li><b>header</b>: Group header (shown when the headers are collapsed)</li>
         * <li><b>colspan</b>: Number of grid columns spanned by the group</li>
         * <li><b>cells</b>: Array of cell objects, which extend @see:Column with a <b>colspan</b> property.</li>
         * </ul>
         *
         * When the @see:layoutDefinition property is set, the grid scans the cells in each
         * group as follows:
         *
         * <ol>
         * <li>The grid calculates the colspan of the group either as group's own colspan 
         * or as span of the widest cell in the group, whichever is wider.</li>
         * <li>If the cell fits the current row within the group, it is added to the current row.</li>
         * <li>If it doesn't fit, it is added to a new row.</li>
         * </ol>
         *
         * When all groups are ready, the grid calculates the number of rows per record to the maximum 
         * rowspan of all groups, and adds rows to each group to pad their height as needed.
         *
         * This scheme is simple and flexible. For example:
         * <pre>{ header: 'Group 1', cells: [{ binding: 'c1' }, { bnding: 'c2'}, { binding: 'c3' }]}</pre>
         *
         * The group has colspan 1, so there will be one cell per column. The result is:
         * <pre>
         * | C1 |
         * | C2 |
         * | C3 |
         * </pre>
         *
         * To create a group with two columns, set <b>colspan</b> property of the group:
         *
         * <pre>{ header: 'Group 1', colspan: 2, cells:[{ binding: 'c1' }, { binding: 'c2'}, { binding: 'c3' }]}</pre>
         *
         * The cells will wrap as follows:
         * <pre>
         * | C1  | C2 |
         * | C3       |
         * </pre>
         *
         * Note that the last cell spans two columns (to fill the group).
         *
         * You can also specify the colspan on individual cells rather than on the group:
         *
         * <pre>{ header: 'Group 1', cells: [{binding: 'c1', colspan: 2 }, { bnding: 'c2'}, { binding: 'c3' }]}</pre>
         *
         * Now the first cell has colspan 2, so the result is:
         * <pre>
         * | C1       |
         * | C2 |  C3 |
         * </pre>
         *
         * Because cells extend the @see:Column class, you can add all the usual @see:Column 
         * properties to any cells:
         * <pre>
         * { header: 'Group 1', cells: [
         *    { binding: 'c1', colspan: 2 },
         *    { bnding: 'c2'},
         *    { binding: 'c3', format: 'n0', required: false, etc... } 
         * ]}</pre>
         */
        get layoutDefinition(): any[] {
            return this._layoutDef;
        }
        set layoutDefinition(value: any[]) {

            // store original value so user can get it back
            this._layoutDef = asArray(value);

            // parse cell bindings
            this._rowsPerItem = 1;
            this._cellBindingGroups = this._parseCellGroups(this._layoutDef);
            for (var i = 0; i < this._cellBindingGroups.length; i++) {
                var group = this._cellBindingGroups[i];
                this._rowsPerItem = Math.max(this._rowsPerItem, group._rowspan);
            }

            // go bind/rebind the grid
            this._bindGrid(true);
        }
        /**
         * Gets the number of rows used to display each item.
         *
         * This value is calculated automatically based on the value
         * of the <b>layoutDefinition</b> property.
         */
        get rowsPerItem(): number {
            return this._rowsPerItem;
        }
        /**
         * Gets the @see:Column object used to bind a data item to a grid cell.
         *
         * @param p @see:GridPanel that contains the cell.
         * @param r Index of the row that contains the cell.
         * @param c Index of the column that contains the cell.
         */
        getBindingColumn(p: GridPanel, r: number, c: number): Column {
            return this._getBindingColumn(p, r, p.columns[c]);
        }
        /**
         * Gets or sets a value that determines whether the content of cells
         * that span multiple rows should be vertically centered.
         */
        get centerHeadersVertically(): boolean {
            return this._centerVert;
        }
        set centerHeadersVertically(value: boolean) {
            if (value != this._centerVert) {
                this._centerVert = asBoolean(value);
                this.invalidate();
            }
        }
        /**
         * Gets or sets a value that determines whether column headers
         * should be collapsed and displayed as a single row displaying 
         * the group headers.
         *
         * If you set the <b>collapsedHeaders</b> property to true, 
         * remember to set the <b>header</b> property of every group in order
         * to avoid any empty headers.
         */
        get collapsedHeaders(): boolean {
            return this._collapsedHeaders;
        }
        set collapsedHeaders(value: boolean) {
            if (value != this._collapsedHeaders) {
                this._collapsedHeaders = asBoolean(value);
                this._updateButtonGlyph();
                this._bindGrid(true);
            }
        }
        /**
         * Gets or sets a value that determines whether the grid should display
         * a button in the column header panel to allow users to collapse and
         * expand the column headers.
         *
         * If the button is visible, clicking on it will cause the grid to 
         * toggle the value of the <b>collapsedHeaders</b> property.
         */
        get showHeaderCollapseButton(): boolean {
            return this._btnCollapse.style.display == '';
        }
        set showHeaderCollapseButton(value: boolean) {
            if (value != this.showHeaderCollapseButton) {
                this._btnCollapse.style.display = asBoolean(value) ? '' : 'none';
            }
        }

        // ** overrides

        // bind rows
        /*protected*/ _addBoundRow(items: any[], index: number) {
            var item = items[index];
            for (var i = 0; i < this._rowsPerItem; i++) {
                this.rows.push(new _MultiRow(item, index, i));
            }
        }
        /*protected*/ _addNode(items: any[], index: number, level: number) {
            this._addBoundRow(items, index); // childItemsPath not supported
        }

        // bind columns
        /*protected*/ _bindColumns() {

            // update column header row count
            var rows = this.columnHeaders.rows,
                cnt = this._collapsedHeaders ? 1 : this._rowsPerItem;
            while (rows.length > cnt) {
                rows.removeAt(rows.length - 1);
            }
            while (rows.length < cnt) {
                rows.push(new Row());
            }

            // remove old columns
            this.columns.clear();
            this._cellGroupsByColumn = {};

            // get first item to infer data types
            var item = null,
                cv = this.collectionView;
            if (cv && cv.sourceCollection && cv.sourceCollection.length) {
                item = cv.sourceCollection[0];
            }

            // generate columns
            if (this._cellBindingGroups) {
                for (var i = 0; i < this._cellBindingGroups.length; i++) {
                    var group = this._cellBindingGroups[i];
                    for (var c = 0; c < group._colspan; c++) {
                        this._cellGroupsByColumn[this.columns.length] = group;
                        var col = new Column();
                        var cell = group.cells[c];
                        col.width = cell.width;
                        col.binding = cell.binding;
                        col.aggregate = cell.aggregate;
                        this.columns.push(col);
                    }
                }
            }
        }

        // update missing column types to match data
        /*protected*/ _updateColumnTypes() {

            // allow base class
            super._updateColumnTypes();

            // update missing column types in all binding groups
            var cv = this.collectionView;
            if (hasItems(cv)) {
                var item = cv.items[0];
                for (var i = 0; i < this._cellBindingGroups.length; i++) {
                    var group = this._cellBindingGroups[i];
                    for (var c = 0; c < group._cols.length; c++) {
                        var col = group._cols[c];
                        if (col.dataType == null && col._binding) {
                            col.dataType = getType(col._binding.getValue(item));
                        }
                    }
                }
            }
        }

        // get the binding column 
        // (in the MultiRow grid, each physical column may contain several binding columns)
        /*protected*/ _getBindingColumn(p: GridPanel, r: Number, c: Column): Column {

            // convert column to binding column (cell)
            if (p == this.cells || p == this.columnHeaders) {
                var group = this._cellGroupsByColumn[c.index];
                if (p == this.columnHeaders && this.collapsedHeaders) {
                    r = -1; // handle collapsed headers
                }
                c = group.getBindingColumn(p, r, c.index);
            }

            // done
            return c;
        }

        // update grid rows to sync with data source
        /*protected*/ _cvCollectionChanged(sender, e: collections.NotifyCollectionChangedEventArgs) {
            if (this.autoGenerateColumns && this.columns.length == 0) {
                this._bindGrid(true);
            } else {
                switch (e.action) {

                    // item changes don't require re-binding
                    case collections.NotifyCollectionChangedAction.Change:
                        this.invalidate();
                        break;

                    // always add at the bottom (TFS 193086)
                    case collections.NotifyCollectionChangedAction.Add:
                        if (e.index == this.collectionView.items.length - 1) {
                            var index = this.rows.length;
                            while (index > 0 && this.rows[index - 1] instanceof _NewRowTemplate) {
                                index--;
                            }
                            for (var i = 0; i < this._rowsPerItem; i++) {
                                this.rows.insert(index + i, new _MultiRow(e.item, e.index, i));
                            }
                            return;
                        }
                        assert(false, 'added item should be the last one.');
                        break;

                    // remove/refresh require re-binding
                    default:
                        this._bindGrid(false);
                        break;
                }
            }
        }

        // ** implementation

        // parse an array of JavaScript objects into an array of _BindingGroup objects
        _parseCellGroups(groups: any[]): _CellGroup[] {
            var arr: _CellGroup[] = [],
                rowsPerItem = 1;
            if (groups) {

                // parse binding groups
                for (var i = 0, colstart = 0; i < groups.length; i++) {
                    var group = new _CellGroup(this, groups[i]);
                    group._colstart = colstart;
                    colstart += group._colspan;
                    rowsPerItem = Math.max(rowsPerItem, group._rowspan);
                    arr.push(group);
                }

                // close binding groups (calculate group's rowspan, ranges, and bindings)
                for (var i = 0; i < arr.length; i++) {
                    arr[i].closeGroup(rowsPerItem);
                }
            }
            return arr;
        }

        // customize cells
        _formatItem(s: MultiRow, e: FormatItemEventArgs) {
            var rpi = this._rowsPerItem,
                row = <_MultiRow>e.panel.rows[e.range.row],
                row2 = <_MultiRow>e.panel.rows[e.range.row2];

            // add group start/end class markers
            if (e.panel.cellType == CellType.Cell || e.panel.cellType == CellType.ColumnHeader) {
                var group = <_CellGroup>this._cellGroupsByColumn[e.col];
                assert(group instanceof _CellGroup, 'Failed to get the group!');
                toggleClass(e.cell, 'wj-group-start', group._colstart == e.range.col);
                toggleClass(e.cell, 'wj-group-end', group._colstart + group._colspan - 1 == e.range.col2);
            }

            // add item start/end class markers
            if (rpi > 1) {
                if (e.panel.cellType == CellType.Cell || e.panel.cellType == CellType.RowHeader) {
                    toggleClass(e.cell, 'wj-record-start', row instanceof _MultiRow ? row.recordIndex == 0 : false);
                    toggleClass(e.cell, 'wj-record-end', row2 instanceof _MultiRow ? row2.recordIndex == rpi - 1 : false);
                }
            }

            // handle alternating rows
            if (this.showAlternatingRows) {
                toggleClass(e.cell, 'wj-alt', row instanceof _MultiRow ? row.dataIndex % 2 != 0 : false);
            }

            // center-align cells vertically if they span multiple rows
            if (this._centerVert) {
                if (e.cell.hasChildNodes && e.range.rowSpan > 1) {

                    // surround cell content in a vertically centered table-cell div
                    var div = createElement('<div style="display:table-cell;vertical-align:middle"></div>'),
                        rng = document.createRange();
                    rng.selectNodeContents(e.cell);
                    rng.surroundContents(div);

                    // make the cell display as a table
                    setCss(e.cell, {
                        display: 'table',
                        tableLayout: 'fixed',
                        paddingTop: 0, // remove top/bottom padding to work around Safari bug
                        paddingBottom: 0
                    });
                } else { // restore defaults for non-merged cells
                    setCss(e.cell, {
                        display: '',
                        tableLayout: '',
                        paddingTop: '',
                        paddingBottom: ''
                    });
                }
            }
        }

        // update glyph in collapse/expand headers button
        _updateButtonGlyph() {
            var span = <HTMLElement>this._btnCollapse.querySelector('span');
            if (span instanceof HTMLElement) {
                span.className = this.collapsedHeaders ? 'wj-glyph-left' : 'wj-glyph-down-left';
            }
        }
    }
}