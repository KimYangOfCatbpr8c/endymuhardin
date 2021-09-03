var wijmo;
(function (wijmo) {
    var pdf;
    (function (pdf) {
        'use strict';
        /**
        * Provides methods for creating graphics paths and drawing them or using them for clipping.
        *
        * Path creation method calls must be finished with the @see:PdfPaths.stroke,
        * @see:PdfPaths.fill, @see:PdfPaths.fillAndStroke or @see:PdfPaths.clip method.
        * Any document methods which don't apply directly to path creation/ drawing/ clipping
        * (changing a pen, drawing a text, saving the graphics state etc) are prohibited to use
        * until the path is finished.
        * The @see:PdfPaths.lineTo, @see:PdfPaths.bezierCurveTo and @see:PdfPaths.quadraticCurveTo
        * methods should not start the path, they must be preceded with the @see:PdfPaths.moveTo.
        *
        * The methods are chainable:
        * <pre>
        * doc.paths.moveTo(0, 0).lineTo(100, 100).stroke();
        * </pre>
        *
        * This class is not intended to be instantiated in your code.
        */
        var PdfPaths = (function () {
            /**
            * Initializes a new instance of the @see:PdfPaths class.
            *
            * @param doc Document.
            * @param offset Offset.
            */
            function PdfPaths(doc, offset) {
                this._pathBuffer = [];
                this._doc = doc;
                this._offset = offset;
            }
            //#region public
            /**
            * Sets a new current point.
            *
            * @param x The X-coordinate of the new point, in points.
            * @param y The Y-coordinate of the new point, in points.
            * @return The @see:PdfPaths object.
            */
            PdfPaths.prototype.moveTo = function (x, y) {
                this._pathBuffer.push({
                    func: this._doc._document.moveTo,
                    params: [wijmo.asNumber(x) + this._offset.x, wijmo.asNumber(y) + this._offset.y]
                });
                return this;
            };
            /**
            * Draws a line from the current point to a new point.
            *
            * The new current point is (x, y).
            *
            * @param x The X-coordinate of the new point, in points.
            * @param y The Y-coordinate of the new point, in points.
            * @return The @see:PdfPaths object.
            */
            PdfPaths.prototype.lineTo = function (x, y) {
                this._pathBuffer.push({
                    func: this._doc._document.lineTo,
                    params: [wijmo.asNumber(x) + this._offset.x, wijmo.asNumber(y) + this._offset.y]
                });
                return this;
            };
            /**
            * Draws a quadratic curve from the current point to a new point using the current point
            * and (cpx, cpy) as the control points.
            *
            * The new current point is (x, y).
            *
            * @param cpx The X-coordinate of the control point, in points.
            * @param cpy The Y-coordinate of the control point, in points.
            * @param x The X-coordinate of the new point, in points.
            * @param y The Y-coordinate of the new point, in points.
            * @return The @see:PdfPaths object.
            */
            PdfPaths.prototype.quadraticCurveTo = function (cpx, cpy, x, y) {
                this._pathBuffer.push({
                    func: this._doc._document.quadraticCurveTo,
                    params: [
                        wijmo.asNumber(cpx) + this._offset.x,
                        wijmo.asNumber(cpy) + this._offset.y,
                        wijmo.asNumber(x) + this._offset.x,
                        wijmo.asNumber(y) + this._offset.y
                    ]
                });
                return this;
            };
            /**
            * Draws a bezier curve from the current point to a new point using the (cp1x, cp1y)
            * and (cp2x, cp2y) as the control points.
            *
            * The new current point is (x, y).
            *
            * @param cp1x The X-coordinate of the first control point, in points.
            * @param cp1y The Y-coordinate of the first control point, in points.
            * @param cp2x The X-coordinate of the second control point, in points.
            * @param cp2y The Y-coordinate of the second control point, in points.
            * @param x The X-coordinate of the new point, in points.
            * @param y The Y-coordinate of the new point, in points.
            * @return The @see:PdfPaths object.
            */
            PdfPaths.prototype.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
                this._pathBuffer.push({
                    func: this._doc._document.bezierCurveTo,
                    params: [
                        wijmo.asNumber(cp1x) + this._offset.x,
                        wijmo.asNumber(cp1y) + this._offset.y,
                        wijmo.asNumber(cp2x) + this._offset.x,
                        wijmo.asNumber(cp2y) + this._offset.y,
                        wijmo.asNumber(x) + this._offset.x,
                        wijmo.asNumber(y) + this._offset.y
                    ]
                });
                return this;
            };
            /**
            * Draws a SVG 1.1 path.
            *
            * @param path The SVG path to draw.
            * @return The @see:PdfPaths object.
            */
            PdfPaths.prototype.svgPath = function (path) {
                if (path) {
                    var updatedPath = pdf._PdfSvgPathHelper.offset(wijmo.asString(path), this._offset);
                    this._pathBuffer.push({
                        func: this._doc._document.path,
                        params: [wijmo.asString(updatedPath)]
                    });
                }
                return this;
            };
            /**
            * Closes the current path and draws a line from the current point to the initial
            * point of the current path.
            *
            * @return The @see:PdfPaths object.
            */
            PdfPaths.prototype.closePath = function () {
                this._writePathBuffer();
                this._doc._document.closePath();
                return this;
            };
            /**
            * Draws a rectangle.
            *
            * @param x The X-coordinate of the topleft corner of the rectangle, in points.
            * @param y The Y-coordinate of the topleft corner of the rectangle, in points.
            * @param width The width of the rectangle, in points.
            * @param height The width of the rectangle, in points.
            * @return The @see:PdfPaths object.
            */
            PdfPaths.prototype.rect = function (x, y, width, height) {
                this._pathBuffer.push({
                    func: this._doc._document.rect,
                    params: [
                        wijmo.asNumber(x) + this._offset.x,
                        wijmo.asNumber(y) + this._offset.y,
                        wijmo.asNumber(width, false, true),
                        wijmo.asNumber(height, false, true)
                    ]
                });
                return this;
            };
            /**
            * Draws a rounded rectangle.
            *
            * @param x The X-coordinate of the upper-left corner of the rectangle, in points.
            * @param y The Y-coordinate of the upper-left corner of the rectangle, in points.
            * @param width The width of the rectangle, in points.
            * @param height The width of the rectangle, in points.
            * @param cornerRadius The corner radius of the rectangle, in points. The default value is 0.
            * @return The @see:PdfPaths object.
            */
            PdfPaths.prototype.roundedRect = function (x, y, width, height, cornerRadius) {
                if (cornerRadius === void 0) { cornerRadius = 0; }
                this._pathBuffer.push({
                    func: this._doc._document.roundedRect,
                    params: [
                        wijmo.asNumber(x) + this._offset.x,
                        wijmo.asNumber(y) + this._offset.y,
                        wijmo.asNumber(width, false, true),
                        wijmo.asNumber(height, false, true),
                        wijmo.asNumber(cornerRadius, false, true)
                    ]
                });
                return this;
            };
            /**
            * Draws an ellipse.
            *
            * @param x The X-coordinate of the center of the ellipse, in points.
            * @param y The Y-coordinate of the center of the ellipse, in points.
            * @param radiusX The radius of the ellipse along the X-axis, in points.
            * @param radiusY The radius of the ellipse along the Y-axis, in points.
            * If it is not provided, then it is assumed to be equal to radiusX.
            * @return The @see:PdfPaths object.
            */
            PdfPaths.prototype.ellipse = function (x, y, radiusX, radiusY) {
                if (radiusY === void 0) { radiusY = radiusX; }
                this._pathBuffer.push({
                    func: this._doc._document.ellipse,
                    params: [
                        wijmo.asNumber(x) + this._offset.x,
                        wijmo.asNumber(y) + this._offset.y,
                        wijmo.asNumber(radiusX, false, true),
                        wijmo.asNumber(radiusY, false, true)
                    ]
                });
                return this;
            };
            /**
            * Draws a circle.
            *
            * @param x The X-coordinate of the center of the circle, in points.
            * @param y The Y-coordinate of the center of the circle, in points.
            * @param radius The radius of the circle, in points.
            * @return The @see:PdfPaths object.
            */
            PdfPaths.prototype.circle = function (x, y, radius) {
                this._pathBuffer.push({
                    func: this._doc._document.circle,
                    params: [
                        wijmo.asNumber(x) + this._offset.x,
                        wijmo.asNumber(y) + this._offset.y,
                        wijmo.asNumber(radius, false, true)
                    ]
                });
                return this;
            };
            /**
            * Draws a polygon using a given points array.
            *
            * @param points An array of two-elements arrays [x, y] specifying
            * the X and Y coordinates of the point, in points.
            * @return The @see:PdfPaths object.
            */
            PdfPaths.prototype.polygon = function (points) {
                if (points) {
                    for (var i = 0; i < points.length; i++) {
                        var pnt = points[i];
                        pnt[0] = pnt[0] + this._offset.x;
                        pnt[1] = pnt[1] + this._offset.y;
                    }
                }
                this._pathBuffer.push({
                    func: this._doc._document.polygon,
                    params: points
                });
                return this;
            };
            /**
            * Creates a clipping path used to limit the regions of the page affected by
            * painting operators.
            *
            * @param rule The fill rule to use.
            * @return The @see:PdfPaths object.
            */
            PdfPaths.prototype.clip = function (rule) {
                if (rule === void 0) { rule = pdf.PdfFillRule.NonZero; }
                this._writePathBuffer();
                this._doc._document.clip(rule === pdf.PdfFillRule.EvenOdd ? 'even-odd' : 'non-zero');
                return this;
            };
            /**
            * Fills the path with the specified brush and rule.
            * If brush is not specified, then the default document brush will be used
            * (see the @see:PdfDocument.setBrush method).
            *
            * The brushOrColor argument can accept the following values:
            * <ul>
            *   <li>A @see:PdfBrush object.</li>
            *   <li>
            *     A @see:wijmo.Color object or any string acceptable by the @see:wijmo.Color.fromString method.
            *     In this case, the @see:PdfBrush object with the specified color will be created internally.
            *    </li>
            * </ul>
            *
            * @param brushOrColor The brush or color to use.
            * @param rule The fill rule to use.
            * @return The @see:PdfPaths object.
            */
            PdfPaths.prototype.fill = function (brushOrColor, rule) {
                this._doc._toggleBrush(pdf._asPdfBrush(brushOrColor));
                this._writePathBuffer();
                this._doc._document.fill(rule === pdf.PdfFillRule.EvenOdd ? 'even-odd' : 'non-zero');
                return this;
            };
            /**
            * Fills and strokes the path with the specified brush, pen and rule.
            * If brush and pen is not specified, then the default document brush and pen will
            * be used (See the @see:PdfDocument.setBrush, @see:PdfDocument.setPen methods).
            *
            * The brushOrColor argument can accept the following values:
            * <ul>
            *   <li>A @see:PdfBrush object.</li>
            *   <li>
            *     A @see:wijmo.Color object or any string acceptable by the @see:wijmo.Color.fromString method.
            *     In this case, the @see:PdfBrush object with the specified color will be created internally.
            *    </li>
            * </ul>
            *
            * The penOrColor argument can accept the following values:
            * <ul>
            *   <li>A @see:PdfPen object.</li>
            *   <li>
            *     A @see:wijmo.Color object or any string acceptable by the @see:wijmo.Color.fromString method.
            *     In this case, the @see:PdfPen object with the specified color will be created internally.
            *   </li>
            * </ul>
            *
            * @param brushOrColor The brush or color to use.
            * @param penOrColor The pen or color to use.
            * @param rule The fill rule to use.
            * @return The @see:PdfPaths object.
            */
            PdfPaths.prototype.fillAndStroke = function (brushOrColor, penOrColor, rule) {
                this._doc._toggleBrush(pdf._asPdfBrush(brushOrColor));
                this._doc._togglePen(pdf._asPdfPen(penOrColor));
                this._writePathBuffer();
                this._doc._document.fillAndStroke(rule === pdf.PdfFillRule.EvenOdd ? 'even-odd' : 'non-zero');
                return this;
            };
            /**
            * Strokes the path with the specified pen.
            * If pen is not specified, then the default document pen will be used
            * (See the @see:PdfDocument.setPen method).
            *
            * The penOrColor argument can accept the following values:
            * <ul>
            *   <li>A @see:PdfPen object.</li>
            *   <li>
            *     A @see:wijmo.Color object or any string acceptable by the @see:wijmo.Color.fromString method.
            *     In this case, the @see:PdfPen object with the specified color will be created internally.
            *   </li>
            * </ul>
            *
            * @param penOrColor The pen or color to use.
            * @return The @see:PdfPaths object.
            */
            PdfPaths.prototype.stroke = function (penOrColor) {
                this._doc._togglePen(pdf._asPdfPen(penOrColor));
                this._writePathBuffer();
                this._doc._document.stroke();
                return this;
            };
            //#endregion
            //#region internal, private 
            PdfPaths.prototype._hasPathBuffer = function () {
                return this._pathBuffer.length > 0;
            };
            PdfPaths.prototype._writePathBuffer = function () {
                var doc = this._doc._document;
                for (var i = 0; i < this._pathBuffer.length; i++) {
                    var item = this._pathBuffer[i];
                    item.func.apply(doc, item.params);
                }
                this._pathBuffer = [];
            };
            return PdfPaths;
        }());
        pdf.PdfPaths = PdfPaths;
    })(pdf = wijmo.pdf || (wijmo.pdf = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=PdfPaths.js.map