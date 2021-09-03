var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
};
/**
* Defines a series of classes, interfaces and functions related to the viewer controls.
*/
var wijmo;
(function (wijmo) {
    var viewer;
    (function (viewer_1) {
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
        }, _svgStart = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox = "0 0 24 24" xml: space = "preserve" >', _svgEnd = '</svg>';
        /** Defines the view modes. */
        (function (ViewMode) {
            /** The single view mode. */
            ViewMode[ViewMode["Single"] = 0] = "Single";
            /** The continuouse view mode. */
            ViewMode[ViewMode["Continuous"] = 1] = "Continuous";
        })(viewer_1.ViewMode || (viewer_1.ViewMode = {}));
        var ViewMode = viewer_1.ViewMode;
        var _HistoryManager = (function () {
            function _HistoryManager() {
                this._items = [];
                this._position = -1;
                this.statusChanged = new wijmo.Event();
            }
            _HistoryManager.prototype._onStatusChanged = function () {
                this.statusChanged.raise(this, new wijmo.EventArgs());
            };
            _HistoryManager.prototype.clear = function () {
                if (this._items.length == 0)
                    return;
                this._items.length = 0;
                this._position = -1;
                this._onStatusChanged();
            };
            _HistoryManager.prototype.add = function (item) {
                if (!item) {
                    return;
                }
                this._items.splice(this._position + 1);
                this._items.push(item);
                this._position = this._items.length - 1;
                this._onStatusChanged();
            };
            _HistoryManager.prototype.forward = function () {
                if (!this.canForward()) {
                    return null;
                }
                this._position++;
                this._onStatusChanged();
                return this._items[this._position];
            };
            _HistoryManager.prototype.backward = function () {
                if (!this.canBackward()) {
                    return null;
                }
                this._position--;
                this._onStatusChanged();
                return this._items[this._position];
            };
            _HistoryManager.prototype.canForward = function () {
                return this._items.length > 0 && this._position < this._items.length - 1;
            };
            _HistoryManager.prototype.canBackward = function () {
                return this._items.length > 0 && this._position > 0;
            };
            return _HistoryManager;
        }());
        viewer_1._HistoryManager = _HistoryManager;
        /**
         * Defines an abstract class for the viewer controls.
         */
        var ViewerBase = (function (_super) {
            __extends(ViewerBase, _super);
            /**
             * Initializes a new instance of a @see:ViewerBase control.
             *
             * @param element The DOM element that will host the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options JavaScript object containing initialization data for the control.
             */
            function ViewerBase(element, options) {
                _super.call(this, element, options, true);
                this._initialTop = 0;
                this._initialLeft = 0;
                this._isScrolling = true;
                this._pageNumberChangedByScrolling = false;
                this._preFetchPageCount = 3;
                this._pages = [];
                this._pageNumber = 1;
                this._zoomFactor = 1;
                this._selectMouseMode = true;
                this._viewMode = ViewMode.Single;
                this._needBind = false;
                this._historyManager = new _HistoryManager();
                this._fullScreen = false;
                this._autoHeightCalculated = false;
                // Occurs after the document source changes.
                this._documentSourceChanged = new wijmo.Event();
                /**
                 * Occurs after the page number is changed.
                 */
                this.pageNumberChanged = new wijmo.Event();
                /**
                 * Occurs after the view mode is changed.
                 */
                this.viewModeChanged = new wijmo.Event();
                /**
                 * Occurs after the select mouse mode is changed.
                 */
                this.selectMouseModeChanged = new wijmo.Event();
                /**
                 * Occurs after the full page view mode is changed.
                 */
                this.fullScreenChanged = new wijmo.Event();
                /**
                 * Occurs after the zoom factor is changed.
                 */
                this.zoomFactorChanged = new wijmo.Event();
                /**
                 * Queries the request data sent to the service before loading the document.
                 */
                this.queryLoadingData = new wijmo.Event();
                this._viewerActionStatusChanged = new wijmo.Event();
                this._documentEventKey = new Date().getTime().toString();
                this._init(options);
            }
            Object.defineProperty(ViewerBase.prototype, "serviceUrl", {
                /**
                 * Gets or sets the service url.
                 */
                get: function () {
                    return this._serviceUrl;
                },
                set: function (value) {
                    if (value != this._serviceUrl) {
                        this._serviceUrl = value;
                        this._needBindDocumentSource();
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewerBase.prototype, "filePath", {
                /**
                 * Gets or sets the document path.
                 */
                get: function () {
                    return this._filePath;
                },
                set: function (value) {
                    if (value != this._filePath) {
                        this._filePath = value;
                        this._needBindDocumentSource();
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewerBase.prototype, "_innerPaginated", {
                // Gets or sets a value indicating whether the content should be represented as set of fixed sized pages.
                // The default value is null, means using the default value from document source.
                get: function () {
                    if (this._documentSource && !this._needBind) {
                        return this._documentSource.paginated;
                    }
                    else {
                        return this._paginated;
                    }
                },
                set: function (value) {
                    if (this._documentSource && !this._needBind) {
                        this._setPaginated(value);
                    }
                    else {
                        this._paginated = value == null ? null : wijmo.asBoolean(value);
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Reloads the document.
             */
            ViewerBase.prototype.reload = function () {
                this._needBindDocumentSource();
                this.invalidate();
            };
            /**
             * Refreshes the control.
             *
             * @param fullUpdate Whether to update the control layout as well as the content.
             */
            ViewerBase.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                if (this._needBind) {
                    this._setDocumentSource(this._getSource());
                    this._needBind = false;
                }
                this._resetMiniToolbarPosition();
                this._resetToolbarWidth();
                this._resetViewPanelContainerWidth();
                this._autoHeightCalculated = false;
            };
            // Creates a _DocumentSource object and return it.
            ViewerBase.prototype._getSource = function () {
                if (!this.filePath) {
                    return null;
                }
                return new viewer_1._DocumentSource({
                    serviceUrl: this._serviceUrl,
                    filePath: this._filePath
                });
            };
            ViewerBase.prototype._needBindDocumentSource = function () {
                this._needBind = true;
            };
            ViewerBase.prototype._init = function (options) {
                var _this = this;
                this._createChildren();
                this._resetToolbarWidth();
                this._resetViewPanelContainerWidth();
                this._autoCalculateViewerContainerHeight();
                this._bindEvents();
                this.deferUpdate(function () {
                    _this.initialize(options);
                });
            };
            ViewerBase.prototype._autoCalculateViewerContainerHeight = function () {
                if (!this._shouldAutoHeight()) {
                    return;
                }
                var viewpanelContainerStyleHeight = this._viewpanelContainer.style.height;
                this._viewpanelContainer.style.height = 'auto';
                this._viewerContainer.style.height =
                    Math.max(this._viewpanelContainer.getBoundingClientRect().height, ViewerBase._viewpanelContainerMinHeight) + 'px';
                this._viewpanelContainer.style.height = viewpanelContainerStyleHeight;
            };
            ViewerBase.prototype._bindEvents = function () {
                var _this = this;
                var viewerScrollingTimer;
                _addEvent(this._viewpanelContainer, 'click', function (e) {
                    _this._viewpanelContainer.focus();
                });
                _addEvent(window, 'unload', function () {
                    if (_this._documentSource) {
                        _this._documentSource.dispose();
                    }
                });
                _addEvent(this._viewpanelContainer, 'scroll', function () {
                    if (viewerScrollingTimer !== null) {
                        clearTimeout(viewerScrollingTimer);
                    }
                    viewerScrollingTimer = setTimeout(function () {
                        _this._isScrolling = true;
                        _this._onViewScrolling();
                    }, 200);
                });
                _addEvent(document, 'mousemove', function (e) {
                    var isPanning = _this._startX && _this._startY;
                    if (isPanning) {
                        _this._panning(e);
                        return;
                    }
                    if (_this.fullScreen) {
                        _this._showMiniToolbar(_this._checkMiniToolbarVisible(e));
                    }
                });
                _addEvent(document, 'mouseup', function (e) {
                    _this._stopPanning();
                });
                this._historyManager.statusChanged.addHandler(this._onHistoryManagerStatusUpdated, this);
                this._onHistoryManagerStatusUpdated();
            };
            ViewerBase.prototype._checkMiniToolbarVisible = function (e) {
                var x = e.clientX, y = e.clientY;
                var bound = this._miniToolbar.getBoundingClientRect(), visibleOffset = 60, visibleLeft = bound.left - visibleOffset, visibleRight = bound.right + visibleOffset, visibleTop = bound.top - visibleOffset, visibleBottom = bound.bottom + visibleOffset;
                return x >= visibleLeft && x <= visibleRight &&
                    y >= visibleTop && y <= visibleBottom;
            };
            ViewerBase.prototype._showMiniToolbar = function (visible) {
                var opacity = parseFloat(getComputedStyle(this._miniToolbar, '')['opacity']), step = 0.01, t, toolbar = this._miniToolbar;
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
            };
            ViewerBase.prototype._startPanning = function (e) {
                this._startX = e.screenX;
                this._startY = e.screenY;
            };
            ViewerBase.prototype._panning = function (e) {
                this._viewpanelContainer.scrollLeft += this._startX - e.screenX;
                this._viewpanelContainer.scrollTop += this._startY - e.screenY;
                this._startX = e.screenX;
                this._startY = e.screenY;
            };
            ViewerBase.prototype._stopPanning = function () {
                this._startX = null;
                this._startY = null;
            };
            ViewerBase.prototype._goToBookmark = function (name) {
                var _this = this;
                if (!this._documentSource || name === "") {
                    return;
                }
                this._documentSource.getBookmark(name).then(function (bookmark) {
                    if (bookmark) {
                        _this._scrollToPosition(bookmark, true);
                    }
                });
            };
            ViewerBase.prototype._executeCustomAction = function (actionString) {
                var _this = this;
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
                this._documentSource.executeCustomAction(actionString).then(function (position) {
                    // scroll to the new position after custom action is performed.
                    _this._initialPosition = position || _this._initialPosition;
                    // update the status to force updating view.
                    _this._getStatusUtilCompleted(documentSource);
                }).catch(function (reason) {
                    _this._showViewPanelErrorMessage(_this._getErrorMessage(reason));
                });
            };
            ViewerBase.prototype._getStatusUtilCompleted = function (documentSource) {
                var _this = this;
                if (!documentSource || documentSource.isLoadCompleted
                    || documentSource.isDisposed) {
                    return;
                }
                documentSource.getDocumentStatus().then(function (v) {
                    if (_this._documentSource !== documentSource) {
                        return;
                    }
                    setTimeout(function () { return _this._getStatusUtilCompleted(documentSource); }, 100);
                });
            };
            ViewerBase.prototype._onViewScrolling = function () {
                //only do the changes if it is continuous mode and invoked by scrolling the scrollbar.
                if (this.viewMode === ViewMode.Single || this._documentSource.pageCount <= this._preFetchPageCount || !this._isScrolling) {
                    this._isScrolling = true;
                    return;
                }
                this._updateScrollPageNumber(true);
            };
            ViewerBase.prototype._updateScrollPageNumber = function (isScrolling) {
                var self = this, scrollTop, pageMargin, pageHeight, currentPageIndex;
                scrollTop = self._viewpanelContainer.scrollTop;
                pageMargin = 30;
                pageHeight = self._documentSource.pageSettings.height.valueInPixel * self._zoomFactor;
                currentPageIndex = Math.round(scrollTop / (pageHeight + pageMargin));
                if (self._pageNumber !== currentPageIndex + 1) {
                    self._pageNumberChangedByScrolling = true;
                    self._innerMoveToPage(currentPageIndex + 1, isScrolling);
                }
            };
            ViewerBase.prototype._createChildren = function () {
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
            };
            ViewerBase.prototype._initSplitter = function () {
                var _this = this;
                _addEvent(this._splitter, 'click', function () { return _this._toggleSplitter(); });
            };
            ViewerBase.prototype._toggleSplitter = function (collapsed) {
                var leftCss = 'wj-glyph-left', rightCss = 'wj-glyph-right', arrow = this._splitter.querySelector('span'), tabs = wijmo.Control.getControl(this._sidePanel);
                if (collapsed === true) {
                    if (wijmo.hasClass(arrow, rightCss)) {
                        return;
                    }
                }
                else if (collapsed === false) {
                    if (wijmo.hasClass(arrow, leftCss)) {
                        return;
                    }
                }
                else {
                    collapsed = wijmo.hasClass(arrow, leftCss);
                }
                if (!collapsed) {
                    if (tabs.visibleTabPagesCount === 0) {
                        return;
                    }
                    arrow.className = leftCss;
                    tabs.expand();
                }
                else {
                    tabs.collapse();
                    arrow.className = rightCss;
                }
                this._resetViewPanelContainerWidth();
            };
            ViewerBase.prototype._resetMiniToolbarPosition = function () {
                var containerWidth = this.hostElement.getBoundingClientRect().width, selfWidth = this._miniToolbar.getBoundingClientRect().width;
                this._miniToolbar.style.left = (containerWidth - selfWidth) / 2 + 'px';
            };
            ViewerBase.prototype._resetToolbarWidth = function () {
                var toolbar = wijmo.Control.getControl(this._toolbar);
                toolbar.resetWidth();
            };
            ViewerBase.prototype._resetViewPanelContainerWidth = function () {
                var self = this;
                self._viewpanelContainer.style.width = self._viewerContainer.getBoundingClientRect().width -
                    self._splitter.getBoundingClientRect().width - self._leftPanel.getBoundingClientRect().width + 'px';
            };
            ViewerBase.prototype._shouldAutoHeight = function () {
                return this.hostElement.style.height === '100%' || this.hostElement.style.height === 'auto';
            };
            ViewerBase.prototype._initSidePanel = function () {
                var _this = this;
                var sideTabs = new _SideTabs(this._sidePanel);
                sideTabs.collapse();
                sideTabs.collapsed.addHandler(function () {
                    _this._toggleSplitter(true);
                });
                sideTabs.expanded.addHandler(function () {
                    _this._toggleSplitter(false);
                    var sidePanelAndSplitterWidth = _this._sidePanel.getBoundingClientRect().width + _this._splitter.getBoundingClientRect().width;
                    if (sidePanelAndSplitterWidth > _this._viewerContainer.getBoundingClientRect().width) {
                        wijmo.addClass(_this._sidePanel, "collapsed");
                    }
                });
                sideTabs.tabPageVisibilityChanged.addHandler(function (sender, e) {
                    if ((!e.tabPage.isHidden && sideTabs.visibleTabPagesCount == 1)
                        || (e.tabPage.isHidden && sideTabs.visibleTabPagesCount == 0)) {
                        _this._resetViewPanelContainerWidth();
                    }
                });
                this._initSidePanelThumbnails();
                this._initSidePanelOutlines();
                this._initSidePanelSearch();
            };
            ViewerBase.prototype._highlightPosition = function (pageIndex, boundsList) {
                var _this = this;
                this._innerMoveToPage(pageIndex + 1).then(function (_) {
                    var self = _this, g, viewPage, preHighlights, viewPages, oldPageNumber = self._pageNumber, oldScrollTop = self._viewpanelContainer.scrollTop, oldScrollLeft = self._viewpanelContainer.scrollLeft, historyPosition = { pageIndex: pageIndex, pageBounds: null };
                    switch (self.viewMode) {
                        case (ViewMode.Continuous):
                            viewPages = self._viewpanelWrapper.querySelectorAll('.wj-view-page');
                            viewPage = viewPages.item(pageIndex);
                            break;
                        case (ViewMode.Single):
                            viewPage = self._viewpanelWrapper.querySelector('.wj-view-page');
                            break;
                    }
                    g = viewPage.querySelector('g');
                    preHighlights = self._viewpanelWrapper.querySelectorAll('.highlight');
                    for (var i = 0; i < preHighlights.length; i++) {
                        preHighlights.item(i).parentNode.removeChild(preHighlights.item(i));
                    }
                    for (var i = 0; i < boundsList.length; i++) {
                        var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                        rect.setAttributeNS(null, 'x', viewer_1._twipToPixel(boundsList[i].x).toString());
                        rect.setAttributeNS(null, 'y', viewer_1._twipToPixel(boundsList[i].y).toString());
                        rect.setAttributeNS(null, 'height', viewer_1._twipToPixel(boundsList[i].height).toString());
                        rect.setAttributeNS(null, 'width', viewer_1._twipToPixel(boundsList[i].width).toString());
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
            };
            ViewerBase.prototype._scrollToPosition = function (position, addHistory) {
                var pageIndex = position.pageIndex || 0, bound = position.pageBounds || { x: 0, y: 0, width: 0, height: 0 }, zoomFactor = this.zoomFactor, heightOffset, widthOffset;
                heightOffset = viewer_1._twipToPixel(bound.y) * zoomFactor + 30;
                widthOffset = viewer_1._twipToPixel(bound.x) * zoomFactor + 30;
                this._initialTop = heightOffset;
                this._initialLeft = widthOffset;
                if (this._pageNumber !== pageIndex + 1) {
                    this._innerMoveToPage(pageIndex + 1);
                }
                else {
                    if (this.viewMode === ViewMode.Continuous) {
                        this._scrollToCurrentPage();
                    }
                    else {
                        this._scrollToInitialPosition();
                    }
                }
                if (addHistory === true) {
                    this._addHistory(position);
                }
            };
            ViewerBase.prototype._initSidePanelSearch = function () {
                var _this = this;
                var sideTabs = wijmo.Control.getControl(this._sidePanel);
                sideTabs.addPage(wijmo.culture.Viewer.search, icons.search).format(function (t) {
                    var settingsHtml = '<div class="wj-searchcontainer">' +
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
                        '<h3 class="wj-searchresult">' + wijmo.culture.Viewer.searchResults + '</h3>', settingsElement = _toDOMs(settingsHtml), searchResults;
                    t.outContent.querySelector('.wj-tabtitle-wrapper').appendChild(settingsElement);
                    var matchCaseCheckBox = t.outContent.querySelectorAll('input[type="checkbox"]')[0], wholeWordCheckBox = t.outContent.querySelectorAll('input[type="checkbox"]')[1], input = t.outContent.querySelector('input[type="text"]'), preBtn = t.outContent.querySelector('.wj-btn-searchpre'), nextBtn = t.outContent.querySelector('.wj-btn-searchnext');
                    wijmo.addClass(t.content.parentElement, 'search-wrapper');
                    wijmo.addClass(t.content, 'wj-searchresultlist');
                    var list = new wijmo.input.ListBox(t.content), isSettingItemsSource = false, highlighting = false;
                    list.formatItem.addHandler(function (sender, e) {
                        var searchItem = e.item, data = e.data, searchPageNumberDiv = document.createElement('div'), searchTextDiv = document.createElement('div');
                        searchItem.innerHTML = '';
                        searchTextDiv.innerHTML = data.nearText;
                        searchTextDiv.className = 'wj-search-text';
                        searchPageNumberDiv.innerHTML = 'Page ' + (data.pageIndex + 1);
                        searchPageNumberDiv.className = 'wj-search-page';
                        wijmo.addClass(searchItem, 'wj-search-item');
                        searchItem.setAttribute('tabIndex', '-1');
                        searchItem.appendChild(searchTextDiv);
                        searchItem.appendChild(searchPageNumberDiv);
                    });
                    var highlightIndex = -1, highlight = function (index) {
                        if (isSettingItemsSource || highlighting) {
                            return;
                        }
                        var currentResults = (searchResults || list.itemsSource);
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
                        _this._highlightPosition(result.pageIndex, result.boundsList);
                        highlighting = false;
                    };
                    list.selectedIndexChanged.addHandler(function () { return highlight(list.selectedIndex); });
                    var clearResult = function () {
                        searchResults = null;
                    }, callSearch = function () {
                        var p = new viewer_1._Promise();
                        if (searchResults) {
                            p.resolve(searchResults);
                            return p;
                        }
                        if (!_this._documentSource) {
                            p.reject('Cannot search without document source.');
                            return p;
                        }
                        if (!input.value) {
                            return p;
                        }
                        highlightIndex = -1;
                        return _this._documentSource.search(input.value, matchCaseCheckBox.checked, wholeWordCheckBox.checked).then(function (v) {
                            searchResults = v;
                            isSettingItemsSource = true;
                            list.itemsSource = v;
                            isSettingItemsSource = false;
                        });
                    }, search = function (pre) {
                        callSearch().then(function (v) {
                            if (!v || !v.length) {
                                return;
                            }
                            var index = highlightIndex;
                            if (pre) {
                                index--;
                                if (index < 0) {
                                    index = v.length - 1;
                                }
                            }
                            else {
                                index++;
                                if (index >= v.length) {
                                    index = 0;
                                }
                            }
                            index = Math.max(Math.min(index, v.length - 1), 0);
                            highlight(index);
                        });
                    }, update = function () {
                        clearResult();
                        list.itemsSource = null;
                        matchCaseCheckBox.checked = false;
                        wholeWordCheckBox.checked = false;
                        input.value = '';
                        if (!_this._documentSource || !_this._documentSource.features
                            || (_this._documentSource.paginated && !_this._documentSource.features.textSearchInPaginatedMode)) {
                            sideTabs.hide(t);
                            return;
                        }
                        sideTabs.show(t);
                    };
                    _this._documentSourceChanged.addHandler(function () {
                        if (_this._documentSource) {
                            _addWjHandler(_this._documentEventKey, _this._documentSource.loadCompleted, update);
                        }
                        update();
                    });
                    _addEvent(matchCaseCheckBox, 'click', clearResult);
                    _addEvent(wholeWordCheckBox, 'click', clearResult);
                    _addEvent(input, 'input', clearResult);
                    _addEvent(input, 'keyup', function (e) {
                        var event = e || window.event;
                        if (event.keyCode === wijmo.Key.Enter) {
                            search(event.shiftKey);
                        }
                    });
                    _addEvent(nextBtn, 'click', function () { return search(); });
                    _addEvent(preBtn, 'click', function () { return search(true); });
                    _addEvent(t.header, 'keydown', function (e) {
                        var next, toolbar = _this._toolbar;
                        if (e.keyCode === wijmo.Key.Tab) {
                            next = toolbar.querySelector('[tabIndex=0]')
                                || toolbar.querySelector('input:not([type="hidden"])')
                                || toolbar;
                            if (next && next['focus']) {
                                next.focus();
                                e.preventDefault();
                            }
                        }
                    });
                });
            };
            ViewerBase.prototype._initSidePanelOutlines = function () {
                var _this = this;
                var sideTabs = wijmo.Control.getControl(this._sidePanel);
                sideTabs.addPage(wijmo.culture.Viewer.outlines, icons.outlines).format(function (t) {
                    wijmo.addClass(t.content, 'wj-outlines-tree');
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
                    tree.itemFormatter = function (panel, r, c, cell) {
                        var itemHeader;
                        if (cell.firstElementChild) {
                            itemHeader = cell.firstElementChild.outerHTML;
                        }
                        else {
                            itemHeader = '&nbsp;&nbsp;&nbsp;&nbsp;';
                        }
                        var position = panel.rows[r].dataItem['position'];
                        cell.innerHTML = itemHeader + '<a>' + panel.rows[r].dataItem['caption'] + '</a>';
                    };
                    var updatingOutlineSource = false;
                    tree.selectionChanged.addHandler(function (flexGrid, e) {
                        if (updatingOutlineSource) {
                            return;
                        }
                        var row = e.panel.rows[e.row];
                        if (row) {
                            _this._scrollToPosition(row.dataItem['position'], true);
                        }
                    });
                    var isTreeRefreshed = false, refreshTree = function () {
                        if (isTreeRefreshed)
                            return;
                        if (sideTabs.isCollapsed || !t.isActived || t.isHidden) {
                            return;
                        }
                        tree.refresh();
                        isTreeRefreshed = true;
                    }, toggleTab = function () {
                        if (!_this._documentSource) {
                            tree.itemsSource = null;
                            sideTabs.hide(t);
                            return;
                        }
                        var update = function () {
                            if (!_this._documentSource.hasOutlines) {
                                tree.itemsSource = null;
                                sideTabs.hide(t);
                                return;
                            }
                            _this._documentSource.getOutlines().then(function (items) {
                                isTreeRefreshed = false;
                                tree.itemsSource = items;
                                sideTabs.show(t);
                                refreshTree();
                            });
                        };
                        _addWjHandler(_this._documentEventKey, _this._documentSource.loadCompleted, update);
                        update();
                    };
                    _this._documentSourceChanged.addHandler(toggleTab);
                    sideTabs.expanded.addHandler(refreshTree);
                    sideTabs.tabPageActived.addHandler(refreshTree);
                    toggleTab();
                });
            };
            ViewerBase.prototype._initSidePanelThumbnails = function () {
                var _this = this;
                var sideTabs = wijmo.Control.getControl(this._sidePanel);
                sideTabs.addPage(wijmo.culture.Viewer.thumbnails, icons.thumbnails).format(function (t) {
                    wijmo.addClass(t.content, 'wj-thumbnaillist');
                    var list = new wijmo.input.ListBox(t.content), pngUrls = null, isItemsSourceSetting = false;
                    list.formatItem.addHandler(function (sender, e) {
                        var item = e.item, data = e.data, img = document.createElement('img'), indexDiv = document.createElement('div');
                        item.innerHTML = '';
                        wijmo.addClass(item, 'wj-thumbnail-item');
                        img.setAttribute('tabIndex', '-1');
                        img.className = 'wj-pagethumbnail';
                        img.src = data;
                        item.appendChild(img);
                        indexDiv.className = 'page-index';
                        indexDiv.innerHTML = (e.index + 1).toString();
                        item.appendChild(indexDiv);
                    });
                    list.selectedIndexChanged.addHandler(function () {
                        if (isItemsSourceSetting || list.selectedIndex < 0
                            || list.selectedIndex == _this._pageNumber - 1) {
                            return;
                        }
                        _this.moveToPage(list.selectedIndex + 1);
                    });
                    _this.pageNumberChanged.addHandler(function () { return list.selectedIndex = _this._pageNumber - 1; });
                    var createThumbnails = function () {
                        if (!_this._documentSource || !_this._documentSource.isLoadCompleted) {
                            return null;
                        }
                        var urls = [];
                        for (var i = 0; i < _this._documentSource.pageCount; i++) {
                            urls.push(_this._documentSource.getRenderToFilterUrl({ format: 'png', resolution: 50, outputRange: i + 1 }));
                        }
                        return urls;
                    }, updateItems = function () {
                        if (sideTabs.isCollapsed || !t.isActived) {
                            return;
                        }
                        if (!pngUrls) {
                            pngUrls = createThumbnails();
                        }
                        if (t.isActived && list.itemsSource !== pngUrls) {
                            list.deferUpdate(function () {
                                isItemsSourceSetting = true;
                                list.itemsSource = pngUrls;
                                list.selectedIndex = _this._pageNumber - 1;
                                isItemsSourceSetting = false;
                            });
                        }
                    }, update = function () {
                        if (!_this._documentSource
                            || !_this._documentSource.paginated) {
                            sideTabs.hide(t);
                            list.itemsSource = null;
                            return;
                        }
                        sideTabs.show(t);
                        pngUrls = null;
                        updateItems();
                    }, bindEvents = function () {
                        if (!_this._documentSource) {
                            sideTabs.hide(t);
                            list.itemsSource = null;
                            return;
                        }
                        _addWjHandler(_this._documentEventKey, _this._documentSource.loadCompleted, update);
                        _addWjHandler(_this._documentEventKey, _this._documentSource.pageCountChanged, update);
                        _addWjHandler(_this._documentEventKey, _this._documentSource.pageSettingsChanged, update);
                        update();
                    };
                    _this._documentSourceChanged.addHandler(bindEvents);
                    bindEvents();
                    sideTabs.expanded.addHandler(updateItems);
                    sideTabs.tabPageActived.addHandler(updateItems);
                    updateItems();
                });
            };
            ViewerBase.prototype._scrollToCurrentPage = function () {
                var self = this, pageMargin, pageHeight;
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
            };
            ViewerBase.prototype._scrollToInitialPosition = function () {
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
            };
            ViewerBase.prototype._executeAction = function (action) {
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
            };
            ViewerBase.prototype._initToolbars = function () {
                new _ViewerToolbar(this._toolbar, this);
                new _ViewerMiniToolbar(this._miniToolbar, this);
                wijmo.addClass(this._miniToolbar, "wj-mini-toolbar");
            };
            ViewerBase.prototype._clearExportMenuItems = function () {
                if (this._exportMenu) {
                    this._exportMenu.itemsSource = null;
                }
            };
            ViewerBase.prototype._updateExportMenu = function () {
                var _this = this;
                if (!this._documentSource) {
                    return;
                }
                this._documentSource.getSupportedExportDescriptions().then(function (items) {
                    items.forEach(function (item) {
                        item.name = ViewerBase._exportNames[item.format];
                    });
                    _this._exportMenu.itemsSource = items;
                    _this._exportMenu.displayMemberPath = 'name';
                    _this._exportMenu.selectedValuePath = 'format';
                    _this._updateAction(_ViewerAction.Exports);
                });
            };
            ViewerBase.prototype._actionIsChecked = function (action) {
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
            };
            ViewerBase.prototype._actionIsDisabled = function (action) {
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
            };
            ViewerBase.prototype._actionIsShown = function (action) {
                var features = this._documentSource ? (this._documentSource.features) : null;
                switch (action) {
                    case _ViewerAction.Paginated:
                        return features && features.paginated && features.nonPaginated;
                    case _ViewerAction.Landscape:
                    case _ViewerAction.Portrat:
                    case _ViewerAction.PageSetup:
                        return features && features.pageSettings;
                }
                return true;
            };
            ViewerBase.prototype._onViewerActionStatusChanged = function (e) {
                this._viewerActionStatusChanged.raise(this, e);
            };
            ViewerBase.prototype._updateAction = function (action) {
                var e = {
                    action: action,
                    disabled: this._actionIsDisabled(action),
                    checked: this._actionIsChecked(action),
                    shown: this._actionIsShown(action)
                };
                this._onViewerActionStatusChanged(e);
            };
            ViewerBase.prototype._updateToolbarActions = function () {
                this._updateAction(_ViewerAction.Paginated);
                this._updateAction(_ViewerAction.Landscape);
                this._updateAction(_ViewerAction.Portrat);
                this._updateAction(_ViewerAction.PageSetup);
                this._updateAction(_ViewerAction.Continuous);
                this._updateAction(_ViewerAction.Single);
                this._updateAction(_ViewerAction.Exports);
            };
            ViewerBase.prototype._updateViewModeActions = function () {
                this._updateAction(_ViewerAction.Continuous);
                this._updateAction(_ViewerAction.Single);
            };
            ViewerBase.prototype._onPageSettingsUpdated = function () {
                this._updateAction(_ViewerAction.Paginated);
                this._updateAction(_ViewerAction.Landscape);
                this._updateAction(_ViewerAction.Portrat);
                this._updateAction(_ViewerAction.PageSetup);
                this._updateViewModeActions();
                this._resetToolbarWidth();
            };
            ViewerBase.prototype._onPageCountUpdated = function () {
                this._updatePageNavActions();
                this._resetToolbarWidth();
            };
            ViewerBase.prototype._updatePageNavActions = function () {
                this._updateAction(_ViewerAction.FirstPage);
                this._updateAction(_ViewerAction.LastPage);
                this._updateAction(_ViewerAction.PrePage);
                this._updateAction(_ViewerAction.NextPage);
            };
            ViewerBase.prototype._onHistoryManagerStatusUpdated = function () {
                this._updateAction(_ViewerAction.Backward);
                this._updateAction(_ViewerAction.Forward);
            };
            ViewerBase.prototype._updateViewContainerCursor = function () {
                var showMoveTool = !this.selectMouseMode;
                if (showMoveTool) {
                    if (!wijmo.hasClass(this._viewpanelContainer, 'move')) {
                        wijmo.addClass(this._viewpanelContainer, 'move');
                    }
                }
                else if (wijmo.hasClass(this._viewpanelContainer, 'move')) {
                    wijmo.removeClass(this._viewpanelContainer, 'move');
                }
            };
            ViewerBase.prototype._updateFullScreenStyle = function () {
                var fullScreenClass = 'full-screen';
                if (this.fullScreen) {
                    if (!wijmo.hasClass(this.hostElement, fullScreenClass)) {
                        wijmo.addClass(this.hostElement, fullScreenClass);
                    }
                    var body = document.body;
                    if (!wijmo.hasClass(body, fullScreenClass)) {
                        wijmo.addClass(body, fullScreenClass);
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
                }
                else if (this._placeHolderElement && this._placeHolderElement.parentElement) {
                    if (wijmo.hasClass(this.hostElement, fullScreenClass)) {
                        wijmo.removeClass(this.hostElement, fullScreenClass);
                    }
                    var body = document.body;
                    if (wijmo.hasClass(body, fullScreenClass)) {
                        wijmo.removeClass(body, fullScreenClass);
                    }
                    body.removeChild(this.hostElement);
                    var parent = this._placeHolderElement.parentElement;
                    parent.insertBefore(this.hostElement, this._placeHolderElement);
                    parent.removeChild(this._placeHolderElement);
                    this.hostElement.style.width = this._hostOriginWidth;
                    this.hostElement.style.height = this._hostOriginHeight;
                }
                this.refresh();
            };
            ViewerBase.prototype._initExportMenu = function (owner) {
                var exportDiv = document.createElement('div');
                exportDiv.style.display = 'none';
                this._exportMenu = new wijmo.input.Menu(exportDiv);
                this._exportMenu.showDropDownButton = false;
                this._exportMenu.itemClicked.addHandler(this._onExportClicked, this);
                this._exportMenu.owner = owner;
            };
            ViewerBase.prototype._onExportClicked = function (menu) {
                var self = this, item = menu.selectedItem, iframe;
                if (self._documentSource && self._documentSource.pageCount >= 0) {
                    var url = self._documentSource.getRenderToFilterUrl({ format: item.format }), iframe = document.querySelector('#viewDownloader');
                    if (!iframe) {
                        iframe = document.createElement('iframe');
                        iframe.id = 'viewDownloader';
                        iframe.style.display = 'none';
                        document.body.appendChild(iframe);
                    }
                    iframe.src = url;
                }
            };
            /**
             * Shows the page setup dialog.
             */
            ViewerBase.prototype.showPageSetupDialog = function () {
                if (!this._pageSetupDialog) {
                    this._createPageSetupDialog();
                }
                this._pageSetupDialog.showWithValue(this._documentSource.pageSettings);
            };
            ViewerBase.prototype._createPageSetupDialog = function () {
                var self = this, ele = document.createElement("div");
                ele.style.display = 'none';
                self.hostElement.appendChild(ele);
                self._pageSetupDialog = new _PageSetupDialog(ele);
                self._pageSetupDialog.applied.addHandler(function () { return self._setPageSettings(self._pageSetupDialog.pageSettings); });
            };
            /**
             * Stretches page to show the whole page in viewer.
             */
            ViewerBase.prototype.zoomToView = function () {
                var self = this, doc = self._documentSource, viewHeight, viewWidth, pageHeight, pageWidth;
                if (!doc || !doc.pageSettings) {
                    return;
                }
                viewHeight = self._getViewPortHeight();
                viewWidth = self._getViewPortWidth();
                var pageSize = this._getPageSize();
                self.zoomFactor = Math.min(viewHeight / pageSize.height.valueInPixel, viewWidth / pageSize.width.valueInPixel);
            };
            /**
             * Stretches page to fit the width of viewer.
             */
            ViewerBase.prototype.zoomToViewWidth = function () {
                var self = this, doc = self._documentSource, viewHeight, viewWidth, pageHeight, pageWidth;
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
            };
            ViewerBase.prototype._getScrollbarWidth = function () {
                var self = this, parent, child;
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
            };
            ViewerBase.prototype._getViewPortHeight = function () {
                var self = this, style = self._viewpanelWrapper['currentStyle'] || window.getComputedStyle(self._viewpanelWrapper);
                return self._viewpanelContainer.offsetHeight - parseFloat(style.marginBottom) - parseFloat(style.marginTop);
                ;
            };
            ViewerBase.prototype._getViewPortWidth = function () {
                var self = this, style = self._viewpanelWrapper['currentStyle'] || window.getComputedStyle(self._viewpanelWrapper);
                return self._viewpanelContainer.offsetWidth - parseFloat(style.marginLeft) - parseFloat(style.marginRight);
            };
            ViewerBase.prototype._setPageLandscape = function (landscape) {
                var self = this, pageSettings = this._documentSource.pageSettings;
                _setLandscape(pageSettings, landscape);
                self._setPageSettings(pageSettings);
            };
            ViewerBase.prototype._setPaginated = function (paginated) {
                var features = this._documentSource.features, pageSettings = this._documentSource.pageSettings;
                if (!features || !pageSettings)
                    return;
                if (paginated == pageSettings.paginated)
                    return;
                if (paginated && features.paginated) {
                    pageSettings.paginated = true;
                    this._setPageSettings(pageSettings);
                }
                else if (!paginated && features.nonPaginated) {
                    pageSettings.paginated = false;
                    this._setPageSettings(pageSettings);
                }
            };
            ViewerBase.prototype._setPageSettings = function (pageSettings) {
                var _this = this;
                this._showViewPanelMessage();
                return this._documentSource.setPageSettings(pageSettings).then(function (data) {
                    _this._resetDocument();
                    _this._reRenderDocument();
                }).catch(function (reason) {
                    _this._showViewPanelErrorMessage(_this._getErrorMessage(reason));
                });
            };
            ViewerBase.prototype._showViewPanelErrorMessage = function (message) {
                this._showViewPanelMessage(message, 'errormessage');
            };
            ViewerBase.prototype._showViewPanelMessage = function (message, className) {
                var div = this._viewpanelContainer.querySelector('.wj-viewer-loading');
                if (!div) {
                    div = document.createElement('div');
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
            };
            ViewerBase.prototype._removeViewPanelMessage = function () {
                var div = this._viewpanelContainer.querySelector('.wj-viewer-loading');
                if (div) {
                    this._viewpanelContainer.removeChild(div);
                }
            };
            ViewerBase.prototype._reRenderDocument = function () {
                if (this._documentSource) {
                    this._showViewPanelMessage();
                    this._documentSource.load();
                }
            };
            ViewerBase.prototype._zoomBtnClicked = function (zoomIn, zoomValues) {
                var self = this, i, zoomIndex, isFixedValue;
                for (i = 0; i < zoomValues.length; i++) {
                    if (zoomValues[i].value > self._zoomFactor) {
                        zoomIndex = i - 0.5;
                        break;
                    }
                    else if (zoomValues[i].value === self._zoomFactor) {
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
                }
                else {
                    zoomIndex = Math.ceil(zoomIndex) - 1;
                }
                self.zoomFactor = zoomValues[zoomIndex].value;
            };
            // Gets the document source of the viewer.
            ViewerBase.prototype._getDocumentSource = function () {
                return this._documentSource;
            };
            // Sets the document source of the viewer.
            ViewerBase.prototype._setDocumentSource = function (value) {
                this._loadDocument(value);
            };
            ViewerBase.prototype._loadDocument = function (value) {
                var _this = this;
                var promise = new viewer_1._Promise();
                if (this._documentSource === value) {
                    return promise;
                }
                this._disposeDocument();
                this._documentSource = value;
                if (value) {
                    _addWjHandler(this._documentEventKey, value.loadCompleted, this._onDocumentSourceLoadCompleted, this);
                    _addWjHandler(this._documentEventKey, value.queryLoadingData, function (s, e) {
                        _this.onQueryLoadingData(e);
                    }, this);
                    if (!value.isLoadCompleted) {
                        this._showViewPanelMessage();
                        value.load().then(function (v) {
                            _this._keepServiceConnection();
                            promise.resolve(v);
                        }).catch(function (reason) {
                            _this._showViewPanelErrorMessage(_this._getErrorMessage(reason));
                        });
                    }
                    else {
                        this._onDocumentSourceLoadCompleted();
                        this._keepServiceConnection();
                        promise.resolve();
                    }
                }
                this._onDocumentSourceChanged();
                return promise;
            };
            ViewerBase.prototype._getErrorMessage = function (reason) {
                var errorText = reason || wijmo.culture.Viewer.errorOccured;
                if (reason.Message) {
                    errorText = reason.Message;
                    if (reason.ExceptionMessage) {
                        errorText += '<br/>' + reason.ExceptionMessage;
                    }
                }
                return errorText;
            };
            ViewerBase.prototype._onDocumentSourceLoadCompleted = function () {
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
                    }
                    else {
                        // show the specific page.
                        this._scrollToPosition(position, true);
                    }
                    if (errorList && errorList.length > 0) {
                        var errors = "";
                        for (var i = 0; i < errorList.length; i++) {
                            errors += errorList[i] + "\r\n";
                        }
                    }
                }
            };
            ViewerBase.prototype._renderSinglePage = function (viewPage, pageNumber) {
                var _this = this;
                var pageNum = pageNumber || this._pageNumber, loadingDiv, pageIndex, promise = new viewer_1._Promise(), documentSource = this._documentSource;
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
                }).then(function (data) {
                    if (_this._documentSource !== documentSource) {
                        return;
                    }
                    var tempDiv = document.createElement('div'), svg, g;
                    tempDiv.innerHTML = data.responseText;
                    var section = tempDiv.querySelector('section');
                    var pageSize;
                    if (section && section.style) {
                        pageSize = { width: new viewer_1._Unit(section.style.width), height: new viewer_1._Unit(section.style.height) };
                    }
                    svg = tempDiv.querySelector('svg');
                    g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                    while (svg.hasChildNodes()) {
                        g.appendChild(svg.firstChild);
                    }
                    svg.appendChild(g);
                    _this._pages[pageIndex] = { content: svg, size: pageSize };
                    _removeChildren(viewPage);
                    viewPage.appendChild(svg);
                    _this._changePageZoom(viewPage);
                    _this._replaceActionLinks(svg);
                    if (_this.viewMode === ViewMode.Single) {
                        _this._scrollToInitialPosition();
                    }
                    promise.resolve(pageIndex + 1);
                }).catch(function (reason) {
                    loadingDiv.innerHTML = _this._getErrorMessage(reason);
                });
                return promise;
            };
            ViewerBase.prototype._replaceActionLinks = function (svg) {
                var aList = svg.querySelectorAll('a'), self = this;
                for (var i = 0; i < aList.length; i++) {
                    var a = aList.item(i);
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
                    }
                    else if (ViewerBase._customActionReg.test(url)) {
                        a.href.baseVal = '#';
                        a.setAttribute(ViewerBase._customActionAttr, url.substr(3));
                        _addEvent(a, 'click', function () {
                            self._executeCustomAction(this.getAttribute(ViewerBase._customActionAttr));
                        });
                    }
                }
            };
            ViewerBase.prototype._getPageSize = function () {
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
            };
            ViewerBase.prototype._changePageZoom = function (viewPage) {
                var self = this, zoomFactor = self.zoomFactor, g, svg;
                if (!viewPage) {
                    return;
                }
                var size = this._getPageSize();
                viewPage.style.height = size.height.valueInPixel * zoomFactor + 'px';
                viewPage.style.width = size.width.valueInPixel * zoomFactor + 'px';
                g = viewPage.querySelector('g');
                if (g) {
                    g.parentNode.setAttribute('height', size.height.valueInPixel * zoomFactor + 'px');
                    g.parentNode.setAttribute('width', size.width.valueInPixel * zoomFactor + 'px');
                    g.setAttribute('transform', 'scale(' + zoomFactor + ')');
                    // In IE, if we set the transform attribute of G element, the element in the G element maybe displayed incorrectly(144673), 
                    // to fix it, we have to redraw the svg element: remove the G element and append it to svg again.
                    if (ViewerBase._isIE) {
                        svg = g.parentNode;
                        svg.removeChild(g);
                        svg.appendChild(g);
                    }
                }
            };
            ViewerBase.prototype._renderContinuousPage = function () {
                var self = this, pageNumber = self._pageNumber, pageCount = self._documentSource.pageCount, start = pageNumber - self._preFetchPageCount, end = pageNumber + self._preFetchPageCount, promises = [];
                start = start < 1 ? 1 : start;
                end = end > pageCount ? pageCount : end;
                for (var i = start; i <= end; i++) {
                    promises.push(self._renderSinglePage(self._viewpanelWrapper.getElementsByClassName('wj-view-page').item(i - 1), i));
                }
                return new viewer_1._CompositedPromise(promises);
            };
            ViewerBase.prototype._clearKeepSerConnTimer = function () {
                if (this._keepSerConnTimer != null) {
                    clearTimeout(this._keepSerConnTimer);
                }
            };
            ViewerBase.prototype._keepServiceConnection = function () {
                var _this = this;
                this._clearKeepSerConnTimer();
                var documentSource = this._documentSource;
                if (!documentSource) {
                    return;
                }
                this._keepSerConnTimer = setTimeout(function () {
                    if (_this._documentSource !== documentSource) {
                        return;
                    }
                    _this._documentSource.getDocumentStatus().then(function (v) { return _this._keepServiceConnection(); });
                }, this._getExpiredTime());
            };
            ViewerBase.prototype._getExpiredTime = function () {
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
            };
            ViewerBase.prototype._disposeDocument = function () {
                if (this._documentSource) {
                    _removeAllWjHandlers(this._documentEventKey, this._documentSource.disposed);
                    _removeAllWjHandlers(this._documentEventKey, this._documentSource.pageCountChanged);
                    _removeAllWjHandlers(this._documentEventKey, this._documentSource.pageSettingsChanged);
                    _removeAllWjHandlers(this._documentEventKey, this._documentSource.loadCompleted);
                    _removeAllWjHandlers(this._documentEventKey, this._documentSource.queryLoadingData);
                    this._documentSource.dispose();
                }
                this._resetDocument();
            };
            ViewerBase.prototype._resetDocument = function () {
                this._pages.length = 0;
                this._addSinglePage();
                this._pageNumber = 1;
                this._historyManager.clear();
            };
            ViewerBase.prototype._setDocumentRendering = function () {
                this._documentSource._updateIsLoadCompleted(false);
            };
            ViewerBase.prototype._createViewPage = function () {
                var _this = this;
                var viewPage = document.createElement('div');
                viewPage.className = 'wj-view-page';
                _addEvent(viewPage, 'mousedown', function (e) {
                    if (_this.selectMouseMode) {
                        return;
                    }
                    _this._startPanning(e);
                });
                _addEvent(viewPage, 'dragstart', function (e) {
                    if (_this.selectMouseMode) {
                        return;
                    }
                    e.preventDefault();
                });
                return viewPage;
            };
            ViewerBase.prototype._addContinuousPage = function () {
                var self = this;
                _removeChildren(self._viewpanelWrapper);
                for (var i = 0; i < self._documentSource.pageCount; i++) {
                    var viewPage = this._createViewPage();
                    viewPage.style.height = self._documentSource.pageSettings.height.valueInPixel * self.zoomFactor + 'px';
                    viewPage.style.width = self._documentSource.pageSettings.width.valueInPixel * self.zoomFactor + 'px';
                    self._viewpanelWrapper.appendChild(viewPage);
                }
            };
            ViewerBase.prototype._addSinglePage = function () {
                var self = this;
                _removeChildren(self._viewpanelWrapper);
                var viewPage = this._createViewPage();
                self._viewpanelWrapper.appendChild(viewPage);
                return viewPage;
            };
            /**
             * Moves to the page at the specified index.
             *
             * @param index Index (1-base) of the page to move to.
             * @return An @see:wijmo.viewer.IPromise object with current page number.
             */
            ViewerBase.prototype.moveToPage = function (index) {
                return this._innerMoveToPage(index, true);
            };
            ViewerBase.prototype._innerMoveToPage = function (pageNumber, addHistory) {
                var _this = this;
                var oldNumber = this._pageNumber;
                return this._setPageNumber(pageNumber).then(function (n) {
                    if (addHistory === true && n != oldNumber) {
                        _this._addHistory({ pageIndex: n - 1, pageBounds: null });
                    }
                });
            };
            ViewerBase.prototype._moveToLastPage = function () {
                var promise = new viewer_1._Promise();
                if (!this._ensureDocumentLoadCompleted(promise)) {
                    return promise;
                }
                return this._innerMoveToPage(this._documentSource.pageCount, true);
            };
            ViewerBase.prototype._moveBackwardHistory = function () {
                if (!this._ensureDocumentLoadCompleted() || !this._historyManager.canBackward()) {
                    return;
                }
                var history = this._historyManager.backward();
                this._moveToHistory(history);
            };
            ViewerBase.prototype._moveForwardHistory = function () {
                if (!this._ensureDocumentLoadCompleted() || !this._historyManager.canForward()) {
                    return;
                }
                var history = this._historyManager.forward();
                this._moveToHistory(history);
            };
            ViewerBase.prototype._moveToHistory = function (history) {
                if (!history) {
                    return;
                }
                this.zoomFactor = history.zoomFactor;
                this._scrollToPosition(history.position);
            };
            ViewerBase.prototype._addHistory = function (position) {
                if (!position) {
                    return;
                }
                this._historyManager.add({ zoomFactor: this._zoomFactor, position: position });
            };
            ViewerBase.prototype._ensureDocumentLoadCompleted = function (promise) {
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
            };
            ViewerBase.prototype._setPageNumber = function (value) {
                var promise = new viewer_1._Promise();
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
                var renderPromise;
                switch (this.viewMode) {
                    case ViewMode.Continuous:
                        this._scrollToCurrentPage();
                        renderPromise = this._renderContinuousPage();
                        break;
                    case ViewMode.Single:
                        var viewPage = this._viewpanelWrapper.querySelector('.wj-view-page');
                        renderPromise = this._renderSinglePage(viewPage, value);
                        break;
                }
                return renderPromise.then(function (_) {
                    // The promise value is page number in single view mode, 
                    // but may be array of page numbers in continuous view mode.
                    return currentPageNumber;
                });
            };
            ViewerBase.prototype._updatePageNumber = function (value) {
                if (!this._documentSource) {
                    return;
                }
                value = Math.min(this._documentSource.pageCount, Math.max(value, 1));
                if (this._pageNumber === value) {
                    return;
                }
                this._pageNumber = value;
                this.onPageNumberChanged();
            };
            Object.defineProperty(ViewerBase.prototype, "zoomFactor", {
                /**
                 * Gets or sets the zoom factor.
                 */
                get: function () {
                    return this._zoomFactor;
                },
                set: function (value) {
                    value = Math.max(0.05, Math.min(10, value));
                    if (value === this._zoomFactor) {
                        return;
                    }
                    this._zoomFactor = value;
                    this._changeViewerZoom();
                    this.onZoomFactorChanged();
                },
                enumerable: true,
                configurable: true
            });
            ViewerBase.prototype._changeViewerZoom = function () {
                var viewPages, viewPage;
                switch (this.viewMode) {
                    case (ViewMode.Continuous):
                        viewPages = this._viewpanelWrapper.querySelectorAll('.wj-view-page');
                        for (var i = 0; i < viewPages.length; i++) {
                            this._changePageZoom(viewPages.item(i));
                        }
                        break;
                    case (ViewMode.Single):
                        viewPage = this._viewpanelWrapper.querySelector('.wj-view-page');
                        this._changePageZoom(viewPage);
                        break;
                }
            };
            Object.defineProperty(ViewerBase.prototype, "viewMode", {
                /** Gets or sets the view mode. */
                get: function () {
                    return this._viewMode;
                },
                set: function (value) {
                    if (this._viewMode === value) {
                        return;
                    }
                    this._viewMode = value;
                    this._updateViewPage();
                    this.onViewModeChanged();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewerBase.prototype, "selectMouseMode", {
                /** Gets or sets a value indicating whether clicking and dragging with the mouse selects text. */
                get: function () {
                    return this._selectMouseMode;
                },
                set: function (value) {
                    if (this._selectMouseMode === value) {
                        return;
                    }
                    this._selectMouseMode = value;
                    this.onSelectMouseModeChanged();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ViewerBase.prototype, "fullScreen", {
                /** Gets or sets whether viewer is under full screen mode. */
                get: function () {
                    return this._fullScreen;
                },
                set: function (value) {
                    if (this._fullScreen === value) {
                        return;
                    }
                    this._fullScreen = value;
                    this.onFullScreenChanged();
                },
                enumerable: true,
                configurable: true
            });
            ViewerBase.prototype._updateViewPage = function () {
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
            };
            // Raises the @see:_documentSourceChanged event.
            // @param e The event arguments.
            ViewerBase.prototype._onDocumentSourceChanged = function (e) {
                this._documentSourceChanged.raise(this, e || new wijmo.EventArgs());
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
            };
            /**
             * Raises the @see:pageNumberChanged event.
             *
             * @param e The event arguments.
             */
            ViewerBase.prototype.onPageNumberChanged = function (e) {
                this.pageNumberChanged.raise(this, e || new wijmo.EventArgs());
                this._updatePageNavActions();
            };
            /**
             * Raises the @see:viewModeChanged event.
             *
             * @param e The event arguments.
             */
            ViewerBase.prototype.onViewModeChanged = function (e) {
                this.viewModeChanged.raise(this, e || new wijmo.EventArgs());
                this._updateViewModeActions();
            };
            /**
             * Raises the @see:selectMouseModeChanged event.
             *
             * @param e The event arguments.
             */
            ViewerBase.prototype.onSelectMouseModeChanged = function (e) {
                this.selectMouseModeChanged.raise(this, e || new wijmo.EventArgs());
                this._updateAction(_ViewerAction.SelectTool);
                this._updateAction(_ViewerAction.MoveTool);
                this._updateViewContainerCursor();
            };
            /**
             * Raises the @see:fullScreenChanged event.
             *
             * @param e The event arguments.
             */
            ViewerBase.prototype.onFullScreenChanged = function (e) {
                this.fullScreenChanged.raise(this, e || new wijmo.EventArgs());
                this._updateAction(_ViewerAction.FullScreen);
                this._updateFullScreenStyle();
            };
            /**
             * Raises the @see:zoomFactorChanged event.
             *
             * @param e The event arguments.
             */
            ViewerBase.prototype.onZoomFactorChanged = function (e) {
                this.zoomFactorChanged.raise(this, e || new wijmo.EventArgs());
                this._updateAction(_ViewerAction.ZoomOut);
                this._updateAction(_ViewerAction.ZoomIn);
            };
            /**
             * Raises the @see:queryLoadingData event.
             *
             * @param e @see:QueryLoadingDataEventArgs that contains the event data.
             */
            ViewerBase.prototype.onQueryLoadingData = function (e) {
                this.queryLoadingData.raise(this, e);
            };
            ViewerBase._bookmarkAttr = 'bookmark';
            ViewerBase._isIE = !!navigator.userAgent.match(/MSIE |Trident\/|Edge\//);
            ViewerBase._bookmarkReg = /javascript\:navigate\(['|"](.*)['|"]\)/;
            ViewerBase._customActionAttr = 'customAction';
            ViewerBase._customActionReg = /^CA\:/;
            ViewerBase._viewpanelContainerMinHeight = 300;
            ViewerBase._defaultZoomValues = [{ name: wijmo.Globalize.format(0.05, 'p0'), value: 0.05 }, { name: wijmo.Globalize.format(0.25, 'p0'), value: 0.25 },
                { name: wijmo.Globalize.format(0.5, 'p0'), value: 0.5 },
                { name: wijmo.Globalize.format(0.75, 'p0'), value: 0.75 }, { name: wijmo.Globalize.format(1, 'p0'), value: 1 },
                { name: wijmo.Globalize.format(2, 'p0'), value: 2 }, { name: wijmo.Globalize.format(3, 'p0'), value: 3 }, { name: wijmo.Globalize.format(4, 'p0'), value: 4 },
                { name: wijmo.Globalize.format(8, 'p0'), value: 8 }, { name: wijmo.Globalize.format(10, 'p0'), value: 10 }];
            ViewerBase._exportNames = {
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
            ViewerBase.controlTemplate = '<div class="wj-viewer-outer wj-content">' +
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
                '<div wj-part="mini-toolbar"></div>' +
                '</div>';
            return ViewerBase;
        }(wijmo.Control));
        viewer_1.ViewerBase = ViewerBase;
        var _SideTabs = (function (_super) {
            __extends(_SideTabs, _super);
            function _SideTabs(element) {
                _super.call(this, element);
                this._idCounter = 0;
                this._tabPages = [];
                this._tabPageDic = {};
                this.tabPageActived = new wijmo.Event();
                this.tabPageVisibilityChanged = new wijmo.Event();
                this.expanded = new wijmo.Event();
                this.collapsed = new wijmo.Event();
                var tpl = this.getTemplate();
                this.applyTemplate('wj-control', tpl, {
                    _headersContainer: 'wj-headers',
                    _contentsContainer: 'wj-contents'
                });
            }
            _SideTabs.prototype.applyTemplate = function (css, tpl, parts) {
                var host = this.hostElement;
                wijmo.addClass(host, css);
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
            };
            Object.defineProperty(_SideTabs.prototype, "tabPages", {
                get: function () {
                    return this._tabPages;
                },
                enumerable: true,
                configurable: true
            });
            _SideTabs.prototype.getTabPage = function (id) {
                return this._tabPageDic[id];
            };
            _SideTabs.prototype.getFirstShownTabPage = function (except) {
                var first;
                this._tabPages.some(function (i) {
                    if (!i.isHidden && i !== except) {
                        first = i;
                        return true;
                    }
                    return false;
                });
                return first;
            };
            Object.defineProperty(_SideTabs.prototype, "visibleTabPagesCount", {
                get: function () {
                    var count = 0;
                    this._tabPages.forEach(function (tabPage) {
                        if (!tabPage.isHidden) {
                            count++;
                        }
                    });
                    return count;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SideTabs.prototype, "activedTabPage", {
                get: function () {
                    var first;
                    this._tabPages.some(function (i) {
                        if (i.isActived) {
                            first = i;
                            return true;
                        }
                        return false;
                    });
                    return first;
                },
                enumerable: true,
                configurable: true
            });
            _SideTabs.prototype.removePage = function (page) {
                var tabPage;
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
                    }
                    else {
                        this.collapse();
                    }
                }
                this._headersContainer.removeChild(tabPage.header);
                this._contentsContainer.removeChild(tabPage.outContent);
            };
            _SideTabs.prototype.addPage = function (title, svgIcon, index) {
                var _this = this;
                var id = this._getNewTabPageId(), header = document.createElement('li'), outContentHtml = '<div class="wj-tabpane">' +
                    '<div class="wj-tabtitle-wrapper"><h3 class="wj-tabtitle">' + title + '<span class="wj-close">×</span></h3></div>' +
                    '<div class="wj-tabcontent-wrapper"><div class="wj-tabcontent-inner"></div></div>' +
                    '</div>', outContent = _toDOM(outContentHtml);
                var icon = _createSvgBtn(svgIcon);
                header.appendChild(icon);
                index = index == null ? this._tabPages.length : index;
                index = Math.min(Math.max(index, 0), this._tabPages.length);
                if (index >= this._tabPages.length) {
                    this._headersContainer.appendChild(header);
                    this._contentsContainer.appendChild(outContent);
                }
                else {
                    this._headersContainer.insertBefore(header, this._tabPages[index].header);
                    this._contentsContainer.insertBefore(outContent, this._tabPages[index].outContent);
                }
                _addEvent(outContent.querySelector('.wj-close'), 'click', function () {
                    _this.collapse();
                });
                _addEvent(header.querySelector('a'), 'click,keydown', function (e) {
                    var currentTab = _this.getTabPage(id);
                    if (!currentTab) {
                        return;
                    }
                    var needExe = (e.type === 'keydown' && e.keyCode === wijmo.Key.Enter) || e.type === 'click';
                    if (!needExe) {
                        return;
                    }
                    _this.active(currentTab);
                });
                var tabPage = new _TabPage(outContent, header, id);
                if (index >= this._tabPages.length) {
                    this._tabPages.push(tabPage);
                }
                else {
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
            };
            Object.defineProperty(_SideTabs.prototype, "isCollapsed", {
                get: function () {
                    return wijmo.hasClass(this.hostElement, _SideTabs._collapsedCss);
                },
                enumerable: true,
                configurable: true
            });
            _SideTabs.prototype.hide = function (page) {
                var tabPage = typeof page === 'string' ? this.getTabPage(page) : page;
                if (!tabPage) {
                    return;
                }
                if (wijmo.hasClass(tabPage.header, _SideTabs._hiddenCss)) {
                    return;
                }
                wijmo.addClass(tabPage.header, _SideTabs._hiddenCss);
                this.onTabPageVisibilityChanged(tabPage);
                this.deactive(tabPage);
            };
            _SideTabs.prototype.show = function (page) {
                var tabPage = typeof page === 'string' ? this.getTabPage(page) : page;
                if (!tabPage) {
                    return;
                }
                if (!wijmo.hasClass(tabPage.header, _SideTabs._hiddenCss)) {
                    return;
                }
                wijmo.removeClass(tabPage.header, _SideTabs._hiddenCss);
                this.onTabPageVisibilityChanged(tabPage);
                if (!this.isCollapsed) {
                    var actived = this.activedTabPage;
                    if (!actived) {
                        this.active(tabPage);
                    }
                }
            };
            _SideTabs.prototype.deactive = function (page) {
                var tabPage = typeof page === 'string' ? this.getTabPage(page) : page;
                if (!tabPage || !tabPage.isActived) {
                    return;
                }
                wijmo.removeClass(tabPage.outContent, _SideTabs._activedCss);
                _checkImageButton(tabPage.header.querySelector('a'), false);
                var shown = this.getFirstShownTabPage(tabPage);
                if (shown) {
                    this.active(shown);
                }
                else {
                    this.collapse();
                }
            };
            _SideTabs.prototype.active = function (page) {
                var tabPage = typeof page === 'string' ? this.getTabPage(page) : page;
                if (!tabPage) {
                    return;
                }
                this.expand();
                if (tabPage.isActived) {
                    return;
                }
                this._tabPages.forEach(function (i) {
                    wijmo.removeClass(i.outContent, _SideTabs._activedCss);
                    _checkImageButton(i.header.querySelector('a'), false);
                });
                this.show(tabPage);
                wijmo.addClass(tabPage.outContent, _SideTabs._activedCss);
                _checkImageButton(tabPage.header.querySelector('a'), true);
                this.onTabPageActived();
            };
            _SideTabs.prototype.onTabPageActived = function () {
                this.tabPageActived.raise(this, new wijmo.EventArgs());
            };
            _SideTabs.prototype.onTabPageVisibilityChanged = function (tabPage) {
                this.tabPageVisibilityChanged.raise(this, { tabPage: tabPage });
            };
            _SideTabs.prototype.onExpanded = function () {
                this.expanded.raise(this, new wijmo.EventArgs());
            };
            _SideTabs.prototype.onCollapsed = function () {
                this.collapsed.raise(this, new wijmo.EventArgs());
            };
            _SideTabs.prototype.collapse = function () {
                if (this.isCollapsed) {
                    return;
                }
                wijmo.addClass(this.hostElement, _SideTabs._collapsedCss);
                this.onCollapsed();
            };
            _SideTabs.prototype.expand = function () {
                if (!this.isCollapsed) {
                    return;
                }
                wijmo.removeClass(this.hostElement, _SideTabs._collapsedCss);
                if (!this.activedTabPage) {
                    var shown = this.getFirstShownTabPage();
                    if (shown) {
                        this.active(shown);
                    }
                }
                this.onExpanded();
            };
            _SideTabs.prototype._getNewTabPageId = function () {
                while (this._tabPageDic[(this._idCounter++).toString()]) {
                }
                return this._idCounter.toString();
            };
            _SideTabs._hiddenCss = 'hidden';
            _SideTabs._activedCss = 'active';
            _SideTabs._collapsedCss = 'collapsed';
            _SideTabs.controlTemplate = '<ul class="wj-nav wj-btn-group" wj-part="wj-headers"></ul>' +
                '<div class="wj-tabcontent" wj-part="wj-contents"></div>';
            return _SideTabs;
        }(wijmo.Control));
        viewer_1._SideTabs = _SideTabs;
        var _TabPage = (function () {
            function _TabPage(outContent, header, id) {
                this._header = header;
                this._outContent = outContent;
                this._content = outContent.querySelector('.wj-tabcontent-inner');
                this._id = id;
            }
            Object.defineProperty(_TabPage.prototype, "isActived", {
                get: function () {
                    return wijmo.hasClass(this.outContent, _SideTabs._activedCss);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_TabPage.prototype, "isHidden", {
                get: function () {
                    return wijmo.hasClass(this.header, _SideTabs._hiddenCss);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_TabPage.prototype, "id", {
                get: function () {
                    return this._id;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_TabPage.prototype, "header", {
                get: function () {
                    return this._header;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_TabPage.prototype, "content", {
                get: function () {
                    return this._content;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_TabPage.prototype, "outContent", {
                get: function () {
                    return this._outContent;
                },
                enumerable: true,
                configurable: true
            });
            _TabPage.prototype.format = function (customizer) {
                customizer(this);
            };
            return _TabPage;
        }());
        viewer_1._TabPage = _TabPage;
        var _Toolbar = (function (_super) {
            __extends(_Toolbar, _super);
            function _Toolbar(element) {
                var _this = this;
                _super.call(this, element);
                this.svgButtonClicked = new wijmo.Event();
                var tpl;
                // instantiate and apply template
                tpl = this.getTemplate();
                this.applyTemplate('wj-toolbar', tpl, {
                    _toolbarWrapper: 'toolbar-wrapper',
                    _toolbarContainer: 'toolbar-container',
                    _toolbarLeft: 'toolbar-left',
                    _toolbarRight: 'toolbar-right'
                });
                _addEvent(this._toolbarLeft, 'mouseover', function () { _this._moveRight(); });
                _addEvent(this._toolbarLeft, 'mouseout', function () { _this._clearToolbarMoveTimer(); });
                _addEvent(this._toolbarRight, 'mouseover', function () { _this._moveLeft(); });
                _addEvent(this._toolbarRight, 'mouseout', function () { _this._clearToolbarMoveTimer(); });
            }
            _Toolbar.prototype.applyTemplate = function (css, tpl, parts) {
                var host = this.hostElement;
                wijmo.addClass(host, css);
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
            };
            _Toolbar.prototype._clearToolbarMoveTimer = function () {
                if (this._toolbarMoveTimer != null) {
                    clearTimeout(this._toolbarMoveTimer);
                    this._toolbarMoveTimer = null;
                }
            };
            _Toolbar.prototype._moveLeft = function () {
                var _this = this;
                var rightBtnWidth = this._toolbarRight.getBoundingClientRect().width;
                var minLeft = this._toolbarContainer.getBoundingClientRect().width - this._toolbarWrapper.getBoundingClientRect().width;
                var newLeft = this._toolbarWrapper.offsetLeft - rightBtnWidth - _Toolbar._moveStep;
                if (newLeft < minLeft)
                    return;
                this._toolbarWrapper.style.left = newLeft + 'px';
                this._toolbarMoveTimer = setTimeout(function () { return _this._moveLeft(); }, 5);
            };
            _Toolbar.prototype._moveRight = function () {
                var _this = this;
                var leftBtnWidth = this._toolbarLeft.getBoundingClientRect().width;
                var step = 2;
                var newLeft = this._toolbarWrapper.offsetLeft - leftBtnWidth + _Toolbar._moveStep;
                if (newLeft > 0)
                    return;
                this._toolbarWrapper.style.left = newLeft + 'px';
                this._toolbarMoveTimer = setTimeout(function () { return _this._moveRight(); }, 5);
            };
            _Toolbar.prototype._showToolbarMoveButton = function (show) {
                var visibility = show ? 'visible' : 'hidden';
                this._toolbarLeft.style.visibility = visibility;
                this._toolbarRight.style.visibility = visibility;
            };
            _Toolbar.prototype.resetWidth = function () {
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
            };
            _Toolbar.prototype.addSeparator = function () {
                var element = document.createElement('span');
                element.className = 'wj-separator';
                this._toolbarWrapper.appendChild(element);
                return element;
            };
            _Toolbar.prototype.onSvgButtonClicked = function (e) {
                this.svgButtonClicked.raise(this, e);
            };
            _Toolbar.prototype.addCustomItem = function (element, commandTag) {
                if (wijmo.isString(element)) {
                    element = _toDOM(element);
                }
                if (commandTag) {
                    element.setAttribute(_Toolbar.commandTagAttr, commandTag.toString());
                }
                this._toolbarWrapper.appendChild(element);
            };
            _Toolbar.prototype.addSvgButton = function (title, svgContent, commandTag, isToggle) {
                var _this = this;
                var button = _createSvgBtn(svgContent);
                button.title = title;
                button.setAttribute(_Toolbar.commandTagAttr, commandTag.toString());
                this._toolbarWrapper.appendChild(button);
                _addEvent(button, 'click,keydown', function (event) {
                    var e = event || window.event, needExe = (e.type === 'keydown' && e.keyCode === wijmo.Key.Enter) || e.type === 'click';
                    if (!needExe || _isDisabledImageButton(button) || (!isToggle && _isCheckedImageButton(button))) {
                        return;
                    }
                    _this.onSvgButtonClicked({ commandTag: commandTag });
                });
                return button;
            };
            _Toolbar._initToolbarPageNumberInput = function (hostToolbar, viewer) {
                var toolbar = wijmo.Control.getControl(hostToolbar), pageNumberDiv = document.createElement('div'), pageCountSpan = document.createElement('span'), pageNumberInput, updatePageNumber = function () {
                    var documentSource = viewer._getDocumentSource();
                    if (!documentSource || documentSource.pageCount == null) {
                        return;
                    }
                    pageNumberInput.value = viewer._pageNumber;
                }, updatePageCount = function () {
                    var documentSource = viewer._getDocumentSource();
                    if (!documentSource || documentSource.pageCount == null) {
                        return;
                    }
                    pageCountSpan.innerHTML = documentSource.pageCount.toString();
                    pageNumberInput.max = documentSource.pageCount;
                    pageNumberInput.min = Math.min(documentSource.pageCount, 1);
                    updatePageNumber();
                }, sourceChanged = function () {
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
                _addEvent(pageNumberDiv, 'keyup', function (e) {
                    var event = e || window.event;
                    if (event.keyCode === wijmo.Key.Enter) {
                        viewer.moveToPage(pageNumberInput.value);
                    }
                });
                toolbar.addCustomItem('<span class="slash">/</span>');
                pageCountSpan.className = 'wj-pagecount';
                toolbar.addCustomItem(pageCountSpan, _ViewerAction.PageCount);
                viewer.pageNumberChanged.addHandler(function () {
                    updatePageNumber();
                });
                if (viewer._getDocumentSource()) {
                    sourceChanged();
                }
                viewer._documentSourceChanged.addHandler(function () { sourceChanged(); });
            };
            _Toolbar._checkSeparatorShown = function (toolbar) {
                var toolbarWrapper = toolbar._toolbarWrapper, groupEnd, hideSeparator = true, currentEle, currentEleHidden, lastShowSeparator;
                for (var i = 0; i < toolbarWrapper.children.length; i++) {
                    currentEle = toolbarWrapper.children[i];
                    groupEnd = wijmo.hasClass(currentEle, 'wj-separator');
                    currentEleHidden = wijmo.hasClass(currentEle, _hiddenCss);
                    if (!groupEnd && !currentEleHidden) {
                        hideSeparator = false;
                        continue;
                    }
                    if (groupEnd) {
                        if (hideSeparator) {
                            if (!currentEleHidden) {
                                wijmo.addClass(currentEle, _hiddenCss);
                            }
                        }
                        else {
                            if (currentEleHidden) {
                                wijmo.removeClass(currentEle, _hiddenCss);
                            }
                            lastShowSeparator = currentEle;
                        }
                        //reset
                        hideSeparator = true;
                    }
                }
                //hide separator if all items after this separator are hidden.
                if (hideSeparator && lastShowSeparator) {
                    wijmo.addClass(lastShowSeparator, 'hidden');
                }
            };
            _Toolbar._moveStep = 2;
            _Toolbar.commandTagAttr = 'command-Tag';
            _Toolbar.controlTemplate = '<div class="wj-toolbar-move left" wj-part="toolbar-left"><span class="wj-glyph-left"></span></div>' +
                '<div class="wj-toolbarcontainer" wj-part="toolbar-container">' +
                '<div class="wj-toolbarwrapper wj-btn-group" wj-part="toolbar-wrapper">' +
                '</div>' +
                '</div>' +
                '<div class="wj-toolbar-move right" wj-part="toolbar-right"><span class="wj-glyph-right"></span></div>';
            return _Toolbar;
        }(wijmo.Control));
        viewer_1._Toolbar = _Toolbar;
        var _ViewerToolbar = (function (_super) {
            __extends(_ViewerToolbar, _super);
            function _ViewerToolbar(element, viewer) {
                var _this = this;
                _super.call(this, element);
                this._viewer = viewer;
                this._initToolbarItems();
                this.svgButtonClicked.addHandler(function (sender, e) {
                    _this._viewer._executeAction(parseInt(e.commandTag));
                });
                var update = function () { return _this.isDisabled = !_this._viewer._getDocumentSource(); };
                this._viewer._documentSourceChanged.addHandler(update);
                update();
                this._viewer._viewerActionStatusChanged.addHandler(function (sender, e) {
                    var actionElement = _this.hostElement.querySelector('[command-tag="' + e.action.toString() + '"]');
                    _checkImageButton(actionElement, e.checked);
                    _disableImageButton(actionElement, e.disabled);
                    _showImageButton(actionElement, e.shown);
                    _Toolbar._checkSeparatorShown(_this);
                });
            }
            _ViewerToolbar.prototype._initToolbarItems = function () {
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
            };
            _ViewerToolbar.prototype._initToolbarZoomValue = function (hostToolbar) {
                var _this = this;
                var toolbar = wijmo.Control.getControl(hostToolbar), zoomDiv = document.createElement('div'), zoomValueCombo, temp, i, j, zoomValues = ViewerBase._defaultZoomValues;
                zoomDiv.className = 'wj-input-zoom';
                toolbar.addCustomItem(zoomDiv, _ViewerAction.ZoomValue);
                zoomValueCombo = new wijmo.input.ComboBox(zoomDiv);
                zoomValueCombo.deferUpdate(function () {
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
                zoomValueCombo.selectedIndexChanged.addHandler(function () {
                    if (zoomValueCombo.isDroppedDown) {
                        var zoomFactor = zoomValueCombo.selectedValue;
                        if (zoomFactor == null) {
                            var zoomFactorText = zoomValueCombo.text.replace(",", "");
                            zoomFactor = parseFloat(zoomFactorText);
                            if (isNaN(zoomFactor)) {
                                zoomFactor = 100;
                            }
                            zoomFactor = zoomFactor * 0.01;
                        }
                        _this._viewer.zoomFactor = zoomFactor;
                    }
                });
                _addEvent(zoomDiv, 'keypress', function (e) {
                    var event = e || window.event, zoomText = zoomValueCombo.text, zoomFactor;
                    if (event.keyCode === wijmo.Key.Enter) {
                        if (zoomText.lastIndexOf('%') === zoomText.length - 1) {
                            zoomText = zoomText.substring(0, zoomValueCombo.text.length - 1);
                        }
                        zoomText = zoomText.replace(",", "");
                        zoomFactor = parseFloat(zoomText);
                        if (!isNaN(zoomFactor)) {
                            _this._viewer.zoomFactor = zoomFactor * 0.01;
                        }
                        else {
                            zoomValueCombo.text = wijmo.Globalize.format(_this._viewer.zoomFactor, 'p0');
                        }
                    }
                });
                _addEvent(zoomDiv.querySelector('.wj-form-control'), 'blur', function (e) {
                    zoomValueCombo.text = wijmo.Globalize.format(_this._viewer.zoomFactor, 'p0');
                });
                this._viewer.zoomFactorChanged.addHandler(function () {
                    zoomValueCombo.isDroppedDown = false;
                    zoomValueCombo.text = wijmo.Globalize.format(_this._viewer.zoomFactor, 'p0');
                });
            };
            return _ViewerToolbar;
        }(_Toolbar));
        viewer_1._ViewerToolbar = _ViewerToolbar;
        var _ViewerMiniToolbar = (function (_super) {
            __extends(_ViewerMiniToolbar, _super);
            function _ViewerMiniToolbar(element, viewer) {
                var _this = this;
                _super.call(this, element);
                this._viewer = viewer;
                this._initToolbarItems();
                this.svgButtonClicked.addHandler(function (sender, e) {
                    _this._viewer._executeAction(parseInt(e.commandTag));
                });
                var update = function () { return _this.isDisabled = !_this._viewer._getDocumentSource(); };
                this._viewer._documentSourceChanged.addHandler(update);
                update();
                this._viewer._viewerActionStatusChanged.addHandler(function (sender, e) {
                    var actionElement = _this.hostElement.querySelector('[command-tag="' + e.action.toString() + '"]');
                    _checkImageButton(actionElement, e.checked);
                    _disableImageButton(actionElement, e.disabled);
                    _showImageButton(actionElement, e.shown);
                    _Toolbar._checkSeparatorShown(_this);
                });
            }
            _ViewerMiniToolbar.prototype._initToolbarItems = function () {
                this.addSvgButton(wijmo.culture.Viewer.print, icons.print, _ViewerAction.Print);
                this.addSeparator();
                this.addSvgButton(wijmo.culture.Viewer.previousPage, icons.previousPage, _ViewerAction.PrePage);
                this.addSvgButton(wijmo.culture.Viewer.nextPage, icons.nextPage, _ViewerAction.NextPage);
                _Toolbar._initToolbarPageNumberInput(this.hostElement, this._viewer);
                this.addSeparator();
                this.addSvgButton(wijmo.culture.Viewer.zoomOut, icons.zoomOut, _ViewerAction.ZoomOut);
                this.addSvgButton(wijmo.culture.Viewer.zoomIn, icons.zoomIn, _ViewerAction.ZoomIn);
                this.addSvgButton(wijmo.culture.Viewer.exitFullScreen, icons.exitFullScreen, _ViewerAction.ExitFullScreen);
            };
            return _ViewerMiniToolbar;
        }(_Toolbar));
        viewer_1._ViewerMiniToolbar = _ViewerMiniToolbar;
        function _createSvgBtn(svgContent) {
            var svg = _toDOM(_svgStart + svgContent + _svgEnd);
            wijmo.addClass(svg, 'wj-svg-btn');
            var btn = document.createElement('a');
            btn.appendChild(svg);
            wijmo.addClass(btn, 'wj-btn');
            btn.tabIndex = 0;
            return btn;
        }
        viewer_1._createSvgBtn = _createSvgBtn;
        var _PageSetupDialog = (function (_super) {
            __extends(_PageSetupDialog, _super);
            function _PageSetupDialog(ele) {
                _super.call(this, ele);
                this._uiUpdating = false;
                this.applied = new wijmo.Event();
                // check dependencies
                var depErr = 'Missing dependency: _PageSetupDialog requires ';
                wijmo.assert(wijmo.input.ComboBox != null, depErr + 'wijmo.input.');
                var tpl;
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
                    itemsSource: _enumToArray(viewer_1._PaperKind),
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
            _PageSetupDialog.prototype._addEvents = function () {
                var self = this;
                _addEvent(self._btnClose, 'click', function () {
                    self.hide();
                });
                _addEvent(self._btnCancel, 'click', function () {
                    self.hide();
                });
                _addEvent(self._btnApply, 'click', function () {
                    self._apply();
                    self.hide();
                });
            };
            _PageSetupDialog.prototype._apply = function () {
                this.onApplied();
            };
            _PageSetupDialog.prototype._updateValue = function () {
                if (this._uiUpdating) {
                    return;
                }
                var pageSettings = this.pageSettings;
                if (pageSettings) {
                    pageSettings.bottomMargin = new viewer_1._Unit(this._numMarginsBottom.value, viewer_1._UnitType.Inch);
                    pageSettings.leftMargin = new viewer_1._Unit(this._numMarginsLeft.value, viewer_1._UnitType.Inch);
                    pageSettings.rightMargin = new viewer_1._Unit(this._numMarginsRight.value, viewer_1._UnitType.Inch);
                    pageSettings.topMargin = new viewer_1._Unit(this._numMarginsTop.value, viewer_1._UnitType.Inch);
                    pageSettings.paperSize = this._cmbPaperKind.selectedValue;
                    _setLandscape(pageSettings, this._cmbOrientation.text === wijmo.culture.Viewer.landscape);
                    this._updateUI();
                }
            };
            _PageSetupDialog.prototype.onApplied = function () {
                this.applied.raise(this, new wijmo.EventArgs);
            };
            _PageSetupDialog.prototype.onShowing = function (e) {
                this._updateUI();
                return _super.prototype.onShowing.call(this, e);
            };
            _PageSetupDialog.prototype._updateUI = function () {
                this._uiUpdating = true;
                var pageSettings = this.pageSettings, setMargin = function (input, unit) {
                    input.value = viewer_1._Unit.convertValue(unit.value, unit.units, viewer_1._UnitType.Inch);
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
            };
            _PageSetupDialog.prototype.onShown = function (e) {
                this._cmbPaperKind.focus();
                _super.prototype.onShown.call(this, e);
            };
            _PageSetupDialog.prototype.showWithValue = function (pageSettings) {
                var value = _clonePageSettings(pageSettings);
                this.pageSettings = value;
                _super.prototype.show.call(this);
            };
            _PageSetupDialog.controlTemplate = '<div>' +
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
            return _PageSetupDialog;
        }(wijmo.input.Popup));
        viewer_1._PageSetupDialog = _PageSetupDialog;
        function _setLandscape(pageSettings, landscape) {
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
            }
            else {
                pageSettings.leftMargin = pageSettings.topMargin;
                pageSettings.topMargin = pageSettings.rightMargin;
                pageSettings.rightMargin = pageSettings.bottomMargin;
                pageSettings.bottomMargin = left;
            }
        }
        viewer_1._setLandscape = _setLandscape;
        function _clonePageSettings(src) {
            if (!src) {
                return null;
            }
            var result = {};
            result.height = src.height ? new viewer_1._Unit(src.height) : null;
            result.width = src.width ? new viewer_1._Unit(src.width) : null;
            result.bottomMargin = src.bottomMargin ? new viewer_1._Unit(src.bottomMargin) : null;
            result.leftMargin = src.leftMargin ? new viewer_1._Unit(src.leftMargin) : null;
            result.rightMargin = src.rightMargin ? new viewer_1._Unit(src.rightMargin) : null;
            result.topMargin = src.topMargin ? new viewer_1._Unit(src.topMargin) : null;
            result.landscape = src.landscape;
            result.paperSize = src.paperSize;
            return result;
        }
        viewer_1._clonePageSettings = _clonePageSettings;
        function _enumToArray(enumType) {
            var items = [];
            for (var i in enumType) {
                if (!i || !i.length || i[0] == "_" || isNaN(parseInt(i)))
                    continue;
                items.push({ text: enumType[i], value: i });
            }
            return items;
        }
        viewer_1._enumToArray = _enumToArray;
        function _removeChildren(node, condition) {
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
        viewer_1._removeChildren = _removeChildren;
        function _toDOMs(html) {
            var node, container = document.createElement("div"), f = document.createDocumentFragment();
            container.innerHTML = html;
            while (node = container.firstChild)
                f.appendChild(node);
            return f;
        }
        viewer_1._toDOMs = _toDOMs;
        function _toDOM(html) {
            return _toDOMs(html).firstChild;
        }
        viewer_1._toDOM = _toDOM;
        function _addEvent(elm, evType, fn, useCapture) {
            var types = evType.split(","), type;
            for (var i = 0; i < types.length; i++) {
                type = types[i].trim();
                if (elm.addEventListener) {
                    elm.addEventListener(type, fn, useCapture);
                }
                else if (elm.attachEvent) {
                    elm.attachEvent('on' + type, fn);
                }
                else {
                    elm['on' + type] = fn;
                }
            }
        }
        viewer_1._addEvent = _addEvent;
        var _checkedCss = 'wj-state-active', _disabledCss = 'wj-state-disabled', _hiddenCss = 'hidden';
        function _checkImageButton(button, checked) {
            if (checked) {
                wijmo.addClass(button, _checkedCss);
                return;
            }
            wijmo.removeClass(button, _checkedCss);
        }
        viewer_1._checkImageButton = _checkImageButton;
        function _disableImageButton(button, disabled) {
            if (disabled) {
                wijmo.addClass(button, _disabledCss);
                return;
            }
            wijmo.removeClass(button, _disabledCss);
        }
        viewer_1._disableImageButton = _disableImageButton;
        function _showImageButton(button, visible) {
            if (visible) {
                wijmo.removeClass(button, _hiddenCss);
                return;
            }
            wijmo.addClass(button, _hiddenCss);
        }
        viewer_1._showImageButton = _showImageButton;
        function _isDisabledImageButton(button) {
            return wijmo.hasClass(button, _disabledCss);
        }
        viewer_1._isDisabledImageButton = _isDisabledImageButton;
        function _isCheckedImageButton(button) {
            return wijmo.hasClass(button, _checkedCss);
        }
        viewer_1._isCheckedImageButton = _isCheckedImageButton;
        var wjEventsName = '__wjEvents';
        function _addWjHandler(key, event, func, self) {
            if (key) {
                var handlersDic = event[wjEventsName];
                if (!handlersDic) {
                    handlersDic = event[wjEventsName] = {};
                }
                var handlers = handlersDic[key];
                if (!handlers) {
                    handlers = handlersDic[key] = [];
                }
                handlers.push(func);
            }
            event.addHandler(func, self);
        }
        viewer_1._addWjHandler = _addWjHandler;
        function _removeAllWjHandlers(key, event) {
            if (!key) {
                return;
            }
            var handlersDic = event[wjEventsName];
            if (!handlersDic) {
                return;
            }
            var handlers = handlersDic[key];
            if (!handlers) {
                return;
            }
            handlers.forEach(function (h) { return event.removeHandler(h); });
        }
        viewer_1._removeAllWjHandlers = _removeAllWjHandlers;
        (function (_ViewerAction) {
            _ViewerAction[_ViewerAction["Paginated"] = 0] = "Paginated";
            _ViewerAction[_ViewerAction["Print"] = 1] = "Print";
            _ViewerAction[_ViewerAction["Exports"] = 2] = "Exports";
            _ViewerAction[_ViewerAction["Portrat"] = 3] = "Portrat";
            _ViewerAction[_ViewerAction["Landscape"] = 4] = "Landscape";
            _ViewerAction[_ViewerAction["PageSetup"] = 5] = "PageSetup";
            _ViewerAction[_ViewerAction["FirstPage"] = 6] = "FirstPage";
            _ViewerAction[_ViewerAction["PrePage"] = 7] = "PrePage";
            _ViewerAction[_ViewerAction["NextPage"] = 8] = "NextPage";
            _ViewerAction[_ViewerAction["LastPage"] = 9] = "LastPage";
            _ViewerAction[_ViewerAction["PageNumber"] = 10] = "PageNumber";
            _ViewerAction[_ViewerAction["PageCount"] = 11] = "PageCount";
            _ViewerAction[_ViewerAction["Backward"] = 12] = "Backward";
            _ViewerAction[_ViewerAction["Forward"] = 13] = "Forward";
            _ViewerAction[_ViewerAction["SelectTool"] = 14] = "SelectTool";
            _ViewerAction[_ViewerAction["MoveTool"] = 15] = "MoveTool";
            _ViewerAction[_ViewerAction["Continuous"] = 16] = "Continuous";
            _ViewerAction[_ViewerAction["Single"] = 17] = "Single";
            _ViewerAction[_ViewerAction["ZoomOut"] = 18] = "ZoomOut";
            _ViewerAction[_ViewerAction["ZoomIn"] = 19] = "ZoomIn";
            _ViewerAction[_ViewerAction["ZoomValue"] = 20] = "ZoomValue";
            _ViewerAction[_ViewerAction["FitWholePage"] = 21] = "FitWholePage";
            _ViewerAction[_ViewerAction["FitPageWidth"] = 22] = "FitPageWidth";
            _ViewerAction[_ViewerAction["FullScreen"] = 23] = "FullScreen";
            _ViewerAction[_ViewerAction["ExitFullScreen"] = 24] = "ExitFullScreen";
        })(viewer_1._ViewerAction || (viewer_1._ViewerAction = {}));
        var _ViewerAction = viewer_1._ViewerAction;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ViewerBase.js.map