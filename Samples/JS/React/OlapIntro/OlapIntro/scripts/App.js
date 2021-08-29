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
        };
    },
    // force update when engine properties change
    componentWillMount: function () {
        var _this = this;
        this.state.engine.viewDefinitionChanged.addHandler(function () {
            _this.forceUpdate();
        });
    },
    render: function () {
        return React.createElement("div", {className: "mdl-layout mdl-js-layout"}, 
            React.createElement("header", {className: "mdl-layout__header mdl-layout__header--waterfall"}, 
                React.createElement("div", {className: "mdl-layout__header-row"}, 
                    React.createElement("img", {src: "resources/wijmo5.png", alt: "Wijmo 5"}), 
                    React.createElement("span", {className: "mdl-layout-title"}, "Olap 101 (React)"))
            ), 
            React.createElement("main", {id: "app", className: "mdl-layout__content"}, 
                React.createElement("div", {className: "container"}, 
                    React.createElement(GettingStarted, {engine: this.state.engine, dataSets: this.state.dataSets}), 
                    React.createElement(PivotPanel, {engine: this.state.engine, dataSets: this.state.dataSets}), 
                    React.createElement(PivotChart, {engine: this.state.engine}), 
                    React.createElement(SourceData, {engine: this.state.engine}), 
                    React.createElement(Export, {engine: this.state.engine}), 
                    React.createElement(Customize, null))
            ));
    }
});
//# sourceMappingURL=App.js.map