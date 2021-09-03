var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
* Defines the @see:PdfDocument class and associated classes.
*/
var wijmo;
(function (wijmo) {
    var pdf;
    (function (pdf) {
        'use strict';
        /**
        * Represents a PDF document object, based on <a href="https://github.com/devongovett/pdfkit">PDFKit</a> JavaScript library.
        */
        var PdfDocument = (function (_super) {
            __extends(PdfDocument, _super);
            /**
            * Initializes a new instance of the @see:PdfDocument class.
            *
            * @param options An optional object containing initialization settings.
            */
            function PdfDocument(options) {
                var _this = this;
                _super.call(this);
                this._docInitialized = false;
                this._compress = true;
                this._bufferPages = true; // must be true to render headers and footers
                this._chunks = [];
                this._pageIndex = -1;
                // stores pens and brushes between the save\ restore roundtrip.
                this._graphicsStack = [];
                // represents an actual stroking (pen) and filling (brush) properties for every page.
                this._currentGS = {};
                /**
                * Gets or sets the document information, such as author name, document's creation
                * date and so on.
                */
                this.info = {
                    // keep wijmo.copy happy
                    author: undefined,
                    creationDate: undefined,
                    keywords: undefined,
                    modDate: undefined,
                    subject: undefined,
                    title: undefined
                };
                /**
                * Gets an object that represents the default page settings for the pages added
                * automatically and for the @see:addPage method.
                */
                this.pageSettings = {
                    layout: pdf.PdfPageOrientation.Portrait,
                    size: pdf.PdfPageSize.Letter,
                    margins: {
                        top: 72,
                        left: 72,
                        bottom: 72,
                        right: 72
                    },
                    _copy: function (key, value) {
                        if (key === 'size') {
                            this.size = value;
                            return true;
                        }
                    }
                };
                //#endregion
                //#region public events
                /**
                * Occurs when the document has been rendered.
                */
                this.ended = new wijmo.Event();
                /**
                * Occurs when a new page is added to the document.
                */
                this.pageAdded = new wijmo.Event();
                //#endregion
                //#region internal
                this._runtimeProperties = ['pageIndex', 'x', 'y']; // this read-write properties can be accessed in run-time only.
                wijmo.copy(this, options);
                var pre = function (doc) {
                    _this._doc = doc;
                    _this._fontReg = new pdf._PdfFontRegistrar(_this._doc);
                }, post = function () {
                    _this.setPen(_this._currentGS[_this._pageIndex].pen);
                    _this.setBrush(_this._currentGS[_this._pageIndex].brush);
                    _this._curFont = pdf.PdfFont._DEF_PDFKIT_FONT;
                    _this.setFont(new pdf.PdfFont()); // change to times-10
                }, autoPage = false, pdfKitOptions = {
                    compress: this._compress,
                    bufferPages: this._bufferPages,
                    pageAdding: this._ehOnPageAdding = function (doc, options) {
                        if (!_this._docInitialized) {
                            autoPage = true;
                            pre(doc);
                        }
                        _this._onPageAdding(doc, options);
                    },
                    pageAdded: this._ehOnPageAdded = function (doc) {
                        // we need to reset current pen\ brush to reflect the actual page's stroking\ filling properties beacause each new page has an empty graphics state.
                        var brush = _this._isDrawingText()
                            ? _this._currentGS[_this._pageIndex].brush // leave current brush because PDFKit spreads fill color between pages in case of page breaks when drawing text.
                            : new pdf.PdfSolidBrush();
                        _this._currentGS[++_this._pageIndex] = {
                            pen: new pdf.PdfPen(),
                            brush: brush
                        };
                        if (!_this._docInitialized) {
                            post();
                        }
                        _this._onPageAdded(doc);
                    }
                };
                this._doc = new PDFDocument(pdfKitOptions);
                if (!autoPage) {
                    pre(this._doc);
                    post();
                }
                this._doc
                    .on('data', this._ehOnDocData = function (chunk) { _this._onDocData(chunk); })
                    .on('ending', this._ehOnDocEnding = function () { _this._onDocEnding(); })
                    .on('end', this._ehOnDocEnded = function () { _this._onDocEnded(); });
                this._docInitialized = true;
            }
            Object.defineProperty(PdfDocument.prototype, "compress", {
                //#region public properties
                /**
                * Gets a value that indicates whether the document compression is enabled.
                * This property can be assigned using the @see:PdfDocument constructor only.
                *
                * The default value is true.
                */
                get: function () {
                    return this._compress;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PdfDocument.prototype, "bufferPages", {
                /**
                * Gets a value that indicates whether the pages buffering mode is enabled which means
                * that the document's pages can be iterated over using @see:pageIndex and @see:bufferedPageRange.
                *
                * This property can be assigned using the @see:PdfDocument constructor only.
                * This property can be set to false only if both @see:header and @see:footer are invisible.
                *
                * The default value is true.
                */
                get: function () {
                    return this._bufferPages;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PdfDocument.prototype, "header", {
                /**
                * Gets an object that represents a header, the page area positioned right below
                * the top margin.
                */
                get: function () {
                    var _this = this;
                    if (!this._header) {
                        this._header = new pdf.PdfRunningTitle({
                            _heightChanged: function () {
                                if (_this._docInitialized) {
                                    _this._resetAreasOffset(_this._document);
                                }
                            }
                        });
                    }
                    return this._header;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PdfDocument.prototype, "footer", {
                /**
                * Gets an object that represents a footer, the page area positioned right above
                * the bottom margin.
                */
                get: function () {
                    var _this = this;
                    if (!this._footer) {
                        this._footer = new pdf.PdfRunningTitle({
                            _heightChanged: function () {
                                if (_this._docInitialized) {
                                    _this._resetAreasOffset(_this._document);
                                }
                            }
                        });
                    }
                    return this._footer;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PdfDocument.prototype, "pageIndex", {
                /**
                * Gets or sets the index of the current page within the buffered pages range.
                *
                * Use the @see:bufferedPageRange method to get the range of buffered pages.
                */
                get: function () {
                    return this._pageIndex;
                },
                set: function (value) {
                    value = wijmo.asNumber(value, false, true);
                    if (this._pageIndex !== value) {
                        this._doc.switchToPage(value); // an exception will be thrown internally if page is not buffered.
                        this._pageIndex = value;
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
            * Raises the @see:end event.
            *
            * @param args A @see:PdfDocumentEndedEventArgs object that contains the event data.
            */
            PdfDocument.prototype.onEnded = function (args) {
                if (this.ended) {
                    this.ended.raise(this, args);
                }
            };
            /**
            * Raises the @see:pageAdded event.
            *
            * @param args A @see:EventArgs object that contains the event data.
            */
            PdfDocument.prototype.onPageAdded = function (args) {
                if (this.pageAdded) {
                    this.pageAdded.raise(this, args);
                }
            };
            //#endregion
            //#region public methods
            /**
             * Disposes the document.
             */
            PdfDocument.prototype.dispose = function () {
                if (this._doc) {
                    this._doc
                        .removeEventListener('data', this._ehOnDocData)
                        .removeEventListener('ending', this._ehOnDocEnding)
                        .removeEventListener('end', this._ehOnDocEnded)
                        .removeEventListener('pageAdding', this._ehOnPageAdding)
                        .removeEventListener('pageAdded', this._ehOnPageAdded);
                    this._doc = null;
                    this._chunks = null;
                }
            };
            Object.defineProperty(PdfDocument.prototype, "currentPageSettings", {
                /**
                * Gets an object that represents the current page settings (read-only).
                *
                * @return A @see:IPdfPageSettings object that represents the current page settings.
                */
                get: function () {
                    var page = this._doc.page;
                    return {
                        layout: page.layout === 'landscape'
                            ? pdf.PdfPageOrientation.Landscape
                            : pdf.PdfPageOrientation.Portrait,
                        size: wijmo.isArray(page.size)
                            ? new wijmo.Size(page.size[0], page.size[1])
                            : pdf.PdfPageSize[page.size.match(/\d+/) ? page.size : pdf._toTitleCase(page.size)],
                        margins: {
                            left: page.margins.left,
                            right: page.margins.right,
                            top: page.margins.top - this.header.height,
                            bottom: page.margins.bottom - this.footer.height
                        }
                    };
                },
                enumerable: true,
                configurable: true
            });
            /**
            * Adds a new page with the given settings.
            *
            * If the settings parameter is omitted, then @see:pageSettings will be used instead.
            *
            * @param settings Page settings.
            * @return The @see:PdfDocument object.
            */
            PdfDocument.prototype.addPage = function (settings) {
                var native = this._pageSettingsToNative(settings || this.pageSettings);
                this._doc.addPage(native);
                return this;
            };
            /**
            * Gets the range of buffered pages.
            * @return A @see:IPdfBufferedPageRange object that represents the range of buffered pages.
            */
            PdfDocument.prototype.bufferedPageRange = function () {
                return this._doc.bufferedPageRange();
            };
            /**
             * Finishes the document rendering.
             */
            PdfDocument.prototype.end = function () {
                this._doc.end();
            };
            /**
            * Sets the default document brush.
            * This brush will be used by the @see:PdfPaths.fill, @see:PdfPaths.fillAndStroke and
            * @see:drawText methods, if no specific brush is provided.
            *
            * The brushOrColor argument can accept the following values:
            * <ul>
            *   <li>A @see:PdfBrush object.</li>
            *   <li>
            *     A @see:wijmo.Color object or any string acceptable by the @see:wijmo.Color.fromString method.
            *     In this case, the @see:PdfBrush object with the specified color will be created internally.
            *    </li>
            * </ul>
            *
            * @param brushOrColor The brush or color to use.
            * @return The @see:PdfDocument object.
            */
            PdfDocument.prototype.setBrush = function (brushOrColor) {
                this._assertAreasPathStarted();
                this._setCurBrush(this._defBrush = pdf._asPdfBrush(brushOrColor, false).clone());
                return this;
            };
            /**
            * Sets the default document pen.
            * This pen will be used by the @see:PdfPaths.stroke, @see:PdfPaths.fillAndStroke
            * and @see:drawText methods, if no specific pen is provided.
            *
            * The penOrColor argument can accept the following values:
            * <ul>
            *   <li>A @see:PdfPen object.</li>
            *   <li>
            *     A @see:wijmo.Color object or any string acceptable by the @see:wijmo.Color.fromString method.
            *     In this case, the @see:PdfPen object with the specified color will be created internally.
            *   </li>
            * </ul>
            *
            * @param penOrColor The pen or color to use.
            * @return The @see:PdfDocument object.
            */
            PdfDocument.prototype.setPen = function (penOrColor) {
                this._assertAreasPathStarted();
                this._setCurPen(this._defPen = pdf._asPdfPen(penOrColor, false).clone());
                return this;
            };
            /**
            * Sets the document font.
            *
            * If exact font with given style and weight properties is not found then,
            * <ul>
            *   <li>
            *     It tries to search the closest font using
            *     <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight">font weight fallback</a>.
            *   </li>
            *   <li>
            *     If still nothing is found, it tries to find the closest font with other style in following order:
            *     <ul>
            *       <li><b>'italic'</b>: 'oblique', 'normal'.</li>
            *       <li><b>'oblique'</b>: 'italic', 'normal'.</li>
            *       <li><b>'normal'</b>: 'oblique', 'italic'.</li>
            *     </ul>
            *   </li>
            * </ul>
            *
            * @param font The font object to set.
            *
            * @return The @see:PdfDocument object.
            */
            PdfDocument.prototype.setFont = function (font) {
                this._setCurFont(this._defFont = pdf._asPdfFont(font, false).clone());
                return this;
            };
            /**
            * Registers a font from a source and associates it with a given font family name
            * and font attributes.
            *
            * @param font The font to register.
            *
            * @return The @see:PdfDocument object.
            */
            PdfDocument.prototype.registerFont = function (font) {
                wijmo.assert(!!font, pdf._Errors.ValueCannotBeEmpty('font'));
                var buffer;
                if (wijmo.isString(font.source)) {
                    var xhrError;
                    buffer = pdf._XhrHelper.arrayBuffer(font.source, function (xhr) { return xhrError = xhr.statusText; });
                    wijmo.assert(xhrError == null, xhrError);
                }
                else {
                    if (font.source instanceof ArrayBuffer) {
                        buffer = font.source;
                    }
                    else {
                        wijmo.assert(false, pdf._Errors.FontSourceMustBeStringArrayBuffer);
                    }
                }
                font = pdf._shallowCopy(font);
                font.source = buffer;
                var uid = this._fontReg.registerFont(font);
                return this;
            };
            /**
            * Registers a font from a URL asynchronously and associates it with a given font
            * family name and font attributes.
            *
            * The callback function takes a @see:IPdfFontFile object as a parameter.
            *
            * @param font The font to register.
            * @param callback A callback function which will be called, when the font has been
            * registered.
            */
            PdfDocument.prototype.registerFontAsync = function (font, callback) {
                var _this = this;
                wijmo.assert(typeof (font.source) === 'string', pdf._Errors.FontSourceMustBeString);
                wijmo.asFunction(callback, false);
                pdf._XhrHelper.arrayBufferAsync(font.source, function (xhr, buffer) {
                    var fnt = pdf._shallowCopy(font);
                    fnt.source = buffer;
                    var uid = _this._fontReg.registerFont(fnt);
                    callback(font);
                });
            };
            /**
            * Saves the state of the graphic context (including current pen, brush and
            * transformation state) and pushes it onto stack.
            *
            * @return The @see:PdfDocument object.
            */
            PdfDocument.prototype.saveState = function () {
                this._assertAreasPathStarted();
                this._graphicsStack.push(this._currentGS[this._pageIndex].pen.clone(), this._defPen.clone(), this._currentGS[this._pageIndex].brush.clone(), this._defBrush.clone());
                this._pdfdoc._document.save();
                return this;
            };
            /**
            * Restores the state from the stack and applies it to the graphic context.
            *
            * @return The @see:PdfDocument object.
            */
            PdfDocument.prototype.restoreState = function () {
                this._assertAreasPathStarted();
                if (this._graphicsStack.length) {
                    this._defBrush = this._graphicsStack.pop();
                    this._currentGS[this._pageIndex].brush = this._graphicsStack.pop();
                    this._defPen = this._graphicsStack.pop();
                    this._currentGS[this._pageIndex].pen = this._graphicsStack.pop();
                }
                this._pdfdoc._document.restore();
                return this;
            };
            PdfDocument.prototype._copy = function (key, value) {
                if (key === 'compress') {
                    this._compress = wijmo.asBoolean(value);
                    return true;
                }
                if (key === 'bufferPages') {
                    this._bufferPages = wijmo.asBoolean(value);
                    return true;
                }
                if (this._runtimeProperties.indexOf(key) >= 0) {
                    return true;
                }
                return false;
            };
            Object.defineProperty(PdfDocument.prototype, "_document", {
                get: function () {
                    return this._doc;
                },
                enumerable: true,
                configurable: true
            });
            PdfDocument.prototype._switchTextFlowCtx = function (state) {
                this._doc.x = state.xo;
                this._doc.y = state.yo;
                this._doc.lineGap(state.lineGap);
            };
            PdfDocument.prototype._getTextFlowCtxState = function () {
                return {
                    xo: this._doc.x,
                    yo: this._doc.y,
                    lineGap: this._doc.currentLineGap()
                };
            };
            PdfDocument.prototype._toggleBrush = function (brush) {
                if (brush) {
                    this._setCurBrush(brush);
                }
                else {
                    this._setCurBrush(this._defBrush);
                }
            };
            PdfDocument.prototype._togglePen = function (pen) {
                if (pen) {
                    this._setCurPen(pen);
                }
                else {
                    this._setCurPen(this._defPen);
                }
            };
            PdfDocument.prototype._toggleFont = function (font) {
                if (font) {
                    this._setCurFont(font);
                }
                else {
                    this._setCurFont(this._defFont);
                }
            };
            //#endregion
            //#region private event handlers
            PdfDocument.prototype._onDocData = function (chunk) {
                this._chunks.push(chunk);
            };
            PdfDocument.prototype._onDocEnding = function () {
                this._processHeadersFooters();
                // setup document info
                if (this.info) {
                    var v;
                    if (v = this.info.author) {
                        this._doc.info.Author = v;
                    }
                    if (v = this.info.creationDate) {
                        this._doc.info.CreationDate = v;
                    }
                    if (v = this.info.keywords) {
                        this._doc.info.Keywords = v;
                    }
                    if (v = this.info.modDate) {
                        this._doc.info.ModDate = v;
                    }
                    if (v = this.info.subject) {
                        this._doc.info.Subject = v;
                    }
                    if (v = this.info.title) {
                        this._doc.info.Title = v;
                    }
                }
            };
            PdfDocument.prototype._onDocEnded = function () {
                if (pdf._IE) {
                    for (var i = 0; i < this._chunks.length; i++) {
                        this._chunks[i] = this._chunks[i].toArrayBuffer();
                    }
                }
                var blob = new Blob(this._chunks, { type: 'application/pdf' });
                this._chunks = [];
                this.onEnded(new pdf.PdfDocumentEndedEventArgs(blob));
            };
            PdfDocument.prototype._onPageAdding = function (doc, options) {
                if (this.pageSettings) {
                    var native = this._pageSettingsToNative(this.pageSettings);
                    options.layout = doc.options.layout = native.layout;
                    options.margins = doc.options.margins = native.margins;
                    options.size = doc.options.size = native.size;
                }
            };
            PdfDocument.prototype._onPageAdded = function (doc) {
                doc.page.originalMargins = pdf._shallowCopy(doc.page.margins);
                this._resetAreasOffset(doc);
                this.onPageAdded(wijmo.EventArgs.empty);
            };
            //#endregion
            //#region private
            PdfDocument.prototype._assertAreasPathStarted = function () {
                if (!this._docInitialized) {
                    return;
                }
                this._assertPathStarted();
                this.header._assertPathStarted();
                this.footer._assertPathStarted();
            };
            PdfDocument.prototype._pageSettingsToNative = function (pageSettings) {
                var res = {};
                if (pageSettings) {
                    var layout = wijmo.asEnum(pageSettings.layout, pdf.PdfPageOrientation, true);
                    if (layout != null) {
                        res.layout = (pdf.PdfPageOrientation[layout] || '').toLowerCase();
                    }
                    var margins = pageSettings.margins;
                    if (margins) {
                        res.margins = {
                            left: wijmo.asNumber(margins.left, false, true),
                            right: wijmo.asNumber(margins.right, false, true),
                            top: wijmo.asNumber(margins.top, false, true),
                            bottom: wijmo.asNumber(margins.bottom, false, true)
                        };
                    }
                    var size = pageSettings.size;
                    if (size) {
                        if (size instanceof wijmo.Size) {
                            res.size = [
                                wijmo.asNumber(size.width, false, true),
                                wijmo.asNumber(size.height, false, true)
                            ];
                        }
                        else {
                            size = wijmo.asEnum(size, pdf.PdfPageSize);
                            res.size = (pdf.PdfPageSize[size] || '').toUpperCase();
                        }
                    }
                }
                return res;
            };
            PdfDocument.prototype._processHeadersFooters = function () {
                var hdr = this.header, ftr = this.footer;
                if (hdr.height > 0 || ftr.height > 0) {
                    var doc = this._document;
                    wijmo.assert(doc.options.bufferPages, pdf._Errors.BufferPagesMustBeEnabled);
                    var range = doc.bufferedPageRange();
                    for (var i = range.start; i < range.count; i++) {
                        var frmt = {
                            'Page': i + 1,
                            'Pages': range.count
                        };
                        this.pageIndex = i; // switch page
                        this._renderHeaderFooter(hdr, frmt, true);
                        this._renderHeaderFooter(ftr, frmt, false);
                    }
                }
            };
            PdfDocument.prototype._renderHeaderFooter = function (title, macros, isHeader) {
                var content;
                if (title.height > 0 && title.declarative && title.declarative.text) {
                    var text = pdf._formatMacros(title.declarative.text, macros), parts = text.split('\t');
                    if (parts.length > 0 && parts[0]) {
                        this._renderHeaderFooterPart(title, parts[0], pdf.PdfTextHorizontalAlign.Left, isHeader);
                    }
                    if (parts.length > 1 && parts[1]) {
                        this._renderHeaderFooterPart(title, parts[1], pdf.PdfTextHorizontalAlign.Center, isHeader);
                    }
                    if (parts.length > 2 && parts[2]) {
                        this._renderHeaderFooterPart(title, parts[2], pdf.PdfTextHorizontalAlign.Right, isHeader);
                    }
                }
            };
            PdfDocument.prototype._renderHeaderFooterPart = function (title, text, alignment, isHeader) {
                var doc = this._doc, textSettings = {
                    font: title.declarative.font,
                    brush: title.declarative.brush,
                    width: title.width,
                    height: title.height,
                    align: alignment
                };
                if (isHeader) {
                    this.header.drawText(text, 0, 0, textSettings); // top alignment
                }
                else {
                    var sz = this.footer.measureText(text, textSettings.font, textSettings);
                    this.footer.drawText(text, 0, this.footer.height - sz.size.height, textSettings); // bottom alignment
                }
            };
            PdfDocument.prototype._setCurBrush = function (brush) {
                if (!this._currentGS[this.pageIndex].brush.equals(brush)) {
                    this._setNativeDocBrush(brush, false);
                    this._currentGS[this.pageIndex].brush = brush.clone();
                }
            };
            PdfDocument.prototype._setCurFont = function (font) {
                if (!this._curFont.equals(font)) {
                    var internalName = this._fontReg.findFont(font.family, font.style, font.weight);
                    this._doc.font(internalName, font.size || pdf.PdfFont._DEF_FONT.size);
                    this._curFont = font.clone();
                }
            };
            PdfDocument.prototype._setCurPen = function (pen) {
                var d = this._document, cp = this._currentGS[this.pageIndex].pen;
                // check color and brush. brush property is nullable.
                if (pen.brush && (!cp.brush || !cp.brush.equals(pen.brush))) {
                    this._setNativeDocBrush(pen.brush, true);
                }
                else {
                    if ((cp.brush && !pen.brush) || (!cp.brush && !cp.color.equals(pen.color))) {
                        d.strokeColor([pen.color.r, pen.color.g, pen.color.b], pen.color.a);
                    }
                }
                if (cp.width !== pen.width) {
                    d.lineWidth(pen.width);
                }
                if (cp.miterLimit !== pen.miterLimit) {
                    d.miterLimit(pen.miterLimit);
                }
                if (cp.cap !== pen.cap) {
                    d.lineCap(pen.cap);
                }
                if (cp.join !== pen.join) {
                    d.lineJoin(pen.join);
                }
                // check dashPattern. dashPattern.dash == null means no dashes.
                if (!cp.dashPattern.equals(pen.dashPattern)) {
                    if (pen.dashPattern.dash != null) {
                        d.dash(pen.dashPattern.dash, { space: pen.dashPattern.gap, phase: pen.dashPattern.phase });
                    }
                    else {
                        if (cp.dashPattern.dash != null) {
                            d.undash();
                        }
                    }
                }
                this._currentGS[this.pageIndex].pen = pen.clone();
            };
            // true = stroke, fill = false
            PdfDocument.prototype._setNativeDocBrush = function (brush, strokeOrFill) {
                var d = this._document, nativeColor = brush._getBrushObject(this), opacity = 1;
                if (nativeColor instanceof wijmo.Color) {
                    opacity = nativeColor.a;
                    nativeColor = [nativeColor.r, nativeColor.g, nativeColor.b];
                }
                else {
                    if (brush instanceof pdf.PdfGradientBrush) {
                        opacity = brush.opacity;
                    }
                }
                if (strokeOrFill) {
                    d.strokeColor(nativeColor, opacity);
                }
                else {
                    d.fillColor(nativeColor, opacity);
                }
            };
            PdfDocument.prototype._resetAreasOffset = function (doc) {
                // * update native margins *
                // top margin
                doc.page.margins.top = doc.page.originalMargins.top + this.header.height;
                doc.y = doc.page.margins.top;
                // bottom margin
                doc.page.margins.bottom = doc.page.originalMargins.bottom + this.footer.height;
                // reset page areas offsets
                this._header._initialize(this, doc.page.margins.left, doc.page.originalMargins.top);
                this._initialize(this, doc.page.margins.left, doc.page.margins.top);
                this._footer._initialize(this, doc.page.margins.left, doc.page.height - doc.page.margins.bottom);
            };
            return PdfDocument;
        }(pdf.PdfPageArea));
        pdf.PdfDocument = PdfDocument;
    })(pdf = wijmo.pdf || (wijmo.pdf = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=PdfDocument.js.map