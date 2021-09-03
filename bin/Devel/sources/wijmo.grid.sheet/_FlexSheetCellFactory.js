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
             * Defines the _FlexSheetCellFactory class.
             *
             * This class extends the CellFactory of FlexGrid control.
             * It updates the content of the row/column header for the FlexSheet control.
             */
            var _FlexSheetCellFactory = (function (_super) {
                __extends(_FlexSheetCellFactory, _super);
                function _FlexSheetCellFactory() {
                    _super.apply(this, arguments);
                }
                /*
                 * Overrides the updateCell function of the CellFactory class.
                 *
                 * @param panel Part of the grid that owns this cell.
                 * @param r Index of this cell's row.
                 * @param c Index of this cell's column.
                 * @param cell Element that represents the cell.
                 * @param rng @see:CellRange that contains the cell's merged range, or null if the cell is not merged.
                 */
                _FlexSheetCellFactory.prototype.updateCell = function (panel, r, c, cell, rng) {
                    var g = panel.grid, r2 = r, c2 = c, content, cellIndex, flex, fc, val, styleInfo, checkBox;
                    // We shall reset the styles of current cell before updating current cell.
                    if (panel.cellType === wijmo.grid.CellType.Cell) {
                        this._resetCellStyle(panel.columns[c], cell);
                    }
                    _super.prototype.updateCell.call(this, panel, r, c, cell, rng);
                    // adjust for merged ranges
                    if (rng && !rng.isSingleCell) {
                        r = rng.row;
                        c = rng.col;
                        r2 = rng.row2;
                        c2 = rng.col2;
                    }
                    switch (panel.cellType) {
                        case wijmo.grid.CellType.RowHeader:
                            cell.textContent = (r + 1) + '';
                            break;
                        case wijmo.grid.CellType.ColumnHeader:
                            content = sheet.FlexSheet.convertNumberToAlpha(c);
                            cell.innerHTML = cell.innerHTML.replace(cell.textContent, '') + content;
                            cell.style.textAlign = 'center';
                            break;
                        case wijmo.grid.CellType.Cell:
                            flex = panel.grid;
                            cellIndex = r * flex.columns.length + c;
                            styleInfo = flex.selectedSheet && flex.selectedSheet._styledCells ? flex.selectedSheet._styledCells[cellIndex] : null;
                            //process the header row with binding
                            if (panel.rows[r] instanceof sheet.HeaderRow) {
                                cell.innerHTML = wijmo.escapeHtml(panel.columns[c].header);
                                wijmo.addClass(cell, 'wj-header-row');
                            }
                            else {
                                if (!(flex.editRange && flex.editRange.contains(r, c))) {
                                    if (panel.columns[c].dataType === wijmo.DataType.Boolean) {
                                        checkBox = cell.querySelector('[type="checkbox"]');
                                        if (checkBox) {
                                            checkBox.checked = flex.getCellValue(r, c);
                                        }
                                    }
                                    else {
                                        fc = cell.firstChild;
                                        val = flex.getCellValue(r, c, true);
                                        if (fc && fc.nodeType === 3 && fc.nodeValue !== val) {
                                            fc.nodeValue = val;
                                        }
                                    }
                                }
                                if (styleInfo) {
                                    var st = cell.style, styleInfoVal;
                                    for (var styleProp in styleInfo) {
                                        if (styleProp === 'className') {
                                            if (styleInfo.className) {
                                                wijmo.addClass(cell, styleInfo.className + '-style');
                                            }
                                        }
                                        else if (styleProp !== 'format' && (styleInfoVal = styleInfo[styleProp])) {
                                            if ((wijmo.hasClass(cell, 'wj-state-selected') || wijmo.hasClass(cell, 'wj-state-multi-selected'))
                                                && (styleProp === 'color' || styleProp === 'backgroundColor')) {
                                                st[styleProp] = '';
                                            }
                                            else {
                                                st[styleProp] = styleInfoVal;
                                            }
                                        }
                                    }
                                }
                            }
                            // customize the cell
                            if (g.itemFormatter) {
                                g.itemFormatter(panel, r, c, cell);
                            }
                            if (g.formatItem.hasHandlers) {
                                var rng = grid.CellFactory._fmtRng;
                                if (!rng) {
                                    rng = grid.CellFactory._fmtRng = new grid.CellRange(r, c, r2, c2);
                                }
                                else {
                                    rng.setRange(r, c, r2, c2);
                                }
                                var e = new grid.FormatItemEventArgs(panel, rng, cell);
                                g.onFormatItem(e);
                            }
                            if (!!cell.style.backgroundColor || !!cell.style.color) {
                                if (!styleInfo) {
                                    flex.selectedSheet._styledCells[cellIndex] = styleInfo = {};
                                }
                                if (!!cell.style.backgroundColor) {
                                    styleInfo.backgroundColor = cell.style.backgroundColor;
                                }
                                if (!!cell.style.color) {
                                    styleInfo.color = cell.style.color;
                                }
                            }
                            break;
                    }
                };
                // Reset the styles of the cell.
                _FlexSheetCellFactory.prototype._resetCellStyle = function (column, cell) {
                    ['fontFamily', 'fontSize', 'fontStyle', 'fontWeight', 'textDecoration', 'textAlign', 'verticalAlign', 'backgroundColor', 'color'].forEach(function (val) {
                        if (val === 'textAlign') {
                            cell.style.textAlign = column.getAlignment();
                        }
                        else {
                            cell.style[val] = '';
                        }
                    });
                };
                return _FlexSheetCellFactory;
            }(grid.CellFactory));
            sheet._FlexSheetCellFactory = _FlexSheetCellFactory;
        })(sheet = grid.sheet || (grid.sheet = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_FlexSheetCellFactory.js.map