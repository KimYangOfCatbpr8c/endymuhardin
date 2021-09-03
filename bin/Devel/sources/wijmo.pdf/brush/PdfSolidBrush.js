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
        * Represents a brush used to fill an area with a color.
        */
        var PdfSolidBrush = (function (_super) {
            __extends(PdfSolidBrush, _super);
            /**
            * Initializes a new instance of the @see:PdfSolidBrush class.
            *
            * @param color The color of this brush. A @see:wijmo.Color object or any string
            * acceptable by the @see:wijmo.Color.fromString method.
            */
            function PdfSolidBrush(color) {
                _super.call(this);
                this.color = color || wijmo.Color.fromRgba(0, 0, 0);
            }
            Object.defineProperty(PdfSolidBrush.prototype, "color", {
                /**
                * Gets or sets the color of the brush.
                * The default color is black.
                */
                get: function () {
                    return this._color;
                },
                set: function (value) {
                    this._color = pdf._asColor(value);
                },
                enumerable: true,
                configurable: true
            });
            //#region overrides
            /**
            * Creates a copy of this @see:PdfSolidBrush.
            * @return A copy of this brush.
            */
            PdfSolidBrush.prototype.clone = function () {
                return new PdfSolidBrush(this._color);
            };
            /**
            * Determines whether the specified @see:PdfSolidBrush instance is equal
            * to the current one.
            *
            * @param value @see:PdfSolidBrush to compare.
            * @return true if the specified object is equal to the current one, otherwise false.
            */
            PdfSolidBrush.prototype.equals = function (value) {
                return ((value instanceof PdfSolidBrush)
                    && this._color.equals(value._color));
            };
            //#endregion
            PdfSolidBrush.prototype._getBrushObject = function (area) {
                // Using the non-native Color here because PDFKit doesn't has an appropriate structure that can represent a color with opacity. The PdfDocument's _setBrush and _setPen methods must take it into account.
                return this._color;
            };
            return PdfSolidBrush;
        }(pdf.PdfBrush));
        pdf.PdfSolidBrush = PdfSolidBrush;
    })(pdf = wijmo.pdf || (wijmo.pdf = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=PdfSolidBrush.js.map