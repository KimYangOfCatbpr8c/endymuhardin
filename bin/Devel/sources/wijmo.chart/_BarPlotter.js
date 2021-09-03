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
         * Bar/column chart plotter.
         */
        var _BarPlotter = (function (_super) {
            __extends(_BarPlotter, _super);
            function _BarPlotter() {
                _super.apply(this, arguments);
                this.origin = 0;
                this.width = 0.7;
                //isColumn = false;
                this.isVolume = false;
                this._volHelper = null;
                this.stackPosMap = {}; //{ [key: number]: number } = {};
                this.stackNegMap = {}; // { [key: number]: number } = {};
                this.stacking = chart.Stacking.None;
            }
            _BarPlotter.prototype.clear = function () {
                _super.prototype.clear.call(this);
                this.stackNegMap[this.chart.axisY._uniqueId] = {};
                this.stackPosMap[this.chart.axisY._uniqueId] = {};
                this._volHelper = null;
            };
            _BarPlotter.prototype.load = function () {
                _super.prototype.load.call(this);
                if (!this.isVolume) {
                    return;
                }
                var series, ax, ct, vols, dt, i, xvals, itemsSource, xmin = null, xmax = null;
                // loop through series collection
                for (i = 0; i < this.chart.series.length; i++) {
                    series = this.chart.series[i];
                    dt = series.getDataType(1) || series.chart._xDataType;
                    ax = series._getAxisX();
                    // get volume data based on chart type
                    ct = series._getChartType();
                    ct = ct === null || wijmo.isUndefined(ct) ? this.chart._getChartType() : ct;
                    if (ct === chart.ChartType.Column) {
                        vols = series._getBindingValues(1);
                    }
                    else if (ct === chart.ChartType.Candlestick) {
                        vols = series._getBindingValues(4);
                    }
                    else {
                        vols = null;
                    }
                    // get x values directly for dates, otherwise get from dataInfo
                    if (dt === wijmo.DataType.Date) {
                        var date;
                        xvals = [];
                        itemsSource = [];
                        for (i = 0; i < series._getLength(); i++) {
                            date = series._getItem(i)[series.bindingX].valueOf();
                            xvals.push(date);
                            itemsSource.push({
                                value: date,
                                text: wijmo.Globalize.format(new Date(date), ax.format || "d")
                            });
                        }
                    }
                    else {
                        xvals = this.dataInfo.getXVals();
                    }
                    xmin = this.dataInfo.getMinX();
                    xmax = this.dataInfo.getMaxX();
                    if (vols && vols.length > 0) {
                        this._volHelper = new chart._VolumeHelper(vols, xvals, xmin, xmax, dt);
                        ax._customConvert = this._volHelper.convert.bind(this._volHelper);
                        ax._customConvertBack = this._volHelper.convertBack.bind(this._volHelper);
                        if (itemsSource && itemsSource.length > 0) {
                            this._itemsSource = ax.itemsSource = itemsSource;
                        }
                        break; // only one set of volume data is supported per chart
                    }
                }
            };
            _BarPlotter.prototype.unload = function () {
                _super.prototype.unload.call(this);
                var series, ax;
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
            };
            _BarPlotter.prototype.adjustLimits = function (dataInfo, plotRect) {
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
                if (this.isVolume && (this.chart._getChartType() === chart.ChartType.Column || this.chart._getChartType() === chart.ChartType.Candlestick)) {
                    this.load();
                }
                else {
                    this.unload();
                }
                if (this.rotated) {
                    if (!this.chart.axisY.logBase) {
                        if (this.origin > ymax) {
                            ymax = this.origin;
                        }
                        else if (this.origin < ymin) {
                            ymin = this.origin;
                        }
                    }
                    return new wijmo.Rect(ymin, xmin - 0.5 * dx, ymax - ymin, xmax - xmin + dx);
                }
                else {
                    if (!this.chart.axisY.logBase) {
                        if (this.origin > ymax) {
                            ymax = this.origin;
                        }
                        else if (this.origin < ymin) {
                            ymin = this.origin;
                        }
                    }
                    return new wijmo.Rect(xmin - 0.5 * dx, ymin, xmax - xmin + dx, ymax - ymin);
                }
            };
            _BarPlotter.prototype.plotSeries = function (engine, ax, ay, series, palette, iser, nser) {
                var si = this.chart.series.indexOf(series);
                var ser = wijmo.asType(series, chart.SeriesBase);
                var options = this.chart.options;
                var cw = this.width;
                var wpx = 0;
                iser = iser || 0;
                nser = nser || 1;
                if (options && options.groupWidth) {
                    var gw = options.groupWidth;
                    if (wijmo.isNumber(gw)) {
                        // px
                        var gwn = wijmo.asNumber(gw);
                        if (isFinite(gwn) && gwn > 0) {
                            wpx = gwn;
                            cw = 1;
                        }
                    }
                    else if (wijmo.isString(gw)) {
                        var gws = wijmo.asString(gw);
                        // %
                        if (gws && gws.indexOf('%') >= 0) {
                            gws = gws.replace('%', '');
                            var gwn = parseFloat(gws);
                            if (isFinite(gwn)) {
                                if (gwn < 0) {
                                    gwn = 0;
                                }
                                else if (gwn > 100) {
                                    gwn = 100;
                                }
                                wpx = 0;
                                cw = gwn / 100;
                            }
                        }
                        else {
                            // px
                            var gwn = parseFloat(gws);
                            if (isFinite(gwn) && gwn > 0) {
                                wpx = gwn;
                                cw = 1;
                            }
                        }
                    }
                }
                var w = cw / nser; // this.seriesCount;
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
                var fill = ser._getSymbolFill(si), altFill = ser._getAltSymbolFill(si) || fill, stroke = ser._getSymbolStroke(si), altStroke = ser._getAltSymbolStroke(si) || stroke;
                var len = yvals.length;
                if (xvals != null) {
                    len = Math.min(len, xvals.length);
                }
                var origin = this.origin;
                //var symClass = FlexChart._CSS_SERIES_ITEM;
                var itemIndex = 0, currentFill, currentStroke;
                var stacked = this.stacking != chart.Stacking.None;
                var stacked100 = this.stacking == chart.Stacking.Stacked100pc;
                if (ser._getChartType() !== undefined) {
                    stacked = stacked100 = false;
                }
                if (!this.rotated) {
                    if (origin < ay.actualMin) {
                        origin = ay.actualMin;
                    }
                    else if (origin > ay.actualMax) {
                        origin = ay.actualMax;
                    }
                    var originScreen = ay.convert(origin), xmin = ax.actualMin, xmax = ax.actualMax;
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
                        if (chart._DataInfo.isValid(datax) && chart._DataInfo.isValid(datay)) {
                            if (stacked) {
                                var x0 = datax - 0.5 * cw, x1 = datax + 0.5 * cw;
                                if ((x0 < xmin && x1 < xmin) || (x0 > xmax && x1 > xmax)) {
                                    continue;
                                }
                                x0 = ax.convert(x0);
                                x1 = ax.convert(x1);
                                if (!chart._DataInfo.isValid(x0) || !chart._DataInfo.isValid(x1)) {
                                    continue;
                                }
                                var y0, y1;
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
                                }
                                else {
                                    sum = isNaN(stackNeg[datax]) ? 0 : stackNeg[datax];
                                    y0 = ay.convert(sum);
                                    y1 = ay.convert(sum + datay);
                                    stackNeg[datax] = sum + datay;
                                }
                                var rect = new wijmo.Rect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0));
                                if (wpx > 0) {
                                    var ratio = 1 - wpx / rect.width;
                                    if (ratio < 0) {
                                        ratio = 0;
                                    }
                                    var xc = rect.left + 0.5 * rect.width;
                                    rect.left += (xc - rect.left) * ratio;
                                    rect.width = Math.min(wpx, rect.width);
                                }
                                var area = new chart._RectArea(rect);
                                //engine.drawRect(rect.left, rect.top, rect.width, rect.height, null, series.symbolStyle);
                                this.drawSymbol(engine, rect, series, i, new wijmo.Point(rect.left + 0.5 * rect.width, y1));
                                series._setPointIndex(i, itemIndex);
                                itemIndex++;
                                area.tag = new chart._DataPoint(si, i, datax, sum + datay);
                                this.hitTester.add(area, si);
                            }
                            else {
                                var x0 = datax - 0.5 * cw + iser * w, x1 = datax - 0.5 * cw + (iser + 1) * w;
                                if ((x0 < xmin && x1 < xmin) || (x0 > xmax && x1 > xmax)) {
                                    continue;
                                }
                                x0 = ax.convert(x0);
                                x1 = ax.convert(x1);
                                if (!chart._DataInfo.isValid(x0) || !chart._DataInfo.isValid(x1)) {
                                    continue;
                                }
                                var y = ay.convert(datay), rect = new wijmo.Rect(Math.min(x0, x1), Math.min(y, originScreen), Math.abs(x1 - x0), Math.abs(originScreen - y));
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
                                var area = new chart._RectArea(rect);
                                //engine.drawRect(rect.left, rect.top, rect.width, rect.height, null, series.symbolStyle);
                                this.drawSymbol(engine, rect, series, i, new wijmo.Point(rect.left + 0.5 * rect.width, y));
                                series._setPointIndex(i, itemIndex);
                                itemIndex++;
                                area.tag = new chart._DataPoint(si, i, datax, datay);
                                this.hitTester.add(area, si);
                            }
                        }
                    }
                }
                else {
                    if (origin < ax.actualMin) {
                        origin = ax.actualMin;
                    }
                    else if (origin > ax.actualMax) {
                        origin = ax.actualMax;
                    }
                    if (ser._isCustomAxisY()) {
                        stacked = stacked100 = false;
                    }
                    var originScreen = ax.convert(origin), ymin = ay.actualMin, ymax = ay.actualMax;
                    for (var i = 0; i < len; i++) {
                        var datax = xvals ? xvals[i] : i, datay = yvals[i];
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
                        if (chart._DataInfo.isValid(datax) && chart._DataInfo.isValid(datay)) {
                            if (stacked) {
                                var y0 = datax - 0.5 * cw, y1 = datax + 0.5 * cw;
                                if ((y0 < ymin && y1 < ymin) || (y0 > ymax && y1 > ymax)) {
                                    continue;
                                }
                                y0 = ay.convert(y0);
                                y1 = ay.convert(y1);
                                var x0, x1;
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
                                }
                                else {
                                    sum = isNaN(stackNeg[datax]) ? 0 : stackNeg[datax];
                                    x0 = ax.convert(sum);
                                    x1 = ax.convert(sum + datay);
                                    stackNeg[datax] = sum + datay;
                                }
                                var rect = new wijmo.Rect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0));
                                if (wpx > 0) {
                                    var ratio = 1 - wpx / rect.height;
                                    if (ratio < 0) {
                                        ratio = 0;
                                    }
                                    var yc = rect.top + 0.5 * rect.height;
                                    rect.top += (yc - rect.top) * ratio;
                                    rect.height = Math.min(wpx, rect.height);
                                }
                                var area = new chart._RectArea(rect);
                                //engine.drawRect(rect.left, rect.top, rect.width, rect.height, null, series.symbolStyle);
                                this.drawSymbol(engine, rect, series, i, new wijmo.Point(x1, rect.top + 0.5 * rect.height));
                                series._setPointIndex(i, itemIndex);
                                itemIndex++;
                                area.tag = new chart._DataPoint(si, i, sum + datay, datax);
                                this.hitTester.add(area, si);
                            }
                            else {
                                var y0 = datax - 0.5 * cw + iser * w, y1 = datax - 0.5 * cw + (iser + 1) * w;
                                if ((y0 < ymin && y1 < ymin) || (y0 > ymax && y1 > ymax)) {
                                    continue;
                                }
                                y0 = ay.convert(y0);
                                y1 = ay.convert(y1);
                                var x = ax.convert(datay), rect = new wijmo.Rect(Math.min(x, originScreen), Math.min(y0, y1), Math.abs(originScreen - x), Math.abs(y1 - y0));
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
                                var area = new chart._RectArea(rect);
                                //engine.drawRect(rect.left, rect.top, rect.width, rect.height, null, series.symbolStyle);
                                this.drawSymbol(engine, rect, series, i, new wijmo.Point(x, rect.top + 0.5 * rect.height));
                                series._setPointIndex(i, itemIndex);
                                itemIndex++;
                                area.tag = new chart._DataPoint(si, i, datay, datax);
                                this.hitTester.add(area, si);
                            }
                        }
                    }
                }
            };
            _BarPlotter.prototype.drawSymbol = function (engine, rect, series, pointIndex, point) {
                var _this = this;
                if (this.chart.itemFormatter) {
                    engine.startGroup();
                    var hti = new chart.HitTestInfo(this.chart, point, chart.ChartElement.SeriesSymbol);
                    hti._setData(series, pointIndex);
                    this.chart.itemFormatter(engine, hti, function () {
                        _this.drawDefaultSymbol(engine, rect, series);
                    });
                    engine.endGroup();
                }
                else {
                    this.drawDefaultSymbol(engine, rect, series);
                }
            };
            _BarPlotter.prototype.drawDefaultSymbol = function (engine, rect, series) {
                engine.drawRect(rect.left, rect.top, rect.width, rect.height, null, series.symbolStyle /* ,'plotRect'*/);
            };
            return _BarPlotter;
        }(chart._BasePlotter));
        chart._BarPlotter = _BarPlotter;
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_BarPlotter.js.map