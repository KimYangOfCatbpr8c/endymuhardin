var wijmo;
(function (wijmo) {
    var pdf;
    (function (pdf) {
        'use strict';
        /**
        * Represents an area of a page with its own coordinate system, where (0, 0) points
        * to the top-left corner.
        * Provides methods for drawing text, images, paths and transformations.
        *
        * This class is not intended to be instantiated in your code.
        */
        var PdfPageArea = (function () {
            /**
            * Initializes a new instance of the @see:PdfRunningTitle class.
            */
            function PdfPageArea() {
                this._ctxProps = {
                    xo: 0,
                    yo: 0,
                    lineGap: 0
                };
            }
            Object.defineProperty(PdfPageArea.prototype, "x", {
                //#region public properties
                /**
                * Gets or sets the X-coordinate (in points) of the current point in the text flow
                * used to draw a text or an image.
                */
                get: function () {
                    this._switchCtx();
                    var x = this._pdfdoc._document.x - this._offset.x;
                    this._saveCtx();
                    return x;
                },
                set: function (value) {
                    value = wijmo.asNumber(value);
                    this._switchCtx();
                    this._pdfdoc._document.x = value + this._offset.x;
                    this._saveCtx();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PdfPageArea.prototype, "y", {
                /**
                * Gets or sets the Y-coordinate (in points) of the current point in the text flow
                * used to draw a text or an image.
                */
                get: function () {
                    this._switchCtx();
                    var y = this._pdfdoc._document.y - this._offset.y;
                    this._saveCtx();
                    return y;
                },
                set: function (value) {
                    value = wijmo.asNumber(value);
                    this._switchCtx();
                    this._pdfdoc._document.y = value + this._offset.y;
                    this._saveCtx();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PdfPageArea.prototype, "lineGap", {
                /**
                * Gets or sets the spacing between each line of text, in points.
                *
                * The default value is 0.
                */
                get: function () {
                    return this._ctxProps.lineGap;
                },
                set: function (value) {
                    this._ctxProps.lineGap = value = wijmo.asNumber(value, false, true);
                    if (this._pdfdoc && this._pdfdoc._document) {
                        this._switchCtx();
                        this._pdfdoc._document.lineGap(value);
                        this._saveCtx();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PdfPageArea.prototype, "height", {
                /**
                * Gets the height of the area, in points.
                */
                get: function () {
                    var page = this._pdfdoc._document.page;
                    return Math.max(0, page.height - page.margins.top - page.margins.bottom); // header and footer are placed inside the native margins.
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PdfPageArea.prototype, "width", {
                /**
                * Gets the width of the area, in points.
                */
                get: function () {
                    var page = this._pdfdoc._document.page;
                    return Math.max(page.width - page.margins.left - page.margins.right);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PdfPageArea.prototype, "paths", {
                /**
                * Gets an object that provides ability to draw paths.
                */
                get: function () {
                    return this._graphics;
                },
                enumerable: true,
                configurable: true
            });
            //#endregion
            //#region public methods
            /**
            * Draws a string with the given options and returns the measurement information.
            *
            * If <b>options.pen</b>, <b>options.brush</b> or <b>options.font</b> are omitted,
            * the current document's pen, brush or font are used (see @see:PdfDocument.setPen,
            * @see:PdfDocument.setBrush, and  @see:PdfDocument.setFont).
            *
            * The string is drawn within the rectangular area for which top-left corner, width
            * and  height are defined by the x, y, <b>options.width</b> and <b>options.height</b>
            * values. If x and y are not provided, the @see:PdfDocument.x and @see:PdfDocument.y
            * properties are used instead.
            *
            * The text is wrapped and clipped automatically within the area.
            * If <b>options.height</b> is not provided and the text exceeds the bottom body edge,
            * then a new page will be added to accommodate the text.
            *
            * Finally, the method updates the value of the @see:PdfDocument.x and @see:PdfDocument.y
            * properties. Hence, any subsequent text or image starts below this point
            * (depending on the value of <b>options.continued</b>).
            *
            * The measurement result doesn't reflect the fact that text can be split into
            * multiple pages or columns; the text is treated as a single block.
            *
            * @param text The text to draw.
            * @param x The X-coordinate of the point to draw the text at, in points.
            * @param y The Y-coordinate of the point to draw the text at, in points.
            * @param options Determines the text drawing options.
            * @return A @see:IPdfTextMeasurementInfo object determines the measurement information.
            */
            PdfPageArea.prototype.drawText = function (text, x, y, options) {
                this._assertPathStarted();
                if (!(text = wijmo.asString(text))) {
                    return;
                }
                options = options || {};
                var doc = this._pdfdoc, sz, drawMode = options.stroke && options.fill ? 2 : options.stroke ? 1 : 0; //  0 = fill, 1 = stroke, 2 = fillAndStroke.
                if ((options.strike || options.underline) && !options.stroke) {
                    drawMode = 2;
                }
                this._switchCtx();
                try {
                    this._drawingText = true;
                    if (!(drawMode & 1)) {
                        doc._toggleBrush(pdf._asPdfBrush(options.brush));
                    }
                    if (drawMode & 3) {
                        doc._togglePen(pdf._asPdfPen(options.pen));
                    }
                    doc._toggleFont(pdf._asPdfFont(options.font));
                    var native = this._textOptionsToNative(options), baselineOffset = options._baseline === pdf._PdfTextBaseline.Alphabetic ? doc._document.currentFontAscender() : 0;
                    if (x == null) {
                        doc._document.y -= baselineOffset;
                        sz = doc._document.textAndMeasure(text, null, null, native);
                    }
                    else {
                        sz = doc._document.textAndMeasure(text, wijmo.asNumber(x) + this._offset.x, wijmo.asNumber(y) + this._offset.y - baselineOffset, native);
                    }
                }
                finally {
                    this._drawingText = false;
                    this._saveCtx();
                }
                return {
                    charCount: sz.charCount || 0,
                    size: new wijmo.Size(sz.width || 0, sz.height || 0)
                };
            };
            /**
            * Draws an image in JPG or PNG format with the given options.
            *
            * If x and y are not defined, then @see:x and @see:y are used instead.
            *
            * Finally, if the image was drawn in the text flow, the method updates @see:y.
            * Hence, any subsequent text or image starts below this point.
            *
            * @param url A string containing the URL to get the image from or the data URI containing a base64 encoded image.
            * @param x The x-coordinate of the point to draw the image at, in points.
            * @param y The y-coordinate of the point to draw the image at, in points.
            * @param options Determines the image drawing options.
            * @return The @see:PdfPageArea object.
            */
            PdfPageArea.prototype.drawImage = function (url, x, y, options) {
                this._assertPathStarted();
                if (!(url = wijmo.asString(url))) {
                    return this;
                }
                var dataUrl = pdf._PdfImageHelper.getDataUri(url);
                this._switchCtx();
                try {
                    var o = {};
                    if (options) {
                        switch (wijmo.asEnum(options.align, pdf.PdfImageHorizontalAlign, true)) {
                            case pdf.PdfImageHorizontalAlign.Center:
                                o.align = 'center';
                                break;
                            case pdf.PdfImageHorizontalAlign.Right:
                                o.align = 'right';
                                break;
                            default:
                                o.align = 'left';
                        }
                        switch (wijmo.asEnum(options.vAlign, pdf.PdfImageVerticalAlign, true)) {
                            case pdf.PdfImageVerticalAlign.Center:
                                o.valign = 'center';
                                break;
                            case pdf.PdfImageVerticalAlign.Bottom:
                                o.valign = 'bottom';
                                break;
                            default:
                                o.valign = 'top';
                        }
                        var width = wijmo.asNumber(options.width, true, true), height = wijmo.asNumber(options.height, true, true);
                        if (width && height && wijmo.asBoolean(options.stretchProportionally, true)) {
                            o.fit = [width, height];
                        }
                        else {
                            o.width = width;
                            o.height = height;
                        }
                    }
                    if (x == null) {
                        this._pdfdoc._document.image(dataUrl, o);
                    }
                    else {
                        this._pdfdoc._document.image(dataUrl, wijmo.asNumber(x) + this._offset.x, wijmo.asNumber(y) + this._offset.y, o);
                    }
                }
                finally {
                    this._saveCtx();
                }
                return this;
            };
            /**
            * Draws a SVG image with the given options.
            *
            * If x and y are not defined, then @see:x and @see:y are used instead.
            *
            * The method uses the values of the width and height attributes of the outermost svg element to determine the
            * scale factor according to the options.width and options.height properties. If any of these attributes are
            * omitted then scaling is not performed and the image will be rendered in its original size.
            *
            * Finally, if the image was drawn in the text flow, the method updates @see:y.
            * Hence, any subsequent text or image starts below this point.
            * The increment value is defined by the options.height property or by the outermost svg element's height attribute, which comes first.
            * If none of them is provided then @see:y will stay unchanged.
            *
            * The method supports a limited set of SVG features and provided primarily for rendering wijmo 5 chart controls.
            *
            * @param url A string containing the URL to get the SVG image from or the data URI containing a base64 encoded SVG image.
            * @param x The x-coordinate of the point to draw the image at, in points.
            * @param y The y-coordinate of the point to draw the image at, in points.
            * @param options Determines the SVG image drawing options.
            * @return The @see:PdfPageArea object.
            */
            PdfPageArea.prototype.drawSvg = function (url, x, y, options) {
                options = options || {};
                this._assertPathStarted();
                if (!(url = wijmo.asString(url))) {
                    return this;
                }
                var svg;
                if (url.indexOf('data:image/svg') >= 0) {
                    svg = atob(url.substring(url.indexOf(',') + 1));
                }
                else {
                    var xhrError;
                    svg = wijmo.pdf._XhrHelper.text(url, function (xhr) { return xhrError = xhr.statusText; });
                    wijmo.assert(xhrError == null, xhrError);
                }
                if (!svg) {
                    return this;
                }
                var renderer = new pdf._SvgRenderer(svg, this, wijmo.asFunction(options.urlResolver)), textFlow = (y == null), x = x != null ? x : this.x, y = y != null ? y : this.y, oldY = this.y, oldX = this.x, scaleX, scaleY, optWidth = wijmo.asNumber(options.width, true, true), optHeight = wijmo.asNumber(options.height, true, true), svgWidth = renderer.root.width.hasVal ? renderer.root.width.val : undefined, svgHeight = renderer.root.height.hasVal ? renderer.root.height.val : undefined;
                // scale factor
                if ((optWidth || optHeight) && (svgWidth && svgHeight)) {
                    // can be NaN if width or height is undefined
                    scaleX = optWidth / svgWidth;
                    scaleY = optHeight / svgHeight;
                    if (optWidth && optHeight) {
                        if (options.stretchProportionally) {
                            var scaleMin = Math.min(scaleX, scaleY);
                            if (scaleX === scaleMin) {
                                switch (wijmo.asEnum(options.vAlign, pdf.PdfImageVerticalAlign, true)) {
                                    case pdf.PdfImageVerticalAlign.Center:
                                        y += optHeight / 2 - (svgHeight * scaleX) / 2;
                                        break;
                                    case pdf.PdfImageVerticalAlign.Bottom:
                                        y += optHeight - svgHeight * scaleX;
                                        break;
                                }
                            }
                            if (scaleY === scaleMin) {
                                switch (wijmo.asEnum(options.align, pdf.PdfImageHorizontalAlign, true)) {
                                    case pdf.PdfImageHorizontalAlign.Center:
                                        x += optWidth / 2 - (svgWidth * scaleY) / 2;
                                        break;
                                    case pdf.PdfImageHorizontalAlign.Right:
                                        x += optWidth - svgWidth * scaleY;
                                        break;
                                }
                            }
                            scaleX = scaleY = scaleMin;
                        }
                    }
                    else {
                        if (options.width) {
                            scaleY = scaleX;
                        }
                        else {
                            scaleX = scaleY;
                        }
                    }
                }
                scaleX = scaleX || 1;
                scaleY = scaleY || 1;
                // render
                this._switchCtx();
                this._pdfdoc.saveState();
                try {
                    this.translate(x, y);
                    this.scale(scaleX, scaleY);
                    renderer.render();
                }
                finally {
                    this._pdfdoc.restoreState();
                    this._saveCtx();
                }
                // restore the text flow coordinates
                this.x = oldX;
                this.y = oldY;
                // update this.y
                if (textFlow) {
                    var imgHeight = optHeight != null ? optHeight : (svgHeight != null ? svgHeight * scaleY : undefined);
                    this.y += (imgHeight || 0);
                }
                return this;
            };
            /**
            * Gets the line height with a given font.
            *
            * If font is not specified, then font used in the current document is used.
            *
            * @param font Font to get the line height.
            * @return The line height, in points.
            */
            PdfPageArea.prototype.lineHeight = function (font) {
                var doc = this._pdfdoc;
                doc._toggleFont(pdf._asPdfFont(font));
                this._switchCtx();
                var value = doc._document.currentLineHeight();
                this._saveCtx();
                return value;
            };
            /**
            * Measures a text with the given font and text drawing options without rendering it.
            *
            * If font is not specified, then the font used in the current document is used.
            *
            * The method uses the same text rendering engine as @see:drawText, so it is tied up
            * in the same way to @see:x and the right page margin, if options.width is not
            * provided. The measurement result doesn't reflect the fact that text can be split
            * into multiple pages or columns; the text is treated as a single block.
            *
            * @param text Text to measure.
            * @param font Font to be applied on the text.
            * @param options Determines the text drawing options.
            * @return A @see:IPdfTextMeasurementInfo object determines the measurement information.
            */
            PdfPageArea.prototype.measureText = function (text, font, options) {
                var sz = {};
                if (text = wijmo.asString(text)) {
                    var doc = this._pdfdoc;
                    doc._toggleFont(pdf._asPdfFont(font));
                    this._switchCtx();
                    try {
                        sz = doc._document.textAndMeasure(text, null, null, this._textOptionsToNative(options), true);
                    }
                    finally {
                        this._saveCtx();
                    }
                }
                return {
                    charCount: sz.charCount || 0,
                    size: new wijmo.Size(sz.width || 0, sz.height || 0)
                };
            };
            /**
            * Moves down the @see:y by a given number of lines using the given font or,
            * using the font of current document, if not specified.
            *
            * @param lines Number of lines to move down.
            * @param font Font to calculate the line height.
            * @return The @see:PdfPageArea object.
            */
            PdfPageArea.prototype.moveDown = function (lines, font) {
                if (lines === void 0) { lines = 1; }
                if (lines = wijmo.asNumber(lines, false, true)) {
                    var doc = this._pdfdoc;
                    doc._toggleFont(pdf._asPdfFont(font));
                    this._switchCtx();
                    try {
                        doc._document.moveDown(lines);
                    }
                    finally {
                        this._saveCtx();
                    }
                }
                return this;
            };
            /**
            * Moves up the @see:y by a given number of lines using the given font or,
            * using the font of current document, if not specified.
            *
            * @param lines Number of lines to move up.
            * @param font Font to calculate the line height.
            * @return The @see:PdfPageArea object.
            */
            PdfPageArea.prototype.moveUp = function (lines, font) {
                if (lines === void 0) { lines = 1; }
                if (lines = wijmo.asNumber(lines, false, true)) {
                    var doc = this._pdfdoc;
                    doc._toggleFont(pdf._asPdfFont(font));
                    this._switchCtx();
                    try {
                        doc._document.moveUp(lines);
                    }
                    finally {
                        this._saveCtx();
                    }
                }
                return this;
            };
            /**
            * Scales the graphic context by a specified scaling factor.
            *
            * The scaling factor value within the range [0, 1] indicates that the size will be
            * decreased.
            * The scaling factor value greater than 1 indicates that the size will be increased.
            *
            * @param xFactor The factor to scale the X dimension.
            * @param yFactor The factor to scale the Y dimension. If it is not provided, it is
            * assumed to be equal to xFactor.
            * @param origin The @see:Point to scale around, in points. If it is not provided,
            * then the top left corner is used.
            * @return The @see:PdfPageArea object.
            */
            PdfPageArea.prototype.scale = function (xFactor, yFactor, origin) {
                if (yFactor === void 0) { yFactor = xFactor; }
                this._assertPathStarted();
                origin = origin || new wijmo.Point(0, 0);
                var ox = wijmo.asNumber(origin.x) + this._offset.x, oy = wijmo.asNumber(origin.y) + this._offset.y;
                xFactor = wijmo.asNumber(xFactor, false, true);
                yFactor = wijmo.asNumber(yFactor, false, true);
                this._pdfdoc._document.scale(xFactor, yFactor, {
                    origin: [ox, oy]
                });
                return this;
            };
            /**
            * Translates the graphic context with a given distance.
            *
            * @param x The distance to translate along the X-axis, in points.
            * @param y The distance to translate along the Y-axis, in points.
            * @return The @see:PdfPageArea object.
            */
            PdfPageArea.prototype.translate = function (x, y) {
                this._assertPathStarted();
                // don't add offsets because all drawing methods using it already, otherwise the translate(0,0).moveTo(0,0) call will double the offsets.
                x = wijmo.asNumber(x); // + this._offset.x;
                y = wijmo.asNumber(y); // + this._offset.y;
                this._pdfdoc._document.translate(x, y);
                return this;
            };
            /**
            * Transforms the graphic context with given six numbers which represents a
            * 3x3 transformation matrix.
            *
            * A transformation matrix is written as follows:
            * <table>
            *   <tr><td>a</td><td>b</td><td>0</td></tr>
            *   <tr><td>c</td><td>d</td><td>0</td></tr>
            *   <tr><td>e</td><td>f</td><td>1</td></tr>
            * </table>
            *
            * @param a Value of the first row and first column.
            * @param b Value of the first row and second column.
            * @param c Value of the second row and first column.
            * @param d Value of the second row and second column.
            * @param e Value of the third row and first column.
            * @param f Value of the third row and second column.
            * @return The @see:PdfPageArea object.
            */
            PdfPageArea.prototype.transform = function (a, b, c, d, e, f) {
                this._assertPathStarted();
                a = wijmo.asNumber(a);
                b = wijmo.asNumber(b);
                c = wijmo.asNumber(c);
                d = wijmo.asNumber(d);
                e = wijmo.asNumber(e);
                f = wijmo.asNumber(f);
                var x = this._offset.x, y = this._offset.y;
                this._pdfdoc._document.transform(a, b, c, d, e - a * x + x - c * y, f - b * x - d * y + y);
                return this;
            };
            /**
            * Rotates the graphic context clockwise by a specified angle.
            *
            * @param angle The rotation angle, in degrees.
            * @param origin The @see:Point of rotation, in points. If it is not provided,
            * then the top left corner is used.
            */
            PdfPageArea.prototype.rotate = function (angle, origin) {
                this._assertPathStarted();
                origin = origin || new wijmo.Point(0, 0);
                var ox = wijmo.asNumber(origin.x) + this._offset.x, oy = wijmo.asNumber(origin.y) + this._offset.y;
                angle = wijmo.asNumber(angle);
                this._pdfdoc._document.rotate(angle, {
                    origin: [ox, oy]
                });
                return this;
            };
            //#endregion
            //#region internal
            PdfPageArea.prototype._assertPathStarted = function () {
                wijmo.assert(!this.paths._hasPathBuffer(), pdf._Errors.PathStarted);
            };
            PdfPageArea.prototype._initialize = function (doc, xo, yo) {
                this._pdfdoc = doc;
                this._offset = new wijmo.Point(xo, yo);
                this._ctxProps = {
                    xo: xo,
                    yo: yo,
                    lineGap: this._ctxProps.lineGap
                };
                this._graphics = new pdf.PdfPaths(this._pdfdoc, this._offset);
            };
            PdfPageArea.prototype._isDrawingText = function () {
                return this._drawingText;
            };
            /*
             * Renders a cell with a checkbox inside.
             *
             * @param value Boolean value.
             * @param style A CSSStyleDeclaration object that represents the cell style and
             * positioning.
             *
             * @return A reference to the document.
             */
            PdfPageArea.prototype._renderBooleanCell = function (value, style) {
                this._assertPathStarted();
                var doc = this._pdfdoc, font = new pdf.PdfFont(style.fontFamily, pdf._asPt(style.fontSize, true, undefined), style.fontStyle, style.fontWeight), ci = this._renderCell(style), x = ci.contentX, y = ci.contentY, sz = this.measureText('A', font, { width: Infinity }).size.height;
                switch (style.verticalAlign) {
                    case 'middle':
                        y = y + ci.contentHeight / 2 - sz / 2;
                        break;
                    case 'bottom':
                        y = y + ci.contentHeight - sz;
                        break;
                }
                switch (style.textAlign) {
                    case 'justify':
                    case 'center':
                        x = x + ci.contentWidth / 2 - sz / 2;
                        break;
                    case 'right':
                        x = x + ci.contentWidth - sz;
                        break;
                }
                var border = 0.5;
                // border and content area
                this.paths.rect(x, y, sz, sz).fillAndStroke(wijmo.Color.fromRgba(255, 255, 255), new pdf.PdfPen(undefined, border));
                // checkmark
                if (wijmo.changeType(value, wijmo.DataType.Boolean, '') === true) {
                    var space = sz / 20, cmRectSize = sz - border - space * 2, cmLineWidth = sz / 8;
                    doc.saveState();
                    this.translate(x + border / 2 + space, y + border / 2 + space)
                        .paths
                        .moveTo(cmLineWidth / 2, cmRectSize * 0.6)
                        .lineTo(cmRectSize - cmRectSize * 0.6, cmRectSize - cmLineWidth)
                        .lineTo(cmRectSize - cmLineWidth / 2, cmLineWidth / 2)
                        .stroke(new pdf.PdfPen(undefined, cmLineWidth));
                    doc.restoreState();
                }
                return this;
            };
            /*
            * Renders a cell with a text inside.
            *
            * @param text Text inside the cell.
            * @param style A CSSStyleDeclaration object that represents the cell style and positioning.
            *
            * @return A reference to the document.
            */
            PdfPageArea.prototype._renderTextCell = function (text, style) {
                this._assertPathStarted();
                var ci = this._renderCell(style);
                if (text) {
                    var font = new pdf.PdfFont(style.fontFamily, pdf._asPt(style.fontSize, true, undefined), style.fontStyle, style.fontWeight), textOptions = {
                        brush: style.color,
                        font: font,
                        height: ci.contentHeight,
                        width: ci.contentWidth,
                        align: this._textAlignToPdf(style.textAlign),
                    }, x = ci.contentX, y = ci.contentY;
                    if (textOptions.height > 0 && textOptions.width > 0) {
                        switch (style.verticalAlign) {
                            case 'bottom':
                                var sz = this.measureText(text, font, textOptions);
                                if (sz.size.height < textOptions.height) {
                                    y += textOptions.height - sz.size.height;
                                    textOptions.height = sz.size.height;
                                }
                                break;
                            case 'middle':
                                var sz = this.measureText(text, font, textOptions);
                                if (sz.size.height < textOptions.height) {
                                    y += textOptions.height / 2 - sz.size.height / 2;
                                    textOptions.height = sz.size.height;
                                }
                                break;
                            default:
                                break;
                        }
                        this.drawText(text, x, y, textOptions);
                    }
                }
                return this;
            };
            //#endregion
            //#region private
            PdfPageArea.prototype._switchCtx = function () {
                this._pdfdoc._switchTextFlowCtx(this._ctxProps);
            };
            PdfPageArea.prototype._saveCtx = function () {
                this._ctxProps = this._pdfdoc._getTextFlowCtxState();
            };
            PdfPageArea.prototype._textOptionsToNative = function (value) {
                value = value || {};
                var res = pdf._shallowCopy(value);
                if (value.align != null) {
                    res.align = (pdf.PdfTextHorizontalAlign[wijmo.asEnum(value.align, pdf.PdfTextHorizontalAlign)] || '').toLowerCase(); // default 'left'.
                }
                return res;
            };
            //#endregion
            //#region private cell rendering, CSS parsing
            //	Decomposites some properties to handle the situation when the style was created manually.
            PdfPageArea.prototype._decompositeStyle = function (style) {
                if (style) {
                    var val;
                    if (val = style.borderColor) {
                        // honor single properties
                        if (!style.borderLeftColor) {
                            style.borderLeftColor = val;
                        }
                        if (!style.borderRightColor) {
                            style.borderRightColor = val;
                        }
                        if (!style.borderTopColor) {
                            style.borderTopColor = val;
                        }
                        if (!style.borderBottomColor) {
                            style.borderBottomColor = val;
                        }
                    }
                    if (val = style.borderWidth) {
                        // honor single properties
                        if (!style.borderLeftWidth) {
                            style.borderLeftWidth = val;
                        }
                        if (!style.borderRightWidth) {
                            style.borderRightWidth = val;
                        }
                        if (!style.borderTopWidth) {
                            style.borderTopWidth = val;
                        }
                        if (!style.borderBottomWidth) {
                            style.borderBottomWidth = val;
                        }
                    }
                    if (val = style.borderStyle) {
                        // honor single properties
                        if (!style.borderLeftStyle) {
                            style.borderLeftStyle = val;
                        }
                        if (!style.borderRightStyle) {
                            style.borderRightStyle = val;
                        }
                        if (!style.borderTopStyle) {
                            style.borderTopStyle = val;
                        }
                        if (!style.borderBottomStyle) {
                            style.borderBottomStyle = val;
                        }
                    }
                    if (val = style.padding) {
                        // honor single properties
                        if (!style.paddingLeft) {
                            style.paddingLeft = val;
                        }
                        if (!style.paddingRight) {
                            style.paddingRight = val;
                        }
                        if (!style.paddingTop) {
                            style.paddingTop = val;
                        }
                        if (!style.paddingBottom) {
                            style.paddingBottom = val;
                        }
                    }
                }
            };
            /*
            * Extracts the border values from the CSSStyleDeclaration object.
            *
            * @param style A value to extract from.
            * @return A @see:_IBorder object.
            */
            PdfPageArea.prototype._parseBorder = function (style) {
                var borders = {
                    left: { width: 0 },
                    top: { width: 0 },
                    bottom: { width: 0 },
                    right: { width: 0 }
                };
                if (style.borderLeftStyle !== 'none') {
                    borders.left = {
                        width: pdf._asPt(style.borderLeftWidth),
                        style: style.borderLeftStyle,
                        color: style.borderLeftColor
                    };
                }
                if (style.borderTopStyle !== 'none') {
                    borders.top = {
                        width: pdf._asPt(style.borderTopWidth),
                        style: style.borderTopStyle,
                        color: style.borderTopColor
                    };
                }
                if (style.borderBottomStyle !== 'none') {
                    borders.bottom = {
                        width: pdf._asPt(style.borderBottomWidth),
                        style: style.borderBottomStyle,
                        color: style.borderBottomColor
                    };
                }
                if (style.borderRightStyle !== 'none') {
                    borders.right = {
                        width: pdf._asPt(style.borderRightWidth),
                        style: style.borderRightStyle,
                        color: style.borderRightColor
                    };
                }
                return borders;
            };
            /*
            * Extracts the padding values from the CSSStyleDeclaration object.
            *
            * @param style Value to extract from.
            * @return The @see:IPadding object.
            */
            PdfPageArea.prototype._parsePadding = function (style) {
                return {
                    left: pdf._asPt(style.paddingLeft),
                    top: pdf._asPt(style.paddingTop),
                    bottom: pdf._asPt(style.paddingBottom),
                    right: pdf._asPt(style.paddingRight)
                };
            };
            PdfPageArea.prototype._textAlignToPdf = function (value) {
                switch (value) {
                    case 'center':
                        return pdf.PdfTextHorizontalAlign.Center;
                    case 'right':
                        return pdf.PdfTextHorizontalAlign.Right;
                    case 'justify':
                        return pdf.PdfTextHorizontalAlign.Justify;
                }
                return pdf.PdfTextHorizontalAlign.Left;
            };
            /*
            * Renders an empty cell.
            *
            * The following CSSStyleDeclaration properties are supported for now:
            *   left, top
            *   width, height
            *   border<Left \ Right\ Top\ Bottom>Style (if 'none' then no border, otherwise a solid border)
            *   border<Left\ Right\ Top\ Bottom>Width,
            *   border<Left\ Right\ Top\ Bottom>Color
            *   backgroundColor
            *   boxSizing (content-box + border-box)
            *   padding<Left\ Top\ Right\ Bottom>
            *   textAlign
            *   fontFamily, fontStyle, fontWeight, fontSize
            *
            * @param style A CSSStyleDeclaration object that represents the cell style and positioning.
            * @return A ICellInfo object that represents information about the cell's content.
            */
            PdfPageArea.prototype._renderCell = function (style) {
                this._decompositeStyle(style);
                var x = pdf._asPt(style.left), y = pdf._asPt(style.top), brd = this._parseBorder(style), blw = brd.left.width, btw = brd.top.width, bbw = brd.bottom.width, brw = brd.right.width, pad = this._parsePadding(style), height = pdf._asPt(style.height), width = pdf._asPt(style.width), 
                // content + padding
                clientHeight = 0, clientWidth = 0, 
                // content
                contentHeight = 0, contentWidth = 0;
                // setup client and content dimensions depending on boxing model.
                if (style.boxSizing === 'content-box' || style.boxSizing === undefined) {
                    clientHeight = pad.top + height + pad.bottom;
                    clientWidth = pad.left + width + pad.right;
                    contentHeight = height;
                    contentWidth = width;
                }
                else {
                    if (style.boxSizing === 'border-box') {
                        // Browsers are using different approaches to calculate style.width and style.heigth properties. While Chrome and FireFox returns the total size, IE returns the content size only.
                        if (pdf._IE) {
                            clientHeight = pad.top + pad.bottom + height;
                            clientWidth = pad.left + pad.right + width;
                        }
                        else {
                            clientHeight = height - btw - bbw;
                            clientWidth = width - blw - brw;
                        }
                        contentHeight = clientHeight - pad.top - pad.bottom;
                        contentWidth = clientWidth - pad.left - pad.right;
                    }
                    else {
                        if (style.boxSizing === 'no-box') {
                            clientHeight = height - btw - bbw;
                            clientWidth = width - blw - brw;
                            contentHeight = clientHeight - pad.top - pad.bottom;
                            contentWidth = clientWidth - pad.left - pad.right;
                        }
                        else {
                            // padding-box? It is supported by Mozilla only.
                            throw 'Invalid value: ' + style.boxSizing;
                        }
                    }
                }
                if (blw || brw || bbw || btw) {
                    // all borders has the same width and color, draw a rectangle
                    if ((blw && btw && bbw && brw) && (blw === brw && blw === bbw && blw === btw) && (style.borderLeftColor === style.borderRightColor && style.borderLeftColor === style.borderBottomColor && style.borderLeftColor === style.borderTopColor)) {
                        var border = blw, half = border / 2; // use an adjustment because of center border alignment used by PDFKit.
                        this.paths
                            .rect(x + half, y + half, clientWidth + border, clientHeight + border)
                            .stroke(new pdf.PdfPen(brd.left.color, border));
                    }
                    else {
                        // use a trapeze for each border
                        if (blw) {
                            this.paths
                                .polygon([[x, y], [x + blw, y + btw], [x + blw, y + btw + clientHeight], [x, y + btw + clientHeight + bbw]])
                                .fill(brd.left.color);
                        }
                        if (btw) {
                            this.paths
                                .polygon([[x, y], [x + blw, y + btw], [x + blw + clientWidth, y + btw], [x + blw + clientWidth + brw, y]])
                                .fill(brd.top.color);
                        }
                        if (brw) {
                            this.paths
                                .polygon([[x + blw + clientWidth + brw, y], [x + blw + clientWidth, y + btw], [x + blw + clientWidth, y + btw + clientHeight], [x + blw + clientWidth + brw, y + btw + clientHeight + bbw]])
                                .fill(brd.right.color);
                        }
                        if (bbw) {
                            this.paths
                                .polygon([[x, y + btw + clientHeight + bbw], [x + blw, y + btw + clientHeight], [x + blw + clientWidth, y + btw + clientHeight], [x + blw + clientWidth + brw, y + btw + clientHeight + bbw]])
                                .fill(brd.bottom.color);
                        }
                    }
                }
                // draw background
                if (style.backgroundColor && clientWidth > 0 && clientHeight > 0) {
                    this.paths
                        .rect(x + blw, y + btw, clientWidth, clientHeight)
                        .fill(style.backgroundColor);
                }
                return {
                    contentX: x + blw + pad.left,
                    contentY: y + btw + pad.top,
                    contentHeight: contentHeight,
                    contentWidth: contentWidth
                };
            };
            return PdfPageArea;
        }());
        pdf.PdfPageArea = PdfPageArea;
    })(pdf = wijmo.pdf || (wijmo.pdf = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=PdfPageArea.js.map