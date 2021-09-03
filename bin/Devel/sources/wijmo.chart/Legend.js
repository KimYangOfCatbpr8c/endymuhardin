var wijmo;
(function (wijmo) {
    var chart;
    (function (chart_1) {
        'use strict';
        /**
         * Represents the chart legend.
         */
        var Legend = (function () {
            function Legend(chart) {
                this._position = chart_1.Position.Right;
                this._areas = new Array();
                this._sz = new wijmo.Size();
                this._chart = chart;
            }
            Object.defineProperty(Legend.prototype, "position", {
                //--------------------------------------------------------------------------
                //** object model
                /**
                 * Gets or sets the enumerated value that determines whether and where the
                 * legend appears in relation to the chart.
                 */
                get: function () {
                    return this._position;
                },
                set: function (value) {
                    if (this._position != value) {
                        this._position = wijmo.asEnum(value, chart_1.Position);
                        if (this._chart) {
                            this._chart.invalidate();
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            //--------------------------------------------------------------------------
            //** implementation
            Legend.prototype._getDesiredSize = function (engine, pos, w, h) {
                // no legend? no size.
                //var pos = this.position;
                if (pos == chart_1.Position.None) {
                    return null;
                }
                var isVertical = pos == chart_1.Position.Right || pos == chart_1.Position.Left;
                if (this._chart instanceof wijmo.chart.FlexChartCore) {
                    this._sz = this._getDesiredSizeSeriesChart(engine, isVertical, w, h);
                }
                else if (this._chart instanceof wijmo.chart.FlexPie) {
                    this._sz = this._getDesiredSizePieChart(engine, isVertical);
                }
                else {
                    return null;
                }
                return this._sz;
            };
            Legend.prototype._getDesiredSizeSeriesChart = function (engine, isVertical, w, h) {
                // measure all series
                var sz = new wijmo.Size();
                var arr = this._chart.series;
                var len = arr.length;
                var rh = 0;
                var cw = 0;
                for (var i = 0; i < len; i++) {
                    // get the series
                    var series = wijmo.tryCast(arr[i], wijmo.chart.SeriesBase);
                    // skip hidden series and series with no names
                    var vis = series.visibility;
                    if (!series.name || vis == chart_1.SeriesVisibility.Hidden || vis == chart_1.SeriesVisibility.Plot) {
                        continue;
                    }
                    var slen = series.legendItemLength();
                    for (var si = 0; si < slen; si++) {
                        // measure the legend
                        var isz = series.measureLegendItem(engine, si);
                        if (isVertical) {
                            if (rh + isz.height > h) {
                                sz.width += cw;
                                cw = 0;
                                if (sz.height < rh) {
                                    sz.height = rh;
                                }
                                rh = 0;
                            }
                            else {
                                rh += isz.height;
                            }
                            if (cw < isz.width) {
                                cw = isz.width;
                            }
                        }
                        else {
                            if (cw + isz.width > w) {
                                sz.height += rh;
                                rh = 0;
                                if (sz.width < cw) {
                                    sz.width = cw;
                                }
                                cw = isz.width;
                            }
                            else {
                                cw += isz.width;
                            }
                            if (rh < isz.height) {
                                rh = isz.height;
                            }
                        }
                    }
                }
                if (isVertical) {
                    if (sz.height < rh) {
                        sz.height = rh;
                    }
                    sz.width += cw;
                }
                else {
                    if (sz.width < cw) {
                        sz.width = cw;
                    }
                    sz.height += rh;
                }
                return sz;
            };
            Legend.prototype._renderSeriesChart = function (engine, pos, isVertical, w, h) {
                var arr = this._chart.series;
                var len = arr.length;
                var pos0 = pos.clone();
                var rh = 0, cw = 0;
                // draw legend items
                for (var i = 0; i < len; i++) {
                    // get the series
                    var series = wijmo.tryCast(arr[i], wijmo.chart.SeriesBase);
                    if (!series) {
                        continue;
                    }
                    // skip hidden series and series with no names
                    var vis = series.visibility;
                    if (!series.name || vis == chart_1.SeriesVisibility.Hidden || vis == chart_1.SeriesVisibility.Plot) {
                        series._legendElement = null;
                        this._areas.push(null);
                        continue;
                    }
                    var slen = series.legendItemLength();
                    var g = engine.startGroup(series.cssClass);
                    if (vis == chart_1.SeriesVisibility.Legend) {
                        g.setAttribute('opacity', '0.5');
                        series._legendElement = g;
                    }
                    else if (vis == chart_1.SeriesVisibility.Visible) {
                        series._legendElement = g;
                    }
                    else {
                        series._legendElement = null;
                    }
                    for (var si = 0; si < slen; si++) {
                        // create legend item
                        var sz = series.measureLegendItem(engine, si);
                        if (isVertical) {
                            if (pos.y + sz.height > pos0.y + h) {
                                pos.y = pos0.y;
                                pos.x += cw;
                                cw = 0;
                            }
                        }
                        else {
                            if (pos.x + sz.width > pos0.x + w) {
                                pos.x = pos0.x;
                                pos.y += rh;
                                rh = 0;
                            }
                        }
                        var rect = new wijmo.Rect(pos.x, pos.y, sz.width, sz.height);
                        if (vis == chart_1.SeriesVisibility.Legend || vis == chart_1.SeriesVisibility.Visible) {
                            series.drawLegendItem(engine, rect, si);
                        }
                        // done, move on to next item
                        this._areas.push(rect);
                        if (isVertical) {
                            pos.y += sz.height;
                            if (cw < sz.width) {
                                cw = sz.width;
                            }
                        }
                        else {
                            pos.x += sz.width;
                            if (rh < sz.height) {
                                rh = sz.height;
                            }
                        }
                    }
                    engine.endGroup();
                }
            };
            Legend.prototype._getDesiredSizePieChart = function (engine, isVertical) {
                var sz = new wijmo.Size();
                var pieChart = this._chart;
                var labels = pieChart._getLabelsForLegend();
                var len = labels.length;
                for (var i = 0; i < len; i++) {
                    // measure the legend
                    var isz = pieChart._measureLegendItem(engine, labels[i]);
                    if (isVertical) {
                        sz.height += isz.height;
                        if (sz.width < isz.width) {
                            sz.width = isz.width;
                        }
                    }
                    else {
                        sz.width += isz.width;
                        if (sz.height < isz.height) {
                            sz.height = isz.height;
                        }
                    }
                }
                return sz;
            };
            Legend.prototype._renderPieChart = function (engine, pos, isVertical) {
                var pieChart = this._chart;
                var labels = pieChart._getLabelsForLegend();
                var len = labels.length;
                // draw legend items
                for (var i = 0; i < len; i++) {
                    var sz = pieChart._measureLegendItem(engine, labels[i]);
                    var rect = new wijmo.Rect(pos.x, pos.y, sz.width, sz.height);
                    pieChart._drawLegendItem(engine, rect, i, labels[i]);
                    this._areas.push(rect);
                    if (isVertical) {
                        pos.y += sz.height;
                    }
                    else {
                        pos.x += sz.width;
                    }
                }
            };
            Legend.prototype._getPosition = function (w, h) {
                if (this.position == chart_1.Position.Auto) {
                    return (w >= h) ? chart_1.Position.Right : chart_1.Position.Bottom;
                }
                else {
                    return this.position;
                }
            };
            Legend.prototype._render = function (engine, pt, pos, w, h) {
                this._areas = [];
                var isVertical = pos == chart_1.Position.Right || pos == chart_1.Position.Left;
                // draw legend area
                engine.fill = 'transparent';
                engine.stroke = null;
                engine.drawRect(pt.x, pt.y, this._sz.width, this._sz.height);
                if (this._chart instanceof wijmo.chart.FlexChartCore) {
                    this._renderSeriesChart(engine, pt, isVertical, w, h);
                }
                else if (this._chart instanceof wijmo.chart.FlexPie) {
                    this._renderPieChart(engine, pt, isVertical);
                }
                else {
                    return null;
                }
            };
            Legend.prototype._hitTest = function (pt) {
                var areas = this._areas;
                for (var i = 0; i < areas.length; i++) {
                    if (areas[i] && chart_1.FlexChartCore._contains(areas[i], pt)) {
                        return i;
                    }
                }
                return null;
            };
            return Legend;
        }());
        chart_1.Legend = Legend;
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Legend.js.map