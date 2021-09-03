module wijmo.gauge {
    'use strict';

    /**
     * The @see:RadialGauge displays a circular scale with an indicator
     * that represents a single value and optional ranges to represent
     * reference values.
     *
     * If you set the gauge's @see:RadialGauge.isReadOnly property to
     * false, then users will be able to edit the value by clicking on
     * the gauge.
     *
     * @fiddle:7ec2144u
     */
    export class RadialGauge extends Gauge {

        // property storage
        private _startAngle = 0;
        private _sweepAngle = 180;
        private _autoScale = true;

        // svg rect used to position ranges and text
        private _rcSvg: Rect;

        // SVG matrix and point used to perform hit-testing 
        private _ctmInv: SVGMatrix;
        private _ptSvg: SVGPoint;

        /**
         * Initializes a new instance of the @see:RadialGauge class.
         *
         * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
         * @param options The JavaScript object containing initialization data for the control.
         */
        constructor(element: any, options?) {
            super(element, null);

            // customize
            addClass(this.hostElement, 'wj-radialgauge');
            this._thickness = .4;
            this.showText = ShowText.All;

            // initialize control options
            this.initialize(options);
        }

        /**
         * Gets or sets the starting angle for the gauge, in degrees.
         *
         * Angles are measured in degrees, clockwise, starting from the 9 o'clock position.
         */
        get startAngle(): number {
            return this._startAngle;
        }
        set startAngle(value: number) {
            if (value != this._startAngle) {
                this._startAngle = clamp(asNumber(value, false), -360, 360);
                this.invalidate();
            }
        }
        /**
         * Gets or sets the sweeping angle for the gauge, in degrees.
         *
         * Angles are measured in degrees, clockwise, starting from the 9 o'clock position.
         */
        get sweepAngle(): number {
            return this._sweepAngle;
        }
        set sweepAngle(value: number) {
            if (value != this._sweepAngle) {
                this._sweepAngle = clamp(asNumber(value, false), -360, 360);
                this.invalidate();
            }
        }
        /**
         * Gets or sets a value that indicates whether the gauge automatically scales to 
         * fill the host element.
         */
        get autoScale(): boolean {
            return this._autoScale;
        }
        set autoScale(value: boolean) {
            if (value != this._autoScale) {
                this._autoScale = asBoolean(value);
                this.invalidate();
            }
        }

        // virtual methods

        /**
         * Refreshes the control.
         *
         * @param fullUpdate Indicates whether to update the control layout as well as the content.
         */
        refresh(fullUpdate = true) {

            // clear viewbox
            this._setAttribute(this._svg, 'viewBox', null);

            // cache svg rect to work around a weird problem in Chrome
            this._rcSvg = Rect.fromBoundingRect(this._dSvg.getBoundingClientRect());

            // update gauge
            super.refresh(fullUpdate);

            // clear transform matrix
            this._ctmInv = null;
            this._ptSvg = null;

            // set viewbox to auto-scale
            if (this._autoScale) {

                // clear viewbox first
                this._setAttribute(this._svg, 'viewBox', '');

                // measure
                var rc = Rect.fromBoundingRect(Gauge._getBBox(this._pFace));
                if ((this.showText & ShowText.Value) != 0) {
                    rc = Rect.union(rc, Rect.fromBoundingRect(Gauge._getBBox(this._tValue)));
                }
                if ((this.showText & ShowText.MinMax) != 0) {
                    rc = Rect.union(rc, Rect.fromBoundingRect(Gauge._getBBox(this._tMin)));
                    rc = Rect.union(rc, Rect.fromBoundingRect(Gauge._getBBox(this._tMax)));
                }

                // apply viewbox
                var viewBox = [this._fix(rc.left), this._fix(rc.top), this._fix(rc.width), this._fix(rc.height)].join(' ');
                this._setAttribute(this._svg, 'viewBox', viewBox);

                // save transform matrix for hit-testing (_getValueFromPoint)
                var ctm = this._pFace.getCTM();
                this._ctmInv = ctm ? ctm.inverse() : null; // TFS 144174
                this._ptSvg = this._svg.createSVGPoint();
            }
        }

        // updates the element for a given range
        _updateRangeElement(e: SVGPathElement, rng: Range, value: number) {
            if (this._rcSvg) {
                var rc = this._rcSvg,
                    center = new Point(rc.width / 2, rc.height / 2),
                    radius = Math.min(rc.width, rc.height) / 2,
                    fThick = radius * this.thickness,
                    rThick = fThick * rng.thickness,
                    outer = radius - (fThick - rThick) / 2,
                    inner = outer - rThick,
                    start = this.startAngle + 180,
                    sweep = this.sweepAngle,
                    face = rng == this._face,
                    ps = face ? 0 : this._getPercent(rng.min),
                    pe = face ? 1 : this._getPercent(value),
                    rngStart = start + sweep * ps,
                    rngSweep = sweep * (pe - ps);

                // update path
                this._updateSegment(e, center, outer, inner, rngStart, rngSweep);

                // update thumb
                if (rng == this._pointer && this.thumbSize > 0) {
                    var color = this._animColor ? this._animColor : this._getPointerColor(rng.max),
                        pt = this._getPoint(center, start + sweep * this._getPercent(value), (outer + inner) / 2),
                        ce = this._cValue;
                    this._setAttribute(ce, 'cx', this._fix(pt.x));
                    this._setAttribute(ce, 'cy', this._fix(pt.y));
                    this._setAttribute(ce, 'style', color ? 'fill:' + color : null);
                    this._setAttribute(ce, 'r', this._fix(this.thumbSize / 2));
                }
            }
        }

        // update the content and position of the text elements
        _updateText() {
            if (this._rcSvg) {
                var rc = this._rcSvg,
                    center = new Point(rc.width / 2, rc.height / 2),
                    outer = Math.min(rc.width, rc.height) / 2,
                    inner = Math.max(0, outer * (1 - this.thickness)),
                    start = this.startAngle + 180,
                    sweep = this.sweepAngle;

                // show thumb if it has a size
                this._showElement(this._cValue, this.thumbSize > 0);

                // hide min/max if sweep angle > 300 degrees
                var show = (this.showText & ShowText.MinMax) != 0 && Math.abs(sweep) <= 300;
                this._showElement(this._tMin, show);
                this._showElement(this._tMax, show);

                // update text/position
                this._centerText(this._tValue, this.value, center);
                var offset = 10 * (this.sweepAngle < 0 ? -1 : +1);
                this._centerText(this._tMin, this.min, this._getPoint(center, start - offset, (outer + inner) / 2));
                this._centerText(this._tMax, this.max, this._getPoint(center, start + sweep + offset, (outer + inner) / 2));
            }
        }

        // update the tickmarks
        _updateTicks() {
            var d = '';
            if (this.showTicks && this.step) {
                var rc = this._rcSvg,
                    ctr = new Point(rc.width / 2, rc.height / 2),
                    radius = Math.min(rc.width, rc.height) / 2,
                    fThick = radius * this.thickness,
                    rThick = fThick * this._face.thickness,
                    outer = radius - (fThick - rThick) / 2,
                    inner = outer - rThick;
                for (var t = this.min + this.step; t < this.max; t += this.step) {
                    var angle = this.startAngle + 180 + this.sweepAngle * this._getPercent(t),
                        p1 = this._fix(this._getPoint(ctr, angle, inner)),
                        p2 = this._fix(this._getPoint(ctr, angle, outer));
                    d += 'M ' + p1 + ' L ' + p2 + ' ';
                }
            }
            this._pTicks.setAttribute('d', d);
        }

        // draws a radial segment at the specified position
        _updateSegment(path: SVGPathElement, ctr: Point, rOut: number, rIn: number, start: number, sweep: number) {
            sweep = Math.min(Math.max(sweep, -359.99), 359.99);
            var p1 = this._getPoint(ctr, start, rIn),
                p2 = this._getPoint(ctr, start, rOut),
                p3 = this._getPoint(ctr, start + sweep, rOut),
                p4 = this._getPoint(ctr, start + sweep, rIn);
            var data = {
                large: Math.abs(sweep) > 180 ? 1 : 0,
                cw: sweep > 0 ? 1 : 0,
                ccw: sweep > 0 ? 0 : 1,
                or: this._fix(rOut),
                ir: this._fix(rIn),
                p1: this._fix(p1),
                p2: this._fix(p2),
                p3: this._fix(p3),
                p4: this._fix(p4)
            };
            var content = format('M {p1} ' +
                'L {p2} A {or} {or} 0 {large} {cw} {p3} ' +
                'L {p4} A {ir} {ir} 0 {large} {ccw} {p1} Z',
                data);
            path.setAttribute('d', content);
        }

        // converts polar to Cartesian coordinates
        _getPoint(ctr: Point, angle: number, radius: number): Point {
            angle = angle * Math.PI / 180;
            return new Point(
                ctr.x + radius * Math.cos(angle),
                ctr.y + radius * Math.sin(angle));
        }

        // gets the gauge value at a given point (in gauge client coordinates)
        _getValueFromPoint(pt: Point) {

            // convert client coordinates to SVG viewport
            // the getCTM matrix transforms viewport into client coordinates
            // the inverse matrix transforms client into viewport, which is what we want
            if (this.autoScale && this._ctmInv) {
                this._ptSvg.x = pt.x;
                this._ptSvg.y = pt.y;
                this._ptSvg = this._ptSvg.matrixTransform(this._ctmInv);
                pt.x = this._ptSvg.x;
                pt.y = this._ptSvg.y;
            }

            // sanity
            if (!this._rcSvg) {
                return null;
            }

            // calculate geometry
            var rc = this._rcSvg,
                center = new Point(rc.width / 2, rc.height / 2),
                outer = Math.min(rc.width, rc.height) / 2,
                inner = outer * (1 - this.thickness),
                dx = pt.x - center.x,
                dy = pt.y - center.y;

            // check that the point is within the face
            var r2 = dy * dy + dx * dx;
            if (r2 > outer * outer + 16 || r2 < inner * inner - 16) {
                return null;
            }

            // calculate angle, percentage
            var ang = (Math.PI - Math.atan2(-dy, dx)) * 180 / Math.PI,
                start = this.startAngle,
                sweep = this.sweepAngle;
            if (sweep > 0) {
                while (ang < start) ang += 360;
                while (ang > start + sweep) ang -= 360;
            } else {
                while (ang < start + sweep) ang += 360;
                while (ang > start) ang -= 360;
            }
            var pct = Math.abs(ang - start) / Math.abs(sweep);
            return this.min + pct * (this.max - this.min);
        }
    }
}
