var SourceData = React.createClass({
    // add a filter to the grid
    initGrid: function (s, e) {
        var f = new wijmo.grid.filter.FlexGridFilter(s);
    },
    render: function () {
        return React.createElement("div", null, 
            React.createElement("h4", null, "View and edit the source data"), 
            React.createElement("p", null, 
                "The pivot view is live." + ' ' + "If you edit any of" + ' ' + "the ", 
                wijmo.Globalize.format(this.props.engine.itemsSource.items.length, 'n0'), 
                " items," + ' ' + "the pivot view will be updated automatically.", 
                React.createElement("span", {className: "text-info", style: { display: this.props.engine.itemsSource.tableName ? '' : 'none' }}, 
                    ' ', 
                    "(This grid is read-only because it is bound to a read-only data source.)")), 
            React.createElement(Wj.FlexGrid, {id: "theRawGrid", style: { border: 'none' }, showSelectedHeaders: "All", itemsSource: this.props.engine.itemsSource, initialized: this.initGrid}), 
            React.createElement("div", {className: "source-card mdl-card mdl-shadow--2dp"}, 
                React.createElement("div", {className: "mdl-tabs mdl-js-tabs mdl-js-ripple-effect"}, 
                    React.createElement("div", {className: "mdl-tabs__tab-bar"}, 
                        React.createElement("a", {href: "#html-data", className: "mdl-tabs__tab"}, "JSX"), 
                        React.createElement("a", {href: "#js-data", className: "mdl-tabs__tab"}, "JS"), 
                        React.createElement("a", {href: "#close-data", className: "mdl-tabs__tab is-active"}, "X")), 
                    React.createElement("div", {className: "mdl-tabs__panel", id: "html-data"}, 
                        React.createElement("code", {className: "pane-content"}, 
                            '<Wj.FlexGrid\n', 
                            '    id="theRawGrid"\n', 
                            '    style={{ border: \'none\' }}\n', 
                            '    showSelectedHeaders="All"\n', 
                            '    itemsSource={ this.props.engine.itemsSource }\n', 
                            '    initialized={ this.initGrid }>\n', 
                            '</Wj.FlexGrid>')
                    ), 
                    React.createElement("div", {className: "mdl-tabs__panel", id: "js-data"}, 
                        React.createElement("code", {className: "pane-content"}, 
                            '// add a filter to the grid\n', 
                            'initGrid: function (s, e) {\n', 
                            '    var f = new wijmo.grid.filter.FlexGridFilter(s);\n', 
                            '}')
                    ), 
                    React.createElement("div", {className: "mdl-tabs__panel", id: "close-data"}))
            ));
    }
});
//# sourceMappingURL=SourceData.js.map