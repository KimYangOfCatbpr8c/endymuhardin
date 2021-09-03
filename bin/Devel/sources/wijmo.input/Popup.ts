module wijmo.input {
    'use strict';

    /**
     * Specifies actions that trigger showing and hiding @see:Popup controls.
     */
    export enum PopupTrigger {
        /** No triggers; popups must be shown and hidden using code. */
        None = 0,
        /** Show or hide the popup when the owner element is clicked. */
        Click = 1,
        /** Hide the popup when it loses focus. */
        Blur = 2,
        /** Show or hide the popup when the owner element is clicked, hide when it loses focus. */
        ClickOrBlur = Click | Blur
    }

    /**
     * Class that shows an element as a popup.
     *
     * Popups may be have @see:owner elements, in which case they behave
     * as rich tooltips that may be shown or hidden based on actions
     * specified by the @see:Popup.showTrigger and @see:Popup.hideTrigger
     * properties.
     *
     * Popups with no owner elements behave like dialogs. They are centered
     * on the screen and displayed using the @see:show method.
     *
     * To close a @see:Popup, call the @see:Popup.hide method.
     *
     * Alternatively, any clickable elements within a @see:Popup that have
     * the classes starting with the 'wj-hide' string will hide the @see:Popup
     * when clicked and will set the @see:Popup.dialogResult property to the
     * class name so the caller may take appropriate action.
     *
     * For example, the @see:Popup below will be hidden when the user presses
     * the OK or Cancel buttons, and the @see:Popup.dialogResult property will
     * be set to either 'wj-hide-cancel' or 'wj-hide-ok':
     *
     * <pre>&lt;button id="btnPopup"&gt;Show Popup&lt;/button&gt;
     * &lt;wj-popup owner="#btnPopup" style="padding:12px"&gt;
     *   &lt;p&gt;Press one of the buttons below to hide the Popup.&lt;/p&gt;
     *   &lt;hr/&gt;
     *   &lt;button class="wj-hide-ok" ng-click="handleOK()"&gt;OK&lt;/button&gt;
     *   &lt;button class="wj-hide-cancel"&gt;Cancel&lt;/button&gt;
     * &lt;/wj-popup&gt;</pre>
     */
    export class Popup extends Control {
        _owner: HTMLElement;
        _modal: boolean;
        _showTrigger = PopupTrigger.Click;
        _hideTrigger = PopupTrigger.Blur;
        _fadeIn = true;
        _fadeOut = true;
        _click = this._handleClick.bind(this);
        _mousedown = this._handleMouseDown.bind(this);
        _bkdrop: HTMLDivElement;
        _result: any;
        _resultEnter: any;
        _callback: Function;
        _refreshing: boolean; // to avoid re-entrant calls to refresh
        _visible = false; // to report correctly while fading out
        _wasVisible: boolean; // to avoid hiding and showing again on clicks

        /**
         * Initializes a new instance of the @see:Popup class.
         *
         * @param element The DOM element that will host the control, or a selector for the host element (e.g. '#theCtrl').
         * @param options JavaScript object containing initialization data for the control.
         */
        constructor(element: any, options?: any) {
            super(element, null, true);
            var host = this.hostElement;

            // add classes
            addClass(host, 'wj-control wj-content wj-popup');

            // ensure the host element can get the focus (TFS 199312)
            if (!host.getAttribute('tabindex')) {
                host.tabIndex = 0;
            }

            // start hidden
            hidePopup(host, false);

            // hide Popup when user presses Escape or Enter keys
            this.addEventListener(host, 'keydown', (e: KeyboardEvent) => {
                if (!e.defaultPrevented) {
                    
                    // Escape: hide the popup with no dialogResult
                    if (e.keyCode == Key.Escape) {
                        e.preventDefault();
                        this.hide();
                    }

                    // Enter: hide the popup and provide a dialogResult
                    if (e.keyCode == Key.Enter) {
                        var result = this.dialogResultEnter;
                        if (result) {
                            e.preventDefault();
                            this._validateAndHide(result);
                        }
                    }
                }
            });

            // keep focus within popup when modal
            this.addEventListener(host, 'keydown', (e: KeyboardEvent) => {
                if (!e.defaultPrevented && this.modal && e.keyCode == Key.Tab) { // TFS 148651
                    e.preventDefault();
                    moveFocus(this.hostElement, e.shiftKey ? -1 : +1);
                }
            });//, true);

            // hide Popup when user clicks an element with the 'wj-hide' class
            this.addEventListener(host, 'click', (e: MouseEvent) => {
                if (e.target instanceof HTMLElement) {
                    var target = <HTMLElement>e.target,
                        match = target.className.match(/\bwj-hide[\S]*\b/);
                    if (match && match.length > 0) {
                        e.preventDefault(); // cancel any navigation
                        e.stopPropagation();
                        this.hide(match[0]); // hide and pass the attribute as the dialogResult
                    }
                }
            });

            // limit wheel propagation while modals are open
            this.addEventListener(document, 'wheel', (e: MouseWheelEvent) => {
                if (this.isVisible && this._modal) {
                    for (var t = <HTMLElement>e.target; t && t != document.body; t = t.parentElement) {
                        if (t.scrollHeight > t.clientHeight) {
                            return;
                        }
                    }
                    e.preventDefault();
                    e.stopPropagation();
                }
            });

            // apply options after control is fully initialized
            this.initialize(options);
        }

        // ** object model

        /**
         * Gets or sets the element that owns this @see:Popup.
         *
         * If the @see:owner is null, the @see:Popup behaves like a dialog.
         * It is centered on the screen and must be shown using the 
         * @see:show method.
         */
        get owner(): HTMLElement {
            return this._owner;
        }
        set owner(value: HTMLElement) {

            // disconnect previous owner
            if (this._owner) {
                this.removeEventListener(this._owner, 'mousedown');
                this.removeEventListener(this._owner, 'click');
            }

            // set new owner
            this._owner = value != null ? getElement(value) : null;

            // connect new owner
            if (this._owner) {
                this.addEventListener(this._owner, 'mousedown', this._mousedown, true);
                this.addEventListener(this._owner, 'click', this._click, true);
            }
        }
        /**
         * Gets or sets the HTML element contained in this @see:Popup.
         */
        get content(): HTMLElement {
            return <HTMLElement>this.hostElement.firstElementChild;
        }
        set content(value: HTMLElement) {
            if (value != this.content) {
                this.hostElement.innerHTML = '';
                if (value instanceof HTMLElement) {
                    this.hostElement.appendChild(value);
                }
            }
        }
        /**
         * Gets or sets the actions that show the @see:Popup.
         *
         * By default, the @see:showTrigger property is set to @see:PopupTrigger.Click,
         * which causes the popup to appear when the user clicks the owner element.
         * 
         * If you set the @see:showTrigger property to @see:PopupTrigger.None, the popup
         * will be shown only when the @see:show method is called.
         */
        get showTrigger(): PopupTrigger {
            return this._showTrigger;
        }
        set showTrigger(value: PopupTrigger) {
            this._showTrigger = asEnum(value, PopupTrigger);
        }
        /**
         * Gets or sets the actions that hide the @see:Popup.
         *
         * By default, the @see:hideTrigger property is set to @see:PopupTrigger.Blur,
         * which hides the popup when it loses focus.
         *
         * If you set the @see:hideTrigger property to @see:PopupTrigger.Click, the popup
         * will be hidden only when the owner element is clicked.
         *
         * If you set the @see:hideTrigger property to @see:PopupTrigger.None, the popup
         * will be hidden only when the @see:hide method is called.
         */
        get hideTrigger(): PopupTrigger {
            return this._hideTrigger;
        }
        set hideTrigger(value: PopupTrigger) {
            this._hideTrigger = asEnum(value, PopupTrigger);
        }
        /**
         * Gets or sets a value that determines whether the @see:Popup should
         * use a fade-out animation when it is shown.
         */
        get fadeIn(): boolean {
            return this._fadeIn;
        }
        set fadeIn(value: boolean) {
            this._fadeIn = asBoolean(value);
        }
        /**
         * Gets or sets a value that determines whether the @see:Popup should
         * use a fade-out animation when it is hidden.
         */
        get fadeOut(): boolean {
            return this._fadeOut;
        }
        set fadeOut(value: boolean) {
            this._fadeOut = asBoolean(value);
        }
        /**
         * Gets or sets a value that determines whether the @see:Popup should
         * be displayed as a modal dialog.
         *
         * Modal dialogs show a dark backdrop that makes the @see:Popup stand
         * out from other content on the page.
         *
         * If you want to make a dialog truly modal, also set the @see:Popup.hideTrigger
         * property to @see:PopupTrigger.None, so users won't be able to click the
         * backdrop to dismiss the dialog. In this case, the dialog will close only
         * if the @see:Popup.hide method is called or if the user presses the Escape
         * key.
         */
        get modal(): boolean {
            return this._modal;
        }
        set modal(value: boolean) {
            this._modal = asBoolean(value);
        }
        /**
         * Gets or sets a value that can be used for handling the content of the @see:Popup
         * after it is hidden.
         *
         * This property is set to null when the @see:Popup is displayed, and it can be
         * set in response to button click events or in the call to the @see:hide method.
         */
        get dialogResult(): any {
            return this._result;
        }
        set dialogResult(value: any) {
            this._result = value;
        }
        /**
         * Gets or sets a value to be used as a @see:dialogResult when the user presses
         * the Enter key while the @see:Popup is visible.
         *
         * If the user presses Enter and the @see:dialogResultEnter property is not null,
         * the popup checks whether all its child elements are in a valid state.
         * If so, the popup is closed and the @see:dialogResult property is set to
         * the value of the @see:dialogResultEnter property.
         */
        get dialogResultEnter(): any {
            return this._resultEnter;
        }
        set dialogResultEnter(value: any) {
            this._resultEnter = value;
        }
        /**
         * Gets a value that determines whether the @see:Popup is currently visible.
         */
        get isVisible(): boolean {
            var host = this.hostElement;
            return this._visible && host && host.style.display != 'none';
        }
        /**
         * Shows the @see:Popup.
         *
         * @param modal Whether to show the popup as a modal dialog. If provided, this 
         * sets the value of the @see:modal property.
         * @param handleResult Callback invoked when the popup is hidden. If provided,
         * this should be a function that receives the popup as a parameter.
         *
         * The <b>handleResult</b> callback allows callers to handle the result of modal
         * dialogs without attaching handlers to the @see:hidden event. For example,
         * the code below shows a dialog used to edit the current item in a
         * @see:CollectionView. The edits are committed or canceled depending on the
         * @see:Popup.dialogResult value. For example:
         *
         * <pre>$scope.editCurrentItem = function () {
         *   $scope.data.editItem($scope.data.currentItem);
         *   $scope.itemEditor.show(true, function (e) {
         *     if (e.dialogResult == 'wj-hide-ok') {
         *       $scope.data.commitEdit();
         *     } else {
         *       $scope.data.cancelEdit();
         *     }
         *   });
         * }</pre>
         */
        show(modal?: boolean, handleResult?: Function) {
            if (!this.isVisible) {

                // reset dialog result/callback
                this.dialogResult = null;
                this._callback = null;

                // raise the event
                var e = new CancelEventArgs();
                if (this.onShowing(e)) {

                    // honor parameters
                    if (modal != null) {
                        this.modal = asBoolean(modal);
                    }
                    if (handleResult != null) {
                        this._callback = asFunction(handleResult);
                    }

                    // show the popup using a rectangle as reference (to avoid copying styles)
                    var ref = this._owner ? this._owner.getBoundingClientRect() : null;
                    showPopup(this.hostElement, ref, false, this._fadeIn);

                    // show modal backdrop behind the popup
                    if (this._modal) {
                        this._showBackdrop();
                    }

                    // raise shown event
                    this._visible = true;
                    this.onShown(e);

                    // move focus to the popup
                    setTimeout(() => {

                        // if this is not a touch event, set the focus to the 'autofocus' element 
                        // or to the first focusable element on the popup
                        if (!this.isTouching) {
                            var el = <HTMLInputElement>this.hostElement.querySelector('input[autofocus]');
                            if (el && el.clientHeight > 0 && // ignore disabled, unfocusable, hidden
                                !el.disabled && el.tabIndex > -1 && 
                                !closest(el, '[disabled],.wj-state-disabled')) {
                                el.focus();
                                el.select(); // TFS 190336
                            } else {
                                moveFocus(this.hostElement, 0);
                            }
                        }

                        // make sure the popup has the focus (no input elements/touch: TFS 143114)
                        if (!this.containsFocus()) {
                            this.hostElement.tabIndex = 0;
                            this.hostElement.focus();
                        }

                    }, 200);
                }
            }
        }
        /**
         * Hides the @see:Popup.
         * @param dialogResult Optional value assigned to the @see:dialogResult property
         * before closing the @see:Popup.
         */
        hide(dialogResult?: any) {
            if (this.isVisible) {
                if (!isUndefined(dialogResult)) {
                    this.dialogResult = dialogResult;
                }
                var e = new CancelEventArgs();
                if (this.onHiding(e)) {
                    if (this._modal) {
                        hidePopup(this._bkdrop, true, this.fadeOut);
                    }
                    hidePopup(this.hostElement, true, this.fadeOut);
                    this._visible = false;
                    this.onHidden(e);
                    if (this._callback) {
                        this._callback(this);
                    }
                }
            }
        }
        /**
         * Occurs before the @see:Popup is shown.
         */
        showing = new Event();
        /**
         * Raises the @see:showing event.
         */
        onShowing(e: CancelEventArgs): boolean {
            this.showing.raise(this, e);
            return !e.cancel;
        }
        /**
         * Occurs after the @see:Popup has been shown.
         */
        shown = new Event();
        /**
         * Raises the @see:shown event.
         */
        onShown(e?: EventArgs) {
            this.shown.raise(this, e);
        }
        /**
         * Occurs before the @see:Popup is hidden.
         */
        hiding = new Event();
        /**
         * Raises the @see:hiding event.
         */
        onHiding(e: CancelEventArgs): boolean {
            this.hiding.raise(this, e);
            return !e.cancel;
        }
        /**
         * Occurs after the @see:Popup has been hidden.
         */
        hidden = new Event();
        /**
         * Raises the @see:hidden event.
         */
        onHidden(e?: EventArgs) {
            this.hidden.raise(this, e);
        }

        // ** overrides

        // release owner when disposing
        dispose() {
            this._owner = null;
            super.dispose();
        }

        // hide popup when popup loses focus
        onLostFocus(e?: EventArgs) {
            if (this.isVisible && (this._hideTrigger & PopupTrigger.Blur)) {
                if (!this.containsFocus()) {
                    this.hide();
                }
            }
            super.onLostFocus(e);
        }

        // reposition Popup when refreshing
        refresh(fullUpdate = true) {
            super.refresh(fullUpdate);
            if (this.isVisible && !this._refreshing) {
                this._refreshing = true;
                var ae = getActiveElement(),
                    ref = this._owner ? this._owner.getBoundingClientRect() : null;
                showPopup(this.hostElement, ref);
                if (this._modal && ae instanceof HTMLElement && ae != getActiveElement()) {
                    ae.focus();
                }
                this._refreshing = false;
            }
        }

        // ** implementation

        // reposition Popup when window size changes
        protected _handleResize() {
            if (this.isVisible) {
                this.refresh();
            }
        }

        // toggle Popup when user clicks the owner element
        protected _handleClick(e) {
            if (this.isVisible) {
                if (this._hideTrigger & PopupTrigger.Click) {
                    this.hide();
                }
            } else {
                if (this._showTrigger & PopupTrigger.Click) {
                    if (!this._wasVisible) {
                        // don't show while fading out (in this case, visible == false 
                        // but host element is still visible on the page)
                        var host = this.hostElement;
                        if (host && host.style.display == 'none') {
                            this.show();
                        }
                    }
                }
            }
        }

        // remember visible state on mouse down to avoid hiding and showing again on click
        // (mousedown loses focus, hides, mouseup triggers click, shows again)
        protected _handleMouseDown(e) {
            this._wasVisible = this.isVisible;
        }

        // show/hide modal popup backdrop
        private _showBackdrop() {
            if (!this._bkdrop) {

                // create backdrop element
                this._bkdrop = document.createElement('div');
                this._bkdrop.tabIndex = -1;
                addClass(this._bkdrop, 'wj-popup-backdrop');

                // background is not clickable
                this.addEventListener(this._bkdrop, 'mousedown', (e: MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.hostElement.focus(); // close any open menus/popups TFS 152950
                });
            }
            this._bkdrop.style.display = '';

            // insert background behind the popup (TFS 205400)
            var host = this.hostElement;
            host.parentElement.insertBefore(this._bkdrop, host);
        }

        // validate the dialog and hide it if there are no errors
        private _validateAndHide(result: any) {
            var invalid = <HTMLElement>this.hostElement.querySelector(':invalid');
            if (invalid) {
                invalid.focus(); // focus to invalid field
            } else {
                this.hide(result); // no errors
            }
        }
    }
}
