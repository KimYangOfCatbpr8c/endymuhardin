module wijmo.input {
    'use strict';

    /**
     * The @see:ComboBox control allows users to pick strings from lists.
     *
     * The control automatically completes entries as the user types, and allows users 
     * to show a drop-down list with the items available.
     *
     * Use the @see:ComboBox.itemsSource property to populate the list of options.
     * The items may be strings or objects. If the items are objects, use the
     * @see:ComboBox.displayMemberPath to define which property of the items will be
     * displayed in the list and use the @see:ComboBox.selectedValuePath property to
     * define which property of the items will be used to set the combo's
     * @see:ComboBox.selectedValue property.
     *
     * Use the @see:ComboBox.selectedIndex or the @see:ComboBox.text properties to
     * determine which item is currently selected.
     *
     * The @see:ComboBox.isEditable property determines whether users can enter values
     * that are not present in the list.
     *
     * The example below creates a @see:ComboBox control and populates it with a list
     * of countries. The @see:ComboBox searches for the country as the user types. 
     * The @see:ComboBox.isEditable property is set to false, so the user is forced to
     * select one of the items in the list.
     *
     * The example also shows how to create and populate a @see:ComboBox using
     * an HTML <b>&lt;select&gt;</b> element with <b>&lt;option&gt;</b> child
     * elements.
     *
     * @fiddle:8HnLx
     */
    export class ComboBox extends DropDown {

        // child elements
        _lbx: ListBox;

        // property storage
        _editable = false;

        // private stuff
        _composing = false;
        _deleting = false;
        _settingText = false;
        _cvt: HTMLElement;
        _hdrPath: string;

        /**
         * Initializes a new instance of the @see:ComboBox class.
         *
         * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
         * @param options The JavaScript object containing initialization data for the control.
         */
        constructor(element: any, options?) {
            super(element);
            addClass(this.hostElement, 'wj-combobox');

            // disable auto-expand by default
            this.autoExpandSelection = false;

            // handle IME
            this.addEventListener(this._tbx, 'compositionstart', () => {
                this._composing = true;
            });
            this.addEventListener(this._tbx, 'compositionend', () => {
                this._composing = false;
                setTimeout(() => {
                    this._setText(this.text, true);
                });
            });

            // use wheel to scroll through the items
            this.addEventListener(this.hostElement, 'wheel', (e: WheelEvent) => {
                if (!e.defaultPrevented && !this.isDroppedDown && !this.isReadOnly && this.containsFocus()) {
                    if (this.selectedIndex > -1) {
                        var step = clamp(-e.deltaY, -1, +1);
                        this.selectedIndex = clamp(this.selectedIndex - step, 0, this.collectionView.items.length - 1);
                        e.preventDefault();
                    }
                }
            });

            // initializing from <select> tag
            if (this._orgTag == 'SELECT') {
                this._lbx._populateSelectElement(this.hostElement);
            }

            // initialize control options
            this.isRequired = true;
            this.initialize(options);
        }

        //--------------------------------------------------------------------------
        //#region ** object model

        /**
         * Gets or sets the array or @see:ICollectionView object that contains the items to select from. 
         */
        get itemsSource(): any {
            return this._lbx.itemsSource;
        }
        set itemsSource(value: any) {
            this._lbx.itemsSource = value;
            this._updateBtn();
        }
        /**
         * Gets the @see:ICollectionView object used as the item source.
         */
        get collectionView(): collections.ICollectionView {
            return this._lbx.collectionView;
        }
        /**
         * Gets or sets the name of the property to use as the visual representation of the items.
         */
        get displayMemberPath(): string {
            return this._lbx.displayMemberPath;
        }
        set displayMemberPath(value: string) {
            this._lbx.displayMemberPath = value;
            var text = this.getDisplayText();
            if (this.text != text) {
                this._setText(text, true);
            }
        }
        /**
         * Gets or sets the name of a property to use for getting the value displayed in the
         * control's input element.
         *
         * The default value for this property is null, which causes the control to display
         * the same content in the input element as in the selected item of the drop-down list.
         *
         * Use this property if you want to de-couple the value shown in the input element
         * from the values shown in the drop-down list. For example, the input element could
         * show an item's name and the drop-down list could show additional detail.
         */
        get headerPath(): string {
            return this._hdrPath;
        }
        set headerPath(value: string) {
            this._hdrPath = asString(value);
            var text = this.getDisplayText();
            if (this.text != text) {
                this._setText(text, true);
            }
        }
        /**
         * Gets or sets the name of the property used to get the
         * @see:selectedValue from the @see:selectedItem.
         */
        get selectedValuePath(): string {
            return this._lbx.selectedValuePath;
        }
        set selectedValuePath(value: string) {
            this._lbx.selectedValuePath = value;
        }
        /**
         * Gets or sets a value indicating whether the drop-down list displays
         * items as plain text or as HTML.
         */
        get isContentHtml(): boolean {
            return this._lbx.isContentHtml;
        }
        set isContentHtml(value: boolean) {
            if (value != this.isContentHtml) {
                this._lbx.isContentHtml = asBoolean(value);
                var text = this.getDisplayText();
                if (this.text != text) {
                    this._setText(text, true);
                }
            }
        }
        /**
         * Gets or sets a function used to customize the values shown in the
         * drop-down list.
         * The function takes two arguments, the item index and the default
         * text or html, and returns the new text or html to display.
         *
         * If the formatting function needs a scope (i.e. a meaningful 'this'
         * value), then remember to set the filter using the 'bind' function to
         * specify the 'this' object. For example:
         *
         * <pre>
         *   comboBox.itemFormatter = customItemFormatter.bind(this);
         *   function customItemFormatter(index, content) {
         *     if (this.makeItemBold(index)) {
         *       content = '&lt;b&gt;' + content + '&lt;/b&gt;';
         *     }
         *     return content;
         *   }
         * </pre>
         */
        get itemFormatter(): Function {
            return this._lbx.itemFormatter;
        }
        set itemFormatter(value: Function) {
            this._lbx.itemFormatter = asFunction(value); // update drop-down
            this.selectedIndex = this._lbx.selectedIndex; // update control
        }
        /**
         * Gets or sets the index of the currently selected item in the drop-down list.
         */
        get selectedIndex(): number {
            return this._lbx.selectedIndex;
        }
        set selectedIndex(value: number) {
            if (value != this.selectedIndex) {
                this._lbx.selectedIndex = value;
            }
            var text = this.getDisplayText(value);
            if (this.text != text) {
                this._setText(text, true);
            }
        }
        /**
         * Gets or sets the item that is currently selected in the drop-down list.
         */
        get selectedItem(): any {
            return this._lbx.selectedItem;
        }
        set selectedItem(value: any) {
            this._lbx.selectedItem = value;
        }
        /**
         * Gets or sets the value of the @see:selectedItem, obtained using the @see:selectedValuePath.
         */
        get selectedValue(): any {
            return this._lbx.selectedValue;
        }
        set selectedValue(value: any) {
            this._lbx.selectedValue = value;
        }
        /**
         * Gets or sets a value that enables or disables editing of the text 
         * in the input element of the @see:ComboBox (defaults to false).
         */
        get isEditable(): boolean {
            return this._editable;
        }
        set isEditable(value: boolean) {
            this._editable = asBoolean(value);
        }
        /**
         * Gets or sets the maximum height of the drop-down list.
         */
        get maxDropDownHeight(): number {
            return this._lbx.maxHeight;
        }
        set maxDropDownHeight(value: number) {
            this._lbx.maxHeight = asNumber(value);
        }
        /**
         * Gets or sets the maximum width of the drop-down list.
         *
         * The width of the drop-down list is also limited by the width of 
         * the control itself (that value represents the drop-down's minimum width).
         */
        get maxDropDownWidth(): number {
            var lbx = <HTMLElement>this._dropDown;
            return parseInt(lbx.style.maxWidth);
        }
        set maxDropDownWidth(value: number) {
            var lbx = <HTMLElement>this._dropDown;
            lbx.style.maxWidth = asNumber(value) + 'px';
        }
        /**
         * Gets the string displayed in the input element for the item at a 
         * given index (always plain text).
         *
         * @param index The index of the item to retrieve the text for.
         */
        getDisplayText(index: number = this.selectedIndex): string {

            // get display text directly from the headerPath if that was specified
            if (this.headerPath && index > -1 && hasItems(this.collectionView)) {
                var item = this.collectionView.items[index][this.headerPath],
                    text = item != null ? item.toString() : '';
                if (this.isContentHtml) {
                    if (!this._cvt) {
                        this._cvt = document.createElement('div');
                    }
                    this._cvt.innerHTML = text;
                    text = this._cvt.textContent;
                }
                return text;
            }

            // headerPath not specified, get text straight from the ListBox
            return this._lbx.getDisplayText(index);
        }
        /**
         * Occurs when the value of the @see:selectedIndex property changes.
         */
        selectedIndexChanged = new Event();
        /**
         * Raises the @see:selectedIndexChanged event.
         */
        onSelectedIndexChanged(e?: EventArgs) {
            this._updateBtn();
            this.selectedIndexChanged.raise(this, e);
        }
        /**
         * Gets the index of the first item that matches a given string.
         *
         * @param text The text to search for.
         * @param fullMatch Whether to look for a full match or just the start of the string.
         * @return The index of the item, or -1 if not found.
         */
        indexOf(text: string, fullMatch: boolean): number {
            var cv = this.collectionView;
            if (hasItems(cv) && text) {

                // preserve the current selection if possible 
                // http://wijmo.com/topic/wj-combo-box-bug/#post-76154
                if (fullMatch && this.selectedIndex > -1 && text == this.getDisplayText(this.selectedIndex)) {
                    return this.selectedIndex;
                }

                // scan the list from the start
                text = text.toString().toLowerCase();
                for (var i = 0; i < cv.items.length; i++) {
                    var t = this.getDisplayText(i).toLowerCase();
                    if (fullMatch) {
                        if (t == text) {
                            return i;
                        }
                    } else {
                        if (text && t.indexOf(text) == 0) {
                            return i;
                        }
                    }
                }
            }

            // not found
            return -1;
        }
        /**
         * Gets the @see:ListBox control shown in the drop-down.
         */
        get listBox(): ListBox {
            return this._lbx;
        }

        //#endregion ** object model

        //--------------------------------------------------------------------------
        //#region ** overrides

        // update the content when refreshing
        refresh(fullUpdate?: boolean) {
            super.refresh(fullUpdate);
            if (hasItems(this.collectionView)) { // TFS 201563
                this._lbx.refresh();
                if (this.selectedIndex > -1) {
                    this.selectedIndex = this._lbx.selectedIndex;
                }
            }
        }

        // prevent empty values if editable and required (TFS 138025)
        onLostFocus(e?: EventArgs) {
            if (this.isEditable && this.isRequired && !this.text) {
                if (hasItems(this.collectionView)) {
                    this.selectedIndex = 0;
                }
            }
            super.onLostFocus(e);
        }

        // prevent dropping down with no items
        onIsDroppedDownChanging(e: CancelEventArgs): boolean {
            return hasItems(this.collectionView)
                ? super.onIsDroppedDownChanging(e)
                : false;
        }

        // show current selection when dropping down
        onIsDroppedDownChanged(e?: EventArgs) {
            super.onIsDroppedDownChanged(e);
            if (this.isDroppedDown) {
                this._lbx.showSelection();
                if (!this.isTouching) {
                    this.selectAll();
                }
            }
        }

        // update button visibility and value list
        protected _updateBtn() {
            var cv = this.collectionView;
            this._btn.style.display = this._showBtn && hasItems(cv) ? '' : 'none';
        }

        // create the drop-down element
        protected _createDropDown() {

            // create the drop-down element
            this._lbx = new ListBox(this._dropDown);

            // limit the size of the drop-down
            this._lbx.maxHeight = 200;

            // update our selection when user picks an item from the ListBox
            // or when the selected index changes because the list changed
            this._lbx.selectedIndexChanged.addHandler(() => {
                this._updateBtn();
                this.selectedIndex = this._lbx.selectedIndex;
                this.onSelectedIndexChanged();
            });

            // update button display when item list changes
            this._lbx.itemsChanged.addHandler(() => {
                this._updateBtn();
            });

            // close the drop-down when the user clicks to select an item
            this.addEventListener(this._dropDown, 'click', this._dropDownClick.bind(this));
        }

        //#endregion ** overrides

        //--------------------------------------------------------------------------
        //#region ** implementation

        // close the drop-down when the user clicks to select an item
        protected _dropDownClick(e: MouseEvent) {
            if (!e.defaultPrevented) {
                if (e.target != this._dropDown) { // an item, not the list itself...
                    this.isDroppedDown = false;
                }
            }
        }

        // update text in textbox
        protected _setText(text: string, fullMatch: boolean) {

            // not while composing IME text...
            if (this._composing) return;

            // prevent reentrant calls while moving CollectionView cursor
            if (this._settingText) return;
            this._settingText = true;

            // make sure we have a string
            if (text == null) text = '';
            text = text.toString();

            // get variables we need
            var index = this.selectedIndex,
                cv = this.collectionView,
                start = this._getSelStart(),
                len = -1;

            // require full match if deleting (to avoid auto-completion)
            if (this._deleting) {
                fullMatch = true;
            }

            // try auto-completion
            if (this._deleting) {
                index = this.indexOf(text, true);
            } else {
                index = this.indexOf(text, fullMatch);
                if (index < 0 && fullMatch) { // not found, try partial match
                    index = this.indexOf(text, false);
                }
                if (index < 0 && start > 0) { // not found, try up to cursor
                    index = this.indexOf(text.substr(0, start), false);
                }
            }

            // not found and not editable? restore old text and move cursor to matching part
            if (index < 0 && !this.isEditable && hasItems(cv)) {
                if (this.isRequired || text) { // allow removing the value if not required
                    index = Math.max(0, this.indexOf(this._oldText, false));
                    for (var i = 0; i < text.length && i < this._oldText.length; i++) {
                        if (text[i] != this._oldText[i]) {
                            start = i;
                            break;
                        }
                    }
                }
            }
            if (index > -1) {
                len = start;
                text = this.getDisplayText(index);
            }

            // update collectionView
            if (cv) {
                cv.moveCurrentToPosition(index);
            }

            // update element
            if (text != this._tbx.value) {
                this._tbx.value = text;
            }

            // update text selection
            if (len > -1 && this.containsFocus() && !this.isTouching) {
                this._setSelRange(len, text.length);
            }

            // call base class to fire textChanged event
            super._setText(text, fullMatch);

            // clear flags
            this._deleting = false;
            this._settingText = false;
        }

        // skip to the next/previous item that starts with a given string, wrapping
        protected _findNext(text: string, step: number): number {
            if (this.collectionView) {
                text = text.toLowerCase();
                var len = this.collectionView.items.length,
                    index: number,
                    t: string;
                for (var i = 1; i <= len; i++) {
                    index = (this.selectedIndex + i * step + len) % len;
                    t = this.getDisplayText(index).toLowerCase();
                    if (t.indexOf(text) == 0) {
                        return index;
                    }
                }
            }
            return this.selectedIndex;
        }

        // override to select items with the keyboard
        protected _keydown(e: KeyboardEvent) {

            // allow base class
            super._keydown(e);

            // if the base class handled this, we're done
            if (e.defaultPrevented) {
                return;
            }

            // if the input element is not visible, we're done (e.g. menu)
            if (this._elRef != this._tbx) {
                return;
            }

            // remember we pressed a key when handling the TextChanged event
            if (e.keyCode == Key.Back || e.keyCode == Key.Delete) {
                this._deleting = true;
            }

            // not if we have no items
            var cv = this.collectionView;
            if (!cv || !cv.items) {
                return;
            }

            // handle key up/down keys to move to the next/previous items (TFS 153089, 200212)
            switch (e.keyCode) {
                case Key.Up:
                case Key.Down:
                    var start = this._getSelStart();
                    if (start == this.text.length) {
                        start = 0;
                    };
                    this.selectedIndex = this._findNext(this.text.substr(0, start), e.keyCode == Key.Up ? -1 : +1);
                    setSelectionRange(this._tbx, start, this.text.length);
                    e.preventDefault();
                    break;
            }
        }

        // set selection range in input element (if it is visible)
        private _setSelRange(start: number, end: number) {
            if (this._elRef == this._tbx) {
                setSelectionRange(this._tbx, start, end);
            }
        }

        // get selection start in an extra-safe way (TFS 82372)
        private _getSelStart(): number {
            return this._tbx && this._tbx.value
                ? this._tbx.selectionStart
                : 0;
        }

        //#endregion ** implementation
    }
}