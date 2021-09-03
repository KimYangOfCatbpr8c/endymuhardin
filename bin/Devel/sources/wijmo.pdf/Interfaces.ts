module wijmo.pdf {

	/** Infrastructure. */
	export interface _IPdfTextFlowCtxState {
		xo: number;
		yo: number;
		lineGap: number;
	}

	// wraps the _IPdfKitTextOptions native interface.
	/**
	* Represents text settings used by @see:PdfPageArea.drawText and @see:PdfPageArea.measureText methods.
	*/
	export interface IPdfTextSettings {
		/**
		* Determines how text is aligned within the drawing area.
		* The default value is <b>Left</b>.
		*/
		align?: PdfTextHorizontalAlign;

		/**
		* Indicates whether line wrapping should be used or not.
		* The property is ignored if @see:IPdfTextSettings.width is defined.
		* The default value is true.
		*/
		lineBreak?: boolean;

		/**
		* Determines the width of the text area in points to which the text should wrap.
		* The default value is undefined which means that the text area will be limited by
		* right margin of the page.
		* Use Infinity to indicate that the text area has an infinite width.
		* If defined, forces the @see:IPdfTextSettings.lineBreak property to be enabled.
		*/
		width?: number;
		
		/**
		* Determines the height of the drawing area in points to which the text should be clipped.
		* The default value is undefined which means that the text area will be limited by
		* bottom edge of the body section.
		* Use Infinity to indicate that the text area has an infinite height.
		*/
		height?: number;

		/**
		* Determines the character to display at the end of the text when it exceeds
		* the given area.The default value is undefined, that is, ellipsis is not displayed.
		* Set to true to use the default character.
		*/
		ellipsis?: any; 

		/**
		* Determines the number of columns to flow the text into.
		* The default value is 1.
		*/
		columns?: number;

		/**
		* Determines the spacing between each column, in points.
		* The default value is 18.
		*/
		columnGap?: number;

		/**
		* Determines the value of indentaion in each paragraph of text, in points.
		* The default value is 0.
		*/
		indent?: number;

		/**
		* Determines the spacing between paragraphs of text.
		* The default value is 0.
		*/
		paragraphGap?: number; 

		/**
		* Determines the spacing between lines of text.
		* The default value is 0.
		*/
		lineGap?: number;

		/**
		* Determines the spacing between words in the text.
		* The default value is 0.
		*/
		wordSpacing?: number;

		/**
		* Determines the spacing between text characters.
		* The default value is 0.
		*/
		characterSpacing?: number;

		/**
		* Indicates whether the text should be filled or not.
		* The default value is true.
		*/
		fill?: boolean;
		
		/**
		* Indicates whether the text should be stroked or not.
		* The default value is false.
		*/
		stroke?: boolean;

		/**
		* Determines a URL used to create a link annotation (URI action).
		*/		
		link?: string;

		/**
		* Indicates whether the text should be underlined or not.
		* The default value is false.
		*/
		underline?: boolean;

		/**
		* Indicates whether the text should be striked out or not.
		* The default value is false.
		*/
		strike?: boolean;

		/**
		* Indicates whether subsequent text should be continued right after that or
		* it will be a new paragraph. If true, the text settings will be retained
		* between drawText calls. It means that options argument will be merged with
		* the one taken from the previous drawText call.
		*
		* The default value is false.
		*/
		continued?: boolean;
	}

	/**
	* Represents the settings used by @see:PdfPageArea.drawText method to draw a text
	* with the specified @see:PdfPen and @see:PdfBrush.
	*/
	export interface IPdfTextDrawSettings extends IPdfTextSettings {
		/**
		* Determines the font to use. If not specified, the default document font will be
		* used (@see:PdfDocument.setFont method).
		*/
		font?: PdfFont;

		/**
		* Determines the pen to stroke the text. If not specified, the default document
		* pen will be used (@see:PdfDocument.setPen method).
		*/
		pen?: any; // PdfPen | Color | string

		/**
		* Determines the brush to fill the text. If not specified, the default document
		* brush will be used (@see:PdfDocument.setBrush method).
		*/
		brush?: any; // PdfBrush | Color | string

		_baseline?: _PdfTextBaseline; // internal, used by SVG renderer
	}

	/**
	 * Represents the image drawing settings used by @see:PdfPageArea.drawImage method.
	 *
	 * If neither width nor height options are provided, then the image will be rendered
	 * in its original size. If only width is provided, then the image will be scaled
	 * proportionally to fit in the provided width. If only height is provided, then the
	 * image will be scaled proportionally to fit in the provided height. If both width
	 * and height are provided, then image will be stretched to the dimensions depending
	 * on the stretchProportionally property.
	 */
	export interface IPdfImageDrawSettings {
		/**
		* Determines the width of the image, in points.
		*/
		width?: number;

		/**
		* Determines the height of the image, in points.
		*/
		height?: number;

		/**
		* Indicates whether an image will be stretched proportionally or not, if both width
		* and height options are provided.
		*/
		stretchProportionally?: boolean;

		/**
		* Determines the horizontal alignment in case of proportional stretching.
		*/
		align?: PdfImageHorizontalAlign;

		/**
		* Determines the vertical alignment in case of proportional stretching.
		*/
		vAlign?: PdfImageVerticalAlign;
	}

	
	/**
	* Represents the settings used by @see:PdfPageArea.drawSvg method to draw a SVG image.
	*/
	export interface IPdfSvgDrawSettings extends IPdfImageDrawSettings {
		/**
		* Determines a callback function used to convert a relative URL to a URL that is correct for the current request path.
		* The function gets passed the relative URL as its argument and should return the resolved URL.
		*/
		urlResolver?: Function;
	}

	/**
	* Represents a range of buffered pages returned by @see:PdfDocument.bufferedPageRange method.
	*/
	export interface IPdfBufferedPageRange {
		/**
		* Determines the zero-based index of the first buffered page.
		*/
		start: number;

		/**
		* Determines the count of buffered pages.
		*/
		count: number;
	}

	///*
	//* Represents a callback function which will be called when the font is registered successfully.
	//*/
	//export interface IPdfFontRegisteredCallback {
	//	/*
	//	* @param font The font which has been registered.
	//	*/
	//	(font: IPdfFontFile): void;
	//}

	/**
	* Represents the font attributes.
	*/
	export interface IPdfFontAttributes {
		/**
		* Glyphs have finishing strokes, flared or tapering ends, or have actual
		* serifed endings.
		*/
		cursive?: boolean;

		/**
		* Fantasy fonts are primarily decorative fonts that contain playful representations
		* of characters.
		*/
		fantasy?: boolean;

		/**
		* All glyphs have the same width.
		*/
		monospace?: boolean;

		/**
		* Glyphs have finishing strokes, flared or tapering ends, or have actual
		* serifed endings.
		*/
		serif?: boolean;

		/**
		* Glyphs have stroke endings that are plain.
		*/
		sansSerif?: boolean;
	}

	/**
	* Represents the settings of the font to register by @see:PdfDocument.registerFont and
	* @see:PdfDocument.registerFontAsync methods.
	*/
	export interface IPdfFontFile extends IPdfFontAttributes {
		/**
		* An ArrayBuffer containing binary data or URL to load the font from. 
		* Following font formats are supported: TrueType (.ttf), TrueType Collection (.ttc),
		* Datafork TrueType (.dfont).
		*/
		source: any; /* ArrayBuffer | string */

		/**
		* The name of the font to use.
		*/
		name: string;

		/**
		* The style of the font. One of the following values: 'normal', 'italic', 'oblique'.
		*/
		style?: string;

		/**
		* The weight of the font. One of the following values: 'normal', 'bold', '100', '200', 
		*'300', '400', '500', '600', '700', '800', '900'.
		*/
		weight?: string;

		/**
		* An optional parameter determining the TrueType Collection or Datafork TrueType
		* font family.
		*/
		family?: string;
	}

	/**
	* Represents the document information used by @see:PdfDocument.info property.
	*/
	export interface IPdfDocumentInfo {
		/**
		* Determines the name of the person who created the document.
		*/
		author?: string;

		/**
		* Determines the date and time the document was created on.
		*/
		creationDate?: Date;

		/**
		* Determines the keywords associated with the document. 
		*/
		keywords?: string;

		/**
		* Determines the date and time when the document was last modified.
		*/
		modDate?: Date;

		/**
		* Determines the subject of the document.
		*/
		subject?: string;

		/**
		* Determines the title of the document.
		*/
		title?: string;
	}

	/**
	* Represents the page margins.
	*/
	export interface IPdfPageMargins {
		/**
		* Determines the bottom margin, in points.
		*/
		bottom: number;

		/**
		* Determines the left margin, in points.
		*/
		left: number;

		/**
		* Determines the right margin, in points.
		*/
		right: number;

		/**
		* Determines the top margin, in points.
		*/
		top: number;
	}

	/**
	* Represents the page settings.
	*/
	export interface IPdfPageSettings {
		/**
		* Determines the layout of the page.
		*/
		layout?: PdfPageOrientation;

		/**
		* Determines the margins of the page.
		*/
		margins?: IPdfPageMargins;

		/**
		* Determines the dimensions of the page.
		* The following values are supported:
		* <ul>
		*  <li><b>@see:PdfPageSize</b>: predefined sizes.</li>
		*  <li><b>@see:Size</b>: custom sizes.</li>
		* </ul>
		*/
		size?: any/* PdfPageSize | Size */;
	}

	/**
	* Represents the text measurement information returned by @see:PdfPageArea.measureText method.
	*/
	export interface IPdfTextMeasurementInfo {
		/**
		* Determines the text size, in points.
		*/
		size: Size;

		/**
		* Determines the character count.
		*/
		charCount: number;
	}
} 