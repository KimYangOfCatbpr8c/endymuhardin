module wijmo.grid {
    'use strict';

    /**
     * Implements a hidden input element so users can choose IME modes when 
     * the FlexGrid has focus, and start composing before the grid enters
     * edit mode.
     */
    export class _ImeHandler {
        _g: FlexGrid;
        _tbx: HTMLInputElement;
        _cssHidden: any;
        _mouseDown: boolean;

        //--------------------------------------------------------------------------
        //#region ** ctor

        /**
         * Initializes a new instance of the @see:_ImeHandler class and attaches it to a @see:FlexGrid.
         * 
         * @param g @see:FlexGrid that this @see:_ImeHandler will be attached to.
         */
        constructor(g: FlexGrid) {

            // create hidden input focus element
            this._tbx = <HTMLInputElement>createElement('<input class="wj-grid-editor wj-form-control" wj-part="ime-target"/>');
            this._cssHidden = {
                opacity: '0',
                pointerEvents: 'none',
                position: 'absolute',
                left: -10,
                top: -10,
                width: 0
            };
            setCss(this._tbx, this._cssHidden);

            // add IME input to the grid, update the focus
            this._g = g,
                this._g.cells.hostElement.parentElement.appendChild(this._tbx);
            this._updateImeFocus();

            // attach event handlers
            var g = this._g,
                host = g.hostElement;
            g.addEventListener(this._tbx, 'compositionstart', this._compositionstart.bind(this));
            g.addEventListener(this._tbx, 'keydown', this._keydown.bind(this));
            g.addEventListener(host, 'blur', this._updateImeFocus.bind(this), true);
            g.addEventListener(host, 'focus', this._updateImeFocus.bind(this), true);
            g.addEventListener(host, 'mousedown', this._mousedown.bind(this), true);
            g.addEventListener(host, 'mouseup', this._mouseup.bind(this), true);
            g.cellEditEnded.addHandler(this._cellEditEnded, this);
            g.selectionChanged.addHandler(this._updateImeFocus, this);
        }

        //#endregion
        //--------------------------------------------------------------------------
        //#region ** object model

        /**
         * Disposes of this @see:_ImeHandler.
         */
        dispose() {
            var g = this._g,
                host = g.hostElement;

            // remove event listeners
            g.removeEventListener(this._tbx, 'compositionstart');
            g.removeEventListener(host, 'blur');
            g.removeEventListener(host, 'focus');
            g.removeEventListener(host, 'mousedown');
            g.removeEventListener(host, 'mouseup');
            g.cellEditEnded.removeHandler(this._cellEditEnded);
            g.selectionChanged.removeHandler(this._updateImeFocus);

            // remove IME input from grid
            if (this._tbx.parentElement) {
                this._tbx.parentElement.removeChild(this._tbx);
            }
        }

        //#endregion
        //--------------------------------------------------------------------------
        //#region ** implementation
        
        // hide IME input after editing
        _cellEditEnded() {
            setCss(this._tbx, this._cssHidden);
            this._tbx.value = '';
        }

        // show IME input as current editor when composition starts
        _compositionstart() {
            var g = this._g;
            if (g.activeEditor == null) {
                var sel = g._selHdl.selection;
                if (g.startEditing(false, sel.row, sel.col, false)) {
                    var rc = g.getCellBoundingRect(sel.row, sel.col),
                        host = g.cells.hostElement;
                    setCss(this._tbx, {
                        opacity: '',
                        pointerEvents: '',
                        left: g.columns[sel.col].pos + host.offsetLeft,
                        top: g.rows[sel.row].pos + host.offsetTop,
                        width: rc.width - 1,
                        height: rc.height - 1,
                    });
                    g._edtHdl._edt = this._tbx;
                }
            }
        }

        // forward up/down keys to grid in case it's in a form element in IE (ugh! TFS 202913)
        _keydown(e: KeyboardEvent) {
            switch (e.keyCode) {
                case Key.Up:
                case Key.Down:
                case Key.PageUp:
                case Key.PageDown:
                    this._g._keyHdl._keydown(e);
            }
        }

        // enable/disable IME on mousedown/up (TFS 194411)
        _mousedown(e) {
            this._mouseDown = true;
            this._updateImeFocus();
        }
        _mouseup(e) {
            this._mouseDown = false;
            this._updateImeFocus();
        }

        // transfer focus from grid to IME input
        _updateImeFocus() {
            var g = this._g;
            if (g.containsFocus() && !g.activeEditor && !g.isTouching && !this._mouseDown) {
                var tbx = this._tbx;
                if (this._enableIme()) {
                    tbx.disabled = false;
                    tbx.select();
                } else if (!tbx.disabled) {
                    tbx.disabled = true;
                    var focused = getActiveElement();
                    if (focused instanceof HTMLElement) {
                        focused.blur();
                    }
                    g.focus();
                }
            }
        }

        // checks whether IME should be enabled for the current selection
        _enableIme(): boolean {
            var g = this._g,
                sel = g.selection;

            // can't edit? can't use IME
            if (sel.row < 0 || sel.col < 0 || !g._edtHdl._allowEditing(sel.row, sel.col)) {
                return false;
            }

            // disable IME for boolean cells (with checkboxes)
            if (g.columns[sel.col].dataType == DataType.Boolean) {
                return false;
            }

            // seems OK to use IME
            return true;
        }

        //#endregion
    }
}