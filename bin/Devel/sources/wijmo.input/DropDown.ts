module wijmo.input {
    'use strict';

    /**
     * DropDown control (abstract).
     *
     * Contains an input element and a button used to show or hide the drop-down.
     * 
     * Derived classes must override the _createDropDown method to create whatever
     * editor they want to show in the drop down area (a list of items, a calendar,
     * a color editor, etc).
     */
    export class DropDown extends Control {

        // child elements
        _tbx: HTMLInputElement;
        _elRef: HTMLElement;
        _btn: HTMLElement;
        _dropDown: HTMLElement;

        // property storage
        _showBtn = true;
        _autoExpand = true;
        _cssClass: string;

        // private stuff
        _oldText: string;
        _altDown: boolean;

        /**
         * Gets or sets the template used to instantiate @see:DropDown controls.
         */
        static controlTemplate = '<div style="position:relative" class="wj-template">' +
                '<div class="wj-input">' +
                    '<div class="wj-input-group wj-input-btn-visible">' +
                        '<input wj-part="input" type="text" class="wj-form-control" />' +
                        '<span wj-part="btn" class="wj-input-group-btn" tabindex="-1">' +
                            '<button class="wj-btn wj-btn-default" type="button" tabindex="-1">' +
                                '<span class="wj-glyph-down"></span>' +
                            '</button>' +
                        '</span>' +
                    '</div>' +
                '</div>' +
                '<div wj-part="dropdown" class="wj-content wj-dropdown-panel" ' +
                    'style="display:none;position:absolute;z-index:100">' +
                '</div>' +
            '</div>';

        /**
         * Initializes a new instance of the @see:DropDown class.
         *
         * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
         * @param options The JavaScript object containing initialization data for the control.
         */
        constructor(element: any, options?) {
            super(element, null, true);

            // instantiate and apply template
            var tpl = this.getTemplate();
            this.applyTemplate('wj-control wj-dropdown wj-content', tpl, {
                _tbx: 'input',
                _btn: 'btn',
                _dropDown: 'dropdown'
            }, 'input');

            // set reference element (used for positioning the drop-down)
            this._elRef = this._tbx;

            // disable autocomplete (important for mobile browsers including Chrome/Android)
            //this._tbx.autocomplete = 'off';

            // create drop-down element, update button display
            this._createDropDown();
            this._updateBtn();

            // remove drop-down from DOM (so IE/Edge can print properly)
            var dd = this._dropDown;
            if (dd && dd.parentElement) {
                dd.parentElement.removeChild(dd);
            }

            // update focus state when the drop-down gets or loses focus
            var fs = this._updateFocusState.bind(this); // TFS 153367
            this.addEventListener(this.dropDown, 'blur', fs, true);
            this.addEventListener(this.dropDown, 'focus', fs);
            
            // keyboard events (the same handlers are used for the control and for the drop-down)
            var kd = this._keydown.bind(this);
            this.addEventListener(this.hostElement, 'keydown', kd);
            this.addEventListener(this.dropDown, 'keydown', kd);

            // prevent smiley that appears when the user presses alt-down
            this.addEventListener(this._tbx, 'keypress', (e: KeyboardEvent) => {
                if (e.keyCode == 9787 && this._altDown) {
                    e.preventDefault();
                }
            });

            // textbox events
            this.addEventListener(this._tbx, 'input', () => {
                this._setText(this.text, false);
            });
            this.addEventListener(this._tbx, 'click', () => {
                if (this._autoExpand) {
                    this._expandSelection(); // expand the selection to the whole number/word that was clicked
                }
            });

            // IE 9 does not fire an input event when the user removes characters from input 
            // filled by keyboard, cut, or drag operations.
            // https://developer.mozilla.org/en-US/docs/Web/Events/input
            // so subscribe to keyup and set the text just in case (TFS 111189)
            if (isIE9()) {
                this.addEventListener(this._tbx, 'keyup', () => {
                    this._setText(this.text, false);
                });
            }

            // handle clicks on the drop-down button
            this.addEventListener(this._btn, 'click', this._btnclick.bind(this));

            // stop propagation of clicks on the drop-down element
            // (since they are not children of the hostElement, which can confuse
            // elements such as Bootstrap menus)
            this.addEventListener(this._dropDown, 'click', (e) => {
                e.stopPropagation();
            });
        }

        //--------------------------------------------------------------------------
        //#region ** object model

        /**
         * Gets or sets the text shown on the control.
         */
        get text(): string {
            return this._tbx.value;
        }
        set text(value: string) {
            if (value != this.text) {
                this._setText(value, true);
            }
        }
        /**
         * Gets the HTML input element hosted by the control.
         *
         * Use this property in situations where you want to customize the
         * attributes of the input element.
         */
        get inputElement(): HTMLInputElement {
            return this._tbx;
        }
        /**
         * Gets or sets a value that indicates whether the user can modify
	     * the control value using the mouse and keyboard.
         */
        get isReadOnly(): boolean {
            return this._tbx.readOnly;
        }
        set isReadOnly(value: boolean) {
            this._tbx.readOnly = asBoolean(value);
            toggleClass(this.hostElement, 'wj-state-readonly', this.isReadOnly);
        }
        /**
         * Gets or sets a value that determines whether the control value must be set to 
         * a non-null value or whether it can be set to null 
         * (by deleting the content of the control).
         */
        get isRequired(): boolean {
            return this._tbx.required;
        }
        set isRequired(value: boolean) {
            this._tbx.required = asBoolean(value);
        }
        // Deprecated: use 'isRequired' instead to avoid confusion with 'required' HTML attribute.
        get required(): boolean {
            _deprecated('required', 'isRequired');
            return this.isRequired;
        }
        set required(value: boolean) {
            _deprecated('required', 'isRequired');
            this.isRequired = value;
        }
        /**
         * Gets or sets the string shown as a hint when the control is empty.
         */
        get placeholder(): string {
            return this._tbx.placeholder;
        }
        set placeholder(value: string) {
            this._tbx.placeholder = value;
        }
        /**
         * Gets or sets a value that indicates whether the drop down is currently visible.
         */
        get isDroppedDown(): boolean {
            return this._dropDown.style.display != 'none';
        }
        set isDroppedDown(value: boolean) {
            value = asBoolean(value) && !this.isDisabled && !this.isReadOnly;
            if (value != this.isDroppedDown && this.onIsDroppedDownChanging(new CancelEventArgs())) {
                var dd = this._dropDown;
                if (value) { // show drop-down
                    if (!dd.style.minWidth) {
                        dd.style.minWidth = this.hostElement.getBoundingClientRect().width + 'px';
                    }
                    dd.style.display = 'block';
                    this._updateDropDown();
                } else { // hide drop-down
                    if (this.containsFocus()) {
                        if (!this.isTouching || !this.showDropDownButton) {
                            this.selectAll();
                        } else {
                            this.focus(); // keep the focus (needed on Android: TFS 143147)
                        }
                    }
                    hidePopup(dd);
                }
                this._updateFocusState();
                this.onIsDroppedDownChanged();
            }
        }
        /**
         * Gets the drop down element shown when the @see:isDroppedDown 
         * property is set to true.
         */
        get dropDown(): HTMLElement {
            return this._dropDown;
        }
        /**
         * Gets or sets a CSS class name to add to the control's drop-down element.
         *
         * This property is useful when styling the drop-down element, because it is
         * shown as a child of the document body rather than as a child of the control
         * itself, which prevents using CSS selectors based on the parent control.
         */
        get dropDownCssClass(): string {
            return this._cssClass;
        }
        set dropDownCssClass(value: string) {
            if (value != this._cssClass) {
                removeClass(this._dropDown, this._cssClass);
                this._cssClass = asString(value);
                addClass(this._dropDown, this._cssClass);
            }
        }
        /**
         * Gets or sets a value that indicates whether the control should display a drop-down button.
         */
        get showDropDownButton(): boolean {
            return this._showBtn;
        }
        set showDropDownButton(value: boolean) {
            this._showBtn = asBoolean(value);
            this._updateBtn();
        }
        /**
         * Gets or sets a value that indicates whether the control should automatically expand the 
         * selection to whole words/numbers when the control is clicked.
         */
        get autoExpandSelection(): boolean {
            return this._autoExpand;
        }
        set autoExpandSelection(value: boolean) {
            this._autoExpand = asBoolean(value);
        }
        /**
         * Sets the focus to the control and selects all its content.
         */
        selectAll() {
            if (this._elRef == this._tbx) {
                setSelectionRange(this._tbx, 0, this.text.length);
            }
        }
        /**
         * Occurs when the value of the @see:text property changes.
         */
        textChanged = new Event();
        /**
         * Raises the @see:textChanged event.
         */
        onTextChanged(e?: EventArgs) {
            this._updateState();
            this.textChanged.raise(this, e);
        }
        /**
         * Occurs before the drop down is shown or hidden.
         */
        isDroppedDownChanging = new Event();
        /**
         * Raises the @see:isDroppedDownChanging event.
         */
        onIsDroppedDownChanging(e: CancelEventArgs): boolean {
            this.isDroppedDownChanging.raise(this, e);
            return !e.cancel;
        }
        /**
         * Occurs after the drop down is shown or hidden.
         */
        isDroppedDownChanged = new Event();
        /**
         * Raises the @see:isDroppedDownChanged event.
         */
        onIsDroppedDownChanged(e?: EventArgs) {

            // while dropped down, listen to document mouse/key downs to close
            // (in case we didn't get the focus, as dialogs open from Bootstrap modals: TFS 152950)
            this.removeEventListener(document, 'mousedown');
            this.removeEventListener(document, 'keydown');
            if (this.isDroppedDown && !this.containsFocus()) {
                this.addEventListener(document, 'mousedown', (e) => {
                    if (!contains(this.dropDown, e.target) && !contains(this.hostElement, e.target)) {
                        this.isDroppedDown = false;
                    }
                });
                this.addEventListener(document, 'keydown', (e) => {
                    if (!this.containsFocus()) {
                        this.isDroppedDown = false;
                    }
                });
            }

            // raise the event as usual
            this.isDroppedDownChanged.raise(this, e);
        }

        //#endregion

        //--------------------------------------------------------------------------
        //#region ** overrides

        // transfer focus from control to textbox
        // (but don't show the soft keyboard when the user touches the drop-down button)
        onGotFocus(e?: EventArgs) {
            if (!this.isTouching) {
                this.selectAll();
            }
            super.onGotFocus(e);
        }

        // close the drop-down when losing focus
        onLostFocus(e?: EventArgs) {
            this._commitText();
            if (!this.containsFocus()) {
                this.isDroppedDown = false;
            }
            super.onLostFocus(e);
        }

        // check whether this control or its drop-down contain the focused element.
        containsFocus(): boolean {
            return super.containsFocus() || contains(this._dropDown, getActiveElement());
        }

        // close drop-down when disposing
        dispose() {
            this.isDroppedDown = false;
            super.dispose();
        }

        // reposition dropdown when refreshing
        refresh(fullUpdate = true) {
            super.refresh(fullUpdate);

            // update popup/focus
            if (this.isDroppedDown) {
                if (getComputedStyle(this.hostElement).display != 'none') {
                    var ae = getActiveElement();
                    showPopup(this._dropDown, this.hostElement, false, false, this.dropDownCssClass == null);
                    if (ae instanceof HTMLElement && ae != getActiveElement()) {
                        ae.focus();
                    }
                }
            }
        }

        // reposition dropdown when window size changes
        _handleResize() {
            if (this.isDroppedDown) {
                this.refresh();
            }
        }

        //#endregion

        //--------------------------------------------------------------------------
        //#region ** implementation

        // expand the current selection to the entire number/string that was clicked
        private _expandSelection() {
            var tbx = this._tbx,
                val = tbx.value,
                start = tbx.selectionStart,
                end = tbx.selectionEnd;
            if (val && start == end) {
                var ct = this._getCharType(val, start);
                if (ct > -1) {
                    for (; end < val.length; end++) {
                        if (this._getCharType(val, end) != ct) {
                            break;
                        }
                    }
                    for (; start > 0; start--) {
                        if (this._getCharType(val, start - 1) != ct) {
                            break;
                        }
                    }
                    if (start != end) {
                        tbx.setSelectionRange(start, end);
                    }
                }
            }
        }

        // get the type of character (digit, letter, other) at a given position
        private _getCharType(text: string, pos: number) {
            var chr = text[pos];
            if (chr >= '0' && chr <= '9') return 0;
            if ((chr >= 'a' && chr <= 'z') || (chr >= 'A' && chr <= 'Z')) return 1;
            return -1;
        }

        // handle keyboard events
        protected _keydown(e: KeyboardEvent) {

            // honor defaultPrevented
            if (e.defaultPrevented) return;

            // remember alt key for preventing smiley
            this._altDown = e.altKey;

            // handle key
            switch (e.keyCode) {

                // close dropdown on tab, escape, enter
                case Key.Tab:
                case Key.Escape:
                case Key.Enter:
                    if (this.isDroppedDown) {
                        this.isDroppedDown = false;
                        if (e.keyCode != Key.Tab && !this.containsFocus()) {
                            this.focus();
                        }
                        e.preventDefault();
                    }
                    break;

                // toggle drop-down on F4, alt up/down
                case Key.F4:
                case Key.Down:
                case Key.Up:
                    if (e.keyCode == Key.F4 || e.altKey) {
                        if (contains(document.body, this.hostElement)) { // TFS 142447
                            this.isDroppedDown = !this.isDroppedDown;
                            if (!this.isDroppedDown) {
                                this.focus();
                            }
                            e.preventDefault();
                        }
                    }
                    break;
            }
        }

        // handle clicks on the drop-down button
        protected _btnclick(e: MouseEvent) {
            this.isDroppedDown = !this.isDroppedDown;
        }

        // update text in textbox
        protected _setText(text: string, fullMatch: boolean) {

            // make sure we have a string
            if (text == null) text = '';
            text = text.toString();

            // update element
            if (text != this._tbx.value) {
                this._tbx.value = text;
            }

            // fire change event
            if (text != this._oldText) {
                this._oldText = text;
                this.onTextChanged();
            }
        }

        // update drop-down button visibility
        protected _updateBtn() {
            this._btn.tabIndex = -1;
            this._btn.style.display = this._showBtn ? '' : 'none';
        }

        // create the drop-down element
        protected _createDropDown() {
            // override in derived classes
        }

        // commit the text in the value element
        protected _commitText() {
            // override in derived classes
        }

        // update drop down content before showing it
        protected _updateDropDown() {
            if (this.isDroppedDown) {
                this._commitText();
                showPopup(this._dropDown, this.hostElement, false, false, this.dropDownCssClass == null);
           }
        }
    }
}