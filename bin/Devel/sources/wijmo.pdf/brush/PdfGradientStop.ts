module wijmo.pdf {
	'use strict';

	/**
	* Represents an object which determines a transition point of a gradient.
	*/
	export class PdfGradientStop {
		private _offset: number;
		private _color: Color;
		private _opacity: number;

		/**
		* Initializes a new instance of the @see:PdfGradientStop class.
		*
		* @param offset The location of the gradient stop on the gradient axis.
		* @param color The color of the gradient stop. A @see:wijmo.Color object or
		* any string acceptable by the @see:wijmo.Color.fromString method.
		* @param opacity The opacity of the gradient stop.
		*/
		constructor(offset?: number, color?: any, opacity?: number) {
			this.offset = offset || 0;
			this.color = color || Color.fromRgba(0, 0, 0);
			this.opacity = opacity == null ? 1 : opacity;
		}

		/**
		* Gets or sets the location of the gradient stop on gradient axis of the brush.
		* The value must be in range [0, 1], where 0 indicates that the gradient stop is
		* placed at the beginning of the gradient axis, while 1 indicates that the 
		* gradient stop is placed at the end of the gradient axis.
		* The default value is 0.
		*/
		public get offset(): number {
			return this._offset;
		}
		public set offset(value: number) {
			this._offset = wijmo.clamp(wijmo.asNumber(value, false, true), 0, 1);
		}

		/**
		* Gets or sets the color of the gradient stop.
		* The default color is black.
		*/
		public get color(): Color {
			return this._color;
		}
		public set color(value: Color) { // also accepts string values
			this._color = _asColor(value);
		}

		/**
		* Gets or sets the opacity of the gradient stop.
		* The value must be in range [0, 1], where 0 indicates that the gradient stop is
		* completely transparent, while 1 indicates that the gradient stop is completely
		* opaque. The default value is 1.
		*/
		public get opacity(): number {
			return this._opacity;
		}
		public set opacity(value: number) {
			this._opacity = wijmo.clamp(wijmo.asNumber(value, false, true), 0, 1);
		}

		/**
		* Creates a copy of this @see:PdfGradientStop.
		* @return A copy of this gradient stop.
		*/
		public clone(): PdfGradientStop {
			return new PdfGradientStop(this.offset, this.color, this.opacity);
		}

		/**
		* Determines whether the specified @see:PdfGradientStop instance is equal to
		* the current one.
		*
		* @param value @see:PdfGradientStop to compare.
		* @return true if the specified object is equal to the current one, otherwise false.
		*/
		public equals(value: PdfGradientStop): boolean {
			return ((value instanceof PdfGradientStop)
				&& (this._offset === value._offset)
				&& this._color.equals(value._color)
				&& (this._opacity === value._opacity));
		}
	}
}
