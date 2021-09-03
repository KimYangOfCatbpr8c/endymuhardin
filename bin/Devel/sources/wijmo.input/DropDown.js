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
         * DropDown control (abstract).
         *
         * Contains an input element and a button used to show or hide the drop-down.
         *
         * Derived classes must override the _createDropDown method to create whatever
         * editor they want to show in the drop down area (a list of items, a calendar,
         * a color editor, etc).
         */
        var DropDown = (function (_super) {
            __extends(DropDown, _super);
            /**
             * Initializes a new instance of the @see:DropDown class.
             *
             * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function DropDown(element, options) {
                var _this = this;
                _super.call(this, element, null, true);
                // property storage
                this._showBtn = true;
                this._autoExpand = true;
                /**
                 * Occurs when the value of the @see:text property changes.
                 */
                this.textChanged = new wijmo.Event();
                /**
                 * Occurs before the drop down is shown or hidden.
                 */
                this.isDroppedDownChanging = new wijmo.Event();
                /**
                 * Occurs after the drop down is shown or hidden.
                 */
                this.isDroppedDownChanged = new wijmo.Event();
                // instantiate and apply template
                var tpl = this.getTemplate();
                this.applyTemplate('wj-control wj-dropdown wj-content', tpl, {
                    _tbx: 'input',
                    _btn: 'btn',
                    _dropDown: 'dropdown'
                }, 'input');
                // set reference element (used for positioning the drop-down)
                this._elRef = this._tbx;
                // disable autocomplete (important for mobile browsers including Chrome/Android)
                //this._tbx.autocomplete = 'off';
                // create drop-down element, update button display
                this._createDropDown();
                this._updateBtn();
                // remove drop-down from DOM (so IE/Edge can print properly)
                var dd = this._dropDown;
                if (dd && dd.parentElement) {
                    dd.parentElement.removeChild(dd);
                }
                // update focus state when the drop-down gets or loses focus
                var fs = this._updateFocusState.bind(this); // TFS 153367
                this.addEventListener(this.dropDown, 'blur', fs, true);
                this.addEventListener(this.dropDown, 'focus', fs);
                // keyboard events (the same handlers are used for the control and for the drop-down)
                var kd = this._keydown.bind(this);
                this.addEventListener(this.hostElement, 'keydown', kd);
                this.addEventListener(this.dropDown, 'keydown', kd);
                // prevent smiley that appears when the user presses alt-down
                this.addEventListener(this._tbx, 'keypress', function (e) {
                    if (e.keyCode == 9787 && _this._altDown) {
                        e.preventDefault();
                    }
                });
                // textbox events
                this.addEventListener(this._tbx, 'input', function () {
                    _this._setText(_this.text, false);
                });
                this.addEventListener(this._tbx, 'click', function () {
                    if (_this._autoExpand) {
                        _this._expandSelection(); // expand the selection to the whole number/word that was clicked
                    }
                });
                // IE 9 does not fire an input event when the user removes characters from input 
                // filled by keyboard, cut, or drag operations.
                // https://developer.mozilla.org/en-US/docs/Web/Events/input
                // so subscribe to keyup and set the text just in case (TFS 111189)
                if (wijmo.isIE9()) {
                    this.addEventListener(this._tbx, 'keyup', function () {
                        _this._setText(_this.text, false);
                    });
                }
                // handle clicks on the drop-down button
                this.addEventListener(this._btn, 'click', this._btnclick.bind(this));
                // stop propagation of clicks on the drop-down element
                // (since they are not children of the hostElement, which can confuse
                // elements such as Bootstrap menus)
                this.addEventListener(this._dropDown, 'click', function (e) {
                    e.stopPropagation();
                });
            }
            Object.defineProperty(DropDown.prototype, "text", {
                //--------------------------------------------------------------------------
                //#region ** object model
                /**
                 * Gets or sets the text shown on the control.
                 */
                get: function () {
                    return this._tbx.value;
                },
                set: function (value) {
                    if (value != this.text) {
                        this._setText(value, true);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DropDown.prototype, "inputElement", {
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
            Object.defineProperty(DropDown.prototype, "isReadOnly", {
                /**
                 * Gets or sets a value that indicates whether the user can modify
                 * the control value using the mouse and keyboard.
                 */
                get: function () {
                    return this._tbx.readOnly;
                },
                set: function (value) {
                    this._tbx.readOnly = wijmo.asBoolean(value);
                    wijmo.toggleClass(this.hostElement, 'wj-state-readonly', this.isReadOnly);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DropDown.prototype, "isRequired", {
                /**
                 * Gets or sets a value that determines whether the control value must be set to
                 * a non-null value or whether it can be set to null
                 * (by deleting the content of the control).
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
            Object.defineProperty(DropDown.prototype, "required", {
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
            Object.defineProperty(DropDown.prototype, "placeholder", {
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
            Object.defineProperty(DropDown.prototype, "isDroppedDown", {
                /**
                 * Gets or sets a value that indicates whether the drop down is currently visible.
                 */
                get: function () {
                    return this._dropDown.style.display != 'none';
                },
                set: function (value) {
                    value = wijmo.asBoolean(value) && !this.isDisabled && !this.isReadOnly;
                    if (value != this.isDroppedDown && this.onIsDroppedDownChanging(new wijmo.CancelEventArgs())) {
                        var dd = this._dropDown;
                        if (value) {
                            if (!dd.style.minWidth) {
                                dd.style.minWidth = this.hostElement.getBoundingClientRect().width + 'px';
                            }
                            dd.style.display = 'block';
                            this._updateDropDown();
                        }
                        else {
                            if (this.containsFocus()) {
                                if (!this.isTouching || !this.showDropDownButton) {
                                    this.selectAll();
                                }
                                else {
                                    this.focus(); // keep the focus (needed on Android: TFS 143147)
                                }
                            }
                            wijmo.hidePopup(dd);
                        }
                        this._updateFocusState();
                        this.onIsDroppedDownChanged();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DropDown.prototype, "dropDown", {
                /**
                 * Gets the drop down element shown when the @see:isDroppedDown
                 * property is set to true.
                 */
                get: function () {
                    return this._dropDown;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DropDown.prototype, "dropDownCssClass", {
                /**
                 * Gets or sets a CSS class name to add to the control's drop-down element.
                 *
                 * This property is useful when styling the drop-down element, because it is
                 * shown as a child of the document body rather than as a child of the control
                 * itself, which prevents using CSS selectors based on the parent control.
                 */
                get: function () {
                    return this._cssClass;
                },
                set: function (value) {
                    if (value != this._cssClass) {
                        wijmo.removeClass(this._dropDown, this._cssClass);
                        this._cssClass = wijmo.asString(value);
                        wijmo.addClass(this._dropDown, this._cssClass);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DropDown.prototype, "showDropDownButton", {
                /**
                 * Gets or sets a value that indicates whether the control should display a drop-down button.
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
            Object.defineProperty(DropDown.prototype, "autoExpandSelection", {
                /**
                 * Gets or sets a value that indicates whether the control should automatically expand the
                 * selection to whole words/numbers when the control is clicked.
                 */
                get: function () {
                    return this._autoExpand;
                },
                set: function (value) {
                    this._autoExpand = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Sets the focus to the control and selects all its content.
             */
            DropDown.prototype.selectAll = function () {
                if (this._elRef == this._tbx) {
                    wijmo.setSelectionRange(this._tbx, 0, this.text.length);
                }
            };
            /**
             * Raises the @see:textChanged event.
             */
            DropDown.prototype.onTextChanged = function (e) {
                this._updateState();
                this.textChanged.raise(this, e);
            };
            /**
             * Raises the @see:isDroppedDownChanging event.
             */
            DropDown.prototype.onIsDroppedDownChanging = function (e) {
                this.isDroppedDownChanging.raise(this, e);
                return !e.cancel;
            };
            /**
             * Raises the @see:isDroppedDownChanged event.
             */
            DropDown.prototype.onIsDroppedDownChanged = function (e) {
                var _this = this;
                // while dropped down, listen to document mouse/key downs to close
                // (in case we didn't get the focus, as dialogs open from Bootstrap modals: TFS 152950)
                this.removeEventListener(document, 'mousedown');
                this.removeEventListener(document, 'keydown');
                if (this.isDroppedDown && !this.containsFocus()) {
                    this.addEventListener(document, 'mousedown', function (e) {
                        if (!wijmo.contains(_this.dropDown, e.target) && !wijmo.contains(_this.hostElement, e.target)) {
                            _this.isDroppedDown = false;
                        }
                    });
                    this.addEventListener(document, 'keydown', function (e) {
                        if (!_this.containsFocus()) {
                            _this.isDroppedDown = false;
                        }
                    });
                }
                // raise the event as usual
                this.isDroppedDownChanged.raise(this, e);
            };
            //#endregion
            //--------------------------------------------------------------------------
            //#region ** overrides
            // transfer focus from control to textbox
            // (but don't show the soft keyboard when the user touches the drop-down button)
            DropDown.prototype.onGotFocus = function (e) {
                if (!this.isTouching) {
                    this.selectAll();
                }
                _super.prototype.onGotFocus.call(this, e);
            };
            // close the drop-down when losing focus
            DropDown.prototype.onLostFocus = function (e) {
                this._commitText();
                if (!this.containsFocus()) {
                    this.isDroppedDown = false;
                }
                _super.prototype.onLostFocus.call(this, e);
            };
            // check whether this control or its drop-down contain the focused element.
            DropDown.prototype.containsFocus = function () {
                return _super.prototype.containsFocus.call(this) || wijmo.contains(this._dropDown, wijmo.getActiveElement());
            };
            // close drop-down when disposing
            DropDown.prototype.dispose = function () {
                this.isDroppedDown = false;
                _super.prototype.dispose.call(this);
            };
            // reposition dropdown when refreshing
            DropDown.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                _super.prototype.refresh.call(this, fullUpdate);
                // update popup/focus
                if (this.isDroppedDown) {
                    if (getComputedStyle(this.hostElement).display != 'none') {
                        var ae = wijmo.getActiveElement();
                        wijmo.showPopup(this._dropDown, this.hostElement, false, false, this.dropDownCssClass == null);
                        if (ae instanceof HTMLElement && ae != wijmo.getActiveElement()) {
                            ae.focus();
                        }
                    }
                }
            };
            // reposition dropdown when window size changes
            DropDown.prototype._handleResize = function () {
                if (this.isDroppedDown) {
                    this.refresh();
                }
            };
            //#endregion
            //--------------------------------------------------------------------------
            //#region ** implementation
            // expand the current selection to the entire number/string that was clicked
            DropDown.prototype._expandSelection = function () {
                var tbx = this._tbx, val = tbx.value, start = tbx.selectionStart, end = tbx.selectionEnd;
                if (val && start == end) {
                    var ct = this._getCharType(val, start);
                    if (ct > -1) {
                        for (; end < val.length; end++) {
                            if (this._getCharType(val, end) != ct) {
                                break;
                            }
                        }
                        for (; start > 0; start--) {
                            if (this._getCharType(val, start - 1) != ct) {
                                break;
                            }
                        }
                        if (start != end) {
                            tbx.setSelectionRange(start, end);
                        }
                    }
                }
            };
            // get the type of character (digit, letter, other) at a given position
            DropDown.prototype._getCharType = function (text, pos) {
                var chr = text[pos];
                if (chr >= '0' && chr <= '9')
                    return 0;
                if ((chr >= 'a' && chr <= 'z') || (chr >= 'A' && chr <= 'Z'))
                    return 1;
                return -1;
            };
            // handle keyboard events
            DropDown.prototype._keydown = function (e) {
                // honor defaultPrevented
                if (e.defaultPrevented)
                    return;
                // remember alt key for preventing smiley
                this._altDown = e.altKey;
                // handle key
                switch (e.keyCode) {
                    // close dropdown on tab, escape, enter
                    case wijmo.Key.Tab:
                    case wijmo.Key.Escape:
                    case wijmo.Key.Enter:
                        if (this.isDroppedDown) {
                            this.isDroppedDown = false;
                            if (e.keyCode != wijmo.Key.Tab && !this.containsFocus()) {
                                this.focus();
                            }
                            e.preventDefault();
                        }
                        break;
                    // toggle drop-down on F4, alt up/down
                    case wijmo.Key.F4:
                    case wijmo.Key.Down:
                    case wijmo.Key.Up:
                        if (e.keyCode == wijmo.Key.F4 || e.altKey) {
                            if (wijmo.contains(document.body, this.hostElement)) {
                                this.isDroppedDown = !this.isDroppedDown;
                                if (!this.isDroppedDown) {
                                    this.focus();
                                }
                                e.preventDefault();
                            }
                        }
                        break;
                }
            };
            // handle clicks on the drop-down button
            DropDown.prototype._btnclick = function (e) {
                this.isDroppedDown = !this.isDroppedDown;
            };
            // update text in textbox
            DropDown.prototype._setText = function (text, fullMatch) {
                // make sure we have a string
                if (text == null)
                    text = '';
                text = text.toString();
                // update element
                if (text != this._tbx.value) {
                    this._tbx.value = text;
                }
                // fire change event
                if (text != this._oldText) {
                    this._oldText = text;
                    this.onTextChanged();
                }
            };
            // update drop-down button visibility
            DropDown.prototype._updateBtn = function () {
                this._btn.tabIndex = -1;
                this._btn.style.display = this._showBtn ? '' : 'none';
            };
            // create the drop-down element
            DropDown.prototype._createDropDown = function () {
                // override in derived classes
            };
            // commit the text in the value element
            DropDown.prototype._commitText = function () {
                // override in derived classes
            };
            // update drop down content before showing it
            DropDown.prototype._updateDropDown = function () {
                if (this.isDroppedDown) {
                    this._commitText();
                    wijmo.showPopup(this._dropDown, this.hostElement, false, false, this.dropDownCssClass == null);
                }
            };
            /**
             * Gets or sets the template used to instantiate @see:DropDown controls.
             */
            DropDown.controlTemplate = '<div style="position:relative" class="wj-template">' +
                '<div class="wj-input">' +
                '<div class="wj-input-group wj-input-btn-visible">' +
                '<input wj-part="input" type="text" class="wj-form-control" />' +
                '<span wj-part="btn" class="wj-input-group-btn" tabindex="-1">' +
                '<button class="wj-btn wj-btn-default" type="button" tabindex="-1">' +
                '<span class="wj-glyph-down"></span>' +
                '</button>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '<div wj-part="dropdown" class="wj-content wj-dropdown-panel" ' +
                'style="display:none;position:absolute;z-index:100">' +
                '</div>' +
                '</div>';
            return DropDown;
        }(wijmo.Control));
        input.DropDown = DropDown;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=DropDown.js.map