module wijmo.gauge {
    'use strict';

    /**
     * Represents the direction in which the pointer of a @see:LinearGauge
     * increases.
     */
    export enum GaugeDirection {
        /** Gauge value increases from left to right. */
        Right,
        /** Gauge value increases from right to left. */
        Left,
        /** Gauge value increases from bottom to top. */
        Up,
        /** Gauge value increases from top to bottom. */
        Down
    }

    /**
     * The @see:LinearGauge displays a linear scale with an indicator
     * that represents a single value and optional ranges to represent
     * reference values.
     *
     * If you set the gauge's @see:LinearGauge.isReadOnly property to
     * false, then users will be able to edit the value by clicking on
     * the gauge.
     *
     * @fiddle:t842jozb
     */
    export class LinearGauge extends Gauge {

        // property storage
        private _direction = GaugeDirection.Right;

        /**
         * Initializes a new instance of the @see:LinearGauge class.
         *
         * @param element The DOM element that will host the control, or a selector for the host element (e.g. '#theCtrl').
         * @param options JavaScript object containing initialization data for the control.
         */
        constructor(element: any, options?) {
            super(element, null);

            // customize
            addClass(this.hostElement, 'wj-lineargauge');

            // initialize control options
            this.initialize(options);
        }

        /**
         * Gets or sets the direction in which the gauge is filled.
         */
        get direction(): GaugeDirection {
            return this._direction;
        }
        set direction(value: GaugeDirection) {
            if (value != this._direction) {
                this._direction = asEnum(value, GaugeDirection);
                this.invalidate();
            }
        }

        // virtual methods

        // updates the element for a given range
        _updateRangeElement(e: SVGPathElement, rng: Range, value: number) {

            // update the path
            var rc = this._getRangeRect(rng, value);
            this._updateSegment(e, rc);

            // check whether we have to show text and/or thumb
            var showText = (rng == this._pointer) && (this.showText & ShowText.Value) != 0,
                showThumb = showText || (rng == this._pointer && this.thumbSize > 0);

            // calculate thumb center
            if (showText || showThumb) {
                var x = rc.left + rc.width / 2,
                    y = rc.top + rc.height / 2;
                switch (this.direction) {
                    case GaugeDirection.Right:
                        x = rc.right;
                        break;
                    case GaugeDirection.Left:
                        x = rc.left;
                        break;
                    case GaugeDirection.Up:
                        y = rc.top;
                        break;
                    case GaugeDirection.Down:
                        y = rc.bottom;
                        break;
                }
            }

            // update text
            if (showText) {
                this._centerText(this._tValue, value, new Point(x, y));
            }

            // update thumb
            if (showText || showThumb) {
                rc = Rect.fromBoundingRect(Gauge._getBBox(this._tValue));
                var color = this._animColor ? this._animColor : this._getPointerColor(rng.max),
                    radius = this.thumbSize != null ? this.thumbSize / 2 : Math.max(rc.width, rc.height) * .8,
                    ce = this._cValue;
                this._setAttribute(ce, 'cx', this._fix(x));
                this._setAttribute(ce, 'cy', this._fix(y));
                this._setAttribute(ce, 'style', color ? 'fill:' + color : null);
                this._setAttribute(ce, 'r', this._fix(radius));
            }
        }

        // update the text elements
        _updateText() {
            var rc = this._getRangeRect(this._face);
            switch (this.direction) {
                case GaugeDirection.Right:
                    this._setText(this._tMin, this.min, rc, 'left');
                    this._setText(this._tMax, this.max, rc, 'right');
                    break;
                case GaugeDirection.Left:
                    this._setText(this._tMin, this.min, rc, 'right');
                    this._setText(this._tMax, this.max, rc, 'left');
                    break;
                case GaugeDirection.Up:
                    this._setText(this._tMin, this.min, rc, 'bottom');
                    this._setText(this._tMax, this.max, rc, 'top');
                    break;
                case GaugeDirection.Down:
                    this._setText(this._tMin, this.min, rc, 'top');
                    this._setText(this._tMax, this.max, rc, 'bottom');
                    break;
            }
        }

        // update the tickmarks
        _updateTicks() {
            var d = '';
            if (this.showTicks && this.step) {
                var rc = this._getRangeRect(this._face);
                for (var t = this.min + this.step; t < this.max; t += this.step) {
                    switch (this.direction) {
                        case GaugeDirection.Right:
                            var tx = this._fix(rc.left + rc.width * this._getPercent(t));
                            d += 'M ' + tx + ' ' + this._fix(rc.top) + ' L ' + tx + ' ' + this._fix(rc.bottom) + ' ';
                            break;
                        case GaugeDirection.Left:
                            var tx = this._fix(rc.right - rc.width * this._getPercent(t));
                            d += 'M ' + tx + ' ' + rc.top.toFixed(2) + ' L ' + tx + ' ' + rc.bottom.toFixed(2) + ' ';
                            break;
                        case GaugeDirection.Up:
                            var ty = (rc.bottom - rc.height * this._getPercent(t)).toFixed(2);
                            d += 'M ' + this._fix(rc.left) + ' ' + ty + ' L ' + this._fix(rc.right) + ' ' + ty + ' ';
                            break;
                        case GaugeDirection.Down:
                            var ty = (rc.top + rc.height * this._getPercent(t)).toFixed(2);
                            d += 'M ' + rc.left.toFixed(2) + ' ' + ty + ' L ' + rc.right.toFixed(2) + ' ' + ty + ' ';
                            break;
                    }
                }
            }
            this._pTicks.setAttribute('d', d);
        }

        // ** private stuff

        // draws a rectangular segment at the specified position
        _updateSegment(path: SVGPathElement, rc: Rect) {
            var data = {
                p1: this._fix(new Point(rc.left, rc.top)),
                p2: this._fix(new Point(rc.right, rc.top)),
                p3: this._fix(new Point(rc.right, rc.bottom)),
                p4: this._fix(new Point(rc.left, rc.bottom))
            };
            var content = format('M {p1} L {p2} L {p3} L {p4} Z', data);
            path.setAttribute('d', content);
        }

        // positions a text element
        _setText(e: SVGTextElement, value: number, rc: Rect, pos: string) {
            if (e.getAttribute('display') != 'none') {
                e.textContent = Globalize.format(value, this.format);
                var box = Rect.fromBoundingRect(Gauge._getBBox(e)),
                    pt = new Point(rc.left + rc.width / 2 - box.width / 2,
                        rc.top + rc.height / 2 + box.height / 2);
                switch (pos) {
                    case 'top':
                        pt.y = rc.top - 4;
                        break;
                    case 'left':
                        pt.x = rc.left - 4 - box.width;
                        break;
                    case 'right':
                        pt.x = rc.right + 4;
                        break;
                    case 'bottom':
                        pt.y = rc.bottom + 4 + box.height;
                        break;
                }
                e.setAttribute('x', this._fix(pt.x));
                e.setAttribute('y', this._fix(pt.y));
            }
        }

        // gets a rectangle that represents a Range
        _getRangeRect(rng: Range, value = rng.max): Rect {

            // get gauge size
            var rc = new Rect(0, 0, this.hostElement.clientWidth, this.hostElement.clientHeight);

            // get face rect (account for thickness, text or thumb at edges)
            var padding = this.thumbSize ? Math.ceil(this.thumbSize / 2) : 0;
            if (this.showText != ShowText.None) {
                padding = Math.max(padding, 3 * parseInt(getComputedStyle(this.hostElement).fontSize));
            }
            switch (this.direction) {
                case GaugeDirection.Right:
                case GaugeDirection.Left:
                    rc = rc.inflate(-padding, -rc.height * (1 - this.thickness * rng.thickness) / 2);
                    break;
                case GaugeDirection.Up:
                case GaugeDirection.Down:
                    rc = rc.inflate(-rc.width * (1 - this.thickness * rng.thickness) / 2, -padding);
                    break;
            }

            // get range rect
            var face = rng == this._face,
                pctMin = face ? 0 : this._getPercent(rng.min),
                pctMax = face ? 1 : this._getPercent(value); // TFS 210156
            switch (this.direction) {
                case GaugeDirection.Right:
                    rc.left += rc.width * pctMin;
                    rc.width *= (pctMax - pctMin);
                    break;
                case GaugeDirection.Left:
                    rc.left = rc.right - rc.width * pctMax;
                    rc.width = rc.width * (pctMax - pctMin);
                    break;
                case GaugeDirection.Down:
                    rc.top += rc.height * pctMin;
                    rc.height *= (pctMax - pctMin);
                    break;
                case GaugeDirection.Up:
                    rc.top = rc.bottom - rc.height * pctMax;
                    rc.height = rc.height * (pctMax - pctMin);
                    break;
            }

            // done
            return rc;
        }

        // gets the gauge value at a given point (in gauge client coordinates)
        _getValueFromPoint(pt: Point) {

            // get face rectangle to calculate coordinates
            var rc = this._getRangeRect(this._face);

            // accept clicks anywhere to be touch-friendly
            //if (!rc.contains(pt)) {
            //    return null;
            //}

            // get position in control coordinates (min to max)
            var pct = 0;
            switch (this.direction) {
                case GaugeDirection.Right:
                    pct = rc.width > 0 ? (pt.x - rc.left) / rc.width : 0;
                    break;
                case GaugeDirection.Left:
                    pct = rc.width > 0 ? (rc.right - pt.x) / rc.width : 0;
                    break;
                case GaugeDirection.Up:
                    pct = rc.height > 0 ? (rc.bottom - pt.y) / rc.height : 0;
                    break;
                case GaugeDirection.Down:
                    pct = rc.height > 0 ? (pt.y - rc.top) / rc.height : 0;
                    break;
            }

            // done
            return this.min + pct * (this.max - this.min);
        }
    }
}
