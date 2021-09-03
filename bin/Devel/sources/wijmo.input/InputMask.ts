module wijmo.input {
    'use strict';

    /**
     * The @see:InputMask control provides a way to govern what a user is allowed to input.
     *
     * The control prevents users from accidentally entering invalid data and 
     * saves time by skipping over literals (such as slashes in dates) as the user types.
     *
     * The mask used to validate the input is defined by the @see:InputMask.mask property,
     * which may contain one or more of the following special characters:
     *
     *  <dl class="dl-horizontal">
     *      <dt>0</dt>      <dd>Digit.</dd>
     *      <dt>9</dt>      <dd>Digit or space.</dd>
     *      <dt>#</dt>      <dd>Digit, sign, or space.</dd>
     *      <dt>L</dt>      <dd>Letter.</dd>
     *      <dt>l</dt>      <dd>Letter or space.</dd>
     *      <dt>A</dt>      <dd>Alphanumeric.</dd>
     *      <dt>a</dt>      <dd>Alphanumeric or space.</dd>
     *      <dt>.</dt>      <dd>Localized decimal point.</dd>
     *      <dt>,</dt>      <dd>Localized thousand separator.</dd>
     *      <dt>:</dt>      <dd>Localized time separator.</dd>
     *      <dt>/</dt>      <dd>Localized date separator.</dd>
     *      <dt>$</dt>      <dd>Localized currency symbol.</dd>
     *      <dt>&lt;</dt>   <dd>Converts characters that follow to lowercase.</dd>
     *      <dt>&gt;</dt>   <dd>Converts characters that follow to uppercase.</dd>
     *      <dt>|</dt>      <dd>Disables case conversion.</dd>
     *      <dt>\</dt>      <dd>Escapes any character, turning it into a literal.</dd>
     *      <dt>９</dt>      <dd>DBCS Digit.</dd>
     *      <dt>Ｊ</dt>      <dd>DBCS Hiragana.</dd>
     *      <dt>Ｇ</dt>      <dd>DBCS big Hiragana.</dd>
     *      <dt>Ｋ</dt>      <dd>DBCS Katakana. </dd>
     *      <dt>Ｎ</dt>      <dd>DBCS big Katakana.</dd>
     *      <dt>K</dt>      <dd>SBCS Katakana.</dd>
     *      <dt>N</dt>      <dd>SBCS big Katakana.</dd>
     *      <dt>Ｚ</dt>      <dd>Any DBCS character.</dd>
     *      <dt>H</dt>      <dd>Any SBCS character.</dd>
     *      <dt>All others</dt><dd>Literals.</dd>
     *  </dl>
     */
    export class InputMask extends Control {

        // child elements
        _tbx: HTMLInputElement;

        // property storage
        _msk: _MaskProvider;

        /**
         * Gets or sets the template used to instantiate @see:InputMask controls.
         */
        static controlTemplate = '<div class="wj-input">' +
                '<div class="wj-input-group">' +
                    '<input wj-part="input" class="wj-form-control"/>' +
                '</div>';
            '</div>';

        /**
         * Initializes a new instance of the @see:InputMask class.
         *
         * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
         * @param options The JavaScript object containing initialization data for the control.
         */
        constructor(element: any, options?) {
            super(element);

            // instantiate and apply template
            var tpl = this.getTemplate();
            this.applyTemplate('wj-control wj-inputmask wj-content', tpl, {
                _tbx: 'input'
            }, 'input');

            // initialize value from <input> tag
            if (this._orgTag == 'INPUT') {
                var value = this._tbx.getAttribute('value');
                if (value) {
                    this.value = value;
                }
            }

            // create mask provider
            this._msk = new _MaskProvider(this._tbx);

            // initialize control options
            this.isRequired = true;
            this.initialize(options);

            // update mask on input
            this.addEventListener(this._tbx, 'input', () => {
                setTimeout(() => { // wait for _MaskProvider...
                    this.onValueChanged();
                });
            });
        }

        //--------------------------------------------------------------------------
        //#region ** object model

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
         * Gets or sets the text currently shown in the control.
         */
        get value(): string {
            return this._tbx.value;
        }
        set value(value: string) {
            if (value != this.value) {

                // assign unmasked value to input element
                this._tbx.value = asString(value);

                // move selection to end without disturbing the focus (TFS 152756)
                // (for IE consistency with typing, important for vague literal handling)
                var ae = getActiveElement();
                this._tbx.selectionStart = this._tbx.value.length;
                if (ae && ae != getActiveElement()) {
                    ae.focus();
                }

                // update masked value
                value = this._msk._applyMask();

                // update input element
                this._tbx.value = value;
                this.onValueChanged();
            }
        }
        /**
         * Gets or sets the raw value of the control (excluding mask literals).
         *
         * The raw value of the control excludes prompt and literal characters.
         * For example, if the @see:mask property is set to "AA-9999" and the
         * user enters the value "AB-1234", the @see:rawValue property will return
         * "AB1234", excluding the hyphen that is part of the mask.
         */
        get rawValue(): string {
            return this._msk.getRawValue();
        }
        set rawValue(value: string) {
            this.value = value;
        }
        /**
         * Gets or sets the mask used to validate the input as the user types.
         *
         * The mask is defined as a string with one or more of the masking 
         * characters listed in the @see:InputMask topic.
         */
        get mask(): string {
            return this._msk.mask;
        }
        set mask(value: string) {
            var oldValue = this.value;
            this._msk.mask = asString(value);
            if (this.value != oldValue) {
                this.onValueChanged();
            }
        }
        /**
         * Gets or sets the symbol used to show input positions in the control.
         */
        get promptChar(): string {
            return this._msk.promptChar;
        }
        set promptChar(value: string) {
            var oldValue = this.value;
            this._msk.promptChar = value;
            if (this.value != oldValue) {
                this.onValueChanged();
            }
        }
        /**
         * Gets or sets the string shown as a hint when the control is empty.
         */
        get placeholder(): string {
            return this._tbx.placeholder;
        }
        set placeholder(value: string) {
            this._tbx.placeholder = value;
        }
        /**
         * Gets a value that indicates whether the mask has been completely filled.
         */
        get maskFull(): boolean {
            return this._msk.maskFull;
        }
        /**
         * Gets or sets a value indicating whether the control value must be a number or whether it
         * can be set to null (by deleting the content of the control).
         */
        get isRequired(): boolean {
            return this._tbx.required;
        }
        set isRequired(value: boolean) {
            this._tbx.required = asBoolean(value);
        }
        /**
         * Sets the focus to the control and selects all its content.
         */
        selectAll() {
            var rng = this._msk.getMaskRange();
            setSelectionRange(this._tbx, rng[0], rng[1] + 1);
        }
        /**
         * Occurs when the value of the @see:value property changes.
         */
        valueChanged = new Event();
        /**
         * Raises the @see:valueChanged event.
         */
        onValueChanged(e?: EventArgs) {
            this._updateState();
            this.valueChanged.raise(this, e);
        }

        //#endregion

        //--------------------------------------------------------------------------
        //#region ** overrides

        // apply mask when refreshing
        refresh(fullUpdate?: boolean) {
            super.refresh(fullUpdate);
            this._msk.refresh();
        }

        // select all when getting the focus
        onGotFocus(e) {
            super.onGotFocus(e);
            this.selectAll();
        }

        //#endregion

    }
}