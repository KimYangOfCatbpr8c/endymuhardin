module wijmo.pdf {
	'use strict';

	/**
	* Represents an abstract class that serves as a base class for the 
	* @see:PdfLinearGradientBrush and @see:PdfRadialGradientBrush classes.
	*
	* This class is not intended to be instantiated in your code. 
	*/
	export class PdfGradientBrush extends PdfBrush {
		private _opacity: number;
		private _stops: PdfGradientStop[];

		/**
		* Initializes a new instance of the @see:PdfGradientBrush class.
		*
		* @param stops The @see:PdfGradientStop array to set on this brush.
		* @param opacity The opacity of this brush.
		*/
		constructor(stops?: PdfGradientStop[], opacity?: number) {
			super();

			this.stops = stops || [];
			this.opacity = opacity == null ? 1 : opacity;
		}

		/**
		* Gets or sets the opacity of the brush.
		* The value must be in range [0, 1], where 0 indicates that the brush is
		* completely transparent and 1 indicates that the brush is completely opaque.
		* The default value is 1.
		*/
		public get opacity(): number {
			return this._opacity;
		}
		public set opacity(value: number) {
			this._opacity = wijmo.clamp(wijmo.asNumber(value, false, true), 0, 1);
		}

		/**
		* Gets or sets an array of @see:PdfGradientStop objects representing a color, 
		* offset and opacity within the brush's gradient axis.
		* The default value is an empty array.
		*/
		public get stops(): PdfGradientStop[] {
			return this._stops;
		}
		public set stops(value: PdfGradientStop[]) {
			assert(wijmo.isArray(value), _Errors.InvalidArg('value'));
			this._stops = this._cloneStopsArray(value);
		}

		/**
		* Determines whether the specified @see:PdfGradientBrush instance is equal
		* to the current one.
		*
		* @param value @see:PdfGradientBrush to compare.
		* @return true if the specified object is equal to the current one, otherwise false.
		*/
		public equals(value: PdfGradientBrush): boolean {
			return (value instanceof PdfGradientBrush)
				&& (this._opacity === value.opacity)
				&& _compare(this._stops, value._stops);
		}

		//#region internal, private

		private _cloneStopsArray(value: PdfGradientStop[]): PdfGradientStop[] {
			var res: PdfGradientStop[] = [];

			for (var i = 0; i < value.length; i++) {
				var stop = value[i];
				assert(stop instanceof PdfGradientStop, _Errors.InvalidArg('stops[' + i + ']'));
				res.push(value[i].clone());
			}

			return res;
		}

		//#endregion
	}
}
