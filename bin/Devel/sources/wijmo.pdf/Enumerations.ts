module wijmo.pdf {
	'use strict';

	// Must follow the PDFKit's _CAP_STYLES object.
	/**
	* Specifies the shape that shall be used at the ends of open subpaths
	* (and dashes, if any) when they are stroked.
	*/
	export enum PdfLineCapStyle {
		/**
		* The stroke is squared off at the endpoint of the path.
		*/
		Butt = 0,

		/**
		* A semicircular arc with a diameter equal to the line width is 
		* drawn around the endpoint and is filled in.
		*/
		Round = 1,

		/**
		* The stroke continues beyond the endpoint of the path for a
		* distance equal to the half of the line width and is squared off.
		*/
		Square = 2
	}

	// Must follow the PDFKit's _JOIN_STYLES object.
	/**
	* Specifies the shape to be used at the corners of paths that are stroked.
	*/
	export enum PdfLineJoinStyle {
		/**
		* The outer edges of the strokes for the two segments are extended
		* until they meet at an angle.
		*/
		Miter = 0,

		/**
		* An arc of a circle with a diameter equal to the line width is drawn
		* around the point where the two segments meet.
		*/
		Round = 1,

		/**
		* The two segments are finished with butt caps and the resulting notch
		* beyond the ends of the segments is filled with a triangle.
		*/
		Bevel = 2
	}

	/**
	* Specifies a rule that determines if a point falls inside the enclosed path.
	*/
	export enum PdfFillRule {
		/**
		* Non-zero rule.
		*/
		NonZero,

		/**
		* Even-odd rule.
		*/
		EvenOdd
	}

	/**
	* Specifies the page orientation.
	*/
	export enum PdfPageOrientation {
		/**
		* Portrait orientation.
		*/
		Portrait,

		/**
		* Landscape orientation.
		*/
		Landscape
	}
	
	/**
	* Specifies the horizontal alignment of the image.
	*/
	export enum PdfImageHorizontalAlign {
		/**
		* Aligns the image to the left edge of the drawing area.
		*/
		Left,

		/**
		* Aligns the image in the middle of the drawing area.
		*/
		Center,

		/**
		* Aligns the image to the right edge of the drawing area.
		*/
		Right
	}

	/**
	* Specifies the vertical alignment of the image.
	*/
	export enum PdfImageVerticalAlign {
		/**
		* Aligns the image to the top edge of the drawing area.
		*/
		Top,

		/**
		* Aligns the image in the middle of the drawing area.
		*/
		Center,

		/**
		* Aligns the image to the bottom edge of the drawing area.
		*/
		Bottom
	}

	/**
	* Specifies the horizontal alignment of text content.
	*/
	export enum PdfTextHorizontalAlign {
		/**
		* Text is aligned to the left.
		*/
		Left,
		
		/**
		* Text is centered.
		*/
		Center,

		/**
		* Text is aligned to the right.
		*/
		Right,

		/**
		* Text is justified.
		*/
		Justify
	}

	// internal, determines the baseline of the text.
	export enum _PdfTextBaseline {
		Top,
		Alphabetic
	}

	// Names must strictly follow the PDFKit's SIZES object.
	/**
	* Specifies the page size, in points.
	*/
	export enum PdfPageSize {
		/**
		* Represents the A0 page size.
		*/
		A0,

		/**
		* Represents the A1 page size.
		*/
		A1,

		/**
		* Represents the A2 page size.
		*/
		A2,

		/**
		* Represents the A3 page size.
		*/
		A3,

		/**
		* Represents the A4 page size.
		*/
		A4,

		/**
		* Represents the A5 page size.
		*/
		A5,

		/**
		* Represents the A6 page size.
		*/
		A6,

		/**
		* Represents the A7 page size.
		*/
		A7,

		/**
		* Represents the A8 page size.
		*/
		A8,

		/**
		* Represents the A9 page size.
		*/
		A9,

		/**
		* Represents the A10 page size.
		*/
		A10,

		/**
		* Represents the B0 page size.
		*/
		B0,

		/**
		* Represents the B1 page size.
		*/
		B1,

		/**
		* Represents the B2 page size.
		*/
		B2,

		/**
		* Represents the B3 page size.
		*/
		B3,

		/**
		* Represents the B4 page size.
		*/
		B4,

		/**
		* Represents the B5 page size.
		*/
		B5,

		/**
		* Represents the B6 page size.
		*/
		B6,

		/**
		* Represents the B7 page size.
		*/
		B7,

		/**
		* Represents the B8 page size.
		*/
		B8,

		/**
		* Represents the B9 page size.
		*/
		B9,

		/**
		* Represents the B10 page size.
		*/
		B10,

		/**
		* Represents the C0 page size.
		*/
		C0,

		/**
		* Represents the C1 page size.
		*/
		C1,

		/**
		* Represents the C2 page size.
		*/
		C2,

		/**
		* Represents the C3 page size.
		*/
		C3,

		/**
		* Represents the C4 page size.
		*/
		C4,

		/**
		* Represents the C5 page size.
		*/
		C5,

		/**
		* Represents the C6 page size.
		*/
		C6,

		/**
		* Represents the C7 page size.
		*/
		C7,

		/**
		* Represents the C8 page size.
		*/
		C8,

		/**
		* Represents the C9 page size.
		*/
		C9,

		/**
		* Represents the C10 page size.
		*/
		C10,

		/**
		* Represents the RA0 page size.
		*/
		RA0,

		/**
		* Represents the RA1 page size.
		*/
		RA1,

		/**
		* Represents the RA2 page size.
		*/
		RA2,

		/**
		* Represents the RA3 page size.
		*/
		RA3,

		/**
		* Represents the RA4 page size.
		*/
		RA4,

		/**
		* Represents the SRA0 page size.
		*/
		SRA0,

		/**
		* Represents the SRA1 page size.
		*/
		SRA1,

		/**
		* Represents the SRA2 page size.
		*/
		SRA2,

		/**
		* Represents the SRA3 page size.
		*/
		SRA3,

		/**
		* Represents the SRA4 page size.
		*/
		SRA4,

		/**
		* Represents the executive page size.
		*/
		Executive,

		/**
		* Represents the folio page size.
		*/
		Folio,

		/**
		* Represents the legal page size.
		*/
		Legal,

		/**
		* Represents the letter page size.
		*/
		Letter,

		/**
		* Represents the tabloid page size.
		*/
		Tabloid
	}
} 