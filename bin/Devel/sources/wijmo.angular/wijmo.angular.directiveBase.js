//
// AngularJS base directive class
//
var wijmo;
(function (wijmo) {
    var angular;
    (function (angular) {
        // Base class for AngularJS directives (abstract class).
        var WjDirective = (function () {
            // Initializes a new instance of the DirectiveBase class 
            function WjDirective() {
                // Tells directive to replace or not original tag with the template
                this.replace = true;
                // Defines the way directive can be used in HTML
                this.restrict = 'E'; // all directives are HTML elements
                // Defines directive's template
                this.template = '<div />';
                // Tells directive to move content into template element marked with
                // 'ng-transclude' attribute
                this.transclude = false;
                //#endregion Settings
                // Directive property map
                // Holds PropDesc[] array with Wijmo control's properties available in directive's scope
                this._props = [];
                // Directive events map
                // Holds EventDesc[] array with Wijmo control's events available in directive's scope
                this._events = [];
                // Property descriptions used by nested directives.
                this._complexProps = [];
                var self = this;
                this._dirId = (++WjDirective._dirIdCounter) + '';
                this.link = this._postLinkFn();
                this.controller = ['$scope', '$parse', '$element', function ($scope, $parse, $element) {
                        // 'this' points to the controller instance here
                        self._$parse = $parse;
                        this[WjDirective._cntrlScopeProp] = $scope;
                        $scope[WjDirective._scopeChildrenProp] = [];
                        self._controllerImpl(this, $scope, $element);
                    }];
                this._initDirective();
            }
            Object.defineProperty(WjDirective.prototype, "_controlConstructor", {
                // Gets the constructor for the related Wijmo control. 
                // Abstract member, must be overridden in inherited class
                get: function () {
                    throw 'Abstract method call';
                },
                enumerable: true,
                configurable: true
            });
            // Gets the metadata ID, see the wijmo.interop.getMetaData method description for details.
            WjDirective.prototype._getMetaDataId = function () {
                return this._controlConstructor;
            };
            // Gets directive metadata.
            WjDirective.prototype._getMetaData = function () {
                return angular.MetaFactory.getMetaData(this._getMetaDataId());
            };
            // Initializes DDO properties
            WjDirective.prototype._initDirective = function () {
                this._initSharedMeta();
                this._prepareProps();
                this._initEvents();
                this._initScopeEvents();
                this._initScopeDescription();
            };
            // Initialize _props, _events and _complexProps with the shared metadata from wijmo.interop.ControlMetaFactory.
            WjDirective.prototype._initSharedMeta = function () {
                var meta = this._getMetaData();
                this._props = meta.props;
                this._events = meta.events;
                this._complexProps = meta.complexProps;
                this._property = meta.parentProperty;
                this._isPropertyArray = meta.isParentPropertyArray;
                this._ownObject = meta.ownsObject;
                this._parentReferenceProperty = meta.parentReferenceProperty;
                this._ngModelProperty = meta.ngModelProperty;
                // add wjRequired and wjDisabled wrapper properties
                var prop = angular.MetaFactory.findProp('required', this._props);
                if (prop) {
                    var idx = this._props.indexOf(prop);
                    if (idx > -1) {
                        var propDesc = new angular.PropDesc('wjRequired', wj.interop.PropertyType.Boolean);
                        propDesc.customHandler = function (scope, control, value) {
                            control['required'] = value;
                        };
                        this._props.splice(idx + 1, 0, propDesc);
                    }
                }
            };
            // Initializes control's property map. Abstract member, must be overridden in inherited class
            WjDirective.prototype._initProps = function () {
            };
            // Initializes control's event map. Abstract member, must be overridden in inherited class
            WjDirective.prototype._initEvents = function () {
            };
            // Creates and returns WjLink instance pertain to the directive.
            WjDirective.prototype._createLink = function () {
                return new WjLink();
            };
            // Implements a controller body, override it to implement a custom controller logic.
            // controller - a pointer to controller object.
            // scope - controller (and corresponding WjLink) scope.
            //
            // The DDO.controller property is occupied by our wrapper that creates a controller with the _cntrlScope property assigned
            // to the controller's scope. The wrapper then calls this method that is intended to implement a custom controller logic.
            WjDirective.prototype._controllerImpl = function (controller, scope, tElement) {
            };
            // Initializes control owned by the directive 
            WjDirective.prototype._initControl = function (element) {
                // Try to create Wijmo Control if directive is related to any
                try {
                    var controlConstructor = this._controlConstructor;
                    var control = new controlConstructor(element);
                    return control;
                }
                // if not - do nothing
                catch (e) {
                    // Do nothing. Return 'undefined' explicitly
                    return undefined;
                }
            };
            // Indicates whether this directive can operate as a child directive.
            WjDirective.prototype._isChild = function () {
                return this._isParentInitializer() || this._isParentReferencer();
            };
            // Indicates whether this directive operates as a child directive that initializes a property of its parent.
            WjDirective.prototype._isParentInitializer = function () {
                return this._property != undefined;
            };
            // Indicates whether this directive operates as a child directive that references a parent in its property or
            // a constructor.
            WjDirective.prototype._isParentReferencer = function () {
                return this._parentReferenceProperty != undefined;
            };
            // For the specified scope/control property name returns its corresponding directive tag attribute name.
            WjDirective.prototype._scopeToAttrName = function (scopeName) {
                var alias = this.scope[scopeName];
                if (alias) {
                    var bindMarkLen = 1, aliasLen = alias.length;
                    if (aliasLen < 2) {
                        return scopeName;
                    }
                    if (alias.charAt(1) === '?') {
                        bindMarkLen = 2;
                    }
                    if (aliasLen === bindMarkLen) {
                        return scopeName;
                    }
                    return alias.substr(bindMarkLen);
                }
                return scopeName;
            };
            WjDirective.prototype._getComplexPropDesc = function (propName) {
                return angular.MetaFactory.findComplexProp(propName, this._complexProps);
            };
            // Extends control's property map with events
            // Do not confuse with _initEvents(), which is abstract.
            WjDirective.prototype._initScopeEvents = function () {
                for (var i in this._events) {
                    var event = this._events[i];
                    this._props.push(new angular.PropDesc(event.eventName, wj.interop.PropertyType.EventHandler));
                }
            };
            // Creates isolated scope based on directive property map
            WjDirective.prototype._initScopeDescription = function () {
                var props = this._props, scope = {}, 
                // 1.1.1
                byRefMark = WjDirective._optionalAttr ? '=?' : '=';
                // fill result object with control properties
                if (props != null) {
                    var prop;
                    for (var i = 0; i < props.length; i++) {
                        prop = props[i];
                        scope[prop.propertyName] = prop.scopeBindingMode;
                        //1.1.1
                        if (WjDirective._optionalAttr && prop.scopeBindingMode == '=')
                            scope[prop.propertyName] = '=?';
                    }
                    if (scope['required']) {
                        scope['wjRequired'] = scope['required'];
                    }
                }
                // add property for control
                scope['control'] = byRefMark;
                scope[WjDirective._initPropAttr] = byRefMark;
                scope[WjDirective._initEventAttr] = '&';
                scope[WjDirective._parPropAttr] = '@';
                scope[WjDirective._wjModelPropAttr] = '@';
                // save result
                this.scope = scope;
            };
            // Returns the directive's 'link' function.
            // This is a virtual method, can be overridden by derived classes.
            // @param beforeLinkDelegate Delegate to run before the link function
            // @param afterLinkDelegate Delegate to run after the link function
            // @return Directive's link function
            WjDirective.prototype._postLinkFn = function () {
                var self = this;
                // Final directive link function
                var linkFunction = function (scope, tElement, tAttrs, controller) {
                    var link = self._createLink();
                    link.directive = self;
                    link.scope = scope;
                    link.tElement = tElement;
                    link.tAttrs = tAttrs;
                    if (wijmo.isArray(controller)) {
                        var parEl = tElement.parent();
                        // If working Angular version supports the isolateScope function then we use it, because in this case
                        // the scope function returns a non-isolated scope; otherwise we use scope that returns an isolated scope
                        // in this case.
                        var scopeFunc = parEl.isolateScope || parEl.scope;
                        var parScope = scopeFunc.call(parEl);
                        for (var i in controller) {
                            var curCntrl = controller[i];
                            if (curCntrl != undefined) {
                                //if (!link.controller) {
                                if (curCntrl[WjDirective._cntrlScopeProp] === scope) {
                                    //require parent controller by name
                                    curCntrl = tElement.parent().controller(self._stripRequire(+i));
                                }
                                if (curCntrl && curCntrl[WjDirective._cntrlScopeProp] === parScope) {
                                    link.controller = curCntrl;
                                    break;
                                }
                            }
                        }
                    }
                    else {
                        link.controller = controller;
                    }
                    link.ngModel = tElement.controller('ngModel');
                    link._link();
                };
                return linkFunction;
            };
            // Gathers PropertyDesc(s) and sorts them (using stable sort) in a priority order.
            WjDirective.prototype._prepareProps = function () {
                // gather property descriptors
                this._initProps();
                // stable sort on priority
                var baseArr = [].concat(this._props);
                this._props.sort(function (a, b) {
                    var ret = a.priority - b.priority;
                    if (!ret) {
                        ret = baseArr.indexOf(a) - baseArr.indexOf(b);
                    }
                    return ret;
                });
            };
            // For the 'require' property represented by an array, returns its value at the specified index stripped of a leading specifier.
            WjDirective.prototype._stripRequire = function (index) {
                if (!this._stripReq) {
                    this._stripReq = [];
                    this._stripReq.length = this['require'].length;
                }
                if (!this._stripReq[index]) {
                    var patt = /^[^A-Za-z]*(.*)/;
                    var res = patt.exec(this['require'][index]);
                    this._stripReq[index] = res ? res[1] : '';
                }
                return this._stripReq[index];
            };
            // Gets a directive unique ID
            WjDirective.prototype._getId = function () {
                return this._dirId;
            };
            // Determines whether the specified version is not older than the current Angular version.
            WjDirective._versionOk = function (minVer) {
                var angVer = window['angular'].version;
                var angVerParts = [angVer.major, angVer.minor, angVer.dot];
                var verParts = minVer.split(".");
                if (verParts.length !== angVerParts.length)
                    throw 'Unrecognizable version number.';
                for (var i = 0; i < verParts.length; i++) {
                    if (angVerParts[i] < verParts[i]) {
                        return false;
                    }
                    else if (angVerParts[i] > verParts[i]) {
                        return true;
                    }
                }
                return true;
            };
            // removes ng-transclude from the specified elements and all its child elements
            WjDirective._removeTransclude = function (html) {
                if (!html) {
                    return html;
                }
                var root = document.createElement('div');
                root.innerHTML = html;
                var transNodes = root.querySelectorAll('[ng-transclude]');
                [].forEach.call(transNodes, function (elem, idx) {
                    elem.removeAttribute('ng-transclude');
                });
                return root.innerHTML;
            };
            // Name of the child directive attribute defining a parent property name to assign to.
            WjDirective._parPropAttr = 'wjProperty';
            // Name of the attribute that allows to specify an alternative control property controlled by the ng-model directive.
            WjDirective._wjModelPropAttr = 'wjModelProperty';
            // Name of the attribute that provides the 'initialized' state value.
            WjDirective._initPropAttr = 'isInitialized';
            // Name of the attribute representing the 'initialized' event.
            WjDirective._initEventAttr = 'initialized';
            // Name of the property storing a reference to controller (link) scope in controllers.
            WjDirective._cntrlScopeProp = '_cntrlScope';
            // Name of the property in controller storing a reference to a link owning this controller.
            // Warning: the name must begin with '$', in order to not break tools like ng-inspector - this differentiate
            // special scope properties from scope's data properties.
            WjDirective._cntrlLinkProp = '$_thisLink';
            // Name of the scope property storing a collection of child links.
            WjDirective._scopeChildrenProp = '$_childLinks';
            // Name of an attribute storing a directive ID
            WjDirective._dirIdAttr = 'wj-directive-id';
            // Indicates whether optional scope attributes ('=?') are supported by the current version of Angular.
            WjDirective._optionalAttr = WjDirective._versionOk("1.1.4");
            // Indicates whether DDO.template function is supported by the current version of Angular.
            WjDirective._dynaTemplates = WjDirective._optionalAttr;
            // Attribute prefixes stripped by Angular
            WjDirective._angStripPrefixes = ['data', 'x'];
            WjDirective._dirIdCounter = 0;
            return WjDirective;
        }());
        angular.WjDirective = WjDirective;
        var WjLink = (function () {
            function WjLink() {
                // Hash containing <property name> - true pairs for scope properties that can't be assigned.
                this._nonAssignable = {};
                // Hash containing <property name> - PropDesc pairs for all properties that have defined tag attributes.
                this._definedProps = {};
                // Hash containing <event name> - EventDesc pairs for all events that have defined tag attributes.
                this._definedEvents = {};
                // Hash containing <property name> - any pairs containing previous scope values for the $watch function. 
                this._oldValues = {};
                /* private */ this._isInitialized = false;
                this._hasTriggeredInitialized = false;
                this._isNgModelInitialized = false;
                this._scopeSuspend = 0;
                this._suspendedEvents = [];
                this._areChlildrenReady = false;
                this._isDestroyed = false;
                // #region 'initialized' stuff
                this._isAppliedToParent = false;
            }
            WjLink.prototype._link = function () {
                var dir = this.directive, self = this;
                this.tElement[0].setAttribute(WjDirective._dirIdAttr, dir._getId());
                this.directiveTemplateElement = dir.replace ? this.tElement : window['angular'].element(this.tElement.children()[0]);
                this._initNonAssignable();
                if (this._isChild()) {
                    //Defines initial _parentPropDesc, which can be overridden later in the _parentReady method.
                    this._parentPropDesc = new angular.ComplexPropDesc(dir._property, dir._isPropertyArray, dir._ownObject);
                    // Register this link as a child in the parent link's scope and postpone initialization
                    this.controller[WjDirective._cntrlScopeProp][WjDirective._scopeChildrenProp].push(this);
                    var parentScope = this.controller[WjDirective._cntrlScopeProp], parentLink = parentScope[WjDirective._cntrlLinkProp];
                    if (parentLink && parentLink._areChlildrenReady) {
                        this._parentReady(parentLink);
                    }
                }
                else {
                    this._createInstance();
                    this._notifyReady();
                    this._prepareControl();
                }
                this._destroyEhUnreg = this.scope.$on('$destroy', function (event) {
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    self._destroy();
                });
            };
            // This method can be overridden to implement custom application of child directives. Child directives are already 
            // initialized at this moment. 
            WjLink.prototype._onChildrenReady = function () {
            };
            WjLink.prototype._createInstance = function () {
                this.control = this._initControl();
                this._safeApply(this.scope, 'control', this.control);
            };
            // This method is called by the parent link for the child link to notify that parent link's control is created.
            WjLink.prototype._parentReady = function (parentLink) {
                if (!this._isChild())
                    return;
                var self = this;
                // In case where parent property name is defined via attribute by a user, in early Angular versions (e.g. 1.1.1)
                // the scope is not initialized with attribute values defined on directive tag. To manage this we watch this attribute
                // and init the link when its value appears.
                if (this._isAttrDefined(WjDirective._parPropAttr) && !this.scope[WjDirective._parPropAttr]) {
                    this.scope.$watch(WjDirective._parPropAttr, function () {
                        self._parentReady(parentLink);
                    });
                    return;
                }
                var parProp = this._getParentProp();
                //Override _parentPropDesc if it's defined for the servicing property in the parent link's directive.
                var parPropDescOverride = parentLink.directive._getComplexPropDesc(parProp);
                if (parPropDescOverride) {
                    this._parentPropDesc = parPropDescOverride;
                }
                else {
                    this._parentPropDesc.propertyName = parProp;
                }
                this.parent = parentLink;
                if (this._useParentObj()) {
                    this.control = parentLink.control[parProp];
                    this._safeApply(this.scope, 'control', this.control);
                }
                else {
                    this._createInstance();
                }
                this._notifyReady();
                this._prepareControl();
                this._initParent();
                this.directiveTemplateElement[0].style.display = 'none';
                this._appliedToParent();
            };
            // Assigns/adds this directive's object to the parent object.
            WjLink.prototype._initParent = function () {
                if (this._useParentObj())
                    return;
                var dir = this.directive, propName = this._getParentProp(), parCtrl = this.parent.control, ctrl = this.control;
                if (this._isParentInitializer()) {
                    if (this._isParentArray()) {
                        // insert child at correct index, which is the same as an index of the directive element amid sibling directives
                        // of the same type
                        var parArr = parCtrl[propName], linkIdx = this._getIndex();
                        if (linkIdx < 0 || linkIdx >= parArr.length) {
                            linkIdx = parArr.length;
                        }
                        parArr.splice(linkIdx, 0, ctrl);
                        var self = this;
                        this._siblingInsertedEH = this._siblingInserted.bind(this);
                        this.tElement[0].addEventListener('DOMNodeInserted', this._siblingInsertedEH);
                    }
                    else {
                        parCtrl[propName] = ctrl;
                    }
                }
                if (this._isParentReferencer() && !this._parentInCtor()) {
                    ctrl[this._getParentReferenceProperty()] = parCtrl;
                }
            };
            // Performes directive removal (currently called for child directives only).
            WjLink.prototype._destroy = function () {
                if (this._isDestroyed) {
                    return;
                }
                this._isDestroyed = true;
                var control = this.control;
                if (this._destroyEhUnreg) {
                    //this._destroyEhUnreg();
                    this._destroyEhUnreg = null;
                }
                if (this._siblingInsertedEH) {
                    this.tElement[0].removeEventListener('DOMNodeInserted', this._siblingInsertedEH);
                }
                if (this._isParentArray() && !this.parent._isDestroyed) {
                    var parControl = this.parent.control, parProp = this._getParentProp();
                    if (parControl && parProp && control) {
                        var parArr = parControl[parProp];
                        if (parArr) {
                            var idx = parArr.indexOf(control);
                            if (idx >= 0) {
                                parArr.splice(idx, 1);
                            }
                        }
                    }
                }
                if (control instanceof wijmo.Control) {
                    // We call dispose() with a delay, to get directives such as ng-if/ng-repeat a chance to remove its child subtree
                    // before the control will be disposed. Otherwise, Control.dispose() replaces its host element with an assignment 
                    // to outerHTML, that creates an element clone in its parent with a different pointer, not the one that
                    // ng-if stores locally, so this clone is out of ng-if control and stays in DOM forever.
                    setTimeout(function () {
                        if (control.hostElement) {
                            control.dispose();
                        }
                    }, 0);
                }
            };
            WjLink.prototype._siblingInserted = function (e) {
                if (e.target === this.tElement[0]) {
                    var lIdx = this._getIndex(), parArr = this.parent.control[this._getParentProp()], ctrl = this.control, arrIdx = parArr.indexOf(ctrl);
                    if (lIdx >= 0 && arrIdx >= 0 && lIdx !== arrIdx) {
                        parArr.splice(arrIdx, 1);
                        lIdx = Math.min(lIdx, parArr.length);
                        parArr.splice(lIdx, 0, ctrl);
                    }
                }
            };
            // Notify child links after this directive was attached to its control.
            WjLink.prototype._notifyReady = function () {
                // Notify child links
                //
                this.scope[WjDirective._cntrlLinkProp] = this;
                //
                var childLinks = [].concat(this.scope[WjDirective._scopeChildrenProp]);
                for (var i = 0; i < childLinks.length; i++) {
                    childLinks[i]._parentReady(this);
                }
                // Clear children list to free references for GC.
                //childLinks.length = 0; //cleared one by one by the _childInitialized method
                this._areChlildrenReady = true;
                this._onChildrenReady();
            };
            // Creates a control instance owned by the directive. 
            WjLink.prototype._initControl = function () {
                return this.directive._initControl(this._parentInCtor() ? this.parent.control : this.directiveTemplateElement[0]);
            };
            // Defines scope's default values, registers properties watchers and event handlers
            WjLink.prototype._prepareControl = function () {
                this._addEventHandlers();
                this._addWatchers();
            };
            // Sets control's default values to scope properties
            WjLink.prototype._setupScopeWithControlProperties = function () {
                var prop, name, scopeValue, controlValue, control = this.control, scope = this.scope, props = this.directive._props;
                for (var i = 0; i < props.length; i++) {
                    prop = props[i];
                    if (prop.scopeBindingMode === '=' && prop.isNativeControlProperty && prop.shouldUpdateSource) {
                        name = prop.propertyName;
                        scopeValue = scope[name];
                        controlValue = control[name];
                        var isFunction = prop.propertyType == wj.interop.PropertyType.Function;
                        var isEventHandler = prop.propertyType == wj.interop.PropertyType.EventHandler;
                        if (this._canApply(scope, prop.propertyName) && controlValue != scopeValue && !isFunction && !isEventHandler) {
                            scope[prop.propertyName] = controlValue;
                        }
                    }
                }
                if (!scope['$root'].$$phase) {
                    scope.$apply();
                }
            };
            WjLink.prototype._initNonAssignable = function () {
                var parse = this.directive._$parse, scopeDef = this.directive.scope, 
                //props = Object.getOwnPropertyNames(scopeDef),
                binding;
                for (var name in scopeDef) {
                    if (scopeDef[name].charAt(0) === '=') {
                        binding = this.tAttrs[this.directive._scopeToAttrName(name)];
                        if (binding === undefined || parse(binding).assign == undefined) {
                            this._nonAssignable[name] = true;
                        }
                    }
                }
            };
            WjLink.prototype._suspendScope = function () {
                this._scopeSuspend++;
            };
            WjLink.prototype._resumeScope = function () {
                if (this._scopeSuspend > 0) {
                    if (--this._scopeSuspend === 0 && this._suspendedEvents.length > 0) {
                        this._updateScope();
                    }
                }
            };
            WjLink.prototype._isScopeSuspended = function () {
                return this._scopeSuspend > 0;
            };
            WjLink.prototype._isAttrDefined = function (name) {
                return this.tAttrs.$attr[this.directive._scopeToAttrName(name)] != null;
            };
            // Called by child link when its fully initialized
            WjLink.prototype._childInitialized = function (child) {
                var childLinks = this.scope[WjDirective._scopeChildrenProp], idx = childLinks.indexOf(child);
                if (idx >= 0) {
                    childLinks.splice(idx, 1);
                    this._checkRaiseInitialized();
                }
            };
            // Called after first watch on this links has worked out.
            WjLink.prototype._thisInitialized = function () {
                this._checkRaiseInitialized();
            };
            // Called after this control and all its child directives were initialized.
            WjLink.prototype._initialized = function () {
            };
            // For the child link, called after this link has applied (added to array, assigned) its object to the parent.
            WjLink.prototype._appliedToParent = function () {
                this._isAppliedToParent = true;
                this._checkRaiseInitialized();
            };
            WjLink.prototype._checkRaiseInitialized = function () {
                if (!this._hasTriggeredInitialized && this.scope[WjDirective._scopeChildrenProp].length === 0 && this._isInitialized
                    && (!this._isChild() || this._isAppliedToParent)) {
                    this._hasTriggeredInitialized = true;
                    this._initialized();
                    // set the scope isInitialized property to true
                    this._safeApply(this.scope, WjDirective._initPropAttr, true);
                    // raise the initialized event
                    var handler = this.scope[WjDirective._initEventAttr], self = this;
                    if (handler) {
                        // delay the event to allow the 'isInitialized' property value be propagated to a controller scope before 
                        // the event is raised
                        setTimeout(function () {
                            handler({ s: self.control, e: undefined });
                        }, 0);
                    }
                    //notify parent
                    if (this._isChild() && this.parent) {
                        this.parent._childInitialized(this);
                    }
                }
            };
            //#endregion 'initialized' stuff
            // Adds watchers for scope properties to update control values
            WjLink.prototype._addWatchers = function () {
                var self = this, props = this.directive._props, scope = this.scope;
                if (!props) {
                    return;
                }
                if (this.ngModel) {
                    var ngModel = this.ngModel;
                    // Patch: in Angular 1.3+ these classes are initially set but then removed by Angular,
                    // probably because directive's replace=true ???
                    if (ngModel.$pristine) {
                        wijmo.addClass(this.tElement[0], 'ng-pristine');
                    }
                    if (ngModel.$valid) {
                        wijmo.addClass(this.tElement[0], 'ng-valid');
                    }
                    if (ngModel.$untouched) {
                        wijmo.addClass(this.tElement[0], 'ng-untouched');
                    }
                    // end patch
                    ngModel.$render = this._ngModelRender.bind(this);
                    this._updateNgModelPropDesc();
                    if (this._isAttrDefined(WjDirective._wjModelPropAttr)) {
                        scope.$watch(WjDirective._wjModelPropAttr, function () {
                            self._updateNgModelPropDesc();
                            self._ngModelRender();
                        });
                    }
                }
                var i, name, prop;
                for (i = 0; i < props.length; i++) {
                    prop = props[i];
                    name = prop.propertyName;
                    if (prop.propertyType !== wj.interop.PropertyType.EventHandler && this._isAttrDefined(name)) {
                        this._definedProps[name] = prop;
                    }
                }
                var control = this.control;
                scope.$watch(function (scope) {
                    if (self._isDestroyed) {
                        return;
                    }
                    try {
                        var assignValues = {};
                        for (var name in self._definedProps) {
                            if (scope[name] !== self._oldValues[name]) {
                                assignValues[name] = scope[name];
                            }
                        }
                        for (var name in assignValues) {
                            var newVal = assignValues[name], oldVal = self._oldValues[name];
                            if (newVal !== oldVal) {
                                self._oldValues[name] = newVal;
                                if (self._isInitialized || newVal !== undefined) {
                                    // get value from scope
                                    var prop = self._definedProps[name], value = self._nullOrValue(self._castValueToType(newVal, prop));
                                    // check that the control value is out-of-date
                                    var oldCtrlVal = control[name];
                                    if (oldCtrlVal != value) {
                                        // invoke custom handler (if any) to handle the change
                                        var handled = false;
                                        if (prop.customHandler != null) {
                                            handled = prop.customHandler(scope, control, value, oldCtrlVal, self);
                                        }
                                        // apply value to control if it's a native property
                                        // (as opposed to directive-only property) and if custom handler
                                        // didn't signal that the assignment is already handled
                                        if (prop.isNativeControlProperty && handled !== true) {
                                            control[name] = value;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    finally {
                        if (!self._isInitialized) {
                            self._isNgModelInitialized = true;
                            //TBD: apply it according to the associated property's priority order
                            if (self.ngModel) {
                                if (self.ngModel.$viewValue !== undefined) {
                                    self._ngModelRender();
                                }
                                else if (self._ngModelPropDesc) {
                                    self.ngModel.$setViewValue(control[self._ngModelPropDesc.propertyName]);
                                    self.ngModel.$setPristine();
                                }
                            }
                            self._isInitialized = true;
                            self._setupScopeWithControlProperties();
                            self._thisInitialized();
                        }
                    }
                });
            };
            // Adds handlers for control events
            WjLink.prototype._addEventHandlers = function () {
                var i, event, evList = this.directive._events;
                for (i = 0; i < evList.length; i++) {
                    event = evList[i];
                    this._addEventHandler(event); // avoiding 'i' closure
                }
            };
            WjLink.prototype._addEventHandler = function (eventDesc) {
                var self = this, eventName = eventDesc.eventName, controlEvent = this.control[eventName];
                // check that the event name is valid
                if (controlEvent == null) {
                    throw 'Event "' + eventName + '" not found in ' + self.constructor.name;
                }
                var isDefined = this._isAttrDefined(eventName);
                if (isDefined) {
                    this._definedEvents[eventName] = eventDesc;
                }
                else if (!eventDesc.isPropChanged) {
                    // don't subscribe if event is neither subscribed nor "isPropChanged" event.
                    return;
                }
                var scope = this.scope, props = this.directive._props, control = this.control;
                // add the event handler
                controlEvent.addHandler(function (s, e) {
                    var eventInfo = { eventDesc: eventDesc, s: s, e: e };
                    if (self._isScopeSuspended()) {
                        self._suspendedEvents.push(eventInfo);
                    }
                    else {
                        self._updateScope(eventInfo);
                    }
                }, control);
            };
            // Updates scope values with control values for two-way bindings.
            WjLink.prototype._updateScope = function (eventInfo) {
                if (eventInfo === void 0) { eventInfo = null; }
                if (this._isDestroyed) {
                    return;
                }
                // apply changes to scope
                var update = eventInfo ? eventInfo.eventDesc.isPropChanged :
                    this._suspendedEvents.some(function (value) {
                        return value.eventDesc.isPropChanged;
                    }), self = this;
                //var hasChanges = false;
                if (update) {
                    var props = this.directive._props;
                    for (var i = 0; i < props.length; i++) {
                        var p = props[i];
                        if (p.scopeBindingMode == '=' && p.isNativeControlProperty && p.shouldUpdateSource) {
                            var name = p.propertyName, value = this.control[name];
                            if (this._shouldApply(this.scope, name, value)) {
                                this.scope[name] = value;
                                //
                                this.directive._$parse(this.tAttrs[this.directive._scopeToAttrName(name)]).assign(this.scope.$parent, value);
                            }
                            if (this._ngModelPropDesc && this._isInitialized &&
                                this._ngModelPropDesc.propertyName == name && this.ngModel.$viewValue !== value) {
                                this.ngModel.$setViewValue(value);
                            }
                        }
                    }
                }
                var raiseEvents = function () {
                    var suspEvArr = eventInfo ? [eventInfo] : this._suspendedEvents;
                    //for (var i in suspEvArr) { 
                    for (var i = 0; i < suspEvArr.length; i++) {
                        var suspInfo = suspEvArr[i], eventName = suspInfo.eventDesc.eventName, scopeHandler = this.scope[eventName];
                        if (self._definedEvents[eventName] && scopeHandler) {
                            scopeHandler({ s: suspInfo.s, e: suspInfo.e });
                        }
                    }
                    if (!eventInfo) {
                        this._suspendedEvents.length = 0;
                    }
                }.bind(this);
                if (update) {
                    if (!this.scope['$root'].$$phase) {
                        this.scope.$apply();
                    }
                    else {
                        // We may be in a call to directive's scope $watch finalizing the digest, so there is a chance that 
                        // there will be no more digests and changes made here to directive scope will not propagate to controller
                        // scope. To manage with this we initiate one more digest cycle by adding a dummy watch to the scope.
                        // We don't use setTimeout($apply(), 0) for this purpose to guarantee that all changes will be applied
                        // in this digest where we are now.
                        var dispose = this.scope.$watch('value', function () {
                            // dispose the watch right away
                            dispose();
                            //raiseEvents();
                        });
                    }
                }
                raiseEvents();
            };
            // ngModel.$render function implementation
            WjLink.prototype._ngModelRender = function () {
                if (!this._isNgModelInitialized) {
                    return;
                }
                var viewValue = this.ngModel.$viewValue, propDesc = this._ngModelPropDesc;
                if (!propDesc || viewValue === undefined && !this._isInitialized) {
                    return;
                }
                var value = this._nullOrValue(this._castValueToType(viewValue, propDesc));
                if (viewValue !== this.control[propDesc.propertyName]) {
                    this.control[propDesc.propertyName] = viewValue;
                }
            };
            // Casts value to the property type
            WjLink.prototype._castValueToType = function (value, prop) {
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
            };
            //// Parsing DateTime values from string
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
            //Determines whether this is a child link.
            //NOTE: functionality is *not* based on _parentPropDesc
            WjLink.prototype._isChild = function () {
                return this.directive._isChild();
            };
            // Indicates whether this directive operates as a child directive that initializes a property of its parent.
            WjLink.prototype._isParentInitializer = function () {
                return this.directive._isParentInitializer();
            };
            // Indicates whether this directive operates as a child directive that references a parent in its property or
            // a constructor.
            WjLink.prototype._isParentReferencer = function () {
                return this.directive._isParentReferencer();
            };
            //For the child directives returns parent's property name that it services. Property name defined via
            //the wjProperty attribute of directive tag has priority over the directive._property definition.
            //NOTE: functionality is *not* based on _parentPropDesc
            WjLink.prototype._getParentProp = function () {
                return this._isParentInitializer() ? this.scope[WjDirective._parPropAttr] || this.directive._property : undefined;
            };
            // For a child directive, the name of the property of the directive's underlying object that receives the reference
            // to the parent, or an empty string that indicates that the reference to the parent should be passed as the 
            // underlying object's constructor parameter.
            WjLink.prototype._getParentReferenceProperty = function () {
                return this.directive._parentReferenceProperty;
            };
            // Determines whether the child link uses an object created by the parent property, instead of creating it by
            // itself, and thus object's initialization should be delayed until parent link's control is created.
            //IMPORTANT: functionality is *based* on _parentPropDesc
            WjLink.prototype._useParentObj = function () {
                return !this._isParentReferencer() &&
                    this._isParentInitializer() && !this._parentPropDesc.isArray && !this._parentPropDesc.ownsObject;
            };
            // For the child link, determines whether the servicing parent property is an array.
            //IMPORTANT: functionality is *based* on _parentPropDesc
            WjLink.prototype._isParentArray = function () {
                return this._isParentInitializer() && this._parentPropDesc.isArray;
            };
            // For the child referencer directive, indicates whether the parent should be passed as a parameter the object
            // constructor.
            WjLink.prototype._parentInCtor = function () {
                return this._isParentReferencer() && this._getParentReferenceProperty() == '';
            };
            WjLink.prototype._getNgModelProperty = function () {
                return this.scope[WjDirective._wjModelPropAttr] || this.directive._ngModelProperty;
            };
            WjLink.prototype._updateNgModelPropDesc = function () {
                var ngModelProp = this._getNgModelProperty();
                this._ngModelPropDesc = wijmo.isNullOrWhiteSpace(ngModelProp) ?
                    null :
                    angular.MetaFactory.findProp(ngModelProp, this.directive._props);
            };
            // apply value to scope and notify
            WjLink.prototype._safeApply = function (scope, name, value) {
                // check that value and scope are defined, and that value changed
                if (this._shouldApply(scope, name, value)) {
                    // apply new value to scope and notify
                    scope[name] = value;
                    if (!scope.$root.$$phase) {
                        scope.$apply();
                    }
                    return true;
                }
                return false;
            };
            // Detrmines whether value should be assigned to scope[name], depending on optional attribute support in current Angular version.
            WjLink.prototype._shouldApply = function (scope, name, value) {
                return this._canApply(scope, name) && value != scope[name];
            };
            // Detrmines whether scope[name] can be safely updated without getting an exception.
            WjLink.prototype._canApply = function (scope, name) {
                return !this._nonAssignable[name];
            };
            // Returns null for undefined or null value; otherwise, the original value.
            WjLink.prototype._nullOrValue = function (value) {
                return value != undefined ? value : null;
            };
            // Gets an index of this link among another links pertain to the same directive type.
            WjLink.prototype._getIndex = function () {
                var thisEl = this.tElement[0], parEl = thisEl.parentElement;
                // If parentElement is null, e.g. because this element is temporary in DocumentFragment, the index
                // of the element isn't relevant to the item's position in the array, so we return -1 and thus force
                // a calling code to not reposition the item in the array at all.  
                if (!parEl) {
                    return -1;
                }
                var siblings = parEl.childNodes, idx = -1, dirId = this.directive._getId();
                for (var i = 0; i < siblings.length; i++) {
                    var curEl = siblings[i];
                    if (curEl.nodeType == 1 && curEl.getAttribute(WjDirective._dirIdAttr) == dirId) {
                        ++idx;
                        if (curEl === thisEl) {
                            return idx;
                        }
                    }
                }
                return -1;
            };
            return WjLink;
        }());
        angular.WjLink = WjLink;
    })(angular = wijmo.angular || (wijmo.angular = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.angular.directiveBase.js.map