/**
 * The module has a dependency on the <a href="https://stuk.github.io/jszip" target="_blank">JSZip</a> library,
 * which should be referenced in html page with the markup like this:
 * <pre>&lt;script src="http://cdnjs.cloudflare.com/ajax/libs/jszip/2.5.0/jszip.min.js"&gt;&lt;/script&gt;</pre>
*/
module wijmo.xlsx {
	'use strict';

	/**
	 * Represents an Excel Workbook. 
	 */
	export class Workbook implements IWorkbook {
		/**
		 * Gets or sets the name of application that generated the file that appears in the file properties.
		 */
		public application: string;
		/**
		 * Gets or sets the name of company that generated the file that appears in the file properties.
		 */
		public company: string;
		/**
		 * Gets or sets the creator of the xlsx file.
		 */
		public creator: string;
		/**
		 * Gets or sets the creation time of the xlsx file.
		 */
		public created: Date;
		/**
		 * Gets or sets the last modifier of the xlsx file.
		 */
		public lastModifiedBy: string;
		/**
		 * Gets or sets the last modified time of the xlsx file.
		 */
		public modified: Date;
		/**
		 * Gets or sets the index of the active sheet in the xlsx file.
		 */
		public activeWorksheet: number;
		
		private _reservedContent: any;
		private _sheets: WorkSheet[];
		private _styles: WorkbookStyle[];
		private static _alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		private static _formatMap = {
			n: '#,##0{0}',
			c: '{1}#,##0{0}_);({1}#,##0{0})',
			p: '0{0}%',
			f: '0{0}',
            d: '{0}',
            g: '0{0}'
        };

        /**
         * Initializes a new instance of the @see:Workbook class.
         */
        constructor() {
        }

		/**
		 * Gets the WorkSheet array of the Workbook.
		 */
		get sheets(): WorkSheet[] {
			if (this._sheets == null) {
				this._sheets = [];
			}
			return this._sheets;
		}

		/**
		 * Gets the styles table of the workbook.
		 */
		get styles(): WorkbookStyle[] {
			if (this._styles == null) {
				this._styles = [];
			}
			return this._styles;
		}

		/**
		 * Gets or sets the reserved content from xlsx file that flexgrid or flexsheet doesn't support yet.
		 */
		get reservedContent(): any {
			if (this._reservedContent == null) {
				this._reservedContent = {};
			}
			return this._reservedContent;
		}
		set reservedContent(value: any) {
			this._reservedContent = value;
        }

		/**
		 * Saves the book to a file and returns a base-64 string representation of
         * the book.
		 *
		 * For example, this sample creates an xlsx file with a single cell:
         *
         * <pre>function exportXlsx(fileName) {
         *     var book = new wijmo.xlsx.Workbook(),
		 *         sheet = new wijmo.xlsx.WorkSheet(),
		 *         bookRow = new wijmo.xlsx.WorkbookRow(),
		 *         bookCell = new wijmo.xlsx.WorkbookCell();
		 *     bookCell.value = 'Hello, Excel!';
		 *     bookRow.cells.push(bookCell);
		 *     sheet.rows.push(bookRow);
		 *     book.sheets.push(sheet);
         *     book.save(fileName);
         * }</pre>
         *
         * The file name is optional. If not provided, the method still returns
         * a base-64 string representing the book. This string can be used for
         * further processing on the client or on the server.
		 *
		 * @param fileName Name of the xlsx file to save.
         * @return A base-64 string representing the content of the file.
		 */
		save(fileName?: string): string { 
			var suffix: string,
				suffixIndex: number,
				blob: Blob,
				result = _xlsx(this._serialize()),
				nameSuffix = this._reservedContent && this._reservedContent.macros ? 'xlsm' : 'xlsx',
				applicationType = nameSuffix === 'xlsm' ? 'application/vnd.ms-excel.sheet.macroEnabled.12' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

			if (fileName) {
				suffixIndex = fileName.lastIndexOf('.');
				if (suffixIndex < 0) {
					fileName += '.' + nameSuffix;
				} else if (suffixIndex === 0) {
					throw 'Invalid file name.';
				} else {
					suffix = fileName.substring(suffixIndex + 1);
					if (suffix === '') {
						fileName += '.' + nameSuffix;
					} else if (suffix !== nameSuffix) {
						fileName += '.' + nameSuffix;
					}
				}
				blob = new Blob([Workbook._base64DecToArr(result.base64)], { type: applicationType });
				this._saveToFile(blob, fileName);
			}
			return result.base64;
		}

		/**
		 * Loads from base 64 string or data url.
		 *
		 * For example:
         * <pre>// This sample opens an xlsx file chosen from Open File
         * // dialog and creates a workbook instance to load the file.
         * &nbsp;
         * // HTML
         * &lt;input type="file" 
         *     id="importFile" 
         *     accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
         * /&gt;
         * &nbsp;
         * // JavaScript
         * var workbook, // receives imported IWorkbook
         *     importFile = document.getElementById('importFile');
         * &nbsp;
         * importFile.addEventListener('change', function () {
         *     loadWorkbook();
         * });
         * &nbsp;
         * function loadWorkbook() {
         *     var reader,
         *         workbook,
         *         file = importFile.files[0];
         *     if (file) {
		 *         reader = new FileReader();
		 *         reader.onload = function (e) {
		 *            workbook = new wijmo.xlsx.Workbook(),
         *            workbook.load(reader.result);
         *         };
         *         reader.readAsDataURL(file);
         *     }
         * }</pre>
		 *
		 * @param base64 the base 64 string that contains the xlsx file content.
		 */
		load(base64: string) {
			var dataPrefixIndex: number;

			if (base64 == null || base64.length === 0) {
				throw 'Invalid xlsx file content.';
			}

			dataPrefixIndex = base64.search(/base64,/i);
			if (dataPrefixIndex !== -1) {
				base64 = base64.substring(dataPrefixIndex + 7);
			}
			this._deserialize(_xlsx(base64));
		}

		// Serializes the workbook instance to workbook object model. 
		_serialize(): IWorkbook {
			var workbookOM: IWorkbook = { sheets: [] };

			workbookOM.sheets = this._serializeWorkSheets();
			if (this._styles && this._styles.length > 0) {
				workbookOM.styles = this._serializeWorkbookStyles();
			}
			if (this._reservedContent) {
				workbookOM.reservedContent = this._reservedContent;
			}
			if (this.activeWorksheet != null && !isNaN(this.activeWorksheet) && this.activeWorksheet >= 0) {
				workbookOM.activeWorksheet = this.activeWorksheet;
			}
			if (this.application) {
				workbookOM.application = this.application;
			}
			if (this.company) {
				workbookOM.company = this.company;
			}
			if (this.created != null) {
				workbookOM.created = this.created;
			}
			if (this.creator) {
				workbookOM.creator = this.creator;
			}
			if (this.lastModifiedBy) {
				workbookOM.lastModifiedBy = this.lastModifiedBy;
			}
			if (this.modified != null) {
				workbookOM.modified = this.modified;
			}
			return workbookOM;
		}

		// Deserializes the workbook object model to workbook instance.
		_deserialize(workbookOM: IWorkbook) {
			this._deserializeWorkSheets(workbookOM.sheets);
			if (workbookOM.styles && workbookOM.styles.length > 0) {
				this._deserializeWorkbookStyles(workbookOM.styles);
			}
			this.activeWorksheet = workbookOM.activeWorksheet;
			this.application = workbookOM.application;
			this.company = workbookOM.company;
			this.created = workbookOM.created;
			this.creator = workbookOM.creator;
			this.lastModifiedBy = workbookOM.lastModifiedBy;
			this.modified = workbookOM.modified;
			this.reservedContent = workbookOM.reservedContent;
		}

		// add worksheet instance into the _sheets array of the workbook.
		_addWorkSheet(workSheet: WorkSheet, sheetIndex?: number) {
			if (this._sheets == null) {
				this._sheets = [];
			}

			if (sheetIndex != null && !isNaN(sheetIndex)) {
				this._sheets[sheetIndex] = workSheet;
			} else {
				this._sheets.push(workSheet);
			}
		}

		// Save the blob object generated by the workbook instance to xlsx file.
		private _saveToFile(blob: Blob, fileName: string) {
			var reader: FileReader,
				link: HTMLAnchorElement,
				click: Function;

			if (navigator.msSaveBlob) {
				// Saving the xlsx file using Blob and msSaveBlob in IE.
				navigator.msSaveBlob(blob, fileName);
			} else {
				reader = new FileReader();
				link = <HTMLAnchorElement>document.createElement('a');
				click = (element: HTMLElement) => {
					var evnt = <MouseEvent>document.createEvent('MouseEvents');
					evnt.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
					element.dispatchEvent(evnt);
				};
				reader.onload = () => {
					(<any>link).download = fileName;
					link.href = reader.result;
					click(link);
					link = null;
				};
				reader.readAsDataURL(blob);
			}
		}

		/**
		 * Converts the wijmo date format to Excel format.
		 *
		 * @param format The wijmo date format.
		 * @return Excel format representation.
		 */
		static toXlsxDateFormat(format: string): string {
			var xlsxFormat: string;

			if (format.length === 1) {
				switch (format) {
					case 'r':
					case 'R':
						return 'ddd, dd MMM yyyy HH:mm:ss &quot;GMT&quot;';
					case 'u':
						return 'yyyy-MM-dd&quot;T&quot;HH:mm:ss&quot;Z&quot;';
					case 'o':
					case 'O':
						xlsxFormat = wijmo.culture.Globalize.calendar.patterns[format];
						xlsxFormat = xlsxFormat.replace(/f+k/gi, '000');
						break;
					default:
						xlsxFormat = wijmo.culture.Globalize.calendar.patterns[format];
						break;
				}
			}
			if (!xlsxFormat) {
				xlsxFormat = format;
			}
			xlsxFormat = xlsxFormat.replace(/"/g, '')
				.replace(/tt/, 'AM/PM')
				.replace(/t/, 'A/P')
				.replace(/M+/gi, (str: string) => {
					return str.toLowerCase();
				}).replace(/g+y+/gi, (str: string) => {
					return str.substring(0, str.indexOf('y')) + 'e';
                });
            if (/FY|Q/i.test(xlsxFormat)) {
                return 'General';
            }
			return xlsxFormat;
		}

		/**
		 * Converts the wijmo number format to xlsx format.
		 *
		 * @param format The wijmo number format.
		 * @return Excel format representation.
		 */
		static toXlsxNumberFormat(format: string): string {
			var dec = -1,
				wijmoFormat = format ? format.toLowerCase() : '',
				fisrtFormatChar = wijmoFormat[0],
				mapFormat = this._formatMap[fisrtFormatChar],
				currencySymbol = wijmo.culture.Globalize.numberFormat.currency.symbol,
				commaArray = wijmoFormat.split(','),
				decimalArray = [],
				xlsxFormat: string,
				i: number;

			if (mapFormat) {
				if (fisrtFormatChar === 'c') {
					mapFormat = mapFormat.replace(/\{1\}/g, currencySymbol);
				}

                if (wijmoFormat.length > 1) {
                    dec = parseInt(commaArray[0].substr(1));
                } else {
                    dec = 2;
                }

				if (!isNaN(dec)) {
					for (i = 0; i < dec; i++) {
						decimalArray.push(0);
					}
				}

				for (i = 0; i < commaArray.length - 1; i++) {
					decimalArray.push(',');
				}

				if (decimalArray.length > 0) {
					if (fisrtFormatChar === 'd') {
						xlsxFormat = mapFormat.replace(/\{0\}/g, decimalArray.join(''));
					} else {
						xlsxFormat = mapFormat.replace(/\{0\}/g, (!isNaN(dec) && dec > 0 ? '.' : '') + decimalArray.join(''));
					}
				} else {
					if (fisrtFormatChar === 'd') {
						xlsxFormat = mapFormat.replace(/\{0\}/g, '0');
					} else {
						xlsxFormat = mapFormat.replace(/\{0\}/g, '');
					}
				}
			} else {
				xlsxFormat = wijmoFormat;
			}

			return xlsxFormat;
		}


		/**
		 * Converts the xlsx multi-section format string to an array of corresponding wijmo formats.
		 *
		 * @param xlsxFormat The Excel format string, that may contain multiple format sections separated by semicolon.
		 * @return An array of .Net format strings where each element corresponds to a separate Excel format section.
		 * The returning array always contains at least one element. It can be an empty string in case the passed Excel format is empty.
		 */
		static fromXlsxFormat(xlsxFormat: string): string[] {
			var wijmoFormats: string[] = [],
				wijmoFormat: string,
				formats: string[],
				currentFormat: string,
				i: number,
				j: number,
				lastDotIndex: number,
				lastZeroIndex: number,
				lastCommaIndex: number,
				commaArray: string[],
				currencySymbol = wijmo.culture.Globalize.numberFormat.currency.symbol;

			if (!xlsxFormat || xlsxFormat === 'General') {
				return [''];
			}

			xlsxFormat = xlsxFormat.replace(/;@/g, '')
				.replace(/&quot;?/g, '');
			formats = xlsxFormat.split(';');

			for (i = 0; i < formats.length; i++) {
				currentFormat = formats[i];

				if (/[hsmy\:]/i.test(currentFormat)) {
					wijmoFormat = currentFormat.replace(/\[\$\-.+\]/g, '')
						.replace(/(\\)(.)/g, '$2')
						.replace(/H+/g, (str: string) => {
							return str.toLowerCase();
						}).replace(/m+/g, (str: string) => {
							return str.toUpperCase();
						}).replace(/S+/g, (str: string) => {
							return str.toLowerCase();
						}).replace(/AM\/PM/gi, 'tt')
						.replace(/A\/P/gi, 't')
						.replace(/\.000/g, '.fff')
						.replace(/\.00/g, '.ff')
						.replace(/\.0/g, '.f')
						.replace(/\\[\-\s,]/g, (str: string) => {
							return str.substring(1);
						}).replace(/Y+/g, (str: string) => {
							return str.toLowerCase();
						}).replace(/D+/g, (str: string) => {
							return str.toLowerCase();
						}).replace(/M+:?|:?M+/gi, (str: string) => {
							if (str.indexOf(':') > -1) {
								return str.toLowerCase();
							} else {
								return str;
							}
						}).replace(/g+e/gi, (str: string) => {
							return str.substring(0, str.length - 1) + 'yy';
						});
				} else {
					lastDotIndex = currentFormat.lastIndexOf('.');
					lastZeroIndex = currentFormat.lastIndexOf('0');
					lastCommaIndex = currentFormat.lastIndexOf(',');
					if (currentFormat.search(/\[\$([^\-\]]+)[^\]]*\]/) > -1 || // Foreign Currency
						(currentFormat.indexOf(currencySymbol) > -1 && currentFormat.search(/\[\$([\-\]]+)[^\]]*\]/) === -1)) {
						wijmoFormat = 'c';
					} else if (currentFormat[xlsxFormat.length - 1] === '%') {
						wijmoFormat = 'p';
					} else {
						wijmoFormat = 'n';
					}

					if (lastDotIndex > -1 && lastDotIndex < lastZeroIndex) {
						wijmoFormat += currentFormat.substring(lastDotIndex, lastZeroIndex).length;
					} else {
						wijmoFormat += '0';
					}

					if (/^0+,*$/.test(currentFormat)) {
						lastZeroIndex = currentFormat.lastIndexOf('0');
						wijmoFormat = 'd' + (lastZeroIndex + 1);
					}

					if (lastCommaIndex > -1 && lastZeroIndex < lastCommaIndex) {
						commaArray = currentFormat.substring(lastZeroIndex + 1, lastCommaIndex + 1).split('');
						for (j = 0; j < commaArray.length; j++) {
							wijmoFormat += ',';
						}
					}
				}

				wijmoFormats.push(wijmoFormat);
			}

			return wijmoFormats;
		}

		// Parse the cell format of flex grid to excel format.
		static _parseCellFormat(format: string, isDate: boolean): string {
			if (isDate) {
				return this.toXlsxDateFormat(format);
			}

			return this.toXlsxNumberFormat(format);
		}

		// parse the basic excel format to js format
		static _parseExcelFormat(item: any): string {
			if (item === undefined || item === null
				|| item.value === undefined || item.value === null
				|| isNaN(item.value)) {
				return undefined;
			}

			var formatCode = item.style && item.style.format ? item.style.format : '',
				format = '';

			if (item.isDate || isDate(item.value)) {
				format = this.fromXlsxFormat(formatCode)[0];
			} else if (isNumber(item.value)) {
				if (!formatCode || formatCode === 'General') {
					format = isInt(item.value) ? 'd' : 'f2';
				} else {
					format = this.fromXlsxFormat(formatCode)[0];
				}
			} else {
				format = formatCode;
			}

			return format;
		}

		/**
		 * Converts zero-based cell, row or column index to Excel alphanumeric representation.
		 *
		 * @param row The zero-based row index or a null value if only column index should be converted.
		 * @param col The zero-based column index or a null value if only row index should be converted.
		 * @param absolute True value indicates that absolute indexes should be returned for both row and
		 *        column indexes (like $D$7). The <b>absoluteCol</b> parameter allows to redefine this value for the column index.
		 * @param absoluteCol True value indicates that column index is absolute.
		 * @return The alphanumeric Excel index representation.
		*/
		static xlsxAddress(row: number, col: number, absolute?: boolean, absoluteCol?: boolean): string {
			var absRow = absolute ? '$' : '',
				absCol = absoluteCol == null ? absRow : (absoluteCol ? '$' : '');
			return (isNaN(col) ? '' : absCol + this._numAlpha(col)) + (isNaN(row) ? '' : absRow + (row + 1).toString());
		}

		/**
		 * Convert Excel's alphanumeric cell, row or column index to the zero-based row/column indexes pair.
		 *
		 * @param xlsxIndex The alphanumeric Excel index that may include alphabetic A-based on column index
		 * and/or numeric 1-based on row index, like "D15", "D" or "15". The alphabetic column index can be
		 * in lower or upper case.
		 * @return The object with <b>row</b> and <b>col</b> properties containing zero-based row and/or column indexes.
		 * If row or column component is not specified in the alphanumeric index then corresponding returning property is undefined.
		 */
		static tableAddress(xlsxIndex: string): ITableAddress {
			var patt = /^((\$?)([A-Za-z]+))?((\$?)(\d+))?$/,
				m = xlsxIndex && patt.exec(xlsxIndex),
				ret = <ITableAddress>{};

			if (!m) {
				return null;
			}
			if (m[3]) {
				ret.col = this._alphaNum(m[3]);
				ret.absCol = !!m[2];
			}
			if (m[6]) {
				ret.row = +m[6] - 1;
				ret.absRow = !!m[5];
			}
			return ret;
		}

		// Parse the horizontal alignment enum to string.
		static _parseHAlignToString(hAlign: HAlign): string {
			switch (hAlign) {
				case HAlign.Left:
					return 'left';
				case HAlign.Center:
					return 'center';
				case HAlign.Right:
					return 'right';
				default:
					return null;
			}
		}

		// Parse the horizontal alignment string to enum.
		static _parseStringToHAlign(hAlign: string): HAlign {
			var strAlign = hAlign ? hAlign.toLowerCase() : '';

			if (strAlign === 'left') {
				return HAlign.Left;
			}
			if (strAlign === 'center') {
				return HAlign.Center;
			}
			if (strAlign === 'right') {
				return HAlign.Right;
			}

			return null;
		}

		// Parse the vartical alignment enum to string.
		static _parseVAlignToString(vAlign: VAlign): string {
			switch (vAlign) {
				case VAlign.Bottom:
					return 'bottom';
				case VAlign.Center:
					return 'center';
				case VAlign.Top:
					return 'top';
				default:
					return null;
			}
		}

		// Parse the vartical alignment string to enum.
		static _parseStringToVAlign(vAlign: string): VAlign {
			var strAlign = vAlign ? vAlign.toLowerCase() : '';

			if (strAlign === 'top') {
				return VAlign.Top;
			}
			if (strAlign === 'center') {
				return VAlign.Center;
			}
			if (strAlign === 'bottom') {
				return VAlign.Bottom;
			}

			return null;
        }

        // Parse the border type enum to string.
        static _parseBorderTypeToString(type: BorderStyle): string {
            switch (type) {
                case BorderStyle.Dashed:
                    return 'dashed';
                case BorderStyle.Dotted:
                    return 'dotted';
                case BorderStyle.Double:
                    return 'double';
                case BorderStyle.Hair:
                    return 'hair';
                case BorderStyle.Medium:
                    return 'medium';
                case BorderStyle.MediumDashDotDotted:
                    return 'mediumDashDotDot';
                case BorderStyle.MediumDashDotted:
                    return 'mediumDashDot';
                case BorderStyle.MediumDashed:
                    return 'mediumDashed';
                case BorderStyle.SlantedMediumDashDotted:
                    return 'slantDashDot';
                case BorderStyle.Thick:
                    return 'thick';
                case BorderStyle.Thin:
                    return 'thin';
                case BorderStyle.ThinDashDotDotted:
                    return 'dashDotDot';
                case BorderStyle.ThinDashDotted:
                    return 'dashDot';
                case BorderStyle.None:
                default:
                    return 'none';
            }
        }

        // Parse border type string to border type enum.
        static _parseStringToBorderType(type: string): BorderStyle {
            if (type === 'dashed') {
                return BorderStyle.Dashed;
            }
            if (type === 'dotted') {
                return BorderStyle.Dotted;
            }
            if (type === 'double') {
                return BorderStyle.Double;
            }
            if (type === 'hair') {
                return BorderStyle.Hair;
            }
            if (type === 'medium') {
                return BorderStyle.Medium;
            }
            if (type === 'mediumDashDotDot') {
                return BorderStyle.MediumDashDotDotted;
            }
            if (type === 'mediumDashDot') {
                return BorderStyle.MediumDashDotted;
            }
            if (type === 'mediumDashed') {
                return BorderStyle.MediumDashed;
            }
            if (type === 'slantDashDot') {
                return BorderStyle.SlantedMediumDashDotted;
            }
            if (type === 'thick') {
                return BorderStyle.Thick;
            }
            if (type === 'thin') {
                return BorderStyle.Thin;
            }
            if (type === 'dashDotDot') {
                return BorderStyle.ThinDashDotDotted;
            }
            if (type === 'dashDot') {
                return BorderStyle.ThinDashDotted;
            }
            return null;
        }

		//TBD: make these functions accessible from c1xlsx.ts and reference them there.
		
		// Parse the number to alphat
		// For e.g. 5 will be converted to 'E'.
		private static _numAlpha(i: number): string {
			var t = Math.floor(i / 26) - 1;

			return (t > -1 ? this._numAlpha(t) : '') + this._alphabet.charAt(i % 26);
		}
		private static _alphaNum(s: string) {
			var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
				t = 0;

            if (!!s) {
                s = s.toUpperCase();
            }
			if (s.length === 2) {
				t = this._alphaNum(s.charAt(0)) + 1;
			}
			return t * 26 + this._alphabet.indexOf(s.substr(-1));
		}

		// taken from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding#The_.22Unicode_Problem.22
		private static _b64ToUint6(nChr: number): number {
			return nChr > 64 && nChr < 91 ?
				nChr - 65
				: nChr > 96 && nChr < 123 ?
				nChr - 71
				: nChr > 47 && nChr < 58 ?
				nChr + 4
				: nChr === 43 ?
				62
				: nChr === 47 ?
				63
				:
				0;
		}

		// decode the base64 string to int array
		static _base64DecToArr(sBase64: string, nBlocksSize?: number): Uint8Array {
			var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""),
				nInLen = sB64Enc.length,
				nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2,
				taBytes = new Uint8Array(nOutLen);

			for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
				nMod4 = nInIdx & 3;
				nUint24 |= this._b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
				if (nMod4 === 3 || nInLen - nInIdx === 1) {
					for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
						taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
					}
					nUint24 = 0;
				}
			}
			return taBytes;
		}

		// taken from https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
		/* Base64 string to array encoding */
		private static _uint6ToB64(nUint6: number): number {
			return nUint6 < 26 ?
				nUint6 + 65
				: nUint6 < 52 ?
				nUint6 + 71
				: nUint6 < 62 ?
				nUint6 - 4
				: nUint6 === 62 ?
				43
				: nUint6 === 63 ?
				47
				:
				65;
		}

		static _base64EncArr(aBytes: Uint8Array): string {
			var nMod3 = 2, sB64Enc = "";

			for (var nLen = aBytes.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++) {
				nMod3 = nIdx % 3;
				if (nIdx > 0 && (nIdx * 4 / 3) % 76 === 0) { sB64Enc += "\r\n"; }
				nUint24 |= aBytes[nIdx] << (16 >>> nMod3 & 24);
				if (nMod3 === 2 || aBytes.length - nIdx === 1) {
					sB64Enc += String.fromCharCode(this._uint6ToB64(nUint24 >>> 18 & 63), this._uint6ToB64(nUint24 >>> 12 & 63), this._uint6ToB64(nUint24 >>> 6 & 63), this._uint6ToB64(nUint24 & 63));
					nUint24 = 0;
				}
			}

			return sB64Enc.substr(0, sB64Enc.length - 2 + nMod3) + (nMod3 === 2 ? '' : nMod3 === 1 ? '=' : '==');
		}

		// Serializes the array of worksheet instance to the array of worksheet object model. 
		private _serializeWorkSheets(): IWorkSheet[]{
			var sheetOMs = [],
				workSheet: WorkSheet,
				i: number;

			for (i = 0; i < this._sheets.length; i++) {
				workSheet = this._sheets[i];
				if (workSheet) {
					sheetOMs[i] = workSheet._serialize();
				}
			}
			return sheetOMs;
		}

		//Serializes the array of workbookstyle instance to the array of workbookstyle object model.
		private _serializeWorkbookStyles(): IWorkbookStyle[]{
			var styleOMs = [],
				style: WorkbookStyle,
				i: number;

			for (i = 0; i < this._styles.length; i++) {
				style = this._styles[i];
				if (style) {
					styleOMs[i] = style._serialize();
				}
			}
			return styleOMs;
		}

		// Deserializes the array of worksheet object model to the array of worksheet instance.
		private _deserializeWorkSheets(workSheets: IWorkSheet[]) {
			var sheet: WorkSheet,
				sheetOM: IWorkSheet,
				i: number;

			this._sheets = [];
			for (i = 0; i < workSheets.length; i++) {
				sheetOM = workSheets[i];
				if (sheetOM) {
					sheet = new WorkSheet();
					sheet._deserialize(sheetOM);
					this._sheets[i] = sheet;
				}
			}
		}

		// Deserializes the array of workbookstyle object model to the array of the workbookstyle instance.
		private _deserializeWorkbookStyles(workbookStyles: IWorkbookStyle[]) {
			var style: WorkbookStyle,
				styleOM: IWorkbookStyle,
				i: number;

			this._styles = [];
			for (i = 0; i < workbookStyles.length; i++) {
				styleOM = workbookStyles[i];
				if (styleOM) {
					style = new WorkbookStyle();
					style._deserialize(styleOM);
					this._styles[i] = style;
				}
			}
		}
	}

	/**
	 * Represents the Workbook Object Model sheet definition that includes sheet properties and data.
	 * 
	 * The sheet cells are stored in row objects and are accessible using JavaScript expressions like
     * <b>sheet.rows[i].cells[j]</b>.
	 */
	export class WorkSheet implements IWorkSheet {
		/**
		 * Gets or sets the sheet name.
		 */
		public name: string;
		/**
		 *  Gets or sets the @see:WorkbookFrozenPane settings.
		 */
		public frozenPane: WorkbookFrozenPane;
		/**
		 * Gets or sets a value indicating whether summary rows appear below or above detail rows.
		 */
		public summaryBelow: boolean;
		/**
		 * Gets or sets the worksheet visibility.
		 */
        public visible: boolean;
        /**
		 * Gets or sets the row style.
		 *
		 * The property defines the style for all cells in the worksheet, and can be overridden by the specific cell styles.
		 */
        public style: WorkbookStyle;
		private _columns: WorkbookColumn[];
        private _rows: WorkbookRow[];

        /**
         * Initializes a new instance of the @see:WorkSheet class.
         */
        constructor() {
        }

		/**
		 * Gets or sets an array of sheet columns definitions.
		 *
		 * Each @see:WorkbookColumn object in the array describes a column at the corresponding position in xlsx sheet, 
		 * i.e. the column with index 0
		 * corresponds to xlsx sheet column with index A, object with index 1 defines sheet column with index B, and so on. If certain column 
		 * has no description in xlsx file then corresponding array element is undefined for both export and import operations.
		 * 
		 * If @see:WorkbookColumn object in the array doesn't specify the <b>width</b> property value then the default column width
		 * is applied.
		 */
		get columns(): WorkbookColumn[]{
			if (this._columns == null) {
				this._columns = [];
			}
			return this._columns;
		}

		/*
		 * Gets the @see:WorkbookColumn array of the @see:WorkSheet.
		 *
		 * This property is deprecated. Please use the @see:columns property instead.
		 */
        get cols(): WorkbookColumn[]{
            _deprecated('WorkSheet.cols', 'WorkSheet.columns');
			return this.columns;
		}

		/**
		 * Gets an array of sheet rows definition.
		 *
		 * Each @see:WorkbookRow object in the array describes a row at the corresponding position in xlsx sheet, 
		 * i.e. the row with index 0
		 * corresponds to xlsx sheet row with index 1, object with index 1 defines sheet row with index 2, and so on. If certain row 
		 * has no properties and data in xlsx file then corresponding array element is undefined for both export and import operations.
		 * 
		 * If @see:WorkbookRow object in the array doesn't specify the <b>height</b> property value then the default row height
		 * is applied.
		 */
		get rows(): WorkbookRow[] {
			if (this._rows == null) {
				this._rows = [];
			}
			return this._rows;
		}

		// Serializes the worksheet instance to worksheet object model.
		_serialize(): IWorkSheet {
			var workSheetOM: IWorkSheet;

			if (this._checkEmptyWorkSheet()) {
				return null;
			}
            workSheetOM = {};
            if (this.style) {
                workSheetOM.style = this.style._serialize();
            }
			if (this._columns && this._columns.length > 0) {
				workSheetOM.cols = workSheetOM.columns = this._serializeWorkbookColumns();
			}
			if (this._rows && this._rows.length > 0) {
				workSheetOM.rows = this._serializeWorkbookRows();
			}
			if (this.frozenPane) {
				workSheetOM.frozenPane = this.frozenPane._serialize();
			}
			if (this.name) {
				workSheetOM.name = this.name;
			}
			if (this.summaryBelow != null) {
				workSheetOM.summaryBelow = this.summaryBelow;
			}
			if (this.visible != null) {
				workSheetOM.visible = this.visible;
			}
			return workSheetOM;
		}

		// Deserializes the worksheet object model to worksheet instance.
		_deserialize(workSheetOM: IWorkSheet) {
            var frozenPane: WorkbookFrozenPane,
                style: WorkbookStyle;

            if (workSheetOM.style) {
                style = new WorkbookStyle();
                style._deserialize(workSheetOM.style);
                this.style = style;
            }
			if (workSheetOM.columns && workSheetOM.columns.length > 0) {
				this._deserializeWorkbookColumns(workSheetOM.columns);
			}
			if (workSheetOM.rows && workSheetOM.rows.length > 0) {
				this._deserializeWorkbookRows(workSheetOM.rows);
			}
			if (workSheetOM.frozenPane) {
				frozenPane = new WorkbookFrozenPane();
				frozenPane._deserialize(workSheetOM.frozenPane);
				this.frozenPane = frozenPane;
			}
			this.name = workSheetOM.name;
			this.summaryBelow = workSheetOM.summaryBelow;
			this.visible = workSheetOM.visible;
		}

		// Add the workbookcolumn instance into the _columns array.
		_addWorkbookColumn(column: WorkbookColumn, columnIndex?: number) {
			if (this._columns == null) {
				this._columns = [];
			}

			if (columnIndex != null && !isNaN(columnIndex)) {
				this._columns[columnIndex] = column;
			} else {
				this._columns.push(column);
			}
		}

		// Add the workbookrow instance into the _rows array.
		_addWorkbookRow(row: WorkbookRow, rowIndex?: number) {
			if (this._rows == null) {
				this._rows = [];
			}

			if (rowIndex != null && !isNaN(rowIndex)) {
				this._rows[rowIndex] = row;
			} else {
				this._rows.push(row);
			}
		}

		// Serializes the array of the workbookcolumn instance to the array of the workbookcolumn object model.
		private _serializeWorkbookColumns(): IWorkbookColumn[]{
			var columnOMs = [],
				column: WorkbookColumn,
				i: number;

			for (i = 0; i < this._columns.length; i++) {
				column = this._columns[i];
				if (column) {;
					columnOMs[i] = column._serialize();
				}
			}
			return columnOMs;
		}

		// Serializes the array of workbookrow instance to the array of the workbookrow object model.
		private _serializeWorkbookRows(): IWorkbookRow[]{
			var rowOMs = [],
				row: WorkbookRow,
				i: number;

			for (i = 0; i < this._rows.length; i++) {
				row = this._rows[i];
				if (row) {
					rowOMs[i] = row._serialize();
				}
			}
			return rowOMs;
		}

		// Deserializes the arry of the workbookcolumn object model to the array of the workbookcolumn instance.
		private _deserializeWorkbookColumns(workbookColumns: IWorkbookColumn[]) {
			var columnOM: IWorkbookColumn,
				column: WorkbookColumn,
				i: number;

			this._columns = [];
			for (i = 0; i < workbookColumns.length; i++) {
				columnOM = workbookColumns[i];
				if (columnOM) {
					column = new WorkbookColumn();
					column._deserialize(columnOM);
					this._columns[i] = column;
				}
			}
		}

		// Deserializes the array of the workbookrow object model to the array of the workbookrow instance.
		private _deserializeWorkbookRows(workbookRows: IWorkbookRow[]) {
			var rowOM: IWorkbookRow,
				row: WorkbookRow,
				i: number;

			this._rows = [];
			for (i = 0; i < workbookRows.length; i++) {
				rowOM = workbookRows[i];
				if (rowOM) {
					row = new WorkbookRow();
					row._deserialize(rowOM);
					this._rows[i] = row;
				}
			}
		}

		// Checks whether the worksheet instance is empty.
        private _checkEmptyWorkSheet(): boolean {
            return this._rows == null && this._columns == null && this.visible == null && this.summaryBelow == null && this.frozenPane == null && this.style == null
				&& (this.name == null || this.name === '');
		}
	}

	/**
	 * Represents the Workbook Object Model column definition.
	 */
	export class WorkbookColumn implements IWorkbookColumn {
		/**
		 * Gets or sets the width of the column in device-independent (1/96th inch) pixels or characters.
		 * 
		 * The numeric value defines the width in pixels. On import the widths are always expressed in pixels.
		 *
		 * The string value which is a number with the 'ch' suffix, for example '10ch', defines the width in characters. 
		 * It has the same meaning as the column width defined via Excel UI. The width can be specified in characters
		 * only for export operations.
		 * 
		 * If width is not specified then the default width is applied.
		 */
		public width: any;
		/**
		 * Gets or sets the column visibility.
		 */
		public visible: boolean;
		/**
		 * Gets or sets the column style.
		 *
		 * The property defines the style for all cells in the column, and can be overridden by the specific cell styles.
		 */
		public style: WorkbookStyle;
		/**
		 * Gets or sets a value indicating whether the column width is automatically adjusted to fit its cells content.
		 */
        public autoWidth: boolean;

        /**
         * Initializes a new instance of the @see:WorkbookColumn class.
         */
        constructor() {
        }

		// Serializes the workbookcolumn instance to workbookcolumn object model.
		_serialize(): IWorkbookColumn {
			var workbookColumnOM: IWorkbookColumn;

			if (this._checkEmptyWorkbookColumn()) {
				return null;
			}

			workbookColumnOM = {};
			if (this.style) {
				workbookColumnOM.style = this.style._serialize();
			}
			if (this.autoWidth != null) {
				workbookColumnOM.autoWidth = this.autoWidth;
			}
			if (this.width != null) {
				workbookColumnOM.width = this.width;
			}
			if (this.visible != null) {
				workbookColumnOM.visible = this.visible;
            }
			return workbookColumnOM;
		}

		// Deserializes the workbookColummn object model to workbookcolumn instance.
		_deserialize(workbookColumnOM: IWorkbookColumn) {
			var style: WorkbookStyle;

			if (workbookColumnOM.style) {
				style = new WorkbookStyle();
				style._deserialize(workbookColumnOM.style);
				this.style = style;
			}
			this.autoWidth = workbookColumnOM.autoWidth;
			this.visible = workbookColumnOM.visible;
            this.width = workbookColumnOM.width;
		}

		// Checks whether the workbookcolumn instance is empty.
		private _checkEmptyWorkbookColumn() {
			return this.style == null && this.width == null && this.autoWidth == null && this.visible == null;
		}
	}

	/**
	 * Represents the Workbook Object Model row definition.
	 */
	export class WorkbookRow implements IWorkbookRow {
		/**
		 * Gets or sets the row height in device-independent (1/96th inch) pixels.
		 * 
		 * If height is not specified then the default height is applied.
		 */
		public height: number;
		/**
		 * Gets or sets the row visibility.
		 */
		public visible: boolean;
		/**
		 * Gets or sets the group level of the row.
		 */
		public groupLevel: number;
		/**
		 * Gets or sets the row style.
		 *
		 * The property defines the style for all cells in the row, and can be overridden by the specific cell styles.
		 */
		public style: WorkbookStyle;
		/**
		 * Indicating if the row is in the collapsed outline state.
		 */
        public collapsed: boolean;
        private _cells: WorkbookCell[];

        /**
         * Initializes a new instance of the @see:WorkbookRow class.
         */
        constructor() {
        }

		/**
		 * Gets or sets an array of cells in the row.
		 *
		 * Each @see:WorkbookCell object in the array describes a cell at the corresponding position in the row, 
		 * i.e. the cell with index 0
		 * pertain to column with index A, cell with index 1 defines cell pertain to column with index B, and so on. If a certain cell 
		 * has no definition (empty) in xlsx file then corresponding array element is undefined for both export and import operations.
		 */
		get cells(): WorkbookCell[]{
			if (this._cells == null) {
				this._cells = [];
			}
			return this._cells;
		}

		// Serializes the workbookrow instance to workbookrow object model.
		_serialize(): IWorkbookRow {
			var workbookRowOM: IWorkbookRow;

			if (this._checkEmptyWorkbookRow()) {
				return null;
			}

			workbookRowOM = {};
			if (this._cells && this._cells.length > 0) {
				workbookRowOM.cells = this._serializeWorkbookCells();
			}
			if (this.style) {
				workbookRowOM.style = this.style._serialize();
			}
			if (this.collapsed != null) {
				workbookRowOM.collapsed = this.collapsed;
			}
			if (this.groupLevel != null && !isNaN(this.groupLevel)) {
				workbookRowOM.groupLevel = this.groupLevel;
			}
			if (this.height != null && !isNaN(this.height)) {
				workbookRowOM.height = this.height;
			}
			if (this.visible != null) {
				workbookRowOM.visible = this.visible;
            }
			return workbookRowOM;
		}

		// Deserializes the workbookrow object model to workbookrow instance.
		_deserialize(workbookRowOM: IWorkbookRow) {
			var style: WorkbookStyle;

			if (workbookRowOM.cells && workbookRowOM.cells.length > 0) {
				this._deserializeWorkbookCells(workbookRowOM.cells);
			}
			if (workbookRowOM.style) {
				style = new WorkbookStyle();
				style._deserialize(workbookRowOM.style);
				this.style = style;
			}
			this.collapsed = workbookRowOM.collapsed;
			this.groupLevel = workbookRowOM.groupLevel;
			this.height = workbookRowOM.height;
            this.visible = workbookRowOM.visible;
		}
		
		// Add the workbook cell instance into the _cells array.
		_addWorkbookCell(cell: WorkbookCell, cellIndex?: number) {
			if (this._cells == null) {
				this._cells = [];
			}

			if (cellIndex != null && !isNaN(cellIndex)) {
				this._cells[cellIndex] = cell;
			} else {
				this._cells.push(cell);
			}
		}

		// Serializes the array of the workbookcell instance to workbookcell object model.
		private _serializeWorkbookCells(): IWorkbookCell[]{
			var cellOMs = [],
				cell: WorkbookCell,
				i: number;

			for (i = 0; i < this._cells.length; i++) {
				cell = this._cells[i];
				if (cell) {
					cellOMs[i] = cell._serialize();
				}
			}
			return cellOMs;
		}

		// Deserializes the array of the workbookcell object model to workbookcell instance. 
		private _deserializeWorkbookCells(workbookCells: IWorkbookCell[]) {
			var cellOM: IWorkbookCell,
				cell: WorkbookCell,
				i: number;

			this._cells = [];
			for (i = 0; i < workbookCells.length; i++) {
				cellOM = workbookCells[i];
				if (cellOM) {
					cell = new WorkbookCell();
					cell._deserialize(cellOM);
					this._cells[i] = cell;
				}
			}
		}

		// Checks whether the workbookcell instance is empty.
		private _checkEmptyWorkbookRow(): boolean {
			return this._cells == null && this.style == null && this.collapsed == null && this.visible == null
				&& (this.height == null || isNaN(this.height))
				&& (this.groupLevel == null || isNaN(this.groupLevel));
		}
	}

	/**
	 * Represents the Workbook Object Model cell definition.
	 */
	export class WorkbookCell implements IWorkbookCell {
		/**
		 * Gets or sets the cell value.
		 * 
		 * The type of the value can be String, Number, Boolean or Date.
		 */
		public value: any;
		/**
		 * Indicates whether the cell value is date or not.
		 */
		public isDate: boolean;
		/**
		 * Gets or sets the formula of cell.
		 */
		public formula: string;
		/**
		 * Gets or sets the style of cell.
		 */
		public style: WorkbookStyle;
		/**
		 * Gets or sets the colSpan setting of cell.
		 */
		public colSpan: number;
		/**
		 * Gets or sets the rowSpan setting of cell.
		 */
        public rowSpan: number;

        /**
         * Initializes a new instance of the @see:WorkbookCell class.
         */
        constructor() {
        }

		// Serializes the workbookcell instance to workbookcell object model.
		_serialize(): IWorkbookCell {
			var workbookCellOM: IWorkbookCell;

			if (this._checkEmptyWorkbookCell()) {
				return null;
			}

			workbookCellOM = {};
			if (this.style) {
				workbookCellOM.style = this.style._serialize();
			}
			if (this.value != null) {
				workbookCellOM.value = this.value;
			}
			if (this.formula) {
				workbookCellOM.formula = this.formula;
			}
			if (this.isDate != null) {
				workbookCellOM.isDate = this.isDate;
			}
			if (this.colSpan != null && !isNaN(this.colSpan) && this.colSpan > 1) {
				workbookCellOM.colSpan = this.colSpan;
			}
			if (this.rowSpan != null && !isNaN(this.rowSpan) && this.rowSpan > 1) {
				workbookCellOM.rowSpan = this.rowSpan;
            }
			return workbookCellOM;
		}

		// Deserializes the workbookcell object model to workbookcell instance.
		_deserialize(workbookCellOM: IWorkbookCell) {
			var style: WorkbookStyle;

			if (workbookCellOM.style) {
				style = new WorkbookStyle();
				style._deserialize(workbookCellOM.style);
				this.style = style;
			}
			this.value = workbookCellOM.value;
			this.formula = workbookCellOM.formula;
			this.isDate = workbookCellOM.isDate;
			this.colSpan = workbookCellOM.colSpan;
            this.rowSpan = workbookCellOM.rowSpan;
		}

		// Checks whether the workbookcell instance is empty.
		private _checkEmptyWorkbookCell(): boolean {
			return this.style == null && this.value == null && this.isDate == null
				&& (this.formula == null || this.formula === '')
				&& (this.colSpan == null || isNaN(this.colSpan) || this.colSpan <= 1)
				&& (this.rowSpan == null || isNaN(this.rowSpan) || this.rowSpan <= 1);
		}
	}

	/**
	 * Workbook frozen pane definition
	 */
	export class WorkbookFrozenPane implements IWorkbookFrozenPane {
		/**
		 * Gets or sets the number of frozen rows.
		 */
		public rows: number;
		/**
		 * Gets or sets the number of frozen columns.
		 */
        public columns: number;

        /**
         * Initializes a new instance of the @see:WorkbookFrozenPane class.
         */
        constructor() {
        }

		// Serializes the workbookfrozenpane instance to the workbookfrozenpane object model.
		_serialize(): IWorkbookFrozenPane {
			if ((this.columns == null || isNaN(this.columns) || this.columns === 0)
				&& (this.rows == null || isNaN(this.rows) || this.rows === 0)) {
				return null;
			} else {
				return {
					columns: this.columns,
					rows: this.rows
				};
			}
		}

		// Deserializes the workbookfrozenpane object model to workbookfrozenpane instance.
		_deserialize(workbookFrozenPaneOM: IWorkbookFrozenPane) {
			this.columns = workbookFrozenPaneOM.columns;
			this.rows = workbookFrozenPaneOM.rows;
		}
	}

	/**
	 * Represents the Workbook Object Model style definition used to style Excel cells, columns and rows. 
	 */
	export class WorkbookStyle implements IWorkbookStyle {
		/**
		 * Cell value format, defined using Excel format syntax.
		 * 
		 * The description of Excel format syntax can be found 
		 * <a href="https://support.office.com/en-us/article/Create-or-delete-a-custom-number-format-78f2a361-936b-4c03-8772-09fab54be7f4" target="_blank">here</a>.
		 *
		 * You may use the <b>toXlsxNumberFormat</b> and <b>toXlsxDateFormat</b> static functions of the
		 * @see:Workbook class to convert from .Net (@see:Globalize) format to Excel format.
		 */
		public format: string;
		/**
		 * Defines the base style that this style inherits from.
		 *
		 * This property is applicable for export operations only. The style gets all the properties defined in the base style, 
		 * and can override or augment them by setting its own properties.
		 */
		public basedOn: WorkbookStyle;
		/**
		 * Gets or sets the font of style.
		 */
		public font: WorkbookFont;
		/**
		 * Gets or sets a horizontal alignment of a text. 
		 */
		public hAlign: HAlign;
		/**
		 *  Gets or sets vertical alignment of a text.
		 */
		public vAlign: VAlign;
		/**
		 * Gets or sets indenet setting of the style.
		 */
		public indent: number;
		/**
		 * Gets or sets background setting.
		 */
        public fill: WorkbookFill;
        /**
		 * Gets or sets border setting.
		 */
        public borders: WorkbookBorder;
        /**
		 * Gets or sets the word wrap setting of the row.
		 */
        public wordWrap: boolean;

        /**
         * Initializes a new instance of the @see:WorkbookStyle class.
         */
        constructor() {
        }

		// Serializes the workbookstyle instance to the workbookstyle object model.
		_serialize(): IWorkbookStyle {
			var workbookStyleOM: IWorkbookStyle;

			if (this._checkEmptyWorkbookStyle()) {
				return null;
			}

			workbookStyleOM = {};
			if (this.basedOn) {
				workbookStyleOM.basedOn = this.basedOn._serialize();
			}
			if (this.fill) {
				workbookStyleOM.fill = this.fill._serialize();
			}
			if (this.font) {
				workbookStyleOM.font = this.font._serialize();
            }
            if (this.borders) {
                workbookStyleOM.borders = this.borders._serialize();
            }
			if (this.format) {
				workbookStyleOM.format = this.format;
			}
			if (this.hAlign != null) {
				workbookStyleOM.hAlign = asEnum(this.hAlign, HAlign, false);
			}
			if (this.vAlign != null) {
				workbookStyleOM.vAlign = asEnum(this.vAlign, VAlign, false);
			}
			if (this.indent != null && !isNaN(this.indent)) {
				workbookStyleOM.indent = this.indent;
            }
            if (!!this.wordWrap) {
                workbookStyleOM.wordWrap = this.wordWrap;
            }
			return workbookStyleOM;
		}

		// Deserializes the workbookstyle object model to workbookstyle instance.
		_deserialize(workbookStyleOM: IWorkbookStyle) {
            var baseStyle: WorkbookStyle,
                fill: WorkbookFill,
                font: WorkbookFont,
                borders: WorkbookBorder;

			if (workbookStyleOM.basedOn) {
				baseStyle = new WorkbookStyle();
				baseStyle._deserialize(workbookStyleOM.basedOn);
				this.basedOn = baseStyle;
			}
			if (workbookStyleOM.fill) {
				fill = new WorkbookFill();
				fill._deserialize(workbookStyleOM.fill);
				this.fill = fill;
			}
			if (workbookStyleOM.font) {
				font = new WorkbookFont();
				font._deserialize(workbookStyleOM.font);
				this.font = font;
            }
            if (workbookStyleOM.borders) {
                borders = new WorkbookBorder();
                borders._deserialize(workbookStyleOM.borders);
                this.borders = borders;
            }
			this.format = workbookStyleOM.format;
			if (workbookStyleOM.hAlign != null) {
				this.hAlign = asEnum(workbookStyleOM.hAlign, HAlign, false);
			}
			if (workbookStyleOM.vAlign != null) {
				this.vAlign = asEnum(workbookStyleOM.vAlign, VAlign, false);
			}
			if (workbookStyleOM.indent != null && !isNaN(workbookStyleOM.indent)) {
				this.indent = workbookStyleOM.indent;
            }
            if (!!workbookStyleOM.wordWrap) {
                this.wordWrap = workbookStyleOM.wordWrap;
            }
		}

		// Checks whether the workbookstyle instance is empty.
        private _checkEmptyWorkbookStyle(): boolean {
            return this.basedOn == null && this.fill == null
                && this.font == null && this.borders == null
				&& (this.format == null || this.format === '')
                && this.hAlign == null && this.vAlign == null
                && this.wordWrap == null;
		}
	}

	/**
	 * Represents the Workbook Object Model font definition. 
	 */
	export class WorkbookFont implements IWorkbookFont {
		/**
		 * Gets or sets font family name.
		 */
		public family: string;
		/**
		 * Gets or sets the font size in device-independent (1/96th inch) pixels.
		 */
		public size: number;
		/**
		 * Indicates whether current font is bold.
		 */
		public bold: boolean;
		/**
		 * Indicates whether current font has the italic style applied.
		 */
		public italic: boolean;
		/**
		 * Indicates whether current font is underlined.
		 */
		public underline: boolean;
		/**
		 * Gets or sets the font color.
		 * 
		 * For export, the color can be specified in any valid HTML format like 6-character dash notation or
		 * rgb/rgba/hsl/hsla functional form. In case of rgba/hsla representations a specified alpha channel value 
		 * will be ignored.
		 *
		 * For import a value is always represented in the HTML 6-character dash notation, e.g. "#afbfcf".
		 */
        public color: string;

        /**
         * Initializes a new instance of the @see:WorkbookFont class.
         */
        constructor() {
        }

		//Serializes the workbookfont instance to the workbookfont object model.
		_serialize(): IWorkbookFont {
			var workbookFontOM: IWorkbookFont;

			if (this._checkEmptyWorkbookFont()) {
				return null;
			} 

			workbookFontOM = {};
			if (this.bold != null) {
				workbookFontOM.bold = this.bold;
			}
			if (this.italic != null) {
				workbookFontOM.italic = this.italic;
			}
			if (this.underline != null) {
				workbookFontOM.underline = this.underline;
			}
			if (this.color) {
				workbookFontOM.color = this.color;
			}
			if (this.family) {
				workbookFontOM.family = this.family;
			}
			if (this.size != null && !isNaN(this.size)) {
				workbookFontOM.size = this.size;
			}
			return workbookFontOM;
		}

		// Deserializes the workbookfotn object model to the workbookfont instance.
		_deserialize(workbookFontOM: IWorkbookFont) {
			this.bold = workbookFontOM.bold;
			this.color = workbookFontOM.color;
			this.family = workbookFontOM.family;
			this.italic = workbookFontOM.italic;
			this.size = workbookFontOM.size;
			this.underline = workbookFontOM.underline;
		}

		// Checks whether the workbookfont instance is empty.
		private _checkEmptyWorkbookFont(): boolean {
			return this.bold == null && this.italic == null && this.underline == null
				&& (this.color == null || this.color === '')
				&& (this.family == null || this.family === '')
				&& (this.size == null || isNaN(this.size));
		}
	}

	/**
	 * Represents the Workbook Object Model background fill definition.
	 */
	export class WorkbookFill implements IWorkbookFill {
		/**
		 * Gets or sets the fill color.
		 * 
		 * For export, the color can be specified in any valid HTML format like 6-character dash notation or
		 * rgb/rgba/hsl/hsla functional form. In case of rgba/hsla representations a specified alpha channel value 
		 * will be ignored.
		 *
		 * For import a value is always represented in the HTML 6-character dash notation, e.g. "#afbfcf".
		 */
        public color: string;

        /**
         * Initializes a new instance of the @see:WorkbookFill class.
         */
        constructor() {
        }

		// Serializes the workbookfill instance to the workbookfill object model.
		_serialize(): IWorkbookFill {
			var workbookFillOM: IWorkbookFill;

			if (this.color) {
				return {
					color: this.color
				};
			} else {
				return null;
			}
		}

		// Deserializes the workbookfill object model to workbookfill instance.
		_deserialize(workbookFillOM: IWorkbookFill) {
			this.color = workbookFillOM.color;
		}
    }

    /**
	 * Represents the Workbook Object Model border definition.
	 */
    export class WorkbookBorder implements IWorkbookBorder {
        /**
		 * Gets or sets top border setting.
		 */
        public top: WorkbookBorderSetting;
		/**
		 * Gets or sets bottom border setting.
		 */
        public bottom: WorkbookBorderSetting;
		/**
		 * Gets or sets left border setting.
		 */
        public left: WorkbookBorderSetting;
		/**
		 * Gets or sets right border setting.
		 */
        public right: WorkbookBorderSetting;
        /**
         * Gets or sets diagonal border setting.
         */
        public diagonal: WorkbookBorderSetting;

        /**
         * Initializes a new instance of the @see:WorkbookBorder class.
         */
        constructor() {
        }

        // Serializes the workbookborder instance to the workbookborder object model.
        _serialize(): IWorkbookBorder {
            var workbookBorderOM: IWorkbookBorder;

            if (this._checkEmptyWorkbookBorder()) {
                return null;
            }
            workbookBorderOM = {};
            if (this.top) {
                workbookBorderOM.top = this.top._serialize();
            }
            if (this.bottom) {
                workbookBorderOM.bottom = this.bottom._serialize();
            }
            if (this.left) {
                workbookBorderOM.left = this.left._serialize();
            }
            if (this.right) {
                workbookBorderOM.right = this.right._serialize();
            }
            if (this.diagonal) {
                workbookBorderOM.diagonal = this.diagonal._serialize();
            }

            return workbookBorderOM;
        }

        // Deserializes the workbookborder object model to workbookborder instance.
        _deserialize(workbookBorderOM: IWorkbookBorder) {
            var top: WorkbookBorderSetting,
                bottom: WorkbookBorderSetting,
                left: WorkbookBorderSetting,
                right: WorkbookBorderSetting,
                diagonal: WorkbookBorderSetting;

            if (workbookBorderOM.top) {
                top = new WorkbookBorderSetting();
                top._deserialize(workbookBorderOM.top);
                this.top = top;
            }
            if (workbookBorderOM.bottom) {
                bottom = new WorkbookBorderSetting();
                bottom._deserialize(workbookBorderOM.bottom);
                this.bottom = bottom;
            }
            if (workbookBorderOM.left) {
                left = new WorkbookBorderSetting();
                left._deserialize(workbookBorderOM.left);
                this.left = left;
            }
            if (workbookBorderOM.right) {
                right = new WorkbookBorderSetting();
                right._deserialize(workbookBorderOM.right);
                this.right = right;
            }
            if (workbookBorderOM.diagonal) {
                diagonal = new WorkbookBorderSetting();
                diagonal._deserialize(workbookBorderOM.diagonal);
                this.diagonal = diagonal;
            }
        }

        // Checks whether the workbookborder instance is empty.
        private _checkEmptyWorkbookBorder(): boolean {
            return this.top == null && this.bottom == null
                && this.left == null && this.right == null && this.diagonal == null;
        }
    }

    /**
	 * Represents the Workbook Object Model background setting definition.
	 */
    export class WorkbookBorderSetting implements IWorkbookBorderSetting {
        /**
		 * Gets or sets border color.
         *
         * For export, the color can be specified in any valid HTML format like 6-character dash notation or
		 * rgb/rgba/hsl/hsla functional form. In case of rgba/hsla representations a specified alpha channel value 
		 * will be ignored.
		 *
		 * For import a value is always represented in the HTML 6-character dash notation, e.g. "#afbfcf".
		 */
        public color: string;
		/**
		 * Gets or sets border type.
		 */
        public style: BorderStyle;

        /**
         * Initializes a new instance of the @see:WorkbookBorderSetting class.
         */
        constructor() {
        }

        // Serializes the workbookbordersetting instance to the workbookbordersetting object model.
        _serialize(): IWorkbookBorderSetting {
            var workbookBorderSettingOM: IWorkbookBorderSetting;

            if ((this.color == null || this.color === '' ) && this.style == null) {
                return null;
            }

            workbookBorderSettingOM = {};
            if (this.color) {
                workbookBorderSettingOM.color = this.color;
            }
            if (this.style != null) {
                workbookBorderSettingOM.style = asEnum(this.style, BorderStyle, false);
            }

            return workbookBorderSettingOM;
        }

        // Deserializes the workbookbordersetting object model to workbookbordersetting instance.
        _deserialize(workbookBorderSettingOM: IWorkbookBorderSetting) {
            this.color = workbookBorderSettingOM.color;
            if (workbookBorderSettingOM.style != null) {
                this.style = asEnum(workbookBorderSettingOM.style, BorderStyle, false);
            }
        }
    }

	/*
	 * The exported Xlsx file content definition.
	 */
	export interface IXlsxFileContent {
		/**
		 * base64 string for the exporting result 
		 */
		base64: string;
		/**
		 * converted int array for base64 string result.
		 */
		base64Array: Uint8Array;
		/**
		 * download link for the exported result.
		 */
		href: Function;
	}

	/**
	 * Represents the Workbook Object Model sheet definition that includes sheet properties and data.
	 * 
	 * The sheet cells are stored in row objects and are accessible using JavaScript expressions like
     * <b>sheet.rows[i].cells[j]</b>.
	 */
	export interface IWorkSheet {
		/**
		 * Gets or sets the sheet name.
		 */
		name?: string;
		/*
		 * Gets or sets an array of sheet columns definitions.
		 *
		 * Each @see:IWorkbookColumn object in the array describes a column at the corresponding position in xlsx sheet, 
		 * i.e. the column with index 0
		 * corresponds to xlsx sheet column with index A, object with index 1 defines sheet column with index B, and so on. If certain column 
		 * has no description in xlsx file then corresponding array element is undefined for both export and import operations.
		 * 
		 * If @see:IWorkbookColumn object in the array doesn't specify the <b>width</b> property value then the default column width
		 * is applied.
		 *
		 * This property is deprecated. Please use the @see:columns property instead.
		 */
		cols?: IWorkbookColumn[];
		/**
		 * Gets or sets an array of sheet columns definitions.
		 *
		 * Each @see:IWorkbookColumn object in the array describes a column at the corresponding position in xlsx sheet, 
		 * i.e. the column with index 0
		 * corresponds to xlsx sheet column with index A, object with index 1 defines sheet column with index B, and so on. If certain column 
		 * has no description in xlsx file then corresponding array element is undefined for both export and import operations.
		 * 
		 * If @see:IWorkbookColumn object in the array doesn't specify the <b>width</b> property value then the default column width
		 * is applied.
		 */
		columns?: IWorkbookColumn[];
		/**
		 * Gets or sets an array of sheet rows definition.
		 *
		 * Each @see:IWorkbookRow object in the array describes a row at the corresponding position in xlsx sheet, 
		 * i.e. the column with index 0
		 * corresponds to xlsx sheet row with index 1, object with index 1 defines sheet row with index 2, and so on. If certain row 
		 * has no properties and data in xlsx file then corresponding array element is undefined for both export and import operations.
		 * 
		 * If @see:IWorkbookRow object in the array doesn't specify the <b>height</b> property value then the default row height
		 * is applied.
		 */
		rows?: IWorkbookRow[];
		/**
		 *  Gets or sets the frozen pane settings.
		 */
		frozenPane?: IWorkbookFrozenPane;
		/**
		 * Gets or sets a value indicating whether summary rows appear below or above detail rows.
		 */
		summaryBelow?: boolean;
		/**
		 * Gets or sets the worksheet visibility.
		 */
        visible?: boolean;
        /**
		 * Gets or sets the sheet style.
		 *
		 * The property defines the style for all cells in the worksheet, and can be overridden by the specific cell styles.
		 */
        style?: IWorkbookStyle;
	}

	/**
	 * Represents the Workbook Object Model column definition.
	 */
	export interface IWorkbookColumn {
		/**
		 * Gets or sets the width of the column in device-independent (1/96th inch) pixels or characters.
		 * 
		 * The numeric value defines the width in pixels. On import the widths are always expressed in pixels.
		 *
		 * The string value which is a number with the 'ch' suffix, for example '10ch', defines the width in characters. 
		 * It has the same meaning as the column width defined via Excel UI. The width can be specified in characters
		 * only for export operations.
		 * 
		 * If width is not specified then the default width is applied.
		 */
		width?: any;
		/**
		 * Gets or sets the column visibility.
		 */
		visible?: boolean;
		/**
		 * Gets or sets the column style.
		 *
		 * The property defines the style for all cells in the column, and can be overridden by the specific cell styles.
		 */
		style?: IWorkbookStyle;
		/**
		 * Gets or sets a value indicating whether the column width is automatically adjusted to fit its cells content.
		 */
        autoWidth?: boolean;
	}

	/**
	 * Represents the Workbook Object Model row definition.
	 */
    export interface IWorkbookRow {
		/**
		 * Gets or sets the row height in device-independent (1/96th inch) pixels.
		 * 
		 * If height is not specified then the default height is applied.
		 */
        height?: number;
		/**
		 * Gets or sets the row visibility.
		 */
        visible?: boolean;
		/**
		 * Gets or sets the group level of the row.
		 */
        groupLevel?: number;
		/**
		 * Gets or sets the row style.
		 *
		 * The property defines the style for all cells in the row, and can be overridden by the specific cell styles.
		 */
        style?: IWorkbookStyle;
		/**
		 * TBD: Indicating if the row is in the collapsed outline state.
		 */
        collapsed?: boolean;
		/**
		 * Gets or sets an array of cells in the row.
		 *
		 * Each @see:IWorkbookCell object in the array describes a cell at the corresponding position in the row, 
		 * i.e. the cell with index 0
		 * pertain to column with index A, cell with index 1 defines cell pertain to column with index B, and so on. If a certain cell 
		 * has no definition (empty) in xlsx file then corresponding array element is undefined for both export and import operations.
		 */
        cells?: IWorkbookCell[];
    }

	/**
	 * Represents the Workbook Object Model cell definition.
	 */
	export interface IWorkbookCell {
		/**
		 * Gets or sets the cell value.
		 * 
		 * The type of the value can be String, Number, Boolean or Date.
		 */
		value?: any;
		/**
		 * Indicates whether the cell value is date or not.
		 */
		isDate?: boolean;
		/**
		 * Cell formula
		 */
		formula?: string;
		/**
		 * Cell style
		 */
		style?: IWorkbookStyle;
		/**
		 * Cell colSpan setting
		 */
		colSpan?: number;
		/**
		 * Cell rowSpan setting
		 */
        rowSpan?: number;
	}

	/**
	 * Workbook frozen pane definition
	 */
	export interface IWorkbookFrozenPane {
		/**
		 * Gets or sets the number of frozen rows.
		 */
		rows: number;
		/**
		 * Gets or sets the number of frozen columns.
		 */
		columns: number;
	}

	/**
     * Represents an Excel Workbook. This interface is the root of the Excel Workbook Object Model (WOM)
     * that provides a way to define properties and data stored in xlsx file.
     * 
     * To create an xlsx file, create a @see:Workbook object and populate them with @see:WorkSheet,
     * @see:WorkbookColumn, @see:WorkbookRow, and @see:WorkbookCell objects.
     *
     * To save xlsx files, use the @see:Workbook.save method which can save the book to a file
     * or return it as a base-64 string.
     *
     * To load existing xlsx files, use the @see:Workbook.load method which will populate the book.
	 */
	export interface IWorkbook {
		/**
		 * Defines an array of Excel Workbook sheets.
		 */
		sheets: IWorkSheet[];
		/**
		* The name of application that generated the file that appears in the file properties.
		*/
		application?: string;
		/**
		* The name of company that generated the file that appears in the file properties.
		*/
		company?: string;
		/**
		 * Creator of the xlsx file.
		 */
		creator?: string;
		/**
		 * Creation time of the xlsx file.
		 */
		created?: Date;
		/**
		 * Last modifier of the xlsx file.
		 */
		lastModifiedBy?: string;
		/**
		 * Last modified time of the xlsx file.
		 */
		modified?: Date;
		/**
		 * Index of the active sheet in the xlsx file.
		 */
		activeWorksheet?: number;
		/**
		 * Styles table of the workbook.
		 */
		styles?: IWorkbookStyle[];
		/**
		 * The reserved content for the workbook.
		 */
		reservedContent?: any;
	}

	/**
	 * Represents the Workbook Object Model style definition used to style Excel cells, columns and rows. 
	 */
	export interface IWorkbookStyle {
		/**
		 * Cell value format, defined using Excel format syntax.
		 * 
		 * The description of Excel format syntax can be found 
		 * <a href="https://support.office.com/en-us/article/Create-or-delete-a-custom-number-format-78f2a361-936b-4c03-8772-09fab54be7f4" target="_blank">here</a>.
		 *
		 * You may use the <b>toXlsxNumberFormat</b> and <b>toXlsxDateFormat</b> static functions of the
		 * @see:Workbook class to convert from .Net (@see:Globalize) format to Excel format.
		 */
		format?: string;
		/**
		 * Defines the base style that this style inherits from.
		 *
		 * This property is applicable for export operations only. The style gets all the properties defined in the base style, 
		 * and can override or augment them by setting its own properties.
		 */
		basedOn?: IWorkbookStyle;
		/**
		 * Gets or sets the font properties.
		 */
		font?: IWorkbookFont;
		/**
		 * Gets or sets a horizontal alignment of a text. 
		 */
		hAlign?: HAlign;
		/**
		 *  Gets or sets vertical alignment of a text.
		 */
		vAlign?: VAlign;
		/**
		 * Text indent.
		 * It is an integer value, where an increment of 1 represents 3 spaces.
		 */
		indent?: number;
		/*
		 * The rotation angle of text.
		 * Text rotation in cells. Expressed in degrees. Values range from 0 to 180. The first letter of the text is considered the center-point of the arc
		 * For 0 - 90, the value represents degrees above horizon. 
		 * For 91-180 the degrees below the horizon is calculated as: [degrees below horizon] = 90 - textRotation.
		 */
		//textRotation?: number;
		/*
		 * The direction of text flow.
		 */
		//textDirection?: TextDirection;
		/**
		 * Cell outline setting.
		 */
		borders?: IWorkbookBorder;
		/**
		 * Cells background.
		 */
        fill?: IWorkbookFill;
        /**
		 * Word wrap setting.
		 */
        wordWrap?: boolean;
		/*
		 * Allow text wrap.
		 */
		//wrapText?: boolean;
		/*
		 * Allow text shrink to fit cell size.
		 */
		//shrinkToFit?: boolean;
		/*
		 * Whether to lock the cells.
		 */
		//locked?: boolean;
	}

	/**
	 * Represents the Workbook Object Model font definition. 
	 */
	export interface IWorkbookFont {
		/**
		 * Gets or sets font family name.
		 */
		family?: string;
		/**
		 * Gets or sets the font size in device-independent (1/96th inch) pixels.
		 */
		size?: number;
		/**
		 * Gets or sets a value indicating whether this font is bold.
		 */
		bold?: boolean;
		/**
		 * Gets or sets a value indicating whether this font has the italic style applied.
		 */
		italic?: boolean;
		/**
		 * Gets or sets a value indicating whether this font is underlined.
		 */
		underline?: boolean;
		/*
		 * Whether to strike through.
		 */
		//strikethrough?: boolean;
		/**
		 * Gets or sets the font color.
		 * 
		 * For export, the color can be specified in any valid HTML format like 6-character dash notation or
		 * rgb/rgba/hsl/hsla functional form. In case of rgba/hsla representations a specified alpha channel value 
		 * will be ignored.
		 *
		 * For import a value is always represented in the HTML 6-character dash notation, e.g. "#afbfcf".
		 */
		color?: string;
	}

	/**
	 * Workbook cell outline definition.
	 */
	export interface IWorkbookBorder {
		/**
		 * Top border setting.
		 */
		top?: IWorkbookBorderSetting;
		/**
		 * Bottom border setting.
		 */
		bottom?: IWorkbookBorderSetting;
		/**
		 * Left border setting.
		 */
		left?: IWorkbookBorderSetting;
		/**
		 * Right border setting.
		 */
        right?: IWorkbookBorderSetting;
        /**
         * Diagonal border setting.
         */
        diagonal?: IWorkbookBorderSetting;
	}

	/**
	 * Border style definition
	 */
	export interface IWorkbookBorderSetting {
		/**
		 * Border color.
         *
         * For export, the color can be specified in any valid HTML format like 6-character dash notation or
		 * rgb/rgba/hsl/hsla functional form. In case of rgba/hsla representations a specified alpha channel value 
		 * will be ignored.
		 *
		 * For import a value is always represented in the HTML 6-character dash notation, e.g. "#afbfcf".
		 */
		color?: string;
		/**
		 * Border type.
		 */
		style?: BorderStyle;
	}

	/**
	 * Represents the Workbook Object Model background fill definition.
	 */
	export interface IWorkbookFill {
		/*
		 * Fill pattern.
		 */
		//pattern?: FillPattern;
		/**
		 * Gets or sets the fill color.
		 * 
		 * For export, the color can be specified in any valid HTML format like 6-character dash notation or
		 * rgb/rgba/hsl/hsla functional form. In case of rgba/hsla representations a specified alpha channel value 
		 * will be ignored.
		 *
		 * For import a value is always represented in the HTML 6-character dash notation, e.g. "#afbfcf".
		 */
		color?: string;
	}

	///**
	// * Workbook theme color definition
	// */
	//export interface IWorkbookThemeColor {
	//	/**
	//	 * The theme index for the theme color.
	//	 */
	//	themeIndex: number;
	//	/**
	//	 * Specifies the tint value applied to the color.
	//	 */
	//	tint: number;
	//}

	/*
	 * Defines a cell index with zero-based row and column components, as well as the properties indicating whether
	 * the index component is absolute (for example "$D") or relative (for example "D").
	 *
	 * This interface is deprecated. Please use the @see:ITableAddress interface instead.
	 */
	export interface ITableIndex {
		/**
		 * A zero-based row index.
		 */
		row: number;
		/**
		 * A zero-based column index.
		 */
		col: number;
		/**
		* Indicates whether the original column index is absolute (for example "$D") or relative (for example "D").
		*/
		absCol: boolean;
		/**
		* Indicates whether the original row index is absolute (for example "$15") or relative (for example "15").
		*/
		absRow: boolean;
	}

	/**
	 * Defines a cell index with zero-based row and column components, as well as the properties indicating whether
	 * the index component is absolute (for example "$D") or relative (for example "D").
	 */
	export interface ITableAddress {
		/**
		 * A zero-based row index.
		 */
		row: number;
		/**
		 * A zero-based column index.
		 */
		col: number;
		/**
		* Indicates whether the original column index is absolute (for example "$D") or relative (for example "D").
		*/
		absCol: boolean;
		/**
		* Indicates whether the original row index is absolute (for example "$15") or relative (for example "15").
		*/
		absRow: boolean;
	}

	/**
	 * Defines the Workbook Object Model horizontal text alignment.
	 */
	export enum HAlign {
		/** Alignment depends on the cell value type. */
		General = 0,
		/** Text is aligned to the left. */
		Left = 1,
		/** Text is centered. */
		Center = 2,
		/** Text is aligned to the right. */
		Right = 3,
		/** Text is replicated to fill the whole cell width. */
		Fill = 4,
		/** Text is justified. */
		Justify = 5
	}

	/**
	 * Vertical alignment
	 */
	export enum VAlign {
		/** Top vertical alignment */
		Top = 0,
		/** Center vertical alignment */
		Center = 1,
		/** Bottom vertical alignment */
		Bottom = 2,
		/** Justify vertical alignment */
		Justify = 3
	}

	///**
	// * Text direction
	// */
	//export enum TextDirection {
	//	/** Context */
	//	Context = 0,
	//	/** Left to right */
	//	LeftToRight = 1,
	//	/** Right to left */
	//	RightToLeft = 2
	//}

	///**
	// * Fill Pattern 
	// */
	//export enum FillPattern {
	//	/** No fill */
	//	None = 0,
	//	/** Solid fill */
	//	Solid = 1,
	//	/** Medium gray fill */
	//	Gray50 = 2,
	//	/** Dark gray fill */
	//	Gray75 = 3,
	//	/** Light gray fill */
	//	Gray25 = 4,
	//	/** Horizontal stripe fill */
	//	HorizontalStripe = 5,
	//	/** Vertical stripe fill */
	//	VerticalStripe = 6,
	//	/** Reverse diagonal stripe fill */
	//	ReverseDiagonalStripe = 7,
	//	/** Diagonal stripe fill */
	//	DiagonalStripe = 8,
	//	/** Diagonal crosshatch fill */
	//	DiagonalCrosshatch = 9,
	//	/** Thick diagonal crosshatch fill */
	//	ThickDiagonalCrosshatch = 10,
	//	/** Thin horizontal stripe fill */
	//	ThinHorizontalStripe = 11,
	//	/** Thin vertical stripe fill */
	//	ThinVerticalStripe = 12,
	//	/** Thin reverse diagonal stripe fill */
	//	ThinReverseDiagonalStripe = 13,
	//	/** Thin diagonal stripe fill */
	//	ThinDiagonalStripe = 14,
	//	/** Thin horizontal crosshatch fill */
	//	ThinHorizontalCrosshatch = 15,
	//	/** Thin diagonal crosshatch fill */
	//	ThinDiagonalCrosshatch = 16,
	//	/** Gray 125 fill */
	//	Gray12 = 17,
	//	/** Gray 0.0625 fill */
	//	Gray06 = 18
	//}

	/**
	 * Border line style
	 */
	export enum BorderStyle {
		/** No border */
		None = 0,
		/** Thin border */
		Thin = 1,
		/** Medium border */
		Medium = 2,
		/** Dashed border */
		Dashed = 3,
		/** Dotted border */
		Dotted = 4,
		/** Thick line border */
		Thick = 5,
		/** Double line border */
		Double = 6,
		/** Hair line border */
		Hair = 7,
		/** Medium dashed border */
		MediumDashed = 8,
		/** Thin dash dotted border */
		ThinDashDotted = 9,
		/** Medium dash dotted border */
		MediumDashDotted = 10,
		/** Thin dash dot dotted border */
		ThinDashDotDotted = 11,
		/** Medium dash dot dotted border */
		MediumDashDotDotted = 12,
		/** Slanted medium dash dotted border */
		SlantedMediumDashDotted = 13
	}
} 