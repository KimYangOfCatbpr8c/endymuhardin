var LineChart = React.createClass({
    render: function () {
        return React.createElement(Wj.FlexChart, {chartType: "Line", itemsSource: this.props.data, bindingX: "date", axisX: { format: 'MMM-yy' }, series: [
            { name: 'Profit', binding: 'profit' }
        ]});
    }
});
//# sourceMappingURL=LineChart.js.map