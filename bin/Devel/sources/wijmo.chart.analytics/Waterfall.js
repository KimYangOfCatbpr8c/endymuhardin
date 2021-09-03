var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var chart;
    (function (chart_1) {
        var analytics;
        (function (analytics) {
            'use strict';
            /**
             * Represents a Waterfall series of @see:wijmo.chart.FlexChart.
             *
             * The @see:Waterfall series is normally used to demonstrate how the starting
             * position either increases or decreases through a series of changes.
             */
            var Waterfall = (function (_super) {
                __extends(Waterfall, _super);
                /**
                 * Initializes a new instance of the @see:Waterfall class.
                 *
                 * @param options A JavaScript object containing initialization data for
                 * the Waterfall Series.
                 */
                function Waterfall(options) {
                    _super.call(this);
                    this._startLabel = 'Start';
                    this._relativeData = true;
                    this._connectorLines = false;
                    this._totalLabel = 'Total';
                    this._getXValues = false;
                    this._showIntermediateTotal = false;
                    this._intermediateTotalPos = [];
                    this._chartType = chart_1.ChartType.Bar;
                    this._initProperties(options || {});
                    this.rendering.addHandler(this._rendering, this);
                }
                Waterfall.prototype._initProperties = function (o) {
                    for (var key in o) {
                        if (this[key]) {
                            this[key] = o[key];
                        }
                    }
                };
                Waterfall.prototype._clearValues = function () {
                    _super.prototype._clearValues.call(this);
                    this._xValues = null;
                    this._yValues = null;
                    this._wfstyle = null;
                    this._getXValues = true;
                    this._intermediateTotalPos = [];
                    if (this.chart) {
                        //clear x labels.
                        this.chart._performBind();
                    }
                };
                Object.defineProperty(Waterfall.prototype, "relativeData", {
                    /**
                    * Gets or sets a value that determines whether the given data is relative.
                     */
                    get: function () {
                        return !!this._relativeData;
                    },
                    set: function (value) {
                        if (value != this._relativeData) {
                            this._relativeData = wijmo.asBoolean(value, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Waterfall.prototype, "start", {
                    /**
                    * Gets or sets a value that determines the value of the start bar.
                    * If start is null, start bar will not show.
                     */
                    get: function () {
                        return this._start;
                    },
                    set: function (value) {
                        if (value != this._start) {
                            this._start = wijmo.asNumber(value, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Waterfall.prototype, "startLabel", {
                    /**
                    * Gets or sets the label of the start bar.
                     */
                    get: function () {
                        return this._startLabel;
                    },
                    set: function (value) {
                        if (value != this._startLabel) {
                            this._startLabel = wijmo.asString(value, false);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Waterfall.prototype, "showTotal", {
                    /**
                    * Gets or sets a value that determines whether to show the total bar.
                     */
                    get: function () {
                        return !!this._showTotal;
                    },
                    set: function (value) {
                        if (value != this._showTotal) {
                            this._showTotal = wijmo.asBoolean(value, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Waterfall.prototype, "totalLabel", {
                    /**
                    * Gets or sets the label of the total bar.
                     */
                    get: function () {
                        return this._totalLabel;
                    },
                    set: function (value) {
                        if (value != this._totalLabel) {
                            this._totalLabel = wijmo.asString(value, false);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Waterfall.prototype, "showIntermediateTotal", {
                    /**
                     * Gets or sets a value that determines whether to show the intermediate total bar.
                     * The property should work with @see:intermediateTotalPositions and
                     * @see:intermediateTotalLabels property.
                     */
                    get: function () {
                        return this._showIntermediateTotal;
                    },
                    set: function (value) {
                        if (value != this._showIntermediateTotal) {
                            this._showIntermediateTotal = wijmo.asBoolean(value, false);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Waterfall.prototype, "intermediateTotalPositions", {
                    /**
                     * Gets or sets a value of the property that contains the index for positions
                     * of the intermediate total bar. The property should work with
                     * @see:showIntermediateTotal and @see:intermediateTotalLabels property.
                     */
                    get: function () {
                        return this._intermediateTotalPositions;
                    },
                    set: function (value) {
                        if (value != this._intermediateTotalPositions) {
                            this._intermediateTotalPositions = wijmo.asArray(value, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Waterfall.prototype, "intermediateTotalLabels", {
                    /**
                     * Gets or sets a value of the property that contains the label of the intermediate
                     * total bar; it should be an array or a string. The property should work with
                     * @see:showIntermediateTotal and @see:intermediateTotalPositions property.
                     */
                    get: function () {
                        return this._intermediateTotalLabels;
                    },
                    set: function (value) {
                        if (value != this._intermediateTotalLabels) {
                            wijmo.assert(value == null || wijmo.isArray(value) || wijmo.isString(value), 'intermediateTotalLabels should be an array or a string.');
                            this._intermediateTotalLabels = value;
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Waterfall.prototype, "connectorLines", {
                    /**
                    * Gets or sets a value that determines whether to show connector lines.
                     */
                    get: function () {
                        return !!this._connectorLines;
                    },
                    set: function (value) {
                        if (value != this._connectorLines) {
                            this._connectorLines = wijmo.asBoolean(value, true);
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Waterfall.prototype, "styles", {
                    /**
                     * Gets or sets the waterfall styles.
                     *
                     * The following styles are supported:
                     *
                     * <b>start</b>: Specifies the style of the start column.
                     *
                     * <b>total</b>: Specifies the style of the total column.
                     *
                     * <b>intermediateTotal</b>: Specifies the style of the intermediate total column.
                     *
                     * <b>falling</b>: Specifies the style of the falling columns.
                     *
                     * <b>rising</b>: Specifies the style of the rising columns.
                     *
                     * <b>connectorLines</b>: Specifies the style of the connectorLines.
                     *
                     * <pre>waterfall.styles = {
                     *   start: {
                     *      fill: 'blue',
                     *      stroke: 'blue'
                     *   },
                     *   total: {
                     *      fill: 'yellow',
                     *      stroke: 'yellow'
                     *   },
                     *   falling: {
                     *      fill: 'red',
                     *      stroke: 'red'
                     *   },
                     *   rising: {
                     *      fill: 'green',
                     *      stroke: 'green'
                     *   },
                     *   connectorLines: {
                     *      stroke: 'blue',
                     *      'stroke-dasharray': '10, 10'
                     *   }
                     * }</pre>
                     */
                    get: function () {
                        return this._styles;
                    },
                    set: function (value) {
                        if (value != this._styles) {
                            this._styles = value;
                            this._invalidate();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Waterfall.prototype.getValues = function (dim) {
                    var _this = this;
                    var val = [], original, xVals, yVals, xLabels;
                    original = _super.prototype.getValues.call(this, dim);
                    if (dim === 0) {
                        if (!this._yValues) {
                            if (this.relativeData) {
                                var val = [];
                                if (original) {
                                    original.reduce(function (a, b) {
                                        val.push(a + b);
                                        return a + b;
                                    }, 0);
                                    this._yValues = val;
                                }
                            }
                            else {
                                this._yValues = original && original.slice();
                            }
                            yVals = this._yValues;
                            if (yVals && yVals.length > 0) {
                                if (this.showIntermediateTotal && this.intermediateTotalPositions && this.intermediateTotalPositions.length > 0) {
                                    this._intermediateTotalPos = yVals.slice();
                                    this.intermediateTotalPositions.reduceRight(function (prev, curr) {
                                        var val = curr === 0 ? yVals[0] : yVals[curr - 1];
                                        if (yVals.length > curr) {
                                            yVals.splice(curr, 0, val);
                                            _this._intermediateTotalPos.splice(curr, 0, true);
                                        }
                                        else if (yVals.length === curr) {
                                            yVals.push(val);
                                            _this._intermediateTotalPos.push(true);
                                        }
                                        return 0;
                                    }, 0);
                                }
                                if (this.start != null) {
                                    yVals.splice(0, 0, this.start);
                                    this._intermediateTotalPos.splice(0, 0, false);
                                }
                                if (this.showTotal && yVals) {
                                    yVals.push(yVals[yVals.length - 1]);
                                }
                            }
                        }
                        return this._yValues;
                    }
                    else {
                        if (!this._xValues && this._getXValues) {
                            this._xValues = original && original.slice();
                            this._getXValues = false;
                            if (this.chart && this.chart._xlabels && this.chart._xlabels.length) {
                                xLabels = this.chart._xlabels;
                                if (this.showIntermediateTotal && this.intermediateTotalPositions && this.intermediateTotalPositions.length > 0) {
                                    var itLabels = this.intermediateTotalLabels;
                                    if (itLabels) {
                                        this.intermediateTotalPositions.reduceRight(function (prev, curr, idx) {
                                            var lbl = '';
                                            if (wijmo.isString(itLabels)) {
                                                lbl = itLabels;
                                            }
                                            else {
                                                lbl = itLabels[idx] || '';
                                            }
                                            if (xLabels.length > curr) {
                                                xLabels.splice(curr, 0, lbl);
                                            }
                                            else if (xLabels.length === curr) {
                                                xLabels.push(lbl);
                                            }
                                            return 0;
                                        }, 0);
                                    }
                                }
                                if (this.start != null) {
                                    xLabels.splice(0, 0, this.startLabel);
                                }
                                if (this.showTotal) {
                                    xLabels.push(this.totalLabel);
                                }
                            }
                        }
                        return this._xValues;
                    }
                };
                Waterfall.prototype._invalidate = function () {
                    _super.prototype._invalidate.call(this);
                    this._clearValues();
                };
                Waterfall.prototype._rendering = function (sender, args) {
                    var _this = this;
                    this._wfstyle = null;
                    var chart = this.chart, axisY = this._getAxisY(), axisX = this._getAxisX(), origin = axisY.origin || 0, engine = args.engine, i, len, rotated, areas, area, falling;
                    this._barPlotter = chart._getPlotter(this);
                    rotated = this._barPlotter.rotated;
                    if (!this._barPlotter._getSymbolOrigin) {
                        this._barPlotter._getSymbolOrigin = function (origin, i, len) {
                            if (i === 0) {
                                //first
                                return origin;
                            }
                            else if (_this._intermediateTotalPos[i] === true) {
                                //intermediateTotal
                                return origin;
                            }
                            else if (i === len - 1 && _this.showTotal) {
                                //last
                                return origin;
                            }
                            else {
                                return _this._yValues[i - 1];
                            }
                        };
                    }
                    if (!this._barPlotter._getSymbolStyles) {
                        this._barPlotter._getSymbolStyles = function (i, len) {
                            var wfStyle = _this._getStyles(), style = {};
                            if (i === 0 && _this.start != null) {
                                //first
                                style = wfStyle.start;
                            }
                            else if (_this._intermediateTotalPos[i] === true) {
                                //intermediateTotal
                                style = wfStyle.intermediateTotal;
                            }
                            else if (i === len - 1 && _this.showTotal) {
                                //last
                                style = wfStyle.total;
                            }
                            else {
                                if (_this._yValues[i] < _this._yValues[i - 1]) {
                                    //falling
                                    style = wfStyle.falling;
                                }
                                else {
                                    //rising
                                    style = wfStyle.rising;
                                }
                            }
                            return style;
                        };
                    }
                    this._barPlotter.plotSeries(engine, axisX, axisY, sender, chart, 0, 1);
                    if (this.connectorLines) {
                        engine.startGroup(Waterfall.CSS_CONNECTOR_LINE_GROUP);
                        areas = this._barPlotter.hitTester._map[0];
                        falling = this._yValues[0] < origin;
                        area = areas[0].rect;
                        for (i = 1, len = areas.length; i < len; i++) {
                            if (this._intermediateTotalPos[i] === true && i !== len - 1) {
                                continue;
                            }
                            this._drawConnectorLine(engine, rotated, area, areas[i].rect, falling);
                            area = areas[i].rect;
                            falling = this._yValues[i] < this._yValues[i - 1];
                        }
                        engine.endGroup();
                    }
                };
                Waterfall.prototype._getStyles = function () {
                    if (this._wfstyle) {
                        return this._wfstyle;
                    }
                    var chart = this._chart, index = chart.series.indexOf(this), fill = this._getSymbolFill(index), stroke = this._getSymbolStroke(index), s = this.styles || {}, style = {};
                    this._wfstyle = {
                        start: this._getStyleByKey(s, 'start', fill, stroke),
                        intermediateTotal: this._getStyleByKey(s, 'intermediateTotal', fill, stroke),
                        total: this._getStyleByKey(s, 'total', fill, stroke),
                        falling: this._getStyleByKey(s, 'falling', 'red', 'red'),
                        rising: this._getStyleByKey(s, 'rising', 'green', 'green')
                    };
                    return this._wfstyle;
                };
                Waterfall.prototype._getStyleByKey = function (styles, key, fill, stroke) {
                    return {
                        fill: styles[key] && styles[key].fill ? styles[key].fill : fill,
                        stroke: styles[key] && styles[key].stroke ? styles[key].stroke : stroke
                    };
                };
                Waterfall.prototype._drawConnectorLine = function (engine, rotated, prevArea, currArea, falling) {
                    var p1 = new wijmo.Point(), p2 = new wijmo.Point();
                    if (rotated) {
                        if (falling) {
                            p1.x = prevArea.left;
                            p1.y = prevArea.top + prevArea.height;
                            p2.x = prevArea.left;
                            p2.y = currArea.top;
                        }
                        else {
                            p1.x = prevArea.left + prevArea.width;
                            p1.y = prevArea.top + prevArea.height;
                            p2.x = prevArea.left + prevArea.width;
                            p2.y = currArea.top;
                        }
                    }
                    else {
                        if (falling) {
                            p1.x = prevArea.left;
                            p1.y = prevArea.top + prevArea.height;
                            p2.x = currArea.left + currArea.width;
                            p2.y = prevArea.top + prevArea.height;
                        }
                        else {
                            p1.x = prevArea.left;
                            p1.y = prevArea.top;
                            p2.x = currArea.left + currArea.width;
                            p2.y = prevArea.top;
                        }
                    }
                    engine.drawLine(p1.x, p1.y, p2.x, p2.y, Waterfall.CSS_CONNECTOR_LINE, (this.styles && this.styles.connectorLines) || { stroke: 'black' });
                };
                Waterfall.prototype.legendItemLength = function () {
                    return (this.showTotal) ? 3 : 2;
                };
                Waterfall.prototype.measureLegendItem = function (engine, index) {
                    var name = this._getName(index), retval = new wijmo.Size(0, 0);
                    if (name) {
                        retval = this._measureLegendItem(engine, this._getName(index));
                    }
                    return retval;
                };
                Waterfall.prototype.drawLegendItem = function (engine, rect, index) {
                    var style = this._getLegendStyles(index), name = this._getName(index);
                    if (name) {
                        this._drawLegendItem(engine, rect, chart_1.ChartType.Bar, this._getName(index), style, this.symbolStyle);
                    }
                };
                // helper for series with multiple styles
                // Returns the appropriate style for the given index, if
                // ones exists; null is returned otherwise.
                Waterfall.prototype._getLegendStyles = function (index) {
                    if (index < 0 || this.styles === null) {
                        return null;
                    }
                    var styles = this._getStyles();
                    if (index === 0) {
                        //rising
                        return styles.rising;
                    }
                    else if (index === 1) {
                        //falling
                        return styles.falling;
                    }
                    else {
                        //total
                        return styles.total;
                    }
                };
                // helper for series with multiple names (csv)
                // Returns undefined or the name.
                Waterfall.prototype._getName = function (index) {
                    var retval = undefined;
                    if (this.name) {
                        if (this.name.indexOf(",")) {
                            var names = this.name.split(",");
                            if (names && names.length - 1 >= index) {
                                retval = names[index].trim();
                            }
                        }
                        else {
                            retval = this.name;
                        }
                    }
                    return retval;
                };
                Waterfall.CSS_CONNECTOR_LINE_GROUP = 'water-fall-connector-lines';
                Waterfall.CSS_CONNECTOR_LINE = 'water-fall-connector-line';
                Waterfall.CSS_ENDLABEL = 'water-fall-end-label';
                return Waterfall;
            }(chart_1.SeriesBase));
            analytics.Waterfall = Waterfall;
        })(analytics = chart_1.analytics || (chart_1.analytics = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Waterfall.js.map