var GettingStarted = React.createClass({
    getInitialState: function () {
        return {
            viewDefs: [
                {
                    name: "Sales by Product",
                    def: "{\"showZeros\":false,\"showColumnTotals\":2,\"showRowTotals\":2,\"defaultFilterType\":3,\"fields\":[{\"binding\":\"id\",\"header\":\"Id\",\"dataType\":2,\"aggregate\":1,\"showAs\":0,\"descending\":false,\"format\":\"n0\",\"isContentHtml\":false},{\"binding\":\"product\",\"header\":\"Product\",\"dataType\":1,\"aggregate\":2,\"showAs\":0,\"descending\":false,\"isContentHtml\":false},{\"binding\":\"country\",\"header\":\"Country\",\"dataType\":1,\"aggregate\":2,\"showAs\":0,\"descending\":false,\"isContentHtml\":false},{\"binding\":\"date\",\"header\":\"Date\",\"dataType\":4,\"aggregate\":2,\"showAs\":0,\"descending\":false,\"format\":\"d\",\"isContentHtml\":false},{\"binding\":\"sales\",\"header\":\"Sales\",\"dataType\":2,\"aggregate\":1,\"showAs\":0,\"descending\":false,\"format\":\"n0\",\"isContentHtml\":false},{\"binding\":\"downloads\",\"header\":\"Downloads\",\"dataType\":2,\"aggregate\":1,\"showAs\":0,\"descending\":false,\"format\":\"n0\",\"isContentHtml\":false},{\"binding\":\"active\",\"header\":\"Active\",\"dataType\":3,\"aggregate\":2,\"showAs\":0,\"descending\":false,\"isContentHtml\":false},{\"binding\":\"discount\",\"header\":\"Discount\",\"dataType\":2,\"aggregate\":1,\"showAs\":0,\"descending\":false,\"format\":\"n0\",\"isContentHtml\":false}],\"rowFields\":{\"items\":[\"Product\"]},\"columnFields\":{\"items\":[]},\"filterFields\":{\"items\":[]},\"valueFields\":{\"items\":[\"Sales\"]}}"
                },
                {
                    name: "Sales by Country",
                    def: "{\"showZeros\":false,\"showColumnTotals\":2,\"showRowTotals\":2,\"defaultFilterType\":3,\"fields\":[{\"binding\":\"id\",\"header\":\"Id\",\"dataType\":2,\"aggregate\":1,\"showAs\":0,\"descending\":false,\"format\":\"n0\",\"isContentHtml\":false},{\"binding\":\"product\",\"header\":\"Product\",\"dataType\":1,\"aggregate\":2,\"showAs\":0,\"descending\":false,\"isContentHtml\":false},{\"binding\":\"country\",\"header\":\"Country\",\"dataType\":1,\"aggregate\":2,\"showAs\":0,\"descending\":false,\"isContentHtml\":false},{\"binding\":\"date\",\"header\":\"Date\",\"dataType\":4,\"aggregate\":2,\"showAs\":0,\"descending\":false,\"format\":\"d\",\"isContentHtml\":false},{\"binding\":\"sales\",\"header\":\"Sales\",\"dataType\":2,\"aggregate\":1,\"showAs\":0,\"descending\":false,\"format\":\"n0\",\"isContentHtml\":false},{\"binding\":\"downloads\",\"header\":\"Downloads\",\"dataType\":2,\"aggregate\":1,\"showAs\":0,\"descending\":false,\"format\":\"n0\",\"isContentHtml\":false},{\"binding\":\"active\",\"header\":\"Active\",\"dataType\":3,\"aggregate\":2,\"showAs\":0,\"descending\":false,\"isContentHtml\":false},{\"binding\":\"discount\",\"header\":\"Discount\",\"dataType\":2,\"aggregate\":1,\"showAs\":0,\"descending\":false,\"format\":\"n0\",\"isContentHtml\":false}],\"rowFields\":{\"items\":[\"Country\"]},\"columnFields\":{\"items\":[]},\"filterFields\":{\"items\":[]},\"valueFields\":{\"items\":[\"Sales\"]}}"
                },
                {
                    name: "Sales and Downloads by Country",
                    def: "{\"showZeros\":false,\"showColumnTotals\":2,\"showRowTotals\":2,\"defaultFilterType\":3,\"fields\":[{\"binding\":\"id\",\"header\":\"Id\",\"dataType\":2,\"aggregate\":1,\"showAs\":0,\"descending\":false,\"format\":\"n0\",\"isContentHtml\":false},{\"binding\":\"product\",\"header\":\"Product\",\"dataType\":1,\"aggregate\":2,\"showAs\":0,\"descending\":false,\"isContentHtml\":false},{\"binding\":\"country\",\"header\":\"Country\",\"dataType\":1,\"aggregate\":2,\"showAs\":0,\"descending\":false,\"isContentHtml\":false},{\"binding\":\"date\",\"header\":\"Date\",\"dataType\":4,\"aggregate\":2,\"showAs\":0,\"descending\":false,\"format\":\"d\",\"isContentHtml\":false},{\"binding\":\"sales\",\"header\":\"Sales\",\"dataType\":2,\"aggregate\":3,\"showAs\":0,\"descending\":false,\"format\":\"n0\",\"isContentHtml\":false},{\"binding\":\"downloads\",\"header\":\"Downloads\",\"dataType\":2,\"aggregate\":3,\"showAs\":0,\"descending\":false,\"format\":\"n0\",\"isContentHtml\":false},{\"binding\":\"active\",\"header\":\"Active\",\"dataType\":3,\"aggregate\":2,\"showAs\":0,\"descending\":false,\"isContentHtml\":false},{\"binding\":\"discount\",\"header\":\"Discount\",\"dataType\":2,\"aggregate\":1,\"showAs\":0,\"descending\":false,\"format\":\"n0\",\"isContentHtml\":false}],\"rowFields\":{\"items\":[\"Country\"]},\"columnFields\":{\"items\":[]},\"filterFields\":{\"items\":[]},\"valueFields\":{\"items\":[\"Sales\",\"Downloads\"]}}"
                },
                {
                    name: "Sales Trend by Product",
                    def: "{\"showZeros\":false,\"showColumnTotals\":0,\"showRowTotals\":0,\"defaultFilterType\":3,\"fields\":[{\"binding\":\"id\",\"header\":\"Id\",\"dataType\":2,\"aggregate\":1,\"showAs\":0,\"descending\":false,\"format\":\"n0\",\"isContentHtml\":false},{\"binding\":\"product\",\"header\":\"Product\",\"dataType\":1,\"aggregate\":2,\"showAs\":0,\"descending\":false,\"isContentHtml\":false},{\"binding\":\"country\",\"header\":\"Country\",\"dataType\":1,\"aggregate\":2,\"showAs\":0,\"descending\":false,\"isContentHtml\":false},{\"binding\":\"date\",\"header\":\"Date\",\"dataType\":4,\"aggregate\":2,\"showAs\":0,\"descending\":false,\"format\":\"yyyy \\\"Q\\\"q\",\"isContentHtml\":false},{\"binding\":\"sales\",\"header\":\"Sales\",\"dataType\":2,\"aggregate\":3,\"showAs\":2,\"descending\":false,\"format\":\"p2\",\"isContentHtml\":false},{\"binding\":\"downloads\",\"header\":\"Downloads\",\"dataType\":2,\"aggregate\":3,\"showAs\":0,\"descending\":false,\"format\":\"n0\",\"isContentHtml\":false},{\"binding\":\"active\",\"header\":\"Active\",\"dataType\":3,\"aggregate\":2,\"showAs\":0,\"descending\":false,\"isContentHtml\":false},{\"binding\":\"discount\",\"header\":\"Discount\",\"dataType\":2,\"aggregate\":1,\"showAs\":0,\"descending\":false,\"format\":\"n0\",\"isContentHtml\":false}],\"rowFields\":{\"items\":[\"Date\"]},\"columnFields\":{\"items\":[\"Product\"]},\"filterFields\":{\"items\":[]},\"valueFields\":{\"items\":[\"Sales\"]}}"
                }
            ]
        };
    },
    // save/restore view definitions
    saveView: function () {
        var ng = this.props.engine;
        if (ng.isViewDefined) {
            localStorage['viewDefinition'] = ng.viewDefinition;
        }
    },
    loadView: function (def) {
        var ng = this.props.engine;
        if (def.target) {
            ng.viewDefinition = localStorage['viewDefinition'];
        }
        else {
            ng.itemsSource = this.props.dataSets[3].value;
            ng.viewDefinition = def;
        }
    },
    render: function () {
        var _this = this;
        return React.createElement("div", null, 
            React.createElement("h3", null, "Introducing wijmo.olap"), 
            React.createElement("p", null, 
                "The ", 
                React.createElement("b", null, "wijmo.olap"), 
                " module contains controls that allow you to add Excel-like pivot" + ' ' + "table and pivot chart features to your applications." + ' ' + "To use it, follow these steps:"), 
            React.createElement("ul", null, 
                React.createElement("li", null, 
                    "Add references to the ", 
                    React.createElement("b", null, "wijmo"), 
                    " and ", 
                    React.createElement("b", null, "wijmo.olap"), 
                    " modules to the page."), 
                React.createElement("li", null, 
                    "Add a ", 
                    React.createElement("b", null, "PivotPanel"), 
                    " control to the page."), 
                React.createElement("li", null, 
                    "Add one or more ", 
                    React.createElement("b", null, "PivotGrid"), 
                    " and ", 
                    React.createElement("b", null, "PivotChart"), 
                    " controls to the page," + ' ' + "and connect them to the ", 
                    React.createElement("b", null, "PivotPanel"), 
                    " by setting their ", 
                    React.createElement("b", null, "itemsSource"), 
                    "property to the ", 
                    React.createElement("b", null, "PivotPanel"), 
                    " control."), 
                React.createElement("li", null, 
                    "Set the PivotPanel's ", 
                    React.createElement("b", null, "itemsSource"), 
                    " property to an array containing the" + ' ' + "raw data you want to analyze."), 
                React.createElement("li", null, "Optionally add code to print, export, save and load views and view definitions.")), 
            React.createElement("p", null, 
                "That's all. The ", 
                React.createElement("b", null, "PivotPanel"), 
                " will show a list of the fields available, and" + ' ' + "users will be able to drag fields between summary areas to generate data summaries" + ' ' + "(AKA \"views\")." + ' ' + "Users may also configure the fields by setting their headers, summary functions," + ' ' + "filters, and formats."), 
            React.createElement("p", null, "Users may analyze the data and print the results, export the results to XLSX or PDF," + ' ' + "and save view definitions that can be re-used later."), 
            React.createElement("p", null, "Here is a simple example:"), 
            React.createElement("h4", null, "Add a PivotPanel and a PivotGrid to the page"), 
            React.createElement("p", null, 
                "The ", 
                React.createElement("b", null, "PivotPanel"), 
                " control is similar to Excel's \"field list\" window" + ' ' + "that is associated with pivot tables and charts."), 
            React.createElement("ul", null, 
                React.createElement("li", null, "Add fields to the view by dragging or using the checkboxes."), 
                React.createElement("li", null, "Remove fields from the view by dragging them back to the top area or by using their" + ' ' + "context menu."), 
                React.createElement("li", null, "Configure fields using their context menu. You may modify their header, summary function," + ' ' + "and format. Note that the format is used when grouping the data, so you can group data" + ' ' + "by day, month, quarter or year by changing the format of the date fields for example.")), 
            React.createElement("p", null, 
                "The ", 
                React.createElement("b", null, "PivotGrid"), 
                " control extends the ", 
                React.createElement("b", null, "FlexGrid"), 
                " to support pivoting features" + ' ' + "including custom cell merging, hierarchical row and column groups, and a custom" + ' ' + "context menu that allows users to configure the pivot fields and to drill-down" + ' ' + "into the data items that were used in the computation of specific summary cells."), 
            React.createElement("div", {className: "mdl-grid", id: "theView"}, 
                React.createElement("div", {className: "mdl-cell mdl-cell--4-col"}, 
                    React.createElement(Wj.PivotPanel, {engine: this.props.engine})
                ), 
                React.createElement("div", {className: "mdl-cell mdl-cell--8-col"}, 
                    React.createElement(Wj.PivotGrid, {id: "thePivotGrid", itemsSource: this.props.engine, showSelectedHeaders: "All"})
                )), 
            React.createElement("div", {className: "source-card mdl-card mdl-shadow--2dp"}, 
                React.createElement("div", {className: "mdl-tabs mdl-js-tabs mdl-js-ripple-effect"}, 
                    React.createElement("div", {className: "mdl-tabs__tab-bar"}, 
                        React.createElement("a", {href: "#html-gs1", className: "mdl-tabs__tab"}, "JSX"), 
                        React.createElement("a", {href: "#js-gs1", className: "mdl-tabs__tab"}, "JS"), 
                        React.createElement("a", {href: "#close-gs1", className: "mdl-tabs__tab is-active"}, "X")), 
                    React.createElement("div", {className: "mdl-tabs__panel", id: "html-gs1"}, 
                        React.createElement("code", {className: "pane-content"}, 
                            '<div className="mdl-cell mdl-cell--4-col">\n', 
                            '    <Wj.PivotPanel\n', 
                            '        engine={ this.props.engine } >\n', 
                            '    </Wj.PivotPanel>\n', 
                            '</div>\n', 
                            '<div className="mdl-cell mdl-cell--8-col">\n', 
                            '    <Wj.PivotGrid\n', 
                            '        id="thePivotGrid"\n', 
                            '        itemsSource={ this.props.engine }\n', 
                            '        showSelectedHeaders="All">\n', 
                            '    </Wj.PivotGrid>\n', 
                            '</div>')
                    ), 
                    React.createElement("div", {className: "mdl-tabs__panel", id: "js-gs1"}, 
                        React.createElement("code", {className: "pane-content"}, '// no code required')
                    ), 
                    React.createElement("div", {className: "mdl-tabs__panel", id: "close-gs1"}))
            ), 
            React.createElement("p", null, 
                "Use the ", 
                React.createElement("b", null, "viewDefinition"), 
                " property to save and restore view definitions. For example:"), 
            React.createElement("button", {className: "mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect", onClick: this.saveView}, "Save View"), 
            ' ', 
            React.createElement("button", {className: "mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect", onClick: this.loadView}, "Load View"), 
            React.createElement("p", null), 
            React.createElement("p", null, "Or build a list of pre-defined views for the user to pick from. For example:"), 
            React.createElement("ul", null, 
            // https://facebook.github.io/react/tips/communicate-between-components.html
            this.state.viewDefs.map(function (item, index) {
                return React.createElement("li", {key: index}, 
                    React.createElement("a", {href: "#theView", onClick: _this.loadView.bind(_this, item.def)}, item.name)
                );
            })), 
            React.createElement("div", {className: "source-card mdl-card mdl-shadow--2dp"}, 
                React.createElement("div", {className: "mdl-tabs mdl-js-tabs mdl-js-ripple-effect"}, 
                    React.createElement("div", {className: "mdl-tabs__tab-bar"}, 
                        React.createElement("a", {href: "#html-gs2", className: "mdl-tabs__tab"}, "JSX"), 
                        React.createElement("a", {href: "#js-gs2", className: "mdl-tabs__tab"}, "JS"), 
                        React.createElement("a", {href: "#close-gs2", className: "mdl-tabs__tab is-active"}, "X")), 
                    React.createElement("div", {className: "mdl-tabs__panel", id: "html-gs2"}, 
                        React.createElement("code", {className: "pane-content"}, 
                            '<button\n', 
                            '    className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect"\n', 
                            '    onClick={ this.saveView }>\n', 
                            '    Save View\n', 
                            '</button>\n', 
                            '<button\n', 
                            '    className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect"\n', 
                            '    onClick={ this.loadView }>\n', 
                            '    Load View\n', 
                            '</button>\n', 
                            '<ul>\n', 
                            '    {\n', 
                            '        // https://facebook.github.io/react/tips/communicate-between-components.html\n', 
                            '        this.state.viewDefs.map((item, index) => {\n', 
                            '            return <li key={ index }>\n', 
                            '                <a href="#theView" onClick={ this.loadView.bind(this, item.def) }>\n', 
                            '                    { item.name }\n', 
                            '                </a>\n', 
                            '            </li>;\n', 
                            '        })\n', 
                            '    }\n', 
                            '</ul>')
                    ), 
                    React.createElement("div", {className: "mdl-tabs__panel", id: "js-gs2"}, 
                        React.createElement("code", {className: "pane-content"}, 
                            'getInitialState: function () {\n', 
                            '    return {\n', 
                            '        viewDefs: [\n', 
                            '            {\n', 
                            '                name: "Sales by Product",\n', 
                            '                def: "{\"showZeros\":false,\"showColumnTotals\":2,\"showRowTotals\":2,\"defaultFilterType\":3,\"fields\":[{\"binding\":\"id\",\"header\":\"Id\",\"dataType\":2,\"aggregate\":1,\"showAs\":0,\"descending\":false,\"format\":\"n0\",\"isContentHtml\":false},{\"binding\":\"product\",\"header\":\"Product\",\"dataType\":1,\"aggregate\":2,\"showAs\":0,\"descending\":false,\"isContentHtml\":false},{\"binding\":\"country\",\"header\":\"Country\",\"dataType\":1,\"aggregate\":2,\"showAs\":0,\"descending\":false,\"isContentHtml\":false},{\"binding\":\"date\",\"header\":\"Date\",\"dataType\":4,\"aggregate\":2,\"showAs\":0,\"descending\":false,\"format\":\"d\",\"isContentHtml\":false},{\"binding\":\"sales\",\"header\":\"Sales\",\"dataType\":2,\"aggregate\":1,\"showAs\":0,\"descending\":false,\"format\":\"n0\",\"isContentHtml\":false},{\"binding\":\"downloads\",\"header\":\"Downloads\",\"dataType\":2,\"aggregate\":1,\"showAs\":0,\"descending\":false,\"format\":\"n0\",\"isContentHtml\":false},{\"binding\":\"active\",\"header\":\"Active\",\"dataType\":3,\"aggregate\":2,\"showAs\":0,\"descending\":false,\"isContentHtml\":false},{\"binding\":\"discount\",\"header\":\"Discount\",\"dataType\":2,\"aggregate\":1,\"showAs\":0,\"descending\":false,\"format\":\"n0\",\"isContentHtml\":false}],\"rowFields\":{\"items\":[\"Product\"]},\"columnFields\":{\"items\":[]},\"filterFields\":{\"items\":[]},\"valueFields\":{\"items\":[\"Sales\"]}}"\n', 
                            '            },...\n', 
                            '        ]\n', 
                            '    }\n', 
                            '},\n', 
                            '\n', 
                            '// save/restore view definitions\n', 
                            'saveView: function () {\n', 
                            '    var ng = this.props.engine;\n', 
                            '    if (ng.isViewDefined) {\n', 
                            '        localStorage[\'viewDefinition\'] = ng.viewDefinition;\n', 
                            '    }\n', 
                            '},\n', 
                            'loadView: function (def) {\n', 
                            '    var ng = this.props.engine;\n', 
                            '    if (def.target) { // load from local storage\n', 
                            '        ng.viewDefinition = localStorage[\'viewDefinition\'];\n', 
                            '    } else { // apply pre-defined view definition\n', 
                            '        ng.itemsSource = this.props.dataSets[3].value;\n', 
                            '        ng.viewDefinition = def;\n', 
                            '    }\n', 
                            '}')
                    ), 
                    React.createElement("div", {className: "mdl-tabs__panel", id: "close-gs2"}))
            ));
    }
});
//# sourceMappingURL=GettingStarted.js.map