module wijmo.knockout {
    export class MetaFactory extends wj.interop.ControlMetaFactory {
        // Override to return wijmo.knockout.PropDesc
        public static CreateProp(propertyName: string, propertyType: wj.interop.PropertyType,
            changeEvent?: string, enumType?,
            isNativeControlProperty?: boolean, priority?: number): PropDesc {

            return new PropDesc(propertyName, propertyType, changeEvent, enumType, isNativeControlProperty, priority);
        }

        // Override to return wijmo.knockout.EventDesc
        public static CreateEvent(eventName: string, isPropChanged?: boolean): EventDesc {
            return new EventDesc(eventName, isPropChanged);
        }

        // Override to return wijmo.knockout.ComplexPropDesc
        public static CreateComplexProp(propertyName: string, isArray: boolean, ownsObject?: boolean): ComplexPropDesc {
            return new ComplexPropDesc(propertyName, isArray, ownsObject);
        }

        // Typecasted override.
        public static findProp(propName: string, props: PropDesc[]): PropDesc {
            return <PropDesc>wj.interop.ControlMetaFactory.findProp(propName, props);
        }

        // Typecasted override.
        public static findEvent(eventName: string, events: EventDesc[]): EventDesc {
            return <EventDesc>wj.interop.ControlMetaFactory.findEvent(eventName, events);
        }

        // Typecasted override.
        public static findComplexProp(propName: string, props: ComplexPropDesc[]): ComplexPropDesc {
            return <ComplexPropDesc>wj.interop.ControlMetaFactory.findComplexProp(propName, props);
        }

    }

    // Defines a delegate performing a custom assignment logic of a control property with a source value.
    // TBD: the plan is to move this platform agnostic definition to the shared metadata.
    export interface IUpdateControlHandler {
        // The link parameter references a 'link' object (WjLink in Angular, WjContext in Knockout).
        (link: any, propDesc: PropDesc, control: any, unconvertedValue: any, convertedValue: any): boolean;
    }

    export class PropDesc extends wj.interop.PropDescBase {
        // A callback allowing to perform a custom update of the control with the new source value.
        // Should return true if update is handled and standard assignment logic should not be applied; otherwise, should return false.
        updateControl: IUpdateControlHandler;
    }

    // Describes a scope event
    export class EventDesc extends wj.interop.EventDescBase {
    }

    // Describe property info for nested directives.
    export class ComplexPropDesc extends wj.interop.ComplexPropDescBase {
    }

} 