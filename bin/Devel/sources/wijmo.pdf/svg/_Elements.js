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
        //#region Base elements
        (function (_SvgRenderMode) {
            _SvgRenderMode[_SvgRenderMode["Render"] = 0] = "Render";
            _SvgRenderMode[_SvgRenderMode["Ignore"] = 1] = "Ignore";
            _SvgRenderMode[_SvgRenderMode["Clip"] = 2] = "Clip";
        })(pdf._SvgRenderMode || (pdf._SvgRenderMode = {}));
        var _SvgRenderMode = pdf._SvgRenderMode;
        var _SvgElementBase = (function () {
            // at the moment the 'node' argument is used ONLY by the _SvgStyleElementImpl class.
            function _SvgElementBase(ctx, node, defRenderMode) {
                if (defRenderMode === void 0) { defRenderMode = _SvgRenderMode.Render; }
                this._children = [];
                this._attributes = {};
                this._defRenderMode = defRenderMode;
                this._ctx = ctx;
            }
            Object.defineProperty(_SvgElementBase.prototype, "children", {
                //#region public
                get: function () {
                    return this._children;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SvgElementBase.prototype, "ctx", {
                get: function () {
                    return this._ctx;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SvgElementBase.prototype, "parent", {
                get: function () {
                    return this._parent;
                },
                set: function (value) {
                    this._parent = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SvgElementBase.prototype, "style", {
                get: function () {
                    if (!this._style) {
                        this._style = new pdf._SvgStyleAttributes(this);
                    }
                    return this._style;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SvgElementBase.prototype, "viewport", {
                get: function () {
                    return this._viewport;
                },
                set: function (value) {
                    this._viewport = value.clone();
                },
                enumerable: true,
                configurable: true
            });
            _SvgElementBase.prototype.attr = function (name, value) {
                name = name.toLowerCase();
                if (arguments.length > 1) {
                    this._attributes[name] = value;
                }
                return this._attributes[name];
            };
            _SvgElementBase.prototype.appendNode = function (node) {
                if (!node || (node === this)) {
                    return;
                }
                if (node.parent !== this) {
                    node.remove();
                    this.children.push(node);
                    node.parent = this;
                }
            };
            _SvgElementBase.prototype.copyAttributesFrom = function (el, except) {
                if (!el) {
                    return;
                }
                var fa = el._attributes, ta = this._attributes;
                for (var key in fa) {
                    if (fa.hasOwnProperty(key) && (ta[key] == null) && (!except || (except.indexOf(key) < 0))) {
                        ta[key] = fa[key];
                    }
                }
            };
            _SvgElementBase.prototype.clone = function () {
                var el = new (Function.prototype.bind.call(this.constructor, null /*this*/, this.ctx, null /*node*/));
                el.copyAttributesFrom(this);
                // clone children
                this._children.forEach(function (item) {
                    el.appendNode(item.clone());
                });
                return el;
            };
            _SvgElementBase.prototype.remove = function () {
                var p = this.parent;
                if (p) {
                    for (var i = 0; i < p.children.length; i++) {
                        if (p.children[i] === this) {
                            p.children.splice(i, 1);
                            break;
                        }
                    }
                    this.parent = null;
                }
            };
            _SvgElementBase.prototype.clearAttr = function (name) {
                delete this._attributes[name.toLowerCase()];
            };
            _SvgElementBase.prototype.render = function (viewPort, renderMode) {
                this._viewport = viewPort.clone();
                if ((this._curRenderMode = renderMode || this._defRenderMode) !== _SvgRenderMode.Ignore) {
                    this._render();
                }
            };
            Object.defineProperty(_SvgElementBase.prototype, "renderMode", {
                get: function () {
                    return this._curRenderMode;
                },
                enumerable: true,
                configurable: true
            });
            //#endregion
            //#region protected
            _SvgElementBase.prototype._render = function () {
                this._renderContent();
            };
            _SvgElementBase.prototype._renderContent = function () {
                for (var i = 0; i < this._children.length; i++) {
                    this._children[i].render(this.viewport, this.renderMode);
                }
            };
            return _SvgElementBase;
        }());
        pdf._SvgElementBase = _SvgElementBase;
        var _SvgClippableElementBase = (function (_super) {
            __extends(_SvgClippableElementBase, _super);
            function _SvgClippableElementBase(ctx, node, defRenderMode) {
                if (defRenderMode === void 0) { defRenderMode = _SvgRenderMode.Render; }
                _super.call(this, ctx, node, defRenderMode);
                this._clipPath = new pdf._SvgIdRefAttr(this, 'clip-path');
            }
            _SvgClippableElementBase.prototype._render = function () {
                var clip, area = this.ctx.area;
                if (this._clipPath.val) {
                    var clipPath = this.ctx.getElement(this._clipPath.val);
                    if (clip = !!(clipPath && (clipPath instanceof _SvgClipPathElementImpl))) {
                        area._pdfdoc.saveState();
                        clipPath.render(this.viewport, _SvgRenderMode.Clip); // force rendering using a clipping mode
                        area.paths.clip(this.style.clipRule.val);
                    }
                }
                _super.prototype._render.call(this);
                if (clip) {
                    area._pdfdoc.restoreState();
                }
            };
            return _SvgClippableElementBase;
        }(_SvgElementBase));
        pdf._SvgClippableElementBase = _SvgClippableElementBase;
        var _SvgTransformableElementBase = (function (_super) {
            __extends(_SvgTransformableElementBase, _super);
            function _SvgTransformableElementBase(ctx, node) {
                _super.call(this, ctx, node);
                this._transform = new pdf._SvgTransformAttr(this);
            }
            _SvgTransformableElementBase.prototype._render = function () {
                var transform = this._transform.hasVal && this.renderMode !== _SvgRenderMode.Clip; // clipping path cannot use tranformations
                if (transform) {
                    this.ctx.area._pdfdoc.saveState();
                    this._transform.apply(this);
                }
                _super.prototype._render.call(this);
                if (transform) {
                    this.ctx.area._pdfdoc.restoreState();
                }
            };
            return _SvgTransformableElementBase;
        }(_SvgClippableElementBase));
        pdf._SvgTransformableElementBase = _SvgTransformableElementBase;
        //#endregion Base elements
        //#region Shape elements
        var _SvgShapeElementBase = (function (_super) {
            __extends(_SvgShapeElementBase, _super);
            function _SvgShapeElementBase() {
                _super.apply(this, arguments);
                this._fill = true;
                this._stroke = true;
            }
            _SvgShapeElementBase.prototype._renderContent = function () {
                //super._renderContent();
                this._draw();
                this.style.apply(this, this._fill, this._stroke);
            };
            _SvgShapeElementBase.prototype._draw = function () {
                wijmo.assert(false, pdf._Errors.AbstractMethod);
            };
            return _SvgShapeElementBase;
        }(_SvgTransformableElementBase));
        pdf._SvgShapeElementBase = _SvgShapeElementBase;
        var _SvgCircleElementImpl = (function (_super) {
            __extends(_SvgCircleElementImpl, _super);
            function _SvgCircleElementImpl() {
                _super.apply(this, arguments);
            }
            _SvgCircleElementImpl.prototype._draw = function () {
                var r = new pdf._SvgNumAttr(this, 'r', 0).val;
                if (r > 0) {
                    var cx = new pdf._SvgNumAttr(this, 'cx', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Width).val, cy = new pdf._SvgNumAttr(this, 'cy', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Height).val;
                    this.ctx.area.paths.circle(cx, cy, r);
                }
            };
            return _SvgCircleElementImpl;
        }(_SvgShapeElementBase));
        pdf._SvgCircleElementImpl = _SvgCircleElementImpl;
        var _SvgEllipseElementImpl = (function (_super) {
            __extends(_SvgEllipseElementImpl, _super);
            function _SvgEllipseElementImpl() {
                _super.apply(this, arguments);
            }
            _SvgEllipseElementImpl.prototype._draw = function () {
                var rx = new pdf._SvgNumAttr(this, 'rx', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Width).val, ry = new pdf._SvgNumAttr(this, 'ry', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Height).val;
                if (rx > 0 && ry > 0) {
                    var cx = new pdf._SvgNumAttr(this, 'cx', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Width).val, cy = new pdf._SvgNumAttr(this, 'cy', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Height).val;
                    this.ctx.area.paths.ellipse(cx, cy, rx, ry);
                }
            };
            return _SvgEllipseElementImpl;
        }(_SvgShapeElementBase));
        pdf._SvgEllipseElementImpl = _SvgEllipseElementImpl;
        var _SvgLineElementImpl = (function (_super) {
            __extends(_SvgLineElementImpl, _super);
            function _SvgLineElementImpl(ctx, node) {
                _super.call(this, ctx, node);
                this._fill = false;
            }
            _SvgLineElementImpl.prototype._draw = function () {
                var x1 = new pdf._SvgNumAttr(this, 'x1', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Width).val, y1 = new pdf._SvgNumAttr(this, 'y1', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Height).val, x2 = new pdf._SvgNumAttr(this, 'x2', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Width).val, y2 = new pdf._SvgNumAttr(this, 'y2', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Height).val;
                this.ctx.area.paths
                    .moveTo(x1, y1)
                    .lineTo(x2, y2);
            };
            return _SvgLineElementImpl;
        }(_SvgShapeElementBase));
        pdf._SvgLineElementImpl = _SvgLineElementImpl;
        var _SvgPathElementImpl = (function (_super) {
            __extends(_SvgPathElementImpl, _super);
            function _SvgPathElementImpl(ctx, node) {
                _super.call(this, ctx, node);
                this._d = new pdf._SvgStrAttr(this, 'd');
            }
            _SvgPathElementImpl.prototype._renderContent = function () {
                var area = this.ctx.area;
                if (this.renderMode === _SvgRenderMode.Clip) {
                    // the element is placed within the "clip-path" element, we can't use scale + saveState\ restoreState here
                    // because it isolates clipping from an element that refers to the "clip-path" element.
                    if (this._d.hasVal) {
                        var path = pdf._PdfSvgPathHelper.scale(this._d.val, 0.75); // px -> pt
                        this.attr('d', path);
                        this._d.reset();
                    }
                    _super.prototype._renderContent.call(this);
                }
                else {
                    area._pdfdoc.saveState();
                    area.scale(0.75); // px -> pt
                    _super.prototype._renderContent.call(this);
                    area._pdfdoc.restoreState();
                }
            };
            _SvgPathElementImpl.prototype._draw = function () {
                if (this._d.hasVal) {
                    this.ctx.area.paths.svgPath(this._d.val);
                }
            };
            return _SvgPathElementImpl;
        }(_SvgShapeElementBase));
        pdf._SvgPathElementImpl = _SvgPathElementImpl;
        var _SvgPolylineElementImpl = (function (_super) {
            __extends(_SvgPolylineElementImpl, _super);
            function _SvgPolylineElementImpl() {
                _super.apply(this, arguments);
            }
            _SvgPolylineElementImpl.prototype._draw = function () {
                var _points = new pdf._SvgPointsArrayAttr(this, 'points');
                if (_points.hasVal) {
                    var points = _points.val, area = this.ctx.area;
                    if (points.length > 1) {
                        for (var i = 0; i < points.length; i++) {
                            if (i == 0) {
                                area.paths.moveTo(points[i].x, points[i].y);
                            }
                            else {
                                area.paths.lineTo(points[i].x, points[i].y);
                            }
                        }
                        return true;
                    }
                }
                return false;
            };
            return _SvgPolylineElementImpl;
        }(_SvgShapeElementBase));
        pdf._SvgPolylineElementImpl = _SvgPolylineElementImpl;
        var _SvgPolygonElementImpl = (function (_super) {
            __extends(_SvgPolygonElementImpl, _super);
            function _SvgPolygonElementImpl() {
                _super.apply(this, arguments);
            }
            _SvgPolygonElementImpl.prototype._draw = function () {
                if (_super.prototype._draw.call(this)) {
                    this.ctx.area.paths.closePath();
                    return true;
                }
                return false;
            };
            return _SvgPolygonElementImpl;
        }(_SvgPolylineElementImpl));
        pdf._SvgPolygonElementImpl = _SvgPolygonElementImpl;
        var _SvgRectElementImpl = (function (_super) {
            __extends(_SvgRectElementImpl, _super);
            function _SvgRectElementImpl() {
                _super.apply(this, arguments);
            }
            _SvgRectElementImpl.prototype._draw = function () {
                var w = new pdf._SvgNumAttr(this, 'width', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Width).val, h = new pdf._SvgNumAttr(this, 'height', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Height).val;
                if (w > 0 && h > 0) {
                    var x = new pdf._SvgNumAttr(this, 'x', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Width).val, y = new pdf._SvgNumAttr(this, 'y', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Height).val, rx = Math.max(new pdf._SvgNumAttr(this, 'rx', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Width).val, 0), ry = Math.max(new pdf._SvgNumAttr(this, 'ry', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Height).val, 0), paths = this.ctx.area.paths;
                    if (rx || ry) {
                        rx = Math.min(rx || ry, w / 2);
                        ry = Math.min(ry || rx, h / 2);
                        // An updated version of the PdfKit's roundedRect method
                        paths.moveTo(x + rx, y);
                        paths.lineTo(x + w - rx, y);
                        paths.quadraticCurveTo(x + w, y, x + w, y + ry);
                        paths.lineTo(x + w, y + h - ry);
                        paths.quadraticCurveTo(x + w, y + h, x + w - rx, y + h);
                        paths.lineTo(x + rx, y + h);
                        paths.quadraticCurveTo(x, y + h, x, y + h - ry);
                        paths.lineTo(x, y + ry);
                        paths.quadraticCurveTo(x, y, x + rx, y);
                    }
                    else {
                        paths.rect(x, y, w, h);
                    }
                }
            };
            return _SvgRectElementImpl;
        }(_SvgShapeElementBase));
        pdf._SvgRectElementImpl = _SvgRectElementImpl;
        //#endregion Shape elements
        //#region Other elements
        var _SvgClipPathElementImpl = (function (_super) {
            __extends(_SvgClipPathElementImpl, _super);
            function _SvgClipPathElementImpl(ctx, node) {
                _super.call(this, ctx, node, _SvgRenderMode.Ignore);
            }
            return _SvgClipPathElementImpl;
        }(_SvgElementBase));
        pdf._SvgClipPathElementImpl = _SvgClipPathElementImpl;
        var _SvgDefsElementImpl = (function (_super) {
            __extends(_SvgDefsElementImpl, _super);
            function _SvgDefsElementImpl(ctx, node) {
                _super.call(this, ctx, node, _SvgRenderMode.Ignore);
            }
            return _SvgDefsElementImpl;
        }(_SvgClippableElementBase));
        pdf._SvgDefsElementImpl = _SvgDefsElementImpl;
        var _SvgGElementImpl = (function (_super) {
            __extends(_SvgGElementImpl, _super);
            function _SvgGElementImpl() {
                _super.apply(this, arguments);
            }
            return _SvgGElementImpl;
        }(_SvgTransformableElementBase));
        pdf._SvgGElementImpl = _SvgGElementImpl;
        var _SvgImageElementImpl = (function (_super) {
            __extends(_SvgImageElementImpl, _super);
            function _SvgImageElementImpl(ctx, node) {
                _super.call(this, ctx, node);
                this._x = new pdf._SvgNumAttr(this, 'x', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Width);
                this._y = new pdf._SvgNumAttr(this, 'y', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Height);
                this._width = new pdf._SvgNumAttr(this, 'width', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Width);
                this._height = new pdf._SvgNumAttr(this, 'height', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Height);
                this._href = new pdf._SvgHRefAttr(this, 'xlink:href');
                this._par = new pdf._SvgPreserveAspectRatioAttr(this);
            }
            _SvgImageElementImpl.prototype._renderContent = function () {
                var width = this._width.val, height = this._height.val;
                if (width > 0 && height > 0 && this._href.hasVal) {
                    var url = pdf._resolveUrlIfRelative(this._href.val, this.ctx.urlResolver);
                    if (url) {
                        this.ctx.area._pdfdoc.saveState();
                        if (this._x.val || this._y.val) {
                            this.ctx.area.translate(this._x.val, this._y.val);
                        }
                        this.viewport = new wijmo.Size(width, height);
                        try {
                            if (this._href.val.match(/\.svg$/i)) {
                                this._renderSvgImage(url);
                            }
                            else {
                                this._renderRasterImage(url);
                            }
                        }
                        catch (ex) {
                        }
                        this.ctx.area._pdfdoc.restoreState();
                    }
                }
            };
            _SvgImageElementImpl.prototype._renderSvgImage = function (url) {
                var xhrError, str = wijmo.pdf._XhrHelper.text(url, function (xhr) { return xhrError = xhr.statusText; });
                wijmo.assert(xhrError == null, xhrError);
                var svg = new pdf._SvgRenderer(str, this.ctx.area), r = svg.root;
                this.attr('viewBox', r.attr('viewBox'));
                r.clearAttr('viewBox');
                r.clearAttr('x');
                r.clearAttr('y');
                r.clearAttr('width');
                r.clearAttr('height');
                r.clearAttr('preserveAspectRatio');
                r.clearAttr('clip');
                r.clearAttr('overflow');
                this.ctx.area.paths.rect(0, 0, this.viewport.width, this.viewport.height).clip();
                var scale = new pdf._SvgScaleAttributes(this); // uses fake 'viewBox' attribute, see above
                svg.render(scale.apply(this));
            };
            _SvgImageElementImpl.prototype._renderRasterImage = function (url) {
                var dataUri = pdf._PdfImageHelper.getDataUri(url), ar = this._par.val, opt = {
                    width: this.viewport.width,
                    height: this.viewport.height,
                    align: pdf.PdfImageHorizontalAlign.Left,
                    vAlign: pdf.PdfImageVerticalAlign.Top
                };
                if (ar.align === 'none') {
                    opt.stretchProportionally = false;
                }
                else {
                    // * Uniform scaling. The preserveAspectRatio's 'slice' mode is ignored (treated as 'meet'), to support preserveAspectRatio completely we need to know the referenced image sizes. *
                    opt.stretchProportionally = true;
                    if (ar.align.match(/^xMid/)) {
                        opt.align = pdf.PdfImageHorizontalAlign.Center;
                    }
                    else {
                        if (ar.align.match(/^xMax/)) {
                            opt.align = pdf.PdfImageHorizontalAlign.Right;
                        }
                    }
                    if (ar.align.match(/YMid$/)) {
                        opt.vAlign = pdf.PdfImageVerticalAlign.Center;
                    }
                    else {
                        if (ar.align.match(/YMax$/)) {
                            opt.vAlign = pdf.PdfImageVerticalAlign.Bottom;
                        }
                    }
                }
                this.ctx.area.drawImage(dataUri, 0, 0, opt);
            };
            return _SvgImageElementImpl;
        }(_SvgTransformableElementBase));
        pdf._SvgImageElementImpl = _SvgImageElementImpl;
        var _SvgStyleElementImpl = (function (_super) {
            __extends(_SvgStyleElementImpl, _super);
            function _SvgStyleElementImpl(ctx, node) {
                var _this = this;
                _super.call(this, ctx, node, _SvgRenderMode.Ignore);
                if (node && (!node.type || node.type === 'text/css')) {
                    var css = '';
                    for (var i = 0; i < node.childNodes.length; i++) {
                        css += node.childNodes[i].textContent;
                    }
                    css = pdf._compressSpaces(css);
                    css = css.replace(/\/\*([^*]|\*+[^*/])*\*+\//gm, ''); // remove comments
                    var rules = css.match(/[^{}]*{[^}]*}/g);
                    if (rules) {
                        for (var i = 0; i < rules.length; i++) {
                            var rule = rules[i].match(/([^{}]*){([^}]*)}/);
                            if (rule) {
                                var selectors = rule[1].trim().split(','), declaration = rule[2].trim();
                                if (selectors.length && declaration) {
                                    selectors.forEach(function (selector) {
                                        if (selector = selector.trim()) {
                                            _this.ctx.registerCssRule(new pdf._SvgCssRule(selector, declaration));
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            }
            return _SvgStyleElementImpl;
        }(_SvgElementBase));
        pdf._SvgStyleElementImpl = _SvgStyleElementImpl;
        var _SvgSvgElementImpl = (function (_super) {
            __extends(_SvgSvgElementImpl, _super);
            function _SvgSvgElementImpl(ctx, node) {
                _super.call(this, ctx, node);
                this._x = new pdf._SvgNumAttr(this, 'x', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Width);
                this._y = new pdf._SvgNumAttr(this, 'y', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Height);
                this._width = new pdf._SvgNumAttr(this, 'width', '100%', pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Width);
                this._height = new pdf._SvgNumAttr(this, 'height', '100%', pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Height);
                this._scale = new pdf._SvgScaleAttributes(this);
                this._overflow = new pdf._SvgStrAttr(this, 'overflow', 'hidden');
            }
            Object.defineProperty(_SvgSvgElementImpl.prototype, "width", {
                get: function () {
                    return this._width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_SvgSvgElementImpl.prototype, "height", {
                get: function () {
                    return this._height;
                },
                enumerable: true,
                configurable: true
            });
            _SvgSvgElementImpl.prototype._render = function () {
                var area = this.ctx.area;
                area._pdfdoc.saveState();
                // pecentage values of these attributes are resolved using the old ("parent") viewport.
                var width = this._width.val, height = this._height.val, x = this._x.val, y = this._y.val;
                if (this.parent && (x || y)) {
                    area.translate(x, y);
                }
                this.viewport = new wijmo.Size(width, height);
                // don't clip the outermost svg element
                if (this._overflow.val !== 'visible') {
                    area.paths.rect(0, 0, width, height).clip();
                }
                // establish a new viewport using the viewBox and preserveAspectRatio attributes
                this.viewport = this._scale.apply(this);
                // debug
                //this.ctx.area.paths
                //	.rect(0, 0, this.viewPort.width, this.viewPort.height)
                //	.stroke(new PdfPen('lime', 2, new PdfDashPattern(5)));
                // debug
                // don't render if width = 0 or height = 0; viewBox.width = 0 or viewBox.height = 0
                if (this.viewport.width > 0 && this.viewport.height > 0) {
                    _super.prototype._render.call(this);
                }
                area._pdfdoc.restoreState();
            };
            return _SvgSvgElementImpl;
        }(_SvgClippableElementBase));
        pdf._SvgSvgElementImpl = _SvgSvgElementImpl;
        var _SvgSymbolElementImpl = (function (_super) {
            __extends(_SvgSymbolElementImpl, _super);
            function _SvgSymbolElementImpl(ctx, node) {
                _super.call(this, ctx, node, _SvgRenderMode.Ignore);
            }
            return _SvgSymbolElementImpl;
        }(_SvgClippableElementBase));
        pdf._SvgSymbolElementImpl = _SvgSymbolElementImpl;
        var _SvgUseElementImpl = (function (_super) {
            __extends(_SvgUseElementImpl, _super);
            function _SvgUseElementImpl(ctx, node) {
                _super.call(this, ctx, node);
                this._xlink = new pdf._SvgIdRefAttr(this, 'xlink:href');
            }
            _SvgUseElementImpl.prototype._render = function () {
                var ref, foo;
                if (!this._xlink.hasVal || !(ref = this.ctx.getElement(this._xlink.val))) {
                    return;
                }
                // ** https://www.w3.org/TR/SVG/struct.html#UseElement **
                var g = new _SvgGElementImpl(this.ctx, null);
                g.parent = this.parent;
                g.copyAttributesFrom(this, ['x', 'y', 'width', 'height', 'xlink:href']);
                // x, y
                if (this.attr('x') != null || this.attr('y') != null) {
                    var trans = wijmo.format('translate({x},{y})', { x: this.attr('x') || 0, y: this.attr('y') || 0 });
                    g.attr('transform', (foo = g.attr('transform')) ? foo + ' ' + trans : trans);
                }
                if (ref instanceof _SvgSymbolElementImpl) {
                    // convert symbol to svg
                    var svg = new _SvgSvgElementImpl(this.ctx, null);
                    svg.copyAttributesFrom(ref);
                    for (var i = 0; i < ref.children.length; i++) {
                        svg.appendNode(ref.children[i].clone());
                    }
                    g.appendNode(svg);
                    // width, height
                    svg.attr('width', this.attr('width') || '100%');
                    svg.attr('height', this.attr('height') || '100%');
                }
                else {
                    ref = ref.clone();
                    g.appendNode(ref);
                    if (ref instanceof _SvgSvgElementImpl) {
                        // width, height
                        if ((foo = this.attr('width')) != null) {
                            ref.attr('width', foo);
                        }
                        if ((foo = this.attr('height')) != null) {
                            ref.attr('height', foo);
                        }
                    }
                }
                g.render(this.viewport, this.renderMode);
            };
            return _SvgUseElementImpl;
        }(_SvgElementBase));
        pdf._SvgUseElementImpl = _SvgUseElementImpl;
        var _SvgTextElementImpl = (function (_super) {
            __extends(_SvgTextElementImpl, _super);
            function _SvgTextElementImpl(ctx, node) {
                _super.call(this, ctx, node);
                this._x = new pdf._SvgNumAttr(this, 'x', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Width);
                this._y = new pdf._SvgNumAttr(this, 'y', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Height);
                this._dx = new pdf._SvgNumAttr(this, 'dx', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Width);
                this._dy = new pdf._SvgNumAttr(this, 'dy', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Height);
                this._textDecoration = new pdf._SvgTextDecorationAttr(this);
            }
            _SvgTextElementImpl.prototype._render = function () {
                if (this.renderMode === _SvgRenderMode.Render) {
                    _super.prototype._render.call(this);
                }
            };
            _SvgTextElementImpl.prototype._renderContent = function () {
                var _this = this;
                this._prepareNodes();
                var cx = this._x.val + this._dx.val, cy = this._y.val + this._dy.val, func = function (node, decorators) {
                    if (node._x.hasVal) {
                        cx = node._x.val;
                    }
                    if (node._y.hasVal) {
                        cy = node._y.val;
                    }
                    cx += node._dx.val;
                    cy += node._dy.val;
                    if (node._text) {
                        node._cx = cx;
                        node._cy = cy;
                        node._setDecorators(decorators);
                        node.render(_this.viewport, _this.renderMode);
                        cx += _this.ctx.area.measureText(node._text, node.style.font.toFont(), { width: Infinity, height: Infinity }).size.width;
                    }
                    else {
                        for (var i = 0; i < node.children.length; i++) {
                            var dec = decorators.slice();
                            dec.push({ decoration: node._textDecoration, style: node.style });
                            func(node.children[i], dec);
                        }
                    }
                };
                for (var i = 0; i < this.children.length; i++) {
                    func(this.children[i], [{ decoration: this._textDecoration, style: this.style }]);
                }
            };
            _SvgTextElementImpl.prototype._prepareNodes = function () {
                var removeEmptyNodes = function (node) {
                    for (var i = 0; i < node.children.length; i++) {
                        var child = node.children[i];
                        if (!child._text && removeEmptyNodes(child)) {
                            child.remove();
                        }
                    }
                    return node.children.length === 0;
                };
                var list = [];
                var buildTextList = function (node) {
                    for (var i = 0; i < node.children.length; i++) {
                        var child = node.children[i];
                        if (child._text) {
                            list.push(child);
                        }
                        else {
                            buildTextList(child);
                        }
                    }
                };
                removeEmptyNodes(this);
                buildTextList(this);
                for (var i = 0; i < list.length; i++) {
                    var len = list.length;
                    // remove whitespaces
                    if (list[i]._text === ' ' && ((i === 0) ||
                        (i === len - 1) ||
                        (i < len - 1 && list[i + 1]._text === ' '))) {
                        list[i].remove();
                        list.splice(i, 1);
                        i--;
                    }
                }
            };
            return _SvgTextElementImpl;
        }(_SvgTransformableElementBase));
        pdf._SvgTextElementImpl = _SvgTextElementImpl;
        var _SvgTspanElementImpl = (function (_super) {
            __extends(_SvgTspanElementImpl, _super);
            function _SvgTspanElementImpl(ctx, node, text) {
                _super.call(this, ctx, node);
                this._textDecoration = new pdf._SvgTextDecorationAttr(this);
                this._text = wijmo.asString(text);
                this._x = new pdf._SvgNumAttr(this, 'x', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Width);
                this._y = new pdf._SvgNumAttr(this, 'y', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Height);
                this._dx = new pdf._SvgNumAttr(this, 'dx', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Width);
                this._dy = new pdf._SvgNumAttr(this, 'dy', 0, pdf._SvgNumConversion.Default, pdf._SvgLengthContext.Height);
                this._textDecoration = new pdf._SvgTextDecorationAttr(this);
            }
            _SvgTspanElementImpl.prototype.clone = function () {
                var clone = _super.prototype.clone.call(this);
                clone._text = this._text;
                return clone;
            };
            _SvgTspanElementImpl.prototype._setDecorators = function (value) {
                this._decorators = value;
            };
            _SvgTspanElementImpl.prototype._renderContent = function () {
                if (this._text) {
                    var opt = {
                        font: this.style.font.toFont(),
                        width: Infinity,
                        height: Infinity,
                        lineBreak: false,
                        fill: this.style.fill.color.val !== 'none',
                        stroke: this.style.stroke.color.val !== 'none',
                        _baseline: pdf._PdfTextBaseline.Alphabetic
                    };
                    this._decorate();
                    if (opt.fill || opt.stroke) {
                        if (opt.fill) {
                            opt.brush = this.style.fill.toBrush();
                        }
                        if (opt.stroke) {
                            opt.pen = this.style.stroke.toPen();
                        }
                        this.ctx.area.drawText(this._text, this._cx, this._cy, opt);
                    }
                }
            };
            _SvgTspanElementImpl.prototype._decorate = function () {
                var area = this.ctx.area, hasValue = false;
                this._decorators.push({ decoration: this._textDecoration, style: this.style });
                for (var i = 0; i < this._decorators.length && !hasValue; i++) {
                    hasValue = this._decorators[i].decoration.val != null;
                }
                if (hasValue) {
                    area._pdfdoc.saveState();
                    var d = area._pdfdoc._document, sz = area.measureText(this._text, this.style.font.toFont(), { width: Infinity, height: Infinity }).size, lineHeight = Math.max(d.currentFontSize() / 20, 0.1), ascender = d.currentFontAscender(), x = this._cx;
                    for (var dec; dec = this._decorators.shift();) {
                        var decVal = dec.decoration.val;
                        if (decVal) {
                            for (var j = 0; j < decVal.length; j++) {
                                var y = this._cy - ascender; // baseline offset (Alphabetic)
                                switch (decVal[j]) {
                                    case 'line-through':
                                        y = y + sz.height / 2 - lineHeight / 2;
                                        break;
                                    case 'overline':
                                        y = y - (d.currentFontBBox().ury - d.currentFontAscender());
                                        break;
                                    case 'underline':
                                        y = y + sz.height - lineHeight * 1.5;
                                        break;
                                }
                                area.paths.rect(x, y, sz.width, lineHeight);
                            }
                            dec.style.apply(this, true, true);
                        }
                    }
                    area._pdfdoc.restoreState();
                }
            };
            return _SvgTspanElementImpl;
        }(_SvgClippableElementBase));
        pdf._SvgTspanElementImpl = _SvgTspanElementImpl;
    })(pdf = wijmo.pdf || (wijmo.pdf = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_Elements.js.map