module wijmo.chart.radar {
    'use strict';

    /**
     * Represents an axis in the radar chart.
     */
    export class FlexRadarAxis extends Axis {

        private _points = [];
        private _axisLabels = [];
        _height: number;

        _render(engine: IRenderEngine) {
            super._render(engine);

            var labels = this._axisLabels;
            if (labels.length) {
                var renderLabels = () => {
                    var cls = this.axisType == AxisType.X ? 'wj-axis-x-labels ' + FlexChart._CSS_AXIS_X : 'wj-axis-y-labels ' + FlexChart._CSS_AXIS_Y;
                    engine.startGroup(cls);
                    labels.forEach(lbl => {
                        var labelAngle = lbl.labelAngle;
                        if (labelAngle > 0) {
                            if (labelAngle == 90) {
                                FlexChart._renderRotatedText(engine, lbl.text, lbl.pos, lbl.align, lbl.vAlign, lbl.pos, labelAngle, lbl.class);
                            } else {
                                FlexChart._renderRotatedText(engine, lbl.text, lbl.pos, lbl.align, lbl.vAlign, lbl.pos, labelAngle, lbl.class);
                            }
                        } else if (labelAngle < 0) {
                            if (labelAngle == -90) {
                                FlexChart._renderRotatedText(engine, lbl.text, lbl.pos, lbl.align, lbl.vAlign, lbl.pos, labelAngle, lbl.class);
                            } else {
                                FlexChart._renderRotatedText(engine, lbl.text, lbl.pos, lbl.align, lbl.vAlign, lbl.pos, labelAngle, lbl.class);
                            }
                        } else {
                            this._renderLabel(engine, lbl.val, lbl.text, lbl.pos, lbl.align, lbl.vAlign /*1*/, lbl.class);
                        }
                        //this._renderLabel(engine, lbl.val, lbl.text, lbl.pos, lbl.align, lbl.vAlign, lbl.class);
                    });
                    engine.endGroup();
                    this._axisLabels = [];
                    this._chart.rendered.removeHandler(renderLabels);
                };
                this._chart.rendered.addHandler(renderLabels, this);
            }
        }

        _getHeight(engine: IRenderEngine, maxw: number): number {
            var height = super._getHeight(engine, maxw);
            if (this._axisType == AxisType.Y) {
                //height -= this.labelPadding * 2;
                //height += 4;
                height = 4;
            }
            this._height = height * 2;
            return height * 2;
        }

        _updateActualLimits(dataType: DataType, dataMin: number, dataMax: number, labels: string[] = null, values: number[] = null) {
            super._updateActualLimits(dataType, dataMin, dataMax, labels, values);

            var chart: any = this._chart,
                lbls = this._lbls,
                min = this.actualMin.valueOf ? this.actualMin.valueOf() : this.actualMin,
                max = this.actualMax.valueOf ? this.actualMax.valueOf() : this.actualMax,
                len;

            if (this._lbls && this === chart.axisX) {
                chart._angles = [];
                if (this._isTimeAxis && this._lbls.length === 0) {
                    this._values.forEach(v => {
                        lbls.push(this._formatValue(v))
                    });
                }
                len = lbls.length;
                if (chart.totalAngle < 360) {
                    len -= 1;
                }
                lbls.forEach((v, i) => {
                    var val = min + (i / len) * (max - min),
                        angle = chart.startAngle + (i / len) * chart.totalAngle;

                    if (!isNaN(angle) && !isNaN(val)) {
                        chart._angles.push({
                            value: this.convert(val),
                            angle: angle
                        });
                    }
                });
            }
        }

        _updateActualLimitsByChartType(labels, min, max) {
            var chart: any = this._chart,
                ctype = chart._getChartType();

            if (ctype != ChartType.Column && chart.totalAngle === 360) {
                if (this.axisType === AxisType.X) {
                    if (this._isTimeAxis) {
                        var len = (chart._xlabels.length || chart._xvals.length) - 1;
                        len = len < 1 ? 1 : len;
                        max += (max - min) / len;
                    } else {
                        max += 1;
                    }
                }
            }
            return { min: min, max: max };
        }

        /**
         * Converts the specified value from data to pixel coordinates.
         *
         * @param val The data value to convert.
         * @param maxValue The max value of the data, it's optional.
         * @param minValue The min value of the data, it's optional.
         */
        convert(val: number, maxValue?: number, minValue?: number): number {
            var max = maxValue == null ? this.actualMax : maxValue,
                min = minValue == null ? this.actualMin : minValue,
                chart: FlexRadar = <FlexRadar>this._chart;

            if (!chart) {
                return NaN;
            }
            if (max == min) {
                return 0;
            }

            if (this.axisType === AxisType.X) {
                if (chart.reversed) {
                    return (chart.startAngle - (val - min) / (max - min) * chart.totalAngle) * Math.PI / 180;
                } else {
                    return (chart.startAngle + (val - min) / (max - min) * chart.totalAngle) * Math.PI / 180;
                }
            } else {
                var base = this.logBase;

                if (!base) {
                    return (val - min) / (max - min) * chart._radius;
                } else {
                    if (val <= 0) {
                        return NaN;
                    }

                    var maxl = Math.log(max / min);
                    return Math.log(val / min) / maxl * chart._radius;
                }
            }
        }

        _renderLineAndTitle(engine) {
            var chart = <any>this._chart,
                lineClass = FlexChart._CSS_LINE,
                //pie segment draw from 9 o'clock in IRenderEngine
                startAngle = (chart.startAngle - 90) * Math.PI / 180,
                totalAngle = chart.totalAngle * Math.PI / 180,
                radius = chart._radius;

            if (this.axisType === AxisType.X && this.axisLine) {
                engine.stroke = FlexChart._FG;
                if (chart._isPolar) {
                    startAngle = chart.reversed ? startAngle - totalAngle : startAngle;
                    engine.drawPieSegment(chart._center.x, chart._center.y, radius, startAngle, totalAngle, lineClass); 
                } else {
                    this._renderPolygon(engine, radius, lineClass);
                }
            }
        }

        _renderPolygon(engine, r, cls) {
            var chart = <any>this._chart,
                cAngles = chart._angles,
                angleLen = cAngles.length,
                showXMinor = chart.axisX.minorGrid,
                gXPoints = [], gYPoints = [];

            cAngles.forEach((a, i) => {
                if (showXMinor && i > 0) {
                    var newP = chart._convertPoint(r, a.value - (a.value - cAngles[i - 1].value) / 2);
                    gXPoints.push(newP.x);
                    gYPoints.push(newP.y);
                }
                var p = chart._convertPoint(r, a.value);
                gXPoints.push(p.x);
                gYPoints.push(p.y);
            });
            if (chart.totalAngle < 360) {
                gXPoints.push(chart._center.x);
                gYPoints.push(chart._center.y);
            } else if (showXMinor && angleLen >= 2) {
                //add last point
                var newP = chart._convertPoint(r, cAngles[angleLen - 1].value - (cAngles[angleLen - 2].value - cAngles[angleLen - 1].value) / 2);
                gXPoints.push(newP.x);
                gYPoints.push(newP.y);
            }
            engine.drawPolygon(gXPoints, gYPoints, cls);
        }

        _renderMinors(engine: IRenderEngine, ticks: number[], isVert: boolean, isNear: boolean) {
            var chart: any = this._chart,
                glineClass = FlexChart._CSS_GRIDLINE_MINOR,
                grid = this.minorGrid,
                cAngles = chart._angles,
                angleLen = cAngles.length,
                showXMinor = chart.axisX.minorGrid,
                //gXPoints = [], gYPoints = [],
                gstroke = FlexChart._FG,
                gth = this._GRIDLINE_WIDTH,
                //pie segment draw from 9 o'clock in IRenderEngine
                startAngle = chart.startAngle * Math.PI / 180,
                totalAngle = chart.totalAngle * Math.PI / 180,
                tover = this._TICK_OVERLAP,
                tickMarks = this.minorTickMarks,
                hasTicks = true, angle;

            this._vals.minor = ticks;
            if (tickMarks == TickMark.Outside) {
                tover = 1;
            } else if (tickMarks == TickMark.Inside) {
                tover = -1;
            } else if (tickMarks == TickMark.Cross) {
                tover = 0;
            } else {
                hasTicks = false;
            }

            if (this.axisType == AxisType.Y) {
                engine.stroke = gstroke;
                engine.strokeWidth = gth;
                ticks.forEach(val => {
                    var y = this.convert(val),
                        t;
                    if (grid) {
                        this._renderYGridLine(engine, chart, y, glineClass);
                    };
                    if (hasTicks) {
                        cAngles.forEach((a, i) => {
                            if (showXMinor && i > 0) {
                                angle = a.value - (a.value - cAngles[i - 1].value) / 2;
                                var newP = chart._convertPoint(y, angle);
                                this._drawMinorTickLength(engine, tover, angle, newP);
                            }
                            angle = a.value;
                            var p = chart._convertPoint(y, angle);
                            this._drawMinorTickLength(engine, tover, angle, p);
                        });

                        if (showXMinor && angleLen >= 2) {
                            //add last point
                            angle = cAngles[angleLen - 1].value - (cAngles[angleLen - 2].value - cAngles[angleLen - 1].value) / 2;
                            var newP = chart._convertPoint(y, angle);
                            this._drawMinorTickLength(engine, tover, angle, newP);
                        }
                    }
                });
            } else {
                engine.stroke = gstroke;
                engine.strokeWidth = gth;
                ticks.forEach(val => {
                    var x = this.convert(val);
                    if (grid) {
                        this._renderXGridLine(engine, chart, x, glineClass);
                    }
                    if (hasTicks) {
                    }
                });
            }
        }

        private _drawMinorTickLength(engine, tover, angle, pt) {
            var th = this._TICK_HEIGHT,
                tickClass = FlexChart._CSS_TICK_MINOR;

            var x1 = 0.5 * (tover - 1) * th * Math.cos(angle);
            var x2 = 0.5 * (1 + tover) * th * Math.cos(angle);
            var y1 = 0.5 * (tover - 1) * th * Math.sin(angle);
            var y2 = 0.5 * (1 + tover) * th * Math.sin(angle);

            engine.drawLine(pt.x + x1, pt.y + y1, pt.x + x2, pt.y + y2, tickClass);
        }

        _renderLabelsAndTicks(engine, index, val, sval, labelAngle, tickMarks, showLabel, t1, t2) {
            this._points = [];

            labelAngle = this.labelAngle || 0;
            var hasLbl = true,
                chart: any = this._chart,
                labelPadding = this.labelPadding || 2,
                lblClass = FlexChart._CSS_LABEL,
                glineClass = FlexChart._CSS_GRIDLINE,
                tickClass = FlexChart._CSS_TICK,
                tstroke = FlexChart._FG,
                tth = this._TICK_WIDTH,
                has_gline = this.majorGrid,
                gstroke = FlexChart._FG,
                gth = this._GRIDLINE_WIDTH,
                //pie segment draw from 9 o'clock in IRenderEngine
                startAngle = chart.startAngle * Math.PI / 180,
                totalAngle = chart.totalAngle * Math.PI / 180,
                gXPoints = [], gYPoints = [];

            if (this.axisType == AxisType.Y) {
                has_gline = val != this.actualMin && has_gline && val != this.actualMax;
                var y = this.convert(val),
                    point = chart._convertPoint(y, startAngle);

                if (has_gline) {
                    engine.stroke = gstroke;
                    engine.strokeWidth = gth;
                    this._renderYGridLine(engine, chart, y, glineClass);
                }
                engine.stroke = tstroke;
                engine.strokeWidth = tth;
                if (showLabel) {
                    var lpt = new Point(point.x - labelPadding - Math.abs(t1 - t2), point.y);
                    this._axisLabels.push({
                        val: val,
                        text: sval,
                        pos: lpt,
                        align: 2,
                        vAlign: 1,
                        labelAngle: labelAngle,
                        class: lblClass
                    });
                    //hasLbl = this._renderLabel(engine, val, sval, lpt, 2, 1, lblClass);
                }
                if (tickMarks != TickMark.None) {
                    if (hasLbl) {
                        engine.drawLine(point.x - t2, point.y, point.x - t1, point.y, tickClass);
                    }
                }
            } else {
                var x = this.convert(val);
                    //point = chart._convertPoint(chart._radius, x);

                if (has_gline) {
                    engine.stroke = gstroke;
                    engine.strokeWidth = gth;
                    //engine.drawLine(chart._center.x, chart._center.y, point.x, point.y);
                    this._renderXGridLine(engine, chart, x, glineClass);
                }
                engine.stroke = tstroke;
                engine.strokeWidth = tth;
                if (showLabel) {
                    var lpt = <Point>chart._convertPoint(chart._radius + labelPadding, x),
                        angle, valign, align;

                    if (chart._angles && chart._angles.length) {
                        angle = chart._angles[index].angle;
                    } else {
                        angle = chart.startAngle + (val - this.actualMin) * chart.totalAngle / (this.actualMax - this.actualMin);
                    }

                    angle = angle % 360;
                    angle = angle >= 0 ? angle : angle + 360;
                    valign = this._getXLabelVAlign(angle);
                    align = this._getXLabelAlign(angle);

                    if (chart._isPolar) {
                        sval = this._formatValue(angle);
                        //sval = (Math.round(angle)).toString();
                    }
                    if (labelAngle > 0) {
                        if (labelAngle == 90) {
                            FlexChart._renderRotatedText(engine, sval, lpt, align, valign, lpt, labelAngle, lblClass);
                        } else {
                            FlexChart._renderRotatedText(engine, sval, lpt, align, valign, lpt, labelAngle, lblClass);
                        }
                    } else if (labelAngle < 0) {
                        if (labelAngle == -90) {
                            FlexChart._renderRotatedText(engine, sval, lpt, align, valign, lpt, labelAngle, lblClass);
                        } else {
                            FlexChart._renderRotatedText(engine, sval, lpt, align, valign, lpt, labelAngle, lblClass);
                        }
                    } else {
                        this._renderLabel(engine, val, sval, lpt, align, valign /*1*/, lblClass);
                    }
                    //hasLbl = this._renderLabel(engine, val, sval, lpt, align, valign, lblClass);
                }
            }
            return hasLbl;
        }

        private _renderXGridLine(engine, chart, x, cls) {
            var center = chart._center,
                point = chart._convertPoint(chart._radius, x);

            engine.drawLine(center.x, center.y, point.x, point.y, cls);
        }

        private _renderYGridLine(engine, chart, y, cls) {
            var cAngles = chart._angles,
                center = chart._center,
                startAngle = chart.startAngle * Math.PI / 180,
                totalAngle = chart.totalAngle * Math.PI / 180;

            if (chart._isPolar) {
                startAngle = (chart.startAngle - 90) * Math.PI / 180;
                startAngle = chart.reversed ? startAngle - totalAngle : startAngle;
                engine.drawPieSegment(center.x, center.y, y, startAngle, totalAngle, cls);
            } else {
                this._renderPolygon(engine, y, cls);
            }
        }

        private _getXLabelVAlign(angle) {
            var vAlign = 1,
                chart: any = this._chart,
                startAngle = chart.startAngle,
                reversed = chart.reversed;

            if (reversed) {
                angle = (360 + startAngle + (startAngle % 360 - angle % 360)) % 360;
            }

            if (angle === 0) {
                vAlign = 2;
            } else if (angle === 180) {
                vAlign = 0;
            }
            return vAlign;
        }

        private _getXLabelAlign(angle) {
            var align = 0,
                chart: any = this._chart,
                startAngle = chart.startAngle,
                reversed = chart.reversed;

            if (reversed) {
                angle = (360 + startAngle + (startAngle % 360 - angle % 360)) % 360;
            }
            if (angle > 0 && angle < 180) {
                align = -1;
            } else if (angle > 180 && angle < 360) {
                align = 1;
            }
            return align + 1;
        }

        _createTimeLabels(start: number, len: number, vals: number[], lbls: string[]) {
            if (this._axisType == AxisType.Y) {
                super._createTimeLabels(start, len, vals, lbls);
            } else {
                var values = this._values,
                    fmt = this.format;

                if (!values || values.length === 0) {
                    return;
                }
                values.forEach(v => {
                    vals.push(v);
                    lbls.push(this._formatValue(v));
                });
            }
        }
    }
}