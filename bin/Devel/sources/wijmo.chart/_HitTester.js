var wijmo;
(function (wijmo) {
    var chart;
    (function (chart_1) {
        'use strict';
        var _DataPoint = (function () {
            function _DataPoint(seriesIndex, pointIndex, dataX, dataY) {
                this._seriesIndex = seriesIndex;
                this._pointIndex = pointIndex;
                this._dataX = dataX;
                this._dataY = dataY;
            }
            Object.defineProperty(_DataPoint.prototype, "seriesIndex", {
                get: function () {
                    return this._seriesIndex;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DataPoint.prototype, "pointIndex", {
                get: function () {
                    return this._pointIndex;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DataPoint.prototype, "dataX", {
                get: function () {
                    return this._dataX;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_DataPoint.prototype, "dataY", {
                get: function () {
                    return this._dataY;
                },
                enumerable: true,
                configurable: true
            });
            return _DataPoint;
        }());
        chart_1._DataPoint = _DataPoint;
        (function (_MeasureOption) {
            _MeasureOption[_MeasureOption["X"] = 0] = "X";
            _MeasureOption[_MeasureOption["Y"] = 1] = "Y";
            _MeasureOption[_MeasureOption["XY"] = 2] = "XY";
        })(chart_1._MeasureOption || (chart_1._MeasureOption = {}));
        var _MeasureOption = chart_1._MeasureOption;
        var _RectArea = (function () {
            function _RectArea(rect) {
                this._rect = rect;
            }
            Object.defineProperty(_RectArea.prototype, "rect", {
                get: function () {
                    return this._rect;
                },
                enumerable: true,
                configurable: true
            });
            _RectArea.prototype.contains = function (pt) {
                var rect = this._rect;
                return pt.x >= rect.left && pt.x <= rect.right && pt.y >= rect.top && pt.y <= rect.bottom;
            };
            _RectArea.prototype.pointDistance = function (pt1, pt2, option) {
                var dx = pt2.x - pt1.x;
                var dy = pt2.y - pt1.y;
                if (option == _MeasureOption.X) {
                    return Math.abs(dx);
                }
                else if (option == _MeasureOption.Y) {
                    return Math.abs(dy);
                }
                return Math.sqrt(dx * dx + dy * dy);
            };
            _RectArea.prototype.distance = function (pt) {
                var option = _MeasureOption.XY;
                if (pt.x === null) {
                    option = _MeasureOption.Y;
                }
                else if (pt.y === null) {
                    option = _MeasureOption.X;
                }
                var rect = this._rect;
                if (pt.x < rect.left) {
                    if (pt.y < rect.top) {
                        return this.pointDistance(pt, new wijmo.Point(rect.left, rect.top), option);
                    }
                    else if (pt.y > rect.bottom) {
                        return this.pointDistance(pt, new wijmo.Point(rect.left, rect.bottom), option);
                    }
                    else {
                        if (option == _MeasureOption.Y) {
                            return 0;
                        }
                        return rect.left - pt.x;
                    }
                }
                else if (pt.x > rect.right) {
                    if (pt.y < rect.top) {
                        return this.pointDistance(pt, new wijmo.Point(rect.right, rect.top), option);
                    }
                    else if (pt.y > rect.bottom) {
                        return this.pointDistance(pt, new wijmo.Point(rect.right, rect.bottom), option);
                    }
                    else {
                        if (option == _MeasureOption.Y) {
                            return 0;
                        }
                        return pt.x - rect.right;
                    }
                }
                else {
                    if (option == _MeasureOption.X) {
                        return 0;
                    }
                    if (pt.y < rect.top) {
                        return rect.top - pt.y;
                    }
                    else if (pt.y > rect.bottom) {
                        return pt.y - rect.bottom;
                    }
                    else {
                        return 0;
                    }
                }
            };
            return _RectArea;
        }());
        chart_1._RectArea = _RectArea;
        var _CircleArea = (function () {
            function _CircleArea(center, radius) {
                this._center = center;
                this.setRadius(radius);
            }
            _CircleArea.prototype.setRadius = function (radius) {
                this._rad = radius;
                this._rad2 = radius * radius;
            };
            Object.defineProperty(_CircleArea.prototype, "center", {
                get: function () {
                    return this._center;
                },
                enumerable: true,
                configurable: true
            });
            _CircleArea.prototype.contains = function (pt) {
                var dx = this._center.x - pt.x;
                var dy = this._center.y - pt.y;
                return dx * dx + dy * dy <= this._rad2;
            };
            _CircleArea.prototype.distance = function (pt) {
                //var dx = pt.x !== null ? this._center.x - pt.x : 0;
                //var dy = pt.y !== null ? this._center.y - pt.y : 0;
                var dx = !isNaN(pt.x) ? this._center.x - pt.x : 0;
                var dy = !isNaN(pt.y) ? this._center.y - pt.y : 0;
                var d2 = dx * dx + dy * dy;
                if (d2 <= this._rad2)
                    return 0;
                else
                    return Math.sqrt(d2) - this._rad;
            };
            return _CircleArea;
        }());
        chart_1._CircleArea = _CircleArea;
        var _LinesArea = (function () {
            function _LinesArea(x, y) {
                this._x = [];
                this._y = [];
                this._x = x;
                this._y = y;
            }
            _LinesArea.prototype.contains = function (pt) {
                return false;
            };
            _LinesArea.prototype.distance = function (pt) {
                var dmin = NaN;
                for (var i = 0; i < this._x.length - 1; i++) {
                    var d = chart_1.FlexChart._dist(pt, new wijmo.Point(this._x[i], this._y[i]), new wijmo.Point(this._x[i + 1], this._y[i + 1]));
                    if (isNaN(dmin) || d < dmin) {
                        dmin = d;
                    }
                }
                return dmin;
            };
            return _LinesArea;
        }());
        chart_1._LinesArea = _LinesArea;
        var _HitResult = (function () {
            function _HitResult() {
            }
            return _HitResult;
        }());
        chart_1._HitResult = _HitResult;
        var _HitTester = (function () {
            //private _areas = new Array<IHitArea>();
            function _HitTester(chart) {
                this._map = {};
                this._chart = chart;
            }
            _HitTester.prototype.add = function (area, seriesIndex) {
                if (this._map[seriesIndex]) {
                    if (!area.tag) {
                        area.tag = new _DataPoint(seriesIndex, NaN, NaN, NaN);
                    }
                    this._map[seriesIndex].push(area);
                }
            };
            _HitTester.prototype.clear = function () {
                this._map = {};
                var series = this._chart.series;
                for (var i = 0; i < series.length; i++) {
                    if (series[i].hitTest === chart_1.Series.prototype.hitTest) {
                        this._map[i] = new Array();
                    }
                }
            };
            _HitTester.prototype.hitTest = function (pt, testLines) {
                if (testLines === void 0) { testLines = false; }
                var closest = null;
                var dist = Number.MAX_VALUE;
                var series = this._chart.series;
                for (var key = series.length - 1; key >= 0; key--) {
                    //for (var key in this._map) {
                    var areas = this._map[key];
                    if (areas) {
                        var len = areas.length;
                        for (var i = len - 1; i >= 0; i--) {
                            var area = areas[i];
                            if (wijmo.tryCast(area, _LinesArea) && !testLines) {
                                continue;
                            }
                            var d = area.distance(pt);
                            if (d < dist) {
                                dist = d;
                                closest = area;
                                if (dist == 0)
                                    break;
                            }
                        }
                        if (dist == 0)
                            break;
                    }
                }
                if (closest) {
                    var hr = new _HitResult();
                    hr.area = closest;
                    hr.distance = dist;
                    return hr;
                }
                return null;
            };
            _HitTester.prototype.hitTestSeries = function (pt, seriesIndex) {
                var closest = null;
                var dist = Number.MAX_VALUE;
                var areas = this._map[seriesIndex];
                if (areas) {
                    var len = areas.length;
                    for (var i = len - 1; i >= 0; i--) {
                        var area = areas[i];
                        var d = area.distance(pt);
                        if (d < dist) {
                            dist = d;
                            closest = area;
                            if (dist == 0)
                                break;
                        }
                    }
                }
                if (closest) {
                    var hr = new _HitResult();
                    hr.area = closest;
                    hr.distance = dist;
                    return hr;
                }
                return null;
            };
            return _HitTester;
        }());
        chart_1._HitTester = _HitTester;
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_HitTester.js.map