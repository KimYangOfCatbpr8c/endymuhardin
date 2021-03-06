"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var wjcCore = require('wijmo/wijmo');
'use strict';
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var router_1 = require('@angular/router');
var wijmo_angular2_input_1 = require('wijmo/wijmo.angular2.input');
var wijmo_angular2_grid_sheet_1 = require('wijmo/wijmo.angular2.grid.sheet');
var FormatCellsCmp = (function () {
    function FormatCellsCmp() {
        this.selection = {
            content: '',
            position: '',
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: '8px'
        };
        this._updatingSelection = false;
        this._applyFillColor = false;
        this._format = '';
        this.fonts = [{ name: 'Arial', value: 'Arial, Helvetica, sans-serif' },
            { name: 'Arial Black', value: '"Arial Black", Gadget, sans-serif' },
            { name: 'Comic Sans MS', value: '"Comic Sans MS", cursive, sans-serif' },
            { name: 'Courier New', value: '"Courier New", Courier, monospace' },
            { name: 'Georgia', value: 'Georgia, serif' },
            { name: 'Impact', value: 'Impact, Charcoal, sans-serif' },
            { name: 'Lucida Console', value: '"Lucida Console", Monaco, monospace' },
            { name: 'Lucida Sans Unicode', value: '"Lucida Sans Unicode", "Lucida Grande", sans-serif' },
            { name: 'Palatino Linotype', value: '"Palatino Linotype", "Book Antiqua", Palatino, serif' },
            { name: 'Tahoma', value: 'Tahoma, Geneva, sans-serif' },
            { name: 'Segoe UI', value: '"Segoe UI", "Roboto", sans-serif' },
            { name: 'Times New Roman', value: '"Times New Roman", Times, serif' },
            { name: 'Trebuchet MS', value: '"Trebuchet MS", Helvetica, sans-serif' },
            { name: 'Verdana', value: 'Verdana, Geneva, sans-serif' }];
        this.fontSizeList = [{ name: '8', value: '8px' }, { name: '9', value: '9px' }, { name: '10', value: '10px' },
            { name: '11', value: '11px' }, { name: '12', value: '12px' }, { name: '14', value: '14px' },
            { name: '16', value: '16px' }, { name: '18', value: '18px' }, { name: '20', value: '20px' },
            { name: '22', value: '22px' }, { name: '24', value: '24px' }];
        this.selectionFormatState = {};
    }
    Object.defineProperty(FormatCellsCmp.prototype, "format", {
        // Gets or sets _format for the formatSheet.
        get: function () {
            return this._format;
        },
        set: function (value) {
            if (this._format !== value) {
                this._format = value;
                if (!this._updatingSelection) {
                    this.flexSheet.applyCellsStyle({ format: this._format });
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    FormatCellsCmp.prototype.flexSheetInit = function (flexSheet) {
        var self = this;
        if (flexSheet) {
            flexSheet.deferUpdate(function () {
                var sheetIdx, sheetName, colIdx, rowIdx, date;
                for (sheetIdx = 0; sheetIdx < flexSheet.sheets.length; sheetIdx++) {
                    flexSheet.selectedSheetIndex = sheetIdx;
                    sheetName = flexSheet.selectedSheet.name;
                    for (colIdx = 0; colIdx < flexSheet.columns.length; colIdx++) {
                        for (rowIdx = 0; rowIdx < flexSheet.rows.length; rowIdx++) {
                            if (sheetName === 'Number') {
                                flexSheet.setCellData(rowIdx, colIdx, colIdx + rowIdx);
                            }
                            else {
                                date = new Date(2015, colIdx, rowIdx + 1);
                                flexSheet.setCellData(rowIdx, colIdx, date);
                            }
                        }
                    }
                }
                flexSheet.selectedSheetIndex = 0;
                self._updateSelection(flexSheet.selection);
            });
            flexSheet.selectionChanged.addHandler(function (sender, args) {
                self._updateSelection(args.range);
                self.selectionFormatState = flexSheet.getSelectionFormatState();
            });
            flexSheet.cellEditEnded.addHandler(function (sender, args) {
                self._updateSelection(args.range);
            });
            flexSheet.undoStack.undoStackChanged.addHandler(function () {
                self._updateSelection(flexSheet.selection);
            });
        }
    };
    FormatCellsCmp.prototype.cboFontNameInit = function (cboFontName) {
        var self = this;
        if (cboFontName) {
            cboFontName.selectedIndexChanged.addHandler(function () {
                // apply the font family for the selected cells
                if (!self._updatingSelection) {
                    self.flexSheet.applyCellsStyle({ fontFamily: cboFontName.selectedItem.value });
                }
            });
        }
    };
    FormatCellsCmp.prototype.cboFontSizeInit = function (cboFontSize) {
        var self = this;
        if (cboFontSize) {
            cboFontSize.selectedIndexChanged.addHandler(function () {
                // apply the font size for the selected cells
                if (!self._updatingSelection) {
                    self.flexSheet.applyCellsStyle({ fontSize: cboFontSize.selectedItem.value });
                }
            });
        }
    };
    FormatCellsCmp.prototype.colorPickerInit = function (colorPicker) {
        var self = this, ua = window.navigator.userAgent, blurEvt;
        if (colorPicker) {
            // if the browser is firefox, we should bind the blur event. (TFS #124387)
            // if the browser is IE, we should bind the focusout event. (TFS #124500)
            blurEvt = /firefox/i.test(ua) ? 'blur' : 'focusout';
            // Hide the color picker control when it lost the focus.
            colorPicker.hostElement.addEventListener(blurEvt, function () {
                setTimeout(function () {
                    if (!colorPicker.containsFocus()) {
                        self._applyFillColor = false;
                        colorPicker.hostElement.style.display = 'none';
                    }
                }, 0);
            });
            // Initialize the value changed event handler for the color picker control.
            colorPicker.valueChanged.addHandler(function () {
                if (self._applyFillColor) {
                    self.flexSheet.applyCellsStyle({ backgroundColor: colorPicker.value });
                }
                else {
                    self.flexSheet.applyCellsStyle({ color: colorPicker.value });
                }
            });
        }
    };
    // apply the text alignment for the selected cells
    FormatCellsCmp.prototype.applyCellTextAlign = function (textAlign) {
        if (this.flexSheet) {
            this.flexSheet.applyCellsStyle({ textAlign: textAlign });
            this.selectionFormatState.textAlign = textAlign;
        }
    };
    // apply the bold font weight for the selected cells
    FormatCellsCmp.prototype.applyBoldStyle = function () {
        if (this.flexSheet) {
            this.flexSheet.applyCellsStyle({ fontWeight: this.selectionFormatState.isBold ? 'none' : 'bold' });
            this.selectionFormatState.isBold = !this.selectionFormatState.isBold;
        }
    };
    // apply the underline text decoration for the selected cells
    FormatCellsCmp.prototype.applyUnderlineStyle = function () {
        if (this.flexSheet) {
            this.flexSheet.applyCellsStyle({ textDecoration: this.selectionFormatState.isUnderline ? 'none' : 'underline' });
            this.selectionFormatState.isUnderline = !this.selectionFormatState.isUnderline;
        }
    };
    // apply the italic font style for the selected cells
    FormatCellsCmp.prototype.applyItalicStyle = function () {
        if (this.flexSheet) {
            this.flexSheet.applyCellsStyle({ fontStyle: this.selectionFormatState.isItalic ? 'none' : 'italic' });
            this.selectionFormatState.isItalic = !this.selectionFormatState.isItalic;
        }
    };
    // show the color picker control.
    FormatCellsCmp.prototype.showColorPicker = function (e, isFillColor) {
        var offset = this._cumulativeOffset(e.target);
        if (this.colorPicker) {
            this.colorPicker.hostElement.style.display = 'inline';
            this.colorPicker.hostElement.style.left = offset.left + 'px';
            this.colorPicker.hostElement.style.top = (offset.top + e.target.clientHeight + 2) + 'px';
            this.colorPicker.hostElement.focus();
        }
        this._applyFillColor = isFillColor;
    };
    // Update the selection object of the scope.
    FormatCellsCmp.prototype._updateSelection = function (sel) {
        var flexSheet = this.flexSheet, row = flexSheet.rows[sel.row], rowCnt = flexSheet.rows.length, colCnt = flexSheet.columns.length, r, c, cellStyle, cellContent, cellFormat;
        this._updatingSelection = true;
        if (sel.row > -1 && sel.col > -1 && rowCnt > 0 && colCnt > 0
            && sel.col < colCnt && sel.col2 < colCnt
            && sel.row < rowCnt && sel.row2 < rowCnt) {
            r = sel.row >= rowCnt ? rowCnt - 1 : sel.row;
            c = sel.col >= colCnt ? colCnt - 1 : sel.col;
            cellContent = flexSheet.getCellData(sel.row, sel.col, false);
            cellStyle = flexSheet.selectedSheet.getCellStyle(sel.row, sel.col);
            if (cellStyle) {
                this.cboFontName.selectedIndex = this._checkFontfamily(cellStyle.fontFamily);
                this.cboFontSize.selectedIndex = this._checkFontSize(cellStyle.fontSize);
                cellFormat = cellStyle.format;
            }
            else {
                this.cboFontName.selectedIndex = 0;
                this.cboFontSize.selectedIndex = 5;
            }
            if (!!cellFormat) {
                this.format = cellFormat;
            }
            else {
                if (wjcCore.isInt(cellContent)) {
                    this.format = '0';
                }
                else if (wjcCore.isNumber(cellContent)) {
                    this.format = 'n2';
                }
                else if (wjcCore.isDate(cellContent)) {
                    this.format = 'd';
                }
            }
        }
        this._updatingSelection = false;
    };
    // check font family for the font name combobox of the ribbon.
    FormatCellsCmp.prototype._checkFontfamily = function (fontFamily) {
        var fonts = this.fonts, fontIndex = 0, font;
        if (!fontFamily) {
            return fontIndex;
        }
        for (; fontIndex < fonts.length; fontIndex++) {
            font = fonts[fontIndex];
            if (font.name === fontFamily || font.value === fontFamily) {
                return fontIndex;
            }
        }
        return 10;
    };
    // check font size for the font size combobox of the ribbon.
    FormatCellsCmp.prototype._checkFontSize = function (fontSize) {
        var sizeList = this.fontSizeList, index = 0, size;
        if (fontSize == undefined) {
            return 5;
        }
        for (; index < sizeList.length; index++) {
            size = sizeList[index];
            if (size.value === fontSize || size.name === fontSize) {
                return index;
            }
        }
        return 5;
    };
    // Get the absolute position of the dom element.
    FormatCellsCmp.prototype._cumulativeOffset = function (element) {
        var top = 0, left = 0, scrollTop = 0, scrollLeft = 0;
        do {
            top += element.offsetTop || 0;
            left += element.offsetLeft || 0;
            scrollTop += element.scrollTop || 0;
            scrollLeft += element.scrollLeft || 0;
            element = element.offsetParent;
        } while (element && !(element instanceof HTMLBodyElement));
        scrollTop += document.body.scrollTop || document.documentElement.scrollTop;
        scrollLeft += document.body.scrollLeft || document.documentElement.scrollLeft;
        return {
            top: top - scrollTop,
            left: left - scrollLeft
        };
    };
    __decorate([
        core_1.ViewChild('flexSheet')
    ], FormatCellsCmp.prototype, "flexSheet", void 0);
    __decorate([
        core_1.ViewChild('cboFontName')
    ], FormatCellsCmp.prototype, "cboFontName", void 0);
    __decorate([
        core_1.ViewChild('cboFontSize')
    ], FormatCellsCmp.prototype, "cboFontSize", void 0);
    __decorate([
        core_1.ViewChild('colorPicker')
    ], FormatCellsCmp.prototype, "colorPicker", void 0);
    FormatCellsCmp = __decorate([
        core_1.Component({
            selector: 'format-cells-cmp',
            templateUrl: 'src/components/formatCellsCmp.html',
        })
    ], FormatCellsCmp);
    return FormatCellsCmp;
}());
exports.FormatCellsCmp = FormatCellsCmp;
var routing = router_1.RouterModule.forChild([
    { path: '', component: FormatCellsCmp }
]);
var FormatCellsModule = (function () {
    function FormatCellsModule() {
    }
    FormatCellsModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, routing, wijmo_angular2_grid_sheet_1.WjGridSheetModule, wijmo_angular2_input_1.WjInputModule],
            declarations: [FormatCellsCmp],
        })
    ], FormatCellsModule);
    return FormatCellsModule;
}());
exports.FormatCellsModule = FormatCellsModule;
//# sourceMappingURL=FormatCellsCmp.js.map