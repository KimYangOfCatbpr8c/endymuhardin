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
         * The @see:InputDate control allows users to type in dates using any format
         * supported by the @see:Globalize class, or to pick dates from a drop-down box
         * that shows a @see:Calendar control.
         *
         * Use the @see:min and @see:max properties to restrict the range of
         * values that the user can enter.
         *
         * For details about using the @see:min and @see:max properties, please see the
         * <a href="static/minMax.html">Using the min and max properties</a> topic.
         *
         * Use the @see:value property to gets or set the currently selected date.
         *
         * The example below shows a <b>Date</b> value (that includes date and time information)
         * using an @see:InputDate and an an @see:InputTime control. Notice how both controls
         * are bound to the same controller variable, and each edits the appropriate information
         * (either date or time). The example also shows a @see:Calendar control that you can
         * use to select the date with a single click.
         *
         * @fiddle:vgc3Y
         */
        var InputDate = (function (_super) {
            __extends(InputDate, _super);
            // private stuff
            /**
             * Initializes a new instance of the @see:InputDate class.
             *
             * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function InputDate(element, options) {
                var _this = this;
                _super.call(this, element);
                this._format = 'd';
                /**
                 * Occurs after a new date is selected.
                 */
                this.valueChanged = new wijmo.Event();
                wijmo.addClass(this.hostElement, 'wj-inputdate');
                // initialize mask provider
                this._msk = new wijmo._MaskProvider(this._tbx);
                // default to numeric keyboard (like InputNumber), unless this is IE9...
                if (!wijmo.isIE9()) {
                    this._tbx.type = 'tel';
                }
                // use wheel to increase/decrease the date
                this.addEventListener(this.hostElement, 'wheel', function (e) {
                    if (!e.defaultPrevented && !_this.isDroppedDown && _this.containsFocus()) {
                        if (_this.value != null && _this._canChangeValue()) {
                            var step = wijmo.clamp(-e.deltaY, -1, +1);
                            _this.value = _this.selectionMode == input.DateSelectionMode.Month
                                ? wijmo.DateTime.addMonths(_this.value, step)
                                : wijmo.DateTime.addDays(_this.value, step);
                            _this.selectAll();
                            e.preventDefault();
                        }
                    }
                });
                // initialize value (current date) TFS 193848
                this.value = wijmo.DateTime.newDate();
                // initializing from <input> tag
                if (this._orgTag == 'INPUT') {
                    var value = this._tbx.getAttribute('value');
                    if (value) {
                        this.value = wijmo.Globalize.parseDate(value, 'yyyy-MM-dd');
                    }
                }
                // initialize control options
                this.isRequired = true;
                this.initialize(options);
            }
            Object.defineProperty(InputDate.prototype, "value", {
                //--------------------------------------------------------------------------
                //#region ** object model
                /**
                 * Gets or sets the current date.
                 */
                get: function () {
                    return this._value;
                },
                set: function (value) {
                    if (wijmo.DateTime.equals(this._value, value)) {
                        this._tbx.value = wijmo.Globalize.format(value, this.format);
                    }
                    else {
                        // check type
                        value = wijmo.asDate(value, !this.isRequired || (value == null && this._value == null));
                        // honor min/max range
                        // REVIEW: should not clamp this...
                        value = this._clamp(value);
                        // update control text and value
                        if (this._isValidDate(value)) {
                            this._tbx.value = value ? wijmo.Globalize.format(value, this.format) : '';
                            if (value != this._value && !wijmo.DateTime.equals(this._value, value)) {
                                this._value = value;
                                this.onValueChanged();
                            }
                        }
                        else {
                            this._tbx.value = value ? wijmo.Globalize.format(this.value, this.format) : '';
                        }
                        // raise textChanged event
                        if (this.text != this._oldText) {
                            this.onTextChanged();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "text", {
                /**
                 * Gets or sets the text shown on the control.
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
            Object.defineProperty(InputDate.prototype, "selectionMode", {
                /**
                 * Gets or sets a value that indicates whether users can select
                 * days, months, or no values at all.
                 *
                 * This property affects the behavior of the drop-down calendar,
                 * but not the format used to display dates.
                 * If you set @see:selectionMode to 'Month', you should normally
                 * set the @see:format property to 'MMM yyyy' or some format that
                 * does not include the day. For example:
                 *
                 * <pre>var inputDate = new wijmo.input.InputDate('#el, {
                 *   selectionMode: 'Month',
                 *   format: 'MMM yyyy'
                 * });</pre>
                 */
                get: function () {
                    return this.calendar.selectionMode;
                },
                set: function (value) {
                    this.calendar.selectionMode = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "min", {
                /**
                 * Gets or sets the earliest date that the user can enter.
                 *
                 * For details about using the @see:min and @see:max properties, please see the
                 * <a href="static/minMax.html">Using the min and max properties</a> topic.
                 */
                get: function () {
                    return this._calendar.min;
                },
                set: function (value) {
                    this._calendar.min = wijmo.asDate(value, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "max", {
                /**
                 * Gets or sets the latest date that the user can enter.
                 *
                 * For details about using the @see:min and @see:max properties, please see the
                 * <a href="static/minMax.html">Using the min and max properties</a> topic.
                 */
                get: function () {
                    return this._calendar.max;
                },
                set: function (value) {
                    this._calendar.max = wijmo.asDate(value, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "format", {
                /**
                 * Gets or sets the format used to display the selected date.
                 *
                 * The format string is expressed as a .NET-style
                 * <a href="http://msdn.microsoft.com/en-us/library/8kb3ddd4(v=vs.110).aspx" target="_blank">
                 * Date format string</a>.
                 */
                get: function () {
                    return this._format;
                },
                set: function (value) {
                    if (value != this.format) {
                        this._format = wijmo.asString(value);
                        this._tbx.value = wijmo.Globalize.format(this.value, this.format);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "mask", {
                /**
                 * Gets or sets a mask to use while editing.
                 *
                 * The mask format is the same one that the @see:wijmo.input.InputMask
                 * control uses.
                 *
                 * If specified, the mask must be compatible with the value of
                 * the @see:format property. For example, the mask '99/99/9999' can
                 * be used for entering dates formatted as 'MM/dd/yyyy'.
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
            Object.defineProperty(InputDate.prototype, "calendar", {
                /**
                 * Gets a reference to the @see:Calendar control shown in the drop-down box.
                 */
                get: function () {
                    return this._calendar;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "inputElement", {
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
            Object.defineProperty(InputDate.prototype, "inputType", {
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
            Object.defineProperty(InputDate.prototype, "itemValidator", {
                /**
                 * Gets or sets a validator function to determine whether dates are valid for selection.
                 *
                 * If specified, the validator function should take one parameter representing the
                 * date to be tested, and should return false if the date is invalid and should not
                 * be selectable.
                 *
                 * For example, the code below prevents users from selecting dates that fall on
                 * weekends:
                 * <pre>
                 * inputDate.itemValidator = function(date) {
                 *   var weekday = date.getDay();
                 *   return weekday != 0 && weekday != 6;
                 * }
                 * </pre>
                 */
                get: function () {
                    return this._calendar.itemValidator;
                },
                set: function (value) {
                    if (value != this.itemValidator) {
                        this._calendar.itemValidator = wijmo.asFunction(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputDate.prototype, "itemFormatter", {
                /**
                 * Gets or sets a formatter function to customize dates in the drop-down calendar.
                 *
                 * The formatter function can add any content to any date. It allows
                 * complete customization of the appearance and behavior of the calendar.
                 *
                 * If specified, the function takes two parameters:
                 * <ul>
                 *     <li>the date being formatted </li>
                 *     <li>the HTML element that represents the date</li>
                 * </ul>
                 *
                 * For example, the code below shows weekends with a yellow background:
                 * <pre>
                 * inputDate.itemFormatter = function(date, element) {
                 *   var day = date.getDay();
                 *   element.style.backgroundColor = day == 0 || day == 6 ? 'yellow' : '';
                 * }
                 * </pre>
                 */
                get: function () {
                    return this.calendar.itemFormatter;
                },
                set: function (value) {
                    if (value != this.itemFormatter) {
                        this.calendar.itemFormatter = wijmo.asFunction(value);
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the @see:valueChanged event.
             */
            InputDate.prototype.onValueChanged = function (e) {
                this.valueChanged.raise(this, e);
            };
            //#endregion ** object model
            //--------------------------------------------------------------------------
            //#region ** overrides
            // update value display in case culture changed
            InputDate.prototype.refresh = function () {
                this.isDroppedDown = false;
                if (this._msk) {
                    this._msk.refresh();
                }
                if (this._calendar) {
                    this._calendar.refresh();
                }
                this._tbx.value = wijmo.Globalize.format(this.value, this.format);
            };
            // overridden to update calendar when dropping down
            InputDate.prototype.onIsDroppedDownChanged = function (e) {
                _super.prototype.onIsDroppedDownChanged.call(this, e);
                if (this.isDroppedDown) {
                    this._calChanged = false;
                    this.dropDown.focus();
                }
            };
            // create the drop-down element
            InputDate.prototype._createDropDown = function () {
                var _this = this;
                // create the drop-down element
                this._calendar = new input.Calendar(this._dropDown);
                this._dropDown.tabIndex = -1;
                // update our value to match calendar's
                this._calendar.valueChanged.addHandler(function () {
                    _this.value = wijmo.DateTime.fromDateTime(_this._calendar.value, _this.value);
                    _this._calChanged = true; // remember change to close drop-down on click
                });
                // close the drop-down when the user changes the date with the mouse
                // the 'click' event may not be triggered on iOS Safari if focus change 
                // happens during previous tap, so use 'mouseup' instead.
                //this.addEventListener(this._dropDown, 'click', () => {
                this.addEventListener(this._dropDown, 'mouseup', function (e) {
                    if (_this._calChanged) {
                        _this.isDroppedDown = false;
                    }
                    else {
                        if (e.target.getAttribute('wj-part') == 'btn-today') {
                            _this.isDroppedDown = false;
                        }
                    }
                });
            };
            // update drop down content and position before showing it
            InputDate.prototype._updateDropDown = function () {
                // update value
                this._commitText();
                // update selected date, range
                var cal = this._calendar;
                cal.value = this.value;
                cal.min = this.min;
                cal.max = this.max;
                // update view
                if (this.selectionMode != input.DateSelectionMode.Month) {
                    cal.monthView = true;
                }
                // update size
                var cs = getComputedStyle(this.hostElement);
                this._dropDown.style.minWidth = parseFloat(cs.fontSize) * 18 + 'px';
                this._calendar.refresh(); // update layout/size now
                // let base class update position
                _super.prototype._updateDropDown.call(this);
            };
            // override to commit text on Enter and cancel on Escape
            InputDate.prototype._keydown = function (e) {
                if (!e.defaultPrevented && !e.altKey && !e.ctrlKey && !e.metaKey) {
                    switch (e.keyCode) {
                        case wijmo.Key.Enter:
                            this._commitText();
                            this.selectAll();
                            break;
                        case wijmo.Key.Escape:
                            this.text = wijmo.Globalize.format(this.value, this.format);
                            this.selectAll();
                            break;
                        case wijmo.Key.Up:
                        case wijmo.Key.Down:
                            if (!this.isDroppedDown && this.value && this._canChangeValue()) {
                                var step = e.keyCode == wijmo.Key.Up ? +1 : -1;
                                this.value = this.selectionMode == input.DateSelectionMode.Month
                                    ? wijmo.DateTime.addMonths(this.value, step)
                                    : wijmo.DateTime.addDays(this.value, step);
                                this.selectAll();
                                e.preventDefault();
                            }
                            break;
                    }
                }
                _super.prototype._keydown.call(this, e);
            };
            //#endregion ** overrides
            //--------------------------------------------------------------------------
            //#region ** implementation
            // checks whether the control can change the current value
            InputDate.prototype._canChangeValue = function () {
                return !this.isReadOnly && this.selectionMode != input.DateSelectionMode.None;
            };
            // honor min/max range
            InputDate.prototype._clamp = function (value) {
                return this.calendar._clamp(value);
            };
            // parse date, commit date part (no time) if successful or revert
            InputDate.prototype._commitText = function () {
                var txt = this._tbx.value;
                if (!txt && !this.isRequired) {
                    this.value = null;
                }
                else {
                    var dt = wijmo.Globalize.parseDate(txt, this.format);
                    if (dt) {
                        this.value = wijmo.DateTime.fromDateTime(dt, this.value);
                    }
                    else {
                        this._tbx.value = wijmo.Globalize.format(this.value, this.format);
                    }
                }
            };
            // check whether a date should be selectable by the user
            InputDate.prototype._isValidDate = function (value) {
                if (value) {
                    if (this._clamp(value) != value) {
                        return false;
                    }
                    if (this.itemValidator && !this.itemValidator(value)) {
                        return false;
                    }
                }
                return true;
            };
            return InputDate;
        }(input.DropDown));
        input.InputDate = InputDate;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=InputDate.js.map