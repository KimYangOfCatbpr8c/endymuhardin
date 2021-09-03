var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    'use strict';
    /*
     * Represents an event handler (private class)
     */
    var EventHandler = (function () {
        function EventHandler(handler, self) {
            this.handler = handler;
            this.self = self;
        }
        return EventHandler;
    }());
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
    var Event = (function () {
        function Event() {
            this._handlers = [];
        }
        /**
         * Adds a handler to this event.
         *
         * @param handler Function invoked when the event is raised.
         * @param self Object that defines the event handler
         * (accessible as 'this' from the handler code).
         */
        Event.prototype.addHandler = function (handler, self) {
            wijmo.asFunction(handler);
            this._handlers.push(new EventHandler(handler, self));
        };
        /**
         * Removes a handler from this event.
         *
         * @param handler Function invoked when the event is raised.
         * @param self Object that defines the event handler (accessible as 'this' from the handler code).
         */
        Event.prototype.removeHandler = function (handler, self) {
            wijmo.asFunction(handler);
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
        };
        /**
         * Removes all handlers associated with this event.
         */
        Event.prototype.removeAllHandlers = function () {
            this._handlers.length = 0;
        };
        /**
         * Raises this event, causing all associated handlers to be invoked.
         *
         * @param sender Source object.
         * @param args Event parameters.
         */
        Event.prototype.raise = function (sender, args) {
            if (args === void 0) { args = EventArgs.empty; }
            for (var i = 0; i < this._handlers.length; i++) {
                var l = this._handlers[i];
                l.handler.call(l.self, sender, args);
            }
        };
        Object.defineProperty(Event.prototype, "hasHandlers", {
            /**
             * Gets a value that indicates whether this event has any handlers.
             */
            get: function () {
                return this._handlers.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        return Event;
    }());
    wijmo.Event = Event;
    /**
     * Base class for event arguments.
     */
    var EventArgs = (function () {
        function EventArgs() {
        }
        /**
         * Provides a value to use with events that do not have event data.
         */
        EventArgs.empty = new EventArgs();
        return EventArgs;
    }());
    wijmo.EventArgs = EventArgs;
    /**
     * Provides arguments for cancellable events.
     */
    var CancelEventArgs = (function (_super) {
        __extends(CancelEventArgs, _super);
        function CancelEventArgs() {
            _super.apply(this, arguments);
            /**
             * Gets or sets a value that indicates whether the event should be canceled.
             */
            this.cancel = false;
        }
        return CancelEventArgs;
    }(EventArgs));
    wijmo.CancelEventArgs = CancelEventArgs;
    /**
     * Provides arguments for property change events.
     */
    var PropertyChangedEventArgs = (function (_super) {
        __extends(PropertyChangedEventArgs, _super);
        /**
         * Initializes a new instance of the @see:PropertyChangedEventArgs class.
         *
         * @param propertyName The name of the property whose value changed.
         * @param oldValue The old value of the property.
         * @param newValue The new value of the property.
         */
        function PropertyChangedEventArgs(propertyName, oldValue, newValue) {
            _super.call(this);
            this._name = propertyName;
            this._oldVal = oldValue;
            this._newVal = newValue;
        }
        Object.defineProperty(PropertyChangedEventArgs.prototype, "propertyName", {
            /**
             * Gets the name of the property whose value changed.
             */
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyChangedEventArgs.prototype, "oldValue", {
            /**
             * Gets the old value of the property.
             */
            get: function () {
                return this._oldVal;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PropertyChangedEventArgs.prototype, "newValue", {
            /**
             * Gets the new value of the property.
             */
            get: function () {
                return this._newVal;
            },
            enumerable: true,
            configurable: true
        });
        return PropertyChangedEventArgs;
    }(EventArgs));
    wijmo.PropertyChangedEventArgs = PropertyChangedEventArgs;
    /**
     * Provides arguments for @see:XMLHttpRequest error events.
     */
    var RequestErrorEventArgs = (function (_super) {
        __extends(RequestErrorEventArgs, _super);
        /**
         * Initializes a new instance of the @see:RequestErrorEventArgs class.
         *
         * @param xhr The @see:XMLHttpRequest that detected the error.
         * The status and statusText properties of the request object
         * contain details about the error.
         */
        function RequestErrorEventArgs(xhr) {
            _super.call(this);
            this._xhr = xhr;
        }
        Object.defineProperty(RequestErrorEventArgs.prototype, "request", {
            /**
             * Gets a reference to the @see:XMLHttpRequest that detected the error.
             *
             * The status and statusText properties of the request object contain
             * details about the error.
             */
            get: function () {
                return this._xhr;
            },
            enumerable: true,
            configurable: true
        });
        return RequestErrorEventArgs;
    }(CancelEventArgs));
    wijmo.RequestErrorEventArgs = RequestErrorEventArgs;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Event.js.map