module wijmo {
    'use strict';

    /**
     * Base class for all Wijmo controls.
     *
     * The @see:Control class handles the association between DOM elements and the
     * actual control. Use the @see:hostElement property to get the DOM element 
     * that is hosting a control, or the @see:getControl method to get the control 
     * hosted in a given DOM element.
     *
     * The @see:Control class also provides a common pattern for invalidating and
     * refreshing controls, for updating the control layout when its size changes, 
     * and for handling the HTML templates that define the control structure.
     */
    export class Control {
        private static _DATA_KEY = 'wj-Control';    // key used to store control reference in host element
        private static _REFRESH_INTERVAL = 10;      // interval between invalidation and refresh
        private static _wme: HTMLElement;           // watermark element
        static _touching: boolean;                  // the current event is a touch event

        private _focus = false;                     // whether the control currently contains the focus
        private _updating = 0;                      // update count (no refreshes while > 0)
        private _fullUpdate = false;                // in case there are multiple calls to invalidate(x)
        private _toInv: number;                     // invalidation timeOut
        private _szCtl: Size;                       // current control size
        private _e: HTMLElement;                    // host element
        private _orgOuter: string;                  // host element's original outerHTML
        private _orgInner: string;                  // host element's original innerHTML
        private _listeners;                         // list of event listeners attached to this control
        protected _orgTag: string;                  // host element's original tag

        /**
         * Initializes a new instance of the @see:Control class and attaches it to a DOM element.
         * 
         * @param element The DOM element that will host the control, or a selector for the host element (e.g. '#theCtrl').
         * @param options JavaScript object containing initialization data for the control.
         * @param invalidateOnResize Whether the control should be invalidated when it is resized.
         */
        constructor(element: any, options = null, invalidateOnResize = false) {

            // check that the element is not in use
            assert(Control.getControl(element) == null, 'Element is already hosting a control.');

            // get the host element
            var host = getElement(element);
            assert(host != null, 'Cannot find the host element.');

            // save host and original content (to restore on dispose)
            this._orgOuter = host.outerHTML;
            this._orgInner = host.innerHTML;

            // save host attributes, replace <input> and <select> elements with <div>
            this._orgTag = host.tagName;
            if (host.tagName == 'INPUT' || host.tagName == 'SELECT') {
                host = this._replaceWithDiv(host);
            }

            // save host element and store control instance in element
            // (to retrieve with Control.getControl(element))
            this._e = host;
            host[Control._DATA_KEY] = this;

            // update layout when user resizes the browser
            if (invalidateOnResize == true) {
                this._szCtl = new Size(host.offsetWidth, host.offsetHeight);
                var hr = this._handleResize.bind(this);
                this.addEventListener(window, 'resize', hr);
            }

            // fire events for got/lost focus
            // use timeOuts since Chrome and FF sometimes move the focus to the body
            // before moving it to the new focused element
            this.addEventListener(host, 'focus', () => {
                setTimeout(() => { // TFS 146807
                    this._updateFocusState();
                });
            }, true);
            this.addEventListener(host, 'blur', () => {
                setTimeout(() => { // TFS 146807
                    this._updateFocusState();
                }, 20); // >0, <200: TFS 100250, 112599, 115816, 195150
            }, true);

            // handle disabled controls 
            // (pointer-events requires IE11, doesn't prevent wheel at all)
            var hd = this._handleDisabled.bind(this);
            this.addEventListener(host, 'mousedown', hd, true);
            this.addEventListener(host, 'mouseup', hd, true);
            this.addEventListener(host, 'click', hd, true);
            this.addEventListener(host, 'dblclick', hd, true);
            this.addEventListener(host, 'keydown', hd, true);
            this.addEventListener(host, 'wheel', hd, true);

            // keep track of touch actions at the document level
            // (no need to add/remove event handlers to every Wijmo control)
            if (Control._touching == null) {
                Control._touching = false;
                if ('ontouchstart' in window || 'onpointerdown' in window) {
                    var b = document.body,
                        ts = this._handleTouchStart,
                        te = this._handleTouchEnd;
                    if ('ontouchstart' in window) { // Chrome, FireFox, Safari
                        b.addEventListener('touchstart', ts);
                        b.addEventListener('touchend', te);
                        b.addEventListener('touchcancel', te);
                        b.addEventListener('touchleave', te);
                    } else if ('onpointerdown' in window) { // IE
                        b.addEventListener('pointerdown', ts);
                        b.addEventListener('pointerup', te);
                        b.addEventListener('pointerout', te);
                        b.addEventListener('pointercancel', te);
                        b.addEventListener('pointerleave', te);
                    }
                }
            }

            ///#if EVAL // show watermark on eval builds
            if (!Control._wme || !Control._wme.parentElement) {
                var msg = 'Wijmo ' + getVersion() + ' eval';
                Control._wme = createElement('<div><a href="http://wijmo.com/products/wijmo-5/eval/">' + msg + '</a></div>');
                var css: any = {
                    position: 'fixed',
                    padding: 5,
                    margin: 5,
                    background: '#fff',
                    boxShadow: '0 0 10px rgba(0,0,0,0.25)',
                    fontSize: '11pt',
                    zIndex: 1000,
                    opacity: 0.8,
                    display: 'block',
                    visibility: 'visible',
                    height: 'auto',
                    width: 'auto',
                    transform: 'none'
                };
                switch (Math.round(Math.random() * 100) % 2) {
                    case 0: // bottom right
                        css.right = css.bottom = 0;
                        break;
                    case 1: // bottom left
                        css.left = css.bottom = 0;
                        break;
                    case 2: // top right
                        css.right = css.top = 0;
                        break;
                }
                setCss(Control._wme, css);
                document.body.appendChild(Control._wme);
            }
            ///#endif
        }

        /**
         * Gets the HTML template used to create instances of the control.
         *
         * This method traverses up the class hierarchy to find the nearest ancestor that
         * specifies a control template. For example, if you specify a prototype for the
         * @see:ComboBox control, it will override the template defined by the @see:DropDown 
         * base class.
         */
        getTemplate(): string {
            for (var p = Object.getPrototypeOf(this); p; p = Object.getPrototypeOf(p)) {
                var tpl = p.constructor.controlTemplate;
                if (tpl) {
                    return tpl;
                }
            }
            return null;
        }
        /**
         * Applies the template to a new instance of a control, and returns the root element.
         *
         * This method should be called by constructors of templated controls.
         * It is responsible for binding the template parts to the 
         * corresponding control members.
         *
         * For example, the code below applies a template to an instance
         * of an @see:InputNumber control. The template must contain elements 
         * with the 'wj-part' attribute set to 'input', 'btn-inc', and 'btn-dec'.
         * The control members '_tbx', '_btnUp', and '_btnDn' will be assigned
         * references to these elements.
         *
         * <pre>this.applyTemplate('wj-control wj-inputnumber', template, {
         *   _tbx: 'input',
         *   _btnUp: 'btn-inc',
         *   _btnDn: 'btn-dec'
         * }, 'input');</pre>
         *
         * @param classNames Names of classes to add to the control's host element.
         * @param template An HTML string that defines the control template.
         * @param parts A dictionary of part variables and their names.
         * @param namePart Name of the part to be named after the host element. This
         * determines how the control submits data when used in forms.
         */
        applyTemplate(classNames: string, template: string, parts: Object, namePart?: string): HTMLElement {
            var host = this._e;

            // apply standard classes to host element
            if (classNames) {
                addClass(host, classNames);
            }

            // convert string into HTML template and append to host
            var tpl = null;
            if (template) {
                tpl = createElement(template, host);
            }

            // copy key attributes from the host element (name, validation) to inner input 
            // element
            // NOTE 1: do this only if there is a single input element in the template
            // NOTE 2: do not copy 'type' since it causes issues in Chrome: TFS 84900, 84901
            var inputs = host.querySelectorAll('input'),
                input = <HTMLInputElement>(inputs.length == 1 ? inputs[0] : null),
                atts = host.attributes;
            if (input && atts) {
                for (var i = 0; i < atts.length; i++) {
                    if (atts[i].name.match(/name|autofocus|autocomplete|minlength|maxlength|pattern/i)) {
                        input.setAttribute(atts[i].name, atts[i].value);
                    }
                }
            }

            // change 'for' attribute of labels targeting the host element 
            // to target the inner input element instead (needed for Chrome and FF)
            if (input && host.id) {
                var label = <HTMLLabelElement>document.querySelector('label[for="' + host.id + '"]'),
                    baseId = host.id + '_input',
                    newId = baseId;
                if (label instanceof HTMLLabelElement) {
                    for (var i = 0; document.getElementById(newId) != null; i++) {
                        newId = baseId + i; // new unique id
                    }
                    input.id = newId; // set id of inner input element
                    label.htmlFor = newId; // change 'for' attribute to match new id
                }
            }
            
            // fire 'change' events on behalf of inner input elements (TFS 190946)
            if (input) {
                var evtChange = document.createEvent('HTMLEvents'),
                    orgVal = input.value;
                evtChange.initEvent('change', true, false);
                this.addEventListener(input, 'input', () => {
                    orgVal = input.value;
                }, true);
                this.gotFocus.addHandler(() => {
                    orgVal = input.value;
                });
                this.lostFocus.addHandler(() => {
                    if (orgVal != input.value) {
                        input.dispatchEvent(evtChange);
                    }
                });
            }

            // make sure the control can get the focus
            // this is a little tricky:
            // - Chrome won't give divs the focus unless we set tabIndex to something > -1
            // - But if we do set it and the control contains input elements, the back-tab key won't work
            // so we set the tabIndex to -1 or zero depending on whether the control contains input elements.
            // http://wijmo.com/topic/shift-tab-not-working-for-input-controls-in-ff-and-chrome/, TFS 123457
            if (!host.getAttribute('tabindex')) {
                host.tabIndex = (input != null) ? -1 : 0; 
            }

            // initialize state (empty/invalid)
            this._updateState();

            // bind control variables to template parts
            if (parts) {
                for (var part in parts) {
                    var wjPart = parts[part];
                    this[part] = tpl.querySelector('[wj-part="' + wjPart + '"]');

                    // look in the root as well (querySelector doesn't...)
                    if (this[part] == null && tpl.getAttribute('wj-part') == wjPart) {
                        this[part] = tpl;
                    }

                    // make sure we found the part
                    if (this[part] == null) {
                        throw 'Missing template part: "' + wjPart + '"';
                    }

                    // copy/move attributes from host to input element
                    if (wjPart == namePart) {

                        // copy parent element's name attribute to the namePart element
                        // (to send data when submitting forms).
                        var key = 'name',
                            att = host.attributes[key];
                        if (att && att.value) {
                            this[part].setAttribute(key, att.value);
                        }

                        // transfer access key
                        key = 'accesskey';
                        att = host.attributes[key];
                        if (att && att.value) {
                            this[part].setAttribute(key, att.value);
                            host.removeAttribute(key);
                        }
                    }
                }
            }

            // return template
            return tpl;
        }

        /**
         * Disposes of the control by removing its association with the host element.
         *
         * The @see:dispose method automatically removes any event listeners added
         * with the @see:addEventListener method.
         *
         * Calling the @see:dispose method is important in applications that create
         * and remove controls dynamically. Failing to dispose of the controls may
         * cause memory leaks.
         */
        dispose() {

            // dispose of any child controls
            var cc = this._e.querySelectorAll('.wj-control');
            for (var i = 0; i < cc.length; i++) {
                var ctl = Control.getControl(cc[i]);
                if (ctl) {
                    ctl.dispose();
                }
            }

            // cancel any pending refreshes
            if (this._toInv) {
                clearTimeout(this._toInv);
            }

            // remove all HTML event listeners
            this.removeEventListener();

            // remove all Wijmo event listeners 
            // (without getting the value for all properties)
            for (var prop in this) {
                if (prop.length > 2 && prop.indexOf('on') == 0) {
                    var evt = <Event>this[prop[2].toLowerCase() + prop.substr(3)];
                    if (evt instanceof Event) {
                        evt.removeAllHandlers();
                    }
                }
            }

            // if the control has a collectionView property, remove handlers to stop receiving notifications
            // REVIEW: perhaps optimize by caching the CollectionView properties?
            var cv = <collections.CollectionView>this['collectionView'];
            if (cv instanceof collections.CollectionView) {
                for (var prop in cv) {
                    var evt = <Event>cv[prop];
                    if (evt instanceof Event) {
                        evt.removeHandler(null, this);
                    }
                }
            }

            // restore original content
            if (this._e.parentNode) {
                this._e.outerHTML = this._orgOuter;
            }

            // done
            this._e[Control._DATA_KEY] = null;
            this._e = this._orgOuter = this._orgInner = this._orgTag = null;
        }
        /**
         * Gets the control that is hosted in a given DOM element.
         *
         * @param element The DOM element that is hosting the control, or a selector for the host element (e.g. '#theCtrl').
         */
        static getControl(element: any): Control {
            var e = getElement(element);
            return e ? asType(e[Control._DATA_KEY], Control, true) : null;
        }
        /**
         * Gets the DOM element that is hosting the control.
         */
        get hostElement(): HTMLElement {
            return this._e;
        }
        /**
         * Sets the focus to this control.
         */
        focus() {
            if (this._e) { // test for disposed controls
                this._e.focus();
            }
        }
        /**
         * Checks whether this control contains the focused element.
         */
        containsFocus(): boolean {

            // test for disposed controls
            if (!this._e) {
                return false;
            }

            // scan child controls (they may have popups, TFS 112676)
            var c = this._e.querySelectorAll('.wj-control');
            for (var i = 0; i < c.length; i++) {
                var ctl = Control.getControl(c[i]);
                if (ctl && ctl != this && ctl.containsFocus()) {
                    return true;
                }
            }

            // see if active element is in a popup control
            // and its owner is contained in this control
            var ae = getActiveElement(),
                popup = <any>Control.getControl(closest(ae, '.wj-control.wj-popup'));
            if (popup && popup.owner && contains(this._e, popup.owner)) {
                return true;
            }

            // check for actual HTML containment
            return contains(this._e, ae);
        }
        /**
         * Invalidates the control causing an asynchronous refresh.
         *
         * @param fullUpdate Whether to update the control layout as well as the content.
         */
        invalidate(fullUpdate = true) {
            this._fullUpdate = this._fullUpdate || fullUpdate;
            if (this._toInv) {
                clearTimeout(this._toInv);
                this._toInv = null;
            }
            if (!this.isUpdating) {
                this._toInv = setTimeout(() => {
                    this.refresh(this._fullUpdate);
                }, Control._REFRESH_INTERVAL);
            }
        }
        /**
         * Refreshes the control.
         *
         * @param fullUpdate Whether to update the control layout as well as the content.
         */
        refresh(fullUpdate = true) {
            if (!this.isUpdating && this._toInv) {
                clearTimeout(this._toInv);
                this._toInv = null;
                this._fullUpdate = false;
            }
            // derived classes should override this...
        }
        /**
         * Invalidates all Wijmo controls contained in an HTML element.
         *
         * Use this method when your application has dynamic panels that change
         * the control's visibility or dimensions. For example, splitters, accordions,
         * and tab controls usually change the visibility of its content elements.
         * In this case, failing to notify the controls contained in the element
         * may cause them to stop working properly.
         *
         * If this happens, you must handle the appropriate event in the dynamic
         * container and call the @see:Control.invalidateAll method so the contained
         * Wijmo controls will update their layout information properly.
         *
         * @param e Container element. If set to null, all Wijmo controls
         * on the page will be invalidated.
         */
        static invalidateAll(e? : HTMLElement) {
            if (!e) e = document.body;
            if (e.children) {
                for (var i = 0; i < e.children.length; i++) {
                    Control.invalidateAll(<HTMLElement>e.children[i]);
                }
            }
            var ctl = Control.getControl(e);
            if (ctl) {
                ctl.invalidate();
            }
        }
        /**
         * Refreshes all Wijmo controls contained in an HTML element.
         *
         * This method is similar to @see:invalidateAll, except the controls
         * are updated immediately rather than after an interval.
         *
         * @param e Container element. If set to null, all Wijmo controls
         * on the page will be invalidated.
         */
        static refreshAll(e?: HTMLElement) {
            if (!e) e = document.body;
            if (e.children) {
                for (var i = 0; i < e.children.length; i++) {
                    Control.refreshAll(<HTMLElement>e.children[i]);
                }
            }
            var ctl = Control.getControl(e);
            if (ctl) {
                ctl.refresh();
            }
        }
        /**
         * Disposes of all Wijmo controls contained in an HTML element.
         *
         * @param e Container element.
         */
        static disposeAll(e?: HTMLElement) {
            var ctl = Control.getControl(e);
            if (ctl) {
                ctl.dispose();
            } else if (e.children) {
                for (var i = 0; i < e.children.length; i++) {
                    Control.disposeAll(<HTMLElement>e.children[i]);
                }
            }
        }
        /**
         * Suspends notifications until the next call to @see:endUpdate.
         */
        beginUpdate() {
            this._updating++;
        }
        /**
         * Resumes notifications suspended by calls to @see:beginUpdate.
         */
        endUpdate() {
            this._updating--;
            if (this._updating <= 0) {
                this.invalidate();
            }
        }
        /**
         * Gets a value that indicates whether the control is currently being updated.
         */
        get isUpdating(): boolean {
            return this._updating > 0;
        }
        /**
         * Executes a function within a @see:beginUpdate/@see:endUpdate block.
         *
         * The control will not be updated until the function has been executed.
         * This method ensures @see:endUpdate is called even if the function throws
         * an exception.
         *
         * @param fn Function to be executed. 
         */
        deferUpdate(fn: Function) {
            try {
                this.beginUpdate();
                fn();
            } finally {
                this.endUpdate();
            }
        }
        /**
         * Gets a value that indicates whether the control is currently handling a touch event.
         */
        get isTouching(): boolean {
            return Control._touching;
        }
        /**
         * Gets or sets a value that determines whether the control is disabled.
         *
         * Disabled controls cannot get mouse or keyboard events.
         */
        get isDisabled(): boolean {
            return this._e && this._e.getAttribute('disabled') != null;
        }
        set isDisabled(value: boolean) {
            value = asBoolean(value, true);
            if (value != this.isDisabled) {
                enable(this._e, !value);
            }
        }
        /*
         * Deprecated: use 'isDisabled' instead to avoid confusion with 'disabled' HTML attribute.
         */
        get disabled(): boolean {
            _deprecated('disabled', 'isDisabled');
            return this.isDisabled;
        }
        set disabled(value: boolean) {
            _deprecated('disabled', 'isDisabled');
            this.isDisabled = value;
        }
        /**
         * Initializes the control by copying the properties from a given object.
         *
         * This method allows you to initialize controls using plain data objects
         * instead of setting the value of each property in code.
         *
         * For example:
         * <pre>
         * grid.initialize({
         *   itemsSource: myList,
         *   autoGenerateColumns: false,
         *   columns: [
         *     { binding: 'id', header: 'Code', width: 130 },
         *     { binding: 'name', header: 'Name', width: 60 } 
         *   ]
         * });
         * // is equivalent to
         * grid.itemsSource = myList;
         * grid.autoGenerateColumns = false;
         * // etc.
         * </pre>
         *
         * The initialization data is type-checked as it is applied. If the 
         * initialization object contains unknown property names or invalid
         * data types, this method will throw.
         *
         * @param options Object that contains the initialization data.
         */
        initialize(options: any) {
            if (options) {
                this.beginUpdate();
                copy(this, options);
                this.endUpdate();
            }
        }
        /**
         * Adds an event listener to an element owned by this @see:Control.
         *
         * The control keeps a list of attached listeners and their handlers,
         * making it easier to remove them when the control is disposed (see the
         * @see:dispose and @see:removeEventListener method).
         *
         * Failing to remove event listeners may cause memory leaks.
         *
         * @param target Target element for the event.
         * @param type String that specifies the event.
         * @param fn Function to execute when the event occurs.
         * @param capture Whether the listener is capturing.
         */
        addEventListener(target: EventTarget, type: string, fn: any, capture = false) {
            if (target) {
                target.addEventListener(type, fn, capture);
                if (this._listeners == null) {
                    this._listeners = [];
                }
                this._listeners.push({ target: target, type: type, fn: fn, capture: capture });
            }
        }
        /**
         * Removes one or more event listeners attached to elements owned by this @see:Control.
         *
         * @param target Target element for the event. If null, removes listeners attached to all targets.
         * @param type String that specifies the event. If null, removes listeners attached to all events.
         * @param capture Whether the listener is capturing. If null, removes capturing and non-capturing listeners.
         * @return The number of listeners removed.
         */
        removeEventListener(target?: EventTarget, type?: string, capture?: boolean): number {
            var cnt = 0;
            if (this._listeners) {
                for (var i = 0; i < this._listeners.length; i++) {
                    var l = this._listeners[i];
                    if (target == null || target == l.target) {
                        if (type == null || type == l.type) {
                            if (capture == null || capture == l.capture) {
                                l.target.removeEventListener(l.type, l.fn, l.capture);
                                this._listeners.splice(i, 1);
                                i--;
                                cnt++;
                            }
                        }
                    }
                }
            }
            return cnt;
        }
        /**
         * Occurs when the control gets the focus.
         */
        gotFocus = new Event();
        /**
         * Raises the @see:gotFocus event.
         */
        onGotFocus(e?: EventArgs) {
            this.gotFocus.raise(this, e);
        }
        /**
         * Occurs when the control loses the focus.
         */
        lostFocus = new Event();
        /**
         * Raises the @see:lostFocus event.
         */
        onLostFocus(e?: EventArgs) {
            this.lostFocus.raise(this, e);
        }

        // ** implementation

        // invalidates the control when its size changes
        protected _handleResize() {
            if (this._e.parentElement) {
                var sz = new Size(this._e.offsetWidth, this._e.offsetHeight);
                if (!sz.equals(this._szCtl)) {
                    this._szCtl = sz;
                    this.invalidate();
                }
            }
        }

        // update focus state and raise got/lost focus events
        protected _updateFocusState() {

            // use a timeOut since Chrome and FF sometimes move the focus to the body
            // before moving it to the new focused element (CellTemplateIntro sample)
            setTimeout(() => {

                // update focus for this control and all ancestors as well
                for (var e = this._e; e; e = e.parentElement) {
                    var ctl = Control.getControl(e);
                    if (ctl) {
                        var focus = ctl.containsFocus();
                        if (focus != ctl._focus) {
                            ctl._focus = focus;
                            if (focus) {
                                ctl.onGotFocus();
                            } else {
                                ctl.onLostFocus();
                            }
                            ctl._updateState();
                        }
                    }
                }
            }); // no interval: TFS 146949
        }

        // update state attributes for this control (focused, empty, invalid)
        protected _updateState() {
            var host = this.hostElement;
            if (host) { // may be null (TFS 210970)
                toggleClass(host, 'wj-state-focused', this.containsFocus());
                var input = <HTMLInputElement>host.querySelector('input');
                if (input instanceof HTMLInputElement) {
                    toggleClass(host, 'wj-state-empty', input.value.length == 0);
                    toggleClass(host, 'wj-state-readonly', input.readOnly);
                    var vm = input.validationMessage; // may be null in IE9 (TFS 204492)
                    toggleClass(host, 'wj-state-invalid', vm && vm.length > 0);
                }
            }
        }

        // keep track of touch events
        protected _handleTouchStart(e) {
            if (e.pointerType == null || e.pointerType == 'touch') {
                Control._touching = true;
                //console.log('touching = true');
            }
        }
        protected _handleTouchEnd(e) {
            if (e.pointerType == null || e.pointerType == 'touch') {
                setTimeout(function () {
                    Control._touching = false;
                    //console.log('touching = false');
                }, 400); // 300ms click event delay on IOS, plus some safety
            }
        }

        // suppress mouse and keyboard events if the control is disabled
        // (pointer-events requires IE11, doesn't prevent wheel at all)
        private _handleDisabled(e: any) {
            if (this.isDisabled) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }

        // replaces an element with a div element, copying the child elements 
        // and the 'id' and 'style' attributes from the original element
        private _replaceWithDiv(element: HTMLElement) {

            // replace the element
            var div = document.createElement('div');
            element.parentElement.replaceChild(div, element);

            // copy children
            div.innerHTML = element.innerHTML;

            // copy original attributes
            var atts = element.attributes;
            for (var i = 0; i < atts.length; i++) {
                var name = atts[i].name;
                if (atts[i].name.match(/id|style|class/i)) {
                    div.setAttribute(name, atts[i].value);
                }
            }

            // return new div
            return div;
        }
    }
}