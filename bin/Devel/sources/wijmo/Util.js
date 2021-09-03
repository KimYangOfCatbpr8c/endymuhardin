/**
 * Contains utilities used by all controls and modules, as well as the
 * @see:Control and @see:Event classes.
 */
var wijmo;
(function (wijmo) {
    'use strict';
    // major (ECMAScript version required).
    // year/trimester.
    // sequential
    var _VERSION = '5.20162.207';
    /**
     * Gets the version of the Wijmo library that is currently loaded.
     */
    function getVersion() {
        return _VERSION;
    }
    wijmo.getVersion = getVersion;
    /**
     * Specifies constants that represent keyboard codes.
     *
     * This enumeration is useful when handling <b>keyDown</b> events.
     */
    (function (Key) {
        /** The backspace key. */
        Key[Key["Back"] = 8] = "Back";
        /** The tab key. */
        Key[Key["Tab"] = 9] = "Tab";
        /** The enter key. */
        Key[Key["Enter"] = 13] = "Enter";
        /** The escape key. */
        Key[Key["Escape"] = 27] = "Escape";
        /** The space key. */
        Key[Key["Space"] = 32] = "Space";
        /** The page up key. */
        Key[Key["PageUp"] = 33] = "PageUp";
        /** The page down key. */
        Key[Key["PageDown"] = 34] = "PageDown";
        /** The end key. */
        Key[Key["End"] = 35] = "End";
        /** The home key. */
        Key[Key["Home"] = 36] = "Home";
        /** The left arrow key. */
        Key[Key["Left"] = 37] = "Left";
        /** The up arrow key. */
        Key[Key["Up"] = 38] = "Up";
        /** The right arrow key. */
        Key[Key["Right"] = 39] = "Right";
        /** The down arrow key. */
        Key[Key["Down"] = 40] = "Down";
        /** The delete key. */
        Key[Key["Delete"] = 46] = "Delete";
        /** The F1 key. */
        Key[Key["F1"] = 112] = "F1";
        /** The F2 key. */
        Key[Key["F2"] = 113] = "F2";
        /** The F3 key. */
        Key[Key["F3"] = 114] = "F3";
        /** The F4 key. */
        Key[Key["F4"] = 115] = "F4";
        /** The F5 key. */
        Key[Key["F5"] = 116] = "F5";
        /** The F6 key. */
        Key[Key["F6"] = 117] = "F6";
        /** The F7 key. */
        Key[Key["F7"] = 118] = "F7";
        /** The F8 key. */
        Key[Key["F8"] = 119] = "F8";
        /** The F9 key. */
        Key[Key["F9"] = 120] = "F9";
        /** The F10 key. */
        Key[Key["F10"] = 121] = "F10";
        /** The F11 key. */
        Key[Key["F11"] = 122] = "F11";
        /** The F12 key. */
        Key[Key["F12"] = 123] = "F12";
    })(wijmo.Key || (wijmo.Key = {}));
    var Key = wijmo.Key;
    /**
     * Specifies constants that represent data types.
     *
     * Use the @see:getType method to get a @see:DataType from a value.
     */
    (function (DataType) {
        /** Object (anything). */
        DataType[DataType["Object"] = 0] = "Object";
        /** String. */
        DataType[DataType["String"] = 1] = "String";
        /** Number. */
        DataType[DataType["Number"] = 2] = "Number";
        /** Boolean. */
        DataType[DataType["Boolean"] = 3] = "Boolean";
        /** Date (date and time). */
        DataType[DataType["Date"] = 4] = "Date";
        /** Array. */
        DataType[DataType["Array"] = 5] = "Array";
    })(wijmo.DataType || (wijmo.DataType = {}));
    var DataType = wijmo.DataType;
    /**
     * Casts a value to a type if possible.
     *
     * @param value Value to cast.
     * @param type Type or interface name to cast to.
     * @return The value passed in if the cast was successful, null otherwise.
     */
    function tryCast(value, type) {
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
    wijmo.tryCast = tryCast;
    /**
     * Determines whether an object is a primitive type (string, number, boolean, or date).
     *
     * @param value Value to test.
     */
    function isPrimitive(value) {
        return isString(value) || isNumber(value) || isBoolean(value) || isDate(value);
    }
    wijmo.isPrimitive = isPrimitive;
    /**
     * Determines whether an object is a string.
     *
     * @param value Value to test.
     */
    function isString(value) {
        return typeof (value) == 'string';
    }
    wijmo.isString = isString;
    /**
     * Determines whether a string is null, empty, or whitespace only.
     *
     * @param value Value to test.
     */
    function isNullOrWhiteSpace(value) {
        return value == null ? true : value.replace(/\s/g, '').length < 1;
    }
    wijmo.isNullOrWhiteSpace = isNullOrWhiteSpace;
    /**
     * Determines whether an object is a number.
     *
     * @param value Value to test.
     */
    function isNumber(value) {
        return typeof (value) == 'number';
    }
    wijmo.isNumber = isNumber;
    /**
     * Determines whether an object is an integer.
     *
     * @param value Value to test.
     */
    function isInt(value) {
        return isNumber(value) && value == Math.round(value);
    }
    wijmo.isInt = isInt;
    /**
     * Determines whether an object is a Boolean.
     *
     * @param value Value to test.
     */
    function isBoolean(value) {
        return typeof (value) == 'boolean';
    }
    wijmo.isBoolean = isBoolean;
    /**
     * Determines whether an object is a function.
     *
     * @param value Value to test.
     */
    function isFunction(value) {
        return typeof (value) == 'function';
    }
    wijmo.isFunction = isFunction;
    /**
     * Determines whether an object is undefined.
     *
     * @param value Value to test.
     */
    function isUndefined(value) {
        return typeof value == 'undefined';
    }
    wijmo.isUndefined = isUndefined;
    /**
     * Determines whether an object is a Date.
     *
     * @param value Value to test.
     */
    function isDate(value) {
        return value instanceof Date && !isNaN(value.getTime());
    }
    wijmo.isDate = isDate;
    /**
     * Determines whether an object is an Array.
     *
     * @param value Value to test.
     */
    function isArray(value) {
        return value instanceof Array;
    }
    wijmo.isArray = isArray;
    /**
     * Determines whether a value is an object
     * (as opposed to a value type, an array, or a Date).
     *
     * @param value Value to test.
     */
    function isObject(value) {
        return value != null && typeof value == 'object' && !isDate(value) && !isArray(value);
    }
    wijmo.isObject = isObject;
    /**
     * Converts mouse or touch event arguments into a @see:Point in page coordinates.
     */
    function mouseToPage(e) {
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
    wijmo.mouseToPage = mouseToPage;
    /**
     * Gets the type of a value.
     *
     * @param value Value to test.
     * @return A @see:DataType value representing the type of the value passed in.
     */
    function getType(value) {
        if (isNumber(value))
            return DataType.Number;
        if (isBoolean(value))
            return DataType.Boolean;
        if (isDate(value))
            return DataType.Date;
        if (isString(value))
            return DataType.String;
        if (isArray(value))
            return DataType.Array;
        return DataType.Object;
    }
    wijmo.getType = getType;
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
    function changeType(value, type, format) {
        if (value != null) {
            // convert strings to numbers, dates, or booleans
            if (isString(value)) {
                switch (type) {
                    case DataType.Number:
                        var num = wijmo.Globalize.parseFloat(value, format);
                        return isNaN(num) ? value : num;
                    case DataType.Date:
                        var date = wijmo.Globalize.parseDate(value, format);
                        if (!date && !format && value) {
                            date = new Date(value); // fallback on JavaScript parser
                        }
                        return date && isFinite(date.getTime()) ? date : value;
                    case DataType.Boolean:
                        switch (value.toLowerCase()) {
                            case 'true': return true;
                            case 'false': return false;
                        }
                        return value; // TFS 125067
                }
            }
            // convert anything to string
            if (type == DataType.String) {
                return wijmo.Globalize.format(value, format);
            }
        }
        // did not convert...
        //console.log('did not convert "' + value + '" to type ' + DataType[type]);
        return value;
    }
    wijmo.changeType = changeType;
    /**
     * Rounds or truncates a number to a specified precision.
     *
     * @param value Value to round or truncate.
     * @param prec Number of decimal digits for the result.
     * @param truncate Whether to truncate or round the original value.
     */
    function toFixed(value, prec, truncate) {
        if (truncate) {
            var s = value.toString(), decPos = s.indexOf('.');
            if (decPos > -1) {
                s = s.substr(0, decPos + 1 + prec);
                value = parseFloat(s);
            }
        }
        else {
            var s = value.toFixed(prec);
            value = parseFloat(s);
        }
        return value;
    }
    wijmo.toFixed = toFixed;
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
    function format(format, data, formatFunction) {
        format = asString(format);
        return format.replace(/\{(.*?)(:(.*?))?\}/g, function (match, name, x, fmt) {
            var val = match;
            if (name && name[0] != '{' && data) {
                // get the value
                val = data[name];
                // apply static format
                if (fmt) {
                    val = wijmo.Globalize.format(val, fmt);
                }
                // apply format function
                if (formatFunction) {
                    val = formatFunction(data, name, fmt, val);
                }
            }
            return val == null ? '' : val;
        });
    }
    wijmo.format = format;
    /**
     * Clamps a value between a minimum and a maximum.
     *
     * @param value Original value.
     * @param min Minimum allowed value.
     * @param max Maximum allowed value.
     */
    function clamp(value, min, max) {
        if (value != null) {
            if (max != null && value > max)
                value = max;
            if (min != null && value < min)
                value = min;
        }
        return value;
    }
    wijmo.clamp = clamp;
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
    function copy(dst, src) {
        if (src) {
            for (var key in src) {
                if (key[0] != '_') {
                    assert(key in dst, 'Unknown property "' + key + '".');
                    var value = src[key];
                    if (!dst._copy || !dst._copy(key, value)) {
                        if (dst[key] instanceof wijmo.Event && isFunction(value)) {
                            dst[key].addHandler(value); // add event handler
                        }
                        else if (isObject(value) && dst[key] && key != 'itemsSource') {
                            copy(dst[key], value); // copy sub-objects
                        }
                        else {
                            dst[key] = value; // assign values
                        }
                    }
                }
            }
        }
    }
    wijmo.copy = copy;
    /**
     * Throws an exception if a condition is false.
     *
     * @param condition Condition expected to be true.
     * @param msg Message of the exception if the condition is not true.
     */
    function assert(condition, msg) {
        if (!condition) {
            throw '** Assertion failed in Wijmo: ' + msg;
        }
    }
    wijmo.assert = assert;
    /**
     * Outputs a message to indicate a member has been deprecated.
     *
     * @param oldMember Member that has been deprecated.
     * @param newMember Member that replaces the one that has been deprecated.
     */
    function _deprecated(oldMember, newMember) {
        console.error('** WARNING: "' + oldMember + '" has been deprecated; please use "' + newMember + '" instead.');
    }
    wijmo._deprecated = _deprecated;
    /**
     * Asserts that a value is a string.
     *
     * @param value Value supposed to be a string.
     * @param nullOK Whether null values are acceptable.
     * @return The string passed in.
     */
    function asString(value, nullOK) {
        if (nullOK === void 0) { nullOK = true; }
        assert((nullOK && value == null) || isString(value), 'String expected.');
        return value;
    }
    wijmo.asString = asString;
    /**
     * Asserts that a value is a number.
     *
     * @param value Value supposed to be numeric.
     * @param nullOK Whether null values are acceptable.
     * @param positive Whether to accept only positive numeric values.
     * @return The number passed in.
     */
    function asNumber(value, nullOK, positive) {
        if (nullOK === void 0) { nullOK = false; }
        if (positive === void 0) { positive = false; }
        assert((nullOK && value == null) || isNumber(value), 'Number expected.');
        if (positive && value && value < 0)
            throw 'Positive number expected.';
        return value;
    }
    wijmo.asNumber = asNumber;
    /**
     * Asserts that a value is an integer.
     *
     * @param value Value supposed to be an integer.
     * @param nullOK Whether null values are acceptable.
     * @param positive Whether to accept only positive integers.
     * @return The number passed in.
     */
    function asInt(value, nullOK, positive) {
        if (nullOK === void 0) { nullOK = false; }
        if (positive === void 0) { positive = false; }
        assert((nullOK && value == null) || isInt(value), 'Integer expected.');
        if (positive && value && value < 0)
            throw 'Positive integer expected.';
        return value;
    }
    wijmo.asInt = asInt;
    /**
     * Asserts that a value is a Boolean.
     *
     * @param value Value supposed to be Boolean.
     * @param nullOK Whether null values are acceptable.
     * @return The Boolean passed in.
     */
    function asBoolean(value, nullOK) {
        if (nullOK === void 0) { nullOK = false; }
        assert((nullOK && value == null) || isBoolean(value), 'Boolean expected.');
        return value;
    }
    wijmo.asBoolean = asBoolean;
    /**
     * Asserts that a value is a Date.
     *
     * @param value Value supposed to be a Date.
     * @param nullOK Whether null values are acceptable.
     * @return The Date passed in.
     */
    function asDate(value, nullOK) {
        if (nullOK === void 0) { nullOK = false; }
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
    wijmo.asDate = asDate;
    /**
     * Asserts that a value is a function.
     *
     * @param value Value supposed to be a function.
     * @param nullOK Whether null values are acceptable.
     * @return The function passed in.
     */
    function asFunction(value, nullOK) {
        if (nullOK === void 0) { nullOK = true; }
        assert((nullOK && value == null) || isFunction(value), 'Function expected.');
        return value;
    }
    wijmo.asFunction = asFunction;
    /**
     * Asserts that a value is an array.
     *
     * @param value Value supposed to be an array.
     * @param nullOK Whether null values are acceptable.
     * @return The array passed in.
     */
    function asArray(value, nullOK) {
        if (nullOK === void 0) { nullOK = true; }
        assert((nullOK && value == null) || isArray(value), 'Array expected.');
        return value;
    }
    wijmo.asArray = asArray;
    /**
     * Asserts that a value is an instance of a given type.
     *
     * @param value Value to be checked.
     * @param type Type of value expected.
     * @param nullOK Whether null values are acceptable.
     * @return The value passed in.
     */
    function asType(value, type, nullOK) {
        if (nullOK === void 0) { nullOK = false; }
        value = tryCast(value, type);
        assert(nullOK || value != null, type + ' expected.');
        return value;
    }
    wijmo.asType = asType;
    /**
     * Asserts that a value is a valid setting for an enumeration.
     *
     * @param value Value supposed to be a member of the enumeration.
     * @param enumType Enumeration to test for.
     * @param nullOK Whether null values are acceptable.
     * @return The value passed in.
     */
    function asEnum(value, enumType, nullOK) {
        if (nullOK === void 0) { nullOK = false; }
        if (value == null && nullOK)
            return null;
        var e = enumType[value];
        assert(e != null, 'Invalid enum value.');
        return isNumber(e) ? e : value;
    }
    wijmo.asEnum = asEnum;
    /**
     * Asserts that a value is an @see:ICollectionView or an Array.
     *
     * @param value Array or @see:ICollectionView.
     * @param nullOK Whether null values are acceptable.
     * @return The @see:ICollectionView that was passed in or a @see:CollectionView
     * created from the array that was passed in.
     */
    function asCollectionView(value, nullOK) {
        if (nullOK === void 0) { nullOK = true; }
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
        return new wijmo.collections.CollectionView(value);
    }
    wijmo.asCollectionView = asCollectionView;
    /**
     * Checks whether an @see:ICollectionView is defined and not empty.
     *
     * @param value @see:ICollectionView to check.
     */
    function hasItems(value) {
        return value && value.items && value.items.length;
    }
    wijmo.hasItems = hasItems;
    /**
     * Converts a camel-cased string into a header-type string by capitalizing the first letter
     * and adding spaces before uppercase characters preceded by lower-case characters.
     *
     * For example, 'somePropertyName' becomes 'Some Property Name'.
     *
     * @param text String to convert to header case.
     */
    function toHeaderCase(text) {
        return text && text.length
            ? text[0].toUpperCase() + text.substr(1).replace(/([a-z])([A-Z])/g, '$1 $2')
            : '';
    }
    wijmo.toHeaderCase = toHeaderCase;
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
    function escapeHtml(text) {
        if (isString(text)) {
            text = text.replace(/[&<>"'\/]/g, function (s) {
                return _ENTITYMAP[s];
            });
        }
        return text;
    }
    wijmo.escapeHtml = escapeHtml;
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
    function hasClass(e, className) {
        // NOTE: using e.getAttribute('class') instead of e.classNames
        // so this works with SVG as well as regular HTML elements.
        if (e && e.getAttribute) {
            var rx = new RegExp('\\b' + className + '\\b');
            return e && rx.test(e.getAttribute('class'));
        }
        return false;
    }
    wijmo.hasClass = hasClass;
    /**
     * Removes a class from an element.
     *
     * @param e Element that will have the class removed.
     * @param className Class to remove form the element.
     */
    function removeClass(e, className) {
        // note: using e.getAttribute('class') instead of e.classNames
        // so this works with SVG as well as regular HTML elements.
        if (e && className && e.setAttribute && hasClass(e, className)) {
            var rx = new RegExp('\\s?\\b' + className + '\\b', 'g'), cn = e.getAttribute('class');
            e.setAttribute('class', cn.replace(rx, ''));
        }
    }
    wijmo.removeClass = removeClass;
    /**
     * Adds a class to an element.
     *
     * @param e Element that will have the class added.
     * @param className Class to add to the element.
     */
    function addClass(e, className) {
        // note: using e.getAttribute('class') instead of e.classNames
        // so this works with SVG as well as regular HTML elements.
        if (e && className && e.setAttribute && !hasClass(e, className)) {
            var cn = e.getAttribute('class');
            e.setAttribute('class', cn ? cn + ' ' + className : className);
        }
    }
    wijmo.addClass = addClass;
    /**
     * Adds or removes a class to or from an element.
     *
     * @param e Element that will have the class added.
     * @param className Class to add or remove.
     * @param addOrRemove Whether to add or remove the class.
     * Use true to add class to element and false to remove class from element.
     */
    function toggleClass(e, className, addOrRemove) {
        if (addOrRemove) {
            addClass(e, className);
        }
        else {
            removeClass(e, className);
        }
    }
    wijmo.toggleClass = toggleClass;
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
    function setSelectionRange(e, start, end) {
        if (end === void 0) { end = start; }
        e = asType(e, HTMLInputElement);
        if (contains(document.body, e) && !e.disabled && e.style.display != 'none') {
            try {
                e.focus(); // needed in Chrome (TFS 124102, 142672)
                e.setSelectionRange(asNumber(start), asNumber(end));
            }
            catch (x) { }
        }
    }
    wijmo.setSelectionRange = setSelectionRange;
    /**
     * Gets a reference to the element that contains the focus,
     * accounting for shadow document fragments.
     */
    function getActiveElement() {
        var ae = document.activeElement;
        if (ae) {
            // account for shadowRoot: https://github.com/w3c/webcomponents/issues/358)
            var shadowRoot = ae['shadowRoot'];
            if (shadowRoot && shadowRoot.activeElement) {
                ae = shadowRoot.activeElement;
            }
        }
        return ae;
    }
    wijmo.getActiveElement = getActiveElement;
    /**
     * Moves the focus to the next/previous/first focusable child element.
     *
     * @param parent Parent element.
     * @param offset Offset to use when moving the focus (use zero to focus on the first focusable child).
     */
    function moveFocus(parent, offset) {
        // build array of focusable elements (including divs and spans)
        var inputs = parent.querySelectorAll('input,select,textarea,button,a,div,span'), focusable = [];
        for (var i = 0; i < inputs.length; i++) {
            var el = inputs[i];
            if (!el.disabled && el.tabIndex > -1 && el.clientHeight > 0 &&
                !closest(el, '[disabled],.wj-state-disabled')) {
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
            var el = focusable[index];
            el.focus();
            if (el instanceof HTMLInputElement) {
                el.select(); // TFS 190336
            }
        }
    }
    wijmo.moveFocus = moveFocus;
    // ** jQuery replacement methods
    /**
     * Gets an element from a jQuery-style selector.
     *
     * @param selector An element, a query selector string, or a jQuery object.
     */
    function getElement(selector) {
        if (selector instanceof Element)
            return selector;
        if (isString(selector))
            return document.querySelector(selector);
        if (selector && selector.jquery)
            return selector[0];
        return null;
    }
    wijmo.getElement = getElement;
    /**
     * Creates an element from an HTML string.
     *
     * @param html HTML fragment to convert into an HTMLElement.
     * @param appendTo Optional HTMLElement to append the new element to.
     * @return The new element.
     */
    function createElement(html, appendTo) {
        var div = document.createElement('div');
        div.innerHTML = html;
        var e = div.removeChild(div.firstChild);
        return (appendTo instanceof HTMLElement)
            ? appendTo.appendChild(e)
            : e;
    }
    wijmo.createElement = createElement;
    /**
     * Sets the text content of an element.
     *
     * @param e Element that will have its content updated.
     * @param text Plain text to be assigned to the element.
     */
    function setText(e, text) {
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
        }
        else if (fc || text) {
            e.textContent = text; // something else, set the textContent
        }
    }
    wijmo.setText = setText;
    /**
     * Checks whether an HTML element contains another.
     *
     * @param parent Parent element.
     * @param child Child element.
     * @return True if the parent element contains the child element.
     */
    function contains(parent, child) {
        for (var e = child; e && parent;) {
            if (e === parent)
                return true; // found!
            e = e.parentNode || e['host']; // move up to parent node or host (shadow DOM)
        }
        return false;
    }
    wijmo.contains = contains;
    /**
     * Finds the closest ancestor that satisfies a selector.
     *
     * @param e Element where the search should start.
     * @param selector A string containing a selector expression to match elements against.
     * @return The closest ancestor that satisfies the selector (including the original element), or null if not found.
     */
    function closest(e, selector) {
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
    wijmo.closest = closest;
    /**
     * Enables or disables an element.
     *
     * @param e Element to enable or disable.
     * @param value Whether to enable or disable the element.
     */
    function enable(e, value) {
        // update wj-state-disabled class and disabled attribute on the element
        toggleClass(e, 'wj-state-disabled', !value);
        if (value) {
            e.removeAttribute('disabled');
        }
        else {
            e.setAttribute('disabled', 'true');
        }
        // update disabled attribute on inner input elements (TFS 190939)
        var inputs = e.querySelectorAll('input');
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            if (value) {
                input.removeAttribute('disabled');
            }
            else {
                input.setAttribute('disabled', 'true');
            }
        }
    }
    wijmo.enable = enable;
    /**
     * Gets the bounding rectangle of an element in page coordinates.
     *
     * This is similar to the <b>getBoundingClientRect</b> function,
     * except that uses window coordinates, which change when the
     * document scrolls.
     */
    function getElementRect(e) {
        var rc = e.getBoundingClientRect();
        return new Rect(rc.left + pageXOffset, rc.top + pageYOffset, rc.width, rc.height);
    }
    wijmo.getElementRect = getElementRect;
    /**
     * Modifies the style of an element by applying the properties specified in an object.
     *
     * @param e Element or array of elements whose style will be modified.
     * @param css Object containing the style properties to apply to the element.
     */
    function setCss(e, css) {
        // apply to arrays
        if (isArray(e)) {
            e.forEach(function (item) {
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
    wijmo.setCss = setCss;
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
    function animate(apply, duration, step) {
        if (duration === void 0) { duration = 400; }
        if (step === void 0) { step = 35; }
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
            if (pct >= 1) {
                clearInterval(timer);
            }
        }, step);
        return timer;
    }
    wijmo.animate = animate;
    // ** utility classes
    /**
     * Class that represents a point (with x and y coordinates).
     */
    var Point = (function () {
        /**
         * Initializes a new instance of the @see:Point class.
         *
         * @param x X coordinate of the new Point.
         * @param y Y coordinate of the new Point.
         */
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = asNumber(x);
            this.y = asNumber(y);
        }
        /**
         * Returns true if a @see:Point has the same coordinates as this @see:Point.
         *
         * @param pt @see:Point to compare to this @see:Point.
         */
        Point.prototype.equals = function (pt) {
            return (pt instanceof Point) && this.x == pt.x && this.y == pt.y;
        };
        /**
         * Creates a copy of this @see:Point.
         */
        Point.prototype.clone = function () {
            return new Point(this.x, this.y);
        };
        return Point;
    }());
    wijmo.Point = Point;
    /**
     * Class that represents a size (with width and height).
     */
    var Size = (function () {
        /**
         * Initializes a new instance of the @see:Size class.
         *
         * @param width Width of the new @see:Size.
         * @param height Height of the new @see:Size.
         */
        function Size(width, height) {
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            this.width = asNumber(width);
            this.height = asNumber(height);
        }
        /**
         * Returns true if a @see:Size has the same dimensions as this @see:Size.
         *
         * @param sz @see:Size to compare to this @see:Size.
         */
        Size.prototype.equals = function (sz) {
            return (sz instanceof Size) && this.width == sz.width && this.height == sz.height;
        };
        /**
         * Creates a copy of this @see:Size.
         */
        Size.prototype.clone = function () {
            return new Size(this.width, this.height);
        };
        return Size;
    }());
    wijmo.Size = Size;
    /**
     * Class that represents a rectangle (with left, top, width, and height).
     */
    var Rect = (function () {
        /**
         * Initializes a new instance of the @see:Rect class.
         *
         * @param left Left coordinate of the new @see:Rect.
         * @param top Top coordinate of the new @see:Rect.
         * @param width Width of the new @see:Rect.
         * @param height Height of the new @see:Rect.
         */
        function Rect(left, top, width, height) {
            this.left = asNumber(left);
            this.top = asNumber(top);
            this.width = asNumber(width);
            this.height = asNumber(height);
        }
        Object.defineProperty(Rect.prototype, "right", {
            /**
             * Gets the right coordinate of this @see:Rect.
             */
            get: function () {
                return this.left + this.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "bottom", {
            /**
             * Gets the bottom coordinate of this @see:Rect.
             */
            get: function () {
                return this.top + this.height;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns true if a @see:Rect has the same coordinates and dimensions
         * as this @see:Rect.
         *
         * @param rc @see:Rect to compare to this @see:Rect.
         */
        Rect.prototype.equals = function (rc) {
            return (rc instanceof Rect) && this.left == rc.left && this.top == rc.top && this.width == rc.width && this.height == rc.height;
        };
        /**
         * Creates a copy of this @see:Rect.
         */
        Rect.prototype.clone = function () {
            return new Rect(this.left, this.top, this.width, this.height);
        };
        /**
         * Creates a @see:Rect from <b>ClientRect</b> or <b>SVGRect</b> objects.
         *
         * @param rc Rectangle obtained by a call to the DOM's <b>getBoundingClientRect</b>
         * or <b>GetBoundingBox</b> methods.
         */
        Rect.fromBoundingRect = function (rc) {
            if (rc.left != null) {
                return new Rect(rc.left, rc.top, rc.width, rc.height);
            }
            else if (rc.x != null) {
                return new Rect(rc.x, rc.y, rc.width, rc.height);
            }
            else {
                assert(false, 'Invalid source rectangle.');
            }
        };
        /**
         * Gets a rectangle that represents the union of two rectangles.
         *
         * @param rc1 First rectangle.
         * @param rc2 Second rectangle.
         */
        Rect.union = function (rc1, rc2) {
            var x = Math.min(rc1.left, rc2.left), y = Math.min(rc1.top, rc2.top), right = Math.max(rc1.right, rc2.right), bottom = Math.max(rc1.bottom, rc2.bottom);
            return new Rect(x, y, right - x, bottom - y);
        };
        /**
         * Gets a rectangle that represents the intersection of two rectangles.
         *
         * @param rc1 First rectangle.
         * @param rc2 Second rectangle.
         */
        Rect.intersection = function (rc1, rc2) {
            var x = Math.max(rc1.left, rc2.left), y = Math.max(rc1.top, rc2.top), right = Math.min(rc1.right, rc2.right), bottom = Math.min(rc1.bottom, rc2.bottom);
            return new Rect(x, y, right - x, bottom - y);
        };
        /**
         * Determines whether the rectangle contains a given point or rectangle.
         *
         * @param pt The @see:Point or @see:Rect to ckeck.
         */
        Rect.prototype.contains = function (pt) {
            if (pt instanceof Point) {
                return pt.x >= this.left && pt.x <= this.right &&
                    pt.y >= this.top && pt.y <= this.bottom;
            }
            else if (pt instanceof Rect) {
                var rc2 = pt;
                return rc2.left >= this.left && rc2.right <= this.right &&
                    rc2.top >= this.top && rc2.bottom <= this.bottom;
            }
            else {
                assert(false, 'Point or Rect expected.');
            }
        };
        /**
         * Creates a rectangle that results from expanding or shrinking a rectangle by the specified amounts.
         *
         * @param dx The amount by which to expand or shrink the left and right sides of the rectangle.
         * @param dy The amount by which to expand or shrink the top and bottom sides of the rectangle.
         */
        Rect.prototype.inflate = function (dx, dy) {
            return new Rect(this.left - dx, this.top - dy, this.width + 2 * dx, this.height + 2 * dy);
        };
        return Rect;
    }());
    wijmo.Rect = Rect;
    /**
     * Provides date and time utilities.
     */
    var DateTime = (function () {
        function DateTime() {
        }
        /**
         * Gets a new Date that adds the specified number of days to a given Date.
         *
         * @param value Original date.
         * @param days Number of days to add to the given date.
         */
        DateTime.addDays = function (value, days) {
            return new Date(value.getFullYear(), value.getMonth(), value.getDate() + days);
        };
        /**
         * Gets a new Date that adds the specified number of months to a given Date.
         *
         * @param value Original date.
         * @param months Number of months to add to the given date.
         */
        DateTime.addMonths = function (value, months) {
            return new Date(value.getFullYear(), value.getMonth() + months, value.getDate());
        };
        /**
         * Gets a new Date that adds the specified number of years to a given Date.
         *
         * @param value Original date.
         * @param years Number of years to add to the given date.
         */
        DateTime.addYears = function (value, years) {
            return new Date(value.getFullYear() + years, value.getMonth(), value.getDate());
        };
        /**
         * Gets a new Date that adds the specified number of hours to a given Date.
         *
         * @param value Original date.
         * @param hours Number of hours to add to the given date.
         */
        DateTime.addHours = function (value, hours) {
            return new Date(value.getFullYear(), value.getMonth(), value.getDate(), value.getHours() + hours);
        };
        /**
         * Gets a new Date that adds the specified number of minutes to a given Date.
         *
         * @param value Original date.
         * @param minutes Number of minutes to add to the given date.
         */
        DateTime.addMinutes = function (value, minutes) {
            return new Date(value.getFullYear(), value.getMonth(), value.getDate(), value.getHours(), value.getMinutes() + minutes);
        };
        /**
         * Gets a new Date that adds the specified number of seconds to a given Date.
         *
         * @param value Original date.
         * @param seconds Number of seconds to add to the given date.
         */
        DateTime.addSeconds = function (value, seconds) {
            return new Date(value.getFullYear(), value.getMonth(), value.getDate(), value.getHours(), value.getMinutes(), value.getSeconds() + seconds);
        };
        /**
         * Returns true if two Date objects refer to the same date (ignoring time).
         *
         * @param d1 First date.
         * @param d2 Second date.
         */
        DateTime.sameDate = function (d1, d2) {
            return isDate(d1) && isDate(d2) &&
                d1.getFullYear() == d2.getFullYear() &&
                d1.getMonth() == d2.getMonth() &&
                d1.getDate() == d2.getDate();
        };
        /**
         * Returns true if two Date objects refer to the same time (ignoring date).
         *
         * @param d1 First date.
         * @param d2 Second date.
         */
        DateTime.sameTime = function (d1, d2) {
            return isDate(d1) && isDate(d2) &&
                d1.getHours() == d2.getHours() &&
                d1.getMinutes() == d2.getMinutes() &&
                d1.getSeconds() == d2.getSeconds();
        };
        /**
         * Returns true if two Date objects refer to the same date and time.
         *
         * @param d1 First date.
         * @param d2 Second date.
         */
        DateTime.equals = function (d1, d2) {
            return isDate(d1) && isDate(d2) && d1.getTime() == d2.getTime();
        };
        /**
         * Gets a Date object with the date and time set on two Date objects.
         *
         * @param date Date object that contains the date (day/month/year).
         * @param time Date object that contains the time (hour:minute:second).
         */
        DateTime.fromDateTime = function (date, time) {
            if (!date && !time)
                return null;
            if (!date)
                date = time;
            if (!time)
                time = date;
            return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds());
        };
        /**
         * Converts a calendar date to a fiscal date using the current culture.
         *
         * @param date Calendar date.
         * @param govt Whether to use the government or corporate fiscal year.
         */
        DateTime.toFiscal = function (date, govt) {
            var cal = wijmo.culture.Globalize.calendar;
            return isArray(cal.fiscalYearOffsets)
                ? DateTime.addMonths(date, -cal.fiscalYearOffsets[govt ? 0 : 1])
                : date;
        };
        /**
         * Converts a fiscal year date to a calendar date using the current culture.
         *
         * @param date Fiscal year date.
         * @param govt Whether to use the government or corporate fiscal year.
         */
        DateTime.fromFiscal = function (date, govt) {
            var cal = wijmo.culture.Globalize.calendar;
            return isArray(cal.fiscalYearOffsets)
                ? DateTime.addMonths(date, +cal.fiscalYearOffsets[govt ? 0 : 1])
                : date;
        };
        /**
         * Gets a new Date object set to today's date and no time portion.
         */
        DateTime.newDate = function () {
            var dt = new Date();
            return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
        };
        /**
         * Creates a copy of a given Date object.
         *
         * @param date Date object to copy.
         */
        DateTime.clone = function (date) {
            return DateTime.fromDateTime(date, date);
        };
        return DateTime;
    }());
    wijmo.DateTime = DateTime;
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
    function httpRequest(url, settings) {
        if (!settings)
            settings = {};
        // select method and basic options
        var method = settings.method ? asString(settings.method).toUpperCase() : 'GET', async = settings.async != null ? asBoolean(settings.async) : true, data = settings.data;
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
                }
                else if (settings.error) {
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
            }
            else {
                throw 'HttpRequest Error: ' + xhr.status + ' ' + xhr.statusText;
            }
        };
        // send the request
        xhr.open(method, url, async, settings.user, settings.password);
        if (settings.user && settings.password) {
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(settings.user + ':' + settings.password));
        }
        if (isJson) {
            xhr.setRequestHeader('Content-Type', 'application/json');
        }
        if (settings.requestHeaders) {
            for (var key in settings.requestHeaders) {
                xhr.setRequestHeader(key, settings.requestHeaders[key]);
            }
        }
        if (isFunction(settings.beforeSend)) {
            settings.beforeSend(xhr);
        }
        xhr.send(data);
        // return the request
        return xhr;
    }
    wijmo.httpRequest = httpRequest;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Util.js.map