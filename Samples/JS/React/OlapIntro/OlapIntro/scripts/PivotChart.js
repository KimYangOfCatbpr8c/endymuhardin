var PivotChart = React.createClass({
    // store reference to pivot chart control
    initChart: function (s, e) {
        this.setState({ theChart: s });
    },
    // change the chart type
    chartTypeChanged: function (s, e) {
        this.state.theChart.chartType = s.text;
    },
    render: function () {
        return React.createElement("div", null, 
            React.createElement("h4", null, "Show the results in a PivotChart"), 
            React.createElement("p", null, 
                "The ", 
                React.createElement("b", null, "PivotChart"), 
                " control provides a graphical visualization of the results." + ' ' + "It is similar to Excel's pivot charts, including support for multiple chart" + ' ' + "types and hierarchical axes."), 
            React.createElement("p", null, 
                "To use the ", 
                React.createElement("b", null, "PivotChart"), 
                " control, connect it to a ", 
                React.createElement("b", null, "PivotPanel"), 
                " using" + ' ' + "the ", 
                React.createElement("b", null, "itemsSource"), 
                " property:"), 
            React.createElement("div", {style: { display: this.props.engine.isViewDefined ? 'none' : '' }}, 
                React.createElement("p", null, "Please create a view in order to see the chart.")
            ), 
            React.createElement("div", {style: { display: this.props.engine.isViewDefined ? '' : 'none' }}, 
                React.createElement("dl", {className: "dl-horizontal"}, 
                    React.createElement("dt", null, "Chart Type"), 
                    React.createElement("dd", null, 
                        React.createElement(Wj.ComboBox, {itemsSource: 'Column,Bar,Scatter,Line,Area,Pie'.split(','), textChanged: this.chartTypeChanged})
                    )), 
                React.createElement(Wj.PivotChart, {itemsSource: this.props.engine, initialized: this.initChart})), 
            React.createElement("div", {className: "source-card mdl-card mdl-shadow--2dp"}, 
                React.createElement("div", {className: "mdl-tabs mdl-js-tabs mdl-js-ripple-effect"}, 
                    React.createElement("div", {className: "mdl-tabs__tab-bar"}, 
                        React.createElement("a", {href: "#html-chart", className: "mdl-tabs__tab"}, "JSX"), 
                        React.createElement("a", {href: "#js-chart", className: "mdl-tabs__tab"}, "JS"), 
                        React.createElement("a", {href: "#close-chart", className: "mdl-tabs__tab is-active"}, "X")), 
                    React.createElement("div", {className: "mdl-tabs__panel", id: "html-chart"}, 
                        React.createElement("code", {className: "pane-content"}, 
                            '<div style={{ display: this.props.engine.isViewDefined ? \'none\' : \'\' }}>\n', 
                            '    <p>\n', 
                            '        Please create a view in order to see the chart.</p>\n', 
                            '</div>\n', 
                            '<div style={{ display: this.props.engine.isViewDefined ? \'\' : \'none\' }}>\n', 
                            '    <dl className="dl-horizontal">\n', 
                            '        <dt>Chart Type</dt>\n', 
                            '        <dd>\n', 
                            '            <Wj.ComboBox\n', 
                            '                itemsSource={ \'Column,Bar,Scatter,Line,Area,Pie\'.split(\',\') }\n', 
                            '                textChanged={ this.chartTypeChanged }>\n', 
                            '            </Wj.ComboBox>\n', 
                            '        </dd>\n', 
                            '    </dl>\n', 
                            '    <Wj.PivotChart\n', 
                            '        itemsSource={ this.props.engine }\n', 
                            '        initialized={ this.initChart }>\n', 
                            '    </Wj.PivotChart>\n', 
                            '</div>')
                    ), 
                    React.createElement("div", {className: "mdl-tabs__panel", id: "js-chart"}, 
                        React.createElement("code", {className: "pane-content"}, 
                            '// store reference to pivot chart control\n', 
                            'initChart: function (s, e) {\n', 
                            '    this.setState({ theChart: s });\n', 
                            '},\n', 
                            '\n', 
                            '// change the chart type\n', 
                            'chartTypeChanged: function (s, e) {\n', 
                            '    this.state.theChart.chartType = s.text;\n', 
                            '}')
                    ), 
                    React.createElement("div", {className: "mdl-tabs__panel", id: "close-chart"}))
            ));
    }
});
//# sourceMappingURL=PivotChart.js.map