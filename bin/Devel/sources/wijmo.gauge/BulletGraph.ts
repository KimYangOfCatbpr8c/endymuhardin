module wijmo.gauge {
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
    export class BulletGraph extends LinearGauge {

        // child ranges
        _rngTarget: Range;
        _rngGood: Range;
        _rngBad: Range;

        /**
         * Initializes a new instance of the @see:BulletGraph class.
         *
         * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
         * @param options The JavaScript object containing initialization data for the control.
         */
        constructor(element: any, options?) {
            super(element, null);

            // customize
            addClass(this.hostElement, 'wj-bulletgraph');
            this._pointer.thickness = .35;

            // add reference ranges
            this._rngTarget = new Range('target');
            this._rngTarget.thickness = .8;
            this._rngTarget.color = 'black';
            this._rngGood = new Range('good');
            this._rngGood.color = 'rgba(0,0,0,.15)';
            this._rngBad = new Range('bad');
            this._rngBad.color = 'rgba(0,0,0,.3)';
            this.ranges.push(this._rngBad);
            this.ranges.push(this._rngGood);
            this.ranges.push(this._rngTarget);

            // initialize control options
            this.initialize(options);
        }

        /**
         * Gets or sets the target value for the measure.
         */
        get target(): number {
            return this._rngTarget.max;
        }
        set target(value: number) {
            this._rngTarget.max = value;
        }
        /**
         * Gets or sets a reference value considered good for the measure.
         */
        get good(): number {
            return this._rngGood.max;
        }
        set good(value: number) {
            this._rngGood.max = value;
        }
        /**
         * Gets or sets a reference value considered bad for the measure.
         */
        get bad(): number {
            return this._rngBad.max;
        }
        set bad(value: number) {
            this._rngBad.max = value;
        }

        // ** implementation

        // gets a rectangle that represents a Range
        _getRangeRect(rng: Range, value = rng.max): Rect {

            // let base class calculate the rectangle
            var rc = super._getRangeRect(rng, value);

            // make target range rect look like a bullet
            if (rng == this._rngTarget) {
                switch (this.direction) {
                    case GaugeDirection.Right:
                        rc.left = rc.right - 1;
                        rc.width = 3;
                        break;
                    case GaugeDirection.Left:
                        rc.width = 3;
                        break;
                    case GaugeDirection.Up:
                        rc.height = 3;
                        break;
                    case GaugeDirection.Down:
                        rc.top = rc.bottom - 1;
                        rc.height = 3;
                        break;
                }
            }

            // done
            return rc;
        }
    }
}
