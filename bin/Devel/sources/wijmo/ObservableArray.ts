module wijmo.collections {
    'use strict';

    /**
     * Base class for Array classes with notifications.
     */
    export class ArrayBase {

        /**
         * Initializes a new instance of the @see:ArrayBase class.
         */
        constructor() {
            this.length = 0;
            Array.apply(this, arguments);
        }

        // keep TypeScript happy (these will never be called, we changed the prototype)
        pop(): any {
            return null;
        }
        push(...item: any[]): number {
            return 0;
        }
        splice(index: number, count: number, value?: any): any[] {
            return null;
        }
        slice(begin: number, end?: number): any[] {
            return null;
        }
        indexOf(searchElement: any, fromIndex?: number) {
            return -1;
        }
        sort(compareFn?: Function): any[]{
            return null;
        }
        length: number;
    }

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
    export class ObservableArray extends ArrayBase implements INotifyCollectionChanged {
        private _updating = 0;

        /**
         * Initializes a new instance of the @see:ObservableArray class.
         *
         * @param data Array containing items used to populate the @see:ObservableArray.
         */
        constructor(data? : any[]) {
            super();

            // initialize the array
            if (data) {
                data = asArray(data);
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
        push(...item: any[]): number {
            var length = this.length;
            for (var i = 0; item && i < item.length; i++) {
                length = super.push(item[i]);
                if (!this._updating) {
                    this._raiseCollectionChanged(NotifyCollectionChangedAction.Add, item[i], length - 1);
                }
            }
            return length;
        }
        /*
         * Removes the last item from the array.
         *
         * @return The item that was removed from the array.
         */
        pop(): any {
            var item = super.pop();
            this._raiseCollectionChanged(NotifyCollectionChangedAction.Remove, item, this.length);
            return item;
        }
        /**
         * Removes and/or adds items to the array.
         *
         * @param index Position where items will be added or removed.
         * @param count Number of items to remove from the array.
         * @param item Item to add to the array.
         * @return An array containing the removed elements.
         */
        splice(index: number, count: number, item?: any): any[] {
            var rv;
            if (count && item) { // add and remove items (argh)
                rv = super.splice(index, count, item);
                if (count == 1) {
                    this._raiseCollectionChanged(NotifyCollectionChangedAction.Change, item, index);
                } else {
                    this._raiseCollectionChanged();
                }
                return rv;
            } else if (item) { // add a value to the array
                rv = super.splice(index, 0, item);
                this._raiseCollectionChanged(NotifyCollectionChangedAction.Add, item, index);
                return rv;
            } else { // remove one or more items from the array
                rv = super.splice(index, count);
                if (count == 1) {
                    this._raiseCollectionChanged(NotifyCollectionChangedAction.Remove, rv[0], index);
                } else {
                    this._raiseCollectionChanged();
                }
                return rv;
            }
        }
        /**
         * Creates a shallow copy of a portion of an array.
         *
         * @param begin Position where the copy starts.
         * @param end Position where the copy ends.
         * @return A shallow copy of a portion of an array.
         */
        slice(begin?: number, end?: number): any[] {
            return super.slice(begin, end);
        }
        /**
         * Searches for an item in the array.
         *
         * @param searchElement Element to locate in the array.
         * @param fromIndex The index where the search should start.
         * @return The index of the item in the array, or -1 if the item was not found.
         */
        indexOf(searchElement: any, fromIndex?: number): number {
            return super.indexOf(searchElement, fromIndex);
        }
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
        sort(compareFn?: Function): any[] {
            var rv = super.sort(compareFn);
            this._raiseCollectionChanged();
            return rv;
        }
        /**
         * Inserts an item at a specific position in the array.
         *
         * @param index Position where the item will be added.
         * @param item Item to add to the array.
         */
        insert(index: number, item: any) {
            this.splice(index, 0, item);
        }
        /**
         * Removes an item from the array.
         *
         * @param item Item to remove.
         * @return True if the item was removed, false if it wasn't found in the array.
         */
        remove(item: any): boolean {
            var index = this.indexOf(item);
            if (index > -1) {
                this.removeAt(index);
                return true;
            }
            return false;
        }
        /**
         * Removes an item at a specific position in the array.
         *
         * @param index Position of the item to remove.
         */
        removeAt(index: number) {
            this.splice(index, 1);
        }
        /**
         * Assigns an item at a specific position in the array.
         *
         * @param index Position where the item will be assigned.
         * @param item Item to assign to the array.
         */
        setAt(index: number, item: any) {

            // make sure we have enough elements to set at the right index!
            if (index > this.length) {
                this.length = index;
            }

            // go ahead and splice now
            this.splice(index, 1, item);
        }
        /**
         * Removes all items from the array.
         */
        clear() {
            if (this.length !== 0) {
                this.splice(0, this.length); // safer than setting length = 0
                //this.length = 0; // fastest way to clear an array
                this._raiseCollectionChanged();
            }
        }
        /**
         * Suspends notifications until the next call to @see:endUpdate.
         */
        beginUpdate() {
            this._updating++;
        }
        /**
         * Resumes notifications suspended by a call to @see:beginUpdate.
         */
        endUpdate() {
            if (this._updating > 0) {
                this._updating--;
                if (this._updating == 0) {
                    this._raiseCollectionChanged();
                }
            }
        }
        /**
         * Gets a value that indicates whether notifications are currently suspended
         * (see @see:beginUpdate and @see:endUpdate).
         */
        get isUpdating() {
            return this._updating > 0;
        }
        /**
         * Executes a function within a @see:beginUpdate/@see:endUpdate block.
         *
         * The collection will not be refreshed until the function finishes. 
         * This method ensures @see:endUpdate is called even if the function throws
         * an exception.
         *
         * @param fn Function to be executed without updates. 
         */
        deferUpdate(fn: Function) {
            try {
                this.beginUpdate();
                fn();
            } finally {
                this.endUpdate();
            }
        }

        // ** IQueryInterface

        /**
         * Returns true if the caller queries for a supported interface.
         *
         * @param interfaceName Name of the interface to look for.
         * @return True if the caller queries for a supported interface.
         */
        implementsInterface(interfaceName: string): boolean {
            return interfaceName == 'INotifyCollectionChanged';
        }

        // ** INotifyCollectionChanged

        /**
         * Occurs when the collection changes.
         */
        collectionChanged = new Event();
        /**
         * Raises the @see:collectionChanged event.
         *
         * @param e Contains a description of the change.
         */
        onCollectionChanged(e = NotifyCollectionChangedEventArgs.reset) {
            if (!this.isUpdating) {
                this.collectionChanged.raise(this, e);
            }
        }

        // creates event args and calls onCollectionChanged
        private _raiseCollectionChanged(action = NotifyCollectionChangedAction.Reset, item?: any, index?: number) {
            if (!this.isUpdating) {
                var e = new NotifyCollectionChangedEventArgs(action, item, index);
                this.onCollectionChanged(e);
            }
        }
    }
}