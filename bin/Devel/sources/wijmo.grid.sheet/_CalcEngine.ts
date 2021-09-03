module wijmo.grid.sheet {
	'use strict';

	/*
	 * Defines the CalcEngine class.
	 *
	 * It deals with the calculation for the flexsheet control.
	 */
	export class _CalcEngine {
		private _owner: FlexSheet;
		private _expression: string;
		private _expressLength: number;
		private _pointer: number;
		private _expressionCache: any = {};
		private _tokenTable: any;
		private _token: _Token;
		private _idChars: string = '$:!';
		private _functionTable: any = {};
		private _cacheSize: number = 0;

		/*
		 * Initializes a new instance of the @see:CalcEngine class.
		 *
		 * @param owner The @see: FlexSheet control that the CalcEngine works for.
		 */
		constructor(owner: FlexSheet) {
			this._owner = owner;

			this._buildSymbolTable();
			this._registerAggregateFunction();
			this._registerMathFunction();
			this._registerLogicalFunction();
			this._registerTextFunction();
			this._registerDateFunction();
			this._registLookUpReferenceFunction();
			this._registFinacialFunction();
		}

		/*
		 * Occurs when the @see:_CalcEngine meets the unknown formula.
		 */
		unknownFunction = new Event();
		/*
		 * Raises the unknownFunction event.
		 */
		onUnknownFunction(funcName: string, params: Array<_Expression>): _Expression {
			var paramsList: any[],
				eventArgs: UnknownFunctionEventArgs;

			if (params && params.length > 0) {
				paramsList = [];
				for (var i = 0; i < params.length; i++) {
					paramsList[i] = params[i].evaluate();
				}
			}

			eventArgs = new UnknownFunctionEventArgs(funcName, paramsList);
			this.unknownFunction.raise(this, eventArgs);

			if (eventArgs.value != null) {
				return new _Expression(eventArgs.value);
			}

			throw 'The function "' + funcName + '"' + ' has not supported in FlexSheet yet.';
		}

		/*
		 * Evaluates an expression.
		 *
		 * @param expression the expression need to be evaluated to value.
		 * @param format the format string used to convert raw values into display.
		 * @param sheet The @see:Sheet is referenced by the @see:Expression.
		 * @param rowIndex The row index of the cell where the expression located in.
		 * @param columnIndex The column index of the cell where the expression located in.
		 */
		evaluate(expression: string, format?: string, sheet?: Sheet, rowIndex?: number, columnIndex?: number): any {
			var expr: _Expression,
				result: any;

			try {
				if (expression && expression.length > 1 && expression[0] === '=') {
					expr = this._checkCache(expression);
					result = expr.evaluate(sheet, rowIndex, columnIndex);
					while (result instanceof _Expression) {
						result = (<_Expression>result).evaluate(sheet);
					}
					if (format && isPrimitive(result)) {
						return Globalize.format(result, format);
					}
					return result;
				}

				return expression ? expression : '';
			} catch (e) {
				return "Error: " + e;
			}
		}

		/*
		 * Add a custom function to the @see:_CalcEngine.
         *
		 * @param name the name of the custom function, the function name should be lower case.
		 * @param func the custom function.
		 * @param minParamsCount the minimum count of the parameter that the function need.
		 * @param maxParamsCount the maximum count of the parameter that the function need.
		 *        If the count of the parameters in the custom function is arbitrary, the
         *        minParamsCount and maxParamsCount should be set to null.
		 */
		addCustomFunction(name: string, func: Function, minParamsCount?: number, maxParamsCount?: number) {
			var self = this;

			name = name.toLowerCase();
			this._functionTable[name] = new _FunctionDefinition((params) => {
				var param,
					paramsList = [];
				if (params.length > 0) {
					for (var i = 0; i < params.length; i++) {
						param = params[i];
						if (param instanceof _CellRangeExpression) {
							paramsList[i] = (<_CellRangeExpression>param).cells;
						} else {
							paramsList[i] = param.evaluate();
						}
					}
				}
				return func.apply(self, paramsList);
			}, maxParamsCount, minParamsCount);
		}

		// Clear the expression cache.
		_clearExpressionCache() {
			this._expressionCache = null;
			this._expressionCache = {};
			this._cacheSize = 0;
		}

		// Parse the string expression to an Expression instance that can be evaluated to value.
		private _parse(expression: string): _Expression {
			this._expression = expression;
			this._expressLength = expression ? expression.length : 0;
			this._pointer = 0;

			// skip leading equals sign
			if (this._expressLength > 0 && this._expression[0] === '=') {
				this._pointer++;
			}

			return this._parseExpression();
		}

		// Build static token table.
		private _buildSymbolTable(): any {
			if (!this._tokenTable) {
				this._tokenTable = {};
				this._addToken('+', _TokenID.ADD, _TokenType.ADDSUB);
				this._addToken('-', _TokenID.SUB, _TokenType.ADDSUB);
				this._addToken('(', _TokenID.OPEN, _TokenType.GROUP);
				this._addToken(')', _TokenID.CLOSE, _TokenType.GROUP);
				this._addToken('*', _TokenID.MUL, _TokenType.MULDIV);
				this._addToken(',', _TokenID.COMMA, _TokenType.GROUP);
				this._addToken('.', _TokenID.PERIOD, _TokenType.GROUP);
				this._addToken('/', _TokenID.DIV, _TokenType.MULDIV);
				this._addToken('\\', _TokenID.DIVINT, _TokenType.MULDIV);
				this._addToken('=', _TokenID.EQ, _TokenType.COMPARE);
				this._addToken('>', _TokenID.GT, _TokenType.COMPARE);
				this._addToken('<', _TokenID.LT, _TokenType.COMPARE);
				this._addToken('^', _TokenID.POWER, _TokenType.POWER);
				this._addToken("<>", _TokenID.NE, _TokenType.COMPARE);
				this._addToken(">=", _TokenID.GE, _TokenType.COMPARE);
				this._addToken("<=", _TokenID.LE, _TokenType.COMPARE);
				this._addToken('&', _TokenID.CONCAT, _TokenType.CONCAT);
			}
		}

		// Register the aggregate function for the CalcEngine.
		private _registerAggregateFunction() {
			var self = this;

			self._functionTable['sum'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				return self._getAggregateResult(Aggregate.Sum, params, sheet);
			});
			self._functionTable['average'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				return self._getAggregateResult(Aggregate.Avg, params, sheet);
			});
			self._functionTable['max'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				return self._getAggregateResult(Aggregate.Max, params, sheet);
			});
			self._functionTable['min'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				return self._getAggregateResult(Aggregate.Min, params, sheet);
			});
			self._functionTable['var'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				return self._getAggregateResult(Aggregate.Var, params, sheet);
			});
			self._functionTable['varp'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				return self._getAggregateResult(Aggregate.VarPop, params, sheet);
			});
			self._functionTable['stdev'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				return self._getAggregateResult(Aggregate.Std, params, sheet);
			});
			self._functionTable['stdevp'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				return self._getAggregateResult(Aggregate.StdPop, params, sheet);
			});
			self._functionTable['count'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				return self._getFlexSheetAggregateResult(_FlexSheetAggregate.Count, params, sheet);
			});
			self._functionTable['counta'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				return self._getFlexSheetAggregateResult(_FlexSheetAggregate.CountA, params, sheet);
			});
			self._functionTable['countblank'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				return self._getFlexSheetAggregateResult(_FlexSheetAggregate.ConutBlank, params, sheet);
			});
			self._functionTable['countif'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				return self._getFlexSheetAggregateResult(_FlexSheetAggregate.CountIf, params, sheet);
			}, 2, 2);
			self._functionTable['countifs'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				return self._getFlexSheetAggregateResult(_FlexSheetAggregate.CountIfs, params, sheet);
			}, 254, 2);
			self._functionTable['sumif'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				return self._getFlexSheetAggregateResult(_FlexSheetAggregate.SumIf, params, sheet);
			}, 3, 2);
			self._functionTable['sumifs'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				return self._getFlexSheetAggregateResult(_FlexSheetAggregate.SumIfs, params, sheet);
			}, 255, 2);
			self._functionTable['rank'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				return self._getFlexSheetAggregateResult(_FlexSheetAggregate.Rank, params, sheet);
			}, 3, 2);
			self._functionTable['product'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				return self._getFlexSheetAggregateResult(_FlexSheetAggregate.Product, params, sheet);
			}, 255, 1);
			self._functionTable['subtotal'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				return self._handleSubtotal(params, sheet);
			}, 255, 2);
			self._functionTable['dcount'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				return self._handleDCount(params, sheet);
			}, 3, 3);
		}

		// Register the math function for the calcEngine.
		private _registerMathFunction() {
			var self = this,
				unaryFuncs = ['abs', 'acos', 'asin', 'atan', 'ceiling', 'cos', 'exp', 'floor', 'ln', 'sin', 'sqrt', 'tan'],
				roundFuncs = ['round', 'rounddown', 'roundup'];

			self._functionTable['pi'] = new _FunctionDefinition(() => {
				return Math.PI;
			}, 0, 0);

			self._functionTable['rand'] = new _FunctionDefinition(() => {
				return Math.random();
			}, 0, 0);

			self._functionTable['power'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				return Math.pow(_Expression.toNumber(params[0], sheet), _Expression.toNumber(params[1], sheet));
			}, 2, 2);

			self._functionTable['atan2'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var x = _Expression.toNumber(params[0], sheet),
					y = _Expression.toNumber(params[1], sheet);

				if (x === 0 && y === 0) {
					throw 'The x number and y number can\'t both be zero for the atan2 function';
				}
				return Math.atan2(y, x);
			}, 2, 2);

			self._functionTable['mod'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				return _Expression.toNumber(params[0], sheet) % _Expression.toNumber(params[1], sheet);
			}, 2, 2);

			self._functionTable['trunc'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var num = _Expression.toNumber(params[0], sheet),
					precision = params.length === 2 ? _Expression.toNumber(params[1], sheet) : 0,
					multiple: number;

				if (precision === 0) {
					if (num >= 0) {
						return Math.floor(num);
					} else {
						return Math.ceil(num);
					}
				} else {
					multiple = Math.pow(10, precision);
					if (num >= 0) {
						return Math.floor(num * multiple) / multiple;
					} else {
						return Math.ceil(num * multiple) / multiple;
					}
				}

			}, 2, 1);

			roundFuncs.forEach((val) => {
				self._functionTable[val] = new _FunctionDefinition((params, sheet?: Sheet) => {
					var num = _Expression.toNumber(params[0], sheet),
                        precision = _Expression.toNumber(params[1], sheet),
                        result: number,
                        format: string,
						multiple: number;

					if (precision === 0) {
						switch (val) {
                            case 'rounddown':
                                if (num >= 0) {
                                    result = Math.floor(num);
                                } else {
                                    result = Math.ceil(num);
                                }
                                break;
                            case 'roundup':
                                if (num >= 0) {
                                    result = Math.ceil(num);
                                } else {
                                    result = Math.floor(num);
                                }
                                break;
                            case 'round':
                                result = Math.round(num);
                                break;
                            default:
                                result = Math.floor(num);
                                break;
						}
                        format = 'n0';
					} else if (precision > 0 && isInt(precision)) {
						multiple = Math.pow(10, precision);
						switch (val) {
                            case 'rounddown':
                                if (num >= 0) {
                                    result = Math.floor(num * multiple) / multiple;
                                } else {
                                    result = Math.ceil(num * multiple) / multiple;
                                }
                                break;
                            case 'roundup':
                                if (num >= 0) {
                                    result = Math.ceil(num * multiple) / multiple;
                                } else {
                                    result = Math.floor(num * multiple) / multiple;
                                }
                                break;
                            case 'round':
                                result = Math.round(num * multiple) / multiple;
                                break;
                        }
                        format = 'n' + precision;
                    }

                    if (result != null) {
                        return {
                            value: result,
                            format: format
                        };
                    }

					throw 'Invalid precision!';
				}, 2, 2);
			});

			unaryFuncs.forEach((val) => {
				self._functionTable[val] = new _FunctionDefinition((params, sheet?: Sheet) => {
					switch (val) {
						case 'ceiling':
							return Math.ceil(_Expression.toNumber(params[0], sheet));
						case 'ln':
							return Math.log(_Expression.toNumber(params[0], sheet));
						default:
							return Math[val](_Expression.toNumber(params[0], sheet));
					}
				}, 1, 1);
			});
		}

		// Register the logical function for the calcEngine.
		private _registerLogicalFunction() {
			// and(true,true,false,...)
			this._functionTable['and'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var result: boolean = true,
					index: number;
				for (index = 0; index < params.length; index++) {
					result = result && _Expression.toBoolean(params[index], sheet);
					if (!result) {
						break;
					}
				}
				return result;
			}, Number.MAX_VALUE, 1);

			// or(false,true,true,...)
			this._functionTable['or'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var result: boolean = false,
					index: number;
				for (index = 0; index < params.length; index++) {
					result = result || _Expression.toBoolean(params[index], sheet);
					if (result) {
						break;
					}
				}
				return result;
			}, Number.MAX_VALUE, 1);

			// not(false)
			this._functionTable['not'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				return !_Expression.toBoolean(params[0], sheet);
			}, 1, 1);

			// if(true,a,b)
			this._functionTable['if'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				return _Expression.toBoolean(params[0], sheet) ? params[1].evaluate(sheet) : params[2].evaluate(sheet);
			}, 3, 3);

			// true()
			this._functionTable['true'] = new _FunctionDefinition(() => {
				return true;
			}, 0, 0);

			// false()
			this._functionTable['false'] = new _FunctionDefinition(() => {
				return false;
			}, 0, 0);
		}

		// register the text process function
		private _registerTextFunction() {
			// char(65, 66, 67,...) => "abc"
			this._functionTable['char'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var index: number,
					result: string = '';

				for (index = 0; index < params.length; index++) {
					result += String.fromCharCode(_Expression.toNumber(params[index], sheet));
				}
				return result;
			}, Number.MAX_VALUE, 1);

			// code("A")
			this._functionTable['code'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var str = _Expression.toString(params[0], sheet);

				if (str && str.length > 0) {
					return str.charCodeAt(0);
				}

				return -1;
			}, 1, 1);

			// concatenate("abc","def","ghi",...) => "abcdefghi"
			this._functionTable['concatenate'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var index: number,
					result: string = '';

				for (index = 0; index < params.length; index++) {
					result = result.concat(_Expression.toString(params[index], sheet));
				}
				return result;
			}, Number.MAX_VALUE, 1);

			// left("Abcdefgh", 5) => "Abcde"
			this._functionTable['left'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var str = _Expression.toString(params[0], sheet),
					length = Math.floor(_Expression.toNumber(params[1], sheet));

				if (str && str.length > 0) {
					return str.slice(0, length);
				}

				return undefined;
			}, 2, 2);

			// right("Abcdefgh", 5) => "defgh"
			this._functionTable['right'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var str = _Expression.toString(params[0], sheet),
					length = Math.floor(_Expression.toNumber(params[1], sheet));

				if (str && str.length > 0) {
					return str.slice(-length);
				}

				return undefined;
			}, 2, 2);

			// find("abc", "abcdefgh") 
			// this function is case-sensitive.
			this._functionTable['find'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var search = _Expression.toString(params[0], sheet),
					text = _Expression.toString(params[1], sheet),
					result: number;

				if (text != null && search != null) {
					result = text.indexOf(search);
					if (result > -1) {
						return result + 1;
					}
				}

				return -1;
			}, 2, 2);

			// search("abc", "ABCDEFGH") 
			// this function is not case-sensitive.
			this._functionTable['search'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var search = _Expression.toString(params[0], sheet),
					text = _Expression.toString(params[1], sheet),
					searchRegExp: RegExp,
					result: number;

				if (text != null && search != null) {
					searchRegExp = new RegExp(search, 'i');
					result = text.search(searchRegExp);
					if (result > -1) {
						return result + 1;
					}
				}

				return -1;
			}, 2, 2);

			// len("abcdefgh")
			this._functionTable['len'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var str = _Expression.toString(params[0], sheet);

				if (str) {
					return str.length;
				}

				return -1;
			}, 1, 1);

			//  mid("abcdefgh", 2, 3) => "bcd"
			this._functionTable['mid'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var text = _Expression.toString(params[0], sheet),
					start = Math.floor(_Expression.toNumber(params[1], sheet)),
					length = Math.floor(_Expression.toNumber(params[2], sheet));

				if (text && text.length > 0 && start > 0) {
					return text.substr(start - 1, length);
				}

				return undefined;
			}, 3, 3);

			// lower("ABCDEFGH")
			this._functionTable['lower'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var str = _Expression.toString(params[0], sheet);

				if (str && str.length > 0) {
					return str.toLowerCase();
				}

				return undefined;
			}, 1, 1);

			// upper("abcdefgh")
			this._functionTable['upper'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var str = _Expression.toString(params[0], sheet);

				if (str && str.length > 0) {
					return str.toUpperCase();
				}

				return undefined;
			}, 1, 1);

			// proper("abcdefgh") => "Abcdefgh"
			this._functionTable['proper'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var str = _Expression.toString(params[0], sheet);

				if (str && str.length > 0) {
					return str[0].toUpperCase() + str.substring(1).toLowerCase();
				}

				return undefined;
			}, 1, 1);

			// trim("   abcdefgh   ") => "abcdefgh"
			this._functionTable['trim'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var str = _Expression.toString(params[0], sheet);

				if (str && str.length > 0) {
					return str.trim();
				}

				return undefined;
			}, 1, 1);

			// replace("abcdefg", 2, 3, "xyz") => "axyzefg"
			this._functionTable['replace'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var text = _Expression.toString(params[0], sheet),
					start = Math.floor(_Expression.toNumber(params[1], sheet)),
					length = Math.floor(_Expression.toNumber(params[2], sheet)),
					replaceText = _Expression.toString(params[3], sheet);

				if (text && text.length > 0 && start > 0) {
					return text.substring(0, start - 1) + replaceText + text.slice(start - 1 + length);
				}

				return undefined;
			}, 4, 4);

			// substitute("abcabcdabcdefgh", "ab", "xy") => "xycxycdxycdefg"
			this._functionTable['substitute'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var text = _Expression.toString(params[0], sheet),
					oldText = _Expression.toString(params[1], sheet),
					newText = _Expression.toString(params[2], sheet),
					searhRegExp: RegExp;

				if (text && text.length > 0 && oldText && oldText.length > 0) {
					searhRegExp = new RegExp(oldText, 'g');
					return text.replace(searhRegExp, newText);
				}

				return undefined;
			}, 3, 3);

			// rept("abc", 3) => "abcabcabc"
			this._functionTable['rept'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var text = _Expression.toString(params[0], sheet),
					repeatTimes = Math.floor(_Expression.toNumber(params[1], sheet)),
					result = '',
					i: number;

				if (text && text.length > 0 && repeatTimes > 0) {
					for (i = 0; i < repeatTimes; i++) {
						result = result.concat(text);
					}
				}

				return result;
			}, 2, 2);

			// text("1234", "n2") => "1234.00"
			this._functionTable['text'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var value = params[0].evaluate(),
					format = _Expression.toString(params[1], sheet);

				return Globalize.format(value, format);
			}, 2, 2);

			// value("1234") => 1234
			this._functionTable['value'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				return _Expression.toNumber(params[0], sheet);
			}, 1, 1);
		}

		// Register the datetime function for the calcEngine.
		private _registerDateFunction() {
			this._functionTable['now'] = new _FunctionDefinition(() => {
				return {
					value: new Date(),
					format: 'M/d/yyyy h:mm'
				};
			}, 0, 0);

			this._functionTable['today'] = new _FunctionDefinition(() => {
				return {
					value: new Date(),
					format: 'd'
				};
			}, 0, 0);

			// year("11/25/2015") => 2015
			this._functionTable['year'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var date = _Expression.toDate(params[0], sheet);
				if (!isPrimitive(date) && date) {
					return date.value;
				}
				if (isDate(date)) {
					return date.getFullYear();
				}
				return 1900;
			}, 1, 1);

			// month("11/25/2015") => 11
			this._functionTable['month'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var date = _Expression.toDate(params[0], sheet);
				if (!isPrimitive(date) && date) {
					return date.value;
				}
				if (isDate(date)) {
					return date.getMonth() + 1;
				}
				return 1;
			}, 1, 1);

			// day("11/25/2015") => 25
			this._functionTable['day'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var date = _Expression.toDate(params[0], sheet);
				if (!isPrimitive(date) && date) {
					return date.value;
				}
				if (isDate(date)) {
					return date.getDate();
				}
				return 0;
			}, 1, 1);

			// hour("11/25/2015 16:50") => 16 or hour(0.5) => 12
			this._functionTable['hour'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var val = params[0].evaluate(sheet);
				if (isNumber(val) && !isNaN(val)) {
					return Math.floor(24 * (val - Math.floor(val)));
				} else if (isDate(val)) {
					return val.getHours();
				}

				val = _Expression.toDate(params[0], sheet);
				if (!isPrimitive(val) && val) {
					val = val.value;
				}

				if (isDate(val)) {
					return val.getHours();
				}

				throw 'Invalid parameter.';
			}, 1, 1);

			// time(10, 23, 11) => 10:23:11 AM
			this._functionTable['time'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var hour = params[0].evaluate(sheet),
					minute = params[1].evaluate(sheet),
					second = params[2].evaluate(sheet);

				if (isNumber(hour) && isNumber(minute) && isNumber(second)) {
					hour %= 24;
					minute %= 60;
					second %= 60;

					return {
						value: new Date(0, 0, 0, hour, minute, second),
						format: 't'
					};
				}

				throw 'Invalid parameters.';
			}, 3, 3);

			// time(2015, 11, 25) => 11/25/2015
			this._functionTable['date'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var year = params[0].evaluate(sheet),
					month = params[1].evaluate(sheet),
					day = params[2].evaluate(sheet);

				if (isNumber(year) && isNumber(month) && isNumber(day)) {
					return {
						value: new Date(year, month - 1, day),
						format: 'd'
					};
				}

				throw 'Invalid parameters.';
			}, 3, 3);

			this._functionTable['datedif'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var startDate = _Expression.toDate(params[0], sheet),
					endDate = _Expression.toDate(params[1], sheet),
					unit = params[2].evaluate(sheet),
					startDateTime: number,
					endDateTime: number,
					diffDays: number,
					diffMonths: number,
					diffYears: number;

				if (!isPrimitive(startDate) && startDate) {
					startDate = startDate.value;
				}

				if (!isPrimitive(endDate) && endDate) {
					endDate = endDate.value;
				}

				if (isDate(startDate) && isDate(endDate) && isString(unit)) {
					startDateTime = startDate.getTime();
					endDateTime = endDate.getTime();

					if (startDateTime > endDateTime) {
						throw 'Start date is later than end date.';
					}

					diffDays = endDate.getDate() - startDate.getDate();
					diffMonths = endDate.getMonth() - startDate.getMonth();
					diffYears = endDate.getFullYear() - startDate.getFullYear();

					switch (unit.toUpperCase()) {
						case 'Y':
							if (diffMonths > 0) {
								return diffYears;
							} else if (diffMonths < 0) {
								return diffYears - 1;
							} else {
								if (diffDays >= 0) {
									return diffYears;
								} else {
									return diffYears - 1;
								}
							}
						case 'M':
							if (diffDays >= 0) {
								return diffYears * 12 + diffMonths;
							} else {
								return diffYears * 12 + diffMonths - 1;
							}
						case 'D':
							return (endDateTime - startDateTime) / (1000 * 3600 * 24);
						case 'YM':
							if (diffDays >= 0) {
								diffMonths = diffYears * 12 + diffMonths;
							} else {
								diffMonths = diffYears * 12 + diffMonths - 1;
							}
							return diffMonths % 12;
						case 'YD':
							if (diffMonths > 0) {
								return (new Date(startDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime() - startDate.getTime()) / (1000 * 3600 * 24);
							} else if (diffMonths < 0) {
								return (new Date(startDate.getFullYear() + 1, endDate.getMonth(), endDate.getDate()).getTime() - startDate.getTime()) / (1000 * 3600 * 24);
							} else {
								if (diffDays >= 0) {
									return diffDays;
								} else {
									return (new Date(startDate.getFullYear() + 1, endDate.getMonth(), endDate.getDate()).getTime() - startDate.getTime()) / (1000 * 3600 * 24);
								}
							}
						case 'MD':
							if (diffDays >= 0) {
								return diffDays;
							} else {
								diffDays = new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate() - new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1).getDate() + 1 + diffDays;
								return diffDays;
							}
						default:
							throw 'Invalid unit.';
					}
				}

				throw 'Invalid parameters.';
			}, 3, 3);
		}

		// Register the cell reference and look up related functions for the calcEngine.
		private _registLookUpReferenceFunction() {
			var self = this;

			self._functionTable['column'] = new _FunctionDefinition((params, sheet?: Sheet, rowIndex?: number, columnIndex?: number) => {
				var cellExpr: _Expression;
				if (params == null) {
					return columnIndex + 1;
				}

				cellExpr = params[0];
				cellExpr = self._ensureNonFunctionExpression(<_Expression>cellExpr);
				if (cellExpr instanceof _CellRangeExpression) {
					return (<_CellRangeExpression>cellExpr).cells.col + 1;
				}

				throw 'Invalid Cell Reference.';
			}, 1, 0);

			self._functionTable['columns'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var cellExpr = params[0];

				cellExpr = self._ensureNonFunctionExpression(<_Expression>cellExpr);
				if (cellExpr instanceof _CellRangeExpression) {
					return (<_CellRangeExpression>cellExpr).cells.columnSpan;
				}
				throw 'Invalid Cell Reference.';
			}, 1, 1);

			self._functionTable['row'] = new _FunctionDefinition((params, sheet?: Sheet, rowIndex?: number, columnIndex?: number) => {
				var cellExpr: _Expression;
				if (params == null) {
					return rowIndex + 1;
				}

				cellExpr = params[0];
				cellExpr = self._ensureNonFunctionExpression(<_Expression>cellExpr);
				if (cellExpr instanceof _CellRangeExpression) {
					return (<_CellRangeExpression>cellExpr).cells.row + 1;
				}
				throw 'Invalid Cell Reference.';
			}, 1, 0);

			self._functionTable['rows'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var cellExpr = params[0];

				cellExpr = self._ensureNonFunctionExpression(<_Expression>cellExpr);
				if (cellExpr instanceof _CellRangeExpression) {
					return (<_CellRangeExpression>cellExpr).cells.rowSpan;
				}
				throw 'Invalid Cell Reference.';
			}, 1, 1);

			self._functionTable['choose'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var index = _Expression.toNumber(params[0], sheet);

				if (isNaN(index)) {
					throw 'Invalid index number.';
				}

				if (index < 1 || index >= params.length) {
					throw 'The index number is out of the list range.';
				}

				return params[index].evaluate(sheet);
			}, 255, 2);

			self._functionTable['index'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var cellExpr = params[0],
					cells: CellRange,
					rowNum = _Expression.toNumber(params[1], sheet),
					colNum = params[2] != null ? _Expression.toNumber(params[2], sheet) : 0;

				if (isNaN(rowNum) || rowNum < 0) {
					throw 'Invalid Row Number.';
				}
				if (isNaN(colNum) || colNum < 0) {
					throw 'Invalid Column Number.';
				}

				cellExpr = self._ensureNonFunctionExpression(<_Expression>cellExpr);
				if (cellExpr instanceof _CellRangeExpression) {
					cells = (<_CellRangeExpression>cellExpr).cells;
					if (rowNum > cells.rowSpan || colNum > cells.columnSpan) {
						throw 'Index is out of the cell range.';
					}
					if (rowNum > 0 && colNum > 0) {
						return self._owner.getCellValue(cells.topRow + rowNum - 1, cells.leftCol + colNum - 1, true, sheet);
					} 
					if (rowNum === 0 && colNum === 0) {
						return cellExpr;
					}
					if (rowNum === 0) {
						return new _CellRangeExpression(new CellRange(cells.topRow, cells.leftCol + colNum - 1, cells.bottomRow, cells.leftCol + colNum - 1), (<_CellRangeExpression>cellExpr).sheetRef, self._owner);
					}
					if (colNum === 0) {
						return new _CellRangeExpression(new CellRange(cells.topRow + rowNum - 1, cells.leftCol, cells.topRow + rowNum - 1, cells.rightCol), (<_CellRangeExpression>cellExpr).sheetRef, self._owner);
					}
				}
				throw 'Invalid Cell Reference.';
			}, 4, 2);

			self._functionTable['hlookup'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				return self._handleHLookup(params, sheet);
			}, 4, 3);
		}

		// Register the finacial function for the calcEngine.
		private _registFinacialFunction() {
			var self = this;

			self._functionTable['rate'] = new _FunctionDefinition((params, sheet?: Sheet) => {
				var rate = self._calculateRate(params, sheet);

				return {
					value: rate,
					format: 'p2'
				};
			}, 6, 3);
		}

		// Add token into the static token table.
		private _addToken(symbol: any, id: _TokenID, type: _TokenType) {
			var token = new _Token(symbol, id, type);
			this._tokenTable[symbol] = token;
		}

		// Parse expression
		private _parseExpression(): _Expression {
			this._getToken();
			return this._parseCompareOrConcat();
		}

		// Parse compare expression
		private _parseCompareOrConcat(): _Expression {
			var x = this._parseAddSub(),
				t: _Token,
				exprArg: _Expression;

			while (this._token.tokenType === _TokenType.COMPARE || this._token.tokenType === _TokenType.CONCAT) {
				t = this._token;
				this._getToken();
				exprArg = this._parseAddSub();
				x = new _BinaryExpression(t, x, exprArg);
			}

			return x;
		}

		// Parse add/sub expression.
		private _parseAddSub(): _Expression {
			var x = this._parseMulDiv(),
				t: _Token,
				exprArg: _Expression;

			while (this._token.tokenType === _TokenType.ADDSUB) {
				t = this._token;
				this._getToken();
				exprArg = this._parseMulDiv();
				x = new _BinaryExpression(t, x, exprArg);
			}

			return x;
		}

		// Parse multiple/division expression.
		private _parseMulDiv(): _Expression {
			var x = this._parsePower(),
				t: _Token,
				exprArg: _Expression;

			while (this._token.tokenType === _TokenType.MULDIV) {
				t = this._token;
				this._getToken();
				exprArg = this._parsePower();
				x = new _BinaryExpression(t, x, exprArg);
			}

			return x;
		}

		// Parse power expression.
		private _parsePower(): _Expression {
			var x = this._parseUnary(),
				t: _Token,
				exprArg: _Expression;

			while (this._token.tokenType === _TokenType.POWER) {
				t = this._token;
				this._getToken();
				exprArg = this._parseUnary();
				x = new _BinaryExpression(t, x, exprArg);
			}

			return x;
		}

		// Parse unary expression
		private _parseUnary(): _Expression {
			var t: _Token,
				exprArg: _Expression;

			// unary plus and minus
			if (this._token.tokenID === _TokenID.ADD || this._token.tokenID === _TokenID.SUB) {
				t = this._token;
				this._getToken();
				exprArg = this._parseAtom();
				return new _UnaryExpression(t, exprArg);
			}

			// not unary, return atom
			return this._parseAtom();
		}

		// Parse atomic expression
		private _parseAtom(): _Expression {
			var x: _Expression = null,
				id: string,
				funcDefinition: _FunctionDefinition,
				params: Array<_Expression>,
				pCnt: number,
				cellRef: _ICellReferrence;

			switch (this._token.tokenType) {
				// literals
				case _TokenType.LITERAL:
					x = new _Expression(this._token);
					break;
				// identifiers
				case _TokenType.IDENTIFIER:
					// get identifier
					id = this._token.value.toString();
					funcDefinition = this._functionTable[id.toLowerCase()];

					// look for functions
					if (funcDefinition) {
						params = this._getParameters();
						pCnt = params ? params.length : 0;
						if (funcDefinition.paramMin !== -1 && pCnt < funcDefinition.paramMin) {
							throw 'Too few parameters.';
						}
						if (funcDefinition.paramMax !== -1 && pCnt > funcDefinition.paramMax) {
							throw 'Too many parameters.';
						}
						x = new _FunctionExpression(funcDefinition, params);
						break;
					}

					// look for Cell Range.
					cellRef = this._getCellRange(id);
					if (cellRef) {
						x = new _CellRangeExpression(cellRef.cellRange, cellRef.sheetRef, this._owner);
						break;
					}

					// trigger the unknownFunction event.
					params = this._getParameters();
					x = this.onUnknownFunction(id, params);

					break;
				// sub-expressions
				case _TokenType.GROUP:
					// anything other than opening parenthesis is illegal here
					if (this._token.tokenID !== _TokenID.OPEN) {
						throw 'Expression expected.';
					}

					// get expression
					this._getToken();
					x = this._parseCompareOrConcat();

					// check that the parenthesis was closed
					if (this._token.tokenID !== _TokenID.CLOSE) {
						throw 'Unbalanced parenthesis.';
					}

					break;
			}

			// make sure we got something...
			if (x === null) {
				throw '';
			}

			// done
			this._getToken();
			return x;
		}

		// Get token for the expression.
		private _getToken() {
			var i: number,
				c: string,
				lastChar: string,
				isLetter: boolean,
				isDigit: boolean,
				id = '',
				sheetRef = '',
				// About the Japanese characters checking
				// Please refer http://stackoverflow.com/questions/15033196/using-javascript-to-check-whether-a-string-contains-japanese-characters-includi
				// And http://www.rikai.com/library/kanjitables/kanji_codes.unicode.shtml
				japaneseRegExp = new RegExp('[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]');

			// eat white space 
			while (this._pointer < this._expressLength && this._expression[this._pointer] === ' ') {
				this._pointer++;
			}

			// are we done?
			if (this._pointer >= this._expressLength) {
				this._token = new _Token(null, _TokenID.END, _TokenType.GROUP);
				return;
			}

			// prepare to parse
			c = this._expression[this._pointer];

			// operators
			// this gets called a lot, so it's pretty optimized.
			// note that operators must start with non-letter/digit characters.
			isLetter = (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || japaneseRegExp.test(c);
			isDigit = (c >= '0' && c <= '9') || c == '.';
			if (!isLetter && !isDigit) {
				var tk = this._tokenTable[c];
				if (tk) {
					// save token we found
					this._token = tk;
					this._pointer++;

					// look for double-char tokens (special case)
					if (this._pointer < this._expressLength && (c === '>' || c === '<')) {
						tk = this._tokenTable[this._expression.substring(this._pointer - 1, this._pointer + 1)];
						if (tk) {
							this._token = tk;
							this._pointer++;
						}
					}
					return;
				}
			}

			// parse numbers token
			if (isDigit) {
				this._parseDigit();
				return;
			}

			// parse strings token
			if (c === '\"') {
				this._parseString();
				return;
			}

			if (c === '\'') {
				sheetRef = this._parseSheetRef();
				if (!sheetRef) {
					return;
				}
			}

			// parse dates token
			if (c === '#') { 
				this._parseDate();
				return;
			}

			// identifiers (functions, objects) must start with alpha or underscore
			if (!isLetter && c !== '_' && this._idChars.indexOf(c) < 0 && !sheetRef) {
				throw 'Identifier expected.';
			}

			// and must contain only letters/digits/_idChars
			for (i = 1; i + this._pointer < this._expressLength; i++) {
				c = this._expression[this._pointer + i];
				isLetter = (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || japaneseRegExp.test(c);
				isDigit = c >= '0' && c <= '9';
				if (c === '\'' && lastChar === ':') {
					id = sheetRef + this._expression.substring(this._pointer, this._pointer + i);
					this._pointer += i;

					sheetRef = this._parseSheetRef();
					i = 0;
					continue;
				}
				lastChar = c;
				if (!isLetter && !isDigit && c !== '_' && this._idChars.indexOf(c) < 0) {
					break;
				}
			}

			// got identifier
			id += sheetRef + this._expression.substring(this._pointer, this._pointer + i);
			this._pointer += i;
			this._token = new _Token(id, _TokenID.ATOM, _TokenType.IDENTIFIER);
		}

		// Parse digit token
		private _parseDigit() {
			var div = -1,
				sci = false,
				pct = false,
				val = 0.0,
				i: number,
				c: string,
				lit: string;

			for (i = 0; i + this._pointer < this._expressLength; i++) {
				c = this._expression[this._pointer + i];

				// digits always OK
				if (c >= '0' && c <= '9') {
					val = val * 10 + (+c - 0);
					if (div > -1) {
						div *= 10;
					}
					continue;
				}

				// one decimal is OK
				if (c === '.' && div < 0) {
					div = 1;
					continue;
				}

				// scientific notation?
				if ((c === 'E' || c === 'e') && !sci) {
					sci = true;
					c = this._expression[this._pointer + i + 1];
					if (c === '+' || c === '-') i++;
					continue;
				}

				// percentage?
				if (c === '%') {
					pct = true;
					i++;
					break;
				}

				// end of literal
				break;
			}

			// end of number, get value
			if (!sci) {
				// much faster than ParseDouble
				if (div > 1) {
					val /= div;
				}
				if (pct) {
					val /= 100.0;
				}
			} else {
				lit = this._expression.substring(this._pointer, this._pointer + i);
				val = +lit;
			}

			// build token
			this._token = new _Token(val, _TokenID.ATOM, _TokenType.LITERAL);

			// advance pointer and return
			this._pointer += i;
		}

		// Parse string token
		private _parseString() {
			var i: number,
				c: string,
				cNext: string,
				lit: string;

			// look for end quote, skip double quotes
			for (i = 1; i + this._pointer < this._expressLength; i++) {
				c = this._expression[this._pointer + i];
				if (c !== '\"') {
					continue;
				}
				cNext = i + this._pointer < this._expressLength - 1 ? this._expression[this._pointer + i + 1] : ' ';
				if (cNext !== '\"') {
					break;
				}
				i++;
			}

			// check that we got the end of the string
			if (c !== '\"') {
				throw 'Can\'t find final quote.';
			}

			// end of string
			lit = this._expression.substring(this._pointer + 1, this._pointer + i);
			this._pointer += i + 1;
			if (this._expression[this._pointer] === '!') {
				throw 'Illegal cross sheet reference.';
			}
			this._token = new _Token(lit.replace('\"\"', '\"'), _TokenID.ATOM, _TokenType.LITERAL);
		}

		// Parse datetime token
		private _parseDate() {
			var i: number,
				c: string,
				lit: string;

			// look for end #
			for (i = 1; i + this._pointer < this._expressLength; i++) {
				c = this._expression[this._pointer + i];
				if (c === '#') {
					break;
				}
			}

			// check that we got the end of the date
			if (c !== '#') {
				throw 'Can\'t find final date delimiter ("#").';
			}

			// end of date
			lit = this._expression.substring(this._pointer + 1, this._pointer + i);
			this._pointer += i + 1;
			this._token = new _Token(Date.parse(lit), _TokenID.ATOM, _TokenType.LITERAL);
		}

		// Parse the sheet reference.
		private _parseSheetRef(): string {
			var i: number,
				c: string,
				cNext: string,
				lit: string;

			// look for end quote, skip double quotes
			for (i = 1; i + this._pointer < this._expressLength; i++) {
				c = this._expression[this._pointer + i];
				if (c !== '\'') {
					continue;
				}
				cNext = i + this._pointer < this._expressLength - 1 ? this._expression[this._pointer + i + 1] : ' ';
				if (cNext !== '\'') {
					break;
				}
				i++;
			}

			// check that we got the end of the string
			if (c !== '\'') {
				throw 'Can\'t find final quote.';
			}

			// end of string
			lit = this._expression.substring(this._pointer + 1, this._pointer + i);
			this._pointer += i + 1;
			if (this._expression[this._pointer] === '!') {
				return lit.replace(/\'\'/g, '\'');
			} else {
				return '';
			}
		}

		// Gets the cell range by the identifier.
		// For e.g. A1:C3 to cellRange(row=0, col=0, row1=2, col1=2)
		private _getCellRange(identifier: string): _ICellReferrence {
			var cells: string[],
				cell: _ICellReferrence,
				cell2: _ICellReferrence,
				sheetRef: string,
				rng: CellRange,
				rng2: CellRange;

			if (identifier) {
				cells = identifier.split(':');

				if (cells.length > 0 && cells.length < 3) {
					cell = this._parseCell(cells[0]);
					rng = cell.cellRange;

					if (rng && cells.length === 2) {
						cell2 = this._parseCell(cells[1]);
						rng2 = cell2.cellRange;

						if (cell.sheetRef && !cell2.sheetRef) {
							cell2.sheetRef = cell.sheetRef;
						}

						if (cell.sheetRef !== cell2.sheetRef) {
							throw 'The cell reference must be in the same sheet!'
						}

						if (rng2) {
							rng.col2 = rng2.col;
							rng.row2 = rng2.row;
						} else {
							rng = null;
						}
					}
				}
			}

			if (rng == null) {
				return null;
			}

			return {
				cellRange: rng,
				sheetRef: cell.sheetRef
			};
		}

		// Parse the single string cell identifier to cell range;
		// For e.g. A1 to cellRange(row=0, col=0).
		private _parseCellRange(cell: string): CellRange {
			var col = -1,
				row = -1,
				absCol = false,
				absRow = false,
				index: number,
				c: string;

			// parse column
			for (index = 0; index < cell.length; index++) {
				c = cell[index];

				if (c === '$' && !absCol) {
					absCol = true;
					continue;
				}
				if (!(c >= 'a' && c <= 'z') && !(c >= 'A' && c <= 'Z')) {
					break;
				}
				if (col < 0) {
					col = 0;
				}
				col = 26 * col + (c.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0) + 1);
			}

			// parse row
			for (; index < cell.length; index++) {
				c = cell[index];
				
				if (c === '$' && !absRow) {
					absRow = true;
					continue;
				}
				if (!(c >= '0' && c <= '9')) {
					break;
				}
				if (row < 0) {
					row = 0;
				}
				row = 10 * row + (+c - 0);
			}

			// sanity
			if (index < cell.length) {
				row = col = -1;
			}

			if (row === -1 || col === -1) {
				return null;
			}

			// done
			return new CellRange(row - 1, col - 1);
		}

		// Parse the single cell reference string to cell reference object.
		// For e.g. 'sheet1!A1' to { sheetRef: 'sheet1', cellRange: CellRange(row = 0, col = 0)}
		private _parseCell(cell: string): _ICellReferrence {
			var rng: CellRange,
				sheetRefIndex: number,
				cellsRef: string,
				sheetRef: string;

			sheetRefIndex = cell.lastIndexOf('!');

			if (sheetRefIndex > 0 && sheetRefIndex < cell.length - 1) {
				sheetRef = cell.substring(0, sheetRefIndex);
				cellsRef = cell.substring(sheetRefIndex + 1);
			} else if (sheetRefIndex <= 0) {
				cellsRef = cell;
			} else {
				return null;
			}

			rng = this._parseCellRange(cellsRef);

			return {
				cellRange: rng,
				sheetRef: sheetRef
			};
		}

		// Gets the parameters for the function.
		// e.g. myfun(a, b, c+2)
		private _getParameters() {
			// check whether next token is a (, 
			// restore state and bail if it's not
			var pos = this._pointer,
				tk = this._token,
				parms: Array<_Expression>,
				expr: _Expression;

			this._getToken();

			if (this._token.tokenID !== _TokenID.OPEN) {
				this._pointer = pos;
				this._token = tk;
				return null;
			}

			// check for empty Parameter list
			pos = this._pointer;
			this._getToken();
			if (this._token.tokenID === _TokenID.CLOSE) {
				return null;
			}
			this._pointer = pos;

			// get Parameters until we reach the end of the list
			parms = new Array();
			expr = this._parseExpression();
			parms.push(expr);
			while (this._token.tokenID === _TokenID.COMMA) {
				expr = this._parseExpression();
				parms.push(expr);
			}

			// make sure the list was closed correctly
			if (this._token.tokenID !== _TokenID.CLOSE) {
				throw 'Syntax error.';
			}

			// done
			return parms;
		}

		// Get the aggregate result for the CalcEngine.
		private _getAggregateResult(aggType: Aggregate, params: Array<_Expression>, sheet?: Sheet): any {
            var list = this._getItemList(params, sheet),
                result: any;

            result = getAggregate(aggType, list.items);
            if (list.isDate) {
                result = new Date(result);
            }
            return result;
		}

		// Get the flexsheet aggregate result for the CalcEngine
        private _getFlexSheetAggregateResult(aggType: _FlexSheetAggregate, params: Array<_Expression>, sheet?: Sheet): any {
            var list: _ICalcutationItems,
                sumList: _ICalcutationItems,
				num: number,
				order: number;

			switch (aggType) {
				case _FlexSheetAggregate.Count:
                    list = this._getItemList(params, sheet, true, false);
                    return this._countNumberCells(list.items);
				case _FlexSheetAggregate.CountA:
                    list = this._getItemList(params, sheet, false, false);
                    return list.items.length;
				case _FlexSheetAggregate.ConutBlank:
                    list = this._getItemList(params, sheet, false, true);
                    return this._countBlankCells(list.items);
				case _FlexSheetAggregate.Rank:
					num = _Expression.toNumber(params[0], sheet);
					order = params[2] ? _Expression.toNumber(params[2], sheet) : 0;
					if (isNaN(num)) {
						throw 'Invalid number.';
					}
					if (isNaN(order)) {
						throw 'Invalid order.';
					}
					params[1] = this._ensureNonFunctionExpression(<_Expression>params[1]);
					if (params[1] instanceof _CellRangeExpression) {
                        list = this._getItemList([params[1]], sheet);
                        return this._getRankOfCellRange(num, list.items, order);
					}
					throw 'Invalid Cell Reference.';
				case _FlexSheetAggregate.CountIf:
					params[0] = this._ensureNonFunctionExpression(<_Expression>params[0]);
					if (params[0] instanceof _CellRangeExpression) {
                        list = this._getItemList([params[0]], sheet, false);
                        return this._countCellsByCriterias([list.items], [params[1]], sheet);
					}
					throw 'Invalid Cell Reference.';
				case _FlexSheetAggregate.CountIfs:
					return this._handleCountIfs(params, sheet);
				case _FlexSheetAggregate.SumIf:
					params[0] = this._ensureNonFunctionExpression(<_Expression>params[0]);
					if (params[0] instanceof _CellRangeExpression) {
                        list = this._getItemList([params[0]], sheet, false);
						params[2] = this._ensureNonFunctionExpression(<_Expression>params[2]);
                        if (params[2] != null && params[2] instanceof _CellRangeExpression) {
                            sumList = this._getItemList([params[2]], sheet);
                        }
                        return this._sumCellsByCriterias([list.items], [params[1]], sumList ? sumList.items : null, sheet);
					}
					throw 'Invalid Cell Reference.';
				case _FlexSheetAggregate.SumIfs:
					return this._handleSumIfs(params, sheet);
				case _FlexSheetAggregate.Product:
                    list = this._getItemList(params, sheet);
                    return this._getProductOfNumbers(list.items);
			}

			throw 'Invalid aggregate type.';
		}

        // Get item list for aggregate processing.
        private _getItemList(params: Array<_Expression>, sheet?: Sheet, needParseToNum: boolean = true, isGetEmptyValue: boolean = false, isGetHiddenValue: boolean = true, columnIndex?: number): _ICalcutationItems {
            var items: Array<any> = new Array<any>(),
                item: any,
                index: number,
                cellIndex: number,
                cellValues: any[],
                param: _Expression,
                isDate = true;

			for (index = 0; index < params.length; index++) {
				param = params[index];
				// When meets the CellRangeExpression, 
				// we need set the value of the each cell in the cell range into the array to get the aggregate result.
				param = this._ensureNonFunctionExpression(<_Expression>param);
				if (param instanceof _CellRangeExpression) {
					cellValues = (<_CellRangeExpression>param).getValues(isGetHiddenValue, columnIndex, sheet);
					cells:
					for (cellIndex = 0; cellIndex < cellValues.length; cellIndex++) {
						item = cellValues[cellIndex];
                        if (!isGetEmptyValue && (item == null || item === '')) {
							continue cells;
                        }
                        isDate = isDate && (item instanceof Date);
						item = needParseToNum ? +item : item;
                        items.push(item);
					}
				} else {
					item = param instanceof _Expression ? param.evaluate(sheet) : param;
                    if (!isGetEmptyValue && (item == null || item === '')) {
						continue;
                    }
                    isDate = isDate && (item instanceof Date);
					item = needParseToNum ? +item : item;
					items.push(item);
				}
            }

            if (items.length === 0) {
                isDate = false;
            }

            return {
                isDate: isDate,
                items: items
            };
		}

		// Count blank cells
		private _countBlankCells(items: Array<any>): number {
			var i = 0,
				count = 0,
				item: any;

			for (; i < items.length; i++) {
				item = items[i];
				if (item == null || (isString(item) && item === '') || (isNumber(item) && isNaN(item))) {
					count++;
				}
			}

			return count;
		}

		// Count number cells
		private _countNumberCells(items: Array<any>): number {
			var i = 0,
				count = 0,
				item: any;

			for (; i < items.length; i++) {
				item = items[i];
				if (item != null && isNumber(item) && !isNaN(item)) {
					count++;
				}
			}

			return count;
		}

		// Get the rank for the number in the cell range.
		private _getRankOfCellRange(num: number, items: Array<any>, order: number = 0): number {
			var i = 0,
				rank = 0,
				item: any;

			// Sort the items list
			if (!order) {
				items.sort((a, b) => {
					if (isNaN(a) || isNaN(b)) {
						return 1;
					}
					return b - a;
				});
			} else {
				items.sort((a, b) => {
					if (isNaN(a) || isNaN(b)) {
						return -1;
					}
					return a - b;
				});
			}

			for (; i < items.length; i++) {
				item = items[i];
				if (isNaN(item)) {
					continue;
				}
				rank++;
				if (num === item) {
					return rank;
				}
			}

			throw num + ' is not in the cell range.';
		}

		// Handles the CountIfs function
		private _handleCountIfs(params: Array<_Expression>, sheet?: Sheet) {
            var i = 0,
				itemsList = [],
                critreiaList = [],
                list: _ICalcutationItems,
				cellExpr: _Expression,
				rowCount: number,
				colCount: number;
				
			if (params.length % 2 !== 0) {
				throw 'Invalid params.';
			}
			for (; i < params.length / 2; i++) {
				cellExpr = params[2 * i];
				cellExpr = this._ensureNonFunctionExpression(cellExpr);
				if (cellExpr instanceof _CellRangeExpression) {
					if (i === 0) {
						if ((<_CellRangeExpression>cellExpr).cells) {
							rowCount = (<_CellRangeExpression>cellExpr).cells.rowSpan;
							colCount = (<_CellRangeExpression>cellExpr).cells.columnSpan;
						} else {
							throw 'Invalid Cell Reference.';
						}
					} else {
						if (!(<_CellRangeExpression>cellExpr).cells) {
							throw 'Invalid Cell Reference.';
						} else if ((<_CellRangeExpression>cellExpr).cells.rowSpan !== rowCount || (<_CellRangeExpression>cellExpr).cells.columnSpan !== colCount){
							throw 'The row span and column span of each cell range has to be same with each other.';
						}
                    }
                    list = this._getItemList([cellExpr], sheet, false);
                    itemsList[i] = list.items;
					
					critreiaList[i] = params[2 * i + 1];
				} else {
					throw 'Invalid Cell Reference.';
				}
			}

			return this._countCellsByCriterias(itemsList, critreiaList, sheet);
		}

		// Count the cells that meet the criteria.
		private _countCellsByCriterias(itemsList: Array<any>[], criterias: _Expression[], sheet?: Sheet, countItems?: Array<any>): number {
			var i = 0,
				j = 0,
				count = 0,
				rangeLength = itemsList[0].length,
				parsedRightExprs = [],
				result: boolean,
				countItem: any,
				items: Array<any>,
				leftExpr: any,
				rightExpr: any;

			for (; j < criterias.length; j++) {
				rightExpr = _Expression.toString(criterias[j], sheet);
				if (rightExpr.length === 0) {
					throw 'Invalid Criteria.';
				}
				if (rightExpr === '*') {
					parsedRightExprs.push(rightExpr);
				} else {
					parsedRightExprs.push(this._parseRightExpr(rightExpr));
				}
			}

			for (; i < rangeLength; i++) {
				result = false;
				criteriaLoop:
				for (j = 0; j < itemsList.length; j++) {
					items = itemsList[j];

					leftExpr = items[i];
					rightExpr = parsedRightExprs[j];
					if (typeof rightExpr === 'string') {
						if (rightExpr !== '*' && (leftExpr == null || leftExpr === '')) {
							result = false;
							break criteriaLoop;
						}
						result = rightExpr === '*' || this.evaluate(this._combineExpr(leftExpr, rightExpr), null, sheet);
						if (!result) {
							break criteriaLoop;
						}
					} else {
						result = result = (<_IRegCriteria>rightExpr).reg.test(leftExpr.toString()) === (<_IRegCriteria>rightExpr).checkMathces;
						if (!result) {
							break criteriaLoop;
						}
					}
				}
				if (result) {
					if (countItems) {
						countItem = countItems[i];
						if (countItem != null && isNumber(countItem) && !isNaN(countItem)) {
							count++;
						}
					} else {
						count++;
					}
				}
			}

			return count;
		}

		// Handles the SumIfs function
		private _handleSumIfs(params: Array<_Expression>, sheet?: Sheet) {
			var i = 1,
				itemsList = [],
                critreiaList = [],
                list: _ICalcutationItems,
                sumList: _ICalcutationItems,
				sumCellExpr: _Expression,
				cellExpr: _Expression,
				rowCount: number,
				colCount: number;

			if (params.length % 2 !== 1) {
				throw 'Invalid params.';
			}

			sumCellExpr = params[0];
			sumCellExpr = this._ensureNonFunctionExpression(sumCellExpr);
			if (sumCellExpr instanceof _CellRangeExpression) {
				if ((<_CellRangeExpression>sumCellExpr).cells) {
					rowCount = (<_CellRangeExpression>sumCellExpr).cells.rowSpan;
					colCount = (<_CellRangeExpression>sumCellExpr).cells.columnSpan;
				} else {
					throw 'Invalid Sum Cell Reference.';
                }
                sumList = this._getItemList([sumCellExpr], sheet);
			} else {
				throw 'Invalid Sum Cell Reference.';
			}

			for (; i < (params.length + 1) / 2; i++) {
				cellExpr = params[2 * i - 1];
				cellExpr = this._ensureNonFunctionExpression(cellExpr);
				if (cellExpr instanceof _CellRangeExpression) {
					if (!(<_CellRangeExpression>cellExpr).cells) {
						throw 'Invalid Criteria Cell Reference.';
					} else if ((<_CellRangeExpression>cellExpr).cells.rowSpan !== rowCount || (<_CellRangeExpression>cellExpr).cells.columnSpan !== colCount) {
						throw 'The row span and column span of each cell range has to be same with each other.';
                    }
                    list = this._getItemList([cellExpr], sheet, false);
                    itemsList[i - 1] = list.items;

					critreiaList[i - 1] = params[2 * i];
				} else {
					throw 'Invalid Criteria Cell Reference.';
				}
			}

            return this._sumCellsByCriterias(itemsList, critreiaList, sumList.items, sheet);
		}

		// Gets the sum of the numeric values in the cells specified by a given criteria.
		private _sumCellsByCriterias(itemsList: Array<any>[], criterias: _Expression[], sumItems?: Array<any>, sheet?: Sheet): number {
			var i = 0,
				j = 0,
				sum = 0,
				sumItem: number,
				rangeLength = itemsList[0].length,
				parsedRightExprs = [],
				result: boolean,
				items: Array<any>,
				leftExpr: any,
				rightExpr: any;

			if (sumItems == null) {
				sumItems = itemsList[0];
			}

			for (; j < criterias.length; j++) {
				rightExpr = _Expression.toString(criterias[j], sheet);
				if (rightExpr.length === 0) {
					throw 'Invalid Criteria.';
				}
				if (rightExpr === '*') {
					parsedRightExprs.push(rightExpr);
				} else {
					parsedRightExprs.push(this._parseRightExpr(rightExpr));
				}
			}

			for (; i < rangeLength; i++) {
				result = false;
				sumItem = sumItems[i];

				criteriaLoop:
				for (j = 0; j < itemsList.length; j++) {
					items = itemsList[j];

					leftExpr = items[i];
					rightExpr = parsedRightExprs[j];
					if (typeof rightExpr === 'string') {
						if (rightExpr !== '*' && (leftExpr == null || leftExpr === '')) {
							result = false;
							break criteriaLoop;
						}
						result = rightExpr === '*' || this.evaluate(this._combineExpr(leftExpr, rightExpr), null, sheet);
						if (!result) {
							break criteriaLoop;
					}
				} else {
						result = (<_IRegCriteria>rightExpr).reg.test(leftExpr.toString()) === (<_IRegCriteria>rightExpr).checkMathces;
						if (!result) {
							break criteriaLoop;
						}
					}
				}
				if (result && isNumber(sumItem) && !isNaN(sumItem)) {
					sum += sumItem;
				}
			}

			return sum;
		}

		// Get product for numbers
		private _getProductOfNumbers(items: any[]) {
			var item: any,
				i = 0,
				product = 1,
				containsValidNum = false;

			if (items) {
				for (; i < items.length; i++) {
					item = items[i];
					if (isNumber(item) && !isNaN(item)) {
						product *= item;
						containsValidNum = true;
					}
				}
			}

			if (containsValidNum) {
				return product;
			}

			return 0;
		}

		//  Handle the subtotal function.
		private _handleSubtotal(params: Array<_Expression>, sheet: Sheet): any {
            var func: any,
                list: _ICalcutationItems,
                aggType: Aggregate,
                result: any,
				isGetHiddenValue = true;

			func = _Expression.toNumber(params[0], sheet);
			if ((func >= 1 && func <= 11) || (func >= 101 && func <= 111)) {
				if (func >= 101 && func <= 111) {
					isGetHiddenValue = false;
				}

				func = asEnum(func, _SubtotalFunction);

                list = this._getItemList(params.slice(1), sheet, true, false, isGetHiddenValue);

				switch (func) {
					case _SubtotalFunction.Count:
					case _SubtotalFunction.CountWithoutHidden:
                        return this._countNumberCells(list.items);
					case _SubtotalFunction.CountA:
					case _SubtotalFunction.CountAWithoutHidden:
                        return list.items.length;
					case _SubtotalFunction.Product:
					case _SubtotalFunction.ProductWithoutHidden:
                        return this._getProductOfNumbers(list.items);
					case _SubtotalFunction.Average:
					case _SubtotalFunction.AverageWithoutHidden:
						aggType = Aggregate.Avg;
						break;
					case _SubtotalFunction.Max:
					case _SubtotalFunction.MaxWithoutHidden:
						aggType = Aggregate.Max;
						break;
					case _SubtotalFunction.Min:
					case _SubtotalFunction.MinWithoutHidden:
						aggType = Aggregate.Min;
						break;
					case _SubtotalFunction.Std:
					case _SubtotalFunction.StdWithoutHidden:
						aggType = Aggregate.Std;
						break;
					case _SubtotalFunction.StdPop:
					case _SubtotalFunction.StdPopWithoutHidden:
						aggType = Aggregate.StdPop;
						break;
					case _SubtotalFunction.Sum:
					case _SubtotalFunction.SumWithoutHidden:
						aggType = Aggregate.Sum;
						break;
					case _SubtotalFunction.Var:
					case _SubtotalFunction.VarWithoutHidden:
						aggType = Aggregate.Var;
						break;
					case _SubtotalFunction.VarPop:
					case _SubtotalFunction.VarPopWithoutHidden:
						aggType = Aggregate.VarPop;
						break;
			    }

                result = getAggregate(aggType, list.items);
                if (list.isDate) {
                    result = new Date(result);
                }
                return result;
		    }

			throw 'Invalid Subtotal function.';
		}

		// Handle the DCount function.
		private _handleDCount(params: Array<_Expression>, sheet: Sheet) {
			var cellExpr = params[0],
				criteriaCellExpr = params[2],
				count = 0,
				field: any,
                columnIndex: number,
                list: _ICalcutationItems;

			cellExpr = this._ensureNonFunctionExpression(cellExpr);
			criteriaCellExpr = this._ensureNonFunctionExpression(criteriaCellExpr);

			if (cellExpr instanceof _CellRangeExpression && criteriaCellExpr instanceof _CellRangeExpression) {
				field = params[1].evaluate(sheet);
				columnIndex = this._getColumnIndexByField(<_CellRangeExpression>cellExpr, field);
                list = this._getItemList([cellExpr], sheet, true, false, true, columnIndex);
                if (list.items && list.items.length > 1) {
                    return this._DCountWithCriterias(list.items.slice(1), <_CellRangeExpression>cellExpr, <_CellRangeExpression>criteriaCellExpr);
				}
			}

			throw 'Invalid Count Cell Reference.';
		}

		// Counts the cells by the specified criterias.
		private _DCountWithCriterias(countItems: Array<any>, countRef: _CellRangeExpression, criteriaRef: _CellRangeExpression) {
			var criteriaCells = criteriaRef.cells,
				count = 0,
				countSheet: Sheet,
				criteriaSheet: Sheet,
				fieldRowIndex: number,
				rowIndex: number,
				colIndex: number,
				criteriaColIndex: number,
				criteria: any,
                criteriaField: any,
                list: _ICalcutationItems,
				itemsList: Array<any>[],
				criteriaList: any[];
				
			countSheet = this._getSheet(countRef.sheetRef);
			criteriaSheet = this._getSheet(criteriaRef.sheetRef);

			if (criteriaCells.rowSpan > 1) {
				fieldRowIndex = criteriaCells.topRow;
				for (rowIndex = criteriaCells.bottomRow; rowIndex > criteriaCells.topRow; rowIndex--) {
					itemsList = [];
					criteriaList = [];
					for (colIndex = criteriaCells.leftCol; colIndex <= criteriaCells.rightCol; colIndex++) {
						// Collects the criterias and related cell reference.
						criteria = this._owner.getCellValue(rowIndex, colIndex, false, criteriaSheet);
						if (criteria != null && criteria !== '') {
							criteriaList.push(new _Expression(criteria));

							criteriaField = this._owner.getCellValue(fieldRowIndex, colIndex, false, criteriaSheet);
							criteriaColIndex = this._getColumnIndexByField(countRef, criteriaField);
                            list = this._getItemList([countRef], countSheet, false, false, true, criteriaColIndex);
                            if (list.items != null && list.items.length > 1) {
                                itemsList.push(list.items.slice(1));
							} else {
								throw 'Invalid Count Cell Reference.';
							}
						}
					}

					count += this._countCellsByCriterias(itemsList, criteriaList, countSheet, countItems);
				}

				return count;
			}

			throw 'Invalid Criteria Cell Reference.'
		}

		// Get column index of the count cell range by the field.
		private _getColumnIndexByField(cellExpr: _CellRangeExpression, field: any) {
			var cells: CellRange,
				sheet: Sheet,
				columnIndex: number,
				value: any,
				rowIndex: number;

			cells = cellExpr.cells;
			rowIndex = cells.topRow;

			if (rowIndex === -1) {
				throw 'Invalid Count Cell Reference.';
			}

			if (isInt(field) && !isNaN(field)) {
				// if the field is integer, we consider the field it the column index of the count cell range.
				if (field >= 1 && field <= cells.columnSpan) {
					columnIndex = cells.leftCol + field - 1;
					return columnIndex;
				}
			} else {
				sheet = this._getSheet(cellExpr.sheetRef);
				for (columnIndex = cells.leftCol; columnIndex <= cells.rightCol; columnIndex++) {
					value = this._owner.getCellValue(rowIndex, columnIndex, false, sheet);
					field = isString(field) ? (<string>field).toLowerCase() : field;
					value = isString(value) ? (<string>value).toLowerCase() : value;
					if (field === value) {
						return columnIndex;
					}
				}
			}

			throw 'Invalid field.';
		}

		// Gets the sheet by the sheetRef.
		private _getSheet(sheetRef: string): Sheet {
			var i = 0,
				sheet: Sheet;

			if (sheetRef) {
				for (; i < this._owner.sheets.length; i++) {
					sheet = this._owner.sheets[i];

					if (sheet.name === sheetRef) {
						break;
					}
				}
			} 

			return sheet;
		}

		// Parse the right expression for countif countifs sumif and sumifs function.
		private _parseRightExpr(rightExpr: string): any {
			var match: string[],
				matchReg: RegExp,
				checkMathces = false;

			// Match the criteria that contains '?' such as '??match' and etc..
			if (rightExpr.indexOf('?') > -1 || rightExpr.indexOf('*') > -1) {
				match = rightExpr.match(/([\?\*]*)(\w+)([\?\*]*)(\w+)([\?\*]*)/);
				if (match != null && match.length === 6) {
					matchReg = new RegExp('^' + (match[1].length > 0 ? this._parseRegCriteria(match[1]) : '') + match[2]
						+ (match[3].length > 0 ? this._parseRegCriteria(match[3]) : '') + match[4]
						+ (match[5].length > 0 ? this._parseRegCriteria(match[5]) : '') + '$', 'i');
				} else {
					throw 'Invalid Criteria.';
				}

				if (/^[<>=]/.test(rightExpr)) {
					if (rightExpr.trim()[0] === '=') {
						checkMathces = true;
					}
				} else {
					checkMathces = true;
				}

				return {
					reg: matchReg,
					checkMathces: checkMathces
				};
			} else {
				if (!isNaN(+rightExpr)) {
					rightExpr = '=' + rightExpr;
				} else if (/^\w/.test(rightExpr)) {
					rightExpr = '="' + rightExpr + '"';
				} else if (/^[<>=]{1,2}\s*-?\w+$/.test(rightExpr)) {
					rightExpr = rightExpr.replace(/([<>=]{1,2})\s*(-?\w+)/, '$1"$2"');
				} else {
					throw 'Invalid Criteria.';
				}

				return rightExpr;
			}
		}

		// combine the left expression and right expression for countif countifs sumif and sumifs function.
		private _combineExpr(leftExpr: any, rightExpr: string): string {
			if (isString(leftExpr)) {
				leftExpr = '"' + leftExpr + '"';
			}
			leftExpr = '=' + leftExpr;

			return leftExpr + rightExpr;
		}

		// Parse regex criteria for '?' and '*'
		private _parseRegCriteria(criteria: string): string {
			var i = 0,
				questionMarkCnt = 0,
				regString = '';

			for (; i < criteria.length; i++) {
				if (criteria[i] === '*') {
					if (questionMarkCnt > 0) {
						regString += '\\w{' + questionMarkCnt + '}';
						questionMarkCnt = 0;
					}
					regString += '\\w*'
				} else if (criteria[i] === '?') {
					questionMarkCnt++;
				}
			}

			if (questionMarkCnt > 0) {
				regString += '\\w{' + questionMarkCnt + '}';
			}

			return regString;
		}

		// Calculate the rate.
		// The algorithm of the rate calculation refers http://stackoverflow.com/questions/3198939/recreate-excel-rate-function-using-newtons-method
		private _calculateRate(params: Array<_Expression>, sheet?: Sheet) {
			var FINANCIAL_PRECISION = 0.0000001,
				FINANCIAL_MAX_ITERATIONS = 20,
				i = 0,
				x0 = 0,
				x1: number,
				rate: number,
				nper: number,
				pmt: number,
				pv: number,
				fv: number,
				type: number,
				guess: number,
				y: number,
				f: number,
				y0: number,
				y1: number;

			nper = _Expression.toNumber(params[0], sheet);
			pmt = _Expression.toNumber(params[1], sheet);
			pv = _Expression.toNumber(params[2], sheet);
			fv = params[3] != null ? _Expression.toNumber(params[3], sheet) : 0;
			type = params[4] != null ? _Expression.toNumber(params[4], sheet) : 0;
			guess = params[5] != null ? _Expression.toNumber(params[5], sheet) : 0.1;

			rate = guess;
			if (Math.abs(rate) < FINANCIAL_PRECISION) {
				y = pv * (1 + nper * rate) + pmt * (1 + rate * type) * nper + fv;
			} else {
				f = Math.exp(nper * Math.log(1 + rate));
				y = pv * f + pmt * (1 / rate + type) * (f - 1) + fv;
			}
			y0 = pv + pmt * nper + fv;
			y1 = pv * f + pmt * (1 / rate + type) * (f - 1) + fv;

			// find root by secant method
			x1 = rate;
			while ((Math.abs(y0 - y1) > FINANCIAL_PRECISION) && (i < FINANCIAL_MAX_ITERATIONS)) {
				rate = (y1 * x0 - y0 * x1) / (y1 - y0);
				x0 = x1;
				x1 = rate;

				if (Math.abs(rate) < FINANCIAL_PRECISION) {
					y = pv * (1 + nper * rate) + pmt * (1 + rate * type) * nper + fv;
				} else {
					f = Math.exp(nper * Math.log(1 + rate));
					y = pv * f + pmt * (1 / rate + type) * (f - 1) + fv;
				}

				y0 = y1;
				y1 = y;
				++i;
			}

			if (Math.abs(y0 - y1) > FINANCIAL_PRECISION && i === FINANCIAL_MAX_ITERATIONS) {
				throw 'It is not able to calculate the rate with current parameters.';
			}

			return rate;
		}

		// Handle the hlookup function.
		private _handleHLookup(params: Array<_Expression>, sheet?: Sheet) {
			var lookupVal = (<_Expression>params[0]).evaluate(sheet),
				cellExpr = params[1],
				rowNum = _Expression.toNumber(params[2], sheet),
				approximateMatch = params[3] != null ? _Expression.toBoolean(params[3], sheet) : true,
				cells: CellRange,
				colNum: number;

			if (lookupVal == null || lookupVal == '') {
				throw 'Invalid lookup value.';
			}

			if (isNaN(rowNum) || rowNum < 0) {
				throw 'Invalid row index.';
			}

			cellExpr = this._ensureNonFunctionExpression(<_Expression>cellExpr);
			if (cellExpr instanceof _CellRangeExpression) {
				cells = (<_CellRangeExpression>cellExpr).cells;
				if (rowNum > cells.rowSpan) {
					throw 'Row index is out of the cell range.';
				}
				if (approximateMatch) {
					colNum = this._exactMatch(lookupVal, cells, sheet, false);
					if (colNum === -1) {
						colNum = this._approximateMatch(lookupVal, cells, sheet);
					}
				} else {
					colNum = this._exactMatch(lookupVal, cells, sheet);
				}

				if (colNum === -1) {
					throw 'Lookup Value is not found.';
				}

				return this._owner.getCellValue(cells.topRow + rowNum - 1, colNum, false, sheet);
			}
			throw 'Invalid Cell Reference.';
		}

		// Handle the exact match for the hlookup.
		private _exactMatch(lookupValue: any, cells: CellRange, sheet?: Sheet, needHandleWildCard: boolean = true): number {
			var rowIndex = cells.topRow,
				colIndex: number,
				value: any,
				match: any[],
				matchReg: RegExp;

			if (isString(lookupValue)) {
				lookupValue = (<string>lookupValue).toLowerCase();
			}

			// handle the wildcard question mark (?) and asterisk (*) for the lookup value.
			if (needHandleWildCard && isString(lookupValue) && ((<string>lookupValue).indexOf('?') > -1 || (<string>lookupValue).indexOf('*') > -1)) {
				match = (<string>lookupValue).match(/([\?\*]*)(\w+)([\?\*]*)(\w+)([\?\*]*)/);
				if (match != null && match.length === 6) {
					matchReg = new RegExp('^' + (match[1].length > 0 ? this._parseRegCriteria(match[1]) : '') + match[2]
						+ (match[3].length > 0 ? this._parseRegCriteria(match[3]) : '') + match[4]
						+ (match[5].length > 0 ? this._parseRegCriteria(match[5]) : '') + '$', 'i');
				} else {
					throw 'Invalid lookup value.';
				}
			}

			for (colIndex = cells.leftCol; colIndex <= cells.rightCol; colIndex++) {
				value = this._owner.getCellValue(rowIndex, colIndex, false, sheet);
				if (matchReg != null) {
					if (matchReg.test(value)) {
						return colIndex;
					}
				} else {
					if (isString(value)) {
						value = (<string>value).toLowerCase();
					}
					if (lookupValue === value) {
						return colIndex;
					}
				}
			}

			return -1;
		}

		// Handle the approximate match for the hlookup.
		private _approximateMatch(lookupValue: any, cells: CellRange, sheet?: Sheet) {
			var val: any,
				colIndex: number,
				rowIndex = cells.topRow,
				cellValues = [],
				i = 0;

			if (isString(lookupValue)) {
				lookupValue = (<string>lookupValue).toLowerCase();
			}

			for (colIndex = cells.leftCol; colIndex <= cells.rightCol; colIndex++) {
				val = this._owner.getCellValue(rowIndex, colIndex, false, sheet);
				val = isNaN(+val) ? val : +val;
				cellValues.push({value: val, index: colIndex});
			}

			// Sort the cellValues array with descent order.
			cellValues.sort((a, b) => {
				if (isString(a.value)) {
					a.value = (<string>a.value).toLowerCase();
				}
				if (isString(b.value)) {
					b.value = (<string>b.value).toLowerCase();
				}
				if (a.value > b.value) {
					return -1;
				} else if (a.value === b.value) {
					return b.index - a.index;
				}
				return 1;
			})

			for (; i < cellValues.length; i++) {
				val = cellValues[i];
				if (isString(val.value)) {
					val.value = (<string>val.value).toLowerCase();
				}
				// return the column index of the first value that less than lookup value.
				if (lookupValue > val.value) {
					return val.index;
				}
			}

			throw 'Lookup Value is not found.';
		}

		// Check the expression cache.
		private _checkCache(expression: string): _Expression {
			var expr = this._expressionCache[expression];

			if (expr) {
				return expr;
			} 

			expr = this._parse(expression);
			// when the size of the expression cache is greater than 10000,
			// We will release the expression cache.
			if (this._cacheSize > 10000) {
				this._clearExpressionCache();
			}
			this._expressionCache[expression] = expr;
			this._cacheSize++;

			return expr;
		}

		// Ensure current is not function expression.
		private _ensureNonFunctionExpression(expr: _Expression, sheet?: Sheet) {
			while (expr instanceof _FunctionExpression) {
				expr = expr.evaluate(sheet);
			}
			return expr;
		}
	}

	/*
	 * Defines the Token class.
	 *
	 * It assists the expression instance to evaluate value.
	 */
	export class _Token {
		private _tokenType: _TokenType;
		private _tokenID: _TokenID;
		private _value: any;

		/*
		 * Initializes a new instance of the @see:Token class.
		 *
		 * @param val The value of the token.
		 * @param tkID The @see:TokenID value of the token.
		 * @param tkType The @see:TokenType value of the token.
		 */
		constructor(val: any, tkID: _TokenID, tkType: _TokenType) {
			this._value = val;
			this._tokenID = tkID;
			this._tokenType = tkType;
		}

		/*
		 * Gets the value of the token instance.
		 */
		get value(): any {
			return this._value;
		}

		/*
		 * Gets the token ID of the token instance.
		 */
		get tokenID(): _TokenID {
			return this._tokenID;
		}

		/*
		 * Gets the token type of the token instance.
		 */
		get tokenType(): _TokenType {
			return this._tokenType;
		}
	}

	/*
	 * Function definition class (keeps function name, parameter counts, and function).
	 */
	export class _FunctionDefinition {
		private _paramMax: number = Number.MAX_VALUE;
		private _paramMin: number = Number.MIN_VALUE;
		private _func: Function;

		/*
		 * Initializes a new instance of the @see:FunctionDefinition class.
		 *
		 * @param func The function will be invoked by the CalcEngine.
		 * @param paramMax The maximum count of the parameter that the function need.
		 * @param paramMin The minimum count of the parameter that the function need.
		 */
		constructor(func: Function, paramMax?: number, paramMin?: number) {
			this._func = func;
			if (isNumber(paramMax) && !isNaN(paramMax)) {
				this._paramMax = paramMax;
			}
			if (isNumber(paramMin) && !isNaN(paramMin)) {
				this._paramMin = paramMin;
			}
		}

		/*
		 * Gets the paramMax of the FunctionDefinition instance.
		 */
		get paramMax(): number {
			return this._paramMax;
		}

		/*
		 * Gets the paramMin of the FunctionDefinition instance.
		 */
		get paramMin(): number {
			return this._paramMin;
		}

		/*
		 * Gets the func of the FunctionDefinition instance.
		 */
		get func(): Function {
			return this._func;
		}
	}

	/*
	 * Token types (used when building expressions, sequence defines operator priority)
	 */
	export enum _TokenType {
		/*
		 * This token type includes '<', '>', '=', '<=', '>=' and '<>'.
		 */
		COMPARE,
		/*
		 * This token type includes '+' and '-'.
		 */
		ADDSUB,
		/*
		 * This token type includes '*' and '/'.
		 */
		MULDIV,
		/*
		 * This token type includes '^'.
		 */
		POWER,
		/*
		 * This token type includes '&'.
		 */
		CONCAT,
		/*
		 * This token type includes '(' and ')'.
		 */
		GROUP,
		/*
		 * This token type includes number value, string value and etc..
		 */
		LITERAL,
		/*
		 * This token type includes function.
		 */
		IDENTIFIER 
	}

	/*
	 * Token ID (used when evaluating expressions)
	 */
	export enum _TokenID {
		/*
		 * Greater than.
		 */
		GT,
		/*
		 * Less than.
		 */
		LT,
		/*
		 * Greater than or equal to.
		 */
		GE,
		/*
		 * Less than or equal to.
		 */
		LE,
		/*
		 * Equal to.
		 */
		EQ,
		/*
		 * Not equal to.
		 */
		NE,
		/*
		 * Addition.
		 */
		ADD,
		/*
		 * Subtraction.
		 */
		SUB, 
		/*
		 * Multiplication.
		 */
		MUL,
		/*
		 * Division.
		 */
		DIV,
		/*
		 * Gets quotient of division.
		 */
		DIVINT,
		/*
		 * Gets remainder of division.
		 */
		MOD,
		/*
		 * Power.
		 */
		POWER,
		/*
		 * String concat.
		 */
		CONCAT,
		/*
		 * Opening bracket.
		 */
		OPEN,
		/*
		 * Closing bracket.
		 */
		CLOSE,
		/*
		 * Group end.
		 */
		END,
		/*
		 * Comma.
		 */
		COMMA,
		/*
		 * Period.
		 */
		PERIOD,
		/*
		 * Literal token
		 */
		ATOM
	}

	/*
	 * Specifies the type of aggregate for flexsheet.
	 */
	enum _FlexSheetAggregate {
		/*
		 * Counts the number of cells that contain numbers, and counts numbers within the list of arguments.
		 */
		Count,
		/*
		 * Returns the number of cells that are not empty in a range.
		 */
		CountA,
		/*
		 * Returns the number of empty cells in a specified range of cells.
		 */
		ConutBlank,
		/*
		 * Returns the number of the cells that meet the criteria you specify in the argument.
		 */
		CountIf,
		/*
		 * Returns the number of the cells that meet multiple criteria.
		 */
		CountIfs,
		/*
		 * Returns the rank of a number in a list of numbers.
		 */
		Rank,
		/*
		 * Returns the sum of the numeric values in the cells specified by a given criteria.
		 */
		SumIf,
		/*
		 * Returns the sum of the numeric values in the cells specified by a multiple criteria.
		 */
		SumIfs,
		/*
		 * Multiplies all the numbers given as arguments and returns the product.
		 */
		Product
	}

	/*
	 * Specifies the type of subtotal f to calculate over a group of values.
	 */
	enum _SubtotalFunction {
		/*
		 * Returns the average value of the numeric values in the group.
		 */
		Average = 1,
		/*
		 * Counts the number of cells that contain numbers, and counts numbers within the list of arguments.
		 */
		Count = 2,
		/*
		 * Counts the number of cells that are not empty in a range.
		 */
		CountA = 3,
		/*
		 * Returns the maximum value in the group.
		 */
		Max = 4,
		/*
		 * Returns the minimum value in the group.
		 */
		Min = 5,
		/*
		 * Multiplies all the numbers given as arguments and returns the product.
		 */
		Product = 6,
		/*
		 *Returns the sample standard deviation of the numeric values in the group 
		 * (uses the formula based on n-1).
		 */
		Std = 7,
		/*
		 *Returns the population standard deviation of the values in the group 
		 * (uses the formula based on n).
		 */
		StdPop = 8,
		/*
		 * Returns the sum of the numeric values in the group.
		 */
		Sum = 9,
		/*
		 * Returns the sample variance of the numeric values in the group 
		 * (uses the formula based on n-1).
		 */
		Var = 10,
		/*
		 * Returns the population variance of the values in the group 
		 * (uses the formula based on n).
		 */
		VarPop = 11,
		/*
		 * Returns the average value of the numeric values in the group and ignores the hidden rows and columns.
		 */
		AverageWithoutHidden = 101,
		/*
		 * Counts the number of cells that contain numbers, and counts numbers within the list of arguments and ignores the hidden rows and columns.
		 */
		CountWithoutHidden = 102,
		/*
		 * Counts the number of cells that are not empty in a range and ignores the hidden rows and columns.
		 */
		CountAWithoutHidden = 103,
		/*
		 * Returns the maximum value in the group and ignores the hidden rows and columns.
		 */
		MaxWithoutHidden = 104,
		/*
		 * Multiplies all the numbers given as arguments and returns the product and ignores the hidden rows and columns.
		 */
		MinWithoutHidden = 105,
		/*
		 * Multiplies all the numbers given as arguments and returns the product and ignores the hidden rows and columns.
		 */
		ProductWithoutHidden = 106,
		/*
		 *Returns the sample standard deviation of the numeric values in the group 
		 * (uses the formula based on n-1) and ignores the hidden rows and columns.
		 */
		StdWithoutHidden = 107,
		/*
		 *Returns the population standard deviation of the values in the group 
		 * (uses the formula based on n) and ignores the hidden rows and columns.
		 */
		StdPopWithoutHidden = 108,
		/*
		 * Returns the sum of the numeric values in the group and ignores the hidden rows and columns.
		 */
		SumWithoutHidden = 109,
		/*
		 * Returns the sample variance of the numeric values in the group 
		 * (uses the formula based on n-1) and ignores the hidden rows and columns.
		 */
		VarWithoutHidden = 110,
		/*
		 * Returns the population variance of the values in the group 
		 * (uses the formula based on n) and ignores the hidden rows and columns.
		 */
		VarPopWithoutHidden = 111
	}

	/*
	 * Cell reference information
	 */
	interface _ICellReferrence {
		/*
		 * Cell range.
		 */
		cellRange: CellRange;
		/*
		 * The sheet name of the sheet which the cells range refers.
		 */
		sheetRef: string;
	}

	/*
	 * Prensents the regex expression criteria.
	 */
	interface _IRegCriteria {
		/*
		 * The match regex expression.
		 */
		reg: RegExp;
		/*
		 * Indicates whether the regex expression should match the text or not.
		 */
		checkMathces: boolean;
    }

    /*
     * The Calculation list
     */
    interface _ICalcutationItems {
        /*
         * Indicates whether the all the items are date instance.
         */
        isDate: boolean;
        /*
         * The items for calculation.
         */
        items: Array<any>;
    }
}