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
                 * Represents a Willaims %R indicator series for the @see:FinancialChart.
                 *
                 * Williams %R is a momentum indicator that is the inverse of a fast stochastic
                 * oscillator (@see:Stochastic).  The Williams %R indicator is designed to
                 * tell whether an asset is trading near the high or low of its trading range.
                 */
                var WilliamsR = (function (_super) {
                    __extends(WilliamsR, _super);
                    function WilliamsR() {
                        _super.call(this);
                        this.period = 14;
                    }
                    WilliamsR.prototype._calculate = function () {
                        var originalLen = _super.prototype._getLength.call(this);
                        if (originalLen <= 0) {
                            return;
                        }
                        var highs = _super.prototype._getBindingValues.call(this, 0), lows = _super.prototype._getBindingValues.call(this, 1), closes = _super.prototype._getBindingValues.call(this, 3), xs = this._getXValues();
                        this._yvals = _williamsR(highs, lows, closes, this.period);
                        this._xvals = xs ? xs.slice(this.period - 1) : finance._range(this.period - 1, originalLen - 1);
                    };
                    return WilliamsR;
                }(analytics.SingleOverlayIndicatorBase));
                analytics.WilliamsR = WilliamsR;
                // calculate Williams %R for a set of financial data
                function _williamsR(highs, lows, closes, period) {
                    wijmo.asArray(highs, false);
                    wijmo.asArray(lows, false);
                    wijmo.asArray(closes, false);
                    wijmo.asInt(period, false, true);
                    var len = finance._minimum(highs.length, lows.length, closes.length), extremeHighs = [], extremeLows = [], williamsRs = [], i;
                    wijmo.assert(len > period && period > 1, "Williams %R period must be an integer less than the length of the data and greater than one.");
                    // get extreme high/low for each period
                    for (i = period; i <= highs.length; i++) {
                        extremeHighs.push(finance._maximum(highs.slice(i - period, i)));
                        extremeLows.push(finance._minimum(lows.slice(i - period, i)));
                    }
                    // get subset of closing prices
                    closes.splice(0, period - 1);
                    // williams %r
                    for (i = 0; i < extremeHighs.length; i++) {
                        williamsRs.push((extremeHighs[i] - closes[i]) / (extremeHighs[i] - extremeLows[i]) * -100);
                    }
                    return williamsRs;
                }
                analytics._williamsR = _williamsR;
            })(analytics = finance.analytics || (finance.analytics = {}));
        })(finance = chart.finance || (chart.finance = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=WilliamsR.js.map