module wijmo.input {
    'use strict';

    /**
     * The @see:Menu control shows a text element with a drop-down list of commands that
     * the user can invoke by click or touch.
     *
     * The @see:Menu control inherits from @see:ComboBox, so you populate and style it 
     * in the same way that you do the @see:ComboBox (see the @see:Menu.itemsSource
     * property).
     *
     * The @see:Menu control adds an @see:Menu.itemClicked event that fires when the user
     * selects an item from the menu. The event handler can inspect the @see:Menu control
     * to determine which item was clicked. For example:
     * 
     * <pre>
     * var menu = new wijmo.input.Menu(hostElement);
     * menu.header = 'Main Menu';
     * menu.itemsSource = ['option 1', 'option 2', 'option 3'];
     * menu.itemClicked.addHandler(function(sender, args) {
     * var menu = sender;
     *   alert('Thanks for selecting item ' + menu.selectedIndex + ' from menu ' + menu.header + '!');
     * });
     * </pre>
     *
     * The example below illustrates how you can create value pickers, command-based menus, and
     * menus that respond to the @see:Menu.itemClicked event. The menus in this example are based
     * on HTML <b>&lt;select;&gt</b> and <b>&lt;option;&gt</b> elements.
     *
     * @fiddle:BX853
     */
    export class Menu extends ComboBox {
        _hdr: HTMLElement;
        _closing: boolean;
        _command: any;
        _cmdPath: string;
        _cmdParamPath: string;
        _isButton: boolean;
        _defaultItem: any;
        _owner: HTMLElement;

        /**
         * Initializes a new instance of the @see:Menu class.
         *
         * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
         * @param options The JavaScript object containing initialization data for the control.
         */
        constructor(element: any, options?) {
            super(element);
            addClass(this.hostElement, 'wj-menu');

            // replace textbox with header div
            this._tbx.style.display = 'none';
            var tpl = '<div wj-part="header" class="wj-form-control" style="cursor:default"/>';
            this._hdr = createElement(tpl);
            this._tbx.parentElement.insertBefore(this._hdr, this._tbx);
            this._elRef = this._hdr;

            // this is not required
            this.isRequired = false;

            // initializing from <select> tag
            if (this._orgTag == 'SELECT') {
                this.header = this.hostElement.getAttribute('header');
                if (this._lbx.itemsSource) {
                    this.commandParameterPath = 'cmdParam';
                }
            }

            // change some defaults
            this.isContentHtml = true;
            this.maxDropDownHeight = 500;

            // toggle drop-down when clicking on the header
            // or fire the click event if this menu is a split-button
            this.addEventListener(this._hdr, 'click', (e) => {
                if (!e.defaultPrevented) {
                    if (this._isButton) {
                        this.isDroppedDown = false;
                        this._raiseCommand();
                    } else {
                        this.isDroppedDown = !this.isDroppedDown;
                    }
                }
            });

            // initialize control options
            this.initialize(options);
        }
        /**
         * Gets or sets the HTML text shown in the @see:Menu element.
         */
        get header(): string {
            return this._hdr.innerHTML;
        }
        set header(value: string) {
            this._hdr.innerHTML = asString(value);
        }
        /**
         * Gets or sets the command to execute when an item is clicked.
         *
         * Commands are objects that implement two methods:
         * <ul>
         *  <li><b>executeCommand(parameter)</b> This method executes the command.</li>
         *  <li><b>canExecuteCommand(parameter)</b> This method returns a Boolean value
         *      that determines whether the controller can execute the command.
         *      If this method returns false, the menu option is disabled.</li>
         * </ul>
         *
         * You can also set commands on individual items using the @see:commandPath
         * property.
         */
        get command(): any {
            return this._command;
        }
        set command(value: any) {
            this._command = value;
        }
        /**
         * Gets or sets the name of the property that contains the command to 
         * execute when the user clicks an item.
         *
         * Commands are objects that implement two methods:
         * <ul>
         *  <li><b>executeCommand(parameter)</b> This method executes the command.</li>
         *  <li><b>canExecuteCommand(parameter)</b> This method returns a Boolean value
         *      that determines whether the controller can execute the command.
         *      If this method returns false, the menu option is disabled.</li>
         * </ul>
         */
        get commandPath(): string {
            return this._cmdPath;
        }
        set commandPath(value: string) {
            this._cmdPath = asString(value);
        }
        /**
         * Gets or sets the name of the property that contains a parameter to use with
         * the command specified by the @see:commandPath property.
         */
        get commandParameterPath(): string {
            return this._cmdParamPath;
        }
        set commandParameterPath(value: string) {
            this._cmdParamPath = asString(value);
        }
        /**
         * Gets or sets a value that determines whether this @see:Menu should act
         * as a split button instead of a regular menu.
         *
         * The difference between regular menus and split buttons is what happens 
         * when the user clicks the menu header.
         * In regular menus, clicking the header shows or hides the menu options.
         * In split buttons, clicking the header raises the @see:Menu.itemClicked
         * event and/or invokes the command associated with the last option selected by
         * the user as if the user had picked the item from the drop-down list.
         *
         * If you want to differentiate between clicks on menu items and the button
         * part of a split button, check the value of the @see:Menu.isDroppedDown property
         * of the event sender. If that is true, then a menu item was clicked; if it 
         * is false, then the button was clicked.
         *
         * For example, the code below implements a split button that uses the drop-down
         * list only to change the default item/command, and triggers actions only when
         * the button is clicked:
         *
         * <pre>&lt;-- view --&gt;
         * &lt;wj-menu is-button="true" header="Run" value="browser"
         *   item-clicked="itemClicked(s, e)"&gt;
         *   &lt;wj-menu-item value="'Internet Explorer'"&gt;Internet Explorer&lt;/wj-menu-item&gt;
         *   &lt;wj-menu-item value="'Chrome'"&gt;Chrome&lt;/wj-menu-item&gt;
         *   &lt;wj-menu-item value="'FireFox'"&gt;FireFox&lt;/wj-menu-item&gt;
         *   &lt;wj-menu-item value="'Safari'"&gt;Safari&lt;/wj-menu-item&gt;
         *   &lt;wj-menu-item value="'Opera'"&gt;Opera&lt;/wj-menu-item&gt;
         * &lt;/wj-menu&gt;
         *
         * // controller
         * $scope.browser = 'Internet Explorer';
         * $scope.itemClicked = function (s, e) {
         *   // if not dropped down, click was on the button
         *   if (!s.isDroppedDown) {
         *     alert('running ' + $scope.browser);
         *   }
         *}</pre>
         */
        get isButton(): boolean {
            return this._isButton;
        }
        set isButton(value: boolean) {
            this._isButton = asBoolean(value);
        }
        /**
         * Gets or sets the element that owns this @see:Menu.
         *
         * This variable is set by the wj-context-menu directive in case a single
         * menu is used as a context menu for several different elements.
         */
        get owner(): HTMLElement {
            return this._owner;
        }
        set owner(value: HTMLElement) {
            this._owner = asType(value, HTMLElement, true);
            this._enableDisableItems(); // TFS 122978
        }
        /**
         * Occurs when the user picks an item from the menu.
         * 
         * The handler can determine which item was picked by reading the event sender's
         * @see:selectedIndex property.
         */
        itemClicked = new Event();
        /**
         * Raises the @see:itemClicked event.
         */
        onItemClicked(e?: EventArgs) {
            this.itemClicked.raise(this, e);
        }

        // override onIsDroppedDownChanged to clear the selection when showing the menu
        onIsDroppedDownChanged(e?: EventArgs) {
            super.onIsDroppedDownChanged(e);
            if (this.isDroppedDown) {

                // suspend events
                this._closing = true;

                // save current item in case the user presses the split button
                // while the drop-down is open (TFS 119513)
                this._defaultItem = this.selectedItem;

                // reset menu
                this.isRequired = false;
                this.selectedIndex = -1;

                // enable/disable items
                this._enableDisableItems();

                // restore events
                this._closing = false;

                // move focus to the list so users
                // can select with the keyboard
                this.dropDown.focus();

            } else {

                // closed the drop-down, make sure we have a selected item (TFS 122720)
                if (!this.selectedItem) {
                    this.selectedItem = this._defaultItem;
                }
            }
        }

        // ** implementation

        // override to raise itemClicked on Enter (when open) or 
        // to open the drop-down (when closed) TFS 206344
        protected _keydown(e: KeyboardEvent) {
            if (!e.defaultPrevented) {
                if (e.keyCode == Key.Enter) {
                    if (this.isDroppedDown) {
                        if (this.getDisplayText(this.selectedIndex)) {
                            this._raiseCommand();
                        }
                    } else {
                        this.isDroppedDown = true;
                        e.preventDefault();
                    }
                }
            }
            super._keydown(e);
        }

        // raise command and close drop-down when an item is clicked
        protected _dropDownClick(e: MouseEvent) {
            if (!e.defaultPrevented) {
                if (this.getDisplayText(this.selectedIndex)) {
                    this._raiseCommand();
                }
            }
            super._dropDownClick(e); // allow base class
        }

        // raise itemClicked and/or invoke the current command
        private _raiseCommand(e?: EventArgs) {

            // execute command if available
            var item = this.selectedItem,
                cmd = this._getCommand(item);
            if (cmd) {
                var parm = this._cmdParamPath ? item[this._cmdParamPath] : null;
                if (!this._canExecuteCommand(cmd, parm)) {
                    return; // command not currently available
                }
                this._executeCommand(cmd, parm);
            }

            // raise itemClicked
            this.onItemClicked(e);
        }

        // gets the command to be executed when an item is clicked
        private _getCommand(item: any) {
            var cmd = item && this.commandPath ? item[this.commandPath] : null;
            return cmd ? cmd : this.command;
        }

        // execute a command
        // cmd may be an object that implements the ICommand interface or it may be just a function
        // parm is an optional parameter passed to the command.
        private _executeCommand(cmd, parm) {
            if (cmd && !isFunction(cmd)) {
                cmd = cmd['executeCommand'];
            }
            if (isFunction(cmd)) {
                cmd(parm);
            }
        }

        // checks whether a command can be executed
        private _canExecuteCommand(cmd, parm): boolean {
            if (cmd) {
                var x = cmd['canExecuteCommand'];
                if (isFunction(x)) {
                    return x(parm);
                }
            }
            return true;
        }

        // enable/disable the menu options
        private _enableDisableItems() {
            if (this.collectionView && (this.command || this.commandPath)) {
                var items = this.collectionView.items;
                for (var i = 0; i < items.length; i++) {
                    var cmd = this._getCommand(items[i]),
                        parm = this.commandParameterPath ? items[i][this.commandParameterPath] : null;
                    if (cmd) {
                        var el = <HTMLElement>this._lbx.hostElement.children[i];
                        toggleClass(el, 'wj-state-disabled', !this._canExecuteCommand(cmd, parm));
                    }
                }
            }
        }
    }
}