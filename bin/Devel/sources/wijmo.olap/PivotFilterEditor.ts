module wijmo.olap {
    'use strict';

    /**
     * Editor for @see:PivotFilter objects.
     */
    export class PivotFilterEditor extends Control {

        // property storage
        private _fld: PivotField;

        // child elements
        private _divType: HTMLInputElement;
        private _aCnd: HTMLLinkElement;
        private _aVal: HTMLLinkElement;
        private _divEdtVal: HTMLElement;
        private _divEdtCnd: HTMLElement;
        private _btnOk: HTMLLinkElement;

        // child controls
        private _edtVal: grid.filter.ValueFilterEditor;
        private _edtCnd: grid.filter.ConditionFilterEditor;

        /**
         * Gets or sets the template used to instantiate @see:PivotFilterEditor controls.
         */
        static controlTemplate = '<div>' +
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
        '</div>';

        /**
         * Initializes a new instance of the @see:ColumnFilterEditor class.
         *
         * @param element The DOM element that hosts the control, or a selector 
         * for the host element (e.g. '#theCtrl').
         * @param field The @see:PivotField to edit.
         * @param options JavaScript object containing initialization data for the editor.
         */
        constructor(element: any, field: PivotField, options?: any) {
            super(element);

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
            this._aVal.textContent = culture.FlexGridFilter.values;
            this._aCnd.textContent = culture.FlexGridFilter.conditions;
            //this._btnOk.textContent = culture.FlexGridFilter.apply;

            // handle button clicks
            var bnd = this._btnClicked.bind(this);
            this._btnOk.addEventListener('click', bnd);
            this._aVal.addEventListener('click', bnd);
            this._aCnd.addEventListener('click', bnd);

            // commit/dismiss on Enter/Esc
            this.hostElement.addEventListener('keydown',(e) => {
                switch (e.keyCode) {
                    case Key.Enter:
                        switch ((<HTMLElement>e.target).tagName) {
                            case 'A':
                            case 'BUTTON':
                                this._btnClicked(e);
                                break;
                            default:
                                this.onFinishEditing(new CancelEventArgs());
                                break;
                        }
                        e.preventDefault();
                        break;
                    case Key.Escape:
                        this.onFinishEditing(new CancelEventArgs());
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

        // ** object model

        /**
         * Gets a reference to the @see:PivotField whose filter is being edited.
         */
        get field(): PivotField {
            return this._fld;
        }
        /**
         * Gets a reference to the @see:PivotFilter being edited.
         */
        get filter(): PivotFilter {
            return this._fld ? this._fld.filter : null;
        }
        /**
         * Updates the editor with current filter settings.
         */
        updateEditor() {
            
            // show/hide filter editors
            var ft = grid.filter.FilterType.None;
            if (this.filter) {
                ft = (this.filter.conditionFilter.isActive || (this.filter.filterType & grid.filter.FilterType.Value) == 0)
                    ? grid.filter.FilterType.Condition
                    : grid.filter.FilterType.Value;
                this._showFilter(ft);
            }

            // update filter editors
            if (this._edtVal) {
                this._edtVal.updateEditor();
            }
            if (this._edtCnd) {
                this._edtCnd.updateEditor();
            }
        }
        /**
         * Updates the filter to reflect the current editor values.
         */
        updateFilter() {

            // update the filter
            switch (this._getFilterType()) {
                case grid.filter.FilterType.Value:
                    this._edtVal.updateFilter();
                    this.filter.conditionFilter.clear();
                    break;
                case grid.filter.FilterType.Condition:
                    this._edtCnd.updateFilter();
                    this.filter.valueFilter.clear();
                    break;
            }

            // refresh the view
            this.field.onPropertyChanged(new PropertyChangedEventArgs('filter', null, null));
        }
        /**
         * Clears the editor fields without applying changes to the filter.
         */
        clearEditor() {
            if (this._edtVal) {
                this._edtVal.clearEditor();
            }
            if (this._edtCnd) {
                this._edtCnd.clearEditor();
            }
        }

        /**
         * Occurs when the user finishes editing the filter.
         */
        finishEditing = new Event();
        /**
         * Raises the @see:finishEditing event.
         */
        onFinishEditing(e?: CancelEventArgs) {
            this.finishEditing.raise(this, e);
            return !e.cancel;
        }

        // ** implementation

        // shows the value or filter editor
        private _showFilter(filterType: grid.filter.FilterType) {

            // create editor if we have to
            if (filterType == grid.filter.FilterType.Value && this._edtVal == null) {
                this._edtVal = new grid.filter.ValueFilterEditor(this._divEdtVal, this.filter.valueFilter);
            }
            if (filterType == grid.filter.FilterType.Condition && this._edtCnd == null) {
                this._edtCnd = new grid.filter.ConditionFilterEditor(this._divEdtCnd, this.filter.conditionFilter);
            }

            // show selected editor
            if ((filterType & this.filter.filterType) != 0) {
                if (filterType == grid.filter.FilterType.Value) {
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
                case grid.filter.FilterType.None:
                case grid.filter.FilterType.Condition:
                case grid.filter.FilterType.Value:
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
        private _getFilterType(): grid.filter.FilterType {
            return this._divEdtVal.style.display != 'none'
                ? grid.filter.FilterType.Value
                : grid.filter.FilterType.Condition;
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
                this._showFilter(grid.filter.FilterType.Value);
                moveFocus(this._edtVal.hostElement, 0);
                //this._edtVal.focus();
                return;
            }
            if (e.target == this._aCnd) {
                this._showFilter(grid.filter.FilterType.Condition);
                moveFocus(this._edtCnd.hostElement, 0);
                //this._edtCnd.focus();
                return;
            }

            // finish editing
            this.onFinishEditing(new CancelEventArgs());
        }
    }
}