//---------------------------------------------------------
//
// Change log.
//
// 1.  Add row height / column width support for exporting.
//     We add the height property in the worksheet.row for exporting row height.
//     We add the width property in the worksheet.col for exporting column width.
// 2.  Add row/column visible support for exporting.
//     We add the rowVisible property in the first cell of each row to supporting the row visible feature.
//     We add the visible property in the cells for supporting the column visible feature.
// 3.  Add group header support for exporting/importing.
//     We add the groupLevel property in the cells for exporting group.
//     We read the outlineLevel property of the excel row for importing group.
// 4.  Add indent property for nested group for exporting.
//     We add the indent property in the cells of the group row for exporting the indentation for the nested groups.
// 5.  Modify the excel built-in format 'mm-dd-yy' to 'm/d/yyyy'.
// 6.  Add excel built-in format '$#,##0.00_);($#,##0.00)'.
// 7.  Fix issue that couldn't read rich text content of excel cell.
// 8.  Fix issue that couldn't read the excel cell content processed by the string processing function.
// 9.  Fix issue exporting empty sheet 'dimension ref' property incorrect.
// 10. Add frozen rows and columns supporting for exporting/importing.
//     We add frozenPane property that includes rows and columns sub properties in each worksheet.
// 11. Add 'ca' attribute for the cellFormula element for exporting.
// 12. Add formula supporting for importing.
// 13. escapeXML for the formula of the cell.
// 14. Add font color and fill color processing for exporting.
// 15. Add font and fill color processing for importing.
// 16. Add horizontal alignment processing for importing.
// 17. Add column width and row height processing for importing.
// 18. Update merge cells processing for exporting.
// 19. Add merge cells processing for importing.
// 20. Packed cell styles into the style property of cell for exporting.
// 21. Fixed convert excel date value to JS Date object issue.
// 22. Parse the merge cell info to rowSpan and colSpan property of cell.
// 23. Add row collapsed processing for importing.
// 24. Fixed the getting type of cell issue when there is shared formula in the cell.
// 25. Rename the method name from xlsx to _xlsx.
// 26. Add isDate property for cell to indicated whether the value of the cell is date or not.
// 27. Add parsePixelToCharWidth method and parseCharWidthToPixel method.
// 28. Just get the display string for importing.
// 29. Add inheritance style parsing for exporting.
// 30. Fixed the issue that the string like number pattern won't be exported as string.
// 31. Added parse indexed color processing.
// 32. Added parse theme color processing.
// 33. Added row style supporting.
// 34. Added column style supporting.
// 35. Added check empty object function.
// 36. Added hidden worksheet supporting for importing\exporting.
// 37. Parse the different color pattern to Hex pattern like #RRGGBB for exporting.
// 38. Add vertical alignment processing for exporting.
// 39. Add shared formula importing.
// 40. Add macro importing\exporting.
// 41. Add border style exporting.
// 42. Add processing for worksheet style.
//
//----------------------------------------------------------
if ((typeof JSZip === 'undefined' || !JSZip) && typeof window['require'] === 'function') {
    var JSZip = window['require']('node-zip');
}
/*
 * Defines the xlsx exporting\importing related class and methods.
 */
var wijmo;
(function (wijmo) {
    var xlsx;
    (function (xlsx) {
        'use strict';
        /*
         * xlsx file exporting\importing processing.
         *
         * @param file The object module for exporting to xlsx file or the encoded base64 string of xlsx file for importing.
         */
        function _xlsx(file) {
            'use strict'; // v2.3.2
            // check dependency...
            wijmo.assert(JSZip != null, 'wijmo.c1xlsx requires the JSZip library.');
            var result, zip = new JSZip(), zipTime, processTime, s, content, f, i, j, k, l, t, w, sharedStrings, styles, index, data, val, formula /* GrapeCity: Add formula variable.*/, sharedFormulas /* GrapeCity: Add sharedFormulas variable.*/, cellRef /* GrapeCity: Add cellRef variable.*/, si /* GrapeCity: Add si(shared Index) variable.*/, rowStyle /* GrapeCity: Add rowStyle variable.*/, columnStyle /* GrapeCity: Add columnStyle variable.*/, sheetStyle /* GrapeCity: Add sheetStyle variable.*/, style, borders, fonts, font, docProps, xl, xlWorksheets, worksheet, worksheetVisible /* GrapeCity: Add worksheetVisible variable.*/, contentTypes = [], contentType, props = [], xlRels = [], xlRel, worksheets = [], sheetEle, id, columns, cols, columnSettings, colWidth, pane, cell, row, merges, idx, colIndex, groupLevel, frozenRows, frozenCols, fills, fill, macroEnabled /* GrapeCity: Add macroEnabled variable. */, applicationType /* GrapeCity: Add applicationType variable. */, summaryBelow, numFmts = ['General', '0', '0.00', '#,##0', '#,##0.00', , , '$#,##0.00_);($#,##0.00)' /* GrapeCity: Add built-in accounting format.*/, , '0%', '0.00%', '0.00E+00', '# ?/?', '# ??/??', 'm/d/yyyy' /* GrapeCity: Modify the built-in date format.*/, 'd-mmm-yy', 'd-mmm', 'mmm-yy', 'h:mm AM/PM', 'h:mm:ss AM/PM',
                'h:mm', 'h:mm:ss', 'm/d/yy h:mm', , , , , , , , , , , , , , , '#,##0 ;(#,##0)', '#,##0 ;[Red](#,##0)', '#,##0.00;(#,##0.00)', '#,##0.00;[Red](#,##0.00)', , , , , 'mm:ss', '[h]:mm:ss', 'mmss.0', '##0.0E+0', '@'], numFmtArray, fontArray, fillArray, colorThemes, /* GrapeCity: numFmtArray, fontArray, fillArray and themes for importing.*/ colsSetting, height, /* GrapeCity: Stores the column width and row height for importing.*/ mergeCellArray, mergeRange, mergeCells, mergeCell, /* GrapeCity: Stores merge cell range for importing.*/ alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', defaultFontName = 'Calibri', defaultFontSize = 11, 
            // GrapeCity Begin: Add the indexed color map. 
            // The mapping for the indexed colors please refer
            // https://msdn.microsoft.com/en-us/library/documentformat.openxml.spreadsheet.indexedcolors(v=office.14).aspx
            indexedColors = ['000000', 'FFFFFF', 'FF0000', '00FF00', '0000FF', 'FFFF00', 'FF00FF', '00FFFF',
                '000000', 'FFFFFF', 'FF0000', '00FF00', '0000FF', 'FFFF00', 'FF00FF', '00FFFF',
                '800000', '008000', '000080', '808000', '800080', '008080', 'C0C0C0', '808080',
                '9999FF', '993366', 'FFFFCC', 'CCFFFF', '660066', 'FF8080', '0066CC', 'CCCCFF',
                '000080', 'FF00FF', 'FFFF00', '00FFFF', '800080', '800000', '008080', '0000FF',
                '00CCFF', 'CCFFFF', 'CCFFCC', 'FFFF99', '99CCFF', 'FF99CC', 'CC99FF', 'FFCC99',
                '3366FF', '33CCCC', '99CC00', 'FFCC00', 'FF9900', 'FF6600', '666699', '969696',
                '003366', '339966', '003300', '333300', '993300', '993366', '333399', '333333',
                '000000', 'FFFFFF'], domParser, xmlSerializer, xmlDescription = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', sheetDoc, sheet, sheetData, col, pageMargins, docRegExp = /xmlns\:NS\d+=\"\"\s+NS\d+\:/g, workbookNS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main', contentTypesNS = 'http://schemas.openxmlformats.org/package/2006/content-types', relationshipsNS = 'http://schemas.openxmlformats.org/package/2006/relationships';
            // GrapeCity End
            function numAlpha(i) {
                var t = Math.floor(i / 26) - 1;
                return (t > -1 ? numAlpha(t) : '') + alphabet.charAt(i % 26);
            }
            function alphaNum(s) {
                var t = 0;
                if (s.length === 2) {
                    t = alphaNum(s.charAt(0)) + 1;
                }
                return t * 26 + alphabet.indexOf(s.substr(-1));
            }
            function convertDate(input) {
                var d = new Date(1900, 0, 0), isDateObject = Object.prototype.toString.call(input) === "[object Date]", offset = ((isDateObject ? input.getTimezoneOffset() : (new Date()).getTimezoneOffset()) - d.getTimezoneOffset()) * 60000, inputDate;
                // GrapeCity Begin: Fixed convert excel date value to JS Date object issue.
                if (isDateObject) {
                    return ((input.getTime() - d.getTime() - offset) / 86400000) + 1;
                }
                else if (wijmo.isNumber(input)) {
                    inputDate = new Date(Math.round((+d + (input - 1) * 86400000) / 1000) * 1000);
                    offset = (inputDate.getTimezoneOffset() - d.getTimezoneOffset()) * 60000;
                    if (offset !== 0) {
                        return new Date(Math.round((+d + offset + (input - 1) * 86400000) / 1000) * 1000);
                    }
                    return inputDate;
                }
                else {
                    return null;
                }
                // GrapeCity End
            }
            function typeOf(obj) {
                return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
            }
            // GrapeCity Begin: Add the function to get the color for the font or the fill node. 
            function getColor(s, isFillColor) {
                var theme, index, value, color = isFillColor ? s.querySelector('fgColor') : s.querySelector('color');
                if (!color) {
                    return null;
                }
                if (color.hasAttribute('rgb')) {
                    value = color.getAttribute('rgb');
                    if (value && value.length === 8) {
                        value = value.substring(2);
                    }
                }
                else if (color.hasAttribute('indexed')) {
                    value = +color.getAttribute('indexed');
                    value = indexedColors[index] || '';
                }
                else {
                    theme = +color.getAttribute('theme');
                    if (color.hasAttribute('tint')) {
                        value = +color.getAttribute('tint');
                    }
                    value = getThemeColor(theme, value);
                }
                return value && value[0] === '#' ? value : '#' + value;
            }
            // GrapeCity End
            // GrapeCity Begin: Add the function to parse the theme color to RGB color.
            function getThemeColor(theme, tint) {
                var themeColor = colorThemes[theme], color, hslArray;
                if (tint != null) {
                    color = new wijmo.Color('#' + themeColor);
                    hslArray = color.getHsl();
                    // About the tint value and theme color convert to rgb color, 
                    // please refer https://msdn.microsoft.com/en-us/library/documentformat.openxml.spreadsheet.color.aspx
                    if (tint < 0) {
                        hslArray[2] = hslArray[2] * (1.0 + tint);
                    }
                    else {
                        hslArray[2] = hslArray[2] * (1.0 - tint) + (1 - 1 * (1.0 - tint));
                    }
                    color = wijmo.Color.fromHsl(hslArray[0], hslArray[1], hslArray[2]);
                    return color.toString().substring(1);
                }
                // if the color value is undefined, we should return the themeColor (TFS 121712)
                return themeColor;
            }
            // GrapeCity End
            //  GrapeCity Begin: Parse the different color pattern to Hex pattern like #RRGGBB for exporting.
            function parseColor(color) {
                var parsedColor = new wijmo.Color(color);
                // Because excel doesn't support transparency, we have to make the color closer to white to simulate the transparency.
                if (parsedColor.a < 1) {
                    parsedColor = wijmo.Color.toOpaque(parsedColor);
                }
                return parsedColor.toString();
            }
            // GrapeCity End
            function unescapeXML(s) { return typeof s === 'string' ? s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, '\'') : ''; }
            // Parse the pixel width to character width for exporting
            function parsePixelToCharWidth(pixels) {
                if (pixels == null || isNaN(+pixels)) {
                    return null;
                }
                // The calculation is =Truncate(({pixels}-5)/{Maximum Digit Width} * 100+0.5)/100
                // Please refer https://msdn.microsoft.com/en-us/library/documentformat.openxml.spreadsheet.column(v=office.14).aspx
                return ((+pixels - 5) / 7 * 100 + 0.5) / 100;
            }
            // Parse the character width to pixel width for importing
            function parseCharWidthToPixel(charWidth) {
                if (charWidth == null || isNaN(+charWidth)) {
                    return null;
                }
                // The calculation is =Truncate(((256 * {width} + Truncate(128/{Maximum Digit Width}))/256)*{Maximum Digit Width})
                // Please refer https://msdn.microsoft.com/en-us/library/documentformat.openxml.spreadsheet.column(v=office.14).aspx
                return ((256 * (+charWidth) + (128 / 7)) / 256) * 7;
            }
            // Parse the chart count to char width
            function parseCharCountToCharWidth(charCnt) {
                if (charCnt == null || isNaN(+charCnt)) {
                    return null;
                }
                // The calculation is =Truncate([{Number of Characters} * {Maximum Digit Width} + {5 pixel padding}]/{Maximum Digit Width}*256)/256
                // Please refer https://msdn.microsoft.com/en-us/library/documentformat.openxml.spreadsheet.column(v=office.14).aspx
                return (((+charCnt) * 7 + 5) / 7 * 256) / 256;
            }
            // Parse border setting for exporting.
            function parseBorder(border) {
                for (var edge in { left: 0, right: 0, top: 0, bottom: 0, diagonal: 0 }) {
                    var egdeBorder = border[edge];
                    if (egdeBorder) {
                        if (egdeBorder.color) {
                            egdeBorder.color = parseColor(egdeBorder.color);
                        }
                        if (egdeBorder.style != null && !wijmo.isString(egdeBorder.style)) {
                            egdeBorder.style = xlsx.Workbook._parseBorderTypeToString(wijmo.asEnum(egdeBorder.style, xlsx.BorderStyle, false));
                        }
                    }
                }
            }
            // Parse inheritance style
            function resolveStyleInheritance(style) {
                var resolvedStyle;
                // no inheritance? save some time
                if (!style.basedOn) {
                    return style;
                }
                // resolve inheritance
                for (var key in style.basedOn) {
                    if (key === 'basedOn') {
                        resolvedStyle = resolveStyleInheritance(style.basedOn);
                        for (key in resolvedStyle) {
                            var val = resolvedStyle[key];
                            style[key] = style[key] == null ? val : extend(style[key], val);
                        }
                    }
                    else {
                        var val = style.basedOn[key];
                        style[key] = style[key] == null ? val : extend(style[key], val);
                    }
                }
                delete style.basedOn;
                // return resolved style
                return style;
            }
            // Gets all base shared formulas for a worksheet.
            function getsBaseSharedFormulas(sheet) {
                var formulas = sheet.querySelectorAll('sheetData>row>c>f[ref]'), formula, sharedIndex, cellRef;
                sharedFormulas = [];
                if (formulas && formulas.length > 0) {
                    for (var i = 0; i < formulas.length; i++) {
                        formula = formulas[i];
                        sharedIndex = formula.getAttribute('si');
                        cellRef = formula.getAttribute('ref');
                        cellRef = cellRef ? cellRef.substring(0, cellRef.indexOf(':')) : '';
                        formula = formula.textContent;
                        sharedFormulas[+sharedIndex] = parseSharedFormulaInfo(cellRef, formula);
                    }
                }
            }
            // Parse the base shared formula to shared formula info that contains the cell reference, formula and the formula cell references of the shared formula.
            function parseSharedFormulaInfo(cellRef, formula) {
                var formulaRefs = formula.match(/(\'?\w+\'?\!)?(\$?[A-Za-z]+)(\$?\d+)/g), formulaRef, formulaRefCellIndex, sheetRef, cellRefAddress, formulaRefsAddress;
                cellRefAddress = xlsx.Workbook.tableAddress(cellRef);
                if (formulaRefs && formulaRefs.length > 0) {
                    formulaRefsAddress = [];
                    for (var i = 0; i < formulaRefs.length; i++) {
                        formulaRef = formulaRefs[i];
                        formula = formula.replace(formulaRef, '{' + i + '}');
                        formulaRefCellIndex = formulaRef.indexOf('!');
                        if (formulaRefCellIndex > 0) {
                            sheetRef = formulaRef.substring(0, formulaRefCellIndex);
                            formulaRef = formulaRef.substring(formulaRefCellIndex + 1);
                        }
                        formulaRefsAddress[i] = {
                            cellAddress: xlsx.Workbook.tableAddress(formulaRef),
                            sheetRef: sheetRef
                        };
                    }
                }
                return {
                    cellRef: cellRefAddress,
                    formula: formula,
                    formulaRefs: formulaRefsAddress
                };
            }
            // Gets the shared formula via the si and cell reference.
            function getSharedFormula(si, cellRef) {
                var sharedFormulaInfo, cellAddress, rowDiff, colDiff, rowIndex, colIndex, formula, formulaRefs, formulaRef, formulaCell;
                if (sharedFormulas && sharedFormulas.length > 0) {
                    sharedFormulaInfo = sharedFormulas[+si];
                    if (sharedFormulaInfo) {
                        formula = sharedFormulaInfo.formula;
                        formulaRefs = sharedFormulaInfo.formulaRefs;
                        if (formulaRefs && formulaRefs.length > 0) {
                            cellAddress = xlsx.Workbook.tableAddress(cellRef);
                            rowDiff = cellAddress.row - sharedFormulaInfo.cellRef.row;
                            colDiff = cellAddress.col - sharedFormulaInfo.cellRef.col;
                            for (var i = 0; i < formulaRefs.length; i++) {
                                formulaRef = formulaRefs[i];
                                rowIndex = formulaRef.cellAddress.row + (formulaRef.cellAddress.absRow ? 0 : rowDiff);
                                colIndex = formulaRef.cellAddress.col + (formulaRef.cellAddress.absCol ? 0 : colDiff);
                                formulaCell = xlsx.Workbook.xlsxAddress(rowIndex, colIndex, formulaRef.cellAddress.absRow, formulaRef.cellAddress.absCol);
                                if (formulaRef.sheetRef != null && formulaRef.sheetRef !== '') {
                                    formulaCell = formulaRef.sheetRef + '!' + formulaCell;
                                }
                                formula = formula.replace('{' + i + '}', formulaCell);
                            }
                        }
                        return formula;
                    }
                }
                return '';
            }
            // extends the source hash to destination hash
            function extend(dst, src) {
                if (wijmo.isObject(dst) && wijmo.isObject(src)) {
                    for (var key in src) {
                        var value = src[key];
                        if (wijmo.isObject(value) && dst[key] != null) {
                            extend(dst[key], value); // extend sub-objects
                        }
                        else if (value != null && dst[key] == null) {
                            dst[key] = value; // assign values
                        }
                    }
                    return dst;
                }
                else {
                    return src;
                }
            }
            function isEmpty(obj) {
                // Speed up calls to hasOwnProperty
                var hasOwnProperty = Object.prototype.hasOwnProperty;
                // null and undefined are "empty"
                if (obj == null)
                    return true;
                // Assume if it has a length property with a non-zero value
                // that that property is correct.
                if (obj.length > 0)
                    return false;
                if (obj.length === 0)
                    return true;
                // Otherwise, does it have any properties of its own?
                // Note that this doesn't handle
                // toString and valueOf enumeration bugs in IE < 9
                for (var key in obj) {
                    if (hasOwnProperty.call(obj, key))
                        return false;
                }
                return true;
            }
            // Generate the _rels doc.
            function generateRelsDoc() {
                var doc = document.implementation.createDocument(relationshipsNS, 'Relationships', null);
                var relEle = doc.createElementNS(relationshipsNS, 'Relationship');
                relEle.setAttribute('Id', 'rId3');
                relEle.setAttribute('Type', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties');
                relEle.setAttribute('Target', 'docProps/app.xml');
                doc.documentElement.appendChild(relEle);
                relEle = doc.createElementNS(relationshipsNS, 'Relationship');
                relEle.setAttribute('Id', 'rId2');
                relEle.setAttribute('Type', 'http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties');
                relEle.setAttribute('Target', 'docProps/core.xml');
                doc.documentElement.appendChild(relEle);
                relEle = doc.createElementNS(relationshipsNS, 'Relationship');
                relEle.setAttribute('Id', 'rId1');
                relEle.setAttribute('Type', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument');
                relEle.setAttribute('Target', 'xl/workbook.xml');
                doc.documentElement.appendChild(relEle);
                return doc;
            }
            // Generate the theme doc.
            function generateThemeDoc() {
                var doc = document.implementation.createDocument('', '', null);
                var theme = doc.createElement('a:theme');
                theme.setAttribute('xmlns:a', 'http://schemas.openxmlformats.org/drawingml/2006/main');
                theme.setAttribute('name', 'Office Theme');
                var themeElements = doc.createElement('a:themeElements');
                var clrScheme = generateClrScheme(doc);
                themeElements.appendChild(clrScheme);
                var fontScheme = generateFontScheme(doc);
                themeElements.appendChild(fontScheme);
                var fmtScheme = generateFmtScheme(doc);
                themeElements.appendChild(fmtScheme);
                theme.appendChild(themeElements);
                var objectDefaults = doc.createElement('a:objectDefaults');
                theme.appendChild(objectDefaults);
                var extraClrSchemeLst = doc.createElement('a:extraClrSchemeLst');
                theme.appendChild(extraClrSchemeLst);
                doc.appendChild(theme);
                return doc;
            }
            // Generate ClrScheme element for theme doc.
            function generateClrScheme(doc) {
                var clrScheme = doc.createElement('a:clrScheme');
                clrScheme.setAttribute('name', 'Office');
                var themeEle = doc.createElement('a:dk1');
                var themeEleChild = doc.createElement('a:sysClr');
                themeEleChild.setAttribute('val', 'windowText');
                themeEleChild.setAttribute('lastClr', '000000');
                themeEle.appendChild(themeEleChild);
                clrScheme.appendChild(themeEle);
                themeEle = doc.createElement('a:lt1');
                themeEleChild = doc.createElement('a:sysClr');
                themeEleChild.setAttribute('val', 'window');
                themeEleChild.setAttribute('lastClr', 'FFFFFF');
                themeEle.appendChild(themeEleChild);
                clrScheme.appendChild(themeEle);
                themeEle = doc.createElement('a:dk2');
                themeEleChild = doc.createElement('a:srgbClr');
                themeEleChild.setAttribute('val', '1F497D');
                themeEle.appendChild(themeEleChild);
                clrScheme.appendChild(themeEle);
                themeEle = doc.createElement('a:lt2');
                themeEleChild = doc.createElement('a:srgbClr');
                themeEleChild.setAttribute('val', 'EEECE1');
                themeEle.appendChild(themeEleChild);
                clrScheme.appendChild(themeEle);
                themeEle = doc.createElement('a:accent1');
                themeEleChild = doc.createElement('a:srgbClr');
                themeEleChild.setAttribute('val', '4F81BD');
                themeEle.appendChild(themeEleChild);
                clrScheme.appendChild(themeEle);
                themeEle = doc.createElement('a:accent2');
                themeEleChild = doc.createElement('a:srgbClr');
                themeEleChild.setAttribute('val', 'C0504D');
                themeEle.appendChild(themeEleChild);
                clrScheme.appendChild(themeEle);
                themeEle = doc.createElement('a:accent3');
                themeEleChild = doc.createElement('a:srgbClr');
                themeEleChild.setAttribute('val', '9BBB59');
                themeEle.appendChild(themeEleChild);
                clrScheme.appendChild(themeEle);
                themeEle = doc.createElement('a:accent4');
                themeEleChild = doc.createElement('a:srgbClr');
                themeEleChild.setAttribute('val', '8064A2');
                themeEle.appendChild(themeEleChild);
                clrScheme.appendChild(themeEle);
                themeEle = doc.createElement('a:accent5');
                themeEleChild = doc.createElement('a:srgbClr');
                themeEleChild.setAttribute('val', '4BACC6');
                themeEle.appendChild(themeEleChild);
                clrScheme.appendChild(themeEle);
                themeEle = doc.createElement('a:accent6');
                themeEleChild = doc.createElement('a:srgbClr');
                themeEleChild.setAttribute('val', 'F79646');
                themeEle.appendChild(themeEleChild);
                clrScheme.appendChild(themeEle);
                themeEle = doc.createElement('a:hlink');
                themeEleChild = doc.createElement('a:srgbClr');
                themeEleChild.setAttribute('val', '0000FF');
                themeEle.appendChild(themeEleChild);
                clrScheme.appendChild(themeEle);
                themeEle = doc.createElement('a:folHlink');
                themeEleChild = doc.createElement('a:srgbClr');
                themeEleChild.setAttribute('val', '800080');
                themeEle.appendChild(themeEleChild);
                clrScheme.appendChild(themeEle);
                return clrScheme;
            }
            // Generate fontScheme element for theme doc.
            function generateFontScheme(doc) {
                var fontScheme = doc.createElement('a:fontScheme');
                fontScheme.setAttribute('name', 'Office');
                var fonts = doc.createElement('a:majorFont');
                var font = doc.createElement('a:latin');
                font.setAttribute('typeface', 'Cambria');
                fonts.appendChild(font);
                font = doc.createElement('a:ea');
                font.setAttribute('typeface', '');
                fonts.appendChild(font);
                font = doc.createElement('a:cs');
                font.setAttribute('typeface', '');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Jpan');
                font.setAttribute('typeface', 'ＭＳ Ｐゴシック');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Hang');
                font.setAttribute('typeface', '맑은 고딕');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Hans');
                font.setAttribute('typeface', '宋体');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Hant');
                font.setAttribute('typeface', '新細明體');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Arab');
                font.setAttribute('typeface', 'Times New Roman');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Hebr');
                font.setAttribute('typeface', 'Times New Roman');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Hebr');
                font.setAttribute('typeface', 'Times New Roman');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Thai');
                font.setAttribute('typeface', 'Tahoma');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Ethi');
                font.setAttribute('typeface', 'Nyala');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Beng');
                font.setAttribute('typeface', 'Vrinda');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Gujr');
                font.setAttribute('typeface', 'Shruti');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Khmr');
                font.setAttribute('typeface', 'MoolBoran');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Knda');
                font.setAttribute('typeface', 'Tunga');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Guru');
                font.setAttribute('typeface', 'Raavi');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Cans');
                font.setAttribute('typeface', 'Euphemia');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Cher');
                font.setAttribute('typeface', 'Plantagenet Cherokee');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Yiii');
                font.setAttribute('typeface', 'Microsoft Yi Baiti');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Tibt');
                font.setAttribute('typeface', 'Microsoft Himalaya');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Thaa');
                font.setAttribute('typeface', 'MV Boli');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Deva');
                font.setAttribute('typeface', 'Mangal');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Telu');
                font.setAttribute('typeface', 'Gautami');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Taml');
                font.setAttribute('typeface', 'Latha');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Syrc');
                font.setAttribute('typeface', 'Estrangelo Edessa');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Orya');
                font.setAttribute('typeface', 'Kalinga');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Mlym');
                font.setAttribute('typeface', 'Kartika');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Laoo');
                font.setAttribute('typeface', 'DokChampa');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Sinh');
                font.setAttribute('typeface', 'Iskoola Pota');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Mong');
                font.setAttribute('typeface', 'Mongolian Baiti');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Viet');
                font.setAttribute('typeface', 'Times New Roman');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Uigh');
                font.setAttribute('typeface', 'Microsoft Uighur');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Geor');
                font.setAttribute('typeface', 'Sylfaen');
                fonts.appendChild(font);
                fontScheme.appendChild(fonts);
                fonts = doc.createElement('a:minorFont');
                font = doc.createElement('a:latin');
                font.setAttribute('typeface', 'Calibri');
                fonts.appendChild(font);
                font = doc.createElement('a:ea');
                font.setAttribute('typeface', '');
                fonts.appendChild(font);
                font = doc.createElement('a:cs');
                font.setAttribute('typeface', '');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Jpan');
                font.setAttribute('typeface', 'ＭＳ Ｐゴシック');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Hang');
                font.setAttribute('typeface', '맑은 고딕');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Hans');
                font.setAttribute('typeface', '宋体');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Hant');
                font.setAttribute('typeface', '新細明體');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Arab');
                font.setAttribute('typeface', 'Arial');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Hebr');
                font.setAttribute('typeface', 'Arial');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Hebr');
                font.setAttribute('typeface', 'Times New Roman');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Thai');
                font.setAttribute('typeface', 'Tahoma');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Ethi');
                font.setAttribute('typeface', 'Nyala');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Beng');
                font.setAttribute('typeface', 'Vrinda');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Gujr');
                font.setAttribute('typeface', 'Shruti');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Khmr');
                font.setAttribute('typeface', 'DaunPenh');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Knda');
                font.setAttribute('typeface', 'Tunga');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Guru');
                font.setAttribute('typeface', 'Raavi');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Cans');
                font.setAttribute('typeface', 'Euphemia');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Cher');
                font.setAttribute('typeface', 'Plantagenet Cherokee');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Yiii');
                font.setAttribute('typeface', 'Microsoft Yi Baiti');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Tibt');
                font.setAttribute('typeface', 'Microsoft Himalaya');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Thaa');
                font.setAttribute('typeface', 'MV Boli');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Deva');
                font.setAttribute('typeface', 'Mangal');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Telu');
                font.setAttribute('typeface', 'Gautami');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Taml');
                font.setAttribute('typeface', 'Latha');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Syrc');
                font.setAttribute('typeface', 'Estrangelo Edessa');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Orya');
                font.setAttribute('typeface', 'Kalinga');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Mlym');
                font.setAttribute('typeface', 'Kartika');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Laoo');
                font.setAttribute('typeface', 'DokChampa');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Sinh');
                font.setAttribute('typeface', 'Iskoola Pota');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Mong');
                font.setAttribute('typeface', 'Mongolian Baiti');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Viet');
                font.setAttribute('typeface', 'Arial');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Uigh');
                font.setAttribute('typeface', 'Microsoft Uighur');
                fonts.appendChild(font);
                font = doc.createElement('a:font');
                font.setAttribute('script', 'Geor');
                font.setAttribute('typeface', 'Sylfaen');
                fonts.appendChild(font);
                fontScheme.appendChild(fonts);
                return fontScheme;
            }
            // Generate fmtScheme element for theme doc.
            function generateFmtScheme(doc) {
                var fmtScheme = doc.createElement('a:fmtScheme');
                fmtScheme.setAttribute('name', 'Office');
                var fillStyles = generateFillScheme(doc);
                fmtScheme.appendChild(fillStyles);
                var lineStyles = generateLineStyles(doc);
                fmtScheme.appendChild(lineStyles);
                var effectStyles = generateEffectScheme(doc);
                fmtScheme.appendChild(effectStyles);
                var bgFillStyles = generateBgFillScheme(doc);
                fmtScheme.appendChild(bgFillStyles);
                return fmtScheme;
            }
            // Generate fillStyles element for fmtScheme element.
            function generateFillScheme(doc) {
                var fillStyles = doc.createElement('a:fillStyleLst');
                var fillStyle = doc.createElement('a:solidFill');
                var fillScheme = doc.createElement('a:schemeClr');
                fillScheme.setAttribute('val', 'phClr');
                fillStyle.appendChild(fillScheme);
                fillStyles.appendChild(fillStyle);
                fillStyle = doc.createElement('a:gradFill');
                fillStyle.setAttribute('rotWithShape', '1');
                var gsList = doc.createElement('a:gsLst');
                var gs = doc.createElement('a:gs');
                gs.setAttribute('pos', '0');
                fillScheme = doc.createElement('a:schemeClr');
                fillScheme.setAttribute('val', 'phClr');
                var tint = doc.createElement('a:tint');
                tint.setAttribute('val', '50000');
                fillScheme.appendChild(tint);
                var satMod = doc.createElement('a:satMod');
                satMod.setAttribute('val', '300000');
                fillScheme.appendChild(satMod);
                gs.appendChild(fillScheme);
                gsList.appendChild(gs);
                gs = doc.createElement('a:gs');
                gs.setAttribute('pos', '35000');
                fillScheme = doc.createElement('a:schemeClr');
                fillScheme.setAttribute('val', 'phClr');
                tint = doc.createElement('a:tint');
                tint.setAttribute('val', '37000');
                fillScheme.appendChild(tint);
                satMod = doc.createElement('a:satMod');
                satMod.setAttribute('val', '300000');
                fillScheme.appendChild(satMod);
                gs.appendChild(fillScheme);
                gsList.appendChild(gs);
                gs = doc.createElement('a:gs');
                gs.setAttribute('pos', '100000');
                fillScheme = doc.createElement('a:schemeClr');
                fillScheme.setAttribute('val', 'phClr');
                tint = doc.createElement('a:tint');
                tint.setAttribute('val', '15000');
                fillScheme.appendChild(tint);
                satMod = doc.createElement('a:satMod');
                satMod.setAttribute('val', '350000');
                fillScheme.appendChild(satMod);
                gs.appendChild(fillScheme);
                gsList.appendChild(gs);
                fillStyle.appendChild(gsList);
                var lin = doc.createElement('a:lin');
                lin.setAttribute('ang', '16200000');
                lin.setAttribute('scaled', '1');
                fillStyle.appendChild(lin);
                fillStyles.appendChild(fillStyle);
                fillStyle = doc.createElement('a:gradFill');
                fillStyle.setAttribute('rotWithShape', '1');
                gsList = doc.createElement('a:gsLst');
                gs = doc.createElement('a:gs');
                gs.setAttribute('pos', '0');
                fillScheme = doc.createElement('a:schemeClr');
                fillScheme.setAttribute('val', 'phClr');
                var shade = doc.createElement('a:shade');
                shade.setAttribute('val', '51000');
                fillScheme.appendChild(shade);
                satMod = doc.createElement('a:satMod');
                satMod.setAttribute('val', '130000');
                fillScheme.appendChild(satMod);
                gs.appendChild(fillScheme);
                gsList.appendChild(gs);
                gs = doc.createElement('a:gs');
                gs.setAttribute('pos', '80000');
                fillScheme = doc.createElement('a:schemeClr');
                fillScheme.setAttribute('val', 'phClr');
                shade = doc.createElement('a:shade');
                shade.setAttribute('val', '93000');
                fillScheme.appendChild(tint);
                satMod = doc.createElement('a:satMod');
                satMod.setAttribute('val', '130000');
                fillScheme.appendChild(satMod);
                gs.appendChild(fillScheme);
                gsList.appendChild(gs);
                gs = doc.createElement('a:gs');
                gs.setAttribute('pos', '100000');
                fillScheme = doc.createElement('a:schemeClr');
                fillScheme.setAttribute('val', 'phClr');
                shade = doc.createElement('a:shade');
                shade.setAttribute('val', '94000');
                fillScheme.appendChild(shade);
                satMod = doc.createElement('a:satMod');
                satMod.setAttribute('val', '135000');
                fillScheme.appendChild(satMod);
                gs.appendChild(fillScheme);
                gsList.appendChild(gs);
                fillStyle.appendChild(gsList);
                lin = doc.createElement('a:lin');
                lin.setAttribute('ang', '16200000');
                lin.setAttribute('scaled', '0');
                fillStyle.appendChild(lin);
                fillStyles.appendChild(fillStyle);
                return fillStyles;
            }
            // Generate lineStyles element for fmtScheme element.
            function generateLineStyles(doc) {
                var lineStyles = doc.createElement('a:lnStyleLst');
                var line = doc.createElement('a:ln');
                line.setAttribute('w', '9525');
                line.setAttribute('cap', 'flat');
                line.setAttribute('cmpd', 'sng');
                line.setAttribute('algn', 'ctr');
                var lineFill = doc.createElement('a:solidFill');
                var lineScheme = doc.createElement('a:schemeClr');
                lineScheme.setAttribute('val', 'phClr');
                var shade = doc.createElement('a:shade');
                shade.setAttribute('val', '95000');
                lineScheme.appendChild(shade);
                var satMod = doc.createElement('a:satMod');
                satMod.setAttribute('val', '105000');
                lineScheme.appendChild(satMod);
                lineFill.appendChild(lineScheme);
                line.appendChild(lineFill);
                var prstDash = doc.createElement('a:prstDash');
                prstDash.setAttribute('val', 'solid');
                line.appendChild(prstDash);
                lineStyles.appendChild(line);
                line = doc.createElement('a:ln');
                line.setAttribute('w', '25400');
                line.setAttribute('cap', 'flat');
                line.setAttribute('cmpd', 'sng');
                line.setAttribute('algn', 'ctr');
                lineFill = doc.createElement('a:solidFill');
                lineScheme = doc.createElement('a:schemeClr');
                lineScheme.setAttribute('val', 'phClr');
                lineFill.appendChild(lineScheme);
                line.appendChild(lineFill);
                prstDash = doc.createElement('a:prstDash');
                prstDash.setAttribute('val', 'solid');
                line.appendChild(prstDash);
                lineStyles.appendChild(line);
                line = doc.createElement('a:ln');
                line.setAttribute('w', '38100');
                line.setAttribute('cap', 'flat');
                line.setAttribute('cmpd', 'sng');
                line.setAttribute('algn', 'ctr');
                lineFill = doc.createElement('a:solidFill');
                lineScheme = doc.createElement('a:schemeClr');
                lineScheme.setAttribute('val', 'phClr');
                lineFill.appendChild(lineScheme);
                line.appendChild(lineFill);
                prstDash = doc.createElement('a:prstDash');
                prstDash.setAttribute('val', 'solid');
                line.appendChild(prstDash);
                lineStyles.appendChild(line);
                return lineStyles;
            }
            // Generate effectStyles element for fmtScheme element.
            function generateEffectScheme(doc) {
                var effectStyles = doc.createElement('a:effectStyleLst');
                var effectStyle = doc.createElement('a:effectStyle');
                var effectList = doc.createElement('a:effectLst');
                var outShadow = doc.createElement('a:outerShdw');
                outShadow.setAttribute('blurRad', '40000');
                outShadow.setAttribute('dist', '23000');
                outShadow.setAttribute('dir', '5400000');
                outShadow.setAttribute('rotWithShape', '0');
                var srgbClr = doc.createElement('a:srgbClr');
                srgbClr.setAttribute('val', '000000');
                var alpha = doc.createElement('a:alpha');
                alpha.setAttribute('val', '38000');
                srgbClr.appendChild(alpha);
                outShadow.appendChild(srgbClr);
                effectList.appendChild(outShadow);
                effectStyle.appendChild(effectList);
                effectStyles.appendChild(effectStyle);
                effectStyle = doc.createElement('a:effectStyle');
                effectList = doc.createElement('a:effectLst');
                outShadow = doc.createElement('a:outerShdw');
                outShadow.setAttribute('blurRad', '40000');
                outShadow.setAttribute('dist', '23000');
                outShadow.setAttribute('dir', '5400000');
                outShadow.setAttribute('rotWithShape', '0');
                srgbClr = doc.createElement('a:srgbClr');
                srgbClr.setAttribute('val', '000000');
                alpha = doc.createElement('a:alpha');
                alpha.setAttribute('val', '35000');
                srgbClr.appendChild(alpha);
                outShadow.appendChild(srgbClr);
                effectList.appendChild(outShadow);
                effectStyle.appendChild(effectList);
                effectStyles.appendChild(effectStyle);
                effectList.appendChild(outShadow);
                effectStyle.appendChild(effectList);
                effectStyles.appendChild(effectStyle);
                effectStyle = doc.createElement('a:effectStyle');
                effectList = doc.createElement('a:effectLst');
                outShadow = doc.createElement('a:outerShdw');
                outShadow.setAttribute('blurRad', '40000');
                outShadow.setAttribute('dist', '23000');
                outShadow.setAttribute('dir', '5400000');
                outShadow.setAttribute('rotWithShape', '0');
                srgbClr = doc.createElement('a:srgbClr');
                srgbClr.setAttribute('val', '000000');
                alpha = doc.createElement('a:alpha');
                alpha.setAttribute('val', '35000');
                srgbClr.appendChild(alpha);
                outShadow.appendChild(srgbClr);
                effectList.appendChild(outShadow);
                effectStyle.appendChild(effectList);
                var scene3d = doc.createElement('a:scene3d');
                var camera = doc.createElement('a:camera');
                camera.setAttribute('prst', 'orthographicFront');
                var rot = doc.createElement('a:rot');
                rot.setAttribute('lat', '0');
                rot.setAttribute('lon', '0');
                rot.setAttribute('rev', '0');
                camera.appendChild(rot);
                scene3d.appendChild(camera);
                var lightRig = doc.createElement('a:lightRig');
                lightRig.setAttribute('rig', 'threePt');
                lightRig.setAttribute('dir', 't');
                rot = doc.createElement('a:rot');
                rot.setAttribute('lat', '0');
                rot.setAttribute('lon', '0');
                rot.setAttribute('rev', '1200000');
                lightRig.appendChild(rot);
                scene3d.appendChild(lightRig);
                effectStyle.appendChild(scene3d);
                var sp3d = doc.createElement('a:sp3d');
                var bevelT = doc.createElement('a:bevelT');
                bevelT.setAttribute('w', '63500');
                bevelT.setAttribute('h', '25400');
                sp3d.appendChild(bevelT);
                effectStyle.appendChild(sp3d);
                effectStyles.appendChild(effectStyle);
                return effectStyles;
            }
            // Generate bgFillStyles element for fmtScheme element.
            function generateBgFillScheme(doc) {
                var bgFillStyles = doc.createElement('a:bgFillStyleLst');
                var fillStyle = doc.createElement('a:solidFill');
                var fillScheme = doc.createElement('a:schemeClr');
                fillScheme.setAttribute('val', 'phClr');
                fillStyle.appendChild(fillScheme);
                bgFillStyles.appendChild(fillStyle);
                fillStyle = doc.createElement('a:gradFill');
                fillStyle.setAttribute('rotWithShape', '1');
                var gsList = doc.createElement('a:gsLst');
                var gs = doc.createElement('a:gs');
                gs.setAttribute('pos', '0');
                fillScheme = doc.createElement('a:schemeClr');
                fillScheme.setAttribute('val', 'phClr');
                var tint = doc.createElement('a:tint');
                tint.setAttribute('val', '40000');
                fillScheme.appendChild(tint);
                var satMod = doc.createElement('a:satMod');
                satMod.setAttribute('val', '350000');
                fillScheme.appendChild(satMod);
                gs.appendChild(fillScheme);
                gsList.appendChild(gs);
                gs = doc.createElement('a:gs');
                gs.setAttribute('pos', '40000');
                fillScheme = doc.createElement('a:schemeClr');
                fillScheme.setAttribute('val', 'phClr');
                tint = doc.createElement('a:tint');
                tint.setAttribute('val', '45000');
                fillScheme.appendChild(tint);
                var shade = doc.createElement('a:shade');
                shade.setAttribute('val', '99000');
                fillScheme.appendChild(shade);
                satMod = doc.createElement('a:satMod');
                satMod.setAttribute('val', '350000');
                fillScheme.appendChild(satMod);
                gs.appendChild(fillScheme);
                gsList.appendChild(gs);
                gs = doc.createElement('a:gs');
                gs.setAttribute('pos', '100000');
                fillScheme = doc.createElement('a:schemeClr');
                fillScheme.setAttribute('val', 'phClr');
                tint = doc.createElement('a:tint');
                tint.setAttribute('val', '20000');
                fillScheme.appendChild(tint);
                satMod = doc.createElement('a:satMod');
                satMod.setAttribute('val', '255000');
                fillScheme.appendChild(satMod);
                gs.appendChild(fillScheme);
                gsList.appendChild(gs);
                fillStyle.appendChild(gsList);
                var path = doc.createElement('a:path');
                path.setAttribute('path', 'circle');
                var fillToRect = doc.createElement('a:fillToRect');
                fillToRect.setAttribute('b', '180000');
                fillToRect.setAttribute('r', '50000');
                fillToRect.setAttribute('t', '-80000');
                fillToRect.setAttribute('l', '50000');
                path.appendChild(fillToRect);
                fillStyle.appendChild(path);
                bgFillStyles.appendChild(fillStyle);
                fillStyle = doc.createElement('a:gradFill');
                fillStyle.setAttribute('rotWithShape', '1');
                gsList = doc.createElement('a:gsLst');
                gs = doc.createElement('a:gs');
                gs.setAttribute('pos', '0');
                fillScheme = doc.createElement('a:schemeClr');
                fillScheme.setAttribute('val', 'phClr');
                tint = doc.createElement('a:tint');
                tint.setAttribute('val', '80000');
                fillScheme.appendChild(tint);
                satMod = doc.createElement('a:satMod');
                satMod.setAttribute('val', '300000');
                fillScheme.appendChild(satMod);
                gs.appendChild(fillScheme);
                gsList.appendChild(gs);
                gs = doc.createElement('a:gs');
                gs.setAttribute('pos', '100000');
                fillScheme = doc.createElement('a:schemeClr');
                fillScheme.setAttribute('val', 'phClr');
                shade = doc.createElement('a:shade');
                shade.setAttribute('val', '30000');
                fillScheme.appendChild(tint);
                satMod = doc.createElement('a:satMod');
                satMod.setAttribute('val', '200000');
                fillScheme.appendChild(satMod);
                gs.appendChild(fillScheme);
                gsList.appendChild(gs);
                fillStyle.appendChild(gsList);
                path = doc.createElement('a:path');
                path.setAttribute('path', 'circle');
                fillToRect = doc.createElement('a:fillToRect');
                fillToRect.setAttribute('b', '50000');
                fillToRect.setAttribute('r', '50000');
                fillToRect.setAttribute('t', '50000');
                fillToRect.setAttribute('l', '50000');
                path.appendChild(fillToRect);
                fillStyle.appendChild(path);
                bgFillStyles.appendChild(fillStyle);
                return bgFillStyles;
            }
            // Generate core doc.
            function generateCoreDoc() {
                var doc = document.implementation.createDocument('', '', null);
                var coreProperties = doc.createElement('cp:coreProperties');
                coreProperties.setAttribute('xmlns:cp', 'http://schemas.openxmlformats.org/package/2006/metadata/core-properties');
                coreProperties.setAttribute('xmlns:dc', 'http://purl.org/dc/elements/1.1/');
                coreProperties.setAttribute('xmlns:dcterms', 'http://purl.org/dc/terms/');
                coreProperties.setAttribute('xmlns:dcmitype', 'http://purl.org/dc/dcmitype/');
                coreProperties.setAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
                var creator = doc.createElement('dc:creator');
                if (!!file.creator) {
                    creator.textContent = file.creator;
                }
                coreProperties.appendChild(creator);
                var lastModifiedBy = doc.createElement('cp:lastModifiedBy');
                if (!!file.lastModifiedBy) {
                    lastModifiedBy.textContent = file.lastModifiedBy;
                }
                coreProperties.appendChild(lastModifiedBy);
                var created = doc.createElement('dcterms:created');
                created.setAttribute('xsi:type', 'dcterms:W3CDTF');
                created.textContent = (file.created || new Date()).toISOString();
                coreProperties.appendChild(created);
                var modified = doc.createElement('dcterms:modified');
                modified.setAttribute('xsi:type', 'dcterms:W3CDTF');
                modified.textContent = (file.modified || new Date()).toISOString();
                coreProperties.appendChild(modified);
                doc.appendChild(coreProperties);
                return doc;
            }
            // Generate sheet global settings.
            function generateSheetGlobalSetting(sheetDoc, worksheet) {
                var l = worksheet.rows && worksheet.rows[0] && worksheet.rows[0].cells ? worksheet.rows[0].cells.length : 0;
                sheetDoc.documentElement.setAttribute('xmlns:r', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships');
                sheetDoc.documentElement.setAttribute('xmlns:mc', 'http://schemas.openxmlformats.org/markup-compatibility/2006');
                sheetDoc.documentElement.setAttribute('mc:Ignorable', 'x14ac');
                sheetDoc.documentElement.setAttribute('xmlns:x14ac', 'http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac');
                var sheetPr = sheetDoc.createElementNS(workbookNS, 'sheetPr');
                var outlinePr = sheetDoc.createElementNS(workbookNS, 'outlinePr');
                outlinePr.setAttribute('summaryBelow', '0');
                sheetPr.appendChild(outlinePr);
                sheetDoc.documentElement.appendChild(sheetPr);
                var dimension = sheetDoc.createElementNS(workbookNS, 'dimension');
                dimension.setAttribute('ref', 'A1' + (l > 0 ? ':' + numAlpha(l - 1) + (worksheet.rows.length) : ''));
                sheetDoc.documentElement.appendChild(dimension);
                var sheetViews = sheetDoc.createElementNS(workbookNS, 'sheetViews');
                var sheetView = sheetDoc.createElementNS(workbookNS, 'sheetView');
                sheetView.setAttribute('workbookViewId', '0');
                sheetView.setAttribute('tabSelected', '1');
                if (worksheet.frozenPane && (worksheet.frozenPane.rows !== 0 || worksheet.frozenPane.columns !== 0)) {
                    var frozenPane = sheetDoc.createElementNS(workbookNS, 'pane');
                    frozenPane.setAttribute('state', 'frozen');
                    frozenPane.setAttribute('activePane', worksheet.frozenPane.rows !== 0 && worksheet.frozenPane.columns !== 0 ? 'bottomRight' : (worksheet.frozenPane.rows !== 0 ? 'bottomLeft' : 'topRight'));
                    frozenPane.setAttribute('topLeftCell', numAlpha(worksheet.frozenPane.columns) + (worksheet.frozenPane.rows + 1));
                    frozenPane.setAttribute('ySplit', worksheet.frozenPane.rows.toString());
                    frozenPane.setAttribute('xSplit', worksheet.frozenPane.columns.toString());
                    sheetView.appendChild(frozenPane);
                }
                sheetViews.appendChild(sheetView);
                sheetDoc.documentElement.appendChild(sheetViews);
                var sheetFormatPr = sheetDoc.createElementNS(workbookNS, 'sheetFormatPr');
                sheetFormatPr.setAttribute('defaultRowHeight', '15');
                sheetFormatPr.setAttribute('x14ac:dyDescent', '0.25');
                sheetDoc.documentElement.appendChild(sheetFormatPr);
            }
            // Generate cell element.
            function generateCell(sheetDoc, rowIndex, colIndex, styleIndex, type, val, formula) {
                var cell = sheetDoc.createElementNS(workbookNS, 'c');
                cell.setAttribute('r', numAlpha(colIndex) + (rowIndex + 1));
                cell.setAttribute('s', styleIndex.toString());
                if (!!type) {
                    cell.setAttribute('t', type);
                }
                if (!!formula) {
                    var f = sheetDoc.createElementNS(workbookNS, 'f');
                    f.setAttribute('ca', '1');
                    f.textContent = formula;
                    cell.appendChild(f);
                }
                if (val != null) {
                    var v = sheetDoc.createElementNS(workbookNS, 'v');
                    v.textContent = val;
                    cell.appendChild(v);
                }
                return cell;
            }
            // Generate merge cell setting.
            function generateMergeSetting(sheetDoc, merges) {
                var mergeCells = sheetDoc.createElementNS(workbookNS, 'mergeCells');
                mergeCells.setAttribute('count', merges.length.toString());
                for (var i = 0; i < merges.length; i++) {
                    var mergeCell = sheetDoc.createElementNS(workbookNS, 'mergeCell');
                    mergeCell.setAttribute('ref', merges[i].join(':'));
                    mergeCells.appendChild(mergeCell);
                }
                return mergeCells;
            }
            // Generate style doc
            function generateStyleDoc() {
                var x14acNS = 'http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac';
                var doc = document.implementation.createDocument(workbookNS, 'styleSheet', null);
                doc.documentElement.setAttribute('xmlns:mc', 'http://schemas.openxmlformats.org/markup-compatibility/2006');
                doc.documentElement.setAttribute('mc:Ignorable', 'x14ac');
                doc.documentElement.setAttribute('xmlns:x14ac', x14acNS);
                var i = 0;
                var newFormatIndex = 0;
                var numFmtsEle = doc.createElementNS(workbookNS, 'numFmts');
                var fontsEle = doc.createElementNS(workbookNS, 'fonts');
                fontsEle.setAttribute('x14ac:knownFonts', '1');
                fontsEle.appendChild(generateFontStyle(doc, {}, true));
                var fillsEle = doc.createElementNS(workbookNS, 'fills');
                fillsEle.appendChild(generateFillStyle(doc, 'none', null));
                fillsEle.appendChild(generateFillStyle(doc, 'gray125', null));
                var bordersEle = doc.createElementNS(workbookNS, 'borders');
                bordersEle.appendChild(generateBorderStyle(doc, {}));
                var cellXfsEle = doc.createElementNS(workbookNS, 'cellXfs');
                cellXfsEle.appendChild(generateCellXfs(doc, 0, 0, 0, 0, {}));
                while (i < styles.length) {
                    var style = styles[i];
                    if (!!style) {
                        style = JSON.parse(style);
                        // cell formatting, refer to it if necessary
                        var formatIndex = 0;
                        if (style.format && style.format !== 'General') {
                            formatIndex = numFmts.indexOf(style.format);
                            if (formatIndex < 0) {
                                formatIndex = 164 + newFormatIndex;
                                var numFmt = doc.createElementNS(workbookNS, 'numFmt');
                                numFmt.setAttribute('formatCode', style.format);
                                numFmt.setAttribute('numFmtId', formatIndex.toString());
                                numFmtsEle.appendChild(numFmt);
                                newFormatIndex++;
                            }
                        }
                        // border declaration: add a new declaration and refer to it in style
                        var borderIndex = 0;
                        if (style.borders) {
                            // try to reuse existing border
                            var border = JSON.stringify(style.borders);
                            borderIndex = borders.indexOf(border);
                            if (borderIndex < 0) {
                                borderIndex = borders.push(border) - 1;
                                bordersEle.appendChild(generateBorderStyle(doc, style.borders));
                            }
                        }
                        // font declaration: add a new declaration and refer to it in style
                        var fontIndex = 0;
                        if (style.font) {
                            var font = JSON.stringify(style.font);
                            // try to reuse existing font
                            fontIndex = fonts.indexOf(font);
                            if (fontIndex < 0) {
                                fontIndex = fonts.push(font) - 1;
                                fontsEle.appendChild(generateFontStyle(doc, style.font));
                            }
                        }
                        // Add fill color property
                        var fillIndex = 0;
                        if (style.fill && style.fill.color) {
                            var fill = JSON.stringify(style.fill);
                            ;
                            fillIndex = fills.indexOf(fill);
                            if (fillIndex < 0) {
                                fillIndex = fills.push(fill) - 1;
                                fillsEle.appendChild(generateFillStyle(doc, 'solid', style.fill.color));
                            }
                        }
                        cellXfsEle.appendChild(generateCellXfs(doc, formatIndex, borderIndex, fontIndex, fillIndex, style));
                    }
                    i++;
                }
                numFmtsEle.setAttribute('count', numFmtsEle.childElementCount.toString());
                doc.documentElement.appendChild(numFmtsEle);
                fontsEle.setAttribute('count', fontsEle.childElementCount.toString());
                doc.documentElement.appendChild(fontsEle);
                fillsEle.setAttribute('count', fillsEle.childElementCount.toString());
                doc.documentElement.appendChild(fillsEle);
                bordersEle.setAttribute('count', bordersEle.childElementCount.toString());
                doc.documentElement.appendChild(bordersEle);
                var cellStyleXfsEle = doc.createElementNS(workbookNS, 'cellStyleXfs');
                var xf = doc.createElementNS(workbookNS, 'xf');
                xf.setAttribute('numFmtId', '0');
                xf.setAttribute('borderId', '0');
                xf.setAttribute('fillId', '0');
                xf.setAttribute('fontId', '0');
                cellStyleXfsEle.appendChild(xf);
                cellStyleXfsEle.setAttribute('count', '1');
                doc.documentElement.appendChild(cellStyleXfsEle);
                cellXfsEle.setAttribute('count', cellXfsEle.childElementCount.toString());
                doc.documentElement.appendChild(cellXfsEle);
                var cellStylesEle = doc.createElementNS(workbookNS, 'cellStyles');
                var cellStyle = doc.createElementNS(workbookNS, 'cellStyle');
                cellStyle.setAttribute('name', 'Normal');
                cellStyle.setAttribute('xfId', '0');
                cellStyle.setAttribute('builtinId', '0');
                cellStylesEle.appendChild(cellStyle);
                cellStylesEle.setAttribute('count', '1');
                doc.documentElement.appendChild(cellStylesEle);
                var dxfsEle = doc.createElementNS(workbookNS, 'dxfs');
                dxfsEle.setAttribute('count', '0');
                doc.documentElement.appendChild(dxfsEle);
                var tableStylesEle = doc.createElementNS(workbookNS, 'tableStyles');
                tableStylesEle.setAttribute('count', '0');
                tableStylesEle.setAttribute('defaultTableStyle', 'TableStyleMedium2');
                tableStylesEle.setAttribute('defaultPivotStyle', 'PivotStyleLight16');
                doc.documentElement.appendChild(tableStylesEle);
                var extLstEle = doc.createElementNS(workbookNS, 'extLst');
                var ext = doc.createElementNS(workbookNS, 'ext');
                ext.setAttribute('uri', '{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}');
                var slicerStyles = doc.createElementNS(x14acNS, 'x14:slicerStyles');
                slicerStyles.setAttribute('defaultSlicerStyle', 'SlicerStyleLight1');
                ext.appendChild(slicerStyles);
                extLstEle.appendChild(ext);
                doc.documentElement.appendChild(extLstEle);
                return doc;
            }
            // Generate border style element.
            function generateBorderStyle(doc, borders) {
                var border = doc.createElementNS(workbookNS, 'border');
                for (var edge in { left: 0, right: 0, top: 0, bottom: 0, diagonal: 0 }) {
                    var edgeEle = doc.createElementNS(workbookNS, edge);
                    if (borders[edge]) {
                        var color = borders[edge].color;
                        color = color ? (color[0] === '#' ? color.substring(1) : color) : '';
                        // add transparency if missing
                        if (color.length === 6) {
                            color = 'FF' + color;
                        }
                        if (!color) {
                            color = 'FF000000';
                        }
                        edgeEle.setAttribute('style', borders[edge].style);
                        var colorEle = doc.createElementNS(workbookNS, 'color');
                        colorEle.setAttribute('rgb', color);
                        edgeEle.appendChild(colorEle);
                    }
                    border.appendChild(edgeEle);
                }
                return border;
            }
            // Generate font style element.
            function generateFontStyle(doc, fontStyle, needScheme) {
                if (needScheme === void 0) { needScheme = false; }
                var font = doc.createElementNS(workbookNS, 'font');
                if (fontStyle.bold) {
                    var b = doc.createElementNS(workbookNS, 'b');
                    font.appendChild(b);
                }
                if (fontStyle.italic) {
                    var b = doc.createElementNS(workbookNS, 'i');
                    font.appendChild(b);
                }
                if (fontStyle.underline) {
                    var b = doc.createElementNS(workbookNS, 'u');
                    font.appendChild(b);
                }
                var sz = doc.createElementNS(workbookNS, 'sz');
                var value = Math.round(fontStyle.size * 72 / 96) || defaultFontSize;
                sz.setAttribute('val', value.toString());
                font.appendChild(sz);
                var color = doc.createElementNS(workbookNS, 'color');
                if (!!fontStyle.color) {
                    color.setAttribute('rgb', 'FF' + (fontStyle.color[0] === '#' ? fontStyle.color.substring(1) : fontStyle.color));
                }
                else {
                    color.setAttribute('theme', '1');
                }
                font.appendChild(color);
                var name = doc.createElementNS(workbookNS, 'name');
                name.setAttribute('val', fontStyle.family || defaultFontName);
                font.appendChild(name);
                var family = doc.createElementNS(workbookNS, 'family');
                family.setAttribute('val', '2');
                font.appendChild(family);
                if (needScheme) {
                    var scheme = doc.createElementNS(workbookNS, 'scheme');
                    scheme.setAttribute('val', 'minor');
                    font.appendChild(scheme);
                }
                return font;
            }
            // Generate fill style element
            function generateFillStyle(doc, patternType, fillColor) {
                var fillEle = doc.createElementNS(workbookNS, 'fill');
                var patternFill = doc.createElementNS(workbookNS, 'patternFill');
                patternFill.setAttribute('patternType', patternType);
                if (!!fillColor) {
                    var fgColor = doc.createElementNS(workbookNS, 'fgColor');
                    fgColor.setAttribute('rgb', 'FF' + (fillColor[0] === '#' ? fillColor.substring(1) : fillColor));
                    patternFill.appendChild(fgColor);
                    var bgColor = doc.createElementNS(workbookNS, 'bgColor');
                    bgColor.setAttribute('indexed', '64');
                    patternFill.appendChild(bgColor);
                }
                fillEle.appendChild(patternFill);
                return fillEle;
            }
            // Generate xf element
            function generateCellXfs(doc, numFmtId, borderId, fontId, fillId, style) {
                var cellXf = doc.createElementNS(workbookNS, 'xf');
                cellXf.setAttribute('xfId', '0');
                cellXf.setAttribute('numFmtId', numFmtId.toString());
                if (numFmtId > 0) {
                    cellXf.setAttribute('applyNumberFormat', '1');
                }
                cellXf.setAttribute('borderId', borderId.toString());
                if (borderId > 0) {
                    cellXf.setAttribute('applyBorder', '1');
                }
                cellXf.setAttribute('fontId', fontId.toString());
                if (fontId > 0) {
                    cellXf.setAttribute('applyFont', '1');
                }
                cellXf.setAttribute('fillId', fillId.toString());
                if (fillId > 0) {
                    cellXf.setAttribute('applyFill', '1');
                }
                if (style.hAlign || style.vAlign || style.indent) {
                    var alignment = doc.createElementNS(workbookNS, 'alignment');
                    if (style.hAlign) {
                        alignment.setAttribute('horizontal', style.hAlign);
                    }
                    if (style.vAlign) {
                        alignment.setAttribute('vertical', style.vAlign);
                    }
                    if (style.indent) {
                        alignment.setAttribute('indent', style.indent);
                    }
                    cellXf.setAttribute('applyAlignment', '1');
                    cellXf.appendChild(alignment);
                }
                return cellXf;
            }
            // Generate content types doc
            function generateContentTypesDoc() {
                var doc = document.implementation.createDocument(contentTypesNS, 'Types', null);
                var defaultEle;
                if (macroEnabled) {
                    defaultEle = doc.createElementNS(contentTypesNS, 'Default');
                    defaultEle.setAttribute('Extension', 'bin');
                    defaultEle.setAttribute('ContentType', 'application/vnd.ms-office.vbaProject');
                    doc.documentElement.appendChild(defaultEle);
                }
                defaultEle = doc.createElementNS(contentTypesNS, 'Default');
                defaultEle.setAttribute('Extension', 'rels');
                defaultEle.setAttribute('ContentType', 'application/vnd.openxmlformats-package.relationships+xml');
                doc.documentElement.appendChild(defaultEle);
                defaultEle = doc.createElementNS(contentTypesNS, 'Default');
                defaultEle.setAttribute('Extension', 'xml');
                defaultEle.setAttribute('ContentType', 'application/xml');
                doc.documentElement.appendChild(defaultEle);
                var overrideEle = doc.createElementNS(contentTypesNS, 'Override');
                overrideEle.setAttribute('PartName', '/xl/workbook.xml');
                overrideEle.setAttribute('ContentType', macroEnabled ? 'application/vnd.ms-excel.sheet.macroEnabled.main+xml' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml');
                doc.documentElement.appendChild(overrideEle);
                for (var i = 0; i < contentTypes.length; i++) {
                    doc.documentElement.appendChild(contentTypes[i]);
                }
                overrideEle = doc.createElementNS(contentTypesNS, 'Override');
                overrideEle.setAttribute('PartName', '/xl/theme/theme1.xml');
                overrideEle.setAttribute('ContentType', 'application/vnd.openxmlformats-officedocument.theme+xml');
                doc.documentElement.appendChild(overrideEle);
                overrideEle = doc.createElementNS(contentTypesNS, 'Override');
                overrideEle.setAttribute('PartName', '/xl/styles.xml');
                overrideEle.setAttribute('ContentType', 'application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml');
                doc.documentElement.appendChild(overrideEle);
                overrideEle = doc.createElementNS(contentTypesNS, 'Override');
                overrideEle.setAttribute('PartName', '/xl/sharedStrings.xml');
                overrideEle.setAttribute('ContentType', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml');
                doc.documentElement.appendChild(overrideEle);
                overrideEle = doc.createElementNS(contentTypesNS, 'Override');
                overrideEle.setAttribute('PartName', '/docProps/core.xml');
                overrideEle.setAttribute('ContentType', 'application/vnd.openxmlformats-package.core-properties+xml');
                doc.documentElement.appendChild(overrideEle);
                overrideEle = doc.createElementNS(contentTypesNS, 'Override');
                overrideEle.setAttribute('PartName', '/docProps/app.xml');
                overrideEle.setAttribute('ContentType', 'application/vnd.openxmlformats-officedocument.extended-properties+xml');
                doc.documentElement.appendChild(overrideEle);
                return doc;
            }
            // Generate app doc
            function generateAppDoc() {
                var ns = 'http://schemas.openxmlformats.org/officeDocument/2006/extended-properties';
                var vtNS = 'http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes';
                var doc = document.implementation.createDocument(ns, 'Properties', null);
                var app = doc.createElementNS(ns, 'Application');
                app.textContent = file.application || 'wijmo.xlsx';
                doc.documentElement.appendChild(app);
                var docSecurity = doc.createElementNS(ns, 'DocSecurity');
                docSecurity.textContent = '0';
                doc.documentElement.appendChild(docSecurity);
                var scaleCrop = doc.createElementNS(ns, 'ScaleCrop');
                scaleCrop.textContent = 'false';
                doc.documentElement.appendChild(scaleCrop);
                var headingPairs = doc.createElementNS(ns, 'HeadingPairs');
                var vector = doc.createElementNS(vtNS, 'vt:vector');
                vector.setAttribute('size', '2');
                vector.setAttribute('baseType', 'variant');
                var variant = doc.createElementNS(vtNS, 'vt:variant');
                var lpstr = doc.createElementNS(vtNS, 'vt:lpstr');
                lpstr.textContent = 'Worksheets';
                variant.appendChild(lpstr);
                vector.appendChild(variant);
                variant = doc.createElementNS(vtNS, 'vt:variant');
                var i4 = doc.createElementNS(vtNS, 'vt:i4');
                i4.textContent = file.sheets.length;
                variant.appendChild(i4);
                vector.appendChild(variant);
                headingPairs.appendChild(vector);
                doc.documentElement.appendChild(headingPairs);
                var titlesOfParts = doc.createElementNS(ns, 'TitlesOfParts');
                vector = doc.createElementNS(vtNS, 'vt:vector');
                vector.setAttribute('size', props.length.toString());
                vector.setAttribute('baseType', 'lpstr');
                for (var i = 0; i < props.length; i++) {
                    lpstr = doc.createElementNS(vtNS, 'vt:lpstr');
                    lpstr.textContent = props[i];
                    vector.appendChild(lpstr);
                }
                titlesOfParts.appendChild(vector);
                doc.documentElement.appendChild(titlesOfParts);
                var manager = doc.createElementNS(ns, 'Manager');
                doc.documentElement.appendChild(manager);
                var company = doc.createElementNS(ns, 'Company');
                company.textContent = file.company || 'GrapeCity, Inc.';
                doc.documentElement.appendChild(company);
                var linksUpToDate = doc.createElementNS(ns, 'LinksUpToDate');
                linksUpToDate.textContent = 'false';
                doc.documentElement.appendChild(linksUpToDate);
                var sharedDoc = doc.createElementNS(ns, 'SharedDoc');
                sharedDoc.textContent = 'false';
                doc.documentElement.appendChild(sharedDoc);
                var hyperlinksChanged = doc.createElementNS(ns, 'HyperlinksChanged');
                hyperlinksChanged.textContent = 'false';
                doc.documentElement.appendChild(hyperlinksChanged);
                var appVersion = doc.createElementNS(ns, 'AppVersion');
                appVersion.textContent = '1.0';
                doc.documentElement.appendChild(appVersion);
                return doc;
            }
            // Generate workbook relationships doc
            function generateWorkbookRels() {
                var doc = document.implementation.createDocument(relationshipsNS, 'Relationships', null);
                for (var i = 0; i < xlRels.length; i++) {
                    doc.documentElement.appendChild(xlRels[i]);
                }
                var relationship = doc.createElementNS(relationshipsNS, 'Relationship');
                relationship.setAttribute('Id', 'rId' + (xlRels.length + 1));
                relationship.setAttribute('Type', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings');
                relationship.setAttribute('Target', 'sharedStrings.xml');
                doc.documentElement.appendChild(relationship);
                relationship = doc.createElementNS(relationshipsNS, 'Relationship');
                relationship.setAttribute('Id', 'rId' + (xlRels.length + 2));
                relationship.setAttribute('Type', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles');
                relationship.setAttribute('Target', 'styles.xml');
                doc.documentElement.appendChild(relationship);
                relationship = doc.createElementNS(relationshipsNS, 'Relationship');
                relationship.setAttribute('Id', 'rId' + (xlRels.length + 3));
                relationship.setAttribute('Type', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme');
                relationship.setAttribute('Target', 'theme/theme1.xml');
                doc.documentElement.appendChild(relationship);
                if (macroEnabled) {
                    relationship = doc.createElementNS(relationshipsNS, 'Relationship');
                    relationship.setAttribute('Id', 'rId' + (xlRels.length + 4));
                    relationship.setAttribute('Type', 'http://schemas.microsoft.com/office/2006/relationships/vbaProject');
                    relationship.setAttribute('Target', 'vbaProject.bin');
                    doc.documentElement.appendChild(relationship);
                }
                return doc;
            }
            // Generate workbook doc
            function generateWorkbook() {
                var doc = document.implementation.createDocument(workbookNS, 'workbook', null);
                doc.documentElement.setAttribute('xmlns:r', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships');
                var fileVersion = doc.createElementNS(workbookNS, 'fileVersion');
                fileVersion.setAttribute('appName', 'xl');
                fileVersion.setAttribute('lastEdited', '5');
                fileVersion.setAttribute('lowestEdited', '5');
                fileVersion.setAttribute('rupBuild', '9303');
                doc.documentElement.appendChild(fileVersion);
                var workbookPr = doc.createElementNS(workbookNS, 'workbookPr');
                workbookPr.setAttribute('defaultThemeVersion', '124226');
                doc.documentElement.appendChild(workbookPr);
                var bookViews = doc.createElementNS(workbookNS, 'bookViews');
                var bookView = doc.createElementNS(workbookNS, 'workbookView');
                bookView.setAttribute('activeTab', file.activeWorksheet != null ? file.activeWorksheet.toString() : '0');
                bookView.setAttribute('xWindow', '480');
                bookView.setAttribute('yWindow', '60');
                bookView.setAttribute('windowWidth', '18195');
                bookView.setAttribute('windowHeight', '8505');
                bookViews.appendChild(bookView);
                doc.documentElement.appendChild(bookViews);
                var sheets = doc.createElementNS(workbookNS, 'sheets');
                for (var i = 0; i < worksheets.length; i++) {
                    sheets.appendChild(worksheets[i]);
                }
                doc.documentElement.appendChild(sheets);
                var calcPr = doc.createElementNS(workbookNS, 'calcPr');
                calcPr.setAttribute('fullCalcOnLoad', '1');
                doc.documentElement.appendChild(calcPr);
                '</sheets><calcPr fullCalcOnLoad="1"/></workbook>';
                return doc;
            }
            // Generate shared strings doc.
            function generateSharedStringsDoc() {
                var doc = document.implementation.createDocument(workbookNS, 'sst', null);
                doc.documentElement.setAttribute('count', sharedStrings[1]);
                doc.documentElement.setAttribute('uniqueCount', sharedStrings[0].length);
                for (var i = 0; i < sharedStrings[0].length; i++) {
                    var sharedInfo = doc.createElementNS(workbookNS, 'si');
                    var content = doc.createElementNS(workbookNS, 't');
                    content.textContent = sharedStrings[0][i];
                    sharedInfo.appendChild(content);
                    doc.documentElement.appendChild(sharedInfo);
                }
                return doc;
            }
            if (typeof file === 'string') {
                zipTime = Date.now();
                domParser = new DOMParser();
                zip = zip.load(file, { base64: true });
                result = { sheets: [], zipTime: Date.now() - zipTime };
                processTime = Date.now();
                sharedStrings = [];
                styles = [];
                // GrapeCity Begin: initialize the fonts, fills and themes array for importing.
                fonts = [];
                fills = [];
                colorThemes = [];
                // GrapeCity End
                if (s = zip.file('xl/sharedStrings.xml')) {
                    s = domParser.parseFromString(s.asText(), 'application/xml').querySelectorAll('sst>si');
                    i = s.length - 1;
                    while (i >= 0) {
                        j = 0;
                        content = s[i].querySelectorAll('t');
                        sharedStrings[i] = '';
                        while (j < content.length) {
                            sharedStrings[i] += content[j].textContent;
                            j++;
                        }
                        i--;
                    }
                }
                if (s = zip.file('docProps/core.xml')) {
                    s = domParser.parseFromString(s.asText(), 'application/xml');
                    result.creator = s.querySelector('creator') ? s.querySelector('creator').textContent : '';
                    result.lastModifiedBy = s.querySelector('lastModifiedBy') ? s.querySelector('lastModifiedBy').textContent : '';
                    result.created = s.querySelector('created') ? new Date(s.querySelector('created').textContent) : null;
                    result.modified = s.querySelector('modified') ? new Date(s.querySelector('modified').textContent) : null;
                }
                if (s = zip.file('xl/workbook.xml')) {
                    s = domParser.parseFromString(s.asText(), 'application/xml');
                    index = s.querySelector('workbookView') ? s.querySelector('workbookView').getAttribute('activeTab') : null;
                    if (index != null) {
                        result.activeWorksheet = +index;
                    }
                    else {
                        result.activeWorksheet = 0;
                    }
                    s = s.querySelectorAll('sheets>sheet');
                    i = s.length - 1;
                    while (i >= 0) {
                        id = s[i].getAttribute('name');
                        worksheetVisible = s[i].getAttribute('state') !== 'hidden';
                        result.sheets.unshift({ name: id, visible: worksheetVisible, cols: [], columns: [], rows: [] });
                        i--;
                    }
                }
                // GrapeCity Begin: Add processing for getting theme color.
                if (s = zip.file('xl/theme/theme1.xml')) {
                    s = domParser.parseFromString(s.asText(), 'application/xml');
                    colorThemes[0] = s.querySelector('themeElements>clrScheme>lt1>sysClr').getAttribute('lastClr');
                    colorThemes[1] = s.querySelector('themeElements>clrScheme>dk1>sysClr').getAttribute('lastClr');
                    colorThemes[2] = s.querySelector('themeElements>clrScheme>lt2>srgbClr').getAttribute('val');
                    colorThemes[3] = s.querySelector('themeElements>clrScheme>dk2>srgbClr').getAttribute('val');
                    colorThemes[4] = s.querySelector('themeElements>clrScheme>accent1>srgbClr').getAttribute('val');
                    colorThemes[5] = s.querySelector('themeElements>clrScheme>accent2>srgbClr').getAttribute('val');
                    colorThemes[6] = s.querySelector('themeElements>clrScheme>accent3>srgbClr').getAttribute('val');
                    colorThemes[7] = s.querySelector('themeElements>clrScheme>accent4>srgbClr').getAttribute('val');
                    colorThemes[8] = s.querySelector('themeElements>clrScheme>accent5>srgbClr').getAttribute('val');
                    colorThemes[9] = s.querySelector('themeElements>clrScheme>accent6>srgbClr').getAttribute('val');
                }
                // GrapeCity End
                if (s = zip.file('xl/styles.xml')) {
                    s = domParser.parseFromString(s.asText(), 'application/xml');
                    numFmtArray = s.querySelectorAll('numFmts>numFmt');
                    i = numFmtArray.length - 1;
                    while (i >= 0) {
                        t = numFmtArray[i];
                        numFmts[+t.getAttribute('numFmtId')] = t.getAttribute('formatCode');
                        i--;
                    }
                    fontArray = s.querySelectorAll('fonts>font');
                    i = fontArray.length - 1;
                    while (i >= 0) {
                        t = fontArray[i];
                        fonts[i] = {
                            bold: t.querySelector('b') != null,
                            italic: t.querySelector('i') != null,
                            underline: t.querySelector('u') != null,
                            size: Math.round(+t.querySelector('sz').getAttribute('val') * 96 / 72),
                            family: t.querySelector('name').getAttribute('val'),
                            color: getColor(t, false)
                        };
                        i--;
                    }
                    fillArray = s.querySelectorAll('fills>fill');
                    i = fillArray.length - 1;
                    while (i >= 0) {
                        fills[i] = getColor(fillArray[i], true);
                        i--;
                    }
                    s = s.querySelectorAll('cellXfs>xf');
                    i = s.length - 1;
                    while (i >= 0) {
                        id = +s[i].getAttribute('numFmtId');
                        f = numFmts[id];
                        if (/[hsmy\:]/i.test(f)) {
                            t = 'date';
                        }
                        else if (f.indexOf('0') > -1) {
                            t = 'number';
                        }
                        else if (f === '@') {
                            t = 'string';
                        }
                        else {
                            t = 'unknown';
                        }
                        id = +s[i].getAttribute('fontId');
                        font = id > 0 ? fonts[id] : null;
                        id = +s[i].getAttribute('fillId');
                        fill = id > 1 ? fills[id] : null;
                        styles.unshift({
                            formatCode: f,
                            type: t,
                            font: font,
                            fillColor: fill,
                            hAlign: s[i].querySelector('alignment') != null ? xlsx.Workbook._parseStringToHAlign(s[i].querySelector('alignment').getAttribute('horizontal')) : null
                        });
                        i--;
                    }
                }
                result.styles = styles;
                // GrapeCity Begin: load the macro of the xlsx file into workbook object model.
                if (s = zip.file('xl/vbaProject.bin')) {
                    if (result.reservedContent == null) {
                        result.reservedContent = {};
                    }
                    result.reservedContent.macros = s.asUint8Array();
                }
                // GrapeCity End
                // Get worksheet info from "xl/worksheets/sheetX.xml"
                i = result.sheets.length;
                while (i--) {
                    s = zip.file('xl/worksheets/sheet' + (i + 1) + '.xml').asText();
                    s = domParser.parseFromString(s, 'application/xml');
                    // GrapeCity Begin: Add merge cells processing.
                    mergeCells = [];
                    mergeCellArray = s.querySelectorAll('mergeCells>mergeCell');
                    if (mergeCellArray.length > 0) {
                        j = mergeCellArray.length - 1;
                        while (j >= 0) {
                            mergeRange = mergeCellArray[j].getAttribute('ref').split(':');
                            if (mergeRange.length === 2) {
                                mergeCells.unshift({
                                    topRow: +mergeRange[0].match(/\d*/g).join('') - 1,
                                    leftCol: alphaNum(mergeRange[0].match(/[a-zA-Z]*/g)[0]),
                                    bottomRow: +mergeRange[1].match(/\d*/g).join('') - 1,
                                    rightCol: alphaNum(mergeRange[1].match(/[a-zA-Z]*/g)[0])
                                });
                            }
                            j--;
                        }
                    }
                    // GrapeCity End
                    // GrapeCity Begin: Gets tha base shared formula for current sheet.
                    getsBaseSharedFormulas(s);
                    // GrapeCity End
                    w = result.sheets[i];
                    t = s.querySelector('dimension').getAttribute('ref');
                    t = t.substr(t.indexOf(':') + 1);
                    // GrapeCity Begin: Add hidden column and column width processing. 
                    cols = s.querySelectorAll('cols>col');
                    colsSetting = [];
                    if (cols.length > 0) {
                        for (idx = cols.length - 1; idx >= 0; idx--) {
                            colWidth = parseCharWidthToPixel(+cols[idx].getAttribute('width'));
                            f = null;
                            if (cols[idx].hasAttribute('style')) {
                                f = styles[+cols[idx].getAttribute('style')] || { type: 'General', formatCode: null };
                            }
                            style = null;
                            if (f && (f.font || f.fillColor || f.hAlign || (f.formatCode && f.formatCode !== 'General'))) {
                                style = {
                                    format: !f.formatCode || f.formatCode === 'General' ? null : f.formatCode,
                                    font: f.font,
                                    fill: {
                                        color: f.fillColor
                                    },
                                    hAlign: f.hAlign
                                };
                            }
                            for (colIndex = +cols[idx].getAttribute('min') - 1; colIndex < +cols[idx].getAttribute('max'); colIndex++) {
                                colsSetting[colIndex] = {
                                    visible: cols[idx].getAttribute('hidden') !== '1',
                                    autoWidth: cols[idx].getAttribute('bestFit') === '1',
                                    width: colWidth,
                                    style: style
                                };
                            }
                        }
                    }
                    w.cols = w.columns = colsSetting;
                    // GrapeCity End
                    // GrapeCity Begin: Add frozen cols/rows processing. 
                    pane = s.querySelector('pane');
                    if (!!pane) {
                        if (pane.getAttribute('state') === 'frozen') {
                            frozenRows = pane.getAttribute('ySplit');
                            frozenRows = frozenRows ? +frozenRows : NaN;
                            frozenCols = pane.getAttribute('xSplit');
                            frozenCols = frozenCols ? +frozenCols : NaN;
                            w.frozenPane = {
                                rows: frozenRows,
                                columns: frozenCols
                            };
                        }
                    }
                    // GrapeCity End
                    w.maxCol = alphaNum(t.match(/[a-zA-Z]*/g)[0]) + 1;
                    w.maxRow = +t.match(/\d*/g).join('');
                    // GrapeCity Begin: Check whether the Group Header is below the group content.
                    summaryBelow = s.querySelector('sheetPr>outlinePr');
                    w.summaryBelow = summaryBelow ? summaryBelow.getAttribute('summaryBelow') !== '0' : true;
                    // GrapeCity End
                    s = s.querySelectorAll('sheetData>row');
                    w = w.rows;
                    j = s.length - 1;
                    while (j >= 0) {
                        row = w[+s[j].getAttribute('r') - 1] = {
                            visible: true,
                            groupLevel: NaN,
                            cells: []
                        };
                        // GrapeCity Begin: Check the visibility of the row.
                        if (s[j].hasAttribute('hidden')) {
                            row.visible = s[j].getAttribute('hidden') !== '1';
                        }
                        // GrapeCity End
                        // GrapeCity Begin: Get the row height setting for the custom Height row.
                        if (s[j].getAttribute('customHeight') === '1') {
                            height = +s[j].getAttribute('ht');
                            row.height = height * 96 / 72;
                        }
                        if (s[j].getAttribute('customFormat') === '1') {
                            f = styles[+s[j].getAttribute('s')] || { type: 'General', formatCode: null };
                            if (f.font || f.fillColor || f.hAlign || (f.formatCode && f.formatCode !== 'General')) {
                                style = {
                                    format: !f.formatCode || f.formatCode === 'General' ? null : f.formatCode,
                                    font: f.font,
                                    fill: {
                                        color: f.fillColor
                                    },
                                    hAlign: f.hAlign
                                };
                            }
                            else {
                                style = null;
                            }
                        }
                        else {
                            style = null;
                        }
                        row.style = style;
                        // GrapeCity End
                        // GrapeCity Begin: Get the group level.
                        groupLevel = s[j].getAttribute('outlineLevel');
                        row.groupLevel = groupLevel && groupLevel !== '' ? +groupLevel : NaN;
                        // GrapeCity End
                        // GrapeCity Begin: Get the collapsed attribute of the row.
                        row.collapsed = s[j].getAttribute('collapsed') === '1';
                        // GrapeCity End
                        columns = s[j].querySelectorAll('row>c');
                        k = columns.length - 1;
                        while (k >= 0) {
                            cell = columns[k];
                            f = styles[+cell.getAttribute('s')] || {
                                type: 'General',
                                formatCode: null
                            };
                            // GrapeCity Begin: set font setting, fill setting and horizontal alignment into the style property.
                            if (f.font || f.fillColor || f.hAlign || (f.formatCode && f.formatCode !== 'General')) {
                                style = {
                                    format: !f.formatCode || f.formatCode === 'General' ? null : f.formatCode,
                                    font: f.font,
                                    fill: {
                                        color: f.fillColor
                                    },
                                    hAlign: f.hAlign
                                };
                            }
                            else {
                                style = null;
                            }
                            // GrapeCity End
                            t = cell.getAttribute('t') || f.type;
                            val = cell.querySelector('v');
                            if (!!val) {
                                val = val.textContent;
                            }
                            // GrapeCity Begin: Add formula processing. 
                            formula = cell.querySelector('f');
                            si = null;
                            cellRef = null;
                            if (!!formula) {
                                if (!!formula.textContent) {
                                    formula = formula.textContent;
                                }
                                else {
                                    si = formula.getAttribute('si');
                                    if (si) {
                                        cellRef = cell.getAttribute('r');
                                        formula = getSharedFormula(si, cellRef);
                                    }
                                }
                            }
                            // GrapeCity End
                            // GrapeCity Begin: Fix issue that couldn't read the excel cell content processed by the string processing function.
                            if (t !== 'str') {
                                val = val ? +val : '';
                            } // turn non-zero into number when the type of the cell is not 'str'
                            // GrapeCity End
                            colIndex = alphaNum(cell.getAttribute('r').match(/[a-zA-Z]*/g)[0]);
                            switch (t) {
                                case 's':
                                    val = sharedStrings[val];
                                    break;
                                case 'b':
                                    val = val === 1;
                                    break;
                                case 'date':
                                    val = val ? convertDate(val) : '';
                                    break;
                            }
                            row.cells[colIndex] = {
                                value: val,
                                isDate: t === 'date',
                                formula: unescapeXML(formula) /* GrapeCity: Add formula property.*/,
                                style: style /* GrapeCity: Add style property.*/
                            };
                            k--;
                        }
                        j--;
                    }
                    // GrapeCity Begin: Parse the merge cell info to rowSpan and colSpan property of cell.
                    for (k = 0; k < mergeCells.length; k++) {
                        mergeCell = mergeCells[k];
                        result.sheets[i].rows[mergeCell.topRow].cells[mergeCell.leftCol].rowSpan = mergeCell.bottomRow - mergeCell.topRow + 1;
                        result.sheets[i].rows[mergeCell.topRow].cells[mergeCell.leftCol].colSpan = mergeCell.rightCol - mergeCell.leftCol + 1;
                    }
                }
                result.processTime = Date.now() - processTime;
            }
            else {
                processTime = Date.now();
                xmlSerializer = new XMLSerializer();
                sharedStrings = [[], 0];
                // Fully static
                zip.folder('_rels').file('.rels', xmlDescription + xmlSerializer.serializeToString(generateRelsDoc()));
                docProps = zip.folder('docProps');
                xl = zip.folder('xl');
                var strThemeDoc = xmlSerializer.serializeToString(generateThemeDoc());
                if (wijmo.isIE) {
                    strThemeDoc = strThemeDoc.replace(docRegExp, '');
                }
                xl.folder('theme').file('theme1.xml', xmlDescription + strThemeDoc);
                // GrapeCity Begin: Export the macro to xlsx file.
                macroEnabled = !!(file.reservedContent && file.reservedContent.macros);
                if (macroEnabled) {
                    xl.file('vbaProject.bin', file.reservedContent.macros);
                }
                // GrapeCity End
                xlWorksheets = xl.folder('worksheets');
                // Not content dependent
                var strCoreDoc = xmlSerializer.serializeToString(generateCoreDoc());
                if (wijmo.isIE) {
                    strCoreDoc = strCoreDoc.replace(docRegExp, '');
                }
                docProps.file('core.xml', xmlDescription + strCoreDoc);
                // Content dependent
                styles = new Array(1);
                borders = new Array(1);
                fonts = new Array(1);
                fills = new Array(2); /* GrapeCity: Initialize the fills array for fill color processing.*/
                w = file.sheets.length;
                while (w--) {
                    // Generate worksheet (gather sharedStrings) then generate entries for constant files below
                    id = w + 1;
                    // Generate sheetX.xml in var s
                    worksheet = file.sheets[w];
                    columnSettings = worksheet.columns || worksheet.cols;
                    if (!worksheet) {
                        throw 'Worksheet should not be empty!';
                    }
                    sheetDoc = document.implementation.createDocument(workbookNS, 'worksheet', null);
                    generateSheetGlobalSetting(sheetDoc, worksheet);
                    sheetData = sheetDoc.createElementNS(workbookNS, 'sheetData');
                    sheetStyle = worksheet.style;
                    data = worksheet.rows;
                    s = '';
                    columns = [];
                    merges = [];
                    i = -1;
                    l = data ? data.length : 0;
                    while (++i < l) {
                        j = -1;
                        k = data[i] && data[i].cells ? data[i].cells.length : 0;
                        // GrapeCity Begin: Add row visibility, row height and group level for current excel row.
                        rowStyle = null;
                        row = sheetDoc.createElementNS(workbookNS, 'row');
                        row.setAttribute('r', i + 1);
                        row.setAttribute('x14ac:dyDescent', '0.25');
                        if (!!data[i]) {
                            if (data[i].height) {
                                row.setAttribute('customHeight', '1');
                                row.setAttribute('ht', +data[i].height * 72 / 96);
                            }
                            if (data[i].groupLevel) {
                                row.setAttribute('outlineLevel', data[i].groupLevel);
                            }
                            rowStyle = data[i].style;
                            if (rowStyle) {
                                rowStyle = resolveStyleInheritance(rowStyle);
                                if (rowStyle.font && rowStyle.font.color) {
                                    rowStyle.font.color = parseColor(rowStyle.font.color);
                                }
                                if (rowStyle.fill && rowStyle.fill.color) {
                                    rowStyle.fill.color = parseColor(rowStyle.fill.color);
                                }
                                if (rowStyle.hAlign != null && !wijmo.isString(rowStyle.hAlign)) {
                                    rowStyle.hAlign = xlsx.Workbook._parseHAlignToString(wijmo.asEnum(rowStyle.hAlign, xlsx.HAlign));
                                }
                                if (rowStyle.vAlign != null && !wijmo.isString(rowStyle.vAlign)) {
                                    rowStyle.vAlign = xlsx.Workbook._parseVAlignToString(wijmo.asEnum(rowStyle.vAlign, xlsx.VAlign));
                                }
                                style = JSON.stringify(rowStyle);
                                index = styles.indexOf(style);
                                if (index < 0) {
                                    style = styles.push(style) - 1;
                                }
                                else {
                                    style = index;
                                }
                                row.setAttribute('customFormat', '1');
                                row.setAttribute('s', style);
                            }
                        }
                        if (data[i] && data[i].visible === false) {
                            row.setAttribute('hidden', '1');
                        }
                        if (data[i] && data[i].collapsed === true) {
                            row.setAttribute('collapsed', '1');
                        }
                        // GrapeCity End
                        while (++j < k) {
                            cell = data[i].cells[j];
                            // GrapeCity Begin: We should reset all the related variable before processing a new cell.
                            val = undefined;
                            style = undefined;
                            t = '';
                            index = -1;
                            // GrapeCity End
                            val = cell && cell.hasOwnProperty('value') ? cell.value : cell;
                            style = cell && cell.style ? JSON.parse(JSON.stringify(cell.style)) : {}; /* GrapeCity: Packed cell styles into the style property of cell */
                            // GrapeCity: remove the isFinite checking for the string value.  If the value is string, it will always be exported as string.
                            if (val && typeof val === 'string' && (+val).toString() !== val) {
                                // If value is string, and not string of just a number, place a sharedString reference instead of the value
                                sharedStrings[1]++; // Increment total count, unique count derived from sharedStrings[0].length
                                index = sharedStrings[0].indexOf(val);
                                if (index < 0) {
                                    index = sharedStrings[0].push(val) - 1;
                                }
                                val = index;
                                t = 's';
                            }
                            else if (typeof val === 'boolean') {
                                val = (val ? 1 : 0);
                                t = 'b';
                            }
                            else if (typeOf(val) === 'date' || (cell && cell.isDate)) {
                                val = convertDate(val);
                                style.format = style.format || 'mm-dd-yy';
                            }
                            else if (typeof val === 'object') {
                                val = null;
                            } // unsupported value
                            // Resolve the inheritance style.
                            style = resolveStyleInheritance(style);
                            // GrapeCity Begin: Extends the cell style with worksheet style, column style and row style.
                            columnStyle = columnSettings && columnSettings[j] ? columnSettings[j].style : null;
                            if (columnStyle) {
                                columnStyle = resolveStyleInheritance(columnStyle);
                                style = extend(style, columnStyle);
                            }
                            if (rowStyle) {
                                style = extend(style, rowStyle);
                            }
                            if (sheetStyle) {
                                sheetStyle = resolveStyleInheritance(sheetStyle);
                                style = extend(style, sheetStyle);
                            }
                            // GrapeCity End
                            // GrapeCity Begin: Parse the hAlign/vAlign from enum to string.
                            if (style.hAlign != null && !wijmo.isString(style.hAlign)) {
                                style.hAlign = xlsx.Workbook._parseHAlignToString(wijmo.asEnum(style.hAlign, xlsx.HAlign));
                            }
                            if (style.vAlign != null && !wijmo.isString(style.vAlign)) {
                                style.vAlign = xlsx.Workbook._parseVAlignToString(wijmo.asEnum(style.vAlign, xlsx.VAlign));
                            }
                            // GrapeCity End
                            // GrapeCity Begin: Parse the different color pattern to Hex pattern like #RRGGBB for the font color and fill color.
                            if (style.font && style.font.color) {
                                style.font.color = parseColor(style.font.color);
                            }
                            if (style.fill && style.fill.color) {
                                style.fill.color = parseColor(style.fill.color);
                            }
                            // GrapeCity End
                            // GrapeCity Begin: Parse the border setting incluing border color and border style for each border.
                            if (style.borders) {
                                parseBorder(style.borders);
                            }
                            // GrapeCity End
                            // use stringified version as unique and reproducible style signature
                            style = JSON.stringify(style);
                            index = styles.indexOf(style);
                            if (index < 0) {
                                style = styles.push(style) - 1;
                            }
                            else {
                                style = index;
                            }
                            // store merges if needed and add missing cells. Cannot have rowSpan AND colSpan
                            // GrapeCity Begin: Update for merge cells processing.
                            if (cell) {
                                if ((cell.colSpan != null && cell.colSpan > 1) || (cell.rowSpan != null && cell.rowSpan > 1)) {
                                    cell.colSpan = cell.colSpan || 1;
                                    cell.rowSpan = cell.rowSpan || 1;
                                    merges.push([numAlpha(j) + (i + 1), numAlpha(j + cell.colSpan - 1) + (i + cell.rowSpan)]);
                                }
                            }
                            // GrapeCity End
                            row.appendChild(generateCell(sheetDoc, i, j, style, t, val, cell && cell.formula ? cell.formula : null));
                        }
                        sheetData.appendChild(row);
                    }
                    cols = null;
                    if (columnSettings) {
                        cols = sheetDoc.createElementNS(workbookNS, 'cols');
                        for (i = 0; i < columnSettings.length; i++) {
                            // GrapeCity Begin: Add the column visibilty for the excel column
                            if (!isEmpty(columnSettings[i])) {
                                columnStyle = columnSettings[i].style;
                                if (columnStyle) {
                                    columnStyle = resolveStyleInheritance(columnStyle);
                                    if (columnStyle.font && columnStyle.font.color) {
                                        columnStyle.font.color = parseColor(columnStyle.font.color);
                                    }
                                    if (columnStyle.fill && columnStyle.fill.color) {
                                        columnStyle.fill.color = parseColor(columnStyle.fill.color);
                                    }
                                    if (columnStyle.hAlign != null && !wijmo.isString(columnStyle.hAlign)) {
                                        columnStyle.hAlign = xlsx.Workbook._parseHAlignToString(wijmo.asEnum(columnStyle.hAlign, xlsx.HAlign));
                                    }
                                    if (columnStyle.vAlign != null && !wijmo.isString(columnStyle.vAlign)) {
                                        columnStyle.vAlign = xlsx.Workbook._parseVAlignToString(wijmo.asEnum(columnStyle.vAlign, xlsx.VAlign));
                                    }
                                    columnStyle = JSON.stringify(columnStyle);
                                    index = styles.indexOf(columnStyle);
                                    if (index < 0) {
                                        columnStyle = styles.push(columnStyle) - 1;
                                    }
                                    else {
                                        columnStyle = index;
                                    }
                                }
                                colWidth = columnSettings[i].width;
                                if (colWidth != null) {
                                    if (typeof colWidth === 'string' && colWidth.indexOf('ch') > -1) {
                                        colWidth = parseCharCountToCharWidth(colWidth.substring(0, colWidth.indexOf('ch')));
                                    }
                                    else {
                                        colWidth = parsePixelToCharWidth(colWidth);
                                    }
                                }
                                else {
                                    colWidth = 8.43;
                                }
                                col = sheetDoc.createElementNS(workbookNS, 'col');
                                col.setAttribute('min', i + 1);
                                col.setAttribute('max', i + 1);
                                if (!!columnStyle) {
                                    col.setAttribute('style', columnStyle);
                                }
                                if (!!colWidth) {
                                    col.setAttribute('width', colWidth);
                                    col.setAttribute('customWidth', '1');
                                }
                                if (columnSettings[i].autoWidth !== false) {
                                    col.setAttribute('bestFit', '1');
                                }
                                if (columnSettings[i].visible === false) {
                                    col.setAttribute('hidden', '1');
                                }
                                cols.appendChild(col);
                            }
                        }
                    }
                    // only add cols definition if not empty
                    if (!!cols) {
                        sheetDoc.documentElement.appendChild(cols);
                    }
                    sheetDoc.documentElement.appendChild(sheetData);
                    ;
                    if (merges.length > 0) {
                        sheetDoc.documentElement.appendChild(generateMergeSetting(sheetDoc, merges));
                    }
                    pageMargins = sheetDoc.createElementNS(workbookNS, 'pageMargins');
                    pageMargins.setAttribute('left', '0.7');
                    pageMargins.setAttribute('right', '0.7');
                    pageMargins.setAttribute('top', '0.75');
                    pageMargins.setAttribute('bottom', '0.75');
                    pageMargins.setAttribute('header', '0.3');
                    pageMargins.setAttribute('footer', '0.3');
                    sheetDoc.documentElement.appendChild(pageMargins);
                    var strSheetDoc = xmlSerializer.serializeToString(sheetDoc);
                    if (wijmo.isIE) {
                        strSheetDoc = strSheetDoc.replace(docRegExp, '');
                    }
                    xlWorksheets.file('sheet' + id + '.xml', xmlDescription + strSheetDoc);
                    contentType = sheetDoc.createElementNS(contentTypesNS, 'Override');
                    contentType.setAttribute('PartName', '/xl/worksheets/sheet' + id + '.xml');
                    contentType.setAttribute('ContentType', 'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml');
                    contentTypes.unshift(contentType);
                    props.unshift(worksheet.name || 'Sheet' + id);
                    xlRel = sheetDoc.createElementNS(relationshipsNS, 'Relationship');
                    xlRel.setAttribute('Id', 'rId' + id);
                    xlRel.setAttribute('Type', 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet');
                    xlRel.setAttribute('Target', 'worksheets/sheet' + id + '.xml');
                    xlRels.unshift(xlRel);
                    sheetEle = sheetDoc.createElementNS(workbookNS, 'sheet');
                    sheetEle.setAttribute('name', worksheet.name || 'Sheet' + id);
                    sheetEle.setAttribute('sheetId', id.toString());
                    sheetEle.setAttribute('r:id', 'rId' + id);
                    if (worksheet.visible === false) {
                        sheetEle.setAttribute('state', 'hidden');
                    }
                    worksheets.unshift(sheetEle);
                }
                // xl/styles.xml
                var strStyleDoc = xmlSerializer.serializeToString(generateStyleDoc());
                if (wijmo.isIE) {
                    strStyleDoc = strStyleDoc.replace(docRegExp, '');
                }
                xl.file('styles.xml', xmlDescription + strStyleDoc);
                // [Content_Types].xml
                zip.file('[Content_Types].xml', xmlDescription + xmlSerializer.serializeToString(generateContentTypesDoc()));
                // docProps/app.xml
                docProps.file('app.xml', xmlDescription + xmlSerializer.serializeToString(generateAppDoc()));
                // xl/_rels/workbook.xml.rels
                xl.folder('_rels').file('workbook.xml.rels', xmlDescription + xmlSerializer.serializeToString(generateWorkbookRels()));
                // xl/sharedStrings.xml
                xl.file('sharedStrings.xml', xmlDescription + xmlSerializer.serializeToString(generateSharedStringsDoc()));
                // xl/workbook.xml
                var strWorkbookDoc = xmlSerializer.serializeToString(generateWorkbook());
                if (wijmo.isIE) {
                    strWorkbookDoc = strWorkbookDoc.replace(docRegExp, '');
                }
                xl.file('workbook.xml', xmlDescription + strWorkbookDoc);
                // GrapeCity Begin: If the exported file contains macros, it should set the macro enable application type for the download href of the result.
                if (macroEnabled) {
                    applicationType = 'application/vnd.ms-excel.sheet.macroEnabled.12;';
                }
                else {
                    applicationType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;';
                }
                // GrapeCity End
                processTime = Date.now() - processTime;
                zipTime = Date.now();
                result = {
                    base64: zip.generate({ compression: 'DEFLATE' }), zipTime: Date.now() - zipTime, processTime: processTime,
                    href: function () { return 'data:' + applicationType + 'base64,' + this.base64; }
                };
            }
            return result;
        }
        xlsx._xlsx = _xlsx;
    })(xlsx = wijmo.xlsx || (wijmo.xlsx = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=c1xlsx.js.map