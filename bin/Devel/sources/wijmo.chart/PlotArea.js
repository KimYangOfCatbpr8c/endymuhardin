var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var chart;
    (function (chart) {
        'use strict';
        /**
         * Represents a plot area on the chart.
         *
         * The chart can have multiple plot areas with multiple axes.
         * To assign axis to plot area use <b>Axis.plotArea</b> property. For example:
         * <pre>
         *  // create a plot area
         *  var pa = new wijmo.chart.PlotArea();
         *  pa.row = 1;
         *  chart.plotAreas.push(pa);
         *  // create auxiliary y-axis
         *  var ay2 = new wijmo.chart.Axis(wijmo.chart.Position.Left);
         *  ay2.plotArea = pa; // attach axis to the plot area
         *  chart.axes.push(ay2);
         *  // plot first series along y-axis
         *  chart.series[0].axisY = ay2;
         * </pre>
         */
        var PlotArea = (function () {
            /**
             * Initializes a new instance of the @see:PlotArea class.
             */
            function PlotArea() {
                this._row = 0;
                this._col = 0;
                this._rect = new wijmo.Rect(0, 0, 0, 0);
            }
            Object.defineProperty(PlotArea.prototype, "row", {
                /**
                 * Gets or sets the row number of plot area.
                 * Using <b>row</b> property, you can set horizontal position of the plot area
                 * on the chart.
                 */
                get: function () {
                    return this._row;
                },
                set: function (value) {
                    if (value != this._row) {
                        this._row = wijmo.asInt(value, true, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PlotArea.prototype, "column", {
                /**
                 * Gets or sets the column number of plot area.
                 * Using <b>column</b> property, you can set vertical position of the plot
                 * area on the chart.
                 */
                get: function () {
                    return this._col;
                },
                set: function (value) {
                    if (value != this._col) {
                        this._col = wijmo.asInt(value, true, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PlotArea.prototype, "name", {
                /**
                 * Gets or sets the plot area name.
                 */
                get: function () {
                    return this._name;
                },
                set: function (value) {
                    if (value != this._name) {
                        this._name = wijmo.asString(value, true);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PlotArea.prototype, "width", {
                /**
                 * Gets or sets width of the plot area.
                 *
                 * The width can be specified as number(sets the width in pixels) or
                 * string in the format '{number}*' (star sizing).
                 */
                get: function () {
                    return this._width;
                },
                set: function (value) {
                    if (value != this._width) {
                        this._width = value;
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PlotArea.prototype, "height", {
                /**
                 * Gets or sets height of the plot area.
                 *
                 * The height can be specified as number(sets the height in pixels) or
                 * string in the format '{number}*' (star sizing).
                 */
                get: function () {
                    return this._height;
                },
                set: function (value) {
                    if (value != this._height) {
                        this._height = value;
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PlotArea.prototype, "style", {
                /**
                 * Gets or sets the style of the plot area.
                 *
                 * Using <b>style</b> property, you can set appearance of the plot area.
                 * For example:
                 * <pre>
                 *   pa.style = { fill: 'rgba(0,255,0,0.1)' };
                 * </pre>
                 */
                get: function () {
                    return this._style;
                },
                set: function (value) {
                    if (value != this._style) {
                        this._style = value;
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            PlotArea.prototype._invalidate = function () {
                if (this._chart) {
                    this._chart.invalidate();
                }
            };
            PlotArea.prototype._render = function (engine) {
                engine.drawRect(this._rect.left, this._rect.top, this._rect.width, this._rect.height, null, this.style);
            };
            PlotArea.prototype._setPlotX = function (x, w) {
                this._rect.left = x;
                this._rect.width = w;
            };
            PlotArea.prototype._setPlotY = function (y, h) {
                this._rect.top = y;
                this._rect.height = h;
            };
            return PlotArea;
        }());
        chart.PlotArea = PlotArea;
        /**
         * Represents a collection of @see:PlotArea objects in a @see:FlexChartCore control.
         */
        var PlotAreaCollection = (function (_super) {
            __extends(PlotAreaCollection, _super);
            function PlotAreaCollection() {
                _super.apply(this, arguments);
            }
            /**
             * Gets a plot area by name.
             *
             * @param name The name of the plot area to look for.
             * @return The axis object with the specified name, or null if not found.
             */
            PlotAreaCollection.prototype.getPlotArea = function (name) {
                var index = this.indexOf(name);
                return index > -1 ? this[index] : null;
            };
            /**
             * Gets the index of a plot area by name.
             *
             * @param name The name of the plot area to look for.
             * @return The index of the plot area with the specified name, or -1 if not found.
             */
            PlotAreaCollection.prototype.indexOf = function (name) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i].name == name) {
                        return i;
                    }
                }
                return -1;
            };
            PlotAreaCollection.prototype._getWidth = function (column) {
                var w;
                for (var i = 0; i < this.length; i++) {
                    var pa = this[i];
                    if (pa.column == column && pa.row == 0 /* ? */) {
                        return pa.width;
                    }
                }
                return w;
            };
            PlotAreaCollection.prototype._getHeight = function (row) {
                var w;
                for (var i = 0; i < this.length; i++) {
                    var pa = this[i];
                    if (pa.row == row && pa.column == 0 /* ? */) {
                        return pa.height;
                    }
                }
                return w;
            };
            PlotAreaCollection.prototype._calculateWidths = function (width, ncols) {
                if (ncols <= 0)
                    throw ("ncols");
                var glens = []; // _GridLength[ncols];
                for (var i = 0; i < ncols; i++) {
                    var w = this._getWidth(i);
                    glens[i] = new _GridLength(w);
                }
                return this._calculateLengths(width, ncols, glens);
            };
            PlotAreaCollection.prototype._calculateHeights = function (height, nrows) {
                if (nrows <= 0)
                    throw ("nrows");
                var glens = [];
                for (var i = 0; i < nrows; i++) {
                    var h = this._getHeight(i);
                    glens[i] = new _GridLength(h);
                }
                return this._calculateLengths(height, nrows, glens);
            };
            PlotAreaCollection.prototype._calculateLengths = function (width, ncols, glens) {
                var ws = [ncols];
                var wabs = 0.0;
                var nstars = 0.0;
                for (var i = 0; i < ncols; i++) {
                    if (glens[i].isAbsolute) {
                        ws[i] = glens[i].value;
                        wabs += ws[i];
                    }
                    else if (glens[i].isStar)
                        nstars += glens[i].value;
                    else if (glens[i].isAuto)
                        nstars++;
                }
                var availw = width - wabs;
                var wstar = availw / nstars;
                for (var i = 0; i < ncols; i++) {
                    if (glens[i].isStar)
                        ws[i] = wstar * glens[i].value;
                    else if (glens[i].isAuto)
                        ws[i] = wstar;
                    if (ws[i] < 0)
                        ws[i] = 0;
                }
                return ws;
            };
            return PlotAreaCollection;
        }(wijmo.collections.ObservableArray));
        chart.PlotAreaCollection = PlotAreaCollection;
        var _GridUnitType;
        (function (_GridUnitType) {
            _GridUnitType[_GridUnitType["Auto"] = 0] = "Auto";
            _GridUnitType[_GridUnitType["Pixel"] = 1] = "Pixel";
            _GridUnitType[_GridUnitType["Star"] = 2] = "Star";
        })(_GridUnitType || (_GridUnitType = {}));
        var _GridLength = (function () {
            function _GridLength(s) {
                if (s === void 0) { s = null; }
                this._unitType = _GridUnitType.Auto;
                if (s) {
                    s = s.toString();
                    if (s.indexOf('*') >= 0) {
                        this._unitType = _GridUnitType.Star;
                        s = s.replace('*', '');
                        this._value = parseFloat(s);
                        if (isNaN(this._value)) {
                            this._value = 1;
                        }
                    }
                    else {
                        this._unitType = _GridUnitType.Pixel;
                        this._value = parseFloat(s);
                        if (isNaN(this._value)) {
                            this._unitType = _GridUnitType.Auto;
                            this._value = 1;
                        }
                    }
                }
            }
            Object.defineProperty(_GridLength.prototype, "value", {
                get: function () {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_GridLength.prototype, "isStar", {
                get: function () {
                    return this._unitType == _GridUnitType.Star;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_GridLength.prototype, "isAbsolute", {
                get: function () {
                    return this._unitType == _GridUnitType.Pixel;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_GridLength.prototype, "isAuto", {
                get: function () {
                    return this._unitType == _GridUnitType.Auto;
                },
                enumerable: true,
                configurable: true
            });
            return _GridLength;
        }());
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=PlotArea.js.map