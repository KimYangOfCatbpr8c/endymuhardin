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
         * Specifies whether and where the Series is visible.
         */
        (function (SeriesVisibility) {
            /** The series is visible on the plot and in the legend. */
            SeriesVisibility[SeriesVisibility["Visible"] = 0] = "Visible";
            /** The series is visible only on the plot. */
            SeriesVisibility[SeriesVisibility["Plot"] = 1] = "Plot";
            /** The series is visible only in the legend. */
            SeriesVisibility[SeriesVisibility["Legend"] = 2] = "Legend";
            /** The series is hidden. */
            SeriesVisibility[SeriesVisibility["Hidden"] = 3] = "Hidden";
        })(chart_1.SeriesVisibility || (chart_1.SeriesVisibility = {}));
        var SeriesVisibility = chart_1.SeriesVisibility;
        /**
         * Specifies the type of marker to use for the @see:Series.symbolMarker
         * property.
         *
         * Applies to Scatter, LineSymbols, and SplineSymbols chart types.
         */
        (function (Marker) {
            /**
             * Uses a circle to mark each data point.
             */
            Marker[Marker["Dot"] = 0] = "Dot";
            /**
             * Uses a square to mark each data point.
             */
            Marker[Marker["Box"] = 1] = "Box";
        })(chart_1.Marker || (chart_1.Marker = {}));
        var Marker = chart_1.Marker;
        ;
        var DataArray = (function () {
            function DataArray() {
            }
            return DataArray;
        }());
        /**
         * Provides arguments for @see:Series events.
         */
        var SeriesEventArgs = (function (_super) {
            __extends(SeriesEventArgs, _super);
            /**
             * Initializes a new instance of the @see:SeriesEventArgs class.
             *
             * @param series Specifies the @see:Series object affected by this event.
             */
            function SeriesEventArgs(series) {
                _super.call(this);
                this._series = wijmo.asType(series, SeriesBase);
            }
            Object.defineProperty(SeriesEventArgs.prototype, "series", {
                /**
                 * Gets the @see:Series object affected by this event.
                 */
                get: function () {
                    return this._series;
                },
                enumerable: true,
                configurable: true
            });
            return SeriesEventArgs;
        }(wijmo.EventArgs));
        chart_1.SeriesEventArgs = SeriesEventArgs;
        /**
         * Represents a series of data points to display in the chart.
         *
         */
        var SeriesBase = (function () {
            function SeriesBase() {
                this._altStyle = null;
                this._symbolMarker = Marker.Dot;
                this._visibility = SeriesVisibility.Visible;
                /**
                 * Occurs when series is rendering.
                 */
                this.rendering = new wijmo.Event();
            }
            Object.defineProperty(SeriesBase.prototype, "style", {
                //--------------------------------------------------------------------------
                // ** implementation
                /**
                 * Gets or sets the series style.
                 */
                get: function () {
                    return this._style;
                },
                set: function (value) {
                    if (value != this._style) {
                        this._style = value;
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SeriesBase.prototype, "altStyle", {
                /**
                 * Gets or sets the alternative style for the series. The values from
                 * this property will be used for negative values in Bar, Column,
                 * and Scatter charts; and for rising values in financial chart types
                 * like Candlestick, LineBreak, EquiVolume etc.
                 *
                 * If no value is provided, the default styles will be used.
                 */
                get: function () {
                    return this._altStyle;
                },
                set: function (value) {
                    if (value != this._altStyle) {
                        this._altStyle = value;
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SeriesBase.prototype, "symbolStyle", {
                /**
                 * Gets or sets the series symbol style.
                 * Applies to Scatter, LineSymbols, and SplineSymbols chart types.
                 */
                get: function () {
                    return this._symbolStyle;
                },
                set: function (value) {
                    if (value != this._symbolStyle) {
                        this._symbolStyle = value;
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SeriesBase.prototype, "symbolSize", {
                /**
                 * Gets or sets the size(in pixels) of the symbols used to render this @see:Series.
                 * Applies to Scatter, LineSymbols, and SplineSymbols chart types.
                 */
                get: function () {
                    return this._symbolSize;
                },
                set: function (value) {
                    if (value != this._symbolSize) {
                        this._symbolSize = wijmo.asNumber(value, true, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            SeriesBase.prototype._getSymbolSize = function () {
                return this.symbolSize != null ? this.symbolSize : this.chart.symbolSize;
            };
            Object.defineProperty(SeriesBase.prototype, "symbolMarker", {
                /**
                 * Gets or sets the shape of marker to use for each data point in the series.
                 * Applies to Scatter, LineSymbols, and SplineSymbols chart types.
                 */
                get: function () {
                    return this._symbolMarker;
                },
                set: function (value) {
                    if (value != this._symbolMarker) {
                        this._symbolMarker = wijmo.asEnum(value, Marker, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SeriesBase.prototype, "binding", {
                /**
                 * Gets or sets the name of the property that contains Y values for the series.
                 */
                get: function () {
                    return this._binding ? this._binding : this._chart ? this._chart.binding : null;
                },
                set: function (value) {
                    if (value != this._binding) {
                        this._binding = wijmo.asString(value, true);
                        this._clearValues();
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SeriesBase.prototype, "bindingX", {
                /**
                 * Gets or sets the name of the property that contains X values for the series.
                 */
                get: function () {
                    return this._bindingX ? this._bindingX : this._chart ? this._chart.bindingX : null;
                },
                set: function (value) {
                    if (value != this._bindingX) {
                        this._bindingX = wijmo.asString(value, true);
                        this._clearValues();
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SeriesBase.prototype, "name", {
                /**
                 * Gets or sets the series name.
                 *
                 * The series name is displayed in the chart legend. Any series without a name
                 * does not appear in the legend.
                 */
                get: function () {
                    return this._name;
                },
                set: function (value) {
                    this._name = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SeriesBase.prototype, "itemsSource", {
                /**
                 * Gets or sets the array or @see:ICollectionView object that contains the series data.
                 */
                get: function () {
                    return this._itemsSource;
                },
                set: function (value) {
                    if (value != this._itemsSource) {
                        // unbind current collection view
                        if (this._cv) {
                            this._cv.currentChanged.removeHandler(this._cvCurrentChanged, this);
                            this._cv.collectionChanged.removeHandler(this._cvCollectionChanged, this);
                            this._cv = null;
                        }
                        // save new data source and collection view
                        this._itemsSource = value;
                        this._cv = wijmo.asCollectionView(value);
                        // bind new collection view
                        if (this._cv != null) {
                            this._cv.currentChanged.addHandler(this._cvCurrentChanged, this);
                            this._cv.collectionChanged.addHandler(this._cvCollectionChanged, this);
                        }
                        this._clearValues();
                        this._itemsSource = value;
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SeriesBase.prototype, "collectionView", {
                /**
                 * Gets the @see:ICollectionView object that contains the data for this series.
                 */
                get: function () {
                    return this._cv ? this._cv : this._chart ? this._chart.collectionView : null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SeriesBase.prototype, "chart", {
                /**
                 * Gets the @see:FlexChart object that owns this series.
                 */
                get: function () {
                    return this._chart;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SeriesBase.prototype, "hostElement", {
                /**
                 * Gets the series host element.
                 */
                get: function () {
                    return this._hostElement;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SeriesBase.prototype, "legendElement", {
                /**
                 * Gets the series element in the legend.
                 */
                get: function () {
                    return this._legendElement;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SeriesBase.prototype, "cssClass", {
                /**
                 * Gets or sets the series CSS class.
                 */
                get: function () {
                    return this._cssClass;
                },
                set: function (value) {
                    this._cssClass = wijmo.asString(value, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SeriesBase.prototype, "visibility", {
                /**
                 * Gets or sets an enumerated value indicating whether and where the series appears.
                 */
                get: function () {
                    return this._visibility;
                },
                set: function (value) {
                    if (value != this._visibility) {
                        this._visibility = wijmo.asEnum(value, SeriesVisibility);
                        this._clearValues();
                        this._invalidate();
                        if (this._chart) {
                            this._chart.onSeriesVisibilityChanged(new SeriesEventArgs(this));
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the @see:rendering event.
             *
             * @param engine The @see:IRenderEngine object used to render the series.
             */
            SeriesBase.prototype.onRendering = function (engine) {
                this.rendering.raise(this, new chart_1.RenderEventArgs(engine));
            };
            /**
             * Gets a @see:HitTestInfo object with information about the specified point.
             *
             * @param pt The point to investigate, in window coordinates.
             * @param y The Y coordinate of the point (if the first parameter is a number).
             */
            SeriesBase.prototype.hitTest = function (pt, y) {
                if (wijmo.isNumber(pt) && wijmo.isNumber(y)) {
                    pt = new wijmo.Point(pt, y);
                }
                else if (pt instanceof MouseEvent) {
                    pt = new wijmo.Point(pt.pageX, pt.pageY);
                }
                wijmo.asType(pt, wijmo.Point);
                if (this._chart) {
                    return this._chart._hitTestSeries(pt, this._chart.series.indexOf(this));
                }
                else {
                    return null;
                }
            };
            /**
             * Gets the plot element that corresponds to the specified point index.
             *
             * @param pointIndex The index of the data point.
             */
            SeriesBase.prototype.getPlotElement = function (pointIndex) {
                if (this.hostElement) {
                    if (pointIndex < this._pointIndexes.length) {
                        var elementIndex = this._pointIndexes[pointIndex];
                        if (elementIndex < this.hostElement.childNodes.length) {
                            return this.hostElement.childNodes[elementIndex];
                        }
                    }
                }
                return null;
            };
            Object.defineProperty(SeriesBase.prototype, "axisX", {
                /**
                 * Gets or sets the x-axis for the series.
                 */
                get: function () {
                    return this._axisX;
                },
                set: function (value) {
                    if (value != this._axisX) {
                        this._axisX = wijmo.asType(value, chart_1.Axis, true);
                        if (this._axisX) {
                            var chart = this._axisX._chart = this._chart;
                            if (chart && chart.axes.indexOf(this._axisX) == -1) {
                                chart.axes.push(this._axisX);
                            }
                        }
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SeriesBase.prototype, "axisY", {
                /**
                 * Gets or sets the y-axis for the series.
                 */
                get: function () {
                    return this._axisY;
                },
                set: function (value) {
                    if (value != this._axisY) {
                        this._axisY = wijmo.asType(value, chart_1.Axis, true);
                        if (this._axisY) {
                            var chart = this._axisY._chart = this._chart;
                            if (chart && chart.axes.indexOf(this._axisY) == -1) {
                                chart.axes.push(this._axisY);
                            }
                        }
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            //--------------------------------------------------------------------------
            // ** implementation
            SeriesBase.prototype.getDataType = function (dim) {
                if (dim == 0) {
                    return this._valueDataType;
                }
                else if (dim == 1) {
                    return this._xvalueDataType;
                }
                return null;
            };
            SeriesBase.prototype.getValues = function (dim) {
                if (dim == 0) {
                    if (this._values == null) {
                        this._valueDataType = null;
                        if (this._cv != null) {
                            var da = this._bindValues(this._cv.items, this._getBinding(0));
                            this._values = da.values;
                            this._valueDataType = da.dataType;
                        }
                        else if (this.binding != null) {
                            if (this._chart != null && this._chart.collectionView != null) {
                                var da = this._bindValues(this._chart.collectionView.items, this._getBinding(0));
                                this._values = da.values;
                                this._valueDataType = da.dataType;
                            }
                        }
                    }
                    return this._values;
                }
                else if (dim == 1) {
                    if (this._xvalues == null) {
                        this._xvalueDataType = null;
                        var base = this;
                        if (this.bindingX != null) {
                            if (base._cv != null) {
                                var da = this._bindValues(base._cv.items, this.bindingX, true);
                                this._xvalueDataType = da.dataType;
                                this._xvalues = da.values;
                            }
                            else {
                                if (this._bindingX == null) {
                                    return null;
                                }
                                if (base._chart != null && base._chart.collectionView != null) {
                                    var da = this._bindValues(base._chart.collectionView.items, this.bindingX, true);
                                    this._xvalueDataType = da.dataType;
                                    this._xvalues = da.values;
                                }
                            }
                        }
                    }
                    return this._xvalues;
                }
                return null;
            };
            /**
              * Draw a legend item at the specified position.
              *
              * @param engine The rendering engine to use.
              * @param rect The position of the legend item.
              * @param index Index of legend item(for series with multiple legend items).
              */
            SeriesBase.prototype.drawLegendItem = function (engine, rect, index) {
                var chartType = this._getChartType();
                if (chartType == null) {
                    chartType = this._chart._getChartType();
                }
                if (chartType === chart_1.ChartType.Funnel) {
                    this._drawFunnelLegendItem(engine, rect, index, this.style, this.symbolStyle);
                }
                else {
                    this._drawLegendItem(engine, rect, chartType, this.name, this.style, this.symbolStyle);
                }
            };
            /**
             * Measures height and width of the legend item.
             *
             * @param engine The rendering engine to use.
             * @param index Index of legend item(for series with multiple legend items).
             */
            SeriesBase.prototype.measureLegendItem = function (engine, index) {
                var chartType = this._getChartType();
                if (chartType == null) {
                    chartType = this._chart._getChartType();
                }
                if (chartType === chart_1.ChartType.Funnel) {
                    return this._measureLegendItem(engine, this._getFunnelLegendName(index));
                }
                else {
                    return this._measureLegendItem(engine, this.name);
                }
            };
            /**
             * Returns number of series items in the legend.
             */
            SeriesBase.prototype.legendItemLength = function () {
                var chartType = this._getChartType();
                if (chartType == null) {
                    chartType = this._chart._getChartType();
                }
                if (chartType === chart_1.ChartType.Funnel) {
                    if (this._chart._xlabels && this._chart._xlabels.length) {
                        return this._chart._xlabels.length;
                    }
                    return 1;
                }
                else {
                    return 1;
                }
            };
            /**
             * Returns series bounding rectangle in data coordinates.
             *
             * If getDataRect() returns null, the limits are calculated automatically based on the data values.
             */
            SeriesBase.prototype.getDataRect = function () {
                return null;
            };
            SeriesBase.prototype._getChartType = function () {
                return this._chartType;
            };
            /**
             * Clears any cached data values.
             */
            SeriesBase.prototype._clearValues = function () {
                this._values = null;
                this._xvalues = null;
            };
            SeriesBase.prototype._getBinding = function (index) {
                var binding = null;
                if (this.binding) {
                    var props = this.binding.split(',');
                    if (props && props.length > index) {
                        binding = props[index].trim();
                    }
                }
                return binding;
            };
            SeriesBase.prototype._getBindingValues = function (index) {
                var items;
                if (this._cv != null) {
                    items = this._cv.items;
                }
                else if (this._chart != null && this._chart.collectionView != null) {
                    items = this._chart.collectionView.items;
                }
                var da = this._bindValues(items, this._getBinding(index));
                return da.values;
            };
            SeriesBase.prototype._getItem = function (pointIndex) {
                var item = null;
                var items = null;
                if (this.itemsSource != null) {
                    if (this._cv != null)
                        items = this._cv.items;
                    else
                        items = this.itemsSource;
                }
                else if (this._chart.itemsSource != null) {
                    if (this._chart.collectionView != null) {
                        items = this._chart.collectionView.items;
                    }
                    else {
                        items = this._chart.itemsSource;
                    }
                }
                if (items != null) {
                    item = items[pointIndex];
                }
                return item;
            };
            SeriesBase.prototype._getLength = function () {
                var len = 0;
                var items = null;
                if (this.itemsSource != null) {
                    if (this._cv != null)
                        items = this._cv.items;
                    else
                        items = this.itemsSource;
                }
                else if (this._chart.itemsSource != null) {
                    if (this._chart.collectionView != null) {
                        items = this._chart.collectionView.items;
                    }
                    else {
                        items = this._chart.itemsSource;
                    }
                }
                if (items != null) {
                    len = items.length;
                }
                return len;
            };
            SeriesBase.prototype._setPointIndex = function (pointIndex, elementIndex) {
                this._pointIndexes[pointIndex] = elementIndex;
            };
            SeriesBase.prototype._getDataRect = function () {
                var values = this.getValues(0);
                var xvalues = this.getValues(1);
                if (values) {
                    var xmin = NaN, ymin = NaN, xmax = NaN, ymax = NaN;
                    var len = values.length;
                    for (var i = 0; i < len; i++) {
                        var val = values[i];
                        if (isFinite(val)) {
                            if (isNaN(ymin)) {
                                ymin = ymax = val;
                            }
                            else {
                                if (val < ymin) {
                                    ymin = val;
                                }
                                else if (val > ymax) {
                                    ymax = val;
                                }
                            }
                        }
                        if (xvalues) {
                            var xval = xvalues[i];
                            if (isFinite(xval)) {
                                if (isNaN(xmin)) {
                                    xmin = xmax = xval;
                                }
                                else {
                                    if (xval < xmin) {
                                        xmin = xval;
                                    }
                                    else if (val > ymax) {
                                        xmax = xval;
                                    }
                                }
                            }
                        }
                    }
                    if (!xvalues) {
                        xmin = 0;
                        xmax = len - 1;
                    }
                    if (!isNaN(ymin)) {
                        return new wijmo.Rect(xmin, ymin, xmax - xmin, ymax - ymin);
                    }
                }
                return null;
            };
            SeriesBase.prototype._isCustomAxisX = function () {
                if (this._axisX) {
                    if (this._chart) {
                        return this._axisX != this.chart.axisX;
                    }
                    else {
                        return true;
                    }
                }
                else {
                    return false;
                }
            };
            SeriesBase.prototype._isCustomAxisY = function () {
                if (this._axisY) {
                    if (this._chart) {
                        return this._axisY != this.chart.axisY;
                    }
                    else {
                        return true;
                    }
                }
                else {
                    return false;
                }
            };
            SeriesBase.prototype._getAxisX = function () {
                var ax = null;
                if (this.axisX) {
                    ax = this.axisX;
                }
                else if (this.chart) {
                    ax = this.chart.axisX;
                }
                return ax;
            };
            SeriesBase.prototype._getAxisY = function () {
                var ay = null;
                if (this.axisY) {
                    ay = this.axisY;
                }
                else if (this.chart) {
                    ay = this.chart.axisY;
                }
                return ay;
            };
            SeriesBase.prototype._measureLegendItem = function (engine, text) {
                var sz = new wijmo.Size();
                sz.width = chart_1.Series._LEGEND_ITEM_WIDTH;
                sz.height = chart_1.Series._LEGEND_ITEM_HEIGHT;
                if (this._name) {
                    var tsz = engine.measureString(text, chart_1.FlexChart._CSS_LABEL);
                    sz.width += tsz.width;
                    if (sz.height < tsz.height) {
                        sz.height = tsz.height;
                    }
                }
                ;
                sz.width += 3 * chart_1.Series._LEGEND_ITEM_MARGIN;
                sz.height += 2 * chart_1.Series._LEGEND_ITEM_MARGIN;
                return sz;
            };
            SeriesBase.prototype._drawFunnelLegendItem = function (engine, rect, index, style, symbolStyle) {
                engine.strokeWidth = 1;
                var marg = chart_1.Series._LEGEND_ITEM_MARGIN;
                var fill = null;
                var stroke = null;
                if (fill === null)
                    fill = this._chart._getColorLight(index);
                if (stroke === null)
                    stroke = this._chart._getColor(index);
                engine.fill = fill;
                engine.stroke = stroke;
                var yc = rect.top + 0.5 * rect.height;
                var wsym = chart_1.Series._LEGEND_ITEM_WIDTH;
                var hsym = chart_1.Series._LEGEND_ITEM_HEIGHT;
                var name = this._getFunnelLegendName(index);
                engine.drawRect(rect.left + marg, yc - 0.5 * hsym, wsym, hsym, null, symbolStyle ? symbolStyle : style);
                if (name) {
                    chart_1.FlexChart._renderText(engine, name, new wijmo.Point(rect.left + hsym + 2 * marg, yc), 0, 1, chart_1.FlexChart._CSS_LABEL);
                }
            };
            SeriesBase.prototype._getFunnelLegendName = function (index) {
                var name;
                if (this._chart._xlabels && this._chart._xlabels.length) {
                    name = this._chart._xlabels[index];
                }
                if (!name) {
                    name = this.name;
                }
                return name;
            };
            SeriesBase.prototype._drawLegendItem = function (engine, rect, chartType, text, style, symbolStyle) {
                engine.strokeWidth = 1;
                var marg = chart_1.Series._LEGEND_ITEM_MARGIN;
                var fill = null;
                var stroke = null;
                if (fill === null)
                    fill = this._chart._getColorLight(this._chart.series.indexOf(this));
                if (stroke === null)
                    stroke = this._chart._getColor(this._chart.series.indexOf(this));
                engine.fill = fill;
                engine.stroke = stroke;
                var yc = rect.top + 0.5 * rect.height;
                var wsym = chart_1.Series._LEGEND_ITEM_WIDTH;
                var hsym = chart_1.Series._LEGEND_ITEM_HEIGHT;
                switch (chartType) {
                    case chart_1.ChartType.Area:
                    case chart_1.ChartType.SplineArea:
                        {
                            engine.drawRect(rect.left + marg, yc - 0.5 * hsym, wsym, hsym, null, style);
                        }
                        break;
                    case chart_1.ChartType.Bar:
                    case chart_1.ChartType.Column:
                        {
                            engine.drawRect(rect.left + marg, yc - 0.5 * hsym, wsym, hsym, null, symbolStyle ? symbolStyle : style);
                        }
                        break;
                    case chart_1.ChartType.Scatter:
                    case chart_1.ChartType.Bubble:
                        {
                            var rx = 0.3 * wsym;
                            var ry = 0.3 * hsym;
                            if (this.symbolMarker == Marker.Box) {
                                engine.drawRect(rect.left + marg + 0.5 * wsym - rx, yc - ry, 2 * rx, 2 * ry, null, symbolStyle);
                            }
                            else {
                                engine.drawEllipse(rect.left + 0.5 * wsym + marg, yc, rx, ry, null, symbolStyle);
                            }
                        }
                        break;
                    case chart_1.ChartType.Line:
                    case chart_1.ChartType.Spline:
                        {
                            engine.drawLine(rect.left + marg, yc, rect.left + wsym + marg, yc, null, style);
                        }
                        break;
                    case chart_1.ChartType.LineSymbols:
                    case chart_1.ChartType.SplineSymbols:
                        {
                            var rx = 0.3 * wsym;
                            var ry = 0.3 * hsym;
                            if (this.symbolMarker == Marker.Box) {
                                engine.drawRect(rect.left + marg + 0.5 * wsym - rx, yc - ry, 2 * rx, 2 * ry, null, symbolStyle);
                            }
                            else {
                                engine.drawEllipse(rect.left + 0.5 * wsym + marg, yc, rx, ry, null, symbolStyle);
                            }
                            engine.drawLine(rect.left + marg, yc, rect.left + wsym + marg, yc, null, style);
                        }
                        break;
                    case chart_1.ChartType.Candlestick:
                    case chart_1.ChartType.HighLowOpenClose:
                        {
                            engine.drawLine(rect.left + marg, yc, rect.left + wsym + marg, yc, null, symbolStyle ? symbolStyle : style);
                        }
                        break;
                }
                if (this._name) {
                    chart_1.FlexChart._renderText(engine, text, new wijmo.Point(rect.left + hsym + 2 * marg, yc), 0, 1, chart_1.FlexChart._CSS_LABEL);
                }
            };
            SeriesBase.prototype._cvCollectionChanged = function (sender, e) {
                this._clearValues();
                this._invalidate();
            };
            // updates selection to sync with data source
            SeriesBase.prototype._cvCurrentChanged = function (sender, e) {
                if (this._chart && this._chart._notifyCurrentChanged) {
                    this._invalidate();
                }
            };
            SeriesBase.prototype._bindValues = function (items, binding, isX) {
                if (isX === void 0) { isX = false; }
                var values;
                var dataType;
                if (items != null) {
                    var len = items.length;
                    values = new Array(items.length);
                    for (var i = 0; i < len; i++) {
                        var val = items[i];
                        if (binding != null) {
                            val = val[binding];
                        }
                        if (wijmo.isNumber(val)) {
                            values[i] = val;
                            dataType = wijmo.DataType.Number;
                        }
                        else if (wijmo.isDate(val)) {
                            values[i] = val.valueOf();
                            dataType = wijmo.DataType.Date;
                        }
                        else if (isX && val) {
                            // most likely it's category axis
                            // return appropriate values
                            values[i] = i;
                            dataType = wijmo.DataType.Number;
                        }
                    }
                }
                var darr = new DataArray();
                darr.values = values;
                darr.dataType = dataType;
                return darr;
            };
            SeriesBase.prototype._invalidate = function () {
                if (this._chart) {
                    this._chart.invalidate();
                }
            };
            SeriesBase.prototype._indexToPoint = function (pointIndex) {
                if (pointIndex >= 0 && pointIndex < this._values.length) {
                    var y = this._values[pointIndex];
                    var x = this._xvalues ? this._xvalues[pointIndex] : pointIndex;
                    return new wijmo.Point(x, y);
                }
                return null;
            };
            SeriesBase.prototype._getSymbolFill = function (seriesIndex) {
                var fill = null;
                if (this.symbolStyle) {
                    fill = this.symbolStyle.fill;
                }
                if (!fill && this.style) {
                    fill = this.style.fill;
                }
                if (!fill && this.chart) {
                    fill = this.chart._getColorLight(seriesIndex);
                }
                return fill;
            };
            SeriesBase.prototype._getSymbolStroke = function (seriesIndex) {
                var stroke = null;
                if (this.symbolStyle) {
                    stroke = this.symbolStyle.stroke;
                }
                if (!stroke && this.style) {
                    stroke = this.style.stroke;
                }
                if (!stroke && this.chart) {
                    stroke = this.chart._getColor(seriesIndex);
                }
                return stroke;
            };
            // convenience method to return symbol stroke value from
            // the altStyle property
            SeriesBase.prototype._getAltSymbolStroke = function (seriesIndex) {
                var stroke = null;
                if (this.altStyle) {
                    stroke = this.altStyle.stroke;
                }
                return stroke;
            };
            // convenience method to return symbol fill value from
            // the altStyle property
            SeriesBase.prototype._getAltSymbolFill = function (seriesIndex) {
                var fill = null;
                if (this.altStyle) {
                    fill = this.altStyle.fill;
                }
                return fill;
            };
            SeriesBase.prototype._renderLabels = function (engine, smap, chart, lblAreas) {
                var len = smap.length, lbl = chart.dataLabel, pos = lbl.position, bdr = lbl.border, offset = lbl.offset, line = lbl.connectingLine, marg = 2;
                if (offset === undefined) {
                    offset = line ? 16 : 0;
                }
                if (bdr) {
                    offset -= marg;
                }
                var bcss = 'wj-data-label-border';
                for (var j = 0; j < len; j++) {
                    var dp = wijmo.asType(smap[j].tag, chart_1._DataPoint, true);
                    if (dp) {
                        var ht = new chart_1.HitTestInfo(chart, pt);
                        ht._setDataPoint(dp);
                        var s = chart._getLabelContent(ht, lbl.content);
                        var pt = this._getLabelPoint(dp);
                        var map = smap[j];
                        if (map instanceof chart_1._RectArea) {
                            var ra = map;
                            if (chart._isRotated())
                                pt.y = ra.rect.top + 0.5 * ra.rect.height;
                            else
                                pt.x = ra.rect.left + 0.5 * ra.rect.width;
                        }
                        else if (map instanceof chart_1._FunnelSegment) {
                            var fs = map;
                            pt.x = fs.center.x;
                            pt.y = fs.center.y;
                            pos = pos == null ? chart_1.LabelPosition.Center : pos;
                        }
                        if (!chart._plotRect.contains(pt)) {
                            continue;
                        }
                        var ea = new chart_1.DataLabelRenderEventArgs(engine, ht, pt, s);
                        if (!lbl.onRendering(ea)) {
                            s = ea.text;
                            pt = ea.point;
                            var lrct = this._renderLabel(engine, s, j, pos, offset, pt, line, marg);
                            if (bdr && lrct) {
                                engine.drawRect(lrct.left - marg, lrct.top - marg, lrct.width + 2 * marg, lrct.height + 2 * marg, bcss);
                            }
                            if (lrct) {
                                var area = new chart_1._RectArea(lrct);
                                area.tag = dp;
                                lblAreas.push(area);
                            }
                        }
                    }
                }
            };
            SeriesBase.prototype._getLabelPoint = function (dataPoint) {
                var ax = this._getAxisX(), ay = this._getAxisY();
                return new wijmo.Point(ax.convert(dataPoint.dataX), ay.convert(dataPoint.dataY));
            };
            SeriesBase.prototype._renderLabel = function (engine, s, index, pos, offset, pt, line, marg) {
                var lrct, lcss = 'wj-data-label', clcss = 'wj-data-label-line';
                switch (pos) {
                    case chart_1.LabelPosition.Top: {
                        if (line) {
                            engine.drawLine(pt.x, pt.y, pt.x, pt.y - offset, clcss);
                        }
                        pt.y -= marg + offset;
                        lrct = chart_1.FlexChart._renderText(engine, s, pt, 1, 2, lcss);
                        break;
                    }
                    case chart_1.LabelPosition.Bottom: {
                        if (line) {
                            engine.drawLine(pt.x, pt.y, pt.x, pt.y + offset, clcss);
                        }
                        pt.y += marg + offset;
                        lrct = chart_1.FlexChart._renderText(engine, s, pt, 1, 0, lcss);
                        break;
                    }
                    case chart_1.LabelPosition.Left: {
                        if (line) {
                            engine.drawLine(pt.x, pt.y, pt.x - offset, pt.y, clcss);
                        }
                        pt.x -= marg + offset;
                        lrct = chart_1.FlexChart._renderText(engine, s, pt, 2, 1, lcss);
                        break;
                    }
                    case chart_1.LabelPosition.Right: {
                        if (line) {
                            engine.drawLine(pt.x, pt.y, pt.x + offset, pt.y, clcss);
                        }
                        pt.x += marg + offset;
                        lrct = chart_1.FlexChart._renderText(engine, s, pt, 0, 1, lcss);
                        break;
                    }
                    case chart_1.LabelPosition.Center:
                        lrct = chart_1.FlexChart._renderText(engine, s, pt, 1, 1, lcss);
                        break;
                }
                return lrct;
            };
            SeriesBase._LEGEND_ITEM_WIDTH = 10;
            SeriesBase._LEGEND_ITEM_HEIGHT = 10;
            SeriesBase._LEGEND_ITEM_MARGIN = 4;
            SeriesBase._DEFAULT_SYM_SIZE = 10;
            return SeriesBase;
        }());
        chart_1.SeriesBase = SeriesBase;
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=SeriesBase.js.map