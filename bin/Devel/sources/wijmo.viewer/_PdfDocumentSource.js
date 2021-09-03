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
        // Defines the _PdfDocumentSource class.
        var _PdfDocumentSource = (function (_super) {
            __extends(_PdfDocumentSource, _super);
            // Creates a _PdfDocumentSource instance.
            // @param options The pdf service information.
            function _PdfDocumentSource(options) {
                _super.call(this, options);
                this._status = viewer._ExecutionStatus.notFound;
            }
            Object.defineProperty(_PdfDocumentSource.prototype, "status", {
                // Gets the status of current pdf.
                get: function () {
                    return this._status;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PdfDocumentSource.prototype, "_innerService", {
                get: function () {
                    return this.service;
                },
                enumerable: true,
                configurable: true
            });
            _PdfDocumentSource.prototype._createDocumentService = function (options) {
                return new _PdfDocumentService(options);
            };
            // Loads the current pdf document source from service.
            // @return An @see:wijmo.viewer.IPromise object with @see:_IDocumentStatus.
            _PdfDocumentSource.prototype.load = function () {
                return _super.prototype.load.call(this);
            };
            _PdfDocumentSource.prototype._updateStatus = function (newValue) {
                if (this._status === newValue) {
                    return;
                }
                this._status = newValue;
            };
            // Gets the status of pdf in server.
            // @return An @see:wijmo.viewer.IPromise object with @see:_IDocumentStatus.
            _PdfDocumentSource.prototype.getDocumentStatus = function () {
                var _this = this;
                var e = new viewer.QueryLoadingDataEventArgs();
                this.onQueryLoadingData(e);
                return this._innerService.getDocumentStatus(e.data).then(function (v) { return _this._update(v); });
            };
            // Renders the pdf into an export filter object.
            // @param options Options of the export.
            // @return An @see:IPromise object with XMLHttpRequest.
            _PdfDocumentSource.prototype.renderToFilter = function (options) {
                var e = new viewer.QueryLoadingDataEventArgs();
                this.onQueryLoadingData(e);
                return this._innerService.renderToFilter(options, e.data);
            };
            _PdfDocumentSource.prototype._update = function (data) {
                if (data == null) {
                    return;
                }
                this._updatePageSettings(data.documentStatus.pageSettings);
                this._updateStatus(data.documentStatus.status);
                _super.prototype._update.call(this, data);
            };
            _PdfDocumentSource.prototype._checkIsDisposed = function (data) {
                return false;
            };
            return _PdfDocumentSource;
        }(viewer._DocumentSource));
        viewer._PdfDocumentSource = _PdfDocumentSource;
        var _PdfDocumentService = (function (_super) {
            __extends(_PdfDocumentService, _super);
            function _PdfDocumentService() {
                _super.apply(this, arguments);
            }
            _PdfDocumentService.prototype._getPdfUrl = function () {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i - 0] = arguments[_i];
                }
                return viewer._joinUrl(this.serviceUrl, _PdfDocumentService._apiPrefix, _PdfDocumentService._pdfController, this.filePath, params);
            };
            _PdfDocumentService.prototype._getPdfStatus = function (data) {
                var promise = new viewer._Promise();
                if (!this._checkPdfController(promise)) {
                    return promise;
                }
                viewer._httpRequest(this._getPdfUrl(_PdfDocumentService._statusAction), {
                    data: data,
                    success: function (xhr) {
                        promise.resolve(_parseExecutionInfo(xhr.responseText));
                    }
                });
                return promise;
            };
            _PdfDocumentService.prototype._checkPdfController = function (promise) {
                if (this.serviceUrl != null && this.filePath) {
                    return true;
                }
                if (promise) {
                    promise.reject(_PdfDocumentService._invalidPdfControllerError);
                }
                return false;
            };
            //Returns IPromise with _IExecutionInfo.
            _PdfDocumentService.prototype.dispose = function () {
                var promise = new viewer._Promise();
                promise.resolve();
                return promise;
            };
            //Returns IPromise with _IExecutionInfo.
            _PdfDocumentService.prototype.load = function (data) {
                return this._getPdfStatus(data);
            };
            //Returns IPromise with _IExecutionInfo.
            _PdfDocumentService.prototype.getDocumentStatus = function (data) {
                return this._getPdfStatus(data);
            };
            _PdfDocumentService.prototype.renderToFilter = function (options, data) {
                var promise = new viewer._Promise();
                if (!this._checkPdfController(promise)) {
                    return promise;
                }
                viewer._httpRequest(this.getRenderToFilterUrl(options), {
                    data: data,
                    cache: true,
                    success: function (xhr) {
                        promise.resolve(xhr);
                    }
                });
                return promise;
            };
            _PdfDocumentService.prototype.getRenderToFilterUrl = function (options) {
                if (!this._checkPdfController()) {
                    return null;
                }
                var url = this._getPdfUrl(_PdfDocumentService._exportAction);
                url = viewer._disableCache(url);
                return viewer._appendQueryString(url, options);
            };
            // Return an IPromise with _IExportDescription[].
            _PdfDocumentService.prototype.getSupportedExportDescriptions = function () {
                var promise = new viewer._Promise();
                if (!this._checkPdfController(promise)) {
                    return promise;
                }
                viewer._httpRequest(this._getPdfUrl(_PdfDocumentService._supportedFormatsAction), {
                    success: function (xhr) {
                        promise.resolve(JSON.parse(xhr.responseText));
                    }
                });
                return promise;
            };
            _PdfDocumentService._apiPrefix = 'api';
            _PdfDocumentService._pdfController = 'pdf';
            _PdfDocumentService._statusAction = 'status';
            _PdfDocumentService._exportAction = 'export';
            _PdfDocumentService._supportedFormatsAction = 'supportedformats';
            _PdfDocumentService._invalidPdfControllerError = 'Cannot call the service when service url is not set or the pdf is not loaded.';
            return _PdfDocumentService;
        }(viewer._DocumentService));
        viewer._PdfDocumentService = _PdfDocumentService;
        function _parseExecutionInfo(json) {
            return JSON.parse(json, viewer._statusJsonReviver);
        }
        viewer._parseExecutionInfo = _parseExecutionInfo;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_PdfDocumentSource.js.map