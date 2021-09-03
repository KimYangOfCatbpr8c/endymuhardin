var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var input;
    (function (input) {
        'use strict';
        /**
         * The @see:InputTime control allows users to enter times using any format
         * supported by the @see:Globalize class, or to pick times from a drop-down
         * list.
         *
         * The @see:min, @see:max, and @see:step properties determine the values shown
         * in the list.
         *
         * For details about using the @see:min and @see:max properties, please see the
         * <a href="static/minMax.html">Using the min and max properties</a> topic.
         *
         * The @see:value property gets or sets a @see:Date object that represents the time
         * selected by the user.
         *
         * The example below shows a <b>Date</b> value (that includes date and time information)
         * using an @see:InputDate and an @see:InputTime control. Notice how both controls
         * are bound to the same controller variable, and each edits the appropriate information
         * (either date or time). The example also shows a @see:Calendar control that can be
         * used to select the date with a single click.
         *
         * @fiddle:vgc3Y
         */
        var InputTime = (function (_super) {
            __extends(InputTime, _super);
            // private stuff
            /**
             * Initializes a new instance of the @see:InputTime class.
             *
             * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function InputTime(element, options) {
                _super.call(this, element);
                this._format = 't';
                /**
                 * Occurs after a new time is selected.
                 */
                this.valueChanged = new wijmo.Event();
                wijmo.addClass(this.hostElement, 'wj-inputtime');
                // initialize value (current date)
                this._value = wijmo.DateTime.newDate();
                // initialize mask provider
                this._msk = new wijmo._MaskProvider(this._tbx);
                // default to numeric keyboard (like InputNumber), unless this is IE9...
                if (!wijmo.isIE9()) {
                    this._tbx.type = 'tel';
                }
                // initializing from <input> tag
                if (this._orgTag == 'INPUT') {
                    var value = this._tbx.getAttribute('value');
                    if (value) {
                        this.value = wijmo.Globalize.parseDate(value, 'HH:mm:ss');
                    }
                }
                // friendly defaults
                this.step = 15;
                this.autoExpandSelection = true;
                // initialize control options
                this.initialize(options);
            }
            Object.defineProperty(InputTime.prototype, "inputElement", {
                //--------------------------------------------------------------------------
                //#region ** object model
                /**
                 * Gets the HTML input element hosted by the control.
                 *
                 * Use this property in situations where you want to customize the
                 * attributes of the input element.
                 */
                get: function () {
                    return this._tbx;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputTime.prototype, "inputType", {
                /**
                 * Gets or sets the "type" attribute of the HTML input element hosted by the control.
                 *
                 * By default, this property is set to "tel", a value that causes mobile devices to
                 * show a numeric keypad that includes a negative sign and a decimal separator.
                 *
                 * Use this property to change the default setting if the default does not work well
                 * for the current culture, device, or application. In those cases, try changing
                 * the value to "number" or "text."
                 *
                 * Note that input elements with type "number" prevent selection in Chrome and therefore
                 * is not recommended. For more details, see this link:
                 * http://stackoverflow.com/questions/21177489/selectionstart-selectionend-on-input-type-number-no-longer-allowed-in-chrome
                 */
                get: function () {
                    return this._tbx.type;
                },
                set: function (value) {
                    this._tbx.type = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputTime.prototype, "value", {
                /**
                 * Gets or sets the current input time.
                 */
                get: function () {
                    return this._value;
                },
                set: function (value) {
                    // check type
                    value = wijmo.asDate(value, !this.isRequired);
                    // honor ranges (but keep the dates)
                    if (value) {
                        if (this._min != null && this._getTime(value) < this._getTime(this._min)) {
                            value = wijmo.DateTime.fromDateTime(value, this._min);
                        }
                        if (this._max != null && this._getTime(value) > this._getTime(this._max)) {
                            value = wijmo.DateTime.fromDateTime(value, this._max);
                        }
                    }
                    // update control
                    this._setText(value ? wijmo.Globalize.format(value, this.format) : '', true);
                    if (value != this._value && !wijmo.DateTime.equals(value, this._value)) {
                        this._value = value;
                        this.onValueChanged();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputTime.prototype, "text", {
                /**
                 * Gets or sets the text shown in the control.
                 */
                get: function () {
                    return this._tbx.value;
                },
                set: function (value) {
                    if (value != this.text) {
                        this._setText(value, true);
                        this._commitText();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputTime.prototype, "min", {
                /**
                 * Gets or sets the earliest time that the user can enter.
                 *
                 * For details about using the @see:min and @see:max properties, please see the
                 * <a href="static/minMax.html">Using the min and max properties</a> topic.
                 */
                get: function () {
                    return this._min;
                },
                set: function (value) {
                    this._min = wijmo.asDate(value, true);
                    this.isDroppedDown = false;
                    this._updateItems();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputTime.prototype, "max", {
                /**
                 * Gets or sets the latest time that the user can enter.
                 *
                 * For details about using the @see:min and @see:max properties, please see the
                 * <a href="static/minMax.html">Using the min and max properties</a> topic.
                 */
                get: function () {
                    return this._max;
                },
                set: function (value) {
                    this._max = wijmo.asDate(value, true);
                    this.isDroppedDown = false;
                    this._updateItems();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputTime.prototype, "step", {
                /**
                 * Gets or sets the number of minutes between entries in the drop-down list.
                 *
                 * The default value for this property is 15 minutes.
                 * Setting it to null, zero, or any negative value disables the drop-down.
                 */
                get: function () {
                    return this._step;
                },
                set: function (value) {
                    this._step = wijmo.asNumber(value, true);
                    this.isDroppedDown = false;
                    this._updateItems();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputTime.prototype, "format", {
                /**
                 * Gets or sets the format used to display the selected time (see @see:Globalize).
                 *
                 * The format string is expressed as a .NET-style
                 * <a href="http://msdn.microsoft.com/en-us/library/8kb3ddd4(v=vs.110).aspx" target="_blank">
                 * time format string</a>.
                 */
                get: function () {
                    return this._format;
                },
                set: function (value) {
                    if (value != this.format) {
                        this._format = wijmo.asString(value);
                        this._tbx.value = wijmo.Globalize.format(this.value, this.format);
                        if (this.collectionView && this.collectionView.items.length) {
                            this._updateItems();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputTime.prototype, "mask", {
                /**
                 * Gets or sets a mask to use while the user is editing.
                 *
                 * The mask format is the same used by the @see:wijmo.input.InputMask
                 * control.
                 *
                 * If specified, the mask must be compatible with the value of
                 * the @see:format property. For example, you can use the mask '99:99 >LL'
                 * for entering short times (format 't').
                 */
                get: function () {
                    return this._msk.mask;
                },
                set: function (value) {
                    this._msk.mask = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the @see:valueChanged event.
             */
            InputTime.prototype.onValueChanged = function (e) {
                this.valueChanged.raise(this, e);
            };
            //#endregion ** object model
            //--------------------------------------------------------------------------
            //#region ** overrides
            // update value display in case culture changed
            InputTime.prototype.refresh = function () {
                this.isDroppedDown = false;
                this._msk.refresh();
                this._tbx.value = wijmo.Globalize.format(this.value, this.format);
                this._updateItems();
            };
            // commit changes when the user picks a value from the list
            InputTime.prototype.onSelectedIndexChanged = function (e) {
                if (this.selectedIndex > -1) {
                    this._commitText();
                }
                _super.prototype.onSelectedIndexChanged.call(this, e);
            };
            // update items in drop-down list
            InputTime.prototype._updateItems = function () {
                var min = new Date(0, 0, 0, 0, 0), max = new Date(0, 0, 0, 23, 59, 59), items = [];
                if (this.min) {
                    min.setHours(this.min.getHours(), this.min.getMinutes(), this.min.getSeconds());
                }
                if (this.max) {
                    max.setHours(this.max.getHours(), this.max.getMinutes(), this.max.getSeconds());
                }
                if (wijmo.isNumber(this.step) && this.step > 0) {
                    for (var dt = min; dt <= max; dt = wijmo.DateTime.addMinutes(dt, this.step)) {
                        items.push(wijmo.Globalize.format(dt, this.format));
                    }
                }
                // update item source
                var text = this.text;
                this.itemsSource = items;
                this.text = text;
            };
            //#endregion ** overrides
            //--------------------------------------------------------------------------
            //#region ** implementation
            // gets the time of day in seconds
            InputTime.prototype._getTime = function (value) {
                return value.getHours() * 3600 + value.getMinutes() * 60 + value.getSeconds();
            };
            // override to commit text on Enter and cancel on Escape
            InputTime.prototype._keydown = function (e) {
                _super.prototype._keydown.call(this, e);
                if (!e.defaultPrevented) {
                    switch (e.keyCode) {
                        case wijmo.Key.Enter:
                            if (!this.isDroppedDown) {
                                this._commitText();
                                this.selectAll();
                            }
                            break;
                        case wijmo.Key.Escape:
                            this.text = wijmo.Globalize.format(this.value, this.format);
                            this.selectAll();
                            break;
                    }
                }
            };
            // parse time, commit if successful or revert
            InputTime.prototype._commitText = function () {
                if (!this.text && !this.isRequired) {
                    this.value = null;
                }
                else {
                    var dt = wijmo.Globalize.parseDate(this.text, this.format);
                    if (dt) {
                        this.value = wijmo.DateTime.fromDateTime(this.value, dt);
                    }
                    else {
                        this._tbx.value = wijmo.Globalize.format(this.value, this.format);
                    }
                }
            };
            return InputTime;
        }(input.ComboBox));
        input.InputTime = InputTime;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=InputTime.js.map