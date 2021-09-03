var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var gauge;
    (function (gauge) {
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
        var RadialGauge = (function (_super) {
            __extends(RadialGauge, _super);
            /**
             * Initializes a new instance of the @see:RadialGauge class.
             *
             * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function RadialGauge(element, options) {
                _super.call(this, element, null);
                // property storage
                this._startAngle = 0;
                this._sweepAngle = 180;
                this._autoScale = true;
                // customize
                wijmo.addClass(this.hostElement, 'wj-radialgauge');
                this._thickness = .4;
                this.showText = gauge.ShowText.All;
                // initialize control options
                this.initialize(options);
            }
            Object.defineProperty(RadialGauge.prototype, "startAngle", {
                /**
                 * Gets or sets the starting angle for the gauge, in degrees.
                 *
                 * Angles are measured in degrees, clockwise, starting from the 9 o'clock position.
                 */
                get: function () {
                    return this._startAngle;
                },
                set: function (value) {
                    if (value != this._startAngle) {
                        this._startAngle = wijmo.clamp(wijmo.asNumber(value, false), -360, 360);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RadialGauge.prototype, "sweepAngle", {
                /**
                 * Gets or sets the sweeping angle for the gauge, in degrees.
                 *
                 * Angles are measured in degrees, clockwise, starting from the 9 o'clock position.
                 */
                get: function () {
                    return this._sweepAngle;
                },
                set: function (value) {
                    if (value != this._sweepAngle) {
                        this._sweepAngle = wijmo.clamp(wijmo.asNumber(value, false), -360, 360);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RadialGauge.prototype, "autoScale", {
                /**
                 * Gets or sets a value that indicates whether the gauge automatically scales to
                 * fill the host element.
                 */
                get: function () {
                    return this._autoScale;
                },
                set: function (value) {
                    if (value != this._autoScale) {
                        this._autoScale = wijmo.asBoolean(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            // virtual methods
            /**
             * Refreshes the control.
             *
             * @param fullUpdate Indicates whether to update the control layout as well as the content.
             */
            RadialGauge.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                // clear viewbox
                this._setAttribute(this._svg, 'viewBox', null);
                // cache svg rect to work around a weird problem in Chrome
                this._rcSvg = wijmo.Rect.fromBoundingRect(this._dSvg.getBoundingClientRect());
                // update gauge
                _super.prototype.refresh.call(this, fullUpdate);
                // clear transform matrix
                this._ctmInv = null;
                this._ptSvg = null;
                // set viewbox to auto-scale
                if (this._autoScale) {
                    // clear viewbox first
                    this._setAttribute(this._svg, 'viewBox', '');
                    // measure
                    var rc = wijmo.Rect.fromBoundingRect(gauge.Gauge._getBBox(this._pFace));
                    if ((this.showText & gauge.ShowText.Value) != 0) {
                        rc = wijmo.Rect.union(rc, wijmo.Rect.fromBoundingRect(gauge.Gauge._getBBox(this._tValue)));
                    }
                    if ((this.showText & gauge.ShowText.MinMax) != 0) {
                        rc = wijmo.Rect.union(rc, wijmo.Rect.fromBoundingRect(gauge.Gauge._getBBox(this._tMin)));
                        rc = wijmo.Rect.union(rc, wijmo.Rect.fromBoundingRect(gauge.Gauge._getBBox(this._tMax)));
                    }
                    // apply viewbox
                    var viewBox = [this._fix(rc.left), this._fix(rc.top), this._fix(rc.width), this._fix(rc.height)].join(' ');
                    this._setAttribute(this._svg, 'viewBox', viewBox);
                    // save transform matrix for hit-testing (_getValueFromPoint)
                    this._ctmInv = this._pFace.getCTM().inverse();
                    this._ptSvg = this._svg.createSVGPoint();
                }
            };
            // updates the element for a given range
            RadialGauge.prototype._updateRangeElement = function (e, rng, value) {
                if (this._rcSvg) {
                    var rc = this._rcSvg, center = new wijmo.Point(rc.width / 2, rc.height / 2), radius = Math.min(rc.width, rc.height) / 2, fThick = radius * this.thickness, rThick = fThick * rng.thickness, outer = radius - (fThick - rThick) / 2, inner = outer - rThick, start = this.startAngle + 180, sweep = this.sweepAngle, face = rng == this._face, ps = face ? 0 : this._getPercent(rng.min), pe = face ? 1 : this._getPercent(value), rngStart = start + sweep * ps, rngSweep = sweep * (pe - ps);
                    // update path
                    this._updateSegment(e, center, outer, inner, rngStart, rngSweep);
                    // update thumb
                    if (rng == this._pointer && this.thumbSize > 0) {
                        var color = this._animColor ? this._animColor : this._getPointerColor(rng.max), pt = this._getPoint(center, start + sweep * this._getPercent(value), (outer + inner) / 2), ce = this._cValue;
                        this._setAttribute(ce, 'cx', this._fix(pt.x));
                        this._setAttribute(ce, 'cy', this._fix(pt.y));
                        this._setAttribute(ce, 'style', color ? 'fill:' + color : null);
                        this._setAttribute(ce, 'r', this._fix(this.thumbSize / 2));
                    }
                }
            };
            // update the content and position of the text elements
            RadialGauge.prototype._updateText = function () {
                if (this._rcSvg) {
                    var rc = this._rcSvg, center = new wijmo.Point(rc.width / 2, rc.height / 2), outer = Math.min(rc.width, rc.height) / 2, inner = Math.max(0, outer * (1 - this.thickness)), start = this.startAngle + 180, sweep = this.sweepAngle;
                    // show thumb if it has a size
                    this._showElement(this._cValue, this.thumbSize > 0);
                    // hide min/max if sweep angle > 300 degrees
                    var show = (this.showText & gauge.ShowText.MinMax) != 0 && Math.abs(sweep) <= 300;
                    this._showElement(this._tMin, show);
                    this._showElement(this._tMax, show);
                    // update text/position
                    this._centerText(this._tValue, this.value, center);
                    var offset = 10 * (this.sweepAngle < 0 ? -1 : +1);
                    this._centerText(this._tMin, this.min, this._getPoint(center, start - offset, (outer + inner) / 2));
                    this._centerText(this._tMax, this.max, this._getPoint(center, start + sweep + offset, (outer + inner) / 2));
                }
            };
            // update the tickmarks
            RadialGauge.prototype._updateTicks = function () {
                var d = '';
                if (this.showTicks && this.step) {
                    var rc = this._rcSvg, ctr = new wijmo.Point(rc.width / 2, rc.height / 2), radius = Math.min(rc.width, rc.height) / 2, fThick = radius * this.thickness, rThick = fThick * this._face.thickness, outer = radius - (fThick - rThick) / 2, inner = outer - rThick;
                    for (var t = this.min + this.step; t < this.max; t += this.step) {
                        var angle = this.startAngle + 180 + this.sweepAngle * this._getPercent(t), p1 = this._fix(this._getPoint(ctr, angle, inner)), p2 = this._fix(this._getPoint(ctr, angle, outer));
                        d += 'M ' + p1 + ' L ' + p2 + ' ';
                    }
                }
                this._pTicks.setAttribute('d', d);
            };
            // draws a radial segment at the specified position
            RadialGauge.prototype._updateSegment = function (path, ctr, rOut, rIn, start, sweep) {
                sweep = Math.min(Math.max(sweep, -359.99), 359.99);
                var p1 = this._getPoint(ctr, start, rIn), p2 = this._getPoint(ctr, start, rOut), p3 = this._getPoint(ctr, start + sweep, rOut), p4 = this._getPoint(ctr, start + sweep, rIn);
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
                var content = wijmo.format('M {p1} ' +
                    'L {p2} A {or} {or} 0 {large} {cw} {p3} ' +
                    'L {p4} A {ir} {ir} 0 {large} {ccw} {p1} Z', data);
                path.setAttribute('d', content);
            };
            // converts polar to Cartesian coordinates
            RadialGauge.prototype._getPoint = function (ctr, angle, radius) {
                angle = angle * Math.PI / 180;
                return new wijmo.Point(ctr.x + radius * Math.cos(angle), ctr.y + radius * Math.sin(angle));
            };
            // gets the gauge value at a given point (in gauge client coordinates)
            RadialGauge.prototype._getValueFromPoint = function (pt) {
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
                var rc = this._rcSvg, center = new wijmo.Point(rc.width / 2, rc.height / 2), outer = Math.min(rc.width, rc.height) / 2, inner = outer * (1 - this.thickness), dx = pt.x - center.x, dy = pt.y - center.y;
                // check that the point is within the face
                var r2 = dy * dy + dx * dx;
                if (r2 > outer * outer + 16 || r2 < inner * inner - 16) {
                    return null;
                }
                // calculate angle, percentage
                var ang = (Math.PI - Math.atan2(-dy, dx)) * 180 / Math.PI, start = this.startAngle, sweep = this.sweepAngle;
                if (sweep > 0) {
                    while (ang < start)
                        ang += 360;
                    while (ang > start + sweep)
                        ang -= 360;
                }
                else {
                    while (ang < start + sweep)
                        ang += 360;
                    while (ang > start)
                        ang -= 360;
                }
                var pct = Math.abs(ang - start) / Math.abs(sweep);
                return this.min + pct * (this.max - this.min);
            };
            return RadialGauge;
        }(gauge.Gauge));
        gauge.RadialGauge = RadialGauge;
    })(gauge = wijmo.gauge || (wijmo.gauge = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=RadialGauge.js.map