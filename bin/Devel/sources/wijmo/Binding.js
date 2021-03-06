var wijmo;
(function (wijmo) {
    'use strict';
    /**
     * Provides binding to complex properties (e.g. 'customer.address.city')
     */
    var Binding = (function () {
        /**
         * Initializes a new instance of the @see:Binding class.
         *
         * @param path Name of the property to bind to.
         */
        function Binding(path) {
            this.path = path;
        }
        Object.defineProperty(Binding.prototype, "path", {
            /**
             * Gets or sets the path for the binding.
             *
             * In the simplest case, the path is the name of the property of the source
             * object to use for the binding (e.g. 'street').
             *
             * Sub-properties of a property can be specified by a syntax similar to that
             * used in JavaScript (e.g. 'address.street').
             */
            get: function () {
                return this._path;
            },
            set: function (value) {
                this._path = value;
                this._parts = value ? value.split('.') : []; // e.g. 'customer.balance'
                for (var i = 0; i < this._parts.length; i++) {
                    var part = this._parts[i], ib = part.indexOf('['); // e.g. 'customer.balance[0]'
                    if (ib > -1) {
                        this._parts[i] = part.substr(0, ib);
                        this._parts.splice(++i, 0, parseInt(part.substr(ib + 1)));
                    }
                }
                this._key = this._parts.length == 1 ? this._parts[0] : null;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Gets the binding value for a given object.
         *
         * If the object does not contain the property specified by the
         * binding @see:path, the method returns null.
         *
         * @param object The object that contains the data to be retrieved.
         */
        Binding.prototype.getValue = function (object) {
            if (object) {
                // optimize common case
                if (this._key) {
                    return object[this._key];
                }
                // handle case where property name has a decimal point (TFS 139176)
                if (this._path in object) {
                    return object[this._path];
                }
                // traverse path for complex properties
                for (var i = 0; i < this._parts.length && object; i++) {
                    object = object[this._parts[i]];
                }
            }
            return object;
        };
        /**
         * Sets the binding value on a given object.
         *
         * If the object does not contain the property specified by the
         * binding @see:path, the value is not set.
         *
         * @param object The object that contains the data to be set.
         * @param value Data value to set.
         */
        Binding.prototype.setValue = function (object, value) {
            if (object) {
                // handle simple cases (and cases where the property name has a decimal point)
                if (this._path in object) {
                    object[this._path] = value;
                    return;
                }
                // traverse parts for complex properties
                for (var i = 0; i < this._parts.length - 1; i++) {
                    object = object[this._parts[i]];
                    if (object == null) {
                        return;
                    }
                }
                // make the assignment
                object[this._parts[this._parts.length - 1]] = value;
            }
        };
        return Binding;
    }());
    wijmo.Binding = Binding;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Binding.js.map