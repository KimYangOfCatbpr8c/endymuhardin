var wijmo;
(function (wijmo) {
    var pdf;
    (function (pdf) {
        'use strict';
        /**
        * Represents the declarative content of the running title.
        */
        var PdfRunningTitleDeclarativeContent = (function () {
            /**
            * Initializes a new instance of the @see:PdfRunningTitleDeclarativeContent class.
            *
            * @param text The text of the running title.
            * @param font Font of the text.
            * @param brushOrColor The @see:PdfBrush or @see:wijmo.Color or any string acceptable
            * by the @see:wijmo.Color.fromString method used to fill the text.
            */
            function PdfRunningTitleDeclarativeContent(text, font, brushOrColor) {
                this.text = text || '';
                this.font = font || new pdf.PdfFont();
                this.brush = brushOrColor || new pdf.PdfSolidBrush();
            }
            Object.defineProperty(PdfRunningTitleDeclarativeContent.prototype, "font", {
                /**
                * Gets or sets the font of the @see:text.
                */
                get: function () {
                    return this._font;
                },
                set: function (value) {
                    value = pdf._asPdfFont(value, true);
                    this._font = value ? value.clone() : value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PdfRunningTitleDeclarativeContent.prototype, "text", {
                /**
                * Gets or sets the text of the running title.
                *
                * May contain up to 3 tabular characters ('\t') which are used for separating the text
                * into the parts that will be aligned within the page area using left, center and right
                * alignment.
                * Two kinds of macros are supported, '&[Page]' and '&[Pages]'. The former one designates
                * the current page index while the latter one designates the page count.
                *
                * For example, for the first page of a document having ten pages, the following string:
                * <pre>
                *    '&[Page]\\&[Pages]\theader\t&[Page]\\&[Pages]'
                * </pre>
                * will be translated to:
                * <pre>
                *    '1\10 header 1\10'
                * </pre>
                */
                get: function () {
                    return this._text;
                },
                set: function (value) {
                    this._text = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PdfRunningTitleDeclarativeContent.prototype, "brush", {
                /**
                * Gets or sets the brush used to fill the @see:text.
                */
                get: function () {
                    return this._brush;
                },
                set: function (value) {
                    value = pdf._asPdfBrush(value);
                    this._brush = value ? value.clone() : value;
                },
                enumerable: true,
                configurable: true
            });
            /**
            * Creates a copy of this @see:PdfRunningTitleDeclarativeContent.
            * @return A copy of this pen.
            */
            PdfRunningTitleDeclarativeContent.prototype.clone = function () {
                return new PdfRunningTitleDeclarativeContent(this.text, this.font, this.brush);
            };
            /**
            * Determines whether the specified @see:PdfRunningTitleDeclarativeContent instance
            * is equal to the current one.
            *
            * @param value @see:PdfRunningTitleDeclarativeContent to compare.
            * @return true if the specified object is equal to the current one, otherwise false.
            */
            PdfRunningTitleDeclarativeContent.prototype.equals = function (value) {
                return ((value instanceof PdfRunningTitleDeclarativeContent)
                    && (this._text === value.text)
                    && (this._brush ? this._brush.equals(value._brush) : this._brush === value._brush)
                    && (this._font ? this._font.equals(value._font) : this._font === value._font));
            };
            return PdfRunningTitleDeclarativeContent;
        }());
        pdf.PdfRunningTitleDeclarativeContent = PdfRunningTitleDeclarativeContent;
    })(pdf = wijmo.pdf || (wijmo.pdf = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=PdfRunningTitleDeclarativeContent.js.map