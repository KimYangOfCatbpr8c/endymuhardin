var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Defines the @see:RadialGauge, @see:LinearGauge, and @see:BulletGraph
 * controls.
 *
 * Unlike many gauge controls, Wijmo gauges concentrate on the data being
 * displayed, with little extraneous color and markup elements. They were
 * designed to be easy to use and to read, especially on small-screen devices.
 *
 * Wijmo gauges are composed of @see:Range objects. Every Wijmo gauge has
 * at least two ranges: the "face" and the "pointer".
 *
 * <ul><li>
 * The "face" represents the gauge background. The "min" and "max"
 * properties of the face range correspond to the "min" and "max" properties
 * of the gauge control, and limit the values that the gauge can display.
 * </li><li>
 * The "pointer" is the range that indicates the gauge's current value. The
 * "max" property of the pointer range corresponds to the "value" property
 * of the gauge.
 * </li></ul>
 *
 * In addition to these two special ranges, gauges may have any number of
 * additional ranges added to their "ranges" collection. These additional
 * ranges can be used for two things:
 *
 * <ul><li>
 * By default, the extra ranges appear as part of the gauge background.
 * This way you can show 'zones' within the gauge, like 'good,' 'average,'
 * and 'bad' for example.
 * </li><li>
 * If you set the gauge's "showRanges" property to false, the additional
 * ranges are not shown. Instead, they are used to automatically set the
 * color of the "pointer" based on the current value.
 * </li></ul>
 */
var wijmo;
(function (wijmo) {
    var gauge;
    (function (gauge) {
        'use strict';
        /**
         * Specifies which values to display as text.
         */
        (function (ShowText) {
            /** Do not show any text in the gauge. */
            ShowText[ShowText["None"] = 0] = "None";
            /** Show the gauge's @see:Gauge.value as text. */
            ShowText[ShowText["Value"] = 1] = "Value";
            /** Show the gauge's @see:Gauge.min and @see:Gauge.max values as text. */
            ShowText[ShowText["MinMax"] = 2] = "MinMax";
            /** Show the gauge's @see:Gauge.value, @see:Gauge.min, and @see:Gauge.max as text. */
            ShowText[ShowText["All"] = 3] = "All";
        })(gauge.ShowText || (gauge.ShowText = {}));
        var ShowText = gauge.ShowText;
        /**
         * Base class for the Wijmo Gauge controls (abstract).
         */
        var Gauge = (function (_super) {
            __extends(Gauge, _super);
            /**
             * Initializes a new instance of the @see:Gauge class.
             *
             * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function Gauge(element, options) {
                var _this = this;
                _super.call(this, element, null, true);
                // property storage
                this._ranges = new wijmo.collections.ObservableArray();
                this._rngElements = [];
                this._format = 'n0';
                this._showRanges = true;
                this._shadow = true;
                this._animated = true;
                this._readOnly = true;
                this._step = 1;
                this._showText = ShowText.None;
                this._showTicks = false;
                // protected
                this._thickness = 0.8;
                this._initialized = false;
                /**
                 * Occurs when the value shown on the gauge changes.
                 */
                this.valueChanged = new wijmo.Event();
                // scales a value to a percentage based on the gauge's min and max properties
                this._getPercent = function (value) {
                    var pct = (this.max > this.min) ? (value - this.min) / (this.max - this.min) : 0;
                    return Math.max(0, Math.min(1, pct));
                };
                Gauge._ctr++;
                // instantiate and apply template
                var tpl = this.getTemplate();
                this.applyTemplate('wj-control wj-gauge', tpl, {
                    _dSvg: 'dsvg',
                    _svg: 'svg',
                    _filter: 'filter',
                    _gFace: 'gface',
                    _gRanges: 'granges',
                    _gPointer: 'gpointer',
                    _gCover: 'gcover',
                    _pFace: 'pface',
                    _pPointer: 'ppointer',
                    _cValue: 'cvalue',
                    _tValue: 'value',
                    _tMin: 'min',
                    _tMax: 'max',
                    _pTicks: 'pticks'
                });
                // apply filter id to template
                this._filterID = 'wj-gauge-filter-' + Gauge._ctr.toString(36);
                this._filter.setAttribute('id', this._filterID);
                // initialize main ranges
                this.face = new gauge.Range();
                this.pointer = new gauge.Range();
                // invalidate control and re-create range elements when ranges change
                this._ranges.collectionChanged.addHandler(function () {
                    // check types
                    var arr = _this._ranges;
                    for (var i = 0; i < arr.length; i++) {
                        var rng = wijmo.tryCast(arr[i], gauge.Range);
                        if (!rng) {
                            throw 'ranges array must contain Range objects.';
                        }
                    }
                    // remember ranges are dirty and invalidate
                    _this._rangesDirty = true;
                    _this.invalidate();
                });
                // keyboard handling
                this.addEventListener(this.hostElement, 'keydown', this._keydown.bind(this));
                // mouse handling
                this.addEventListener(this.hostElement, 'click', function (e) {
                    if (e.button == 0) {
                        _this.focus();
                        _this._applyMouseValue(e);
                    }
                });
                this.addEventListener(this.hostElement, 'mousedown', function (e) {
                    if (e.button == 0) {
                        _this.focus();
                        _this._applyMouseValue(e);
                    }
                });
                this.addEventListener(this.hostElement, 'mousemove', function (e) {
                    if (e.buttons == 1) {
                        _this._applyMouseValue(e, true);
                    }
                });
                // touch handling
                if ('ontouchstart' in window) {
                    this.addEventListener(this.hostElement, 'touchstart', function (e) {
                        _this.focus();
                        if (!e.defaultPrevented && !_this.isReadOnly && _this._applyMouseValue(e, true)) {
                            e.preventDefault();
                        }
                    });
                    this.addEventListener(this.hostElement, 'touchmove', function (e) {
                        if (!e.defaultPrevented && !_this.isReadOnly && _this._applyMouseValue(e, true)) {
                            e.preventDefault();
                        }
                    });
                }
                // use wheel to increase/decrease the value
                this.addEventListener(this.hostElement, 'wheel', function (e) {
                    if (!e.defaultPrevented && !_this.isReadOnly && _this.containsFocus() && _this.value != null && _this.hitTest(e)) {
                        var step = wijmo.clamp(-e.deltaY, -1, +1);
                        _this.value = wijmo.clamp(_this.value + (_this.step || 1) * step, _this.min, _this.max);
                        e.preventDefault();
                    }
                });
                // initialize control options
                this.initialize(options);
                // ensure face and text are updated
                this.invalidate();
            }
            Object.defineProperty(Gauge.prototype, "value", {
                /**
                 * Gets or sets the value to display on the gauge.
                 */
                get: function () {
                    return this._pointer.max;
                },
                set: function (value) {
                    if (value != this._pointer.max) {
                        this._pointer.max = wijmo.asNumber(value, true);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "min", {
                /**
                 * Gets or sets the minimum value that can be displayed on the gauge.
                 *
                 * For details about using the @see:min and @see:max properties, please see the
                 * <a href="static/minMax.html">Using the min and max properties</a> topic.
                 */
                get: function () {
                    return this._face.min;
                },
                set: function (value) {
                    this._face.min = wijmo.asNumber(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "max", {
                /**
                 * Gets or sets the maximum value that can be displayed on the gauge.
                 *
                 * For details about using the @see:min and @see:max properties, please see the
                 * <a href="static/minMax.html">Using the min and max properties</a> topic.
                 */
                get: function () {
                    return this._face.max;
                },
                set: function (value) {
                    this._face.max = wijmo.asNumber(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "origin", {
                /**
                 * Gets or sets the starting point used for painting the range.
                 *
                 * By default, this property is set to null, which causes the value range
                 * to start at the gauge's minimum value, or zero if the minimum is less
                 * than zero.
                 */
                get: function () {
                    return this._origin;
                },
                set: function (value) {
                    if (value != this._origin) {
                        this._origin = wijmo.asNumber(value, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "isReadOnly", {
                /**
                 * Gets or sets a value that indicates whether the user can edit the value
                 * using the mouse and keyboard.
                 */
                get: function () {
                    return this._readOnly;
                },
                set: function (value) {
                    this._readOnly = wijmo.asBoolean(value);
                    this._setAttribute(this._svg, 'cursor', this._readOnly ? null : 'pointer');
                    wijmo.toggleClass(this.hostElement, 'wj-state-readonly', this.isReadOnly);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "step", {
                /**
                 * Gets or sets the amount to add to or subtract from the @see:value property
                 * when the user presses the arrow keys or moves the mouse wheel.
                 */
                get: function () {
                    return this._step;
                },
                set: function (value) {
                    this._step = wijmo.asNumber(value, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "format", {
                /**
                 * Gets or sets the format string used to display gauge values as text.
                 */
                get: function () {
                    return this._format;
                },
                set: function (value) {
                    if (value != this._format) {
                        this._format = wijmo.asString(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "getText", {
                /**
                 * Gets or sets a callback that returns customized strings used to
                 * display gauge values.
                 *
                 * Use this property if you want to customize the strings shown on
                 * the gauge in cases where the @see:format property is not enough.
                 *
                 * If provided, the callback should be a function as that takes as
                 * parameters the gauge, the part name, the value, and the formatted
                 * value. The callback should return the string to be displayed on
                 * the gauge.
                 *
                 * For example:
                 *
                 * <pre>// callback to convert values into strings
                 * gauge.getText = function (gauge, part, value, text) {
                 *   switch (part) {
                 *     case 'value':
                 *       if (value &lt;= 10) return 'Empty!';
                 *       if (value &lt;= 25) return 'Low...';
                 *       if (value &lt;= 95) return 'Good';
                 *       return 'Full';
                 *     case 'min':
                 *       return 'EMPTY';
                 *     case 'max':
                 *       return 'FULL';
                 *   }
                 *   return text;
                 * }</pre>
                 */
                get: function () {
                    return this._getText;
                },
                set: function (value) {
                    if (value != this._getText) {
                        this._getText = wijmo.asFunction(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "thickness", {
                /**
                 * Gets or sets the thickness of the gauge, on a scale between zero and one.
                 *
                 * Setting the thickness to one causes the gauge to fill as much of the
                 * control area as possible. Smaller values create thinner gauges.
                 */
                get: function () {
                    return this._thickness;
                },
                set: function (value) {
                    if (value != this._thickness) {
                        this._thickness = wijmo.clamp(wijmo.asNumber(value, false), 0, 1);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "face", {
                /**
                 * Gets or sets the @see:Range used to represent the gauge's overall geometry
                 * and appearance.
                 */
                get: function () {
                    return this._face;
                },
                set: function (value) {
                    if (value != this._face) {
                        if (this._face) {
                            this._face.propertyChanged.removeHandler(this._rangeChanged);
                        }
                        this._face = wijmo.asType(value, gauge.Range);
                        if (this._face) {
                            this._face.propertyChanged.addHandler(this._rangeChanged, this);
                        }
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "pointer", {
                /**
                 * Gets or sets the @see:Range used to represent the gauge's current value.
                 */
                get: function () {
                    return this._pointer;
                },
                set: function (value) {
                    if (value != this._pointer) {
                        var gaugeValue = null;
                        if (this._pointer) {
                            gaugeValue = this.value;
                            this._pointer.propertyChanged.removeHandler(this._rangeChanged);
                        }
                        this._pointer = wijmo.asType(value, gauge.Range);
                        if (this._pointer) {
                            if (gaugeValue) {
                                this.value = gaugeValue;
                            }
                            this._pointer.propertyChanged.addHandler(this._rangeChanged, this);
                        }
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "showText", {
                /**
                 * Gets or sets the @see:ShowText values to display as text in the gauge.
                 */
                get: function () {
                    return this._showText;
                },
                set: function (value) {
                    if (value != this._showText) {
                        this._showText = wijmo.asEnum(value, ShowText);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "showTicks", {
                /**
                 * Gets or sets a property that determines whether the gauge should display
                 * tickmarks at each @see:step value.
                 *
                 * The tickmarks can be formatted in CSS using the <b>wj-gauge</b> and
                 * <b>wj-ticks</b> class names. For example:
                 *
                 * <pre>.wj-gauge .wj-ticks {
                 *     stroke-width: 2px;
                 *     stroke: white;
                 * }</pre>
                 */
                get: function () {
                    return this._showTicks;
                },
                set: function (value) {
                    if (value != this._showTicks) {
                        this._showTicks = wijmo.asBoolean(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "thumbSize", {
                /**
                 * Gets or sets the size of the element that shows the gauge's current value, in pixels.
                 */
                get: function () {
                    return this._thumbSize;
                },
                set: function (value) {
                    if (value != this._thumbSize) {
                        this._thumbSize = wijmo.asNumber(value, true, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "showRanges", {
                /**
                 * Gets or sets a value that indicates whether the gauge displays the ranges contained in
                 * the @see:ranges property.
                 *
                 * If this property is set to false, the ranges contained in the @see:ranges property are not
                 * displayed in the gauge. Instead, they are used to interpolate the color of the @see:pointer
                 * range while animating value changes.
                 */
                get: function () {
                    return this._showRanges;
                },
                set: function (value) {
                    if (value != this._showRanges) {
                        this._showRanges = wijmo.asBoolean(value);
                        this._animColor = null;
                        this._rangesDirty = true;
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "hasShadow", {
                /**
                 * Gets or sets a value that indicates whether the gauge displays a shadow effect.
                 */
                get: function () {
                    return this._shadow;
                },
                set: function (value) {
                    if (value != this._shadow) {
                        this._shadow = wijmo.asBoolean(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "isAnimated", {
                /**
                 * Gets or sets a value that indicates whether the gauge animates value changes.
                 */
                get: function () {
                    return this._animated;
                },
                set: function (value) {
                    if (value != this._animated) {
                        this._animated = wijmo.asBoolean(value);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Gauge.prototype, "ranges", {
                /**
                 * Gets the collection of ranges in this gauge.
                 */
                get: function () {
                    return this._ranges;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the @see:valueChanged event.
             */
            Gauge.prototype.onValueChanged = function (e) {
                this.valueChanged.raise(this, e);
            };
            /**
             * Refreshes the control.
             *
             * @param fullUpdate Indicates whether to update the control layout as well as the content.
             */
            Gauge.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                // update ranges if they are dirty
                if (this._rangesDirty) {
                    this._rangesDirty = false;
                    var gr = this._gRanges;
                    // remove old elements and disconnect event handlers
                    for (var i = 0; i < this._rngElements.length; i++) {
                        var e = this._rngElements[i];
                        e.rng.propertyChanged.removeHandler(this._rangeChanged);
                    }
                    while (gr.lastChild) {
                        gr.removeChild(gr.lastChild);
                    }
                    this._rngElements = [];
                    // add elements for each range and listen to changes
                    if (this._showRanges) {
                        for (var i = 0; i < this.ranges.length; i++) {
                            var rng = this.ranges[i];
                            rng.propertyChanged.addHandler(this._rangeChanged, this);
                            this._rngElements.push({
                                rng: rng,
                                el: this._createElement('path', gr)
                            });
                        }
                    }
                }
                // update text elements
                this._showElement(this._tValue, (this.showText & ShowText.Value) != 0);
                this._showElement(this._tMin, (this.showText & ShowText.MinMax) != 0);
                this._showElement(this._tMax, (this.showText & ShowText.MinMax) != 0);
                this._showElement(this._cValue, (this.showText & ShowText.Value) != 0 || this._thumbSize > 0);
                this._updateText();
                // update face and pointer
                var filterUrl = this._getFilterUrl();
                this._setAttribute(this._pFace, 'filter', filterUrl);
                this._setAttribute(this._pPointer, 'filter', filterUrl);
                this._updateRange(this._face);
                this._updateRange(this._pointer);
                this._updateTicks();
                // update ranges
                for (var i = 0; i < this.ranges.length; i++) {
                    this._updateRange(this.ranges[i]);
                }
                // ready
                this._initialized = true;
            };
            /**
             * Gets a number that corresponds to the value of the gauge at a given point.
             *
             * For example:
             *
             * <pre>
             * // hit test a point when the user clicks on the gauge
             * gauge.hostElement.addEventListener('click', function (e) {
             *   var ht = gauge.hitTest(e.pageX, e.pageY);
             *   if (ht != null) {
             *     console.log('you clicked the gauge at value ' + ht.toString());
             *   }
             * });
             * </pre>
             *
             * @param pt The point to investigate, in window coordinates, or a MouseEvent object,
             * or the x coordinate of the point.
             * @param y The Y coordinate of the point (if the first parameter is a number).
             * @return Value of the gauge at the point, or null if the point is not on the gauge's face.
             */
            Gauge.prototype.hitTest = function (pt, y) {
                // get point in page coordinates
                if (wijmo.isNumber(pt) && wijmo.isNumber(y)) {
                    pt = new wijmo.Point(pt, y);
                }
                else if (!(pt instanceof wijmo.Point)) {
                    pt = wijmo.mouseToPage(pt);
                }
                pt = wijmo.asType(pt, wijmo.Point);
                // convert point to gauge client coordinates
                var rc = wijmo.Rect.fromBoundingRect(this._dSvg.getBoundingClientRect());
                pt.x -= rc.left + pageXOffset;
                pt.y -= rc.top + pageYOffset;
                // get gauge value from point
                return this._getValueFromPoint(pt);
            };
            // ** implementation
            // safe version of getBBox (TFS 129851, 144174)
            // (workaround for FF bug, see https://bugzilla.mozilla.org/show_bug.cgi?id=612118)
            Gauge._getBBox = function (e) {
                try {
                    return e.getBBox();
                }
                catch (x) {
                    return { x: 0, y: 0, width: 0, height: 0 };
                }
            };
            // gets the unique filter ID used by this gauge
            Gauge.prototype._getFilterUrl = function () {
                return this.hasShadow ? 'url(#' + this._filterID + ')' : null;
            };
            // gets the path element that represents a Range
            Gauge.prototype._getRangeElement = function (rng) {
                if (rng == this._face) {
                    return this._pFace;
                }
                else if (rng == this._pointer) {
                    return this._pPointer;
                }
                for (var i = 0; i < this._rngElements.length; i++) {
                    var rngEl = this._rngElements[i];
                    if (rngEl.rng == rng) {
                        return rngEl.el;
                    }
                }
                return null;
            };
            // handle changes to range objects
            Gauge.prototype._rangeChanged = function (rng, e) {
                var _this = this;
                // when pointer.max changes, raise valueChanged
                if (rng == this._pointer && e.propertyName == 'max') {
                    this.onValueChanged();
                    this._updateText();
                }
                // when face changes, invalidate the whole gauge
                if (rng == this._face) {
                    this.invalidate();
                    return;
                }
                // update pointer with animation
                if (rng == this._pointer && e.propertyName == 'max') {
                    // clear pending animations if any
                    if (this._animInterval) {
                        clearInterval(this._animInterval);
                    }
                    // animate
                    if (this.isAnimated && !this.isUpdating && this._initialized) {
                        var s1 = this._getPointerColor(e.oldValue), s2 = this._getPointerColor(e.newValue), c1 = s1 ? new wijmo.Color(s1) : null, c2 = s2 ? new wijmo.Color(s2) : null;
                        this._animInterval = wijmo.animate(function (pct) {
                            _this._animColor = (c1 && c2)
                                ? wijmo.Color.interpolate(c1, c2, pct).toString()
                                : null;
                            _this._updateRange(rng, e.oldValue + pct * (e.newValue - e.oldValue));
                            if (pct >= 1) {
                                _this._animColor = null;
                                _this._animInterval = null;
                                _this._updateRange(rng);
                                _this._updateText();
                            }
                        });
                        return;
                    }
                }
                // update range without animation
                this._updateRange(rng);
            };
            // creates an SVG element with the given tag and appends it to a given element
            Gauge.prototype._createElement = function (tag, parent, cls) {
                var e = document.createElementNS(Gauge._SVGNS, tag);
                if (cls) {
                    e.setAttribute('class', cls);
                }
                parent.appendChild(e);
                return e;
            };
            // centers an SVG text element at a given point
            Gauge.prototype._centerText = function (e, value, center) {
                if (e.getAttribute('display') != 'none') {
                    // get the text for the element
                    var text = wijmo.Globalize.format(value, this.format);
                    if (wijmo.isFunction(this.getText)) {
                        var part = e == this._tValue ? 'value' :
                            e == this._tMin ? 'min' :
                                e == this._tMax ? 'max' :
                                    null;
                        wijmo.assert(part != null, 'unknown element');
                        text = this.getText(this, part, value, text);
                    }
                    // set the text and center the element
                    e.textContent = text;
                    var box = wijmo.Rect.fromBoundingRect(Gauge._getBBox(e)), x = (center.x - box.width / 2), y = (center.y + box.height / 4);
                    e.setAttribute('x', this._fix(x));
                    e.setAttribute('y', this._fix(y));
                }
            };
            // method used in JSON-style initialization
            Gauge.prototype._copy = function (key, value) {
                if (key == 'ranges') {
                    var arr = wijmo.asArray(value);
                    for (var i = 0; i < arr.length; i++) {
                        var r = new gauge.Range();
                        wijmo.copy(r, arr[i]);
                        this.ranges.push(r);
                    }
                    return true;
                }
                else if (key == 'pointer') {
                    wijmo.copy(this.pointer, value);
                    return true;
                }
                return false;
            };
            // shows or hides an element
            Gauge.prototype._showElement = function (e, show) {
                this._setAttribute(e, 'display', show ? '' : 'none');
            };
            // sets or clears an attribute
            Gauge.prototype._setAttribute = function (e, att, value) {
                if (value) {
                    e.setAttribute(att, value);
                }
                else {
                    e.removeAttribute(att);
                }
            };
            // updates the element for a given range
            Gauge.prototype._updateRange = function (rng, value) {
                if (value === void 0) { value = rng.max; }
                // update pointer's min value
                if (rng == this._pointer) {
                    rng.min = this.origin != null
                        ? this.origin
                        : (this.min < 0 && this.max > 0) ? 0 : this.min;
                }
                // update the range's element
                var e = this._getRangeElement(rng);
                if (e) {
                    this._updateRangeElement(e, rng, value);
                    var color = rng.color;
                    if (rng == this._pointer) {
                        color = this._animColor ? this._animColor : this._getPointerColor(rng.max);
                    }
                    this._setAttribute(e, 'style', color ? 'fill:' + color : null);
                }
            };
            // gets the color for the pointer range based on the gauge ranges
            Gauge.prototype._getPointerColor = function (value) {
                var rng;
                if (!this._showRanges) {
                    for (var i = 0; i < this._ranges.length; i++) {
                        var r = this._ranges[i];
                        if (value >= r.min && value <= r.max) {
                            if (rng == null || rng.max - rng.min > r.max - r.min) {
                                rng = r;
                            }
                        }
                    }
                    if (rng) {
                        return rng.color;
                    }
                }
                return this._pointer.color;
            };
            // keyboard handling
            Gauge.prototype._keydown = function (e) {
                if (!this._readOnly && this._step) {
                    var handled = true;
                    switch (e.keyCode) {
                        case wijmo.Key.Left:
                        case wijmo.Key.Down:
                            this.value = wijmo.clamp(this.value - this.step, this.min, this.max);
                            break;
                        case wijmo.Key.Right:
                        case wijmo.Key.Up:
                            this.value = wijmo.clamp(this.value + this.step, this.min, this.max);
                            break;
                        case wijmo.Key.Home:
                            this.value = this.min;
                            break;
                        case wijmo.Key.End:
                            this.value = this.max;
                            break;
                        default:
                            handled = false;
                            break;
                    }
                    if (handled) {
                        e.preventDefault();
                    }
                }
            };
            // apply value based on mouse/pointer position
            Gauge.prototype._applyMouseValue = function (e, instant) {
                if (!this.isReadOnly && this.containsFocus()) {
                    var value = this.hitTest(e);
                    if (value != null) {
                        // disable animation for instant changes
                        var a = this._animated;
                        if (instant) {
                            this._animated = false;
                        }
                        // make the change
                        if (this._step != null) {
                            value = Math.round(value / this._step) * this._step;
                        }
                        this.value = wijmo.clamp(value, this.min, this.max);
                        // restore animation and return true
                        this._animated = a;
                        return true;
                    }
                }
                // not editable or hit-test off the gauge? return false
                return false;
            };
            // ** virtual methods (must be overridden in derived classes)
            // updates the range element
            Gauge.prototype._updateRangeElement = function (e, rng, value) {
                wijmo.assert(false, 'Gauge is an abstract class.');
            };
            // updates the text elements
            Gauge.prototype._updateText = function () {
                wijmo.assert(false, 'Gauge is an abstract class.');
            };
            // updates the tickmarks
            Gauge.prototype._updateTicks = function () {
                wijmo.assert(false, 'Gauge is an abstract class.');
            };
            // gets the value at a given point (in gauge client coordinates)
            Gauge.prototype._getValueFromPoint = function (pt) {
                return null;
            };
            // formats numbers or points with up to 4 decimals
            Gauge.prototype._fix = function (n) {
                return wijmo.isNumber(n)
                    ? parseFloat(n.toFixed(4)).toString()
                    : this._fix(n.x) + ' ' + this._fix(n.y);
            };
            Gauge._SVGNS = 'http://www.w3.org/2000/svg';
            Gauge._ctr = 0;
            /**
             * Gets or sets the template used to instantiate @see:Gauge controls.
             */
            Gauge.controlTemplate = '<div wj-part="dsvg" style="width:100%;height:100%">' +
                '<svg wj-part="svg" width="100%" height="100%" style="overflow:visible">' +
                '<defs>' +
                '<filter wj-part="filter">' +
                '<feOffset dx="3" dy="3"></feOffset>' +
                '<feGaussianBlur result="offset-blur" stdDeviation="5"></feGaussianBlur>' +
                '<feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"></feComposite>' +
                '<feFlood flood-color="black" flood-opacity="0.2" result="color"></feFlood>' +
                '<feComposite operator="in" in="color" in2="inverse" result="shadow"></feComposite>' +
                '<feComposite operator="over" in="shadow" in2="SourceGraphic"></feComposite>' +
                '</filter>' +
                '</defs>' +
                '<g wj-part="gface" class="wj-face" style="cursor:inherit">' +
                '<path wj-part="pface"/>' +
                '</g>' +
                '<g wj-part="granges" style="cursor:inherit"/>' +
                '<g wj-part="gpointer" class="wj-pointer" style="cursor:inherit">' +
                '<path wj-part="ppointer"/>' +
                '</g>' +
                '<g wj-part="gcover" style="cursor:inherit">' +
                '<path wj-part="pticks" class="wj-ticks"/>' +
                '<circle wj-part="cvalue" class="wj-pointer wj-thumb"/>' +
                '<text wj-part="value" class="wj-value"/>' +
                '<text wj-part="min" class="wj-min"/>' +
                '<text wj-part="max" class="wj-max"/>' +
                '</g>' +
                '</svg>' +
                '</div>';
            return Gauge;
        }(wijmo.Control));
        gauge.Gauge = Gauge;
    })(gauge = wijmo.gauge || (wijmo.gauge = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Gauge.js.map