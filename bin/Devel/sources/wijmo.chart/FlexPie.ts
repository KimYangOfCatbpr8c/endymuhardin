module wijmo.chart {
    'use strict';

    /**
     * The @see:FlexPie control provides pie and doughnut charts with selectable 
     * slices.
     *
     * To use the @see:FlexPie control, set the @see:FlexPie.itemsSource property
     * to an array containing the data and use the @see:FlexPie.binding and
     * @see:FlexPie.bindingName properties to set the properties that contain
     * the item values and names.
     */
    export class FlexPie extends FlexChartBase {
        private static _MARGIN = 4;

        private _binding: string;
        private _bindingName: string;
        _areas = [];
        private _keywords: _KeyWords = new _KeyWords();

        private _startAngle = 0;
        private _innerRadius = 0;
        private _offset = 0;
        private _reversed = false;
        private _isAnimated = false;

        private _selectedItemPosition = Position.None;
        private _selectedItemOffset = 0;

        private _pieGroup: SVGGElement;
        private _rotationAngle: number = 0;
        private _center: Point = new Point();
        private _radius: number;
        private _selectedOffset = new Point();
        private _selectedIndex = -1;
        private _angles = [];

        private _selectionAnimationID;

        private _lbl: PieDataLabel;

        _values: number[] = [];
        _labels: string[] = [];
        _pels = [];
        _sum: number = 0;

        /**
         * Initializes a new instance of the @see:FlexPie class.
         *
         * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
         * @param options A Javascript object containing initialization data for the control.
         */
        constructor(element: any, options?) {
            super(element, null, true); // invalidate on resize

            // add classes to host element
            this.applyTemplate('wj-control wj-flexchart', null, null);

            this._currentRenderEngine = new _SvgRenderEngine(this.hostElement);
            this._legend = new Legend(this);
            this._tooltip = new ChartTooltip();
            this._tooltip.content = '<b>{name}</b><br/>{value}';
            this._tooltip.showDelay = 0;

            this._lbl = new PieDataLabel();
            this._lbl._chart = this;

            var self = this;

            // tooltips
            this.hostElement.addEventListener('mousemove', function (evt) {
                var tip = self._tooltip;
                var tc = tip.content;
                if (tc && !self.isTouching) {
                    var ht = self.hitTest(evt);
                    if (ht.distance <= tip.threshold) {
                        var content = self._getLabelContent(ht, self.tooltip.content);
                        self._showToolTip(content, new wijmo.Rect(evt.clientX, evt.clientY, 5, 5));
                    } else {
                        self._hideToolTip();
                    }
                }
            });

            // selection
            this.hostElement.addEventListener('click', function (evt) {
                var showToolTip = true;

                if (self.selectionMode != SelectionMode.None) {
                    var ht = self.hitTest(evt);

                    var thershold = FlexChart._SELECTION_THRESHOLD;
                    if (self.tooltip && self.tooltip.threshold)
                        thershold = self.tooltip.threshold;
                    if (ht.distance <= thershold) {
                        if (ht.pointIndex != self._selectionIndex && self.selectedItemPosition != Position.None) {
                            showToolTip = false;
                        }
                        if (ht.pointIndex != self._selectionIndex) {
                            self._select(ht.pointIndex, true);
                        }
                    } else {
                        if (self._selectedIndex >= 0) {
                            self._select(null);
                        }
                    }
                }

                if (showToolTip && self.isTouching) {
                    var tip = self._tooltip;
                    var tc = tip.content;
                    if (tc) {
                        var ht = self.hitTest(evt);
                        if (ht.distance <= tip.threshold) {
                            var content = self._getLabelContent(ht, self.tooltip.content);
                            self._showToolTip(content, new wijmo.Rect(evt.clientX, evt.clientY, 5, 5));
                        } else {
                            self._hideToolTip();
                        }
                    }
                }
            });

            this.hostElement.addEventListener('mouseleave', function (evt) {
                self._hideToolTip();
            });

            // apply options only after chart is fully initialized
            this.initialize(options);

            // refresh control to show current state
            this.refresh();
        }

        /**
         * Gets or sets the name of the property that contains the chart values.
         */
        get binding(): string {
            return this._binding;
        }
        set binding(value: string) {
            if (value != this._binding) {
                this._binding = asString(value, true);
                this._bindChart();
            }
        }

        /**
         * Gets or sets the name of the property that contains the name of the data items.
         */
        get bindingName(): string {
            return this._bindingName;
        }
        set bindingName(value: string) {
            if (value != this._bindingName) {
                this._bindingName = asString(value, true);
                this._bindChart();
            }
        }
        ///**
        // * Gets or sets various chart options.
        // *
        // * The following options are supported: innerRadius, startAngle, reversed, offset.
        // * 
        // */
        //get options(): any {
        //    return this._options;
        //}
        //set options(value: any) {
        //    if (value != this._options) {
        //        this._options = value;
        //        this.invalidate();
        //    }
        //}
        /**
         * Gets or sets the starting angle for the pie slices, in degrees.
         *
         * Angles are measured clockwise, starting at the 9 o'clock position.
         */
        get startAngle(): number {
            return this._startAngle;
        }
        set startAngle(value: number) {
            if (value != this._startAngle) {
                this._startAngle = asNumber(value, true);
                this.invalidate();
            }
        }
        /**
         * Gets or sets the offset of the slices from the pie center.
         *
         * The offset is measured as a fraction of the pie radius.
         */
        get offset(): number {
            return this._offset;
        }
        set offset(value: number) {
            if (value != this._offset) {
                this._offset = asNumber(value, true);
                this.invalidate();
            }
        }
        /**
         * Gets or sets the size of the pie's inner radius.
         *
         * The inner radius is measured as a fraction of the pie radius.
         *
         * The default value for this property is zero, which creates
         * a pie. Setting this property to values greater than zero 
         * creates pies with a hole in the middle, also known as 
         * doughnut charts.
         */
        get innerRadius(): number {
            return this._innerRadius;
        }
        set innerRadius(value: number) {
            if (value != this._innerRadius) {
                this._innerRadius = asNumber(value, true);
                this.invalidate();
            }
        }
        /**
         * Gets or sets a value that determines whether angles are reversed 
         * (counter-clockwise).
         *
         * The default value is false, which causes angles to be measured in
         * the clockwise direction.
         */
        get reversed(): boolean {
            return this._reversed;
        }
        set reversed(value: boolean) {
            if (value != this._reversed) {
                this._reversed = asBoolean(value, true);
                this.invalidate();
            }
        }
        /**
         * Gets or sets the position of the selected slice.
         *
         * Setting this property to a value other than 'None' causes
         * the pie to rotate when an item is selected.
         *
         * Note that in order to select slices by clicking the chart, 
         * you must set the @see:selectionMode property to "Point".
         */
        get selectedItemPosition(): wijmo.chart.Position {
            return this._selectedItemPosition;
        }
        set selectedItemPosition(value: wijmo.chart.Position) {
            if (value != this._selectedItemPosition) {
                this._selectedItemPosition = asEnum(value, wijmo.chart.Position, true);
                this.invalidate();
            }
        }
        /**
         * Gets or sets the offset of the selected slice from the pie center.
         *
         * Offsets are measured as a fraction of the pie radius.
         */
        get selectedItemOffset(): number {
            return this._selectedItemOffset;
        }
        set selectedItemOffset(value: number) {
            if (value != this._selectedItemOffset) {
                this._selectedItemOffset = asNumber(value, true);
                this.invalidate();
            }
        }
        /**
         * Gets or sets a value indicating whether to use animation when items are selected.
         *
         * See also the @see:selectedItemPosition and @see:selectionMode
         * properties.
         */
        get isAnimated(): boolean {
            return this._isAnimated;
        }
        set isAnimated(value: boolean) {
            if (value != this._isAnimated) {
                this._isAnimated = value;
                //this.invalidate();
            }
        }
        /**
         * Gets the chart's @see:Tooltip.
         */
        get tooltip(): ChartTooltip {
            return this._tooltip;
        }

        /**
         * Gets or sets the point data label. 
         */
        get dataLabel(): PieDataLabel {
            return this._lbl;
        }
        set dataLabel(value: PieDataLabel) {
            if (value != this._lbl) {
                this._lbl = value;
                if (this._lbl) {
                    this._lbl._chart = this;
                }
            }
        }

        /**
         * Gets or sets the index of the selected slice.
         */
        get selectedIndex(): number {
            return this._selectedIndex;
        }
        set selectedIndex(value: number) {
            if (value != this._selectedIndex) {
                var index = asNumber(value, true);
                this._select(index, true);
            }
        }

        _getLabelsForLegend() {
            return this._labels;
        }

        /**
         * Gets a @see:HitTestInfo object with information about the specified point.
         *
         * @param pt The point to investigate, in window coordinates.
         * @param y The Y coordinate of the point (if the first parameter is a number).
         * @return A HitTestInfo object containing information about the point.
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
                if (si !== null && si >= 0 && si < this._areas.length) {
                    hti._setData(null, si);
                }
            } else if (FlexChart._contains(this._rectChart, cpt)) {
                var len = this._areas.length,
                    min_dist: number = NaN,
                    min_area: _IHitArea;

                for (var i = 0; i < len; i++) {
                    var pt1 = cpt.clone();
                    if (this._rotationAngle != 0) {
                        var cx = this._center.x,
                            cy = this._center.y;
                        var dx = -cx + pt1.x;
                        var dy = -cy + pt1.y;
                        var r = Math.sqrt(dx * dx + dy * dy);
                        var a = Math.atan2(dy, dx) - this._rotationAngle * Math.PI / 180;


                        pt1.x = cx + r * Math.cos(a);
                        pt1.y = cy + r * Math.sin(a);
                    }

                    if (i == this._selectedIndex) {
                        pt1.x -= this._selectedOffset.x;
                        pt1.y -= this._selectedOffset.y;
                    }

                    var area = <_IHitArea>this._areas[i];

                    if (area.contains(pt1)) {
                        hti._setData(null, area.tag);
                        hti._dist = 0;
                        if (i != this._selectedIndex) {
                            break;
                        }
                    }

                    var dist = area.distance(pt1);
                    if (dist !== undefined) {
                        if (isNaN(min_dist) || dist < min_dist) {
                            min_dist = dist;
                            min_area = area;
                        }
                    }
                }

                if (hti._dist !== 0 && min_area != null) {
                    hti._setData(null, min_area.tag);
                    hti._dist = min_dist;
                }

                hti._chartElement = ChartElement.ChartArea;
            }
            else {
                hti._chartElement = ChartElement.None;
            }
            return hti;
        }

        // binds the chart to the current data source.
        _performBind() {
            this._initData();

            if (this._cv) {
                this._selectionIndex = this._cv.currentPosition;
                var items = this._cv.items;
                if (items) {
                    var len = items.length;
                    for (var i = 0; i < len; i++) {
                        var item = items[i];
                        this._sum += Math.abs( this._getBindData(item, this._values, this._labels, this.binding, this.bindingName));
                    }
                }
            }
        }

        _initData() {
            this._sum = 0;
            this._values = [];
            this._labels = [];
        }

        _getBindData(item, values, labels, binding, bindingName) {
            var v, val = 0;
            if (binding) {
                v = item[binding];
                        }

            var val = 0;

            if (isNumber(v)) {
                val = asNumber(v);
            } else {
                if (v) {
                    val = parseFloat(v.toString());
                            }
                        }

                        if (!isNaN(val) && isFinite(val)) {
                values.push(val);
            } else {
                            val = 0;
                values.push(val);
                        }

            if (bindingName && item) {
                var name = item[bindingName];
                            if (name) {
                                name = name.toString();
                            }
                labels.push(name);
                        } else {
                labels.push(val.toString());
                        }
            return val;
                    }

        _render(engine: IRenderEngine) {
            // cancelAnimationFrame(this._selectionAnimationID);
            if (this._selectionAnimationID) {
                clearInterval(this._selectionAnimationID);
            }

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
            var hostSz = new Size(w, h);
            engine.beginRender();

            if (w > 0 && h > 0) {
                engine.setViewportSize(w, h);
                this._areas = [];

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
                //if (w > h) {
                //    rect.width = h;
                //    rect.left += 0.5 * (w - h);
                //    w = h;
                //} else if (w < h) {
                //    rect.height = w;
                //    rect.top += 0.5 * (h - w);
                //    h = w;
                //}

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

                //engine.startGroup(FlexChart._CSS_PLOT_AREA);
                //var prect = this._plotRect;
                //engine.fill = 'transparent';
                //engine.stroke = null;
                //engine.drawRect(prect.left, prect.top, prect.width, prect.height);
                ///engine.endGroup();

                this.onRendering(new RenderEventArgs(engine));

                this._pieGroup = engine.startGroup(null, null, true); // all series

                var margins = this._parseMargin(this.plotMargin),
                    lbl = this.dataLabel;

                var hasOutLabels = lbl.content && lbl.position == PieLabelPosition.Outside;
                var outOffs = hasOutLabels ? (isNumber(lbl.offset) ? lbl.offset : 0) + 24 : 0;

                if (isNaN(margins.left)) {
                    margins.left = hasOutLabels ? outOffs : FlexPie._MARGIN;
                }
                if (isNaN(margins.right)) {
                    margins.right = hasOutLabels ? outOffs : FlexPie._MARGIN;
                }
                if (isNaN(margins.top)) {
                    margins.top = hasOutLabels ? outOffs : FlexPie._MARGIN;
                }
                if (isNaN(margins.bottom)) {
                    margins.bottom = hasOutLabels ? outOffs : FlexPie._MARGIN;
                }

                rect.top += margins.top;
                var h = rect.height - (margins.top + margins.bottom);
                rect.height = h > 0 ? h : 24;
                rect.left += margins.left;
                var w = rect.width - (margins.left + margins.right);
                rect.width = w > 0 ? w : 24;

                this._renderData(engine, rect, this._pieGroup);

                engine.endGroup();

                if (lsz) {
                    this._legendHost = engine.startGroup(FlexChart._CSS_LEGEND);
                    this._rectLegend = new Rect(lpos.x, lpos.y, lsz.width, lsz.height);
                    this.legend._render(engine, lpos, legpos, lsz.width, lsz.height);
                    engine.endGroup();
                } else {
                    this._legendHost = null;
                    this._rectLegend = null;
                }

                this._rotationAngle = 0;
                this._highlightCurrent();

                if (this.dataLabel.content && this.dataLabel.position != PieLabelPosition.None) {
                    this._renderLabels(engine);
                }

                this.onRendered(new RenderEventArgs(engine));
            }

            engine.endRender();
        }

        _renderData(engine: IRenderEngine, rect: Rect, g: any) {
            this._pels = [];
            this._angles = [];
            //engine.strokeWidth = 2;

            var sum = this._sum;

            var startAngle = this.startAngle + 180, // start from 9 o'clock
                innerRadius = this.innerRadius,
                offset = this.offset;

            if (sum > 0) {
                var angle = startAngle * Math.PI / 180,
                    cx0 = rect.left + 0.5 * rect.width,
                    cy0 = rect.top + 0.5 * rect.height,
                    r = Math.min(0.5 * rect.width, 0.5 * rect.height);

                this._center.x = cx0;
                this._center.y = cy0;

                var maxoff = Math.max(offset, this.selectedItemOffset);
                if (maxoff > 0) {
                    r = r / (1 + maxoff);
                    offset = offset * r;
                }
                this._radius = r;
                var irad = innerRadius * r;

                this._renderPie(engine, r, irad, angle, offset);

                this._highlightCurrent();
            }
                    }

        _renderPie(engine, radius, innerRadius, startAngle, offset) {
            this._renderSlices(engine, this._values, this._sum, radius, innerRadius, startAngle, 2 * Math.PI, offset);
                    }

        _getCenter() {
            return this._center;
                    }

        _renderSlices(engine, values, sum, radius, innerRadius, startAngle, totalSweep, offset) {
            var len = values.length,
                angle = startAngle,
                reversed = this.reversed == true,
                center = this._center,
                sweep, pel, cx, cy;

            for (var i = 0; i < len; i++) {
                cx = center.x;
                cy = center.y;
                pel = engine.startGroup();
                engine.fill = this._getColorLight(i);
                engine.stroke = this._getColor(i);

                var val = Math.abs(values[i]);
                var sweep = Math.abs(val - sum) < 1E-10 ? totalSweep : totalSweep * val / sum;
                var currentAngle = reversed ? angle - 0.5 * sweep : angle + 0.5 * sweep;
                if (offset > 0 && sweep < totalSweep) {
                    cx += offset * Math.cos(currentAngle);
                    cy += offset * Math.sin(currentAngle);
                    }
                this._renderSlice(engine, cx, cy, currentAngle, i, radius, innerRadius, angle, sweep, totalSweep);

                    if (reversed) {
                        angle -= sweep;
                    } else {
                        angle += sweep;
                    }

                    engine.endGroup();
                    this._pels.push(pel);
                }
        }

        _renderSlice(engine, cx, cy, currentAngle, idx, radius, innerRadius, startAngle, sweep, totalSweep) {
            var reversed = !!this.reversed;

            this._angles.push(currentAngle);
            if (this.itemFormatter) {
                var hti: HitTestInfo = new HitTestInfo(this, new Point(cx + radius * Math.cos(currentAngle), cy + radius * Math.sin(currentAngle)), ChartElement.SeriesSymbol);
                hti._setData(null, idx);

                this.itemFormatter(engine, hti, () => {
                    this._drawSlice(engine, idx, reversed, cx, cy, radius, innerRadius, startAngle, sweep);
                });
            } else {
                this._drawSlice(engine, idx, reversed, cx, cy, radius, innerRadius, startAngle, sweep);
            }
        }

        _renderLabels(engine: IRenderEngine) {
            var len = this._areas.length,
                lbl = this.dataLabel,
                pos = lbl.position,
                marg = 2,
                gcss = 'wj-data-labels',
                lcss = 'wj-data-label',
                bcss = 'wj-data-label-border',
                clcss = 'wj-data-label-line',
                da = this._rotationAngle,
                line = lbl.connectingLine,
                lofs = lbl.offset ? lbl.offset : 0;
            engine.stroke = 'null';
            engine.fill = 'transparent';
            engine.strokeWidth = 1;

            engine.startGroup(gcss);
            for (var i = 0; i < len; i++) {
                var seg = <_ISegment>this._areas[i];
                if (seg) {
                    var r = seg.radius;

                    var a = (seg.langle + da);

                    var ha = 1,
                        va = 1;
                    if (pos == PieLabelPosition.Center) {
                        r *= 0.5 * (1 + ((<_DonutSegment>seg).innerRadius || 0) / seg.radius);
                    } else {
                        a = _Math.clampAngle(a);
                        if (a <= -170 || a >= 170) {
                            ha = 2; va = 1;
                        } else if (a >= -100 && a <= -80) {
                            ha = 1; va = 2;
                        } else if (a >= -10 && a <= 10) {
                            ha = 0; va = 1;
                        } else if (a >= 80 && a <= 100) {
                            ha = 1; va = 0;
                        } else if (-180 < a && a < -90) {
                            ha = 2; va = 2;
                        } else if (-90 <= a && a < 0) {
                            ha = 0; va = 2;
                        } else if (0 < a && a < 90) {
                            ha = 0; va = 0;
                        } else if (90 < a && a < 180) {
                            ha = 2; va = 0;
                        }

                        if (pos == PieLabelPosition.Inside) {
                            ha = 2 - ha; va = 2 - va;
                        }
                    }

                    a *= Math.PI / 180;
                    var dx = 0,
                        dy = 0,
                        off = 0;
                    if (i == this._selectedIndex && this.selectedItemOffset > 0) {
                        off = this.selectedItemOffset;
                    }
                    if (off > 0) {
                        dx = Math.cos(a) * off * this._radius;
                        dy = Math.sin(a) * off * this._radius;
                    }

                    var r0 = r;
                    if (pos == PieLabelPosition.Outside) {
                        r0 += lofs;
                    } else if (pos == PieLabelPosition.Inside) {
                        r0 -= lofs;
                    }
                    var pt = new Point(seg.center.x + dx + r0 * Math.cos(a),
                        seg.center.y + dy + r0 * Math.sin(a));

                    if (lbl.border && pos != PieLabelPosition.Center) {
                        if (ha == 0)
                            pt.x += marg;
                        else if (ha == 2)
                            pt.x -= marg;
                        if (va == 0)
                            pt.y += marg;
                        else if (va == 2)
                            pt.y -= marg;
                    }

                    var hti: HitTestInfo = new HitTestInfo(this, pt);
                    hti._setData(null, i);
                    var content = this._getLabelContent(hti, lbl.content);

                    if (content) {
                        var lr = FlexChart._renderText(engine, content, pt, ha, va, lcss);

                        if (lbl.border) {
                            engine.drawRect(lr.left - marg, lr.top - marg, lr.width + 2 * marg, lr.height + 2 * marg, bcss);
                        }

                        if (line) {
                            var pt2 = new Point(seg.center.x + dx + (r) * Math.cos(a),
                                seg.center.y + dy + (r) * Math.sin(a));
                            engine.drawLine(pt.x, pt.y, pt2.x, pt2.y, clcss);
                        }
                    }
                }
            }
            engine.endGroup();
        }

        _drawSlice(engine: IRenderEngine, i: number, reversed: boolean, cx: number, cy: number, r: number, irad: number, angle: number, sweep: number) {
            var area;
            if (reversed) {
                if (irad > 0) {
                    if (sweep != 0) {
                        engine.drawDonutSegment(cx, cy, r, irad, angle - sweep, sweep);
                    }

                    area = new _DonutSegment(new Point(cx, cy), r, irad, angle - sweep, sweep);
                    area.tag = i;
                    this._areas.push(area);
                } else {
                    if (sweep != 0) {
                        engine.drawPieSegment(cx, cy, r, angle - sweep, sweep);
                    }

                    area = new _PieSegment(new Point(cx, cy), r, angle - sweep, sweep);
                    area.tag = i;
                    this._areas.push(area);
                }
            }
            else {
                if (irad > 0) {
                    if (sweep != 0) {
                        engine.drawDonutSegment(cx, cy, r, irad, angle, sweep);
                    }

                    area = new _DonutSegment(new Point(cx, cy), r, irad, angle, sweep);
                    area.tag = i;
                    this._areas.push(area);
                } else {
                    if (sweep != 0) {
                        engine.drawPieSegment(cx, cy, r, angle, sweep);
                    }

                    area = new _PieSegment(new Point(cx, cy), r, angle, sweep);
                    area.tag = i;
                    this._areas.push(area);
                }
                angle += sweep;
            }
        }

        _measureLegendItem(engine: IRenderEngine, name: string): Size {
            var sz = new Size();
            sz.width = Series._LEGEND_ITEM_WIDTH;
            sz.height = Series._LEGEND_ITEM_HEIGHT;
            if (name) {
                var tsz = engine.measureString(name, FlexChart._CSS_LABEL);
                sz.width += tsz.width;
                if (sz.height < tsz.height) {
                    sz.height = tsz.height;
                }
            };
            sz.width += 3 * Series._LEGEND_ITEM_MARGIN;
            sz.height += 2 * Series._LEGEND_ITEM_MARGIN;
            return sz;
        }

        _drawLegendItem(engine: IRenderEngine, rect: Rect, i: number, name: string) {
            engine.strokeWidth = 1;

            var marg = Series._LEGEND_ITEM_MARGIN;

            var fill = null;
            var stroke = null;

            if (fill === null)
                fill = this._getColorLight(i);
            if (stroke === null)
                stroke = this._getColor(i);

            engine.fill = fill;
            engine.stroke = stroke;

            var yc = rect.top + 0.5 * rect.height;

            var wsym = Series._LEGEND_ITEM_WIDTH;
            var hsym = Series._LEGEND_ITEM_HEIGHT;
            engine.drawRect(rect.left + marg, yc - 0.5 * hsym, wsym, hsym, null);//, this.style);

            if (name) {
                FlexChart._renderText(engine, name, new Point(rect.left + hsym + 2 * marg, yc), 0, 1, FlexChart._CSS_LABEL);
            }
        }

        //---------------------------------------------------------------------
        // tooltips

        private _getLabelContent(ht: HitTestInfo, content: any): string {
            if (isString(content)) {
                return this._keywords.replace(content, ht);
            } else if (isFunction(content)) {
                return content(ht);
            }

            return null;
        }

        //---------------------------------------------------------------------
        // selection

        private _select(pointIndex: number, animate: boolean= false) {
            this._highlight(false, this._selectionIndex);
            this._selectionIndex = pointIndex;

            if (this.selectionMode == SelectionMode.Point) {
                var cv = this._cv;
                if (cv) {
                    this._notifyCurrentChanged = false;
                    cv.moveCurrentToPosition(pointIndex);
                    this._notifyCurrentChanged = true;
                }
            }

            this.onSelectionChanged();

            if (!this.isAnimated && (this.selectedItemOffset > 0 || this.selectedItemPosition != Position.None)) {
                this.invalidate();
            } else {
                this._highlight(true, this._selectionIndex, animate);
            }
        }

        _highlightCurrent() {
            if (this.selectionMode != SelectionMode.None) {
                var pointIndex = -1;
                var cv = this._cv;

                if (cv) {
                    pointIndex = cv.currentPosition;
                }

                this._highlight(true, pointIndex);
            }
        }

        _highlight(selected: boolean, pointIndex: number, animate: boolean= false) {
            if (this.selectionMode == SelectionMode.Point && pointIndex !== undefined && pointIndex !== null && pointIndex >= 0) {
                var gs = this._pels[pointIndex];


                if (selected) {
                    if (gs) {
                        gs.parentNode.appendChild(gs);

                        var ells = this._find(gs, ['ellipse']);
                        this._highlightItems(this._find(gs, ['path', 'ellipse']), FlexChart._CSS_SELECTION, selected);
                    }
                    var selectedAngle = this._angles[pointIndex];
                    if (this.selectedItemPosition != Position.None && selectedAngle != 0) {
                        var angle = 0;
                        if (this.selectedItemPosition == Position.Left) {
                            angle = 180;
                        } else if (this.selectedItemPosition == Position.Top) {
                            angle = -90;
                        } else if (this.selectedItemPosition == Position.Bottom) {
                            angle = 90;
                        }

                        var targetAngle = angle * Math.PI / 180 - selectedAngle;// - this._rotationAngle;
                        targetAngle *= 180 / Math.PI;

                        if (animate && this.isAnimated) {
                            this._animateSelectionAngle(targetAngle, 0.5);
                        } else {
                            this._rotationAngle = targetAngle;
                            this._pieGroup.transform.baseVal.getItem(0).setRotate(targetAngle, this._center.x, this._center.y);
                        }
                    }

                    var off = this.selectedItemOffset;
                    if (off > 0 && ells.length == 0) {
                        var x = this._selectedOffset.x = Math.cos(selectedAngle) * off * this._radius;
                        var y = this._selectedOffset.y = Math.sin(selectedAngle) * off * this._radius;

                        if (gs) {
                            gs.setAttribute('transform', 'translate(' + x.toFixed() + ',' + y.toFixed() + ')');
                        }
                    }
                    this._selectedIndex = pointIndex;

                } else {
                    if (gs) {
                        gs.parentNode.insertBefore(gs, gs.parentNode.childNodes.item(pointIndex));
                        gs.removeAttribute('transform');
                        this._highlightItems(this._find(gs, ['path', 'ellipse']), FlexChart._CSS_SELECTION, selected);
                    }
                    if (this._selectedIndex == pointIndex) {
                        this._selectedIndex = -1;
                    }
                }
            }
        }

        _animateSelectionAngle(target: number, duration: number) {
            var source = _Math.clampAngle(this._rotationAngle);
            target = _Math.clampAngle(target);

            /*var delta = (target - source) / (60 * duration);
            this._selectionAnimationID = requestAnimationFrame(doAnim);
            var self = this;

            function doAnim() {

                source += delta;

                if ( Math.abs(target-source) < Math.abs(delta)) {
                   self._rotationAngle = source = target;
                }

                self._pieGroup.transform.baseVal.getItem(0).setRotate(source, self._center.x, self._center.y);

                if (target == source) {
                    cancelAnimationFrame(self._selectionAnimationID);
                } else {
                    self._selectionAnimationID = requestAnimationFrame(doAnim);
                }
            }*/

            var delta = (target - source);
            var self = this;
            var start = source;
            var group = self._pieGroup;

            if (self._selectionAnimationID) {
                clearInterval(this._selectionAnimationID);
            }

            this._selectionAnimationID = wijmo.animate(function (pct) {
                if (group == self._pieGroup) {
                    self._rotationAngle = source = start + delta * pct;
                    self._pieGroup.transform.baseVal.getItem(0).setRotate(source, self._center.x, self._center.y);
                    if (pct == 1) {
                        clearInterval(self._selectionAnimationID);
                    }
                    if (pct > 0.99) {
                        if (self.selectedItemOffset > 0 || self.selectedItemPosition != Position.None) {
                            self.invalidate();
                        }
                    }
                }
            }, duration * 1000);
        }
    }

    class _Math {

        // degrees [-180, +180]  
        static clampAngle(angle: number) {
            var a = (angle + 180) % 360 - 180;
            if (a < -180) {
                a += 360;
            }
            return a;
        }
    }

    export interface _ISegment {
        center: Point;
        radius: number;
        langle: number;
        angle: number;
        sweep: number;
    }

    export class _PieSegment implements _IHitArea, _ISegment {
        private _center: Point;
        private _angle: number;
        private _sweep: number;
        private _radius: number;
        private _radius2: number;
        private _isFull: boolean = false;
        private _originAngle: number;
        private _originSweep: number;

        constructor(center: Point, radius: number, angle: number, sweep: number) {
            this._center = center;
            this._radius = radius;
            this._originAngle = angle;
            this._originSweep = sweep;
            if (sweep >= 2 * Math.PI) {
                this._isFull = true;
            }
            this._sweep = 0.5 * sweep * 180 / Math.PI;
            this._angle = _Math.clampAngle(angle * 180 / Math.PI + this._sweep);
            this._radius2 = radius * radius;
        }

        contains(pt: Point): boolean {
            var dx = pt.x - this._center.x;
            var dy = pt.y - this._center.y;
            var r2 = dx * dx + dy * dy;

            if (r2 <= this._radius2) {
                var a = Math.atan2(dy, dx) * 180 / Math.PI;
                var delta = _Math.clampAngle(this._angle) - _Math.clampAngle(a);
                if (this._isFull || Math.abs(delta) <= this._sweep) {
                    return true;
                }
            }
            return false;
        }

        distance(pt: Point): number {
            if (this.contains(pt)) {
                return 0;
            }

            var dx = pt.x - this._center.x;
            var dy = pt.y - this._center.y;
            var r2 = dx * dx + dy * dy;

            var a = Math.atan2(dy, dx) * 180 / Math.PI;
            var delta = _Math.clampAngle(this._angle) - _Math.clampAngle(a);
            if (this._isFull || Math.abs(delta) <= this._sweep) {
                return Math.sqrt(r2) - this._radius;
            }

            return undefined;
        }

        get center(): Point {
            return this._center;
        }

        get radius(): number {
            return this._radius;
        }

        get langle(): number {
            return this._angle;
        }

        get angle(): number {
            return this._originAngle;
        }

        get sweep(): number {
            return this._originSweep;
        }

        tag: any;
    }

    export class _DonutSegment implements _IHitArea, _ISegment {
        private _center: Point;
        private _angle: number;
        private _sweep: number;
        private _originAngle: number;
        private _originSweep: number;
        private _radius: number;
        private _radius2: number;
        private _iradius: number;
        private _iradius2: number;
        private _isFull: boolean = false;

        constructor(center: Point, radius: number, innerRadius: number, angle: number, sweep: number) {
            this._center = center;
            this._radius = radius;
            this._iradius = innerRadius;
            this._originAngle = angle;
            this._originSweep = sweep;
            if (sweep >= 2 * Math.PI) {
                this._isFull = true;
            }
            this._sweep = 0.5 * sweep * 180 / Math.PI;
            this._angle = _Math.clampAngle(angle * 180 / Math.PI + this._sweep);
            this._radius2 = radius * radius;
            this._iradius2 = innerRadius * innerRadius;
        }

        contains(pt: Point): boolean {
            var dx = pt.x - this._center.x;
            var dy = pt.y - this._center.y;
            var r2 = dx * dx + dy * dy;

            if (r2 >= this._iradius2 && r2 <= this._radius2) {
                var a = Math.atan2(dy, dx) * 180 / Math.PI;
                var delta = _Math.clampAngle(this._angle - a);
                if (this._isFull || Math.abs(delta) <= this._sweep) {
                    return true;
                }
            }
            return false;
        }

        distance(pt: Point): number {
            if (this.contains(pt)) {
                return 0;
            }

            return undefined;
        }

        get center(): Point {
            return this._center;
        }

        get radius(): number {
            return this._radius;
        }

        get langle(): number {
            return this._angle;
        }

        get angle(): number {
            return this._originAngle;
        }

        get sweep(): number {
            return this._originSweep;
        }

        get innerRadius(): number {
            return this._iradius;
        }

        tag: any;
    }

}

