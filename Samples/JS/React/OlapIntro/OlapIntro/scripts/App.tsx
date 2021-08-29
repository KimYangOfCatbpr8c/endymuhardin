declare var React: any;

// define sample data sets
var dataSets = [
    { name: 'Simple (1,000 items)', value: Util.getSimpleDataSet(1000) },
    { name: 'Simple (10,000 items)', value: Util.getSimpleDataSet(10000) },
    { name: 'Complex (100 items)', value: Util.getDataSet(100) },
    { name: 'Complex (50,000 items)', value: Util.getDataSet(50000) },
    { name: 'Complex (100,000 items)', value: Util.getDataSet(100000) },
    { name: 'Northwind Orders (read-only)', value: Util.getNorthwindOrders() },
    { name: 'Northwind Sales (read-only)', value: Util.getNorthwindSales() }
];

var App = React.createClass({
    getInitialState: function () {
        return {

            // shared PivotEngine
            engine: new wijmo.olap.PivotEngine({
                itemsSource: dataSets[0].value,
                rowFields: ['Product', 'Country'],
                valueFields: ['Sales', 'Downloads'],
                showRowTotals: wijmo.olap.ShowTotals.Subtotals,
                showColumnTotals: wijmo.olap.ShowTotals.Subtotals,
            }),

            // data sets
            dataSets: dataSets
        }
    },

    // force update when engine properties change
    componentWillMount: function () {
        this.state.engine.viewDefinitionChanged.addHandler(() => {
            this.forceUpdate();
        })
    },

    render: function () {
        return <div className="mdl-layout mdl-js-layout">
            <header className="mdl-layout__header mdl-layout__header--waterfall">
                <div className="mdl-layout__header-row">
                    <img src="resources/wijmo5.png" alt="Wijmo 5" />
                    <span className="mdl-layout-title">
                        Olap 101 (React)
                    </span>
                </div>
            </header>

            <main id="app" className="mdl-layout__content">
                <div className="container">
                    <GettingStarted engine={ this.state.engine } dataSets={ this.state.dataSets }/>
                    <PivotPanel engine={ this.state.engine } dataSets={ this.state.dataSets }/>
                    <PivotChart engine={ this.state.engine }/>
                    <SourceData engine={ this.state.engine }/>
                    <Export engine={ this.state.engine }/>
                    <Customize/>
                </div>
            </main>
        </div>;
    }
});
