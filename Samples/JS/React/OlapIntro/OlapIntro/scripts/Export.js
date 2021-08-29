var Export = React.createClass({
    // export pivot table and raw data to Excel
    exportXlsx: function () {
        var ng = this.props.engine, pivotGrid = wijmo.Control.getControl(document.getElementById('thePivotGrid')), rawGrid = wijmo.Control.getControl(document.getElementById('theRawGrid'));
        // create book with current view
        var book = wijmo.grid.xlsx.FlexGridXlsxConverter.save(pivotGrid, {
            includeColumnHeaders: true,
            includeRowHeaders: true
        });
        book.sheets[0].name = 'Main View';
        Util.addTitleCell(book.sheets[0], Util.getViewTitle(ng));
        // add sheet with transposed view
        Util.transposeView(ng);
        var transposed = wijmo.grid.xlsx.FlexGridXlsxConverter.save(pivotGrid, {
            includeColumnHeaders: true,
            includeRowHeaders: true
        });
        transposed.sheets[0].name = 'Transposed View';
        Util.addTitleCell(transposed.sheets[0], Util.getViewTitle(ng));
        book.sheets.push(transposed.sheets[0]);
        Util.transposeView(ng);
        // add sheet with raw data (unless there's too much data)
        if (ng.itemsSource.items.length < 20000) {
            var raw = wijmo.grid.xlsx.FlexGridXlsxConverter.save(rawGrid, {
                includeColumnHeaders: true,
                includeRowHeaders: false
            });
            raw.sheets[0].name = 'Raw Data';
            book.sheets.push(raw.sheets[0]);
        }
        // save the book
        book.save('wijmo.olap.xlsx');
    },
    render: function () {
        return React.createElement("div", null, 
            React.createElement("h4", null, "Export the results to Excel"), 
            React.createElement("p", null, 
                "The ", 
                React.createElement("b", null, "PivotGrid"), 
                " control extends the ", 
                React.createElement("b", null, "FlexGrid"), 
                ", so you can export it to any of" + ' ' + "the formats supported by the extension modules provided with the ", 
                React.createElement("b", null, "FlexGrid"), 
                ". The" + ' ' + "list of supported formats includes XLSLX, CSV, and PDF."), 
            React.createElement("p", null, "For example, the button below creates an Excel file with three sheets: the current view," + ' ' + "a transposed version of the current view, and the raw data:"), 
            React.createElement("button", {className: "mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect", onClick: this.exportXlsx}, "Export to XLSX"), 
            React.createElement("div", {className: "source-card mdl-card mdl-shadow--2dp"}, 
                React.createElement("div", {className: "mdl-tabs mdl-js-tabs mdl-js-ripple-effect"}, 
                    React.createElement("div", {className: "mdl-tabs__tab-bar"}, 
                        React.createElement("a", {href: "#html-export", className: "mdl-tabs__tab"}, "JSX"), 
                        React.createElement("a", {href: "#js-export", className: "mdl-tabs__tab"}, "JS"), 
                        React.createElement("a", {href: "#close-export", className: "mdl-tabs__tab is-active"}, "X")), 
                    React.createElement("div", {className: "mdl-tabs__panel", id: "html-export"}, 
                        React.createElement("code", {className: "pane-content"}, 
                            '<button\n', 
                            '    className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect"\n', 
                            '    onClick={ this.exportXlsx } >\n', 
                            '    Export to XLSX\n', 
                            '</button>')
                    ), 
                    React.createElement("div", {className: "mdl-tabs__panel", id: "js-export"}, 
                        React.createElement("code", {className: "pane-content"}, 
                            '// export pivot table and raw data to Excel\n', 
                            'exportXlsx: function () {\n', 
                            '    var ng = this.props.engine,\n', 
                            '        pivotGrid = wijmo.Control.getControl(document.getElementById(\'thePivotGrid\')) as wijmo.grid.FlexGrid,\n', 
                            '        rawGrid = wijmo.Control.getControl(document.getElementById(\'theRawGrid\')) as wijmo.grid.FlexGrid;\n', 
                            '\n', 
                            '    // create book with current view\n', 
                            '    var book = wijmo.grid.xlsx.FlexGridXlsxConverter.save(pivotGrid, {\n', 
                            '        includeColumnHeaders: true,\n', 
                            '        includeRowHeaders: true\n', 
                            '    });\n', 
                            '    book.sheets[0].name = \'Main View\';\n', 
                            '    Util.addTitleCell(book.sheets[0], Util.getViewTitle(ng));\n', 
                            '\n', 
                            '    // add sheet with transposed view\n', 
                            '    Util.transposeView(ng);\n', 
                            '    var transposed = wijmo.grid.xlsx.FlexGridXlsxConverter.save(pivotGrid, {\n', 
                            '        includeColumnHeaders: true,\n', 
                            '        includeRowHeaders: true\n', 
                            '    });\n', 
                            '    transposed.sheets[0].name = \'Transposed View\';\n', 
                            '    Util.addTitleCell(transposed.sheets[0], Util.getViewTitle(ng));\n', 
                            '    book.sheets.push(transposed.sheets[0]);\n', 
                            '    Util.transposeView(ng);\n', 
                            '\n', 
                            '    // add sheet with raw data (unless there\'s too much data)\n', 
                            '    if (ng.itemsSource.items.length < 20000) {\n', 
                            '        var raw = wijmo.grid.xlsx.FlexGridXlsxConverter.save(rawGrid, {\n', 
                            '            includeColumnHeaders: true,\n', 
                            '            includeRowHeaders: false\n', 
                            '        });\n', 
                            '        raw.sheets[0].name = \'Raw Data\';\n', 
                            '        book.sheets.push(raw.sheets[0]);\n', 
                            '    }\n', 
                            '\n', 
                            '    // save the book\n', 
                            '    book.save(\'wijmo.olap.xlsx\');\n', 
                            '}')
                    ), 
                    React.createElement("div", {className: "mdl-tabs__panel", id: "close-export"}))
            ));
    }
});
//# sourceMappingURL=Export.js.map