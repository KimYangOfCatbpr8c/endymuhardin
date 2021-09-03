module wijmo.gauge {
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
    export class Range {
        static _ctr = 0;
        private _min = 0;
        private _max = 100;
        private _thickness = 1;
        private _color: string;
        private _name: string;

        /**
         * Initializes a new instance of the @see:Range class.
         *
         * @param name The name of the range.
         */
        constructor(name?: string) {
            this._name = name;
        }

        /**
         * Gets or sets the minimum value for this range.
         */
        get min(): number {
            return this._min;
        }
        set min(value: number) {
            this._setProp('_min', asNumber(value, true));
        }
        /**
         * Gets or sets the maximum value for this range.
         */
        get max(): number {
            return this._max;
        }
        set max(value: number) {
            this._setProp('_max', asNumber(value, true));
        }
        /**
         * Gets or sets the color used to display this range.
         */
        get color(): string {
            return this._color;
        }
        set color(value: string) {
            this._setProp('_color', asString(value));
        }
        /**
         * Gets or sets the thickness of this range as a percentage of 
         * the parent gauge's thickness.
         */
        get thickness(): number {
            return this._thickness;
        }
        set thickness(value: number) {
            this._setProp('_thickness', clamp(asNumber(value), 0, 1));
        }
        /**
         * Gets or sets the name of this @see:Range.
         */
        get name(): string {
            return this._name;
        }
        set name(value: string) {
            this._setProp('_name', asString(value));
        }

        /**
         * Occurs when the value of a property in this @see:Range changes.
         */
        propertyChanged = new Event();
        /**
         * Raises the @see:propertyChanged event.
         *
         * @param e @see:PropertyChangedEventArgs that contains the property
         * name, old, and new values.
         */
        onPropertyChanged(e: PropertyChangedEventArgs) {
            this.propertyChanged.raise(this, e);
        }

        // ** implementation

        // sets property value and notifies about the change
        _setProp(name: string, value: any) {
            var oldValue = this[name];
            if (value != oldValue) {
                this[name] = value;
                var e = new PropertyChangedEventArgs(name.substr(1), oldValue, value);
                this.onPropertyChanged(e);
            }
        }
    }
}

