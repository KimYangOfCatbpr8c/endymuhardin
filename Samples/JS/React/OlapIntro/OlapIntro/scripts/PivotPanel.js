var PivotPanel = React.createClass({
    // event handlers
    dataSetChanged: function (s, e) {
        this.props.engine.itemsSource = s.selectedValue;
    },
    showRowTotalsChanged: function (s, e) {
        this.props.engine.showRowTotals = s.text;
    },
    showColumnTotalsChanged: function (s, e) {
        this.props.engine.showColumnTotals = s.text;
    },
    totalsBeforeDataChanged: function (e) {
        this.props.engine.totalsBeforeData = e.target.checked;
    },
    showZerosChanged: function (e) {
        this.props.engine.showZeros = e.target.checked;
    },
    render: function () {
        return React.createElement("div", null, 
            React.createElement("h4", null, "Configure the PivotPanel properties"), 
            React.createElement("p", null, 
                "The ", 
                React.createElement("b", null, "PivotPanel"), 
                " control has properties that allow you to customize" + ' ' + "the view. Use the controls below to modify the value of some properties" + ' ' + "and see their effect:"), 
            React.createElement("dl", {className: "dl-horizontal"}, 
                React.createElement("dt", null, "Dataset"), 
                React.createElement("dd", null, 
                    React.createElement(Wj.ComboBox, {itemsSource: this.props.dataSets, displayMemberPath: "name", selectedValuePath: "value", textChanged: this.dataSetChanged})
                ), 
                React.createElement("dt", null, "Row totals"), 
                React.createElement("dd", null, 
                    React.createElement(Wj.ComboBox, {itemsSource: Util.getEnumNames(wijmo.olap.ShowTotals), text: wijmo.olap.ShowTotals[this.props.engine.showRowTotals], textChanged: this.showRowTotalsChanged})
                ), 
                React.createElement("dt", null, "Column totals"), 
                React.createElement("dd", null, 
                    React.createElement(Wj.ComboBox, {itemsSource: Util.getEnumNames(wijmo.olap.ShowTotals), text: wijmo.olap.ShowTotals[this.props.engine.showColumnTotals], textChanged: this.showColumnTotalsChanged})
                ), 
                React.createElement("dt", null, "Show Zeros"), 
                React.createElement("dd", null, 
                    React.createElement("input", {type: "checkbox", onChange: this.showZerosChanged})
                ), 
                React.createElement("dt", null, "Totals Before Data"), 
                React.createElement("dd", null, 
                    React.createElement("input", {type: "checkbox", onChange: this.totalsBeforeDataChanged})
                )), 
            React.createElement("div", {className: "source-card mdl-card mdl-shadow--2dp"}, 
                React.createElement("div", {className: "mdl-tabs mdl-js-tabs mdl-js-ripple-effect"}, 
                    React.createElement("div", {className: "mdl-tabs__tab-bar"}, 
                        React.createElement("a", {href: "#html-panel", className: "mdl-tabs__tab"}, "JSX"), 
                        React.createElement("a", {href: "#js-panel", className: "mdl-tabs__tab"}, "JS"), 
                        React.createElement("a", {href: "#close-panel", className: "mdl-tabs__tab is-active"}, "X")), 
                    React.createElement("div", {className: "mdl-tabs__panel", id: "html-panel"}, 
                        React.createElement("code", {className: "pane-content"}, 
                            '<dl className="dl-horizontal">\n', 
                            '    <dt>Dataset</dt>\n', 
                            '    <dd>\n', 
                            '        <Wj.ComboBox\n', 
                            '            itemsSource={ this.props.dataSets }\n', 
                            '            displayMemberPath="name"\n', 
                            '            selectedValuePath="value"\n', 
                            '            textChanged={ this.dataSetChanged }>\n', 
                            '        </Wj.ComboBox>\n', 
                            '    </dd>\n', 
                            '    <dt>Row totals</dt>\n', 
                            '    <dd>\n', 
                            '        <Wj.ComboBox\n', 
                            '            itemsSource={ Util.getEnumNames(wijmo.olap.ShowTotals) }\n', 
                            '            text={ wijmo.olap.ShowTotals[this.props.engine.showRowTotals] }\n', 
                            '            textChanged={ this.showRowTotalsChanged }>\n', 
                            '        </Wj.ComboBox>\n', 
                            '    </dd>\n', 
                            '    <dt>Column totals</dt>\n', 
                            '    <dd>\n', 
                            '        <Wj.ComboBox\n', 
                            '            itemsSource={ Util.getEnumNames(wijmo.olap.ShowTotals) }\n', 
                            '            text={ wijmo.olap.ShowTotals[this.props.engine.showColumnTotals] }\n', 
                            '            textChanged={ this.showColumnTotalsChanged }>\n', 
                            '        </Wj.ComboBox>\n', 
                            '    </dd>\n', 
                            '    <dt>Show Zeros</dt>\n', 
                            '    <dd>\n', 
                            '        <input type="checkbox" onChange={ this.showZerosChanged }/>\n', 
                            '    </dd>\n', 
                            '    <dt>Totals Before Data</dt>\n', 
                            '    <dd>\n', 
                            '        <input type="checkbox" onChange={ this.totalsBeforeDataChanged }/>\n', 
                            '    </dd>\n', 
                            '</dl>')
                    ), 
                    React.createElement("div", {className: "mdl-tabs__panel", id: "js-panel"}, 
                        React.createElement("code", {className: "pane-content"}, 
                            '// event handlers\n', 
                            'dataSetChanged: function (s, e) {\n', 
                            '    this.props.engine.itemsSource = s.selectedValue;\n', 
                            '},\n', 
                            'showRowTotalsChanged: function (s, e) {\n', 
                            '    this.props.engine.showRowTotals = s.text;\n', 
                            '},\n', 
                            'showColumnTotalsChanged: function (s, e) {\n', 
                            '    this.props.engine.showColumnTotals = s.text;\n', 
                            '},\n', 
                            'totalsBeforeDataChanged: function (e) {\n', 
                            '    this.props.engine.totalsBeforeData = e.target.checked;\n', 
                            '},\n', 
                            'showZerosChanged: function (e) {\n', 
                            '    this.props.engine.showZeros = e.target.checked;\n', 
                            '}')
                    ), 
                    React.createElement("div", {className: "mdl-tabs__panel", id: "close-panel"}))
            ));
    }
});
//# sourceMappingURL=PivotPanel.js.map