var RadialGauge = React.createClass({
    render: function () {
        var lastItem = this.props.data.items[this.props.data.items.length - 1];
        return React.createElement("div", null, 
            React.createElement("h3", null, 
                "Profit for ", 
                wijmo.Globalize.format(lastItem.date, 'MMMM yyyy')), 
            React.createElement(Wj.RadialGauge, {min: 0, max: 1000, format: "c0", value: lastItem.profit}));
    }
});
//# sourceMappingURL=RadialGauge.js.map