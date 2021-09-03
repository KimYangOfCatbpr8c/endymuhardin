module wijmo.pdf {
	'use strict';

	/**
	 * Provides arguments for the @see:PdfDocument.end event.
	 */
	export class PdfDocumentEndedEventArgs extends EventArgs {
		private _blob: Blob;

		/**
		* Initializes a new instance of the @see:PdfDocumentEndedEventArgs class.
		*
		* @param blob A Blob object that contains the document data.
		*/
		constructor(blob: Blob) {
			super();
			this._blob = blob;
		}

		/**
		 * Gets a Blob object that contains the document data.
		 */
		public get blob(): Blob {
			return this._blob;
		}
	}
}
