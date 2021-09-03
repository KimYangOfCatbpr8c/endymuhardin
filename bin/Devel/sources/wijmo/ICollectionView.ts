/**
 * Defines interfaces and classes related to data, including the @see:ICollectionView 
 * interface, @see:CollectionView and @see:ObservableArray classes.
 */     
module wijmo.collections {
    'use strict';

    /**
     * Notifies listeners of dynamic changes, such as when items get added and 
     * removed or when the collection is sorted, filtered, or grouped.
     */
    export interface INotifyCollectionChanged {
        /**
         * Occurs when the collection changes.
         */
        collectionChanged: Event;
    }
    /**
     * Describes the action that caused the @see:INotifyCollectionChanged.collectionChanged
     * event to fire.
     */
    export enum NotifyCollectionChangedAction {
        /** An item was added to the collection. */
        Add,
        /** An item was removed from the collection. */
        Remove,
        /** An item was changed or replaced. */
        Change,
        /** 
         * Several items changed simultaneously 
         * (for example, the collection was sorted, filtered, or grouped). 
         */
        Reset
    }
    /**
     * Provides data for the @see:INotifyCollectionChanged.collectionChanged event.
     */
    export class NotifyCollectionChangedEventArgs extends EventArgs {

        /**
         * Provides a reset notification.
         */
        static reset = new NotifyCollectionChangedEventArgs(NotifyCollectionChangedAction.Reset);
        /**
         * Gets the action that caused the event to fire.
         */
        action: NotifyCollectionChangedAction;
        /**
         * Gets the item that was added, removed, or changed.
         */
        item: any;
        /**
         * Gets the index at which the change occurred.
         */
        index: number;
        /**
         * Initializes a new instance of the @see:NotifyCollectionChangedEventArgs class.
         *
         * @param action Type of action that caused the event to fire.
         * @param item Item that was added or changed.
         * @param index Index of the item.
         */
        constructor(action = NotifyCollectionChangedAction.Reset, item = null, index = -1) {
            super();
            this.action = action;
            this.item = item;
            this.index = index;
        }
    }

    /**
     * Represents a method that takes an item of any type and returns a 
     * boolean that indicates whether the object meets a set of criteria.
     */
    export interface IPredicate {
        (item: any): boolean
    }

    /**
    * Represents the method that compares two objects.
    */
    export interface IComparer {
        (x: any, y: any): number;
    }

    /**
     * Describes a sorting criterion.
     */
    export class SortDescription {
        _bnd: Binding;
        _asc: boolean;

        /**
         * Initializes a new instance of the @see:SortDescription class.
         *
         * @param property Name of the property to sort on.
         * @param ascending Whether to sort in ascending order.
         */
        constructor(property: string, ascending: boolean) {
            this._bnd = new Binding(property);
            this._asc = ascending;
        }
        /**
         * Gets the name of the property used to sort.
         */
        get property(): string {
            return this._bnd.path;
        }
        /**
         * Gets a value that determines whether to sort the values in ascending order.
         */
        get ascending(): boolean {
            return this._asc;
        }
    }

    /**
     * Enables collections to have the functionalities of current record management, 
     * custom sorting, filtering, and grouping.
     *
     * This is a JavaScript version of the <b>ICollectionView</b> interface used in 
     * Microsoft's XAML platform. It provides a consistent, powerful, and  MVVM-friendly 
     * way to bind data to UI elements.
     *
     * Wijmo includes several classes that implement @see:ICollectionView. The most 
     * common is @see:CollectionView, which works based on regular JavsScript 
     * arrays.
     */
    export interface ICollectionView extends INotifyCollectionChanged, IQueryInterface {

        /**
         * Gets a value that indicates whether this view supports filtering via the 
         * @see:filter property.
         */
        canFilter: boolean;
        /**
         * Gets a value that indicates whether this view supports grouping via the 
         * @see:groupDescriptions property.
         */
        canGroup: boolean;
        /**
         * Gets a value that indicates whether this view supports sorting via the 
         * @see:sortDescriptions property.
         */
        canSort: boolean;
        /**
         * Gets the current item in the view.
         */
        currentItem: any;
        /**
         * Gets the ordinal position of the current item in the view.
         */
        currentPosition: number;
        /**
         * Gets or sets a callback used to determine if an item is suitable for 
         * inclusion in the view.
         *
         * NOTE: If the filter function needs a scope (i.e. a meaningful 'this'
         * value), then remember to set the filter using the 'bind' function to
         * specify the 'this' object. For example:
         * <pre>
         *   collectionView.filter = this._filter.bind(this);
         * </pre>
         */
        filter: IPredicate;
        /**
         * Gets a collection of @see:GroupDescription objects that describe how the 
         * items in the collection are grouped in the view.
         */
        groupDescriptions: ObservableArray;
        /**
         * Gets the top-level groups.
         */
        groups: any[];
        /**
         * Gets a value that indicates whether this view contains no items.
         */
        isEmpty: boolean;
        /**
         * Gets a collection of @see:SortDescription objects that describe how the items 
         * in the collection are sorted in the view.
         */
        sortDescriptions: ObservableArray;
        /**
         * Gets or sets the collection object from which to create this view.
         */
        sourceCollection: any;
        /**
         * Returns a value that indicates whether a given item belongs to this view.
         *
         * @param item The item to locate in the collection.
         */
        contains(item: any): boolean;
        /**
         * Sets the specified item to be the current item in the view.
         *
         * @param item The item to set as the @see:currentItem.
         */
        moveCurrentTo(item: any): boolean;
        /**
         * Sets the first item in the view as the current item.
         */
        moveCurrentToFirst(): boolean;
        /**
         * Sets the last item in the view as the current item.
         */
        moveCurrentToLast(): boolean;
        /**
         * Sets the item after the current item in the view as the current item.
         */
        moveCurrentToNext(): boolean;
        /**
         * Sets the item at the specified index in the view as the current item.
         *
         * @param index The index of the item to set as the @see:currentItem.
         */
        moveCurrentToPosition(index: number): boolean;
        /**
         * Sets the item before the current item in the view as the current item.
         */
        moveCurrentToPrevious();
        /**
         * Re-creates the view using the current sort, filter, and group parameters.
         */
        refresh();
        /**
         * Occurs after the current item changes.
         */
        currentChanged: Event;
        /**
         * Occurs before the current item changes.
         */
        currentChanging: Event;

        // since we don't have IDisposable/using:

        /**
         * Suspends refreshes until the next call to @see:endUpdate.
         */
        beginUpdate();
        /**
         * Resumes refreshes suspended by a call to @see:beginUpdate.
         */
        endUpdate();
        /**
         * Executes a function within a beginUpdate/endUpdate block.
         *
         * The collection will not be refreshed until the function has been executed.
         * This method ensures endUpdate is called even if the function throws.
         *
         * @param fn Function to be executed within the beginUpdate/endUpdate block.
         */
        deferUpdate(fn: Function);

        // since we don't have IEnumerable:

        /**
         * Gets the filtered, sorted, grouped items in the view.
         */
        items: any[];
    }

    /**
     * Defines methods and properties that extend @see:ICollectionView to provide 
     * editing capabilities.
     */
    export interface IEditableCollectionView extends ICollectionView {
        /**
         * Gets a value that indicates whether a new item can be added to the collection.
         */
        canAddNew: boolean;
        /**
         * Gets a value that indicates whether the collection view can discard pending changes 
         * and restore the original values of an edited object.
         */
        canCancelEdit: boolean;
        /**
         * Gets a value that indicates whether items can be removed from the collection.
         */
        canRemove: boolean;
        /**
         * Gets the item that is being added during the current add transaction.
         */
        currentAddItem: any;
        /**
         * Gets the item that is being edited during the current edit transaction.
         */
        currentEditItem: any;
        /**
         * Gets a value that indicates whether an add transaction is in progress.
         */
        isAddingNew: boolean;
        /**
         * Gets a value that indicates whether an edit transaction is in progress.
         */
        isEditingItem: boolean;
        /**
         * Adds a new item to the collection.
         *
         * @return The item that was added to the collection.
         */
        addNew(): any;
        /**
         * Ends the current edit transaction and, if possible, 
         * restores the original value to the item.
         */
        cancelEdit();
        /**
         * Ends the current add transaction and discards the pending new item.
         */
        cancelNew();
        /**
         * Ends the current edit transaction and saves the pending changes.
         */
        commitEdit();
        /**
         * Ends the current add transaction and saves the pending new item.
         */
        commitNew();
        /**
         * Begins an edit transaction of the specified item.
         *
         * @param item Item to edit.
         */
        editItem(item: any);
        /**
         * Removes the specified item from the collection.
         *
         * @param item Item to remove from the collection.
         */
        remove(item: any);
        /**
         * Removes the item at the specified index from the collection.
         *
         * @param index Index of the item to remove from the collection.
         */
        removeAt(index: number);
    }

    /**
     * Defines methods and properties that extend @see:ICollectionView to provide 
     * paging capabilities.
     */
    export interface IPagedCollectionView extends ICollectionView {
        /**
         * Gets a value that indicates whether the @see:pageIndex value can change.
         */
        canChangePage: boolean;
        /**
         * Gets a value that indicates whether the index is changing.
         */
        isPageChanging: boolean;
        /**
         * Gets the number of items in the view taking paging into account.
         *
         * To get the total number of items, use the @see:totalItemCount property.
         *
         * Notice that this is different from the .NET <b>IPagedCollectionView</b>,
         * where <b>itemCount</b> and <b>totalItemCount</b> both return the count
         * before paging is applied.
         */
        itemCount: number;
        /**
         * Gets the zero-based index of the current page.
         */
        pageIndex: number;
        /**
         * Gets or sets the number of items to display on a page.
         */
        pageSize: number;
        /**
         * Gets the total number of items in the view before paging is applied.
         *
         * To get the number of items in the current view not taking paging into 
         * account, use the @see:itemCount property.
         *
         * Notice that this is different from the .NET <b>IPagedCollectionView</b>,
         * where <b>itemCount</b> and <b>totalItemCount</b> both return the count
         * before paging is applied.
         */
        totalItemCount: number;
        /**
         * Sets the first page as the current page.
         */
        moveToFirstPage(): boolean;
        /**
         * Sets the last page as the current page.
         */
        moveToLastPage(): boolean;
        /**
         * Moves to the page after the current page.
         */
        moveToNextPage(): boolean;
        /**
         * Moves to the page at the specified index.
         *
         * @param index Index of the page to move to.
         */
        moveToPage(index: number): boolean;
        /**
         * Moves to the page before the current page.
         */
        moveToPreviousPage(): boolean;
        /**
        * Occurs after the page index changes.
        */
        pageChanged: Event;
        /**
         * Occurs before the page index changes.
         */
        pageChanging: Event;
    }

    /**
     * Provides data for the @see:IPagedCollectionView.pageChanging event
     */
    export class PageChangingEventArgs extends CancelEventArgs
    {
        /**
         * Gets the index of the page that is about to become current.
         */
        newPageIndex: number;

        /**
         * Initializes a new instance of the @see:PageChangingEventArgs class.
         *
         * @param newIndex Index of the page that is about to become current.
         */
        constructor(newIndex: number) {
            super();
            this.newPageIndex = newIndex;
        }
    }

    /**
     * Represents a base class for types defining grouping conditions. 
     *
     * The concrete class which is commonly used for this purpose is 
     * @see:PropertyGroupDescription.
     */
    export class GroupDescription {

        /**
         * Returns the group name for the given item.
         *
         * @param item The item to get group name for.
         * @param level The zero-based group level index.
         * @return The name of the group the item belongs to.
         */
        public groupNameFromItem(item: any, level: number): any {
            return '';
        }
        /**
         * Returns a value that indicates whether the group name and the item name
         * match (which implies that the item belongs to the group).
         *
         * @param groupName The name of the group.
         * @param itemName The name of the item.
         * @return True if the names match; otherwise, false.
         */
        public namesMatch(groupName: any, itemName: any): boolean {
            return groupName === itemName;
        }
    }

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
    export class PropertyGroupDescription extends GroupDescription {
        _bnd: Binding;
        _converter: Function;

        /**
         * Initializes a new instance of the @see:PropertyGroupDescription class.
         *
         * @param property The name of the property that specifies
         * which group an item belongs to.
         * @param converter A callback function that takes an item and 
         * a property name and returns the group name. If not specified, 
         * the group name is the property value for the item.
         */
        constructor(property: string, converter?: Function) {
            super();
            this._bnd = new Binding(property);
            this._converter = converter;
        }
        /*
         * Gets the name of the property that is used to determine which 
         * group an item belongs to.
         */
        get propertyName(): string {
            return this._bnd.path;
        }
        /**
         * Returns the group name for the given item.
         *
         * @param item The item to get group name for.
         * @param level The zero-based group level index.
         * @return The name of the group the item belongs to.
         */
        public groupNameFromItem(item: any, level: number): any {
            return this._converter
                ? this._converter(item, this.propertyName)
                : this._bnd.getValue(item);
        }
        /**
         * Returns a value that indicates whether the group name and the item name
         * match (which implies that the item belongs to the group).
         *
         * @param groupName The name of the group.
         * @param itemName The name of the item.
         * @return True if the names match; otherwise, false.
         */
       public namesMatch(groupName: any, itemName: any): boolean {
            return groupName === itemName;
        }
    }
}