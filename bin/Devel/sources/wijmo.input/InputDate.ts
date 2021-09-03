module wijmo.input {
    'use strict';

    /**
     * The @see:InputDate control allows users to type in dates using any format 
     * supported by the @see:Globalize class, or to pick dates from a drop-down box
     * that shows a @see:Calendar control.
     *
     * Use the @see:min and @see:max properties to restrict the range of 
     * values that the user can enter.
     * 
     * For details about using the @see:min and @see:max properties, please see the 
     * <a href="static/minMax.html">Using the min and max properties</a> topic.
     *
     * Use the @see:value property to gets or set the currently selected date.
     *
     * The example below shows a <b>Date</b> value (that includes date and time information)
     * using an @see:InputDate and an an @see:InputTime control. Notice how both controls
     * are bound to the same controller variable, and each edits the appropriate information
     * (either date or time). The example also shows a @see:Calendar control that you can 
     * use to select the date with a single click.
     *
     * @fiddle:vgc3Y
     */
    export class InputDate extends DropDown {

        // child control
        _calendar: Calendar;

        // property storage
        _value: Date;
        _format = 'd';
        _calChanged: boolean;
        _msk: _MaskProvider;

        // private stuff

        /**
         * Initializes a new instance of the @see:InputDate class.
         *
         * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
         * @param options The JavaScript object containing initialization data for the control.
         */
        constructor(element: any, options?) {
            super(element);
            addClass(this.hostElement, 'wj-inputdate');

            // initialize mask provider
            this._msk = new _MaskProvider(this._tbx);

            // default to numeric keyboard (like InputNumber), unless this is IE9...
            if (!isIE9()) {
                this._tbx.type = 'tel';
            }

            // use wheel to increase/decrease the date
            this.addEventListener(this.hostElement, 'wheel', (e: WheelEvent) => {
                if (!e.defaultPrevented && !this.isDroppedDown && this.containsFocus()) {
                    if (this.value != null && this._canChangeValue()) {
                        var step = clamp(-e.deltaY, -1, +1);
                        this.value = this.selectionMode == DateSelectionMode.Month
                            ? DateTime.addMonths(this.value, step)
                            : DateTime.addDays(this.value, step);
                        this.selectAll();
                        e.preventDefault();
                    }
                }
            });

            // initialize value (current date) TFS 193848
            this.value = DateTime.newDate();

            // initializing from <input> tag
            if (this._orgTag == 'INPUT') {
                var value = this._tbx.getAttribute('value');
                if (value) {
                    this.value = Globalize.parseDate(value, 'yyyy-MM-dd');
                }
            }

            // initialize control options
            this.isRequired = true;
            this.initialize(options);
        }

        //--------------------------------------------------------------------------
        //#region ** object model

        /**
         * Gets or sets the current date.
         */
        get value(): Date {
            return this._value;
        }
        set value(value: Date) {
            if (DateTime.equals(this._value, value)) {
                this._tbx.value = Globalize.format(value, this.format);
            } else {

                // check type
                value = asDate(value, !this.isRequired || (value == null && this._value == null));

                // honor min/max range
                // REVIEW: should not clamp this...
                value = this._clamp(value);

                // update control text and value
                if (this._isValidDate(value)) {
                    this._tbx.value = value ? Globalize.format(value, this.format) : '';
                    if (value != this._value && !DateTime.equals(this._value, value)) {
                        this._value = value;
                        this.onValueChanged();
                    }
                } else {
                    this._tbx.value = value ? Globalize.format(this.value, this.format) : '';
                }

                // raise textChanged event
                if (this.text != this._oldText) {
                    this.onTextChanged();
                }
            }
        }
        /**
         * Gets or sets the text shown on the control.
         */
        get text(): string {
            return this._tbx.value;
        }
        set text(value: string) {
            if (value != this.text) {
                this._setText(value, true);
                this._commitText();
            }
        }
        /**
         * Gets or sets a value that indicates whether users can select
         * days, months, or no values at all.
         *
         * This property affects the behavior of the drop-down calendar,
         * but not the format used to display dates.
         * If you set @see:selectionMode to 'Month', you should normally
         * set the @see:format property to 'MMM yyyy' or some format that
         * does not include the day. For example:
         *
         * <pre>var inputDate = new wijmo.input.InputDate('#el, {
         *   selectionMode: 'Month',
         *   format: 'MMM yyyy'
         * });</pre>
         */
        get selectionMode(): DateSelectionMode {
            return this.calendar.selectionMode;
        }
        set selectionMode(value: DateSelectionMode) {
            this.calendar.selectionMode = value;
        }
        /**
         * Gets or sets the earliest date that the user can enter.
         * 
         * For details about using the @see:min and @see:max properties, please see the 
         * <a href="static/minMax.html">Using the min and max properties</a> topic.
         */
        get min(): Date {
            return this._calendar.min;
        }
        set min(value: Date) {
            this._calendar.min = asDate(value, true);
        }
        /**
         * Gets or sets the latest date that the user can enter.
         * 
         * For details about using the @see:min and @see:max properties, please see the 
         * <a href="static/minMax.html">Using the min and max properties</a> topic.
         */
        get max(): Date {
            return this._calendar.max;
        }
        set max(value: Date) {
            this._calendar.max = asDate(value, true);
        }
        /**
         * Gets or sets the format used to display the selected date.
         *
         * The format string is expressed as a .NET-style 
         * <a href="http://msdn.microsoft.com/en-us/library/8kb3ddd4(v=vs.110).aspx" target="_blank">
         * Date format string</a>.
         */
        get format(): string {
            return this._format;
        }
        set format(value: string) {
            if (value != this.format) {
                this._format = asString(value);
                this._tbx.value = Globalize.format(this.value, this.format);
            }
        }
        /**
         * Gets or sets a mask to use while editing.
         *
         * The mask format is the same one that the @see:wijmo.input.InputMask
         * control uses.
         *
         * If specified, the mask must be compatible with the value of
         * the @see:format property. For example, the mask '99/99/9999' can 
         * be used for entering dates formatted as 'MM/dd/yyyy'.
         */
        get mask(): string {
            return this._msk.mask;
        }
        set mask(value: string) {
            this._msk.mask = asString(value);
        }
        /**
         * Gets a reference to the @see:Calendar control shown in the drop-down box.
         */
        get calendar() : Calendar {
            return this._calendar;
        }
        /**
         * Gets the HTML input element hosted by the control.
         *
         * Use this property in situations where you want to customize the
         * attributes of the input element.
         */
        get inputElement(): HTMLInputElement {
            return this._tbx;
        }
        /**
         * Gets or sets the "type" attribute of the HTML input element hosted by the control.
         *
         * By default, this property is set to "tel", a value that causes mobile devices to
         * show a numeric keypad that includes a negative sign and a decimal separator.
         *
         * Use this property to change the default setting if the default does not work well
         * for the current culture, device, or application. In those cases, try changing
         * the value to "number" or "text."
         *
         * Note that input elements with type "number" prevent selection in Chrome and therefore
         * is not recommended. For more details, see this link:
         * http://stackoverflow.com/questions/21177489/selectionstart-selectionend-on-input-type-number-no-longer-allowed-in-chrome
         */
        get inputType(): string {
            return this._tbx.type;
        }
        set inputType(value: string) {
            this._tbx.type = asString(value);
        }
        /**
         * Gets or sets a validator function to determine whether dates are valid for selection.
         *
         * If specified, the validator function should take one parameter representing the
         * date to be tested, and should return false if the date is invalid and should not 
         * be selectable.
         *
         * For example, the code below prevents users from selecting dates that fall on
         * weekends:
         * <pre>
         * inputDate.itemValidator = function(date) {
         *   var weekday = date.getDay();
         *   return weekday != 0 && weekday != 6;
         * }
         * </pre>
         */
        get itemValidator(): Function {
            return this._calendar.itemValidator;
        }
        set itemValidator(value: Function) {
            if (value != this.itemValidator) {
                this._calendar.itemValidator = asFunction(value);
                this.invalidate();
            }
        }
        /**
         * Gets or sets a formatter function to customize dates in the drop-down calendar.
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
         * inputDate.itemFormatter = function(date, element) {
         *   var day = date.getDay();
         *   element.style.backgroundColor = day == 0 || day == 6 ? 'yellow' : '';
         * }
         * </pre>
         */
        get itemFormatter(): Function {
            return this.calendar.itemFormatter;
        }
        set itemFormatter(value: Function) {
            if (value != this.itemFormatter) {
                this.calendar.itemFormatter = asFunction(value);
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

        //#endregion ** object model

        //--------------------------------------------------------------------------
        //#region ** overrides

        // update value display in case culture changed
        refresh() {
            this.isDroppedDown = false;
            if (this._msk) {
                this._msk.refresh();
            }
            if (this._calendar) {
                this._calendar.refresh();
            }
            this._tbx.value = Globalize.format(this.value, this.format);
        }

        // overridden to update calendar when dropping down
        onIsDroppedDownChanged(e?: EventArgs) {
            super.onIsDroppedDownChanged(e);
            if (this.isDroppedDown) {
                this._calChanged = false;
                this.dropDown.focus();
            }
        }

        // create the drop-down element
        protected _createDropDown() {

            // create the drop-down element
            this._calendar = new Calendar(this._dropDown);
            this._dropDown.tabIndex = -1;

            // update our value to match calendar's
            this._calendar.valueChanged.addHandler(() => {
                this.value = DateTime.fromDateTime(this._calendar.value, this.value);
                this._calChanged = true; // remember change to close drop-down on click
            });

            // close the drop-down when the user changes the date with the mouse
            // the 'click' event may not be triggered on iOS Safari if focus change 
            // happens during previous tap, so use 'mouseup' instead.
            //this.addEventListener(this._dropDown, 'click', () => {
            this.addEventListener(this._dropDown, 'mouseup', (e) => {
                if (this._calChanged) { // TFS 205928
                    this.isDroppedDown = false;
                } else {
                    if (e.target.getAttribute('wj-part') == 'btn-today') { // today button
                        this.isDroppedDown = false;
                    }
                }
            });
        }

        // update drop down content and position before showing it
        protected _updateDropDown() {

            // update value
            this._commitText();

            // update selected date, range
            var cal = this._calendar;
            cal.value = this.value;
            cal.min = this.min;
            cal.max = this.max;

            // update view
            if (this.selectionMode != DateSelectionMode.Month) {
                cal.monthView = true;
            }

            // update size
            var cs = getComputedStyle(this.hostElement);
            this._dropDown.style.minWidth = parseFloat(cs.fontSize) * 18 + 'px';
            this._calendar.refresh(); // update layout/size now

            // let base class update position
            super._updateDropDown();
        }

        // override to commit text on Enter and cancel on Escape
        protected _keydown(e: KeyboardEvent) {
            if (!e.defaultPrevented && !e.altKey && !e.ctrlKey && !e.metaKey) { // TFS 199387
                switch (e.keyCode) {
                    case Key.Enter:
                        this._commitText();
                        this.selectAll();
                        break;
                    case Key.Escape:
                        this.text = Globalize.format(this.value, this.format);
                        this.selectAll();
                        break;
                    case Key.Up:
                    case Key.Down:
                        if (!this.isDroppedDown && this.value && this._canChangeValue()) {
                            var step = e.keyCode == Key.Up ? +1 : -1;
                            this.value = this.selectionMode == DateSelectionMode.Month
                                ? DateTime.addMonths(this.value, step)
                                : DateTime.addDays(this.value, step);
                            this.selectAll();
                            e.preventDefault();
                        }
                        break;
                }
            }
            super._keydown(e);
        }

        //#endregion ** overrides

        //--------------------------------------------------------------------------
        //#region ** implementation

        // checks whether the control can change the current value
        private _canChangeValue(): boolean {
            return !this.isReadOnly && this.selectionMode != DateSelectionMode.None;
        }

        // honor min/max range
        protected _clamp(value: Date): Date {
            return this.calendar._clamp(value);
        }

        // parse date, commit date part (no time) if successful or revert
        protected _commitText() {
            var txt = this._tbx.value;
            if (!txt && !this.isRequired) {
                this.value = null;
            } else {
                var dt = Globalize.parseDate(txt, this.format);
                if (dt) {
                    this.value = DateTime.fromDateTime(dt, this.value);
                } else {
                    this._tbx.value = Globalize.format(this.value, this.format);
                }
            }
        }

        // check whether a date should be selectable by the user
        private _isValidDate(value: Date): boolean {
            if (value) {
                if (this._clamp(value) != value) { // check range
                    return false;
                }
                if (this.itemValidator && !this.itemValidator(value)) { // check validity
                    return false;
                }
            }
            return true;
        }

       //#endregion ** implementation
    }
}