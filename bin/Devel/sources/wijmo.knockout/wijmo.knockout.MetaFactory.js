var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var knockout;
    (function (knockout) {
        var MetaFactory = (function (_super) {
            __extends(MetaFactory, _super);
            function MetaFactory() {
                _super.apply(this, arguments);
            }
            // Override to return wijmo.knockout.PropDesc
            MetaFactory.CreateProp = function (propertyName, propertyType, changeEvent, enumType, isNativeControlProperty, priority) {
                return new PropDesc(propertyName, propertyType, changeEvent, enumType, isNativeControlProperty, priority);
            };
            // Override to return wijmo.knockout.EventDesc
            MetaFactory.CreateEvent = function (eventName, isPropChanged) {
                return new EventDesc(eventName, isPropChanged);
            };
            // Override to return wijmo.knockout.ComplexPropDesc
            MetaFactory.CreateComplexProp = function (propertyName, isArray, ownsObject) {
                return new ComplexPropDesc(propertyName, isArray, ownsObject);
            };
            // Typecasted override.
            MetaFactory.findProp = function (propName, props) {
                return wj.interop.ControlMetaFactory.findProp(propName, props);
            };
            // Typecasted override.
            MetaFactory.findEvent = function (eventName, events) {
                return wj.interop.ControlMetaFactory.findEvent(eventName, events);
            };
            // Typecasted override.
            MetaFactory.findComplexProp = function (propName, props) {
                return wj.interop.ControlMetaFactory.findComplexProp(propName, props);
            };
            return MetaFactory;
        }(wj.interop.ControlMetaFactory));
        knockout.MetaFactory = MetaFactory;
        var PropDesc = (function (_super) {
            __extends(PropDesc, _super);
            function PropDesc() {
                _super.apply(this, arguments);
            }
            return PropDesc;
        }(wj.interop.PropDescBase));
        knockout.PropDesc = PropDesc;
        // Describes a scope event
        var EventDesc = (function (_super) {
            __extends(EventDesc, _super);
            function EventDesc() {
                _super.apply(this, arguments);
            }
            return EventDesc;
        }(wj.interop.EventDescBase));
        knockout.EventDesc = EventDesc;
        // Describe property info for nested directives.
        var ComplexPropDesc = (function (_super) {
            __extends(ComplexPropDesc, _super);
            function ComplexPropDesc() {
                _super.apply(this, arguments);
            }
            return ComplexPropDesc;
        }(wj.interop.ComplexPropDescBase));
        knockout.ComplexPropDesc = ComplexPropDesc;
    })(knockout = wijmo.knockout || (wijmo.knockout = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.knockout.MetaFactory.js.map