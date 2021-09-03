module wijmo.chart.finance.analytics {
    "use strict";

    export enum MovingAverageType {
        Simple,
        Exponential
    }

    /**
     * Represents a Moving Average Envelopes overlay series for the @see:FinancialChart.
     *
     * Moving average envelopes are moving averages set above and below a standard moving
     * average.  The amount above/below the standard moving average is percentage based and
     * dictated by the @see:size property.
     */
    export class Envelopes extends OverlayIndicatorBase {
        private _upperYVals: number[];
        private _lowerYVals: number[];
        private _xVals: number[];

        private _period = 20;
        private _type = MovingAverageType.Simple;
        private _size = 0.025;

        constructor() {
            super();
            this.rendering.addHandler(this._rendering, this);
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

        /**
         * Gets or sets the moving average type for the
         * envelopes.  The default value is Simple.
         */
        get type(): MovingAverageType {
            return this._type;
        }
        set type(value: MovingAverageType) {
            if (value !== this._type) {
                this._type = asEnum(value, MovingAverageType, false);
                this._clearValues();
                this._invalidate();
            }
        }

        /**
         * Gets or set the size of the moving average
         * envelopes.  The default value is 2.5 percent (0.025).
         */
        get size(): number {
            return this._size;
        }
        set size(value: number) {
            if (value !== this._size) {
                this._size = asNumber(value, false, true);
                this._clearValues();
                this._invalidate();
            }
        }

        getDataRect(): Rect {
            var rect: Rect = null;
            if (super._getLength() <= 0) {
                return rect;
            } else if (this._shouldCalculate()) {
                this._init();
                this._calculate();
            }

            var ys = this._upperYVals.concat(this._lowerYVals),
                xmin = _minimum(this._xVals),
                xmax = _maximum(this._xVals),
                ymin = _minimum(ys),
                ymax = _maximum(ys);

            if (_DataInfo.isValid(xmin) && _DataInfo.isValid(xmax) && _DataInfo.isValid(ymin) && _DataInfo.isValid(ymax)) {
                rect = new Rect(xmin, ymin, xmax - xmin, ymax - ymin);
            }

            return rect;
        }

        _clearValues(): void {
            super._clearValues();
            this._upperYVals = null;
            this._lowerYVals = null;
            this._xVals = null;
        }

        _init(): void {
            super._init();
            this._upperYVals = [];
            this._lowerYVals = [];
            this._xVals = [];
        }

        _shouldCalculate(): boolean {
            return !this._upperYVals || !this._lowerYVals || !this._xVals;
        }

        // creates calculated values
        _calculate(): void {
            if (super._getLength() <= 0) {
                return;
            }

            var ys = super.getValues(0),
                xs = this._getXValues(),
                avgs: number[];

            // moving average calculations
            switch (this.type) {
                case MovingAverageType.Exponential:
                    avgs = _ema(ys, this.period);
                    break;
                case MovingAverageType.Simple:
                default:
                    avgs = _sma(ys, this.period);
                    break;
            }

            this._xVals = xs ? xs.slice(this.period - 1) : _range(this.period - 1, super._getLength() - 1);
            this._upperYVals = avgs.map((value: number) => value + (value * this.size));
            this._lowerYVals = avgs.map((value: number) => value - (value * this.size));
        }

        // custom rendering in order to draw multiple lines for a single SeriesBase object
        private _rendering(sender: Envelopes, args: RenderEventArgs): void {
            if (super._getLength() <= 0) {
                return;
            } else if (this._shouldCalculate()) {
                this._init();
                this._calculate();
            }

            var si = this.chart.series.indexOf(this),
                engine = args.engine,
                ax = this._getAxisX(), ay = this._getAxisY(),
                len = _minimum(this._upperYVals.length, this._lowerYVals.length, this._xVals.length),
                style = _BasePlotter.cloneStyle(this.style, ["fill"]),
                stroke = this._getSymbolStroke(si),
                clipPath = this.chart._plotrectId,
                swidth = 2;

            if (!len || len <= 0) { return; }

            engine.stroke = stroke;
            engine.strokeWidth = swidth;

            var xs: number[] = [],
                uys: number[] = [],
                lys: number[] = [],
                originalLen = this._getLength(),
                dpt: _DataPoint, area: _IHitArea, di: number;

            for (var i = 0; i < len; i++) {
                // data index
                di = originalLen - len + i;

                // x values
                xs.push(ax.convert(this._xVals[i]));

                // upper
                uys.push(ay.convert(this._upperYVals[i]));
                dpt = this._getDataPoint(this._xVals[i], this._upperYVals[i], si, di, ax, ay);
                area = new _CircleArea(new Point(xs[i], uys[i]), 0.5 * engine.strokeWidth);
                area.tag = dpt;
                this._hitTester.add(area, si);

                // lower
                lys.push(ay.convert(this._lowerYVals[i]));
                dpt = this._getDataPoint(this._xVals[i], this._lowerYVals[i], si, di, ax, ay);
                area = new _CircleArea(new Point(xs[i], lys[i]), 0.5 * engine.strokeWidth);
                area.tag = dpt;
                this._hitTester.add(area, si);
            }

            this._hitTester.add(new _LinesArea(xs, uys), si);
            this._hitTester.add(new _LinesArea(xs, lys), si);

            engine.drawLines(xs, uys, null, style, clipPath);
            engine.drawLines(xs, lys, null, style, clipPath);
        }

        getCalculatedValues(key: string): any[] {
            key = asString(key, false);

            var retval: any[] = [],
                i = 0;

            if (super._getLength() <= 0) {
                return retval;
            } else if (this._shouldCalculate()) {
                this._init();
                this._calculate();
            }

            switch (key) {
                case "upperEnvelope":
                    for (; i < this._upperYVals.length; i++) {
                        retval.push({
                            x: this._xVals[i],
                            y: this._upperYVals[i]
                        });
                    }
                    break;
                case "lowerEnvelope":
                    for (; i < this._lowerYVals.length; i++) {
                        retval.push({
                            x: this._xVals[i],
                            y: this._lowerYVals[i]
                        });
                    }
                    break;
            }

            return retval;
        }
    }
}