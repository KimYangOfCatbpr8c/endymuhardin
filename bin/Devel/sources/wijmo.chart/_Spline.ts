module wijmo.chart {
    'use strict';

    /**
     * Calculates Spline curves.
     */
    export class _Spline {
        // 
        private k = 0.002;

        private _x;
        private _y;

        private _a = [];
        private _b = [];
        private _c = [];
        private _d = [];

        private _len: number;

        //  T^3     -1     +3    -3    +1     /
        //  T^2     +2     -5     4    -1    /
        //  T^1     -1      0     1     0   /  2
        //  T^0      0      2     0     0  /

        private m =
        [
            [-1 * 0.5, +3 * 0.5, -3 * 0.5, +1 * 0.5],
            [+2 * 0.5, -5 * 0.5, +4 * 0.5, -1 * 0.5],
            [-1 * 0.5, 0, +1 * 0.5, 0],
            [0, +2 * 0.5, 0, 0],
        ];

        //public Point[] Points
        //{
        //    get { return _pts; }
        //}

        constructor(x: number[], y: number[]) {
            this._x = x;
            this._y = y;

            var len = this._len = Math.min(x.length, y.length);

            if (len > 3) {
                for (var i = 0; i < len - 1; i++) {
                    var p1 = (i == 0) ? new Point(x[i], y[i]) : new Point(x[i - 1], y[i - 1]);
                    var p2 = new Point(x[i], y[i]);
                    var p3 = new Point(x[i + 1], y[i + 1]);
                    var p4 = (i == len - 2) ? new Point(x[i + 1], y[i + 1]) : new Point(x[i + 2], y[i + 2]);

                    var a = new Point();
                    var b = new Point();
                    var c = new Point();
                    var d = new Point();

                    a.x = p1.x * this.m[0][0] + p2.x * this.m[0][1] + p3.x * this.m[0][2] + p4.x * this.m[0][3];
                    b.x = p1.x * this.m[1][0] + p2.x * this.m[1][1] + p3.x * this.m[1][2] + p4.x * this.m[1][3];
                    c.x = p1.x * this.m[2][0] + p2.x * this.m[2][1] + p3.x * this.m[2][2] + p4.x * this.m[2][3];
                    d.x = p1.x * this.m[3][0] + p2.x * this.m[3][1] + p3.x * this.m[3][2] + p4.x * this.m[3][3];

                    a.y = p1.y * this.m[0][0] + p2.y * this.m[0][1] + p3.y * this.m[0][2] + p4.y * this.m[0][3];
                    b.y = p1.y * this.m[1][0] + p2.y * this.m[1][1] + p3.y * this.m[1][2] + p4.y * this.m[1][3];
                    c.y = p1.y * this.m[2][0] + p2.y * this.m[2][1] + p3.y * this.m[2][2] + p4.y * this.m[2][3];
                    d.y = p1.y * this.m[3][0] + p2.y * this.m[3][1] + p3.y * this.m[3][2] + p4.y * this.m[3][3];

                    this._a.push(a);
                    this._b.push(b);
                    this._c.push(c);
                    this._d.push(d);
                }
            }
        }

        private calculatePoint(val: number): any {
            var i = Math.floor(val);

            if (i < 0) {
                i = 0;
            }

            if (i > this._len - 2) {
                i = this._len - 2;
            }

            var d = val - i;

            var x = ((this._a[i].x * d + this._b[i].x) * d + this._c[i].x) * d + this._d[i].x;
            var y = ((this._a[i].y * d + this._b[i].y) * d + this._c[i].y) * d + this._d[i].y;

            return { x: x, y: y };
        }

        calculate() {
            if (this._len <= 3) {
                return { xs: this._x, ys: this._y };
            }

            var xs = [];
            var ys = [];

            var p0 = this.calculatePoint(0);
            xs.push(p0.x);
            ys.push(p0.y);

            var delta = this._len * this.k;
            var d = 3;

            for (var i = delta; i <= this._len - 1; i += delta)
            {
                var p = this.calculatePoint(i);

                if (Math.abs(p0.x - p.x) >= d || Math.abs(p0.y - p.y) >= d) {
                    xs.push(p.x);
                    ys.push(p.y)
                    p0 = p;
                }
            }

            return { xs: xs, ys: ys };
        }
    }
}