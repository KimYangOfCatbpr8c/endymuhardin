module wijmo.chart {
    'use strict';

    /**
     * Funnel chart plotter.
     */
    export class _FunnelPlotter extends _BasePlotter implements _IPlotter {

        _getSymbolOrigin: Function;
        _getSymbolStyles: Function;
        stacking = Stacking.None;
        rotated: boolean;

        adjustLimits(dataInfo: _DataInfo, plotRect: Rect): Rect {
            this.dataInfo = dataInfo;
            var xmin = dataInfo.getMinX();
            var ymin = dataInfo.getMinY();
            var xmax = dataInfo.getMaxX();
            var ymax = dataInfo.getMaxY();

            return this.rotated
                ? new Rect(ymin, xmin, ymax - ymin, xmax - xmin)
                : new Rect(xmin, ymin, xmax - xmin, ymax - ymin);
        }

        plotSeries(engine: IRenderEngine, ax: _IAxis, ay: _IAxis, series: _ISeries, palette: _IPalette, iser: number, nser: number) {
            var si = this.chart.series.indexOf(series);
            if (si > 0) {
                //Only support one series for Funnel in current version.
                return;
            }
            var ser: SeriesBase = asType(series, SeriesBase),
                options = this.chart.options,
                yvals = series.getValues(0),
                xvals = series.getValues(1),
                rect = this.chart._plotRect,
                neckWidth = (options && options.funnel && options.funnel.neckWidth != null) ? options.funnel.neckWidth : 0.2,
                neckHeight = (options && options.funnel && options.funnel.neckHeight != null) ? options.funnel.neckHeight : 0,
                neckAbsWidth = neckWidth * rect.width,
                i = 0, sum = 0, neckX = 0, neckY = 0, areas, angle, offsetX, offsetY, h,
                x = rect.left, y = rect.top, width = rect.width, height = rect.height;

            if (!yvals) {
                return;
            }

            neckAbsWidth = neckAbsWidth ? neckAbsWidth : 1;
            if (!xvals) {
                xvals = this.dataInfo.getXVals();
            }

            var len = yvals.length;
            if (xvals != null) {
                len = Math.min(len, xvals.length);
            }
            for (i = 0; i < len; i++) {
                sum += yvals[i];
            }

            var itemIndex = 0,
                currentFill: string,
                currentStroke: string;

            if (options && options.funnel && options.funnel.type === 'rectangle') {
                neckHeight = height / len;
                neckWidth = width;
                var ratio;
                for (i = 0; i < len; i++) {
                    var datax = xvals ? xvals[i] : i;
                    var datay = yvals[i];
                    var ht;

                    // set series fill and stroke from style
                    var fill = ser._getSymbolFill(i),
                        altFill = ser._getAltSymbolFill(i) || fill,
                        stroke = ser._getSymbolStroke(i),
                        altStroke = ser._getAltSymbolStroke(i) || stroke;

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
                        if (!ratio) {
                            ratio = width / datay;
                        }
                        var w = ratio * datay;
                        x = x + (neckWidth - w) / 2;

                        engine.drawRect(x, y, w, neckHeight);

                        ht = new _FunnelSegment(new Point(x, y), w, neckHeight, w, neckHeight);

                        y = y + neckHeight;
                        neckWidth = w;
                        ht.tag = new _DataPoint(si, i, datax, datay);
                        this.hitTester.add(ht, si);

                        series._setPointIndex(i, itemIndex);
                        itemIndex++;
                    }
                }
            } else {
                //if (!this.rotated) {
                neckX = rect.left + rect.width * (1 - neckWidth) / 2;
                neckY = rect.top + rect.height * (1 - neckHeight);
                angle = (1 - neckWidth) * rect.width / 2 / (rect.height * (1 - neckHeight));
                if (isNaN(angle) || !isFinite(angle)) {
                    width = neckAbsWidth;
                    x = neckX;
                    y = neckY;
                }
                areas = rect.width * neckWidth * rect.height + rect.width * (1 - neckWidth) / 2 * rect.height * (1 - neckHeight);
                for (i = 0; i < len; i++) {
                    var datax = xvals ? xvals[i] : i;
                    var datay = yvals[i];
                    var xs = [], ys = [];
                    var ht;
                    // set series fill and stroke from style
                    var fill = ser._getSymbolFill(i),
                        altFill = ser._getAltSymbolFill(i) || fill,
                        stroke = ser._getSymbolStroke(i),
                        altStroke = ser._getAltSymbolStroke(i) || stroke;

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
                        var area = areas * datay / sum;
                        if (width > neckAbsWidth) {
                            offsetY = this._getTrapezoidOffsetY(width, area, angle);
                            if ((y + offsetY) < neckY) {
                                offsetX = angle * offsetY;
                                xs = [x, x + offsetX, x + width - offsetX, x + width];
                                ys = [y, y + offsetY, y + offsetY, y];

                                ht = new _FunnelSegment(new Point(x, y), width, offsetY, width - offsetX * 2, offsetY);
                                width = width - 2 * offsetX;
                                x = x + offsetX;
                                y = y + offsetY;
                            } else {
                                offsetY = neckY - y;
                                offsetX = angle * offsetY;
                                area = area - this._getTrapezoidArea(width, angle, offsetY);

                                h = area / neckAbsWidth;
                                xs.push(x, x + offsetX, x + offsetX, x + offsetX + neckAbsWidth, x + offsetX + neckAbsWidth, x + width);
                                ys.push(y, y + offsetY, y + offsetY + h, y + offsetY + h, y + offsetY, y);

                                ht = new _FunnelSegment(new Point(x, y), width, offsetY + h, neckAbsWidth, h);
                                width = neckAbsWidth;
                                x = x + offsetX;
                                y = y + offsetY + h;
                            }
                            engine.drawPolygon(xs, ys);
                        } else {
                            h = area / neckAbsWidth;
                            engine.drawRect(x, y, width, h);

                            ht = new _FunnelSegment(new Point(x, y), neckAbsWidth, h, neckAbsWidth, h);
                            y = y + h;
                        }

                        ht.tag = new _DataPoint(si, i, datax, datay);
                        this.hitTester.add(ht, si);

                        series._setPointIndex(i, itemIndex);
                        itemIndex++;
                    }
                }
            }
        }

        private _getTrapezoidArea(width, angle, height) {
            var offsetX = height * angle;
            return offsetX * height + (width - 2 * offsetX) * height;
        }

        private _getTrapezoidOffsetY(width, area, angle) {
            var val = Math.pow(width / 2 / angle, 2) - area / angle;
            var offsetY = width / 2 / angle - Math.sqrt(val >= 0 ? val : 0);
            return offsetY;
        }

        private drawSymbol(engine: IRenderEngine, rect: Rect, series: _ISeries, pointIndex: number, point: Point) {
            if (this.chart.itemFormatter) {
                engine.startGroup();
                var hti: HitTestInfo = new HitTestInfo(this.chart, point, ChartElement.SeriesSymbol);
                hti._setData(<Series>series, pointIndex);

                this.chart.itemFormatter(engine, hti, () => {
                    this.drawDefaultSymbol(engine, rect, series);
                });
                engine.endGroup();
            }
            else {
                this.drawDefaultSymbol(engine, rect, series);
            }
        }

        private drawDefaultSymbol(engine: IRenderEngine, rect: Rect, series: _ISeries) {
            engine.drawRect(rect.left, rect.top, rect.width, rect.height, null, series.symbolStyle/* ,'plotRect'*/);
        }
    }

    export class _FunnelSegment implements _IHitArea {
        private _center: Point;
        private _startPoint: Point;
        private _width: number;
        private _height: number;
        private _neckWidth: number;
        private _neckHeight: number;
        private _offsetX: number;
        private _offsetY: number;

        constructor(startPoint: Point, width: number, height: number, neckWidth: number, neckHeight: number) {
            this._startPoint = startPoint;
            this._width = width;
            this._height = height;
            this._neckWidth = neckWidth;
            this._neckHeight = neckHeight;
            this._center = new Point(this._startPoint.x + width / 2, this._startPoint.y + height / 2);
            this._offsetX = (width - neckWidth) / 2;
            this._offsetY = (height - neckHeight);
        }

        contains(pt: Point): boolean {
            var sp = this._startPoint,
                ox = this._offsetX,
                oy = this._offsetY;

            if (pt.x >= sp.x && pt.x <= sp.x + this._width && pt.y >= sp.y && pt.y <= sp.y + this._height) {
                if (pt.x >= sp.x + ox && pt.x <= sp.x + this._width - ox) {
                    return true;
                } else if (pt.y > sp.y - oy) {
                    return false;
                } else if (pt.x < this._center.x) {
                    return (pt.y - sp.y) / (pt.x - sp.x)  > oy / ox;
                } else if (pt.x > this._center.x) {
                    return (pt.y - sp.y) / (sp.x + this._width - pt.x) < oy / ox;
                }
            }
            return false;
        }

        distance(pt: Point): number {
            if (this.contains(pt)) {
                return 0;
            }

            var sp = this._startPoint,
                w = this._width,
                h = this._height,
                ox = this._offsetX,
                oy = this._offsetY;

            if (pt.y < sp.y) {
                if (pt.x < sp.x) {
                    return Math.sqrt(Math.pow(sp.x - pt.x, 2) + Math.pow(sp.y - pt.y, 2));
                } else if (pt.x > sp.x + w) {
                    return Math.sqrt(Math.pow(pt.x - sp.x - w, 2) + Math.pow(sp.y - pt.y, 2));
                } else {
                    return sp.y - pt.y;
                }
            } else if (pt.y > sp.y + h) {
                if (pt.x < sp.x) {
                    return Math.sqrt(Math.pow(sp.x - pt.x, 2) + Math.pow(pt.y - sp.y - h, 2));
                } else if (pt.x > sp.x + w) {
                    return Math.sqrt(Math.pow(pt.x - sp.x - w, 2) + Math.pow(pt.y - sp.y - h, 2));
                } else {
                    return pt.y - sp.y - h;
                }
            } else if (pt.y > sp.y + oy) {
                if (pt.x < sp.x + ox) {
                    return sp.x + ox - pt.x;
                } else if (pt.x > sp.x + w - ox) {
                    return pt.x - sp.x - w + ox;
                }
            } else {
                if (pt.x < sp.x + ox) {
                    return Math.min(Math.sqrt(Math.pow(sp.x - pt.x, 2) + Math.pow(pt.y - sp.y, 2)),
                        Math.sqrt(Math.pow(pt.x + ox / 2 - sp.x, 2) + Math.pow(pt.y + oy / 2 - sp.y, 2)),
                        Math.sqrt(Math.pow(pt.x + ox - sp.x, 2) + Math.pow(pt.y + oy - sp.y, 2)));
                } else {
                    return Math.min(Math.sqrt(Math.pow(pt.x - sp.x, 2) + Math.pow(pt.y - sp.y, 2)),
                        Math.sqrt(Math.pow(pt.x + w - ox / 2 - sp.x, 2) + Math.pow(pt.y + oy / 2 - sp.y, 2)),
                        Math.sqrt(Math.pow(pt.x + w - ox - sp.x, 2) + Math.pow(pt.y + oy - sp.y, 2)));
                }
            }

            return undefined;
        }

        get center(): Point {
            return this._center;
        }

        tag: any;
    }
}