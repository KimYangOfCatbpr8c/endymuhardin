var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var odata;
    (function (odata) {
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
        var ODataVirtualCollectionView = (function (_super) {
            __extends(ODataVirtualCollectionView, _super);
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
            function ODataVirtualCollectionView(url, tableName, options) {
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
                _super.call(this, url, tableName, options);
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
            ODataVirtualCollectionView.prototype.setWindow = function (start, end) {
                var _this = this;
                if (this._toSetWindow) {
                    clearTimeout(this._toSetWindow);
                }
                this._toSetWindow = setTimeout(function () {
                    _this._toSetWindow = null;
                    _this._performSetWindow(start, end);
                }, 50);
            };
            Object.defineProperty(ODataVirtualCollectionView.prototype, "pageOnServer", {
                // ** overrides
                /**
                 * @see:ODataVirtualCollectionView requires @see:pageOnServer to be set to true.
                 */
                get: function () {
                    return true;
                },
                set: function (value) {
                    if (!value) {
                        throw 'ODataVirtualCollectionView requires pageOnServer = true.';
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ODataVirtualCollectionView.prototype, "sortOnServer", {
                /**
                 * @see:ODataVirtualCollectionView requires @see:sortOnServer to be set to true.
                 */
                get: function () {
                    return true;
                },
                set: function (value) {
                    if (!wijmo.asBoolean(value)) {
                        throw 'ODataVirtualCollectionView requires sortOnServer = true.';
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ODataVirtualCollectionView.prototype, "filterOnServer", {
                /**
                 * @see:ODataVirtualCollectionView requires @see:filterOnServer to be set to true.
                 */
                get: function () {
                    return true;
                },
                set: function (value) {
                    if (!wijmo.asBoolean(value)) {
                        throw 'ODataVirtualCollectionView requires filterOnServer = true.';
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ODataVirtualCollectionView.prototype, "canGroup", {
                /**
                 * @see:ODataVirtualCollectionView requires @see:canGroup to be set to false.
                 */
                get: function () {
                    return this._canGroup;
                },
                set: function (value) {
                    if (wijmo.asBoolean(value)) {
                        throw 'ODataVirtualCollectionView does not support grouping.';
                    }
                },
                enumerable: true,
                configurable: true
            });
            // override to refresh source collection when needed
            ODataVirtualCollectionView.prototype._performRefresh = function () {
                if (!this.isLoading) {
                    this._refresh = true;
                }
                _super.prototype._performRefresh.call(this);
            };
            // override to apply current _skip parameter
            /*protected*/ ODataVirtualCollectionView.prototype._getReadParams = function (nextLink) {
                var params = _super.prototype._getReadParams.call(this, nextLink);
                params['$skip'] = this._skip || 0;
                params['$top'] = this.pageSize;
                return params;
            };
            // override to add items at the proper place
            /*protected*/ ODataVirtualCollectionView.prototype._storeItems = function (items, append) {
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
            };
            // ** implementation
            // load records for a given window
            ODataVirtualCollectionView.prototype._performSetWindow = function (start, end) {
                // validate parameters
                start = wijmo.asInt(start);
                end = wijmo.asInt(end);
                wijmo.assert(end >= start, 'Start must be smaller than end.');
                //console.log('setting window to ' + start + ' -> ' + end + '.');
                // save direction, new window
                var down = wijmo.isNumber(this._start) && start > this._start;
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
            };
            return ODataVirtualCollectionView;
        }(odata.ODataCollectionView));
        odata.ODataVirtualCollectionView = ODataVirtualCollectionView;
    })(odata = wijmo.odata || (wijmo.odata = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ODataVirtualCollectionView.js.map