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
         * The @see:ColorPicker control allows users to select a color by clicking
         * on panels to adjust color channels (hue, saturation, brightness, alpha).
         *
         * Use the @see:value property to get or set the currently selected color.
         *
         * The control is used as a drop-down for the @see:InputColor control.
         *
         * @fiddle:84xvsz90
         */
        var ColorPicker = (function (_super) {
            __extends(ColorPicker, _super);
            /**
             * Initializes a new instance of the @see:ColorPicker class.
             *
             * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function ColorPicker(element, options) {
                var _this = this;
                _super.call(this, element);
                this._hsb = [.5, 1, 1];
                this._alpha = 1;
                /**
                 * Occurs when the color changes.
                 */
                this.valueChanged = new wijmo.Event();
                // instantiate and apply template
                var tpl = this.getTemplate();
                this.applyTemplate('wj-control wj-colorpicker wj-content', tpl, {
                    _eSB: 'div-sb',
                    _eHue: 'div-hue',
                    _eAlpha: 'div-alpha',
                    _ePreview: 'div-pv',
                    _ePal: 'div-pal',
                    _eText: 'div-text'
                });
                // build palette
                this._palette = '#FFF,#000, #F00,#FFC000,#FFFF00,#92D050,#00B050,#00B0F0,#0070C0,#7030A0'.split(',');
                this._updatePalette();
                // build hue gradient 
                // (use an image since IE9 doesn't support multi-stop gradients)
                this._eHue.style.backgroundImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAD4CAIAAACi6hsPAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAGvSURBVDhPXdBPaM9xHMfxz4pWaxcmtoOhpdXSVpiyHWxqmVpDjaU5rK34XfypjTJ/p+ZPay6jhsOsRrKwaJElf9IQq03WIkv4FeMwMq221tfje1ByeFzfvd7PEKWGEKWTQRZLySWfVRRTQjmVbKWGOhLsZT+HaeY0bbTTQSfdXOcWffTzmAFeMcwoYyT5ygS/mA5hNgphip98J8kHRnnNSwZ4yH1uc4OrdHGR87RximYO0cgedlLLdqqoYAPrWMtKVrCcJSxiPmnMJUQp/Bsyk2xyyKOAQooopYwKtlDNDur5G7SBJo7RQiv/B+2hl3s84CkvGGKEOOYnxolj/mYmhBmDJ5ngCx95xxsGecYj4pB3iENeoZMO2mmlhaMcpIE4ZII6aqhmM3HMMkooopB88sghm0wySCeVlCjMCVFIYx4LWUwOeRSwhmLWU84mqqihll3sppEmjnOSs5zjEl1c4yZ99POE5wwxwns+840fTDFLFKaZZIJxkozxlmEGGSC+GF++Sy89dHOZC8Rr4lVnOMERDrCPBPXEX22jko2UEn+/mnxyWUYWC0gnNUQh/AEc0HJs6cex0gAAAABJRU5ErkJggg==)';
                this._eHue.style.backgroundSize = 'contain';
                // add filter gradients to IE 9
                if (navigator.appVersion.indexOf('MSIE 9') > -1) {
                    this._eSB.children[0].style.filter = 'progid:DXImageTransform.Microsoft.gradient(startColorstr=#ffffffff,endColorstr=#00ffffff,GradientType=1)';
                    this._eSB.children[1].style.filter = 'progid:DXImageTransform.Microsoft.gradient(startColorstr=#00000000,endColorstr=#ff000000,GradientType=0)';
                }
                // add cursors to panels
                tpl = ColorPicker._tplCursor;
                this._cSB = wijmo.createElement(tpl);
                this._cHue = wijmo.createElement(tpl);
                this._cHue.style.width = '100%';
                this._cAlpha = wijmo.createElement(tpl);
                this._cAlpha.style.height = '100%';
                this._eSB.appendChild(this._cSB);
                this._eHue.appendChild(this._cHue);
                this._eAlpha.appendChild(this._cAlpha);
                // handle mouse
                this.addEventListener(this.hostElement, 'mousedown', function (e) {
                    document.addEventListener('mousemove', mouseMove);
                    document.addEventListener('mouseup', mouseUp);
                    _this._mouseDown(e);
                });
                var mouseMove = function (e) {
                    _this._mouseMove(e);
                };
                var mouseUp = function (e) {
                    document.removeEventListener('mousemove', mouseMove);
                    document.removeEventListener('mouseup', mouseUp);
                    _this._mouseUp(e);
                };
                // handle clicks on the palette
                this.addEventListener(this.hostElement, 'click', function (e) {
                    var el = e.target;
                    if (el && el.tagName == 'DIV' && wijmo.contains(_this._ePal, el)) {
                        var color = el.style.backgroundColor;
                        if (color) {
                            _this.value = new wijmo.Color(color).toString();
                        }
                    }
                });
                // initialize value to white
                this.value = '#ffffff';
                // initialize control options
                this.initialize(options);
                // initialize control
                this._updatePanels();
            }
            Object.defineProperty(ColorPicker.prototype, "showAlphaChannel", {
                /**
                 * Gets or sets a value indicating whether the @see:ColorPicker allows users
                 * to edit the color's alpha channel (transparency).
                 */
                get: function () {
                    return this._eAlpha.parentElement.style.display != 'none';
                },
                set: function (value) {
                    this._eAlpha.parentElement.style.display = wijmo.asBoolean(value) ? '' : 'none';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ColorPicker.prototype, "showColorString", {
                /**
                 * Gets or sets a value indicating whether the @see:ColorPicker shows a string representation
                 * of the current color.
                 */
                get: function () {
                    return this._eText.style.display != 'none';
                },
                set: function (value) {
                    this._eText.style.display = wijmo.asBoolean(value) ? '' : 'none';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ColorPicker.prototype, "value", {
                /**
                 * Gets or sets the currently selected color.
                 */
                get: function () {
                    return this._value;
                },
                set: function (value) {
                    if (value != this.value) {
                        // save new value
                        this._value = wijmo.asString(value);
                        this._eText.innerText = this._value;
                        // parse new color, convert to hsb values
                        var c = new wijmo.Color(this._value), hsb = c.getHsb();
                        // check whether the color really changed
                        if (this._hsb[0] != hsb[0] || this._hsb[1] != hsb[1] ||
                            this._hsb[2] != hsb[2] || this._alpha != c.a) {
                            // update hsb channels (but keep hue when s/b go to zero)
                            if (hsb[2] == 0) {
                                hsb[0] = this._hsb[0];
                                hsb[1] = this._hsb[1];
                            }
                            else if (hsb[1] == 0) {
                                hsb[0] = this._hsb[0];
                            }
                            this._hsb = hsb;
                            this._alpha = c.a;
                            // raise valueChanged event
                            this.onValueChanged();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ColorPicker.prototype, "palette", {
                /**
                 * Gets or sets an array that contains the colors in the palette.
                 *
                 * The palette contains ten colors, represented by an array with
                 * ten strings. The first two colors are usually white and black.
                 */
                get: function () {
                    return this._palette;
                },
                set: function (value) {
                    value = wijmo.asArray(value);
                    for (var i = 0; i < value.length && i < this._palette.length; i++) {
                        var entry = wijmo.asString(value[i]);
                        this._palette[i] = entry;
                    }
                    this._updatePalette();
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the @see:valueChanged event.
             */
            ColorPicker.prototype.onValueChanged = function (e) {
                this._updatePanels();
                this.valueChanged.raise(this, e);
            };
            // ** event handlers
            ColorPicker.prototype._mouseDown = function (e) {
                this._htDown = this._getTargetPanel(e);
                if (this._htDown) {
                    e.preventDefault();
                    this.focus();
                    this._mouseMove(e);
                }
            };
            ColorPicker.prototype._mouseMove = function (e) {
                if (this._htDown) {
                    var rc = this._htDown.getBoundingClientRect();
                    if (this._htDown == this._eHue) {
                        this._hsb[0] = wijmo.clamp((e.clientY - rc.top) / rc.height, 0, .99);
                        this._updateColor();
                    }
                    else if (this._htDown == this._eSB) {
                        this._hsb[1] = wijmo.clamp((e.clientX - rc.left) / rc.width, 0, 1);
                        this._hsb[2] = wijmo.clamp(1 - (e.clientY - rc.top) / rc.height, 0, 1);
                        this._updateColor();
                    }
                    else if (this._htDown == this._eAlpha) {
                        this._alpha = wijmo.clamp((e.clientX - rc.left) / rc.width, 0, 1);
                        this._updateColor();
                    }
                }
            };
            ColorPicker.prototype._mouseUp = function (e) {
                this._htDown = null;
            };
            // update color value to reflect new hsb values
            ColorPicker.prototype._updateColor = function () {
                var c = wijmo.Color.fromHsb(this._hsb[0], this._hsb[1], this._hsb[2], this._alpha);
                this.value = c.toString();
                this._updatePanels();
            };
            // updates the color elements in the palette
            ColorPicker.prototype._updatePalette = function () {
                var white = new wijmo.Color('#fff'), black = new wijmo.Color('#000');
                // clear the current palette
                this._ePal.innerHTML = '';
                // add one column per palette color
                for (var i = 0; i < this._palette.length; i++) {
                    var div = wijmo.createElement('<div style="float:left;width:10%;box-sizing:border-box;padding:1px">'), clr = new wijmo.Color(this._palette[i]), hsb = clr.getHsb();
                    // add palette color
                    div.appendChild(this._makePalEntry(clr, 4));
                    // add six shades for this color
                    for (var r = 0; r < 5; r++) {
                        if (hsb[1] == 0) {
                            var pct = r * .1 + (hsb[2] > .5 ? .05 : .55);
                            clr = wijmo.Color.interpolate(white, black, pct);
                        }
                        else {
                            clr = wijmo.Color.fromHsb(hsb[0], 0.1 + r * 0.2, 1 - r * 0.1);
                        }
                        div.appendChild(this._makePalEntry(clr, 0));
                    }
                    // add color and shades to palette
                    this._ePal.appendChild(div);
                }
            };
            // creates a palette entry with the given color
            ColorPicker.prototype._makePalEntry = function (color, margin) {
                var e = document.createElement('div');
                wijmo.setCss(e, {
                    cursor: 'pointer',
                    backgroundColor: color.toString(),
                    marginBottom: margin ? margin : ''
                });
                e.innerHTML = '&nbsp';
                return e;
            };
            // update color and cursor on all panels
            ColorPicker.prototype._updatePanels = function () {
                var clrHue = wijmo.Color.fromHsb(this._hsb[0], 1, 1, 1), clrSolid = wijmo.Color.fromHsb(this._hsb[0], this._hsb[1], this._hsb[2], 1);
                this._eSB.style.backgroundColor = clrHue.toString();
                this._eAlpha.style.background = 'linear-gradient(to right, transparent 0%, ' + clrSolid.toString() + ' 100%)';
                if (navigator.appVersion.indexOf('MSIE 9') > -1) {
                    this._eAlpha.style.filter = 'progid:DXImageTransform.Microsoft.gradient(startColorstr=#00000000,endColorstr=' + clrSolid.toString() + ', GradientType = 1)';
                }
                this._ePreview.style.backgroundColor = this.value;
                this._cHue.style.top = (this._hsb[0] * 100).toFixed(0) + '%';
                this._cSB.style.left = (this._hsb[1] * 100).toFixed(0) + '%';
                this._cSB.style.top = (100 - this._hsb[2] * 100).toFixed(0) + '%';
                this._cAlpha.style.left = (this._alpha * 100).toFixed(0) + '%';
            };
            // gets the design panel that contains the mouse target
            ColorPicker.prototype._getTargetPanel = function (e) {
                var target = e.target;
                if (wijmo.contains(this._eSB, target))
                    return this._eSB;
                if (wijmo.contains(this._eHue, target))
                    return this._eHue;
                if (wijmo.contains(this._eAlpha, target))
                    return this._eAlpha;
                return null;
            };
            /**
             * Gets or sets the template used to instantiate @see:ColorPicker controls.
             */
            ColorPicker.controlTemplate = '<div style="position:relative;width:100%;height:100%">' +
                '<div style="float:left;width:50%;height:100%;box-sizing:border-box;padding:2px">' +
                '<div wj-part="div-pal">' +
                '<div style="float:left;width:10%;box-sizing:border-box;padding:2px">' +
                '<div style="background-color:black;width:100%">&nbsp;</div>' +
                '<div style="height:6px"></div>' +
                '</div>' +
                '</div>' +
                '<div wj-part="div-text" style="position:absolute;bottom:0px;display:none"></div>' +
                '</div>' +
                '<div style="float:left;width:50%;height:100%;box-sizing:border-box;padding:2px">' +
                '<div wj-part="div-sb" class="wj-colorbox" style="float:left;width:89%;height:89%">' +
                '<div style="position:absolute;width:100%;height:100%;background:linear-gradient(to right, white 0%,transparent 100%)"></div>' +
                '<div style="position:absolute;width:100%;height:100%;background:linear-gradient(to top, black 0%,transparent 100%)"></div>' +
                '</div>' +
                '<div style="float:left;width:1%;height:89%"></div>' +
                '<div style="float:left;width:10%;height:89%">' +
                '<div wj-part="div-hue" class="wj-colorbox"></div>' +
                '</div>' +
                '<div style="float:left;width:89%;height:1%"></div>' +
                '<div style="float:left;width:89%;height:10%">' +
                '<div style="width:100%;height:100%;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuM4zml1AAAAAcSURBVBhXY/iPBBYgAWpKQGkwgMqDAdUk/v8HAM7Mm6GatDUYAAAAAElFTkSuQmCC)">' +
                '<div wj-part="div-alpha" class="wj-colorbox"></div>' +
                '</div>' +
                '</div>' +
                '<div style="float:left;width:1%;height:10%"></div>' +
                '<div style="float:left;width:10%;height:10%">' +
                '<div wj-part="div-pv" class="wj-colorbox" style="position:static"></div>' +
                '</div>' +
                '</div>' +
                '</div>';
            ColorPicker._tplCursor = '<div style="position:absolute;left:50%;top:50%;width:7px;height:7px;transform:translate(-50%,-50%);border:2px solid #f0f0f0;border-radius:50px;box-shadow:0px 0px 4px 2px #0f0f0f"></div>';
            return ColorPicker;
        }(wijmo.Control));
        input.ColorPicker = ColorPicker;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ColorPicker.js.map