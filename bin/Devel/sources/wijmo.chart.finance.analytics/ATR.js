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
                 * Represents an Average True Range indicator series for the @see:FinancialChart.
                 *
                 * Average true range is used to measure the volatility of an asset. Average true range
                 * does not provide any indication of the price's trend, but rather the degree of price
                 * volatility.
                 */
                var ATR = (function (_super) {
                    __extends(ATR, _super);
                    function ATR() {
                        _super.call(this);
                        this.period = 14;
                    }
                    ATR.prototype._calculate = function () {
                        if (_super.prototype._getLength.call(this) <= 0) {
                            return;
                        }
                        var highs = _super.prototype._getBindingValues.call(this, 0), lows = _super.prototype._getBindingValues.call(this, 1), closes = _super.prototype._getBindingValues.call(this, 3), xs = this._getXValues();
                        this._yvals = finance._avgTrueRng(highs, lows, closes, this.period);
                        this._xvals = xs ? xs.slice(this.period - 1) : finance._range(this.period - 1, highs.length);
                    };
                    return ATR;
                }(analytics.SingleOverlayIndicatorBase));
                analytics.ATR = ATR;
            })(analytics = finance.analytics || (finance.analytics = {}));
        })(finance = chart.finance || (chart.finance = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ATR.js.map