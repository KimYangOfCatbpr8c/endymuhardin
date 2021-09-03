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
             * The editor used to inspect and modify @see:ValueFilter objects.
             *
             * This class is used by the @see:FlexGridFilter class; you
             * rarely use it directly.
             */
            var ValueFilterEditor = (function (_super) {
                __extends(ValueFilterEditor, _super);
                /**
                 * Initializes a new instance of the @see:ValueFilterEditor class.
                 *
                 * @param element The DOM element that hosts the control, or a selector
                 * for the host element (e.g. '#theCtrl').
                 * @param filter The @see:ValueFilter to edit.
                 */
                function ValueFilterEditor(element, filter) {
                    _super.call(this, element);
                    // save reference to filter
                    this._filter = wijmo.asType(filter, filter_1.ValueFilter, false);
                    // instantiate and apply template
                    var tpl = this.getTemplate();
                    this.applyTemplate('wj-control', tpl, {
                        _divFilter: 'div-filter',
                        _cbSelectAll: 'cb-select-all',
                        _spSelectAll: 'sp-select-all',
                        _divValues: 'div-values'
                    });
                    // localization
                    this._spSelectAll.textContent = wijmo.culture.FlexGridFilter.selectAll;
                    // create sorted/filtered collection view with the values
                    this._view = new wijmo.collections.CollectionView();
                    if (filter.sortValues) {
                        var sortBinding = filter.column.dataMap ? 'text' : 'value';
                        this._view.sortDescriptions.push(new wijmo.collections.SortDescription(sortBinding, true));
                    }
                    this._view.filter = this._filterValues.bind(this);
                    this._view.collectionChanged.addHandler(this._updateSelectAllCheck, this);
                    // create search combo and value list
                    this._filterText = '';
                    this._cmbFilter = new wijmo.input.ComboBox(this._divFilter, {
                        placeholder: wijmo.culture.FlexGridFilter.search
                    });
                    this._lbValues = new wijmo.input.ListBox(this._divValues, {
                        displayMemberPath: 'text',
                        checkedMemberPath: 'show',
                        itemsSource: this._view,
                        itemFormatter: function (index, item) {
                            return item ? item : wijmo.culture.FlexGridFilter.null;
                        }
                    });
                    // add event listeners
                    this._cmbFilter.textChanged.addHandler(this._filterTextChanged, this);
                    this._cbSelectAll.addEventListener('click', this._cbSelectAllClicked.bind(this));
                    // initialize all values
                    this.updateEditor();
                }
                Object.defineProperty(ValueFilterEditor.prototype, "filter", {
                    /**
                     * Gets a reference to the @see:ValueFilter being edited.
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
                ValueFilterEditor.prototype.updateEditor = function () {
                    var col = this._filter.column, values = [];
                    // get list of unique values
                    if (this._filter.uniqueValues) {
                        var uvalues = this._filter.uniqueValues;
                        for (var i = 0; i < uvalues.length; i++) {
                            var value = uvalues[i];
                            values.push({ value: value, text: value.toString() });
                        }
                    }
                    else {
                        var keys = {}, src = col.collectionView ? col.collectionView.sourceCollection : [];
                        // apply all filters but this one (Excel-style filtering, TFS 133354)
                        var view = col.collectionView;
                        if (view && view.sourceCollection && view.filter) {
                            // disable this filter
                            var sv = this._filter.showValues;
                            this._filter.showValues = null;
                            // apply all other filters
                            var nsrc = [];
                            for (var i = 0; i < src.length; i++) {
                                if (view.filter(src[i])) {
                                    nsrc.push(src[i]);
                                }
                            }
                            src = nsrc;
                            // restore this filter
                            this._filter.showValues = sv;
                        }
                        // format and add unique values to the 'values' array
                        for (var i = 0; i < src.length; i++) {
                            var value = col._binding.getValue(src[i]), text = col.dataMap ? col.dataMap.getDisplayValue(value) : wijmo.Globalize.format(value, col.format);
                            if (!keys[text]) {
                                keys[text] = true;
                                values.push({ value: value, text: text });
                            }
                        }
                    }
                    // check the items that are currently selected
                    var showValues = this._filter.showValues;
                    if (!showValues || Object.keys(showValues).length == 0) {
                        for (var i = 0; i < values.length; i++) {
                            values[i].show = true;
                        }
                    }
                    else {
                        for (var key in showValues) {
                            for (var i = 0; i < values.length; i++) {
                                if (values[i].text == key) {
                                    values[i].show = true;
                                    break;
                                }
                            }
                        }
                    }
                    // honor isContentHtml property
                    this._lbValues.isContentHtml = col.isContentHtml;
                    // load filter and apply immediately
                    this._cmbFilter.text = this._filter.filterText;
                    this._filterText = this._cmbFilter.text.toLowerCase();
                    // show the values
                    this._view.pageSize = this._filter.maxValues;
                    this._view.sourceCollection = values;
                    this._view.moveCurrentToPosition(-1);
                };
                /**
                 * Clears the editor without applying changes to the filter.
                 */
                ValueFilterEditor.prototype.clearEditor = function () {
                    this._cmbFilter.text = '';
                    this._filterText = '';
                    this._view.refresh();
                    var values = this._view.items;
                    for (var i = 0; i < values.length; i++) {
                        values[i].show = false;
                    }
                };
                /**
                 * Updates filter to reflect the current editor values.
                 */
                ValueFilterEditor.prototype.updateFilter = function () {
                    // build list of values to show
                    // (clear filter if all values are selected)
                    var showValues = null, items = this._view.items;
                    if (this._filterText || this._cbSelectAll.indeterminate) {
                        showValues = {};
                        for (var i = 0; i < items.length; i++) {
                            var item = items[i];
                            if (item.show) {
                                showValues[item.text] = true;
                            }
                        }
                    }
                    // save to filter
                    this._filter.showValues = showValues;
                    this._filter.filterText = this._filterText;
                };
                // ** implementation
                // filter items on the list
                ValueFilterEditor.prototype._filterTextChanged = function () {
                    var _this = this;
                    if (this._toText) {
                        clearTimeout(this._toText);
                    }
                    this._toText = setTimeout(function () {
                        // apply the filter
                        var filter = _this._cmbFilter.text.toLowerCase();
                        if (filter != _this._filterText) {
                            _this._filterText = filter;
                            _this._view.refresh();
                            // select all items that pass the filter (Excel behavior)
                            _this._cbSelectAll.checked = true;
                            _this._cbSelectAllClicked();
                        }
                    }, 500);
                };
                // filter values for display
                ValueFilterEditor.prototype._filterValues = function (value) {
                    if (this._filterText) {
                        return value && value.text
                            ? value.text.toLowerCase().indexOf(this._filterText) > -1
                            : false;
                    }
                    return true;
                };
                // handle clicks on 'Select All' checkbox
                ValueFilterEditor.prototype._cbSelectAllClicked = function () {
                    var checked = this._cbSelectAll.checked, values = this._view.items;
                    for (var i = 0; i < values.length; i++) {
                        values[i].show = checked;
                    }
                    this._view.refresh();
                };
                // update state of 'Select All' checkbox when values are checked/unchecked
                ValueFilterEditor.prototype._updateSelectAllCheck = function () {
                    // count checked items
                    var checked = 0, values = this._view.items;
                    for (var i = 0; i < values.length; i++) {
                        if (values[i].show)
                            checked++;
                    }
                    // update checkbox
                    if (checked == 0) {
                        this._cbSelectAll.checked = false;
                        this._cbSelectAll.indeterminate = false;
                    }
                    else if (checked == values.length) {
                        this._cbSelectAll.checked = true;
                        this._cbSelectAll.indeterminate = false;
                    }
                    else {
                        this._cbSelectAll.indeterminate = true;
                    }
                    // REVIEW: disable Apply button if nothing is selected
                    //toggleClass(this._btnApply, 'wj-state-disabled', checked == 0);
                    //this._btnApply.style.cursor = (checked == 0) ? 'default' : '';
                };
                /**
                 * Gets or sets the template used to instantiate @see:ColumnFilterEditor controls.
                 */
                ValueFilterEditor.controlTemplate = '<div>' +
                    '<div wj-part="div-filter"></div>' +
                    '<div class="wj-listbox-item">' +
                    '<label>' +
                    '<input wj-part="cb-select-all" type="checkbox"> ' +
                    '<span wj-part="sp-select-all"></span>' +
                    '</label>' +
                    '</div>' +
                    '<div wj-part="div-values" style="height:150px"></div>' +
                    '</div>';
                return ValueFilterEditor;
            }(wijmo.Control));
            filter_1.ValueFilterEditor = ValueFilterEditor;
        })(filter = grid.filter || (grid.filter = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ValueFilterEditor.js.map