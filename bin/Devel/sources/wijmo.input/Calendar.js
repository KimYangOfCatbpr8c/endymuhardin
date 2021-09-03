var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var input;
    (function (input) {
        'use strict';
        /**
         * Specifies constants that define the date selection behavior.
         */
        (function (DateSelectionMode) {
            /** The user cannot change the current value using the mouse or keyboard. */
            DateSelectionMode[DateSelectionMode["None"] = 0] = "None";
            /** The user can select days. */
            DateSelectionMode[DateSelectionMode["Day"] = 1] = "Day";
            /** The user can select months. */
            DateSelectionMode[DateSelectionMode["Month"] = 2] = "Month";
        })(input.DateSelectionMode || (input.DateSelectionMode = {}));
        var DateSelectionMode = input.DateSelectionMode;
        /**
         * The @see:Calendar control displays a one-month calendar and allows users
         * to select a date.
         *
         * You may use the @see:min and @see:max properties to restrict the range
         * of dates that the user can select.
         *
         * For details about using the @see:min and @see:max properties, please see the
         * <a href="static/minMax.html">Using the min and max properties</a> topic.
         *
         * Use the @see:value property to get or set the currently selected date.
         *
         * Use the @see:selectionMode property to determine whether users should be
         * allowed to select days, months, or no values at all.
         *
         * The example below shows a <b>Date</b> value with date and time information
         * using an @see:InputDate and an @see:InputTime control. Notice how both controls
         * are bound to the same controller variable, and each edits the appropriate information
         * (either date or time). The example also shows a @see:Calendar control that allows
         * users to select the date with a single click.
         *
         * @fiddle:vgc3Y
         */
        var Calendar = (function (_super) {
            __extends(Calendar, _super);
            /**
             * Initializes a new instance of the @see:Calendar class.
             *
             * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function Calendar(element, options) {
                _super.call(this, element);
                this._readOnly = false;
                this._selMode = DateSelectionMode.Day;
                /**
                 * Occurs after a new date is selected.
                 */
                this.valueChanged = new wijmo.Event();
                /**
                 * Occurs after the @see:displayMonth property changes.
                 */
                this.displayMonthChanged = new wijmo.Event();
                /**
                 * Occurs when an element representing a day in the calendar has been created.
                 *
                 * This event can be used to format calendar items for display. It is similar
                 * in purpose to the @see:itemFormatter property, but has the advantage
                 * of allowing multiple independent handlers.
                 *
                 * For example, the code below uses the @see:formatItem event to disable weekends
                 * so they appear dimmed in the calendar:
                 *
                 * <pre>// disable Sundays and Saturdays
                 * calendar.formatItem.addHandler(function (s, e) {
                 *   var day = e.data.getDay();
                 *   if (day == 0 || day == 6) {
                 *     wijmo.addClass(e.item, 'wj-state-disabled');
                 *   }
                 * });</pre>
                 */
                this.formatItem = new wijmo.Event();
                // initialize value (current date)
                this._value = wijmo.DateTime.newDate();
                this._currMonth = this._getMonth(this._value);
                // create child elements
                this._createChildren();
                // update the control
                this.refresh(true);
                // handle mouse and keyboard
                // The 'click' event may not be triggered on iOS Safari if focus changed
                // during previous tap. So use 'mouseup' instead.
                //this.addEventListener(this.hostElement, 'click', this._click.bind(this));
                this.addEventListener(this.hostElement, 'mouseup', this._click.bind(this));
                this.addEventListener(this.hostElement, 'keydown', this._keydown.bind(this));
                // initialize control options
                this.initialize(options);
            }
            Object.defineProperty(Calendar.prototype, "value", {
                //--------------------------------------------------------------------------
                //#region ** object model
                /**
                 * Gets or sets the currently selected date.
                 */
                get: function () {
                    return this._value;
                },
                set: function (value) {
                    value = wijmo.asDate(value, true);
                    // honor ranges (but keep the time)
                    // REVIEW: should not clamp this...
                    value = this._clamp(value);
                    // update control
                    if (this._valid(value)) {
                        this.displayMonth = this._getMonth(value);
                        if (!wijmo.DateTime.equals(this._value, value)) {
                            this._value = value;
                            this.invalidate(false);
                            this.onValueChanged();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "min", {
                /**
                 * Gets or sets the earliest date that the user can select in the calendar.
                 *
                 * For details about using the @see:min and @see:max properties, please see the
                 * <a href="static/minMax.html">Using the min and max properties</a> topic.
                 */
                get: function () {
                    return this._min;
                },
                set: function (value) {
                    if (value != this.min) {
                        this._min = wijmo.asDate(value, true);
                        this.refresh();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "max", {
                /**
                 * Gets or sets the latest date that the user can select in the calendar.
                 *
                 * For details about using the @see:min and @see:max properties, please see the
                 * <a href="static/minMax.html">Using the min and max properties</a> topic.
                 */
                get: function () {
                    return this._max;
                },
                set: function (value) {
                    if (value != this.max) {
                        this._max = wijmo.asDate(value, true);
                        this.refresh();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "selectionMode", {
                /**
                 * Gets or sets a value that indicates whether users can select
                 * days, months, or no values at all.
                 */
                get: function () {
                    return this._selMode;
                },
                set: function (value) {
                    if (value != this._selMode) {
                        // apply new setting
                        this._selMode = wijmo.asEnum(value, DateSelectionMode);
                        // update monthView
                        var mthMode = this._monthMode();
                        if (mthMode)
                            this.monthView = false;
                        // update month glyph
                        var mthGlyph = this._btnMth.querySelector('.wj-glyph-down');
                        if (mthGlyph)
                            mthGlyph.style.display = mthMode ? 'none' : '';
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "isReadOnly", {
                /**
                 * Gets or sets a value that indicates whether the user can modify
                 * the control value using the mouse and keyboard.
                 */
                get: function () {
                    return this._readOnly;
                },
                set: function (value) {
                    this._readOnly = wijmo.asBoolean(value);
                    wijmo.toggleClass(this.hostElement, 'wj-state-readonly', this.isReadOnly);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "firstDayOfWeek", {
                /**
                 * Gets or sets a value that represents the first day of the week,
                 * the one displayed in the first column of the calendar.
                 *
                 * Setting this property to null causes the calendar to use the default
                 * for the current culture. In the English culture, the first day of the
                 * week is Sunday (0); in most European cultures, the first day of the
                 * week is Monday (1).
                 */
                get: function () {
                    return this._fdw;
                },
                set: function (value) {
                    if (value != this._fdw) {
                        value = wijmo.asNumber(value, true);
                        if (value && (value > 6 || value < 0)) {
                            throw 'firstDayOfWeek must be between 0 and 6 (Sunday to Saturday).';
                        }
                        this._fdw = value;
                        this.refresh();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "displayMonth", {
                /**
                 * Gets or sets the month displayed in the calendar.
                 */
                get: function () {
                    return this._currMonth;
                },
                set: function (value) {
                    if (!wijmo.DateTime.equals(this.displayMonth, value)) {
                        value = wijmo.asDate(value);
                        if (this._monthInValidRange(value)) {
                            this._currMonth = this._getMonth(value);
                            this.invalidate(true);
                            this.onDisplayMonthChanged();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "showHeader", {
                /**
                 * Gets or sets a value indicating whether the control displays the header
                 * area with the current month and navigation buttons.
                 */
                get: function () {
                    return this._tbHdr.style.display != 'none';
                },
                set: function (value) {
                    this._tbHdr.style.display = wijmo.asBoolean(value) ? '' : 'none';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "monthView", {
                /**
                 * Gets or sets a value indicating whether the calendar displays a month or a year.
                 */
                get: function () {
                    return this._tbMth.style.display != 'none';
                },
                set: function (value) {
                    if (value != this.monthView) {
                        this._tbMth.style.display = value ? '' : 'none';
                        this._tbYr.style.display = value ? 'none' : '';
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "itemFormatter", {
                /**
                 * Gets or sets a formatter function to customize dates in the calendar.
                 *
                 * The formatter function can add any content to any date. It allows
                 * complete customization of the appearance and behavior of the calendar.
                 *
                 * If specified, the function takes two parameters:
                 * <ul>
                 *     <li>the date being formatted </li>
                 *     <li>the HTML element that represents the date</li>
                 * </ul>
                 *
                 * For example, the code below shows weekends with a yellow background:
                 * <pre>
                 * calendar.itemFormatter = function(date, element) {
                 *   var day = date.getDay();
                 *   element.style.backgroundColor = day == 0 || day == 6 ? 'yellow' : '';
                 * }
                 * </pre>
                 */
                get: function () {
                    return this._itemFormatter;
                },
                set: function (value) {
                    if (value != this._itemFormatter) {
                        this._itemFormatter = wijmo.asFunction(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Calendar.prototype, "itemValidator", {
                /**
                 * Gets or sets a validator function to determine whether dates are valid for selection.
                 *
                 * If specified, the validator function should take one parameter representing the
                 * date to be tested, and should return false if the date is invalid and should not
                 * be selectable.
                 *
                 * For example, the code below shows weekends in a disabled state and prevents users
                 * from selecting those dates:
                 * <pre>
                 * calendar.itemValidator = function(date) {
                 *   var weekday = date.getDay();
                 *   return weekday != 0 && weekday != 6;
                 * }
                 * </pre>
                 */
                get: function () {
                    return this._itemValidator;
                },
                set: function (value) {
                    if (value != this._itemValidator) {
                        this._itemValidator = wijmo.asFunction(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the @see:valueChanged event.
             */
            Calendar.prototype.onValueChanged = function (e) {
                this.valueChanged.raise(this, e);
            };
            /**
             * Raises the @see:displayMonthChanged event.
             */
            Calendar.prototype.onDisplayMonthChanged = function (e) {
                this.displayMonthChanged.raise(this, e);
            };
            /**
             * Raises the @see:formatItem event.
             *
             * @param e @see:FormatItemEventArgs that contains the event data.
             */
            Calendar.prototype.onFormatItem = function (e) {
                this.formatItem.raise(this, e);
            };
            /**
             * Refreshes the control.
             *
             * @param fullUpdate Indicates whether to update the control layout as well as the content.
             */
            Calendar.prototype.refresh = function (fullUpdate) {
                if (fullUpdate === void 0) { fullUpdate = true; }
                var cells, cell, day, month = this.displayMonth, fdw = this.firstDayOfWeek != null ? this.firstDayOfWeek : wijmo.Globalize.getFirstDayOfWeek();
                // call base class to suppress any pending invalidations
                _super.prototype.refresh.call(this, fullUpdate);
                // calculate first day of the calendar
                this._firstDay = wijmo.DateTime.addDays(month, -(month.getDay() - fdw + 7) % 7);
                // update current display month (e.g. January 2014)
                wijmo.setText(this._spMth, wijmo.Globalize.format(month, 'y'));
                // update week day headers (localizable)
                cells = this._tbMth.querySelectorAll('td');
                for (var i = 0; i < 7 && i < cells.length; i++) {
                    day = wijmo.DateTime.addDays(this._firstDay, i);
                    wijmo.setText(cells[i], wijmo.Globalize.format(day, 'ddd'));
                }
                // update month days
                for (var i = 7; i < cells.length; i++) {
                    cell = cells[i];
                    day = wijmo.DateTime.addDays(this._firstDay, i - 7);
                    wijmo.setText(cell, day.getDate().toString());
                    cell.className = '';
                    var invalid = !this._valid(day);
                    wijmo.toggleClass(cell, 'wj-state-invalid', invalid);
                    wijmo.toggleClass(cell, 'wj-state-selected', wijmo.DateTime.sameDate(day, this.value));
                    wijmo.toggleClass(cell, 'wj-day-today', wijmo.DateTime.sameDate(day, new Date()));
                    wijmo.toggleClass(cell, 'wj-day-othermonth', invalid || day.getMonth() != month.getMonth() || !this._inValidRange(day));
                    // customize the display
                    if (this.itemFormatter) {
                        this.itemFormatter(day, cell);
                    }
                    if (this.formatItem.hasHandlers) {
                        var e = new input.FormatItemEventArgs(i, day, cell);
                        this.onFormatItem(e);
                    }
                }
                // hide rows that belong to the next month
                var rows = this._tbMth.querySelectorAll('tr');
                if (rows.length) {
                    day = wijmo.DateTime.addDays(this._firstDay, 28);
                    rows[rows.length - 2].style.display = (day.getMonth() == month.getMonth()) ? '' : 'none';
                    day = wijmo.DateTime.addDays(this._firstDay, 35);
                    rows[rows.length - 1].style.display = (day.getMonth() == month.getMonth()) ? '' : 'none';
                }
                // update current year 
                cells = this._tbYr.querySelectorAll('td');
                if (cells.length) {
                    wijmo.setText(cells[0], month.getFullYear().toString());
                }
                // update month names
                for (var i = 1; i < cells.length; i++) {
                    cell = cells[i];
                    day = new Date(month.getFullYear(), i - 1, 1);
                    wijmo.setText(cell, wijmo.Globalize.format(day, 'MMM'));
                    cell.className = '';
                    wijmo.toggleClass(cell, 'wj-state-disabled', !this._monthInValidRange(day));
                    wijmo.toggleClass(cell, 'wj-state-selected', this._sameMonth(day, this.value));
                }
            };
            //#endregion
            //--------------------------------------------------------------------------
            //#region ** implementation
            // checks whether the control can change the current value
            Calendar.prototype._canChangeValue = function () {
                return !this._readOnly && this._selMode != DateSelectionMode.None;
            };
            // check whether a date should be selectable by the user
            Calendar.prototype._valid = function (date) {
                return this.itemValidator && date
                    ? this.itemValidator(date)
                    : true;
            };
            // check whether a day is within the valid range
            Calendar.prototype._inValidRange = function (date) {
                if (this.min && date < wijmo.DateTime.fromDateTime(this.min, date))
                    return false;
                if (this.max && date > wijmo.DateTime.fromDateTime(this.max, date))
                    return false;
                return true;
            };
            // check whether a month is within the valid range
            Calendar.prototype._monthInValidRange = function (month) {
                var y = month.getFullYear(), m = month.getMonth(), first = new Date(y, m, 1), last = wijmo.DateTime.addDays(new Date(y, m + 1), -1);
                return this._inValidRange(first) || this._inValidRange(last);
            };
            // checks whether a date is in the current month
            Calendar.prototype._sameMonth = function (date, month) {
                return wijmo.isDate(date) && wijmo.isDate(month) &&
                    date.getMonth() == month.getMonth() && date.getFullYear() == month.getFullYear();
            };
            // honor min/max range (keeping the time)
            Calendar.prototype._clamp = function (value) {
                if (value) {
                    if (this.min) {
                        var min = wijmo.DateTime.fromDateTime(this.min, value);
                        if (value < min) {
                            value = min;
                        }
                    }
                    if (this.max) {
                        var max = wijmo.DateTime.fromDateTime(this.max, value);
                        if (value > max) {
                            value = max;
                        }
                    }
                }
                return value;
            };
            // create child elements
            Calendar.prototype._createChildren = function () {
                // instantiate and apply template
                var tpl = this.getTemplate();
                this.applyTemplate('wj-control wj-calendar', tpl, {
                    _tbHdr: 'tbl-header',
                    _btnMth: 'btn-month',
                    _spMth: 'span-month',
                    _btnPrv: 'btn-prev',
                    _btnTdy: 'btn-today',
                    _btnNxt: 'btn-next',
                    _tbMth: 'tbl-month',
                    _tbYr: 'tbl-year'
                });
                // populate month calendar
                var tr = this._createElement('tr', this._tbMth, 'wj-header');
                for (var d = 0; d < 7; d++) {
                    this._createElement('td', tr);
                }
                for (var w = 0; w < 6; w++) {
                    tr = this._createElement('tr', this._tbMth);
                    for (var d = 0; d < 7; d++) {
                        this._createElement('td', tr);
                    }
                }
                // populate year calendar
                tr = this._createElement('tr', this._tbYr, 'wj-header');
                this._createElement('td', tr).setAttribute('colspan', '4');
                for (var i = 0; i < 3; i++) {
                    tr = this._createElement('tr', this._tbYr);
                    for (var j = 0; j < 4; j++) {
                        this._createElement('td', tr);
                    }
                }
            };
            // create an element, append it to another element, and set its class name
            Calendar.prototype._createElement = function (tag, parent, className) {
                var el = document.createElement(tag);
                if (parent)
                    parent.appendChild(el);
                if (className)
                    wijmo.addClass(el, className);
                return el;
            };
            // handle clicks on the calendar
            Calendar.prototype._click = function (e) {
                var handled = false;
                // get element that was clicked
                var elem = e.target;
                // switch month/year view
                if (wijmo.contains(this._btnMth, elem) && !this._monthMode()) {
                    this.monthView = !this.monthView;
                    handled = true;
                }
                else if (wijmo.contains(this._btnPrv, elem)) {
                    this._navigate(-1);
                    handled = true;
                }
                else if (wijmo.contains(this._btnNxt, elem)) {
                    this._navigate(+1);
                    handled = true;
                }
                else if (wijmo.contains(this._btnTdy, elem)) {
                    this._navigate(0);
                    handled = true;
                }
                // select day/month
                if (elem && !handled) {
                    elem = wijmo.closest(elem, 'TD');
                    if (elem) {
                        if (this.monthView) {
                            var index = this._getCellIndex(this._tbMth, elem);
                            if (index > 6 && this._canChangeValue()) {
                                var value = wijmo.DateTime.fromDateTime(wijmo.DateTime.addDays(this._firstDay, index - 7), this.value);
                                if (this._inValidRange(value) && this._valid(value)) {
                                    this.value = value;
                                }
                                handled = true;
                            }
                        }
                        else {
                            var index = this._getCellIndex(this._tbYr, elem);
                            if (index > 0) {
                                this.displayMonth = new Date(this.displayMonth.getFullYear(), index - 1, 1);
                                if (this._monthMode()) {
                                    if (this._canChangeValue()) {
                                        this.value = wijmo.DateTime.fromDateTime(this.displayMonth, this.value);
                                        if (this._inValidRange(value)) {
                                            this.value = value;
                                        }
                                    }
                                }
                                else {
                                    this.monthView = true;
                                }
                                handled = true;
                            }
                        }
                    }
                }
                // if we handled the mouse, prevent browser from seeing it
                if (handled) {
                    e.preventDefault();
                    this.focus();
                }
            };
            // gets the index of a cell in a table
            Calendar.prototype._getCellIndex = function (tbl, cell) {
                var cells = tbl.querySelectorAll('TD');
                for (var i = 0; i < cells.length; i++) {
                    if (cells[i] == cell)
                        return i;
                }
                return -1;
            };
            // handle keyboard events
            Calendar.prototype._keydown = function (e) {
                // honor defaultPrevented
                if (e.defaultPrevented)
                    return;
                // not interested in meta keys
                if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey)
                    return;
                // handle the key
                var addDays = 0, addMonths = 0, handled = true;
                if (this.monthView) {
                    switch (e.keyCode) {
                        case wijmo.Key.Left:
                            addDays = -1;
                            break;
                        case wijmo.Key.Right:
                            addDays = +1;
                            break;
                        case wijmo.Key.Up:
                            addDays = -7;
                            break;
                        case wijmo.Key.Down:
                            addDays = +7;
                            break;
                        case wijmo.Key.PageDown:
                            addMonths = +1;
                            break;
                        case wijmo.Key.PageUp:
                            addMonths = -1;
                            break;
                        default:
                            handled = false;
                            break;
                    }
                }
                else {
                    switch (e.keyCode) {
                        case wijmo.Key.Left:
                            addMonths = -1;
                            break;
                        case wijmo.Key.Right:
                            addMonths = +1;
                            break;
                        case wijmo.Key.Up:
                            addMonths = -4;
                            break;
                        case wijmo.Key.Down:
                            addMonths = +4;
                            break;
                        case wijmo.Key.PageDown:
                            addMonths = +12;
                            break;
                        case wijmo.Key.PageUp:
                            addMonths = -12;
                            break;
                        case wijmo.Key.Enter:
                            if (!this._monthMode()) {
                                this.monthView = true;
                            }
                            else {
                                handled = false;
                            }
                            break;
                        default:
                            handled = false;
                            break;
                    }
                }
                // apply the change
                if (this.value && this._canChangeValue() && (addDays || addMonths)) {
                    var dt = this.value;
                    dt = wijmo.DateTime.addDays(dt, addDays);
                    dt = wijmo.DateTime.addMonths(dt, addMonths);
                    this.value = wijmo.DateTime.fromDateTime(dt, this.value);
                }
                // if we handled the key, prevent browser from seeing it
                if (handled) {
                    e.preventDefault();
                }
            };
            // gets the month being displayed in the calendar
            Calendar.prototype._getMonth = function (date) {
                if (!date)
                    date = new Date();
                return new Date(date.getFullYear(), date.getMonth(), 1);
            };
            // returns true in month selection mode
            Calendar.prototype._monthMode = function () {
                return this.selectionMode == DateSelectionMode.Month;
            };
            // change display month by a month or a year, or skip to the current
            Calendar.prototype._navigate = function (skip) {
                var monthView = this.monthView;
                switch (skip) {
                    // today/this month
                    case 0:
                        var today = new Date();
                        if (monthView) {
                            if (this._canChangeValue()) {
                                this.value = wijmo.DateTime.fromDateTime(today, this.value); // select today's date
                            }
                        }
                        else {
                            if (this._monthMode() && this._canChangeValue()) {
                                this.value = this._getMonth(today); // select today's month
                            }
                        }
                        this.displayMonth = this._getMonth(today); // show today's month
                        break;
                    // show next month/year (keeping current value)
                    case +1:
                        this.displayMonth = wijmo.DateTime.addMonths(this.displayMonth, monthView ? +1 : +12);
                        break;
                    // show previous month/year  (keeping current value)
                    case -1:
                        this.displayMonth = wijmo.DateTime.addMonths(this.displayMonth, monthView ? -1 : -12);
                        break;
                }
            };
            /**
             * Gets or sets the template used to instantiate @see:Calendar controls.
             */
            Calendar.controlTemplate = '<div class="wj-calendar-outer wj-content">' +
                '<div wj-part="tbl-header" class="wj-calendar-header">' +
                '<div wj-part="btn-month" class="wj-month-select">' +
                '<span wj-part="span-month"></span> <span class="wj-glyph-down"></span>' +
                '</div>' +
                '<div class="wj-btn-group">' +
                '<button type="button" wj-part="btn-prev" class="wj-btn wj-btn-default"><span class="wj-glyph-left"></span></button>' +
                '<button type="button" wj-part="btn-today" class="wj-btn wj-btn-default"><span class="wj-glyph-circle"></span></button>' +
                '<button type="button" wj-part="btn-next" class="wj-btn wj-btn-default"><span class="wj-glyph-right"></span></button>' +
                '</div>' +
                '</div>' +
                '<table wj-part="tbl-month" class="wj-calendar-month"/>' +
                '<table wj-part="tbl-year" class="wj-calendar-year" style="display:none"/>' +
                '</div>';
            return Calendar;
        }(wijmo.Control));
        input.Calendar = Calendar;
    })(input = wijmo.input || (wijmo.input = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Calendar.js.map