/**
 * Extension that provides an Excel-style filtering UI for @see:FlexGrid controls.
 */
module wijmo.grid.filter {
    'use strict';

    /**
     * Specifies types of column filter.
     */
    export enum FilterType {
        /** No filter. */
        None = 0,
        /** A filter based on two conditions. */
        Condition = 1,
        /** A filter based on a set of values. */
        Value = 2,
        /** A filter that combines condition and value filters. */
        Both = 3
    }

    /**
     * Implements an Excel-style filter for @see:FlexGrid controls.
     *
     * To enable filtering on a @see:FlexGrid control, create an instance 
     * of the @see:FlexGridFilter and pass the grid as a parameter to the 
     * constructor. For example:
     *
     * <pre>
     * // create FlexGrid
     * var flex = new wijmo.grid.FlexGrid('#gridElement');
     * // enable filtering on the FlexGrid
     * var filter = new wijmo.grid.filter.FlexGridFilter(flex);
     * </pre>
     *
     * Once this is done, a filter icon is added to the grid's column headers. 
     * Clicking the icon shows an editor where the user can edit the filter
     * conditions for that column.
     *
     * The @see:FlexGridFilter class depends on the <b>wijmo.grid</b> and 
     * <b>wijmo.input</b> modules.
     */
    export class FlexGridFilter {
        static _WJC_FILTER = 'wj-elem-filter';
        static _filterGlyph: HTMLElement;

        // members
        private _g: FlexGrid;
        private _filters: ColumnFilter[];
        private _filterColumns: string[];
        private _divEdt: HTMLElement;
        private _edtCol: Column;
        private _showIcons = true;
        private _showSort = true;
        private _defFilterType = FilterType.Both;

        /**
         * Initializes a new instance of the @see:FlexGridFilter class.
         *
         * @param grid The @see:FlexGrid to filter.
         */
        constructor(grid: FlexGrid) {

            // check dependencies
            var depErr = 'Missing dependency: FlexGridFilter requires ';
            assert(wijmo.grid != null, depErr + 'wijmo.grid.');
            assert(wijmo.input != null, depErr + 'wijmo.input.');

            // initialize filter
            this._filters = [];
            this._g = asType(grid, FlexGrid, false);
            this._g.formatItem.addHandler(this._formatItem.bind(this));
            this._g.itemsSourceChanged.addHandler(this.clear.bind(this));
            this._g.hostElement.addEventListener('mousedown', this._mouseDown.bind(this), true);

            // initialize column filters
            this._g.invalidate();
        }
        /**
         * Gets a reference to the @see:FlexGrid that owns this filter.
         */
        get grid(): FlexGrid {
            return this._g;
        }
        /**
         * Gets or sets an array containing the names or bindings of the columns
         * that have filters.
         *
         * Setting this property to null or to an empty array adds filters to 
         * all columns.
         */
        get filterColumns(): string[] {
            return this._filterColumns;
        }
        set filterColumns(value: string[]) {
            this._filterColumns = asArray(value);
            this.clear();
        }
        /**
         * Gets or sets a value indicating whether the @see:FlexGridFilter adds filter
         * editing buttons to the grid's column headers.
         *
         * If you set this property to false, then you are responsible for providing
         * a way for users to edit, clear, and apply the filters.
         */
        get showFilterIcons(): boolean {
            return this._showIcons;
        }
        set showFilterIcons(value: boolean) {
            if (value != this.showFilterIcons) {
                this._showIcons = asBoolean(value);
                if (this._g) {
                    this._g.invalidate();
                }
            }
        }
        /**
         * Gets or sets a value indicating whether the filter editor should include
         * sort buttons.
         *
         * By default, the editor shows sort buttons like Excel does. But since users
         * can sort columns by clicking their headers, sort buttons in the filter editor
         * may not be desirable in some circumstances.
         */
        get showSortButtons(): boolean {
            return this._showSort;
        }
        set showSortButtons(value: boolean) {
            this._showSort = asBoolean(value);
        }
        /**
         * Gets the filter for the given column.
         *
         * @param col The @see:Column that the filter applies to (or column name or index).
         * @param create Whether to create the filter if it does not exist.
         */
        getColumnFilter(col: any, create = true): ColumnFilter {

            // get the column by name or index, check type
            if (isString(col)) {
                col = this._g.columns.getColumn(col);
            } else if (isNumber(col)) {
                col = this._g.columns[col];
            }
            col = asType(col, Column);

            // look for the filter
            for (var i = 0; i < this._filters.length; i++) {
                if (this._filters[i].column == col) {
                    return this._filters[i];
                }
            }

            // not found, create one now
            if (create && col.binding) {
                var cf = new ColumnFilter(this, col);
                this._filters.push(cf);
                return cf;
            }

            // not found, not created
            return null;
        }
        /**
         * Gets or sets the default filter type to use.
         *
         * This value can be overridden in filters for specific columns.
         * For example, the code below creates a filter that filters by
         * conditions on all columns except the "ByValue" column:
         *
         * <pre>
         * var f = new wijmo.grid.filter.FlexGridFilter(flex);
         * f.defaultFilterType = wijmo.grid.filter.FilterType.Condition;
         * var col = flex.columns.getColumn('ByValue'),
         *     cf = f.getColumnFilter(col);
         * cf.filterType = wijmo.grid.filter.FilterType.Value;
         * </pre>
         */
        get defaultFilterType(): FilterType {
            return this._defFilterType;
        }
        set defaultFilterType(value: FilterType) {
            if (value != this.defaultFilterType) {
                this._defFilterType = asEnum(value, FilterType, false);
                this._g.invalidate();
                this.clear();
            }
        }
        /**
         * Gets or sets the current filter definition as a JSON string.
         */
        get filterDefinition(): string {
            var def = {
                defaultFilterType: this.defaultFilterType,
                filters: []
            }
            for (var i = 0; i < this._filters.length; i++) {
                var cf = this._filters[i];
                if (cf && cf.column && cf.column.binding) {
                    if (cf.conditionFilter.isActive) {
                        var cfc = cf.conditionFilter;
                        def.filters.push({
                            binding: cf.column.binding,
                            type: 'condition',
                            condition1: { operator: cfc.condition1.operator, value: cfc.condition1.value },
                            and: cfc.and,
                            condition2: { operator: cfc.condition2.operator, value: cfc.condition2.value }
                        });
                    } else if (cf.valueFilter.isActive) {
                        var cfv = cf.valueFilter;
                        def.filters.push({
                            binding: cf.column.binding,
                            type: 'value',
                            filterText: cfv.filterText,
                            showValues: cfv.showValues
                        });
                    }
                }
            }
            return JSON.stringify(def);
        }
        set filterDefinition(value: string) {
            var def = JSON.parse(asString(value));
            this.clear();
            this.defaultFilterType = def.defaultFilterType;
            for (var i = 0; i < def.filters.length; i++) {
                var cfs = def.filters[i],
                    col = this._g.columns.getColumn(cfs.binding),
                    cf = this.getColumnFilter(col, true);
                if (cf) {
                    switch (cfs.type) {
                        case 'condition':
                            var cfc = cf.conditionFilter;
                            cfc.condition1.value = col.dataType == DataType.Date // handle times/times: TFS 125144, 143453
                                ? changeType(cfs.condition1.value, col.dataType, null)
                                : cfs.condition1.value;
                            cfc.condition1.operator = cfs.condition1.operator;
                            cfc.and = cfs.and;
                            cfc.condition2.value = col.dataType == DataType.Date
                                ? changeType(cfs.condition2.value, col.dataType, null)
                                : cfs.condition2.value;
                            cfc.condition2.operator = cfs.condition2.operator;
                            break;
                        case 'value':
                            var cfv = cf.valueFilter;
                            cfv.filterText = cfs.filterText;
                            cfv.showValues = cfs.showValues;
                            break;
                    }
                }
            }
            this.apply();
        }
        /**
         * Shows the filter editor for the given grid column.
         *
         * @param col The @see:Column that contains the filter to edit.
         * @param ht A @see:HitTestInfo object containing the range of the cell that triggered the filter display.
         */
        editColumnFilter(col: any, ht?: HitTestInfo) {

            // remove current editor
            this.closeEditor();

            // get column by name or by reference
            col = isString(col)
                ? this._g.columns.getColumn(col)
                : asType(col, Column, false);

            // raise filterChanging event
            var e = new CellRangeEventArgs(this._g.cells, new CellRange(-1, col.index));
            this.onFilterChanging(e);
            if (e.cancel) {
                return;
            }
            e.cancel = true; // assume the changes will be canceled

            // get the filter and the editor
            var div = document.createElement('div'),
                flt = this.getColumnFilter(col),
                edt = new ColumnFilterEditor(div, flt, this.showSortButtons);
            addClass(div, 'wj-dropdown-panel');

            // handle RTL
            if (this._g._rtl) {
                div.dir = 'rtl';
            }

            // apply filter when it changes
            edt.filterChanged.addHandler(() => {
                e.cancel = false; // the changes were not canceled
                setTimeout(() => { // apply after other handlers have been called
                    if (!e.cancel) {
                        this.apply();
                    }
                });
            });

            // close editor when editor button is clicked
            edt.buttonClicked.addHandler(() => {
                this.closeEditor();
                this.onFilterChanged(e);
            });

            // close editor when it loses focus (changes are not applied)
            edt.lostFocus.addHandler(() => {
                setTimeout(() => {
                    var ctl = Control.getControl(this._divEdt);
                    if (ctl && !ctl.containsFocus()) {
                        this.closeEditor();
                    }
                }, 10); //200); // let others handle it first
            });

            // get the header cell to position editor
            var ch = this._g.columnHeaders,
                r = ht ? ht.row : ch.rows.length - 1,
                c = ht ? ht.col : col.index,
                rc = ch.getCellBoundingRect(r, c),
                hdrCell = <HTMLElement>document.elementFromPoint(rc.left + rc.width / 2, rc.top + rc.height / 2);
            hdrCell = <HTMLElement>closest(hdrCell, '.wj-cell');

            // show editor and give it focus
            if (hdrCell) {
                showPopup(div, hdrCell, false, false, false);
            } else {
                showPopup(div, rc);
            }
            edt.focus();

            // save reference to editor
            this._divEdt = div;
            this._edtCol = col;
        }
        /**
         * Closes the filter editor.
         */
        closeEditor() {
            if (this._divEdt) {
                hidePopup(this._divEdt, true); // remove editor from DOM
                var edt = Control.getControl(this._divEdt);
                if (edt) { // dispose of editor to avoid memory leaks
                    edt.dispose();
                }
                this._divEdt = null;
                this._edtCol = null;
            }
        }
        /**
         * Applies the current column filters to the grid.
         */
        apply() {
            var cv = this._g.collectionView;
            if (cv) {
                if (cv.filter) {
                    cv.refresh();
                } else {
                    cv.filter = this._filter.bind(this);
                }
            }

            // apply filter definition if the collectionView supports that
            var updateFilterDefinition = cv ? cv['updateFilterDefinition'] : null;
            if (isFunction(updateFilterDefinition)) {
                updateFilterDefinition.call(cv, this);
            }

            // and fire the event
            this.onFilterApplied();
        }
        /**
         * Clears all column filters.
         */
        clear() {
            if (this._filters.length) {
                this._filters = [];
                this.apply();
            }
        }
        /**
         * Occurs after the filter is applied.
         */
        filterApplied = new Event();
        /**
         * Raises the @see:filterApplied event.
         */
        onFilterApplied(e?: EventArgs) {
            this.filterApplied.raise(this, e);
        }
        /**
         * Occurs when a column filter is about to be edited by the user.
         *
         * Use this event to customize the column filter if you want to 
         * override the default settings for the filter.
         *
         * For example, the code below sets the operator used by the filter 
         * conditions to 'contains' if they are null:
         *
         * <pre>filter.filterChanging.addHandler(function (s, e) {
         *   var cf = filter.getColumnFilter(e.col);
         *   if (!cf.valueFilter.isActive && cf.conditionFilter.condition1.operator == null) {
         *     cf.filterType = wijmo.grid.filter.FilterType.Condition;
         *     cf.conditionFilter.condition1.operator = wijmo.grid.filter.Operator.CT;
         *   }
         * });</pre>
         */
        filterChanging = new Event();
        /**
         * Raises the @see:filterChanging event.
         */
        onFilterChanging(e: CellRangeEventArgs) {
            this.filterChanging.raise(this, e);
        }
        /**
         * Occurs after a column filter has been edited by the user.
         *
         * Use the event parameters to determine the column that owns
         * the filter and whether changes were applied or canceled.
         */
        filterChanged = new Event();
        /**
         * Raises the @see:filterChanged event.
         */
        onFilterChanged(e: CellRangeEventArgs) {
            this.filterChanged.raise(this, e);
        }

        // ** implementation

        // predicate function used to filter the CollectionView
        private _filter(item: any): boolean {
            for (var i = 0; i < this._filters.length; i++) {
                if (!this._filters[i].apply(item)) {
                    return false;
                }
            }
            return true;
        }

        // handle the formatItem event to add filter icons to the column header cells
        private _formatItem(sender: FlexGrid, e: FormatItemEventArgs) {

            // format only ColumnHeader elements
            if (e.panel.cellType == CellType.ColumnHeader) {

                // get column, binding column
                var g = this._g,
                    rng = g.getMergedRange(e.panel, e.row, e.col) || new CellRange(e.row, e.col),
                    col = g.columns[rng.col],
                    bcol = g._getBindingColumn(e.panel, e.row, col);

                // check that the row is valid for the filter icon
                if (rng.row2 == e.panel.rows.length - 1 || col != bcol) {

                    // get the filter for this column
                    var cf = this.getColumnFilter(bcol, this.defaultFilterType != FilterType.None);

                    // honor filterColumns property
                    if (this._filterColumns && this._filterColumns.indexOf(bcol.binding) < 0) {
                        cf = null;
                    }

                    // if we have a filter, show the icon
                    if (cf && cf.filterType != FilterType.None) {

                        // show filter glyph for this column
                        if (this._showIcons) {
                            if (!FlexGridFilter._filterGlyph) {
                                FlexGridFilter._filterGlyph = createElement(
                                    '<div class="' + FlexGridFilter._WJC_FILTER + '"><span class="wj-glyph-filter"></span></div>'
                                );
                            }
                            var cell = <HTMLElement>(e.cell.querySelector('div') || e.cell),
                                existingGlyph = cell.querySelector('.wj-glyph-filter');
                            if (!existingGlyph) {
                                cell.insertBefore(FlexGridFilter._filterGlyph.cloneNode(true), cell.firstChild);
                            }
                        }

                        // update filter classes if there is a filter
                        toggleClass(e.cell, 'wj-filter-on', cf.isActive);
                        toggleClass(e.cell, 'wj-filter-off', !cf.isActive);

                    } else {

                        // remove filter classes if there is no filter
                        removeClass(e.cell, 'wj-filter-on');
                        removeClass(e.cell, 'wj-filter-off');
                    }
                }
            }
        }

        // handle mouse down to show/hide the filter editor
        _mouseDown(e: MouseEvent) {
            if (!e.defaultPrevented && e.button == 0) { // start actions on left button only: TFS 114623
                if (closest(e.target, '.' + FlexGridFilter._WJC_FILTER)) {
                    var g = this._g,
                        ht = g.hitTest(e);
                    if (ht.panel == g.columnHeaders) {
                        var col = g.columns[ht.col],
                            bcol = g._getBindingColumn(ht.panel, ht.row, col);
                        if (this._divEdt && this._edtCol == bcol) {
                            this.closeEditor();
                        } else {
                            setTimeout(() => {
                                this.editColumnFilter(bcol, ht);
                            }, this._divEdt ? 100 : 0); // allow some time to close editors (TFS 117746)
                        }
                        //e.stopImmediatePropagation();
                        e.stopPropagation();
                        e.preventDefault();
                    }
                }
            }
        }
    }
}