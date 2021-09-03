var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Defines input controls for strings, numbers, dates, times, and colors.
 */
var wijmo;
(function (wijmo) {
    var input;
    (function (input) {
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
        var AutoComplete = (function (_super) {
            __extends(AutoComplete, _super);
            /**
             * Initializes a new instance of the @see:AutoComplete class.
             *
             * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function AutoComplete(element, options) {
                _super.call(this, element);
                // property storage
                this._cssMatch = 'wj-autocomplete-match';
                this._minLength = 2;
                this._maxItems = 6;
                this._itemCount = 0;
                this._delay = 500;
                this._query = '';
                this._inCallback = false;
                this._srchProps = [];
                wijmo.addClass(this.hostElement, 'wj-autocomplete');
                this.isEditable = true;
                this.isRequired = false; // TFS 142492
                this.isContentHtml = true;
                this.listBox.itemFormatter = this._defaultFormatter.bind(this);
                this.initialize(options);
            }
            Object.defineProperty(AutoComplete.prototype, "minLength", {
                //--------------------------------------------------------------------------
                //#region ** object model
                /**
                 * Gets or sets the minimum input length to trigger auto-complete suggestions.
                 */
                get: function () {
                    return this._minLength;
                },
                set: function (value) {
                    this._minLength = wijmo.asNumber(value, false, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AutoComplete.prototype, "maxItems", {
                /**
                 * Gets or sets the maximum number of items to display in the drop-down list.
                 */
                get: function () {
                    return this._maxItems;
                },
                set: function (value) {
                    this._maxItems = wijmo.asNumber(value, false, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AutoComplete.prototype, "delay", {
                /**
                 * Gets or sets the delay, in milliseconds, between when a keystroke occurs
                 * and when the search is performed.
                 */
                get: function () {
                    return this._delay;
                },
                set: function (value) {
                    this._delay = wijmo.asNumber(value, false, true);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AutoComplete.prototype, "searchMemberPath", {
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
                get: function () {
                    return this._srchProp;
                },
                set: function (value) {
                    this._srchProp = wijmo.asString(value);
                    this._srchProps = value ? value.trim().split(/\s*,\s*/) : [];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AutoComplete.prototype, "itemsSourceFunction", {
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
                get: function () {
                    return this._itemsSourceFn;
                },
                set: function (value) {
                    this._itemsSourceFn = wijmo.asFunction(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AutoComplete.prototype, "cssMatch", {
                /**
                 * Gets or sets the name of the CSS class used to highlight any parts
                 * of the content that match the search terms.
                 */
                get: function () {
                    return this._cssMatch;
                },
                set: function (value) {
                    this._cssMatch = wijmo.asString(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AutoComplete.prototype, "itemFormatter", {
                //#endregion ** object model
                //--------------------------------------------------------------------------
                //#region ** overrides
                // override to chain custom formatter with our highlighter
                get: function () {
                    return this._itemFormatter;
                },
                set: function (value) {
                    this._itemFormatter = wijmo.asFunction(value);
                },
                enumerable: true,
                configurable: true
            });
            // override to make up/down keys work properly
            AutoComplete.prototype._keydown = function (e) {
                if (!e.defaultPrevented && this.isDroppedDown) {
                    switch (e.keyCode) {
                        case wijmo.Key.Up:
                        case wijmo.Key.Down:
                            this.selectAll();
                            break;
                    }
                }
                _super.prototype._keydown.call(this, e);
            };
            // update text in textbox
            AutoComplete.prototype._setText = function (text) {
                // don't call base class (to avoid autocomplete)
                var _this = this;
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
                    this._toSearch = setTimeout(function () {
                        _this._toSearch = null;
                        // get search terms
                        var terms = _this.text.trim().toLowerCase();
                        if (terms.length >= _this._minLength && terms != _this._query) {
                            // save new search terms
                            _this._query = terms;
                            // escape RegEx characters in the terms string
                            terms = terms.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
                            // build regular expressions for searching and highlighting the items
                            _this._rxMatch = new RegExp('(?=.*' + terms.replace(/ /g, ')(?=.*') + ')', 'ig');
                            _this._rxHighlight = new RegExp('(' + terms.replace(/ /g, '|') + ')', 'ig');
                            // update list
                            //this.isDroppedDown = false;
                            if (_this.itemsSourceFunction) {
                                _this.itemsSourceFunction(terms, _this.maxItems, _this._itemSourceFunctionCallback.bind(_this));
                            }
                            else {
                                _this._updateItems();
                            }
                        }
                    }, this._delay);
                }
            };
            // populate list with results from itemSourceFunction
            AutoComplete.prototype._itemSourceFunctionCallback = function (result) {
                // update the itemsSource
                this._inCallback = true;
                var cv = wijmo.asCollectionView(result);
                if (cv) {
                    cv.moveCurrentToPosition(-1);
                }
                this.itemsSource = cv;
                this.isDroppedDown = true;
                this._inCallback = false;
                // refresh to update the drop-down position
                this.refresh();
            };
            // closing the drop-down: commit the change
            AutoComplete.prototype.onIsDroppedDownChanged = function (e) {
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
                }
                else if (!this.isTouching) {
                    this._tbx.focus();
                }
            };
            //#endregion ** overrides
            //--------------------------------------------------------------------------
            //#region ** implementation
            // apply the filter to show only the matches
            AutoComplete.prototype._updateItems = function () {
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
                    if (cv.items.length == 0 && !this.isEditable) {
                        this.selectedIndex = -1;
                    }
                    // refresh to update the drop-down position
                    this.refresh();
                }
            };
            // filter the items and show only the matches
            AutoComplete.prototype._filter = function (item) {
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
                // count matches
                if (this._rxMatch.test(text)) {
                    this._itemCount++;
                    return true;
                }
                // no pass
                return false;
            };
            // default item formatter: show matches in bold
            AutoComplete.prototype._defaultFormatter = function (index, text) {
                // call custom formatter
                if (this._itemFormatter) {
                    text = this._itemFormatter(index, text);
                }
                // highlight matches
                if (this._rxHighlight && this._cssMatch) {
                    var highlight = '<span class="' + this._cssMatch + '">$1</span>';
                    text = text.replace(this._rxHighlight, highlight);
                }
                // done
                return text;
            };
            return AutoComplete;
        }(input.ComboBox));
        input.AutoComplete = AutoComplete;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=AutoComplete.js.map