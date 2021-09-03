var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var knockout;
    (function (knockout) {
        // DropDown custom binding.
        // Abstract class, not for use in markup
        var WjDropDownBinding = (function (_super) {
            __extends(WjDropDownBinding, _super);
            function WjDropDownBinding() {
                _super.apply(this, arguments);
            }
            WjDropDownBinding.prototype._getControlConstructor = function () {
                return wijmo.input.DropDown;
            };
            return WjDropDownBinding;
        }(knockout.WjBinding));
        knockout.WjDropDownBinding = WjDropDownBinding;
        /**
         * KnockoutJS binding for the @see:ComboBox control.
         *
         * Use the @see:wjComboBox binding to add @see:ComboBox controls to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a ComboBox control:&lt;/p&gt;
         * &lt;div data-bind="wjComboBox: {
         *   itemsSource: countries,
         *   text: theCountry,
         *   isEditable: false,
         *   placeholder: 'country' }"&gt;
         * &lt;/div&gt;</pre>
         *
         * The <b>wjComboBox</b> binding supports all read-write properties and events of
         * the @see:ComboBox control. The following properties provide two-way binding mode:
         * <ul>
         * 	<li><b>isDroppedDown</b></li>
         * 	<li><b>text</b></li>
         * 	<li><b>selectedIndex</b></li>
         * 	<li><b>selectedItem</b></li>
         * 	<li><b>selectedValue</b></li>
         * </ul>
         */
        var wjComboBox = (function (_super) {
            __extends(wjComboBox, _super);
            function wjComboBox() {
                _super.apply(this, arguments);
            }
            wjComboBox.prototype._getControlConstructor = function () {
                return wijmo.input.ComboBox;
            };
            return wjComboBox;
        }(WjDropDownBinding));
        knockout.wjComboBox = wjComboBox;
        /**
         * KnockoutJS binding for the @see:AutoComplete control.
         *
         * Use the @see:wjAutoComplete binding to add @see:AutoComplete controls to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is an AutoComplete control:&lt;/p&gt;
         * &lt;div data-bind="wjAutoComplete: {
         *   itemsSource: countries,
         *   text: theCountry,
         *   isEditable: false,
         *   placeholder: 'country' }"&gt;
         * &lt;/div&gt;</pre>
         *
         * The <b>wjAutoComplete</b> binding supports all read-write properties and events of
         * the @see:AutoComplete control. The following properties provide two-way binding mode:
         * <ul>
         * 	<li><b>isDroppedDown</b></li>
         * 	<li><b>text</b></li>
         * 	<li><b>selectedIndex</b></li>
         * 	<li><b>selectedItem</b></li>
         * 	<li><b>selectedValue</b></li>
         * </ul>
         */
        var wjAutoComplete = (function (_super) {
            __extends(wjAutoComplete, _super);
            function wjAutoComplete() {
                _super.apply(this, arguments);
            }
            wjAutoComplete.prototype._getControlConstructor = function () {
                return wijmo.input.AutoComplete;
            };
            return wjAutoComplete;
        }(wjComboBox));
        knockout.wjAutoComplete = wjAutoComplete;
        /**
         * KnockoutJS binding for the @see:Calendar control.
         *
         * Use the @see:wjCalendar binding to add @see:Calendar controls to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a Calendar control:&lt;/p&gt;
         * &lt;div
         *   data-bind="wjCalendar: { value: theDate }"&gt;
         * &lt;/div&gt;</pre>
         *
         * The <b>wjCalendar</b> binding supports all read-write properties and events of
         * the @see:Calendar control. The following properties provide two-way binding mode:
         * <ul>
         * 	<li><b>value</b></li>
         * 	<li><b>displayMonth</b></li>
         * </ul>
         */
        var wjCalendar = (function (_super) {
            __extends(wjCalendar, _super);
            function wjCalendar() {
                _super.apply(this, arguments);
            }
            wjCalendar.prototype._getControlConstructor = function () {
                return wijmo.input.Calendar;
            };
            return wjCalendar;
        }(knockout.WjBinding));
        knockout.wjCalendar = wjCalendar;
        /**
         * KnockoutJS binding for the @see:ColorPicker control.
         *
         * Use the @see:wjColorPicker binding to add @see:ColorPicker controls to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a ColorPicker control:&lt;/p&gt;
         * &lt;div
         *   data-bind="wjColorPicker: { value: theColor }"&gt;
         * &lt;/div&gt;</pre>
         *
         * The <b>wjColorPicker</b> binding supports all read-write properties and events of
         * the @see:ColorPicker control. The following properties provide two-way binding mode:
         * <ul>
         * 	<li><b>value</b></li>
         * </ul>
         */
        var wjColorPicker = (function (_super) {
            __extends(wjColorPicker, _super);
            function wjColorPicker() {
                _super.apply(this, arguments);
            }
            wjColorPicker.prototype._getControlConstructor = function () {
                return wijmo.input.ColorPicker;
            };
            return wjColorPicker;
        }(knockout.WjBinding));
        knockout.wjColorPicker = wjColorPicker;
        /**
         * KnockoutJS binding for the @see:ListBox control.
         *
         * Use the @see:wjListBox binding to add @see:ListBox controls to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a ListBox control:&lt;/p&gt;
         * &lt;div data-bind="wjListBox: {
         *   itemsSource: countries,
         *   selectedItem: theCountry }"&gt;
         * &lt;/div&gt;</pre>
         *
         * The <b>wjListBox</b> binding supports all read-write properties and events of
         * the @see:ListBox control. The following properties provide two-way binding mode:
         * <ul>
         * 	<li><b>selectedIndex</b></li>
         * 	<li><b>selectedItem</b></li>
         * 	<li><b>selectedValue</b></li>
         * </ul>
         */
        var wjListBox = (function (_super) {
            __extends(wjListBox, _super);
            function wjListBox() {
                _super.apply(this, arguments);
            }
            wjListBox.prototype._getControlConstructor = function () {
                return wijmo.input.ListBox;
            };
            return wjListBox;
        }(knockout.WjBinding));
        knockout.wjListBox = wjListBox;
        /**
         * KnockoutJS binding for the @see:Menu control.
         *
         * Use the @see:wjMenu binding to add @see:Menu controls to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a Menu control used as a value picker:&lt;/p&gt;
         * &lt;div data-bind="wjMenu: { value: tax, header: 'Tax' }"&gt;
         *     &lt;span data-bind="wjMenuItem: { value: 0 }"&gt;Exempt&lt;/span&gt;
         *     &lt;span data-bind="wjMenuSeparator: {}"&gt;&lt;/span&gt;
         *     &lt;span data-bind="wjMenuItem: { value: .05 }"&gt;5%&lt;/span&gt;
         *     &lt;span data-bind="wjMenuItem: { value: .1 }"&gt;10%&lt;/span&gt;
         *     &lt;span data-bind="wjMenuItem: { value: .15 }"&gt;15%&lt;/span&gt;
         * &lt;/div&gt;</pre>
         *
         * The <b>wjMenu</b> binding may contain the following child bindings: @see:wjMenuItem, @see:wjMenuSeparator.
         *
         * The <b>wjMenu</b> binding supports all read-write properties and events of
         * the @see:Menu control. The following properties provide two-way binding mode:
         * <ul>
         * 	<li><b>isDroppedDown</b></li>
         * 	<li><b>text</b></li>
         * 	<li><b>selectedIndex</b></li>
         * 	<li><b>selectedItem</b></li>
         * 	<li><b>selectedValue</b></li>
         *  <li><b>value</b></li>
         * </ul>
         */
        var wjMenu = (function (_super) {
            __extends(wjMenu, _super);
            function wjMenu() {
                _super.apply(this, arguments);
            }
            wjMenu.prototype._getControlConstructor = function () {
                return wijmo.input.Menu;
            };
            wjMenu.prototype._createWijmoContext = function () {
                return new WjMenuContext(this);
            };
            wjMenu.prototype._initialize = function () {
                _super.prototype._initialize.call(this);
                var valueDesc = knockout.MetaFactory.findProp('value', this._metaData.props);
                valueDesc.updateControl = this._updateControlValue;
            };
            wjMenu.prototype._updateControlValue = function (link, propDesc, control, unconvertedValue, convertedValue) {
                if (convertedValue != null) {
                    control.selectedValue = convertedValue;
                    link._updateHeader();
                }
                return true;
            };
            return wjMenu;
        }(wjComboBox));
        knockout.wjMenu = wjMenu;
        var WjMenuContext = (function (_super) {
            __extends(WjMenuContext, _super);
            function WjMenuContext() {
                _super.apply(this, arguments);
            }
            WjMenuContext.prototype._initControl = function () {
                var _this = this;
                _super.prototype._initControl.call(this);
                var menuCtrl = this.control;
                menuCtrl.displayMemberPath = 'header';
                menuCtrl.commandPath = 'cmd';
                menuCtrl.commandParameterPath = 'cmdParam';
                menuCtrl.selectedValuePath = 'value';
                menuCtrl.itemsSource = new wijmo.collections.ObservableArray();
                // update 'value' and header when an item is clicked
                menuCtrl.itemClicked.addHandler(function () {
                    _this._safeUpdateSrcAttr('value', menuCtrl.selectedValue);
                    _this._updateHeader();
                });
            };
            WjMenuContext.prototype._childrenInitialized = function () {
                _super.prototype._childrenInitialized.call(this);
                this.control.selectedIndex = 0;
                this._updateHeader();
            };
            // update header to show the currently selected value
            WjMenuContext.prototype._updateHeader = function () {
                var control = this.control, valSet = this.valueAccessor(), newHeader = ko.unwrap(valSet['header']);
                //control.header = scope.header;
                if (ko.unwrap(valSet['value']) !== undefined && control.selectedItem && control.displayMemberPath) {
                    var currentValue = control.selectedItem[control.displayMemberPath];
                    if (currentValue != null) {
                        newHeader += ': <b>' + currentValue + '</b>';
                    }
                }
                control.header = newHeader;
            };
            return WjMenuContext;
        }(knockout.WjContext));
        knockout.WjMenuContext = WjMenuContext;
        /**
         * KnockoutJS binding for menu items.
         *
         * Use the @see:wjMenuItem binding to add menu items to a @see:Menu control.
         * The @see:wjMenuItem binding must be contained in a @see:wjMenu binding.
         * For example:
         *
         * <pre>&lt;p&gt;Here is a Menu control with four menu items:&lt;/p&gt;
         * &lt;div data-bind="wjMenu: { value: tax, header: 'Tax' }"&gt;
         *     &lt;span data-bind="wjMenuItem: { value: 0 }"&gt;Exempt&lt;/span&gt;
         *     &lt;span data-bind="wjMenuItem: { value: .05 }"&gt;5%&lt;/span&gt;
         *     &lt;span data-bind="wjMenuItem: { value: .1 }"&gt;10%&lt;/span&gt;
         *     &lt;span data-bind="wjMenuItem: { value: .15 }"&gt;15%&lt;/span&gt;
         * &lt;/div&gt;</pre>
         *
         * The <b>wjMenuItem</b> binding supports the following attributes:
         *
         * <dl class="dl-horizontal">
         *   <dt>cmd</dt>       <dd>Function to execute in the controller when the item is clicked.</dd>
         *   <dt>cmdParam</dt>  <dd>Parameter passed to the <b>cmd</b> function when the item is clicked.</dd>
         *   <dt>value</dt>     <dd>Value selected when the item is clicked (use either this or <b>cmd</b>).</dd>
         * </dl class="dl-horizontal">
         */
        var wjMenuItem = (function (_super) {
            __extends(wjMenuItem, _super);
            function wjMenuItem() {
                _super.apply(this, arguments);
            }
            wjMenuItem.prototype._getMetaDataId = function () {
                return 'MenuItem';
            };
            wjMenuItem.prototype._createWijmoContext = function () {
                return new WjMenuItemContext(this);
            };
            wjMenuItem.prototype._initialize = function () {
                _super.prototype._initialize.call(this);
                var meta = this._metaData;
                meta.parentProperty = 'itemsSource';
                meta.isParentPropertyArray = true;
            };
            return wjMenuItem;
        }(knockout.WjBinding));
        knockout.wjMenuItem = wjMenuItem;
        var WjMenuItemContext = (function (_super) {
            __extends(WjMenuItemContext, _super);
            function WjMenuItemContext() {
                _super.apply(this, arguments);
            }
            WjMenuItemContext.prototype._createControl = function () {
                return { header: this.element.innerHTML, cmd: null, cmdParam: null, value: null };
            };
            return WjMenuItemContext;
        }(knockout.WjContext));
        knockout.WjMenuItemContext = WjMenuItemContext;
        /**
         * KnockoutJS binding for menu separators.
         *
         * The the @see:wjMenuSeparator adds a non-selectable separator to a @see:Menu control, and has no attributes.
         * It must be contained in a @see:wjMenu binding. For example:
         *
         * <pre>&lt;p&gt;Here is a Menu control with four menu items and one separator:&lt;/p&gt;
         * &lt;div data-bind="wjMenu: { value: tax, header: 'Tax' }"&gt;
         *     &lt;span data-bind="wjMenuItem: { value: 0 }"&gt;Exempt&lt;/span&gt;
         *     &lt;span data-bind="wjMenuSeparator: {}"&gt;&lt;/span&gt;
         *     &lt;span data-bind="wjMenuItem: { value: .05 }"&gt;5%&lt;/span&gt;
         *     &lt;span data-bind="wjMenuItem: { value: .1 }"&gt;10%&lt;/span&gt;
         *     &lt;span data-bind="wjMenuItem: { value: .15 }"&gt;15%&lt;/span&gt;
         * &lt;/div&gt;</pre>
         */
        var wjMenuSeparator = (function (_super) {
            __extends(wjMenuSeparator, _super);
            function wjMenuSeparator() {
                _super.apply(this, arguments);
            }
            wjMenuSeparator.prototype._getMetaDataId = function () {
                return 'MenuSeparator';
            };
            wjMenuSeparator.prototype._initialize = function () {
                _super.prototype._initialize.call(this);
                var meta = this._metaData;
                meta.parentProperty = 'itemsSource';
                meta.isParentPropertyArray = true;
            };
            wjMenuSeparator.prototype._createControl = function (element) {
                return { header: '<div class="wj-state-disabled" style="width:100%;height:1px;background-color:lightgray"/>' };
            };
            return wjMenuSeparator;
        }(knockout.WjBinding));
        knockout.wjMenuSeparator = wjMenuSeparator;
        /**
          * KnockoutJS binding for context menus.
          *
          * Use the @see:wjContextMenu binding to add context menus to elements
          * on the page. The @see:wjContextMenu binding is based on the  @see:wjMenu;
          * it displays a popup menu when the user performs a context menu
          * request on an element (usually a right-click).
          *
          * The wjContextMenu binding is specified as a parameter added to the
          * element that the context menu applies to. The parameter value is a
          * selector for the element that contains the menu. For example:
          *
          * <pre>&lt;!-- paragraph with a context menu --&gt;
          *&lt;p data-bind="wjContextMenu: { id: '#idMenu'}" &gt;
          *  This paragraph has a context menu.&lt;/p&gt;
          *
          *&lt;!-- define the context menu (hidden and with an id) --&gt;
          * &lt;div id="contextmenu" data-bind="wjMenu: { header: 'File', itemClicked: menuItemClicked}"&gt;
          *     &lt;span data-bind="wjMenuItem: {}"&gt;New&lt;/span&gt;
          *     &lt;span data-bind="wjMenuItem: {}"&gt;open an existing file or folder&lt;/span&gt;
          *     &lt;span data-bind="wjMenuItem: {}"&gt;save the current file&lt;/span&gt;
          *     &lt;span data-bind="wjMenuSeparator: {}"&gt;&lt;/span&gt;
          *     &lt;span data-bind="wjMenuItem: {}"&gt;exit the application&lt;/span&gt;
          * &lt;/div&gt;</pre>
          */
        var wjContextMenu = (function (_super) {
            __extends(wjContextMenu, _super);
            function wjContextMenu() {
                _super.apply(this, arguments);
            }
            wjContextMenu.prototype._getMetaDataId = function () {
                return 'ContextMenu';
            };
            wjContextMenu.prototype._createControl = function (element) {
                return null;
            };
            wjContextMenu.prototype._createWijmoContext = function () {
                return new WjContextMenuContext(this);
            };
            return wjContextMenu;
        }(knockout.WjBinding));
        knockout.wjContextMenu = wjContextMenu;
        var WjContextMenuContext = (function (_super) {
            __extends(WjContextMenuContext, _super);
            function WjContextMenuContext() {
                _super.apply(this, arguments);
            }
            WjContextMenuContext.prototype._initControl = function () {
                _super.prototype._initControl.call(this);
                var valSet = this.valueAccessor();
                // get context menu and drop-down list
                var host = wijmo.getElement(valSet['id']);
                // show the drop-down list in response to the contextmenu command
                this.element.addEventListener('contextmenu', function (e) {
                    var menu = wijmo.Control.getControl(host), dropDown = menu.dropDown;
                    if (menu && dropDown && !wijmo.closest(e.target, '[disabled]')) {
                        e.preventDefault();
                        menu.owner = this.element;
                        menu.selectedIndex = -1;
                        if (menu.onIsDroppedDownChanging(new wijmo.CancelEventArgs())) {
                            wijmo.showPopup(dropDown, e);
                            menu.onIsDroppedDownChanged();
                            dropDown.focus();
                        }
                    }
                });
            };
            return WjContextMenuContext;
        }(knockout.WjContext));
        knockout.WjContextMenuContext = WjContextMenuContext;
        /**
         * KnockoutJS binding for the @see:InputDate control.
         *
         * Use the @see:wjInputDate binding to add @see:InputDate controls to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is an InputDate control:&lt;/p&gt;
         * &lt;div data-bind="wjInputDate: {
         *   value: theDate,
         *   format: 'M/d/yyyy' }"&gt;
         * &lt;/div&gt;</pre>
         *
         * The <b>wjInputDate</b> binding supports all read-write properties and events of
         * the @see:InputDate control. The following properties provide two-way binding mode:
         * <ul>
         * 	<li><b>isDroppedDown</b></li>
         * 	<li><b>text</b></li>
         * 	<li><b>value</b></li>
         * </ul>
         */
        var wjInputDate = (function (_super) {
            __extends(wjInputDate, _super);
            function wjInputDate() {
                _super.apply(this, arguments);
            }
            wjInputDate.prototype._getControlConstructor = function () {
                return wijmo.input.InputDate;
            };
            return wjInputDate;
        }(WjDropDownBinding));
        knockout.wjInputDate = wjInputDate;
        /**
         * KnockoutJS binding for the @see:InputDateTime control.
         *
         * Use the @see:wjInputDateTime binding to add @see:InputDateTime controls to your
         * KnockoutJS applications.
         *
         * The <b>wjInputDateTime</b> binding supports all read-write properties and events of
         * the @see:InputDateTime control.
         */
        var wjInputDateTime = (function (_super) {
            __extends(wjInputDateTime, _super);
            function wjInputDateTime() {
                _super.apply(this, arguments);
            }
            wjInputDateTime.prototype._getControlConstructor = function () {
                return wijmo.input.InputDateTime;
            };
            return wjInputDateTime;
        }(knockout.WjBinding));
        knockout.wjInputDateTime = wjInputDateTime;
        /**
         * KnockoutJS binding for the @see:InputNumber control.
         *
         * Use the @see:wjInputNumber binding to add @see:InputNumber controls to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is an InputNumber control:&lt;/p&gt;
         * &lt;div data-bind="wjInputNumber: {
         *   value: theNumber,
         *   min: 0,
         *   max: 10,
         *   format: 'n0',
         *   placeholder: 'number between zero and ten' }"&gt;
         * &lt;/div&gt;</pre>
         *
         * The <b>wjInputNumber</b> binding supports all read-write properties and events of
         * the @see:InputNumber control. The following properties provide two-way binding mode:
         * <ul>
         * 	<li><b>value</b></li>
         * 	<li><b>text</b></li>
         * </ul>
         */
        var wjInputNumber = (function (_super) {
            __extends(wjInputNumber, _super);
            function wjInputNumber() {
                _super.apply(this, arguments);
            }
            wjInputNumber.prototype._getControlConstructor = function () {
                return wijmo.input.InputNumber;
            };
            return wjInputNumber;
        }(knockout.WjBinding));
        knockout.wjInputNumber = wjInputNumber;
        /**
         * KnockoutJS binding for the @see:InputMask control.
         *
         * Use the @see:wjInputMask binding to add @see:InputMask controls to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is an InputMask control:&lt;/p&gt;
         * &lt;div data-bind="wjInputMask: {
         *   mask: '99/99/99',
         *   promptChar: '*' }"&gt;
         * &lt;/div&gt;</pre>
         *
         * The <b>wjInputMask</b> binding supports all read-write properties and events of
         * the @see:InputMask control. The <b>value</b> property provides two-way binding mode.
         */
        var wjInputMask = (function (_super) {
            __extends(wjInputMask, _super);
            function wjInputMask() {
                _super.apply(this, arguments);
            }
            wjInputMask.prototype._getControlConstructor = function () {
                return wijmo.input.InputMask;
            };
            return wjInputMask;
        }(knockout.WjBinding));
        knockout.wjInputMask = wjInputMask;
        /**
         * KnockoutJS binding for the @see:InputTime control.
         *
         * Use the @see:wjInputTime binding to add @see:InputTime controls to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is an InputTime control:&lt;/p&gt;
         * &lt;div data-bind="wjInputTime: {
         *   min: new Date(2014, 8, 1, 9, 0),
         *   max: new Date(2014, 8, 1, 17, 0),
         *   step: 15,
         *   format: 'h:mm tt',
         *   value: theDate }"&gt;
         * &lt;/div&gt;</pre>
         *
         * The <b>wjInputTime</b> binding supports all read-write properties and events of
         * the @see:InputTime control. The following properties provide two-way binding mode:
         * <ul>
         * 	<li><b>isDroppedDown</b></li>
         * 	<li><b>text</b></li>
         * 	<li><b>selectedIndex</b></li>
         * 	<li><b>selectedItem</b></li>
         * 	<li><b>selectedValue</b></li>
         *  <li><b>value</b></li>
         * </ul>
         */
        var wjInputTime = (function (_super) {
            __extends(wjInputTime, _super);
            function wjInputTime() {
                _super.apply(this, arguments);
            }
            wjInputTime.prototype._getControlConstructor = function () {
                return wijmo.input.InputTime;
            };
            return wjInputTime;
        }(wjComboBox));
        knockout.wjInputTime = wjInputTime;
        /**
         * KnockoutJS binding for the @see:InputColor control.
         *
         * Use the @see:wjInputColor binding to add @see:InputColor controls to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a InputColor control:&lt;/p&gt;
         * &lt;div
         *   data-bind="wjInputColor: { value: theColor }"&gt;
         * &lt;/div&gt;</pre>
         *
         * The <b>wjInputColor</b> binding supports all read-write properties and events of
         * the @see:InputColor control. The following properties provide two-way binding mode:
         * <ul>
         * 	<li><b>isDroppedDown</b></li>
         * 	<li><b>text</b></li>
         * 	<li><b>value</b></li>
         * </ul>
         */
        var wjInputColor = (function (_super) {
            __extends(wjInputColor, _super);
            function wjInputColor() {
                _super.apply(this, arguments);
            }
            wjInputColor.prototype._getControlConstructor = function () {
                return wijmo.input.InputColor;
            };
            return wjInputColor;
        }(WjDropDownBinding));
        knockout.wjInputColor = wjInputColor;
        // Abstract
        var WjCollectionViewBaseBinding = (function (_super) {
            __extends(WjCollectionViewBaseBinding, _super);
            function WjCollectionViewBaseBinding() {
                _super.apply(this, arguments);
            }
            WjCollectionViewBaseBinding.prototype._createControl = function (element) {
                return null;
            };
            WjCollectionViewBaseBinding.prototype._createWijmoContext = function () {
                return new WjCollectionViewContext(this);
            };
            // Returns CV template 
            WjCollectionViewBaseBinding.prototype._getTemplate = function () {
                return '';
            };
            return WjCollectionViewBaseBinding;
        }(knockout.WjBinding));
        knockout.WjCollectionViewBaseBinding = WjCollectionViewBaseBinding;
        var WjCollectionViewContext = (function (_super) {
            __extends(WjCollectionViewContext, _super);
            function WjCollectionViewContext() {
                _super.apply(this, arguments);
                // WARNING: Never assign a null value to _localVM.cv, because bindings to subproperties (cv.prop) will raise an exception.
                // Instead, assign this dummy _emptyCV.
                this._emptyCV = new wijmo.collections.CollectionView([]);
            }
            WjCollectionViewContext.prototype.init = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                element.innerHTML = this.wjBinding._getTemplate();
                var cv = ko.unwrap(valueAccessor().cv) || this._emptyCV;
                this._subscribeToCV(cv);
                this._localVM = {
                    cv: ko.observable(cv)
                };
                var innerBindingContext = bindingContext.createChildContext(this._localVM);
                ko.applyBindingsToDescendants(innerBindingContext, element);
                return { controlsDescendantBindings: true };
            };
            WjCollectionViewContext.prototype.update = function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                var newCV = ko.unwrap(valueAccessor().cv) || this._emptyCV, oldCV = ko.unwrap(this._localVM.cv);
                if (newCV !== oldCV) {
                    this._unsubscribeFromCV(oldCV);
                    this._subscribeToCV(newCV);
                    this._localVM.cv(newCV);
                }
            };
            WjCollectionViewContext.prototype._subscribeToCV = function (cv) {
                if (cv) {
                    cv.collectionChanged.addHandler(this._forceBindingsUpdate, this);
                    cv.currentChanged.addHandler(this._forceBindingsUpdate, this);
                    cv.pageChanged.addHandler(this._forceBindingsUpdate, this);
                }
            };
            WjCollectionViewContext.prototype._unsubscribeFromCV = function (cv) {
                if (cv) {
                    cv.collectionChanged.removeHandler(this._forceBindingsUpdate, this);
                    cv.currentChanged.removeHandler(this._forceBindingsUpdate, this);
                    cv.pageChanged.removeHandler(this._forceBindingsUpdate, this);
                }
            };
            WjCollectionViewContext.prototype._forceBindingsUpdate = function (s, e) {
                this._localVM.cv.valueHasMutated();
            };
            return WjCollectionViewContext;
        }(knockout.WjContext));
        knockout.WjCollectionViewContext = WjCollectionViewContext;
        /**
         * KnockoutJS binding for an @see:ICollectionView pager element.
         *
         * Use the @see:wjCollectionViewPager directive to add an element that allows users to
         * navigate through the pages in a paged @see:ICollectionView. For example:
         *
         * <pre>Here is a CollectionViewPager:&lt;/p&gt;
         * &lt;div
         *   data-bind="wjCollectionViewPager: { cv: myCollectionView }"&gt;
         * &lt;/div&gt;</pre>
         *
         * The @see:wjCollectionViewPager directive has a single attribute:
         *
         * <dl class="dl-horizontal">
         *   <dt>cv</dt>  <dd>Reference to the paged @see:ICollectionView object to navigate.</dd>
         * </dl>
         */
        var wjCollectionViewPager = (function (_super) {
            __extends(wjCollectionViewPager, _super);
            function wjCollectionViewPager() {
                _super.apply(this, arguments);
            }
            wjCollectionViewPager.prototype._getMetaDataId = function () {
                return 'CollectionViewPager';
            };
            wjCollectionViewPager.prototype._getTemplate = function () {
                return '<div class="wj-control wj-content wj-pager">' +
                    '    <div class="wj-input-group">' +
                    '        <span class="wj-input-group-btn" >' +
                    '            <button class="wj-btn wj-btn-default" type="button"' +
                    '               data-bind="click: function () { cv().moveToFirstPage() },' +
                    '               disable: cv().pageIndex <= 0">' +
                    '                <span class="wj-glyph-left" style="margin-right: -4px;"></span>' +
                    '                <span class="wj-glyph-left"></span>' +
                    '            </button>' +
                    '        </span>' +
                    '        <span class="wj-input-group-btn" >' +
                    '           <button class="wj-btn wj-btn-default" type="button"' +
                    '               data-bind="click: function () { cv().moveToPreviousPage() },' +
                    '               disable: cv().pageIndex <= 0">' +
                    '                <span class="wj-glyph-left"></span>' +
                    '            </button>' +
                    '        </span>' +
                    '        <input type="text" class="wj-form-control" data-bind="' +
                    '            value: cv().pageIndex + 1 + \' / \' + cv().pageCount' +
                    '        " disabled />' +
                    '        <span class="wj-input-group-btn" >' +
                    '            <button class="wj-btn wj-btn-default" type="button"' +
                    '               data-bind="click: function () { cv().moveToNextPage() },' +
                    '               disable: cv().pageIndex >= cv().pageCount - 1">' +
                    '                <span class="wj-glyph-right"></span>' +
                    '            </button>' +
                    '        </span>' +
                    '        <span class="wj-input-group-btn" >' +
                    '            <button class="wj-btn wj-btn-default" type="button"' +
                    '               data-bind="click: function () { cv().moveToLastPage() },' +
                    '               disable: cv().pageIndex >= cv().pageCount - 1">' +
                    '                <span class="wj-glyph-right"></span>' +
                    '                <span class="wj-glyph-right" style="margin-left: -4px;"></span>' +
                    '            </button>' +
                    '        </span>' +
                    '    </div>' +
                    '</div>';
            };
            return wjCollectionViewPager;
        }(WjCollectionViewBaseBinding));
        knockout.wjCollectionViewPager = wjCollectionViewPager;
        /**
         * KnockoutJS binding for an @see:ICollectionView navigator element.
         *
         * Use the @see:wjCollectionViewNavigator directive to add an element that allows users to
         * navigate through the items in an @see:ICollectionView. For example:
         *
         * <pre>Here is a CollectionViewNavigator:&lt;/p&gt;
         * &lt;div
         *   data-bind="wjCollectionViewNavigator: { cv: myCollectionView }"&gt;
         * &lt;/div&gt;</pre>
         *
         * The @see:wjCollectionViewNavigator directive has a single attribute:
         *
         * <dl class="dl-horizontal">
         *   <dt>cv</dt>  <dd>Reference to the @see:ICollectionView object to navigate.</dd>
         * </dl>
         */
        var wjCollectionViewNavigator = (function (_super) {
            __extends(wjCollectionViewNavigator, _super);
            function wjCollectionViewNavigator() {
                _super.apply(this, arguments);
            }
            wjCollectionViewNavigator.prototype._getMetaDataId = function () {
                return 'CollectionViewNavigator';
            };
            wjCollectionViewNavigator.prototype._getTemplate = function () {
                return '<div class="wj-control wj-content wj-pager">' +
                    '    <div class="wj-input-group">' +
                    '        <span class="wj-input-group-btn" >' +
                    '            <button class="wj-btn wj-btn-default" type="button"' +
                    '               data-bind="click: function () { cv().moveCurrentToFirst() },' +
                    '               disable: cv().currentPosition <= 0">' +
                    '                <span class="wj-glyph-left" style="margin-right: -4px;"></span>' +
                    '                <span class="wj-glyph-left"></span>' +
                    '            </button>' +
                    '        </span>' +
                    '        <span class="wj-input-group-btn" >' +
                    '           <button class="wj-btn wj-btn-default" type="button"' +
                    '               data-bind="click: function () { cv().moveCurrentToPrevious() },' +
                    '               disable: cv().currentPosition <= 0">' +
                    '                <span class="wj-glyph-left"></span>' +
                    '            </button>' +
                    '        </span>' +
                    '        <input type="text" class="wj-form-control" data-bind="' +
                    '            value: cv().currentPosition + 1 + \' / \' + cv().itemCount' +
                    '        " disabled />' +
                    '        <span class="wj-input-group-btn" >' +
                    '            <button class="wj-btn wj-btn-default" type="button"' +
                    '               data-bind="click: function () { cv().moveCurrentToNext() },' +
                    '               disable: cv().currentPosition >= cv().itemCount - 1">' +
                    '                <span class="wj-glyph-right"></span>' +
                    '            </button>' +
                    '        </span>' +
                    '        <span class="wj-input-group-btn" >' +
                    '            <button class="wj-btn wj-btn-default" type="button"' +
                    '               data-bind="click: function () { cv().moveCurrentToLast() },' +
                    '               disable: cv().currentPosition >= cv().itemCount - 1">' +
                    '                <span class="wj-glyph-right"></span>' +
                    '                <span class="wj-glyph-right" style="margin-left: -4px;"></span>' +
                    '            </button>' +
                    '        </span>' +
                    '    </div>' +
                    '</div>';
            };
            return wjCollectionViewNavigator;
        }(WjCollectionViewBaseBinding));
        knockout.wjCollectionViewNavigator = wjCollectionViewNavigator;
        /**
         * KnockoutJS binding for the @see:MultiSelect control.
         *
         * Use the @see:wjMultiSelect binding to add @see:MultiSelect controls to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a MultiSelect control:&lt;/p&gt;
         * &lt;div data-bind="MultiSelect: {
         *   itemsSource: countries,
         *   isEditable: false,
         *   headerFormat: '{count} countries selected' }"&gt;
         * &lt;/div&gt;</pre>
         *
         * The <b>wjMultiSelect</b> binding supports all read-write properties and events of
         * the @see:MultiSelect control. The following properties provide two-way binding mode:
         * <ul>
         * 	<li><b>isDroppedDown</b></li>
         * 	<li><b>text</b></li>
         * 	<li><b>selectedIndex</b></li>
         * 	<li><b>selectedItem</b></li>
         * 	<li><b>selectedValue</b></li>
         * </ul>
         */
        var wjMultiSelect = (function (_super) {
            __extends(wjMultiSelect, _super);
            function wjMultiSelect() {
                _super.apply(this, arguments);
            }
            wjMultiSelect.prototype._getControlConstructor = function () {
                return wijmo.input.MultiSelect;
            };
            return wjMultiSelect;
        }(wjComboBox));
        knockout.wjMultiSelect = wjMultiSelect;
        /**
         * KnockoutJS binding for the @see:Popup control.
         *
         * Use the @see:wjPopup binding to add @see:Popup controls to your
         * KnockoutJS applications. For example:
         *
         * <pre>&lt;p&gt;Here is a Popup control triggered by a button:&lt;/p&gt;
         * &lt;button id="btn2" type="button"&gt;
         *     Click to show Popup
         * &lt;/button&gt;
         *  &lt;div class="popover" data-bind="wjPopup: {
         *       control: popup,
         *       owner: '#btn2',
         *       showTrigger: 'Click',
         *       hideTrigger: 'Click'}"
         *  &gt;
         *	&lt;h3&gt;
         *		 Salutation
         *	&lt;/h3&gt;
         *	 &lt;div class="popover-content"&gt;
         *	 	    Hello {&#8203;{firstName}} {&#8203;{lastName}}
         *	 &lt;/div&gt;
         * &lt;/div&gt;</pre>
         */
        var wjPopup = (function (_super) {
            __extends(wjPopup, _super);
            function wjPopup() {
                _super.apply(this, arguments);
            }
            wjPopup.prototype._getControlConstructor = function () {
                return wijmo.input.Popup;
            };
            wjPopup.prototype._createWijmoContext = function () {
                return new WjPopupContext(this);
            };
            wjPopup.prototype._initialize = function () {
                _super.prototype._initialize.call(this);
                var ownerDesc = knockout.MetaFactory.findProp('owner', this._metaData.props);
                ownerDesc.updateControl = function (link, propDesc, control, unconvertedValue, convertedValue) {
                    control.owner = convertedValue;
                    link._updateModal(convertedValue);
                    return true;
                };
            };
            return wjPopup;
        }(knockout.WjBinding));
        knockout.wjPopup = wjPopup;
        var WjPopupContext = (function (_super) {
            __extends(WjPopupContext, _super);
            function WjPopupContext() {
                _super.apply(this, arguments);
            }
            WjPopupContext.prototype._updateModal = function (convertedValue) {
                var valSet = this.valueAccessor(), popup = this.control, modal = ko.unwrap(valSet['modal']);
                if (modal == null) {
                    // not specified, make it modal if it has no owner 
                    popup['modal'] = convertedValue ? false : true;
                }
            };
            return WjPopupContext;
        }(knockout.WjContext));
        knockout.WjPopupContext = WjPopupContext;
    })(knockout = wijmo.knockout || (wijmo.knockout = {}));
})(wijmo || (wijmo = {}));
// Register bindings
(ko.bindingHandlers).wjComboBox = new wijmo.knockout.wjComboBox();
(ko.bindingHandlers).wjAutoComplete = new wijmo.knockout.wjAutoComplete();
(ko.bindingHandlers).wjCalendar = new wijmo.knockout.wjCalendar();
(ko.bindingHandlers).wjColorPicker = new wijmo.knockout.wjColorPicker();
(ko.bindingHandlers).wjListBox = new wijmo.knockout.wjListBox();
(ko.bindingHandlers).wjMenu = new wijmo.knockout.wjMenu();
(ko.bindingHandlers).wjMenuItem = new wijmo.knockout.wjMenuItem();
(ko.bindingHandlers).wjMenuSeparator = new wijmo.knockout.wjMenuSeparator();
(ko.bindingHandlers).wjContextMenu = new wijmo.knockout.wjContextMenu();
(ko.bindingHandlers).wjInputDate = new wijmo.knockout.wjInputDate();
(ko.bindingHandlers).wjInputDateTime = new wijmo.knockout.wjInputDateTime();
(ko.bindingHandlers).wjInputNumber = new wijmo.knockout.wjInputNumber();
(ko.bindingHandlers).wjInputMask = new wijmo.knockout.wjInputMask();
(ko.bindingHandlers).wjInputTime = new wijmo.knockout.wjInputTime();
(ko.bindingHandlers).wjInputColor = new wijmo.knockout.wjInputColor();
(ko.bindingHandlers).wjCollectionViewNavigator = new wijmo.knockout.wjCollectionViewNavigator();
(ko.bindingHandlers).wjCollectionViewPager = new wijmo.knockout.wjCollectionViewPager();
(ko.bindingHandlers).wjMultiSelect = new wijmo.knockout.wjMultiSelect();
(ko.bindingHandlers).wjPopup = new wijmo.knockout.wjPopup();
//# sourceMappingURL=wijmo.knockout.input.js.map