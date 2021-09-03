var wijmo;
(function (wijmo) {
    var knockout;
    (function (knockout) {
        var WjTagsPreprocessor = (function () {
            function WjTagsPreprocessor() {
            }
            WjTagsPreprocessor._getSpecialProps = function () {
                var ret = {}, wjBind = wijmo.knockout.WjBinding;
                ret[wjBind._controlPropAttr] = true;
                ret[wjBind._parPropAttr] = true;
                return ret;
            };
            WjTagsPreprocessor.prototype.register = function () {
                this._foreignProc = ko.bindingProvider.instance['preprocessNode'];
                ko.bindingProvider.instance['preprocessNode'] = this.preprocessNode.bind(this);
            };
            WjTagsPreprocessor.prototype.preprocessNode = function (node) {
                var dataBindName = WjTagsPreprocessor._dataBindAttr;
                if (!(node.nodeType == 1 && this._isWjTag(node.tagName))) {
                    return this._delegate(node);
                }
                var camelTag = knockout.MetaFactory.toCamelCase(node.tagName), wjBinding = ko.bindingHandlers[camelTag];
                if (!wjBinding) {
                    return this._delegate(node);
                }
                wjBinding.ensureMetaData();
                var wjBindDef = '', attribs = node.attributes, retEl = document.createElement("div"), dataBindAttr;
                for (var i = 0; i < attribs.length; i++) {
                    var attr = attribs[i];
                    if (attr.name.toLowerCase() == dataBindName) {
                        dataBindAttr = attr;
                        continue;
                    }
                    var camelAttr = knockout.MetaFactory.toCamelCase(attr.name);
                    if (this._isWjProp(camelAttr, wjBinding._metaData)) {
                        if (wjBindDef) {
                            wjBindDef += ',';
                        }
                        wjBindDef += camelAttr + ':' + attr.value;
                    }
                    else {
                        retEl.setAttribute(attr.name, attr.value);
                    }
                }
                wjBindDef = camelTag + ':{' + wjBindDef + '}';
                if (dataBindAttr && dataBindAttr.value && dataBindAttr.value.trim()) {
                    wjBindDef += ',' + dataBindAttr.value;
                }
                retEl.setAttribute(dataBindName, wjBindDef);
                while (node.firstChild) {
                    retEl.appendChild(node.firstChild);
                }
                node.parentNode.replaceChild(retEl, node);
                return [retEl];
            };
            WjTagsPreprocessor.prototype._delegate = function (node) {
                return this._foreignProc ? this._foreignProc(node) : undefined;
            };
            WjTagsPreprocessor.prototype._isWjTag = function (name) {
                var wjPfx = WjTagsPreprocessor._wjTagPrefix;
                return name && name.length > wjPfx.length && name.substr(0, wjPfx.length).toLowerCase() === wjPfx;
            };
            WjTagsPreprocessor.prototype._isWjProp = function (name, metaData) {
                return WjTagsPreprocessor._specialProps[name] || wijmo.knockout.MetaFactory.findProp(name, metaData.props) ||
                    wijmo.knockout.MetaFactory.findEvent(name, metaData.events);
            };
            WjTagsPreprocessor._specialProps = WjTagsPreprocessor._getSpecialProps();
            WjTagsPreprocessor._dataBindAttr = 'data-bind';
            WjTagsPreprocessor._wjTagPrefix = 'wj-';
            return WjTagsPreprocessor;
        }());
        knockout.WjTagsPreprocessor = WjTagsPreprocessor;
    })(knockout = wijmo.knockout || (wijmo.knockout = {}));
})(wijmo || (wijmo = {}));
if (!wijmo['disableKnockoutTags']) {
    new wijmo.knockout.WjTagsPreprocessor().register();
}
//# sourceMappingURL=wijmo.knockout.tags.js.map