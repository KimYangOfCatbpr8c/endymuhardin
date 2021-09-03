/**
 * Defines input controls for strings, numbers, dates, times, and colors.
 */
module wijmo.input {
    'use strict';

    /**
     * The @see:AutoComplete control is an input control that allows callers 
     * to customize the item list as the user types.
     *
     * The control is similar to the @see:ComboBox, except the item source is a 
     * function (@see:itemsSourceFunction) rather than a static list. For example,
     * you can look up items on remote databases as the user types.
     *
     * The example below creates an @see:AutoComplete control and populates it using
     * a 'countries' array. The @see:AutoComplete searches for the country as the user
     * types, and narrows down the list of countries that match the current input.
     * 
     * @fiddle:8HnLx
     */
    export class AutoComplete extends ComboBox {

        // property storage
        private _cssMatch = 'wj-autocomplete-match';
        private _itemsSourceFn: Function;
        private _itemsSourceFnCallBackBnd: Function;
        private _srchProp: string;
        private _minLength = 2;
        private _maxItems = 6;
        private _itemCount = 0;
        private _delay = 500;
        private _itemFormatter: Function;

        // private stuff
        private _toSearch: any;
        private _query = '';
        private _rxMatch: any;
        private _rxHighlight: any;
        private _inCallback = false;
        private _srchProps: string[] = [];

        /**
         * Initializes a new instance of the @see:AutoComplete class.
         *
         * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
         * @param options The JavaScript object containing initialization data for the control.
         */
        constructor(element: any, options?: any) {
            super(element);
            addClass(this.hostElement, 'wj-autocomplete');
            this.isEditable = true;
            this.isRequired = false; // TFS 142492
            this.isContentHtml = true;
            //this.listBox.itemFormatter = this._defaultFormatter.bind(this);
            this.listBox.formatItem.addHandler(this._formatListItem, this);
            this._itemsSourceFnCallBackBnd = this._itemSourceFunctionCallback.bind(this);
            this.initialize(options);
        }

        //--------------------------------------------------------------------------
        //#region ** object model

        /**
         * Gets or sets the minimum input length to trigger auto-complete suggestions.
         */
        get minLength(): number {
            return this._minLength;
        }
        set minLength(value: number) {
            this._minLength = asNumber(value, false, true);
        }
        /**
         * Gets or sets the maximum number of items to display in the drop-down list.
         */
        get maxItems(): number {
            return this._maxItems;
        }
        set maxItems(value: number) {
            this._maxItems = asNumber(value, false, true);
        }
        /**
         * Gets or sets the delay, in milliseconds, between when a keystroke occurs
         * and when the search is performed.
         */
        get delay(): number {
            return this._delay;
        }
        set delay(value: number) {
            this._delay = asNumber(value, false, true);
        }
        /**
         * Gets or sets a string containing a comma-separated list of properties to use
         * when searching for items.
         *
         * By default, the @see:AutoComplete control searches for matches against the
         * property specified by the @see:displayMemberPath property. The @see:searchMemberPath
         * property allows you to search using additional properties.
         *
         * For example, the code below would cause the control to display the company name
         * and search by company name, symbol, and country:
         *
         * <pre>var ac = new wijmo.input.AutoComplete('#autoComplete', {
         *   itemsSource: companies,
         *   displayMemberPath: 'name',
         *   searchMemberPath: 'symbol,country'
         * });</pre>
         */
        get searchMemberPath(): string {
            return this._srchProp;
        }
        set searchMemberPath(value: string) {
            this._srchProp = asString(value);
            this._srchProps = value ? value.trim().split(/\s*,\s*/) : [];
        }
        /**
         * Gets or sets a function that provides list items dynamically as the user types.
         *
         * The function takes three parameters: 
         * <ul>
         *     <li>the query string typed by the user</li>
         *     <li>the maximum number of items to return</li>
         *     <li>the callback function to call when the results become available</li>
         * </ul>
         *
         * For example:
         * <pre>
         * autoComplete.itemsSourceFunction = function (query, max, callback) {
         *   // get results from the server
         *   var params = { query: query, max: max };
         *   $.getJSON('companycatalog.ashx', params, function (response) {
         *     // return results to the control
         *     callback(response);
         *   });
         * };
         * </pre>
         */
        get itemsSourceFunction(): Function {
            return this._itemsSourceFn;
        }
        set itemsSourceFunction(value: Function) {
            this._itemsSourceFn = asFunction(value);
            if (isFunction(this._itemsSourceFn)) {
                this.itemsSourceFunction(this.text, this.maxItems, this._itemsSourceFnCallBackBnd);
            }
        }
        /**
         * Gets or sets the name of the CSS class used to highlight any parts 
         * of the content that match the search terms.
         */
        get cssMatch(): string {
            return this._cssMatch;
        }
        set cssMatch(value: string) {
            this._cssMatch = asString(value);
        }

        //#endregion ** object model

        //--------------------------------------------------------------------------
        //#region ** overrides

        // override to chain custom formatter with our highlighter
        get itemFormatter(): Function {
            return this._itemFormatter;
        }
        set itemFormatter(value: Function) {
            this._itemFormatter = asFunction(value);
        }

        // override to make up/down keys work properly
        _keydown(e: KeyboardEvent) {
            if (!e.defaultPrevented && this.isDroppedDown) {
                switch (e.keyCode) {
                    case Key.Up:
                    case Key.Down:
                        this.selectAll();
                        break;
                }
            }
            super._keydown(e);
        }

        // update text in textbox
        _setText(text: string) {
            // don't call base class (to avoid autocomplete)

            // don't do this while handling the itemsSourcefunction callback
            if (this._inCallback) {
                return;
            }

            // resetting...
            if (!text && this.selectedIndex > -1) {
                this.selectedIndex = -1;
            }

            // raise textChanged
            if (text != this._oldText) {

                // assign only if necessary to prevent occasionally swapping chars (Android 4.4.2)
                if (this._tbx.value != text) {
                    this._tbx.value = text;
                }
                this._oldText = text;
                this.onTextChanged();

                // no text? no filter...
                if (!text && this.collectionView) {
                    this.collectionView.filter = this._query = null;
                    this.isDroppedDown = false;
                    return;
                }
            }

            // update list when user types in some text
            if (this._toSearch) {
                clearTimeout(this._toSearch);
            }
            if (text != this.getDisplayText()) {

                // get new search terms on a timeOut (so the control doesn't update too often)
                this._toSearch = setTimeout(() => {
                    this._toSearch = null;

                    // get search terms
                    var terms = this.text.trim().toLowerCase();
                    if (terms.length >= this._minLength && terms != this._query) {

                        // save new search terms
                        this._query = terms;

                        // escape RegEx characters in the terms string
                        terms = terms.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");

                        // build regular expressions for searching and highlighting the items
                        // when searching, match *all* terms on the string
                        // when highlighting, match *any* terms on the string
                        // if the content is html, use negative lookahead to highlight only outside HTML tags
                        // http://stackoverflow.com/questions/18621568/regex-replace-text-outside-html-tags
                        this._rxMatch = new RegExp('(?=.*' + terms.replace(/ /g, ')(?=.*') + ')', 'ig');
                        this._rxHighlight = this.isContentHtml
                            ? new RegExp('(' + terms.replace(/ /g, '|') + ')(?![^<]*>|[^<>]* </)', 'ig')
                            : new RegExp('(' + terms.replace(/ /g, '|') + ')', 'ig');

                        // update list
                        //this.isDroppedDown = false;
                        if (this.itemsSourceFunction) {
                            this.itemsSourceFunction(terms, this.maxItems, this._itemsSourceFnCallBackBnd);
                        } else {
                            this._updateItems();
                        }
                    }
                }, this._delay);
            }
        }

        // populate list with results from itemSourceFunction
        _itemSourceFunctionCallback(result) {

            // update list
            this._inCallback = true;
            var cv = asCollectionView(result);
            if (cv) {
                cv.moveCurrentToPosition(-1);
            }
            this.itemsSource = cv;
            this._inCallback = false;

            // show list at the proper place if we have the focus 
            if (this.containsFocus()) { // TFS 202912
                this.isDroppedDown = true;
                this.refresh();
            }
        }

        // closing the drop-down: commit the change
        onIsDroppedDownChanged(e?: EventArgs) {

            // do not call super because it selects the whole text, and we don't
            // want to do that while the user is typing
            //super.onIsDroppedDownChanged(e);
            this.isDroppedDownChanged.raise(this, e);

            // select the whole text only if we have a selected item
            this._query = '';
            if (this.selectedIndex > -1) {
                this._setText(this.getDisplayText());
                if (!this.isTouching) {
                    this.selectAll();
                }
            } else if (!this.isTouching) { // TFS 128884
                this._tbx.focus();
            }
        }

        //#endregion ** overrides

        //--------------------------------------------------------------------------
        //#region ** implementation

        // apply the filter to show only the matches
        protected _updateItems() {
            var cv = this.collectionView;
            if (cv) {

                // apply the filter
                this._inCallback = true;
                cv.beginUpdate();
                this._itemCount = 0;
                cv.filter = this._filter.bind(this);
                cv.moveCurrentToPosition(-1);
                cv.endUpdate();
                this._inCallback = false;

                // show/hide the drop-down
                this.isDroppedDown = cv.items.length > 0 && this.containsFocus();
                if (cv.items.length == 0 && !this.isEditable) { // honor isEditable: TFS 81936
                    this.selectedIndex = -1;
                }

                // refresh to update the drop-down position
                this.refresh();
            }
        }

        // filter the items and show only the matches
        protected _filter(item: any): boolean {

            // honor maxItems
            if (this._itemCount >= this._maxItems) {
                return false;
            }

            // apply filter to item
            var text = item ? item.toString() : '';
            if (this.displayMemberPath) {
                text = item[this.displayMemberPath];
                for (var i = 0; i < this._srchProps.length; i++) {
                    text += '\0' + item[this._srchProps[i]];
                }
            }

            // remove html tags for matching
            if (this.isContentHtml) {
                text = text.replace(/<[^>]*>/g, '');
            }

            // count matches
            if (text.match(this._rxMatch)) {
                this._itemCount++;
                return true;
            }

            // no pass
            return false;
        }

        // listbox item formatter: show matches in bold
        protected _formatListItem(sender, e: FormatItemEventArgs) {
            if (this._cssMatch) {
                var highlight = '<span class="' + this._cssMatch + '">$1</span>';
                e.item.innerHTML = e.item.innerHTML.replace(this._rxHighlight, highlight);
            }
        }

        //#endregion ** implementation
    }
}