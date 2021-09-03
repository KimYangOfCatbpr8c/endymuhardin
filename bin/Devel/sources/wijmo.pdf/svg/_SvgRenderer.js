var wijmo;
(function (wijmo) {
    var pdf;
    (function (pdf) {
        'use strict;';
        var _SvgRenderer = (function () {
            function _SvgRenderer(svgString, area, urlResolver) {
                var _this = this;
                this._elementsById = {};
                this._registeredCssRules = {};
                wijmo.assert(area != null, pdf._Errors.ValueCannotBeEmpty('svgString'));
                this._doc = area._pdfdoc;
                var dom = this._parse(svgString);
                if (dom) {
                    this._svg = new pdf._SvgSvgElementImpl({
                        area: area,
                        urlResolver: urlResolver,
                        getElement: this._getElementById.bind(this),
                        registerCssRule: function (rule) {
                            _this._registerCssRule(rule, urlResolver);
                        }
                    }, null);
                    this._copyAttributes(dom, this._svg);
                    this._buildTree(dom, this._svg);
                    // pre-set viewport, so the outermost svg element's height and width properties can be resolved against the viewport before rendering
                    this._svg.viewport = new wijmo.Size(area.width, area.height);
                }
            }
            Object.defineProperty(_SvgRenderer.prototype, "root", {
                get: function () {
                    return this._svg;
                },
                enumerable: true,
                configurable: true
            });
            _SvgRenderer.prototype.render = function (viewPort) {
                if (this._svg) {
                    this._svg.render(viewPort || this._svg.viewport);
                }
            };
            _SvgRenderer.prototype._parse = function (svg) {
                if (svg) {
                    var parser = new DOMParser();
                    parser.async = false;
                    return parser.parseFromString(svg, 'text/xml').querySelector('svg');
                }
            };
            _SvgRenderer.prototype._buildTree = function (dom, tree, handleTextNodes) {
                for (var i = 0; dom.childNodes && i < dom.childNodes.length; i++) {
                    var domChild = dom.childNodes.item(i), nodeName = domChild.nodeName;
                    if (domChild.nodeType === 1) {
                        var className = this._getClassName(nodeName);
                        if (wijmo.pdf[className]) {
                            var element = new wijmo.pdf[className](tree.ctx, domChild);
                            this._copyAttributes(domChild, element);
                            tree.appendNode(element);
                            if (domChild.id) {
                                this._elementsById[domChild.id] = element;
                            }
                            this._buildTree(domChild, element, nodeName === 'text' || (handleTextNodes && nodeName === 'tspan'));
                        }
                        else {
                        }
                    }
                    else {
                        if (domChild.nodeType === 3 && handleTextNodes) {
                            var textContent = domChild.textContent.trim();
                            if (textContent) {
                                // <tspan />\r\n[text] => <tspan />_text
                                if (i != 0 && dom.childNodes[i - 1].nodeType === 1 && domChild.textContent.match(/^\s/)) {
                                    tree.appendNode(new pdf._SvgTspanElementImpl(tree.ctx, null, ' '));
                                }
                                var text = pdf._compressSpaces(domChild.textContent);
                                tree.appendNode(new pdf._SvgTspanElementImpl(tree.ctx, null, text));
                            }
                            // <tspan />\r\n<tspan /> => <tspan />_<tspan />
                            // [text]\r\n[smth] -> [text]_[smth]
                            if (!textContent || domChild.textContent.match(/\s$/)) {
                                tree.appendNode(new pdf._SvgTspanElementImpl(tree.ctx, null, ' '));
                            }
                        }
                    }
                }
            };
            // Any class that wraps a SVG element must follow this naming pattern
            _SvgRenderer.prototype._getClassName = function (nodeName) {
                return '_Svg' + nodeName.charAt(0).toUpperCase() + nodeName.substring(1) + 'ElementImpl';
            };
            _SvgRenderer.prototype._copyAttributes = function (node, element) {
                // copy attributes
                for (var i = 0; i < node.attributes.length; i++) {
                    var attr = node.attributes.item(i);
                    element.attr(attr.name, attr.value);
                }
                var css = pdf._SvgCssHelper.getComputedStyle(node, this._registeredCssRules);
                // convert CSS to attributes (some of the presentation attributes will be overwritten as they have lower priority than CSS)
                for (var i = 0, keys = Object.keys(css); i < keys.length; i++) {
                    var name = keys[i];
                    element.attr(name, css[name]);
                }
            };
            _SvgRenderer.prototype._getElementById = function (id) {
                id = (id || '').replace('#', '');
                return this._elementsById[id];
            };
            _SvgRenderer.prototype._registerCssRule = function (rule, urlResolver) {
                if (rule.selector[0] !== '@') {
                    this._registeredCssRules[rule.selector] = rule;
                }
                else {
                    if (rule.selector === '@font-face') {
                        pdf._SvgCssHelper.registerFontFace(this._doc, rule, urlResolver);
                    }
                }
            };
            return _SvgRenderer;
        }());
        pdf._SvgRenderer = _SvgRenderer;
    })(pdf = wijmo.pdf || (wijmo.pdf = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_SvgRenderer.js.map