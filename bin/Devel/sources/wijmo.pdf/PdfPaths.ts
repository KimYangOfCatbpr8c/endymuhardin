module wijmo.pdf {
	'use strict';

	interface _IPathFunc {
		func: Function;
		params: any[];
	}

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
	export class PdfPaths {
		private _doc: PdfDocument;
		private _offset: Point;
		private _pathBuffer: _IPathFunc[] = [];

		/**
		* Initializes a new instance of the @see:PdfPaths class.
		*
		* @param doc Document.
		* @param offset Offset.
		*/
		constructor(doc: PdfDocument, offset: Point) {
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
		public moveTo(x: number, y: number): PdfPaths {
			this._pathBuffer.push({
				func: (<_IPdfKitDocument>this._doc._document).moveTo,
				params: [wijmo.asNumber(x) + this._offset.x, wijmo.asNumber(y) + this._offset.y]
			});

			return this;
		}

		/**
		* Draws a line from the current point to a new point.
		*
		* The new current point is (x, y).
		*
		* @param x The X-coordinate of the new point, in points.
		* @param y The Y-coordinate of the new point, in points.
		* @return The @see:PdfPaths object.
		*/
		public lineTo(x: number, y: number): PdfPaths {
			this._pathBuffer.push({
				func: (<_IPdfKitDocument>this._doc._document).lineTo,
				params: [wijmo.asNumber(x) + this._offset.x, wijmo.asNumber(y) + this._offset.y]
			});

			return this;
		}

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
		public quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): PdfPaths {
			this._pathBuffer.push({
				func: (<_IPdfKitDocument>this._doc._document).quadraticCurveTo,
				params: [
					wijmo.asNumber(cpx) + this._offset.x,
					wijmo.asNumber(cpy) + this._offset.y,
					wijmo.asNumber(x) + this._offset.x,
					wijmo.asNumber(y) + this._offset.y
				]
			});

			return this;
		}

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
		public bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): PdfPaths {
			this._pathBuffer.push({
				func: (<_IPdfKitDocument>this._doc._document).bezierCurveTo,
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
		}

		/**
		* Draws a SVG 1.1 path.
		*
		* @param path The SVG path to draw.
		* @return The @see:PdfPaths object.
		*/
		public svgPath(path: string): PdfPaths {
			if (path) {
				var updatedPath = _PdfSvgPathHelper.offset(wijmo.asString(path), this._offset);

				this._pathBuffer.push({
					func: (<_IPdfKitDocument>this._doc._document).path,
					params: [wijmo.asString(updatedPath)]
				});
			}
			return this;
		}

		/**
		* Closes the current path and draws a line from the current point to the initial
		* point of the current path.
		*
		* @return The @see:PdfPaths object.
		*/
		public closePath(): PdfPaths {
			this._writePathBuffer();
			(<_IPdfKitDocument>this._doc._document).closePath();
			return this;
		}

		/**
		* Draws a rectangle.
		*
		* @param x The X-coordinate of the topleft corner of the rectangle, in points.
		* @param y The Y-coordinate of the topleft corner of the rectangle, in points.
		* @param width The width of the rectangle, in points.
		* @param height The width of the rectangle, in points.
		* @return The @see:PdfPaths object.
		*/
		public rect(x: number, y: number, width: number, height: number): PdfPaths {
			this._pathBuffer.push({
				func: (<_IPdfKitDocument>this._doc._document).rect,
				params: [
					wijmo.asNumber(x) + this._offset.x,
					wijmo.asNumber(y) + this._offset.y,
					wijmo.asNumber(width, false, true),
					wijmo.asNumber(height, false, true)
				]
			});

			return this;
		}

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
		public roundedRect(x: number, y: number, width: number, height: number, cornerRadius: number = 0): PdfPaths {
			this._pathBuffer.push({
				func: (<_IPdfKitDocument>this._doc._document).roundedRect,
				params: [
					wijmo.asNumber(x) + this._offset.x,
					wijmo.asNumber(y) + this._offset.y,
					wijmo.asNumber(width, false, true),
					wijmo.asNumber(height, false, true),
					wijmo.asNumber(cornerRadius, false, true)
				]
			});

			return this;
		}

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
		public ellipse(x: number, y: number, radiusX: number, radiusY: number = radiusX): PdfPaths {
			this._pathBuffer.push({
				func: (<_IPdfKitDocument>this._doc._document).ellipse,
				params: [
					wijmo.asNumber(x) + this._offset.x,
					wijmo.asNumber(y) + this._offset.y,
					wijmo.asNumber(radiusX, false, true),
					wijmo.asNumber(radiusY, false, true)
				]
			});

			return this;
		}

		/**
		* Draws a circle.
		*
		* @param x The X-coordinate of the center of the circle, in points.
		* @param y The Y-coordinate of the center of the circle, in points.
		* @param radius The radius of the circle, in points.
		* @return The @see:PdfPaths object.
		*/
		public circle(x: number, y: number, radius: number): PdfPaths {
			this._pathBuffer.push({
				func: (<_IPdfKitDocument>this._doc._document).circle,
				params: [
					wijmo.asNumber(x) + this._offset.x,
					wijmo.asNumber(y) + this._offset.y,
					wijmo.asNumber(radius, false, true)
				]
			});

			return this;
		}

		/**
		* Draws a polygon using a given points array.
		* 
		* @param points An array of two-elements arrays [x, y] specifying
		* the X and Y coordinates of the point, in points.
		* @return The @see:PdfPaths object.
		*/
		public polygon(points: number[][]): PdfPaths {
			if (points) {
				for (var i = 0; i < points.length; i++) {
					var pnt = points[i];

					pnt[0] = pnt[0] + this._offset.x;
					pnt[1] = pnt[1] + this._offset.y;
				}
			}

			this._pathBuffer.push({
				func: (<_IPdfKitDocument>this._doc._document).polygon,
				params: points
			})

			return this;
		}

		/**
		* Creates a clipping path used to limit the regions of the page affected by 
		* painting operators.
		*
		* @param rule The fill rule to use.
		* @return The @see:PdfPaths object.
		*/
		public clip(rule: PdfFillRule = PdfFillRule.NonZero): PdfPaths {
			this._writePathBuffer();
			(<_IPdfKitDocument>this._doc._document).clip(rule === PdfFillRule.EvenOdd ? 'even-odd' : 'non-zero');
			return this;
		}

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
		public fill(brushOrColor?: any, rule?: PdfFillRule): PdfPaths { // brushOrColor: PdfBrush | Color | string
			this._doc._toggleBrush(_asPdfBrush(brushOrColor));
			this._writePathBuffer();
			(<_IPdfKitDocument>this._doc._document).fill(rule === PdfFillRule.EvenOdd ? 'even-odd' : 'non-zero');

			return this;
		}

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
		public fillAndStroke(brushOrColor?: any, penOrColor?: any, rule?: PdfFillRule): PdfPaths { // brushOrColor: PdfBrush | Color | string, penOrColor: PdfPen | Color | string
			this._doc._toggleBrush(_asPdfBrush(brushOrColor));
			this._doc._togglePen(_asPdfPen(penOrColor));

			this._writePathBuffer();
			(<_IPdfKitDocument>this._doc._document).fillAndStroke(rule === PdfFillRule.EvenOdd ? 'even-odd' : 'non-zero');

			return this;
		}

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
		public stroke(penOrColor?: any): PdfPaths { // penOrColor: PdfPen | Color | string
			this._doc._togglePen(_asPdfPen(penOrColor));
			this._writePathBuffer();
			(<_IPdfKitDocument>this._doc._document).stroke();

			return this;
		}

		//#endregion

		//#region internal, private 

		public _hasPathBuffer(): boolean {
			return this._pathBuffer.length > 0;
		}

		private _writePathBuffer() {
			var doc = <_IPdfKitDocument>this._doc._document;

			for (var i = 0; i < this._pathBuffer.length; i++) {
				var item = this._pathBuffer[i];

				item.func.apply(doc, item.params);
			}

			this._pathBuffer = [];
		}

		//#endregion.
	}
} 