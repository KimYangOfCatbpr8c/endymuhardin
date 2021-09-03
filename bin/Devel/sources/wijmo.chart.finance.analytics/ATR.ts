module wijmo.chart.finance.analytics {
    "use strict";

    /**
     * Represents an Average True Range indicator series for the @see:FinancialChart.
     *
     * Average true range is used to measure the volatility of an asset. Average true range
     * does not provide any indication of the price's trend, but rather the degree of price
     * volatility.
     */
    export class ATR extends SingleOverlayIndicatorBase {
        constructor() {
            super();
            this.period = 14;
        }

        _calculate(): void {
            if (super._getLength() <= 0) {
                return;
            }

            var highs = super._getBindingValues(0),
                lows = super._getBindingValues(1),
                closes = super._getBindingValues(3),
                xs = this._getXValues();

            this._yvals = _avgTrueRng(highs, lows, closes, this.period);
            this._xvals = xs ? xs.slice(this.period - 1) : _range(this.period - 1, highs.length);
        }
    }
}