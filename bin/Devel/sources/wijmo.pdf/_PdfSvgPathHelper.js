var wijmo;
(function (wijmo) {
    var pdf;
    (function (pdf) {
        'use strict';
        var _PdfSvgPathHelper = (function () {
            function _PdfSvgPathHelper() {
            }
            /*
            * Updates the absolute coordinates using the given offset and returns an updated path.
            * @param path Path.
            * @param offset Offset.
            */
            _PdfSvgPathHelper.offset = function (path, offset) {
                var _this = this;
                var newPath = this._processPath(path, function (value, cmd, cmdIdx, argIdx) {
                    value = _this._updateOffset(value, offset, cmd, cmdIdx, argIdx);
                    return value;
                });
                return newPath;
            };
            /*
            * Updates coordinates using the given scale factor and returns an updated path.
            * @param path Path.
            * @param scale Scale factor.
            */
            _PdfSvgPathHelper.scale = function (path, scale) {
                var newPath = this._processPath(path, function (value, cmd, cmdIdx, argIdx) {
                    if (cmd === 'a' || cmd === 'A') {
                        var rm = argIdx % 7;
                        if (rm >= 2 && rm <= 4) {
                            return value;
                        }
                    }
                    return value * scale;
                });
                return newPath;
            };
            _PdfSvgPathHelper._processPath = function (path, argCallback) {
                var tkn = this._getTokenizer(path), cmd = '', res = '', argIdx = -1, cmdIdx = -1;
                for (var token; token = tkn();) {
                    if (token.length === 1 && /[a-zA-Z]/.test(token)) {
                        cmdIdx++;
                        cmd = token;
                        argIdx = -1;
                    }
                    else {
                        argIdx++;
                        var newValue = argCallback(parseFloat(token), cmd, cmdIdx, argIdx);
                        token = wijmo.toFixed(newValue, 7, false) + '';
                    }
                    res += token + ' ';
                }
                return res;
            };
            _PdfSvgPathHelper._getTokenizer = function (path) {
                var len = path.length, i = 0;
                return function () {
                    if (i >= len) {
                        return ''; // done
                    }
                    // skip whitespaces
                    while ((i < len) && (/\s/.test(path[i]) || path[i] == ',')) {
                        i++;
                    }
                    var j = i;
                    // skip numbers
                    while ((i < len) && (/[0-9\.\-eE\+]/.test(path[i]))) {
                        i++;
                    }
                    if (i != j) {
                        return path.substr(j, i - j);
                    }
                    return path.substr(i++, 1);
                };
            };
            _PdfSvgPathHelper._updateOffset = function (value, offset, cmd, cmdIdx, argIdx) {
                var o = 0;
                switch (cmd) {
                    case 'm':
                        if (cmdIdx === 0) {
                            // inspect only the first group
                            if (argIdx === 0) {
                                o = -1;
                            }
                            else {
                                if (argIdx === 1) {
                                    o = 1;
                                }
                            }
                        }
                        break;
                    case 'L': // (x y)+
                    case 'M': // (x y)+
                    case 'C': // (c1x c1y c2x c2y x y)+
                    case 'S': // (x2 y2 x y)+
                    case 'Q': // (x1 y1 x y)+
                    case 'T':
                        o = (argIdx % 2 === 0) ? -1 : 1;
                        break;
                    case 'A':
                        if (argIdx % 7 === 5) {
                            o = -1;
                        }
                        else {
                            if (argIdx % 7 === 6) {
                                o = 1;
                            }
                        }
                        break;
                    case 'H':
                        o = -1;
                        break;
                    case 'V':
                        o = 1;
                        break;
                }
                return o
                    ? (o === -1 ? value + offset.x : value + offset.y)
                    : value;
            };
            return _PdfSvgPathHelper;
        }());
        pdf._PdfSvgPathHelper = _PdfSvgPathHelper;
    })(pdf = wijmo.pdf || (wijmo.pdf = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_PdfSvgPathHelper.js.map