module wijmo.pdf {
	'use strict';

	/**
	* Represents a brush used to fill an area with a radial gradient.
	*/
	export class PdfRadialGradientBrush extends PdfGradientBrush {
		private _x1: number;
		private _y1: number;
		private _r1: number;

		private _x2: number;
		private _y2: number;
		private _r2: number;

		/**
		* Initializes a new instance of the @see:PdfRadialGradientBrush class.
		*
		* @param x1 The X-coordinate of the inner circle's center of the radial gradient.
		* @param y1 The Y-coordinate of the inner circle's center of the radial gradient.
		* @param r1 The radius of the inner circle of the radial gradient.
		* @param x2 The X-coordinate of the outer circle's center of the radial gradient.
		* @param y2 The Y-coordinate of the outer circle's center of the radial gradient.
		* @param r2 The radius of the outer circle of the radial gradient.
		* @param stops The @see:PdfGradientStop array to set on this brush.
		* @param opacity The opacity of this brush.
		*/
		constructor(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number, stops: PdfGradientStop[], opacity: number) {
			super(stops, opacity)

			this.x1 = x1;
			this.y1 = y1;
			this.r1 = r1;

			this.x2 = x2;
			this.y2 = y2;
			this.r2 = r2;
		}

		//#region inner point

		/**
		* Gets or sets the X-coordinate of the inner circle's center that represents the
		* starting point of the radial gradient, in page area coordinates, in points.
		*/
		public get x1(): number {
			return this._x1;
		}
		public set x1(value: number) {
			this._x1 = wijmo.asNumber(value, false, true);
		}

		/**
		* Gets or sets the Y-coordinate of the inner circle's center that represents the 
		* starting point of the radial gradient, in page area coordinates, in points.
		*/
		public get y1(): number {
			return this._y1;
		}
		public set y1(value: number) {
			this._y1 = wijmo.asNumber(value, false, true);
		}

		/**
		* Gets or sets the radius of the inner circle that represents the starting 
		* point of the radial gradient, in page area coordinates, in points.
		*/
		public set r1(value: number) {
			this._r1 = wijmo.asNumber(value, false, true);
		}
		public get r1(): number {
			return this._r1;
		}

		//#endregion

		//#region outer point

		/**
		* Gets or sets the X-coordinate of the outer circle's center that represents the ending point of the radial gradient, in page area coordinates, in points.
		*/
		public get x2(): number {
			return this._x2;
		}
		public set x2(value: number) {
			this._x2 = wijmo.asNumber(value, false, true);
		}

		/**
		* Gets or sets the Y-coordinate of the outer circle's center that represents
		* the ending point of the radial gradient, in page area coordinates, in points.
		*/
		public get y2(): number {
			return this._y2;
		}
		public set y2(value: number) {
			this._y2 = wijmo.asNumber(value, false, true);
		}

		/**
		* Gets or sets the radius of the outer circle that represents the ending point of the
		* radial gradient, in page area coordinates, in points.
		*/
		public get r2(): number {
			return this._r2;
		}
		public set r2(value: number) {
			this._r2 = wijmo.asNumber(value, false, true);
		}

		//#endregion

		//#region overrides

		/**
		* Creates a copy of this @see:PdfRadialGradientBrush.
		* @return A copy of this brush.
		*/
		public clone(): PdfRadialGradientBrush {
			return new PdfRadialGradientBrush(this._x1, this._y1, this._r1, this._x2, this._y2, this._r2, this.stops, this.opacity);
		}

		/**
		* Determines whether the specified @see:PdfRadialGradientBrush instance is equal
		* to the current one.
		*
		* @param value @see:PdfRadialGradientBrush to compare.
		* @return true if the specified object is equal to the current one, otherwise false.
		*/
		public equals(value: PdfRadialGradientBrush): boolean {
			return (value instanceof PdfRadialGradientBrush)
				&& (this._x1 === value._x1)
				&& (this._y1 === value._y1)
				&& (this._r1 === value._r1)
				&& (this._x2 === value._x2)
				&& (this._y2 === value._y2)
				&& (this._r2 === value._r2)
				&& super.equals(value);
		}

		public _getBrushObject(area: PdfPageArea): any {
			var g = (<_IPdfKitDocument>area._pdfdoc._document).radialGradient(
				this._x1 + area._offset.x,
				this._y2 + area._offset.y,
				this._r1,
				this._x2 + area._offset.x,
				this._y2 + area._offset.y,
				this._r2),
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
