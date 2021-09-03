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
         * Specifies whether and how to stack the chart's data values.
         */
        (function (Stacking) {
            /** No stacking. Each series object is plotted independently. */
            Stacking[Stacking["None"] = 0] = "None";
            /** Stacked charts show how each value contributes to the total. */
            Stacking[Stacking["Stacked"] = 1] = "Stacked";
            /** 100% stacked charts show how each value contributes to the total with the relative size of
             * each series representing its contribution to the total. */
            Stacking[Stacking["Stacked100pc"] = 2] = "Stacked100pc";
        })(chart.Stacking || (chart.Stacking = {}));
        var Stacking = chart.Stacking;
        /**
         * Specifies what is selected when the user clicks the chart.
         */
        (function (SelectionMode) {
            /** Select neither series nor data points when the user clicks the chart. */
            SelectionMode[SelectionMode["None"] = 0] = "None";
            /** Select the whole @see:Series when the user clicks it on the chart. */
            SelectionMode[SelectionMode["Series"] = 1] = "Series";
            /** Select the data point when the user clicks it on the chart. Since Line, Area, Spline,
             * and SplineArea charts do not render individual data points, nothing is selected with this
             * setting on those chart types. */
            SelectionMode[SelectionMode["Point"] = 2] = "Point";
        })(chart.SelectionMode || (chart.SelectionMode = {}));
        var SelectionMode = chart.SelectionMode;
        ;
        /**
         * The core charting control for @see:FlexChart.
         *
         */
        var FlexChartCore = (function (_super) {
            __extends(FlexChartCore, _super);
            /**
             * Initializes a new instance of the @see:FlexChart class.
             *
             * @param element The DOM element that will host the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options A JavaScript object containing initialization data for the control.
             */
            function FlexChartCore(element, options) {
                _super.call(this, element, null, true); // invalidate on resize
                // property storage
                this._series = new wijmo.collections.ObservableArray();
                this._axes = new chart.AxisCollection();
                this._pareas = new chart.PlotAreaCollection();
                this._interpolateNulls = false;
                this._legendToggle = false;
                this._symbolSize = 10;
                this._dataInfo = new _DataInfo();
                this.__barPlotter = null;
                this.__linePlotter = null;
                this.__areaPlotter = null;
                this.__bubblePlotter = null;
                this.__financePlotter = null;
                this.__funnelPlotter = null;
                this._plotters = [];
                this._rotated = false;
                this._stacking = Stacking.None;
                this._xlabels = [];
                this._xvals = [];
                this._lblAreas = [];
                /**
                 * Occurs when the series visibility changes, for example when the legendToggle
                 * property is set to true and the user clicks the legend.
                */
                this.seriesVisibilityChanged = new wijmo.Event();
                // add classes to host element
                this.applyTemplate('wj-control wj-flexchart', null, null);
                // handle changes to chartSeries array
                var self = this;
                self._series.collectionChanged.addHandler(function () {
                    // check that chartSeries array contains Series objects
                    var arr = self._series;
                    for (var i = 0; i < arr.length; i++) {
                        var cs = wijmo.tryCast(arr[i], wijmo.chart.SeriesBase);
                        if (!cs) {
                            throw 'chartSeries array must contain SeriesBase objects.';
                        }
                        cs._chart = self;
                        if (cs.axisX) {
                            cs.axisX._chart = self;
                        }
                        if (cs.axisY) {
                            cs.axisY._chart = self;
                        }
                    }
                    // refresh chart to show the change
                    self.refresh();
                });
                this._currentRenderEngine = new chart._SvgRenderEngine(this.hostElement);
                this._hitTester = new chart._HitTester(this);
                this._legend = new chart.Legend(this);
                this._tooltip = new ChartTooltip();
                this._tooltip.showDelay = 0;
                this._lbl = new chart.DataLabel();
                this._lbl._chart = this;
                this._initAxes();
                self._axes.collectionChanged.addHandler(function () {
                    var arr = self._axes;
                    for (var i = 0; i < arr.length; i++) {
                        var axis = wijmo.tryCast(arr[i], wijmo.chart.Axis);
                        if (!axis) {
                            throw 'axes array must contain Axis objects.';
                        }
                        axis._chart = self;
                    }
                    // refresh chart to show the change
                    self.refresh();
                });
                self._pareas.collectionChanged.addHandler(function () {
                    var arr = self._pareas;
                    for (var i = 0; i < arr.length; i++) {
                        var pa = wijmo.tryCast(arr[i], wijmo.chart.PlotArea);
                        if (!pa) {
                            throw 'plotAreas array must contain PlotArea objects.';
                        }
                        pa._chart = self;
                    }
                    // refresh chart to show the change
                    self.refresh();
                });
                this._keywords = new chart._KeyWords();
                //if (isTouchDevice()) {
                this.hostElement.addEventListener('click', function (evt) {
                    var tip = self._tooltip;
                    var tc = tip.content;
                    if (tc && self.isTouching) {
                        var ht = self.hitTest(evt);
                        if (ht.distance <= tip.threshold) {
                            var content = self._getLabelContent(ht, self._tooltip.content);
                            self._showToolTip(content, new wijmo.Rect(evt.clientX, evt.clientY, 5, 5));
                        }
                        else {
                            self._hideToolTip();
                        }
                    }
                });
                //} else {
                this.hostElement.addEventListener('mousemove', function (evt) {
                    var tip = self._tooltip;
                    var tc = tip.content;
                    if (tc && !self.isTouching) {
                        var ht = self.hitTest(evt);
                        if (ht.distance <= tip.threshold) {
                            var content = self._getLabelContent(ht, self._tooltip.content);
                            self._showToolTip(content, new wijmo.Rect(evt.clientX, evt.clientY, 5, 5));
                        }
                        else {
                            self._hideToolTip();
                        }
                    }
                });
                //}
                this.hostElement.addEventListener('mouseleave', function (evt) {
                    self._hideToolTip();
                });
                this.hostElement.addEventListener('click', function (evt) {
                    if (self.selectionMode != SelectionMode.None) {
                        var ht = self._hitTestData(evt);
                        var thershold = chart.FlexChart._SELECTION_THRESHOLD;
                        if (self.tooltip && self.tooltip.threshold)
                            thershold = self.tooltip.threshold;
                        if (ht.distance <= thershold && ht.series) {
                            self._select(ht.series, ht.pointIndex);
                        }
                        else {
                            if (self.selectionMode == SelectionMode.Series) {
                                ht = self.hitTest(evt);
                                if (ht.chartElement == chart.ChartElement.Legend && ht.series) {
                                    self._select(ht.series, null);
                                }
                                else {
                                    self._select(null, null);
                                }
                            }
                            else {
                                self._select(null, null);
                            }
                        }
                    }
                    if (self.legendToggle === true) {
                        ht = self.hitTest(evt);
                        if (ht.chartElement == chart.ChartElement.Legend && ht.series) {
                            if (ht.series.visibility == chart.SeriesVisibility.Legend) {
                                ht.series.visibility = chart.SeriesVisibility.Visible;
                            }
                            else if (ht.series.visibility == chart.SeriesVisibility.Visible) {
                                ht.series.visibility = chart.SeriesVisibility.Legend;
                            }
                            self.focus();
                        }
                    }
                });
                // apply options only after chart is fully initialized
                this.initialize(options);
            }
            FlexChartCore.prototype._initAxes = function () {
                this._axisX = new chart.Axis(chart.Position.Bottom);
                this._axisY = new chart.Axis(chart.Position.Left);
                // default style
                this._axisX.majorGrid = false;
                this._axisX.name = 'axisX';
                this._axisY.majorGrid = true;
                this._axisY.majorTickMarks = chart.TickMark.None;
                this._axisY.name = 'axisY';
                this._axisX._chart = this;
                this._axisY._chart = this;
                this._axes.push(this._axisX);
                this._axes.push(this._axisY);
            };
            Object.defineProperty(FlexChartCore.prototype, "series", {
                //--------------------------------------------------------------------------
                // ** object model
                /**
                 * Gets the collection of @see:Series objects.
                 */
                get: function () {
                    return this._series;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexChartCore.prototype, "axes", {
                /**
                 * Gets the collection of @see:Axis objects.
                 */
                get: function () {
                    return this._axes;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexChartCore.prototype, "axisX", {
                /**
                 * Gets or sets the main X axis.
                 */
                get: function () {
                    return this._axisX;
                },
                set: function (value) {
                    if (value != this._axisX) {
                        var ax = this._axisX = wijmo.asType(value, chart.Axis);
                        // set default axis attributes
                        this.beginUpdate();
                        if (ax) {
                            if (ax.majorGrid === undefined) {
                                ax.majorGrid = false;
                            }
                            if (ax.name === undefined) {
                                ax.name = 'axisX';
                            }
                            if (ax.position === undefined) {
                                ax.position = chart.Position.Bottom;
                            }
                            ax._axisType = chart.AxisType.X;
                            ax._chart = this;
                        }
                        this.endUpdate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexChartCore.prototype, "axisY", {
                /**
                 * Gets or sets the main Y axis.
                 */
                get: function () {
                    return this._axisY;
                },
                set: function (value) {
                    if (value != this._axisY) {
                        var ay = this._axisY = wijmo.asType(value, chart.Axis);
                        // set default axis attributes
                        this.beginUpdate();
                        if (ay) {
                            if (ay.majorGrid === undefined) {
                                ay.majorGrid = true;
                            }
                            if (ay.name === undefined) {
                                ay.name = 'axisY';
                            }
                            ay.majorTickMarks = chart.TickMark.None;
                            if (ay.position === undefined) {
                                ay.position = chart.Position.Left;
                            }
                            ay._axisType = chart.AxisType.Y;
                            ay._chart = this;
                        }
                        this.endUpdate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexChartCore.prototype, "plotAreas", {
                /**
                 * Gets the collection of @see:PlotArea objects.
                 */
                get: function () {
                    return this._pareas;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexChartCore.prototype, "binding", {
                /**
                 * Gets or sets the name of the property that contains the Y values.
                 */
                get: function () {
                    return this._binding;
                },
                set: function (value) {
                    if (value != this._binding) {
                        this._binding = wijmo.asString(value, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexChartCore.prototype, "bindingX", {
                /**
                 * Gets or sets the name of the property that contains the X data values.
                 */
                get: function () {
                    return this._bindingX;
                },
                set: function (value) {
                    if (value != this._bindingX) {
                        this._bindingX = wijmo.asString(value, true);
                        this._bindChart();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexChartCore.prototype, "symbolSize", {
                /**
                 * Gets or sets the size of the symbols used for all Series objects in this @see:FlexChart.
                 *
                 * This property may be overridden by the symbolSize property on each @see:Series object.
                 */
                get: function () {
                    return this._symbolSize;
                },
                set: function (value) {
                    if (value != this._symbolSize) {
                        this._symbolSize = wijmo.asNumber(value, false, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexChartCore.prototype, "interpolateNulls", {
                /**
                 * Gets or sets a value that determines whether to interpolate
                 * null values in the data.
                 *
                 * If true, the chart interpolates the value of any missing data
                 * based on neighboring points. If false, it leaves a break in
                 * lines and areas at the points with null values.
                 */
                get: function () {
                    return this._interpolateNulls;
                },
                set: function (value) {
                    if (value != this._interpolateNulls) {
                        this._interpolateNulls = wijmo.asBoolean(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexChartCore.prototype, "legendToggle", {
                /**
                 * Gets or sets a value indicating whether clicking legend items toggles the
                 * series visibility in the chart.
                 */
                get: function () {
                    return this._legendToggle;
                },
                set: function (value) {
                    if (value != this._legendToggle) {
                        this._legendToggle = wijmo.asBoolean(value);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexChartCore.prototype, "tooltip", {
                /**
                 * Gets the chart @see:Tooltip object.
                 *
                 * The tooltip content is generated using a template that may contain any of the following
                 * parameters:
                 *
                 * <ul>
                 *  <li><b>propertyName</b>:    Any property of the data object represented by the point.</li>
                 *  <li><b>seriesName</b>:      Name of the series that contains the data point (FlexChart only).</li>
                 *  <li><b>pointIndex</b>:      Index of the data point.</li>
                 *  <li><b>value</b>:           <b>Value</b> of the data point (y-value for @see:FlexChart, item value for @see:FlexPie).</li>
                 *  <li><b>x</b>:               <b>x</b>-value of the data point (FlexChart only).</li>
                 *  <li><b>y</b>:               <b>y</b>-value of the data point (FlexChart only).</li>
                 *  <li><b>name</b>:            <b>Name</b> of the data point (x-value for @see:FlexChart or legend entry for @see:FlexPie).</li>
                 * </ul>
                 *
                 * To modify the template, assign a new value to the tooltip's content property.
                 * For example:
                 *
                 * <pre>
                 * chart.tooltip.content = '&lt;b&gt;{seriesName}&lt;/b&gt; ' +
                 *    '&lt;img src="resources/{x}.png"/&gt;&lt;br/&gt;{y}';
                 * </pre>
                 *
                 * You can disable chart tooltips by setting the template to an empty string.
                 *
                 * You can also use the @see:tooltip property to customize tooltip parameters
                 * such as @see:Tooltip.showDelay and @see:Tooltip.hideDelay:
                 *
                 * <pre>
                 * chart.tooltip.showDelay = 1000;
                 * </pre>
                 *
                 * See @see:ChartTooltip properties for more details and options.
                 */
                get: function () {
                    return this._tooltip;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexChartCore.prototype, "dataLabel", {
                /**
                 * Gets or sets the point data label.
                 */
                get: function () {
                    return this._lbl;
                },
                set: function (value) {
                    if (value != this._lbl) {
                        this._lbl = wijmo.asType(value, chart.DataLabel);
                        if (this._lbl) {
                            this._lbl._chart = this;
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexChartCore.prototype, "selection", {
                /**
                 * Gets or sets the selected chart series.
                 */
                get: function () {
                    return this._selection;
                },
                set: function (value) {
                    if (value != this._selection) {
                        this._selection = wijmo.asType(value, chart.SeriesBase, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the @see:seriesVisibilityChanged event.
             *
             * @param e The @see:SeriesEventArgs object that contains the event data.
             */
            FlexChartCore.prototype.onSeriesVisibilityChanged = function (e) {
                this.seriesVisibilityChanged.raise(this, e);
            };
            /**
             * Gets a @see:HitTestInfo object with information about the specified point.
             *
             * @param pt The point to investigate, in window coordinates.
             * @param y The Y coordinate of the point (if the first parameter is a number).
             * @return A HitTestInfo object with information about the point.
             */
            FlexChartCore.prototype.hitTest = function (pt, y) {
                // control coords
                var cpt = this._toControl(pt, y);
                var hti = new chart.HitTestInfo(this, cpt);
                var si = null;
                if (chart.FlexChart._contains(this._rectHeader, cpt)) {
                    hti._chartElement = chart.ChartElement.Header;
                }
                else if (chart.FlexChart._contains(this._rectFooter, cpt)) {
                    hti._chartElement = chart.ChartElement.Footer;
                }
                else if (chart.FlexChart._contains(this._rectLegend, cpt)) {
                    hti._chartElement = chart.ChartElement.Legend;
                    si = this.legend._hitTest(cpt);
                    if (si !== null && si >= 0 && si < this.series.length) {
                        hti._setData(this.series[si]);
                    }
                }
                else if (chart.FlexChart._contains(this._rectChart, cpt)) {
                    var lblArea = this._hitTestLabels(cpt);
                    if (lblArea) {
                        hti._chartElement = chart.ChartElement.DataLabel;
                        hti._dist = 0;
                        hti._setDataPoint(lblArea.tag);
                    }
                    else {
                        var hr = this._hitTester.hitTest(cpt);
                        // custom series hit test
                        var ht = null;
                        var htsi = null;
                        for (var i = this.series.length - 1; i >= 0; i--) {
                            if (this.series[i].hitTest !== chart.Series.prototype.hitTest) {
                                var hts = this.series[i].hitTest(pt);
                                if (hts) {
                                    if (!ht || hts.distance < ht.distance) {
                                        ht = hts;
                                        htsi = i;
                                    }
                                    if (hts.distance === 0) {
                                        break;
                                    }
                                }
                            }
                        }
                        if (hr && hr.area) {
                            if (ht && ht.distance < hr.distance) {
                                hti = ht;
                            }
                            else if (ht && ht.distance == hr.distance && htsi > hr.area.tag.seriesIndex) {
                                hti = ht;
                            }
                            else {
                                hti._setDataPoint(hr.area.tag);
                                hti._dist = hr.distance;
                            }
                        }
                        else if (ht) {
                            hti = ht;
                        }
                        if (chart.FlexChart._contains(this.axisX._axrect, cpt)) {
                            hti._chartElement = chart.ChartElement.AxisX;
                        }
                        else if (chart.FlexChart._contains(this.axisY._axrect, cpt)) {
                            hti._chartElement = chart.ChartElement.AxisY;
                        }
                        else if (chart.FlexChart._contains(this._plotRect, cpt)) {
                            hti._chartElement = chart.ChartElement.PlotArea;
                        }
                        else if (chart.FlexChart._contains(this._rectChart, cpt)) {
                            hti._chartElement = chart.ChartElement.ChartArea;
                        }
                    }
                }
                else {
                    hti._chartElement = chart.ChartElement.None;
                }
                return hti;
            };
            /**
             * Converts a @see:Point from control coordinates to chart data coordinates.
             *
             * @param pt The point to convert, in control coordinates.
             * @param y The Y coordinate of the point (if the first parameter is a number).
             * @return The point in chart data coordinates.
             */
            FlexChartCore.prototype.pointToData = function (pt, y) {
                if (wijmo.isNumber(pt) && wijmo.isNumber(y)) {
                    pt = new wijmo.Point(pt, y);
                }
                if (pt instanceof MouseEvent) {
                    pt = new wijmo.Point(pt.pageX, pt.pageY);
                    pt = this._toControl(pt);
                }
                else {
                    pt = pt.clone();
                }
                pt.x = this.axisX.convertBack(pt.x);
                pt.y = this.axisY.convertBack(pt.y);
                return pt;
            };
            /**
             * Converts a @see:Point from data coordinates to control coordinates.
             *
             * @param pt @see:Point in data coordinates, or X coordinate of a point in data coordinates.
             * @param y Y coordinate of the point (if the first parameter is a number).
             * @return The @see:Point in control coordinates.
             */
            FlexChartCore.prototype.dataToPoint = function (pt, y) {
                if (wijmo.isNumber(pt) && wijmo.isNumber(y)) {
                    pt = new wijmo.Point(pt, y);
                }
                wijmo.asType(pt, wijmo.Point);
                var cpt = pt.clone();
                cpt.x = this.axisX.convert(cpt.x);
                cpt.y = this.axisY.convert(cpt.y);
                return cpt;
            };
            //--------------------------------------------------------------------------
            // implementation
            // method used in JSON-style initialization
            FlexChartCore.prototype._copy = function (key, value) {
                if (key == 'series') {
                    var arr = wijmo.asArray(value);
                    for (var i = 0; i < arr.length; i++) {
                        var s = this._createSeries();
                        wijmo.copy(s, arr[i]);
                        this.series.push(s);
                    }
                    return true;
                }
                return false;
            };
            FlexChartCore.prototype._createSeries = function () {
                return new chart.Series();
            };
            FlexChartCore.prototype._clearCachedValues = function () {
                for (var i = 0; i < this._series.length; i++) {
                    var series = this._series[i];
                    if (series.itemsSource == null)
                        series._clearValues();
                }
            };
            FlexChartCore.prototype._performBind = function () {
                this._xDataType = null;
                this._xlabels.splice(0);
                this._xvals.splice(0);
                if (this._cv) {
                    var items = this._cv.items;
                    if (items) {
                        var len = items.length;
                        for (var i = 0; i < len; i++) {
                            var item = items[i];
                            if (this._bindingX) {
                                var x = item[this._bindingX];
                                if (wijmo.isNumber(x)) {
                                    this._xvals.push(wijmo.asNumber(x));
                                    this._xDataType = wijmo.DataType.Number;
                                }
                                else if (wijmo.isDate(x)) {
                                    this._xvals.push(wijmo.asDate(x).valueOf());
                                    this._xDataType = wijmo.DataType.Date;
                                }
                                this._xlabels.push(item[this._bindingX]);
                            }
                        }
                        if (this._xvals.length == len) {
                            this._xlabels.splice(0);
                        }
                        else {
                            this._xvals.splice(0);
                        }
                    }
                }
            };
            FlexChartCore.prototype._hitTestSeries = function (pt, seriesIndex) {
                // control coords
                //var cpt = pt.clone();
                //var host = this.hostElement;
                //cpt.x -= host.offsetLeft;
                //cpt.y -= host.offsetTop;
                var cpt = this._toControl(pt);
                var hti = new chart.HitTestInfo(this, cpt);
                var si = seriesIndex;
                var hr = this._hitTester.hitTestSeries(cpt, seriesIndex);
                if (hr && hr.area) {
                    hti._setDataPoint(hr.area.tag);
                    hti._chartElement = chart.ChartElement.PlotArea;
                    hti._dist = hr.distance;
                }
                return hti;
            };
            // hitTest including lines
            FlexChartCore.prototype._hitTestData = function (pt) {
                var cpt = this._toControl(pt);
                var hti = new chart.HitTestInfo(this, cpt);
                var hr = this._hitTester.hitTest(cpt, true);
                if (hr && hr.area) {
                    hti._setDataPoint(hr.area.tag);
                    hti._dist = hr.distance;
                }
                return hti;
            };
            FlexChartCore.prototype._hitTestLabels = function (pt) {
                var area = null;
                var len = this._lblAreas.length;
                for (var i = 0; i < len; i++) {
                    if (this._lblAreas[i].contains(pt)) {
                        area = this._lblAreas[i];
                        break;
                    }
                }
                return area;
            };
            /* private _hitTestLines(hti: HitTestInfo): HitTestInfo {
                if (hti.series) {
                    var pi = hti.pointIndex;
                    var p0 = hti.series._indexToPoint(pi);
    
                    // jQuery
                    //var offset = $(this.hostElement).offset();
                    var offset = this._getHostOffset();
    
                    p0 = this.dataToPoint(p0);
                    p0.x -= offset.x;
                    p0.y -= offset.y;
    
                    var d1 = null,
                        d2 = null;
                    var p1 = hti.series._indexToPoint(pi - 1);
                    var p2 = hti.series._indexToPoint(pi + 1);
                    if (p1) {
                        p1 = this.dataToPoint(p1);
                        p1.x -= offset.x;
                        p1.y -= offset.y;
                        d1 = FlexChart._dist2(p0, p1);
                    }
                    if (p2) {
                        p2 = this.dataToPoint(p2);
                        p2.x -= offset.x;
                        p2.y -= offset.y;
                        d2 = FlexChart._dist2(p0, p2);
                    }
    
                    var pt = hti.point.clone();
                    var host = this.hostElement;
                    pt.x -= host.offsetLeft;
                    pt.y -= host.offsetTop;
    
                    if (d1 && d2) {
                        if (d1 < d2) {
                            hti._dist = FlexChart._dist(pt, p0, p1);
                        }
                        else {
                            hti._dist = FlexChart._dist(pt, p0, p2);
                        }
                    } else if (d1) {
                        hti._dist = FlexChart._dist(pt, p0, p1);
                    } else if (d2) {
                        hti._dist = FlexChart._dist(pt, p0, p2);
                    }
                }
    
                return hti;
            }*/
            FlexChartCore._dist2 = function (p1, p2) {
                var dx = p1.x - p2.x;
                var dy = p1.y - p2.y;
                return dx * dx + dy * dy;
            };
            // line p1-p2 to point p0
            /*static _dist(p0: Point, p1: Point, p2: Point): number {
                var dx = p2.x - p1.x;
                var dy = p2.y - p1.y;
                return Math.sqrt(Math.abs(dy * p0.x - dx * p0.y - p1.x * p2.y + p2.x * p1.y) / Math.sqrt(dx * dx + dy * dy));
            }*/
            FlexChartCore._dist = function (p0, p1, p2) {
                return Math.sqrt(chart.FlexChart._distToSegmentSquared(p0, p1, p2));
            };
            FlexChartCore._distToSegmentSquared = function (p, v, w) {
                var l2 = chart.FlexChart._dist2(v, w);
                if (l2 == 0)
                    return chart.FlexChart._dist2(p, v);
                var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
                if (t < 0)
                    return chart.FlexChart._dist2(p, v);
                if (t > 1)
                    return chart.FlexChart._dist2(p, w);
                return chart.FlexChart._dist2(p, new wijmo.Point(v.x + t * (w.x - v.x), v.y + t * (w.y - v.y)));
            };
            FlexChartCore.prototype._isRotated = function () {
                return this._getChartType() == chart.ChartType.Bar ? !this._rotated : this._rotated;
            };
            FlexChartCore.prototype._getChartType = function () {
                return null;
            };
            FlexChartCore.prototype._render = function (engine, applyElement) {
                if (applyElement === void 0) { applyElement = true; }
                var el = this.hostElement;
                //  jQuery
                // var w = $(el).width();//el.clientWidth - el.clientLeft;
                // var h = $(el).height(); //el.clientHeight - el.clientTop;
                var sz = this._getHostSize();
                var w = sz.width, h = sz.height;
                if (w == 0 || isNaN(w)) {
                    w = chart.FlexChart._WIDTH;
                }
                if (h == 0 || isNaN(h)) {
                    h = chart.FlexChart._HEIGHT;
                }
                //
                var hostSz = new wijmo.Size(w, h);
                engine.beginRender();
                if (w > 0 && h > 0) {
                    engine.setViewportSize(w, h);
                    this._hitTester.clear();
                    var legend = this.legend;
                    var lsz;
                    var tsz;
                    var lpos;
                    var rect = new wijmo.Rect(0, 0, w, h);
                    this._rectChart = rect.clone();
                    engine.startGroup(chart.FlexChart._CSS_HEADER);
                    rect = this._drawTitle(engine, rect, this.header, this.headerStyle, false);
                    engine.endGroup();
                    engine.startGroup(chart.FlexChart._CSS_FOOTER);
                    rect = this._drawTitle(engine, rect, this.footer, this.footerStyle, true);
                    engine.endGroup();
                    w = rect.width;
                    h = rect.height;
                    var legpos = legend._getPosition(w, h);
                    lsz = legend._getDesiredSize(engine, legpos, w, h);
                    switch (legpos) {
                        case chart.Position.Right:
                            w -= lsz.width;
                            lpos = new wijmo.Point(w, rect.top + 0.5 * (h - lsz.height));
                            break;
                        case chart.Position.Left:
                            rect.left += lsz.width;
                            w -= lsz.width;
                            lpos = new wijmo.Point(0, rect.top + 0.5 * (h - lsz.height));
                            break;
                        case chart.Position.Top:
                            h -= lsz.height;
                            lpos = new wijmo.Point(0.5 * (w - lsz.width), rect.top);
                            rect.top += lsz.height;
                            break;
                        case chart.Position.Bottom:
                            h -= lsz.height;
                            lpos = new wijmo.Point(0.5 * (w - lsz.width), rect.top + h);
                            break;
                    }
                    rect.width = w;
                    rect.height = h;
                    //
                    var plotter = this._getPlotter(null);
                    plotter.stacking = this._stacking;
                    if (this._curPlotter != plotter) {
                        if (this._curPlotter) {
                            this._curPlotter.unload(); // clean up / restore chart settings
                        }
                        this._curPlotter = plotter;
                    }
                    plotter.load(); // change global chart settings
                    var isRotated = this._isRotated();
                    this._dataInfo.analyse(this._series, isRotated, plotter.stacking, this._xvals.length > 0 ? this._xvals : null, this.axisX.logBase > 0, this.axisY.logBase > 0);
                    var rect0 = plotter.adjustLimits(this._dataInfo, rect.clone());
                    if (isRotated) {
                        var ydt = this._dataInfo.getDataTypeX();
                        if (!ydt) {
                            ydt = this._xDataType;
                        }
                        this.axisX._updateActualLimits(this._dataInfo.getDataTypeY(), rect0.left, rect0.right);
                        this.axisY._updateActualLimits(ydt, rect0.top, rect0.bottom, this._xlabels, this._xvals);
                    }
                    else {
                        var xdt = this._dataInfo.getDataTypeX();
                        if (!xdt) {
                            xdt = this._xDataType;
                        }
                        this.axisX._updateActualLimits(xdt, rect0.left, rect0.right, this._xlabels, this._xvals);
                        this.axisY._updateActualLimits(this._dataInfo.getDataTypeY(), rect0.top, rect0.bottom);
                    }
                    var axes = this._getAxes();
                    this._updateAuxAxes(axes, isRotated);
                    //
                    this._layout(rect, hostSz, engine);
                    // render plot areas
                    engine.startGroup(chart.FlexChart._CSS_PLOT_AREA);
                    engine.fill = 'transparent';
                    engine.stroke = null;
                    var plen = this.plotAreas.length;
                    if (plen > 0) {
                        for (var i = 0; i < this.plotAreas.length; i++) {
                            var pa = this.plotAreas[i];
                            pa._render(engine);
                        }
                    }
                    else {
                        var prect = this._plotRect;
                        engine.drawRect(prect.left, prect.top, prect.width, prect.height);
                    }
                    engine.endGroup();
                    var len = this._series.length;
                    this._clearPlotters();
                    var groups = {};
                    for (var i = 0; i < len; i++) {
                        var series = this._series[i];
                        if (series.getValues(0)) {
                            var ay = series._getAxisY();
                            if (ay && ay != this.axisY) {
                                var axid = ay._uniqueId;
                                if (!groups[axid]) {
                                    groups[axid] = { count: 1, index: 0 };
                                }
                                else {
                                    groups[axid].count += 1;
                                }
                            }
                            else {
                                var plotter = this._getPlotter(series);
                                plotter.seriesCount++;
                            }
                        }
                    }
                    this.onRendering(new chart.RenderEventArgs(engine));
                    //Don't draw axis for funnel chart.
                    if (this._getChartType() !== chart.ChartType.Funnel) {
                        for (var i = 0; i < axes.length; i++) {
                            var ax = axes[i], ele;
                            if (ax.axisType == chart.AxisType.X) {
                                ele = engine.startGroup(chart.FlexChart._CSS_AXIS_X);
                            }
                            else {
                                ele = engine.startGroup(chart.FlexChart._CSS_AXIS_Y);
                            }
                            ax._hostElement = applyElement ? ele : ax._hostElement;
                            ax._render(engine);
                            engine.endGroup();
                        }
                    }
                    engine.startGroup('wj-series-group'); // all series
                    this._plotrectId = 'plotRect' + (1000000 * Math.random()).toFixed();
                    engine.addClipRect(this._plotRect, this._plotrectId);
                    for (var i = 0; i < len; i++) {
                        var series = this._series[i];
                        series._pointIndexes = [];
                        var plotter = this._getPlotter(series);
                        var ele = engine.startGroup(series.cssClass, plotter.clipping ? this._plotrectId : null);
                        series._hostElement = applyElement ? ele : series._hostElement;
                        var vis = series.visibility;
                        var axisX = series.axisX;
                        var axisY = series.axisY;
                        if (!axisX) {
                            axisX = this.axisX;
                        }
                        if (!axisY) {
                            axisY = this.axisY;
                        }
                        if (vis == chart.SeriesVisibility.Visible || vis == chart.SeriesVisibility.Plot) {
                            var group = groups[axisY._uniqueId];
                            if (group) {
                                if (series.rendering.hasHandlers) {
                                    series.onRendering(engine);
                                }
                                else {
                                    plotter.plotSeries(engine, axisX, axisY, series, this, group.index, group.count);
                                }
                                group.index++;
                            }
                            else {
                                if (series.rendering.hasHandlers) {
                                    series.onRendering(engine);
                                }
                                else {
                                    plotter.plotSeries(engine, axisX, axisY, series, this, plotter.seriesIndex, plotter.seriesCount);
                                    plotter.seriesIndex++;
                                }
                            }
                        }
                        engine.endGroup();
                    }
                    engine.endGroup();
                    this._lblAreas = [];
                    if (this.dataLabel.content && this.dataLabel.position != chart.LabelPosition.None) {
                        this._renderLabels(engine);
                    }
                    if (lsz) {
                        this._legendHost = engine.startGroup(chart.FlexChart._CSS_LEGEND);
                        this._rectLegend = new wijmo.Rect(lpos.x, lpos.y, lsz.width, lsz.height);
                        engine.textFill = chart.FlexChart._FG;
                        this.legend._render(engine, lpos, legpos, lsz.width, lsz.height);
                        engine.textFill = null;
                        engine.endGroup();
                    }
                    else {
                        this._legendHost = null;
                        this._rectLegend = null;
                    }
                    this._highlightCurrent();
                    this.onRendered(new chart.RenderEventArgs(engine));
                }
                engine.endRender();
            };
            FlexChartCore.prototype._renderLabels = function (engine) {
                var srs = this.series;
                var slen = srs.length;
                engine.stroke = 'null';
                engine.fill = 'transparent';
                engine.strokeWidth = 1;
                var gcss = 'wj-data-labels';
                engine.startGroup(gcss);
                for (var i = 0; i < slen; i++) {
                    var ser = srs[i];
                    var smap = this._hitTester._map[i];
                    if (smap) {
                        ser._renderLabels(engine, smap, this, this._lblAreas);
                    }
                }
                engine.endGroup();
            };
            FlexChartCore.prototype._getAxes = function () {
                var axes = [this.axisX, this.axisY];
                var len = this.series.length;
                for (var i = 0; i < len; i++) {
                    var ser = this.series[i];
                    var ax = ser.axisX;
                    if (ax && axes.indexOf(ax) === -1) {
                        axes.push(ax);
                    }
                    var ay = ser.axisY;
                    if (ay && axes.indexOf(ay) === -1) {
                        axes.push(ay);
                    }
                }
                return axes;
            };
            FlexChartCore.prototype._clearPlotters = function () {
                var len = this._plotters.length;
                for (var i = 0; i < len; i++)
                    this._plotters[i].clear();
            };
            FlexChartCore.prototype._initPlotter = function (plotter) {
                plotter.chart = this;
                plotter.dataInfo = this._dataInfo;
                plotter.hitTester = this._hitTester;
                this._plotters.push(plotter);
            };
            Object.defineProperty(FlexChartCore.prototype, "_barPlotter", {
                get: function () {
                    if (this.__barPlotter === null) {
                        this.__barPlotter = new chart._BarPlotter();
                        this._initPlotter(this.__barPlotter);
                    }
                    return this.__barPlotter;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexChartCore.prototype, "_linePlotter", {
                get: function () {
                    if (this.__linePlotter === null) {
                        this.__linePlotter = new chart._LinePlotter();
                        this._initPlotter(this.__linePlotter);
                    }
                    return this.__linePlotter;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexChartCore.prototype, "_areaPlotter", {
                get: function () {
                    if (this.__areaPlotter === null) {
                        this.__areaPlotter = new chart._AreaPlotter();
                        this._initPlotter(this.__areaPlotter);
                    }
                    return this.__areaPlotter;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexChartCore.prototype, "_bubblePlotter", {
                get: function () {
                    if (this.__bubblePlotter === null) {
                        this.__bubblePlotter = new chart._BubblePlotter();
                        this._initPlotter(this.__bubblePlotter);
                    }
                    return this.__bubblePlotter;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexChartCore.prototype, "_financePlotter", {
                get: function () {
                    if (this.__financePlotter === null) {
                        this.__financePlotter = new chart._FinancePlotter();
                        this._initPlotter(this.__financePlotter);
                    }
                    return this.__financePlotter;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexChartCore.prototype, "_funnelPlotter", {
                get: function () {
                    if (this.__funnelPlotter === null) {
                        this.__funnelPlotter = new chart._FunnelPlotter();
                        this._initPlotter(this.__funnelPlotter);
                    }
                    return this.__funnelPlotter;
                },
                enumerable: true,
                configurable: true
            });
            FlexChartCore.prototype._getPlotter = function (series) {
                var chartType = this._getChartType();
                var isSeries = false;
                if (series) {
                    var stype = series._getChartType();
                    if (stype !== null && stype !== undefined && stype != chartType) {
                        chartType = stype;
                        isSeries = true;
                    }
                }
                var plotter;
                switch (chartType) {
                    case chart.ChartType.Column:
                        this._barPlotter.isVolume = false;
                        this._barPlotter.width = 0.7;
                        plotter = this._barPlotter;
                        break;
                    case chart.ChartType.Bar:
                        this._barPlotter.rotated = !this._rotated;
                        this._barPlotter.isVolume = false;
                        this._barPlotter.width = 0.7;
                        plotter = this._barPlotter;
                        break;
                    case chart.ChartType.Line:
                        this._linePlotter.hasSymbols = false;
                        this._linePlotter.hasLines = true;
                        this._linePlotter.isSpline = false;
                        plotter = this._linePlotter;
                        break;
                    case chart.ChartType.Scatter:
                        this._linePlotter.hasSymbols = true;
                        this._linePlotter.hasLines = false;
                        this._linePlotter.isSpline = false;
                        plotter = this._linePlotter;
                        break;
                    case chart.ChartType.LineSymbols:
                        this._linePlotter.hasSymbols = true;
                        this._linePlotter.hasLines = true;
                        this._linePlotter.isSpline = false;
                        plotter = this._linePlotter;
                        break;
                    case chart.ChartType.Area:
                        this._areaPlotter.isSpline = false;
                        plotter = this._areaPlotter;
                        break;
                    case chart.ChartType.Bubble:
                        plotter = this._bubblePlotter;
                        break;
                    case chart.ChartType.Candlestick:
                        var fp = this._financePlotter;
                        fp.isCandle = true;
                        fp.isEqui = false;
                        fp.isArms = false;
                        fp.isVolume = false;
                        plotter = fp;
                        break;
                    case chart.ChartType.HighLowOpenClose:
                        var fp = this._financePlotter;
                        fp.isCandle = false;
                        fp.isEqui = false;
                        fp.isArms = false;
                        fp.isVolume = false;
                        plotter = fp;
                        break;
                    case chart.ChartType.Spline:
                        this._linePlotter.hasSymbols = false;
                        this._linePlotter.hasLines = true;
                        this._linePlotter.isSpline = true;
                        plotter = this._linePlotter;
                        break;
                    case chart.ChartType.SplineSymbols:
                        this._linePlotter.hasSymbols = true;
                        this._linePlotter.hasLines = true;
                        this._linePlotter.isSpline = true;
                        plotter = this._linePlotter;
                        break;
                    case chart.ChartType.SplineArea:
                        this._areaPlotter.isSpline = true;
                        plotter = this._areaPlotter;
                        break;
                    case chart.ChartType.Funnel:
                        plotter = this._funnelPlotter;
                        break;
                    default:
                        throw 'Invalid chart type.';
                }
                plotter.rotated = this._rotated;
                if (chartType == chart.ChartType.Bar)
                    plotter.rotated = !plotter.rotated;
                if (isSeries) {
                    plotter.rotated = this._isRotated();
                }
                return plotter;
            };
            FlexChartCore.prototype._layout = function (rect, size, engine) {
                if (this.plotAreas.length > 0) {
                    this._layoutMultiple(rect, size, engine);
                }
                else {
                    this._layoutSingle(rect, size, engine);
                }
            };
            FlexChartCore.prototype._layoutSingle = function (rect, size, engine) {
                var w = rect.width;
                var h = rect.height;
                var mxsz = new wijmo.Size(w, 0.75 * h);
                var mysz = new wijmo.Size(h, 0.75 * w);
                var left = 0, top = 0, right = w, bottom = h;
                var l0 = 0, t0 = 0, r0 = w, b0 = h;
                var axes = this._getAxes();
                for (var i = 0; i < axes.length; i++) {
                    var ax = axes[i];
                    var origin = ax.origin;
                    if (ax.axisType == chart.AxisType.X) {
                        var ah = ax._getHeight(engine, w);
                        if (ah > mxsz.height)
                            ah = mxsz.height;
                        ax._desiredSize = new wijmo.Size(mxsz.width, ah);
                        var hasOrigin = ax._hasOrigin =
                            wijmo.isNumber(origin) && origin > this.axisY._getMinNum() && origin < this.axisY._getMaxNum();
                        if (ax.position == chart.Position.Bottom) {
                            left = Math.max(left, ax._annoSize.width * 0.5);
                            right = Math.min(right, w - ax._annoSize.width * 0.5);
                            if (hasOrigin) {
                                var yorigin = this._convertY(origin, t0, b0);
                                b0 = b0 - Math.max(0, (yorigin + ah) - b0);
                            }
                            else {
                                b0 = b0 - ah;
                            }
                        }
                        else if (ax.position == chart.Position.Top) {
                            left = Math.max(left, ax._annoSize.width * 0.5);
                            right = Math.min(right, w - ax._annoSize.width * 0.5);
                            if (hasOrigin) {
                                var yorigin = this._convertY(origin, t0, b0);
                                t0 = t0 + Math.max(0, t0 - (yorigin - ah));
                            }
                            else {
                                t0 = t0 + ah;
                            }
                        }
                    }
                    else if (ax.axisType == chart.AxisType.Y) {
                        var ah = ax._getHeight(engine, h);
                        if (ah > mysz.height) {
                            ah = mysz.height;
                        }
                        ax._desiredSize = new wijmo.Size(mysz.width, ah);
                        var hasOrigin = ax._hasOrigin =
                            wijmo.isNumber(origin) && origin > this.axisX._getMinNum() && origin < this.axisX._getMaxNum();
                        if (ax.position == chart.Position.Left) {
                            top = Math.max(top, ax._annoSize.width * 0.5);
                            bottom = Math.min(bottom, h - ax._annoSize.width * 0.5);
                            if (hasOrigin) {
                                var xorigin = this._convertX(origin, l0, r0);
                                l0 += Math.max(0, l0 - (xorigin - ah));
                            }
                            else {
                                l0 += ah;
                            }
                        }
                        else if (ax.position == chart.Position.Right) {
                            top = Math.max(top, ax._annoSize.width * 0.5);
                            bottom = Math.min(bottom, h - ax._annoSize.width * 0.5);
                            if (hasOrigin) {
                                var xorigin = this._convertX(origin, l0, r0);
                                r0 = r0 - Math.max(0, (xorigin + ah) - r0);
                            }
                            else {
                                r0 = r0 - ah;
                            }
                        }
                    }
                }
                // todo: custom margins
                var margins = this._parseMargin(this.plotMargin);
                if (!isNaN(margins.left)) {
                    left = l0 = margins.left;
                }
                else {
                    left = l0 = Math.max(left, l0) + rect.left;
                }
                if (!isNaN(margins.right)) {
                    right = r0 = size.width - margins.right;
                }
                else {
                    right = r0 = Math.min(right, r0) + rect.left;
                }
                if (!isNaN(margins.top)) {
                    top = t0 = margins.top;
                }
                else {
                    top = t0 = Math.max(top, t0) + rect.top;
                }
                if (!isNaN(margins.bottom)) {
                    bottom = b0 = size.height - margins.bottom;
                }
                else {
                    bottom = b0 = Math.min(bottom, b0) + rect.top;
                }
                w = Math.max(1, right - left);
                h = Math.max(1, bottom - top);
                this._plotRect = new wijmo.Rect(left, top, w, h);
                engine.stroke = null;
                //engine.setFill(this.plotFill);
                for (var i = 0; i < axes.length; i++) {
                    var ax = axes[i];
                    //ax._plot = _plot0;
                    var origin = ax.origin;
                    if (ax.axisType == chart.AxisType.X) {
                        var axr;
                        if (!ax._hasOrigin) {
                            if (ax.position == chart.Position.Bottom) {
                                axr = new wijmo.Rect(left, b0, w, ax._desiredSize.height);
                                b0 += ax._desiredSize.height;
                            }
                            else if (ax.position == chart.Position.Top) {
                                axr = new wijmo.Rect(left, t0 - ax._desiredSize.height, w, ax._desiredSize.height);
                                t0 -= ax._desiredSize.height;
                            }
                            else {
                                axr = new wijmo.Rect(left, t0, w, 1);
                            }
                        }
                        else {
                            var yorigin = this._convertY(origin, this._plotRect.top, this._plotRect.bottom);
                            if (ax.position == chart.Position.Bottom) {
                                axr = new wijmo.Rect(left, yorigin, w, ax._desiredSize.height);
                                b0 += Math.max(0, axr.bottom - this._plotRect.bottom); // ax.DesiredSize.Height;
                            }
                            else if (ax.position == chart.Position.Top) {
                                axr = new wijmo.Rect(left, yorigin - ax._desiredSize.height, w, ax._desiredSize.height);
                                t0 -= Math.max(0, this._plotRect.top - axr.top); // ax.DesiredSize.Height;
                            }
                        }
                        ax._layout(axr, this._plotRect);
                    }
                    else if (ax.axisType == chart.AxisType.Y) {
                        var ayr;
                        if (!ax._hasOrigin) {
                            if (ax.position == chart.Position.Left) {
                                ayr = new wijmo.Rect(l0 - ax._desiredSize.height, top, h, ax._desiredSize.height);
                                l0 -= ax._desiredSize.height;
                            }
                            else if (ax.position == chart.Position.Right) {
                                ayr = new wijmo.Rect(r0, top, h, ax._desiredSize.height);
                                r0 += ax._desiredSize.height;
                            }
                            else {
                                ayr = new wijmo.Rect(l0, top, h, 1);
                            }
                        }
                        else {
                            var xorigin = this._convertX(origin, this._plotRect.left, this._plotRect.right);
                            if (ax.position == chart.Position.Left) {
                                ayr = new wijmo.Rect(xorigin - ax._desiredSize.height, top, h, ax._desiredSize.height);
                                l0 -= ax._desiredSize.height;
                            }
                            else if (ax.position == chart.Position.Right) {
                                ayr = new wijmo.Rect(xorigin, top, h, ax._desiredSize.height);
                                r0 += ax._desiredSize.height;
                            }
                        }
                        ax._layout(ayr, this._plotRect);
                    }
                }
            };
            FlexChartCore.prototype._layoutMultiple = function (rect, size, engine) {
                var w = rect.width;
                var h = rect.height;
                var cols = [], rows = [];
                var axes = this._getAxes();
                var cnt = axes.length;
                for (var i = 0; i < cnt; i++) {
                    var ax = axes[i];
                    ax._plotrect = null;
                    if (ax.axisType == chart.AxisType.X) {
                        var col = ax.plotArea ? ax.plotArea.column : 0;
                        while (cols.length <= col)
                            cols.push(new _AreaDef());
                        cols[col].axes.push(ax);
                    }
                    else if (ax.axisType == chart.AxisType.Y) {
                        var row = ax.plotArea ? ax.plotArea.row : 0;
                        while (rows.length <= row)
                            rows.push(new _AreaDef());
                        rows[row].axes.push(ax);
                    }
                }
                var ncols = cols.length, nrows = rows.length;
                var mxsz = new wijmo.Size(w, 0.3 * h), mysz = new wijmo.Size(h, 0.3 * w), left = 0, top = 0, right = w, bottom = h;
                for (var icol = 0; icol < ncols; icol++) {
                    var ad = cols[icol];
                    ad.right = w;
                    ad.bottom = h;
                    for (var i = 0; i < ad.axes.length; i++) {
                        var ax = ad.axes[i];
                        var ah = ax._getHeight(engine, ax.axisType == chart.AxisType.X ? w : h); // .GetSize(GetItems(render, ax), false);
                        if (ah > mxsz.height)
                            ah = mxsz.height;
                        var szx = new wijmo.Size(mxsz.width, ah);
                        ax._desiredSize = szx;
                        if (icol == 0)
                            ad.left = Math.max(ad.left, ax._annoSize.width * 0.5);
                        if (icol == ncols - 1)
                            ad.right = Math.min(ad.right, w - ax._annoSize.width * 0.5);
                        if (ax.position == chart.Position.Bottom)
                            ad.bottom -= szx.height;
                        else if (ax.position == chart.Position.Top)
                            ad.top += szx.height;
                    }
                }
                for (var irow = 0; irow < nrows; irow++) {
                    var ad = rows[irow];
                    ad.right = w;
                    ad.bottom = h;
                    for (var i = 0; i < ad.axes.length; i++) {
                        var ax = ad.axes[i];
                        var szy = new wijmo.Size(mysz.width, ax._getHeight(engine, ax.axisType == chart.AxisType.X ? w : h));
                        if (szy.height > mysz.height)
                            szy.height = mysz.height;
                        ax._desiredSize = szy;
                        if (irow == 0)
                            ad.top = Math.max(ad.top, ax._annoSize.width * 0.5);
                        if (irow == nrows - 1)
                            ad.bottom = Math.min(ad.bottom, h - ax._annoSize.width * 0.5);
                        if (ax.position == chart.Position.Left)
                            ad.left += szy.height;
                        else if (ax.position == chart.Position.Right)
                            ad.right -= szy.height;
                    }
                }
                var l0 = 0, t0 = 0, r0 = w, b0 = h;
                for (var icol = 0; icol < ncols; icol++) {
                    var ad = cols[icol];
                    l0 = Math.max(l0, ad.left);
                    t0 = Math.max(t0, ad.top);
                    r0 = Math.min(r0, ad.right);
                    b0 = Math.min(b0, ad.bottom);
                }
                for (var irow = 0; irow < nrows; irow++) {
                    var ad = rows[irow];
                    l0 = Math.max(l0, ad.left);
                    t0 = Math.max(t0, ad.top);
                    r0 = Math.min(r0, ad.right);
                    b0 = Math.min(b0, ad.bottom);
                }
                //double w = 0, h = 0;
                //AdjustMargins(arrangeSize, ref left, ref right, ref top, ref bottom, ref w, ref h, ref l0, ref r0, ref t0, ref b0);
                l0 = left = Math.max(left, l0);
                r0 = right = Math.min(right, r0);
                t0 = top = Math.max(top, t0);
                b0 = bottom = Math.min(bottom, b0);
                //_plot = _plot0 = new Rect(left, top, w, h);
                this._plotRect = new wijmo.Rect(left, top, right - left, bottom - top);
                var plot0 = this._plotRect.clone(); // new Rect(left, top, w, h);
                //var wcol = w / ncols;
                //var hrow = h / nrows;
                var x = left;
                var widths = this.plotAreas._calculateWidths(this._plotRect.width, ncols);
                for (var icol = 0; icol < ncols; icol++) {
                    b0 = bottom;
                    t0 = top;
                    var ad = cols[icol];
                    var wcol = widths[icol];
                    for (var i = 0; i < ad.axes.length; i++) {
                        var ax = ad.axes[i];
                        var axplot = new wijmo.Rect(x, plot0.top, wcol, plot0.height);
                        var axr; // = new Rect();
                        if (ax.position == chart.Position.Bottom) {
                            axr = new wijmo.Rect(x, b0, wcol, ax._desiredSize.height);
                            b0 += ax._desiredSize.height;
                        }
                        else if (ax.position == chart.Position.Top) {
                            axr = new wijmo.Rect(x, t0 - ax._desiredSize.height, wcol, ax._desiredSize.height);
                            t0 -= ax._desiredSize.height;
                        }
                        ax._layout(axr, axplot);
                    }
                    for (var i = 0; i < this.plotAreas.length; i++) {
                        var pa = this.plotAreas[i];
                        if (pa.column == icol)
                            pa._setPlotX(x, wcol);
                    }
                    x += wcol;
                }
                var y = top; //bottom;
                var heights = this.plotAreas._calculateHeights(this._plotRect.height, nrows);
                for (var irow = 0; irow < nrows; irow++) {
                    l0 = left;
                    r0 = right;
                    var ad = rows[irow];
                    var hrow = heights[irow];
                    //y -= hrow;
                    for (var i = 0; i < ad.axes.length; i++) {
                        var ax = ad.axes[i];
                        var axplot = new wijmo.Rect(plot0.left, y, plot0.width, hrow);
                        if (ax._plotrect) {
                            axplot.left = ax._plotrect.left;
                            axplot.width = ax._plotrect.width;
                        }
                        else if (widths && widths.length > 0) {
                            axplot.width = widths[0];
                        }
                        var ayr;
                        if (ax.position == chart.Position.Left) {
                            ayr = new wijmo.Rect(l0 - ax._desiredSize.height, y, hrow, ax._desiredSize.height);
                            l0 -= ax._desiredSize.height;
                        }
                        else if (ax.position == chart.Position.Right) {
                            ayr = new wijmo.Rect(r0, y, hrow, ax._desiredSize.height);
                            r0 += ax._desiredSize.height;
                        }
                        ax._layout(ayr, axplot);
                    }
                    for (var i = 0; i < this.plotAreas.length; i++) {
                        var pa = this.plotAreas[i];
                        if (pa.row == irow)
                            pa._setPlotY(y, hrow);
                    }
                    y += hrow;
                }
            };
            //---------------------------------------------------------------------
            FlexChartCore.prototype._convertX = function (x, left, right) {
                var ax = this.axisX;
                if (ax.reversed)
                    return right - (right - left) * (x - ax._getMinNum()) / (ax._getMaxNum() - ax._getMinNum());
                else
                    return left + (right - left) * (x - ax._getMinNum()) / (ax._getMaxNum() - ax._getMinNum());
            };
            FlexChartCore.prototype._convertY = function (y, top, bottom) {
                var ay = this.axisY;
                if (ay.reversed)
                    return top + (bottom - top) * (y - ay._getMinNum()) / (ay._getMaxNum() - ay._getMinNum());
                else
                    return bottom - (bottom - top) * (y - ay._getMinNum()) / (ay._getMaxNum() - ay._getMinNum());
            };
            // tooltips
            FlexChartCore.prototype._getLabelContent = function (ht, content) {
                //var tc = this._tooltip.content;
                if (wijmo.isString(content)) {
                    return this._keywords.replace(content, ht);
                }
                else if (wijmo.isFunction(content)) {
                    return content(ht);
                }
                return null;
            };
            //---------------------------------------------------------------------
            // selection
            FlexChartCore.prototype._select = function (newSelection, pointIndex) {
                // un-highlight old selection
                if (this._selection) {
                    this._highlight(this._selection, false, this._selectionIndex);
                }
                // highlight new selection
                this._selection = newSelection;
                this._selectionIndex = pointIndex;
                if (this._selection) {
                    this._highlight(this._selection, true, this._selectionIndex);
                }
                // update CollectionView
                if (this.selectionMode == SelectionMode.Point) {
                    var cv = newSelection ? newSelection.collectionView : this._cv;
                    if (cv) {
                        this._notifyCurrentChanged = false;
                        cv.moveCurrentToPosition(newSelection ? pointIndex : -1);
                        this._notifyCurrentChanged = true;
                    }
                }
                // raise event
                this.onSelectionChanged();
            };
            FlexChartCore.prototype._highlightCurrent = function () {
                if (this.selectionMode != SelectionMode.None) {
                    var selection = this._selection;
                    var pointIndex = -1;
                    if (selection) {
                        var cv = selection.collectionView;
                        if (!cv) {
                            cv = this._cv;
                        }
                        if (cv) {
                            pointIndex = cv.currentPosition;
                        }
                        this._highlight(selection, true, pointIndex);
                    }
                }
            };
            FlexChartCore.prototype._highlight = function (series, selected, pointIndex) {
                // check that the selection is a Series object (or null)
                series = wijmo.asType(series, chart.SeriesBase, true);
                // select the series or the point
                if (this.selectionMode == SelectionMode.Series) {
                    var index = this.series.indexOf(series);
                    var gs = series.hostElement;
                    // jQuery
                    // var hs = $(gs);
                    // this._highlightItems(hs.find('rect'), FlexChart._CSS_SELECTION, selected);
                    // this._highlightItems(hs.find('ellipse'), FlexChart._CSS_SELECTION, selected);
                    // this._highlightItems(hs.find('polyline'), FlexChart._CSS_SELECTION, selected);
                    // this._highlightItems(hs.find('polygon'), FlexChart._CSS_SELECTION, selected);
                    // this._highlightItems(hs.find('line'), FlexChart._CSS_SELECTION, selected);
                    if (selected) {
                        gs.parentNode.appendChild(gs);
                    }
                    else {
                        gs.parentNode.insertBefore(gs, gs.parentNode.childNodes.item(index));
                    }
                    var found = this._find(gs, ['rect', 'ellipse', 'polyline', 'polygon', 'line', 'path']);
                    this._highlightItems(found, chart.FlexChart._CSS_SELECTION, selected);
                    if (series.legendElement) {
                        // jQuery
                        // var ls = $(series.legendElement);
                        // this._highlightItems(ls.find('rect'), FlexChart._CSS_SELECTION, selected);
                        // this._highlightItems(ls.find('ellipse'), FlexChart._CSS_SELECTION, selected);
                        // this._highlightItems(ls.find('line'), FlexChart._CSS_SELECTION, selected);
                        this._highlightItems(this._find(series.legendElement, ['rect', 'ellipse', 'line']), chart.FlexChart._CSS_SELECTION, selected);
                    }
                }
                else if (this.selectionMode == SelectionMode.Point) {
                    var index = this.series.indexOf(series);
                    var gs = series.hostElement;
                    /* jQuery
                    var hs = $(gs);
    
                    if (selected) {
                        gs.parentNode.appendChild(gs);
                        var pel = $(series.getPlotElement(pointIndex));
                        if (pel.length) {
                            this._highlightItems(pel, FlexChart._CSS_SELECTION, selected);
                            this._highlightItems(pel.find('line'), FlexChart._CSS_SELECTION, selected);
                            this._highlightItems(pel.find('rect'), FlexChart._CSS_SELECTION, selected);
                        }
                    } else {
                        gs.parentNode.insertBefore(gs, gs.parentNode.childNodes.item(index));
    
                        this._highlightItems(hs.find('rect'), FlexChart._CSS_SELECTION, selected);
                        this._highlightItems(hs.find('ellipse'), FlexChart._CSS_SELECTION, selected);
                        this._highlightItems(hs.find('line'), FlexChart._CSS_SELECTION, selected);
                    }
                    */
                    if (selected) {
                        gs.parentNode.appendChild(gs);
                        var pel = series.getPlotElement(pointIndex);
                        if (pel) {
                            if (pel.nodeName != 'g') {
                                this._highlightItems([pel], chart.FlexChart._CSS_SELECTION, selected);
                            }
                            var found = this._find(pel, ['line', 'rect', 'ellipse', 'path', 'polygon']);
                            this._highlightItems(found, chart.FlexChart._CSS_SELECTION, selected);
                        }
                    }
                    else {
                        gs.parentNode.insertBefore(gs, gs.parentNode.childNodes.item(index));
                        var found = this._find(gs, ['rect', 'ellipse', 'line', 'path', 'polygon']);
                        this._highlightItems(found, chart.FlexChart._CSS_SELECTION, selected);
                    }
                }
            };
            // aux axes
            FlexChartCore.prototype._updateAuxAxes = function (axes, isRotated) {
                for (var i = 2; i < axes.length; i++) {
                    var ax = axes[i];
                    ax._chart = this;
                    var slist = [];
                    for (var iser = 0; iser < this.series.length; iser++) {
                        var ser = this.series[iser];
                        if (ser.axisX == ax || ser.axisY == ax) {
                            slist.push(ser);
                        }
                    }
                    var dataMin, dataMax;
                    for (var iser = 0; iser < slist.length; iser++) {
                        var rect = slist[iser].getDataRect() || slist[iser]._getDataRect();
                        if (rect) {
                            if ((ax.axisType == chart.AxisType.X && !isRotated) || (ax.axisType == chart.AxisType.Y && isRotated)) {
                                if (dataMin === undefined || rect.left < dataMin) {
                                    dataMin = rect.left;
                                }
                                if (dataMax === undefined || rect.right > dataMax) {
                                    dataMax = rect.right;
                                }
                            }
                            else {
                                if (dataMin === undefined || rect.top < dataMin) {
                                    dataMin = rect.top;
                                }
                                if (dataMax === undefined || rect.bottom > dataMax) {
                                    dataMax = rect.bottom;
                                }
                            }
                        }
                    }
                    var dtype = slist[0].getDataType(0);
                    if (dtype == null) {
                        dtype = wijmo.DataType.Number;
                    }
                    axes[i]._updateActualLimits(dtype, dataMin, dataMax);
                }
            };
            //---------------------------------------------------------------------
            // tools
            FlexChartCore._contains = function (rect, pt) {
                if (rect && pt) {
                    return pt.x >= rect.left && pt.x <= rect.right && pt.y >= rect.top && pt.y <= rect.bottom;
                }
                return false;
            };
            FlexChartCore._intersects = function (rect1, rect2) {
                if (rect1.left > rect2.right || rect1.right < rect2.left || rect1.top > rect2.bottom || rect1.bottom < rect2.top) {
                    return false;
                }
                return true;
            };
            FlexChartCore._toOADate = function (date) {
                return date.valueOf();
                //return (date.getTime() - FlexChart._epoch) / FlexChart._msPerDay;
            };
            FlexChartCore._fromOADate = function (val) {
                return new Date(val);
                /*var dec = val - Math.floor(val);
                if (val < 0 && dec) {
                    val = Math.floor(val) - dec;
                }
                return new Date(val * FlexChart._msPerDay + FlexChart._epoch);
                */
            };
            FlexChartCore._renderText = function (engine, text, pos, halign, valign, className, groupName, style, test) {
                var sz = engine.measureString(text, className, groupName, style);
                var x = pos.x;
                var y = pos.y;
                switch (halign) {
                    // center
                    case 1:
                        x -= 0.5 * sz.width;
                        break;
                    // right
                    case 2:
                        x -= sz.width;
                        break;
                }
                switch (valign) {
                    // center
                    case 1:
                        y += 0.5 * sz.height;
                        break;
                    // top
                    case 0:
                        y += sz.height;
                        break;
                }
                var rect = new wijmo.Rect(x, y - sz.height, sz.width, sz.height);
                if (test) {
                    if (test(rect)) {
                        engine.drawString(text, new wijmo.Point(x, y), className, style);
                        return rect;
                    }
                    else
                        return null;
                }
                else {
                    engine.drawString(text, new wijmo.Point(x, y), className, style);
                    return rect;
                }
            };
            FlexChartCore._renderRotatedText = function (engine, text, pos, halign, valign, center, angle, className, style) {
                var sz = engine.measureString(text, className, style);
                var x = pos.x;
                var y = pos.y;
                switch (halign) {
                    case 1:
                        x -= 0.5 * sz.width;
                        break;
                    case 2:
                        x -= sz.width;
                        break;
                }
                switch (valign) {
                    case 1:
                        y += 0.5 * sz.height;
                        break;
                    case 0:
                        y += sz.height;
                        break;
                }
                engine.drawStringRotated(text, new wijmo.Point(x, y), center, angle, className, style);
            };
            FlexChartCore._CSS_AXIS_X = 'wj-axis-x';
            FlexChartCore._CSS_AXIS_Y = 'wj-axis-y';
            FlexChartCore._CSS_LINE = 'wj-line';
            FlexChartCore._CSS_GRIDLINE = 'wj-gridline';
            FlexChartCore._CSS_TICK = 'wj-tick';
            FlexChartCore._CSS_GRIDLINE_MINOR = 'wj-gridline-minor';
            FlexChartCore._CSS_TICK_MINOR = 'wj-tick-minor';
            FlexChartCore._CSS_LABEL = 'wj-label';
            FlexChartCore._CSS_LEGEND = 'wj-legend';
            FlexChartCore._CSS_HEADER = 'wj-header';
            FlexChartCore._CSS_FOOTER = 'wj-footer';
            FlexChartCore._CSS_TITLE = 'wj-title';
            FlexChartCore._CSS_SELECTION = 'wj-state-selected';
            FlexChartCore._CSS_PLOT_AREA = 'wj-plot-area';
            FlexChartCore._FG = '#666';
            FlexChartCore._epoch = new Date(1899, 11, 30).getTime();
            FlexChartCore._msPerDay = 86400000;
            return FlexChartCore;
        }(chart.FlexChartBase));
        chart.FlexChartCore = FlexChartCore;
        var _AreaDef = (function () {
            function _AreaDef() {
                this._axes = new Array();
                this.left = 0;
                this.right = 0;
                this.top = 0;
                this.bottom = 0;
            }
            Object.defineProperty(_AreaDef.prototype, "axes", {
                get: function () {
                    return this._axes;
                },
                enumerable: true,
                configurable: true
            });
            return _AreaDef;
        }());
        /**
         * Analyzes chart data.
         */
        var _DataInfo = (function () {
            function _DataInfo() {
                this.stackAbs = {};
                this._xvals = null;
            }
            _DataInfo.prototype.analyse = function (seriesList, isRotated, stacking, xvals, logx, logy) {
                this.minY = NaN;
                this.maxY = NaN;
                this.minX = NaN;
                this.maxX = NaN;
                this.minXp = NaN;
                this.minYp = NaN;
                this.dx = 0;
                var stackPos = {};
                var stackNeg = {};
                var stackAbs = {};
                this.dataTypeX = null;
                this.dataTypeY = null;
                this._xvals = xvals;
                if (xvals != null) {
                    var len = xvals.length;
                    for (var i = 0; i < len; i++) {
                        var xval = xvals[i];
                        if (isNaN(this.minX) || this.minX > xval) {
                            this.minX = xval;
                        }
                        if (isNaN(this.maxX) || this.maxX < xval) {
                            this.maxX = xval;
                        }
                        if (xval > 0) {
                            if (isNaN(this.minXp) || this.minXp > xval) {
                                this.minXp = xval;
                            }
                        }
                        if (i > 0) {
                            var dx = Math.abs(xval - xvals[i - 1]);
                            if (!isNaN(dx) && (dx < this.dx || this.dx == 0)) {
                                this.dx = dx;
                            }
                        }
                    }
                }
                for (var i = 0; i < seriesList.length; i++) {
                    var series = seriesList[i];
                    var ctype = series._getChartType();
                    var custom = series.chartType !== undefined;
                    var vis = series.visibility;
                    if (vis == chart.SeriesVisibility.Hidden || vis == chart.SeriesVisibility.Legend) {
                        continue;
                    }
                    var dr = series.getDataRect();
                    if (dr) {
                        if (isNaN(this.minX) || this.minX > dr.left) {
                            this.minX = dr.left;
                        }
                        if (isNaN(this.maxX) || this.maxX < dr.right) {
                            this.maxX = dr.right;
                        }
                        if (isNaN(this.minY) || this.minY > dr.top) {
                            this.minY = dr.top;
                        }
                        if (isNaN(this.maxY) || this.maxY < dr.bottom) {
                            this.maxY = dr.bottom;
                        }
                        continue;
                    }
                    var xvalues = null;
                    if (isRotated) {
                        if (!series._isCustomAxisY()) {
                            xvalues = series.getValues(1);
                        }
                    }
                    else {
                        if (!series._isCustomAxisX()) {
                            xvalues = series.getValues(1);
                        }
                    }
                    if (xvalues) {
                        if (!this.dataTypeX) {
                            this.dataTypeX = series.getDataType(1);
                        }
                        for (var j = 0; j < xvalues.length; j++) {
                            var val = xvalues[j];
                            if (_DataInfo.isValid(val)) {
                                if (isNaN(this.minX) || this.minX > val) {
                                    this.minX = val;
                                }
                                if (isNaN(this.maxX) || this.maxX < val) {
                                    this.maxX = val;
                                }
                                if (j > 0 && (!ctype ||
                                    ctype == chart.ChartType.Column || ctype == chart.ChartType.Bar)) {
                                    var dx = Math.abs(val - xvalues[j - 1]);
                                    if (!isNaN(dx) && dx > 0 && (dx < this.dx || this.dx == 0)) {
                                        this.dx = dx;
                                    }
                                }
                            }
                        }
                    }
                    var values = null, customY = false;
                    if (isRotated) {
                        customY = series._isCustomAxisX();
                        values = series.getValues(0);
                    }
                    else {
                        customY = series._isCustomAxisY();
                        values = series.getValues(0);
                    }
                    if (values) {
                        if (!this.dataTypeY && !customY) {
                            this.dataTypeY = series.getDataType(0);
                        }
                        if (isNaN(this.minX)) {
                            this.minX = 0;
                        }
                        else if (!xvalues && !xvals) {
                            this.minX = Math.min(this.minX, 0);
                        }
                        if (isNaN(this.maxX)) {
                            this.maxX = values.length - 1;
                        }
                        else if (!xvalues && !xvals) {
                            this.maxX = Math.max(this.maxX, values.length - 1);
                        }
                        if (!customY) {
                            for (var j = 0; j < values.length; j++) {
                                var val = values[j];
                                var xval = xvalues ? wijmo.asNumber(xvalues[j], true) : (xvals ? wijmo.asNumber(xvals[j], true) : j);
                                if (_DataInfo.isValid(val)) {
                                    if (isNaN(this.minY) || this.minY > val) {
                                        this.minY = val;
                                    }
                                    if (isNaN(this.maxY) || this.maxY < val) {
                                        this.maxY = val;
                                    }
                                    if (!custom) {
                                        if (val > 0) {
                                            if (isNaN(stackPos[xval])) {
                                                stackPos[xval] = val;
                                            }
                                            else {
                                                stackPos[xval] += val;
                                            }
                                            if (isNaN(this.minYp) || this.minYp > val) {
                                                this.minYp = val;
                                            }
                                        }
                                        else {
                                            if (isNaN(stackNeg[xval])) {
                                                stackNeg[xval] = val;
                                            }
                                            else {
                                                stackNeg[xval] += val;
                                            }
                                        }
                                        if (isNaN(stackAbs[xval])) {
                                            stackAbs[xval] = Math.abs(val);
                                        }
                                        else {
                                            stackAbs[xval] += Math.abs(val);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (stacking == Stacking.Stacked) {
                    for (var key in stackPos) {
                        if (stackPos[key] > this.maxY) {
                            this.maxY = stackPos[key];
                        }
                    }
                    for (var key in stackNeg) {
                        if (stackNeg[key] < this.minY) {
                            this.minY = stackNeg[key];
                        }
                    }
                }
                else if (stacking == Stacking.Stacked100pc) {
                    this.minY = 0;
                    this.maxY = 1;
                    for (var key in stackAbs) {
                        var sum = stackAbs[key];
                        if (isFinite(sum) && sum != 0) {
                            var vpos = stackPos[key];
                            var vneg = stackNeg[key];
                            if (isFinite(vpos)) {
                                vpos = Math.min(vpos / sum, this.maxY);
                            }
                            if (isFinite(vneg)) {
                                vneg = Math.max(vneg / sum, this.minY);
                            }
                        }
                    }
                }
                this.stackAbs = stackAbs;
                if (logx) {
                    if (isRotated)
                        this.minY = isNaN(this.minYp) ? 1 : this.minYp;
                    else
                        this.minX = isNaN(this.minXp) ? 1 : this.minXp;
                }
                if (logy) {
                    if (isRotated)
                        this.minX = isNaN(this.minXp) ? 1 : this.minXp;
                    else
                        this.minY = isNaN(this.minYp) ? 1 : this.minYp;
                }
            };
            _DataInfo.prototype.getMinY = function () {
                return this.minY;
            };
            _DataInfo.prototype.getMaxY = function () {
                return this.maxY;
            };
            _DataInfo.prototype.getMinX = function () {
                return this.minX;
            };
            _DataInfo.prototype.getMaxX = function () {
                return this.maxX;
            };
            _DataInfo.prototype.getMinXp = function () {
                return this.minXp;
            };
            _DataInfo.prototype.getMinYp = function () {
                return this.minYp;
            };
            _DataInfo.prototype.getDeltaX = function () {
                return this.dx;
            };
            _DataInfo.prototype.getDataTypeX = function () {
                return this.dataTypeX;
            };
            _DataInfo.prototype.getDataTypeY = function () {
                return this.dataTypeY;
            };
            _DataInfo.prototype.getStackedAbsSum = function (key) {
                var sum = this.stackAbs[key];
                return isFinite(sum) ? sum : 0;
            };
            _DataInfo.prototype.getXVals = function () {
                return this._xvals;
            };
            _DataInfo.isValid = function (value) {
                return isFinite(value); // && !isNaN(value);
            };
            return _DataInfo;
        }());
        chart._DataInfo = _DataInfo;
        /**
         * Extends the @see:Tooltip class to provide chart tooltips.
         */
        var ChartTooltip = (function (_super) {
            __extends(ChartTooltip, _super);
            /**
             * Initializes a new instance of the @see:ChartTooltip class.
             */
            function ChartTooltip() {
                _super.call(this);
                this._content = '<b>{seriesName}</b><br/>{x} {y}';
                this._threshold = 15;
            }
            Object.defineProperty(ChartTooltip.prototype, "content", {
                /**
                 * Gets or sets the tooltip content.
                 *
                 * The tooltip content can be specified as a string or as a function that
                 * takes a @see:HitTestInfo object as a parameter.
                 *
                 * When the tooltip content is a string, it may contain any of the following
                 * parameters:
                 *
                 * <ul>
                 *  <li><b>propertyName</b>:    Any property of the data object represented by the point.</li>
                 *  <li><b>seriesName</b>:      Name of the series that contains the data point (FlexChart only).</li>
                 *  <li><b>pointIndex</b>:      Index of the data point.</li>
                 *  <li><b>value</b>:           <b>Value</b> of the data point (y-value for @see:FlexChart, item value for @see:FlexPie).</li>
                 *  <li><b>x</b>:               <b>x</b>-value of the data point (FlexChart only).</li>
                 *  <li><b>y</b>:               <b>y</b>-value of the data point (FlexChart only).</li>
                 *  <li><b>name</b>:            <b>Name</b> of the data point (x-value for @see:FlexChart or legend entry for @see:FlexPie).</li>
                 * </ul>
                 *
                 * Parameters must be enclosed in single curly brackets. For example:
                 *
                 * <pre>
                 *   // 'country' and 'sales' are properties of the data object.
                 *   chart.tooltip.content = '{country}, sales:{sales}';
                 * </pre>
                 *
                 * The next example shows how to set the tooltip content using a function.
                 *
                 *  <pre>
                 *   // Set the tooltip content
                 *   chart.tooltip.content = function (ht) {
                 *     return ht.name + ":" + ht.value.toFixed();
                 *   }
                 * </pre>
                 */
                get: function () {
                    return this._content;
                },
                set: function (value) {
                    if (value != this._content) {
                        this._content = value;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ChartTooltip.prototype, "threshold", {
                /**
                 * Gets or sets the maximum distance from the element to display the tooltip.
                 */
                get: function () {
                    return this._threshold;
                },
                set: function (value) {
                    if (value != this._threshold) {
                        this._threshold = wijmo.asNumber(value);
                    }
                },
                enumerable: true,
                configurable: true
            });
            return ChartTooltip;
        }(wijmo.Tooltip));
        chart.ChartTooltip = ChartTooltip;
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=FlexChartCore.js.map