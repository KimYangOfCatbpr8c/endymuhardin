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
         * Line/scatter chart plotter.
         */
        var _LinePlotter = (function (_super) {
            __extends(_LinePlotter, _super);
            function _LinePlotter() {
                _super.call(this);
                this.hasSymbols = false;
                this.hasLines = true;
                this.isSpline = false;
                this.stacking = chart.Stacking.None;
                this.stackPos = {};
                this.stackNeg = {};
                this.clipping = false;
            }
            _LinePlotter.prototype.clear = function () {
                _super.prototype.clear.call(this);
                this.stackNeg = {};
                this.stackPos = {};
            };
            _LinePlotter.prototype.adjustLimits = function (dataInfo, plotRect) {
                this.dataInfo = dataInfo;
                var xmin = dataInfo.getMinX();
                var ymin = dataInfo.getMinY();
                var xmax = dataInfo.getMaxX();
                var ymax = dataInfo.getMaxY();
                if (this.isSpline && !this.chart.axisY.logBase) {
                    var dy = 0.1 * (ymax - ymin);
                    ymin -= dy;
                    ymax += dy;
                }
                return this.rotated
                    ? new wijmo.Rect(ymin, xmin, ymax - ymin, xmax - xmin)
                    : new wijmo.Rect(xmin, ymin, xmax - xmin, ymax - ymin);
            };
            _LinePlotter.prototype.plotSeries = function (engine, ax, ay, series, palette, iser, nser) {
                var ser = wijmo.asType(series, chart.SeriesBase);
                var si = this.chart.series.indexOf(series);
                //if (iser == 0) {
                //    this.stackNeg = {};
                //    this.stackPos = {};
                //}
                var ys = series.getValues(0);
                var xs = series.getValues(1);
                if (!ys) {
                    return;
                }
                if (!xs) {
                    xs = this.dataInfo.getXVals();
                }
                var style = chart._BasePlotter.cloneStyle(series.style, ['fill']);
                var len = ys.length;
                var hasXs = true;
                if (!xs) {
                    hasXs = false;
                    xs = new Array(len);
                }
                else {
                    len = Math.min(len, xs.length);
                }
                var swidth = this._DEFAULT_WIDTH, fill = ser._getSymbolFill(si), altFill = ser._getAltSymbolFill(si) || fill, stroke = ser._getSymbolStroke(si), altStroke = ser._getAltSymbolStroke(si) || stroke, symSize = ser._getSymbolSize();
                engine.stroke = stroke;
                engine.strokeWidth = swidth;
                engine.fill = fill;
                var xvals = new Array();
                var yvals = new Array();
                var rotated = this.rotated;
                var stacked = this.stacking != chart.Stacking.None && !ser._isCustomAxisY();
                var stacked100 = this.stacking == chart.Stacking.Stacked100pc && !ser._isCustomAxisY();
                if (ser._getChartType() !== undefined) {
                    stacked = stacked100 = false;
                }
                var interpolateNulls = this.chart.interpolateNulls;
                var hasNulls = false;
                //var symClass = FlexChart._CSS_SERIES_ITEM;
                for (var i = 0; i < len; i++) {
                    var datax = hasXs ? xs[i] : i;
                    var datay = ys[i];
                    if (chart._DataInfo.isValid(datax) && chart._DataInfo.isValid(datay)) {
                        if (stacked) {
                            if (stacked100) {
                                var sumabs = this.dataInfo.getStackedAbsSum(datax);
                                datay = datay / sumabs;
                            }
                            if (datay >= 0) {
                                var sum = isNaN(this.stackPos[datax]) ? 0 : this.stackPos[datax];
                                datay = this.stackPos[datax] = sum + datay;
                            }
                            else {
                                var sum = isNaN(this.stackNeg[datax]) ? 0 : this.stackNeg[datax];
                                datay = this.stackNeg[datax] = sum + datay;
                            }
                        }
                        var dpt;
                        if (rotated) {
                            dpt = new chart._DataPoint(si, i, datay, datax);
                            var x = ax.convert(datay);
                            datay = ay.convert(datax);
                            datax = x;
                        }
                        else {
                            dpt = new chart._DataPoint(si, i, datax, datay);
                            datax = ax.convert(datax);
                            datay = ay.convert(datay);
                        }
                        if (!isNaN(datax) && !isNaN(datay)) {
                            xvals.push(datax);
                            yvals.push(datay);
                            var area = new chart._CircleArea(new wijmo.Point(datax, datay), 0.5 * symSize);
                            area.tag = dpt;
                            this.hitTester.add(area, si);
                        }
                        else {
                            hasNulls = true;
                            if (interpolateNulls !== true) {
                                xvals.push(undefined);
                                yvals.push(undefined);
                            }
                        }
                    }
                    else {
                        hasNulls = true;
                        if (interpolateNulls !== true) {
                            xvals.push(undefined);
                            yvals.push(undefined);
                        }
                    }
                }
                var itemIndex = 0;
                if (this.hasLines) {
                    engine.fill = null;
                    if (hasNulls && interpolateNulls !== true) {
                        var dx = [];
                        var dy = [];
                        for (var i = 0; i < len; i++) {
                            if (xvals[i] === undefined) {
                                if (dx.length > 1) {
                                    this._drawLines(engine, dx, dy, null, style, this.chart._plotrectId);
                                    this.hitTester.add(new chart._LinesArea(dx, dy), si);
                                    itemIndex++;
                                }
                                dx = [];
                                dy = [];
                            }
                            else {
                                dx.push(xvals[i]);
                                dy.push(yvals[i]);
                            }
                        }
                        if (dx.length > 1) {
                            this._drawLines(engine, dx, dy, null, style, this.chart._plotrectId);
                            this.hitTester.add(new chart._LinesArea(dx, dy), si);
                            itemIndex++;
                        }
                    }
                    else {
                        this._drawLines(engine, xvals, yvals, null, style, this.chart._plotrectId);
                        this.hitTester.add(new chart._LinesArea(xvals, yvals), si);
                        itemIndex++;
                    }
                }
                if ((this.hasSymbols || this.chart.itemFormatter) && symSize > 0) {
                    engine.fill = fill;
                    for (var i = 0; i < len; i++) {
                        var datax = xvals[i];
                        var datay = yvals[i];
                        // scatter fill/stroke
                        if (this.hasLines === false) {
                            engine.fill = ys[i] > 0 ? fill : altFill;
                            engine.stroke = ys[i] > 0 ? stroke : altStroke;
                        }
                        //if (DataInfo.isValid(datax) && DataInfo.isValid(datay)) {
                        if (this.isValid(datax, datay, ax, ay)) {
                            this._drawSymbol(engine, datax, datay, symSize, ser, i);
                            series._setPointIndex(i, itemIndex);
                            itemIndex++;
                        }
                    }
                }
            };
            _LinePlotter.prototype._drawLines = function (engine, xs, ys, className, style, clipPath) {
                if (this.isSpline) {
                    engine.drawSplines(xs, ys, className, style, clipPath);
                }
                else {
                    engine.drawLines(xs, ys, className, style, clipPath);
                }
            };
            _LinePlotter.prototype._drawSymbol = function (engine, x, y, sz, series, pointIndex) {
                var _this = this;
                if (this.chart.itemFormatter) {
                    engine.startGroup();
                    var hti = new chart.HitTestInfo(this.chart, new wijmo.Point(x, y), chart.ChartElement.SeriesSymbol);
                    hti._setData(series, pointIndex);
                    this.chart.itemFormatter(engine, hti, function () {
                        if (_this.hasSymbols) {
                            _this._drawDefaultSymbol(engine, x, y, sz, series.symbolMarker, series.symbolStyle);
                        }
                    });
                    engine.endGroup();
                }
                else {
                    this._drawDefaultSymbol(engine, x, y, sz, series.symbolMarker, series.symbolStyle);
                }
            };
            _LinePlotter.prototype._drawDefaultSymbol = function (engine, x, y, sz, marker, style) {
                if (marker == chart.Marker.Dot) {
                    engine.drawEllipse(x, y, 0.5 * sz, 0.5 * sz, null, style);
                }
                else if (marker == chart.Marker.Box) {
                    engine.drawRect(x - 0.5 * sz, y - 0.5 * sz, sz, sz, null, style);
                }
            };
            return _LinePlotter;
        }(chart._BasePlotter));
        chart._LinePlotter = _LinePlotter;
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_LinePlotter.js.map