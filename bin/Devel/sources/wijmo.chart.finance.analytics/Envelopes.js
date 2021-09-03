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
                (function (MovingAverageType) {
                    MovingAverageType[MovingAverageType["Simple"] = 0] = "Simple";
                    MovingAverageType[MovingAverageType["Exponential"] = 1] = "Exponential";
                })(analytics.MovingAverageType || (analytics.MovingAverageType = {}));
                var MovingAverageType = analytics.MovingAverageType;
                /**
                 * Represents a Moving Average Envelopes overlay series for the @see:FinancialChart.
                 *
                 * Moving average envelopes are moving averages set above and below a standard moving
                 * average.  The amount above/below the standard moving average is percentage based and
                 * dictated by the @see:size property.
                 */
                var Envelopes = (function (_super) {
                    __extends(Envelopes, _super);
                    function Envelopes() {
                        _super.call(this);
                        this._period = 20;
                        this._type = MovingAverageType.Simple;
                        this._size = 0.025;
                        this.rendering.addHandler(this._rendering, this);
                    }
                    Object.defineProperty(Envelopes.prototype, "period", {
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
                    Object.defineProperty(Envelopes.prototype, "type", {
                        /**
                         * Gets or sets the moving average type for the
                         * envelopes.  The default value is Simple.
                         */
                        get: function () {
                            return this._type;
                        },
                        set: function (value) {
                            if (value !== this._type) {
                                this._type = wijmo.asEnum(value, MovingAverageType, false);
                                this._clearValues();
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(Envelopes.prototype, "size", {
                        /**
                         * Gets or set the size of the moving average
                         * envelopes.  The default value is 2.5 percent (0.025).
                         */
                        get: function () {
                            return this._size;
                        },
                        set: function (value) {
                            if (value !== this._size) {
                                this._size = wijmo.asNumber(value, false, true);
                                this._clearValues();
                                this._invalidate();
                            }
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Envelopes.prototype.getDataRect = function () {
                        var rect = null;
                        if (_super.prototype._getLength.call(this) <= 0) {
                            return rect;
                        }
                        else if (this._shouldCalculate()) {
                            this._init();
                            this._calculate();
                        }
                        var ys = this._upperYVals.concat(this._lowerYVals), xmin = finance._minimum(this._xVals), xmax = finance._maximum(this._xVals), ymin = finance._minimum(ys), ymax = finance._maximum(ys);
                        if (chart._DataInfo.isValid(xmin) && chart._DataInfo.isValid(xmax) && chart._DataInfo.isValid(ymin) && chart._DataInfo.isValid(ymax)) {
                            rect = new wijmo.Rect(xmin, ymin, xmax - xmin, ymax - ymin);
                        }
                        return rect;
                    };
                    Envelopes.prototype._clearValues = function () {
                        _super.prototype._clearValues.call(this);
                        this._upperYVals = null;
                        this._lowerYVals = null;
                        this._xVals = null;
                    };
                    Envelopes.prototype._init = function () {
                        _super.prototype._init.call(this);
                        this._upperYVals = [];
                        this._lowerYVals = [];
                        this._xVals = [];
                    };
                    Envelopes.prototype._shouldCalculate = function () {
                        return !this._upperYVals || !this._lowerYVals || !this._xVals;
                    };
                    // creates calculated values
                    Envelopes.prototype._calculate = function () {
                        var _this = this;
                        if (_super.prototype._getLength.call(this) <= 0) {
                            return;
                        }
                        var ys = _super.prototype.getValues.call(this, 0), xs = this._getXValues(), avgs;
                        // moving average calculations
                        switch (this.type) {
                            case MovingAverageType.Exponential:
                                avgs = finance._ema(ys, this.period);
                                break;
                            case MovingAverageType.Simple:
                            default:
                                avgs = finance._sma(ys, this.period);
                                break;
                        }
                        this._xVals = xs ? xs.slice(this.period - 1) : finance._range(this.period - 1, _super.prototype._getLength.call(this) - 1);
                        this._upperYVals = avgs.map(function (value) { return value + (value * _this.size); });
                        this._lowerYVals = avgs.map(function (value) { return value - (value * _this.size); });
                    };
                    // custom rendering in order to draw multiple lines for a single SeriesBase object
                    Envelopes.prototype._rendering = function (sender, args) {
                        if (_super.prototype._getLength.call(this) <= 0) {
                            return;
                        }
                        else if (this._shouldCalculate()) {
                            this._init();
                            this._calculate();
                        }
                        var si = this.chart.series.indexOf(this), engine = args.engine, ax = this._getAxisX(), ay = this._getAxisY(), len = finance._minimum(this._upperYVals.length, this._lowerYVals.length, this._xVals.length), style = chart._BasePlotter.cloneStyle(this.style, ["fill"]), stroke = this._getSymbolStroke(si), clipPath = this.chart._plotrectId, swidth = 2;
                        if (!len || len <= 0) {
                            return;
                        }
                        engine.stroke = stroke;
                        engine.strokeWidth = swidth;
                        var xs = [], uys = [], lys = [], originalLen = this._getLength(), dpt, area, di;
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
                            // lower
                            lys.push(ay.convert(this._lowerYVals[i]));
                            dpt = this._getDataPoint(this._xVals[i], this._lowerYVals[i], si, di, ax, ay);
                            area = new chart._CircleArea(new wijmo.Point(xs[i], lys[i]), 0.5 * engine.strokeWidth);
                            area.tag = dpt;
                            this._hitTester.add(area, si);
                        }
                        this._hitTester.add(new chart._LinesArea(xs, uys), si);
                        this._hitTester.add(new chart._LinesArea(xs, lys), si);
                        engine.drawLines(xs, uys, null, style, clipPath);
                        engine.drawLines(xs, lys, null, style, clipPath);
                    };
                    Envelopes.prototype.getCalculatedValues = function (key) {
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
                            case "upperEnvelope":
                                for (; i < this._upperYVals.length; i++) {
                                    retval.push({
                                        x: this._xVals[i],
                                        y: this._upperYVals[i]
                                    });
                                }
                                break;
                            case "lowerEnvelope":
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
                    return Envelopes;
                }(analytics.OverlayIndicatorBase));
                analytics.Envelopes = Envelopes;
            })(analytics = finance.analytics || (finance.analytics = {}));
        })(finance = chart.finance || (chart.finance = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Envelopes.js.map