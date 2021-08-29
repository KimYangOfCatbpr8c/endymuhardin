var GettingStarted = React.createClass({
    render: function () {
        return React.createElement("div", null, 
            React.createElement("h2", null, "Getting Started"), 
            React.createElement("p", null, "Steps for getting started with Input controls in React applications:"), 
            React.createElement("ol", null, 
                React.createElement("li", null, "Add references to React, Wijmo, and the Wijmo/React interop module."), 
                React.createElement("li", null, "Add wijmo controls to your React components using regular JSX markup."), 
                React.createElement("li", null, "(Optional) Use CSS to customize the appearance of the controls.")), 
            React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-md-6"}, 
                    React.createElement("div", null, 
                        React.createElement("ul", {className: "nav nav-tabs", role: "tablist"}, 
                            React.createElement("li", {className: "active"}, 
                                React.createElement("a", {href: "#gsHtml", role: "tab", "data-toggle": "tab"}, "HTML")
                            ), 
                            React.createElement("li", null, 
                                React.createElement("a", {href: "#gsJs", role: "tab", "data-toggle": "tab"}, "JSX")
                            )), 
                        React.createElement("div", {className: "tab-content"}, 
                            React.createElement("div", {className: "tab-pane active pane-content", id: "gsHtml"}, 
                                '<!DOCTYPE html>\n', 
                                '<html>\n', 
                                '<head>\n', 
                                '\n', 
                                '    <!-- React -->\n', 
                                '    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react.js"></script>\n', 
                                '    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.1.0/react-dom.js"></script>\n', 
                                '\n', 
                                '    <!-- Wijmo -->\n', 
                                '    <link href="css/wijmo.css" rel="stylesheet" />\n', 
                                '    <script src="scripts/wijmo.js"></script>\n', 
                                '    <script src="scripts/wijmo.input.js"></script>\n', 
                                '\n', 
                                '    <!-- Wijmo/React interop -->\n', 
                                '    <script src="scripts/wijmo.react.js"></script>\n', 
                                '\n', 
                                '</head>\n', 
                                '<body>\n', 
                                '    <div id="app"/>\n', 
                                '    <script>\n', 
                                '        ReactDOM.render(React.createElement(App), document.getElementById(\'app\'));\n', 
                                '    </script>\n', 
                                '</body>\n', 
                                '</html>'), 
                            React.createElement("div", {className: "tab-pane pane-content", id: "gsJs"}, '<Wj.InputNumber value={ 3.5 } step={ .5 } format=\'n2\' />')))
                ), 
                React.createElement("div", {className: "col-md-6"}, 
                    React.createElement("h4", null, "Result (live):"), 
                    React.createElement(Wj.InputNumber, {value: 3.5, step: .5, format: 'n2'}))));
    }
});
//# sourceMappingURL=GettingStarted.js.map