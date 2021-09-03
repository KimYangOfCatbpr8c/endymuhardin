/**
 * Contains KnockoutJS bindings for the Wijmo controls.
 *
 * The bindings allow you to add Wijmo controls to
 * <a href="http://knockoutjs.com/" target="_blank">KnockoutJS</a>
 * applications using simple markup in HTML pages.
 *
 * To add a Wijmo control to a certain place in a page's markup, add the <b>&lt;div&gt;</b> 
 * element and define a binding for the control in the <b>data-bind</b> attribute.
 * The binding name corresponds to the control name with a wj prefix. For example, the @see:wjInputNumber 
 * binding represents the Wijmo @see:InputNumber control. The binding value is an object literal containing 
 * properties corresponding to the control's read-write property and event names, with their values defining 
 * the corresponding control property values and event handlers.
 *
 * The following markup creates a Wijmo <b>InputNumber</b> control with the <b>value</b> property bound to the 
 * view model's <b>theValue</b> property, the <b>step</b> property set to 1 and the <b>inputType</b> property set to 'text':
 *
 * <pre>&lt;div data-bind="wjInputNumber: { value: theValue, step: 1, inputType: 'text' }"&gt;&lt;/div&gt;</pre>
 * 
 * <h3>Custom elements</h3>
 * As an alternative to the standard Knockout binding syntax, the Wijmo for Knockout provides a possibility to declare controls 
 * in the page markup as custom elements, where the tag name corresponds to the control binding name and the attribute names 
 * correspond to the control property names. The element and parameter names must be formatted as lower-case with dashes instead 
 * of camel-case. The control in the example above can be defined as follows using the custom element syntax:
 * 
 * <pre>&lt;wj-input-number value="theValue" step="1" input-type="'text'"&gt;&lt;/wj-input-number&gt;</pre>
 * 
 * Note that attribute values should be defined using exactly the same JavaScript expressions syntax as you use in 
 * data-bind definitions. The Wijmo for Knockout preprocessor converts such elements to the conventional data-bind form, 
 * see the <b>Custom elements preprocessor</b> topic for more details.
 * 
 * <h3>Binding to control properties</h3>
 * Wijmo binding for KnockoutJS supports binding to any read-write properties on the control. You can assign any 
 * valid KnockoutJS expressions (e.g. constants, view model observable properties, or complex expressions) to the 
 * property. 
 *
 * Most of the properties provide one-way binding, which means that changes in the bound observable view model 
 * property cause changes in the control property that the observable is bound to, but not vice versa. 
 * But some properties support two-way binding, which means that changes made in the control property are 
 * propagated back to an observable bound to the control property as well. Two-way bindings are used for properties 
 * that can be changed by the control itself, by user interaction with the control, 
 * or by other occurences. For example, the InputNumber control provides two-way binding for the 
 * <b>value</b> and <b>text</b> properties, which are changed by the control while a user is typing a new value. 
 * The rest of the InputNumber properties operate in the one-way binding mode.
 * 
 * <h3>Binding to control events</h3>
 * To attach a handler to a control event, specify the event name as a property of the object literal defining 
 * the control binding, and the function to call on this event as a value of this property. 
 * Wijmo bindings follow the same rules for defining an event handler as used for the intrinsic KnockoutJS bindings 
 * like <b>click</b> and <b>event</b>. The event handler receives the following set of parameters, in the specified order:
 * <ul>
 * 	<li><b>data:</b> The current model value, the same as for native KnockoutJS bindings like <b>click</b> and <b>event</b>. </li>
 * 	<li><b>sender:</b> The sender of the event. </li>
 * 	<li><b>args:</b> The event arguments. </li>
 * </ul>
 * 
 * The following example creates an <b>InputNumber</b> control and adds an event handler for the <b>valueChanged</b>
 * event showing a dialog with a new control value.
 *
 * <pre>&lt;!-- HTML --&gt;
 * &lt;div data-bind="wjInputNumber: { value: theValue, step: 1, valueChanged: valueChangedEH }"&gt;&lt;/div&gt;
 * &nbsp;
 * //View Model
 * this.valueChangedEH = function (data, sender, args) {
 *     alert('The new value is: ' + sender.value);
 * }</pre>
 * 
 * The same control defined using the custom element syntax:
 * 
 * <pre>&lt;wj-input-number value="theValue" step="1" value-changed="valueChangedEH"&gt;&lt;/wj-input-number&gt;</pre>
 * 
 * <h3>Binding to undefined observables</h3>
 * View model observable properties assigned to an <i>undefined</i> value get special treatment by Wijmo 
 * bindings during the initialization phase. For example, if you create an observable as ko.observable(undefined) 
 * or ko.observable() and bind it to a control property, Wijmo does not assign a value to the control. Instead,  
 * for properties supporting two-way bindings, this is the way to initialize the observable with the control's 
 * default value, because after initialization the control binding updates bound observables with the control 
 * values of such properties. Note that an observable with a <i>null</i> value, e.g. ko.observable(null), gets 
 * the usual treatment and assigns null to the control property that it is bound to. After the primary 
 * initialization has finished, observables with undefined values go back to getting the usual treatment from 
 * Wijmo, and assign the control property with undefined.
 *
 * In the example below, the <b>value</b> property of the <b>InputNumber</b> control has its default value of 0
 * after initialization, and this same value is assigned to the view model <b>theValue</b> property:
 * <pre>&lt;!-- HTML --&gt;
 * &lt;div data-bind="wjInputNumber: { value: theValue }"&gt;&lt;/div&gt;
 * &nbsp;
 * //View Model
 * this.theValue = ko.observable();</pre>
 *
 * <h3>Defining complex and array properties</h3>
 * Some Wijmo controls have properties that contain an array or a complex object. For example, the 
 * @see:FlexChart control exposes <b>axisX</b> and <b>axisY</b> properties that represent an @see:Axis object; 
 * and the <b>series</b> property is an array of @see:Series objects. Wijmo provides special 
 * bindings for such types that we add to child elements of the control element. If the control exposes
 * multiple properties of the same complex type, then the <b>wjProperty</b> property of the complex 
 * type binding specifies which control property it defines. 
 *
 * The following example shows the markup used to create a <b>FlexChart</b> with <b>axisX</b> and <b>axisY</b> 
 * properties and two series objects defined:
 *
 * <pre>&lt;div data-bind="wjFlexChart: { itemsSource: data, bindingX: 'country' }"&gt;
 *     &lt;div data-bind="wjFlexChartAxis: { wjProperty: 'axisX', title: chartProps.titleX }"&gt;&lt;/div&gt;
 *     &lt;div data-bind="wjFlexChartAxis: { wjProperty: 'axisY', title: chartProps.titleY }"&gt;&lt;/div&gt;
 *     &lt;div data-bind="wjFlexChartSeries: { name: 'Sales', binding: 'sales' }"&gt;&lt;/div&gt;
 *     &lt;div data-bind="wjFlexChartSeries: { name: 'Downloads', binding: 'downloads' }"&gt;&lt;/div&gt;
 * &lt;/div&gt;</pre>
 *
 * The same control defined using the custom element syntax:
 * 
 * <pre>&lt;wj-flex-chart items-source="data" binding-x="'country'"&gt;
 *     &lt;wj-flex-chart-axis wj-property="'axisX'" title="chartProps.titleX"&gt;&lt;/wj-flex-chart-axis&gt;
 *     &lt;wj-flex-chart-axis wj-property="'axisY'" title="chartProps.titleY"&gt;&lt;/wj-flex-chart-axis&gt;
 *     &lt;wj-flex-chart-series name="'Sales'" binding"'sales'"&gt;&lt;/wj-flex-chart-series&gt;
 *     &lt;wj-flex-chart-series name="'Downloads'" binding"'downloads'"&gt;&lt;/wj-flex-chart-series&gt;
 * &lt;/wj-flex-chart&gt;</pre>
 * 
 * <h3>The <b>control</b> property </h3>
 * Each Wijmo control binding exposes a <b>control</b> property that references the Wijmo control instance created 
 * by the binding. This allows you to reference the control in view model code or in other bindings.
 *  
 * For example, the following markup creates a @see:FlexGrid control whose reference is stored in the <b>flex</b> 
 * observable property of a view model and is used in the button click event handler to move to the next grid record:
 *
 * <pre>&lt;!-- HTML --&gt;
 * &lt;div data-bind="'wjFlexGrid': { itemsSource: data, control: flex }"&gt;&lt;/div&gt;
 * &lt;button data-bind="click: moveToNext"&gt;Next&lt;/button&gt;
 * &nbsp;
 * //View Model
 * this.flex = ko.observable();
 * this.moveToNext = function () {
 *     this.flex().collectionView.moveCurrentToNext();
 * }</pre>
 *
 * <h3>The <b>initialized</b> event</h3>
 * Each Wijmo control binding exposes an <b>initialized</b> event and a Boolean <b>isInitialized</b> 
 * property. The event occurs right after the binding creates the control and fully initializes it 
 * with the values specified in the binding attributes. For bindings containing child bindings, for 
 * example, a <b>wjFlexGrid</b> with child <b>wjFlexGridColumn</b> bindings, this also means that 
 * child bindings have fully initialized and have been applied to the control represented by the 
 * parent binding. The isInitialized property is set to true right before triggering the initialized 
 * event. You can bind a view model observable property to the binding’s <b>isInitialized</b> property 
 * to access its value.
 *
 * The following example adjusts FlexGridColumn formatting after the control fully initializes with its 
 * bindings, which guarantees that these formats are not overwritten with formats defined in the bindings:
 * 
 * <pre>&lt;!-- HTML --&gt;
 * &lt;div data-bind="'wjFlexGrid': { itemsSource: dataArray, initialized: flexInitialized }"&gt;
 *      &lt;div data-bind="wjFlexGridColumn: { binding: 'sales', format: 'n2' }"&gt;&lt;/div&gt;
 *      &lt;div data-bind="wjFlexGridColumn: { binding: 'downloads', format: 'n2' }"&gt;&lt;/div&gt;
 * &lt;/div&gt;
 * &nbsp;
 * //View Model
 * this.flexInitialized = function (data, sender, args) {
 *     var columns = sender.columns;
 *     for (var i = 0; i &lt; columns.length; i++) {
 *         if (columns[i].dataType = wijmo.DataType.Number) {
 *             columns[i].format = 'n0’;
 *         }
 *     }
 * }</pre>
 *
 * <h3 id="custom_elem_preproc">Custom elements preprocessor</h3>
 * The Wijmo Knockout preprocessor uses the standard Knockout <a target="_blank" 
 * href="http://knockoutjs.com/documentation/binding-preprocessing.html">ko.bindingProvider.instance.preprocessNode</a> 
 * API. This may cause problems in cases where other custom preprocessors are used on the same page, because Knockout 
 * offers a single instance property for attaching a preprocessor function, and the next registering preprocessor 
 * removes the registration of the previous one.
 * 
 * To honor another attached preprocessor, the Wijmo Knockout preprocessor stores the currently registered preprocessor 
 * during initialization and delegates the work to it in cases where another processing node is not recognized 
 * as a Wijmo control element, thus organizing a preprocessor stack. But if you register another preprocessor 
 * after the Wijmo for Knockout preprocessor (that is, after the &lt;script&gt; reference to the <b>wijmo.knockout.js</b> 
 * module is executed) then you need to ensure that the other preprocessor behaves in a similar way; 
 * otherwise, the Wijmo Knockout preprocessor is disabled.
 * 
 * If you prefer to disable the Wijmo Knockout preprocessor, set the <b>wijmo.disableKnockoutTags</b> property 
 * to false before the <b>wijmo.knockout.js</b> module reference and after the references to the core Wijmo 
 * modules, for example:
 * 
 * <pre>&lt;script src="scripts/wijmo.js"&gt;&lt;/script&gt;
 * &lt;script src="scripts/wijmo.input.js"&gt;&lt;/script&gt;
 * &lt;script&gt;
 *     wijmo.disableKnockoutTags = true;
 * &lt;/script&gt;
 * &lt;script src="scripts/wijmo.knockout.js"&gt;&lt;/script&gt;</pre>
 *
 * Note that in this case you can use only the conventional data-bind syntax for adding Wijmo controls to the page 
 * markup; the Wijmo custom elements are not recognized.
 */
module wijmo.knockout {

    // Represents a base class for Wijmo custom bindings. Technically corresponds to an object assigning to ko.bindingHandlers
    // in order to register a custom binding. Represents a Wijmo control or a child object like FlexGrid Column.
    // This is a singleton class. For each tag that uses the custom binding it creates a separate WjContext class instance
    // that services lifetime of the control created for the tag.
    export class WjBinding implements KnockoutBindingHandler {

        // Defines html element property name used to store WjContext object associated with the element.
        static _wjContextProp = '__wjKoContext';
        // The name of the nested binding attribute defining a parent property name to assign to.
        static _parPropAttr = 'wjProperty';
        // The name of the attribute providing the reference to the control.
        static _controlPropAttr = 'control';
        // Name of the attribute that provides the 'initialized' state value.
        static _initPropAttr = 'isInitialized';
        // Name of the attribute representing the 'initialized' event.
        static _initEventAttr = 'initialized';

        // Stores the binding metadata.
        _metaData: wj.interop.MetaDataBase;
        // #region Native API
        //options: any;
        init = function (element: any, valueAccessor: () => any, allBindings: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext): any {
            this.ensureMetaData();
            //if (!this._metaData) {
            //    this._metaData = MetaFactory.getMetaData(this._getMetaDataId());
            //    this._initialize();
            //    this._metaData.prepare();
            //}
            return (<WjBinding>this)._initImpl(element, valueAccessor, allBindings, viewModel, bindingContext);
        }.bind(this);

        update = function (element: any, valueAccessor: () => any, allBindings: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext): void {
            //console.log('#' + this['__DebugID'] + ' WjBinding.update');
            (<WjBinding>this)._updateImpl(element, valueAccessor, allBindings, viewModel, bindingContext);
        }.bind(this);
        // #endregion Native API

        // Call this method to ensure that metadata is loaded.
        // DO NOT OVERRIDE this method; instead, override the _initialize method to customize metedata.
        ensureMetaData() {
            if (!this._metaData) {
                this._metaData = MetaFactory.getMetaData(this._getMetaDataId());
                this._initialize();
                this._metaData.prepare();
            }
        }

        // Override this method to initialize the binding settings. Metadata is already loaded when this method is invoked.
        _initialize() {
        }

        _getControlConstructor(): any {
            return null;
        }

        // Gets the metadata ID, see the wijmo.interop.getMetaData method description for details.
        _getMetaDataId(): any {
            return this._getControlConstructor();
        }
        _createControl(element: any): any {
            var ctor = this._getControlConstructor();
            return new ctor(element);
        }

        _createWijmoContext(): WjContext {
            return new WjContext(this);
        }

        // Indicates whether this binding can operate as a child binding.
        _isChild(): boolean {
            return this._isParentInitializer() || this._isParentReferencer();
        }

        // Indicates whether this binding operates as a child binding that initializes a property of its parent.
        _isParentInitializer(): boolean {
            return this._metaData.parentProperty != undefined;
        }

        // Indicates whether this binding operates as a child binding that references a parent in its property or
        // a constructor.
        _isParentReferencer(): boolean {
            return this._metaData.parentReferenceProperty != undefined;
        }

        private _initImpl(element: any, valueAccessor: () => any, allBindings: KnockoutAllBindingsAccessor,
            viewModel: any, bindingContext: KnockoutBindingContext): any {
            var wjContext = this._createWijmoContext();
            element[WjBinding._wjContextProp] = wjContext;
            wjContext.element = element;
            if (this._isChild()) {
                wjContext.parentWjContext = element.parentElement[WjBinding._wjContextProp];
            }
            wjContext.valueAccessor = valueAccessor;
            wjContext.allBindings = allBindings;
            wjContext.viewModel = viewModel;
            wjContext.bindingContext = bindingContext;
            return wjContext.init(element, valueAccessor, allBindings, viewModel, bindingContext);
        }

        private _updateImpl = function (element: any, valueAccessor: () => any, allBindings: KnockoutAllBindingsAccessor, viewModel: any,
            bindingContext: KnockoutBindingContext): void {
            (<WjContext>(element[WjBinding._wjContextProp])).update(element, valueAccessor, allBindings, viewModel, bindingContext);
        }

    } 

    // Represents a context of WjBinding for a specific tag instance (similar to WjLink in Angular).
    export class WjContext {
        element: any;
        valueAccessor: any;
        allBindings: any;
        viewModel: any;
        bindingContext: any;
        control: any; 
        wjBinding: WjBinding;
        parentWjContext: WjContext;

        private _parentPropDesc: ComplexPropDesc;
        private _isInitialized: boolean = false;
        private static _debugId = 0;

        constructor(wjBinding: WjBinding) {
            this.wjBinding = wjBinding;
        }

        init(element: any, valueAccessor: () => any, allBindings: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext): any {
            var lastAccessor = valueAccessor(),
                props = this.wjBinding._metaData.props,
                events = this.wjBinding._metaData.events;

            if (this._isChild()) {
                var propObs = lastAccessor[WjBinding._parPropAttr],
                    meta = this.wjBinding._metaData,
                    parPropName = propObs && ko.unwrap(propObs) || meta.parentProperty;
                this._parentPropDesc = MetaFactory.findComplexProp(parPropName, this.parentWjContext.wjBinding._metaData.complexProps)
                    || new ComplexPropDesc(parPropName, meta.isParentPropertyArray, meta.ownsObject);
            }
            this._initControl();
            this._safeUpdateSrcAttr(WjBinding._controlPropAttr, this.control);
            //Debug stuff
            //this.control.__DebugID = ++WjContext._debugId;
            //this['__DebugID'] = WjContext._debugId;

            // Initialize children right after control was created but before its properties was assigned with defined bindings.
            // This will allow to correctly apply properties like value or selectedIndex to controls like Menu whose child bindings
            // create an items source, so the mentioned properties will be assigned after collection has created.
            ko.applyBindingsToDescendants(bindingContext, element);

            this._childrenInitialized();


            for (var eIdx in events) {
                this._addEventHandler(events[eIdx]);
            }

            this._updateControl(valueAccessor /* , this.control, props */ );
            // Re-evaluate 'control' binding 
            // in order to simplify bindings to things like control.subProperty (e.g. flexGrid.collectionView).
            this._safeNotifySrcAttr(WjBinding._controlPropAttr);
            this._updateSource();
            this._isInitialized = true;
            this._safeUpdateSrcAttr(WjBinding._initPropAttr, true);
            var evObs = lastAccessor[WjBinding._initEventAttr];
            if (evObs) {
                ko.unwrap(evObs)(this.bindingContext['$data'], this.control, undefined);
            }

            return { controlsDescendantBindings: true };
        }

        update(element: any, valueAccessor: () => any, allBindings: KnockoutAllBindingsAccessor, viewModel: any, bindingContext: KnockoutBindingContext): void {
            this.valueAccessor = valueAccessor;
            this._updateControl(valueAccessor);
        }

        _createControl(): any {
            return this.wjBinding._createControl(this._parentInCtor() ? this.parentWjContext.control : this.element);
        }

        // Initialize the 'control' property, by creating a new or using the parent's object in case of child binding not owning
        // the object.
        // Override this method to perform custom initialization before or after control creation. The 'control' property is
        // undefined before this method call and defined on exit from this method.
        _initControl() {
            if (this._isChild()) {
                this.element.style.display = 'none';
                var parProp = this._getParentProp(),
                    parCtrl = this.parentWjContext.control;
                if (this._useParentObj()) {
                    this.control = parCtrl[parProp];
                }
                else {
                    var ctrl = this.control = this._createControl();
                    if (this._isParentInitializer()) {
                        if (this._isParentArray()) {
                            (<any[]>parCtrl[parProp]).push(ctrl);
                        }
                        else {
                            parCtrl[parProp] = ctrl;
                        }
                    }
                    if (this._isParentReferencer() && !this._parentInCtor()) {
                        ctrl[this._getParentReferenceProperty()] = parCtrl;
                    }
                }
            }
            else
                this.control = this._createControl();
        }

        _childrenInitialized() {
        }

        private _addEventHandler(eventDesc: EventDesc) {
            this.control[eventDesc.eventName].addHandler(
                (s, e) => {
                    this._updateSource();
                    var evObs = this.valueAccessor()[eventDesc.eventName];
                    if (evObs) {
                        ko.unwrap(evObs)(this.bindingContext['$data'], s, e);
                    }
                }, this);
        }

        private static _isUpdatingSource = false;
        private static _pendingSourceUpdates: WjContext[] = [];
        _updateSource() {
            WjContext._isUpdatingSource = true;
            try {
                var props = this.wjBinding._metaData.props;
                for (var idx in props) {
                    var propDesc = props[idx],
                        propName = propDesc.propertyName;
                    if (propDesc.shouldUpdateSource && propDesc.isNativeControlProperty) {
                        this._safeUpdateSrcAttr(propName, this.control[propName]);
                    }
                }
            }
            finally {
                WjContext._isUpdatingSource = false;
                while (WjContext._pendingSourceUpdates.length > 0) {
                    var wjCont = WjContext._pendingSourceUpdates.shift();
                    wjCont._updateControl();
                }
            }
        }

        private _isUpdatingControl = false;
        private _isSourceDirty = false;
        private _oldSourceValues = {};
        private _updateControl(valueAccessor = this.valueAccessor) {
            //console.log('#' + this['__DebugID'] + '_updateControl');
            var valSet = valueAccessor(),
                props = <PropDesc[]>this.wjBinding._metaData.props;
            if (WjContext._isUpdatingSource) {
                if (WjContext._pendingSourceUpdates.indexOf(this) < 0) {
                    WjContext._pendingSourceUpdates.push(this);
                }

                // IMPORTANT: We need to read all bound observable; otherwise, the update will never be called anymore !!!
                for (var i in props) {
                    ko.unwrap(valSet[props[i].propertyName]);
                }
                return;
            }
            try {
                var valArr = [],
                    propArr: PropDesc[] = [];
                // Collect properties/values changed since the last update.
                for (var i in props) {
                    var prop = props[i],
                        propName = prop.propertyName,
                        valObs = valSet[propName];
                    if (valObs !== undefined) {
                        var val = ko.unwrap(valObs);
                        if (val !== this._oldSourceValues[propName]) {
                            this._oldSourceValues[propName] = val;
                            valArr.push(val);
                            propArr.push(prop);
                        }
                    }
                }
                for (var i in valArr) {
                    var prop = propArr[i],
                        val = ko.unwrap(valSet[prop.propertyName]),
                        propName = prop.propertyName;
                    if (val !== undefined || this._isInitialized) {
                        var castedVal = this._castValueToType(val, prop);
                        if (!(prop.updateControl && prop.updateControl(this, prop, this.control, val, castedVal)) &&
                            prop.isNativeControlProperty) {
                            if (this.control[propName] != castedVal) {
                                this.control[propName] = castedVal;
                            }
                        }
                    }
                }
            }
            finally {
                //this._isUpdatingControl = false;
            }

        }

        // Casts value to the property type
        private _castValueToType(value: any, prop: PropDesc) {
            return prop.castValueToType(value);

            //if (value == undefined) {
            //    //return undefined;
            //    return value;
            //}

            //var type = prop.propertyType;
            //switch (type) {
            //    case wijmo.interop.PropertyType.Number:
            //        if (typeof value == 'string') {
            //            if (value.indexOf('*') >= 0) { // hack for star width ('*', '2*'...)
            //                return value;
            //            }
            //            if (value.trim() === '') { // binding to an empty html input means null
            //                return null;
            //            }
            //        }
            //        return +value; // cast to number
            //    case wijmo.interop.PropertyType.Boolean:
            //        if (value === 'true') {
            //            return true;
            //        }
            //        if (value === 'false') {
            //            return false;
            //        }
            //        return !!value; // cast to bool
            //    case wijmo.interop.PropertyType.String:
            //        return value + ''; // cast to string
            //    case wijmo.interop.PropertyType.Date:
            //        return this._parseDate(value);
            //    case wijmo.interop.PropertyType.Enum:
            //        if (typeof value === 'number') {
            //            return value;
            //        }
            //        return prop.enumType[value];
            //    default:
            //        return value;
            //}
        }

        // Parsing DateTime values from string
        //private _parseDate(value) {
        //    if (value && wijmo.isString(value)) {

        //        // For by-val attributes Angular converts a Date object to a
        //        // string wrapped in quotation marks, so we strip them.
        //        value = value.replace(/["']/g, '');

        //        // parse date/time using RFC 3339 pattern
        //        var dt = changeType(value, DataType.Date, 'r');
        //        if (isDate(dt)) {
        //            return dt;
        //        }
        //    }
        //    return value;
        //}

        // Update source attribute if possible (if it's defined and is a writable observable or a non-observable)
        _safeUpdateSrcAttr(attrName: string, value: any) {
            var ctx = this.valueAccessor();
            var attrObs = ctx[attrName];
            if ((<any>ko).isWritableObservable(attrObs)) {
                var val = ko.unwrap(attrObs);
                if (value != val) {
                    attrObs(value);
                }
            }
        }
        _safeNotifySrcAttr(attrName: string) {
            var ctx = this.valueAccessor();
            var attrObs = ctx[attrName];
            if ((<any>ko).isWritableObservable(attrObs) && attrObs.valueHasMutated) {
                attrObs.valueHasMutated();
            }
        }

        //Determines whether this is a child link.
        private _isChild(): boolean {
            return this.wjBinding._isChild();
        }
        // Indicates whether this link operates as a child link that initializes a property of its parent.
        private _isParentInitializer(): boolean {
            return this.wjBinding._isParentInitializer();
        }

        // Indicates whether this link operates as a child link that references a parent in its property or
        // a constructor.
        private _isParentReferencer(): boolean {
            return this.wjBinding._isParentReferencer();
        }

        //For the child directives returns parent's property name that it services. Property name defined via
        //the wjProperty attribute of directive tag has priority over the directive._property definition.
        //IMPORTANT: functionality is based on _parentPropDesc
        private _getParentProp(): string {
            return this._isParentInitializer() ? this._parentPropDesc.propertyName : undefined;
        }
        // For a child directive, the name of the property of the directive's underlying object that receives the reference
        // to the parent, or an empty string that indicates that the reference to the parent should be passed as the 
        // underlying object's constructor parameter.
        private _getParentReferenceProperty(): string {
            return this.wjBinding._metaData.parentReferenceProperty;
        }

        // Determines whether the child link uses an object created by the parent property, instead of creating it by
        // itself, and thus object's initialization should be delayed until parent link's control is created.
        //IMPORTANT: functionality is based on _parentPropDesc
        private _useParentObj(): boolean {
            //return this._isChild() && !this._parentPropDesc.isArray && !this._parentPropDesc.ownsObject;
            return !this._isParentReferencer() &&
                this._isParentInitializer() && !this._parentPropDesc.isArray && !this._parentPropDesc.ownsObject;
        }

        // For the child link, determines whether the servicing parent property is an array.
        //IMPORTANT: functionality is based on _parentPropDesc
        private _isParentArray() {
            return this._parentPropDesc.isArray;
        }

        // For the child referencer directive, indicates whether the parent should be passed as a parameter the object
        // constructor.
        private _parentInCtor(): boolean {
            return this._isParentReferencer() && this._getParentReferenceProperty() == '';
        }

    }


} //end of module

