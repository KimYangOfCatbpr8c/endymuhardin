var wijmo;
(function (wijmo) {
    var collections;
    (function (collections) {
        'use strict';
        /**
         * Class that implements the @see:ICollectionView interface to expose data in
         * regular JavaScript arrays.
         *
         * The @see:CollectionView class implements the following interfaces:
         * <ul>
         *   <li>@see:ICollectionView: provides current record management,
         *       custom sorting, filtering, and grouping.</li>
         *   <li>@see:IEditableCollectionView: provides methods for editing,
         *       adding, and removing items.</li>
         *   <li>@see:IPagedCollectionView: provides paging.</li>
         * </ul>
         *
         * To use the @see:CollectionView class, start by declaring it and passing a
         * regular array as a data source. Then configure the view using the
         * @see:filter, @see:sortDescriptions, @see:groupDescriptions, and
         * @see:pageSize properties. Finally, access the view using the @see:items
         * property. For example:
         *
         * <pre>// create a new CollectionView
         * var cv = new wijmo.collections.CollectionView(myArray);
         *
         * // sort items by amount in descending order
         * var sd = new wijmo.collections.SortDescription('amount', false);
         * cv.sortDescriptions.push(sd);
         *
         * // show only items with amounts greater than 100
         * cv.filter = function(item) { return item.amount &gt; 100 };
         *
         * // show the sorted, filtered result on the console
         * for (var i = 0; i &lt; cv.items.length; i++) {
         *   var item = cv.items[i];
         *   console.log(i + ': ' + item.name + ' ' + item.amount);
         * }</pre>
         */
        var CollectionView = (function () {
            /**
             * Initializes a new instance of the @see:CollectionView class.
             *
             * @param sourceCollection Array that serves as a source for this
             * @see:CollectionView.
             * @param options JavaScript object containing initialization data for the control.
             */
            function CollectionView(sourceCollection, options) {
                var _this = this;
                this._idx = -1;
                this._srtDsc = new collections.ObservableArray();
                this._grpDesc = new collections.ObservableArray();
                this._newItem = null;
                this._edtItem = null;
                this._pgSz = 0;
                this._pgIdx = 0;
                this._updating = 0;
                this._canFilter = true;
                this._canGroup = true;
                this._canSort = true;
                this._canAddNew = true;
                this._canCancelEdit = true;
                this._canRemove = true;
                this._canChangePage = true;
                this._trackChanges = false;
                this._chgAdded = new collections.ObservableArray();
                this._chgRemoved = new collections.ObservableArray();
                this._chgEdited = new collections.ObservableArray();
                // ** INotifyCollectionChanged
                /**
                 * Occurs when the collection changes.
                 */
                this.collectionChanged = new wijmo.Event();
                /**
                 * Occurs before the value of the @see:sourceCollection property changes.
                 */
                this.sourceCollectionChanging = new wijmo.Event();
                /**
                 * Occurs after the value of the @see:sourceCollection property changes.
                 */
                this.sourceCollectionChanged = new wijmo.Event();
                /**
                 * Occurs after the current item changes.
                 */
                this.currentChanged = new wijmo.Event();
                /**
                 * Occurs before the current item changes.
                 */
                this.currentChanging = new wijmo.Event();
                /**
                * Occurs after the page index changes.
                */
                this.pageChanged = new wijmo.Event();
                /**
                 * Occurs before the page index changes.
                 */
                this.pageChanging = new wijmo.Event();
                // check that sortDescriptions contains SortDescriptions
                this._srtDsc.collectionChanged.addHandler(function () {
                    var arr = _this._srtDsc;
                    for (var i = 0; i < arr.length; i++) {
                        wijmo.assert(arr[i] instanceof collections.SortDescription, 'sortDescriptions array must contain SortDescription objects.');
                    }
                    if (_this.canSort) {
                        _this.refresh();
                    }
                });
                // check that groupDescriptions contains GroupDescriptions
                this._grpDesc.collectionChanged.addHandler(function () {
                    var arr = _this._grpDesc;
                    for (var i = 0; i < arr.length; i++) {
                        wijmo.assert(arr[i] instanceof collections.GroupDescription, 'groupDescriptions array must contain GroupDescription objects.');
                    }
                    if (_this.canGroup) {
                        _this.refresh();
                    }
                });
                // initialize the source collection
                this.sourceCollection = sourceCollection ? sourceCollection : new collections.ObservableArray();
                // apply options
                if (options) {
                    this.beginUpdate();
                    wijmo.copy(this, options);
                    this.endUpdate();
                }
            }
            // method used in JSON-style initialization
            CollectionView.prototype._copy = function (key, value) {
                if (key == 'sortDescriptions') {
                    this.sortDescriptions.clear();
                    var arr = wijmo.asArray(value);
                    for (var i = 0; i < arr.length; i++) {
                        var val = arr[i];
                        if (wijmo.isString(val)) {
                            val = new collections.SortDescription(val, true);
                        }
                        this.sortDescriptions.push(val);
                    }
                    return true;
                }
                if (key == 'groupDescriptions') {
                    this.groupDescriptions.clear();
                    var arr = wijmo.asArray(value);
                    for (var i = 0; i < arr.length; i++) {
                        var val = arr[i];
                        if (wijmo.isString(val)) {
                            val = new collections.PropertyGroupDescription(val);
                        }
                        this.groupDescriptions.push(val);
                    }
                    return true;
                }
                return false;
            };
            Object.defineProperty(CollectionView.prototype, "newItemCreator", {
                /**
                 * Gets or sets a function that creates new items for the collection.
                 *
                 * If the creator function is not supplied, the @see:CollectionView
                 * will try to create an uninitialized item of the appropriate type.
                 *
                 * If the creator function is supplied, it should be a function that
                 * takes no parameters and returns an initialized object of the proper
                 * type for the collection.
                 */
                get: function () {
                    return this._itemCreator;
                },
                set: function (value) {
                    this._itemCreator = wijmo.asFunction(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionView.prototype, "sortConverter", {
                /**
                 * Gets or sets a function used to convert values when sorting.
                 *
                 * If provided, the function should take as parameters a
                 * @see:SortDescription, a data item, and a value to convert,
                 * and should return the converted value.
                 *
                 * This property provides a way to customize sorting. For example,
                 * the @see:FlexGrid control uses it to sort mapped columns by
                 * display value instead of by raw value.
                 *
                 * For example, the code below causes a @see:CollectionView to
                 * sort the 'country' property, which contains country code integers,
                 * using the corresponding country names:
                 *
                 * <pre>var countries = 'US,Germany,UK,Japan,Italy,Greece'.split(',');
                 * collectionView.sortConverter = function (sd, item, value) {
                 *   if (sd.property == 'countryMapped') {
                 *     value = countries[value]; // convert country id into name
                 *   }
                 *   return value;
                 * }</pre>
                 */
                get: function () {
                    return this._srtCvt;
                },
                set: function (value) {
                    if (value != this._srtCvt) {
                        this._srtCvt = wijmo.asFunction(value, true);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionView.prototype, "sortComparer", {
                /**
                 * Gets or sets a function used to compare values when sorting.
                 *
                 * If provided, the sort comparer function should take as parameters
                 * two values of any type, and should return -1, 0, or +1 to indicate
                 * whether the first value is smaller than, equal to, or greater than
                 * the second. If the sort comparer returns null, the standard built-in
                 * comparer is used.
                 *
                 * This @see:sortComparer property allows you to use custom comparison
                 * algorithms that in some cases result in sorting sequences that are
                 * more consistent with user's expectations than plain string comparisons.
                 *
                 * For example, see <a href="http://www.davekoelle.com/alphanum.html">Dave Koele's Alphanum algorithm</a>.
                 * It breaks up strings into chunks composed of strings or numbers, then
                 * sorts number chunks in value order and string chunks in ASCII order.
                 * Dave calls the result a "natural sorting order".
                 *
                 * The example below shows a typical use for the @see:sortComparer property:
                 * <pre>// create a CollectionView with a custom sort comparer
                 * var dataCustomSort = new wijmo.collections.CollectionView(data, {
                 *   sortComparer: function (a, b) {
                 *     return wijmo.isString(a) && wijmo.isString(b)
                 *       ? alphanum(a, b) // custom comparer used for strings
                 *       : null; // use default comparer used for everything else
                 *   }
                 * });</pre>
                 */
                get: function () {
                    return this._srtCmp;
                },
                set: function (value) {
                    if (value != this._srtCmp) {
                        this._srtCmp = wijmo.asFunction(value, true);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionView.prototype, "useStableSort", {
                /**
                 * Gets or sets whether to use a stable sort algorithm.
                 *
                 * Stable sorting algorithms maintain the relative order of records with equal keys.
                 * For example, consider a collection of objects with an "Amount" field.
                 * If you sort the collection by "Amount", a stable sort will keep the original
                 * order of records with the same Amount value.
                 *
                 * This property is false by default, which causes the @see:CollectionView to use
                 * JavaScript's built-in sort method, which is very fast but not stable. Setting
                 * the @see:useStableSort property to true increases sort times by 30% to 50%, which
                 * can be significant for large collections.
                 */
                get: function () {
                    return this._stableSort;
                },
                set: function (value) {
                    this._stableSort = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Calculates an aggregate value for the items in this collection.
             *
             * @param aggType Type of aggregate to calculate.
             * @param binding Property to aggregate on.
             * @param currentPage Whether to include only items on the current page.
             * @return The aggregate value.
             */
            CollectionView.prototype.getAggregate = function (aggType, binding, currentPage) {
                var items = currentPage ? this._pgView : this._view;
                return wijmo.getAggregate(aggType, items, binding);
            };
            // ** IQueryInterface
            /**
             * Returns true if the caller queries for a supported interface.
             *
             * @param interfaceName Name of the interface to look for.
             */
            CollectionView.prototype.implementsInterface = function (interfaceName) {
                switch (interfaceName) {
                    case 'ICollectionView':
                    case 'IEditableCollectionView':
                    case 'IPagedCollectionView':
                    case 'INotifyCollectionChanged':
                        return true;
                }
                return false;
            };
            Object.defineProperty(CollectionView.prototype, "trackChanges", {
                /**
                 * Gets or sets a value that determines whether the control should
                 * track changes to the data.
                 *
                 * If @see:trackChanges is set to true, the @see:CollectionView keeps
                 * track of changes to the data and exposes them through the
                 * @see:itemsAdded, @see:itemsRemoved, and @see:itemsEdited collections.
                 *
                 * Tracking changes is useful in situations where you need to update
                 * the server after the user has confirmed that the modifications are
                 * valid.
                 *
                 * After committing or cancelling changes, use the @see:clearChanges method
                 * to clear the @see:itemsAdded, @see:itemsRemoved, and @see:itemsEdited
                 * collections.
                 *
                 * The @see:CollectionView only tracks changes made when the proper
                 * @see:CollectionView methods are used (@see:editItem/@see:commitEdit,
                 * @see:addNew/@see:commitNew, and @see:remove).
                 * Changes made directly to the data are not tracked.
                 */
                get: function () {
                    return this._trackChanges;
                },
                set: function (value) {
                    this._trackChanges = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionView.prototype, "itemsAdded", {
                /**
                 * Gets an @see:ObservableArray containing the records that were added to
                 * the collection since @see:trackChanges was enabled.
                 */
                get: function () {
                    return this._chgAdded;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionView.prototype, "itemsRemoved", {
                /**
                 * Gets an @see:ObservableArray containing the records that were removed from
                 * the collection since @see:trackChanges was enabled.
                 */
                get: function () {
                    return this._chgRemoved;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionView.prototype, "itemsEdited", {
                /**
                 * Gets an @see:ObservableArray containing the records that were edited in
                 * the collection since @see:trackChanges was enabled.
                 */
                get: function () {
                    return this._chgEdited;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Clears all changes by removing all items in the @see:itemsAdded,
             * @see:itemsRemoved, and @see:itemsEdited collections.
             *
             * Call this method after committing changes to the server or
             * after refreshing the data from the server.
             */
            CollectionView.prototype.clearChanges = function () {
                this._chgAdded.clear();
                this._chgRemoved.clear();
                this._chgEdited.clear();
            };
            /**
             * Raises the @see:collectionChanged event.
             *
             * @param e Contains a description of the change.
             */
            CollectionView.prototype.onCollectionChanged = function (e) {
                if (e === void 0) { e = collections.NotifyCollectionChangedEventArgs.reset; }
                // track changes applied to items outside of editItem/commitEdit blocks (TFS 204805)
                if (!this._committing && !this._canceling &&
                    e.action == collections.NotifyCollectionChangedAction.Change &&
                    e.item != this.currentEditItem) {
                    this._trackItemChanged(e.item);
                }
                // raise the event as usual
                this.collectionChanged.raise(this, e);
            };
            // creates event args and calls onCollectionChanged
            CollectionView.prototype._raiseCollectionChanged = function (action, item, index) {
                if (action === void 0) { action = collections.NotifyCollectionChangedAction.Reset; }
                //console.log('** collection changed: ' + NotifyCollectionChangedAction[action] + ' **');
                var e = new collections.NotifyCollectionChangedEventArgs(action, item, index);
                this.onCollectionChanged(e);
            };
            /**
             * Raises the @see:sourceCollectionChanging event.
             *
             * @param e @see:CancelEventArgs that contains the event data.
             */
            CollectionView.prototype.onSourceCollectionChanging = function (e) {
                this.sourceCollectionChanging.raise(this, e);
                return !e.cancel;
            };
            /**
             * Raises the @see:sourceCollectionChanged event.
             */
            CollectionView.prototype.onSourceCollectionChanged = function (e) {
                this.sourceCollectionChanged.raise(this, e);
            };
            Object.defineProperty(CollectionView.prototype, "canFilter", {
                // ** ICollectionView
                /**
                 * Gets a value that indicates whether this view supports filtering via the
                 * @see:filter property.
                 */
                get: function () {
                    return this._canFilter;
                },
                set: function (value) {
                    this._canFilter = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionView.prototype, "canGroup", {
                /**
                 * Gets a value that indicates whether this view supports grouping via the
                 * @see:groupDescriptions property.
                 */
                get: function () {
                    return this._canGroup;
                },
                set: function (value) {
                    this._canGroup = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionView.prototype, "canSort", {
                /**
                 * Gets a value that indicates whether this view supports sorting via the
                 * @see:sortDescriptions property.
                 */
                get: function () {
                    return this._canSort;
                },
                set: function (value) {
                    this._canSort = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionView.prototype, "currentItem", {
                /**
                 * Gets or sets the current item in the view.
                 */
                get: function () {
                    return this._pgView && this._idx > -1 && this._idx < this._pgView.length
                        ? this._pgView[this._idx]
                        : null;
                },
                set: function (value) {
                    this.moveCurrentTo(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionView.prototype, "currentPosition", {
                /**
                 * Gets the ordinal position of the current item in the view.
                 */
                get: function () {
                    return this._idx;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionView.prototype, "filter", {
                /**
                 * Gets or sets a callback used to determine if an item is suitable for
                 * inclusion in the view.
                 *
                 * The callback function should return true if the item passed in as a
                 * parameter should be included in the view.
                 *
                 * NOTE: If the filter function needs a scope (i.e. a meaningful 'this'
                 * value) remember to set the filter using the 'bind' function to specify
                 * the 'this' object. For example:
                 * <pre>
                 *   collectionView.filter = this._filter.bind(this);
                 * </pre>
                 */
                get: function () {
                    return this._filter;
                },
                set: function (value) {
                    if (this._filter != value) {
                        this._filter = wijmo.asFunction(value);
                        if (this.canFilter) {
                            this.refresh();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionView.prototype, "groupDescriptions", {
                /**
                 * Gets a collection of @see:GroupDescription objects that describe how the
                 * items in the collection are grouped in the view.
                 */
                get: function () {
                    return this._grpDesc;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionView.prototype, "groups", {
                /**
                 * Gets an array of @see:CollectionViewGroup objects that represents the
                 * top-level groups.
                 */
                get: function () {
                    return this._groups;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionView.prototype, "isEmpty", {
                /**
                 * Gets a value that indicates whether this view contains no items.
                 */
                get: function () {
                    return !this._pgView || !this._pgView.length;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionView.prototype, "sortDescriptions", {
                /**
                 * Gets a collection of @see:SortDescription objects that describe how the items
                 * in the collection are sorted in the view.
                 */
                get: function () {
                    return this._srtDsc;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionView.prototype, "sourceCollection", {
                /**
                 * Gets or sets the underlying (unfiltered and unsorted) collection.
                 */
                get: function () {
                    return this._src;
                },
                set: function (sourceCollection) {
                    if (sourceCollection != this._src) {
                        // raise changing event
                        if (!this.onSourceCollectionChanging(new wijmo.CancelEventArgs())) {
                            return;
                        }
                        // keep track of current index
                        var index = this.currentPosition;
                        // commit pending changes
                        this.commitEdit();
                        this.commitNew();
                        // disconnect old source
                        if (this._ncc != null) {
                            this._ncc.collectionChanged.removeHandler(this._sourceChanged);
                        }
                        // connect new source
                        this._src = wijmo.asArray(sourceCollection, false);
                        this._ncc = wijmo.tryCast(this._src, 'INotifyCollectionChanged');
                        if (this._ncc) {
                            this._ncc.collectionChanged.addHandler(this._sourceChanged, this);
                        }
                        // clear any changes
                        this.clearChanges();
                        // refresh view
                        this.refresh();
                        this.moveCurrentToFirst();
                        // raise changed event
                        this.onSourceCollectionChanged();
                        // if we have no items, notify listeners that the current index changed
                        if (this.currentPosition < 0 && index > -1) {
                            this.onCurrentChanged();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            // handle notifications from the source collection
            CollectionView.prototype._sourceChanged = function (s, e) {
                if (this._updating <= 0) {
                    this.refresh(); // TODO: optimize
                }
            };
            /**
             * Returns a value indicating whether a given item belongs to this view.
             *
             * @param item Item to seek.
             */
            CollectionView.prototype.contains = function (item) {
                return this._pgView.indexOf(item) > -1;
            };
            /**
             * Sets the specified item to be the current item in the view.
             *
             * @param item Item that will become current.
             */
            CollectionView.prototype.moveCurrentTo = function (item) {
                return this.moveCurrentToPosition(this._pgView.indexOf(item));
            };
            /**
             * Sets the first item in the view as the current item.
             */
            CollectionView.prototype.moveCurrentToFirst = function () {
                return this.moveCurrentToPosition(0);
            };
            /**
             * Sets the last item in the view as the current item.
             */
            CollectionView.prototype.moveCurrentToLast = function () {
                return this.moveCurrentToPosition(this._pgView.length - 1);
            };
            /**
             * Sets the item before the current item in the view as the current item.
             */
            CollectionView.prototype.moveCurrentToPrevious = function () {
                return this._idx > 0 ? this.moveCurrentToPosition(this._idx - 1) : false;
            };
            /**
             * Sets the item after the current item in the view as the current item.
             */
            CollectionView.prototype.moveCurrentToNext = function () {
                return this.moveCurrentToPosition(this._idx + 1);
            };
            /**
             * Sets the item at the specified index in the view as the current item.
             *
             * @param index Index of the item that will become current.
             */
            CollectionView.prototype.moveCurrentToPosition = function (index) {
                if (index >= -1 && index < this._pgView.length) {
                    var e = new wijmo.CancelEventArgs();
                    if (this._idx != index && this.onCurrentChanging(e)) {
                        // when moving away from current edit/new item, commit
                        if (this._edtItem && this._pgView[index] != this._edtItem) {
                            this.commitEdit();
                        }
                        if (this._newItem && this._pgView[index] != this._newItem) {
                            this.commitNew();
                        }
                        // update currency
                        this._idx = index;
                        this.onCurrentChanged();
                    }
                }
                return this._idx == index;
            };
            /**
             * Re-creates the view using the current sort, filter, and group parameters.
             */
            CollectionView.prototype.refresh = function () {
                // not while updating, adding, or editing
                if (this._updating > 0 || this._newItem || this._edtItem) {
                    return;
                }
                // perform the refresh
                this._performRefresh();
                // notify listeners
                this.onCollectionChanged();
            };
            // performs the refresh (without issuing notifications)
            CollectionView.prototype._performRefresh = function () {
                // benchmark
                //var start = new Date();
                // save current item
                var current = this.currentItem;
                // create filtered view
                if (!this._src) {
                    this._view = [];
                }
                else if (!this._filter || !this.canFilter) {
                    this._view = (this._srtDsc.length > 0 && this.canSort)
                        ? this._src.slice(0) // clone source array
                        : this._src; // don't waste time cloning
                }
                else {
                    this._view = this._performFilter(this._src);
                }
                // apply sort
                if (this.canSort && this._srtDsc.length > 0) {
                    this._performSort(this._view);
                }
                // apply grouping
                this._groups = this.canGroup ? this._createGroups(this._view) : null;
                this._fullGroups = this._groups;
                if (this._groups) {
                    this._view = this._mergeGroupItems(this._groups);
                }
                // apply paging to view
                this._pgIdx = wijmo.clamp(this._pgIdx, 0, this.pageCount - 1);
                this._pgView = this._getPageView();
                // update groups to take paging into account
                if (this._groups && this.pageCount > 1) {
                    this._groups = this._createGroups(this._pgView);
                    this._mergeGroupItems(this._groups);
                }
                // restore current item
                var index = this._pgView.indexOf(current);
                if (index < 0) {
                    index = Math.min(this._idx, this._pgView.length - 1);
                }
                this._idx = index;
                // save group digest to optimize updates (TFS 109119)
                this._digest = this._getGroupsDigest(this.groups);
                // raise currentChanged if needed
                if (this.currentItem !== current) {
                    this.onCurrentChanged();
                }
                //var now = new Date();
                //console.log('refreshed in ' + (now.getTime() - start.getTime()) / 1000 + ' seconds');
            };
            // sorts an array in-place using the current sort descriptions
            CollectionView.prototype._performSort = function (items) {
                if (this._stableSort) {
                    // stable sort (nice, but 30-50% slower)
                    // https://bugs.chromium.org/p/v8/issues/detail?id=90
                    var arrIndexed = items.map(function (item, index) { return { item: item, index: index }; }), compare = this._compareItems();
                    arrIndexed.sort(function (a, b) {
                        var r = compare(a.item, b.item);
                        return r == 0 ? a.index - b.index : r;
                    });
                    for (var i = 0; i < items.length; i++) {
                        items[i] = arrIndexed[i].item;
                    }
                }
                else {
                    // regular sort, not stable but very fast
                    items.sort(this._compareItems());
                }
            };
            // this function is used in some of our samples, so
            // if we remove it or change its name some things will break...
            CollectionView.prototype._compareItems = function () {
                var srtDsc = this._srtDsc, srtCvt = this._srtCvt, srtCmp = this._srtCmp, init = true, cmp = 0;
                return function (a, b) {
                    for (var i = 0; i < srtDsc.length; i++) {
                        // get values
                        var sd = srtDsc[i], v1 = sd._bnd.getValue(a), v2 = sd._bnd.getValue(b);
                        // custom converter function (before changing case! TFS 149638)
                        if (srtCvt) {
                            v1 = srtCvt(sd, a, v1, init);
                            v2 = srtCvt(sd, b, v2, false);
                            init = false;
                        }
                        // custom comparison function (TFS 151665)
                        if (srtCmp) {
                            cmp = srtCmp(v1, v2);
                            if (cmp != null) {
                                return sd.ascending ? +cmp : -cmp;
                            }
                        }
                        // check for NaN (isNaN returns true for NaN but also for non-numbers)
                        if (v1 !== v1)
                            v1 = null;
                        if (v2 !== v2)
                            v2 = null;
                        // ignore case when sorting unless the values are strings that only differ in case
                        // (to keep the sort consistent, TFS 131135)
                        if (typeof (v1) === 'string' && typeof (v2) === 'string') {
                            var lc1 = v1.toLowerCase(), lc2 = v2.toLowerCase();
                            if (lc1 != lc2) {
                                v1 = lc1;
                                v2 = lc2;
                            }
                        }
                        // nulls always at the bottom (like excel)
                        if (v1 != null && v2 == null)
                            return -1;
                        if (v1 == null && v2 != null)
                            return +1;
                        // compare the values (at last!)
                        cmp = (v1 < v2) ? -1 : (v1 > v2) ? +1 : 0;
                        if (cmp != 0) {
                            return sd.ascending ? +cmp : -cmp;
                        }
                    }
                    return 0;
                };
            };
            // returns an array filtered using the current filter definition
            CollectionView.prototype._performFilter = function (items) {
                return this.canFilter && this._filter
                    ? items.filter(this._filter, this)
                    : items;
            };
            /**
             * Raises the @see:currentChanged event.
             */
            CollectionView.prototype.onCurrentChanged = function (e) {
                if (e === void 0) { e = wijmo.EventArgs.empty; }
                this.currentChanged.raise(this, e);
            };
            /**
             * Raises the @see:currentChanging event.
             *
             * @param e @see:CancelEventArgs that contains the event data.
             */
            CollectionView.prototype.onCurrentChanging = function (e) {
                this.currentChanging.raise(this, e);
                return !e.cancel;
            };
            Object.defineProperty(CollectionView.prototype, "items", {
                /**
                 * Gets items in the view.
                 */
                get: function () {
                    return this._pgView;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Suspend refreshes until the next call to @see:endUpdate.
             */
            CollectionView.prototype.beginUpdate = function () {
                this._updating++;
            };
            /**
             * Resume refreshes suspended by a call to @see:beginUpdate.
             */
            CollectionView.prototype.endUpdate = function () {
                this._updating--;
                if (this._updating <= 0) {
                    this.refresh();
                }
            };
            Object.defineProperty(CollectionView.prototype, "isUpdating", {
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
            CollectionView.prototype.deferUpdate = function (fn) {
                try {
                    this.beginUpdate();
                    fn();
                }
                finally {
                    this.endUpdate();
                }
            };
            Object.defineProperty(CollectionView.prototype, "canAddNew", {
                // ** IEditableCollectionView
                /**
                 * Gets a value that indicates whether a new item can be added to the collection.
                 */
                get: function () {
                    return this._canAddNew;
                },
                set: function (value) {
                    this._canAddNew = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionView.prototype, "canCancelEdit", {
                /**
                 * Gets a value that indicates whether the collection view can discard pending changes
                 * and restore the original values of an edited object.
                 */
                get: function () {
                    return this._canCancelEdit;
                },
                set: function (value) {
                    this._canCancelEdit = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionView.prototype, "canRemove", {
                /**
                 * Gets a value that indicates whether items can be removed from the collection.
                 */
                get: function () {
                    return this._canRemove;
                },
                set: function (value) {
                    this._canRemove = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionView.prototype, "currentAddItem", {
                /**
                 * Gets the item that is being added during the current add transaction.
                 */
                get: function () {
                    return this._newItem;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionView.prototype, "currentEditItem", {
                /**
                 * Gets the item that is being edited during the current edit transaction.
                 */
                get: function () {
                    return this._edtItem;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionView.prototype, "isAddingNew", {
                /**
                 * Gets a value that indicates whether an add transaction is in progress.
                 */
                get: function () {
                    return this._newItem != null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionView.prototype, "isEditingItem", {
                /**
                 * Gets a value that indicates whether an edit transaction is in progress.
                 */
                get: function () {
                    return this._edtItem != null;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Creates a new item and adds it to the collection.
             *
             * This method takes no parameters. It creates a new item, adds it to the
             * collection, and prevents refresh operations until the new item is
             * committed using the @see:commitNew method or canceled using the
             * @see:cancelNew method.
             *
             * The code below shows how the @see:addNew method is typically used:
             *
             * <pre>
             * // create the new item, add it to the collection
             * var newItem = view.addNew();
             * // initialize the new item
             * newItem.id = getFreshId();
             * newItem.name = 'New Customer';
             * // commit the new item so the view can be refreshed
             * view.commitNew();
             * </pre>
             *
             * You can also add new items by pushing them into the @see:sourceCollection
             * and then calling the @see:refresh method. The main advantage of @see:addNew
             * is in user-interactive scenarios (like adding new items in a data grid),
             * because it gives users the ability to cancel the add operation. It also
             * prevents the new item from being sorted or filtered out of view until the
             * add operation is committed.
             *
             * @return The item that was added to the collection.
             */
            CollectionView.prototype.addNew = function () {
                // sanity
                if (arguments.length > 0) {
                    wijmo.assert(false, 'addNew does not take any parameters, it creates the new items.');
                }
                // commit pending changes
                this.commitEdit();
                this.commitNew();
                // honor canAddNew
                if (!this.canAddNew) {
                    wijmo.assert(false, 'cannot add items (canAddNew == false).');
                    return null;
                }
                // create new item
                var item = null, src = this.sourceCollection;
                if (this.newItemCreator) {
                    item = this.newItemCreator();
                }
                else if (src && src.length) {
                    item = new src[0].constructor();
                }
                else {
                    item = {};
                }
                if (item != null) {
                    // remember the new item
                    this._newItem = item;
                    // add the new item to the collection
                    this._updating++;
                    this._src.push(item); // **
                    this._updating--;
                    // add the new item to the bottom of the current view
                    if (this._pgView != this._src) {
                        this._pgView.push(item);
                    }
                    // add the new item to the last group and to the data items
                    if (this.groups && this.groups.length) {
                        var g = this.groups[this.groups.length - 1];
                        g.items.push(item);
                        while (g.groups && g.groups.length) {
                            g = g.groups[g.groups.length - 1];
                            g.items.push(item);
                        }
                    }
                    // notify listeners
                    this._raiseCollectionChanged(collections.NotifyCollectionChangedAction.Add, item, this._pgView.length - 1);
                    // select the new item
                    this.moveCurrentTo(item);
                }
                // done
                return this._newItem;
            };
            /**
             * Ends the current edit transaction and, if possible,
             * restores the original value to the item.
             */
            CollectionView.prototype.cancelEdit = function () {
                var item = this._edtItem;
                if (item != null) {
                    this._edtItem = null;
                    // honor canCancelEdit
                    if (!this.canCancelEdit) {
                        wijmo.assert(false, 'cannot cancel edits (canCancelEdit == false).');
                        return;
                    }
                    // check that we can do this (TFS 110168)
                    var index = this._src.indexOf(item);
                    if (index < 0 || !this._edtClone) {
                        return;
                    }
                    // restore original item value
                    this._extend(this._src[index], this._edtClone);
                    this._edtClone = null;
                    // notify listeners
                    this._canceling = true;
                    this._raiseCollectionChanged(collections.NotifyCollectionChangedAction.Change, item, index);
                    this._canceling = false;
                }
            };
            /**
             * Ends the current add transaction and discards the pending new item.
             */
            CollectionView.prototype.cancelNew = function () {
                var item = this._newItem;
                if (item != null) {
                    this.remove(item);
                }
            };
            /**
             * Ends the current edit transaction and saves the pending changes.
             */
            CollectionView.prototype.commitEdit = function () {
                var item = this._edtItem;
                if (item != null) {
                    // start committing
                    this._committing = true;
                    // check if anything really changed
                    var sameContent = this._sameContent(item, this._edtClone);
                    // clean up state
                    this._edtItem = null;
                    this._edtClone = null;
                    // refresh to update the edited item
                    var index = this._pgView.indexOf(item);
                    var digest = this._digest;
                    this._performRefresh();
                    // track changes (before notifying)
                    if (!sameContent) {
                        this._trackItemChanged(item);
                    }
                    // notify (single item change or full refresh)
                    if (this._pgView.indexOf(item) == index && digest == this._digest) {
                        this._raiseCollectionChanged(collections.NotifyCollectionChangedAction.Change, item, index);
                    }
                    else {
                        this._raiseCollectionChanged(); // full refresh
                    }
                    // done committing
                    this._committing = false;
                }
            };
            /**
             * Ends the current add transaction and saves the pending new item.
             */
            CollectionView.prototype.commitNew = function () {
                var item = this._newItem;
                if (item != null) {
                    // clean up state
                    this._newItem = null;
                    // refresh to update the new item
                    var index = this._pgView.indexOf(item);
                    var digest = this._digest;
                    this._performRefresh();
                    // track changes (before notifying)
                    if (this._trackChanges == true) {
                        var idx = this._chgEdited.indexOf(item);
                        if (idx > -1) {
                            this._chgEdited.removeAt(idx);
                        }
                        if (this._chgAdded.indexOf(item) < 0) {
                            this._chgAdded.push(item);
                        }
                    }
                    // notify (full refresh if the item moved)
                    if (this._pgView.indexOf(item) == index && digest == this._digest) {
                        this._raiseCollectionChanged(collections.NotifyCollectionChangedAction.Change, item, index);
                    }
                    else {
                        this._raiseCollectionChanged(); // full refresh
                    }
                }
            };
            /**
             * Begins an edit transaction of the specified item.
             *
             * @param item Item to be edited.
             */
            CollectionView.prototype.editItem = function (item) {
                // commit pending changes if not already editing/adding this item
                if (item != this._edtItem && this.moveCurrentTo(item)) {
                    this.commitEdit();
                    this._edtItem = item;
                    this._edtClone = {};
                    this._extend(this._edtClone, this._edtItem);
                }
            };
            /**
             * Removes the specified item from the collection.
             *
             * @param item Item to be removed from the collection.
             */
            CollectionView.prototype.remove = function (item) {
                // handle cases where the user is adding or editing items
                var pendingNew = (item == this._newItem);
                if (pendingNew) {
                    this._newItem = null;
                }
                if (item == this._edtItem) {
                    this.cancelEdit();
                }
                // honor canRemove
                if (!this.canRemove) {
                    wijmo.assert(false, 'cannot remove items (canRemove == false).');
                    return;
                }
                // find item
                var index = this._src.indexOf(item);
                if (index > -1) {
                    // get current item to notify later
                    var current = this.currentItem;
                    // remove item from source collection
                    this._updating++;
                    this._src.splice(index, 1); // **
                    this._updating--;
                    // refresh to update the removed item
                    //var index = this._pgView.indexOf(item);
                    var digest = this._digest;
                    this._performRefresh();
                    // track changes (before notifying)
                    if (this._trackChanges == true) {
                        // removing something that was added
                        var idxAdded = this._chgAdded.indexOf(item);
                        if (idxAdded > -1) {
                            this._chgAdded.removeAt(idxAdded);
                        }
                        // removing something that was edited
                        var idxEdited = this._chgEdited.indexOf(item);
                        if (idxEdited > -1) {
                            this._chgEdited.removeAt(idxEdited);
                        }
                        // add to removed list unless it was pending and not added in this session
                        var idxRemoved = this._chgRemoved.indexOf(item);
                        if (idxRemoved < 0 && !pendingNew && idxAdded < 0) {
                            this._chgRemoved.push(item);
                        }
                    }
                    // notify (item removed or full refresh) (TFS 85001)
                    var sorted = this.sortDescriptions.length > 0, // JavaScript sort is not stable...
                    paged = this.pageSize > 0 && this._pgIdx > -1;
                    if (sorted || paged || digest != this._getGroupsDigest(this.groups)) {
                        this._raiseCollectionChanged();
                    }
                    else {
                        this._raiseCollectionChanged(collections.NotifyCollectionChangedAction.Remove, item, index);
                    }
                    // raise currentChanged if needed
                    if (this.currentItem !== current) {
                        this.onCurrentChanged();
                    }
                }
            };
            /**
             * Removes the item at the specified index from the collection.
             *
             * @param index Index of the item to be removed from the collection.
             * The index is relative to the view, not to the source collection.
             */
            CollectionView.prototype.removeAt = function (index) {
                index = wijmo.asInt(index);
                this.remove(this._pgView[index]);
            };
            // track changes applied to an item (not necessarily the current edit item)
            CollectionView.prototype._trackItemChanged = function (item) {
                if (this._trackChanges) {
                    var idx = this._chgEdited.indexOf(item);
                    if (idx < 0 && this._chgAdded.indexOf(item) < 0) {
                        this._chgEdited.push(item);
                    }
                    else if (idx > -1) {
                        var e = new collections.NotifyCollectionChangedEventArgs(collections.NotifyCollectionChangedAction.Change, item, idx);
                        this._chgEdited.onCollectionChanged(e);
                    }
                    else {
                        idx = this._chgAdded.indexOf(item);
                        if (idx > -1) {
                            var e = new collections.NotifyCollectionChangedEventArgs(collections.NotifyCollectionChangedAction.Change, item, idx);
                            this._chgAdded.onCollectionChanged(e);
                        }
                    }
                }
            };
            // extends an object (shallow copy)
            CollectionView.prototype._extend = function (dst, src) {
                for (var key in src) {
                    dst[key] = src[key];
                }
            };
            // checks whether two objects have the same content
            CollectionView.prototype._sameContent = function (dst, src) {
                for (var key in src) {
                    if (!this._sameValue(dst[key], src[key])) {
                        return false;
                    }
                }
                for (var key in dst) {
                    if (!this._sameValue(dst[key], src[key])) {
                        return false;
                    }
                }
                return true;
            };
            // checks whether two values are the same
            CollectionView.prototype._sameValue = function (v1, v2) {
                return v1 == v2 || wijmo.DateTime.equals(v1, v2);
            };
            Object.defineProperty(CollectionView.prototype, "canChangePage", {
                // ** IPagedCollectionView
                /**
                 * Gets a value that indicates whether the @see:pageIndex value can change.
                 */
                get: function () {
                    return this._canChangePage;
                },
                set: function (value) {
                    this._canChangePage = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionView.prototype, "isPageChanging", {
                /**
                 * Gets a value that indicates whether the page index is changing.
                 */
                get: function () {
                    return false;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionView.prototype, "itemCount", {
                /**
                 * Gets the total number of items in the view taking paging into account.
                 */
                get: function () {
                    return this._pgView.length;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionView.prototype, "pageIndex", {
                /**
                 * Gets the zero-based index of the current page.
                 */
                get: function () {
                    return this._pgIdx;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionView.prototype, "pageSize", {
                /**
                 * Gets or sets the number of items to display on a page.
                 */
                get: function () {
                    return this._pgSz;
                },
                set: function (value) {
                    if (value != this._pgSz) {
                        this._pgSz = wijmo.asInt(value);
                        this.refresh();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionView.prototype, "totalItemCount", {
                /**
                 * Gets the total number of items in the view before paging is applied.
                 */
                get: function () {
                    return this._view.length;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionView.prototype, "pageCount", {
                /**
                 * Gets the total number of pages.
                 */
                get: function () {
                    return this.pageSize ? Math.ceil(this.totalItemCount / this.pageSize) : 1;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Sets the first page as the current page.
             *
             * @return True if the page index was changed successfully.
             */
            CollectionView.prototype.moveToFirstPage = function () {
                return this.moveToPage(0);
            };
            /**
             * Sets the last page as the current page.
             *
             * @return True if the page index was changed successfully.
             */
            CollectionView.prototype.moveToLastPage = function () {
                return this.moveToPage(this.pageCount - 1);
            };
            /**
             * Moves to the page after the current page.
             *
             * @return True if the page index was changed successfully.
             */
            CollectionView.prototype.moveToNextPage = function () {
                return this.moveToPage(this.pageIndex + 1);
            };
            /**
             * Moves to the page at the specified index.
             *
             * @param index Index of the page to move to.
             * @return True if the page index was changed successfully.
             */
            CollectionView.prototype.moveToPage = function (index) {
                var newIndex = wijmo.clamp(index, 0, this.pageCount - 1);
                if (newIndex != this._pgIdx) {
                    // honor canChangePage
                    if (!this.canChangePage) {
                        wijmo.assert(false, 'cannot change pages (canChangePage == false).');
                    }
                    // raise pageChanging
                    var e = new collections.PageChangingEventArgs(newIndex);
                    if (this.onPageChanging(e)) {
                        // change the page
                        this._pgIdx = newIndex;
                        this._pgView = this._getPageView();
                        this._idx = 0;
                        // raise pageChanged and collectionChanged, or refresh if grouping
                        if (!this.groupDescriptions || this.groupDescriptions.length == 0) {
                            this.onPageChanged();
                            this.onCollectionChanged();
                        }
                        else {
                            this.refresh();
                        }
                    }
                }
                return this._pgIdx == index;
            };
            /**
             * Moves to the page before the current page.
             *
             * @return True if the page index was changed successfully.
             */
            CollectionView.prototype.moveToPreviousPage = function () {
                return this.moveToPage(this.pageIndex - 1);
            };
            /**
             * Raises the @see:pageChanged event.
             */
            CollectionView.prototype.onPageChanged = function (e) {
                if (e === void 0) { e = wijmo.EventArgs.empty; }
                this.pageChanged.raise(this, e);
            };
            /**
             * Raises the @see:pageChanging event.
             *
             * @param e @see:PageChangingEventArgs that contains the event data.
             */
            CollectionView.prototype.onPageChanging = function (e) {
                this.pageChanging.raise(this, e);
                return !e.cancel;
            };
            // gets the full group that corresponds to a paged group view
            CollectionView.prototype._getFullGroup = function (g) {
                // look for the group by level and name
                // this gets the full (unpaged) and updated group (TFS 109119)
                var fg = this._getGroupByPath(this._fullGroups, g.level, g._path);
                if (fg != null) {
                    g = fg;
                }
                // return the group
                return g;
            };
            // gets a group from a collection by path
            CollectionView.prototype._getGroupByPath = function (groups, level, path) {
                for (var i = 0; i < groups.length; i++) {
                    var g = groups[i];
                    if (g.level == level && g._path == path) {
                        return g;
                    }
                    if (g.level < level && path.indexOf(g._path) == 0) {
                        g = this._getGroupByPath(g.groups, level, path);
                        if (g != null) {
                            return g;
                        }
                    }
                }
                return null;
            };
            // gets the list that corresponds to the current page
            CollectionView.prototype._getPageView = function () {
                // not paging? return the whole view
                if (this.pageSize <= 0 || this._pgIdx < 0) {
                    return this._view;
                }
                // slice the current page out of the view
                var start = this._pgSz * this._pgIdx, end = Math.min(start + this._pgSz, this._view.length);
                return this._view.slice(start, end);
            };
            // creates a grouped view of the current page
            CollectionView.prototype._createGroups = function (items) {
                // not grouping? return null
                if (!this._grpDesc || !this._grpDesc.length) {
                    return null;
                }
                // build group tree
                var root = [], maps = {}, map = null;
                for (var i = 0; i < items.length; i++) {
                    // get the item
                    var item = items[i], groups = root, levels = this._grpDesc.length;
                    // add this item to the tree
                    var path = '';
                    for (var level = 0; level < levels; level++) {
                        // get the group name for this level
                        var gd = this._grpDesc[level], name = gd.groupNameFromItem(item, level), last = level == levels - 1;
                        // get the group map for this level (optimization)
                        map = maps[path];
                        if (!map && wijmo.isPrimitive(name)) {
                            map = {};
                            maps[path] = map;
                        }
                        // get or create the group
                        var group = this._getGroup(gd, groups, map, name, level, last);
                        // keep group path (all names in the hierarchy)
                        path += '/' + name;
                        group._path = path;
                        // add data items to last level groups
                        if (last) {
                            group.items.push(item);
                        }
                        // move on to the next group
                        groups = group.groups;
                    }
                }
                // done
                return root;
            };
            // gets a string digest of the current groups 
            // this is used to check whether changes require a full refresh
            CollectionView.prototype._getGroupsDigest = function (groups) {
                var digest = '';
                for (var i = 0; groups != null && i < groups.length; i++) {
                    var g = groups[i];
                    digest += '{' + g.name + ':' + (g.items ? g.items.length : '*');
                    if (g.groups.length > 0) {
                        digest += ',';
                        digest += this._getGroupsDigest(g.groups);
                    }
                    digest += '}';
                }
                return digest;
            };
            // gets an array that contains all the children for a list of groups
            // NOTE: use "push.apply" instead of "concat" for much better performance
            // NOTE2: use explicit loop for even better performance and to avoid stack overflows (TFS 15921)
            CollectionView.prototype._mergeGroupItems = function (groups) {
                var items = [];
                for (var i = 0; i < groups.length; i++) {
                    var g = groups[i];
                    if (!g._isBottomLevel) {
                        var groupItems = this._mergeGroupItems(g.groups);
                        //g._items.push.apply(g._items, groupItems);
                        for (var a = 0, len = groupItems.length; a < len; a++) {
                            g._items.push(groupItems[a]);
                        }
                    }
                    //items.push.apply(items, g._items);
                    for (var a = 0, len = g._items.length; a < len; a++) {
                        items.push(g._items[a]);
                    }
                }
                return items;
            };
            // finds or creates a group
            CollectionView.prototype._getGroup = function (gd, groups, map, name, level, isBottomLevel) {
                var g;
                // find existing group
                if (map && wijmo.isPrimitive(name)) {
                    g = map[name];
                    if (g) {
                        return g;
                    }
                }
                else {
                    for (var i = 0; i < groups.length; i++) {
                        if (gd.namesMatch(groups[i].name, name)) {
                            return groups[i];
                        }
                    }
                }
                // not found, create now
                var group = new CollectionViewGroup(gd, name, level, isBottomLevel);
                groups.push(group);
                // add group to map
                if (map) {
                    map[name] = group;
                }
                // done
                return group;
            };
            return CollectionView;
        }());
        collections.CollectionView = CollectionView;
        /**
         * Represents a group created by a @see:CollectionView object based on
         * its @see:CollectionView.groupDescriptions property.
         */
        var CollectionViewGroup = (function () {
            /**
             * Initializes a new instance of the @see:CollectionViewGroup class.
             *
             * @param groupDescription @see:GroupDescription that owns the new group.
             * @param name Name of the new group.
             * @param level Level of the new group.
             * @param isBottomLevel Whether this group has any subgroups.
             */
            function CollectionViewGroup(groupDescription, name, level, isBottomLevel) {
                this._gd = groupDescription;
                this._name = name;
                this._level = level;
                this._isBottomLevel = isBottomLevel;
                this._groups = [];
                this._items = [];
            }
            Object.defineProperty(CollectionViewGroup.prototype, "name", {
                /*
                 * Gets the name of this group.
                 */
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionViewGroup.prototype, "level", {
                /*
                 * Gets the level of this group.
                 */
                get: function () {
                    return this._level;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionViewGroup.prototype, "isBottomLevel", {
                /*
                 * Gets a value that indicates whether this group has any subgroups.
                 */
                get: function () {
                    return this._isBottomLevel;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionViewGroup.prototype, "items", {
                /*
                 * Gets an array containing the items included in this group (including all subgroups).
                 */
                get: function () {
                    return this._items;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionViewGroup.prototype, "groups", {
                /*
                 * Gets an array containing the this group's subgroups.
                 */
                get: function () {
                    return this._groups;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CollectionViewGroup.prototype, "groupDescription", {
                /*
                 * Gets the @see:GroupDescription that owns this group.
                 */
                get: function () {
                    return this._gd;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Calculates an aggregate value for the items in this group.
             *
             * @param aggType Type of aggregate to calculate.
             * @param binding Property to aggregate on.
             * @param view CollectionView that owns this group.
             * @return The aggregate value.
             */
            CollectionViewGroup.prototype.getAggregate = function (aggType, binding, view) {
                var cv = wijmo.tryCast(view, CollectionView), group = cv ? cv._getFullGroup(this) : this;
                return wijmo.getAggregate(aggType, group.items, binding);
            };
            return CollectionViewGroup;
        }());
        collections.CollectionViewGroup = CollectionViewGroup;
    })(collections = wijmo.collections || (wijmo.collections = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=CollectionView.js.map