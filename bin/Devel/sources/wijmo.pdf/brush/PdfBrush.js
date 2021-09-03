var wijmo;
(function (wijmo) {
    var pdf;
    (function (pdf) {
        'use strict';
        /**
        * Represents an abstract class that serves as a base class for all brushes.
        * Instances of any class that derives from this class are used to fill areas and text.
        *
        * This class is not intended to be instantiated in your code.
        */
        var PdfBrush = (function () {
            function PdfBrush() {
            }
            /**
            * Creates a copy of this @see:PdfBrush.
            * @return A copy of this brush.
            */
            PdfBrush.prototype.clone = function () {
                throw pdf._Errors.AbstractMethod;
            };
            /**
            * Determines whether the specified @see:PdfBrush instance is equal to the current one.
            *
            * @param value @see:PdfBrush to compare.
            * @return true if the specified object is equal to the current one, otherwise false.
            */
            PdfBrush.prototype.equals = function (value) {
                throw pdf._Errors.AbstractMethod;
            };
            /*
            * Gets a native PDFKit's object which represents the brush.
            *
            * @param area Associated @see:PdfPageArea.
            */
            PdfBrush.prototype._getBrushObject = function (area) {
                throw pdf._Errors.AbstractMethod;
            };
            return PdfBrush;
        }());
        pdf.PdfBrush = PdfBrush;
    })(pdf = wijmo.pdf || (wijmo.pdf = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=PdfBrush.js.map