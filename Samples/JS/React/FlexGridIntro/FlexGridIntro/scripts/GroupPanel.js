var GroupPanel = React.createClass({
    getInitialState: function () {
        return {
            view: new wijmo.collections.CollectionView(Util.getData())
        };
    },
    // connect GroupPanel to FlexGrid when the component mounts
    componentDidMount: function () {
        var grid = wijmo.Control.getControl(document.getElementById('theGrid'));
        var panel = wijmo.Control.getControl(document.getElementById('thePanel'));
        panel.grid = grid;
    },
    render: function () {
        return React.createElement("div", null, 
            React.createElement("h2", null, "GroupPanel"), 
            React.createElement("p", null, 
                "Use the ", 
                React.createElement("b", null, "Wj.GroupPanel"), 
                " component to implement a UI for drag/drop" + ' ' + "grouping. It provides a drag/drop surface, so users can create and modify" + ' ' + "the groups dynamically:"), 
            React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-md-6"}, 
                    React.createElement("ul", {className: "nav nav-tabs", role: "tablist"}, 
                        React.createElement("li", {className: "active"}, 
                            React.createElement("a", {href: "#gp2Jsx", role: "tab", "data-toggle": "tab"}, "JSX")
                        ), 
                        React.createElement("li", null, 
                            React.createElement("a", {href: "#gp2Js", role: "tab", "data-toggle": "tab"}, "JS")
                        )), 
                    React.createElement("div", {className: "tab-content"}, 
                        React.createElement("div", {className: "tab-pane active pane-content", id: "gp2Jsx"}, 
                            '<Wj.GroupPanel\n', 
                            '   id="thePanel"\n', 
                            '   placeholder="Drag columns here to create Groups" />\n', 
                            '<Wj.FlexGrid\n', 
                            '   id="theGrid"\n', 
                            '   itemsSource={this.state.view} />'), 
                        React.createElement("div", {className: "tab-pane pane-content", id: "gp2Js"}, 
                            'var GroupPanel = React.createClass({\n', 
                            '    getInitialState: function () {\n', 
                            '        return {\n', 
                            '            view: new wijmo.collections.CollectionView(Util.getData())\n', 
                            '        \}\n', 
                            '    \},\n', 
                            '\n', 
                            '    // connect GroupPanel to FlexGrid when the component mounts\n', 
                            '    componentDidMount: function () {\n', 
                            '      var grid = wijmo.Control.getControl(document.getElementById(\'theGrid\')) as wijmo.grid.FlexGrid;\n', 
                            '      var panel = wijmo.Control.getControl(document.getElementById(\'thePanel\')) as wijmo.grid.grouppanel.GroupPanel;\n', 
                            '      panel.grid = grid;\n', 
                            '    \}\n'))), 
                React.createElement("div", {className: "col-md-6"}, 
                    React.createElement("h4", null, "Result (live):"), 
                    React.createElement(Wj.GroupPanel, {id: "thePanel", placeholder: "Drag columns here to create Groups"}), 
                    React.createElement(Wj.FlexGrid, {id: "theGrid", itemsSource: this.state.view}))));
    }
});
//# sourceMappingURL=GroupPanel.js.map