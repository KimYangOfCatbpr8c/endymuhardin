module wijmo.chart.finance.analytics {
    "use strict";

    /**
     * Represents a Willaims %R indicator series for the @see:FinancialChart.
     *
     * Williams %R is a momentum indicator that is the inverse of a fast stochastic
     * oscillator (@see:Stochastic).  The Williams %R indicator is designed to
     * tell whether an asset is trading near the high or low of its trading range.
     */
    export class WilliamsR extends SingleOverlayIndicatorBase {
        constructor() {
            super();
            this.period = 14;
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

            this._yvals = _williamsR(highs, lows, closes, this.period);
            this._xvals = xs ? xs.slice(this.period - 1) : _range(this.period - 1, originalLen - 1);
        }
    }

    // calculate Williams %R for a set of financial data
    export function _williamsR(highs: number[], lows: number[], closes: number[], period: number): number[] {
        asArray(highs, false); asArray(lows, false); asArray(closes, false);
        asInt(period, false, true);

        var len = _minimum(highs.length, lows.length, closes.length),
            extremeHighs: number[] = [],
            extremeLows: number[] = [],
            williamsRs: number[] = [],
            i: number;

        assert(len > period && period > 1, "Williams %R period must be an integer less than the length of the data and greater than one.");

        // get extreme high/low for each period
        for (i = period; i <= highs.length; i++) {
            extremeHighs.push(_maximum(highs.slice(i - period, i)));
            extremeLows.push(_minimum(lows.slice(i - period, i)));
        }

        // get subset of closing prices
        closes.splice(0, period - 1);

        // williams %r
        for (i = 0; i < extremeHighs.length; i++) {
            williamsRs.push((extremeHighs[i] - closes[i]) / (extremeHighs[i] - extremeLows[i]) * -100);
        }

        return williamsRs;
    }
}