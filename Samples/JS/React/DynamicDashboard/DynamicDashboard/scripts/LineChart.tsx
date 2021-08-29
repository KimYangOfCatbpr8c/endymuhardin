declare var React: any;

var LineChart = React.createClass({
    render: function () {
        return <Wj.FlexChart
            chartType="Line"
            itemsSource={this.props.data}
            bindingX="date"
            axisX={{ format: 'MMM-yy' }}
            series={[
                { name: 'Profit', binding: 'profit' }
            ]} />
    }
});