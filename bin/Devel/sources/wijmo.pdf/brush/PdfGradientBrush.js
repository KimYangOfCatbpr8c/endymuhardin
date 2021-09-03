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
        * Represents an abstract class that serves as a base class for the
        * @see:PdfLinearGradientBrush and @see:PdfRadialGradientBrush classes.
        *
        * This class is not intended to be instantiated in your code.
        */
        var PdfGradientBrush = (function (_super) {
            __extends(PdfGradientBrush, _super);
            /**
            * Initializes a new instance of the @see:PdfGradientBrush class.
            *
            * @param stops The @see:PdfGradientStop array to set on this brush.
            * @param opacity The opacity of this brush.
            */
            function PdfGradientBrush(stops, opacity) {
                _super.call(this);
                this.stops = stops || [];
                this.opacity = opacity == null ? 1 : opacity;
            }
            Object.defineProperty(PdfGradientBrush.prototype, "opacity", {
                /**
                * Gets or sets the opacity of the brush.
                * The value must be in range [0, 1], where 0 indicates that the brush is
                * completely transparent and 1 indicates that the brush is completely opaque.
                * The default value is 1.
                */
                get: function () {
                    return this._opacity;
                },
                set: function (value) {
                    this._opacity = wijmo.clamp(wijmo.asNumber(value, false, true), 0, 1);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PdfGradientBrush.prototype, "stops", {
                /**
                * Gets or sets an array of @see:PdfGradientStop objects representing a color,
                * offset and opacity within the brush's gradient axis.
                * The default value is an empty array.
                */
                get: function () {
                    return this._stops;
                },
                set: function (value) {
                    wijmo.assert(wijmo.isArray(value), pdf._Errors.InvalidArg('value'));
                    this._stops = this._cloneStopsArray(value);
                },
                enumerable: true,
                configurable: true
            });
            /**
            * Determines whether the specified @see:PdfGradientBrush instance is equal
            * to the current one.
            *
            * @param value @see:PdfGradientBrush to compare.
            * @return true if the specified object is equal to the current one, otherwise false.
            */
            PdfGradientBrush.prototype.equals = function (value) {
                return (value instanceof PdfGradientBrush)
                    && (this._opacity === value.opacity)
                    && pdf._compare(this._stops, value._stops);
            };
            //#region internal, private
            PdfGradientBrush.prototype._cloneStopsArray = function (value) {
                var res = [];
                for (var i = 0; i < value.length; i++) {
                    var stop = value[i];
                    wijmo.assert(stop instanceof pdf.PdfGradientStop, pdf._Errors.InvalidArg('stops[' + i + ']'));
                    res.push(value[i].clone());
                }
                return res;
            };
            return PdfGradientBrush;
        }(pdf.PdfBrush));
        pdf.PdfGradientBrush = PdfGradientBrush;
    })(pdf = wijmo.pdf || (wijmo.pdf = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=PdfGradientBrush.js.map