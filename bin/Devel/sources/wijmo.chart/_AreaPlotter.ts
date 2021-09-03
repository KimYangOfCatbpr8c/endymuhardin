module wijmo.chart {
    'use strict';

    /**
     * Area chart plotter.
     */
    export class _AreaPlotter extends _BasePlotter implements _IPlotter {
        stacking = Stacking.None;
        isSpline = false;
        rotated: boolean;

        private stackPos: { [key: number]: number } = {};
        private stackNeg: { [key: number]: number } = {};

        constructor() {
            super();
            //this.clipping = false;
        }

        adjustLimits(dataInfo: _DataInfo, plotRect: Rect): Rect {
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
                return new Rect(ymin, xmin, ymax - ymin, xmax - xmin);
            }
            else {
                return new Rect(xmin, ymin, xmax - xmin, ymax - ymin);
            }
        }

        clear() {
            super.clear();
            this.stackNeg = {};
            this.stackPos = {};
        }

        plotSeries(engine: IRenderEngine, ax: _IAxis, ay: _IAxis, series: _ISeries, palette: _IPalette, iser: number, nser: number) {
            var si = this.chart.series.indexOf(series);
            var ser = <SeriesBase>series;
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
                hasXs = false
                xs = new Array<number>(len);
            }
            else if (xs.length < len) {
                len = xs.length;
            }

            var xvals = new Array<number>();
            var yvals = new Array<number>();

            var xvals0 = new Array<number>();
            var yvals0 = new Array<number>();

            var stacked = this.stacking != Stacking.None && !ser._isCustomAxisY();
            var stacked100 = this.stacking == Stacking.Stacked100pc && !ser._isCustomAxisY();
            if (ser._getChartType() !== undefined) {
                stacked = stacked100 = false;
            }

            var rotated = this.rotated;

            var hasNulls = false;
            var interpolateNulls = this.chart.interpolateNulls;

            var xmax: number = null;
            var xmin: number = null;

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
                if (_DataInfo.isValid(datax) && _DataInfo.isValid(datay)) {
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
                        } else {
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
                            if (FlexChart._contains(prect, new Point(y, x))) {
                                var area = new _CircleArea(new Point(y, x), this._DEFAULT_SYM_SIZE);
                                area.tag = new _DataPoint(si, i, datay, datax);
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
                            if (FlexChart._contains(prect, new Point(x, y))) {
                                var area = new _CircleArea(new Point(x, y), this._DEFAULT_SYM_SIZE);
                                area.tag = new _DataPoint(si, i, datax, datay);
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

            var lstyle = _BasePlotter.cloneStyle(series.style, ['fill']);
            var pstyle = _BasePlotter.cloneStyle(series.style, ['stroke']);

            if (!stacked && interpolateNulls !== true && hasNulls) {
                var dx = [];
                var dy = [];

                for (var i = 0; i < len; i++) {
                    if (xvals[i] === undefined) {
                        if (dx.length > 1) {
                            if (this.isSpline) {
                                var s = this._convertToSpline(dx, dy);
                                dx = s.xs; dy = s.ys;
                            }

                            engine.stroke = stroke;
                            engine.strokeWidth = swidth;
                            engine.fill = 'none';
                            engine.drawLines(dx, dy, null, lstyle);
                            this.hitTester.add(new _LinesArea(dx, dy), si);

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
                        dx = s.xs; dy = s.ys;
                    }

                    engine.stroke = stroke;
                    engine.strokeWidth = swidth;
                    engine.fill = 'none';
                    engine.drawLines(dx, dy, null, lstyle);
                    this.hitTester.add(new _LinesArea(dx, dy), si);

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
                    xvals = s.xs; yvals = s.ys;
                }
                //

                if (stacked) {
                    if (this.isSpline) {
                        var s0 = this._convertToSpline(xvals0, yvals0);
                        xvals0 = s0.xs; yvals0 = s0.ys;
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
                } else {
                    xvals = xvals.slice(0, xvals.length - 2);
                    yvals = yvals.slice(0, yvals.length - 2);
                }

                engine.stroke = stroke;
                engine.strokeWidth = swidth;
                engine.fill = 'none';
                engine.drawLines(xvals, yvals, null, lstyle);
                this.hitTester.add(new _LinesArea(xvals, yvals), si);
            }

            this._drawSymbols(engine, series, si);
        }

        _convertToSpline(x: number[], y: number[]) {
            if (x && y) {
                var spline = new _Spline(x, y);
                var s = spline.calculate();
                return { xs: s.xs, ys: s.ys };
            } else {
                return { xs: x, ys: y };
            }
        }

        _drawSymbols(engine: IRenderEngine, series: _ISeries, seriesIndex: number) {
            if (this.chart.itemFormatter != null) {
                var areas = this.hitTester._map[seriesIndex];
                for (var i = 0; i < areas.length; i++) {
                    var area: _CircleArea = tryCast(areas[i], _CircleArea);
                    if (area) {
                        var dpt = <_DataPoint>area.tag;
                        engine.startGroup();
                        var hti: HitTestInfo = new HitTestInfo(this.chart, area.center, ChartElement.SeriesSymbol);
                        hti._setDataPoint(dpt);
                        this.chart.itemFormatter(engine, hti, () => {
                        });
                        engine.endGroup();
                    }
                }
            }
        }
    }
}