module wijmo.input {
    'use strict';

    /**
     * The @see:InputDateTime control extends the @see:InputDate control to allows users 
     * to input dates and times, either by typing complete date/time values in any format 
     * supported by the @see:Globalize class, or by picking dates from a drop-down calendar
     * and times from a drop-down list.
     *
     * Use the @see:InputDateTime.min and @see:InputDateTime.max properties to restrict
     * the range of dates that the user can enter.
     *
     * Use the @see:InputDateTime.timeMin and @see:InputDateTime.timeMax properties to
     * restrict the range of times that the user can enter.
     * 
     * Use the @see:InputDateTime.value property to gets or set the currently selected
     * date/time.
     */
    export class InputDateTime extends InputDate {
        _btnTm: HTMLElement;
        _inputTime: InputTime;

        /**
         * Gets or sets the template used to instantiate @see:InputDateTime controls.
         */
        static controlTemplate = '<div style="position:relative" class="wj-template">' +
          '<div class="wj-input">' +
            '<div class="wj-input-group wj-input-btn-visible">' +
              '<input wj-part="input" type="text" class="wj-form-control" />' +
              '<span class="wj-input-group-btn" tabindex="-1">' +
                '<button wj-part="btn" class="wj-btn wj-btn-default" type="button" tabindex="-1">' +
                  '<span class="wj-glyph-calendar"></span>' +
                '</button>' +
                '<button wj-part="btn-tm" class="wj-btn wj-btn-default" type="button" tabindex="-1">' +
                  '<span class="wj-glyph-clock"></span>' +
                '</button>' +
              '</span>' +
            '</div>' +
          '</div>' +
          '<div wj-part="dropdown" class="wj-content wj-dropdown-panel" ' +
                'style="display:none;position:absolute;z-index:100;width:auto">' +
          '</div>' +
        '</div>';

        //--------------------------------------------------------------------------
        //#region ** ctor

        /**
         * Initializes a new instance of the @see:InputDateTime class.
         *
         * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
         * @param options The JavaScript object containing initialization data for the control.
         */
        constructor(element: any, options?) {
            super(element);
            addClass(this.hostElement, 'wj-inputdatetime');

            // get reference to drop-down button for time part
            this._btnTm = <HTMLElement>this.hostElement.querySelector('[wj-part="btn-tm"]');

            // change default format to show date and time
            this._format = 'g';

            // create InputTime control (with additional drop-down)
            this._inputTime = new InputTime(document.createElement('div'));

            // update time when user selects a new value from time drop-down
            this._inputTime.valueChanged.addHandler(() => {

                // update value
                this.value = DateTime.fromDateTime(this.value, this._inputTime.value);

                // switch focus to input element
                if (this.containsFocus()) {
                    if (!this.isTouching || !this.showDropDownButton) {
                        this.selectAll();
                    }
                }
            });

            // create time picker drop-down
            var tmDropdown = this._inputTime.dropDown;

            // attach keyboard to time picker drop-down (open/close/commit, F4/Enter/Escape etc)
            var kd = this._keydown.bind(this);
            this.addEventListener(tmDropdown, 'keydown', kd, true);

            // handle focus (we have an extra drop-down)
            this.addEventListener(tmDropdown, 'blur', () => {
                this._updateFocusState();
            }, true);

            // handle clicks on the drop-down button (show drop-down, manage focus)
            this.addEventListener(this._btnTm, 'click', this._btnclick.bind(this));

            // switch editors on mousedown
            this.addEventListener(this._btn, 'mousedown', () => {
                this._setDropdown(this.calendar.hostElement);
            });
            this.addEventListener(this._btnTm, 'mousedown', (e: MouseEvent) => {

                // if we're showing the time drop-down, the mousedown will cause
                // the input time to lose focus and close the drop-down; 
                // so prevent the default action to avoid having the click event 
                // re-open the drop-down.
                if (this.isDroppedDown && this.dropDown == tmDropdown) {
                    e.preventDefault();
                }

                this._inputTime.dropDownCssClass = this.dropDownCssClass;
                this._setDropdown(tmDropdown);
            });

            // initialize control options
            this.initialize(options);
        }

        //#endregion
        //--------------------------------------------------------------------------
        //#region ** object model

        /**
         * Gets or sets the earliest time that the user can enter. 
         */
        get timeMin(): Date {
            return this._inputTime.min;
        }
        set timeMin(value: Date) {
            this._inputTime.min = value;
        }
        /**
         * Gets or sets the latest time that the user can enter.
         */
        get timeMax(): Date {
            return this._inputTime.max;
        }
        set timeMax(value: Date) {
            this._inputTime.max = value;
        }
        /**
         * Gets or sets the format used to display times in the drop-down list.
         *
         * This property does not affect the value shown in the control's input element. 
         * That value is formatted using the @see:format property.
         *
         * The format string is expressed as a .NET-style 
         * <a href="http://msdn.microsoft.com/en-us/library/8kb3ddd4(v=vs.110).aspx" target="_blank">
         * time format string</a>.
         */
        get timeFormat(): string {
            return this._inputTime.format;
        }
        set timeFormat(value: string) {
            this._inputTime.format = value;
        }
        /**
         * Gets or sets the number of minutes between entries in the drop-down list of times.
         */
        get timeStep(): number {
            return this._inputTime.step;
        }
        set timeStep(value: number) {
            this._inputTime.step = value;
        }

        //#endregion
        //--------------------------------------------------------------------------
        //#region ** overrides

        // update value display in case culture changed
        refresh() {
            super.refresh(); // Date
            this._inputTime.refresh(); // Time
        }

        // update drop-down button visibility
        protected _updateBtn() {
            super._updateBtn();
            if (this._btnTm) {
                this._btnTm.tabIndex = this._btn.tabIndex;
                this._btnTm.parentElement.style.display = this._btn.style.display;
            }
        }

        // honor min/max range (date and time)
        protected _clamp(value: Date): Date {
            if (value) {
                if (this.min && value < this.min) {
                    value = this.min;
                }
                if (this.max && value > this.max) {
                    value = this.max;
                }
            }
            return value;
        }

        // parse date, commit date and time parts if successful or revert
        protected _commitText() {
            var txt = this._tbx.value;
            if (!txt && !this.isRequired) {
                this.value = null;
            } else {
                var dt = Globalize.parseDate(txt, this.format);
                if (dt) {
                    this.value = dt;
                } else {
                    this._tbx.value = Globalize.format(this.value, this.format);
                }
            }
        }

        //#endregion
        //--------------------------------------------------------------------------
        //#region ** implementation

        // selects a drop-down element (date/time)
        protected _setDropdown(e: HTMLElement) {
            if (this._dropDown != e) {
                if (this.isDroppedDown) {
                    this.isDroppedDown = false;
                }
                this._dropDown = e;
            }
        }

        // update drop down content before showing it
        protected _updateDropDown() {
            var tm = this._inputTime;
            if (this._dropDown == tm.dropDown) {
                this._commitText();
                super._updateDropDown();
                tm.isRequired = this.isRequired;
                tm.value = this.value;
                if (this.isDroppedDown) {
                    tm.listBox.showSelection();
                }
            } else {
                super._updateDropDown();
            }
        }

        //#endregion
    }
}