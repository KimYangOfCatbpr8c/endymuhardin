module wijmo.chart.finance.analytics {
    "use strict";

    /**
     * Represents a Commodity Channel Index indicator series for the @see:FinancialChart.
     *
     * The commodity channel index is an oscillator that measures an asset's current price
     * level relative to an average price level over a specified period of time.
     */
    export class CCI extends SingleOverlayIndicatorBase {
        private _constant = 0.015;

        constructor() {
            super();
            this.period = 20;
        }

        /**
         * Gets or sets the constant value for the CCI calculation.  The default
         * value is 0.015.
         */
        get constant(): number {
            return this._constant;
        }
        set constant(value: number) {
            if (value !== this._constant) {
                this._constant = asNumber(value, false);
                this._clearValues();
                this._invalidate();
            }
        }

        _calculate(): void {
            var originalLen = super._getLength();
            if (originalLen <= 0) {
                return;
            }

            var highs = super._getBindingValues(0),
                lows = super._getBindingValues(1),
                closes = super._getBindingValues(3),
                xs = this._getXValues();

            this._yvals = _cci(highs, lows, closes, this.period, this.constant);
            this._xvals = xs ? xs.slice(this.period - 1) : _range(this.period - 1, originalLen - 1);
        }
    }

    // calculate Commodity Channel Index for a set of financial data
    export function _cci(highs: number[], lows: number[], closes: number[], period: number, constant: number): number[] {
        asArray(highs, false); asArray(lows, false); asArray(closes, false);
        asInt(period, false, true);
        asNumber(constant, false, true);

        var len = _minimum(highs.length, lows.length, closes.length),
            typicalPrices: number[] = [],
            meanDeviations: number[] = [],
            smas: number[], i: number,
            ccis: number[] = [];

        assert(len > period && period > 1, "CCI period must be an integer less than the length of the data and greater than one.");

        // typical prices
        for (i = 0; i < len; i++) {
            typicalPrices.push(_average(highs[i], lows[i], closes[i]));
        }

        // simple moving average of typical prices
        smas = _sma(typicalPrices, period);

        // mean deviation
        var temp: number;
        for (i = 0; i < smas.length; i++) {
            temp = typicalPrices.slice(i, period + i)
                                .reduce((prev: number, curr: number) => prev + Math.abs(smas[i] - curr), 0);
            meanDeviations.push(temp / period);
        }

        // get subset of typical prices
        typicalPrices.splice(0, period - 1);

        // cci
        for (i = 0; i < smas.length; i++) {
            ccis.push((typicalPrices[i] - smas[i]) / (constant * meanDeviations[i]));
        }

        return ccis;
    }
}