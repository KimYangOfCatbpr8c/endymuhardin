module wijmo.grid.sheet {
	'use strict';

	/*
	 * Defines the base class that represents parsed expressions.
	 */
	export class _Expression {
		private _token: _Token;
		_evaluatedValue: any;

		/*
		 * Initializes a new instance of the @see:Expression class.
		 *
		 * @param arg This parameter is used to build the token for the expression.
		 */
		constructor(arg?: any) {
			if (arg) {
				if (arg instanceof _Token) {
					this._token = arg;
				} else {
					this._token = new _Token(arg, _TokenID.ATOM, _TokenType.LITERAL);
				}
			} else {
				this._token = new _Token(null, _TokenID.ATOM, _TokenType.IDENTIFIER);
			}
		}

		/*
		 * Gets the token of the expression.
		 */
		get token(): _Token {
			return this._token;
		}

		/*
		 * Evaluates the expression.
		 *
		 * @param sheet The @see:Sheet is referenced by the @see:Expression.
		 * @param rowIndex The row index of the cell where the expression located in.
		 * @param columnIndex The column index of the cell where the expression located in.
		 */
		evaluate(sheet?: Sheet, rowIndex?: number, columnIndex?: number): any {
			if (this._token.tokenType !== _TokenType.LITERAL) {
				throw 'Bad expression.';
			}
			return this._token.value;
		}

		/*
		 * Parse the expression to a string value.
		 *
		 * @param x The @see:Expression need be parsed to string value.
		 * @param sheet The @see:Sheet is referenced by the @see:Expression.
		 */
		static toString(x: _Expression, sheet?: Sheet): string {
			var v = x.evaluate(sheet);

			if (!isPrimitive(v)) {
				v = v.value;
			}

			return v != null ? v.toString() : '';
		 }

		/*
		 * Parse the expression to a number value.
		 *
		 * @param x The @see:Expression need be parsed to number value.
		 * @param sheet The @see:Sheet is referenced by the @see:Expression.
		 */
		static toNumber(x: _Expression, sheet?: Sheet): number {
			// evaluate
			var v = x.evaluate(sheet);

			if (!isPrimitive(v)) {
				v = v.value;
			}

			// handle numbers
			if (isNumber(v)) {
				return v;
			}

			// handle booleans
			if (isBoolean(v)) {
				return v ? 1 : 0;
			}

			// handle dates
			if (isDate(v)) {
				return this._toOADate(v);
			}

			// handle strings
			if (isString(v)) {
				if (v) {
					return +v;
				} else {
					return 0;
				}
			}
			// handle everything else
			return changeType(v, DataType.Number, '');
		}

		/*
		 * Parse the expression to a boolean value.
		 *
		 * @param x The @see:Expression need be parsed to boolean value.
		 * @param sheet The @see:Sheet is referenced by the @see:Expression.
		 */
		static toBoolean(x: _Expression, sheet?: Sheet) {
			// evaluate
			var v = x.evaluate(sheet);

			if (!isPrimitive(v)) {
				v = v.value;
			}

			// handle booleans
			if (isBoolean(v)) {
				return v;
			}

			// handle numbers
			if (isNumber(v)) {
				return v === 0 ? false : true;
			}

			// handle everything else
			return changeType(v, DataType.Boolean, '');
		}

		/*
		 * Parse the expression to a date value.
		 *
		 * @param x The @see:Expression need be parsed to date value.
		 * @param sheet The @see:Sheet is referenced by the @see:Expression.
		 */
		static toDate(x: _Expression, sheet?: Sheet) {
			// evaluate
			var v = x.evaluate(sheet);

			if (!isPrimitive(v)) {
				v = v.value;
			}

			// handle dates
			if (isDate(v)) {
				return v;
			}

			// handle numbers
			if (isNumber(v)) {
				return this._fromOADate(v);
			}

			// handle everything else
			return changeType(v, DataType.Date, '');
		}

		// convert the common date to OLE Automation date.
		private static _toOADate(val: Date): number {
			var epoch = Date.UTC(1899, 11, 30), // 1899-12-30T00:00:00
				currentUTC = Date.UTC(val.getFullYear(), val.getMonth(), val.getDate(),
					val.getHours(), val.getMinutes(), val.getSeconds(), val.getMilliseconds());

			return (currentUTC - epoch) / 8.64e7;
		}

		// convert the OLE Automation date to common date.
		private static _fromOADate(oADate: number): Date {
			var epoch = Date.UTC(1899, 11, 30);

			return new Date(oADate * 8.64e7 + epoch);
		}
	}

	/*
	 * Defines the unary expression class.
	 * For e.g. -1.23.
	 */
	export class _UnaryExpression extends _Expression {
		private _expr: _Expression;

		/*
		 * Initializes a new instance of the @see:UnaryExpression class.
		 *
		 * @param arg This parameter is used to build the token for the expression.
		 * @param expr The @see:Expression instance for evaluating the UnaryExpression.
		 */
		constructor(arg: any, expr: _Expression) {
			super(arg);

			this._expr = expr;
		}

		/*
		 * Overrides the evaluate function of base class.
		 *
		 * @param sheet The @see:Sheet is referenced by the @see:Expression.
		 */
		evaluate(sheet?: Sheet): any {
			if (this.token.tokenID === _TokenID.SUB) {
				if (this._evaluatedValue == null) {
					this._evaluatedValue = -_Expression.toNumber(this._expr, sheet);
				}
				return this._evaluatedValue;
			}

			if (this.token.tokenID === _TokenID.ADD) {
				if (this._evaluatedValue == null) {
					this._evaluatedValue = +_Expression.toNumber(this._expr, sheet);
				}
				return this._evaluatedValue;
			}

			throw 'Bad expression.';
		}
	}

	/*
	 * Defines the binary expression class.
	 * For e.g. 1 + 1.
	 */
	export class _BinaryExpression extends _Expression {
		private _leftExpr: _Expression;
		private _rightExpr: _Expression;

		/*
		 * Initializes a new instance of the @see:BinaryExpression class.
		 *
		 * @param arg This parameter is used to build the token for the expression.
		 * @param leftExpr The @see:Expression instance for evaluating the BinaryExpression.
		 * @param rightExpr The @see:Expression instance for evaluating the BinaryExpression.
		 */
		constructor(arg: any, leftExpr: _Expression, rightExpr: _Expression) {
			super(arg);

			this._leftExpr = leftExpr;
			this._rightExpr = rightExpr;
		}

		/*
		 * Overrides the evaluate function of base class.
		 *
		 * @param sheet The @see:Sheet is referenced by the @see:Expression.
		 */
		evaluate(sheet?: Sheet): any {
			var strLeftVal: string,
				strRightVal: string,
				leftValue: number,
				rightValue: number,
				compareVal: number;

			if (this._evaluatedValue != null) {
				return this._evaluatedValue;
			}

			strLeftVal = _Expression.toString(this._leftExpr, sheet);
			strRightVal = _Expression.toString(this._rightExpr, sheet);
			if (this.token.tokenType === _TokenType.CONCAT) {
				this._evaluatedValue = strLeftVal + strRightVal;
				return this._evaluatedValue;
			}

			leftValue = _Expression.toNumber(this._leftExpr, sheet);
			rightValue = _Expression.toNumber(this._rightExpr, sheet);
			compareVal = leftValue - rightValue;
			// handle comparisons
			if (this.token.tokenType === _TokenType.COMPARE) {
				switch (this.token.tokenID) {
					case _TokenID.GT: return compareVal > 0;
					case _TokenID.LT: return compareVal < 0;
					case _TokenID.GE: return compareVal >= 0;
					case _TokenID.LE: return compareVal <= 0;
					case _TokenID.EQ:
						if (isNaN(compareVal)) {
							this._evaluatedValue = strLeftVal.toLowerCase() === strRightVal.toLowerCase();
							return this._evaluatedValue;
						} else {
							this._evaluatedValue = compareVal === 0;
							return this._evaluatedValue;
						}
					case _TokenID.NE:
						if (isNaN(compareVal)) {
							this._evaluatedValue = strLeftVal.toLowerCase() !== strRightVal.toLowerCase();
							return this._evaluatedValue;
						} else {
							this._evaluatedValue = compareVal !== 0;
							return this._evaluatedValue;
						}
				}
			}

			// handle everything else
			switch (this.token.tokenID) {
				case _TokenID.ADD: 
					this._evaluatedValue = leftValue + rightValue;
					break;
				case _TokenID.SUB: 
					this._evaluatedValue = leftValue - rightValue;
					break;
				case _TokenID.MUL: 
					this._evaluatedValue = leftValue * rightValue;
					break;
				case _TokenID.DIV: 
					this._evaluatedValue = leftValue / rightValue;
					break;
				case _TokenID.DIVINT:
					this._evaluatedValue = Math.floor(leftValue / rightValue);
					break;
				case _TokenID.MOD:
					this._evaluatedValue = Math.floor(leftValue % rightValue);
					break;
				case _TokenID.POWER:
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
		}
	}

	/*
	 * Defines the cell range expression class.
	 * For e.g. A1 or A1:B2.
	 */
	export class _CellRangeExpression extends _Expression {
		private _cells: CellRange;
		private _sheetRef: string;
		private _flex: FlexSheet;
		private _evalutingRange: any;

		/*
		 * Initializes a new instance of the @see:CellRangeExpression class.
		 *
		 * @param cells The @see:CellRange instance represents the cell range for the CellRangeExpression.
		 * @param sheetRef The sheet name of the sheet which the cells range refers.
		 * @param flex The @see:FlexSheet instance for evaluating the value for the CellRangeExpression.
		 */
		constructor(cells: CellRange, sheetRef: string, flex: FlexSheet) {
			super();

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
		evaluate(sheet?: Sheet): any {
			if (this._evaluatedValue == null) {
				this._evaluatedValue = this._getCellValue(this._cells, sheet);
			}
			return this._evaluatedValue;
		}

		/*
		 * Gets the value list for each cell inside the cell range.
		 *
		 * @param isGetHiddenValue indicates whether get the cell value of the hidden row or hidden column.
		 * @param columnIndex indicates which column of the cell range need be get.
		 * @param sheet The @see:Sheet whose value to evaluate. If not specified then the data from current sheet 
		 */
		getValues(isGetHiddenValue: boolean = true, columnIndex?: number, sheet?: Sheet): any[] {
			var cellValue: any,
				vals: any[] = [],
				valIndex: number = 0,
				rowIndex: number,
				columnIndex: number,
				startColumnIndex: number,
				endColumnIndex: number;

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
				if (!isGetHiddenValue && (<Row>sheet.grid.rows[rowIndex]).isVisible === false) {
					continue;
				}
				for (columnIndex = startColumnIndex; columnIndex <= endColumnIndex; columnIndex++) {
					if (columnIndex >= sheet.grid.columns.length) {
						throw 'The cell reference is out of the cell range of the flexsheet.';
					}
					if (!isGetHiddenValue && (<Column>sheet.grid.columns[columnIndex]).isVisible === false) {
						continue;
					}
					cellValue = this._getCellValue(new CellRange(rowIndex, columnIndex), sheet);
					if (!isPrimitive(cellValue)) {
						cellValue = cellValue.value;
					}
					vals[valIndex] = cellValue;
					valIndex++;
				}
			}

			return vals;
		}

		/*
		 * Gets the cell range of the CellRangeExpression.
		 */
		get cells(): CellRange {
			return this._cells;
		}

		/*
		 * Gets the sheet reference of the CellRangeExpression.
		 */
		get sheetRef(): string {
			return this._sheetRef;
		}

		// Get cell value for a cell.
		private _getCellValue(cell: CellRange, sheet?: Sheet): any {
			var sheet: Sheet,
				cellKey: string;

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
		}

		// Gets the sheet by the sheetRef.
		private _getSheet(): Sheet {
			var i = 0,
				sheet: Sheet;

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
		}
	}

	/*
	 * Defines the function expression class.
	 * For e.g. sum(1,2,3).
	 */
	export class _FunctionExpression extends _Expression {
		private _funcDefinition: _FunctionDefinition;
		private _params: Array<_Expression>;

		/*
		 * Initializes a new instance of the @see:FunctionExpression class.
		 *
		 * @param func The @see:FunctionDefinition instance keeps function name, parameter counts, and function.
		 * @param params The parameter list that the function of the @see:FunctionDefinition instance needs.
		 */
		constructor(func: _FunctionDefinition, params: Array<_Expression>) {
			super();

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
		evaluate(sheet?: Sheet, rowIndex?: number, columnIndex?: number): any {
			if (this._evaluatedValue == null) {
				this._evaluatedValue = this._funcDefinition.func(this._params, sheet, rowIndex, columnIndex);
			}
			return this._evaluatedValue;
		}
	}
} 