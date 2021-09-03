module wijmo.chart.radar {
    'use strict';

    /**
     * Line/scatter radar chart plotter.
     */
    export class _RadarLinePlotter extends _LinePlotter {
        isArea: boolean = false;

        plotSeries(engine: IRenderEngine, ax: _IAxis, ay: _IAxis, series: _ISeries, palette: _IPalette, iser: number, nser: number) {
            var ser: SeriesBase = asType(series, SeriesBase),
                chart = <any>this.chart,
                chartType = ser._getChartType() || chart._getChartType(),
                si = chart.series.indexOf(series);

            var ys = series.getValues(0);
            var xs = series.getValues(1);
            if (!ys) {
                return;
            }
            if (!xs) {
                xs = this.dataInfo.getXVals();
            }

            var style = _BasePlotter.cloneStyle(series.style, ['fill']);
            var len = ys.length;
            var hasXs = true;
            if (!xs) {
                hasXs = false;
                xs = new Array<number>(len);
            } else {
                len = Math.min(len, xs.length);
            }

            var swidth = this._DEFAULT_WIDTH,
                fill = ser._getSymbolFill(si),
                altFill = ser._getAltSymbolFill(si) || fill,
                stroke = ser._getSymbolStroke(si),
                altStroke = ser._getAltSymbolStroke(si) || stroke,
                symSize = ser._getSymbolSize();

            engine.stroke = stroke;
            engine.strokeWidth = swidth;
            engine.fill = fill;

            var xvals = new Array<number>();
            var yvals = new Array<number>();

            var stacked = this.stacking != Stacking.None && !ser._isCustomAxisY();
            var stacked100 = this.stacking == Stacking.Stacked100pc && !ser._isCustomAxisY();
            if (ser._getChartType() !== undefined) {
                stacked = stacked100 = false;
            }

            var interpolateNulls = this.chart.interpolateNulls;
            var hasNulls = false;

            for (var i = 0; i < len; i++) {
                var datax = hasXs ? xs[i] : i;
                var datay = ys[i];

                if (_DataInfo.isValid(datax) && _DataInfo.isValid(datay)) {

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

                    var dpt: _DataPoint;

                    dpt = new _DataPoint(si, i, datax, datay);
                    var angle = ax.convert(datax),
                        radius = ay.convert(datay),
                        point = (<any>this.chart)._convertPoint(radius, angle);

                    datax = point.x;
                    datay = point.y;

                    if (!isNaN(datax) && !isNaN(datay)) {
                        xvals.push(datax);
                        yvals.push(datay);

                        var area = new _CircleArea(new Point(datax, datay), 0.5 * symSize);
                        area.tag = dpt;
                        this.hitTester.add(area, si);
                    } else {
                        hasNulls = true;
                        if (interpolateNulls !== true) {
                            xvals.push(undefined);
                            yvals.push(undefined);
                        }
                    }
                } else {
                    hasNulls = true;
                    if (interpolateNulls !== true) {
                        xvals.push(undefined);
                        yvals.push(undefined);
                    }
                }
            }

            var itemIndex = 0;

            if (this.hasLines) {
                if (this.isArea) {
                    engine.fill = palette._getColorLight(si);
                } else {
                    engine.fill = 'none';
                }

                if (hasNulls && interpolateNulls !== true) {
                    var dx = [];
                    var dy = [];

                    for (var i = 0; i < len; i++) {
                        if (xvals[i] === undefined) {
                            dx.push(undefined);
                            dy.push(0);
                        }
                        else {
                            dx.push(xvals[i]);
                            dy.push(yvals[i]);
                        }
                    }
                    if (dx.length > 1) {
                        if (chart._isPolar && chartType !== ChartType.Area) {
                            this._drawLines(engine, dx, dy, null, style, this.chart._plotrectId);
                        } else {
                            if (chart.totalAngle < 360) {
                                dx.push(chart._center.x);
                                dy.push(chart._center.y);
                            }
                            engine.drawPolygon(dx, dy, null, style, this.chart._plotrectId);
                        }
                        //this._drawLines(engine, dx, dy, null, style, this.chart._plotrectId);
                        this.hitTester.add(new _LinesArea(dx, dy), si);
                        itemIndex++;
                    }
                } else {
                    if (chart._isPolar && chartType !== ChartType.Area) {
                        this._drawLines(engine, xvals, yvals, null, style, this.chart._plotrectId);
                    } else {
                        if (chart.totalAngle < 360) {
                            xvals.push(chart._center.x);
                            yvals.push(chart._center.y);
                        }
                        engine.drawPolygon(xvals, yvals, null, style, this.chart._plotrectId);
                    }
                    //this._drawLines(engine, xvals, yvals, null, style, this.chart._plotrectId);
                    this.hitTester.add(new _LinesArea(xvals, yvals), si);
                    itemIndex++;
                }
            }

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
                    if ((this.hasSymbols || this.chart.itemFormatter) && symSize > 0) {
                        this._drawSymbol(engine, datax, datay, symSize, ser, i);
                    }
                    series._setPointIndex(i, itemIndex);
                    itemIndex++;
                }
            }
        }
    }
}