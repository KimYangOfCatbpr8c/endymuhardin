var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var grid;
    (function (grid) {
        var sheet;
        (function (sheet) {
            'use strict';
            /*
             * Implements an Excel-style filter for @see:FlexSheet controls.
             *
             * To enable filtering on a @see:FlexSheet control, create an instance
             * of the @see:FlexSheetFilter and pass the grid as a parameter to the
             * constructor.
             */
            var _FlexSheetFilter = (function (_super) {
                __extends(_FlexSheetFilter, _super);
                function _FlexSheetFilter() {
                    _super.apply(this, arguments);
                }
                Object.defineProperty(_FlexSheetFilter.prototype, "filterDefinition", {
                    /*
                     * Gets or sets the current filter definition as a JSON string.
                     */
                    get: function () {
                        var def = {
                            defaultFilterType: this.defaultFilterType,
                            filters: []
                        };
                        for (var i = 0; i < this['_filters'].length; i++) {
                            var cf = this['_filters'][i];
                            if (cf && cf.column) {
                                if (cf.conditionFilter.isActive) {
                                    var cfc = cf.conditionFilter;
                                    def.filters.push({
                                        columnIndex: cf.column.index,
                                        type: 'condition',
                                        condition1: { operator: cfc.condition1.operator, value: cfc.condition1.value },
                                        and: cfc.and,
                                        condition2: { operator: cfc.condition2.operator, value: cfc.condition2.value }
                                    });
                                }
                                else if (cf.valueFilter.isActive) {
                                    var cfv = cf.valueFilter;
                                    def.filters.push({
                                        columnIndex: cf.column.index,
                                        type: 'value',
                                        filterText: cfv.filterText,
                                        showValues: cfv.showValues
                                    });
                                }
                            }
                        }
                        return JSON.stringify(def);
                    },
                    set: function (value) {
                        var def = JSON.parse(wijmo.asString(value));
                        this.clear();
                        this.defaultFilterType = def.defaultFilterType;
                        for (var i = 0; i < def.filters.length; i++) {
                            var cfs = def.filters[i], col = this.grid.columns[cfs.columnIndex], cf = this.getColumnFilter(col, true);
                            if (cf) {
                                switch (cfs.type) {
                                    case 'condition':
                                        var cfc = cf.conditionFilter;
                                        cfc.condition1.value = col.dataType == wijmo.DataType.Date // handle times/times: TFS 125144, 143453
                                            ? wijmo.changeType(cfs.condition1.value, col.dataType, null)
                                            : cfs.condition1.value;
                                        cfc.condition1.operator = cfs.condition1.operator;
                                        cfc.and = cfs.and;
                                        cfc.condition2.value = col.dataType == wijmo.DataType.Date
                                            ? wijmo.changeType(cfs.condition2.value, col.dataType, null)
                                            : cfs.condition2.value;
                                        cfc.condition2.operator = cfs.condition2.operator;
                                        break;
                                    case 'value':
                                        var cfv = cf.valueFilter;
                                        cfv.filterText = cfs.filterText;
                                        cfv.showValues = cfs.showValues;
                                        break;
                                }
                            }
                        }
                        this.apply();
                    },
                    enumerable: true,
                    configurable: true
                });
                /*
                 * Applies the current column filters to the sheet.
                 */
                _FlexSheetFilter.prototype.apply = function () {
                    var self = this;
                    self.grid.deferUpdate(function () {
                        var row;
                        for (var i = 0; i < self.grid.rows.length; i++) {
                            row = self.grid.rows[i];
                            if (row instanceof sheet.HeaderRow) {
                                continue;
                            }
                            row.visible = self['_filter'](i);
                        }
                    });
                };
                /*
                 * Shows the filter editor for the given grid column.
                 *
                 * @param col The @see:Column that contains the filter to edit.
                 * @param ht A @see:HitTestInfo object containing the range of the cell that triggered the filter display.
                 */
                _FlexSheetFilter.prototype.editColumnFilter = function (col, ht) {
                    var _this = this;
                    // remove current editor
                    this.closeEditor();
                    // get column by name or by reference
                    col = wijmo.isString(col)
                        ? this.grid.columns.getColumn(col)
                        : wijmo.asType(col, grid.Column, false);
                    // raise filterChanging event
                    var e = new grid.CellRangeEventArgs(this.grid.cells, new grid.CellRange(-1, col.index));
                    this.onFilterChanging(e);
                    if (e.cancel) {
                        return;
                    }
                    e.cancel = true; // assume the changes will be canceled
                    // get the filter and the editor
                    var div = document.createElement('div'), flt = this.getColumnFilter(col), edt = new sheet._FlexSheetColumnFilterEditor(div, flt, this.showSortButtons);
                    wijmo.addClass(div, 'wj-dropdown-panel');
                    // handle RTL
                    if (this.grid._rtl) {
                        div.dir = 'rtl';
                    }
                    // apply filter when it changes
                    edt.filterChanged.addHandler(function () {
                        e.cancel = false; // the changes were not canceled
                        setTimeout(function () {
                            if (!e.cancel) {
                                _this.apply();
                            }
                        });
                    });
                    // close editor when editor button is clicked
                    edt.buttonClicked.addHandler(function () {
                        _this.closeEditor();
                        _this.onFilterChanged(e);
                    });
                    // close editor when it loses focus (changes are not applied)
                    edt.lostFocus.addHandler(function () {
                        setTimeout(function () {
                            var ctl = wijmo.Control.getControl(_this['_divEdt']);
                            if (ctl && !ctl.containsFocus()) {
                                _this.closeEditor();
                            }
                        }, 10); //200); // let others handle it first
                    });
                    // get the header cell to position editor
                    var ch = this.grid.columnHeaders, r = ht ? ht.row : ch.rows.length - 1, c = ht ? ht.col : col.index, rc = ch.getCellBoundingRect(r, c), hdrCell = document.elementFromPoint(rc.left + rc.width / 2, rc.top + rc.height / 2);
                    hdrCell = wijmo.closest(hdrCell, '.wj-cell');
                    // show editor and give it focus
                    if (hdrCell) {
                        wijmo.showPopup(div, hdrCell, false, false, false);
                    }
                    else {
                        wijmo.showPopup(div, rc);
                    }
                    edt.focus();
                    // save reference to editor
                    this['_divEdt'] = div;
                    this['_edtCol'] = col;
                };
                /*
                 * Gets the filter for the given column.
                 *
                 * @param col The @see:Column that the filter applies to (or column name or index).
                 * @param create Whether to create the filter if it does not exist.
                 */
                _FlexSheetFilter.prototype.getColumnFilter = function (col, create) {
                    if (create === void 0) { create = true; }
                    // get the column by name or index, check type
                    if (wijmo.isString(col)) {
                        col = this.grid.columns.getColumn(col);
                    }
                    else if (wijmo.isNumber(col)) {
                        col = this.grid.columns[col];
                    }
                    col = wijmo.asType(col, grid.Column);
                    // look for the filter
                    for (var i = 0; i < this['_filters'].length; i++) {
                        if (this['_filters'][i].column == col) {
                            return this['_filters'][i];
                        }
                    }
                    // not found, create one now
                    if (create) {
                        var cf = new sheet._FlexSheetColumnFilter(this, col);
                        this['_filters'].push(cf);
                        return cf;
                    }
                    // not found, not created
                    return null;
                };
                return _FlexSheetFilter;
            }(wijmo.grid.filter.FlexGridFilter));
            sheet._FlexSheetFilter = _FlexSheetFilter;
        })(sheet = grid.sheet || (grid.sheet = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_FlexSheetFilter.js.map