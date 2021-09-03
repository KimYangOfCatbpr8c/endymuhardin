module wijmo.pdf {
	'use strict';

	/**
	 * Represents the dash pattern used to stroke paths.
	 */
	export class PdfDashPattern {
		private _dash: number;
		private _gap: number;
		private _phase: number;

		/**
		* Initializes a new instance of the @see:PdfDashPattern class.
		*
		* @param dash The length of alternating dashes, in points.
		* @param gap The length of alternating gaps, in points.
		* @param phase The distance in the dash pattern to start the dash at, in points.
		*/
		constructor(dash: number = null, gap: number = dash, phase: number = 0) {
			this.dash = dash;
			this.gap = gap;
			this.phase = phase;
		}

		/**
		* Gets or sets the length of alternating dashes, in points.
		* The default value is null which indicates no dash pattern, but a solid line.
		*/
		public get dash(): number {
			return this._dash;
		}
		public set dash(value: number) {
			this._dash = wijmo.asNumber(value, true, true);
		}

		/**
		* Gets or sets the length of alternating gaps, in points.
		* The default value is equal to @see:dash which indicates that dashes and gaps will
		* have the same length.
		*/
		public get gap(): number {
			return this._gap;
		}
		public set gap(value: number) {
			this._gap = wijmo.asNumber(value, true, true);
		}

		/**
		* Gets or sets the distance in the dash pattern to start the dash at, in points.
		* The default value is 0.
		*/
		public get phase(): number {
			return this._phase;
		}
		public set phase(value: number) {
			this._phase = wijmo.asNumber(value, false, true);
		}

		/**
		* Creates a copy of this @see:PdfDashPattern.
		* @return A copy of this dash pattern.
		*/
		public clone(): PdfDashPattern {
			return new PdfDashPattern(this._dash, this._gap, this._phase);
		}

		/**
		* Determines whether the specified @see:PdfDashPattern instance is equal
		* to the current one.
		*
		* @param value @see:PdfDashPattern to compare.
		* @return true if the specified object is equal to the current one, otherwise false.
		*/
		public equals(value: PdfDashPattern): boolean {
			return ((value instanceof PdfDashPattern)
				&& (this._dash === value.dash)
				&& (this._gap === value.gap)
				&& (this._phase === value.phase));
		}
	}
} 