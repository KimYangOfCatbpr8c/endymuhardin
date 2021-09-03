var wijmo;
(function (wijmo) {
    var pdf;
    (function (pdf) {
        'use strict';
        /**
         * Represents the dash pattern used to stroke paths.
         */
        var PdfDashPattern = (function () {
            /**
            * Initializes a new instance of the @see:PdfDashPattern class.
            *
            * @param dash The length of alternating dashes, in points.
            * @param gap The length of alternating gaps, in points.
            * @param phase The distance in the dash pattern to start the dash at, in points.
            */
            function PdfDashPattern(dash, gap, phase) {
                if (dash === void 0) { dash = null; }
                if (gap === void 0) { gap = dash; }
                if (phase === void 0) { phase = 0; }
                this.dash = dash;
                this.gap = gap;
                this.phase = phase;
            }
            Object.defineProperty(PdfDashPattern.prototype, "dash", {
                /**
                * Gets or sets the length of alternating dashes, in points.
                * The default value is null which indicates no dash pattern, but a solid line.
                */
                get: function () {
                    return this._dash;
                },
                set: function (value) {
                    this._dash = wijmo.asNumber(value, true, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PdfDashPattern.prototype, "gap", {
                /**
                * Gets or sets the length of alternating gaps, in points.
                * The default value is equal to @see:dash which indicates that dashes and gaps will
                * have the same length.
                */
                get: function () {
                    return this._gap;
                },
                set: function (value) {
                    this._gap = wijmo.asNumber(value, true, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PdfDashPattern.prototype, "phase", {
                /**
                * Gets or sets the distance in the dash pattern to start the dash at, in points.
                * The default value is 0.
                */
                get: function () {
                    return this._phase;
                },
                set: function (value) {
                    this._phase = wijmo.asNumber(value, false, true);
                },
                enumerable: true,
                configurable: true
            });
            /**
            * Creates a copy of this @see:PdfDashPattern.
            * @return A copy of this dash pattern.
            */
            PdfDashPattern.prototype.clone = function () {
                return new PdfDashPattern(this._dash, this._gap, this._phase);
            };
            /**
            * Determines whether the specified @see:PdfDashPattern instance is equal
            * to the current one.
            *
            * @param value @see:PdfDashPattern to compare.
            * @return true if the specified object is equal to the current one, otherwise false.
            */
            PdfDashPattern.prototype.equals = function (value) {
                return ((value instanceof PdfDashPattern)
                    && (this._dash === value.dash)
                    && (this._gap === value.gap)
                    && (this._phase === value.phase));
            };
            return PdfDashPattern;
        }());
        pdf.PdfDashPattern = PdfDashPattern;
    })(pdf = wijmo.pdf || (wijmo.pdf = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=PdfDashPattern.js.map