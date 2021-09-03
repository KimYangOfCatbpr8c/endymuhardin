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
            var MathHelper = (function () {
                function MathHelper() {
                }
                // get rounded value by given digits.
                MathHelper.round = function (val, digits) {
                    if (!val) {
                        return 0;
                    }
                    var rate = Math.pow(10, digits || 2);
                    return Math.round(val * rate) / rate;
                };
                // determines average value in array of numbers
                MathHelper.avg = function (values) {
                    var sum = MathHelper.sum(values);
                    return sum / values.length;
                };
                // determines sum of values in array of numbers
                MathHelper.sum = function (values) {
                    values = wijmo.asArray(values, false);
                    return values.reduce(function (prev, curr) { return prev + curr; }, 0);
                };
                // determines sum of values to specified power
                MathHelper.sumOfPow = function (values, pow) {
                    values = wijmo.asArray(values, false);
                    pow = wijmo.asNumber(pow, false);
                    return values.reduce(function (prev, curr) { return prev + Math.pow(curr, pow); }, 0);
                };
                // determines the sum product of two or more numeric arrays of equal length
                MathHelper.sumProduct = function () {
                    var values = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        values[_i - 0] = arguments[_i];
                    }
                    var rows = values.length, cols = 0, vals = [], i, val;
                    values = wijmo.asArray(values, false);
                    values.forEach(function (row, idx) {
                        row = wijmo.asArray(row, false);
                        if (idx === 0) {
                            cols = row.length;
                        }
                        else {
                            wijmo.assert(row.length === cols, 'The length of the arrays must be equal');
                        }
                    });
                    for (i = 0; i < cols; i++) {
                        val = 1;
                        values.some(function (row, idx) {
                            var value = row[i];
                            if (value && wijmo.isNumber(value)) {
                                val *= value;
                            }
                            else {
                                val = 0;
                                return true;
                            }
                        });
                        vals.push(val);
                    }
                    return MathHelper.sum(vals);
                };
                // determines variance of array of numbers
                MathHelper.variance = function (values) {
                    values = wijmo.asArray(values, false);
                    var mean = MathHelper.avg(values), diffs;
                    diffs = values.map(function (v) { return v - mean; });
                    return MathHelper.sumOfSquares(diffs) / (values.length - 1);
                };
                // determines covariance based on two correlated arrays
                MathHelper.covariance = function (values1, values2) {
                    values1 = wijmo.asArray(values1, false);
                    values2 = wijmo.asArray(values2, false);
                    wijmo.assert(values1.length === values2.length, 'Length of arrays must be equal');
                    var mean1 = MathHelper.avg(values1), mean2 = MathHelper.avg(values2), len = values1.length, val = 0, i;
                    for (i = 0; i < len; i++) {
                        val += ((values1[i] - mean1) * (values2[i] - mean2)) / len;
                    }
                    return val;
                };
                // determines minimum value in array of numbers
                MathHelper.min = function (values) { return Math.min.apply(Math, wijmo.asArray(values, false)); };
                // determines maximum value in array of numbers
                MathHelper.max = function (values) { return Math.max.apply(Math, wijmo.asArray(values, false)); };
                // determines the squared value of a number
                MathHelper.square = function (value) { return Math.pow(wijmo.asNumber(value, false), 2); };
                // determines the sum of squares from an array of numbers
                MathHelper.sumOfSquares = function (values) { return MathHelper.sumOfPow(values, 2); };
                // determines standard deviation from an array of numbers
                MathHelper.stdDev = function (values) { return Math.sqrt(MathHelper.variance(values)); };
                return MathHelper;
            }());
            /**
             * Specifies the fit type of the trendline series.
             */
            (function (TrendLineFitType) {
                /**
                 * A straight line that most closely approximates the data.  Y(x) = a * x + b.
                 */
                TrendLineFitType[TrendLineFitType["Linear"] = 0] = "Linear";
                /**
                 * Regression fit to the equation Y(x) = a * exp(b*x).
                 */
                TrendLineFitType[TrendLineFitType["Exponential"] = 1] = "Exponential";
                /**
                 * Regression fit to the equation Y(x) = a * ln(x) + b.
                 */
                TrendLineFitType[TrendLineFitType["Logarithmic"] = 2] = "Logarithmic";
                /**
                 * Regression fit to the equation Y(x) = a * pow(x, b).
                 */
                TrendLineFitType[TrendLineFitType["Power"] = 3] = "Power";
                /**
                 * Regression fit to the equation Y(x) = a + b * cos(x) + c * sin(x) + d * cos(2*x) + e * sin(2*x) + ...
                 */
                TrendLineFitType[TrendLineFitType["Fourier"] = 4] = "Fourier";
                /**
                 * Regression fit to the equation Y(x) = a * x^n + b * x^n-1 + c * x^n-2 + ... + z.
                 */
                TrendLineFitType[TrendLineFitType["Polynomial"] = 5] = "Polynomial";
                /**
                 * The minimum X-value.
                 */
                TrendLineFitType[TrendLineFitType["MinX"] = 6] = "MinX";
                /**
                 * The minimum Y-value.
                 */
                TrendLineFitType[TrendLineFitType["MinY"] = 7] = "MinY";
                /**
                 * The maximum X-value.
                 */
                TrendLineFitType[TrendLineFitType["MaxX"] = 8] = "MaxX";
                /**
                 * The maximum Y-value.
                 */
                TrendLineFitType[TrendLineFitType["MaxY"] = 9] = "MaxY";
                /**
                 * The average X-value.
                 */
                TrendLineFitType[TrendLineFitType["AverageX"] = 10] = "AverageX";
                /**
                 * The average Y-value.
                 */
                TrendLineFitType[TrendLineFitType["AverageY"] = 11] = "AverageY";
            })(analytics.TrendLineFitType || (analytics.TrendLineFitType = {}));
            var TrendLineFitType = analytics.TrendLineFitType;
            /**
             * Represents a trend line for @see:FlexChart and @see:FinancialChart.
             *
             * A trendline is a line superimposed on a chart revealing the overall direction
             * of data.
             * You may define a different fit type for each @see:TrendLine object that you
             * add to the @see:FlexChart series collection by setting the fitType property.
             */
            var TrendLine = (function (_super) {
                __extends(TrendLine, _super);
                /**
                 * Initializes a new instance of the @see:TrendLine class.
                 *
                 * @param options A JavaScript object containing initialization data for
                 * the TrendLine Series.
                 */
                function TrendLine(options) {
                    _super.call(this, options);
                }
                Object.defineProperty(TrendLine.prototype, "fitType", {
                    //--------------------------------------------------------------------------
                    //** object model
                    /**
                     * Gets or sets the fit type of the trendline.
                     */
                    get: function () {
                        return this._fitType;
                    },
                    set: function (value) {
                        if (value === this._fitType) {
                            return;
                        }
                        this._fitType = wijmo.asEnum(value, TrendLineFitType, false);
                        this._invalidate();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TrendLine.prototype, "order", {
                    /**
                     * Gets or sets the number of terms in a polynomial or fourier equation.
                     *
                     * Set this value to an integer greater than 1.
                     * It gets applied when the fitType is set to
                     * wijmo.chart.analytics.TrendLineFitType.Polynomial or
                     * wijmo.chart.analytics.TrendLineFitType.Fourier.
                     */
                    get: function () {
                        return this._order;
                    },
                    set: function (value) {
                        if (value === this._order) {
                            return;
                        }
                        this._order = wijmo.asNumber(value, false, true);
                        this._invalidate();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TrendLine.prototype, "coefficients", {
                    /**
                     * Gets the coefficients of the equation.
                     */
                    get: function () {
                        return this._helper ? this._helper.coefficients : null;
                    },
                    enumerable: true,
                    configurable: true
                });
                //--------------------------------------------------------------------------
                //** implementation
                TrendLine.prototype._initProperties = function (o) {
                    this._fitType = TrendLineFitType.Linear;
                    this._order = 2;
                    _super.prototype._initProperties.call(this, o);
                };
                TrendLine.prototype._calculateValues = function () {
                    var self = this, helper, fitType, vals;
                    fitType = TrendLineFitType[self._fitType];
                    if (TrendLineHelper[fitType]) {
                        helper = new TrendLineHelper[fitType](self._originYValues, self._originXValues, self.sampleCount, self.order);
                        vals = helper.calculateValues();
                        self._yValues = vals[0];
                        self._xValues = vals[1];
                        self._helper = helper;
                    }
                };
                /**
                 * Gets the approximate y value from the given x value.
                 *
                 * @param x The x value to be used for calculating the Y value.
                 */
                TrendLine.prototype.approximate = function (x) {
                    return this._helper.approximate(x);
                };
                /**
                 * Gets the formatted equation string for the coefficients.
                 *
                 * @param fmt The formatting function for the coefficients. Returns formatted
                 * string on the basis of coefficients. This parameter is optional.
                 */
                TrendLine.prototype.getEquation = function (fmt) {
                    var self = this, coeffs = self.coefficients, len = coeffs.length, equation = '';
                    if (self._helper == null) {
                        return '';
                    }
                    return self._helper.getEquation(fmt);
                };
                return TrendLine;
            }(analytics.TrendLineBase));
            analytics.TrendLine = TrendLine;
            //store calculated values.
            var Calculator = (function () {
                function Calculator(x, y) {
                    this._x = x;
                    this._y = y;
                }
                Object.defineProperty(Calculator.prototype, "x", {
                    get: function () {
                        return this._x;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "y", {
                    get: function () {
                        return this._y;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "minX", {
                    get: function () {
                        var self = this;
                        if (self._minX == null) {
                            self._minX = MathHelper.min(self._x);
                        }
                        return self._minX;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "minY", {
                    get: function () {
                        var self = this;
                        if (self._minY == null) {
                            self._minY = MathHelper.min(self._y);
                        }
                        return self._minY;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "maxX", {
                    get: function () {
                        var self = this;
                        if (self._maxX == null) {
                            self._maxX = MathHelper.max(self._x);
                        }
                        return self._maxX;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "maxY", {
                    get: function () {
                        var self = this;
                        if (self._maxY == null) {
                            self._maxY = MathHelper.max(self._y);
                        }
                        return self._maxY;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "averageX", {
                    get: function () {
                        var self = this;
                        if (self._averageX == null) {
                            self._averageX = MathHelper.avg(self._x);
                        }
                        return self._averageX;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "averageY", {
                    get: function () {
                        var self = this;
                        if (self._averageY == null) {
                            self._averageY = MathHelper.avg(self._y);
                        }
                        return self._averageY;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "sumX", {
                    get: function () {
                        var self = this;
                        if (self._sumX == null) {
                            self._sumX = MathHelper.sum(self._x);
                        }
                        return self._sumX;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "sumY", {
                    get: function () {
                        var self = this;
                        if (self._sumY == null) {
                            self._sumY = MathHelper.sum(self._y);
                        }
                        return self._sumY;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "LogX", {
                    get: function () {
                        var self = this;
                        if (self._logX == null) {
                            self._logX = self._x.map(function (val) { return Math.log(val); });
                        }
                        return self._logX;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "LogY", {
                    get: function () {
                        var self = this;
                        if (self._logY == null) {
                            self._logY = self._y.map(function (val) { return Math.log(val); });
                        }
                        return self._logY;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "sumLogX", {
                    get: function () {
                        var self = this;
                        if (self._sumLogX == null) {
                            self._sumLogX = MathHelper.sum(self.LogX);
                        }
                        return self._sumLogX;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "sumLogY", {
                    get: function () {
                        var self = this;
                        if (self._sumLogY == null) {
                            self._sumLogY = MathHelper.sum(self.LogY);
                        }
                        return self._sumLogY;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "sumOfSquareX", {
                    get: function () {
                        var self = this;
                        if (self._sumOfSquareX == null) {
                            self._sumOfSquareX = MathHelper.sumOfSquares(self._x);
                        }
                        return self._sumOfSquareX;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "sumOfSquareY", {
                    get: function () {
                        var self = this;
                        if (self._sumOfSquareY == null) {
                            self._sumOfSquareY = MathHelper.sumOfSquares(self._y);
                        }
                        return self._sumOfSquareY;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "sumOfSquareLogX", {
                    get: function () {
                        var self = this;
                        if (self._sumOfSquareLogX == null) {
                            self._sumOfSquareLogX = MathHelper.sumOfSquares(self.LogX);
                        }
                        return self._sumOfSquareLogX;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Calculator.prototype, "sumOfSquareLogY", {
                    get: function () {
                        var self = this;
                        if (self._sumOfSquareLogY == null) {
                            self._sumOfSquareLogY = MathHelper.sumOfSquares(self.LogY);
                        }
                        return self._sumOfSquareLogY;
                    },
                    enumerable: true,
                    configurable: true
                });
                Calculator.prototype.sumProduct = function (x, y) {
                    var self = this;
                    // In current cases, sumProduct get same x and y in each TrendHelpers, so use only one variable to store value.
                    if (self._sumProduct == null) {
                        self._sumProduct = MathHelper.sumProduct(x, y);
                    }
                    return self._sumProduct;
                };
                return Calculator;
            }());
            // Base class for calculating trend line calculations.
            // Calculations: http://mathworld.wolfram.com/LeastSquaresFitting.html
            var TrendHelperBase = (function () {
                function TrendHelperBase(y, x, count) {
                    var self = this;
                    self._coefficients = [];
                    self.y = y;
                    self.x = x;
                    wijmo.assert(self.y.length === self.x.length, 'Length of X and Y arrays are not equal');
                    self.count = count || y.length;
                    self._calculator = new Calculator(x, y);
                    self.xMin = self._calculator.minX;
                    self.xMax = self._calculator.maxX;
                }
                Object.defineProperty(TrendHelperBase.prototype, "calculator", {
                    get: function () {
                        return this._calculator;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TrendHelperBase.prototype, "y", {
                    get: function () {
                        return this._y;
                    },
                    set: function (value) {
                        if (value !== this.y) {
                            this._y = wijmo.asArray(value, false);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TrendHelperBase.prototype, "x", {
                    get: function () {
                        return this._x;
                    },
                    set: function (value) {
                        if (value !== this.x) {
                            this._x = wijmo.asArray(value, false);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TrendHelperBase.prototype, "count", {
                    get: function () {
                        return this._count;
                    },
                    set: function (value) {
                        if (value !== this.count) {
                            this._count = wijmo.asInt(value, false, true);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TrendHelperBase.prototype, "xMin", {
                    get: function () {
                        return this._xMin;
                    },
                    set: function (value) {
                        if (value !== this.xMin) {
                            this._xMin = wijmo.asNumber(value, false);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TrendHelperBase.prototype, "xMax", {
                    get: function () {
                        return this._xMax;
                    },
                    set: function (value) {
                        if (value !== this.xMax) {
                            this._xMax = wijmo.asNumber(value, false);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TrendHelperBase.prototype, "coefficients", {
                    get: function () {
                        return this._coefficients;
                    },
                    enumerable: true,
                    configurable: true
                });
                TrendHelperBase.prototype._calculateCoefficients = function () {
                    var self = this, a, b;
                    b = self.calcB();
                    a = self.calcA(b);
                    self._coefficients.push(a, b);
                };
                TrendHelperBase.prototype.calculateValues = function () {
                    var self = this, delta = (self.xMax - self.xMin) / (self.count - 1), values = [[], []], xv, yv;
                    for (var i = 0; i < self.count; i++) {
                        xv = self.xMin + delta * i;
                        yv = self.calcY(xv);
                        values[0].push(yv);
                        values[1].push(xv);
                    }
                    return values;
                };
                // Calculates the y-offset.
                TrendHelperBase.prototype.calcA = function (b) {
                    var self = this, n = self.y.length, Ex = self.calculator.sumX, Ey = self.calculator.sumY, b = b ? b : self.calcB();
                    return (Ey - (b * Ex)) / n;
                };
                // Calculates the slope.
                TrendHelperBase.prototype.calcB = function () {
                    var self = this, n = self.y.length, calc = self.calculator, Exy = calc.sumProduct(calc.x, calc.y), Ex = calc.sumX, Ey = calc.sumY, Exsq = calc.sumOfSquareX;
                    return ((n * Exy) - (Ex * Ey)) / ((n * Exsq) - MathHelper.square(Ex));
                };
                TrendHelperBase.prototype.calcY = function (xval) {
                    var coeffs = this.coefficients;
                    return coeffs[0] + (coeffs[1] * xval);
                };
                TrendHelperBase.prototype.approximate = function (x) {
                    return this.calcY(x);
                };
                TrendHelperBase.prototype.getEquation = function (fmt) {
                    var fmt = fmt ? fmt : this._defaultEquationFmt;
                    return this._getEquation(fmt);
                };
                TrendHelperBase.prototype._getEquation = function (fmt) {
                    var coeffs = this.coefficients, equations = [];
                    coeffs.forEach(function (coeff) {
                        equations.push(fmt(coeff));
                    });
                    return this._concatEquation(equations);
                };
                TrendHelperBase.prototype._concatEquation = function (equations) {
                    return '';
                };
                TrendHelperBase.prototype._defaultEquationFmt = function (coefficient) {
                    var val, len, coeff = Math.abs(coefficient), concatLen = 0;
                    if (coeff >= 1e5) {
                        len = String(Math.round(coeff)).length - 1;
                        val = Math.round(coefficient / Number('1e' + len));
                        return val + 'e' + len;
                    }
                    else if (coeff < 1e-4) {
                        len = String(coeff).match(/\.0+/)[1].length - 1;
                        val = Math.round(coefficient * Number('1e' + len));
                        return val + 'e-' + len;
                    }
                    else {
                        if (coefficient > 0) {
                            concatLen = 6;
                        }
                        else {
                            concatLen = 7;
                        }
                        if (coeff >= 1e4) {
                            concatLen--;
                        }
                        //use + to convert string to number to remove last '0' characters.
                        return String(+(String(coefficient).substring(0, concatLen)));
                    }
                };
                return TrendHelperBase;
            }());
            // y = a * x + b
            // Calculations: http://mathworld.wolfram.com/LeastSquaresFitting.html
            var LinearHelper = (function (_super) {
                __extends(LinearHelper, _super);
                function LinearHelper(y, x, count, yOffset) {
                    _super.call(this, y, x, count);
                    this._calculateCoefficients();
                    this.yOffset = yOffset;
                }
                Object.defineProperty(LinearHelper.prototype, "yOffset", {
                    get: function () {
                        return this._yOffset;
                    },
                    set: function (value) {
                        if (value !== this.yOffset) {
                            this._yOffset = wijmo.asNumber(value, true);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                LinearHelper.prototype.calcA = function (b) {
                    return this.yOffset != null ? this.yOffset : _super.prototype.calcA.call(this, b);
                };
                LinearHelper.prototype.calcB = function () {
                    return this.yOffset != null ? this._calculateBSimple() : _super.prototype.calcB.call(this);
                };
                LinearHelper.prototype._calculateBSimple = function () {
                    var self = this, calc = self.calculator, Exy = calc.sumProduct(calc.x, calc.y), Ex = calc.sumX, Exsq = calc.sumOfSquareX;
                    return (Exy - self.yOffset * Ex) / Exsq;
                };
                LinearHelper.prototype._calculateCoefficients = function () {
                    var self = this, a, b;
                    b = self.calcB();
                    a = self.calcA(b);
                    self.coefficients.push(b, a);
                };
                LinearHelper.prototype.calcY = function (xval) {
                    var coeffs = this.coefficients;
                    return (coeffs[0] * xval) + coeffs[1];
                };
                LinearHelper.prototype._concatEquation = function (equations) {
                    return 'y=' + equations[0] + 'x' + (this.coefficients[1] >= 0 ? '+' : '') + equations[1];
                };
                return LinearHelper;
            }(TrendHelperBase));
            // y = a * lnx + b.
            // Calculations: http://mathworld.wolfram.com/LeastSquaresFittingLogarithmic.html
            var LogHelper = (function (_super) {
                __extends(LogHelper, _super);
                function LogHelper(y, x, count) {
                    _super.call(this, y, x, count);
                    this._calculateCoefficients();
                }
                LogHelper.prototype.calcA = function (b) {
                    var self = this, n = self.y.length, calc = self.calculator, Ey = calc.sumY, Ex = calc.sumLogX, b = b ? b : self.calcB();
                    return (Ey - (b * Ex)) / n;
                };
                LogHelper.prototype.calcB = function () {
                    var self = this, n = self.y.length, calc = self.calculator, Exy = calc.sumProduct(calc.y, calc.LogX), Ey = calc.sumY, Ex = calc.sumLogX, Exsq = calc.sumOfSquareLogX;
                    return ((n * Exy) - (Ey * Ex)) / ((n * Exsq) - MathHelper.square(Ex));
                };
                LogHelper.prototype._calculateCoefficients = function () {
                    var self = this, a, b;
                    b = self.calcB();
                    a = self.calcA(b);
                    self.coefficients.push(b, a);
                };
                LogHelper.prototype.calcY = function (xval) {
                    var coeffs = this.coefficients;
                    return (Math.log(xval) * coeffs[0]) + coeffs[1];
                };
                LogHelper.prototype._concatEquation = function (equations) {
                    return 'y=' + equations[0] + 'ln(x)' + (this.coefficients[1] >= 0 ? '+' : '') + equations[1];
                };
                return LogHelper;
            }(TrendHelperBase));
            // y = a * e ^ (b * x)
            // Calculations: http://mathworld.wolfram.com/LeastSquaresFittingExponential.html
            var ExpHelper = (function (_super) {
                __extends(ExpHelper, _super);
                function ExpHelper(y, x, count) {
                    _super.call(this, y, x, count);
                    this._calculateCoefficients();
                }
                ExpHelper.prototype.calcA = function () {
                    var self = this, n = self.y.length, calc = self.calculator, Ey = calc.sumLogY, Exsq = calc.sumOfSquareX, Ex = calc.sumX, Exy = calc.sumProduct(calc.x, calc.LogY);
                    return Math.exp(((Ey * Exsq) - (Ex * Exy)) / ((n * Exsq) - MathHelper.square(Ex)));
                };
                ExpHelper.prototype.calcB = function () {
                    var self = this, n = self.y.length, calc = self.calculator, Ey = calc.sumLogY, Exsq = calc.sumOfSquareX, Ex = calc.sumX, Exy = calc.sumProduct(calc.x, calc.LogY);
                    return ((n * Exy) - (Ex * Ey)) / ((n * Exsq) - MathHelper.square(Ex));
                };
                ExpHelper.prototype.calcY = function (xval) {
                    var coeffs = this.coefficients;
                    return coeffs[0] * Math.exp(coeffs[1] * xval);
                };
                ExpHelper.prototype._concatEquation = function (equations) {
                    return 'y=' + equations[0] + 'e<sup>' + equations[1] + 'x</sup>';
                };
                return ExpHelper;
            }(TrendHelperBase));
            // y = a * x ^ b
            // Calculations: http://mathworld.wolfram.com/LeastSquaresFittingPowerLaw.html
            var PowerHelper = (function (_super) {
                __extends(PowerHelper, _super);
                function PowerHelper(y, x, count) {
                    _super.call(this, y, x, count);
                    this._calculateCoefficients();
                }
                PowerHelper.prototype.calcA = function (b) {
                    var self = this, calc = self.calculator, n = self.y.length, Ex = calc.sumLogX, Ey = calc.sumLogY, b = b ? b : self.calcB();
                    return Math.exp((Ey - (b * Ex)) / n);
                };
                PowerHelper.prototype.calcB = function () {
                    var self = this, n = self.y.length, calc = self.calculator, Exy = calc.sumProduct(calc.LogX, calc.LogY), Ex = calc.sumLogX, Ey = calc.sumLogY, Exsq = calc.sumOfSquareLogX;
                    return ((n * Exy) - (Ex * Ey)) / ((n * Exsq) - MathHelper.square(Ex));
                };
                PowerHelper.prototype.calcY = function (xval) {
                    var coeffs = this.coefficients;
                    return coeffs[0] * Math.pow(xval, coeffs[1]);
                };
                PowerHelper.prototype._concatEquation = function (equations) {
                    return 'y=' + equations[0] + 'x<sup>' + equations[1] + '</sup>';
                };
                return PowerHelper;
            }(TrendHelperBase));
            //For Polynomial/Fourier
            var LeastSquaresHelper = (function (_super) {
                __extends(LeastSquaresHelper, _super);
                function LeastSquaresHelper(y, x, count, order) {
                    _super.call(this, y, x, count);
                    this._order = order == null ? 2 : order;
                    this._basis = [];
                    this._calculateCoefficients();
                }
                Object.defineProperty(LeastSquaresHelper.prototype, "basis", {
                    get: function () {
                        return this._basis;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(LeastSquaresHelper.prototype, "order", {
                    get: function () {
                        return this._order;
                    },
                    set: function (value) {
                        if (value !== this.order) {
                            this._order = wijmo.asNumber(value, true);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                LeastSquaresHelper.prototype._calculateCoefficients = function () {
                    var self = this;
                    self._coefficients.length = self.order;
                    self._createBasis();
                    self._normalizeAndSolveGauss();
                };
                LeastSquaresHelper.prototype._createBasis = function () {
                    var len = this.x.length, order = this.order;
                    if (len < 2) {
                        throw "Incompatible data: Less than 2 data points.";
                    }
                    if (order < 1) {
                        throw "Incompatible data: Less than 1 coefficient in the fit";
                    }
                    if (order > len) {
                        throw "Incompatible data: Number of data points less than number of terms";
                    }
                };
                LeastSquaresHelper.prototype._normalizeAndSolveGauss = function () {
                    var a = [];
                    this._computeNormalEquations(a);
                    this._genDefValForArray(a, 0);
                    if (!this._solveGauss(a)) {
                        throw 'Incompatible data: No solution.';
                    }
                };
                LeastSquaresHelper.prototype._genDefValForArray = function (a, def) {
                    var len = a.length + 1;
                    a.forEach(function (v) {
                        for (var i = 0; i < len; i++) {
                            if (v[i] == null) {
                                v[i] = def;
                            }
                        }
                    });
                };
                // transform the least square task to the normal equation
                //  a * solution = c
                // where
                //   a = basis_transposed * basis
                //   c = basis_transposed * y 
                // 
                // here right part
                //   a[i][nt] = c[i]
                //
                LeastSquaresHelper.prototype._computeNormalEquations = function (a) {
                    var self = this, y = self.y, bas = self.basis, order = self.order, len = y.length, col, row, sum, i;
                    for (col = 0; col < order; col++) {
                        sum = 0;
                        if (a[col] == null) {
                            a[col] = [];
                        }
                        y.forEach(function (v, i) {
                            sum += v * bas[i][col];
                        });
                        a[col][order] = sum;
                        for (row = col; row < order; row++) {
                            sum = 0;
                            for (i = 0; i < len; i++) {
                                sum += bas[i][row] * bas[i][col];
                            }
                            if (a[row] == null) {
                                a[row] = [];
                            }
                            a[row][col] = sum;
                            a[col][row] = sum;
                        }
                    }
                };
                // A[n][n]*x = A[n+1]
                LeastSquaresHelper.prototype._solveGauss = function (a) {
                    var n = a.length, epsilon = 0, coeffs = this._coefficients, result = true, i, j;
                    if (coeffs.length < n || a[0].length < n + 1) {
                        throw 'Dimension of matrix is not correct.';
                    }
                    a.some(function (v, i) {
                        var k = i, m = Math.abs(v[i]), val, _temp;
                        for (j = i + 1; j < n; j++) {
                            val = Math.abs(a[j][i]);
                            if (m < val) {
                                m = val;
                                k = j;
                            }
                        }
                        if (m > epsilon) {
                            for (j = i; j <= n; j++) {
                                _temp = a[i][j];
                                a[i][j] = a[k][j];
                                a[k][j] = _temp;
                            }
                            for (k = i + 1; k < n; k++) {
                                _temp = a[k][i] / v[i];
                                a[k][i] = 0;
                                for (j = i + 1; j <= n; j++)
                                    a[k][j] -= _temp * v[j];
                            }
                        }
                        else {
                            result = false;
                            return true;
                        }
                    });
                    if (result) {
                        for (i = n - 1; i >= 0; i--) {
                            coeffs[i] = a[i][n];
                            for (j = i + 1; j < n; j++) {
                                coeffs[i] -= a[i][j] * coeffs[j];
                            }
                            coeffs[i] = coeffs[i] / a[i][i];
                        }
                    }
                    return result;
                };
                return LeastSquaresHelper;
            }(TrendHelperBase));
            var PolyHelper = (function (_super) {
                __extends(PolyHelper, _super);
                function PolyHelper(y, x, count, order) {
                    _super.call(this, y, x, count, order);
                }
                Object.defineProperty(PolyHelper.prototype, "coefficients", {
                    get: function () {
                        return this._coefficients.slice(0).reverse();
                    },
                    enumerable: true,
                    configurable: true
                });
                PolyHelper.prototype.calcY = function (xval) {
                    var coeffs = this._coefficients, yval = 0, pow = 1;
                    coeffs.forEach(function (v, i) {
                        if (i > 0) {
                            pow *= xval;
                        }
                        yval += v * pow;
                    });
                    return yval;
                };
                PolyHelper.prototype._calculateCoefficients = function () {
                    var coeffs = this._coefficients, zero = false, i;
                    this.order++;
                    if (zero) {
                        coeffs.pop();
                    }
                    _super.prototype._calculateCoefficients.call(this);
                    if (zero) {
                    }
                    this.order--;
                };
                //f0 = 1, f1 = x, f2 = x^2...
                PolyHelper.prototype._createBasis = function () {
                    _super.prototype._createBasis.call(this);
                    var self = this, x = self.x, bas = self.basis, order = self.order;
                    x.forEach(function (v, row) {
                        var col;
                        bas[row] = [1];
                        for (col = 1; col <= order; col++) {
                            bas[row][col] = v * bas[row][col - 1];
                        }
                    });
                };
                PolyHelper.prototype._concatEquation = function (equations) {
                    var str = 'y=', len = equations.length, coeffs = this.coefficients;
                    equations.forEach(function (val, idx) {
                        var pow = len - 1 - idx, operator;
                        if (pow === 0) {
                            str += val;
                        }
                        else if (pow === 1) {
                            operator = coeffs[idx + 1] >= 0 ? '+' : '';
                            str += val + 'x' + operator;
                        }
                        else {
                            operator = coeffs[idx + 1] >= 0 ? '+' : '';
                            str += val + 'x<sup>' + pow + '</sup>' + operator;
                        }
                    });
                    return str;
                };
                return PolyHelper;
            }(LeastSquaresHelper));
            var FourierHelper = (function (_super) {
                __extends(FourierHelper, _super);
                function FourierHelper(y, x, count, order) {
                    order = order == null ? x.length : order;
                    _super.call(this, y, x, count, order);
                }
                //f0 = 1, f1 = cos(x), f2 = sin(x), f3 = cos(2x), f4 = sin(2x), ...
                FourierHelper.prototype._createBasis = function () {
                    _super.prototype._createBasis.call(this);
                    var self = this, x = self.x, bas = self.basis, order = self.order;
                    x.forEach(function (v, row) {
                        var col, n;
                        bas[row] = [1];
                        for (col = 1; col < order; col++) {
                            n = Math.floor((col + 1) / 2);
                            if (col % 2 === 1) {
                                bas[row].push(Math.cos(n * v));
                            }
                            else {
                                bas[row].push(Math.sin(n * v));
                            }
                        }
                    });
                };
                FourierHelper.prototype.calcY = function (xval) {
                    var coeffs = this._coefficients, yval;
                    coeffs.forEach(function (v, i) {
                        var k = Math.floor((i + 1) / 2), val;
                        if (i === 0) {
                            yval = v;
                        }
                        else {
                            val = k * xval;
                            if ((i % 2) === 1) {
                                yval += v * Math.cos(val);
                            }
                            else {
                                yval += v * Math.sin(val);
                            }
                        }
                    });
                    return yval;
                };
                FourierHelper.prototype._concatEquation = function (equations) {
                    //f0 = 1, f1 = cos(x), f2 = sin(x), f3 = cos(2x), f4 = sin(2x), ...
                    var str = 'y=', len = equations.length, coeffs = this.coefficients;
                    equations.forEach(function (val, idx) {
                        var operator = idx === len - 1 ? '' : (coeffs[idx + 1] >= 0 ? '+' : ''), sincos = '', x = Math.ceil(idx / 2);
                        if (idx === 0) {
                            str += val + operator;
                        }
                        else {
                            if (idx % 2 === 1) {
                                sincos = 'cos';
                            }
                            else {
                                sincos = 'sin';
                            }
                            sincos += '(' + (x === 1 ? '' : String(x)) + 'x)';
                            str += val + sincos + operator;
                        }
                    });
                    return str;
                };
                return FourierHelper;
            }(LeastSquaresHelper));
            var SimpleTrendHelper = (function (_super) {
                __extends(SimpleTrendHelper, _super);
                function SimpleTrendHelper(y, x, count) {
                    _super.call(this, y, x, count);
                    this._calculateCoefficients();
                }
                SimpleTrendHelper.prototype._setVal = function (val) {
                    this._val = val;
                };
                SimpleTrendHelper.prototype.calcY = function (xval) {
                    return this._val;
                };
                return SimpleTrendHelper;
            }(TrendHelperBase));
            var MinXHelper = (function (_super) {
                __extends(MinXHelper, _super);
                function MinXHelper(y, x, count) {
                    _super.call(this, y, x, count);
                }
                MinXHelper.prototype.calculateValues = function () {
                    var self = this, xMin = self.xMin, yMin = MathHelper.min(self.y), yMax = MathHelper.max(self.y), valsX, valsY;
                    valsX = [xMin, xMin];
                    valsY = [yMin, yMax];
                    self._setVal(xMin);
                    return [valsY, valsX];
                };
                MinXHelper.prototype.getEquation = function (fmt) {
                    var xMin = this.xMin;
                    if (fmt) {
                        xMin = fmt(xMin);
                    }
                    return 'x=' + xMin;
                };
                return MinXHelper;
            }(SimpleTrendHelper));
            var MinYHelper = (function (_super) {
                __extends(MinYHelper, _super);
                function MinYHelper(y, x, count) {
                    _super.call(this, y, x, count);
                }
                MinYHelper.prototype.calculateValues = function () {
                    var self = this, xMin = self.xMin, xMax = self.xMax, yMin = MathHelper.min(self.y), valsX, valsY;
                    valsX = [xMin, xMax];
                    valsY = [yMin, yMin];
                    self._setVal(yMin);
                    return [valsY, valsX];
                };
                MinYHelper.prototype.getEquation = function (fmt) {
                    var yMin = MathHelper.min(this.y);
                    if (fmt) {
                        yMin = fmt(yMin);
                    }
                    return 'y=' + yMin;
                };
                return MinYHelper;
            }(SimpleTrendHelper));
            var MaxXHelper = (function (_super) {
                __extends(MaxXHelper, _super);
                function MaxXHelper(y, x, count) {
                    _super.call(this, y, x, count);
                }
                MaxXHelper.prototype.calculateValues = function () {
                    var self = this, xMax = self.xMax, yMin = MathHelper.min(self.y), yMax = MathHelper.max(self.y), valsX, valsY;
                    valsX = [xMax, xMax];
                    valsY = [yMin, yMax];
                    self._setVal(xMax);
                    return [valsY, valsX];
                };
                MaxXHelper.prototype.getEquation = function (fmt) {
                    var xMax = this.xMax;
                    if (fmt) {
                        xMax = fmt(xMax);
                    }
                    return 'x=' + xMax;
                };
                return MaxXHelper;
            }(SimpleTrendHelper));
            var MaxYHelper = (function (_super) {
                __extends(MaxYHelper, _super);
                function MaxYHelper(y, x, count) {
                    _super.call(this, y, x, count);
                }
                MaxYHelper.prototype.calculateValues = function () {
                    var self = this, xMin = self.xMin, xMax = self.xMax, yMax = MathHelper.max(self.y), valsX, valsY;
                    valsX = [xMin, xMax];
                    valsY = [yMax, yMax];
                    self._setVal(yMax);
                    return [valsY, valsX];
                };
                MaxYHelper.prototype.getEquation = function (fmt) {
                    var yMax = MathHelper.max(this.y);
                    if (fmt) {
                        yMax = fmt(yMax);
                    }
                    return 'y=' + yMax;
                };
                return MaxYHelper;
            }(SimpleTrendHelper));
            var AverageXHelper = (function (_super) {
                __extends(AverageXHelper, _super);
                function AverageXHelper(y, x, count) {
                    _super.call(this, y, x, count);
                }
                AverageXHelper.prototype.calculateValues = function () {
                    var self = this, xAverage = MathHelper.avg(self.x), yMin = MathHelper.min(self.y), yMax = MathHelper.max(self.y), valsX, valsY;
                    valsX = [xAverage, xAverage];
                    valsY = [yMin, yMax];
                    self._setVal(xAverage);
                    return [valsY, valsX];
                };
                AverageXHelper.prototype._getEquation = function (fmt) {
                    var xAverage = fmt(MathHelper.avg(this.x));
                    return 'x=' + xAverage;
                };
                AverageXHelper.prototype._defaultEquationFmt = function (coefficient) {
                    if (Math.abs(coefficient) < 1e5) {
                        return _super.prototype._defaultEquationFmt.call(this, coefficient);
                    }
                    return '' + MathHelper.round(coefficient, 2);
                };
                return AverageXHelper;
            }(SimpleTrendHelper));
            var AverageYHelper = (function (_super) {
                __extends(AverageYHelper, _super);
                function AverageYHelper(y, x, count) {
                    _super.call(this, y, x, count);
                }
                AverageYHelper.prototype.calculateValues = function () {
                    var self = this, yAverage = MathHelper.avg(self.y), xMin = self.xMin, xMax = self.xMax, valsX, valsY;
                    valsX = [xMin, xMax];
                    valsY = [yAverage, yAverage];
                    self._setVal(yAverage);
                    return [valsY, valsX];
                };
                AverageYHelper.prototype._getEquation = function (fmt) {
                    var yAverage = fmt(MathHelper.avg(this.y));
                    return 'y=' + yAverage;
                };
                AverageYHelper.prototype._defaultEquationFmt = function (coefficient) {
                    if (Math.abs(coefficient) < 1e5) {
                        return _super.prototype._defaultEquationFmt.call(this, coefficient);
                    }
                    return '' + MathHelper.round(coefficient, 2);
                };
                return AverageYHelper;
            }(SimpleTrendHelper));
            var TrendLineHelper = {
                TrendHelperBase: TrendHelperBase,
                Linear: LinearHelper,
                Exponential: ExpHelper,
                Logarithmic: LogHelper,
                Power: PowerHelper,
                Polynomial: PolyHelper,
                Fourier: FourierHelper,
                MinX: MinXHelper,
                MinY: MinYHelper,
                MaxX: MaxXHelper,
                MaxY: MaxYHelper,
                AverageX: AverageXHelper,
                AverageY: AverageYHelper
            };
        })(analytics = chart.analytics || (chart.analytics = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=TrendLine.js.map