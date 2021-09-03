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
        (function (sheet_1) {
            'use strict';
            /*
             * Defines the base class that represents parsed expressions.
             */
            var _Expression = (function () {
                /*
                 * Initializes a new instance of the @see:Expression class.
                 *
                 * @param arg This parameter is used to build the token for the expression.
                 */
                function _Expression(arg) {
                    if (arg) {
                        if (arg instanceof sheet_1._Token) {
                            this._token = arg;
                        }
                        else {
                            this._token = new sheet_1._Token(arg, sheet_1._TokenID.ATOM, sheet_1._TokenType.LITERAL);
                        }
                    }
                    else {
                        this._token = new sheet_1._Token(null, sheet_1._TokenID.ATOM, sheet_1._TokenType.IDENTIFIER);
                    }
                }
                Object.defineProperty(_Expression.prototype, "token", {
                    /*
                     * Gets the token of the expression.
                     */
                    get: function () {
                        return this._token;
                    },
                    enumerable: true,
                    configurable: true
                });
                /*
                 * Evaluates the expression.
                 *
                 * @param sheet The @see:Sheet is referenced by the @see:Expression.
                 * @param rowIndex The row index of the cell where the expression located in.
                 * @param columnIndex The column index of the cell where the expression located in.
                 */
                _Expression.prototype.evaluate = function (sheet, rowIndex, columnIndex) {
                    if (this._token.tokenType !== sheet_1._TokenType.LITERAL) {
                        throw 'Bad expression.';
                    }
                    return this._token.value;
                };
                /*
                 * Parse the expression to a string value.
                 *
                 * @param x The @see:Expression need be parsed to string value.
                 * @param sheet The @see:Sheet is referenced by the @see:Expression.
                 */
                _Expression.toString = function (x, sheet) {
                    var v = x.evaluate(sheet);
                    if (!wijmo.isPrimitive(v)) {
                        v = v.value;
                    }
                    return v != null ? v.toString() : '';
                };
                /*
                 * Parse the expression to a number value.
                 *
                 * @param x The @see:Expression need be parsed to number value.
                 * @param sheet The @see:Sheet is referenced by the @see:Expression.
                 */
                _Expression.toNumber = function (x, sheet) {
                    // evaluate
                    var v = x.evaluate(sheet);
                    if (!wijmo.isPrimitive(v)) {
                        v = v.value;
                    }
                    // handle numbers
                    if (wijmo.isNumber(v)) {
                        return v;
                    }
                    // handle booleans
                    if (wijmo.isBoolean(v)) {
                        return v ? 1 : 0;
                    }
                    // handle dates
                    if (wijmo.isDate(v)) {
                        return this._toOADate(v);
                    }
                    // handle strings
                    if (wijmo.isString(v)) {
                        if (v) {
                            return +v;
                        }
                        else {
                            return 0;
                        }
                    }
                    // handle everything else
                    return wijmo.changeType(v, wijmo.DataType.Number, '');
                };
                /*
                 * Parse the expression to a boolean value.
                 *
                 * @param x The @see:Expression need be parsed to boolean value.
                 * @param sheet The @see:Sheet is referenced by the @see:Expression.
                 */
                _Expression.toBoolean = function (x, sheet) {
                    // evaluate
                    var v = x.evaluate(sheet);
                    if (!wijmo.isPrimitive(v)) {
                        v = v.value;
                    }
                    // handle booleans
                    if (wijmo.isBoolean(v)) {
                        return v;
                    }
                    // handle numbers
                    if (wijmo.isNumber(v)) {
                        return v === 0 ? false : true;
                    }
                    // handle everything else
                    return wijmo.changeType(v, wijmo.DataType.Boolean, '');
                };
                /*
                 * Parse the expression to a date value.
                 *
                 * @param x The @see:Expression need be parsed to date value.
                 * @param sheet The @see:Sheet is referenced by the @see:Expression.
                 */
                _Expression.toDate = function (x, sheet) {
                    // evaluate
                    var v = x.evaluate(sheet);
                    if (!wijmo.isPrimitive(v)) {
                        v = v.value;
                    }
                    // handle dates
                    if (wijmo.isDate(v)) {
                        return v;
                    }
                    // handle numbers
                    if (wijmo.isNumber(v)) {
                        return this._fromOADate(v);
                    }
                    // handle everything else
                    return wijmo.changeType(v, wijmo.DataType.Date, '');
                };
                // convert the common date to OLE Automation date.
                _Expression._toOADate = function (val) {
                    var epoch = Date.UTC(1899, 11, 30), // 1899-12-30T00:00:00
                    currentUTC = Date.UTC(val.getFullYear(), val.getMonth(), val.getDate(), val.getHours(), val.getMinutes(), val.getSeconds(), val.getMilliseconds());
                    return (currentUTC - epoch) / 8.64e7;
                };
                // convert the OLE Automation date to common date.
                _Expression._fromOADate = function (oADate) {
                    var epoch = Date.UTC(1899, 11, 30);
                    return new Date(oADate * 8.64e7 + epoch);
                };
                return _Expression;
            }());
            sheet_1._Expression = _Expression;
            /*
             * Defines the unary expression class.
             * For e.g. -1.23.
             */
            var _UnaryExpression = (function (_super) {
                __extends(_UnaryExpression, _super);
                /*
                 * Initializes a new instance of the @see:UnaryExpression class.
                 *
                 * @param arg This parameter is used to build the token for the expression.
                 * @param expr The @see:Expression instance for evaluating the UnaryExpression.
                 */
                function _UnaryExpression(arg, expr) {
                    _super.call(this, arg);
                    this._expr = expr;
                }
                /*
                 * Overrides the evaluate function of base class.
                 *
                 * @param sheet The @see:Sheet is referenced by the @see:Expression.
                 */
                _UnaryExpression.prototype.evaluate = function (sheet) {
                    if (this.token.tokenID === sheet_1._TokenID.SUB) {
                        if (this._evaluatedValue == null) {
                            this._evaluatedValue = -_Expression.toNumber(this._expr, sheet);
                        }
                        return this._evaluatedValue;
                    }
                    if (this.token.tokenID === sheet_1._TokenID.ADD) {
                        if (this._evaluatedValue == null) {
                            this._evaluatedValue = +_Expression.toNumber(this._expr, sheet);
                        }
                        return this._evaluatedValue;
                    }
                    throw 'Bad expression.';
                };
                return _UnaryExpression;
            }(_Expression));
            sheet_1._UnaryExpression = _UnaryExpression;
            /*
             * Defines the binary expression class.
             * For e.g. 1 + 1.
             */
            var _BinaryExpression = (function (_super) {
                __extends(_BinaryExpression, _super);
                /*
                 * Initializes a new instance of the @see:BinaryExpression class.
                 *
                 * @param arg This parameter is used to build the token for the expression.
                 * @param leftExpr The @see:Expression instance for evaluating the BinaryExpression.
                 * @param rightExpr The @see:Expression instance for evaluating the BinaryExpression.
                 */
                function _BinaryExpression(arg, leftExpr, rightExpr) {
                    _super.call(this, arg);
                    this._leftExpr = leftExpr;
                    this._rightExpr = rightExpr;
                }
                /*
                 * Overrides the evaluate function of base class.
                 *
                 * @param sheet The @see:Sheet is referenced by the @see:Expression.
                 */
                _BinaryExpression.prototype.evaluate = function (sheet) {
                    var strLeftVal, strRightVal, leftValue, rightValue, compareVal;
                    if (this._evaluatedValue != null) {
                        return this._evaluatedValue;
                    }
                    strLeftVal = _Expression.toString(this._leftExpr, sheet);
                    strRightVal = _Expression.toString(this._rightExpr, sheet);
                    if (this.token.tokenType === sheet_1._TokenType.CONCAT) {
                        this._evaluatedValue = strLeftVal + strRightVal;
                        return this._evaluatedValue;
                    }
                    leftValue = _Expression.toNumber(this._leftExpr, sheet);
                    rightValue = _Expression.toNumber(this._rightExpr, sheet);
                    compareVal = leftValue - rightValue;
                    // handle comparisons
                    if (this.token.tokenType === sheet_1._TokenType.COMPARE) {
                        switch (this.token.tokenID) {
                            case sheet_1._TokenID.GT: return compareVal > 0;
                            case sheet_1._TokenID.LT: return compareVal < 0;
                            case sheet_1._TokenID.GE: return compareVal >= 0;
                            case sheet_1._TokenID.LE: return compareVal <= 0;
                            case sheet_1._TokenID.EQ:
                                if (isNaN(compareVal)) {
                                    this._evaluatedValue = strLeftVal.toLowerCase() === strRightVal.toLowerCase();
                                    return this._evaluatedValue;
                                }
                                else {
                                    this._evaluatedValue = compareVal === 0;
                                    return this._evaluatedValue;
                                }
                            case sheet_1._TokenID.NE:
                                if (isNaN(compareVal)) {
                                    this._evaluatedValue = strLeftVal.toLowerCase() !== strRightVal.toLowerCase();
                                    return this._evaluatedValue;
                                }
                                else {
                                    this._evaluatedValue = compareVal !== 0;
                                    return this._evaluatedValue;
                                }
                        }
                    }
                    // handle everything else
                    switch (this.token.tokenID) {
                        case sheet_1._TokenID.ADD:
                            this._evaluatedValue = leftValue + rightValue;
                            break;
                        case sheet_1._TokenID.SUB:
                            this._evaluatedValue = leftValue - rightValue;
                            break;
                        case sheet_1._TokenID.MUL:
                            this._evaluatedValue = leftValue * rightValue;
                            break;
                        case sheet_1._TokenID.DIV:
                            this._evaluatedValue = leftValue / rightValue;
                            break;
                        case sheet_1._TokenID.DIVINT:
                            this._evaluatedValue = Math.floor(leftValue / rightValue);
                            break;
                        case sheet_1._TokenID.MOD:
                            this._evaluatedValue = Math.floor(leftValue % rightValue);
                            break;
                        case sheet_1._TokenID.POWER:
                            if (rightValue === 0.0) {
                                this._evaluatedValue = 1.0;
                            }
                            if (rightValue === 0.5) {
                                this._evaluatedValue = Math.sqrt(leftValue);
                            }
                            if (rightValue === 1.0) {
                                this._evaluatedValue = leftValue;
                            }
                            if (rightValue === 2.0) {
                                this._evaluatedValue = leftValue * leftValue;
                            }
                            if (rightValue === 3.0) {
                                this._evaluatedValue = leftValue * leftValue * leftValue;
                            }
                            if (rightValue === 4.0) {
                                this._evaluatedValue = leftValue * leftValue * leftValue * leftValue;
                            }
                            this._evaluatedValue = Math.pow(leftValue, rightValue);
                            break;
                        default:
                            this._evaluatedValue = NaN;
                            break;
                    }
                    if (!isNaN(this._evaluatedValue)) {
                        return this._evaluatedValue;
                    }
                    throw 'Bad expression.';
                };
                return _BinaryExpression;
            }(_Expression));
            sheet_1._BinaryExpression = _BinaryExpression;
            /*
             * Defines the cell range expression class.
             * For e.g. A1 or A1:B2.
             */
            var _CellRangeExpression = (function (_super) {
                __extends(_CellRangeExpression, _super);
                /*
                 * Initializes a new instance of the @see:CellRangeExpression class.
                 *
                 * @param cells The @see:CellRange instance represents the cell range for the CellRangeExpression.
                 * @param sheetRef The sheet name of the sheet which the cells range refers.
                 * @param flex The @see:FlexSheet instance for evaluating the value for the CellRangeExpression.
                 */
                function _CellRangeExpression(cells, sheetRef, flex) {
                    _super.call(this);
                    this._cells = cells;
                    this._sheetRef = sheetRef;
                    this._flex = flex;
                    this._evalutingRange = {};
                }
                /*
                 * Overrides the evaluate function of base class.
                 *
                 * @param sheet The @see:Sheet is referenced by the @see:Expression.
                 */
                _CellRangeExpression.prototype.evaluate = function (sheet) {
                    if (this._evaluatedValue == null) {
                        this._evaluatedValue = this._getCellValue(this._cells, sheet);
                    }
                    return this._evaluatedValue;
                };
                /*
                 * Gets the value list for each cell inside the cell range.
                 *
                 * @param isGetHiddenValue indicates whether get the cell value of the hidden row or hidden column.
                 * @param columnIndex indicates which column of the cell range need be get.
                 * @param sheet The @see:Sheet whose value to evaluate. If not specified then the data from current sheet
                 */
                _CellRangeExpression.prototype.getValues = function (isGetHiddenValue, columnIndex, sheet) {
                    if (isGetHiddenValue === void 0) { isGetHiddenValue = true; }
                    var cellValue, vals = [], valIndex = 0, rowIndex, columnIndex, startColumnIndex, endColumnIndex;
                    startColumnIndex = columnIndex != null && !isNaN(+columnIndex) ? columnIndex : this._cells.leftCol;
                    endColumnIndex = columnIndex != null && !isNaN(+columnIndex) ? columnIndex : this._cells.rightCol;
                    sheet = this._getSheet() || sheet || this._flex.selectedSheet;
                    if (!sheet) {
                        return null;
                    }
                    for (rowIndex = this._cells.topRow; rowIndex <= this._cells.bottomRow; rowIndex++) {
                        if (rowIndex >= sheet.grid.rows.length) {
                            throw 'The cell reference is out of the cell range of the flexsheet.';
                        }
                        if (!isGetHiddenValue && sheet.grid.rows[rowIndex].isVisible === false) {
                            continue;
                        }
                        for (columnIndex = startColumnIndex; columnIndex <= endColumnIndex; columnIndex++) {
                            if (columnIndex >= sheet.grid.columns.length) {
                                throw 'The cell reference is out of the cell range of the flexsheet.';
                            }
                            if (!isGetHiddenValue && sheet.grid.columns[columnIndex].isVisible === false) {
                                continue;
                            }
                            cellValue = this._getCellValue(new grid.CellRange(rowIndex, columnIndex), sheet);
                            if (!wijmo.isPrimitive(cellValue)) {
                                cellValue = cellValue.value;
                            }
                            vals[valIndex] = cellValue;
                            valIndex++;
                        }
                    }
                    return vals;
                };
                Object.defineProperty(_CellRangeExpression.prototype, "cells", {
                    /*
                     * Gets the cell range of the CellRangeExpression.
                     */
                    get: function () {
                        return this._cells;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_CellRangeExpression.prototype, "sheetRef", {
                    /*
                     * Gets the sheet reference of the CellRangeExpression.
                     */
                    get: function () {
                        return this._sheetRef;
                    },
                    enumerable: true,
                    configurable: true
                });
                // Get cell value for a cell.
                _CellRangeExpression.prototype._getCellValue = function (cell, sheet) {
                    var sheet, cellKey;
                    sheet = this._getSheet() || sheet || this._flex.selectedSheet;
                    if (!sheet) {
                        return null;
                    }
                    cellKey = sheet.name + ':' + cell.row + ',' + cell.col + '-' + cell.row2 + ',' + cell.col2;
                    if (this._evalutingRange[cellKey]) {
                        throw 'Circular Reference';
                    }
                    try {
                        if (this._flex) {
                            this._evalutingRange[cellKey] = true;
                            return this._flex.getCellValue(cell.row, cell.col, false, sheet);
                        }
                    }
                    finally {
                        delete this._evalutingRange[cellKey];
                    }
                };
                // Gets the sheet by the sheetRef.
                _CellRangeExpression.prototype._getSheet = function () {
                    var i = 0, sheet;
                    if (!this._sheetRef) {
                        return null;
                    }
                    for (; i < this._flex.sheets.length; i++) {
                        sheet = this._flex.sheets[i];
                        if (sheet.name === this._sheetRef) {
                            return sheet;
                        }
                    }
                    throw 'Invalid sheet reference';
                };
                return _CellRangeExpression;
            }(_Expression));
            sheet_1._CellRangeExpression = _CellRangeExpression;
            /*
             * Defines the function expression class.
             * For e.g. sum(1,2,3).
             */
            var _FunctionExpression = (function (_super) {
                __extends(_FunctionExpression, _super);
                /*
                 * Initializes a new instance of the @see:FunctionExpression class.
                 *
                 * @param func The @see:FunctionDefinition instance keeps function name, parameter counts, and function.
                 * @param params The parameter list that the function of the @see:FunctionDefinition instance needs.
                 */
                function _FunctionExpression(func, params) {
                    _super.call(this);
                    this._funcDefinition = func;
                    this._params = params;
                }
                /*
                 * Overrides the evaluate function of base class.
                 *
                 * @param sheet The @see:Sheet is referenced by the @see:Expression.
                 * @param rowIndex The row index of the cell where the expression located in.
                 * @param columnIndex The column index of the cell where the expression located in.
                 */
                _FunctionExpression.prototype.evaluate = function (sheet, rowIndex, columnIndex) {
                    if (this._evaluatedValue == null) {
                        this._evaluatedValue = this._funcDefinition.func(this._params, sheet, rowIndex, columnIndex);
                    }
                    return this._evaluatedValue;
                };
                return _FunctionExpression;
            }(_Expression));
            sheet_1._FunctionExpression = _FunctionExpression;
        })(sheet = grid.sheet || (grid.sheet = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_Expression.js.map