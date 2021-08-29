var BarChart = React.createClass({
    render: function () {
        return React.createElement(Wj.FlexChart, {chartType: "Bar", itemsSource: this.props.data, bindingX: "date", axisX: { format: 'MMM-yy' }, series: [
            { name: 'Sales', binding: 'sales' },
            { name: 'Expenses', binding: 'expenses' },
            { name: 'Profit', binding: 'profit', chartType: 'LineSymbols' }
        ]});
    }
});
//# sourceMappingURL=BarChart.js.map