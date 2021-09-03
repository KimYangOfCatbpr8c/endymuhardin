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
         * The @see:FlexPie control provides pie and doughnut charts with selectable
         * slices.
         *
         * To use the @see:FlexPie control, set the @see:FlexPie.itemsSource property
         * to an array containing the data and use the @see:FlexPie.binding and
         * @see:FlexPie.bindingName properties to set the properties that contain
         * the item values and names.
         */
        var FlexPie = (function (_super) {
            __extends(FlexPie, _super);
            /**
             * Initializes a new instance of the @see:FlexPie class.
             *
             * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options A Javascript object containing initialization data for the control.
             */
            function FlexPie(element, options) {
                _super.call(this, element, null, true); // invalidate on resize
                this._areas = [];
                this._keywords = new chart._KeyWords();
                this._startAngle = 0;
                this._innerRadius = 0;
                this._offset = 0;
                this._reversed = false;
                this._isAnimated = false;
                this._selectedItemPosition = chart.Position.None;
                this._selectedItemOffset = 0;
                this._rotationAngle = 0;
                this._center = new wijmo.Point();
                this._selectedOffset = new wijmo.Point();
                this._selectedIndex = -1;
                this._angles = [];
                this._values = [];
                this._labels = [];
                this._pels = [];
                this._sum = 0;
                // add classes to host element
                this.applyTemplate('wj-control wj-flexchart', null, null);
                this._currentRenderEngine = new chart._SvgRenderEngine(this.hostElement);
                this._legend = new chart.Legend(this);
                this._tooltip = new chart.ChartTooltip();
                this._tooltip.content = '<b>{name}</b><br/>{value}';
                this._tooltip.showDelay = 0;
                this._lbl = new chart.PieDataLabel();
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
                        }
                        else {
                            self._hideToolTip();
                        }
                    }
                });
                // selection
                this.hostElement.addEventListener('click', function (evt) {
                    var showToolTip = true;
                    if (self.selectionMode != chart.SelectionMode.None) {
                        var ht = self.hitTest(evt);
                        var thershold = chart.FlexChart._SELECTION_THRESHOLD;
                        if (self.tooltip && self.tooltip.threshold)
                            thershold = self.tooltip.threshold;
                        if (ht.distance <= thershold) {
                            if (ht.pointIndex != self._selectionIndex && self.selectedItemPosition != chart.Position.None) {
                                showToolTip = false;
                            }
                            if (ht.pointIndex != self._selectionIndex) {
                                self._select(ht.pointIndex, true);
                            }
                        }
                        else {
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
                            }
                            else {
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
            Object.defineProperty(FlexPie.prototype, "binding", {
                /**
                 * Gets or sets the name of the property that contains the chart values.
                 */
                get: function () {
                    return this._binding;
                },
                set: function (value) {
                    if (value != this._binding) {
                        this._binding = wijmo.asString(value, true);
                        this._bindChart();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexPie.prototype, "bindingName", {
                /**
                 * Gets or sets the name of the property that contains the name of the data items.
                 */
                get: function () {
                    return this._bindingName;
                },
                set: function (value) {
                    if (value != this._bindingName) {
                        this._bindingName = wijmo.asString(value, true);
                        this._bindChart();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexPie.prototype, "startAngle", {
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
                get: function () {
                    return this._startAngle;
                },
                set: function (value) {
                    if (value != this._startAngle) {
                        this._startAngle = wijmo.asNumber(value, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexPie.prototype, "offset", {
                /**
                 * Gets or sets the offset of the slices from the pie center.
                 *
                 * The offset is measured as a fraction of the pie radius.
                 */
                get: function () {
                    return this._offset;
                },
                set: function (value) {
                    if (value != this._offset) {
                        this._offset = wijmo.asNumber(value, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexPie.prototype, "innerRadius", {
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
                get: function () {
                    return this._innerRadius;
                },
                set: function (value) {
                    if (value != this._innerRadius) {
                        this._innerRadius = wijmo.asNumber(value, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexPie.prototype, "reversed", {
                /**
                 * Gets or sets a value that determines whether angles are reversed
                 * (counter-clockwise).
                 *
                 * The default value is false, which causes angles to be measured in
                 * the clockwise direction.
                 */
                get: function () {
                    return this._reversed;
                },
                set: function (value) {
                    if (value != this._reversed) {
                        this._reversed = wijmo.asBoolean(value, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexPie.prototype, "selectedItemPosition", {
                /**
                 * Gets or sets the position of the selected slice.
                 *
                 * Setting this property to a value other than 'None' causes
                 * the pie to rotate when an item is selected.
                 *
                 * Note that in order to select slices by clicking the chart,
                 * you must set the @see:selectionMode property to "Point".
                 */
                get: function () {
                    return this._selectedItemPosition;
                },
                set: function (value) {
                    if (value != this._selectedItemPosition) {
                        this._selectedItemPosition = wijmo.asEnum(value, wijmo.chart.Position, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexPie.prototype, "selectedItemOffset", {
                /**
                 * Gets or sets the offset of the selected slice from the pie center.
                 *
                 * Offsets are measured as a fraction of the pie radius.
                 */
                get: function () {
                    return this._selectedItemOffset;
                },
                set: function (value) {
                    if (value != this._selectedItemOffset) {
                        this._selectedItemOffset = wijmo.asNumber(value, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexPie.prototype, "isAnimated", {
                /**
                 * Gets or sets a value indicating whether to use animation when items are selected.
                 *
                 * See also the @see:selectedItemPosition and @see:selectionMode
                 * properties.
                 */
                get: function () {
                    return this._isAnimated;
                },
                set: function (value) {
                    if (value != this._isAnimated) {
                        this._isAnimated = value;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexPie.prototype, "tooltip", {
                /**
                 * Gets the chart's @see:Tooltip.
                 */
                get: function () {
                    return this._tooltip;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexPie.prototype, "dataLabel", {
                /**
                 * Gets or sets the point data label.
                 */
                get: function () {
                    return this._lbl;
                },
                set: function (value) {
                    if (value != this._lbl) {
                        this._lbl = value;
                        if (this._lbl) {
                            this._lbl._chart = this;
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FlexPie.prototype, "selectedIndex", {
                /**
                 * Gets or sets the index of the selected slice.
                 */
                get: function () {
                    return this._selectedIndex;
                },
                set: function (value) {
                    if (value != this._selectedIndex) {
                        var index = wijmo.asNumber(value, true);
                        this._select(index, true);
                    }
                },
                enumerable: true,
                configurable: true
            });
            FlexPie.prototype._getLabelsForLegend = function () {
                return this._labels;
            };
            /**
             * Gets a @see:HitTestInfo object with information about the specified point.
             *
             * @param pt The point to investigate, in window coordinates.
             * @param y The Y coordinate of the point (if the first parameter is a number).
             * @return A HitTestInfo object containing information about the point.
             */
            FlexPie.prototype.hitTest = function (pt, y) {
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
                    if (si !== null && si >= 0 && si < this._areas.length) {
                        hti._setData(null, si);
                    }
                }
                else if (chart.FlexChart._contains(this._rectChart, cpt)) {
                    var len = this._areas.length, min_dist = NaN, min_area;
                    for (var i = 0; i < len; i++) {
                        var pt1 = cpt.clone();
                        if (this._rotationAngle != 0) {
                            var cx = this._center.x, cy = this._center.y;
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
                        var area = this._areas[i];
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
                    hti._chartElement = chart.ChartElement.ChartArea;
                }
                else {
                    hti._chartElement = chart.ChartElement.None;
                }
                return hti;
            };
            // binds the chart to the current data source.
            FlexPie.prototype._performBind = function () {
                this._initData();
                if (this._cv) {
                    this._selectionIndex = this._cv.currentPosition;
                    var items = this._cv.items;
                    if (items) {
                        var len = items.length;
                        for (var i = 0; i < len; i++) {
                            var item = items[i];
                            this._sum += Math.abs(this._getBindData(item, this._values, this._labels, this.binding, this.bindingName));
                        }
                    }
                }
            };
            FlexPie.prototype._initData = function () {
                this._sum = 0;
                this._values = [];
                this._labels = [];
            };
            FlexPie.prototype._getBindData = function (item, values, labels, binding, bindingName) {
                var v, val = 0;
                if (binding) {
                    v = item[binding];
                }
                var val = 0;
                if (wijmo.isNumber(v)) {
                    val = wijmo.asNumber(v);
                }
                else {
                    if (v) {
                        val = parseFloat(v.toString());
                    }
                }
                if (!isNaN(val) && isFinite(val)) {
                    values.push(val);
                }
                else {
                    val = 0;
                    values.push(val);
                }
                if (bindingName && item) {
                    var name = item[bindingName];
                    if (name) {
                        name = name.toString();
                    }
                    labels.push(name);
                }
                else {
                    labels.push(val.toString());
                }
                return val;
            };
            FlexPie.prototype._render = function (engine) {
                // cancelAnimationFrame(this._selectionAnimationID);
                if (this._selectionAnimationID) {
                    clearInterval(this._selectionAnimationID);
                }
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
                var hostSz = new wijmo.Size(w, h);
                engine.beginRender();
                if (w > 0 && h > 0) {
                    engine.setViewportSize(w, h);
                    this._areas = [];
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
                    //engine.startGroup(FlexChart._CSS_PLOT_AREA);
                    //var prect = this._plotRect;
                    //engine.fill = 'transparent';
                    //engine.stroke = null;
                    //engine.drawRect(prect.left, prect.top, prect.width, prect.height);
                    ///engine.endGroup();
                    this.onRendering(new chart.RenderEventArgs(engine));
                    this._pieGroup = engine.startGroup(null, null, true); // all series
                    var margins = this._parseMargin(this.plotMargin), lbl = this.dataLabel;
                    var hasOutLabels = lbl.content && lbl.position == chart.PieLabelPosition.Outside;
                    var outOffs = hasOutLabels ? (wijmo.isNumber(lbl.offset) ? lbl.offset : 0) + 24 : 0;
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
                        this._legendHost = engine.startGroup(chart.FlexChart._CSS_LEGEND);
                        this._rectLegend = new wijmo.Rect(lpos.x, lpos.y, lsz.width, lsz.height);
                        this.legend._render(engine, lpos, legpos, lsz.width, lsz.height);
                        engine.endGroup();
                    }
                    else {
                        this._legendHost = null;
                        this._rectLegend = null;
                    }
                    this._rotationAngle = 0;
                    this._highlightCurrent();
                    if (this.dataLabel.content && this.dataLabel.position != chart.PieLabelPosition.None) {
                        this._renderLabels(engine);
                    }
                    this.onRendered(new chart.RenderEventArgs(engine));
                }
                engine.endRender();
            };
            FlexPie.prototype._renderData = function (engine, rect, g) {
                this._pels = [];
                this._angles = [];
                //engine.strokeWidth = 2;
                var sum = this._sum;
                var startAngle = this.startAngle + 180, // start from 9 o'clock
                innerRadius = this.innerRadius, offset = this.offset;
                if (sum > 0) {
                    var angle = startAngle * Math.PI / 180, cx0 = rect.left + 0.5 * rect.width, cy0 = rect.top + 0.5 * rect.height, r = Math.min(0.5 * rect.width, 0.5 * rect.height);
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
            };
            FlexPie.prototype._renderPie = function (engine, radius, innerRadius, startAngle, offset) {
                this._renderSlices(engine, this._values, this._sum, radius, innerRadius, startAngle, 2 * Math.PI, offset);
            };
            FlexPie.prototype._getCenter = function () {
                return this._center;
            };
            FlexPie.prototype._renderSlices = function (engine, values, sum, radius, innerRadius, startAngle, totalSweep, offset) {
                var len = values.length, angle = startAngle, reversed = this.reversed == true, center = this._center, sweep, pel, cx, cy;
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
                    }
                    else {
                        angle += sweep;
                    }
                    engine.endGroup();
                    this._pels.push(pel);
                }
            };
            FlexPie.prototype._renderSlice = function (engine, cx, cy, currentAngle, idx, radius, innerRadius, startAngle, sweep, totalSweep) {
                var _this = this;
                var reversed = !!this.reversed;
                this._angles.push(currentAngle);
                if (this.itemFormatter) {
                    var hti = new chart.HitTestInfo(this, new wijmo.Point(cx + radius * Math.cos(currentAngle), cy + radius * Math.sin(currentAngle)), chart.ChartElement.SeriesSymbol);
                    hti._setData(null, idx);
                    this.itemFormatter(engine, hti, function () {
                        _this._drawSlice(engine, idx, reversed, cx, cy, radius, innerRadius, startAngle, sweep);
                    });
                }
                else {
                    this._drawSlice(engine, idx, reversed, cx, cy, radius, innerRadius, startAngle, sweep);
                }
            };
            FlexPie.prototype._renderLabels = function (engine) {
                var len = this._areas.length, lbl = this.dataLabel, pos = lbl.position, marg = 2, gcss = 'wj-data-labels', lcss = 'wj-data-label', bcss = 'wj-data-label-border', clcss = 'wj-data-label-line', da = this._rotationAngle, line = lbl.connectingLine, lofs = lbl.offset ? lbl.offset : 0;
                engine.stroke = 'null';
                engine.fill = 'transparent';
                engine.strokeWidth = 1;
                engine.startGroup(gcss);
                for (var i = 0; i < len; i++) {
                    var seg = this._areas[i];
                    if (seg) {
                        var r = seg.radius;
                        var a = (seg.langle + da);
                        var ha = 1, va = 1;
                        if (pos == chart.PieLabelPosition.Center) {
                            r *= 0.5 * (1 + (seg.innerRadius || 0) / seg.radius);
                        }
                        else {
                            a = _Math.clampAngle(a);
                            if (a <= -170 || a >= 170) {
                                ha = 2;
                                va = 1;
                            }
                            else if (a >= -100 && a <= -80) {
                                ha = 1;
                                va = 2;
                            }
                            else if (a >= -10 && a <= 10) {
                                ha = 0;
                                va = 1;
                            }
                            else if (a >= 80 && a <= 100) {
                                ha = 1;
                                va = 0;
                            }
                            else if (-180 < a && a < -90) {
                                ha = 2;
                                va = 2;
                            }
                            else if (-90 <= a && a < 0) {
                                ha = 0;
                                va = 2;
                            }
                            else if (0 < a && a < 90) {
                                ha = 0;
                                va = 0;
                            }
                            else if (90 < a && a < 180) {
                                ha = 2;
                                va = 0;
                            }
                            if (pos == chart.PieLabelPosition.Inside) {
                                ha = 2 - ha;
                                va = 2 - va;
                            }
                        }
                        a *= Math.PI / 180;
                        var dx = 0, dy = 0, off = 0;
                        if (i == this._selectedIndex && this.selectedItemOffset > 0) {
                            off = this.selectedItemOffset;
                        }
                        if (off > 0) {
                            dx = Math.cos(a) * off * this._radius;
                            dy = Math.sin(a) * off * this._radius;
                        }
                        var r0 = r;
                        if (pos == chart.PieLabelPosition.Outside) {
                            r0 += lofs;
                        }
                        else if (pos == chart.PieLabelPosition.Inside) {
                            r0 -= lofs;
                        }
                        var pt = new wijmo.Point(seg.center.x + dx + r0 * Math.cos(a), seg.center.y + dy + r0 * Math.sin(a));
                        if (lbl.border && pos != chart.PieLabelPosition.Center) {
                            if (ha == 0)
                                pt.x += marg;
                            else if (ha == 2)
                                pt.x -= marg;
                            if (va == 0)
                                pt.y += marg;
                            else if (va == 2)
                                pt.y -= marg;
                        }
                        var hti = new chart.HitTestInfo(this, pt);
                        hti._setData(null, i);
                        var content = this._getLabelContent(hti, lbl.content);
                        if (content) {
                            var lr = chart.FlexChart._renderText(engine, content, pt, ha, va, lcss);
                            if (lbl.border) {
                                engine.drawRect(lr.left - marg, lr.top - marg, lr.width + 2 * marg, lr.height + 2 * marg, bcss);
                            }
                            if (line) {
                                var pt2 = new wijmo.Point(seg.center.x + dx + (r) * Math.cos(a), seg.center.y + dy + (r) * Math.sin(a));
                                engine.drawLine(pt.x, pt.y, pt2.x, pt2.y, clcss);
                            }
                        }
                    }
                }
                engine.endGroup();
            };
            FlexPie.prototype._drawSlice = function (engine, i, reversed, cx, cy, r, irad, angle, sweep) {
                var area;
                if (reversed) {
                    if (irad > 0) {
                        if (sweep != 0) {
                            engine.drawDonutSegment(cx, cy, r, irad, angle - sweep, sweep);
                        }
                        area = new _DonutSegment(new wijmo.Point(cx, cy), r, irad, angle - sweep, sweep);
                        area.tag = i;
                        this._areas.push(area);
                    }
                    else {
                        if (sweep != 0) {
                            engine.drawPieSegment(cx, cy, r, angle - sweep, sweep);
                        }
                        area = new _PieSegment(new wijmo.Point(cx, cy), r, angle - sweep, sweep);
                        area.tag = i;
                        this._areas.push(area);
                    }
                }
                else {
                    if (irad > 0) {
                        if (sweep != 0) {
                            engine.drawDonutSegment(cx, cy, r, irad, angle, sweep);
                        }
                        area = new _DonutSegment(new wijmo.Point(cx, cy), r, irad, angle, sweep);
                        area.tag = i;
                        this._areas.push(area);
                    }
                    else {
                        if (sweep != 0) {
                            engine.drawPieSegment(cx, cy, r, angle, sweep);
                        }
                        area = new _PieSegment(new wijmo.Point(cx, cy), r, angle, sweep);
                        area.tag = i;
                        this._areas.push(area);
                    }
                    angle += sweep;
                }
            };
            FlexPie.prototype._measureLegendItem = function (engine, name) {
                var sz = new wijmo.Size();
                sz.width = chart.Series._LEGEND_ITEM_WIDTH;
                sz.height = chart.Series._LEGEND_ITEM_HEIGHT;
                if (name) {
                    var tsz = engine.measureString(name, chart.FlexChart._CSS_LABEL);
                    sz.width += tsz.width;
                    if (sz.height < tsz.height) {
                        sz.height = tsz.height;
                    }
                }
                ;
                sz.width += 3 * chart.Series._LEGEND_ITEM_MARGIN;
                sz.height += 2 * chart.Series._LEGEND_ITEM_MARGIN;
                return sz;
            };
            FlexPie.prototype._drawLegendItem = function (engine, rect, i, name) {
                engine.strokeWidth = 1;
                var marg = chart.Series._LEGEND_ITEM_MARGIN;
                var fill = null;
                var stroke = null;
                if (fill === null)
                    fill = this._getColorLight(i);
                if (stroke === null)
                    stroke = this._getColor(i);
                engine.fill = fill;
                engine.stroke = stroke;
                var yc = rect.top + 0.5 * rect.height;
                var wsym = chart.Series._LEGEND_ITEM_WIDTH;
                var hsym = chart.Series._LEGEND_ITEM_HEIGHT;
                engine.drawRect(rect.left + marg, yc - 0.5 * hsym, wsym, hsym, null); //, this.style);
                if (name) {
                    chart.FlexChart._renderText(engine, name, new wijmo.Point(rect.left + hsym + 2 * marg, yc), 0, 1, chart.FlexChart._CSS_LABEL);
                }
            };
            //---------------------------------------------------------------------
            // tooltips
            FlexPie.prototype._getLabelContent = function (ht, content) {
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
            FlexPie.prototype._select = function (pointIndex, animate) {
                if (animate === void 0) { animate = false; }
                this._highlight(false, this._selectionIndex);
                this._selectionIndex = pointIndex;
                if (this.selectionMode == chart.SelectionMode.Point) {
                    var cv = this._cv;
                    if (cv) {
                        this._notifyCurrentChanged = false;
                        cv.moveCurrentToPosition(pointIndex);
                        this._notifyCurrentChanged = true;
                    }
                }
                this.onSelectionChanged();
                if (!this.isAnimated && (this.selectedItemOffset > 0 || this.selectedItemPosition != chart.Position.None)) {
                    this.invalidate();
                }
                else {
                    this._highlight(true, this._selectionIndex, animate);
                }
            };
            FlexPie.prototype._highlightCurrent = function () {
                if (this.selectionMode != chart.SelectionMode.None) {
                    var pointIndex = -1;
                    var cv = this._cv;
                    if (cv) {
                        pointIndex = cv.currentPosition;
                    }
                    this._highlight(true, pointIndex);
                }
            };
            FlexPie.prototype._highlight = function (selected, pointIndex, animate) {
                if (animate === void 0) { animate = false; }
                if (this.selectionMode == chart.SelectionMode.Point && pointIndex !== undefined && pointIndex !== null && pointIndex >= 0) {
                    var gs = this._pels[pointIndex];
                    if (selected) {
                        if (gs) {
                            gs.parentNode.appendChild(gs);
                            var ells = this._find(gs, ['ellipse']);
                            this._highlightItems(this._find(gs, ['path', 'ellipse']), chart.FlexChart._CSS_SELECTION, selected);
                        }
                        var selectedAngle = this._angles[pointIndex];
                        if (this.selectedItemPosition != chart.Position.None && selectedAngle != 0) {
                            var angle = 0;
                            if (this.selectedItemPosition == chart.Position.Left) {
                                angle = 180;
                            }
                            else if (this.selectedItemPosition == chart.Position.Top) {
                                angle = -90;
                            }
                            else if (this.selectedItemPosition == chart.Position.Bottom) {
                                angle = 90;
                            }
                            var targetAngle = angle * Math.PI / 180 - selectedAngle; // - this._rotationAngle;
                            targetAngle *= 180 / Math.PI;
                            if (animate && this.isAnimated) {
                                this._animateSelectionAngle(targetAngle, 0.5);
                            }
                            else {
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
                    }
                    else {
                        if (gs) {
                            gs.parentNode.insertBefore(gs, gs.parentNode.childNodes.item(pointIndex));
                            gs.removeAttribute('transform');
                            this._highlightItems(this._find(gs, ['path', 'ellipse']), chart.FlexChart._CSS_SELECTION, selected);
                        }
                        if (this._selectedIndex == pointIndex) {
                            this._selectedIndex = -1;
                        }
                    }
                }
            };
            FlexPie.prototype._animateSelectionAngle = function (target, duration) {
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
                            if (self.selectedItemOffset > 0 || self.selectedItemPosition != chart.Position.None) {
                                self.invalidate();
                            }
                        }
                    }
                }, duration * 1000);
            };
            FlexPie._MARGIN = 4;
            return FlexPie;
        }(chart.FlexChartBase));
        chart.FlexPie = FlexPie;
        var _Math = (function () {
            function _Math() {
            }
            // degrees [-180, +180]  
            _Math.clampAngle = function (angle) {
                var a = (angle + 180) % 360 - 180;
                if (a < -180) {
                    a += 360;
                }
                return a;
            };
            return _Math;
        }());
        var _PieSegment = (function () {
            function _PieSegment(center, radius, angle, sweep) {
                this._isFull = false;
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
            _PieSegment.prototype.contains = function (pt) {
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
            };
            _PieSegment.prototype.distance = function (pt) {
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
            };
            Object.defineProperty(_PieSegment.prototype, "center", {
                get: function () {
                    return this._center;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PieSegment.prototype, "radius", {
                get: function () {
                    return this._radius;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PieSegment.prototype, "langle", {
                get: function () {
                    return this._angle;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PieSegment.prototype, "angle", {
                get: function () {
                    return this._originAngle;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PieSegment.prototype, "sweep", {
                get: function () {
                    return this._originSweep;
                },
                enumerable: true,
                configurable: true
            });
            return _PieSegment;
        }());
        chart._PieSegment = _PieSegment;
        var _DonutSegment = (function () {
            function _DonutSegment(center, radius, innerRadius, angle, sweep) {
                this._isFull = false;
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
            _DonutSegment.prototype.contains = function (pt) {
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
            };
            _DonutSegment.prototype.distance = function (pt) {
                if (this.contains(pt)) {
                    return 0;
                }
                return undefined;
            };
            Object.defineProperty(_DonutSegment.prototype, "center", {
                get: function () {
                    return this._center;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DonutSegment.prototype, "radius", {
                get: function () {
                    return this._radius;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DonutSegment.prototype, "langle", {
                get: function () {
                    return this._angle;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DonutSegment.prototype, "angle", {
                get: function () {
                    return this._originAngle;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DonutSegment.prototype, "sweep", {
                get: function () {
                    return this._originSweep;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DonutSegment.prototype, "innerRadius", {
                get: function () {
                    return this._iradius;
                },
                enumerable: true,
                configurable: true
            });
            return _DonutSegment;
        }());
        chart._DonutSegment = _DonutSegment;
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=FlexPie.js.map