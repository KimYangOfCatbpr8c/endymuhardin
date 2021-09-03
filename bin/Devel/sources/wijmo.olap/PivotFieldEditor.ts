module wijmo.olap {
    'use strict';

    // globalization
    wijmo.culture.olap = wijmo.culture.olap || {};
    wijmo.culture.olap.PivotFieldEditor = {
        dialogHeader: 'Field settings:',
        header: 'Header:',
        summary: 'Summary:',
        showAs: 'Show As:',
        weighBy: 'Weigh by:',
        sort: 'Sort:',
        filter: 'Filter:',
        format: 'Format:',
        sample: 'Sample:',
        edit: 'Edit...',
        clear: 'Clear',
        ok: 'OK',
        cancel: 'Cancel',
        none: '(none)',
        sorts: {
            asc: 'Ascending',
            desc: 'Descending'
        },
        aggs: {
            sum: 'Sum',
            cnt: 'Count',
            avg: 'Average',
            max: 'Max',
            min: 'Min',
            rng: 'Range',
            std: 'StdDev',
            var: 'Var',
            stdp: 'StdDevPop',
            varp: 'VarPop'
        },
        calcs: {
            noCalc: 'No Calculation',
            dRow: 'Difference from previous row',
            dRowPct: '% Difference from previous row',
            dCol: 'Difference from previous column',
            dColPct: '% Difference from previous column'
        },
        formats: {
            n0: 'Integer (n0)',
            n2: 'Float (n2)',
            c: 'Currency (c)',
            p0: 'Percentage (p0)',
            p2: 'Percentage (p2)', 
            n2c: 'Thousands (n2,)',
            n2cc: 'Millions (n2,,)',
            n2ccc: 'Billions (n2,,,)',
            d: 'Date (d)',
            MMMMddyyyy: 'Month Day Year (MMMM dd, yyyy)',
            dMyy: 'Day Month Year (d/M/yy)',
            ddMyy: 'Day Month Year (dd/M/yy)',
            dMyyyy: 'Day Month Year (dd/M/yyyy)',
            MMMyyyy: 'Month Year (MMM yyyy)',
            MMMMyyyy: 'Month Year (MMMM yyyy)',
            yyyyQq: 'Year Quarter (yyyy "Q"q)',
            FYEEEEQU: 'Fiscal Year Quarter ("FY"EEEE "Q"U)'
        }
    };

    /**
     * Editor for @see:PivotField objects.
     */
    export class PivotFieldEditor extends Control {

        // property storage
        private _fld: PivotField;
        private _pvDate: Date;

        // child elements
        private _dBnd: HTMLElement;
        private _dHdr: HTMLElement;
        private _dAgg: HTMLElement;
        private _dShw: HTMLElement;
        private _dWFl: HTMLElement;
        private _dSrt: HTMLElement;
        private _dFmt: HTMLElement;
        private _dSmp: HTMLElement;
        private _dFlt: HTMLElement;
        private _btnFltEdt: HTMLElement;
        private _btnFltClr: HTMLElement;
        private _btnApply: HTMLElement;
        private _btnCancel: HTMLElement;

        // child controls
        private _cmbHdr: input.ComboBox;
        private _cmbAgg: input.ComboBox;
        private _cmbShw: input.ComboBox;
        private _cmbWFl: input.ComboBox;
        private _cmbSrt: input.ComboBox;
        private _cmbFmt: input.ComboBox;
        private _cmbSmp: input.ComboBox;
        private _eFlt: PivotFilterEditor;

        // globalizable elements
        private _gDlg: HTMLElement;
        private _gHdr: HTMLElement;
        private _gAgg: HTMLElement;
        private _gShw: HTMLElement;
        private _gWfl: HTMLElement;
        private _gSrt: HTMLElement;
        private _gFlt: HTMLElement;
        private _gFmt: HTMLElement;
        private _gSmp: HTMLElement;

        /**
         * Gets or sets the template used to instantiate @see:PivotFieldEditor controls.
         */
        static controlTemplate = '<div>' +

            // header
            '<div class="wj-dialog-header">' +
              '<span wj-part="g-dlg">Field settings:</span> <span wj-part="sp-bnd"></span>' +
            '</div>' +

            // body
            '<div class="wj-dialog-body">' +

              // content
              '<table style="table-layout:fixed">' +
                '<tr>' +
                  '<td wj-part="g-hdr">Header:</td>' +
                  '<td><div wj-part="div-hdr"></div></td>' +
                '</tr>' +
                '<tr class="wj-separator">' +
                  '<td wj-part="g-agg">Summary:</td>' +
                  '<td><div wj-part="div-agg"></div></td>' +
                '</tr>' +
                '<tr class="wj-separator">' +
                  '<td wj-part="g-shw">Show As:</td>' +
                  '<td><div wj-part="div-shw"></div></td>' +
                '</tr>' +
                '<tr>' +
                  '<td wj-part="g-wfl">Weigh by:</td>' +
                  '<td><div wj-part="div-wfl"></div></td>' +
                '</tr>' +
                '<tr>' +
                  '<td wj-part="g-srt">Sort:</td>' +
                  '<td><div wj-part="div-srt"></div></td>' +
                '</tr>' +
                '<tr class="wj-separator">' +
                  '<td wj-part="g-flt">Filter:</td>' +
                  '<td>' +
                    '<a wj-part="btn-flt-edt" href= "" draggable="false">Edit...</a>&nbsp;&nbsp;' +
                    '<a wj-part="btn-flt-clr" href= "" draggable="false">Clear</a>' +
                  '</td>' +
                '</tr>' +
                '<tr class="wj-separator">' +
                  '<td wj-part="g-fmt">Format:</td>' +
                  '<td><div wj-part="div-fmt"></div></td>' +
                '</tr>' +
                '<tr>' +
                  '<td wj-part="g-smp">Sample:</td>' +
                    '<td><div wj-part="div-smp" readonly disabled tabindex="-1"></div></td>' +
                  '</tr>' +
                '</table>' +
              '</div>' +

              // footer
              '<div class="wj-dialog-footer">' +
                '<a class="wj-hide" wj-part="btn-apply" href="" draggable="false">OK</a>&nbsp;&nbsp;' +
                '<a class="wj-hide" wj-part="btn-cancel" href="" draggable="false">Cancel</a>' +
              '</div>' +
            '</div>';

        /**
         * Initializes a new instance of the @see:PivotFieldEditor class.
         *
         * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
         * @param options The JavaScript object containing initialization data for the control.
         */
        constructor(element: any, options?) {
            super(element, null, true);

            // check dependencies
            var depErr = 'Missing dependency: PivotFieldEditor requires ';
            assert(input != null, depErr + 'wijmo.input.');

            // date to use for preview
            this._pvDate = new Date();

            // instantiate and apply template
            var tpl = this.getTemplate();
            this.applyTemplate('wj-control wj-content wj-pivotfieldeditor', tpl, {
                _dBnd: 'sp-bnd',
                _dHdr: 'div-hdr',
                _dAgg: 'div-agg',
                _dShw: 'div-shw',
                _dWFl: 'div-wfl',
                _dSrt: 'div-srt',
                _btnFltEdt: 'btn-flt-edt',
                _btnFltClr: 'btn-flt-clr',
                _dFmt: 'div-fmt',
                _dSmp: 'div-smp',
                _btnApply: 'btn-apply',
                _btnCancel: 'btn-cancel',
                _gDlg: 'g-dlg',
                _gHdr: 'g-hdr',
                _gAgg: 'g-agg',
                _gShw: 'g-shw',
                _gWfl: 'g-wfl',
                _gSrt: 'g-srt',
                _gFlt: 'g-flt',
                _gFmt: 'g-fmt',
                _gSmp: 'g-smp'
            });

            // globalization
            var g = wijmo.culture.olap.PivotFieldEditor;
            this._gDlg.textContent = g.dialogHeader;
            this._gHdr.textContent = g.header;
            this._gAgg.textContent = g.summary;
            this._gShw.textContent = g.showAs,
            this._gWfl.textContent = g.weighBy;
            this._gSrt.textContent = g.sort;
            this._gFlt.textContent = g.filter;
            this._gFmt.textContent = g.format;
            this._gSmp.textContent = g.sample;
            this._btnFltEdt.textContent = g.edit;
            this._btnFltClr.textContent = g.clear;
            this._btnApply.textContent = g.ok;
            this._btnCancel.textContent = g.cancel;

            // create inner controls
            this._cmbHdr = new input.ComboBox(this._dHdr);
            this._cmbAgg = new input.ComboBox(this._dAgg);
            this._cmbShw = new input.ComboBox(this._dShw);
            this._cmbWFl = new input.ComboBox(this._dWFl);
            this._cmbSrt = new input.ComboBox(this._dSrt);
            this._cmbFmt = new input.ComboBox(this._dFmt);
            this._cmbSmp = new input.ComboBox(this._dSmp);

            // initialize inner controls
            this._initAggregateOptions();
            this._initShowAsOptions();
            this._initFormatOptions();
            this._initSortOptions();

            // handle events
            this._cmbShw.textChanged.addHandler(this._updateFormat, this);
            this._cmbFmt.textChanged.addHandler(this._updatePreview, this);
            this.addEventListener(this._btnFltEdt, 'click', (e) => {
                this._editFilter();
                e.preventDefault();
            });
            this.addEventListener(this._btnFltClr, 'click', (e) => {
                this._createFilterEditor();
                this._eFlt.clearEditor();
                enable(this._btnFltClr, false);
                e.preventDefault();
            });
            this.addEventListener(this._btnApply, 'click', (e) => {
                this.updateField();
            });

            // apply options
            this.initialize(options);
        }

        // ** object model

        /**
         * Gets or sets a reference to the @see:PivotField being edited.
         */
        get field(): PivotField {
            return this._fld;
        }
        set field(value: PivotField) {
            if (value != this._fld) {
                this._fld = asType(value, PivotField);
                this.updateEditor();
            }
        }
        /**
         * Updates editor to reflect the current field values.
         */
        updateEditor() {
            if (this._fld) {

                // binding, header
                this._dBnd.textContent = this._fld.binding;
                this._cmbHdr.text = this._fld.header;

                // aggregate, weigh by, sort
                this._cmbAgg.collectionView.refresh();
                this._cmbAgg.selectedValue = this._fld.aggregate;
                this._cmbSrt.selectedValue = this._fld.descending;
                this._cmbShw.selectedValue = this._fld.showAs;
                this._initWeighByOptions();

                // filter
                enable(this._btnFltClr, this._fld.filter.isActive);

                // format, sample
                this._cmbFmt.collectionView.refresh();
                this._cmbFmt.selectedValue = this._fld.format;
                if (!this._cmbFmt.selectedValue) {
                    this._cmbFmt.text = this._fld.format;
                }
            }
        }
        /**
         * Updates field to reflect the current editor values.
         */
        updateField() {
            if (this._fld) {

                // save header
                var hdr = this._cmbHdr.text.trim();
                this._fld.header = hdr ? hdr : toHeaderCase(this._fld.binding);

                // save aggregate, weigh by, sort
                this._fld.aggregate = this._cmbAgg.selectedValue;
                this._fld.showAs = this._cmbShw.selectedValue;
                this._fld.weightField = this._cmbWFl.selectedValue;
                this._fld.descending = this._cmbSrt.selectedValue;

                // save filter
                if (this._eFlt) {
                    this._eFlt.updateFilter();
                }
                
                // save format
                this._fld.format = this._cmbFmt.selectedValue || this._cmbFmt.text;
            }
        }

        // ** overrides

        // check whether this control or its drop-down contain the focused element.
        containsFocus(): boolean {
            return super.containsFocus() || contains(this._dFlt, getActiveElement());
        }

        // ** implementation

        // initialize aggregate options
        _initAggregateOptions() {
            var g = wijmo.culture.olap.PivotFieldEditor.aggs,
                list = [
                    { key: g.sum, val: Aggregate.Sum, all: false },
                    { key: g.cnt, val: Aggregate.Cnt, all: true },
                    { key: g.avg, val: Aggregate.Avg, all: false },
                    { key: g.max, val: Aggregate.Max, all: true },
                    { key: g.min, val: Aggregate.Min, all: true },
                    { key: g.rng, val: Aggregate.Rng, all: false },
                    { key: g.std, val: Aggregate.Std, all: false },
                    { key: g.var, val: Aggregate.Var, all: false },
                    { key: g.stdp, val: Aggregate.StdPop, all: false },
                    { key: g.varp, val: Aggregate.VarPop, all: false }
                ];
            this._cmbAgg.itemsSource = list;
            this._cmbAgg.collectionView.filter = (item) => {
                if (item && item.all) {
                    return true;
                }
                if (this._fld) {
                    return this._fld.dataType == DataType.Number || this._fld.dataType == DataType.Boolean;
                }
                return false;
            };
            this._cmbAgg.initialize({
                displayMemberPath: 'key',
                selectedValuePath: 'val'
            });
        }

        // initialize showAs options
        _initShowAsOptions() {
            var g = wijmo.culture.olap.PivotFieldEditor.calcs,
                list = [
                    { key: g.noCalc, val: ShowAs.NoCalculation },
                    { key: g.dRow, val: ShowAs.DiffRow },
                    { key: g.dRowPct, val: ShowAs.DiffRowPct },
                    { key: g.dCol, val: ShowAs.DiffCol },
                    { key: g.dColPct, val: ShowAs.DiffColPct },
                ];
            this._cmbShw.itemsSource = list;
            this._cmbShw.initialize({
                displayMemberPath: 'key',
                selectedValuePath: 'val'
            });
        }

        // initialize format options
        _initFormatOptions() {
            var g = wijmo.culture.olap.PivotFieldEditor.formats,
                list = [

                    // numbers (numeric dimensions and measures/aggregates)
                    { key: g.n0, val: 'n0', all: true },
                    { key: g.n2, val: 'n2', all: true },
                    { key: g.c, val: 'c', all: true },
                    { key: g.p0, val: 'p0', all: true },
                    { key: g.p2, val: 'p2', all: true },
                    { key: g.n2c, val: 'n2,', all: true },
                    { key: g.n2cc, val: 'n2,,', all: true },
                    { key: g.n2ccc, val: 'n2,,,', all: true },

                    // dates (date dimensions)
                    { key: g.d, val: 'd', all: false },
                    { key: g.MMMMddyyyy, val: 'MMMM dd, yyyy', all: false },
                    { key: g.dMyy, val: 'd/M/yy', all: false },
                    { key: g.ddMyy, val: 'dd/M/yy', all: false },
                    { key: g.ddMyyyy, val: 'dd/M/yyyy', all: false },
                    { key: g.MMMyyyy, val: 'MMM yyyy', all: false },
                    { key: g.MMMMyyyy, val: 'MMMM yyyy', all: false },
                    { key: g.yyyyQq, val: 'yyyy "Q"q', all: false },
                    { key: g.FYEEEEQU, val: '"FY"EEEE "Q"U', all: false }
                ];
            this._cmbFmt.itemsSource = list;
            this._cmbFmt.isEditable = true;
            this._cmbFmt.isRequired = false;
            this._cmbFmt.collectionView.filter = (item) => {
                if (item && item.all) {
                    return true;
                }
                if (this._fld) {
                    return this._fld.dataType == DataType.Date;
                }
                return false;
            };
            this._cmbFmt.initialize({
                displayMemberPath: 'key',
                selectedValuePath: 'val'
            });
        }

        // initialize weight by options/value
        _initWeighByOptions() {
            var list = [
                { key: culture.olap.PivotFieldEditor.none, val: null }
            ];
            if (this._fld) {
                var ng = this._fld.engine;
                for (var i = 0; i < ng.fields.length; i++) {
                    var wbf = ng.fields[i];
                    if (wbf != this._fld && wbf.dataType == DataType.Number) {
                        list.push({ key: wbf.header, val: wbf });
                    }
                }
            }
            this._cmbWFl.initialize({
                displayMemberPath: 'key',
                selectedValuePath: 'val',
                itemsSource: list,
                selectedValue: this._fld.weightField
            });
        }

        // initialize sort options
        _initSortOptions() {
            var g = culture.olap.PivotFieldEditor.sorts,
                list = [
                    { key: g.asc, val: false },
                    { key: g.desc, val: true }
                ];
            this._cmbSrt.itemsSource = list;
            this._cmbSrt.initialize({
                displayMemberPath: 'key',
                selectedValuePath: 'val'
            });
        }

        // update the format to match the 'showAs' setting
        _updateFormat() {
            switch (this._cmbShw.selectedValue) {
                case ShowAs.DiffRowPct:
                case ShowAs.DiffColPct:
                    this._cmbFmt.selectedValue = 'p0';
                    break;
                default:
                    this._cmbFmt.selectedValue = 'n0';
                    break;
            }
        }

        // update the preview field to show the effect of the current settings
        _updatePreview() {
            var format = this._cmbFmt.selectedValue || this._cmbFmt.text,
                sample = '';
            if (format) {
                var ft = format[0].toLowerCase(),
                    nf = 'nfgxc';
                if (nf.indexOf(ft) > -1) { // number
                    sample = Globalize.format(123.456, format);
                } else if (ft == 'p') { // percentage
                    sample = Globalize.format(0.1234, format);
                } else { // date
                    sample = Globalize.format(this._pvDate, format);
                }
            }
            this._cmbSmp.text = sample;
        }

         // show the filter editor for this field
        _editFilter() {
            this._createFilterEditor();
            showPopup(this._dFlt, this._btnFltEdt, false, false, false);
            moveFocus(this._dFlt, 0);
        }

        // create filter editor
        _createFilterEditor() {
            if (!this._dFlt) {

                // create filter
                this._dFlt = document.createElement('div');
                this._eFlt = new PivotFilterEditor(this._dFlt, this._fld);
                addClass(this._dFlt, 'wj-dropdown-panel');

                // close editor when it loses focus (changes are not applied)
                this._eFlt.lostFocus.addHandler(() => {
                    setTimeout(() => {
                        var ctl = Control.getControl(this._dFlt);
                        if (ctl && !ctl.containsFocus()) {
                            this._closeFilter();
                        }
                    }, 10);
                });

                // close the filter when the user finishes editing
                this._eFlt.finishEditing.addHandler(() => {
                    this._closeFilter();
                    enable(this._btnFltClr, true);
                });
            }
        }

        // close filter editor
        _closeFilter() {
            if (this._dFlt) {
                hidePopup(this._dFlt, true);
                this.focus();
            }
        }
    }
}