module wijmo.chart
{
    'use strict';

    /**
     * Specifies the type of chart element found by the hitTest method.
     */
    export enum ChartElement {
        /** The area within the axes. */
        PlotArea,
        /** X-axis. */
        AxisX,
        /** Y-axis. */
        AxisY,
        /** The area within the control but outside the axes. */
        ChartArea,
        /** The chart legend. */
        Legend,
        /** The chart header. */
        Header,
        /** The chart footer. */
        Footer,
        /** A chart series. */
        Series,
        /** A chart series symbol. */
        SeriesSymbol,
        /** A data label. */
        DataLabel,
        /** No chart element. */
        None
    };

    /**
     * Contains information about a part of a @see:FlexChart control at
     * a specified page coordinate.
     */
    export class HitTestInfo
    {
        private _chart: FlexChartBase;
        private _pt: Point;

        private _series: SeriesBase;
        private _pointIndex: number = null;
        _chartElement: ChartElement = ChartElement.None;
        _dist: number;
        private _item: any;
        private _x: any;
        private __xfmt: string;
        private _y: any;
        private __yfmt: string;
        private _name: string;

        /**
         * Initializes a new instance of the @see:HitTestInfo class.
         *
         * @param chart The chart control.
         * @param point The original point in window coordinates.
         * @param element The chart element.
         */
        constructor(chart: FlexChartBase, point: Point, element?:ChartElement)
        {
            this._chart = chart;
            this._pt = point;
            this._chartElement = element;
        }

        /**
         * Gets the point in control coordinates to which this HitTestInfo object
		 * refers to.
         */
        get point(): Point {
            return this._pt;
        }

        /**
         * Gets the chart series at the specified coordinates.
         */
        get series(): SeriesBase {
            return this._series;
        }

        /**
         * Gets the data point index at the specified coordinates.
         */
        get pointIndex(): number {
            return this._pointIndex;
        }

        /**
         * Gets the chart element at the specified coordinates.
         */
        get chartElement(): ChartElement {
            return this._chartElement;
        }

        /**
         * Gets the distance from the closest data point.
         */
        get distance(): number {
            return this._dist;
        }

        /**
         * Gets the data object that corresponds to the closest data point.
         */
        get item(): any {
            if (this._item == null)
            {
                //this._item = null;

                if (this.pointIndex !== null)
                {
                    if (this.series != null) {
                    this._item = this.series._getItem(this.pointIndex);
                    } else if (this._chart instanceof FlexPie) {
                        var pchart = <FlexPie>this._chart;
                        var items = null;
                        if (pchart._cv != null) {
                            items = pchart._cv.items;
                        } else {
                            items = pchart.itemsSource;
                        }
                        if (items && this.pointIndex < items.length) {
                            this._item = items[this.pointIndex];
                        }
                    }
                }
            }
            return this._item;
        }

        /**
         * Gets the x-value of the closest data point.
         */
        get x(): any {
            if (this._x === undefined) {
                this._x = this._getValue(1, false);
            }
            return this._x;
        }

        /**
         * Gets the y-value of the closest data point.
         */
        get y(): any {
            if (this._y === undefined) {
                this._y = this._getValue(0, false);
            }
            return this._y;
        }

        get value(): any {
            if (this._chart instanceof FlexPie) {
                var pchart = <FlexPie>this._chart;
                return pchart._values[this.pointIndex];
            } else {
                return this.y;
            }
        }

        get name(): any {
            if (this._name === undefined) {
                if (this._chart instanceof FlexPie) {
                    var pchart = <FlexPie>this._chart;
                    return pchart._labels[this.pointIndex];
                } else {
                    return this.series.name;
                }
            }
            return this._name;
        }

        // formatted x-value
        get _xfmt(): any {
            if (this.__xfmt === undefined) {
                this.__xfmt = this._getValue(1, true);
            }
            return this.__xfmt;
        }

        // formatted y-value
        get _yfmt(): any {
            if (this.__yfmt === undefined) {
                this.__yfmt = this._getValue(0, true);
            }
            return this.__yfmt;
        }

        _setData(series: SeriesBase, pi?: number) {
            this._series = series;
            this._pointIndex = pi;
        }

        _setDataPoint(dataPoint: _DataPoint) {
            dataPoint = asType(dataPoint, _DataPoint, true);
            if (dataPoint) {
                this._pointIndex = dataPoint.pointIndex;
                var fch = <FlexChartCore>asType(this._chart, wijmo.chart.FlexChartCore, true);
                var si = dataPoint.seriesIndex;
                if (si !== null && si >= 0 && si < fch.series.length) {
                    this._series = fch.series[si];
                }

                // additional properties
                if (dataPoint['item']) {
                    this._item = dataPoint['item'];
                }
                if (dataPoint['x']) {
                    this._x = dataPoint['x'];
                }
                if (dataPoint['y']) {
                    this._y = dataPoint['y'];
                }
                if (dataPoint['xfmt']) {
                    this.__xfmt = dataPoint['xfmt'];
                }
                if (dataPoint['yfmt']) {
                    this.__yfmt = dataPoint['yfmt'];
                }
                if (dataPoint['name']) {
                    this._name = dataPoint['name'];
                }
            }
        }

        // y: index=0
        // x: index=1
        private _getValue(index: number, formatted: boolean): any
        {
            if (this._chart instanceof FlexPie) {
                var pchart = <FlexPie>this._chart;
                return pchart._values[this.pointIndex];
            }

            // todo: rotated charts?

            var val = null,
                chart = <FlexChart>this._chart,
                pi = this.pointIndex,
                rotated = chart._isRotated();

            if (this.series !== null && pi !== null) {
                var vals = this.series.getValues(index); // xvalues
                var type = this.series.getDataType(index);

                // normal values
                if (vals && this.pointIndex < vals.length) {
                    val = vals[this.pointIndex];
                    if (type == DataType.Date && !formatted) {
                        val = new Date(val);
                    }
                } else if (index == 1) {
                    // category axis
                    if (chart._xlabels && chart._xlabels.length > 0 && pi < chart._xlabels.length) {
                        val = chart._xlabels[pi];
                        // automatic axis values
                    } else if (chart._xvals && pi < chart._xvals.length) {
                        val = chart._xvals[pi];
                        if (chart._xDataType == DataType.Date && !formatted) {
                            val = new Date(val);
                        }
                    }
                }
            }
            if (val !== null && formatted) {
                if (rotated) {
                    if (index == 0) {
                        val = chart.axisX._formatValue(val);
                    } else if (index == 1) {
                        val = chart.axisY._formatValue(val);
                    }
                } else {
                if (index == 0) {
                    val = chart.axisY._formatValue(val);
                } else if(index == 1) {
                    val = chart.axisX._formatValue(val);
                    }
                }
            }

            return val;
        }
    }

}

