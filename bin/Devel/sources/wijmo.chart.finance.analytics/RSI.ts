module wijmo.chart.finance.analytics {
    "use strict";

    /**
     * Represents a Relative Strength Index indicator series for the @see:FinancialChart.
     *
     * Relative strength index is a momentum osciallator designed to measure the current
     * and historical strength or weakness of an asset based on the closing prices of a
     * recent trading period.
     */
    export class RSI extends SingleOverlayIndicatorBase {
        constructor() {
            super();
            this.period = 14;
        }

        _calculate(): void {
            var originalLen = super._getLength();
            if (originalLen <= 0) {
                return;
            }

            var ys = super._getBindingValues(0), // getValues(0) is overridden
                xs = this._getXValues();

            this._yvals = _rsi(ys, this.period);
            this._xvals = xs ? xs.slice(this.period) : _range(this.period, originalLen);
        }
    }

    // calculate Relative Strength Index for a set of financial data
    export function _rsi(ys: number[], period: number): number[] {
        asArray(ys, false);
        asInt(period, true, false);
        assert(ys.length > period && period > 1, "RSI period must be an integer less than the length of the data and greater than one.");

        var changes: number[] = [],
            avgGains: number[] = [],
            avgLosses: number[] = [],
            gains: number[], losses: number[],
            rsis: number[] = [],
            rs: number, i: number;

        // calculate changes
        for (i = 1; i < ys.length; i++) {
            changes.push(ys[i] - ys[i - 1]);
        }

        // get gains and losses
        gains = changes.map((value: number) => value > 0 ? value : 0);
        losses = changes.map((value: number) => value < 0 ? Math.abs(value) : 0);

        // calculate rs and rsi
        for (i = period; i <= changes.length; i++) {
            if (i === period) {
                avgGains.push(_sum(gains.slice(i - period, i)) / period);
                avgLosses.push(_sum(losses.slice(i - period, i)) / period);
            } else {
                avgGains.push((gains[i - 1] + (avgGains[i - period - 1] * (period - 1))) / period);
                avgLosses.push((losses[i - 1] + (avgLosses[i - period - 1] * (period - 1))) / period);
            }

            rs = avgGains[i - period] / avgLosses[i - period];
            rs = isFinite(rs) ? rs : 0;
            rsis.push(100 - (100 / (1 + rs)));
        }

        return rsis;
    }
}