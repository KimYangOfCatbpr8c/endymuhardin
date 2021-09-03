///<wijmo-soft-import from="wijmo.input"/>

// enable use of EcmaScript6 maps
//declare var Map: any;

// initialize groupHeaderFormat
wijmo.culture.FlexGrid = {
    groupHeaderFormat: '{name}: <b>{value} </b>({count:n0} items)'
};

/**
 * Defines the @see:FlexGrid control and associated classes.
 *
 * The example below creates a @see:FlexGrid control and binds it to a
 * 'data' array. The grid has four columns, specified by explicitly
 * populating the grid's @see:FlexGrid.columns array.
 *
 * @fiddle:6GB66
 */
module wijmo.grid {
    'use strict';

    /**
     * Specifies constants that define the visibility of row and column headers.
     */
    export enum HeadersVisibility {
        /** No header cells are displayed. */
        None = 0,
        /** Only column header cells are displayed. */
        Column = 1,
        /** Only row header cells are displayed. */
        Row = 2,
        /** Both column and row header cells are displayed. */
        All = 3,
    }

    /**
     * The @see:FlexGrid control provides a powerful and flexible way to
     * display and edit data in a tabular format.
     *
     * The @see:FlexGrid control is a full-featured grid, providing all the
     * features you are used to including several selection modes, sorting,
     * column reordering, grouping, filtering, editing, custom cells,
     * XAML-style star-sizing columns, row and column virtualization, etc.
     */
    export class FlexGrid extends Control {

        // constants
        static _WJS_STICKY = 'wj-state-sticky';
        static _WJS_MEASURE = 'wj-state-measuring';

        // child elements
        private _root: HTMLDivElement;
        private _eCt: HTMLDivElement;
        private _fCt: HTMLDivElement;
        /*private*/ _eTL: HTMLDivElement; // visible to HitTestInfo
        /*private*/ _eBL: HTMLDivElement; // visible to HitTestInfo
        private _eCHdr: HTMLDivElement;
        private _eCFtr: HTMLDivElement;
        private _eRHdr: HTMLDivElement;
        private _eCHdrCt: HTMLDivElement;
        private _eCFtrCt: HTMLDivElement;
        private _eRHdrCt: HTMLDivElement;
        private _eTLCt: HTMLDivElement;
        private _eBLCt: HTMLDivElement;
        private _eSz: HTMLDivElement;
        private _eMarquee: HTMLDivElement;
        private _eFocus: HTMLDivElement;

        // child panels
        private _gpTL: GridPanel;
        private _gpCHdr: GridPanel;
        private _gpRHdr: GridPanel;
        private _gpCells: GridPanel;
        private _gpBL: GridPanel;
        private _gpCFtr: GridPanel;

        // private stuff
        private _maxOffsetY: number;
        private _heightBrowser: number;
        /*private*/ _szClient = new Size(0, 0);
        /*private*/ _offsetY: number;
        /*private*/ _lastCount: number;
        /*private*/ _rcBounds: Rect; // accessible to MouseHandler
        /*private*/ _ptScrl = new Point(0, 0); // accessible to GridPanel
        /*private*/ _rtl = false; // accessible to CellFactory, GridFilter
        /*private*/ _cellPadding = 3; // accessible to CellFactory

        // selection/key/mouse handlers
        /*private*/_mouseHdl: _MouseHandler;    // accessible to keyboard handler
        /*private*/_edtHdl: _EditHandler;       // accessible to keyboard handler
        /*private*/_selHdl: _SelectionHandler;  // accessible to keyboard handler
        /*private*/_addHdl: _AddNewHandler;     // accessible to derived classes (e.g. MultiRow)
        /*private*/_keyHdl: _KeyboardHandler;   // accessible to IME handler
        private _imeHdl: _ImeHandler;
        private _mrgMgr: MergeManager;

        // property storage
        private _autoGenCols = true;
        private _autoClipboard = true;
        private _readOnly = false;
        private _indent = 14;
        private _autoSizeMode = AutoSizeMode.Both;
        private _hdrVis = HeadersVisibility.All;
        private _alSorting = true;
        private _alAddNew = false;
        private _alDelete = false;
        private _alResizing = AllowResizing.Columns;
        private _alDragging = AllowDragging.Columns;
        private _alMerging = AllowMerging.None;
        private _ssHdr = HeadersVisibility.None;
        private _shSort = true;
        private _shGroups = true;
        private _shAlt = true;
        private _shErr = true;
        private _valEdt = true;
        private _gHdrFmt: string;
        private _rows: RowCollection;
        private _cols: ColumnCollection;
        private _hdrRows: RowCollection;
        private _ftrRows: RowCollection;
        private _hdrCols: ColumnCollection;
        private _cf: CellFactory;
        private _itemFormatter: Function;
        private _items: any; // any[] or ICollectionView
        private _cv: collections.ICollectionView;
        private _childItemsPath: any;
        private _sortRowIndex: number;
        private _deferResizing = false;
        private _bndSortConverter;
        private _afScrl: number;
        private _stickyHdr: boolean;
        private _toSticky: number;
        private _pSel = true;
        private _pOutline = true;

        /**
         * Gets or sets the template used to instantiate @see:FlexGrid controls.
         */
        static controlTemplate = '<div style="position:relative;width:100%;height:100%;overflow:hidden;max-width:inherit;max-height:inherit">' +
          '<div wj-part="focus" tabIndex="0" style="position:absolute;opacity:0;pointer-events:none;left:-10px;top:-10px"></div>' +
          '<div wj-part="root" style="position:absolute;width:100%;height:100%;overflow:auto;-webkit-overflow-scrolling:touch;max-width:inherit;max-height:inherit;boxSizing:content-box">' + // cell container
            '<div wj-part="cells" class="wj-cells" style="position:absolute"></div>' + // cells
            '<div wj-part="marquee" class="wj-marquee" style="display:none;pointer-events:none">' +  // marquee
              '<div style="width:100%;height:100%"></div>' +
            '</div>' +
          '</div>' +
          '<div wj-part="fcells" style="position:absolute;pointer-events:none;overflow:hidden"></div>' + // frozen cells
          '<div wj-part="rh" style="position:absolute;overflow:hidden;outline:none">' + // row header container
            '<div wj-part="rhcells" class="wj-rowheaders" style="position:relative"></div>' + // row header cells
          '</div>' +
          '<div wj-part="cf" style=";position:absolute;overflow:hidden;outline:none">' + // col footer container
            '<div wj-part="cfcells" class="wj-colfooters" style="position:relative"></div>' + // col footer cells
          '</div>' +
          '<div wj-part="ch" style="position:absolute;overflow:hidden;outline:none">' + // col header container
            '<div wj-part="chcells" class="wj-colheaders" style="position:relative"></div>' + // col header cells
          '</div>' +
          '<div wj-part="bl" style="position:absolute;overflow:hidden;outline:none">' + // bottom-left container
            '<div wj-part="blcells" class="wj-bottomleft" style="position:relative"></div>' + // top-left cells
          '</div>' +
          '<div wj-part="tl" style="position:absolute;overflow:hidden;outline:none">' + // top-left container
            '<div wj-part="tlcells" class="wj-topleft" style="position:relative"></div>' + // top-left cells
          '</div>' +
          '<div wj-part="sz" style="position:relative;visibility:hidden"></div>' + // auto sizing
        '</div>';

        /**
         * Initializes a new instance of the @see:FlexGrid class.
         *
         * @param element The DOM element that will host the control, or a selector for the host element (e.g. '#theCtrl').
         * @param options JavaScript object containing initialization data for the control.
         */
        constructor(element: any, options?) {
            super(element, null, true);
            var e = this.hostElement;

            // make sure we have no border radius if the browser is IE/Edge
            // (rounded borders **kill** scrolling perf!!!!)
            if (isIE()) {
                e.style.borderRadius = '0px';
            }

            // instantiate and apply template
            var tpl = this.getTemplate();
            this.applyTemplate('wj-control wj-flexgrid wj-content', tpl, {
                _root: 'root',
                _eSz: 'sz',
                _eCt: 'cells',
                _fCt: 'fcells',
                _eTL: 'tl',
                _eBL: 'bl',
                _eCHdr: 'ch',
                _eRHdr: 'rh',
                _eCFtr: 'cf',
                _eTLCt: 'tlcells',
                _eBLCt: 'blcells',
                _eCHdrCt: 'chcells',
                _eCFtrCt: 'cfcells',
                _eRHdrCt: 'rhcells',
                _eMarquee: 'marquee',
                _eFocus: 'focus'
            });

            // calculate default row height
            var defRowHei = this._getDefaultRowHeight();

            // build the control
            this.deferUpdate(() => {

                // create row and column collections
                this._rows = new RowCollection(this, defRowHei);
                this._cols = new ColumnCollection(this, defRowHei * 4);
                this._hdrRows = new RowCollection(this, defRowHei);
                this._hdrCols = new ColumnCollection(this, Math.round(defRowHei * 1.25));
                this._ftrRows = new RowCollection(this, defRowHei);

                // create grid panels
                this._gpTL = new GridPanel(this, CellType.TopLeft, this._hdrRows, this._hdrCols, this._eTLCt);
                this._gpCHdr = new GridPanel(this, CellType.ColumnHeader, this._hdrRows, this._cols, this._eCHdrCt);
                this._gpRHdr = new GridPanel(this, CellType.RowHeader, this._rows, this._hdrCols, this._eRHdrCt);
                this._gpCells = new GridPanel(this, CellType.Cell, this._rows, this._cols, this._eCt);
                this._gpBL = new GridPanel(this, CellType.BottomLeft, this._ftrRows, this._hdrCols, this._eBLCt);
                this._gpCFtr = new GridPanel(this, CellType.ColumnFooter, this._ftrRows, this._cols, this._eCFtrCt);

                // add row and column headers
                this._hdrRows.push(new Row());
                this._hdrCols.push(new Column());
                this._hdrCols[0].align = 'center';

                // initialize control
                this._cf = new CellFactory();
                this._keyHdl = new _KeyboardHandler(this);
                this._mouseHdl = new _MouseHandler(this);
                this._edtHdl = new _EditHandler(this);
                this._selHdl = new _SelectionHandler(this);
                this._addHdl = new _AddNewHandler(this);
                this._mrgMgr = new MergeManager(this);
                this._bndSortConverter = this._sortConverter.bind(this);

                // apply options after grid has been initialized
                this.initialize(options);
            });

            // update content when user scrolls the control
            this.addEventListener(this._root, 'scroll', (e) => {
                if (this._updateScrollPosition()) { // TFS 150650
                    if (this._afScrl) {
                        cancelAnimationFrame(this._afScrl);
                    }
                    this._afScrl = requestAnimationFrame(() => {
                        this.finishEditing();
                        this._updateContent(true);
                        this._afScrl = null;
                    });
                }
            });
        }

        // reset rcBounds when window is resized
        // (even if the control size didn't change, because it may have moved: TFS 112961)
        _handleResize() {
            super._handleResize();
            this._rcBounds = null;
        }

        //--------------------------------------------------------------------------
        //#region ** object model

        /** 
         * Gets or sets a value that determines whether the row and column headers
         * are visible.
         */
        get headersVisibility(): HeadersVisibility {
            return this._hdrVis;
        }
        set headersVisibility(value: HeadersVisibility) {
            if (value != this._hdrVis) {
                this._hdrVis = asEnum(value, HeadersVisibility);
                this.invalidate();
            }
        }
        /**
         * Gets or sets a value that determines whether column headers should remain
         * visible when the user scrolls the document.
         */
        get stickyHeaders(): boolean {
            return this._stickyHdr;
        }
        set stickyHeaders(value: boolean) {
            if (value != this._stickyHdr) {

                // save new setting
                this._stickyHdr = asBoolean(value);
                this._updateStickyHeaders();

                // attach/detach scroll handler to update the sticky headers (with capture)
                this.removeEventListener(window, 'scroll');
                if (this._stickyHdr) {
                    this.addEventListener(window, 'scroll', (e) => {
                        if (contains(e.target, this.hostElement)) {
                            if (this._toSticky) {
                                cancelAnimationFrame(this._toSticky);
                            }
                            this._toSticky = requestAnimationFrame(() => {
                                var e = new CancelEventArgs();
                                if (this.onUpdatingLayout(e)) {
                                    this._updateStickyHeaders();
                                    this.onUpdatedLayout(e);
                                }
                                this._toSticky = null;
                            });
                        }
                    }, true);
                }
            }
        }
        /**
         * Gets or sets a value that determines whether the grid should preserve
         * the selected state of rows when the data is refreshed.
         */
        get preserveSelectedState(): boolean {
            return this._pSel;
        }
        set preserveSelectedState(value: boolean) {
            this._pSel = asBoolean(value);
        }
        /**
         * Gets or sets a value that determines whether the grid should preserve
         * the expanded/collapsed state of nodes when the data is refreshed.
         *
         * The @see:preserveOutlineState property implementation is based on
         * JavaScript's @see:Map object, which is not available in IE 9 or 10.
         */
        get preserveOutlineState(): boolean {
            return this._pOutline;
        }
        set preserveOutlineState(value: boolean) {
            this._pOutline = asBoolean(value);
        }

        /**
         * Gets or sets a value that determines whether the grid should generate columns 
         * automatically based on the @see:itemsSource.
         *
         * The column generation depends on the @see:itemsSource property containing
         * at least one item. This data item is inspected and a column is created and
         * bound to each property that contains a primitive value (number, string,
         * Boolean, or Date).
         *
         * Properties set to null do not generate columns, because the grid would
         * have no way of guessing the appropriate type. In this type of scenario,
         * you should set the @see:autoGenerateColumns property to false and create
         * the columns explicitly. For example:
         *
         * <pre>var grid = new wijmo.grid.FlexGrid('#theGrid', {
         *   autoGenerateColumns: false, // data items may contain null values
         *   columns: [                  // so define columns explicitly
         *     { binding: 'name', header: 'Name', type: 'String' },
         *     { binding: 'amount', header: 'Amount', type: 'Number' },
         *     { binding: 'date', header: 'Date', type: 'Date' },
         *     { binding: 'active', header: 'Active', type: 'Boolean' }
         *   ],
         *   itemsSource: customers
         * });</pre>
         */
        get autoGenerateColumns(): boolean {
            return this._autoGenCols;
        }
        set autoGenerateColumns(value: boolean) {
            this._autoGenCols = asBoolean(value);
        }
        /**
         * Gets or sets a value that determines whether the grid should handle 
         * clipboard shortcuts.
         *
         * The clipboard shortcuts are as follows:
         *
         * <dl class="dl-horizontal">
         *   <dt>ctrl+C, ctrl+Ins</dt>    <dd>Copy grid selection to clipboard.</dd>
         *   <dt>ctrl+V, shift+Ins</dt>   <dd>Paste clipboard text to grid selection.</dd>
         * </dl>
         *
         * Only visible rows and columns are included in clipboard operations.
         *
         * Read-only cells are not affected by paste operations.
         */
        get autoClipboard(): boolean {
            return this._autoClipboard;
        }
        set autoClipboard(value: boolean) {
            this._autoClipboard = asBoolean(value);
        }
        /**
         * Gets or sets a JSON string that defines the current column layout.
         *
         * The column layout string represents an array with the columns and their
         * properties. It can be used to persist column layouts defined by users so 
         * they are preserved across sessions, and can also be used to implement undo/redo
         * functionality in applications that allow users to modify the column layout.
         *
         * The column layout string does not include <b>dataMap</b> properties, because
         * data maps are not serializable.
         */
        get columnLayout(): string {
            var props = FlexGrid._getSerializableProperties(Column),
                defs = new Column(),
                proxyCols = [];

            // populate array with proxy columns
            // save only primitive value and non-default settings
            // don't save 'size', we are already saving 'width'
            for (var i = 0; i < this.columns.length; i++) {
                var col = this.columns[i],
                    proxyCol = {};
                for (var j = 0; j < props.length; j++) {
                    var prop = props[j],
                        value = col[prop];
                    if (value != defs[prop] && isPrimitive(value) && prop != 'size') {
                        proxyCol[prop] = value;
                    }
                }
                proxyCols.push(proxyCol)
            }

            // return JSON string with proxy columns
            return JSON.stringify({ columns: proxyCols });
        }
        set columnLayout(value: string) {
            var colOptions = JSON.parse(asString(value));
            if (!colOptions || colOptions.columns == null) {
                throw 'Invalid columnLayout data.';
            }
            this.columns.clear();
            this.initialize(colOptions);
        }
        /**
         * Gets or sets a value that determines whether the user can modify
         * cell values using the mouse and keyboard.
         */
        get isReadOnly(): boolean {
            return this._readOnly;
        }
        set isReadOnly(value: boolean) {
            if (value != this._readOnly) {
                this._readOnly = asBoolean(value);
                this.finishEditing();
                this.invalidate(true); // TFS 79965
                this._addHdl.updateNewRowTemplate(); // TFS 97544
                toggleClass(this.hostElement, 'wj-state-readonly', this.isReadOnly);
            }
        }
        /**
         * Gets or sets a value that determines whether the grid should support
         * Input Method Editors (IME) while not in edit mode.
         * 
         * This property is relevant only for sites/applications in Japanese,
         * Chinese, Korean, and other languages that require IME support.
         */
        get imeEnabled(): boolean {
            return this._imeHdl != null;
        }
        set imeEnabled(value: boolean) {
            if (value != this.imeEnabled) {
                if (this._imeHdl) {
                    this._imeHdl.dispose();
                    this._imeHdl = null;
                }
                if (value) {
                    this._imeHdl = new _ImeHandler(this);
                }
            }
        }
        /**
         * Gets or sets a value that determines whether users may resize 
         * rows and/or columns with the mouse.
         *
         * If resizing is enabled, users can resize columns by dragging
         * the right edge of column header cells, or rows by dragging the
         * bottom edge of row header cells.
         *
         * Users may also double-click the edge of the header cells to 
         * automatically resize rows and columns to fit their content.
         * The auto-size behavior can be customized using the @see:autoSizeMode
         * property.
         */
        get allowResizing(): AllowResizing {
            return this._alResizing;
        }
        set allowResizing(value: AllowResizing) {
            this._alResizing = asEnum(value, AllowResizing);
        }
        /**
         * Gets or sets a value that determines whether row and column resizing 
         * should be deferred until the user releases the mouse button.
         *
         * By default, @see:deferResizing is set to false, causing rows and columns
         * to be resized as the user drags the mouse. Setting this property to true
         * causes the grid to show a resizing marker and to resize the row or column
         * only when the user releases the mouse button.
         */
        get deferResizing(): boolean {
            return this._deferResizing;
        }
        set deferResizing(value: boolean) {
            this._deferResizing = asBoolean(value);
        }
        /**
         * Gets or sets which cells should be taken into account when auto-sizing a
         * row or column.
         *
         * This property controls what happens when users double-click the edge of
         * a column header.
         *
         * By default, the grid will automatically set the column width based on the
         * content of the header and data cells in the column. This property allows 
         * you to change that to include only the headers or only the data.
         */
        get autoSizeMode(): AutoSizeMode {
            return this._autoSizeMode;
        }
        set autoSizeMode(value: AutoSizeMode) {
            this._autoSizeMode = asEnum(value, AutoSizeMode);
        }
        /**
         * Gets or sets a value that determines whether users are allowed to sort columns 
         * by clicking the column header cells.
         */
        get allowSorting(): boolean {
            return this._alSorting;
        }
        set allowSorting(value: boolean) {
            this._alSorting = asBoolean(value);
        }
        /**
         * Gets or sets a value that indicates whether the grid should provide a new row
         * template so users can add items to the source collection.
         *
         * The new row template will not be displayed if the @see:isReadOnly property
         * is set to true.
         */
        get allowAddNew(): boolean {
            return this._alAddNew;
        }
        set allowAddNew(value: boolean) {
            if (value != this._alAddNew) {
                this._alAddNew = asBoolean(value);
                this._addHdl.updateNewRowTemplate();
            }
        }
        /**
         * Gets or sets a value that indicates whether the new row template should be located
         * at the top of the grid or at the bottom.
         *
         * The new row template will be displayed only if the @see:allowAddNew property is set
         * to true and if the @see:itemsSource object supports adding new items.
         */
        get newRowAtTop(): boolean {
            return this._addHdl.newRowAtTop;
        }
        set newRowAtTop(value: boolean) {
            this._addHdl.newRowAtTop = asBoolean(value);
        }
        /**
         * Gets or sets a value that indicates whether the grid should delete 
         * selected rows when the user presses the Delete key.
         *
         * Selected rows will not be deleted if the @see:isReadOnly property
         * is set to true.
         */
        get allowDelete(): boolean {
            return this._alDelete;
        }
        set allowDelete(value: boolean) {
            if (value != this._alDelete) {
                this._alDelete = asBoolean(value);
            }
        }
        /**
         * Gets or sets which parts of the grid provide cell merging.
         */
        get allowMerging(): AllowMerging {
            return this._alMerging;
        }
        set allowMerging(value: AllowMerging) {
            if (value != this._alMerging) {
                this._alMerging = asEnum(value, AllowMerging);
                this.invalidate();
            }
        }
        /**
         * Gets or sets a value that indicates whether the grid should
         * add class names to indicate selected header cells.
         */
        get showSelectedHeaders(): HeadersVisibility {
            return this._ssHdr;
        }
        set showSelectedHeaders(value: HeadersVisibility) {
            if (value != this._ssHdr) {
                this._ssHdr = asEnum(value, HeadersVisibility);
                this.invalidate();
            }
        }
        /**
         * Gets or sets a value that indicates whether the grid should
         * display a marquee element around the current selection.
         */
        get showMarquee(): boolean {
            return !this._eMarquee.style.display;
        }
        set showMarquee(value: boolean) {
            if (value != this.showMarquee) {
                var s = this._eMarquee.style;
                s.visibility = 'collapse'; // show only after positioning
                s.display = asBoolean(value) ? '' : 'none';
                this.invalidate();
            }
        }
        /**
         * Gets or sets a value that determines whether the grid should display 
         * sort indicators in the column headers.
         *
         * Sorting is controlled by the @see:ICollectionView.sortDescriptions
         * property of the @see:ICollectionView object used as a the grid's
         * @see:itemsSource.
         */
        get showSort(): boolean {
            return this._shSort;
        }
        set showSort(value: boolean) {
            if (value != this._shSort) {
                this._shSort = asBoolean(value);
                this.invalidate();
            }
        }
        /**
         * Gets or sets a value that determines whether the grid should insert group 
         * rows to delimit data groups.
         *
         * Data groups are created by modifying the @see:ICollectionView.groupDescriptions
         * property of the @see:ICollectionView object used as a the grid's @see:itemsSource.
         */
        get showGroups(): boolean {
            return this._shGroups;
        }
        set showGroups(value: boolean) {
            if (value != this._shGroups) {
                this._shGroups = asBoolean(value);
                this._bindGrid(false);
            }
        }
        /**
         * Gets or sets a value that determines whether the grid should add the 'wj-alt' 
         * class to cells in alternating rows.
         * 
         * Setting this property to false disables alternate row styles without any
         * changes to the CSS.
         */
        get showAlternatingRows(): boolean {
            return this._shAlt;
        }
        set showAlternatingRows(value: boolean) {
            if (value != this._shAlt) {
                this._shAlt = asBoolean(value);
                this.invalidate();
            }
        }
        /**
         * Gets or sets a value that determines whether the grid should add the 'wj-state-invalid'
         * class to cells that contain validation errors, and tooltips with error descriptions.
         *
         * The grid detects validation errors using the @see:CollectionView.getError property
         * on the grid's @see:itemsSource.
         */
        get showErrors(): boolean {
            return this._shErr;
        }
        set showErrors(value: boolean) {
            if (value != this._shErr) {
                this._shErr = asBoolean(value);
                this.invalidate();
            }
        }
        /**
         * Gets or sets a value that determines whether the grid should remain
         * in edit mode when the user tries to commit edits that fail validation.
         *
         * The grid detects validation errors by calling the @see:CollectionView.getError
         * method on the grid's @see:itemsSource.
         */
        get validateEdits(): boolean {
            return this._valEdt;
        }
        set validateEdits(value: boolean) {
            this._valEdt = asBoolean(value);
        }
        /**
         * Gets or sets the format string used to create the group header content.
         *
         * The string may contain any text, plus the following replacement strings:
         * <ul>
         *   <li><b>{name}</b>: The name of the property being grouped on.</li>
         *   <li><b>{value}</b>: The value of the property being grouped on.</li>
         *   <li><b>{level}</b>: The group level.</li>
         *   <li><b>{count}</b>: The total number of items in this group.</li>
         * </ul>
         *
         * If a column is bound to the grouping property, the column header is used 
         * to replace the <code>{name}</code> parameter, and the column's format and
         * data maps are used to calculate the <code>{value}</code> parameter.
         * If no column is available, the group information is used instead.
         *
         * You may add invisible columns bound to the group properties in order to 
         * customize the formatting of the group header cells.
         *
         * The default value for this property is<br/>
         * <code>'{name}: &lt;b&gt;{value}&lt;/b&gt;({count:n0} items)'</code>,
         * which creates group headers similar to<br/>
         * <code>'Country: <b>UK</b> (12 items)'</code> or<br/>
         * <code>'Country: <b>Japan</b> (8 items)'</code>.
         */
        get groupHeaderFormat(): string {
            return this._gHdrFmt;
        }
        set groupHeaderFormat(value: string) {
            if (value != this._gHdrFmt) {
                this._gHdrFmt = asString(value)
                this._bindGrid(false);
            }
        }
        /**
         * Gets or sets a value that determines whether users are allowed to drag 
         * rows and/or columns with the mouse.
         */
        get allowDragging(): AllowDragging {
            return this._alDragging;
        }
        set allowDragging(value: AllowDragging) {
            if (value != this._alDragging) {
                this._alDragging = asEnum(value, AllowDragging);
                this.invalidate(); // to re-create row/col headers
            }
        }
        /**
         * Gets or sets the array or @see:ICollectionView that contains items shown on the grid.
         */
        get itemsSource(): any {
            return this._items;
        }
        set itemsSource(value: any) {
            if (value != this._items) {

                // unbind current collection view
                if (this._cv) {
                    var cv = tryCast(this._cv, collections.CollectionView);
                    if (cv && cv.sortConverter == this._bndSortConverter) {
                        cv.sortConverter = null;
                    }
                    this._cv.currentChanged.removeHandler(this._cvCurrentChanged, this);
                    this._cv.collectionChanged.removeHandler(this._cvCollectionChanged, this);
                    this._cv = null;
                }

                // save new data source and collection view
                this._items = value;
                this._cv = this._getCollectionView(value);
                this._lastCount = 0;

                // bind new collection view
                if (this._cv) {
                    this._cv.currentChanged.addHandler(this._cvCurrentChanged, this);
                    this._cv.collectionChanged.addHandler(this._cvCollectionChanged, this);
                    var cv = tryCast(this._cv, collections.CollectionView);
                    if (cv && !cv.sortConverter) {
                        cv.sortConverter = this._bndSortConverter;
                    }
                }

                // bind grid
                this._bindGrid(true);

                // raise itemsSourceChanged
                this.onItemsSourceChanged();
            }
        }
        /**
         * Gets the @see:ICollectionView that contains the grid data.
         */
        get collectionView(): collections.ICollectionView {
            return this._cv;
        }
        /**
         * Gets or sets the name of the property (or properties) used to generate 
         * child rows in hierarchical grids.
         *
         * Set this property to a string to specify the name of the property that
         * contains an item's child items (e.g. <code>'items'</code>). 
         * 
         * If items at different levels child items with different names, then 
         * set this property to an array containing the names of the properties 
         * that contain child items et each level 
         * (e.g. <code>[ 'accounts', 'checks', 'earnings' ]</code>).
         * 
         * @fiddle:t0ncmjwp
         */
        get childItemsPath(): any {
            return this._childItemsPath;
        }
        set childItemsPath(value: any) {
            if (value != this._childItemsPath) {
                assert(value == null || isArray(value) || isString(value), 'childItemsPath should be an array or a string.');
                this._childItemsPath = value;
                this._bindGrid(true);
            }
        }
        /**
         * Gets the @see:GridPanel that contains the data cells.
         */
        get cells(): GridPanel {
            return this._gpCells;
        }
        /**
         * Gets the @see:GridPanel that contains the column header cells.
         */
        get columnHeaders(): GridPanel {
            return this._gpCHdr;
        }
        /**
         * Gets the @see:GridPanel that contains the column footer cells.
         *
         * The @see:columnFooters panel appears below the grid cells, to the
         * right of the @see:bottomLeftCells panel. It can be used to display
         * summary information below the grid data.
         *
         * The example below shows how you can add a row to the @see:columnFooters
         * panel to display summary data for columns that have the
         * @see:Column.aggregate property set:
         *
         * <pre>function addFooterRow(flex) {
         *   // create a GroupRow to show aggregates
         *   var row = new wijmo.grid.GroupRow();
         *
         *   // add the row to the column footer panel
         *   flex.columnFooters.rows.push(row);
         *
         *   // show a sigma on the header
         *   flex.bottomLeftCells.setCellData(0, 0, '\u03A3');
         * }</pre>
         */
        get columnFooters(): GridPanel {
            return this._gpCFtr;
        }
        /**
         * Gets the @see:GridPanel that contains the row header cells.
         */
        get rowHeaders(): GridPanel {
            return this._gpRHdr;
        }
        /**
         * Gets the @see:GridPanel that contains the top left cells
         * (to the left of the column headers).
         */
        get topLeftCells(): GridPanel {
            return this._gpTL;
        }
        /**
         * Gets the @see:GridPanel that contains the bottom left cells.
         *
         * The @see:bottomLeftCells panel appears below the row headers, to the
         * left of the @see:columnFooters panel.
         */
        get bottomLeftCells(): GridPanel {
            return this._gpBL;
        }
        /**
         * Gets the grid's row collection.
         */
        get rows(): RowCollection {
            return this._rows;
        }
        /**
         * Gets the grid's column collection.
         */
        get columns(): ColumnCollection {
            return this._cols;
        }
        /**
         * Gets a column by name or by binding.
         *
         * The method searches the column by name. If a column with the given name 
         * is not found, it searches by binding. The searches are case-sensitive.
         *
         * @param name The name or binding to find.
         * @return The column with the specified name or binding, or null if not found.
         */
        getColumn(name: string): Column {
            return this.columns.getColumn(name);
        }
        /**
         * Gets or sets the number of frozen rows.
         *
         * Frozen rows do not scroll, but the cells they contain 
         * may be selected and edited.
         */
        get frozenRows(): number {
            return this.rows.frozen;
        }
        set frozenRows(value: number) {
            this.rows.frozen = value;
        }
        /**
         * Gets or sets the number of frozen columns.
         *
         * Frozen columns do not scroll, but the cells they contain 
         * may be selected and edited.
         */
        get frozenColumns(): number {
            return this.columns.frozen;
        }
        set frozenColumns(value: number) {
            this.columns.frozen = value;
        }
        /**
         * Gets or sets the index of row in the column header panel that
         * shows and changes the current sort.
         *
         * This property is set to null by default, causing the last row
         * in the @see:columnHeaders panel to act as the sort row.
         */
        get sortRowIndex(): number {
            return this._sortRowIndex;
        }
        set sortRowIndex(value: number) {
            if (value != this._sortRowIndex) {
                this._sortRowIndex = asNumber(value, true);
                this.invalidate();
            }
        }
        /**
         * Gets or sets a @see:Point that represents the value of the grid's scrollbars.
         */
        get scrollPosition(): Point {
            return this._ptScrl.clone();
        }
        set scrollPosition(pt: Point) {
            var root = this._root,
                left = -pt.x;

            // IE/Chrome/FF handle scrollLeft differently under RTL:
            // Chrome reverses direction, FF uses negative values, IE does the right thing (nothing)
            if (this._rtl) {
                switch (FlexGrid._getRtlMode()) {
                    case 'rev':
                        left = (root.scrollWidth - root.clientWidth) + pt.x;
                        break;
                    case 'neg':
                        left = pt.x;
                        break;
                    default:
                        left = -pt.x;
                        break;
                }
            }
            root.scrollLeft = left;
            root.scrollTop = -pt.y;
        }
        /**
         * Gets the client size of the control (control size minus headers and scrollbars).
         */
        get clientSize(): Size {
            return this._szClient;
        }
        /**
         * Gets the bounding rectangle of the control in page coordinates.
         */
        get controlRect(): Rect {
            if (!this._rcBounds) {
                this._rcBounds = getElementRect(this._root);
            }
            return this._rcBounds;
        }
        /**
         * Gets the size of the grid content in pixels.
         */
        get scrollSize(): Size {
            return new Size(this._gpCells.width, this._heightBrowser);
        }
        /**
         * Gets the range of cells currently in view.
         */
        get viewRange(): CellRange {
            return this._gpCells.viewRange;
        }
        /**
         * Gets or sets the @see:CellFactory that creates and updates cells for this grid.
         */
        get cellFactory(): CellFactory {
            return this._cf;
        }
        set cellFactory(value: CellFactory) {
            if (value != this._cf) {
                this._cf = asType(value, CellFactory, false);
                this.invalidate();
            }
        }

        /**
         * Gets or sets a formatter function used to customize cells on this grid.
         *
         * The formatter function can add any content to any cell. It provides 
         * complete flexibility over the appearance and behavior of grid cells.
         *
         * If specified, the function should take four parameters: the @see:GridPanel
         * that contains the cell, the row and column indices of the cell, and the
         * HTML element that represents the cell. The function will typically change
         * the <b>innerHTML</b> property of the cell element.
         *
         * For example:
         * <pre>
         * flex.itemFormatter = function(panel, r, c, cell) {
         *   if (panel.cellType == CellType.Cell) {
         *     // draw sparklines in the cell
         *     var col = panel.columns[c];
         *     if (col.name == 'sparklines') {
         *       cell.innerHTML = getSparklike(panel, r, c);
         *     }
         *   }
         * }
         * </pre>
         *
         * Note that the FlexGrid recycles cells, so if your @see:itemFormatter 
         * modifies the cell's style attributes, you must make sure that it resets 
         * these attributes for cells that should not have them. For example:
         *
         * <pre>
         * flex.itemFormatter = function(panel, r, c, cell) {
         *   // reset attributes we are about to customize
         *   var s = cell.style;
         *   s.color = '';
         *   s.backgroundColor = '';
         *   // customize color and backgroundColor attributes for this cell
         *   ...
         * }
         * </pre>
         *
         * If you have a scenario where multiple clients may want to customize the
         * grid rendering (for example when creating directives or re-usable libraries),
         * consider using the @see:formatItem event instead. The event allows multiple
         * clients to attach their own handlers.
         */
        get itemFormatter(): Function {
            return this._itemFormatter;
        }
        set itemFormatter(value: Function) {
            if (value != this._itemFormatter) {
                this._itemFormatter = asFunction(value);
                this.invalidate();
            }
        }
        /**
         * Gets the value stored in a cell in the scrollable area of the grid.
         *
         * @param r Index of the row that contains the cell.
         * @param c Index of the column that contains the cell.
         * @param formatted Whether to format the value for display.
         */
        getCellData(r: number, c: number, formatted: boolean): any {
            return this.cells.getCellData(r, c, formatted);
        }
        /**
         * Gets a the bounds of a cell element in viewport coordinates.
         *
         * This method returns the bounds of cells in the @see:cells 
         * panel (scrollable data cells). To get the bounds of cells
         * in other panels, use the @see:getCellBoundingRect method
         * in the appropriate @see:GridPanel object.
         *
         * The returned value is a @see:Rect object which contains the
         * position and dimensions of the cell in viewport coordinates.
         * The viewport coordinates are the same used by the 
         * <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element.getBoundingClientRect">getBoundingClientRect</a>
         * method.
         *
         * @param r Index of the row that contains the cell.
         * @param c Index of the column that contains the cell.
         * @param raw Whether to return the rectangle in raw panel coordinates as opposed to viewport coordinates.
         */
        getCellBoundingRect(r: number, c: number, raw?: boolean): Rect {
            return this.cells.getCellBoundingRect(r, c, raw);
        }
        /**
         * Sets the value of a cell in the scrollable area of the grid.
         *
         * @param r Index of the row that contains the cell.
         * @param c Index, name, or binding of the column that contains the cell.
         * @param value Value to store in the cell.
         * @param coerce Whether to change the value automatically to match the column's data type.
         * @param invalidate Whether to invalidate the grid to show the change.
         * @return True if the value was stored successfully, false otherwise.
         */
        setCellData(r: number, c: any, value: any, coerce = true, invalidate = true): boolean {
            return this.cells.setCellData(r, c, value, coerce, invalidate);
        }
        /**
         * Gets a @see:HitTestInfo object with information about a given point.
         *
         * For example:
         *
         * <pre>// hit test a point when the user clicks on the grid
         * flex.hostElement.addEventListener('click', function (e) {
         *   var ht = flex.hitTest(e.pageX, e.pageY);
         *   console.log('you clicked a cell of type "' +
         *     wijmo.grid.CellType[ht.cellType] + '".');
         * });</pre>
         *
         * @param pt @see:Point to investigate, in page coordinates, or a MouseEvent object, or x coordinate of the point.
         * @param y Y coordinate of the point in page coordinates (if the first parameter is a number).
         * @return A @see:HitTestInfo object with information about the point.
         */
        hitTest(pt: any, y?: number): HitTestInfo {
            if (isNumber(pt) && isNumber(y)) { // accept hitTest(x, y) as well
                pt = new Point(pt, y);
            }
            return new HitTestInfo(this, pt);
        }
        /**
         * Gets the content of a @see:CellRange as a string suitable for 
         * copying to the clipboard.
         *
         * Hidden rows and columns are not included in the clip string.
         *
         * @param rng @see:CellRange to copy. If omitted, the current selection is used.
         */
        getClipString(rng?: CellRange): string {
            var clipString = '',
                firstRow = true,
                firstCell = true;

            // get the source range (taking selection mode into account)
            if (!rng) {
                rng = this.selection;
                switch (this.selectionMode) {

                    // row modes: expand range to cover all columns
                    case SelectionMode.Row:
                    case SelectionMode.RowRange:
                        rng.col = 0;
                        rng.col2 = this.columns.length - 1;
                        break;

                    // listbox mode: scan rows and copy selected ones
                    case SelectionMode.ListBox:
                        rng.col = 0;
                        rng.col2 = this.columns.length - 1;
                        for (var i = 0; i < this.rows.length; i++) {
                            if (this.rows[i].isSelected && this.rows[i].isVisible) {
                                rng.row = rng.row2 = i;
                                if (clipString) clipString += '\n';
                                clipString += this.getClipString(rng);
                            }
                        }
                        return clipString;
                }
            }

            // scan rows
            rng = asType(rng, CellRange);
            for (var r = rng.topRow; r <= rng.bottomRow; r++) {

                // skip invisible, add separator
                if (!this.rows[r].isVisible) continue;
                if (!firstRow) clipString += '\n';
                firstRow = false;

                // scan cells
                for (var c = rng.leftCol, firstCell = true; c <= rng.rightCol; c++) {

                    // skip invisible, add separator
                    if (!this.columns[c].isVisible) continue;
                    if (!firstCell) clipString += '\t';
                    firstCell = false;

                    // append cell
                    var cell = this.cells.getCellData(r, c, true).toString();
                    cell = cell.replace(/\t/g, ' ');
                    clipString += cell;
                }
            }

            // done
            return clipString;
        }
        /**
         * Parses a string into rows and columns and applies the content to a given range.
         *
         * Hidden rows and columns are skipped.
         *
         * @param text Tab and newline delimited text to parse into the grid.
         * @param rng @see:CellRange to copy. If omitted, the current selection is used.
         */
        setClipString(text: string, rng?: CellRange) {

            // get the target range (taking selection mode into account)
            var autoRange = rng == null;
            if (!rng) {
                rng = this.selection;
                switch (this.selectionMode) {
                    case SelectionMode.Row:
                    case SelectionMode.RowRange:
                    case SelectionMode.ListBox:
                        rng.col = 0;
                        rng.col2 = this.columns.length - 1;
                        break;
                }
            }
            rng = asType(rng, CellRange);

            // normalize text
            text = asString(text).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            if (text && text[text.length - 1] == '\n') {
                text = text.substring(0, text.length - 1);
            }
            if (autoRange && !rng.isSingleCell) {
                text = this._expandClipString(text, rng);
            }

            // keep track of paste range to select later
            var rngPaste = new CellRange(rng.topRow, rng.leftCol);

            // copy lines to rows
            this.beginUpdate();
            var row = rng.topRow,
                lines = text.split('\n'),
                pasted = false,
                e: CellRangeEventArgs;
            for (var i = 0; i < lines.length && row < this.rows.length; i++ , row++) {

                // skip invisible row, keep clip line
                if (!this.rows[row].isVisible) {
                    i--;
                    continue;
                }

                // copy cells to columns
                var cells = lines[i].split('\t'),
                    col = rng.leftCol;
                for (var j = 0; j < cells.length && col < this.columns.length; j++ , col++) {

                    // skip invisible column, keep clip cell
                    if (!this.columns[col].isVisible) {
                        j--;
                        continue;
                    }

                    // assign cell
                    if (!this.columns[col].isReadOnly && !this.rows[row].isReadOnly) {

                        // raise events so user can cancel the paste
                        e = new CellRangeEventArgs(this.cells, new CellRange(row, col), cells[j]);
                        if (this.onPastingCell(e)) {
                            if (this.cells.setCellData(row, col, e.data)) {
                                this.onPastedCell(e);
                                pasted = true;
                            }
                        }

                        // update paste range
                        rngPaste.row2 = Math.max(rngPaste.row2, row);
                        rngPaste.col2 = Math.max(rngPaste.col2, col);
                    }
                }
            }
            this.endUpdate();

            // handle editing
            if (pasted) {
                var ecv = tryCast(this.collectionView, 'IEditableCollectionView');
                if (ecv && ecv.currentItem == ecv.currentAddItem) {
                    ecv.editItem(ecv.currentItem); // editing a new item, get into edit mode
                } else if (this.collectionView) {
                    this.collectionView.refresh(); // update sorting/filtering 
                }
            }

            // select pasted range
            this.select(rngPaste);
        }

        // expand clip string to get Excel-like behavior
        _expandClipString(text: string, rng: CellRange): string {

            // sanity
            if (!text) return text;

            // get clip string dimensions and cells
            var lines = text.split('\n'),
                srcRows = lines.length,
                srcCols = 0,
                rows = [];
            for (var r = 0; r < srcRows; r++) {
                var cells = lines[r].split('\t');
                rows.push(cells);
                if (r > 1 && cells.length != srcCols) return text;
                srcCols = cells.length;
            }

            // expand if destination size is a multiple of source size (like Excel)
            var dstRows = rng.rowSpan,
                dstCols = rng.columnSpan;
            if (dstRows > 1 || dstCols > 1) {
                if (dstRows == 1) dstRows = srcRows;
                if (dstCols == 1) dstCols = srcCols;
                if (dstCols % srcCols == 0 && dstRows % srcRows == 0) {
                    text = '';
                    for (var r = 0; r < dstRows; r++) {
                        for (var c = 0; c < dstCols; c++) {
                            if (r > 0 && c == 0) text += '\n';
                            if (c > 0) text += '\t';
                            text += rows[r % srcRows][c % srcCols];
                        }
                    }
                }
            }

            // done
            return text;
        }
        /** 
         * Overridden to set the focus to the grid without scrolling the whole grid into view.
         */
        focus() {

            // if we have an active editor, let it keep the focus
            if (this.activeEditor) {
                this.activeEditor.focus();
                return;
            }

            // save work if possible
            if (wijmo.getActiveElement() == this._eFocus) {
                return;
            }

            // if the grid is visible, use inner element '_efocus'
            var rc = this.hostElement.getBoundingClientRect();
            if (rc.bottom > 0 && rc.right > 0 && rc.top < innerHeight && rc.left < innerWidth) {
                setCss(this._eFocus, {
                    top: Math.max(0, -rc.top),
                    left: Math.max(0, -rc.left)
                });
                this._eFocus.focus();
                return;
            }

            // if the grid is off the screen, try focusing on the selected cell
            var cell = <HTMLElement>this.cells.hostElement.querySelector('.wj-cell.wj-state-selected');
            if (cell) {
                cell.focus();
                return;
            }

            // off-screen, no current cell, focus on the grid's host element (will scroll it into view)
            super.focus();
        }
        /**
         * Checks whether this control contains the focused element.
         */
        containsFocus(): boolean {
            var lbx = this._edtHdl ? this._edtHdl._lbx : null;
            return super.containsFocus() || (lbx && lbx.containsFocus());
        }
        /**
         * Disposes of the control by removing its association with the host element.
         */
        dispose() {

            // cancel any pending edits, close drop-down list
            this.finishEditing(true);

            // remove itemsSource so it doesn't have references to our
            // change event handlers that would prevent the grid from being
            // garbage-collected.
            this.itemsSource = null;

            // remove any pending animation frame requests
            if (this._afScrl) {
                cancelAnimationFrame(this._afScrl);
            }

            // allow base class
            super.dispose();
        }
        /**
         * Refreshes the grid display.
         *
         * @param fullUpdate Whether to update the grid layout and content, or just the content.
         */
        refresh(fullUpdate = true) {

            // always call base class to handle being/endUpdate logic
            super.refresh(fullUpdate);

            // close any open drop-downs
            this.finishEditing();

            // on full updates, get missing column types based on bindings and
            // update scroll position in case the control just became visible
            // and IE wrongly reset the element's scroll position to the origin
            // http://wijmo.com/topic/flexgrid-refresh-issue-when-hidden/
            if (fullUpdate) {
                this._updateColumnTypes();
                this.scrollPosition = this._ptScrl; // update element to match grid
                //this._updateScrollPosition(); // update grid to match element
            }

            // go refresh the cells
            this.refreshCells(fullUpdate);
        }
        /**
         * Refreshes the grid display.
         *
         * @param fullUpdate Whether to update the grid layout and content, or just the content.
         * @param recycle Whether to recycle existing elements.
         * @param state Whether to keep existing elements and update their state.
         */
        refreshCells(fullUpdate: boolean, recycle?: boolean, state?: boolean) {
            if (!this.isUpdating) {
                if (fullUpdate) {
                    this._updateLayout();
                } else {
                    this._updateContent(recycle, state);
                }
            }
        }
        /**
         * Resizes a column to fit its content.
         *
         * @param c Index of the column to resize.
         * @param header Whether the column index refers to a regular or a header row.
         * @param extra Extra spacing, in pixels.
         */
        autoSizeColumn(c: number, header = false, extra = 4) {
            this.autoSizeColumns(c, c, header, extra);
        }
        /**
         * Resizes a range of columns to fit their content.
         *
         * The grid will always measure all rows in the current view range, plus up to 2,000 rows
         * not currently in view. If the grid contains a large amount of data (say 50,000 rows), 
         * then not all rows will be measured since that could potentially take a long time.
         *
         * @param firstColumn Index of the first column to resize (defaults to the first column).
         * @param lastColumn Index of the last column to resize (defaults to the last column).
         * @param header Whether the column indices refer to regular or header columns.
         * @param extra Extra spacing, in pixels.
         */
        autoSizeColumns(firstColumn?: number, lastColumn?: number, header = false, extra = 4) {
            var max = 0,
                pHdr = header ? this.topLeftCells : this.columnHeaders,
                pCells = header ? this.rowHeaders : this.cells,
                rowRange = this.viewRange,
                text: string, lastText: string;
            firstColumn = firstColumn == null ? 0 : asInt(firstColumn);
            lastColumn = lastColumn == null ? pCells.columns.length - 1 : asInt(lastColumn);
            asBoolean(header);
            asNumber(extra);

            // choose row range to measure
            // (viewrange by default, everything if we have only a few items)
            rowRange.row = Math.max(0, rowRange.row - 1000);
            rowRange.row2 = Math.min(rowRange.row2 + 1000, this.rows.length - 1);

            this.deferUpdate(() => {

                // create element to measure content
                var eMeasure = document.createElement('div');
                eMeasure.setAttribute(FlexGrid._WJS_MEASURE, 'true');
                eMeasure.style.visibility = 'hidden';
                this.hostElement.appendChild(eMeasure);

                // measure cells in the range
                for (var c = firstColumn; c <= lastColumn && c > -1 && c < pCells.columns.length; c++) {
                    max = 0;

                    // headers
                    if (this.autoSizeMode & AutoSizeMode.Headers) {
                        for (var r = 0; r < pHdr.rows.length; r++) {
                            if (pHdr.rows[r].isVisible) {
                                var w = this._getDesiredWidth(pHdr, r, c, eMeasure);
                                max = Math.max(max, w);
                            }
                        }
                    }

                    // cells
                    if (this.autoSizeMode & AutoSizeMode.Cells) {
                        lastText = null;
                        for (var r = rowRange.row; r <= rowRange.row2 && r > -1 && r < pCells.rows.length; r++) {
                            if (pCells.rows[r].isVisible) {

                                if (!header && c == pCells.columns.firstVisibleIndex && pCells.rows.maxGroupLevel > -1) {

                                    // ignore last text for outline cells
                                    var w = this._getDesiredWidth(pCells, r, c, eMeasure);
                                    max = Math.max(max, w);

                                } else {

                                    // regular cells
                                    text = pCells.getCellData(r, c, true);
                                    if (text != lastText) {
                                        lastText = text;
                                        var w = this._getDesiredWidth(pCells, r, c, eMeasure);
                                        max = Math.max(max, w);
                                    }
                                }
                            }
                        }
                    }

                    // set size
                    pCells.columns[c].width = max + extra + 2;
                }

                // done with measuring element
                this.hostElement.removeChild(eMeasure);
            });
        }
        /**
         * Resizes a row to fit its content.
         *
         * @param r Index of the row to resize.
         * @param header Whether the row index refers to a regular or a header row.
         * @param extra Extra spacing, in pixels.
         */
        autoSizeRow(r: number, header = false, extra = 0) {
            this.autoSizeRows(r, r, header, extra);
        }
        /**
         * Resizes a range of rows to fit their content.
         *
         * @param firstRow Index of the first row to resize.
         * @param lastRow Index of the last row to resize.
         * @param header Whether the row indices refer to regular or header rows.
         * @param extra Extra spacing, in pixels.
         */
        autoSizeRows(firstRow?: number, lastRow?: number, header = false, extra = 0) {
            var max = 0,
                pHdr = header ? this.topLeftCells : this.rowHeaders,
                pCells = header ? this.columnHeaders : this.cells;
            header = asBoolean(header);
            extra = asNumber(extra);
            firstRow = firstRow == null ? 0 : asInt(firstRow);
            lastRow = lastRow == null ? pCells.rows.length - 1 : asInt(lastRow);

            this.deferUpdate(() => {

                // create element to measure content
                var eMeasure = document.createElement('div');
                eMeasure.setAttribute(FlexGrid._WJS_MEASURE, 'true');
                eMeasure.style.visibility = 'hidden';
                this.hostElement.appendChild(eMeasure);

                // measure cells in the range
                for (var r = firstRow; r <= lastRow && r > -1 && r < pCells.rows.length; r++) {
                    max = 0;

                    // headers
                    if (this.autoSizeMode & AutoSizeMode.Headers) {
                        for (var c = 0; c < pHdr.columns.length; c++) {
                            if (pHdr.columns[c].renderSize > 0) {
                                var h = this._getDesiredHeight(pHdr, r, c, eMeasure);
                                max = Math.max(max, h);
                            }
                        }
                    }

                    // cells
                    if (this.autoSizeMode & AutoSizeMode.Cells) {
                        for (var c = 0; c < pCells.columns.length; c++) {
                            if (pCells.columns[c].renderSize > 0) {
                                var h = this._getDesiredHeight(pCells, r, c, eMeasure);
                                max = Math.max(max, h);
                            }
                        }
                    }

                    // update size
                    pCells.rows[r].height = max + extra;
                }

                // done with measuring element
                this.hostElement.removeChild(eMeasure);
            });
        }
        /**
         * Gets or sets the indent used to offset row groups of different levels.
         */
        get treeIndent(): number {
            return this._indent;
        }
        set treeIndent(value: number) {
            if (value != this._indent) {
                this._indent = asNumber(value, false, true);
                this.columns.onCollectionChanged();
            }
        }
        /**
         * Collapses all the group rows to a given level.
         *
         * @param level Maximum group level to show.
         */
        collapseGroupsToLevel(level: number) {

            // finish editing first (this may change the collection)
            if (this.finishEditing()) {

                // set collapsed state for all rows in the grid
                var rows = this.rows;
                rows.deferUpdate(() => {
                    for (var r = 0; r < rows.length; r++) {
                        var gr = tryCast(rows[r], GroupRow);
                        if (gr) {
                            gr.isCollapsed = gr.level >= level;
                        }
                    }
                });
            }
        }
        /**
         * Gets or sets the current selection mode.
         */
        get selectionMode(): SelectionMode {
            return this._selHdl.selectionMode;
        }
        set selectionMode(value: SelectionMode) {
            if (value != this.selectionMode) {
                this._selHdl.selectionMode = asEnum(value, SelectionMode);
                this.invalidate();
            }
        }
        /**
         * Gets or sets the current selection.
         */
        get selection(): CellRange {
            return this._selHdl.selection.clone();
        }
        set selection(value: CellRange) {
            this._selHdl.selection = value;
        }
        /**
         * Selects a cell range and optionally scrolls it into view.
         *
         * @param rng Range to select.
         * @param show Whether to scroll the new selection into view.
         */
        select(rng: any, show: any = true) {
            this._selHdl.select(rng, show);
        }
        /**
         * Gets a @see:SelectedState value that indicates the selected state of a cell.
         *
         * @param r Row index of the cell to inspect.
         * @param c Column index of the cell to inspect.
         */
        getSelectedState(r: number, c: number): SelectedState {
            return this.cells.getSelectedState(r, c, null);
        }
        /**
         * Gets or sets an array containing the rows that are currently selected.
         *
         * Note: this property can be read in all selection modes, but it can be
         * set only when @see:selectionMode is set to <b>SelectionMode.ListBox</b>.
         */
        get selectedRows(): any[] {
            var rows = [];
            if (this.selectionMode == SelectionMode.ListBox) {
                for (var i = 0; i < this.rows.length; i++) {
                    if (this.rows[i].isSelected) {
                        rows.push(this.rows[i]);
                    }
                }
            } else if (this.rows.length) {
                var sel = this.selection;
                for (var i = sel.topRow; i > -1 && i <= sel.bottomRow; i++) {
                    rows.push(this.rows[i]);
                }
            }
            return rows;
        }
        set selectedRows(value: any[]) {
            assert(this.selectionMode == SelectionMode.ListBox, 'This property can be set only in ListBox mode.');
            value = asArray(value);
            this.deferUpdate(() => {
                for (var i = 0, first = true; i < this.rows.length; i++) {
                    var row = <Row>this.rows[i],
                        sel = value && value.indexOf(row) > -1;
                    if (sel && first) {
                        first = false;
                        this.select(i, this.selection.col);
                    }
                    row.isSelected = sel;
                }
            });
        }
        /**
         * Gets or sets an array containing the data items that are currently selected.
         *
         * Note: this property can be read in all selection modes, but it can be
         * set only when @see:selectionMode is set to <b>SelectionMode.ListBox</b>.
         */
        get selectedItems(): any[] {
            var items = this.selectedRows;
            for (var i = 0; i < items.length; i++) {
                items[i] = (<Row>items[i]).dataItem;
            }
            return items;
        }
        set selectedItems(value: any[]) {
            assert(this.selectionMode == SelectionMode.ListBox, 'This property can be set only in ListBox mode.');
            value = asArray(value);
            this.deferUpdate(() => {
                for (var i = 0, first = true; i < this.rows.length; i++) {
                    var row = <Row>this.rows[i],
                        sel = value && value.indexOf(row.dataItem) > -1;
                    if (sel && first) {
                        first = false;
                        this.select(i, this.selection.col);
                    }
                    row.isSelected = sel;
                }
            });
        }
        /**
         * Scrolls the grid to bring a specific cell into view.
         *
         * @param r Index of the row to scroll into view.
         * @param c Index of the column to scroll into view.
         * @return True if the grid scrolled.
         */
        scrollIntoView(r: number, c: number): boolean {

            // make sure our dimensions are set and up-to-date
            if (this._maxOffsetY == null) {
                this._updateLayout();
            }

            // and go to work
            var sp = this.scrollPosition,
                wid = this._szClient.width,
                hei = this._szClient.height - this._gpCFtr.rows.getTotalSize(),
                ptFrz = this.cells._getFrozenPos();

            // calculate row offset
            r = asInt(r);
            if (r > -1 && r < this._rows.length && r >= this._rows.frozen) {
                var row = <Row>this._rows[r],
                    pct = this.cells.height > hei ? Math.round(row.pos / (this.cells.height - hei) * 100) / 100 : 0,
                    offsetY = Math.round(this._maxOffsetY * pct),
                    rpos = row.pos - offsetY,
                    rbot = rpos + row.renderSize - 1;
                if (rbot > hei - sp.y) {
                    sp.y = Math.max(-rpos, hei - rbot);
                }
                if (rpos - ptFrz.y < -sp.y) {
                    sp.y = -(rpos - ptFrz.y);
                }
            }

            // calculate column offset
            c = asInt(c);
            if (c > -1 && c < this._cols.length && c >= this._cols.frozen) {
                var col = <Column>this._cols[c],
                    rgt = col.pos + col.renderSize - 1;
                if (rgt > -sp.x + wid) {
                    sp.x = Math.max(-col.pos, wid - rgt);
                }
                if (col.pos - ptFrz.x < -sp.x) {
                    sp.x = -(col.pos - ptFrz.x);
                }
            }

            // update scroll position
            if (!sp.equals(this._ptScrl)) {
                this.scrollPosition = sp;
                return true;
            }

            // no change
            return false;
        }
        /**
         * Checks whether a given CellRange is valid for this grid's row and column collections.
         *
         * @param rng Range to check.
         */
        isRangeValid(rng: CellRange): boolean {
            return rng.isValid && rng.bottomRow < this.rows.length && rng.rightCol < this.columns.length;
        }
        /**
         * Starts editing a given cell.
         *
         * Editing in the @see:FlexGrid is similar to editing in Excel:
         * Pressing F2 or double-clicking a cell puts the grid in <b>full-edit</b> mode. 
         * In this mode, the cell editor remains active until the user presses Enter, Tab, 
         * or Escape, or until he moves the selection with the mouse. In full-edit mode, 
         * pressing the cursor keys does not cause the grid to exit edit mode.
         *
         * Typing text directly into a cell puts the grid in <b>quick-edit mode</b>.
         * In this mode, the cell editor remains active until the user presses Enter, 
         * Tab, or Escape, or any arrow keys.
         *
         * Full-edit mode is normally used to make changes to existing values. 
         * Quick-edit mode is normally used for entering new data quickly.
         *
         * While editing, the user can toggle between full and quick modes by 
         * pressing the F2 key.
         *
         * @param fullEdit Whether to stay in edit mode when the user presses the cursor keys. Defaults to false.
         * @param r Index of the row to be edited. Defaults to the currently selected row.
         * @param c Index of the column to be edited. Defaults to the currently selected column.
         * @param focus Whether to give the editor the focus when editing starts. Defaults to true.
         * @return True if the edit operation started successfully.
         */
        startEditing(fullEdit = true, r?: number, c?: number, focus?: boolean): boolean {
            return this._edtHdl.startEditing(fullEdit, r, c, focus);
        }
        /**
         * Commits any pending edits and exits edit mode.
         *
         * @param cancel Whether pending edits should be canceled or committed.
         * @return True if the edit operation finished successfully.
         */
        finishEditing(cancel = false): boolean {
            return this._edtHdl.finishEditing(cancel);
        }
        /**
         * Gets the <b>HTMLInputElement</b> that represents the cell editor currently active.
         */
        get activeEditor(): HTMLInputElement {
            return this._edtHdl.activeEditor;
        }
        /**
         * Gets a @see:CellRange that identifies the cell currently being edited.
         */
        get editRange(): CellRange {
            return this._edtHdl.editRange;
        }
        /**
         * Gets or sets the @see:MergeManager object responsible for determining how cells
         * should be merged.
         */
        get mergeManager(): MergeManager {
            return this._mrgMgr;
        }
        set mergeManager(value: MergeManager) {
            if (value != this._mrgMgr) {
                this._mrgMgr = asType(value, MergeManager, true);
                this.invalidate();
            }
        }
        /**
         * Gets a @see:CellRange that specifies the merged extent of a cell
         * in a @see:GridPanel.
         *
         * @param p The @see:GridPanel that contains the range.
         * @param r Index of the row that contains the cell.
         * @param c Index of the column that contains the cell.
         * @param clip Whether to clip the merged range to the grid's current view range.
         * @return A @see:CellRange that specifies the merged range, or null if the cell is not merged.
         */
        getMergedRange(p: GridPanel, r: number, c: number, clip = true): CellRange {
            return this._mrgMgr ? this._mrgMgr.getMergedRange(p, r, c, clip) : null;
        }

        //#endregion

        //--------------------------------------------------------------------------
        //#region ** events

        /**
         * Occurs after the grid has been bound to a new items source.
         */
        itemsSourceChanged = new Event();
        /**
         * Raises the @see:itemsSourceChanged event.
         */
        onItemsSourceChanged(e?: EventArgs) {
            this.itemsSourceChanged.raise(this, e);
        }
        /**
         * Occurs after the control has scrolled.
         */
        scrollPositionChanged = new Event();
        /**
         * Raises the @see:scrollPositionChanged event.
         */
        onScrollPositionChanged(e?: EventArgs) {
            this.scrollPositionChanged.raise(this, e);
        }
        /**
         * Occurs before selection changes.
         */
        selectionChanging = new Event();
        /**
         * Raises the @see:selectionChanging event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         * @return True if the event was not canceled.
         */
        onSelectionChanging(e: CellRangeEventArgs): boolean {
            this.selectionChanging.raise(this, e);
            return !e.cancel;
        }
        /**
         * Occurs after selection changes.
         */
        selectionChanged = new Event();
        /**
         * Raises the @see:selectionChanged event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         */
        onSelectionChanged(e: CellRangeEventArgs) {
            this.selectionChanged.raise(this, e);
        }
        /**
         * Occurs before the grid rows are bound to items in the data source.
         */
        loadingRows = new Event();
        /**
         * Raises the @see:loadingRows event.
         *
         * @param e @see:CancelEventArgs that contains the event data.
         * @return True if the event was not canceled.
         */
        onLoadingRows(e: CancelEventArgs): boolean {
            this.loadingRows.raise(this, e);
            return !e.cancel;
        }
        /**
         * Occurs after the grid rows have been bound to items in the data source.
         */
        loadedRows = new Event();
        /**
         * Raises the @see:loadedRows event.
         */
        onLoadedRows(e?: EventArgs) {
            this.loadedRows.raise(this, e);
        }
        /**
         * Occurs before the grid updates its internal layout.
         */
        updatingLayout = new Event();
        /**
         * Raises the @see:updatingLayout event.
         *
         * @param e @see:CancelEventArgs that contains the event data.
         * @return True if the event was not canceled.
         */
        onUpdatingLayout(e: CancelEventArgs): boolean {
            this.updatingLayout.raise(this, e);
            return !e.cancel;
        }
        /**
         * Occurs after the grid has updated its internal layout.
         */
        updatedLayout = new Event();
        /**
         * Raises the @see:updatedLayout event.
         */
        onUpdatedLayout(e?: EventArgs) {
            this.updatedLayout.raise(this, e);
        }
        /**
         * Occurs as columns are resized.
         */
        resizingColumn = new Event();
        /**
         * Raises the @see:resizingColumn event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         * @return True if the event was not canceled.
         */
        onResizingColumn(e: CellRangeEventArgs): boolean {
            this.resizingColumn.raise(this, e);
            return !e.cancel;
        }
        /**
         * Occurs when the user finishes resizing a column.
         */
        resizedColumn = new Event();
        /**
         * Raises the @see:resizedColumn event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         */
        onResizedColumn(e: CellRangeEventArgs) {
            this.resizedColumn.raise(this, e);
        }
        /**
         * Occurs before the user auto-sizes a column by double-clicking the 
         * right edge of a column header cell.
         */
        autoSizingColumn = new Event();
        /**
         * Raises the @see:autoSizingColumn event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         * @return True if the event was not canceled.
         */
        onAutoSizingColumn(e: CellRangeEventArgs): boolean {
            this.autoSizingColumn.raise(this, e);
            return !e.cancel;
        }
        /**
         * Occurs after the user auto-sizes a column by double-clicking the 
         * right edge of a column header cell.
         */
        autoSizedColumn = new Event();
        /**
         * Raises the @see:autoSizedColumn event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         */
        onAutoSizedColumn(e: CellRangeEventArgs) {
            this.autoSizedColumn.raise(this, e);
        }
        /**
         * Occurs when the user starts dragging a column.
         */
        draggingColumn = new Event();
        /**
         * Raises the @see:draggingColumn event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         * @return True if the event was not canceled.
         */
        onDraggingColumn(e: CellRangeEventArgs): boolean {
            this.draggingColumn.raise(this, e);
            return !e.cancel;
        }
        /**
         * Occurs when the user finishes dragging a column.
         */
        draggedColumn = new Event();
        /**
         * Raises the @see:draggedColumn event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         */
        onDraggedColumn(e: CellRangeEventArgs) {
            this.draggedColumn.raise(this, e);
        }
        /**
         * Occurs as rows are resized.
         */
        resizingRow = new Event();
        /**
         * Raises the @see:resizingRow event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         * @return True if the event was not canceled.
         */
        onResizingRow(e: CellRangeEventArgs): boolean {
            this.resizingRow.raise(this, e);
            return !e.cancel;
        }
        /**
         * Occurs when the user finishes resizing rows.
         */
        resizedRow = new Event();
        /**
         * Raises the @see:resizedRow event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         */
        onResizedRow(e: CellRangeEventArgs) {
            this.resizedRow.raise(this, e);
        }
        /**
         * Occurs before the user auto-sizes a row by double-clicking the 
         * bottom edge of a row header cell.
         */
        autoSizingRow = new Event();
        /**
         * Raises the @see:autoSizingRow event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         * @return True if the event was not canceled.
         */
        onAutoSizingRow(e: CellRangeEventArgs): boolean {
            this.autoSizingRow.raise(this, e);
            return !e.cancel;
        }
        /**
         * Occurs after the user auto-sizes a row by double-clicking the 
         * bottom edge of a row header cell.
         */
        autoSizedRow = new Event();
        /**
         * Raises the @see:autoSizedRow event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         */
        onAutoSizedRow(e: CellRangeEventArgs) {
            this.autoSizedRow.raise(this, e);
        }
        /**
         * Occurs when the user starts dragging a row.
         */
        draggingRow = new Event();
        /**
         * Raises the @see:draggingRow event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         * @return True if the event was not canceled.
         */
        onDraggingRow(e: CellRangeEventArgs): boolean {
            this.draggingRow.raise(this, e);
            return !e.cancel;
        }
        /**
         * Occurs when the user finishes dragging a row.
         */
        draggedRow = new Event();
        /**
         * Raises the @see:draggedRow event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         */
        onDraggedRow(e: CellRangeEventArgs) {
            this.draggedRow.raise(this, e);
        }
        /**
         * Occurs when a group is about to be expanded or collapsed.
         */
        groupCollapsedChanging = new Event();
        /**
         * Raises the @see:groupCollapsedChanging event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         * @return True if the event was not canceled.
         */
        onGroupCollapsedChanging(e: CellRangeEventArgs): boolean {
            this.groupCollapsedChanging.raise(this, e);
            return !e.cancel;
        }
        /**
         * Occurs after a group has been expanded or collapsed.
         */
        groupCollapsedChanged = new Event();
        /**
         * Raises the @see:groupCollapsedChanged event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         */
        onGroupCollapsedChanged(e: CellRangeEventArgs) {
            this.groupCollapsedChanged.raise(this, e);
        }
        /**
         * Occurs before the user applies a sort by clicking on a column header.
         */
        sortingColumn = new Event();
        /**
         * Raises the @see:sortingColumn event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         * @return True if the event was not canceled.
         */
        onSortingColumn(e: CellRangeEventArgs): boolean {
            this.sortingColumn.raise(this, e);
            return !e.cancel;
        }
        /**
         * Occurs after the user applies a sort by clicking on a column header.
         */
        sortedColumn = new Event();
        /**
         * Raises the @see:sortedColumn event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         */
        onSortedColumn(e: CellRangeEventArgs) {
            this.sortedColumn.raise(this, e);
        }
        /**
         * Occurs before a cell enters edit mode.
         */
        beginningEdit = new Event();
        /**
         * Raises the @see:beginningEdit event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         * @return True if the event was not canceled.
         */
        onBeginningEdit(e: CellRangeEventArgs): boolean {
            this.beginningEdit.raise(this, e);
            return !e.cancel;
        }
        /**
         * Occurs when an editor cell is created and before it becomes active.
         */
        prepareCellForEdit = new Event();
        /**
         * Raises the @see:prepareCellForEdit event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         */
        onPrepareCellForEdit(e: CellRangeEventArgs) {
            this.prepareCellForEdit.raise(this, e);
        }
        /**
         * Occurs when a cell edit is ending.
         *
         * You can use this event to perform validation and prevent invalid edits.
         * For example, the code below prevents users from entering values that
         * do not contain the letter 'a'. The code demonstrates how you can obtain
         * the old and new values before the edits are applied.
         *
         * <pre>function cellEditEnding (sender, e) {
         *   // get old and new values
         *   var flex = sender,
         *       oldVal = flex.getCellData(e.row, e.col),
         *       newVal = flex.activeEditor.value;
         *   // cancel edits if newVal doesn't contain 'a'
         *   e.cancel = newVal.indexOf('a') &lt; 0;
         * }</pre>
         *
         * Setting the @see:CellEditEndingEventArgs.cancel parameter to
         * true causes the grid to discard the edited value and keep the
         * cell's original value.
         *
         * If you also set the @see:CellEditEndingEventArgs.stayInEditMode
         * parameter to true, the grid will remain in edit mode so the user
         * can correct invalid entries before committing the edits.
         */
        cellEditEnding = new Event();
        /**
         * Raises the @see:cellEditEnding event.
         *
         * @param e @see:CellEditEndingEventArgs that contains the event data.
         * @return True if the event was not canceled.
         */
        onCellEditEnding(e: CellEditEndingEventArgs): boolean {
            this.cellEditEnding.raise(this, e);
            return !e.cancel && !e.stayInEditMode;
        }
        /**
         * Occurs when a cell edit has been committed or canceled.
         */
        cellEditEnded = new Event();
        /**
         * Raises the @see:cellEditEnded event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         */
        onCellEditEnded(e: CellRangeEventArgs) {
            this.cellEditEnded.raise(this, e);
        }
        /**
         * Occurs before a row enters edit mode.
         */
        rowEditStarting = new Event();
        /**
         * Raises the @see:rowEditStarting event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         */
        onRowEditStarting(e: CellRangeEventArgs) {
            this.rowEditStarting.raise(this, e);
        }
        /**
         * Occurs after a row enters edit mode.
         */
        rowEditStarted = new Event();
        /**
         * Raises the @see:rowEditStarted event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         */
        onRowEditStarted(e: CellRangeEventArgs) {
            this.rowEditStarted.raise(this, e);
        }
        /**
         * Occurs when a row edit is ending, before the changes are committed or canceled.
         *
         * This event can be used in conjunction with the @see:rowEditStarted event to
         * implement deep-binding edit undos. For example:
         *
         * <pre>// save deep bound values when editing starts
         * var itemData = {};
         * s.rowEditStarted.addHandler(function (s, e) {
         *   var item = s.collectionView.currentEditItem;
         *   itemData = {};
         *   s.columns.forEach(function (col) {
         *     if (col.binding.indexOf('.') &gt; -1) { // deep binding
         *       var binding = new wijmo.Binding(col.binding);
         *       itemData[col.binding] = binding.getValue(item);
         *     }
         *   })
         * });
         *
         * // restore deep bound values when edits are canceled
         * s.rowEditEnded.addHandler(function (s, e) {
         *   if (e.cancel) { // edits were canceled by the user
         *     var item = s.collectionView.currentEditItem;
         *     for (var k in itemData) {
         *       var binding = new wijmo.Binding(k);
         *       binding.setValue(item, itemData[k]);
         *     }
         *   }
         *   itemData = {};
         * });</pre>
         */
        rowEditEnding = new Event();
        /**
         * Raises the @see:rowEditEnding event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         */
        onRowEditEnding(e: CellRangeEventArgs) {
            this.rowEditEnding.raise(this, e);
        }
        /**
         * Occurs when a row edit has been committed or canceled.
         */
        rowEditEnded = new Event();
        /**
         * Raises the @see:rowEditEnded event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         */
        onRowEditEnded(e: CellRangeEventArgs) {
            this.rowEditEnded.raise(this, e);
        }
        /**
         * Occurs when the user creates a new item by editing the new row template
         * (see the @see:allowAddNew property).
         *
         * The event handler may customize the content of the new item or cancel
         * the new item creation.
         */
        rowAdded = new Event();
        /**
         * Raises the @see:rowAdded event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         */
        onRowAdded(e: CellRangeEventArgs) {
            this.rowAdded.raise(this, e);
        }
        /**
         * Occurs when the user is deleting a selected row by pressing the Delete 
         * key (see the @see:allowDelete property).
         *
         * The event handler may cancel the row deletion.
         */
        deletingRow = new Event();
        /**
         * Raises the @see:deletingRow event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         * @return True if the event was not canceled.
         */
        onDeletingRow(e: CellRangeEventArgs): boolean {
            this.deletingRow.raise(this, e);
            return !e.cancel;
        }
        /**
         * Occurs after the user has deleted a row by pressing the Delete 
         * key (see the @see:allowDelete property).
         */
        deletedRow = new Event();
        /**
         * Raises the @see:deletedRow event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         */
        onDeletedRow(e: CellRangeEventArgs) {
            this.deletedRow.raise(this, e);
        }
        /**
         * Occurs when the user is copying the selection content to the 
         * clipboard by pressing one of the clipboard shortcut keys
         * (see the @see:autoClipboard property).
         *
         * The event handler may cancel the copy operation.
         */
        copying = new Event();
        /**
         * Raises the @see:copying event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         * @return True if the event was not canceled.
         */
        onCopying(e: CellRangeEventArgs): boolean {
            this.copying.raise(this, e);
            return !e.cancel;
        }
        /**
         * Occurs after the user has copied the selection content to the 
         * clipboard by pressing one of the clipboard shortcut keys
         * (see the @see:autoClipboard property).
         */
        copied = new Event();
        /**
         * Raises the @see:copied event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         */
        onCopied(e: CellRangeEventArgs) {
            this.copied.raise(this, e);
        }
        /**
         * Occurs when the user is pasting content from the clipboard 
         * by pressing one of the clipboard shortcut keys
         * (see the @see:autoClipboard property).
         *
         * The event handler may cancel the copy operation.
         */
        pasting = new Event();
        /**
         * Raises the @see:pasting event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         * @return True if the event was not canceled.
         */
        onPasting(e: CellRangeEventArgs): boolean {
            this.pasting.raise(this, e);
            return !e.cancel;
        }
        /**
         * Occurs after the user has pasted content from the 
         * clipboard by pressing one of the clipboard shortcut keys
         * (see the @see:autoClipboard property).
         */
        pasted = new Event();
        /**
         * Raises the @see:pasted event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         */
        onPasted(e: CellRangeEventArgs) {
            this.pasted.raise(this, e);
        }
        /**
         * Occurs when the user is pasting content from the clipboard 
         * into a cell (see the @see:autoClipboard property).
         *
         * The event handler may cancel the copy operation.
         */
        pastingCell = new Event();
        /**
         * Raises the @see:pastingCell event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         * @return True if the event was not canceled.
         */
        onPastingCell(e: CellRangeEventArgs): boolean {
            this.pastingCell.raise(this, e);
            return !e.cancel;
        }
        /**
         * Occurs after the user has pasted content from the 
         * clipboard into a cell (see the @see:autoClipboard property).
         */
        pastedCell = new Event();
        /**
         * Raises the @see:pastedCell event.
         *
         * @param e @see:CellRangeEventArgs that contains the event data.
         */
        onPastedCell(e: CellRangeEventArgs) {
            this.pastedCell.raise(this, e);
        }
        /**
         * Occurs when an element representing a cell has been created.
         *
         * This event can be used to format cells for display. It is similar 
         * in purpose to the @see:itemFormatter property, but has the advantage 
         * of allowing multiple independent handlers.
         *
         * For example, this code removes the 'wj-wrap' class from cells in 
         * group rows:
         *
         * <pre>flex.formatItem.addHandler(function (s, e) {
         *   if (flex.rows[e.row] instanceof wijmo.grid.GroupRow) {
         *     wijmo.removeClass(e.cell, 'wj-wrap');
         *   }
         * });</pre>
         */
        formatItem = new Event();
        /**
         * Raises the @see:formatItem event.
         *
         * @param e @see:FormatItemEventArgs that contains the event data.
         */
        onFormatItem(e: FormatItemEventArgs) {
            this.formatItem.raise(this, e);
        }
        /**
         * Occurs when the grid starts creating/updating the elements that
         * make up the current view.
         */
        updatingView = new Event();
        /**
         * Raises the @see:updatingView event.
         *
         * @param e @see:CancelEventArgs that contains the event data.
         * @return True if the event was not canceled.
         */
        onUpdatingView(e: CancelEventArgs): boolean {
            this.updatingView.raise(this, e);
            return !e.cancel;
        }
        /**
         * Occurs when the grid finishes creating/updating the elements that 
         * make up the current view.
         *
         * The grid updates the view in response to several actions, including:
         *
         * <ul>
         * <li>refreshing the grid or its data source,</li>
         * <li>adding, removing, or changing rows or columns,</li>
         * <li>resizing or scrolling the grid,</li>
         * <li>changing the selection.</li>
         * </ul>
         */
        updatedView = new Event();
        /**
         * Raises the @see:updatedView event.
         */
        onUpdatedView(e?: EventArgs) {
            this.updatedView.raise(this, e);
        }

        //#endregion

        //--------------------------------------------------------------------------
        //#region ** implementation

        // measure the control's default row height based on current styles
        _getDefaultRowHeight() {

            // add control's root element to document body if it's detached 
            // (so CSS rules apply to our measurements)
            var host = this.hostElement,
                body = document.body,
                root = null;
            if (body && !contains(body, host)) {
                for (var p = host; p; p = p.parentElement) {
                    root = p;
                }
                if (root) {
                    body.appendChild(root);
                }
            }

            // create cell, measure, and remove it
            // (add extra 2px to keep default compatible with old algorithm)
            var cell = createElement('<div class="wj-cell">123</div>', host),
                defRowHei = cell.scrollHeight + 2;
            host.removeChild(cell);

            // remove root if we added it earlier
            if (root) {
                body.removeChild(root);
            }

            // make 100% sure we have a reasonable default row height!
            if (defRowHei <= 6 || isNaN(defRowHei) || !body) {
                defRowHei = 28;
            }

            // done, return what we have
            return defRowHei;
        }

        // gets the collection view associated with an itemsSource object
        _getCollectionView(value: any): collections.ICollectionView {
            return asCollectionView(value);
        }

        // measures the desired width of a cell
        _getDesiredWidth(p: GridPanel, r: number, c: number, e: HTMLElement) {
            var rng = this.getMergedRange(p, r, c);
            this.cellFactory.updateCell(p, r, c, e, rng);
            e.style.width = '';
            var w = e.offsetWidth;
            return rng && rng.columnSpan > 1
                ? w / rng.columnSpan
                : w;
        }

        // measures the desired height of a cell
        _getDesiredHeight(p: GridPanel, r: number, c: number, e: HTMLElement) {
            var rng = this.getMergedRange(p, r, c);
            this.cellFactory.updateCell(p, r, c, e, rng);
            e.style.height = '';
            var h = e.offsetHeight;
            return rng && rng.rowSpan > 1
                ? h / rng.rowSpan
                : h;
        }

        // gets the index of the sort row, with special handling for nulls
        _getSortRowIndex(): number {
            return this._sortRowIndex != null
                ? this._sortRowIndex
                : this.columnHeaders.rows.length - 1;
        }

        // sort converter used to sort mapped columns by display value
        _mappedColumns = null;
        private _sortConverter(sd: collections.SortDescription, item: any, value: any, init: boolean) {
            var col: Column;

            // initialize mapped column dictionary
            if (init) {
                this._mappedColumns = null;
                if (this.collectionView) {
                    var sds = this.collectionView.sortDescriptions;
                    for (var i = 0; i < sds.length; i++) {
                        col = this.columns.getColumn(sds[i].property);
                        if (col && col.dataMap) {
                            if (!this._mappedColumns) {
                                this._mappedColumns = {};
                            }
                            this._mappedColumns[col.binding] = col.dataMap;
                        }
                    }
                }

                // prioritize the column that was clicked
                // (in case multiple columns map the same property)
                if (this._mouseHdl._htDown && this._mouseHdl._htDown.col > -1) {
                    col = this.columns[this._mouseHdl._htDown.col];
                    if (this._mappedColumns && col.dataMap) { // TFS 118453
                        this._mappedColumns[col.binding] = col.dataMap;
                    }
                }
            }

            // convert value if we have a map
            if (this._mappedColumns) {
                var map = <DataMap>this._mappedColumns[sd.property];
                if (map && map.sortByDisplayValues) {
                    value = map.getDisplayValue(value);
                }
            }

            // return the value to use for sorting
            return value;
        }

        // binds the grid to the current data source.
        _bindGrid(full: boolean) {
            this.deferUpdate(() => {

                // do a full binding if we didn't have any data when we did it the first time
                if (this._lastCount == 0 && this._cv && this._cv.items && this._cv.items.length) {
                    full = true;
                }

                // save selected state
                var selItems = [];
                if (this.preserveSelectedState && this.selectionMode == SelectionMode.ListBox) {
                    for (var i = 0; i < this.rows.length; i++) {
                        var row = this.rows[i];
                        if (row.isSelected && row.dataItem) {
                            selItems.push(row.dataItem);
                        }
                    }
                }

                // save collapsed state
                var map;
                if (this.preserveOutlineState && isFunction(window['Map']) && this.rows.maxGroupLevel > -1) {
                    map = new Map();
                    for (var i = 0; i < this.rows.length; i++) {
                        var gr = <GroupRow>this.rows[i];
                        if (gr instanceof GroupRow && gr.isCollapsed && gr.dataItem) {
                            var key = gr.dataItem;
                            if (key instanceof wijmo.collections.CollectionViewGroup) {
                                key = key._path;
                            }
                            map.set(key, true);
                        }
                    }
                }

                // update columns
                if (full) {
                    this.columns.deferUpdate(() => {
                        this._bindColumns();
                    });
                }

                // update rows
                this.rows.deferUpdate(() => {
                    this._bindRows();
                });

                // restore/initialize ListBox selection
                var cnt = 0;
                if (selItems.length) {
                    for (var i = 0; i < this.rows.length && cnt < selItems.length; i++) {
                        if (selItems.indexOf(this.rows[i].dataItem) > -1) {
                            this.rows[i].isSelected = true;
                            cnt++;
                        }
                    }
                }

                // failed to restore ListBox selection by object, update by index
                if (this.selectionMode == SelectionMode.ListBox && cnt == 0) {
                    var sel = this.selection;
                    for (var i = sel.topRow; i <= sel.bottomRow && i > -1 && i < this.rows.length; i++) {
                        this.rows[i].isSelected = true;
                    }
                }

                // restore collapsed state
                if (map) {
                    this.rows.deferUpdate(() => {
                        for (var i = 0; i < this.rows.length; i++) {
                            var gr = <GroupRow>this.rows[i];
                            if (gr instanceof GroupRow) {
                                var key = gr.dataItem;
                                if (key instanceof wijmo.collections.CollectionViewGroup) {
                                    key = key._path;
                                }
                                if (map.get(key)) {
                                    gr.isCollapsed = true;
                                }
                            }
                        }
                    });
                }

                // save item count for next time
                if (!this._lastCount && this._cv && this._cv.items) {
                    this._lastCount = this._cv.items.length;
                }
            });

            // update selection
            if (this.collectionView) {
                this._cvCurrentChanged(this.collectionView, EventArgs.empty);
            }
        }

        // update grid rows to sync with data source
        /*protected*/ _cvCollectionChanged(sender, e: collections.NotifyCollectionChangedEventArgs) {

            // auto-generate if necessary
            if (this.autoGenerateColumns && this.columns.length == 0) {
                this._bindGrid(true);
                return;
            }

            // hierarchical binding: re-create all rows
            if (this.childItemsPath && e.action != collections.NotifyCollectionChangedAction.Change) {
                this._bindGrid(false);
                return;
            }

            // synchronize grid with updated CollectionView
            var index: number;
            switch (e.action) {

                // an item has changed, invalidate the grid to show the changes
                case collections.NotifyCollectionChangedAction.Change:
                    this.invalidate();
                    return;

                // an item has been added, insert a row
                case collections.NotifyCollectionChangedAction.Add:
                    if (e.index == this.collectionView.items.length - 1) {
                        index = this.rows.length;
                        if (this.rows[index - 1] instanceof _NewRowTemplate) {
                            index--;
                        }
                        this.rows.insert(index, new Row(e.item));
                        return;
                    }
                    assert(false, 'added item should be the last one.');
                    break;

                // an item has been removed, delete the row
                case collections.NotifyCollectionChangedAction.Remove:
                    var index = this._findRow(e.item);
                    if (index > -1) {
                        this.rows.removeAt(index);
                        this._cvCurrentChanged(sender, e);
                        return;
                    }
                    assert(false, 'removed item not found in grid.');
                    break;
            }

            // reset (sort, new source, etc): re-create all rows
            this._bindGrid(false);
        }

        // update selection to sync with data source
        private _cvCurrentChanged(sender, e) {
            if (this.collectionView) {

                // get grid's current item
                var sel = this.selection,
                    item = sel.row > -1 && sel.row < this.rows.length ? this.rows[sel.row].dataItem : null;

                // groups are not regular data items (TFS 142470)
                if (item instanceof wijmo.collections.CollectionViewGroup) {
                    item = null;
                }

                // if it doesn't match the view's, move the selection to match
                if (item != this.collectionView.currentItem) {
                    sel.row = sel.row2 = this._getRowIndex(this.collectionView.currentPosition);
                    this.select(sel, false);
                    if (this.selectionMode != SelectionMode.None) {
                        this.scrollIntoView(sel.row, -1);
                    }
                }
            }
        }

        // convert CollectionView index to row index
        private _getRowIndex(index: number): number {
            if (this.collectionView) {

                // look up item, then scan rows to find it
                if (index > -1) {
                    var item = this.collectionView.items[index];
                    for (; index < this.rows.length; index++) {
                        if (this.rows[index].dataItem === item) {
                            return index;
                        }
                    }
                    return -1; // item not found, shouldn't happen!
                } else {

                    // empty grid except for new row template? select that
                    if (this.rows.length == 1 && this.rows[0] instanceof _NewRowTemplate) {
                        return 0;
                    }

                    // no item to look up, so return current unbound row (group header)
                    // or -1 (no selection)
                    var index = this.selection.row,
                        row = index > -1 ? this.rows[index] : null;
                    return row && (row instanceof GroupRow || row.dataItem == null)
                        ? index
                        : -1;
                }
            }

            // not bound
            return this.selection.row;
        }

        // convert row index to CollectionView index
        _getCvIndex(index: number): number {
            if (index > -1 && this.collectionView) {
                var item = this.rows[index].dataItem;
                index = Math.min(index, this.collectionView.items.length);
                for (; index > -1; index--) {
                    if (this.collectionView.items[index] === item) {
                        return index;
                    }
                }
            }
            return -1;
        }

        // gets the index of the row that represents a given data item
        private _findRow(data: any): number {
            for (var i = 0; i < this.rows.length; i++) {
                if (this.rows[i].dataItem == data) {
                    return i;
                }
            }
            return -1;
        }

        // re-arranges the child HTMLElements within this grid.
        private _updateLayout() {

            // raise updatingLayout event
            var e = new CancelEventArgs();
            if (!this.onUpdatingLayout(e)) {
                return;
            }

            // compute content height, max height supported by browser,
            // and max offset so things match up when you scroll all the way down.
            var tlw = (this._hdrVis & HeadersVisibility.Row) ? this._hdrCols.getTotalSize() : 0,
                tlh = (this._hdrVis & HeadersVisibility.Column) ? this._hdrRows.getTotalSize() : 0,
                blh = this._ftrRows.getTotalSize(),
                heightReal = this._rows.getTotalSize() + blh;

            // make sure scrollbars are functional even if we have no rows (TFS 110441)
            if (heightReal < 1) {
                heightReal = 1;
            }

            // keep track of relevant variables
            this._rtl = this.hostElement ? (getComputedStyle(this.hostElement).direction == 'rtl') : false;
            this._heightBrowser = Math.min(heightReal, FlexGrid._getMaxSupportedCssHeight());
            this._maxOffsetY = Math.max(0, heightReal - this._heightBrowser);

            // compute default cell padding
            if (this.cells.hostElement) {
                var cell = createElement('<div class="wj-cell"></div>', this.cells.hostElement),
                    cs = getComputedStyle(cell);
                this._cellPadding = parseInt(this._rtl ? cs.paddingRight : cs.paddingLeft);
                cell.parentElement.removeChild(cell);
            }

            // top of the footer divs
            var ftrTop = this._heightBrowser + tlh - blh;

            // set sizes that do *not* depend on scrollbars being visible
            if (this._rtl) {
                setCss(this._eTL, { right: 0, top: 0, width: tlw, height: tlh });
                setCss(this._eCHdr, { right: tlw, top: 0, height: tlh });
                setCss(this._eRHdr, { right: 0, top: tlh, width: tlw });
                setCss(this._eCt, { right: tlw, top: tlh, width: this._gpCells.width, height: this._heightBrowser });
                setCss(this._fCt, { right: tlw, top: tlh });
                setCss(this._eBL, { right: 0, top: ftrTop, width: tlw, height: blh });
                setCss(this._eCFtr, { right: tlw, top: ftrTop, height: blh });
            } else {
                setCss(this._eTL, { left: 0, top: 0, width: tlw, height: tlh });
                setCss(this._eCHdr, { left: tlw, top: 0, height: tlh });
                setCss(this._eRHdr, { left: 0, top: tlh, width: tlw });
                setCss(this._eCt, { left: tlw, top: tlh, width: this._gpCells.width, height: this._heightBrowser });
                setCss(this._fCt, { left: tlw, top: tlh });
                setCss(this._eBL, { left: 0, top: ftrTop, width: tlw, height: blh });
                setCss(this._eCFtr, { left: tlw, top: ftrTop, height: blh });
            }

            // adjust for sticky headers
            if (this._stickyHdr) {
                this._updateStickyHeaders();
            }

            // adjust frozen cell panel
            var zIndexArr = [this._eTL, this._eBL, this._eCHdr, this._eCFtr, this._eRHdr, this._eMarquee];
            if (isIE() && (this.frozenRows || this.frozenColumns) && this.showMarquee) {
                setCss(zIndexArr, { zIndex: 1 });
            } else {
                setCss(zIndexArr, { zIndex: '' });
            }

            // update auto-sizer element
            var root = this._root,
                sbW = root.offsetWidth - root.clientWidth,
                sbH = root.offsetHeight - root.clientHeight;
            setCss(this._eSz, {
                width: tlw + sbW + this._gpCells.width,
                height: tlh + sbH + this._heightBrowser
            });

            // update star sizes and re-adjust content width to handle round-offs
            var clientWidth = null;
            if (this.columns._updateStarSizes(root.clientWidth - tlw)) {
                clientWidth = root.clientWidth;
                setCss(this._eCt, { width: this._gpCells.width });
            }

            // store control size
            this._szClient = new Size(root.clientWidth - tlw, root.clientHeight - tlh);
            this._rcBounds = null;

            // refresh content
            this._updateContent(false);

            // update auto-sizer after refreshing content
            sbW = root.offsetWidth - root.clientWidth;
            sbH = root.offsetHeight - root.clientHeight;
            setCss(this._eSz, {
                width: tlw + sbW + this._gpCells.width,
                height: tlh + sbH + this._heightBrowser
            });

            // update client size after refreshing content
            this._szClient = new Size(root.clientWidth - tlw, root.clientHeight - tlh);

            // adjust star sizes for vertical scrollbars
            if (clientWidth && clientWidth != root.clientWidth) {
                if (this.columns._updateStarSizes(root.clientWidth - tlw)) {
                    setCss(this._eCt, { width: this._gpCells.width });
                    this._updateContent(false);
                }
            }

            // set sizes that *do* depend on scrollbars being visible
            setCss([this._eCHdr, this._eCFtr, this._fCt], { width: this._szClient.width });
            setCss([this._eRHdr, this._fCt], { height: this._szClient.height });

            // adjust top of footer 
            if (blh) {
                ftrTop = Math.min(ftrTop, this._szClient.height + tlh - blh);
                setCss([this._eBL, this._eCFtr], { top: ftrTop });
            }

            // raise the event
            this.onUpdatedLayout(e);
        }

        // update the top of the header elements to remain visible 
        // when the user scrolls the window
        _updateStickyHeaders() {
            var stuck = false,
                offset = 0;

            // calculate offset
            if (this._stickyHdr) {
                var maxTop = 0,
                    thisTop = null;
                for (var el = this.hostElement; el; el = el.parentElement) {
                    var rc = el.getBoundingClientRect();
                    if (thisTop == null) {
                        thisTop = rc.top;
                    }
                    maxTop = Math.max(maxTop, rc.top);
                }
                thisTop = Math.max(0, maxTop - thisTop - 1);
                offset = -thisTop;
                stuck = thisTop > 0;
            }

            // apply offset
            this._eTL.style.top = this._eCHdr.style.top = stuck ? (-offset + 'px') : '';
            toggleClass(this._eTL, FlexGrid._WJS_STICKY, stuck);
            toggleClass(this._eCHdr, FlexGrid._WJS_STICKY, stuck);
        }

        // updates the scrollPosition property based on the element's scroll position
        // note that IE/Chrome/FF handle scrollLeft differently under RTL:
        // - Chrome reverses direction,
        // - FF uses negative values, 
        // - IE does the right thing (nothing)
        private _updateScrollPosition() : boolean {
            var root = this._root,
                top = root.scrollTop,
                left = root.scrollLeft;
            if (this._rtl && FlexGrid._getRtlMode() == 'rev') {
                left = (root.scrollWidth - root.clientWidth) - left;
            }
            var pt = new Point(-Math.abs(left), -top);

            // save new value and raise event
            if (!this._ptScrl.equals(pt)) {
                this._ptScrl = pt;
                this.onScrollPositionChanged();
                return true;
            }

            // no change...
            return false;
        }

        // updates the cell elements within this grid.
        private _updateContent(recycle: boolean, state?: boolean) {
            var focus = this.containsFocus(),
                hdrFocus = contains(this.columnHeaders.hostElement, getActiveElement());

            // raise updatingView event
            var e = new CancelEventArgs();
            if (!this.onUpdatingView(e)) {
                return;
            }

            // calculate offset to work around IE limitations
            this._offsetY = 0;
            if (this._heightBrowser > this._szClient.height) {
                var pct = Math.round((-this._ptScrl.y) / (this._heightBrowser - this._szClient.height) * 100) / 100;
                this._offsetY = Math.round(this._maxOffsetY * pct);
            }

            // update scroll position and then cells (TFS 144263, 152757)
            this._updateScrollPosition();
            this._gpCells._updateContent(recycle, state, this._offsetY);

            // update visible headers
            if (this._hdrVis & HeadersVisibility.Column) {
                if (!state || (this._ssHdr & HeadersVisibility.Column)) {
                    this._gpCHdr._updateContent(recycle, state, 0);
                }
            }
            if (this._hdrVis & HeadersVisibility.Row) {
                if (!state || (this._ssHdr & HeadersVisibility.Row)) {
                    this._gpRHdr._updateContent(recycle, state, this._offsetY);
                }
            }
            if (this._hdrVis && !state) {
                this._gpTL._updateContent(recycle, state, 0);
            }

            // update column footers
            if (this._gpCFtr.rows.length) {
                this._gpBL._updateContent(recycle, state, 0);
                this._gpCFtr._updateContent(recycle, state, 0)
            }
            // update marquee position
            if (this.showMarquee) {
                var sel = this._selHdl._sel,
                    marquee = this._eMarquee;
                if (!this.isRangeValid(sel)) { // TFS 139220
                    setCss(marquee, {
                        left: 0,
                        top: 0,
                        width: 0,
                        height: 0,
                        visibility: 'collapse'
                    });
                } else {
                    var rcm = this._getMarqueeRect(sel),
                        mc = <HTMLElement>marquee.firstChild,
                        dx = marquee.offsetWidth - mc.offsetWidth,
                        dy = marquee.offsetHeight - mc.offsetHeight;
                    setCss(marquee, {
                        left: rcm.left + this.cells.hostElement.offsetLeft - dx / 2,
                        top: rcm.top + this.cells.hostElement.offsetTop - dy  / 2,
                        width: rcm.width + dx,
                        height: rcm.height + dy,
                        visibility: rcm.width > 0 && rcm.height > 0 ? '' : 'collapse'
                    });
                }
            }

            // copy frozen cells into their own container (in IE only)
            if (isIE()) {
                setText(this._fCt, null);
                if (!this.activeEditor) {
                    if (this.frozenRows || this.frozenColumns) {
                        var frozen = this._eCt.querySelectorAll('.wj-frozen');
                        for (var i = 0; i < frozen.length; i++) {
                            this._fCt.appendChild(frozen[i].cloneNode(true));
                        }
                    }
                }
            }

            // restore focus
            if (focus && !state) {
                setTimeout(() => { // to work with Android (see HeaderFilters demo)
                    this.focus();
                }, 10);
            }

            // make sure hit-testing works
            this._rcBounds = null;

            // done updating the view
            this.onUpdatedView(e);
        }

        // get marquee rectangle (accounting for merging, freezing, RTL)
        private _getMarqueeRect(rng: CellRange): Rect {

            // get selection corner cells (accounting for merging)
            var m1 = this.getMergedRange(this.cells, rng.topRow, rng.leftCol) || new CellRange(rng.topRow, rng.leftCol),
                m2 = this.getMergedRange(this.cells, rng.bottomRow, rng.rightCol) || new CellRange(rng.bottomRow, rng.rightCol);

            // get cell client rectangles
            var rc1 = this.cells.getCellBoundingRect(m1.topRow, m1.leftCol, true),
                rc2 = this.cells.getCellBoundingRect(m2.bottomRow, m2.rightCol, true);

            // adjust for frozen rows
            if (this.rows.frozen) {
                var fzr = Math.min(this.rows.length, this.rows.frozen),
                    rcf = this.cells.getCellBoundingRect(fzr - 1, 0, true);
                if (rng.topRow >= fzr && rc1.top < rcf.bottom) {
                    rc1.top = rcf.bottom;
                }
                if (rng.bottomRow >= fzr && rc2.bottom < rcf.bottom) {
                    rc2.height = rcf.bottom - rc2.top;
                }
            }

            // adjust for frozen columns
            if (this.columns.frozen) {
                var fzc = Math.min(this.columns.length, this.columns.frozen),
                    rcf = this.cells.getCellBoundingRect(0, fzc - 1, true);
                if (this._rtl) {
                    if (rng.leftCol >= fzc && rc1.right > rcf.left) {
                        rc1.left = rcf.left - rc1.width;
                    }
                    if (rng.rightCol >= fzc && rc2.left > rcf.left) {
                        rc2.left = rcf.left;
                    }
                } else {
                    if (rng.leftCol >= fzc && rc1.left < rcf.right) {
                        rc1.left = rcf.right;
                    }
                    if (rng.rightCol >= fzc && rc2.right < rcf.right) {
                        rc2.width = rcf.right - rc2.left;
                    }
                }
            }

            // return marquee rect
            return this._rtl
                ? new Rect(rc2.left, rc1.top, rc1.right - rc2.left, rc2.bottom - rc1.top)
                : new Rect(rc1.left, rc1.top, rc2.right - rc1.left, rc2.bottom - rc1.top);
        }

        // bind columns
        /*protected*/ _bindColumns() {

            // remove old auto-generated columns
            for (var i = 0; i < this.columns.length; i++) {
                var col = this.columns[i];
                if (col._getFlag(RowColFlags.AutoGenerated)) {
                    this.columns.removeAt(i);
                    i--;
                }
            }

            // get first item to infer data types
            var cv = this.collectionView,
                sc = cv ? cv.sourceCollection : null,
                item = sc && sc.length ? sc[0] : null;

            // auto-generate new columns
            // (skipping unwanted types: array and object)
            if (item && this.autoGenerateColumns) {
                for (var key in item) {
                    var value = null; // look for the first non-null value
                    for (var index = 0; index < sc.length && index < 1000 && value == null; index++) {
                        value = sc[index][key];
                        if (isPrimitive(value)) {
                            col = new Column();
                            col._setFlag(RowColFlags.AutoGenerated, true);
                            col.binding = col.name = key;
                            col.header = toHeaderCase(key);
                            col.dataType = getType(value);
                            if (col.dataType == DataType.Number) {
                                col.width = 80;
                            }
                            var pdesc = Object.getOwnPropertyDescriptor(item, key);
                            if (pdesc && !pdesc.writable && !isFunction(pdesc.set)) {
                                col._setFlag(RowColFlags.ReadOnly, true);
                            }
                            this.columns.push(col);
                        }
                    }
                }
            }

            // update missing column types
            this._updateColumnTypes();

            // REVIEW: add onLoading/edRows()?
        }

        // update missing column types to match data
        /*protected*/ _updateColumnTypes() {
            var cv = this.collectionView;
            if (hasItems(cv)) {
                var item = cv.items[0],
                    cols = this.columns;
                for (var i = 0; i < cols.length; i++) {
                    var col = cols[i];
                    if (col.dataType == null && col._binding) {
                        col.dataType = getType(col._binding.getValue(item));
                    }
                }
            }
        }

        // get the binding column 
        // (in the MultiRow grid, each physical column may contain several binding columns)
        /*protected*/ _getBindingColumn(p: GridPanel, r: Number, c: Column): Column {
            return c;
        }

        // bind rows
        /*protected*/ _bindRows() {

            // raise loading rows event
            var e = new CancelEventArgs();
            if (!this.onLoadingRows(e)) {
                return;
            }

            // clear rows
            this.rows.clear();

            // re-populate
            var cv = this.collectionView;
            if (cv && cv.items) {
                var list = cv.items;
                var groups = cv.groups;

                // bind to hierarchical sources (childItemsPath)
                if (this.childItemsPath) {
                    for (var i = 0; i < list.length; i++) {
                        this._addNode(list, i, 0);
                    }

                // bind to grouped sources
                } else if (groups != null && groups.length > 0 && this.showGroups) {
                    for (var i = 0; i < groups.length; i++) {
                        this._addGroup(groups[i]);
                    }

                // bind to regular sources
                } else {
                    for (var i = 0; i < list.length; i++) {
                        this._addBoundRow(list, i);
                    }
                }
            }

            // done binding rows
            this.onLoadedRows(e);
        }
        /*protected*/ _addBoundRow(items: any[], index: number) {
            this.rows.push(new Row(items[index]));
        }
        /*protected*/ _addNode(items: any[], index: number, level: number) {
            var gr = new GroupRow(),
                path = this.childItemsPath,
                prop = isArray(path) ? path[level] : path,
                item = items[index],
                children = item[prop];

            // add main node
            gr.dataItem = item;
            gr.level = level;
            this.rows.push(gr);

            // add child nodes
            if (children) {
                for (var i = 0; i < children.length; i++) {
                    this._addNode(children, i, level + 1);
                }
            }
        }
        private _addGroup(g: collections.CollectionViewGroup) {

            // add group row
            var gr = new GroupRow();
            gr.level = g.level;
            gr.dataItem = g;
            this.rows.push(gr);

            // add child rows
            if (g.isBottomLevel) {
                var items = g.items;
                for (var i = 0; i < items.length; i++) {
                    this._addBoundRow(items, i);
                }
            } else {
                for (var i = 0; i < g.groups.length; i++) {
                    this._addGroup(g.groups[i]);
                }
            }
        }

        // gets a list of the properties defined by a class and its ancestors
        // that have getters, setters, and whose names don't start with '_'.
        private static _getSerializableProperties(obj: any) {
            var arr = [];

            // travel up class hierarchy saving public properties that can be get/set.
            // NOTE: use getPrototypeOf instead of __proto__ for IE9 compatibility.
            for (obj = obj.prototype; obj != Object.prototype; obj = Object.getPrototypeOf(obj)) {
                var names = Object.getOwnPropertyNames(obj);
                for (var i = 0; i < names.length; i++) {
                    var name = names[i],
                        pd = Object.getOwnPropertyDescriptor(obj, name);
                    if (pd && pd.set && pd.get && name[0] != '_' &&
                        !name.match(/disabled|required/)) { // deprecated properties
                        arr.push(name);
                    }
                }
            }

            // done
            return arr;
        }

        // method used in JSON-style initialization
        _copy(key: string, value: any): boolean {
            if (key == 'columns') {
                this.columns.clear();
                var arr = asArray(value);
                for (var i = 0; i < arr.length; i++) {
                    var c = new Column();
                    copy(c, arr[i]);
                    this.columns.push(c);
                }
                return true;
            }
            return false;
        }

        // checked whether an object is an input element
        _isInputElement(e: any): boolean {
            if (e instanceof HTMLElement) {
                var m = (<HTMLElement>e).tagName.match(/^(input|select|textarea|button|a)$/i);
                return m && m.length > 0;
            }
            return false;
        }

        // get max supported element height
        // IE limits it to about 1.5M, FF to 6M, Chrome to 30M
        private static _maxCssHeight: number;
        private static _getMaxSupportedCssHeight() : number {
            if (!FlexGrid._maxCssHeight) {
                var maxHeight = 1e6,
                    testUpTo = 60e6,
                    div = document.createElement('div');
                div.style.visibility = 'hidden';
                document.body.appendChild(div);
                for (var test = maxHeight; test <= testUpTo; test += 500000) {
                    div.style.height = test + 'px';
                    if (div.offsetHeight != test) {
                        break;
                    }
                    maxHeight = test;
                }
                document.body.removeChild(div);
                FlexGrid._maxCssHeight = maxHeight;
            }
            return FlexGrid._maxCssHeight;
        }

        // IE/Chrome/Safari/FireFox handle RTL differently; this function
        // returns a value that indicates the RTL mode:
        // 'rev': reverse direction so origin is +max, end is zero (Chrome/Safari)
        // 'neg': switches signs, so origin is -max, end is zero (Firefox)
        // 'std': standard, origin is zero, end is +max (IE)
        static _rtlMode: string;
        private static _getRtlMode() : string {
            if (!FlexGrid._rtlMode) {
                var el = createElement(
                    '<div dir="rtl" style="visibility:hidden;width:100px;height:100px;overflow:auto">' +
                        '<div style="width:2000px;height:2000px"></div>' +
                    '</div>');

                document.body.appendChild(el);
                var sl = el.scrollLeft;
                el.scrollLeft = -1000;
                var sln = el.scrollLeft;
                document.body.removeChild(el);

                FlexGrid._rtlMode = sln < 0 ? 'neg' : sl > 0 ? 'rev' : 'std';
                //console.log('rtlMode: ' + FlexGrid._rtlMode);
            }
            return FlexGrid._rtlMode;
        }

        //#endregion
    }
}
