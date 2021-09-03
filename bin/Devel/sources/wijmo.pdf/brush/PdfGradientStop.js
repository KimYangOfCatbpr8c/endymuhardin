var wijmo;
(function (wijmo) {
    var pdf;
    (function (pdf) {
        'use strict';
        /**
        * Represents an object which determines a transition point of a gradient.
        */
        var PdfGradientStop = (function () {
            /**
            * Initializes a new instance of the @see:PdfGradientStop class.
            *
            * @param offset The location of the gradient stop on the gradient axis.
            * @param color The color of the gradient stop. A @see:wijmo.Color object or
            * any string acceptable by the @see:wijmo.Color.fromString method.
            * @param opacity The opacity of the gradient stop.
            */
            function PdfGradientStop(offset, color, opacity) {
                this.offset = offset || 0;
                this.color = color || wijmo.Color.fromRgba(0, 0, 0);
                this.opacity = opacity == null ? 1 : opacity;
            }
            Object.defineProperty(PdfGradientStop.prototype, "offset", {
                /**
                * Gets or sets the location of the gradient stop on gradient axis of the brush.
                * The value must be in range [0, 1], where 0 indicates that the gradient stop is
                * placed at the beginning of the gradient axis, while 1 indicates that the
                * gradient stop is placed at the end of the gradient axis.
                * The default value is 0.
                */
                get: function () {
                    return this._offset;
                },
                set: function (value) {
                    this._offset = wijmo.clamp(wijmo.asNumber(value, false, true), 0, 1);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PdfGradientStop.prototype, "color", {
                /**
                * Gets or sets the color of the gradient stop.
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
            Object.defineProperty(PdfGradientStop.prototype, "opacity", {
                /**
                * Gets or sets the opacity of the gradient stop.
                * The value must be in range [0, 1], where 0 indicates that the gradient stop is
                * completely transparent, while 1 indicates that the gradient stop is completely
                * opaque. The default value is 1.
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
            /**
            * Creates a copy of this @see:PdfGradientStop.
            * @return A copy of this gradient stop.
            */
            PdfGradientStop.prototype.clone = function () {
                return new PdfGradientStop(this.offset, this.color, this.opacity);
            };
            /**
            * Determines whether the specified @see:PdfGradientStop instance is equal to
            * the current one.
            *
            * @param value @see:PdfGradientStop to compare.
            * @return true if the specified object is equal to the current one, otherwise false.
            */
            PdfGradientStop.prototype.equals = function (value) {
                return ((value instanceof PdfGradientStop)
                    && (this._offset === value._offset)
                    && this._color.equals(value._color)
                    && (this._opacity === value._opacity));
            };
            return PdfGradientStop;
        }());
        pdf.PdfGradientStop = PdfGradientStop;
    })(pdf = wijmo.pdf || (wijmo.pdf = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=PdfGradientStop.js.map