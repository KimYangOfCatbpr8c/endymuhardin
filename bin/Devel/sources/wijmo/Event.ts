module wijmo {
    'use strict';

    /**
     * Represents an event handler.
     *
     * Event handlers are functions invoked when events are raised.
     *
     * Every event handler has two arguments:
     * <ul>
     *   <li><b>sender</b> is the object that raised the event, and</li>
     *   <li><b>args</b> is an optional object that contains the event parameters.</li>
     * </ul>
     */
    export interface IEventHandler {
        (sender: any, args: EventArgs): void;
    }
    /*
     * Represents an event handler (private class)
     */
    class EventHandler {
        handler: IEventHandler;
        self: any;
        constructor(handler: IEventHandler, self: any) {
            this.handler = handler;
            this.self = self;
        }
    }
    /**
     * Represents an event.
     *
     * Wijmo events are similar to .NET events. Any class may define events by 
     * declaring them as fields. Any class may subscribe to events using the 
     * event's @see:addHandler method and unsubscribe using the @see:removeHandler 
     * method.
     * 
     * Wijmo event handlers take two parameters: <i>sender</i> and <i>args</i>. 
     * The first is the object that raised the event, and the second is an object 
     * that contains the event parameters.
     *
     * Classes that define events follow the .NET pattern where for every event 
     * there is an <i>on[EVENTNAME]</i> method that raises the event. This pattern 
     * allows derived classes to override the <i>on[EVENTNAME]</i> method and 
     * handle the event before and/or after the base class raises the event. 
     * Derived classes may even suppress the event by not calling the base class 
     * implementation.
     *
     * For example, the TypeScript code below overrides the <b>onValueChanged</b>
     * event for a control to perform some processing before and after the 
     * <b>valueChanged</b> event fires:
     *
     * <pre>// override base class
     * onValueChanged(e: EventArgs) {
     *   // execute some code before the event fires
     *   console.log('about to fire valueChanged');
     *   // optionally, call base class to fire the event
     *   super.onValueChanged(e);
     *   // execute some code after the event fired
     *   console.log('valueChanged event just fired');
     * }</pre>
     */
    export class Event {
        private _handlers: EventHandler[] = [];

        /**
         * Adds a handler to this event.
         *
         * @param handler Function invoked when the event is raised.
         * @param self Object that defines the event handler 
         * (accessible as 'this' from the handler code).
         */
        addHandler(handler: IEventHandler, self?: any) {
            asFunction(handler);
            this._handlers.push(new EventHandler(handler, self));
        }
        /**
         * Removes a handler from this event.
         *
         * @param handler Function invoked when the event is raised.
         * @param self Object that defines the event handler (accessible as 'this' from the handler code).
         */
        removeHandler(handler: IEventHandler, self?: any) {
            asFunction(handler);
            for (var i = 0; i < this._handlers.length; i++) {
                var l = this._handlers[i];
                if (l.handler == handler || handler == null) {
                    if (l.self == self || self == null) {
                        this._handlers.splice(i, 1);
                        if (handler && self) {
                            break;
                        }
                    }
                }
            }
        }
        /**
         * Removes all handlers associated with this event.
         */
        removeAllHandlers() {
            this._handlers.length = 0;
        }
        /**
         * Raises this event, causing all associated handlers to be invoked.
         *
         * @param sender Source object.
         * @param args Event parameters. 
         */
        raise(sender: any, args = EventArgs.empty) {
            for (var i = 0; i < this._handlers.length; i++) {
                var l = this._handlers[i];
                l.handler.call(l.self, sender, args);
            }
        }
        /**
         * Gets a value that indicates whether this event has any handlers.
         */
        get hasHandlers(): boolean {
            return this._handlers.length > 0;
        }
    }
    /**
     * Base class for event arguments.
     */
    export class EventArgs {
        /**
         * Provides a value to use with events that do not have event data.
         */
        static empty = new EventArgs();
    }
    /**
     * Provides arguments for cancellable events.
     */
    export class CancelEventArgs extends EventArgs {
        /**
         * Gets or sets a value that indicates whether the event should be canceled.
         */
        cancel = false;
    }
    /**
     * Provides arguments for property change events.
     */
    export class PropertyChangedEventArgs extends EventArgs {
        _name: string;
        _oldVal: any;
        _newVal: any;

        /**
         * Initializes a new instance of the @see:PropertyChangedEventArgs class.
         *
         * @param propertyName The name of the property whose value changed.
         * @param oldValue The old value of the property.
         * @param newValue The new value of the property.
         */
        constructor(propertyName: string, oldValue: any, newValue: any) {
            super();
            this._name = propertyName;
            this._oldVal = oldValue;
            this._newVal = newValue;
        }
        /**
         * Gets the name of the property whose value changed.
         */
        get propertyName(): string {
            return this._name;
        }
        /**
         * Gets the old value of the property.
         */
        get oldValue(): any {
            return this._oldVal;
        }
        /**
         * Gets the new value of the property.
         */
        get newValue(): any {
            return this._newVal;
        }
    }
    /**
     * Provides arguments for @see:XMLHttpRequest error events.
     */
    export class RequestErrorEventArgs extends CancelEventArgs {
        _xhr: XMLHttpRequest;

        /**
         * Initializes a new instance of the @see:RequestErrorEventArgs class.
         *
         * @param xhr The @see:XMLHttpRequest that detected the error.
         * The status and statusText properties of the request object 
         * contain details about the error.
         */
        constructor(xhr: XMLHttpRequest) {
            super();
            this._xhr = xhr;
        }
        /**
         * Gets a reference to the @see:XMLHttpRequest that detected the error.
         *
         * The status and statusText properties of the request object contain
         * details about the error.
         */
        get request(): XMLHttpRequest {
            return this._xhr;
        }
    }
}