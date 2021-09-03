var wijmo;
(function (wijmo) {
    var chart;
    (function (chart_1) {
        'use strict';
        var LineMarkers = (function () {
            function LineMarkers() {
                this._moveMarker = function (e) {
                    var dom = e.currentTarget, markers = this._markers, markerIndex = dom.getAttribute('data-markerIndex'), arr;
                    if (markerIndex != null) {
                        arr = markers[markerIndex];
                        arr.forEach(function (marker) {
                            marker._moveMarker(e);
                        });
                    }
                };
                this._markers = [];
                this._bindMoveMarker = this._moveMarker.bind(this);
            }
            LineMarkers.prototype.attach = function (marker) {
                var hostEle = marker.chart.hostElement, markers = this._markers, markerIndex = hostEle.getAttribute('data-markerIndex'), len, arr;
                if (markerIndex != null) {
                    arr = markers[markerIndex];
                    if (arr && wijmo.isArray(arr)) {
                        arr.push(marker);
                    }
                    else {
                        markers[markerIndex] = [marker];
                        this._bindMoveEvent(hostEle);
                    }
                }
                else {
                    len = markers.length,
                        arr = [marker];
                    markers.push(arr);
                    hostEle.setAttribute('data-markerIndex', len);
                    this._bindMoveEvent(hostEle);
                }
            };
            LineMarkers.prototype.detach = function (marker) {
                var hostEle = marker.chart.hostElement, markers = this._markers, markerIndex = hostEle.getAttribute('data-markerIndex'), idx, arr;
                if (markerIndex != null) {
                    arr = markers[markerIndex];
                    idx = arr.indexOf(marker);
                    if (idx > -1) {
                        arr.splice(idx, 1);
                    }
                    if (arr.length === 0) {
                        idx = markers.indexOf(arr);
                        if (idx > -1) {
                            markers[idx] = undefined;
                        }
                        this._unbindMoveEvent(hostEle);
                    }
                }
            };
            LineMarkers.prototype._unbindMoveEvent = function (ele) {
                var _moveMarker = this._bindMoveMarker;
                ele.removeEventListener('mousemove', _moveMarker);
                if ('ontouchstart' in window) {
                    ele.removeEventListener('touchmove', _moveMarker);
                }
            };
            LineMarkers.prototype._bindMoveEvent = function (ele) {
                var _moveMarker = this._bindMoveMarker;
                ele.addEventListener('mousemove', _moveMarker);
                if ('ontouchstart' in window) {
                    ele.addEventListener('touchmove', _moveMarker);
                }
            };
            return LineMarkers;
        }());
        var lineMarkers = new LineMarkers();
        /**
         * Specifies the line type for the LineMarker.
         */
        (function (LineMarkerLines) {
            /** Show no lines. */
            LineMarkerLines[LineMarkerLines["None"] = 0] = "None";
            /** Show a vertical line. */
            LineMarkerLines[LineMarkerLines["Vertical"] = 1] = "Vertical";
            /** Show a horizontal line. */
            LineMarkerLines[LineMarkerLines["Horizontal"] = 2] = "Horizontal";
            /** Show both vertical and horizontal lines. */
            LineMarkerLines[LineMarkerLines["Both"] = 3] = "Both";
        })(chart_1.LineMarkerLines || (chart_1.LineMarkerLines = {}));
        var LineMarkerLines = chart_1.LineMarkerLines;
        // TODO: Implement drag interaction.
        // Drag 
        /**
         * Specifies how the LineMarker interacts with the user.
         */
        (function (LineMarkerInteraction) {
            /** No interaction, the user specifies the position by clicking. */
            LineMarkerInteraction[LineMarkerInteraction["None"] = 0] = "None";
            /** The LineMarker moves with the pointer. */
            LineMarkerInteraction[LineMarkerInteraction["Move"] = 1] = "Move";
            /** The LineMarker moves when the user drags the line. */
            LineMarkerInteraction[LineMarkerInteraction["Drag"] = 2] = "Drag";
        })(chart_1.LineMarkerInteraction || (chart_1.LineMarkerInteraction = {}));
        var LineMarkerInteraction = chart_1.LineMarkerInteraction;
        //Binary
        //Right 0 -> 0, Left 1 -> 1, Bottom 4 -> 100, Top 6 -> 110
        /**
         * Specifies the alignment of the LineMarker.
         */
        (function (LineMarkerAlignment) {
            /**
             * The LineMarker alignment adjusts automatically so that it stays inside the
             * boundaries of the plot area. */
            LineMarkerAlignment[LineMarkerAlignment["Auto"] = 2] = "Auto";
            /** The LineMarker aligns to the right of the pointer. */
            LineMarkerAlignment[LineMarkerAlignment["Right"] = 0] = "Right";
            /** The LineMarker aligns to the left of the pointer. */
            LineMarkerAlignment[LineMarkerAlignment["Left"] = 1] = "Left";
            /** The LineMarker aligns to the bottom of the pointer. */
            LineMarkerAlignment[LineMarkerAlignment["Bottom"] = 4] = "Bottom";
            /** The LineMarker aligns to the top of the pointer. */
            LineMarkerAlignment[LineMarkerAlignment["Top"] = 6] = "Top";
        })(chart_1.LineMarkerAlignment || (chart_1.LineMarkerAlignment = {}));
        var LineMarkerAlignment = chart_1.LineMarkerAlignment;
        /**
         * Represents an extension of the LineMarker for the FlexChart.
         *
         * The LineMarker consists of a text area with content reflecting data point
         * values, and an optional vertical or horizontal line (or both for a cross-hair
         * effect) positioned over the plot area. It can be static (interaction = None),
         * follow the mouse or touch position (interaction = Move), or move when the user
         * drags the line (interaction = Drag).
         * For example:
         * <pre>
         *   // create an interactive marker with a horizontal line and y-value
         *   var lm = new wijmo.chart.LineMarker($scope.ctx.chart, {
         *       lines: wijmo.chart.LineMarkerLines.Horizontal,
         *       interaction: wijmo.chart.LineMarkerInteraction.Move,
         *       alignment : wijmo.chart.LineMarkerAlignment.Top
         *   });
         *   lm.content = function (ht) {
         *       // show y-value
         *       return lm.y.toFixed(2);
         *   }
         * </pre>
         */
        var LineMarker = (function () {
            /**
             * Initializes a new instance of the @see:LineMarker class.
             *
             * @param chart The chart on which the LineMarker appears.
             * @param options A JavaScript object containing initialization data for the control.
             */
            function LineMarker(chart, options) {
                this._wrapperMousedown = null;
                this._wrapperMouseup = null;
                /**
                 * Occurs after the LineMarker's position changes.
                 */
                this.positionChanged = new wijmo.Event();
                var self = this;
                self._chart = chart;
                chart.rendered.addHandler(self._initialize, self);
                self._resetDefaultValue();
                wijmo.copy(this, options);
                self._initialize();
            }
            Object.defineProperty(LineMarker.prototype, "chart", {
                //--------------------------------------------------------------------------
                //** object model
                /**
                 * Gets the @see:FlexChart object that owns the LineMarker.
                 */
                get: function () {
                    return this._chart;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LineMarker.prototype, "isVisible", {
                /**
                 * Gets or sets the visibility of the LineMarker.
                 */
                get: function () {
                    return this._isVisible;
                },
                set: function (value) {
                    var self = this;
                    if (value === self._isVisible) {
                        return;
                    }
                    self._isVisible = wijmo.asBoolean(value);
                    if (!self._marker) {
                        return;
                    }
                    self._toggleVisibility();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LineMarker.prototype, "seriesIndex", {
                /**
                 * Gets or sets the index of the series in the chart in which the LineMarker appears.
                 * This takes effect when the @see:interaction property is set to
                 * wijmo.chart.LineMarkerInteraction.Move or wijmo.chart.LineMarkerInteraction.Drag.
                 */
                get: function () {
                    return this._seriesIndex;
                },
                set: function (value) {
                    var self = this;
                    if (value === self._seriesIndex) {
                        return;
                    }
                    self._seriesIndex = wijmo.asNumber(value, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LineMarker.prototype, "horizontalPosition", {
                /**
                 * Gets or sets the horizontal position of the LineMarker relative to the plot area.
                 *
                 * Its value range is (0, 1).
                 * If the value is null or undefined and @see:interaction is set to
                 * wijmo.chart.LineMarkerInteraction.Move or wijmo.chart.LineMarkerInteraction.Drag,
                 * the horizontal position of the marker is calculated automatically based on the
                 * pointer's position.
                 */
                get: function () {
                    return this._horizontalPosition;
                },
                set: function (value) {
                    var self = this;
                    if (value === self._horizontalPosition) {
                        return;
                    }
                    self._horizontalPosition = wijmo.asNumber(value, true);
                    if (self._horizontalPosition < 0 || self._horizontalPosition > 1) {
                        throw 'horizontalPosition\'s value should be in (0, 1).';
                    }
                    if (!self._marker) {
                        return;
                    }
                    self._updateMarkerPosition();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LineMarker.prototype, "x", {
                /**
                 * Gets the current x-value as chart data coordinates.
                 */
                get: function () {
                    var self = this, len = self._targetPoint.x - self._plotRect.left, axis = self._chart.axisX;
                    return axis.convertBack(len);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LineMarker.prototype, "y", {
                /**
                 * Gets the current y-value as chart data coordinates.
                 */
                get: function () {
                    var self = this, len = self._targetPoint.y - self._plotRect.top, axis = self._chart.axisY;
                    return axis.convertBack(len);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LineMarker.prototype, "content", {
                /**
                 * Gets or sets the content function that allows you to customize the text content of the LineMarker.
                 */
                get: function () {
                    return this._content;
                },
                set: function (value) {
                    if (value === this._content) {
                        return;
                    }
                    this._content = wijmo.asFunction(value);
                    this._updateMarkerPosition();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LineMarker.prototype, "verticalPosition", {
                /**
                 * Gets or sets the vertical position of the LineMarker relative to the plot area.
                 *
                 * Its value range is (0, 1).
                 * If the value is null or undefined and @see:interaction is set to wijmo.chart.LineMarkerInteraction.Move
                 * or wijmo.chart.LineMarkerInteraction.Drag, the vertical position of the LineMarker is calculated automatically based on the pointer's position.
                 */
                get: function () {
                    return this._verticalPosition;
                },
                set: function (value) {
                    var self = this;
                    if (value === self._verticalPosition) {
                        return;
                    }
                    self._verticalPosition = wijmo.asNumber(value, true);
                    if (self._verticalPosition < 0 || self._verticalPosition > 1) {
                        throw 'verticalPosition\'s value should be in (0, 1).';
                    }
                    if (!self._marker) {
                        return;
                    }
                    self._updateMarkerPosition();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LineMarker.prototype, "alignment", {
                /**
                 * Gets or sets the alignment of the LineMarker content.
                 *
                 * By default, the LineMarker shows to the right, at the bottom of the target point.
                 * Use '|' to combine alignment values.
                 *
                 * <pre>
                 * // set the alignment to the left.
                 * marker.alignment = wijmo.chart.LineMarkerAlignment.Left;
                 * // set the alignment to the left top.
                 * marker.alignment = wijmo.chart.LineMarkerAlignment.Left | wijmo.chart.LineMarkerAlignment.Top;
                 * </pre>
                 */
                get: function () {
                    return this._alignment;
                },
                set: function (value) {
                    var self = this;
                    if (value === self._alignment) {
                        return;
                    }
                    self._alignment = value;
                    if (!self._marker) {
                        return;
                    }
                    self._updatePositionByAlignment();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LineMarker.prototype, "lines", {
                /**
                 * Gets or sets the visibility of the LineMarker lines.
                 */
                get: function () {
                    return this._lines;
                },
                set: function (value) {
                    var self = this;
                    if (value === self._lines) {
                        return;
                    }
                    self._lines = wijmo.asEnum(value, LineMarkerLines);
                    if (!self._marker) {
                        return;
                    }
                    self._resetLinesVisibility();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LineMarker.prototype, "interaction", {
                /**
                 * Gets or sets the interaction mode of the LineMarker.
                 */
                get: function () {
                    return this._interaction;
                },
                set: function (value) {
                    var self = this;
                    if (value === self._interaction) {
                        return;
                    }
                    if (self._marker) {
                        self._detach();
                    }
                    self._interaction = wijmo.asEnum(value, LineMarkerInteraction);
                    if (self._marker) {
                        self._attach();
                    }
                    self._toggleElesDraggableClass(self._interaction === LineMarkerInteraction.Drag);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LineMarker.prototype, "dragThreshold", {
                /**
                    Gets or sets the maximum distance from the horizontal or vertical line that the marker can be dragged.
                */
                get: function () {
                    return this._dragThreshold;
                },
                set: function (value) {
                    if (value != this._dragThreshold) {
                        this._dragThreshold = wijmo.asNumber(value);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LineMarker.prototype, "dragContent", {
                /**
                    Gets or sets a value indicating whether the content of the marker is draggable when the interaction mode is "Drag."
                */
                get: function () {
                    return this._dragContent;
                },
                set: function (value) {
                    var self = this;
                    if (value !== self._dragContent) {
                        self._dragContent = wijmo.asBoolean(value);
                    }
                    wijmo.toggleClass(self._dragEle, LineMarker._CSS_LINE_DRAGGABLE, self._interaction === LineMarkerInteraction.Drag &&
                        self._dragContent &&
                        self._lines !== LineMarkerLines.None);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LineMarker.prototype, "dragLines", {
                /**
                    Gets or sets a value indicating whether the lines are linked when the horizontal or vertical line is dragged when the interaction mode is "Drag."
                */
                get: function () {
                    return this._dragLines;
                },
                set: function (value) {
                    if (value != this._dragLines) {
                        this._dragLines = wijmo.asBoolean(value);
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the @see:positionChanged event.
             *
             * @param point The target point at which to show the LineMarker.
             */
            LineMarker.prototype.onPositionChanged = function (point) {
                this.positionChanged.raise(this, point);
            };
            //--------------------------------------------------------------------------
            //** implementation
            /**
             * Removes the LineMarker from the chart.
             */
            LineMarker.prototype.remove = function () {
                var self = this, chart = self._chart;
                if (self._marker) {
                    chart.rendered.removeHandler(self._initialize, self);
                    self._detach();
                    self._removeMarker();
                    self._wrapperMoveMarker = null;
                    self._wrapperMousedown = null;
                    self._wrapperMouseup = null;
                }
            };
            LineMarker.prototype._attach = function () {
                var self = this, hostElement = self._chart.hostElement;
                if (this._interaction !== LineMarkerInteraction.None) {
                    wijmo.addClass(hostElement, LineMarker._CSS_TOUCH_DISABLED);
                }
                else {
                    wijmo.removeClass(hostElement, LineMarker._CSS_TOUCH_DISABLED);
                }
                lineMarkers.attach(self);
                self._attachDrag();
            };
            LineMarker.prototype._attachDrag = function () {
                var self = this;
                if (self._interaction !== LineMarkerInteraction.Drag) {
                    return;
                }
                if (!self._wrapperMousedown) {
                    self._wrapperMousedown = self._onMousedown.bind(self);
                }
                if (!self._wrapperMouseup) {
                    self._wrapperMouseup = self._onMouseup.bind(self);
                }
                // Drag mode
                self._toggleDragEventAttach(true);
            };
            LineMarker.prototype._detach = function () {
                var self = this;
                wijmo.removeClass(self._chart.hostElement, LineMarker._CSS_TOUCH_DISABLED);
                lineMarkers.detach(self);
                self._detachDrag();
            };
            LineMarker.prototype._detachDrag = function () {
                var self = this;
                if (self._interaction !== LineMarkerInteraction.Drag) {
                    return;
                }
                // Drag mode
                self._toggleDragEventAttach(false);
            };
            LineMarker.prototype._toggleDragEventAttach = function (isAttach) {
                var self = this, chartHostEle = self._chart.hostElement, eventListener = isAttach ? 'addEventListener' : 'removeEventListener';
                chartHostEle[eventListener]('mousedown', self._wrapperMousedown);
                document[eventListener]('mouseup', self._wrapperMouseup);
                if ('ontouchstart' in window) {
                    chartHostEle[eventListener]('touchstart', self._wrapperMousedown);
                }
                if ('ontouchend' in window) {
                    document[eventListener]('touchend', self._wrapperMouseup);
                }
            };
            LineMarker.prototype._onMousedown = function (e) {
                var self = this, pt = self._getEventPoint(e), hRect, vRect, contentRect;
                if (self._interaction !== LineMarkerInteraction.Drag) {
                    return;
                }
                hRect = wijmo.getElementRect(self._hLine);
                vRect = wijmo.getElementRect(self._vLine);
                contentRect = wijmo.getElementRect(self._markerContent);
                if (self._dragContent &&
                    self._pointInRect(pt, contentRect)) {
                    self._capturedEle = self._markerContent;
                    self._contentDragStartPoint = new wijmo.Point(pt.x, pt.y);
                    self._mouseDownCrossPoint = new wijmo.Point(self._targetPoint.x, self._targetPoint.y);
                }
                else if ((Math.abs(hRect.top - pt.y) <= self._dragThreshold) ||
                    (Math.abs(pt.y - hRect.top - hRect.height) <= self._dragThreshold) ||
                    (pt.y >= hRect.top && pt.y <= hRect.top + hRect.height)) {
                    self._capturedEle = self._hLine;
                    self._contentDragStartPoint = undefined;
                    wijmo.addClass(self._chart.hostElement, LineMarker._CSS_LINE_DRAGGABLE);
                }
                else if (Math.abs(vRect.left - pt.x) <= self._dragThreshold ||
                    (Math.abs(pt.x - vRect.left - vRect.width) <= self._dragThreshold) ||
                    (pt.x >= vRect.left && pt.x <= vRect.left + vRect.width)) {
                    self._capturedEle = self._vLine;
                    self._contentDragStartPoint = undefined;
                    wijmo.addClass(self._chart.hostElement, LineMarker._CSS_LINE_DRAGGABLE);
                }
                e.preventDefault();
            };
            LineMarker.prototype._onMouseup = function (e) {
                var self = this, needReAlignment = self._alignment === LineMarkerAlignment.Auto
                    && self._capturedEle === self._markerContent && self._lines !== LineMarkerLines.None;
                self._capturedEle = undefined;
                self._contentDragStartPoint = undefined;
                self._mouseDownCrossPoint = undefined;
                if (needReAlignment) {
                    // because the size of content has changed, so need to adjust the position twice.
                    self._updatePositionByAlignment();
                    self._updatePositionByAlignment();
                }
                wijmo.removeClass(self._chart.hostElement, LineMarker._CSS_LINE_DRAGGABLE);
            };
            LineMarker.prototype._moveMarker = function (e) {
                var self = this, chart = self._chart, point = self._getEventPoint(e), plotRect = self._plotRect, isDragAction = self._interaction === LineMarkerInteraction.Drag, hLineVisible = self._lines === LineMarkerLines.Horizontal, vLineVisible = self._lines === LineMarkerLines.Vertical, seriesIndex = self._seriesIndex, series, offset = wijmo.getElementRect(chart.hostElement), hitTest, xAxis, yAxis, x, y;
                if (!plotRect) {
                    return;
                }
                if (!self._isVisible || self._interaction === LineMarkerInteraction.None ||
                    (self._interaction === LineMarkerInteraction.Drag &&
                        (!self._capturedEle || self._lines === LineMarkerLines.None))) {
                    return;
                }
                if (isDragAction) {
                    if (self._contentDragStartPoint) {
                        point.x = hLineVisible ? self._targetPoint.x :
                            self._mouseDownCrossPoint.x + point.x - self._contentDragStartPoint.x;
                        point.y = vLineVisible ? self._targetPoint.y :
                            self._mouseDownCrossPoint.y + point.y - self._contentDragStartPoint.y;
                    }
                    else if (hLineVisible ||
                        (!self._dragLines && self._capturedEle === self._hLine)) {
                        // horizontal hine dragging
                        point.x = self._targetPoint.x;
                    }
                    else if (vLineVisible ||
                        (!self._dragLines && self._capturedEle === self._vLine)) {
                        // vertical hine dragging
                        point.y = self._targetPoint.y;
                    }
                }
                if ((isDragAction && self._lines === LineMarkerLines.Horizontal) ||
                    (!self._dragLines && self._capturedEle === self._hLine)) {
                    if (point.y <= plotRect.top || point.y >= plotRect.top + plotRect.height) {
                        return;
                    }
                }
                else if ((isDragAction && self._lines === LineMarkerLines.Vertical) ||
                    (!self._dragLines && self._capturedEle === self._vLine)) {
                    if (point.x <= plotRect.left || point.x >= plotRect.left + plotRect.width) {
                        return;
                    }
                }
                else {
                    if (point.x <= plotRect.left || point.y <= plotRect.top
                        || point.x >= plotRect.left + plotRect.width
                        || point.y >= plotRect.top + plotRect.height) {
                        return;
                    }
                }
                if (seriesIndex != null && seriesIndex >= 0 && seriesIndex < chart.series.length) {
                    series = chart.series[seriesIndex];
                    hitTest = series.hitTest(new wijmo.Point(point.x, NaN));
                    if (hitTest == null || hitTest.x == null || hitTest.y == null) {
                        return;
                    }
                    xAxis = series.axisX || chart.axisX;
                    yAxis = series._getAxisY();
                    x = wijmo.isDate(hitTest.x) ? chart_1.FlexChart._toOADate(hitTest.x) : hitTest.x;
                    y = wijmo.isDate(hitTest.y) ? chart_1.FlexChart._toOADate(hitTest.y) : hitTest.y;
                    point.x = xAxis.convert(x) + offset.left;
                    point.y = yAxis.convert(y) + offset.top;
                }
                self._updateMarkerPosition(point);
                e.preventDefault();
            };
            LineMarker.prototype._show = function (ele) {
                var e = ele ? ele : this._marker;
                e.style.display = 'block';
            };
            LineMarker.prototype._hide = function (ele) {
                var e = ele ? ele : this._marker;
                e.style.display = 'none';
            };
            LineMarker.prototype._toggleVisibility = function () {
                this._isVisible ? this._show() : this._hide();
            };
            LineMarker.prototype._resetDefaultValue = function () {
                var self = this;
                self._isVisible = true;
                self._alignment = LineMarkerAlignment.Auto;
                self._lines = LineMarkerLines.None;
                self._interaction = LineMarkerInteraction.None;
                self._horizontalPosition = null;
                self._verticalPosition = null;
                self._content = null;
                self._seriesIndex = null;
                self._dragThreshold = 15;
                self._dragContent = false;
                self._dragLines = false;
                self._targetPoint = new wijmo.Point();
            };
            LineMarker.prototype._initialize = function () {
                var self = this, plot = self._chart.hostElement.querySelector("." + chart_1.FlexChart._CSS_PLOT_AREA), box;
                self._plot = plot;
                if (!self._marker) {
                    self._createMarker();
                }
                if (plot) {
                    self._plotRect = wijmo.getElementRect(plot);
                    box = plot.getBBox();
                    self._plotRect.width = box.width;
                    self._plotRect.height = box.height;
                    self._updateMarkerSize();
                    self._updateLinesSize();
                }
                self._updateMarkerPosition();
                self._wrapperMoveMarker = self._moveMarker.bind(self);
                self._attach();
            };
            LineMarker.prototype._createMarker = function () {
                var self = this, marker, container;
                marker = document.createElement('div');
                wijmo.addClass(marker, LineMarker._CSS_MARKER);
                container = self._getContainer();
                container.appendChild(marker);
                self._markerContainer = container;
                self._marker = marker;
                self._createChildren();
            };
            LineMarker.prototype._removeMarker = function () {
                var self = this, mc = self._markerContainer;
                mc.removeChild(self._marker);
                self._content = null;
                self._hLine = null;
                self._vLine = null;
                if (!mc.hasChildNodes()) {
                    self._chart.hostElement.removeChild(self._markerContainer);
                    self._markerContainer = null;
                }
                self._marker = null;
            };
            LineMarker.prototype._getContainer = function () {
                var container = this._chart.hostElement.querySelector(LineMarker._CSS_MARKER_CONTAINER);
                if (!container) {
                    container = this._createContainer();
                }
                return container;
            };
            LineMarker.prototype._createContainer = function () {
                var markerContainer = document.createElement('div'), hostEle = this._chart.hostElement;
                wijmo.addClass(markerContainer, LineMarker._CSS_MARKER_CONTAINER);
                hostEle.insertBefore(markerContainer, hostEle.firstChild);
                return markerContainer;
            };
            LineMarker.prototype._createChildren = function () {
                var self = this, marker = self._marker, markerContent, hline, vline, dragEle;
                // work around for marker content touchmove: 
                // when the content is dynamic element, the touchmove fire only once.
                dragEle = document.createElement('div');
                dragEle.style.position = 'absolute';
                dragEle.style.height = '100%';
                dragEle.style.width = '100%';
                marker.appendChild(dragEle);
                self._dragEle = dragEle;
                //content
                markerContent = document.createElement('div');
                wijmo.addClass(markerContent, LineMarker._CSS_MARKER_CONTENT);
                marker.appendChild(markerContent);
                self._markerContent = markerContent;
                // lines
                hline = document.createElement('div');
                wijmo.addClass(hline, LineMarker._CSS_MARKER_HLINE);
                marker.appendChild(hline);
                self._hLine = hline;
                vline = document.createElement('div');
                wijmo.addClass(vline, LineMarker._CSS_MARKER_VLINE);
                marker.appendChild(vline);
                self._vLine = vline;
                self._toggleElesDraggableClass(self._interaction === LineMarkerInteraction.Drag);
                self._resetLinesVisibility();
            };
            LineMarker.prototype._toggleElesDraggableClass = function (draggable) {
                var self = this;
                wijmo.toggleClass(self._hLine, LineMarker._CSS_LINE_DRAGGABLE, draggable);
                wijmo.toggleClass(self._vLine, LineMarker._CSS_LINE_DRAGGABLE, draggable);
                wijmo.toggleClass(self._dragEle, LineMarker._CSS_LINE_DRAGGABLE, draggable &&
                    self._dragContent && self._lines !== LineMarkerLines.None);
            };
            LineMarker.prototype._updateMarkerSize = function () {
                var self = this, plotRect = self._plotRect, chartEle = self._chart.hostElement, computedStyle = window.getComputedStyle(chartEle, null), chartRect = wijmo.getElementRect(chartEle);
                if (!self._marker) {
                    return;
                }
                self._marker.style.marginTop = (plotRect.top - chartRect.top - (parseFloat(computedStyle.getPropertyValue('padding-top')) || 0)) + 'px';
                self._marker.style.marginLeft = (plotRect.left - chartRect.left - (parseFloat(computedStyle.getPropertyValue('padding-left')) || 0)) + 'px';
            };
            LineMarker.prototype._updateLinesSize = function () {
                var self = this, plotRect = self._plotRect;
                if (!self._hLine || !self._vLine) {
                    return;
                }
                self._hLine.style.width = plotRect.width + 'px';
                self._vLine.style.height = plotRect.height + 'px';
            };
            LineMarker.prototype._resetLinesVisibility = function () {
                var self = this;
                if (!self._hLine || !self._vLine) {
                    return;
                }
                self._hide(self._hLine);
                self._hide(self._vLine);
                if (self._lines === LineMarkerLines.Horizontal || self._lines === LineMarkerLines.Both) {
                    self._show(self._hLine);
                }
                if (self._lines === LineMarkerLines.Vertical || self._lines === LineMarkerLines.Both) {
                    self._show(self._vLine);
                }
            };
            LineMarker.prototype._updateMarkerPosition = function (point) {
                var self = this, plotRect = self._plotRect, targetPoint = self._targetPoint, x, y, raiseEvent = false, isDragAction = self._interaction === LineMarkerInteraction.Drag;
                if (!self._plot) {
                    return;
                }
                x = plotRect.left + plotRect.width * (self._horizontalPosition || 0);
                y = plotRect.top + plotRect.height * (self._verticalPosition || 0);
                if (self._horizontalPosition == null && point) {
                    x = point.x;
                }
                if (self._verticalPosition == null && point) {
                    y = point.y;
                }
                if (x !== targetPoint.x || y !== targetPoint.y) {
                    raiseEvent = true;
                }
                targetPoint.x = x;
                targetPoint.y = y;
                self._toggleVisibility();
                if (self._content) {
                    self._updateContent();
                }
                if (raiseEvent) {
                    self._raisePositionChanged(x, y);
                }
                // after the content changed(size changed), then update the marker's position
                self._updatePositionByAlignment(point ? true : false);
            };
            LineMarker.prototype._updateContent = function () {
                var self = this, chart = self._chart, point = self._targetPoint, hitTestInfo = chart.hitTest(point), text;
                text = self._content.call(null, hitTestInfo, point);
                self._markerContent.innerHTML = text || '';
            };
            LineMarker.prototype._raisePositionChanged = function (x, y) {
                var plotRect = this._plotRect;
                this.onPositionChanged(new wijmo.Point(x, y));
                //this.onPositionChanged(new Point(x - plotRect.left, y - plotRect.top));
            };
            LineMarker.prototype._updatePositionByAlignment = function (isMarkerMoved) {
                var self = this, align = self._alignment, tp = self._targetPoint, marker = self._marker, topBottom = 0, leftRight = 0, width = marker.clientWidth, height = marker.clientHeight, plotRect = self._plotRect, 
                //offset for right-bottom lnkemarker to avoid mouse overlapping.
                offset = 12;
                if (!self._plot) {
                    return;
                }
                if (!self._capturedEle || (self._capturedEle && self._capturedEle !== self._markerContent)) {
                    if (align === LineMarkerAlignment.Auto) {
                        if ((tp.x + width + offset > plotRect.left + plotRect.width) && (tp.x - width >= 0)) {
                            leftRight = width;
                        }
                        //set default auto to right top.
                        topBottom = height;
                        if (tp.y - height < plotRect.top) {
                            topBottom = 0;
                        }
                    }
                    else {
                        if ((1 & align) === 1) {
                            leftRight = width;
                        }
                        if ((2 & align) === 2) {
                            topBottom = height;
                        }
                    }
                    //only add offset when interaction is move and alignment is right bottom
                    if (self._interaction === LineMarkerInteraction.Move && topBottom === 0 && leftRight === 0) {
                        leftRight = -offset;
                    }
                }
                else {
                    //content dragging: when the content is on top position
                    if (parseInt(self._hLine.style.top) > 0) {
                        topBottom = height;
                    }
                    //content dragging: when the content is on left position
                    if (parseInt(self._vLine.style.left) > 0) {
                        leftRight = width;
                    }
                }
                marker.style.left = (tp.x - leftRight - plotRect.left) + 'px';
                marker.style.top = (tp.y - topBottom - plotRect.top) + 'px';
                self._hLine.style.top = topBottom + 'px';
                self._hLine.style.left = plotRect.left - tp.x + leftRight + 'px';
                self._vLine.style.top = plotRect.top - tp.y + topBottom + 'px';
                self._vLine.style.left = leftRight + 'px';
            };
            LineMarker.prototype._getEventPoint = function (e) {
                return e instanceof MouseEvent ?
                    new wijmo.Point(e.pageX, e.pageY) :
                    new wijmo.Point(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
            };
            LineMarker.prototype._pointInRect = function (pt, rect) {
                if (!pt || !rect) {
                    return false;
                }
                if (pt.x >= rect.left && pt.x <= rect.left + rect.width &&
                    pt.y >= rect.top && pt.y <= rect.top + rect.height) {
                    return true;
                }
                return false;
            };
            LineMarker._CSS_MARKER = 'wj-chart-linemarker';
            LineMarker._CSS_MARKER_HLINE = 'wj-chart-linemarker-hline';
            LineMarker._CSS_MARKER_VLINE = 'wj-chart-linemarker-vline';
            LineMarker._CSS_MARKER_CONTENT = 'wj-chart-linemarker-content';
            LineMarker._CSS_MARKER_CONTAINER = 'wj-chart-linemarker-container';
            LineMarker._CSS_LINE_DRAGGABLE = 'wj-chart-linemarker-draggable';
            LineMarker._CSS_TOUCH_DISABLED = 'wj-flexchart-touch-disabled';
            return LineMarker;
        }());
        chart_1.LineMarker = LineMarker;
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=LineMarker.js.map