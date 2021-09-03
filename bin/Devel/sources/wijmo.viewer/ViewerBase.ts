// initialize viewer resources
wijmo.culture.Viewer = {
    // for ViewerBase
    cancel: 'Cancel',
    ok: 'OK',
    bottom: 'Bottom:',
    top: 'Top:',
    right: 'Right:',
    left: 'Left:',
    margins: 'Margins(inches)',
    orientation: 'Orientation:',
    paperKind: 'Paper Kind:',
    pageSetup: 'Page Setup',
    landscape: 'Landscape',
    portrait: 'Portrait',
    pageNumber: 'Page Number',
    zoomFactor: 'Zoom Factor',
    paginated: 'Print Layout',
    print: 'Print',
    search: 'Search',
    matchCase: 'Match case',
    wholeWord: 'Match whole word only',
    searchResults: 'Search Results',
    previousPage: 'Previous Page',
    nextPage: 'Next Page',
    firstPage: 'First Page',
    lastPage: 'Last Page',
    backwardHistory: 'Backward',
    forwardHistory: 'Forward',
    pageCount: 'Page Count',
    selectTool: 'Select Tool',
    moveTool: 'Move Tool',
    continuousMode: 'Continuous Page View',
    singleMode: 'Single Page View',
    wholePage: 'Fit Whole Page',
    pageWidth: 'Fit Page Width',
    zoomOut: 'Zoom Out',
    zoomIn: 'Zoom In',
    exports: 'Export',
    fullScreen: 'Full Screen',
    exitFullScreen: 'Exit Full Screen',
    thumbnails: 'Page Thumbnails',
    outlines: 'Document Map',
    loading: 'Loading...',
    pdfExportName: 'Adobe PDF',
    docxExportName: 'Open XML Word',
    xlsxExportName: 'Open XML Excel',
    docExportName: 'Microsoft Word',
    xlsExportName: 'Microsoft Excel',
    mhtmlExportName: 'Web archive (MHTML)',
    htmlExportName: 'HTML document',
    rtfExportName: 'RTF document',
    metafileExportName: 'Compressed metafiles',
    csvExportName: 'CSV',
    tiffExportName: 'Tiff images',
    bmpExportName: 'BMP images',
    emfExportName: 'Enhanced metafile',
    gifExportName: 'GIF images',
    jpgExportName: 'JPEG images',
    jpegExportName: 'JPEG images',
    pngExportName: 'PNG images',

    //for ReportViewer
    parameters: 'Parameters',
    requiringParameters: 'Please input parameters.',
    nullParameterError: 'Value cannot be null.',
    invalidParameterError: 'Invalid input.',
    parameterNoneItemsSelected: '(none)',
    parameterAllItemsSelected: '(all)',
    parameterSelectAllItemText: '(Select All)',
    selectParameterValue: '(select value)',
    apply: 'Apply',
    errorOccured: 'An error has occured.'
}

/**
* Defines a series of classes, interfaces and functions related to the viewer controls.
*/
module wijmo.viewer {
    'use strict';

    var icons = {
            paginated: '<rect x="16" y= "1" width="1" height="1" />' +
            '<rect x="17" y= "2" width="1" height="1" />' +
            '<rect x="18" y= "3" width="1" height="1" />' +
            '<path d= "M20,5V4h-1v1h-0.6H18h-3V2V1.3V1h1V0h-1h0H5H4H3v24h2v0h13h1.1H20L20,5L20,5z M5,22.1V2h8v5h1h1h3v15.1H5z" />' +
            '<rect x="6" y= "8" width="10" height="1" />' +
            '<rect x="6" y= "5" width="5" height="1" />' +
            '<rect x="6" y= "11" width="10" height="1" />' +
            '<rect x="6" y= "14" width="10" height="1" />' +
            '<rect x="6" y= "17" width="10" height="1" />' +
            '<rect x="6" y= "20" width="10" height="1" />',
            print: '<rect x="5" y= "1" width="14" height="4" />' +
            '<polygon points= "22,8 22,7 19,7 19,6 5,6 5,7 2,7 2,8 1,8 1,11 1,20 2,20 2,21 5,21 5,11 19,11 19,21 22,21 22,20 23,20 23, 11 23, 8 "/>' +
            '<path d="M6,12v11h12V12H6z M16,21H8v-1h8V21z M16,18H8v-1h8V18z M16,15H8v-1h8V15z" />',
            exports: '<path d="M19.6,23"/>' +
            '<polyline points="5,19 5,2 13,2 13,7 14.3,7 15,7 18,7 18,9 20,9 20,7 20,6.4 20,5 20,4 19,4 19,5 15,5 15,2 15,1 16,1 16,0 15,0 5,0 3,0 3,2 3,19 3,21 5,21 "/>' +
            '<rect x="18" y="3" width="1" height="1"/>' +
            '<rect x="17" y="2" width="1" height="1"/>' +
            '<rect x="16" y="1" width="1" height="1"/>' +
            '<polygon points="17,16.6 20,14.1 17,11.6 17,13.6 13,13.6 13,14.6 17,14.6 "/>' +
            '<rect x="3" y="20.9" width="2" height="3.1"/>' +
            '<rect x="4.5" y="22" width="15.6" height="2"/>' +
            '<rect x="18" y="8.4" width="2" height="1.6"/>' +
            '<rect x="18" y="18" width="2.1" height="6"/>',
            portrait: '<path d="M19,0L19,0L5,0v0H3v24h0.1H5h14h1.7H21V0H19z M12.5,23h-1v-1h1V23z M19,21H5V2h14V21z"/>',
            landscape: '<path d="M24,19L24,19l0-14h0V3H0v0.1V5v14v1.7V21h24V19z M1,12.5v-1h1v1H1z M3,19V5h19v14H3z"/>',
            pageSetup: '<rect x="18" y="1" width="1" height="1"/>' +
            '<rect x="19" y="2" width="1" height="1"/>' +
            '<rect x="20" y="3" width="1" height="1"/>' +
            '<polygon points="22,5 22,4 21,4 21,5 20.4,5 20,5 17,5 17,2 17,1.3 17,1 18,1 18,0 17,0 17,0 7,0 6,0 5,0 5,5 7,5 7,2 15,2 15,7 16,7 17,7 20,7 20,22.1 7,22.1 7,19 5,19 5,24 5.9,24 7,24 20,24 21.1,24 22,24 22,5 "/>' +
            '<rect x="5" y="7" width="2" height="2"/>' +
            '<rect x="5" y="11" width="2" height="2"/>' +
            '<rect x="5" y="15" width="2" height="2"/>' +
            '<rect x="9" y="11" width="2" height="2"/>' +
            '<rect x="1" y="11" width="2" height="2"/>' +
            '<polygon points="9,8 9,8 8,8 8,9 9,9 9,10 10,10 10,8 "/>' +
            '<polygon points="2,9 2,9 2,10 3,10 3,9 4,9 4,8 2,8 "/>' +
            '<polygon points="3,16 3,16 4,16 4,15 3,15 3,14 2,14 2,16 "/>' +
            '<polygon points="10,15 10,15 10,14 9,14 9,15 8,15 8,16 10,16 "/>',
            previousPage: '<circle opacity=".25" cx="12" cy="12" r="12"/><polygon points="5.6,10.7 12,4.4 18.4,10.7 18.4,15 13.5,10.1 13.5,19.6 10.4,19.6 10.4,10.1 5.6,15 " />',
            nextPage: '<circle opacity=".25" cx="12" cy="12" r="12"/><polygon points="18.4,13.3 12,19.6 5.6,13.3 5.6,9 10.5,13.9 10.5,4.4 13.6,4.4 13.6,13.9 18.4,9 " />',
            firstPage: '<circle opacity=".25" cx="12" cy="12" r="12"/>' +
            '<polygon points="6.5,13.1 12,7.8 17.5,13.1 17.5,17.5 13.5,13.5 13.5,19.6 10.4,19.6 10.4,13.5 6.5,17.5 " />' +
            '<rect x="6.5" y= "4.4" width="10.9" height="2.2" />',
            lastPage: '<circle opacity=".25" cx="12" cy="12" r="12"/>' +
            '<polygon points="17.5,10.9 12,16.2 6.5,10.9 6.5,6.5 10.5,10.5 10.5,4.4 13.6,4.4 13.6,10.5 17.5,6.5 " />' +
            '<rect x="6.5" y= "17.5" transform="matrix(-1 -8.987357e-011 8.987357e-011 -1 24 37.0909)" width="10.9" height="2.2" />',
            backwardHistory: '<circle opacity=".25" cx="12" cy="12" r="12"/>' +
            '<polygon points="10.7,18.4 4.4,12 10.7,5.6 15,5.6 10.1,10.5 19.6,10.5 19.6,13.6 10.1,13.6 15,18.4 " />',
            forwardHistory: '<circle opacity=".25" cx="12" cy="12" r="12"/>' +
            '<polygon points="13.3,5.6 19.6,12 13.3,18.4 9,18.4 13.9,13.5 4.4,13.5 4.4,10.4 13.9,10.4 9,5.6 " />',
            selectTool: '<polygon points="19.9,13.4 5.6,1.1 5.3,19.9 10.5,14.7 14.3,23.3 16.4,22.4 12.6,13.8 "/>',
            moveTool: '<polygon points="12.5,3 14.5,3 12,0 9.5,3 11.5,3 11.5,21 11.5,21 9.6,21 12,24 14.5,21 12.5,21 "/>' +
            '<polygon points="21,12.5 21,14.5 24,12 21,9.5 21,11.5 3,11.5 3,11.5 3,9.6 0,12 3,14.5 3,12.5 "/>',
            continuousView: '<polygon points="22,0 22,5 9,5 9,0 7,0 7,5 7,7 7,7 24,7 24,7 24,5 24,0 "/>' +
            '<polygon points="23,15 19,15 19,11 20,11 20,10 19,10 18,10 17,10 9,10 7.4,10 7,10 7,24 9,24 9,12 17,12 17,15 17,16.6 17,17 22,17 22,24 24,24 24,17 24,15.1 24,15 24,15 24,14 23,14 "/>' +
            '<rect x="22" y="13" width="1" height="1"/>' +
            '<polygon points="20.9,12 20.9,13 22,13 22,12 21,12 21,11 20,11 20,12 "/>' +
            '<polygon points="4.9,5.2 2.5,2.2 0,5.2 2,5.2 2,9.2 3,9.2 3,5.2 "/>' +
            '<polygon points="2.9,19.2 2.9,15.2 1.9,15.2 1.9,19.2 0,19.2 2.5,22.1 4.9,19.2 "/>',
            singleView: '<rect x="16" y="1" width="1" height="1"/>' +
            '<rect x="17" y="2" width="1" height="1"/>' +
            '<rect x="18" y="3" width="1" height="1"/>' +
            '<path d="M20,5V4h-1v1h-0.6H18h-3V2V1.3V1h1V0h-1h0H5H4H3v24h2v0h13h1.1H20L20,5L20,5z M5,22.1V2h8v5h1h1h3v15.1H5z"/>',
            fitWholePage: '<rect x="16" y="1" width="1" height="1"/>' +
            '<rect x="17" y="2" width="1" height="1"/>' +
            '<rect x="18" y="3" width="1" height="1"/>' +
            '<path d="M20,5V4h-1v1h-0.6H18h-3V2V1.3V1h1V0h-1h0H5H4H3v24h2v0h13h1.1H20L20,5L20,5z M18,22.1H5V2h8v5h1h1h3V22.1z"/>' +
            '<polygon points="17,13.5 15,11 15,13 13,13 13,14 15,14 15,16 "/>' +
            '<polygon points="6,13.5 8,16 8,14 10,14 10,13 8,13 8,11 "/>' +
            '<polygon points="11.5,7 9,9 11,9 11,11 12,11 12,9 14,9 "/>' +
            '<polygon points="11.5,20 14,18 12,18 12,16 11,16 11,18 9,18 "/>',
            fitPageWidth: '<rect x="16" y="1" width="1" height="1"/>' +
            '<rect x="17" y="2" width="1" height="1"/>' +
            '<rect x="18" y="3" width="1" height="1"/>' +
            '<path d="M20,5V4h-1v1h-0.6H18h-3V2V1.3V1h1V0h-1h0H5H4H3v24h2v0h13h1.1H20L20,5L20,5z M5,22.1V2h8v5h1h1h3v15.1H5z"/>' +
            '<polygon points="14,15.5 17,13 14,10.6 14,12.6 13,12.6 13,13.6 14,13.6 "/>' +
            '<polyline points="6,13.1 9,15.6 9,13.6 10,13.6 10,12.6 9,12.6 9,10.6 6,13.1 "/>',
            zoomOut: '<circle opacity=".25" cx="12" cy="12" r="12"/><rect opacity=".75" x="5" y="10" width="14" height="3"/>',
            zoomIn: '<circle opacity=".25" cx="12" cy="12" r="12"/><polygon opacity=".75" points="19,10 13.5,10 13.5,4.5 10.5,4.5 10.5,10 5,10 5,13 10.5,13 10.5,18.5 13.5,18.5 13.5,13 19,13 " />',
            fullScreen: '<path d="M22,0H0v2.8V4v20h1.5H2h20h0.7H24V4V0H22z M7,1h1v1H7V1z M5,1h1v1H5V1z M3,1h1v1H3V1z M22,22H2L2,4h20L22,22z" />' +
            '<polygon points="19.6,9.9 20,6 16.1,6.4 17.6,7.8 14.7,10.6 15.4,11.3 18.3,8.5"/>' +
            '<polygon points="4.4,16.2 4,20 7.9,19.7 6.5,18.3 9.3,15.5 8.6,14.8 5.8,17.6"/>',
            exitFullScreen: '<path d="M22,0H0v2.8V4v20h1.5H2h20h0.7H24V4V0H22z M7,1h1v1H7V1z M5,1h1v1H5V1z M3,1h1v1H3V1z M22,22H2L2,4h20L22,22z" />' +
            '<polygon points="9.2,18.6 9.6,14.7 5.7,15.1 7.2,16.5 4.3,19.3 5,20 7.9,17.2"/>' +
            '<polygon points="14.8,7.5 14.4,11.3 18.3,11 16.9,9.6 19.7,6.8 19,6.1 16.2,8.9"/>',
            thumbnails: '<path d="M20,2h-5h-2v2v5v2v0h2v0h5v0h2v0V9V4V2H20z M20,9h-5V4h5V9z"/>' +
            '<path d="M20,13h-5h-2v2v5v2v0h2v0h5v0h2v0v-2v-5v-2H20z M20,20h-5v-5h5V20z"/>' +
            '<path d="M9,13H4H2v2v5v2v0h2v0h5v0h2v0v-2v-5v-2H9z M9,20H4v-5h5V20z"/>' +
            '<rect x="2" y="2" width="9" height="9"/>',
            outlines: '<path d="M22,0H2H0v2v20v2h2h20h2v-2V2V0H22z M2,2h12v20H2V2z M22,22h-6V2h6V22z"/>' +
            '<rect x="17.5" y="5" width="3" height="1" />' +
            '<rect x="17.5" y="8" width="3" height="1"/>' +
            '<rect x="17.5" y="11" width="3" height="1"/>',
            search: '<mask id="wj-viewer-search-mask"><rect width="100%" height="100%" opacity="1" fill="white"/><circle cx="9.5" cy="9.5" r="6.5"/></mask>' +
            '<circle cx="9.5" cy="9.5" r="8.5" mask="url(#wj-viewer-search-mask)"/>' +
            '<rect x="16.9" y="13.7" transform="matrix(-0.7193 0.6947 -0.6947 -0.7193 44.3315 18.4942)" width="3" height="9"/>',
            searchNext: '<polygon points="12,12.6 4,4.5 4,11.4 12,19.5 20,11.4 20,4.5 "/>',
            searchPrevious: '<polygon points="12,11.4 20,19.5 20,12.6 12,4.5 4,12.6 4,19.5 "/>'
        },
        _svgStart = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox = "0 0 24 24" xml: space = "preserve" >',
        _svgEnd = '</svg>';

    /** Defines the view modes. */
    export enum ViewMode {
        /** The single view mode. */
        Single,
        /** The continuouse view mode. */
        Continuous
    }

    export interface _IPage {
        content: any;
        size?: _ISize;
    }

    export interface _ISize {
        width: _Unit;
        height: _Unit;
    }

    export interface _IHistory {
        zoomFactor: number;
        position: _IDocumentPosition;
    }

    export class _HistoryManager {
        private _items: _IHistory[] = [];
        private _position: number = -1;

        statusChanged = new Event();

        private _onStatusChanged() {
            this.statusChanged.raise(this, new EventArgs());
        }

        clear(): void {
            if (this._items.length == 0) return;

            this._items.length = 0;
            this._position = -1;
            this._onStatusChanged();
        }

        add(item: _IHistory) {
            if (!item) {
                return;
            }

            this._items.splice(this._position + 1);
            this._items.push(item);
            this._position = this._items.length - 1;
            this._onStatusChanged();
        }

        forward(): _IHistory {
            if (!this.canForward()) {
                return null;
            }

            this._position++;
            this._onStatusChanged();
            return this._items[this._position];
        }

        backward(): _IHistory {
            if (!this.canBackward()) {
                return null;
            }

            this._position--;
            this._onStatusChanged();
            return this._items[this._position];
        }

        canForward(): boolean {
            return this._items.length > 0 && this._position < this._items.length - 1;
        }

        canBackward(): boolean {
            return this._items.length > 0 && this._position > 0;
        }
    }

    /**
     * Defines an abstract class for the viewer controls.
     */
    export class ViewerBase extends Control {
        // TODO: Begin: need refactor, we can create a ViewPane control to handle the pages display.
        private _scrollbarWidth: number;
        private _leftPanel: HTMLElement;
        _viewpanelContainer: HTMLElement;
        private _viewpanelWrapper: HTMLElement;
        private _initialPosition: _IDocumentPosition;
        private _initialTop: number = 0;
        private _initialLeft: number = 0;
        private _isScrolling: boolean = true;
        private _pageNumberChangedByScrolling = false;
        private _viewerContainer: HTMLElement;
        private _preFetchPageCount: number = 3;
        private _pages: _IPage[] = [];
        // End: need refactor

        _documentEventKey: string;
        private _keepSerConnTimer: number;
        private _documentSource: _DocumentSource;
        _pageNumber: number = 1;
        private _zoomFactor: number = 1;
        private _selectMouseMode: boolean = true;
        private _viewMode = ViewMode.Single;
        private _serviceUrl: string;
        private _filePath: string;
        private _paginated: boolean;
        private _needBind: boolean = false;
        private _historyManager: _HistoryManager = new _HistoryManager();
        private _fullScreen: boolean = false;

        _sidePanel: HTMLElement;
        private _toolbar: HTMLElement;
        private _miniToolbar: HTMLElement;
        private _splitter: HTMLElement;
        private _pageSetupDialog: _PageSetupDialog;
        private _expiredTime: number;
        private _autoHeightCalculated: boolean = false;
        private _startX: number;
        private _startY: number;
        private _exportMenu: wijmo.input.Menu;
        private _placeHolderElement: HTMLDivElement;
        private _hostOriginWidth: string;
        private _hostOriginHeight: string;

        private static _bookmarkAttr = 'bookmark';
        private static _isIE = !!navigator.userAgent.match(/MSIE |Trident\/|Edge\//);
        private static _bookmarkReg = /javascript\:navigate\(['|"](.*)['|"]\)/;
        private static _customActionAttr = 'customAction';
        private static _customActionReg = /^CA\:/;
        private static _viewpanelContainerMinHeight: number = 300;

        static _defaultZoomValues = [{ name: Globalize.format(0.05, 'p0'), value: 0.05 }, { name: Globalize.format(0.25, 'p0'), value: 0.25 },
            { name: Globalize.format(0.5, 'p0'), value: 0.5 },
            { name: Globalize.format(0.75, 'p0'), value: 0.75 }, { name: Globalize.format(1, 'p0'), value: 1 },
            { name: Globalize.format(2, 'p0'), value: 2 }, { name: Globalize.format(3, 'p0'), value: 3 }, { name: Globalize.format(4, 'p0'), value: 4 },
            { name: Globalize.format(8, 'p0'), value: 8 }, { name: Globalize.format(10, 'p0'), value: 10 }];

        private static _exportNames = {
            'pdf': wijmo.culture.Viewer.pdfExportName, 'docx': wijmo.culture.Viewer.docxExportName, 'xlsx': wijmo.culture.Viewer.xlsxExportName,
            'doc': wijmo.culture.Viewer.docExportName, 'xls': wijmo.culture.Viewer.xlsExportName, 'mhtml': wijmo.culture.Viewer.mhtmlExportname,
            'html': wijmo.culture.Viewer.htmlExportName, 'rtf': wijmo.culture.Viewer.rtfExportName, 'zip': wijmo.culture.Viewer.metafileExportName,
            'csv': wijmo.culture.Viewer.csvExportName, 'tiff': wijmo.culture.Viewer.tiffExportName, 'bmp': wijmo.culture.Viewer.bmpExportName,
            'emf': wijmo.culture.Viewer.emfExportName, 'gif': wijmo.culture.Viewer.gifExportName, 'jpeg': wijmo.culture.Viewer.jpegExportName,
            'jpg': wijmo.culture.Viewer.jpegExportName, 'png': wijmo.culture.Viewer.pngExportName
        };

        /**
         * Gets or sets the template used to instantiate the Viewer controls.
         */
        static controlTemplate = '<div class="wj-viewer-outer wj-content">' +
        '<div wj-part="toolbar"></div>' +
        '<div class="wj-viewer-container" wj-part="viewer-container">' +
            '<div class="wj-viewer-leftpanel" wj-part="viewer-left-panel">' +
                '<div class="wj-viewer-tabsleft" wj-part="side-panel">' +
                '</div>' +
            '</div>' +
            '<div class="wj-viewer-splitter" wj-part="splitter">' +
                '<button class="wj-btn wj-btn-default" type="button">' +
                '<span class="wj-glyph-right"></span>' +
                '</button>' +
            '</div>' +
                '<div class="wj-viewpanel-container" wj-part="viewpanel-container" tabIndex="-1">' +
                    '<div class="wj-viewpanel-wrapper" wj-part="viewpanel-wrapper">' +
                    '</div>' +
                '</div>' +
        '</div>' +
        '<div wj-part="mini-toolbar"></div>'+
        '</div>';

        // Occurs after the document source changes.
        _documentSourceChanged = new Event();

        /**
         * Occurs after the page number is changed.
         */
        pageNumberChanged = new Event();

        /**
         * Occurs after the view mode is changed.
         */
        viewModeChanged = new Event();

        /**
         * Occurs after the select mouse mode is changed.
         */
        selectMouseModeChanged = new Event();

        /**
         * Occurs after the full page view mode is changed.
         */
        fullScreenChanged = new Event();

        /**
         * Occurs after the zoom factor is changed.
         */
        zoomFactorChanged = new Event();

        /**
         * Queries the request data sent to the service before loading the document.
         */
        queryLoadingData = new Event();

        /**
         * Initializes a new instance of a @see:ViewerBase control.
         *
         * @param element The DOM element that will host the control, or a selector for the host element (e.g. '#theCtrl').
         * @param options JavaScript object containing initialization data for the control.
         */
        constructor(element: any, options?: any) {
            super(element, options, true);
            this._documentEventKey = new Date().getTime().toString();
            this._init(options);
        }

        /**
         * Gets or sets the service url.
         */
        get serviceUrl(): string {
            return this._serviceUrl;
        }
        set serviceUrl(value: string) {
            if (value != this._serviceUrl) {
                this._serviceUrl = value;
                this._needBindDocumentSource();
                this.invalidate();
            }
        }

        /**
         * Gets or sets the document path.
         */
        get filePath(): string {
            return this._filePath;
        }
        set filePath(value: string) {
            if (value != this._filePath) {
                this._filePath = value;
                this._needBindDocumentSource();
                this.invalidate();
            }
        }

        // Gets or sets a value indicating whether the content should be represented as set of fixed sized pages.
        // The default value is null, means using the default value from document source.
        get _innerPaginated(): boolean {
            if (this._documentSource && !this._needBind) {
                return this._documentSource.paginated;
            } else {
                return this._paginated;
            }
        }
        set _innerPaginated(value: boolean) {
            if (this._documentSource && !this._needBind) {
                this._setPaginated(value);
            } else {
                this._paginated = value == null ? null : asBoolean(value);
            }
        }

        /**
         * Reloads the document.
         */
        reload() {
            this._needBindDocumentSource();
            this.invalidate();
        }

        /**
         * Refreshes the control.
         *
         * @param fullUpdate Whether to update the control layout as well as the content.
         */
        refresh(fullUpdate = true) {
            super.refresh(fullUpdate);
            if (this._needBind) {
                this._setDocumentSource(this._getSource())
                this._needBind = false;
            }

            this._resetMiniToolbarPosition();
            this._resetToolbarWidth();
            this._resetViewPanelContainerWidth();
            this._autoHeightCalculated = false;
        }

        // Creates a _DocumentSource object and return it.
        _getSource(): _DocumentSource {
            if (!this.filePath) {
                return null;
            }

            return new _DocumentSource({
                serviceUrl: this._serviceUrl,
                filePath: this._filePath
            });
        }

        _needBindDocumentSource() {
            this._needBind = true;
        }

        private _init(options?: any): void {
            this._createChildren();
            this._resetToolbarWidth();
            this._resetViewPanelContainerWidth();
            this._autoCalculateViewerContainerHeight();
            this._bindEvents();
            this.deferUpdate(() => {
                this.initialize(options);
            });
        }

        private _autoCalculateViewerContainerHeight() {
            if (!this._shouldAutoHeight()) {
                return;
            }
            var viewpanelContainerStyleHeight = this._viewpanelContainer.style.height;
            this._viewpanelContainer.style.height = 'auto';
            this._viewerContainer.style.height =
                Math.max(this._viewpanelContainer.getBoundingClientRect().height, ViewerBase._viewpanelContainerMinHeight) + 'px';
            this._viewpanelContainer.style.height = viewpanelContainerStyleHeight;
        }

        private _bindEvents(): void {
            var viewerScrollingTimer: number;

            _addEvent(this._viewpanelContainer, 'click', e => {
                this._viewpanelContainer.focus();

            });

            _addEvent(window, 'unload', () => {
                if (this._documentSource) {
                    this._documentSource.dispose();
                }
            });

            _addEvent(this._viewpanelContainer, 'scroll', () => {
                if (viewerScrollingTimer !== null) {
                    clearTimeout(viewerScrollingTimer);
                }
                viewerScrollingTimer = setTimeout(() => {
                    this._isScrolling = true;
                    this._onViewScrolling();
                }, 200);
            });

            _addEvent(document, 'mousemove', (e) => {
                var isPanning = this._startX && this._startY;
                if (isPanning) {
                    this._panning(e);
                    return;
                }
                if (this.fullScreen) {
                    this._showMiniToolbar(this._checkMiniToolbarVisible(e));
                }
            });

            _addEvent(document, 'mouseup', (e) => {
                this._stopPanning();
            });

            this._historyManager.statusChanged.addHandler(this._onHistoryManagerStatusUpdated, this);
            this._onHistoryManagerStatusUpdated();
        }

        private _checkMiniToolbarVisible(e: MouseEvent): boolean {
            var x = e.clientX,
                y = e.clientY;
            var bound = this._miniToolbar.getBoundingClientRect(),
                visibleOffset = 60,
                visibleLeft = bound.left - visibleOffset,
                visibleRight = bound.right + visibleOffset,
                visibleTop = bound.top - visibleOffset,
                visibleBottom = bound.bottom + visibleOffset;

            return x >= visibleLeft && x <= visibleRight &&
                y >= visibleTop && y <= visibleBottom;
        }

        private _showMiniToolbar(visible: boolean) {
            var opacity = parseFloat(getComputedStyle(this._miniToolbar, '')['opacity']),
                step = 0.01,
                t: number,
                toolbar = this._miniToolbar;
            if (visible) {
                t = setInterval(function () {
                    if (opacity >= 0.8) {
                        window.clearInterval(t);
                        return;
                    }
                    opacity += step;
                    toolbar.style.opacity = opacity.toString();
                }, 1);
            }
            else {
                t = setInterval(function () {
                    if (opacity < 0) {
                        window.clearInterval(t);
                        return;
                    }
                    opacity -= step;
                    toolbar.style.opacity = opacity.toString();
                }, 1);
            }
        }

        private _startPanning(e: MouseEvent) {
            this._startX = e.screenX;
            this._startY = e.screenY;
        }

        private _panning(e: MouseEvent) {
            this._viewpanelContainer.scrollLeft += this._startX - e.screenX;
            this._viewpanelContainer.scrollTop += this._startY - e.screenY;
            this._startX = e.screenX;
            this._startY = e.screenY;
        }

        private _stopPanning() {
            this._startX = null;
            this._startY = null;
        }

        _goToBookmark(name: string) {
            if (!this._documentSource || name === "") {
                return;
            }

            this._documentSource.getBookmark(name).then((bookmark: _IDocumentPosition) => {
                if (bookmark) {
                    this._scrollToPosition(bookmark, true);
                }
            });
        }

        _executeCustomAction(actionString: string) {
            if (!this._documentSource || actionString === "") {
                return;
            }

            // remember the current position
            this._initialPosition = {
                pageIndex: this._pageNumber - 1,
                pageBounds: { x: this._initialLeft, y: this._initialTop, width: 0, height: 0 }
            };

            this._resetDocument();
            this._showViewPanelMessage();
            this._setDocumentRendering();

            var documentSource = this._documentSource;
            this._documentSource.executeCustomAction(actionString).then(position => {
                // scroll to the new position after custom action is performed.
                this._initialPosition = position || this._initialPosition;
                // update the status to force updating view.
                this._getStatusUtilCompleted(documentSource);
            }).catch(reason => {
                this._showViewPanelErrorMessage(this._getErrorMessage(reason));
            });
        }

        _getStatusUtilCompleted(documentSource: _DocumentSource) {
            if (!documentSource || documentSource.isLoadCompleted
                || documentSource.isDisposed) {
                return;
            }

            documentSource.getDocumentStatus().then(v => {
                if (this._documentSource !== documentSource) {
                    return;
                }

                setTimeout(() => this._getStatusUtilCompleted(documentSource), 100);
            });
        }

        private _onViewScrolling(): void {
            //only do the changes if it is continuous mode and invoked by scrolling the scrollbar.
            if (this.viewMode === ViewMode.Single || this._documentSource.pageCount <= this._preFetchPageCount || !this._isScrolling) {
                this._isScrolling = true;
                return;
            }

            this._updateScrollPageNumber(true);
        }

        private _updateScrollPageNumber(isScrolling: boolean): void {
            var self = this, scrollTop: number,
                pageMargin: number, pageHeight: number, currentPageIndex: number;

            scrollTop = self._viewpanelContainer.scrollTop;
            pageMargin = 30;
            pageHeight = self._documentSource.pageSettings.height.valueInPixel * self._zoomFactor;

            currentPageIndex = Math.round(scrollTop / (pageHeight + pageMargin));
            if (self._pageNumber !== currentPageIndex + 1) {
                self._pageNumberChangedByScrolling = true;
                self._innerMoveToPage(currentPageIndex + 1, isScrolling);
            }
        }

        private _createChildren() {
            // instantiate and apply template
            var tpl = this.getTemplate();
            this.applyTemplate('wj-viewer wj-control', tpl, {
                _viewpanelContainer: 'viewpanel-container',
                _viewpanelWrapper: 'viewpanel-wrapper',
                _toolbar: 'toolbar',
                _miniToolbar: 'mini-toolbar',
                _leftPanel: 'viewer-left-panel',
                _sidePanel: 'side-panel',
                _viewerContainer: 'viewer-container',
                _splitter: 'splitter'
            });

            this._initToolbars();
            this._initSidePanel();
            this._initSplitter();
        }

        private _initSplitter() {
            _addEvent(this._splitter, 'click', () => this._toggleSplitter());
        }

        _toggleSplitter(collapsed?: boolean) {
            var leftCss = 'wj-glyph-left', rightCss = 'wj-glyph-right',
                arrow = <HTMLElement>this._splitter.querySelector('span'),
                tabs = (<_SideTabs>wijmo.Control.getControl(this._sidePanel));

            if (collapsed === true) {
                if (hasClass(arrow, rightCss)) {
                    return;
                }
            } else if (collapsed === false) {
                if (hasClass(arrow, leftCss)) {
                    return;
                }
            } else {
                collapsed = hasClass(arrow, leftCss);
            }

            if (!collapsed) {
                if (tabs.visibleTabPagesCount === 0) {
                    return;
                }
                arrow.className = leftCss;
                tabs.expand();
            } else {
                tabs.collapse();
                arrow.className = rightCss;
            }

            this._resetViewPanelContainerWidth();
        }

        private _resetMiniToolbarPosition() {
            var containerWidth = this.hostElement.getBoundingClientRect().width,
                selfWidth = this._miniToolbar.getBoundingClientRect().width;
            this._miniToolbar.style.left = (containerWidth - selfWidth) / 2 + 'px';
        }

        private _resetToolbarWidth() {
            var toolbar = <_Toolbar>wijmo.Control.getControl(this._toolbar);
            toolbar.resetWidth();
        }

        private _resetViewPanelContainerWidth() {
            var self = this;
            self._viewpanelContainer.style.width = self._viewerContainer.getBoundingClientRect().width -
                self._splitter.getBoundingClientRect().width - self._leftPanel.getBoundingClientRect().width + 'px';
        }

        private _shouldAutoHeight(): boolean {
            return this.hostElement.style.height === '100%' || this.hostElement.style.height === 'auto';
        }

        private _initSidePanel() {
            var sideTabs = new _SideTabs(this._sidePanel);
            sideTabs.collapse();
            sideTabs.collapsed.addHandler(() => {
                this._toggleSplitter(true);
            });
            sideTabs.expanded.addHandler(() => {
                this._toggleSplitter(false);

                var sidePanelAndSplitterWidth = this._sidePanel.getBoundingClientRect().width + this._splitter.getBoundingClientRect().width;
                if (sidePanelAndSplitterWidth > this._viewerContainer.getBoundingClientRect().width) {
                    addClass(this._sidePanel, "collapsed");
                }
            });
            sideTabs.tabPageVisibilityChanged.addHandler((sender, e: _TabPageVisibilityChangedEventArgs) => {
                if ((!e.tabPage.isHidden && sideTabs.visibleTabPagesCount == 1)
                    || (e.tabPage.isHidden && sideTabs.visibleTabPagesCount == 0)) {
                    this._resetViewPanelContainerWidth();
                }
            });

            this._initSidePanelThumbnails();
            this._initSidePanelOutlines();
            this._initSidePanelSearch();
        }

        private _highlightPosition(pageIndex: number, boundsList: _IRect[]): void {
            this._innerMoveToPage(pageIndex + 1).then(_ => {
                var self = this, g: SVGGElement, viewPage: HTMLDivElement, preHighlights: NodeList, viewPages: NodeList,
                    oldPageNumber = self._pageNumber, oldScrollTop = self._viewpanelContainer.scrollTop, oldScrollLeft = self._viewpanelContainer.scrollLeft,
                    historyPosition: _IDocumentPosition = { pageIndex: pageIndex, pageBounds: null };

                switch (self.viewMode) {
                    case (ViewMode.Continuous):
                        viewPages = self._viewpanelWrapper.querySelectorAll('.wj-view-page');
                        viewPage = <HTMLDivElement>viewPages.item(pageIndex);
                        break;
                    case (ViewMode.Single):
                        viewPage = <HTMLDivElement>self._viewpanelWrapper.querySelector('.wj-view-page');
                        break;
                }

                g = <SVGGElement>viewPage.querySelector('g');
                preHighlights = self._viewpanelWrapper.querySelectorAll('.highlight');

                for (var i = 0; i < preHighlights.length; i++) {
                    preHighlights.item(i).parentNode.removeChild(preHighlights.item(i));
                }

                for (var i = 0; i < boundsList.length; i++) {
                    var rect = <SVGRectElement>document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    rect.setAttributeNS(null, 'x', _twipToPixel(boundsList[i].x).toString());
                    rect.setAttributeNS(null, 'y', _twipToPixel(boundsList[i].y).toString());
                    rect.setAttributeNS(null, 'height', _twipToPixel(boundsList[i].height).toString());
                    rect.setAttributeNS(null, 'width', _twipToPixel(boundsList[i].width).toString());
                    rect.setAttributeNS(null, 'class', 'highlight');
                    g.appendChild(rect);
                }
                if (boundsList.length > 0) {
                    historyPosition.pageBounds = boundsList[0];
                    self._scrollToPosition(historyPosition);
                }

                if (oldPageNumber != pageIndex + 1
                    || oldScrollTop != self._viewpanelContainer.scrollTop
                    || oldScrollLeft != self._viewpanelContainer.scrollLeft) {
                    self._addHistory(historyPosition);
                }
            });
        }

        private _scrollToPosition(position: _IDocumentPosition, addHistory?: boolean) {
            var pageIndex: number = position.pageIndex || 0,
                bound: _IRect = position.pageBounds || { x: 0, y: 0, width: 0, height: 0 },
                zoomFactor = this.zoomFactor, heightOffset: number, widthOffset: number;
            heightOffset = _twipToPixel(bound.y) * zoomFactor + 30;
            widthOffset = _twipToPixel(bound.x) * zoomFactor + 30;
            this._initialTop = heightOffset;
            this._initialLeft = widthOffset;
            if (this._pageNumber !== pageIndex + 1) {
                this._innerMoveToPage(pageIndex + 1);
            } else {
                if (this.viewMode === ViewMode.Continuous) {
                    this._scrollToCurrentPage();
                } else {
                    this._scrollToInitialPosition();
                }
            }

            if (addHistory === true) {
                this._addHistory(position);
            }
        }

        private _initSidePanelSearch() {
            var sideTabs = <_SideTabs>wijmo.Control.getControl(this._sidePanel);
            sideTabs.addPage(wijmo.culture.Viewer.search, icons.search).format(t => {
                var settingsHtml =
                    '<div class="wj-searchcontainer">' +
                    '<input class="wj-searchbox" wj-part="search-box" type="text"/>' +
                    '<div class="wj-btn-group">' +
                    '<button class="wj-btn wj-btn-searchpre">' + _createSvgBtn(icons.searchPrevious).innerHTML + '</button>' +
                    '<button class="wj-btn wj-btn-searchnext">' + _createSvgBtn(icons.searchNext).innerHTML + '</button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="wj-searchoption">' +
                    '<label >&nbsp;&nbsp;&nbsp;' + wijmo.culture.Viewer.matchCase + '<input type="checkbox" wj-part="match-case"/></label>' +
                    '</div>' +
                    '<div class="wj-searchoption">' +
                    '<label>&nbsp;&nbsp;&nbsp;' + wijmo.culture.Viewer.wholeWord + '<input type="checkbox" wj-part="whole-word"/></label>' +
                    '</div>' +
                    '<h3 class="wj-searchresult">' + wijmo.culture.Viewer.searchResults + '</h3>',
                    settingsElement = _toDOMs(settingsHtml),
                    searchResults: _ISearchResult[];

                t.outContent.querySelector('.wj-tabtitle-wrapper').appendChild(settingsElement);
                var matchCaseCheckBox = <HTMLInputElement>t.outContent.querySelectorAll('input[type="checkbox"]')[0],
                    wholeWordCheckBox = <HTMLInputElement>t.outContent.querySelectorAll('input[type="checkbox"]')[1],
                    input = <HTMLInputElement>t.outContent.querySelector('input[type="text"]'),
                    preBtn = t.outContent.querySelector('.wj-btn-searchpre'),
                    nextBtn = t.outContent.querySelector('.wj-btn-searchnext');
                addClass(t.content.parentElement, 'search-wrapper');
                addClass(t.content, 'wj-searchresultlist');
                var list = new wijmo.input.ListBox(t.content), isSettingItemsSource = false, highlighting = false;
                list.formatItem.addHandler((sender, e: wijmo.input.FormatItemEventArgs) => {
                    var searchItem = e.item, data = <_ISearchResult>e.data,
                        searchPageNumberDiv = document.createElement('div'),
                        searchTextDiv = document.createElement('div');
                    searchItem.innerHTML = '';
                    searchTextDiv.innerHTML = data.nearText;
                    searchTextDiv.className = 'wj-search-text';
                    searchPageNumberDiv.innerHTML = 'Page ' + (data.pageIndex + 1);
                    searchPageNumberDiv.className = 'wj-search-page';
                    addClass(searchItem, 'wj-search-item');
                    searchItem.setAttribute('tabIndex', '-1');
                    searchItem.appendChild(searchTextDiv);
                    searchItem.appendChild(searchPageNumberDiv);
                });

                var highlightIndex = -1, highlight = index => {
                    if (isSettingItemsSource || highlighting) {
                        return;
                    }

                    var currentResults = <_ISearchResult[]>(searchResults || list.itemsSource);
                    if (index === -1 || !currentResults || !currentResults.length) {
                        highlightIndex = -1;
                        list.selectedIndex = -1;
                        return;
                    }

                    highlightIndex = index;
                    var result = currentResults[highlightIndex];
                    if (!result) {
                        return;
                    }

                    highlighting = true;
                    list.selectedIndex = index;
                    this._highlightPosition(result.pageIndex, result.boundsList);
                    highlighting = false;
                };

                list.selectedIndexChanged.addHandler(() => highlight(list.selectedIndex));
                var clearResult = () => {
                    searchResults = null;
                }, callSearch = (): IPromise => {
                    var p = new _Promise();
                    if (searchResults) {
                        p.resolve(searchResults);
                        return p;
                    }

                    if (!this._documentSource) {
                        p.reject('Cannot search without document source.');
                        return p;
                    }

                    if (!input.value) {
                        return p;
                    }

                    highlightIndex = -1;
                    return this._documentSource.search(input.value, matchCaseCheckBox.checked, wholeWordCheckBox.checked).then(v => {
                        searchResults = v;
                        isSettingItemsSource = true;
                        list.itemsSource = v;
                        isSettingItemsSource = false;
                    });
                }, search = (pre?: boolean) => {
                    callSearch().then(v => {
                        if (!v || !v.length) {
                            return;
                        }

                        var index = highlightIndex;
                        if (pre) {
                            index--;
                            if (index < 0) {
                                index = v.length - 1;
                            }
                        } else {
                            index++;
                            if (index >= v.length) {
                                index = 0;
                            }
                        }

                        index = Math.max(Math.min(index, v.length - 1), 0);
                        highlight(index);
                    });
                }, update = () => {
                    clearResult();
                    list.itemsSource = null;
                    matchCaseCheckBox.checked = false;
                    wholeWordCheckBox.checked = false;
                    input.value = '';

                    if (!this._documentSource || !this._documentSource.features
                        || (this._documentSource.paginated && !this._documentSource.features.textSearchInPaginatedMode)) {
                        sideTabs.hide(t);
                        return;
                    }

                    sideTabs.show(t);
                };

                this._documentSourceChanged.addHandler(() => {
                    if (this._documentSource) {
                        _addWjHandler(this._documentEventKey, this._documentSource.loadCompleted, update);
                    }
                    update();
                });

                _addEvent(matchCaseCheckBox, 'click', clearResult);
                _addEvent(wholeWordCheckBox, 'click', clearResult);
                _addEvent(input, 'input', clearResult);
                _addEvent(input, 'keyup', e => {
                    var event = e || window.event;
                    if (event.keyCode === Key.Enter) {
                        search(event.shiftKey);
                    }
                });

                _addEvent(nextBtn, 'click', () => search());
                _addEvent(preBtn, 'click', () => search(true));
                _addEvent(t.header, 'keydown', e => {
                    var next: Element, toolbar = this._toolbar;
                    if (e.keyCode === Key.Tab) {
                        next = toolbar.querySelector('[tabIndex=0]')
                            || toolbar.querySelector('input:not([type="hidden"])')
                            || toolbar;

                        if (next && next['focus']) {
                            (<HTMLElement>next).focus();
                            e.preventDefault();
                        }
                    }
                });
            });
        }

        private _initSidePanelOutlines() {
            var sideTabs = <_SideTabs>wijmo.Control.getControl(this._sidePanel);
            sideTabs.addPage(wijmo.culture.Viewer.outlines, icons.outlines).format(t => {
                addClass(t.content, 'wj-outlines-tree');
                var tree = new wijmo.grid.FlexGrid(t.content);
                tree.initialize({
                    autoGenerateColumns: false,
                    columns: [
                        { binding: 'caption', width: '*' }
                    ],
                    isReadOnly: true,
                    childItemsPath: 'children',
                    allowResizing: wijmo.grid.AllowResizing.None,
                    headersVisibility: wijmo.grid.HeadersVisibility.None
                });

                tree.itemFormatter = function (panel, r, c, cell: HTMLDivElement) {
                    var itemHeader: string;
                    if (cell.firstElementChild) {
                        itemHeader = (<HTMLElement>cell.firstElementChild).outerHTML;
                    } else {
                        itemHeader = '&nbsp;&nbsp;&nbsp;&nbsp;';
                    }
                    var position = panel.rows[r].dataItem['position'];
                    cell.innerHTML = itemHeader + '<a>' + panel.rows[r].dataItem['caption'] + '</a>';
                };

                var updatingOutlineSource = false;
                tree.selectionChanged.addHandler((flexGrid: grid.FlexGrid, e: grid.CellRangeEventArgs) => {
                    if (updatingOutlineSource) {
                        return;
                    }
                    var row = e.panel.rows[e.row];
                    if (row) {
                        this._scrollToPosition(row.dataItem['position'], true);
                    }
                });

                var isTreeRefreshed = false, refreshTree = () => {
                    if (isTreeRefreshed) return;

                    if (sideTabs.isCollapsed || !t.isActived || t.isHidden) {
                        return;
                    }

                    tree.refresh();
                    isTreeRefreshed = true;
                }, toggleTab = () => {
                    if (!this._documentSource) {
                        tree.itemsSource = null;
                        sideTabs.hide(t);
                        return;
                    }

                    var update = () => {
                        if (!this._documentSource.hasOutlines) {
                            tree.itemsSource = null;
                            sideTabs.hide(t);
                            return;
                        }

                        this._documentSource.getOutlines().then(items => {
                            isTreeRefreshed = false;
                            tree.itemsSource = items;
                            sideTabs.show(t);
                            refreshTree();
                        });
                    };

                    _addWjHandler(this._documentEventKey, this._documentSource.loadCompleted, update);
                    update();
                };

                this._documentSourceChanged.addHandler(toggleTab);
                sideTabs.expanded.addHandler(refreshTree);
                sideTabs.tabPageActived.addHandler(refreshTree);
                toggleTab();
            });
        }

        private _initSidePanelThumbnails() {
            var sideTabs = <_SideTabs>wijmo.Control.getControl(this._sidePanel);
            sideTabs.addPage(wijmo.culture.Viewer.thumbnails, icons.thumbnails).format(t => {
                addClass(t.content, 'wj-thumbnaillist');
                var list = new wijmo.input.ListBox(t.content),
                    pngUrls: string[] = null,
                    isItemsSourceSetting = false;
                list.formatItem.addHandler((sender, e: wijmo.input.FormatItemEventArgs) => {
                    var item = e.item, data = <string>e.data,
                        img: HTMLImageElement = document.createElement('img'),
                        indexDiv: HTMLDivElement = document.createElement('div');

                    item.innerHTML = '';
                    addClass(item, 'wj-thumbnail-item');
                    img.setAttribute('tabIndex', '-1');
                    img.className = 'wj-pagethumbnail';
                    img.src = data;
                    item.appendChild(img);
                    indexDiv.className = 'page-index';
                    indexDiv.innerHTML = (e.index + 1).toString();
                    item.appendChild(indexDiv);
                });

                list.selectedIndexChanged.addHandler(() => {
                    if (isItemsSourceSetting || list.selectedIndex < 0
                        // Does not move to selected page if it's already the current page.
                        // The current page may be set by history backward/forward.
                        || list.selectedIndex == this._pageNumber - 1) {
                        return;
                    }

                    this.moveToPage(list.selectedIndex + 1);
                });

                this.pageNumberChanged.addHandler(() => list.selectedIndex = this._pageNumber - 1);

                var createThumbnails: () => string[] = () => {
                    if (!this._documentSource || !this._documentSource.isLoadCompleted) {
                        return null;
                    }

                    var urls: string[] = [];
                    for (var i = 0; i < this._documentSource.pageCount; i++) {
                        urls.push(this._documentSource.getRenderToFilterUrl({ format: 'png', resolution: 50, outputRange: i + 1 }));
                    }

                    return urls;
                }, updateItems = () => {
                    if (sideTabs.isCollapsed || !t.isActived) {
                        return;
                    }

                    if (!pngUrls) {
                        pngUrls = createThumbnails();
                    }

                    if (t.isActived && list.itemsSource !== pngUrls) {
                        list.deferUpdate(() => {
                            isItemsSourceSetting = true;
                            list.itemsSource = pngUrls;
                            list.selectedIndex = this._pageNumber - 1;
                            isItemsSourceSetting = false;
                        });
                    }
                }, update = () => {
                    if (!this._documentSource
                        || !this._documentSource.paginated) {
                        sideTabs.hide(t);
                        list.itemsSource = null;
                        return;
                    }

                    sideTabs.show(t);
                    pngUrls = null;
                    updateItems();
                }, bindEvents = () => {
                    if (!this._documentSource) {
                        sideTabs.hide(t);
                        list.itemsSource = null;
                        return;
                    }

                    _addWjHandler(this._documentEventKey, this._documentSource.loadCompleted, update);
                    _addWjHandler(this._documentEventKey, this._documentSource.pageCountChanged, update);
                    _addWjHandler(this._documentEventKey, this._documentSource.pageSettingsChanged, update);
                    update();
                };

                this._documentSourceChanged.addHandler(bindEvents);
                bindEvents();

                sideTabs.expanded.addHandler(updateItems);
                sideTabs.tabPageActived.addHandler(updateItems);
                updateItems();
            });
        }

        private _scrollToCurrentPage(): void {
            var self = this, pageMargin: number, pageHeight;
            if (self.viewMode === ViewMode.Single) {
                return;
            }
            if (self._pageNumberChangedByScrolling) {
                self._pageNumberChangedByScrolling = false;
                return;
            }
            pageMargin = 30;
            if (self._documentSource.pageSettings) {
                pageHeight = self._documentSource.pageSettings.height.valueInPixel * self._zoomFactor;
            }
            self._isScrolling = false;
            self._viewpanelContainer.scrollTop = (self._pageNumber - 1) * (pageHeight + pageMargin);
            self._scrollToInitialPosition();
            // may show next page number after scrolling to initial position.
            self._updateScrollPageNumber(false);
        }

        private _scrollToInitialPosition(): void {
            switch (this.viewMode) {
                case ViewMode.Continuous:
                    this._viewpanelContainer.scrollTop += this._initialTop;
                    this._viewpanelContainer.scrollLeft = this._initialLeft;
                    this._initialTop = 0;
                    this._initialLeft = 0;
                    break;
                case ViewMode.Single:
                    this._viewpanelContainer.scrollTop = this._initialTop;
                    this._viewpanelContainer.scrollLeft = this._initialLeft;
                    this._initialTop = 0;
                    this._initialLeft = 0;
                    break;
            }
        }

        _executeAction(action: _ViewerAction) {
            switch (action) {
                case _ViewerAction.Paginated:
                    this._innerPaginated = !this._innerPaginated;
                    this._onViewerActionStatusChanged({
                        action: _ViewerAction.Paginated,
                        disabled: true,
                        checked: this._actionIsChecked(_ViewerAction.Paginated),
                        shown: this._actionIsShown(_ViewerAction.Paginated)
                    });
                    break;
                case _ViewerAction.Print:
                    if (this._documentSource) {
                        this._documentSource.print();
                    }
                    break;
                case _ViewerAction.Exports:
                    this._exportMenu.selectedIndex = -1;
                    wijmo.showPopup(this._exportMenu.dropDown, this._exportMenu.owner);
                    this._exportMenu.dropDown.style.color = this.hostElement.style.color;
                    this._exportMenu.dropDown.focus();
                    break;
                case _ViewerAction.Portrat:
                    this._setPageLandscape(false);
                    break;
                case _ViewerAction.Landscape:
                    this._setPageLandscape(true);
                    break;
                case _ViewerAction.PageSetup:
                    this.showPageSetupDialog();
                    break;
                case _ViewerAction.FirstPage:
                    this.moveToPage(1);
                    break;
                case _ViewerAction.LastPage:
                    this._moveToLastPage();
                    break;
                case _ViewerAction.PrePage:
                    this.moveToPage(this._pageNumber - 1);
                    break;
                case _ViewerAction.NextPage:
                    this.moveToPage(this._pageNumber + 1);
                    break;
                case _ViewerAction.Backward:
                    this._moveBackwardHistory();
                    break;
                case _ViewerAction.Forward:
                    this._moveForwardHistory();
                    break;
                case _ViewerAction.SelectTool:
                    this.selectMouseMode = true;
                    break;
                case _ViewerAction.MoveTool:
                    this.selectMouseMode = false;
                    break;
                case _ViewerAction.Continuous:
                    this.viewMode = ViewMode.Continuous;
                    break;
                case _ViewerAction.Single:
                    this.viewMode = ViewMode.Single;
                    break;
                case _ViewerAction.FitPageWidth:
                    this.zoomToViewWidth();
                    break;
                case _ViewerAction.FitWholePage:
                    this.zoomToView();
                    break;
                case _ViewerAction.ZoomOut:
                    this._zoomBtnClicked(false, ViewerBase._defaultZoomValues);
                    break;
                case _ViewerAction.ZoomIn:
                    this._zoomBtnClicked(true, ViewerBase._defaultZoomValues);
                    break;
                case _ViewerAction.FullScreen:
                    this.fullScreen = true;
                    break;
                case _ViewerAction.ExitFullScreen:
                    this.fullScreen = false;
                    break;
            }
        }

        private _initToolbars() {
            new _ViewerToolbar(this._toolbar, this);
            new _ViewerMiniToolbar(this._miniToolbar, this);
            addClass(this._miniToolbar, "wj-mini-toolbar");
        }

        private _clearExportMenuItems() {
            if (this._exportMenu) {
                this._exportMenu.itemsSource = null;
            }
        }

        private _updateExportMenu() {
            if (!this._documentSource) {
                return;
            }

            this._documentSource.getSupportedExportDescriptions().then((items: _IExportDescription[]) => {
                items.forEach(item => {
                    item.name = ViewerBase._exportNames[item.format];
                });
                this._exportMenu.itemsSource = items;
                this._exportMenu.displayMemberPath = 'name';
                this._exportMenu.selectedValuePath = 'format';
                this._updateAction(_ViewerAction.Exports);
            });
        }

        private _actionIsChecked(action: _ViewerAction): boolean {
            switch (action) {
                case _ViewerAction.Paginated:
                    return this._innerPaginated === true;
                case _ViewerAction.Landscape:
                    if (this._documentSource && this._documentSource.pageSettings) {
                        return this._documentSource.pageSettings.landscape;
                    }
                    return false;
                case _ViewerAction.Portrat:
                    if (this._documentSource && this._documentSource.pageSettings) {
                        return !this._documentSource.pageSettings.landscape;
                    }
                    return false;
                case _ViewerAction.SelectTool:
                    return this.selectMouseMode;
                case _ViewerAction.MoveTool:
                    return !this.selectMouseMode;
                case _ViewerAction.Continuous:
                    return this.viewMode == ViewMode.Continuous;
                case _ViewerAction.Single:
                    return this.viewMode == ViewMode.Single;
                case _ViewerAction.FullScreen:
                    return this.fullScreen;
            }
            return false;
        }

        private _actionIsDisabled(action: _ViewerAction): boolean {
            switch (action) {
                case _ViewerAction.Paginated:
                    return this._innerPaginated == null;
                case _ViewerAction.Exports:
                    return !this._exportMenu || !this._exportMenu.itemsSource;
                case _ViewerAction.Landscape:
                case _ViewerAction.Portrat:
                case _ViewerAction.PageSetup:
                    if (this._documentSource && this._documentSource.pageSettings) {
                        return !this._documentSource.paginated;
                    }
                    return true;
                case _ViewerAction.FirstPage:
                case _ViewerAction.PrePage:
                    var disabled = !this._documentSource || this._documentSource.pageCount == null;
                    return disabled || this._pageNumber <= 1;
                case _ViewerAction.LastPage:
                case _ViewerAction.NextPage:
                    var disabled = !this._documentSource || this._documentSource.pageCount == null;
                    return disabled || this._pageNumber >= this._documentSource.pageCount;
                case _ViewerAction.Backward:
                    return !this._historyManager.canBackward();
                case _ViewerAction.Forward:
                    return !this._historyManager.canForward();
                case _ViewerAction.Continuous:
                case _ViewerAction.Single:
                    return !this._documentSource || !this._documentSource.paginated;
                case _ViewerAction.ZoomOut:
                    return this.zoomFactor <= ViewerBase._defaultZoomValues[0].value;
                case _ViewerAction.ZoomIn:
                    var zoomValues = ViewerBase._defaultZoomValues;
                    return this.zoomFactor >= zoomValues[zoomValues.length - 1].value;
            }
            return false;
        }

        private _actionIsShown(action: _ViewerAction): boolean {
            var features: _IDocumentFeatures = this._documentSource ? (this._documentSource.features) : null;
            switch (action) {
                case _ViewerAction.Paginated:
                    return features && features.paginated && features.nonPaginated;
                case _ViewerAction.Landscape:
                case _ViewerAction.Portrat:
                case _ViewerAction.PageSetup:
                    return features && features.pageSettings;
            }
            return true;
        }

        _viewerActionStatusChanged = new Event();

        _onViewerActionStatusChanged(e: _ViewerActionStatusChangedEventArgs) {
            this._viewerActionStatusChanged.raise(this, e);
        }

        private _updateAction(action: _ViewerAction) {
            var e = {
                action: action,
                disabled: this._actionIsDisabled(action),
                checked: this._actionIsChecked(action),
                shown: this._actionIsShown(action)
            };
            this._onViewerActionStatusChanged(e);
        }

        private _updateToolbarActions() {
            this._updateAction(_ViewerAction.Paginated);
            this._updateAction(_ViewerAction.Landscape);
            this._updateAction(_ViewerAction.Portrat);
            this._updateAction(_ViewerAction.PageSetup);
            this._updateAction(_ViewerAction.Continuous);
            this._updateAction(_ViewerAction.Single);
            this._updateAction(_ViewerAction.Exports);
        }

        private _updateViewModeActions() {
            this._updateAction(_ViewerAction.Continuous);
            this._updateAction(_ViewerAction.Single);
        }

        private _onPageSettingsUpdated() {
            this._updateAction(_ViewerAction.Paginated);
            this._updateAction(_ViewerAction.Landscape);
            this._updateAction(_ViewerAction.Portrat);
            this._updateAction(_ViewerAction.PageSetup);

            this._updateViewModeActions();

            this._resetToolbarWidth();
        }

        private _onPageCountUpdated() {
            this._updatePageNavActions();
            this._resetToolbarWidth();
        }

        private _updatePageNavActions() {
            this._updateAction(_ViewerAction.FirstPage);
            this._updateAction(_ViewerAction.LastPage);
            this._updateAction(_ViewerAction.PrePage);
            this._updateAction(_ViewerAction.NextPage);
        }

        private _onHistoryManagerStatusUpdated() {
            this._updateAction(_ViewerAction.Backward);
            this._updateAction(_ViewerAction.Forward);
        }

        private _updateViewContainerCursor() {
            var showMoveTool = !this.selectMouseMode;
            if (showMoveTool) {
                if (!hasClass(this._viewpanelContainer, 'move')) {
                    addClass(this._viewpanelContainer, 'move');
                }
            }
            else if (hasClass(this._viewpanelContainer, 'move')) {
                removeClass(this._viewpanelContainer, 'move');
            }
        }

        private _updateFullScreenStyle() {
            var fullScreenClass = 'full-screen';
            if (this.fullScreen) {
                if (!hasClass(this.hostElement, fullScreenClass)) {
                    addClass(this.hostElement, fullScreenClass);
                }
                var body = document.body;
                if (!hasClass(body, fullScreenClass)) {
                    addClass(body, fullScreenClass);
                }
                if (!this._placeHolderElement) {
                    this._placeHolderElement = document.createElement('div');
                    this._placeHolderElement.className = 'hidden';
                }
                this.hostElement.parentElement.insertBefore(this._placeHolderElement, this.hostElement);
                this.hostElement.parentElement.removeChild(this.hostElement);
                body.appendChild(this.hostElement);

                this._hostOriginWidth = this.hostElement.style.width;
                this._hostOriginHeight = this.hostElement.style.height;
                this.hostElement.style.width = '100%';
                this.hostElement.style.height = '100%';
                window.scrollTo(0, 0);
            } else if (this._placeHolderElement && this._placeHolderElement.parentElement) {
                if (hasClass(this.hostElement, fullScreenClass)) {
                    removeClass(this.hostElement, fullScreenClass);
                }
                var body = document.body;
                if (hasClass(body, fullScreenClass)) {
                    removeClass(body, fullScreenClass);
                }
                body.removeChild(this.hostElement);
                var parent = this._placeHolderElement.parentElement;
                parent.insertBefore(this.hostElement, this._placeHolderElement);
                parent.removeChild(this._placeHolderElement);

                this.hostElement.style.width = this._hostOriginWidth;
                this.hostElement.style.height = this._hostOriginHeight;
            }
            this.refresh();
        }

        _initExportMenu(owner: HTMLElement) {
            var exportDiv = document.createElement('div');
            exportDiv.style.display = 'none';
            this._exportMenu = new wijmo.input.Menu(exportDiv);
            this._exportMenu.showDropDownButton = false;
            this._exportMenu.itemClicked.addHandler(this._onExportClicked, this);
            this._exportMenu.owner = owner;
        }

        private _onExportClicked(menu: input.Menu): void {
            var self = this, item: _IExportDescription = menu.selectedItem, iframe: HTMLIFrameElement;
            if (self._documentSource && self._documentSource.pageCount >= 0) {
                var url = self._documentSource.getRenderToFilterUrl({ format: item.format }),
                    iframe = <HTMLIFrameElement>document.querySelector('#viewDownloader');
                if (!iframe) {
                    iframe = document.createElement('iframe');
                    iframe.id = 'viewDownloader';
                    iframe.style.display = 'none';
                    document.body.appendChild(iframe);
                }
                iframe.src = url;
            }
        }

        /**
         * Shows the page setup dialog.
         */
        showPageSetupDialog() {
            if (!this._pageSetupDialog) {
                this._createPageSetupDialog();
            }

            this._pageSetupDialog.showWithValue(this._documentSource.pageSettings);
        }

        private _createPageSetupDialog() {
            var self = this, ele = document.createElement("div");
            ele.style.display = 'none';
            self.hostElement.appendChild(ele);
            self._pageSetupDialog = new _PageSetupDialog(ele);
            self._pageSetupDialog.applied.addHandler(() => self._setPageSettings(self._pageSetupDialog.pageSettings));
        }

        /**
         * Stretches page to show the whole page in viewer.
         */
        zoomToView() {
            var self = this, doc = self._documentSource,
                viewHeight: number, viewWidth: number, pageHeight: number, pageWidth: number;
            if (!doc || !doc.pageSettings) {
                return;
            }

            viewHeight = self._getViewPortHeight();
            viewWidth = self._getViewPortWidth();
            var pageSize = this._getPageSize();
            self.zoomFactor = Math.min(viewHeight / pageSize.height.valueInPixel, viewWidth / pageSize.width.valueInPixel);
        }

        /**
         * Stretches page to fit the width of viewer.
         */
        zoomToViewWidth() {
            var self = this, doc = self._documentSource,
                viewHeight: number, viewWidth: number, pageHeight: number, pageWidth: number;
            if (!doc || !doc.pageSettings) {
                return;
            }

            viewHeight = self._getViewPortHeight();
            viewWidth = self._getViewPortWidth();
            var pageSize = this._getPageSize();
            var pageHeight = pageSize.height.valueInPixel;
            var pageWidth = pageSize.width.valueInPixel;

            if (viewWidth / pageWidth > viewHeight / (pageHeight * (self.viewMode === ViewMode.Continuous ? self._documentSource.pageCount : 1))) {
                viewWidth -= self._getScrollbarWidth();
            }

            self.zoomFactor = viewWidth / pageWidth;
        }

        private _getScrollbarWidth() {
            var self = this, parent: HTMLDivElement, child: HTMLDivElement;

            if (!self._scrollbarWidth) {
                parent = document.createElement('div');
                parent.style.width = '50px';
                parent.style.height = '50px';
                parent.style.overflow = 'auto';
                document.body.appendChild(parent);
                child = document.createElement('div');
                child.style.height = '60px';
                parent.appendChild(child);
                self._scrollbarWidth = parent.offsetWidth - parent.clientWidth;
                document.body.removeChild(parent);
            }

            return self._scrollbarWidth;
        }

        private _getViewPortHeight(): number {
            var self = this, style = self._viewpanelWrapper['currentStyle'] || window.getComputedStyle(self._viewpanelWrapper);
            return self._viewpanelContainer.offsetHeight - parseFloat(style.marginBottom) - parseFloat(style.marginTop);;
        }

        private _getViewPortWidth(): number {
            var self = this, style = self._viewpanelWrapper['currentStyle'] || window.getComputedStyle(self._viewpanelWrapper);
            return self._viewpanelContainer.offsetWidth - parseFloat(style.marginLeft) - parseFloat(style.marginRight);
        }

        private _setPageLandscape(landscape: boolean) {
            var self = this, pageSettings = this._documentSource.pageSettings;
            _setLandscape(pageSettings, landscape);
            self._setPageSettings(pageSettings);
        }

        _setPaginated(paginated: boolean) {
            var features = this._documentSource.features,
                pageSettings = this._documentSource.pageSettings;

            if (!features || !pageSettings) return;

            if (paginated == pageSettings.paginated) return;

            if (paginated && features.paginated) {
                pageSettings.paginated = true;
                this._setPageSettings(pageSettings);
            } else if (!paginated && features.nonPaginated) {
                pageSettings.paginated = false;
                this._setPageSettings(pageSettings);
            }
        }

        private _setPageSettings(pageSettings: _IPageSettings): IPromise {
            this._showViewPanelMessage();
            return this._documentSource.setPageSettings(pageSettings).then((data: _IExecutionInfo) => {
                this._resetDocument();
                this._reRenderDocument();
            }).catch(reason => {
                this._showViewPanelErrorMessage(this._getErrorMessage(reason));
            });
        }

        _showViewPanelErrorMessage(message: string) {
            this._showViewPanelMessage(message, 'errormessage');
        }

        _showViewPanelMessage(message?: string, className?: string) {
            var div = <HTMLDivElement>this._viewpanelContainer.querySelector('.wj-viewer-loading');
            if (!div) {
                div = <HTMLDivElement>document.createElement('div');
                div.innerHTML = '<span class="verticalalign"></span><span class="textspan"></span>';
                this._viewpanelContainer.appendChild(div);
            }

            div.className = 'wj-viewer-loading';
            if (className) {
                wijmo.addClass(div, className);
            }

            var textspan = div.querySelector('.textspan');
            if (textspan) {
                textspan.innerHTML = message || wijmo.culture.Viewer.loading;
            }
        }

        _removeViewPanelMessage() {
            var div = this._viewpanelContainer.querySelector('.wj-viewer-loading');
            if (div) {
                this._viewpanelContainer.removeChild(div);
            }
        }

        _reRenderDocument() {
            if (this._documentSource) {
                this._showViewPanelMessage();
                this._documentSource.load();
            }
        }

        private _zoomBtnClicked(zoomIn: boolean, zoomValues: any[]): void {
            var self = this, i, zoomIndex: number, isFixedValue: boolean;
            for (i = 0; i < zoomValues.length; i++) {
                if (zoomValues[i].value > self._zoomFactor) {
                    zoomIndex = i - 0.5;
                    break;
                } else if (zoomValues[i].value === self._zoomFactor) {
                    zoomIndex = i;
                    break;
                }
            }

            if (zoomIndex == null) {
                zoomIndex = zoomValues.length - 0.5;
            }

            if (zoomIndex <= 0 && !zoomIn) {
                return;
            }

            if (zoomIndex >= zoomValues.length - 1 && zoomIn) {
                return;
            }

            if (zoomIn) {
                zoomIndex = Math.floor(zoomIndex) + 1;
            } else {
                zoomIndex = Math.ceil(zoomIndex) - 1;
            }

            self.zoomFactor = zoomValues[zoomIndex].value;
        }

        // Gets the document source of the viewer.
        _getDocumentSource(): _DocumentSource {
            return this._documentSource;
        }

        // Sets the document source of the viewer.
        _setDocumentSource(value: _DocumentSource) {
            this._loadDocument(value);
        }

        _loadDocument(value: _DocumentSource): IPromise {
            var promise = new _Promise();
            if (this._documentSource === value) {
                return promise;
            }

            this._disposeDocument();
            this._documentSource = value;
            if (value) {
                _addWjHandler(this._documentEventKey, value.loadCompleted, this._onDocumentSourceLoadCompleted, this);
                _addWjHandler(this._documentEventKey, value.queryLoadingData, (s, e: QueryLoadingDataEventArgs) => {
                    this.onQueryLoadingData(e);
                }, this);

                if (!value.isLoadCompleted) {
                    this._showViewPanelMessage();
                    value.load().then(v => {
                        this._keepServiceConnection();
                        promise.resolve(v);
                    }).catch(reason => {
                        this._showViewPanelErrorMessage(this._getErrorMessage(reason));
                    });
                } else {
                    this._onDocumentSourceLoadCompleted();
                    this._keepServiceConnection();
                    promise.resolve();
                }
            }

            this._onDocumentSourceChanged();
            return promise;
        }

        _getErrorMessage(reason):string {
            var errorText = reason || wijmo.culture.Viewer.errorOccured;
            if (reason.Message) {
                errorText = reason.Message;
                if (reason.ExceptionMessage) {
                    errorText += '<br/>' + reason.ExceptionMessage;
                }
            }

            return errorText;
        }

        private _onDocumentSourceLoadCompleted(): void {
            var errorList = this._documentSource.errors;
            if (this._documentSource.isLoadCompleted) {
                this._removeViewPanelMessage();
                this._pages.length = 0;
                if (this._documentSource.pageCount <= 0) {
                    return;
                }

                for (var i = 0; i < this._documentSource.pageCount; i++) {
                    this._pages.push(null);
                }
                
                if (!this._documentSource.paginated) {
                    this.viewMode = ViewMode.Single;
                }

                // the _initialPosition is set before executing custom action,
                // should reset it here, for it should only be used once.
                var position = this._initialPosition;
                this._initialPosition = null;

                if (!position || position.pageIndex == 0) {
                    // show the first page.
                    this._pageNumber = 1;
                    this._updateViewPage();
                    this._addHistory({ pageIndex: 0, pageBounds: null });
                } else {
                    // show the specific page.
                    this._scrollToPosition(position, true);
                }

                if (errorList && errorList.length > 0) {
                    var errors = "";
                    for (var i = 0; i < errorList.length; i++) {
                        errors += errorList[i] + "\r\n";
                    }
                    //alert(errors);
                }
            }
        }

        private _renderSinglePage(viewPage: HTMLDivElement, pageNumber: number): IPromise {
            var pageNum = pageNumber || this._pageNumber, loadingDiv: HTMLDivElement, pageIndex: number,
                promise = new _Promise(), documentSource = this._documentSource;
            pageNum = pageNum <= 0 ? 1 : pageNum;
            pageIndex = pageNum - 1;
            if (!documentSource || !viewPage) {
                promise.reject('Cannot render page without documentsource and view page.');
                return promise;
            }

            _removeChildren(viewPage);
            if (documentSource.pageSettings) {
                viewPage.style.height = documentSource.pageSettings.height.valueInPixel * this.zoomFactor + 'px';
                viewPage.style.width = documentSource.pageSettings.width.valueInPixel * this.zoomFactor + 'px';
                if (!this._autoHeightCalculated) {
                    this._autoCalculateViewerContainerHeight();
                    this._autoHeightCalculated = true;
                }
            }

            if (this._pages[pageIndex]) {
                viewPage.appendChild(this._pages[pageIndex].content);
                this._changePageZoom(viewPage);
                if (this.viewMode === ViewMode.Single) {
                    this._scrollToInitialPosition();
                }
                promise.resolve(pageIndex + 1);
                return promise;
            }

            loadingDiv = document.createElement('div');
            loadingDiv.className = 'wj-loading';
            loadingDiv.style.height = viewPage.style.height;
            loadingDiv.style.lineHeight = viewPage.style.height;
            loadingDiv.innerHTML = wijmo.culture.Viewer.loading;
            viewPage.appendChild(loadingDiv);

            documentSource.renderToFilter({
                format: 'html',
                paged: this._innerPaginated,
                outputRange: pageNum.toString()
            }).then(data => {
                if (this._documentSource !== documentSource) {
                    return;
                }

                var tempDiv = document.createElement('div'), svg: SVGElement, g: Element;
                tempDiv.innerHTML = data.responseText;
                var section = <HTMLElement>tempDiv.querySelector('section');
                var pageSize: _ISize;
                if (section && section.style) {
                    pageSize = { width: new _Unit(section.style.width), height: new _Unit(section.style.height) };
                }
                svg = <SVGElement>tempDiv.querySelector('svg');
                g = <Element>document.createElementNS('http://www.w3.org/2000/svg', 'g');
                while (svg.hasChildNodes()) {
                    g.appendChild(svg.firstChild);
                }
                svg.appendChild(g);
                this._pages[pageIndex] = { content: svg, size: pageSize };
                _removeChildren(viewPage);
                viewPage.appendChild(svg);
                this._changePageZoom(viewPage);
                this._replaceActionLinks(svg);
                if (this.viewMode === ViewMode.Single) {
                    this._scrollToInitialPosition();
                }
                promise.resolve(pageIndex + 1);
            }).catch(reason => {
                loadingDiv.innerHTML = this._getErrorMessage(reason);
            });

            return promise;
        }

        private _replaceActionLinks(svg: SVGElement) {
            var aList = svg.querySelectorAll('a'), self = this;
            for (var i = 0; i < aList.length; i++) {
                var a = <SVGAElement>aList.item(i);
                var url = a.href ? a.href.baseVal : '';
                if (url.indexOf('navigate') > 0) {
                    var result = ViewerBase._bookmarkReg.exec(url);
                    if (result) {
                        a.href.baseVal = '#';
                        a.setAttribute(ViewerBase._bookmarkAttr, result[1]);
                        _addEvent(a, 'click', function () {
                            self._goToBookmark(this.getAttribute(ViewerBase._bookmarkAttr));
                        });
                    }
                } else if (ViewerBase._customActionReg.test(url)) {
                    a.href.baseVal = '#';
                    a.setAttribute(ViewerBase._customActionAttr, url.substr(3));
                    _addEvent(a, 'click', function () {
                        self._executeCustomAction(this.getAttribute(ViewerBase._customActionAttr));
                    });
                }
            }
        }

        private _getPageSize(): _ISize {
            if (this.viewMode == ViewMode.Single) {
                var pageIndex = this._pageNumber - 1;
                var page = this._pages[pageIndex];
                if (page && page.size) {
                    return page.size;
                }
            }

            return {
                width: this._documentSource.pageSettings.width,
                height: this._documentSource.pageSettings.height
            };
        }

        private _changePageZoom(viewPage: HTMLDivElement): void {
            var self = this, zoomFactor = self.zoomFactor, g: SVGGElement, svg: SVGElement;
            if (!viewPage) {
                return;
            }

            var size = this._getPageSize();
            viewPage.style.height = size.height.valueInPixel * zoomFactor + 'px';
            viewPage.style.width = size.width.valueInPixel * zoomFactor + 'px';
            g = <SVGGElement>viewPage.querySelector('g');
            if (g) {
                (<SVGElement>g.parentNode).setAttribute('height', size.height.valueInPixel * zoomFactor + 'px');
                (<SVGElement>g.parentNode).setAttribute('width', size.width.valueInPixel * zoomFactor + 'px');
                g.setAttribute('transform', 'scale(' + zoomFactor + ')');
                // In IE, if we set the transform attribute of G element, the element in the G element maybe displayed incorrectly(144673), 
                // to fix it, we have to redraw the svg element: remove the G element and append it to svg again.
                if (ViewerBase._isIE) {
                    svg = <SVGElement>g.parentNode;
                    svg.removeChild(g);
                    svg.appendChild(g);
                }
            }
        }

        private _renderContinuousPage(): IPromise {
            var self = this, pageNumber = self._pageNumber, pageCount = self._documentSource.pageCount,
                start = pageNumber - self._preFetchPageCount, end = pageNumber + self._preFetchPageCount,
                promises: IPromise[] = [];
            start = start < 1 ? 1 : start;
            end = end > pageCount ? pageCount : end;
            for (var i = start; i <= end; i++) {
                promises.push(self._renderSinglePage(<HTMLDivElement>self._viewpanelWrapper.getElementsByClassName('wj-view-page').item(i - 1), i));
            }

            return new _CompositedPromise(promises);
        }

        _clearKeepSerConnTimer() {
            if (this._keepSerConnTimer != null) {
                clearTimeout(this._keepSerConnTimer);
            }
        }

        _keepServiceConnection() {
            this._clearKeepSerConnTimer();
            var documentSource = this._documentSource;
            if (!documentSource) {
                return;
            }

            this._keepSerConnTimer = setTimeout(() => {
                if (this._documentSource !== documentSource) {
                    return;
                }

                this._documentSource.getDocumentStatus().then(v => this._keepServiceConnection());
            }, this._getExpiredTime());
        }

        _getExpiredTime(): number {
            if (this._expiredTime) {
                return this._expiredTime;
            }

            var documentSource = this._documentSource;
            if (!documentSource || !documentSource.expiredDateTime || !documentSource.executionDateTime) {
                return 6000;
            }

            this._expiredTime = documentSource.expiredDateTime.getTime() - documentSource.executionDateTime.getTime();
            this._expiredTime = Math.max(this._expiredTime - 120000, 0);

            return this._expiredTime;
        }

        _disposeDocument(): void {
            if (this._documentSource) {
                _removeAllWjHandlers(this._documentEventKey, this._documentSource.disposed);
                _removeAllWjHandlers(this._documentEventKey, this._documentSource.pageCountChanged);
                _removeAllWjHandlers(this._documentEventKey, this._documentSource.pageSettingsChanged);
                _removeAllWjHandlers(this._documentEventKey, this._documentSource.loadCompleted);
                _removeAllWjHandlers(this._documentEventKey, this._documentSource.queryLoadingData);
                this._documentSource.dispose();
            }

            this._resetDocument()
        }

        _resetDocument(): void {
            this._pages.length = 0;
            this._addSinglePage();
            this._pageNumber = 1;
            this._historyManager.clear();
        }

        _setDocumentRendering(): void {
            this._documentSource._updateIsLoadCompleted(false);
        }

        private _createViewPage(): HTMLDivElement {
            var viewPage = document.createElement('div');
            viewPage.className = 'wj-view-page';
            _addEvent(viewPage, 'mousedown', (e) => {
                if (this.selectMouseMode) {
                    return;
                }
                this._startPanning(e);
            });
            _addEvent(viewPage, 'dragstart', (e) => {
                if (this.selectMouseMode) {
                    return;
                }
                e.preventDefault();
            });

            return viewPage;
        }

        private _addContinuousPage(): void {
            var self = this;
            _removeChildren(self._viewpanelWrapper);

            for (var i = 0; i < self._documentSource.pageCount; i++) {
                var viewPage = this._createViewPage();
                viewPage.style.height = self._documentSource.pageSettings.height.valueInPixel * self.zoomFactor + 'px';
                viewPage.style.width = self._documentSource.pageSettings.width.valueInPixel * self.zoomFactor + 'px';
                self._viewpanelWrapper.appendChild(viewPage);
            }
        }

        private _addSinglePage(): HTMLDivElement {
            var self = this;
            _removeChildren(self._viewpanelWrapper);
            var viewPage = this._createViewPage();
            self._viewpanelWrapper.appendChild(viewPage);
            return viewPage;
        }

        /**
         * Moves to the page at the specified index.
         *
         * @param index Index (1-base) of the page to move to.
         * @return An @see:wijmo.viewer.IPromise object with current page number.
         */
        moveToPage(index: number): IPromise {
            return this._innerMoveToPage(index, true);
        }

        private _innerMoveToPage(pageNumber: number, addHistory?: boolean): IPromise {
            var oldNumber = this._pageNumber;
            return this._setPageNumber(pageNumber).then(n => {
                if (addHistory === true && n != oldNumber) {
                    this._addHistory({ pageIndex: n - 1, pageBounds: null });
                }
            });
        }

        private _moveToLastPage(): IPromise {
            var promise = new _Promise();
            if (!this._ensureDocumentLoadCompleted(promise)) {
                return promise;
            }

            return this._innerMoveToPage(this._documentSource.pageCount, true);
        }

        private _moveBackwardHistory() {
            if (!this._ensureDocumentLoadCompleted() || !this._historyManager.canBackward()) {
                return;
            }

            var history = this._historyManager.backward();
            this._moveToHistory(history);
        }

        private _moveForwardHistory() {
            if (!this._ensureDocumentLoadCompleted() || !this._historyManager.canForward()) {
                return;
            }

            var history = this._historyManager.forward();
            this._moveToHistory(history);
        }

        private _moveToHistory(history: _IHistory) {
            if (!history) {
                return;
            }

            this.zoomFactor = history.zoomFactor;
            this._scrollToPosition(history.position);
        }

        private _addHistory(position: _IDocumentPosition) {
            if (!position) {
                return;
            }

            this._historyManager.add({ zoomFactor: this._zoomFactor, position: position });
        }

        private _ensureDocumentLoadCompleted(promise?: _Promise): boolean {
            if (!this._documentSource) {
                if (promise) {
                promise.reject('Cannot set page number without document source.');
                }
                return false;
            }

            if (!this._documentSource.isLoadCompleted) {
                if (promise) {
                promise.reject('Cannot set page number when document source is not loaded completely.');
                }
                return false;
            }

            return true;
        }

        private _setPageNumber(value: number): IPromise {
            var promise = new _Promise();
            if (!this._ensureDocumentLoadCompleted(promise)) {
                return promise;
            }

            value = Math.min(this._documentSource.pageCount, Math.max(value, 1));
            if (this._pageNumber === value) {
                promise.resolve(value);
                return promise;
            }

            this._updatePageNumber(value);
            var currentPageNumber = this._pageNumber;
            var renderPromise: IPromise;
            switch (this.viewMode) {
                case ViewMode.Continuous:
                    this._scrollToCurrentPage();
                    renderPromise = this._renderContinuousPage();
                    break;
                case ViewMode.Single:
                    var viewPage = <HTMLDivElement>this._viewpanelWrapper.querySelector('.wj-view-page');
                    renderPromise = this._renderSinglePage(viewPage, value);
                    break;
            }

            return renderPromise.then(_ => {
                // The promise value is page number in single view mode, 
                // but may be array of page numbers in continuous view mode.
                return currentPageNumber;
            });
        }

        _updatePageNumber(value: number) {
            if (!this._documentSource) {
                return;
            }

            value = Math.min(this._documentSource.pageCount, Math.max(value, 1));
            if (this._pageNumber === value) {
                return;
            }

            this._pageNumber = value;
            this.onPageNumberChanged();
        }

        /**
         * Gets or sets the zoom factor.
         */
        get zoomFactor(): number {
            return this._zoomFactor;
        }
        set zoomFactor(value: number) {
            value = Math.max(0.05, Math.min(10, value));
            if (value === this._zoomFactor) {
                return;
            }

            this._zoomFactor = value;
            this._changeViewerZoom();
            this.onZoomFactorChanged();
        }

        private _changeViewerZoom() {
            var viewPages: NodeList, viewPage: HTMLDivElement;
            switch (this.viewMode) {
                case (ViewMode.Continuous):
                    viewPages = this._viewpanelWrapper.querySelectorAll('.wj-view-page');
                    for (var i = 0; i < viewPages.length; i++) {
                        this._changePageZoom(<HTMLDivElement>viewPages.item(i));
                    }
                    break;
                case (ViewMode.Single):
                    viewPage = <HTMLDivElement>this._viewpanelWrapper.querySelector('.wj-view-page');
                    this._changePageZoom(viewPage);
                    break;
            }
        }

        /** Gets or sets the view mode. */
        get viewMode(): ViewMode {
            return this._viewMode;
        }
        set viewMode(value: ViewMode) {
            if (this._viewMode === value) {
                return;
            }

            this._viewMode = value;
            this._updateViewPage();
            this.onViewModeChanged();
        }

        /** Gets or sets a value indicating whether clicking and dragging with the mouse selects text. */
        get selectMouseMode(): boolean {
            return this._selectMouseMode;
        }
        set selectMouseMode(value: boolean) {
            if (this._selectMouseMode === value) {
                return;
            }

            this._selectMouseMode = value;
            this.onSelectMouseModeChanged();
        }

        /** Gets or sets whether viewer is under full screen mode. */
        get fullScreen(): boolean {
            return this._fullScreen;
        }
        set fullScreen(value: boolean) {
            if (this._fullScreen === value) {
                return;
            }

            this._fullScreen = value;
            this.onFullScreenChanged();
        }

        private _updateViewPage() {
            if (this._documentSource && this._documentSource.isLoadCompleted) {
                switch (this.viewMode) {
                    case ViewMode.Continuous:
                        this._addContinuousPage();
                        this._renderContinuousPage();
                        this._scrollToCurrentPage();
                        break;
                    case ViewMode.Single:
                        var viewPage = this._addSinglePage();
                        this._renderSinglePage(viewPage, this._pageNumber);
                        break;
                }
            }
        }

        // Raises the @see:_documentSourceChanged event.
        // @param e The event arguments.
        _onDocumentSourceChanged(e?: EventArgs) {
            this._documentSourceChanged.raise(this, e || new EventArgs());

            this._clearExportMenuItems();
            this._updateToolbarActions();
            this._updateExportMenu();
            this._onPageSettingsUpdated();
            this._onPageCountUpdated();
            this._updateViewModeActions();

            if (this._documentSource) {
                _addWjHandler(this._documentEventKey, this._documentSource.pageSettingsChanged, this._onPageSettingsUpdated, this);
                _addWjHandler(this._documentEventKey, this._documentSource.pageCountChanged, this._onPageCountUpdated, this);
                _addWjHandler(this._documentEventKey, this._documentSource.loadCompleted, this._onPageCountUpdated, this);
            }
        }

        /**
         * Raises the @see:pageNumberChanged event.
         * 
         * @param e The event arguments.
         */
        onPageNumberChanged(e?: EventArgs) {
            this.pageNumberChanged.raise(this, e || new EventArgs());
            this._updatePageNavActions();
        }

        /**
         * Raises the @see:viewModeChanged event.
         * 
         * @param e The event arguments.
         */
        onViewModeChanged(e?: EventArgs) {
            this.viewModeChanged.raise(this, e || new EventArgs());
            this._updateViewModeActions();
        }

        /**
         * Raises the @see:selectMouseModeChanged event.
         * 
         * @param e The event arguments.
         */
        onSelectMouseModeChanged(e?: EventArgs) {
            this.selectMouseModeChanged.raise(this, e || new EventArgs());

            this._updateAction(_ViewerAction.SelectTool);
            this._updateAction(_ViewerAction.MoveTool);

            this._updateViewContainerCursor();
        }

        /**
         * Raises the @see:fullScreenChanged event.
         * 
         * @param e The event arguments.
         */
        onFullScreenChanged(e?: EventArgs) {
            this.fullScreenChanged.raise(this, e || new EventArgs());
            this._updateAction(_ViewerAction.FullScreen);
            this._updateFullScreenStyle();
        }

        /**
         * Raises the @see:zoomFactorChanged event.
         * 
         * @param e The event arguments.
         */
        onZoomFactorChanged(e?: EventArgs) {
            this.zoomFactorChanged.raise(this, e || new EventArgs());

            this._updateAction(_ViewerAction.ZoomOut);
            this._updateAction(_ViewerAction.ZoomIn);
        }

        /**
         * Raises the @see:queryLoadingData event.
         * 
         * @param e @see:QueryLoadingDataEventArgs that contains the event data.
         */
        onQueryLoadingData(e: QueryLoadingDataEventArgs) {
            this.queryLoadingData.raise(this, e);
        }
    }

    export class _SideTabs extends Control {

        private _headersContainer: HTMLElement;
        private _contentsContainer: HTMLElement;
        private _idCounter = 0;
        private _tabPages: _TabPage[] = [];
        private _tabPageDic = {};

        tabPageActived = new Event();
        tabPageVisibilityChanged = new Event();
        expanded = new Event();
        collapsed = new Event();

        static _hiddenCss = 'hidden';
        static _activedCss = 'active';
        static _collapsedCss = 'collapsed';

        static controlTemplate = '<ul class="wj-nav wj-btn-group" wj-part="wj-headers"></ul>' +
        '<div class="wj-tabcontent" wj-part="wj-contents"></div>';

        constructor(element: any) {
            super(element);
            var tpl = this.getTemplate();
            this.applyTemplate('wj-control', tpl, {
                _headersContainer: 'wj-headers',
                _contentsContainer: 'wj-contents'
            });
        }

        applyTemplate(css: string, tpl: string, parts: Object): HTMLElement {
            var host = this.hostElement;
            addClass(host, css);
            host.appendChild(_toDOMs(tpl));

            // bind control variables to template parts
            if (parts) {
                for (var part in parts) {
                    var wjPart = parts[part];
                    this[part] = host.querySelector('[wj-part="' + wjPart + '"]');
                    // look in the root as well (querySelector doesn't...)
                    if (this[part] == null && host.getAttribute('wj-part') == wjPart) {
                        this[part] = tpl;
                    }
                    // make sure we found the part
                    if (this[part] == null) {
                        throw 'Missing template part: "' + wjPart + '"';
                    }
                }
            }

            return host;
        }

        get tabPages(): _TabPage[] {
            return this._tabPages;
        }

        getTabPage(id: string): _TabPage {
            return this._tabPageDic[id];
        }

        getFirstShownTabPage(except?: _TabPage): _TabPage {
            var first: _TabPage;
            this._tabPages.some(i => {
                if (!i.isHidden && i !== except) {
                    first = i;
                    return true;
                }

                return false;
            });

            return first;
        }

        get visibleTabPagesCount(): number {
            var count = 0;
            this._tabPages.forEach((tabPage: _TabPage) => {
                if (!tabPage.isHidden) {
                    count++;
                }
            });
            return count;
        }

        get activedTabPage(): _TabPage {
            var first: _TabPage;
            this._tabPages.some(i => {
                if (i.isActived) {
                    first = i;
                    return true;
                }

                return false;
            });

            return first;
        }

        removePage(page: string | _TabPage) {
            var tabPage: _TabPage;
            tabPage = typeof page === 'string' ? this.getTabPage(page) : page;

            if (!tabPage) {
                return;
            }

            var id = tabPage.id;
            var index = this._tabPages.indexOf(tabPage);
            if (index < 0) {
                return;
            }

            this._tabPages.splice(index, 1);
            this._tabPageDic[id] = void (0);

            if (!this.isCollapsed && tabPage.isActived) {
                var first = this.getFirstShownTabPage();
                if (first) {
                    this.active(first);
                } else {
                    this.collapse();
                }
            }

            this._headersContainer.removeChild(tabPage.header);
            this._contentsContainer.removeChild(tabPage.outContent);
        }

        addPage(title: string, svgIcon: string, index?: number): _TabPage {
            var id = this._getNewTabPageId(),
                header = document.createElement('li'),
                outContentHtml = '<div class="wj-tabpane">' +
                    '<div class="wj-tabtitle-wrapper"><h3 class="wj-tabtitle">' + title + '<span class="wj-close">×</span></h3></div>' +
                    '<div class="wj-tabcontent-wrapper"><div class="wj-tabcontent-inner"></div></div>' +
                    '</div>',
                outContent = _toDOM(outContentHtml);

            var icon = _createSvgBtn(svgIcon);
            header.appendChild(icon);
            index = index == null ? this._tabPages.length : index;
            index = Math.min(Math.max(index, 0), this._tabPages.length);

            if (index >= this._tabPages.length) {
                this._headersContainer.appendChild(header);
                this._contentsContainer.appendChild(outContent);
            } else {
                this._headersContainer.insertBefore(header, this._tabPages[index].header);
                this._contentsContainer.insertBefore(outContent, this._tabPages[index].outContent);
            }

            _addEvent(outContent.querySelector('.wj-close'), 'click', () => {
                this.collapse();
            });

            _addEvent(header.querySelector('a'), 'click,keydown', e => {
                var currentTab = this.getTabPage(id);
                if (!currentTab) {
                    return;
                }

                var needExe = (e.type === 'keydown' && e.keyCode === Key.Enter) || e.type === 'click';
                if (!needExe) {
                    return;
                }

                this.active(currentTab);
            })

            var tabPage = new _TabPage(outContent, header, id);
            if (index >= this._tabPages.length) {
                this._tabPages.push(tabPage);
            } else {
                this._tabPages.splice(index, 0, tabPage);
            }

            this._tabPageDic[id] = tabPage;
            if (!this.isCollapsed) {
                var actived = this.activedTabPage;
                if (!actived) {
                    this.active(tabPage);
                }
            }

            return tabPage;
        }

        get isCollapsed(): boolean {
            return hasClass(this.hostElement, _SideTabs._collapsedCss);
        }

        hide(page: string | _TabPage): void {
            var tabPage = typeof page === 'string' ? this.getTabPage(page) : page;
            if (!tabPage) {
                return;
            }

            if (hasClass(tabPage.header, _SideTabs._hiddenCss)) {
                return;
            }

            addClass(tabPage.header, _SideTabs._hiddenCss);
            this.onTabPageVisibilityChanged(tabPage);
            this.deactive(tabPage);
        }

        show(page: string | _TabPage): void {
            var tabPage = typeof page === 'string' ? this.getTabPage(page) : page;
            if (!tabPage) {
                return;
            }

            if (!hasClass(tabPage.header, _SideTabs._hiddenCss)) {
                return;
            }

            removeClass(tabPage.header, _SideTabs._hiddenCss);
            this.onTabPageVisibilityChanged(tabPage);

            if (!this.isCollapsed) {
                var actived = this.activedTabPage;
                if (!actived) {
                    this.active(tabPage);
                }
            }
        }

        deactive(page: string | _TabPage): void {
            var tabPage = typeof page === 'string' ? this.getTabPage(page) : page;
            if (!tabPage || !tabPage.isActived) {
                return;
            }

            removeClass(<HTMLElement>tabPage.outContent, _SideTabs._activedCss);
            _checkImageButton(<HTMLElement>tabPage.header.querySelector('a'), false);
            var shown = this.getFirstShownTabPage(tabPage);
            if (shown) {
                this.active(shown);
            } else {
                this.collapse();
            }
        }

        active(page: string | _TabPage): void {
            var tabPage = typeof page === 'string' ? this.getTabPage(page) : page;
            if (!tabPage) {
                return;
            }

            this.expand();
            if (tabPage.isActived)
            {
                return;
            }

            this._tabPages.forEach(i=> {
                removeClass(<HTMLElement>i.outContent, _SideTabs._activedCss);
                _checkImageButton(<HTMLElement>i.header.querySelector('a'), false);
            });

            this.show(tabPage);
            addClass(<HTMLElement>tabPage.outContent, _SideTabs._activedCss);
            _checkImageButton(<HTMLElement>tabPage.header.querySelector('a'), true);
            this.onTabPageActived();
        }

        onTabPageActived() {
            this.tabPageActived.raise(this, new EventArgs());
        }

        onTabPageVisibilityChanged(tabPage: _TabPage) {
            this.tabPageVisibilityChanged.raise(this, { tabPage: tabPage });
        }

        onExpanded() {
            this.expanded.raise(this, new EventArgs());
        }

        onCollapsed() {
            this.collapsed.raise(this, new EventArgs());
        }

        collapse(): void {
            if (this.isCollapsed) {
                return;
            }

            addClass(this.hostElement, _SideTabs._collapsedCss);
            this.onCollapsed();
        }

        expand(): void {
            if (!this.isCollapsed) {
                return;
            }

            removeClass(this.hostElement, _SideTabs._collapsedCss);
            if (!this.activedTabPage) {
                var shown = this.getFirstShownTabPage();
                if (shown) {
                    this.active(shown);
                }
            }

            this.onExpanded();
        }

        _getNewTabPageId(): string {
            while (this._tabPageDic[(this._idCounter++).toString()]) {
            }

            return this._idCounter.toString();
        }
    }

    export interface _TabPageVisibilityChangedEventArgs {
        tabPage: _TabPage;
    }

    export class _TabPage {

        private _header: HTMLElement;
        private _outContent: HTMLElement;
        private _content: HTMLElement;
        private _id: string;

        constructor(outContent: HTMLElement, header: HTMLElement, id:string) {
            this._header = header;
            this._outContent = outContent;
            this._content = <HTMLElement>outContent.querySelector('.wj-tabcontent-inner');
            this._id = id;
        }

        get isActived(): boolean {
            return hasClass(this.outContent, _SideTabs._activedCss);
        }

        get isHidden(): boolean {
            return hasClass(this.header, _SideTabs._hiddenCss);
        }

        get id(): string {
            return this._id;
        }

        get header(): HTMLElement {
            return this._header;
        }

        get content(): HTMLElement {
            return this._content;
        }

        get outContent(): HTMLElement {
            return this._outContent;
        }

        format(customizer: (_TabPage: this) => void) {
            customizer(this);
        }
    }

    export class _Toolbar extends Control {

        private _toolbarWrapper: HTMLElement;
        private _toolbarContainer: HTMLElement;
        private _toolbarLeft: HTMLElement;
        private _toolbarRight: HTMLElement;
        private _toolbarMoveTimer: number;

        private static _moveStep = 2;

        static commandTagAttr = 'command-Tag';
        static controlTemplate =
            '<div class="wj-toolbar-move left" wj-part="toolbar-left"><span class="wj-glyph-left"></span></div>' +
            '<div class="wj-toolbarcontainer" wj-part="toolbar-container">' +
                '<div class="wj-toolbarwrapper wj-btn-group" wj-part="toolbar-wrapper">' +
                '</div>' +
            '</div>' +
            '<div class="wj-toolbar-move right" wj-part="toolbar-right"><span class="wj-glyph-right"></span></div>';

        constructor(element: any) {
            super(element);

            var tpl: string;
            // instantiate and apply template
            tpl = this.getTemplate();
            this.applyTemplate('wj-toolbar', tpl, {
                _toolbarWrapper: 'toolbar-wrapper',
                _toolbarContainer: 'toolbar-container',
                _toolbarLeft: 'toolbar-left',
                _toolbarRight: 'toolbar-right'
            });

            _addEvent(this._toolbarLeft, 'mouseover', () => { this._moveRight(); });
            _addEvent(this._toolbarLeft, 'mouseout', () => { this._clearToolbarMoveTimer(); });

            _addEvent(this._toolbarRight, 'mouseover', () => { this._moveLeft(); });
            _addEvent(this._toolbarRight, 'mouseout', () => { this._clearToolbarMoveTimer(); });
        }

        applyTemplate(css: string, tpl: string, parts: Object): HTMLElement {
            var host = this.hostElement;
            addClass(host, css);
            host.appendChild(_toDOMs(tpl));

            // bind control variables to template parts
            if (parts) {
                for (var part in parts) {
                    var wjPart = parts[part];
                    this[part] = host.querySelector('[wj-part="' + wjPart + '"]');
                    // look in the root as well (querySelector doesn't...)
                    if (this[part] == null && host.getAttribute('wj-part') == wjPart) {
                        this[part] = tpl;
                    }
                    // make sure we found the part
                    if (this[part] == null) {
                        throw 'Missing template part: "' + wjPart + '"';
                    }
                }
            }

            return host;
        }

        private _clearToolbarMoveTimer() {
            if (this._toolbarMoveTimer != null) {
                clearTimeout(this._toolbarMoveTimer);
                this._toolbarMoveTimer = null;
            }
        }

        private _moveLeft() {
            var rightBtnWidth = this._toolbarRight.getBoundingClientRect().width;
            var minLeft = this._toolbarContainer.getBoundingClientRect().width - this._toolbarWrapper.getBoundingClientRect().width;
            var newLeft = this._toolbarWrapper.offsetLeft - rightBtnWidth - _Toolbar._moveStep;
            if (newLeft < minLeft)
                return;

            this._toolbarWrapper.style.left = newLeft + 'px';
            this._toolbarMoveTimer = setTimeout(() => this._moveLeft(), 5);
        }

        private _moveRight() {
            var leftBtnWidth = this._toolbarLeft.getBoundingClientRect().width;
            var step = 2;
            var newLeft = this._toolbarWrapper.offsetLeft - leftBtnWidth + _Toolbar._moveStep;
            if (newLeft > 0)
                return;

            this._toolbarWrapper.style.left = newLeft + 'px';
            this._toolbarMoveTimer = setTimeout(() => this._moveRight(), 5);
        }

        private _showToolbarMoveButton(show: boolean) {
            var visibility = show ? 'visible' : 'hidden';
            this._toolbarLeft.style.visibility = visibility;
            this._toolbarRight.style.visibility = visibility;
        }

        resetWidth() {
            var toolbarLeftWidth = this._toolbarLeft.getBoundingClientRect().width;
            var toolbarRightWidth = this._toolbarRight.getBoundingClientRect().width;
            var toolbarWidth = this.hostElement.getBoundingClientRect().width;
            //Set a wider size for auto calculate.
            //The size should wider enough for put in all toolbar child node in one line.
            this._toolbarContainer.style.width = '1500px';
            this._toolbarWrapper.style.width = 'auto';
            //IE need 2 more pixel.
            var toolbarWrapperWidth = this._toolbarWrapper.getBoundingClientRect().width + 2;
            this._toolbarWrapper.style.width = toolbarWrapperWidth + 'px';
            this._toolbarContainer.style.width = toolbarWidth - toolbarLeftWidth - toolbarRightWidth + 'px';

            var showMoveButton = toolbarLeftWidth + toolbarRightWidth + toolbarWrapperWidth > toolbarWidth;
            this._showToolbarMoveButton(showMoveButton);
            if (!showMoveButton) {
                //reset toolbar position to show all toolbar item.
                this._toolbarWrapper.style.left = '0px';
            }
        }

        addSeparator(): HTMLElement {
            var element = document.createElement('span');
            element.className = 'wj-separator';
            this._toolbarWrapper.appendChild(element);
            return element;
        }

        svgButtonClicked = new Event();

        onSvgButtonClicked(e: _ToolbarSvgButtonClickedEventArgs) {
            this.svgButtonClicked.raise(this, e);
        }

        addCustomItem(element: any, commandTag?: any) {
            if (isString(element)) {
                element = _toDOM(element);
            }

            if (commandTag) {
                element.setAttribute(_Toolbar.commandTagAttr, commandTag.toString());
            }

            this._toolbarWrapper.appendChild(element);
        }

        addSvgButton(title: string, svgContent: string, commandTag: any, isToggle?: boolean): HTMLElement {
            var button = _createSvgBtn(svgContent);
            button.title = title;
            button.setAttribute(_Toolbar.commandTagAttr, commandTag.toString());
            this._toolbarWrapper.appendChild(button);
            _addEvent(button, 'click,keydown', (event) => {
                var e = event || window.event,
                    needExe = (e.type === 'keydown' && e.keyCode === Key.Enter) || e.type === 'click';
                if (!needExe || _isDisabledImageButton(button) || (!isToggle && _isCheckedImageButton(button))) {
                    return;
                }

                this.onSvgButtonClicked({ commandTag: commandTag });
            });

            return button;
        }

        static _initToolbarPageNumberInput(hostToolbar: HTMLElement, viewer: ViewerBase) {
            var toolbar = <_Toolbar>wijmo.Control.getControl(hostToolbar),
                pageNumberDiv = document.createElement('div'),
                pageCountSpan = document.createElement('span'),
                pageNumberInput: wijmo.input.InputNumber,
                updatePageNumber = () => {
                    var documentSource = viewer._getDocumentSource();
                    if (!documentSource || documentSource.pageCount == null) {
                        return;
                    }
                    pageNumberInput.value = viewer._pageNumber;
                },
                updatePageCount = () => {
                    var documentSource = viewer._getDocumentSource();
                    if (!documentSource || documentSource.pageCount == null) {
                        return;
                    }
                    pageCountSpan.innerHTML = documentSource.pageCount.toString();
                    pageNumberInput.max = documentSource.pageCount;
                    pageNumberInput.min = Math.min(documentSource.pageCount, 1);

                    updatePageNumber();
                },
                sourceChanged = () => {
                    var documentSource = viewer._getDocumentSource();
                    if (!documentSource) {
                        return;
                    }
                    updatePageCount();
                    _addWjHandler(viewer._documentEventKey, documentSource.pageCountChanged, updatePageCount);
                    _addWjHandler(viewer._documentEventKey, documentSource.loadCompleted, updatePageCount);
                };

            pageNumberDiv.className = 'wj-pagenumber';
            toolbar.addCustomItem(pageNumberDiv, _ViewerAction.PageNumber);
            pageNumberInput = new wijmo.input.InputNumber(pageNumberDiv);
            pageNumberInput.format = 'n';
            _addEvent(pageNumberDiv, 'keyup', (e) => {
                var event = e || window.event;
                if (event.keyCode === Key.Enter) {
                    viewer.moveToPage(pageNumberInput.value);
                }
            });

            toolbar.addCustomItem('<span class="slash">/</span>');
            pageCountSpan.className = 'wj-pagecount';
            toolbar.addCustomItem(pageCountSpan, _ViewerAction.PageCount);
            viewer.pageNumberChanged.addHandler(() => {
                updatePageNumber();
            });
            if (viewer._getDocumentSource()) {
                sourceChanged();
            }
            viewer._documentSourceChanged.addHandler(() => { sourceChanged() });
        }

        static _checkSeparatorShown(toolbar: _Toolbar) {
            var toolbarWrapper = toolbar._toolbarWrapper,
                groupEnd: boolean,
                hideSeparator = true,
                currentEle: HTMLElement,
                currentEleHidden: boolean,
                lastShowSeparator: HTMLElement;

            for (var i = 0; i < toolbarWrapper.children.length; i++) {
                currentEle = <HTMLElement>toolbarWrapper.children[i];
                groupEnd = hasClass(currentEle, 'wj-separator');
                currentEleHidden = hasClass(currentEle, _hiddenCss);

                if (!groupEnd && !currentEleHidden) {
                    hideSeparator = false;
                    continue;
                }

                if (groupEnd) {
                    if (hideSeparator) {
                        if (!currentEleHidden) {
                            addClass(currentEle, _hiddenCss);
                        }
                    } else {
                        if (currentEleHidden) {
                            removeClass(currentEle, _hiddenCss);
                        }
                        lastShowSeparator = currentEle;
                    }
                    //reset
                    hideSeparator = true;
                }
            }

            //hide separator if all items after this separator are hidden.
            if (hideSeparator && lastShowSeparator) {
                addClass(lastShowSeparator, 'hidden');
            }
        }
    }

    export interface _ToolbarSvgButtonClickedEventArgs {
        commandTag: string;
    }

    export class _ViewerToolbar extends _Toolbar {
        private _viewer: ViewerBase;

        constructor(element: any, viewer: ViewerBase) {
            super(element);

            this._viewer = viewer;
            this._initToolbarItems();

            this.svgButtonClicked.addHandler((sender, e: _ToolbarSvgButtonClickedEventArgs) => {
                this._viewer._executeAction(parseInt(e.commandTag));
            });

            var update = () => this.isDisabled = !this._viewer._getDocumentSource();
            this._viewer._documentSourceChanged.addHandler(update);
            update();

            this._viewer._viewerActionStatusChanged.addHandler((sender, e: _ViewerActionStatusChangedEventArgs) => {
                var actionElement = <HTMLElement>this.hostElement.querySelector('[command-tag="' + e.action.toString() + '"]');
                _checkImageButton(actionElement, e.checked);
                _disableImageButton(actionElement, e.disabled);
                _showImageButton(actionElement, e.shown);

                _Toolbar._checkSeparatorShown(this);
            });
        }

        _initToolbarItems() {
            this.addSvgButton(wijmo.culture.Viewer.paginated, icons.paginated, _ViewerAction.Paginated, true);
            this.addSvgButton(wijmo.culture.Viewer.print, icons.print, _ViewerAction.Print);
            var exportBtn = this.addSvgButton(wijmo.culture.Viewer.exports, icons.exports, _ViewerAction.Exports);
            this._viewer._initExportMenu(exportBtn);
            this.addSeparator();
            this.addSvgButton(wijmo.culture.Viewer.portrait, icons.portrait, _ViewerAction.Portrat);
            this.addSvgButton(wijmo.culture.Viewer.landscape, icons.landscape, _ViewerAction.Landscape);
            this.addSvgButton(wijmo.culture.Viewer.pageSetup, icons.pageSetup, _ViewerAction.PageSetup);
            this.addSeparator();
            this.addSvgButton(wijmo.culture.Viewer.firstPage, icons.firstPage, _ViewerAction.FirstPage);
            this.addSvgButton(wijmo.culture.Viewer.previousPage, icons.previousPage, _ViewerAction.PrePage);
            this.addSvgButton(wijmo.culture.Viewer.nextPage, icons.nextPage, _ViewerAction.NextPage);
            this.addSvgButton(wijmo.culture.Viewer.lastPage, icons.lastPage, _ViewerAction.LastPage);
            _Toolbar._initToolbarPageNumberInput(this.hostElement, this._viewer);
            this.addSeparator();
            this.addSvgButton(wijmo.culture.Viewer.backwardHistory, icons.backwardHistory, _ViewerAction.Backward);
            this.addSvgButton(wijmo.culture.Viewer.forwardHistory, icons.forwardHistory, _ViewerAction.Forward);
            this.addSeparator();
            this.addSvgButton(wijmo.culture.Viewer.selectTool, icons.selectTool, _ViewerAction.SelectTool);
            this.addSvgButton(wijmo.culture.Viewer.moveTool, icons.moveTool, _ViewerAction.MoveTool);
            this.addSvgButton(wijmo.culture.Viewer.continuousMode, icons.continuousView, _ViewerAction.Continuous);
            this.addSvgButton(wijmo.culture.Viewer.singleMode, icons.singleView, _ViewerAction.Single);
            this.addSeparator();
            this.addSvgButton(wijmo.culture.Viewer.wholePage, icons.fitWholePage, _ViewerAction.FitWholePage);
            this.addSvgButton(wijmo.culture.Viewer.pageWidth, icons.fitPageWidth, _ViewerAction.FitPageWidth);
            this.addSvgButton(wijmo.culture.Viewer.zoomOut, icons.zoomOut, _ViewerAction.ZoomOut);
            this.addSvgButton(wijmo.culture.Viewer.zoomIn, icons.zoomIn, _ViewerAction.ZoomIn);
            this._initToolbarZoomValue(this.hostElement);
            this.addSvgButton(wijmo.culture.Viewer.fullScreen, icons.fullScreen, _ViewerAction.FullScreen);
        }

        private _initToolbarZoomValue(hostToolbar: HTMLElement) {
            var toolbar = <_Toolbar>wijmo.Control.getControl(hostToolbar),
                zoomDiv = document.createElement('div'),
                zoomValueCombo: wijmo.input.ComboBox,
                temp: any, i: number, j: number,
                zoomValues = ViewerBase._defaultZoomValues;

            zoomDiv.className = 'wj-input-zoom';
            toolbar.addCustomItem(zoomDiv, _ViewerAction.ZoomValue);
            zoomValueCombo = new wijmo.input.ComboBox(zoomDiv);
            zoomValueCombo.deferUpdate(() => {
                for (i = 0; i < zoomValues.length; i++) {
                    for (j = i + 1; j < zoomValues.length; j++) {
                        if (zoomValues[i].value > zoomValues[j].value) {
                            temp = zoomValues[i];
                            zoomValues[i] = zoomValues[j];
                            zoomValues[j] = temp;
                        }
                    }
                }
                zoomValueCombo.itemsSource = zoomValues;
                zoomValueCombo.isEditable = true;
                zoomValueCombo.displayMemberPath = 'name';
                zoomValueCombo.selectedValuePath = 'value';
                zoomValueCombo.selectedValue = 1;
            });

            zoomValueCombo.selectedIndexChanged.addHandler(() => {
                if (zoomValueCombo.isDroppedDown) {
                    var zoomFactor = zoomValueCombo.selectedValue;
                    if (zoomFactor == null) {
                        var zoomFactorText = zoomValueCombo.text.replace(",", "");
                        zoomFactor = parseFloat(zoomFactorText);
                        if (isNaN(zoomFactor)) {
                            zoomFactor = 100;
                        }

                        zoomFactor = zoomFactor * 0.01
                    }

                    this._viewer.zoomFactor = zoomFactor;
                }
            });

            _addEvent(zoomDiv, 'keypress', (e) => {
                var event = e || window.event, zoomText = zoomValueCombo.text, zoomFactor: number;
                if (event.keyCode === Key.Enter) {
                    if (zoomText.lastIndexOf('%') === zoomText.length - 1) {
                        zoomText = zoomText.substring(0, zoomValueCombo.text.length - 1);
                    }
                    zoomText = zoomText.replace(",", "");
                    zoomFactor = parseFloat(zoomText);
                    if (!isNaN(zoomFactor)) {
                        this._viewer.zoomFactor = zoomFactor * 0.01;
                    } else {
                        zoomValueCombo.text = wijmo.Globalize.format(this._viewer.zoomFactor, 'p0');
                    }
                }
            });
            _addEvent(zoomDiv.querySelector('.wj-form-control'), 'blur', (e) => {
                zoomValueCombo.text = wijmo.Globalize.format(this._viewer.zoomFactor, 'p0');
            });

            this._viewer.zoomFactorChanged.addHandler(() => {
                zoomValueCombo.isDroppedDown = false;
                zoomValueCombo.text = wijmo.Globalize.format(this._viewer.zoomFactor, 'p0');
            });
        }
    }

    export class _ViewerMiniToolbar extends _Toolbar {
        private _viewer: ViewerBase;

        constructor(element: any, viewer: ViewerBase) {
            super(element);

            this._viewer = viewer;
            this._initToolbarItems();

            this.svgButtonClicked.addHandler((sender, e: _ToolbarSvgButtonClickedEventArgs) => {
                this._viewer._executeAction(parseInt(e.commandTag));
            });

            var update = () => this.isDisabled = !this._viewer._getDocumentSource();
            this._viewer._documentSourceChanged.addHandler(update);
            update();

            this._viewer._viewerActionStatusChanged.addHandler((sender, e: _ViewerActionStatusChangedEventArgs) => {
                var actionElement = <HTMLElement>this.hostElement.querySelector('[command-tag="' + e.action.toString() + '"]');
                _checkImageButton(actionElement, e.checked);
                _disableImageButton(actionElement, e.disabled);
                _showImageButton(actionElement, e.shown);

                _Toolbar._checkSeparatorShown(this);
            });
        }

        _initToolbarItems() {
            this.addSvgButton(wijmo.culture.Viewer.print, icons.print, _ViewerAction.Print);
            this.addSeparator();
            this.addSvgButton(wijmo.culture.Viewer.previousPage, icons.previousPage, _ViewerAction.PrePage);
            this.addSvgButton(wijmo.culture.Viewer.nextPage, icons.nextPage, _ViewerAction.NextPage);
            _Toolbar._initToolbarPageNumberInput(this.hostElement, this._viewer);
            this.addSeparator();
            this.addSvgButton(wijmo.culture.Viewer.zoomOut, icons.zoomOut, _ViewerAction.ZoomOut);
            this.addSvgButton(wijmo.culture.Viewer.zoomIn, icons.zoomIn, _ViewerAction.ZoomIn);
            this.addSvgButton(wijmo.culture.Viewer.exitFullScreen, icons.exitFullScreen, _ViewerAction.ExitFullScreen);
        }
    }

    export function _createSvgBtn(svgContent: string): HTMLElement {
        var svg = _toDOM(_svgStart + svgContent + _svgEnd);
        addClass(svg, 'wj-svg-btn');
        var btn = document.createElement('a');
        btn.appendChild(svg);
        addClass(btn, 'wj-btn');
        btn.tabIndex = 0;
        return btn;
    }

    export class _PageSetupDialog extends wijmo.input.Popup {

        private _btnClose: HTMLElement;
        private _btnCancel: HTMLElement;
        private _btnApply: HTMLElement;
        private _divPaperKind: HTMLElement;
        private _divOrientation: HTMLElement;
        private _divMarginsLeft: HTMLElement;
        private _divMarginsTop: HTMLElement;
        private _divMarginsRight: HTMLElement;
        private _divMarginsBottom: HTMLElement;
        private _cmbPaperKind: wijmo.input.ComboBox;
        private _cmbOrientation: wijmo.input.ComboBox;
        private _numMarginsLeft: wijmo.input.InputNumber;
        private _numMarginsTop: wijmo.input.InputNumber;
        private _numMarginsRight: wijmo.input.InputNumber;
        private _numMarginsBottom: wijmo.input.InputNumber;
        private _uiUpdating = false;
        public applied = new wijmo.Event();
        public pageSettings: _IPageSettings;

        static controlTemplate = '<div>' +
            // header
            '<div class="wj-dialog-header">' +
                wijmo.culture.Viewer.pageSetup +
                '<a class="wj-hide" wj-part="a-close" style="float:right;outline:none;text-decoration:none;padding:0px 6px" href="" tabindex="-1" draggable="false">&times;</a>' +
            '</div>' +
            // body
            '<div style="padding:12px;">' +
                '<table style="table-layout:fixed">' +
                    '<tr>' +
                        '<td>' + wijmo.culture.Viewer.paperKind + '</td><td><div wj-part="div-paper-kind"></div></td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>' + wijmo.culture.Viewer.orientation + '</td><td><div wj-part="div-page-orientation"></div></td>' +
                    '</tr>' +
                '</table>' +
                '<fieldset style="margin-top: 12px">' +
                    '<legend>' + wijmo.culture.Viewer.margins + '</legend>' +
                    '<table style="table-layout:fixed">' +
                        '<tr>' +
                            '<td>' + wijmo.culture.Viewer.left + '</td><td><div wj-part="div-margins-left"></div></td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>' + wijmo.culture.Viewer.right + '</td><td><div wj-part="div-margins-right"></div></td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>' + wijmo.culture.Viewer.top + '</td><td><div wj-part="div-margins-top"></div></td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td>' + wijmo.culture.Viewer.bottom + '</td><td><div wj-part="div-margins-bottom"></div></td>' +
                        '</tr>' +
                    '</table>' +
                '</fieldset>' +
                // footer
                '<div class="wj-dialog-footer">' +
                    '<a class="wj-hide" wj-part="btn-apply" href="" tabindex="-1" draggable="false">' + wijmo.culture.Viewer.ok + '</a>&nbsp;&nbsp;' +
                    '<a class="wj-hide" wj-part="btn-cancel" href="" tabindex="-1" draggable="false">' + wijmo.culture.Viewer.cancel + '</a>' +
                '</div>' +
            '</div>' +
        '</div>';

        constructor(ele: any) {
            super(ele);

            // check dependencies
            var depErr = 'Missing dependency: _PageSetupDialog requires ';
            assert(input.ComboBox != null, depErr + 'wijmo.input.');

            var tpl: string;
            this.modal = true;
            this.hideTrigger = wijmo.input.PopupTrigger.None;

            // instantiate and apply template
            tpl = this.getTemplate();
            this.applyTemplate('wj-control wj-content', tpl, {
                _divPaperKind: 'div-paper-kind',
                _divOrientation: 'div-page-orientation',
                _divMarginsLeft: 'div-margins-left',
                _divMarginsRight: 'div-margins-right',
                _divMarginsTop: 'div-margins-top',
                _divMarginsBottom: 'div-margins-bottom',
                _btnApply: 'btn-apply',
                _btnCancel: 'btn-cancel',
                _btnClose: 'a-close'
            });

            this._numMarginsLeft = new wijmo.input.InputNumber(this._divMarginsLeft);
            this._numMarginsLeft.valueChanged.addHandler(this._updateValue, this);

            this._numMarginsRight = new wijmo.input.InputNumber(this._divMarginsRight);
            this._numMarginsRight.valueChanged.addHandler(this._updateValue, this);

            this._numMarginsTop = new wijmo.input.InputNumber(this._divMarginsTop);
            this._numMarginsTop.valueChanged.addHandler(this._updateValue, this);

            this._numMarginsBottom = new wijmo.input.InputNumber(this._divMarginsBottom);
            this._numMarginsBottom.valueChanged.addHandler(this._updateValue, this);

            this._cmbPaperKind = new wijmo.input.ComboBox(this._divPaperKind, {
                itemsSource: _enumToArray(_PaperKind),
                displayMemberPath: 'text',
                selectedValuePath: 'value',
                isEditable: false
            });
            this._cmbPaperKind.selectedIndexChanged.addHandler(this._updateValue, this);

            this._cmbOrientation = new wijmo.input.ComboBox(this._divOrientation, {
                itemsSource: [wijmo.culture.Viewer.portrait, wijmo.culture.Viewer.landscape],
                isEditable: false
            });
            this._cmbOrientation.selectedIndexChanged.addHandler(this._updateValue, this);

            this._addEvents();
        }

        private _addEvents(): void {
            var self = this;
            _addEvent(self._btnClose, 'click', () => {
                self.hide();
            });

            _addEvent(self._btnCancel, 'click', () => {
                self.hide();
            });

            _addEvent(self._btnApply, 'click', () => {
                self._apply();
                self.hide();
            });
        }

        private _apply(): void {
            this.onApplied();
        }

        private _updateValue() {
            if (this._uiUpdating) {
                return;
            }

            var pageSettings = this.pageSettings;
            if (pageSettings) {
                pageSettings.bottomMargin = new _Unit(this._numMarginsBottom.value, _UnitType.Inch);
                pageSettings.leftMargin = new _Unit(this._numMarginsLeft.value, _UnitType.Inch);
                pageSettings.rightMargin = new _Unit(this._numMarginsRight.value, _UnitType.Inch);
                pageSettings.topMargin = new _Unit(this._numMarginsTop.value, _UnitType.Inch);
                pageSettings.paperSize = this._cmbPaperKind.selectedValue;
                _setLandscape(pageSettings, this._cmbOrientation.text === wijmo.culture.Viewer.landscape);
                this._updateUI();
            }
        }

        private onApplied(): void {
            this.applied.raise(this, new EventArgs);
        }

        onShowing(e: CancelEventArgs): boolean {
            this._updateUI();
            return super.onShowing(e)
        }

        _updateUI() {
            this._uiUpdating = true;
            var pageSettings = this.pageSettings,
                setMargin = (input: wijmo.input.InputNumber, unit: _Unit) => {
                    input.value = _Unit.convertValue(unit.value, unit.units, _UnitType.Inch);
                };

            if (pageSettings) {
                this._cmbPaperKind.selectedValue = pageSettings.paperSize;
                this._cmbOrientation.text = pageSettings.landscape ? wijmo.culture.Viewer.landscape : wijmo.culture.Viewer.portrait;
                setMargin(this._numMarginsLeft, pageSettings.leftMargin);
                setMargin(this._numMarginsRight, pageSettings.rightMargin);
                setMargin(this._numMarginsTop, pageSettings.topMargin);
                setMargin(this._numMarginsBottom, pageSettings.bottomMargin);
            }
            this._uiUpdating = false;
        }

        onShown(e?: EventArgs) {
            this._cmbPaperKind.focus();
            super.onShown(e);
        }

        showWithValue(pageSettings: _IPageSettings): void {
            var value = _clonePageSettings(pageSettings);
            this.pageSettings = value;
            super.show();
        }
    }

    export function _setLandscape(pageSettings: _IPageSettings, landscape: boolean) {
        if (pageSettings.landscape === landscape) {
            return;
        }

        pageSettings.landscape = landscape;
        var width = pageSettings.width;
        pageSettings.width = pageSettings.height;
        pageSettings.height = width;
        var left = pageSettings.leftMargin;
        if (landscape) {
            pageSettings.leftMargin = pageSettings.bottomMargin;
            pageSettings.bottomMargin = pageSettings.rightMargin;
            pageSettings.rightMargin = pageSettings.topMargin;
            pageSettings.topMargin = left;
        } else {
            pageSettings.leftMargin = pageSettings.topMargin;
            pageSettings.topMargin = pageSettings.rightMargin;
            pageSettings.rightMargin = pageSettings.bottomMargin;
            pageSettings.bottomMargin = left;
        }
    }

    export function _clonePageSettings(src: _IPageSettings): _IPageSettings {
        if (!src) {
            return null;
        }

        var result = <_IPageSettings>{};
        result.height = src.height ? new _Unit(src.height) : null;
        result.width = src.width ? new _Unit(src.width) : null;
        result.bottomMargin = src.bottomMargin ? new _Unit(src.bottomMargin) : null;
        result.leftMargin = src.leftMargin ? new _Unit(src.leftMargin) : null;
        result.rightMargin = src.rightMargin ? new _Unit(src.rightMargin) : null;
        result.topMargin = src.topMargin ? new _Unit(src.topMargin) : null;
        result.landscape = src.landscape;
        result.paperSize = src.paperSize;
        return result;
    }

    export function _enumToArray(enumType: any): _IEnumItem[] {
        var items = [];
        for (var i in enumType) {
            if (!i || !i.length || i[0] == "_" || isNaN(parseInt(i))) continue;
            items.push({ text: enumType[i], value: i });
        }

        return items;
    }

    export function _removeChildren(node: HTMLElement, condition?: (ele: Element) => boolean): void {
        if (!node) {
            return;
        }

        var children = node.children;
        if (!children) {
            return;
        }

        for (var i = children.length - 1; i > -1; i--) {
            var child = children[i];
            if (condition == null || condition(child)) {
                node.removeChild(child);
            }
        }
    }

    export interface _IEnumItem {
        text: string;
        value: number;
    }

    export function _toDOMs(html: string): DocumentFragment {
        var node: Node, container = document.createElement("div"), f = document.createDocumentFragment();
        container.innerHTML = html;
        while (node = container.firstChild) f.appendChild(node);
        return f;
    }

    export function _toDOM(html: string): HTMLElement {
        return <HTMLElement>_toDOMs(html).firstChild;
    }

    export function _addEvent(elm: any, evType: string, fn: Function, useCapture?: boolean): void {
        var types = evType.split(","), type;
        for (var i = 0; i < types.length; i++) {
            type = types[i].trim();
            if (elm.addEventListener) {
                elm.addEventListener(type, fn, useCapture);
            } else if (elm.attachEvent) {
                elm.attachEvent('on' + type, fn);
            } else {
                elm['on' + type] = fn;
            }
        }
    }


    var _checkedCss = 'wj-state-active', _disabledCss = 'wj-state-disabled', _hiddenCss = 'hidden';
    export function _checkImageButton(button: HTMLElement, checked: boolean) {
        if (checked) {
            addClass(button, _checkedCss);
            return;
        }

        removeClass(button, _checkedCss);
    }

    export function _disableImageButton(button: HTMLElement, disabled: boolean) {
        if (disabled) {
            addClass(button, _disabledCss);
            return;
        }

        removeClass(button, _disabledCss);
    }

    export function _showImageButton(button: HTMLElement, visible: boolean) {
        if (visible) {
            removeClass(button, _hiddenCss);
            return;
        }

        addClass(button, _hiddenCss);
    }

    export function _isDisabledImageButton(button: HTMLElement): boolean {
        return hasClass(button, _disabledCss);
    }

    export function _isCheckedImageButton(button: HTMLElement): boolean {
        return hasClass(button, _checkedCss);
    }

    var wjEventsName = '__wjEvents';
    export function _addWjHandler(key: string, event: Event, func: IEventHandler, self?: any) {
        if (key) {
            var handlersDic = event[wjEventsName];
            if (!handlersDic) {
                handlersDic = event[wjEventsName] = {};
            }

            var handlers = <IEventHandler[]>handlersDic[key];
            if (!handlers) {
                handlers = handlersDic[key] = [];
            }

            handlers.push(func);
        }

        event.addHandler(func, self);
    }

    export function _removeAllWjHandlers(key: string, event: Event) {
        if (!key) {
            return;
        }

        var handlersDic = event[wjEventsName];
        if (!handlersDic) {
            return;
        }

        var handlers = <IEventHandler[]>handlersDic[key];
        if (!handlers) {
            return;
        }

        handlers.forEach(h=> event.removeHandler(h));
    }

    export enum _ViewerAction {
        Paginated,
        Print,
        Exports,
        Portrat,
        Landscape,
        PageSetup,
        FirstPage,
        PrePage,
        NextPage,
        LastPage,
        PageNumber,
        PageCount,
        Backward,
        Forward,
        SelectTool,
        MoveTool,
        Continuous,
        Single,
        ZoomOut,
        ZoomIn,
        ZoomValue,
        FitWholePage,
        FitPageWidth,
        FullScreen,
        ExitFullScreen
    }

    export interface _ViewerActionStatusChangedEventArgs {
        action: _ViewerAction;
        disabled: boolean;
        checked: boolean;
        shown: boolean;
    }
}