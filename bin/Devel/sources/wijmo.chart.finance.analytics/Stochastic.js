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
                 * Represents a Stochastic Oscillator indicator series for the @see:FinancialChart.
                 *
                 * Stochastic oscillators are momentum indicators designed to predict price turning
                 * points by comparing an asset's closing price to its high-low range.
                 *
                 * The @see:Stochastic series can be used for fast (default), slow and full stochastic
                 * oscillators.  To create a slow or full stochastic oscillator, set the @see:smoothingPeriod
                 * to an integer value greater than one; slow stochastic oscillators generally use a fixed
                 * @see:smoothingPeriod of three.  To create or revert to a fast stochastic oscillator, set the
                 * @see:smoothingPeriod to an integer value of one.
                 */
                var Stochastic = (function (_super) {
                    __extends(Stochastic, _super);
                    function Stochastic() {
                        _super.call(this);
                        this._kPeriod = 14;
                        this._dPeriod = 3;
                        this._smoothingPeriod = 1;
                        this._seriesCount = 2;
                        this.rendering.addHandler(this._rendering, this);
                    }
                    Object.defineProperty(Stochastic.prototype, "kPeriod", {
                        /**
                         * Gets or sets the period for the %K calculation.
                         */
                        get: function () {
                            return this._kPeriod;
                        },
                        set: function (value) {
                            if (value !== this._kPeriod) {
                                this._kPeriod = wijmo.asInt(value, false, true);
                                this._clearValues();
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(Stochastic.prototype, "dPeriod", {
                        /**
                         * Gets or sets the period for the %D simple moving average.
                         */
                        get: function () {
                            return this._dPeriod;
                        },
                        set: function (value) {
                            if (value !== this._dPeriod) {
                                this._dPeriod = wijmo.asInt(value, false, true);
                                this._clearValues();
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(Stochastic.prototype, "smoothingPeriod", {
                        /**
                         * Gets or sets the smoothing period for full %K.
                         */
                        get: function () {
                            return this._smoothingPeriod;
                        },
                        set: function (value) {
                            if (value !== this._smoothingPeriod) {
                                this._smoothingPeriod = wijmo.asInt(value, false, true);
                                this._clearValues();
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(Stochastic.prototype, "styles", {
                        /**
                         * Gets or sets the styles for the %K and %D lines.
                         *
                         * The following options are supported:
                         *
                         * <pre>series.styles = {
                         *   kLine: {
                         *      stroke: 'red',
                         *      strokeWidth: 1
                         *   },
                         *   dLine: {
                         *      stroke: 'green',
                         *      strokeWidth: 1
                         *   },
                         * }</pre>
                         */
                        get: function () {
                            return this._styles;
                        },
                        set: function (value) {
                            if (value !== this._styles) {
                                this._styles = value;
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Stochastic.prototype.getDataRect = function () {
                        var rect = null;
                        if (_super.prototype._getLength.call(this) <= 0) {
                            return rect;
                        }
                        else if (this._shouldCalculate()) {
                            this._init();
                            this._calculate();
                        }
                        var ys = this._kVals.concat(this._dVals), xs = this._kXVals.concat(this._dXVals), xmin = finance._minimum(xs), xmax = finance._maximum(xs), ymin = finance._minimum(ys), ymax = finance._maximum(ys);
                        if (chart._DataInfo.isValid(xmin) && chart._DataInfo.isValid(xmax) && chart._DataInfo.isValid(ymin) && chart._DataInfo.isValid(ymax)) {
                            rect = new wijmo.Rect(xmin, ymin, xmax - xmin, ymax - ymin);
                        }
                        return rect;
                    };
                    Stochastic.prototype._clearValues = function () {
                        _super.prototype._clearValues.call(this);
                        this._kVals = null;
                        this._kXVals = null;
                        this._dVals = null;
                        this._dXVals = null;
                    };
                    Stochastic.prototype._shouldCalculate = function () {
                        return !this._kVals || !this._kXVals ||
                            !this._dVals || !this._dXVals;
                    };
                    Stochastic.prototype._init = function () {
                        _super.prototype._init.call(this);
                        this._kVals = [];
                        this._kXVals = [];
                        this._dVals = [];
                        this._dXVals = [];
                    };
                    Stochastic.prototype._calculate = function () {
                        var originalLen = _super.prototype._getLength.call(this);
                        if (_super.prototype._getLength.call(this) <= 0) {
                            return;
                        }
                        var highs = _super.prototype._getBindingValues.call(this, 0), lows = _super.prototype._getBindingValues.call(this, 1), closes = _super.prototype._getBindingValues.call(this, 3), xs = this._getXValues();
                        var values = _stochastic(highs, lows, closes, this.kPeriod, this.dPeriod, this.smoothingPeriod);
                        this._kVals = values.ks;
                        this._dVals = values.ds;
                        // get %K x-values
                        this._kXVals = xs ? xs.slice(this.kPeriod - 1) : finance._range(this.kPeriod - 1, originalLen - 1);
                        if (this.smoothingPeriod && this.smoothingPeriod > 1) {
                            this._kXVals = this._kXVals.slice(this._kXVals.length - this._kVals.length, this._kXVals.length);
                        }
                        // get %D x-values
                        this._dXVals = this._kXVals.slice(this._kXVals.length - this._dVals.length, this._kXVals.length);
                    };
                    Stochastic.prototype._rendering = function (sender, args) {
                        if (_super.prototype._getLength.call(this) <= 0) {
                            return;
                        }
                        else if (this._shouldCalculate()) {
                            this._init();
                            this._calculate();
                        }
                        var si = this.chart.series.indexOf(this), engine = args.engine, ax = this._getAxisX(), ay = this._getAxisY(), style = chart._BasePlotter.cloneStyle(this.style, ["fill"]), stroke = this._getSymbolStroke(si), clipPath = this.chart._plotrectId, swidth = 2, kStyle = null, kStroke = stroke, kStrokeWidth = swidth, dStyle = null, dStroke = stroke, dStrokeWidth = swidth;
                        // handle "styles"
                        if (this.styles && wijmo.isObject(this.styles)) {
                            if (this.styles.kLine && wijmo.isObject(this.styles.kLine)) {
                                kStyle = chart._BasePlotter.cloneStyle(this.styles.kLine, ["fill"]);
                                kStroke = kStyle.stroke ? kStyle.stroke : stroke;
                                kStrokeWidth = kStyle.strokeWidth ? kStyle.strokeWidth : swidth;
                            }
                            if (this.styles.dLine && wijmo.isObject(this.styles.dLine)) {
                                dStyle = chart._BasePlotter.cloneStyle(this.styles.dLine, ["fill"]);
                                dStroke = dStyle.stroke ? dStyle.stroke : stroke;
                                dStrokeWidth = dStyle.strokeWidth ? dStyle.strokeWidth : swidth;
                            }
                        }
                        var kVals = [], kXVals = [], dVals = [], dXVals = [], originalLen = this._getLength(), dpt, area, i, di;
                        // %K
                        for (i = 0; i < this._kVals.length; i++) {
                            // data index
                            di = originalLen - this._kVals.length + i;
                            // x & yvalues
                            kXVals.push(ax.convert(this._kXVals[i]));
                            kVals.push(ay.convert(this._kVals[i]));
                            // hit testing
                            dpt = this._getDataPoint(this._kXVals[i], this._kVals[i], si, di, ax, ay);
                            dpt["name"] = this._getName(0);
                            area = new chart._CircleArea(new wijmo.Point(kXVals[i], kVals[i]), 0.5 * engine.strokeWidth);
                            area.tag = dpt;
                            this._hitTester.add(area, si);
                        }
                        this._hitTester.add(new chart._LinesArea(kXVals, kVals), si);
                        engine.stroke = kStroke;
                        engine.strokeWidth = kStrokeWidth;
                        engine.drawLines(kXVals, kVals, null, style, clipPath);
                        // %D
                        for (i = 0; i < this._dVals.length; i++) {
                            // data index
                            di = originalLen - this._dVals.length + i;
                            // x & yvalues
                            dXVals.push(ax.convert(this._dXVals[i]));
                            dVals.push(ay.convert(this._dVals[i]));
                            // hit testing
                            dpt = this._getDataPoint(this._dXVals[i], this._dVals[i], si, di, ax, ay);
                            dpt["name"] = this._getName(1);
                            area = new chart._CircleArea(new wijmo.Point(dXVals[i], dVals[i]), 0.5 * engine.strokeWidth);
                            area.tag = dpt;
                            this._hitTester.add(area, si);
                        }
                        this._hitTester.add(new chart._LinesArea(dXVals, dVals), si);
                        engine.stroke = dStroke;
                        engine.strokeWidth = dStrokeWidth;
                        engine.drawLines(dXVals, dVals, null, style, clipPath);
                    };
                    Stochastic.prototype.getCalculatedValues = function (key) {
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
                            case "kLine":
                                for (; i < this._kVals.length; i++) {
                                    retval.push({
                                        x: this._kXVals[i],
                                        y: this._kVals[i]
                                    });
                                }
                                break;
                            case "dLine":
                                for (; i < this._dVals.length; i++) {
                                    retval.push({
                                        x: this._dXVals[i],
                                        y: this._dVals[i]
                                    });
                                }
                                break;
                        }
                        return retval;
                    };
                    return Stochastic;
                }(analytics.OverlayIndicatorBase));
                analytics.Stochastic = Stochastic;
                // calculate Stochastics for a set of financial data
                function _stochastic(highs, lows, closes, kPeriod, dPeriod, smoothingPeriod) {
                    wijmo.asArray(highs, false);
                    wijmo.asArray(lows, false);
                    wijmo.asArray(closes, false);
                    wijmo.asInt(kPeriod, false, true);
                    wijmo.asInt(dPeriod, false, true);
                    wijmo.asInt(smoothingPeriod, true, true);
                    var extremeHighs = [], extremeLows = [], kvals = [], dvals, i;
                    // get extreme highs/lows for each period
                    for (i = kPeriod; i <= highs.length; i++) {
                        extremeHighs.push(finance._maximum(highs.slice(i - kPeriod, i)));
                        extremeLows.push(finance._minimum(lows.slice(i - kPeriod, i)));
                    }
                    // get subset of closing prices
                    closes = closes.slice(kPeriod - 1);
                    // %K
                    for (i = 0; i < closes.length; i++) {
                        kvals.push((closes[i] - extremeLows[i]) / (extremeHighs[i] - extremeLows[i]) * 100);
                    }
                    // %K in slow/full
                    if (smoothingPeriod && smoothingPeriod > 1) {
                        kvals = finance._sma(kvals, smoothingPeriod);
                    }
                    // %D
                    dvals = finance._sma(kvals, dPeriod);
                    return {
                        ks: kvals,
                        ds: dvals
                    };
                }
                analytics._stochastic = _stochastic;
            })(analytics = finance.analytics || (finance.analytics = {}));
        })(finance = chart.finance || (chart.finance = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Stochastic.js.map