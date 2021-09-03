module wijmo.pdf {
	'use strict';

	/**
	* Represents a brush used to fill an area with a color.
	*/
	export class PdfSolidBrush extends PdfBrush {
		private _color: Color;

		/**
		* Initializes a new instance of the @see:PdfSolidBrush class.
		*
		* @param color The color of this brush. A @see:wijmo.Color object or any string
		* acceptable by the @see:wijmo.Color.fromString method.
		*/
		constructor(color?: any) { // color: string | Color
			super();
			this.color = color || Color.fromRgba(0, 0, 0);
		}

		/**
		* Gets or sets the color of the brush.
		* The default color is black.
		*/
		public get color(): Color {
			return this._color;
		}
		public set color(value: Color) { // also accepts string values
			this._color = _asColor(value);
		}

		//#region overrides

		/**
		* Creates a copy of this @see:PdfSolidBrush.
		* @return A copy of this brush.
		*/
		public clone(): PdfSolidBrush {
			return new PdfSolidBrush(this._color);
		}

		/**
		* Determines whether the specified @see:PdfSolidBrush instance is equal
		* to the current one.
		*
		* @param value @see:PdfSolidBrush to compare.
		* @return true if the specified object is equal to the current one, otherwise false.
		*/
		public equals(value: PdfSolidBrush): boolean {
			return ((value instanceof PdfSolidBrush)
				&& this._color.equals(value._color));
		}

		//#endregion

		public _getBrushObject(area: PdfPageArea): Color {
			// Using the non-native Color here because PDFKit doesn't has an appropriate structure that can represent a color with opacity. The PdfDocument's _setBrush and _setPen methods must take it into account.
			return this._color;
		}
	}
}
