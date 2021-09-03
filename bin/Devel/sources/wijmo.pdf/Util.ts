module wijmo.pdf {
	'use strict';

	export var _IE = 'ActiveXObject' in window;

	var _FontSizePt = {
		'xx-small': 7,
		'x-small': 7.5,
		small: 10,
		medium: 12,
		large: 13.5,
		'x-large': 18,
		'xx-large': 24
	};

	/**
	 * Saves the Blob object as a file.
	 * @param blob The Blob object to save.
	 * @param fileName The name with which the file is saved.
	*/
	export function saveBlob(blob: Blob, fileName: string): void {
		if (!blob || !(blob instanceof Blob) || !fileName) {
			return;
		}

		if (navigator.msSaveBlob) {
			navigator.msSaveBlob(blob, fileName);
		} else {
			var link = <HTMLAnchorElement>document.createElement('a'),
				click = function (element) {
					var evnt = <MouseEvent>document.createEvent('MouseEvents');
					evnt.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
					element.dispatchEvent(evnt);
				},
				fr = new FileReader();

			// Save a blob using data URI scheme
			fr.onloadend = (e) => {
				(<any>link).download = fileName;
				link.href = fr.result;
				click(link);
				link = null;
			};

			fr.readAsDataURL(blob);
		}
	}

	/**
	* Converts a point unit value to a pixel unit value.
	*
	* @param value The value to convert.
	* @return The converted value.
	*/
	export function ptToPx(value: number): number {
		return wijmo.asNumber(value) / 0.75; // * 96 / 72;
	}

	/**
	* Converts a pixel unit value to a point unit value.
	*
	* @param value The value to convert.
	* @return The converted value.
	*/
	export function pxToPt(value: number): number {
		return wijmo.asNumber(value) * 0.75; // * 72 / 96;
	}

	/*
	* Converts a value to @see:wijmo.Color.
	*
	* If value is @see:wijmo.Color then, the original or cloned value will be returned
	* depending on the cloned parameter.
	* If value is a string, then a new @see:wijmo.Color instance will be created.
	* If value is omitted, then a new @see:wijmo.Color instance designated with black color 
	* will be created.
	*
	* @param colorOrString Value to convert.
	* @param clone Indicates whether the original @see:wijmo.Color value should be cloned.
	* @return A @see:wijmo.Color.
	*/
	export function _asColor(colorOrString: any, clone = true): Color { // colorOrString: Color | string
		var res: Color;

		if (!colorOrString) {
			res = Color.fromRgba(0, 0, 0);
		} else {
			if (colorOrString instanceof Color) {
				res = clone
				? Color.fromRgba((<Color>colorOrString).r, (<Color>colorOrString).g, (<Color>colorOrString).b, (<Color>colorOrString).a)
				: colorOrString;
			} else {
				res = Color.fromString(colorOrString);
			}
		}

		wijmo.assert(res instanceof Color, _Errors.InvalidArg('colorOrString'));

		return res;
	}

	/*
	* Converts a value to a @see:PdfPen.
	*
	* If value is a @see:PdfPen then the original value will be returned.
	* If value is a string or a @see:wijmo.Color then a new @see:PdfPen instance will be created using value as a color argument.
	*
	* @param penOrColor Value to convert.
	* @param nullOK Whether null values are acceptable.
	* @return A @see:PdfPen.
	*/
	export function _asPdfPen(penOrColor: any, nullOK = true): PdfPen { // penOrColor: PdfPen | Color | string
		if (wijmo.isString(penOrColor) || (penOrColor instanceof Color)) {
			penOrColor = new PdfPen(penOrColor);
		}

		assert((penOrColor == null && nullOK) || penOrColor instanceof PdfPen, _Errors.InvalidArg('penOrColor'));

		return penOrColor;
	}

	/*
	* Converts a value to a @see:PdfBrush.
	*
	* If value is a @see:PdfBrush, then the original value will be returned.
	* If value is a string or a @see:wijmo.Color, then a new @see:PdfSolidBrush 
	* instance will be created using value as a color argument.
	*
	* @param brushOrColor Value to convert.
	* @param nullOK Whether null values are acceptable.
	* @return A @see:PdfBrush.
	*/
	export function _asPdfBrush(brushOrColor: any, nullOK = true): PdfBrush { // brushOrColor: PdfBrush | Color | string
		if (wijmo.isString(brushOrColor) || (brushOrColor instanceof Color)) {
			brushOrColor = new PdfSolidBrush(brushOrColor);
		}

		assert((brushOrColor == null && nullOK) || brushOrColor instanceof PdfBrush, _Errors.InvalidArg('brushOrColor'));

		return brushOrColor;
	}

	/*
	* Asserts that value is a @see:PdfFont.
	*
	* @param font Value to check.
	* @param nullOK Whether null values are acceptable.
	* @return A @see:PdfFont.
	*/
	export function _asPdfFont(font: PdfFont, nullOK = true): PdfFont {
		assert((font == null && nullOK) || font instanceof PdfFont, _Errors.InvalidArg('font'));
		return font;
	}

	/*
	* Converts a value to a point unit value.
	*
	* The following values are supported:
	* <ul>
	*	<li>A number or numeric string or string postfixed with 'pt', treated as a point unit value.</li>
	*	<li>A string postfixed with the 'px'</li>
	*	<li>A font size value: 'xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large'.</li>
	* </ul>
	*
	* @param value The value to convert.
	* @param emptyOK Whether empty values ('', null, undefined) are acceptable.
	* @param emptyValue A value to be returned, if the provided value is empty.
	* @return The converted value or an exception if conversion fails.
	*/
	export function _asPt(value: any, emptyOK = true, emptyValue = 0): number {
		var isEmpty = !value && value !== 0;

		assert(!isEmpty || emptyOK, _Errors.ValueCannotBeEmpty('value'));

		if (isEmpty) {
			return emptyValue;
		}

		if (wijmo.isNumber(value)) {
			if (value === value) {
				return value;
			}
		} else {
			if (wijmo.isString(value)) {
				if (_FontSizePt[value]) {
					return _FontSizePt[value];
				}

				var num = parseFloat(value);
				if (num === num) {
					if (value.match(/(px)$/i)) {
						return pxToPt(num);
					}

					if (value == num || value.match(/(pt)$/i)) {
						return num;
					}
				}
			}
		}

		assert(false, _Errors.InvalidFormat(value));
	}

	/*
	* Replaces each macro item in a specified string with the text equivalent to an object's
	* value.
	*
	* The function works by replacing parts of the <b>str</b> with the pattern
	* '&[MacroName]' with properties of the <b>dict</b> argument.
	*
	* Use '&&' to indicate an actual ampersand.
	*
	* @param str A string to format.
	* @param dict The macros dictionary used to format the string.
	* @return The formatted string.
	*/
	export function _formatMacros(str: string, dict: any): string {
		var amps = {},
			ampsCnt = 0;

		// && -> &
		str = str.replace(/&&/g, (match, offset, str) => {
			amps[offset - (ampsCnt * 2) + ampsCnt] = true; // store the position of an actual ampersand within the string
			ampsCnt++;
			return '&';
		});

		// process macros
		str = str.replace(/&\[(\S+?)\]/g, (match, p1, offset, str) => {
			var macros = dict[p1];

			return macros && !amps[offset]
				? macros
				: match;
		});

		return str;
	}

	/*
	* Compares two objects with priority of the obj.equals(), if provided.
	*
	* @param a The first object to compare.
	* @param b The second object to compare.
	* @return True if the specified objects are equal, otherwise false.
	*/
	export function _compare(a: any, b: any): boolean {
		if (wijmo.isObject(a) && wijmo.isObject(b)) {
			for (var key in a) {
				if (key && ((<string>key)[0] === '_')) {
					continue;
				}

				var val = a[key],
					cmp = val && wijmo.isFunction(val.equals) ? val.equals(b[key]) : _compare(val, b[key]);

				if (!cmp) {
					return false;
				}
			}

			return true;
		} else {
			if (wijmo.isArray(a) && wijmo.isArray(b)) {
				if (a.length !== b.length) {
					return false;
				}

				for (var i = 0; i < a.length; i++) {
					if (!_compare(a[i], b[i])) {
						return false;
					}
				}

				return true;
			}
		}

		// todo: compare Dates, if necessary.

		return a === b;
	}

	/*
	* Creates a shallow copy of the source object.
	*
	* @param src The source object.
	* @return A shallow copy of the source object. 
	*/
	export function _shallowCopy(src: any): any {
		var dst = {};

		if (src) {
			for (var key in src) {
				dst[key] = src[key];
			}
		}

		return dst;
	}

	/*
	* Capitalizes the first character of the string and converts all other characters to lowercase.
	*
	* @param value The string to convert.
	* @return The converted string.
	*/
	export function _toTitleCase(value: string): string {
		if (value) {
			return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
		}

		return value;
	}
} 