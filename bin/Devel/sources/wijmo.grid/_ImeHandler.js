var wijmo;
(function (wijmo) {
    var grid;
    (function (grid) {
        'use strict';
        /**
         * Implements a hidden input element so users can choose IME modes when
         * the FlexGrid has focus, and start composing before the grid enters
         * edit mode.
         */
        var _ImeHandler = (function () {
            //--------------------------------------------------------------------------
            //#region ** ctor
            /**
             * Initializes a new instance of the @see:_ImeHandler class and attaches it to a @see:FlexGrid.
             *
             * @param g @see:FlexGrid that this @see:_ImeHandler will be attached to.
             */
            function _ImeHandler(g) {
                // create hidden input focus element
                this._tbx = wijmo.createElement('<input class="wj-grid-editor wj-form-control" wj-part="ime-target"/>');
                this._cssHidden = {
                    opacity: '0',
                    pointerEvents: 'none',
                    position: 'absolute',
                    left: -10,
                    top: -10,
                    width: 0
                };
                wijmo.setCss(this._tbx, this._cssHidden);
                // add IME input to the grid, update the focus
                this._g = g,
                    this._g.cells.hostElement.parentElement.appendChild(this._tbx);
                this._updateImeFocus();
                // attach event handlers
                var g = this._g, host = g.hostElement;
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
            _ImeHandler.prototype.dispose = function () {
                var g = this._g, host = g.hostElement;
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
            };
            //#endregion
            //--------------------------------------------------------------------------
            //#region ** implementation
            // hide IME input after editing
            _ImeHandler.prototype._cellEditEnded = function () {
                wijmo.setCss(this._tbx, this._cssHidden);
                this._tbx.value = '';
            };
            // show IME input as current editor when composition starts
            _ImeHandler.prototype._compositionstart = function () {
                var g = this._g;
                if (g.activeEditor == null) {
                    var sel = g._selHdl.selection;
                    if (g.startEditing(false, sel.row, sel.col, false)) {
                        var rc = g.getCellBoundingRect(sel.row, sel.col), host = g.cells.hostElement;
                        wijmo.setCss(this._tbx, {
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
            };
            // forward up/down keys to grid in case it's in a form element in IE (ugh! TFS 202913)
            _ImeHandler.prototype._keydown = function (e) {
                switch (e.keyCode) {
                    case wijmo.Key.Up:
                    case wijmo.Key.Down:
                    case wijmo.Key.PageUp:
                    case wijmo.Key.PageDown:
                        this._g._keyHdl._keydown(e);
                }
            };
            // enable/disable IME on mousedown/up (TFS 194411)
            _ImeHandler.prototype._mousedown = function (e) {
                this._mouseDown = true;
                this._updateImeFocus();
            };
            _ImeHandler.prototype._mouseup = function (e) {
                this._mouseDown = false;
                this._updateImeFocus();
            };
            // transfer focus from grid to IME input
            _ImeHandler.prototype._updateImeFocus = function () {
                var g = this._g;
                if (g.containsFocus() && !g.activeEditor && !g.isTouching && !this._mouseDown) {
                    var tbx = this._tbx;
                    if (this._enableIme()) {
                        tbx.disabled = false;
                        tbx.select();
                    }
                    else if (!tbx.disabled) {
                        tbx.disabled = true;
                        var focused = wijmo.getActiveElement();
                        if (focused instanceof HTMLElement) {
                            focused.blur();
                        }
                        g.focus();
                    }
                }
            };
            // checks whether IME should be enabled for the current selection
            _ImeHandler.prototype._enableIme = function () {
                var g = this._g, sel = g.selection;
                // can't edit? can't use IME
                if (sel.row < 0 || sel.col < 0 || !g._edtHdl._allowEditing(sel.row, sel.col)) {
                    return false;
                }
                // disable IME for boolean cells (with checkboxes)
                if (g.columns[sel.col].dataType == wijmo.DataType.Boolean) {
                    return false;
                }
                // seems OK to use IME
                return true;
            };
            return _ImeHandler;
        }());
        grid._ImeHandler = _ImeHandler;
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_ImeHandler.js.map