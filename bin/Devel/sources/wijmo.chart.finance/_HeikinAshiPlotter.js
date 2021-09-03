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
            // Plotter for Heikin-Ashi FinancialChartType
            var _HeikinAshiPlotter = (function (_super) {
                __extends(_HeikinAshiPlotter, _super);
                function _HeikinAshiPlotter() {
                    _super.call(this);
                    this._symFactor = 0.7;
                    this.clear();
                }
                _HeikinAshiPlotter.prototype.clear = function () {
                    _super.prototype.clear.call(this);
                    this._haValues = null;
                    this._calculator = null;
                };
                _HeikinAshiPlotter.prototype.plotSeries = function (engine, ax, ay, series, palette, iser, nser) {
                    var _this = this;
                    this._calculate(series);
                    var ser = wijmo.asType(series, chart.SeriesBase), si = this.chart.series.indexOf(series), xs = series.getValues(1), sw = this._symFactor;
                    var len = this._haValues.length, hasXs = true;
                    if (!xs) {
                        xs = this.dataInfo.getXVals();
                    }
                    else {
                        // find minimal distance between point and use it as column width
                        var delta = this.dataInfo.getDeltaX();
                        if (delta > 0) {
                            sw *= delta;
                        }
                    }
                    if (!xs) {
                        hasXs = false;
                        xs = new Array(len);
                    }
                    else {
                        len = Math.min(len, xs.length);
                    }
                    var swidth = this._DEFAULT_WIDTH, fill = ser._getSymbolFill(si), altFill = ser._getAltSymbolFill(si) || "transparent", stroke = ser._getSymbolStroke(si), altStroke = ser._getAltSymbolStroke(si) || stroke, 
                    //symSize = ser._getSymbolSize(),
                    //symStyle = series.symbolStyle,
                    symSize = sw, dt = series.getDataType(1) || series.chart._xDataType;
                    engine.strokeWidth = swidth;
                    var xmin = ax.actualMin, xmax = ax.actualMax, itemIndex = 0, currentFill, currentStroke, x, dpt, hi, lo, open, close;
                    for (var i = 0; i < len; i++) {
                        x = hasXs ? xs[i] : i;
                        if (chart._DataInfo.isValid(x) && xmin <= x && x <= xmax) {
                            hi = this._haValues[i].high;
                            lo = this._haValues[i].low;
                            open = this._haValues[i].open;
                            close = this._haValues[i].close;
                            currentFill = open < close ? altFill : fill;
                            currentStroke = open < close ? altStroke : stroke;
                            engine.fill = currentFill;
                            engine.stroke = currentStroke;
                            engine.startGroup();
                            // manually specify values for HitTestInfo
                            dpt = this._getDataPoint(si, i, x, series);
                            if (this.chart.itemFormatter) {
                                var hti = new chart.HitTestInfo(this.chart, new wijmo.Point(ax.convert(x), ay.convert(hi)), chart.ChartElement.SeriesSymbol);
                                hti._setData(ser, i);
                                hti._setDataPoint(dpt);
                                this.chart.itemFormatter(engine, hti, function () {
                                    _this._drawSymbol(engine, ax, ay, si, i, currentFill, symSize, x, hi, lo, open, close, dpt, dt);
                                });
                            }
                            else {
                                this._drawSymbol(engine, ax, ay, si, i, currentFill, symSize, x, hi, lo, open, close, dpt, dt);
                            }
                            engine.endGroup();
                            series._setPointIndex(i, itemIndex);
                            itemIndex++;
                        }
                    }
                };
                // modified variation of FinancialPlotter's implementation - added optional _DataPoint parameter
                _HeikinAshiPlotter.prototype._drawSymbol = function (engine, ax, ay, si, pi, fill, w, x, hi, lo, open, close, dpt, dt) {
                    var area, y0 = null, y1 = null, x1 = null, x2 = null, half = dt === wijmo.DataType.Date ? 43200000 : 0.5; // todo: better way?
                    x1 = ax.convert(x - half * w);
                    x2 = ax.convert(x + half * w);
                    if (x1 > x2) {
                        var tmp = x1;
                        x1 = x2;
                        x2 = tmp;
                    }
                    x = ax.convert(x);
                    if (chart._DataInfo.isValid(open) && chart._DataInfo.isValid(close)) {
                        open = ay.convert(open);
                        close = ay.convert(close);
                        y0 = Math.min(open, close);
                        y1 = y0 + Math.abs(open - close);
                        engine.drawRect(x1, y0, x2 - x1, y1 - y0);
                        area = new chart._RectArea(new wijmo.Rect(x1, y0, x2 - x1, y1 - y0));
                        area.tag = dpt;
                        this.hitTester.add(area, si);
                    }
                    if (chart._DataInfo.isValid(hi)) {
                        hi = ay.convert(hi);
                        if (y0 !== null) {
                            engine.drawLine(x, y0, x, hi);
                        }
                    }
                    if (chart._DataInfo.isValid(lo)) {
                        lo = ay.convert(lo);
                        if (y1 !== null) {
                            engine.drawLine(x, y1, x, lo);
                        }
                    }
                };
                // generates _DataPoint for hit test support
                _HeikinAshiPlotter.prototype._getDataPoint = function (seriesIndex, pointIndex, x, series) {
                    var dpt = new chart._DataPoint(seriesIndex, pointIndex, x, this._haValues[pointIndex].high), item = series._getItem(pointIndex), bndHigh = series._getBinding(0), bndLow = series._getBinding(1), bndOpen = series._getBinding(2), bndClose = series._getBinding(3), ay = series._getAxisY();
                    // set item related data and maintain original binding
                    dpt["item"] = chart._BasePlotter.cloneStyle(item, []);
                    dpt["item"][bndHigh] = this._haValues[pointIndex].high;
                    dpt["item"][bndLow] = this._haValues[pointIndex].low;
                    dpt["item"][bndOpen] = this._haValues[pointIndex].open;
                    dpt["item"][bndClose] = this._haValues[pointIndex].close;
                    // set y related data
                    dpt["y"] = this._haValues[pointIndex].high;
                    dpt["yfmt"] = ay._formatValue(this._haValues[pointIndex].high);
                    // don't set "x" or "xfmt" values - can use default behavior
                    return dpt;
                };
                _HeikinAshiPlotter.prototype._calculate = function (series) {
                    var highs = series._getBindingValues(0), lows = series._getBindingValues(1), opens = series._getBindingValues(2), closes = series._getBindingValues(3);
                    this._calculator = new finance._HeikinAshiCalculator(highs, lows, opens, closes);
                    this._haValues = this._calculator.calculate();
                    if (this._haValues === null || wijmo.isUndefined(this._haValues)) {
                        this._init();
                    }
                };
                _HeikinAshiPlotter.prototype._init = function () {
                    this._haValues = [];
                };
                return _HeikinAshiPlotter;
            }(chart._FinancePlotter));
            finance._HeikinAshiPlotter = _HeikinAshiPlotter;
        })(finance = chart.finance || (chart.finance = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_HeikinAshiPlotter.js.map