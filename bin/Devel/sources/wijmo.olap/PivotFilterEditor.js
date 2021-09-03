var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        /**
         * Editor for @see:PivotFilter objects.
         */
        var PivotFilterEditor = (function (_super) {
            __extends(PivotFilterEditor, _super);
            /**
             * Initializes a new instance of the @see:ColumnFilterEditor class.
             *
             * @param element The DOM element that hosts the control, or a selector
             * for the host element (e.g. '#theCtrl').
             * @param field The @see:PivotField to edit.
             * @param options JavaScript object containing initialization data for the editor.
             */
            function PivotFilterEditor(element, field, options) {
                var _this = this;
                _super.call(this, element);
                /**
                 * Occurs when the user finishes editing the filter.
                 */
                this.finishEditing = new wijmo.Event();
                // instantiate and apply template
                var tpl = this.getTemplate();
                this.applyTemplate('wj-control wj-pivotfiltereditor wj-content', tpl, {
                    _divType: 'div-type',
                    _aVal: 'a-val',
                    _aCnd: 'a-cnd',
                    _divEdtVal: 'div-edt-val',
                    _divEdtCnd: 'div-edt-cnd',
                    _btnOk: 'btn-ok'
                });
                // localization
                this._aVal.textContent = wijmo.culture.FlexGridFilter.values;
                this._aCnd.textContent = wijmo.culture.FlexGridFilter.conditions;
                //this._btnOk.textContent = culture.FlexGridFilter.apply;
                // handle button clicks
                var bnd = this._btnClicked.bind(this);
                this._btnOk.addEventListener('click', bnd);
                this._aVal.addEventListener('click', bnd);
                this._aCnd.addEventListener('click', bnd);
                // commit/dismiss on Enter/Esc
                this.hostElement.addEventListener('keydown', function (e) {
                    switch (e.keyCode) {
                        case wijmo.Key.Enter:
                            switch (e.target.tagName) {
                                case 'A':
                                case 'BUTTON':
                                    _this._btnClicked(e);
                                    break;
                                default:
                                    _this.onFinishEditing(new wijmo.CancelEventArgs());
                                    break;
                            }
                            e.preventDefault();
                            break;
                        case wijmo.Key.Escape:
                            _this.onFinishEditing(new wijmo.CancelEventArgs());
                            e.preventDefault();
                            break;
                    }
                });
                // field being edited
                this._fld = field;
                // apply options
                this.initialize(options);
                // initialize all values
                this.updateEditor();
            }
            Object.defineProperty(PivotFilterEditor.prototype, "field", {
                // ** object model
                /**
                 * Gets a reference to the @see:PivotField whose filter is being edited.
                 */
                get: function () {
                    return this._fld;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotFilterEditor.prototype, "filter", {
                /**
                 * Gets a reference to the @see:PivotFilter being edited.
                 */
                get: function () {
                    return this._fld ? this._fld.filter : null;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Updates the editor with current filter settings.
             */
            PivotFilterEditor.prototype.updateEditor = function () {
                // show/hide filter editors
                var ft = wijmo.grid.filter.FilterType.None;
                if (this.filter) {
                    ft = (this.filter.conditionFilter.isActive || (this.filter.filterType & wijmo.grid.filter.FilterType.Value) == 0)
                        ? wijmo.grid.filter.FilterType.Condition
                        : wijmo.grid.filter.FilterType.Value;
                    this._showFilter(ft);
                }
                // update filter editors
                if (this._edtVal) {
                    this._edtVal.updateEditor();
                }
                if (this._edtCnd) {
                    this._edtCnd.updateEditor();
                }
            };
            /**
             * Updates the filter to reflect the current editor values.
             */
            PivotFilterEditor.prototype.updateFilter = function () {
                // update the filter
                switch (this._getFilterType()) {
                    case wijmo.grid.filter.FilterType.Value:
                        this._edtVal.updateFilter();
                        this.filter.conditionFilter.clear();
                        break;
                    case wijmo.grid.filter.FilterType.Condition:
                        this._edtCnd.updateFilter();
                        this.filter.valueFilter.clear();
                        break;
                }
                // refresh the view
                this.field.onPropertyChanged(new wijmo.PropertyChangedEventArgs('filter', null, null));
            };
            /**
             * Clears the editor fields without applying changes to the filter.
             */
            PivotFilterEditor.prototype.clearEditor = function () {
                if (this._edtVal) {
                    this._edtVal.clearEditor();
                }
                if (this._edtCnd) {
                    this._edtCnd.clearEditor();
                }
            };
            /**
             * Raises the @see:finishEditing event.
             */
            PivotFilterEditor.prototype.onFinishEditing = function (e) {
                this.finishEditing.raise(this, e);
                return !e.cancel;
            };
            // ** implementation
            // shows the value or filter editor
            PivotFilterEditor.prototype._showFilter = function (filterType) {
                // create editor if we have to
                if (filterType == wijmo.grid.filter.FilterType.Value && this._edtVal == null) {
                    this._edtVal = new wijmo.grid.filter.ValueFilterEditor(this._divEdtVal, this.filter.valueFilter);
                }
                if (filterType == wijmo.grid.filter.FilterType.Condition && this._edtCnd == null) {
                    this._edtCnd = new wijmo.grid.filter.ConditionFilterEditor(this._divEdtCnd, this.filter.conditionFilter);
                }
                // show selected editor
                if ((filterType & this.filter.filterType) != 0) {
                    if (filterType == wijmo.grid.filter.FilterType.Value) {
                        this._divEdtVal.style.display = '';
                        this._divEdtCnd.style.display = 'none';
                        this._enableLink(this._aVal, false);
                        this._enableLink(this._aCnd, true);
                    }
                    else {
                        this._divEdtVal.style.display = 'none';
                        this._divEdtCnd.style.display = '';
                        this._enableLink(this._aVal, true);
                        this._enableLink(this._aCnd, false);
                    }
                }
                // hide switch button if only one filter type is supported
                switch (this.filter.filterType) {
                    case wijmo.grid.filter.FilterType.None:
                    case wijmo.grid.filter.FilterType.Condition:
                    case wijmo.grid.filter.FilterType.Value:
                        this._divType.style.display = 'none';
                        break;
                    default:
                        this._divType.style.display = '';
                        break;
                }
            };
            // enable/disable filter switch links
            PivotFilterEditor.prototype._enableLink = function (a, enable) {
                a.style.textDecoration = enable ? '' : 'none';
                a.style.fontWeight = enable ? '' : 'bold';
                if (enable) {
                    a.href = '';
                }
                else {
                    a.removeAttribute('href');
                }
            };
            // gets the type of filter currently being edited
            PivotFilterEditor.prototype._getFilterType = function () {
                return this._divEdtVal.style.display != 'none'
                    ? wijmo.grid.filter.FilterType.Value
                    : wijmo.grid.filter.FilterType.Condition;
            };
            // handle buttons
            PivotFilterEditor.prototype._btnClicked = function (e) {
                e.preventDefault();
                e.stopPropagation();
                // ignore disabled elements
                if (wijmo.hasClass(e.target, 'wj-state-disabled')) {
                    return;
                }
                // switch filters
                if (e.target == this._aVal) {
                    this._showFilter(wijmo.grid.filter.FilterType.Value);
                    wijmo.moveFocus(this._edtVal.hostElement, 0);
                    //this._edtVal.focus();
                    return;
                }
                if (e.target == this._aCnd) {
                    this._showFilter(wijmo.grid.filter.FilterType.Condition);
                    wijmo.moveFocus(this._edtCnd.hostElement, 0);
                    //this._edtCnd.focus();
                    return;
                }
                // finish editing
                this.onFinishEditing(new wijmo.CancelEventArgs());
            };
            /**
             * Gets or sets the template used to instantiate @see:PivotFilterEditor controls.
             */
            PivotFilterEditor.controlTemplate = '<div>' +
                '<div wj-part="div-type" style="text-align:center;margin-bottom:12px;font-size:80%">' +
                '<a wj-part="a-cnd" href="" tabindex="-1" draggable="false"></a>' +
                '&nbsp;|&nbsp;' +
                '<a wj-part="a-val" href="" tabindex="-1" draggable="false"></a>' +
                '</div>' +
                '<div wj-part="div-edt-val"></div>' +
                '<div wj-part="div-edt-cnd"></div>' +
                '<div style="text-align:right;margin-top:10px">' +
                '<a wj-part="btn-ok" href="" tabindex="-1" draggable="false">OK</a>' +
                '</div>';
            return PivotFilterEditor;
        }(wijmo.Control));
        olap.PivotFilterEditor = PivotFilterEditor;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=PivotFilterEditor.js.map