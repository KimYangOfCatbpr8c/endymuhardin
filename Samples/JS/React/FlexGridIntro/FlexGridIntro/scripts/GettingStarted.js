var GettingStarted = React.createClass({
    render: function () {
        return React.createElement("div", null, 
            React.createElement("h2", null, "Getting Started"), 
            React.createElement("p", null, "Steps for getting started with FlexGrid in React applications:"), 
            React.createElement("ol", null, 
                React.createElement("li", null, "Add references to React, Wijmo, and the Wijmo/React interop module."), 
                React.createElement("li", null, 
                    "Add FlexGrid controls to your React components using regular JSX markup" + ' ' + "(", 
                    React.createElement("code", null, "<Wj.FlexGrid>"), 
                    ")."), 
                React.createElement("li", null, 
                    "Set the ", 
                    React.createElement("b", null, "itemsSource"), 
                    " attribute to an array that contains the data."), 
                React.createElement("li", null, "(Optional) Use CSS to customize the appearance of the controls.")), 
            React.createElement("p", null, "This will create a FlexGrid with default behavior, which includes" + ' ' + "automatic column generation, column sorting and reordering, editing," + ' ' + "and clipboard support."), 
            React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-md-6"}, 
                    React.createElement("ul", {className: "nav nav-tabs", role: "tablist"}, 
                        React.createElement("li", {className: "active"}, 
                            React.createElement("a", {href: "#gsJsx", role: "tab", "data-toggle": "tab"}, "JSX")
                        ), 
                        React.createElement("li", null, 
                            React.createElement("a", {href: "#gsJs", role: "tab", "data-toggle": "tab"}, "JS")
                        )), 
                    React.createElement("div", {className: "tab-content"}, 
                        React.createElement("div", {className: "tab-pane active pane-content", id: "gsJsx"}, '<Wj.FlexGrid itemsSource={ Util.getData() }/>'), 
                        React.createElement("div", {className: "tab-pane pane-content", id: "gsJs"}, 
                            'function getCountries() {\n', 
                            '    return \'US,Germany,UK,Japan,Italy,Greece\'.split(\',\');\n', 
                            '}\n', 
                            'function getData() {\n', 
                            '    var countries = getCountries(),\n', 
                            '        data = [];\n', 
                            '    for (var i = 0; i < 100; i++) {\n', 
                            '        data.push({\n', 
                            '            id: i,\n', 
                            '            country: countries[i % countries.length],\n', 
                            '            date: new Date(2014, i % 12, i % 28),\n', 
                            '            amount: Math.random() * 10000,\n', 
                            '            active: i % 4 == 0\n', 
                            '        });\n', 
                            '    }\n', 
                            '    return data;\n', 
                            '}'))), 
                React.createElement("div", {className: "col-md-6"}, 
                    React.createElement("h4", null, "Result (live):"), 
                    React.createElement(Wj.FlexGrid, {itemsSource: Util.getData()}))));
    }
});
//# sourceMappingURL=GettingStarted.js.map