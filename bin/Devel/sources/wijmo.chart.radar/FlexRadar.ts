/**
 * Defines the @see:FlexRadar control and its associated classes.
 *
 */
module wijmo.chart.radar {
    'use strict';

    /**
     * Specifies the type of radar chart.
     */
    export enum RadarChartType {
        /** Shows vertical bars and allows you to compare values of items across categories. */
        Column,
        /** Shows patterns within the data using X and Y coordinates. */
        Scatter,
        /** Shows trends over a period of time or across categories. */
        Line,
        /** Shows line chart with a symbol on each data point. */
        LineSymbols,
        /** Shows line chart with the area below the line filled with color. */
        Area
    }

    /**
     * radar chart control.
     */
    export class FlexRadar extends FlexChartCore {

        private _chartType = RadarChartType.Line;
        private _startAngle = 0;
        private _totalAngle = 360;
        private _reversed = false;
        _center: wijmo.Point;
        _radius: number;
        _angles: number[];
        _isPolar: boolean;
        _areas: any[] = [];
        private __radarLinePlotter;
        private __radarColumnPlotter;

        /**
         * Initializes a new instance of the @see:FlexRadar class.
         *
         * @param element The DOM element that hosts the control, or a selector for the
         * host element (e.g. '#theCtrl').
         * @param options A JavaScript object containing initialization data for the
         * control.
         */
        constructor(element: any, options?) {
            super(element, options);
        }

        private get _radarLinePlotter() {
            if (this.__radarLinePlotter == null) {
                this.__radarLinePlotter = new _RadarLinePlotter();
                this._initPlotter(this.__radarLinePlotter);
            }
            return this.__radarLinePlotter;
        }

        private get _radarColumnPlotter() {
            if (this.__radarColumnPlotter == null) {
                this.__radarColumnPlotter = new _RadarBarPlotter();
                this._initPlotter(this.__radarColumnPlotter);
            }
            return this.__radarColumnPlotter;
        }

        _initAxes() {
            super._initAxes();
            this.axes.pop();
            this.axes.pop();

            this.axisX = new FlexRadarAxis(Position.Bottom);
            this.axisX.majorGrid = true;
            this.axisY = new FlexRadarAxis(Position.Left);
            this.axisY.majorTickMarks = TickMark.Outside;
            this.axes.push(this.axisX);
            this.axes.push(this.axisY);
        }

        _layout(rect: Rect, size: Size, engine: IRenderEngine) {
            super._layout(rect, size, engine);

            var height = (<FlexRadarAxis>this.axisX)._height;
            this._plotRect.top += height / 2;

            var pr = this._plotRect;
            this._radius = Math.min(pr.width, pr.height) / 2;
            this._center = new Point(pr.left + pr.width / 2, pr.top + pr.height / 2);
        }

        /**
         * Gets or sets the type of radar chart to be created.
         */
        get chartType(): RadarChartType {
            return this._chartType;
        }
        set chartType(value: RadarChartType) {
            if (value != this._chartType) {
                this._chartType = asEnum(value, RadarChartType);
                this.invalidate();
            }
        }

        /**
         * Gets or sets the starting angle for the radar, in degrees.
         *
         * Angles are measured clockwise, starting at the 12 o'clock position.
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
         * Gets or sets the total angle for the radar, in degrees.  Its default value is 360.
         * The value must be greater than 0, or less than or equal to 360.
         */
        get totalAngle(): number {
            return this._totalAngle;
        }
        set totalAngle(value: number) {
            if (value != this._totalAngle && value >= 0) {
                this._totalAngle = asNumber(value, true);
                if (this._totalAngle <= 0) {
                    assert(false, "totalAngle must be greater than 0.");
                    this._totalAngle = 0;
                }
                if (this._totalAngle > 360) {
                    assert(false, "totalAngle must be less than or equal to 360.");
                    this._totalAngle = 360;
                }
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
         * Gets or sets a value that determines whether and how the series objects are stacked.
         */
        get stacking(): Stacking {
            return this._stacking;
        }
        set stacking(value: Stacking) {
            if (value != this._stacking) {
                this._stacking = asEnum(value, Stacking);
                this.invalidate();
            }
        }

        _getChartType(): chart.ChartType {
            var ct = chart.ChartType.Line;
            switch (this.chartType) {
                case RadarChartType.Area:
                    ct = chart.ChartType.Area;
                    break;
                case RadarChartType.Line:
                    ct = chart.ChartType.Line;
                    break;
                case RadarChartType.Column:
                    ct = chart.ChartType.Column;
                    break;
                case RadarChartType.LineSymbols:
                    ct = chart.ChartType.LineSymbols;
                    break;
                case RadarChartType.Scatter:
                    ct = chart.ChartType.Scatter;
                    break;
            }

            return ct;
        }

        _getPlotter(series: FlexRadarSeries): _IPlotter {
            var chartType = this.chartType,
                plotter: any = null,
                isSeries = false;

            if (series) {
                var stype = series.chartType;
                if (stype != null && stype != chartType) {
                    chartType = stype;
                    isSeries = true;
                }
            }

            switch (chartType) {
                // no plotter found for RadarChartType - try based on ChartType
                case RadarChartType.Line:
                    this._radarLinePlotter.hasSymbols = false;
                    this._radarLinePlotter.hasLines = true;
                    this._radarLinePlotter.isArea = false;
                    plotter = this._radarLinePlotter;
                    break;
                case RadarChartType.LineSymbols:
                    this._radarLinePlotter.hasSymbols = true;
                    this._radarLinePlotter.hasLines = true;
                    this._radarLinePlotter.isArea = false;
                    plotter = this._radarLinePlotter;
                    break;
                case RadarChartType.Area:
                    this._radarLinePlotter.hasSymbols = false;
                    this._radarLinePlotter.hasLines = true;
                    this._radarLinePlotter.isArea = true;
                    plotter = this._radarLinePlotter;
                    break;
                case RadarChartType.Scatter:
                    this._radarLinePlotter.hasSymbols = true;
                    this._radarLinePlotter.hasLines = false;
                    this._radarLinePlotter.isArea = false;
                    plotter = this._radarLinePlotter;
                    break;
                case RadarChartType.Column:
                    this._radarColumnPlotter.isVolume = false;
                    this._radarColumnPlotter.width = 0.8;
                    plotter = this._radarColumnPlotter;
                    break;
                default:
                    plotter = super._getPlotter(series);
                    break;
            }

            return plotter;
        }

        _convertPoint(radius, angle) {
            var pt = new Point(),
                center = this._center;

            pt.x = center.x + radius * Math.sin(angle);
            pt.y = center.y - radius * Math.cos(angle);
            return pt;
        }

        _createSeries(): SeriesBase {
            return new FlexRadarSeries();
        }

        _clearCachedValues() {
            super._clearCachedValues();
            this._isPolar = false;
            this._areas = [];
        }

        _performBind() {
            super._performBind();
            if (this._xDataType === DataType.Number) {
                this._isPolar = true;
            }
        }

        _render(engine: IRenderEngine, applyElement = true) {
            this._areas = [];
            super._render(engine, applyElement);
        }
    }
}