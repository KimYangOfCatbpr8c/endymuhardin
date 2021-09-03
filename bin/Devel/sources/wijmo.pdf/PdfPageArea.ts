module wijmo.pdf {
	'use strict';

	interface _ICellInfo {
		contentX: number;
		contentY: number;
		contentHeight: number;
		contentWidth: number;
	}

	interface _ISingleBorder {
		width: number;
		style?: string;
		color?: string;
	}

	interface _IBorder {
		left: _ISingleBorder;
		top: _ISingleBorder;
		bottom: _ISingleBorder;
		right: _ISingleBorder;
	}

	interface _IPadding {
		left: number;
		top: number;
		bottom: number;
		right: number;
	}

	/**
	* Represents an area of a page with its own coordinate system, where (0, 0) points 
	* to the top-left corner.
	* Provides methods for drawing text, images, paths and transformations.
	*
	* This class is not intended to be instantiated in your code. 
	*/
	export class PdfPageArea {
		public _pdfdoc: PdfDocument;
		public _offset: Point; // upper-left corner in absolute coordinates.
		private _graphics: PdfPaths;
		private _drawingText: boolean;

		private _ctxProps: _IPdfTextFlowCtxState = {
			xo: 0,
			yo: 0,
			lineGap: 0
		};

		/**
		* Initializes a new instance of the @see:PdfRunningTitle class.
		*/
		constructor() {
		}

		//#region public properties

		/**
		* Gets or sets the X-coordinate (in points) of the current point in the text flow 
		* used to draw a text or an image.
		*/
		public get x(): number {
			this._switchCtx();
			var x = (<_IPdfKitDocument>this._pdfdoc._document).x - this._offset.x;
			this._saveCtx();
			return x;
		}
		public set x(value: number) {
			value = wijmo.asNumber(value);

			this._switchCtx();
			(<_IPdfKitDocument>this._pdfdoc._document).x = value + this._offset.x;
			this._saveCtx();
		}

		/**
		* Gets or sets the Y-coordinate (in points) of the current point in the text flow 
		* used to draw a text or an image.
		*/
		public get y(): number {
			this._switchCtx();
			var y = (<_IPdfKitDocument>this._pdfdoc._document).y - this._offset.y;
			this._saveCtx();
			return y;
		}
		public set y(value: number) {
			value = wijmo.asNumber(value);

			this._switchCtx();
			(<_IPdfKitDocument>this._pdfdoc._document).y = value + this._offset.y;
			this._saveCtx();
		}

		/**
		* Gets or sets the spacing between each line of text, in points.
		*
		* The default value is 0.
		*/
		public get lineGap(): number {
			return this._ctxProps.lineGap;
		}
		public set lineGap(value: number) {
			this._ctxProps.lineGap = value = wijmo.asNumber(value, false, true);

			if (this._pdfdoc && this._pdfdoc._document) {
				this._switchCtx();
				(<_IPdfKitDocument>this._pdfdoc._document).lineGap(value);
				this._saveCtx();
			}
		}

		/**
		* Gets the height of the area, in points.
		*/
		public get height(): number {
			var page = (<_IPdfKitDocument>this._pdfdoc._document).page;
			return Math.max(0, page.height - page.margins.top - page.margins.bottom); // header and footer are placed inside the native margins.
		}

		/**
		* Gets the width of the area, in points.
		*/
		public get width(): number {
			var page = (<_IPdfKitDocument>this._pdfdoc._document).page;
			return Math.max(page.width - page.margins.left - page.margins.right);
		}

		/**
		* Gets an object that provides ability to draw paths.
		*/
		public get paths(): PdfPaths {
			return this._graphics;
		}

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
		public drawText(text: string, x?: number, y?: number, options?: IPdfTextDrawSettings): IPdfTextMeasurementInfo {
			this._assertPathStarted();

			if (!(text = wijmo.asString(text))) {
				return;
			}

			options = options || {};

			var doc = this._pdfdoc,
				natDoc = <_IPdfKitDocument>doc._document,
				sz: _IPdfKitTextSize,
				drawMode = options.stroke && options.fill ? 2 : options.stroke ? 1 : 0; //  0 = fill, 1 = stroke, 2 = fillAndStroke.

			if ((options.strike || options.underline) && !options.stroke) { // to draw a line PdfKit changes strokeColor to fillColor
				drawMode = 2;
			}

			this._switchCtx();

			try {
				this._drawingText = true;

				if (!(drawMode & 1)) { // fill | fillAndStroke
					doc._toggleBrush(_asPdfBrush(options.brush));
				}

				if (drawMode & 3) { // stroke | fillAndStroke
					doc._togglePen(_asPdfPen(options.pen));
				}

				doc._toggleFont(_asPdfFont(options.font));

				var native = this._textOptionsToNative(options),
					baselineOffset = options._baseline === _PdfTextBaseline.Alphabetic ? natDoc.currentFontAscender() : 0;

				if (x == null) {
					natDoc.y -= baselineOffset;
					sz = natDoc.textAndMeasure(text, null, null, native);
				} else {
					sz = natDoc.textAndMeasure(text, wijmo.asNumber(x) + this._offset.x, wijmo.asNumber(y) + this._offset.y - baselineOffset, native);
				}
			} finally {
				this._drawingText = false;
				this._saveCtx();
			}

			return {
				charCount: sz.charCount || 0,
				size: new Size(sz.width || 0, sz.height || 0)
			};
		}

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
		public drawImage(url: string, x?: number, y?: number, options?: IPdfImageDrawSettings): PdfPageArea {
			this._assertPathStarted();

			if (!(url = wijmo.asString(url))) {
				return this;
			}

			var dataUrl = _PdfImageHelper.getDataUri(url);

			this._switchCtx();
			try {
				var o: _IPdfKitImageOptions = {};

				if (options) {
					switch (wijmo.asEnum(options.align, PdfImageHorizontalAlign, true)) {
						case PdfImageHorizontalAlign.Center:
							o.align = 'center';
							break;
						case PdfImageHorizontalAlign.Right:
							o.align = 'right';
							break;
						default:
							o.align = 'left';
					}

					switch (wijmo.asEnum(options.vAlign, PdfImageVerticalAlign, true)) {
						case PdfImageVerticalAlign.Center:
							o.valign = 'center';
							break;
						case PdfImageVerticalAlign.Bottom:
							o.valign = 'bottom';
							break;
						default:
							o.valign = 'top';
					}

					var width = wijmo.asNumber(options.width, true, true),
						height = wijmo.asNumber(options.height, true, true);

					if (width && height && wijmo.asBoolean(options.stretchProportionally, true)) {
						o.fit = [width, height];
					} else {
						o.width = width;
						o.height = height;
					}
				}

				if (x == null) {
					(<_IPdfKitDocument>this._pdfdoc._document).image(dataUrl, o);
				} else {
					(<_IPdfKitDocument>this._pdfdoc._document).image(dataUrl, wijmo.asNumber(x) + this._offset.x, wijmo.asNumber(y) + this._offset.y, o);
				}
			} finally {
				this._saveCtx();
			}

			return this;
		}

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
		public drawSvg(url: string, x?: number, y?: number, options?: IPdfSvgDrawSettings): PdfPageArea {
			options = options || {};

			this._assertPathStarted();

			if (!(url = wijmo.asString(url))) {
				return this;
			}

			var svg: string;

			if (url.indexOf('data:image/svg') >= 0) {
				svg = atob(url.substring(url.indexOf(',') + 1));
			} else {
				var xhrError: string;
				svg = wijmo.pdf._XhrHelper.text(url, xhr => xhrError = xhr.statusText);
				wijmo.assert(xhrError == null, xhrError);
			}

			if (!svg) {
				return this;
			}

			var renderer = new _SvgRenderer(svg, this, <(url: string) => string>wijmo.asFunction(options.urlResolver)),
				textFlow = (y == null),
				x = x != null ? x : this.x,
				y = y != null ? y : this.y,
				oldY = this.y,
				oldX = this.x,
				scaleX: number,
				scaleY: number,
				optWidth = wijmo.asNumber(options.width, true, true),
				optHeight = wijmo.asNumber(options.height, true, true),
				svgWidth = renderer.root.width.hasVal ? renderer.root.width.val : undefined,
				svgHeight = renderer.root.height.hasVal ? renderer.root.height.val : undefined;

			// scale factor
			if ((optWidth || optHeight) && (svgWidth && svgHeight)) {
				// can be NaN if width or height is undefined
				scaleX = optWidth / svgWidth;
				scaleY = optHeight / svgHeight;

				if (optWidth && optHeight) {
					if (options.stretchProportionally) {
						var scaleMin = Math.min(scaleX, scaleY);

						if (scaleX === scaleMin) {
							switch (wijmo.asEnum(options.vAlign, PdfImageVerticalAlign, true)) {
								case PdfImageVerticalAlign.Center:
									y += optHeight / 2 - (svgHeight * scaleX) / 2;
									break;

								case PdfImageVerticalAlign.Bottom:
									y += optHeight - svgHeight * scaleX;
									break;
							}
						}

						if (scaleY === scaleMin) {
							switch (wijmo.asEnum(options.align, PdfImageHorizontalAlign, true)) {
								case PdfImageHorizontalAlign.Center:
									x += optWidth / 2 - (svgWidth * scaleY) / 2;
									break;

								case PdfImageHorizontalAlign.Right:
									x += optWidth - svgWidth * scaleY;
									break;
							}
						}

						scaleX = scaleY = scaleMin;
					}
				} else {
					if (options.width) {
						scaleY = scaleX;
					} else {
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
		}

		/**
		* Gets the line height with a given font.
		*
		* If font is not specified, then font used in the current document is used.
		*
		* @param font Font to get the line height.
		* @return The line height, in points.
		*/
		public lineHeight(font?: PdfFont): number {
			var doc = this._pdfdoc;
			doc._toggleFont(_asPdfFont(font));
			this._switchCtx();
			var value = (<_IPdfKitDocument>doc._document).currentLineHeight();
			this._saveCtx();
			return value;
		}

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
		public measureText(text: string, font?: PdfFont, options?: IPdfTextSettings): IPdfTextMeasurementInfo {
			var sz: _IPdfKitTextSize = {};

			if (text = wijmo.asString(text)) {
				var doc = this._pdfdoc;

				doc._toggleFont(_asPdfFont(font));
				this._switchCtx();

				try {
					sz = (<_IPdfKitDocument>doc._document).textAndMeasure(text, null, null, this._textOptionsToNative(options), true);
				}
				finally {
					this._saveCtx();
				}
			}

			return {
				charCount: sz.charCount || 0,
				size: new Size(sz.width || 0, sz.height || 0)
			};
		}

		/**
		* Moves down the @see:y by a given number of lines using the given font or,
		* using the font of current document, if not specified.
		*
		* @param lines Number of lines to move down.
		* @param font Font to calculate the line height.
		* @return The @see:PdfPageArea object.
		*/
		public moveDown(lines = 1, font?: PdfFont): PdfPageArea {
			if (lines = wijmo.asNumber(lines, false, true)) {
				var doc = this._pdfdoc;

				doc._toggleFont(_asPdfFont(font));
				this._switchCtx();

				try {
					(<_IPdfKitDocument>doc._document).moveDown(lines);
				} finally {
					this._saveCtx();
				}
			}

			return this;
		}

		/**
		* Moves up the @see:y by a given number of lines using the given font or,
		* using the font of current document, if not specified.
		*
		* @param lines Number of lines to move up.
		* @param font Font to calculate the line height.
		* @return The @see:PdfPageArea object.
		*/
		public moveUp(lines = 1, font?: PdfFont): PdfPageArea {
			if (lines = wijmo.asNumber(lines, false, true)) {
				var doc = this._pdfdoc;

				doc._toggleFont(_asPdfFont(font));
				this._switchCtx();

				try {
					(<_IPdfKitDocument>doc._document).moveUp(lines);
				} finally {
					this._saveCtx();
				}
			}

			return this;
		}

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
		public scale(xFactor: number, yFactor = xFactor, origin?: Point): PdfPageArea {
			this._assertPathStarted();

			origin = origin || new Point(0, 0);

			var ox = wijmo.asNumber(origin.x) + this._offset.x,
				oy = wijmo.asNumber(origin.y) + this._offset.y;

			xFactor = wijmo.asNumber(xFactor, false, true);
			yFactor = wijmo.asNumber(yFactor, false, true);

			(<_IPdfKitDocument>this._pdfdoc._document).scale(xFactor, yFactor, {
				origin: [ox, oy]
			});

			return this;
		}

		/**
		* Translates the graphic context with a given distance.
		*
		* @param x The distance to translate along the X-axis, in points.
		* @param y The distance to translate along the Y-axis, in points.
		* @return The @see:PdfPageArea object.
		*/
		public translate(x: number, y: number): PdfPageArea {
			this._assertPathStarted();

			// don't add offsets because all drawing methods using it already, otherwise the translate(0,0).moveTo(0,0) call will double the offsets.
			x = wijmo.asNumber(x); // + this._offset.x;
			y = wijmo.asNumber(y); // + this._offset.y;

			(<_IPdfKitDocument>this._pdfdoc._document).translate(x, y);

			return this;
		}

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
		public transform(a: number, b: number, c: number, d: number, e: number, f: number): PdfPageArea {
			this._assertPathStarted();

			a = wijmo.asNumber(a);
			b = wijmo.asNumber(b);
			c = wijmo.asNumber(c);
			d = wijmo.asNumber(d);
			e = wijmo.asNumber(e);
			f = wijmo.asNumber(f);

			var x = this._offset.x,
				y = this._offset.y;

			(<_IPdfKitDocument>this._pdfdoc._document).transform(a, b, c, d, e - a * x + x - c * y, f - b * x - d * y + y);

			return this;
		}

		/**
		* Rotates the graphic context clockwise by a specified angle.
		*
		* @param angle The rotation angle, in degrees.
		* @param origin The @see:Point of rotation, in points. If it is not provided,
		* then the top left corner is used.
		*/
		public rotate(angle: number, origin?: Point): PdfPageArea {
			this._assertPathStarted();

			origin = origin || new Point(0, 0);

			var ox = wijmo.asNumber(origin.x) + this._offset.x,
				oy = wijmo.asNumber(origin.y) + this._offset.y;

			angle = wijmo.asNumber(angle);

			(<_IPdfKitDocument>this._pdfdoc._document).rotate(angle, {
				origin: [ox, oy]
			});

			return this;
		}

		//#endregion

		//#region internal

		public _assertPathStarted(): void {
			assert(!this.paths._hasPathBuffer(), _Errors.PathStarted);
		}

		public _initialize(doc: PdfDocument, xo: number, yo: number) {
			this._pdfdoc = doc;
			this._offset = new wijmo.Point(xo, yo);
			this._ctxProps = {
				xo: xo,
				yo: yo,
				lineGap: this._ctxProps.lineGap
			};

			this._graphics = new PdfPaths(this._pdfdoc, this._offset);
		}

		public _isDrawingText(): boolean {
			return this._drawingText;
		}

		/*
		 * Renders a cell with a checkbox inside.
		 *
		 * @param value Boolean value.
		 * @param style A CSSStyleDeclaration object that represents the cell style and
		 * positioning.
		 *
		 * @return A reference to the document.
		 */
		public _renderBooleanCell(value: boolean, style: CSSStyleDeclaration): PdfPageArea {
			this._assertPathStarted();

			var doc = this._pdfdoc,
				font = new PdfFont(style.fontFamily, _asPt(style.fontSize, true, undefined), style.fontStyle, style.fontWeight),
				ci = this._renderCell(style),
				x = ci.contentX,
				y = ci.contentY,
				sz = this.measureText('A', font, { width: Infinity }).size.height;

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
			this.paths.rect(x, y, sz, sz).fillAndStroke(Color.fromRgba(255, 255, 255), new PdfPen(undefined, border));

			// checkmark
			if (wijmo.changeType(value, DataType.Boolean, '') === true) {
				var space = sz / 20,
					cmRectSize = sz - border - space * 2,
					cmLineWidth = sz / 8;

				doc.saveState();

				this.translate(x + border / 2 + space, y + border / 2 + space)
					.paths
					.moveTo(cmLineWidth / 2, cmRectSize * 0.6)
					.lineTo(cmRectSize - cmRectSize * 0.6, cmRectSize - cmLineWidth)
					.lineTo(cmRectSize - cmLineWidth / 2, cmLineWidth / 2)
					.stroke(new PdfPen(undefined, cmLineWidth))

				doc.restoreState();
			}

			return this;
		}

		/*
		* Renders a cell with a text inside.
		*
		* @param text Text inside the cell.
		* @param style A CSSStyleDeclaration object that represents the cell style and positioning.
		*
		* @return A reference to the document.
		*/
		public _renderTextCell(text: string, style: CSSStyleDeclaration): PdfPageArea {
			this._assertPathStarted();

			var ci = this._renderCell(style);

			if (text) {
				var font = new PdfFont(style.fontFamily, _asPt(style.fontSize, true, undefined), style.fontStyle, style.fontWeight),
					textOptions: IPdfTextDrawSettings = {
						brush: style.color,
						font: font,
						height: ci.contentHeight,
						width: ci.contentWidth,
						align: this._textAlignToPdf(style.textAlign),
					},
					x = ci.contentX,
					y = ci.contentY;

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

						default: // 'top'
							break;
					}

					this.drawText(text, x, y, textOptions);
				}
			}

			return this;
		}

		//#endregion

		//#region private

		private _switchCtx() {
			this._pdfdoc._switchTextFlowCtx(this._ctxProps);
		}

		private _saveCtx() {
			this._ctxProps = this._pdfdoc._getTextFlowCtxState();
		}

		private _textOptionsToNative(value: IPdfTextSettings): _IPdfKitTextOptions {
			value = value || {};

			var res: _IPdfKitTextOptions = _shallowCopy(value);

			if (value.align != null) {
				res.align = (PdfTextHorizontalAlign[wijmo.asEnum(value.align, PdfTextHorizontalAlign)] || '').toLowerCase(); // default 'left'.
			}

			return res;
		}

		//#endregion


		//#region private cell rendering, CSS parsing

		//	Decomposites some properties to handle the situation when the style was created manually.
		private _decompositeStyle(style: CSSStyleDeclaration): void {
			if (style) {
				var val: any;

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
		}

		/*
		* Extracts the border values from the CSSStyleDeclaration object.
		*
		* @param style A value to extract from.
		* @return A @see:_IBorder object.
		*/
		private _parseBorder(style: CSSStyleDeclaration): _IBorder {
			var borders: _IBorder = {
				left: { width: 0 },
				top: { width: 0 },
				bottom: { width: 0 },
				right: { width: 0 }
			};

			if (style.borderLeftStyle !== 'none') {
				borders.left = {
					width: _asPt(style.borderLeftWidth),
					style: style.borderLeftStyle,
					color: style.borderLeftColor
				};
			}

			if (style.borderTopStyle !== 'none') {
				borders.top = {
					width: _asPt(style.borderTopWidth),
					style: style.borderTopStyle,
					color: style.borderTopColor
				};
			}

			if (style.borderBottomStyle !== 'none') {
				borders.bottom = {
					width: _asPt(style.borderBottomWidth),
					style: style.borderBottomStyle,
					color: style.borderBottomColor
				};
			}

			if (style.borderRightStyle !== 'none') {
				borders.right = {
					width: _asPt(style.borderRightWidth),
					style: style.borderRightStyle,
					color: style.borderRightColor
				};
			}

			return borders;
		}

		/*
		* Extracts the padding values from the CSSStyleDeclaration object.
		*
		* @param style Value to extract from.
		* @return The @see:IPadding object.
		*/
		private _parsePadding(style: CSSStyleDeclaration): _IPadding {
			return {
				left: _asPt(style.paddingLeft),
				top: _asPt(style.paddingTop),
				bottom: _asPt(style.paddingBottom),
				right: _asPt(style.paddingRight)
			};
		}

		private _textAlignToPdf(value: string): PdfTextHorizontalAlign {
			switch (value) {
				case 'center':
					return PdfTextHorizontalAlign.Center;

				case 'right':
					return PdfTextHorizontalAlign.Right;

				case 'justify':
					return PdfTextHorizontalAlign.Justify;
			}

			return PdfTextHorizontalAlign.Left;
		}

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
		private _renderCell(style: CSSStyleDeclaration): _ICellInfo {
			this._decompositeStyle(style);

			var x = _asPt(style.left),
				y = _asPt(style.top),

				brd = this._parseBorder(style),
				blw = brd.left.width,
				btw = brd.top.width,
				bbw = brd.bottom.width,
				brw = brd.right.width,

				pad = this._parsePadding(style),

				height = _asPt(style.height),
				width = _asPt(style.width),

				// content + padding
				clientHeight = 0,
				clientWidth = 0,

				// content
				contentHeight = 0,
				contentWidth = 0;

			// setup client and content dimensions depending on boxing model.
			if (style.boxSizing === 'content-box' || style.boxSizing === undefined) {
				clientHeight = pad.top + height + pad.bottom;
				clientWidth = pad.left + width + pad.right;

				contentHeight = height;
				contentWidth = width;
			} else {
				if (style.boxSizing === 'border-box') {
					// Browsers are using different approaches to calculate style.width and style.heigth properties. While Chrome and FireFox returns the total size, IE returns the content size only.
					if (_IE) { // content size: max(0, specifiedSizeValue - (padding + border))
						clientHeight = pad.top + pad.bottom + height;
						clientWidth = pad.left + pad.right + width;
					} else { // total size: Max(specifiedSizeValue, padding + border)
						clientHeight = height - btw - bbw;
						clientWidth = width - blw - brw;
					}

					contentHeight = clientHeight - pad.top - pad.bottom;
					contentWidth = clientWidth - pad.left - pad.right;
				} else {
					if (style.boxSizing === 'no-box') {
						clientHeight = height - btw - bbw;
						clientWidth = width - blw - brw;
						contentHeight = clientHeight - pad.top - pad.bottom;
						contentWidth = clientWidth - pad.left - pad.right;
					} else {
						// padding-box? It is supported by Mozilla only.
						throw 'Invalid value: ' + style.boxSizing;
					}
				}
			}

			if (blw || brw || bbw || btw) {
				// all borders has the same width and color, draw a rectangle
				if ((blw && btw && bbw && brw) && (blw === brw && blw === bbw && blw === btw) && (style.borderLeftColor === style.borderRightColor && style.borderLeftColor === style.borderBottomColor && style.borderLeftColor === style.borderTopColor)) {
					var border = blw,
						half = border / 2; // use an adjustment because of center border alignment used by PDFKit.

					this.paths
						.rect(x + half, y + half, clientWidth + border, clientHeight + border)
						.stroke(new PdfPen(brd.left.color, border));

				} else {
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
		}

		//#endregion
	}
}
