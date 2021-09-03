module wijmo.pdf {
	'use strict';

	interface _IPdfFontWeightDescription {
		[index: number]: string; // <weight>: <PDFKit's internal name to use>
	}

	interface _IPdfFontDescription {
		attributes: IPdfFontAttributes;
		normal?: _IPdfFontWeightDescription;
		italic?: _IPdfFontWeightDescription;
		oblique?: _IPdfFontWeightDescription
	}

	interface _IPdfNormalizedFontSelector {
		name: string;
		style: string;
		weight: number;
	}

	class _OrderedDictionary<T> {
		private _values: { key: string; value: T }[] = [];
		private _keys: { [key: string]: number } = {};

		constructor(values?: { key: string; value: T }[]) {
			if (values) {
				for (var i = 0; i < values.length; i++) {
					var val = values[i];

					this._keys[val.key] = i;
					this._values.push({ key: val.key, value: val.value });
				}
			}
		}

		public hasKey(key: string): T {
			var idx = this._keys[key];

			if (idx !== undefined) {
				return this._values[idx].value;
			}

			return null;
		}

		public add(key: string, value: T): T {
			if (!this.hasKey(key)) {
				this._keys[key] = this._values.length;
				this._values.push({ key: key, value: value });
				return value;
			}

			return null;
		}

		public each(fn: (key: string, value: T) => any): void {
			if (fn) {
				for (var i = 0; i < this._values.length; i++) {
					var val = this._values[i];

					if (fn(val.key, val.value) === false) {
						break;
					}
				}
			}
		}

		public eachReverse(fn: (key: string, value: T) => any): void {
			if (fn) {
				for (var i = this._values.length - 1; i >= 0; i--) {
					var val = this._values[i];

					if (fn(val.key, val.value) === false) {
						break;
					}
				}
			}
		}
	}

	/* Provides font registration functionality. */
	export class _PdfFontRegistrar {
		// standard fonts, starting from the specific one
		private _fonts = new _OrderedDictionary<_IPdfFontDescription>([
			{
				key: 'zapfdingbats',
				value: {
					attributes: {
						fantasy: true
					},
					normal: {
						400: 'ZapfDingbats'
					}
				}
			},
			{
				key: 'symbol',
				value: {
					attributes: {
						serif: true
					},
					normal: {
						400: 'Symbol'
					}
				}
			},
			{
				key: 'courier',
				value: {
					attributes: {
						serif: true,
						monospace: true
					},
					normal: {
						400: 'Courier',
						700: 'Courier-Bold'
					},
					oblique: {
						400: 'Courier-Oblique',
						700: 'Courier-BoldOblique'
					}
				}
			},
			{
				key: 'helvetica',
				value: {
					attributes: {
						sansSerif: true
					},
					normal: {
						400: 'Helvetica',
						700: 'Helvetica-Bold'
					},
					oblique: {
						400: 'Helvetica-Oblique',
						700: 'Helvetica-BoldOblique'
					}
				}
			},
			{
				key: 'times',
				value: {
					attributes: {
						serif: true
					},
					normal: {
						400: 'Times-Roman',
						700: 'Times-Bold'
					},
					italic: {
						400: 'Times-Italic',
						700: 'Times-BoldItalic'
					}
				}
			}
		]);

		private _weightNameToNum = {
			'normal': 400,
			'bold': 700
		};

		private _doc: _IPdfKitDocument;
		private _findFontCache: { [uid: string]: string } = {};
		private _internalFontNames: { [key: string]: any; } = {}; // stores all internal names of the registered fonts.

		/*
		 * Initializes a new instance of the @see:_PdfFontRegistrar class.
		 *
		 * @param doc A PDFDocument object.
		 */
		constructor(doc: any) {
			this._doc = doc;

			// fill _internalFontNames
			this._fonts.each((key, value) => {
				var facesIterator = (descr: _IPdfFontWeightDescription) => {
					for (var key in descr) {
						this._internalFontNames[descr[key]] = 1;
					}
				};

				facesIterator(value.normal) || facesIterator(value.italic) || facesIterator(value.oblique);
			});
		}

		/*
		 * Registers a font from ArrayBuffer.
		 *
		 * @param font A font to register.
		 *
		 * @return A PDFKit internal font name.
		 */
		public registerFont(font: IPdfFontFile): string {
			assert(!!font, _Errors.ValueCannotBeEmpty('font'));
			asString(font.name);
			assert(font.source instanceof ArrayBuffer, _Errors.FontSourceMustBeArrayBuffer);

			font = _shallowCopy(font);

			var ns = this._normalizeFontSelector(font.name, font.style, font.weight),
				fntDscr = this._fonts.hasKey(ns.name);

			if (!fntDscr) {
				fntDscr = this._fonts.add(ns.name, { attributes: <IPdfFontAttributes>font });
			}

			var face = fntDscr[ns.style];
			if (!face) {
				face = fntDscr[ns.style] = {};
			}

			var internalName = this._makeInternalName(ns);

			if (!face[ns.weight]) {
				this._doc.registerFont(internalName, font.source, font.family);
				this._findFontCache = {};
				face[ns.weight] = internalName;
				this._internalFontNames[internalName] = 1;
			}

			return internalName;
		}

		/*
		 * Finds the closest registered font for a given font name, style and weight.
		 *		
		 * If exact font with given style and weight properties is not found then,
		 * it tries to search the closest font using font weight fallback 
		 * (https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight).
		 * If still nothing is found, it tries to find the closest font with other style in 
		 * the following order:
		 * 'italic': 'oblique', 'normal'.
		 * 'oblique': 'italic', 'normal'.
		 * 'normal': 'oblique', 'italic'.
		 *
		 * @param name The name of the font that was registered before using the @see:registerFont
		 * or the name of one of the PDF standard fonts: 'courier', 'helvetica', 'symbol', 'times',
		 * 'zapfdingbats', or the superfamily name: 'cursive', 'fantasy', 'monospace', 'serif',
		 * 'sans-serif'.
		 * @param style The style of the font. One of the following values: 'normal',
		 * 'italic', 'oblique'.
		 * @param weight The weight of the font. One of the following values: 'normal',
		 * 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'.
		 * @return A PDFKit internal font name or null.
		 */
		public findFont(name: string, style?: string, weight?: string): string {
			var ns = this._normalizeFontSelector(name, style, weight),
				internalName = this._makeInternalName(ns);

			if (this._findFontCache[internalName]) {
				return this._findFontCache[internalName];
			}

			ns.name += ',' + PdfFont._DEF_FAMILY_NAME; // Try to use the default font family with the same style and weight if specifed font will not be found.

			for (var i = 0, names = ns.name.split(','); i < names.length; i++) {
				var tmp = this._findFont(names[i].replace(/["']/g, '').trim(), ns.style, ns.weight);
				if (tmp) {
					return this._findFontCache[internalName] = tmp;
				}
			}

			return this._findFontCache[internalName] = this._internalFontNames[name]
				? name
				: PdfFont._DEF_NATIVE_NAME; // use default name if closest font can not be found
		}

		private _normalizeFontSelector(name: string, style?: string, weight?: string): _IPdfNormalizedFontSelector {
			return {
				name: (name || '').toLowerCase(),
				style: (style || PdfFont._DEF_FONT.style).toLowerCase(),
				weight: parseInt(this._weightNameToNum[weight] || weight) || parseInt(this._weightNameToNum[PdfFont._DEF_FONT.weight])
			}
		}

		private _findFont(name: string, style?: string, weight?: number): string {
			var facesToTest: string[] = [],
				res: string;

			switch (style) {
				// setup fallback font styles
				case 'italic':
					facesToTest = ['italic', 'oblique', 'normal'];
					break;
				case 'oblique':
					facesToTest = ['oblique', 'italic', 'normal'];
					break;
				default:
					facesToTest = ['normal', 'oblique', 'italic'];
					break;
			}

			switch (name) {
				case 'cursive':
				case 'fantasy':
				case 'monospace':
				case 'serif':
				case 'sans-serif':
					// try to find closest font within the given font superfamily using font-weight and font-style fallbacks if necessary.
					this._fonts.eachReverse((key, font) => { // try custom fonts first
						var propName = (name === 'sans-serif') ? 'sansSerif' : name;

						if (font.attributes[propName]) {
							for (var i = 0; i < facesToTest.length; i++) {
								res = this._findFontWeightFallback(key, facesToTest[i], weight);
								if (res) {
									return false; // break the loop
								}
							}
						}
					});
					break;

				default:
					if (this._fonts.hasKey(name)) {
						// try to find closest font within the given font family (name) using font-weight and font-style fallbacks if necessary.
						for (var i = 0; i < facesToTest.length && !res; i++) {
							res = this._findFontWeightFallback(name, facesToTest[i], weight);
						}
					}
			}

			return res;
		}

		private _findFontWeightFallback(name: string, style: string, weight: number, availableWeights?: number[]): string {
			var font = this._fonts.hasKey(name);

			if (font && font[style]) {
				var weights = font[style];

				if (weights[weight]) {
					return weights[weight];
				} else {
					// font-weight fallback (https://www.w3.org/TR/2016/WD-CSS22-20160412/fonts.html#font-boldness)

					if (!availableWeights) {
						availableWeights = [];

						for (var key in weights) {
                            availableWeights.push(parseFloat(key));
						}

						availableWeights.sort((a, b) => { return a - b; });
					}

					if (weight > 500) { // the closest available darker weight is used (or, if there is none, the closest available lighter weight).
						var less = 0;

						for (var i = 0; i < availableWeights.length; i++) {
							var cur = availableWeights[i];

							if (cur > weight) {
								return weights[cur];
							} else {
								less = cur;
							}
						}

						if (less) {
							return weights[less];
						}
					} else {
						if (weight < 400) { // the closest available lighter weight is used (or, if there is none, the closest available darker weight).
							var greater = 0;

							for (var i = availableWeights.length - 1; i >= 0; i--) {
								var cur = availableWeights[i];

								if (cur < weight) {
									return weights[cur];
								} else {
									greater = cur;
								}
							}

							if (greater) {
								return weights[greater];
							}
						} else {
							if (weight == 400) { // If the desired weight is 400...
								if (weights[500]) { // ...500 is checked first
									return weights[500]
								} else { // ...and then the rule for desired weights less than 400 is used
									return this._findFontWeightFallback(name, style, 300, availableWeights);
								}
							} else { // If the desired weight is 500...
								if (weights[400]) { // ...400 is checked first
									return weights[400]
								} else { // ...and then the rule for desired weights less than 400 is used.
									return this._findFontWeightFallback(name, style, 300, availableWeights);
								}
							}
						}
					}
				}
			}

			return null;
		}

		private _makeInternalName(ns: _IPdfNormalizedFontSelector): string {
			return ns.name + '-' + ns.style + '-' + ns.weight;
		}
	}
}
