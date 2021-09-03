var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var chart;
    (function (chart) {
        var finance;
        (function (finance) {
            var analytics;
            (function (analytics) {
                "use strict";
                /**
                 * Represents a Relative Strength Index indicator series for the @see:FinancialChart.
                 *
                 * Relative strength index is a momentum osciallator designed to measure the current
                 * and historical strength or weakness of an asset based on the closing prices of a
                 * recent trading period.
                 */
                var RSI = (function (_super) {
                    __extends(RSI, _super);
                    function RSI() {
                        _super.call(this);
                        this.period = 14;
                    }
                    RSI.prototype._calculate = function () {
                        var originalLen = _super.prototype._getLength.call(this);
                        if (originalLen <= 0) {
                            return;
                        }
                        var ys = _super.prototype._getBindingValues.call(this, 0), // getValues(0) is overridden
                        xs = this._getXValues();
                        this._yvals = _rsi(ys, this.period);
                        this._xvals = xs ? xs.slice(this.period) : finance._range(this.period, originalLen);
                    };
                    return RSI;
                }(analytics.SingleOverlayIndicatorBase));
                analytics.RSI = RSI;
                // calculate Relative Strength Index for a set of financial data
                function _rsi(ys, period) {
                    wijmo.asArray(ys, false);
                    wijmo.asInt(period, true, false);
                    wijmo.assert(ys.length > period && period > 1, "RSI period must be an integer less than the length of the data and greater than one.");
                    var changes = [], avgGains = [], avgLosses = [], gains, losses, rsis = [], rs, i;
                    // calculate changes
                    for (i = 1; i < ys.length; i++) {
                        changes.push(ys[i] - ys[i - 1]);
                    }
                    // get gains and losses
                    gains = changes.map(function (value) { return value > 0 ? value : 0; });
                    losses = changes.map(function (value) { return value < 0 ? Math.abs(value) : 0; });
                    // calculate rs and rsi
                    for (i = period; i <= changes.length; i++) {
                        if (i === period) {
                            avgGains.push(finance._sum(gains.slice(i - period, i)) / period);
                            avgLosses.push(finance._sum(losses.slice(i - period, i)) / period);
                        }
                        else {
                            avgGains.push((gains[i - 1] + (avgGains[i - period - 1] * (period - 1))) / period);
                            avgLosses.push((losses[i - 1] + (avgLosses[i - period - 1] * (period - 1))) / period);
                        }
                        rs = avgGains[i - period] / avgLosses[i - period];
                        rs = isFinite(rs) ? rs : 0;
                        rsis.push(100 - (100 / (1 + rs)));
                    }
                    return rsis;
                }
                analytics._rsi = _rsi;
            })(analytics = finance.analytics || (finance.analytics = {}));
        })(finance = chart.finance || (chart.finance = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=RSI.js.map