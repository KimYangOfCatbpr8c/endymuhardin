module wijmo.chart.radar {
    'use strict';

    /**
     * Column(Rose) radar chart plotter.
     */
    export class _RadarBarPlotter extends _BarPlotter {
        
        adjustLimits(dataInfo: _DataInfo, plotRect: Rect): Rect {
            //return super.adjustLimits(dataInfo, plotRect);
            this.dataInfo = dataInfo;

            var xmin = dataInfo.getMinX();
            var ymin = dataInfo.getMinY();
            var xmax = dataInfo.getMaxX();
            var ymax = dataInfo.getMaxY();

            var dx = dataInfo.getDeltaX();
            if (dx <= 0) {
                dx = 1;
            }
            if ((<any>this.chart).totalAngle < 360) {
                dx = 0;
            }

            this.unload();
            if (!this.chart.axisY.logBase) {
                if (this.origin > ymax) {
                    ymax = this.origin;
                } else if (this.origin < ymin) {
                    ymin = this.origin;
                }
            }
            return new Rect(xmin, ymin, xmax - xmin + dx, ymax - ymin);
        }

        plotSeries(engine: IRenderEngine, ax: _IAxis, ay: _IAxis, series: _ISeries, palette: _IPalette, iser: number, nser: number) {
            var si = this.chart.series.indexOf(series);
            var ser: SeriesBase = asType(series, SeriesBase);
            var options = this.chart.options;
            var cw = this.width;
            var wpx = 0;
            var chart: any = this.chart;
            var startAngle = - 90 * Math.PI / 180;
            iser = iser || 0;
            var axid = ser._getAxisY()._uniqueId;
            var area;

            var stackNeg = this.stackNegMap[axid];
            var stackPos = this.stackPosMap[axid];
            var stacked = this.stacking != Stacking.None;
            var stacked100 = this.stacking == Stacking.Stacked100pc;

            var yvals = series.getValues(0);
            var xvals = series.getValues(1);

            if (!yvals) {
                return;
            }

            if (!xvals) {
                xvals = this.dataInfo.getXVals();
            }

            // find minimal distance between point and use it as column width
            var delta;
            if (xvals) {
                delta = chart.totalAngle / xvals.length;
            } else {
                delta = chart.totalAngle / (ax.actualMax - ax.actualMin);
            }
            if (delta > 0) {
                if (stacked) {
                    cw = delta * cw * Math.PI / 180;
                } else {
                    cw = delta * Math.pow(cw, iser + 1) * Math.PI / 180;
                }
            }

            // set series fill and stroke from style
            var fill = ser._getSymbolFill(si),
                altFill = ser._getAltSymbolFill(si) || fill,
                stroke = ser._getSymbolStroke(si),
                altStroke = ser._getAltSymbolStroke(si) || stroke;

            var len = yvals.length;
            if (xvals != null) {
                len = Math.min(len, xvals.length);
            }
            var origin = this.origin;

            var itemIndex = 0,
                currentFill: string,
                currentStroke: string;

            if (ser._getChartType() !== undefined) {
                stacked = stacked100 = false;
            }

            if (origin < ay.actualMin) {
                origin = ay.actualMin;
            } else if (origin > ay.actualMax) {
                origin = ay.actualMax;
            }

            var originScreen = ay.convert(origin),
                xmin = ax.actualMin,
                xmax = ax.actualMax;

            if (ser._isCustomAxisY()) {
                stacked = stacked100 = false;
            }

            if (!chart._areas[si]) {
                chart._areas[si] = [];
            }

            for (var i = 0; i < len; i++) {
                var datax = xvals ? xvals[i] : i;
                var datay = yvals[i];

                if (this._getSymbolOrigin) {
                    originScreen = ay.convert(this._getSymbolOrigin(origin, i, len));
                }
                if (this._getSymbolStyles) {
                    var style = this._getSymbolStyles(i, len);
                    fill = style && style.fill ? style.fill : fill;
                    altFill = style && style.fill ? style.fill : altFill;
                    stroke = style && style.stroke ? style.stroke : stroke;
                    altStroke = style && style.stroke ? style.stroke : altStroke;
                }
                // apply fill and stroke
                currentFill = datay > 0 ? fill : altFill;
                currentStroke = datay > 0 ? stroke : altStroke;
                engine.fill = currentFill;
                engine.stroke = currentStroke;

                if (_DataInfo.isValid(datax) && _DataInfo.isValid(datay)) {

                    if (stacked) {
                        var x0 = datax - 0.5 * cw,
                            x1 = datax + 0.5 * cw;
                        if ((x0 < xmin && x1 < xmin) || (x0 > xmax && x1 > xmax)) {
                            continue;
                        }
                        x0 = ax.convert(x0);
                        x1 = ax.convert(x1);

                        if (!_DataInfo.isValid(x0) || !_DataInfo.isValid(x1)) {
                            continue;
                        }

                        var y0: number, y1: number;

                        if (stacked100) {
                            var sumabs = this.dataInfo.getStackedAbsSum(datax);
                            datay = datay / sumabs;
                        }

                        var sum = isNaN(stackPos[datax]) ? 0 : stackPos[datax];
                        y0 = sum;
                        y1 = sum + datay;
                        stackPos[datax] = sum + datay;

                        var angle = ax.convert(datax),
                            radius0 = ay.convert(y0),
                            radius1 = ay.convert(y1);

                        angle = angle - cw / 2;
                        engine.drawDonutSegment(chart._center.x, chart._center.y, radius1, radius0, angle + startAngle, cw, null, ser.symbolStyle); 

                        area = new _DonutSegment(new Point(chart._center.x, chart._center.y), radius1, radius0, angle + startAngle, cw);
                        area.tag = new _DataPoint(si, i, datax, sum + datay);
                        this.hitTester.add(area, si);
                    } else {
                        var angle = ax.convert(datax),
                            radius = ay.convert(datay),
                            p = chart._convertPoint(radius, angle);

                        angle = angle - cw / 2;
                        engine.drawPieSegment(chart._center.x, chart._center.y, radius, angle + startAngle, cw, null, ser.symbolStyle);

                        area = new _PieSegment(new Point(chart._center.x, chart._center.y), radius, angle + startAngle, cw);
                        area.tag = new _DataPoint(si, i, datax, datay);
                        this.hitTester.add(area, si);
                    }
                    chart._areas[si].push(area);
                    series._setPointIndex(i, itemIndex);
                    itemIndex++;
                }
            }
        }
    }
}