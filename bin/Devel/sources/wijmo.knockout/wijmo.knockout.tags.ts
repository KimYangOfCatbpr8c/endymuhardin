module wijmo.knockout {
    export class WjTagsPreprocessor {
        private static _specialProps = WjTagsPreprocessor._getSpecialProps();
        private static _getSpecialProps() {
            var ret = {},
                wjBind = wijmo.knockout.WjBinding;
            ret[wjBind._controlPropAttr] = true;
            ret[wjBind._parPropAttr] = true;
            return ret;
        }

        private static _dataBindAttr = 'data-bind';
        private static _wjTagPrefix = 'wj-';

        private _foreignProc;

        register(): void {
            this._foreignProc = ko.bindingProvider.instance['preprocessNode'];
            ko.bindingProvider.instance['preprocessNode'] = this.preprocessNode.bind(this); 
        }

        preprocessNode(node): any {
            var dataBindName = WjTagsPreprocessor._dataBindAttr;
            if (!(node.nodeType == 1 && this._isWjTag(node.tagName))) {
                return this._delegate(node);
            }
            var camelTag = MetaFactory.toCamelCase(node.tagName),
                wjBinding = <wijmo.knockout.WjBinding>ko.bindingHandlers[camelTag];
            if (!wjBinding) {
                return this._delegate(node);
            }
            wjBinding.ensureMetaData();
            var wjBindDef = '',
                attribs = node.attributes,
                retEl = document.createElement("div"),
                dataBindAttr;
            for (var i = 0; i < attribs.length; i++) {
                var attr = attribs[i];
                if (attr.name.toLowerCase() == dataBindName) {
                    dataBindAttr = attr;
                    continue;
                }
                var camelAttr = MetaFactory.toCamelCase(attr.name);
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
        }

        private _delegate(node) {
            return this._foreignProc ? this._foreignProc(node) : undefined;
        }

        private _isWjTag(name) {
            var wjPfx = WjTagsPreprocessor._wjTagPrefix;
            return name && name.length > wjPfx.length && name.substr(0, wjPfx.length).toLowerCase() === wjPfx;
        }

        private _isWjProp(name, metaData) {
            return WjTagsPreprocessor._specialProps[name] || wijmo.knockout.MetaFactory.findProp(name, metaData.props) ||
                wijmo.knockout.MetaFactory.findEvent(name, metaData.events);
        }

    }
} 

if (!wijmo['disableKnockoutTags']) {
    new wijmo.knockout.WjTagsPreprocessor().register();
}