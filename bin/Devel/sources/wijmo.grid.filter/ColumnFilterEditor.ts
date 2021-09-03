module wijmo.grid.filter {
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
            { name: 'Equals', op: Operator.EQ },
            { name: 'Does not equal', op: Operator.NE },
            { name: 'Begins with', op: Operator.BW },
            { name: 'Ends with', op: Operator.EW },
            { name: 'Contains', op: Operator.CT },
            { name: 'Does not contain', op: Operator.NC }
        ],
        numberOperators: [
            { name: '(not set)', op: null },
            { name: 'Equals', op: Operator.EQ },
            { name: 'Does not equal', op: Operator.NE },
            { name: 'Is Greater than', op: Operator.GT },
            { name: 'Is Greater than or equal to', op: Operator.GE },
            { name: 'Is Less than', op: Operator.LT },
            { name: 'Is Less than or equal to', op: Operator.LE }
        ],
        dateOperators: [
            { name: '(not set)', op: null },
            { name: 'Equals', op: Operator.EQ },
            { name: 'Is Before', op: Operator.LT },
            { name: 'Is After', op: Operator.GT }
        ],
        booleanOperators: [
            { name: '(not set)', op: null },
            { name: 'Equals', op: Operator.EQ },
            { name: 'Does not equal', op: Operator.NE }
        ]
    };

    /**
     * The editor used to inspect and modify column filters.
     *
     * This class is used by the @see:FlexGridFilter class; you 
     * rarely use it directly.
     */
    export class ColumnFilterEditor extends Control {
        private _filter: ColumnFilter;
        private _edtVal: ValueFilterEditor;
        private _edtCnd: ConditionFilterEditor;

        private _divSort: HTMLElement;
        private _btnAsc: HTMLInputElement;
        private _btnDsc: HTMLInputElement;
        private _divType: HTMLInputElement;
        private _aCnd: HTMLLinkElement;
        private _aVal: HTMLLinkElement;
        private _divEdtVal: HTMLElement;
        private _divEdtCnd: HTMLElement;
        private _btnApply: HTMLLinkElement;
        private _btnClear: HTMLLinkElement;

        /**
         * Gets or sets the template used to instantiate @see:ColumnFilterEditor controls.
         */
        static controlTemplate = '<div>' +
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
        '</div>';

        /**
         * Initializes a new instance of the @see:ColumnFilterEditor class.
         *
         * @param element The DOM element that hosts the control, or a selector 
         * for the host element (e.g. '#theCtrl').
         * @param filter The @see:ColumnFilter to edit.
         * @param sortButtons Whether to show sort buttons in the editor.
         */
        constructor(element: any, filter: ColumnFilter, sortButtons = true) {
            super(element);

            // save reference to filter being edited
            this._filter = asType(filter, ColumnFilter);

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
            var ft = (this.filter.conditionFilter.isActive || (filter.filterType & FilterType.Value) == 0)
                ? FilterType.Condition
                : FilterType.Value;
            this._showFilter(ft);

            // hide sort buttons if the collection view is not sortable
            // or if the user doesn't want them
            var col = this.filter.column,
                view = col.grid.collectionView;
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
            this.hostElement.addEventListener('keydown', (e) => {
                switch (e.keyCode) {
                    case Key.Enter:
                        switch ((<HTMLElement>e.target).tagName) {
                            case 'A':
                            case 'BUTTON':
                                this._btnClicked(e); // TFS 123049
                                break;
                            default:
                                this.updateFilter();
                                this.onFilterChanged();
                                this.onButtonClicked();
                                break;
                        }
                        e.preventDefault();
                        break;
                    case Key.Escape:
                        this.onButtonClicked();
                        e.preventDefault();
                        break;
                }
            });
        }

        /**
         * Gets a reference to the @see:ColumnFilter being edited.
         */
        get filter(): ColumnFilter {
            return this._filter;
        }
        /**
         * Updates editor with current filter settings.
         */
        updateEditor() {
            if (this._edtVal) {
                this._edtVal.updateEditor();
            }
            if (this._edtCnd) {
                this._edtCnd.updateEditor();
            }
        }
        /**
         * Updates filter with current editor settings.
         */
        updateFilter() {
            switch (this._getFilterType()) {
                case FilterType.Value:
                    this._edtVal.updateFilter();
                    this.filter.conditionFilter.clear();
                    break;
                case FilterType.Condition:
                    this._edtCnd.updateFilter();
                    this.filter.valueFilter.clear();
                    break;
            }
        }
        /**
         * Occurs after the filter is modified.
         */
        filterChanged = new Event();
        /**
         * Raises the @see:filterChanged event.
         */
        onFilterChanged(e?: EventArgs) {
            this.filterChanged.raise(this, e);
        }
        /**
         * Occurs when one of the editor buttons is clicked.
         */
        buttonClicked = new Event();
        /**
         * Raises the @see:buttonClicked event.
         */
        onButtonClicked(e?: EventArgs) {
            this.buttonClicked.raise(this, e);
        }

        // ** implementation

        // shows the value or filter editor
        _showFilter(filterType: FilterType) {

            // create editor if we have to
            if (filterType == FilterType.Value && this._edtVal == null) {
                this._edtVal = new ValueFilterEditor(this._divEdtVal, this.filter.valueFilter);
            }
            if (filterType == FilterType.Condition && this._edtCnd == null) {
                this._edtCnd = new ConditionFilterEditor(this._divEdtCnd, this.filter.conditionFilter);
            }

            // show selected editor
            if ((filterType & this.filter.filterType) != 0) {
                if (filterType == FilterType.Value) {
                    this._divEdtVal.style.display = '';
                    this._divEdtCnd.style.display = 'none';
                    this._enableLink(this._aVal, false);
                    this._enableLink(this._aCnd, true);
                } else {
                    this._divEdtVal.style.display = 'none';
                    this._divEdtCnd.style.display = '';
                    this._enableLink(this._aVal, true);
                    this._enableLink(this._aCnd, false);
                }
            }

            // hide switch button if only one filter type is supported
            switch (this.filter.filterType) {
                case FilterType.None:
                case FilterType.Condition:
                case FilterType.Value:
                    this._divType.style.display = 'none';
                    break;
                default: 
                    this._divType.style.display = '';
                    break;
            }
        }

        // enable/disable filter switch links
        _enableLink(a: HTMLLinkElement, enable: boolean) {
            a.style.textDecoration = enable ? '' : 'none';
            a.style.fontWeight = enable ? '' : 'bold';
            if (enable) {
                a.href = '';
            } else {
                a.removeAttribute('href');
            }
        }


        // gets the type of filter currently being edited
        private _getFilterType() : FilterType {
            return this._divEdtVal.style.display != 'none' 
                ? FilterType.Value 
                : FilterType.Condition;
        }

        // handle buttons
        private _btnClicked(e) {
            e.preventDefault();
            e.stopPropagation();

            // ignore disabled elements
            if (hasClass(e.target, 'wj-state-disabled')) {
                return;
            }

            // switch filters
            if (e.target == this._aVal) {
                this._showFilter(FilterType.Value);
                this._edtVal.focus();
                return;
            }
            if (e.target == this._aCnd) {
                this._showFilter(FilterType.Condition);
                this._edtCnd.focus();
                return;
            }

            // apply sort
            if (e.target == this._btnAsc || e.target == this._btnDsc) {
                var col = this.filter.column,
                    binding = col.sortMemberPath ? col.sortMemberPath : col.binding,
                    view = col.grid.collectionView,
                    sortDesc = new collections.SortDescription(binding, e.target == this._btnAsc);
                view.sortDescriptions.deferUpdate(() => {
                    view.sortDescriptions.clear();
                    view.sortDescriptions.push(sortDesc);
                });
            }

            // apply/clear filter
            if (e.target == this._btnApply) {
                this.updateFilter();
                this.onFilterChanged();
            } else if (e.target == this._btnClear) {
                if (this.filter.isActive) {
                    this.filter.clear();
                    this.onFilterChanged();
                }
            }

            // show current filter state
            this.updateEditor();

            // raise event so caller can close the editor and apply the new filter
            this.onButtonClicked();
        }
    }
}