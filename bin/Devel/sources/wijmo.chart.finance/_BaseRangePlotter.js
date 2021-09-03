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
            "use strict";
            // Abstract plotter for range based FinancialChartTypes
            var _BaseRangePlotter = (function (_super) {
                __extends(_BaseRangePlotter, _super);
                function _BaseRangePlotter() {
                    _super.call(this);
                    this._symFactor = 0.7;
                    this.clear();
                }
                _BaseRangePlotter.prototype.clear = function () {
                    _super.prototype.clear.call(this);
                    this._rangeValues = null;
                    this._rangeXLabels = null;
                    this._calculator = null;
                };
                _BaseRangePlotter.prototype.unload = function () {
                    _super.prototype.unload.call(this);
                    var series, ax;
                    for (var i = 0; i < this.chart.series.length; i++) {
                        series = this.chart.series[i];
                        if (!series) {
                            continue;
                        }
                        ax = series._getAxisX();
                        // reset AxisX.itemsSource
                        if (ax && ax.itemsSource) {
                            ax.itemsSource = null;
                        }
                    }
                };
                // todo: possibly add support for multiple series *later* (i.e. overlays/indicators)
                // todo: better way to adjust x limits?
                _BaseRangePlotter.prototype.adjustLimits = function (dataInfo, plotRect) {
                    var series, arrTemp, xTemp, xmin = 0, xmax = 0, ymin = 0, ymax = 0, ax, padding = this.chart._xDataType === wijmo.DataType.Date ? 0.5 : 0;
                    // only one supported at the moment - possibly remove later for overlays & indicators
                    wijmo.assert(this.chart.series.length <= 1, "Current FinancialChartType only supports a single series");
                    // looping for future - will need adjusted (see above)
                    for (var i = 0; i < this.chart.series.length; i++) {
                        series = this.chart.series[i];
                        this._calculate(series);
                        if (this._rangeValues.length <= 0 || this._rangeXLabels.length <= 0) {
                            continue;
                        }
                        // create temporary array for calculating ymin & ymax
                        arrTemp = this._rangeValues.map(function (value) { return value.open; });
                        arrTemp.push.apply(arrTemp, this._rangeValues.map(function (value) { return value.close; }));
                        // create temp array for xmin & xmax
                        xTemp = this._rangeXLabels.map(function (current) { return current.value; });
                        // update y-axis
                        ymin = Math.min.apply(null, arrTemp);
                        ymax = Math.max.apply(null, arrTemp);
                        // update x-axis and set itemsSource
                        xmin = Math.min.apply(null, xTemp);
                        xmax = Math.max.apply(null, xTemp);
                        ax = series._getAxisX();
                        ax.itemsSource = this._rangeXLabels;
                    }
                    xmin -= padding;
                    return new wijmo.Rect(xmin, ymin, xmax - xmin + padding, ymax - ymin);
                };
                _BaseRangePlotter.prototype.plotSeries = function (engine, ax, ay, series, palette, iser, nser) {
                    var _this = this;
                    this._calculate(series);
                    var si = this.chart.series.indexOf(series), len = this._rangeValues.length, xmin = ax.actualMin, xmax = ax.actualMax, strWidth = this._DEFAULT_WIDTH, symSize = this._symFactor, fill = series._getSymbolFill(si), altFill = series._getAltSymbolFill(si) || "transparent", stroke = series._getSymbolStroke(si), altStroke = series._getAltSymbolStroke(si) || stroke;
                    engine.strokeWidth = strWidth;
                    var itemIndex = 0, x, start, end, dpt;
                    for (var i = 0; i < len; i++) {
                        x = i;
                        if (chart._DataInfo.isValid(x) && xmin <= x && x <= xmax) {
                            start = this._rangeValues[i].open;
                            end = this._rangeValues[i].close;
                            // symbol fill and stroke
                            engine.fill = start > end ? fill : altFill;
                            engine.stroke = start > end ? stroke : altStroke;
                            // manually specify values for HitTestInfo
                            // for Bars - dataY should be the top of the bar
                            dpt = this._getDataPoint(si, i, series, Math.max(start, end));
                            engine.startGroup();
                            if (this.chart.itemFormatter) {
                                var hti = new chart.HitTestInfo(this.chart, new wijmo.Point(ax.convert(x), ay.convert(end)), chart.ChartElement.SeriesSymbol);
                                hti._setData(series, i);
                                hti._setDataPoint(dpt);
                                this.chart.itemFormatter(engine, hti, function () {
                                    _this._drawSymbol(engine, ax, ay, si, itemIndex, symSize, x, start, end, dpt);
                                });
                            }
                            else {
                                this._drawSymbol(engine, ax, ay, si, itemIndex, symSize, x, start, end, dpt);
                            }
                            engine.endGroup();
                            series._setPointIndex(i, itemIndex);
                            itemIndex++;
                        }
                    }
                };
                _BaseRangePlotter.prototype._drawSymbol = function (engine, ax, ay, si, pi, w, x, start, end, dpt) {
                    var y0, y1, x1, x2, area;
                    x1 = ax.convert(x - 0.5 * w);
                    x2 = ax.convert(x + 0.5 * w);
                    if (x1 > x2) {
                        var tmp = x1;
                        x1 = x2;
                        x2 = tmp;
                    }
                    //x = ax.convert(x);
                    if (chart._DataInfo.isValid(start) && chart._DataInfo.isValid(end)) {
                        start = ay.convert(start);
                        end = ay.convert(end);
                        y0 = Math.min(start, end);
                        y1 = y0 + Math.abs(start - end);
                        engine.drawRect(x1, y0, x2 - x1, y1 - y0);
                        area = new chart._RectArea(new wijmo.Rect(x1, y0, x2 - x1, y1 - y0));
                        area.tag = dpt;
                        this.hitTester.add(area, si);
                    }
                };
                // generates _DataPoint for hit test support
                _BaseRangePlotter.prototype._getDataPoint = function (seriesIndex, pointIndex, series, dataY) {
                    var x = pointIndex, dpt = new chart._DataPoint(seriesIndex, pointIndex, x, dataY), item = series._getItem(this._rangeValues[pointIndex].pointIndex), bndX = series.bindingX || this.chart.bindingX, bndHigh = series._getBinding(0), bndLow = series._getBinding(1), bndOpen = series._getBinding(2), bndClose = series._getBinding(3), ay = series._getAxisY();
                    // set item related data and maintain original bindings
                    dpt["item"] = chart._BasePlotter.cloneStyle(item, []);
                    dpt["item"][bndHigh] = this._rangeValues[pointIndex].high;
                    dpt["item"][bndLow] = this._rangeValues[pointIndex].low;
                    dpt["item"][bndOpen] = this._rangeValues[pointIndex].open;
                    dpt["item"][bndClose] = this._rangeValues[pointIndex].close;
                    // set x & y related data
                    dpt["y"] = this._rangeValues[pointIndex].close;
                    dpt["yfmt"] = ay._formatValue(this._rangeValues[pointIndex].close);
                    dpt["x"] = dpt["item"][bndX];
                    dpt["xfmt"] = this._rangeXLabels[pointIndex]._text;
                    return dpt;
                };
                // initialize variables for calculations
                _BaseRangePlotter.prototype._init = function () {
                    this._rangeValues = [];
                    this._rangeXLabels = [];
                };
                // abstract method
                _BaseRangePlotter.prototype._calculate = function (series) { };
                // generates new labels for the x-axis based on derived data
                _BaseRangePlotter.prototype._generateXLabels = function (series) {
                    var _this = this;
                    var textVal, ax = series._getAxisX(), dataType = series.getDataType(1) || this.chart._xDataType;
                    // todo: find a better way and/or separate
                    this._rangeValues.forEach(function (value, index) {
                        var val = value.x;
                        if (dataType === wijmo.DataType.Date) {
                            textVal = wijmo.Globalize.format(chart.FlexChart._fromOADate(val), ax.format || "d");
                        }
                        else if (dataType === wijmo.DataType.Number) {
                            textVal = ax._formatValue(val);
                        }
                        else if ((dataType === null || dataType === wijmo.DataType.String) && _this.chart._xlabels) {
                            textVal = _this.chart._xlabels[val];
                        }
                        else {
                            textVal = val.toString();
                        }
                        // _text property will be used as a backup for the text property
                        // there could be cases, like Renko, where text is cleared
                        _this._rangeXLabels.push({ value: index, text: textVal, _text: textVal });
                    }, this);
                };
                // provides access to any value within FlexChartCore's "options" property
                _BaseRangePlotter.prototype.getOption = function (name, parent) {
                    var options = this.chart.options;
                    if (parent) {
                        options = options ? options[parent] : null;
                    }
                    if (options && !wijmo.isUndefined(options[name]) && options[name] !== null) {
                        return options[name];
                    }
                    return undefined;
                };
                return _BaseRangePlotter;
            }(chart._BasePlotter));
            finance._BaseRangePlotter = _BaseRangePlotter;
            /**
             * Specifies which fields are to be used for calculation. Applies to Renko and Kagi chart types.
             */
            (function (DataFields) {
                /** Close values are used for calculations. */
                DataFields[DataFields["Close"] = 0] = "Close";
                /** High values are used for calculations. */
                DataFields[DataFields["High"] = 1] = "High";
                /** Low values are used for calculations. */
                DataFields[DataFields["Low"] = 2] = "Low";
                /** Open values are used for calculations. */
                DataFields[DataFields["Open"] = 3] = "Open";
                /** High-Low method is used for calculations. DataFields.HighLow is currently not
                 * supported with Renko chart types. */
                DataFields[DataFields["HighLow"] = 4] = "HighLow";
                /** Average of high and low values is used for calculations. */
                DataFields[DataFields["HL2"] = 5] = "HL2";
                /** Average of high, low, and close values is used for calculations. */
                DataFields[DataFields["HLC3"] = 6] = "HLC3";
                /** Average of high, low, open, and close values is used for calculations. */
                DataFields[DataFields["HLOC4"] = 7] = "HLOC4";
            })(finance.DataFields || (finance.DataFields = {}));
            var DataFields = finance.DataFields;
            /**
             * Specifies the unit for Kagi and Renko chart types.
             */
            (function (RangeMode) {
                /** Uses a fixed, positive number for the Kagi chart's reversal amount
                 * or Renko chart's box size. */
                RangeMode[RangeMode["Fixed"] = 0] = "Fixed";
                /** Uses the current Average True Range value for Kagi chart's reversal amount
                 * or Renko chart's box size. When ATR is used, the reversal amount or box size
                 * option of these charts must be an integer and will be used as the period for
                 * the ATR calculation. */
                RangeMode[RangeMode["ATR"] = 1] = "ATR";
                /** Uses a percentage for the Kagi chart's reversal amount. RangeMode.Percentage
                 * is currently not supported with Renko chart types. */
                RangeMode[RangeMode["Percentage"] = 2] = "Percentage";
            })(finance.RangeMode || (finance.RangeMode = {}));
            var RangeMode = finance.RangeMode;
        })(finance = chart.finance || (chart.finance = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_BaseRangePlotter.js.map