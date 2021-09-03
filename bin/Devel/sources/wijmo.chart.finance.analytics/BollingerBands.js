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
                 * Represents a Bollinger Bands&reg; overlay series for the @see:FinancialChart.
                 *
                 * <i>Bollinger Bands is a registered trademark of John Bollinger.</i>
                 */
                var BollingerBands = (function (_super) {
                    __extends(BollingerBands, _super);
                    function BollingerBands() {
                        _super.call(this);
                        this._period = 20;
                        this._multiplier = 2;
                        this.rendering.addHandler(this._rendering, this);
                    }
                    Object.defineProperty(BollingerBands.prototype, "period", {
                        /**
                         * Gets or sets the period for the calculation as an integer value.
                         */
                        get: function () {
                            return this._period;
                        },
                        set: function (value) {
                            if (value !== this._period) {
                                this._period = wijmo.asInt(value, false, true);
                                this._clearValues();
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(BollingerBands.prototype, "multiplier", {
                        /**
                         * Gets or sets the standard deviation multiplier.
                         */
                        get: function () {
                            return this._multiplier;
                        },
                        set: function (value) {
                            if (value !== this._multiplier) {
                                this._multiplier = wijmo.asNumber(value, false, true);
                                this._clearValues();
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    BollingerBands.prototype.getDataRect = function () {
                        if (_super.prototype._getLength.call(this) <= 0) {
                            return null;
                        }
                        else if (this._shouldCalculate()) {
                            this._init();
                            this._calculate();
                        }
                        var ys = this._upperYVals.concat(this._lowerYVals), xmin = finance._minimum(this._xVals), xmax = finance._maximum(this._xVals), ymin = finance._minimum(ys), ymax = finance._maximum(ys);
                        if (chart._DataInfo.isValid(xmin) && chart._DataInfo.isValid(xmax) && chart._DataInfo.isValid(ymin) && chart._DataInfo.isValid(ymax)) {
                            return new wijmo.Rect(xmin, ymin, xmax - xmin, ymax - ymin);
                        }
                        else {
                            return null;
                        }
                    };
                    BollingerBands.prototype._clearValues = function () {
                        _super.prototype._clearValues.call(this);
                        this._upperYVals = null;
                        this._middleYVals = null;
                        this._lowerYVals = null;
                        this._xVals = null;
                    };
                    BollingerBands.prototype._shouldCalculate = function () {
                        return !this._upperYVals || !this._middleYVals || !this._lowerYVals || !this._xVals;
                    };
                    BollingerBands.prototype._init = function () {
                        _super.prototype._init.call(this);
                        this._upperYVals = [];
                        this._middleYVals = [];
                        this._lowerYVals = [];
                        this._xVals = [];
                    };
                    BollingerBands.prototype._calculate = function () {
                        var originalLen = _super.prototype._getLength.call(this);
                        if (originalLen <= 0) {
                            return;
                        }
                        var ys = _super.prototype.getValues.call(this, 0), xs = this._getXValues();
                        var values = _bollingerBands(ys, this.period, this.multiplier);
                        this._upperYVals = values.uppers;
                        this._middleYVals = values.middles;
                        this._lowerYVals = values.lowers;
                        this._xVals = xs ? xs.slice(this.period - 1) : finance._range(this.period - 1, originalLen - 1);
                    };
                    BollingerBands.prototype._rendering = function (sender, args) {
                        if (_super.prototype._getLength.call(this) <= 0) {
                            return;
                        }
                        else if (this._shouldCalculate()) {
                            this._init();
                            this._calculate();
                        }
                        var si = this.chart.series.indexOf(this), engine = args.engine, ax = this._getAxisX(), ay = this._getAxisY(), len = finance._minimum(this._upperYVals.length, this._middleYVals.length, this._lowerYVals.length, this._xVals.length), style = chart._BasePlotter.cloneStyle(this.style, ["fill"]), stroke = this._getSymbolStroke(si), clipPath = this.chart._plotrectId, swidth = 2;
                        if (!len || len <= 0) {
                            return;
                        }
                        engine.stroke = stroke;
                        engine.strokeWidth = swidth;
                        var xs = [], uys = [], mys = [], lys = [], originalLen = this._getLength(), dpt, area, di;
                        for (var i = 0; i < len; i++) {
                            // data index
                            di = originalLen - len + i;
                            // x values
                            xs.push(ax.convert(this._xVals[i]));
                            // upper
                            uys.push(ay.convert(this._upperYVals[i]));
                            dpt = this._getDataPoint(this._xVals[i], this._upperYVals[i], si, di, ax, ay);
                            area = new chart._CircleArea(new wijmo.Point(xs[i], uys[i]), 0.5 * engine.strokeWidth);
                            area.tag = dpt;
                            this._hitTester.add(area, si);
                            // middle
                            mys.push(ay.convert(this._middleYVals[i]));
                            dpt = this._getDataPoint(this._xVals[i], this._middleYVals[i], si, di, ax, ay);
                            area = new chart._CircleArea(new wijmo.Point(xs[i], mys[i]), 0.5 * engine.strokeWidth);
                            area.tag = dpt;
                            this._hitTester.add(area, si);
                            // lower
                            lys.push(ay.convert(this._lowerYVals[i]));
                            dpt = this._getDataPoint(this._xVals[i], this._lowerYVals[i], si, di, ax, ay);
                            area = new chart._CircleArea(new wijmo.Point(xs[i], lys[i]), 0.5 * engine.strokeWidth);
                            area.tag = dpt;
                            this._hitTester.add(area, si);
                        }
                        this._hitTester.add(new chart._LinesArea(xs, uys), si);
                        this._hitTester.add(new chart._LinesArea(xs, mys), si);
                        this._hitTester.add(new chart._LinesArea(xs, lys), si);
                        engine.drawLines(xs, uys, null, style, clipPath);
                        engine.drawLines(xs, mys, null, style, clipPath);
                        engine.drawLines(xs, lys, null, style, clipPath);
                    };
                    BollingerBands.prototype.getCalculatedValues = function (key) {
                        key = wijmo.asString(key, false);
                        var retval = [], i = 0;
                        if (_super.prototype._getLength.call(this) <= 0) {
                            return retval;
                        }
                        else if (this._shouldCalculate()) {
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
                    };
                    return BollingerBands;
                }(analytics.OverlayIndicatorBase));
                analytics.BollingerBands = BollingerBands;
                // calculate Bollinger Bands for a set of financial data
                function _bollingerBands(ys, period, multiplier) {
                    wijmo.asArray(ys, false);
                    wijmo.asInt(period, false, true);
                    wijmo.asNumber(multiplier, false, true);
                    wijmo.assert(ys.length > period && period > 1, "Bollinger Bands period must be an integer less than the length of the data and greater than one.");
                    var avgs = finance._sma(ys, period), devs = [], i;
                    // get standard deviations
                    for (i = period; i <= ys.length; i++) {
                        devs.push(finance._stdDeviation(ys.slice(i - period, i)));
                    }
                    var middles = avgs, uppers = avgs.map(function (value, index) { return value + (devs[index] * multiplier); }), lowers = avgs.map(function (value, index) { return value - (devs[index] * multiplier); });
                    return {
                        lowers: lowers,
                        middles: middles,
                        uppers: uppers
                    };
                }
                analytics._bollingerBands = _bollingerBands;
            })(analytics = finance.analytics || (finance.analytics = {}));
        })(finance = chart.finance || (chart.finance = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=BollingerBands.js.map