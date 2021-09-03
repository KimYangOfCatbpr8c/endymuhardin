module wijmo.viewer {
    'use strict';

    // Defines a _Report class.
    export class _Report extends _DocumentSource {

        private _hasParameters = false;
        private _parameters: _IParameter[];
        private _status = _ExecutionStatus.notFound;

        // Creates a _Report instance.
        // @param options The report service information.
        constructor(options: _IReportOptions) {
            super(options);
        }

        // Gets the report names defined in the specified FlexReport definition file.
        // @param serviceUrl The root url of service.
        // @param reportFilePath The report file path.
        // @return An @see:wijmo.viewer.IPromise object with a string array which contians the report names.
        static getReportNames(serviceUrl: string, reportFilePath: string): IPromise {
            return _ReportService.getReportNames(serviceUrl, reportFilePath);
        }

        // Gets the catalog items in the specific folder path.
        // @param serviceUrl The root url of service.
        // @param path The folder path.
        // @param data The request data sent to the report service, or a boolean value indicates whether getting all items under the path.
        // @param An @see:IPromise object with an array of @see:ICatalogItem.
        static getReports(serviceUrl: string, path: string, data?: any): IPromise {
            if (wijmo.isBoolean(data)) {
                data = { recursive: data };
            }
            return _ReportService.getReports(serviceUrl, path, data);
        }

        // Gets the report name.
        get reportName(): string {
            return this._innerService ? this._innerService.reportName : null;
        }

        // Occurs when the status property value changes.
        statusChanged = new Event();

        // Gets a boolean value indicates whether current report has parameters.
        get hasParameters(): boolean {
            return this._hasParameters;
        }

        // Gets the status of current report.
        get status(): string {
            return this._status;
        }

        // Loads the current document source from service.
        // @return An @see:wijmo.viewer.IPromise object with @see:_IReportExecutionInfo.
        load(): IPromise {
            return super.load();
        }

        _updateStatus(newValue: string) {
            if (this._status === newValue) {
                return;
            }

            this._status = newValue;
            this.onStatusChanged();
        }

        // Stops the rendering of current document source.
        // @return An @see:wijmo.viewer.IPromise object with @see:_IReportExecutionInfo.
        cancel(): IPromise {
            return this._innerService.cancel().then(v => this._update(v));
        }

        // Raises the @see:statusChanged event.
        // @param e The event arguments.
        onStatusChanged(e?: EventArgs): void {
            this.statusChanged.raise(this, e || new EventArgs());
        }

        // Gets the status of cached report in server.
        // @return An @see:wijmo.viewer.IPromise object with @see:_IReportExecutionInfo.
        getDocumentStatus(): IPromise {
            return this._innerService.getDocumentStatus().then(v => this._update(v));
        }

        // Remove the current document source from service.
        // @return An @see:wijmo.viewer.IPromise object with @see:_IReportExecutionInfo.
        dispose(): IPromise {
            return super.dispose();
        }

        // Set the parameters.
        // @param parameters Parameters for the report.
        // @return An @see:wijmo.viewer.IPromise object with an @see:_IParameter array.
        setParameters(parameters: Object): IPromise {
            return this._innerService.setParameters(parameters).then(v => void (this._parameters = v));
        }

        // Gets an array of parameter of current document source.
        // @return An @see:wijmo.viewer.IPromise object with an @see:_IParameter array.
        getParameters(): IPromise {
            if (this._parameters && this._parameters.length) {
                var promise = new _Promise();
                promise.resolve(this._parameters);
                return promise;
            }

            return this._innerService.getParameters().then(v => void (this._parameters = v));
        }

        _getIsDisposed(): boolean {
            return super._getIsDisposed() || this._innerService.isCleared;
        }

        _update(data: _IReportExecutionInfo) {
            if (data == null || this.isDisposed) {
                return;
            }

            var reportStatus = <_IReportStatus>data.documentStatus;
            this._updatePageSettings(reportStatus.pageSettings);
            this._hasParameters = !!reportStatus.hasParameters;
            this._updateStatus(reportStatus.status);
            super._update(data);
        }

        _checkIsLoadCompleted(data: _IReportExecutionInfo): boolean {
            return data.documentStatus.status === _ExecutionStatus.completed
                || data.documentStatus.status === _ExecutionStatus.stopped
                || data.isCleared;
        }

        _checkIsDisposed(data: _IReportExecutionInfo): boolean {
            return this.isDisposed || data.isCleared;
        }

        _createDocumentService(options: _IReportService): _ReportService {
            return new _ReportService(options);
        }

        get _innerService(): _ReportService {
            return <_ReportService>this.service;
        }

        // Render the report.
        // @return An @see:wijmo.viewer.IPromise object with @see:_IReportExecutionInfo.
        render(): IPromise {
            return this._innerService.render().then(v => this._update(v));
        }
    }

    export interface _IReportService extends _IDocumentService {
        // The report name.
        reportName: string;
    }

    export interface _IReportOptions extends _IDocumentOptions, _IReportService {
    }

    export class _ReportService extends _DocumentService implements _IReportService {
        private _reportName: string;
        private static _apiPrefix = 'api';
        private static _renderAction = 'render';
        private static _loadAction = 'load';
        private static _searchAction = 'search';
        private static _cancelAction = 'stop';
        private static _outlinesAction = 'outlines';
        private static _exportAction = 'export';
        private static _reportsController = 'reports';
        private static _reportController = 'report';
        private static _reportCacheController = 'reportcache';
        private static _parametersAction = 'parameters';
        private static _bookmarkAction = 'bookmark';
        private static _customActionAction = 'customaction';
        private static _pageSettingsAction = 'pagesettings';
        private static _supportedFormatsAction = 'supportedformats';
        private _cacheId: string;
        private _status: string;
        private static _invalidReportControllerError = 'Cannot call the service without service url, document path or report name.';
        private static _invalidReportCacheControllerError = 'Cannot call the service when service url is not set or the report is not loaded.';


        // Create a document service with options.
        constructor(options: _IReportService) {
            super(options);
            this._reportName = options.reportName;
        }

        get isCleared(): boolean {
            return !this._cacheId && this._status == _ExecutionStatus.cleared;
        }

        // Gets the report names defined in the specified FlexReport definition file.
        // @param serviceUrl The root url of service.
        // @param reportUrl The report url of service.
        // @return An @see:IPromise object with a string array of report names.
        static getReportNames(serviceUrl: string, reportFilePath: string): IPromise {
            return _ReportService.getReports(serviceUrl, reportFilePath).then((items: ICatalogItem[]) => {
                if (!items) return null;
                var names = [];
                items.forEach((item) => {
                    if (item.type === CatalogItemType.Report) {
                        names.push(item.name);
                    }
                });
                return names;
            });
        }

        // Gets the catalog items in the specific folder path.
        // @param serviceUrl The root url of service.
        // @param path The folder path.
        // @param data The request data sent to the report service.
        // @param An @see:IPromise object with an array of @see:ICatalogItem.
        static getReports(serviceUrl: string, path: string, data?: any): IPromise {
            var promise = new _Promise(),
                url = _joinUrl(serviceUrl, _ReportService._apiPrefix, _ReportService._reportsController, path);

            _httpRequest(url, {
                data: data,
                success: xhr => {
                    promise.resolve(JSON.parse(xhr.responseText));
                }
            });

            return promise;
        }

        // Gets the report name.
        get reportName(): string {
            return this._reportName;
        }

        getBookmark(name: string): IPromise {
            var promise = new _Promise();
            if (!this._checkReportCacheController(promise)) {
                return promise;
            }

            _httpRequest(this._getReportCacheUrl(_ReportService._bookmarkAction), {
                success: xhr => {
                    promise.resolve(JSON.parse(xhr.responseText));
                },
                data: { 'name': name }
            });

            return promise;
        }

        executeCustomAction(actionString: string): IPromise {
            var promise = new _Promise();
            if (!this._checkReportCacheController(promise)) {
                return promise;
            }

            _httpRequest(this._getReportCacheUrl(_ReportService._customActionAction), {
                data: { actionString: actionString },
                success: xhr => {
                    promise.resolve(JSON.parse(xhr.responseText));
                },
                error: xhr => {
                    promise.reject(this._getError(xhr));
                }
            });

            return promise;
        }

        getDocumentStatus(): IPromise {
            return this._getReportCache();
        }

        _getReportCache(): IPromise {
            var promise = new _Promise();
            if (!this._checkReportCacheController(promise)) {
                return promise;
            }

            _httpRequest(this._getReportCacheUrl(), {
                success: xhr => {
                    promise.resolve(_parseReportExecutionInfo(xhr.responseText));
                }
            });

            return promise;
        }

        getParameters(): IPromise {
            var promise = new _Promise();
            if (!this._checkReportCacheController(promise)) {
                return promise;
            }

            _httpRequest(this._getReportCacheUrl(_ReportService._parametersAction), {
                success: xhr => {
                    promise.resolve(JSON.parse(xhr.responseText));
                }
            });

            return promise;
        }

        _getReportUrl(...params: string[]): string {
            return _joinUrl(this.serviceUrl, _ReportService._apiPrefix, _ReportService._reportController,
                this.filePath, this.reportName, params);
        }

        _getReportCacheUrl(...params: string[]): string {
            return _joinUrl(this.serviceUrl, _ReportService._apiPrefix, _ReportService._reportCacheController,
                this._cacheId, params);
        }

        _checkReportController(promise: _Promise): boolean {
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
        }

        _checkReportCacheController(promise?: _Promise): boolean {
            if (this.serviceUrl != null && this._cacheId) {
                return true;
            }

            if (promise) {
                promise.reject(_ReportService._invalidReportCacheControllerError);
            }

            return false;
        }

        _getError(xhr: XMLHttpRequest) {
            var reason = xhr.responseText;
            try {
                reason = JSON.parse(reason);
            } finally {
                return reason;
            }
        }

        render(): IPromise {
            var promise = new _Promise();
            if (!this._checkReportCacheController(promise)) {
                return promise;
            }

            _httpRequest(this._getReportCacheUrl(_ReportService._renderAction), {
                success: xhr => {
                    promise.resolve(_parseReportExecutionInfo(xhr.responseText));
                },
                error: xhr => {
                    promise.reject(this._getError(xhr));
                }
            });

            return promise.then(v => {
                this._status = v.status;
            });
        }

        load(data?): IPromise {
            var promise = new _Promise();
            if (!this._checkReportController(promise)) {
                return promise;
            }

            _httpRequest(this._getReportUrl(_ReportService._loadAction), {
                data: data,
                success: xhr => {
                    promise.resolve(_parseReportExecutionInfo(xhr.responseText));
                },
                error: xhr => {
                    promise.reject(this._getError(xhr));
                }
            });

            return promise.then(v => {
                this._cacheId = v.cacheId;
                this._status = v.status;
            });
        }

        cancel(): IPromise {
            var promise = new _Promise();
            if (!this._checkReportCacheController(promise)) {
                return promise;
            }

            if (this._status !== _ExecutionStatus.rendering) {
                promise.reject('Cannot execute cancel when the report is not rendering.');
                return promise;
            }

            _httpRequest(this._getReportCacheUrl(_ReportService._cancelAction), {
                success: xhr => {
                    promise.resolve(_parseReportExecutionInfo(xhr.responseText));
                }
            });

            promise.then(v => void (this._status = v.status));
            return promise;
        }

        dispose(): IPromise {
            var promise = new _Promise();
            // The reason of not passing promise to _checkReportCacheController is:
            // do nothing When cacheId is not generated.
            if (!this._checkReportCacheController()) {
                return promise;
            }

            _httpRequest(this._getReportCacheUrl(), {
                method: 'DELETE',
                success: xhr => {
                    var info = <_IReportExecutionInfo>JSON.parse(xhr.responseText);
                    if (info.isCleared) {
                        this._status = _ExecutionStatus.cleared;
                    }
                    this._cacheId = '';
                    promise.resolve(info);
                }
            });

            return promise;
        }

        getOutlines(): IPromise {
            var promise = new _Promise();
            if (!this._checkReportCacheController(promise)) {
                return promise;
            }

            _httpRequest(this._getReportCacheUrl(_ReportService._outlinesAction), {
                success: xhr => {
                    promise.resolve(JSON.parse(xhr.responseText));
                }
            });

            return promise;
        }

        renderToFilter(options: Object): IPromise {
            var promise = new _Promise();
            if (!this._checkReportCacheController(promise)) {
                return promise;
            }

            _httpRequest(this.getRenderToFilterUrl(options), {
                cache: true,
                success: xhr => {
                    promise.resolve(xhr);
                },
                error: xhr => {
                    promise.reject(this._getError(xhr));
                }
            });

            return promise;
        }

        getRenderToFilterUrl(options: Object): string {
            if (!this._checkReportCacheController()) {
                return null;
            }

            var url = this._getReportCacheUrl(_ReportService._exportAction);
            url = _disableCache(url);
            return _appendQueryString(url, options);
        }

        search(text: string, matchCase?: boolean, wholeWord?: boolean): IPromise {
            var promise = new _Promise();
            if (!this._checkReportCacheController(promise)) {
                return promise;
            }

            _httpRequest(this._getReportCacheUrl(_ReportService._searchAction), {
                success: xhr => {
                    promise.resolve(JSON.parse(xhr.responseText));
                },
                data: {
                    'text': text,
                    'matchCase': !!matchCase,
                    'wholeWord': !!wholeWord
                }
            });

            return promise;
        }

        setPageSettings(pageSettings: _IPageSettings): IPromise {
            var promise = new _Promise()
            if (!this._checkReportCacheController(promise)) {
                return promise;
            };

            var url = this._getReportCacheUrl(_ReportService._pageSettingsAction);
            _httpRequest(url, {
                method: 'POST',
                data: pageSettings,
                success: xhr => {
                    promise.resolve(JSON.parse(xhr.responseText, _pageSettingsJsonReviver));
                },
                error: xhr => {
                    promise.reject(this._getError(xhr));
                }
            });

            return promise;
        }

        setParameters(parameters: Object): IPromise {
            var promise = new _Promise()
            if (!this._checkReportCacheController(promise)) {
                return promise;
            };

            var url = this._getReportCacheUrl(_ReportService._parametersAction);
            _httpRequest(url, {
                method: 'POST',
                data: parameters,
                success: xhr => {
                    promise.resolve(JSON.parse(xhr.responseText));
                },
                error: xhr => {
                    promise.reject(this._getError(xhr));
                }
            });
            return promise;
        }

        // Return an IPromise with _IExportDescription[].
        getSupportedExportDescriptions(): IPromise {
            var promise = new _Promise();
            if (!this._checkReportController(promise)) {
                return promise;
            }

            _httpRequest(this._getReportUrl(_ReportService._supportedFormatsAction), {
                success: xhr => {
                    promise.resolve(JSON.parse(xhr.responseText));
                }
            });

            return promise;
        }
    }

    export function _parseReportExecutionInfo(json: string): _IReportExecutionInfo {
        return JSON.parse(json, _statusJsonReviver);
    }

    // The report status.
    export interface _IReportStatus extends _IDocumentStatus {
        // A boolean value indicates if the report has parameters.
        hasParameters: boolean;
    }

    export interface _IReportExecutionInfo extends _IExecutionInfo {
        // The cache id.
        cacheId: string;
        // Indicates whether cache is cleared.
        isCleared: boolean;
    }

    // Describes the status of the execution.
    export class _ExecutionStatus {
        // The report is Loaded.
        static loaded = 'Loaded';

        // The report is rendering.
        static rendering = 'Rendering';

        // The report is rendered.
        static completed = 'Completed';

        // The report rendering is stopped.
        static stopped = 'Stopped';

        // The report is cleared.
        static cleared = 'Cleared';

        // The execution is not found.
        static notFound = 'NotFound';
    }

    // Describing a user-defined parameter.
    export interface _IParameter {
        // Name of the @see:_IParameter.
        name: string;
        // Data type of the @see:_IParameter.
        dataType: _ParameterType;
        // Indicating the value for this @see:_IParameter can be Null.
        // Cannot be true if this is a multivalue parameter.
        nullable: boolean;
        // Supported values of the @see:_IParameter.
        allowedValues: any[];
        // Value of the @see:_IParameter. Value can be specifed as array if is a multivalue @see:_IParameter
        // in this case all items should have same type item can not be an array.
        value: any;
        // Indicating the @see:_IParameter should not be displayed to the user.
        hidden: boolean;
        // Indicating this is a multivalue @see:_IParameter.
        multiValue: boolean;
        // Prompt to display when asking for @see:_IParameter values.
        prompt: string;
        // The error which occurs after the parameter is set.
        error?: string;
    }

    // Specifies the type of a value.
    export enum _ParameterType {
        // Bool type.
        Boolean = 0,
        // Date time type.
        DateTime = 1,
        // Time type.
        Time = 2,
        // Date type
        Date = 3,
        // Int type.
        Integer = 4,
        // Float type.
        Float = 5,
        // String type
        String = 6,
    }

    /**
    * Describing an item in the report server of a specific path.
    */
    export interface ICatalogItem {
        /**
        * The short name of the item.
        */
        name: string;
        /**
        * The full path (contains the report provider name) of the item.
        */
        path: string;
        /**
        * The type of the item.
        */
        type: CatalogItemType;
        /**
        * The array of child items.
        */
        items: ICatalogItem[];
    }

    /**
    * Specifies the type of a catalog item.
    */
    export enum CatalogItemType {
        /**
        * A folder.
        */
        Folder = 0,
        /**
        * A FlexReport definition file.
        */
        File = 1,
        /**
        * An SSRS report or one FlexReport defined in the .flxr file.
        */
        Report = 2
    }
}