//
// AngularJS directives for wijmo.chart module
//
module wijmo.angular {
    //#region "Charts directives registration"

    var wijmoChart = window['angular'].module('wj.chart', []);

    // register only if module is loaded
    if (wijmo.chart && wijmo.chart.FlexChart) {
        wijmoChart.directive('wjFlexChart', [function () {
            return new WjFlexChart();
        }]);

        wijmoChart.directive('wjFlexChartAxis', [function () {
            return new WjFlexChartAxis();
        }]);

        wijmoChart.directive('wjFlexChartSeries', [function () {
            return new WjFlexChartSeries();
        }]);

        wijmoChart.directive('wjFlexChartLegend', [function () {
            return new WjFlexChartLegend();
        }]);

        wijmoChart.directive('wjFlexChartDataLabel', [function () {
            return new WjFlexChartDataLabel();
        }]);

        wijmoChart.directive('wjFlexPieDataLabel', [function () {
            return new WjFlexPieDataLabel();
        }]);

        wijmoChart.directive('wjFlexChartLineMarker', [function () {
            return new WjFlexChartLineMarker();
        }]);

        wijmoChart.directive('wjFlexChartPlotArea', [function () {
            return new WjFlexChartPlotArea();
        }]);

        wijmoChart.directive('wjFlexChartDataPoint', [function () {
            return new WjFlexChartDataPoint();
        }]);

        if (wijmo.chart.interaction) {
            wijmoChart.directive('wjFlexChartRangeSelector', [function () {
                return new WjFlexChartRangeSelector();
            }]);
            wijmoChart.directive('wjFlexChartGestures', [function () {
                return new WjFlexChartChartGestures();
            }]);
            wijmoChart.directive('wjFlexChartChartGestures', [function () {
                return new WjFlexChartChartGestures();
            }]);
        }

        if (wijmo.chart.annotation) {
            wijmoChart.directive('wjFlexChartAnnotationLayer', [function () {
                return new WjFlexChartAnnotationLayer();
            }]);
            wijmoChart.directive('wjFlexChartAnnotation', [function () {
                return new WjFlexChartAnnotation();
            }]);
        }

        wijmoChart.directive('wjFlexPie', [function() {
            return new WjFlexPie();
        }]);


        if (wijmo.chart.hierarchical) {
            wijmoChart.directive('wjSunburst', [function () {
                return new WjSunburst();
            }]);
        }

        if (wijmo.chart.radar) {
            wijmoChart.directive('wjFlexRadar', [function () {
                return new WjFlexRadar();
            }]);

            wijmoChart.directive('wjFlexRadarSeries', [function () {
                return new WjFlexRadarSeries();
            }]);
        }

        if (wijmo.chart.finance) {
            wijmoChart.directive('wjFinancialChart', [function () {
                return new WjFinancialChart();
            }]);

            wijmoChart.directive('wjFinancialChartSeries', [function () {
                return new WjFinancialChartSeries();
            }]);

            if (wijmo.chart.finance.analytics) {
                wijmoChart.directive('wjFlexChartFibonacci', [function () {
                    return new WjFlexChartFibonacci();
                }]);

                wijmoChart.directive('wjFlexChartFibonacciArcs', [function () {
                    return new WjFlexChartFibonacciArcs();
                }]);

                wijmoChart.directive('wjFlexChartFibonacciFans', [function () {
                    return new WjFlexChartFibonacciFans();
                }]);

                wijmoChart.directive('wjFlexChartFibonacciTimeZones', [function () {
                    return new WjFlexChartFibonacciTimeZones();
                }]);

                wijmoChart.directive('wjFlexChartAtr', [function () {
                    return new WjFlexChartAtr();
                }]);

                wijmoChart.directive('wjFlexChartCci', [function () {
                    return new WjFlexChartCci();
                }]);

                wijmoChart.directive('wjFlexChartRsi', [function () {
                    return new WjFlexChartRsi();
                }]);

                wijmoChart.directive('wjFlexChartWilliamsR', [function () {
                    return new WjFlexChartWilliamsR();
                }]);

                wijmoChart.directive('wjFlexChartMacd', [function () {
                    return new WjFlexChartMacd();
                }]);

                wijmoChart.directive('wjFlexChartMacdHistogram', [function () {
                    return new WjFlexChartMacdHistogram();
                }]);

                wijmoChart.directive('wjFlexChartStochastic', [function () {
                    return new WjFlexChartStochastic();
                }]);

                wijmoChart.directive('wjFlexChartBollingerBands', [function () {
                    return new WjFlexChartBollingerBands();
                }]);

                wijmoChart.directive('wjFlexChartEnvelopes', [function () {
                    return new WjFlexChartEnvelopes();
                }]);
            }
        }

        if (wijmo.chart.analytics) {
            wijmoChart.directive('wjFlexChartTrendLine', [function() {
                return new WjFlexChartTrendLine();
            }]);

            wijmoChart.directive('wjFlexChartMovingAverage', [function() {
                return new WjFlexChartMovingAverage();
            }]);

            wijmoChart.directive('wjFlexChartYFunctionSeries', [function () {
                return new WjFlexChartYFunctionSeries();
            }]);

            wijmoChart.directive('wjFlexChartParametricFunctionSeries', [function () {
                return new WjFlexChartParametricFunctionSeries();
            }]);

            wijmoChart.directive('wjFlexChartWaterfall', [function () {
                return new WjFlexChartWaterfall();
            }]);
        }

        if (wijmo.chart.animation) {
            wijmoChart.directive('wjFlexChartAnimation', [function () {
                return new WjFlexChartAnimation();
            }]);
        }
    }

    //#endregion "Charts directives definitions"

    //#region "Charts directives classes"

    // Base class for WjFlexCore and FlexPie directives with common prop and event dictionaries
    class WjFlexChartBase extends WjDirective {

        // Initializes a new instance of a WjFlexChart
        constructor() {
            super();

            var self = this;

            this.template = '<div ng-transclude />';
            this.transclude = true;
        }

        get _controlConstructor() {
            return wijmo.chart.FlexChartBase;
        }

        _initProps() {
            super._initProps();
            var self = this; // store this in closure as .apply() call overrides the reference
            var tooltipDesc = MetaFactory.findProp('tooltipContent', this._props);
            tooltipDesc.customHandler = function (scope, control, value, oldValue, link) {
                if (value != null) {
                    (<wijmo.chart.FlexChart>control).tooltip.content = value;
                }
            };
        }

        }

    // Base class for WjFlexChart and WjFinancialChart
    class WjFlexChartCore extends WjFlexChartBase {

        // gets the Wijmo FlexChart control constructor
        get _controlConstructor() {
            return wijmo.chart.FlexChartCore;
        }

        _initProps() {
            super._initProps();
            var self = this; // store this in closure as .apply() call overrides the reference

            var lblContentDesc = MetaFactory.findProp('labelContent', this._props);
            lblContentDesc.customHandler = function (scope, control, value, oldValue, link) {
                if (value != null) {
                    (<wijmo.chart.FlexChart>control).dataLabel.content = value;
                }
            };
        }
    }


    /**
     * AngularJS directive for the @see:FlexChart control.
     *
     * Use the <b>wj-flex-chart</b> directive to add charts to your AngularJS applications.
     * Note that directive and parameter names must be formatted using lower-case letters
     * with dashes instead of camel case. For example:
     *
     * <pre>&lt;p&gt;Here is a FlexChart control:&lt;/p&gt;
     * &lt;wj-flex-chart
     *   style="height:300px"
     *   items-source="data"
     *   binding-x="country"&gt;
     *   &lt;wj-flex-chart-axis
     *     wj-property="axisY"
     *     major-unit="5000"&gt;
     *   &lt;/wj-flex-chart-axis&gt;
     *   &lt;wj-flex-chart-series
     *     binding="sales"
     *     name="Sales"&gt;
     *   &lt;/wj-flex-chart-series&gt;
     *   &lt;wj-flex-chart-series
     *     binding="expenses"
     *     name="Expenses"&gt;
     *   &lt;/wj-flex-chart-series&gt;
     *   &lt;wj-flex-chart-series
     *     binding="downloads"
     *     name="Downloads"
     *     chart-type="LineSymbols"&gt;
     *   &lt;/wj-flex-chart-series&gt;
     * &lt;/wj-flex-chart&gt;</pre>
     *
     * The example below creates a @see:FlexChart control and binds it to a 'data' array
     * exposed by the controller. The chart has three series objects, each corresponding to
     * a property in the objects contained in the source array. The last series in the
     * example uses the 'chart-type' attribute to override the default chart type used
     * for the other series objects.
     *
     * @fiddle:QNb9X
     *
     * The wj-flex-chart directive supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>binding</dt>           <dd><code>@</code> The name of the property that contains Y
     *                              values for the chart. You can override this at the series level.</dd>
     *   <dt>binding-x</dt>         <dd><code>@</code> The name of the property that contains X
     *                              values for the chart. You can override this at the series level.</dd>
     *   <dt>chart-type</dt>        <dd><code>@</code> The default chart type to use in rendering series
     *                              objects. You can override this at the series level. See @see:ChartType.</dd>
     *   <dt>control</dt>           <dd><code>=</code> A reference to the @see:FlexChart control
     *                              that this directive creates.</dd>
     *   <dt>footer</dt>            <dd><code>@</code> The text to display in the chart footer (plain
     *                              text).</dd>
     *   <dt>footer-style</dt>       <dd><code>=</code> The style to apply to the chart footer.</dd>
     *   <dt>header</dt>            <dd><code>@</code> The text to display in the chart header (plain
     *                              text).</dd>
     *   <dt>header-style</dt>      <dd><code>=</code> The style to apply to the chart header.</dd>
     *   <dt>initialized</dt>       <dd><code>&</code> This event occurs after the binding has finished
     *                              initializing the control with attribute values.</dd>
     *   <dt>is-initialized</dt><dd><code>=</code> A value indicating whether the binding has finished
     *                              initializing the control with attribute values. </dd>
     *   <dt>interpolate-nulls</dt> <dd><code>@</code> The value indicating whether to interpolate or
     *                              leave gaps when there are null values in the data.</dd>
     *   <dt>item-formatter</dt>    <dd><code>=</code> The formatter function that customizes the
     *                              appearance of data points.</dd>
     *   <dt>items-source</dt>      <dd><code>=</code> An array or @see:ICollectionView object that contains
     *                              the data used to create the chart.</dd>
     *   <dt>legend-toggle</dt>     <dd><code>@</code> The value indicating whether clicking legend items
     *                              toggles series visibility.</dd>
     *   <dt>options</dt>           <dd><code>=</code> Chart options that only apply to certain chart types.
     *                              See <b>options</b> under @see:FlexChart for details.</dd>
     *   <dt>palette</dt>           <dd><code>=</code> An array that contains the default colors used for
     *                              displaying each series.</dd>
     *   <dt>plot-margin</dt>       <dd><code>=</code> The number of pixels of space to leave between the
     *                              edges of the control and the plot area, or CSS-style margins.</dd>
     *   <dt>rotated</dt>           <dd><code>@</code> The value indicating whether to flip the axes so that
     *                              X is vertical and Y is horizontal.</dd>
     *   <dt>selection</dt>         <dd><code>=</code> The series object that is selected.</dd>
     *   <dt>selection-mode</dt>    <dd><code>@</code> The @see:SelectionMode value indicating whether or what is
     *                              selected when the user clicks a series.</dd>
     *   <dt>stacking</dt>          <dd><code>@</code> The @see:Stacking value indicating whether or how series
     *                              objects are stacked or plotted independently.</dd>
     *   <dt>symbol-size</dt>       <dd><code>@</code> The size of the symbols used to render data points in Scatter,
     *                              LineSymbols, and SplineSymbols charts, in pixels. You can override
     *                              this at the series level.</dd>
     *   <dt>tooltip-content</dt>   <dd><code>@</code> The value to display in the
     *                              @see:ChartTooltip content property.</dd>
     *   <dt>got-focus</dt>         <dd><code>&</code> The @see:FlexChart.gotFocus event handler.</dd>
     *   <dt>lost-focus</dt>        <dd><code>&</code> The @see:FlexChart.lostFocus event handler.</dd>
     *   <dt>rendering</dt>         <dd><code>&</code> The @see:FlexChart.rendering event handler.</dd>
     *   <dt>rendered</dt>          <dd><code>&</code> The @see:FlexChart.rendered event handler.</dd>
     *   <dt>series-visibility-changed</dt>
     *                              <dd><code>&</code> The @see:FlexChart.seriesVisibilityChanged event handler.</dd>
     *   <dt>selection-changed</dt> <dd><code>&</code> The @see:FlexChart.selectionChanged event handler.</dd>
     * </dl>
     *
     * The wj-flex-chart directive may contain the following child directives:
     * @see:WjFlexChartAxis, @see:WjFlexChartSeries, @see:WjFlexChartLegend and @see:WjFlexChartDataLabel.
     */
    class WjFlexChart extends WjFlexChartCore {

        // gets the Wijmo FlexChart control constructor
        get _controlConstructor() {
            return wijmo.chart.FlexChart;
        }
    }


    /**
     * AngularJS directive for the @see:FlexChart @see:Axis object.
     *
     * The <b>wj-flex-chart-axis</b> directive must be contained in a @see:WjFlexChart directive or @see:WjFinancialChart directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>wj-property</dt>     <dd><code>@</code> Defines the @see:FlexChart property name,
     *                            axis-x or axis-y, to initialize with the directive.</dd>
     *   <dt>axis-line</dt>       <dd><code>@</code> The value indicating whether the axis line is visible.</dd>
     *   <dt>binding</dt>         <dd><code>@</code> Gets or sets the comma-separated property names for
     *                            the @see:wijmo.chart.Axis.itemsSource property to use in axis labels.
     *                            The first name specifies the value on the axis, the second represents
     *                            the corresponding axis label. The default value is 'value,text'.</dd>
     *   <dt>format</dt>          <dd><code>@</code> The format string used for the axis labels
     *                            (see @see:Globalize).</dd>
     *   <dt>item-formatter</dt>  <dd><code>=</code> The formatter function that customizes the
     *                            appearance of axis labels.</dd>
     *   <dt>items-source</dt>    <dd><code>=</code> The items source for the axis labels.</dd>
     *   <dt>labels</dt>          <dd><code>@</code> The value indicating whether the axis labels are visible.</dd>
     *   <dt>label-angle</dt>     <dd><code>@</code> The rotation angle of axis labels in degrees.</dd>
     *   <dt>label-align</dt>     <dd><code>@</code> The alignment of axis labels.</dd>
     *   <dt>label-padding</dt>   <dd><code>@</code> The padding of axis labels.</dd>
     *   <dt>major-grid</dt>      <dd><code>@</code> The value indicating whether the axis includes grid lines.</dd>
     *   <dt>major-tick-marks</dt><dd><code>@</code> Defines the appearance of tick marks on the axis
     *                            (see @see:TickMark).</dd>
     *   <dt>major-unit</dt>      <dd><code>@</code> The number of units between axis labels.</dd>
     *   <dt>max</dt>             <dd><code>@</code> The minimum value shown on the axis.</dd>
     *   <dt>min</dt>             <dd><code>@</code> The maximum value shown on the axis.</dd>
     *   <dt>minor-grid</dt>      <dd><code>@</code> The value indicating whether the axis includes minor grid lines.</dd>
     *   <dt>minor-tick-marks</dt><dd><code>@</code> Defines the appearance of minor tick marks on the axis
     *                            (see @see:TickMark).</dd>
     *   <dt>minor-unit</dt>      <dd><code>@</code> The number of units between minor axis ticks.</dd>
     *   <dt>origin</dt>          <dd><code>@</code> The axis origin.</dd>
     *   <dt>overlappingLabels</dt><dd><code>@</code> The @see:OverlappingLabels value indicating how to handle the overlapping axis labels.</dd>
     *   <dt>position</dt>        <dd><code>@</code> The @see:Position value indicating the position of the axis.</dd>
     *   <dt>reversed</dt>        <dd><code>@</code> The value indicating whether the axis is reversed (top to
     *                            bottom or right to left).</dd>
     *   <dt>title</dt>           <dd><code>@</code> The title text shown next to the axis.</dd>
     * </dl>
     */
    class WjFlexChartAxis extends WjDirective {

        // Initializes a new instance of a WjFlexCharAxis.
        constructor() {
            super();

            this.require = ['?^wjFlexChartSeries', '?^wjFinancialChartSeries', '?^wjFlexChart', '?^wjFinancialChart', '?^wjFlexRadar'];
            this.template = '<div class="wjFlexChartAxis" />';
        }

        get _controlConstructor() {
            return wijmo.chart.Axis;
        }

        _initControl(element: any): any {
            return super._initControl(undefined);
        }

    }

    /**
     * AngularJS directive for the @see:FlexChart @see:Legend object.
     *
     * The <b>wj-flex-chart-legend</b> directive must be contained in a @see:WjFlexChart directive, @see:WjFlexPie directive or @see:WjFinancialChart directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>position</dt>       <dd><code>@</code> The @see:Position value indicating the position of the
     *                           legend.</dd>
     * </dl>
     *
     * The example below shows how you can use the wj-flex-chart-legend directive
     * to change the position of the chart legend:
     *
     * <pre>&lt;wj-flex-chart
     *   items-source="data"
     *   binding-x="country"&gt;
     *   &lt;wj-flex-chart-axis
     *       wj-property="axisY"
     *       major-unit="5000"&gt;
     *     &lt;/wj-flex-chart-axis&gt;
     *     &lt;wj-flex-chart-series
     *       binding="sales"
     *       name="Sales"&gt;
     *     &lt;/wj-flex-chart-series&gt;
     *   &lt;wj-flex-chart-legend
     *     position="Bottom"&gt;
     *   &lt;/wj-flex-chart-legend&gt;
     * &lt;/wj-flex-chart&gt;</pre>
     */
    class WjFlexChartLegend extends WjDirective {

        // Initializes a new instance of a WjFlexChartLegend.
        constructor() {
            super();

            this.require = ['?^wjFlexChart', '?^wjFlexPie', '?^wjSunburst', '?^wjFinancialChart', '?^wjFlexRadar'];
            this.template = '<div />';
        }

        get _controlConstructor() {
            return wijmo.chart.Legend;
        }

    }

    // abstract
    class WjFlexChartDataLabelBase extends WjDirective {

        constructor() {
            super();

            this.require = ['?^wjFlexChart', '?^wjFlexPie', '?^wjSunburst'];
            this.template = '<div />';
        }

        get _controlConstructor() {
            return wijmo.chart.DataLabelBase;
        }

    }

    /**
     * AngularJS directive for the @see:FlexChart @see:DataLabel object.
     *
     * The <b>wj-flex-chart-data-label</b> directive must be contained in a @see:WjFlexChart directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>content</dt>       <dd><code>=</code> A string or function that gets or sets the content of the data labels.</dd>
     *   <dt>border</dt>        <dd><code>@</code> Gets or sets a value indicating whether the data labels have borders.</dd>
     *   <dt>position</dt>      <dd><code>@</code> The @see:LabelPosition value indicating the position of the data labels.</dd>
     * </dl>
     */
    class WjFlexChartDataLabel extends WjFlexChartDataLabelBase {

        constructor() {
            super();
            this.require = '^wjFlexChart';
        }

        get _controlConstructor() {
            return wijmo.chart.DataLabel;
        }

    }

    /**
     * AngularJS directive for the @see:FlexPie @see:PieDataLabel object.
     *
     * The <b>wj-flex-pie-data-label</b> directive must be contained in a @see:WjFlexPie directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>content</dt>       <dd><code>=</code> A string or function that gets or sets the content of the data labels.</dd>
     *   <dt>border</dt>        <dd><code>@</code> Gets or sets a value indicating whether the data labels have borders.</dd>
     *   <dt>position</dt>      <dd><code>@</code> The @see:PieLabelPosition value indicating the position of the data labels.</dd>
     * </dl>
     */
    class WjFlexPieDataLabel extends WjFlexChartDataLabelBase {

        constructor() {
            super();
            this.require = ['^wjFlexPie', '?^wjSunburst'];
        }

        get _controlConstructor() {
            return wijmo.chart.PieDataLabel;
        }

    }

    // abstract for FlexChart and FinancialChart series
    class WjSeriesBase extends WjDirective {
        constructor() {
            super();
            this.require = ['?^wjFlexChart', '?^wjFinancialChart', '?^wjFlexRadar'];
            this.template = '<div class="wjSeriesBase" ng-transclude />';
            this.transclude = true;
        }

        get _controlConstructor(): any {
            return wijmo.chart.SeriesBase;
        }

        _getId(): string {
            // fixes issue with ordering of series that
            // are of different types
            return 'series';
        }
    }

    /**
     * AngularJS directive for the @see:FlexChart @see:Series object.
     *
     * The <b>wj-flex-chart-series</b> directive must be contained in a @see:WjFlexChart directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>axis-x</dt>       <dd><code>@</code> X-axis for the series.</dd>
     *   <dt>axis-y</dt>       <dd><code>@</code> Y-axis for the series.</dd>
     *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>chart-type</dt>   <dd><code>@</code> The chart type to use in rendering objects for this series
     *                         objects. This value overrides the default chart type set on the chart. See
     *                         @see:ChartType.</dd>
     *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
     *   <dt>items-source</dt> <dd><code>=</code> An array or @see:ICollectionView object that contains
     *                         data for this series.</dd>
     *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
     *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
     *                         style object as an object. See the section on ngAttr attribute bindings in
     *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
     *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
     *                         "http://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
     *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
     *   <dt>altStyle</dt>     <dd><code>=</code> The series alternative style.</dd>
     *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
     *                         overrides the default marker set on the chart. See @see:Marker.</dd>
     *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data points in this series
     *                         for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
     *                         This value overrides any settings at the chart level.</dd>
     *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
     *                         This value overrides any settings at the chart level.</dd>
     *   <dt>visibility</dt>   <dd><code>=</code> The @see:SeriesVisibility value indicating whether and where to
     *                         display the series.</dd>
     * </dl>
     *
     * In most cases, the <b>wj-flex-chart-series</b> specifies only the <b>name</b> and <b>binding</b> properties.
     * The remaining values are inherited from the parent <b>wj-flex-chart</b> directive.
     */
    class WjFlexChartSeries extends WjSeriesBase {

        // Initializes a new instance of a WjFlexChartSeries
        constructor() {
            super();
            this.require = '^wjFlexChart';
            this.template = '<div class="wjFlexChartSeries" ng-transclude />';
            //this.transclude = true;
        }

        // Returns constructor of related Wijmo object. Abstract member, must be overridden in inherited class
        get _controlConstructor(): any { //: new (elem: HTMLElement) => wijmo.Control {
            return wijmo.chart.Series;
        }
    }

    /**
     * AngularJS directive for the @see:FlexChart @see:LineMarker object.
     *
     * The <b>wj-flex-line-marker</b> directive must be contained in a @see:WjFlexChart directive or @see:WjFinancialChart directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>is-visible</dt>             <dd><code>@</code> The value indicating whether the LineMarker is visible.</dd>
     *   <dt>series-index</dt>           <dd><code>@</code> The index of the series in the chart in which the LineMarker appears.</dd>
     *   <dt>horizontal-position</dt>    <dd><code>@</code> The horizontal position of the LineMarker relative to the plot area.</dd>
     *   <dt>content</dt>               <dd><code>@</code> The function that allows you to customize the text content of the LineMarker.</dd>
     *   <dt>vertical-position</dt>      <dd><code>@</code> The vertical position of the LineMarker relative to the plot area.</dd>
     *   <dt>alignment</dt>             <dd><code>@</code> The @see:LineMarkerAlignment value indicating the alignment of the LineMarker content.</dd>
     *   <dt>lines</dt>                 <dd><code>@</code> The @see:LineMarkerLines value indicating the appearance of the LineMarker's lines.</dd>
     *   <dt>interaction</dt>           <dd><code>@</code> The @see:LineMarkerInteraction value indicating the interaction mode of the LineMarker.</dd>
     *   <dt>drag-threshold</dt>         <dd><code>@</code> The maximum distance from the horizontal or vertical line that you can drag the marker.</dd>
     *   <dt>drag-content</dt>           <dd><code>@</code> The value indicating whether you can drag the content of the marker when the interaction mode is "Drag".</dd>
     *   <dt>drag-lines</dt>             <dd><code>@</code> The value indicating whether the lines are linked when you drag the horizontal or vertical line when the interaction mode is "Drag".</dd>
     * </dl>
     */
    class WjFlexChartLineMarker extends WjDirective {

        // Initializes a new instance of a WjFlexChartLineMarker
        constructor() {
            super();
            this.require = ['?^wjFlexChart', '?^wjFinancialChart'];
        }

        get _controlConstructor(): any {
            return wijmo.chart.LineMarker;
        }
    }


    /**
     * AngularJS directive for the @see:FlexChart @see:DataPoint object.
     *
     * The <b>wj-flex-chart-data-point</b> directive must be contained in a
     * @see:WjFlexChartAnnotation directive. The property of the parent directive's object
     * where <b>wj-flex-data-point</b> should assign a value is specified in the
     * <b>wj-property</b> attribute.
     *
     * The directive supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *
     *   <dt>wj-property</dt>        <dd><code>@</code> The name of the parent directive object's property where the
     *                                <b>DataPoint</b> will be assigned.</dd>
     *   <dt>x</dt>                  <dd><code>@</code> x coordinate, can be a numeric or date value.</dd>
     *   <dt>y</dt>                  <dd><code>@</code> y coordinate, can be a numeric or date value.</dd>
     * </dl>
     */
    class WjFlexChartDataPoint extends WjDirective {

        // Initializes a new instance of a WjFlexChartDataPoint
        constructor() {
            super();
            this.require = ['?^wjFlexChartAnnotation'];
        }

        get _controlConstructor(): any {
            return wijmo.chart.DataPoint;
        }
    }

    /**
     * AngularJS directive for the @see:FlexChart @see:AnnotationLayer object.
     *
     * The <b>wj-flex-chart-annotation-layer</b> directive must be contained in a @see:WjFlexChart directive
     * or @see:WjFinancialChart directive.
     *
     */
    class WjFlexChartAnnotationLayer extends WjDirective {

        // Initializes a new instance of a WjFlexChartAnnotationLayer
        constructor() {
            super();
            this.require = ['?^wjFlexChart', '?^wjFinancialChart'];
            this.template = '<div class="wjFlexChartAnnotationLayer" ng-transclude />';
            this.transclude = true;
        }

        get _controlConstructor(): any {
            return wijmo.chart.annotation.AnnotationLayer;
        }
    }

    /**
     * AngularJS directive for the @see:FlexChart @see:wijmo.chart.animation.ChartAnimation object.
     *
     * The <b>wj-flex-chart-animation</b> directive must be contained in a @see:WjFlexChart or @see:WjFlexPie or @see:WjFinancialChart directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>animation-mode</dt>     <dd><code>@</code> The value indicating whether the plot points animate one at a time, series by series, or all at once.</dd>
     *   <dt>easing</dt>           <dd><code>@</code> The value indicating the easing function applied to the animation.</dd>
     *   <dt>duration</dt>           <dd><code>@</code> The value indicating the length of entire animation in milliseconds.</dd>
     *   <dt>axis-animation</dt>           <dd><code>@</code> The value indicating whether the axis animation is enabled.</dd>
     * </dl>
     */
    class WjFlexChartAnimation extends WjDirective {

        // Initializes a new instance of a WjFlexChartRangeSelector
        constructor() {
            super();
            this.require = ['?^wjFlexChart', '?^wjFlexPie', '?^wjSunburst', '?^wjFinancialChart', '?^wjFlexRadar'];
        }

        get _controlConstructor(): any {
            return wijmo.chart.animation.ChartAnimation;
        }
    }

    /**
     * AngularJS directive for the annotations.
     *
     * The <b>wj-flex-chart-annotation</b> directive must be contained in a
     * @see:WjFlexChartAnnotationLayer directive.
     *
     * The <b>wj-flex-chart-annotation</b> directive is used to represent all types of
     * possible annotation shapes like <b>Circle</b>, <b>Rectangle</b>, <b>Polygon</b>
     * and so on. The type of annotation shape is specified
     * in the directive's <b>type</b> attribute.
     *
     * The directive supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *
     *   <dt>type</dt>                  <dd><code>@</code> The class name of the annotation shape represented by the directive.
     *                                      The possible values are @see:Circle, @see:Ellipse, @see:Image, @see:Line, @see:Polygon,
     *                                      @see:Rectangle, @see:Square, @see:Text.</dd>
     *   <dt>attachment</dt>            <dd><code>@</code> An @see:AnnotationAttachment value defining the attachment of the annotation.
     *                                      </dd>
     *   <dt>content</dt>               <dd><code>@</code> The text of the <b>Circle</b>, <b>Ellipse</b>, <b>Image</b>, <b>Line</b>,
     *                                      <b>Polygon</b>, <b>Rectangle</b> or <b>Square</b> annotation.</dd>
     *   <dt>end</dt>                   <dd><code>@</code> The end point of the <b>Line</b> annotation.</dd>
     *   <dt>height</dt>                <dd><code>@</code> The height of the <b>Ellipse</b>, <b>Image</b> or <b>Rectangle</b> annotation.</dd>
     *   <dt>href</dt>                  <dd><code>@</code> The href of the <b>Image</b> annotation.</dd>
     *   <dt>is-visible</dt>             <dd><code>@</code> The visibility of the annotation.</dd>
     *   <dt>length</dt>                <dd><code>@</code> The length of the <b>Square</b> annotation.</dd>
     *   <dt>name</dt>                  <dd><code>@</code> The name of the annotation.</dd>
     *   <dt>offset</dt>                <dd><code>@</code> The offset of the annotation.</dd>
     *   <dt>point</dt>                 <dd><code>@</code> The point of the annotation, the coordinate space of the point depends on the <b>attachment</b>  property value.
     *                                      The property works for <b>Circle</b>, <b>Ellipse</b>, <b>Image</b>, <b>Rectangle</b>, <b>Square</b>
     *                                      and <b>Text</b> annotation.</dd>
     *   <dt>point-index</dt>           <dd><code>@</code> The index of the data point in the specified series where the annotation is attached to.</dd>
     *   <dt>position</dt>              <dd><code>@</code> An @see:AnnotationPosition value defining the position of the annotation
     *                                      relative to the <b>point</b>.</dd>
     *   <dt>radius</dt>                <dd><code>@</code> The radius of the <b>Circle</b> annotation.</dd>
     *   <dt>series-index</dt>          <dd><code>@</code> The index of the data series where the annotation is attached to.</dd>
     *   <dt>start</dt>                 <dd><code>@</code> The start point of the <b>Line</b> annotation.</dd>
     *   <dt>style</dt>                 <dd><code>@</code> The style of the annotation.</dd>
     *   <dt>text</dt>                  <dd><code>@</code> The text of the <b>Text</b> annotation.</dd>
     *   <dt>tooltip</dt>               <dd><code>@</code> The tooltip of the annotation.</dd>
     *   <dt>width</dt>                 <dd><code>@</code> The width of the <b>Ellipse</b>, <b>Image</b> or <b>Rectangle</b> annotation.</dd>
     * </dl>
     */
    class WjFlexChartAnnotation extends WjDirective {

        // Initializes a new instance of a WjFlexChartAnnotation
        constructor() {
            super();
            this.require = '^wjFlexChartAnnotationLayer';
            this.template = '<div class="wjFlexChartAnnotation" ng-transclude />';
            this.transclude = true;
        }

        _createLink(): WjLink {
            return new WjFlexChartAnnotationLink();
        }

        _getMetaDataId(): any {
            return 'FlexChartAnnotation';
        }
    }

    class WjFlexChartAnnotationLink extends WjLink {

        _initControl(): any {
            return new wijmo.chart.annotation[this.scope['type']]();
        }

    }

    /**
     * AngularJS directive for the @see:FlexChart @see:wijmo.chart.interaction.RangeSelector object.
     *
     * The <b>wj-flex-chart-range-selector</b> directive must be contained in a @see:WjFlexChart directive or @see:WjFinancialChart directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>is-visible</dt>     <dd><code>@</code> The value indicating whether the RangeSelector is visible.</dd>
     *   <dt>min</dt>           <dd><code>@</code> The minimum value of the range.</dd>
     *   <dt>max</dt>           <dd><code>@</code> The maximum value of the range.</dd>
     *   <dt>orientation</dt>   <dd><code>@</code> The orientation of the RangeSelector.</dd>
     *   <dt>seamless</dt>      <dd><code>@</code> The value indicating whether the minimal and maximal handler will move seamlessly.</dd>
     *   <dt>min-scale</dt>      <dd><code>@</code> the valid minimum range of the RangeSelector.</dd>
     *   <dt>max-scale</dt>      <dd><code>@</code> the valid maximum range of the RangeSelector.</dd>
     * </dl>
     */
    class WjFlexChartRangeSelector extends WjDirective {

        // Initializes a new instance of a WjFlexChartRangeSelector
        constructor() {
            super();
            this.require = ['?^wjFlexChart', '?^wjFinancialChart'];
        }

        get _controlConstructor(): any {
            return wijmo.chart.interaction.RangeSelector;
        }
    }

    /**
     * AngularJS directive for the @see:FlexChart @see:wijmo.chart.interaction.ChartGestures object.
     *
     * The <b>wj-flex-chart-gestures</b> directive must be contained in a @see:WjFlexChart directive or @see:WjFinancialChart directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>mouse-action</dt>     <dd><code>@</code> The value indicating mouse action is zooming or panning.</dd>
     *   <dt>interactive-axes</dt> <dd><code>@</code> The value indicating which axis is interactive.</dd>
     *   <dt>enable</dt>          <dd><code>@</code> The value indicating the gestures action is enabled or not.</dd>
     *   <dt>scale-x</dt>          <dd><code>@</code> The value indicating axisX initial range between Min and Max.</dd>
     *   <dt>scale-y</dt>          <dd><code>@</code> The value indicating axisY initial range between Min and Max.</dd>
     *   <dt>pos-x</dt>            <dd><code>@</code> The value indicating initial position on the axisX.</dd>
     *   <dt>pos-y</dt>            <dd><code>@</code> The value indicating initial position on the axisY.</dd>
     * </dl>
     */
    class WjFlexChartChartGestures extends WjDirective {

        // Initializes a new instance of a WjFlexChartChartGestures
        constructor() {
            super();
            this.require = ['?^wjFlexChart', '?^wjFinancialChart'];
        }

        get _controlConstructor(): any {
            return wijmo.chart.interaction.ChartGestures;
        }
    }

    /**
     * AngularJS directive for the @see:FlexPie control.
     *
     * <dl class="dl-horizontal">
     *   <dt>items-source</dt>      <dd><code>=</code> An array or @see:ICollectionView
     *                              object that contains data for the chart.</dd>
     *   <dt>binding</dt>           <dd><code>@</code> The name of the property that
     *                              contains item values.</dd>
     *   <dt>binding-name</dt>      <dd><code>@</code> The name of the property that
     *                              contains item names.</dd>
     *   <dt>footer</dt>            <dd><code>@</code> The text to display in the chart footer (plain
     *                              text).</dd>
     *   <dt>footer-style</dt>       <dd><code>=</code> The style to apply to the chart footer.</dd>
     *   <dt>header</dt>            <dd><code>@</code> The text to display in the chart header (plain
     *                              text).</dd>
     *   <dt>header-style</dt>      <dd><code>=</code> The style to apply to the chart header.</dd>
     *   <dt>initialized</dt>       <dd><code>&</code> This event occurs after the binding has finished
     *                              initializing the control with attribute values.</dd>
     *   <dt>is-initialized</dt><dd><code>=</code> A value indicating whether the binding has finished
     *                              initializing the control with attribute values. </dd>
     *   <dt>inner-radius</dt>      <dd><code>@</code> The size of the hole inside the
     *                              pie, measured as a fraction of the pie radius.</dd>
     *   <dt>is-animated</dt>       <dd><code>@</code> A value indicating whether to use animation
     *                              to move selected items to the selectedItemPosition.</dd>
     *   <dt>item-formatter</dt>    <dd><code>=</code> The formatter function that customizes the
     *                              appearance of data points.</dd>
     *   <dt>offset</dt>            <dd><code>@</code> The extent to which pie slices are pulled
     *                              out from the center, as a fraction of the pie radius.</dd>
     *   <dt>palette</dt>           <dd><code>=</code> An array that contains the default colors used for
     *                              displaying pie slices.</dd>
     *   <dt>plot-margin</dt>       <dd><code>=</code> The number of pixels of space to leave between the
     *                              edges of the control and the plot area, or CSS-style margins.</dd>
     *   <dt>reversed</dt>          <dd><code>@</code> A value indicating whether to draw pie
     *                              slices in a counter-clockwise direction.</dd>
     *   <dt>start-angle</dt>       <dd><code>@</code> The starting angle for pie slices,
     *                              measured clockwise from the 9 o'clock position.</dd>
     *   <dt>selected-item-offset</dt>
     *                              <dd><code>@</code> The extent to which the selected pie slice is
     *                              pulled out from the center, as a fraction of the pie radius.</dd>
     *   <dt>selected-item-position</dt>
     *                              <dd><code>@</code> The @see:Position value indicating where to display
     *                              the selected slice.</dd>
     *   <dt>selection-mode</dt>    <dd><code>@</code> The @see:SelectionMode value indicating whether or what is
     *                              selected when the user clicks a series.</dd>
     *   <dt>tooltip-content</dt>   <dd><code>@</code> The value to display in the
     *                              @see:ChartTooltip content property.</dd>
     *   <dt>got-focus</dt>         <dd><code>&</code> The @see:FlexPie.gotFocus event handler.</dd>
     *   <dt>lost-focus</dt>        <dd><code>&</code> The @see:FlexPie.lostFocus event handler.</dd>
     *   <dt>rendering</dt>         <dd><code>&</code> The @see:FlexPie.rendering event handler.</dd>
     *   <dt>rendered</dt>          <dd><code>&</code> The @see:FlexPie.rendered event handler.</dd>
     * </dl>
     *
     * The wj-flex-pie directive may contain the following child directives:
     * @see:WjFlexChartLegend and @see:WjFlexPieDataLabel.
     */
    class WjFlexPie extends WjFlexChartBase {

        // gets the Wijmo FlexPie control constructor
        get _controlConstructor() {
            return wijmo.chart.FlexPie;
        }

        _initProps() {
            super._initProps();
            var self = this; // store this in closure as .apply() call overrides the reference

            var lblContentDesc = MetaFactory.findProp('labelContent', this._props);
            lblContentDesc.customHandler = function (scope, control, value, oldValue, link) {
                if (value != null) {
                    (<wijmo.chart.FlexPie>control).dataLabel.content = value;
                }
            };
        }

    }

    /**
     * AngularJS directive for the @see:Sunburst control.
     *
     * <dl class="dl-horizontal">
     *   <dt>child-items-path</dt>  <dd><code>=</code> An array or string object used to generate child items in hierarchical data.</dd>
     * </dl>
     *
     */
    class WjSunburst extends WjFlexPie {

        // gets the Wijmo Sunburst control constructor
        get _controlConstructor() {
            return wijmo.chart.hierarchical.Sunburst;
        }
    }


    /**
     * AngularJS directive for the @see:FlexRadar control.
     *
     * Use the <b>wj-flex-radar</b> directive to add radar charts to your AngularJS applications.
     * Note that directive and parameter names must be formatted using lower-case letters
     * with dashes instead of camel case.
     *
     * The wj-flex-radar directive supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>binding</dt>           <dd><code>@</code> The name of the property that contains Y
     *                              values for the chart. You can override this at the series level.</dd>
     *   <dt>binding-x</dt>         <dd><code>@</code> The name of the property that contains X
     *                              values for the chart. You can override this at the series level.</dd>
     *   <dt>chart-type</dt>        <dd><code>@</code> The default chart type to use in rendering series
     *                              objects. You can override this at the series level. See @see:RadarChartType.</dd>
     *   <dt>control</dt>           <dd><code>=</code> A reference to the @see:FlexRadar control
     *                              that this directive creates.</dd>
     *   <dt>footer</dt>            <dd><code>@</code> The text to display in the chart footer (plain
     *                              text).</dd>
     *   <dt>footer-style</dt>       <dd><code>=</code> The style to apply to the chart footer.</dd>
     *   <dt>header</dt>            <dd><code>@</code> The text to display in the chart header (plain
     *                              text).</dd>
     *   <dt>header-style</dt>      <dd><code>=</code> The style to apply to the chart header.</dd>
     *   <dt>initialized</dt>       <dd><code>&</code> This event occurs after the binding has finished
     *                              initializing the control with attribute values.</dd>
     *   <dt>is-initialized</dt><dd><code>=</code> A value indicating whether the binding has finished
     *                              initializing the control with attribute values. </dd>
     *   <dt>interpolate-nulls</dt> <dd><code>@</code> The value indicating whether to interpolate or
     *                              leave gaps when there are null values in the data.</dd>
     *   <dt>item-formatter</dt>    <dd><code>=</code> The formatter function that customizes the
     *                              appearance of data points.</dd>
     *   <dt>items-source</dt>      <dd><code>=</code> An array or @see:ICollectionView object that contains
     *                              the data used to create the chart.</dd>
     *   <dt>legend-toggle</dt>     <dd><code>@</code> The value indicating whether clicking legend items
     *                              toggles series visibility.</dd>
     *   <dt>options</dt>           <dd><code>=</code> Chart @see:FlexChart.options that only apply to certain
     *                              chart types.</dd>
     *   <dt>palette</dt>           <dd><code>=</code> An array that contains the default colors used for
     *                              displaying each series.</dd>
     *   <dt>plot-margin</dt>       <dd><code>=</code> The number of pixels of space to leave between the
     *                              edges of the control and the plot area, or CSS-style margins.</dd>
     *   <dt>stacking</dt>          <dd><code>@</code> The @see:Stacking value indicating whether or how series
     *                              objects are stacked or plotted independently.</dd>
     *   <dt>reversed</dt>          <dd><code>@</code> The @see:FlexRadar.reversed value indicating whether angles are reversed
     *                              (counter-clockwise).</dd>
     *   <dt>startAngle</dt>        <dd><code>@</code> The @see:FlexRadar.startAngle value indicating the starting angle for the radar in degrees.</dd>
     *   <dt>totalAngle</dt>        <dd><code>@</code> The @see:FlexRadar.totalAngle value indicating the total angle for the radar in degrees.</dd>
     *   <dt>symbol-size</dt>       <dd><code>@</code> The size of the symbols used to render data points in Scatter,
     *                              LineSymbols, and SplineSymbols charts, in pixels. You can override
     *                              this at the series level.</dd>
     *   <dt>tooltip-content</dt>   <dd><code>@</code> The value to display in the
     *                              @see:ChartTooltip content property.</dd>
     *   <dt>rendering</dt>         <dd><code>&</code> The @see:FlexRadar.rendering event handler.</dd>
     *   <dt>rendered</dt>          <dd><code>&</code> The @see:FlexRadar.rendered event handler.</dd>
     *   <dt>series-visibility-changed</dt>
     *                              <dd><code>&</code> The @see:FlexRadar.seriesVisibilityChanged event handler.</dd>
     * </dl>
     *
     * The wj-flex-radar directive may contain the following child directives:
     * @see:WjFlexChartAxis, @see:WjFlexRadarSeries, @see:WjFlexChartLegend and @see:WjFlexChartDataLabel.
     */
    class WjFlexRadar extends WjFlexChartCore {

        // gets the Wijmo FlexRadar control constructor
        get _controlConstructor() {
            return wijmo.chart.radar.FlexRadar;
        }
    }

    /**
     * AngularJS directive for the @see:FinancialChart @see:FinancialSeries object.
     *
     * The <b>wj-financial-chart-series</b> directive must be contained in a @see:WjFinancialChart directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>axis-x</dt>       <dd><code>@</code> X-axis for the series.</dd>
     *   <dt>axis-y</dt>       <dd><code>@</code> Y-axis for the series.</dd>
     *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>chart-type</dt>   <dd><code>@</code> The chart type to use in rendering objects for this series
     *                         objects. This value overrides the default chart type set on the chart. See
     *                         @see:FinancialChartType.</dd>
     *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
     *   <dt>items-source</dt> <dd><code>=</code> An array or @see:ICollectionView object that contains
     *                         data for this series.</dd>
     *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
     *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
     *                         style object as an object. See the section on ngAttr attribute bindings in
     *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
     *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
     *                         "http://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
     *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
     *   <dt>altStyle</dt>     <dd><code>=</code> The series alternative style.</dd>
     *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
     *                         overrides the default marker set on the chart. See @see:Marker.</dd>
     *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data points in this
     *                         series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
     *                         This value overrides any setting at the chart level.</dd>
     *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
     *                         This value overrides any setting at the chart level.</dd>
     *   <dt>visibility</dt>   <dd><code>=</code> The @see:SeriesVisibility value indicating whether and where to
     *                         display the series.</dd>
     * </dl>
     *
     * In most cases, the <b>wj-financial-chart-series</b> specifies the <b>name</b> and <b>binding</b> properties only.
     * The remaining values are inherited from the parent <b>wj-financial-chart</b> directive.
     */
    class WjFlexRadarSeries extends WjSeriesBase {

        // Initializes a new instance of a WjFinancialChartSeries
        constructor() {
            super();
            this.require = '^wjFlexRadar';
            this.template = '<div class="wjFlexRadarSeries" ng-transclude />';
            //this.transclude = true;
        }

        // Returns constructor of related Wijmo object. Abstract member, must be overridden in inherited class
        get _controlConstructor(): any { //: new (elem: HTMLElement) => wijmo.Control {
            return wijmo.chart.radar.FlexRadarSeries;
        }
    }

    /**
     * AngularJS directive for the @see:FlexRadar @see:FlexRadarAxis @see:Axis object.
     *
     * The <b>wj-flex-radar-axis</b> directive must be contained in a @see:WjFlexRadar directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>wj-property</dt>     <dd><code>@</code> Defines the @see:FlexChart property name,
     *                            axis-x or axis-y, to initialize with the directive.</dd>
     *   <dt>axis-line</dt>       <dd><code>@</code> The value indicating whether the axis line is visible.</dd>
     *   <dt>binding</dt>         <dd><code>@</code> Gets or sets the comma-separated property names for
     *                            the @see:wijmo.chart.Axis.itemsSource property to use in axis labels.
     *                            The first name specifies the value on the axis, the second represents
     *                            the corresponding axis label. The default value is 'value,text'.</dd>
     *   <dt>format</dt>          <dd><code>@</code> The format string used for the axis labels
     *                            (see @see:wijmo.Globalize).</dd>
     *   <dt>item-formatter</dt>  <dd><code>=</code> The formatter function that customizes the
     *                            appearance of axis labels.</dd>
     *   <dt>items-source</dt>    <dd><code>=</code> The items source for the axis labels.</dd>
     *   <dt>labels</dt>          <dd><code>@</code> The value indicating whether the axis labels are visible.</dd>
     *   <dt>label-angle</dt>     <dd><code>@</code> The rotation angle of axis labels in degrees.</dd>
     *   <dt>label-align</dt>     <dd><code>@</code> The alignment of axis labels.</dd>
     *   <dt>label-padding</dt>   <dd><code>@</code> The padding of axis labels.</dd>
     *   <dt>major-grid</dt>      <dd><code>@</code> The value indicating whether the axis includes grid lines.</dd>
     *   <dt>major-tick-marks</dt><dd><code>@</code> Defines the appearance of tick marks on the axis
     *                            (see @see:TickMark).</dd>
     *   <dt>major-unit</dt>      <dd><code>@</code> The number of units between axis labels.</dd>
     *   <dt>max</dt>             <dd><code>@</code> The minimum value shown on the axis.</dd>
     *   <dt>min</dt>             <dd><code>@</code> The maximum value shown on the axis.</dd>
     *   <dt>minor-grid</dt>      <dd><code>@</code> The value indicating whether the axis includes minor grid lines.</dd>
     *   <dt>minor-tick-marks</dt><dd><code>@</code> Defines the appearance of minor tick marks on the axis
     *                            (see @see:TickMark).</dd>
     *   <dt>minor-unit</dt>      <dd><code>@</code> The number of units between minor axis ticks.</dd>
     *   <dt>origin</dt>          <dd><code>@</code> The axis origin.</dd>
     *   <dt>overlappingLabels</dt><dd><code>@</code> The @see:OverlappingLabels value indicating how to handle the overlapping axis labels.</dd>
     *   <dt>position</dt>        <dd><code>@</code> The @see:Position value indicating the position of the axis.</dd>
     *   <dt>title</dt>           <dd><code>@</code> The title text shown next to the axis.</dd>
     * </dl>
     */
    class WjFlexRadarAxis extends WjDirective {

        // Initializes a new instance of a WjFlexCharAxis.
        constructor() {
            super();

            this.require = ['?^wjFlexRadarSeries', '?^wjFlexRadar'];
            this.template = '<div class="wjFlexRadarAxis" />';
        }

        get _controlConstructor() {
            return wijmo.chart.radar.FlexRadarAxis;
        }

        _initControl(element: any): any {
            return super._initControl(undefined);
        }

    }

    /**
     * AngularJS directive for the @see:FinancialChart control.
     *
     * Use the <b>wj-financial-chart</b> directive to add financial charts to your AngularJS applications.
     * Note that directive and parameter names must be formatted using lower-case letters
     * with dashes instead of camel case.
     *
     * The wj-financial-chart directive supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>binding</dt>           <dd><code>@</code> The name of the property that contains Y
     *                              values for the chart. You can override this at the series level.</dd>
     *   <dt>binding-x</dt>         <dd><code>@</code> The name of the property that contains X
     *                              values for the chart. You can override this at the series level.</dd>
     *   <dt>chart-type</dt>        <dd><code>@</code> The default chart type to use in rendering series
     *                              objects. You can override this at the series level. See @see:FinancialChartType.</dd>
     *   <dt>control</dt>           <dd><code>=</code> A reference to the @see:FinancialChart control
     *                              that this directive creates.</dd>
     *   <dt>footer</dt>            <dd><code>@</code> The text to display in the chart footer (plain
     *                              text).</dd>
     *   <dt>footer-style</dt>       <dd><code>=</code> The style to apply to the chart footer.</dd>
     *   <dt>header</dt>            <dd><code>@</code> The text to display in the chart header (plain
     *                              text).</dd>
     *   <dt>header-style</dt>      <dd><code>=</code> The style to apply to the chart header.</dd>
     *   <dt>initialized</dt>       <dd><code>&</code> This event occurs after the binding has finished
     *                              initializing the control with attribute values.</dd>
     *   <dt>is-initialized</dt><dd><code>=</code> A value indicating whether the binding has finished
     *                              initializing the control with attribute values. </dd>
     *   <dt>interpolate-nulls</dt> <dd><code>@</code> The value indicating whether to interpolate or
     *                              leave gaps when there are null values in the data.</dd>
     *   <dt>item-formatter</dt>    <dd><code>=</code> The formatter function that customizes the
     *                              appearance of data points.</dd>
     *   <dt>items-source</dt>      <dd><code>=</code> An array or @see:ICollectionView object that contains
     *                              the data used to create the chart.</dd>
     *   <dt>legend-toggle</dt>     <dd><code>@</code> The value indicating whether clicking legend items
     *                              toggles series visibility.</dd>
     *   <dt>options</dt>           <dd><code>=</code> Chart options that only apply to certain chart types.
     *                              See <b>options</b> under @see:FinancialChart for details.</dd>
     *   <dt>palette</dt>           <dd><code>=</code> An array that contains the default colors used for
     *                              displaying each series.</dd>
     *   <dt>plot-margin</dt>       <dd><code>=</code> The number of pixels of space to leave between the
     *                              edges of the control and the plot area, or CSS-style margins.</dd>
     *   <dt>selection</dt>         <dd><code>=</code> The series object that is selected.</dd>
     *   <dt>selection-mode</dt>    <dd><code>@</code> The @see:SelectionMode value indicating whether or what is
     *                              selected when the user clicks a series.</dd>
     *   <dt>symbol-size</dt>       <dd><code>@</code> The size of the symbols used to render data
     *                              points in Scatter, LineSymbols, and SplineSymbols charts, in pixels. You can override
     *                              this at the series level.</dd>
     *   <dt>tooltip-content</dt>   <dd><code>@</code> The value to display in the
     *                              @see:ChartTooltip content property.</dd>
     *   <dt>got-focus</dt>         <dd><code>&</code> The @see:FinancialChart.gotFocus event handler.</dd>
     *   <dt>lost-focus</dt>        <dd><code>&</code> The @see:FinancialChart.lostFocus event handler.</dd>
     *   <dt>rendering</dt>         <dd><code>&</code> The @see:FinancialChart.rendering event handler.</dd>
     *   <dt>rendered</dt>          <dd><code>&</code> The @see:FinancialChart.rendered event handler.</dd>
     *   <dt>series-visibility-changed</dt>
     *                              <dd><code>&</code> The @see:FinancialChart.seriesVisibilityChanged event handler.</dd>
     *   <dt>selection-changed</dt> <dd><code>&</code> The @see:FinancialChart.selectionChanged event handler.</dd>
     * </dl>
     *
     * The wj-financial-chart directive may contain the following child directives:
     * @see:WjFlexChartAxis, @see:WjFlexChartSeries, @see:WjFlexChartLegend and @see:WjFlexChartDataLabel.
     */
    class WjFinancialChart extends WjFlexChartCore {

        // gets the Wijmo FinancialChart control constructor
        get _controlConstructor() {
            return wijmo.chart.finance.FinancialChart;
        }
    }

    /**
     * AngularJS directive for the @see:FinancialChart @see:FinancialSeries object.
     *
     * The <b>wj-financial-chart-series</b> directive must be contained in a @see:WjFinancialChart directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>axis-x</dt>       <dd><code>@</code> X-axis for the series.</dd>
     *   <dt>axis-y</dt>       <dd><code>@</code> Y-axis for the series.</dd>
     *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>chart-type</dt>   <dd><code>@</code> The chart type to use in rendering objects for this series
     *                         objects. This value overrides the default chart type set on the chart. See
     *                         @see:FinancialChartType.</dd>
     *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
     *   <dt>items-source</dt> <dd><code>=</code> An array or @see:ICollectionView object that contains
     *                         data for this series.</dd>
     *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
     *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
     *                         style object as an object. See the section on ngAttr attribute bindings in
     *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
     *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
     *                         "http://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
     *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
     *   <dt>altStyle</dt>     <dd><code>=</code> The series alternative style.</dd>
     *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
     *                         overrides the default marker set on the chart. See @see:Marker.</dd>
     *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data points in this
     *                         series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
     *                         This value overrides any setting at the chart level.</dd>
     *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
     *                         This value overrides any setting at the chart level.</dd>
     *   <dt>visibility</dt>   <dd><code>=</code> The @see:SeriesVisibility value indicating whether and where to
     *                         display the series.</dd>
     * </dl>
     *
     * In most cases, the <b>wj-financial-chart-series</b> specifies the <b>name</b> and <b>binding</b> properties only.
     * The remaining values are inherited from the parent <b>wj-financial-chart</b> directive.
     */
    class WjFinancialChartSeries extends WjSeriesBase {

        // Initializes a new instance of a WjFinancialChartSeries
        constructor() {
            super();
            this.require = '^wjFinancialChart';
            this.template = '<div class="wjFinancialChartSeries" ng-transclude />';
            //this.transclude = true;
        }

        // Returns constructor of related Wijmo object. Abstract member, must be overridden in inherited class
        get _controlConstructor(): any { //: new (elem: HTMLElement) => wijmo.Control {
            return wijmo.chart.finance.FinancialSeries;
        }
    }

    // abstract for FlexChart and FinancialChart trendlines
    class WjTrendLineBase extends WjSeriesBase {
        constructor() {
            super();
            this.require = ['?^wjFlexChart', '?^wjFinancialChart'];
            this.template = '<div class="wjTrendLineBase" ng-transclude />';
            //this.transclude = true;
        }

        get _controlConstructor(): any {
            return wijmo.chart.analytics.TrendLineBase;
        }
    }

    /**
     * AngularJS directive for the @see:FlexChart and @see:FinancialChart @see:TrendLine object.
     *
     * The <b>wj-flex-chart-trend-line</b> directive must be contained in a @see:WjFlexChart or @see:WjFinancialChart directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>chart-type</dt>   <dd><code>@</code> The chart type to use in rendering objects for this series
     *                         objects. This value overrides the default chart type set on the chart. See
     *                         @see:ChartType.</dd>
     *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
     *   <dt>items-source</dt> <dd><code>=</code> An array or @see:ICollectionView object that contains
     *                         data for this series.</dd>
     *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
     *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
     *                         style object as an object. See the section on ngAttr attribute bindings in
     *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
     *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
     *                         "http://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
     *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
     *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
     *                         overrides the default marker set on the chart. See @see:Marker.</dd>
     *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
     *                         This value overrides any setting at the chart level.</dd>
     *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
     *                         This value overrides any setting at the chart level.</dd>
     *   <dt>visibility</dt>   <dd><code>=</code> The @see:SeriesVisibility value indicating whether and where to
     *                         display the series.</dd>
     *   <dt>sample-count</dt> <dd><code>@</code> The sample count for the calculation.</dd>
     *   <dt>fit-type</dt>     <dd><code>@</code> The @see:TrendLineFitType value for the trend line.</dd>
     *   <dt>order</dt>        <dd><code>@</code> The number of terms in a polynomial or fourier equation.</dd>
     * </dl>
     *
     */
    class WjFlexChartTrendLine extends WjTrendLineBase {
        constructor() {
            super();
            //this.require = ['?^wjFlexChart', '?^wjFinancialChart'];
            this.template = '<div class="wjTrendLine" ng-transclude />';
            //this.transclude = true;
        }

        get _controlConstructor(): any {
            return wijmo.chart.analytics.TrendLine;
        }
    }

    /**
     * AngularJS directive for the @see:FlexChart and @see:FinancialChart @see:MovingAverage object.
     *
     * The <b>wj-flex-chart-moving-average</b> directive must be contained in a @see:WjFlexChart or @see:WjFinancialChart directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>chart-type</dt>   <dd><code>@</code> The chart type to use in rendering objects for this series
     *                         objects. This value overrides the default chart type set on the chart. See
     *                         @see:ChartType.</dd>
     *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
     *   <dt>items-source</dt> <dd><code>=</code> An array or @see:ICollectionView object that contains
     *                         data for this series.</dd>
     *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
     *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
     *                         style object as an object. See the section on ngAttr attribute bindings in
     *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
     *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
     *                         "http://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
     *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
     *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
     *                         overrides the default marker set on the chart. See @see:Marker.</dd>
     *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
     *                         This value overrides any set at the chart level.</dd>
     *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
     *                         This value overrides any setting at the chart level.</dd>
     *   <dt>visibility</dt>   <dd><code>=</code> The @see:SeriesVisibility value indicating whether and where to
     *                         display the series.</dd>
     *   <dt>type</dt>         <dd><code>@</code> The @see:MovingAverageType value for the moving average series.</dd>
     *   <dt>period</dt>       <dd><code>@</code> The period for the moving average calculation.</dd>
     * </dl>
     *
     */
    class WjFlexChartMovingAverage extends WjTrendLineBase {
        constructor() {
            super();
            //this.require = ['?^wjFlexChart', '?^wjFinancialChart'];
            this.template = '<div class="wjMovingAverage" ng-transclude />';
            //this.transclude = true;
        }

        get _controlConstructor(): any {
            return wijmo.chart.analytics.MovingAverage;
        }
    }
    /**
     * AngularJS directive for the @see:FlexChart and @see:FinancialChart @see:YFunctionSeries object.
     *
     * The <b>wj-flex-chart-y-function-series</b> directive must be contained in a @see:WjFlexChart or @see:WjFinancialChart directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>chart-type</dt>   <dd><code>@</code> The chart type to use in rendering objects for this series
     *                         objects. This value overrides the default chart type set on the chart. See
     *                         @see:ChartType.</dd>
     *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
     *   <dt>items-source</dt> <dd><code>=</code> An array or @see:ICollectionView object that contains
     *                         data for this series.</dd>
     *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
     *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
     *                         style object as an object. See the section on ngAttr attribute bindings in
     *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
     *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
     *                         "http://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
     *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
     *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
     *                         overrides the default marker set on the chart. See @see:Marker.</dd>
     *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
     *                         This value overrides any set at the chart level.</dd>
     *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
     *                         This value overrides any setting at the chart level.</dd>
     *   <dt>visibility</dt>   <dd><code>=</code> The @see:SeriesVisibility value indicating whether and where to
     *                         display the series.</dd>
     *   <dt>sample-count</dt> <dd><code>@</code> The sample count for the calculation.</dd>
     *   <dt>min</dt>       <dd><code>@</code> The minimum value of the parameter for calculating a function.</dd>
     *   <dt>max</dt>       <dd><code>@</code> The maximum value of the parameter for calculating a function.</dd>
     *   <dt>func</dt>       <dd><code>@</code> The function used to calculate Y value.</dd>
     * </dl>
     *
     */
    class WjFlexChartYFunctionSeries extends WjTrendLineBase {
        constructor() {
            super();
            //this.require = ['?^wjFlexChart', '?^wjFinancialChart'];
            this.template = '<div class="wjYFunctionSeries" ng-transclude />';
            //this.transclude = true;
        }

        get _controlConstructor(): any {
            return wijmo.chart.analytics.YFunctionSeries;
        }
    }
    /**
     * AngularJS directive for the @see:FlexChart and @see:FinancialChart @see:WjFlexChartParametricFunctionSeries object.
     *
     * The <b>wj-flex-chart-parametric-function-series</b> directive must be contained in a @see:WjFlexChart or @see:WjFinancialChart directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>chart-type</dt>   <dd><code>@</code> The chart type to use in rendering objects for this series
     *                         objects. This value overrides the default chart type set on the chart. See
     *                         @see:ChartType.</dd>
     *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
     *   <dt>items-source</dt> <dd><code>=</code> An array or @see:ICollectionView object that contains
     *                         data for this series.</dd>
     *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
     *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
     *                         style object as an object. See the section on ngAttr attribute bindings in
     *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
     *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
     *                         "http://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
     *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
     *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
     *                         overrides the default marker set on the chart. See @see:Marker.</dd>
     *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
     *                         This value overrides any set at the chart level.</dd>
     *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
     *                         This value overrides any setting at the chart level.</dd>
     *   <dt>visibility</dt>   <dd><code>=</code> The @see:SeriesVisibility value indicating whether and where to
     *                         display the series.</dd>
     *   <dt>sample-count</dt> <dd><code>@</code> The sample count for the calculation.</dd>
     *   <dt>min</dt>       <dd><code>@</code> The minimum value of the parameter for calculating a function.</dd>
     *   <dt>max</dt>       <dd><code>@</code> The maximum value of the parameter for calculating a function.</dd>
     *   <dt>x-func</dt>       <dd><code>@</code> The function used to calculate the x value.</dd>
     *   <dt>y-func</dt>       <dd><code>@</code> The function used to calculate the y value.</dd>
     * </dl>
     *
     */
    class WjFlexChartParametricFunctionSeries extends WjTrendLineBase {
        constructor() {
            super();
            //this.require = ['?^wjFlexChart', '?^wjFinancialChart'];
            this.template = '<div class="wjParametricFunctionSeries" ng-transclude />';
            //this.transclude = true;
        }

        get _controlConstructor(): any {
            return wijmo.chart.analytics.ParametricFunctionSeries;
        }

        _initProps() {
            super._initProps();
            var self = this; // store this in closure as .apply() call overrides the reference

            var funcDesc = MetaFactory.findProp('func', this._props);
            funcDesc.customHandler = function (scope, control, value, oldValue, link) {
                if (value != null) {
                    (<wijmo.chart.analytics.ParametricFunctionSeries><any>control).xFunc = value;
                }
            };
        }
    }

    /**
     * AngularJS directive for the @see:FlexChart and @see:FinancialChart @see:Waterfall object.
     *
     * The <b>wj-flex-chart-waterfall</b> directive must be contained in a @see:WjFlexChart or @see:WjFinancialChart directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>items-source</dt> <dd><code>=</code> An array or @see:ICollectionView object that contains
     *                         data for this series.</dd>
     *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
     *   <dt>visibility</dt>   <dd><code>=</code> The @see:SeriesVisibility value indicating whether and where to
     *                         display the series.</dd>
     *   <dt>relative-data</dt> <dd><code>@</code> The value that determines whether the given data is relative.</dd>
     *   <dt>start</dt>        <dd><code>@</code> The value of the start bar.</dd>
     *   <dt>start-label</dt>  <dd><code>@</code> The label of the start bar.</dd>
     *   <dt>show-total</dt>   <dd><code>@</code> The value that determines whether the show the total bar.</dd>
     *   <dt>total-label</dt>  <dd><code>@</code> The label of the total bar.</dd>
     *   <dt>show-intermediate-total</dt>      <dd><code>@</code> The value that determines whether to show the intermediate total bar.</dd>
     *   <dt>intermediate-total-positions</dt> <dd><code>@</code> The value that contains the index for positions of the intermediate total bar.</dd>
     *   <dt>intermediate-total-labels</dt>    <dd><code>@</code> The value that contains the label of the intermediate total bar.</dd>
     *   <dt>connector-lines</dt>  <dd><code>@</code> The value that determines whether to show connector lines.</dd>
     *   <dt>styles</dt>       <dd><code>@</code> The value of the waterfall styles.</dd>
     * </dl>
     *
     */
    class WjFlexChartWaterfall extends WjSeriesBase {
        constructor() {
            super();
            this.require = ['?^wjFlexChart', '?^wjFinancialChart'];
            this.template = '<div class="wjWaterfall" ng-transclude />';
            //this.transclude = true;
        }

        get _controlConstructor(): any {
            return wijmo.chart.analytics.Waterfall;
        }
    }

    class WjFlexChartPlotArea extends WjDirective {

        // Initializes a new instance of a WjFlexChartPlotArea.
        constructor() {
            super();

            this.require = ['?^wjFlexChartPlotArea', '?^wjFlexChart', '?^wjFinancialChart'];
            this.template = '<div class="wjFlexChartPlotArea" />';
        }

        get _controlConstructor() {
            return wijmo.chart.PlotArea;
        }

        _initControl(element: any): any {
            return super._initControl(undefined);
        }

    }

    /**
     * AngularJS directive for the @see:FinancialChart @see:Fibonacci object.
     *
     * The <b>wj-flex-chart-fibonacci</b> directive must be contained in a @see:WjFinancialChart directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
     *   <dt>items-source</dt> <dd><code>=</code> An array or @see:ICollectionView object that contains
     *                         data for this series.</dd>
     *   <dt>high</dt>         <dd><code>@</code> The high value of @see:Fibonacci tool.</dd>
     *   <dt>labelPosition</dt> <dd><code>@</code> The label position for levels in @see:Fibonacci tool.</dd>
     *   <dt>levels</dt>       <dd><code>@</code> The levels value of @see:Fibonacci tool.</dd>
     *   <dt>low</dt>          <dd><code>@</code> The low value of @see:Fibonacci tool.</dd>
     *   <dt>minX</dt>         <dd><code>@</code> The x minimum value of @see:Fibonacci tool.</dd>
     *   <dt>maxX</dt>         <dd><code>@</code> The x maximum value of @see:Fibonacci tool.</dd>
     *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
     *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
     *                         style object as an object. See the section on ngAttr attribute bindings in
     *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
     *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
     *                         "http://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
     *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
     *   <dt>altStyle</dt>     <dd><code>=</code> The series alternative style.</dd>
     *   <dt>visibility</dt>   <dd><code>=</code> The @see:SeriesVisibility value indicating whether and where to
     *                         display the series.</dd>
     *   <dt>uptrend</dt>      <dd><code>@</code> The value indicating whether to create uptrending @see:Fibonacci tool.</dd>
     * </dl>
     *
     */
    class WjFlexChartFibonacci extends WjSeriesBase {

        // Initializes a new instance of a WjFlexChartFibonacci
        constructor() {
            super();
            this.require = ['?^wjFinancialChart'];
            this.template = '<div class="wjFlexChartFibonacci" ng-transclude />';
            //this.transclude = true;
        }

        // Returns constructor of related Wijmo object. Abstract member, must be overridden in inherited class
        get _controlConstructor(): any { //: new (elem: HTMLElement) => wijmo.Control {
            return wijmo.chart.finance.analytics.Fibonacci;
        }

        _initControl(element: any): any {
            return super._initControl(undefined);
        }
    }

    /**
     * AngularJS directive for the @see:FinancialChart @see:FibonacciArcs object.
     *
     * The <b>wj-flex-chart-fibonacci-arcs</b> directive must be contained in a @see:WjFinancialChart directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
     *   <dt>items-source</dt> <dd><code>=</code> An array or @see:ICollectionView object that contains
     *                         data for this series.</dd>
     *   <dt>labelPosition</dt> <dd><code>@</code> The @see:LabelPosition for levels in @see:FibonacciArcs tool.</dd>
     *   <dt>levels</dt>       <dd><code>@</code> The levels value of @see:FibonacciArcs tool.</dd>
     *   <dt>start-x</dt>       <dd><code>@</code> The starting X value of @see:FibonacciArcs tool.</dd>
     *   <dt>end-x</dt>         <dd><code>@</code> The ending X value of @see:FibonacciArcs tool.</dd>
     *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
     *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
     *                         style object as an object. See the section on ngAttr attribute bindings in
     *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
     *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
     *                         "http://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
     *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
     *   <dt>altStyle</dt>     <dd><code>=</code> The series alternative style.</dd>
     *   <dt>visibility</dt>   <dd><code>=</code> The @see:SeriesVisibility value indicating whether and where to
     *                         display the series.</dd>
     * </dl>
     *
     */
    class WjFlexChartFibonacciArcs extends WjSeriesBase {
        constructor() {
            super();
            this.require = ['?^wjFinancialChart'];
            this.template = '<div class="wjFlexChartFibonacciArcs" ng-transclude />';
        }

        get _controlConstructor(): any {
            return wijmo.chart.finance.analytics.FibonacciArcs;
        }

        _initControl(element: any): any {
            return super._initControl(undefined);
        }
    }

   /**
     * AngularJS directive for the @see:FinancialChart @see:FibonacciFans object.
     *
     * The <b>wj-flex-chart-fibonacci-fans</b> directive must be contained in a @see:WjFinancialChart directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
     *   <dt>items-source</dt> <dd><code>=</code> An array or @see:ICollectionView object that contains
     *                         data for this series.</dd>
     *   <dt>labelPosition</dt> <dd><code>@</code> The @see:LabelPosition for levels in @see:FibonacciFans tool.</dd>
     *   <dt>levels</dt>       <dd><code>@</code> The levels value of @see:FibonacciFans tool.</dd>
     *   <dt>start</dt>        <dd><code>@</code> The starting @see:DataPoint of @see:FibonacciFans tool.</dd>
     *   <dt>end</dt>          <dd><code>@</code> The ending @see:DataPoint of @see:FibonacciFans tool.</dd>
     *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
     *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
     *                         style object as an object. See the section on ngAttr attribute bindings in
     *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
     *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
     *                         "http://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
     *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
     *   <dt>altStyle</dt>     <dd><code>=</code> The series alternative style.</dd>
     *   <dt>visibility</dt>   <dd><code>=</code> The @see:SeriesVisibility value indicating whether and where to
     *                         display the series.</dd>
     * </dl>
     *
     */
    class WjFlexChartFibonacciFans extends WjSeriesBase {
        constructor() {
            super();
            this.require = ['?^wjFinancialChart'];
            this.template = '<div class="wjFlexChartFibonacciFans" ng-transclude />';
        }

        get _controlConstructor(): any {
            return wijmo.chart.finance.analytics.FibonacciFans;
        }

        _initControl(element: any): any {
            return super._initControl(undefined);
        }
    }

    /**
     * AngularJS directive for the @see:FinancialChart @see:FibonacciTimeZones object.
     *
     * The <b>wj-flex-chart-fibonacci-time-zones</b> directive must be contained in a @see:WjFinancialChart directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
     *   <dt>items-source</dt> <dd><code>=</code> An array or @see:ICollectionView object that contains
     *                         data for this series.</dd>
     *   <dt>labelPosition</dt> <dd><code>@</code> The @see:LabelPosition for levels in @see:FibonacciTimeZones tool.</dd>
     *   <dt>levels</dt>       <dd><code>@</code> The levels value of @see:FibonacciTimeZones tool.</dd>
     *   <dt>startX</dt>       <dd><code>@</code> The starting X value of @see:FibonacciTimeZones tool.</dd>
     *   <dt>endX</dt>         <dd><code>@</code> The ending X value of @see:FibonacciTimeZones tool.</dd>
     *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
     *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
     *                         style object as an object. See the section on ngAttr attribute bindings in
     *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
     *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
     *                         "http://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
     *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
     *   <dt>altStyle</dt>     <dd><code>=</code> The series alternative style.</dd>
     *   <dt>visibility</dt>   <dd><code>=</code> The @see:SeriesVisibility value indicating whether and where to
     *                         display the series.</dd>
     * </dl>
     *
     */
    class WjFlexChartFibonacciTimeZones extends WjSeriesBase {
        constructor() {
            super();
            this.require = ['?^wjFinancialChart'];
            this.template = '<div class="wjFlexChartFibonacciTimeZones" ng-transclude />';
        }

        get _controlConstructor(): any {
            return wijmo.chart.finance.analytics.FibonacciTimeZones;
        }

        _initControl(element: any): any {
            return super._initControl(undefined);
        }
    }

    // abstract for FinancialChart's overlays and indicators
    class WjBaseOverlayIndicator extends WjSeriesBase {
        constructor() {
            super();
            this.require = '^wjFinancialChart';
            this.template = '<div class="wjBaseOverlayIndicator" ng-transclude />';
        }

        get _controlConstructor(): any {
            return wijmo.chart.finance.analytics.OverlayIndicatorBase;
        }
    }

    // abstract for FinancialChart's overlays and indicators
    class WjBaseSingleOverlayIndicator extends WjBaseOverlayIndicator {
        constructor() {
            super();
            this.template = '<div class="wjBaseSingleOverlayIndicator" ng-transclude />';
        }

        get _controlConstructor(): any {
            return wijmo.chart.finance.analytics.SingleOverlayIndicatorBase;
        }
    }

    /**
     * AngularJS directive for the @see:FinancialChart @see:ATR object.
     *
     * The <b>wj-flex-chart-atr</b> directive must be contained in a @see:WjFinancialChart directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
     *   <dt>items-source</dt> <dd><code>=</code> An array or @see:ICollectionView object that contains
     *                         data for this series.</dd>
     *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
     *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
     *                         style object as an object. See the section on ngAttr attribute bindings in
     *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
     *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
     *                         "http://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
     *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
     *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
     *                         overrides the default marker set on the chart. See @see:Marker.</dd>
     *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
     *                         This value overrides any set at the chart level.</dd>
     *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
     *                         This value overrides any setting at the chart level.</dd>
     *   <dt>visibility</dt>   <dd><code>=</code> The @see:SeriesVisibility value indicating whether and where to
     *                         display the series.</dd>
     *   <dt>period</dt>       <dd><code>@</code> The period for the average true range calculation.</dd>
     * </dl>
     *
     */
    class WjFlexChartAtr extends WjBaseSingleOverlayIndicator {
        constructor() {
            super();
            this.template = '<div class="wjFlexChartAtr" ng-transclude />';
        }

        get _controlConstructor(): any {
            return wijmo.chart.finance.analytics.ATR;
        }
    }

    /**
     * AngularJS directive for the @see:FinancialChart @see:CCI object.
     *
     * The <b>wj-flex-chart-cci</b> directive must be contained in a @see:WjFinancialChart directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
     *   <dt>items-source</dt> <dd><code>=</code> An array or @see:ICollectionView object that contains
     *                         data for this series.</dd>
     *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
     *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
     *                         style object as an object. See the section on ngAttr attribute bindings in
     *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
     *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
     *                         "http://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
     *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
     *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
     *                         overrides the default marker set on the chart. See @see:Marker.</dd>
     *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
     *                         This value overrides any set at the chart level.</dd>
     *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
     *                         This value overrides any setting at the chart level.</dd>
     *   <dt>visibility</dt>   <dd><code>=</code> The @see:SeriesVisibility value indicating whether and where to
     *                         display the series.</dd>
     *   <dt>period</dt>       <dd><code>@</code> The period for the commodity channel index calculation.</dd>
     * </dl>
     *
     */
    class WjFlexChartCci extends WjBaseSingleOverlayIndicator {
        constructor() {
            super();
            this.template = '<div class="wjFlexChartCci" ng-transclude />';
        }

        get _controlConstructor(): any {
            return wijmo.chart.finance.analytics.CCI;
        }
    }

    /**
     * AngularJS directive for the @see:FinancialChart @see:RSI object.
     *
     * The <b>wj-flex-chart-rsi</b> directive must be contained in a @see:WjFinancialChart directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
     *   <dt>items-source</dt> <dd><code>=</code> An array or @see:ICollectionView object that contains
     *                         data for this series.</dd>
     *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
     *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
     *                         style object as an object. See the section on ngAttr attribute bindings in
     *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
     *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
     *                         "http://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
     *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
     *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
     *                         overrides the default marker set on the chart. See @see:Marker.</dd>
     *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
     *                         This value overrides any set at the chart level.</dd>
     *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
     *                         This value overrides any setting at the chart level.</dd>
     *   <dt>visibility</dt>   <dd><code>=</code> The @see:SeriesVisibility value indicating whether and where to
     *                         display the series.</dd>
     *   <dt>period</dt>       <dd><code>@</code> The period for the relative strength index calculation.</dd>
     * </dl>
     *
     */
    class WjFlexChartRsi extends WjBaseSingleOverlayIndicator {
        constructor() {
            super();
            this.template = '<div class="wjFlexChartRsi" ng-transclude />';
        }

        get _controlConstructor(): any {
            return wijmo.chart.finance.analytics.RSI;
        }
    }

    /**
     * AngularJS directive for the @see:FinancialChart @see:WilliamsR object.
     *
     * The <b>wj-flex-chart-williams-r</b> directive must be contained in a @see:WjFinancialChart directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
     *   <dt>items-source</dt> <dd><code>=</code> An array or @see:ICollectionView object that contains
     *                         data for this series.</dd>
     *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
     *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
     *                         style object as an object. See the section on ngAttr attribute bindings in
     *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
     *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
     *                         "http://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
     *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
     *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
     *                         overrides the default marker set on the chart. See @see:Marker.</dd>
     *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
     *                         This value overrides any set at the chart level.</dd>
     *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
     *                         This value overrides any setting at the chart level.</dd>
     *   <dt>visibility</dt>   <dd><code>=</code> The @see:SeriesVisibility value indicating whether and where to
     *                         display the series.</dd>
     *   <dt>period</dt>       <dd><code>@</code> The period for the Williams %R calculation.</dd>
     * </dl>
     *
     */
    class WjFlexChartWilliamsR extends WjBaseSingleOverlayIndicator {
        constructor() {
            super();
            this.template = '<div class="wjFlexChartWilliamsR" ng-transclude />';
        }

        get _controlConstructor(): any {
            return wijmo.chart.finance.analytics.WilliamsR;
        }
    }

    // base for MACD
    class WjFlexChartMacdBase extends WjBaseOverlayIndicator {
        constructor() {
            super();
            this.template = '<div class="wjFlexChartBaseMacd" ng-transclude />';
        }

        get _controlConstructor(): any {
            return wijmo.chart.finance.analytics.MacdBase;
        }
    }

    /**
     * AngularJS directive for the @see:FinancialChart @see:Macd object.
     *
     * The <b>wj-flex-chart-macd</b> directive must be contained in a @see:WjFinancialChart directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
     *   <dt>items-source</dt> <dd><code>=</code> An array or @see:ICollectionView object that contains
     *                         data for this series.</dd>
     *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
     *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
     *                         style object as an object. See the section on ngAttr attribute bindings in
     *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
     *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
     *                         "http://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
     *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
     *   <dt>styles/dt>        <dd><code></code> The styles for the MACD and Signal lines.</dd>
     *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
     *                         overrides the default marker set on the chart. See @see:Marker.</dd>
     *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
     *                         This value overrides any set at the chart level.</dd>
     *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
     *                         This value overrides any setting at the chart level.</dd>
     *   <dt>visibility</dt>   <dd><code>=</code> The @see:SeriesVisibility value indicating whether and where to
     *                         display the series.</dd>
     *   <dt>fast-period</dt>  <dd><code>@</code>  The fast moving average period for the MACD calculation.</dd>
     *   <dt>slow-period</dt>  <dd><code>@</code> The slow moving average period for the MACD calculation.</dd>
     *   <dt>signal-smoothing-period/dt>    <dd><code>@</code> The smoothing period for the MACD calculation.</dd>
     * </dl>
     *
     */
    class WjFlexChartMacd extends WjFlexChartMacdBase {
        constructor() {
            super();
            this.template = '<div class="wjFlexChartMacd" ng-transclude />';
        }

        get _controlConstructor(): any {
            return wijmo.chart.finance.analytics.Macd;
        }
    }

    /**
     * AngularJS directive for the @see:FinancialChart @see:MacdHistogram object.
     *
     * The <b>wj-flex-chart-macd-histogram</b> directive must be contained in a @see:WjFinancialChart directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
     *   <dt>items-source</dt> <dd><code>=</code> An array or @see:ICollectionView object that contains
     *                         data for this series.</dd>
     *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
     *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
     *                         style object as an object. See the section on ngAttr attribute bindings in
     *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
     *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
     *                         "http://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
     *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
     *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
     *                         overrides the default marker set on the chart. See @see:Marker.</dd>
     *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
     *                         This value overrides any set at the chart level.</dd>
     *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
     *                         This value overrides any setting at the chart level.</dd>
     *   <dt>visibility</dt>   <dd><code>=</code> The @see:SeriesVisibility value indicating whether and where to
     *                         display the series.</dd>
     *   <dt>fast-period</dt>  <dd><code>@</code>  The fast moving average period for the MACD calculation.</dd>
     *   <dt>slow-period</dt>  <dd><code>@</code> The slow moving average period for the MACD calculation.</dd>
     *   <dt>signal-smoothing-period/dt>    <dd><code>@</code> The smoothing period for the MACD calculation.</dd>
     * </dl>
     *
     */
    class WjFlexChartMacdHistogram extends WjFlexChartMacdBase {
        constructor() {
            super();
            this.template = '<div class="wjFlexChartMacdHistogram" ng-transclude />';
        }

        get _controlConstructor(): any {
            return wijmo.chart.finance.analytics.MacdHistogram;
        }
    }

    /**
     * AngularJS directive for the @see:FinancialChart @see:Stochastic object.
     *
     * The <b>wj-flex-chart-stochastic</b> directive must be contained in a @see:WjFinancialChart directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
     *   <dt>items-source</dt> <dd><code>=</code> An array or @see:ICollectionView object that contains
     *                         data for this series.</dd>
     *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
     *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
     *                         style object as an object. See the section on ngAttr attribute bindings in
     *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
     *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
     *                         "http://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
     *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
     *   <dt>styles/dt>        <dd><code></code> The styles for the %K and %D lines.</dd>
     *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
     *                         overrides the default marker set on the chart. See @see:Marker.</dd>
     *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
     *                         This value overrides any set at the chart level.</dd>
     *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
     *                         This value overrides any setting at the chart level.</dd>
     *   <dt>visibility</dt>   <dd><code>=</code> The @see:SeriesVisibility value indicating whether and where to
     *                         display the series.</dd>
     *   <dt>k-period</dt>     <dd><code>@</code>  The period for the %K calculation.</dd>
     *   <dt>d-period</dt>     <dd><code>@</code>  The period for the %D calculation.</dd>
     *   <dt>smoothing-period</dt>     <dd><code>@</code>  The smoothing period for the %K calculation.</dd>
     * </dl>
     *
     */
    class WjFlexChartStochastic extends WjBaseOverlayIndicator {
        constructor() {
            super();
            this.template = '<div class="wjFlexChartStochastic" ng-transclude />';
        }

        get _controlConstructor(): any {
            return wijmo.chart.finance.analytics.Stochastic;
        }
    }

    /**
     * AngularJS directive for the @see:FinancialChart @see:BollingerBands object.
     *
     * The <b>wj-flex-chart-bollinger-bands</b> directive must be contained in a @see:WjFinancialChart directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
     *   <dt>items-source</dt> <dd><code>=</code> An array or @see:ICollectionView object that contains
     *                         data for this series.</dd>
     *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
     *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
     *                         style object as an object. See the section on ngAttr attribute bindings in
     *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
     *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
     *                         "http://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
     *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
     *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
     *                         overrides the default marker set on the chart. See @see:Marker.</dd>
     *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
     *                         This value overrides any set at the chart level.</dd>
     *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
     *                         This value overrides any setting at the chart level.</dd>
     *   <dt>visibility</dt>   <dd><code>=</code> The @see:SeriesVisibility value indicating whether and where to
     *                         display the series.</dd>
     *   <dt>period</dt>       <dd><code>@</code>  The period for the Bollinger Bands calculation.</dd>
     *   <dt>multiplier/dt>    <dd><code>@</code> The standard deviation multiplier for the Bollinger Bands calculation.</dd>
     * </dl>
     *
     */
    class WjFlexChartBollingerBands extends WjBaseOverlayIndicator {
        constructor() {
            super();
            this.template = '<div class="wjFlexChartBollingerBands" ng-transclude />';
        }

        get _controlConstructor(): any {
            return wijmo.chart.finance.analytics.BollingerBands;
        }
    }

    /**
     * AngularJS directive for the @see:FinancialChart @see:Envelopes object.
     *
     * The <b>wj-flex-chart-envelopes</b> directive must be contained in a @see:WjFinancialChart directive.
     * It supports the following attributes:
     *
     * <dl class="dl-horizontal">
     *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
     *                         series. This value overrides any binding set for the chart.</dd>
     *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
     *   <dt>items-source</dt> <dd><code>=</code> An array or @see:ICollectionView object that contains
     *                         data for this series.</dd>
     *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
     *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
     *                         style object as an object. See the section on ngAttr attribute bindings in
     *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
     *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
     *                         "http://demos.wijmo.com/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
     *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
     *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
     *                         overrides the default marker set on the chart. See @see:Marker.</dd>
     *   <dt>symbol-size</dt>  <dd><code>@</code> The size of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts, in pixels.
     *                         This value overrides any set at the chart level.</dd>
     *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
     *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
     *                         This value overrides any setting at the chart level.</dd>
     *   <dt>visibility</dt>   <dd><code>=</code> The @see:SeriesVisibility value indicating whether and where to
     *                         display the series.</dd>
     *   <dt>period</dt>       <dd><code>@</code>  The period for the moving average envelopes calculation.</dd>
     *   <dt>size/dt>          <dd><code>@</code> The size of the moving average envelopes.</dd>
     *   <dt>type/dt>          <dd><code>@</code> The @see:MovingAverageType of the moving average to be used for the envelopes.</dd>
     * </dl>
     *
     */
    class WjFlexChartEnvelopes extends WjBaseOverlayIndicator {
        constructor() {
            super();
            this.template = '<div class="wjFlexChartEnvelopes" ng-transclude />';
        }

        get _controlConstructor(): any {
            return wijmo.chart.finance.analytics.Envelopes;
        }
    }

    //#endregion "Chart directives classes"
}