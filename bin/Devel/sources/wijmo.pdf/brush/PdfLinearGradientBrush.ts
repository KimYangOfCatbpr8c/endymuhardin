module wijmo.pdf {
	'use strict';

	/**
	* Represents a brush used to fill an area with a linear gradient.
	*/
	export class PdfLinearGradientBrush extends PdfGradientBrush {
		private _x1: number;
		private _y1: number;
		private _x2: number;
		private _y2: number;

		/**
		* Initializes a new instance of the @see:PdfLinearGradientBrush class.
		*
		* @param x1 The X-coordinate of the starting point of the linear gradient.
		* @param y1 The Y-coordinate of the starting point of the linear gradient.
		* @param x2 The X-coordinate of the ending point of the linear gradient.
		* @param y2 The Y-coordinate of the ending point of the linear gradient.
		* @param stops The @see:PdfGradientStop array to set on this brush.
		* @param opacity The opacity of this brush.
		*/
		constructor(x1: number, y1: number, x2: number, y2: number, stops: PdfGradientStop[], opacity: number) {
			super(stops, opacity)

			this.x1 = x1;
			this.y1 = y1;
			this.x2 = x2;
			this.y2 = y2;
		}

		/**
		* Gets or sets the X-coordinate of the starting point of the linear gradient,
		* in page area coordinates, in points.
		*/
		public get x1(): number {
			return this._x1;
		}
		public set x1(value: number) {
			this._x1 = wijmo.asNumber(value, false, true);
		}

		/**
		* Gets or sets the Y-coordinate of the starting point of the linear gradient,
		* in page area coordinates, in points.
		*/
		public get y1(): number {
			return this._y1;
		}
		public set y1(value: number) {
			this._y1 = wijmo.asNumber(value, false, true);
		}

		/**
		* Gets or sets the X-coordinate of the ending point of the linear gradient, 
		* in page area coordinates, in points.
		*/
		public get x2(): number {
			return this._x2;
		}
		public set x2(value: number) {
			this._x2 = wijmo.asNumber(value, false, true);
		}

		/**
		* Gets or sets the Y-coordinate of the ending point of the linear gradient,
		* in page area coordinates, in points.
		*/
		public get y2(): number {
			return this._y2;
		}
		public set y2(value: number) {
			this._y2 = wijmo.asNumber(value, false, true);
		}

		//#region overrides

		/**
		* Creates a copy of this @see:PdfLinearGradientBrush.
		* @return A copy of this brush.
		*/
		public clone(): PdfLinearGradientBrush {
			return new PdfLinearGradientBrush(this._x1, this._y1, this._x2, this._y2, this.stops, this.opacity);
		}

		/**
		* Determines whether the specified @see:PdfLinearGradientBrush instance is equal to
		* the current one.
		*
		* @param value @see:PdfLinearGradientBrush to compare.
		* @return true if the specified object is equal to the current one, otherwise false.
		*/
		public equals(value: PdfLinearGradientBrush): boolean {
			return (value instanceof PdfLinearGradientBrush)
				&& (this._x1 === value._x1)
				&& (this._y1 === value._y1)
				&& (this._x2 === value._x2)
				&& (this._y2 === value._y2)
				&& super.equals(value);
		}

		public _getBrushObject(area: PdfPageArea): any {
			var g = (<_IPdfKitDocument>area._pdfdoc._document).linearGradient(
				this._x1 + area._offset.x,
				this._y1 + area._offset.y,
				this._x2 + area._offset.x,
				this._y2 + area._offset.y),
				stops = this.stops;


			for (var i = 0; i < stops.length; i++) {
				var s = stops[i];

				if (s) {
					g.stop(s.offset, [s.color.r, s.color.g, s.color.b], s.color.a);
				}
			}

			return g;
		}

		//#endregion
	}
}
