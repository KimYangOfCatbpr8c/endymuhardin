declare var React: any;

var ColumnChart = React.createClass({
    render: function () {
        return <Wj.FlexChart
            chartType="Column"
            itemsSource={this.props.data}
            bindingX="date"
            axisX={{ format: 'MMM-yy' }}
            series={[
                { name: 'Sales', binding: 'sales' },
                { name: 'Expenses', binding: 'expenses' },
                { name: 'Profit', binding: 'profit', chartType: 'LineSymbols' }
            ]} />
    }
});