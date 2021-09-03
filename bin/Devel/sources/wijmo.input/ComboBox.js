var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var input;
    (function (input) {
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
        var ComboBox = (function (_super) {
            __extends(ComboBox, _super);
            /**
             * Initializes a new instance of the @see:ComboBox class.
             *
             * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function ComboBox(element, options) {
                var _this = this;
                _super.call(this, element);
                // property storage
                this._editable = false;
                // private stuff
                this._composing = false;
                this._deleting = false;
                this._settingText = false;
                /**
                 * Occurs when the value of the @see:selectedIndex property changes.
                 */
                this.selectedIndexChanged = new wijmo.Event();
                wijmo.addClass(this.hostElement, 'wj-combobox');
                // disable auto-expand by default
                this.autoExpandSelection = false;
                // handle IME
                this.addEventListener(this._tbx, 'compositionstart', function () {
                    _this._composing = true;
                });
                this.addEventListener(this._tbx, 'compositionend', function () {
                    _this._composing = false;
                    setTimeout(function () {
                        _this._setText(_this.text, true);
                    });
                });
                // use wheel to scroll through the items
                this.addEventListener(this.hostElement, 'wheel', function (e) {
                    if (!e.defaultPrevented && !_this.isDroppedDown && !_this.isReadOnly && _this.containsFocus()) {
                        if (_this.selectedIndex > -1) {
                            var step = wijmo.clamp(-e.deltaY, -1, +1);
                            _this.selectedIndex = wijmo.clamp(_this.selectedIndex - step, 0, _this.collectionView.items.length - 1);
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
            Object.defineProperty(ComboBox.prototype, "itemsSource", {
                //--------------------------------------------------------------------------
                //#region ** object model
                /**
                 * Gets or sets the array or @see:ICollectionView object that contains the items to select from.
                 */
                get: function () {
                    return this._lbx.itemsSource;
                },
                set: function (value) {
                    this._lbx.itemsSource = value;
                    this._updateBtn();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "collectionView", {
                /**
                 * Gets the @see:ICollectionView object used as the item source.
                 */
                get: function () {
                    return this._lbx.collectionView;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "displayMemberPath", {
                /**
                 * Gets or sets the name of the property to use as the visual representation of the items.
                 */
                get: function () {
                    return this._lbx.displayMemberPath;
                },
                set: function (value) {
                    this._lbx.displayMemberPath = value;
                    var text = this.getDisplayText();
                    if (this.text != text) {
                        this._setText(text, true);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "headerPath", {
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
                get: function () {
                    return this._hdrPath;
                },
                set: function (value) {
                    this._hdrPath = wijmo.asString(value);
                    var text = this.getDisplayText();
                    if (this.text != text) {
                        this._setText(text, true);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "selectedValuePath", {
                /**
                 * Gets or sets the name of the property used to get the
                 * @see:selectedValue from the @see:selectedItem.
                 */
                get: function () {
                    return this._lbx.selectedValuePath;
                },
                set: function (value) {
                    this._lbx.selectedValuePath = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "isContentHtml", {
                /**
                 * Gets or sets a value indicating whether the drop-down list displays
                 * items as plain text or as HTML.
                 */
                get: function () {
                    return this._lbx.isContentHtml;
                },
                set: function (value) {
                    if (value != this.isContentHtml) {
                        this._lbx.isContentHtml = wijmo.asBoolean(value);
                        var text = this.getDisplayText();
                        if (this.text != text) {
                            this._setText(text, true);
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "itemFormatter", {
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
                get: function () {
                    return this._lbx.itemFormatter;
                },
                set: function (value) {
                    this._lbx.itemFormatter = wijmo.asFunction(value); // update drop-down
                    this.selectedIndex = this._lbx.selectedIndex; // update control
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "selectedIndex", {
                /**
                 * Gets or sets the index of the currently selected item in the drop-down list.
                 */
                get: function () {
                    return this._lbx.selectedIndex;
                },
                set: function (value) {
                    if (value != this.selectedIndex) {
                        this._lbx.selectedIndex = value;
                    }
                    var text = this.getDisplayText(value);
                    if (this.text != text) {
                        this._setText(text, true);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "selectedItem", {
                /**
                 * Gets or sets the item that is currently selected in the drop-down list.
                 */
                get: function () {
                    return this._lbx.selectedItem;
                },
                set: function (value) {
                    this._lbx.selectedItem = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "selectedValue", {
                /**
                 * Gets or sets the value of the @see:selectedItem, obtained using the @see:selectedValuePath.
                 */
                get: function () {
                    return this._lbx.selectedValue;
                },
                set: function (value) {
                    this._lbx.selectedValue = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "isEditable", {
                /**
                 * Gets or sets a value that enables or disables editing of the text
                 * in the input element of the @see:ComboBox (defaults to false).
                 */
                get: function () {
                    return this._editable;
                },
                set: function (value) {
                    this._editable = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "maxDropDownHeight", {
                /**
                 * Gets or sets the maximum height of the drop-down list.
                 */
                get: function () {
                    return this._lbx.maxHeight;
                },
                set: function (value) {
                    this._lbx.maxHeight = wijmo.asNumber(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ComboBox.prototype, "maxDropDownWidth", {
                /**
                 * Gets or sets the maximum width of the drop-down list.
                 *
                 * The width of the drop-down list is also limited by the width of
                 * the control itself (that value represents the drop-down's minimum width).
                 */
                get: function () {
                    var lbx = this._dropDown;
                    return parseInt(lbx.style.maxWidth);
                },
                set: function (value) {
                    var lbx = this._dropDown;
                    lbx.style.maxWidth = wijmo.asNumber(value) + 'px';
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Gets the string displayed in the input element for the item at a
             * given index (always plain text).
             *
             * @param index The index of the item to retrieve the text for.
             */
            ComboBox.prototype.getDisplayText = function (index) {
                if (index === void 0) { index = this.selectedIndex; }
                // get display text directly from the headerPath if that was specified
                if (this.headerPath && index > -1 && wijmo.hasItems(this.collectionView)) {
                    var item = this.collectionView.items[index][this.headerPath], text = item != null ? item.toString() : '';
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
            };
            /**
             * Raises the @see:selectedIndexChanged event.
             */
            ComboBox.prototype.onSelectedIndexChanged = function (e) {
                this._updateBtn();
                this.selectedIndexChanged.raise(this, e);
            };
            /**
             * Gets the index of the first item that matches a given string.
             *
             * @param text The text to search for.
             * @param fullMatch Whether to look for a full match or just the start of the string.
             * @return The index of the item, or -1 if not found.
             */
            ComboBox.prototype.indexOf = function (text, fullMatch) {
                var cv = this.collectionView;
                if (wijmo.hasItems(cv) && text) {
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
                        }
                        else {
                            if (text && t.indexOf(text) == 0) {
                                return i;
                            }
                        }
                    }
                }
                // not found
                return -1;
            };
            Object.defineProperty(ComboBox.prototype, "listBox", {
                /**
                 * Gets the @see:ListBox control shown in the drop-down.
                 */
                get: function () {
                    return this._lbx;
                },
                enumerable: true,
                configurable: true
            });
            //#endregion ** object model
            //--------------------------------------------------------------------------
            //#region ** overrides
            // update the content when refreshing
            ComboBox.prototype.refresh = function (fullUpdate) {
                _super.prototype.refresh.call(this, fullUpdate);
                if (wijmo.hasItems(this.collectionView)) {
                    this._lbx.refresh();
                    if (this.selectedIndex > -1) {
                        this.selectedIndex = this._lbx.selectedIndex;
                    }
                }
            };
            // prevent empty values if editable and required (TFS 138025)
            ComboBox.prototype.onLostFocus = function (e) {
                if (this.isEditable && this.isRequired && !this.text) {
                    if (wijmo.hasItems(this.collectionView)) {
                        this.selectedIndex = 0;
                    }
                }
                _super.prototype.onLostFocus.call(this, e);
            };
            // prevent dropping down with no items
            ComboBox.prototype.onIsDroppedDownChanging = function (e) {
                return wijmo.hasItems(this.collectionView)
                    ? _super.prototype.onIsDroppedDownChanging.call(this, e)
                    : false;
            };
            // show current selection when dropping down
            ComboBox.prototype.onIsDroppedDownChanged = function (e) {
                _super.prototype.onIsDroppedDownChanged.call(this, e);
                if (this.isDroppedDown) {
                    this._lbx.showSelection();
                    if (!this.isTouching) {
                        this.selectAll();
                    }
                }
            };
            // update button visibility and value list
            ComboBox.prototype._updateBtn = function () {
                var cv = this.collectionView;
                this._btn.style.display = this._showBtn && wijmo.hasItems(cv) ? '' : 'none';
            };
            // create the drop-down element
            ComboBox.prototype._createDropDown = function () {
                var _this = this;
                // create the drop-down element
                this._lbx = new input.ListBox(this._dropDown);
                // limit the size of the drop-down
                this._lbx.maxHeight = 200;
                // update our selection when user picks an item from the ListBox
                // or when the selected index changes because the list changed
                this._lbx.selectedIndexChanged.addHandler(function () {
                    _this._updateBtn();
                    _this.selectedIndex = _this._lbx.selectedIndex;
                    _this.onSelectedIndexChanged();
                });
                // update button display when item list changes
                this._lbx.itemsChanged.addHandler(function () {
                    _this._updateBtn();
                });
                // close the drop-down when the user clicks to select an item
                this.addEventListener(this._dropDown, 'click', this._dropDownClick.bind(this));
            };
            //#endregion ** overrides
            //--------------------------------------------------------------------------
            //#region ** implementation
            // close the drop-down when the user clicks to select an item
            ComboBox.prototype._dropDownClick = function (e) {
                if (!e.defaultPrevented) {
                    if (e.target != this._dropDown) {
                        this.isDroppedDown = false;
                    }
                }
            };
            // update text in textbox
            ComboBox.prototype._setText = function (text, fullMatch) {
                // not while composing IME text...
                if (this._composing)
                    return;
                // prevent reentrant calls while moving CollectionView cursor
                if (this._settingText)
                    return;
                this._settingText = true;
                // make sure we have a string
                if (text == null)
                    text = '';
                text = text.toString();
                // get variables we need
                var index = this.selectedIndex, cv = this.collectionView, start = this._getSelStart(), len = -1;
                // require full match if deleting (to avoid auto-completion)
                if (this._deleting) {
                    fullMatch = true;
                }
                // try auto-completion
                if (this._deleting) {
                    index = this.indexOf(text, true);
                }
                else {
                    index = this.indexOf(text, fullMatch);
                    if (index < 0 && fullMatch) {
                        index = this.indexOf(text, false);
                    }
                    if (index < 0 && start > 0) {
                        index = this.indexOf(text.substr(0, start), false);
                    }
                }
                // not found and not editable? restore old text and move cursor to matching part
                if (index < 0 && !this.isEditable && wijmo.hasItems(cv)) {
                    if (this.isRequired || text) {
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
                _super.prototype._setText.call(this, text, fullMatch);
                // clear flags
                this._deleting = false;
                this._settingText = false;
            };
            // skip to the next/previous item that starts with a given string, wrapping
            ComboBox.prototype._findNext = function (text, step) {
                if (this.collectionView) {
                    text = text.toLowerCase();
                    var len = this.collectionView.items.length, index, t;
                    for (var i = 1; i <= len; i++) {
                        index = (this.selectedIndex + i * step + len) % len;
                        t = this.getDisplayText(index).toLowerCase();
                        if (t.indexOf(text) == 0) {
                            return index;
                        }
                    }
                }
                return this.selectedIndex;
            };
            // override to select items with the keyboard
            ComboBox.prototype._keydown = function (e) {
                // allow base class
                _super.prototype._keydown.call(this, e);
                // if the base class handled this, we're done
                if (e.defaultPrevented) {
                    return;
                }
                // if the input element is not visible, we're done (e.g. menu)
                if (this._elRef != this._tbx) {
                    return;
                }
                // remember we pressed a key when handling the TextChanged event
                if (e.keyCode == wijmo.Key.Back || e.keyCode == wijmo.Key.Delete) {
                    this._deleting = true;
                }
                // not if we have no items
                var cv = this.collectionView;
                if (!cv || !cv.items) {
                    return;
                }
                // handle key up/down keys to move to the next/previous items (TFS 153089, 200212)
                switch (e.keyCode) {
                    case wijmo.Key.Up:
                    case wijmo.Key.Down:
                        var start = this._getSelStart();
                        if (start == this.text.length) {
                            start = 0;
                        }
                        ;
                        this.selectedIndex = this._findNext(this.text.substr(0, start), e.keyCode == wijmo.Key.Up ? -1 : +1);
                        wijmo.setSelectionRange(this._tbx, start, this.text.length);
                        e.preventDefault();
                        break;
                }
            };
            // set selection range in input element (if it is visible)
            ComboBox.prototype._setSelRange = function (start, end) {
                if (this._elRef == this._tbx) {
                    wijmo.setSelectionRange(this._tbx, start, end);
                }
            };
            // get selection start in an extra-safe way (TFS 82372)
            ComboBox.prototype._getSelStart = function () {
                return this._tbx && this._tbx.value
                    ? this._tbx.selectionStart
                    : 0;
            };
            return ComboBox;
        }(input.DropDown));
        input.ComboBox = ComboBox;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ComboBox.js.map