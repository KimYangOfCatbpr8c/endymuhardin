module wijmo.chart {
    'use strict';

    /**
     * Box plotter.
     */
    export class _BoxPlotter extends _BarPlotter {


        plotSeries(engine: IRenderEngine, ax: _IAxis, ay: _IAxis, series: _ISeries, palette: _IPalette, iser: number, nser: number) {
            var si = this.chart.series.indexOf(series);
            var ser: SeriesBase = asType(series, SeriesBase);
            var options = (this.chart.options && this.chart.options.boxPlot) || {};
            var quartileCalculation = options && options.quartileCalculation;
            var showOutliers = options && options.showOutliers;
            var cw = options.groupWidth || this.width;
            var gapWidth = (options.gapWidth == null ? 0.2 : options.gapWidth) / 2;
            var wpx = 0;
            var padding = 0.9;
            var prevXS, prevYS;
            iser = iser || 0;
            nser = nser || 1;

            var w = cw / nser;// this.seriesCount;

            var axid = ser._getAxisY()._uniqueId;

            var stackNeg = this.stackNegMap[axid];
            var stackPos = this.stackPosMap[axid];

            var yvals = series.getValues(0);
            var xvals = series.getValues(1);

            if (!yvals) {
                return;
            }

            if (!xvals) {
                xvals = this.dataInfo.getXVals();
            }

            if (xvals) {
                // find minimal distance between point and use it as column width
                var delta = this.dataInfo.getDeltaX();
                if (delta > 0) {
                    cw *= delta;
                    w *= delta;
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

            //var symClass = FlexChart._CSS_SERIES_ITEM;
            var itemIndex = 0,
                currentFill: string,
                currentStroke: string;

            if (!this.rotated) {
                if (origin < ay.actualMin) {
                    origin = ay.actualMin;
                } else if (origin > ay.actualMax) {
                    origin = ay.actualMax;
                }

                var originScreen = ay.convert(origin),
                    xmin = ax.actualMin,
                    xmax = ax.actualMax;

                for (var i = 0; i < len; i++) {
                    var datax = xvals ? xvals[i] : i;
                    var datay =<number[]><any>yvals[i];

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
                    currentFill = datay[0] > 0 ? fill : altFill;
                    currentStroke = datay[0] > 0 ? stroke : altStroke;
                    engine.fill = currentFill;
                    engine.stroke = currentStroke;

                    if (_DataInfo.isValid(datax) && wijmo.isArray(datay) && datay.length > 0 && _DataInfo.isValid(datay[0])) {
                        var x0 = datax - 0.5 * cw + iser * w,
                            x1 = datax - 0.5 * cw + (iser + 1) * w,
                            offset = (x1 - x0) * gapWidth;

                        x0 += offset;
                        x1 -= offset;

                        if ((x0 < xmin && x1 < xmin) || (x0 > xmax && x1 > xmax)) {
                            continue;
                        }
                        x0 = ax.convert(x0);
                        x1 = ax.convert(x1);

                        if (!_DataInfo.isValid(x0) || !_DataInfo.isValid(x1)) {
                            continue;
                        }

                        var boxPlot = new _BoxPlot(datay, quartileCalculation || 'include', showOutliers),
                            bpv = {
                                min: ay.convert(boxPlot.min),
                                max: ay.convert(boxPlot.max),
                                firstQuartile: ay.convert(boxPlot.firstQuartile),
                                median: ay.convert(boxPlot.median),
                                thirdQuartile: ay.convert(boxPlot.thirdQuartile),
                                mean: ay.convert(boxPlot.mean),
                                outlierPoints: this.convertPoints(boxPlot.outlierPoints, ay),
                                innerPoints: this.convertPoints(boxPlot.innerPoints, ay)
                            },
                            rect = new Rect(Math.min(x0, x1), Math.min(bpv.min, bpv.max), Math.abs(x1 - x0), Math.abs(bpv.max - bpv.min));

                        var area = new _RectArea(rect),
                            xs = {
                                min: Math.min(x0, x1),
                                median: (x0 + x1) / 2,
                                max: Math.max(x0, x1)
                            };

                        if (this.chart.itemFormatter) {
                            engine.startGroup();
                            var hti: HitTestInfo = new HitTestInfo(this.chart, new Point(xs.median, (bpv.min + bpv.max) / 2), ChartElement.SeriesSymbol);
                            hti._setData(<Series>series, i);

                            this.chart.itemFormatter(engine, hti, () => {
                                this.drawBoxWhisker(engine, xs, bpv, prevXS, prevYS, series);
                                prevXS = xs;
                                prevYS = bpv;
                            });
                            engine.endGroup();
                        }
                        else {
                            this.drawBoxWhisker(engine, xs, bpv, prevXS, prevYS, series);
                            prevXS = xs;
                            prevYS = bpv;
                        }

                        series._setPointIndex(i, itemIndex);
                        itemIndex++;

                        var dp = new _DataPoint(si, i, datax, <any>datay);
                        (<any>dp).item = boxPlot;
                        area.tag = dp;
                        this.hitTester.add(area, si);
                    }
                }
            } else {
                if (origin < ax.actualMin) {
                    origin = ax.actualMin;
                } else if (origin > ax.actualMax) {
                    origin = ax.actualMax;
                }

                var originScreen = ax.convert(origin),
                    ymin = ay.actualMin,
                    ymax = ay.actualMax;

                for (var i = 0; i < len; i++) {
                    var datax = xvals ? xvals[i] : i,
                        datay = <number[]><any>yvals[i];

                    if (this._getSymbolOrigin) {
                        originScreen = ay.convert(this._getSymbolOrigin(origin, i));
                    }
                    if (this._getSymbolStyles) {
                        var style = this._getSymbolStyles(i);
                        fill = style && style.fill ? style.fill : fill;
                        altFill = style && style.fill ? style.fill : altFill;
                        stroke = style && style.stroke ? style.fill : stroke;
                        altStroke = style && style.stroke ? style.fill : altStroke;
                    }
                    // apply fill and stroke
                    currentFill = datay[0] > 0 ? fill : altFill;
                    currentStroke = datay[0] > 0 ? stroke : altStroke;
                    engine.fill = currentFill;
                    engine.stroke = currentStroke;

                    if (_DataInfo.isValid(datax) && wijmo.isArray(datay) && datay.length > 0 && _DataInfo.isValid(datay[0])) {
                        var y0 = datax - 0.5 * cw + iser * w,
                            y1 = datax - 0.5 * cw + (iser + 1) * w,
                            offset = (y1 - y0) * gapWidth;

                        y0 += offset;
                        y1 -= offset;

                        if ((y0 < ymin && y1 < ymin) || (y0 > ymax && y1 > ymax)) {
                            continue;
                        }
                        y0 = ay.convert(y0);
                        y1 = ay.convert(y1);

                        var boxPlot = new _BoxPlot(datay, quartileCalculation || 'include', showOutliers),
                            bpv = {
                                min: ax.convert(boxPlot.min),
                                max: ax.convert(boxPlot.max),
                                firstQuartile: ax.convert(boxPlot.firstQuartile),
                                median: ax.convert(boxPlot.median),
                                thirdQuartile: ax.convert(boxPlot.thirdQuartile),
                                mean: ax.convert(boxPlot.mean),
                                outlierPoints: this.convertPoints(boxPlot.outlierPoints, ax),
                                innerPoints: this.convertPoints(boxPlot.innerPoints, ax)
                            },
                            rect = new Rect(Math.min(bpv.min, bpv.max), Math.min(y0, y1), Math.abs(bpv.max - bpv.min), Math.abs(y1 - y0));

                        var area = new _RectArea(rect),
                            ys = {
                                min: Math.min(y0, y1),
                                median: (y0 + y1) / 2,
                                max: Math.max(y1, y0)
                            };

                        if (this.chart.itemFormatter) {
                            engine.startGroup();
                            var hti: HitTestInfo = new HitTestInfo(this.chart, new Point((bpv.min + bpv.max) / 2, ys.median), ChartElement.SeriesSymbol);
                            hti._setData(<Series>series, i);

                            this.chart.itemFormatter(engine, hti, () => {
                                this.drawBoxWhisker(engine, bpv, ys, prevXS, prevYS, series);
                                prevXS = bpv;
                                prevYS = ys;
                            });
                            engine.endGroup();
                        }
                        else {
                            this.drawBoxWhisker(engine, bpv, ys, prevXS, prevYS, series);
                            prevXS = bpv;
                            prevYS = ys;
                        }

                        series._setPointIndex(i, itemIndex);
                        itemIndex++;

                        var dp = new _DataPoint(si, i, datax, <any>datay);
                        (<any>dp).item = boxPlot;
                        area.tag = dp;
                        this.hitTester.add(area, si);
                    }
                }
            }
        }

        convertPoints(points: number[], axis: _IAxis) {
            return points.map(p => axis.convert(p));
        }

        drawBoxWhisker(engine: IRenderEngine, xs, ys, prevXS, prevYS, series: _ISeries) {
            var style = series.symbolStyle,
                o = this.chart.options || {},
                boxPlot = o.boxPlot || {},
                center: number,
                showInnerPoints = boxPlot.showInnerPoints,
                showOutliers = boxPlot.showOutliers,
                showMeanLine = boxPlot.showMeanLine,
                meanLineStyle = boxPlot.meanLineStyle,
                showMeanMarker = boxPlot.showMeanMarker,
                meanMarkerStyle = boxPlot.meanMarkerStyle;

            engine.startGroup('box-plot');
            if (this.rotated) {
                engine.drawLine(xs.min, (ys.min + ys.median) / 2, xs.min, (ys.max + ys.median) / 2, null, style);
                engine.drawLine(xs.min, ys.median, xs.firstQuartile, ys.median, null, style);
                engine.drawRect(Math.min(xs.firstQuartile, xs.thirdQuartile), Math.min(ys.min, ys.max), 
                    Math.abs(xs.thirdQuartile - xs.firstQuartile), Math.abs(ys.max - ys.min), null, style);
                engine.drawLine(xs.median, ys.min, xs.median, ys.max, null, style);
                engine.drawLine(xs.max, ys.median, xs.thirdQuartile, ys.median, null, style);
                engine.drawLine(xs.max, (ys.min + ys.median) / 2, xs.max, (ys.max + ys.median) / 2, null, style);

                if (showMeanLine && prevXS && prevYS) {
                    engine.drawLine(xs.mean, ys.median, prevXS.mean, prevYS.median, 'box-whisker-mean-line', meanLineStyle || style);
                }
                if (showMeanMarker) {
                    var offset = Math.abs(ys.median - ys.min) / 2;
                    engine.drawLine(xs.mean - offset, ys.median - offset, xs.mean + offset, ys.median + offset, null, meanMarkerStyle || style);
                    engine.drawLine(xs.mean + offset, ys.median - offset, xs.mean - offset, ys.median + offset, null, meanMarkerStyle || style);
                }
                if (showOutliers) {
                    xs.outlierPoints.forEach(p => {
                        engine.drawPieSegment(p, ys.median, 2, 0, Math.PI * 2, null, style);
                    });
                }
                if (showInnerPoints) {
                    xs.innerPoints.forEach(p => {
                        engine.drawPieSegment(p, ys.median, 2, 0, Math.PI * 2, null, style);
                    });
                }
            } else {
                engine.drawLine((xs.min + xs.median) / 2, ys.min, (xs.max + xs.median) / 2, ys.min, null, style);
                engine.drawLine(xs.median, ys.min, xs.median, ys.firstQuartile, null, style);
                engine.drawRect(Math.min(xs.min, xs.max), Math.min(ys.firstQuartile, ys.thirdQuartile),
                    Math.abs(xs.max - xs.min), Math.abs(ys.thirdQuartile - ys.firstQuartile), null, style);
                engine.drawLine(xs.min, ys.median, xs.max, ys.median, null, style);
                engine.drawLine(xs.median, ys.max, xs.median, ys.thirdQuartile, null, style);
                engine.drawLine((xs.min + xs.median) / 2, ys.max, (xs.max + xs.median) / 2, ys.max, null, style);

                if (showMeanLine && prevXS && prevYS) {
                    engine.drawLine(xs.median, ys.mean, prevXS.median, prevYS.mean, 'box-whisker-mean-line', meanLineStyle || style);
                }
                if (showMeanMarker) {
                    var offset = Math.abs(xs.median - xs.min) / 2;
                    engine.drawLine(xs.median - offset, ys.mean - offset, xs.median + offset, ys.mean + offset, null, meanMarkerStyle || style);
                    engine.drawLine(xs.median - offset, ys.mean + offset, xs.median + offset, ys.mean - offset, null, meanMarkerStyle || style);
                }
                if (showOutliers) {
                    ys.outlierPoints.forEach(p => {
                        engine.drawPieSegment(xs.median, p, 2, 0, Math.PI * 2, null, style);
                    });
                }
                if (showInnerPoints) {
                    ys.innerPoints.forEach(p => {
                        engine.drawPieSegment(xs.median, p, 2, 0, Math.PI * 2, null, style);
                    });
                }
            }
            engine.endGroup();
        }
    }

    export class _BoxPlot {
        private _data: number[];
        private _min: number;
        private _max: number;
        private _mean: number;
        private _firstQuartile: number;
        private _thirdQuartile: number;
        private _median: number;
        private _quartileCalculation: string;
        private _firstHalfIndex: number;
        private _secondHalfIndex: number;
        private _iqr: number;
        private _outlierPoints = [];
        private _innerPoints = [];
        private _showOutliers: boolean;

        constructor(data: number[], quartileCalculation: string, showOutliers: boolean) {
            this._data = data;
            this._quartileCalculation = quartileCalculation;
            this._showOutliers = showOutliers;
            this._parse();
        }

        get min(): number {
            return this._min;
        }

        get max(): number {
            return this._max;
        }

        get mean(): number {
            return this._mean;
        }

        get firstQuartile(): number {
            return this._firstQuartile;
        }

        get thirdQuartile(): number {
            return this._thirdQuartile;
        }

        get median(): number {
            return this._median;
        }

        get outlierPoints(): number[] {
            return this._outlierPoints;
        }

        get innerPoints(): number[] {
            return this._innerPoints;
        }

        _parse() {
            var len = this._data.length,
                total = 0;

            this._outlierPoints = [];
            this._innerPoints = [];
            this._data.sort((a, b) => a - b);
            this._min = this._data[0];
            this._max = this._data[len - 1];
            this._getMedianIndex(0, len - 1);
            this._median = this._getMedianValue(0, len - 1);
            this._firstQuartile = this._getMedianValue(0, this._firstHalfIndex);
            this._thirdQuartile = this._getMedianValue(this._secondHalfIndex, len - 1);
            this._iqr = 1.5 * Math.abs(this._thirdQuartile - this._firstQuartile);

            var minLimits = this._firstQuartile - this._iqr,
                maxLimits = this._thirdQuartile + this._iqr;

            if (this._showOutliers) {
                var minmax = this._max;
                this._max = this._min;
                this._min = minmax;
                this._data.forEach(v => {
                    total += v;
                    if (v < minLimits || v > maxLimits) {
                        this._outlierPoints.push(v);
                    } else {
                        if (v < this._min) {
                            this._min = v;
                        }
                        if (v > this._max) {
                            this._max = v;
                        }
                    }
                });
            } else {
                total = this._data.reduce((a, b) => a + b, 0);
            }
            this._innerPoints = this._data.filter(v => {
                if (v > this._min && v < this._max) {
                    return true;
                }
            });
            this._mean = total / len;
        }

        _getMedianIndex(min, max) {
            var val = max + min;
            if (val % 2 === 0) {
                if (this._quartileCalculation === 'exclude') {
                    this._firstHalfIndex = val / 2 - 1;
                    this._secondHalfIndex = val / 2 + 1;
                } else {
                    this._firstHalfIndex = val / 2;
                    this._secondHalfIndex = val / 2;
                }
            } else {
                this._firstHalfIndex = val / 2 - 0.5;
                this._secondHalfIndex = val / 2 + 0.5;
            }
        }

        _getMedianValue(min, max) {
            var val = max + min;
            if (val % 2 === 0) {
                return this._data[val / 2];
            } else {
                return (this._data[val / 2 - 0.5] + this._data[val / 2 + 0.5]) / 2;
            }
        }
    }
}