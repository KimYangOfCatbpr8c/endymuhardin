module wijmo.chart {
    'use strict';

    export class _BubblePlotter extends _LinePlotter {
        private _MIN_SIZE = 5;
        private _MAX_SIZE = 30;

        private _minSize: number;
        private _maxSize: number;
        private _minValue: number;
        private _maxValue: number;

        constructor() {
            super();
            this.hasLines = false;
            this.hasSymbols = true;
            this.clipping = true;
        }

        adjustLimits(dataInfo: _DataInfo, plotRect: Rect): Rect {
            var minSize = this.getNumOption('minSize', 'bubble');
            this._minSize = minSize ? minSize : this._MIN_SIZE;
            var maxSize = this.getNumOption('maxSize', 'bubble');
            this._maxSize = maxSize ? maxSize : this._MAX_SIZE;

            var series = this.chart.series;
            var len = series.length;

            var min: number = NaN;
            var max: number = NaN;
            for (var i = 0; i < len; i++) {
                var ser = <Series>series[i];
                var vals = ser._getBindingValues(1);
                if (vals) {
                    var vlen = vals.length;
                    for (var j = 0; j < vlen; j++) {
                        if (_DataInfo.isValid(vals[j])) {
                            if (isNaN(min) || vals[j] < min) {
                                min = vals[j];
                            }
                            if (isNaN(max) || vals[j] > max) {
                                max = vals[j];
                            }
                        }
                    }
                }
            }
            this._minValue = min;
            this._maxValue = max;

            var rect = super.adjustLimits(dataInfo, plotRect);

            var ax = this.chart.axisX,
                ay = this.chart.axisY;
            
            // adjust only for non-log axes
            if (ax.logBase <= 0) {
            var w = plotRect.width - this._maxSize;
            var kw = w / rect.width;
            rect.left -= this._maxSize * 0.5 / kw;
            rect.width += this._maxSize / kw;
            }

            if (ay.logBase <= 0) {
            var h = plotRect.height - this._maxSize;
            var kh = h / rect.height;
            rect.top -= this._maxSize * 0.5 / kh;
            rect.height += this._maxSize / kh;
            }
            return rect;
        }

        _drawSymbol(engine: IRenderEngine, x: number, y: number, sz: number, series: Series, pointIndex: number) {
            var item = series._getItem(pointIndex);
            if (item) {
                var szBinding = series._getBinding(1);
                if (szBinding) {
                    var sz = <number>item[szBinding];
                    if (_DataInfo.isValid(sz)) {
                        var k = this._minValue == this._maxValue ? 1 :
                            Math.sqrt((sz - this._minValue) / (this._maxValue - this._minValue));
                        sz = this._minSize + (this._maxSize - this._minSize) * k;

                        if (this.chart.itemFormatter) {
                            var hti: HitTestInfo = new HitTestInfo(this.chart, new Point(x, y), ChartElement.SeriesSymbol);
                            hti._setData( series, pointIndex);

                            engine.startGroup();
                            this.chart.itemFormatter(engine, hti, () => {
                                this._drawDefaultSymbol(engine, x, y, sz, series.symbolMarker, series.symbolStyle);
                            });
                            engine.endGroup();
                        } else {
                            this._drawDefaultSymbol(engine, x, y, sz, series.symbolMarker, series.symbolStyle);
                        }

                        var areas = this.hitTester._map[this.chart.series.indexOf(series)];
                        if (areas != null)
                        {
                            var len = areas.length;
                            for (var i = len-1; i >= 0; i--)
                            {
                                var area = areas[i];
                                if (area.tag && area.tag.pointIndex == pointIndex)
                                {
                                    var ca = tryCast(area, _CircleArea);
                                    if(ca)
                                        ca.setRadius(0.5 * sz); 
                                }
                            }
                        }

                    }
                }
            }
        }
    }
} 