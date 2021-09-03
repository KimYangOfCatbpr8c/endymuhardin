var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var chart;
    (function (chart) {
        var analytics;
        (function (analytics) {
            'use strict';
            /**
             * Represents a Fibonacci tool for @see:FlexChart and @see:FinancialChart.
             */
            var Fibonacci = (function (_super) {
                __extends(Fibonacci, _super);
                /**
                 * Initializes a new instance of the @see:Fibonacci class.
                 */
                function Fibonacci() {
                    _super.call(this);
                    this._levels = [0, 23.6, 38.2, 50, 61.8, 100];
                    this._uptrend = true;
                    this._labelPosition = chart.LabelPosition.Left;
                    this.rendering.addHandler(this._render);
                }
                Object.defineProperty(Fibonacci.prototype, "low", {
                    /**
                     * Gets or sets the low value of @see:Fibonacci tool.
                     */
                    get: function () {
                        return this._low;
                    },
                    set: function (value) {
                        if (value != this._low) {
                            this._low = wijmo.asNumber(value, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Fibonacci.prototype, "high", {
                    /**
                     * Gets or sets the high value of @see:Fibonacci tool.
                     */
                    get: function () {
                        return this._high;
                    },
                    set: function (value) {
                        if (value != this._high) {
                            this._high = wijmo.asNumber(value, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Fibonacci.prototype, "labelPosition", {
                    /**
                     * Gets or sets the label position of @see:Fibonacci tool.
                     */
                    get: function () {
                        return this._labelPosition;
                    },
                    set: function (value) {
                        if (value != this._labelPosition) {
                            this._labelPosition = wijmo.asEnum(value, chart.LabelPosition, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Fibonacci.prototype, "uptrend", {
                    /**
                     * Gets or sets a value indicating whether to create uptrending @see:Fibonacci tool.
                     *
                     * Default value is true(uptrend). If value is false the downtrending levels are plotted.
                     */
                    get: function () {
                        return this._uptrend;
                    },
                    set: function (value) {
                        if (value != this._uptrend) {
                            this._uptrend = wijmo.asBoolean(value, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Fibonacci.prototype, "levels", {
                    /**
                     * Gets or sets the array of levels for plotting.
                     *
                     * Default value is [0, 23.6, 38.2, 50, 61.8, 100].
                     */
                    get: function () {
                        return this._levels;
                    },
                    set: function (value) {
                        if (value != this._levels) {
                            this._levels = wijmo.asArray(value, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Fibonacci.prototype.getValues = function (dim) {
                    return null;
                };
                Fibonacci.prototype._updateLevels = function () {
                    var min = undefined, max = undefined;
                    if (this._low === undefined || this._high === undefined) {
                        var vals = _super.prototype.getValues.call(this, 0);
                        if (vals) {
                            var len = vals.length;
                            for (var i = 0; i < len; i++) {
                                var val = vals[i];
                                if (!isNaN(val)) {
                                    if (min === undefined || min > val) {
                                        min = val;
                                    }
                                    if (max === undefined || max < val) {
                                        max = val;
                                    }
                                }
                            }
                        }
                    }
                    if (this._low === undefined && min !== undefined) {
                        this._actualLow = min;
                    }
                    else {
                        this._actualLow = this._low;
                    }
                    if (this._high === undefined && max !== undefined) {
                        this._actualHigh = max;
                    }
                    else {
                        this._actualHigh = this._high;
                    }
                };
                Fibonacci.prototype._render = function (sender, args) {
                    var ser = sender;
                    ser._updateLevels();
                    var ax = ser._getAxisX();
                    var ay = ser._getAxisY();
                    var eng = args.engine;
                    var swidth = 2, stroke = ser._getSymbolStroke(ser._chart.series.indexOf(ser));
                    var lstyle = chart._BasePlotter.cloneStyle(ser.style, ['fill']);
                    var tstyle = chart._BasePlotter.cloneStyle(ser.style, ['stroke']);
                    eng.stroke = stroke;
                    eng.strokeWidth = swidth;
                    eng.textFill = stroke;
                    var llen = ser._levels ? ser._levels.length : 0;
                    for (var i = 0; i < llen; i++) {
                        var lvl = ser._levels[i];
                        var x1 = ax.convert(ax.actualMin), x2 = ax.convert(ax.actualMax);
                        var y = ser.uptrend ?
                            ay.convert(ser._actualLow + 0.01 * lvl * (ser._actualHigh - ser._actualLow)) :
                            ay.convert(ser._actualHigh - 0.01 * lvl * (ser._actualHigh - ser._actualLow));
                        if (chart._DataInfo.isValid(x1) && chart._DataInfo.isValid(x2) && chart._DataInfo.isValid(y)) {
                            eng.drawLine(x1, y, x2, y, null, lstyle);
                            if (ser.labelPosition != chart.LabelPosition.None) {
                                var s = lvl.toFixed(1) + '%';
                                var va = 0;
                                if ((ser.uptrend && i == 0) || (!ser.uptrend && i == llen - 1)) {
                                    va = 2;
                                }
                                switch (ser.labelPosition) {
                                    case chart.LabelPosition.Left:
                                        chart.FlexChartCore._renderText(eng, s, new wijmo.Point(x1, y), 0, va, null, null, tstyle);
                                        break;
                                    case chart.LabelPosition.Center:
                                        chart.FlexChartCore._renderText(eng, s, new wijmo.Point(0.5 * (x1 + x2), y), 1, va, null, null, tstyle);
                                        break;
                                    case chart.LabelPosition.Right:
                                        chart.FlexChartCore._renderText(eng, s, new wijmo.Point(x2, y), 2, va, null, null, tstyle);
                                        break;
                                }
                            }
                        }
                    }
                    eng.stroke = null;
                    eng.strokeWidth = null;
                    eng.textFill = null;
                };
                return Fibonacci;
            }(chart.SeriesBase));
            analytics.Fibonacci = Fibonacci;
        })(analytics = chart.analytics || (chart.analytics = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Fibonacci.js.map