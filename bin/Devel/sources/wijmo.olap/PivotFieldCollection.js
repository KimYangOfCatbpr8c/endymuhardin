var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        /**
         * Represents a collection of @see:PivotField objects.
         */
        var PivotFieldCollection = (function (_super) {
            __extends(PivotFieldCollection, _super);
            /**
             * Initializes a new instance of the @see:PivotFieldCollection class.
             *
             * @param engine @see:PivotEngine that owns this @see:PivotFieldCollection.
             */
            function PivotFieldCollection(engine) {
                _super.call(this);
                this._ng = engine;
            }
            Object.defineProperty(PivotFieldCollection.prototype, "maxItems", {
                //** object model
                /**
                 * Gets or sets the maximum number of fields allowed in this collection.
                 *
                 * This property is set to null by default, which means any number of items is allowed.
                 */
                get: function () {
                    return this._maxItems;
                },
                set: function (value) {
                    this._maxItems = wijmo.asInt(value, true, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotFieldCollection.prototype, "engine", {
                /**
                 * Gets a reference to the @see:PivotEngine that owns this @see:PivotFieldCollection.
                 */
                get: function () {
                    return this._ng;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Gets a field by header.
             *
             * @param header Header string to look for.
             */
            PivotFieldCollection.prototype.getField = function (header) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i].header == header) {
                        return this[i];
                    }
                }
                return null;
            };
            /**
             * Overridden to allow pushing fields by header.
             *
             * @param ...item One or more @see:PivotField objects to add to the array.
             * @return The new length of the array.
             */
            PivotFieldCollection.prototype.push = function () {
                var item = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    item[_i - 0] = arguments[_i];
                }
                var ng = this._ng;
                // loop through items adding them one by one
                for (var i = 0; item && i < item.length; i++) {
                    var fld = item[i];
                    // add fields by binding
                    if (wijmo.isString(fld)) {
                        fld = this == ng.fields
                            ? new olap.PivotField(ng, fld)
                            : ng.fields.getField(fld);
                    }
                    // should be a field now...
                    wijmo.assert(fld instanceof olap.PivotField, 'This collection must contain PivotField objects only.');
                    // headers must be unique
                    if (this.getField(fld.header)) {
                        wijmo.assert(false, 'field headers must be unique.');
                        return -1;
                    }
                    // honor maxitems
                    if (this._maxItems != null && this.length >= this._maxItems) {
                        break;
                    }
                    // add to collection
                    _super.prototype.push.call(this, fld);
                }
                // done
                return this.length;
            };
            return PivotFieldCollection;
        }(wijmo.collections.ObservableArray));
        olap.PivotFieldCollection = PivotFieldCollection;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=PivotFieldCollection.js.map