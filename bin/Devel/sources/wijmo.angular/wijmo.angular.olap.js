var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//
// AngularJS directives for wijmo.olap module
//
var wijmo;
(function (wijmo) {
    var angular;
    (function (angular) {
        var wijmoOlap = window['angular'].module('wj.olap', ['wj.grid', 'wj.chart']);
        // register only if module is loaded
        if (wijmo.olap && wijmo.olap.PivotGrid) {
            wijmoOlap.directive('wjPivotGrid', ['$compile', '$interpolate', function ($compile, $interpolate) {
                    return new WjPivotGrid($compile, $interpolate);
                }]);
            wijmoOlap.directive('wjPivotChart', [function () {
                    return new WjPivotChart();
                }]);
            wijmoOlap.directive('wjPivotPanel', [function () {
                    return new WjPivotPanel();
                }]);
        }
        /**
         * AngularJS directive for the @see:PivotGrid control.
         *
         * Use the <b>wj-pivot-grid</b> and <b>wj-pivot-panel</b> directives
         * to add pivot tables to your AngularJS applications.
         *
         * Directive and parameter names must be formatted as lower-case with dashes
         * instead of camel-case. For example:
         *
         * <pre>&lt;wj-pivot-panel
         *     control="thePanel"
         *     items-source="rawData"&gt;
         * &lt;/wj-pivot-panel&gt;
         * &lt;wj-pivot-grid
         *     items-source="thePanel"
         *     show-detail-on-double-click="false"
         *     custom-context-menu="true"&gt;
         * &lt;/wj-pivot-grid&gt;</pre>
         *
         * The <b>wj-pivot-grid</b> directive extends the <b>wj-flex-grid</b> directive
         * and adds support for the following attributes:
         *
         * <dl class="dl-horizontal">
         *   <dt>items-source</dt>                  <dd>Gets or sets the @see:PivotPanel that defines the view
         *                                              displayed by this @see:PivotGrid.</dd>
         *   <dt>show-detail-on-double-click</dt>   <dd>Gets or sets whether the grid should show a popup containing the
         *                                              detail records when the user double-clicks a cell.</dd>
         *   <dt>custom-context-menu</dt>           <dd>Gets or sets whether the grid should provide a custom context menu
         *                                              with commands for changing field settings and showing detail records.</dd>
         *   <dt>collapsible-subtotals</dt>         <dd>Gets or sets whether the grid should allow users to collapse and
         *                                              expand subtotal groups of rows and columns.</dd>
         *   <dt>center-headers-vertically</dt>     <dd>Gets or sets whether the content of header cells should be vertically centered.</dd>
         * </dl>
         */
        var WjPivotGrid = (function (_super) {
            __extends(WjPivotGrid, _super);
            function WjPivotGrid($compile, $interpolate) {
                _super.call(this, $compile, $interpolate);
            }
            Object.defineProperty(WjPivotGrid.prototype, "_controlConstructor", {
                get: function () {
                    return wijmo.olap.PivotGrid;
                },
                enumerable: true,
                configurable: true
            });
            return WjPivotGrid;
        }(angular.WjFlexGrid));
        angular.WjPivotGrid = WjPivotGrid;
        /**
         * AngularJS directive for the @see:PivotChart control.
         *
         * Use the <b>wj-pivot-chart</b> and <b>wj-pivot-panel</b> directives
         * to add pivot charts to your AngularJS applications.
         *
         * Directive and parameter names must be formatted as lower-case with dashes
         * instead of camel-case. For example:
         *
         * <pre>&lt;wj-pivot-panel
         *     control="thePanel"
         *     items-source="rawData"&gt;
         * &lt;/wj-pivot-panel&gt;
         * &lt;wj-pivot-chart
         *     items-source="thePanel"
         *     chart-type="Bar"
         *     max-series="10"
         *     max-points="100"&gt;
         * &lt;/wj-pivot-chart&gt;</pre>
         *
         * The <b>wj-pivot-chart</b> directive supports the following attributes:
         *
         * <dl class="dl-horizontal">
         *   <dt>items-source</dt>                  <dd>Gets or sets the @see:PivotPanel that defines the view
         *                                              displayed by this @see:PivotChart.</dd>
         *   <dt>chart-type</dt>                    <dd>Gets or sets a @see:PivotChartType value that defines
         *                                              the type of chart to display.</dd>
         *   <dt>show-hierarchical-axes</dt>        <dd>Gets or sets whether the chart should group axis annotations for grouped data.</dd>
         *   <dt>stacking</dt>                      <dd>Gets or sets a @see:Stacking value that determines whether and how the series
         *                                              objects are stacked.</dd>
         *   <dt>show-totals</dt>                   <dd>Gets or sets a whether the chart should include only totals.</dd>
         *   <dt>max-series</dt>                    <dd>Gets or sets the maximum number of data series to be shown in the chart.</dd>
         *   <dt>max-points</dt>                    <dd>Gets or sets the maximum number of points to be shown in each series.</dd>
         * </dl>
         */
        var WjPivotChart = (function (_super) {
            __extends(WjPivotChart, _super);
            function WjPivotChart() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(WjPivotChart.prototype, "_controlConstructor", {
                get: function () {
                    return wijmo.olap.PivotChart;
                },
                enumerable: true,
                configurable: true
            });
            return WjPivotChart;
        }(angular.WjDirective));
        angular.WjPivotChart = WjPivotChart;
        /**
         * AngularJS directive for the @see:PivotPanel control.
         *
         * Use the <b>wj-pivot-panel</b> directive as a data source for
         * <b>wj-pivot-grid</b> and <b>wj-pivot-chart</b> directives
         * to add pivot tables and charts to your AngularJS applications.
         *
         * Directive and parameter names must be formatted as lower-case with dashes
         * instead of camel-case. For example:
         *
         * <pre>&lt;wj-pivot-panel
         *     control="thePanel"
         *     items-source="rawData"&gt;
         * &lt;/wj-pivot-panel&gt;
         * &lt;wj-pivot-grid
         *     items-source="thePanel"
         *     show-detail-on-double-click="false"
         *     custom-context-menu="true"&gt;
         * &lt;/wj-pivot-grid&gt;</pre>
         *
         * The <b>wj-pivot-panel</b> directive supports the following attributes:
         *
         * <dl class="dl-horizontal">
         *   <dt>items-source</dt>                  <dd>Gets or sets the raw data used to generate pivot views.</dd>
         *   <dt>auto-generate-fields</dt>          <dd>Gets or sets whether the panel should populate its fields
         *                                              collection automatically based on the @see:PivotPanel.itemsSource.</dd>
         *   <dt>view-definition</dt>               <dd>Gets or sets the current pivot view definition as a JSON string.</dd>
         *   <dt>engine</dt>                        <dd>Gets a reference to the @see:PivotEngine that summarizes the data.</dd>
         * </dl>
         */
        var WjPivotPanel = (function (_super) {
            __extends(WjPivotPanel, _super);
            function WjPivotPanel() {
                _super.call(this);
                this.transclude = true;
                this.template = '<div ng-transclude />';
            }
            Object.defineProperty(WjPivotPanel.prototype, "_controlConstructor", {
                get: function () {
                    return wijmo.olap.PivotPanel;
                },
                enumerable: true,
                configurable: true
            });
            return WjPivotPanel;
        }(angular.WjDirective));
        angular.WjPivotPanel = WjPivotPanel;
    })(angular = wijmo.angular || (wijmo.angular = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.angular.olap.js.map