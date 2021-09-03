/**
* Defines the @see:PdfDocument class and associated classes.
*/
module wijmo.pdf {
	'use strict';

	interface _IPageGState {
		pen?: PdfPen;
		brush?: PdfBrush;
	}

	/**
	* Represents a PDF document object, based on <a href="https://github.com/devongovett/pdfkit">PDFKit</a> JavaScript library.
	*/
	export class PdfDocument extends PdfPageArea {
		private _doc: _IPdfKitDocument;
		private _docInitialized = false;
		private _compress: boolean = true;
		private _bufferPages: boolean = true; // must be true to render headers and footers
		private _chunks: any[] = [];
		private _fontReg: _PdfFontRegistrar;
		private _pageIndex = -1;

		private _ehOnPageAdded: Function;
		private _ehOnPageAdding: Function;
		private _ehOnDocData: Function;
		private _ehOnDocEnding: Function;
		private _ehOnDocEnded: Function;

		private _header: PdfRunningTitle;
		private _footer: PdfRunningTitle;

		// stores pens and brushes between the save\ restore roundtrip.
		private _graphicsStack = [];
		
		// represents an actual stroking (pen) and filling (brush) properties for every page.
		private _currentGS: { [index: number]: _IPageGState } = {};
		// represents default (provided by the setPen method) settings of the document's stroking properties.
		private _defPen: PdfPen;
		// represents default (provided by the setBrush method) settings of the document's filling properties.
		private _defBrush: PdfBrush;

		// represents current font
		private _curFont: PdfFont;
		// represents default font (provided by the setFont method).
		private _defFont: PdfFont;

		/**
		* Initializes a new instance of the @see:PdfDocument class.
		*
		* @param options An optional object containing initialization settings.
		*/
		constructor(options?: any) {
			super();

			wijmo.copy(this, options);

			var pre = (doc: _IPdfKitDocument) => {
					this._doc = doc;
					this._fontReg = new _PdfFontRegistrar(this._doc);
				},
				post = () => {
					this.setPen(this._currentGS[this._pageIndex].pen);
					this.setBrush(this._currentGS[this._pageIndex].brush);
					this._curFont = PdfFont._DEF_PDFKIT_FONT;
					this.setFont(new PdfFont()); // change to times-10
				},
				autoPage = false,

				pdfKitOptions = {
					compress: this._compress,
					bufferPages: this._bufferPages,
					pageAdding: this._ehOnPageAdding = (doc: _IPdfKitDocument, options: _IPdfKitPageOptions) => {
						if (!this._docInitialized) { // The event was raised before the PDFDocument's constructor call is completed.
							autoPage = true;
							pre(doc);
						}

						this._onPageAdding(doc, options);
					},
					pageAdded: this._ehOnPageAdded = (doc: _IPdfKitDocument) => {
						// we need to reset current pen\ brush to reflect the actual page's stroking\ filling properties beacause each new page has an empty graphics state.
						var brush = this._isDrawingText()
							? this._currentGS[this._pageIndex].brush // leave current brush because PDFKit spreads fill color between pages in case of page breaks when drawing text.
							: new PdfSolidBrush()

						this._currentGS[++this._pageIndex] = {
							pen: new PdfPen(),
							brush: brush
						};

						if (!this._docInitialized) { // The event was raised before the PDFDocument's constructor call is completed.
							post();
						}
						this._onPageAdded(doc);
					}
				};

			this._doc = new PDFDocument(pdfKitOptions);

			if (!autoPage) { // always false in PDFKit 0.7.1
				pre(this._doc);
				post();
			}

			this._doc
				.on('data', this._ehOnDocData = (chunk) => { this._onDocData(chunk); })
				.on('ending', this._ehOnDocEnding = () => { this._onDocEnding(); })
				.on('end', this._ehOnDocEnded = () => { this._onDocEnded(); });

			this._docInitialized = true;
		}

		//#region public properties

		/**
		* Gets a value that indicates whether the document compression is enabled.
		* This property can be assigned using the @see:PdfDocument constructor only. 
		*
		* The default value is true.
		*/
		public get compress(): boolean {
			return this._compress;
		}

		/**
		* Gets a value that indicates whether the pages buffering mode is enabled which means
		* that the document's pages can be iterated over using @see:pageIndex and @see:bufferedPageRange.
		*
		* This property can be assigned using the @see:PdfDocument constructor only. 
		* This property can be set to false only if both @see:header and @see:footer are invisible.
		*
		* The default value is true.
		*/
		public get bufferPages(): boolean {
			return this._bufferPages;
		}

		/**
		* Gets or sets the document information, such as author name, document's creation
		* date and so on.
		*/
		public info: IPdfDocumentInfo = {
			// keep wijmo.copy happy
			author: undefined,
			creationDate: undefined,
			keywords: undefined,
			modDate: undefined,
			subject: undefined,
			title: undefined
		};

		/**
		* Gets an object that represents a header, the page area positioned right below
		* the top margin.
		*/
		public get header(): PdfRunningTitle {
			if (!this._header) {
				this._header = new PdfRunningTitle({
					_heightChanged: () => {
						if (this._docInitialized) {
							this._resetAreasOffset(this._doc);
						}
					}
				});
			}

			return this._header
		}

		/**
		* Gets an object that represents a footer, the page area positioned right above
		* the bottom margin.
		*/
		public get footer(): PdfRunningTitle {
			if (!this._footer) {
				this._footer = new PdfRunningTitle({
					_heightChanged: () => {
						if (this._docInitialized) {
							this._resetAreasOffset(this._doc);
						}
					}
				});
			}

			return this._footer
		}

		/**
		* Gets or sets the index of the current page within the buffered pages range.
		*
		* Use the @see:bufferedPageRange method to get the range of buffered pages.
		*/
		public get pageIndex(): number {
			return this._pageIndex;
		}
		public set pageIndex(value: number) {
			value = wijmo.asNumber(value, false, true);

			if (this._pageIndex !== value) {
				this._doc.switchToPage(value); // an exception will be thrown internally if page is not buffered.
				this._pageIndex = value;
			}
		}

		/**
		* Gets an object that represents the default page settings for the pages added
		* automatically and for the @see:addPage method.
		*/
		public pageSettings: IPdfPageSettings = <any>{
			layout: PdfPageOrientation.Portrait,
			size: PdfPageSize.Letter,
			margins: {
				top: 72,
				left: 72,
				bottom: 72,
				right: 72
			},
			_copy: function (key: string, value: any) {
				if (key === 'size') { // to avoid PdfPageSize <- wijmo.Size exception
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
		public ended = new wijmo.Event();

		/**
		* Occurs when a new page is added to the document.
		*/
		public pageAdded = new wijmo.Event();

		/**
		* Raises the @see:end event.
		* 
		* @param args A @see:PdfDocumentEndedEventArgs object that contains the event data.
		*/
		public onEnded(args: PdfDocumentEndedEventArgs): void {
			if (this.ended) {
				this.ended.raise(this, args);
			}
		}

		/**
		* Raises the @see:pageAdded event.
		*
		* @param args A @see:EventArgs object that contains the event data.
		*/
		public onPageAdded(args: EventArgs): void {
			if (this.pageAdded) {
				this.pageAdded.raise(this, args);
			}
		}
		//#endregion

		//#region public methods

		/**
		 * Disposes the document.
		 */
		public dispose(): void {
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
		}

		/**
		* Gets an object that represents the current page settings (read-only).
		*
		* @return A @see:IPdfPageSettings object that represents the current page settings.
		*/
		public get currentPageSettings(): IPdfPageSettings {
			var page = this._doc.page;
			return {
				layout: page.layout === 'landscape'
					? PdfPageOrientation.Landscape
					: PdfPageOrientation.Portrait,

				size: wijmo.isArray(page.size)
					? new Size(page.size[0], page.size[1])
					// "LETTER" -> PdfPageSize.Letter, "SRA4" -> PdfPageSize.SRA4.
					: PdfPageSize[page.size.match(/\d+/) ? page.size : _toTitleCase(page.size)],

				margins: {
					left: page.margins.left,
					right: page.margins.right,
					top: page.margins.top - this.header.height,
					bottom: page.margins.bottom - this.footer.height
				}
			};
		}

		/**
		* Adds a new page with the given settings.
		*
		* If the settings parameter is omitted, then @see:pageSettings will be used instead.
		*
		* @param settings Page settings.
		* @return The @see:PdfDocument object.
		*/
		public addPage(settings?: IPdfPageSettings): PdfDocument {
			var native = this._pageSettingsToNative(settings || this.pageSettings);
			this._doc.addPage(native);
			return this;
		}

		/**
		* Gets the range of buffered pages.
		* @return A @see:IPdfBufferedPageRange object that represents the range of buffered pages.
		*/
		public bufferedPageRange(): IPdfBufferedPageRange {
			return this._doc.bufferedPageRange();
		}

		/**
		 * Finishes the document rendering.
		 */
		public end(): void {
			this._doc.end();
		}


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
		public setBrush(brushOrColor: any): PdfDocument { // brushOrColor: PdfBrush | Color | string
			this._assertAreasPathStarted();
			this._setCurBrush(this._defBrush = _asPdfBrush(brushOrColor, false).clone());
			return this;
		}

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
		public setPen(penOrColor: any): PdfDocument { // penOrColor: PdfPen | Color | string
			this._assertAreasPathStarted();
			this._setCurPen(this._defPen = _asPdfPen(penOrColor, false).clone());
			return this;
		}

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
		public setFont(font: PdfFont): PdfDocument {
			this._setCurFont(this._defFont = _asPdfFont(font, false).clone());
			return this;
		}

		/**
		* Registers a font from a source and associates it with a given font family name
		* and font attributes.
		*
		* @param font The font to register.
		*
		* @return The @see:PdfDocument object.
		*/
		public registerFont(font: IPdfFontFile): PdfDocument {
			assert(!!font, _Errors.ValueCannotBeEmpty('font'));

			var buffer: ArrayBuffer;

			if (wijmo.isString(font.source)) { // URL
				var xhrError: string;
				buffer = _XhrHelper.arrayBuffer(font.source, xhr => xhrError = xhr.statusText);
				wijmo.assert(xhrError == null, xhrError);
			} else {
				if (font.source instanceof ArrayBuffer) {
					buffer = font.source;
				} else {
					assert(false, _Errors.FontSourceMustBeStringArrayBuffer);
				}
			}

			font = _shallowCopy(font);
			font.source = buffer;

			var uid = this._fontReg.registerFont(font);

			return this;
		}

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
		public registerFontAsync(font: IPdfFontFile, callback: Function): void {
			assert(typeof (font.source) === 'string', _Errors.FontSourceMustBeString);
			asFunction(callback, false);

			_XhrHelper.arrayBufferAsync(font.source, (xhr, buffer) => {
				var fnt = _shallowCopy(font);
				fnt.source = buffer;

				var uid = this._fontReg.registerFont(fnt);

				callback(font);
			});
		}

		/**
		* Saves the state of the graphic context (including current pen, brush and
		* transformation state) and pushes it onto stack.
		*
		* @return The @see:PdfDocument object.
		*/
		public saveState(): PdfDocument {
			this._assertAreasPathStarted();

			this._graphicsStack.push(this._currentGS[this._pageIndex].pen.clone(), this._defPen.clone(), this._currentGS[this._pageIndex].brush.clone(), this._defBrush.clone());
			(<_IPdfKitDocument>this._pdfdoc._document).save();

			return this;
		}

		/**
		* Restores the state from the stack and applies it to the graphic context.
		*
		* @return The @see:PdfDocument object.
		*/
		public restoreState(): PdfDocument {
			this._assertAreasPathStarted();

			if (this._graphicsStack.length) {
				this._defBrush = this._graphicsStack.pop();
				this._currentGS[this._pageIndex].brush = this._graphicsStack.pop();
				this._defPen = this._graphicsStack.pop();
				this._currentGS[this._pageIndex].pen = this._graphicsStack.pop();
			}

			(<_IPdfKitDocument>this._pdfdoc._document).restore();
			return this;
		}

		//#endregion

		//#region internal

		private _runtimeProperties = ['pageIndex', 'x', 'y']; // this read-write properties can be accessed in run-time only.

		public _copy(key: string, value: any): boolean {
			if (key === 'compress') { // read-only property.
				this._compress = asBoolean(value);
				return true;
			}

			if (key === 'bufferPages') { // read-only property.
				this._bufferPages = asBoolean(value);
				return true;
			}

			if (this._runtimeProperties.indexOf(key) >= 0) {
				return true;
			}

			return false;
		}

		public get _document(): any {
			return this._doc;
		}

		public _switchTextFlowCtx(state: _IPdfTextFlowCtxState) {
			this._doc.x = state.xo;
			this._doc.y = state.yo;
			this._doc.lineGap(state.lineGap);
		}

		public _getTextFlowCtxState(): _IPdfTextFlowCtxState {
			return {
				xo: this._doc.x,
				yo: this._doc.y,
				lineGap: this._doc.currentLineGap()
			};
		}

		public _toggleBrush(brush?: PdfBrush): void {
			if (brush) {
				this._setCurBrush(brush);
			} else {
				this._setCurBrush(this._defBrush);
			}
		}

		public _togglePen(pen?: PdfPen): void {
			if (pen) {
				this._setCurPen(pen);
			} else {
				this._setCurPen(this._defPen);
			}
		}

		public _toggleFont(font?: PdfFont): void {
			if (font) {
				this._setCurFont(font);
			} else {
				this._setCurFont(this._defFont);
			}
		}

		//#endregion

		//#region private event handlers

		private _onDocData(chunk: any): void {
			this._chunks.push(chunk);
		}

		private _onDocEnding(): void {
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
		}

		private _onDocEnded(): void {
			if (_IE) { // 'InvalidStateError' exception occurs in IE10 (IE11 works fine) when chunks are passed directly into the Blob constructor, so convert each item to ArrayBuffer first.
				for (var i = 0; i < this._chunks.length; i++) {
					this._chunks[i] = this._chunks[i].toArrayBuffer();
				}
			}

			var blob = new Blob(this._chunks, { type: 'application/pdf' });

			this._chunks = [];
			this.onEnded(new PdfDocumentEndedEventArgs(blob));
		}

		private _onPageAdding(doc: _IPdfKitDocument, options: _IPdfKitPageOptions): void {
			if (this.pageSettings) {
				var native = this._pageSettingsToNative(this.pageSettings);

				options.layout = doc.options.layout = native.layout;
				options.margins = doc.options.margins = native.margins;
				options.size = doc.options.size = native.size;
			}
		}

		private _onPageAdded(doc: _IPdfKitDocument): void {
			doc.page.originalMargins = _shallowCopy(doc.page.margins);
			this._resetAreasOffset(doc);
			this.onPageAdded(EventArgs.empty);
		}

		//#endregion

		//#region private

		private _assertAreasPathStarted(): void {
			if (!this._docInitialized) {
				return;
			}
			this._assertPathStarted();
			this.header._assertPathStarted();
			this.footer._assertPathStarted();
		}

		private _pageSettingsToNative(pageSettings: IPdfPageSettings): _IPdfKitPageOptions {
			var res: _IPdfKitPageOptions = {};

			if (pageSettings) {
				var layout = wijmo.asEnum(pageSettings.layout, PdfPageOrientation, true);
				if (layout != null) {
					res.layout = (PdfPageOrientation[layout] || '').toLowerCase();
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
					if (size instanceof Size) { // custom size
						res.size = [
							wijmo.asNumber((<Size>size).width, false, true),
							wijmo.asNumber((<Size>size).height, false, true)
						];
					} else {
						size = wijmo.asEnum(size, PdfPageSize);
						res.size = (PdfPageSize[size] || '').toUpperCase();
					}
				}
			}

			return res;
		}

		private _processHeadersFooters(): void {
			var hdr = this.header,
				ftr = this.footer;

			if (hdr.height > 0 || ftr.height > 0) {
				var doc = this._doc;

				assert(doc.options.bufferPages, _Errors.BufferPagesMustBeEnabled);

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
		}

		private _renderHeaderFooter(title: PdfRunningTitle, macros: any, isHeader: boolean): void {
			var content: PdfRunningTitleDeclarativeContent;

			if (title.height > 0 && title.declarative && title.declarative.text) {
				var text = _formatMacros(title.declarative.text, macros),
					parts = text.split('\t');

				if (parts.length > 0 && parts[0]) {
					this._renderHeaderFooterPart(title, parts[0], PdfTextHorizontalAlign.Left, isHeader);
				}

				if (parts.length > 1 && parts[1]) {
					this._renderHeaderFooterPart(title, parts[1], PdfTextHorizontalAlign.Center, isHeader);
				}

				if (parts.length > 2 && parts[2]) {
					this._renderHeaderFooterPart(title, parts[2], PdfTextHorizontalAlign.Right, isHeader);
				}
			}
		}

		private _renderHeaderFooterPart(title: PdfRunningTitle, text: string, alignment: PdfTextHorizontalAlign, isHeader: boolean): void {
			var doc = this._doc,
				textSettings: IPdfTextDrawSettings = {
					font: title.declarative.font,
					brush: title.declarative.brush,
					width: title.width,
					height: title.height,
					align: alignment
				};

			if (isHeader) {
				this.header.drawText(text, 0, 0, textSettings); // top alignment
			} else {
				var sz = this.footer.measureText(text, textSettings.font, textSettings);
				this.footer.drawText(text, 0, this.footer.height - sz.size.height, textSettings); // bottom alignment
			}
		}

		private _setCurBrush(brush: PdfBrush): void {
			if (!this._currentGS[this.pageIndex].brush.equals(brush)) {
				this._setNativeDocBrush(brush, false);
				this._currentGS[this.pageIndex].brush = brush.clone();
			}
		}

		private _setCurFont(font: PdfFont): void {
			if (!this._curFont.equals(font)) {
				var internalName = this._fontReg.findFont(font.family, font.style, font.weight);
				this._doc.font(internalName, font.size || PdfFont._DEF_FONT.size);
				this._curFont = font.clone();
			}
		}

		private _setCurPen(pen: PdfPen): void {
			var d = this._doc,
				cp = this._currentGS[this.pageIndex].pen;

			// check color and brush. brush property is nullable.
			if (pen.brush && (!cp.brush || !cp.brush.equals(pen.brush))) { // brush is changed
				this._setNativeDocBrush(pen.brush, true);
			} else {
				if ((cp.brush && !pen.brush) || (!cp.brush && !cp.color.equals(pen.color))) { // color is changed
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
				} else {
					if (cp.dashPattern.dash != null) {
						d.undash();
					}
				}
			}

			this._currentGS[this.pageIndex].pen = pen.clone();
		}

		// true = stroke, fill = false
		private _setNativeDocBrush(brush: PdfBrush, strokeOrFill: boolean): void {
			var d = this._doc,
				nativeColor = brush._getBrushObject(this),
				opacity = 1;

			if (nativeColor instanceof Color) { // PdfSolidBrush
				opacity = (<Color>nativeColor).a;
				nativeColor = [(<Color>nativeColor).r, (<Color>nativeColor).g, (<Color>nativeColor).b];
			} else { // gradient brushes
				if (brush instanceof PdfGradientBrush) {
					opacity = (<PdfGradientBrush>brush).opacity;
				}
			}

			if (strokeOrFill) {
				d.strokeColor(nativeColor, opacity);
			} else {
				d.fillColor(nativeColor, opacity);
			}
		}

		private _resetAreasOffset(doc: _IPdfKitDocument): void {
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
		}

		//#endregion
	}
}