module wijmo.chart {
    'use strict';

    /**
     * Bar/column chart plotter.
     */
    export class _BarPlotter extends _BasePlotter implements _IPlotter {
        origin = 0;
        width = 0.7;
        //isColumn = false;
        isVolume = false;
        private _volHelper: _VolumeHelper = null;
        private _itemsSource: any[];

        stackPosMap = {}; //{ [key: number]: number } = {};
        stackNegMap = {};// { [key: number]: number } = {};

        stacking = Stacking.None;
        rotated: boolean;

        _getSymbolOrigin: Function;
        _getSymbolStyles: Function;

        clear() {
            super.clear();

            this.stackNegMap[this.chart.axisY._uniqueId] = {};
            this.stackPosMap[this.chart.axisY._uniqueId] = {};
            this._volHelper = null;
        }

        load(): void {
            super.load();
            if (!this.isVolume) { return; }

            var series: SeriesBase,
                ax: Axis, ct: ChartType,
                vols: number[],
                dt: DataType, i: number,
                xvals: number[],
                itemsSource: any[],
                xmin: number = null,
                xmax: number = null;

            // loop through series collection
            for (i = 0; i < this.chart.series.length; i++) {
                series = this.chart.series[i];
                dt = series.getDataType(1) || series.chart._xDataType;
                ax = series._getAxisX();

                // get volume data based on chart type
                ct = series._getChartType();
                ct = ct === null || isUndefined(ct) ? this.chart._getChartType() : ct;
                if (ct === ChartType.Column) {
                    vols = series._getBindingValues(1);
                } else if (ct === ChartType.Candlestick) {
                    vols = series._getBindingValues(4);
                } else {
                    vols = null;
                }

                // get x values directly for dates, otherwise get from dataInfo
                if (dt === DataType.Date) {
                    var date;
                    xvals = [];
                    itemsSource = [];
                    for (i = 0; i < series._getLength(); i++) {
                        date = series._getItem(i)[series.bindingX].valueOf();
                        xvals.push(date);
                        itemsSource.push({
                            value: date,
                            text: Globalize.format(new Date(date), ax.format || "d")
                        });
                    }
                } else {
                    xvals = this.dataInfo.getXVals();
                }

                xmin = this.dataInfo.getMinX();
                xmax = this.dataInfo.getMaxX();

                if (vols && vols.length > 0) {
                    this._volHelper = new _VolumeHelper(vols, xvals, xmin, xmax, dt);
                    ax._customConvert = this._volHelper.convert.bind(this._volHelper);
                    ax._customConvertBack = this._volHelper.convertBack.bind(this._volHelper);

                    if (itemsSource && itemsSource.length > 0) {
                        this._itemsSource = ax.itemsSource = itemsSource;
                    }
                    break;  // only one set of volume data is supported per chart
                }
            }
        }

        unload(): void {
            super.unload();
            var series: SeriesBase,
                ax: Axis;

            for (var i = 0; i < this.chart.series.length; i++) {
                series = this.chart.series[i];
                ax = series._getAxisX();
                if (ax) {
                    ax._customConvert = null;
                    ax._customConvertBack = null;
                    if (ax.itemsSource && ax.itemsSource == this._itemsSource) {
                        this._itemsSource = ax.itemsSource = null;
                    }
                }
            }
        }

        adjustLimits(dataInfo: _DataInfo, plotRect: Rect): Rect {
            this.dataInfo = dataInfo;

            var xmin = dataInfo.getMinX();
            var ymin = dataInfo.getMinY();
            var xmax = dataInfo.getMaxX();
            var ymax = dataInfo.getMaxY();

            var dx = dataInfo.getDeltaX();
            if (dx <= 0) {
                dx = 1;
            }

            // init/cleanup volume conversions for x-axis based on ChartType/FinancialChartType mappings
            if (this.isVolume && (this.chart._getChartType() === ChartType.Column || this.chart._getChartType() === ChartType.Candlestick)) {
                this.load();
            } else {
                this.unload();
            }

            if (this.rotated) {
                if (!this.chart.axisY.logBase) {
                    if (this.origin > ymax) {
                        ymax = this.origin;
                    } else if (this.origin < ymin) {
                        ymin = this.origin;
                    }
                }
                return new Rect(ymin, xmin - 0.5 * dx, ymax - ymin, xmax - xmin + dx);
            } else {
                if (!this.chart.axisY.logBase) {
                    if (this.origin > ymax) {
                        ymax = this.origin;
                    } else if (this.origin < ymin) {
                        ymin = this.origin;
                    }
                }
                return new Rect(xmin - 0.5 * dx, ymin, xmax - xmin + dx, ymax - ymin);
            }
        }

        plotSeries(engine: IRenderEngine, ax: _IAxis, ay: _IAxis, series: _ISeries, palette: _IPalette, iser: number, nser: number) {
            var si = this.chart.series.indexOf(series);
            var ser: SeriesBase = asType(series, SeriesBase);
            var options = this.chart.options;
            var cw = this.width;
            var wpx = 0;
            iser = iser || 0;
            nser = nser || 1;

            if (options && options.groupWidth) {
                var gw = options.groupWidth;
                if (isNumber(gw)) {
                    // px
                    var gwn = asNumber(gw);
                    if (isFinite(gwn) && gwn > 0) {
                        wpx = gwn; cw = 1;
                    }
                } else if (isString(gw)) {
                    var gws = asString(gw);

                    // %
                    if (gws && gws.indexOf('%') >= 0) {
                        gws = gws.replace('%', '');
                        var gwn = parseFloat(gws);
                        if (isFinite(gwn)) {
                            if (gwn < 0) {
                                gwn = 0;
                            } else if (gwn > 100) {
                                gwn = 100;
                            }
                            wpx = 0; cw = gwn / 100;
                        }
                    } else {
                        // px
                        var gwn = parseFloat(gws);
                        if (isFinite(gwn) && gwn > 0) {
                            wpx = gwn; cw = 1;
                        }
                    }
                }
            }

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

            var stacked = this.stacking != Stacking.None;
            var stacked100 = this.stacking == Stacking.Stacked100pc;
            if (ser._getChartType() !== undefined) {
                stacked = stacked100 = false;
            }

            if (!this.rotated) {
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

                            var sum = 0;
                            if (datay > 0) {
                                sum = isNaN(stackPos[datax]) ? 0 : stackPos[datax];
                                y0 = ay.convert(sum);
                                y1 = ay.convert(sum + datay);
                                stackPos[datax] = sum + datay;
                            } else {
                                sum = isNaN(stackNeg[datax]) ? 0 : stackNeg[datax];
                                y0 = ay.convert(sum);
                                y1 = ay.convert(sum + datay);
                                stackNeg[datax] = sum + datay;
                            }

                            var rect = new Rect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0));
                            if (wpx > 0) {
                                var ratio = 1 - wpx / rect.width;
                                if (ratio < 0) {
                                    ratio = 0;
                                }
                                var xc = rect.left + 0.5 * rect.width;
                                rect.left += (xc - rect.left) * ratio;
                                rect.width = Math.min(wpx, rect.width);
                            }

                            var area = new _RectArea(rect);

                            //engine.drawRect(rect.left, rect.top, rect.width, rect.height, null, series.symbolStyle);
                            this.drawSymbol(engine, rect, series, i, new Point(rect.left + 0.5 * rect.width, y1));
                            series._setPointIndex(i, itemIndex);
                            itemIndex++;

                            area.tag = new _DataPoint(si, i, datax, sum + datay);
                            this.hitTester.add(area, si);
                        } else {
                            var x0 = datax - 0.5 * cw + iser * w,
                                x1 = datax - 0.5 * cw + (iser + 1) * w;

                            if ((x0 < xmin && x1 < xmin) || (x0 > xmax && x1 > xmax)) {
                                continue;
                            }
                            x0 = ax.convert(x0);
                            x1 = ax.convert(x1);

                            if (!_DataInfo.isValid(x0) || !_DataInfo.isValid(x1)) {
                                continue;
                            } 

                            var y = ay.convert(datay),
                                rect = new Rect(Math.min(x0, x1), Math.min(y, originScreen), Math.abs(x1 - x0), Math.abs(originScreen - y));

                            if (wpx > 0) {
                                var sw = wpx / nser;
                                var ratio = 1 - sw / rect.width;
                                if (ratio < 0) {
                                    ratio = 0;
                                }
                                var xc = ax.convert(datax);
                                rect.left += (xc - rect.left) * ratio;
                                rect.width = Math.min(sw, rect.width);
                            }

                            var area = new _RectArea(rect);

                            //engine.drawRect(rect.left, rect.top, rect.width, rect.height, null, series.symbolStyle);
                            this.drawSymbol(engine, rect, series, i, new Point(rect.left + 0.5 * rect.width, y));
                            series._setPointIndex(i, itemIndex);
                            itemIndex++;

                            area.tag = new _DataPoint(si, i, datax, datay);
                            this.hitTester.add(area, si);
                        }
                    }
                }
            } else {
                if (origin < ax.actualMin) {
                    origin = ax.actualMin;
                } else if (origin > ax.actualMax) {
                    origin = ax.actualMax;
                }

                if (ser._isCustomAxisY()) {
                    stacked = stacked100 = false;
                }

                var originScreen = ax.convert(origin),
                    ymin = ay.actualMin,
                    ymax = ay.actualMax;

                for (var i = 0; i < len; i++) {
                    var datax = xvals ? xvals[i] : i,
                        datay = yvals[i];

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
                    currentFill = datay > 0 ? fill : altFill;
                    currentStroke = datay > 0 ? stroke : altStroke;
                    engine.fill = currentFill;
                    engine.stroke = currentStroke;

                    if (_DataInfo.isValid(datax) && _DataInfo.isValid(datay)) {
                        if (stacked) {
                            var y0 = datax - 0.5 * cw,
                                y1 = datax + 0.5 * cw;
                            if ((y0 < ymin && y1 < ymin) || (y0 > ymax && y1 > ymax)) {
                                continue;
                            }
                            y0 = ay.convert(y0);
                            y1 = ay.convert(y1);

                            var x0: number, x1: number;

                            if (stacked100) {
                                var sumabs = this.dataInfo.getStackedAbsSum(datax);
                                datay = datay / sumabs;
                            }

                            var sum = 0;
                            if (datay > 0) {
                                sum = isNaN(stackPos[datax]) ? 0 : stackPos[datax];
                                x0 = ax.convert(sum);
                                x1 = ax.convert(sum + datay);
                                stackPos[datax] = sum + datay;
                            } else {
                                sum = isNaN(stackNeg[datax]) ? 0 : stackNeg[datax];
                                x0 = ax.convert(sum);
                                x1 = ax.convert(sum + datay);
                                stackNeg[datax] = sum + datay;
                            }

                            var rect = new Rect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0));
                            if (wpx > 0) {
                                var ratio = 1 - wpx / rect.height;
                                if (ratio < 0) {
                                    ratio = 0;
                                }
                                var yc = rect.top + 0.5 * rect.height;
                                rect.top += (yc - rect.top) * ratio;
                                rect.height = Math.min(wpx, rect.height);
                            }

                            var area = new _RectArea(rect);
                            //engine.drawRect(rect.left, rect.top, rect.width, rect.height, null, series.symbolStyle);
                            this.drawSymbol(engine, rect, series, i, new Point(x1, rect.top + 0.5 * rect.height));
                            series._setPointIndex(i, itemIndex);
                            itemIndex++;

                            area.tag = new _DataPoint(si, i, sum + datay, datax);
                            this.hitTester.add(area, si);
                        }
                        else {
                            var y0 = datax - 0.5 * cw + iser * w,
                                y1 = datax - 0.5 * cw + (iser + 1) * w;

                            if ((y0 < ymin && y1 < ymin) || (y0 > ymax && y1 > ymax)) {
                                continue;
                            }
                            y0 = ay.convert(y0);
                            y1 = ay.convert(y1);

                            var x = ax.convert(datay),
                                rect = new Rect(Math.min(x, originScreen), Math.min(y0, y1), Math.abs(originScreen - x), Math.abs(y1 - y0));

                            if (wpx > 0) {
                                var sw = wpx / nser;
                                var ratio = 1 - sw / rect.height;
                                if (ratio < 0) {
                                    ratio = 0;
                                }
                                var yc = ay.convert(datax);
                                rect.top += (yc - rect.top) * ratio;
                                rect.height = Math.min(sw, rect.height);
                            }

                            var area = new _RectArea(rect);
                            //engine.drawRect(rect.left, rect.top, rect.width, rect.height, null, series.symbolStyle);
                            this.drawSymbol(engine, rect, series, i, new Point(x, rect.top + 0.5 * rect.height));
                            series._setPointIndex(i, itemIndex);
                            itemIndex++;

                            area.tag = new _DataPoint(si, i, datay, datax);
                            this.hitTester.add(area, si);
                        }
                    }
                }
            }
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
}