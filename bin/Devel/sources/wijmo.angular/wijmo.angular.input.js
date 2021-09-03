var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//
// AngularJS directives for wijmo.input module
//
var wijmo;
(function (wijmo) {
    var angular;
    (function (angular) {
        //#region "Input directives registration"
        var wijmoInput = window['angular'].module('wj.input', []); // angular module for Wijmo inputs
        // register only if module is loaded
        if (wijmo.input && wijmo.input.InputNumber) {
            wijmoInput.directive('wjAutoComplete', ['$compile', function ($compile) {
                    return new WjAutoComplete($compile);
                }]);
            wijmoInput.directive('wjCalendar', [function () {
                    return new WjCalendar();
                }]);
            wijmoInput.directive('wjColorPicker', [function () {
                    return new WjColorPicker();
                }]);
            wijmoInput.directive('wjComboBox', ['$compile', function ($compile) {
                    return new WjComboBox($compile);
                }]);
            wijmoInput.directive('wjInputDate', [function () {
                    return new WjInputDate();
                }]);
            wijmoInput.directive('wjInputDateTime', [function () {
                    return new WjInputDateTime();
                }]);
            wijmoInput.directive('wjInputNumber', [function () {
                    return new WjInputNumber();
                }]);
            wijmoInput.directive('wjInputMask', [function () {
                    return new WjInputMask();
                }]);
            wijmoInput.directive('wjInputTime', ['$compile', function ($compile) {
                    return new WjInputTime($compile);
                }]);
            wijmoInput.directive('wjInputColor', [function () {
                    return new WjInputColor();
                }]);
            wijmoInput.directive('wjListBox', [function () {
                    return new WjListBox();
                }]);
            wijmoInput.directive('wjItemTemplate', ['$compile', function ($compile) {
                    return new WjItemTemplate($compile);
                }]);
            wijmoInput.directive('wjMenu', ['$compile', function ($compile) {
                    return new WjMenu($compile);
                }]);
            wijmoInput.directive('wjMenuItem', [function ($compile) {
                    return new WjMenuItem();
                }]);
            wijmoInput.directive('wjMenuSeparator', [function () {
                    return new WjMenuSeparator();
                }]);
            wijmoInput.directive('wjContextMenu', [function () {
                    return new WjContextMenu();
                }]);
            wijmoInput.directive('wjCollectionViewNavigator', [function () {
                    return new WjCollectionViewNavigator();
                }]);
            wijmoInput.directive('wjCollectionViewPager', [function () {
                    return new WjCollectionViewPager();
                }]);
            wijmoInput.directive('wjPopup', [function () {
                    return new WjPopup();
                }]);
            wijmoInput.directive('wjMultiSelect', ['$compile', function ($compile) {
                    return new WjMultiSelect($compile);
                }]);
        }
        //#endregion "Input directives definitions"
        //#region "Input directives classes"
        // DropDown control directive
        // Provides base setup for all directives related to controls derived from DropDown
        // Abstract class, not for use in markup
        var WjDropDown = (function (_super) {
            __extends(WjDropDown, _super);
            function WjDropDown() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(WjDropDown.prototype, "_controlConstructor", {
                get: function () {
                    return wijmo.input.DropDown;
                },
                enumerable: true,
                configurable: true
            });
            return WjDropDown;
        }(angular.WjDirective));
        /**
         * AngularJS directive for the @see:ComboBox control.
         *
         * Use the <b>wj-combo-box</b> directive to add <b>ComboBox</b> controls to your AngularJS applications.
         * Note that directive and parameter names must be formatted as lower-case with dashes
         * instead of camel-case. For example:
         *
         * <pre>&lt;p&gt;Here is a ComboBox control:&lt;/p&gt;
         * &lt;wj-combo-box
         *   text="theCountry"
         *   items-source="countries"
         *   is-editable="false"
         *   placeholder="country"&gt;
         * &lt;/wj-combo-box&gt;</pre>
         *
         * The example below creates a <b>ComboBox</b> control and binds it to a 'countries' array
         * exposed by the controller. The <b>ComboBox</b> searches for the country as the user
         * types. The <b>isEditable</b> property is set to false, so the user is forced to
         * select one of the items in the list.
         *
         * @fiddle:37GHw
         *
         * The <b>wj-combo-box</b> directive supports the following attributes:
         *
         * <dl class="dl-horizontal">
         *   <dt>ng-model</dt>      <dd><code>@</code> Binds the control's <b>selectedValue</b> property using the ng-model Angular
         *                          directive. Binding the property using the ng-model directive provides standard benefits
         *                          like validation, adding the control's state to the form instance, and so on. To redefine
         *                          properties on a control that is bound by the ng-model directive, use the wj-model-property
         *                          attribute.</dd>
         *   <dt>wj-model-property</dt>  <dd><code>@</code> Specifies a control property that is bound to a scope using the
         *                               <b>ng-model</b> directive.</dd>
         *   <dt>control</dt>              <dd><code>=</code> A reference to the @see:ComboBox control created by this directive.</dd>
         *   <dt>display-member-path</dt>  <dd><code>@</code> The name of the property to use as the visual representation of the items.</dd>
         *   <dt>is-content-html</dt>      <dd><code>@</code> A value indicating whether the drop-down list displays the items as plain text or as HTML.</dd>
         *   <dt>is-dropped-down</dt>      <dd><code>@</code> A value indicating whether the drop down list is currently visible.</dd>
         *   <dt>is-editable</dt>          <dd><code>@</code> A value indicating whether the user can enter values not present on the list.</dd>
         *   <dt>initialized</dt>          <dd><code>&</code> This event occurs after the binding has finished initializing the control with attribute values.</dd>
         *   <dt>is-initialized</dt>       <dd><code>=</code> A value indicating whether the binding has finished initializing the control with attribute values.</dd>
         *   <dt>item-formatter</dt>       <dd><code>=</code> A function used to customize the values shown in the drop-down list.</dd>
         *   <dt>items-source</dt>         <dd><code>=</code> An array or @see:ICollectionView that contains items to show in the list.</dd>
         *   <dt>max-drop-down-height</dt> <dd><code>@</code> The maximum height of the drop-down list.</dd>
         *   <dt>max-drop-down-width</dt>  <dd><code>@</code> The maximum width of the drop-down list.</dd>
         *   <dt>placeholder</dt>          <dd><code>@</code> A string shown as a hint when the control is empty.</dd>
         *   <dt>is-required</dt>          <dd><code>@</code> A value indicating whether to prevent null values.</dd>
         *   <dt>show-drop-down-button</dt><dd><code>@</code> A value indicating whether the control displays a drop-down button.</dd>
         *   <dt>selected-index</dt>       <dd><code>=</code> The index of the currently selected item in the drop-down list.</dd>
         *   <dt>selected-item</dt>        <dd><code>=</code> The currently selected item in the drop-down list.</dd>
         *   <dt>selected-value</dt>       <dd><code>=</code> The value of the selected item, obtained using the <b>selected-value-path</b>.</dd>
         *   <dt>selected-value-path</dt>  <dd><code>@</code> The name of the property used to get the <b>selected-value</b> from the <b>selected-item</b>.</dd>
         *   <dt>text</dt>                 <dd><code>=</code> The text to show in the control.</dd>
         *   <dt>is-dropped-down-changing</dt> <dd><code>&</code> The @see:ComboBox.isDroppedDownChanging event handler.</dd>
         *   <dt>is-dropped-down-changed</dt>  <dd><code>&</code> The @see:ComboBox.isDroppedDownChanged event handler.</dd>
         *   <dt>selected-index-changed</dt>   <dd><code>&</code> The @see:ComboBox.selectedIndexChanged event handler.</dd>
         *   <dt>got-focus</dt>            <dd><code>&</code> The @see:ComboBox.gotFocus event handler.</dd>
         *   <dt>lost-focus</dt>           <dd><code>&</code> The @see:ComboBox.lostFocus event handler.</dd>
         *   <dt>text-changed</dt>         <dd><code>&</code> The @see:ComboBox.textChanged event handler.</dd>
         * </dl>
         */
        var WjComboBox = (function (_super) {
            __extends(WjComboBox, _super);
            function WjComboBox($compile) {
                _super.call(this);
                this._$compile = $compile;
                this.template = '<div ng-transclude />';
                this.transclude = true;
            }
            Object.defineProperty(WjComboBox.prototype, "_controlConstructor", {
                // Gets the Combobox control constructor
                get: function () {
                    return wijmo.input.ComboBox;
                },
                enumerable: true,
                configurable: true
            });
            return WjComboBox;
        }(WjDropDown));
        /**
         * AngularJS directive for the @see:AutoComplete control.
         *
         * Use the <b>wj-auto-complete</b> directive to add <b>AutoComplete</b> controls to your
         * AngularJS applications. Note that directive and parameter names must be
         * formatted as lower-case with dashes instead of camel-case. For example:
         *
         * <pre>&lt;p&gt;Here is an AutoComplete control:&lt;/p&gt;
         * &lt;wj-auto-complete
         *   text="theCountry"
         *   items-source="countries"
         *   is-editable="false"
         *   placeholder="country"&gt;
         * &lt;/wj-auto-complete&gt;</pre>
         *
         * The example below creates an <b>AutoComplete</b> control and binds it to a 'countries' array
         * exposed by the controller. The <b>AutoComplete</b> searches for the country as the user
         * types, and narrows down the list of countries that match the current input.
         *
         * @fiddle:37GHw
         *
         * The <b>wj-auto-complete</b> directive extends @see:WjComboBox with the following attributes:
         *
         * <dl class="dl-horizontal">
         *   <dt>css-match</dt>            <dd><code>@</code> The name of the CSS class used to highlight
         *                                 parts of the content that match the search terms.</dd>
         *   <dt>delay</dt>                <dd><code>@</code> The amount of delay in milliseconds between
         *                                 when a keystroke occurs and when the search is performed.</dd>
         *   <dt>items-source-function</dt><dd><code>=</code> A function that provides the items
         *                                 dynamically as the user types.</dd>
         *   <dt>max-items</dt>            <dd><code>@</code> The maximum number of items to display
         *                                 in the dropdown.</dd>
         *   <dt>min-length</dt>           <dd><code>@</code> The minimum input length to require before
         *                                 triggering autocomplete suggestions.</dd>
         * </dl>
         */
        var WjAutoComplete = (function (_super) {
            __extends(WjAutoComplete, _super);
            function WjAutoComplete($compile) {
                _super.call(this, $compile);
            }
            Object.defineProperty(WjAutoComplete.prototype, "_controlConstructor", {
                // Gets AutoComplete control constructor
                get: function () {
                    return wijmo.input.AutoComplete;
                },
                enumerable: true,
                configurable: true
            });
            return WjAutoComplete;
        }(WjComboBox));
        /**
         * AngularJS directive for the @see:Calendar control.
         *
         * Use the <b>wj-calendar</b> directive to add <b>Calendar</b> controls to your
         * AngularJS applications.
         * Note that directive and parameter names must be formatted as lower-case with dashes
         * instead of camel-case. For example:
         *
         * <pre>&lt;p&gt;Here is a Calendar control:&lt;/p&gt;
         * &lt;wj-calendar
         *   value="theDate"&gt;
         * &lt;/wj-calendar&gt;</pre>
         *
         * @fiddle:46PhD
         *
         * This example creates a <b>Calendar</b> control and binds it to a 'date' variable
         * exposed by the controller. The range of dates that may be selected is limited
         * by the <b>min</b> and <b>max</b> properties.
         *
         * The <b>wj-calendar</b> directive supports the following attributes:
         *
         * <dl class="dl-horizontal">
         *   <dt>ng-model</dt>      <dd><code>@</code> Binds the control's <b>value</b> property using the ng-model Angular
         *                          directive. Binding the property using the ng-model directive provides standard benefits
         *                          like validation, adding the control's state to the form instance, and so on. To redefine
         *                          properties on a control that is bound by the ng-model directive, use the wj-model-property
         *                          attribute.</dd>
         *   <dt>wj-model-property</dt>  <dd><code>@</code> Specifies a control property that is bound to a scope using the
         *                               <b>ng-model</b> directive.</dd>
         *   <dt>control</dt>        <dd><code>=</code> A reference to the @see:Calendar control
         *                           created by this directive.</dd>
         *   <dt>display-month</dt>  <dd><code>=</code> The month being displayed in the calendar.</dd>
         *   <dt>first-day-of-week</dt> <dd><code>@</code> The first day of the week.</dd>
         *   <dt>initialized</dt>          <dd><code>&</code> This event occurs after the binding has finished
         *                                 initializing the control with attribute values.</dd>
         *   <dt>is-initialized</dt>       <dd><code>=</code> A value indicating whether the binding has finished
         *                                 initializing the control with attribute values. </dd>
         *   <dt>item-formatter</dt> <dd><code>=</code> The function used to customize the dates
         *                           shown in the calendar.</dd>
         *   <dt>max</dt>            <dd><code>@</code> The latest valid date (string in the
         *                           format "yyyy-MM-dd").</dd>
         *   <dt>min</dt>            <dd><code>@</code> The earliest valid date (string in the
         *                           format "yyyy-MM-dd").</dd>
         *   <dt>month-view</dt>     <dd><code>@</code> A value indicating whether the control displays
         *                           a month or the entire year.</dd>
         *   <dt>show-header</dt>    <dd><code>@</code> A value indicating whether the control displays
         *                           the header area.</dd>
         *   <dt>value</dt>          <dd><code>=</code> The date being edited.</dd>
         *   <dt>got-focus</dt>      <dd><code>&</code> The @see:Calendar.gotFocus event handler.</dd>
         *   <dt>lost-focus</dt>     <dd><code>&</code> The @see:Calendar.lostFocus event handler.</dd>
         *   <dt>value-changed</dt>  <dd><code>&</code> The @see:Calendar.valueChanged event handler.</dd>
         * </dl>
         *
         * If provided, the <b>min</b> and <b>max</b> attributes are strings in the format
         * "yyyy-MM-dd." Technically, you can use any full date as defined in the W3C
         * <a href="http://tools.ietf.org/html/rfc3339" target="_blank">[RFC 3339]</a>,
         * which is also the format used with regular HTML5 input elements.
         */
        var WjCalendar = (function (_super) {
            __extends(WjCalendar, _super);
            function WjCalendar() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(WjCalendar.prototype, "_controlConstructor", {
                // Gets the Calendar control constructor
                get: function () {
                    return wijmo.input.Calendar;
                },
                enumerable: true,
                configurable: true
            });
            return WjCalendar;
        }(angular.WjDirective));
        /**
         * AngularJS directive for the @see:ColorPicker control.
         *
         * Use the <b>wj-color-picker</b> directive to add <b>ColorPicker</b> controls to your
         * AngularJS applications. Note that directive and parameter names must be
         * formatted as lower-case with dashes instead of camel-case. For example:
         *
         * <pre>&lt;p&gt;Here is a ColorPicker control:&lt;/p&gt;
         * &lt;wj-color-picker
         *   value="theColor"
         *   show-alpha-channel="false"&gt;
         * &lt;/wj-color-picker&gt;</pre>
         *
         * The <b>wj-color-picker</b> directive supports the following attributes:
         *
         * <dl class="dl-horizontal">
         *   <dt>ng-model</dt>      <dd><code>@</code> Binds the control's <b>value</b> property using the ng-model Angular
         *                          directive. Binding the property using the ng-model directive provides standard benefits
         *                          like validation, adding the control's state to the form instance, and so on. To redefine
         *                          properties on a control that is bound by the ng-model directive, use the wj-model-property
         *                          attribute.</dd>
         *   <dt>wj-model-property</dt>  <dd><code>@</code> Specifies a control property that is bound to a scope using the
         *                               <b>ng-model</b> directive.</dd>
         *   <dt>control</dt>           <dd><code>=</code> A reference to the @see:ColorPicker
         *                              control created by this directive.</dd>
         *   <dt>initialized</dt>          <dd><code>&</code> This event occurs after the binding has finished
         *                                 initializing the control with attribute values.</dd>
         *   <dt>is-initialized</dt>       <dd><code>=</code> A value indicating whether the binding has finished
         *                                 initializing the control with attribute values. </dd>
         *   <dt>show-alpha-channel</dt><dd><code>@</code> A value indicating whether the control
         *                              displays the alpha channel (transparency) editor.</dd>
         *   <dt>show-color-string</dt> <dd><code>@</code> A value indicating whether the control
         *                              displays a string representation of the color being edited.</dd>
         *   <dt>palette</dt>           <dd><code>=</code> An array with ten color values to use
         *                              as the palette.</dd>
         *   <dt>value</dt>             <dd><code>=</code> The color being edited.</dd>
         *   <dt>got-focus</dt>         <dd><code>&</code> The @see:ColorPicker.gotFocus event handler.</dd>
         *   <dt>lost-focus</dt>        <dd><code>&</code> The @see:ColorPicker.lostFocus event handler.</dd>
         *   <dt>value-changed</dt>     <dd><code>&</code> The @see:ColorPicker.valueChanged event handler.</dd>
         * </dl>
         */
        var WjColorPicker = (function (_super) {
            __extends(WjColorPicker, _super);
            function WjColorPicker() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(WjColorPicker.prototype, "_controlConstructor", {
                // Gets the ColorPicker control constructor
                get: function () {
                    return wijmo.input.ColorPicker;
                },
                enumerable: true,
                configurable: true
            });
            return WjColorPicker;
        }(angular.WjDirective));
        /**
         * AngularJS directive for the @see:ListBox control.
         *
         * Use the <b>wj-list-box</b> directive to add @see:ListBox controls to your
         * AngularJS applications.
         * Note that directive and parameter names must be formatted as lower-case with dashes
         * instead of camel-case. For example:
         *
         * <pre>b&gt;Here is a ListBox control:&lt;/p&gt;
         * &lt;wj-list-box
         *   selected-item="theCountry"
         *   items-source="countries"
         *   placeholder="country"&gt;
         * &lt;/wj-list-box&gt;</pre>
         *
         * The example below creates a <b>ListBox</b> control and binds it to a 'countries' array
         * exposed by the controller. The value selected is bound to the 'theCountry'
         * controller property using the <b>selected-item</b> attribute.
         *
         * @fiddle:37GHw
         *
         * The <b>wj-list-box</b> directive supports the following attributes:
         *
         * <dl class="dl-horizontal">
         *   <dt>ng-model</dt>      <dd><code>@</code> Binds the control's <b>selectedValue</b> property using the ng-model Angular
         *                          directive. Binding the property using the ng-model directive provides standard benefits
         *                          like validation, adding the control's state to the form instance, and so on. To redefine
         *                          properties on a control that is bound by the ng-model directive, use the wj-model-property
         *                          attribute.</dd>
         *   <dt>wj-model-property</dt>  <dd><code>@</code> Specifies a control property that is bound to a scope using the
         *                               <b>ng-model</b> directive.</dd>
         *   <dt>control</dt>              <dd><code>=</code> A reference to the @see:ListBox
         *                                 control created by this directive.</dd>
         *   <dt>display-member-path</dt>  <dd><code>@</code> The property to use as the visual
         *                                 representation of the items.</dd>
         *   <dt>is-content-html</dt>      <dd><code>@</code> A value indicating whether items
         *                                 contain plain text or HTML.</dd>
         *   <dt>initialized</dt>          <dd><code>&</code> This event occurs after the binding has finished
         *                                 initializing the control with attribute values.</dd>
         *   <dt>is-initialized</dt>       <dd><code>=</code> A value indicating whether the binding has finished
         *                                 initializing the control with attribute values. </dd>
         *   <dt>item-formatter</dt>       <dd><code>=</code> A function used to customize the
         *                                 values to show in the list.</dd>
         *   <dt>items-source</dt>         <dd><code>=</code> An array or @see:ICollectionView
         *                                 that contains the list items.</dd>
         *   <dt>max-height</dt>           <dd><code>@</code> The maximum height of the list.</dd>
         *   <dt>selected-index</dt>       <dd><code>=</code> The index of the currently selected
         *                                 item.</dd>
         *   <dt>selected-item</dt>        <dd><code>=</code> The item that is currently selected.</dd>
         *   <dt>selected-value</dt>       <dd><code>=</code> The value of the <b>selected-item</b>
         *                                 obtained using the <b>selected-value-path</b>.</dd>
         *   <dt>selected-value-path</dt>  <dd><code>@</code> The property used to get the
         *                                 <b>selected-value</b> from the <b>selected-item</b>.</dd>
         *   <dt>got-focus</dt>            <dd><code>&</code> The @see:ListBox.gotFocus event handler.</dd>
         *   <dt>lost-focus</dt>           <dd><code>&</code> The @see:ListBox.lostFocus event handler.</dd>
         *   <dt>items-changed</dt>        <dd><code>&</code> The @see:ListBox.itemsChanged event handler.</dd>
         *   <dt>selected-index-changed</dt> <dd><code>&</code> The @see:ListBox.selectedIndexChanged event handler.</dd>
         * </dl>
         *
         * The <b>wj-list-box</b> directive may contain @see:WjItemTemplate child directive.
         */
        var WjListBox = (function (_super) {
            __extends(WjListBox, _super);
            function WjListBox() {
                _super.call(this);
                this.transclude = true;
                this.template = '<div ng-transclude />';
            }
            Object.defineProperty(WjListBox.prototype, "_controlConstructor", {
                // Gets the ListBox control constructor
                get: function () {
                    return wijmo.input.ListBox;
                },
                enumerable: true,
                configurable: true
            });
            return WjListBox;
        }(angular.WjDirective));
        /**
         * AngularJS directive for @see:ListBox and @see:Menu item templates.
         *
         * The <b>wj-item-template</b> directive must be contained in a @see:WjListBox
         * or @see:WjMenu directives.
         *
         * The <b>wj-item-template</b> directive defines a template for items of <b>ListBox</b>
         * and data-bound <b>Menu</b> controls.
         * The template may contain an arbitrary HTML fragment with AngularJS bindings and directives.
         * In addition to any properties available in a controller, the local <b>$item</b>,
         * <b>$itemIndex</b> and <b>$control</b> template variables can be used in AngularJS bindings
         * that refer to the data item, its index, and the owner control.
         *
         * Note that directive and parameter names must be formatted as lower-case with dashes
         * instead of camel-case. For example:
         *
         * <pre>&lt;p&gt;Here is a ListBox control with an item template:&lt;/p&gt;
         * &lt;wj-list-box items-source="musicians"&gt;
         *     &lt;wj-item-template&gt;
         *         {&#8203;{$itemIndex}}. &lt;b&gt;{&#8203;{$item.name}}&lt;/b&gt;
         *         &lt;br /&gt;
         *         &lt;img ng-src="{&#8203;{$item.photo}}"/&gt;
         *     &lt;/wj-item-template&gt;
         * &lt;/wj-list-box&gt;</pre>
         */
        var WjItemTemplate = (function (_super) {
            __extends(WjItemTemplate, _super);
            function WjItemTemplate($compile) {
                _super.call(this);
                this._$compile = $compile;
                this.require = ['?^wjListBox', '?^wjMenu'];
                // The same approach like in WjFlexGridColumn
                this['terminal'] = true;
                if (angular.WjDirective._dynaTemplates) {
                    this.transclude = false;
                    this['priority'] = 100;
                    this.template = function (tElement, tAttrs) {
                        tAttrs[WjItemTemplate._itemTemplateProp] = tElement[0].innerHTML;
                        return '<div />';
                    };
                }
                else {
                    this.transclude = true;
                    this.template = '<div ng-transclude/>';
                }
            }
            WjItemTemplate.prototype._initControl = function (element) {
                return {};
            };
            WjItemTemplate.prototype._createLink = function () {
                return new WjItemTemplateLink();
            };
            WjItemTemplate.prototype._getMetaDataId = function () {
                return 'ItemTemplate';
            };
            WjItemTemplate._itemTemplateProp = '$__wjItemTemplate';
            WjItemTemplate._itemScopeProp = '$_itemScope';
            return WjItemTemplate;
        }(angular.WjDirective));
        var WjItemTemplateLink = (function (_super) {
            __extends(WjItemTemplateLink, _super);
            function WjItemTemplateLink() {
                _super.apply(this, arguments);
            }
            WjItemTemplateLink.prototype._initParent = function () {
                _super.prototype._initParent.call(this);
                // get column template (HTML content)
                var dynaTempl = this.tAttrs[WjItemTemplate._itemTemplateProp], ownerControl = this.parent.control, listBox = this._getListBox();
                this.itemTemplate = dynaTempl != null ? dynaTempl : angular.WjDirective._removeTransclude(this.tElement[0].innerHTML);
                listBox.formatItem.addHandler(this._fmtItem, this);
                listBox.loadingItems.addHandler(this._loadingItems, this);
                if (this.parent._isInitialized) {
                    ownerControl.invalidate();
                }
            };
            WjItemTemplateLink.prototype._destroy = function () {
                var ownerControl = this.parent && this.parent.control, listBox = this._getListBox();
                if (listBox) {
                    listBox.formatItem.removeHandler(this._fmtItem, this);
                    listBox.loadingItems.removeHandler(this._loadingItems, this);
                }
                _super.prototype._destroy.call(this);
                this._tmplLink = null;
                if (ownerControl) {
                    ownerControl.invalidate();
                }
            };
            WjItemTemplateLink.prototype._loadingItems = function (s) {
                var items = s.hostElement.getElementsByClassName('wj-listbox-item');
                for (var i = items.length - 1; i >= 0; i--) {
                    var itemEl = items[i], itemScope = itemEl[WjItemTemplate._itemScopeProp];
                    if (itemScope) {
                        itemEl[WjItemTemplate._itemScopeProp] = null;
                        itemScope.$destroy();
                    }
                }
            };
            WjItemTemplateLink.prototype._fmtItem = function (s, e) {
                if (!this._tmplLink) {
                    this._tmplLink = this.directive._$compile(
                    //'<div style="display:none">' + this.itemTemplate + '</div>');
                    '<div>' + this.itemTemplate + '</div>');
                }
                var itemEl = e.item, itemScope = this.scope.$parent.$new();
                itemEl[WjItemTemplate._itemScopeProp] = itemScope;
                itemScope['$control'] = s;
                itemScope['$item'] = e.data;
                itemScope['$itemIndex'] = e.index;
                var clonedElement = this._tmplLink(itemScope, function (clonedEl, scope) { })[0];
                //var dispose = itemScope.$watch(function (scope) {
                //    dispose();
                //    clonedElement.style.display = '';
                //});
                if (itemEl.childNodes.length === 1) {
                    itemEl.replaceChild(clonedElement, itemEl.firstChild);
                }
                else {
                    itemEl.textContent = '';
                    itemEl.appendChild(clonedElement);
                }
                var lag = 40;
                clearTimeout(this._closingApplyTimeOut);
                this._closingApplyTimeOut = setTimeout(function () {
                    if (!itemScope['$root'].$$phase) {
                        itemScope.$apply();
                    }
                }, lag);
            };
            WjItemTemplateLink._invalidateControl = function (parentControl) {
                if (parentControl) {
                    parentControl.invalidate();
                }
            };
            // Gets a ListBox control whose items are templated, it maybe the control itself or internal ListBox used by controls like
            // ComboBox.
            WjItemTemplateLink.prototype._getListBox = function () {
                var ownerControl = this.parent && this.parent.control;
                if (ownerControl) {
                    return ownerControl instanceof wijmo.input.ListBox ? ownerControl : ownerControl.listBox;
                }
                return null;
            };
            return WjItemTemplateLink;
        }(angular.WjLink));
        /**
         * AngularJS directive for the @see:Menu control.
         *
         * Use the <b>wj-menu</b> directive to add drop-down menus to your AngularJS applications.
         * Note that directive and parameter names must be formatted as lower-case with dashes
         * instead of camel-case. For example:
         *
         * <pre>&lt;p&gt;Here is a Menu control used as a value picker:&lt;/p&gt;
         * &lt;wj-menu header="Tax" value="tax"&gt;
         *   &lt;wj-menu-item value="0"&gt;Exempt&lt;/wj-menu-item&gt;
         *   &lt;wj-menu-item value=".05"&gt;5%&lt;/wj-menu-item&gt;
         *   &lt;wj-menu-item value=".1"&gt;10%&lt;/wj-menu-item&gt;
         *   &lt;wj-menu-item value=".15"&gt;15%&lt;/wj-menu-item&gt;
         * &lt;/wj-menu&gt;</pre>
         *
         * @fiddle:Wc5Mq
         *
         * This example creates three <b>Menu</b> controls. The first is used as a value picker,
         * the second uses a list of commands with parameters, and the third is a group of
         * three menus handled by an <b>itemClicked</b> function in the controller.
         *
         * The <b>wj-menu</b> directive extends @see:WjComboBox with the following attributes:
         *
         * <dl class="dl-horizontal">
         *   <dt>command-path</dt>          <dd><code>@</code> The command to be executed when the item is clicked.</dd>
         *   <dt>command-parameter-path</dt><dd><code>@</code> The name of the property that contains command parameters.</dd>
         *   <dt>header</dt>                <dd><code>@</code> The text shown on the control.</dd>
         *   <dt>is-button</dt>             <dd><code>@</code> Whether the menu should react to clicks on its header area.</dd>
         *   <dt>value</dt>                 <dd><code>@</code> The value of the selected <b>wj-menu-item</b> value property. </dd>
         *   <dt>item-clicked</dt>          <dd><code>&</code> The @see:Menu.itemClicked event handler.</dd>
         *   <dt>got-focus</dt>             <dd><code>&</code> The @see:Menu.gotFocus event handler.</dd>
         *   <dt>lost-focus</dt>            <dd><code>&</code> The @see:Menu.lostFocus event handler.</dd>
         * </dl>
         *
         *The <b>wj-menu</b> directive may contain the following child directives:
         *@see:WjMenuItem, @see:WjMenuSeparator and @see:WjItemTemplate(in case of data-bound Menu control).
         */
        var WjMenu = (function (_super) {
            __extends(WjMenu, _super);
            // Initializes a new instance of a WjMenu
            function WjMenu($compile) {
                _super.call(this, $compile);
            }
            Object.defineProperty(WjMenu.prototype, "_controlConstructor", {
                // Gets the Menu control constructor
                get: function () {
                    return wijmo.input.Menu;
                },
                enumerable: true,
                configurable: true
            });
            WjMenu.prototype._createLink = function () {
                return new WjMenuLink();
            };
            // WjMenu property map
            WjMenu.prototype._initProps = function () {
                _super.prototype._initProps.call(this);
                var self = this; // store this in closure as .apply() call overrides the reference
                var valueDesc = angular.MetaFactory.findProp('value', this._props);
                valueDesc.customHandler = function (scope, control, value, oldValue, link) {
                    self.updateControlValue(scope, control, link);
                };
            };
            WjMenu.prototype.updateControlValue = function (scope, control, link) {
                if (scope.value != null) {
                    control.selectedValue = scope.value;
                    link.directive.updateHeader(scope, control, link);
                }
            };
            // if the scope has a value, show it in the header
            WjMenu.prototype.updateHeader = function (scope, control, link) {
                control.header = scope.header || '';
                var selItem = control.selectedItem;
                if (typeof (scope.value) != 'undefined' && selItem && control.displayMemberPath) {
                    var itemLink = selItem[WjMenuItem._itemLinkProp];
                    var currentValue = itemLink ? itemLink.linkedContent.innerHTML : selItem[control.displayMemberPath];
                    if (currentValue != null) {
                        control.header += ': <b>' + currentValue + '</b>';
                    }
                }
            };
            return WjMenu;
        }(WjComboBox));
        var WjMenuLink = (function (_super) {
            __extends(WjMenuLink, _super);
            function WjMenuLink() {
                _super.apply(this, arguments);
            }
            WjMenuLink.prototype._initControl = function () {
                var self = this, control = new wijmo.input.Menu(this.directiveTemplateElement[0], {
                    itemsSource: new wijmo.collections.ObservableArray(),
                    selectedIndex: 0,
                    itemClicked: function () {
                        if (!self._safeApply(self.scope, 'value', control.selectedValue)) {
                            // this is necessary to ensure a digest after command's code was executed,
                            // because this code may change controller scope properties
                            if (!self.scope['$root'].$$phase) {
                                self.scope.$apply();
                            }
                        }
                        self.directive.updateHeader(self.scope, control, self);
                    }.bind(self),
                });
                control.listBox.formatItem.addHandler(self._fmtItem, this);
                control.listBox.loadingItems.addHandler(this._loadingItems, this);
                return control;
            };
            WjMenuLink.prototype._initialized = function () {
                this.directive.updateControlValue(this.scope, this.control, this);
            };
            WjMenuLink.prototype._fmtItem = function (s, e) {
                var itemLink = e.data[WjMenuItem._itemLinkProp];
                if (!itemLink) {
                    return;
                }
                if (!itemLink.contentLink) {
                    itemLink.contentLink = this.directive._$compile(
                    //'<div style="display:none">' + itemLink.itemTemplate + '</div>');
                    '<div>' + itemLink.itemTemplate + '</div>');
                }
                var self = this, itemEl = e.item, itemScope = itemLink.scope.$parent.$new();
                itemEl[WjMenuItem._itemScopeProp] = itemScope;
                itemScope['$control'] = this.control;
                itemScope['$item'] = e.data;
                itemScope['$itemIndex'] = e.index;
                var clonedElement = itemLink.linkedContent = itemLink.contentLink(itemScope, function (clonedEl, scope) { })[0];
                //var dispose = itemScope.$watch(function (scope) {
                //    dispose();
                //    clonedElement.style.display = '';
                //});
                if (itemEl.childNodes.length === 1) {
                    itemEl.replaceChild(clonedElement, itemEl.firstChild);
                }
                else {
                    itemEl.textContent = '';
                    itemEl.appendChild(clonedElement);
                }
                var lag = 40;
                clearTimeout(this._closingApplyTimeOut);
                this._closingApplyTimeOut = setTimeout(function () {
                    if (!itemScope['$root'].$$phase) {
                        itemScope.$apply();
                    }
                    // update header with a resolved linked content of a selected item
                    // if there is a selected item (TFS 193428)
                    if (self.control.selectedItem) {
                        self.directive.updateHeader(self.scope, self.control, self);
                    }
                }, lag);
            };
            WjMenuLink.prototype._loadingItems = function (s) {
                var items = s.hostElement.getElementsByClassName('wj-listbox-item');
                for (var i = items.length - 1; i >= 0; i--) {
                    var itemEl = items[i], itemScope = itemEl[WjMenuItem._itemScopeProp];
                    if (itemScope) {
                        itemEl[WjItemTemplate._itemScopeProp] = null;
                        itemScope.$destroy();
                    }
                }
            };
            return WjMenuLink;
        }(angular.WjLink));
        angular.WjMenuLink = WjMenuLink;
        /**
         * AngularJS directive for menu items.
         *
         * The <b>wj-menu-item</b> directive must be contained in a @see:WjMenu directive.
         * It supports the following attributes:
         *
         * <dl class="dl-horizontal">
         *   <dt>cmd</dt>       <dd><code>=</code> The function to execute in the controller
         *                      when the item is clicked.</dd>
         *   <dt>cmd-param</dt>  <dd><code>=</code> The parameter passed to the <b>cmd</b> function
         *                      when the item is clicked.</dd>
         *   <dt>value</dt>     <dd><code>=</code> The value to select when the item is clicked
         *                      (use either this or <b>cmd</b>).</dd>
         * </dl>
         *
         * The content displayed by the item may contain an arbitrary HTML fragment with AngularJS bindings and directives.
         * You can also use <b>ng-repeat</b> and <b>ng-if</b> directives to populate the items in the Menu control.
         * In addition to any properties available in a controller, the local <b>$item</b>,
         * <b>$itemIndex</b> and <b>$control</b> template variables can be used in AngularJS bindings
         * that refer to the data item, its index, and the owner control.
         */
        var WjMenuItem = (function (_super) {
            __extends(WjMenuItem, _super);
            function WjMenuItem() {
                _super.call(this);
                this.require = '^wjMenu';
                // The same approach like in WjFlexGridColumn
                this['terminal'] = true;
                if (angular.WjDirective._dynaTemplates) {
                    this.transclude = false;
                    this['priority'] = 100;
                    this.template = function (tElement, tAttrs) {
                        tAttrs[WjItemTemplate._itemTemplateProp] = tElement[0].innerHTML;
                        return '<div />';
                    };
                }
                else {
                    this.transclude = true;
                    this.template = '<div ng-transclude/>';
                }
            }
            WjMenuItem.prototype._createLink = function () {
                return new WjMenuItemLink(false);
            };
            WjMenuItem.prototype._getMetaDataId = function () {
                return 'MenuItem';
            };
            WjMenuItem.prototype._getId = function () {
                return WjMenuItem._directiveId;
            };
            WjMenuItem._itemTemplateProp = '$__wjMenuItemTemplate';
            WjMenuItem._itemScopeProp = '$_menuItemScope';
            WjMenuItem._itemLinkProp = '$_menuItemLink';
            WjMenuItem._directiveId = 'menuItemDir';
            return WjMenuItem;
        }(angular.WjDirective));
        // Used for both WjMenuItem and WjMenuSeparator
        var WjMenuItemLink = (function (_super) {
            __extends(WjMenuItemLink, _super);
            // parameter indicates whether the link is used with WjMenuItem and WjMenuSeparator.
            function WjMenuItemLink(isSeparator) {
                _super.call(this);
                this.isSeparator = isSeparator;
            }
            WjMenuItemLink.prototype._initControl = function () {
                var dynaTempl = this.tAttrs[WjItemTemplate._itemTemplateProp];
                this.itemTemplate = this.isSeparator ?
                    '<div class="wj-state-disabled" style="width:100%;height:1px;background-color:lightgray"/>' :
                    dynaTempl != null ? dynaTempl : angular.WjDirective._removeTransclude(this.tElement[0].innerHTML);
                var ret = { value: null, cmd: null, cmdParam: null, header: this.itemTemplate };
                ret[WjMenuItem._itemLinkProp] = this;
                return ret;
            };
            WjMenuItemLink.prototype._initParent = function () {
                _super.prototype._initParent.call(this);
                var ownerControl = this.parent.control;
                if (ownerControl.itemsSource.length == 1 && ownerControl.selectedIndex < 0) {
                    ownerControl.selectedIndex = 0;
                }
                if (!ownerControl.displayMemberPath) {
                    ownerControl.displayMemberPath = 'header';
                }
                if (!ownerControl.selectedValuePath) {
                    ownerControl.selectedValuePath = 'value';
                }
                if (!ownerControl.commandPath) {
                    ownerControl.commandPath = 'cmd';
                }
                if (!ownerControl.commandParameterPath) {
                    ownerControl.commandParameterPath = 'cmdParam';
                }
            };
            WjMenuItemLink.prototype._destroy = function () {
                var ownerControl = this.parent && this.parent.control;
                _super.prototype._destroy.call(this);
                if (ownerControl) {
                    ownerControl.invalidate();
                }
            };
            return WjMenuItemLink;
        }(angular.WjLink));
        /**
         * AngularJS directive for menu separators.
         *
         * The <b>wj-menu-item-separator</b> directive must be contained in a @see:WjMenu directive.
         * It adds a non-selectable separator to the menu, and has no attributes.
         */
        var WjMenuSeparator = (function (_super) {
            __extends(WjMenuSeparator, _super);
            // Initializes a new instance of a WjMenuSeparator
            function WjMenuSeparator() {
                _super.call(this);
                this.template = '<span />';
                this.require = '^wjMenu';
            }
            WjMenuSeparator.prototype._getMetaDataId = function () {
                return 'MenuSeparator';
            };
            WjMenuSeparator.prototype._createLink = function () {
                return new WjMenuItemLink(true);
            };
            WjMenuSeparator.prototype._getId = function () {
                return WjMenuItem._directiveId;
            };
            return WjMenuSeparator;
        }(angular.WjDirective));
        /**
         * AngularJS directive for context menus.
         *
         * Use the <b>wj-context-menu</b> directive to add context menus to elements
         * on the page. The wj-context-menu directive is based on the <b>wj-menu</b>
         * directive; it displays a popup menu when the user performs a context menu
         * request on an element (usually a right-click).
         *
         * The wj-context-menu directive is specified as a parameter added to the
         * element that the context menu applies to. The parameter value is a
         * selector for the element that contains the menu. For example:
         *
         * <pre>&lt;!-- paragraph with a context menu --&gt;
         *&lt;p wj-context-menu="#idMenu" &gt;
         *  This paragraph has a context menu.&lt;/p&gt;
         *
         *&lt;!-- define the context menu (hidden and with an id) --&gt;
         *&lt;wj-menu id="idMenu" ng-show="false"&gt;
         *  &lt;wj-menu-item cmd="cmdOpen" cmd-param ="1"&gt;Open...&lt;/wj-menu-item&gt;
         *  &lt;wj-menu-item cmd="cmdSave" cmd-param="2"&gt;Save &lt;/wj-menu-item&gt;
         *  &lt;wj-menu-item cmd="cmdSave" cmd-param="3"&gt;Save As...&lt;/wj-menu-item&gt;
         *  &lt;wj-menu-item cmd="cmdNew" cmd-param ="4"&gt;New...&lt;/wj-menu-item&gt;
         *  &lt;wj-menu-separator&gt;&lt;/wj-menu-separator&gt;
         *  &lt;wj-menu-item cmd="cmdExit" cmd-param="5"&gt;Exit&lt;/wj-menu-item&gt;
         *&lt;/wj-menu &gt;</pre>
         */
        var WjContextMenu = (function (_super) {
            __extends(WjContextMenu, _super);
            // Initializes a new instance of a WjContextMenu
            function WjContextMenu() {
                _super.call(this);
                this.template = undefined;
                //this.require = '^wjMenu';
                this.restrict = 'A';
                this.scope = false;
            }
            WjContextMenu.prototype._getMetaDataId = function () {
                return 'WjContextMenu';
            };
            // Gets the WjContextMenu's link function. Overrides parent member
            WjContextMenu.prototype._postLinkFn = function () {
                return function (scope, tElement, tAttrs) {
                    // get context menu and drop-down list
                    var host = wijmo.getElement(tAttrs['wjContextMenu']);
                    // show the drop-down list in response to the contextmenu command
                    tElement[0].addEventListener('contextmenu', function (e) {
                        var menu = wijmo.Control.getControl(host), dropDown = menu.dropDown;
                        if (menu && dropDown && !wijmo.closest(e.target, '[disabled]')) {
                            e.preventDefault();
                            menu.owner = tElement[0];
                            menu.selectedIndex = -1;
                            if (menu.onIsDroppedDownChanging(new wijmo.CancelEventArgs())) {
                                wijmo.showPopup(dropDown, e);
                                menu.onIsDroppedDownChanged();
                                dropDown.focus();
                            }
                        }
                    });
                };
            };
            return WjContextMenu;
        }(angular.WjDirective));
        /**
         * AngularJS directive for the @see:InputDate control.
         *
         * Use the <b>wj-input-date</b> directive to add @see:InputDate controls to your
         * AngularJS applications.
         * Note that directive and parameter names must be formatted as lower-case with dashes
         * instead of camel-case. For example:
         *
         * <pre>&lt;p&gt;Here is an InputDate control:&lt;/p&gt;
         * &lt;wj-input-date
         *   value="theDate"
         *   format="M/d/yyyy"&gt;
         * &lt;/wj-input-date&gt;</pre>
         *
         * The example below shows a <b>Date</b> value (that includes date and time information)
         * using an @see:InputDate and an @see:InputTime control. Notice how both controls
         * are bound to the same controller variable, and each edits the appropriate information
         * (either date or time). The example also shows a @see:Calendar control that can be
         * used to select the date with a single click.
         *
         * @fiddle:46PhD
         *
         * The <b>wj-input-date</b> directive supports the following attributes:
         *
         * <dl class="dl-horizontal">
         *   <dt>ng-model</dt>      <dd><code>@</code> Binds the control's <b>value</b> property using the ng-model Angular
         *                          directive. Binding the property using the ng-model directive provides standard benefits
         *                          like validation, adding the control's state to the form instance, and so on. To redefine
         *                          properties on a control that is bound by the ng-model directive, use the wj-model-property
         *                          attribute.</dd>
         *   <dt>wj-model-property</dt>  <dd><code>@</code> Specifies a control property that is bound to a scope using the <b>ng-model</b> directive.</dd>
         *   <dt>control</dt>            <dd><code>=</code> A reference to the @see:InputDate control created by this directive.</dd>
         *   <dt>format</dt>             <dd><code>@</code> The format used to display the date being edited (see @see:Globalize).</dd>
         *   <dt>mask</dt>               <dd><code>@</code> The mask used to validate the input as the user types (see @see:wijmo.input.InputMask).</dd>
         *   <dt>is-dropped-down</dt>    <dd><code>@</code> A value indicating whether the drop-down is currently visible.</dd>
         *   <dt>initialized</dt>        <dd><code>&</code> This event occurs after the binding has finished initializing the control with attribute values.</dd>
         *   <dt>is-initialized</dt>     <dd><code>=</code> A value indicating whether the binding has finished initializing the control with attribute values. </dd>
         *   <dt>max</dt>                <dd><code>@</code> The latest valid date (a string in the format "yyyy-MM-dd").</dd>
         *   <dt>min</dt>                <dd><code>@</code> The earliest valid date (a string in the format "yyyy-MM-dd").</dd>
         *   <dt>placeholder</dt>        <dd><code>@</code> The string to show as a hint when the control is empty.</dd>
         *   <dt>is-required</dt>        <dd><code>@</code> A value indicating whether to prevent null values.</dd>
         *   <dt>show-drop-down-button</dt><dd><code>@</code> A value indicating whether the control displays a drop-down button.</dd>
         *   <dt>text</dt>               <dd><code>=</code> The text to show in the control.</dd>
         *   <dt>value</dt>              <dd><code>=</code> The date being edited.</dd>
         *   <dt>got-focus</dt>          <dd><code>&</code> The @see:InputDate.gotFocus event handler.</dd>
         *   <dt>lost-focus</dt>         <dd><code>&</code> The @see:InputDate.lostFocus event handler.</dd>
         *   <dt>is-dropped-down-changing</dt> <dd><code>&</code> The @see:InputDate.isDroppedDownChanging event handler.</dd>
         *   <dt>is-dropped-down-changed </dt> <dd><code>&</code> The @see:InputDate.isDroppedDownChanged event handler.</dd>
         *   <dt>text-changed</dt>       <dd><code>&</code> The @see:InputDate.textChanged event handler.</dd>
         *   <dt>value-changed</dt>      <dd><code>&</code> The @see:InputDate.valueChanged event handler.</dd>
         * </dl>
         *
         * If provided, the <b>min</b> and <b>max</b> attributes are strings in the format
         * "yyyy-MM-dd". Technically, you can use any full date as defined in the W3C
         * <a href="http://tools.ietf.org/html/rfc3339" target="_blank">[RFC 3339]</a>, which is also
         * the format used with regular HTML5 input elements.
         */
        var WjInputDate = (function (_super) {
            __extends(WjInputDate, _super);
            function WjInputDate() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(WjInputDate.prototype, "_controlConstructor", {
                // Gets the InputDate control constructor
                get: function () {
                    return wijmo.input.InputDate;
                },
                enumerable: true,
                configurable: true
            });
            return WjInputDate;
        }(WjDropDown));
        /**
         * AngularJS directive for the @see:InputDateTime control.
         *
         * Use the <b>wj-input-date-time</b> directive to add @see:InputDateTime controls to your
         * AngularJS applications.
         * Note that directive and parameter names must be formatted as lower-case with dashes
         * instead of camel-case. For example:
         *
         * <pre>&lt;p&gt;Here is an InputDateTime control:&lt;/p&gt;
         * &lt;wj-input-date-time
         *   value="theDate"
         *   format="M/d/yyyy"&gt;
         * &lt;/wj-input-date-time&gt;</pre>
         *
         * The <b>wj-input-date-time</b> directive supports the following attributes:
         *
         * <dl class="dl-horizontal">
         *   <dt>ng-model</dt>      <dd><code>@</code> Binds the control's <b>value</b> property using the ng-model Angular
         *                          directive. Binding the property using the ng-model directive provides standard benefits
         *                          like validation, adding the control's state to the form instance, and so on. To redefine
         *                          properties on a control that is bound by the ng-model directive, use the wj-model-property
         *                          attribute.</dd>
         *   <dt>wj-model-property</dt>  <dd><code>@</code> Specifies a control property that is bound to a scope using the <b>ng-model</b> directive.</dd>
         *   <dt>control</dt>            <dd><code>=</code> A reference to the @see:InputDate control created by this directive.</dd>
         *   <dt>format</dt>             <dd><code>@</code> The format used to display the date being edited (see @see:Globalize).</dd>
         *   <dt>mask</dt>               <dd><code>@</code> The mask used to validate the input as the user types (see @see:wijmo.input.InputMask).</dd>
         *   <dt>is-dropped-down</dt>    <dd><code>@</code> A value indicating whether the drop-down is currently visible.</dd>
         *   <dt>initialized</dt>        <dd><code>&</code> This event occurs after the binding has finished initializing the control with attribute values.</dd>
         *   <dt>is-initialized</dt>     <dd><code>=</code> A value indicating whether the binding has finished initializing the control with attribute values. </dd>
         *   <dt>max</dt>                <dd><code>@</code> The latest valid date (a string in the format "yyyy-MM-dd").</dd>
         *   <dt>min</dt>                <dd><code>@</code> The earliest valid date (a string in the format "yyyy-MM-dd").</dd>
         *   <dt>placeholder</dt>        <dd><code>@</code> The string to show as a hint when the control is empty.</dd>
         *   <dt>is-required</dt>        <dd><code>@</code> A value indicating whether to prevent null values.</dd>
         *   <dt>show-drop-down-button</dt><dd><code>@</code> A value indicating whether the control displays a drop-down button.</dd>
         *   <dt>text</dt>               <dd><code>=</code> The text to show in the control.</dd>
         *   <dt>timeMax</dt>            <dd><code>@</code> The earliest valid time (a string in the format "hh:mm").</dd>
         *   <dt>timeMin</dt>            <dd><code>@</code> The latest valid time (a string in the format "hh:mm").</dd>
         *   <dt>timeStep</dt>           <dd><code>@</code> The number of minutes between entries in the drop-down list.</dd>
         *   <dt>timeFormat</dt>         <dd><code>@</code> The format sting used to show values in the time drop-down list.</dd>
         *   <dt>value</dt>              <dd><code>=</code> The date being edited.</dd>
         *   <dt>got-focus</dt>          <dd><code>&</code> The @see:InputDateTime.gotFocus event handler.</dd>
         *   <dt>lost-focus</dt>         <dd><code>&</code> The @see:InputDateTime.lostFocus event handler.</dd>
         *   <dt>is-dropped-down-changing</dt> <dd><code>&</code> The @see:InputDateTime.isDroppedDownChanging event handler.</dd>
         *   <dt>is-dropped-down-changed </dt> <dd><code>&</code> The @see:InputDateTime.isDroppedDownChanged event handler.</dd>
         *   <dt>text-changed</dt>       <dd><code>&</code> The @see:InputDateTime.textChanged event handler.</dd>
         *   <dt>value-changed</dt>      <dd><code>&</code> The @see:InputDateTime.valueChanged event handler.</dd>
         * </dl>
         */
        var WjInputDateTime = (function (_super) {
            __extends(WjInputDateTime, _super);
            function WjInputDateTime() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(WjInputDateTime.prototype, "_controlConstructor", {
                // Gets the InputDateTime control constructor
                get: function () {
                    return wijmo.input.InputDateTime;
                },
                enumerable: true,
                configurable: true
            });
            return WjInputDateTime;
        }(WjInputDate));
        /**
         * AngularJS directive for the @see:InputNumber control.
         *
         * Use the <b>wj-input-number</b> directive to add <b>InputNumber</b> controls to your
         * AngularJS applications.
         * Note that directive and parameter names must be formatted as lower-case with dashes
         * instead of camel-case. For example:
         *
         * <pre>&lt;p&gt;Here is an InputNumber control:&lt;/p&gt;
         * &lt;wj-input-number
         *   value="theNumber"
         *   min="0"
         *   max="10"
         *   format="n0"
         *   placeholder="number between zero and ten"&gt;
         * &lt;/wj-input-number&gt;</pre>
         *
         * The example below creates several <b>InputNumber</b> controls and shows the effect
         * of using different formats, ranges, and step values.
         *
         * @fiddle:u7HpD
         *
         * The <b>wj-input-number</b> directive supports the following attributes:
         *
         * <dl class="dl-horizontal">
         *   <dt>ng-model</dt>      <dd><code>@</code> Binds the control's <b>value</b> property using the ng-model Angular
         *                          directive. Binding the property using the ng-model directive provides standard benefits
         *                          like validation, adding the control's state to the form instance, and so on. To redefine
         *                          properties on a control that is bound by the ng-model directive, use the wj-model-property
         *                          attribute.</dd>
         *   <dt>wj-model-property</dt>  <dd><code>@</code> Specifies a control property that is bound to a scope using the <b>ng-model</b> directive.</dd>
         *   <dt>control</dt>       <dd><code>=</code> A reference to the @see:InputNumber control created by this directive.</dd>
         *   <dt>format</dt>        <dd><code>@</code> The format used to display the number (see @see:Globalize).</dd>
         *   <dt>input-type</dt>    <dd><code>@</code> The "type" attribute of the HTML input element hosted by the control.</dd>
         *   <dt>initialized</dt>   <dd><code>&</code> This event occurs after the binding has finished initializing the control with attribute values.</dd>
         *   <dt>is-initialized</dt><dd><code>=</code> A value indicating whether the binding has finished initializing the control with attribute values. </dd>
         *   <dt>max</dt>           <dd><code>@</code> The largest valid number.</dd>
         *   <dt>min</dt>           <dd><code>@</code> The smallest valid number.</dd>
         *   <dt>place-holder</dt>  <dd><code>@</code> The string to show as a hint when the control is empty.</dd>
         *   <dt>is-required</dt>   <dd><code>@</code> A value indicating whether to prevent null values.</dd>
         *   <dt>show-spinner</dt>  <dd><code>@</code> A value indicating whether to display spinner buttons to change the value by <b>step</b> units.</dd>
         *   <dt>step</dt>          <dd><code>@</code> The amount to add or subtract to the value when the user clicks the spinner buttons.</dd>
         *   <dt>text</dt>          <dd><code>=</code> The text to show in the control.</dd>
         *   <dt>value</dt>         <dd><code>=</code> The number being edited.</dd>
         *   <dt>got-focus</dt>     <dd><code>&</code> The @see:InputNumber.gotFocus event handler.</dd>
         *   <dt>lost-focus</dt>    <dd><code>&</code> The @see:InputNumber.lostFocus event handler.</dd>
         *   <dt>text-changed</dt>  <dd><code>&</code> The @see:InputNumber.textChanged event handler.</dd>
         *   <dt>value-changed</dt> <dd><code>&</code> The @see:InputNumber.valueChanged event handler.</dd>
         * </dl>
         */
        var WjInputNumber = (function (_super) {
            __extends(WjInputNumber, _super);
            function WjInputNumber() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(WjInputNumber.prototype, "_controlConstructor", {
                // Gets the InputNumber control constructor
                get: function () {
                    return wijmo.input.InputNumber;
                },
                enumerable: true,
                configurable: true
            });
            return WjInputNumber;
        }(angular.WjDirective));
        /**
         * AngularJS directive for the @see:InputMask control.
         *
         * Use the <b>wj-input-mask</b> directive to add @see:InputMask controls to your
         * AngularJS applications.
         * Note that directive and parameter names must be formatted as lower-case with dashes
         * instead of camel-case. For example:
         *
         * <pre>&lt;p&gt;Here is an InputMask control:&lt;/p&gt;
         * &lt;wj-input-mask
         *   mask="99/99/99"
         *   mask-placeholder="*"&gt;
         * &lt;/wj-input-mask&gt;</pre>
         *
         * The <b>wj-input-mask</b> directive supports the following attributes:
         *
         * <dl class="dl-horizontal">
         *   <dt>ng-model</dt>      <dd><code>@</code> Binds the control's <b>value</b> property using the ng-model Angular
         *                          directive. Binding the property using the ng-model directive provides standard benefits
         *                          like validation, adding the control's state to the form instance, and so on. To redefine
         *                          properties on a control that is bound by the ng-model directive, use the wj-model-property
         *                          attribute.</dd>
         *   <dt>wj-model-property</dt> <dd><code>@</code> Specifies a control property that is bound to a scope using the <b>ng-model</b> directive.</dd>
         *   <dt>control</dt>           <dd><code>=</code> A reference to the @see:InputNumber control created by this directive.</dd>
         *   <dt>initialized</dt>       <dd><code>&</code> This event occurs after the binding has finished initializing the control with attribute values.</dd>
         *   <dt>is-initialized</dt>    <dd><code>=</code> A value indicating whether the binding has finished initializing the control with attribute values. </dd>
         *   <dt>mask</dt>              <dd><code>@</code> The string mask used to format the value as the user types.</dd>
         *   <dt>prompt-char</dt>       <dd><code>@</code> A character used to show input locations within the mask.</dd>
         *   <dt>place-holder</dt>      <dd><code>@</code> The string to show as a hint when the control is empty.</dd>
         *   <dt>value</dt>             <dd><code>=</code> The string being edited.</dd>
         *   <dt>raw-value</dt>         <dd><code>=</code> The string being edited, excluding literal and prompt characters.</dd>
         *   <dt>got-focus</dt>         <dd><code>&</code> The @see:InputMask.gotFocus event handler.</dd>
         *   <dt>lost-focus</dt>        <dd><code>&</code> The @see:InputMask.lostFocus event handler.</dd>
         *   <dt>value-changed</dt>     <dd><code>&</code> The @see:InputMask.valueChanged event handler.</dd>
         * </dl>
         */
        var WjInputMask = (function (_super) {
            __extends(WjInputMask, _super);
            function WjInputMask() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(WjInputMask.prototype, "_controlConstructor", {
                // Gets the InputMask control constructor
                get: function () {
                    return wijmo.input.InputMask;
                },
                enumerable: true,
                configurable: true
            });
            return WjInputMask;
        }(angular.WjDirective));
        /**
         * AngularJS directive for the @see:InputTime control.
         *
         * Use the <b>wj-input-time</b> directive to add <b>InputTime</b> controls to your AngularJS applications.
         * Note that directive and parameter names must be formatted as lower-case with dashes
         * instead of camel-case. For example:
         *
         * <pre>&lt;p&gt;Here is an InputTime control:&lt;/p&gt;
         * &lt;wj-input-time
         *   value="theDate"
         *   format="h:mm tt"
         *   min="09:00" max="17:00"
         *   step="15"&gt;
         * &lt;/wj-input-time&gt;</pre>
         *
         * @fiddle:46PhD
         *
         * This example edits a <b>Date</b> value (that includes date and time information)
         * using an @see:InputDate and an InputTime control. Notice how both controls
         * are bound to the same controller variable, and each edits the appropriate information
         * (either date or time). The example also shows a @see:Calendar control that can be
         * used to select the date with a single click.
         *
         * The <b>wj-input-time</b> directive extends @see:WjComboBox with the following attributes:
         *
         * <dl class="dl-horizontal">
         *   <dt>ng-model</dt>      <dd><code>@</code> Binds the control's <b>value</b> property using the ng-model Angular
         *                          directive. Binding the property using the ng-model directive provides standard benefits
         *                          like validation, adding the control's state to the form instance, and so on. To redefine
         *                          properties on a control that is bound by the ng-model directive, use the wj-model-property
         *                          attribute.</dd>
         *   <dt>wj-model-property</dt><dd><code>@</code> Specifies a control property that is bound to a scope using the <b>ng-model</b> directive.</dd>
         *   <dt>control</dt>       <dd><code>=</code> A reference to the @see:InputDate control created by this directive.</dd>
         *   <dt>format</dt>        <dd><code>@</code> The format used to display the selected time.</dd>
         *   <dt>mask</dt>          <dd><code>@</code> A mask used to validate the input as the user types (see @see:InputMask).</dd>
         *   <dt>max</dt>           <dd><code>@</code> The earliest valid time (a string in the format "hh:mm").</dd>
         *   <dt>min</dt>           <dd><code>@</code> The latest valid time (a string in the format "hh:mm").</dd>
         *   <dt>step</dt>          <dd><code>@</code> The number of minutes between entries in the drop-down list.</dd>
         *   <dt>value</dt>         <dd><code>=</code> The time being edited (as a Date object).</dd>
         *   <dt>value-changed</dt> <dd><code>&</code> The@see: valueChanged event handler.</dd>
         * </dl>
         *
         * If provided, the <b>min</b> and <b>max</b> attributes are strings in the format
         * "hh:mm". Technically, you can use any full date as defined in the W3C
         * <a href="http://tools.ietf.org/html/rfc3339" target="_blank">[RFC 3339]</a>, which is also the format
         * used with regular HTML5 input elements.
         */
        var WjInputTime = (function (_super) {
            __extends(WjInputTime, _super);
            function WjInputTime($compile) {
                _super.call(this, $compile);
            }
            Object.defineProperty(WjInputTime.prototype, "_controlConstructor", {
                // Gets the InputTime control constructor
                get: function () {
                    return wijmo.input.InputTime;
                },
                enumerable: true,
                configurable: true
            });
            return WjInputTime;
        }(WjComboBox));
        /**
         * AngularJS directive for the @see:InputColor control.
         *
         * Use the <b>wj-input-color</b> directive to add @see:InputColor controls to your
         * AngularJS applications.
         * Note that directive and parameter names must be formatted as lower-case with dashes
         * instead of camel-case. For example:
         *
         * <pre>&lt;p&gt;Here is an InputColor control:&lt;/p&gt;
         * &lt;wj-input-color
         *   value="theColor"
         *   show-alpha-channel="false"&gt;
         * &lt;/wj-input-color&gt;</pre>
         *
         * The <b>wj-input-color</b> directive supports the following attributes:
         *
         * <dl class="dl-horizontal">
         *   <dt>ng-model</dt>      <dd><code>@</code> Binds the control's <b>value</b> property using the ng-model Angular
         *                          directive. Binding the property using the ng-model directive provides standard benefits
         *                          like validation, adding the control's state to the form instance, and so on. To redefine
         *                          properties on a control that is bound by the ng-model directive, use the wj-model-property
         *                          attribute.</dd>
         *   <dt>wj-model-property</dt>     <dd><code>@</code> Specifies a control property that is bound to a scope using the <b>ng-model</b> directive.</dd>
         *   <dt>control</dt>               <dd><code>=</code> A reference to the InputColor control created by this directive.</dd>
         *   <dt>is-dropped-down</dt>       <dd><code>@</code> A value indicating whether the drop-down is currently visible.</dd>
         *   <dt>initialized</dt>           <dd><code>&</code> This event occurs after the binding has finished initializing the control with attribute values.</dd>
         *   <dt>is-initialized</dt>        <dd><code>=</code> A value indicating whether the binding has finished initializing the control with attribute values. </dd>
         *   <dt>show-alpha-channel</dt>    <dd><code>@</code> A value indicating whether the drop-down displays the alpha channel (transparency) editor.</dd>
         *   <dt>placeholder</dt>           <dd><code>@</code> The string to show as a hint when the control is empty.</dd>
         *   <dt>is-required</dt>           <dd><code>@</code> A value indicating whether to prevent null values.</dd>
         *   <dt>show-drop-down-button</dt> <dd><code>@</code> A value indicating whether the control displays a drop-down button.</dd>
         *   <dt>text</dt>                  <dd><code>=</code> The text to show in the control.</dd>
         *   <dt>value</dt>                 <dd><code>=</code> The color being edited.</dd>
         *   <dt>got-focus</dt>             <dd><code>&</code> The @see:InputColor.gotFocus event handler.</dd>
         *   <dt>lost-focus</dt>            <dd><code>&</code> The @see:InputColor.lostFocus event handler.</dd>
         *   <dt>is-dropped-down-changing</dt><dd><code>&</code> The @see:InputColor.isDroppedDownChanging event handler.</dd>
         *   <dt>is-dropped-down-changed</dt><dd><code>&</code> The @see:InputColor.isDroppedDownChanged event handler.</dd>
         *   <dt>text-changed</dt>          <dd><code>&</code> The @see:InputColor.textChanged event handler.</dd>
         *   <dt>value-changed</dt>         <dd><code>&</code> The @see:InputColor.valueChanged event handler.</dd>
         * </dl>
         */
        var WjInputColor = (function (_super) {
            __extends(WjInputColor, _super);
            function WjInputColor() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(WjInputColor.prototype, "_controlConstructor", {
                // Gets the InputColor control constructor
                get: function () {
                    return wijmo.input.InputColor;
                },
                enumerable: true,
                configurable: true
            });
            return WjInputColor;
        }(WjDropDown));
        /**
         * AngularJS directive for the @see:Popup control.
         *
         * Use the <b>wj-popup</b> directive to add @see:Popup controls to your
         * AngularJS applications.
         *
         * The popup content may be specified inside the <b>wj-popup</b> tag, and can
         * contain an arbitrary HTML fragment with AngularJS bindings and directives.
         *
         * Note that directive and parameter names must be formatted as lower-case with dashes
         * instead of camel-case. For example:
         *
         * <pre>&lt;p&gt;Here is a Popup control triggered by a button:&lt;/p&gt;
         * &lt;button id="btn2" type="button"&gt;
         *     Click to show Popup
         * &lt;/button&gt;
         * &lt;wj-popup owner="#btn2" show-trigger="Click" hide-trigger="Blur"&gt;
         *     &lt;h3&gt;
         *         Salutation
         *     &lt;/h3&gt;
         *     &lt;div class="popover-content"&gt;
         *         Hello {&#8203;{firstName}} {&#8203;{lastName}}
         *     &lt;/div&gt;
         * &lt;/wj-popup&gt;</pre>
         *
         * The <b>wj-popup</b> directive supports the following attributes:
         *
         * <dl class="dl-horizontal">
         *   <dt>control</dt>         <dd><code>=</code> A reference to the Popup control created by this directive.</dd>
         *   <dt>fade-in</dt>         <dd><code>@</code> A boolean value that determines whether popups should be shown using a fade-in animation.</dd>
         *   <dt>fade-out</dt>        <dd><code>@</code> A boolean value that determines whether popups should be hidden using a fade-out animation.</dd>
         *   <dt>hide-trigger</dt>    <dd><code>@</code> A @see:PopupTrigger value defining the action that hides the @see:Popup.</dd>
         *   <dt>initialized</dt>     <dd><code>&</code> This event occurs after the binding has finished initializing the control with attribute values.</dd>
         *   <dt>is-initialized</dt>  <dd><code>=</code> A value indicating whether the binding has finished initializing the control with attribute values. </dd>
         *   <dt>owner</dt>           <dd><code>@</code> A CSS selector referencing an element that controls the popup visibility.</dd>
         *   <dt>show-trigger</dt>    <dd><code>@</code> A @see:PopupTrigger value defining the action that shows the @see:Popup.</dd>
         *   <dt>modal</dt>           <dd><code>@</code> A boolean value that determines whether the @see:Popup should be displayed as a modal dialog.</dd>
         *   <dt>got-focus</dt>       <dd><code>&</code> The @see:Popup.gotFocus event handler.</dd>
         *   <dt>lost-focus</dt>      <dd><code>&</code> The @see:Popup.lostFocus event handler.</dd>
         *   <dt>showing</dt>         <dd><code>&</code> The @see:Popup.showing event handler.</dd>
         *   <dt>shown</dt>           <dd><code>&</code> The @see:Popup.shown event handler.</dd>
         *   <dt>hiding</dt>          <dd><code>&</code> The @see:Popup.hiding event handler.</dd>
         *   <dt>hidden</dt>          <dd><code>&</code> The @see:Popup.hidden event handler.</dd>
         * </dl>
         */
        var WjPopup = (function (_super) {
            __extends(WjPopup, _super);
            function WjPopup() {
                _super.call(this);
                this.transclude = true;
                this.template = '<div ng-transclude/>';
            }
            Object.defineProperty(WjPopup.prototype, "_controlConstructor", {
                get: function () {
                    return wijmo.input.Popup;
                },
                enumerable: true,
                configurable: true
            });
            WjPopup.prototype._initProps = function () {
                _super.prototype._initProps.call(this);
                angular.MetaFactory.findProp('owner', this._props).customHandler =
                    function (scope, control, value, oldValue, link) {
                        // set modal if not specified
                        var modal = scope['modal'];
                        if (modal == null) {
                            // not specified, make it modal if it has no owner 
                            control['modal'] = value ? false : true;
                        }
                    };
            };
            return WjPopup;
        }(angular.WjDirective));
        /**
         * AngularJS directive for the @see:MultiSelect control.
         *
         * Use the <b>wj-multi-select</b> directive to add <b>MultiSelect</b> controls to your AngularJS applications.
         * Note that directive and parameter names must be formatted as lower-case with dashes
         * instead of camel-case. For example:
         *
         * <pre>&lt;p&gt;Here is a MultiSelect bound to a collection of objects:&lt;/p&gt;
         * &lt;wj-multi-select
         *     placeholder="Select Countries"
         *     items-source="ctx.items"
         *     header-format="{count} countries selected"
         *     display-Member-path="country"
         *     checked-Member-path="selected"&gt;
         * &lt;/wj-multi-select&gt;</pre>
         *
         * The <b>wj-multi-select</b> directive extends @see:WjComboBox with the following attributes:
         *
         * <dl class="dl-horizontal">
         *   <dt>checked-member-path</dt>  <dd><code>@</code> The name of the property used to control the checkboxes placed next to each item.</dd>
         *   <dt>header-format</dt>        <dd><code>@</code> The format string used to create the header content when the control has more than <b>maxHeaderItems</b> items checked.</dd>
         *   <dt>header-formatter</dt>     <dd><code>=</code> A function that gets the HTML in the control header.</dd>
         *   <dt>max-header-items</dt>     <dd><code>@</code> The maximum number of items to display on the control header.</dd>
         *   <dt>checked-items-changed</dt><dd><code>&</code> The @see:MultiSelect.checkedItemsChanged event handler.</dd>
         * </dl>
         */
        var WjMultiSelect = (function (_super) {
            __extends(WjMultiSelect, _super);
            function WjMultiSelect($compile) {
                _super.call(this, $compile);
            }
            Object.defineProperty(WjMultiSelect.prototype, "_controlConstructor", {
                // Gets the InputColor control constructor
                get: function () {
                    return wijmo.input.MultiSelect;
                },
                enumerable: true,
                configurable: true
            });
            return WjMultiSelect;
        }(WjComboBox));
        /**
         * AngularJS directive for an @see:ICollectionView navigator element.
         *
         * Use the <b>wj-collection-view-navigator</b> directive to add an element that allows users to
         * navigate through the items in an @see:ICollectionView.
         * Note that directive and parameter names must be formatted as lower-case with dashes
         * instead of camel-case. For example:
         *
         * <pre>Here is a CollectionViewNavigator:&lt;/p&gt;
         * &lt;wj-collection-view-navigator
         *   cv="myCollectionView"&gt;
         * &lt;/wj-collection-view-navigator&gt;</pre>
         *
         * @fiddle:s8tT4
         *
         * This example creates a CollectionView with 100,000 items and 20 items per page.
         * It defines a navigator to select the current page, another to select the current item,
         * and shows the data in a @see:FlexGrid.
         *
         * The <b>wj-collection-view-navigator</b> directive has a single attribute:
         *
         * <dl class="dl-horizontal">
         *   <dt>cv</dt>  <dd><code>=</code> A reference to the @see:ICollectionView object to navigate.</dd>
         * </dl>
         */
        var WjCollectionViewNavigator = (function (_super) {
            __extends(WjCollectionViewNavigator, _super);
            // Initializes a new instance of a WjCollectionViewNavigator
            function WjCollectionViewNavigator() {
                _super.call(this);
                this.template = '<div class="wj-control wj-content wj-pager">' +
                    '<div class="wj-input-group">' +
                    '<span class="wj-input-group-btn">' +
                    '<button class="wj-btn wj-btn-default" type="button"' +
                    ' ng-click="cv.moveCurrentToFirst()"' +
                    ' ng-disabled="cv.currentPosition <= 0">' +
                    '<span class="wj-glyph-left" style="margin-right:-4px"></span>' +
                    '<span class="wj-glyph-left"></span>' +
                    ' </button>' +
                    '</span>' +
                    '<span class="wj-input-group-btn">' +
                    ' <button class="wj-btn wj-btn-default" type="button"' +
                    ' ng-click="cv.moveCurrentToPrevious()"' +
                    ' ng-disabled="cv.currentPosition <= 0">' +
                    '<span class="wj-glyph-left"></span>' +
                    ' </button>' +
                    '</span>' +
                    '<input type="text" class="wj-form-control" value="' +
                    ' {{cv.currentPosition + 1 | number}} / {{cv.itemCount | number}}' +
                    ' " disabled />' +
                    '<span class="wj-input-group-btn">' +
                    '<button class="wj-btn wj-btn-default" type="button"' +
                    ' ng-click="cv.moveCurrentToNext()"' +
                    ' ng-disabled="cv.currentPosition >= cv.itemCount - 1">' +
                    '<span class="wj-glyph-right"></span>' +
                    '</button>' +
                    '</span>' +
                    '<span class="wj-input-group-btn">' +
                    '<button class="wj-btn wj-btn-default" type="button"' +
                    ' ng-click="cv.moveCurrentToLast()"' +
                    ' ng-disabled="cv.currentPosition >= cv.itemCount - 1">' +
                    '<span class="wj-glyph-right"></span>' +
                    '<span class="wj-glyph-right" style="margin-left:-4px"></span>' +
                    '</button>' +
                    '</span>' +
                    '</div>' +
                    '</div>';
            }
            WjCollectionViewNavigator.prototype._getMetaDataId = function () {
                return 'CollectionViewNavigator';
            };
            // Gets the WjCollectionViewNavigator directive's link function. Overrides parent member
            WjCollectionViewNavigator.prototype._postLinkFn = function () {
                return function (scope, tElement, tAttrs, dropDownController) {
                };
            };
            return WjCollectionViewNavigator;
        }(angular.WjDirective));
        /**
         * AngularJS directive for an @see:ICollectionView pager element.
         *
         * Use the <b>wj-collection-view-pager</b> directive to add an element that allows users to
         * navigate through the pages in a paged @see:ICollectionView.
         * Note that directive and parameter names must be formatted as lower-case with dashes
         * instead of camel-case. For example:
         *
         * <pre>Here is a CollectionViewPager:&lt;/p&gt;
         * &lt;wj-collection-view-pager
         *   cv="myCollectionView"&gt;
         * &lt;/wj-collection-view-pager&gt;</pre>
         *
         * @fiddle:s8tT4
         *
         * This example creates a CollectionView with 100,000 items and 20 items per page.
         * It defines a navigator to select the current page, another to select the current item,
         * and shows the data in a @see:FlexGrid.
         *
         * The <b>wj-collection-view-pager</b> directive has a single attribute:
         *
         * <dl class="dl-horizontal">
         *   <dt>cv</dt>  <dd><code>=</code> A reference to the paged @see:ICollectionView object to navigate.</dd>
         * </dl>
         */
        var WjCollectionViewPager = (function (_super) {
            __extends(WjCollectionViewPager, _super);
            // Initializes a new instance of a WjCollectionViewPager
            function WjCollectionViewPager() {
                _super.call(this);
                this.template = '<div class="wj-control wj-content wj-pager">' +
                    '<div class="wj-input-group">' +
                    '<span class="wj-input-group-btn">' +
                    '<button class="wj-btn wj-btn-default" type="button"' +
                    'ng-click="cv.moveToFirstPage()"' +
                    'ng-disabled="cv.pageIndex <= 0">' +
                    '<span class="wj-glyph-left" style="margin-right:-4px"></span>' +
                    '<span class="wj-glyph-left"></span>' +
                    '</button>' +
                    '</span>' +
                    '<span class="wj-input-group-btn">' +
                    '<button class="wj-btn wj-btn-default" type="button"' +
                    'ng-click="cv.moveToPreviousPage()"' +
                    'ng-disabled="cv.pageIndex <= 0">' +
                    '<span class="wj-glyph-left"></span>' +
                    '</button>' +
                    '</span>' +
                    '<input type="text" class="wj-form-control" value="' +
                    '{{cv.pageIndex + 1 | number}} / {{cv.pageCount | number}}' +
                    '" disabled />' +
                    '<span class="wj-input-group-btn">' +
                    '<button class="wj-btn wj-btn-default" type="button"' +
                    'ng-click="cv.moveToNextPage()"' +
                    'ng-disabled="cv.pageIndex >= cv.pageCount - 1">' +
                    '<span class="wj-glyph-right"></span>' +
                    '</button>' +
                    '</span>' +
                    '<span class="wj-input-group-btn">' +
                    '<button class="wj-btn wj-btn-default" type="button"' +
                    'ng-click="cv.moveToLastPage()"' +
                    'ng-disabled="cv.pageIndex >= cv.pageCount - 1">' +
                    '<span class="wj-glyph-right"></span>' +
                    '<span class="wj-glyph-right" style="margin-left:-4px"></span>' +
                    '</button>' +
                    '</span>' +
                    '</div>' +
                    '</div>';
            }
            WjCollectionViewPager.prototype._getMetaDataId = function () {
                return 'CollectionViewPager';
            };
            // Gets the WjCollectionViewPager directive's link function. Overrides parent member
            WjCollectionViewPager.prototype._postLinkFn = function () {
                return function (scope, tElement, tAttrs, dropDownController) {
                };
            };
            return WjCollectionViewPager;
        }(angular.WjDirective));
    })(angular = wijmo.angular || (wijmo.angular = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.angular.input.js.map