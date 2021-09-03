var wijmo;
(function (wijmo) {
    var pdf;
    (function (pdf) {
        'use strict';
        /**
         * Determines an object used to stroke paths and text.
         */
        var PdfPen = (function () {
            /**
            * Initializes a new instance of the @see:PdfPen class with the specified color or
            * brush or JavaScript object.
            *
            * The first argument can accept the following values:
            * <ul>
            *  <li>@see:wijmo.Color object or any string acceptable by the @see:wijmo.Color.fromString method.</li>
            *  <li>@see:PdfBrush object.</li>
            *  <li>JavaScript object containing initialization properties (all other arguments are ignored).</li>
            * </ul>
            *
            * @param colorOrBrushOrOptions The color or brush or JavaScript object to use.
            * @param width The width to use.
            * @param dashPattern The dash pattern to use.
            * @param cap The line cap style to use.
            * @param join The line join style to use.
            * @param miterLimit The miter limit to use.
            */
            function PdfPen(colorOrBrushOrOptions, width, dashPattern, cap, join, miterLimit) {
                // Default arguments values are taken from the PDF Reference 1.7, chapter 4.3, 'Device-independent graphics state parameters'.
                if (colorOrBrushOrOptions == null) {
                    colorOrBrushOrOptions = wijmo.Color.fromRgba(0, 0, 0);
                }
                if (width == null) {
                    width = 1;
                }
                if (dashPattern == null) {
                    dashPattern = new pdf.PdfDashPattern(null, null, 0);
                }
                if (cap == null) {
                    cap = pdf.PdfLineCapStyle.Butt;
                }
                if (join == null) {
                    join = pdf.PdfLineJoinStyle.Miter;
                }
                if (miterLimit == null) {
                    miterLimit = 10;
                }
                if (wijmo.isObject(colorOrBrushOrOptions) && !(colorOrBrushOrOptions instanceof wijmo.Color) && !(colorOrBrushOrOptions instanceof pdf.PdfBrush)) {
                    var foo = colorOrBrushOrOptions;
                    this.color = foo.color;
                    this.brush = foo.brush;
                    this.width = foo.width != null ? foo.width : width;
                    this.cap = foo.cap != null ? foo.cap : cap;
                    this.join = foo.join != null ? foo.join : join;
                    this.miterLimit = foo.miterLimit != null ? foo.miterLimit : miterLimit;
                    this.dashPattern = foo.dashPattern || dashPattern;
                }
                else {
                    if (colorOrBrushOrOptions instanceof pdf.PdfBrush) {
                        this.brush = colorOrBrushOrOptions;
                    }
                    else {
                        this.color = colorOrBrushOrOptions;
                    }
                    this.width = width;
                    this.cap = cap;
                    this.join = join;
                    this.miterLimit = miterLimit;
                    this.dashPattern = dashPattern;
                }
                this._color = this._color || wijmo.Color.fromRgba(0, 0, 0);
            }
            Object.defineProperty(PdfPen.prototype, "color", {
                /**
                * Gets or sets the color used to stroke paths.
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
            Object.defineProperty(PdfPen.prototype, "brush", {
                /**
                * Gets or sets the brush used to stroke paths.
                * Takes precedence over the @see:color property, if defined.
                */
                get: function () {
                    return this._brush;
                },
                set: function (value) {
                    value = pdf._asPdfBrush(value, true);
                    this._brush = value ? value.clone() : null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PdfPen.prototype, "width", {
                /**
                * Gets or sets the line width used to stroke paths, in points.
                * The default width is 1.
                */
                get: function () {
                    return this._width;
                },
                set: function (value) {
                    this._width = wijmo.asNumber(value, false, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PdfPen.prototype, "cap", {
                /**
                * Gets or sets the shape that shall be used at the open ends of a stroked path.
                * The default value is <b>Butt</b>.
                */
                get: function () {
                    return this._cap;
                },
                set: function (value) {
                    this._cap = wijmo.asEnum(value, pdf.PdfLineCapStyle);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PdfPen.prototype, "join", {
                /**
                * Gets or sets the shape to be used at the corners of a stroked path.
                * The default value is <b>Miter</b>.
                */
                get: function () {
                    return this._join;
                },
                set: function (value) {
                    this._join = wijmo.asEnum(value, pdf.PdfLineJoinStyle);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PdfPen.prototype, "miterLimit", {
                /**
                * Determines the maximum value of the miter length to the line width ratio, when the line
                * join is converted from miter to bevel.
                * The default value is 10.
                */
                get: function () {
                    return this._miterLimit;
                },
                set: function (value) {
                    this._miterLimit = wijmo.asNumber(value, false, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PdfPen.prototype, "dashPattern", {
                /**
                * Gets the dash pattern used to stroke paths.
                * The default value is a solid line.
                */
                get: function () {
                    return this._dashPattern;
                },
                set: function (value) {
                    wijmo.assert(value instanceof pdf.PdfDashPattern, pdf._Errors.InvalidArg('value'));
                    this._dashPattern = value.clone();
                },
                enumerable: true,
                configurable: true
            });
            /**
            * Creates a copy of this @see:PdfPen.
            * @return A copy of this pen.
            */
            PdfPen.prototype.clone = function () {
                var pen = new PdfPen(this._color, this._width, this._dashPattern, this._cap, this._join, this._miterLimit);
                pen.brush = this._brush;
                return pen;
            };
            /**
            * Determines whether the specified @see:PdfPen instance is equal to the current one.
            *
            * @param value @see:PdfPen to compare.
            * @return true if the specified object is equal to the current one, otherwise false.
            */
            PdfPen.prototype.equals = function (value) {
                return ((value instanceof PdfPen)
                    && this._color.equals(value._color)
                    && (this._brush ? this._brush.equals(value._brush) : this._brush === value._brush)
                    && (this._width === value._width)
                    && (this._cap === value._cap)
                    && (this._join === value._join)
                    && (this._miterLimit === value._miterLimit)
                    && this._dashPattern.equals(value._dashPattern));
            };
            return PdfPen;
        }());
        pdf.PdfPen = PdfPen;
    })(pdf = wijmo.pdf || (wijmo.pdf = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=PdfPen.js.map