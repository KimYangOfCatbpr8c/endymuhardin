/**
 * Contains components that provide OLAP functionality such as 
 * pivot tables and charts.
 *
 * The @see:PivotEngine class is responsible for summarizing 
 * raw data into pivot views.
 *
 * The @see:PivotPanel control provides a UI for editing the
 * pivot views by dragging fields into view lists and editing
 * their properties.
 *
 * The @see:PivotGrid control extends the @see:FlexGrid to 
 * display pivot tables with collapsible row and column 
 * groups.
 *
 * The @see:PivotChart control provides visual representations
 * of pivot tables with hierarchical axes.
 */
module wijmo.olap {
    'use strict';

    // globalization
    wijmo.culture.olap = wijmo.culture.olap || {};
    wijmo.culture.olap.PivotEngine = {
        grandTotal: 'Grand Total',
        subTotal: 'Subtotal'
    }

    /**
     * Specifies constants that define whether to include totals in the output table.
     */
    export enum ShowTotals {
        /**
         * Do not show any totals.
         */
        None,
        /**
         * Show grand totals.
         */
        GrandTotals,
        /**
         * Show subtotals and grand totals.
         */
        Subtotals
    }
    /**
     * Specifies constants that define calculations to be applied to cells in the output view.
     */
    export enum ShowAs {
        /**
         * Show plain aggregated values.
         */
        NoCalculation,
        /**
         * Show differences between each item and the item in the previous row.
         */
        DiffRow,
        /**
         * Show differences between each item and the item in the previous row as a percentage.
         */
        DiffRowPct,
        /**
         * Show differences between each item and the item in the previous column.
         */
        DiffCol,
        /**
         * Show differences between each item and the item in the previous column as a percentage.
         */
        DiffColPct
    }

    /**
     * Provides a user interface for interactively transforming regular data tables into Olap
     * pivot tables.
     *
     * Tabulates data in the @see:itemsSource collection according to lists of fields and 
     * creates the @see:pivotView collection containing the aggregated data.
     *
     * Pivot tables group data into one or more dimensions. The dimensions are represented
     * by rows and columns on a grid, and the data is stored in the grid cells.
     */
    export class PivotEngine {

        // property storage
        private _items: any; // any[] or ICollectionView
        private _cv: collections.ICollectionView;
        private _autoGenFields = true;
        private _allowFieldEditing = true;
        private _showRowTotals = ShowTotals.GrandTotals;
        private _showColumnTotals = ShowTotals.GrandTotals;
        private _totalsBefore: boolean;
        private _showZeros: boolean;
        private _updating = 0;
        private _dirty: boolean;
        private _toInv;
        private _cntTotal = 0;
        private _cntFiltered = 0;
        private _tallies: any;
        private _keys: any;
        private _colBindings: string[];
        private _pivotView: collections.ICollectionView;
        private _defaultFilterType: grid.filter.FilterType;
        private _async = true;
        private _batchStart: number;
        private _toUpdateTallies: number;
        private _activeFilterFields: PivotField[];

        // pivot field collections
        private _fields: PivotFieldCollection;
        private _rowFields: PivotFieldCollection;
        private _columnFields: PivotFieldCollection;
        private _valueFields: PivotFieldCollection;
        private _filterFields: PivotFieldCollection;
        /*private*/ _viewLists: PivotFieldCollection[];

        // batch size/delay for async processing
        static _BATCH_SIZE = 10000;
        static _BATCH_TIMEOUT = 0;
        static _BATCH_DELAY = 100;

        // serializable properties
        static _props = [
            'showZeros',
            'showRowTotals',
            'showColumnTotals',
            'totalsBeforeData',
            'defaultFilterType'
        ];

        /**
         * Initializes a new instance of the @see:PivotEngine class.
         *
         * @param options JavaScript object containing initialization data for the field.
         */
        constructor(options?: any) {

            // create output view
            this._pivotView = new PivotCollectionView(this);

            // create main field list
            this._fields = new PivotFieldCollection(this);

            // create pivot field lists
            this._rowFields = new PivotFieldCollection(this);
            this._columnFields = new PivotFieldCollection(this);
            this._valueFields = new PivotFieldCollection(this);
            this._filterFields = new PivotFieldCollection(this);

            // create array of pivot field lists
            this._viewLists = [
                this._rowFields, this._columnFields, this._valueFields, this._filterFields
            ];

            // listen to changes in the field lists
            var handler = this._fieldListChanged.bind(this);
            this._fields.collectionChanged.addHandler(handler);
            for (var i = 0; i < this._viewLists.length; i++) {
                this._viewLists[i].collectionChanged.addHandler(handler);
            }

            // allow both filter types by default
            this._defaultFilterType = grid.filter.FilterType.Both;

            // apply initialization options
            if (options) {
                copy(this, options);
            }
        }

        // ** object model

        /**
         * Gets or sets the array or @see:ICollectionView that contains the raw data.
         */
        get itemsSource(): any {
            return this._items;
        }
        set itemsSource(value: any) {
            if (this._items != value) {

                // unbind current collection view
                if (this._cv) {
                    this._cv.collectionChanged.removeHandler(this._cvCollectionChanged, this);
                    this._cv = null;
                }

                // save new data source and collection view
                this._items = value;
                this._cv = asCollectionView(value);

                // bind new collection view
                if (this._cv != null) {
                    this._cv.collectionChanged.addHandler(this._cvCollectionChanged, this);
                }

                // auto-generate fields and refresh
                this.deferUpdate(() => {
                    if (this.autoGenerateFields) {
                        this._generateFields();
                    }
                });

                // raise itemsSourceChanged
                this.onItemsSourceChanged();
            }
        }
        /**
         * Gets the @see:ICollectionView that contains the raw data.
         */
        get collectionView(): collections.ICollectionView {
            return this._cv;
        }
        /**
         * Gets the @see:ICollectionView containing the output pivot view.
         */
        get pivotView(): collections.ICollectionView {
            return this._pivotView;
        }
        /**
         * Gets or sets a value that determines whether the output @see:pivotView
         * should include rows containing subtotals or grand totals.
         */
        get showRowTotals(): ShowTotals {
            return this._showRowTotals;
        }
        set showRowTotals(value: ShowTotals) {
            if (value != this.showRowTotals) {
                this._showRowTotals = asEnum(value, ShowTotals);
                this.onViewDefinitionChanged();
                this.invalidate();
            }
        }
        /**
         * Gets or sets a value that determines whether the output @see:pivotView
         * should include columns containing subtotals or grand totals.
         */
        get showColumnTotals(): ShowTotals {
            return this._showColumnTotals;
        }
        set showColumnTotals(value: ShowTotals) {
            if (value != this.showColumnTotals) {
                this._showColumnTotals = asEnum(value, ShowTotals);
                this.onViewDefinitionChanged();
                this.invalidate();
            }
        }
        /**
         * Gets or sets a value that determines whether row and column totals
         * should be displayed before or after regular data rows and columns.
         *
         * If this value is set to true, total rows appear above data rows
         * and total columns appear on the left of regular data columns.
         */
        get totalsBeforeData(): boolean {
            return this._totalsBefore;    
        }
        set totalsBeforeData(value: boolean) {
            if (value != this._totalsBefore) {
                this._totalsBefore = asBoolean(value);
                this.onViewDefinitionChanged();
                this.invalidate();
            }
        }
        /**
         * Gets or sets a value that determines whether the Olap output table
         * should use zeros to indicate the missing values.
         */
        get showZeros(): boolean {
            return this._showZeros;
        }
        set showZeros(value: boolean) {
            if (value != this._showZeros) {
                this._showZeros = asBoolean(value);
                this.onViewDefinitionChanged();
                this.invalidate();
            }
        }
        /**
         * Gets or sets the default filter type (by value or by condition).
         */
        get defaultFilterType(): grid.filter.FilterType {
            return this._defaultFilterType;
        }
        set defaultFilterType(value: grid.filter.FilterType) {
            this._defaultFilterType = asEnum(value, grid.filter.FilterType);
        }
        /**
         * Gets or sets a value that determines whether the engine should generate fields 
         * automatically based on the @see:itemsSource.
         */
        get autoGenerateFields(): boolean {
            return this._autoGenFields;
        }
        set autoGenerateFields(value: boolean) {
            this._autoGenFields = asBoolean(value);
        }
        /**
         * Gets or sets a value that determines whether users should be allowed to edit
         * the properties of the @see:PivotField objects owned by this @see:PivotEngine.
         */
        get allowFieldEditing(): boolean {
            return this._allowFieldEditing;
        }
        set allowFieldEditing(value: boolean) {
            this._allowFieldEditing = asBoolean(value);
        }
        /**
         * Gets the list of @see:PivotField objects exposed by the data source.
         *
         * This list is created automatically whenever the @see:itemsSource property is set.
         *
         * Pivot views are defined by copying fields from this list to the lists that define 
         * the view: @see:valueFields, @see:rowFields, @see:columnFields, and @see:filterFields.
         *
         * For example, the code below assigns a data source to the @see:PivotEngine and 
         * then defines a view by adding fields to the @see:rowFields, @see:columnFields, and 
         * @see:valueFields lists.
         *
         * <pre>// create pivot engine
         * var pe = new wijmo.olap.PivotEngine();
         *
         * // set data source (populates fields list)
         * pe.itemsSource = this.getRawData();
         *
         * // prevent updates while building Olap view
         * pe.beginUpdate();
         *
         * // show countries in rows
         * pe.rowFields.push('Country');
         *
         * // show categories and products in columns
         * pe.columnFields.push('Category');
         * pe.columnFields.push('Product');
         *
         * // show total sales in cells
         * pe.valueFields.push('Sales');
         *
         * // done defining the view
         * pe.endUpdate();</pre>
         */
        get fields(): PivotFieldCollection {
            return this._fields;
        }
        /**
         * Gets the list of @see:PivotField objects that define the fields shown as rows in the output table.
         */
        get rowFields(): PivotFieldCollection {
            return this._rowFields;
        }
        /**
         * Gets the list of @see:PivotField objects that define the fields shown as columns in the output table.
         */
        get columnFields(): PivotFieldCollection {
            return this._columnFields;
        }
        /**
         * Gets the list of @see:PivotField objects that define the fields used as filters.
         * 
         * Fields on this list do not appear in the output table, but are still used for filtering the input data.
         */
        get filterFields(): PivotFieldCollection {
            return this._filterFields;
        }
        /**
         * Gets the list of @see:PivotField objects that define the fields summarized in the output table.
         */
        get valueFields(): PivotFieldCollection {
            return this._valueFields;
        }
        /**
         * Gets or sets the current pivot view definition as a JSON string.
         *
         * This property is typically used to persist the current view as 
         * an application setting.
         *
         * For example, the code below implements two functions that save
         * and load view definitions using local storage:
         *
         * <pre>// save/load views
         * function saveView() {
         *   localStorage.viewDefinition = pivotEngine.viewDefinition;
         * }
         * function loadView() {
         *   pivotEngine.viewDefinition = localStorage.viewDefinition;
         * }</pre>
         */
        get viewDefinition(): string {

            // save options and view
            var viewDef = {
                showZeros: this.showZeros,
                showColumnTotals: this.showColumnTotals,
                showRowTotals: this.showRowTotals,
                defaultFilterType: this.defaultFilterType,
                totalsBeforeData: this.totalsBeforeData,
                fields: [],
                rowFields: this._getFieldCollectionProxy(this.rowFields),
                columnFields: this._getFieldCollectionProxy(this.columnFields),
                filterFields: this._getFieldCollectionProxy(this.filterFields),
                valueFields: this._getFieldCollectionProxy(this.valueFields)
            };

            // save field definitions
            for (var i = 0; i < this.fields.length; i++) {
                var fld = <PivotField>this.fields[i],
                    fieldDef: any = {
                        binding: fld.binding,
                        header: fld.header,
                        dataType: fld.dataType,
                        aggregate: fld.aggregate,
                        showAs: fld.showAs,
                        descending: fld.descending,
                        format: fld.format,
                        width: fld.width,
                        isContentHtml: fld.isContentHtml
                    };
                if (fld.weightField) {
                    fieldDef.weightField = fld.weightField._getName();
                }
                if (fld.filter.isActive) {
                    fieldDef.filter = this._getFilterProxy(fld);
                }
                viewDef.fields.push(fieldDef);
            }

            // done
            return JSON.stringify(viewDef);
        }
        set viewDefinition(value: string) {
            var viewDef = JSON.parse(value);
            if (viewDef) {
                this.deferUpdate(() => {

                    // load options
                    this._copyProps(this, viewDef, PivotEngine._props);

                    // load fields
                    this.fields.clear();
                    for (var i = 0; i < viewDef.fields.length; i++) {
                        var fldDef: any = viewDef.fields[i],
                            f = new PivotField(this, fldDef.binding, fldDef.header);
                        f._autoGenerated = true; // treat as auto-generated (delete when auto-generating next batch)
                        this._copyProps(f, fldDef, PivotField._props);
                        if (fldDef.filter) {
                            this._setFilterProxy(f, fldDef.filter);
                        }
                        this.fields.push(f);
                    }

                    // load field weights
                    for (var i = 0; i < viewDef.fields.length; i++) {
                        var fldDef: any = viewDef.fields[i];
                        if (isString(fldDef.weightField)) {
                            this.fields[i].weightField = this.fields.getField(fldDef.weightField);
                        }
                    }

                    // load view fields
                    this._setFieldCollectionProxy(this.rowFields, viewDef.rowFields);
                    this._setFieldCollectionProxy(this.columnFields, viewDef.columnFields);
                    this._setFieldCollectionProxy(this.filterFields, viewDef.filterFields);
                    this._setFieldCollectionProxy(this.valueFields, viewDef.valueFields);
                });
            }
        }
        /**
         * Gets a value that determines whether a pivot view is currently defined.
         *
         * A pivot view is defined if the @see:valueFields list is not empty and 
         * either the @see:rowFields or @see:columnFields lists are not empty.
         */
        get isViewDefined(): boolean {
            return this._valueFields.length > 0 && (this._rowFields.length > 0 || this._columnFields.length > 0);
        }
        /**
         * Suspends the refresh processes until next call to the @see:endUpdate.
         */
        beginUpdate() {
            this.cancelPendingUpdates();
            this._updating++;
        }
        /**
         * Resumes refresh processes suspended by calls to @see:beginUpdate.
         */
        endUpdate() {
            this._updating--;
            if (this._updating <= 0) {
                this.onViewDefinitionChanged();
                this.refresh();
            }
        }
        /**
         * Gets a value that indicates whether the engine is currently being updated.
         */
        get isUpdating(): boolean {
            return this._updating > 0;
        }
        /**
         * Executes a function within a @see:beginUpdate/@see:endUpdate block.
         *
         * The control will not be updated until the function has been executed.
         * This method ensures @see:endUpdate is called even if the function throws
         * an exception.
         *
         * @param fn Function to be executed. 
         */
        deferUpdate(fn: Function) {
            try {
                this.beginUpdate();
                fn();
            } finally {
                this.endUpdate();
            }
        }
        /**
         * Summarizes the data and updates the output @see:pivotView.
         *
         * @param force Refresh even while updating (see @see:beginUpdate).
         */
        refresh(force = false) {
            if (!this.isUpdating || force) {
                this._updateView();
            }
        }
        /**
         * Invalidates the view causing an asynchronous refresh.
         */
        invalidate() {
            if (this._toInv) {
                this._toInv = clearTimeout(this._toInv);
            }
            if (!this.isUpdating) {
                this._toInv = setTimeout(() => {
                    this.refresh();
                }, 10);
            }
        }
        /** 
         * Gets or sets a value that determines whether view updates should be generated asynchronously.
         * 
         * This property is set to true by default, so summaries over large data sets are performed
         * asynchronously to prevent stopping the UI thread.
         */
        get async(): boolean {
            return this._async;
        }
        set async(value: boolean) {
            if (value != this._async) {
                this.cancelPendingUpdates();
                this._async = asBoolean(value);
            }
        }
        /**
         * Cancels any pending asynchronous view updates.
         */
        cancelPendingUpdates() {
            if (this._toUpdateTallies) {
                clearTimeout(this._toUpdateTallies);
                this._toUpdateTallies = null;
            }
        }
        /**
         * Gets an array containing the records summarized by a property in the @see:pivotView list.
         * 
         * @param item Data item in the @see:pivotView list.
         * @param binding Name of the property being summarized.
         */
        getDetail(item: any, binding: string) {
            var rowKey = item ? <_PivotKey>item[_PivotKey._ROW_KEY_NAME] : null,
                colKey = this._getKey(binding),
                items = this.collectionView.items,
                arr = [];
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (this._applyFilter(item) &&
                    (rowKey == null || rowKey.matchesItem(item)) &&
                    (colKey == null || colKey.matchesItem(item))) {
                    arr.push(item);
                }
            }
            return arr;
        }
        /**
         * Shows a settings dialog where users can edit a field's settings.
         *
         * @param field @see:PivotField to be edited.
         */
        editField(field: PivotField) {
            if (this.allowFieldEditing) {
                var edt = new PivotFieldEditor(document.createElement('div'), {
                    field: field
                });
                var dlg = new input.Popup(document.createElement('div'), {
                    content: edt.hostElement
                });
                dlg.show(true);
            }
        }
        /**
         * Removes a field from the current view.
         *
         * @param field @see:PivotField to be removed.
         */
        removeField(field: PivotField) {
            for (var i = 0; i < this._viewLists.length; i++) {
                var list = this._viewLists[i],
                    index = list.indexOf(field);
                if (index > -1) {
                    list.removeAt(index);
                    return;
                }
            }
        }

        /**
         * Occurs after the value of the @see:itemsSource property changes.
         */
        itemsSourceChanged = new Event();
        /**
         * Raises the @see:itemsSourceChanged event.
         */
        onItemsSourceChanged(e?: EventArgs) {
            this.itemsSourceChanged.raise(this, e);
        }
        /**
         * Occurs after the view definition changes.
         */
        viewDefinitionChanged = new Event();
        /**
         * Raises the @see:viewDefinitionChanged event.
         */
        onViewDefinitionChanged(e?: EventArgs) {
            if (!this._updating) {
                this.viewDefinitionChanged.raise(this, e);
            }
        }
        /**
         * Occurs when the engine starts updating the @see:pivotView list.
         */
        updatingView = new Event();
        /**
         * Raises the @see:updatingView event.
         * 
         * @param e @see:ProgressEventArgs that provides the event data.
         */
        onUpdatingView(e: ProgressEventArgs) {
            this.updatingView.raise(this, e);
        }
        /**
         * Occurs after the engine has finished updating the @see:pivotView list.
         */
        updatedView = new Event();
        /**
         * Raises the @see:updatedView event.
         */
        onUpdatedView(e?: EventArgs) {
            this.updatedView.raise(this, e);
        }

        // ** implementation

        // method used in JSON-style initialization
        _copy(key: string, value: any): boolean {
            switch (key) {
                case 'fields':
                    this.fields.clear();
                    var arr = asArray(value);
                    for (var i = 0; i < arr.length; i++) {
                        var val = arr[i];
                        if (!isUndefined(val.binding)) {
                            var fld = new PivotField(this, val.binding);
                            copy(fld, arr[i]);
                        } else if (isString(val)) {
                            var fld = new PivotField(this, val);
                        }
                        this.fields.push(fld);
                    }
                    return true;
                case 'rowFields':
                case 'columnFields':
                case 'valueFields':
                case 'filterFields':
                    this[key].clear();
                    var arr = asArray(value);
                    for (var i = 0; i < arr.length; i++) {
                        var fld = this.fields.getField(arr[i]);
                        this[key].push(fld);
                    }
                    return true;
            }
            return false;
        }

        // get a pivot key from its string representation
        _getKey(keyString: string): _PivotKey {
            return <_PivotKey>this._keys[keyString];
        }

        // get the subtotal level of a row based on its key or item index
        _getRowLevel(key: any): number {

            // convert index into row key
            if (isNumber(key)) {
                var item = this._pivotView.items[key];
                key = item ? item[_PivotKey._ROW_KEY_NAME] : null;
            }

            // return subtotal level
            return !key || key._fieldCount == this.rowFields.length
                ? -1 // not a subtotal
                : key._fieldCount; // level 0 is grand total, etc
        }

        // get the subtotal level of a column based on its key, binding, or column index
        _getColLevel(key: any): number {

            // convert column index into column key
            if (isNumber(key)) {
                key = this._colBindings[key];
            }

            // convert binding into column key
            if (isString(key)) {
                key = this._getKey(key);
            }

            // sanity
            assert(key == null || key instanceof _PivotKey, 'invalid parameter in call to _getColLevel');

            // return subtotal level
            return !key || key._fieldCount == this.columnFields.length
                ? -1 // not a subtotal
                : key._fieldCount; // level 0 is grand total, etc
        }

        // apply filter to a given object
        private _applyFilter(item: any) {

            // scan all fields that have active filters
            var fields = this._activeFilterFields;
            for (var i = 0; i < fields.length; i++) {
                var f = (<PivotField>fields[i]).filter;
                if (!f.apply(item)) {
                    return false;
                }
            }

            // value passed all filters
            return true;
        }

        // refresh _tallies object used to build the output pivotView
        private _updateView() {

            // benchmark
            //console.time('view update');

            // clear any on-going updates
            this.cancelPendingUpdates();

            // count items and filtered items
            this._cntTotal = this._cntFiltered = 0;

            // clear tallies
            this._tallies = {};
            this._keys = {};

            // keep track of active filter fields (optimization)
            this._activeFilterFields = [];
            var lists = this._viewLists;
            for (var i = 0; i < lists.length; i++) {
                var list = lists[i];
                for (var j = 0; j < list.length; j++) {
                    var f = <PivotField>list[j];
                    if (f.filter.isActive) {
                        this._activeFilterFields.push(f);
                    }
                }
            }

            // tally all objects in data source
            if (this.isViewDefined && this._cv && this._cv.items) {
                this._batchStart = Date.now();
                this._updateTallies(0);
            } else {
                this._updatePivotView();
            }
        }

        // async tally update
        private _updateTallies(startIndex: number) {
            var arr = this._cv.items,
                arrLen = arr.length,
                rowNodes = new _PivotNode(this._rowFields, 0, null, -1, null);

            // set loop start and step variables to control key size and subtotal creation
            var rkLen = this._rowFields.length,
                rkStart = this._showRowTotals == ShowTotals.None ? rkLen : 0,
                rkStep = this._showRowTotals == ShowTotals.GrandTotals ? Math.max(1, rkLen) : 1,
                ckLen = this._columnFields.length,
                ckStart = this._showColumnTotals == ShowTotals.None ? ckLen : 0,
                ckStep = this._showColumnTotals == ShowTotals.GrandTotals ? Math.max(1, ckLen) : 1,
                vfLen = this._valueFields.length;

            // scan through the items
            for (var index = startIndex; index < arrLen; index++) {

                // let go of the thread for a while
                if (this._async &&
                    index - startIndex >= PivotEngine._BATCH_SIZE &&
                    Date.now() - this._batchStart > PivotEngine._BATCH_DELAY) {
                    this._toUpdateTallies = setTimeout(() => {
                        this.onUpdatingView(new ProgressEventArgs(Math.round(index / arr.length * 100)));
                        this._batchStart = Date.now();
                        this._updateTallies(index);
                    }, PivotEngine._BATCH_TIMEOUT);
                    return;
                }

                // count elements
                this._cntTotal++;

                // apply filter
                var item = arr[index];
                if (!this._activeFilterFields.length || this._applyFilter(item)) {

                    // count filtered items from raw data source
                    this._cntFiltered++;

                    // get/create row tallies
                    for (var i = rkStart; i <= rkLen; i += rkStep, nd = nd.parent) {
                        var nd = rowNodes.getNode(this._rowFields, i, null, -1, item),
                            rowKey = nd.key,
                            //rowKey = new _PivotKey(this._rowFields, i, null, -1, item),
                            rowKeyId = rowKey.toString(),
                            rowTallies = this._tallies[rowKeyId];
                        if (!rowTallies) {
                            this._keys[rowKeyId] = rowKey;
                            this._tallies[rowKeyId] = rowTallies = {};
                        }

                        // get/create column tallies
                        for (var j = ckStart; j <= ckLen; j += ckStep) {
                            for (var k = 0; k < vfLen; k++) {
                                var colNodes = nd.tree.getNode(this._columnFields, j, this._valueFields, k, item),
                                    colKey = colNodes.key,
                                    //colKey = new _PivotKey(this._columnFields, j, this._valueFields, k, item),
                                    colKeyId = colKey.toString(),
                                    tally = rowTallies[colKeyId];
                                if (!tally) {
                                    this._keys[colKeyId] = colKey;
                                    tally = rowTallies[colKeyId] = new _Tally();
                                }

                                // get values
                                var vf = this._valueFields[k],
                                    value = vf._getValue(item, false),
                                    weight = vf._weightField ? vf._getWeight(item) : null;

                                // update tally
                                tally.add(value, weight);
                            }
                        }
                    }
                }
            }

            // done with tallies, update view
            this._toUpdateTallies = null;
            this._updatePivotView();
        }

        // refresh the output pivotView from the tallies
        private _updatePivotView() {
            this._pivotView.deferUpdate(() => {

                // start updating the view
                this.onUpdatingView(new ProgressEventArgs(100));

                // clear table and sort
                var arr = this._pivotView.sourceCollection;
                arr.length = 0;

                // get sorted row keys
                var rowKeys = {};
                for (var rk in this._tallies) {
                    rowKeys[rk] = true;
                }

                // get sorted column keys
                var colKeys = {};
                for (var rk in this._tallies) {
                    var row = this._tallies[rk];
                    for (var ck in row) {
                        colKeys[ck] = true;
                    }
                }

                // build output items
                var sortedRowKeys = this._getSortedKeys(rowKeys),
                    sortedColKeys = this._getSortedKeys(colKeys);
                for (var r = 0; r < sortedRowKeys.length; r++) {
                    var rowKey = sortedRowKeys[r],
                        row = this._tallies[rowKey],
                        item = {};
                    item[_PivotKey._ROW_KEY_NAME] = this._getKey(rowKey);// rowKey;
                    for (var c = 0; c < sortedColKeys.length; c++) {

                        // get the value
                        var colKey = sortedColKeys[c],
                            tally = <_Tally>row[colKey],
                            pk = this._getKey(colKey),
                            value = tally ? tally.getAggregate(pk.aggregate) : null;

                        // hide zeros if 'showZeros' is true
                        if (value == 0 && !this._showZeros) {
                            value = null;
                        }

                        // store the value
                        item[colKey] = value;
                    }
                    arr.push(item);
                }

                // save column keys so we can access them by index
                this._colBindings = sortedColKeys;

                // honor 'showAs' settings
                this._updateFieldValues(arr);

                // remove any sorts
                this._pivotView.sortDescriptions.clear();

                // done updating the view
                this.onUpdatedView();
                
                // benchmark
                //console.timeEnd('view update');
            });
        }

        // gets a sorted array of PivotKey ids
        private _getSortedKeys(obj: any): string[] {
            return Object.keys(obj).sort((id1, id2) => {
                return this._keys[id1].compareTo(this._keys[id2]);
            });
        }

        // update field values to honor showAs property
        private _updateFieldValues(arr: any[]) {

            // scan value fields
            var vfl = this.valueFields.length;
            for (var vf = 0; vf < vfl; vf++) {
                var fld = this.valueFields[vf];
                switch (fld.showAs) {

                    // row differences
                    case ShowAs.DiffRow:
                    case ShowAs.DiffRowPct:
                        for (var col = vf; col < this._colBindings.length; col += vfl) {
                            for (var row = arr.length - 1; row >= 0; row--) {
                                var item = arr[row],
                                    binding = this._colBindings[col],
                                    diff = this._getRowDifference(arr, row, col, fld.showAs);
                                //console.log('setting item ' + i + '[' + fld.binding + '] to ' + diff);
                                item[binding] = diff;
                            }
                        }
                        break;

                    // column differences
                    case ShowAs.DiffCol:
                    case ShowAs.DiffColPct:
                        for (var row = 0; row < arr.length; row++) {
                            for (var col = this._colBindings.length - vfl + vf; col >= 0; col -= vfl) {
                                var item = arr[row],
                                    binding = this._colBindings[col],
                                    diff = this._getColumnDifference(arr, row, col, fld.showAs);
                                //console.log('setting item ' + i + '[' + fld.binding + '] to ' + diff);
                                item[binding] = diff;
                            }
                        }
                        break;
                }
            }
        }

        // gets the difference between an item and the item in the previous row
        private _getRowDifference(arr: any[], row: number, col: number, showAs: ShowAs): number {
            
            // grand total? no previous item, no diff.
            var level = this._getRowLevel(row);
            if (level == 0) {
                return null;
            }

            // get previous item at the same level
            var grpFld = this.rowFields.length - 2;
            for (var p = row - 1; p >= 0; p--) {
                var plevel = this._getRowLevel(p);
                if (plevel == level) {

                    // honor groups even without subtotals 
                    if (grpFld > -1 && level < 0 && this._showRowTotals != ShowTotals.Subtotals) {
                        var k = arr[row].$rowKey,
                            kp = arr[p].$rowKey;
                        if (k.values[grpFld] != kp.values[grpFld]) {
                            return null;
                        }
                    }

                    // compute difference
                    var binding = this._colBindings[col],
                        val = arr[row][binding],
                        pval = arr[p][binding],
                        diff = val - pval;
                    if (showAs == ShowAs.DiffRowPct) {
                        diff /= pval;
                    }

                    // done
                    return diff;
                }

                // not found...
                if (plevel > level) break;
            }

            // no previous item? null
            return null;
        }

        // gets the difference between an item and the item in the previous column
        private _getColumnDifference(arr: any[], row: number, col: number, showAs: ShowAs): number {
            
            // grand total? no previous item, no diff.
            var level = this._getColLevel(col);
            if (level == 0) {
                return null;
            }

            // get previous item at the same level
            var vfl = this.valueFields.length,
                grpFld = this.columnFields.length - 2
            for (var p = col - vfl; p >= 0; p -= vfl) {
                var plevel = this._getColLevel(p);
                if (plevel == level) {

                    // honor groups even without subtotals
                    if (grpFld > -1 && level < 0 && this._showColumnTotals != ShowTotals.Subtotals) {
                        var k = this._getKey(this._colBindings[col]),
                            kp = this._getKey(this._colBindings[p]);
                        if (k.values[grpFld] != kp.values[grpFld]) {
                            return null;
                        }
                    }

                    // compute difference
                    var item = arr[row],
                        val = item[this._colBindings[col]],
                        pval = item[this._colBindings[p]],
                        diff = val - pval;
                    if (showAs == ShowAs.DiffColPct) {
                        diff /= pval;
                    }

                    // done
                    return diff;
                }

                // not found...
                if (plevel > level) break;
            }

            // no previous item? null
            return null;
        }

        // generate fields for the current itemsSource
        private _generateFields() {
            var field: PivotField;

            // empty view lists
            for (var i = 0; i < this._viewLists.length; i++) {
                this._viewLists[i].length = 0;
            }

            // remove old auto-generated columns
            for (var i = 0; i < this.fields.length; i++) {
                field = this.fields[i];
                if (field._autoGenerated) {
                    this.fields.removeAt(i);
                    i--;
                }
            }

            // get first item to infer data types
            var item = null,
                cv = this.collectionView;
            if (cv && cv.sourceCollection && cv.sourceCollection.length) {
                item = cv.sourceCollection[0];
            }

            // auto-generate new fields
            // (skipping unwanted types: array and object)
            if (item && this.autoGenerateFields) {
                for (var key in item) {
                    if (isPrimitive(item[key])) {
                        field = new PivotField(this, key);
                        field._autoGenerated = true;
                        field.dataType = getType(item[key]);
                        if (field.dataType == DataType.Number) {
                            field.aggregate = Aggregate.Sum;
                            field.format = 'n0';
                        } else if (field.dataType == DataType.Date) {
                            field.aggregate = Aggregate.Cnt;
                            field.format = 'd';
                        } else {
                            field.aggregate = Aggregate.Cnt;
                        }
                        this.fields.push(field);
                    }
                }
            }

            // update missing column types
            if (item) {
                for (var i = 0; i < this.fields.length; i++) {
                    field = this.fields[i];
                    if (field.dataType == null && field._binding) {
                        field.dataType = getType(field._binding.getValue(item));
                    }
                }
            }
        }

        // handle changes to data source
        private _cvCollectionChanged(sender, e: collections.NotifyCollectionChangedEventArgs) {
            this.invalidate();
        }

        // handle changes to field lists
        private _fieldListChanged(s: any, e: collections.NotifyCollectionChangedEventArgs) {
            if (e.action == collections.NotifyCollectionChangedAction.Add) {
                var arr = <PivotFieldCollection>s;
            
                // rule 1: prevent duplicate items within a list
                for (var i = 0; i < arr.length - 1; i++) {
                    for (var j = i + 1; j < arr.length; j++) {
                        if (arr[i].header == arr[j].header) {
                            arr.removeAt(j);
                            j--;
                        }
                    }
                }

                // rule 2: if a field was added to one of the view lists, make sure it is also on the main list
                // and that it only appears once in the view lists
                if (arr != this._fields) {
                    var index = this._fields.indexOf(e.item);
                    if (index < 0) { // not on the main list, remove from view list
                        arr.removeAt(e.index);
                    } else { // remove duplicates
                        for (var i = 0; i < this._viewLists.length; i++) {
                            if (this._viewLists[i] != arr) {
                                var list = this._viewLists[i];
                                index = list.indexOf(e.item);
                                if (index > -1) {
                                    list.removeAt(index);
                                }
                            }
                        }
                    }
                }

                // rule 3: honor maxItems
                if (isNumber(arr.maxItems) && arr.maxItems > -1) {
                    while (arr.length > arr.maxItems) {
                        var index = arr.length - 1;
                        if (arr[index] == e.item && index > 0) {
                            index--;
                        }
                        arr.removeAt(index);
                    }
                }
            }

            // notify and be done
            this.onViewDefinitionChanged();
            this.invalidate();
        }

        // handle changes to field properties
        _fieldPropertyChanged(field: PivotField, e: PropertyChangedEventArgs) {

            // raise viewDefinitionChanged
            this.onViewDefinitionChanged();

            // if the field is not active, we're done
            if (!field.isActive) {
                return;
            }

            // changing the width of a field only requires a view refresh
            // (no need to re-summarize)
            if (e.propertyName == 'width' || e.propertyName == 'wordWrap') {
                this._pivotView.refresh();
                return;
            }

            // changing the format of a value field only requires a view refresh 
            // (no need to re-summarize)
            if (e.propertyName == 'format' && this.valueFields.indexOf(field) > -1) {
                this._pivotView.refresh();
                return;
            }

            // changing the aggregate or showAs requires view generation 
            // (no need to re-summarize)
            if (e.propertyName == 'aggregate' || e.propertyName == 'showAs') {
                if (this.valueFields.indexOf(field) > -1 && !this.isUpdating) {
                    this._updatePivotView();
                }
                return;
            }

            // refresh the whole view (summarize and regenerate)
            this.invalidate();
        }

        // copy properties from a source object to a destination object
        _copyProps(dst: any, src: any, props: string[]) {
            for (var i = 0; i < props.length; i++) {
                var prop = props[i];
                if (src[prop] != null) {
                    dst[prop] = src[prop];
                }
            }
        }

        // persist view field collections
        private _getFieldCollectionProxy(arr: PivotFieldCollection) {
            var proxy: any = {
                items: []
            };
            if (isNumber(arr.maxItems) && arr.maxItems > -1) {
                proxy.maxItems = arr.maxItems;
            }
            for (var i = 0; i < arr.length; i++) {
                var fld = <PivotField>arr[i];
                proxy.items.push(fld.header);
            }
            return proxy;
        }
        private _setFieldCollectionProxy(arr: PivotFieldCollection, proxy: any) {
            arr.clear();
            arr.maxItems = isNumber(proxy.maxItems) ? proxy.maxItems : null;
            for (var i = 0; i < proxy.items.length; i++) {
                arr.push(proxy.items[i]);
            }
        }

        // persist field filters
        private _getFilterProxy(fld: PivotField): any {
            var flt = fld.filter;

            // condition filter
            if (flt.conditionFilter.isActive) {
                var cf = flt.conditionFilter;
                return {
                    type: 'condition',
                    condition1: { operator: cf.condition1.operator, value: cf.condition1.value },
                    and: cf.and,
                    condition2: { operator: cf.condition2.operator, value: cf.condition2.value }
                };
            }

            // value filter
            if (flt.valueFilter.isActive) {
                var vf = flt.valueFilter;
                return {
                    type: 'value',
                    filterText: vf.filterText,
                    showValues: vf.showValues
                }
            }

            // no filter!
            assert(false, 'inactive filters shouldn\'t be persisted.');
            return null;
        }
        private _setFilterProxy(fld: PivotField, proxy: any) {
            var flt = fld.filter;
            flt.clear();
            switch (proxy.type) {
                case 'condition':
                    var cf = flt.conditionFilter,
                        val = changeType(proxy.condition1.value, fld.dataType, fld.format);
                    cf.condition1.value = val ? val : proxy.condition1.value;
                    cf.condition1.operator = proxy.condition1.operator;
                    cf.and = proxy.and;
                    val = changeType(proxy.condition2.value, fld.dataType, fld.format);
                    cf.condition2.value = val ? val : proxy.condition2.value;
                    cf.condition2.operator = proxy.condition2.operator;
                    break;
                case 'value':
                    var vf = flt.valueFilter;
                    vf.filterText = proxy.filterText;
                    vf.showValues = proxy.showValues;
                    break;
            }
        }
    }

    /**
     * Provides arguments for progress events.
     */
    export class ProgressEventArgs extends EventArgs {
        _progress: number;

        /**
         * Initializes a new instance of the @see:ProgressEventArgs class.
         *  
         * @param progress Number between 0 and 100 that represents the progress.
         */
        constructor(progress: number) {
            super();
            this._progress = asNumber(progress);
        }

        /**
         * Gets the current progress as a number between 0 and 100.
         */
        get progress(): number {
            return this._progress;
        }
    }
}