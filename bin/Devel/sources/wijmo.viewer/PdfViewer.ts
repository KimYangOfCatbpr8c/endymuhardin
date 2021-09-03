module wijmo.viewer {
    'use strict';

    /**
     * Defines the pdf viewer control for displaying a pdf document source.
     */
    export class PdfViewer extends ViewerBase {

        /**
         * Initializes a new instance of a @see:PdfViewer control.
         *
         * @param element The DOM element that will host the control, or a selector for the host element (e.g. '#theCtrl').
         * @param options JavaScript object containing initialization data for the control.
         */
        constructor(element: any, options?: any) {
            super(element, options);
        }

        get _innerDocumentSource(): _PdfDocumentSource {
            return <_PdfDocumentSource>this._getDocumentSource();
        }

        _getSource(): _PdfDocumentSource {
            if (!this.filePath) {
                return null;
            }

            return new _PdfDocumentSource({
                serviceUrl: this.serviceUrl,
                filePath: this.filePath
            });
        }
    }
}