var wijmo;
(function (wijmo) {
    var grid;
    (function (grid) {
        var sheet;
        (function (sheet_1) {
            'use strict';
            /*
             * Defines the CalcEngine class.
             *
             * It deals with the calculation for the flexsheet control.
             */
            var _CalcEngine = (function () {
                /*
                 * Initializes a new instance of the @see:CalcEngine class.
                 *
                 * @param owner The @see: FlexSheet control that the CalcEngine works for.
                 */
                function _CalcEngine(owner) {
                    this._expressionCache = {};
                    this._idChars = '$:!';
                    this._functionTable = {};
                    this._cacheSize = 0;
                    /*
                     * Occurs when the @see:_CalcEngine meets the unknown formula.
                     */
                    this.unknownFunction = new wijmo.Event();
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
                 * Raises the unknownFunction event.
                 */
                _CalcEngine.prototype.onUnknownFunction = function (funcName, params) {
                    var paramsList, eventArgs;
                    if (params && params.length > 0) {
                        paramsList = [];
                        for (var i = 0; i < params.length; i++) {
                            paramsList[i] = params[i].evaluate();
                        }
                    }
                    eventArgs = new sheet_1.UnknownFunctionEventArgs(funcName, paramsList);
                    this.unknownFunction.raise(this, eventArgs);
                    if (eventArgs.value != null) {
                        return new sheet_1._Expression(eventArgs.value);
                    }
                    throw 'The function "' + funcName + '"' + ' has not supported in FlexSheet yet.';
                };
                /*
                 * Evaluates an expression.
                 *
                 * @param expression the expression need to be evaluated to value.
                 * @param format the format string used to convert raw values into display.
                 * @param sheet The @see:Sheet is referenced by the @see:Expression.
                 * @param rowIndex The row index of the cell where the expression located in.
                 * @param columnIndex The column index of the cell where the expression located in.
                 */
                _CalcEngine.prototype.evaluate = function (expression, format, sheet, rowIndex, columnIndex) {
                    var expr, result;
                    try {
                        if (expression && expression.length > 1 && expression[0] === '=') {
                            expr = this._checkCache(expression);
                            result = expr.evaluate(sheet, rowIndex, columnIndex);
                            while (result instanceof sheet_1._Expression) {
                                result = result.evaluate(sheet);
                            }
                            if (format && wijmo.isPrimitive(result)) {
                                return wijmo.Globalize.format(result, format);
                            }
                            return result;
                        }
                        return expression ? expression : '';
                    }
                    catch (e) {
                        return "Error: " + e;
                    }
                };
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
                _CalcEngine.prototype.addCustomFunction = function (name, func, minParamsCount, maxParamsCount) {
                    var self = this;
                    name = name.toLowerCase();
                    this._functionTable[name] = new _FunctionDefinition(function (params) {
                        var param, paramsList = [];
                        if (params.length > 0) {
                            for (var i = 0; i < params.length; i++) {
                                param = params[i];
                                if (param instanceof sheet_1._CellRangeExpression) {
                                    paramsList[i] = param.cells;
                                }
                                else {
                                    paramsList[i] = param.evaluate();
                                }
                            }
                        }
                        return func.apply(self, paramsList);
                    }, maxParamsCount, minParamsCount);
                };
                // Clear the expression cache.
                _CalcEngine.prototype._clearExpressionCache = function () {
                    this._expressionCache = null;
                    this._expressionCache = {};
                    this._cacheSize = 0;
                };
                // Parse the string expression to an Expression instance that can be evaluated to value.
                _CalcEngine.prototype._parse = function (expression) {
                    this._expression = expression;
                    this._expressLength = expression ? expression.length : 0;
                    this._pointer = 0;
                    // skip leading equals sign
                    if (this._expressLength > 0 && this._expression[0] === '=') {
                        this._pointer++;
                    }
                    return this._parseExpression();
                };
                // Build static token table.
                _CalcEngine.prototype._buildSymbolTable = function () {
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
                };
                // Register the aggregate function for the CalcEngine.
                _CalcEngine.prototype._registerAggregateFunction = function () {
                    var self = this;
                    self._functionTable['sum'] = new _FunctionDefinition(function (params, sheet) {
                        return self._getAggregateResult(wijmo.Aggregate.Sum, params, sheet);
                    });
                    self._functionTable['average'] = new _FunctionDefinition(function (params, sheet) {
                        return self._getAggregateResult(wijmo.Aggregate.Avg, params, sheet);
                    });
                    self._functionTable['max'] = new _FunctionDefinition(function (params, sheet) {
                        return self._getAggregateResult(wijmo.Aggregate.Max, params, sheet);
                    });
                    self._functionTable['min'] = new _FunctionDefinition(function (params, sheet) {
                        return self._getAggregateResult(wijmo.Aggregate.Min, params, sheet);
                    });
                    self._functionTable['var'] = new _FunctionDefinition(function (params, sheet) {
                        return self._getAggregateResult(wijmo.Aggregate.Var, params, sheet);
                    });
                    self._functionTable['varp'] = new _FunctionDefinition(function (params, sheet) {
                        return self._getAggregateResult(wijmo.Aggregate.VarPop, params, sheet);
                    });
                    self._functionTable['stdev'] = new _FunctionDefinition(function (params, sheet) {
                        return self._getAggregateResult(wijmo.Aggregate.Std, params, sheet);
                    });
                    self._functionTable['stdevp'] = new _FunctionDefinition(function (params, sheet) {
                        return self._getAggregateResult(wijmo.Aggregate.StdPop, params, sheet);
                    });
                    self._functionTable['count'] = new _FunctionDefinition(function (params, sheet) {
                        return self._getFlexSheetAggregateResult(_FlexSheetAggregate.Count, params, sheet);
                    });
                    self._functionTable['counta'] = new _FunctionDefinition(function (params, sheet) {
                        return self._getFlexSheetAggregateResult(_FlexSheetAggregate.CountA, params, sheet);
                    });
                    self._functionTable['countblank'] = new _FunctionDefinition(function (params, sheet) {
                        return self._getFlexSheetAggregateResult(_FlexSheetAggregate.ConutBlank, params, sheet);
                    });
                    self._functionTable['countif'] = new _FunctionDefinition(function (params, sheet) {
                        return self._getFlexSheetAggregateResult(_FlexSheetAggregate.CountIf, params, sheet);
                    }, 2, 2);
                    self._functionTable['countifs'] = new _FunctionDefinition(function (params, sheet) {
                        return self._getFlexSheetAggregateResult(_FlexSheetAggregate.CountIfs, params, sheet);
                    }, 254, 2);
                    self._functionTable['sumif'] = new _FunctionDefinition(function (params, sheet) {
                        return self._getFlexSheetAggregateResult(_FlexSheetAggregate.SumIf, params, sheet);
                    }, 3, 2);
                    self._functionTable['sumifs'] = new _FunctionDefinition(function (params, sheet) {
                        return self._getFlexSheetAggregateResult(_FlexSheetAggregate.SumIfs, params, sheet);
                    }, 255, 2);
                    self._functionTable['rank'] = new _FunctionDefinition(function (params, sheet) {
                        return self._getFlexSheetAggregateResult(_FlexSheetAggregate.Rank, params, sheet);
                    }, 3, 2);
                    self._functionTable['product'] = new _FunctionDefinition(function (params, sheet) {
                        return self._getFlexSheetAggregateResult(_FlexSheetAggregate.Product, params, sheet);
                    }, 255, 1);
                    self._functionTable['subtotal'] = new _FunctionDefinition(function (params, sheet) {
                        return self._handleSubtotal(params, sheet);
                    }, 255, 2);
                    self._functionTable['dcount'] = new _FunctionDefinition(function (params, sheet) {
                        return self._handleDCount(params, sheet);
                    }, 3, 3);
                };
                // Register the math function for the calcEngine.
                _CalcEngine.prototype._registerMathFunction = function () {
                    var self = this, unaryFuncs = ['abs', 'acos', 'asin', 'atan', 'ceiling', 'cos', 'exp', 'floor', 'ln', 'sin', 'sqrt', 'tan'], roundFuncs = ['round', 'rounddown', 'roundup'];
                    self._functionTable['pi'] = new _FunctionDefinition(function () {
                        return Math.PI;
                    }, 0, 0);
                    self._functionTable['rand'] = new _FunctionDefinition(function () {
                        return Math.random();
                    }, 0, 0);
                    self._functionTable['power'] = new _FunctionDefinition(function (params, sheet) {
                        return Math.pow(sheet_1._Expression.toNumber(params[0], sheet), sheet_1._Expression.toNumber(params[1], sheet));
                    }, 2, 2);
                    self._functionTable['atan2'] = new _FunctionDefinition(function (params, sheet) {
                        var x = sheet_1._Expression.toNumber(params[0], sheet), y = sheet_1._Expression.toNumber(params[1], sheet);
                        if (x === 0 && y === 0) {
                            throw 'The x number and y number can\'t both be zero for the atan2 function';
                        }
                        return Math.atan2(y, x);
                    }, 2, 2);
                    self._functionTable['mod'] = new _FunctionDefinition(function (params, sheet) {
                        return sheet_1._Expression.toNumber(params[0], sheet) % sheet_1._Expression.toNumber(params[1], sheet);
                    }, 2, 2);
                    self._functionTable['trunc'] = new _FunctionDefinition(function (params, sheet) {
                        var num = sheet_1._Expression.toNumber(params[0], sheet), precision = params.length === 2 ? sheet_1._Expression.toNumber(params[1], sheet) : 0, multiple;
                        if (precision === 0) {
                            if (num >= 0) {
                                return Math.floor(num);
                            }
                            else {
                                return Math.ceil(num);
                            }
                        }
                        else {
                            multiple = Math.pow(10, precision);
                            if (num >= 0) {
                                return Math.floor(num * multiple) / multiple;
                            }
                            else {
                                return Math.ceil(num * multiple) / multiple;
                            }
                        }
                    }, 2, 1);
                    roundFuncs.forEach(function (val) {
                        self._functionTable[val] = new _FunctionDefinition(function (params, sheet) {
                            var num = sheet_1._Expression.toNumber(params[0], sheet), precision = sheet_1._Expression.toNumber(params[1], sheet), result, format, multiple;
                            if (precision === 0) {
                                switch (val) {
                                    case 'rounddown':
                                        if (num >= 0) {
                                            result = Math.floor(num);
                                        }
                                        else {
                                            result = Math.ceil(num);
                                        }
                                        break;
                                    case 'roundup':
                                        if (num >= 0) {
                                            result = Math.ceil(num);
                                        }
                                        else {
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
                            }
                            else if (precision > 0 && wijmo.isInt(precision)) {
                                multiple = Math.pow(10, precision);
                                switch (val) {
                                    case 'rounddown':
                                        if (num >= 0) {
                                            result = Math.floor(num * multiple) / multiple;
                                        }
                                        else {
                                            result = Math.ceil(num * multiple) / multiple;
                                        }
                                        break;
                                    case 'roundup':
                                        if (num >= 0) {
                                            result = Math.ceil(num * multiple) / multiple;
                                        }
                                        else {
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
                    unaryFuncs.forEach(function (val) {
                        self._functionTable[val] = new _FunctionDefinition(function (params, sheet) {
                            switch (val) {
                                case 'ceiling':
                                    return Math.ceil(sheet_1._Expression.toNumber(params[0], sheet));
                                case 'ln':
                                    return Math.log(sheet_1._Expression.toNumber(params[0], sheet));
                                default:
                                    return Math[val](sheet_1._Expression.toNumber(params[0], sheet));
                            }
                        }, 1, 1);
                    });
                };
                // Register the logical function for the calcEngine.
                _CalcEngine.prototype._registerLogicalFunction = function () {
                    // and(true,true,false,...)
                    this._functionTable['and'] = new _FunctionDefinition(function (params, sheet) {
                        var result = true, index;
                        for (index = 0; index < params.length; index++) {
                            result = result && sheet_1._Expression.toBoolean(params[index], sheet);
                            if (!result) {
                                break;
                            }
                        }
                        return result;
                    }, Number.MAX_VALUE, 1);
                    // or(false,true,true,...)
                    this._functionTable['or'] = new _FunctionDefinition(function (params, sheet) {
                        var result = false, index;
                        for (index = 0; index < params.length; index++) {
                            result = result || sheet_1._Expression.toBoolean(params[index], sheet);
                            if (result) {
                                break;
                            }
                        }
                        return result;
                    }, Number.MAX_VALUE, 1);
                    // not(false)
                    this._functionTable['not'] = new _FunctionDefinition(function (params, sheet) {
                        return !sheet_1._Expression.toBoolean(params[0], sheet);
                    }, 1, 1);
                    // if(true,a,b)
                    this._functionTable['if'] = new _FunctionDefinition(function (params, sheet) {
                        return sheet_1._Expression.toBoolean(params[0], sheet) ? params[1].evaluate(sheet) : params[2].evaluate(sheet);
                    }, 3, 3);
                    // true()
                    this._functionTable['true'] = new _FunctionDefinition(function () {
                        return true;
                    }, 0, 0);
                    // false()
                    this._functionTable['false'] = new _FunctionDefinition(function () {
                        return false;
                    }, 0, 0);
                };
                // register the text process function
                _CalcEngine.prototype._registerTextFunction = function () {
                    // char(65, 66, 67,...) => "abc"
                    this._functionTable['char'] = new _FunctionDefinition(function (params, sheet) {
                        var index, result = '';
                        for (index = 0; index < params.length; index++) {
                            result += String.fromCharCode(sheet_1._Expression.toNumber(params[index], sheet));
                        }
                        return result;
                    }, Number.MAX_VALUE, 1);
                    // code("A")
                    this._functionTable['code'] = new _FunctionDefinition(function (params, sheet) {
                        var str = sheet_1._Expression.toString(params[0], sheet);
                        if (str && str.length > 0) {
                            return str.charCodeAt(0);
                        }
                        return -1;
                    }, 1, 1);
                    // concatenate("abc","def","ghi",...) => "abcdefghi"
                    this._functionTable['concatenate'] = new _FunctionDefinition(function (params, sheet) {
                        var index, result = '';
                        for (index = 0; index < params.length; index++) {
                            result = result.concat(sheet_1._Expression.toString(params[index], sheet));
                        }
                        return result;
                    }, Number.MAX_VALUE, 1);
                    // left("Abcdefgh", 5) => "Abcde"
                    this._functionTable['left'] = new _FunctionDefinition(function (params, sheet) {
                        var str = sheet_1._Expression.toString(params[0], sheet), length = Math.floor(sheet_1._Expression.toNumber(params[1], sheet));
                        if (str && str.length > 0) {
                            return str.slice(0, length);
                        }
                        return undefined;
                    }, 2, 2);
                    // right("Abcdefgh", 5) => "defgh"
                    this._functionTable['right'] = new _FunctionDefinition(function (params, sheet) {
                        var str = sheet_1._Expression.toString(params[0], sheet), length = Math.floor(sheet_1._Expression.toNumber(params[1], sheet));
                        if (str && str.length > 0) {
                            return str.slice(-length);
                        }
                        return undefined;
                    }, 2, 2);
                    // find("abc", "abcdefgh") 
                    // this function is case-sensitive.
                    this._functionTable['find'] = new _FunctionDefinition(function (params, sheet) {
                        var search = sheet_1._Expression.toString(params[0], sheet), text = sheet_1._Expression.toString(params[1], sheet), result;
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
                    this._functionTable['search'] = new _FunctionDefinition(function (params, sheet) {
                        var search = sheet_1._Expression.toString(params[0], sheet), text = sheet_1._Expression.toString(params[1], sheet), searchRegExp, result;
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
                    this._functionTable['len'] = new _FunctionDefinition(function (params, sheet) {
                        var str = sheet_1._Expression.toString(params[0], sheet);
                        if (str) {
                            return str.length;
                        }
                        return -1;
                    }, 1, 1);
                    //  mid("abcdefgh", 2, 3) => "bcd"
                    this._functionTable['mid'] = new _FunctionDefinition(function (params, sheet) {
                        var text = sheet_1._Expression.toString(params[0], sheet), start = Math.floor(sheet_1._Expression.toNumber(params[1], sheet)), length = Math.floor(sheet_1._Expression.toNumber(params[2], sheet));
                        if (text && text.length > 0 && start > 0) {
                            return text.substr(start - 1, length);
                        }
                        return undefined;
                    }, 3, 3);
                    // lower("ABCDEFGH")
                    this._functionTable['lower'] = new _FunctionDefinition(function (params, sheet) {
                        var str = sheet_1._Expression.toString(params[0], sheet);
                        if (str && str.length > 0) {
                            return str.toLowerCase();
                        }
                        return undefined;
                    }, 1, 1);
                    // upper("abcdefgh")
                    this._functionTable['upper'] = new _FunctionDefinition(function (params, sheet) {
                        var str = sheet_1._Expression.toString(params[0], sheet);
                        if (str && str.length > 0) {
                            return str.toUpperCase();
                        }
                        return undefined;
                    }, 1, 1);
                    // proper("abcdefgh") => "Abcdefgh"
                    this._functionTable['proper'] = new _FunctionDefinition(function (params, sheet) {
                        var str = sheet_1._Expression.toString(params[0], sheet);
                        if (str && str.length > 0) {
                            return str[0].toUpperCase() + str.substring(1).toLowerCase();
                        }
                        return undefined;
                    }, 1, 1);
                    // trim("   abcdefgh   ") => "abcdefgh"
                    this._functionTable['trim'] = new _FunctionDefinition(function (params, sheet) {
                        var str = sheet_1._Expression.toString(params[0], sheet);
                        if (str && str.length > 0) {
                            return str.trim();
                        }
                        return undefined;
                    }, 1, 1);
                    // replace("abcdefg", 2, 3, "xyz") => "axyzefg"
                    this._functionTable['replace'] = new _FunctionDefinition(function (params, sheet) {
                        var text = sheet_1._Expression.toString(params[0], sheet), start = Math.floor(sheet_1._Expression.toNumber(params[1], sheet)), length = Math.floor(sheet_1._Expression.toNumber(params[2], sheet)), replaceText = sheet_1._Expression.toString(params[3], sheet);
                        if (text && text.length > 0 && start > 0) {
                            return text.substring(0, start - 1) + replaceText + text.slice(start - 1 + length);
                        }
                        return undefined;
                    }, 4, 4);
                    // substitute("abcabcdabcdefgh", "ab", "xy") => "xycxycdxycdefg"
                    this._functionTable['substitute'] = new _FunctionDefinition(function (params, sheet) {
                        var text = sheet_1._Expression.toString(params[0], sheet), oldText = sheet_1._Expression.toString(params[1], sheet), newText = sheet_1._Expression.toString(params[2], sheet), searhRegExp;
                        if (text && text.length > 0 && oldText && oldText.length > 0) {
                            searhRegExp = new RegExp(oldText, 'g');
                            return text.replace(searhRegExp, newText);
                        }
                        return undefined;
                    }, 3, 3);
                    // rept("abc", 3) => "abcabcabc"
                    this._functionTable['rept'] = new _FunctionDefinition(function (params, sheet) {
                        var text = sheet_1._Expression.toString(params[0], sheet), repeatTimes = Math.floor(sheet_1._Expression.toNumber(params[1], sheet)), result = '', i;
                        if (text && text.length > 0 && repeatTimes > 0) {
                            for (i = 0; i < repeatTimes; i++) {
                                result = result.concat(text);
                            }
                        }
                        return result;
                    }, 2, 2);
                    // text("1234", "n2") => "1234.00"
                    this._functionTable['text'] = new _FunctionDefinition(function (params, sheet) {
                        var value = params[0].evaluate(), format = sheet_1._Expression.toString(params[1], sheet);
                        return wijmo.Globalize.format(value, format);
                    }, 2, 2);
                    // value("1234") => 1234
                    this._functionTable['value'] = new _FunctionDefinition(function (params, sheet) {
                        return sheet_1._Expression.toNumber(params[0], sheet);
                    }, 1, 1);
                };
                // Register the datetime function for the calcEngine.
                _CalcEngine.prototype._registerDateFunction = function () {
                    this._functionTable['now'] = new _FunctionDefinition(function () {
                        return {
                            value: new Date(),
                            format: 'M/d/yyyy h:mm'
                        };
                    }, 0, 0);
                    this._functionTable['today'] = new _FunctionDefinition(function () {
                        return {
                            value: new Date(),
                            format: 'd'
                        };
                    }, 0, 0);
                    // year("11/25/2015") => 2015
                    this._functionTable['year'] = new _FunctionDefinition(function (params, sheet) {
                        var date = sheet_1._Expression.toDate(params[0], sheet);
                        if (!wijmo.isPrimitive(date) && date) {
                            return date.value;
                        }
                        if (wijmo.isDate(date)) {
                            return date.getFullYear();
                        }
                        return 1900;
                    }, 1, 1);
                    // month("11/25/2015") => 11
                    this._functionTable['month'] = new _FunctionDefinition(function (params, sheet) {
                        var date = sheet_1._Expression.toDate(params[0], sheet);
                        if (!wijmo.isPrimitive(date) && date) {
                            return date.value;
                        }
                        if (wijmo.isDate(date)) {
                            return date.getMonth() + 1;
                        }
                        return 1;
                    }, 1, 1);
                    // day("11/25/2015") => 25
                    this._functionTable['day'] = new _FunctionDefinition(function (params, sheet) {
                        var date = sheet_1._Expression.toDate(params[0], sheet);
                        if (!wijmo.isPrimitive(date) && date) {
                            return date.value;
                        }
                        if (wijmo.isDate(date)) {
                            return date.getDate();
                        }
                        return 0;
                    }, 1, 1);
                    // hour("11/25/2015 16:50") => 16 or hour(0.5) => 12
                    this._functionTable['hour'] = new _FunctionDefinition(function (params, sheet) {
                        var val = params[0].evaluate(sheet);
                        if (wijmo.isNumber(val) && !isNaN(val)) {
                            return Math.floor(24 * (val - Math.floor(val)));
                        }
                        else if (wijmo.isDate(val)) {
                            return val.getHours();
                        }
                        val = sheet_1._Expression.toDate(params[0], sheet);
                        if (!wijmo.isPrimitive(val) && val) {
                            val = val.value;
                        }
                        if (wijmo.isDate(val)) {
                            return val.getHours();
                        }
                        throw 'Invalid parameter.';
                    }, 1, 1);
                    // time(10, 23, 11) => 10:23:11 AM
                    this._functionTable['time'] = new _FunctionDefinition(function (params, sheet) {
                        var hour = params[0].evaluate(sheet), minute = params[1].evaluate(sheet), second = params[2].evaluate(sheet);
                        if (wijmo.isNumber(hour) && wijmo.isNumber(minute) && wijmo.isNumber(second)) {
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
                    this._functionTable['date'] = new _FunctionDefinition(function (params, sheet) {
                        var year = params[0].evaluate(sheet), month = params[1].evaluate(sheet), day = params[2].evaluate(sheet);
                        if (wijmo.isNumber(year) && wijmo.isNumber(month) && wijmo.isNumber(day)) {
                            return {
                                value: new Date(year, month - 1, day),
                                format: 'd'
                            };
                        }
                        throw 'Invalid parameters.';
                    }, 3, 3);
                    this._functionTable['datedif'] = new _FunctionDefinition(function (params, sheet) {
                        var startDate = sheet_1._Expression.toDate(params[0], sheet), endDate = sheet_1._Expression.toDate(params[1], sheet), unit = params[2].evaluate(sheet), startDateTime, endDateTime, diffDays, diffMonths, diffYears;
                        if (!wijmo.isPrimitive(startDate) && startDate) {
                            startDate = startDate.value;
                        }
                        if (!wijmo.isPrimitive(endDate) && endDate) {
                            endDate = endDate.value;
                        }
                        if (wijmo.isDate(startDate) && wijmo.isDate(endDate) && wijmo.isString(unit)) {
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
                                    }
                                    else if (diffMonths < 0) {
                                        return diffYears - 1;
                                    }
                                    else {
                                        if (diffDays >= 0) {
                                            return diffYears;
                                        }
                                        else {
                                            return diffYears - 1;
                                        }
                                    }
                                case 'M':
                                    if (diffDays >= 0) {
                                        return diffYears * 12 + diffMonths;
                                    }
                                    else {
                                        return diffYears * 12 + diffMonths - 1;
                                    }
                                case 'D':
                                    return (endDateTime - startDateTime) / (1000 * 3600 * 24);
                                case 'YM':
                                    if (diffDays >= 0) {
                                        diffMonths = diffYears * 12 + diffMonths;
                                    }
                                    else {
                                        diffMonths = diffYears * 12 + diffMonths - 1;
                                    }
                                    return diffMonths % 12;
                                case 'YD':
                                    if (diffMonths > 0) {
                                        return (new Date(startDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime() - startDate.getTime()) / (1000 * 3600 * 24);
                                    }
                                    else if (diffMonths < 0) {
                                        return (new Date(startDate.getFullYear() + 1, endDate.getMonth(), endDate.getDate()).getTime() - startDate.getTime()) / (1000 * 3600 * 24);
                                    }
                                    else {
                                        if (diffDays >= 0) {
                                            return diffDays;
                                        }
                                        else {
                                            return (new Date(startDate.getFullYear() + 1, endDate.getMonth(), endDate.getDate()).getTime() - startDate.getTime()) / (1000 * 3600 * 24);
                                        }
                                    }
                                case 'MD':
                                    if (diffDays >= 0) {
                                        return diffDays;
                                    }
                                    else {
                                        diffDays = new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate() - new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1).getDate() + 1 + diffDays;
                                        return diffDays;
                                    }
                                default:
                                    throw 'Invalid unit.';
                            }
                        }
                        throw 'Invalid parameters.';
                    }, 3, 3);
                };
                // Register the cell reference and look up related functions for the calcEngine.
                _CalcEngine.prototype._registLookUpReferenceFunction = function () {
                    var self = this;
                    self._functionTable['column'] = new _FunctionDefinition(function (params, sheet, rowIndex, columnIndex) {
                        var cellExpr;
                        if (params == null) {
                            return columnIndex + 1;
                        }
                        cellExpr = params[0];
                        cellExpr = self._ensureNonFunctionExpression(cellExpr);
                        if (cellExpr instanceof sheet_1._CellRangeExpression) {
                            return cellExpr.cells.col + 1;
                        }
                        throw 'Invalid Cell Reference.';
                    }, 1, 0);
                    self._functionTable['columns'] = new _FunctionDefinition(function (params, sheet) {
                        var cellExpr = params[0];
                        cellExpr = self._ensureNonFunctionExpression(cellExpr);
                        if (cellExpr instanceof sheet_1._CellRangeExpression) {
                            return cellExpr.cells.columnSpan;
                        }
                        throw 'Invalid Cell Reference.';
                    }, 1, 1);
                    self._functionTable['row'] = new _FunctionDefinition(function (params, sheet, rowIndex, columnIndex) {
                        var cellExpr;
                        if (params == null) {
                            return rowIndex + 1;
                        }
                        cellExpr = params[0];
                        cellExpr = self._ensureNonFunctionExpression(cellExpr);
                        if (cellExpr instanceof sheet_1._CellRangeExpression) {
                            return cellExpr.cells.row + 1;
                        }
                        throw 'Invalid Cell Reference.';
                    }, 1, 0);
                    self._functionTable['rows'] = new _FunctionDefinition(function (params, sheet) {
                        var cellExpr = params[0];
                        cellExpr = self._ensureNonFunctionExpression(cellExpr);
                        if (cellExpr instanceof sheet_1._CellRangeExpression) {
                            return cellExpr.cells.rowSpan;
                        }
                        throw 'Invalid Cell Reference.';
                    }, 1, 1);
                    self._functionTable['choose'] = new _FunctionDefinition(function (params, sheet) {
                        var index = sheet_1._Expression.toNumber(params[0], sheet);
                        if (isNaN(index)) {
                            throw 'Invalid index number.';
                        }
                        if (index < 1 || index >= params.length) {
                            throw 'The index number is out of the list range.';
                        }
                        return params[index].evaluate(sheet);
                    }, 255, 2);
                    self._functionTable['index'] = new _FunctionDefinition(function (params, sheet) {
                        var cellExpr = params[0], cells, rowNum = sheet_1._Expression.toNumber(params[1], sheet), colNum = params[2] != null ? sheet_1._Expression.toNumber(params[2], sheet) : 0;
                        if (isNaN(rowNum) || rowNum < 0) {
                            throw 'Invalid Row Number.';
                        }
                        if (isNaN(colNum) || colNum < 0) {
                            throw 'Invalid Column Number.';
                        }
                        cellExpr = self._ensureNonFunctionExpression(cellExpr);
                        if (cellExpr instanceof sheet_1._CellRangeExpression) {
                            cells = cellExpr.cells;
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
                                return new sheet_1._CellRangeExpression(new grid.CellRange(cells.topRow, cells.leftCol + colNum - 1, cells.bottomRow, cells.leftCol + colNum - 1), cellExpr.sheetRef, self._owner);
                            }
                            if (colNum === 0) {
                                return new sheet_1._CellRangeExpression(new grid.CellRange(cells.topRow + rowNum - 1, cells.leftCol, cells.topRow + rowNum - 1, cells.rightCol), cellExpr.sheetRef, self._owner);
                            }
                        }
                        throw 'Invalid Cell Reference.';
                    }, 4, 2);
                    self._functionTable['hlookup'] = new _FunctionDefinition(function (params, sheet) {
                        return self._handleHLookup(params, sheet);
                    }, 4, 3);
                };
                // Register the finacial function for the calcEngine.
                _CalcEngine.prototype._registFinacialFunction = function () {
                    var self = this;
                    self._functionTable['rate'] = new _FunctionDefinition(function (params, sheet) {
                        var rate = self._calculateRate(params, sheet);
                        return {
                            value: rate,
                            format: 'p2'
                        };
                    }, 6, 3);
                };
                // Add token into the static token table.
                _CalcEngine.prototype._addToken = function (symbol, id, type) {
                    var token = new _Token(symbol, id, type);
                    this._tokenTable[symbol] = token;
                };
                // Parse expression
                _CalcEngine.prototype._parseExpression = function () {
                    this._getToken();
                    return this._parseCompareOrConcat();
                };
                // Parse compare expression
                _CalcEngine.prototype._parseCompareOrConcat = function () {
                    var x = this._parseAddSub(), t, exprArg;
                    while (this._token.tokenType === _TokenType.COMPARE || this._token.tokenType === _TokenType.CONCAT) {
                        t = this._token;
                        this._getToken();
                        exprArg = this._parseAddSub();
                        x = new sheet_1._BinaryExpression(t, x, exprArg);
                    }
                    return x;
                };
                // Parse add/sub expression.
                _CalcEngine.prototype._parseAddSub = function () {
                    var x = this._parseMulDiv(), t, exprArg;
                    while (this._token.tokenType === _TokenType.ADDSUB) {
                        t = this._token;
                        this._getToken();
                        exprArg = this._parseMulDiv();
                        x = new sheet_1._BinaryExpression(t, x, exprArg);
                    }
                    return x;
                };
                // Parse multiple/division expression.
                _CalcEngine.prototype._parseMulDiv = function () {
                    var x = this._parsePower(), t, exprArg;
                    while (this._token.tokenType === _TokenType.MULDIV) {
                        t = this._token;
                        this._getToken();
                        exprArg = this._parsePower();
                        x = new sheet_1._BinaryExpression(t, x, exprArg);
                    }
                    return x;
                };
                // Parse power expression.
                _CalcEngine.prototype._parsePower = function () {
                    var x = this._parseUnary(), t, exprArg;
                    while (this._token.tokenType === _TokenType.POWER) {
                        t = this._token;
                        this._getToken();
                        exprArg = this._parseUnary();
                        x = new sheet_1._BinaryExpression(t, x, exprArg);
                    }
                    return x;
                };
                // Parse unary expression
                _CalcEngine.prototype._parseUnary = function () {
                    var t, exprArg;
                    // unary plus and minus
                    if (this._token.tokenID === _TokenID.ADD || this._token.tokenID === _TokenID.SUB) {
                        t = this._token;
                        this._getToken();
                        exprArg = this._parseAtom();
                        return new sheet_1._UnaryExpression(t, exprArg);
                    }
                    // not unary, return atom
                    return this._parseAtom();
                };
                // Parse atomic expression
                _CalcEngine.prototype._parseAtom = function () {
                    var x = null, id, funcDefinition, params, pCnt, cellRef;
                    switch (this._token.tokenType) {
                        // literals
                        case _TokenType.LITERAL:
                            x = new sheet_1._Expression(this._token);
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
                                x = new sheet_1._FunctionExpression(funcDefinition, params);
                                break;
                            }
                            // look for Cell Range.
                            cellRef = this._getCellRange(id);
                            if (cellRef) {
                                x = new sheet_1._CellRangeExpression(cellRef.cellRange, cellRef.sheetRef, this._owner);
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
                };
                // Get token for the expression.
                _CalcEngine.prototype._getToken = function () {
                    var i, c, lastChar, isLetter, isDigit, id = '', sheetRef = '', 
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
                };
                // Parse digit token
                _CalcEngine.prototype._parseDigit = function () {
                    var div = -1, sci = false, pct = false, val = 0.0, i, c, lit;
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
                            if (c === '+' || c === '-')
                                i++;
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
                    }
                    else {
                        lit = this._expression.substring(this._pointer, this._pointer + i);
                        val = +lit;
                    }
                    // build token
                    this._token = new _Token(val, _TokenID.ATOM, _TokenType.LITERAL);
                    // advance pointer and return
                    this._pointer += i;
                };
                // Parse string token
                _CalcEngine.prototype._parseString = function () {
                    var i, c, cNext, lit;
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
                };
                // Parse datetime token
                _CalcEngine.prototype._parseDate = function () {
                    var i, c, lit;
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
                };
                // Parse the sheet reference.
                _CalcEngine.prototype._parseSheetRef = function () {
                    var i, c, cNext, lit;
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
                    }
                    else {
                        return '';
                    }
                };
                // Gets the cell range by the identifier.
                // For e.g. A1:C3 to cellRange(row=0, col=0, row1=2, col1=2)
                _CalcEngine.prototype._getCellRange = function (identifier) {
                    var cells, cell, cell2, sheetRef, rng, rng2;
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
                                    throw 'The cell reference must be in the same sheet!';
                                }
                                if (rng2) {
                                    rng.col2 = rng2.col;
                                    rng.row2 = rng2.row;
                                }
                                else {
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
                };
                // Parse the single string cell identifier to cell range;
                // For e.g. A1 to cellRange(row=0, col=0).
                _CalcEngine.prototype._parseCellRange = function (cell) {
                    var col = -1, row = -1, absCol = false, absRow = false, index, c;
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
                    return new grid.CellRange(row - 1, col - 1);
                };
                // Parse the single cell reference string to cell reference object.
                // For e.g. 'sheet1!A1' to { sheetRef: 'sheet1', cellRange: CellRange(row = 0, col = 0)}
                _CalcEngine.prototype._parseCell = function (cell) {
                    var rng, sheetRefIndex, cellsRef, sheetRef;
                    sheetRefIndex = cell.lastIndexOf('!');
                    if (sheetRefIndex > 0 && sheetRefIndex < cell.length - 1) {
                        sheetRef = cell.substring(0, sheetRefIndex);
                        cellsRef = cell.substring(sheetRefIndex + 1);
                    }
                    else if (sheetRefIndex <= 0) {
                        cellsRef = cell;
                    }
                    else {
                        return null;
                    }
                    rng = this._parseCellRange(cellsRef);
                    return {
                        cellRange: rng,
                        sheetRef: sheetRef
                    };
                };
                // Gets the parameters for the function.
                // e.g. myfun(a, b, c+2)
                _CalcEngine.prototype._getParameters = function () {
                    // check whether next token is a (, 
                    // restore state and bail if it's not
                    var pos = this._pointer, tk = this._token, parms, expr;
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
                };
                // Get the aggregate result for the CalcEngine.
                _CalcEngine.prototype._getAggregateResult = function (aggType, params, sheet) {
                    var list = this._getItemList(params, sheet), result;
                    result = wijmo.getAggregate(aggType, list.items);
                    if (list.isDate) {
                        result = new Date(result);
                    }
                    return result;
                };
                // Get the flexsheet aggregate result for the CalcEngine
                _CalcEngine.prototype._getFlexSheetAggregateResult = function (aggType, params, sheet) {
                    var list, sumList, num, order;
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
                            num = sheet_1._Expression.toNumber(params[0], sheet);
                            order = params[2] ? sheet_1._Expression.toNumber(params[2], sheet) : 0;
                            if (isNaN(num)) {
                                throw 'Invalid number.';
                            }
                            if (isNaN(order)) {
                                throw 'Invalid order.';
                            }
                            params[1] = this._ensureNonFunctionExpression(params[1]);
                            if (params[1] instanceof sheet_1._CellRangeExpression) {
                                list = this._getItemList([params[1]], sheet);
                                return this._getRankOfCellRange(num, list.items, order);
                            }
                            throw 'Invalid Cell Reference.';
                        case _FlexSheetAggregate.CountIf:
                            params[0] = this._ensureNonFunctionExpression(params[0]);
                            if (params[0] instanceof sheet_1._CellRangeExpression) {
                                list = this._getItemList([params[0]], sheet, false);
                                return this._countCellsByCriterias([list.items], [params[1]], sheet);
                            }
                            throw 'Invalid Cell Reference.';
                        case _FlexSheetAggregate.CountIfs:
                            return this._handleCountIfs(params, sheet);
                        case _FlexSheetAggregate.SumIf:
                            params[0] = this._ensureNonFunctionExpression(params[0]);
                            if (params[0] instanceof sheet_1._CellRangeExpression) {
                                list = this._getItemList([params[0]], sheet, false);
                                params[2] = this._ensureNonFunctionExpression(params[2]);
                                if (params[2] != null && params[2] instanceof sheet_1._CellRangeExpression) {
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
                };
                // Get item list for aggregate processing.
                _CalcEngine.prototype._getItemList = function (params, sheet, needParseToNum, isGetEmptyValue, isGetHiddenValue, columnIndex) {
                    if (needParseToNum === void 0) { needParseToNum = true; }
                    if (isGetEmptyValue === void 0) { isGetEmptyValue = false; }
                    if (isGetHiddenValue === void 0) { isGetHiddenValue = true; }
                    var items = new Array(), item, index, cellIndex, cellValues, param, isDate = true;
                    for (index = 0; index < params.length; index++) {
                        param = params[index];
                        // When meets the CellRangeExpression, 
                        // we need set the value of the each cell in the cell range into the array to get the aggregate result.
                        param = this._ensureNonFunctionExpression(param);
                        if (param instanceof sheet_1._CellRangeExpression) {
                            cellValues = param.getValues(isGetHiddenValue, columnIndex, sheet);
                            cells: for (cellIndex = 0; cellIndex < cellValues.length; cellIndex++) {
                                item = cellValues[cellIndex];
                                if (!isGetEmptyValue && (item == null || item === '')) {
                                    continue cells;
                                }
                                isDate = isDate && (item instanceof Date);
                                item = needParseToNum ? +item : item;
                                items.push(item);
                            }
                        }
                        else {
                            item = param instanceof sheet_1._Expression ? param.evaluate(sheet) : param;
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
                };
                // Count blank cells
                _CalcEngine.prototype._countBlankCells = function (items) {
                    var i = 0, count = 0, item;
                    for (; i < items.length; i++) {
                        item = items[i];
                        if (item == null || (wijmo.isString(item) && item === '') || (wijmo.isNumber(item) && isNaN(item))) {
                            count++;
                        }
                    }
                    return count;
                };
                // Count number cells
                _CalcEngine.prototype._countNumberCells = function (items) {
                    var i = 0, count = 0, item;
                    for (; i < items.length; i++) {
                        item = items[i];
                        if (item != null && wijmo.isNumber(item) && !isNaN(item)) {
                            count++;
                        }
                    }
                    return count;
                };
                // Get the rank for the number in the cell range.
                _CalcEngine.prototype._getRankOfCellRange = function (num, items, order) {
                    if (order === void 0) { order = 0; }
                    var i = 0, rank = 0, item;
                    // Sort the items list
                    if (!order) {
                        items.sort(function (a, b) {
                            if (isNaN(a) || isNaN(b)) {
                                return 1;
                            }
                            return b - a;
                        });
                    }
                    else {
                        items.sort(function (a, b) {
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
                };
                // Handles the CountIfs function
                _CalcEngine.prototype._handleCountIfs = function (params, sheet) {
                    var i = 0, itemsList = [], critreiaList = [], list, cellExpr, rowCount, colCount;
                    if (params.length % 2 !== 0) {
                        throw 'Invalid params.';
                    }
                    for (; i < params.length / 2; i++) {
                        cellExpr = params[2 * i];
                        cellExpr = this._ensureNonFunctionExpression(cellExpr);
                        if (cellExpr instanceof sheet_1._CellRangeExpression) {
                            if (i === 0) {
                                if (cellExpr.cells) {
                                    rowCount = cellExpr.cells.rowSpan;
                                    colCount = cellExpr.cells.columnSpan;
                                }
                                else {
                                    throw 'Invalid Cell Reference.';
                                }
                            }
                            else {
                                if (!cellExpr.cells) {
                                    throw 'Invalid Cell Reference.';
                                }
                                else if (cellExpr.cells.rowSpan !== rowCount || cellExpr.cells.columnSpan !== colCount) {
                                    throw 'The row span and column span of each cell range has to be same with each other.';
                                }
                            }
                            list = this._getItemList([cellExpr], sheet, false);
                            itemsList[i] = list.items;
                            critreiaList[i] = params[2 * i + 1];
                        }
                        else {
                            throw 'Invalid Cell Reference.';
                        }
                    }
                    return this._countCellsByCriterias(itemsList, critreiaList, sheet);
                };
                // Count the cells that meet the criteria.
                _CalcEngine.prototype._countCellsByCriterias = function (itemsList, criterias, sheet, countItems) {
                    var i = 0, j = 0, count = 0, rangeLength = itemsList[0].length, parsedRightExprs = [], result, countItem, items, leftExpr, rightExpr;
                    for (; j < criterias.length; j++) {
                        rightExpr = sheet_1._Expression.toString(criterias[j], sheet);
                        if (rightExpr.length === 0) {
                            throw 'Invalid Criteria.';
                        }
                        if (rightExpr === '*') {
                            parsedRightExprs.push(rightExpr);
                        }
                        else {
                            parsedRightExprs.push(this._parseRightExpr(rightExpr));
                        }
                    }
                    for (; i < rangeLength; i++) {
                        result = false;
                        criteriaLoop: for (j = 0; j < itemsList.length; j++) {
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
                            }
                            else {
                                result = result = rightExpr.reg.test(leftExpr.toString()) === rightExpr.checkMathces;
                                if (!result) {
                                    break criteriaLoop;
                                }
                            }
                        }
                        if (result) {
                            if (countItems) {
                                countItem = countItems[i];
                                if (countItem != null && wijmo.isNumber(countItem) && !isNaN(countItem)) {
                                    count++;
                                }
                            }
                            else {
                                count++;
                            }
                        }
                    }
                    return count;
                };
                // Handles the SumIfs function
                _CalcEngine.prototype._handleSumIfs = function (params, sheet) {
                    var i = 1, itemsList = [], critreiaList = [], list, sumList, sumCellExpr, cellExpr, rowCount, colCount;
                    if (params.length % 2 !== 1) {
                        throw 'Invalid params.';
                    }
                    sumCellExpr = params[0];
                    sumCellExpr = this._ensureNonFunctionExpression(sumCellExpr);
                    if (sumCellExpr instanceof sheet_1._CellRangeExpression) {
                        if (sumCellExpr.cells) {
                            rowCount = sumCellExpr.cells.rowSpan;
                            colCount = sumCellExpr.cells.columnSpan;
                        }
                        else {
                            throw 'Invalid Sum Cell Reference.';
                        }
                        sumList = this._getItemList([sumCellExpr], sheet);
                    }
                    else {
                        throw 'Invalid Sum Cell Reference.';
                    }
                    for (; i < (params.length + 1) / 2; i++) {
                        cellExpr = params[2 * i - 1];
                        cellExpr = this._ensureNonFunctionExpression(cellExpr);
                        if (cellExpr instanceof sheet_1._CellRangeExpression) {
                            if (!cellExpr.cells) {
                                throw 'Invalid Criteria Cell Reference.';
                            }
                            else if (cellExpr.cells.rowSpan !== rowCount || cellExpr.cells.columnSpan !== colCount) {
                                throw 'The row span and column span of each cell range has to be same with each other.';
                            }
                            list = this._getItemList([cellExpr], sheet, false);
                            itemsList[i - 1] = list.items;
                            critreiaList[i - 1] = params[2 * i];
                        }
                        else {
                            throw 'Invalid Criteria Cell Reference.';
                        }
                    }
                    return this._sumCellsByCriterias(itemsList, critreiaList, sumList.items, sheet);
                };
                // Gets the sum of the numeric values in the cells specified by a given criteria.
                _CalcEngine.prototype._sumCellsByCriterias = function (itemsList, criterias, sumItems, sheet) {
                    var i = 0, j = 0, sum = 0, sumItem, rangeLength = itemsList[0].length, parsedRightExprs = [], result, items, leftExpr, rightExpr;
                    if (sumItems == null) {
                        sumItems = itemsList[0];
                    }
                    for (; j < criterias.length; j++) {
                        rightExpr = sheet_1._Expression.toString(criterias[j], sheet);
                        if (rightExpr.length === 0) {
                            throw 'Invalid Criteria.';
                        }
                        if (rightExpr === '*') {
                            parsedRightExprs.push(rightExpr);
                        }
                        else {
                            parsedRightExprs.push(this._parseRightExpr(rightExpr));
                        }
                    }
                    for (; i < rangeLength; i++) {
                        result = false;
                        sumItem = sumItems[i];
                        criteriaLoop: for (j = 0; j < itemsList.length; j++) {
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
                            }
                            else {
                                result = rightExpr.reg.test(leftExpr.toString()) === rightExpr.checkMathces;
                                if (!result) {
                                    break criteriaLoop;
                                }
                            }
                        }
                        if (result && wijmo.isNumber(sumItem) && !isNaN(sumItem)) {
                            sum += sumItem;
                        }
                    }
                    return sum;
                };
                // Get product for numbers
                _CalcEngine.prototype._getProductOfNumbers = function (items) {
                    var item, i = 0, product = 1, containsValidNum = false;
                    if (items) {
                        for (; i < items.length; i++) {
                            item = items[i];
                            if (wijmo.isNumber(item) && !isNaN(item)) {
                                product *= item;
                                containsValidNum = true;
                            }
                        }
                    }
                    if (containsValidNum) {
                        return product;
                    }
                    return 0;
                };
                //  Handle the subtotal function.
                _CalcEngine.prototype._handleSubtotal = function (params, sheet) {
                    var func, list, aggType, result, isGetHiddenValue = true;
                    func = sheet_1._Expression.toNumber(params[0], sheet);
                    if ((func >= 1 && func <= 11) || (func >= 101 && func <= 111)) {
                        if (func >= 101 && func <= 111) {
                            isGetHiddenValue = false;
                        }
                        func = wijmo.asEnum(func, _SubtotalFunction);
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
                                aggType = wijmo.Aggregate.Avg;
                                break;
                            case _SubtotalFunction.Max:
                            case _SubtotalFunction.MaxWithoutHidden:
                                aggType = wijmo.Aggregate.Max;
                                break;
                            case _SubtotalFunction.Min:
                            case _SubtotalFunction.MinWithoutHidden:
                                aggType = wijmo.Aggregate.Min;
                                break;
                            case _SubtotalFunction.Std:
                            case _SubtotalFunction.StdWithoutHidden:
                                aggType = wijmo.Aggregate.Std;
                                break;
                            case _SubtotalFunction.StdPop:
                            case _SubtotalFunction.StdPopWithoutHidden:
                                aggType = wijmo.Aggregate.StdPop;
                                break;
                            case _SubtotalFunction.Sum:
                            case _SubtotalFunction.SumWithoutHidden:
                                aggType = wijmo.Aggregate.Sum;
                                break;
                            case _SubtotalFunction.Var:
                            case _SubtotalFunction.VarWithoutHidden:
                                aggType = wijmo.Aggregate.Var;
                                break;
                            case _SubtotalFunction.VarPop:
                            case _SubtotalFunction.VarPopWithoutHidden:
                                aggType = wijmo.Aggregate.VarPop;
                                break;
                        }
                        result = wijmo.getAggregate(aggType, list.items);
                        if (list.isDate) {
                            result = new Date(result);
                        }
                        return result;
                    }
                    throw 'Invalid Subtotal function.';
                };
                // Handle the DCount function.
                _CalcEngine.prototype._handleDCount = function (params, sheet) {
                    var cellExpr = params[0], criteriaCellExpr = params[2], count = 0, field, columnIndex, list;
                    cellExpr = this._ensureNonFunctionExpression(cellExpr);
                    criteriaCellExpr = this._ensureNonFunctionExpression(criteriaCellExpr);
                    if (cellExpr instanceof sheet_1._CellRangeExpression && criteriaCellExpr instanceof sheet_1._CellRangeExpression) {
                        field = params[1].evaluate(sheet);
                        columnIndex = this._getColumnIndexByField(cellExpr, field);
                        list = this._getItemList([cellExpr], sheet, true, false, true, columnIndex);
                        if (list.items && list.items.length > 1) {
                            return this._DCountWithCriterias(list.items.slice(1), cellExpr, criteriaCellExpr);
                        }
                    }
                    throw 'Invalid Count Cell Reference.';
                };
                // Counts the cells by the specified criterias.
                _CalcEngine.prototype._DCountWithCriterias = function (countItems, countRef, criteriaRef) {
                    var criteriaCells = criteriaRef.cells, count = 0, countSheet, criteriaSheet, fieldRowIndex, rowIndex, colIndex, criteriaColIndex, criteria, criteriaField, list, itemsList, criteriaList;
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
                                    criteriaList.push(new sheet_1._Expression(criteria));
                                    criteriaField = this._owner.getCellValue(fieldRowIndex, colIndex, false, criteriaSheet);
                                    criteriaColIndex = this._getColumnIndexByField(countRef, criteriaField);
                                    list = this._getItemList([countRef], countSheet, false, false, true, criteriaColIndex);
                                    if (list.items != null && list.items.length > 1) {
                                        itemsList.push(list.items.slice(1));
                                    }
                                    else {
                                        throw 'Invalid Count Cell Reference.';
                                    }
                                }
                            }
                            count += this._countCellsByCriterias(itemsList, criteriaList, countSheet, countItems);
                        }
                        return count;
                    }
                    throw 'Invalid Criteria Cell Reference.';
                };
                // Get column index of the count cell range by the field.
                _CalcEngine.prototype._getColumnIndexByField = function (cellExpr, field) {
                    var cells, sheet, columnIndex, value, rowIndex;
                    cells = cellExpr.cells;
                    rowIndex = cells.topRow;
                    if (rowIndex === -1) {
                        throw 'Invalid Count Cell Reference.';
                    }
                    if (wijmo.isInt(field) && !isNaN(field)) {
                        // if the field is integer, we consider the field it the column index of the count cell range.
                        if (field >= 1 && field <= cells.columnSpan) {
                            columnIndex = cells.leftCol + field - 1;
                            return columnIndex;
                        }
                    }
                    else {
                        sheet = this._getSheet(cellExpr.sheetRef);
                        for (columnIndex = cells.leftCol; columnIndex <= cells.rightCol; columnIndex++) {
                            value = this._owner.getCellValue(rowIndex, columnIndex, false, sheet);
                            field = wijmo.isString(field) ? field.toLowerCase() : field;
                            value = wijmo.isString(value) ? value.toLowerCase() : value;
                            if (field === value) {
                                return columnIndex;
                            }
                        }
                    }
                    throw 'Invalid field.';
                };
                // Gets the sheet by the sheetRef.
                _CalcEngine.prototype._getSheet = function (sheetRef) {
                    var i = 0, sheet;
                    if (sheetRef) {
                        for (; i < this._owner.sheets.length; i++) {
                            sheet = this._owner.sheets[i];
                            if (sheet.name === sheetRef) {
                                break;
                            }
                        }
                    }
                    return sheet;
                };
                // Parse the right expression for countif countifs sumif and sumifs function.
                _CalcEngine.prototype._parseRightExpr = function (rightExpr) {
                    var match, matchReg, checkMathces = false;
                    // Match the criteria that contains '?' such as '??match' and etc..
                    if (rightExpr.indexOf('?') > -1 || rightExpr.indexOf('*') > -1) {
                        match = rightExpr.match(/([\?\*]*)(\w+)([\?\*]*)(\w+)([\?\*]*)/);
                        if (match != null && match.length === 6) {
                            matchReg = new RegExp('^' + (match[1].length > 0 ? this._parseRegCriteria(match[1]) : '') + match[2]
                                + (match[3].length > 0 ? this._parseRegCriteria(match[3]) : '') + match[4]
                                + (match[5].length > 0 ? this._parseRegCriteria(match[5]) : '') + '$', 'i');
                        }
                        else {
                            throw 'Invalid Criteria.';
                        }
                        if (/^[<>=]/.test(rightExpr)) {
                            if (rightExpr.trim()[0] === '=') {
                                checkMathces = true;
                            }
                        }
                        else {
                            checkMathces = true;
                        }
                        return {
                            reg: matchReg,
                            checkMathces: checkMathces
                        };
                    }
                    else {
                        if (!isNaN(+rightExpr)) {
                            rightExpr = '=' + rightExpr;
                        }
                        else if (/^\w/.test(rightExpr)) {
                            rightExpr = '="' + rightExpr + '"';
                        }
                        else if (/^[<>=]{1,2}\s*-?\w+$/.test(rightExpr)) {
                            rightExpr = rightExpr.replace(/([<>=]{1,2})\s*(-?\w+)/, '$1"$2"');
                        }
                        else {
                            throw 'Invalid Criteria.';
                        }
                        return rightExpr;
                    }
                };
                // combine the left expression and right expression for countif countifs sumif and sumifs function.
                _CalcEngine.prototype._combineExpr = function (leftExpr, rightExpr) {
                    if (wijmo.isString(leftExpr)) {
                        leftExpr = '"' + leftExpr + '"';
                    }
                    leftExpr = '=' + leftExpr;
                    return leftExpr + rightExpr;
                };
                // Parse regex criteria for '?' and '*'
                _CalcEngine.prototype._parseRegCriteria = function (criteria) {
                    var i = 0, questionMarkCnt = 0, regString = '';
                    for (; i < criteria.length; i++) {
                        if (criteria[i] === '*') {
                            if (questionMarkCnt > 0) {
                                regString += '\\w{' + questionMarkCnt + '}';
                                questionMarkCnt = 0;
                            }
                            regString += '\\w*';
                        }
                        else if (criteria[i] === '?') {
                            questionMarkCnt++;
                        }
                    }
                    if (questionMarkCnt > 0) {
                        regString += '\\w{' + questionMarkCnt + '}';
                    }
                    return regString;
                };
                // Calculate the rate.
                // The algorithm of the rate calculation refers http://stackoverflow.com/questions/3198939/recreate-excel-rate-function-using-newtons-method
                _CalcEngine.prototype._calculateRate = function (params, sheet) {
                    var FINANCIAL_PRECISION = 0.0000001, FINANCIAL_MAX_ITERATIONS = 20, i = 0, x0 = 0, x1, rate, nper, pmt, pv, fv, type, guess, y, f, y0, y1;
                    nper = sheet_1._Expression.toNumber(params[0], sheet);
                    pmt = sheet_1._Expression.toNumber(params[1], sheet);
                    pv = sheet_1._Expression.toNumber(params[2], sheet);
                    fv = params[3] != null ? sheet_1._Expression.toNumber(params[3], sheet) : 0;
                    type = params[4] != null ? sheet_1._Expression.toNumber(params[4], sheet) : 0;
                    guess = params[5] != null ? sheet_1._Expression.toNumber(params[5], sheet) : 0.1;
                    rate = guess;
                    if (Math.abs(rate) < FINANCIAL_PRECISION) {
                        y = pv * (1 + nper * rate) + pmt * (1 + rate * type) * nper + fv;
                    }
                    else {
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
                        }
                        else {
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
                };
                // Handle the hlookup function.
                _CalcEngine.prototype._handleHLookup = function (params, sheet) {
                    var lookupVal = params[0].evaluate(sheet), cellExpr = params[1], rowNum = sheet_1._Expression.toNumber(params[2], sheet), approximateMatch = params[3] != null ? sheet_1._Expression.toBoolean(params[3], sheet) : true, cells, colNum;
                    if (lookupVal == null || lookupVal == '') {
                        throw 'Invalid lookup value.';
                    }
                    if (isNaN(rowNum) || rowNum < 0) {
                        throw 'Invalid row index.';
                    }
                    cellExpr = this._ensureNonFunctionExpression(cellExpr);
                    if (cellExpr instanceof sheet_1._CellRangeExpression) {
                        cells = cellExpr.cells;
                        if (rowNum > cells.rowSpan) {
                            throw 'Row index is out of the cell range.';
                        }
                        if (approximateMatch) {
                            colNum = this._exactMatch(lookupVal, cells, sheet, false);
                            if (colNum === -1) {
                                colNum = this._approximateMatch(lookupVal, cells, sheet);
                            }
                        }
                        else {
                            colNum = this._exactMatch(lookupVal, cells, sheet);
                        }
                        if (colNum === -1) {
                            throw 'Lookup Value is not found.';
                        }
                        return this._owner.getCellValue(cells.topRow + rowNum - 1, colNum, false, sheet);
                    }
                    throw 'Invalid Cell Reference.';
                };
                // Handle the exact match for the hlookup.
                _CalcEngine.prototype._exactMatch = function (lookupValue, cells, sheet, needHandleWildCard) {
                    if (needHandleWildCard === void 0) { needHandleWildCard = true; }
                    var rowIndex = cells.topRow, colIndex, value, match, matchReg;
                    if (wijmo.isString(lookupValue)) {
                        lookupValue = lookupValue.toLowerCase();
                    }
                    // handle the wildcard question mark (?) and asterisk (*) for the lookup value.
                    if (needHandleWildCard && wijmo.isString(lookupValue) && (lookupValue.indexOf('?') > -1 || lookupValue.indexOf('*') > -1)) {
                        match = lookupValue.match(/([\?\*]*)(\w+)([\?\*]*)(\w+)([\?\*]*)/);
                        if (match != null && match.length === 6) {
                            matchReg = new RegExp('^' + (match[1].length > 0 ? this._parseRegCriteria(match[1]) : '') + match[2]
                                + (match[3].length > 0 ? this._parseRegCriteria(match[3]) : '') + match[4]
                                + (match[5].length > 0 ? this._parseRegCriteria(match[5]) : '') + '$', 'i');
                        }
                        else {
                            throw 'Invalid lookup value.';
                        }
                    }
                    for (colIndex = cells.leftCol; colIndex <= cells.rightCol; colIndex++) {
                        value = this._owner.getCellValue(rowIndex, colIndex, false, sheet);
                        if (matchReg != null) {
                            if (matchReg.test(value)) {
                                return colIndex;
                            }
                        }
                        else {
                            if (wijmo.isString(value)) {
                                value = value.toLowerCase();
                            }
                            if (lookupValue === value) {
                                return colIndex;
                            }
                        }
                    }
                    return -1;
                };
                // Handle the approximate match for the hlookup.
                _CalcEngine.prototype._approximateMatch = function (lookupValue, cells, sheet) {
                    var val, colIndex, rowIndex = cells.topRow, cellValues = [], i = 0;
                    if (wijmo.isString(lookupValue)) {
                        lookupValue = lookupValue.toLowerCase();
                    }
                    for (colIndex = cells.leftCol; colIndex <= cells.rightCol; colIndex++) {
                        val = this._owner.getCellValue(rowIndex, colIndex, false, sheet);
                        val = isNaN(+val) ? val : +val;
                        cellValues.push({ value: val, index: colIndex });
                    }
                    // Sort the cellValues array with descent order.
                    cellValues.sort(function (a, b) {
                        if (wijmo.isString(a.value)) {
                            a.value = a.value.toLowerCase();
                        }
                        if (wijmo.isString(b.value)) {
                            b.value = b.value.toLowerCase();
                        }
                        if (a.value > b.value) {
                            return -1;
                        }
                        else if (a.value === b.value) {
                            return b.index - a.index;
                        }
                        return 1;
                    });
                    for (; i < cellValues.length; i++) {
                        val = cellValues[i];
                        if (wijmo.isString(val.value)) {
                            val.value = val.value.toLowerCase();
                        }
                        // return the column index of the first value that less than lookup value.
                        if (lookupValue > val.value) {
                            return val.index;
                        }
                    }
                    throw 'Lookup Value is not found.';
                };
                // Check the expression cache.
                _CalcEngine.prototype._checkCache = function (expression) {
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
                };
                // Ensure current is not function expression.
                _CalcEngine.prototype._ensureNonFunctionExpression = function (expr, sheet) {
                    while (expr instanceof sheet_1._FunctionExpression) {
                        expr = expr.evaluate(sheet);
                    }
                    return expr;
                };
                return _CalcEngine;
            }());
            sheet_1._CalcEngine = _CalcEngine;
            /*
             * Defines the Token class.
             *
             * It assists the expression instance to evaluate value.
             */
            var _Token = (function () {
                /*
                 * Initializes a new instance of the @see:Token class.
                 *
                 * @param val The value of the token.
                 * @param tkID The @see:TokenID value of the token.
                 * @param tkType The @see:TokenType value of the token.
                 */
                function _Token(val, tkID, tkType) {
                    this._value = val;
                    this._tokenID = tkID;
                    this._tokenType = tkType;
                }
                Object.defineProperty(_Token.prototype, "value", {
                    /*
                     * Gets the value of the token instance.
                     */
                    get: function () {
                        return this._value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_Token.prototype, "tokenID", {
                    /*
                     * Gets the token ID of the token instance.
                     */
                    get: function () {
                        return this._tokenID;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_Token.prototype, "tokenType", {
                    /*
                     * Gets the token type of the token instance.
                     */
                    get: function () {
                        return this._tokenType;
                    },
                    enumerable: true,
                    configurable: true
                });
                return _Token;
            }());
            sheet_1._Token = _Token;
            /*
             * Function definition class (keeps function name, parameter counts, and function).
             */
            var _FunctionDefinition = (function () {
                /*
                 * Initializes a new instance of the @see:FunctionDefinition class.
                 *
                 * @param func The function will be invoked by the CalcEngine.
                 * @param paramMax The maximum count of the parameter that the function need.
                 * @param paramMin The minimum count of the parameter that the function need.
                 */
                function _FunctionDefinition(func, paramMax, paramMin) {
                    this._paramMax = Number.MAX_VALUE;
                    this._paramMin = Number.MIN_VALUE;
                    this._func = func;
                    if (wijmo.isNumber(paramMax) && !isNaN(paramMax)) {
                        this._paramMax = paramMax;
                    }
                    if (wijmo.isNumber(paramMin) && !isNaN(paramMin)) {
                        this._paramMin = paramMin;
                    }
                }
                Object.defineProperty(_FunctionDefinition.prototype, "paramMax", {
                    /*
                     * Gets the paramMax of the FunctionDefinition instance.
                     */
                    get: function () {
                        return this._paramMax;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_FunctionDefinition.prototype, "paramMin", {
                    /*
                     * Gets the paramMin of the FunctionDefinition instance.
                     */
                    get: function () {
                        return this._paramMin;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(_FunctionDefinition.prototype, "func", {
                    /*
                     * Gets the func of the FunctionDefinition instance.
                     */
                    get: function () {
                        return this._func;
                    },
                    enumerable: true,
                    configurable: true
                });
                return _FunctionDefinition;
            }());
            sheet_1._FunctionDefinition = _FunctionDefinition;
            /*
             * Token types (used when building expressions, sequence defines operator priority)
             */
            (function (_TokenType) {
                /*
                 * This token type includes '<', '>', '=', '<=', '>=' and '<>'.
                 */
                _TokenType[_TokenType["COMPARE"] = 0] = "COMPARE";
                /*
                 * This token type includes '+' and '-'.
                 */
                _TokenType[_TokenType["ADDSUB"] = 1] = "ADDSUB";
                /*
                 * This token type includes '*' and '/'.
                 */
                _TokenType[_TokenType["MULDIV"] = 2] = "MULDIV";
                /*
                 * This token type includes '^'.
                 */
                _TokenType[_TokenType["POWER"] = 3] = "POWER";
                /*
                 * This token type includes '&'.
                 */
                _TokenType[_TokenType["CONCAT"] = 4] = "CONCAT";
                /*
                 * This token type includes '(' and ')'.
                 */
                _TokenType[_TokenType["GROUP"] = 5] = "GROUP";
                /*
                 * This token type includes number value, string value and etc..
                 */
                _TokenType[_TokenType["LITERAL"] = 6] = "LITERAL";
                /*
                 * This token type includes function.
                 */
                _TokenType[_TokenType["IDENTIFIER"] = 7] = "IDENTIFIER";
            })(sheet_1._TokenType || (sheet_1._TokenType = {}));
            var _TokenType = sheet_1._TokenType;
            /*
             * Token ID (used when evaluating expressions)
             */
            (function (_TokenID) {
                /*
                 * Greater than.
                 */
                _TokenID[_TokenID["GT"] = 0] = "GT";
                /*
                 * Less than.
                 */
                _TokenID[_TokenID["LT"] = 1] = "LT";
                /*
                 * Greater than or equal to.
                 */
                _TokenID[_TokenID["GE"] = 2] = "GE";
                /*
                 * Less than or equal to.
                 */
                _TokenID[_TokenID["LE"] = 3] = "LE";
                /*
                 * Equal to.
                 */
                _TokenID[_TokenID["EQ"] = 4] = "EQ";
                /*
                 * Not equal to.
                 */
                _TokenID[_TokenID["NE"] = 5] = "NE";
                /*
                 * Addition.
                 */
                _TokenID[_TokenID["ADD"] = 6] = "ADD";
                /*
                 * Subtraction.
                 */
                _TokenID[_TokenID["SUB"] = 7] = "SUB";
                /*
                 * Multiplication.
                 */
                _TokenID[_TokenID["MUL"] = 8] = "MUL";
                /*
                 * Division.
                 */
                _TokenID[_TokenID["DIV"] = 9] = "DIV";
                /*
                 * Gets quotient of division.
                 */
                _TokenID[_TokenID["DIVINT"] = 10] = "DIVINT";
                /*
                 * Gets remainder of division.
                 */
                _TokenID[_TokenID["MOD"] = 11] = "MOD";
                /*
                 * Power.
                 */
                _TokenID[_TokenID["POWER"] = 12] = "POWER";
                /*
                 * String concat.
                 */
                _TokenID[_TokenID["CONCAT"] = 13] = "CONCAT";
                /*
                 * Opening bracket.
                 */
                _TokenID[_TokenID["OPEN"] = 14] = "OPEN";
                /*
                 * Closing bracket.
                 */
                _TokenID[_TokenID["CLOSE"] = 15] = "CLOSE";
                /*
                 * Group end.
                 */
                _TokenID[_TokenID["END"] = 16] = "END";
                /*
                 * Comma.
                 */
                _TokenID[_TokenID["COMMA"] = 17] = "COMMA";
                /*
                 * Period.
                 */
                _TokenID[_TokenID["PERIOD"] = 18] = "PERIOD";
                /*
                 * Literal token
                 */
                _TokenID[_TokenID["ATOM"] = 19] = "ATOM";
            })(sheet_1._TokenID || (sheet_1._TokenID = {}));
            var _TokenID = sheet_1._TokenID;
            /*
             * Specifies the type of aggregate for flexsheet.
             */
            var _FlexSheetAggregate;
            (function (_FlexSheetAggregate) {
                /*
                 * Counts the number of cells that contain numbers, and counts numbers within the list of arguments.
                 */
                _FlexSheetAggregate[_FlexSheetAggregate["Count"] = 0] = "Count";
                /*
                 * Returns the number of cells that are not empty in a range.
                 */
                _FlexSheetAggregate[_FlexSheetAggregate["CountA"] = 1] = "CountA";
                /*
                 * Returns the number of empty cells in a specified range of cells.
                 */
                _FlexSheetAggregate[_FlexSheetAggregate["ConutBlank"] = 2] = "ConutBlank";
                /*
                 * Returns the number of the cells that meet the criteria you specify in the argument.
                 */
                _FlexSheetAggregate[_FlexSheetAggregate["CountIf"] = 3] = "CountIf";
                /*
                 * Returns the number of the cells that meet multiple criteria.
                 */
                _FlexSheetAggregate[_FlexSheetAggregate["CountIfs"] = 4] = "CountIfs";
                /*
                 * Returns the rank of a number in a list of numbers.
                 */
                _FlexSheetAggregate[_FlexSheetAggregate["Rank"] = 5] = "Rank";
                /*
                 * Returns the sum of the numeric values in the cells specified by a given criteria.
                 */
                _FlexSheetAggregate[_FlexSheetAggregate["SumIf"] = 6] = "SumIf";
                /*
                 * Returns the sum of the numeric values in the cells specified by a multiple criteria.
                 */
                _FlexSheetAggregate[_FlexSheetAggregate["SumIfs"] = 7] = "SumIfs";
                /*
                 * Multiplies all the numbers given as arguments and returns the product.
                 */
                _FlexSheetAggregate[_FlexSheetAggregate["Product"] = 8] = "Product";
            })(_FlexSheetAggregate || (_FlexSheetAggregate = {}));
            /*
             * Specifies the type of subtotal f to calculate over a group of values.
             */
            var _SubtotalFunction;
            (function (_SubtotalFunction) {
                /*
                 * Returns the average value of the numeric values in the group.
                 */
                _SubtotalFunction[_SubtotalFunction["Average"] = 1] = "Average";
                /*
                 * Counts the number of cells that contain numbers, and counts numbers within the list of arguments.
                 */
                _SubtotalFunction[_SubtotalFunction["Count"] = 2] = "Count";
                /*
                 * Counts the number of cells that are not empty in a range.
                 */
                _SubtotalFunction[_SubtotalFunction["CountA"] = 3] = "CountA";
                /*
                 * Returns the maximum value in the group.
                 */
                _SubtotalFunction[_SubtotalFunction["Max"] = 4] = "Max";
                /*
                 * Returns the minimum value in the group.
                 */
                _SubtotalFunction[_SubtotalFunction["Min"] = 5] = "Min";
                /*
                 * Multiplies all the numbers given as arguments and returns the product.
                 */
                _SubtotalFunction[_SubtotalFunction["Product"] = 6] = "Product";
                /*
                 *Returns the sample standard deviation of the numeric values in the group
                 * (uses the formula based on n-1).
                 */
                _SubtotalFunction[_SubtotalFunction["Std"] = 7] = "Std";
                /*
                 *Returns the population standard deviation of the values in the group
                 * (uses the formula based on n).
                 */
                _SubtotalFunction[_SubtotalFunction["StdPop"] = 8] = "StdPop";
                /*
                 * Returns the sum of the numeric values in the group.
                 */
                _SubtotalFunction[_SubtotalFunction["Sum"] = 9] = "Sum";
                /*
                 * Returns the sample variance of the numeric values in the group
                 * (uses the formula based on n-1).
                 */
                _SubtotalFunction[_SubtotalFunction["Var"] = 10] = "Var";
                /*
                 * Returns the population variance of the values in the group
                 * (uses the formula based on n).
                 */
                _SubtotalFunction[_SubtotalFunction["VarPop"] = 11] = "VarPop";
                /*
                 * Returns the average value of the numeric values in the group and ignores the hidden rows and columns.
                 */
                _SubtotalFunction[_SubtotalFunction["AverageWithoutHidden"] = 101] = "AverageWithoutHidden";
                /*
                 * Counts the number of cells that contain numbers, and counts numbers within the list of arguments and ignores the hidden rows and columns.
                 */
                _SubtotalFunction[_SubtotalFunction["CountWithoutHidden"] = 102] = "CountWithoutHidden";
                /*
                 * Counts the number of cells that are not empty in a range and ignores the hidden rows and columns.
                 */
                _SubtotalFunction[_SubtotalFunction["CountAWithoutHidden"] = 103] = "CountAWithoutHidden";
                /*
                 * Returns the maximum value in the group and ignores the hidden rows and columns.
                 */
                _SubtotalFunction[_SubtotalFunction["MaxWithoutHidden"] = 104] = "MaxWithoutHidden";
                /*
                 * Multiplies all the numbers given as arguments and returns the product and ignores the hidden rows and columns.
                 */
                _SubtotalFunction[_SubtotalFunction["MinWithoutHidden"] = 105] = "MinWithoutHidden";
                /*
                 * Multiplies all the numbers given as arguments and returns the product and ignores the hidden rows and columns.
                 */
                _SubtotalFunction[_SubtotalFunction["ProductWithoutHidden"] = 106] = "ProductWithoutHidden";
                /*
                 *Returns the sample standard deviation of the numeric values in the group
                 * (uses the formula based on n-1) and ignores the hidden rows and columns.
                 */
                _SubtotalFunction[_SubtotalFunction["StdWithoutHidden"] = 107] = "StdWithoutHidden";
                /*
                 *Returns the population standard deviation of the values in the group
                 * (uses the formula based on n) and ignores the hidden rows and columns.
                 */
                _SubtotalFunction[_SubtotalFunction["StdPopWithoutHidden"] = 108] = "StdPopWithoutHidden";
                /*
                 * Returns the sum of the numeric values in the group and ignores the hidden rows and columns.
                 */
                _SubtotalFunction[_SubtotalFunction["SumWithoutHidden"] = 109] = "SumWithoutHidden";
                /*
                 * Returns the sample variance of the numeric values in the group
                 * (uses the formula based on n-1) and ignores the hidden rows and columns.
                 */
                _SubtotalFunction[_SubtotalFunction["VarWithoutHidden"] = 110] = "VarWithoutHidden";
                /*
                 * Returns the population variance of the values in the group
                 * (uses the formula based on n) and ignores the hidden rows and columns.
                 */
                _SubtotalFunction[_SubtotalFunction["VarPopWithoutHidden"] = 111] = "VarPopWithoutHidden";
            })(_SubtotalFunction || (_SubtotalFunction = {}));
        })(sheet = grid.sheet || (grid.sheet = {}));
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_CalcEngine.js.map