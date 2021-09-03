var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var angular;
    (function (angular) {
        var MetaFactory = (function (_super) {
            __extends(MetaFactory, _super);
            function MetaFactory() {
                _super.apply(this, arguments);
            }
            // Override to return wijmo.angular.PropDesc
            MetaFactory.CreateProp = function (propertyName, propertyType, changeEvent, enumType, isNativeControlProperty, priority) {
                return new PropDesc(propertyName, propertyType, changeEvent, enumType, isNativeControlProperty, priority);
            };
            // Override to return wijmo.angular.EventDesc
            MetaFactory.CreateEvent = function (eventName, isPropChanged) {
                return new EventDesc(eventName, isPropChanged);
            };
            // Override to return wijmo.angular.ComplexPropDesc
            MetaFactory.CreateComplexProp = function (propertyName, isArray, ownsObject) {
                return new ComplexPropDesc(propertyName, isArray, ownsObject);
            };
            // Typecast override.
            MetaFactory.findProp = function (propName, props) {
                return wj.interop.ControlMetaFactory.findProp(propName, props);
            };
            // Typecast override.
            MetaFactory.findEvent = function (eventName, events) {
                return wj.interop.ControlMetaFactory.findEvent(eventName, events);
            };
            // Typecast override.
            MetaFactory.findComplexProp = function (propName, props) {
                return wj.interop.ControlMetaFactory.findComplexProp(propName, props);
            };
            return MetaFactory;
        }(wj.interop.ControlMetaFactory));
        angular.MetaFactory = MetaFactory;
        // Describes a scope property: name, type, binding mode. 
        // Also defines enum type and custom watcher function extender
        var PropDesc = (function (_super) {
            __extends(PropDesc, _super);
            // Initializes a new instance of a PropDesc
            function PropDesc(propertyName, propertyType, changeEvent, enumType, isNativeControlProperty, priority) {
                _super.call(this, propertyName, propertyType, changeEvent, enumType, isNativeControlProperty, priority);
                this._scopeBindingMode = this.propertyType === wj.interop.PropertyType.EventHandler ? '&' :
                    (this.bindingMode == wj.interop.BindingMode.OneWay &&
                        wj.interop.isSimpleType(this.propertyType) ? '@' : '=');
            }
            Object.defineProperty(PropDesc.prototype, "scopeBindingMode", {
                // Gets or sets the property binding mode ('@' - by val, '=' - by ref, '&' - expression)
                get: function () {
                    return this._scopeBindingMode;
                },
                set: function (value) {
                    this._scopeBindingMode = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PropDesc.prototype, "customHandler", {
                // Defines a custom handler function called before assigning a new value to the control property.
                // The handler may optionally return a 'true' value that indicates that assignment is handled 
                // by the handler and prevents the directive from performing the assignment by itself.
                get: function () {
                    return this._customHandler;
                },
                set: function (value) {
                    this._customHandler = value;
                },
                enumerable: true,
                configurable: true
            });
            return PropDesc;
        }(wj.interop.PropDescBase));
        angular.PropDesc = PropDesc;
        // Describes a scope event
        var EventDesc = (function (_super) {
            __extends(EventDesc, _super);
            function EventDesc() {
                _super.apply(this, arguments);
            }
            return EventDesc;
        }(wj.interop.EventDescBase));
        angular.EventDesc = EventDesc;
        // Describes property info for nested directives.
        var ComplexPropDesc = (function (_super) {
            __extends(ComplexPropDesc, _super);
            function ComplexPropDesc() {
                _super.apply(this, arguments);
            }
            return ComplexPropDesc;
        }(wj.interop.ComplexPropDescBase));
        angular.ComplexPropDesc = ComplexPropDesc;
    })(angular = wijmo.angular || (wijmo.angular = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.angular.MetaFactory.js.map