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
            // Plotter for Kagi FinancialChartType
            var _KagiPlotter = (function (_super) {
                __extends(_KagiPlotter, _super);
                function _KagiPlotter() {
                    _super.call(this);
                }
                _KagiPlotter.prototype._calculate = function (series) {
                    this._init();
                    var highs = series._getBindingValues(0), lows = series._getBindingValues(1), opens = series._getBindingValues(2), closes = series._getBindingValues(3), xs = series.getValues(1) || this.chart._xvals;
                    this._calculator = new finance._KagiCalculator(highs, lows, opens, closes, xs, this._reversalAmount, this._rangeMode, this._fields);
                    this._rangeValues = this._calculator.calculate();
                    if (this._rangeValues === null || wijmo.isUndefined(this._rangeValues)) {
                        this._rangeValues = [];
                    }
                    // always regenerate x-axis labels at the end of each calculation cycle
                    this._generateXLabels(series);
                };
                _KagiPlotter.prototype.plotSeries = function (engine, ax, ay, series, palette, iser, nser) {
                    this._calculate(series);
                    var si = this.chart.series.indexOf(series), len = this._rangeValues.length, xmin = ax.actualMin, xmax = ax.actualMax, strWidth = this._DEFAULT_WIDTH, stroke = series._getSymbolStroke(si), altStroke = series._getAltSymbolStroke(si) || stroke, dx = [], dy = [];
                    engine.stroke = stroke;
                    engine.strokeWidth = strWidth;
                    var itemIndex = 0, x, start, end, min, max, area, dpt;
                    engine.startGroup();
                    for (var i = 0; i < len; i++) {
                        x = i;
                        if (chart._DataInfo.isValid(x) && xmin <= x && x <= xmax) {
                            start = this._rangeValues[i].open;
                            end = this._rangeValues[i].close;
                            // main (vertical) line
                            if (i === 0) {
                                min = Math.min(start, end);
                                max = Math.max(start, end);
                                // determine thinkness
                                engine.strokeWidth = start > end ? strWidth : strWidth * 2;
                                // determine stroke
                                engine.stroke = start > end ? stroke : altStroke;
                                // main line
                                engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(end));
                                // initial inflection line
                                engine.drawLine(ax.convert(x - 1) - (engine.strokeWidth / 2), ay.convert(start), ax.convert(x) + (engine.strokeWidth / 2), ay.convert(start));
                            }
                            else if (engine.strokeWidth === strWidth) {
                                if (end > start) {
                                    if (end > max) {
                                        // change in thickness
                                        engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(max));
                                        engine.strokeWidth = strWidth * 2;
                                        engine.stroke = altStroke;
                                        engine.drawLine(ax.convert(x), ay.convert(max), ax.convert(x), ay.convert(end));
                                        // new min
                                        min = start;
                                    }
                                    else {
                                        // maintain current thickness
                                        engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(end));
                                    }
                                    // new max
                                    max = end;
                                }
                                else {
                                    engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(end));
                                }
                            }
                            else if ((engine.strokeWidth / 2) === strWidth) {
                                if (end < start) {
                                    if (end < min) {
                                        // change in thickness
                                        engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(min));
                                        engine.strokeWidth = strWidth;
                                        engine.stroke = stroke;
                                        engine.drawLine(ax.convert(x), ay.convert(min), ax.convert(x), ay.convert(end));
                                        // new max
                                        max = start;
                                    }
                                    else {
                                        // maintain thickness
                                        engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(end));
                                    }
                                    // new min
                                    min = end;
                                }
                                else {
                                    engine.drawLine(ax.convert(x), ay.convert(start), ax.convert(x), ay.convert(end));
                                }
                            }
                            // inflection (horizontal) line
                            if (i < (len - 1)) {
                                // x needs to account for engine.strokeWidth, after conversion, to prevent corner gaps
                                // where horizontal and vertical lines meet
                                engine.drawLine(ax.convert(x) - (engine.strokeWidth / 2), ay.convert(end), ax.convert(x + 1) + (engine.strokeWidth / 2), ay.convert(end));
                            }
                            // manually specify values for HitTestInfo
                            dpt = this._getDataPoint(si, i, series, end);
                            // add item to HitTester
                            area = new chart._CircleArea(new wijmo.Point(ax.convert(x), ay.convert(end)), 0.5 * engine.strokeWidth);
                            area.tag = dpt;
                            this.hitTester.add(area, si);
                            // point index
                            series._setPointIndex(i, itemIndex);
                            itemIndex++;
                            // append x/y values to collection for _LinesArea which
                            // is needed for selection
                            dx.push(ax.convert(x));
                            dy.push(ay.convert(start));
                            dx.push(ax.convert(x));
                            dy.push(ay.convert(end));
                        }
                    }
                    engine.endGroup();
                    // add _LinesArea for selection
                    this.hitTester.add(new chart._LinesArea(dx, dy), si);
                };
                _KagiPlotter.prototype._init = function () {
                    _super.prototype._init.call(this);
                    // ReversalAmount
                    this._reversalAmount = this.getNumOption("reversalAmount", "kagi") || 14;
                    // RangeMode
                    this._rangeMode = this.getOption("rangeMode", "kagi") || finance.RangeMode.Fixed;
                    this._rangeMode = wijmo.asEnum(this._rangeMode, finance.RangeMode, true);
                    // DataFields
                    this._fields = this.getOption("fields", "kagi") || finance.DataFields.Close;
                    this._fields = wijmo.asEnum(this._fields, finance.DataFields, true);
                };
                _KagiPlotter.prototype.clear = function () {
                    _super.prototype.clear.call(this);
                    this._reversalAmount = null;
                    this._rangeMode = null;
                };
                return _KagiPlotter;
            }(finance._BaseRangePlotter));
            finance._KagiPlotter = _KagiPlotter;
        })(finance = chart.finance || (chart.finance = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_KagiPlotter.js.map