module wijmo.chart.finance.analytics {
    "use strict";

    /**
     * Represents a Stochastic Oscillator indicator series for the @see:FinancialChart.
     *
     * Stochastic oscillators are momentum indicators designed to predict price turning
     * points by comparing an asset's closing price to its high-low range.
     *
     * The @see:Stochastic series can be used for fast (default), slow and full stochastic
     * oscillators.  To create a slow or full stochastic oscillator, set the @see:smoothingPeriod
     * to an integer value greater than one; slow stochastic oscillators generally use a fixed
     * @see:smoothingPeriod of three.  To create or revert to a fast stochastic oscillator, set the
     * @see:smoothingPeriod to an integer value of one.
     */
    export class Stochastic extends OverlayIndicatorBase {
        private _kVals: number[];
        private _kXVals: number[];
        private _dVals: number[];
        private _dXVals: number[];

        private _kPeriod = 14;
        private _dPeriod = 3;
        private _smoothingPeriod = 1;

        constructor() {
            super();

            this._seriesCount = 2;

            this.rendering.addHandler(this._rendering, this);
        }

        /**
         * Gets or sets the period for the %K calculation.
         */
        get kPeriod(): number {
            return this._kPeriod;
        }
        set kPeriod(value: number) {
            if (value !== this._kPeriod) {
                this._kPeriod = asInt(value, false, true);
                this._clearValues();
                this._invalidate();
            }
        }

        /**
         * Gets or sets the period for the %D simple moving average.
         */
        get dPeriod(): number {
            return this._dPeriod;
        }
        set dPeriod(value: number) {
            if (value !== this._dPeriod) {
                this._dPeriod = asInt(value, false, true);
                this._clearValues();
                this._invalidate();
            }
        }

        /**
         * Gets or sets the smoothing period for full %K.
         */
        get smoothingPeriod(): number {
            return this._smoothingPeriod;
        }
        set smoothingPeriod(value: number) {
            if (value !== this._smoothingPeriod) {
                this._smoothingPeriod = asInt(value, false, true);
                this._clearValues();
                this._invalidate();
            }
        }

        /**
         * Gets or sets the styles for the %K and %D lines.
         *
         * The following options are supported:
         *
         * <pre>series.styles = {
         *   kLine: {
         *      stroke: 'red',
         *      strokeWidth: 1
         *   },
         *   dLine: {
         *      stroke: 'green',
         *      strokeWidth: 1
         *   },
         * }</pre>
         */
        get styles(): any {
            return this._styles;
        }
        set styles(value: any) {
            if (value !== this._styles) {
                this._styles = value;
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

            var ys = this._kVals.concat(this._dVals),
                xs = this._kXVals.concat(this._dXVals),
                xmin = _minimum(xs),
                xmax = _maximum(xs),
                ymin = _minimum(ys),
                ymax = _maximum(ys);

            if (_DataInfo.isValid(xmin) && _DataInfo.isValid(xmax) && _DataInfo.isValid(ymin) && _DataInfo.isValid(ymax)) {
                rect = new Rect(xmin, ymin, xmax - xmin, ymax - ymin);
            }

            return rect;
        }

        _clearValues(): void {
            super._clearValues();
            this._kVals = null;
            this._kXVals = null;
            this._dVals = null;
            this._dXVals = null;
        }

        _shouldCalculate(): boolean {
            return !this._kVals || !this._kXVals ||
                !this._dVals || !this._dXVals;
        }

        _init(): void {
            super._init();
            this._kVals = [];
            this._kXVals = [];
            this._dVals = [];
            this._dXVals = [];
        }

        _calculate(): void {
            var originalLen = super._getLength();
            if (super._getLength() <= 0) {
                return;
            }

            var highs = super._getBindingValues(0),
                lows = super._getBindingValues(1),
                closes = super._getBindingValues(3),
                xs = this._getXValues();

            var values = _stochastic(highs, lows, closes, this.kPeriod, this.dPeriod, this.smoothingPeriod);
            this._kVals = values.ks;
            this._dVals = values.ds;

            // get %K x-values
            this._kXVals = xs ? xs.slice(this.kPeriod - 1) : _range(this.kPeriod - 1, originalLen - 1);
            if (this.smoothingPeriod && this.smoothingPeriod > 1) {
                this._kXVals = this._kXVals.slice(this._kXVals.length - this._kVals.length, this._kXVals.length);
            }

            // get %D x-values
            this._dXVals = this._kXVals.slice(this._kXVals.length - this._dVals.length, this._kXVals.length);
        }

        private _rendering(sender: SeriesBase, args: RenderEventArgs): void {
            if (super._getLength() <= 0) {
                return;
            } else if (this._shouldCalculate()) {
                this._init();
                this._calculate();
            }

            var si = this.chart.series.indexOf(this),
                engine = args.engine,
                ax = this._getAxisX(), ay = this._getAxisY(),
                style = _BasePlotter.cloneStyle(this.style, ["fill"]),
                stroke = this._getSymbolStroke(si),
                clipPath = this.chart._plotrectId,
                swidth = 2,
                kStyle = null, kStroke = stroke, kStrokeWidth = swidth,
                dStyle = null, dStroke = stroke, dStrokeWidth = swidth;

            // handle "styles"
            if (this.styles && isObject(this.styles)) {
                if (this.styles.kLine && isObject(this.styles.kLine)) {
                    kStyle = _BasePlotter.cloneStyle(this.styles.kLine, ["fill"]);
                    kStroke = kStyle.stroke ? kStyle.stroke : stroke;
                    kStrokeWidth = kStyle.strokeWidth ? kStyle.strokeWidth : swidth;
                }

                if (this.styles.dLine && isObject(this.styles.dLine)) {
                    dStyle = _BasePlotter.cloneStyle(this.styles.dLine, ["fill"]);
                    dStroke = dStyle.stroke ? dStyle.stroke : stroke;
                    dStrokeWidth = dStyle.strokeWidth ? dStyle.strokeWidth : swidth;
                }
            }

            var kVals: number[] = [],
                kXVals: number[] = [],
                dVals: number[] = [],
                dXVals: number[] = [],
                originalLen = this._getLength(),
                dpt: _DataPoint, area: _IHitArea,
                i: number, di: number;

            // %K
            for (i = 0; i < this._kVals.length; i++) {
                // data index
                di = originalLen - this._kVals.length + i;

                // x & yvalues
                kXVals.push(ax.convert(this._kXVals[i]));
                kVals.push(ay.convert(this._kVals[i]));

                // hit testing
                dpt = this._getDataPoint(this._kXVals[i], this._kVals[i], si, di, ax, ay);
                dpt["name"] = this._getName(0);
                area = new _CircleArea(new Point(kXVals[i], kVals[i]), 0.5 * engine.strokeWidth);
                area.tag = dpt;
                this._hitTester.add(area, si);
            }
            this._hitTester.add(new _LinesArea(kXVals, kVals), si);
            engine.stroke = kStroke;
            engine.strokeWidth = kStrokeWidth;
            engine.drawLines(kXVals, kVals, null, style, clipPath);

            // %D
            for (i = 0; i < this._dVals.length; i++) {
                // data index
                di = originalLen - this._dVals.length + i;

                // x & yvalues
                dXVals.push(ax.convert(this._dXVals[i]));
                dVals.push(ay.convert(this._dVals[i]));

                // hit testing
                dpt = this._getDataPoint(this._dXVals[i], this._dVals[i], si, di, ax, ay);
                dpt["name"] = this._getName(1);
                area = new _CircleArea(new Point(dXVals[i], dVals[i]), 0.5 * engine.strokeWidth);
                area.tag = dpt;
                this._hitTester.add(area, si);
            }
            this._hitTester.add(new _LinesArea(dXVals, dVals), si);
            engine.stroke = dStroke;
            engine.strokeWidth = dStrokeWidth;
            engine.drawLines(dXVals, dVals, null, style, clipPath);
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

            switch(key) {
                case "kLine":
                    for (; i < this._kVals.length; i++) {
                        retval.push({
                            x: this._kXVals[i],
                            y: this._kVals[i]
                        });
                    }
                    break;
                case "dLine":
                    for (; i < this._dVals.length; i++) {
                        retval.push({
                            x: this._dXVals[i],
                            y: this._dVals[i]
                        });
                    }
                    break;
            }

            return retval;
        }
    }

    // calculate Stochastics for a set of financial data
    export function _stochastic(highs: number[], lows: number[], closes: number[], kPeriod: number, dPeriod: number, smoothingPeriod: number): any {
        asArray(highs, false); asArray(lows, false); asArray(closes, false);
        asInt(kPeriod, false, true); asInt(dPeriod, false, true); asInt(smoothingPeriod, true, true);

        var extremeHighs: number[] = [],
            extremeLows: number[] = [],
            kvals: number[] = [],
            dvals: number[], i: number;

        // get extreme highs/lows for each period
        for (i = kPeriod; i <= highs.length; i++) {
            extremeHighs.push(_maximum(highs.slice(i - kPeriod, i)));
            extremeLows.push(_minimum(lows.slice(i - kPeriod, i)));
        }

        // get subset of closing prices
        closes = closes.slice(kPeriod - 1);

        // %K
        for (i = 0; i < closes.length; i++) {
            kvals.push((closes[i] - extremeLows[i]) / (extremeHighs[i] - extremeLows[i]) * 100);
        }

        // %K in slow/full
        if (smoothingPeriod && smoothingPeriod > 1) {
            kvals = _sma(kvals, smoothingPeriod);
        }

        // %D
        dvals = _sma(kvals, dPeriod);

        return {
            ks: kvals,
            ds: dvals
        };
    }
}