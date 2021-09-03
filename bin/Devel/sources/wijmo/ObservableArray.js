var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var collections;
    (function (collections) {
        'use strict';
        /**
         * Base class for Array classes with notifications.
         */
        var ArrayBase = (function () {
            /**
             * Initializes a new instance of the @see:ArrayBase class.
             */
            function ArrayBase() {
                this.length = 0;
                Array.apply(this, arguments);
            }
            // keep TypeScript happy (these will never be called, we changed the prototype)
            ArrayBase.prototype.pop = function () {
                return null;
            };
            ArrayBase.prototype.push = function () {
                var item = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    item[_i - 0] = arguments[_i];
                }
                return 0;
            };
            ArrayBase.prototype.splice = function (index, count, value) {
                return null;
            };
            ArrayBase.prototype.slice = function (begin, end) {
                return null;
            };
            ArrayBase.prototype.indexOf = function (searchElement, fromIndex) {
                return -1;
            };
            ArrayBase.prototype.sort = function (compareFn) {
                return null;
            };
            return ArrayBase;
        }());
        collections.ArrayBase = ArrayBase;
        // inheriting from Array
        // NOTE: set this in declaration rather than in constructor so the
        // the TypeScript inheritance mechanism works correctly with instanceof.
        ArrayBase.prototype = Array.prototype;
        /**
         * Array that sends notifications on changes.
         *
         * The class raises the @see:collectionChanged event when changes are made with
         * the push, pop, splice, insert, or remove methods.
         *
         * Warning: Changes made by assigning values directly to array members or to the
         * length of the array do not raise the @see:collectionChanged event.
         */
        var ObservableArray = (function (_super) {
            __extends(ObservableArray, _super);
            /**
             * Initializes a new instance of the @see:ObservableArray class.
             *
             * @param data Array containing items used to populate the @see:ObservableArray.
             */
            function ObservableArray(data) {
                _super.call(this);
                this._updating = 0;
                // ** INotifyCollectionChanged
                /**
                 * Occurs when the collection changes.
                 */
                this.collectionChanged = new wijmo.Event();
                // initialize the array
                if (data) {
                    data = wijmo.asArray(data);
                    this._updating++;
                    for (var i = 0; i < data.length; i++) {
                        this.push(data[i]);
                    }
                    this._updating--;
                }
            }
            /**
             * Adds one or more items to the end of the array.
             *
             * @param ...item One or more items to add to the array.
             * @return The new length of the array.
             */
            ObservableArray.prototype.push = function () {
                var item = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    item[_i - 0] = arguments[_i];
                }
                var length = this.length;
                for (var i = 0; item && i < item.length; i++) {
                    length = _super.prototype.push.call(this, item[i]);
                    if (!this._updating) {
                        this._raiseCollectionChanged(collections.NotifyCollectionChangedAction.Add, item[i], length - 1);
                    }
                }
                return length;
            };
            /*
             * Removes the last item from the array.
             *
             * @return The item that was removed from the array.
             */
            ObservableArray.prototype.pop = function () {
                var item = _super.prototype.pop.call(this);
                this._raiseCollectionChanged(collections.NotifyCollectionChangedAction.Remove, item, this.length);
                return item;
            };
            /**
             * Removes and/or adds items to the array.
             *
             * @param index Position where items will be added or removed.
             * @param count Number of items to remove from the array.
             * @param item Item to add to the array.
             * @return An array containing the removed elements.
             */
            ObservableArray.prototype.splice = function (index, count, item) {
                var rv;
                if (count && item) {
                    rv = _super.prototype.splice.call(this, index, count, item);
                    if (count == 1) {
                        this._raiseCollectionChanged(collections.NotifyCollectionChangedAction.Change, item, index);
                    }
                    else {
                        this._raiseCollectionChanged();
                    }
                    return rv;
                }
                else if (item) {
                    rv = _super.prototype.splice.call(this, index, 0, item);
                    this._raiseCollectionChanged(collections.NotifyCollectionChangedAction.Add, item, index);
                    return rv;
                }
                else {
                    rv = _super.prototype.splice.call(this, index, count);
                    if (count == 1) {
                        this._raiseCollectionChanged(collections.NotifyCollectionChangedAction.Remove, rv[0], index);
                    }
                    else {
                        this._raiseCollectionChanged();
                    }
                    return rv;
                }
            };
            /**
             * Creates a shallow copy of a portion of an array.
             *
             * @param begin Position where the copy starts.
             * @param end Position where the copy ends.
             * @return A shallow copy of a portion of an array.
             */
            ObservableArray.prototype.slice = function (begin, end) {
                return _super.prototype.slice.call(this, begin, end);
            };
            /**
             * Searches for an item in the array.
             *
             * @param searchElement Element to locate in the array.
             * @param fromIndex The index where the search should start.
             * @return The index of the item in the array, or -1 if the item was not found.
             */
            ObservableArray.prototype.indexOf = function (searchElement, fromIndex) {
                return _super.prototype.indexOf.call(this, searchElement, fromIndex);
            };
            /**
             * Sorts the elements of the array in place.
             *
             * @param compareFn Specifies a function that defines the sort order.
             * If specified, the function should take two arguments and should return
             * -1, +1, or 0 to indicate the first argument is smaller, greater than,
             * or equal to the second argument.
             * If omitted, the array is sorted in dictionary order according to the
             * string conversion of each element.
             * @return A copy of the sorted array.
             */
            ObservableArray.prototype.sort = function (compareFn) {
                var rv = _super.prototype.sort.call(this, compareFn);
                this._raiseCollectionChanged();
                return rv;
            };
            /**
             * Inserts an item at a specific position in the array.
             *
             * @param index Position where the item will be added.
             * @param item Item to add to the array.
             */
            ObservableArray.prototype.insert = function (index, item) {
                this.splice(index, 0, item);
            };
            /**
             * Removes an item from the array.
             *
             * @param item Item to remove.
             * @return True if the item was removed, false if it wasn't found in the array.
             */
            ObservableArray.prototype.remove = function (item) {
                var index = this.indexOf(item);
                if (index > -1) {
                    this.removeAt(index);
                    return true;
                }
                return false;
            };
            /**
             * Removes an item at a specific position in the array.
             *
             * @param index Position of the item to remove.
             */
            ObservableArray.prototype.removeAt = function (index) {
                this.splice(index, 1);
            };
            /**
             * Assigns an item at a specific position in the array.
             *
             * @param index Position where the item will be assigned.
             * @param item Item to assign to the array.
             */
            ObservableArray.prototype.setAt = function (index, item) {
                // make sure we have enough elements to set at the right index!
                if (index > this.length) {
                    this.length = index;
                }
                // go ahead and splice now
                this.splice(index, 1, item);
            };
            /**
             * Removes all items from the array.
             */
            ObservableArray.prototype.clear = function () {
                if (this.length !== 0) {
                    this.splice(0, this.length); // safer than setting length = 0
                    //this.length = 0; // fastest way to clear an array
                    this._raiseCollectionChanged();
                }
            };
            /**
             * Suspends notifications until the next call to @see:endUpdate.
             */
            ObservableArray.prototype.beginUpdate = function () {
                this._updating++;
            };
            /**
             * Resumes notifications suspended by a call to @see:beginUpdate.
             */
            ObservableArray.prototype.endUpdate = function () {
                if (this._updating > 0) {
                    this._updating--;
                    if (this._updating == 0) {
                        this._raiseCollectionChanged();
                    }
                }
            };
            Object.defineProperty(ObservableArray.prototype, "isUpdating", {
                /**
                 * Gets a value that indicates whether notifications are currently suspended
                 * (see @see:beginUpdate and @see:endUpdate).
                 */
                get: function () {
                    return this._updating > 0;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Executes a function within a @see:beginUpdate/@see:endUpdate block.
             *
             * The collection will not be refreshed until the function finishes.
             * This method ensures @see:endUpdate is called even if the function throws
             * an exception.
             *
             * @param fn Function to be executed without updates.
             */
            ObservableArray.prototype.deferUpdate = function (fn) {
                try {
                    this.beginUpdate();
                    fn();
                }
                finally {
                    this.endUpdate();
                }
            };
            // ** IQueryInterface
            /**
             * Returns true if the caller queries for a supported interface.
             *
             * @param interfaceName Name of the interface to look for.
             * @return True if the caller queries for a supported interface.
             */
            ObservableArray.prototype.implementsInterface = function (interfaceName) {
                return interfaceName == 'INotifyCollectionChanged';
            };
            /**
             * Raises the @see:collectionChanged event.
             *
             * @param e Contains a description of the change.
             */
            ObservableArray.prototype.onCollectionChanged = function (e) {
                if (e === void 0) { e = collections.NotifyCollectionChangedEventArgs.reset; }
                if (!this.isUpdating) {
                    this.collectionChanged.raise(this, e);
                }
            };
            // creates event args and calls onCollectionChanged
            ObservableArray.prototype._raiseCollectionChanged = function (action, item, index) {
                if (action === void 0) { action = collections.NotifyCollectionChangedAction.Reset; }
                if (!this.isUpdating) {
                    var e = new collections.NotifyCollectionChangedEventArgs(action, item, index);
                    this.onCollectionChanged(e);
                }
            };
            return ObservableArray;
        }(ArrayBase));
        collections.ObservableArray = ObservableArray;
    })(collections = wijmo.collections || (wijmo.collections = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ObservableArray.js.map