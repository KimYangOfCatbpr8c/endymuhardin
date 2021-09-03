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
        * Represents a running title of the page, like header and footer.
        *
        * This class is not intended to be instantiated in your code.
        */
        var PdfRunningTitle = (function (_super) {
            __extends(PdfRunningTitle, _super);
            /**
            * Initializes a new instance of the @see:PdfRunningTitle class.
            *
            * @param options An optional object containing initialization settings.
            */
            function PdfRunningTitle(options) {
                _super.call(this);
                this._height = 24;
                this._declarative = new pdf.PdfRunningTitleDeclarativeContent();
                this._heightChanged = new wijmo.Event();
                wijmo.copy(this, options);
            }
            Object.defineProperty(PdfRunningTitle.prototype, "declarative", {
                //#region public properties
                /**
                * Gets or sets an object that provides the ability to setup the running title
                * content declaratively.
                */
                get: function () {
                    return this._declarative;
                },
                set: function (value) {
                    if (value != null) {
                        wijmo.assert(value instanceof pdf.PdfRunningTitleDeclarativeContent, pdf._Errors.InvalidArg('value'));
                        value = value.clone();
                    }
                    this._declarative = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PdfRunningTitle.prototype, "height", {
                /**
                * Gets or sets the height of the running title, in points.
                * To hide the running title, set this property to 0.
                * Changing this property has no effect on previous drawings; they will not be resized
                * or clipped.
                *
                * The default value is 24.
                */
                get: function () {
                    return this._height;
                },
                set: function (value) {
                    if (value !== this._height) {
                        this._height = wijmo.asNumber(value, false, true);
                        this._heightChanged.raise(this, wijmo.EventArgs.empty);
                    }
                },
                enumerable: true,
                configurable: true
            });
            //#endregion
            //#region public methods
            // overrides
            PdfRunningTitle.prototype.drawText = function (text, x, y, options) {
                options = options || {};
                // To be able to draw below the page bottom margin without adding a new page automatically, header and footer are positioned outside the native page margins.
                options.height = Infinity;
                return _super.prototype.drawText.call(this, text, x, y, options);
            };
            return PdfRunningTitle;
        }(pdf.PdfPageArea));
        pdf.PdfRunningTitle = PdfRunningTitle;
    })(pdf = wijmo.pdf || (wijmo.pdf = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=PdfRunningTitle.js.map