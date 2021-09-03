/**
 * Contains utilities used by all controls and modules, as well as the
 * @see:Control and @see:Event classes.
 */
module wijmo {
    'use strict';

    // major (ECMAScript version required).
    // year/trimester.
    // sequential
    var _VERSION = '5.20162.225';

    /**
     * Gets the version of the Wijmo library that is currently loaded.
     */
    export function getVersion(): string {
        return _VERSION;
    }

    /**
     * Specifies constants that represent keyboard codes.
     *
     * This enumeration is useful when handling <b>keyDown</b> events.
     */
    export enum Key {
        /** The backspace key. */
        Back = 8,
        /** The tab key. */
        Tab = 9,
        /** The enter key. */
        Enter = 13,
        /** The escape key. */
        Escape = 27,
        /** The space key. */
        Space = 32,
        /** The page up key. */
        PageUp = 33,
        /** The page down key. */
        PageDown = 34,
        /** The end key. */
        End = 35,
        /** The home key. */
        Home = 36,
        /** The left arrow key. */
        Left = 37,
        /** The up arrow key. */
        Up = 38,
        /** The right arrow key. */
        Right = 39,
        /** The down arrow key. */
        Down = 40,
        /** The delete key. */
        Delete = 46,
        /** The F1 key. */
        F1 = 112,
        /** The F2 key. */
        F2 = 113,
        /** The F3 key. */
        F3 = 114,
        /** The F4 key. */
        F4 = 115,
        /** The F5 key. */
        F5 = 116,
        /** The F6 key. */
        F6 = 117,
        /** The F7 key. */
        F7 = 118,
        /** The F8 key. */
        F8 = 119,
        /** The F9 key. */
        F9 = 120,
        /** The F10 key. */
        F10 = 121,
        /** The F11 key. */
        F11 = 122,
        /** The F12 key. */
        F12 = 123
    }

    /**
     * Specifies constants that represent data types.
     *
     * Use the @see:getType method to get a @see:DataType from a value.
     */
    export enum DataType {
        /** Object (anything). */
        Object,
        /** String. */
        String,
        /** Number. */
        Number,
        /** Boolean. */
        Boolean,
        /** Date (date and time). */
        Date,
        /** Array. */
        Array
    }

    // general-purpose utilities.
    // note: avoid letting this grow too much!!!

    /**
     * Allows callers to verify whether an object implements an interface.
     */
    export interface IQueryInterface {
        /**
         * Returns true if the object implements a given interface.
         *
         * @param interfaceName Name of the interface to look for.
         */
        implementsInterface(interfaceName: string): boolean;
    }
    /**
     * Casts a value to a type if possible.
     *
     * @param value Value to cast.
     * @param type Type or interface name to cast to.
     * @return The value passed in if the cast was successful, null otherwise.
     */
    export function tryCast(value: any, type: any): any {

        // null doesn't implement anything
        if (value == null) {
            return null;
        }

        // test for interface implementation (IQueryInterface)
        if (isString(type)) {
            return isFunction(value.implementsInterface) && value.implementsInterface(type) ? value : null;
        }

        // regular type test
        return value instanceof type ? value : null;
    }
    /**
     * Determines whether an object is a primitive type (string, number, boolean, or date).
     *
     * @param value Value to test.
     */
    export function isPrimitive(value: any): boolean {
        return isString(value) || isNumber(value) || isBoolean(value) || isDate(value);
    }
    /**
     * Determines whether an object is a string.
     *
     * @param value Value to test.
     */
    export function isString(value: any): boolean {
        return typeof (value) == 'string';
    }
    /**
     * Determines whether a string is null, empty, or whitespace only.
     *
     * @param value Value to test.
     */
    export function isNullOrWhiteSpace(value: string): boolean {
        return value == null ? true : value.replace(/\s/g, '').length < 1;
    }
    /**
     * Determines whether an object is a number.
     *
     * @param value Value to test.
     */
    export function isNumber(value: any): boolean {
        return typeof (value) == 'number';
    }
    /**
     * Determines whether an object is an integer.
     *
     * @param value Value to test.
     */
    export function isInt(value: any): boolean {
        return isNumber(value) && value == Math.round(value);
    }
    /**
     * Determines whether an object is a Boolean.
     *
     * @param value Value to test.
     */
    export function isBoolean(value: any): boolean {
        return typeof (value) == 'boolean';
    }
    /**
     * Determines whether an object is a function.
     *
     * @param value Value to test.
     */
    export function isFunction(value: any): boolean {
        return typeof (value) == 'function';
    }
    /**
     * Determines whether an object is undefined.
     *
     * @param value Value to test.
     */
    export function isUndefined(value: any): boolean {
        return typeof value == 'undefined'
    }
    /**
     * Determines whether an object is a Date.
     *
     * @param value Value to test.
     */
    export function isDate(value: any): boolean {
        return value instanceof Date && !isNaN(value.getTime());
    }
    /**
     * Determines whether an object is an Array.
     *
     * @param value Value to test.
     */
    export function isArray(value: any): boolean {
        return value instanceof Array;
    }
    /**
     * Determines whether a value is an object
     * (as opposed to a value type, an array, or a Date).
     *
     * @param value Value to test.
     */
    export function isObject(value: any): boolean {
        return value != null && typeof value == 'object' && !isDate(value) && !isArray(value);
    }

    /**
     * Converts mouse or touch event arguments into a @see:Point in page coordinates.
     */
    export function mouseToPage(e: any): Point {

        // accept Point objects
        if (e instanceof Point) {
            return e;
        }

        // accept touch events
        if (e.touches && e.touches.length > 0) {
            e = e.touches[0];
        }

        // accept mouse events
        // NOTE: we should be able to use pageX/Y properties, but those may return
        // wrong values (e.g. Android with zoomed screens); so we get the client 
        // coordinates and apply the page offset ourselves instead...
        if (isNumber(e.clientX) && isNumber(e.clientY)) {
            return new Point(e.clientX + pageXOffset, e.clientY + pageYOffset);
        }

        // wrong parameter type...
        throw 'Mouse or touch event expected.';
    }

    /**
     * Gets the type of a value.
     *
     * @param value Value to test.
     * @return A @see:DataType value representing the type of the value passed in.
     */
    export function getType(value: any): DataType {
        if (isNumber(value)) return DataType.Number;
        if (isBoolean(value)) return DataType.Boolean;
        if (isDate(value)) return DataType.Date;
        if (isString(value)) return DataType.String;
        if (isArray(value)) return DataType.Array;
        return DataType.Object;
    }
    /**
     * Changes the type of a value.
     *
     * If the conversion fails, the original value is returned. To check if a
     * conversion succeeded, you should check the type of the returned value.
     *
     * @param value Value to convert.
     * @param type @see:DataType to convert the value to.
     * @param format Format to use when converting to or from strings.
     * @return The converted value, or the original value if a conversion was not possible.
     */
    export function changeType(value: any, type: DataType, format: string): any {
        if (value != null) {

            // convert strings to numbers, dates, or booleans
            if (isString(value)) {
                switch (type) {

                    case DataType.Number:
                        var num = Globalize.parseFloat(value, format);
                        return isNaN(num) ? value : num;

                    case DataType.Date:
                        var date = Globalize.parseDate(value, format);
                        if (!date && !format && value) {
                            date = new Date(value); // fallback on JavaScript parser
                        }
                        return date && isFinite(date.getTime()) ? date : value;

                    case DataType.Boolean:
                        switch ((<string>value).toLowerCase()) {
                            case 'true': return true;
                            case 'false': return false;
                        }
                        return value; // TFS 125067
                }
            }

            // convert anything to string
            if (type == DataType.String) {
                return Globalize.format(value, format);
            }
        }

        // did not convert...
        //console.log('did not convert "' + value + '" to type ' + DataType[type]);
        return value;
    }
    /**
     * Rounds or truncates a number to a specified precision.
     *
     * @param value Value to round or truncate.
     * @param prec Number of decimal digits for the result.
     * @param truncate Whether to truncate or round the original value.
     */
    export function toFixed(value: number, prec: number, truncate: boolean): number {
        if (truncate) {
            var s = value.toString(),
                decPos = s.indexOf('.');
            if (decPos > -1) {
                s = s.substr(0, decPos + 1 + prec);
                value = parseFloat(s);
            }
        } else {
            var s = value.toFixed(prec);
            value = parseFloat(s);
        }
        return value;
    }
    /**
     * Replaces each format item in a specified string with the text equivalent of an
     * object's value.
     *
     * The function works by replacing parts of the <b>formatString</b> with the pattern
     * '{name:format}' with properties of the <b>data</b> parameter. For example:
     *
     * <pre>
     * var data = { name: 'Joe', amount: 123456 };
     * var msg = wijmo.format('Hello {name}, you won {amount:n2}!', data);
     * </pre>
     *
     * The optional <b>formatFunction</b> allows you to customize the content by providing
     * context-sensitive formatting. If provided, the format function gets called for each
     * format element and gets passed the data object, the parameter name, the format,
     * and the value; it should return an output string. For example:
     *
     * <pre>
     * var data = { name: 'Joe', amount: 123456 };
     * var msg = wijmo.format('Hello {name}, you won {amount:n2}!', data,
     *             function (data, name, fmt, val) {
     *               if (wijmo.isString(data[name])) {
     *                   val = wijmo.escapeHtml(data[name]);
     *               }
     *               return val;
     *             });
     * </pre>
     *
     * @param format A composite format string.
     * @param data The data object used to build the string.
     * @param formatFunction An optional function used to format items in context.
     * @return The formatted string.
     */
    export function format(format: string, data: any, formatFunction?: Function): string {
        format = asString(format);
        return format.replace(/\{(.*?)(:(.*?))?\}/g, function (match, name, x, fmt) {
            var val = match;
            if (name && name[0] != '{' && data) {

                // get the value
                val = data[name];

                // apply static format
                if (fmt) {
                    val = Globalize.format(val, fmt);
                }

                // apply format function
                if (formatFunction) {
                    val = formatFunction(data, name, fmt, val);
                }
            }
            return val == null ? '' : val;
        });
    }
    /**
     * Clamps a value between a minimum and a maximum.
     *
     * @param value Original value.
     * @param min Minimum allowed value.
     * @param max Maximum allowed value.
     */
    export function clamp(value: number, min: number, max: number): number {
        if (value != null) {
            if (max != null && value > max) value = max;
            if (min != null && value < min) value = min;
        }
        return value;
    }
    /**
     * Copies properties from an object to another.
     *
     * This method is typically used to initialize controls and other Wijmo objects
     * by setting their properties and assigning event handlers.
     *
     * The destination object must define all the properties defined in the source,
     * or an error will be thrown.
     *
     * @param dst The destination object.
     * @param src The source object.
     */
    export function copy(dst: any, src: any) {
        if (src) {
            for (var key in src) {
                if (key[0] != '_') { // skip non-public properties
                    assert(key in dst, 'Unknown property "' + key + '".');
                    var value = src[key];
                    if (!dst._copy || !dst._copy(key, value)) { // allow overrides
                        if (dst[key] instanceof Event && isFunction(value)) {
                            dst[key].addHandler(value); // add event handler
                        } else if (isObject(value) && dst[key] && key != 'itemsSource') {
                            copy(dst[key], value); // copy sub-objects
                        } else {
                            dst[key] = value; // assign values
                        }
                    }
                }
            }
        }
    }
    /**
     * Throws an exception if a condition is false.
     *
     * @param condition Condition expected to be true.
     * @param msg Message of the exception if the condition is not true.
     */
    export function assert(condition: boolean, msg: string) {
        if (!condition) {
            throw '** Assertion failed in Wijmo: ' + msg;
        }
    }
    /**
     * Outputs a message to indicate a member has been deprecated.
     *
     * @param oldMember Member that has been deprecated.
     * @param newMember Member that replaces the one that has been deprecated.
     */
    export function _deprecated(oldMember: string, newMember: string) {
        console.error('** WARNING: "' + oldMember + '" has been deprecated; please use "' + newMember + '" instead.');
    }
    /**
     * Asserts that a value is a string.
     *
     * @param value Value supposed to be a string.
     * @param nullOK Whether null values are acceptable.
     * @return The string passed in.
     */
    export function asString(value: string, nullOK = true): string {
        assert((nullOK && value == null) || isString(value), 'String expected.');
        return value;
    }
    /**
     * Asserts that a value is a number.
     *
     * @param value Value supposed to be numeric.
     * @param nullOK Whether null values are acceptable.
     * @param positive Whether to accept only positive numeric values.
     * @return The number passed in.
     */
    export function asNumber(value: number, nullOK = false, positive = false): number {
        assert((nullOK && value == null) || isNumber(value), 'Number expected.');
        if (positive && value && value < 0) throw 'Positive number expected.';
        return value;
    }
    /**
     * Asserts that a value is an integer.
     *
     * @param value Value supposed to be an integer.
     * @param nullOK Whether null values are acceptable.
     * @param positive Whether to accept only positive integers.
     * @return The number passed in.
     */
    export function asInt(value: number, nullOK = false, positive = false): number {
        assert((nullOK && value == null) || isInt(value), 'Integer expected.');
        if (positive && value && value < 0) throw 'Positive integer expected.';
        return value;
    }
    /**
     * Asserts that a value is a Boolean.
     *
     * @param value Value supposed to be Boolean.
     * @param nullOK Whether null values are acceptable.
     * @return The Boolean passed in.
     */
    export function asBoolean(value: boolean, nullOK = false): boolean {
        assert((nullOK && value == null) || isBoolean(value), 'Boolean expected.');
        return value;
    }
    /**
     * Asserts that a value is a Date.
     *
     * @param value Value supposed to be a Date.
     * @param nullOK Whether null values are acceptable.
     * @return The Date passed in.
     */
    export function asDate(value: Date, nullOK = false): Date {

        // parse strings into dates using RFC 3339 pattern ([yyyy-MM-dd] [hh:mm[:ss]])
        if (isString(value)) {
            var dt = changeType(value, DataType.Date, 'r');
            if (isDate(dt)) {
                value = dt;
            }
        }

        assert((nullOK && value == null) || isDate(value), 'Date expected.');
        return value;
    }
    /**
     * Asserts that a value is a function.
     *
     * @param value Value supposed to be a function.
     * @param nullOK Whether null values are acceptable.
     * @return The function passed in.
     */
    export function asFunction(value: any, nullOK = true): Function {
        assert((nullOK && value == null) || isFunction(value), 'Function expected.');
        return value;
    }
    /**
     * Asserts that a value is an array.
     *
     * @param value Value supposed to be an array.
     * @param nullOK Whether null values are acceptable.
     * @return The array passed in.
     */
    export function asArray(value: any, nullOK = true): any[] {
        assert((nullOK && value == null) || isArray(value), 'Array expected.');
        return value;
    }
    /**
     * Asserts that a value is an instance of a given type.
     *
     * @param value Value to be checked.
     * @param type Type of value expected.
     * @param nullOK Whether null values are acceptable.
     * @return The value passed in.
     */
    export function asType(value: any, type: any, nullOK = false): any {
        value = tryCast(value, type);
        assert(nullOK || value != null, type + ' expected.');
        return value;
    }
    /**
     * Asserts that a value is a valid setting for an enumeration.
     *
     * @param value Value supposed to be a member of the enumeration.
     * @param enumType Enumeration to test for.
     * @param nullOK Whether null values are acceptable.
     * @return The value passed in.
     */
    export function asEnum(value: number, enumType: any, nullOK = false): number {
        if (value == null && nullOK) return null;
        var e = enumType[value];
        assert(e != null, 'Invalid enum value.');
        return isNumber(e) ? e : value;
    }
    /**
     * Asserts that a value is an @see:ICollectionView or an Array.
     *
     * @param value Array or @see:ICollectionView.
     * @param nullOK Whether null values are acceptable.
     * @return The @see:ICollectionView that was passed in or a @see:CollectionView
     * created from the array that was passed in.
     */
    export function asCollectionView(value: any, nullOK = true): collections.ICollectionView {
        if (value == null && nullOK) {
            return null;
        }
        var cv = tryCast(value, 'ICollectionView');
        if (cv != null) {
            return cv;
        }
        if (!isArray(value)) {
            assert(false, 'Array or ICollectionView expected.');
        }
        return new collections.CollectionView(value);
    }
    /**
     * Checks whether an @see:ICollectionView is defined and not empty.
     *
     * @param value @see:ICollectionView to check.
     */
    export function hasItems(value: collections.ICollectionView) {
        return value && value.items && value.items.length;
    }
    /**
     * Converts a camel-cased string into a header-type string by capitalizing the first letter
     * and adding spaces before uppercase characters preceded by lower-case characters.
     *
     * For example, 'somePropertyName' becomes 'Some Property Name'.
     *
     * @param text String to convert to header case.
     */
    export function toHeaderCase(text: string): string {
        return text && text.length
            ? text[0].toUpperCase() + text.substr(1).replace(/([a-z])([A-Z])/g, '$1 $2')
            : '';
    }
    /**
     * Escapes a string by replacing HTML characters as text entities.
     *
     * Strings entered by uses should always be escaped before they are displayed
     * in HTML pages. This ensures page integrity and prevents HTML/javascript
     * injection attacks.
     *
     * @param text Text to escape.
     * @return An HTML-escaped version of the original string.
     */
    export function escapeHtml(text: string) {
        if (isString(text)) {
            text = text.replace(/[&<>"'\/]/g, function (s) {
                return _ENTITYMAP[s];
            });
        }
        return text;
    }
    var _ENTITYMAP = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;'
    };
    /**
     * Checks whether an element has a class.
     *
     * @param e Element to check.
     * @param className Class to check for.
     */
    export function hasClass(e: HTMLElement, className: string): boolean {

        // NOTE: using e.getAttribute('class') instead of e.classNames
        // so this works with SVG as well as regular HTML elements.
        // NOTE: don't use word boundaries because class names may have 
        // hyphens and other non-word boundary characters
        if (e && e.getAttribute) {
            var rx = new RegExp('(\\s|^)' + className + '(\\s|$)');
            return e && rx.test(e.getAttribute('class'));
        }
        return false;
    }
    /**
     * Removes a class from an element.
     *
     * @param e Element that will have the class removed.
     * @param className Class to remove form the element.
     */
    export function removeClass(e: HTMLElement, className: string) {
        if (e && className && e.setAttribute && hasClass(e, className)) {
            var rx = new RegExp('((\\s|^)' + className + '(\\s|$))', 'g'),
                cn = e.getAttribute('class');
            cn = cn.replace(rx, ' ').replace(/ +/g, ' ').trim();
            e.setAttribute('class', cn);
        }
    }
    /**
     * Adds a class to an element.
     *
     * @param e Element that will have the class added.
     * @param className Class to add to the element.
     */
    export function addClass(e: HTMLElement, className: string) {
        if (e && className && e.setAttribute && !hasClass(e, className)) {
            var cn = e.getAttribute('class');
            e.setAttribute('class', cn ? cn + ' ' + className : className);
        }
    }
    /**
     * Adds or removes a class to or from an element.
     *
     * @param e Element that will have the class added.
     * @param className Class to add or remove.
     * @param addOrRemove Whether to add or remove the class.
     * Use true to add class to element and false to remove class from element.
     */
    export function toggleClass(e: HTMLElement, className: string, addOrRemove: boolean) {
        if (addOrRemove) {
            addClass(e, className);
        } else {
            removeClass(e, className);
        }
    }
    /**
     * Sets the start and end positions of a selection in a text field.
     *
     * This method is similar to the native @see:setSelectionRange method
     * in HTMLInputElement objects, except it checks for conditions that
     * may cause exceptions (element not in the DOM, disabled, or hidden).
     *
     * @param start Offset into the text field for the start of the selection.
     * @param end Offset into the text field for the end of the selection.
     */
    export function setSelectionRange(e: HTMLInputElement, start: number, end = start) {
        e = asType(e, HTMLInputElement);
        if (contains(document.body, e) && !e.disabled && e.style.display != 'none') {
            try {
                e.focus(); // needed in Chrome (TFS 124102, 142672)
                e.setSelectionRange(asNumber(start), asNumber(end));
            } catch (x) { }
        }
    }
    /**
     * Gets a reference to the element that contains the focus,
     * accounting for shadow document fragments.
     */
    export function getActiveElement() {
        var ae = <HTMLElement>document.activeElement;
        if (ae) {
            // account for shadowRoot: https://github.com/w3c/webcomponents/issues/358)
            var shadowRoot = ae['shadowRoot'];
            if (shadowRoot && shadowRoot.activeElement) {
                ae = shadowRoot.activeElement;
            }
        }
        return ae;
    }
    /**
     * Moves the focus to the next/previous/first focusable child element.
     *
     * @param parent Parent element.
     * @param offset Offset to use when moving the focus (use zero to focus on the first focusable child).
     */
    export function moveFocus(parent: HTMLElement, offset: number) {

        // build array of focusable elements (including divs and spans)
        var tags = 'input,select,textarea,button,a,div,span',
            elements = parent.querySelectorAll(tags),
            focusable = [];
        for (var i = 0; i < elements.length; i++) {
            var el = <HTMLInputElement>elements[i];
            if (el.clientHeight > 0 && // visible
                el.tabIndex > -1 && // focusable
                !el.disabled && !closest(el, '[disabled],.wj-state-disabled') && // enabled
                !el.querySelector(tags)) { // not a parent element (TFS 208262)
                focusable.push(el);
            }
        }

        // calculate focus index
        var index = 0;
        if (offset) {
            var i = focusable.indexOf(getActiveElement());
            if (i > -1) {
                index = (i + offset + focusable.length) % focusable.length; // TFS 152269, 152163
            }
        }

        // move focus to element at the focus index
        if (index < focusable.length) {
            var el = <HTMLInputElement>focusable[index];
            el.focus();
            if (el instanceof HTMLInputElement) {
                el.select(); // TFS 190336
            }
        }
    }

    // ** jQuery replacement methods

    /**
     * Gets an element from a jQuery-style selector.
     *
     * @param selector An element, a query selector string, or a jQuery object.
     */
    export function getElement(selector: any): HTMLElement {
        if (selector instanceof Element) return selector;
        if (isString(selector)) return <HTMLElement>document.querySelector(selector);
        if (selector && selector.jquery) return selector[0];
        return null;
    }
    /**
     * Creates an element from an HTML string.
     *
     * @param html HTML fragment to convert into an HTMLElement.
     * @param appendTo Optional HTMLElement to append the new element to.
     * @return The new element.
     */
    export function createElement(html: string, appendTo?: HTMLElement): HTMLElement {
        var div = document.createElement('div');
        div.innerHTML = html;
        var e = <HTMLElement>div.removeChild(div.firstChild);
        return (appendTo instanceof HTMLElement)
            ? <HTMLElement>appendTo.appendChild(e)
            : e;
    }
    /**
     * Sets the text content of an element.
     *
     * @param e Element that will have its content updated.
     * @param text Plain text to be assigned to the element.
     */
    export function setText(e: HTMLElement, text: string) {

        // clear
        if (text == null) {
            if (e.hasChildNodes()) {

                // this causes serious/weird problems in IE, so DON'T DO IT!!! 
                //e.innerHTML = '';

                // this works, but seems inefficient/convoluted
                //var dr = document.createRange();
                //dr.setStart(e, 0);
                //dr.setEnd(e, e.childNodes.length);
                //dr.deleteContents();

                // seems like the best option (simple and works)
                e.textContent = '';
            }
            return;
        }

        // set text
        var fc = e.firstChild;
        if (e.childNodes.length == 1 && fc.nodeType == 3) {
            if (fc.nodeValue != text) {
                fc.nodeValue = text; // update text directly in the text node
            }
        } else if (fc || text) {
            e.textContent = text; // something else, set the textContent
        }
    }
    /**
     * Checks whether an HTML element contains another.
     *
     * @param parent Parent element.
     * @param child Child element.
     * @return True if the parent element contains the child element.
     */
    export function contains(parent: any, child: any): boolean {
        for (var e = <Node>child; e && parent;) {
            if (e === parent) return true; // found!
            e = e.parentNode || e['host']; // move up to parent node or host (shadow DOM)
        }
        return false;
    }
    /**
     * Finds the closest ancestor that satisfies a selector.
     *
     * @param e Element where the search should start.
     * @param selector A string containing a selector expression to match elements against.
     * @return The closest ancestor that satisfies the selector (including the original element), or null if not found.
     */
    export function closest(e: any, selector: string): Node {
        var matches = e ? (e.matches || e.webkitMatchesSelector || e.mozMatchesSelector || e.msMatchesSelector) : null;
        if (matches) {
            for (; e; e = e.parentNode) {
                if (e instanceof Element && matches.call(e, selector)) {
                    return e;
                }
            }
        }
        return null;
    }
    /**
     * Enables or disables an element.
     *
     * @param e Element to enable or disable.
     * @param value Whether to enable or disable the element.
     */
    export function enable(e: HTMLElement, value: boolean) {

        // update wj-state-disabled class and disabled attribute on the element
        toggleClass(e, 'wj-state-disabled', !value);
        if (value) {
            e.removeAttribute('disabled');
        } else {
            e.setAttribute('disabled', 'true');
        }

        // update disabled attribute on inner input elements (TFS 190939)
        var inputs = e.querySelectorAll('input');
        for (var i = 0; i < inputs.length; i++) {
            var input = <HTMLElement>inputs[i];
            if (value) {
                input.removeAttribute('disabled');
            } else {
                input.setAttribute('disabled', 'true');
            }
        }
    }
    /**
     * Gets the bounding rectangle of an element in page coordinates.
     *
     * This is similar to the <b>getBoundingClientRect</b> function,
     * except that uses window coordinates, which change when the
     * document scrolls.
     */
    export function getElementRect(e: Element): Rect {
        var rc = e.getBoundingClientRect();
        return new Rect(rc.left + pageXOffset, rc.top + pageYOffset, rc.width, rc.height);
    }
    /**
     * Modifies the style of an element by applying the properties specified in an object.
     *
     * @param e Element or array of elements whose style will be modified.
     * @param css Object containing the style properties to apply to the element.
     */
    export function setCss(e: any, css: any) {

        // apply to arrays
        if (isArray(e)) {
            e.forEach((item) => {
                setCss(item, css);
            });
            return;
        }

        // apply to elements
        var s = e.style;
        for (var p in css) {

            // add pixel units to numeric geometric properties
            var val = css[p];
            if (typeof (val) == 'number' &&
                p.match(/width|height|left|top|right|bottom|size|padding|margin'/i)) {
                val += 'px';
            }

            // set the attribute if it changed
            if (s[p] != val) {
                s[p] = val.toString();
            }
        }
    }
    /**
     * Calls a function on a timer with a parameter varying between zero and one.
     *
     * Use this function to create animations by modifying document properties
     * or styles on a timer.
     *
     * For example, the code below changes the opacity of an element from zero
     * to one in one second:
     * <pre>var element = document.getElementById('someElement');
     * animate(function(pct) {
     *   element.style.opacity = pct;
     * }, 1000);</pre>
     *
     * The function returns an interval ID that you can use to stop the
     * animation. This is typically done when you are starting a new animation
     * and wish to suspend other on-going animations on the same element.
     * For example, the code below keeps track of the interval ID and clears
     * if before starting a new animation:
     * <pre>var element = document.getElementById('someElement');
     * if (this._animInterval) {
     *   clearInterval(this._animInterval);
     * }
     * var self = this;
     * self._animInterval = animate(function(pct) {
     *   element.style.opacity = pct;
     *   if (pct == 1) {
     *     self._animInterval = null;
     *   }
     * }, 1000);</pre>
     *
     * @param apply Callback function that modifies the document.
     * The function takes a single parameter that represents a percentage.
     * @param duration The duration of the animation, in milliseconds.
     * @param step The interval between animation frames, in milliseconds.
     * @return An interval id that you can use to suspend the animation.
     */
    export function animate(apply: Function, duration = 400, step = 35): number {
        asFunction(apply);
        asNumber(duration, false, true);
        asNumber(step, false, true);

        var start = Date.now();
        var timer = setInterval(function () {
            var pct = Math.min(1, (Date.now() - start) / duration); // linear
            pct = Math.sin(pct * Math.PI / 2); // easeOutSin
            pct *= pct; // swing
            requestAnimationFrame(function () {
                apply(pct);
            });
            if (pct >= 1) { // done!
                clearInterval(timer);
            }
        }, step);
        return timer;
    }


    // ** utility classes

    /**
     * Class that represents a point (with x and y coordinates).
     */
    export class Point {
        /**
         * Gets or sets the x coordinate of this @see:Point.
         */
        x: number;
        /**
         * Gets or sets the y coordinate of this @see:Point.
         */
        y: number;
        /**
         * Initializes a new instance of the @see:Point class.
         *
         * @param x X coordinate of the new Point.
         * @param y Y coordinate of the new Point.
         */
        constructor(x: number = 0, y: number = 0) {
            this.x = asNumber(x);
            this.y = asNumber(y);
        }
        /**
         * Returns true if a @see:Point has the same coordinates as this @see:Point.
         *
         * @param pt @see:Point to compare to this @see:Point.
         */
        equals(pt: Point): boolean {
            return (pt instanceof Point) && this.x == pt.x && this.y == pt.y;
        }
        /**
         * Creates a copy of this @see:Point.
         */
        clone(): Point {
            return new Point(this.x, this.y);
        }
    }

    /**
     * Class that represents a size (with width and height).
     */
    export class Size {
        /**
         * Gets or sets the width of this @see:Size.
         */
        width: number;
        /**
         * Gets or sets the height of this @see:Size.
         */
        height: number;
        /**
         * Initializes a new instance of the @see:Size class.
         *
         * @param width Width of the new @see:Size.
         * @param height Height of the new @see:Size.
         */
        constructor(width = 0, height = 0) {
            this.width = asNumber(width);
            this.height = asNumber(height);
        }
        /**
         * Returns true if a @see:Size has the same dimensions as this @see:Size.
         *
         * @param sz @see:Size to compare to this @see:Size.
         */
        equals(sz: Size): boolean {
            return (sz instanceof Size) && this.width == sz.width && this.height == sz.height;
        }
        /**
         * Creates a copy of this @see:Size.
         */
        clone(): Size {
            return new Size(this.width, this.height);
        }
    }

    /**
     * Class that represents a rectangle (with left, top, width, and height).
     */
    export class Rect {
        /**
         * Gets or sets the left coordinate of this @see:Rect.
         */
        left: number;
        /**
         * Gets or sets the top coordinate of this @see:Rect.
         */
        top: number;
        /**
         * Gets or sets the width of this @see:Rect.
         */
        width: number;
        /**
         * Gets or sets the height of this @see:Rect.
         */
        height: number;
        /**
         * Initializes a new instance of the @see:Rect class.
         *
         * @param left Left coordinate of the new @see:Rect.
         * @param top Top coordinate of the new @see:Rect.
         * @param width Width of the new @see:Rect.
         * @param height Height of the new @see:Rect.
         */
        constructor(left: number, top: number, width: number, height: number) {
            this.left = asNumber(left);
            this.top = asNumber(top);
            this.width = asNumber(width);
            this.height = asNumber(height);
        }
        /**
         * Gets the right coordinate of this @see:Rect.
         */
        get right(): number {
            return this.left + this.width;
        }
        /**
         * Gets the bottom coordinate of this @see:Rect.
         */
        get bottom(): number {
            return this.top + this.height;
        }
        /**
         * Returns true if a @see:Rect has the same coordinates and dimensions
         * as this @see:Rect.
         *
         * @param rc @see:Rect to compare to this @see:Rect.
         */
        equals(rc: Rect): boolean {
            return (rc instanceof Rect) && this.left == rc.left && this.top == rc.top && this.width == rc.width && this.height == rc.height;
        }
        /**
         * Creates a copy of this @see:Rect.
         */
        clone(): Rect {
            return new Rect(this.left, this.top, this.width, this.height);
        }
        /**
         * Creates a @see:Rect from <b>ClientRect</b> or <b>SVGRect</b> objects.
         *
         * @param rc Rectangle obtained by a call to the DOM's <b>getBoundingClientRect</b>
         * or <b>GetBoundingBox</b> methods.
         */
        static fromBoundingRect(rc: any): Rect {
            if (rc.left != null) {
                return new Rect(rc.left, rc.top, rc.width, rc.height);
            } else if (rc.x != null) {
                return new Rect(rc.x, rc.y, rc.width, rc.height);
            } else {
                assert(false, 'Invalid source rectangle.');
        }
        }
        /**
         * Gets a rectangle that represents the union of two rectangles.
         *
         * @param rc1 First rectangle.
         * @param rc2 Second rectangle.
         */
        static union(rc1: Rect, rc2: Rect): Rect {
            var x = Math.min(rc1.left, rc2.left),
                y = Math.min(rc1.top, rc2.top),
                right = Math.max(rc1.right, rc2.right),
                bottom = Math.max(rc1.bottom, rc2.bottom);
            return new Rect(x, y, right - x, bottom - y);
        }
        /**
         * Gets a rectangle that represents the intersection of two rectangles.
         *
         * @param rc1 First rectangle.
         * @param rc2 Second rectangle.
         */
        static intersection(rc1: Rect, rc2: Rect): Rect {
            var x = Math.max(rc1.left, rc2.left),
                y = Math.max(rc1.top, rc2.top),
                right = Math.min(rc1.right, rc2.right),
                bottom = Math.min(rc1.bottom, rc2.bottom);
            return new Rect(x, y, right - x, bottom - y);
        }
        /**
         * Determines whether the rectangle contains a given point or rectangle.
         *
         * @param pt The @see:Point or @see:Rect to ckeck.
         */
        contains(pt: any): boolean {
            if (pt instanceof Point) {
                return pt.x >= this.left && pt.x <= this.right &&
                    pt.y >= this.top && pt.y <= this.bottom;
            } else if (pt instanceof Rect) {
                var rc2 = <Rect>pt;
                return rc2.left >= this.left && rc2.right <= this.right &&
                    rc2.top >= this.top && rc2.bottom <= this.bottom;
            } else {
                assert(false, 'Point or Rect expected.');
            }
        }
        /**
         * Creates a rectangle that results from expanding or shrinking a rectangle by the specified amounts.
         *
         * @param dx The amount by which to expand or shrink the left and right sides of the rectangle.
         * @param dy The amount by which to expand or shrink the top and bottom sides of the rectangle.
         */
        inflate(dx: number, dy: number): Rect {
            return new Rect(this.left - dx, this.top - dy, this.width + 2 * dx, this.height + 2 * dy);
        }
    }

    /**
     * Provides date and time utilities.
     */
    export class DateTime {

        /**
         * Gets a new Date that adds the specified number of days to a given Date.
         *
         * @param value Original date.
         * @param days Number of days to add to the given date.
         */
        static addDays(value: Date, days: number): Date {
            return new Date(value.getFullYear(), value.getMonth(), value.getDate() + days);
        }
        /**
         * Gets a new Date that adds the specified number of months to a given Date.
         *
         * @param value Original date.
         * @param months Number of months to add to the given date.
         */
        static addMonths(value: Date, months: number): Date {
            return new Date(value.getFullYear(), value.getMonth() + months, value.getDate());
        }
        /**
         * Gets a new Date that adds the specified number of years to a given Date.
         *
         * @param value Original date.
         * @param years Number of years to add to the given date.
         */
        static addYears(value: Date, years: number): Date {
            return new Date(value.getFullYear() + years, value.getMonth(), value.getDate());
        }
        /**
         * Gets a new Date that adds the specified number of hours to a given Date.
         *
         * @param value Original date.
         * @param hours Number of hours to add to the given date.
         */
        static addHours(value: Date, hours: number): Date {
            return new Date(value.getFullYear(), value.getMonth(), value.getDate(), value.getHours() + hours);
        }
        /**
         * Gets a new Date that adds the specified number of minutes to a given Date.
         *
         * @param value Original date.
         * @param minutes Number of minutes to add to the given date.
         */
        static addMinutes(value: Date, minutes: number): Date {
            return new Date(value.getFullYear(), value.getMonth(), value.getDate(), value.getHours(), value.getMinutes() + minutes);
        }
        /**
         * Gets a new Date that adds the specified number of seconds to a given Date.
         *
         * @param value Original date.
         * @param seconds Number of seconds to add to the given date.
         */
        static addSeconds(value: Date, seconds: number): Date {
            return new Date(value.getFullYear(), value.getMonth(), value.getDate(), value.getHours(), value.getMinutes(), value.getSeconds() + seconds);
        }
        /**
         * Returns true if two Date objects refer to the same date (ignoring time).
         *
         * @param d1 First date.
         * @param d2 Second date.
         */
        static sameDate(d1: Date, d2: Date): boolean {
            return isDate(d1) && isDate(d2) &&
                d1.getFullYear() == d2.getFullYear() &&
                d1.getMonth() == d2.getMonth() &&
                d1.getDate() == d2.getDate();
        }
        /**
         * Returns true if two Date objects refer to the same time (ignoring date).
         *
         * @param d1 First date.
         * @param d2 Second date.
         */
        static sameTime(d1: Date, d2: Date): boolean {
            return isDate(d1) && isDate(d2) &&
                d1.getHours() == d2.getHours() &&
                d1.getMinutes() == d2.getMinutes() &&
                d1.getSeconds() == d2.getSeconds();
        }
        /**
         * Returns true if two Date objects refer to the same date and time.
         *
         * @param d1 First date.
         * @param d2 Second date.
         */
        static equals(d1: Date, d2: Date): boolean {
            return isDate(d1) && isDate(d2) && d1.getTime() == d2.getTime();
        }
        /**
         * Gets a Date object with the date and time set on two Date objects.
         *
         * @param date Date object that contains the date (day/month/year).
         * @param time Date object that contains the time (hour:minute:second).
         */
        static fromDateTime(date: Date, time: Date): Date {
            if (!date && !time) return null;
            if (!date) date = time;
            if (!time) time = date;
            return new Date(
                date.getFullYear(), date.getMonth(), date.getDate(),
                time.getHours(), time.getMinutes(), time.getSeconds());
        }
        /**
         * Converts a calendar date to a fiscal date using the current culture.
         *
         * @param date Calendar date.
         * @param govt Whether to use the government or corporate fiscal year.
         */
        static toFiscal(date: Date, govt: boolean) {
            var cal = wijmo.culture.Globalize.calendar;
            return isArray(cal.fiscalYearOffsets)
                ? DateTime.addMonths(date, -cal.fiscalYearOffsets[govt ? 0 : 1])
                : date;
        }
        /**
         * Converts a fiscal year date to a calendar date using the current culture.
         *
         * @param date Fiscal year date.
         * @param govt Whether to use the government or corporate fiscal year.
         */
        static fromFiscal(date: Date, govt: boolean) {
            var cal = wijmo.culture.Globalize.calendar;
            return isArray(cal.fiscalYearOffsets)
                ? DateTime.addMonths(date, +cal.fiscalYearOffsets[govt ? 0 : 1])
                : date;
        }
        /**
         * Gets a new Date object set to today's date and no time portion.
         */
        static newDate(): Date {
            var dt = new Date();
            return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
        }
        /**
         * Creates a copy of a given Date object.
         *
         * @param date Date object to copy.
         */
        static clone(date: Date): Date {
            return DateTime.fromDateTime(date, date);
        }
    }

    /**
     * Performs HTTP requests.
     *
     * @param url String containing the URL to which the request is sent.
     * @param settings An optional object used to configure the request.
     *
     * The <b>settings</b> object may contain the following:
     *
     * <table>
     * <tr>
     *   <td><b>method</b></td>
     *   <td>The HTTP method to use for the request (e.g. "POST", "GET", "PUT").
     *       The default is "GET".</td>
     * </tr>
     * <tr>
     *   <td><b>data</b></td>
     *   <td>Data to be sent to the server. It is appended to the url for GET requests,
     *       and converted to a string for other requests.</td>
     * </tr>
     * <tr>
     *   <td><b>async</b></td>
     *   <td>By default, all requests are sent asynchronously (i.e. this is set to true by default).
     *       If you need synchronous requests, set this option to false.</td>
     * </tr>
     * <tr>
     *   <td><b>success</b></td>
     *   <td>A function to be called if the request succeeds.
     *       The function gets passed a single parameter of type <b>XMLHttpRequest</b>.</td>
     * </tr>
     * <tr>
     *   <td><b>error</b></td>
     *   <td>A function to be called if the request fails.
     *       The function gets passed a single parameter of type <b>XMLHttpRequest</b>.</td>
     * </tr>
     * <tr>
     *   <td><b>complete</b></td>
     *   <td>A function to be called when the request finishes (after success and error callbacks are executed).
     *       The function gets passed a single parameter of type <b>XMLHttpRequest</b>.</td>
     * </tr>
     * <tr>
     *   <td><b>beforeSend</b></td>
     *   <td>A function to be called immediately before the request us sent.
     *       The function gets passed a single parameter of type <b>XMLHttpRequest</b>.</td>
     * </tr>
     * <tr>
     *   <td><b>requestHeaders</b></td>
     *   <td>A JavaScript object containing key/value pairs to be added to the request
     *       headers.</td>
     * </tr>
     * <tr>
     *   <td><b>user</b></td>
     *   <td>A username to be used with <b>XMLHttpRequest</b> in response to an HTTP access
     *       authentication request.</td>
     * </tr>
     * <tr>
     *   <td><b>password</b></td>
     *   <td>A password to be used with <b>XMLHttpRequest</b> in response to an HTTP access
     *       authentication request.</td>
     * </tr>
     * </table>
     *
     * Use the <b>success</b> to obtain the result of the request which is provided in
     * the callback's <b>XMLHttpRequest</b> parameter. For example, the code below uses
     * the @see:httpRequest method to retrieve a list of customers from an OData service:
     *
     * <pre>wijmo.httpRequest('http://services.odata.org/Northwind/Northwind.svc/Customers?$format=json', {
     *   success: function (xhr) {
     *     var response = JSON.parse(xhr.response),
     *         customers = response.value;
     *     // do something with the customers...
     *   }
     * });</pre>
     *
     * @return The <b>XMLHttpRequest</b> object used to perform the request.
     */
    export function httpRequest(url: string, settings?: any): XMLHttpRequest {
        if (!settings) settings = {};

        // select method and basic options
        var method = settings.method ? asString(settings.method).toUpperCase() : 'GET',
            async = settings.async != null ? asBoolean(settings.async) : true,
            data = settings.data;

        // convert data to url parameters for GET requests
        if (data != null && method == 'GET') {
            var s = [];
            for (var k in data) {
                s.push(k + '=' + data[k]);
            }
            if (s.length) {
                var sep = url.indexOf('?') < 0 ? '?' : '&';
                url += sep + s.join('&');
            }
            data = null;
        }

        // create the request
        var xhr = new XMLHttpRequest();
        xhr['URL_DEBUG'] = url; // add some debug info

        // if the data is not a string, stringify it
        var isJson = false;
        if (data != null && !isString(data)) {
            isJson = isObject(data);
            data = JSON.stringify(data);
        }

        // callbacks
        xhr.onload = function () {
            if (xhr.readyState == 4) {
                if (xhr.status < 300) {
                    if (settings.success) {
                        asFunction(settings.success)(xhr);
                    }
                } else if (settings.error) {
                    asFunction(settings.error)(xhr);
                }
                if (settings.complete) {
                    asFunction(settings.complete)(xhr);
                }
            }
        };
        xhr.onerror = function () {
            if (settings.error) {
                asFunction(settings.error)(xhr);
            } else {
                throw 'HttpRequest Error: ' + xhr.status + ' ' + xhr.statusText;
            }
        };

        // send the request
        xhr.open(method, url, async, settings.user, settings.password);
        if (settings.user && settings.password) {
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(settings.user + ':' + settings.password))
        }
        if (isJson) {
            xhr.setRequestHeader('Content-Type', 'application/json');
        }
        if (settings.requestHeaders) {
            for (var key in settings.requestHeaders) {
                xhr.setRequestHeader(key, settings.requestHeaders[key])
            }
        }
        if (isFunction(settings.beforeSend)) {
            settings.beforeSend(xhr);
        }
        xhr.send(data);

        // return the request
        return xhr;
    }
}