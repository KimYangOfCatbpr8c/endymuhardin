module wijmo.chart {
    'use strict';

    /**
     * Specifies whether and where the Series is visible.
     */
    export enum SeriesVisibility {
        /** The series is visible on the plot and in the legend. */
        Visible,
        /** The series is visible only on the plot. */
        Plot,
        /** The series is visible only in the legend. */
        Legend,
        /** The series is hidden. */
        Hidden
    }

    /**
     * Specifies the type of marker to use for the @see:Series.symbolMarker
     * property.
     *
     * Applies to Scatter, LineSymbols, and SplineSymbols chart types.
     */
    export enum Marker {
        /**
         * Uses a circle to mark each data point.
         */
        Dot,
        /**
         * Uses a square to mark each data point.
         */
        Box
    };

    /**
     * Data series interface
     */
    export interface _ISeries {
        style: any;
        symbolStyle: any;
        getValues: (dim: number) => number[];
        getDataType: (dim: number) => DataType;
        //chartType: ChartType;

        drawLegendItem(engine: IRenderEngine, rect: Rect, index: number);
        measureLegendItem(engine: IRenderEngine, index: number): Size;
        _setPointIndex(pointIndex: number, elementIndex: number);
    }

    class DataArray {
        dataType: DataType;
        values: Array<number>;
    }

    /**
     * Provides arguments for @see:Series events.
     */
    export class SeriesEventArgs extends EventArgs {
        _series: Series;

        /**
         * Initializes a new instance of the @see:SeriesEventArgs class.
         *
         * @param series Specifies the @see:Series object affected by this event.
         */
        constructor(series: SeriesBase) {
            super();
            this._series = asType(series, SeriesBase);
        }

        /**
         * Gets the @see:Series object affected by this event.
         */
        get series(): SeriesBase {
            return this._series;
        }
    }

    /**
     * Represents a series of data points to display in the chart.
     *
     */
    export class SeriesBase implements _ISeries {
        static _LEGEND_ITEM_WIDTH = 10;
        static _LEGEND_ITEM_HEIGHT = 10;
        static _LEGEND_ITEM_MARGIN = 4;
        private static _DEFAULT_SYM_SIZE = 10;

        // property storage
        _chart: FlexChartCore;
        private _name: string;
        private _binding: string;
        private _showValues: boolean;
        private _symbolStyle: any;
        private _symbolSize: number;
        private _style: any;
        private _altStyle: any = null;

        private _cv: wijmo.collections.ICollectionView;
        private _itemsSource: any;
        private _values: number[];
        private _valueDataType: DataType;
        _chartType: ChartType;
        private _symbolMarker: Marker = Marker.Dot;

        private _bindingX: string;
        private _xvalues: number[];
        private _xvalueDataType: DataType;
        private _cssClass: string;
        private _visibility: SeriesVisibility = SeriesVisibility.Visible;

        private _axisX: Axis;
        private _axisY: Axis;

        _legendElement: SVGAElement;
        _hostElement: SVGGElement;
        _pointIndexes: number[];

        constructor() {
        }

        //--------------------------------------------------------------------------
        // ** implementation

        /**
         * Gets or sets the series style.
         */
        get style(): any {
            return this._style;
        }
        set style(value: any) {
            if (value != this._style) {
                this._style = value;
                this._invalidate();
            }
        }

        /**
         * Gets or sets the alternative style for the series. The values from
         * this property will be used for negative values in Bar, Column,
         * and Scatter charts; and for rising values in financial chart types
         * like Candlestick, LineBreak, EquiVolume etc.
         *
         * If no value is provided, the default styles will be used.
         */
        get altStyle(): any {
            return this._altStyle;
        }
        set altStyle(value: any) {
            if (value != this._altStyle) {
                this._altStyle = value;
                this._invalidate();
            }
        }

        /**
         * Gets or sets the series symbol style.
         * Applies to Scatter, LineSymbols, and SplineSymbols chart types.
         */
        get symbolStyle(): any {
            return this._symbolStyle;
        }
        set symbolStyle(value: any) {
            if (value != this._symbolStyle) {
                this._symbolStyle = value;
                this._invalidate();
            }
        }

        /**
         * Gets or sets the size(in pixels) of the symbols used to render this @see:Series.
         * Applies to Scatter, LineSymbols, and SplineSymbols chart types.
         */
        get symbolSize(): number {
            return this._symbolSize;
        }
        set symbolSize(value: number) {
            if (value != this._symbolSize) {
                this._symbolSize = asNumber(value, true, true);
                this._invalidate();
            }
        }
        _getSymbolSize(): number {
            return this.symbolSize != null ? this.symbolSize : this.chart.symbolSize;
        }

        /**
         * Gets or sets the shape of marker to use for each data point in the series.
         * Applies to Scatter, LineSymbols, and SplineSymbols chart types.
         */
        get symbolMarker(): Marker {
            return this._symbolMarker;
        }
        set symbolMarker(value: Marker) {
            if (value != this._symbolMarker) {
                this._symbolMarker = asEnum(value, Marker, true);
                this._invalidate();
            }
        }

        /**
         * Gets or sets the name of the property that contains Y values for the series.
         */
        get binding(): string {
            return this._binding ? this._binding : this._chart ? this._chart.binding : null;
        }
        set binding(value: string) {
            if (value != this._binding) {
                this._binding = asString(value, true);
                this._clearValues();
                this._invalidate();
            }
        }

        /**
         * Gets or sets the name of the property that contains X values for the series.
         */
        get bindingX(): string {
            return this._bindingX ? this._bindingX : this._chart ? this._chart.bindingX : null;
        }
        set bindingX(value: string) {
            if (value != this._bindingX) {
                this._bindingX = asString(value, true);
                this._clearValues();
                this._invalidate();
            }
        }

        /**
         * Gets or sets the series name.
         *
         * The series name is displayed in the chart legend. Any series without a name
         * does not appear in the legend.
         */
        get name(): string {
            return this._name;
        }
        set name(value: string) {
            this._name = value;
        }

        /**
         * Gets or sets the array or @see:ICollectionView object that contains the series data.
         */
        get itemsSource(): any {
            return this._itemsSource;
        }
        set itemsSource(value: any) {
            if (value != this._itemsSource) {

                // unbind current collection view
                if (this._cv) {
                    this._cv.currentChanged.removeHandler(this._cvCurrentChanged, this);
                    this._cv.collectionChanged.removeHandler(this._cvCollectionChanged, this);
                    this._cv = null;
                }

                // save new data source and collection view
                this._itemsSource = value;
                this._cv = asCollectionView(value);

                // bind new collection view
                if (this._cv != null) {
                    this._cv.currentChanged.addHandler(this._cvCurrentChanged, this);
                    this._cv.collectionChanged.addHandler(this._cvCollectionChanged, this);
                }

                this._clearValues();
                this._itemsSource = value;
                this._invalidate();
            }
        }

        /**
         * Gets the @see:ICollectionView object that contains the data for this series.
         */
        get collectionView(): wijmo.collections.ICollectionView {
            return this._cv ? this._cv : this._chart ? this._chart.collectionView : null;
        }

        /**
         * Gets the @see:FlexChart object that owns this series.
         */
        get chart(): FlexChartCore {
            return this._chart;
        }

        /**
         * Gets the series host element.
         */
        get hostElement(): SVGGElement {
            return this._hostElement;
        }

        /**
         * Gets the series element in the legend.
         */
        get legendElement(): SVGGElement {
            return this._legendElement;
        }

        /**
         * Gets or sets the series CSS class.
         */
        get cssClass(): string {
            return this._cssClass;
        }
        set cssClass(value: string) {
            this._cssClass = asString(value, true);
        }

        /**
         * Gets or sets an enumerated value indicating whether and where the series appears.
         */
        get visibility(): SeriesVisibility {
            return this._visibility;
        }
        set visibility(value: SeriesVisibility) {
            if (value != this._visibility) {
                this._visibility = asEnum(value, SeriesVisibility);
                this._clearValues();
                this._invalidate();
                if (this._chart) {
                    this._chart.onSeriesVisibilityChanged(new SeriesEventArgs(this));
                }
            }
        }

        /**
         * Occurs when series is rendering.
         */
        rendering = new Event();

        /**
         * Raises the @see:rendering event.
         *
         * @param engine The @see:IRenderEngine object used to render the series.
         */
        onRendering(engine: IRenderEngine) {
            this.rendering.raise(this, new RenderEventArgs(engine));
        }

        /**
         * Gets a @see:HitTestInfo object with information about the specified point.
         *
         * @param pt The point to investigate, in window coordinates.
         * @param y The Y coordinate of the point (if the first parameter is a number).
         */
        hitTest(pt: any, y?: number): HitTestInfo {
            if (isNumber(pt) && isNumber(y)) { // accept hitTest(x, y) as well
                pt = new Point(pt, y);
            } else if (pt instanceof MouseEvent) {
                pt = new Point(pt.pageX, pt.pageY);
            }
            asType(pt, Point);

            if (this._chart) {
                return this._chart._hitTestSeries(pt, this._chart.series.indexOf(this));
            }
            else {
                return null;
            }
        }

        /**
         * Gets the plot element that corresponds to the specified point index.
         *
         * @param pointIndex The index of the data point.
         */
        getPlotElement(pointIndex: number): any {
            if (this.hostElement) {
                if (pointIndex < this._pointIndexes.length) {
                    var elementIndex = this._pointIndexes[pointIndex];
                    if (elementIndex < this.hostElement.childNodes.length) {
                        return this.hostElement.childNodes[elementIndex];
                    }
                }
            }
            return null;
        }

        /**
         * Gets or sets the x-axis for the series.
         */
        get axisX(): Axis {
            return this._axisX;
        }
        set axisX(value: Axis) {
            if (value != this._axisX) {
                this._axisX = asType(value, Axis, true);
                if (this._axisX) {
                    var chart = this._axisX._chart = this._chart;
                    if (chart && chart.axes.indexOf(this._axisX) == -1) {
                        chart.axes.push(this._axisX);
                    }
                }
                this._invalidate();
            }
        }

        /**
         * Gets or sets the y-axis for the series.
         */
        get axisY(): Axis {
            return this._axisY;
        }
        set axisY(value: Axis) {
            if (value != this._axisY) {
                this._axisY = asType(value, Axis, true);
                if (this._axisY) {
                    var chart = this._axisY._chart = this._chart;
                    if (chart && chart.axes.indexOf(this._axisY) == -1) {
                        chart.axes.push(this._axisY);
                    }
                }
                this._invalidate();
            }
        }

        //--------------------------------------------------------------------------
        // ** implementation

        getDataType(dim: number): DataType {
            if (dim == 0) {
                return this._valueDataType;
            }
            else if (dim == 1) {
                return this._xvalueDataType;
            }

            return null;
        }

        getValues(dim: number): number[] {
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

                    var base: any = this;

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
        }

        /**
          * Draw a legend item at the specified position.
          *
          * @param engine The rendering engine to use.
          * @param rect The position of the legend item.
          * @param index Index of legend item(for series with multiple legend items).
          */
        drawLegendItem(engine: IRenderEngine, rect: Rect, index: number) {
            var chartType = this._getChartType();
            if (chartType == null) {
                chartType = this._chart._getChartType();
            }

            if (chartType === ChartType.Funnel) {
                this._drawFunnelLegendItem(engine, rect, index, this.style, this.symbolStyle);
            } else {
                this._drawLegendItem(engine, rect, chartType, this.name, this.style, this.symbolStyle);
            }
        }

        /**
         * Measures height and width of the legend item.
         *
         * @param engine The rendering engine to use.
         * @param index Index of legend item(for series with multiple legend items).
         */
        measureLegendItem(engine: IRenderEngine, index: number): Size {
            var chartType = this._getChartType();
            if (chartType == null) {
                chartType = this._chart._getChartType();
            }

            if (chartType === ChartType.Funnel) {
                return this._measureLegendItem(engine, this._getFunnelLegendName(index));
            } else {
                return this._measureLegendItem(engine, this.name);
            }
        }

        /**
         * Returns number of series items in the legend.
         */
        legendItemLength(): number {
            var chartType = this._getChartType();
            if (chartType == null) {
                chartType = this._chart._getChartType();
            }
            if (chartType === ChartType.Funnel) {
                if (this._chart._xlabels && this._chart._xlabels.length) {
                    return this._chart._xlabels.length;
                }
                return 1;
            } else {
                return 1;
            }
        }

        /**
         * Returns series bounding rectangle in data coordinates.
         *
         * If getDataRect() returns null, the limits are calculated automatically based on the data values.
         */
        getDataRect(): Rect {
            return null;
        }

        _getChartType(): ChartType {
            return this._chartType;
        }

        /**
         * Clears any cached data values.
         */
        _clearValues() {
            this._values = null;
            this._xvalues = null;
        }

        _getBinding(index: number): string {
            var binding = null;
            if (this.binding) {
                var props = this.binding.split(',');
                if (props && props.length > index) {
                    binding = props[index].trim();
                }
            }
            return binding;
        }

        _getBindingValues(index: number) {
            var items: any[];
            if (this._cv != null) {
                items = this._cv.items;
            }
            else if (this._chart != null && this._chart.collectionView != null) {
                items = this._chart.collectionView.items;
            }

            var da = this._bindValues(items, this._getBinding(index));
            return da.values;
        }

        _getItem(pointIndex: number): any {
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
                } else {
                    items = this._chart.itemsSource;
                }
            }
            if (items != null) {
                item = items[pointIndex];
            }

            return item;
        }

        _getLength(): number {
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
                } else {
                    items = this._chart.itemsSource;
                }
            }

            if (items != null) {
                len = items.length
            }
            return len;
        }

        _setPointIndex(pointIndex: number, elementIndex: number) {
            this._pointIndexes[pointIndex] = elementIndex;
        }

        private _getDataRect(): Rect {
            var values = this.getValues(0);
            var xvalues = this.getValues(1);
            if (values) {
                var xmin = NaN,
                    ymin = NaN,
                    xmax = NaN,
                    ymax = NaN;

                var len = values.length;

                for (var i = 0; i < len; i++) {
                    var val = values[i];
                    if (isFinite(val)) {
                        if (isNaN(ymin)) {
                            ymin = ymax = val;
                        } else {
                            if (val < ymin) {
                                ymin = val;
                            } else if (val > ymax) {
                                ymax = val;
                            }
                        }
                    }
                    if (xvalues) {
                        var xval = xvalues[i];
                        if (isFinite(xval)) {
                            if (isNaN(xmin)) {
                                xmin = xmax = xval;
                            } else {
                                if (xval < xmin) {
                                    xmin = xval;
                                } else if (val > ymax) {
                                    xmax = xval;
                                }
                            }
                        }
                    }
                }

                if (!xvalues) {
                    xmin = 0; xmax = len - 1;
                }

                if (!isNaN(ymin)) {
                    return new Rect(xmin, ymin, xmax - xmin, ymax - ymin);
                }
            }

            return null;
        }

        _isCustomAxisX(): boolean {
            if (this._axisX) {
                if (this._chart) {
                    return this._axisX != this.chart.axisX;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        }

        _isCustomAxisY(): boolean {
            if (this._axisY) {
                if (this._chart) {
                    return this._axisY != this.chart.axisY;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        }

        _getAxisX(): Axis {
            var ax: Axis = null;
            if (this.axisX) {
                ax = this.axisX;
            } else if (this.chart) {
                ax = this.chart.axisX;
            }
            return ax;
        }

        _getAxisY(): Axis {
            var ay: Axis = null;
            if (this.axisY) {
                ay = this.axisY;
            } else if (this.chart) {
                ay = this.chart.axisY;
            }
            return ay;
        }

        _measureLegendItem(engine: IRenderEngine, text: string): Size {
            var sz = new Size();
            sz.width = Series._LEGEND_ITEM_WIDTH;
            sz.height = Series._LEGEND_ITEM_HEIGHT;
            if (this._name) {
                var tsz = engine.measureString(text, FlexChart._CSS_LABEL);
                sz.width += tsz.width;
                if (sz.height < tsz.height) {
                    sz.height = tsz.height;
                }
            };
            sz.width += 3 * Series._LEGEND_ITEM_MARGIN;
            sz.height += 2 * Series._LEGEND_ITEM_MARGIN;
            return sz;
        }

        _drawFunnelLegendItem(engine: IRenderEngine, rect: Rect, index: number, style: any, symbolStyle: any) {

            engine.strokeWidth = 1;

            var marg = Series._LEGEND_ITEM_MARGIN;

            var fill = null;
            var stroke = null;

            if (fill === null)
                fill = this._chart._getColorLight(index);
            if (stroke === null)
                stroke = this._chart._getColor(index);

            engine.fill = fill;
            engine.stroke = stroke;

            var yc = rect.top + 0.5 * rect.height;

            var wsym = Series._LEGEND_ITEM_WIDTH;
            var hsym = Series._LEGEND_ITEM_HEIGHT;
            var name = this._getFunnelLegendName(index);
            engine.drawRect(rect.left + marg, yc - 0.5 * hsym, wsym, hsym, null, symbolStyle ? symbolStyle : style);

            if (name) {
                FlexChart._renderText(engine, name, new Point(rect.left + hsym + 2 * marg, yc), 0, 1, FlexChart._CSS_LABEL);
            }
        }

        private _getFunnelLegendName(index): string {
            var name;
            if (this._chart._xlabels && this._chart._xlabels.length) {
                name = this._chart._xlabels[index];
            }
            if (!name) {
                name = this.name;
            }
            return name;
        }

        _drawLegendItem(engine: IRenderEngine, rect: Rect, chartType: ChartType, text: string, style: any, symbolStyle: any) {

            engine.strokeWidth = 1;

            var marg = Series._LEGEND_ITEM_MARGIN;

            var fill = null;
            var stroke = null;

            if (fill === null)
                fill = this._chart._getColorLight(this._chart.series.indexOf(this));
            if (stroke === null)
                stroke = this._chart._getColor(this._chart.series.indexOf(this));

            engine.fill = fill;
            engine.stroke = stroke;

            var yc = rect.top + 0.5 * rect.height;

            var wsym = Series._LEGEND_ITEM_WIDTH;
            var hsym = Series._LEGEND_ITEM_HEIGHT;
            switch (chartType) {
                case ChartType.Area:
                case ChartType.SplineArea:
                    {
                        engine.drawRect(rect.left + marg, yc - 0.5 * hsym, wsym, hsym, null, style);
                    }
                    break;
                case ChartType.Bar:
                case ChartType.Column:
                case ChartType.BoxPlot:
                    {
                        engine.drawRect(rect.left + marg, yc - 0.5 * hsym, wsym, hsym, null, symbolStyle ? symbolStyle : style);
                    }
                    break;
                case ChartType.Scatter:
                case ChartType.Bubble:
                    {
                        var rx = 0.3 * wsym;
                        var ry = 0.3 * hsym;
                        if (this.symbolMarker == Marker.Box) {
                            engine.drawRect(rect.left + marg + 0.5 * wsym - rx, yc - ry, 2 * rx, 2 * ry, null, symbolStyle);
                        } else {
                            engine.drawEllipse(rect.left + 0.5 * wsym + marg, yc, rx, ry, null, symbolStyle);
                        }
                    }
                    break;
                case ChartType.Line:
                case ChartType.Spline:
                    {
                        engine.drawLine(rect.left + marg, yc, rect.left + wsym + marg, yc, null, style);
                    }
                    break;
                case ChartType.LineSymbols:
                case ChartType.SplineSymbols:
                    {
                        var rx = 0.3 * wsym;
                        var ry = 0.3 * hsym;
                        if (this.symbolMarker == Marker.Box) {
                            engine.drawRect(rect.left + marg + 0.5 * wsym - rx, yc - ry, 2 * rx, 2 * ry, null, symbolStyle);
                        } else {
                            engine.drawEllipse(rect.left + 0.5 * wsym + marg, yc, rx, ry, null, symbolStyle);
                        }

                        engine.drawLine(rect.left + marg, yc, rect.left + wsym + marg, yc, null, style);
                    }
                    break;
                case ChartType.Candlestick:
                case ChartType.HighLowOpenClose:
                    {
                        engine.drawLine(rect.left + marg, yc, rect.left + wsym + marg, yc, null, symbolStyle ? symbolStyle : style);
                    }
                    break;
            }
            if (this._name) {
                FlexChart._renderText(engine, text, new Point(rect.left + hsym + 2 * marg, yc), 0, 1, FlexChart._CSS_LABEL);
            }
        }

        private _cvCollectionChanged(sender, e) {
            this._clearValues();
            this._invalidate();
        }

        // updates selection to sync with data source
        private _cvCurrentChanged(sender, e) {
            if (this._chart && this._chart._notifyCurrentChanged) {
                this._invalidate();
            }
        }

        private _bindValues(items: Array<any>, binding: string, isX: boolean= false): DataArray {
            var values: Array<number>;
            var dataType: DataType;
            var arrVal;
            if (items != null) {
                var len = items.length;
                values = new Array<number>(items.length);

                for (var i = 0; i < len; i++) {
                    arrVal = null;
                    var val = items[i];
                    if (binding != null) {
                        val = val[binding];
                    }

                    if (isArray(val) && val.length > 0) {
                        arrVal = val;
                        val = val[0]
                    }
                    if (isNumber(val)) {
                        values[i] = val;
                        dataType = DataType.Number;
                    }
                    else if (isDate(val)) {
                        values[i] = val.valueOf();
                        dataType = DataType.Date;
                    } else if (isX && val) {
                        // most likely it's category axis
                        // return appropriate values
                        values[i] = i;
                        dataType = DataType.Number;
                    }
                    if (isArray(arrVal) && arrVal.length > 0) {
                        values[i] = arrVal;
                    }
                }
            }
            var darr = new DataArray();
            darr.values = values;
            darr.dataType = dataType;
            return darr;
        }

        _invalidate() {
            if (this._chart) {
                this._chart.invalidate();
            }
        }

        _indexToPoint(pointIndex: number): Point {
            if (pointIndex >= 0 && pointIndex < this._values.length) {
                var y = this._values[pointIndex];
                var x = this._xvalues ? this._xvalues[pointIndex] : pointIndex;

                return new Point(x, y);
            }

            return null;
        }

        _getSymbolFill(seriesIndex?: number): string {
            var fill: string = null;
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
        }

        _getSymbolStroke(seriesIndex?: number): string {
            var stroke: string = null;
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
        }

        // convenience method to return symbol stroke value from
        // the altStyle property
        _getAltSymbolStroke(seriesIndex?: number): string {
            var stroke: string = null;
            if (this.altStyle) {
                stroke = this.altStyle.stroke;
            }
            return stroke;
        }

        // convenience method to return symbol fill value from
        // the altStyle property
        _getAltSymbolFill(seriesIndex?: number): string {
            var fill: string = null;
            if (this.altStyle) {
                fill = this.altStyle.fill;
            }
            return fill;
        }

        _renderLabels(engine: IRenderEngine, smap: _IHitArea[], chart: FlexChartCore, lblAreas: _RectArea[]) {
            var len = smap.length,
                lbl = chart.dataLabel,
                pos = lbl.position,
                bdr = lbl.border,
                offset = lbl.offset,
                line = lbl.connectingLine,
                marg = 2;
            if (offset === undefined) {
                offset = line ? 16 : 0;
            }
            if (bdr) {
                offset -= marg;
            }
            var bcss = 'wj-data-label-border';

            for (var j = 0; j < len; j++) {
                var dp = <_DataPoint>asType(smap[j].tag, _DataPoint, true);
                if (dp) {
                    var ht: HitTestInfo = new HitTestInfo(chart, pt);
                    ht._setDataPoint(dp);

                    var s = chart._getLabelContent(ht, lbl.content);

                    var pt = this._getLabelPoint(dp);
                    var map = smap[j];
                    if (map instanceof _RectArea) {
                        var ra = <_RectArea>map;
                        if (chart._isRotated())
                            pt.y = ra.rect.top + 0.5 * ra.rect.height;
                        else
                            pt.x = ra.rect.left + 0.5 * ra.rect.width;
                    } else if (map instanceof _FunnelSegment) {
                        var fs = <_FunnelSegment>map;
                        pt.x = fs.center.x;
                        pt.y = fs.center.y;
                        pos = pos == null ? LabelPosition.Center : pos;
                    }

                    if (!chart._plotRect.contains(pt)) {
                        continue;
                    }

                    var ea = new DataLabelRenderEventArgs(engine, ht, pt, s);

                    if (!lbl.onRendering(ea)) {
                        s = ea.text;
                        pt = ea.point;

                        var lrct: Rect = this._renderLabel(engine, s, j, pos, offset, pt, line, marg);
                        if (bdr && lrct) {
                            engine.drawRect(lrct.left - marg, lrct.top - marg, lrct.width + 2 * marg, lrct.height + 2 * marg, bcss);
                        }

                        if (lrct) {
                            var area = new _RectArea(lrct);
                            area.tag = dp;
                            lblAreas.push(area);
                        }
                    }
                }
            }
        }

        _getLabelPoint(dataPoint: _DataPoint): Point {
            var ax = this._getAxisX(),
                ay = this._getAxisY();

            return new Point(ax.convert(dataPoint.dataX), ay.convert(dataPoint.dataY));
        }

        _renderLabel(engine: IRenderEngine, s: string, index: number, pos: LabelPosition, offset: number, pt: Point, line: boolean, marg): Rect {
            var lrct,
                lcss = 'wj-data-label',
                clcss = 'wj-data-label-line';

            switch (pos) {
                case LabelPosition.Top: {
                    if (line) {
                        engine.drawLine(pt.x, pt.y, pt.x, pt.y - offset, clcss);
                    }
                    pt.y -= marg + offset;
                    lrct = FlexChart._renderText(engine, s, pt, 1, 2, lcss);
                    break;
                }
                case LabelPosition.Bottom: {
                    if (line) {
                        engine.drawLine(pt.x, pt.y, pt.x, pt.y + offset, clcss);
                    }
                    pt.y += marg + offset;
                    lrct = FlexChart._renderText(engine, s, pt, 1, 0, lcss);
                    break;
                }
                case LabelPosition.Left: {
                    if (line) {
                        engine.drawLine(pt.x, pt.y, pt.x - offset, pt.y, clcss);
                    }
                    pt.x -= marg + offset;
                    lrct = FlexChart._renderText(engine, s, pt, 2, 1, lcss);
                    break;
                }
                case LabelPosition.Right: {
                    if (line) {
                        engine.drawLine(pt.x, pt.y, pt.x + offset, pt.y, clcss);
                    }
                    pt.x += marg + offset;
                    lrct = FlexChart._renderText(engine, s, pt, 0, 1, lcss);
                    break;
                }
                case LabelPosition.Center:
                    lrct = FlexChart._renderText(engine, s, pt, 1, 1, lcss);
                    break;
            }
            return lrct;
        }
    }
}