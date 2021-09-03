module wijmo.viewer {
    'use strict';

    // Defines an abstract document source class.
    export class _DocumentSource {

        static _abstractMethodException = 'It is an abstract method, please implement it.';

        private _features: _IDocumentFeatures;
        private _paginated: boolean;
        private _hasOutlines = false;
        private _pageCount = 0;
        private _service: _IDocumentService;
        private _supportedExportDescriptions: _IExportDescription[] = [];
        private _pageSettings: _IPageSettings;
        private _isLoadCompleted = false;
        private _isDisposed = false;
        private _errors: string[] = [];
        private _expiredDateTime: Date;
        private _executionDateTime: Date;

        // Occurs after the page count changes.
        pageCountChanged = new Event();

        // Occurs after the document is disposed.
        disposed = new Event();

        // Occurs when the pageSettings property value changes.
        pageSettingsChanged = new Event();

        // Occurs when the document is loaded completed.
        loadCompleted = new Event();

        // Queries the request data sent to the service before loading the document.
        queryLoadingData = new Event();

        // Raises the @see:queryLoadingData event.
        // @param e @see:QueryLoadingDataEventArgs that contains the event data.
        onQueryLoadingData(e: QueryLoadingDataEventArgs) {
            this.queryLoadingData.raise(this, e);
        }

        // Creates the document source.
        // @param options The document options and service information.
        constructor(options: _IDocumentOptions) {
            this._service = this._createDocumentService(options);
            this._paginated = options.paginated;
        }

        _updateIsLoadCompleted(value: boolean) {
            if (this._isLoadCompleted === value) {
                return;
            }

            this._isLoadCompleted = value;
            if (value) {
                this.onLoadCompleted();
            }
        }

        _updateIsDisposed(value: boolean) {
            if (this._isDisposed === value) {
                return;
            }

            this._isDisposed = value;
            this.onDisposed();
        }

        _getIsDisposed() {
            return this._isDisposed;
        }

        _checkHasOutlines(data: _IExecutionInfo): boolean {
            return data.documentStatus.hasOutlines;
        }

        _checkIsLoadCompleted(data: _IExecutionInfo): boolean {
            return data.documentStatus.status === _ExecutionStatus.completed
                || data.documentStatus.status === _ExecutionStatus.stopped
                || data.documentStatus.status === _ExecutionStatus.loaded;
        }

        _checkIsDisposed(data: _IExecutionInfo): boolean {
            throw _DocumentSource._abstractMethodException;
        }

        // The execution date time of the loading document.
        get executionDateTime(): Date {
            return this._executionDateTime;
        }

        // The expired date time of the cache.
        get expiredDateTime(): Date {
            return this._expiredDateTime;
        }

        // Gets the errors of this document.
        get errors(): string[] {
            return this._errors;
        }

        // Gets a boolean value indicates if this document is loaded completed.
        get isLoadCompleted(): boolean {
            return this._isLoadCompleted;
        }

        // Gets a boolean value indicates if this document is disposed.
        get isDisposed(): boolean {
            return this._getIsDisposed();
        }

        // Gets the document features.
        get features(): _IDocumentFeatures {
            return this._features;
        }

        // Gets the page settings.
        get pageSettings(): _IPageSettings {
            return this._pageSettings;
        }

        // Raises the @see:pageSettingsChanged event.
        // @param e The event arguments.
        onPageSettingsChanged(e?: EventArgs): void {
            this.pageSettingsChanged.raise(this, e || new EventArgs());
        }

        // Raises the @see:loadCompleted event.
        // @param e The event arguments.
        onLoadCompleted(e?: EventArgs) {
            this.loadCompleted.raise(this, e || new EventArgs());
        }

        // Raises the @see:disposed event.
        // @param e The event arguments.
        onDisposed(e?: EventArgs) {
            this.disposed.raise(this, e || new EventArgs());
        }

        // Set the page settings.
        // @param pageSettings page settings for the document.
        // @return An @see:IPromise object with @see:_IExecutionInfo.
        setPageSettings(pageSettings: _IPageSettings): IPromise {
            return this._innerService.setPageSettings(pageSettings).then((data: _IExecutionInfo) => this._updatePageSettings(data.documentStatus.pageSettings));
        }

        _updatePageSettings(newValue: _IPageSettings) {
            this._pageSettings = newValue;
            this.onPageSettingsChanged();
        }

        get _innerService(): _DocumentService {
            return <_DocumentService><_IDocumentService>this._service;
        }

        // Gets a value indicating whether the content should be represented as set of fixed sized pages.
        get paginated(): boolean {
            return this.pageSettings ? this.pageSettings.paginated : this._paginated;
        }

        // Gets a boolean value indicats whether current document has outlines or not.
        get hasOutlines(): boolean {
            return this._hasOutlines;
        }

        // Gets the page count of the document.
        get pageCount(): number {
            return this._pageCount;
        }

        // Gets the service information of the document source.
        get service(): _IDocumentService {
            return this._service;
        }

        // Gets the array of @see:_IExportDescription of current document source.
        // @return An @see:IPromise object with an @see:_IExportDescription array.
        getSupportedExportDescriptions(): IPromise {
            return this._innerService.getSupportedExportDescriptions();
        }

        // Gets the bookmark by bookmark's name.
        // @param name Name of the bookmark to look for.
        // @return An @see:IPromise object with @see:_IDocumentPosition.
        getBookmark(name: string): IPromise {
            return this._innerService.getBookmark(name);
        }

        // Executes the custom action.
        // @param actionString The string represents the custom aciton.
        // @return An @see:IPromise object with @see:_IDocumentPosition.
        executeCustomAction(actionString: string): IPromise {
            return this._innerService.executeCustomAction(actionString);
        }

        // Gets an array of outline of current document source.
        // @return An @see:IPromise object with an @see:_IOutlineNode array.
        getOutlines(): IPromise {
            return this._innerService.getOutlines();
        }

        // Disposes the current document source instance from service.
        // @return An @see:IPromise object with information of document.
        dispose(): IPromise {
            return this._innerService.dispose().then(v=> this._update(v));
        }

        // Loads the current document source from service.
        // @return An @see:IPromise object with information of document.
        load(): IPromise {
            var data = {};
            if (this._paginated != null) {
                data["pageSettings.paginated"] = this.paginated;
            }
            var e = new QueryLoadingDataEventArgs(data);
            this.onQueryLoadingData(e);
            return this._innerService.load(e.data).then(v => this._update(v));
        }

        _update(data: _IExecutionInfo) {
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
        }

        _getFeatures(data: _IExecutionInfo): _IDocumentFeatures {
            var features: _IDocumentFeatures = data.documentStatus.features;
            if (!features) {
                features = { paginated: true, nonPaginated: false, textSearchInPaginatedMode: false, pageSettings: false };
            }
            return features;
        }

        _getExecutionDateTime(data: _IExecutionInfo): Date {
            return data.loadedDateTime;
        }

        _getExpiredDateTime(data: _IExecutionInfo): Date {
            return data.expiredDateTime;
        }

        _getPageCount(data: _IExecutionInfo): number {
            return data.documentStatus.pageCount;
        }

        _updatePageCount(value: number) {
            if (this._pageCount === value) {
                return;
            }

            this._pageCount = value;
            this.onPageCountChanged();
        }

        // Gets the document status.
        getDocumentStatus(): IPromise {
            return this._innerService.getDocumentStatus();
        }

        _createDocumentService(options: _IDocumentService): _DocumentService {
            throw _DocumentSource._abstractMethodException;
        }

        // Raises the @see:pageCountChanged event.
        // @param e @see:EventArgs that contains the event data.
        onPageCountChanged(e?: EventArgs): void {
            this.pageCountChanged.raise(this, e || new EventArgs());
        }

       // Prints the current document.
        print() {
            var doc = new wijmo.PrintDocument({
                title: 'Document'
            });
            this.renderToFilter({ format: 'html' }).then(xhr=> {
                doc.append(xhr.responseText);
                doc.print();
            });
        }

        // Renders the document into an export filter object.
        // @param options Options of the export.
        // @return An @see:IPromise object with XMLHttpRequest.
        renderToFilter(options: Object): IPromise {
            return this._innerService.renderToFilter(options);
        }

        // Gets the file url of rendering the document into an export filter object.
        // @param options Options of the export.
        // @return The file url of rendering the document into an export filter object.
        getRenderToFilterUrl(options: Object): string {
            return this._innerService.getRenderToFilterUrl(options);
        }

        // Gets an array of Search by search options.
        // @param text The text to match.
        // @param matchCase Whether to ignore case during the match.
        // @param wholeWord Whether to match the whole word, or just match the text.
        // @return An @see:IPromise object with an @see:_ISearchResult array.
        search(text: string, matchCase?: boolean, wholeWord?: boolean): IPromise {
            return this._innerService.search(text, matchCase, wholeWord);
        }
    }

    // define the reviver for JSON.parse to transform results.
    export function _statusJsonReviver(k: string, v) {
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

    // Defines the document status.
    export interface _IDocumentStatus {
        // The document id.
        documentId: string;
        // The execution status.
        status: string;
        // The error list.
        errorList: string[];
        // The progress of the execution.
        progress: number;
        // The page count.
        pageCount: number;
        // A boolean value indicates if the document has outlines.
        hasOutlines: boolean;
        // The page settings of the document.
        pageSettings: _IPageSettings;
        // The supported features of the document.
        features: _IDocumentFeatures;
    }

    // Defines the feautres supported by the document.
    export interface _IDocumentFeatures {
        // Supports paginated mode of the document rendering.
        paginated: boolean;
        // Supports non paginated mode of the document rendering.
        nonPaginated: boolean;
        // Supports text searching in paginated mode.
        textSearchInPaginatedMode: boolean;
        // Supports set page settings for document.
        pageSettings: boolean;
    }

    // Defines the execution info.
    export interface _IExecutionInfo {
        // The document status.
        documentStatus: _IDocumentStatus;
        // The loaded date time of the document.
        loadedDateTime: Date;
        // The expired date time of the cache.
        expiredDateTime: Date;
    }

    // Defines the settings of page.
    export interface _IPageSettings {
        // Whether the content should be represented as set of fixed sized pages.
        paginated: boolean;

        // Height of page.
        height: _Unit;

        // Width of page.
        width: _Unit;

        // Gets or sets the bottom margin.
        bottomMargin: _Unit;

        // Gets or sets a value indicating whether to use landscape orientation.
        // Changing this property swaps height and width of the page.
        landscape: boolean;

        // Gets or sets the left margin.
        leftMargin: _Unit;

        // Gets or sets the paper kind.
        paperSize: _PaperKind;

        // Gets or sets the right margin.
        rightMargin: _Unit;

        // Gets or sets the top margin.
        topMargin: _Unit;
    }

    // Describing the result of search.
    export interface _ISearchResult {
        // The adjacent text of this @see:_ISearchResult.
        nearText: string;
        // The position of the search text in @see:nearText of this @see:_ISearchResult.
        positionInNearText: number;
        // The bounds list of this @see:_ISearchResult.
        boundsList: _IRect[];
        // The page index of this @see:_ISearchResult.
        pageIndex: number;
    }

    // Used during document rendering to build tree of outlines.
    export interface _IOutlineNode {
        // The caption of this @see:_IOutlineNode.
        caption: string;
        // The children array of @see:IOutline of this @see:_IOutlineNode.
        children: _IOutlineNode[];
        // The level of this @see:IOutline.
        level: number;
        // The @see:_IDocumentPosition of this @see:_IOutlineNode.
        position: _IDocumentPosition;
    }

    // Describing a set of four floating-point numbers that represent the location and size of a rectangle.
    export interface _IRect {
        // The x-coordinate of the upper-left corner of this @see:_IRect.
        x: number;
        // The y-coordinate of the upper-left corner of this @see:_IRect.
        y: number;
        // The width of this @see:_IRect.
        width: number;
        // The height of this @see:_IRect.
        height: number;
    }

    // Describing the information of position of page.
    export interface _IDocumentPosition {
        // The bound of this @see:_IDocumentPosition.
        pageBounds: _IRect;
        // The page index of this @see:_IDocumentPosition.
        pageIndex: number;
    }

    // Describing a supported export format.
    export interface _IExportDescription {
        // Short description of the current export format.
        name: string;
        // Default filename extension for the current export format.
        format: string;
        // The array of @see:_IExportOptionDescription for the current export format.
        optionDescriptions?: _IExportOptionDescription[];
    }

    // Describing option of export format.
    export interface _IExportOptionDescription {
        // Name of the @see:_IExportOptionDescription.
        name: string;
        // Data type of the @see:_IExportOptionDescription.
        type: string;
        // Default value of the @see:_IExportOptionDescription.
        defaultValue: string;
        // Supported values of the @see:_IExportOptionDescription.
        allowedValues?: string[];
    }

    // Defines the document service.
    export interface _IDocumentService {
        // The service url.
        serviceUrl: string;
        // The document path.
        filePath: string;
    }

    // Defines the document options
    export interface _IDocumentOptions extends _IDocumentService {
        // The layout mode.
        paginated?: boolean;
    }

    export class _DocumentService implements _IDocumentService {
        private _url = '';
        private _documentPath: string;

        constructor(options: _IDocumentService) {
            this._url = options.serviceUrl || '';
            this._documentPath = options.filePath;
        }

        get serviceUrl(): string {
            return this._url;
        }

        get filePath(): string {
            return this._documentPath;
        }

        getDocumentStatus(): IPromise {
            throw _DocumentSource._abstractMethodException;
        }

        // Return an IPromise with IPageSettings.
        setPageSettings(pageSettings: _IPageSettings): IPromise {
            throw _DocumentSource._abstractMethodException;
        }

        // Return an IPromise with _IDocumentPosition.
        getBookmark(name: string): IPromise {
            throw _DocumentSource._abstractMethodException;
        }

        // Return an IPromise with _IDocumentPosition.
        executeCustomAction(actionString: string): IPromise {
            throw _DocumentSource._abstractMethodException;
        }

        load(data?): IPromise {
            throw _DocumentSource._abstractMethodException;
        }

        dispose(): IPromise {
            throw _DocumentSource._abstractMethodException;
        }

        // Return an IPromise with _IOutlineNode[].
        getOutlines(): IPromise {
            throw _DocumentSource._abstractMethodException;
        }

        // Return an IPromise with XMLHttpRequest.
        renderToFilter(options: Object): IPromise {
            throw _DocumentSource._abstractMethodException;
        }

        // Return an IPromise with _ISearchResult[].
        search(text: string, matchCase?: boolean, wholeWord?: boolean): IPromise {
            throw _DocumentSource._abstractMethodException;
        }

        getRenderToFilterUrl(options: Object): string {
            throw _DocumentSource._abstractMethodException;
        }

        // Return an IPromise with _IExportDescription[].
        getSupportedExportDescriptions(): IPromise {
            throw _DocumentSource._abstractMethodException;
        }
    }

    export function _pageSettingsJsonReviver(k: string, v) {
        if (wijmo.isString(v)) {
            if (k === 'width' || k === 'height' || _strEndsWith(k, 'Margin')) {
                return new _Unit(v);
            }
        }

        return v;
    }

    export function _strEndsWith(text: string, suffix: string) {
        return text.slice(-suffix.length) === suffix;
    }

    export function _appendQueryString(url: string, queries: Object): string {
        queries = queries || {};
        var queryList: string[] = [];
        for (var k in queries) {
            queryList.push(k + '=' + queries[k]);
        }
        if (queryList.length) {
            var sep = url.indexOf('?') < 0 ? '?' : '&';
            url += sep + queryList.join('&');
        }

        return url;
    }

    export function _joinUrl(...data: (string | string[])[]): string {
        var urlParts: string[] = [];
        for (var i = 0, l = data.length; i < l; i++) {
            var item = data[i];
            if (item) {
                if (typeof item !== 'string') {
                    urlParts = urlParts.concat(_joinStringUrl(item));
                } else {
                    urlParts.push(_prepareStringUrl(item).join('/'));
                }
            }
        }
        return urlParts.join('/');
    }

    export function _joinStringUrl(data: string[]): string[] {
        if (data == null) {
            return null;
        }

        var urlParts: string[] = [];
        for (var i = 0, l = data.length; i < l; i++) {
            urlParts = urlParts.concat(_prepareStringUrl(data[i]));
        }
        return urlParts;
    }

    export function _prepareStringUrl(data: string): string[] {
        var paramParts = data.split('/');
        if (paramParts.length > 0 && !paramParts[paramParts.length - 1].length) {
            paramParts.splice(paramParts.length - 1);
        }
        return paramParts;
    }

    export function _httpRequest(url: string, settings?: _IHttpRequest): XMLHttpRequest {
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

    export function _objToParams(obj: Object): string {
        var paramList: string[] = [];
        obj = obj || {};
        for (var key in obj) {
            if (obj[key] !== null && obj[key] !== undefined) {
                if (isArray(obj[key])) {
                    if (obj[key].length > 0) {
                        for (var i = 0; i < obj[key].length; i++) {
                            paramList.push(key + '=' + obj[key][i]);
                        }
                    } else {
                        paramList.push(key + '=');
                    }
                } else {
                    paramList.push(key + '=' + obj[key]);
                }
            }
        }

        return paramList.join('&');
    }

    export interface _IHttpRequest {
        method?: string; // default is GET
        data?: any;
        async?: boolean; // default id true
        cache?: boolean; // default is false
        success?: (xhr: XMLHttpRequest) => void;
        user?: string;
        password?: string;
        requestHeaders?: any;
        beforeSend?: (xhr: XMLHttpRequest) => void;
        error?: (xhr: XMLHttpRequest) => void;
        complete?: (xhr: XMLHttpRequest) => void;
    }

    export function _disableCache(url: string): string {
        return url + (url.indexOf('?') == -1 ? '?' : '&') + '_=' + new Date().getTime();
    }

    export function _twipToPixel(value: number): number {
        return _Unit.convertValue(value, _UnitType.Twip, _UnitType.Dip);
    }

    // Enumerates units of measurement.
    export enum _UnitType {
        // Specifies the document unit (1/300 inch) as the unit of measure.
        Document,
        // Specifies the inch as the unit of measure.
        Inch = 1,
        // Specifies the millimeter as the unit of measure.
        Mm = 2,
        // Specifies the pica unit (1/6 inch) as the unit of measure.
        Pica = 3,
        // Specifies a printer's point (1/72 inch) as the unit of measure.
        Point = 4,
        // Specifies a twip (1/1440 inch) as the unit of measure.
        Twip = 5,
        // Specifies a hundredths of an inch as the unit of measure.
        InHs = 6,
        // Specifies 1/75 inch as the unit of measure.
        Display = 7,
        // Specifies centimetre's as the unit of measure.
        Cm = 8,
        // Specifies DIP's 1/96 inch as the unit of measure.
        Dip = 9
    }

    // A utility structure specifying some values related to units of measurement.
    export class _Unit {
        // Millimeters per inch.
        static _MmPerInch = 25.4;
        // Document units per inch.
        static _DocumentUnitsPerInch = 300;
        // Points per inch.
        static _PointsPerInch = 72;
        // Twips per inch.
        static _TwipsPerInch = 1440;
        // Picas per inch.
        static _PicaPerInch = 6;
        // Centimeters per inch.
        static _CmPerInch = _Unit._MmPerInch / 10;
        // Display units per inch.
        static _DisplayPerInch = 75;
        // DIP units per inch.
        static _DipPerInch = 96;

        private static _unitTypes = {
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

        private static _unitTypeDic;
        private _value: number;
        private _units: _UnitType;
        private _valueInPixel: number;

        // Creates a _Unit instance.
        // @param value The value.
        // @param units The units of the value. If it is not passed, it is Dip for default.
        constructor(value: any, units: _UnitType = _UnitType.Dip) {
            _Unit._initUnitTypeDic();
            if (wijmo.isObject(value)) {
                var obj: _Unit = <_Unit>value;
                value = obj.value;
                units = obj.units;
            } else if (wijmo.isString(value)) {
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

        private static _initUnitTypeDic() {
            if (_Unit._unitTypeDic) {
                return;
            }

            _Unit._unitTypeDic = {};
            for (var k in _Unit._unitTypes) {
                _Unit._unitTypeDic[_Unit._unitTypeDic[k] = _Unit._unitTypes[k]] = k;
            }
        }

        // Gets the value of the current unit.
        get value(): number {
            return this._value;
        }

        // Gets the unit of measurement of the current unit.
        get units(): _UnitType {
            return this._units;
        }

        // Gets the value in pixel.
        get valueInPixel(): number {
            return this._valueInPixel;
        }

        // Convert to string.
        // @return The string of converting result.
        toString(): string {
            return _Unit.toString(this);
        }

        // Convert the unit to string.
        // @param unit The unit used to convert.
        // @return The string of converting result.
        static toString(unit: _Unit): string {
            return unit.value + _Unit._unitTypeDic[unit.units];
        }

        // Convert the value from one kind of unit to another.
        // @param value The value used to convert.
        // @param from The units of the value.
        // @param to The units which is converted to.
        // @return The number of converting result.
        static convertValue(value: number, from: _UnitType, to: _UnitType): number {
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
        }
    }

    /**
     * Defines the interface of promise which is used for asynchronous calling.
     */
    export interface IPromise {
        /**
         * Call the function after the promise is fulfilled or rejected.
         *
         * @param onFulfilled The function which will be executed when the promise is fulfilled.
         * This has a single parameter, the fulfillment value. If returns a value, it will be 
         * passed to next callback function. If no return values, the origin value will be passed to next.
         * @param onRejected The function which will be executed when the promise is rejected.
         * This has a single parameter, the rejection reason. If returns a value, it will be 
         * passed to next callback function. If no return values, the origin value will be passed to next.
         * @return An IPromise equivalent to the value you return from onFulfilled/onRejected after being passed.
         */
        then(onFulfilled?: (value?: any) => any, onRejected?: (reason?: any) => any): IPromise;

        /**
         * Call the function after the promise is rejected.
         *
         * @param onRejected The function which will be executed when the promise is rejected.
         * This has a single parameter, the rejection reason. The return value will be 
         * passed to next callback function.
         * @return An IPromise equivalent to the value you return from onFulfilled/onRejected after being passed.
         */
        catch(onRejected: (reason?: any) => any): IPromise;
    }

    interface _IPromiseCallback {
        onFulfilled?: (value?: any) => any;
        onRejected?: (reason?: any) => any;
    }

    export class _Promise implements IPromise {

        private _callbacks: _IPromiseCallback[] = [];

        then(onFulfilled?: (value?: any) => any, onRejected?: (reason?: any) => any): IPromise {
            this._callbacks.push({ onFulfilled: onFulfilled, onRejected: onRejected });
            return this;
        }

        catch(onRejected: (reason?: any) => any): IPromise {
            return this.then(null, onRejected);
        }

        resolve(value?: any) {
            setTimeout(() => {
                try {
                    this.onFulfilled(value);
                } catch (e) {
                    this.onRejected(e);
                }
            }, 0);
        }

        reject(reason?: any) {
            setTimeout(() => {
                this.onRejected(reason);
            }, 0);
        }

        onFulfilled(value: any) {
            var callback: _IPromiseCallback;
            while (callback = this._callbacks.shift()) {
                if (callback.onFulfilled) {
                    var newValue = callback.onFulfilled(value);
                    if (newValue !== undefined) {
                        value = newValue;
                    }
                }
            }
        }

        onRejected(reason: any) {
            var callback: _IPromiseCallback;
            while (callback = this._callbacks.shift()) {
                if (callback.onRejected) {
                    var value = callback.onRejected(reason);
                    this.onFulfilled(value);
                    return;
                }
            }

            throw reason;
        }
    }

    export class _CompositedPromise extends _Promise{
        private _promises: IPromise[];

        constructor(promises: IPromise[]) {
            super();
            this._promises = promises;
            this._init();
        }

        _init() {
            if (!this._promises || !this._promises.length) {
                this.reject('No promises in current composited promise.');
                return;
            }

            var length = this._promises.length, i = 0, values: any[] = [], isRejected = false;
            this._promises.some(p=> {
                p.then(v=> {
                    if (isRejected) {
                        return;
                    }

                    values.push(v);
                    if (++i >= length) {
                        this.resolve(values);
                    }
                }).catch(r=> {
                    isRejected = true;
                    this.reject(r);
                });

                return isRejected;
            });
        }
    }

    // Specifies the standard paper sizes.
    export enum _PaperKind {
        // The paper size is defined by the user.
        Custom = 0,
        // Letter paper (8.5 in. by 11 in.).
        Letter = 1,
        // Letter small paper (8.5 in. by 11 in.).
        LetterSmall = 2,
        // Tabloid paper (11 in. by 17 in.).
        Tabloid = 3,
        // Ledger paper (17 in. by 11 in.).
        Ledger = 4,
        // Legal paper (8.5 in. by 14 in.).
        Legal = 5,
        // Statement paper (5.5 in. by 8.5 in.).
        Statement = 6,
        // Executive paper (7.25 in. by 10.5 in.).
        Executive = 7,
        // A3 paper (297 mm by 420 mm).
        A3 = 8,
        // A4 paper (210 mm by 297 mm).
        A4 = 9,
        // A4 small paper (210 mm by 297 mm).
        A4Small = 10,
        // A5 paper (148 mm by 210 mm).
        A5 = 11,
        // B4 paper (250 mm by 353 mm).
        B4 = 12,
        // B5 paper (176 mm by 250 mm).
        B5 = 13,
        // Folio paper (8.5 in. by 13 in.).
        Folio = 14,
        //  Quarto paper (215 mm by 275 mm).
        Quarto = 15,
        // Standard paper (10 in. by 14 in.).
        Standard10x14 = 16,
        // Standard paper (11 in. by 17 in.).
        Standard11x17 = 17,
        // Note paper (8.5 in. by 11 in.).
        Note = 18,
        //  #9 envelope (3.875 in. by 8.875 in.).
        Number9Envelope = 19,
        // #10 envelope (4.125 in. by 9.5 in.).
        Number10Envelope = 20,
        // #11 envelope (4.5 in. by 10.375 in.).
        Number11Envelope = 21,
        // #12 envelope (4.75 in. by 11 in.).
        Number12Envelope = 22,
        // #14 envelope (5 in. by 11.5 in.).
        Number14Envelope = 23,
        // C paper (17 in. by 22 in.).
        CSheet = 24,
        // D paper (22 in. by 34 in.).
        DSheet = 25,
        // E paper (34 in. by 44 in.).
        ESheet = 26,
        // DL envelope (110 mm by 220 mm).
        DLEnvelope = 27,
        //  C5 envelope (162 mm by 229 mm).
        C5Envelope = 28,
        // C3 envelope (324 mm by 458 mm).
        C3Envelope = 29,
        // C4 envelope (229 mm by 324 mm).
        C4Envelope = 30,
        // C6 envelope (114 mm by 162 mm).
        C6Envelope = 31,
        // C65 envelope (114 mm by 229 mm).
        C65Envelope = 32,
        // B4 envelope (250 mm by 353 mm).
        B4Envelope = 33,
        // B5 envelope (176 mm by 250 mm).
        B5Envelope = 34,
        //  B6 envelope (176 mm by 125 mm).
        B6Envelope = 35,
        // Italy envelope (110 mm by 230 mm).
        ItalyEnvelope = 36,
        // Monarch envelope (3.875 in. by 7.5 in.).
        MonarchEnvelope = 37,
        // 6 3/4 envelope (3.625 in. by 6.5 in.).
        PersonalEnvelope = 38,
        // US standard fanfold (14.875 in. by 11 in.).
        USStandardFanfold = 39,
        // German standard fanfold (8.5 in. by 12 in.).
        GermanStandardFanfold = 40,
        // German legal fanfold (8.5 in. by 13 in.).
        GermanLegalFanfold = 41,
        // ISO B4 (250 mm by 353 mm).
        IsoB4 = 42,
        // Japanese postcard (100 mm by 148 mm).
        JapanesePostcard = 43,
        // Standard paper (9 in. by 11 in.).
        Standard9x11 = 44,
        // Standard paper (10 in. by 11 in.).
        Standard10x11 = 45,
        // Standard paper (15 in. by 11 in.).
        Standard15x11 = 46,
        // Invitation envelope (220 mm by 220 mm).
        InviteEnvelope = 47,
        // Letter extra paper (9.275 in. by 12 in.). This value is specific to the PostScript
        // driver and is used only by Linotronic printers in order to conserve paper.
        LetterExtra = 50,
        // Legal extra paper (9.275 in. by 15 in.). This value is specific to the PostScript
        // driver and is used only by Linotronic printers in order to conserve paper.
        LegalExtra = 51,
        // Tabloid extra paper (11.69 in. by 18 in.). This value is specific to the
        // PostScript driver and is used only by Linotronic printers in order to conserve paper.
        TabloidExtra = 52,
        // A4 extra paper (236 mm by 322 mm). This value is specific to the PostScript
        // driver and is used only by Linotronic printers to help save paper.
        A4Extra = 53,
        // Letter transverse paper (8.275 in. by 11 in.).
        LetterTransverse = 54,
        // A4 transverse paper (210 mm by 297 mm).
        A4Transverse = 55,
        // Letter extra transverse paper (9.275 in. by 12 in.).
        LetterExtraTransverse = 56,
        // SuperA/SuperA/A4 paper (227 mm by 356 mm).
        APlus = 57,
        // SuperB/SuperB/A3 paper (305 mm by 487 mm).
        BPlus = 58,
        // Letter plus paper (8.5 in. by 12.69 in.).
        LetterPlus = 59,
        // A4 plus paper (210 mm by 330 mm).
        A4Plus = 60,
        // A5 transverse paper (148 mm by 210 mm).
        A5Transverse = 61,
        // JIS B5 transverse paper (182 mm by 257 mm).
        B5Transverse = 62,
        // A3 extra paper (322 mm by 445 mm).
        A3Extra = 63,
        // A5 extra paper (174 mm by 235 mm).
        A5Extra = 64,
        // ISO B5 extra paper (201 mm by 276 mm).
        B5Extra = 65,
        // A2 paper (420 mm by 594 mm).
        A2 = 66,
        // A3 transverse paper (297 mm by 420 mm).
        A3Transverse = 67,
        // A3 extra transverse paper (322 mm by 445 mm).
        A3ExtraTransverse = 68,
        // Japanese double postcard (200 mm by 148 mm). Requires Windows 98, Windows NT 4.0, or later.
        JapaneseDoublePostcard = 69,
        // A6 paper (105 mm by 148 mm). Requires Windows 98, Windows NT 4.0, or later.
        A6 = 70,
        // Japanese Kaku #2 envelope. Requires Windows 98, Windows NT 4.0, or later.
        JapaneseEnvelopeKakuNumber2 = 71,
        // Japanese Kaku #3 envelope. Requires Windows 98, Windows NT 4.0, or later.
        JapaneseEnvelopeKakuNumber3 = 72,
        // Japanese Chou #3 envelope. Requires Windows 98, Windows NT 4.0, or later.
        JapaneseEnvelopeChouNumber3 = 73,
        // Japanese Chou #4 envelope. Requires Windows 98, Windows NT 4.0, or later.
        JapaneseEnvelopeChouNumber4 = 74,
        // Letter rotated paper (11 in. by 8.5 in.).
        LetterRotated = 75,
        // A3 rotated paper (420 mm by 297 mm).
        A3Rotated = 76,
        //  A4 rotated paper (297 mm by 210 mm). Requires Windows 98, Windows NT 4.0, or later.
        A4Rotated = 77,
        // A5 rotated paper (210 mm by 148 mm). Requires Windows 98, Windows NT 4.0, or later.
        A5Rotated = 78,
        // JIS B4 rotated paper (364 mm by 257 mm). Requires Windows 98, Windows NT 4.0, or later.
        B4JisRotated = 79,
        // JIS B5 rotated paper (257 mm by 182 mm). Requires Windows 98, Windows NT 4.0, or later.
        B5JisRotated = 80,
        // Japanese rotated postcard (148 mm by 100 mm). Requires Windows 98, Windows NT 4.0, or later.
        JapanesePostcardRotated = 81,
        // Japanese rotated double postcard (148 mm by 200 mm). Requires Windows 98, Windows NT 4.0, or later.
        JapaneseDoublePostcardRotated = 82,
        // A6 rotated paper (148 mm by 105 mm). Requires Windows 98, Windows NT 4.0, or later.
        A6Rotated = 83,
        // Japanese rotated Kaku #2 envelope. Requires Windows 98, Windows NT 4.0, or later.
        JapaneseEnvelopeKakuNumber2Rotated = 84,
        // Japanese rotated Kaku #3 envelope. Requires Windows 98, Windows NT 4.0, or later.
        JapaneseEnvelopeKakuNumber3Rotated = 85,
        // Japanese rotated Chou #3 envelope. Requires Windows 98, Windows NT 4.0, or later.
        JapaneseEnvelopeChouNumber3Rotated = 86,
        // Japanese rotated Chou #4 envelope. Requires Windows 98, Windows NT 4.0, or later.
        JapaneseEnvelopeChouNumber4Rotated = 87,
        // JIS B6 paper (128 mm by 182 mm). Requires Windows 98, Windows NT 4.0, or later.
        B6Jis = 88,
        // JIS B6 rotated paper (182 mm by 128 mm). Requires Windows 98, Windows NT 4.0, or later.
        B6JisRotated = 89,
        // Standard paper (12 in. by 11 in.). Requires Windows 98, Windows NT 4.0, or later.
        Standard12x11 = 90,
        // Japanese You #4 envelope. Requires Windows 98, Windows NT 4.0, or later.
        JapaneseEnvelopeYouNumber4 = 91,
        // Japanese You #4 rotated envelope. Requires Windows 98, Windows NT 4.0, or later.
        JapaneseEnvelopeYouNumber4Rotated = 92,
        // People's Republic of China 16K paper (146 mm by 215 mm). Requires Windows 98, Windows NT 4.0, or later.
        Prc16K = 93,
        // People's Republic of China 32K paper (97 mm by 151 mm). Requires Windows 98, Windows NT 4.0, or later.
        Prc32K = 94,
        // People's Republic of China 32K big paper (97 mm by 151 mm). Requires Windows 98, Windows NT 4.0, or later.
        Prc32KBig = 95,
        // People's Republic of China #1 envelope (102 mm by 165 mm). Requires Windows 98, Windows NT 4.0, or later.
        PrcEnvelopeNumber1 = 96,
        // People's Republic of China #2 envelope (102 mm by 176 mm). Requires Windows 98, Windows NT 4.0, or later.
        PrcEnvelopeNumber2 = 97,
        // People's Republic of China #3 envelope (125 mm by 176 mm). Requires Windows 98, Windows NT 4.0, or later.
        PrcEnvelopeNumber3 = 98,
        // People's Republic of China #4 envelope (110 mm by 208 mm). Requires Windows 98, Windows NT 4.0, or later.
        PrcEnvelopeNumber4 = 99,
        // People's Republic of China #5 envelope (110 mm by 220 mm). Requires Windows 98, Windows NT 4.0, or later.
        PrcEnvelopeNumber5 = 100,
        // People's Republic of China #6 envelope (120 mm by 230 mm). Requires Windows 98, Windows NT 4.0, or later.
        PrcEnvelopeNumber6 = 101,
        // People's Republic of China #7 envelope (160 mm by 230 mm). Requires Windows 98, Windows NT 4.0, or later.
        PrcEnvelopeNumber7 = 102,
        // People's Republic of China #8 envelope (120 mm by 309 mm). Requires Windows 98, Windows NT 4.0, or later.
        PrcEnvelopeNumber8 = 103,
        // People's Republic of China #9 envelope (229 mm by 324 mm). Requires Windows 98, Windows NT 4.0, or later.
        PrcEnvelopeNumber9 = 104,
        // People's Republic of China #10 envelope (324 mm by 458 mm). Requires Windows 98, Windows NT 4.0, or later.
        PrcEnvelopeNumber10 = 105,
        // People's Republic of China 16K rotated paper (146 mm by 215 mm). Requires Windows 98, Windows NT 4.0, or later.
        Prc16KRotated = 106,
        // People's Republic of China 32K rotated paper (97 mm by 151 mm). Requires Windows 98, Windows NT 4.0, or later.
        Prc32KRotated = 107,
        // People's Republic of China 32K big rotated paper (97 mm by 151 mm). Requires Windows 98, Windows NT 4.0, or later.
        Prc32KBigRotated = 108,
        //  People's Republic of China #1 rotated envelope (165 mm by 102 mm). Requires Windows 98, Windows NT 4.0, or later.
        PrcEnvelopeNumber1Rotated = 109,
        // People's Republic of China #2 rotated envelope (176 mm by 102 mm). Requires Windows 98, Windows NT 4.0, or later.
        PrcEnvelopeNumber2Rotated = 110,
        // People's Republic of China #3 rotated envelope (176 mm by 125 mm). Requires Windows 98, Windows NT 4.0, or later.
        PrcEnvelopeNumber3Rotated = 111,
        // People's Republic of China #4 rotated envelope (208 mm by 110 mm). Requires Windows 98, Windows NT 4.0, or later.
        PrcEnvelopeNumber4Rotated = 112,
        // People's Republic of China Envelope #5 rotated envelope (220 mm by 110 mm). Requires Windows 98, Windows NT 4.0, or later.
        PrcEnvelopeNumber5Rotated = 113,
        // People's Republic of China #6 rotated envelope (230 mm by 120 mm). Requires Windows 98, Windows NT 4.0, or later.
        PrcEnvelopeNumber6Rotated = 114,
        // People's Republic of China #7 rotated envelope (230 mm by 160 mm). Requires Windows 98, Windows NT 4.0, or later.
        PrcEnvelopeNumber7Rotated = 115,
        // People's Republic of China #8 rotated envelope (309 mm by 120 mm). Requires Windows 98, Windows NT 4.0, or later.
        PrcEnvelopeNumber8Rotated = 116,
        // People's Republic of China #9 rotated envelope (324 mm by 229 mm). Requires Windows 98, Windows NT 4.0, or later.
        PrcEnvelopeNumber9Rotated = 117,
        // People's Republic of China #10 rotated envelope (458 mm by 324 mm). Requires Windows 98, Windows NT 4.0, or later.
        PrcEnvelopeNumber10Rotated = 118,
    }

    /**
     * Provides arguments for query loading data event.
     */
    export class QueryLoadingDataEventArgs extends EventArgs {
        private _data: any;

        /**
         * Initializes a new instance of the @see:QueryLoadingDataEventArgs class.
         *
         * @param data The request data sent to the service on loading the document.
         */
        constructor(data?: any) {
            super();
            this._data = data || {};
        }

        /**
         * Gets the request data sent to the service on loading the document.
         */
        get data(): any {
            return this._data;
        }
    }
}