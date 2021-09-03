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
         * The @see:BulletGraph is a type of linear gauge designed specifically for use
         * in dashboards. It displays a single key measure along with a comparative
         * measure and qualitative ranges to instantly signal whether the measure is
         * good, bad, or in some other state.
         *
         * Bullet Graphs were created and popularized by dashboard design expert
         * Stephen Few. You can find more details and examples on
         * <a href="http://en.wikipedia.org/wiki/Bullet_graph">Wikipedia</a>.
         *
         * @fiddle:8uxb1vwf
         */
        var BulletGraph = (function (_super) {
            __extends(BulletGraph, _super);
            /**
             * Initializes a new instance of the @see:BulletGraph class.
             *
             * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function BulletGraph(element, options) {
                _super.call(this, element, null);
                // customize
                wijmo.addClass(this.hostElement, 'wj-bulletgraph');
                this._pointer.thickness = .35;
                // add reference ranges
                this._rngTarget = new gauge.Range('target');
                this._rngTarget.thickness = .8;
                this._rngTarget.color = 'black';
                this._rngGood = new gauge.Range('good');
                this._rngGood.color = 'rgba(0,0,0,.15)';
                this._rngBad = new gauge.Range('bad');
                this._rngBad.color = 'rgba(0,0,0,.3)';
                this.ranges.push(this._rngBad);
                this.ranges.push(this._rngGood);
                this.ranges.push(this._rngTarget);
                // initialize control options
                this.initialize(options);
            }
            Object.defineProperty(BulletGraph.prototype, "target", {
                /**
                 * Gets or sets the target value for the measure.
                 */
                get: function () {
                    return this._rngTarget.max;
                },
                set: function (value) {
                    this._rngTarget.max = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BulletGraph.prototype, "good", {
                /**
                 * Gets or sets a reference value considered good for the measure.
                 */
                get: function () {
                    return this._rngGood.max;
                },
                set: function (value) {
                    this._rngGood.max = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BulletGraph.prototype, "bad", {
                /**
                 * Gets or sets a reference value considered bad for the measure.
                 */
                get: function () {
                    return this._rngBad.max;
                },
                set: function (value) {
                    this._rngBad.max = value;
                },
                enumerable: true,
                configurable: true
            });
            // ** implementation
            // gets a rectangle that represents a Range
            BulletGraph.prototype._getRangeRect = function (rng, value) {
                if (value === void 0) { value = rng.max; }
                // let base class calculate the rectangle
                var rc = _super.prototype._getRangeRect.call(this, rng, value);
                // make target range rect look like a bullet
                if (rng == this._rngTarget) {
                    switch (this.direction) {
                        case gauge.GaugeDirection.Right:
                            rc.left = rc.right - 1;
                            rc.width = 3;
                            break;
                        case gauge.GaugeDirection.Left:
                            rc.width = 3;
                            break;
                        case gauge.GaugeDirection.Up:
                            rc.height = 3;
                            break;
                        case gauge.GaugeDirection.Down:
                            rc.top = rc.bottom - 1;
                            rc.height = 3;
                            break;
                    }
                }
                // done
                return rc;
            };
            return BulletGraph;
        }(gauge.LinearGauge));
        gauge.BulletGraph = BulletGraph;
    })(gauge = wijmo.gauge || (wijmo.gauge = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=BulletGraph.js.map