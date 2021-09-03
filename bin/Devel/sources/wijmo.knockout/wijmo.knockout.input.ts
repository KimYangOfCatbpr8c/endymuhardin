
module wijmo.knockout {

    // DropDown custom binding.
    // Abstract class, not for use in markup
    export class WjDropDownBinding extends WjBinding {
        _getControlConstructor(): any {
            return wijmo.input.DropDown;
        }
    }

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
    export class wjComboBox extends WjDropDownBinding {
        _getControlConstructor(): any {
            return wijmo.input.ComboBox;
        }
    }

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
    export class wjAutoComplete extends wjComboBox {
        _getControlConstructor(): any {
            return wijmo.input.AutoComplete;
        }
    }

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
    export class wjCalendar extends WjBinding {
        _getControlConstructor(): any {
            return wijmo.input.Calendar;
        }
    }

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
    export class wjColorPicker extends WjBinding {
        _getControlConstructor(): any {
            return wijmo.input.ColorPicker;
        }
    }

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
    export class wjListBox extends WjBinding {
        _getControlConstructor(): any {
            return wijmo.input.ListBox;
        }
    }

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
    export class wjMenu extends wjComboBox {
        _getControlConstructor(): any {
            return wijmo.input.Menu;
        }

        _createWijmoContext(): WjContext {
            return new WjMenuContext(this);
        }

        _initialize() {
            super._initialize();
            var valueDesc = MetaFactory.findProp('value', <PropDesc[]>this._metaData.props);
            valueDesc.updateControl = this._updateControlValue;
        }

        private _updateControlValue(link: any, propDesc: PropDesc, control: any, unconvertedValue: any, convertedValue: any): boolean {
            if (convertedValue != null) {
                control.selectedValue = convertedValue;
                (<WjMenuContext>link)._updateHeader();
            }

            return true;
        }

    }

    export class WjMenuContext extends WjContext {
        _initControl() {
            super._initControl();
            var menuCtrl = <wijmo.input.Menu>this.control;
            menuCtrl.displayMemberPath = 'header';
            menuCtrl.commandPath = 'cmd';
            menuCtrl.commandParameterPath = 'cmdParam';
            menuCtrl.selectedValuePath = 'value';
            menuCtrl.itemsSource = new wijmo.collections.ObservableArray();

            // update 'value' and header when an item is clicked
            menuCtrl.itemClicked.addHandler(() => {
                this._safeUpdateSrcAttr('value', menuCtrl.selectedValue);
                this._updateHeader();
            });
        }

        _childrenInitialized() {
            super._childrenInitialized();
            this.control.selectedIndex = 0;
            this._updateHeader();
        }

        // update header to show the currently selected value
        _updateHeader() {
            var control = <wijmo.input.Menu>this.control,
                valSet = this.valueAccessor(),
                newHeader = ko.unwrap(valSet['header']);
            //control.header = scope.header;
            if (ko.unwrap(valSet['value']) !== undefined && control.selectedItem && control.displayMemberPath) {
                var currentValue = control.selectedItem[control.displayMemberPath];
                if (currentValue != null) {
                    newHeader += ': <b>' + currentValue + '</b>';
                }
            }
            control.header = newHeader;
        }
    }

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
    export class wjMenuItem extends WjBinding {
        _getMetaDataId(): any {
            return 'MenuItem';
        }

        _createWijmoContext(): WjContext {
            return new WjMenuItemContext(this);
        }

        _initialize() {
            super._initialize();
            var meta = this._metaData;
            meta.parentProperty = 'itemsSource';
            meta.isParentPropertyArray = true;
        }

    }

    export class WjMenuItemContext extends WjContext {
        _createControl(): any {
            return { header: this.element.innerHTML, cmd: null, cmdParam: null, value: null };
        }
    }


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
    export class wjMenuSeparator extends WjBinding {
        _getMetaDataId(): any {
            return 'MenuSeparator';
        }

        _initialize() {
            super._initialize();
            var meta = this._metaData;
            meta.parentProperty = 'itemsSource';
            meta.isParentPropertyArray = true;
        }

        _createControl(element: any): any {
            return { header: '<div class="wj-state-disabled" style="width:100%;height:1px;background-color:lightgray"/>' };
        }
    }

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
    export class wjContextMenu extends WjBinding {

        _getMetaDataId(): any {
            return 'ContextMenu';
        }
        _createControl(element: any): any {
            return null;
        }
        _createWijmoContext(): WjContext {
            return new WjContextMenuContext(this);
        }
    }

    export class WjContextMenuContext extends WjContext {

        _initControl() {
            super._initControl();
            var valSet = this.valueAccessor();
            // get context menu and drop-down list
            var host = wijmo.getElement(valSet['id']);

            // show the drop-down list in response to the contextmenu command
            this.element.addEventListener('contextmenu', function (e) {
                var menu = <wijmo.input.Menu>wijmo.Control.getControl(host),
                    dropDown = menu.dropDown;
                if (menu && dropDown && !closest(e.target, '[disabled]')) {
                    e.preventDefault();
                    menu.owner = this.element;
                    menu.selectedIndex = -1;
                    if (menu.onIsDroppedDownChanging(new wijmo.CancelEventArgs())) {
                        showPopup(dropDown, e);
                        menu.onIsDroppedDownChanged();
                        dropDown.focus();
                    }
                }
            });
        }
    }

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
    export class wjInputDate extends WjDropDownBinding {
        _getControlConstructor(): any {
            return wijmo.input.InputDate;
        }
    }

    /**
     * KnockoutJS binding for the @see:InputDateTime control.
     *
     * Use the @see:wjInputDateTime binding to add @see:InputDateTime controls to your 
     * KnockoutJS applications. 
     * 
     * The <b>wjInputDateTime</b> binding supports all read-write properties and events of 
     * the @see:InputDateTime control. 
     */
    export class wjInputDateTime extends WjBinding {

        _getControlConstructor(): any {
            return wijmo.input.InputDateTime;
        }

    }

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
    export class wjInputNumber extends WjBinding {
        _getControlConstructor(): any {
            return wijmo.input.InputNumber;
        }
    }

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
    export class wjInputMask extends WjBinding {
        _getControlConstructor(): any {
            return wijmo.input.InputMask;
        }
    }

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
    export class wjInputTime extends wjComboBox {
        _getControlConstructor(): any {
            return wijmo.input.InputTime;
        }
    }

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
    export class wjInputColor extends WjDropDownBinding {
        _getControlConstructor(): any {
            return wijmo.input.InputColor;
        }
    }

    // Abstract
    export class WjCollectionViewBaseBinding extends WjBinding {
        _createControl(element: any): any {
            return null;
        }

        _createWijmoContext(): WjContext {
            return new WjCollectionViewContext(this);
        }

        // Returns CV template 
        _getTemplate() {
            return '';
        }
    }

    export class WjCollectionViewContext extends WjContext {
        private _localVM: any;
        // WARNING: Never assign a null value to _localVM.cv, because bindings to subproperties (cv.prop) will raise an exception.
        // Instead, assign this dummy _emptyCV.
        private _emptyCV = new wijmo.collections.CollectionView([]);

        init(element: any, valueAccessor: () => any, allBindings: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext): any {
            element.innerHTML = (<WjCollectionViewBaseBinding>this.wjBinding)._getTemplate();
            var cv = ko.unwrap(valueAccessor().cv) || this._emptyCV;
            this._subscribeToCV(cv);
            this._localVM = {
                cv: ko.observable(cv)
            };
            var innerBindingContext = bindingContext.createChildContext(this._localVM);
            ko.applyBindingsToDescendants(innerBindingContext, element);

            return { controlsDescendantBindings: true };
        }

        update(element: any, valueAccessor: () => any, allBindings: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext): void {
            var newCV = ko.unwrap(valueAccessor().cv) || this._emptyCV,
                oldCV = ko.unwrap(this._localVM.cv);
            if (newCV !== oldCV) {
                this._unsubscribeFromCV(oldCV);
                this._subscribeToCV(newCV);
                this._localVM.cv(newCV);
            }
        }

        private _subscribeToCV(cv: wijmo.collections.CollectionView) {
            if (cv) {
                cv.collectionChanged.addHandler(this._forceBindingsUpdate, this);
                cv.currentChanged.addHandler(this._forceBindingsUpdate, this);
                cv.pageChanged.addHandler(this._forceBindingsUpdate, this);
            }
        }

        private _unsubscribeFromCV(cv: wijmo.collections.CollectionView) {
            if (cv) {
                cv.collectionChanged.removeHandler(this._forceBindingsUpdate, this);
                cv.currentChanged.removeHandler(this._forceBindingsUpdate, this);
                cv.pageChanged.removeHandler(this._forceBindingsUpdate, this);
            }
        }

        private _forceBindingsUpdate(s, e) {
            this._localVM.cv.valueHasMutated();
        }
    }

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
    export class wjCollectionViewPager extends WjCollectionViewBaseBinding {
        _getMetaDataId(): any {
            return 'CollectionViewPager';
        }

        _getTemplate() {
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
        }
    }

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
    export class wjCollectionViewNavigator extends WjCollectionViewBaseBinding {
        _getMetaDataId(): any {
            return 'CollectionViewNavigator';
        }

        _getTemplate() {
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

        }
    }

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
    export class wjMultiSelect extends wjComboBox {
        _getControlConstructor(): any {
            return wijmo.input.MultiSelect;
        }
    }

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
    export class wjPopup extends WjBinding {
        _getControlConstructor(): any {
            return wijmo.input.Popup;
        }

        _createWijmoContext(): WjContext {
            return new WjPopupContext(this);
        }

        _initialize() {
            super._initialize();
            var ownerDesc = MetaFactory.findProp('owner', <PropDesc[]>this._metaData.props);
            ownerDesc.updateControl = function (link, propDesc, control, unconvertedValue, convertedValue): boolean {
                control.owner = convertedValue;
                (<WjPopupContext>link)._updateModal(convertedValue);
                return true;
            };
        }
    }

    export class WjPopupContext extends WjContext {

        _updateModal(convertedValue:any) {
           var valSet = this.valueAccessor(),
                popup = <wijmo.input.Popup>this.control,
                modal = ko.unwrap(valSet['modal']);
            if (modal == null) {
                // not specified, make it modal if it has no owner 
                popup['modal'] = convertedValue ? false : true;
            }
        }
    }
} 

// Register bindings
(<any>(ko.bindingHandlers)).wjComboBox = new wijmo.knockout.wjComboBox();
(<any>(ko.bindingHandlers)).wjAutoComplete = new wijmo.knockout.wjAutoComplete();
(<any>(ko.bindingHandlers)).wjCalendar = new wijmo.knockout.wjCalendar();
(<any>(ko.bindingHandlers)).wjColorPicker = new wijmo.knockout.wjColorPicker();
(<any>(ko.bindingHandlers)).wjListBox = new wijmo.knockout.wjListBox();
(<any>(ko.bindingHandlers)).wjMenu = new wijmo.knockout.wjMenu();
(<any>(ko.bindingHandlers)).wjMenuItem = new wijmo.knockout.wjMenuItem();
(<any>(ko.bindingHandlers)).wjMenuSeparator = new wijmo.knockout.wjMenuSeparator();
(<any>(ko.bindingHandlers)).wjContextMenu = new wijmo.knockout.wjContextMenu();
(<any>(ko.bindingHandlers)).wjInputDate = new wijmo.knockout.wjInputDate();
(<any>(ko.bindingHandlers)).wjInputDateTime = new wijmo.knockout.wjInputDateTime();
(<any>(ko.bindingHandlers)).wjInputNumber = new wijmo.knockout.wjInputNumber();
(<any>(ko.bindingHandlers)).wjInputMask = new wijmo.knockout.wjInputMask();
(<any>(ko.bindingHandlers)).wjInputTime = new wijmo.knockout.wjInputTime();
(<any>(ko.bindingHandlers)).wjInputColor = new wijmo.knockout.wjInputColor();
(<any>(ko.bindingHandlers)).wjCollectionViewNavigator = new wijmo.knockout.wjCollectionViewNavigator();
(<any>(ko.bindingHandlers)).wjCollectionViewPager = new wijmo.knockout.wjCollectionViewPager();
(<any>(ko.bindingHandlers)).wjMultiSelect = new wijmo.knockout.wjMultiSelect();
(<any>(ko.bindingHandlers)).wjPopup = new wijmo.knockout.wjPopup();

