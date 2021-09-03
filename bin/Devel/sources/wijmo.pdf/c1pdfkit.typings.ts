declare var PDFDocument: {
	prototype: _IPdfKitDocument;
	new (options?: _IPdfKitDocumentOptions): _IPdfKitDocument;
} 

interface _IPdfKitDocument {
	x: number;
	y: number;
	info: _IPdfKitDocumentInfo;
	compress: boolean;
	options: _IPdfKitDocumentOptions;
	page: _IPdfKitPage;

	addPage(options?: _IPdfKitPageOptions): _IPdfKitDocument;
	bufferedPageRange(): { start: number; count: number; };
	flushPages(): void;
	switchToPage(pageNumber: number): _IPdfKitPage;
	end(): boolean;

	lineGap(value: number): _IPdfKitDocument;
	currentLineGap(): number; // GrapeCity
	currentLineHeight(includeGap?: boolean): number;
	widthOfString(value: string, options?: _IPdfKitWidthOfStringOptions): number;
	heightOfString(value: string, options?: _IPdfKitHeightOfStringOptions): number;
	moveDown(lines: number): _IPdfKitDocument;
	moveUp(lines: number): _IPdfKitDocument;
	text(text: string, options?: _IPdfKitTextOptions): _IPdfKitDocument;
	text(text: string, x?: number, y?: number, options?: _IPdfKitTextOptions): _IPdfKitDocument;
	textAndMeasure(text: string, x: number, y: number, options: _IPdfKitTextOptions, measureOnly?: boolean): _IPdfKitTextSize; // GrapeCity

	currentFontAscender(): number; // GrapeCity
	currentFontBBox(): _IPdfKitFontBBox; // GrapeCity
	currentFontSize(): number; // GrapeCity
	font(name: string, size?: number): _IPdfKitDocument;
	font(src: ArrayBuffer, size?: number): _IPdfKitDocument;
	font(src: ArrayBuffer, fontFamily: string, size?: number): _IPdfKitDocument;
	fontSize(size: number): _IPdfKitDocument;
	registerFont(name: string, standardFontName: string): _IPdfKitDocument;
	registerFont(name: string, src: ArrayBuffer, fontFamily?: string): _IPdfKitDocument;

	image(URI: string, options?: _IPdfKitImageOptions): _IPdfKitDocument;
	image(URI: string, x?: number, y?: number, options?: _IPdfKitImageOptions): _IPdfKitDocument;

	on(eventName: string, handler: Function): _IPdfKitDocument;
	on(eventName: 'data', handler: (chunk: any) => {}): _IPdfKitDocument;
	removeAllListeners(type: string): _IPdfKitDocument;
	removeEventListener(type: string, listener: Function): _IPdfKitDocument;

	fill(colorOrRule: string): _IPdfKitDocument;
	fill(color: string, rule?: string): _IPdfKitDocument;
	fill(color: number[], rule?: string): _IPdfKitDocument;
	fill(color: _IPdfKitGradient, rule?: string): _IPdfKitDocument;

	fillAndStroke(rule?: string): _IPdfKitDocument;
	fillAndStroke(fillColor: string, strokeColor: string, rule?: string): _IPdfKitDocument;
	fillAndStroke(fillColor: number[], strokeColor: number[], rule?: string): _IPdfKitDocument;
	fillAndStroke(fillColor: _IPdfKitGradient, strokeColor: _IPdfKitGradient, rule?: string): _IPdfKitDocument;

	fillColor(color: string, opacity?: number): _IPdfKitDocument;
	fillColor(color: number[], opacity?: number): _IPdfKitDocument;
	fillColor(color: _IPdfKitGradient, opacity?: number): _IPdfKitDocument;
	strokeColor(color: string, opacity?: number): _IPdfKitDocument;
	strokeColor(color: number[], opacity?: number): _IPdfKitDocument;
	strokeColor(color: _IPdfKitGradient, opacity?: number): _IPdfKitDocument;

	fillOpacity(opacity: number): _IPdfKitDocument;
	strokeOpacity(opacity: number): _IPdfKitDocument;
	opacity(opacity: number): _IPdfKitDocument;

	linearGradient(x1: number, y1: number, x2: number, y2: number): _IPdfKitGradient;
	radialGradient(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number): _IPdfKitGradient;

	closePath(): _IPdfKitDocument;
	clip(rule?: string): _IPdfKitDocument;
	bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): _IPdfKitDocument;
	quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): _IPdfKitDocument;
	circle(x: number, y: number, radius: number): _IPdfKitDocument;
	ellipse(x: number, y: number, r1: number, r2?: number): _IPdfKitDocument;
	lineTo(x: number, y: number): _IPdfKitDocument;
	lineWidth(width: number): _IPdfKitDocument;
	moveTo(x: number, y: number): _IPdfKitDocument;
	path(path: string): _IPdfKitDocument;
	rect(x: number, y: number, w: number, h: number): _IPdfKitDocument;
	roundedRect(x: number, y: number, w: number, h: number, r?: number): _IPdfKitDocument;
	polygon(...points: number[][]): _IPdfKitDocument;
	lineCap(value: any /*string | number */): _IPdfKitDocument;
	lineJoin(value: any /*string | number */): _IPdfKitDocument;
	miterLimit(value: number): _IPdfKitDocument;
	dash(length: number, options?: _IPdfKitDashOptions): _IPdfKitDocument;
	undash(): _IPdfKitDocument;

	stroke(color?: string): _IPdfKitDocument;
	stroke(color?: number[]): _IPdfKitDocument;
	stroke(color?: _IPdfKitGradient): _IPdfKitDocument;

	scale(xFactor: number, yFactor: number, options?: _IPdfKitOrigin): _IPdfKitDocument;
	scale(factor: number): _IPdfKitDocument;
	translate(x: number, y: number): _IPdfKitDocument;
	transform(m11: number, m12: number, m21: number, m22: number, dx: number, dy: number): _IPdfKitDocument;
	rotate(angle: number, options?: _IPdfKitOrigin): _IPdfKitDocument;

	restore(): _IPdfKitDocument;
	save(): _IPdfKitDocument;
}

interface _IPdfKitPageOptions {
	layout?: string;
	margin?: number;
	margins?: _IPdfKitPageMargins;
	size?: any;  // string (named size) or number[2] (custom size)
}

interface _IPdfKitPage {
	document: _IPdfKitDocument;
	width: number;
	height: number;
	margins: _IPdfKitPageMargins;
	size: any; // string (named size) or number[2] (custom size)
	layout: string;

	// GrapeCity
	originalMargins: _IPdfKitPageMargins;
}

interface _IPdfKitDocumentOptions extends _IPdfKitPageOptions {
	bufferPages?: boolean;
	compress?: boolean;
	info?: _IPdfKitDocumentInfo;

	// GrapeCity
	pageAdding?: (document: _IPdfKitDocument, options: _IPdfKitPageOptions) => void;
	pageAdded?: (document: _IPdfKitDocument, pageIndex: number) => void;
}

interface _IPdfKitDocumentInfo {
	Author?: string;
	CreationDate?: Date;
	Keywords?: string;
	ModDate?: Date;
	Subject?: string;
	Title?: string;
}

interface _IPdfKitPageMargins {
	bottom: number;
	left: number;
	right: number;
	top: number;
}

interface _IPdfKitTextOptions {
	align?: string; // "left", "center", "right", "justify".
	lineBreak?: boolean; // set to false to disable line wrapping all together
	width?: number; // the width that text should be wrapped to (by default, the page width minus the left and right margin)
	height?: number; // the maximum height that text should be clipped to
	ellipsis?: any; // the character to display at the end of the text when it is too long. Set to true to use the default character.
	columns?: number; // the number of columns to flow the text into
	columnGap?: number; // the amount of space between each column(1 / 4 inch by default)
	indent?: number; // the amount in PDF points(72 per inch) to indent each paragraph of text
	paragraphGap?: number; // the amount of space between each paragraph of text
	lineGap?: number; // the amount of space between each line of text
	wordSpacing?: number; // the amount of space between each word in the text
	characterSpacing?: number; // the amount of space between each character in the text
	fill?: boolean; // whether to fill the text(true by default)
	stroke?: boolean; // whether to stroke the text
	link?: string; // a URL to link this text to(shortcut to create an annotation)
	underline?: boolean; // whether to underline the text
	strike?: boolean; // whether to strike out the text
	continued?: boolean; // whether the text segment will be followed immediately by another segment.Useful for changing styling in the middle of a paragraph.
}

interface _IPdfKitDashOptions {
	phase?: number;
	space?: number;
}

interface _IPdfKitHeightOfStringOptions extends _IPdfKitTextOptions {
	// GrapeCity
	lastLineExternalLeadingGap?: boolean; // default: true
}

interface _IPdfKitWidthOfStringOptions {
	characterSpacing?: number;
}

// Neither width or height provided - image is rendered at full size
// width provided but not height - image is scaled proportionally to fit in the provided width
// height provided but not width - image is scaled proportionally to fit in the provided height
// Both width and height provided - image is stretched to the dimensions provided
// scale factor provided - image is scaled proportionally by the provided scale factor
// fit array provided - image is scaled proportionally to fit within the passed width and height
interface _IPdfKitImageOptions {
	width?: number;
	height?: number;
	scale?: number;
	fit?: number[];
	align?: string; // 'left' (default) | 'center' | 'right'
	valign?: string; // 'top' (default) | 'center' | 'bottom'
}

interface _IPdfKitGradient {
	stop(pos: number, color, opacity?: number): _IPdfKitGradient;
}

interface _IPdfKitOrigin {
	origin?: number[];
}

// GrapeCity
interface _IPdfKitTextSize {
	width?: number;
	height?: number;
	charCount?: number;
}

// GrapeCity
interface _IPdfKitFontBBox {
	llx: number,
	lly: number,
	urx: number,
	ury: number
}