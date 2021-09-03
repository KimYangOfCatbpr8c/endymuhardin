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
                 * Represents a Commodity Channel Index indicator series for the @see:FinancialChart.
                 *
                 * The commodity channel index is an oscillator that measures an asset's current price
                 * level relative to an average price level over a specified period of time.
                 */
                var CCI = (function (_super) {
                    __extends(CCI, _super);
                    function CCI() {
                        _super.call(this);
                        this._constant = 0.015;
                        this.period = 20;
                    }
                    Object.defineProperty(CCI.prototype, "constant", {
                        /**
                         * Gets or sets the constant value for the CCI calculation.  The default
                         * value is 0.015.
                         */
                        get: function () {
                            return this._constant;
                        },
                        set: function (value) {
                            if (value !== this._constant) {
                                this._constant = wijmo.asNumber(value, false);
                                this._clearValues();
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    CCI.prototype._calculate = function () {
                        var originalLen = _super.prototype._getLength.call(this);
                        if (originalLen <= 0) {
                            return;
                        }
                        var highs = _super.prototype._getBindingValues.call(this, 0), lows = _super.prototype._getBindingValues.call(this, 1), closes = _super.prototype._getBindingValues.call(this, 3), xs = this._getXValues();
                        this._yvals = _cci(highs, lows, closes, this.period, this.constant);
                        this._xvals = xs ? xs.slice(this.period - 1) : finance._range(this.period - 1, originalLen - 1);
                    };
                    return CCI;
                }(analytics.SingleOverlayIndicatorBase));
                analytics.CCI = CCI;
                // calculate Commodity Channel Index for a set of financial data
                function _cci(highs, lows, closes, period, constant) {
                    wijmo.asArray(highs, false);
                    wijmo.asArray(lows, false);
                    wijmo.asArray(closes, false);
                    wijmo.asInt(period, false, true);
                    wijmo.asNumber(constant, false, true);
                    var len = finance._minimum(highs.length, lows.length, closes.length), typicalPrices = [], meanDeviations = [], smas, i, ccis = [];
                    wijmo.assert(len > period && period > 1, "CCI period must be an integer less than the length of the data and greater than one.");
                    // typical prices
                    for (i = 0; i < len; i++) {
                        typicalPrices.push(finance._average(highs[i], lows[i], closes[i]));
                    }
                    // simple moving average of typical prices
                    smas = finance._sma(typicalPrices, period);
                    // mean deviation
                    var temp;
                    for (i = 0; i < smas.length; i++) {
                        temp = typicalPrices.slice(i, period + i)
                            .reduce(function (prev, curr) { return prev + Math.abs(smas[i] - curr); }, 0);
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
                analytics._cci = _cci;
            })(analytics = finance.analytics || (finance.analytics = {}));
        })(finance = chart.finance || (chart.finance = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=CCI.js.map