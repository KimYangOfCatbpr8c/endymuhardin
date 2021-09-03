module wijmo.odata {
    'use strict';

    /**
     * Extends the @see:ODataCollectionView class to support loading data on
     * demand, using the @see:setWindow method.
     *
     * The example below shows how you can declare an @see:ODataCollectionView 
     * and synchronize it with a @see:wijmo.grid.FlexGrid control to load the
     * data that is within the grid's viewport:
     *
     * <pre>// declare virtual collection view
     * var vcv = new wijmo.odata.ODataVirtualCollectionView(url, 'Order_Details_Extendeds', {
     *   oDataVersion: 4
     * });
     * // use virtual collection as grid data source
     * flex.itemsSource = vcv;
     * // update data window when the grid scrolls
     * flex.scrollPositionChanged.addHandler(function () {
     *   var rng = flex.viewRange;
     *   vcv.setWindow(rng.row, rng.row2);
     * });</pre>
     *
     * The @see:ODataVirtualCollectionView class implements a 'data window' so only
     * data that is actually being displayed is loaded from the server. Items that are
     * not being displayed are added to the collection as null values until a call
     * to the @see:setWindow method causes them those items to be loaded.
     *
     * This 'on-demand' method of loading data has advantages when dealing with large
     * data sets, because it prevents the application from loading data until it is
     * required. But it does impose some limitation: sorting and filtering must be
     * done on the server; grouping and paging are not supported.
     */
    export class ODataVirtualCollectionView extends ODataCollectionView {
        _data: any[];           // source collection
        _skip: number;          // _skip and pageSize define the actual data window
        _start: number;         // last data window requested
        _end: number;
        _refresh: boolean;      // data has been refreshed, need to re-create sourceCollection
        _loadOffset: number;
        _toSetWindow: number;

        /**
         * Initializes a new instance of the @see:ODataVirtualCollectionView class.
         *
         * @param url Url of the OData service (for example
         * 'http://services.odata.org/Northwind/Northwind.svc').
         * @param tableName Name of the table (entity) to retrieve from the service.
         * If not provided, a list of the tables (entities) available is retrieved.
         * @param options JavaScript object containing initialization data (property 
         * values and event handlers) for the @see:ODataVirtualCollectionView.
         */
        constructor(url: string, tableName: string, options?: any) {

            // initialize options
            if (options == null) {
                options = {};
            }

            // always page and sort on server, no grouping
            options.pageOnServer = true;
            options.sortOnServer = true;
            options.canGroup = false;
            if (!options.pageSize) {
                options.pageSize = 100;
            }

            // allow base class
            super(url, tableName, options);

            // initialize sourceCollection
            this._data = [];
            this.sourceCollection = this._data;

            // initialize data window
            this._skip = 0;
            this.setWindow(0, this.pageSize);
        }

        // ** object model

        /**
         * Sets the data window to ensure a range of records are loaded into the view.
         *
         * @param start Index of the first item in the data window.
         * @param end Index of the last item in the data window.
         */
        setWindow(start: number, end: number) {
            if (this._toSetWindow) {
                clearTimeout(this._toSetWindow);
            }
            this._toSetWindow = setTimeout(() => {
                this._toSetWindow = null;
                this._performSetWindow(start, end);
            }, 50);
        }

        // ** overrides

        /**
         * @see:ODataVirtualCollectionView requires @see:pageOnServer to be set to true.
         */
        get pageOnServer(): boolean {
            return true;
        }
        set pageOnServer(value: boolean) {
            if (!value) {
                throw 'ODataVirtualCollectionView requires pageOnServer = true.';
            }
        }
        /**
         * @see:ODataVirtualCollectionView requires @see:sortOnServer to be set to true.
         */
        get sortOnServer(): boolean {
            return true;
        }
        set sortOnServer(value: boolean) {
            if (!asBoolean(value)) {
                throw 'ODataVirtualCollectionView requires sortOnServer = true.';
            }
        }
        /**
         * @see:ODataVirtualCollectionView requires @see:filterOnServer to be set to true.
         */
        get filterOnServer(): boolean {
            return true;
        }
        set filterOnServer(value: boolean) {
            if (!asBoolean(value)) {
                throw 'ODataVirtualCollectionView requires filterOnServer = true.';
            }
        }
        /**
         * @see:ODataVirtualCollectionView requires @see:canGroup to be set to false.
         */
        get canGroup(): boolean {
            return this._canGroup;
        }
        set canGroup(value: boolean) {
            if (asBoolean(value)) {
                throw 'ODataVirtualCollectionView does not support grouping.';
            }
        }

        // override to refresh source collection when needed
        _performRefresh() {
            if (!this.isLoading) {
                this._refresh = true;
            }
            super._performRefresh();
        }

        // override to apply current _skip parameter
        /*protected*/ _getReadParams(nextLink?: string): any {
            var params = super._getReadParams(nextLink);
            params['$skip'] = this._skip || 0;
            params['$top'] = this.pageSize;
            return params;
        }

        // override to add items at the proper place
        /*protected*/ _storeItems(items: any[], append: boolean) {

            // re-create data source array if refreshed or number of items has changed
            if (this._refresh || this._data.length != this.totalItemCount) {
                this._data.length = this.totalItemCount;
                for (var i = 0; i < this._data.length; i++) {
                    this._data[i] = null;
                }
                this._refresh = false;
            }

            // prepare to load items starting at the _skip position
            if (!append) {
                //console.log('starting batch at ' + this._skip);
                this._loadOffset = 0;
            }

            // add items at the proper spot
            //console.log('adding ' + items.length + ' items at ' + this._skip + ' + ' + this._loadOffset);
            var offset = this._loadOffset + (this._skip || 0);
            for (var i = 0; i < items.length; i++) {
                this._data[i + offset] = items[i];    
            }

            // increment load starting point
            this._loadOffset += items.length;
        }

        // ** implementation

        // load records for a given window
        _performSetWindow(start: number, end: number) {

            // validate parameters
            start = asInt(start);
            end = asInt(end);
            assert(end >= start, 'Start must be smaller than end.');
            //console.log('setting window to ' + start + ' -> ' + end + '.');
            
            // save direction, new window
            var down = isNumber(this._start) && start > this._start;
            this._start = start;
            this._end = end;

            // see if we need to refresh the data
            var needData = false;
            for (var i = start; i < end && i < this._data.length && !needData; i++) {
                needData = (this._data[i] == null);
            }
            if (!needData) {
                //console.log('already got data for the window ' + start + ' -> ' + end + ', ignoring request.');
                return;
            }

            // adjust window
            var top = Math.max(0, down ? start : end - this.pageSize);
            for (var i = top; i < this._data.length && this._data[i] != null; i++) {
                top++;
            }
            
            // go get the data
            //console.log('getting data from ' + top + ' -> ' + (top + this.pageSize));
            this._skip = top;
            this._getData();
        }
   }
}