module wijmo.pdf {
	'use strict';

	/**
	* Represents a running title of the page, like header and footer.
	*
	* This class is not intended to be instantiated in your code.
	*/
	export class PdfRunningTitle extends PdfPageArea  {
		private _height = 24;
		private _declarative = new PdfRunningTitleDeclarativeContent();
		public _heightChanged = new wijmo.Event();

		/**
		* Initializes a new instance of the @see:PdfRunningTitle class.
		*
		* @param options An optional object containing initialization settings.
		*/
		constructor(options?: any) {
			super();
			wijmo.copy(this, options);
		}

		//#region public properties

		/**
		* Gets or sets an object that provides the ability to setup the running title
		* content declaratively.
		*/
		public get declarative(): PdfRunningTitleDeclarativeContent {
			return this._declarative;
		}
		public set declarative(value: PdfRunningTitleDeclarativeContent) {
			if (value != null) {
				assert(value instanceof PdfRunningTitleDeclarativeContent, _Errors.InvalidArg('value'));
				value = value.clone();
			}

			this._declarative = value;
		}

		/**
		* Gets or sets the height of the running title, in points.
		* To hide the running title, set this property to 0.
		* Changing this property has no effect on previous drawings; they will not be resized
		* or clipped.
		*
		* The default value is 24.
		*/
		public get height(): number {
			return this._height;
		}
		public set height(value: number) {
			if (value !== this._height) {
				this._height = wijmo.asNumber(value, false, true);
				this._heightChanged.raise(this, EventArgs.empty);
			}
		}

		//#endregion

		//#region public methods

		// overrides
		public drawText(text, x?, y?, options?: IPdfTextDrawSettings): IPdfTextMeasurementInfo {
			options = options || {};
			// To be able to draw below the page bottom margin without adding a new page automatically, header and footer are positioned outside the native page margins.
			options.height = Infinity; 
			return super.drawText(text, x, y, options);
		}

		//#endregion
	}
} 