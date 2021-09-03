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
module wijmo.gauge {
    'use strict';

    /**
     * Specifies which values to display as text.
     */
    export enum ShowText {
        /** Do not show any text in the gauge. */
        None = 0,
        /** Show the gauge's @see:Gauge.value as text. */
        Value = 1,
        /** Show the gauge's @see:Gauge.min and @see:Gauge.max values as text. */
        MinMax = 2,
        /** Show the gauge's @see:Gauge.value, @see:Gauge.min, and @see:Gauge.max as text. */
        All = 3
    }

    /**
     * Base class for the Wijmo Gauge controls (abstract).
     */
    export class Gauge extends Control {
        static _SVGNS = 'http://www.w3.org/2000/svg';
        static _ctr = 0;

        // property storage
        private _ranges = new collections.ObservableArray();
        private _rngElements = [];
        private _format = 'n0';
        private _getText: Function;
        private _showRanges = true;
        private _shadow = true;
        private _animated = true;
        private _animInterval: number;
        private _readOnly = true;
        private _step = 1;
        private _showText = ShowText.None;
        private _showTicks = false;
        private _thumbSize: number;
        private _filterID: string;
        private _rangesDirty: boolean;
        private _origin: number;

        // protected
        protected _thickness = 0.8;
        protected _initialized = false;
        protected _animColor: string;

        // main ranges:
        // face is the background and defines the Gauge's range (min/max);
        // pointer is the indicator and defines the Gauge's current value.
        protected _face: Range;
        protected _pointer: Range;

        // template parts
        protected _dSvg: HTMLDivElement;
        protected _svg: SVGSVGElement;
        protected _gFace: SVGGElement;
        protected _gRanges: SVGGElement;
        protected _gPointer: SVGGElement;
        protected _gCover: SVGGElement;
        protected _pFace: SVGPathElement;
        protected _pPointer: SVGPathElement;
        protected _pTicks: SVGPathElement;
        protected _filter: SVGFilterElement;
        protected _cValue: SVGCircleElement;
        protected _tValue: SVGTextElement;
        protected _tMin: SVGTextElement;
        protected _tMax: SVGTextElement;

        /**
         * Gets or sets the template used to instantiate @see:Gauge controls.
         */
        static controlTemplate = '<div wj-part="dsvg" style="width:100%;height:100%">' +
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

        /**
         * Initializes a new instance of the @see:Gauge class.
         *
         * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
         * @param options The JavaScript object containing initialization data for the control.
         */
        constructor(element: any, options?) {
            super(element, null, true);
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
            this.face = new Range();
            this.pointer = new Range();

            // invalidate control and re-create range elements when ranges change
            this._ranges.collectionChanged.addHandler(() => {

                // check types
                var arr = this._ranges;
                for (var i = 0; i < arr.length; i++) {
                    var rng = tryCast(arr[i], Range);
                    if (!rng) {
                        throw 'ranges array must contain Range objects.';
                    }
                }

                // remember ranges are dirty and invalidate
                this._rangesDirty = true;
                this.invalidate();
            });

            // keyboard handling
            this.addEventListener(this.hostElement, 'keydown', this._keydown.bind(this));

            // mouse handling
            this.addEventListener(this.hostElement, 'click', (e: MouseEvent) => {
                if (e.button == 0) { // left button only
                    this.focus();
                    this._applyMouseValue(e);
                }
            });
            this.addEventListener(this.hostElement, 'mousedown', (e: MouseEvent) => {
                if (e.button == 0) { // left button only
                    this.focus();
                    this._applyMouseValue(e);
                }
            });
            this.addEventListener(this.hostElement, 'mousemove', (e: MouseEvent) => {
                if (e.buttons == 1) { // left button only
                    this._applyMouseValue(e, true);
                }
            });

            // touch handling
            if ('ontouchstart' in window) {
                this.addEventListener(this.hostElement, 'touchstart', (e: PointerEvent) => {
                    this.focus();
                    if (!e.defaultPrevented && !this.isReadOnly && this._applyMouseValue(e, true)) {
                        e.preventDefault();
                    }
                });
                this.addEventListener(this.hostElement, 'touchmove', (e: PointerEvent) => {
                    if (!e.defaultPrevented && !this.isReadOnly && this._applyMouseValue(e, true)) {
                        e.preventDefault();
                    }
                });
            }

            // use wheel to increase/decrease the value
            this.addEventListener(this.hostElement, 'wheel', (e: WheelEvent) => {
                if (!e.defaultPrevented && !this.isReadOnly && this.containsFocus() && this.value != null && this.hitTest(e)) {
                    var step = clamp(-e.deltaY, -1, +1);
                    this.value = clamp(this.value + (this.step || 1) * step, this.min, this.max);
                    e.preventDefault();
                }
            });

            // initialize control options
            this.initialize(options);

            // ensure face and text are updated
            this.invalidate();
        }

        /**
         * Gets or sets the value to display on the gauge.
         */
        get value(): number {
            return this._pointer.max;
        }
        set value(value: number) {
            if (value != this._pointer.max) {
                this._pointer.max = asNumber(value, true);
            }
        }
        /**
         * Gets or sets the minimum value that can be displayed on the gauge.
         * 
         * For details about using the @see:min and @see:max properties, please see the 
         * <a href="static/minMax.html">Using the min and max properties</a> topic.
         */
        get min(): number {
            return this._face.min;
        }
        set min(value: number) {
            this._face.min = asNumber(value);
        }
        /**
         * Gets or sets the maximum value that can be displayed on the gauge.
         * 
         * For details about using the @see:min and @see:max properties, please see the 
         * <a href="static/minMax.html">Using the min and max properties</a> topic.
         */
        get max(): number {
            return this._face.max;
        }
        set max(value: number) {
            this._face.max = asNumber(value);
        }
        /**
         * Gets or sets the starting point used for painting the range.
         *
         * By default, this property is set to null, which causes the value range
         * to start at the gauge's minimum value, or zero if the minimum is less
         * than zero.
         */
        get origin(): number {
            return this._origin;
        }
        set origin(value: number) {
            if (value != this._origin) {
                this._origin = asNumber(value, true);
                this.invalidate();
            }
        }
        /**
         * Gets or sets a value that indicates whether the user can edit the value 
         * using the mouse and keyboard.
         */
        get isReadOnly(): boolean {
            return this._readOnly;
        }
        set isReadOnly(value: boolean) {
            this._readOnly = asBoolean(value);
            this._setAttribute(this._svg, 'cursor', this._readOnly ? null : 'pointer');
            toggleClass(this.hostElement, 'wj-state-readonly', this.isReadOnly);
        }
        /**
         * Gets or sets the amount to add to or subtract from the @see:value property
         * when the user presses the arrow keys or moves the mouse wheel.
         */
        get step(): number {
            return this._step;
        }
        set step(value: number) {
            this._step = asNumber(value, true);
        }
        /**
         * Gets or sets the format string used to display gauge values as text.
         */
        get format(): string {
            return this._format;
        }
        set format(value: string) {
            if (value != this._format) {
                this._format = asString(value);
                this.invalidate();
            }
        }
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
        get getText(): Function {
            return this._getText;
        }
        set getText(value: Function) {
            if (value != this._getText) {
                this._getText = asFunction(value);
                this.invalidate();
            }
        }
        /**
         * Gets or sets the thickness of the gauge, on a scale between zero and one.
         *
         * Setting the thickness to one causes the gauge to fill as much of the
         * control area as possible. Smaller values create thinner gauges.
         */
        get thickness(): number {
            return this._thickness;
        }
        set thickness(value: number) {
            if (value != this._thickness) {
                this._thickness = clamp(asNumber(value, false), 0, 1);
                this.invalidate();
            }
        }
        /**
         * Gets or sets the @see:Range used to represent the gauge's overall geometry
         * and appearance.
         */
        get face(): Range {
            return this._face;
        }
        set face(value: Range) {
            if (value != this._face) {
                if (this._face) {
                    this._face.propertyChanged.removeHandler(this._rangeChanged);
                }
                this._face = asType(value, Range);
                if (this._face) {
                    this._face.propertyChanged.addHandler(this._rangeChanged, this);
                }
                this.invalidate();
            }
        }
        /**
         * Gets or sets the @see:Range used to represent the gauge's current value.
         */
        get pointer(): Range {
            return this._pointer;
        }
        set pointer(value: Range) {
            if (value != this._pointer) {
                var gaugeValue = null;
                if (this._pointer) {
                    gaugeValue = this.value;
                    this._pointer.propertyChanged.removeHandler(this._rangeChanged);
                }
                this._pointer = asType(value, Range);
                if (this._pointer) {
                    if (gaugeValue) {
                        this.value = gaugeValue;
                    }
                    this._pointer.propertyChanged.addHandler(this._rangeChanged, this);
                }
                this.invalidate();
            }
        }
        /**
         * Gets or sets the @see:ShowText values to display as text in the gauge.
         */
        get showText(): ShowText {
            return this._showText;
        }
        set showText(value: ShowText) {
            if (value != this._showText) {
                this._showText = asEnum(value, ShowText);
                this.invalidate();
            }
        }
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
        get showTicks(): boolean {
            return this._showTicks;
        }
        set showTicks(value: boolean) {
            if (value != this._showTicks) {
                this._showTicks = asBoolean(value);
                this.invalidate();
            }
        }
        /**
         * Gets or sets the size of the element that shows the gauge's current value, in pixels.
         */ 
        get thumbSize(): number {
            return this._thumbSize;
        }
        set thumbSize(value: number) {
            if (value != this._thumbSize) {
                this._thumbSize = asNumber(value, true, true);
                this.invalidate();
            }
        }
        /**
         * Gets or sets a value that indicates whether the gauge displays the ranges contained in 
         * the @see:ranges property.
         *
         * If this property is set to false, the ranges contained in the @see:ranges property are not
         * displayed in the gauge. Instead, they are used to interpolate the color of the @see:pointer
         * range while animating value changes.
         */
        get showRanges(): boolean {
            return this._showRanges;
        }
        set showRanges(value: boolean) {
            if (value != this._showRanges) {
                this._showRanges = asBoolean(value);
                this._animColor = null;
                this._rangesDirty = true;
                this.invalidate();
            }
        }
        /**
         * Gets or sets a value that indicates whether the gauge displays a shadow effect.
         */
        get hasShadow(): boolean {
            return this._shadow;
        }
        set hasShadow(value: boolean) {
            if (value != this._shadow) {
                this._shadow = asBoolean(value);
                this.invalidate();
            }
        }
        /**
         * Gets or sets a value that indicates whether the gauge animates value changes.
         */
        get isAnimated(): boolean {
            return this._animated;
        }
        set isAnimated(value: boolean) {
            if (value != this._animated) {
                this._animated = asBoolean(value);
            }
        }
        /**
         * Gets the collection of ranges in this gauge.
         */
        get ranges(): collections.ObservableArray {
            return this._ranges;
        }
        /**
         * Occurs when the value shown on the gauge changes.
         */
        valueChanged = new Event();
        /**
         * Raises the @see:valueChanged event.
         */
        onValueChanged(e?: EventArgs) {
            this.valueChanged.raise(this, e);
        }
        /**
         * Refreshes the control.
         *
         * @param fullUpdate Indicates whether to update the control layout as well as the content.
         */
        refresh(fullUpdate = true) {
            super.refresh(fullUpdate);

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
        }
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
        hitTest(pt: any, y?: number): number {

            // get point in page coordinates
            if (isNumber(pt) && isNumber(y)) { // accept hitTest(x, y)
                pt = new Point(pt, y);
            } else if (!(pt instanceof Point)) {
                pt = mouseToPage(pt);
            }
            pt = asType(pt, Point);

            // convert point to gauge client coordinates
            var rc = Rect.fromBoundingRect(this._dSvg.getBoundingClientRect());
            pt.x -= rc.left + pageXOffset;
            pt.y -= rc.top + pageYOffset;

            // get gauge value from point
            return this._getValueFromPoint(pt);
        }

        // ** implementation

        // safe version of getBBox (TFS 129851, 144174)
        // (workaround for FF bug, see https://bugzilla.mozilla.org/show_bug.cgi?id=612118)
        static _getBBox(e: SVGLocatable): SVGRect {
            try {
                return e.getBBox();
            } catch (x) {
                return { x: 0, y: 0, width: 0, height: 0 };
            }
        }

        // gets the unique filter ID used by this gauge
        _getFilterUrl() {
            return this.hasShadow ? 'url(#' + this._filterID + ')' : null;
        }

        // gets the path element that represents a Range
        _getRangeElement(rng: Range): SVGPathElement {
            if (rng == this._face) {
                return this._pFace;
            } else if (rng == this._pointer) {
                return this._pPointer;
            }
            for (var i = 0; i < this._rngElements.length; i++) {
                var rngEl = this._rngElements[i];
                if (rngEl.rng == rng) {
                    return rngEl.el;
                }
            }
            return null;
        }

        // handle changes to range objects
        _rangeChanged(rng: Range, e: PropertyChangedEventArgs) {

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
                    var s1 = this._getPointerColor(e.oldValue),
                        s2 = this._getPointerColor(e.newValue),
                        c1 = s1 ? new Color(s1) : null,
                        c2 = s2 ? new Color(s2) : null;
                    this._animInterval = animate((pct) => {
                        this._animColor = (c1 && c2)
                            ? Color.interpolate(c1, c2, pct).toString()
                            : null;
                        this._updateRange(rng, e.oldValue + pct * (e.newValue - e.oldValue));
                        if (pct >= 1) {
                            this._animColor = null;
                            this._animInterval = null;
                            this._updateRange(rng);
                            this._updateText();
                        }
                    });
                    return;
                }
            }

            // update range without animation
            this._updateRange(rng);
        }

        // creates an SVG element with the given tag and appends it to a given element
        _createElement(tag: string, parent: SVGElement, cls?: string) {
            var e = document.createElementNS(Gauge._SVGNS, tag);
            if (cls) {
                e.setAttribute('class', cls);
            }
            parent.appendChild(e);
            return e;
        }

        // centers an SVG text element at a given point
        _centerText(e: SVGTextElement, value: number, center: Point) {
            if (e.getAttribute('display') != 'none') {

                // get the text for the element
                var text = Globalize.format(value, this.format);
                if (isFunction(this.getText)) {
                    var part =
                        e == this._tValue ? 'value' :
                        e == this._tMin ? 'min' :
                        e == this._tMax ? 'max' :
                        null;
                    assert(part != null, 'unknown element');
                    text = this.getText(this, part, value, text);
                }

                // set the text and center the element
                e.textContent = text; 
                var box = Rect.fromBoundingRect(Gauge._getBBox(e)),
                    x = (center.x - box.width / 2),
                    y = (center.y + box.height / 4);
                e.setAttribute('x', this._fix(x));
                e.setAttribute('y', this._fix(y));
            }
        }

        // method used in JSON-style initialization
        _copy(key: string, value: any): boolean {
            if (key == 'ranges') {
                var arr = asArray(value);
                for (var i = 0; i < arr.length; i++) {
                    var r = new Range();
                    copy(r, arr[i]);
                    this.ranges.push(r);
                }
                return true;
            } else if (key == 'pointer') {
                copy(this.pointer, value);
                return true;
            }
            return false;
        }

        // scales a value to a percentage based on the gauge's min and max properties
        _getPercent = function (value) {
            var pct = (this.max > this.min) ? (value - this.min) / (this.max - this.min) : 0;
            return Math.max(0, Math.min(1, pct));
        };

        // shows or hides an element
        _showElement(e: SVGElement, show: boolean) {
            this._setAttribute(e, 'display', show ? '' : 'none');
        }

        // sets or clears an attribute
        _setAttribute(e: SVGElement, att: string, value: string) {
            if (value) {
                e.setAttribute(att, value);
            } else {
                e.removeAttribute(att);
            }
        }

        // updates the element for a given range
        _updateRange(rng: Range, value = rng.max) {

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
        }

        // gets the color for the pointer range based on the gauge ranges
        _getPointerColor(value: number): string {
            var rng: Range;
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
        }

        // keyboard handling
        _keydown(e: KeyboardEvent) {
            if (!this._readOnly && this._step) {
                var handled = true;
                switch (e.keyCode) {
                    case Key.Left:
                    case Key.Down:
                        this.value = clamp(this.value - this.step, this.min, this.max);
                        break;
                    case Key.Right:
                    case Key.Up:
                        this.value = clamp(this.value + this.step, this.min, this.max);
                        break;
                    case Key.Home:
                        this.value = this.min;
                        break;
                    case Key.End:
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
        }

        // apply value based on mouse/pointer position
        _applyMouseValue(e: any, instant?: boolean): boolean {
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
                    this.value = clamp(value, this.min, this.max);

                    // restore animation and return true
                    this._animated = a;
                    return true;
                }
            }

            // not editable or hit-test off the gauge? return false
            return false;
        }

        // ** virtual methods (must be overridden in derived classes)

        // updates the range element
        _updateRangeElement(e: SVGPathElement, rng: Range, value: number) {
            assert(false, 'Gauge is an abstract class.');
        }

        // updates the text elements
        _updateText() {
            assert(false, 'Gauge is an abstract class.');
        }

        // updates the tickmarks
        _updateTicks() {
            assert(false, 'Gauge is an abstract class.');
        }

        // gets the value at a given point (in gauge client coordinates)
        _getValueFromPoint(pt: Point) {
            return null;
        }

        // formats numbers or points with up to 4 decimals
        _fix(n: any): string {
            return isNumber(n)
                ? parseFloat(n.toFixed(4)).toString()
                : this._fix(n.x) + ' ' + this._fix(n.y);
        }
    }
}

