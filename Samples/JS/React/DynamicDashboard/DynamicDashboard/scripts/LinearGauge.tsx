declare var React: any;

var LinearGauge = React.createClass({
    render: function () {
        var lastItem = this.props.data.items[this.props.data.items.length - 1];
        return <div>

            <h3>
                KPIs for {wijmo.Globalize.format(lastItem.date, 'MMMM yyyy')}</h3>

            <h4>
                Sales: {wijmo.Globalize.format(lastItem.sales, 'c')}</h4>
            <Wj.LinearGauge
                min={0}
                max={1000}
                thumbSize={30}
                value={lastItem.sales}
                pointer={{ color: 'green' }} />

            <h4>
                Expenses: {wijmo.Globalize.format(lastItem.expenses, 'c')}</h4>
            <Wj.LinearGauge
                min={0}
                max={1000}
                thumbSize={30}
                value={lastItem.expenses}
                pointer={{ color: 'red' }} />

            <h4>
                Profit: {wijmo.Globalize.format(lastItem.profit, 'c')}</h4>
            <Wj.LinearGauge
                min={0}
                max={1000}
                thumbSize={30}
                value={lastItem.profit}
                pointer={{ color: 'gold' }} />
        </div>
    }
});