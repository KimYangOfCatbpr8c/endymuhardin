module wijmo.input {
    'use strict';

    /**
     * The @see:ListBox control displays a list of items which may contain 
     * plain text or HTML, and allows users to select items with the mouse or 
     * the keyboard.
     * 
     * Use the @see:ListBox.selectedIndex property to determine which item is
     * currently selected.
     *
     * You can populate a @see:ListBox using an array of strings or you can use
     * an array of objects, in which case the @see:ListBox.displayMemberPath
     * property determines which object property is displayed on the list.
     *
     * To display items that contain HTML rather than plain text, set the
     * @see:ListBox.isContentHtml property to true.
     *
     * The example below creates a @see:ListBox control and populates it using
     * a 'countries' array. The control updates its @see:ListBox.selectedIndex
     * and @see:ListBox.selectedItem properties as the user moves the selection.
     * 
     * @fiddle:8HnLx
     */
    export class ListBox extends Control {

        // property storage
        _items: any; // any[] or ICollectionView
        _cv: collections.ICollectionView;
        _itemFormatter: Function;
        _pathDisplay = new Binding(null);
        _pathValue = new Binding(null);
        _pathChecked = new Binding(null);
        _html = false;
        _checkedItems = [];

        // work variables
        _checking: boolean;
        _search = '';
        _toSearch: number;
        _bndDisplay: Binding;
        
        /**
         * Initializes a new instance of the @see:ListBox class.
         *
         * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
         * @param options The JavaScript object containing initialization data for the control.
         */
        constructor(element: any, options?) {
            super(element);

            // instantiate and apply template
            this.applyTemplate('wj-control wj-listbox wj-content', null, null);

            // initializing from <select> tag
            if (this._orgTag == 'SELECT') {
                this._populateSelectElement(this.hostElement);
            }

            // handle mouse and keyboard
            var host = this.hostElement;
            this.addEventListener(host, 'click', this._click.bind(this));
            this.addEventListener(host, 'keydown', this._keydown.bind(this));
            this.addEventListener(host, 'keypress', this._keypress.bind(this));

            // prevent wheel from propagating to parent elements
            this.addEventListener(host, 'wheel', (e: WheelEvent) => {
                if (host.scrollHeight > host.offsetHeight) {
                    if ((e.deltaY < 0 && host.scrollTop == 0) ||
                        (e.deltaY > 0 && host.scrollTop + host.offsetHeight >= host.scrollHeight)) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            });

            // initialize control options
            this.initialize(options);
        }

        //--------------------------------------------------------------------------
        //#region ** overrides

        /**
         * Refreshes the list.
         */
        refresh() {
            super.refresh();

            // re-populate list unless we're binding directly to values and 
            // are showing CheckBoxes (in which case re-populating would 
            // reset the checked state of the items).
            if (this.displayMemberPath || !this.checkedMemberPath) {
                this._populateList();
            }
        }

        //#endregion

        //--------------------------------------------------------------------------
        //#region ** object model

        /**
         * Gets or sets the array or @see:ICollectionView object that contains the list items. 
         */
        get itemsSource(): any {
            return this._items;
        }
        set itemsSource(value: any) {
            if (this._items != value) {

                // unbind current collection view
                if (this._cv) {
                    this._cv.currentChanged.removeHandler(this._cvCurrentChanged, this);
                    this._cv.collectionChanged.removeHandler(this._cvCollectionChanged, this);
                    this._cv = null;
                }

                // save new data source and collection view
                this._items = value;
                this._cv = asCollectionView(value);

                // bind new collection view
                if (this._cv != null) {
                    this._cv.currentChanged.addHandler(this._cvCurrentChanged, this);
                    this._cv.collectionChanged.addHandler(this._cvCollectionChanged, this);
                }

                // update the list
                this._populateList();
                this.onItemsChanged();
                this.onSelectedIndexChanged();
            }
        }
        /**
         * Gets the @see:ICollectionView object used as the item source.
         */
        get collectionView(): collections.ICollectionView {
            return this._cv;
        }
        /**
         * Gets or sets a value indicating whether items contain plain text or HTML.
         */
        get isContentHtml(): boolean {
            return this._html;
        }
        set isContentHtml(value: boolean) {
            if (value != this._html) {
                this._html = asBoolean(value);
                this._populateList();
            }
        }
        /**
         * Gets or sets a function used to customize the values shown on the list.
         * The function takes two arguments, the item index and the default text or html, and
         * returns the new text or html to display.
         *
         * If the formatting function needs a scope (i.e. a meaningful 'this'
         * value), then remember to set the filter using the 'bind' function to
         * specify the 'this' object. For example:
         *
         * <pre>
         *   listBox.itemFormatter = customItemFormatter.bind(this);
         *   function customItemFormatter(index, content) {
         *     if (this.makeItemBold(index)) {
         *       content = '&lt;b&gt;' + content + '&lt;/b&gt;';
         *     }
         *     return content;
         *   }
         * </pre>
         */
        get itemFormatter(): Function {
            return this._itemFormatter;
        }
        set itemFormatter(value: Function) {
            if (value != this._itemFormatter) {
                this._itemFormatter = asFunction(value);
                this._populateList();
            }
        }
        /**
         * Gets or sets the name of the property to use as the visual representation of the items.
         */
        get displayMemberPath(): string {
            return this._pathDisplay.path;
        }
        set displayMemberPath(value: string) {
            if (value != this.displayMemberPath) {
                this._pathDisplay.path = asString(value);
                this._populateList();
            }
        }
        /**
         * Gets or sets the name of the property used to get the @see:selectedValue 
         * from the @see:selectedItem.
         */
        get selectedValuePath(): string {
            return this._pathValue.path;
        }
        set selectedValuePath(value: string) {
            this._pathValue.path = asString(value);
        }
        /**
         * Gets or sets the name of the property used to control the CheckBoxes 
         * placed next to each item.
         *
         * Use this property to create multi-select LisBoxes.
         * When an item is checked or unchecked, the control raises the @see:itemChecked event.
         * Use the @see:selectedItem property to retrieve the item that was checked or unchecked,
         * or use the @see:checkedItems property to retrieve the list of items that are currently
         * checked.
         */
        get checkedMemberPath() {
            return this._pathChecked.path;
        }
        set checkedMemberPath(value: string) {
            if (value != this.checkedMemberPath) {
                this._pathChecked.path = asString(value);
                this._populateList();
            }
        }
        /**
         * Gets the string displayed for the item at a given index.
         *
         * The string may be plain text or HTML, depending on the setting
         * of the @see:isContentHtml property.
         *
         * @param index The index of the item.
         */
        getDisplayValue(index: number): string {

            // get the text or html
            var item = null;
            if (index > -1 && hasItems(this._cv)) {
                item = this._cv.items[index];
                if (this.displayMemberPath) {
                    item = this._pathDisplay.getValue(item);
                }
            }
            var text = item != null ? item.toString() : '';

            // allow caller to override/modify the text or html
            if (this.itemFormatter) {
                text = this.itemFormatter(index, text);
            }

            // return the result
            return text;
        }
        /**
         * Gets the text displayed for the item at a given index (as plain text).
         *
         * @param index The index of the item.
         */
        getDisplayText(index: number): string {
            var children = this.hostElement.children,
                item = index > -1 && index < children.length
                    ? <HTMLElement>children[index]
                    : null;
            return item != null ? item.textContent : '';
        }
        /**
         * Gets or sets the index of the currently selected item.
         */
        get selectedIndex(): number {
            return this._cv ? this._cv.currentPosition : -1;
        }
        set selectedIndex(value: number) {
            if (this._cv) {
                this._cv.moveCurrentToPosition(asNumber(value));
            }
        }
        /**
         * Gets or sets the item that is currently selected.
         */
        get selectedItem(): any {
            return this._cv ? this._cv.currentItem: null;
        }
        set selectedItem(value: any) {
            if (this._cv) {
                this._cv.moveCurrentTo(value);
            }
        }
        /**
         * Gets or sets the value of the @see:selectedItem obtained using the @see:selectedValuePath.
         */
        get selectedValue(): any {
            var item = this.selectedItem;
            if (item && this.selectedValuePath) {
                item = this._pathValue.getValue(item);
            }
            return item;
        }
        set selectedValue(value: any) {
            var path = this.selectedValuePath,
                index = -1;
            if (this._cv) {
                for (var i = 0; i < this._cv.items.length; i++) {
                    var item = this._cv.items[i];
                    if ((path && this._pathValue.getValue(item) == value) || (!path && item == value)) {
                        index = i;
                        break;
                    }
                }
                this.selectedIndex = index;
            }
        }
        /**
         * Gets or sets the maximum height of the list.
         */
        get maxHeight(): number {
            var host = this.hostElement;
            return host ? parseFloat(host.style.maxHeight) : null;
        }
        set maxHeight(value: number) {
            var host = this.hostElement;
            if (host) {
                host.style.maxHeight = asNumber(value) + 'px';
            }
        }
        /**
         * Highlights the selected item and scrolls it into view.
         */
        showSelection() {
            var index = this.selectedIndex,
                host = this.hostElement,
                children = host.children,
                e: HTMLElement;

            // highlight
            for (var i = 0; i < children.length; i++) {
                e = <HTMLElement>children[i];
                toggleClass(e, 'wj-state-selected', i == index);
            }

            // scroll into view
            if (index > -1 && index < children.length) {
                e = <HTMLElement>children[index];
                var rco = e.getBoundingClientRect();
                var rcc = this.hostElement.getBoundingClientRect();
                if (rco.bottom > rcc.bottom) {
                    host.scrollTop += rco.bottom - rcc.bottom;
                } else if (rco.top < rcc.top) {
                    host.scrollTop -= rcc.top - rco.top;
                }
            }

            // make sure the focus is within the selected element (TFS 135278)
            if (index > -1 && this.containsFocus()) {
                e = <HTMLElement>children[index];
                if (e instanceof HTMLElement && !contains(e, getActiveElement())) {
                    e.focus();
                }
            }
        }
        /**
         * Gets the checked state of an item on the list.
         *
         * This method is applicable only on multi-select ListBoxes 
         * (see the @see:checkedMemberPath property).
         *
         * @param index Item index.
         */
        getItemChecked(index: number): boolean {
            var item = this._cv.items[index];
            if (isObject(item) && this.checkedMemberPath) {
                return this._pathChecked.getValue(item);
            }
            var cb = this._getCheckbox(index);
            return cb ? cb.checked : false;
        }
        /**
         * Sets the checked state of an item on the list.
         *
         * This method is applicable only on multi-select ListBoxes 
         * (see the @see:checkedMemberPath property).
         *
         * @param index Item index.
         * @param checked Item's new checked state.
         */
        setItemChecked(index: number, checked: boolean) {
            this._setItemChecked(index, checked, true);
        }
        /**
         * Toggles the checked state of an item on the list.
         * This method is applicable only to multi-select ListBoxes 
         * (see the @see:checkedMemberPath property).
         *
         * @param index Item index.
         */
        toggleItemChecked(index: number) {
            this.setItemChecked(index, !this.getItemChecked(index));
        }
        /**
         * Gets or sets an array containing the items that are currently checked.
         */
        get checkedItems(): any[] {
            this._checkedItems.splice(0, this._checkedItems.length);
            if (this._cv) {
                for (var i = 0; i < this._cv.items.length; i++) {
                    if (this.getItemChecked(i)) {
                        this._checkedItems.push(this._cv.items[i]);
                    }
                }
            }
            return this._checkedItems;
        }
        set checkedItems(value: any[]) {
            var cv = this._cv,
                arr = asArray(value, false);
            if (cv && arr) {
                var pos = cv.currentPosition;
                for (var i = 0; i < cv.items.length; i++) {
                    var item = cv.items[i];
                    this._setItemChecked(i, arr.indexOf(item) > -1, false);
                }
                cv.moveCurrentToPosition(pos);
                this.onCheckedItemsChanged();
            }
        }
        /**
         * Occurs when the value of the @see:selectedIndex property changes.
         */
        selectedIndexChanged = new Event();
        /**
         * Raises the @see:selectedIndexChanged event.
         */
        onSelectedIndexChanged(e?: EventArgs) {
            this.selectedIndexChanged.raise(this, e);
        }
        /**
         * Occurs when the list of items changes.
         */
        itemsChanged = new Event();
        /**
         * Raises the @see:itemsChanged event.
         */
        onItemsChanged(e?: EventArgs) {
            this.itemsChanged.raise(this, e);
        }
        /**
         * Occurs before the list items are generated.
         */
        loadingItems = new Event();
        /**
         * Raises the @see:loadingItems event.
         */
        onLoadingItems(e?: EventArgs) {
            this.loadingItems.raise(this, e);
        }
        /**
         * Occurs after the list items are generated.
         */
        loadedItems = new Event();
        /**
         * Raises the @see:loadedItems event.
         */
        onLoadedItems(e?: EventArgs) {
            this.loadedItems.raise(this, e);
        }
        /**
         * Occurs when the current item is checked or unchecked by the user.
         *
         * This event is raised when the @see:checkedMemberPath is set to the name of a 
         * property to add CheckBoxes to each item in the control.
         *
         * Use the @see:selectedItem property to retrieve the item that was checked or 
         * unchecked.
         */
        itemChecked = new Event();
        /**
         * Raises the @see:itemChecked event.
         */
        onItemChecked(e?: EventArgs) {
            this.itemChecked.raise(this, e);
        }
        /**
         * Occurs when the value of the @see:checkedItems property changes.
         */
        checkedItemsChanged = new Event();
        /**
         * Raises the @see:checkedItemsChanged event.
         */
        onCheckedItemsChanged(e?: EventArgs) {
            this.checkedItemsChanged.raise(this, e);
        }
        /**
         * Occurs when an element representing a list item has been created.
         *
         * This event can be used to format list items for display. It is similar 
         * in purpose to the @see:itemFormatter property, but has the advantage 
         * of allowing multiple independent handlers.
         */
        formatItem = new Event();
        /**
         * Raises the @see:formatItem event.
         *
         * @param e @see:FormatItemEventArgs that contains the event data.
         */
        onFormatItem(e: FormatItemEventArgs) {
            this.formatItem.raise(this, e);
        }

        //#endregion

        //--------------------------------------------------------------------------
        //#region ** implementation

        // sets the checked state of an item on the list
        private _setItemChecked(index: number, checked: boolean, notify = true) {

            // update data item
            var item = this._cv.items[index];
            if (isObject(item)) {
                var ecv = <collections.IEditableCollectionView>tryCast(this._cv, 'IEditableCollectionView');
                if (this._pathChecked.getValue(item) != checked) {
                    this._checking = true;
                    if (ecv) {
                        ecv.editItem(item);
                        this._pathChecked.setValue(item, checked);
                        ecv.commitEdit();
                    } else {
                        this._pathChecked.setValue(item, checked);
                        this._cv.refresh();
                    }
                    this._checking = false;
                }
            }

            // update checkbox value
            var cb = this._getCheckbox(index);
            if (cb && cb.checked != checked) {
                cb.checked = checked;
            }

            // fire events
            if (notify) {
                this.onItemChecked();
                this.onCheckedItemsChanged();
            }
        }

        // handle changes to the data source
        private _cvCollectionChanged(sender: any, e: collections.NotifyCollectionChangedEventArgs) {
            if (!this._checking) {
                this._populateList();
                this.onItemsChanged();
            }
        }
        private _cvCurrentChanged(sender: any, e: EventArgs) {
            this.showSelection();
            this.onSelectedIndexChanged();
        }

        // populate the list from the current itemsSource
        private _populateList() {

            // get ready to populate
            var host = this.hostElement;
            if (host) {

                // remember if we have focus
                var focus = this.containsFocus();

                // fire event so user can clean up any current items
                this.onLoadingItems();

                // populate
                host.innerHTML = '';
                if (this._cv) {
                    for (var i = 0; i < this._cv.items.length; i++) {

                        // get item text
                        var text = this.getDisplayValue(i);
                        if (this._html != true) {
                            text = escapeHtml(text);
                        }

                        // add checkbox (without tabindex attribute: TFS 135857)
                        if (this.checkedMemberPath) {
                            var checked = this._pathChecked.getValue(this._cv.items[i]);
                            text = '<label><input type="checkbox"' + (checked ? ' checked' : '') + '> ' + text + '</label>';
                        }

                        // build item
                        var item = document.createElement('div');
                        item.innerHTML = text;
                        item.className = 'wj-listbox-item';
                        if (hasClass(<HTMLElement>item.firstChild, 'wj-separator')) {
                            item.className += ' wj-separator';
                        }

                        // allow custom formatting
                        if (this.formatItem.hasHandlers) {
                            var e = new FormatItemEventArgs(i, this._cv.items[i], item);
                            this.onFormatItem(e);
                        }

                        // add item to list
                        host.appendChild(item);
                    }
                }

                // make sure the list is not totally empty
                // or min-height/max-height won't work properly in IE/Edge
                if (host.children.length == 0) {
                    host.appendChild(document.createElement('div'));
                }

                // restore focus
                if (focus && !this.containsFocus()) {
                    this.focus();
                }

                // scroll selection into view
                this.showSelection();

                // fire event so user can hook up to items
                this.onLoadedItems();
            }
        }

        // click to select elements
        private _click(e: MouseEvent) {
            if (!e.defaultPrevented) {

                // select the item that was clicked
                var children = this.hostElement.children;
                for (var index = 0; index < children.length; index++) {
                    if (contains(children[index], e.target)) {
                        this.selectedIndex = index;
                        break;
                    }
                }

                // handle checkboxes
                var index = this.selectedIndex;
                if (this.checkedMemberPath && index > -1) {
                    var cb = this._getCheckbox(index);
                    if (cb == e.target) {
                        this.setItemChecked(index, cb.checked);
                    }
                }
            }
        }

        // handle keydown (cursor keys)
        private _keydown(e: KeyboardEvent) {

            // honor defaultPrevented
            if (e.defaultPrevented) return;

            // not interested in meta keys
            if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;

            // handle the event
            var index = this.selectedIndex,
                host = this.hostElement,
                children = host.children;
            switch (e.keyCode) {
                case Key.Down:
                    e.preventDefault();
                    for (var i = this.selectedIndex + 1; i < children.length; i++) {
                        if (this.getDisplayText(i)) { // skip empty items (separators)
                            this.selectedIndex = i;
                            break;
                        }
                    }
                    break;
                case Key.Up:
                    e.preventDefault();
                    for (var i = this.selectedIndex - 1; i >= 0; i--) {
                        if (this.getDisplayText(i)) { // skip empty items (separators)
                            this.selectedIndex = i;
                            break;
                        }
                    }
                    break;
                case Key.Home:
                    e.preventDefault();
                    this.selectedIndex = 0;
                    break;
                case Key.End:
                    e.preventDefault();
                    this.selectedIndex = children.length - 1;
                    break;
                case Key.PageDown:
                    e.preventDefault();
                    if (this.selectedIndex > -1) {
                        var index = this.selectedIndex,
                            height = host.offsetHeight,
                            offset = 0;
                        for (var i = index + 1; i < this._cv.items.length; i++) {
                            var itemHeight = children[i].scrollHeight;
                            if (offset + itemHeight > height) {
                                this.selectedIndex = i;
                                break;
                            }
                            offset += itemHeight;
                        }
                        if (this.selectedIndex == index) {
                            this._cv.moveCurrentToLast();
                        }
                    }
                    break;
                case Key.PageUp:
                    e.preventDefault();
                    if (this.selectedIndex > -1) {
                        var index = this.selectedIndex,
                            height = host.offsetHeight,
                            offset = 0;
                        for (var i = index - 1; i > 0; i--) {
                            var itemHeight = children[i].scrollHeight;
                            if (offset + itemHeight > height) {
                                this.selectedIndex = i;
                                break;
                            }
                            offset += itemHeight;
                        }
                        if (this.selectedIndex == index) {
                            this._cv.moveCurrentToFirst();
                        }
                    }
                    break;
                case Key.Space:
                    if (this.checkedMemberPath && this.selectedIndex > -1) {
                        var cb = this._getCheckbox(this.selectedIndex);
                        if (cb) {
                            this.hostElement.focus(); // take focus from the checkbox (FireFox, TFS 135857)
                            this.setItemChecked(this.selectedIndex, !cb.checked);
                            e.preventDefault();
                        }
                    }
                    break;
            }
        }

        // handle keypress (select/search)
        private _keypress(e: KeyboardEvent) {

            // honor defaultPrevented
            if (e.defaultPrevented) return;

            // don't interfere with inner input elements (TFS 132081)
            if (e.target instanceof HTMLInputElement) return;

            // auto search
            if (e.charCode > 32 || (e.charCode == 32 && this._search)) {
                e.preventDefault();

                // update search string
                this._search += String.fromCharCode(e.charCode).toLowerCase();
                console.log('looking for ' + this._search);
                if (this._toSearch) {
                    clearTimeout(this._toSearch);
                }
                this._toSearch = setTimeout(() => {
                    this._toSearch = 0;
                    this._search = '';
                }, 600);

                // perform search
                var index = this._findNext(); // multi-char search
                if (index < 0 && this._search.length > 1) {
                    this._search = this._search[this._search.length - 1];
                    index = this._findNext(); // single-char search
                }
                if (index > -1) {
                    this.selectedIndex = index;
                }
            }
        }

        // look for the '_search' string from the current position
        private _findNext(): number {
            if (this.hostElement) {
                var cnt = this.hostElement.childElementCount,
                    start = this.selectedIndex;

                // start searching from current or next item
                if (start < 0 || this._search.length == 1) {
                    start++;
                }

                // search through the items (with wrapping)
                for (var off = 0; off < cnt; off++) {
                    var index = (start + off) % cnt,
                        txt = this.getDisplayText(index).trim().toLowerCase();
                    if (txt.indexOf(this._search) == 0) {
                        console.log('match at ' + index);
                        return index;
                    }
                }
            }

            // not found
            return -1;
        }

        // gets the checkbox element in a ListBox item
        private _getCheckbox(index: number): HTMLInputElement {
            var host = this.hostElement;
            if (host && index > -1 && index < host.children.length) {
                return <HTMLInputElement>host.children[index].querySelector('input[type=checkbox]');
            }
            return null;
        }

        // build collectionView from OPTION elements items in a SELECT element
        // this is used by the ComboBox
        _populateSelectElement(hostElement: HTMLElement) {
            var children = hostElement.children,
                items = [],
                selIndex = -1;
            for (var i = 0; i < children.length; i++) {
                var child = <HTMLElement>children[i];
                if (child.tagName == 'OPTION') {

                    // keep track of selected item
                    if (child.hasAttribute('selected')) {
                        selIndex = items.length;
                    }

                    // add option to collectionView
                    if (child.innerHTML) {
                        items.push({
                            hdr: child.innerHTML,
                            val: child.getAttribute('value'),
                            cmdParam: child.getAttribute('cmd-param')
                        });
                    } else {
                        items.push({
                            hdr: '<div class="wj-separator"/>'
                        });
                    }

                    // remove child from host
                    hostElement.removeChild(child);
                    i--;
                }
            }

            // apply items to control
            if (items) {
                this.displayMemberPath = 'hdr';
                this.selectedValuePath = 'val';
                this.itemsSource = items;
                this.selectedIndex = selIndex;
            }
        }

        //#endregion
    }

    /**
     * Provides arguments for the @see:ListBox.formatItem event.
     */
    export class FormatItemEventArgs extends EventArgs {
        _index: number;
        _data: any;
        _item: HTMLElement;

       /**
        * Initializes a new instance of the @see:FormatItemEventArgs class.
        *
        * @param index Index of the item being formatted.
        * @param data Data item being formatted.
        * @param item Element that represents the list item to be formatted.
        */
        constructor(index: number, data: any, item: HTMLElement) {
            super();
            this._index = asNumber(index);
            this._data = data;
            this._item = asType(item, HTMLElement);
        }
        /**
         * Gets the index of the data item in the list.
         */
        get index():  number {
            return this._index;
        }
        /**
         * Gets the data item being formatted.
         */
        get data(): any {
            return this._data;
        }
        /**
         * Gets a reference to the element that represents the list item to be formatted.
         */
        get item(): HTMLElement {
            return this._item;
        }
    }
}