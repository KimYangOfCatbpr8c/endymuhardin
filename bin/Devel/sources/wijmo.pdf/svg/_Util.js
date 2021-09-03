var wijmo;
(function (wijmo) {
    var pdf;
    (function (pdf) {
        'use strict';
        function _compressSpaces(value) {
            if (value) {
                value = value.trim().replace(/\s+/gm, ' ');
            }
            return value;
        }
        pdf._compressSpaces = _compressSpaces;
        function _resolveUrlIfRelative(url, urlResolver) {
            if (url && urlResolver && !/(^[a-z][a-z0-9]*:)?\/\//i.test(url)) {
                url = urlResolver(url);
            }
            return url;
        }
        pdf._resolveUrlIfRelative = _resolveUrlIfRelative;
        var _SvgCssRule = (function () {
            function _SvgCssRule(selector, declaration) {
                this.selector = selector;
                this.declarations = {};
                this._fillDeclarations(declaration);
            }
            _SvgCssRule.prototype._fillDeclarations = function (declaration) {
                var _this = this;
                if (!declaration) {
                    return;
                }
                declaration.split(';').forEach(function (item) {
                    if (item) {
                        var def = item.split(':');
                        if (def.length === 2) {
                            var name = def[0].trim().toLowerCase(), value = def[1].trim();
                            if (name && value) {
                                var important = /!important$/i.test(value);
                                if (important) {
                                    value = value.replace(/!important$/i, '').trim();
                                }
                                if (value) {
                                    _this.declarations[name] = {
                                        value: value,
                                        important: important
                                    };
                                }
                            }
                        }
                    }
                });
            };
            return _SvgCssRule;
        }());
        pdf._SvgCssRule = _SvgCssRule;
        var _SvgCssHelper = (function () {
            function _SvgCssHelper() {
            }
            _SvgCssHelper.matchesSelector = function (node, selector) {
                var res = false;
                try {
                    var fn = node.matches || node.msMatchesSelector || node.webkitMatchesSelector || node.mozMatchesSelector;
                    res = fn.call(node, selector);
                }
                catch (ex) { }
                return res;
            };
            _SvgCssHelper.getSpecificity = function (selector) {
                var a = 0, b = 0, c = 0, match = function (rg) {
                    var match = (selector.match(rg) || []).length;
                    if (match) {
                        selector = selector.replace(rg, '');
                    }
                    return match;
                };
                // An adapted version of https://github.com/keeganstreet/specificity/blob/master/specificity.js
                // Remove the negation psuedo-class (:not) but leave its argument because specificity is calculated on its argument
                selector = selector.replace(/:not\(([^\)]*)\)/g, function (match, g1) {
                    return ' ' + g1 + ' ';
                });
                // Add attribute selectors to parts collection
                b += match(/(\[[^\]]+\])/g);
                // Add ID selectors to parts collection
                a += match(/(#[^\s\+>~\.\[:]+)/g);
                // Add class selectors to parts collection
                b += match(/(\.[^\s\+>~\.\[:]+)/g);
                // Add pseudo-element selectors to parts collection
                c += match(/(::[^\s\+>~\.\[:]+|:first-line|:first-letter|:before|:after)/gi);
                // Add pseudo-class selectors to parts collection
                b += match(/(:[\w-]+\([^\)]*\))/gi);
                b += match(/(:[^\s\+>~\.\[:]+)/g);
                // Remove universal selector and separator characters
                selector = selector.replace(/[\*\s\+>~]/g, ' ');
                // Remove any stray dots or hashes which aren't attached to words
                selector = selector.replace(/[#\.]/g, ' ');
                // The only things left should be element selectors
                c += match(/([^\s\+>~\.\[:]+)/g);
                return (a << 16) | (b << 8) | c;
            };
            // Computes the actual styling properties of a node determined by the 'class' and 'style' attributes and returns them as a stylePropName-stylePropValue dictionary.
            _SvgCssHelper.getComputedStyle = function (node, registeredRules) {
                var _this = this;
                var composite = {}, associatedRules = [];
                // find the associated CSS rules
                if (node.className) {
                    var associatedRules = [];
                    for (var i = 0, keys = Object.keys(registeredRules); i < keys.length; i++) {
                        var selector = keys[i];
                        if (this.matchesSelector(node, selector)) {
                            associatedRules.push(registeredRules[selector]);
                        }
                    }
                }
                // prioritize
                associatedRules.sort(function (a, b) { return _this.getSpecificity(a.selector) - _this.getSpecificity(b.selector); });
                // append the 'style' attribute (it has the highest specificity)
                var inline = node.getAttribute('style');
                if (inline) {
                    associatedRules.push(new _SvgCssRule('_inline_', _compressSpaces(inline)));
                }
                // compose rules
                for (var i = 0; i < associatedRules.length; i++) {
                    var rule = associatedRules[i];
                    for (var j = 0, keys = Object.keys(rule.declarations); j < keys.length; j++) {
                        var name = keys[j], val = rule.declarations[name];
                        //!important property has a higher priority than non-!important even if the second one comes from the more specialized rule.
                        if ((composite[name] == null) || (val.important || !composite[name].important)) {
                            composite[name] = val;
                        }
                    }
                }
                // convert to dictionary
                var result = {};
                for (var i = 0, keys = Object.keys(composite); i < keys.length; i++) {
                    var name = keys[i];
                    result[name] = composite[name].value;
                }
                return result;
            };
            _SvgCssHelper.registerFontFace = function (doc, rule, urlResolver) {
                var rd = rule.declarations;
                if (!rd['font-family'] || !rd['src']) {
                    return;
                }
                rd['src'].value.split(',').every(function (url) {
                    if (url.match(/format\(\s*['"]?truetype['"]?\s*\)/i)) {
                        var match = url.match(/url\(\s*['"]?([^'"\)]+)['"]?\s*\)/i);
                        if (match) {
                            var src = match[1].trim(), success = false;
                            if (src = _resolveUrlIfRelative(src, urlResolver)) {
                                var font = {
                                    name: rd['font-family'].value,
                                    source: src,
                                    weight: rd['font-weight'] ? rd['font-weight'].value.toLowerCase() : 'normal',
                                    style: rd['font-style'] ? rd['font-style'].value.toLowerCase() : 'normal'
                                };
                                try {
                                    doc.registerFont(font);
                                    success = true;
                                }
                                catch (ex) { }
                            }
                            return !success; // break the loop if success
                        }
                    }
                    return true;
                });
            };
            return _SvgCssHelper;
        }());
        pdf._SvgCssHelper = _SvgCssHelper;
    })(pdf = wijmo.pdf || (wijmo.pdf = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_Util.js.map