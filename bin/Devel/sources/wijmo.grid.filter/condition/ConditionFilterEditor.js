var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var grid;
    (function (grid) {
        var filter;
        (function (filter_1) {
            'use strict';
            /**
             * The editor used to inspect and modify @see:ConditionFilter objects.
             *
             * This class is used by the @see:FlexGridFilter class; you
             * rarely use it directly.
             */
            var ConditionFilterEditor = (function (_super) {
                __extends(ConditionFilterEditor, _super);
                /**
                 * Initializes a new instance of the @see:ConditionFilterEditor class.
                 *
                 * @param element The DOM element that hosts the control, or a selector
                 * for the host element (e.g. '#theCtrl').
                 * @param filter The @see:ConditionFilter to edit.
                 */
                function ConditionFilterEditor(element, filter) {
                    _super.call(this, element);
                    // save reference to filter
                    this._filter = wijmo.asType(filter, filter_1.ConditionFilter, false);
                    // instantiate and apply template
                    var tpl = this.getTemplate();
                    this.applyTemplate('wj-control', tpl, {
                        _divHdr: 'div-hdr',
                        _divCmb1: 'div-cmb1',
                        _divVal1: 'div-val1',
                        _btnAnd: 'btn-and',
                        _btnOr: 'btn-or',
                        _spAnd: 'sp-and',
                        _spOr: 'sp-or',
                        _divCmb2: 'div-cmb2',
                        _divVal2: 'div-val2',
                    });
                    // localization
                    this._divHdr.textContent = wijmo.culture.FlexGridFilter.header;
                    this._spAnd.textContent = wijmo.culture.FlexGridFilter.and;
                    this._spOr.textContent = wijmo.culture.FlexGridFilter.or;
                    // create combos and value editors
                    this._cmb1 = this._createOperatorCombo(this._divCmb1);
                    this._cmb2 = this._createOperatorCombo(this._divCmb2);
                    this._val1 = this._createValueInput(this._divVal1);
                    this._val2 = this._createValueInput(this._divVal2);
                    // add event listeners
                    var andOr = this._btnAndOrChanged.bind(this);
                    this._btnAnd.addEventListener('change', andOr);
                    this._btnOr.addEventListener('change', andOr);
                    // initialize all values
                    this.updateEditor();
                }
                Object.defineProperty(ConditionFilterEditor.prototype, "filter", {
                    /**
                     * Gets a reference to the @see:ConditionFilter being edited.
                     */
                    get: function () {
                        return this._filter;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Updates editor with current filter settings.
                 */
                ConditionFilterEditor.prototype.updateEditor = function () {
                    // initialize conditions
                    var c1 = this._filter.condition1, c2 = this._filter.condition2;
                    this._cmb1.selectedValue = c1.operator;
                    this._cmb2.selectedValue = c2.operator;
                    if (this._val1 instanceof wijmo.input.ComboBox) {
                        this._val1.text = wijmo.changeType(c1.value, wijmo.DataType.String, null);
                        this._val2.text = wijmo.changeType(c2.value, wijmo.DataType.String, null);
                    }
                    else {
                        this._val1.value = c1.value;
                        this._val2.value = c2.value;
                    }
                    // initialize and/or buttons
                    this._btnAnd.checked = this._filter.and;
                    this._btnOr.checked = !this._filter.and;
                };
                /**
                 * Clears the editor without applying changes to the filter.
                 */
                ConditionFilterEditor.prototype.clearEditor = function () {
                    this._cmb1.selectedValue = this._cmb2.selectedValue = null;
                    this._val1.text = this._val2.text = null;
                    this._btnAnd.checked = true;
                    this._btnOr.checked = false;
                };
                /**
                 * Updates filter to reflect the current editor values.
                 */
                ConditionFilterEditor.prototype.updateFilter = function () {
                    // initialize conditions
                    var col = this._filter.column, c1 = this._filter.condition1, c2 = this._filter.condition2;
                    c1.operator = this._cmb1.selectedValue;
                    c2.operator = this._cmb2.selectedValue;
                    if (this._val1 instanceof wijmo.input.ComboBox) {
                        // store condition values to the types specified by the column, except for 
                        // time values, which are dates but must be stored as strings (TFS 123969)
                        var dt = col.dataType == wijmo.DataType.Date ? wijmo.DataType.String : col.dataType;
                        c1.value = wijmo.changeType(this._val1.text, dt, col.format);
                        c2.value = wijmo.changeType(this._val2.text, dt, col.format);
                    }
                    else {
                        c1.value = this._val1.value;
                        c2.value = this._val2.value;
                    }
                    // initialize and/or operator
                    this._filter.and = this._btnAnd.checked;
                };
                // ** implementation
                // create operator combo
                ConditionFilterEditor.prototype._createOperatorCombo = function (element) {
                    // get operator list based on column data type
                    var col = this._filter.column, list = wijmo.culture.FlexGridFilter.stringOperators;
                    if (col.dataType == wijmo.DataType.Date && !this._isTimeFormat(col.format)) {
                        list = wijmo.culture.FlexGridFilter.dateOperators;
                    }
                    else if (col.dataType == wijmo.DataType.Number && !col.dataMap) {
                        list = wijmo.culture.FlexGridFilter.numberOperators;
                    }
                    else if (col.dataType == wijmo.DataType.Boolean && !col.dataMap) {
                        list = wijmo.culture.FlexGridFilter.booleanOperators;
                    }
                    // create and initialize the combo
                    var cmb = new wijmo.input.ComboBox(element);
                    cmb.itemsSource = list;
                    cmb.displayMemberPath = 'name';
                    cmb.selectedValuePath = 'op';
                    // return combo
                    return cmb;
                };
                // create operator input
                ConditionFilterEditor.prototype._createValueInput = function (e) {
                    var col = this._filter.column, ctl = null;
                    if (col.dataType == wijmo.DataType.Date && !this._isTimeFormat(col.format)) {
                        ctl = new wijmo.input.InputDate(e);
                        ctl.format = col.format;
                    }
                    else if (col.dataType == wijmo.DataType.Number && !col.dataMap) {
                        ctl = new wijmo.input.InputNumber(e);
                        ctl.format = col.format;
                    }
                    else {
                        ctl = new wijmo.input.ComboBox(e);
                        if (col.dataMap) {
                            ctl.itemsSource = col.dataMap.getDisplayValues();
                            ctl.isEditable = true;
                        }
                        else if (col.dataType == wijmo.DataType.Boolean) {
                            ctl.itemsSource = [true, false];
                        }
                    }
                    ctl.isRequired = false;
                    return ctl;
                };
                // checks whether a format represents a time (and not just a date)
                ConditionFilterEditor.prototype._isTimeFormat = function (fmt) {
                    if (!fmt)
                        return false;
                    fmt = wijmo.culture.Globalize.calendar.patterns[fmt] || fmt;
                    return /[Hmst]+/.test(fmt); // TFS 109409
                };
                // update and/or buttons
                ConditionFilterEditor.prototype._btnAndOrChanged = function (e) {
                    this._btnAnd.checked = e.target == this._btnAnd;
                    this._btnOr.checked = e.target == this._btnOr;
                };
                /**
                 * Gets or sets the template used to instantiate @see:ConditionFilterEditor controls.
                 */
                ConditionFilterEditor.controlTemplate = '<div>' +
                    '<div wj-part="div-hdr"></div>' +
                    '<div wj-part="div-cmb1"></div><br/>' +
                    '<div wj-part="div-val1"></div><br/>' +
                    '<div style="text-align:center">' +
                    '<label><input wj-part="btn-and" type="radio"> <span wj-part="sp-and"></span> </label>&nbsp;&nbsp;&nbsp;' +
                    '<label><input wj-part="btn-or" type="radio"> <span wj-part="sp-or"></span> </label>' +
                    '</div>' +
                    '<div wj-part="div-cmb2"></div><br/>' +
                    '<div wj-part="div-val2"></div><br/>' +
                    '</div>';
                return ConditionFilterEditor;
            }(wijmo.Control));
            filter_1.ConditionFilterEditor = ConditionFilterEditor;
        })(filter = grid.filter || (grid.filter = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ConditionFilterEditor.js.map