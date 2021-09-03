module wijmo.pdf {
	'use strict';

	/**
	 * Determines an object used to stroke paths and text.
	 */
	export class PdfPen {
		private _color: Color;
		private _brush: PdfBrush;
		private _width: number;
		private _cap: PdfLineCapStyle;
		private _join: PdfLineJoinStyle;
		private _miterLimit: number;
		private _dashPattern: PdfDashPattern;

		/**
		* Initializes a new instance of the @see:PdfPen class with the specified color or
		* brush or JavaScript object.
		*
		* The first argument can accept the following values:
		* <ul>
		*  <li>@see:wijmo.Color object or any string acceptable by the @see:wijmo.Color.fromString method.</li>
		*  <li>@see:PdfBrush object.</li>
		*  <li>JavaScript object containing initialization properties (all other arguments are ignored).</li>
		* </ul>
		*
		* @param colorOrBrushOrOptions The color or brush or JavaScript object to use.
		* @param width The width to use.
		* @param dashPattern The dash pattern to use.
		* @param cap The line cap style to use.
		* @param join The line join style to use.
		* @param miterLimit The miter limit to use.
		*/
		constructor(colorOrBrushOrOptions?: any, width?: number, dashPattern?: PdfDashPattern, cap?: PdfLineCapStyle, join?: PdfLineJoinStyle, miterLimit?: number) {
			// Default arguments values are taken from the PDF Reference 1.7, chapter 4.3, 'Device-independent graphics state parameters'.
			if (colorOrBrushOrOptions == null) {
				colorOrBrushOrOptions = Color.fromRgba(0, 0, 0);
			}

			if (width == null) {
				width = 1;
			}

			if (dashPattern == null) {
				dashPattern = new PdfDashPattern(null, null, 0);
			}

			if (cap == null) {
				cap = PdfLineCapStyle.Butt;
			}

			if (join == null) {
				join = PdfLineJoinStyle.Miter;
			}

			if (miterLimit == null) {
				miterLimit = 10;
			}

			if (wijmo.isObject(colorOrBrushOrOptions) && !(colorOrBrushOrOptions instanceof Color) && !(colorOrBrushOrOptions instanceof PdfBrush)) {
				var foo = <PdfPen>colorOrBrushOrOptions;

				this.color = foo.color;
				this.brush = foo.brush;
				this.width = foo.width != null ? foo.width : width;
				this.cap = foo.cap != null ? foo.cap : cap;
				this.join = foo.join != null ? foo.join : join;
				this.miterLimit = foo.miterLimit != null ? foo.miterLimit : miterLimit
				this.dashPattern = foo.dashPattern || dashPattern;
			} else {
				if (colorOrBrushOrOptions instanceof PdfBrush) {
					this.brush = colorOrBrushOrOptions;
				} else {
					this.color = colorOrBrushOrOptions;
				}

				this.width = width;
				this.cap = cap;
				this.join = join;
				this.miterLimit = miterLimit
				this.dashPattern = dashPattern;
			}

			this._color = this._color || Color.fromRgba(0, 0, 0);
		}

		/**
		* Gets or sets the color used to stroke paths.
		* The default color is black.
		*/
		public get color(): Color {
			return this._color;
		}
		public set color(value: Color) { // also accepts string values
			this._color = _asColor(value);
		}

		/**
		* Gets or sets the brush used to stroke paths.
		* Takes precedence over the @see:color property, if defined.
		*/
		public get brush(): PdfBrush {
			return this._brush;
		}
		public set brush(value: PdfBrush) {
			value = _asPdfBrush(value, true);
			this._brush = value ? value.clone() : null;
		}

		/**
		* Gets or sets the line width used to stroke paths, in points.
		* The default width is 1.
		*/
		public get width(): number {
			return this._width;
		}
		public set width(value: number) {
			this._width = wijmo.asNumber(value, false, true);
		}

		/**
		* Gets or sets the shape that shall be used at the open ends of a stroked path.
		* The default value is <b>Butt</b>.
		*/
		public get cap(): PdfLineCapStyle {
			return this._cap;
		}
		public set cap(value: PdfLineCapStyle) {
			this._cap = wijmo.asEnum(value, PdfLineCapStyle);
		}

		/**
		* Gets or sets the shape to be used at the corners of a stroked path.
		* The default value is <b>Miter</b>.
		*/
		public get join(): PdfLineJoinStyle {
			return this._join;
		}
		public set join(value: PdfLineJoinStyle) {
			this._join = wijmo.asEnum(value, PdfLineJoinStyle);
		}

		/**
		* Determines the maximum value of the miter length to the line width ratio, when the line
		* join is converted from miter to bevel.
		* The default value is 10.
		*/
		public get miterLimit(): number {
			return this._miterLimit;
		}
		public set miterLimit(value: number) {
			this._miterLimit = wijmo.asNumber(value, false, true);
		}

		/**
		* Gets the dash pattern used to stroke paths.
		* The default value is a solid line.
		*/
		public get dashPattern(): PdfDashPattern {
			return this._dashPattern;
		}
		public set dashPattern(value: PdfDashPattern) {
			assert(value instanceof PdfDashPattern, _Errors.InvalidArg('value'));
			this._dashPattern = value.clone();
		}

		/**
		* Creates a copy of this @see:PdfPen.
		* @return A copy of this pen.
		*/
		public clone(): PdfPen {
			var pen = new PdfPen(this._color, this._width, this._dashPattern, this._cap, this._join, this._miterLimit);
			pen.brush = this._brush;
			return pen;
		}

		/**
		* Determines whether the specified @see:PdfPen instance is equal to the current one.
		*
		* @param value @see:PdfPen to compare.
		* @return true if the specified object is equal to the current one, otherwise false.
		*/
		public equals(value: PdfPen): boolean {
			return ((value instanceof PdfPen)
				&& this._color.equals(value._color)
				&& (this._brush ? this._brush.equals(value._brush) : this._brush === value._brush)
				&& (this._width === value._width)
				&& (this._cap === value._cap)
				&& (this._join === value._join)
				&& (this._miterLimit === value._miterLimit)
				&& this._dashPattern.equals(value._dashPattern));
		}
	}
} 