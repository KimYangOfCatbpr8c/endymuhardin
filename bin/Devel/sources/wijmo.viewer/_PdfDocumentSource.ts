module wijmo.viewer {
    'use strict';

    // Defines the _PdfDocumentSource class.
    export class _PdfDocumentSource extends _DocumentSource {
        private _status = _ExecutionStatus.notFound;

        // Creates a _PdfDocumentSource instance.
        // @param options The pdf service information.
        constructor(options: _IDocumentService) {
            super(options);
        }

        // Gets the status of current pdf.
        get status(): string {
            return this._status;
        }

        get _innerService(): _PdfDocumentService {
            return <_PdfDocumentService>this.service;
        }

        _createDocumentService(options: _IDocumentService): _PdfDocumentService {
            return new _PdfDocumentService(options);
        }

        // Loads the current pdf document source from service.
        // @return An @see:wijmo.viewer.IPromise object with @see:_IDocumentStatus.
        load(): IPromise {
            return super.load();
        }

        _updateStatus(newValue: string) {
            if (this._status === newValue) {
                return;
            }

            this._status = newValue;
        }

        // Gets the status of pdf in server.
        // @return An @see:wijmo.viewer.IPromise object with @see:_IDocumentStatus.
        getDocumentStatus(): IPromise {
            var e = new QueryLoadingDataEventArgs();
            this.onQueryLoadingData(e);
            return this._innerService.getDocumentStatus(e.data).then(v => this._update(v));
        }

        // Renders the pdf into an export filter object.
        // @param options Options of the export.
        // @return An @see:IPromise object with XMLHttpRequest.
        renderToFilter(options: Object): IPromise {
            var e = new QueryLoadingDataEventArgs();
            this.onQueryLoadingData(e);
            return this._innerService.renderToFilter(options, e.data);
        }

        _update(data: _IExecutionInfo) {
            if (data == null) {
                return;
            }

            this._updatePageSettings(data.documentStatus.pageSettings);
            this._updateStatus(data.documentStatus.status);
            super._update(data);
        }

        _checkIsDisposed(data: _IExecutionInfo): boolean {
            return false;
        }
    }

    export class _PdfDocumentService extends _DocumentService {
        private static _apiPrefix = 'api';
        private static _pdfController = 'pdf';
        private static _statusAction = 'status';
        private static _exportAction = 'export';
        private static _supportedFormatsAction = 'supportedformats';

        private static _invalidPdfControllerError = 'Cannot call the service when service url is not set or the pdf is not loaded.';

        private _status: string;

        _getPdfUrl(...params: string[]): string {
            return _joinUrl(this.serviceUrl, _PdfDocumentService._apiPrefix, _PdfDocumentService._pdfController,
                this.filePath, params);
        }

        _getPdfStatus(data?): IPromise {
            var promise = new _Promise();
            if (!this._checkPdfController(promise)) {
                return promise;
            }

            _httpRequest(this._getPdfUrl(_PdfDocumentService._statusAction), {
                data: data,
                success: xhr => {
                    promise.resolve(_parseExecutionInfo(xhr.responseText));
                }
            });

            return promise;
        }

        _checkPdfController(promise?: _Promise): boolean {
            if (this.serviceUrl != null && this.filePath) {
                return true;
            }

            if (promise) {
                promise.reject(_PdfDocumentService._invalidPdfControllerError);
            }

            return false;
        }

        //Returns IPromise with _IExecutionInfo.
        dispose(): IPromise {
            var promise = new _Promise();
            promise.resolve();

            return promise;
        }

        //Returns IPromise with _IExecutionInfo.
        load(data?): IPromise {
            return this._getPdfStatus(data);
        }

        //Returns IPromise with _IExecutionInfo.
        getDocumentStatus(data?): IPromise {
            return this._getPdfStatus(data);
        }

        renderToFilter(options: Object, data?): IPromise {
            var promise = new _Promise();
            if (!this._checkPdfController(promise)) {
                return promise;
            }

            _httpRequest(this.getRenderToFilterUrl(options), {
                data: data,
                cache: true,
                success: xhr => {
                    promise.resolve(xhr);
                }
            });

            return promise;
        }

        getRenderToFilterUrl(options: Object): string {
            if (!this._checkPdfController()) {
                return null;
            }

            var url = this._getPdfUrl(_PdfDocumentService._exportAction);
            url = _disableCache(url);
            return _appendQueryString(url, options);
        }

        // Return an IPromise with _IExportDescription[].
        getSupportedExportDescriptions(): IPromise {
            var promise = new _Promise();
            if (!this._checkPdfController(promise)) {
                return promise;
            }

            _httpRequest(this._getPdfUrl(_PdfDocumentService._supportedFormatsAction), {
                success: xhr => {
                    promise.resolve(JSON.parse(xhr.responseText));
                }
            });

            return promise;
        }
    }

    export function _parseExecutionInfo(json: string): _IExecutionInfo {
        return JSON.parse(json, _statusJsonReviver);
    }
}