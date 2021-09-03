var wijmo;
(function (wijmo) {
    'use strict';
    /**
     * Represents a color.
     *
     * The @see:Color class parses colors specified as CSS strings and exposes
     * their red, green, blue, and alpha channels as read-write properties.
     *
     * The @see:Color class also provides @see:fromHsb and @see:fromHsl methods
     * for creating colors using the HSB and HSL color models instead of RGB,
     * as well as @see:getHsb and @see:getHsl methods for retrieving the color
     * components using those color models.
     *
     * Finally, the @see:Color class provides an @see:interpolate method that
     * creates colors by interpolating between two colors using the HSL model.
     * This method is especially useful for creating color animations with the
     * @see:animate method.
     */
    var Color = (function () {
        /**
         * Initializes a new @see:Color from a CSS color specification.
         *
         * @param color CSS color specification.
         */
        function Color(color) {
            // fields
            this._r = 0;
            this._g = 0;
            this._b = 0;
            this._a = 1;
            if (color) {
                this._parse(color);
            }
        }
        Object.defineProperty(Color.prototype, "r", {
            /**
             * Gets or sets the red component of this @see:Color,
             * in a range from 0 to 255.
             */
            get: function () {
                return this._r;
            },
            set: function (value) {
                this._r = wijmo.clamp(wijmo.asNumber(value), 0, 255);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "g", {
            /**
             * Gets or sets the green component of this @see:Color,
             * in a range from 0 to 255.
             */
            get: function () {
                return this._g;
            },
            set: function (value) {
                this._g = wijmo.clamp(wijmo.asNumber(value), 0, 255);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "b", {
            /**
             * Gets or sets the blue component of this @see:Color,
             * in a range from 0 to 255.
             */
            get: function () {
                return this._b;
            },
            set: function (value) {
                this._b = wijmo.clamp(wijmo.asNumber(value), 0, 255);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "a", {
            /**
             * Gets or sets the alpha component of this @see:Color,
             * in a range from 0 to 1 (zero is transparent, one is solid).
             */
            get: function () {
                return this._a;
            },
            set: function (value) {
                this._a = wijmo.clamp(wijmo.asNumber(value), 0, 1);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns true if a @see:Color has the same value as this @see:Color.
         *
         * @param clr @see:Color to compare to this @see:Color.
         */
        Color.prototype.equals = function (clr) {
            return (clr instanceof Color) &&
                this.r == clr.r && this.g == clr.g && this.b == clr.b &&
                this.a == clr.a;
        };
        /**
         * Gets a string representation of this @see:Color.
         */
        Color.prototype.toString = function () {
            var a = Math.round(this.a * 100);
            return a > 99
                ? '#' + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1)
                : 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + (a / 100) + ')';
        };
        /**
         * Creates a new @see:Color using the specified RGBA color channel values.
         *
         * @param r Value for the red channel, from 0 to 255.
         * @param g Value for the green channel, from 0 to 255.
         * @param b Value for the blue channel, from 0 to 255.
         * @param a Value for the alpha channel, from 0 to 1.
         */
        Color.fromRgba = function (r, g, b, a) {
            if (a === void 0) { a = 1; }
            var c = new Color(null);
            c.r = Math.round(wijmo.clamp(wijmo.asNumber(r), 0, 255));
            c.g = Math.round(wijmo.clamp(wijmo.asNumber(g), 0, 255));
            c.b = Math.round(wijmo.clamp(wijmo.asNumber(b), 0, 255));
            c.a = wijmo.clamp(wijmo.asNumber(a), 0, 1);
            return c;
        };
        /**
         * Creates a new @see:Color using the specified HSB values.
         *
         * @param h Hue value, from 0 to 1.
         * @param s Saturation value, from 0 to 1.
         * @param b Brightness value, from 0 to 1.
         * @param a Alpha value, from 0 to 1.
         */
        Color.fromHsb = function (h, s, b, a) {
            if (a === void 0) { a = 1; }
            var rgb = Color._hsbToRgb(wijmo.clamp(wijmo.asNumber(h), 0, 1), wijmo.clamp(wijmo.asNumber(s), 0, 1), wijmo.clamp(wijmo.asNumber(b), 0, 1));
            return Color.fromRgba(rgb[0], rgb[1], rgb[2], a);
        };
        /**
         * Creates a new @see:Color using the specified HSL values.
         *
         * @param h Hue value, from 0 to 1.
         * @param s Saturation value, from 0 to 1.
         * @param l Lightness value, from 0 to 1.
         * @param a Alpha value, from 0 to 1.
         */
        Color.fromHsl = function (h, s, l, a) {
            if (a === void 0) { a = 1; }
            var rgb = Color._hslToRgb(wijmo.clamp(wijmo.asNumber(h), 0, 1), wijmo.clamp(wijmo.asNumber(s), 0, 1), wijmo.clamp(wijmo.asNumber(l), 0, 1));
            return Color.fromRgba(rgb[0], rgb[1], rgb[2], a);
        };
        /**
         * Creates a new @see:Color from a CSS color string.
         *
         * @param value String containing a CSS color specification.
         * @return A new @see:Color, or null if the string cannot be parsed into a color.
         */
        Color.fromString = function (value) {
            var c = new Color(null);
            return c._parse(wijmo.asString(value)) ? c : null;
        };
        /**
         * Gets an array with this color's HSB components.
         */
        Color.prototype.getHsb = function () {
            return Color._rgbToHsb(this.r, this.g, this.b);
        };
        /**
         * Gets an array with this color's HSL components.
         */
        Color.prototype.getHsl = function () {
            return Color._rgbToHsl(this.r, this.g, this.b);
        };
        /**
         * Creates a @see:Color by interpolating between two colors.
         *
         * @param c1 First color.
         * @param c2 Second color.
         * @param pct Value between zero and one that determines how close the
         * interpolation should be to the second color.
         */
        Color.interpolate = function (c1, c2, pct) {
            // sanity
            pct = wijmo.clamp(wijmo.asNumber(pct), 0, 1);
            // convert rgb to hsl
            var h1 = Color._rgbToHsl(c1.r, c1.g, c1.b), h2 = Color._rgbToHsl(c2.r, c2.g, c2.b);
            // interpolate
            var qct = 1 - pct, alpha = c1.a * qct + c2.a * pct, h3 = [
                h1[0] * qct + h2[0] * pct,
                h1[1] * qct + h2[1] * pct,
                h1[2] * qct + h2[2] * pct
            ];
            // convert back to rgb
            var rgb = Color._hslToRgb(h3[0], h3[1], h3[2]);
            return Color.fromRgba(rgb[0], rgb[1], rgb[2], alpha);
        };
        /**
         * Gets the closest opaque color to a given color.
         *
         * @param c @see:Color to be converted to an opaque color
         * (the color may also be specified as a string).
         * @param bkg Background color to use when removing the transparency
         * (defaults to white).
         */
        Color.toOpaque = function (c, bkg) {
            // get color
            c = wijmo.isString(c) ? Color.fromString(c) : wijmo.asType(c, Color);
            // no alpha? no work
            if (c.a == 1)
                return c;
            // get background
            bkg = bkg == null ? Color.fromRgba(255, 255, 255, 1) :
                wijmo.isString(bkg) ? Color.fromString(bkg) :
                    wijmo.asType(bkg, Color);
            // interpolate in RGB space
            var p = c.a, q = 1 - p;
            return Color.fromRgba(c.r * p + bkg.r * q, c.g * p + bkg.g * q, c.b * p + bkg.b * q);
        };
        // ** implementation
        // parses a color string into r/b/g/a
        Color.prototype._parse = function (c) {
            // case-insensitive
            c = c.toLowerCase();
            // 'transparent' is a special case:
            // https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
            if (c == 'transparent') {
                this._r = this._g = this._b = this._a = 0;
                return true;
            }
            // let browser parse stuff we don't handle
            if (c && c.indexOf('#') != 0 && c.indexOf('rgb') != 0 && c.indexOf('hsl') != 0) {
                var e = document.createElement('div');
                e.style.color = c;
                var cc = e.style.color;
                if (cc == c) {
                    cc = window.getComputedStyle(e).color; // then get computed style
                    if (!cc) {
                        document.body.appendChild(e); // then add element to document
                        cc = window.getComputedStyle(e).color; // and try again
                        document.body.removeChild(e);
                    }
                }
                c = cc.toLowerCase();
            }
            // parse #RGB/#RRGGBB
            if (c.indexOf('#') == 0) {
                if (c.length == 4) {
                    this.r = parseInt(c[1] + c[1], 16);
                    this.g = parseInt(c[2] + c[2], 16);
                    this.b = parseInt(c[3] + c[3], 16);
                    this.a = 1;
                    return true;
                }
                else if (c.length == 7) {
                    this.r = parseInt(c.substr(1, 2), 16);
                    this.g = parseInt(c.substr(3, 2), 16);
                    this.b = parseInt(c.substr(5, 2), 16);
                    this.a = 1;
                    return true;
                }
                return false;
            }
            // parse rgb/rgba
            if (c.indexOf('rgb') == 0) {
                var op = c.indexOf('('), ep = c.indexOf(')');
                if (op > -1 && ep > -1) {
                    var p = c.substr(op + 1, ep - (op + 1)).split(',');
                    if (p.length > 2) {
                        this.r = parseInt(p[0]);
                        this.g = parseInt(p[1]);
                        this.b = parseInt(p[2]);
                        this.a = p.length > 3 ? parseFloat(p[3]) : 1;
                        return true;
                    }
                }
            }
            // parse hsl/hsla
            if (c.indexOf('hsl') == 0) {
                var op = c.indexOf('('), ep = c.indexOf(')');
                if (op > -1 && ep > -1) {
                    var p = c.substr(op + 1, ep - (op + 1)).split(',');
                    if (p.length > 2) {
                        var h = parseInt(p[0]) / 360, s = parseInt(p[1]), l = parseInt(p[2]);
                        if (p[1].indexOf('%') > -1)
                            s /= 100;
                        if (p[2].indexOf('%') > -1)
                            l /= 100;
                        var rgb = Color._hslToRgb(h, s, l);
                        this.r = rgb[0];
                        this.g = rgb[1];
                        this.b = rgb[2];
                        this.a = p.length > 3 ? parseFloat(p[3]) : 1;
                        return true;
                    }
                }
            }
            // failed to parse
            return false;
        };
        /**
         * Converts an HSL color value to RGB.
         *
         * @param h The hue (between zero and one).
         * @param s The saturation (between zero and one).
         * @param l The lightness (between zero and one).
         * @return An array containing the R, G, and B values (between zero and 255).
         */
        Color._hslToRgb = function (h, s, l) {
            wijmo.assert(h >= 0 && h <= 1 && s >= 0 && s <= 1 && l >= 0 && l <= 1, 'bad HSL values');
            var r, g, b;
            if (s == 0) {
                r = g = b = l; // achromatic
            }
            else {
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = Color._hue2rgb(p, q, h + 1 / 3);
                g = Color._hue2rgb(p, q, h);
                b = Color._hue2rgb(p, q, h - 1 / 3);
            }
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        };
        Color._hue2rgb = function (p, q, t) {
            if (t < 0)
                t += 1;
            if (t > 1)
                t -= 1;
            if (t < 1 / 6)
                return p + (q - p) * 6 * t;
            if (t < 1 / 2)
                return q;
            if (t < 2 / 3)
                return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        /**
         * Converts an RGB color value to HSL.
         *
         * @param r The value of the red channel (between zero and 255).
         * @param g The value of the green channel (between zero and 255).
         * @param b The value of the blue channel (between zero and 255).
         * @return An array containing the H, S, and L values (between zero and one).
         */
        Color._rgbToHsl = function (r, g, b) {
            wijmo.assert(r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255, 'bad RGB values');
            r /= 255, g /= 255, b /= 255;
            var max = Math.max(r, g, b), min = Math.min(r, g, b), h, s, l = (max + min) / 2;
            if (max == min) {
                h = s = 0;
            }
            else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    case b:
                        h = (r - g) / d + 4;
                        break;
                }
                h /= 6;
            }
            return [h, s, l];
        };
        /**
         * Converts an RGB color value to HSB.
         *
         * @param r The value of the red channel (between zero and 255).
         * @param g The value of the green channel (between zero and 255).
         * @param b The value of the blue channel (between zero and 255).
         * @return An array containing the H, S, and B values (between zero and one).
         */
        Color._rgbToHsb = function (r, g, b) {
            wijmo.assert(r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255, 'bad RGB values');
            var hsl = Color._rgbToHsl(r, g, b);
            return Color._hslToHsb(hsl[0], hsl[1], hsl[2]);
        };
        /**
         * Converts an HSB color value to RGB.
         *
         * @param h The hue (between zero and one).
         * @param s The saturation (between zero and one).
         * @param b The brightness (between zero and one).
         * @return An array containing the R, G, and B values (between zero and 255).
         */
        Color._hsbToRgb = function (h, s, b) {
            //assert(h >= 0 && h <= 1 && s >= 0 && s <= 1 && b >= 0 && b <= 1, 'bad HSB values');
            var hsl = Color._hsbToHsl(h, s, b);
            return Color._hslToRgb(hsl[0], hsl[1], hsl[2]);
        };
        /**
         * Converts an HSB color value to HSL.
         *
         * @param h The hue (between zero and one).
         * @param s The saturation (between zero and one).
         * @param b The brightness (between zero and one).
         * @return An array containing the H, S, and L values (between zero and one).
         */
        Color._hsbToHsl = function (h, s, b) {
            wijmo.assert(h >= 0 && h <= 1 && s >= 0 && s <= 1 && b >= 0 && b <= 1, 'bad HSB values');
            var ll = wijmo.clamp(b * (2 - s) / 2, 0, 1), div = 1 - Math.abs(2 * ll - 1), ss = wijmo.clamp(div > 0 ? b * s / div : s /*0*/, 0, 1);
            wijmo.assert(!isNaN(ll) && !isNaN(ss), 'bad conversion to HSL');
            return [h, ss, ll];
        };
        /**
         * Converts an HSL color value to HSB.
         *
         * @param h The hue (between zero and one).
         * @param s The saturation (between zero and one).
         * @param l The lightness (between zero and one).
         * @return An array containing the H, S, and B values (between zero and one).
         */
        Color._hslToHsb = function (h, s, l) {
            wijmo.assert(h >= 0 && h <= 1 && s >= 0 && s <= 1 && l >= 0 && l <= 1, 'bad HSL values');
            var bb = wijmo.clamp(l == 1 ? 1 : (2 * l + s * (1 - Math.abs(2 * l - 1))) / 2, 0, 1);
            var ss = wijmo.clamp(bb > 0 ? 2 * (bb - l) / bb : s /*0*/, 0, 1);
            wijmo.assert(!isNaN(bb) && !isNaN(ss), 'bad conversion to HSB');
            return [h, ss, bb];
        };
        return Color;
    }());
    wijmo.Color = Color;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Color.js.map