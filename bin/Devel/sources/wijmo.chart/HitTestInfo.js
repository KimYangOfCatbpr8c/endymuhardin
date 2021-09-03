var wijmo;
(function (wijmo) {
    var chart;
    (function (chart_1) {
        'use strict';
        /**
         * Specifies the type of chart element found by the hitTest method.
         */
        (function (ChartElement) {
            /** The area within the axes. */
            ChartElement[ChartElement["PlotArea"] = 0] = "PlotArea";
            /** X-axis. */
            ChartElement[ChartElement["AxisX"] = 1] = "AxisX";
            /** Y-axis. */
            ChartElement[ChartElement["AxisY"] = 2] = "AxisY";
            /** The area within the control but outside the axes. */
            ChartElement[ChartElement["ChartArea"] = 3] = "ChartArea";
            /** The chart legend. */
            ChartElement[ChartElement["Legend"] = 4] = "Legend";
            /** The chart header. */
            ChartElement[ChartElement["Header"] = 5] = "Header";
            /** The chart footer. */
            ChartElement[ChartElement["Footer"] = 6] = "Footer";
            /** A chart series. */
            ChartElement[ChartElement["Series"] = 7] = "Series";
            /** A chart series symbol. */
            ChartElement[ChartElement["SeriesSymbol"] = 8] = "SeriesSymbol";
            /** A data label. */
            ChartElement[ChartElement["DataLabel"] = 9] = "DataLabel";
            /** No chart element. */
            ChartElement[ChartElement["None"] = 10] = "None";
        })(chart_1.ChartElement || (chart_1.ChartElement = {}));
        var ChartElement = chart_1.ChartElement;
        ;
        /**
         * Contains information about a part of a @see:FlexChart control at
         * a specified page coordinate.
         */
        var HitTestInfo = (function () {
            /**
             * Initializes a new instance of the @see:HitTestInfo class.
             *
             * @param chart The chart control.
             * @param point The original point in window coordinates.
             * @param element The chart element.
             */
            function HitTestInfo(chart, point, element) {
                this._pointIndex = null;
                this._chartElement = ChartElement.None;
                this._chart = chart;
                this._pt = point;
                this._chartElement = element;
            }
            Object.defineProperty(HitTestInfo.prototype, "point", {
                /**
                 * Gets the point in control coordinates to which this HitTestInfo object
                 * refers to.
                 */
                get: function () {
                    return this._pt;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HitTestInfo.prototype, "series", {
                /**
                 * Gets the chart series at the specified coordinates.
                 */
                get: function () {
                    return this._series;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HitTestInfo.prototype, "pointIndex", {
                /**
                 * Gets the data point index at the specified coordinates.
                 */
                get: function () {
                    return this._pointIndex;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HitTestInfo.prototype, "chartElement", {
                /**
                 * Gets the chart element at the specified coordinates.
                 */
                get: function () {
                    return this._chartElement;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HitTestInfo.prototype, "distance", {
                /**
                 * Gets the distance from the closest data point.
                 */
                get: function () {
                    return this._dist;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HitTestInfo.prototype, "item", {
                /**
                 * Gets the data object that corresponds to the closest data point.
                 */
                get: function () {
                    if (this._item == null) {
                        //this._item = null;
                        if (this.pointIndex !== null) {
                            if (this.series != null) {
                                this._item = this.series._getItem(this.pointIndex);
                            }
                            else if (this._chart instanceof chart_1.FlexPie) {
                                var pchart = this._chart;
                                var items = null;
                                if (pchart._cv != null) {
                                    items = pchart._cv.items;
                                }
                                else {
                                    items = pchart.itemsSource;
                                }
                                if (items && this.pointIndex < items.length) {
                                    this._item = items[this.pointIndex];
                                }
                            }
                        }
                    }
                    return this._item;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HitTestInfo.prototype, "x", {
                /**
                 * Gets the x-value of the closest data point.
                 */
                get: function () {
                    if (this._x === undefined) {
                        this._x = this._getValue(1, false);
                    }
                    return this._x;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HitTestInfo.prototype, "y", {
                /**
                 * Gets the y-value of the closest data point.
                 */
                get: function () {
                    if (this._y === undefined) {
                        this._y = this._getValue(0, false);
                    }
                    return this._y;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HitTestInfo.prototype, "value", {
                get: function () {
                    if (this._chart instanceof chart_1.FlexPie) {
                        var pchart = this._chart;
                        return pchart._values[this.pointIndex];
                    }
                    else {
                        return this.y;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HitTestInfo.prototype, "name", {
                get: function () {
                    if (this._name === undefined) {
                        if (this._chart instanceof chart_1.FlexPie) {
                            var pchart = this._chart;
                            return pchart._labels[this.pointIndex];
                        }
                        else {
                            return this.series.name;
                        }
                    }
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HitTestInfo.prototype, "_xfmt", {
                // formatted x-value
                get: function () {
                    if (this.__xfmt === undefined) {
                        this.__xfmt = this._getValue(1, true);
                    }
                    return this.__xfmt;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HitTestInfo.prototype, "_yfmt", {
                // formatted y-value
                get: function () {
                    if (this.__yfmt === undefined) {
                        this.__yfmt = this._getValue(0, true);
                    }
                    return this.__yfmt;
                },
                enumerable: true,
                configurable: true
            });
            HitTestInfo.prototype._setData = function (series, pi) {
                this._series = series;
                this._pointIndex = pi;
            };
            HitTestInfo.prototype._setDataPoint = function (dataPoint) {
                dataPoint = wijmo.asType(dataPoint, chart_1._DataPoint, true);
                if (dataPoint) {
                    this._pointIndex = dataPoint.pointIndex;
                    var fch = wijmo.asType(this._chart, wijmo.chart.FlexChartCore, true);
                    var si = dataPoint.seriesIndex;
                    if (si !== null && si >= 0 && si < fch.series.length) {
                        this._series = fch.series[si];
                    }
                    // additional properties
                    if (dataPoint['item']) {
                        this._item = dataPoint['item'];
                    }
                    if (dataPoint['x']) {
                        this._x = dataPoint['x'];
                    }
                    if (dataPoint['y']) {
                        this._y = dataPoint['y'];
                    }
                    if (dataPoint['xfmt']) {
                        this.__xfmt = dataPoint['xfmt'];
                    }
                    if (dataPoint['yfmt']) {
                        this.__yfmt = dataPoint['yfmt'];
                    }
                    if (dataPoint['name']) {
                        this._name = dataPoint['name'];
                    }
                }
            };
            // y: index=0
            // x: index=1
            HitTestInfo.prototype._getValue = function (index, formatted) {
                if (this._chart instanceof chart_1.FlexPie) {
                    var pchart = this._chart;
                    return pchart._values[this.pointIndex];
                }
                // todo: rotated charts?
                var val = null, chart = this._chart, pi = this.pointIndex, rotated = chart._isRotated();
                if (this.series !== null && pi !== null) {
                    var vals = this.series.getValues(index); // xvalues
                    var type = this.series.getDataType(index);
                    // normal values
                    if (vals && this.pointIndex < vals.length) {
                        val = vals[this.pointIndex];
                        if (type == wijmo.DataType.Date && !formatted) {
                            val = new Date(val);
                        }
                    }
                    else if (index == 1) {
                        // category axis
                        if (chart._xlabels && chart._xlabels.length > 0 && pi < chart._xlabels.length) {
                            val = chart._xlabels[pi];
                        }
                        else if (chart._xvals && pi < chart._xvals.length) {
                            val = chart._xvals[pi];
                            if (chart._xDataType == wijmo.DataType.Date && !formatted) {
                                val = new Date(val);
                            }
                        }
                    }
                }
                if (val !== null && formatted) {
                    if (rotated) {
                        if (index == 0) {
                            val = chart.axisX._formatValue(val);
                        }
                        else if (index == 1) {
                            val = chart.axisY._formatValue(val);
                        }
                    }
                    else {
                        if (index == 0) {
                            val = chart.axisY._formatValue(val);
                        }
                        else if (index == 1) {
                            val = chart.axisX._formatValue(val);
                        }
                    }
                }
                return val;
            };
            return HitTestInfo;
        }());
        chart_1.HitTestInfo = HitTestInfo;
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=HitTestInfo.js.map