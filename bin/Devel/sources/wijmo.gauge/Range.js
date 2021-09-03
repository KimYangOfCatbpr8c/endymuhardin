var wijmo;
(function (wijmo) {
    var gauge;
    (function (gauge) {
        'use strict';
        /**
         * Defines ranges to be used with @see:Gauge controls.
         *
         * @see:Range objects have @see:min and @see:max properties that
         * define the range's domain, as well as @see:color and @see:thickness
         * properties that define the range's appearance.
         *
         * Every @see:Gauge control has at least two ranges:
         * the 'face' defines the minimum and maximum values for the gauge, and
         * the 'pointer' displays the gauge's current value.
         *
         * In addition to the built-in ranges, gauges may have additional
         * ranges used to display regions of significance (for example,
         * low, medium, and high values).
         */
        var Range = (function () {
            /**
             * Initializes a new instance of the @see:Range class.
             *
             * @param name The name of the range.
             */
            function Range(name) {
                this._min = 0;
                this._max = 100;
                this._thickness = 1;
                /**
                 * Occurs when the value of a property in this @see:Range changes.
                 */
                this.propertyChanged = new wijmo.Event();
                this._name = name;
            }
            Object.defineProperty(Range.prototype, "min", {
                /**
                 * Gets or sets the minimum value for this range.
                 */
                get: function () {
                    return this._min;
                },
                set: function (value) {
                    this._setProp('_min', wijmo.asNumber(value, true));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Range.prototype, "max", {
                /**
                 * Gets or sets the maximum value for this range.
                 */
                get: function () {
                    return this._max;
                },
                set: function (value) {
                    this._setProp('_max', wijmo.asNumber(value, true));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Range.prototype, "color", {
                /**
                 * Gets or sets the color used to display this range.
                 */
                get: function () {
                    return this._color;
                },
                set: function (value) {
                    this._setProp('_color', wijmo.asString(value));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Range.prototype, "thickness", {
                /**
                 * Gets or sets the thickness of this range as a percentage of
                 * the parent gauge's thickness.
                 */
                get: function () {
                    return this._thickness;
                },
                set: function (value) {
                    this._setProp('_thickness', wijmo.clamp(wijmo.asNumber(value), 0, 1));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Range.prototype, "name", {
                /**
                 * Gets or sets the name of this @see:Range.
                 */
                get: function () {
                    return this._name;
                },
                set: function (value) {
                    this._setProp('_name', wijmo.asString(value));
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the @see:propertyChanged event.
             *
             * @param e @see:PropertyChangedEventArgs that contains the property
             * name, old, and new values.
             */
            Range.prototype.onPropertyChanged = function (e) {
                this.propertyChanged.raise(this, e);
            };
            // ** implementation
            // sets property value and notifies about the change
            Range.prototype._setProp = function (name, value) {
                var oldValue = this[name];
                if (value != oldValue) {
                    this[name] = value;
                    var e = new wijmo.PropertyChangedEventArgs(name.substr(1), oldValue, value);
                    this.onPropertyChanged(e);
                }
            };
            Range._ctr = 0;
            return Range;
        }());
        gauge.Range = Range;
    })(gauge = wijmo.gauge || (wijmo.gauge = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Range.js.map