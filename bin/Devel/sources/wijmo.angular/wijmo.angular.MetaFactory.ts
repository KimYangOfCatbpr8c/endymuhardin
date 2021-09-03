module wijmo.angular {

    export class MetaFactory extends wj.interop.ControlMetaFactory {

        // Override to return wijmo.angular.PropDesc
        public static CreateProp(propertyName: string, propertyType: wj.interop.PropertyType,
            changeEvent?: string, enumType?,
            isNativeControlProperty?: boolean, priority?: number): PropDesc {

            return new PropDesc(propertyName, propertyType, changeEvent, enumType, isNativeControlProperty, priority);
        }

        // Override to return wijmo.angular.EventDesc
        public static CreateEvent(eventName: string, isPropChanged?: boolean): EventDesc {
            return new EventDesc(eventName, isPropChanged);
        }

        // Override to return wijmo.angular.ComplexPropDesc
        public static CreateComplexProp(propertyName: string, isArray: boolean, ownsObject?: boolean): ComplexPropDesc {
            return new ComplexPropDesc(propertyName, isArray, ownsObject);
        }

        // Typecast override.
        public static findProp(propName: string, props: PropDesc[]): PropDesc {
            return <PropDesc>wj.interop.ControlMetaFactory.findProp(propName, props);
        }

        // Typecast override.
        public static findEvent(eventName: string, events: EventDesc[]): EventDesc {
            return <EventDesc>wj.interop.ControlMetaFactory.findEvent(eventName, events);
        }

        // Typecast override.
        public static findComplexProp(propName: string, props: ComplexPropDesc[]): ComplexPropDesc {
            return <ComplexPropDesc>wj.interop.ControlMetaFactory.findComplexProp(propName, props);
        }
    }

    // Describes a scope property: name, type, binding mode. 
    // Also defines enum type and custom watcher function extender
    export class PropDesc extends wj.interop.PropDescBase {
        private _scopeBindingMode: string;
        private _customHandler: (scope: ng.IScope, control: wijmo.Control, value: any, oldValue: any, link: WjLink) => any;

        // Initializes a new instance of a PropDesc
        constructor(propertyName: string, propertyType: wj.interop.PropertyType, changeEvent?: string,
                enumType?, isNativeControlProperty?: boolean, priority?: number) {

            super(propertyName, propertyType, changeEvent, enumType, isNativeControlProperty, priority);

            this._scopeBindingMode = this.propertyType === wj.interop.PropertyType.EventHandler ? '&' :
                (this.bindingMode == wj.interop.BindingMode.OneWay &&
                    wj.interop.isSimpleType(this.propertyType) ? '@' : '=');
        }

        // Gets or sets the property binding mode ('@' - by val, '=' - by ref, '&' - expression)
        get scopeBindingMode(): string {
            return this._scopeBindingMode;
        }
        set scopeBindingMode(value: string) {
            this._scopeBindingMode = value;
        }

        // Defines a custom handler function called before assigning a new value to the control property.
        // The handler may optionally return a 'true' value that indicates that assignment is handled 
        // by the handler and prevents the directive from performing the assignment by itself.
        get customHandler(): (scope: ng.IScope, control: wijmo.Control, value: any, oldValue: any, link: WjLink) => any {
            return this._customHandler;
        }
        set customHandler(value: (scope: ng.IScope, control: wijmo.Control, value: any, oldValue: any, link: WjLink) => any) {
            this._customHandler = value;
        }

    }

    // Describes a scope event
    export class EventDesc extends wj.interop.EventDescBase {
    }

    // Describes property info for nested directives.
    export class ComplexPropDesc extends wj.interop.ComplexPropDescBase {
    }
} 