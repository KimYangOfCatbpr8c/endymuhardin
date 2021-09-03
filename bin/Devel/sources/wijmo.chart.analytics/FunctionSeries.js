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
             * Represents a base class of function series for @see:wijmo.chart.FlexChart.
             */
            var FunctionSeries = (function (_super) {
                __extends(FunctionSeries, _super);
                /**
                 * Initializes a new instance of the @see:FunctionSeries class.
                 *
                 * @param options A JavaScript object containing initialization data for the
                 * FunctionSeries.
                 */
                function FunctionSeries(options) {
                    _super.call(this, options);
                    if (this.itemsSource == null) {
                        this.itemsSource = [new wijmo.Point(0, 0)];
                    }
                }
                Object.defineProperty(FunctionSeries.prototype, "min", {
                    //--------------------------------------------------------------------------
                    //** object model
                    /**
                     * Gets or sets the minimum value of the parameter for calculating a function.
                     */
                    get: function () {
                        return this._min;
                    },
                    set: function (value) {
                        if (this._min !== value) {
                            this._min = wijmo.asNumber(value, false);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(FunctionSeries.prototype, "max", {
                    /**
                     * Gets or sets the maximum value of the parameter for calculating a function.
                     */
                    get: function () {
                        return this._max;
                    },
                    set: function (value) {
                        if (this._max !== value) {
                            this._max = wijmo.asNumber(value, false);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                //--------------------------------------------------------------------------
                //** implementation
                FunctionSeries.prototype.getValues = function (dim) {
                    var self = this;
                    if (self._xValues == null || self._yValues == null) {
                        self._calculateValues();
                    }
                    if (dim === 0) {
                        //y
                        return self._yValues || null;
                    }
                    else if (dim === 1) {
                        //x
                        return self._xValues || null;
                    }
                };
                FunctionSeries.prototype._initProperties = function (o) {
                    this._min = 0;
                    this._max = 1;
                    _super.prototype._initProperties.call(this, o);
                };
                FunctionSeries.prototype._calculateValues = function () {
                    var self = this, npts = self.sampleCount, x = [], y = [], delta = (self.max - self.min) / (npts - 1), t;
                    for (var i = 0; i < npts; i++) {
                        t = i === npts - 1 ? this.max : this.min + delta * i;
                        x[i] = self._calculateX(t);
                        y[i] = self._calculateY(t);
                    }
                    self._yValues = y;
                    self._xValues = x;
                };
                // performs simple validation of data value
                FunctionSeries.prototype._validateValue = function (value) {
                    return isFinite(value) ? value : Number.NaN;
                };
                // calculate the value of the function
                FunctionSeries.prototype._calculateValue = function (func, parameter) {
                    var value;
                    try {
                        value = func(parameter);
                    }
                    catch (ex) {
                        value = Number.NaN;
                    }
                    return this._validateValue(value);
                };
                FunctionSeries.prototype._calculateX = function (value) {
                    return 0;
                };
                FunctionSeries.prototype._calculateY = function (value) {
                    return 0;
                };
                return FunctionSeries;
            }(analytics.TrendLineBase));
            analytics.FunctionSeries = FunctionSeries;
            /**
             * Represents a Y function series of @see:wijmo.chart.FlexChart.
             *
             * The @see::YFunctionSeries allows to plot a function defined by formula y=f(x).
             */
            var YFunctionSeries = (function (_super) {
                __extends(YFunctionSeries, _super);
                /**
                 * Initializes a new instance of the @see:YFunctionSeries class.
                 *
                 * @param options A JavaScript object containing initialization data for the
                 * YFunctionSeries.
                 */
                function YFunctionSeries(options) {
                    _super.call(this, options);
                }
                Object.defineProperty(YFunctionSeries.prototype, "func", {
                    //--------------------------------------------------------------------------
                    //** object model
                    /**
                     * Gets or sets the function used to calculate Y value.
                     */
                    get: function () {
                        return this._func;
                    },
                    set: function (value) {
                        if (value && this._func !== value) {
                            this._func = wijmo.asFunction(value, false);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                //--------------------------------------------------------------------------
                //** implementation
                YFunctionSeries.prototype._calculateX = function (value) {
                    return value;
                };
                YFunctionSeries.prototype._calculateY = function (value) {
                    return this._calculateValue(this.func, value);
                };
                /**
                 * Gets the approximate y value from the given x value.
                 *
                 * @param x The x value to be used for calculating the Y value.
                 */
                YFunctionSeries.prototype.approximate = function (x) {
                    return this._calculateValue(this.func, x);
                };
                return YFunctionSeries;
            }(FunctionSeries));
            analytics.YFunctionSeries = YFunctionSeries;
            /**
             * Represents a parametric function series for @see:wijmo.chart.FlexChart.
             *
             * The @see::ParametricFunctionSeries allows to plot a function defined by formulas
             * x=f(t) and y=f(t).
             * The x and y values are calcluated by the given xFunc and yFunc.
             */
            var ParametricFunctionSeries = (function (_super) {
                __extends(ParametricFunctionSeries, _super);
                /**
                 * Initializes a new instance of the @see:ParametricFunctionSeries class.
                 *
                 * @param options A JavaScript object containing initialization data for the
                 * ParametricFunctionSeries.
                 */
                function ParametricFunctionSeries(options) {
                    _super.call(this, options);
                }
                Object.defineProperty(ParametricFunctionSeries.prototype, "xFunc", {
                    //--------------------------------------------------------------------------
                    //** object model
                    /**
                     * Gets or sets the function used to calculate the x value.
                     */
                    get: function () {
                        return this._xFunc;
                    },
                    set: function (value) {
                        if (value && this._xFunc !== value) {
                            this._xFunc = wijmo.asFunction(value, false);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ParametricFunctionSeries.prototype, "yFunc", {
                    /**
                     * Gets or sets the function used to calculate the y value.
                     */
                    get: function () {
                        return this._yFunc;
                    },
                    set: function (value) {
                        if (value && this._yFunc !== value) {
                            this._yFunc = wijmo.asFunction(value, false);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                //--------------------------------------------------------------------------
                //** implementation
                ParametricFunctionSeries.prototype._calculateX = function (value) {
                    return this._calculateValue(this.xFunc, value);
                };
                ParametricFunctionSeries.prototype._calculateY = function (value) {
                    return this._calculateValue(this.yFunc, value);
                };
                /**
                 * Gets the approximate x and y from the given value.
                 *
                 * @param value The value to calculate.
                 */
                ParametricFunctionSeries.prototype.approximate = function (value) {
                    var self = this, x = this._calculateValue(this.xFunc, value), y = this._calculateValue(this.yFunc, value);
                    //add <any> for compiling error.
                    return new wijmo.Point(x, y);
                };
                return ParametricFunctionSeries;
            }(FunctionSeries));
            analytics.ParametricFunctionSeries = ParametricFunctionSeries;
        })(analytics = chart.analytics || (chart.analytics = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=FunctionSeries.js.map