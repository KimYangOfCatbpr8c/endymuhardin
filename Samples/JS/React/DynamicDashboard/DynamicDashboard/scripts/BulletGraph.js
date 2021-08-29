var BulletGraph = React.createClass({
    render: function () {
        return React.createElement("div", null, 
            React.createElement("h3", null, "Profits"), 
            React.createElement("table", {className: "table condensed"}, 
                React.createElement("tbody", null, this.props.data.items.map(function (item, index) {
                    return React.createElement("tr", {key: index}, 
                        React.createElement("td", null, wijmo.Globalize.format(item.date, 'MMM yyyy')), 
                        React.createElement("td", null, 
                            React.createElement("span", {className: "label label-danger", style: { borderRadius: '1em', display: item.profit <= 400 ? '' : 'none' }}, "!")
                        ), 
                        React.createElement("td", null, 
                            React.createElement(Wj.BulletGraph, {value: item.profit, min: 0, bad: 400, target: 600, good: 600, max: 1000})
                        ));
                }))
            ));
    }
});
//# sourceMappingURL=BulletGraph.js.map