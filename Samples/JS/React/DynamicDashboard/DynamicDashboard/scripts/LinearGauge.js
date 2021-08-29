var LinearGauge = React.createClass({
    render: function () {
        var lastItem = this.props.data.items[this.props.data.items.length - 1];
        return React.createElement("div", null, 
            React.createElement("h3", null, 
                "KPIs for ", 
                wijmo.Globalize.format(lastItem.date, 'MMMM yyyy')), 
            React.createElement("h4", null, 
                "Sales: ", 
                wijmo.Globalize.format(lastItem.sales, 'c')), 
            React.createElement(Wj.LinearGauge, {min: 0, max: 1000, thumbSize: 30, value: lastItem.sales, pointer: { color: 'green' }}), 
            React.createElement("h4", null, 
                "Expenses: ", 
                wijmo.Globalize.format(lastItem.expenses, 'c')), 
            React.createElement(Wj.LinearGauge, {min: 0, max: 1000, thumbSize: 30, value: lastItem.expenses, pointer: { color: 'red' }}), 
            React.createElement("h4", null, 
                "Profit: ", 
                wijmo.Globalize.format(lastItem.profit, 'c')), 
            React.createElement(Wj.LinearGauge, {min: 0, max: 1000, thumbSize: 30, value: lastItem.profit, pointer: { color: 'gold' }}));
    }
});
//# sourceMappingURL=LinearGauge.js.map