var wijmo;
(function (wijmo) {
    var chart;
    (function (chart_1) {
        var interaction;
        (function (interaction) {
            'use strict';
            /**
             * Range Slider.
             */
            var _RangeSlider = (function () {
                function _RangeSlider(container, needSpaceClick, hasButtons, options) {
                    // fields
                    this._isVisible = true;
                    this._buttonsVisible = true;
                    this._minScale = 0;
                    this._maxScale = 1;
                    this._seamless = false;
                    // elements
                    this._rsContainer = null;
                    this._rsEle = null;
                    this._decBtn = null;
                    this._incBtn = null;
                    this._rsContent = null;
                    this._minHandler = null;
                    this._rangeHandler = null;
                    this._maxHandler = null;
                    // event
                    this._wrapperSliderMousedown = null;
                    this._wrapperDocMouseMove = null;
                    this._wrapperDocMouseup = null;
                    this._wrapperBtnMousedown = null;
                    this._wrapperRangeSpaceMousedown = null;
                    this._wrapperRangeMouseleave = null;
                    // helper field
                    this._isTouch = false;
                    this._slidingInterval = null;
                    this._rangeSliderRect = null;
                    this._isHorizontal = true;
                    this._isBtnMousedown = false;
                    this._needSpaceClick = false;
                    this._hasButtons = true;
                    this._movingEle = null;
                    this._movingOffset = null;
                    this._range = null;
                    this._startPt = null;
                    this._minPos = 0;
                    this._maxPos = 1;
                    /**
                    * Occurs after the range changes.
                    */
                    this.rangeChanged = new wijmo.Event();
                    /**
                    * Occurs while the range is changing.
                    */
                    this.rangeChanging = new wijmo.Event();
                    if (!container) {
                        wijmo.assert(false, 'The container cannot be null.');
                    }
                    this._isTouch = 'ontouchstart' in window; //isTouchDevice();
                    this._needSpaceClick = needSpaceClick; // whether has space click function
                    this._hasButtons = hasButtons; //whether has dec and inc buttons
                    wijmo.copy(this, options);
                    this._createSlider(container);
                }
                Object.defineProperty(_RangeSlider.prototype, "buttonsVisible", {
                    /**
                     * Gets or sets whether the increase/decrease buttons are displayed or not.
                     */
                    get: function () {
                        return this._buttonsVisible;
                    },
                    set: function (value) {
                        if (value != this._buttonsVisible) {
                            this._buttonsVisible = wijmo.asBoolean(value);
                            if (!this._rsContainer || !this._hasButtons) {
                                return;
                            }
                            this._refresh();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_RangeSlider.prototype, "isHorizontal", {
                    /**
                     * Gets or sets the orientation of the range slider.
                     */
                    get: function () {
                        return this._isHorizontal;
                    },
                    set: function (value) {
                        if (value != this._isHorizontal) {
                            this._isHorizontal = wijmo.asBoolean(value);
                            if (!this._rsContainer) {
                                return;
                            }
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_RangeSlider.prototype, "isVisible", {
                    /**
                     * Gets or sets the visibility of the range slider.
                     */
                    get: function () {
                        return this._isVisible;
                    },
                    set: function (value) {
                        if (value != this._isVisible) {
                            this._isVisible = wijmo.asBoolean(value);
                            if (!this._rsContainer) {
                                return;
                            }
                            this._rsContainer.style.visibility = this._isVisible ? 'visible' : 'hidden';
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_RangeSlider.prototype, "minScale", {
                    /**
                     * Gets or sets the minimum range scale of the range slider.
                     */
                    get: function () {
                        return this._minScale;
                    },
                    set: function (value) {
                        if (value >= 0 && value != this._minScale) {
                            this._minScale = wijmo.asNumber(value);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_RangeSlider.prototype, "maxScale", {
                    /**
                     * Gets or sets the maximum range scale of the range slider.
                     */
                    get: function () {
                        return this._maxScale;
                    },
                    set: function (value) {
                        if (value >= 0 && value != this._maxScale) {
                            this._maxScale = wijmo.asNumber(value);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_RangeSlider.prototype, "seamless", {
                    /**
                     * Gets or sets a value that determines whether the minimal and
                     * maximal handler will move seamlessly.
                     */
                    get: function () {
                        return this._seamless;
                    },
                    set: function (value) {
                        if (value != this._seamless) {
                            this._seamless = wijmo.asBoolean(value);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Raises the @see:rangeChanged event.
                 */
                _RangeSlider.prototype.onRangeChanged = function (e) {
                    this.rangeChanged.raise(this, e);
                };
                /**
                 * Raises the @see:rangeChanging event.
                 */
                _RangeSlider.prototype.onRangeChanging = function (e) {
                    this.rangeChanging.raise(this, e);
                };
                Object.defineProperty(_RangeSlider.prototype, "_isSliding", {
                    get: function () {
                        return this._startPt !== null;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_RangeSlider.prototype, "_handleWidth", {
                    get: function () {
                        return this._minHandler.offsetWidth;
                    },
                    enumerable: true,
                    configurable: true
                });
                _RangeSlider.prototype._createSlider = function (container) {
                    var sCss = this._isHorizontal ? _RangeSlider._HRANGESLIDER : _RangeSlider._VRANGESLIDER, decBtnCss = this._isHorizontal ? 'wj-glyph-left' : 'wj-glyph-down', incBtnCss = this._isHorizontal ? 'wj-glyph-right' : 'wj-glyph-up', off, box;
                    this._rsContainer = container;
                    this._rsContainer.style.visibility = this._isVisible ? 'visible' : 'hidden';
                    this._rsEle = wijmo.createElement('<div class="wj-chart-rangeslider ' + sCss + '"></div>');
                    this._rsContainer.appendChild(this._rsEle);
                    if (this._hasButtons) {
                        //decrease button
                        this._decBtn = wijmo.createElement('<button class="wj-rangeslider-decbtn wj-btn wj-btn-default" type="button" tabindex="-1">' +
                            '<span class="' + decBtnCss + ' ' + _RangeSlider._RANGESLIDER_DECBTN + '"></span>' +
                            '</button>');
                        this._rsEle.appendChild(this._decBtn);
                        //increase button
                        this._incBtn = wijmo.createElement('<button class="wj-rangeslider-incbtn wj-btn wj-btn-default" type="button" tabindex="-1">' +
                            '<span class="' + incBtnCss + ' ' + _RangeSlider._RANGESLIDER_INCBTN + '"></span>' +
                            '</button>');
                        this._rsEle.appendChild(this._incBtn);
                    }
                    //creating range slider
                    this._rsContent = wijmo.createElement('<div class="wj-rangeslider-content">' +
                        '<div class="wj-rangeslider-rangehandle"></div>' +
                        '<div class="wj-rangeslider-minhandle"></div>' +
                        '<div class="wj-rangeslider-maxhandle"></div>');
                    this._rsEle.appendChild(this._rsContent);
                    this._minHandler = this._rsContent.querySelector('.' + _RangeSlider._RANGESLIDER_MINHANDLE);
                    this._rangeHandler = this._rsContent.querySelector('.' + _RangeSlider._RANGESLIDER_RANGEHANDLE);
                    this._maxHandler = this._rsContent.querySelector('.' + _RangeSlider._RANGESLIDER_MAXHANDLE);
                    //bind event
                    this._wrapperSliderMousedown = this._onSliderMousedown.bind(this);
                    this._wrapperDocMouseMove = this._onDocMouseMove.bind(this);
                    this._wrapperDocMouseup = this._onDocMouseup.bind(this);
                    this._wrapperRangeSpaceMousedown = this._onRangeSpaceMousedown.bind(this);
                    this._wrapperRangeMouseleave = this._onRangeMouseleave.bind(this);
                    this._wrapperBtnMousedown = this._onBtnMousedown.bind(this);
                    this._switchEvent(true);
                };
                _RangeSlider.prototype._switchEvent = function (isOn) {
                    var eventListener = isOn ? 'addEventListener' : 'removeEventListener', eventHandler = isOn ? 'addHandler' : 'removeHandler';
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
                };
                _RangeSlider.prototype._onSliderMousedown = function (e) {
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
                        }
                        else {
                            this._movingOffset.top += 0.5 * this._movingEle.offsetHeight;
                        }
                        wijmo.addClass(this._movingEle, _RangeSlider._RANGESLIDER_HANDLE_ACTIVE);
                    }
                    else {
                        this._range = this._maxPos - this._minPos;
                    }
                    e.preventDefault();
                };
                _RangeSlider.prototype._onDocMouseMove = function (e) {
                    if (!this._isVisible || !this._startPt) {
                        return;
                    }
                    var movingPt = e instanceof MouseEvent ?
                        new wijmo.Point(e.pageX, e.pageY) :
                        new wijmo.Point(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
                    this._onMove(movingPt);
                    //e.preventDefault();
                };
                _RangeSlider.prototype._onMove = function (mvPt) {
                    var self = this, strPt = this._startPt, movingOffset = this._movingOffset, plotBox = this._plotBox, range = this._range, moving = this._movingEle, left = this._minHandler, middle = this._rangeHandler, right = this._maxHandler, x, y, pos;
                    if (strPt && movingOffset) {
                        if (this._isHorizontal) {
                            x = movingOffset.left + mvPt.x - strPt.x;
                            pos = (x - plotBox.x) / plotBox.width;
                        }
                        else {
                            y = movingOffset.top + mvPt.y - strPt.y;
                            pos = 1 - (y - plotBox.y) / plotBox.height;
                        }
                        if (pos < 0) {
                            pos = 0;
                        }
                        else if (pos > 1) {
                            pos = 1;
                        }
                        if (moving === left) {
                            if (this._seamless && this._minScale === 0 && pos >= this._maxPos) {
                                self._minPos = self._maxPos;
                                self._movingEle = right;
                                wijmo.removeClass(this._minHandler, _RangeSlider._RANGESLIDER_HANDLE_ACTIVE);
                                wijmo.addClass(this._maxHandler, _RangeSlider._RANGESLIDER_HANDLE_ACTIVE);
                            }
                            else {
                                if (pos > this._maxPos - this._minScale) {
                                    pos = this._maxPos - this._minScale;
                                }
                                if (pos < this._maxPos - this._maxScale) {
                                    pos = this._maxPos - this._maxScale;
                                }
                                this._minPos = pos;
                            }
                        }
                        else if (moving === right) {
                            if (this._seamless && this._minScale === 0 && pos <= this._minPos) {
                                self._maxPos = self._minPos;
                                self._movingEle = left;
                                wijmo.removeClass(this._maxHandler, _RangeSlider._RANGESLIDER_HANDLE_ACTIVE);
                                wijmo.addClass(this._minHandler, _RangeSlider._RANGESLIDER_HANDLE_ACTIVE);
                            }
                            else {
                                if (pos < this._minPos + this._minScale) {
                                    pos = this._minPos + this._minScale;
                                }
                                if (pos > this._minPos + this._maxScale) {
                                    pos = this._minPos + this._maxScale;
                                }
                                this._maxPos = pos;
                            }
                        }
                        else if (moving === middle) {
                            if (this._isHorizontal) {
                                this._minPos = pos;
                                this._maxPos = this._minPos + range;
                                if (this._maxPos >= 1) {
                                    this._maxPos = 1;
                                    this._minPos = this._maxPos - range;
                                }
                            }
                            else {
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
                };
                _RangeSlider.prototype._onDocMouseup = function (e) {
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
                };
                _RangeSlider.prototype._onRangeSpaceMousedown = function (e) {
                    var pt = e instanceof MouseEvent ?
                        new wijmo.Point(e.pageX, e.pageY) :
                        new wijmo.Point(e.changedTouches[0].pageX, e.changedTouches[0].pageY), sOffset = wijmo.getElementRect(this._rsContent), rOffset = wijmo.getElementRect(this._rangeHandler), clickEle = e.srcElement || e.target, offset = 0;
                    e.stopPropagation();
                    e.preventDefault();
                    if (clickEle !== this._rsContent && clickEle !== this._rsEle) {
                        return;
                    }
                    if (this._isHorizontal) {
                        offset = rOffset.width / sOffset.width;
                        if (pt.x < rOffset.left) {
                            offset = -1 * offset;
                        }
                        else if (pt.x > rOffset.left + rOffset.width) {
                            offset = 1 * offset;
                        }
                    }
                    else {
                        offset = rOffset.height / sOffset.height;
                        if (pt.y < rOffset.top) {
                            offset = 1 * offset;
                        }
                        else if (pt.y > rOffset.top + rOffset.height) {
                            offset = -1 * offset;
                        }
                    }
                    if (offset !== 0) {
                        this._doSliding(offset, pt);
                    }
                };
                _RangeSlider.prototype._onRangeMouseleave = function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    if (!this._isBtnMousedown) {
                        return;
                    }
                    //fire event
                    this._clearInterval();
                    this.onRangeChanged();
                };
                _RangeSlider.prototype._onBtnMousedown = function (e) {
                    var targetEle = e.srcElement || e.target, offset = 0;
                    e.stopPropagation();
                    e.preventDefault();
                    if (wijmo.hasClass(targetEle, _RangeSlider._RANGESLIDER_DECBTN)) {
                        if (this._minPos === 0) {
                            return;
                        }
                        offset = -0.05;
                    }
                    else if (wijmo.hasClass(targetEle, _RangeSlider._RANGESLIDER_INCBTN)) {
                        if (this._maxPos === 1) {
                            return;
                        }
                        offset = 0.05;
                    }
                    this._isBtnMousedown = true;
                    if (offset !== 0) {
                        this._doSliding(offset);
                    }
                };
                _RangeSlider.prototype._refresh = function (rsRect) {
                    var sliderOffset = 0, containerOffset = 0, slbarCss, rangeSliderEleCss, rOffset = wijmo.getElementRect(this._rsContainer);
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
                    }
                    else {
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
                    }
                    else {
                        //slbarCss.left -= this._minHandler.offsetWidth;
                        slbarCss.top -= this._minHandler.offsetHeight / 2;
                        slbarCss.height += this._minHandler.offsetHeight;
                        rangeSliderEleCss = { top: sliderOffset, height: slbarCss.height - sliderOffset * 2 };
                    }
                    wijmo.setCss(this._rsEle, slbarCss);
                    wijmo.setCss(this._rsContent, rangeSliderEleCss);
                    rOffset = wijmo.getElementRect(this._rsContent);
                    this._plotBox = { x: rOffset.left, y: rOffset.top, width: rOffset.width, height: rOffset.height };
                    this._updateElesPosition();
                };
                _RangeSlider.prototype._updateElesPosition = function () {
                    var minHandle = this._minHandler, rangeHandle = this._rangeHandler, maxHandle = this._maxHandler, box = this._plotBox, rangeCss, minCss, rangeCss, maxCss, isHorizontal = this._isHorizontal;
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
                };
                _RangeSlider.prototype._refreshSlider = function (minCss, rangeCss, maxCss) {
                    wijmo.setCss(this._minHandler, minCss);
                    wijmo.setCss(this._rangeHandler, rangeCss);
                    wijmo.setCss(this._maxHandler, maxCss);
                };
                _RangeSlider.prototype._invalidate = function () {
                    var addClass, rmvClass;
                    if (!this._rsContainer) {
                        return;
                    }
                    //get needed adding and removing class
                    addClass = this._isHorizontal ?
                        _RangeSlider._HRANGESLIDER : _RangeSlider._VRANGESLIDER;
                    rmvClass = this._isHorizontal ?
                        _RangeSlider._VRANGESLIDER : _RangeSlider._HRANGESLIDER;
                    wijmo.removeClass(this._rsEle, rmvClass);
                    wijmo.addClass(this._rsEle, addClass);
                    //clear inline style
                    [this._rsEle, this._rsContent, this._minHandler,
                        this._maxHandler, this._rangeHandler].forEach(function (ele) {
                        ele.removeAttribute("style");
                    });
                    this._refresh();
                };
                _RangeSlider.prototype._changeRange = function (offset) {
                    var range = this._maxPos - this._minPos;
                    if ((offset < 0 && this._minPos === 0) || ((offset > 0 && this._maxPos === 1))) {
                        return;
                    }
                    if (offset < 0) {
                        this._minPos += offset;
                        this._minPos = this._minPos < 0 ? 0 : this._minPos;
                        this._maxPos = this._minPos + range;
                    }
                    else {
                        this._maxPos += offset;
                        this._maxPos = this._maxPos > 1 ? 1 : this._maxPos;
                        this._minPos = this._maxPos - range;
                    }
                    this._updateElesPosition();
                };
                _RangeSlider.prototype._doSliding = function (offset, pt) {
                    var sOffset = wijmo.getElementRect(this._rsContent), rOffset = wijmo.getElementRect(this._rangeHandler);
                    this._clearInterval();
                    this._startPt = new wijmo.Point();
                    this._changeRange(offset);
                    this.onRangeChanged();
                    this._setSlidingInterval(offset, pt);
                };
                _RangeSlider.prototype._setSlidingInterval = function (offset, pt) {
                    var self = this, sOffset, rOffset;
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
                            }
                            else {
                                if (pt.y >= rOffset.top && pt.y <= rOffset.top + rOffset.height) {
                                    self._clearInterval();
                                    return;
                                }
                            }
                        }
                        self._changeRange(offset);
                        self.onRangeChanged();
                    }, 200);
                };
                _RangeSlider.prototype._clearInterval = function () {
                    if (this._slidingInterval) {
                        window.clearInterval(this._slidingInterval);
                    }
                };
                _RangeSlider.prototype._getRsRect = function () {
                    var rsRect = this._rangeSliderRect, rect = {};
                    if (!rsRect) {
                        return;
                    }
                    ['left', 'top', 'width', 'height'].forEach(function (key) {
                        if (rsRect[key]) {
                            rect[key] = rsRect[key];
                        }
                    });
                    return rect;
                };
                // Static class
                _RangeSlider._HRANGESLIDER = 'wj-chart-hrangeslider';
                _RangeSlider._VRANGESLIDER = 'wj-chart-vrangeslider';
                _RangeSlider._RANGESLIDER_DECBTN = 'wj-rangeslider-decbtn';
                _RangeSlider._RANGESLIDER_INCBTN = 'wj-rangeslider-incbtn';
                _RangeSlider._RANGESLIDER_RANGEHANDLE = 'wj-rangeslider-rangehandle';
                _RangeSlider._RANGESLIDER_MINHANDLE = 'wj-rangeslider-minhandle';
                _RangeSlider._RANGESLIDER_MAXHANDLE = 'wj-rangeslider-maxhandle';
                _RangeSlider._RANGESLIDER_HANDLE_ACTIVE = 'wj-rangeslider-handle-active';
                return _RangeSlider;
            }());
            interaction._RangeSlider = _RangeSlider;
        })(interaction = chart_1.interaction || (chart_1.interaction = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_RangeSlider.js.map