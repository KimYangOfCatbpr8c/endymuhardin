module wijmo.input {
    'use strict';

    /**
     * Specifies constants that define the date selection behavior.
     */
    export enum DateSelectionMode {
        /** The user cannot change the current value using the mouse or keyboard. */
        None,
        /** The user can select days. */
        Day,
        /** The user can select months. */
        Month,
    }

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
    export class Calendar extends Control {

        // child elements
        private _tbHdr: HTMLTableElement;
        private _tbMth: HTMLTableElement;
        private _tbYr: HTMLTableElement;
        private _btnMth: HTMLElement;
        private _spMth: HTMLSpanElement;
        private _btnPrv : HTMLButtonElement;
        private _btnTdy: HTMLButtonElement;
        private _btnNxt: HTMLButtonElement;

        // property storage
        private _value: Date;
        private _currMonth: Date;
        private _firstDay: Date;
        private _min: Date;
        private _max: Date;
        private _fdw: number;
        private _itemFormatter: Function;
        private _itemValidator: Function;
        private _readOnly = false;
        private _selMode = DateSelectionMode.Day;

        /**
         * Gets or sets the template used to instantiate @see:Calendar controls.
         */
        static controlTemplate = '<div class="wj-calendar-outer wj-content">' +
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

        /**
         * Initializes a new instance of the @see:Calendar class.
         *
         * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
         * @param options The JavaScript object containing initialization data for the control.
         */
        constructor(element: any, options?) {
            super(element);

            // initialize value (current date)
            this._value = DateTime.newDate();
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

        //--------------------------------------------------------------------------
        //#region ** object model

        /**
         * Gets or sets the currently selected date.
         */
        get value(): Date {
            return this._value;
        }
        set value(value: Date) {
            value = asDate(value, true);

            // honor ranges (but keep the time)
            // REVIEW: should not clamp this...
            value = this._clamp(value);

            // update control
            if (this._valid(value)) {
                this.displayMonth = this._getMonth(value);
                if (!DateTime.equals(this._value, value)) {
                    this._value = value;
                    this.invalidate(false);
                    this.onValueChanged();
                }
            }
        }
        /**
         * Gets or sets the earliest date that the user can select in the calendar.
         * 
         * For details about using the @see:min and @see:max properties, please see the 
         * <a href="static/minMax.html">Using the min and max properties</a> topic.
         */
        get min(): Date {
            return this._min;
        }
        set min(value: Date) {
            if (value != this.min) {
                this._min = asDate(value, true);
                this.refresh();
            }
        }
        /**
         * Gets or sets the latest date that the user can select in the calendar.
         * 
         * For details about using the @see:min and @see:max properties, please see the 
         * <a href="static/minMax.html">Using the min and max properties</a> topic.
         */
        get max(): Date {
            return this._max;
        }
        set max(value: Date) {
            if (value != this.max) {
                this._max = asDate(value, true);
                this.refresh();
            }
        }
        /**
         * Gets or sets a value that indicates whether users can select
         * days, months, or no values at all.
         */
        get selectionMode(): DateSelectionMode {
            return this._selMode;
        }
        set selectionMode(value: DateSelectionMode) {
            if (value != this._selMode) {

                // apply new setting
                this._selMode = asEnum(value, DateSelectionMode);

                // update monthView
                var mthMode = this._monthMode();
                if (mthMode) this.monthView = false;

                // update month glyph
                var mthGlyph = <HTMLElement>this._btnMth.querySelector('.wj-glyph-down');
                if (mthGlyph) mthGlyph.style.display = mthMode ? 'none' : '';
            }
        }
        /**
         * Gets or sets a value that indicates whether the user can modify
	     * the control value using the mouse and keyboard.
         */
        get isReadOnly(): boolean {
            return this._readOnly;
        }
        set isReadOnly(value: boolean) {
            this._readOnly = asBoolean(value);
            toggleClass(this.hostElement, 'wj-state-readonly', this.isReadOnly);
        }
        /**
         * Gets or sets a value that represents the first day of the week,
         * the one displayed in the first column of the calendar.
         *
         * Setting this property to null causes the calendar to use the default
         * for the current culture. In the English culture, the first day of the 
         * week is Sunday (0); in most European cultures, the first day of the
         * week is Monday (1).
         */
        get firstDayOfWeek(): number {
            return this._fdw;
        }
        set firstDayOfWeek(value: number) {
            if (value != this._fdw) {
                value = asNumber(value, true);
                if (value && (value > 6 || value < 0)) {
                    throw 'firstDayOfWeek must be between 0 and 6 (Sunday to Saturday).'
                }
                this._fdw = value;
                this.refresh();
            }
        }
        /**
         * Gets or sets the month displayed in the calendar.
         */
        get displayMonth(): Date {
            return this._currMonth;
        }
        set displayMonth(value: Date) {
            if (!DateTime.equals(this.displayMonth, value)) {
                value = asDate(value);
                var valid = this.monthView // TFS 208757
                    ? this._monthInValidRange(value)
                    : this._yearInValidRange(value);
                if (valid) {
                    this._currMonth = this._getMonth(this._clamp(value));  // TFS 208757
                    this.invalidate(true);
                    this.onDisplayMonthChanged();
                }
            }
        }
        /**
         * Gets or sets a value indicating whether the control displays the header 
         * area with the current month and navigation buttons.
         */
        get showHeader(): boolean {
            return this._tbHdr.style.display != 'none';
        }
        set showHeader(value: boolean) {
            this._tbHdr.style.display = asBoolean(value) ? '' : 'none';
        }
        /**
         * Gets or sets a value indicating whether the calendar displays a month or a year.
         */
        get monthView(): boolean {
            return this._tbMth.style.display != 'none';
        }
        set monthView(value: boolean) {
            if (value != this.monthView) {
                this._tbMth.style.display = value ? '' : 'none';
                this._tbYr.style.display = value ? 'none' : '';
            }
        }
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
        get itemFormatter(): Function {
            return this._itemFormatter;
        }
        set itemFormatter(value: Function) {
            if (value != this._itemFormatter) {
                this._itemFormatter = asFunction(value);
                this.invalidate();
            }
        }
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
        get itemValidator(): Function {
            return this._itemValidator;
        }
        set itemValidator(value: Function) {
            if (value != this._itemValidator) {
                this._itemValidator = asFunction(value);
                this.invalidate();
            }
        }
        /**
         * Occurs after a new date is selected.
         */
        valueChanged = new Event();
        /**
         * Raises the @see:valueChanged event.
         */
        onValueChanged(e?: EventArgs) {
            this.valueChanged.raise(this, e);
        }
        /**
         * Occurs after the @see:displayMonth property changes.
         */
        displayMonthChanged = new Event();
        /**
         * Raises the @see:displayMonthChanged event.
         */
        onDisplayMonthChanged(e?: EventArgs) {
            this.displayMonthChanged.raise(this, e);
        }
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
        formatItem = new Event();
        /**
         * Raises the @see:formatItem event.
         *
         * @param e @see:FormatItemEventArgs that contains the event data.
         */
        onFormatItem(e: FormatItemEventArgs) {
            this.formatItem.raise(this, e);
        }

        /**
         * Refreshes the control.
         *
         * @param fullUpdate Indicates whether to update the control layout as well as the content.
         */
        refresh(fullUpdate = true) {
            var cells: any,
                cell: HTMLElement,
                day: Date,
                month = this.displayMonth,
                fdw = this.firstDayOfWeek != null ? this.firstDayOfWeek : Globalize.getFirstDayOfWeek();

            // call base class to suppress any pending invalidations
            super.refresh(fullUpdate);

            // calculate first day of the calendar
            this._firstDay = DateTime.addDays(month, -(month.getDay() - fdw + 7) % 7);

            // update current display month (e.g. January 2014)
            setText(this._spMth, Globalize.format(month, 'y'));

            // update week day headers (localizable)
            cells = this._tbMth.querySelectorAll('td');
            for (var i = 0; i < 7 && i < cells.length; i++) {
                day = DateTime.addDays(this._firstDay, i);
                setText(cells[i], Globalize.format(day, 'ddd'));
            }

            // update month days
            for (var i = 7; i < cells.length; i++) {
                cell = cells[i];
                day = DateTime.addDays(this._firstDay, i - 7);
                setText(cell, day.getDate().toString());
                cell.className = '';
                var invalid = !this._valid(day);
                toggleClass(cell, 'wj-state-invalid', invalid);
                toggleClass(cell, 'wj-state-selected', DateTime.sameDate(day, this.value));
                toggleClass(cell, 'wj-day-today', DateTime.sameDate(day, new Date()));
                toggleClass(cell, 'wj-day-othermonth', invalid || day.getMonth() != month.getMonth() || !this._inValidRange(day));

                // customize the display
                if (this.itemFormatter) {
                    this.itemFormatter(day, cell);
                }
                if (this.formatItem.hasHandlers) {
                    var e = new FormatItemEventArgs(i, day, cell);
                    this.onFormatItem(e);
                }
            }

            // hide rows that belong to the next month
            var rows = this._tbMth.querySelectorAll('tr');
            if (rows.length) {
                day = DateTime.addDays(this._firstDay, 28);
                (<HTMLElement>rows[rows.length - 2]).style.display = (day.getMonth() == month.getMonth()) ? '' : 'none';
                day = DateTime.addDays(this._firstDay, 35);
                (<HTMLElement>rows[rows.length - 1]).style.display = (day.getMonth() == month.getMonth()) ? '' : 'none';
            }

            // update current year 
            cells = this._tbYr.querySelectorAll('td');
            if (cells.length) {
                setText(cells[0], month.getFullYear().toString());
            }

            // update month names
            for (var i = 1; i < cells.length; i++) {
                cell = cells[i];
                day = new Date(month.getFullYear(), i - 1, 1);
                setText(cell, Globalize.format(day, 'MMM'));
                cell.className = '';
                toggleClass(cell, 'wj-state-disabled', !this._monthInValidRange(day));
                toggleClass(cell, 'wj-state-selected', this._sameMonth(day, this.value));
            }
        }

        //#endregion

        //--------------------------------------------------------------------------
        //#region ** implementation

        // checks whether the control can change the current value
        private _canChangeValue(): boolean {
            return !this._readOnly && this._selMode != DateSelectionMode.None;
        }

        // check whether a date should be selectable by the user
        private _valid(date: Date): boolean {
            return this.itemValidator && date
                ? this.itemValidator(date)
                : true;
        }

        // check whether a day is within the valid range
        private _inValidRange(date: Date) {
            if (this.min && date < DateTime.fromDateTime(this.min, date)) return false;
            if (this.max && date > DateTime.fromDateTime(this.max, date)) return false;
            return true;
        }

        // check whether a month contains days in the valid range
        private _monthInValidRange(month: Date) {
            var y = month.getFullYear(),
                m = month.getMonth(),
                first = new Date(y, m, 1),
                last = DateTime.addDays(new Date(y, m + 1), -1);
            return this._inValidRange(first) || this._inValidRange(last);
        }

        // check whether a year contains days in the valid range
        private _yearInValidRange(year: Date) {
            var y = year.getFullYear(),
                first = new Date(y, 0),
                last = DateTime.addDays(new Date(y + 1, 0), -1);
            return this._inValidRange(first) || this._inValidRange(last);
        }

        // checks whether a date is in the current month
        private _sameMonth(date: Date, month: Date): boolean {
            return isDate(date) && isDate(month) &&
                date.getMonth() == month.getMonth() && date.getFullYear() == month.getFullYear();
        }

        // honor min/max range (keeping the time)
        _clamp(value: Date): Date {
            if (value) {
                if (this.min) {
                    var min = DateTime.fromDateTime(this.min, value);
                    if (value < min) {
                        value = min;
                    }
                }
                if (this.max) {
                    var max = DateTime.fromDateTime(this.max, value);
                    if (value > max) {
                        value = max;
                    }
                }
            }
            return value;
        }

        // create child elements
        private _createChildren() {

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
        }

        // create an element, append it to another element, and set its class name
        private _createElement(tag: string, parent?: HTMLElement, className?: string) {
            var el = document.createElement(tag);
            if (parent) parent.appendChild(el);
            if (className) addClass(el, className);
            return el;
        }

        // handle clicks on the calendar
        private _click(e: MouseEvent) {
            var handled = false;

            // get element that was clicked
            var elem = <HTMLElement>e.target;

            // switch month/year view
            if (contains(this._btnMth, elem) && !this._monthMode()) {
                this.monthView = !this.monthView;
                handled = true;
            }

            // navigate month/year
            else if (contains(this._btnPrv, elem)) {
                this._navigate(-1);
                handled = true;
            } else if (contains(this._btnNxt, elem)) {
                this._navigate(+1);
                handled = true;
            } else if (contains(this._btnTdy, elem)) {
                this._navigate(0);
                handled = true;
            }

            // select day/month
            if (elem && !handled) {
                elem = <HTMLElement>closest(elem, 'TD');
                if (elem) {
                    if (this.monthView) {
                        var index = this._getCellIndex(this._tbMth, elem);
                        if (index > 6 && this._canChangeValue()) {
                            var value = DateTime.fromDateTime(DateTime.addDays(this._firstDay, index - 7), this.value);
                            if (this._inValidRange(value) && this._valid(value)) {
                                this.value = value;
                            }
                            handled = true;
                        }
                    } else {
                        var index = this._getCellIndex(this._tbYr, elem);
                        if (index > 0) {
                            this.displayMonth = new Date(this.displayMonth.getFullYear(), index - 1, 1);
                            if (this._monthMode()) {
                                if (this._canChangeValue()) {
                                    var value = DateTime.fromDateTime(this.displayMonth, this.value);
                                    if (this._inValidRange(value)) {
                                        this.value = value;
                                    }
                                }
                            } else {
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
        }

        // gets the index of a cell in a table
        private _getCellIndex(tbl: HTMLTableElement, cell: HTMLElement): number {
            var cells = tbl.querySelectorAll('TD');
            for (var i = 0; i < cells.length; i++) {
                if (cells[i] == cell) return i;
            }
            return -1;
        }

        // handle keyboard events
        private _keydown(e: KeyboardEvent) {

            // honor defaultPrevented
            if (e.defaultPrevented) return;

            // not interested in meta keys
            if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;

            // handle the key
            var addDays = 0,
                addMonths = 0,
                handled = true;
            if (this.monthView) { // add days
                switch (e.keyCode) {
                    case Key.Left:
                        addDays = -1;
                        break;
                    case Key.Right:
                        addDays = +1;
                        break;
                    case Key.Up:
                        addDays = -7;
                        break;
                    case Key.Down:
                        addDays = +7;
                        break;
                    case Key.PageDown:
                        addMonths = +1;
                        break;
                    case Key.PageUp:
                        addMonths = -1;
                        break;
                    default:
                        handled = false;
                        break;
                }
            } else { // add months
                switch (e.keyCode) {
                    case Key.Left:
                        addMonths = -1;
                        break;
                    case Key.Right:
                        addMonths = +1;
                        break;
                    case Key.Up:
                        addMonths = -4;
                        break;
                    case Key.Down:
                        addMonths = +4;
                        break;
                    case Key.PageDown:
                        addMonths = +12;
                        break;
                    case Key.PageUp:
                        addMonths = -12;
                        break;
                    case Key.Enter:
                        if (!this._monthMode()) {
                            this.monthView = true;
                        } else {
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
                dt = DateTime.addDays(dt, addDays);
                dt = DateTime.addMonths(dt, addMonths);
                this.value = DateTime.fromDateTime(dt, this.value);
            }

            // if we handled the key, prevent browser from seeing it
            if (handled) {
                e.preventDefault();
            }
        }

        // gets the month being displayed in the calendar
        private _getMonth(date: Date) {
            if (!date) date = new Date();
            return new Date(date.getFullYear(), date.getMonth(), 1);
        }

        // returns true in month selection mode
        private _monthMode() {
            return this.selectionMode == DateSelectionMode.Month;
        }

        // change display month by a month or a year, or skip to the current
        private _navigate(skip: number) {
            var monthView = this.monthView;
            switch (skip) {

                // today/this month
                case 0: 
                    var today = new Date();
                    if (monthView) {
                        if (this._canChangeValue()) {
                            this.value = DateTime.fromDateTime(today, this.value); // select today's date
                        } 
                    } else { // year view
                        if (this._monthMode() && this._canChangeValue()) {
                            this.value = this._getMonth(today); // select today's month
                        }
                    }
                    this.displayMonth = this._getMonth(today); // show today's month
                    break;

                // show next month/year (keeping current value)
                case +1: 
                    this.displayMonth = DateTime.addMonths(this.displayMonth, monthView ? +1 : +12);
                    break;

                // show previous month/year  (keeping current value)
                case -1: 
                    this.displayMonth = DateTime.addMonths(this.displayMonth, monthView ? -1 : -12);
                    break;
            }
        }

        //#endregion
   }
}