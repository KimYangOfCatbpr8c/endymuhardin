declare var React: any;

var RadialGauge = React.createClass({
    render: function () {
        var lastItem = this.props.data.items[this.props.data.items.length - 1];
        return <div>
            <h3>
                Profit for {
                    wijmo.Globalize.format(lastItem.date, 'MMMM yyyy')
                }
            </h3>
            <Wj.RadialGauge
                min={0}
                max={1000}
                format="c0"
                value={lastItem.profit} />
        </div>
    }
});