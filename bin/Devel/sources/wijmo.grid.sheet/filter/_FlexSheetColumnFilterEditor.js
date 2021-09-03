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
             * The editor used to inspect and modify column filters.
             *
             * This class is used by the @see:FlexSheetFilter class; you
             * rarely use it directly.
             */
            var _FlexSheetColumnFilterEditor = (function (_super) {
                __extends(_FlexSheetColumnFilterEditor, _super);
                /*
                 * Initializes a new instance of the @see:FlexSheetColumnFilterEditor class.
                 *
                 * @param element The DOM element that hosts the control, or a selector
                 * for the host element (e.g. '#theCtrl').
                 * @param filter The @see:FlexSheetColumnFilter to edit.
                 * @param sortButtons Whether to show sort buttons in the editor.
                 */
                function _FlexSheetColumnFilterEditor(element, filter, sortButtons) {
                    if (sortButtons === void 0) { sortButtons = true; }
                    _super.call(this, element, filter, sortButtons);
                    var self = this, btnAsc, btnDsc;
                    if (sortButtons) {
                        this['_divSort'].style.display = '';
                    }
                    btnAsc = this.cloneElement(this['_btnAsc']);
                    btnDsc = this.cloneElement(this['_btnDsc']);
                    this['_btnAsc'].parentNode.replaceChild(btnAsc, this['_btnAsc']);
                    this['_btnDsc'].parentNode.replaceChild(btnDsc, this['_btnDsc']);
                    btnAsc.addEventListener('click', function (e) {
                        self._sortBtnClick(e, true);
                    });
                    btnDsc.addEventListener('click', function (e) {
                        self._sortBtnClick(e, false);
                    });
                }
                // shows the value or filter editor
                _FlexSheetColumnFilterEditor.prototype._showFilter = function (filterType) {
                    // create editor if we have to
                    if (filterType == wijmo.grid.filter.FilterType.Value && this['_edtVal'] == null) {
                        this['_edtVal'] = new sheet._FlexSheetValueFilterEditor(this['_divEdtVal'], this.filter.valueFilter);
                    }
                    _super.prototype._showFilter.call(this, filterType);
                };
                // sort button click event handler
                _FlexSheetColumnFilterEditor.prototype._sortBtnClick = function (e, asceding) {
                    var column = this.filter.column, sortManager = column.grid.sortManager, sortIndex, offset, sortItem;
                    e.preventDefault();
                    e.stopPropagation();
                    sortIndex = sortManager.checkSortItemExists(column.index);
                    if (sortIndex > -1) {
                        // If the sort item for current column doesn't exist, we add new sort item for current column
                        sortManager.sortDescriptions.moveCurrentToPosition(sortIndex);
                        sortItem = sortManager.sortDescriptions.currentItem;
                        sortItem.ascending = asceding;
                        offset = -sortIndex;
                    }
                    else {
                        sortManager.addSortLevel(column.index, asceding);
                        offset = -(sortManager.sortDescriptions.items.length - 1);
                    }
                    // Move sort item for current column to first level.
                    sortManager.moveSortLevel(offset);
                    sortManager.commitSort();
                    // show current filter state
                    this.updateEditor();
                    // raise event so caller can close the editor and apply the new filter
                    this.onButtonClicked();
                };
                // Clone dom element and its child node
                _FlexSheetColumnFilterEditor.prototype.cloneElement = function (element) {
                    var cloneEle = element.cloneNode();
                    while (element.firstChild) {
                        cloneEle.appendChild(element.lastChild);
                    }
                    return cloneEle;
                };
                return _FlexSheetColumnFilterEditor;
            }(wijmo.grid.filter.ColumnFilterEditor));
            sheet._FlexSheetColumnFilterEditor = _FlexSheetColumnFilterEditor;
        })(sheet = grid.sheet || (grid.sheet = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_FlexSheetColumnFilterEditor.js.map