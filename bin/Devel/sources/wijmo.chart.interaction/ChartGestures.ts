module wijmo.chart.interaction {

    /**
      * Specifies the mouse action of the chart gestures.
      */
    export enum MouseAction {
        /** Zoom chart by mouse. */
        Zoom = 0,
        /** Pan chart by mouse. */
        Pan = 1,
    }

    /**
      * Specifies the interactive axes of the chart gestures.
      */
    export enum InteractiveAxes {
        /** Interactive Axis X. */
        X = 0,
        /** Interactive Axis Y. */
        Y = 1,
        /** Interactive Both Axis X and Axis Y. */
        XY = 2,
    }    

    /**
     * The @see:ChartGestures control allows the user to zoom or pan on  
     * the specified @see:FlexChart.
     *
     * To use the @see:ChartGestures control, specify the @see:FlexChart
     * control on which to zoom or pan.
     *
     * <pre>
     *  var chartGestures = new wijmo.chart.interaction.ChartGestures(chart);
     * </pre>
     */
    export class ChartGestures {
        static _CSS_ZOOM = 'wj-zoom';
        static _CSS_ZOOM_OVERLAY = 'wj-zoom-overlay';
        static _CSS_PANABLE = 'wj-panable';
        static _CSS_TOUCH_DISABLED = 'wj-flexchart-touch-disabled';
        static _CSS_BLOCK_INTERACTION = 'wj-block-other-interaction';

        private _chart: wijmo.chart.FlexChartCore = null;
        private _zoomEle: HTMLElement = null;
        private _overlayEle: HTMLElement = null;
        private _zoomEleOffset: any;

        //events
        private _wrapperMousedown = null;
        private _wrapperMouseMove = null;
        private _wrapperMouseup = null;
        private _wrapperPointerdown = null;
        private _wrapperPointerMove = null;
        private _wrapperPointerup = null;
        private _wrapperTouchStart = null;
        private _wrapperTouchMove = null;
        private _wrapperTouchEnd = null;
        private _wrapperMouseWheel = null;
          
        //help                         
        private _plotBox: any;
        private _startFirstPt: Point = null;
        private _minX: number = null;
        private _maxX: number = null;
        private _minY: number = null;
        private _maxY: number = null;
        private _seriesGroup: any;
        private _threadHold: number = 20;
        private _scaling: boolean;
        private _panning: boolean;
        private _startDistance: any;
        private _clip = {};
        private _selection = {};
        private _startPointers = [];
        private _mvPointers = [];
        private _plotOffset: any;
        private _endPoint: Point;
        private _pinchStartEvents = [];
        private _minXRange: number = null;
        private _minYRange: number = null;
        private _innerUpdating: boolean = false;
        private _lastMinX: number = null;
        private _lastMaxX: number = null;
        private _lastMinY: number = null;
        private _lastMaxY: number = null;

        //option
        private _mouseAction = MouseAction.Zoom;
        private _interactiveAxes = InteractiveAxes.X;
        private _enable = true;
        private _scaleX: number = 1;
        private _scaleY: number = 1;
        private _posX: number = 0;
        private _posY: number = 0;

        /**
         * Initializes a new instance of the @see:ChartGestures class.
         *
         * @param chart The @see:FlexChart that allows the user to zoom or pan.
         * @param options A JavaScript object containing initialization data for the control.
         */
        constructor(chart: wijmo.chart.FlexChartCore, options?) {
            if (!chart) {
                assert(false, 'The FlexChart cannot be null.');
            }

            this._chart = chart;
            wijmo.copy(this, options);
            this._initialize();
        }

        /**
          * Gets or sets the mouse action of the ChartGestures.
          */
        get mouseAction(): MouseAction {
            return this._mouseAction;
        }

        set mouseAction(value: MouseAction) {
            if (value !== this._mouseAction) {
                this._mouseAction = asEnum(value, MouseAction);
            }
        }

        /**
          * Gets or sets the interactive axes of the ChartGestures.
          */
        get interactiveAxes(): InteractiveAxes {
            return this._interactiveAxes;
        }

        set interactiveAxes(value: InteractiveAxes) {
            if (value !== this._interactiveAxes) {
                this._interactiveAxes = asEnum(value, InteractiveAxes);
            }
        }

        /**
          * Gets or sets the enable of the ChartGestures.
          */
        get enable(): boolean {
            return this._enable;
        }

        set enable(value: boolean) {
            if (value !== this._enable) {
                this._enable = asBoolean(value, true);
            }
        }

        /**
          * Gets or sets the initial scale of axis X.
          * The scale should be more than 0 and less than or equal to 1.
          * The scale specifies which part of the range between Min and Max
          * is shown. When scale is 1 (default value), the whole axis range
          * is visible.
          */
        get scaleX(): number {
            return this._scaleX;
        }

        set scaleX(value: number) {
            if (value !== this._scaleX) {
                if (value < 0) {
                    this._scaleX = 0;
                } else if (value > 1) {
                    this._scaleX = 1;
                } else {
                    this._scaleX = asNumber(value);
                } 
                if (this._seriesGroup) {
                    this._initAxisRangeWithPosAndScale(true);     
                }
            }
        }

        /**
          * Gets or sets the initial scale of axis Y.
          * The scale should be more than 0 and less than or equal to 1.
          * The scale specifies which part of the range between Min and Max
          * is shown. When scale is 1 (default value), the whole axis range
          * is visible.
          */
        get scaleY(): number {
            return this._scaleY;
        }
        set scaleY(value: number) {
            if (value !== this._scaleY) {
                if (value < 0) {
                    this._scaleY = 0;
                } else if (value > 1) {
                    this._scaleY = 1;
                } else {
                    this._scaleY = asNumber(value);
                }
                if (this._seriesGroup) {
                    this._initAxisRangeWithPosAndScale(false);  
                }
            }
        }

        /**
          * Gets or sets the initial position of the axis X.
          * The value represents initial position on the axis when the Scale
          * is less than 1. Otherwise, the Value has no effect. The Value should
          * lie between 0 to 1.
         */
        get posX(): number {
            return this._posX;
        }
        set posX(value: number) {
            if (value !== this._posX) {
                if (value < 0) {
                    this._posX = 0;
                } else if (value > 1) {
                    this._posX = 1;
                } else {
                    this._posX = asNumber(value);
                } 
                if (this._seriesGroup) {
                    this._initAxisRangeWithPosAndScale(true);   
                }
            }
        }

        /**
          * Gets or sets the initial position of the axis Y.
          * The value represents initial position on the axis when the Scale
          * is less than 1. Otherwise, the Value has no effect. The Value should
          * lie between 0 to 1.
         */
        get posY(): number {
            return this._posY;
        }
        set posY(value: number) {
            if (value !== this._posY) {
                if (value < 0) {
                    this._posY = 0;
                } else if (value > 1) {
                    this._posY = 1;
                } else {
                    this._posY = asNumber(value);
                }
                if (this._seriesGroup) {
                    this._initAxisRangeWithPosAndScale(false);
                }
            }
        }

        /**
         * Removes the @see:ChartGestures control from the chart.
         */
        remove() {
            if (this._zoomEle) {
                this._chart.hostElement.removeChild(this._zoomEle);
                this._zoomEle = null;
            }
            wijmo.removeClass(this._chart.hostElement, ChartGestures._CSS_TOUCH_DISABLED);
            this._switchEvent(false);
            this._wrapperMousedown = null;
            this._wrapperMouseMove = null;
            this._wrapperMouseup = null;
            this._wrapperPointerdown = null;
            this._wrapperPointerMove = null;
            this._wrapperPointerup = null;
            this._wrapperTouchStart = null;
            this._wrapperTouchMove = null;
            this._wrapperTouchEnd = null;
            this._wrapperMouseWheel = null;
        }

        /** 
         * Reset the axis of the chart.
         */
        reset() {
            var chart = this._chart,
                axisX = chart.axisX,
                axisY = chart.axisY;

            if (this._maxX) {
                axisX.max = this._maxX;
            }
            if (this._minX) {
                axisX.min = this._minX;
            }
            if (this._maxY) {
                axisY.max = this._maxY;
            }
            if (this._minY) {
                axisY.min = this._minY;
            }
            // Axis X
            this._initAxisRangeWithPosAndScale(true);
            // Axis Y
            this._initAxisRangeWithPosAndScale(false);
        }
        
        /** 
         * Refreshes the @see:FlexChart with the gestures settings.
         */
        _refreshChart() {
            var chart = this._chart,
                axisX = chart.axisX, axisY = chart.axisY;

            this._minX = this._getAxisMin(axisX);
            this._maxX = this._getAxisMax(axisX);
            this._minY = this._getAxisMin(axisY);
            this._maxY = this._getAxisMax(axisY); 

            //setting the min&max scale range
            this._minXRange = (this._maxX - this._minX) * 0.005;
            this._minYRange = (this._maxY - this._minY) * 0.005;
 
            // initialize Axis X
            this._initAxisRangeWithPosAndScale(true);
            // initialize Axis Y
            this._initAxisRangeWithPosAndScale(false);
        }

        private _initialize() {
            var chart = this._chart,
                chartHostEle = chart.hostElement;

            this._zoomEle = createElement('<div class="' + ChartGestures._CSS_ZOOM + '">' +
                '<div class="' + ChartGestures._CSS_ZOOM_OVERLAY + '"></div>');
            this._zoomEle.style.visibility = 'visible';

            chartHostEle.appendChild(this._zoomEle);
            wijmo.addClass(chartHostEle, ChartGestures._CSS_TOUCH_DISABLED);
            this._overlayEle = <HTMLElement>this._zoomEle.querySelector('.' + ChartGestures._CSS_ZOOM_OVERLAY);
           
            //bind event
            this._wrapperMousedown = this._onMousedown.bind(this);
            this._wrapperMouseMove = this._onMouseMove.bind(this);
            this._wrapperMouseup = this._onMouseup.bind(this);
            this._wrapperPointerdown = this._onPointerdown.bind(this);
            this._wrapperPointerMove = this._onPointerMove.bind(this);
            this._wrapperPointerup = this._onPointerup.bind(this);
            this._wrapperMouseWheel = this._onMouseWheel.bind(this);
            this._wrapperTouchStart = this._onTouchStart.bind(this);
            this._wrapperTouchMove = this._onTouchMove.bind(this);
            this._wrapperTouchEnd = this._onTouchEnd.bind(this);
            this._switchEvent(true);
        }

        private _switchEvent(isOn: boolean) {
            var chartHostEle = this._chart.hostElement,
                eventListener = isOn ? 'addEventListener' : 'removeEventListener',
                eventHandler = isOn ? 'addHandler' : 'removeHandler';

            if (chartHostEle) {
                chartHostEle[eventListener]('mousedown', this._wrapperMousedown);
                chartHostEle[eventListener]('mousemove', this._wrapperMouseMove);
                document[eventListener]('mouseup', this._wrapperMouseup);
                if ('onpointerdown' in window) {
                    chartHostEle[eventListener]('pointerdown', this._wrapperPointerdown);
                    chartHostEle[eventListener]('pointermove', this._wrapperPointerMove);
                    document[eventListener]('pointerup', this._wrapperPointerup);
                }
                // change to 'wheel' event
               // if ('onmousewheel' in window) {
                //    chartHostEle[eventListener]('mousewheel', this._wrapperMouseWheel);
                //}
                chartHostEle[eventListener]('wheel', this._wrapperMouseWheel);
                if ('ontouchstart' in window) {
                    chartHostEle[eventListener]('touchstart', this._wrapperTouchStart);
                    chartHostEle[eventListener]('touchmove', this._wrapperTouchMove);
                    document[eventListener]('touchend', this._wrapperTouchEnd);
                }
                this._chart.rendered[eventHandler](this._refresh, this);
            }
        }

        private _refresh() {
            var chart = this._chart,
                axisX = chart.axisX, axisY = chart.axisY,
                chartHostEle = chart.hostElement, pa,
                rangeXChged, rangeYChged;

            this._seriesGroup = chartHostEle.querySelector('.wj-series-group');
            pa = chartHostEle.querySelector('.' + FlexChart._CSS_PLOT_AREA);
            this._plotOffset = wijmo.getElementRect(pa);
            this._plotBox = pa.getBBox();
            this._zoomEleOffset = wijmo.getElementRect(this._zoomEle);
            if (this._overlayEle) {
                this._overlayEle.removeAttribute('style');
            }

            if (this._innerUpdating) {
                this._innerUpdating = false;
                return;
            }

            rangeXChged = false;
            rangeYChged = false;
           
            if (this._minX === null || isNaN(this._minX) || this._minX === 0
                || this._minX === -1 || this._lastMinX !== this._getAxisMin(axisX)) {
                this._minX = this._getAxisMin(axisX);
                if (this._minX !== null && !isNaN(this._minX) && this._minX !== 0 && this._minX !== -1) {
                    rangeXChged = true;
                }                
            }
            if (this._maxX === null || isNaN(this._maxX) || this._maxX === 0
                || this._maxX === -1 || this._lastMaxX !== this._getAxisMax(axisX)) {
                this._maxX = this._getAxisMax(axisX);
                if (this._maxX !== null && !isNaN(this._maxX) && this._maxX !== 0 && this._maxX !== -1) {
                    rangeXChged = true;
                }   
            }

            if (this._minY === null || isNaN(this._minY) || this._lastMinY !== this._getAxisMin(axisY)) {
                this._minY = this._getAxisMin(axisY);               
                if (!isNaN(this._minY)) {
                    rangeYChged = true;
                }                
            }
            if (this._maxY === null || isNaN(this._maxY) || this._lastMaxY !== this._getAxisMax(axisY)) {
                this._maxY = this._getAxisMax(axisY);
                if (!isNaN(this._maxY)) {
                    rangeYChged = true;
                } 
            }
            
            //setting the min&max scale range
            this._minXRange = (this._maxX - this._minX) * 0.005;
            this._minYRange = (this._maxY - this._minY) * 0.005;

            //initialize axisX and axisY      
            if (rangeXChged && this._scaleX !== null && this._scaleX !== undefined && this._scaleX !== 1 &&
                this._posX !== null && this._posX !== undefined && this._posX !== 0) {
                this._initAxisRangeWithPosAndScale(true);              
            }
            if (rangeYChged && this._scaleY !== null && this._scaleY !== undefined && this._scaleY !== 1 &&
                this._posY !== null && this._posY !== undefined && this._posY !== 0) {
                this._initAxisRangeWithPosAndScale(false);              
            }
        }

        /** mouse event*/
        private _onMousedown(e: MouseEvent) {
            if (!this._enable) {
                return;
            }
            this._disabledOthersInteraction(true);
            this._mouseDown(e);
            e.preventDefault();
        }

        private _onMouseMove(e: MouseEvent) {
            if (!this._enable) {
                return;
            }
            this._mouseMove(e);
            e.preventDefault();
        }

        private _onMouseup(e: MouseEvent) {
            if (!this._enable) {
                return;
            }
            this._mouseup(e);
            this._disabledOthersInteraction(false);
            //e.preventDefault();
        }

        private _onMouseWheel(e: WheelEvent) {
            //var delta = e.detail || e.wheelDelta,
            var delta = -e.deltaY,
                chg = delta > 0 ? 0.05 : -0.05;
            if (!this._enable) {
                return;
            }
            this._scaling = true;
            if (this._interactiveAxes === InteractiveAxes.X ||
                this._interactiveAxes === InteractiveAxes.XY) {
                this._updateAxisByChg(true, chg, -chg);
            }

            if (this._interactiveAxes === InteractiveAxes.Y ||
                this._interactiveAxes === InteractiveAxes.XY) {
                this._updateAxisByChg(false, chg, -chg);
            }
            this._scaling = false;
            e.preventDefault();
        }

        private _mouseDown(e: MouseEvent) {
            this._startFirstPt = this._getPoint(e);
            this._updatePoint(this._startFirstPt);
            if (this._mouseAction === MouseAction.Zoom) {
                this._initOverlay();
            } else {
                this._seriesGroup.setAttribute('clip-path', 'url(#' + this._chart._plotrectId + ')');
                wijmo.toggleClass(this._chart.hostElement, ChartGestures._CSS_PANABLE, this._mouseAction === MouseAction.Pan);
            }
        }

        private _mouseMove(e: MouseEvent) {
            var mvPt;
            if (!this._startFirstPt) {
                return;
            }

            mvPt = this._getPoint(e);
            this._updatePoint(mvPt);
            this._endPoint = new Point(mvPt.x, mvPt.y);

            if (this._mouseAction === MouseAction.Zoom) {
                this._updateOverLay(mvPt);
            } else {
                this._panning = true;
                this._panningChart(mvPt.x - this._startFirstPt.x, mvPt.y - this._startFirstPt.y);
            }
        }

        private _mouseup(e: MouseEvent) {
            var endPt = this._endPoint,
                axisX = this._chart.axisX;

            if (!this._startFirstPt || !endPt) {
                wijmo.removeClass(this._chart.hostElement, ChartGestures._CSS_PANABLE);
                this._reset();
                return;
            }

            if (this._mouseAction === MouseAction.Zoom) {
                this._zoomedChart(endPt);
                this._reset();
            } else {
                this._pannedChart(endPt.x - this._startFirstPt.x, endPt.y - this._startFirstPt.y);
                this._reset();
            }
            wijmo.removeClass(this._chart.hostElement, ChartGestures._CSS_PANABLE);
        }

        /** ms pointer event*/
        private _onPointerdown(e: PointerEvent) {
            if (!this._enable) {
                return;
            }
            this._disabledOthersInteraction(true);
            switch (e.pointerType) {
                case "touch":
                    this._pointerDown(e);
                    break;
                case "mouse":
                    this._mouseDown(e);
                    break;
            }
            e.preventDefault();
        }

        private _onPointerMove(e: PointerEvent) {
            if (!this._enable) {
                return;
            }
            switch (e.pointerType) {
                case "touch":
                    this._pointerMove(e);
                    break;
                case "mouse":
                    this._mouseMove(e);
                    break;
            }
            e.preventDefault();
        }

        private _onPointerup(e: PointerEvent) {
            if (!this._enable) {
                return;
            }
            switch (e.pointerType) {
                case "touch":
                    this._pointerUp(e);
                    break;
                case "mouse":
                    this._mouseup(e);
                    break;
            }
            this._disabledOthersInteraction(false);
            e.preventDefault();
        }

        private _pointerDown(e: any) {
            if (e.preventManipulation)
                e.preventManipulation();

            this._seriesGroup.setAttribute('clip-path', 'url(#' + this._chart._plotrectId + ')');
            this._startPointers.push({ id: e.pointerId, x: e.pageX, y: e.pageY });
            if (this._startPointers.length === 1) {
                this._scaling = false;
                this._panning = true;
            } else if (this._startPointers.length === 2) {
                this._panning = false;
                this._scaling = true;
                this._startDistance = {
                    x: this._startPointers[0].x - this._startPointers[1].x,
                    y: this._startPointers[0].y - this._startPointers[1].y,
                };
            }
        }

        private _pointerMove(e: any) {
            var pt1, pt2,
                mvPt = new Point(e.pageX, e.pageY),
                rNowCordinate, rStartCordinate,
                offset = {}, scale = {};
            if (e.preventManipulation)
                e.preventManipulation();

            if (this._panning) {
                if (!this._pointInPlotArea(mvPt)) {
                    return;
                }
                this._endPoint = new Point(e.pageX, e.pageY);
                this._panningChart(this._endPoint.x - this._startPointers[0].x, this._endPoint.y - this._startPointers[0].y);
            } else if (this._scaling) {
                pt1 = this._startPointers[0].id + '';
                pt2 = this._startPointers[1].id + '';

                this._mvPointers[e.pointerId + ''] = { x: e.pageX, y: e.pageY };

                if (this._mvPointers[pt1] && this._mvPointers[pt2]) {
                    if (Math.abs(this._startDistance.x) > this._threadHold &&
                        this._interactiveAxes !== InteractiveAxes.Y) {
                        rNowCordinate = this._mvPointers[pt1].x - this._plotOffset.left;
                        rStartCordinate = this._startPointers[0].x - this._plotOffset.left;
                        scale['x'] = Math.abs((this._mvPointers[pt1].x - this._mvPointers[pt2].x) / this._startDistance.x);
                        offset['x'] = rNowCordinate - scale['x'] * rStartCordinate;
                        this._clip['x'] = (this._plotBox.x - rNowCordinate) / scale['x'] + rStartCordinate;
                        this._selection['w'] = this._plotBox.width / scale['x'];
                    }
                    if (Math.abs(this._startDistance.y) > this._threadHold &&
                        this._interactiveAxes !== InteractiveAxes.X) {
                        rNowCordinate = this._mvPointers[pt1].y - this._plotOffset.top;
                        rStartCordinate = this._startPointers[0].y - this._plotOffset.top;
                        scale['y'] = Math.abs((this._mvPointers[pt1].y - this._mvPointers[pt2].y) / this._startDistance.y);
                        offset['y'] = rNowCordinate - scale['y'] * rStartCordinate;
                        this._clip['y'] = (this._plotBox.y - rNowCordinate) / scale['y'] + rStartCordinate;
                        this._selection['h'] = this._plotBox.height / scale['y'];
                    }
                    this._scalingChart(scale, offset);
                }
            }
        }

        private _pointerUp(e: any) {
            if (e.preventManipulation)
                e.preventManipulation();

            if (this._panning) {
                if (this._endPoint) {
                    this._pannedChart(this._endPoint.x - this._startPointers[0].x, this._endPoint.y - this._startPointers[0].y);
                }                
                this._reset();
            } else if (this._scaling) {
                this._scaledChart(e);
                this._reset();
            }
        }

        /** touch event*/
        private _onTouchStart(e: any) {
            if (!this._enable) {
                return;
            }
            this._disabledOthersInteraction(true);
            if (e.touches.length == 1) {
                this._scaling = false;
                this._panning = true;
                this._startFirstPt = this._getPoint(e);
            } else if (e.touches.length == 2) {
                this._pinchStartEvents = this._getTouchPair(e);
                this._startDistance = this._touchDistance(e);
                this._panning = false;
                this._scaling = true;
            }
            if (this._seriesGroup) {
                this._seriesGroup.setAttribute('clip-path', 'url(#' + this._chart._plotrectId + ')');
            }

            e.preventDefault();
            return true;
        }

        private _onTouchMove(e: any) {
            if (!this._enable) {
                return;
            }
            var scale = {}, offset = {},
                touchs = e.touches[0],
                mvPt = new Point(touchs.pageX, touchs.pageY),
                rNowCordinate, rStartCordinate,
                nowDist, nowPos, startPos;
            e.preventDefault();

            if (this._panning) {
                if (this._startFirstPt) {
                    if (!this._pointInPlotArea(mvPt)) {
                        return;
                    }
                    this._endPoint = new Point(touchs.pageX, touchs.pageY);
                    this._panningChart(this._endPoint.x - this._startFirstPt.x,
                        this._endPoint.y - this._startFirstPt.y);
                }
            } else if (this._scaling) {

                nowDist = this._touchDistance(e);
                nowPos = this._getTouchPair(e)[0];
                startPos = this._pinchStartEvents[0];
                
                //horizontal
                if (Math.abs(this._startDistance.x) > this._threadHold &&
                    this._interactiveAxes !== InteractiveAxes.Y) {
                    rNowCordinate = nowPos.pageX - this._plotOffset.left;
                    rStartCordinate = startPos.pageX - this._plotOffset.left;
                    scale['x'] = Math.abs(nowDist.x / this._startDistance.x);
                    offset['x'] = rNowCordinate - (scale['x'] * rStartCordinate);
                    this._clip['x'] = (this._plotBox.x - rNowCordinate) / scale['x'] + rStartCordinate;
                    this._selection['w'] = this._plotBox.width / scale['x'];
                }
               
                //vertical
                if (Math.abs(this._startDistance.y) > this._threadHold &&
                    this._interactiveAxes !== InteractiveAxes.X) {
                    rNowCordinate = nowPos.pageY - this._plotOffset.top;
                    rStartCordinate = startPos.pageY - this._plotOffset.top;
                    scale['y'] = Math.abs(nowDist.y / this._startDistance.y);
                    offset['y'] = rNowCordinate - (scale['y'] * rStartCordinate);
                    this._clip['y'] = (this._plotBox.y - rNowCordinate) / scale['y'] + rStartCordinate;
                    this._selection['h'] = this._plotBox.height / scale['y'];
                }
                this._scalingChart(scale, offset);
            }

            return true;
        }

        private _onTouchEnd(e: any) {
            if (!this._enable) {
                return;
            }
            var endPt = this._endPoint;

            if (this._panning) {
                if (!this._startFirstPt || !endPt) {
                    this._reset();
                    return;
                }
                this._pannedChart(endPt.x - this._startFirstPt.x, endPt.y - this._startFirstPt.y);
            } else if (this._scaling) {
                this._scaledChart(e);
            }
            this._reset();
            this._disabledOthersInteraction(false);        
            //e.preventDefault();
            return true;
        }

        /** help method of zooming chart by mouse */
        private _initOverlay() {
            this._zoomEle.style.visibility = 'visible';
            switch (this._interactiveAxes) {
                case InteractiveAxes.X:
                    this._overlayEle.style.left = (this._startFirstPt.x - this._zoomEleOffset.left) + 'px';
                    this._overlayEle.style.top = (this._plotOffset.top - this._zoomEleOffset.top) + 'px';
                    break;
                case InteractiveAxes.Y:
                    this._overlayEle.style.left = (this._plotBox.x) + 'px';
                    this._overlayEle.style.top = (this._startFirstPt.y - this._zoomEleOffset.top) + 'px';
                    break;
                case InteractiveAxes.XY:
                    this._overlayEle.style.left = (this._startFirstPt.x - this._zoomEleOffset.left) + 'px';
                    this._overlayEle.style.top = (this._startFirstPt.y - this._zoomEleOffset.top) + 'px';
                    break;
            }
        }

        private _updateOverLay(mvPt: Point) {
            var distanceX = this._startFirstPt.x - mvPt.x,
                distanceY = this._startFirstPt.y - mvPt.y,
                style = {};

            switch (this._interactiveAxes) {
                case InteractiveAxes.X:
                    if ((Math.abs(distanceX)) < this._threadHold) {
                        return;
                    }
                    style = distanceX <= 0 ?
                        { width: Math.abs(distanceX) + 'px', height: this._plotBox.height + 'px' } :
                        { left: (mvPt.x - this._zoomEleOffset.left) + 'px', width: distanceX + 'px', height: this._plotBox.height + 'px' };
                    break;
                case InteractiveAxes.Y:
                    if ((Math.abs(distanceY)) < this._threadHold) {
                        return;
                    }
                    style = distanceY <= 0 ?
                        { height: Math.abs(distanceY) + 'px', width: this._plotBox.width + 'px' } :
                        { top: (mvPt.y - this._zoomEleOffset.top) + 'px', height: distanceY + 'px', width: this._plotBox.width + 'px' };
                    break;
                case InteractiveAxes.XY:
                    //horizontal
                    if ((Math.abs(distanceX)) >= this._threadHold) {
                        style['width'] = Math.abs(distanceX) + 'px';
                        if (distanceX > 0) {
                            style['left'] = (mvPt.x - this._zoomEleOffset.left) + 'px';
                        }
                    }
                    //vertical
                    if ((Math.abs(distanceY)) >= this._threadHold) {
                        style['height'] = Math.abs(distanceY) + 'px';
                        if (distanceY > 0) {
                            style['top'] = (mvPt.y - this._zoomEleOffset.top) + 'px';
                        }
                    }
                    break;
            }
            wijmo.setCss(this._overlayEle, style);
        }

        _updatePoint(mvPt: Point) {
            var plotRect = this._plotOffset;
            if (mvPt.x < plotRect.left) {
                mvPt.x = plotRect.left;
            }
            if (mvPt.x > plotRect.left + plotRect.width) {
                mvPt.x = plotRect.left + plotRect.width;
            }
            if (mvPt.y < plotRect.top) {
                mvPt.y = plotRect.top;
            }
            if (mvPt.y > plotRect.top + plotRect.height) {
                mvPt.y = plotRect.top + plotRect.height;
            }
        }

        _pointInPlotArea(mvPt: Point) {
            var plotRect = this._plotOffset;
            if (mvPt.x >= plotRect.left && mvPt.x <= plotRect.left + plotRect.width &&
                mvPt.y >= plotRect.top && mvPt.y <= plotRect.top + plotRect.height) {
                return true;
            }
            return false;
        }

        private _zoomedChart(endPt: Point) {
            if (!endPt) {
                return;
            }
            //horizontal
            if (this._interactiveAxes === InteractiveAxes.X ||
                this._interactiveAxes === InteractiveAxes.XY) {
                this._zoomedAxis(endPt, true);
            }
            //vertical
            if (this._interactiveAxes === InteractiveAxes.Y ||
                this._interactiveAxes === InteractiveAxes.XY) {
                this._zoomedAxis(endPt, false);
            }
            this._startFirstPt = null;
            //this._refresh();
        }

        private _zoomedAxis(endPt: Point, isX: boolean) {
            var htStart, htEnd, min, max,
                axis = isX ? this._chart.axisX : this._chart.axisY,
                xy = isX ? 'x' : 'y', lt = isX ? 'left' : 'top';

            if (!endPt) {
                return;
            }
            if (Math.abs(this._startFirstPt[xy] - endPt[xy]) > this._threadHold) {

                min = axis.convertBack(this._startFirstPt[xy] - this._plotOffset[lt] + this._plotBox[xy]);
                max = axis.convertBack(endPt[xy] - this._plotOffset[lt] + this._plotBox[xy]);

                if (max - min !== 0) {
                    this._updateAxisRange(axis, Math.min(min, max), Math.max(min, max));
                }
            }
        }

        private _panningChart(distanceX: number, distanceY: number) {
            var axisX = this._chart.axisX, axisY = this._chart.axisY,
                sgs = this._getTransFormGroups();

            distanceX = (Math.abs(distanceX)) < this._threadHold ? 0 : distanceX;
            distanceY = (Math.abs(distanceY)) < this._threadHold ? 0 : distanceY;

            if (this._interactiveAxes === InteractiveAxes.X) {
                distanceY = 0;
            }

            if (this._interactiveAxes === InteractiveAxes.Y) {
                distanceX = 0;
            }
            
            // check x axis range
            if (distanceX > 0 && axisX.actualMin.valueOf() === this._minX) {
                distanceX = 0;
            }
            if (distanceX < 0 && axisX.actualMax.valueOf() === this._maxX) {
                distanceX = 0;
            }
            // check y axis range
            if (distanceY > 0 && axisY.actualMax.valueOf() === this._maxY) {
                distanceY = 0;
            }
            if (distanceY < 0 && axisY.actualMin.valueOf() === this._minY) {
                distanceY = 0;
            }

            for (var i = 0; i < sgs.length; i++) {
                sgs[i].setAttribute('transform', 'translate(' + distanceX + ',' + distanceY + ')');
            }
        }

        private _pannedChart(distanceX: number, distanceY: number) {

            if (this._interactiveAxes === InteractiveAxes.X ||
                this._interactiveAxes === InteractiveAxes.XY) {
                this._updateAxisByDistance(true, distanceX);
            }

            if (this._interactiveAxes === InteractiveAxes.Y ||
                this._interactiveAxes === InteractiveAxes.XY) {
                this._updateAxisByDistance(false, -distanceY);
            }
        }

        private _scalingChart(scale, offset) {
            var axisX = this._chart.axisX, axisY = this._chart.axisY,
                seriesGroups,
                offsetX = offset.x !== undefined ? offset.x : 0,
                offsetY = offset.y !== undefined ? offset.y : 0,
                scaleX, scaleY;

            if (!scale) {
                return;
            }
            seriesGroups = this._getTransFormGroups();
            //check x axis range
            if (scale.x !== undefined) {
                if (scale.x < 1) {
                    if (axisX.actualMin.valueOf() === this._minX &&
                        axisX.actualMax.valueOf() === this._maxX) {
                        scale.x = 1;
                        offsetX = 0;
                    }
                }
            }
            //check y axis range
            if (scale.y !== undefined) {
                if (scale.y < 1) {
                    if (axisY.actualMin.valueOf() === this._minY &&
                        axisY.actualMax.valueOf() === this._maxY) {
                        scale.y = 1;
                        offsetY = 0;
                    }
                }
            }

            scaleX = scale.x !== undefined ? scale.x : 1;
            scaleY = scale.y !== undefined ? scale.y : 1;

            for (var i = 0; i < seriesGroups.length; i++) {
                seriesGroups[i].setAttribute('transform', 'translate(' + offsetX + ', ' + offsetY + ') ' +
                    'scale(' + scaleX + ', ' + scaleY + ')');
            }
        }

        private _scaledChart(e: any) {
            var min, max,
                chart = this._chart,
                axisX = chart.axisX,
                axisY = chart.axisY;

            if (!this._clip) {
                return;
            }

            if (this._interactiveAxes !== InteractiveAxes.Y) {
                if (this._clip['x'] !== undefined) {
                    min = Math.max(this._minX, axisX.convertBack(this._clip['x']));
                    max = Math.min(this._maxX, axisX.convertBack(this._clip['x'] + this._selection['w']));
                    if (min - max !== 0) {
                        this._updateAxisRange(axisX, min, max);
                    }
                }
            }

            if (this._interactiveAxes !== InteractiveAxes.X) {
                if (this._clip['y'] !== undefined) {
                    max = Math.min(this._maxY, axisY.convertBack(this._clip['y']));
                    min = Math.max(this._minY, axisY.convertBack(this._clip['y'] + this._selection['h']));
                    if (min - max !== 0) {
                        this._updateAxisRange(axisY, min, max);
                    }
                }
            }
        }

        //help method
        private _updateAxisByDistance(isX: boolean, distance: number) {
            var axis = isX ? this._chart.axisX : this._chart.axisY,
                oriMin = isX ? this._minX : this._minY,
                oriMax = isX ? this._maxX : this._maxY,
                min = axis.actualMin.valueOf(),
                max = axis.actualMax.valueOf(),
                change;

            if (distance === 0) {
                return;
            }
            if ((distance > 0 && oriMin === min) || (
                distance < 0 && oriMax === max)) {
                this._innerUpdating = true;
                this._chart.invalidate();
                return;
            }
            change = distance / (isX ? this._plotBox.width : this._plotBox.height);
            this._updateAxisByChg(isX, -change, -change);
        }

        private _updateAxisByChg(isX: boolean, chgMin: number, chgMax: number) {
            var axis = isX ? this._chart.axisX : this._chart.axisY,
                oriMin = isX ? this._minX : this._minY,
                oriMax = isX ? this._maxX : this._maxY,
                min = axis.actualMin.valueOf(),
                max = axis.actualMax.valueOf(),
                range = max - min,
                plotRect = this._chart._plotRect,
                lt = isX ? plotRect.left : plotRect.top,
                wh = isX ? plotRect.width : plotRect.height,
                minRange = isX ? this._minXRange : this._minYRange,
                tMin, tMax;

            if (isNaN(chgMin) || isNaN(chgMax)) {
                return;
            }

            if (this._panning) {
                if (chgMin < 0) {
                    //tMin = min + chgMin * range;
                    tMin = isX ? axis.convertBack(lt + chgMin * wh) : axis.convertBack(lt + wh - chgMin * wh);
                    if (tMin < oriMin) {
                        tMin = oriMin;
                        //tMax = tMin + range;
                        tMax = isX ? axis.convertBack(axis.convert(tMin) + wh) : axis.convertBack(axis.convert(tMin) - wh);
                    } else {
                        //tMax = max + chgMax * range;
                        tMax = isX ? axis.convertBack(lt + wh + chgMax * wh) : axis.convertBack(lt - chgMax * wh);
                    }
                } else {
                    //tMax = max + chgMax * range;
                    tMax = isX ? axis.convertBack(lt + wh + chgMax * wh) : axis.convertBack(lt - chgMax * wh);
                    if (tMax > oriMax) {
                        tMax = oriMax;
                        //tMin = tMax - range;
                        tMin = isX ? axis.convertBack(axis.convert(tMax) - wh) : axis.convertBack(axis.convert(tMax) + wh);
                    } else {
                        //tMin = min + chgMin * range;
                        tMin = isX ? axis.convertBack(lt + chgMin * wh) : axis.convertBack(lt + wh - chgMin * wh);
                    }
                }

            } else if (this._scaling) {
                //scaling: control the range 
                //tMin = min + chgMin * range;
                //tMax = max + chgMax * range;
                tMin = isX ? axis.convertBack(lt + chgMin * wh) : axis.convertBack(lt + wh - chgMin * wh);
                tMax = isX ? axis.convertBack(lt + wh + chgMax * wh) : axis.convertBack(lt - chgMax * wh);
                if (tMin < oriMin) {
                    tMin = oriMin;
                }
                if (tMax > oriMax) {
                    tMax = oriMax;
                }
                if ((tMax - tMin) < minRange) {
                    tMin = tMax - minRange;
                }
            }
            
            this._updateAxisRange(axis, tMin, tMax);      
        }

        private _initAxisRangeWithPosAndScale(isX: boolean) {
            var range, initRange, initMin, initMax;
            if (isX) {
                range = this._maxX - this._minX;
                initRange = range * this._scaleX;
                initMin = this._minX + this._posX * (range - initRange);
                initMax = this._minX + initRange;
                this._innerUpdating = true;
                this._chart.axisX.min = initMin;
                this._chart.axisX.max = initMax;
                this._lastMinX = initMin;
                this._lastMaxX = initMax;
            } else {
                range = this._maxY - this._minY;
                initRange = range * this._scaleY;
                initMin = this._minY + this._posY * (range - initRange);
                initMax = this._minY + initRange;
                this._innerUpdating = true;
                this._chart.axisY.min = initMin;
                this._chart.axisY.max = initMax; 
                this._lastMinY = initMin;
                this._lastMaxY = initMax;
            }  
        }

        private _updateAxisRange(axis: Axis, tMin: number, tMax: number) {
            this._chart.beginUpdate();
            axis.min = tMin;
            axis.max = tMax;
            if (axis === this._chart.axisX) {
                this._lastMinX = tMin;
                this._lastMaxX = tMax;
            } else {
                this._lastMinY = tMin;
                this._lastMaxY = tMax;
            }
            this._innerUpdating = true;
            this._chart.endUpdate();   
        }

        private _reset() {
            this._scaling = false;
            this._panning = false;
            this._startDistance = 0;
            this._startFirstPt = null;
            this._pinchStartEvents = [];
            this._startPointers = [];
            this._mvPointers = [];
            this._endPoint = null;
            this._clip = {};
            this._selection = {};
        }

        private _getAxisMin(axis: Axis) {
            return isDate(axis.actualMin) ? axis.actualMin.valueOf() : axis.actualMin;
        }

        private _getAxisMax(axis: Axis) {
            return isDate(axis.actualMax) ? axis.actualMax.valueOf() : axis.actualMax;
        }

        private _getTransFormGroups() {
            var seriesGroups = this._seriesGroup.querySelectorAll('g[clip-path]');

            //for Line chart: line chart's group has no clip-path attribute
            if (seriesGroups.length === 0) {
                seriesGroups = this._seriesGroup.querySelectorAll('g');
            }
            return seriesGroups;
        }

        private _disabledOthersInteraction(disabled: boolean) {
            //disabled the line marker
            var hostEle = this._chart.hostElement;
            if (hostEle === null || hostEle === undefined) {
                return;
            }
            var lineMarks = hostEle.querySelectorAll('.wj-chart-linemarker-container');
            for (var i = 0; i < lineMarks.length; i++) {
                if (disabled) {
                    wijmo.addClass(<HTMLElement>lineMarks[i], ChartGestures._CSS_BLOCK_INTERACTION);
                } else {
                    wijmo.removeClass(<HTMLElement>lineMarks[i], ChartGestures._CSS_BLOCK_INTERACTION);
                }
            }
        }

        private _getPoint(e: any): Point {
            return e instanceof MouseEvent ?
                new wijmo.Point(e.pageX, e.pageY) :
                new wijmo.Point(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
        }

        private _getTouchPair(event: any) {
            var touches = [];

            // array of touches is supplied
            if (isArray(event)) {
                touches[0] = event[0];
                touches[1] = event[1];
            }
            // an event
            else {
                if (event.type === 'touchend') {
                    if (event.touches.length === 1) {
                        touches[0] = event.touches[0];
                        touches[1] = event.changedTouches[0];
                    }
                    else if (event.touches.length === 0) {
                        touches[0] = event.changedTouches[0];
                        touches[1] = event.changedTouches[1];
                    }
                }
                else {
                    touches[0] = event.touches[0];
                    touches[1] = event.touches[1];
                }
            }

            return touches;
        }

        private _touchDistance(event: any) {
            var touches = this._getTouchPair(event),
                dx = 0, dy = 0;
            if (touches[0] && touches[0]['pageX'] !== undefined
                && touches[1] && touches[1]['pageX'] !== undefined) {
                dx = touches[0]['pageX'] - touches[1]['pageX'];
            }

            if (touches[0] && touches[0]['pageY'] !== undefined
                && touches[1] && touches[1]['pageY'] !== undefined) {
                dy = touches[0]['pageY'] - touches[1]['pageY'];
            }

            return { x: dx, y: dy };
        }
    }
}