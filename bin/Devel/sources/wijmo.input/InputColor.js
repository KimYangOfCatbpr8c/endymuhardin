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
         * The @see:InputColor control allows users to select colors by typing in
         * HTML-supported color strings, or to pick colors from a drop-down
         * that shows a @see:ColorPicker control.
         *
         * Use the @see:value property to get or set the currently selected color.
         *
         * @fiddle:84xvsz90
         */
        var InputColor = (function (_super) {
            __extends(InputColor, _super);
            /**
             * Initializes a new instance of the @see:InputColor class.
             *
             * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function InputColor(element, options) {
                var _this = this;
                _super.call(this, element);
                /**
                 * Occurs after a new color is selected.
                 */
                this.valueChanged = new wijmo.Event();
                wijmo.addClass(this.hostElement, 'wj-inputcolor');
                // create preview element
                this._tbx.style.paddingLeft = '24px';
                this._ePreview = wijmo.createElement('<div class="wj-inputcolorbox" style="position:absolute;left:6px;top:6px;width:12px;bottom:6px;border:1px solid black"></div>');
                this.hostElement.style.position = 'relative';
                this.hostElement.appendChild(this._ePreview);
                // initializing from <input> tag
                if (this._orgTag == 'INPUT') {
                    this._tbx.type = '';
                    this._commitText();
                }
                // initialize value to white
                this.value = '#ffffff';
                // initialize control options
                this.isRequired = true;
                this.initialize(options);
                // close drop-down when user clicks a palette entry or the preview element
                this.addEventListener(this._colorPicker.hostElement, 'click', function (e) {
                    var el = e.target;
                    if (el && el.tagName == 'DIV') {
                        if (wijmo.closest(el, '[wj-part="div-pal"]') || wijmo.closest(el, '[wj-part="div-pv"]')) {
                            var color = el.style.backgroundColor;
                            if (color) {
                                _this.isDroppedDown = false;
                            }
                        }
                    }
                });
            }
            Object.defineProperty(InputColor.prototype, "value", {
                //--------------------------------------------------------------------------
                //#region ** object model
                /**
                 * Gets or sets the current color.
                 */
                get: function () {
                    return this._value;
                },
                set: function (value) {
                    if (value != this.value) {
                        if (value || !this.isRequired) {
                            this.text = wijmo.asString(value);
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputColor.prototype, "text", {
                /**
                 * Gets or sets the text shown on the control.
                 */
                get: function () {
                    return this._tbx.value;
                },
                set: function (value) {
                    if (value != this.text) {
                        this._setText(wijmo.asString(value), true);
                        this._commitText();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputColor.prototype, "showAlphaChannel", {
                /**
                 * Gets or sets a value indicating whether the @see:ColorPicker allows users
                 * to edit the color's alpha channel (transparency).
                 */
                get: function () {
                    return this._colorPicker.showAlphaChannel;
                },
                set: function (value) {
                    this._colorPicker.showAlphaChannel = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputColor.prototype, "colorPicker", {
                /**
                 * Gets a reference to the @see:ColorPicker control shown in the drop-down.
                 */
                get: function () {
                    return this._colorPicker;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the @see:valueChanged event.
             */
            InputColor.prototype.onValueChanged = function (e) {
                this.valueChanged.raise(this, e);
            };
            //#endregion ** object model
            //--------------------------------------------------------------------------
            //#region ** overrides
            // create the drop-down element
            InputColor.prototype._createDropDown = function () {
                var _this = this;
                // create the drop-down element
                this._colorPicker = new input.ColorPicker(this._dropDown);
                wijmo.setCss(this._dropDown, {
                    minWidth: 420,
                    minHeight: 200
                });
                // update our value to match colorPicker's
                this._colorPicker.valueChanged.addHandler(function () {
                    _this.value = _this._colorPicker.value;
                });
            };
            // override to commit/cancel edits
            InputColor.prototype._keydown = function (e) {
                if (!e.defaultPrevented) {
                    switch (e.keyCode) {
                        case wijmo.Key.Enter:
                            this._commitText();
                            this.selectAll();
                            break;
                        case wijmo.Key.Escape:
                            this.text = this.value;
                            this.selectAll();
                            break;
                    }
                }
                _super.prototype._keydown.call(this, e);
            };
            //#endregion ** overrides
            //--------------------------------------------------------------------------
            //#region ** implementation
            // assign new color to ColorPicker
            InputColor.prototype._commitText = function () {
                if (this.value != this.text) {
                    // allow empty values
                    if (!this.isRequired && !this.text) {
                        this._value = this.text;
                        this._ePreview.style.backgroundColor = '';
                        return;
                    }
                    // parse and assign color to control
                    var c = wijmo.Color.fromString(this.text);
                    if (c) {
                        this._colorPicker.value = this.text;
                        this._value = this._colorPicker.value;
                        this._ePreview.style.backgroundColor = this.value;
                        this.onValueChanged();
                    }
                    else {
                        this.text = this._value ? this._value : '';
                    }
                }
            };
            return InputColor;
        }(input.DropDown));
        input.InputColor = InputColor;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=InputColor.js.map