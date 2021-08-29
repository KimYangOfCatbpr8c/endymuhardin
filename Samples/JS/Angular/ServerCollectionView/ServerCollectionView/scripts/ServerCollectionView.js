var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="wijmo.d.ts" />
/// <reference path="wijmo.input.d.ts" />
/// <reference path="wijmo.grid.d.ts" />
/// <reference path="wijmo.grid.filter.d.ts" />
var wijmo;
(function (wijmo) {
    var collections;
    (function (collections) {
        'use strict';
        /**
         * Base class for server-based CollectionView classes.
         *
         * To use it, create a class that extends @see:ServerCollectionViewBase
         * and add overrides for the following methods:
         *
         * <ul>
         *    <li>_getReadUrl</li>
         *    <li>_getWriteUrl</li>
         *    <li>_getReadParameters</li>
         *    <li>_getFilterDefinition</li>
         * </ul>
         */
        var ServerCollectionViewBase = (function (_super) {
            __extends(ServerCollectionViewBase, _super);
            /**
             * Initializes a new instance of the @see:ServerCollectionViewBase class.
             *
             * @param url Url of the data service (e.g. 'DataHandler.ashx').
             * @param options JavaScript object containing initialization data (property
             * values and event handlers) for the @see:ServerCollectionView.
             */
            function ServerCollectionViewBase(url, options) {
                var _this = this;
                _super.call(this);
                this._count = 0;
                this._sortOnServer = true;
                this._pageOnServer = true;
                this._filterOnServer = true;
                this._changeCount = 0;
                /**
                 * Occurs when the @see:ServerCollectionView starts loading data.
                 */
                this.loading = new wijmo.Event();
                /**
                 * Occurs when the @see:ServerCollectionView finishes loading data.
                 */
                this.loaded = new wijmo.Event();
                /**
                 * Occurs when there is an error reading or writing data.
                 */
                this.error = new wijmo.Event();
                this._url = wijmo.asString(url, false);
                if (options) {
                    wijmo.copy(this, options);
                }
                // when sortDescriptions change, sort on server
                this.sortDescriptions.collectionChanged.addHandler(function () {
                    if (_this.sortOnServer) {
                        _this._getData();
                    }
                });
                // go get the data
                this._getData();
            }
            Object.defineProperty(ServerCollectionViewBase.prototype, "sortOnServer", {
                // ** object model
                /**
                 * Gets or sets a value that determines whether sort operations
                 * should be performed on the server or on the client.
                 *
                 * Use the @see:sortDescriptions property to specify how the
                 * data should be sorted.
                 */
                get: function () {
                    return this._sortOnServer;
                },
                set: function (value) {
                    if (value != this._sortOnServer) {
                        this._sortOnServer = wijmo.asBoolean(value);
                        this._getData();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ServerCollectionViewBase.prototype, "pageOnServer", {
                /**
                 * Gets or sets a value that determines whether paging should be
                 * performed on the server or on the client.
                 *
                 * Use the @see:pageSize property to enable paging.
                 */
                get: function () {
                    return this._pageOnServer;
                },
                set: function (value) {
                    if (value != this._pageOnServer) {
                        this._pageOnServer = wijmo.asBoolean(value);
                        if (this.pageSize) {
                            this._getData();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ServerCollectionViewBase.prototype, "filterOnServer", {
                /**
                 * Gets or sets a value that determines whether filtering should be performed on
                 * the server or on the client.
                 *
                 * Use the @see:filter property to perform filtering on the client, and use the
                 * @see:filterDefinition property to perform filtering on the server.
                 *
                 * In some cases it may be desirable to apply independent filters on the client
                 * <b>and</b> on the server.
                 *
                 * You can achieve this by setting (1) the @see:filterOnServer property to false
                 * and the @see:filter property to a filter function (to enable client-side filtering)
                 * and (2) the @see:filterDefinition property to a filter string (to enable server-side
                 * filtering).
                 */
                get: function () {
                    return this._filterOnServer;
                },
                set: function (value) {
                    if (value != this._filterOnServer) {
                        this._filterOnServer = wijmo.asBoolean(value);
                        this._getData();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ServerCollectionViewBase.prototype, "filterDefinition", {
                /**
                 * Gets or sets a string containing an OData filter specification to
                 * be used for filtering the data on the server.
                 */
                get: function () {
                    return this._filterDef;
                },
                set: function (value) {
                    if (value != this._filterDef) {
                        this._filterDef = wijmo.asString(value);
                        this._getData();
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Updates the filter definition based on a known filter provider such as the
             * @see:FlexGridFilter.
             *
             * @param filterProvider Known filter provider, typically an instance of a
             * @see:FlexGridFilter.
             */
            ServerCollectionViewBase.prototype.updateFilterDefinition = function (filterProvider) {
                if (this.filterOnServer && wijmo.grid && wijmo.grid.filter && filterProvider instanceof wijmo.grid.filter.FlexGridFilter) {
                    this.filterDefinition = this._getFilterDefinition(filterProvider);
                }
            };
            Object.defineProperty(ServerCollectionViewBase.prototype, "requestHeaders", {
                /**
                 * Gets or sets an object containing request headers to be used when sending
                 * or requesting data.
                 *
                 * The most typical use for this property is in scenarios where authentication
                 * is required. For example:
                 *
                 * <pre>var categories = new wijmo.odata.ODataCollectionView(serviceUrl, 'Categories', {
                 *   fields: ['Category_ID', 'Category_Name'],
                 *   requestHeaders: { Authorization: db.token }
                 * });</pre>
                 */
                get: function () {
                    return this._requestHeaders;
                },
                set: function (value) {
                    this._requestHeaders = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ServerCollectionViewBase.prototype, "isLoading", {
                /**
                 * Gets a value that indicates the @see:ServerCollectionView is
                 * currently loading data.
                 *
                 * This property can be used to provide progress indicators.
                 */
                get: function () {
                    return this._loading;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the @see:loading event.
             */
            ServerCollectionViewBase.prototype.onLoading = function (e) {
                this.loading.raise(this, e);
            };
            /**
             * Raises the @see:loaded event.
             */
            ServerCollectionViewBase.prototype.onLoaded = function (e) {
                this.loaded.raise(this, e);
            };
            /**
             * Loads or re-loads the data from the server.
             */
            ServerCollectionViewBase.prototype.load = function () {
                this._getData();
            };
            /**
             * Raises the @see:error event.
             *
             * By default, errors throw exceptions and trigger a data refresh. If you
             * want to prevent this behavior, set the @see:RequestErrorEventArgs.cancel
             * parameter to true in the event handler.
             *
             * @param e @see:RequestErrorEventArgs that contains information about the error.
             */
            ServerCollectionViewBase.prototype.onError = function (e) {
                this.error.raise(this, e);
                return !e.cancel;
            };
            Object.defineProperty(ServerCollectionViewBase.prototype, "totalItemCount", {
                // ** overrides
                /**
                 * Gets the total number of items in the view before paging is applied.
                 */
                get: function () {
                    return this.pageOnServer
                        ? this._count
                        : this._view.length;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ServerCollectionViewBase.prototype, "pageCount", {
                /**
                 * Gets the total number of pages.
                 */
                get: function () {
                    return this.pageSize ? Math.ceil(this.totalItemCount / this.pageSize) : 1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ServerCollectionViewBase.prototype, "pageSize", {
                /**
                 * Gets or sets the number of items to display on a page.
                 */
                get: function () {
                    return this._pgSz;
                },
                set: function (value) {
                    if (value != this._pgSz) {
                        this._pgSz = wijmo.asInt(value);
                        if (this.pageOnServer) {
                            this._pgIdx = wijmo.clamp(this._pgIdx, 0, this.pageCount - 1); // ensure page index is valid (TFS 121226)
                            this._getData();
                        }
                        else {
                            this.refresh();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the @see:pageChanging event.
             *
             * @param e @see:PageChangingEventArgs that contains the event data.
             */
            ServerCollectionViewBase.prototype.onPageChanging = function (e) {
                _super.prototype.onPageChanging.call(this, e);
                if (this.pageOnServer && !e.cancel) {
                    this._getData();
                }
                return !e.cancel;
            };
            /**
             * Override @see:commitNew to add the new item to the database.
             */
            ServerCollectionViewBase.prototype.commitNew = function () {
                var _this = this;
                // to get new item back as JSON
                var requestHeaders = {
                    'Accept': 'application/json'
                };
                if (this.requestHeaders) {
                    for (var k in this.requestHeaders) {
                        requestHeaders[k] = this.requestHeaders[k];
                    }
                }
                // commit to database
                var item = this.currentAddItem;
                if (item) {
                    var url = this._getWriteUrl();
                    if (url) {
                        wijmo.httpRequest(url, {
                            method: 'POST',
                            requestHeaders: requestHeaders,
                            data: item,
                            success: function (xhr) {
                                var newItem = _this._parseJSON(xhr.response);
                                for (var key in newItem) {
                                    item[key] = newItem[key];
                                }
                                _this._changeCount++;
                                _this._getData();
                            },
                            error: this._error.bind(this)
                        });
                    }
                }
                // allow base class
                _super.prototype.commitNew.call(this);
            };
            /**
             * Override @see:commitEdit to modify the item in the database.
             */
            ServerCollectionViewBase.prototype.commitEdit = function () {
                var _this = this;
                // commit to database
                var item = this.currentEditItem;
                if (item && !this.currentAddItem && !this._sameContent(item, this._edtClone)) {
                    if (this.items.indexOf(item) > -1) {
                        var url = this._getWriteUrl(this._edtClone);
                        if (url) {
                            wijmo.httpRequest(url, {
                                method: 'PUT',
                                requestHeaders: this.requestHeaders,
                                data: item,
                                success: function (xhr) {
                                    _this._changeCount++;
                                    if (!_this.currentEditItem) {
                                        _this._getData();
                                    }
                                },
                                error: this._error.bind(this)
                            });
                        }
                    }
                }
                // allow base class
                _super.prototype.commitEdit.call(this);
            };
            /**
             * Override @see:remove to remove the item from the database.
             *
             * @param item Item to be removed from the database.
             */
            ServerCollectionViewBase.prototype.remove = function (item) {
                var _this = this;
                // remove from database
                if (item && item != this.currentAddItem) {
                    if (this.items.indexOf(item) > -1) {
                        var url = this._getWriteUrl(item);
                        if (url) {
                            wijmo.httpRequest(url, {
                                method: 'DELETE',
                                requestHeaders: this.requestHeaders,
                                success: function (xhr) {
                                    _this._changeCount++;
                                    _this._getData();
                                },
                                error: this._error.bind(this),
                            });
                        }
                    }
                }
                // allow base class
                _super.prototype.remove.call(this, item);
            };
            // we're paging on the server, so the pageView is the view
            ServerCollectionViewBase.prototype._getPageView = function () {
                return this.pageOnServer
                    ? this._view
                    : _super.prototype._getPageView.call(this);
            };
            // disable sort and filter on client if we're doing it on the server
            ServerCollectionViewBase.prototype._performRefresh = function () {
                // save settings
                var canFilter = this._canFilter, canSort = this._canSort;
                // perform refresh
                this._canFilter = !this._filterOnServer;
                this._canSort = !this._sortOnServer;
                _super.prototype._performRefresh.call(this);
                // restore settings
                this._canFilter = canFilter;
                this._canSort = canSort;
            };
            // ** implementation
            // get the data
            ServerCollectionViewBase.prototype._getData = function () {
                var _this = this;
                // get the data on a timeout to avoid doing it too often
                if (this._toGetData) {
                    clearTimeout(this._toGetData);
                }
                this._toGetData = setTimeout(function () {
                    // start loading
                    _this._loading = true;
                    _this.onLoading();
                    // get parameters
                    var params = _this._getReadParameters();
                    for (var k in params) {
                        params[k] = _this._encodeUrl(params[k]);
                    }
                    // go get the data
                    var url = _this._getReadUrl();
                    wijmo.httpRequest(url, {
                        data: params,
                        success: function (xhr) {
                            // save cursor position
                            var position = _this.currentPosition;
                            // parse response
                            var response = _this._parseJSON(xhr.response);
                            // check if the item count decreased and we were reading past the end
                            var readPastEnd = response.count < _this._count &&
                                _this.pageSize > 0 && response.value.length < _this.pageSize;
                            // store results
                            _this._count = response.count;
                            _this.sourceCollection = response.value;
                            _this.refresh();
                            // restore cursor position
                            if (position > -1) {
                                _this.moveCurrentToPosition(position);
                            }
                            // done
                            _this._loading = false;
                            _this.onLoaded();
                            // if we read past the end of the collection, read again (TFS 244749)
                            if (readPastEnd) {
                                _this._getData();
                            }
                        },
                        error: function (xhr) {
                            _this._loading = false;
                            _this.onLoaded();
                            if (_this.onError(new wijmo.RequestErrorEventArgs(xhr))) {
                                throw 'HttpRequest Error: ' + xhr.status + ' ' + xhr.statusText;
                            }
                        }
                    });
                }, 100);
            };
            // handle errors...
            ServerCollectionViewBase.prototype._error = function (xhr) {
                if (this.onError(new wijmo.RequestErrorEventArgs(xhr))) {
                    this._getData();
                    throw 'HttpRequest Error: ' + xhr.status + ' ' + xhr.statusText;
                }
            };
            // parse JSON including dates
            ServerCollectionViewBase.prototype._parseJSON = function (text) {
                return JSON.parse(text, function (key, value) {
                    if (typeof value === 'string') {
                        // parse dates saved as JSON-strings
                        var m = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/);
                        if (m) {
                            return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]));
                        }
                        // parse dates saved as OData-style strings
                        m = value.match(/^\/Date\((\d+)\)\/$/);
                        if (m) {
                            return new Date(parseInt(m[1]));
                        }
                    }
                    return value;
                });
            };
            // encode url parameters
            ServerCollectionViewBase.prototype._encodeUrl = function (value) {
                return wijmo.isString(value) ? encodeURIComponent(value) : value;
            };
            // ** virtual/overridables
            // get url for read requests
            // note: read uses GET
            ServerCollectionViewBase.prototype._getReadUrl = function () {
                var url = this._url;
                if (url[url.length - 1] != '/') {
                    url += '/';
                }
                return url;
            };
            // get url for write requests
            // note: add uses POST, edit uses PUT, remove uses DELETE
            ServerCollectionViewBase.prototype._getWriteUrl = function (item) {
                var url = this._getReadUrl();
                if (item) {
                    url += '(' + item.ID + ')';
                }
                return url;
            };
            // get parameters for read request
            // override to add parameters that apply the current sorting, paging, filtering, etc.
            ServerCollectionViewBase.prototype._getReadParameters = function () {
                return {};
            };
            // get a filterDefinition string based on a filterProvider (typically a FlexGridFilter).
            // override to translate the filterProvider conditions into a filter string that
            // can be recognized by the server
            ServerCollectionViewBase.prototype._getFilterDefinition = function (filterProvider) {
                return null;
            };
            return ServerCollectionViewBase;
        }(collections.CollectionView));
        collections.ServerCollectionViewBase = ServerCollectionViewBase;
        /**
         * Extends @see: wijmo.collections.ServerCollectionViewBase to retrieve sorted
         * and paginated data from a very simple data service.
         */
        var ServerCollectionView = (function (_super) {
            __extends(ServerCollectionView, _super);
            /**
             * Initializes a new instance of the @see:ServerCollectionViewBase class.
             *
             * @param url Url of the data service (e.g. 'DataHandler.ashx').
             * @param options JavaScript object containing initialization data (property
             * values and event handlers) for the @see:ServerCollectionView.
             */
            function ServerCollectionView(url, options) {
                _super.call(this, url);
                if (options) {
                    wijmo.copy(this, options);
                }
            }
            // *** overrides ***
            // get url for read request
            ServerCollectionView.prototype._getReadUrl = function () {
                return _super.prototype._getReadUrl.call(this);
            };
            // get parameters for read request
            ServerCollectionView.prototype._getReadParameters = function () {
                var settings = {};
                // to refresh cache after changes
                settings['$ticks'] = this._changeCount;
                // server sort
                //
                // in this case we translate the SortDescriptions into a comma-separated 
                // list of fields to sort on, same syntax as DataView.Sort:
                // https://msdn.microsoft.com/en-us/library/system.data.dataview.sort(v=vs.110).aspx
                //
                if (this.sortOnServer && this.sortDescriptions.length) {
                    var sort = '';
                    for (var i = 0; i < this.sortDescriptions.length; i++) {
                        var sd = this.sortDescriptions[i];
                        if (sort)
                            sort += ',';
                        sort += sd.property;
                        if (!sd.ascending)
                            sort += ' desc';
                    }
                    settings['$orderby'] = sort;
                }
                // server paging
                if (this.pageOnServer && this.pageSize > 0) {
                    settings['$skip'] = this.pageIndex * this.pageSize;
                    settings['$top'] = this.pageSize;
                }
                // server filtering
                //
                // NOTE: we apply filterDefinition regardless of 'filterOnServer'; 
                // this allows filtering on the server and on the client at the same time
                //
                if (this.filterDefinition) {
                    settings['$filter'] = this.filterDefinition;
                }
                // done
                return settings;
            };
            // get a filterDefinition string based on a filterProvider (typically a FlexGridFilter).
            //
            // in this case we translate the FlexGridFilter conditions for each column into
            // an expression using the same syntax as a DataView.RowFilter:
            // https://msdn.microsoft.com/en-us/library/system.data.dataview.rowfilter(v=vs.110).aspx
            //
            ServerCollectionView.prototype._getFilterDefinition = function (filter) {
                if (filter instanceof wijmo.grid.filter.FlexGridFilter) {
                    var def = '';
                    for (var c = 0; c < filter.grid.columns.length; c++) {
                        var col = filter.grid.columns[c], cf = filter.getColumnFilter(col, false);
                        if (cf && cf.isActive) {
                            if (def) {
                                def += ' AND ';
                            }
                            if (cf.conditionFilter && cf.conditionFilter.isActive) {
                                def += this._getConditionFilterDefinition(cf.conditionFilter);
                            }
                            else if (cf.valueFilter && cf.valueFilter.isActive) {
                                def += this._getValueFilterDefinition(cf.valueFilter);
                            }
                        }
                    }
                    return def;
                }
                return null;
            };
            ServerCollectionView.prototype._getValueFilterDefinition = function (vf) {
                var col = vf.column, vals = [];
                for (var key in vf.showValues) {
                    var value = wijmo.changeType(key, col.dataType, col.format);
                    vals.push(this._encodeFilterValue(value, col.dataType));
                }
                return '[' + col.binding + '] IN (' + vals.join(', ') + ')';
            };
            ServerCollectionView.prototype._getConditionFilterDefinition = function (cf) {
                var val = this._getConditionDefinition(cf, cf.condition1);
                if (cf.condition2.operator != null) {
                    val += (cf.and ? ' AND ' : ' OR ') + this._getConditionDefinition(cf, cf.condition2);
                }
                return '(' + val + ')';
            };
            ServerCollectionView.prototype._getConditionDefinition = function (cf, cond) {
                var expr = '', val = this._encodeFilterValue(cond.value, cf.column.dataType), unquoted = wijmo.isString(cond.value) ? cond.value.replace(/'/g, '\'\'') : '';
                switch (cond.operator) {
                    case 0:
                        expr = '= ' + val;
                        break;
                    case 1:
                        expr = '<> ' + val;
                        break;
                    case 2:
                        expr = '> ' + val;
                        break;
                    case 3:
                        expr = '>= ' + val;
                        break;
                    case 4:
                        expr = '< ' + val;
                        break;
                    case 5:
                        expr = '<= ' + val;
                        break;
                    case 6:
                        expr = 'LIKE \'' + unquoted + '*\'';
                        break;
                    case 7:
                        expr = 'LIKE \'*' + unquoted + '\'';
                        break;
                    case 8:
                        expr = 'LIKE \'*' + unquoted + '*\'';
                        break;
                    case 9:
                        expr = 'NOT LIKE \'*' + unquoted + '*\'';
                        break;
                }
                return '[' + cf.column.binding + '] ' + expr;
            };
            ServerCollectionView.prototype._encodeFilterValue = function (val, dataType) {
                if (wijmo.isString(val)) {
                    return "'" + val.replace(/'/g, '\'\'') + "'";
                }
                else if (wijmo.isDate(val)) {
                    return '#' + (val.getMonth() + 1) + '/' + val.getDate() + '/' + val.getFullYear() + '#';
                }
                else if (val != null) {
                    return val.toString();
                }
                return dataType == wijmo.DataType.String ? "''" : null;
            };
            return ServerCollectionView;
        }(ServerCollectionViewBase));
        collections.ServerCollectionView = ServerCollectionView;
    })(collections = wijmo.collections || (wijmo.collections = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ServerCollectionView.js.map