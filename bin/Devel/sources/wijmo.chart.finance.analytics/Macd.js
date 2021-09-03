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
                 * Base class for @see:Macd and @see:MacdHistogram series (abstract).
                 */
                var MacdBase = (function (_super) {
                    __extends(MacdBase, _super);
                    function MacdBase() {
                        _super.call(this);
                        this._fastPeriod = 12;
                        this._slowPeriod = 26;
                        this._smoothingPeriod = 9;
                    }
                    Object.defineProperty(MacdBase.prototype, "fastPeriod", {
                        /**
                         * Gets or sets the fast exponential moving average period
                         * for the MACD line.
                         */
                        get: function () {
                            return this._fastPeriod;
                        },
                        set: function (value) {
                            if (value !== this._fastPeriod) {
                                this._fastPeriod = wijmo.asInt(value, false, true);
                                this._clearValues();
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(MacdBase.prototype, "slowPeriod", {
                        /**
                         * Gets or sets the slow exponential moving average period
                         * for the MACD line.
                         */
                        get: function () {
                            return this._slowPeriod;
                        },
                        set: function (value) {
                            if (value !== this._slowPeriod) {
                                this._slowPeriod = wijmo.asInt(value, false, true);
                                this._clearValues();
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(MacdBase.prototype, "smoothingPeriod", {
                        /**
                         * Gets or sets the exponential moving average period
                         * for the signal line.
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
                    MacdBase.prototype._clearValues = function () {
                        _super.prototype._clearValues.call(this);
                        this._macdVals = null;
                        this._macdXVals = null;
                        this._signalVals = null;
                        this._signalXVals = null;
                        this._histogramVals = null;
                        this._histogramXVals = null;
                    };
                    MacdBase.prototype._shouldCalculate = function () {
                        return !this._macdVals || !this._macdXVals ||
                            !this._signalVals || !this._signalXVals ||
                            !this._histogramVals || !this._histogramXVals;
                    };
                    MacdBase.prototype._init = function () {
                        _super.prototype._init.call(this);
                        this._macdVals = [];
                        this._macdXVals = [];
                        this._signalVals = [];
                        this._signalXVals = [];
                        this._histogramVals = [];
                        this._histogramXVals = [];
                    };
                    MacdBase.prototype._calculate = function () {
                        var originalLen = _super.prototype._getLength.call(this);
                        if (originalLen <= 0) {
                            return;
                        }
                        var ys = _super.prototype.getValues.call(this, 0), xs = this._getXValues();
                        var values = _macd(ys, this.fastPeriod, this.slowPeriod, this.smoothingPeriod);
                        this._macdVals = values.macds;
                        this._signalVals = values.signals;
                        this._histogramVals = values.histograms;
                        this._macdXVals = xs ? xs.slice(originalLen - this._macdVals.length, originalLen) : finance._range(originalLen - this._macdVals.length, originalLen - 1);
                        this._signalXVals = xs ? xs.slice(originalLen - this._signalVals.length, originalLen) : finance._range(originalLen - this._signalVals.length, originalLen - 1);
                        this._histogramXVals = xs ? xs.slice(originalLen - this._histogramVals.length, originalLen) : finance._range(originalLen - this._histogramVals.length, originalLen - 1);
                    };
                    return MacdBase;
                }(analytics.OverlayIndicatorBase));
                analytics.MacdBase = MacdBase;
                /**
                 * Represents a Moving Average Convergence/Divergence (MACD) indicator series
                 * for the @see:FinancialChart.
                 *
                 * The MACD indicator is designed to reveal changes in strength, direction, momentum,
                 * and duration of an asset's price trend.
                 */
                var Macd = (function (_super) {
                    __extends(Macd, _super);
                    function Macd() {
                        _super.call(this);
                        this._seriesCount = 2;
                        this.rendering.addHandler(this._rendering, this);
                    }
                    Object.defineProperty(Macd.prototype, "styles", {
                        /**
                         * Gets or sets the styles for the MACD and Signal lines.
                         *
                         * The following options are supported:
                         *
                         * <pre>series.styles = {
                         *   macdLine: {
                         *      stroke: 'red',
                         *      strokeWidth: 1
                         *   },
                         *   signalLine: {
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
                    Macd.prototype.getDataRect = function () {
                        var rect = null;
                        if (_super.prototype._getLength.call(this) <= 0) {
                            return rect;
                        }
                        else if (this._shouldCalculate()) {
                            this._init();
                            this._calculate();
                        }
                        var ys = [], xs = [];
                        xs.push.apply(xs, this._macdXVals);
                        xs.push.apply(xs, this._signalXVals);
                        ys.push.apply(ys, this._macdVals);
                        ys.push.apply(ys, this._signalVals);
                        var xmin = finance._minimum(xs), xmax = finance._maximum(xs), ymin = finance._minimum(ys), ymax = finance._maximum(ys);
                        if (chart._DataInfo.isValid(xmin) && chart._DataInfo.isValid(xmax) && chart._DataInfo.isValid(ymin) && chart._DataInfo.isValid(ymax)) {
                            rect = new wijmo.Rect(xmin, ymin, xmax - xmin, ymax - ymin);
                        }
                        return rect;
                    };
                    Macd.prototype._rendering = function (sender, args) {
                        if (_super.prototype._getLength.call(this) <= 0) {
                            return;
                        }
                        else if (this._shouldCalculate()) {
                            this._init();
                            this._calculate();
                        }
                        var si = this.chart.series.indexOf(this), engine = args.engine, ax = this._getAxisX(), ay = this._getAxisY(), style = chart._BasePlotter.cloneStyle(this.style, ["fill"]), stroke = this._getSymbolStroke(si), clipPath = this.chart._plotrectId, swidth = 2, macdStyle = null, macdStroke = stroke, macdStrokeWidth = swidth, signalStyle = null, signalStroke = stroke, signalStrokeWidth = swidth;
                        // handle "styles"
                        if (this.styles && wijmo.isObject(this.styles)) {
                            if (this.styles.macdLine && wijmo.isObject(this.styles.macdLine)) {
                                macdStyle = chart._BasePlotter.cloneStyle(this.styles.macdLine, ["fill"]);
                                macdStroke = macdStyle.stroke ? macdStyle.stroke : stroke;
                                macdStrokeWidth = macdStyle.strokeWidth ? macdStyle.strokeWidth : swidth;
                            }
                            if (this.styles.signalLine && wijmo.isObject(this.styles.signalLine)) {
                                signalStyle = chart._BasePlotter.cloneStyle(this.styles.signalLine, ["fill"]);
                                signalStroke = signalStyle.stroke ? signalStyle.stroke : stroke;
                                signalStrokeWidth = signalStyle.strokeWidth ? signalStyle.strokeWidth : swidth;
                            }
                        }
                        var macdVals = [], macdXVals = [], signalVals = [], signalXVals = [], dpt, area, originalLen = this._getLength(), i, di;
                        // macd line
                        for (i = 0; i < this._macdVals.length; i++) {
                            // data index
                            di = originalLen - this._macdVals.length + i;
                            // x & yvalues
                            macdXVals.push(ax.convert(this._macdXVals[i]));
                            macdVals.push(ay.convert(this._macdVals[i]));
                            // hit testing
                            dpt = this._getDataPoint(this._macdXVals[i], this._macdVals[i], si, di, ax, ay);
                            dpt["name"] = this._getName(0);
                            area = new chart._CircleArea(new wijmo.Point(macdXVals[i], macdVals[i]), 0.5 * engine.strokeWidth);
                            area.tag = dpt;
                            this._hitTester.add(area, si);
                        }
                        this._hitTester.add(new chart._LinesArea(macdXVals, macdVals), si);
                        engine.stroke = macdStroke;
                        engine.strokeWidth = macdStrokeWidth;
                        engine.drawLines(macdXVals, macdVals, null, style, clipPath);
                        // signal line
                        for (i = 0; i < this._signalVals.length; i++) {
                            // data index
                            di = originalLen - this._signalVals.length + i;
                            // x & yvalues
                            signalXVals.push(ax.convert(this._signalXVals[i]));
                            signalVals.push(ay.convert(this._signalVals[i]));
                            // hit testing
                            dpt = this._getDataPoint(this._signalXVals[i], this._signalVals[i], si, di, ax, ay);
                            dpt["name"] = this._getName(1);
                            area = new chart._CircleArea(new wijmo.Point(signalXVals[i], signalVals[i]), 0.5 * engine.strokeWidth);
                            area.tag = dpt;
                            this._hitTester.add(area, si);
                        }
                        this._hitTester.add(new chart._LinesArea(signalXVals, signalVals), si);
                        engine.stroke = signalStroke;
                        engine.strokeWidth = signalStrokeWidth;
                        engine.drawLines(signalXVals, signalVals, null, style, clipPath);
                    };
                    Macd.prototype.getCalculatedValues = function (key) {
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
                            case "macdLine":
                                for (; i < this._macdVals.length; i++) {
                                    retval.push({
                                        x: this._macdXVals[i],
                                        y: this._macdVals[i]
                                    });
                                }
                                break;
                            case "signalLine":
                                for (; i < this._signalVals.length; i++) {
                                    retval.push({
                                        x: this._signalXVals[i],
                                        y: this._signalVals[i]
                                    });
                                }
                                break;
                        }
                        return retval;
                    };
                    return Macd;
                }(MacdBase));
                analytics.Macd = Macd;
                /**
                 * Represents a Moving Average Convergence/Divergence (MACD) Histogram indicator series
                 * for the @see:FinancialChart.
                 *
                 * The MACD indicator is designed to reveal changes in strength, direction, momentum,
                 * and duration of an asset's price trend.
                 */
                var MacdHistogram = (function (_super) {
                    __extends(MacdHistogram, _super);
                    function MacdHistogram() {
                        _super.call(this);
                    }
                    MacdHistogram.prototype.getValues = function (dim) {
                        var retval = null;
                        if (_super.prototype._getLength.call(this) <= 0) {
                            return retval;
                        }
                        else if (this._shouldCalculate()) {
                            this._init();
                            this._calculate();
                        }
                        if (dim === 0) {
                            retval = this._histogramVals;
                        }
                        else if (dim === 1) {
                            retval = this._histogramXVals;
                        }
                        return retval;
                    };
                    MacdHistogram.prototype.getDataRect = function () {
                        var rect = null;
                        if (_super.prototype._getLength.call(this) <= 0) {
                            return rect;
                        }
                        else if (this._shouldCalculate()) {
                            this._init();
                            this._calculate();
                        }
                        var xmin = finance._minimum(this._histogramXVals), xmax = finance._maximum(this._histogramXVals), ymin = finance._minimum(this._histogramVals), ymax = finance._maximum(this._histogramVals);
                        if (chart._DataInfo.isValid(xmin) && chart._DataInfo.isValid(xmax) && chart._DataInfo.isValid(ymin) && chart._DataInfo.isValid(ymax)) {
                            rect = new wijmo.Rect(xmin, ymin, xmax - xmin, ymax - ymin);
                        }
                        return rect;
                    };
                    MacdHistogram.prototype._getChartType = function () {
                        return chart.ChartType.Column;
                    };
                    // override to get correct item for hit testing
                    MacdHistogram.prototype._getItem = function (pointIndex) {
                        var originalLen = _super.prototype._getLength.call(this), len = finance._minimum(this._histogramVals.length, this._histogramXVals.length);
                        // data index
                        pointIndex = originalLen - len + pointIndex;
                        return _super.prototype._getItem.call(this, pointIndex);
                    };
                    return MacdHistogram;
                }(MacdBase));
                analytics.MacdHistogram = MacdHistogram;
                // calculate MACD for a set of financial data
                function _macd(ys, fastPeriod, slowPeriod, smoothingPeriod) {
                    wijmo.asArray(ys, false);
                    wijmo.asInt(fastPeriod, false, true);
                    wijmo.asInt(slowPeriod, false, true);
                    wijmo.asInt(smoothingPeriod, false, true);
                    var opposite = fastPeriod > slowPeriod, temp;
                    if (opposite) {
                        temp = slowPeriod;
                        slowPeriod = fastPeriod;
                        fastPeriod = temp;
                    }
                    var fastEmas = finance._ema(ys, fastPeriod), slowEmas = finance._ema(ys, slowPeriod), macds = [], histograms = [], signals, i;
                    // get subset of fast emas for macd line calculation
                    fastEmas.splice(0, slowPeriod - fastPeriod);
                    // macd line
                    for (i = 0; i < fastEmas.length; i++) {
                        temp = fastEmas[i] - slowEmas[i];
                        if (opposite)
                            temp *= -1;
                        macds.push(temp);
                    }
                    // signal line
                    signals = finance._ema(macds, smoothingPeriod);
                    // macd histogram
                    var macdTemp = macds.slice(macds.length - signals.length, macds.length);
                    for (i = 0; i < macdTemp.length; i++) {
                        histograms.push(macdTemp[i] - signals[i]);
                    }
                    return {
                        macds: macds,
                        signals: signals,
                        histograms: histograms
                    };
                }
                analytics._macd = _macd;
            })(analytics = finance.analytics || (finance.analytics = {}));
        })(finance = chart.finance || (chart.finance = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Macd.js.map