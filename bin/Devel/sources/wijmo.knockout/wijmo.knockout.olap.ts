module wijmo.knockout {

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
    export class wjPivotGrid extends wjFlexGrid {
        _getControlConstructor(): any {
            return wijmo.olap.PivotGrid;
        }
    }

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
    export class wjPivotChart extends WjBinding {
        _getControlConstructor(): any {
            return wijmo.olap.PivotChart;
        }
    }

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
    export class wjPivotPanel extends WjBinding {
        _getControlConstructor(): any {
            return wijmo.olap.PivotPanel;
        }
    }
} 

(<any>(ko.bindingHandlers)).wjPivotGrid = new wijmo.knockout.wjPivotGrid();
(<any>(ko.bindingHandlers)).wjPivotChart = new wijmo.knockout.wjPivotChart();
(<any>(ko.bindingHandlers)).wjPivotPanel = new wijmo.knockout.wjPivotPanel();
