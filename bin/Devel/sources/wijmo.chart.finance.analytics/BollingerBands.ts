module wijmo.chart.finance.analytics {
    "use strict";

    /**
     * Represents a Bollinger Bands&reg; overlay series for the @see:FinancialChart.
     *
     * <i>Bollinger Bands is a registered trademark of John Bollinger.</i>
     */
    export class BollingerBands extends OverlayIndicatorBase {
        private _upperYVals: number[];
        private _middleYVals: number[];
        private _lowerYVals: number[];
        private _xVals: number[];

        private _period = 20;
        private _multiplier = 2;

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
         * Gets or sets the standard deviation multiplier.
         */
        get multiplier(): number {
            return this._multiplier;
        }
        set multiplier(value: number) {
            if (value !== this._multiplier) {
                this._multiplier = asNumber(value, false, true);
                this._clearValues();
                this._invalidate();
            }
        }

        getDataRect(): Rect {
            if (super._getLength() <= 0) {
                return null;
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
                return new Rect(xmin, ymin, xmax - xmin, ymax - ymin);
            } else {
                return null;
            }
        }

        _clearValues(): void {
            super._clearValues();
            this._upperYVals = null;
            this._middleYVals = null;
            this._lowerYVals = null;
            this._xVals = null;
        }

        _shouldCalculate(): boolean {
            return !this._upperYVals || !this._middleYVals || !this._lowerYVals || !this._xVals;
        }

        _init(): void {
            super._init();
            this._upperYVals = [];
            this._middleYVals = [];
            this._lowerYVals = [];
            this._xVals = [];
        }

        _calculate(): void {
            var originalLen = super._getLength();
            if (originalLen <= 0) {
                return;
            }

            var ys = super.getValues(0),
                xs = this._getXValues();

            var values = _bollingerBands(ys, this.period, this.multiplier);
            this._upperYVals = values.uppers;
            this._middleYVals = values.middles;
            this._lowerYVals = values.lowers;
            this._xVals = xs ? xs.slice(this.period - 1) : _range(this.period - 1, originalLen - 1);
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
                len = _minimum(this._upperYVals.length, this._middleYVals.length, this._lowerYVals.length, this._xVals.length),
                style = _BasePlotter.cloneStyle(this.style, ["fill"]),
                stroke = this._getSymbolStroke(si),
                clipPath = this.chart._plotrectId,
                swidth = 2;

            if (!len || len <= 0) { return; }

            engine.stroke = stroke;
            engine.strokeWidth = swidth;

            var xs: number[] = [],
                uys: number[] = [],
                mys: number[] = [],
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

                // middle
                mys.push(ay.convert(this._middleYVals[i]));
                dpt = this._getDataPoint(this._xVals[i], this._middleYVals[i], si, di, ax, ay);
                area = new _CircleArea(new Point(xs[i], mys[i]), 0.5 * engine.strokeWidth);
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
            this._hitTester.add(new _LinesArea(xs, mys), si);
            this._hitTester.add(new _LinesArea(xs, lys), si);

            engine.drawLines(xs, uys, null, style, clipPath);
            engine.drawLines(xs, mys, null, style, clipPath);
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
                case "upperBand":
                    for (; i < this._upperYVals.length; i++) {
                        retval.push({
                            x: this._xVals[i],
                            y: this._upperYVals[i]
                        });
                    }
                    break;
                case "middleBand":
                    for (; i < this._middleYVals.length; i++) {
                        retval.push({
                            x: this._xVals[i],
                            y: this._middleYVals[i]
                        });
                    }
                    break;
                case "lowerBand":
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

    // calculate Bollinger Bands for a set of financial data
    export function _bollingerBands(ys: number[], period: number, multiplier: number): any {
        asArray(ys, false);
        asInt(period, false, true);
        asNumber(multiplier, false, true);
        assert(ys.length > period && period > 1, "Bollinger Bands period must be an integer less than the length of the data and greater than one.");

        var avgs = _sma(ys, period),
            devs: number[] = [],
            i: number;

        // get standard deviations
        for (i = period; i <= ys.length; i++) {
            devs.push(_stdDeviation(ys.slice(i - period, i)));
        }

        var middles = avgs,
            uppers = avgs.map((value: number, index: number) => value + (devs[index] * multiplier)),
            lowers = avgs.map((value: number, index: number) => value - (devs[index] * multiplier));

        return {
            lowers: lowers,
            middles: middles,
            uppers: uppers
        };
    }
}