module wijmo.chart.interaction {
    'use strict';
    
    /**
     * Range Slider.
     */
    export class _RangeSlider {
        // Static class
        private static _HRANGESLIDER = 'wj-chart-hrangeslider';
        private static _VRANGESLIDER = 'wj-chart-vrangeslider';
        private static _RANGESLIDER_DECBTN = 'wj-rangeslider-decbtn';
        private static _RANGESLIDER_INCBTN = 'wj-rangeslider-incbtn';
        private static _RANGESLIDER_RANGEHANDLE = 'wj-rangeslider-rangehandle';
        private static _RANGESLIDER_MINHANDLE = 'wj-rangeslider-minhandle';
        private static _RANGESLIDER_MAXHANDLE = 'wj-rangeslider-maxhandle';
        private static _RANGESLIDER_HANDLE_ACTIVE = 'wj-rangeslider-handle-active';

        // fields
        private _isVisible: boolean = true;
        private _buttonsVisible: boolean = true;
        private _minScale: number = 0;
        private _maxScale: number = 1;
        private _seamless: boolean = false;

        // elements
        private _rsContainer: HTMLElement = null;
        private _rsEle: HTMLElement = null;
        private _decBtn: HTMLElement = null;
        private _incBtn: HTMLElement = null;
        private _rsContent: HTMLElement = null;
        private _minHandler: HTMLElement = null;
        private _rangeHandler: HTMLElement = null;
        private _maxHandler: HTMLElement = null;

        // event
        private _wrapperSliderMousedown = null;
        private _wrapperDocMouseMove = null;
        private _wrapperDocMouseup = null;
        private _wrapperBtnMousedown = null;
        private _wrapperRangeSpaceMousedown = null;
        private _wrapperRangeMouseleave = null;

        // helper field
        private _isTouch: boolean = false;
        private _slidingInterval = null;
        private _rangeSliderRect = null;
        private _isHorizontal: boolean = true;
        private _isBtnMousedown: boolean = false;
        private _needSpaceClick: boolean = false;
        private _hasButtons: boolean = true;
        private _movingEle: HTMLElement = null;
        private _movingOffset: Rect = null;
        private _range: number = null;
        private _plotBox;
        private _startPt: Point = null;

        _minPos: number = 0;
        _maxPos: number = 1;

        constructor(container: HTMLElement, needSpaceClick: boolean, hasButtons?: boolean, options?) {
            if (!container) {
                assert(false, 'The container cannot be null.');
            }

            this._isTouch = 'ontouchstart' in window; //isTouchDevice();

            this._needSpaceClick = needSpaceClick; // whether has space click function
            this._hasButtons = hasButtons;  //whether has dec and inc buttons
            wijmo.copy(this, options);
            this._createSlider(container);
        }

        /**
         * Gets or sets whether the increase/decrease buttons are displayed or not.
         */
        get buttonsVisible(): boolean {
            return this._buttonsVisible;
        }
        set buttonsVisible(value: boolean) {
            if (value != this._buttonsVisible) {
                this._buttonsVisible = asBoolean(value);

                if (!this._rsContainer || !this._hasButtons) {
                    return;
                }
                this._refresh();
            }
        }

        /**
         * Gets or sets the orientation of the range slider.
         */
        get isHorizontal(): boolean {
            return this._isHorizontal;
        }
        set isHorizontal(value: boolean) {
            if (value != this._isHorizontal) {
                this._isHorizontal = asBoolean(value);
                if (!this._rsContainer) {
                    return;
                }
                this._invalidate();
            }
        }

        /**
         * Gets or sets the visibility of the range slider.
         */
        get isVisible(): boolean {
            return this._isVisible;
        }
        set isVisible(value: boolean) {
            if (value != this._isVisible) {
                this._isVisible = asBoolean(value);
                if (!this._rsContainer) {
                    return;
                }
                this._rsContainer.style.visibility = this._isVisible ? 'visible' : 'hidden';
            }
        }

        /**
         * Gets or sets the minimum range scale of the range slider.
         */
        get minScale(): number {
            return this._minScale;
        }
        set minScale(value: number) {
            if (value >= 0 && value != this._minScale) {
                this._minScale = asNumber(value);           
            }
        }

        /**
         * Gets or sets the maximum range scale of the range slider.
         */
        get maxScale(): number {
            return this._maxScale;
        }
        set maxScale(value: number) {
            if (value >= 0 && value != this._maxScale) {
                this._maxScale = asNumber(value);
            }
        }

        /**
         * Gets or sets a value that determines whether the minimal and 
         * maximal handler will move seamlessly.
         */
        get seamless(): boolean {
            return this._seamless;
        }
        set seamless(value: boolean) {
            if ( value != this._seamless) {
                this._seamless = asBoolean(value);
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
        * Occurs while the range is changing.
        */
        rangeChanging = new Event();

        /**
         * Raises the @see:rangeChanging event.
         */
        onRangeChanging(e?: EventArgs) {
            this.rangeChanging.raise(this, e);
        }

        get _isSliding() {
            return this._startPt !== null;
        }

        get _handleWidth(): number {
            return this._minHandler.offsetWidth;
        }

        private _createSlider(container: HTMLElement) {
            var sCss = this._isHorizontal ? _RangeSlider._HRANGESLIDER : _RangeSlider._VRANGESLIDER,
                decBtnCss = this._isHorizontal ? 'wj-glyph-left' : 'wj-glyph-down',
                incBtnCss = this._isHorizontal ? 'wj-glyph-right' : 'wj-glyph-up',
                off, box;

            this._rsContainer = container;
            this._rsContainer.style.visibility = this._isVisible ? 'visible' : 'hidden';
            this._rsEle = createElement('<div class="wj-chart-rangeslider ' + sCss + '"></div>');
            this._rsContainer.appendChild(this._rsEle);

            if (this._hasButtons) {
                 //decrease button
                this._decBtn = createElement(
                    '<button class="wj-rangeslider-decbtn wj-btn wj-btn-default" type="button" tabindex="-1">' +
                    '<span class="' + decBtnCss + ' ' + _RangeSlider._RANGESLIDER_DECBTN + '"></span>' +
                    '</button>');
                this._rsEle.appendChild(this._decBtn);

                //increase button
                this._incBtn = createElement(
                    '<button class="wj-rangeslider-incbtn wj-btn wj-btn-default" type="button" tabindex="-1">' +
                    '<span class="' + incBtnCss + ' ' + _RangeSlider._RANGESLIDER_INCBTN + '"></span>' +
                    '</button>');
                this._rsEle.appendChild(this._incBtn);
            }

            //creating range slider
            this._rsContent = createElement('<div class="wj-rangeslider-content">' +
                '<div class="wj-rangeslider-rangehandle"></div>' +
                '<div class="wj-rangeslider-minhandle"></div>' +
                '<div class="wj-rangeslider-maxhandle"></div>');
            this._rsEle.appendChild(this._rsContent);

            this._minHandler = <HTMLElement>this._rsContent.querySelector('.' + _RangeSlider._RANGESLIDER_MINHANDLE);
            this._rangeHandler = <HTMLElement>this._rsContent.querySelector('.' + _RangeSlider._RANGESLIDER_RANGEHANDLE);
            this._maxHandler = <HTMLElement>this._rsContent.querySelector('.' + _RangeSlider._RANGESLIDER_MAXHANDLE);

            //bind event
            this._wrapperSliderMousedown = this._onSliderMousedown.bind(this);
            this._wrapperDocMouseMove = this._onDocMouseMove.bind(this);
            this._wrapperDocMouseup = this._onDocMouseup.bind(this);
            this._wrapperRangeSpaceMousedown = this._onRangeSpaceMousedown.bind(this);
            this._wrapperRangeMouseleave = this._onRangeMouseleave.bind(this);
            this._wrapperBtnMousedown = this._onBtnMousedown.bind(this);
            this._switchEvent(true);
        }

        private _switchEvent(isOn: boolean) {
            var eventListener = isOn ? 'addEventListener' : 'removeEventListener',
                eventHandler = isOn ? 'addHandler' : 'removeHandler';

            if (this._rsContainer) {
                if (this._needSpaceClick) {
                    this._rsEle[eventListener]('mousedown', this._wrapperRangeSpaceMousedown);
                }
                this._rsEle[eventListener]('mouseleave', this._wrapperRangeMouseleave);
                this._rsContent[eventListener]('mousedown', this._wrapperSliderMousedown);

                if (this._hasButtons) {
                    this._decBtn[eventListener]('mousedown', this._wrapperBtnMousedown);
                    this._incBtn[eventListener]('mousedown', this._wrapperBtnMousedown);
                }

                document[eventListener]('mousemove', this._wrapperDocMouseMove);
                document[eventListener]('mouseup', this._wrapperDocMouseup);

                if ('ontouchstart' in window) {
                    if (this._needSpaceClick) {
                        this._rsEle[eventListener]('touchstart', this._wrapperRangeSpaceMousedown);
                    }
                    this._rsContent[eventListener]('touchstart', this._wrapperSliderMousedown);

                    if (this._hasButtons) {
                        this._decBtn[eventListener]('touchstart', this._wrapperBtnMousedown);
                        this._incBtn[eventListener]('touchstart', this._wrapperBtnMousedown);
                    }

                    document[eventListener]('touchmove', this._wrapperDocMouseMove);
                    document[eventListener]('touchend', this._wrapperDocMouseup);
                }
            }
        }

        private _onSliderMousedown(e) {
            if (!this._isVisible) {
                return;
            }

            this._movingEle = e.srcElement || e.target;
            this._startPt = e instanceof MouseEvent ?
            new wijmo.Point(e.pageX, e.pageY) :
            new wijmo.Point(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
            wijmo.removeClass(this._minHandler, _RangeSlider._RANGESLIDER_HANDLE_ACTIVE);
            wijmo.removeClass(this._maxHandler, _RangeSlider._RANGESLIDER_HANDLE_ACTIVE);
            this._movingOffset = wijmo.getElementRect(this._movingEle);
            if (this._movingEle != this._rangeHandler) {
                if (this._isHorizontal) {
                    this._movingOffset.left += 0.5 * this._movingEle.offsetWidth;
                } else {
                    this._movingOffset.top += 0.5 * this._movingEle.offsetHeight;
                }
                wijmo.addClass(this._movingEle, _RangeSlider._RANGESLIDER_HANDLE_ACTIVE);
            } else {
                this._range = this._maxPos - this._minPos;
            }

            e.preventDefault();
        }

        private _onDocMouseMove(e) {
            if (!this._isVisible || !this._startPt) {
                return;
            }

            var movingPt = e instanceof MouseEvent ?
                new wijmo.Point(e.pageX, e.pageY) :
                new wijmo.Point(e.changedTouches[0].pageX, e.changedTouches[0].pageY);

            this._onMove(movingPt);
            //e.preventDefault();
        }

        private _onMove(mvPt: wijmo.Point) {
            var self = this,
                strPt = this._startPt, movingOffset = this._movingOffset,
                plotBox = this._plotBox, range = this._range, moving = this._movingEle,
                left = this._minHandler, middle = this._rangeHandler, right = this._maxHandler,
                x, y, pos;

            if (strPt && movingOffset) {
                if (this._isHorizontal) {
                    x = movingOffset.left + mvPt.x - strPt.x;
                    pos = (x - plotBox.x) / plotBox.width;
                } else {
                    y = movingOffset.top + mvPt.y - strPt.y;
                    pos = 1 - (y - plotBox.y) / plotBox.height;
                }

                if (pos < 0) {
                    pos = 0;
                } else if (pos > 1) {
                    pos = 1;
                } 

                if (moving === left) {
                    if (this._seamless && this._minScale === 0 && pos >= this._maxPos) {
                          self._minPos = self._maxPos;
                          self._movingEle = right;
                          wijmo.removeClass(this._minHandler, _RangeSlider._RANGESLIDER_HANDLE_ACTIVE);
                          wijmo.addClass(this._maxHandler, _RangeSlider._RANGESLIDER_HANDLE_ACTIVE);
                        } else {
                        if (pos > this._maxPos - this._minScale) {
                            pos = this._maxPos - this._minScale;
                        }

                        if (pos < this._maxPos - this._maxScale) {
                            pos = this._maxPos - this._maxScale;
                        }

                        this._minPos = pos;
                    }                  
                    
                } else if (moving === right) {

                    if (this._seamless && this._minScale === 0 && pos <= this._minPos) {
                            self._maxPos = self._minPos;
                            self._movingEle = left;
                            wijmo.removeClass(this._maxHandler, _RangeSlider._RANGESLIDER_HANDLE_ACTIVE);
                            wijmo.addClass(this._minHandler, _RangeSlider._RANGESLIDER_HANDLE_ACTIVE);
                        } else {
                      if (pos < this._minPos + this._minScale) {
                        pos = this._minPos + this._minScale;
                    }
                        if (pos > this._minPos + this._maxScale) {
                            pos = this._minPos + this._maxScale;
                        }
                    this._maxPos = pos;
                  }

                } else if (moving === middle) {
                    if (this._isHorizontal) {
                        this._minPos = pos;
                        this._maxPos = this._minPos + range;
                        if (this._maxPos >= 1) {
                            this._maxPos = 1;
                            this._minPos = this._maxPos - range;
                        }
                    } else {
                        this._maxPos = pos;
                        this._minPos = this._maxPos - range;
                        if (this._minPos <= 0) {
                            this._minPos = 0;
                            this._maxPos = this._minPos + range;
                        }
                    }
                }

                this._updateElesPosition();
                this.onRangeChanging();
            }
        }

        private _onDocMouseup(e) {
            var chart, axis, actualMin, actualMax, range;

            if (!this._isVisible) {
                return;
            }

            // fire event
            this._clearInterval();            
            this._isBtnMousedown = false;
            if (this._startPt) {
                this.onRangeChanged();
                this._startPt = null;
                this._movingOffset = null;
            }
            wijmo.removeClass(this._minHandler, _RangeSlider._RANGESLIDER_HANDLE_ACTIVE);
            wijmo.removeClass(this._maxHandler, _RangeSlider._RANGESLIDER_HANDLE_ACTIVE);
        }

        private _onRangeSpaceMousedown(e) {
            var pt = e instanceof MouseEvent ?
                new wijmo.Point(e.pageX, e.pageY) :
                new wijmo.Point(e.changedTouches[0].pageX, e.changedTouches[0].pageY),
                sOffset = wijmo.getElementRect(this._rsContent),
                rOffset = wijmo.getElementRect(this._rangeHandler),
                clickEle = e.srcElement || e.target,
                offset = 0;

            e.stopPropagation();
            e.preventDefault();
            if (clickEle !== this._rsContent && clickEle !== this._rsEle) {
                return;
            }

            if (this._isHorizontal) {
                offset = rOffset.width / sOffset.width;
                if (pt.x < rOffset.left) {
                    offset = -1 * offset;
                } else if (pt.x > rOffset.left + rOffset.width) {
                    offset = 1 * offset;
                }
            } else {
                offset = rOffset.height / sOffset.height;
                if (pt.y < rOffset.top) {
                    offset = 1 * offset;
                } else if (pt.y > rOffset.top + rOffset.height) {
                    offset = -1 * offset;
                }
            }

            if (offset !== 0) {
                this._doSliding(offset, pt);
            }
        }

        private _onRangeMouseleave(e) {
            e.stopPropagation();
            e.preventDefault();

            if (!this._isBtnMousedown) {
                return;
            }
            //fire event
            this._clearInterval();
            this.onRangeChanged();
        }

        private _onBtnMousedown(e) {
            var targetEle = e.srcElement || e.target, offset = 0;

            e.stopPropagation();
            e.preventDefault();

            if (hasClass(targetEle, _RangeSlider._RANGESLIDER_DECBTN)) {
                if (this._minPos === 0) {
                    return;
                }
                offset = -0.05;
            } else if (hasClass(targetEle, _RangeSlider._RANGESLIDER_INCBTN)) {
                if (this._maxPos === 1) {
                    return;
                }
                offset = 0.05;
            }

            this._isBtnMousedown = true;
            if (offset !== 0) {
                this._doSliding(offset);
            }
        }

        _refresh(rsRect?) {
            var sliderOffset = 0, containerOffset = 0,
                slbarCss, rangeSliderEleCss,
                rOffset = wijmo.getElementRect(this._rsContainer);

            if (rsRect) {
                this._rangeSliderRect = rsRect;
            }

            if (!this._rangeSliderRect) {
                return;
            }

            if (this._hasButtons && this._buttonsVisible) {
                this._decBtn.style.display = 'block';
                this._incBtn.style.display = 'block';
                sliderOffset = this._isHorizontal ? this._decBtn.offsetWidth + this._minHandler.offsetWidth / 2 :
                this._decBtn.offsetHeight + this._minHandler.offsetHeight / 2;
            } else {
                if (this._hasButtons) {
                    this._decBtn.style.display = 'none';
                    this._incBtn.style.display = 'none';
                }
                sliderOffset = this._isHorizontal ? this._minHandler.offsetWidth / 2 : this._minHandler.offsetHeight / 2;
            }

            slbarCss = this._getRsRect();
            if (this._isHorizontal) {               
                slbarCss.left -= this._minHandler.offsetWidth / 2;
                slbarCss.width += this._minHandler.offsetWidth;       
                rangeSliderEleCss = { left: sliderOffset, width: slbarCss.width - sliderOffset * 2 };     
            } else {
                //slbarCss.left -= this._minHandler.offsetWidth;
                slbarCss.top -= this._minHandler.offsetHeight/2;
                slbarCss.height += this._minHandler.offsetHeight;
                rangeSliderEleCss = { top: sliderOffset, height: slbarCss.height - sliderOffset * 2 };
            }

            wijmo.setCss(this._rsEle, slbarCss);
            wijmo.setCss(this._rsContent, rangeSliderEleCss);

            rOffset = wijmo.getElementRect(this._rsContent);
            this._plotBox = { x: rOffset.left, y: rOffset.top, width: rOffset.width, height: rOffset.height };
            this._updateElesPosition();
        }

        private _updateElesPosition() {
            var minHandle = this._minHandler, rangeHandle = this._rangeHandler,
                maxHandle = this._maxHandler, box = this._plotBox,
                rangeCss, minCss, rangeCss, maxCss,
                isHorizontal = this._isHorizontal;

            if (box) {
                minCss = isHorizontal ?
                { left: this._minPos * box.width - 0.5 * minHandle.offsetWidth } :
                { top: (1 - this._minPos) * box.height - 0.5 * maxHandle.offsetHeight };

                rangeCss = isHorizontal ?
                { left: this._minPos * box.width, width: (this._maxPos - this._minPos) * box.width } :
                { top: (1 - this._maxPos) * box.height, height: (this._maxPos - this._minPos) * box.height };

                maxCss = isHorizontal ?
                { left: this._maxPos * (box.width) - 0.5 * maxHandle.offsetWidth } :
                { top: (1 - this._maxPos) * box.height - 0.5 * minHandle.offsetHeight };

                this._refreshSlider(minCss, rangeCss, maxCss);
            }
        }

        private _refreshSlider(minCss, rangeCss, maxCss) {
            wijmo.setCss(this._minHandler, minCss);
            wijmo.setCss(this._rangeHandler, rangeCss);
            wijmo.setCss(this._maxHandler, maxCss);
        }

        private _invalidate() {
            var addClass, rmvClass;

            if (!this._rsContainer) {
                return;
            }
            //get needed adding and removing class
            addClass = this._isHorizontal ?
            _RangeSlider._HRANGESLIDER : _RangeSlider._VRANGESLIDER;
            rmvClass = this._isHorizontal?
            _RangeSlider._VRANGESLIDER : _RangeSlider._HRANGESLIDER;

            wijmo.removeClass(this._rsEle, rmvClass);
            wijmo.addClass(this._rsEle, addClass);
      
            //clear inline style
            [this._rsEle, this._rsContent, this._minHandler,
                this._maxHandler, this._rangeHandler].forEach((ele) => {
                ele.removeAttribute("style");
            })
            this._refresh();
        }

        private _changeRange(offset) {
            var range = this._maxPos - this._minPos;

            if ((offset < 0 && this._minPos === 0) || ((offset > 0 && this._maxPos === 1))) {
                return;
            }
            if (offset < 0) {
                this._minPos += offset;
                this._minPos = this._minPos < 0 ? 0 : this._minPos;
                this._maxPos = this._minPos + range;
            } else {
                this._maxPos += offset;
                this._maxPos = this._maxPos > 1 ? 1 : this._maxPos;
                this._minPos = this._maxPos - range;
            }

            this._updateElesPosition();
        }

        private _doSliding(offset, pt?: Point) {
            var sOffset = wijmo.getElementRect(this._rsContent),
                rOffset = wijmo.getElementRect(this._rangeHandler);

            this._clearInterval();

            this._startPt = new Point();
            this._changeRange(offset);
            this.onRangeChanged();
            this._setSlidingInterval(offset, pt);
        }

        private _setSlidingInterval(offset, pt?: Point) {
            var self = this,
                sOffset, rOffset;
           
            this._slidingInterval = window.setInterval(function () {
                if (pt) {
                    //clear the interval when the rangeslider is on mouse position.
                    sOffset = wijmo.getElementRect(self._rsContent);
                    rOffset = wijmo.getElementRect(self._rangeHandler);
                    if (self._isHorizontal) {
                        if (pt.x >= rOffset.left && pt.x <= rOffset.left + rOffset.width) {
                            self._clearInterval();
                            return;
                        }
                    } else {
                        if (pt.y >= rOffset.top && pt.y <= rOffset.top + rOffset.height) {
                            self._clearInterval();
                            return;
                        }
                    }
                }
                self._changeRange(offset);
                self.onRangeChanged();            
            }, 200);
        }

        private _clearInterval() {
            if (this._slidingInterval) {
                window.clearInterval(this._slidingInterval);
            }
        }

        private _getRsRect() {
            var rsRect = this._rangeSliderRect, rect = {};
            if (!rsRect) {
                return;
            }
            ['left', 'top', 'width', 'height'].forEach(function (key) {
                if (rsRect[key]) {
                    rect[key] = rsRect[key];
                }
            })
            return rect;
        }
    }
}