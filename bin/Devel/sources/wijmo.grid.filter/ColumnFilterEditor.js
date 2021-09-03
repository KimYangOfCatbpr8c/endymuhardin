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
            // globalization info
            wijmo.culture.FlexGridFilter = {
                // filter
                ascending: '\u2191 Ascending',
                descending: '\u2193 Descending',
                apply: 'Apply',
                clear: 'Clear',
                conditions: 'Filter by Condition',
                values: 'Filter by Value',
                // value filter
                search: 'Search',
                selectAll: 'Select All',
                null: '(nothing)',
                // condition filter
                header: 'Show items where the value',
                and: 'And',
                or: 'Or',
                stringOperators: [
                    { name: '(not set)', op: null },
                    { name: 'Equals', op: filter_1.Operator.EQ },
                    { name: 'Does not equal', op: filter_1.Operator.NE },
                    { name: 'Begins with', op: filter_1.Operator.BW },
                    { name: 'Ends with', op: filter_1.Operator.EW },
                    { name: 'Contains', op: filter_1.Operator.CT },
                    { name: 'Does not contain', op: filter_1.Operator.NC }
                ],
                numberOperators: [
                    { name: '(not set)', op: null },
                    { name: 'Equals', op: filter_1.Operator.EQ },
                    { name: 'Does not equal', op: filter_1.Operator.NE },
                    { name: 'Is Greater than', op: filter_1.Operator.GT },
                    { name: 'Is Greater than or equal to', op: filter_1.Operator.GE },
                    { name: 'Is Less than', op: filter_1.Operator.LT },
                    { name: 'Is Less than or equal to', op: filter_1.Operator.LE }
                ],
                dateOperators: [
                    { name: '(not set)', op: null },
                    { name: 'Equals', op: filter_1.Operator.EQ },
                    { name: 'Is Before', op: filter_1.Operator.LT },
                    { name: 'Is After', op: filter_1.Operator.GT }
                ],
                booleanOperators: [
                    { name: '(not set)', op: null },
                    { name: 'Equals', op: filter_1.Operator.EQ },
                    { name: 'Does not equal', op: filter_1.Operator.NE }
                ]
            };
            /**
             * The editor used to inspect and modify column filters.
             *
             * This class is used by the @see:FlexGridFilter class; you
             * rarely use it directly.
             */
            var ColumnFilterEditor = (function (_super) {
                __extends(ColumnFilterEditor, _super);
                /**
                 * Initializes a new instance of the @see:ColumnFilterEditor class.
                 *
                 * @param element The DOM element that hosts the control, or a selector
                 * for the host element (e.g. '#theCtrl').
                 * @param filter The @see:ColumnFilter to edit.
                 * @param sortButtons Whether to show sort buttons in the editor.
                 */
                function ColumnFilterEditor(element, filter, sortButtons) {
                    var _this = this;
                    if (sortButtons === void 0) { sortButtons = true; }
                    _super.call(this, element);
                    /**
                     * Occurs after the filter is modified.
                     */
                    this.filterChanged = new wijmo.Event();
                    /**
                     * Occurs when one of the editor buttons is clicked.
                     */
                    this.buttonClicked = new wijmo.Event();
                    // save reference to filter being edited
                    this._filter = wijmo.asType(filter, filter_1.ColumnFilter);
                    // instantiate and apply template
                    var tpl = this.getTemplate();
                    this.applyTemplate('wj-control wj-columnfiltereditor wj-content', tpl, {
                        _divSort: 'div-sort',
                        _btnAsc: 'btn-asc',
                        _btnDsc: 'btn-dsc',
                        _divType: 'div-type',
                        _aVal: 'a-val',
                        _aCnd: 'a-cnd',
                        _divEdtVal: 'div-edt-val',
                        _divEdtCnd: 'div-edt-cnd',
                        _btnApply: 'btn-apply',
                        _btnClear: 'btn-clear'
                    });
                    // localization
                    this._btnAsc.textContent = wijmo.culture.FlexGridFilter.ascending;
                    this._btnDsc.textContent = wijmo.culture.FlexGridFilter.descending;
                    this._aVal.textContent = wijmo.culture.FlexGridFilter.values;
                    this._aCnd.textContent = wijmo.culture.FlexGridFilter.conditions;
                    this._btnApply.textContent = wijmo.culture.FlexGridFilter.apply;
                    this._btnClear.textContent = wijmo.culture.FlexGridFilter.clear;
                    // show the filter that is active
                    var ft = (this.filter.conditionFilter.isActive || (filter.filterType & filter_1.FilterType.Value) == 0)
                        ? filter_1.FilterType.Condition
                        : filter_1.FilterType.Value;
                    this._showFilter(ft);
                    // hide sort buttons if the collection view is not sortable
                    // or if the user doesn't want them
                    var col = this.filter.column, view = col.grid.collectionView;
                    if (!sortButtons || !view || !view.canSort) {
                        this._divSort.style.display = 'none';
                    }
                    // initialize all values
                    this.updateEditor();
                    // handle button clicks
                    var bnd = this._btnClicked.bind(this);
                    this._btnApply.addEventListener('click', bnd);
                    this._btnClear.addEventListener('click', bnd);
                    this._btnAsc.addEventListener('click', bnd);
                    this._btnDsc.addEventListener('click', bnd);
                    this._aVal.addEventListener('click', bnd);
                    this._aCnd.addEventListener('click', bnd);
                    // commit/dismiss on Enter/Esc
                    this.hostElement.addEventListener('keydown', function (e) {
                        switch (e.keyCode) {
                            case wijmo.Key.Enter:
                                switch (e.target.tagName) {
                                    case 'A':
                                    case 'BUTTON':
                                        _this._btnClicked(e); // TFS 123049
                                        break;
                                    default:
                                        _this.updateFilter();
                                        _this.onFilterChanged();
                                        _this.onButtonClicked();
                                        break;
                                }
                                e.preventDefault();
                                break;
                            case wijmo.Key.Escape:
                                _this.onButtonClicked();
                                e.preventDefault();
                                break;
                        }
                    });
                }
                Object.defineProperty(ColumnFilterEditor.prototype, "filter", {
                    /**
                     * Gets a reference to the @see:ColumnFilter being edited.
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
                ColumnFilterEditor.prototype.updateEditor = function () {
                    if (this._edtVal) {
                        this._edtVal.updateEditor();
                    }
                    if (this._edtCnd) {
                        this._edtCnd.updateEditor();
                    }
                };
                /**
                 * Updates filter with current editor settings.
                 */
                ColumnFilterEditor.prototype.updateFilter = function () {
                    switch (this._getFilterType()) {
                        case filter_1.FilterType.Value:
                            this._edtVal.updateFilter();
                            this.filter.conditionFilter.clear();
                            break;
                        case filter_1.FilterType.Condition:
                            this._edtCnd.updateFilter();
                            this.filter.valueFilter.clear();
                            break;
                    }
                };
                /**
                 * Raises the @see:filterChanged event.
                 */
                ColumnFilterEditor.prototype.onFilterChanged = function (e) {
                    this.filterChanged.raise(this, e);
                };
                /**
                 * Raises the @see:buttonClicked event.
                 */
                ColumnFilterEditor.prototype.onButtonClicked = function (e) {
                    this.buttonClicked.raise(this, e);
                };
                // ** implementation
                // shows the value or filter editor
                ColumnFilterEditor.prototype._showFilter = function (filterType) {
                    // create editor if we have to
                    if (filterType == filter_1.FilterType.Value && this._edtVal == null) {
                        this._edtVal = new filter_1.ValueFilterEditor(this._divEdtVal, this.filter.valueFilter);
                    }
                    if (filterType == filter_1.FilterType.Condition && this._edtCnd == null) {
                        this._edtCnd = new filter_1.ConditionFilterEditor(this._divEdtCnd, this.filter.conditionFilter);
                    }
                    // show selected editor
                    if ((filterType & this.filter.filterType) != 0) {
                        if (filterType == filter_1.FilterType.Value) {
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
                        case filter_1.FilterType.None:
                        case filter_1.FilterType.Condition:
                        case filter_1.FilterType.Value:
                            this._divType.style.display = 'none';
                            break;
                        default:
                            this._divType.style.display = '';
                            break;
                    }
                };
                // enable/disable filter switch links
                ColumnFilterEditor.prototype._enableLink = function (a, enable) {
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
                ColumnFilterEditor.prototype._getFilterType = function () {
                    return this._divEdtVal.style.display != 'none'
                        ? filter_1.FilterType.Value
                        : filter_1.FilterType.Condition;
                };
                // handle buttons
                ColumnFilterEditor.prototype._btnClicked = function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    // ignore disabled elements
                    if (wijmo.hasClass(e.target, 'wj-state-disabled')) {
                        return;
                    }
                    // switch filters
                    if (e.target == this._aVal) {
                        this._showFilter(filter_1.FilterType.Value);
                        this._edtVal.focus();
                        return;
                    }
                    if (e.target == this._aCnd) {
                        this._showFilter(filter_1.FilterType.Condition);
                        this._edtCnd.focus();
                        return;
                    }
                    // apply sort
                    if (e.target == this._btnAsc || e.target == this._btnDsc) {
                        var col = this.filter.column, binding = col.sortMemberPath ? col.sortMemberPath : col.binding, view = col.grid.collectionView, sortDesc = new wijmo.collections.SortDescription(binding, e.target == this._btnAsc);
                        view.sortDescriptions.deferUpdate(function () {
                            view.sortDescriptions.clear();
                            view.sortDescriptions.push(sortDesc);
                        });
                    }
                    // apply/clear filter
                    if (e.target == this._btnApply) {
                        this.updateFilter();
                        this.onFilterChanged();
                    }
                    else if (e.target == this._btnClear) {
                        if (this.filter.isActive) {
                            this.filter.clear();
                            this.onFilterChanged();
                        }
                    }
                    // show current filter state
                    this.updateEditor();
                    // raise event so caller can close the editor and apply the new filter
                    this.onButtonClicked();
                };
                /**
                 * Gets or sets the template used to instantiate @see:ColumnFilterEditor controls.
                 */
                ColumnFilterEditor.controlTemplate = '<div>' +
                    '<div wj-part="div-sort">' +
                    '<a wj-part="btn-asc" href="" style="min-width:95px" draggable="false"></a>&nbsp;&nbsp;&nbsp;' +
                    '<a wj-part="btn-dsc" href="" style="min-width:95px" draggable="false"></a>' +
                    '</div>' +
                    '<div style="text-align:right;margin:10px 0px;font-size:80%">' +
                    '<div wj-part="div-type">' +
                    '<a wj-part="a-cnd" href="" draggable="false"></a>' +
                    '&nbsp;|&nbsp;' +
                    '<a wj-part="a-val" href="" draggable="false"></a>' +
                    '</div>' +
                    '</div>' +
                    '<div wj-part="div-edt-val"></div>' +
                    '<div wj-part="div-edt-cnd"></div>' +
                    '<div style="text-align:right;margin-top:10px">' +
                    '<a wj-part="btn-apply" href="" draggable="false"></a>&nbsp;&nbsp;' +
                    '<a wj-part="btn-clear" href="" draggable="false"></a>' +
                    '</div>';
                return ColumnFilterEditor;
            }(wijmo.Control));
            filter_1.ColumnFilterEditor = ColumnFilterEditor;
        })(filter = grid.filter || (grid.filter = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ColumnFilterEditor.js.map