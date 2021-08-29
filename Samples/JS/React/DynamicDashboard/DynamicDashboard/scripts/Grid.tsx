declare var React: any;

var Grid = React.createClass({
    render: function () {
        return <Wj.FlexGrid
            isReadOnly={true}
            headersVisibility="Column"
            selectionMode="ListBox"
            itemsSource={this.props.data}
            columns={[
                { binding: 'id', header: 'ID', width: 40 },
                { binding: 'date', header: 'Date', format: 'MMM yyyy' },
                { binding: 'sales', header: 'Sales', format: 'c' },
                { binding: 'expenses', header: 'Expenses', format: 'c' },
                { binding: 'profit', header: 'Profit', format: 'c' }
            ]} />
    }
});