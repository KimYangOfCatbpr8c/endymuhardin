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
         * Area chart plotter.
         */
        var _AreaPlotter = (function (_super) {
            __extends(_AreaPlotter, _super);
            function _AreaPlotter() {
                _super.call(this);
                this.stacking = chart.Stacking.None;
                this.isSpline = false;
                this.stackPos = {};
                this.stackNeg = {};
                //this.clipping = false;
            }
            _AreaPlotter.prototype.adjustLimits = function (dataInfo, plotRect) {
                this.dataInfo = dataInfo;
                var xmin = dataInfo.getMinX();
                var ymin = dataInfo.getMinY();
                var xmax = dataInfo.getMaxX();
                var ymax = dataInfo.getMaxY();
                if (this.isSpline) {
                    var dy = 0.1 * (ymax - ymin);
                    if (!this.chart.axisY.logBase)
                        ymin -= dy;
                    ymax += dy;
                }
                if (this.rotated) {
                    return new wijmo.Rect(ymin, xmin, ymax - ymin, xmax - xmin);
                }
                else {
                    return new wijmo.Rect(xmin, ymin, xmax - xmin, ymax - ymin);
                }
            };
            _AreaPlotter.prototype.clear = function () {
                _super.prototype.clear.call(this);
                this.stackNeg = {};
                this.stackPos = {};
            };
            _AreaPlotter.prototype.plotSeries = function (engine, ax, ay, series, palette, iser, nser) {
                var si = this.chart.series.indexOf(series);
                var ser = series;
                //if (iser == 0) {
                //    this.stackNeg = {};
                //    this.stackPos = {};
                //}
                var ys = series.getValues(0);
                var xs = series.getValues(1);
                if (!ys) {
                    return;
                }
                var len = ys.length;
                if (!len) {
                    return;
                }
                if (!xs)
                    xs = this.dataInfo.getXVals();
                var hasXs = true;
                if (!xs) {
                    hasXs = false;
                    xs = new Array(len);
                }
                else if (xs.length < len) {
                    len = xs.length;
                }
                var xvals = new Array();
                var yvals = new Array();
                var xvals0 = new Array();
                var yvals0 = new Array();
                var stacked = this.stacking != chart.Stacking.None && !ser._isCustomAxisY();
                var stacked100 = this.stacking == chart.Stacking.Stacked100pc && !ser._isCustomAxisY();
                if (ser._getChartType() !== undefined) {
                    stacked = stacked100 = false;
                }
                var rotated = this.rotated;
                var hasNulls = false;
                var interpolateNulls = this.chart.interpolateNulls;
                var xmax = null;
                var xmin = null;
                var prect = this.chart._plotRect;
                for (var i = 0; i < len; i++) {
                    var datax = hasXs ? xs[i] : i;
                    var datay = ys[i];
                    if (xmax === null || datax > xmax) {
                        xmax = datax;
                    }
                    if (xmin === null || datax < xmin) {
                        xmin = datax;
                    }
                    if (chart._DataInfo.isValid(datax) && chart._DataInfo.isValid(datay)) {
                        var x = rotated ? ay.convert(datax) : ax.convert(datax);
                        if (stacked) {
                            if (stacked100) {
                                var sumabs = this.dataInfo.getStackedAbsSum(datax);
                                datay = datay / sumabs;
                            }
                            var sum = 0;
                            if (datay >= 0) {
                                sum = isNaN(this.stackPos[datax]) ? 0 : this.stackPos[datax];
                                datay = this.stackPos[datax] = sum + datay;
                            }
                            else {
                                sum = isNaN(this.stackNeg[datax]) ? 0 : this.stackNeg[datax];
                                datay = this.stackNeg[datax] = sum + datay;
                            }
                            if (rotated) {
                                if (sum < ax.actualMin) {
                                    sum = ax.actualMin;
                                }
                                xvals0.push(ax.convert(sum));
                                yvals0.push(x);
                            }
                            else {
                                xvals0.push(x);
                                if (sum < ay.actualMin) {
                                    sum = ay.actualMin;
                                }
                                yvals0.push(ay.convert(sum));
                            }
                        }
                        if (rotated) {
                            var y = ax.convert(datay);
                            if (!isNaN(x) && !isNaN(y)) {
                                xvals.push(y);
                                yvals.push(x);
                                if (chart.FlexChart._contains(prect, new wijmo.Point(y, x))) {
                                    var area = new chart._CircleArea(new wijmo.Point(y, x), this._DEFAULT_SYM_SIZE);
                                    area.tag = new chart._DataPoint(si, i, datay, datax);
                                    this.hitTester.add(area, si);
                                }
                            }
                            else {
                                hasNulls = true;
                                if (!stacked && interpolateNulls !== true) {
                                    xvals.push(undefined);
                                    yvals.push(undefined);
                                }
                            }
                        }
                        else {
                            var y = ay.convert(datay);
                            if (!isNaN(x) && !isNaN(y)) {
                                xvals.push(x);
                                yvals.push(y);
                                if (chart.FlexChart._contains(prect, new wijmo.Point(x, y))) {
                                    var area = new chart._CircleArea(new wijmo.Point(x, y), this._DEFAULT_SYM_SIZE);
                                    area.tag = new chart._DataPoint(si, i, datax, datay);
                                    this.hitTester.add(area, si);
                                }
                            }
                            else {
                                hasNulls = true;
                                if (!stacked && interpolateNulls !== true) {
                                    xvals.push(undefined);
                                    yvals.push(undefined);
                                }
                            }
                        }
                    }
                    else {
                        hasNulls = true;
                        if (!stacked && interpolateNulls !== true) {
                            xvals.push(undefined);
                            yvals.push(undefined);
                        }
                    }
                }
                var swidth = this._DEFAULT_WIDTH;
                var fill = palette._getColorLight(si);
                var stroke = palette._getColor(si);
                var lstyle = chart._BasePlotter.cloneStyle(series.style, ['fill']);
                var pstyle = chart._BasePlotter.cloneStyle(series.style, ['stroke']);
                if (!stacked && interpolateNulls !== true && hasNulls) {
                    var dx = [];
                    var dy = [];
                    for (var i = 0; i < len; i++) {
                        if (xvals[i] === undefined) {
                            if (dx.length > 1) {
                                if (this.isSpline) {
                                    var s = this._convertToSpline(dx, dy);
                                    dx = s.xs;
                                    dy = s.ys;
                                }
                                engine.stroke = stroke;
                                engine.strokeWidth = swidth;
                                engine.fill = 'none';
                                engine.drawLines(dx, dy, null, lstyle);
                                this.hitTester.add(new chart._LinesArea(dx, dy), si);
                                if (rotated) {
                                    dx.push(ax.convert(ax.actualMin), ax.convert(ax.actualMin));
                                    dy.push(ay.convert(ay.actualMax), ay.convert(ay.actualMin));
                                }
                                else {
                                    dx.push(dx[dx.length - 1], dx[0]);
                                    dy.push(ay.convert(ay.actualMin), ay.convert(ay.actualMin));
                                }
                                engine.fill = fill;
                                engine.stroke = 'none';
                                engine.drawPolygon(dx, dy, null, pstyle);
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
                        if (this.isSpline) {
                            var s = this._convertToSpline(dx, dy);
                            dx = s.xs;
                            dy = s.ys;
                        }
                        engine.stroke = stroke;
                        engine.strokeWidth = swidth;
                        engine.fill = 'none';
                        engine.drawLines(dx, dy, null, lstyle);
                        this.hitTester.add(new chart._LinesArea(dx, dy), si);
                        if (rotated) {
                            dx.push(ax.convert(ax.actualMin), ax.convert(ax.actualMin));
                            dy.push(ay.convert(ay.actualMax), ay.convert(ay.actualMin));
                        }
                        else {
                            dx.push(dx[dx.length - 1], dx[0]);
                            dy.push(ay.convert(ay.actualMin), ay.convert(ay.actualMin));
                        }
                        engine.fill = fill;
                        engine.stroke = 'none';
                        engine.drawPolygon(dx, dy, null, pstyle);
                    }
                }
                else {
                    //
                    if (this.isSpline) {
                        var s = this._convertToSpline(xvals, yvals);
                        xvals = s.xs;
                        yvals = s.ys;
                    }
                    //
                    if (stacked) {
                        if (this.isSpline) {
                            var s0 = this._convertToSpline(xvals0, yvals0);
                            xvals0 = s0.xs;
                            yvals0 = s0.ys;
                        }
                        xvals = xvals.concat(xvals0.reverse());
                        yvals = yvals.concat(yvals0.reverse());
                    }
                    else {
                        if (rotated) {
                            xvals.push(ax.convert(ax.actualMin), ax.convert(ax.actualMin));
                            yvals.push(ay.convert(xmax), ay.convert(xmin));
                        }
                        else {
                            xvals.push(ax.convert(xmax), ax.convert(xmin));
                            yvals.push(ay.convert(ay.actualMin), ay.convert(ay.actualMin));
                        }
                    }
                    engine.fill = fill;
                    engine.stroke = 'none';
                    engine.drawPolygon(xvals, yvals, null, pstyle);
                    if (stacked) {
                        xvals = xvals.slice(0, xvals.length - xvals0.length);
                        yvals = yvals.slice(0, yvals.length - yvals0.length);
                    }
                    else {
                        xvals = xvals.slice(0, xvals.length - 2);
                        yvals = yvals.slice(0, yvals.length - 2);
                    }
                    engine.stroke = stroke;
                    engine.strokeWidth = swidth;
                    engine.fill = 'none';
                    engine.drawLines(xvals, yvals, null, lstyle);
                    this.hitTester.add(new chart._LinesArea(xvals, yvals), si);
                }
                this._drawSymbols(engine, series, si);
            };
            _AreaPlotter.prototype._convertToSpline = function (x, y) {
                if (x && y) {
                    var spline = new chart._Spline(x, y);
                    var s = spline.calculate();
                    return { xs: s.xs, ys: s.ys };
                }
                else {
                    return { xs: x, ys: y };
                }
            };
            _AreaPlotter.prototype._drawSymbols = function (engine, series, seriesIndex) {
                if (this.chart.itemFormatter != null) {
                    var areas = this.hitTester._map[seriesIndex];
                    for (var i = 0; i < areas.length; i++) {
                        var area = wijmo.tryCast(areas[i], chart._CircleArea);
                        if (area) {
                            var dpt = area.tag;
                            engine.startGroup();
                            var hti = new chart.HitTestInfo(this.chart, area.center, chart.ChartElement.SeriesSymbol);
                            hti._setDataPoint(dpt);
                            this.chart.itemFormatter(engine, hti, function () {
                            });
                            engine.endGroup();
                        }
                    }
                }
            };
            return _AreaPlotter;
        }(chart._BasePlotter));
        chart._AreaPlotter = _AreaPlotter;
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_AreaPlotter.js.map