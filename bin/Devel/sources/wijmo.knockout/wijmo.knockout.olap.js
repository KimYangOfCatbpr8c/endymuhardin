var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var wijmo;
(function (wijmo) {
    var knockout;
    (function (knockout) {
        /**
           * KnockoutJS binding for the @see:PivotGrid object.
           * Use the @see:wjPivotGrid binding to add @see:PivotGrid controls to your
           * KnockoutJS applications. For example:
           *  &lt;div data-bind="wjPivotGrid:
           *      {
           *          itemsSource: thePanel
           *      }"&gt;
           *  &lt;/div&gt;
           *
           * The <b>wjPivotGrid</b> binding supports all read-write properties and events of
           * the @see:PivotGrid class.
           *
           */
        var wjPivotGrid = (function (_super) {
            __extends(wjPivotGrid, _super);
            function wjPivotGrid() {
                _super.apply(this, arguments);
            }
            wjPivotGrid.prototype._getControlConstructor = function () {
                return wijmo.olap.PivotGrid;
            };
            return wjPivotGrid;
        }(knockout.wjFlexGrid));
        knockout.wjPivotGrid = wjPivotGrid;
        /**
           * KnockoutJS binding for the @see:PivotChart object.
           * Use the @see:wjPivotChart binding to add @see:PivotChart controls to your
           * KnockoutJS applications. For example:
           *  &lt;div data-bind="wjPivotChart:
           *      {
           *          itemsSource: thePanel
           *      }"&gt;
           *  &lt;/div&gt;
           *
           * The <b>wjPivotChart</b> binding supports all read-write properties and events of
           * the @see:PivotChart class.
           *
           */
        var wjPivotChart = (function (_super) {
            __extends(wjPivotChart, _super);
            function wjPivotChart() {
                _super.apply(this, arguments);
            }
            wjPivotChart.prototype._getControlConstructor = function () {
                return wijmo.olap.PivotChart;
            };
            return wjPivotChart;
        }(knockout.WjBinding));
        knockout.wjPivotChart = wjPivotChart;
        /**
           * KnockoutJS binding for the @see:PivotPanel object.
           * Use the @see:wjPivotPanel binding to add @see:PivotPanel controls to your
           * KnockoutJS applications. For example:
           *  &lt;div data-bind="wjPivotPanel:
           *      {
           *           itemsSource: rawData,
           *           control: thePanel,
           *           initialized: init
           *      }"&gt;
           *  &lt;/div&gt;
           *
           * The <b>wjPivotPanel</b> binding supports all read-write properties and events of
           * the @see:PivotPanel class.
           *
           */
        var wjPivotPanel = (function (_super) {
            __extends(wjPivotPanel, _super);
            function wjPivotPanel() {
                _super.apply(this, arguments);
            }
            wjPivotPanel.prototype._getControlConstructor = function () {
                return wijmo.olap.PivotPanel;
            };
            return wjPivotPanel;
        }(knockout.WjBinding));
        knockout.wjPivotPanel = wjPivotPanel;
    })(knockout = wijmo.knockout || (wijmo.knockout = {}));
})(wijmo || (wijmo = {}));
(ko.bindingHandlers).wjPivotGrid = new wijmo.knockout.wjPivotGrid();
(ko.bindingHandlers).wjPivotChart = new wijmo.knockout.wjPivotChart();
(ko.bindingHandlers).wjPivotPanel = new wijmo.knockout.wjPivotPanel();
//# sourceMappingURL=wijmo.knockout.olap.js.map