module wijmo.pdf {
	'use strict';

	/**
	 * Represents a font.
	 */
	export class PdfFont {
		public static _DEF_NATIVE_NAME = 'Times-Roman';
		public static _DEF_FAMILY_NAME = 'times';

		public static _KNOWN_WEIGHTS = {
			'normal': 1, 'bold': 1, '100': 1, '200': 1, '300': 1, '400': 1, '500': 1, '600': 1, '700': 1, '800': 1, '900': 1
		};
		public static _KNOWN_STYLES = {
			'normal': 1, 'italic': 1, 'oblique': 1
		};

		public static _DEF_PDFKIT_FONT = new PdfFont('helvetica', 12);
		public static _DEF_FONT = new PdfFont();

		private _family: string;
		private _size: number;
		private _style: string;
		private _weight: string;

		/**
		* Initializes a new instance of the @see:PdfFont class.
		*
		* @param family The family name of the font.
		* @param size The size of the font.
		* @param style The style of the font.
		* @param weight The weight of the font.
		*/
		constructor(family = 'times', size = 10, style = 'normal', weight = 'normal') {
			this.family = family;
			this.size = size;
			this.style = style;
			this.weight = weight;
		}

		/**
		* Gets or sets the family name of the font.
		*
		* The list of the font family names in the order of preferences,
		* separated by commas. Each font family name can be the one that
		* was registered using the @see:PdfDocument.registerFont method or
		* the name of one of the PDF standard font families: 'courier',
		* 'helvetica', 'symbol', 'times', 'zapfdingbats' or the superfamily
		* name: 'cursive', 'fantasy', 'monospace', 'serif', 'sans-serif'.
		*/
		public get family(): string {
			return this._family;
		}
		public set family(value: string) {
			this._family = wijmo.asString(value, false);
		}

		/**
		* Gets or sets the size of the font.
		*/
		public get size(): number {
			return this._size;
		}
		public set size(value: number) {
			this._size = wijmo.asNumber(value, false, true);
		}

		/**
		 * Gets or sets the style of the font.
		 *
		 * The following values are supported: 'normal', 'italic', 'oblique'.
		 */
		public get style(): string {
			return this._style;
		}
		public set style(value: string) {
			value = wijmo.asString(value, false);

			if (value) {
				assert(!!PdfFont._KNOWN_STYLES[(value || '').toLowerCase()], _Errors.InvalidArg('value'));
			}

			this._style = value;
		}

		/**
		 * Gets or sets the weight of the font.
		 *
		 * The following values are supported: 'normal', 'bold', '100', '200', '300',
		 * '400', '500', '600', '700', '800', '900'.
		 */
		public get weight(): string {
			return this._weight;
		}
		public set weight(value: string) {
			value = wijmo.asString(value, false);

			if (value) {
				assert(!!PdfFont._KNOWN_WEIGHTS[(value || '').toLowerCase()], _Errors.InvalidArg('value'));
			}

			this._weight = value;
		}

		/**
		* Creates a copy of this @see:PdfFont.
		* @return A copy of this font.
		*/
		clone(): PdfFont {
			return new PdfFont(this.family, this.size, this.style, this.weight);
		}

		/**
		* Determines whether the specified @see:PdfFont instance is equal to the current one.
		*
		* @param value @see:PdfFont to compare.
		* @return true if the specified object is equal to the current one, otherwise false.
		*/
		equals(value: PdfFont): boolean {
			return (value instanceof PdfFont)
				&& (this._family === value._family)
				&& (this._size === value._size)
				&& (this._style === value._style)
				&& (this._weight === value._weight);
		}
	}
}
