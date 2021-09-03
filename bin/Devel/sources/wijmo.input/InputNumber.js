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
         * The @see:InputNumber control allows users to enter numbers.
         *
         * The control prevents users from accidentally entering invalid data and
         * formats the number as it is edited.
         *
         * Pressing the minus key reverses the sign of the value being edited,
         * regardless of cursor position.
         *
         * You may use the @see:min and @see:max properties to limit the range of
         * acceptable values, and the @see:step property to provide spinner buttons
         * that increase or decrease the value with a click.
         *
         * For details about using the @see:min and @see:max properties, please see the
         * <a href="static/minMax.html">Using the min and max properties</a> topic.
         *
         * Use the @see:value property to get or set the currently selected number.
         *
         * The example below creates several @see:InputNumber controls and shows
         * the effect of using different formats, ranges, and step values.
         *
         * @fiddle:Cf9L9
         */
        var InputNumber = (function (_super) {
            __extends(InputNumber, _super);
            /**
             * Initializes a new instance of the @see:InputNumber class.
             *
             * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function InputNumber(element, options) {
                var _this = this;
                _super.call(this, element);
                this._showBtn = true;
                this._readOnly = false;
                /**
                 * Occurs when the value of the @see:text property changes.
                 */
                this.textChanged = new wijmo.Event();
                /**
                 * Occurs when the value of the @see:value property changes.
                 */
                this.valueChanged = new wijmo.Event();
                // instantiate and apply template
                var tpl = this.getTemplate();
                this.applyTemplate('wj-control wj-inputnumber wj-content', tpl, {
                    _tbx: 'input',
                    _btnUp: 'btn-inc',
                    _btnDn: 'btn-dec'
                }, 'input');
                // disable autocomplete/spellcheck (important for mobile browsers including Chrome/Android)
                var tb = this._tbx;
                tb.autocomplete = 'off';
                tb.spellcheck = false;
                // update localized decimal and currency symbols
                this._updateSymbols();
                // handle IME
                this.addEventListener(this._tbx, 'compositionstart', function () {
                    _this._composing = true;
                });
                this.addEventListener(this._tbx, 'compositionend', function () {
                    _this._composing = false;
                    setTimeout(function () {
                        _this._setText(_this.text);
                    });
                });
                // textbox events
                this.addEventListener(tb, 'keypress', this._keypress.bind(this));
                this.addEventListener(tb, 'keydown', this._keydown.bind(this));
                this.addEventListener(tb, 'input', this._input.bind(this));
                // inc/dec buttons: change value
                // if this was a tap, keep focus on button; OW transfer to textbox
                this.addEventListener(this._btnUp, 'click', this._clickSpinner.bind(this));
                this.addEventListener(this._btnDn, 'click', this._clickSpinner.bind(this));
                // use wheel to increase/decrease the value
                this.addEventListener(this.hostElement, 'wheel', function (e) {
                    if (!e.defaultPrevented && !_this.isReadOnly && _this.containsFocus()) {
                        if (_this.value != null) {
                            var step = wijmo.clamp(-e.deltaY, -1, +1);
                            _this._increment((_this.step || 1) * step);
                            setTimeout(function () { return _this.selectAll(); });
                            e.preventDefault();
                        }
                    }
                });
                // initialize value
                this.value = 0;
                // initialize control options
                this.isRequired = true;
                this.initialize(options);
            }
            Object.defineProperty(InputNumber.prototype, "inputElement", {
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
            Object.defineProperty(InputNumber.prototype, "inputType", {
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
            Object.defineProperty(InputNumber.prototype, "value", {
                /**
                 * Gets or sets the current value of the control.
                 */
                get: function () {
                    return this._value;
                },
                set: function (value) {
                    if (value != this._value) {
                        value = wijmo.asNumber(value, !this.isRequired || (value == null && this._value == null));
                        if (value == null) {
                            this._setText('');
                        }
                        else if (!isNaN(value)) {
                            var text = wijmo.Globalize.format(value, this.format); //, false, true); TFS 194954
                            this._setText(text);
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputNumber.prototype, "isRequired", {
                /**
                 * Gets or sets a value indicating whether the control value must be a number or whether it
                 * can be set to null (by deleting the content of the control).
                 */
                get: function () {
                    return this._tbx.required;
                },
                set: function (value) {
                    this._tbx.required = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputNumber.prototype, "required", {
                // Deprecated: use 'isRequired' instead to avoid confusion with 'required' HTML attribute.
                get: function () {
                    wijmo._deprecated('required', 'isRequired');
                    return this.isRequired;
                },
                set: function (value) {
                    wijmo._deprecated('required', 'isRequired');
                    this.isRequired = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputNumber.prototype, "isReadOnly", {
                /**
                 * Gets or sets a value that indicates whether the user can modify
                 * the control value using the mouse and keyboard.
                 */
                get: function () {
                    return this._readOnly;
                },
                set: function (value) {
                    this._readOnly = wijmo.asBoolean(value);
                    this.inputElement.readOnly = this._readOnly;
                    wijmo.toggleClass(this.hostElement, 'wj-state-readonly', this.isReadOnly);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputNumber.prototype, "min", {
                /**
                 * Gets or sets the smallest number that the user can enter.
                 *
                 * For details about using the @see:min and @see:max properties, please see the
                 * <a href="static/minMax.html">Using the min and max properties</a> topic.
                 */
                get: function () {
                    return this._min;
                },
                set: function (value) {
                    this._min = wijmo.asNumber(value, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputNumber.prototype, "max", {
                /**
                 * Gets or sets the largest number that the user can enter.
                 *
                 * For details about using the @see:min and @see:max properties, please see the
                 * <a href="static/minMax.html">Using the min and max properties</a> topic.
                 */
                get: function () {
                    return this._max;
                },
                set: function (value) {
                    this._max = wijmo.asNumber(value, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputNumber.prototype, "step", {
                /**
                 * Gets or sets the amount to add or subtract to the @see:value property
                 * when the user clicks the spinner buttons.
                 */
                get: function () {
                    return this._step;
                },
                set: function (value) {
                    this._step = wijmo.asNumber(value, true);
                    this._updateBtn();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputNumber.prototype, "format", {
                /**
                 * Gets or sets the format used to display the number being edited (see @see:Globalize).
                 *
                 * The format string is expressed as a .NET-style
                 * <a href="http://msdn.microsoft.com/en-us/library/dwhawy9k(v=vs.110).aspx" target="_blank">
                 * standard numeric format string</a>.
                 */
                get: function () {
                    return this._format;
                },
                set: function (value) {
                    if (value != this.format) {
                        this._format = wijmo.asString(value);
                        this.refresh();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputNumber.prototype, "text", {
                /**
                 * Gets or sets the text shown in the control.
                 */
                get: function () {
                    return this._tbx.value;
                },
                set: function (value) {
                    if (value != this.text) {
                        this._oldText = null;
                        this._setText(value);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputNumber.prototype, "placeholder", {
                /**
                 * Gets or sets the string shown as a hint when the control is empty.
                 */
                get: function () {
                    return this._tbx.placeholder;
                },
                set: function (value) {
                    this._tbx.placeholder = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputNumber.prototype, "showSpinner", {
                /**
                 * Gets or sets a value indicating whether the control displays spinner buttons
                 * to increment or decrement the value (the step property must be set to a
                 * value other than zero).
                 */
                get: function () {
                    return this._showBtn;
                },
                set: function (value) {
                    this._showBtn = wijmo.asBoolean(value);
                    this._updateBtn();
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Sets the focus to the control and selects all its content.
             */
            InputNumber.prototype.selectAll = function () {
                wijmo.setSelectionRange(this._tbx, 0, this._tbx.value.length);
            };
            /**
             * Raises the @see:textChanged event.
             */
            InputNumber.prototype.onTextChanged = function (e) {
                this._updateState();
                this.textChanged.raise(this, e);
            };
            /**
             * Raises the @see:valueChanged event.
             */
            InputNumber.prototype.onValueChanged = function (e) {
                this.valueChanged.raise(this, e);
            };
            //#endregion
            //--------------------------------------------------------------------------
            //#region ** overrides
            // give focus to textbox unless touching
            InputNumber.prototype.onGotFocus = function (e) {
                if (!this.isTouching) {
                    this._tbx.focus();
                    this.selectAll();
                }
                _super.prototype.onGotFocus.call(this, e);
            };
            // enforce min/max when losing focus
            InputNumber.prototype.onLostFocus = function (e) {
                var value = this._clamp(this.value), text = wijmo.Globalize.format(value, this.format, false, false);
                this._setText(text); // TFS 205973
                _super.prototype.onLostFocus.call(this, e);
            };
            // update culture symbols and display text when refreshing
            InputNumber.prototype.refresh = function (fullUpdate) {
                this._updateSymbols();
                var text = wijmo.Globalize.format(this.value, this.format);
                this._setText(text);
            };
            //#endregion
            //--------------------------------------------------------------------------
            //#region ** implementation
            // update culture symbols
            InputNumber.prototype._updateSymbols = function () {
                var nf = wijmo.culture.Globalize.numberFormat;
                this._decChar = nf['.'] || '.';
                this._currChar = nf.currency.symbol || '$';
                this._rxSym = new RegExp('^[%+\\-() ' + this._decChar + this._currChar + ']*$'); // TFS 141501, 192707
            };
            // make sure a value is between min and max
            InputNumber.prototype._clamp = function (value) {
                return wijmo.clamp(value, this.min, this.max);
            };
            // checks whether a character is a digit, sign, or decimal point
            InputNumber.prototype._isNumeric = function (chr, digitsOnly) {
                if (digitsOnly === void 0) { digitsOnly = false; }
                var isNum = (chr == this._decChar) || (chr >= '0' && chr <= '9');
                if (!isNum && !digitsOnly) {
                    isNum = '+-()'.indexOf(chr) > -1;
                }
                return isNum;
            };
            // get the range of numeric characters within the current text
            InputNumber.prototype._getInputRange = function (digitsOnly) {
                if (digitsOnly === void 0) { digitsOnly = false; }
                var rng = [0, 0], text = this.text, hasStart = false;
                for (var i = 0; i < text.length; i++) {
                    if (this._isNumeric(text[i], digitsOnly)) {
                        if (!hasStart) {
                            rng[0] = i;
                            hasStart = true;
                        }
                        rng[1] = i + 1;
                    }
                }
                return rng;
            };
            // move the cursor to the left of the first digit
            InputNumber.prototype._moveToDigit = function () {
                var rng = this._getInputRange(true);
                wijmo.setSelectionRange(this._tbx, rng[0], rng[1]);
            };
            // apply increment with rounding (not truncating): TFS 142618, 145814, 153300
            InputNumber.prototype._increment = function (step) {
                if (step) {
                    var value = this._clamp(this.value + step), text = wijmo.Globalize.format(value, this.format, false, false);
                    this._setText(text);
                }
            };
            // get selection start
            InputNumber.prototype._getSelStart = function () {
                return this._tbx && this._tbx.value
                    ? this._tbx.selectionStart
                    : 0;
            };
            // update spinner button visibility
            InputNumber.prototype._updateBtn = function () {
                if (this.showSpinner && this.step && this.value != null) {
                    // show buttons and add class
                    this._btnUp.style.display = this._btnDn.style.display = '';
                    wijmo.addClass(this.hostElement, 'wj-input-show-spinner');
                }
                else {
                    // hide buttons and remove class
                    this._btnUp.style.display = this._btnDn.style.display = 'none';
                    wijmo.removeClass(this.hostElement, 'wj-input-show-spinner');
                }
            };
            // update text in textbox
            InputNumber.prototype._setText = function (text) {
                // not while composing IME text...
                if (this._composing)
                    return;
                // handle nulls
                if (!text) {
                    // if not required, allow setting to null
                    if (!this.isRequired) {
                        this._tbx.value = '';
                        if (this._value != null) {
                            this._value = null;
                            this.onValueChanged();
                        }
                        if (this._oldText) {
                            this._oldText = text;
                            this.onTextChanged();
                        }
                        this._updateBtn();
                        return;
                    }
                    // required, change text to zero
                    text = '0';
                }
                // let user start typing negative numbers
                if (text == '-' || text == '(') {
                    this._tbx.value = text;
                    wijmo.setSelectionRange(this._tbx, 1);
                    return;
                }
                // handle case when user deletes the opening parenthesis...
                if (text.length > 1 && text[text.length - 1] == ')' && text[0] != '(') {
                    text = text.substr(0, text.length - 1);
                }
                // handle strings composed only of decimal/percentage/plus/minus/currency signs (TFS 143559, 141501)
                if (this._rxSym.test(text)) {
                    text = '0';
                }
                // parse input
                var fmt = this._format || (text.indexOf(this._decChar) > -1 ? 'n2' : 'n0'), value = wijmo.Globalize.parseFloat(text, fmt);
                if (isNaN(value)) {
                    this._tbx.value = this._oldText;
                    return;
                }
                // handle percentages
                if (text.indexOf('%') < 0 && fmt.toLowerCase().indexOf('p') > -1) {
                    value /= 100;
                }
                // get formatted value
                var truncate = this._oldText && text.length == this._oldText.length + 1, // round when pasting: TFS 205653
                fval = wijmo.Globalize.format(value, fmt, false, truncate);
                if (fmt == 'n' || fmt[0].toLowerCase() == 'g') {
                    if (this._tbx.selectionStart == this._tbx.value.length) {
                        if (text == fval + this._decChar || text == fval + this._decChar + '0') {
                            fval = text;
                        }
                    }
                }
                // update text with formatted value
                if (this._tbx.value != fval) {
                    this._tbx.value = fval;
                    value = wijmo.Globalize.parseFloat(fval, this.format); // TFS 139400
                }
                // update value, raise valueChanged
                if (value != this._value) {
                    this._value = value;
                    this.onValueChanged();
                }
                // raise textChanged
                if (this.text != this._oldText) {
                    this.onTextChanged();
                    this._oldText = this.text;
                }
                // update spinner button visibility
                this._updateBtn();
            };
            // handle the keypress events
            InputNumber.prototype._keypress = function (e) {
                // ignore the key if handled, composing, or if the control is read-only (TFS 199438)
                if (e.defaultPrevented || this._composing || this._readOnly) {
                    return;
                }
                // if char pressed, not ctrl key // TFS 193087
                if (e.charCode && !e.ctrlKey) {
                    // prevent invalid chars/validate cursor position (TFS 80733)
                    var chr = String.fromCharCode(e.charCode);
                    if (!this._isNumeric(chr)) {
                        e.preventDefault();
                    }
                    else {
                        var rng = this._getInputRange(true);
                        if (this._tbx.selectionStart < rng[0]) {
                            wijmo.setSelectionRange(this._tbx, rng[0], rng[1]);
                        }
                    }
                    // handle special characters
                    switch (chr) {
                        case '-':
                            if (this.value) {
                                this.value *= -1;
                                this._moveToDigit();
                            }
                            else {
                                this._setText('-');
                            }
                            e.preventDefault();
                            break;
                        case '+':
                            this.value = Math.abs(this.value);
                            this._moveToDigit();
                            e.preventDefault();
                            break;
                        case this._decChar:
                            var dec = this._tbx.value.indexOf(chr);
                            if (dec > -1) {
                                if (this._getSelStart() <= dec) {
                                    dec++;
                                }
                                wijmo.setSelectionRange(this._tbx, dec);
                                e.preventDefault();
                            }
                            break;
                    }
                }
            };
            // handle the keydown event
            InputNumber.prototype._keydown = function (e) {
                var _this = this;
                // honor defaultPrevented
                if (e.defaultPrevented)
                    return;
                // not while composing IME text...
                if (this._composing)
                    return;
                switch (e.keyCode) {
                    // apply increment when user presses up/down
                    case wijmo.Key.Up:
                    case wijmo.Key.Down:
                        if (this.step) {
                            this._increment(this.step * (e.keyCode == wijmo.Key.Up ? +1 : -1));
                            setTimeout(function () {
                                _this.selectAll();
                            });
                            e.preventDefault();
                        }
                        break;
                    // skip over decimal point when pressing backspace (TFS 80472)
                    case wijmo.Key.Back:
                        if (this._tbx && this._tbx.selectionStart == this._tbx.selectionEnd) {
                            var sel = this._tbx.selectionStart;
                            if (sel > 0 && this.text[sel - 1] == this._decChar) {
                                setTimeout(function () {
                                    wijmo.setSelectionRange(_this._tbx, sel - 1);
                                });
                                e.preventDefault();
                            }
                        }
                        break;
                    // skip over decimal point when pressing delete (TFS 80472)
                    case wijmo.Key.Delete:
                        if (this._tbx && this._tbx.selectionStart == this._tbx.selectionEnd) {
                            var sel = this._tbx.selectionStart;
                            if (sel > 0 && this.text[sel] == this._decChar) {
                                setTimeout(function () {
                                    wijmo.setSelectionRange(_this._tbx, sel + 1);
                                });
                                e.preventDefault();
                            }
                        }
                        break;
                }
            };
            // handle user input
            InputNumber.prototype._input = function (e) {
                var _this = this;
                // not while composing IME text...
                if (this._composing)
                    return;
                // this timeOut is **important** for Windows Phone/Android/Safari
                setTimeout(function () {
                    // remember cursor position
                    var tbx = _this._tbx, text = tbx.value, sel = _this._getSelStart(), dec = text ? text.indexOf(_this._decChar) : -1;
                    // set the text
                    _this._setText(text);
                    // update cursor position if we have the focus (TFS 136134)
                    if (_this.containsFocus()) {
                        // get updated values
                        var newText = tbx.value, newDec = newText.indexOf(_this._decChar);
                        // handle cases where user types "-*" and the control switches to parenthesized values
                        if (text && text[0] == '-' && newText && newText[0] != '-') {
                            text = null;
                        }
                        // try to keep cursor offset from the right (TFS 136392, 143553)
                        if (text) {
                            if ((sel <= dec && newDec > -1) || (dec < 0 && newDec < 0)) {
                                sel += newText.length - text.length;
                            }
                            else if (sel == text.length && dec < 0 && newDec > -1) {
                                sel = newDec;
                            }
                        }
                        else {
                            sel = newDec > -1 ? newDec : newText.match(/[^\d]*$/).index;
                        }
                        // make sure it's within the valid range
                        var rng = _this._getInputRange();
                        if (sel < rng[0])
                            sel = rng[0];
                        if (sel > rng[1])
                            sel = rng[1];
                        // set cursor position
                        wijmo.setSelectionRange(tbx, sel);
                    }
                });
            };
            // handle clicks on the spinner buttons
            InputNumber.prototype._clickSpinner = function (e) {
                var _this = this;
                if (!e.defaultPrevented && !this.isReadOnly && this.step && this.value != null) {
                    this._increment(this.step * (wijmo.contains(this._btnUp, e.target) ? +1 : -1));
                    if (!this.isTouching) {
                        setTimeout(function () { return _this.selectAll(); });
                    }
                }
            };
            /**
             * Gets or sets the template used to instantiate @see:InputNumber controls.
             */
            InputNumber.controlTemplate = '<div class="wj-input">' +
                '<div class="wj-input-group">' +
                '<span wj-part="btn-dec" class="wj-input-group-btn" tabindex="-1">' +
                '<button class="wj-btn wj-btn-default" type="button" tabindex="-1">-</button>' +
                '</span>' +
                '<input type="tel" wj-part="input" class="wj-form-control wj-numeric"/>' +
                '<span wj-part="btn-inc" class="wj-input-group-btn" tabindex="-1">' +
                '<button class="wj-btn wj-btn-default" type="button" tabindex="-1">+</button>' +
                '</span>' +
                '</div>';
            return InputNumber;
        }(wijmo.Control));
        input.InputNumber = InputNumber;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=InputNumber.js.map