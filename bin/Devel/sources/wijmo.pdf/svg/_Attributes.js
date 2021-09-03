var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var pdf;
    (function (pdf) {
        'use strict';
        //#region Basic attributes
        (function (_SvgNumConversion) {
            _SvgNumConversion[_SvgNumConversion["Default"] = 1] = "Default";
            _SvgNumConversion[_SvgNumConversion["None"] = 2] = "None";
            _SvgNumConversion[_SvgNumConversion["Px"] = 3] = "Px"; // always treat value as a 'px', unit identifier is not allowed
        })(pdf._SvgNumConversion || (pdf._SvgNumConversion = {}));
        var _SvgNumConversion = pdf._SvgNumConversion;
        (function (_SvgLengthContext) {
            _SvgLengthContext[_SvgLengthContext["Width"] = 1] = "Width";
            _SvgLengthContext[_SvgLengthContext["Height"] = 2] = "Height";
            _SvgLengthContext[_SvgLengthContext["Other"] = 3] = "Other";
        })(pdf._SvgLengthContext || (pdf._SvgLengthContext = {}));
        var _SvgLengthContext = pdf._SvgLengthContext;
        (function (_SvgAttrType) {
            _SvgAttrType[_SvgAttrType["Number"] = 1] = "Number";
            _SvgAttrType[_SvgAttrType["String"] = 2] = "String";
        })(pdf._SvgAttrType || (pdf._SvgAttrType = {}));
        var _SvgAttrType = pdf._SvgAttrType;
        var _SvgAttr = (function () {
            function _SvgAttr(owner, propName, propType, defValue, nc, lCtx, inheritable) {
                if (defValue === void 0) { defValue = undefined; }
                if (nc === void 0) { nc = _SvgNumConversion.Default; }
                if (lCtx === void 0) { lCtx = _SvgLengthContext.Other; }
                if (inheritable === void 0) { inheritable = false; }
                wijmo.assert(!!owner, pdf._Errors.ValueCannotBeEmpty('owner'));
                wijmo.assert(!!propName, pdf._Errors.ValueCannotBeEmpty('propName'));
                this._owner = owner;
                this._propName = propName;
                this._propType = propType;
                this._defValue = defValue;
                this._inheritable = inheritable;
                this._nc = nc;
                this._pCtx = lCtx;
                this._searchValue = true;
            }
            _SvgAttr.parseValue = function (value, attrType, viewPort, lCtx, numConv) {
                if (value == null) {
                    return value;
                }
                // some attributes can have both numerical and string values (font-size)
                if (attrType & _SvgAttrType.Number) {
                    var numVal, unitType;
                    if (typeof (value) === 'number') {
                        numVal = value;
                    }
                    else {
                        var match = value.match(/^([\+-]?[\d\.]+)(em|ex|px|pt|pc|cm|mm|in|%)?$/);
                        if (match) {
                            numVal = parseFloat(match[1]);
                            unitType = match[2];
                        }
                    }
                    if (numVal != null && numVal === numVal) {
                        if (numConv !== _SvgNumConversion.Default) {
                            wijmo.assert(!unitType, pdf._Errors.InvalidFormat(value));
                            if (numConv === _SvgNumConversion.None) {
                                return numVal;
                            }
                        }
                        // convert to pt
                        switch (unitType) {
                            case 'mm':
                                return numVal * 72 / 25.4;
                            case 'cm':
                                return numVal * 72 / 2.54;
                            case 'in':
                                return numVal * 72;
                            case 'pt':
                                return numVal;
                            case 'pc':
                                return numVal * 12;
                            case '%':
                                switch (lCtx) {
                                    case _SvgLengthContext.Height:
                                        numVal *= viewPort.height / 100;
                                        break;
                                    case _SvgLengthContext.Width:
                                        numVal *= viewPort.width / 100;
                                        break;
                                    case _SvgLengthContext.Other:
                                        numVal *= (Math.sqrt(viewPort.width * viewPort.width + viewPort.height * viewPort.height) / Math.sqrt(2)) / 100;
                                        break;
                                }
                                return numVal;
                            case 'px':
                            default:
                                return numVal * 0.75;
                        }
                    }
                }
                if (attrType & _SvgAttrType.String) {
                    return value + '';
                }
                wijmo.assert(false, pdf._Errors.InvalidFormat(value));
            };
            Object.defineProperty(_SvgAttr.prototype, "hasVal", {
                get: function () {
                    return this._val != null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SvgAttr.prototype, "val", {
                get: function () {
                    if (this._val != null) {
                        return this._val;
                    }
                    else {
                        return this._parse(this._defValue);
                    }
                },
                set: function (value) {
                    this._searchValue = false;
                    this._value = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SvgAttr.prototype, "_val", {
                get: function () {
                    if (this._searchValue) {
                        this._searchValue = false;
                        var value;
                        for (var p = this._owner; p; p = p.parent) {
                            value = p.attr(this._propName);
                            if (!(this._inheritable && (value == null || value == 'inherit'))) {
                                break;
                            }
                        }
                        this._value = (value === 'inherit') ? undefined : this._parse(value);
                    }
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            _SvgAttr.prototype.reset = function () {
                this._value = undefined;
                this._searchValue = true;
            };
            _SvgAttr.prototype._parse = function (value, nc) {
                var value = _SvgAttr.parseValue(value, this._propType, this._owner.viewport, this._pCtx, nc || this._nc);
                return value;
            };
            return _SvgAttr;
        }());
        pdf._SvgAttr = _SvgAttr;
        var _SvgNumAttr = (function (_super) {
            __extends(_SvgNumAttr, _super);
            function _SvgNumAttr(owner, propName, defValue, nc, pCtx, inheritable) {
                if (defValue === void 0) { defValue = undefined; }
                if (nc === void 0) { nc = _SvgNumConversion.Default; }
                if (pCtx === void 0) { pCtx = _SvgLengthContext.Other; }
                _super.call(this, owner, propName, _SvgAttrType.Number, defValue, nc, pCtx, inheritable);
            }
            return _SvgNumAttr;
        }(_SvgAttr));
        pdf._SvgNumAttr = _SvgNumAttr;
        var _SvgStrAttr = (function (_super) {
            __extends(_SvgStrAttr, _super);
            function _SvgStrAttr(owner, propName, defValue, inheritable) {
                _super.call(this, owner, propName, _SvgAttrType.String, defValue, undefined, undefined, inheritable);
            }
            return _SvgStrAttr;
        }(_SvgAttr));
        pdf._SvgStrAttr = _SvgStrAttr;
        //#endregion Basic attributes
        var _SvgColorAttr = (function (_super) {
            __extends(_SvgColorAttr, _super);
            function _SvgColorAttr(owner, propName, defValue, inheritable) {
                if (defValue === void 0) { defValue = undefined; }
                if (inheritable === void 0) { inheritable = true; }
                _super.call(this, owner, propName, _SvgAttrType.String, defValue, _SvgNumConversion.None, _SvgLengthContext.Other, inheritable);
            }
            _SvgColorAttr.prototype._parse = function (value) {
                if (value === '' || value === 'null' || value === 'undefined') {
                    return undefined; // use default value then
                }
                return _super.prototype._parse.call(this, value);
            };
            return _SvgColorAttr;
        }(_SvgAttr));
        pdf._SvgColorAttr = _SvgColorAttr;
        var _SvgDashArrayAttr = (function (_super) {
            __extends(_SvgDashArrayAttr, _super);
            function _SvgDashArrayAttr(owner) {
                _super.call(this, owner, 'stroke-dasharray', _SvgAttrType.Number, undefined, _SvgNumConversion.Px, _SvgLengthContext.Other, true);
            }
            _SvgDashArrayAttr.prototype._parse = function (value) {
                var res, vals = (value || '').trim().split(/[\s,]+/);
                if (vals.length) {
                    res = [];
                    try {
                        for (var i = 0; i < vals.length; i++) {
                            if (vals[i]) {
                                res.push(_super.prototype._parse.call(this, vals[i]));
                            }
                        }
                    }
                    catch (ex) {
                        return undefined;
                    }
                    return res.length ? res : undefined;
                }
                return res;
            };
            return _SvgDashArrayAttr;
        }(_SvgAttr));
        pdf._SvgDashArrayAttr = _SvgDashArrayAttr;
        var _SvgFillRuleAttr = (function (_super) {
            __extends(_SvgFillRuleAttr, _super);
            function _SvgFillRuleAttr(owner, propName) {
                _super.call(this, owner, propName, _SvgAttrType.String, pdf.PdfFillRule.NonZero, undefined, undefined, true);
            }
            _SvgFillRuleAttr.prototype._parse = function (value) {
                if (wijmo.isNumber(value)) {
                    return value;
                }
                else {
                    var match = (value || '').match(/(nonzero|evenodd)/i);
                    if (match) {
                        return match[1] === 'nonzero' ? pdf.PdfFillRule.NonZero : pdf.PdfFillRule.EvenOdd;
                    }
                    return undefined;
                }
            };
            return _SvgFillRuleAttr;
        }(_SvgAttr));
        pdf._SvgFillRuleAttr = _SvgFillRuleAttr;
        // supports attributes like attr="smth" and attr="url(smth)"
        var _SvgHRefAttr = (function (_super) {
            __extends(_SvgHRefAttr, _super);
            function _SvgHRefAttr(owner, propName) {
                _super.call(this, owner, propName);
            }
            _SvgHRefAttr.prototype._parse = function (value) {
                value = (value || '').trim();
                // url(smth) => smth
                var match = value.match(/url\((.+)\)/);
                if (match) {
                    value = match[1].trim();
                }
                // "smth" => smth
                value = value.replace(/["']/g, '');
                return value;
            };
            return _SvgHRefAttr;
        }(_SvgStrAttr));
        pdf._SvgHRefAttr = _SvgHRefAttr;
        // supports attributes like attr="#id" and attr="url(#id)"
        var _SvgIdRefAttr = (function (_super) {
            __extends(_SvgIdRefAttr, _super);
            function _SvgIdRefAttr() {
                _super.apply(this, arguments);
            }
            _SvgIdRefAttr.prototype._parse = function (value) {
                value = _super.prototype._parse.call(this, value);
                // #smth => smth
                if (value && value[0] === '#') {
                    return value.substring(1);
                }
                return undefined;
            };
            return _SvgIdRefAttr;
        }(_SvgHRefAttr));
        pdf._SvgIdRefAttr = _SvgIdRefAttr;
        var _SvgPointsArrayAttr = (function (_super) {
            __extends(_SvgPointsArrayAttr, _super);
            function _SvgPointsArrayAttr(owner, propName) {
                _super.call(this, owner, propName, _SvgAttrType.Number, undefined, _SvgNumConversion.Px);
            }
            _SvgPointsArrayAttr.prototype._parse = function (value) {
                var res, vals = (value || '').trim().split(/[\s,]+/), len = Math.floor(vals.length / 2) * 2;
                if (len) {
                    res = [];
                    try {
                        for (var i = 0; i < len - 1; i = i + 2) {
                            res.push(new wijmo.Point(_super.prototype._parse.call(this, vals[i]), _super.prototype._parse.call(this, vals[i + 1])));
                        }
                    }
                    catch (ex) {
                        return undefined;
                    }
                }
                return res;
            };
            return _SvgPointsArrayAttr;
        }(_SvgAttr));
        pdf._SvgPointsArrayAttr = _SvgPointsArrayAttr;
        var _SvgTransformAttr = (function (_super) {
            __extends(_SvgTransformAttr, _super);
            function _SvgTransformAttr(owner) {
                _super.call(this, owner, 'transform', _SvgAttrType.Number, undefined, _SvgNumConversion.None);
            }
            _SvgTransformAttr.prototype.apply = function (element) {
                var area = element.ctx.area;
                if (this.hasVal) {
                    this.val.forEach(function (item) {
                        item(area);
                    });
                }
            };
            _SvgTransformAttr.prototype._parse = function (value) {
                var _this = this;
                var res = [], match = (value || '').match(/((matrix|translate|scale|rotate|skewX|skewY)\([^\)]+\))+/g);
                if (match) {
                    for (var i = 0; i < match.length; i++) {
                        var item = match[i], sgnr = item.match(/(\w+)\(([^\)]+)\)/), args = [];
                        try {
                            sgnr[2].trim().split(/[\s,]+/).forEach(function (numStr) {
                                if (numStr) {
                                    args.push(_super.prototype._parse.call(_this, numStr, _SvgNumConversion.None));
                                }
                            });
                        }
                        catch (ex) {
                            return undefined;
                        }
                        if (args.length) {
                            // replace closures with bind?
                            switch (sgnr[1]) {
                                case 'matrix':
                                    res.push((function (a, b, c, d, e, f) {
                                        return function (area) {
                                            area.transform(a, b, c, d, e, f);
                                        };
                                    })(args[0], args[1], args[2], args[3], _super.prototype._parse.call(this, args[4], _SvgNumConversion.Px), _super.prototype._parse.call(this, args[5], _SvgNumConversion.Px)));
                                    break;
                                case 'translate':
                                    res.push((function (x, y) {
                                        return function (area) {
                                            area.translate(x, y);
                                        };
                                    })(_super.prototype._parse.call(this, args[0], _SvgNumConversion.Px), _super.prototype._parse.call(this, args[1] || 0, _SvgNumConversion.Px)));
                                    break;
                                case 'scale':
                                    res.push((function (xFactor, yFactor) {
                                        return function (area) {
                                            area.scale(xFactor, yFactor);
                                        };
                                    })(args[0], args[1]));
                                    break;
                                case 'rotate':
                                    res.push((function (angle, point) {
                                        return function (area) {
                                            area.rotate(angle, point);
                                        };
                                    })(args[0], new wijmo.Point(_super.prototype._parse.call(this, args[1] || 0, _SvgNumConversion.Px), _super.prototype._parse.call(this, args[2] || 0, _SvgNumConversion.Px))));
                                    break;
                                case 'skewX':
                                    res.push((function (angle) {
                                        return function (area) {
                                            area.transform(1, 0, angle, 1, 0, 0);
                                        };
                                    })(Math.tan(args[0] * Math.PI / 180)));
                                    break;
                                case 'skewY':
                                    res.push((function (angle) {
                                        return function (area) {
                                            area.transform(1, angle, 0, 1, 0, 0);
                                        };
                                    })(Math.tan(args[0] * Math.PI / 180)));
                                    break;
                            }
                        }
                    }
                }
                return res.length ? res : undefined;
            };
            return _SvgTransformAttr;
        }(_SvgAttr));
        pdf._SvgTransformAttr = _SvgTransformAttr;
        var _SvgTextDecorationAttr = (function (_super) {
            __extends(_SvgTextDecorationAttr, _super);
            function _SvgTextDecorationAttr(owner) {
                _super.call(this, owner, 'text-decoration', _SvgAttrType.String, undefined, _SvgNumConversion.None);
            }
            _SvgTextDecorationAttr.prototype._parse = function (value) {
                var res, vals = (value || '').trim().toLowerCase().split(/[\s,]+/);
                if (vals.length) {
                    res = [];
                    for (var i = 0; i < vals.length; i++) {
                        if (/line-through|overline|underline/.test(vals[i])) {
                            res.push(vals[i]);
                        }
                    }
                }
                return res && res.length ? res : undefined;
            };
            return _SvgTextDecorationAttr;
        }(_SvgAttr));
        pdf._SvgTextDecorationAttr = _SvgTextDecorationAttr;
        var _SvgViewboxAttr = (function (_super) {
            __extends(_SvgViewboxAttr, _super);
            function _SvgViewboxAttr(owner) {
                _super.call(this, owner, 'viewBox', _SvgAttrType.Number, undefined, _SvgNumConversion.Px);
            }
            _SvgViewboxAttr.prototype._parse = function (value) {
                var res, vals = (value || '').trim().split(/[\s,]+/);
                if (vals.length === 4) {
                    res = {
                        minX: _super.prototype._parse.call(this, vals[0]),
                        minY: _super.prototype._parse.call(this, vals[1]),
                        width: _super.prototype._parse.call(this, vals[2]),
                        height: _super.prototype._parse.call(this, vals[3])
                    };
                }
                return res;
            };
            return _SvgViewboxAttr;
        }(_SvgAttr));
        pdf._SvgViewboxAttr = _SvgViewboxAttr;
        var _SvgPreserveAspectRatioAttr = (function (_super) {
            __extends(_SvgPreserveAspectRatioAttr, _super);
            function _SvgPreserveAspectRatioAttr(owner) {
                _super.call(this, owner, 'preserveAspectRatio', _SvgAttrType.Number, 'xMidYMid meet');
            }
            _SvgPreserveAspectRatioAttr.prototype._parse = function (value) {
                var res;
                if (typeof (value) === 'string') {
                    var vals = value.replace(/^defer\s+/, '').trim().split(/\s+/); // skip 'defer', it is used only with images
                    res = {
                        align: vals[0],
                        meet: !vals[1] || (vals[1] === 'meet')
                    };
                }
                else {
                    res = value;
                }
                return res;
            };
            return _SvgPreserveAspectRatioAttr;
        }(_SvgAttr));
        pdf._SvgPreserveAspectRatioAttr = _SvgPreserveAspectRatioAttr;
        // combines both viewBox and preserveAspectRatio attributes
        var _SvgScaleAttributes = (function () {
            function _SvgScaleAttributes(owner) {
                this._owner = owner;
                this.aspect = new _SvgPreserveAspectRatioAttr(this._owner);
                this.viewBox = new _SvgViewboxAttr(this._owner);
            }
            _SvgScaleAttributes.prototype.apply = function (element) {
                var area = element.ctx.area, viewPort = element.viewport, viewBox = this.viewBox.val;
                if (viewPort && viewBox) {
                    if (viewBox.width && viewBox.height) {
                        var ar = this.aspect.val, sx = viewPort.width / viewBox.width, sy = viewPort.height / viewBox.height, sMin = Math.min(sx, sy), sMax = Math.max(sx, sy), uniScaledWidth = viewBox.width * (ar.meet ? sMin : sMax), uniScaledHeight = viewBox.height * (ar.meet ? sMin : sMax);
                        if (ar.align === 'none') {
                            area.scale(sx, sy);
                        }
                        else {
                            var scale = ar.meet ? sMin : sMax, tx = 0, ty = 0;
                            if (ar.align.match(/^xMid/) && (scale === sy)) {
                                tx = viewPort.width / 2 - uniScaledWidth / 2;
                            }
                            else {
                                if (ar.align.match(/^xMax/) && (scale === sy)) {
                                    tx = viewPort.width - uniScaledWidth;
                                }
                            }
                            if (ar.align.match(/YMid$/) && (scale === sx)) {
                                ty = viewPort.height / 2 - uniScaledHeight / 2;
                            }
                            else {
                                if (ar.align.match(/YMax$/) && (scale === sx)) {
                                    ty = viewPort.height - uniScaledHeight;
                                }
                            }
                            if (tx || ty) {
                                area.translate(tx, ty);
                            }
                            if (ar.meet) {
                                area.scale(sMin, sMin);
                            }
                            else {
                                area.scale(sMax, sMax);
                            }
                            if (viewBox.minX || viewBox.minY) {
                                area.translate(-viewBox.minX, -viewBox.minY);
                            }
                        }
                    }
                    //return new Size(viewPort.width / sx, viewPort.height / sy);
                    return new wijmo.Size(viewBox.width, viewBox.height); // establish a new viewport.  
                }
                return viewPort;
            };
            return _SvgScaleAttributes;
        }());
        pdf._SvgScaleAttributes = _SvgScaleAttributes;
        // combines all stroking attributes
        var _SvgStrokeAttributes = (function () {
            function _SvgStrokeAttributes(owner) {
                this._owner = owner;
                this.color = new _SvgColorAttr(this._owner, 'stroke', 'none');
                this.dashArray = new _SvgDashArrayAttr(this._owner);
                this.dashOffset = new _SvgNumAttr(this._owner, 'stroke-dashoffset', 0, _SvgNumConversion.Default, _SvgLengthContext.Other, true);
                this.lineCap = new _SvgStrAttr(this._owner, 'stroke-linecap', 'butt', true);
                this.lineJoin = new _SvgStrAttr(this._owner, 'stroke-linejoin', 'miter', true);
                this.miterLimit = new _SvgNumAttr(this._owner, 'stroke-miterlimit', 4, _SvgNumConversion.None, _SvgLengthContext.Other, true);
                this.opacity = new _SvgNumAttr(this._owner, 'stroke-opacity', 1, _SvgNumConversion.None, _SvgLengthContext.Other, true);
                this.width = new _SvgNumAttr(this._owner, 'stroke-width', 1, _SvgNumConversion.Default, _SvgLengthContext.Other, true);
            }
            _SvgStrokeAttributes.prototype.toPen = function () {
                var color = new wijmo.Color(this.color.val);
                if (this.opacity.hasVal) {
                    color.a = this.opacity.val;
                }
                var pen = new pdf.PdfPen(color, this.width.val);
                if (this.dashArray.hasVal) {
                    var dashes = this.dashArray.val;
                    if (dashes.length) {
                        pen.dashPattern = new pdf.PdfDashPattern(dashes[0], dashes.length > 1 ? dashes[1] : undefined, this.dashOffset.val);
                    }
                }
                switch (this.lineCap.val) {
                    case 'butt':
                        pen.cap = pdf.PdfLineCapStyle.Butt;
                        break;
                    case 'round':
                        pen.cap = pdf.PdfLineCapStyle.Round;
                        break;
                    case 'square':
                        pen.cap = pdf.PdfLineCapStyle.Square;
                        break;
                }
                switch (this.lineJoin.val) {
                    case 'miter':
                        pen.join = pdf.PdfLineJoinStyle.Miter;
                        break;
                    case 'round':
                        pen.join = pdf.PdfLineJoinStyle.Round;
                        break;
                    case 'bevel':
                        pen.join = pdf.PdfLineJoinStyle.Bevel;
                        break;
                }
                pen.miterLimit = this.miterLimit.val;
                return pen;
            };
            return _SvgStrokeAttributes;
        }());
        pdf._SvgStrokeAttributes = _SvgStrokeAttributes;
        // combines all the filling attributes
        var _SvgFillAttributes = (function () {
            function _SvgFillAttributes(owner) {
                this._owner = owner;
                this.color = new _SvgColorAttr(this._owner, 'fill', 'black');
                this.opacity = new _SvgNumAttr(this._owner, 'fill-opacity', 1, _SvgNumConversion.None, undefined, true);
                this.rule = new _SvgFillRuleAttr(this._owner, 'fill-rule');
            }
            _SvgFillAttributes.prototype.toBrush = function () {
                var color = new wijmo.Color(this.color.val);
                if (this.opacity.hasVal) {
                    color.a = this.opacity.val;
                }
                return new pdf.PdfSolidBrush(color);
            };
            return _SvgFillAttributes;
        }());
        pdf._SvgFillAttributes = _SvgFillAttributes;
        // combines all of the font attributes
        var _SvgFontAttributes = (function () {
            function _SvgFontAttributes(owner) {
                this._owner = owner;
                this.family = new _SvgStrAttr(this._owner, 'font-family', undefined, true);
                this.size = new _SvgAttr(this._owner, 'font-size', _SvgAttrType.Number | _SvgAttrType.String, 'medium', undefined, _SvgLengthContext.Other, true);
                this.style = new _SvgStrAttr(this._owner, 'font-style', 'normal', true);
                this.weight = new _SvgStrAttr(this._owner, 'font-weight', 'normal', true);
            }
            _SvgFontAttributes.prototype.toFont = function () {
                var size = wijmo.pdf._asPt(this.size.val); // handle string values like 'small', 'medium' etc
                return new pdf.PdfFont(this.family.val, size, this.style.val, this.weight.val);
            };
            return _SvgFontAttributes;
        }());
        pdf._SvgFontAttributes = _SvgFontAttributes;
        var _SvgStyleAttributes = (function () {
            function _SvgStyleAttributes(owner) {
                this._owner = owner;
                this.clipRule = new _SvgFillRuleAttr(this._owner, 'clip-rule');
                this.fill = new _SvgFillAttributes(this._owner);
                this.font = new _SvgFontAttributes(this._owner);
                this.stroke = new _SvgStrokeAttributes(this._owner);
            }
            _SvgStyleAttributes.prototype.apply = function (element, fill, stroke) {
                var area = element.ctx.area;
                if (element.renderMode === pdf._SvgRenderMode.Clip) {
                }
                else {
                    if (fill && stroke && this.fill.color.val !== 'none' && this.stroke.color.val !== 'none') {
                        area.paths.fillAndStroke(this.fill.toBrush(), this.stroke.toPen(), this.fill.rule.val);
                    }
                    else {
                        if (fill && (this.fill.color.val !== 'none')) {
                            area.paths.fill(this.fill.toBrush(), this.fill.rule.val);
                        }
                        else {
                            if (stroke && (this.stroke.color.val !== 'none')) {
                                area.paths.stroke(this.stroke.toPen());
                            }
                            else {
                                area.paths.stroke(wijmo.Color.fromRgba(0, 0, 0, 0));
                            }
                        }
                    }
                }
            };
            return _SvgStyleAttributes;
        }());
        pdf._SvgStyleAttributes = _SvgStyleAttributes;
    })(pdf = wijmo.pdf || (wijmo.pdf = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_Attributes.js.map