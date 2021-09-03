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
        * Represents a brush used to fill an area with a radial gradient.
        */
        var PdfRadialGradientBrush = (function (_super) {
            __extends(PdfRadialGradientBrush, _super);
            /**
            * Initializes a new instance of the @see:PdfRadialGradientBrush class.
            *
            * @param x1 The X-coordinate of the inner circle's center of the radial gradient.
            * @param y1 The Y-coordinate of the inner circle's center of the radial gradient.
            * @param r1 The radius of the inner circle of the radial gradient.
            * @param x2 The X-coordinate of the outer circle's center of the radial gradient.
            * @param y2 The Y-coordinate of the outer circle's center of the radial gradient.
            * @param r2 The radius of the outer circle of the radial gradient.
            * @param stops The @see:PdfGradientStop array to set on this brush.
            * @param opacity The opacity of this brush.
            */
            function PdfRadialGradientBrush(x1, y1, r1, x2, y2, r2, stops, opacity) {
                _super.call(this, stops, opacity);
                this.x1 = x1;
                this.y1 = y1;
                this.r1 = r1;
                this.x2 = x2;
                this.y2 = y2;
                this.r2 = r2;
            }
            Object.defineProperty(PdfRadialGradientBrush.prototype, "x1", {
                //#region inner point
                /**
                * Gets or sets the X-coordinate of the inner circle's center that represents the
                * starting point of the radial gradient, in page area coordinates, in points.
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
            Object.defineProperty(PdfRadialGradientBrush.prototype, "y1", {
                /**
                * Gets or sets the Y-coordinate of the inner circle's center that represents the
                * starting point of the radial gradient, in page area coordinates, in points.
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
            Object.defineProperty(PdfRadialGradientBrush.prototype, "r1", {
                get: function () {
                    return this._r1;
                },
                /**
                * Gets or sets the radius of the inner circle that represents the starting
                * point of the radial gradient, in page area coordinates, in points.
                */
                set: function (value) {
                    this._r1 = wijmo.asNumber(value, false, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PdfRadialGradientBrush.prototype, "x2", {
                //#endregion
                //#region outer point
                /**
                * Gets or sets the X-coordinate of the outer circle's center that represents the ending point of the radial gradient, in page area coordinates, in points.
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
            Object.defineProperty(PdfRadialGradientBrush.prototype, "y2", {
                /**
                * Gets or sets the Y-coordinate of the outer circle's center that represents
                * the ending point of the radial gradient, in page area coordinates, in points.
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
            Object.defineProperty(PdfRadialGradientBrush.prototype, "r2", {
                /**
                * Gets or sets the radius of the outer circle that represents the ending point of the
                * radial gradient, in page area coordinates, in points.
                */
                get: function () {
                    return this._r2;
                },
                set: function (value) {
                    this._r2 = wijmo.asNumber(value, false, true);
                },
                enumerable: true,
                configurable: true
            });
            //#endregion
            //#region overrides
            /**
            * Creates a copy of this @see:PdfRadialGradientBrush.
            * @return A copy of this brush.
            */
            PdfRadialGradientBrush.prototype.clone = function () {
                return new PdfRadialGradientBrush(this._x1, this._y1, this._r1, this._x2, this._y2, this._r2, this.stops, this.opacity);
            };
            /**
            * Determines whether the specified @see:PdfRadialGradientBrush instance is equal
            * to the current one.
            *
            * @param value @see:PdfRadialGradientBrush to compare.
            * @return true if the specified object is equal to the current one, otherwise false.
            */
            PdfRadialGradientBrush.prototype.equals = function (value) {
                return (value instanceof PdfRadialGradientBrush)
                    && (this._x1 === value._x1)
                    && (this._y1 === value._y1)
                    && (this._r1 === value._r1)
                    && (this._x2 === value._x2)
                    && (this._y2 === value._y2)
                    && (this._r2 === value._r2)
                    && _super.prototype.equals.call(this, value);
            };
            PdfRadialGradientBrush.prototype._getBrushObject = function (area) {
                var g = area._pdfdoc._document.radialGradient(this._x1 + area._offset.x, this._y2 + area._offset.y, this._r1, this._x2 + area._offset.x, this._y2 + area._offset.y, this._r2), stops = this.stops;
                for (var i = 0; i < stops.length; i++) {
                    var s = stops[i];
                    if (s) {
                        g.stop(s.offset, [s.color.r, s.color.g, s.color.b], s.color.a);
                    }
                }
                return g;
            };
            return PdfRadialGradientBrush;
        }(pdf.PdfGradientBrush));
        pdf.PdfRadialGradientBrush = PdfRadialGradientBrush;
    })(pdf = wijmo.pdf || (wijmo.pdf = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=PdfRadialGradientBrush.js.map