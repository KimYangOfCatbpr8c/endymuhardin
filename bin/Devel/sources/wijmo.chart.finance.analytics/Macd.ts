module wijmo.chart.finance.analytics {
    "use strict";

    /**
     * Base class for @see:Macd and @see:MacdHistogram series (abstract).
     */
    export class MacdBase extends OverlayIndicatorBase {
        _macdXVals: number[];
        _macdVals: number[];
        _signalXVals: number[];
        _signalVals: number[];
        _histogramXVals: number[];
        _histogramVals: number[];

        private _fastPeriod = 12;
        private _slowPeriod = 26;
        private _smoothingPeriod = 9;

        constructor() {
            super();
        }

        /**
         * Gets or sets the fast exponential moving average period
         * for the MACD line.
         */
        get fastPeriod(): number {
            return this._fastPeriod;
        }
        set fastPeriod(value: number) {
            if (value !== this._fastPeriod) {
                this._fastPeriod = asInt(value, false, true);
                this._clearValues();
                this._invalidate();
            }
        }

        /**
         * Gets or sets the slow exponential moving average period
         * for the MACD line.
         */
        get slowPeriod(): number {
            return this._slowPeriod;
        }
        set slowPeriod(value: number) {
            if (value !== this._slowPeriod) {
                this._slowPeriod = asInt(value, false, true);
                this._clearValues();
                this._invalidate();
            }
        }

        /**
         * Gets or sets the exponential moving average period
         * for the signal line.
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

        _clearValues(): void {
            super._clearValues();
            this._macdVals = null;
            this._macdXVals = null;
            this._signalVals = null;
            this._signalXVals = null;
            this._histogramVals = null;
            this._histogramXVals = null;
        }

        _shouldCalculate(): boolean {
            return !this._macdVals || !this._macdXVals ||
                !this._signalVals || !this._signalXVals ||
                !this._histogramVals || !this._histogramXVals;
        }

        _init(): void {
            super._init();
            this._macdVals = [];
            this._macdXVals = [];
            this._signalVals = [];
            this._signalXVals = [];
            this._histogramVals = [];
            this._histogramXVals = [];
        }

        _calculate(): void {
            var originalLen = super._getLength();
            if (originalLen <= 0) {
                return;
            }

            var ys = super.getValues(0),
                xs = this._getXValues();

            var values = _macd(ys, this.fastPeriod, this.slowPeriod, this.smoothingPeriod);
            this._macdVals = values.macds;
            this._signalVals = values.signals;
            this._histogramVals = values.histograms;

            this._macdXVals = xs ? xs.slice(originalLen - this._macdVals.length, originalLen) : _range(originalLen - this._macdVals.length, originalLen - 1);
            this._signalXVals = xs ? xs.slice(originalLen - this._signalVals.length, originalLen) : _range(originalLen - this._signalVals.length, originalLen - 1);
            this._histogramXVals = xs ? xs.slice(originalLen - this._histogramVals.length, originalLen) : _range(originalLen - this._histogramVals.length, originalLen - 1);
        }
    }

    /**
     * Represents a Moving Average Convergence/Divergence (MACD) indicator series
     * for the @see:FinancialChart.
     *
     * The MACD indicator is designed to reveal changes in strength, direction, momentum,
     * and duration of an asset's price trend.
     */
    export class Macd extends MacdBase {
        constructor() {
            super();

            this._seriesCount = 2;

            this.rendering.addHandler(this._rendering, this);
        }

        /**
         * Gets or sets the styles for the MACD and Signal lines.
         *
         * The following options are supported:
         *
         * <pre>series.styles = {
         *   macdLine: {
         *      stroke: 'red',
         *      strokeWidth: 1
         *   },
         *   signalLine: {
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

            var ys: number[] = [],
                xs: number[] = [];

            xs.push.apply(xs, this._macdXVals);
            xs.push.apply(xs, this._signalXVals);
            ys.push.apply(ys, this._macdVals);
            ys.push.apply(ys, this._signalVals);

            var xmin = _minimum(xs),
                xmax = _maximum(xs),
                ymin = _minimum(ys),
                ymax = _maximum(ys);

            if (_DataInfo.isValid(xmin) && _DataInfo.isValid(xmax) && _DataInfo.isValid(ymin) && _DataInfo.isValid(ymax)) {
                rect = new Rect(xmin, ymin, xmax - xmin, ymax - ymin);
            }

            return rect;
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
                macdStyle = null, macdStroke = stroke, macdStrokeWidth = swidth,
                signalStyle = null, signalStroke = stroke, signalStrokeWidth = swidth;

            // handle "styles"
            if (this.styles && isObject(this.styles)) {
                if (this.styles.macdLine && isObject(this.styles.macdLine)) {
                    macdStyle = _BasePlotter.cloneStyle(this.styles.macdLine, ["fill"]);
                    macdStroke = macdStyle.stroke ? macdStyle.stroke : stroke;
                    macdStrokeWidth = macdStyle.strokeWidth ? macdStyle.strokeWidth : swidth;
                }

                if (this.styles.signalLine && isObject(this.styles.signalLine)) {
                    signalStyle = _BasePlotter.cloneStyle(this.styles.signalLine, ["fill"]);
                    signalStroke = signalStyle.stroke ? signalStyle.stroke : stroke;
                    signalStrokeWidth = signalStyle.strokeWidth ? signalStyle.strokeWidth : swidth;
                }
            }

            var macdVals: number[] = [],
                macdXVals: number[] = [],
                signalVals: number[] = [],
                signalXVals: number[] = [],
                dpt: _DataPoint, area: _IHitArea,
                originalLen = this._getLength(),
                i: number, di: number;

            // macd line
            for (i = 0; i < this._macdVals.length; i++) {
                // data index
                di = originalLen - this._macdVals.length + i;

                // x & yvalues
                macdXVals.push(ax.convert(this._macdXVals[i]));
                macdVals.push(ay.convert(this._macdVals[i]));

                // hit testing
                dpt = this._getDataPoint(this._macdXVals[i], this._macdVals[i], si, di, ax, ay);
                dpt["name"] = this._getName(0);
                area = new _CircleArea(new Point(macdXVals[i], macdVals[i]), 0.5 * engine.strokeWidth);
                area.tag = dpt;
                this._hitTester.add(area, si);
            }
            this._hitTester.add(new _LinesArea(macdXVals, macdVals), si);
            engine.stroke = macdStroke;
            engine.strokeWidth = macdStrokeWidth;
            engine.drawLines(macdXVals, macdVals, null, style, clipPath);

            // signal line
            for (i = 0; i < this._signalVals.length; i++) {
                // data index
                di = originalLen - this._signalVals.length + i;

                // x & yvalues
                signalXVals.push(ax.convert(this._signalXVals[i]));
                signalVals.push(ay.convert(this._signalVals[i]));

                // hit testing
                dpt = this._getDataPoint(this._signalXVals[i], this._signalVals[i], si, di, ax, ay);
                dpt["name"] = this._getName(1);
                area = new _CircleArea(new Point(signalXVals[i], signalVals[i]), 0.5 * engine.strokeWidth);
                area.tag = dpt;
                this._hitTester.add(area, si);
            }
            this._hitTester.add(new _LinesArea(signalXVals, signalVals), si);
            engine.stroke = signalStroke;
            engine.strokeWidth = signalStrokeWidth;
            engine.drawLines(signalXVals, signalVals, null, style, clipPath);
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
                case "macdLine":
                    for (; i < this._macdVals.length; i++) {
                        retval.push({
                            x: this._macdXVals[i],
                            y: this._macdVals[i]
                        });
                    }
                    break;
                case "signalLine":
                    for (; i < this._signalVals.length; i++) {
                        retval.push({
                            x: this._signalXVals[i],
                            y: this._signalVals[i]
                        });
                    }
                    break;
            }

            return retval;
        }
    }

    /**
     * Represents a Moving Average Convergence/Divergence (MACD) Histogram indicator series
     * for the @see:FinancialChart.
     *
     * The MACD indicator is designed to reveal changes in strength, direction, momentum,
     * and duration of an asset's price trend.
     */
    export class MacdHistogram extends MacdBase {
        constructor() {
            super();
        }

        getValues(dim: number): number[] {
            var retval: number[] = null;
            if (super._getLength() <= 0) {
                return retval;
            } else if (this._shouldCalculate()) {
                this._init();
                this._calculate();
            }

            if (dim === 0) {
                retval = this._histogramVals;
            } else if (dim === 1) {
                retval = this._histogramXVals;
            }

            return retval;
        }

        getDataRect(): Rect {
            var rect: Rect = null;
            if (super._getLength() <= 0) {
                return rect;
            } else if (this._shouldCalculate()) {
                this._init();
                this._calculate();
            }

            var xmin = _minimum(this._histogramXVals),
                xmax = _maximum(this._histogramXVals),
                ymin = _minimum(this._histogramVals),
                ymax = _maximum(this._histogramVals);

            if (_DataInfo.isValid(xmin) && _DataInfo.isValid(xmax) && _DataInfo.isValid(ymin) && _DataInfo.isValid(ymax)) {
                rect = new Rect(xmin, ymin, xmax - xmin, ymax - ymin);
            }

            return rect;
        }

        _getChartType(): ChartType {
            return ChartType.Column;
        }

        // override to get correct item for hit testing
        _getItem(pointIndex: number): any {
            var originalLen = super._getLength(),
                len = _minimum(this._histogramVals.length, this._histogramXVals.length);

            // data index
            pointIndex = originalLen - len + pointIndex;
            return super._getItem(pointIndex);
        }
    }


    // calculate MACD for a set of financial data
    export function _macd(ys: number[], fastPeriod: number, slowPeriod: number, smoothingPeriod: number): any {
        asArray(ys, false);
        asInt(fastPeriod, false, true); asInt(slowPeriod, false, true); asInt(smoothingPeriod, false, true);

        var opposite = fastPeriod > slowPeriod,
            temp: number;
        if (opposite) {
            temp = slowPeriod;
            slowPeriod = fastPeriod;
            fastPeriod = temp;
        }

        var fastEmas = _ema(ys, fastPeriod),
            slowEmas = _ema(ys, slowPeriod),
            macds: number[] = [],
            histograms: number[] = [],
            signals: number[], i: number;

        // get subset of fast emas for macd line calculation
        fastEmas.splice(0, slowPeriod - fastPeriod);

        // macd line
        for (i = 0; i < fastEmas.length; i++) {
            temp = fastEmas[i] - slowEmas[i];
            if (opposite) temp *= -1;
            macds.push(temp);
        }

        // signal line
        signals = _ema(macds, smoothingPeriod);

        // macd histogram
        var macdTemp = macds.slice(macds.length - signals.length, macds.length);
        for (i = 0; i < macdTemp.length; i++) {
            histograms.push(macdTemp[i] - signals[i]);
        }

        return {
            macds: macds,
            signals: signals,
            histograms: histograms
        };
    }
}