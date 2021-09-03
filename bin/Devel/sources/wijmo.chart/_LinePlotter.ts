module wijmo.chart {
    'use strict';

    /**
     * Line/scatter chart plotter.
     */
    export class _LinePlotter extends _BasePlotter implements _IPlotter {
        hasSymbols: boolean = false;
        hasLines: boolean = true;
        isSpline: boolean = false;
        rotated: boolean;
        stacking = Stacking.None;

        stackPos: { [key: number]: number } = {};
        stackNeg: { [key: number]: number } = {};

        constructor() {
            super();
            this.clipping = false;
        }

        clear() {
            super.clear();
            this.stackNeg = {};
            this.stackPos = {};
        }

        adjustLimits(dataInfo: _DataInfo, plotRect: Rect): Rect {
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
                ? new Rect(ymin, xmin, ymax - ymin, xmax - xmin)
                : new Rect(xmin, ymin, xmax - xmin, ymax - ymin);
        }

        plotSeries(engine: IRenderEngine, ax: _IAxis, ay: _IAxis, series: _ISeries, palette: _IPalette, iser: number, nser: number) {
            var ser: SeriesBase = asType(series, SeriesBase);
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

            var rotated = this.rotated;
            var stacked = this.stacking != Stacking.None && !ser._isCustomAxisY();
            var stacked100 = this.stacking == Stacking.Stacked100pc && !ser._isCustomAxisY();
            if (ser._getChartType() !== undefined) {
                stacked = stacked100 = false;
            }

            var interpolateNulls = this.chart.interpolateNulls;
            var hasNulls = false;

            //var symClass = FlexChart._CSS_SERIES_ITEM;

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

                    if (rotated) {
                        dpt = new _DataPoint(si, i, datay, datax);
                        var x = ax.convert(datay);
                        datay = ay.convert(datax);
                        datax = x;
                    } else {
                        dpt = new _DataPoint(si, i, datax, datay);
                        datax = ax.convert(datax);
                        datay = ay.convert(datay);
                    }
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
                engine.fill = null;

                if (hasNulls && interpolateNulls !== true) {
                    var dx = [];
                    var dy = [];

                    for (var i = 0; i < len; i++) {
                        if (xvals[i] === undefined) {
                            if (dx.length > 1) {
                                this._drawLines(engine, dx, dy, null, style, this.chart._plotrectId);
                                this.hitTester.add(new _LinesArea(dx, dy), si);
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
                        this.hitTester.add(new _LinesArea(dx, dy), si);
                        itemIndex++;
                    }
                } else {
                    this._drawLines(engine, xvals, yvals, null, style, this.chart._plotrectId);
                    this.hitTester.add(new _LinesArea(xvals, yvals), si);
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
        }

        _drawLines(engine: IRenderEngine, xs: number[], ys: number[], className?: string, style?: any, clipPath?: string) {
            if (this.isSpline) {
                engine.drawSplines(xs, ys, className, style, clipPath);
            } else {
                engine.drawLines(xs, ys, className, style, clipPath);
            }
        }

        _drawSymbol(engine: IRenderEngine, x: number, y: number, sz: number, series: SeriesBase, pointIndex: number) {
            if (this.chart.itemFormatter) {
                engine.startGroup();
                var hti: HitTestInfo = new HitTestInfo(this.chart, new Point(x, y), ChartElement.SeriesSymbol);
                hti._setData( series, pointIndex);

                this.chart.itemFormatter(engine, hti, () => {
                    if (this.hasSymbols) {
                        this._drawDefaultSymbol(engine, x, y, sz, series.symbolMarker, series.symbolStyle);
                    }
                });
                engine.endGroup();
            } else {
                this._drawDefaultSymbol(engine, x, y, sz, series.symbolMarker, series.symbolStyle);
            }
        }

        _drawDefaultSymbol(engine: IRenderEngine, x: number, y: number, sz: number, marker: Marker, style?: any) {
            if (marker == Marker.Dot) {
                engine.drawEllipse(x, y, 0.5 * sz, 0.5 * sz, null, style);
            } else if (marker == Marker.Box) {
                engine.drawRect(x - 0.5 * sz, y - 0.5 * sz, sz, sz, null, style);
            }
        }
    }
} 