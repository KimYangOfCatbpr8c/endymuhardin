var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var viewer;
    (function (viewer) {
        'use strict';
        /**
         * Defines the pdf viewer control for displaying a pdf document source.
         */
        var PdfViewer = (function (_super) {
            __extends(PdfViewer, _super);
            /**
             * Initializes a new instance of a @see:PdfViewer control.
             *
             * @param element The DOM element that will host the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options JavaScript object containing initialization data for the control.
             */
            function PdfViewer(element, options) {
                _super.call(this, element, options);
            }
            Object.defineProperty(PdfViewer.prototype, "_innerDocumentSource", {
                get: function () {
                    return this._getDocumentSource();
                },
                enumerable: true,
                configurable: true
            });
            PdfViewer.prototype._getSource = function () {
                if (!this.filePath) {
                    return null;
                }
                return new viewer._PdfDocumentSource({
                    serviceUrl: this.serviceUrl,
                    filePath: this.filePath
                });
            };
            return PdfViewer;
        }(viewer.ViewerBase));
        viewer.PdfViewer = PdfViewer;
    })(viewer = wijmo.viewer || (wijmo.viewer = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=PdfViewer.js.map