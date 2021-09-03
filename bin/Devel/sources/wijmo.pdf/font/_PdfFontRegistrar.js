var wijmo;
(function (wijmo) {
    var pdf;
    (function (pdf) {
        'use strict';
        var _OrderedDictionary = (function () {
            function _OrderedDictionary(values) {
                this._values = [];
                this._keys = {};
                if (values) {
                    for (var i = 0; i < values.length; i++) {
                        var val = values[i];
                        this._keys[val.key] = i;
                        this._values.push({ key: val.key, value: val.value });
                    }
                }
            }
            _OrderedDictionary.prototype.hasKey = function (key) {
                var idx = this._keys[key];
                if (idx !== undefined) {
                    return this._values[idx].value;
                }
                return null;
            };
            _OrderedDictionary.prototype.add = function (key, value) {
                if (!this.hasKey(key)) {
                    this._keys[key] = this._values.length;
                    this._values.push({ key: key, value: value });
                    return value;
                }
                return null;
            };
            _OrderedDictionary.prototype.each = function (fn) {
                if (fn) {
                    for (var i = 0; i < this._values.length; i++) {
                        var val = this._values[i];
                        if (fn(val.key, val.value) === false) {
                            break;
                        }
                    }
                }
            };
            _OrderedDictionary.prototype.eachReverse = function (fn) {
                if (fn) {
                    for (var i = this._values.length - 1; i >= 0; i--) {
                        var val = this._values[i];
                        if (fn(val.key, val.value) === false) {
                            break;
                        }
                    }
                }
            };
            return _OrderedDictionary;
        }());
        /* Provides font registration functionality. */
        var _PdfFontRegistrar = (function () {
            /*
             * Initializes a new instance of the @see:_PdfFontRegistrar class.
             *
             * @param doc A PDFDocument object.
             */
            function _PdfFontRegistrar(doc) {
                var _this = this;
                // standard fonts, starting from the specific one
                this._fonts = new _OrderedDictionary([
                    {
                        key: 'zapfdingbats',
                        value: {
                            attributes: {
                                fantasy: true
                            },
                            normal: {
                                400: 'ZapfDingbats'
                            }
                        }
                    },
                    {
                        key: 'symbol',
                        value: {
                            attributes: {
                                serif: true
                            },
                            normal: {
                                400: 'Symbol'
                            }
                        }
                    },
                    {
                        key: 'courier',
                        value: {
                            attributes: {
                                serif: true,
                                monospace: true
                            },
                            normal: {
                                400: 'Courier',
                                700: 'Courier-Bold'
                            },
                            oblique: {
                                400: 'Courier-Oblique',
                                700: 'Courier-BoldOblique'
                            }
                        }
                    },
                    {
                        key: 'helvetica',
                        value: {
                            attributes: {
                                sansSerif: true
                            },
                            normal: {
                                400: 'Helvetica',
                                700: 'Helvetica-Bold'
                            },
                            oblique: {
                                400: 'Helvetica-Oblique',
                                700: 'Helvetica-BoldOblique'
                            }
                        }
                    },
                    {
                        key: 'times',
                        value: {
                            attributes: {
                                serif: true
                            },
                            normal: {
                                400: 'Times-Roman',
                                700: 'Times-Bold'
                            },
                            italic: {
                                400: 'Times-Italic',
                                700: 'Times-BoldItalic'
                            }
                        }
                    }
                ]);
                this._weightNameToNum = {
                    'normal': 400,
                    'bold': 700
                };
                this._findFontCache = {};
                this._internalFontNames = {}; // stores all internal names of the registered fonts.
                this._doc = doc;
                // fill _internalFontNames
                this._fonts.each(function (key, value) {
                    var facesIterator = function (descr) {
                        for (var key in descr) {
                            _this._internalFontNames[descr[key]] = 1;
                        }
                    };
                    facesIterator(value.normal) || facesIterator(value.italic) || facesIterator(value.oblique);
                });
            }
            /*
             * Registers a font from ArrayBuffer.
             *
             * @param font A font to register.
             *
             * @return A PDFKit internal font name.
             */
            _PdfFontRegistrar.prototype.registerFont = function (font) {
                wijmo.assert(!!font, pdf._Errors.ValueCannotBeEmpty('font'));
                wijmo.asString(font.name);
                wijmo.assert(font.source instanceof ArrayBuffer, pdf._Errors.FontSourceMustBeArrayBuffer);
                font = pdf._shallowCopy(font);
                var ns = this._normalizeFontSelector(font.name, font.style, font.weight), fntDscr = this._fonts.hasKey(ns.name);
                if (!fntDscr) {
                    fntDscr = this._fonts.add(ns.name, { attributes: font });
                }
                var face = fntDscr[ns.style];
                if (!face) {
                    face = fntDscr[ns.style] = {};
                }
                var internalName = this._makeInternalName(ns);
                if (!face[ns.weight]) {
                    this._doc.registerFont(internalName, font.source, font.family);
                    this._findFontCache = {};
                    face[ns.weight] = internalName;
                    this._internalFontNames[internalName] = 1;
                }
                return internalName;
            };
            /*
             * Finds the closest registered font for a given font name, style and weight.
             *
             * If exact font with given style and weight properties is not found then,
             * it tries to search the closest font using font weight fallback
             * (https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight).
             * If still nothing is found, it tries to find the closest font with other style in
             * the following order:
             * 'italic': 'oblique', 'normal'.
             * 'oblique': 'italic', 'normal'.
             * 'normal': 'oblique', 'italic'.
             *
             * @param name The name of the font that was registered before using the @see:registerFont
             * or the name of one of the PDF standard fonts: 'courier', 'helvetica', 'symbol', 'times',
             * 'zapfdingbats', or the superfamily name: 'cursive', 'fantasy', 'monospace', 'serif',
             * 'sans-serif'.
             * @param style The style of the font. One of the following values: 'normal',
             * 'italic', 'oblique'.
             * @param weight The weight of the font. One of the following values: 'normal',
             * 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'.
             * @return A PDFKit internal font name or null.
             */
            _PdfFontRegistrar.prototype.findFont = function (name, style, weight) {
                var ns = this._normalizeFontSelector(name, style, weight), internalName = this._makeInternalName(ns);
                if (this._findFontCache[internalName]) {
                    return this._findFontCache[internalName];
                }
                ns.name += ',' + pdf.PdfFont._DEF_FAMILY_NAME; // Try to use the default font family with the same style and weight if specifed font will not be found.
                for (var i = 0, names = ns.name.split(','); i < names.length; i++) {
                    var tmp = this._findFont(names[i].replace(/["']/g, '').trim(), ns.style, ns.weight);
                    if (tmp) {
                        return this._findFontCache[internalName] = tmp;
                    }
                }
                return this._findFontCache[internalName] = this._internalFontNames[name]
                    ? name
                    : pdf.PdfFont._DEF_NATIVE_NAME; // use default name if closest font can not be found
            };
            _PdfFontRegistrar.prototype._normalizeFontSelector = function (name, style, weight) {
                return {
                    name: (name || '').toLowerCase(),
                    style: (style || pdf.PdfFont._DEF_FONT.style).toLowerCase(),
                    weight: parseInt(this._weightNameToNum[weight] || weight) || parseInt(this._weightNameToNum[pdf.PdfFont._DEF_FONT.weight])
                };
            };
            _PdfFontRegistrar.prototype._findFont = function (name, style, weight) {
                var _this = this;
                var facesToTest = [], res;
                switch (style) {
                    // setup fallback font styles
                    case 'italic':
                        facesToTest = ['italic', 'oblique', 'normal'];
                        break;
                    case 'oblique':
                        facesToTest = ['oblique', 'italic', 'normal'];
                        break;
                    default:
                        facesToTest = ['normal', 'oblique', 'italic'];
                        break;
                }
                switch (name) {
                    case 'cursive':
                    case 'fantasy':
                    case 'monospace':
                    case 'serif':
                    case 'sans-serif':
                        // try to find closest font within the given font superfamily using font-weight and font-style fallbacks if necessary.
                        this._fonts.eachReverse(function (key, font) {
                            var propName = (name === 'sans-serif') ? 'sansSerif' : name;
                            if (font.attributes[propName]) {
                                for (var i = 0; i < facesToTest.length; i++) {
                                    res = _this._findFontWeightFallback(key, facesToTest[i], weight);
                                    if (res) {
                                        return false; // break the loop
                                    }
                                }
                            }
                        });
                        break;
                    default:
                        if (this._fonts.hasKey(name)) {
                            // try to find closest font within the given font family (name) using font-weight and font-style fallbacks if necessary.
                            for (var i = 0; i < facesToTest.length && !res; i++) {
                                res = this._findFontWeightFallback(name, facesToTest[i], weight);
                            }
                        }
                }
                return res;
            };
            _PdfFontRegistrar.prototype._findFontWeightFallback = function (name, style, weight, availableWeights) {
                var font = this._fonts.hasKey(name);
                if (font && font[style]) {
                    var weights = font[style];
                    if (weights[weight]) {
                        return weights[weight];
                    }
                    else {
                        // font-weight fallback (https://www.w3.org/TR/2016/WD-CSS22-20160412/fonts.html#font-boldness)
                        if (!availableWeights) {
                            availableWeights = [];
                            for (var key in weights) {
                                availableWeights.push(parseFloat(key));
                            }
                            availableWeights.sort(function (a, b) { return a - b; });
                        }
                        if (weight > 500) {
                            var less = 0;
                            for (var i = 0; i < availableWeights.length; i++) {
                                var cur = availableWeights[i];
                                if (cur > weight) {
                                    return weights[cur];
                                }
                                else {
                                    less = cur;
                                }
                            }
                            if (less) {
                                return weights[less];
                            }
                        }
                        else {
                            if (weight < 400) {
                                var greater = 0;
                                for (var i = availableWeights.length - 1; i >= 0; i--) {
                                    var cur = availableWeights[i];
                                    if (cur < weight) {
                                        return weights[cur];
                                    }
                                    else {
                                        greater = cur;
                                    }
                                }
                                if (greater) {
                                    return weights[greater];
                                }
                            }
                            else {
                                if (weight == 400) {
                                    if (weights[500]) {
                                        return weights[500];
                                    }
                                    else {
                                        return this._findFontWeightFallback(name, style, 300, availableWeights);
                                    }
                                }
                                else {
                                    if (weights[400]) {
                                        return weights[400];
                                    }
                                    else {
                                        return this._findFontWeightFallback(name, style, 300, availableWeights);
                                    }
                                }
                            }
                        }
                    }
                }
                return null;
            };
            _PdfFontRegistrar.prototype._makeInternalName = function (ns) {
                return ns.name + '-' + ns.style + '-' + ns.weight;
            };
            return _PdfFontRegistrar;
        }());
        pdf._PdfFontRegistrar = _PdfFontRegistrar;
    })(pdf = wijmo.pdf || (wijmo.pdf = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_PdfFontRegistrar.js.map