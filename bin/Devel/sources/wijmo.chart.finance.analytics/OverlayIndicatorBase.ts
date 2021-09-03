module wijmo.chart.finance.analytics {
    "use strict";

    /**
     * Base class for overlay and indicator series (abstract).
     */
    export class OverlayIndicatorBase extends SeriesBase {
        private __plotter: _IPlotter;
        private __hitTester: _HitTester;

        _styles: any;

        // internal field for series that need multiple legend entries
        // in that case, set value to number of legend entries in ctor
        _seriesCount: number = 1;

        constructor() {
            super();
        }

        // access _IPlotter instance
        get _plotter(): _IPlotter {
            if (this.chart && !this.__plotter) {
                this.__plotter = this.chart._getPlotter(this);
            }
            return this.__plotter;
        }

        // access _HitTester instance
        get _hitTester(): _HitTester {
            if (this._plotter && !this.__hitTester) {
                this.__hitTester = this._plotter.hitTester;
            }
            return this.__hitTester;
        }

        // return ChartType
        _getChartType(): ChartType {
            return ChartType.Line;
        }

        // return original X-Values, if available
        _getXValues(): number[] {
            return (super.getValues(1) || this._plotter.dataInfo.getXVals());
        }

        // helper method to get a _DataPoint object for hit testing
        _getDataPoint(dataX: number, dataY: number, seriesIndex: number, pointIndex: number, ax: Axis, ay: Axis): _DataPoint {
            var dpt = new _DataPoint(seriesIndex, pointIndex, dataX, dataY);

            // set x & y related data
            dpt["y"] = dataY;
            dpt["yfmt"] = ay._formatValue(dataY);
            dpt["x"] = dataX;
            dpt["xfmt"] = ax._formatValue(dataX);

            return dpt;
        }

        // abstract method that determines whether or not calculations need to be ran
        _shouldCalculate(): boolean { return true; }

        // initialize internal collections
        _init(): void { }

        // responsible for calculating values
        _calculate(): void { }

        _clearValues(): void {
            super._clearValues();
            this.__plotter = null;
            this.__hitTester = null;
        }

        // helper for series with multiple names (csv)
        // Returns undefined or the name.
        _getName(dim: number): string {
            var retval: string = undefined;

            if (this.name) {
                if (this.name.indexOf(",")) {
                    var names = this.name.split(",");
                    if (names && names.length - 1 >= dim) {
                        retval = names[dim].trim();
                    }
                } else {
                    retval = this.name;
                }
            }

            return retval;
        }

        // helper for series with multiple styles
        // Returns the appropriate style for the given index, if
        // ones exists; null is returned otherwise.
        _getStyles(dim: number): any {
            var retval = null;
            if (dim < 0 || this._styles === null) {
                return retval;
            }

            var i = 0;
            for (var key in this._styles) {
                if (i === dim && this._styles.hasOwnProperty(key)) {
                    retval = this._styles[key];
                    break;
                }
                i++;
            }

            return retval;
        }

        /* overrides for multiple legend items */
        legendItemLength(): number {
            return this._seriesCount;
        }

        measureLegendItem(engine: IRenderEngine, index: number): Size {
            var name = this._getName(index),
                retval = new Size(0, 0);

            if (name) {
                retval = this._measureLegendItem(engine, this._getName(index));
            }

            return retval;
        }

        drawLegendItem(engine: IRenderEngine, rect: Rect, index: number): void {
            var style = this._getStyles(index) || this.style,
                name = this._getName(index);

            if (name) {
                this._drawLegendItem(engine, rect, this._getChartType(), this._getName(index), style, this.symbolStyle);
            }
        }
    }

    /**
     * Base class for overlay and indicator series that render a single series (abstract).
     */
    export class SingleOverlayIndicatorBase extends OverlayIndicatorBase {
        private _period = 14;

        _xvals: number[];
        _yvals: number[];

        constructor() {
            super();
        }

        /**
         * Gets or sets the period for the calculation as an integer value.
         */
        get period(): any {
            return this._period;
        }
        set period(value: any) {
            if (value !== this._period) {
                this._period = asInt(value, false, true);
                this._clearValues();
                this._invalidate();
            }
        }

        // return the derived values
        getValues(dim: number): number[] {
            var retval: number[] = null;
            if (super._getLength() <= 0) {
                return retval;
            } else if (this._shouldCalculate()) {
                this._init();
                this._calculate();
            }

            if (dim === 0) {
                retval = this._yvals;
            } else if (dim === 1) {
                retval = this._xvals;
            }

            return retval;
        }

        // return limits for the derived values
        getDataRect(): Rect {
            var rect: Rect = null;
            if (super._getLength() <= 0) {
                return rect;
            } else if (this._shouldCalculate()) {
                this._init();
                this._calculate();
            }

            var xmin = _minimum(this._xvals),
                xmax = _maximum(this._xvals),
                ymin = _minimum(this._yvals),
                ymax = _maximum(this._yvals);

            if (_DataInfo.isValid(xmin) && _DataInfo.isValid(xmax) && _DataInfo.isValid(ymin) && _DataInfo.isValid(ymax)) {
                rect = new Rect(xmin, ymin, xmax - xmin, ymax - ymin);
            }

            return rect;
        }

        // clear the internal collections for the derived values
        _clearValues(): void {
            super._clearValues();
            this._xvals = null;
            this._yvals = null;
        }

        // determine if the derived values need to be calculated
        _shouldCalculate(): boolean {
            return !this._yvals || !this._xvals;
        }

        // initialize internal collections for the derived values
        _init(): void {
            super._init();
            this._yvals = [];
            this._xvals = [];
        }

        // override to get correct item for hit testing
        _getItem(pointIndex: number): any {
            if (super._getLength() <= 0) {
                return super._getItem(pointIndex);
            } else if (this._shouldCalculate()) {
                this._init();
                this._calculate();
            }

            var originalLen = super._getLength(),
                len = _minimum(this._yvals.length, this._xvals.length);

            // data index
            pointIndex = originalLen - len + pointIndex;
            return super._getItem(pointIndex);
        }
    }
}