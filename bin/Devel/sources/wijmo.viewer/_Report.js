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
        // Defines a _Report class.
        var _Report = (function (_super) {
            __extends(_Report, _super);
            // Creates a _Report instance.
            // @param options The report service information.
            function _Report(options) {
                _super.call(this, options);
                this._hasParameters = false;
                this._status = _ExecutionStatus.notFound;
                // Occurs when the status property value changes.
                this.statusChanged = new wijmo.Event();
            }
            // Gets the report names defined in the specified FlexReport definition file.
            // @param serviceUrl The root url of service.
            // @param reportFilePath The report file path.
            // @return An @see:wijmo.viewer.IPromise object with a string array which contians the report names.
            _Report.getReportNames = function (serviceUrl, reportFilePath) {
                return _ReportService.getReportNames(serviceUrl, reportFilePath);
            };
            // Gets the catalog items in the specific folder path.
            // @param serviceUrl The root url of service.
            // @param path The folder path.
            // @param data The request data sent to the report service, or a boolean value indicates whether getting all items under the path.
            // @param An @see:IPromise object with an array of @see:ICatalogItem.
            _Report.getReports = function (serviceUrl, path, data) {
                if (wijmo.isBoolean(data)) {
                    data = { recursive: data };
                }
                return _ReportService.getReports(serviceUrl, path, data);
            };
            Object.defineProperty(_Report.prototype, "reportName", {
                // Gets the report name.
                get: function () {
                    return this._innerService ? this._innerService.reportName : null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_Report.prototype, "hasParameters", {
                // Gets a boolean value indicates whether current report has parameters.
                get: function () {
                    return this._hasParameters;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_Report.prototype, "status", {
                // Gets the status of current report.
                get: function () {
                    return this._status;
                },
                enumerable: true,
                configurable: true
            });
            // Loads the current document source from service.
            // @return An @see:wijmo.viewer.IPromise object with @see:_IReportExecutionInfo.
            _Report.prototype.load = function () {
                return _super.prototype.load.call(this);
            };
            _Report.prototype._updateStatus = function (newValue) {
                if (this._status === newValue) {
                    return;
                }
                this._status = newValue;
                this.onStatusChanged();
            };
            // Stops the rendering of current document source.
            // @return An @see:wijmo.viewer.IPromise object with @see:_IReportExecutionInfo.
            _Report.prototype.cancel = function () {
                var _this = this;
                return this._innerService.cancel().then(function (v) { return _this._update(v); });
            };
            // Raises the @see:statusChanged event.
            // @param e The event arguments.
            _Report.prototype.onStatusChanged = function (e) {
                this.statusChanged.raise(this, e || new wijmo.EventArgs());
            };
            // Gets the status of cached report in server.
            // @return An @see:wijmo.viewer.IPromise object with @see:_IReportExecutionInfo.
            _Report.prototype.getDocumentStatus = function () {
                var _this = this;
                return this._innerService.getDocumentStatus().then(function (v) { return _this._update(v); });
            };
            // Remove the current document source from service.
            // @return An @see:wijmo.viewer.IPromise object with @see:_IReportExecutionInfo.
            _Report.prototype.dispose = function () {
                return _super.prototype.dispose.call(this);
            };
            // Set the parameters.
            // @param parameters Parameters for the report.
            // @return An @see:wijmo.viewer.IPromise object with an @see:_IParameter array.
            _Report.prototype.setParameters = function (parameters) {
                var _this = this;
                return this._innerService.setParameters(parameters).then(function (v) { return void (_this._parameters = v); });
            };
            // Gets an array of parameter of current document source.
            // @return An @see:wijmo.viewer.IPromise object with an @see:_IParameter array.
            _Report.prototype.getParameters = function () {
                var _this = this;
                if (this._parameters && this._parameters.length) {
                    var promise = new viewer._Promise();
                    promise.resolve(this._parameters);
                    return promise;
                }
                return this._innerService.getParameters().then(function (v) { return void (_this._parameters = v); });
            };
            _Report.prototype._getIsDisposed = function () {
                return _super.prototype._getIsDisposed.call(this) || this._innerService.isCleared;
            };
            _Report.prototype._update = function (data) {
                if (data == null || this.isDisposed) {
                    return;
                }
                var reportStatus = data.documentStatus;
                this._updatePageSettings(reportStatus.pageSettings);
                this._hasParameters = !!reportStatus.hasParameters;
                this._updateStatus(reportStatus.status);
                _super.prototype._update.call(this, data);
            };
            _Report.prototype._checkIsLoadCompleted = function (data) {
                return data.documentStatus.status === _ExecutionStatus.completed
                    || data.documentStatus.status === _ExecutionStatus.stopped
                    || data.isCleared;
            };
            _Report.prototype._checkIsDisposed = function (data) {
                return this.isDisposed || data.isCleared;
            };
            _Report.prototype._createDocumentService = function (options) {
                return new _ReportService(options);
            };
            Object.defineProperty(_Report.prototype, "_innerService", {
                get: function () {
                    return this.service;
                },
                enumerable: true,
                configurable: true
            });
            // Render the report.
            // @return An @see:wijmo.viewer.IPromise object with @see:_IReportExecutionInfo.
            _Report.prototype.render = function () {
                var _this = this;
                return this._innerService.render().then(function (v) { return _this._update(v); });
            };
            return _Report;
        }(viewer._DocumentSource));
        viewer._Report = _Report;
        var _ReportService = (function (_super) {
            __extends(_ReportService, _super);
            // Create a document service with options.
            function _ReportService(options) {
                _super.call(this, options);
                this._reportName = options.reportName;
            }
            Object.defineProperty(_ReportService.prototype, "isCleared", {
                get: function () {
                    return !this._cacheId && this._status == _ExecutionStatus.cleared;
                },
                enumerable: true,
                configurable: true
            });
            // Gets the report names defined in the specified FlexReport definition file.
            // @param serviceUrl The root url of service.
            // @param reportUrl The report url of service.
            // @return An @see:IPromise object with a string array of report names.
            _ReportService.getReportNames = function (serviceUrl, reportFilePath) {
                return _ReportService.getReports(serviceUrl, reportFilePath).then(function (items) {
                    if (!items)
                        return null;
                    var names = [];
                    items.forEach(function (item) {
                        if (item.type === CatalogItemType.Report) {
                            names.push(item.name);
                        }
                    });
                    return names;
                });
            };
            // Gets the catalog items in the specific folder path.
            // @param serviceUrl The root url of service.
            // @param path The folder path.
            // @param data The request data sent to the report service.
            // @param An @see:IPromise object with an array of @see:ICatalogItem.
            _ReportService.getReports = function (serviceUrl, path, data) {
                var promise = new viewer._Promise(), url = viewer._joinUrl(serviceUrl, _ReportService._apiPrefix, _ReportService._reportsController, path);
                viewer._httpRequest(url, {
                    data: data,
                    success: function (xhr) {
                        promise.resolve(JSON.parse(xhr.responseText));
                    }
                });
                return promise;
            };
            Object.defineProperty(_ReportService.prototype, "reportName", {
                // Gets the report name.
                get: function () {
                    return this._reportName;
                },
                enumerable: true,
                configurable: true
            });
            _ReportService.prototype.getBookmark = function (name) {
                var promise = new viewer._Promise();
                if (!this._checkReportCacheController(promise)) {
                    return promise;
                }
                viewer._httpRequest(this._getReportCacheUrl(_ReportService._bookmarkAction), {
                    success: function (xhr) {
                        promise.resolve(JSON.parse(xhr.responseText));
                    },
                    data: { 'name': name }
                });
                return promise;
            };
            _ReportService.prototype.executeCustomAction = function (actionString) {
                var _this = this;
                var promise = new viewer._Promise();
                if (!this._checkReportCacheController(promise)) {
                    return promise;
                }
                viewer._httpRequest(this._getReportCacheUrl(_ReportService._customActionAction), {
                    data: { actionString: actionString },
                    success: function (xhr) {
                        promise.resolve(JSON.parse(xhr.responseText));
                    },
                    error: function (xhr) {
                        promise.reject(_this._getError(xhr));
                    }
                });
                return promise;
            };
            _ReportService.prototype.getDocumentStatus = function () {
                return this._getReportCache();
            };
            _ReportService.prototype._getReportCache = function () {
                var promise = new viewer._Promise();
                if (!this._checkReportCacheController(promise)) {
                    return promise;
                }
                viewer._httpRequest(this._getReportCacheUrl(), {
                    success: function (xhr) {
                        promise.resolve(_parseReportExecutionInfo(xhr.responseText));
                    }
                });
                return promise;
            };
            _ReportService.prototype.getParameters = function () {
                var promise = new viewer._Promise();
                if (!this._checkReportCacheController(promise)) {
                    return promise;
                }
                viewer._httpRequest(this._getReportCacheUrl(_ReportService._parametersAction), {
                    success: function (xhr) {
                        promise.resolve(JSON.parse(xhr.responseText));
                    }
                });
                return promise;
            };
            _ReportService.prototype._getReportUrl = function () {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i - 0] = arguments[_i];
                }
                return viewer._joinUrl(this.serviceUrl, _ReportService._apiPrefix, _ReportService._reportController, this.filePath, this.reportName, params);
            };
            _ReportService.prototype._getReportCacheUrl = function () {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i - 0] = arguments[_i];
                }
                return viewer._joinUrl(this.serviceUrl, _ReportService._apiPrefix, _ReportService._reportCacheController, this._cacheId, params);
            };
            _ReportService.prototype._checkReportController = function (promise) {
                if (this.serviceUrl != null && this.filePath) {
                    var isFlexReport = this.filePath.slice(-5).toLowerCase() === '.flxr'
                        || this.filePath.slice(-4).toLowerCase() === '.xml';
                    if (!isFlexReport || this.reportName) {
                        return true;
                    }
                }
                if (promise) {
                    promise.reject(_ReportService._invalidReportControllerError);
                }
                return false;
            };
            _ReportService.prototype._checkReportCacheController = function (promise) {
                if (this.serviceUrl != null && this._cacheId) {
                    return true;
                }
                if (promise) {
                    promise.reject(_ReportService._invalidReportCacheControllerError);
                }
                return false;
            };
            _ReportService.prototype._getError = function (xhr) {
                var reason = xhr.responseText;
                try {
                    reason = JSON.parse(reason);
                }
                finally {
                    return reason;
                }
            };
            _ReportService.prototype.render = function () {
                var _this = this;
                var promise = new viewer._Promise();
                if (!this._checkReportCacheController(promise)) {
                    return promise;
                }
                viewer._httpRequest(this._getReportCacheUrl(_ReportService._renderAction), {
                    success: function (xhr) {
                        promise.resolve(_parseReportExecutionInfo(xhr.responseText));
                    },
                    error: function (xhr) {
                        promise.reject(_this._getError(xhr));
                    }
                });
                return promise.then(function (v) {
                    _this._status = v.status;
                });
            };
            _ReportService.prototype.load = function (data) {
                var _this = this;
                var promise = new viewer._Promise();
                if (!this._checkReportController(promise)) {
                    return promise;
                }
                viewer._httpRequest(this._getReportUrl(_ReportService._loadAction), {
                    data: data,
                    success: function (xhr) {
                        promise.resolve(_parseReportExecutionInfo(xhr.responseText));
                    },
                    error: function (xhr) {
                        promise.reject(_this._getError(xhr));
                    }
                });
                return promise.then(function (v) {
                    _this._cacheId = v.cacheId;
                    _this._status = v.status;
                });
            };
            _ReportService.prototype.cancel = function () {
                var _this = this;
                var promise = new viewer._Promise();
                if (!this._checkReportCacheController(promise)) {
                    return promise;
                }
                if (this._status !== _ExecutionStatus.rendering) {
                    promise.reject('Cannot execute cancel when the report is not rendering.');
                    return promise;
                }
                viewer._httpRequest(this._getReportCacheUrl(_ReportService._cancelAction), {
                    success: function (xhr) {
                        promise.resolve(_parseReportExecutionInfo(xhr.responseText));
                    }
                });
                promise.then(function (v) { return void (_this._status = v.status); });
                return promise;
            };
            _ReportService.prototype.dispose = function () {
                var _this = this;
                var promise = new viewer._Promise();
                // The reason of not passing promise to _checkReportCacheController is:
                // do nothing When cacheId is not generated.
                if (!this._checkReportCacheController()) {
                    return promise;
                }
                viewer._httpRequest(this._getReportCacheUrl(), {
                    method: 'DELETE',
                    success: function (xhr) {
                        var info = JSON.parse(xhr.responseText);
                        if (info.isCleared) {
                            _this._status = _ExecutionStatus.cleared;
                        }
                        _this._cacheId = '';
                        promise.resolve(info);
                    }
                });
                return promise;
            };
            _ReportService.prototype.getOutlines = function () {
                var promise = new viewer._Promise();
                if (!this._checkReportCacheController(promise)) {
                    return promise;
                }
                viewer._httpRequest(this._getReportCacheUrl(_ReportService._outlinesAction), {
                    success: function (xhr) {
                        promise.resolve(JSON.parse(xhr.responseText));
                    }
                });
                return promise;
            };
            _ReportService.prototype.renderToFilter = function (options) {
                var _this = this;
                var promise = new viewer._Promise();
                if (!this._checkReportCacheController(promise)) {
                    return promise;
                }
                viewer._httpRequest(this.getRenderToFilterUrl(options), {
                    cache: true,
                    success: function (xhr) {
                        promise.resolve(xhr);
                    },
                    error: function (xhr) {
                        promise.reject(_this._getError(xhr));
                    }
                });
                return promise;
            };
            _ReportService.prototype.getRenderToFilterUrl = function (options) {
                if (!this._checkReportCacheController()) {
                    return null;
                }
                var url = this._getReportCacheUrl(_ReportService._exportAction);
                url = viewer._disableCache(url);
                return viewer._appendQueryString(url, options);
            };
            _ReportService.prototype.search = function (text, matchCase, wholeWord) {
                var promise = new viewer._Promise();
                if (!this._checkReportCacheController(promise)) {
                    return promise;
                }
                viewer._httpRequest(this._getReportCacheUrl(_ReportService._searchAction), {
                    success: function (xhr) {
                        promise.resolve(JSON.parse(xhr.responseText));
                    },
                    data: {
                        'text': text,
                        'matchCase': !!matchCase,
                        'wholeWord': !!wholeWord
                    }
                });
                return promise;
            };
            _ReportService.prototype.setPageSettings = function (pageSettings) {
                var _this = this;
                var promise = new viewer._Promise();
                if (!this._checkReportCacheController(promise)) {
                    return promise;
                }
                ;
                var url = this._getReportCacheUrl(_ReportService._pageSettingsAction);
                viewer._httpRequest(url, {
                    method: 'POST',
                    data: pageSettings,
                    success: function (xhr) {
                        promise.resolve(JSON.parse(xhr.responseText, viewer._pageSettingsJsonReviver));
                    },
                    error: function (xhr) {
                        promise.reject(_this._getError(xhr));
                    }
                });
                return promise;
            };
            _ReportService.prototype.setParameters = function (parameters) {
                var _this = this;
                var promise = new viewer._Promise();
                if (!this._checkReportCacheController(promise)) {
                    return promise;
                }
                ;
                var url = this._getReportCacheUrl(_ReportService._parametersAction);
                viewer._httpRequest(url, {
                    method: 'POST',
                    data: parameters,
                    success: function (xhr) {
                        promise.resolve(JSON.parse(xhr.responseText));
                    },
                    error: function (xhr) {
                        promise.reject(_this._getError(xhr));
                    }
                });
                return promise;
            };
            // Return an IPromise with _IExportDescription[].
            _ReportService.prototype.getSupportedExportDescriptions = function () {
                var promise = new viewer._Promise();
                if (!this._checkReportController(promise)) {
                    return promise;
                }
                viewer._httpRequest(this._getReportUrl(_ReportService._supportedFormatsAction), {
                    success: function (xhr) {
                        promise.resolve(JSON.parse(xhr.responseText));
                    }
                });
                return promise;
            };
            _ReportService._apiPrefix = 'api';
            _ReportService._renderAction = 'render';
            _ReportService._loadAction = 'load';
            _ReportService._searchAction = 'search';
            _ReportService._cancelAction = 'stop';
            _ReportService._outlinesAction = 'outlines';
            _ReportService._exportAction = 'export';
            _ReportService._reportsController = 'reports';
            _ReportService._reportController = 'report';
            _ReportService._reportCacheController = 'reportcache';
            _ReportService._parametersAction = 'parameters';
            _ReportService._bookmarkAction = 'bookmark';
            _ReportService._customActionAction = 'customaction';
            _ReportService._pageSettingsAction = 'pagesettings';
            _ReportService._supportedFormatsAction = 'supportedformats';
            _ReportService._invalidReportControllerError = 'Cannot call the service without service url, document path or report name.';
            _ReportService._invalidReportCacheControllerError = 'Cannot call the service when service url is not set or the report is not loaded.';
            return _ReportService;
        }(viewer._DocumentService));
        viewer._ReportService = _ReportService;
        function _parseReportExecutionInfo(json) {
            return JSON.parse(json, viewer._statusJsonReviver);
        }
        viewer._parseReportExecutionInfo = _parseReportExecutionInfo;
        // Describes the status of the execution.
        var _ExecutionStatus = (function () {
            function _ExecutionStatus() {
            }
            // The report is Loaded.
            _ExecutionStatus.loaded = 'Loaded';
            // The report is rendering.
            _ExecutionStatus.rendering = 'Rendering';
            // The report is rendered.
            _ExecutionStatus.completed = 'Completed';
            // The report rendering is stopped.
            _ExecutionStatus.stopped = 'Stopped';
            // The report is cleared.
            _ExecutionStatus.cleared = 'Cleared';
            // The execution is not found.
            _ExecutionStatus.notFound = 'NotFound';
            return _ExecutionStatus;
        }());
        viewer._ExecutionStatus = _ExecutionStatus;
        // Specifies the type of a value.
        (function (_ParameterType) {
            // Bool type.
            _ParameterType[_ParameterType["Boolean"] = 0] = "Boolean";
            // Date time type.
            _ParameterType[_ParameterType["DateTime"] = 1] = "DateTime";
            // Time type.
            _ParameterType[_ParameterType["Time"] = 2] = "Time";
            // Date type
            _ParameterType[_ParameterType["Date"] = 3] = "Date";
            // Int type.
            _ParameterType[_ParameterType["Integer"] = 4] = "Integer";
            // Float type.
            _ParameterType[_ParameterType["Float"] = 5] = "Float";
            // String type
            _ParameterType[_ParameterType["String"] = 6] = "String";
        })(viewer._ParameterType || (viewer._ParameterType = {}));
        var _ParameterType = viewer._ParameterType;
        /**
        * Specifies the type of a catalog item.
        */
        (function (CatalogItemType) {
            /**
            * A folder.
            */
            CatalogItemType[CatalogItemType["Folder"] = 0] = "Folder";
            /**
            * A FlexReport definition file.
            */
            CatalogItemType[CatalogItemType["File"] = 1] = "File";
            /**
            * An SSRS report or one FlexReport defined in the .flxr file.
            */
            CatalogItemType[CatalogItemType["Report"] = 2] = "Report";
        })(viewer.CatalogItemType || (viewer.CatalogItemType = {}));
        var CatalogItemType = viewer.CatalogItemType;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_Report.js.map