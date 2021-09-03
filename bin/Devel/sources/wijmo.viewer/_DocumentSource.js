var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        // Defines an abstract document source class.
        var _DocumentSource = (function () {
            // Creates the document source.
            // @param options The document options and service information.
            function _DocumentSource(options) {
                this._hasOutlines = false;
                this._pageCount = 0;
                this._supportedExportDescriptions = [];
                this._isLoadCompleted = false;
                this._isDisposed = false;
                this._errors = [];
                // Occurs after the page count changes.
                this.pageCountChanged = new wijmo.Event();
                // Occurs after the document is disposed.
                this.disposed = new wijmo.Event();
                // Occurs when the pageSettings property value changes.
                this.pageSettingsChanged = new wijmo.Event();
                // Occurs when the document is loaded completed.
                this.loadCompleted = new wijmo.Event();
                // Queries the request data sent to the service before loading the document.
                this.queryLoadingData = new wijmo.Event();
                this._service = this._createDocumentService(options);
                this._paginated = options.paginated;
            }
            // Raises the @see:queryLoadingData event.
            // @param e @see:QueryLoadingDataEventArgs that contains the event data.
            _DocumentSource.prototype.onQueryLoadingData = function (e) {
                this.queryLoadingData.raise(this, e);
            };
            _DocumentSource.prototype._updateIsLoadCompleted = function (value) {
                if (this._isLoadCompleted === value) {
                    return;
                }
                this._isLoadCompleted = value;
                if (value) {
                    this.onLoadCompleted();
                }
            };
            _DocumentSource.prototype._updateIsDisposed = function (value) {
                if (this._isDisposed === value) {
                    return;
                }
                this._isDisposed = value;
                this.onDisposed();
            };
            _DocumentSource.prototype._getIsDisposed = function () {
                return this._isDisposed;
            };
            _DocumentSource.prototype._checkHasOutlines = function (data) {
                return data.documentStatus.hasOutlines;
            };
            _DocumentSource.prototype._checkIsLoadCompleted = function (data) {
                return data.documentStatus.status === viewer._ExecutionStatus.completed
                    || data.documentStatus.status === viewer._ExecutionStatus.stopped
                    || data.documentStatus.status === viewer._ExecutionStatus.loaded;
            };
            _DocumentSource.prototype._checkIsDisposed = function (data) {
                throw _DocumentSource._abstractMethodException;
            };
            Object.defineProperty(_DocumentSource.prototype, "executionDateTime", {
                // The execution date time of the loading document.
                get: function () {
                    return this._executionDateTime;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DocumentSource.prototype, "expiredDateTime", {
                // The expired date time of the cache.
                get: function () {
                    return this._expiredDateTime;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DocumentSource.prototype, "errors", {
                // Gets the errors of this document.
                get: function () {
                    return this._errors;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DocumentSource.prototype, "isLoadCompleted", {
                // Gets a boolean value indicates if this document is loaded completed.
                get: function () {
                    return this._isLoadCompleted;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DocumentSource.prototype, "isDisposed", {
                // Gets a boolean value indicates if this document is disposed.
                get: function () {
                    return this._getIsDisposed();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DocumentSource.prototype, "features", {
                // Gets the document features.
                get: function () {
                    return this._features;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DocumentSource.prototype, "pageSettings", {
                // Gets the page settings.
                get: function () {
                    return this._pageSettings;
                },
                enumerable: true,
                configurable: true
            });
            // Raises the @see:pageSettingsChanged event.
            // @param e The event arguments.
            _DocumentSource.prototype.onPageSettingsChanged = function (e) {
                this.pageSettingsChanged.raise(this, e || new wijmo.EventArgs());
            };
            // Raises the @see:loadCompleted event.
            // @param e The event arguments.
            _DocumentSource.prototype.onLoadCompleted = function (e) {
                this.loadCompleted.raise(this, e || new wijmo.EventArgs());
            };
            // Raises the @see:disposed event.
            // @param e The event arguments.
            _DocumentSource.prototype.onDisposed = function (e) {
                this.disposed.raise(this, e || new wijmo.EventArgs());
            };
            // Set the page settings.
            // @param pageSettings page settings for the document.
            // @return An @see:IPromise object with @see:_IExecutionInfo.
            _DocumentSource.prototype.setPageSettings = function (pageSettings) {
                var _this = this;
                return this._innerService.setPageSettings(pageSettings).then(function (data) { return _this._updatePageSettings(data.documentStatus.pageSettings); });
            };
            _DocumentSource.prototype._updatePageSettings = function (newValue) {
                this._pageSettings = newValue;
                this.onPageSettingsChanged();
            };
            Object.defineProperty(_DocumentSource.prototype, "_innerService", {
                get: function () {
                    return this._service;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DocumentSource.prototype, "paginated", {
                // Gets a value indicating whether the content should be represented as set of fixed sized pages.
                get: function () {
                    return this.pageSettings ? this.pageSettings.paginated : this._paginated;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DocumentSource.prototype, "hasOutlines", {
                // Gets a boolean value indicats whether current document has outlines or not.
                get: function () {
                    return this._hasOutlines;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DocumentSource.prototype, "pageCount", {
                // Gets the page count of the document.
                get: function () {
                    return this._pageCount;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DocumentSource.prototype, "service", {
                // Gets the service information of the document source.
                get: function () {
                    return this._service;
                },
                enumerable: true,
                configurable: true
            });
            // Gets the array of @see:_IExportDescription of current document source.
            // @return An @see:IPromise object with an @see:_IExportDescription array.
            _DocumentSource.prototype.getSupportedExportDescriptions = function () {
                return this._innerService.getSupportedExportDescriptions();
            };
            // Gets the bookmark by bookmark's name.
            // @param name Name of the bookmark to look for.
            // @return An @see:IPromise object with @see:_IDocumentPosition.
            _DocumentSource.prototype.getBookmark = function (name) {
                return this._innerService.getBookmark(name);
            };
            // Executes the custom action.
            // @param actionString The string represents the custom aciton.
            // @return An @see:IPromise object with @see:_IDocumentPosition.
            _DocumentSource.prototype.executeCustomAction = function (actionString) {
                return this._innerService.executeCustomAction(actionString);
            };
            // Gets an array of outline of current document source.
            // @return An @see:IPromise object with an @see:_IOutlineNode array.
            _DocumentSource.prototype.getOutlines = function () {
                return this._innerService.getOutlines();
            };
            // Disposes the current document source instance from service.
            // @return An @see:IPromise object with information of document.
            _DocumentSource.prototype.dispose = function () {
                var _this = this;
                return this._innerService.dispose().then(function (v) { return _this._update(v); });
            };
            // Loads the current document source from service.
            // @return An @see:IPromise object with information of document.
            _DocumentSource.prototype.load = function () {
                var _this = this;
                var data = {};
                if (this._paginated != null) {
                    data["pageSettings.paginated"] = this.paginated;
                }
                var e = new QueryLoadingDataEventArgs(data);
                this.onQueryLoadingData(e);
                return this._innerService.load(e.data).then(function (v) { return _this._update(v); });
            };
            _DocumentSource.prototype._update = function (data) {
                if (data == null) {
                    return;
                }
                this._executionDateTime = this._getExecutionDateTime(data);
                this._expiredDateTime = this._getExpiredDateTime(data);
                this._hasOutlines = this._checkHasOutlines(data);
                this._features = this._getFeatures(data);
                this._updatePageCount(this._getPageCount(data));
                this._updateIsLoadCompleted(this._checkIsLoadCompleted(data));
                this._updateIsDisposed(this._checkIsDisposed(data));
            };
            _DocumentSource.prototype._getFeatures = function (data) {
                var features = data.documentStatus.features;
                if (!features) {
                    features = { paginated: true, nonPaginated: false, textSearchInPaginatedMode: false, pageSettings: false };
                }
                return features;
            };
            _DocumentSource.prototype._getExecutionDateTime = function (data) {
                return data.loadedDateTime;
            };
            _DocumentSource.prototype._getExpiredDateTime = function (data) {
                return data.expiredDateTime;
            };
            _DocumentSource.prototype._getPageCount = function (data) {
                return data.documentStatus.pageCount;
            };
            _DocumentSource.prototype._updatePageCount = function (value) {
                if (this._pageCount === value) {
                    return;
                }
                this._pageCount = value;
                this.onPageCountChanged();
            };
            // Gets the document status.
            _DocumentSource.prototype.getDocumentStatus = function () {
                return this._innerService.getDocumentStatus();
            };
            _DocumentSource.prototype._createDocumentService = function (options) {
                throw _DocumentSource._abstractMethodException;
            };
            // Raises the @see:pageCountChanged event.
            // @param e @see:EventArgs that contains the event data.
            _DocumentSource.prototype.onPageCountChanged = function (e) {
                this.pageCountChanged.raise(this, e || new wijmo.EventArgs());
            };
            // Prints the current document.
            _DocumentSource.prototype.print = function () {
                var doc = new wijmo.PrintDocument({
                    title: 'Document'
                });
                this.renderToFilter({ format: 'html' }).then(function (xhr) {
                    doc.append(xhr.responseText);
                    doc.print();
                });
            };
            // Renders the document into an export filter object.
            // @param options Options of the export.
            // @return An @see:IPromise object with XMLHttpRequest.
            _DocumentSource.prototype.renderToFilter = function (options) {
                return this._innerService.renderToFilter(options);
            };
            // Gets the file url of rendering the document into an export filter object.
            // @param options Options of the export.
            // @return The file url of rendering the document into an export filter object.
            _DocumentSource.prototype.getRenderToFilterUrl = function (options) {
                return this._innerService.getRenderToFilterUrl(options);
            };
            // Gets an array of Search by search options.
            // @param text The text to match.
            // @param matchCase Whether to ignore case during the match.
            // @param wholeWord Whether to match the whole word, or just match the text.
            // @return An @see:IPromise object with an @see:_ISearchResult array.
            _DocumentSource.prototype.search = function (text, matchCase, wholeWord) {
                return this._innerService.search(text, matchCase, wholeWord);
            };
            _DocumentSource._abstractMethodException = 'It is an abstract method, please implement it.';
            return _DocumentSource;
        }());
        viewer._DocumentSource = _DocumentSource;
        // define the reviver for JSON.parse to transform results.
        function _statusJsonReviver(k, v) {
            if (wijmo.isString(v)) {
                if (_strEndsWith(k, 'DateTime')) {
                    return new Date(v);
                }
                if (k === 'width' || k === 'height' || _strEndsWith(k, 'Margin')) {
                    return new _Unit(v);
                }
            }
            return v;
        }
        viewer._statusJsonReviver = _statusJsonReviver;
        var _DocumentService = (function () {
            function _DocumentService(options) {
                this._url = '';
                this._url = options.serviceUrl || '';
                this._documentPath = options.filePath;
            }
            Object.defineProperty(_DocumentService.prototype, "serviceUrl", {
                get: function () {
                    return this._url;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DocumentService.prototype, "filePath", {
                get: function () {
                    return this._documentPath;
                },
                enumerable: true,
                configurable: true
            });
            _DocumentService.prototype.getDocumentStatus = function () {
                throw _DocumentSource._abstractMethodException;
            };
            // Return an IPromise with IPageSettings.
            _DocumentService.prototype.setPageSettings = function (pageSettings) {
                throw _DocumentSource._abstractMethodException;
            };
            // Return an IPromise with _IDocumentPosition.
            _DocumentService.prototype.getBookmark = function (name) {
                throw _DocumentSource._abstractMethodException;
            };
            // Return an IPromise with _IDocumentPosition.
            _DocumentService.prototype.executeCustomAction = function (actionString) {
                throw _DocumentSource._abstractMethodException;
            };
            _DocumentService.prototype.load = function (data) {
                throw _DocumentSource._abstractMethodException;
            };
            _DocumentService.prototype.dispose = function () {
                throw _DocumentSource._abstractMethodException;
            };
            // Return an IPromise with _IOutlineNode[].
            _DocumentService.prototype.getOutlines = function () {
                throw _DocumentSource._abstractMethodException;
            };
            // Return an IPromise with XMLHttpRequest.
            _DocumentService.prototype.renderToFilter = function (options) {
                throw _DocumentSource._abstractMethodException;
            };
            // Return an IPromise with _ISearchResult[].
            _DocumentService.prototype.search = function (text, matchCase, wholeWord) {
                throw _DocumentSource._abstractMethodException;
            };
            _DocumentService.prototype.getRenderToFilterUrl = function (options) {
                throw _DocumentSource._abstractMethodException;
            };
            // Return an IPromise with _IExportDescription[].
            _DocumentService.prototype.getSupportedExportDescriptions = function () {
                throw _DocumentSource._abstractMethodException;
            };
            return _DocumentService;
        }());
        viewer._DocumentService = _DocumentService;
        function _pageSettingsJsonReviver(k, v) {
            if (wijmo.isString(v)) {
                if (k === 'width' || k === 'height' || _strEndsWith(k, 'Margin')) {
                    return new _Unit(v);
                }
            }
            return v;
        }
        viewer._pageSettingsJsonReviver = _pageSettingsJsonReviver;
        function _strEndsWith(text, suffix) {
            return text.slice(-suffix.length) === suffix;
        }
        viewer._strEndsWith = _strEndsWith;
        function _appendQueryString(url, queries) {
            queries = queries || {};
            var queryList = [];
            for (var k in queries) {
                queryList.push(k + '=' + queries[k]);
            }
            if (queryList.length) {
                var sep = url.indexOf('?') < 0 ? '?' : '&';
                url += sep + queryList.join('&');
            }
            return url;
        }
        viewer._appendQueryString = _appendQueryString;
        function _joinUrl() {
            var data = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                data[_i - 0] = arguments[_i];
            }
            var urlParts = [];
            for (var i = 0, l = data.length; i < l; i++) {
                var item = data[i];
                if (item) {
                    if (typeof item !== 'string') {
                        urlParts = urlParts.concat(_joinStringUrl(item));
                    }
                    else {
                        urlParts.push(_prepareStringUrl(item).join('/'));
                    }
                }
            }
            return urlParts.join('/');
        }
        viewer._joinUrl = _joinUrl;
        function _joinStringUrl(data) {
            if (data == null) {
                return null;
            }
            var urlParts = [];
            for (var i = 0, l = data.length; i < l; i++) {
                urlParts = urlParts.concat(_prepareStringUrl(data[i]));
            }
            return urlParts;
        }
        viewer._joinStringUrl = _joinStringUrl;
        function _prepareStringUrl(data) {
            var paramParts = data.split('/');
            if (paramParts.length > 0 && !paramParts[paramParts.length - 1].length) {
                paramParts.splice(paramParts.length - 1);
            }
            return paramParts;
        }
        viewer._prepareStringUrl = _prepareStringUrl;
        function _httpRequest(url, settings) {
            if (!settings || !settings.cache) {
                url = _disableCache(url);
            }
            if (settings && settings.data) {
                var method = (settings.method || 'GET').toUpperCase();
                if (method !== 'GET') {
                    var dataStr = _objToParams(settings.data);
                    if (dataStr != null) {
                        settings.data = dataStr;
                        if (!settings.requestHeaders) {
                            settings.requestHeaders = { 'Content-Type': 'application/x-www-form-urlencoded' };
                        }
                    }
                }
            }
            return wijmo.httpRequest(url, settings);
        }
        viewer._httpRequest = _httpRequest;
        function _objToParams(obj) {
            var paramList = [];
            obj = obj || {};
            for (var key in obj) {
                if (obj[key] !== null && obj[key] !== undefined) {
                    if (wijmo.isArray(obj[key])) {
                        if (obj[key].length > 0) {
                            for (var i = 0; i < obj[key].length; i++) {
                                paramList.push(key + '=' + obj[key][i]);
                            }
                        }
                        else {
                            paramList.push(key + '=');
                        }
                    }
                    else {
                        paramList.push(key + '=' + obj[key]);
                    }
                }
            }
            return paramList.join('&');
        }
        viewer._objToParams = _objToParams;
        function _disableCache(url) {
            return url + (url.indexOf('?') == -1 ? '?' : '&') + '_=' + new Date().getTime();
        }
        viewer._disableCache = _disableCache;
        function _twipToPixel(value) {
            return _Unit.convertValue(value, _UnitType.Twip, _UnitType.Dip);
        }
        viewer._twipToPixel = _twipToPixel;
        // Enumerates units of measurement.
        (function (_UnitType) {
            // Specifies the document unit (1/300 inch) as the unit of measure.
            _UnitType[_UnitType["Document"] = 0] = "Document";
            // Specifies the inch as the unit of measure.
            _UnitType[_UnitType["Inch"] = 1] = "Inch";
            // Specifies the millimeter as the unit of measure.
            _UnitType[_UnitType["Mm"] = 2] = "Mm";
            // Specifies the pica unit (1/6 inch) as the unit of measure.
            _UnitType[_UnitType["Pica"] = 3] = "Pica";
            // Specifies a printer's point (1/72 inch) as the unit of measure.
            _UnitType[_UnitType["Point"] = 4] = "Point";
            // Specifies a twip (1/1440 inch) as the unit of measure.
            _UnitType[_UnitType["Twip"] = 5] = "Twip";
            // Specifies a hundredths of an inch as the unit of measure.
            _UnitType[_UnitType["InHs"] = 6] = "InHs";
            // Specifies 1/75 inch as the unit of measure.
            _UnitType[_UnitType["Display"] = 7] = "Display";
            // Specifies centimetre's as the unit of measure.
            _UnitType[_UnitType["Cm"] = 8] = "Cm";
            // Specifies DIP's 1/96 inch as the unit of measure.
            _UnitType[_UnitType["Dip"] = 9] = "Dip";
        })(viewer._UnitType || (viewer._UnitType = {}));
        var _UnitType = viewer._UnitType;
        // A utility structure specifying some values related to units of measurement.
        var _Unit = (function () {
            // Creates a _Unit instance.
            // @param value The value.
            // @param units The units of the value. If it is not passed, it is Dip for default.
            function _Unit(value, units) {
                if (units === void 0) { units = _UnitType.Dip; }
                _Unit._initUnitTypeDic();
                if (wijmo.isObject(value)) {
                    var obj = value;
                    value = obj.value;
                    units = obj.units;
                }
                else if (wijmo.isString(value)) {
                    var numValue = parseFloat(value);
                    if (!isNaN(numValue)) {
                        units = _Unit._unitTypeDic[value.substr(numValue.toString().length)];
                        value = numValue;
                    }
                }
                this._value = value;
                this._units = units;
                this._valueInPixel = _Unit.convertValue(value, units, _UnitType.Dip);
            }
            _Unit._initUnitTypeDic = function () {
                if (_Unit._unitTypeDic) {
                    return;
                }
                _Unit._unitTypeDic = {};
                for (var k in _Unit._unitTypes) {
                    _Unit._unitTypeDic[_Unit._unitTypeDic[k] = _Unit._unitTypes[k]] = k;
                }
            };
            Object.defineProperty(_Unit.prototype, "value", {
                // Gets the value of the current unit.
                get: function () {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_Unit.prototype, "units", {
                // Gets the unit of measurement of the current unit.
                get: function () {
                    return this._units;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_Unit.prototype, "valueInPixel", {
                // Gets the value in pixel.
                get: function () {
                    return this._valueInPixel;
                },
                enumerable: true,
                configurable: true
            });
            // Convert to string.
            // @return The string of converting result.
            _Unit.prototype.toString = function () {
                return _Unit.toString(this);
            };
            // Convert the unit to string.
            // @param unit The unit used to convert.
            // @return The string of converting result.
            _Unit.toString = function (unit) {
                return unit.value + _Unit._unitTypeDic[unit.units];
            };
            // Convert the value from one kind of unit to another.
            // @param value The value used to convert.
            // @param from The units of the value.
            // @param to The units which is converted to.
            // @return The number of converting result.
            _Unit.convertValue = function (value, from, to) {
                if (from === to) {
                    return value;
                }
                var valueInInch;
                switch (from) {
                    case _UnitType.Document:
                        valueInInch = value / _Unit._DocumentUnitsPerInch;
                        break;
                    case _UnitType.Inch:
                        valueInInch = value;
                        break;
                    case _UnitType.Mm:
                        valueInInch = value / _Unit._MmPerInch;
                        break;
                    case _UnitType.Pica:
                        valueInInch = value / _Unit._PicaPerInch;
                        break;
                    case _UnitType.Point:
                        valueInInch = value / _Unit._PointsPerInch;
                        break;
                    case _UnitType.Twip:
                        valueInInch = value / _Unit._TwipsPerInch;
                        break;
                    case _UnitType.InHs:
                        valueInInch = value / 100;
                        break;
                    case _UnitType.Display:
                        valueInInch = value / _Unit._DisplayPerInch;
                        break;
                    case _UnitType.Cm:
                        valueInInch = value / _Unit._CmPerInch;
                        break;
                    case _UnitType.Dip:
                        valueInInch = value / _Unit._DipPerInch;
                        break;
                    default:
                        throw 'Invalid from _UnitType: ' + from;
                }
                switch (to) {
                    case _UnitType.Document:
                        return valueInInch * _Unit._DocumentUnitsPerInch;
                    case _UnitType.Inch:
                        return valueInInch;
                    case _UnitType.Mm:
                        return valueInInch * _Unit._MmPerInch;
                    case _UnitType.Pica:
                        return valueInInch * _Unit._PicaPerInch;
                    case _UnitType.Point:
                        return valueInInch * _Unit._PointsPerInch;
                    case _UnitType.Twip:
                        return valueInInch * _Unit._TwipsPerInch;
                    case _UnitType.InHs:
                        return valueInInch * 100;
                    case _UnitType.Display:
                        return valueInInch * _Unit._DisplayPerInch;
                    case _UnitType.Cm:
                        return valueInInch * _Unit._CmPerInch;
                    case _UnitType.Dip:
                        return valueInInch * _Unit._DipPerInch;
                    default:
                        throw 'Invalid to _UnitType: ' + to;
                }
            };
            // Millimeters per inch.
            _Unit._MmPerInch = 25.4;
            // Document units per inch.
            _Unit._DocumentUnitsPerInch = 300;
            // Points per inch.
            _Unit._PointsPerInch = 72;
            // Twips per inch.
            _Unit._TwipsPerInch = 1440;
            // Picas per inch.
            _Unit._PicaPerInch = 6;
            // Centimeters per inch.
            _Unit._CmPerInch = _Unit._MmPerInch / 10;
            // Display units per inch.
            _Unit._DisplayPerInch = 75;
            // DIP units per inch.
            _Unit._DipPerInch = 96;
            _Unit._unitTypes = {
                doc: _UnitType.Document,
                in: _UnitType.Inch,
                mm: _UnitType.Mm,
                pc: _UnitType.Pica,
                pt: _UnitType.Point,
                tw: _UnitType.Twip,
                inhs: _UnitType.InHs,
                dsp: _UnitType.Display,
                cm: _UnitType.Cm,
                dip: _UnitType.Dip,
                px: _UnitType.Dip
            };
            return _Unit;
        }());
        viewer._Unit = _Unit;
        var _Promise = (function () {
            function _Promise() {
                this._callbacks = [];
            }
            _Promise.prototype.then = function (onFulfilled, onRejected) {
                this._callbacks.push({ onFulfilled: onFulfilled, onRejected: onRejected });
                return this;
            };
            _Promise.prototype.catch = function (onRejected) {
                return this.then(null, onRejected);
            };
            _Promise.prototype.resolve = function (value) {
                var _this = this;
                setTimeout(function () {
                    try {
                        _this.onFulfilled(value);
                    }
                    catch (e) {
                        _this.onRejected(e);
                    }
                }, 0);
            };
            _Promise.prototype.reject = function (reason) {
                var _this = this;
                setTimeout(function () {
                    _this.onRejected(reason);
                }, 0);
            };
            _Promise.prototype.onFulfilled = function (value) {
                var callback;
                while (callback = this._callbacks.shift()) {
                    if (callback.onFulfilled) {
                        var newValue = callback.onFulfilled(value);
                        if (newValue !== undefined) {
                            value = newValue;
                        }
                    }
                }
            };
            _Promise.prototype.onRejected = function (reason) {
                var callback;
                while (callback = this._callbacks.shift()) {
                    if (callback.onRejected) {
                        var value = callback.onRejected(reason);
                        this.onFulfilled(value);
                        return;
                    }
                }
                throw reason;
            };
            return _Promise;
        }());
        viewer._Promise = _Promise;
        var _CompositedPromise = (function (_super) {
            __extends(_CompositedPromise, _super);
            function _CompositedPromise(promises) {
                _super.call(this);
                this._promises = promises;
                this._init();
            }
            _CompositedPromise.prototype._init = function () {
                var _this = this;
                if (!this._promises || !this._promises.length) {
                    this.reject('No promises in current composited promise.');
                    return;
                }
                var length = this._promises.length, i = 0, values = [], isRejected = false;
                this._promises.some(function (p) {
                    p.then(function (v) {
                        if (isRejected) {
                            return;
                        }
                        values.push(v);
                        if (++i >= length) {
                            _this.resolve(values);
                        }
                    }).catch(function (r) {
                        isRejected = true;
                        _this.reject(r);
                    });
                    return isRejected;
                });
            };
            return _CompositedPromise;
        }(_Promise));
        viewer._CompositedPromise = _CompositedPromise;
        // Specifies the standard paper sizes.
        (function (_PaperKind) {
            // The paper size is defined by the user.
            _PaperKind[_PaperKind["Custom"] = 0] = "Custom";
            // Letter paper (8.5 in. by 11 in.).
            _PaperKind[_PaperKind["Letter"] = 1] = "Letter";
            // Letter small paper (8.5 in. by 11 in.).
            _PaperKind[_PaperKind["LetterSmall"] = 2] = "LetterSmall";
            // Tabloid paper (11 in. by 17 in.).
            _PaperKind[_PaperKind["Tabloid"] = 3] = "Tabloid";
            // Ledger paper (17 in. by 11 in.).
            _PaperKind[_PaperKind["Ledger"] = 4] = "Ledger";
            // Legal paper (8.5 in. by 14 in.).
            _PaperKind[_PaperKind["Legal"] = 5] = "Legal";
            // Statement paper (5.5 in. by 8.5 in.).
            _PaperKind[_PaperKind["Statement"] = 6] = "Statement";
            // Executive paper (7.25 in. by 10.5 in.).
            _PaperKind[_PaperKind["Executive"] = 7] = "Executive";
            // A3 paper (297 mm by 420 mm).
            _PaperKind[_PaperKind["A3"] = 8] = "A3";
            // A4 paper (210 mm by 297 mm).
            _PaperKind[_PaperKind["A4"] = 9] = "A4";
            // A4 small paper (210 mm by 297 mm).
            _PaperKind[_PaperKind["A4Small"] = 10] = "A4Small";
            // A5 paper (148 mm by 210 mm).
            _PaperKind[_PaperKind["A5"] = 11] = "A5";
            // B4 paper (250 mm by 353 mm).
            _PaperKind[_PaperKind["B4"] = 12] = "B4";
            // B5 paper (176 mm by 250 mm).
            _PaperKind[_PaperKind["B5"] = 13] = "B5";
            // Folio paper (8.5 in. by 13 in.).
            _PaperKind[_PaperKind["Folio"] = 14] = "Folio";
            //  Quarto paper (215 mm by 275 mm).
            _PaperKind[_PaperKind["Quarto"] = 15] = "Quarto";
            // Standard paper (10 in. by 14 in.).
            _PaperKind[_PaperKind["Standard10x14"] = 16] = "Standard10x14";
            // Standard paper (11 in. by 17 in.).
            _PaperKind[_PaperKind["Standard11x17"] = 17] = "Standard11x17";
            // Note paper (8.5 in. by 11 in.).
            _PaperKind[_PaperKind["Note"] = 18] = "Note";
            //  #9 envelope (3.875 in. by 8.875 in.).
            _PaperKind[_PaperKind["Number9Envelope"] = 19] = "Number9Envelope";
            // #10 envelope (4.125 in. by 9.5 in.).
            _PaperKind[_PaperKind["Number10Envelope"] = 20] = "Number10Envelope";
            // #11 envelope (4.5 in. by 10.375 in.).
            _PaperKind[_PaperKind["Number11Envelope"] = 21] = "Number11Envelope";
            // #12 envelope (4.75 in. by 11 in.).
            _PaperKind[_PaperKind["Number12Envelope"] = 22] = "Number12Envelope";
            // #14 envelope (5 in. by 11.5 in.).
            _PaperKind[_PaperKind["Number14Envelope"] = 23] = "Number14Envelope";
            // C paper (17 in. by 22 in.).
            _PaperKind[_PaperKind["CSheet"] = 24] = "CSheet";
            // D paper (22 in. by 34 in.).
            _PaperKind[_PaperKind["DSheet"] = 25] = "DSheet";
            // E paper (34 in. by 44 in.).
            _PaperKind[_PaperKind["ESheet"] = 26] = "ESheet";
            // DL envelope (110 mm by 220 mm).
            _PaperKind[_PaperKind["DLEnvelope"] = 27] = "DLEnvelope";
            //  C5 envelope (162 mm by 229 mm).
            _PaperKind[_PaperKind["C5Envelope"] = 28] = "C5Envelope";
            // C3 envelope (324 mm by 458 mm).
            _PaperKind[_PaperKind["C3Envelope"] = 29] = "C3Envelope";
            // C4 envelope (229 mm by 324 mm).
            _PaperKind[_PaperKind["C4Envelope"] = 30] = "C4Envelope";
            // C6 envelope (114 mm by 162 mm).
            _PaperKind[_PaperKind["C6Envelope"] = 31] = "C6Envelope";
            // C65 envelope (114 mm by 229 mm).
            _PaperKind[_PaperKind["C65Envelope"] = 32] = "C65Envelope";
            // B4 envelope (250 mm by 353 mm).
            _PaperKind[_PaperKind["B4Envelope"] = 33] = "B4Envelope";
            // B5 envelope (176 mm by 250 mm).
            _PaperKind[_PaperKind["B5Envelope"] = 34] = "B5Envelope";
            //  B6 envelope (176 mm by 125 mm).
            _PaperKind[_PaperKind["B6Envelope"] = 35] = "B6Envelope";
            // Italy envelope (110 mm by 230 mm).
            _PaperKind[_PaperKind["ItalyEnvelope"] = 36] = "ItalyEnvelope";
            // Monarch envelope (3.875 in. by 7.5 in.).
            _PaperKind[_PaperKind["MonarchEnvelope"] = 37] = "MonarchEnvelope";
            // 6 3/4 envelope (3.625 in. by 6.5 in.).
            _PaperKind[_PaperKind["PersonalEnvelope"] = 38] = "PersonalEnvelope";
            // US standard fanfold (14.875 in. by 11 in.).
            _PaperKind[_PaperKind["USStandardFanfold"] = 39] = "USStandardFanfold";
            // German standard fanfold (8.5 in. by 12 in.).
            _PaperKind[_PaperKind["GermanStandardFanfold"] = 40] = "GermanStandardFanfold";
            // German legal fanfold (8.5 in. by 13 in.).
            _PaperKind[_PaperKind["GermanLegalFanfold"] = 41] = "GermanLegalFanfold";
            // ISO B4 (250 mm by 353 mm).
            _PaperKind[_PaperKind["IsoB4"] = 42] = "IsoB4";
            // Japanese postcard (100 mm by 148 mm).
            _PaperKind[_PaperKind["JapanesePostcard"] = 43] = "JapanesePostcard";
            // Standard paper (9 in. by 11 in.).
            _PaperKind[_PaperKind["Standard9x11"] = 44] = "Standard9x11";
            // Standard paper (10 in. by 11 in.).
            _PaperKind[_PaperKind["Standard10x11"] = 45] = "Standard10x11";
            // Standard paper (15 in. by 11 in.).
            _PaperKind[_PaperKind["Standard15x11"] = 46] = "Standard15x11";
            // Invitation envelope (220 mm by 220 mm).
            _PaperKind[_PaperKind["InviteEnvelope"] = 47] = "InviteEnvelope";
            // Letter extra paper (9.275 in. by 12 in.). This value is specific to the PostScript
            // driver and is used only by Linotronic printers in order to conserve paper.
            _PaperKind[_PaperKind["LetterExtra"] = 50] = "LetterExtra";
            // Legal extra paper (9.275 in. by 15 in.). This value is specific to the PostScript
            // driver and is used only by Linotronic printers in order to conserve paper.
            _PaperKind[_PaperKind["LegalExtra"] = 51] = "LegalExtra";
            // Tabloid extra paper (11.69 in. by 18 in.). This value is specific to the
            // PostScript driver and is used only by Linotronic printers in order to conserve paper.
            _PaperKind[_PaperKind["TabloidExtra"] = 52] = "TabloidExtra";
            // A4 extra paper (236 mm by 322 mm). This value is specific to the PostScript
            // driver and is used only by Linotronic printers to help save paper.
            _PaperKind[_PaperKind["A4Extra"] = 53] = "A4Extra";
            // Letter transverse paper (8.275 in. by 11 in.).
            _PaperKind[_PaperKind["LetterTransverse"] = 54] = "LetterTransverse";
            // A4 transverse paper (210 mm by 297 mm).
            _PaperKind[_PaperKind["A4Transverse"] = 55] = "A4Transverse";
            // Letter extra transverse paper (9.275 in. by 12 in.).
            _PaperKind[_PaperKind["LetterExtraTransverse"] = 56] = "LetterExtraTransverse";
            // SuperA/SuperA/A4 paper (227 mm by 356 mm).
            _PaperKind[_PaperKind["APlus"] = 57] = "APlus";
            // SuperB/SuperB/A3 paper (305 mm by 487 mm).
            _PaperKind[_PaperKind["BPlus"] = 58] = "BPlus";
            // Letter plus paper (8.5 in. by 12.69 in.).
            _PaperKind[_PaperKind["LetterPlus"] = 59] = "LetterPlus";
            // A4 plus paper (210 mm by 330 mm).
            _PaperKind[_PaperKind["A4Plus"] = 60] = "A4Plus";
            // A5 transverse paper (148 mm by 210 mm).
            _PaperKind[_PaperKind["A5Transverse"] = 61] = "A5Transverse";
            // JIS B5 transverse paper (182 mm by 257 mm).
            _PaperKind[_PaperKind["B5Transverse"] = 62] = "B5Transverse";
            // A3 extra paper (322 mm by 445 mm).
            _PaperKind[_PaperKind["A3Extra"] = 63] = "A3Extra";
            // A5 extra paper (174 mm by 235 mm).
            _PaperKind[_PaperKind["A5Extra"] = 64] = "A5Extra";
            // ISO B5 extra paper (201 mm by 276 mm).
            _PaperKind[_PaperKind["B5Extra"] = 65] = "B5Extra";
            // A2 paper (420 mm by 594 mm).
            _PaperKind[_PaperKind["A2"] = 66] = "A2";
            // A3 transverse paper (297 mm by 420 mm).
            _PaperKind[_PaperKind["A3Transverse"] = 67] = "A3Transverse";
            // A3 extra transverse paper (322 mm by 445 mm).
            _PaperKind[_PaperKind["A3ExtraTransverse"] = 68] = "A3ExtraTransverse";
            // Japanese double postcard (200 mm by 148 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["JapaneseDoublePostcard"] = 69] = "JapaneseDoublePostcard";
            // A6 paper (105 mm by 148 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["A6"] = 70] = "A6";
            // Japanese Kaku #2 envelope. Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["JapaneseEnvelopeKakuNumber2"] = 71] = "JapaneseEnvelopeKakuNumber2";
            // Japanese Kaku #3 envelope. Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["JapaneseEnvelopeKakuNumber3"] = 72] = "JapaneseEnvelopeKakuNumber3";
            // Japanese Chou #3 envelope. Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["JapaneseEnvelopeChouNumber3"] = 73] = "JapaneseEnvelopeChouNumber3";
            // Japanese Chou #4 envelope. Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["JapaneseEnvelopeChouNumber4"] = 74] = "JapaneseEnvelopeChouNumber4";
            // Letter rotated paper (11 in. by 8.5 in.).
            _PaperKind[_PaperKind["LetterRotated"] = 75] = "LetterRotated";
            // A3 rotated paper (420 mm by 297 mm).
            _PaperKind[_PaperKind["A3Rotated"] = 76] = "A3Rotated";
            //  A4 rotated paper (297 mm by 210 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["A4Rotated"] = 77] = "A4Rotated";
            // A5 rotated paper (210 mm by 148 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["A5Rotated"] = 78] = "A5Rotated";
            // JIS B4 rotated paper (364 mm by 257 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["B4JisRotated"] = 79] = "B4JisRotated";
            // JIS B5 rotated paper (257 mm by 182 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["B5JisRotated"] = 80] = "B5JisRotated";
            // Japanese rotated postcard (148 mm by 100 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["JapanesePostcardRotated"] = 81] = "JapanesePostcardRotated";
            // Japanese rotated double postcard (148 mm by 200 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["JapaneseDoublePostcardRotated"] = 82] = "JapaneseDoublePostcardRotated";
            // A6 rotated paper (148 mm by 105 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["A6Rotated"] = 83] = "A6Rotated";
            // Japanese rotated Kaku #2 envelope. Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["JapaneseEnvelopeKakuNumber2Rotated"] = 84] = "JapaneseEnvelopeKakuNumber2Rotated";
            // Japanese rotated Kaku #3 envelope. Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["JapaneseEnvelopeKakuNumber3Rotated"] = 85] = "JapaneseEnvelopeKakuNumber3Rotated";
            // Japanese rotated Chou #3 envelope. Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["JapaneseEnvelopeChouNumber3Rotated"] = 86] = "JapaneseEnvelopeChouNumber3Rotated";
            // Japanese rotated Chou #4 envelope. Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["JapaneseEnvelopeChouNumber4Rotated"] = 87] = "JapaneseEnvelopeChouNumber4Rotated";
            // JIS B6 paper (128 mm by 182 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["B6Jis"] = 88] = "B6Jis";
            // JIS B6 rotated paper (182 mm by 128 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["B6JisRotated"] = 89] = "B6JisRotated";
            // Standard paper (12 in. by 11 in.). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["Standard12x11"] = 90] = "Standard12x11";
            // Japanese You #4 envelope. Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["JapaneseEnvelopeYouNumber4"] = 91] = "JapaneseEnvelopeYouNumber4";
            // Japanese You #4 rotated envelope. Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["JapaneseEnvelopeYouNumber4Rotated"] = 92] = "JapaneseEnvelopeYouNumber4Rotated";
            // People's Republic of China 16K paper (146 mm by 215 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["Prc16K"] = 93] = "Prc16K";
            // People's Republic of China 32K paper (97 mm by 151 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["Prc32K"] = 94] = "Prc32K";
            // People's Republic of China 32K big paper (97 mm by 151 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["Prc32KBig"] = 95] = "Prc32KBig";
            // People's Republic of China #1 envelope (102 mm by 165 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber1"] = 96] = "PrcEnvelopeNumber1";
            // People's Republic of China #2 envelope (102 mm by 176 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber2"] = 97] = "PrcEnvelopeNumber2";
            // People's Republic of China #3 envelope (125 mm by 176 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber3"] = 98] = "PrcEnvelopeNumber3";
            // People's Republic of China #4 envelope (110 mm by 208 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber4"] = 99] = "PrcEnvelopeNumber4";
            // People's Republic of China #5 envelope (110 mm by 220 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber5"] = 100] = "PrcEnvelopeNumber5";
            // People's Republic of China #6 envelope (120 mm by 230 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber6"] = 101] = "PrcEnvelopeNumber6";
            // People's Republic of China #7 envelope (160 mm by 230 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber7"] = 102] = "PrcEnvelopeNumber7";
            // People's Republic of China #8 envelope (120 mm by 309 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber8"] = 103] = "PrcEnvelopeNumber8";
            // People's Republic of China #9 envelope (229 mm by 324 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber9"] = 104] = "PrcEnvelopeNumber9";
            // People's Republic of China #10 envelope (324 mm by 458 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber10"] = 105] = "PrcEnvelopeNumber10";
            // People's Republic of China 16K rotated paper (146 mm by 215 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["Prc16KRotated"] = 106] = "Prc16KRotated";
            // People's Republic of China 32K rotated paper (97 mm by 151 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["Prc32KRotated"] = 107] = "Prc32KRotated";
            // People's Republic of China 32K big rotated paper (97 mm by 151 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["Prc32KBigRotated"] = 108] = "Prc32KBigRotated";
            //  People's Republic of China #1 rotated envelope (165 mm by 102 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber1Rotated"] = 109] = "PrcEnvelopeNumber1Rotated";
            // People's Republic of China #2 rotated envelope (176 mm by 102 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber2Rotated"] = 110] = "PrcEnvelopeNumber2Rotated";
            // People's Republic of China #3 rotated envelope (176 mm by 125 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber3Rotated"] = 111] = "PrcEnvelopeNumber3Rotated";
            // People's Republic of China #4 rotated envelope (208 mm by 110 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber4Rotated"] = 112] = "PrcEnvelopeNumber4Rotated";
            // People's Republic of China Envelope #5 rotated envelope (220 mm by 110 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber5Rotated"] = 113] = "PrcEnvelopeNumber5Rotated";
            // People's Republic of China #6 rotated envelope (230 mm by 120 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber6Rotated"] = 114] = "PrcEnvelopeNumber6Rotated";
            // People's Republic of China #7 rotated envelope (230 mm by 160 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber7Rotated"] = 115] = "PrcEnvelopeNumber7Rotated";
            // People's Republic of China #8 rotated envelope (309 mm by 120 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber8Rotated"] = 116] = "PrcEnvelopeNumber8Rotated";
            // People's Republic of China #9 rotated envelope (324 mm by 229 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber9Rotated"] = 117] = "PrcEnvelopeNumber9Rotated";
            // People's Republic of China #10 rotated envelope (458 mm by 324 mm). Requires Windows 98, Windows NT 4.0, or later.
            _PaperKind[_PaperKind["PrcEnvelopeNumber10Rotated"] = 118] = "PrcEnvelopeNumber10Rotated";
        })(viewer._PaperKind || (viewer._PaperKind = {}));
        var _PaperKind = viewer._PaperKind;
        /**
         * Provides arguments for query loading data event.
         */
        var QueryLoadingDataEventArgs = (function (_super) {
            __extends(QueryLoadingDataEventArgs, _super);
            /**
             * Initializes a new instance of the @see:QueryLoadingDataEventArgs class.
             *
             * @param data The request data sent to the service on loading the document.
             */
            function QueryLoadingDataEventArgs(data) {
                _super.call(this);
                this._data = data || {};
            }
            Object.defineProperty(QueryLoadingDataEventArgs.prototype, "data", {
                /**
                 * Gets the request data sent to the service on loading the document.
                 */
                get: function () {
                    return this._data;
                },
                enumerable: true,
                configurable: true
            });
            return QueryLoadingDataEventArgs;
        }(wijmo.EventArgs));
        viewer.QueryLoadingDataEventArgs = QueryLoadingDataEventArgs;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_DocumentSource.js.map