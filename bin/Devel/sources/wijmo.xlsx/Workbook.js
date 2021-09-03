/**
 * The module has a dependency on the <a href="https://stuk.github.io/jszip" target="_blank">JSZip</a> library,
 * which should be referenced in html page with the markup like this:
 * <pre>&lt;script src="http://cdnjs.cloudflare.com/ajax/libs/jszip/2.5.0/jszip.min.js"&gt;&lt;/script&gt;</pre>
*/
var wijmo;
(function (wijmo) {
    var xlsx;
    (function (xlsx) {
        'use strict';
        /**
         * Represents an Excel Workbook.
         */
        var Workbook = (function () {
            /**
             * Initializes a new instance of the @see:Workbook class.
             */
            function Workbook() {
            }
            Object.defineProperty(Workbook.prototype, "sheets", {
                /**
                 * Gets the WorkSheet array of the Workbook.
                 */
                get: function () {
                    if (this._sheets == null) {
                        this._sheets = [];
                    }
                    return this._sheets;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Workbook.prototype, "styles", {
                /**
                 * Gets the styles table of the workbook.
                 */
                get: function () {
                    if (this._styles == null) {
                        this._styles = [];
                    }
                    return this._styles;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Workbook.prototype, "reservedContent", {
                /**
                 * Gets or sets the reserved content from xlsx file that flexgrid or flexsheet doesn't support yet.
                 */
                get: function () {
                    if (this._reservedContent == null) {
                        this._reservedContent = {};
                    }
                    return this._reservedContent;
                },
                set: function (value) {
                    this._reservedContent = value;
                },
                enumerable: true,
                configurable: true
            });
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
            Workbook.prototype.save = function (fileName) {
                var suffix, suffixIndex, blob, result = xlsx._xlsx(this._serialize()), nameSuffix = this._reservedContent && this._reservedContent.macros ? 'xlsm' : 'xlsx', applicationType = nameSuffix === 'xlsm' ? 'application/vnd.ms-excel.sheet.macroEnabled.12' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                if (fileName) {
                    suffixIndex = fileName.lastIndexOf('.');
                    if (suffixIndex < 0) {
                        fileName += '.' + nameSuffix;
                    }
                    else if (suffixIndex === 0) {
                        throw 'Invalid file name.';
                    }
                    else {
                        suffix = fileName.substring(suffixIndex + 1);
                        if (suffix === '') {
                            fileName += '.' + nameSuffix;
                        }
                        else if (suffix !== nameSuffix) {
                            fileName += '.' + nameSuffix;
                        }
                    }
                    blob = new Blob([Workbook._base64DecToArr(result.base64)], { type: applicationType });
                    this._saveToFile(blob, fileName);
                }
                return result.base64;
            };
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
            Workbook.prototype.load = function (base64) {
                var dataPrefixIndex;
                if (base64 == null || base64.length === 0) {
                    throw 'Invalid xlsx file content.';
                }
                dataPrefixIndex = base64.search(/base64,/i);
                if (dataPrefixIndex !== -1) {
                    base64 = base64.substring(dataPrefixIndex + 7);
                }
                this._deserialize(xlsx._xlsx(base64));
            };
            // Serializes the workbook instance to workbook object model. 
            Workbook.prototype._serialize = function () {
                var workbookOM = { sheets: [] };
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
            };
            // Deserializes the workbook object model to workbook instance.
            Workbook.prototype._deserialize = function (workbookOM) {
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
            };
            // add worksheet instance into the _sheets array of the workbook.
            Workbook.prototype._addWorkSheet = function (workSheet, sheetIndex) {
                if (this._sheets == null) {
                    this._sheets = [];
                }
                if (sheetIndex != null && !isNaN(sheetIndex)) {
                    this._sheets[sheetIndex] = workSheet;
                }
                else {
                    this._sheets.push(workSheet);
                }
            };
            // Save the blob object generated by the workbook instance to xlsx file.
            Workbook.prototype._saveToFile = function (blob, fileName) {
                var reader, link, click;
                if (navigator.msSaveBlob) {
                    // Saving the xlsx file using Blob and msSaveBlob in IE.
                    navigator.msSaveBlob(blob, fileName);
                }
                else {
                    reader = new FileReader();
                    link = document.createElement('a');
                    click = function (element) {
                        var evnt = document.createEvent('MouseEvents');
                        evnt.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                        element.dispatchEvent(evnt);
                    };
                    reader.onload = function () {
                        link.download = fileName;
                        link.href = reader.result;
                        click(link);
                        link = null;
                    };
                    reader.readAsDataURL(blob);
                }
            };
            /**
             * Converts the wijmo date format to Excel format.
             *
             * @param format The wijmo date format.
             * @return Excel format representation.
             */
            Workbook.toXlsxDateFormat = function (format) {
                var xlsxFormat;
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
                    .replace(/M+/gi, function (str) {
                    return str.toLowerCase();
                }).replace(/g+y+/gi, function (str) {
                    return str.substring(0, str.indexOf('y')) + 'e';
                });
                if (/FY|Q/i.test(xlsxFormat)) {
                    return 'General';
                }
                return xlsxFormat;
            };
            /**
             * Converts the wijmo number format to xlsx format.
             *
             * @param format The wijmo number format.
             * @return Excel format representation.
             */
            Workbook.toXlsxNumberFormat = function (format) {
                var dec = -1, wijmoFormat = format ? format.toLowerCase() : '', fisrtFormatChar = wijmoFormat[0], mapFormat = this._formatMap[fisrtFormatChar], currencySymbol = wijmo.culture.Globalize.numberFormat.currency.symbol, commaArray = wijmoFormat.split(','), decimalArray = [], xlsxFormat, i;
                if (mapFormat) {
                    if (fisrtFormatChar === 'c') {
                        mapFormat = mapFormat.replace(/\{1\}/g, currencySymbol);
                    }
                    if (wijmoFormat.length > 1) {
                        dec = parseInt(commaArray[0].substr(1));
                    }
                    else {
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
                        }
                        else {
                            xlsxFormat = mapFormat.replace(/\{0\}/g, (!isNaN(dec) && dec > 0 ? '.' : '') + decimalArray.join(''));
                        }
                    }
                    else {
                        if (fisrtFormatChar === 'd') {
                            xlsxFormat = mapFormat.replace(/\{0\}/g, '0');
                        }
                        else {
                            xlsxFormat = mapFormat.replace(/\{0\}/g, '');
                        }
                    }
                }
                else {
                    xlsxFormat = wijmoFormat;
                }
                return xlsxFormat;
            };
            /**
             * Converts the xlsx multi-section format string to an array of corresponding wijmo formats.
             *
             * @param xlsxFormat The Excel format string, that may contain multiple format sections separated by semicolon.
             * @return An array of .Net format strings where each element corresponds to a separate Excel format section.
             * The returning array always contains at least one element. It can be an empty string in case the passed Excel format is empty.
             */
            Workbook.fromXlsxFormat = function (xlsxFormat) {
                var wijmoFormats = [], wijmoFormat, formats, currentFormat, i, j, lastDotIndex, lastZeroIndex, lastCommaIndex, commaArray, currencySymbol = wijmo.culture.Globalize.numberFormat.currency.symbol;
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
                            .replace(/H+/g, function (str) {
                            return str.toLowerCase();
                        }).replace(/m+/g, function (str) {
                            return str.toUpperCase();
                        }).replace(/S+/g, function (str) {
                            return str.toLowerCase();
                        }).replace(/AM\/PM/gi, 'tt')
                            .replace(/A\/P/gi, 't')
                            .replace(/\.000/g, '.fff')
                            .replace(/\.00/g, '.ff')
                            .replace(/\.0/g, '.f')
                            .replace(/\\[\-\s,]/g, function (str) {
                            return str.substring(1);
                        }).replace(/Y+/g, function (str) {
                            return str.toLowerCase();
                        }).replace(/D+/g, function (str) {
                            return str.toLowerCase();
                        }).replace(/M+:?|:?M+/gi, function (str) {
                            if (str.indexOf(':') > -1) {
                                return str.toLowerCase();
                            }
                            else {
                                return str;
                            }
                        }).replace(/g+e/gi, function (str) {
                            return str.substring(0, str.length - 1) + 'yy';
                        });
                    }
                    else {
                        lastDotIndex = currentFormat.lastIndexOf('.');
                        lastZeroIndex = currentFormat.lastIndexOf('0');
                        lastCommaIndex = currentFormat.lastIndexOf(',');
                        if (currentFormat.search(/\[\$([^\-\]]+)[^\]]*\]/) > -1 ||
                            (currentFormat.indexOf(currencySymbol) > -1 && currentFormat.search(/\[\$([\-\]]+)[^\]]*\]/) === -1)) {
                            wijmoFormat = 'c';
                        }
                        else if (currentFormat[xlsxFormat.length - 1] === '%') {
                            wijmoFormat = 'p';
                        }
                        else {
                            wijmoFormat = 'n';
                        }
                        if (lastDotIndex > -1 && lastDotIndex < lastZeroIndex) {
                            wijmoFormat += currentFormat.substring(lastDotIndex, lastZeroIndex).length;
                        }
                        else {
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
            };
            // Parse the cell format of flex grid to excel format.
            Workbook._parseCellFormat = function (format, isDate) {
                if (isDate) {
                    return this.toXlsxDateFormat(format);
                }
                return this.toXlsxNumberFormat(format);
            };
            // parse the basic excel format to js format
            Workbook._parseExcelFormat = function (item) {
                if (item === undefined || item === null
                    || item.value === undefined || item.value === null
                    || isNaN(item.value)) {
                    return undefined;
                }
                var formatCode = item.style && item.style.format ? item.style.format : '', format = '';
                if (item.isDate || wijmo.isDate(item.value)) {
                    format = this.fromXlsxFormat(formatCode)[0];
                }
                else if (wijmo.isNumber(item.value)) {
                    if (!formatCode || formatCode === 'General') {
                        format = wijmo.isInt(item.value) ? 'd' : 'f2';
                    }
                    else {
                        format = this.fromXlsxFormat(formatCode)[0];
                    }
                }
                else {
                    format = formatCode;
                }
                return format;
            };
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
            Workbook.xlsxAddress = function (row, col, absolute, absoluteCol) {
                var absRow = absolute ? '$' : '', absCol = absoluteCol == null ? absRow : (absoluteCol ? '$' : '');
                return (isNaN(col) ? '' : absCol + this._numAlpha(col)) + (isNaN(row) ? '' : absRow + (row + 1).toString());
            };
            /**
             * Convert Excel's alphanumeric cell, row or column index to the zero-based row/column indexes pair.
             *
             * @param xlsxIndex The alphanumeric Excel index that may include alphabetic A-based on column index
             * and/or numeric 1-based on row index, like "D15", "D" or "15". The alphabetic column index can be
             * in lower or upper case.
             * @return The object with <b>row</b> and <b>col</b> properties containing zero-based row and/or column indexes.
             * If row or column component is not specified in the alphanumeric index then corresponding returning property is undefined.
             */
            Workbook.tableAddress = function (xlsxIndex) {
                var patt = /^((\$?)([A-Za-z]+))?((\$?)(\d+))?$/, m = xlsxIndex && patt.exec(xlsxIndex), ret = {};
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
            };
            // Parse the horizontal alignment enum to string.
            Workbook._parseHAlignToString = function (hAlign) {
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
            };
            // Parse the horizontal alignment string to enum.
            Workbook._parseStringToHAlign = function (hAlign) {
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
            };
            // Parse the vartical alignment enum to string.
            Workbook._parseVAlignToString = function (vAlign) {
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
            };
            // Parse the vartical alignment string to enum.
            Workbook._parseStringToVAlign = function (vAlign) {
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
            };
            // Parse the border type enum to string.
            Workbook._parseBorderTypeToString = function (type) {
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
            };
            // Parse border type string to border type enum.
            Workbook._parseStringToBorderType = function (type) {
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
            };
            //TBD: make these functions accessible from c1xlsx.ts and reference them there.
            // Parse the number to alphat
            // For e.g. 5 will be converted to 'E'.
            Workbook._numAlpha = function (i) {
                var t = Math.floor(i / 26) - 1;
                return (t > -1 ? this._numAlpha(t) : '') + this._alphabet.charAt(i % 26);
            };
            Workbook._alphaNum = function (s) {
                var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', t = 0;
                if (!!s) {
                    s = s.toUpperCase();
                }
                if (s.length === 2) {
                    t = this._alphaNum(s.charAt(0)) + 1;
                }
                return t * 26 + this._alphabet.indexOf(s.substr(-1));
            };
            // taken from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding#The_.22Unicode_Problem.22
            Workbook._b64ToUint6 = function (nChr) {
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
            };
            // decode the base64 string to int array
            Workbook._base64DecToArr = function (sBase64, nBlocksSize) {
                var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""), nInLen = sB64Enc.length, nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2, taBytes = new Uint8Array(nOutLen);
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
            };
            // taken from https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
            /* Base64 string to array encoding */
            Workbook._uint6ToB64 = function (nUint6) {
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
            };
            Workbook._base64EncArr = function (aBytes) {
                var nMod3 = 2, sB64Enc = "";
                for (var nLen = aBytes.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++) {
                    nMod3 = nIdx % 3;
                    if (nIdx > 0 && (nIdx * 4 / 3) % 76 === 0) {
                        sB64Enc += "\r\n";
                    }
                    nUint24 |= aBytes[nIdx] << (16 >>> nMod3 & 24);
                    if (nMod3 === 2 || aBytes.length - nIdx === 1) {
                        sB64Enc += String.fromCharCode(this._uint6ToB64(nUint24 >>> 18 & 63), this._uint6ToB64(nUint24 >>> 12 & 63), this._uint6ToB64(nUint24 >>> 6 & 63), this._uint6ToB64(nUint24 & 63));
                        nUint24 = 0;
                    }
                }
                return sB64Enc.substr(0, sB64Enc.length - 2 + nMod3) + (nMod3 === 2 ? '' : nMod3 === 1 ? '=' : '==');
            };
            // Serializes the array of worksheet instance to the array of worksheet object model. 
            Workbook.prototype._serializeWorkSheets = function () {
                var sheetOMs = [], workSheet, i;
                for (i = 0; i < this._sheets.length; i++) {
                    workSheet = this._sheets[i];
                    if (workSheet) {
                        sheetOMs[i] = workSheet._serialize();
                    }
                }
                return sheetOMs;
            };
            //Serializes the array of workbookstyle instance to the array of workbookstyle object model.
            Workbook.prototype._serializeWorkbookStyles = function () {
                var styleOMs = [], style, i;
                for (i = 0; i < this._styles.length; i++) {
                    style = this._styles[i];
                    if (style) {
                        styleOMs[i] = style._serialize();
                    }
                }
                return styleOMs;
            };
            // Deserializes the array of worksheet object model to the array of worksheet instance.
            Workbook.prototype._deserializeWorkSheets = function (workSheets) {
                var sheet, sheetOM, i;
                this._sheets = [];
                for (i = 0; i < workSheets.length; i++) {
                    sheetOM = workSheets[i];
                    if (sheetOM) {
                        sheet = new WorkSheet();
                        sheet._deserialize(sheetOM);
                        this._sheets[i] = sheet;
                    }
                }
            };
            // Deserializes the array of workbookstyle object model to the array of the workbookstyle instance.
            Workbook.prototype._deserializeWorkbookStyles = function (workbookStyles) {
                var style, styleOM, i;
                this._styles = [];
                for (i = 0; i < workbookStyles.length; i++) {
                    styleOM = workbookStyles[i];
                    if (styleOM) {
                        style = new WorkbookStyle();
                        style._deserialize(styleOM);
                        this._styles[i] = style;
                    }
                }
            };
            Workbook._alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            Workbook._formatMap = {
                n: '#,##0{0}',
                c: '{1}#,##0{0}_);({1}#,##0{0})',
                p: '0{0}%',
                f: '0{0}',
                d: '{0}',
                g: '0{0}'
            };
            return Workbook;
        }());
        xlsx.Workbook = Workbook;
        /**
         * Represents the Workbook Object Model sheet definition that includes sheet properties and data.
         *
         * The sheet cells are stored in row objects and are accessible using JavaScript expressions like
         * <b>sheet.rows[i].cells[j]</b>.
         */
        var WorkSheet = (function () {
            /**
             * Initializes a new instance of the @see:WorkSheet class.
             */
            function WorkSheet() {
            }
            Object.defineProperty(WorkSheet.prototype, "columns", {
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
                get: function () {
                    if (this._columns == null) {
                        this._columns = [];
                    }
                    return this._columns;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WorkSheet.prototype, "cols", {
                /*
                 * Gets the @see:WorkbookColumn array of the @see:WorkSheet.
                 *
                 * This property is deprecated. Please use the @see:columns property instead.
                 */
                get: function () {
                    wijmo._deprecated('WorkSheet.cols', 'WorkSheet.columns');
                    return this.columns;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WorkSheet.prototype, "rows", {
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
                get: function () {
                    if (this._rows == null) {
                        this._rows = [];
                    }
                    return this._rows;
                },
                enumerable: true,
                configurable: true
            });
            // Serializes the worksheet instance to worksheet object model.
            WorkSheet.prototype._serialize = function () {
                var workSheetOM;
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
            };
            // Deserializes the worksheet object model to worksheet instance.
            WorkSheet.prototype._deserialize = function (workSheetOM) {
                var frozenPane, style;
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
            };
            // Add the workbookcolumn instance into the _columns array.
            WorkSheet.prototype._addWorkbookColumn = function (column, columnIndex) {
                if (this._columns == null) {
                    this._columns = [];
                }
                if (columnIndex != null && !isNaN(columnIndex)) {
                    this._columns[columnIndex] = column;
                }
                else {
                    this._columns.push(column);
                }
            };
            // Add the workbookrow instance into the _rows array.
            WorkSheet.prototype._addWorkbookRow = function (row, rowIndex) {
                if (this._rows == null) {
                    this._rows = [];
                }
                if (rowIndex != null && !isNaN(rowIndex)) {
                    this._rows[rowIndex] = row;
                }
                else {
                    this._rows.push(row);
                }
            };
            // Serializes the array of the workbookcolumn instance to the array of the workbookcolumn object model.
            WorkSheet.prototype._serializeWorkbookColumns = function () {
                var columnOMs = [], column, i;
                for (i = 0; i < this._columns.length; i++) {
                    column = this._columns[i];
                    if (column) {
                        ;
                        columnOMs[i] = column._serialize();
                    }
                }
                return columnOMs;
            };
            // Serializes the array of workbookrow instance to the array of the workbookrow object model.
            WorkSheet.prototype._serializeWorkbookRows = function () {
                var rowOMs = [], row, i;
                for (i = 0; i < this._rows.length; i++) {
                    row = this._rows[i];
                    if (row) {
                        rowOMs[i] = row._serialize();
                    }
                }
                return rowOMs;
            };
            // Deserializes the arry of the workbookcolumn object model to the array of the workbookcolumn instance.
            WorkSheet.prototype._deserializeWorkbookColumns = function (workbookColumns) {
                var columnOM, column, i;
                this._columns = [];
                for (i = 0; i < workbookColumns.length; i++) {
                    columnOM = workbookColumns[i];
                    if (columnOM) {
                        column = new WorkbookColumn();
                        column._deserialize(columnOM);
                        this._columns[i] = column;
                    }
                }
            };
            // Deserializes the array of the workbookrow object model to the array of the workbookrow instance.
            WorkSheet.prototype._deserializeWorkbookRows = function (workbookRows) {
                var rowOM, row, i;
                this._rows = [];
                for (i = 0; i < workbookRows.length; i++) {
                    rowOM = workbookRows[i];
                    if (rowOM) {
                        row = new WorkbookRow();
                        row._deserialize(rowOM);
                        this._rows[i] = row;
                    }
                }
            };
            // Checks whether the worksheet instance is empty.
            WorkSheet.prototype._checkEmptyWorkSheet = function () {
                return this._rows == null && this._columns == null && this.visible == null && this.summaryBelow == null && this.frozenPane == null && this.style == null
                    && (this.name == null || this.name === '');
            };
            return WorkSheet;
        }());
        xlsx.WorkSheet = WorkSheet;
        /**
         * Represents the Workbook Object Model column definition.
         */
        var WorkbookColumn = (function () {
            /**
             * Initializes a new instance of the @see:WorkbookColumn class.
             */
            function WorkbookColumn() {
            }
            // Serializes the workbookcolumn instance to workbookcolumn object model.
            WorkbookColumn.prototype._serialize = function () {
                var workbookColumnOM;
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
            };
            // Deserializes the workbookColummn object model to workbookcolumn instance.
            WorkbookColumn.prototype._deserialize = function (workbookColumnOM) {
                var style;
                if (workbookColumnOM.style) {
                    style = new WorkbookStyle();
                    style._deserialize(workbookColumnOM.style);
                    this.style = style;
                }
                this.autoWidth = workbookColumnOM.autoWidth;
                this.visible = workbookColumnOM.visible;
                this.width = workbookColumnOM.width;
            };
            // Checks whether the workbookcolumn instance is empty.
            WorkbookColumn.prototype._checkEmptyWorkbookColumn = function () {
                return this.style == null && this.width == null && this.autoWidth == null && this.visible == null;
            };
            return WorkbookColumn;
        }());
        xlsx.WorkbookColumn = WorkbookColumn;
        /**
         * Represents the Workbook Object Model row definition.
         */
        var WorkbookRow = (function () {
            /**
             * Initializes a new instance of the @see:WorkbookRow class.
             */
            function WorkbookRow() {
            }
            Object.defineProperty(WorkbookRow.prototype, "cells", {
                /**
                 * Gets or sets an array of cells in the row.
                 *
                 * Each @see:WorkbookCell object in the array describes a cell at the corresponding position in the row,
                 * i.e. the cell with index 0
                 * pertain to column with index A, cell with index 1 defines cell pertain to column with index B, and so on. If a certain cell
                 * has no definition (empty) in xlsx file then corresponding array element is undefined for both export and import operations.
                 */
                get: function () {
                    if (this._cells == null) {
                        this._cells = [];
                    }
                    return this._cells;
                },
                enumerable: true,
                configurable: true
            });
            // Serializes the workbookrow instance to workbookrow object model.
            WorkbookRow.prototype._serialize = function () {
                var workbookRowOM;
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
            };
            // Deserializes the workbookrow object model to workbookrow instance.
            WorkbookRow.prototype._deserialize = function (workbookRowOM) {
                var style;
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
            };
            // Add the workbook cell instance into the _cells array.
            WorkbookRow.prototype._addWorkbookCell = function (cell, cellIndex) {
                if (this._cells == null) {
                    this._cells = [];
                }
                if (cellIndex != null && !isNaN(cellIndex)) {
                    this._cells[cellIndex] = cell;
                }
                else {
                    this._cells.push(cell);
                }
            };
            // Serializes the array of the workbookcell instance to workbookcell object model.
            WorkbookRow.prototype._serializeWorkbookCells = function () {
                var cellOMs = [], cell, i;
                for (i = 0; i < this._cells.length; i++) {
                    cell = this._cells[i];
                    if (cell) {
                        cellOMs[i] = cell._serialize();
                    }
                }
                return cellOMs;
            };
            // Deserializes the array of the workbookcell object model to workbookcell instance. 
            WorkbookRow.prototype._deserializeWorkbookCells = function (workbookCells) {
                var cellOM, cell, i;
                this._cells = [];
                for (i = 0; i < workbookCells.length; i++) {
                    cellOM = workbookCells[i];
                    if (cellOM) {
                        cell = new WorkbookCell();
                        cell._deserialize(cellOM);
                        this._cells[i] = cell;
                    }
                }
            };
            // Checks whether the workbookcell instance is empty.
            WorkbookRow.prototype._checkEmptyWorkbookRow = function () {
                return this._cells == null && this.style == null && this.collapsed == null && this.visible == null
                    && (this.height == null || isNaN(this.height))
                    && (this.groupLevel == null || isNaN(this.groupLevel));
            };
            return WorkbookRow;
        }());
        xlsx.WorkbookRow = WorkbookRow;
        /**
         * Represents the Workbook Object Model cell definition.
         */
        var WorkbookCell = (function () {
            /**
             * Initializes a new instance of the @see:WorkbookCell class.
             */
            function WorkbookCell() {
            }
            // Serializes the workbookcell instance to workbookcell object model.
            WorkbookCell.prototype._serialize = function () {
                var workbookCellOM;
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
            };
            // Deserializes the workbookcell object model to workbookcell instance.
            WorkbookCell.prototype._deserialize = function (workbookCellOM) {
                var style;
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
            };
            // Checks whether the workbookcell instance is empty.
            WorkbookCell.prototype._checkEmptyWorkbookCell = function () {
                return this.style == null && this.value == null && this.isDate == null
                    && (this.formula == null || this.formula === '')
                    && (this.colSpan == null || isNaN(this.colSpan) || this.colSpan <= 1)
                    && (this.rowSpan == null || isNaN(this.rowSpan) || this.rowSpan <= 1);
            };
            return WorkbookCell;
        }());
        xlsx.WorkbookCell = WorkbookCell;
        /**
         * Workbook frozen pane definition
         */
        var WorkbookFrozenPane = (function () {
            /**
             * Initializes a new instance of the @see:WorkbookFrozenPane class.
             */
            function WorkbookFrozenPane() {
            }
            // Serializes the workbookfrozenpane instance to the workbookfrozenpane object model.
            WorkbookFrozenPane.prototype._serialize = function () {
                if ((this.columns == null || isNaN(this.columns) || this.columns === 0)
                    && (this.rows == null || isNaN(this.rows) || this.rows === 0)) {
                    return null;
                }
                else {
                    return {
                        columns: this.columns,
                        rows: this.rows
                    };
                }
            };
            // Deserializes the workbookfrozenpane object model to workbookfrozenpane instance.
            WorkbookFrozenPane.prototype._deserialize = function (workbookFrozenPaneOM) {
                this.columns = workbookFrozenPaneOM.columns;
                this.rows = workbookFrozenPaneOM.rows;
            };
            return WorkbookFrozenPane;
        }());
        xlsx.WorkbookFrozenPane = WorkbookFrozenPane;
        /**
         * Represents the Workbook Object Model style definition used to style Excel cells, columns and rows.
         */
        var WorkbookStyle = (function () {
            /**
             * Initializes a new instance of the @see:WorkbookStyle class.
             */
            function WorkbookStyle() {
            }
            // Serializes the workbookstyle instance to the workbookstyle object model.
            WorkbookStyle.prototype._serialize = function () {
                var workbookStyleOM;
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
                    workbookStyleOM.hAlign = wijmo.asEnum(this.hAlign, HAlign, false);
                }
                if (this.vAlign != null) {
                    workbookStyleOM.vAlign = wijmo.asEnum(this.vAlign, VAlign, false);
                }
                if (this.indent != null && !isNaN(this.indent)) {
                    workbookStyleOM.indent = this.indent;
                }
                return workbookStyleOM;
            };
            // Deserializes the workbookstyle object model to workbookstyle instance.
            WorkbookStyle.prototype._deserialize = function (workbookStyleOM) {
                var baseStyle, fill, font, borders;
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
                    this.hAlign = wijmo.asEnum(workbookStyleOM.hAlign, HAlign, false);
                }
                if (workbookStyleOM.vAlign != null) {
                    this.vAlign = wijmo.asEnum(workbookStyleOM.vAlign, VAlign, false);
                }
                if (workbookStyleOM.indent != null && !isNaN(workbookStyleOM.indent)) {
                    this.indent = workbookStyleOM.indent;
                }
            };
            // Checks whether the workbookstyle instance is empty.
            WorkbookStyle.prototype._checkEmptyWorkbookStyle = function () {
                return this.basedOn == null && this.fill == null
                    && this.font == null && this.borders == null
                    && (this.format == null || this.format === '')
                    && this.hAlign == null && this.vAlign == null;
            };
            return WorkbookStyle;
        }());
        xlsx.WorkbookStyle = WorkbookStyle;
        /**
         * Represents the Workbook Object Model font definition.
         */
        var WorkbookFont = (function () {
            /**
             * Initializes a new instance of the @see:WorkbookFont class.
             */
            function WorkbookFont() {
            }
            //Serializes the workbookfont instance to the workbookfont object model.
            WorkbookFont.prototype._serialize = function () {
                var workbookFontOM;
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
            };
            // Deserializes the workbookfotn object model to the workbookfont instance.
            WorkbookFont.prototype._deserialize = function (workbookFontOM) {
                this.bold = workbookFontOM.bold;
                this.color = workbookFontOM.color;
                this.family = workbookFontOM.family;
                this.italic = workbookFontOM.italic;
                this.size = workbookFontOM.size;
                this.underline = workbookFontOM.underline;
            };
            // Checks whether the workbookfont instance is empty.
            WorkbookFont.prototype._checkEmptyWorkbookFont = function () {
                return this.bold == null && this.italic == null && this.underline == null
                    && (this.color == null || this.color === '')
                    && (this.family == null || this.family === '')
                    && (this.size == null || isNaN(this.size));
            };
            return WorkbookFont;
        }());
        xlsx.WorkbookFont = WorkbookFont;
        /**
         * Represents the Workbook Object Model background fill definition.
         */
        var WorkbookFill = (function () {
            /**
             * Initializes a new instance of the @see:WorkbookFill class.
             */
            function WorkbookFill() {
            }
            // Serializes the workbookfill instance to the workbookfill object model.
            WorkbookFill.prototype._serialize = function () {
                var workbookFillOM;
                if (this.color) {
                    return {
                        color: this.color
                    };
                }
                else {
                    return null;
                }
            };
            // Deserializes the workbookfill object model to workbookfill instance.
            WorkbookFill.prototype._deserialize = function (workbookFillOM) {
                this.color = workbookFillOM.color;
            };
            return WorkbookFill;
        }());
        xlsx.WorkbookFill = WorkbookFill;
        /**
         * Represents the Workbook Object Model border definition.
         */
        var WorkbookBorder = (function () {
            /**
             * Initializes a new instance of the @see:WorkbookBorder class.
             */
            function WorkbookBorder() {
            }
            // Serializes the workbookborder instance to the workbookborder object model.
            WorkbookBorder.prototype._serialize = function () {
                var workbookBorderOM;
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
            };
            // Deserializes the workbookborder object model to workbookborder instance.
            WorkbookBorder.prototype._deserialize = function (workbookBorderOM) {
                var top, bottom, left, right, diagonal;
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
            };
            // Checks whether the workbookborder instance is empty.
            WorkbookBorder.prototype._checkEmptyWorkbookBorder = function () {
                return this.top == null && this.bottom == null
                    && this.left == null && this.right == null && this.diagonal == null;
            };
            return WorkbookBorder;
        }());
        xlsx.WorkbookBorder = WorkbookBorder;
        /**
         * Represents the Workbook Object Model background setting definition.
         */
        var WorkbookBorderSetting = (function () {
            /**
             * Initializes a new instance of the @see:WorkbookBorderSetting class.
             */
            function WorkbookBorderSetting() {
            }
            // Serializes the workbookbordersetting instance to the workbookbordersetting object model.
            WorkbookBorderSetting.prototype._serialize = function () {
                var workbookBorderSettingOM;
                if ((this.color == null || this.color === '') && this.style == null) {
                    return null;
                }
                workbookBorderSettingOM = {};
                if (this.color) {
                    workbookBorderSettingOM.color = this.color;
                }
                if (this.style != null) {
                    workbookBorderSettingOM.style = wijmo.asEnum(this.style, BorderStyle, false);
                }
                return workbookBorderSettingOM;
            };
            // Deserializes the workbookbordersetting object model to workbookbordersetting instance.
            WorkbookBorderSetting.prototype._deserialize = function (workbookBorderSettingOM) {
                this.color = workbookBorderSettingOM.color;
                if (workbookBorderSettingOM.style != null) {
                    this.style = wijmo.asEnum(workbookBorderSettingOM.style, BorderStyle, false);
                }
            };
            return WorkbookBorderSetting;
        }());
        xlsx.WorkbookBorderSetting = WorkbookBorderSetting;
        /**
         * Defines the Workbook Object Model horizontal text alignment.
         */
        (function (HAlign) {
            /** Alignment depends on the cell value type. */
            HAlign[HAlign["General"] = 0] = "General";
            /** Text is aligned to the left. */
            HAlign[HAlign["Left"] = 1] = "Left";
            /** Text is centered. */
            HAlign[HAlign["Center"] = 2] = "Center";
            /** Text is aligned to the right. */
            HAlign[HAlign["Right"] = 3] = "Right";
            /** Text is replicated to fill the whole cell width. */
            HAlign[HAlign["Fill"] = 4] = "Fill";
            /** Text is justified. */
            HAlign[HAlign["Justify"] = 5] = "Justify";
        })(xlsx.HAlign || (xlsx.HAlign = {}));
        var HAlign = xlsx.HAlign;
        /**
         * Vertical alignment
         */
        (function (VAlign) {
            /** Top vertical alignment */
            VAlign[VAlign["Top"] = 0] = "Top";
            /** Center vertical alignment */
            VAlign[VAlign["Center"] = 1] = "Center";
            /** Bottom vertical alignment */
            VAlign[VAlign["Bottom"] = 2] = "Bottom";
            /** Justify vertical alignment */
            VAlign[VAlign["Justify"] = 3] = "Justify";
        })(xlsx.VAlign || (xlsx.VAlign = {}));
        var VAlign = xlsx.VAlign;
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
        (function (BorderStyle) {
            /** No border */
            BorderStyle[BorderStyle["None"] = 0] = "None";
            /** Thin border */
            BorderStyle[BorderStyle["Thin"] = 1] = "Thin";
            /** Medium border */
            BorderStyle[BorderStyle["Medium"] = 2] = "Medium";
            /** Dashed border */
            BorderStyle[BorderStyle["Dashed"] = 3] = "Dashed";
            /** Dotted border */
            BorderStyle[BorderStyle["Dotted"] = 4] = "Dotted";
            /** Thick line border */
            BorderStyle[BorderStyle["Thick"] = 5] = "Thick";
            /** Double line border */
            BorderStyle[BorderStyle["Double"] = 6] = "Double";
            /** Hair line border */
            BorderStyle[BorderStyle["Hair"] = 7] = "Hair";
            /** Medium dashed border */
            BorderStyle[BorderStyle["MediumDashed"] = 8] = "MediumDashed";
            /** Thin dash dotted border */
            BorderStyle[BorderStyle["ThinDashDotted"] = 9] = "ThinDashDotted";
            /** Medium dash dotted border */
            BorderStyle[BorderStyle["MediumDashDotted"] = 10] = "MediumDashDotted";
            /** Thin dash dot dotted border */
            BorderStyle[BorderStyle["ThinDashDotDotted"] = 11] = "ThinDashDotDotted";
            /** Medium dash dot dotted border */
            BorderStyle[BorderStyle["MediumDashDotDotted"] = 12] = "MediumDashDotDotted";
            /** Slanted medium dash dotted border */
            BorderStyle[BorderStyle["SlantedMediumDashDotted"] = 13] = "SlantedMediumDashDotted";
        })(xlsx.BorderStyle || (xlsx.BorderStyle = {}));
        var BorderStyle = xlsx.BorderStyle;
    })(xlsx = wijmo.xlsx || (wijmo.xlsx = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Workbook.js.map