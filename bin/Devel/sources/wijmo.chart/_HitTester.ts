module wijmo.chart {
    'use strict';

    export class _DataPoint {
        private _seriesIndex: number;
        private _pointIndex: number;
        private _dataX: number;
        private _dataY: number;

        constructor(seriesIndex: number, pointIndex: number, dataX: number, dataY: number) {
            this._seriesIndex = seriesIndex;
            this._pointIndex = pointIndex;
            this._dataX = dataX;
            this._dataY = dataY;
        }

        get seriesIndex(): number {
            return this._seriesIndex;
        }

        get pointIndex(): number {
            return this._pointIndex;
        }

        get dataX(): number {
            return this._dataX;
        }

        get dataY(): number {
            return this._dataY;
        }
    }

    export enum _MeasureOption {
        X,
        Y,
        XY
    }

    export class _RectArea implements _IHitArea {
        private _rect: Rect;

        constructor(rect: Rect) {
            this._rect = rect;
        }

        get rect(): Rect {
            return this._rect;
        }

        tag: any;

        contains(pt: Point): boolean {
            var rect = this._rect;
            return pt.x >= rect.left && pt.x <= rect.right && pt.y >= rect.top && pt.y <= rect.bottom;
        }

        pointDistance(pt1: Point, pt2: Point, option: _MeasureOption): number {
            var dx = pt2.x - pt1.x;
            var dy = pt2.y - pt1.y;
            if (option == _MeasureOption.X) {
                return Math.abs(dx);
            } else if (option == _MeasureOption.Y) {
                return Math.abs(dy);
            }

            return Math.sqrt(dx * dx + dy * dy);
        }

        distance(pt: Point): number {
            var option = _MeasureOption.XY;
            if (pt.x === null) {
                option = _MeasureOption.Y;
            } else if (pt.y === null) {
                option = _MeasureOption.X;
            }

            var rect = this._rect;
            if (pt.x < rect.left) { // Region I, VIII, or VII
                if (pt.y < rect.top) { // I
                    return this.pointDistance(pt, new Point(rect.left, rect.top), option);
                }
                else if (pt.y > rect.bottom) { // VII
                    return this.pointDistance(pt, new Point(rect.left, rect.bottom), option);
                }
                else { // VIII

                    if (option == _MeasureOption.Y) {
                        return 0;
                    }
                    return rect.left - pt.x;
                }
            }
            else if (pt.x > rect.right) { // Region III, IV, or V
                if (pt.y < rect.top) { // III
                    return this.pointDistance(pt, new Point(rect.right, rect.top), option);
                }
                else if (pt.y > rect.bottom) { // V
                    return this.pointDistance(pt, new Point(rect.right, rect.bottom), option);
                }
                else { // IV
                    if (option == _MeasureOption.Y) {
                        return 0;
                    }

                    return pt.x - rect.right;
                }
            }
            else { // Region II, IX, or VI
                if (option == _MeasureOption.X) {
                    return 0;
                }

                if (pt.y < rect.top) { // II
                    return rect.top - pt.y;
                }
                else if (pt.y > rect.bottom) { // VI
                    return pt.y - rect.bottom;
                }
                else { // IX
                    return 0;
                }
            }
        }
    }

    export class _CircleArea implements _IHitArea {
        private _center: Point;
        private _rad: number;
        private _rad2: number;

        tag: any;

        constructor(center: Point, radius: number) {
            this._center = center;
            this.setRadius(radius);
        }

        setRadius(radius: number) {
            this._rad = radius;
            this._rad2 = radius * radius;
        }

        get center(): Point {
            return this._center;
        }

        contains(pt: Point): boolean {
            var dx = this._center.x - pt.x;
            var dy = this._center.y - pt.y;
            return dx * dx + dy * dy <= this._rad2;
        }

        distance(pt: Point): number {
            //var dx = pt.x !== null ? this._center.x - pt.x : 0;
            //var dy = pt.y !== null ? this._center.y - pt.y : 0;
            var dx = !isNaN(pt.x) ? this._center.x - pt.x : 0;
            var dy = !isNaN(pt.y) ? this._center.y - pt.y : 0;

            var d2 = dx * dx + dy * dy;

            if (d2 <= this._rad2)
                return 0;
            else
                return Math.sqrt(d2) - this._rad;
        }
    }

    export class _LinesArea implements _IHitArea {
        private _x = [];
        private _y = [];

        tag: any;

        constructor(x: any, y: any) {
            this._x = x;
            this._y = y;
        }

        contains(pt: Point): boolean {
            return false;
        }

        distance(pt: Point): number {
            var dmin = NaN;
            for (var i = 0; i < this._x.length - 1; i++) {
                var d = FlexChart._dist(pt, new Point(this._x[i], this._y[i]), new Point(this._x[i + 1], this._y[i + 1]));
                if (isNaN(dmin) || d < dmin) {
                    dmin = d;
                }
            }

            return dmin;
        }
    }

    export class _HitResult {
        area: _IHitArea;
        distance: number;
    }

    export class _HitTester {
        _chart: FlexChartCore;
        _map: { [key: number]: Array<_IHitArea> } = {};
        //private _areas = new Array<IHitArea>();

        constructor(chart: FlexChartCore) {
            this._chart = chart;
        }

        add(area: _IHitArea, seriesIndex: number) {
            if (this._map[seriesIndex]) {
                if (!area.tag) {
                    area.tag = new _DataPoint(seriesIndex, NaN, NaN, NaN);
                }
                this._map[seriesIndex].push(area);
            }
        }

        clear() {
            this._map = {};
            var series = this._chart.series;
            for (var i = 0; i < series.length; i++) {
                if (series[i].hitTest === Series.prototype.hitTest) {
                    this._map[i] = new Array<_IHitArea>();
                }
            }
        }

        hitTest(pt: Point, testLines= false): _HitResult {
            var closest = null;
            var dist = Number.MAX_VALUE;

            var series = this._chart.series;
            for (var key = series.length-1; key >=0; key--) {
            //for (var key in this._map) {
                var areas = this._map[key];
                if (areas) {
                    var len = areas.length;

                    for (var i = len - 1; i >= 0; i--) {
                        var area = areas[i];
                        if (tryCast(area, _LinesArea) && !testLines) {
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
        }

        hitTestSeries(pt: Point, seriesIndex): _HitResult {
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
        }
    }
}