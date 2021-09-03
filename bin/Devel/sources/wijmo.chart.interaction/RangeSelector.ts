/**
 * Defines classes that add interactive features to charts.
 */
module wijmo.chart.interaction {
    'use strict';

    /**
    * Specifies the orientation of the range selector.
    */
    export enum Orientation {
        /** Horizontal, x-data range. */
        X = 0,
        /** Vertical, y-data range. */
        Y = 1,
    }

    /**
     * The @see:RangeSelector control displays a range selector that allows the user to
     * choose the range of data to display on the specified @see:FlexChart.
     *
     * To use the @see:RangeSelector control, specify the @see:FlexChart
     * control to display the selected range of data.
     *
     * The @see:rangeChanged event is fired when there is a change in min or max value.
     * For example:
     * <pre>
     *  var rangeSelector = new wijmo.chart.interaction.RangeSelector(chart);
     *  rangeSelector.rangeChanged.addHandler(function () {
     *     // perform related updates
     *     // e.g. modify displayed range of another chart
     *     update(rangeSelector.min, rangeSelector.max);
     *   });
     * </pre>
     */
    export class RangeSelector {
        // fields
        private _isVisible = true;                              // range selector is visible or not
        private _min: number = null;                            // minimum value
        private _max: number = null;                            // maximum value
        private _orientation: Orientation = Orientation.X;      // range selector's orientation
        private _seamless: boolean = false;                     // seamless with min and max
        private _minScale: number = 0;                          // minimum range limitation
        private _maxScale: number = 1;                          // maximum range limitation

        private _chart: wijmo.chart.FlexChartCore = null;       // chart host
        private _rangeSelectorEle: HTMLElement = null;          // range selector div element

        private _rangeSlider: _RangeSlider = null;

        /**
         * Initializes a new instance of the @see:RangeSelector class.
         *
         * @param chart The @see:FlexChart that displays the selected range.
         * @param options A JavaScript object containing initialization data for the control.
         */
        constructor(chart: wijmo.chart.FlexChartCore, options?) {
            if (!chart) {
                assert(false, 'The FlexChart cannot be null.');
            }

            this._chart = chart;
            wijmo.copy(this, options);
            this._createRangeSelector();
        }

        /**
         * Gets or sets the visibility of the range selector.
         */
        get isVisible(): boolean {
            return this._isVisible;
        }
        set isVisible(value: boolean) {
            if (value != this._isVisible) {
                this._isVisible = asBoolean(value);
                if (!this._rangeSlider) {
                    return;
                }
                this._rangeSlider.isVisible = value;
            }
        }

        /**
         * Gets or sets the minimum value of the range.
         * If not set, the minimum is calculated automatically.
         */
        get min(): number {
            return this._min;
        }
        set min(value: number) {
            if (value !== this._min) {
                var tmpValue = asNumber(value, true, false); 
                var rangeChged = false;
                if (tmpValue !== null && tmpValue !== undefined && !isNaN(tmpValue) &&
                    this._max !== undefined && this._max !== null) {
                    if (tmpValue <= this._max) {
                        this._min = tmpValue;
                        rangeChged = true;
                    }
                } else {
                    this._min = tmpValue;
                    rangeChged = true;
                }                
                               
                if (!this._rangeSlider) {
                    return;
                }
                if (rangeChged) {
                    this._changeRange();
                }  
            }
        }

        /**
         * Gets or sets the maximum value of the range.
         * If not set, the maximum is calculated automatically.
         */
        get max(): number {
            return this._max;
        }
        set max(value: number) {
            if (value !== this._max) {
                var tmpValue = asNumber(value, true, false); 
                var rangeChged = false;
                if (tmpValue !== null && tmpValue !== undefined && !isNaN(tmpValue)) {
                    if (tmpValue >= this._min) {
                        this._max = tmpValue;
                        rangeChged = true;
                    }
                } else {
                    this._max = tmpValue;
                    rangeChged = true;
                }

                if (!this._rangeSlider) {
                    return;
                }
                if (rangeChged) {
                    this._changeRange();
                }                
            }
        }

        /**
         * Gets or sets the orientation of the range selector.
         */
        get orientation(): Orientation {
            return this._orientation;
        }
        set orientation(value: Orientation) {
            if (value !== this._orientation) {
                this._orientation = asEnum(value, Orientation);
                if (!this._rangeSlider) {
                    return;
                }
                this._rangeSlider.isHorizontal = value === Orientation.X;
            }
        }

        /**
         * Gets or sets a value that determines whether the minimal and maximal 
         * handler will move seamlessly.
         */
        get seamless(): boolean {
            return this._seamless;
        }
        set seamless(value: boolean) {
            if (value !== this._seamless) {
                this._seamless = asBoolean(value, true);
                if (!this._rangeSlider) {
                    return;
                }
                this._rangeSlider.seamless = value;
            }
        }

        /**
         * Gets or sets the minimum range scale of the range selector.
         * The minimum scale is between 0 and 1.
         */
        get minScale(): number {
            return this._minScale;
        }
        set minScale(value: number) {
            if (value <= 1 && value >= 0 && value != this._minScale && value < this._maxScale) {
                this._minScale = asNumber(value);
                if (!this._rangeSlider) {
                    return;
                }
                this._rangeSlider.minScale = asNumber(value);
                this._updateMinAndMaxWithScale(true);
            }
        }

        /**
         * Gets or sets the maximum range scale of the range selector.
         * The maximum scale is between 0 and 1.
         */
        get maxScale(): number {
            return this._maxScale;
        }
        set maxScale(value: number) {
            if (value <=1 && value >= 0 && value != this._maxScale && value > this._minScale) {
                this._maxScale = asNumber(value);
                if (!this._rangeSlider) {
                    return;
                }
                this._rangeSlider.maxScale = asNumber(value);
                this._updateMinAndMaxWithScale(true);
            }
        }

        /**
         * Occurs after the range changes.
         */
        rangeChanged = new Event();

        /**
         * Raises the @see:rangeChanged event.
         */
        onRangeChanged(e?: EventArgs) {
            this.rangeChanged.raise(this, e);
        }

        /**
         * Removes the @see:RangeSelector control from the chart.
         */
        remove() {
            if (this._rangeSelectorEle) {
                this._chart.hostElement.removeChild(this._rangeSelectorEle);
                this._switchEvent(false);
                this._rangeSelectorEle = null;
                this._rangeSlider = null;
            }
        }

        private _createRangeSelector() {
            var chart = this._chart,
                chartHostEle = chart.hostElement,
                isHorizontal = this._orientation === Orientation.X;

            this._rangeSelectorEle = createElement('<div class="wj-chart-rangeselector-container"></div>');
            this._rangeSlider = new _RangeSlider(this._rangeSelectorEle,
                false, //no range click
                false, //no buttons
                {
                    //options settings
                    isHorizontal: isHorizontal,
                    isVisible: this._isVisible,
                    seamless: this._seamless
                }
                );
            chartHostEle.appendChild(this._rangeSelectorEle);

            this._switchEvent(true);
        }

        private _switchEvent(isOn: boolean) {
            var eventHandler = isOn ? 'addHandler' : 'removeHandler';

            if (this._chart.hostElement) {
                this._rangeSlider.rangeChanged[eventHandler](this._updateRange, this);                
                this._chart.rendered[eventHandler](this._refresh, this);
            }
        }

        private _refresh() {
            var chartHostEle = this._chart.hostElement,
                pa, pOffset, plotBox, rOffset = wijmo.getElementRect(this._rangeSelectorEle);

            pa = chartHostEle.querySelector('.' + FlexChart._CSS_PLOT_AREA);
            pOffset = wijmo.getElementRect(pa);
            plotBox = pa.getBBox();

            if (plotBox && plotBox.width && plotBox.height) {
                this._adjustMinAndMax();

                // position and sized rangeslider
                this._rangeSlider._refresh(
                    {
                        left: plotBox.x,
                        top: pOffset.top - rOffset.top,
                        width: plotBox.width,
                        height: plotBox.height
                    });
            }
        }

        private _adjustMinAndMax() {
            var self = this, chart = self._chart, rangeSlider = self._rangeSlider,
                min = self._min, max = self._max,
                axis = self._orientation === Orientation.X ? chart.axisX : chart.axisY,
                actualMin = isDate(axis.actualMin) ? axis.actualMin.valueOf() : axis.actualMin,
                actualMax = isDate(axis.actualMax) ? axis.actualMax.valueOf() : axis.actualMax,
                range = actualMax - actualMin;

            self._min = (min === null || isNaN(min) || min === undefined || min < actualMin || min > actualMax) ? actualMin : min;
            self._max = (max === null || isNaN(max) || max === undefined || max < actualMin || max > actualMax) ? actualMax : max;

            // removed
            //rangeSlider._minPos = (self._min - actualMin) / range;
            //rangeSlider._maxPos = (self._max - actualMin) / range;
            //
            // The previous code is only for regular(linear) axis.
            // Take into account non-linear axis:
            var plotRect = this._chart._plotRect;
            if (!plotRect) {
                return;
            }
            if (this._orientation === Orientation.X) {
                var minPos = (axis.convert(self._min) - plotRect.left) / plotRect.width;
                rangeSlider._minPos = minPos;
                var maxPos = (axis.convert(self._max) - plotRect.left) / plotRect.width;
                rangeSlider._maxPos = maxPos;
            } else {
                var minPos = (plotRect.top - axis.convert(self._min)) / plotRect.height + 1;
                rangeSlider._minPos = minPos;
                var maxPos = (plotRect.top - axis.convert(self._max)) / plotRect.height + 1;
                rangeSlider._maxPos = maxPos;
            }

            this._updateMinAndMaxWithScale(false);
        }

        private _updateMinAndMaxWithScale(fireEvent:boolean) {
            var rangeSlider = this._rangeSlider, max, updated = false;

            if (this._minScale !== 0 &&
                rangeSlider._minPos + this._minScale > rangeSlider._maxPos) {
                max = rangeSlider._minPos + this._minScale;
                if (max > 1) {
                    rangeSlider._maxPos = 1;
                    rangeSlider._minPos = 1 - this._minScale;
                } else {
                    rangeSlider._maxPos = max;
                }
                updated = true;
            }

            if (this._maxScale !== 1 &&
                rangeSlider._minPos + this._maxScale < rangeSlider._maxPos) {
                max = rangeSlider._minPos + this._maxScale;
                if (max > 1) {
                    rangeSlider._maxPos = 1;
                    rangeSlider._minPos = 1 - this._maxScale;
                } else {
                    rangeSlider._maxPos = max;
                }
                updated = true;
            }

            if (updated) {
                this._min = this._getMinAndMax()['min'];
                this._max = this._getMinAndMax()['max'];
                if (fireEvent) {
                    if (!this._rangeSelectorEle) {
                        return;
                    }

                    this._rangeSlider._refresh();
                    this.onRangeChanged();
                }
            }

        }

        private _changeRange() {
            this._adjustMinAndMax();

            if (!this._rangeSelectorEle) {
                return;
            }

            this._rangeSlider._refresh();
            this.onRangeChanged();
        }

        private _updateRange() {
            var rangeSlider = this._rangeSlider,
                chart, axis, actualMin, actualMax, range;
            chart = this._chart;
            axis = this._orientation === Orientation.X ? chart.axisX : chart.axisY;
            
            //raise event

            // removed
            // this._min = actualMin + this._minPos * range;
            // this._max = actualMin + this._maxPos * range;
            //
            // The previous code is only for regular(linear) axis.
            // take into account non-linear axis
            this._min = this._getMinAndMax()['min'];
            this._max = this._getMinAndMax()['max'];
            this.onRangeChanged();
        }

        private _getMinAndMax(): any {
            var rangeSlider = this._rangeSlider,
                chart = this._chart,
                axis = this._orientation === Orientation.X ? chart.axisX : chart.axisY,
                plotRect = this._chart._plotRect,
                min, max;
            if (this._orientation === Orientation.X) {
                min = axis.convertBack(plotRect.left + rangeSlider._minPos * plotRect.width);
                max = axis.convertBack(plotRect.left + rangeSlider._maxPos * plotRect.width);
            } else {
                min = axis.convertBack(plotRect.top + (1 - rangeSlider._minPos) * plotRect.height);
                max = axis.convertBack(plotRect.top + (1 - rangeSlider._maxPos) * plotRect.height);
            }
            return { min:min, max:max };
        }
    } 
}