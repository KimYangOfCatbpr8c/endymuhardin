var Customize = React.createClass({
    // create custom pivot engine for this component
    getInitialState: function () {
        return {
            engine: new wijmo.olap.PivotEngine({
                autoGenerateFields: false,
                itemsSource: Util.getSimpleDataSet(10000),
                showColumnTotals: wijmo.olap.ShowTotals.GrandTotals,
                showRowTotals: wijmo.olap.ShowTotals.None,
                fields: [
                    { binding: 'product', header: 'Product' },
                    { binding: 'date', header: 'Date', format: 'yyyy \"Q\"q' },
                    { binding: 'sales', header: 'Sales', format: 'n0' },
                    { binding: 'sales', header: 'Diff', format: 'p0', showAs: wijmo.olap.ShowAs.DiffRowPct }
                ],
                rowFields: ['Date'],
                columnFields: ['Product'],
                valueFields: ['Sales', 'Diff']
            })
        };
    },
    // customize PivotGrid cell display
    formatItem: function (s, e) {
        if (e.panel == s.cells && e.col % 2 == 1) {
            var value = s.getCellData(e.row, e.col), color = '#d8b400', glyph = 'circle';
            if (value != null) {
                if (value < 0) {
                    color = '#9f0000';
                    glyph = 'down';
                }
                else if (value > 0.05) {
                    color = '#4c8f00';
                    glyph = 'down';
                }
                e.cell.style.color = color;
                e.cell.innerHTML += ' <span style="font-size:120%" class="wj-glyph-' + glyph + '"></span>';
            }
        }
    },
    render: function () {
        return React.createElement("div", null, 
            React.createElement("h4", null, "Customize the PivotGrid cells"), 
            React.createElement("p", null, 
                "The ", 
                React.createElement("b", null, "PivotGrid"), 
                " control extends the ", 
                React.createElement("b", null, "FlexGrid"), 
                ", so you can customize the display" + ' ' + "of the grid cells using the ", 
                React.createElement("b", null, "formatItem"), 
                " event and modifying the content of each" + ' ' + "cell with complete flexibility."), 
            React.createElement("p", null, 
                "For example, the ", 
                React.createElement("b", null, "PivotGrid"), 
                " below uses colors and icons similar to the ones in Excel's" + ' ' + "icon sets to show how sales changed from quarter to quarter:"), 
            React.createElement(Wj.PivotGrid, {itemsSource: this.state.engine, formatItem: this.formatItem, showSelectedHeaders: "All", style: { border: 'none' }}), 
            React.createElement("div", {className: "source-card mdl-card mdl-shadow--2dp"}, 
                React.createElement("div", {className: "mdl-tabs mdl-js-tabs mdl-js-ripple-effect"}, 
                    React.createElement("div", {className: "mdl-tabs__tab-bar"}, 
                        React.createElement("a", {href: "#html-customize", className: "mdl-tabs__tab"}, "JSX"), 
                        React.createElement("a", {href: "#js-customize", className: "mdl-tabs__tab"}, "JS"), 
                        React.createElement("a", {href: "#close-customize", className: "mdl-tabs__tab is-active"}, "X")), 
                    React.createElement("div", {className: "mdl-tabs__panel", id: "html-customize"}, 
                        React.createElement("code", {className: "pane-content"}, 
                            '<Wj.PivotGrid\n', 
                            '    itemsSource={ this.state.engine }\n', 
                            '    formatItem={ this.formatItem }\n', 
                            '    showSelectedHeaders="All"\n', 
                            '    style={{ border: \'none\' }}>\n', 
                            '</Wj.PivotGrid>')
                    ), 
                    React.createElement("div", {className: "mdl-tabs__panel", id: "js-customize"}, 
                        React.createElement("code", {className: "pane-content"}, 
                            '// create custom pivot engine for this component\n', 
                            'getInitialState: function () {\n', 
                            '    return {\n', 
                            '        engine: new wijmo.olap.PivotEngine({\n', 
                            '            autoGenerateFields: false,\n', 
                            '            itemsSource: Util.getSimpleDataSet(10000),\n', 
                            '            showColumnTotals: wijmo.olap.ShowTotals.GrandTotals,\n', 
                            '            showRowTotals: wijmo.olap.ShowTotals.None,\n', 
                            '            fields: [\n', 
                            '                { binding: \'product\', header: \'Product\' },\n', 
                            '                { binding: \'date\', header: \'Date\', format: \'yyyy \"Q\"q\' },\n', 
                            '                { binding: \'sales\', header: \'Sales\', format: \'n0\' },\n', 
                            '                { binding: \'sales\', header: \'Diff\', format: \'p0\', showAs: wijmo.olap.ShowAs.DiffRowPct }\n', 
                            '            ],\n', 
                            '            rowFields: [\'Date\'],\n', 
                            '            columnFields: [\'Product\'],\n', 
                            '            valueFields: [\'Sales\', \'Diff\']\n', 
                            '        })\n', 
                            '    }\n', 
                            '},\n', 
                            '\n', 
                            '// customize PivotGrid cell display\n', 
                            'formatItem: function (s, e) {\n', 
                            '    if (e.panel == s.cells && e.col % 2 == 1) {\n', 
                            '        var value = s.getCellData(e.row, e.col),\n', 
                            '            color = \'#d8b400\',\n', 
                            '            glyph = \'circle\';\n', 
                            '        if (value != null) {\n', 
                            '            if (value < 0) { // negative variation\n', 
                            '                color = \'#9f0000\';\n', 
                            '                glyph = \'down\';\n', 
                            '            } else if (value > 0.05) { // positive variation\n', 
                            '                color = \'#4c8f00\';\n', 
                            '                glyph = \'down\';\n', 
                            '            }\n', 
                            '            e.cell.style.color = color;\n', 
                            '            e.cell.innerHTML += \' <span style="font-size:120%" class="wj-glyph-\' + glyph + \'"></span>\';\n', 
                            '        }\n', 
                            '    }\n', 
                            '}')
                    ), 
                    React.createElement("div", {className: "mdl-tabs__panel", id: "close-customize"}))
            ));
    }
});
//# sourceMappingURL=Customize.js.map