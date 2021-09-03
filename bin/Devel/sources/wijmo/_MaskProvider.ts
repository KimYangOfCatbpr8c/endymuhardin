module wijmo {
    'use strict';

    /**
     * Class that provides masking services to an HTMLInputElement.
     */
    export class _MaskProvider {
        _tbx: HTMLInputElement;
        _msk: string;
        _promptChar = '_';
        _mskArr: _MaskElement[] = [];
        _firstPos: number;
        _lastPos: number;
        _backSpace: boolean;
        _composing: boolean;
        _full = true;
        _autoComplete: string;
        _spellCheck: boolean;
        _hbInput = this._input.bind(this);
        _hbKeyDown = this._keydown.bind(this);
        _hbKeyPress = this._keypress.bind(this);
        _hbCompositionStart = this._compositionstart.bind(this);
        _hbCompositionEnd = this._compositionend.bind(this);

        // big DBCS/SBCS exception lists
        static _X_DBCS_BIG_HIRA = '\u3041\u3043\u3045\u3047\u3049\u3063\u3083\u3085\u3087\u308e\u3095\u3096';
        static _X_DBCS_BIG_KATA = '\u30a1\u30a3\u30a5\u30a7\u30a9\u30c3\u30e3\u30e5\u30e7\u30ee\u30f5\u30f6';
        static _X_SBCS_BIG_KATA = '\uff67\uff68\uff69\uff6a\uff6b\uff6c\uff6d\uff6e\uff6f';

        /**
         * Initializes a new instance of the @see:_MaskProvider class.
         * 
         * @param input Input element to be masked.
         * @param mask Input mask.
         * @param promptChar Character used to indicate input positions.
         */
        constructor(input: HTMLInputElement, mask = null, promptChar = '_') {
            this.mask = mask;
            this.input = input;
            this.promptChar = promptChar;
            this._connect(true);
        }

        /**
         * Gets or sets the Input element to be masked.
         */
        get input(): HTMLInputElement {
            return this._tbx;
        }
        set input(value: HTMLInputElement) {
            this._connect(false);
            this._tbx = value;
            this._connect(true);
        }
        /**
         * Gets or sets the input mask used to validate input.
         */
        get mask(): string {
            return this._msk;
        }
        set mask(value: string) {
            if (value != this._msk) {
                this._msk = asString(value, true);
                this._parseMask();
                this._valueChanged();
            }
        }
        /**
         * Gets or sets the input mask used to validate input.
         */
        get promptChar(): string {
            return this._promptChar;
        }
        set promptChar(value: string) {
            if (value != this._promptChar) {
                this._promptChar = asString(value, false);
                assert(this._promptChar.length == 1, 'promptChar must be a string with length 1.');
                this._valueChanged();
            }
        }
        /**
         * Gets a value that indicates whether the mask has been completely filled.
         */
        get maskFull(): boolean {
            return this._full;
        }
        /**
         * Gets an array with the position of the first and last wildcard characters in the mask.
         */
        getMaskRange(): number[] {
            return this._mskArr.length ? [this._firstPos, this._lastPos] : [0, this._tbx.value.length - 1];
        }
        /**
         * Gets the raw value of the editor, excluding prompts and literals.
         */
        getRawValue(): string {
            var text = this._tbx.value,
                ret = '';

            // no mask? it's all raw
            if (!this.mask) {
                return text;
            }

            // get raw input (no literals or prompts)
            for (var i = 0; i < this._mskArr.length && i < text.length; i++) {
                if (!this._mskArr[i].literal && text[i] != this._promptChar) {
                    ret += text[i];
                }
            }

            // done
            return ret;
        }
        /**
         * Updates the control mask and content.
         */
        refresh() {
            this._parseMask();
            this._valueChanged();
        }

        // ** event handlers

        // apply mask and update cursor position after any changes
        _input() {
            if (!this._composing) {
                setTimeout(() => { // this timeOut is **important** for Windows Phone/Android/Safari
                    this._valueChanged();
                });
            }
        }

        // special handling for backspacing over literals
        _keydown(e: KeyboardEvent) {

            // ignore backspaces before first wildcard (TFS 199372, 199901)
            if (e.keyCode == Key.Back) {
                var start = this._tbx.selectionStart,
                    end = this._tbx.selectionEnd;
                if (start <= this._firstPos && end == start) {
                    e.preventDefault();
                    this._backSpace = false;
                    return;
                }
            }

            // handle backspacing over literals
            this._backSpace = (e.keyCode == Key.Back);
        }

        // prevent flicker when invalid keys are pressed
        // NOTE: IE on Windows Phone 8.x does not raise keypress!!!
        _keypress(e: KeyboardEvent) {
            if (!e.ctrlKey && !e.metaKey && !e.altKey && !this._composing && this._preventKey(e.charCode)) {
                e.preventDefault();
            }
        }

        // handle IME composition
        _compositionstart(e: KeyboardEvent) {
            this._composing = true;
        }
        _compositionend(e: KeyboardEvent) {
            this._composing = false;
            setTimeout(() => {
                this._valueChanged();
            });
        }

        // ** implementation

        // prevent a key from being handled if it is invalid
        _preventKey(charCode: number): boolean {
            if (charCode && this._mskArr.length) {
                var tbx = this._tbx,
                    start = tbx.selectionStart,
                    key = String.fromCharCode(charCode);

                // make sure we're at a placeholder
                if (start < this._firstPos) {
                    start = this._firstPos;
                    setSelectionRange(tbx, start);
                }

                // past the end?
                if (start >= this._mskArr.length) {
                    return true;
                }

                // skip over literals and validate templates (TFS 117584)
                var m = this._mskArr[start];
                if (m.literal) {
                    this._validatePosition(start);
                } else if (m.wildCard != key && !this._isCharValid(m.wildCard, key)) {
                    return true;
                }
            }

            // key seems OK, do not prevent
            return false;
        }


        // connect or disconnect event handlers for the input element
        _connect(connect: boolean) {
            var tbx = this._tbx;
            if (tbx) {
                if (connect) {
                    this._autoComplete = tbx.autocomplete;
                    this._spellCheck = tbx.spellcheck;
                    tbx.autocomplete = 'off'; // important for mobile browsers (including Chrome/Android)
                    tbx.spellcheck = false; // no spell-checking on masked inputs
                    tbx.addEventListener('input', this._hbInput);
                    tbx.addEventListener('keydown', this._hbKeyDown, true);
                    tbx.addEventListener('keypress', this._hbKeyPress, true);
                    tbx.addEventListener('compositionstart', this._hbCompositionStart, true);
                    tbx.addEventListener('compositionend', this._hbCompositionEnd, true);
                    this._valueChanged();
                } else {
                    tbx.autocomplete = this._autoComplete;
                    tbx.spellcheck = this._spellCheck;
                    tbx.removeEventListener('input', this._hbInput);
                    tbx.removeEventListener('keydown', this._hbKeyDown, true);
                    tbx.removeEventListener('keypress', this._hbKeyPress, true);
                    tbx.removeEventListener('compositionstart', this._hbCompositionStart, true);
                    tbx.removeEventListener('compositionend', this._hbCompositionEnd, true);
                }
            }
        }

        // apply the mask keeping the cursor position and the focus
        _valueChanged() {
            if (this._tbx && this._msk) {

                // keep track of selection start, character at selection
                var tbx = this._tbx,
                    start = tbx.selectionStart,
                    oldChar = (start > 0) ? tbx.value[start - 1] : '';

                // apply the mask
                tbx.value = this._applyMask();

                // backtrack if the original character was replaced with a prompt
                var newChar = (start > 0) ? tbx.value[start - 1] : '';
                if (start > 0 && newChar == this._promptChar && oldChar != this.promptChar) {
                    start--;
                }

                // and validate the position as usual
                this._validatePosition(start);
            }
        }

        // applies the mask to the current text content, returns the result 
        // this is usually a valid string with the same length as the mask, unless 
        // (a) there's no mask, or 
        // (b) there's no text and the input is not required
        _applyMask(): string {

            // assume we're complete
            this._full = true;

            // no mask? accept everything
            var text = this._tbx.value;
            if (!this._msk) {
                return text;
            }

            // no text OK if not required
            if (!text && !this._tbx.required) {
                return text;
            }

            // handle vague literals (could be interpreted as content)
            var ret = '',
                pos = 0;
            text = this._handleVagueLiterals(text);

            // build output string based on current content and mask
            for (var i = 0; i < this._mskArr.length; i++) {

                // get mask element
                var m = this._mskArr[i],
                    c = m.literal;

                // if this is a literal, match with text at cursor
                if (c && c == text[pos]) {
                    pos++;
                }

                // if it is a wildcard, match with text starting at the cursor
                if (m.wildCard) {
                    c = this._promptChar;
                    if (text) {
                        for (var j = pos; j < text.length; j++) {
                            if (this._isCharValid(m.wildCard, text[j])) {
                                c = text[j];
                                switch (m.charCase) {
                                    case '>':
                                        c = c.toUpperCase();
                                        break;
                                    case '<':
                                        c = c.toLowerCase();
                                        break;
                                }
                                break;
                            }
                        }
                        pos = j + 1;
                    }

                    // still prompt? then the mask is not full
                    if (c == this._promptChar) {
                        this._full = false;
                    }
                }

                // add to output
                ret += c;
            }

            // done applying mask, return result
            return ret;
        }

        // fix text to handle vague literals (that could be interpreted as content)
        _handleVagueLiterals(text: string): string {

            // looks like a paste, don't mess with it (TFS 139412, 145560)
            if (text.length > this._mskArr.length + 1) {
                return text;
            }

            // see if we're shrinking or growing
            var delta = text.length - this._mskArr.length;
            if (delta != 0 && text.length > 1) {

                // see if we have a 'vague' literal
                var badIndex = -1,
                    start = Math.max(0, this._tbx.selectionStart - delta);
                for (var i = start; i < this._mskArr.length; i++) {
                    if (this._mskArr[i].vague) {
                        badIndex = i;
                        break;
                    }
                }

                // we do, so handle it
                if (badIndex > -1) {
                    //console.log(' text: [' + text + ']');
                    if (delta < 0) { // deleted: pad
                        var pad = Array(1 - delta).join(this._promptChar),
                            index = badIndex + delta;
                        if (index > -1) {
                            text = text.substr(0, index) + pad + text.substr(index);
                        }
                    } else { // added: line up
                        while (badIndex > 0 && this._mskArr[badIndex - 1].literal) {
                            badIndex--;
                        }
                        text = text.substr(0, badIndex) + text.substr(badIndex + delta);
                    }
                    //console.log('fixed: [' + text + ']');
                }
            }

            // done
            return text;
        }

        // checks whether a character is valid for a given mask character
        _isCharValid(mask: string, c: string) {
            var ph = this._promptChar;
            switch (mask) {

                // regular wildcards
                case '0': // Digit
                    return (c >= '0' && c <= '9') || c == ph;
                case '9': // Digit or space
                    return (c >= '0' && c <= '9') || c == ' ' || c == ph;
                case '#': // Digit, sign, or space
                    return (c >= '0' && c <= '9') || c == ' ' || c == '+' || c == '-' || c == ph;
                case 'L': // Letter
                    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == ph;
                case 'l': // Letter or space
                    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == ' ' || c == ph;
                case 'A': // Alphanumeric
                    return (c >= '0' && c <= '9') || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == ph;
                case 'a': // Alphanumeric or space
                    return (c >= '0' && c <= '9') || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == ' ' || c == ph;

                // Katakana/Hiragana wildcards
                case '\uff19': // DBCS Digit
                    return (c >= '\uFF10' && c <= '\uff19') || c == ph;
                case '\uff2a': // DBCS Hiragana
                case '\uff27': // DBCS big Hiragana
                    if (mask == '\uff27' && _MaskProvider._X_DBCS_BIG_HIRA.indexOf(c) > -1) return false;  // exceptions
                    return (c >= '\u3041' && c <= '\u3096') || c == ph;
                case '\uff2b': // DBCS Katakana
                case '\uff2e': // DBCS big Katakana
                    if (mask == '\uff2e' && _MaskProvider._X_DBCS_BIG_KATA.indexOf(c) > -1) return false; // exceptions
                    return (c >= '\u30a1' && c <= '\u30fa') || c == ph;
                case '\uff3a': // Any DBCS
                    return (c <= '\u0021' || c >= '\u00ff') || c == ph;
                case 'H': // Any SBCS
                    return (c >= '\u0021' && c <= '\u00ff') || c == ph;
                case 'K': // SBCS Katakana
                case 'N': // SBCS big Katakana
                    if (mask == 'N' && _MaskProvider._X_SBCS_BIG_KATA.indexOf(c) > -1) return false; // exceptions
                    return (c >= '\uff66' && c <= '\uff9f') || c == ph;
            }
            return false;
        }

        // skip over literals
        _validatePosition(start: number) {
            var msk = this._mskArr;

            // skip left if the last key pressed was a backspace
            if (this._backSpace) {
                while (start > 0 && start < msk.length && msk[start - 1].literal) {
                    start--;
                }
            }

            // skip right over literals
            if (start == 0 || !this._backSpace) {
                while (start < msk.length && msk[start].literal) {
                    start++;
                }
            }

            // move selection to start
            if (getActiveElement() == this._tbx) {
                setSelectionRange(this._tbx, start);
            }

            // no longer backspacing
            this._backSpace = false;
        }

        // parse mask into internal mask, literals, and case
        _parseMask() {

            // clear internal mask info
            this._mskArr = [];
            this._firstPos = -1;
            this._lastPos = -1;

            // parse new mask
            var msk = this._msk,
                currCase = '|',
                c: string;
            for (var i = 0; msk && i < msk.length; i++) {
                switch (msk[i]) {

                    // wildcards
                    case '0': // digit.
                    case '9': // Digit or space.
                    case '#': // Digit, sign, or space.
                    case 'A': // Alphanumeric.
                    case 'a': // Alphanumeric or space.
                    case 'L': // Letter.
                    case 'l': // Letter or space.

                    // Katakana/Hiragana wildcards
                    case '\uff19': // DBCS Digit.
                    case '\uff2a': // DBCS Hiragana.
                    case '\uff27': // DBCS big Hiragana.
                    case '\uff2b': // DBCS Katakana.
                    case '\uff2e': // DBCS big Katakana.
                    case '\uff3a': // Any DBCS
                    case 'K': // SBCS Katakana.
                    case 'N': // SBCS big Katakana.
                    case 'H': // Any SBCS character.

                        if (this._firstPos < 0) {
                            this._firstPos = this._mskArr.length;
                        }
                        this._lastPos = this._mskArr.length;
                        this._mskArr.push(new _MaskElement(msk[i], currCase));
                        break;

                    // localized literals
                    case '.': // Decimal separator.
                    case ',': // Thousands separator.
                    case ':': // Time separator.
                    case '/': // Date separator.
                    case '$': // Currency symbol.
                        switch (msk[i]) {
                            case '.':
                            case ',':
                                c = wijmo.culture.Globalize.numberFormat[msk[i]];
                                break;
                            case ':':
                            case '/':
                                c = wijmo.culture.Globalize.calendar[msk[i]];
                                break;
                            case '$':
                                c = wijmo.culture.Globalize.numberFormat.currency.symbol;
                                break;
                        }
                        for (var j = 0; j < c.length; j++) {
                            this._mskArr.push(new _MaskElement(c[j]));
                        }
                        break;

                    // case-shifting
                    case '<': // Shift down (converts characters that follow to lowercase).
                    case '>': // Shift up (converts characters that follow to uppercase).
                    case '|': // Disable any previous shifts.
                        currCase = msk[i];
                        break;

                    // literals
                    case '\\': // Escape next character into literal.
                        if (i < msk.length - 1) i++;
                        this._mskArr.push(new _MaskElement(msk[i]));
                        break;
                    default: // All others: Literals.
                        this._mskArr.push(new _MaskElement(msk[i]));
                        break;
                }
            }

            // keep track of vague (ambiguous) literals
            for (var i = 0; i < this._mskArr.length; i++) {
                var elem = this._mskArr[i];
                if (elem.literal) {
                    for (var j = 0; j < i; j++) {
                        var m = this._mskArr[j];
                        if (m.wildCard && this._isCharValid(m.wildCard, elem.literal)) {
                            elem.vague = true;
                            break;
                        }
                    }
                }
            }
        }
    }

    /**
     * Class that contains information about a position in an input mask.
     */
    export class _MaskElement {
        wildCard: string;   // wildcard to match
        charCase: string;   // upper/lower case
        literal: string;    // literal to match
        vague: boolean      // literal that can be interpreted as content

        /**
         * Initializes a new instance of the @see:_MaskElement class.
         *
         * @param wildcardOrLiteral Wildcard or literal character
         * @param charCase Whether to convert wildcard matches to upper or lowercase.
         */
        constructor(wildcardOrLiteral: string, charCase?: string) {
            if (charCase) {
                this.wildCard = wildcardOrLiteral;
                this.charCase = charCase;
            } else {
                this.literal = wildcardOrLiteral;
            }
        }
    }

}