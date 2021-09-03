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
        * Represents a brush used to fill an area with a linear gradient.
        */
        var PdfLinearGradientBrush = (function (_super) {
            __extends(PdfLinearGradientBrush, _super);
            /**
            * Initializes a new instance of the @see:PdfLinearGradientBrush class.
            *
            * @param x1 The X-coordinate of the starting point of the linear gradient.
            * @param y1 The Y-coordinate of the starting point of the linear gradient.
            * @param x2 The X-coordinate of the ending point of the linear gradient.
            * @param y2 The Y-coordinate of the ending point of the linear gradient.
            * @param stops The @see:PdfGradientStop array to set on this brush.
            * @param opacity The opacity of this brush.
            */
            function PdfLinearGradientBrush(x1, y1, x2, y2, stops, opacity) {
                _super.call(this, stops, opacity);
                this.x1 = x1;
                this.y1 = y1;
                this.x2 = x2;
                this.y2 = y2;
            }
            Object.defineProperty(PdfLinearGradientBrush.prototype, "x1", {
                /**
                * Gets or sets the X-coordinate of the starting point of the linear gradient,
                * in page area coordinates, in points.
                */
                get: function () {
                    return this._x1;
                },
                set: function (value) {
                    this._x1 = wijmo.asNumber(value, false, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PdfLinearGradientBrush.prototype, "y1", {
                /**
                * Gets or sets the Y-coordinate of the starting point of the linear gradient,
                * in page area coordinates, in points.
                */
                get: function () {
                    return this._y1;
                },
                set: function (value) {
                    this._y1 = wijmo.asNumber(value, false, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PdfLinearGradientBrush.prototype, "x2", {
                /**
                * Gets or sets the X-coordinate of the ending point of the linear gradient,
                * in page area coordinates, in points.
                */
                get: function () {
                    return this._x2;
                },
                set: function (value) {
                    this._x2 = wijmo.asNumber(value, false, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PdfLinearGradientBrush.prototype, "y2", {
                /**
                * Gets or sets the Y-coordinate of the ending point of the linear gradient,
                * in page area coordinates, in points.
                */
                get: function () {
                    return this._y2;
                },
                set: function (value) {
                    this._y2 = wijmo.asNumber(value, false, true);
                },
                enumerable: true,
                configurable: true
            });
            //#region overrides
            /**
            * Creates a copy of this @see:PdfLinearGradientBrush.
            * @return A copy of this brush.
            */
            PdfLinearGradientBrush.prototype.clone = function () {
                return new PdfLinearGradientBrush(this._x1, this._y1, this._x2, this._y2, this.stops, this.opacity);
            };
            /**
            * Determines whether the specified @see:PdfLinearGradientBrush instance is equal to
            * the current one.
            *
            * @param value @see:PdfLinearGradientBrush to compare.
            * @return true if the specified object is equal to the current one, otherwise false.
            */
            PdfLinearGradientBrush.prototype.equals = function (value) {
                return (value instanceof PdfLinearGradientBrush)
                    && (this._x1 === value._x1)
                    && (this._y1 === value._y1)
                    && (this._x2 === value._x2)
                    && (this._y2 === value._y2)
                    && _super.prototype.equals.call(this, value);
            };
            PdfLinearGradientBrush.prototype._getBrushObject = function (area) {
                var g = area._pdfdoc._document.linearGradient(this._x1 + area._offset.x, this._y1 + area._offset.y, this._x2 + area._offset.x, this._y2 + area._offset.y), stops = this.stops;
                for (var i = 0; i < stops.length; i++) {
                    var s = stops[i];
                    if (s) {
                        g.stop(s.offset, [s.color.r, s.color.g, s.color.b], s.color.a);
                    }
                }
                return g;
            };
            return PdfLinearGradientBrush;
        }(pdf.PdfGradientBrush));
        pdf.PdfLinearGradientBrush = PdfLinearGradientBrush;
    })(pdf = wijmo.pdf || (wijmo.pdf = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=PdfLinearGradientBrush.js.map