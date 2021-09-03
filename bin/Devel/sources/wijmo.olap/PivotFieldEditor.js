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
        var PivotFieldEditor = (function (_super) {
            __extends(PivotFieldEditor, _super);
            /**
             * Initializes a new instance of the @see:PivotFieldEditor class.
             *
             * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
             * @param options The JavaScript object containing initialization data for the control.
             */
            function PivotFieldEditor(element, options) {
                var _this = this;
                _super.call(this, element, null, true);
                // check dependencies
                var depErr = 'Missing dependency: PivotFieldEditor requires ';
                wijmo.assert(wijmo.input != null, depErr + 'wijmo.input.');
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
                this._cmbHdr = new wijmo.input.ComboBox(this._dHdr);
                this._cmbAgg = new wijmo.input.ComboBox(this._dAgg);
                this._cmbShw = new wijmo.input.ComboBox(this._dShw);
                this._cmbWFl = new wijmo.input.ComboBox(this._dWFl);
                this._cmbSrt = new wijmo.input.ComboBox(this._dSrt);
                this._cmbFmt = new wijmo.input.ComboBox(this._dFmt);
                this._cmbSmp = new wijmo.input.ComboBox(this._dSmp);
                // initialize inner controls
                this._initAggregateOptions();
                this._initShowAsOptions();
                this._initFormatOptions();
                this._initSortOptions();
                // handle events
                this._cmbShw.textChanged.addHandler(this._updateFormat, this);
                this._cmbFmt.textChanged.addHandler(this._updatePreview, this);
                this.addEventListener(this._btnFltEdt, 'click', function (e) {
                    _this._editFilter();
                    e.preventDefault();
                });
                this.addEventListener(this._btnFltClr, 'click', function (e) {
                    _this._createFilterEditor();
                    _this._eFlt.clearEditor();
                    wijmo.enable(_this._btnFltClr, false);
                    e.preventDefault();
                });
                this.addEventListener(this._btnApply, 'click', function (e) {
                    _this.updateField();
                });
                // apply options
                this.initialize(options);
            }
            Object.defineProperty(PivotFieldEditor.prototype, "field", {
                // ** object model
                /**
                 * Gets or sets a reference to the @see:PivotField being edited.
                 */
                get: function () {
                    return this._fld;
                },
                set: function (value) {
                    if (value != this._fld) {
                        this._fld = wijmo.asType(value, olap.PivotField);
                        this.updateEditor();
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Updates editor to reflect the current field values.
             */
            PivotFieldEditor.prototype.updateEditor = function () {
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
                    wijmo.enable(this._btnFltClr, this._fld.filter.isActive);
                    // format, sample
                    this._cmbFmt.collectionView.refresh();
                    this._cmbFmt.selectedValue = this._fld.format;
                    if (!this._cmbFmt.selectedValue) {
                        this._cmbFmt.text = this._fld.format;
                    }
                }
            };
            /**
             * Updates field to reflect the current editor values.
             */
            PivotFieldEditor.prototype.updateField = function () {
                if (this._fld) {
                    // save header
                    var hdr = this._cmbHdr.text.trim();
                    this._fld.header = hdr ? hdr : wijmo.toHeaderCase(this._fld.binding);
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
            };
            // ** overrides
            // check whether this control or its drop-down contain the focused element.
            PivotFieldEditor.prototype.containsFocus = function () {
                return _super.prototype.containsFocus.call(this) || wijmo.contains(this._dFlt, wijmo.getActiveElement());
            };
            // ** implementation
            // initialize aggregate options
            PivotFieldEditor.prototype._initAggregateOptions = function () {
                var _this = this;
                var g = wijmo.culture.olap.PivotFieldEditor.aggs, list = [
                    { key: g.sum, val: wijmo.Aggregate.Sum, all: false },
                    { key: g.cnt, val: wijmo.Aggregate.Cnt, all: true },
                    { key: g.avg, val: wijmo.Aggregate.Avg, all: false },
                    { key: g.max, val: wijmo.Aggregate.Max, all: true },
                    { key: g.min, val: wijmo.Aggregate.Min, all: true },
                    { key: g.rng, val: wijmo.Aggregate.Rng, all: false },
                    { key: g.std, val: wijmo.Aggregate.Std, all: false },
                    { key: g.var, val: wijmo.Aggregate.Var, all: false },
                    { key: g.stdp, val: wijmo.Aggregate.StdPop, all: false },
                    { key: g.varp, val: wijmo.Aggregate.VarPop, all: false }
                ];
                this._cmbAgg.itemsSource = list;
                this._cmbAgg.collectionView.filter = function (item) {
                    if (item && item.all) {
                        return true;
                    }
                    if (_this._fld) {
                        return _this._fld.dataType == wijmo.DataType.Number || _this._fld.dataType == wijmo.DataType.Boolean;
                    }
                    return false;
                };
                this._cmbAgg.initialize({
                    displayMemberPath: 'key',
                    selectedValuePath: 'val'
                });
            };
            // initialize showAs options
            PivotFieldEditor.prototype._initShowAsOptions = function () {
                var g = wijmo.culture.olap.PivotFieldEditor.calcs, list = [
                    { key: g.noCalc, val: olap.ShowAs.NoCalculation },
                    { key: g.dRow, val: olap.ShowAs.DiffRow },
                    { key: g.dRowPct, val: olap.ShowAs.DiffRowPct },
                    { key: g.dCol, val: olap.ShowAs.DiffCol },
                    { key: g.dColPct, val: olap.ShowAs.DiffColPct },
                ];
                this._cmbShw.itemsSource = list;
                this._cmbShw.initialize({
                    displayMemberPath: 'key',
                    selectedValuePath: 'val'
                });
            };
            // initialize format options
            PivotFieldEditor.prototype._initFormatOptions = function () {
                var _this = this;
                var g = wijmo.culture.olap.PivotFieldEditor.formats, list = [
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
                this._cmbFmt.collectionView.filter = function (item) {
                    if (item && item.all) {
                        return true;
                    }
                    if (_this._fld) {
                        return _this._fld.dataType == wijmo.DataType.Date;
                    }
                    return false;
                };
                this._cmbFmt.initialize({
                    displayMemberPath: 'key',
                    selectedValuePath: 'val'
                });
            };
            // initialize weight by options/value
            PivotFieldEditor.prototype._initWeighByOptions = function () {
                var list = [
                    { key: wijmo.culture.olap.PivotFieldEditor.none, val: null }
                ];
                if (this._fld) {
                    var ng = this._fld.engine;
                    for (var i = 0; i < ng.fields.length; i++) {
                        var wbf = ng.fields[i];
                        if (wbf != this._fld && wbf.dataType == wijmo.DataType.Number) {
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
            };
            // initialize sort options
            PivotFieldEditor.prototype._initSortOptions = function () {
                var g = wijmo.culture.olap.PivotFieldEditor.sorts, list = [
                    { key: g.asc, val: false },
                    { key: g.desc, val: true }
                ];
                this._cmbSrt.itemsSource = list;
                this._cmbSrt.initialize({
                    displayMemberPath: 'key',
                    selectedValuePath: 'val'
                });
            };
            // update the format to match the 'showAs' setting
            PivotFieldEditor.prototype._updateFormat = function () {
                switch (this._cmbShw.selectedValue) {
                    case olap.ShowAs.DiffRowPct:
                    case olap.ShowAs.DiffColPct:
                        this._cmbFmt.selectedValue = 'p0';
                        break;
                    default:
                        this._cmbFmt.selectedValue = 'n0';
                        break;
                }
            };
            // update the preview field to show the effect of the current settings
            PivotFieldEditor.prototype._updatePreview = function () {
                var format = this._cmbFmt.selectedValue || this._cmbFmt.text, sample = '';
                if (format) {
                    var ft = format[0].toLowerCase(), nf = 'nfgxc';
                    if (nf.indexOf(ft) > -1) {
                        sample = wijmo.Globalize.format(123.456, format);
                    }
                    else if (ft == 'p') {
                        sample = wijmo.Globalize.format(0.1234, format);
                    }
                    else {
                        sample = wijmo.Globalize.format(this._pvDate, format);
                    }
                }
                this._cmbSmp.text = sample;
            };
            // show the filter editor for this field
            PivotFieldEditor.prototype._editFilter = function () {
                this._createFilterEditor();
                wijmo.showPopup(this._dFlt, this._btnFltEdt, false, false, false);
                wijmo.moveFocus(this._dFlt, 0);
            };
            // create filter editor
            PivotFieldEditor.prototype._createFilterEditor = function () {
                var _this = this;
                if (!this._dFlt) {
                    // create filter
                    this._dFlt = document.createElement('div');
                    this._eFlt = new olap.PivotFilterEditor(this._dFlt, this._fld);
                    wijmo.addClass(this._dFlt, 'wj-dropdown-panel');
                    // close editor when it loses focus (changes are not applied)
                    this._eFlt.lostFocus.addHandler(function () {
                        setTimeout(function () {
                            var ctl = wijmo.Control.getControl(_this._dFlt);
                            if (ctl && !ctl.containsFocus()) {
                                _this._closeFilter();
                            }
                        }, 10);
                    });
                    // close the filter when the user finishes editing
                    this._eFlt.finishEditing.addHandler(function () {
                        _this._closeFilter();
                        wijmo.enable(_this._btnFltClr, true);
                    });
                }
            };
            // close filter editor
            PivotFieldEditor.prototype._closeFilter = function () {
                if (this._dFlt) {
                    wijmo.hidePopup(this._dFlt, true);
                    this.focus();
                }
            };
            /**
             * Gets or sets the template used to instantiate @see:PivotFieldEditor controls.
             */
            PivotFieldEditor.controlTemplate = '<div>' +
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
            return PivotFieldEditor;
        }(wijmo.Control));
        olap.PivotFieldEditor = PivotFieldEditor;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=PivotFieldEditor.js.map