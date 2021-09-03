var wijmo;
(function (wijmo) {
    var pdf;
    (function (pdf) {
        'use strict';
        /**
         * Represents a font.
         */
        var PdfFont = (function () {
            /**
            * Initializes a new instance of the @see:PdfFont class.
            *
            * @param family The family name of the font.
            * @param size The size of the font.
            * @param style The style of the font.
            * @param weight The weight of the font.
            */
            function PdfFont(family, size, style, weight) {
                if (family === void 0) { family = 'times'; }
                if (size === void 0) { size = 10; }
                if (style === void 0) { style = 'normal'; }
                if (weight === void 0) { weight = 'normal'; }
                this.family = family;
                this.size = size;
                this.style = style;
                this.weight = weight;
            }
            Object.defineProperty(PdfFont.prototype, "family", {
                /**
                * Gets or sets the family name of the font.
                *
                * The list of the font family names in the order of preferences,
                * separated by commas. Each font family name can be the one that
                * was registered using the @see:PdfDocument.registerFont method or
                * the name of one of the PDF standard font families: 'courier',
                * 'helvetica', 'symbol', 'times', 'zapfdingbats' or the superfamily
                * name: 'cursive', 'fantasy', 'monospace', 'serif', 'sans-serif'.
                */
                get: function () {
                    return this._family;
                },
                set: function (value) {
                    this._family = wijmo.asString(value, false);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PdfFont.prototype, "size", {
                /**
                * Gets or sets the size of the font.
                */
                get: function () {
                    return this._size;
                },
                set: function (value) {
                    this._size = wijmo.asNumber(value, false, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PdfFont.prototype, "style", {
                /**
                 * Gets or sets the style of the font.
                 *
                 * The following values are supported: 'normal', 'italic', 'oblique'.
                 */
                get: function () {
                    return this._style;
                },
                set: function (value) {
                    value = wijmo.asString(value, false);
                    if (value) {
                        wijmo.assert(!!PdfFont._KNOWN_STYLES[(value || '').toLowerCase()], pdf._Errors.InvalidArg('value'));
                    }
                    this._style = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PdfFont.prototype, "weight", {
                /**
                 * Gets or sets the weight of the font.
                 *
                 * The following values are supported: 'normal', 'bold', '100', '200', '300',
                 * '400', '500', '600', '700', '800', '900'.
                 */
                get: function () {
                    return this._weight;
                },
                set: function (value) {
                    value = wijmo.asString(value, false);
                    if (value) {
                        wijmo.assert(!!PdfFont._KNOWN_WEIGHTS[(value || '').toLowerCase()], pdf._Errors.InvalidArg('value'));
                    }
                    this._weight = value;
                },
                enumerable: true,
                configurable: true
            });
            /**
            * Creates a copy of this @see:PdfFont.
            * @return A copy of this font.
            */
            PdfFont.prototype.clone = function () {
                return new PdfFont(this.family, this.size, this.style, this.weight);
            };
            /**
            * Determines whether the specified @see:PdfFont instance is equal to the current one.
            *
            * @param value @see:PdfFont to compare.
            * @return true if the specified object is equal to the current one, otherwise false.
            */
            PdfFont.prototype.equals = function (value) {
                return (value instanceof PdfFont)
                    && (this._family === value._family)
                    && (this._size === value._size)
                    && (this._style === value._style)
                    && (this._weight === value._weight);
            };
            PdfFont._DEF_NATIVE_NAME = 'Times-Roman';
            PdfFont._DEF_FAMILY_NAME = 'times';
            PdfFont._KNOWN_WEIGHTS = {
                'normal': 1, 'bold': 1, '100': 1, '200': 1, '300': 1, '400': 1, '500': 1, '600': 1, '700': 1, '800': 1, '900': 1
            };
            PdfFont._KNOWN_STYLES = {
                'normal': 1, 'italic': 1, 'oblique': 1
            };
            PdfFont._DEF_PDFKIT_FONT = new PdfFont('helvetica', 12);
            PdfFont._DEF_FONT = new PdfFont();
            return PdfFont;
        }());
        pdf.PdfFont = PdfFont;
    })(pdf = wijmo.pdf || (wijmo.pdf = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=PdfFont.js.map