module wijmo.chart {
    'use strict';

    /**
     * Specifies whether and how to stack the chart's data values.
     */
    export enum Stacking {
        /** No stacking. Each series object is plotted independently. */
        None,
        /** Stacked charts show how each value contributes to the total. */
        Stacked,
        /** 100% stacked charts show how each value contributes to the total with the relative size of
         * each series representing its contribution to the total. */
        Stacked100pc
    }
    /**
     * Specifies what is selected when the user clicks the chart.
     */
    export enum SelectionMode {
        /** Select neither series nor data points when the user clicks the chart. */
        None,
        /** Select the whole @see:Series when the user clicks it on the chart. */
        Series,
        /** Select the data point when the user clicks it on the chart. Since Line, Area, Spline,
         * and SplineArea charts do not render individual data points, nothing is selected with this
         * setting on those chart types. */
        Point
    };

    /**
     * The core charting control for @see:FlexChart.
     *
     */
    export class FlexChartCore extends FlexChartBase {
        static _CSS_AXIS_X = 'wj-axis-x';
        static _CSS_AXIS_Y = 'wj-axis-y';

        static _CSS_LINE = 'wj-line';
        static _CSS_GRIDLINE = 'wj-gridline';
        static _CSS_TICK = 'wj-tick';

        static _CSS_GRIDLINE_MINOR = 'wj-gridline-minor';
        static _CSS_TICK_MINOR = 'wj-tick-minor';

        static _CSS_LABEL = 'wj-label';

        static _CSS_LEGEND = 'wj-legend';
        static _CSS_HEADER = 'wj-header';
        static _CSS_FOOTER = 'wj-footer';

        static _CSS_TITLE = 'wj-title';

        static _CSS_SELECTION = 'wj-state-selected';
        static _CSS_PLOT_AREA = 'wj-plot-area';

        static _FG = '#666';

        // property storage
        private _series = new wijmo.collections.ObservableArray();
        private _axes = new AxisCollection();
        private _pareas = new PlotAreaCollection();

        private _axisX: Axis;
        private _axisY: Axis;
        private _selection: SeriesBase;
        private _interpolateNulls = false;
        private _legendToggle = false;
        private _symbolSize = 10;

        private _dataInfo = new _DataInfo();
        _plotRect: Rect;

        private __barPlotter = null;
        private __linePlotter = null;
        private __areaPlotter = null;
        private __bubblePlotter = null;
        private __financePlotter = null;
        private __funnelPlotter = null;
        private __boxPlotter = null;
        private _plotters = [];

        private _binding: string;
        private _bindingX: string;
        _rotated = false;
        _stacking = Stacking.None;
        private _lbl: DataLabel;

        _xlabels: string[] = [];
        _xvals: number[] = [];
        _xDataType: DataType;

        private _hitTester: _HitTester;
        private _lblAreas: _RectArea[] = [];

        private _keywords: _KeyWords;

        private _curPlotter: _IPlotter;

        /**
         * Initializes a new instance of the @see:FlexChart class.
         *
         * @param element The DOM element that will host the control, or a selector for the host element (e.g. '#theCtrl').
         * @param options A JavaScript object containing initialization data for the control.
         */
        constructor(element: any, options?) {
            super(element, null, true); // invalidate on resize

            // add classes to host element
            this.applyTemplate('wj-control wj-flexchart', null, null);

            // handle changes to chartSeries array
            var self = this;
            self._series.collectionChanged.addHandler(function () {

                // check that chartSeries array contains Series objects
                var arr = self._series;
                for (var i = 0; i < arr.length; i++) {
                    var cs = <SeriesBase>tryCast(arr[i], wijmo.chart.SeriesBase);
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

            this._currentRenderEngine = new _SvgRenderEngine(this.hostElement);
            this._hitTester = new _HitTester(this);
            this._legend = new Legend(this);
            this._tooltip = new ChartTooltip();
            this._tooltip.showDelay = 0;

            this._lbl = new DataLabel();
            this._lbl._chart = this;

            this._initAxes();

            self._axes.collectionChanged.addHandler(function () {

                var arr = self._axes;
                for (var i = 0; i < arr.length; i++) {
                    var axis = tryCast(arr[i], wijmo.chart.Axis);
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
                    var pa = tryCast(arr[i], wijmo.chart.PlotArea);
                    if (!pa) {
                        throw 'plotAreas array must contain PlotArea objects.';
                    }
                    pa._chart = self;
                }
                // refresh chart to show the change
                self.refresh();
            });

            this._keywords = new _KeyWords();

            //if (isTouchDevice()) {
            this.hostElement.addEventListener('click', function (evt) {
                var tip = self._tooltip;
                var tc = tip.content;
                if (tc && self.isTouching) {
                    var ht = self.hitTest(evt);
                    if (ht.distance <= tip.threshold) {
                        var content = self._getLabelContent(ht, self._tooltip.content);
                        self._showToolTip(content, new wijmo.Rect(evt.clientX, evt.clientY, 5, 5));
                    } else {
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
                    } else {
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

                    var thershold = FlexChart._SELECTION_THRESHOLD;
                    if (self.tooltip && self.tooltip.threshold)
                        thershold = self.tooltip.threshold;
                    if (ht.distance <= thershold && ht.series) {
                        self._select(ht.series, ht.pointIndex);
                    } else {
                        if (self.selectionMode == SelectionMode.Series) {
                            ht = self.hitTest(evt);
                            if (ht.chartElement == ChartElement.Legend && ht.series) {
                                self._select(ht.series, null);
                            } else {
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
                    if (ht.chartElement == ChartElement.Legend && ht.series) {
                        if (ht.series.visibility == SeriesVisibility.Legend) {
                            ht.series.visibility = SeriesVisibility.Visible;
                        }
                        else if (ht.series.visibility == SeriesVisibility.Visible) {
                            ht.series.visibility = SeriesVisibility.Legend;
                        }
                        self.focus();
                    }
                }
            });

            // apply options only after chart is fully initialized
            this.initialize(options);
        }

        _initAxes() {
            this._axisX = new Axis(Position.Bottom);
            this._axisY = new Axis(Position.Left);

            // default style
            this._axisX.majorGrid = false;
            this._axisX.name = 'axisX';
            this._axisY.majorGrid = true;
            this._axisY.majorTickMarks = TickMark.None;
            this._axisY.name = 'axisY';

            this._axisX._chart = this;
            this._axisY._chart = this;

            this._axes.push(this._axisX);
            this._axes.push(this._axisY);
        }

        //--------------------------------------------------------------------------
        // ** object model

        /**
         * Gets the collection of @see:Series objects.
         */
        get series(): wijmo.collections.ObservableArray {
            return this._series;
        }

        /**
         * Gets the collection of @see:Axis objects.
         */
        get axes(): wijmo.collections.ObservableArray {
            return this._axes;
        }

        /**
         * Gets or sets the main X axis.
         */
        get axisX(): Axis {
            return this._axisX;
        }
        set axisX(value: Axis) {
            if (value != this._axisX) {
                var ax = this._axisX = asType(value, Axis);

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
                        ax.position = Position.Bottom;
                    }
                    ax._axisType = AxisType.X;
                    ax._chart = this;
                }
                this.endUpdate();
            }
        }

        /**
         * Gets or sets the main Y axis.
         */
        get axisY(): Axis {
            return this._axisY;
        }
        set axisY(value: Axis) {
            if (value != this._axisY) {
                var ay = this._axisY = asType(value, Axis);
                // set default axis attributes
                this.beginUpdate();
                if (ay) {
                    if (ay.majorGrid === undefined) {
                        ay.majorGrid = true;
                    }
                    if (ay.name === undefined) {
                        ay.name = 'axisY';
                    }
                    ay.majorTickMarks = TickMark.None;
                    if (ay.position === undefined) {
                        ay.position = Position.Left;
                    }
                    ay._axisType = AxisType.Y;
                    ay._chart = this;
                }
                this.endUpdate();
            }
        }

        /**
         * Gets the collection of @see:PlotArea objects.
         */
        get plotAreas(): PlotAreaCollection {
            return this._pareas;
        }

        /**
         * Gets or sets the name of the property that contains the Y values.
         */
        get binding(): string {
            return this._binding;
        }
        set binding(value: string) {
            if (value != this._binding) {
                this._binding = asString(value, true);
                this.invalidate();
            }
        }

        /**
         * Gets or sets the name of the property that contains the X data values.
         */
        get bindingX(): string {
            return this._bindingX;
        }
        set bindingX(value: string) {
            if (value != this._bindingX) {
                this._bindingX = asString(value, true);
                this._bindChart();
            }
        }

        /**
         * Gets or sets the size of the symbols used for all Series objects in this @see:FlexChart.
         *
         * This property may be overridden by the symbolSize property on each @see:Series object.
         */
        get symbolSize(): number {
            return this._symbolSize;
        }
        set symbolSize(value: number) {
            if (value != this._symbolSize) {
                this._symbolSize = asNumber(value, false, true);
                this.invalidate();
            }
        }

        /**
         * Gets or sets a value that determines whether to interpolate 
         * null values in the data.
         *
         * If true, the chart interpolates the value of any missing data
         * based on neighboring points. If false, it leaves a break in
         * lines and areas at the points with null values.
         */
        get interpolateNulls(): boolean {
            return this._interpolateNulls;
        }
        set interpolateNulls(value: boolean) {
            if (value != this._interpolateNulls) {
                this._interpolateNulls = asBoolean(value);
                this.invalidate();
            }
        }

        /**
         * Gets or sets a value indicating whether clicking legend items toggles the
         * series visibility in the chart.
         */
        get legendToggle(): boolean {
            return this._legendToggle;
        }
        set legendToggle(value: boolean) {
            if (value != this._legendToggle) {
                this._legendToggle = asBoolean(value);
            }
        }

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
        get tooltip(): ChartTooltip {
            return this._tooltip;
        }

        /**
         * Gets or sets the point data label.
         */
        get dataLabel(): DataLabel {
            return this._lbl;
        }
        set dataLabel(value: DataLabel) {
            if (value != this._lbl) {
                this._lbl = asType(value, DataLabel);
                if (this._lbl) {
                    this._lbl._chart = this;
                }
            }
        }

        /**
         * Gets or sets the selected chart series.
         */
        get selection(): SeriesBase {
            return this._selection;
        }
        set selection(value: SeriesBase) {
            if (value != this._selection) {
                this._selection = asType(value, SeriesBase, true);
                this.invalidate();
            }
        }

        /**
         * Occurs when the series visibility changes, for example when the legendToggle
         * property is set to true and the user clicks the legend.
        */
        seriesVisibilityChanged = new Event();

        /**
         * Raises the @see:seriesVisibilityChanged event.
         *
         * @param e The @see:SeriesEventArgs object that contains the event data.
         */
        onSeriesVisibilityChanged(e: SeriesEventArgs) {
            this.seriesVisibilityChanged.raise(this, e);
        }

        /**
         * Gets a @see:HitTestInfo object with information about the specified point.
         *
         * @param pt The point to investigate, in window coordinates.
         * @param y The Y coordinate of the point (if the first parameter is a number).
         * @return A HitTestInfo object with information about the point.
         */
        hitTest(pt: any, y?: number): HitTestInfo {
            // control coords
            var cpt = this._toControl(pt, y);

            var hti: HitTestInfo = new HitTestInfo(this, cpt);

            var si: number = null;

            if (FlexChart._contains(this._rectHeader, cpt)) {
                hti._chartElement = ChartElement.Header;
            } else if (FlexChart._contains(this._rectFooter, cpt)) {
                hti._chartElement = ChartElement.Footer;
            } else if (FlexChart._contains(this._rectLegend, cpt)) {
                hti._chartElement = ChartElement.Legend;

                si = this.legend._hitTest(cpt);
                if (si !== null && si >= 0 && si < this.series.length) {
                    hti._setData(this.series[si]);
                }
            } else if (FlexChart._contains(this._rectChart, cpt)) {
                var lblArea = this._hitTestLabels(cpt);
                if (lblArea) {
                    hti._chartElement = ChartElement.DataLabel;
                    hti._dist = 0;
                    hti._setDataPoint(lblArea.tag);
                } else {
                    var hr = this._hitTester.hitTest(cpt);

                    // custom series hit test
                    var ht: HitTestInfo = null;
                    var htsi = null;
                    for (var i = this.series.length - 1; i >= 0; i--) {
                        if (this.series[i].hitTest !== Series.prototype.hitTest) {
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
                        } else if (ht && ht.distance == hr.distance && htsi > hr.area.tag.seriesIndex) {
                            hti = ht;
                        } else {
                            hti._setDataPoint(hr.area.tag);
                            hti._dist = hr.distance;
                        }
                    } else if (ht) {
                        hti = ht;
                    }

                    if (FlexChart._contains(this.axisX._axrect, cpt)) {
                        hti._chartElement = ChartElement.AxisX;
                    } else if (FlexChart._contains(this.axisY._axrect, cpt)) {
                        hti._chartElement = ChartElement.AxisY;
                    } else if (FlexChart._contains(this._plotRect, cpt)) {
                        hti._chartElement = ChartElement.PlotArea;
                    } else if (FlexChart._contains(this._rectChart, cpt)) {
                        hti._chartElement = ChartElement.ChartArea;
                    }
                }
            }
            else {
                hti._chartElement = ChartElement.None;
            }

            return hti;
        }

        /**
         * Converts a @see:Point from control coordinates to chart data coordinates.
         *
         * @param pt The point to convert, in control coordinates.
         * @param y The Y coordinate of the point (if the first parameter is a number).
         * @return The point in chart data coordinates.
         */
        pointToData(pt: any, y?: number): Point {
            if (isNumber(pt) && isNumber(y)) { // accept hitTest(x, y) as well
                pt = new Point(pt, y);
            } if (pt instanceof MouseEvent) {
                pt = new Point(pt.pageX, pt.pageY);
                pt = this._toControl(pt);
            }
            else {
                pt = pt.clone();
            }

            pt.x = this.axisX.convertBack(pt.x);
            pt.y = this.axisY.convertBack(pt.y);
            return pt;
        }

        /**
         * Converts a @see:Point from data coordinates to control coordinates.
         *
         * @param pt @see:Point in data coordinates, or X coordinate of a point in data coordinates.
         * @param y Y coordinate of the point (if the first parameter is a number).
         * @return The @see:Point in control coordinates.
         */
        dataToPoint(pt: any, y?: number): Point {
            if (isNumber(pt) && isNumber(y)) { // accept (x, y) as well
                pt = new Point(pt, y);
            }
            asType(pt, Point);
            var cpt = pt.clone();
            cpt.x = this.axisX.convert(cpt.x);
            cpt.y = this.axisY.convert(cpt.y);

            return cpt;
        }

        //--------------------------------------------------------------------------
        // implementation

        // method used in JSON-style initialization
        _copy(key: string, value: any): boolean {
            if (key == 'series') {
                var arr = asArray(value);
                for (var i = 0; i < arr.length; i++) {
                    var s = this._createSeries();
                    wijmo.copy(s, arr[i]);
                    this.series.push(s);
                }
                return true;
            }
            return false;
        }

        _createSeries(): SeriesBase {
            return new Series();
        }

        _clearCachedValues() {
            for (var i = 0; i < this._series.length; i++) {
                var series = <Series>this._series[i];
                if (series.itemsSource == null)
                    series._clearValues();
            }
        }

        _performBind() {
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
                            if (isNumber(x)) {
                                this._xvals.push(asNumber(x));
                                this._xDataType = DataType.Number;
                            } else if (isDate(x)) {
                                this._xvals.push(asDate(x).valueOf());
                                this._xDataType = DataType.Date;
                            }
                            this._xlabels.push(item[this._bindingX]);
                        }
                    }
                    if (this._xvals.length == len) {
                        this._xlabels.splice(0);
                    } else {
                        this._xvals.splice(0);
                    }
                }
            }
        }

        _hitTestSeries(pt: Point, seriesIndex: number): HitTestInfo {
            // control coords
            //var cpt = pt.clone();
            //var host = this.hostElement;

            //cpt.x -= host.offsetLeft;
            //cpt.y -= host.offsetTop;
            var cpt = this._toControl(pt);

            var hti: HitTestInfo = new HitTestInfo(this, cpt);
            var si = seriesIndex;
            var hr = this._hitTester.hitTestSeries(cpt, seriesIndex);

            if (hr && hr.area) {
                hti._setDataPoint(hr.area.tag);
                hti._chartElement = ChartElement.PlotArea;
                hti._dist = hr.distance;
            }

            return hti;
        }

        // hitTest including lines
        _hitTestData(pt: any): HitTestInfo {
            var cpt = this._toControl(pt);
            var hti = new HitTestInfo(this, cpt);
            var hr = this._hitTester.hitTest(cpt, true);

            if (hr && hr.area) {
                hti._setDataPoint(hr.area.tag);
                hti._dist = hr.distance;
            }

            return hti;
        }

        _hitTestLabels(pt: Point): _IHitArea {
            var area: _IHitArea = null;

            var len = this._lblAreas.length;
            for (var i = 0; i < len; i++) {
                if (this._lblAreas[i].contains(pt)) {
                    area = this._lblAreas[i];
                    break;
                }
            }

            return area;
        }

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

        private static _dist2(p1: Point, p2: Point): number {
            var dx = p1.x - p2.x;
            var dy = p1.y - p2.y;
            return dx * dx + dy * dy;
        }

        // line p1-p2 to point p0

        /*static _dist(p0: Point, p1: Point, p2: Point): number {
            var dx = p2.x - p1.x;
            var dy = p2.y - p1.y;
            return Math.sqrt(Math.abs(dy * p0.x - dx * p0.y - p1.x * p2.y + p2.x * p1.y) / Math.sqrt(dx * dx + dy * dy));
        }*/

        static _dist(p0: Point, p1: Point, p2: Point): number {
            return Math.sqrt(FlexChart._distToSegmentSquared(p0, p1, p2));
        }

        static _distToSegmentSquared(p: Point, v: Point, w: Point): number {
            var l2 = FlexChart._dist2(v, w);
            if (l2 == 0)
                return FlexChart._dist2(p, v);
            var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
            if (t < 0)
                return FlexChart._dist2(p, v);
            if (t > 1)
                return FlexChart._dist2(p, w);
            return FlexChart._dist2(p, new Point(v.x + t * (w.x - v.x), v.y + t * (w.y - v.y)));
        }

        _isRotated(): boolean {
            return this._getChartType() == ChartType.Bar ? !this._rotated : this._rotated;
        }

        _plotrectId: string;

        _getChartType(): ChartType {
            return null;
        }

        _render(engine: IRenderEngine, applyElement = true) {
            var el = this.hostElement;

            //  jQuery
            // var w = $(el).width();//el.clientWidth - el.clientLeft;
            // var h = $(el).height(); //el.clientHeight - el.clientTop;

            var sz = this._getHostSize();
            var w = sz.width,
                h = sz.height;

            if (w == 0 || isNaN(w)) {
                w = FlexChart._WIDTH;
            }
            if (h == 0 || isNaN(h)) {
                h = FlexChart._HEIGHT;
            }
            //

            var hostSz = new Size(w, h);
            engine.beginRender();

            if (w > 0 && h > 0) {
                engine.setViewportSize(w, h);
                this._hitTester.clear();

                var legend = this.legend;
                var lsz: Size;
                var tsz: Size;
                var lpos: Point;
                var rect = new Rect(0, 0, w, h);

                this._rectChart = rect.clone();

                engine.startGroup(FlexChart._CSS_HEADER);
                rect = this._drawTitle(engine, rect, this.header, this.headerStyle, false);
                engine.endGroup();

                engine.startGroup(FlexChart._CSS_FOOTER);
                rect = this._drawTitle(engine, rect, this.footer, this.footerStyle, true);
                engine.endGroup();

                w = rect.width;
                h = rect.height;
                var legpos = legend._getPosition(w, h);
                lsz = legend._getDesiredSize(engine, legpos, w, h);
                switch (legpos) {
                    case Position.Right:
                        w -= lsz.width;
                        lpos = new Point(w, rect.top + 0.5 * (h - lsz.height));
                        break;
                    case Position.Left:
                        rect.left += lsz.width;
                        w -= lsz.width;
                        lpos = new Point(0, rect.top + 0.5 * (h - lsz.height));
                        break;
                    case Position.Top:
                        h -= lsz.height;
                        lpos = new Point(0.5 * (w - lsz.width), rect.top);
                        rect.top += lsz.height;
                        break;
                    case Position.Bottom:
                        h -= lsz.height;
                        lpos = new Point(0.5 * (w - lsz.width), rect.top + h);
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

                this._dataInfo.analyse(this._series, isRotated, plotter.stacking, this._xvals.length > 0 ? this._xvals : null,
                    this.axisX.logBase > 0, this.axisY.logBase > 0);

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
                engine.startGroup(FlexChart._CSS_PLOT_AREA);
                engine.fill = 'transparent';
                engine.stroke = null;
                var plen = this.plotAreas.length;
                if (plen > 0) {
                    for (var i = 0; i < this.plotAreas.length; i++) {
                        var pa = <PlotArea>this.plotAreas[i];
                        pa._render(engine);
                    }
                } else {
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
                        } else {
                            groups[axid].count += 1;
                        }
                    }
                    else {
                        var plotter = this._getPlotter(series);
                        plotter.seriesCount++;
                        }
                    }
                }

                this.onRendering(new RenderEventArgs(engine));

                //Don't draw axis for funnel chart.
                if (this._getChartType() !== ChartType.Funnel) {
                    for (var i = 0; i < axes.length; i++) {
                        var ax: Axis = axes[i], ele;
                        if (ax.axisType == AxisType.X) {
                            ele = engine.startGroup(FlexChart._CSS_AXIS_X);
                        } else {
                            ele = engine.startGroup(FlexChart._CSS_AXIS_Y);
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

                    if (vis == SeriesVisibility.Visible || vis == SeriesVisibility.Plot) {
                        var group = groups[axisY._uniqueId];
                        if (group) {
                            if (series.rendering.hasHandlers) {
                                series.onRendering(engine);
                            } else {
                                plotter.plotSeries(engine, axisX, axisY, series, this, group.index, group.count);
                            }
                            group.index++;
                        } else {
                            if (series.rendering.hasHandlers) {
                                series.onRendering(engine);
                            } else {

                                plotter.plotSeries(engine, axisX, axisY, series, this, plotter.seriesIndex, plotter.seriesCount);
                                plotter.seriesIndex++;
                            }
                        }
                    }
                    engine.endGroup();
                }
                engine.endGroup();

                this._lblAreas = [];
                if (this.dataLabel.content && this.dataLabel.position != LabelPosition.None) {
                    this._renderLabels(engine);
                }

                if (lsz) {
                    this._legendHost = engine.startGroup(FlexChart._CSS_LEGEND);
                    this._rectLegend = new Rect(lpos.x, lpos.y, lsz.width, lsz.height);
                    engine.textFill = FlexChart._FG;
                    this.legend._render(engine, lpos, legpos, lsz.width, lsz.height);
                    engine.textFill = null;
                    engine.endGroup();
                } else {
                    this._legendHost = null;
                    this._rectLegend = null;
                }

                this._highlightCurrent();
                this.onRendered(new RenderEventArgs(engine));
            }

            engine.endRender();
        }

        private _renderLabels(engine: IRenderEngine) {
            var srs = this.series;
            var slen = srs.length;
            engine.stroke = 'null';
            engine.fill = 'transparent';
            engine.strokeWidth = 1;
            var gcss = 'wj-data-labels';

            engine.startGroup(gcss);

            for (var i = 0; i < slen; i++) {
                var ser = <SeriesBase>srs[i];
                var smap = this._hitTester._map[i];
                if (smap) {
                    ser._renderLabels(engine, smap, this, this._lblAreas);
                }
            }
            engine.endGroup();
        }

        private _getAxes(): Axis[] {
            var axes = [this.axisX, this.axisY];
            var len = this.series.length;
            for (var i = 0; i < len; i++) {
                var ser = <Series>this.series[i];
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
        }

        private _clearPlotters() {
            var len = this._plotters.length;
            for (var i = 0; i < len; i++)
                this._plotters[i].clear();
        }

        _initPlotter(plotter: _IPlotter) {
            plotter.chart = this;
            plotter.dataInfo = this._dataInfo;
            plotter.hitTester = this._hitTester;
            this._plotters.push(plotter);
        }

        private get _barPlotter() {
            if (this.__barPlotter === null) {
                this.__barPlotter = new _BarPlotter();
                this._initPlotter(this.__barPlotter);
            }
            return this.__barPlotter;
        }

        private get _linePlotter() {
            if (this.__linePlotter === null) {
                this.__linePlotter = new _LinePlotter();
                this._initPlotter(this.__linePlotter);
            }
            return this.__linePlotter;
        }

        private get _areaPlotter() {
            if (this.__areaPlotter === null) {
                this.__areaPlotter = new _AreaPlotter();
                this._initPlotter(this.__areaPlotter);
            }
            return this.__areaPlotter;
        }

        private get _bubblePlotter() {
            if (this.__bubblePlotter === null) {
                this.__bubblePlotter = new _BubblePlotter();
                this._initPlotter(this.__bubblePlotter);
            }
            return this.__bubblePlotter;
        }

        private get _financePlotter() {
            if (this.__financePlotter === null) {
                this.__financePlotter = new _FinancePlotter();
                this._initPlotter(this.__financePlotter);
            }
            return this.__financePlotter;
        }

        private get _funnelPlotter() {
            if (this.__funnelPlotter === null) {
                this.__funnelPlotter = new _FunnelPlotter();
                this._initPlotter(this.__funnelPlotter);
            }
            return this.__funnelPlotter;
        }

        private get _boxPlotter() {
            if (this.__boxPlotter === null) {
                this.__boxPlotter = new _BoxPlotter();
                this._initPlotter(this.__boxPlotter);
            }
            return this.__boxPlotter;
        }

        _getPlotter(series: SeriesBase): _IPlotter {
            var chartType = this._getChartType();
            var isSeries = false;
            if (series) {
                var stype = series._getChartType();
                if (stype !== null && stype !== undefined && stype != chartType) {
                    chartType = stype;
                    isSeries = true;
                }
            }

            var plotter: _IPlotter;
            switch (chartType) {
                case ChartType.Column:
                    this._barPlotter.isVolume = false;
                    this._barPlotter.width = 0.7;
                    plotter = this._barPlotter;
                    break;
                case ChartType.Bar:
                    this._barPlotter.rotated = !this._rotated;
                    this._barPlotter.isVolume = false;
                    this._barPlotter.width = 0.7;
                    plotter = this._barPlotter;
                    break;
                case ChartType.Line:
                    this._linePlotter.hasSymbols = false;
                    this._linePlotter.hasLines = true;
                    this._linePlotter.isSpline = false;
                    plotter = this._linePlotter;
                    break;
                case ChartType.Scatter:
                    this._linePlotter.hasSymbols = true;
                    this._linePlotter.hasLines = false;
                    this._linePlotter.isSpline = false;
                    plotter = this._linePlotter;
                    break;
                case ChartType.LineSymbols:
                    this._linePlotter.hasSymbols = true;
                    this._linePlotter.hasLines = true;
                    this._linePlotter.isSpline = false;
                    plotter = this._linePlotter;
                    break;
                case ChartType.Area:
                    this._areaPlotter.isSpline = false;
                    plotter = this._areaPlotter;
                    break;
                case ChartType.Bubble:
                    plotter = this._bubblePlotter;
                    break;
                case ChartType.Candlestick:
                    var fp = this._financePlotter;
                    fp.isCandle = true;
                    fp.isEqui = false;
                    fp.isArms = false;
                    fp.isVolume = false;
                    plotter = fp;
                    break;
                case ChartType.HighLowOpenClose:
                    var fp = this._financePlotter;
                    fp.isCandle = false;
                    fp.isEqui = false;
                    fp.isArms = false;
                    fp.isVolume = false;
                    plotter = fp;
                    break;
                case ChartType.Spline:
                    this._linePlotter.hasSymbols = false;
                    this._linePlotter.hasLines = true;
                    this._linePlotter.isSpline = true;
                    plotter = this._linePlotter;
                    break;
                case ChartType.SplineSymbols:
                    this._linePlotter.hasSymbols = true;
                    this._linePlotter.hasLines = true;
                    this._linePlotter.isSpline = true;
                    plotter = this._linePlotter;
                    break;
                case ChartType.SplineArea:
                    this._areaPlotter.isSpline = true;
                    plotter = this._areaPlotter;
                    break;
                case ChartType.Funnel:
                    plotter = this._funnelPlotter;
                    break;
                case ChartType.BoxPlot:
                    this._boxPlotter.width = 0.8;
                    plotter = this._boxPlotter;
                    break;
                default:
                    throw 'Invalid chart type.';
            }

            plotter.rotated = this._rotated;
            if (chartType == ChartType.Bar)
                plotter.rotated = !plotter.rotated;
            if (isSeries) {
                plotter.rotated = this._isRotated();
            }

            return plotter;
        }

        _layout(rect: Rect, size: Size, engine: IRenderEngine) {
            if (this.plotAreas.length > 0) {
                this._layoutMultiple(rect, size, engine);
            } else {
                this._layoutSingle(rect, size, engine);
            }
        }

        private _layoutSingle(rect: Rect, size: Size, engine: IRenderEngine) {
            var w = rect.width;
            var h = rect.height;
            var mxsz = new Size(w, 0.75 * h);
            var mysz = new Size(h, 0.75 * w);

            var left = 0, top = 0, right = w, bottom = h;
            var l0 = 0, t0 = 0, r0 = w, b0 = h;

            var axes = this._getAxes();

            for (var i = 0; i < axes.length; i++) {
                var ax: Axis = axes[i];
                var origin = ax.origin;

                if (ax.axisType == AxisType.X) {
                    var ah = ax._getHeight(engine, w);

                    if (ah > mxsz.height)
                        ah = mxsz.height;

                    ax._desiredSize = new Size(mxsz.width, ah);

                    var hasOrigin = ax._hasOrigin =
                        isNumber(origin) && origin > this.axisY._getMinNum() && origin < this.axisY._getMaxNum();

                    if (ax.position == Position.Bottom) {
                        left = Math.max(left, ax._annoSize.width * 0.5);
                        right = Math.min(right, w - ax._annoSize.width * 0.5);

                        if (hasOrigin) {
                            var yorigin = this._convertY(origin, t0, b0);
                            b0 = b0 - Math.max(0, (yorigin + ah) - b0);
                        } else {
                            b0 = b0 - ah;
                        }
                    } else if (ax.position == Position.Top) {
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
                } else if (ax.axisType == AxisType.Y) {
                    var ah = ax._getHeight(engine, h);
                    if (ah > mysz.height) {
                        ah = mysz.height;
                    }
                    ax._desiredSize = new Size(mysz.width, ah);

                    var hasOrigin = ax._hasOrigin =
                        isNumber(origin) && origin > this.axisX._getMinNum() && origin < this.axisX._getMaxNum();

                    if (ax.position == Position.Left) {
                        top = Math.max(top, ax._annoSize.width * 0.5);
                        bottom = Math.min(bottom, h - ax._annoSize.width * 0.5);

                        if (hasOrigin) {
                            var xorigin = this._convertX(origin, l0, r0);
                            l0 += Math.max(0, l0 - (xorigin - ah));
                        } else {
                            l0 += ah;
                        }
                    } else if (ax.position == Position.Right) {
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
            } else {
                left = l0 = Math.max(left, l0) + rect.left;
            }

            if (!isNaN(margins.right)) {
                right = r0 = size.width - margins.right;
            } else {
                right = r0 = Math.min(right, r0) + rect.left;
            }

            if (!isNaN(margins.top)) {
                top = t0 = margins.top;
            } else {
                top = t0 = Math.max(top, t0) + rect.top;
            }
            if (!isNaN(margins.bottom)) {
                bottom = b0 = size.height - margins.bottom;
            } else {
                bottom = b0 = Math.min(bottom, b0) + rect.top;
            }

            w = Math.max(1, right - left);
            h = Math.max(1, bottom - top);
            this._plotRect = new Rect(left, top, w, h);

            engine.stroke = null;
            //engine.setFill(this.plotFill);

            for (var i = 0; i < axes.length; i++) {
                var ax: Axis = axes[i];
                //ax._plot = _plot0;
                var origin = ax.origin;

                if (ax.axisType == AxisType.X) {
                    var axr: Rect;

                    if (!ax._hasOrigin) {
                        if (ax.position == Position.Bottom) {
                            axr = new Rect(left, b0, w, ax._desiredSize.height);
                            b0 += ax._desiredSize.height;
                        } else if (ax.position == Position.Top) {
                            axr = new Rect(left, t0 - ax._desiredSize.height, w, ax._desiredSize.height);
                            t0 -= ax._desiredSize.height;
                        }
                        else {
                            axr = new Rect(left, t0, w, 1);
                        }
                    } else {
                        var yorigin = this._convertY(origin, this._plotRect.top, this._plotRect.bottom);
                        if (ax.position == Position.Bottom) {
                            axr = new Rect(left, yorigin, w, ax._desiredSize.height);
                            b0 += Math.max(0, axr.bottom - this._plotRect.bottom);// ax.DesiredSize.Height;
                        } else if (ax.position == Position.Top) {
                            axr = new Rect(left, yorigin - ax._desiredSize.height, w, ax._desiredSize.height);
                            t0 -= Math.max(0, this._plotRect.top - axr.top); // ax.DesiredSize.Height;
                        }
                    }
                    ax._layout(axr, this._plotRect);
                    //ax.render(engine, axr, this.plotRect);
                } else if (ax.axisType == AxisType.Y) {
                    var ayr: Rect;

                    if (!ax._hasOrigin) {
                        if (ax.position == Position.Left) {
                            ayr = new Rect(l0 - ax._desiredSize.height, top, h, ax._desiredSize.height);
                            l0 -= ax._desiredSize.height;
                        }
                        else if (ax.position == Position.Right) {
                            ayr = new Rect(r0, top, h, ax._desiredSize.height);
                            r0 += ax._desiredSize.height;
                        }
                        else {
                            ayr = new Rect(l0, top, h, 1);
                        }
                    } else {
                        var xorigin = this._convertX(origin, this._plotRect.left, this._plotRect.right);

                        if (ax.position == Position.Left) {
                            ayr = new Rect(xorigin - ax._desiredSize.height, top, h, ax._desiredSize.height);
                            l0 -= ax._desiredSize.height;
                        }
                        else if (ax.position == Position.Right) {
                            ayr = new Rect(xorigin, top, h, ax._desiredSize.height);
                            r0 += ax._desiredSize.height;
                        }
                    }

                    ax._layout(ayr, this._plotRect);
                    //ax.render(engine, ayr, this.plotRect);
                }
            }
        }

        private _layoutMultiple(rect: Rect, size: Size, engine: IRenderEngine) {
            var w = rect.width;
            var h = rect.height;

            var cols = [],
                rows = [];

            var axes = this._getAxes();
            var cnt = axes.length;

            for (var i = 0; i < cnt; i++) {
                var ax = <Axis>axes[i];
                ax._plotrect = null;
                if (ax.axisType == AxisType.X) {
                    var col = ax.plotArea ? ax.plotArea.column : 0;
                    while (cols.length <= col)
                        cols.push(new _AreaDef());
                    cols[col].axes.push(ax);
                }
                else if (ax.axisType == AxisType.Y) {
                    var row = ax.plotArea ? ax.plotArea.row : 0;
                    while (rows.length <= row)
                        rows.push(new _AreaDef());
                    rows[row].axes.push(ax);
                }
            }

            var ncols = cols.length,
                nrows = rows.length;

            var mxsz = new Size(w, 0.3 * h),
                mysz = new Size(h, 0.3 * w),
                left = 0,
                top = 0,
                right = w,
                bottom = h;

            for (var icol = 0; icol < ncols; icol++) {
                var ad = <_AreaDef>cols[icol];
                ad.right = w;
                ad.bottom = h;
                for (var i = 0; i < ad.axes.length; i++) {
                    var ax = <Axis>ad.axes[i];
                    var ah = ax._getHeight(engine, ax.axisType == AxisType.X ? w : h);// .GetSize(GetItems(render, ax), false);
                    if (ah > mxsz.height)
                        ah = mxsz.height;
                    var szx = new Size(mxsz.width, ah);
                    ax._desiredSize = szx;

                    if (icol == 0)
                        ad.left = Math.max(ad.left, ax._annoSize.width * 0.5);
                    if (icol == ncols - 1)
                        ad.right = Math.min(ad.right, w - ax._annoSize.width * 0.5);

                    if (ax.position == Position.Bottom) //if (ax.IsNear)
                        ad.bottom -= szx.height;
                    else if (ax.position == Position.Top)  // (ax.IsFar)
                        ad.top += szx.height;
                }
            }

            for (var irow = 0; irow < nrows; irow++) {
                var ad = <_AreaDef>rows[irow];
                ad.right = w;
                ad.bottom = h;
                for (var i = 0; i < ad.axes.length; i++) {
                    var ax = <Axis>ad.axes[i];
                    var szy = new Size(mysz.width, ax._getHeight(engine, ax.axisType == AxisType.X ? w : h));
                    if (szy.height > mysz.height)
                        szy.height = mysz.height;
                    ax._desiredSize = szy;

                    if (irow == 0)
                        ad.top = Math.max(ad.top, ax._annoSize.width * 0.5);
                    if (irow == nrows - 1)
                        ad.bottom = Math.min(ad.bottom, h - ax._annoSize.width * 0.5);

                    if (ax.position == Position.Left)  //(ax.IsNear)
                        ad.left += szy.height;
                    else if (ax.position == Position.Right) // (ax.IsFar)
                        ad.right -= szy.height;
                }
            }

            var l0 = 0,
                t0 = 0,
                r0 = w,
                b0 = h;

            for (var icol = 0; icol < ncols; icol++) {
                var ad = <_AreaDef>cols[icol];
                l0 = Math.max(l0, ad.left); t0 = Math.max(t0, ad.top);
                r0 = Math.min(r0, ad.right); b0 = Math.min(b0, ad.bottom);
            }
            for (var irow = 0; irow < nrows; irow++) {
                var ad = <_AreaDef>rows[irow];
                l0 = Math.max(l0, ad.left); t0 = Math.max(t0, ad.top);
                r0 = Math.min(r0, ad.right); b0 = Math.min(b0, ad.bottom);
            }

            //double w = 0, h = 0;
            //AdjustMargins(arrangeSize, ref left, ref right, ref top, ref bottom, ref w, ref h, ref l0, ref r0, ref t0, ref b0);

            l0 = left = /*(margin.Left != 0) ? margin.Left :*/ Math.max(left, l0);
            r0 = right = /*(margin.Right != 0) ? arrangeSize.Width - margin.Right :*/ Math.min(right, r0);
            t0 = top = /*(margin.Top != 0) ? margin.Top :*/ Math.max(top, t0);
            b0 = bottom = /*(margin.Bottom != 0) ? arrangeSize.Height - margin.Bottom :*/ Math.min(bottom, b0);


            //_plot = _plot0 = new Rect(left, top, w, h);
            this._plotRect = new Rect(left, top, right - left, bottom - top);
            var plot0 = this._plotRect.clone();// new Rect(left, top, w, h);

            //var wcol = w / ncols;
            //var hrow = h / nrows;

            var x = left;
            var widths = this.plotAreas._calculateWidths(this._plotRect.width, ncols);

            for (var icol = 0; icol < ncols; icol++) {
                b0 = bottom; t0 = top;
                var ad = <_AreaDef>cols[icol];
                var wcol = widths[icol];
                for (var i = 0; i < ad.axes.length; i++) {
                    var ax = ad.axes[i];
                    var axplot = new Rect(x, plot0.top, wcol, plot0.height);

                    var axr: Rect;// = new Rect();
                    if (ax.position == Position.Bottom) {
                        axr = new Rect(x, b0, wcol, ax._desiredSize.height);
                        b0 += ax._desiredSize.height;
                    }
                    else if (ax.position == Position.Top) {
                        axr = new Rect(x, t0 - ax._desiredSize.height, wcol, ax._desiredSize.height);
                        t0 -= ax._desiredSize.height;
                    }
                    ax._layout(axr, axplot);
                }

                for (var i = 0; i < this.plotAreas.length; i++) {
                    var pa = <PlotArea>this.plotAreas[i];
                    if (pa.column == icol)
                        pa._setPlotX(x, wcol);
                }

                x += wcol;
            }

            var y = top;//bottom;
            var heights = this.plotAreas._calculateHeights(this._plotRect.height, nrows);

            for (var irow = 0; irow < nrows; irow++) {
                l0 = left; r0 = right;
                var ad = <_AreaDef>rows[irow];
                var hrow = heights[irow];
                //y -= hrow;

                for (var i = 0; i < ad.axes.length; i++) {
                    var ax = ad.axes[i];
                    var axplot = new Rect(plot0.left, y, plot0.width, hrow);
                    if (ax._plotrect) {
                        axplot.left = ax._plotrect.left;
                        axplot.width = ax._plotrect.width;
                    } else if(widths && widths.length > 0){
                        axplot.width = widths[0];
                    }
                    var ayr: Rect;

                    if (ax.position == Position.Left) {
                        ayr = new Rect(l0 - ax._desiredSize.height, y, hrow, ax._desiredSize.height);
                        l0 -= ax._desiredSize.height;
                    }
                    else if (ax.position == Position.Right) {
                        ayr = new Rect(r0, y, hrow, ax._desiredSize.height);
                        r0 += ax._desiredSize.height;
                    }

                    ax._layout(ayr, axplot);
                }

                for (var i = 0; i < this.plotAreas.length; i++) {
                    var pa = <PlotArea>this.plotAreas[i];
                    if (pa.row == irow)
                        pa._setPlotY(y, hrow);
                }

                y += hrow;
            }
        }

        //---------------------------------------------------------------------

        private _convertX(x: number, left: number, right: number) {
            var ax = this.axisX;
            if (ax.reversed)
                return right - (right - left) * (x - ax._getMinNum()) / (ax._getMaxNum() - ax._getMinNum());
            else
                return left + (right - left) * (x - ax._getMinNum()) / (ax._getMaxNum() - ax._getMinNum());
        }

        private _convertY(y: number, top: number, bottom: number): number {
            var ay = this.axisY;
            if (ay.reversed)
                return top + (bottom - top) * (y - ay._getMinNum()) / (ay._getMaxNum() - ay._getMinNum());
            else
                return bottom - (bottom - top) * (y - ay._getMinNum()) / (ay._getMaxNum() - ay._getMinNum());
        }

        // tooltips

        _getLabelContent(ht: HitTestInfo, content: any): string {
            //var tc = this._tooltip.content;
            if (isString(content)) {
                return this._keywords.replace(content, ht);
            } else if (isFunction(content)) {
                return content(ht);
            }

            return null;
        }


        //---------------------------------------------------------------------
        // selection
        private _select(newSelection: SeriesBase, pointIndex: number) {
            var raiseSelectionChanged = false;
            if (newSelection != this._selection || pointIndex != this._selectionIndex) {
                raiseSelectionChanged = true;
            }
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
            if (raiseSelectionChanged) {
                this.onSelectionChanged();
            }
        }

        private _highlightCurrent() {
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
        }

        private _highlight(series: SeriesBase, selected: boolean, pointIndex: number) {

            // check that the selection is a Series object (or null)
            series = asType(series, SeriesBase, true);

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
                } else {
                    gs.parentNode.insertBefore(gs, gs.parentNode.childNodes.item(index));
                }

                var found = this._find(gs, ['rect', 'ellipse', 'polyline', 'polygon', 'line', 'path']);
                this._highlightItems(found, FlexChart._CSS_SELECTION, selected);

                if (series.legendElement) {
                    // jQuery
                    // var ls = $(series.legendElement);
                    // this._highlightItems(ls.find('rect'), FlexChart._CSS_SELECTION, selected);
                    // this._highlightItems(ls.find('ellipse'), FlexChart._CSS_SELECTION, selected);
                    // this._highlightItems(ls.find('line'), FlexChart._CSS_SELECTION, selected);

                    this._highlightItems(this._find(series.legendElement, ['rect', 'ellipse', 'line']), FlexChart._CSS_SELECTION, selected);
                }

            } else if (this.selectionMode == SelectionMode.Point) {
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
                            this._highlightItems([pel], FlexChart._CSS_SELECTION, selected);
                        }
                        var found = this._find(pel, ['line', 'rect', 'ellipse', 'path', 'polygon']);
                        this._highlightItems(found, FlexChart._CSS_SELECTION, selected);
                    }
                } else {
                    gs.parentNode.insertBefore(gs, gs.parentNode.childNodes.item(index));
                    var found = this._find(gs, ['rect', 'ellipse', 'line', 'path', 'polygon']);
                    this._highlightItems(found, FlexChart._CSS_SELECTION, selected);
                }

            }
        }

        // aux axes
        _updateAuxAxes(axes: Axis[], isRotated: boolean) {
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
                var dataMin,
                    dataMax;
                for (var iser = 0; iser < slist.length; iser++) {
                    var rect = slist[iser].getDataRect() || slist[iser]._getDataRect();
                    if (rect) {
                        if ((ax.axisType == AxisType.X && !isRotated) || (ax.axisType == AxisType.Y && isRotated)) {
                            if (dataMin === undefined || rect.left < dataMin) {
                                dataMin = rect.left;
                            }
                            if (dataMax === undefined || rect.right > dataMax) {
                                dataMax = rect.right;
                            }
                        } else {
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
                    dtype = DataType.Number;
                }

                axes[i]._updateActualLimits( dtype, dataMin, dataMax);
            }

        }

        //---------------------------------------------------------------------
        // tools

        static _contains(rect: Rect, pt: Point): boolean {
            if (rect && pt) {
                return pt.x >= rect.left && pt.x <= rect.right && pt.y >= rect.top && pt.y <= rect.bottom;
            }

            return false;
        }

        static _intersects(rect1: Rect, rect2: Rect): boolean {
            if (rect1.left > rect2.right || rect1.right < rect2.left || rect1.top > rect2.bottom || rect1.bottom < rect2.top) {
                return false;
            }

            return true;
        }


        static _epoch = new Date(1899, 11, 30).getTime();
        static _msPerDay = 86400000;

        static _toOADate(date: Date): number {
            return date.valueOf();
            //return (date.getTime() - FlexChart._epoch) / FlexChart._msPerDay;
        }

        static _fromOADate(val: number): Date {
            return new Date(val);
            /*var dec = val - Math.floor(val);
            if (val < 0 && dec) {
                val = Math.floor(val) - dec;
            }
            return new Date(val * FlexChart._msPerDay + FlexChart._epoch);
            */
        }

        static _renderText(engine: IRenderEngine, text: string, pos: Point, halign, valign, className?: string, groupName?: string, style?: any, test?: any): Rect {
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

            var rect = new Rect(x, y - sz.height, sz.width, sz.height);
            if (test) {
                if (test(rect)) {
                    engine.drawString(text, new Point(x, y), className, style);
                    return rect;
                }
                else
                    return null;
            }
            else {
                engine.drawString(text, new Point(x, y), className, style);
                return rect;
            }
        }

        static _renderRotatedText(engine: IRenderEngine, text: string, pos: Point, halign, valign,
            center: Point, angle: number, className: string, style?: any) {
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

            engine.drawStringRotated(text, new Point(x, y), center, angle, className, style);
        }
        //
    }


    class _AreaDef {
        private _axes = new Array<Axis>();

        public get axes(): Array<Axis> {
            return this._axes;
        }

        public left = 0;
        public right = 0;
        public top = 0;
        public bottom = 0;
    }


    /**
     * Analyzes chart data.
     */
    export class _DataInfo {
        private minY: number;
        private maxY: number;
        private minX: number;
        private maxX: number;
        private minXp: number;
        private minYp: number;

        private dataTypeX: DataType;
        private dataTypeY: DataType;

        private stackAbs: { [key: number]: number } = {};
        private _xvals: Array<number> = null;

        private dx: number;

        constructor() {
        }

        analyse(seriesList: any, isRotated: boolean, stacking: Stacking, xvals: Array<number>, logx: boolean, logy: boolean) {
            this.minY = NaN;
            this.maxY = NaN;
            this.minX = NaN;
            this.maxX = NaN;
            this.minXp = NaN;
            this.minYp = NaN;
            this.dx = 0;

            var stackPos: { [key: number]: number } = {};
            var stackNeg: { [key: number]: number } = {};
            var stackAbs: { [key: number]: number } = {};

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
                var series = <Series>seriesList[i];
                var ctype = series._getChartType();
                var custom = series.chartType !== undefined;
                var vis = series.visibility;
                if (vis == SeriesVisibility.Hidden || vis == SeriesVisibility.Legend) {
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
                } else {
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

                            if (j > 0 && (!ctype || // only default or col/bar
                                ctype == ChartType.Column || ctype == ChartType.Bar)) {
                                var dx = Math.abs(val - xvalues[j - 1]);
                                if (!isNaN(dx) && dx>0 && (dx < this.dx || this.dx == 0)) {
                                    this.dx = dx;
                                }
                            }
                        }
                    }
                }
                var values = null,
                    customY = false;
                if (isRotated) {
                        customY = series._isCustomAxisX();
                        values = series.getValues(0);
                } else {
                        customY = series._isCustomAxisY();
                        values = series.getValues(0);
                    }

                if (values) {
                    if (!this.dataTypeY && !customY) {
                        this.dataTypeY = series.getDataType(0);
                    }

                    if (isNaN(this.minX)) {
                        this.minX = 0;
                    } else if (!xvalues && !xvals) {
                        this.minX = Math.min(this.minX, 0);
                    }

                    if (isNaN(this.maxX)) {
                        this.maxX = values.length - 1;
                    } else if (!xvalues && !xvals) {
                        this.maxX = Math.max(this.maxX, values.length - 1);
                    }

                    if (!customY) {
                        for (var j = 0; j < values.length; j++) {
                            var val = values[j];
                            var xval = xvalues ? asNumber(xvalues[j], true) : (xvals ? asNumber(xvals[j], true) : j);
                            if (wijmo.isArray(val)) {
                                //for BarPlot.
                                val.forEach(v => {
                                    this._parseYVal(v, xval, custom, stackAbs, stackPos, stackNeg);
                                });
                            } else {
                                this._parseYVal(val, xval, custom, stackAbs, stackPos, stackNeg);
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
            } else if (stacking == Stacking.Stacked100pc) {
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
        }

        _parseYVal(val, xval, custom, stackAbs, stackPos, stackNeg) {
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
                        } else {
                            stackPos[xval] += val;
                        }
                        if (isNaN(this.minYp) || this.minYp > val) {
                            this.minYp = val;
                        }
                    } else {
                        if (isNaN(stackNeg[xval])) {
                            stackNeg[xval] = val;
                        } else {
                            stackNeg[xval] += val;
                        }
                    }
                    if (isNaN(stackAbs[xval])) {
                        stackAbs[xval] = Math.abs(val);
                    } else {
                        stackAbs[xval] += Math.abs(val);
                    }
                }
            }
        }

        getMinY(): number {
            return this.minY;
        }

        getMaxY(): number {
            return this.maxY;
        }

        getMinX(): number {
            return this.minX;
        }

        getMaxX(): number {
            return this.maxX;
        }

        getMinXp(): number {
            return this.minXp;
        }

        getMinYp(): number {
            return this.minYp;
        }

        getDeltaX(): number {
            return this.dx;
        }

        getDataTypeX(): DataType {
            return this.dataTypeX;
        }

        getDataTypeY(): DataType {
            return this.dataTypeY;
        }

        getStackedAbsSum(key: number) {
            var sum = this.stackAbs[key];
            return isFinite(sum) ? sum : 0;
        }

        getXVals(): Array<number> {
            return this._xvals;
        }

        static isValid(value: number): boolean {
            return isFinite(value);// && !isNaN(value);
        }
    }

    /**
     * Represents the chart palette.
     */
    export interface _IPalette {
        _getColor(i: number): string;
        _getColorLight(i: number): string;
    }

    /**
     * Extends the @see:Tooltip class to provide chart tooltips.
     */
    export class ChartTooltip extends Tooltip {
        private _content: any = '<b>{seriesName}</b><br/>{x} {y}';
        private _threshold: number = 15;

        /**
         * Initializes a new instance of the @see:ChartTooltip class.
         */
        constructor() {
            super();
        }

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
        get content(): any {
            return this._content;
        }
        set content(value: any) {
            if (value != this._content) {
                this._content = value;
            }
        }

        /**
         * Gets or sets the maximum distance from the element to display the tooltip.
         */
        get threshold(): number {
            return this._threshold;
        }
        set threshold(value: number) {
            if (value != this._threshold) {
                this._threshold = asNumber(value);
            }
        }
    }
}
