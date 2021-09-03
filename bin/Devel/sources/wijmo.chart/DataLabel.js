var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var chart;
    (function (chart) {
        'use strict';
        /**
         * Specifies the position of data labels on the chart.
         */
        (function (LabelPosition) {
            /** No data labels appear. */
            LabelPosition[LabelPosition["None"] = 0] = "None";
            /** The labels appear to the left of the data points. */
            LabelPosition[LabelPosition["Left"] = 1] = "Left";
            /** The labels appear above the data points. */
            LabelPosition[LabelPosition["Top"] = 2] = "Top";
            /** The labels appear to the right of the data points. */
            LabelPosition[LabelPosition["Right"] = 3] = "Right";
            /** The labels appear below the data points. */
            LabelPosition[LabelPosition["Bottom"] = 4] = "Bottom";
            /** The labels appear centered on the data points. */
            LabelPosition[LabelPosition["Center"] = 5] = "Center";
        })(chart.LabelPosition || (chart.LabelPosition = {}));
        var LabelPosition = chart.LabelPosition;
        ;
        /**
         * Specifies the position of data labels on the pie chart.
         */
        (function (PieLabelPosition) {
            /** No data labels. */
            PieLabelPosition[PieLabelPosition["None"] = 0] = "None";
            /** The label appears inside the pie slice. */
            PieLabelPosition[PieLabelPosition["Inside"] = 1] = "Inside";
            /** The item appears at the center of the pie slice. */
            PieLabelPosition[PieLabelPosition["Center"] = 2] = "Center";
            /** The item appears outside the pie slice. */
            PieLabelPosition[PieLabelPosition["Outside"] = 3] = "Outside";
        })(chart.PieLabelPosition || (chart.PieLabelPosition = {}));
        var PieLabelPosition = chart.PieLabelPosition;
        ;
        /**
         * Provides arguments for @see:DataLabel rendering event.
         */
        var DataLabelRenderEventArgs = (function (_super) {
            __extends(DataLabelRenderEventArgs, _super);
            /**
             * Initializes a new instance of the @see:DataLabelRenderEventArgs class.
             *
             * @param engine (@see:IRenderEngine) The rendering engine to use.
             * @param ht The hit test information.
             * @param pt The reference point.
             * @param text The label text.
             */
            function DataLabelRenderEventArgs(engine, ht, pt, text) {
                _super.call(this, engine);
                /**
                 * Gets or sets a value that indicates whether the event should be cancelled.
                 */
                this.cancel = false;
                this._ht = ht;
                this._pt = pt;
                this._text = text;
            }
            Object.defineProperty(DataLabelRenderEventArgs.prototype, "point", {
                /**
                 * Gets the point associated with the label in control coordinates.
                 */
                get: function () {
                    return this._pt;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataLabelRenderEventArgs.prototype, "text", {
                /**
                 * Gets or sets the label text.
                 */
                get: function () {
                    return this._text;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataLabelRenderEventArgs.prototype, "hitTestInfo", {
                /**
                 * Gets the hit test information.
                 */
                get: function () {
                    return this._ht;
                },
                enumerable: true,
                configurable: true
            });
            return DataLabelRenderEventArgs;
        }(chart.RenderEventArgs));
        chart.DataLabelRenderEventArgs = DataLabelRenderEventArgs;
        /**
        * Represents the base abstract class for the @see:DataLabel and the @see:PieDataLabel classes.
        */
        var DataLabelBase = (function () {
            function DataLabelBase() {
                /**
                 * Occurs before the rendering data label.
                 */
                this.rendering = new wijmo.Event();
            }
            Object.defineProperty(DataLabelBase.prototype, "content", {
                /**
                 * Gets or sets the content of data labels.
                 *
                 * The content can be specified as a string or as a function that
                 * takes @see:HitTestInfo object as a parameter.
                 *
                 * When the label content is a string, it can contain any of the following
                 * parameters:
                 *
                 * <ul>
                 *  <li><b>seriesName</b>: Name of the series that contains the data point (FlexChart only).</li>
                 *  <li><b>pointIndex</b>: Index of the data point.</li>
                 *  <li><b>value</b>: <b>Value</b> of the data point.</li>
                 *  <li><b>x</b>: <b>x</b>-value of the data point (FlexChart only).</li>
                 *  <li><b>y</b>: <b>y</b>-value of the data point (FlexChart only).</li>
                 *  <li><b>name</b>: <b>Name</b> of the data point.</li>
                 *  <li><b>propertyName</b>: any property of data object.</li>
                 * </ul>
                 *
                 * The parameter must be enclosed in curly brackets, for example 'x={x}, y={y}'.
                 *
                 * In the following example, we show the y value of the data point in the labels.
                 *
                 * <pre>
                 *  // Create a chart and show y data in labels positioned above the data point.
                 *  var chart = new wijmo.chart.FlexChart('#theChart');
                 *  chart.initialize({
                 *      itemsSource: data,
                 *      bindingX: 'country',
                 *      series: [
                 *          { name: 'Sales', binding: 'sales' },
                 *          { name: 'Expenses', binding: 'expenses' },
                 *          { name: 'Downloads', binding: 'downloads' }],
                 *  });
                 *  chart.dataLabel.position = "Top";
                 *  chart.dataLabel.content = "{country} {seriesName}:{y}";
                 * </pre>
                 *
                 * The next example shows how to set data label content using a function.
                 *
                 * <pre>
                 *  // Set the data label content
                 *  chart.dataLabel.content = function (ht) {
                 *    return ht.name + ":" + ht.value.toFixed();
                 *  }
                 * </pre>
                 *
                 */
                get: function () {
                    return this._content;
                },
                set: function (value) {
                    if (value != this._content) {
                        this._content = value;
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataLabelBase.prototype, "border", {
                /**
                 * Gets or sets a value indicating whether the data labels have borders.
                 */
                get: function () {
                    return this._bdr;
                },
                set: function (value) {
                    if (value != this._bdr) {
                        this._bdr = wijmo.asBoolean(value, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataLabelBase.prototype, "offset", {
                /**
                 * Gets or sets the offset from label to the data point.
                 */
                get: function () {
                    return this._off;
                },
                set: function (value) {
                    if (value != this._off) {
                        this._off = wijmo.asNumber(value, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataLabelBase.prototype, "connectingLine", {
                /**
                 * Gets or sets a value indicating whether to draw lines that connect
                 * labels to the data points.
                 */
                get: function () {
                    return this._line;
                },
                set: function (value) {
                    if (value != this._line) {
                        this._line = wijmo.asBoolean(value, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the @see:rendering event.
             *
             * @param e The @see:DataLabelRenderEventArgs object used to render the label.
             */
            DataLabelBase.prototype.onRendering = function (e) {
                this.rendering.raise(this, e);
                return e.cancel;
            };
            DataLabelBase.prototype._invalidate = function () {
                if (this._chart) {
                    this._chart.invalidate();
                }
            };
            return DataLabelBase;
        }());
        chart.DataLabelBase = DataLabelBase;
        /**
         * The point data label for FlexChart.
         */
        var DataLabel = (function (_super) {
            __extends(DataLabel, _super);
            function DataLabel() {
                _super.apply(this, arguments);
                this._pos = LabelPosition.Top;
            }
            Object.defineProperty(DataLabel.prototype, "position", {
                /**
                 * Gets or sets the position of the data labels.
                 */
                get: function () {
                    return this._pos;
                },
                set: function (value) {
                    if (value != this._pos) {
                        this._pos = wijmo.asEnum(value, LabelPosition);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            return DataLabel;
        }(DataLabelBase));
        chart.DataLabel = DataLabel;
        /**
         * The point data label for FlexPie.
         */
        var PieDataLabel = (function (_super) {
            __extends(PieDataLabel, _super);
            function PieDataLabel() {
                _super.apply(this, arguments);
                this._pos = PieLabelPosition.None;
            }
            Object.defineProperty(PieDataLabel.prototype, "position", {
                /**
                 * Gets or sets the position of the data labels.
                 */
                get: function () {
                    return this._pos;
                },
                set: function (value) {
                    if (value != this._pos) {
                        this._pos = wijmo.asEnum(value, PieLabelPosition);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            return PieDataLabel;
        }(DataLabelBase));
        chart.PieDataLabel = PieDataLabel;
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=DataLabel.js.map