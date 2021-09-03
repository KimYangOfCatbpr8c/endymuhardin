var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var chart;
    (function (chart_1) {
        'use strict';
        /**
         * Specifies the position of an axis or legend on the chart.
         */
        (function (Position) {
            /** The item is not visible. */
            Position[Position["None"] = 0] = "None";
            /** The item appears to the left of the chart. */
            Position[Position["Left"] = 1] = "Left";
            /** The item appears above the chart. */
            Position[Position["Top"] = 2] = "Top";
            /** The item appears to the right of the chart. */
            Position[Position["Right"] = 3] = "Right";
            /** The item appears below the chart. */
            Position[Position["Bottom"] = 4] = "Bottom";
            /** The item is positioned automatically. */
            Position[Position["Auto"] = 5] = "Auto";
        })(chart_1.Position || (chart_1.Position = {}));
        var Position = chart_1.Position;
        ;
        /**
         * Specifies the axis type.
         */
        (function (AxisType) {
            /** Category axis (normally horizontal). */
            AxisType[AxisType["X"] = 0] = "X";
            /** Value axis (normally vertical). */
            AxisType[AxisType["Y"] = 1] = "Y";
        })(chart_1.AxisType || (chart_1.AxisType = {}));
        var AxisType = chart_1.AxisType;
        /**
         * Specifies how to handle overlapping labels.
         */
        (function (OverlappingLabels) {
            /**
             * Hide overlapping labels.
             */
            OverlappingLabels[OverlappingLabels["Auto"] = 0] = "Auto";
            /**
             * Show all labels, including overlapping ones.
             */
            OverlappingLabels[OverlappingLabels["Show"] = 1] = "Show";
        })(chart_1.OverlappingLabels || (chart_1.OverlappingLabels = {}));
        var OverlappingLabels = chart_1.OverlappingLabels;
        /**
         * Specifies whether and where the axis tick marks appear.
         */
        (function (TickMark) {
            /** No tick marks appear. */
            TickMark[TickMark["None"] = 0] = "None";
            /** Tick marks appear outside the plot area. */
            TickMark[TickMark["Outside"] = 1] = "Outside";
            /** Tick marks appear inside the plot area. */
            TickMark[TickMark["Inside"] = 2] = "Inside";
            /** Tick marks cross the axis. */
            TickMark[TickMark["Cross"] = 3] = "Cross";
        })(chart_1.TickMark || (chart_1.TickMark = {}));
        var TickMark = chart_1.TickMark;
        /**
         * Represents an axis in the chart.
         */
        var Axis = (function () {
            /**
             * Initializes a new instance of the @see:Axis class.
             *
             * @param position The position of the axis on the chart.
             */
            function Axis(position) {
                this._GRIDLINE_WIDTH = 0.25;
                this._LINE_WIDTH = 1;
                this._TICK_WIDTH = 1;
                this._TICK_HEIGHT = 4;
                this._TICK_OVERLAP = 1;
                this._TICK_LABEL_DISTANCE = 4;
                this._minorGrid = false;
                this._labels = true;
                this._axisLine = true;
                this._isTimeAxis = false;
                this._labelPadding = 2;
                /**
                 * Occurs when the axis range changes.
                 */
                this.rangeChanged = new wijmo.Event();
                // defines custom conversion functions, it allows to create axis with non-linear scale
                // convert axis coordinate to relative position on the axis.
                // The range is from 0(min) to 1(max).
                this._customConvert = null;
                // inverse function for _customConvert
                // convert relative axis position to axis coordinate
                this._customConvertBack = null;
                this.__uniqueId = Axis._id++;
                this._position = position;
                if (position == Position.Bottom || position == Position.Top) {
                    this._axisType = AxisType.X;
                }
                else {
                    this._axisType = AxisType.Y;
                    this._axisLine = false;
                }
                this._minorTickMarks = TickMark.None;
                this._overlap = OverlappingLabels.Auto;
            }
            Object.defineProperty(Axis.prototype, "hostElement", {
                //--------------------------------------------------------------------------
                //** object model
                /**
                 * Gets the axis host element.
                 */
                get: function () {
                    return this._hostElement;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Axis.prototype, "actualMin", {
                /**
                 * Gets the actual axis minimum.
                 *
                 * It returns a number or a Date object (for time-based data).
                */
                get: function () {
                    return this._isTimeAxis ? new Date(this._actualMin) : this._actualMin;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Axis.prototype, "actualMax", {
                /**
                * Gets the actual axis maximum.
                *
                * It returns a number or a Date object (for time-based data).
                */
                get: function () {
                    return this._isTimeAxis ? new Date(this._actualMax) : this._actualMax;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Axis.prototype, "min", {
                /**
                 * Gets or sets the minimum value shown on the axis.
                 *
                 * If not set, the minimum is calculated automatically.
                 * The value can be a number or a Date object (for time-based data).
                 */
                get: function () {
                    return this._min;
                },
                set: function (value) {
                    if (value != this._min) {
                        if (wijmo.isDate(value)) {
                            this._min = wijmo.asDate(value, true);
                        }
                        else {
                            this._min = wijmo.asNumber(value, true);
                        }
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Axis.prototype, "max", {
                /**
                 * Gets or sets the maximum value shown on the axis.
                 *
                 * If not set, the maximum is calculated automatically.
                 * The value can be a number or a Date object (for time-based data).
                 */
                get: function () {
                    return this._max;
                },
                set: function (value) {
                    if (value != this._max) {
                        if (wijmo.isDate(value)) {
                            this._max = wijmo.asDate(value, true);
                        }
                        else {
                            this._max = wijmo.asNumber(value, true);
                        }
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Axis.prototype, "reversed", {
                /**
                 * Gets or sets a value indicating whether the axis is
                 * reversed (top to bottom or right to left).
                 */
                get: function () {
                    return this._reversed;
                },
                set: function (value) {
                    if (this._reversed != value) {
                        this._reversed = wijmo.asBoolean(value);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Axis.prototype, "position", {
                /**
                * Gets or sets the enumerated axis position.
                */
                get: function () {
                    return this._position;
                },
                set: function (value) {
                    if (value != this._position) {
                        this._position = wijmo.asEnum(value, Position, false);
                        if (this._position == Position.Bottom || this._position == Position.Top) {
                            this._axisType = AxisType.X;
                        }
                        else {
                            this._axisType = AxisType.Y;
                        }
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Axis.prototype, "majorUnit", {
                /**
                 * Gets or sets the number of units between axis labels.
                 *
                 * If the axis contains date values, then the units are
                 * expressed in days.
                 */
                get: function () {
                    return this._majorUnit;
                },
                set: function (value) {
                    if (value != this._majorUnit) {
                        this._majorUnit = wijmo.asNumber(value, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Axis.prototype, "minorUnit", {
                /**
                  * Gets or sets the number of units between minor axis ticks.
                  *
                  * If the axis contains date values, then the units are
                  * expressed in days.
                  */
                get: function () {
                    return this._minorUnit;
                },
                set: function (value) {
                    if (value != this._minorUnit) {
                        this._minorUnit = wijmo.asNumber(value, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Axis.prototype, "name", {
                /**
                 * Gets or sets the axis name.
                 */
                get: function () {
                    return this._name;
                },
                set: function (value) {
                    if (value != this._name) {
                        this._name = wijmo.asString(value, true);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Axis.prototype, "title", {
                /**
                 * Gets or sets the title text shown next to the axis.
                 */
                get: function () {
                    return this._title;
                },
                set: function (value) {
                    if (value != this._title) {
                        this._title = wijmo.asString(value, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Axis.prototype, "format", {
                /**
                 * Gets or sets the format string used for the axis labels
                 * (see @see:Globalize).
                 */
                get: function () {
                    return this._format;
                },
                set: function (value) {
                    if (value != this._format) {
                        this._format = wijmo.asString(value, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Axis.prototype, "majorGrid", {
                //
                /**
                 * Gets or sets a value indicating whether the axis includes grid lines.
                 */
                get: function () {
                    return this._majorGrid;
                },
                set: function (value) {
                    if (value != this._majorGrid) {
                        this._majorGrid = wijmo.asBoolean(value, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Axis.prototype, "majorTickMarks", {
                /**
                 * Gets or sets the location of the axis tick marks.
                 */
                get: function () {
                    return this._majorTickMarks;
                },
                set: function (value) {
                    if (value != this._majorTickMarks) {
                        this._majorTickMarks = wijmo.asEnum(value, TickMark, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Axis.prototype, "minorGrid", {
                /**
                 * Gets or sets a value indicating whether the axis includes minor grid lines.
                 */
                get: function () {
                    return this._minorGrid;
                },
                set: function (value) {
                    if (value != this._minorGrid) {
                        this._minorGrid = wijmo.asBoolean(value, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Axis.prototype, "minorTickMarks", {
                /**
                 * Gets or sets the location of the minor axis tick marks.
                 */
                get: function () {
                    return this._minorTickMarks;
                },
                set: function (value) {
                    if (value != this._minorTickMarks) {
                        this._minorTickMarks = wijmo.asEnum(value, TickMark, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Axis.prototype, "axisLine", {
                /**
                 * Gets or sets a value indicating whether the axis line is visible.
                 */
                get: function () {
                    return this._axisLine;
                },
                set: function (value) {
                    if (value != this._axisLine) {
                        this._axisLine = wijmo.asBoolean(value, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Axis.prototype, "labels", {
                /**
                 * Gets or sets a value indicating whether the axis labels are visible.
                 */
                get: function () {
                    return this._labels;
                },
                set: function (value) {
                    if (value != this._labels) {
                        this._labels = wijmo.asBoolean(value, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Axis.prototype, "labelAlign", {
                /**
                 * Gets or sets the label alignment.
                 *
                 * By default the labels are centered. The supported values are 'left' and 'right
                 * for x-axis and 'top' and 'bottom' for y-axis.
                 */
                get: function () {
                    return this._labelAlign;
                },
                set: function (value) {
                    if (value != this._labelAlign) {
                        this._labelAlign = wijmo.asString(value, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Axis.prototype, "labelAngle", {
                /**
                 * Gets or sets the rotation angle of the axis labels.
                 *
                 * The angle is measured in degrees with valid values
                 * ranging from -90 to 90.
                 */
                get: function () {
                    return this._labelAngle;
                },
                set: function (value) {
                    if (value != this._labelAngle) {
                        this._labelAngle = wijmo.asNumber(value, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Axis.prototype, "origin", {
                /**
                 * Gets or sets the value at which an axis crosses the perpendicular axis.
                 **/
                get: function () {
                    return this._origin;
                },
                set: function (value) {
                    if (value != this._origin) {
                        this._origin = wijmo.asNumber(value, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Axis.prototype, "overlappingLabels", {
                /**
                 * Gets or sets a value indicating how to handle the overlapping axis labels.
                 */
                get: function () {
                    return this._overlap;
                },
                set: function (value) {
                    if (value != this._overlap) {
                        this._overlap = wijmo.asEnum(value, OverlappingLabels, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Axis.prototype, "itemsSource", {
                /**
                 * Gets or sets the items source for the axis labels.
                 *
                 * Names of the properties are specified by the @see:wijmo.chart.Axis.binding.
                 *
                 * For example:
                 *
                 * <pre>
                 *  // default value for Axis.binding is 'value,text'
                 *  chart.axisX.itemsSource = [ { value:1, text:'one' }, { value:2, text:'two' } ];
                 * </pre>
                 */
                get: function () {
                    return this._items;
                },
                set: function (value) {
                    if (this._items != value) {
                        // unbind current collection view
                        if (this._cv) {
                            this._cv.collectionChanged.removeHandler(this._cvCollectionChanged, this);
                            this._cv = null;
                        }
                        // save new data source and collection view
                        this._items = value;
                        this._cv = wijmo.asCollectionView(value);
                        // bind new collection view
                        if (this._cv != null) {
                            this._cv.collectionChanged.addHandler(this._cvCollectionChanged, this);
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Axis.prototype, "binding", {
                /**
                 * Gets or sets the comma-separated property names for the
                 * @see:wijmo.chart.Axis.itemsSource property to use in axis labels.
                 *
                 * The first name specifies the value on the axis, the second represents the corresponding
                 * axis label. The default value is 'value,text'.
                 */
                get: function () {
                    return this._binding;
                },
                set: function (value) {
                    if (value != this._binding) {
                        this._binding = wijmo.asString(value, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Axis.prototype, "itemFormatter", {
                /**
                 * Gets or sets the itemFormatter function for the axis labels.
                 *
                 * If specified, the function takes two parameters:
                 * <ul>
                 * <li><b>render engine</b>: The @see:wijmo.chart.IRenderEngine object to be used
                 * in formatting the labels.</li>
                 * <li><b>current label</b>: A string value with the following properties:
                 *   <ul>
                 *     <li><b>value</b>: The value of the axis label to format.</li>
                 *     <li><b>text</b>: The text to use in the label.</li>
                 *     <li><b>pos</b>: The position in control coordinates at which
                 *     the label is to be rendered.</li>
                 *     <li><b>cls</b>: The CSS class to be applied to the label.</li>
                 *   </ul></li>
                 * </ul>
                 *
                 * The function returns the label parameters of labels for which
                 * properties are modified.
                 *
                 * For example:
                 * <pre>
                 * chart.axisY.itemFormatter = function(engine, label) {
                 *     if (label.val &gt; 5){
                 *         engine.textFill = 'red'; // red text
                 *         label.cls = null; // no default CSS
                 *      }
                 *     return label;
                 * }
                 * </pre>
                 */
                get: function () {
                    return this._ifmt;
                },
                set: function (value) {
                    if (this._ifmt != value) {
                        this._ifmt = wijmo.asFunction(value, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Axis.prototype, "logBase", {
                /**
                 * Gets or sets the logarithmic base of the axis.
                 *
                 * If the base is not specified the axis uses a linear scale.
                 *
                 * Use the @see:logBase property to spread data that is clustered
                 * around the origin. This is common in several financial and economic
                 * data sets.
                 */
                get: function () {
                    return this._logBase;
                },
                set: function (value) {
                    if (value != this._logBase) {
                        this._logBase = wijmo.asNumber(value, true, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Axis.prototype, "plotArea", {
                /**
                 * Gets or sets the plot area for the axis.
                 */
                get: function () {
                    return this._parea;
                },
                set: function (value) {
                    if (value != this._parea) {
                        this._parea = wijmo.asType(value, chart_1.PlotArea, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Axis.prototype, "labelPadding", {
                /**
                 * Gets or sets the label padding.
                 */
                get: function () {
                    return this._labelPadding;
                },
                set: function (value) {
                    if (value != this._labelPadding) {
                        this._labelPadding = wijmo.asNumber(value, true, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the @see:rangeChanged event.
             */
            Axis.prototype.onRangeChanged = function (e) {
                this.rangeChanged.raise(this, e);
            };
            //--------------------------------------------------------------------------
            // implementation
            Axis.prototype._isOverlapped = function (engine, w, lblClass) {
                var lbls = this._lbls;
                if (lbls != null && lbls.length > 0) {
                    var len = lbls.length;
                    var vals = this._values && this._values.length == len ? this._values : null;
                    var x0 = 0;
                    for (var i = 0; i < len; i++) {
                        var val = vals ? vals[i] : i;
                        if (val >= this._actualMin && val <= this._actualMax) {
                            var x = w * (val - this._actualMin) / (this._actualMax - this._actualMin);
                            var sz = engine.measureString(lbls[i], lblClass);
                            if (i > 0 && Math.abs(x - x0) < sz.width + 12) {
                                return true;
                            }
                            x0 = x;
                        }
                    }
                }
                return false;
            };
            /**
             * Calculates the axis height.
             *
             * @param engine Rendering engine.
             * @param maxw Max width.
             */
            Axis.prototype._getHeight = function (engine, maxw) {
                this._actualAngle = undefined;
                var lblClass = chart_1.FlexChart._CSS_LABEL;
                var titleClass = chart_1.FlexChart._CSS_TITLE;
                var range = this._actualMax - this._actualMin;
                var prec = this._nicePrecision(range);
                if (prec < 0 || prec > 15)
                    prec = 0;
                var delta = 0.1 * range; // r * 0.01 * Math.E;
                var lbls = this._lbls;
                var angle = this.labelAngle;
                if (this.labels && this._chart._getChartType() !== chart_1.ChartType.Funnel) {
                    delta = this._updateAutoFormat(delta);
                    if (lbls != null && lbls.length > 0) {
                        var len = lbls.length;
                        var vals = this._values && this._values.length == len ? this._values : null;
                        this._annoSize = new wijmo.Size();
                        for (var i = 0; i < len; i++) {
                            var val = vals ? vals[i] : i;
                            if (val >= this._actualMin && val <= this._actualMax) {
                                var sz = engine.measureString(lbls[i], lblClass);
                                if (this.axisType == AxisType.X) {
                                    //if ((i == 0 || i == len - 1) && sz.width > this._annoSize.width){ //&& sz.width <= 0.1 * maxw) {
                                    if (sz.width > this._annoSize.width) {
                                        this._annoSize.width = sz.width;
                                    }
                                }
                                else {
                                    if (sz.width > this._annoSize.width) {
                                        this._annoSize.width = sz.width;
                                    }
                                }
                                if (sz.height > this._annoSize.height) {
                                    this._annoSize.height = sz.height;
                                }
                            }
                        }
                        if (angle === undefined && this.axisType == AxisType.X) {
                            if (this._isOverlapped(engine, maxw, lblClass)) {
                                angle = this._actualAngle = -45;
                            }
                            else {
                                this._actualAngle = 0;
                            }
                        }
                    }
                    else {
                        var text = this._formatValue(this._actualMin - delta);
                        var sz = engine.measureString(text, lblClass);
                        this._annoSize = sz;
                        text = this._formatValue(this._actualMax + delta);
                        sz = engine.measureString(text, lblClass);
                        if (sz.width > this._annoSize.width) {
                            this._annoSize.width = sz.width;
                        }
                        if (sz.height > this._annoSize.height)
                            this._annoSize.height = sz.height;
                    }
                    if (angle) {
                        var a = angle * Math.PI / 180, w = this._annoSize.width, h = this._annoSize.height;
                        this._annoSize.width = w * Math.abs(Math.cos(a)) + h * Math.abs(Math.sin(a));
                        this._annoSize.height = w * Math.abs(Math.sin(a)) + h * Math.abs(Math.cos(a));
                    }
                }
                else {
                    this._annoSize = new wijmo.Size();
                }
                var h = 2 * this._labelPadding;
                if (this._axisType == AxisType.X) {
                    h += this._annoSize.height;
                }
                else {
                    h += this._annoSize.width + this._TICK_LABEL_DISTANCE + 2;
                }
                var th = this._TICK_HEIGHT;
                var tover = this._TICK_OVERLAP;
                if (tickMarks == TickMark.Outside) {
                    tover = 1;
                }
                else if (tickMarks == TickMark.Inside) {
                    tover = -1;
                }
                else if (tickMarks == TickMark.Cross) {
                    tover = 0;
                }
                var tickMarks = this.majorTickMarks;
                if (tickMarks === undefined || tickMarks === null) {
                    tickMarks = TickMark.Outside;
                }
                if (tickMarks != TickMark.None) {
                    h += 0.5 * (1 + tover) * th;
                }
                if (this._title) {
                    text = this._title;
                    this._szTitle = engine.measureString(text, titleClass);
                    h += this._szTitle.height;
                }
                engine.fontSize = null;
                return h;
            };
            Axis.prototype._updateAutoFormat = function (delta) {
                if (this._isTimeAxis) {
                    var fmt = this.format;
                    var td = (0.001 * (this._actualMax - this._actualMin) / 10);
                    var trange = new _timeSpan(td * _timeSpan.TicksPerSecond);
                    var tdelta = isNaN(this._majorUnit) ?
                        _timeHelper.NiceTimeSpan(trange, fmt) : _timeSpan.fromDays(this._majorUnit);
                    if (!fmt)
                        this._tfmt = _timeHelper.GetTimeDefaultFormat(1000 * tdelta.TotalSeconds, 0);
                    delta = tdelta.TotalSeconds;
                }
                return delta;
            };
            Axis.prototype._updateActualLimitsByChartType = function (labels, min, max) {
                if (labels && labels.length > 0 && !this._isTimeAxis) {
                    var ctype = this._chart._getChartType();
                    if (ctype != chart_1.ChartType.Column && ctype != chart_1.ChartType.Bar) {
                        min -= 0.5;
                        max += 0.5;
                    }
                }
                return { min: min, max: max };
            };
            /**
             * Update the actual axis limits based on a specified data range.
             *
             * @param dataType Data type.
             * @param dataMin Data minimum.
             * @param dataMax Data maximum.
             * @param labels Category labels(category axis).
             * @param values Values(value axis).
             */
            Axis.prototype._updateActualLimits = function (dataType, dataMin, dataMax, labels, values) {
                if (labels === void 0) { labels = null; }
                if (values === void 0) { values = null; }
                var oldmin = this._actualMin, oldmax = this._actualMax;
                this._isTimeAxis = (dataType == wijmo.DataType.Date);
                var minmax = this._updateActualLimitsByChartType(labels, dataMin, dataMax);
                dataMin = minmax.min;
                dataMax = minmax.max;
                var min = this._min, max = this._max;
                if (wijmo.isDate(min)) {
                    min = min.valueOf();
                }
                if (wijmo.isDate(max)) {
                    max = max.valueOf();
                }
                this._actualMin = min !== null && min !== undefined ? min : dataMin;
                this._actualMax = max !== null && max !== undefined ? max : dataMax;
                // todo: validate min&max
                if (this._actualMin == this._actualMax) {
                    this._actualMin -= 0.5;
                    this._actualMax += 0.5;
                }
                if (this.logBase > 0) {
                    var base = this.logBase;
                    var k = Math.log(base);
                    if (!this._max) {
                        var imax = Math.ceil(Math.log(this._actualMax) / k);
                        this._actualMax = Math.pow(base, imax);
                    }
                    if (!this._min) {
                        var imin = Math.floor(Math.log(this._actualMin) / k);
                        this._actualMin = Math.pow(base, imin);
                    }
                    if (this._actualMin <= 0 || isNaN(this._actualMin)) {
                        this._actualMin = 1;
                    }
                    if (this._actualMax < this._actualMin) {
                        this._actualMax = this._actualMin + 1;
                    }
                }
                //if (this._isTimeAxis) {
                //    this._tfmt = _timeHelper.GetTimeDefaultFormat(this._actualMax, this._actualMin);
                //}
                if ((oldmin != this._actualMin && (!isNaN(oldmin) || !isNaN(this._actualMin)))
                    || (oldmax != this._actualMax && (!isNaN(oldmax) || !isNaN(this._actualMax)))) {
                    this.onRangeChanged();
                }
                if (this._items) {
                    this._values = [];
                    this._lbls = [];
                    var len = this._items.length;
                    var vbnd = 'value';
                    var nbnd = 'text';
                    if (this.binding) {
                        var bnds = this.binding.split(',');
                        if (bnds.length == 2) {
                            vbnd = bnds[0];
                            nbnd = bnds[1];
                        }
                    }
                    for (var i = 0; i < len; i++) {
                        var item = this._items[i];
                        var val = item[vbnd];
                        if (wijmo.isNumber(val)) {
                            this._values.push(val);
                            this._lbls.push(item[nbnd]);
                        }
                    }
                }
                else {
                    this._lbls = labels;
                    this._values = values;
                }
            };
            /**
             * Set the axis position.
             *
             * @param axisRect Axis rectangle.
             * @param plotRect Plot area rectangle.
             */
            Axis.prototype._layout = function (axisRect, plotRect) {
                var isVert = this.axisType == AxisType.Y;
                var isNear = this._position != Position.Top && this._position != Position.Right;
                this._plotrect = plotRect;
                if (isVert)
                    this._axrect = new wijmo.Rect(axisRect.left, axisRect.top, axisRect.height, axisRect.width);
                else
                    this._axrect = axisRect;
            };
            /**
             * Render the axis.
             *
             * @param engine Rendering engine.
             */
            Axis.prototype._render = function (engine) {
                if (this.position == Position.None) {
                    return;
                }
                this._vals = {};
                var labelAngle = 0;
                if (this.labelAngle) {
                    labelAngle = this.labelAngle;
                    if (labelAngle > 90) {
                        labelAngle = 90;
                    }
                    else if (labelAngle < -90) {
                        labelAngle = -90;
                    }
                }
                if (this.labelAngle === undefined && this._actualAngle !== undefined) {
                    labelAngle = this._actualAngle;
                }
                var isVert = this.axisType == AxisType.Y;
                var isNear = this._position != Position.Top && this._position != Position.Right;
                var fg = chart_1.FlexChart._FG;
                var fontSize = null;
                var range = this._actualMax - this._actualMin;
                if (!isNaN(range)) {
                    var delta = this._calcMajorUnit();
                    if (delta == 0)
                        delta = this._niceTickNumber(range) * 0.1;
                    var len = Math.min(Axis.MAX_MAJOR, Math.floor(range / delta) + 1);
                    var vals = [];
                    var lbls = [];
                    this._rects = [];
                    this._vals.major = vals;
                    this._vals.hasLbls = [];
                    var st = Math.floor(this._actualMin / delta) * delta;
                    if (st < this._actualMin)
                        st += delta;
                    var isCategory = false;
                    // labels
                    if (this._lbls && this._lbls.length > 0) {
                        lbls = this._lbls; // category
                        if (this._values.length == 0) {
                            isCategory = true;
                            for (var i = 0; i < lbls.length; i++) {
                                vals.push(i);
                            }
                        }
                        else {
                            vals = this._values;
                        }
                    }
                    else if (this._isTimeAxis) {
                        this._createTimeLabels(st, len, vals, lbls); // time
                    }
                    else if (!this.logBase) {
                        this._createLabels(st, len, delta, vals, lbls); // numeric
                    }
                    else {
                        this._createLogarithmicLabels(this._actualMin, this._actualMax, this.majorUnit, vals, lbls, true);
                    }
                    len = Math.min(vals.length, lbls.length);
                    engine.textFill = fg;
                    var th = this._TICK_HEIGHT;
                    var tover = this._TICK_OVERLAP;
                    var tickMarks = this.majorTickMarks;
                    if (tickMarks === undefined || tickMarks === null) {
                        tickMarks = TickMark.Outside;
                    }
                    if (tickMarks == TickMark.Outside) {
                        tover = 1;
                    }
                    else if (tickMarks == TickMark.Inside) {
                        tover = -1;
                    }
                    else if (tickMarks == TickMark.Cross) {
                        tover = 0;
                    }
                    var t1 = 0.5 * (tover - 1) * th;
                    var t2 = 0.5 * (1 + tover) * th;
                    for (var i = 0; i < len; i++) {
                        var hasLbl = true;
                        var val = vals[i];
                        var sval = lbls[i];
                        var showLabel = this.labels;
                        if (showLabel && (isCategory || this.itemsSource) && this.majorUnit) {
                            if (i % this.majorUnit != 0) {
                                showLabel = false;
                            }
                        }
                        if (val >= this._actualMin && val <= this._actualMax) {
                            hasLbl = this._renderLabelsAndTicks(engine, i, val, sval, labelAngle, tickMarks, showLabel, t1, t2);
                        }
                        this._vals.hasLbls.push(hasLbl);
                    }
                }
                if ((this.minorGrid || this.minorTickMarks != TickMark.None)) {
                    this._renderMinor(engine, vals, isCategory);
                }
                engine.stroke = fg;
                engine.fontSize = fontSize;
                // line and title
                this._renderLineAndTitle(engine);
                engine.stroke = null;
                engine.fontSize = null;
                engine.textFill = null;
                engine.strokeWidth = null;
            };
            Axis.prototype._renderLineAndTitle = function (engine) {
                var isVert = this.axisType == AxisType.Y, isNear = this._position != Position.Top && this._position != Position.Right, titleClass = chart_1.FlexChart._CSS_TITLE, lineClass = chart_1.FlexChart._CSS_LINE;
                if (isVert) {
                    if (isNear) {
                        if (this._title) {
                            var center = new wijmo.Point(this._axrect.left + this._szTitle.height * 0.5, this._axrect.top + 0.5 * this._axrect.height);
                            chart_1.FlexChart._renderRotatedText(engine, this._title, center, 1, 1, center, -90, titleClass);
                        }
                        if (this.axisLine) {
                            engine.drawLine(this._axrect.right, this._axrect.top, this._axrect.right, this._axrect.bottom, lineClass);
                        }
                    }
                    else {
                        if (this._title) {
                            var center = new wijmo.Point(this._axrect.right - this._szTitle.height * 0.5, this._axrect.top + 0.5 * this._axrect.height);
                            chart_1.FlexChart._renderRotatedText(engine, this._title, center, 1, 1, center, 90, titleClass);
                        }
                        if (this.axisLine) {
                            engine.drawLine(this._axrect.left, this._axrect.top, this._axrect.left, this._axrect.bottom, lineClass);
                        }
                    }
                }
                else {
                    if (isNear) {
                        if (this.axisLine) {
                            engine.drawLine(this._axrect.left, this._axrect.top, this._axrect.right, this._axrect.top, lineClass);
                        }
                        if (this._title) {
                            chart_1.FlexChart._renderText(engine, this._title, new wijmo.Point(this._axrect.left + 0.5 * this._axrect.width, this._axrect.bottom), 1, 2, titleClass);
                        }
                    }
                    else {
                        if (this.axisLine) {
                            engine.drawLine(this._axrect.left, this._axrect.bottom, this._axrect.right, this._axrect.bottom, lineClass);
                        }
                        if (this._title) {
                            chart_1.FlexChart._renderText(engine, this._title, new wijmo.Point(this._axrect.left + 0.5 * this._axrect.width, this._axrect.top), 1, 0, titleClass);
                        }
                    }
                }
            };
            Axis.prototype._renderMinor = function (engine, vals, isCategory) {
                var isVert = this.axisType == AxisType.Y, isNear = this._position != Position.Top && this._position != Position.Right;
                if (!this.logBase)
                    this._createMinors(engine, vals, isVert, isNear, isCategory);
                else {
                    if (this.minorUnit > 0) {
                        var mvals = [];
                        this._createLogarithmicLabels(this._actualMin, this._actualMax, this.minorUnit, mvals, null, false);
                        var ticks = [];
                        for (var i = 0; i < mvals.length; i++) {
                            var val = mvals[i];
                            if (vals.indexOf(val) == -1 && val > this._actualMin)
                                ticks.push(val);
                        }
                        this._renderMinors(engine, ticks, isVert, isNear);
                    }
                }
            };
            Axis.prototype._renderLabelsAndTicks = function (engine, index, val, sval, labelAngle, tickMarks, showLabel, t1, t2) {
                var hasLbl = true, isVert = this.axisType == AxisType.Y, isNear = this._position != Position.Top && this._position != Position.Right, labelPadding = this.labelPadding || 2, tth = this._TICK_WIDTH, lalign = this._getLabelAlign(isVert), lblClass = chart_1.FlexChart._CSS_LABEL, glineClass = chart_1.FlexChart._CSS_GRIDLINE, tickClass = chart_1.FlexChart._CSS_TICK, gstroke = chart_1.FlexChart._FG, tstroke = chart_1.FlexChart._FG, gth = this._GRIDLINE_WIDTH;
                var has_gline = val != this._actualMin && this.majorGrid;
                if (isVert) {
                    var y = this.convert(val);
                    if (has_gline) {
                        engine.stroke = gstroke;
                        engine.strokeWidth = gth;
                        engine.drawLine(this._plotrect.left, y, this._plotrect.right, y, glineClass);
                    }
                    engine.stroke = tstroke;
                    engine.strokeWidth = tth;
                    if (isNear) {
                        if (tickMarks != TickMark.None) {
                            engine.drawLine(this._axrect.right - t1, y, this._axrect.right - t2, y, tickClass);
                        }
                        if (showLabel) {
                            var lpt = new wijmo.Point(this._axrect.right - t2 - this._TICK_LABEL_DISTANCE - labelPadding, y);
                            if (labelAngle > 0) {
                                if (labelAngle == 90) {
                                    chart_1.FlexChart._renderRotatedText(engine, sval, lpt, 1, 0, lpt, labelAngle, lblClass);
                                }
                                else {
                                    chart_1.FlexChart._renderRotatedText(engine, sval, lpt, 2, 1, lpt, labelAngle, lblClass);
                                }
                            }
                            else if (labelAngle < 0) {
                                if (labelAngle == -90) {
                                    chart_1.FlexChart._renderRotatedText(engine, sval, lpt, 1, 2, lpt, labelAngle, lblClass);
                                }
                                else {
                                    chart_1.FlexChart._renderRotatedText(engine, sval, lpt, 2, 1, lpt, labelAngle, lblClass);
                                }
                            }
                            else {
                                this._renderLabel(engine, val, sval, lpt, 2, lalign /*1*/, lblClass);
                            }
                        }
                    }
                    else {
                        if (tickMarks != TickMark.None) {
                            engine.drawLine(this._axrect.left + t1, y, this._axrect.left + t2, y, tickClass);
                        }
                        if (showLabel) {
                            var lpt = new wijmo.Point(this._axrect.left + t2 + this._TICK_LABEL_DISTANCE + labelPadding, y);
                            if (labelAngle > 0) {
                                if (labelAngle == 90) {
                                    chart_1.FlexChart._renderRotatedText(engine, sval, lpt, 1, 2, lpt, labelAngle, lblClass);
                                }
                                else {
                                    chart_1.FlexChart._renderRotatedText(engine, sval, lpt, 0, 1, lpt, labelAngle, lblClass);
                                }
                            }
                            else if (labelAngle < 0) {
                                if (labelAngle == -90) {
                                    chart_1.FlexChart._renderRotatedText(engine, sval, lpt, 1, 0, lpt, labelAngle, lblClass);
                                }
                                else {
                                    chart_1.FlexChart._renderRotatedText(engine, sval, lpt, 0, 1, lpt, labelAngle, lblClass);
                                }
                            }
                            else {
                                this._renderLabel(engine, val, sval, lpt, 0, lalign /* 1*/, lblClass);
                            }
                        }
                    }
                }
                else {
                    var x = this.convert(val);
                    if (this.overlappingLabels == OverlappingLabels.Auto && this._xCross(x))
                        showLabel = false;
                    if (has_gline) {
                        engine.stroke = gstroke;
                        engine.strokeWidth = gth;
                        engine.drawLine(x, this._plotrect.top, x, this._plotrect.bottom, glineClass);
                    }
                    engine.stroke = tstroke;
                    engine.strokeWidth = tth;
                    if (isNear) {
                        hasLbl = false;
                        if (showLabel) {
                            var lpt = new wijmo.Point(x, this._axrect.top + t2 + labelPadding);
                            if (labelAngle != 0) {
                                hasLbl = this._renderRotatedLabel(engine, sval, lpt, labelAngle, lblClass, isNear);
                            }
                            else {
                                hasLbl = this._renderLabel(engine, val, sval, lpt, lalign /* 1*/, 0, lblClass);
                            }
                        }
                        if (tickMarks != TickMark.None) {
                            /*if (isCategory && len<=10) {
                                val = val - 0.5;
                                if (val >= this._actualMin && val <= this._actualMax) {
                                    x = this.convert(val);
                                    engine.drawLine(x, this._axrect.top + t1, x, this._axrect.top + t2, tickClass);
                                }
                                if (i == len - 1) {
                                    val = val + 1;
                                    if (val >= this._actualMin && val <= this._actualMax) {
                                        x = this.convert(val);
                                        engine.drawLine(x, this._axrect.top + t1, x, this._axrect.top + t2, tickClass);
                                    }
                                }
                            } else */
                            if (hasLbl) {
                                x = this.convert(val);
                                engine.drawLine(x, this._axrect.top + t1, x, this._axrect.top + t2, tickClass);
                            }
                        }
                    }
                    else {
                        if (showLabel) {
                            var lpt = new wijmo.Point(x, this._axrect.bottom - t2 - labelPadding);
                            if (labelAngle != 0) {
                                hasLbl = this._renderRotatedLabel(engine, sval, lpt, labelAngle, lblClass, isNear);
                            }
                            else {
                                hasLbl = this._renderLabel(engine, val, sval, lpt, lalign /*1*/, 2, lblClass);
                            }
                        }
                        if (tickMarks != TickMark.None) {
                            /*if (isCategory && len <= 10) { // offset only if number of labels is small
                                val = val - 0.5;
                                if (val >= this._actualMin && val <= this._actualMax) {
                                    x = this.convert(val);
                                    engine.drawLine(x, this._axrect.bottom - t1, x, this._axrect.bottom - t2, tickClass);
                                }
                                if (i == len - 1) {
                                    val = val + 1;
                                    if (val >= this._actualMin && val <= this._actualMax) {
                                        x = this.convert(val);
                                        engine.drawLine(x, this._axrect.bottom - t1, x, this._axrect.bottom - t2, tickClass);
                                    }
                                }
                            }
                            else */ {
                                x = this.convert(val);
                                engine.drawLine(x, this._axrect.bottom - t1, x, this._axrect.bottom - t2, tickClass);
                            }
                        }
                    }
                }
                return hasLbl;
            };
            Axis.prototype._xCross = function (x) {
                var len = this._rects.length;
                for (var i = 0; i < len; i++) {
                    var r = this._rects[i];
                    if (x >= r.left && x <= r.right) {
                        return true;
                    }
                }
                return false;
            };
            Axis.prototype._createMinors = function (engine, vals, isVert, isNear, isCategory) {
                if (vals && vals.length > 1) {
                    var delta = this.majorUnit ?
                        (this._isTimeAxis ? this.majorUnit * 24 * 3600 * 1000 : this.majorUnit)
                        : vals[1] - vals[0];
                    var minorUnit = wijmo.isNumber(this.minorUnit) ?
                        (this._isTimeAxis ? this.minorUnit * 24 * 3600 * 1000 : this.minorUnit)
                        : delta * 0.5;
                    var ticks = [];
                    for (var val = vals[0]; val > this._actualMin && ticks.length < Axis.MAX_MINOR; val -= minorUnit) {
                        if (vals.indexOf(val) == -1)
                            ticks.push(val);
                    }
                    for (var val = vals[0] + minorUnit; val < this._actualMax && ticks.length < Axis.MAX_MINOR; val += minorUnit) {
                        if (vals.indexOf(val) == -1)
                            ticks.push(val);
                        else if (isCategory && this.majorUnit && val % this.majorUnit != 0)
                            ticks.push(val);
                    }
                    this._renderMinors(engine, ticks, isVert, isNear);
                }
            };
            Axis.prototype._renderMinors = function (engine, ticks, isVert, isNear) {
                var th = this._TICK_HEIGHT;
                var tth = this._TICK_WIDTH;
                var tover = this._TICK_OVERLAP;
                var tstroke = chart_1.FlexChart._FG;
                var tickMarks = this.minorTickMarks;
                var hasTicks = true;
                this._vals.minor = ticks;
                if (tickMarks == TickMark.Outside) {
                    tover = 1;
                }
                else if (tickMarks == TickMark.Inside) {
                    tover = -1;
                }
                else if (tickMarks == TickMark.Cross) {
                    tover = 0;
                }
                else {
                    hasTicks = false;
                }
                var t1 = 0.5 * (tover - 1) * th;
                var t2 = 0.5 * (1 + tover) * th;
                var cnt = ticks ? ticks.length : 0;
                var grid = this.minorGrid;
                var prect = this._plotrect;
                var gth = this._GRIDLINE_WIDTH;
                var gstroke = chart_1.FlexChart._FG;
                // CSS
                var glineClass = chart_1.FlexChart._CSS_GRIDLINE_MINOR;
                var tickClass = chart_1.FlexChart._CSS_TICK_MINOR;
                for (var i = 0; i < cnt; i++) {
                    if (isVert) {
                        var y = this.convert(ticks[i]);
                        if (hasTicks) {
                            engine.stroke = tstroke;
                            engine.strokeWidth = tth;
                            if (isNear) {
                                engine.drawLine(this._axrect.right - t1, y, this._axrect.right - t2, y, tickClass);
                            }
                            else {
                                engine.drawLine(this._axrect.left + t1, y, this._axrect.left + t2, y, tickClass);
                            }
                        }
                        if (grid) {
                            engine.stroke = gstroke;
                            engine.strokeWidth = gth;
                            engine.drawLine(prect.left, y, prect.right, y, glineClass);
                        }
                    }
                    else {
                        var x = this.convert(ticks[i]);
                        if (hasTicks) {
                            engine.stroke = tstroke;
                            engine.strokeWidth = tth;
                            if (isNear) {
                                engine.drawLine(x, this._axrect.top + t1, x, this._axrect.top + t2, tickClass);
                            }
                            else {
                                engine.drawLine(x, this._axrect.bottom - t1, x, this._axrect.bottom - t2, tickClass);
                            }
                        }
                        if (grid) {
                            engine.stroke = gstroke;
                            engine.strokeWidth = gth;
                            engine.drawLine(x, prect.top, x, prect.bottom, glineClass);
                        }
                    }
                }
            };
            Axis.prototype._renderLabel = function (engine, val, text, pos, ha, va, className) {
                var ok = false;
                if (this.itemFormatter) {
                    var pt = pos.clone();
                    if (this.axisType == AxisType.X) {
                        if (this.position == Position.Top)
                            pt.y = this._plotrect.top;
                        else
                            pt.y = this._plotrect.bottom;
                    }
                    else {
                        if (this.position == Position.Right)
                            pt.x = this._plotrect.right;
                        else
                            pt.x = this._plotrect.left;
                    }
                    var lbl = { val: val, text: text, pos: pt, cls: className };
                    lbl = this.itemFormatter(engine, lbl);
                    if (lbl) {
                        text = lbl.text;
                        className = lbl.cls;
                    }
                    else {
                        text = null;
                    }
                }
                if (text) {
                    var rects = this._rects;
                    var hide = this.overlappingLabels == OverlappingLabels.Auto && this._actualAngle === undefined;
                    var rect = chart_1.FlexChart._renderText(engine, text, pos, ha, va, className, null, null, function (rect) {
                        if (hide) {
                            var len = rects.length;
                            for (var i = 0; i < len; i++) {
                                if (chart_1.FlexChart._intersects(rects[i], rect))
                                    return false;
                            }
                        }
                        return true;
                    });
                    if (rect) {
                        // extend rect to have more intervals between labels
                        rect.left += 4;
                        rect.width += 8;
                        rects.push(rect);
                        ok = true;
                    }
                }
                return ok;
            };
            Axis.prototype._renderRotatedLabel = function (engine, sval, lpt, labelAngle, lblClass, isNear) {
                if (sval) {
                    var sz = engine.measureString(sval, lblClass);
                    var rect = new wijmo.Rect(lpt.x, lpt.y, sz.height + 2, sz.width);
                    var rects = this._rects;
                    var hide = this.overlappingLabels == OverlappingLabels.Auto;
                    if (hide) {
                        var len = rects.length;
                        for (var i = 0; i < len; i++) {
                            if (chart_1.FlexChart._intersects(rects[i], rect))
                                return false;
                        }
                    }
                    if (labelAngle != 90 && labelAngle != -90) {
                        var dy = 0.5 * sz.height * Math.abs(Math.sin(labelAngle * Math.PI / 180));
                        if (isNear)
                            lpt.y += dy;
                        else
                            lpt.y -= dy;
                    }
                    var ha = isNear ? (labelAngle > 0 ? 0 : 2) : (labelAngle > 0 ? 2 : 0);
                    chart_1.FlexChart._renderRotatedText(engine, sval, lpt, ha, 1, lpt, labelAngle, lblClass);
                    this._rects.push(rect);
                    return true;
                }
                else {
                    return false;
                }
            };
            Axis.prototype._getLabelAlign = function (isVert) {
                var lalign = 1;
                if (this.labelAlign) {
                    var la = this.labelAlign.toLowerCase();
                    if (isVert) {
                        if (la == 'top') {
                            lalign = 0;
                        }
                        else if (la == 'bottom') {
                            lalign = 2;
                        }
                    }
                    else {
                        if (la == 'left') {
                            lalign = 0;
                        }
                        else if (la == 'right') {
                            lalign = 2;
                        }
                    }
                }
                return lalign;
            };
            /**
             * Converts the specified value from data to pixel coordinates.
             *
             * @param val The data value to convert.
             * @param maxValue The max value of the data, it's optional.
             * @param minValue The min value of the data, it's optional.
             */
            Axis.prototype.convert = function (val, maxValue, minValue) {
                var max = maxValue == null ? this._actualMax : maxValue, min = minValue == null ? this._actualMin : minValue;
                if (max == min) {
                    return 0;
                }
                var x = this._axrect.left;
                var w = this._axrect.width;
                var y = this._axrect.top;
                var h = this._axrect.height;
                if (this._customConvert != null) {
                    var r = this._customConvert(val, min, max);
                    if (this.axisType == AxisType.Y) {
                        return y + r * h;
                    }
                    else {
                        return x + r * w; // x + w - r * w;
                    }
                }
                else {
                    var base = this.logBase;
                    if (!base) {
                        if (this._reversed) {
                            if (this.axisType == AxisType.Y) {
                                return y + (val - min) / (max - min) * h;
                            }
                            else {
                                return x + w - (val - min) / (max - min) * w;
                            }
                        }
                        else {
                            if (this.axisType == AxisType.Y) {
                                return y + h - (val - min) / (max - min) * h;
                            }
                            else {
                                return x + (val - min) / (max - min) * w;
                            }
                        }
                    }
                    else {
                        if (val <= 0)
                            return NaN;
                        var maxl = Math.log(max / min);
                        if (this._reversed) {
                            if (this.axisType == AxisType.Y)
                                return y + Math.log(val / min) / maxl * h;
                            else
                                return x + w - Math.log(val / min) / maxl * w;
                        }
                        else {
                            if (this.axisType == AxisType.Y)
                                return y + h - Math.log(val / min) / maxl * h;
                            else
                                return x + Math.log(val / min) / maxl * w;
                        }
                    }
                }
            };
            /**
             * Converts the specified value from pixel to data coordinates.
             *
             * @param val The pixel coordinates to convert back.
             */
            Axis.prototype.convertBack = function (val) {
                if (this._actualMax == this._actualMin) {
                    return 0;
                }
                var x = this._plotrect.left;
                var w = this._plotrect.width;
                var y = this._plotrect.top;
                var h = this._plotrect.height;
                var range = this._actualMax - this._actualMin;
                var base = this.logBase;
                if (this._customConvertBack != null) {
                    if (this.axisType == AxisType.Y) {
                        return this._customConvertBack((val - y) / h, this._actualMin, this._actualMax);
                    }
                    else {
                        return this._customConvertBack((val - x) / w, this._actualMin, this._actualMax);
                    }
                }
                else if (!base) {
                    if (this._reversed) {
                        if (this.axisType == AxisType.Y) {
                            return this._actualMin + (val - y) * range / h;
                        }
                        else {
                            return this._actualMin + (x + w - val) * range / w;
                        }
                    }
                    else {
                        if (this.axisType == AxisType.Y) {
                            return this._actualMax - (val - y) * range / h;
                        }
                        else {
                            return this._actualMin + (val - x) * range / w;
                        }
                    }
                }
                else {
                    var rval = 0;
                    if (this._reversed) {
                        if (this.axisType == AxisType.Y) {
                            rval = (val - y) / h;
                        }
                        else {
                            rval = 1 - (val - x) / w;
                        }
                    }
                    else {
                        if (this.axisType == AxisType.Y) {
                            rval = 1 - (val - y) / h;
                        }
                        else {
                            rval = (val - x) / w;
                        }
                    }
                    return Math.pow(base, (Math.log(this._actualMin) + (Math.log(this._actualMax) - Math.log(this._actualMin)) * rval) / Math.log(base));
                }
            };
            Object.defineProperty(Axis.prototype, "axisType", {
                /**
                 * Gets the axis type.
                 */
                get: function () {
                    var chart = this._chart;
                    if (chart) {
                        if (chart.axisX == this) {
                            return AxisType.X;
                        }
                        else if (chart.axisY == this) {
                            return AxisType.Y;
                        }
                    }
                    return this._axisType;
                },
                enumerable: true,
                configurable: true
            });
            Axis.prototype._getMinNum = function () {
                return this._actualMin;
            };
            Axis.prototype._getMaxNum = function () {
                return this._actualMax;
            };
            //---------------------------------------------------------------------
            // private
            Axis.prototype._invalidate = function () {
                if (this._chart) {
                    this._chart.invalidate();
                }
            };
            Axis.prototype._cvCollectionChanged = function (sender, e) {
                this._invalidate();
            };
            Axis.prototype._createLabels = function (start, len, delta, vals, lbls) {
                for (var i = 0; i < len; i++) {
                    var val0 = (start + delta * i).toFixed(14); //  Math.round(st + delta * i);//, 14); // 15
                    var val = parseFloat(val0);
                    //if (val > max)
                    //  break;
                    var sval = this._formatValue(val);
                    vals.push(val);
                    lbls.push(sval);
                }
            };
            Axis.prototype._createLogarithmicLabels = function (min, max, unit, vals, lbls, isLabels) {
                var base = this.logBase;
                var k = Math.log(base);
                var imin = Math.floor(Math.log(min) / k);
                var imax = Math.ceil(Math.log(max) / k);
                var delta = base;
                var auto = true;
                if (unit > 0) {
                    auto = false;
                    delta = unit; // islabels = false;
                }
                if (delta < base)
                    delta = base;
                //if (delta <= 0)
                //    return;
                var n = ((imax - imin + 1) * base / delta);
                // try some rational number for large values.
                // garyh 21-Apr-05 - VNCHT000250
                /* if (n > 128) {
                    if (isPowerOf(logbase, 10))
                        delta = logbase / 10;
                    else if (isPowerOf(logbase, 5))
                        delta = logbase / 5;
                    else
                        delta = logbase / 16;
    
                    n = (int)((imax - imin + 1) * logbase / delta);
    
                    if (n > 128)		// the user must handle the unitminor
                        delta = logbase;
                }*/
                var step = 1;
                if (isLabels) {
                    var na = this._getAnnoNumber(this.position == Position.Left || this.position == Position.Left);
                    if (n > na)
                        step = Math.floor(n / na + 1);
                    else if (auto) {
                        if (n <= 0.2 * na)
                            delta = 0.2 * base;
                        else if (n <= 0.1 * na)
                            delta = 0.1 * base;
                    }
                }
                for (var i = imin; i <= imax; i += step) {
                    if (auto) {
                        var baseval = Math.pow(base, i);
                        for (var j = 0; j * delta < (base - 1); j++) {
                            var val = baseval * (1 + j * delta);
                            if (val >= min && val <= max) {
                                if (j == 0) {
                                    vals.unshift(val);
                                    if (lbls)
                                        lbls.unshift(this._formatValue(val));
                                }
                                else {
                                    vals.push(val);
                                    if (lbls)
                                        lbls.push(this._formatValue(val));
                                }
                            }
                        }
                    }
                    else {
                        var val = Math.pow(delta, i);
                        if (val >= min && val <= max) {
                            vals.push(val);
                            if (lbls)
                                lbls.push(this._formatValue(val));
                        }
                    }
                }
            };
            Axis.prototype._createTimeLabels = function (start, len, vals, lbls) {
                var min = this._actualMin;
                var max = this._actualMax;
                var dtmin0 = new Date(this._actualMin);
                var dtmax0 = new Date(this._actualMax);
                var fmt = this._format;
                var anum = this._getAnnoNumber(this._axisType == AxisType.Y);
                if (anum > 12) {
                    anum = 12;
                }
                //if (!this._format)
                //    this._tfmt = fmt = _timeHelper.GetTimeDefaultFormat( (max - min) / anum, 0 );
                // alext 10-Jan-2010
                // better precision
                //var td = (24.0 * 3600.0 * (this._actualMax - this._actualMin) / anum);
                var td = (0.001 * (this._actualMax - this._actualMin) / anum);
                var range = new _timeSpan(td * _timeSpan.TicksPerSecond);
                var delta = isNaN(this._majorUnit) ?
                    _timeHelper.NiceTimeSpan(range, fmt) : _timeSpan.fromDays(this._majorUnit);
                if (!fmt)
                    this._tfmt = fmt = _timeHelper.GetTimeDefaultFormat(1000 * delta.TotalSeconds, 0);
                var delta_ticks = delta.Ticks;
                var newmin = _timeHelper.RoundTime(min, delta.TotalDays, false);
                if (isFinite(newmin))
                    min = newmin;
                var newmax = _timeHelper.RoundTime(max, delta.TotalDays, true);
                if (isFinite(newmax))
                    max = newmax;
                var dtmin = new Date(min);
                var dtmax = new Date(max);
                if (delta.TotalDays >= 365 && isNaN(this._majorUnit)) {
                    dtmin = new Date(dtmin0.getFullYear(), 1, 1);
                    if (dtmin < dtmin0)
                        //dtmin = dtmin.AddYears(1);
                        dtmin.setFullYear(dtmin.getFullYear() + 1);
                    var years = (delta.TotalDays / 365);
                    years = years - (years % 1);
                    for (var current = dtmin; current <= dtmax0; 
                    //current = current.AddYears(nyears)
                    current.setFullYear(current.getFullYear() + years)) {
                        var val = current.valueOf();
                        vals.push(val);
                        lbls.push(this._formatValue(val));
                    }
                }
                else if (delta.TotalDays >= 30 && isNaN(this._majorUnit)) {
                    dtmin = new Date(dtmin0.getFullYear(), dtmin0.getMonth(), 1);
                    if (dtmin < dtmin0)
                        //dtmin = dtmin.AddMonths(1);
                        dtmin.setMonth(dtmin.getMonth() + 1);
                    var nmonths = delta.TotalDays / 30;
                    nmonths = nmonths - (nmonths % 1);
                    for (var current = dtmin; current <= dtmax0; 
                    //current = current.AddMonths(nmonths)
                    current.setMonth(current.getMonth() + nmonths)) {
                        var val = current.valueOf();
                        vals.push(val);
                        lbls.push(this._formatValue(val));
                    }
                }
                else {
                    var dt = (1000 * delta_ticks) / _timeSpan.TicksPerSecond;
                    var current = dtmin;
                    var timedif = dtmin0.getTime() - current.getTime();
                    if (timedif > dt) {
                        current = new Date(current.getTime() + Math.floor(timedif / dt) * dt);
                    }
                    for (; current <= dtmax0; 
                    //current = current.AddTicks(delta_ticks)
                    current = new Date(current.getTime() + dt)) {
                        if (current >= dtmin0) {
                            var val = current.valueOf();
                            vals.push(val);
                            lbls.push(this._formatValue(val));
                        }
                    }
                }
            };
            Axis.prototype._formatValue = function (val) {
                if (this._isTimeAxis) {
                    if (this._format) {
                        return wijmo.Globalize.format(new Date(val), this._format);
                    }
                    else {
                        return wijmo.Globalize.format(new Date(val), this._tfmt);
                    }
                }
                else {
                    if (this._format)
                        return wijmo.Globalize.format(val, this._format);
                    else {
                        var fmt = val == Math.round(val) ? 'n0' : 'n';
                        return wijmo.Globalize.format(val, fmt);
                    }
                }
            };
            Axis.prototype._calcMajorUnit = function () {
                var delta = this._majorUnit;
                if (isNaN(delta)) {
                    var range = this._actualMax - this._actualMin;
                    var prec = this._nicePrecision(range);
                    var dx = range / this._getAnnoNumber(this.axisType == AxisType.Y);
                    delta = this._niceNumber(2 * dx, -prec, true);
                    if (delta < dx) {
                        delta = this._niceNumber(dx, -prec + 1, false);
                    }
                    if (delta < dx) {
                        delta = this._niceTickNumber(dx);
                    }
                }
                return delta;
            };
            Axis.prototype._getAnnoNumber = function (isVert) {
                var w0 = isVert ? this._annoSize.height : this._annoSize.width;
                var w = isVert ? this._axrect.height : this._axrect.width;
                if (w0 > 0 && w > 0) {
                    var n = Math.floor(w / (w0 + 6));
                    if (n <= 0) {
                        n = 1;
                    }
                    return n;
                }
                else {
                    return 10;
                }
            };
            Axis.prototype._nicePrecision = function (range) {
                //
                //	Return a nice precision value for this range.
                //	Doesn't take into account font size, window
                //	size, etc.	Just use the log10 of the range.
                //
                if (range <= 0 || isNaN(range)) {
                    return 0;
                }
                var log10 = Math.log(range) / Math.LN10;
                var exp;
                if (log10 >= 0) {
                    exp = Math.floor(log10); //(int)(SignedFloor(log10));
                }
                else {
                    exp = Math.ceil(log10);
                }
                var f = range / Math.pow(10.0, exp);
                /* we need the extra digit near the lower end */
                if (f < 3.0) {
                    exp = -exp + 1;
                    // more precision for more labels
                    f = range / Math.pow(10.0, exp);
                    if (f < 3.0) {
                        exp = exp + 1;
                    }
                }
                return exp;
            };
            Axis.prototype._niceTickNumber = function (x) {
                if (x == 0) {
                    return x;
                }
                else if (x < 0) {
                    x = -x;
                }
                var log10 = Math.log(x) / Math.LN10;
                var exp = Math.floor(log10); // (int) SignedFloor(log10);
                var f = x / Math.pow(10.0, exp);
                var nf = 10.0;
                if (f <= 1.0) {
                    nf = 1.0;
                }
                else if (f <= 2.0) {
                    nf = 2.0;
                }
                else if (f <= 5.0) {
                    nf = 5.0;
                }
                return (nf * Math.pow(10.0, exp));
            };
            Axis.prototype._niceNumber = function (x, exp, round) {
                if (x == 0) {
                    return x;
                }
                else if (x < 0) {
                    x = -x;
                }
                var f = x / Math.pow(10.0, exp);
                var nf = 10.0;
                if (round) {
                    if (f < 1.5) {
                        nf = 1;
                    }
                    else if (f < 3) {
                        nf = 2;
                    }
                    else if (f < 4.5) {
                        nf = 4;
                    }
                    else if (f < 7) {
                        nf = 5;
                    }
                }
                else {
                    if (f <= 1) {
                        nf = 1;
                    }
                    else if (f <= 2) {
                        nf = 2;
                    }
                    else if (f <= 5) {
                        nf = 5;
                    }
                }
                return (nf * Math.pow(10.0, exp));
            };
            Object.defineProperty(Axis.prototype, "_uniqueId", {
                get: function () {
                    return this.__uniqueId;
                },
                enumerable: true,
                configurable: true
            });
            Axis.MAX_MAJOR = 1000;
            Axis.MAX_MINOR = 2000;
            Axis._id = 0;
            return Axis;
        }());
        chart_1.Axis = Axis;
        /**
         * Represents a collection of @see:Axis objects in a @see:FlexChart control.
         */
        var AxisCollection = (function (_super) {
            __extends(AxisCollection, _super);
            function AxisCollection() {
                _super.apply(this, arguments);
            }
            /**
             * Gets an axis by name.
             *
             * @param name The name of the axis to look for.
             * @return The axis object with the specified name, or null if not found.
             */
            AxisCollection.prototype.getAxis = function (name) {
                var index = this.indexOf(name);
                return index > -1 ? this[index] : null;
            };
            /**
             * Gets the index of an axis by name.
             *
             * @param name The name of the axis to look for.
             * @return The index of the axis with the specified name, or -1 if not found.
             */
            AxisCollection.prototype.indexOf = function (name) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i].name == name) {
                        return i;
                    }
                }
                return -1;
            };
            return AxisCollection;
        }(wijmo.collections.ObservableArray));
        chart_1.AxisCollection = AxisCollection;
        var _tmInc;
        (function (_tmInc) {
            _tmInc[_tmInc["tickf7"] = -7] = "tickf7";
            _tmInc[_tmInc["tickf6"] = -6] = "tickf6";
            _tmInc[_tmInc["tickf5"] = -5] = "tickf5";
            _tmInc[_tmInc["tickf4"] = -4] = "tickf4";
            _tmInc[_tmInc["tickf3"] = -3] = "tickf3";
            _tmInc[_tmInc["tickf2"] = -2] = "tickf2";
            _tmInc[_tmInc["tickf1"] = -1] = "tickf1";
            _tmInc[_tmInc["second"] = 1] = "second";
            _tmInc[_tmInc["minute"] = 60] = "minute";
            _tmInc[_tmInc["hour"] = 3600] = "hour";
            _tmInc[_tmInc["day"] = 86400] = "day";
            _tmInc[_tmInc["week"] = 604800] = "week";
            _tmInc[_tmInc["month"] = 2678400] = "month";
            _tmInc[_tmInc["year"] = 31536000] = "year";
            _tmInc[_tmInc["maxtime"] = Number.MAX_VALUE] = "maxtime";
        })(_tmInc || (_tmInc = {}));
        var _timeSpan = (function () {
            function _timeSpan(ticks) {
                this.ticks = ticks;
            }
            Object.defineProperty(_timeSpan.prototype, "Ticks", {
                get: function () {
                    return this.ticks;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_timeSpan.prototype, "TotalSeconds", {
                get: function () {
                    return this.ticks / 10000000;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_timeSpan.prototype, "TotalDays", {
                get: function () {
                    return this.ticks / 10000000 / (24 * 60 * 60);
                },
                enumerable: true,
                configurable: true
            });
            _timeSpan.fromSeconds = function (seconds) {
                return new _timeSpan(seconds * 10000000);
            };
            _timeSpan.fromDays = function (days) {
                return new _timeSpan(days * 10000000 * 24 * 60 * 60);
            };
            _timeSpan.TicksPerSecond = 10000000;
            return _timeSpan;
        }());
        var _timeHelper = (function () {
            function _timeHelper(date) {
                if (wijmo.isDate(date))
                    this.init(date);
                else if (wijmo.isNumber(date))
                    this.init(chart_1.FlexChart._fromOADate(date));
            }
            _timeHelper.prototype.init = function (dt) {
                this.year = dt.getFullYear();
                this.month = dt.getMonth();
                this.day = dt.getDate();
                this.hour = dt.getHours();
                this.minute = dt.getMinutes();
                this.second = dt.getSeconds();
            };
            _timeHelper.prototype.getTimeAsDateTime = function () {
                var smon = 0, sday = 0, ssec = 0;
                // N3CHT000043
                if (this.hour >= 24) {
                    this.hour -= 24;
                    this.day += 1;
                }
                if (this.month < 0) {
                    smon = -1 - this.day;
                    this.month = 1;
                }
                else if (this.month > 11) {
                    smon = this.month - 12;
                    this.month = 12;
                }
                if (this.day < 1) {
                    sday = -1 - this.day;
                    this.day = 1;
                }
                else if (this.day > 28 && this.month == 2) {
                    sday = this.day - 28;
                    this.day = 28;
                }
                else if (this.day > 30 && (this.month == 4 || this.month == 4 || this.month == 6 || this.month == 9 || this.month == 11)) {
                    sday = this.day - 30;
                    this.day = 30;
                }
                else if (this.day > 31) {
                    sday = this.day - 31;
                    this.day = 31;
                }
                if (this.second > 59) {
                    ssec = this.second - 59;
                    this.second = 59;
                }
                var smin = 0;
                if (this.minute > 59) {
                    smin = this.minute - 59;
                    this.minute = 59;
                }
                return new Date(this.year, this.month, this.day, this.hour, this.minute, this.second);
                //AddDays(sday).AddMonths(smon).AddSeconds(ssec).AddMinutes(smin);
            };
            _timeHelper.prototype.getTimeAsDouble = function () {
                return this.getTimeAsDateTime().valueOf();
            };
            _timeHelper.tround = function (tval, tunit, roundup) {
                var test = ((tval / tunit) * tunit);
                test = test - (test % 1);
                if (roundup && test != tval) {
                    tunit = tunit - (tunit % 1);
                    test += tunit;
                }
                return test;
            };
            _timeHelper.RoundTime = function (timevalue, unit, roundup) {
                //TimeSpan ts = TimeSpan.FromDays(unit);
                var tunit = unit * 24 * 60 * 60; // (long) ts.TotalSeconds;
                if (tunit > 0) {
                    var th = new _timeHelper(timevalue);
                    if (tunit < _tmInc.minute) {
                        th.second = this.tround(th.second, tunit, roundup);
                        return th.getTimeAsDouble();
                    }
                    th.second = 0;
                    if (tunit < _tmInc.hour) {
                        tunit /= _tmInc.minute;
                        th.minute = this.tround(th.minute, tunit, roundup);
                        return th.getTimeAsDouble();
                    }
                    th.minute = 0;
                    if (tunit < _tmInc.day) {
                        tunit /= _tmInc.hour;
                        th.hour = this.tround(th.hour, tunit, roundup);
                        return th.getTimeAsDouble();
                    }
                    th.hour = 0;
                    if (tunit < _tmInc.month) {
                        tunit /= _tmInc.day;
                        th.day = this.tround(th.day, tunit, roundup);
                        return th.getTimeAsDouble();
                    }
                    th.day = 1;
                    if (tunit < _tmInc.year) {
                        tunit /= _tmInc.month;
                        // Jan - is good enough
                        if (th.month != 1)
                            th.month = this.tround(th.month, tunit, roundup);
                        return th.getTimeAsDouble();
                    }
                    th.month = 1;
                    tunit /= _tmInc.year;
                    th.year = this.tround(th.year, tunit, roundup);
                    return th.getTimeAsDouble();
                }
                else {
                    // alext 26-Sep-03
                    //double td = ts.TotalSeconds;
                    var td = timevalue;
                    var tx = td - tunit;
                    var tz = ((tx / unit)) * unit; // alext 12-Sep-06 int -> long VNCHT000517
                    if (roundup && tz != tx)
                        tz += unit;
                    td = tunit + tz;
                    return td;
                }
            };
            _timeHelper.TimeSpanFromTmInc = function (ti) {
                var rv = _timeSpan.fromSeconds(1);
                if (ti != _tmInc.maxtime) {
                    if (ti > _tmInc.tickf1) {
                        rv = _timeSpan.fromSeconds(ti);
                    }
                    else {
                        var rti = ti;
                        var ticks = 1;
                        rti += 7; // rti is now power of 10 of number of Ticks
                        while (rti > 0) {
                            ticks *= 10;
                            rti--;
                        }
                        rv = new _timeSpan(ticks);
                    }
                }
                return rv;
            };
            _timeHelper.manualTimeInc = function (manualformat) {
                var minSpan = _tmInc.second;
                // only interested in the lowest increment of the format,
                // so it is not necessary that the format be valid, but it
                // must exist as a string to process.
                if (manualformat == null || manualformat.length == 0)
                    return minSpan;
                var f = manualformat.indexOf('f');
                if (f >= 0) {
                    var rv = -1;
                    if (f > 0 && manualformat.substr(f - 1, 1) == '%') {
                        rv = -1;
                    }
                    else {
                        for (var i = 1; i < 6; i++) {
                            // alext 26-Sep-03
                            if ((f + i) >= manualformat.length)
                                break;
                            //
                            var ss = manualformat.substr(f + i, 1);
                            if (ss != 'f')
                                break;
                            //if (!manualformat.Substring(f + i, 1).Equals('f'))
                            //  break;
                            rv--;
                        }
                    }
                    minSpan = rv;
                }
                else if (manualformat.indexOf('s') >= 0)
                    minSpan = _tmInc.second;
                else if (manualformat.indexOf('m') >= 0)
                    minSpan = _tmInc.minute;
                else if (manualformat.indexOf('h') >= 0 || manualformat.indexOf('H'))
                    minSpan = _tmInc.hour;
                else if (manualformat.indexOf('d') >= 0)
                    minSpan = _tmInc.day;
                else if (manualformat.indexOf('M') >= 0)
                    minSpan = _tmInc.month;
                else if (manualformat.indexOf('y') >= 0)
                    minSpan = _tmInc.year;
                return minSpan;
            };
            _timeHelper.getNiceInc = function (tik, ts, mult) {
                for (var i = 0; i < tik.length; i++) {
                    var tikm = tik[i] * mult;
                    if (ts <= tikm)
                        return tikm;
                }
                return 0;
            };
            _timeHelper.NiceTimeSpan = function (ts, manualformat) {
                var minSpan = _tmInc.second;
                if (manualformat != null && manualformat.length > 0)
                    minSpan = _timeHelper.manualTimeInc(manualformat);
                var tsinc = 0;
                var tinc = 0;
                // have the minimum required by format.
                if (minSpan < _tmInc.second) {
                    // alext 10-Jan-2011
                    //if (ts.TotalSeconds < 1.0)
                    if (ts.TotalSeconds < 10.0) 
                    //
                    {
                        tsinc = ts.Ticks;
                        tinc = _timeHelper.TimeSpanFromTmInc(minSpan).Ticks;
                        while (tsinc > 10 * tinc)
                            tinc *= 10;
                        // alext 10-Jan-2011
                        var tinc1 = tinc;
                        if (tsinc > tinc1)
                            tinc1 *= 2;
                        if (tsinc > tinc1)
                            tinc1 = 5 * tinc;
                        if (tsinc > tinc1)
                            tinc1 = 10 * tinc;
                        //
                        return new _timeSpan(tinc1);
                    }
                }
                // alext 25-Jan-06
                // when tsinc < ts the annos are overlapping
                // using larger integer
                // tsinc = (long)ts.TotalSeconds;
                tsinc = Math.ceil(ts.TotalSeconds);
                if (tsinc == 0)
                    return _timeHelper.TimeSpanFromTmInc(minSpan);
                tinc = 1;
                if (minSpan < _tmInc.minute) {
                    // seconds
                    if (tsinc < _tmInc.minute) {
                        tinc = _timeHelper.getNiceInc([1, 2, 5, 10, 15, 30], tsinc, minSpan); // alext 11-Mar-11 TimeSpanFromTmInc(minSpan).Ticks  /*(long)minSpan*/); // alext 25-Jan-06 added 2 as 'nice' number
                        if (tinc != 0)
                            return _timeSpan.fromSeconds(tinc);
                    }
                    minSpan = _tmInc.minute;
                }
                if (minSpan < _tmInc.hour) {
                    // minutes
                    if (tsinc < _tmInc.hour) {
                        tinc = _timeHelper.getNiceInc([1, 2, 5, 10, 15, 30], tsinc, minSpan); // alext 25-Jan-06 added 2 as 'nice' number
                        if (tinc != 0)
                            return _timeSpan.fromSeconds(tinc);
                    }
                    minSpan = _tmInc.hour;
                }
                if (minSpan < _tmInc.day) {
                    // hours
                    if (tsinc < _tmInc.day) {
                        tinc = _timeHelper.getNiceInc([1, 3, 6, 12], tsinc, minSpan);
                        if (tinc != 0)
                            return _timeSpan.fromSeconds(tinc);
                    }
                    minSpan = _tmInc.day;
                }
                if (minSpan < _tmInc.month) {
                    // days
                    if (tsinc < _tmInc.month) {
                        tinc = _timeHelper.getNiceInc([1, 2, 7, 14], tsinc, minSpan);
                        if (tinc != 0)
                            return _timeSpan.fromSeconds(tinc);
                    }
                    minSpan = _tmInc.month;
                }
                if (minSpan < _tmInc.year) {
                    // months
                    if (tsinc < _tmInc.year) {
                        tinc = _timeHelper.getNiceInc([1, 2, 3, 4, 6], tsinc, minSpan);
                        if (tinc != 0)
                            return _timeSpan.fromSeconds(tinc);
                    }
                    minSpan = _tmInc.year;
                }
                // years
                tinc = 100 * _tmInc.year;
                if (tsinc < tinc) {
                    tinc = _timeHelper.getNiceInc([1, 2, 5, 10, 20, 50], tsinc, minSpan);
                    if (tinc == 0)
                        tinc = 100 * _tmInc.year;
                }
                return _timeSpan.fromSeconds(tinc);
            };
            _timeHelper.NiceTimeUnit = function (timeinc, manualformat) {
                var tsRange = _timeSpan.fromDays(timeinc);
                tsRange = _timeHelper.NiceTimeSpan(tsRange, manualformat);
                return tsRange.TotalDays;
            };
            _timeHelper.GetTimeDefaultFormat = function (maxdate, mindate) {
                if (isNaN(maxdate) || isNaN(mindate)) {
                    return '';
                }
                var format = 's';
                var tsRange = _timeSpan.fromSeconds(0.001 * (maxdate - mindate)); //amax.Subtract(amin);
                var range = tsRange.TotalSeconds;
                if (range >= _tmInc.year) {
                    format = 'yyyy';
                }
                else if (range >= _tmInc.month) {
                    format = 'MMM yyyy';
                }
                else if (range >= _tmInc.day) {
                    format = 'MMM d';
                }
                else if (range >= _tmInc.hour) {
                    format = 'ddd H:mm';
                }
                else if (range >= 0.5 * _tmInc.hour) {
                    format = 'H:mm';
                }
                else if (range >= 1) {
                    format = 'H:mm:ss';
                }
                else if (range > 0) {
                    var ticks = tsRange.Ticks;
                    format = 's' + '.'; //System.Globalization.NumberFormatInfo.CurrentInfo.NumberDecimalSeparator;
                    while (ticks < _timeSpan.TicksPerSecond) {
                        ticks *= 10;
                        format += 'f';
                    }
                }
                return format;
            };
            _timeHelper.secInYear = (24 * 60 * 60);
            return _timeHelper;
        }());
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Axis.js.map