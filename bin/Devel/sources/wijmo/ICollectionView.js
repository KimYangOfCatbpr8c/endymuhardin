var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Defines interfaces and classes related to data, including the @see:ICollectionView
 * interface and the @see:CollectionView class and @see:ObservableArray classes.
 */
var wijmo;
(function (wijmo) {
    var collections;
    (function (collections) {
        'use strict';
        /**
         * Describes the action that caused the @see:INotifyCollectionChanged.collectionChanged
         * event to fire.
         */
        (function (NotifyCollectionChangedAction) {
            /** An item was added to the collection. */
            NotifyCollectionChangedAction[NotifyCollectionChangedAction["Add"] = 0] = "Add";
            /** An item was removed from the collection. */
            NotifyCollectionChangedAction[NotifyCollectionChangedAction["Remove"] = 1] = "Remove";
            /** An item was changed or replaced. */
            NotifyCollectionChangedAction[NotifyCollectionChangedAction["Change"] = 2] = "Change";
            /**
             * Several items changed simultaneously
             * (for example, the collection was sorted, filtered, or grouped).
             */
            NotifyCollectionChangedAction[NotifyCollectionChangedAction["Reset"] = 3] = "Reset";
        })(collections.NotifyCollectionChangedAction || (collections.NotifyCollectionChangedAction = {}));
        var NotifyCollectionChangedAction = collections.NotifyCollectionChangedAction;
        /**
         * Provides data for the @see:INotifyCollectionChanged.collectionChanged event.
         */
        var NotifyCollectionChangedEventArgs = (function (_super) {
            __extends(NotifyCollectionChangedEventArgs, _super);
            /**
             * Initializes a new instance of the @see:NotifyCollectionChangedEventArgs class.
             *
             * @param action Type of action that caused the event to fire.
             * @param item Item that was added or changed.
             * @param index Index of the item.
             */
            function NotifyCollectionChangedEventArgs(action, item, index) {
                if (action === void 0) { action = NotifyCollectionChangedAction.Reset; }
                if (item === void 0) { item = null; }
                if (index === void 0) { index = -1; }
                _super.call(this);
                this.action = action;
                this.item = item;
                this.index = index;
            }
            /**
             * Provides a reset notification.
             */
            NotifyCollectionChangedEventArgs.reset = new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Reset);
            return NotifyCollectionChangedEventArgs;
        }(wijmo.EventArgs));
        collections.NotifyCollectionChangedEventArgs = NotifyCollectionChangedEventArgs;
        /**
         * Describes a sorting criterion.
         */
        var SortDescription = (function () {
            /**
             * Initializes a new instance of the @see:SortDescription class.
             *
             * @param property Name of the property to sort on.
             * @param ascending Whether to sort in ascending order.
             */
            function SortDescription(property, ascending) {
                this._bnd = new wijmo.Binding(property);
                this._asc = ascending;
            }
            Object.defineProperty(SortDescription.prototype, "property", {
                /**
                 * Gets the name of the property used to sort.
                 */
                get: function () {
                    return this._bnd.path;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SortDescription.prototype, "ascending", {
                /**
                 * Gets a value that determines whether to sort the values in ascending order.
                 */
                get: function () {
                    return this._asc;
                },
                enumerable: true,
                configurable: true
            });
            return SortDescription;
        }());
        collections.SortDescription = SortDescription;
        /**
         * Provides data for the @see:IPagedCollectionView.pageChanging event
         */
        var PageChangingEventArgs = (function (_super) {
            __extends(PageChangingEventArgs, _super);
            /**
             * Initializes a new instance of the @see:PageChangingEventArgs class.
             *
             * @param newIndex Index of the page that is about to become current.
             */
            function PageChangingEventArgs(newIndex) {
                _super.call(this);
                this.newPageIndex = newIndex;
            }
            return PageChangingEventArgs;
        }(wijmo.CancelEventArgs));
        collections.PageChangingEventArgs = PageChangingEventArgs;
        /**
         * Represents a base class for types defining grouping conditions.
         *
         * The concrete class which is commonly used for this purpose is
         * @see:PropertyGroupDescription.
         */
        var GroupDescription = (function () {
            function GroupDescription() {
            }
            /**
             * Returns the group name for the given item.
             *
             * @param item The item to get group name for.
             * @param level The zero-based group level index.
             * @return The name of the group the item belongs to.
             */
            GroupDescription.prototype.groupNameFromItem = function (item, level) {
                return '';
            };
            /**
             * Returns a value that indicates whether the group name and the item name
             * match (which implies that the item belongs to the group).
             *
             * @param groupName The name of the group.
             * @param itemName The name of the item.
             * @return True if the names match; otherwise, false.
             */
            GroupDescription.prototype.namesMatch = function (groupName, itemName) {
                return groupName === itemName;
            };
            return GroupDescription;
        }());
        collections.GroupDescription = GroupDescription;
        /**
         * Describes the grouping of items using a property name as the criterion.
         *
         * For example, the code below causes a @see:CollectionView to group items
         * by the value of their 'country' property:
         * <pre>
         * var cv = new wijmo.collections.CollectionView(items);
         * var gd = new wijmo.collections.PropertyGroupDescription('country');
         * cv.groupDescriptions.push(gd);
         * </pre>
         *
         * You may also specify a callback function that generates the group name.
         * For example, the code below causes a @see:CollectionView to group items
         * by the first letter of the value of their 'country' property:
         * <pre>
         * var cv = new wijmo.collections.CollectionView(items);
         * var gd = new wijmo.collections.PropertyGroupDescription('country',
         *   function(item, propName) {
         *     return item[propName][0]; // return country's initial
         * });
         * cv.groupDescriptions.push(gd);
         * </pre>
         */
        var PropertyGroupDescription = (function (_super) {
            __extends(PropertyGroupDescription, _super);
            /**
             * Initializes a new instance of the @see:PropertyGroupDescription class.
             *
             * @param property The name of the property that specifies
             * which group an item belongs to.
             * @param converter A callback function that takes an item and
             * a property name and returns the group name. If not specified,
             * the group name is the property value for the item.
             */
            function PropertyGroupDescription(property, converter) {
                _super.call(this);
                this._bnd = new wijmo.Binding(property);
                this._converter = converter;
            }
            Object.defineProperty(PropertyGroupDescription.prototype, "propertyName", {
                /*
                 * Gets the name of the property that is used to determine which
                 * group an item belongs to.
                 */
                get: function () {
                    return this._bnd.path;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Returns the group name for the given item.
             *
             * @param item The item to get group name for.
             * @param level The zero-based group level index.
             * @return The name of the group the item belongs to.
             */
            PropertyGroupDescription.prototype.groupNameFromItem = function (item, level) {
                return this._converter
                    ? this._converter(item, this.propertyName)
                    : this._bnd.getValue(item);
            };
            /**
             * Returns a value that indicates whether the group name and the item name
             * match (which implies that the item belongs to the group).
             *
             * @param groupName The name of the group.
             * @param itemName The name of the item.
             * @return True if the names match; otherwise, false.
             */
            PropertyGroupDescription.prototype.namesMatch = function (groupName, itemName) {
                return groupName === itemName;
            };
            return PropertyGroupDescription;
        }(GroupDescription));
        collections.PropertyGroupDescription = PropertyGroupDescription;
    })(collections = wijmo.collections || (wijmo.collections = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ICollectionView.js.map