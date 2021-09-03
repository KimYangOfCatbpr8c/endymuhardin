/*
 * Defines the @see:XlsxConverter class that provides client-side Excel xlsx file import/export capabilities, and @see:IWorkbook
 * interface that along with the associated interfaces defines Excel Workbook Object Model that represents Excel Workbook
 * data.
 *
 * The module has dependency on the external <a href="https://stuk.github.io/jszip" target="_blank">JSZip</a> library,
 * which should be referenced in html page with the markup like this:
 * <pre>&lt;script src="http://cdnjs.cloudflare.com/ajax/libs/jszip/2.5.0/jszip.min.js"&gt;&lt;/script&gt;</pre>
 *
 * The import/export operations are performed solely on a client and don't require any server-side services.
*/
var wijmo;
(function (wijmo) {
    var xlsx;
    (function (xlsx) {
        'use strict';
        /*
         * This class provides static <b>import</b> and <b>export</b> methods for importing and exporting Excel xlsx files.
         */
        var XlsxConverter = (function () {
            function XlsxConverter() {
            }
            /*
             * Exports the Excel Workbook content to xlsx file.
             *
             * For example:
             * <pre>// Create an xlsx file containing "Hello, Excel!"
             *
             * // HTML
             * &lt;a download="Hello.xlsx"
             *     href=""
             *     id="export"
             *     onclick="exportXlsx()"&gt;
             *     Export
             * &lt;/a&gt;
             *
             * // JavaScript
             * function exportXlsx() {
             *     // Define workbook content.
             *     var workbook =
             *         {
             *             sheets: [
             *                 {
             *                     rows: [
             *                       {
             *                           cells: [
             *                             { value: 'Hello, Excel!' }
             *                           ]
             *                       }]
             *                 }]
             *         };
             *
             *     // Export to xlsx format.
             *     var fileContent = wijmo.xlsx.XlsxConverter.export(workbook);
             *     // Save the xlsx content to a file.
             *     var link = document.getElementById("export");
             *     if (navigator.msSaveBlob) {
             *         // Save the xlsx file using Blob and msSaveBlob in IE10+.
             *         var blob = new Blob([fileContent.base64Array]);
             *         navigator.msSaveBlob(blob, link.getAttribute("download"));
             *     } else {
             *         link.href = fileContent.href();
             *     }
             * }</pre>
             * @param workbook The workbook (data and properties) being exported as JavaScript object
             * which conforms to the @see:IWorkbook interface.
             * @return An object containing xlsx file content in different formats that can be saved
             * on a local disk or transferred to server.
             */
            XlsxConverter.export = function (workbook) {
                wijmo._deprecated('XlsxConverter.export', 'Workbook.save');
                var result = xlsx._xlsx(workbook);
                result.base64Array = xlsx.Workbook._base64DecToArr(result.base64);
                return result;
            };
            /*
             * Exports the Workbook Object Model instance to a local xlsx file.
             *
             * This method brings up a browser dependent Open/Save File dialog that usually allows to Open it using program/application which
             * is xls compatible and Save a file to a specific location
             *
             * For example:
             * <pre>// This sample saves xlsx file with a single "Hello, Excel!"
             * // cell to a local disk.
             * &nbsp;
             * // Define a workbook content.
             * var workbook =
             *     {
             *         sheets: [
             *             {
             *                 rows: [
             *                     {
             *                       cells: [
             *                           { value: 'Hello, Excel!' }
             *                       ]
             *                 }]
             *              }]
             *      };
             * &nbsp;
             * // Export to xlsx format and save to a file.
             * wijmo.xlsx.XlsxConverter.exportToFile(workbook, 'Hello.xlsx');</pre>
             * @param workbook The workbook (data and properties) being exported as JavaScript object that conforms to
             * the @see:IWorkbook interface.
             * @param fileName The name without a path of the saving file.
             * @return An object containing xlsx file content in different formats that can be saved on a local disk or transferred to server.
             */
            XlsxConverter.exportToFile = function (workbook, fileName) {
                wijmo._deprecated('XlsxConverter.exportToFile', 'Workbook.save');
                var result = XlsxConverter.export(workbook);
                var blob = new Blob([result.base64Array]);
                if (!fileName) {
                    return;
                }
                if (navigator.msSaveBlob) {
                    navigator.msSaveBlob(blob, fileName);
                }
                else {
                    var link = document.createElement('a'), click = function (element) {
                        var evnt = document.createEvent('MouseEvents');
                        evnt.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                        element.dispatchEvent(evnt);
                    }, fr = new FileReader();
                    // Save a blob using data URI scheme
                    fr.onloadend = function (e) {
                        link.download = fileName;
                        link.href = result.href();
                        click(link);
                        link = null;
                    };
                    fr.readAsDataURL(blob);
                }
            };
            /*
             * Imports the xlsx file content to the Workbook Object Model instance.
             *
             * For example:
             * <pre>// This sample opens an xlsx file chosen from Open File
             * // dialog and stores its Workbook Object Model
             * // representation in the 'workbook' variable.
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
             *     var reader = new FileReader(),
             *         fileData;
             *     reader.onload = function (e) {
             *        workbook = wijmo.xlsx.XlsxConverter.import(reader.result);
             *     };
             *     var file = importFile.files[0];
             *     if (file) {
             *         reader.readAsArrayBuffer(file);
             *     }
             * }</pre>
             * @param fileContent The content of the importing xlsx file represented as an encoded base64 string or
             * as an <b>ArrayBuffer</b> object.
             * @return A Workbook Object Model instance that allows to inspect workbook data and properties.
             */
            XlsxConverter.import = function (fileContent) {
                wijmo._deprecated('XlsxConverter.import', 'Workbook.load');
                var fileData = typeof fileContent === 'string' ? fileContent : xlsx.Workbook._base64EncArr(new Uint8Array(fileContent));
                return xlsx._xlsx(fileData);
            };
            /*
             * Converts the .Net date format to Excel format.
             *
             * @param netFormat The .Net date format.
             * @return Excel format representation.
             */
            XlsxConverter.xlsxDateFormat = function (netFormat) {
                wijmo._deprecated('XlsxConverter.xlsxDateFormat', 'Workbook.toXlsxDateFormat');
                return xlsx.Workbook.toXlsxDateFormat(netFormat);
            };
            /*
             * Converts the .Net number format to xlsx format.
             *
             * @param netFormat The .Net number format.
             * @return Excel format representation.
             */
            XlsxConverter.xlsxNumberFormat = function (netFormat) {
                wijmo._deprecated('XlsxConverter.xlsxNumberFormat', 'Workbook.toXlsxNumberFormat');
                return xlsx.Workbook.toXlsxNumberFormat(netFormat);
            };
            /*
             * Converts the xlsx multi-section format string to an array of corresponding .Net formats.
             *
             * @param xlsxFormat The Excel format string, that may contain multiple format sections separated by semicolon.
             * @return An array of .Net format strings where each element corresponds to a separate Excel format section.
             * The returning array always contains at least one element. It can be an empty string in case the passed Excel format is empty.
             */
            XlsxConverter.netFormat = function (xlsxFormat) {
                wijmo._deprecated('XlsxConverter.netFormat', 'Workbook.fromXlsxFormat');
                return xlsx.Workbook.fromXlsxFormat(xlsxFormat);
            };
            /*
             * Converts zero-based cell, row or column index to Excel alphanumeric representation.
             *
             * @param row The zero-based row index or a null value if only column index should be converted.
             * @param col The zero-based column index or a null value if only row index should be converted.
             * @param absolute True value indicates that absolute indexes should be returned for both row and
             *        column indexes (like $D$7). The <b>absoluteCol</b> parameter allows to redefine this value for the column index.
             * @param absoluteCol True value indicates that column index is absolute.
             * @return The alphanumeric Excel index representation.
            */
            XlsxConverter.xlsxIndex = function (row, col, absolute, absoluteCol) {
                wijmo._deprecated('XlsxConverter.xlsxIndex', 'Workbook.xlsxAddress');
                return xlsx.Workbook.xlsxAddress(row, col, absolute, absoluteCol);
            };
            /*
             * Convert Excel's alphanumeric cell, row or column index to the zero-based row/column indexes pair.
             *
             * @param xlsxIndex The alphanumeric Excel index that may include alphabetic A-based on column index
             * and/or numeric 1-based on row index, like "D15", "D" or "15". The alphabetic column index can be
             * in lower or upper case.
             * @return The object with <b>row</b> and <b>col</b> properties containing zero-based row and/or column indexes.
             * If row or column component is not specified in the alphanumeric index then corresponding returning property is undefined.
             */
            XlsxConverter.numericIndex = function (xlsxIndex) {
                wijmo._deprecated('XlsxConverter.numericIndex', 'Workbook.numericAddress');
                return xlsx.Workbook.tableAddress(xlsxIndex);
            };
            return XlsxConverter;
        }());
        xlsx.XlsxConverter = XlsxConverter;
    })(xlsx = wijmo.xlsx || (wijmo.xlsx = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=XlsxConverter.js.map