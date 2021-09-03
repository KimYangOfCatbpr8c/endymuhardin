module wijmo.input {
    'use strict';

    /**
     * The @see:InputColor control allows users to select colors by typing in
     * HTML-supported color strings, or to pick colors from a drop-down 
     * that shows a @see:ColorPicker control.
     *
     * Use the @see:value property to get or set the currently selected color.
     *
     * @fiddle:84xvsz90
     */
    export class InputColor extends DropDown {

        // child controls
        _ePreview: HTMLElement;
        _colorPicker: ColorPicker;

        // property storage
        _value: string;

        /**
         * Initializes a new instance of the @see:InputColor class.
         *
         * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
         * @param options The JavaScript object containing initialization data for the control.
         */
        constructor(element: any, options?) {
            super(element);
            addClass(this.hostElement, 'wj-inputcolor');

            // create preview element
            this._tbx.style.paddingLeft = '24px';
            this._ePreview = createElement('<div class="wj-inputcolorbox" style="position:absolute;left:6px;top:6px;width:12px;bottom:6px;border:1px solid black"></div>');
            this.hostElement.style.position = 'relative';
            this.hostElement.appendChild(this._ePreview);

            // initializing from <input> tag
            if (this._orgTag == 'INPUT') {
                this._tbx.type = '';
                this._commitText();
            }
            
            // initialize value to white
            this.value = '#ffffff';

            // initialize control options
            this.isRequired = true;
            this.initialize(options);

            // close drop-down when user clicks a palette entry or the preview element
            this.addEventListener(this._colorPicker.hostElement, 'click', (e: MouseEvent) => {
                var el = <HTMLElement>e.target;
                if (el && el.tagName == 'DIV') {
                    if (closest(el, '[wj-part="div-pal"]') || closest(el, '[wj-part="div-pv"]')) {
                        var color = el.style.backgroundColor;
                        if (color) {
                            this.isDroppedDown = false;
                        }
                    }
                }
            });

        }

        //--------------------------------------------------------------------------
        //#region ** object model

        /**
         * Gets or sets the current color.
         */
        get value(): string {
            return this._value;
        }
        set value(value: string) {
            if (value != this.value) {
                if (value || !this.isRequired) {
                    this.text = asString(value);
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
                this._setText(asString(value), true);
                this._commitText();
            }
        }
        /**
         * Gets or sets a value indicating whether the @see:ColorPicker allows users
         * to edit the color's alpha channel (transparency).
         */
        get showAlphaChannel(): boolean {
            return this._colorPicker.showAlphaChannel;
        }
        set showAlphaChannel(value: boolean) {
            this._colorPicker.showAlphaChannel = value;
        }
        /**
         * Gets a reference to the @see:ColorPicker control shown in the drop-down.
         */
        get colorPicker(): ColorPicker {
            return this._colorPicker;
        }
        /**
         * Occurs after a new color is selected.
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

        // create the drop-down element
        protected _createDropDown() {

            // create the drop-down element
            this._colorPicker = new ColorPicker(this._dropDown);
            setCss(this._dropDown, {
                minWidth: 420,
                minHeight: 200
            });

            // update our value to match colorPicker's
            this._colorPicker.valueChanged.addHandler(() => {
                this.value = this._colorPicker.value;
            });
        }

        // override to commit/cancel edits
        protected _keydown(e: KeyboardEvent) {
            if (!e.defaultPrevented) {
                switch (e.keyCode) {
                    case Key.Enter:
                        this._commitText();
                        this.selectAll();
                        break;
                    case Key.Escape:
                        this.text = this.value;
                        this.selectAll();
                        break;
                }
            }
            super._keydown(e);
        }

        //#endregion ** overrides

        //--------------------------------------------------------------------------
        //#region ** implementation

        // assign new color to ColorPicker
        protected _commitText() {
            if (this.value != this.text) {

                // allow empty values
                if (!this.isRequired && !this.text) {
                    this._value = this.text;
                    this._ePreview.style.backgroundColor = '';
                    return;
                }

                // parse and assign color to control
                var c = Color.fromString(this.text);
                if (c) { // color is valid, update value based on text
                    this._colorPicker.value = this.text;
                    this._value = this._colorPicker.value;
                    this._ePreview.style.backgroundColor = this.value;
                    this.onValueChanged();
                } else { // color is invalid, restore text and keep value
                    this.text = this._value ? this._value : '';
                }
            }
        }

        //#endregion ** implementation
    }
}