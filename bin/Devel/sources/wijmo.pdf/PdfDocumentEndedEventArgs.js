var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var pdf;
    (function (pdf) {
        'use strict';
        /**
         * Provides arguments for the @see:PdfDocument.end event.
         */
        var PdfDocumentEndedEventArgs = (function (_super) {
            __extends(PdfDocumentEndedEventArgs, _super);
            /**
            * Initializes a new instance of the @see:PdfDocumentEndedEventArgs class.
            *
            * @param blob A Blob object that contains the document data.
            */
            function PdfDocumentEndedEventArgs(blob) {
                _super.call(this);
                this._blob = blob;
            }
            Object.defineProperty(PdfDocumentEndedEventArgs.prototype, "blob", {
                /**
                 * Gets a Blob object that contains the document data.
                 */
                get: function () {
                    return this._blob;
                },
                enumerable: true,
                configurable: true
            });
            return PdfDocumentEndedEventArgs;
        }(wijmo.EventArgs));
        pdf.PdfDocumentEndedEventArgs = PdfDocumentEndedEventArgs;
    })(pdf = wijmo.pdf || (wijmo.pdf = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=PdfDocumentEndedEventArgs.js.map