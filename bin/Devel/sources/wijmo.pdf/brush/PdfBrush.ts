module wijmo.pdf {
	'use strict';

	/**
	* Represents an abstract class that serves as a base class for all brushes.
	* Instances of any class that derives from this class are used to fill areas and text.
	*
	* This class is not intended to be instantiated in your code. 
	*/
	export class PdfBrush {
		/**
		* Creates a copy of this @see:PdfBrush.
		* @return A copy of this brush.
		*/
		public clone(): PdfBrush {
			throw _Errors.AbstractMethod;
		}

		/**
		* Determines whether the specified @see:PdfBrush instance is equal to the current one.
		*
		* @param value @see:PdfBrush to compare.
		* @return true if the specified object is equal to the current one, otherwise false.
		*/
		public equals(value: PdfBrush): boolean {
			throw _Errors.AbstractMethod;
		}

		/*
		* Gets a native PDFKit's object which represents the brush.
		*
		* @param area Associated @see:PdfPageArea.
		*/
		public _getBrushObject(area: PdfPageArea): any {
			throw _Errors.AbstractMethod;
		}
	}
}

 