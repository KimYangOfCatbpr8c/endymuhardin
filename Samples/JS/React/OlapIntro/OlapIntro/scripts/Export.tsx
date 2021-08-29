declare var React: any;

var Export = React.createClass({

    // export pivot table and raw data to Excel
    exportXlsx: function () {
        var ng = this.props.engine,
            pivotGrid = wijmo.Control.getControl(document.getElementById('thePivotGrid')) as wijmo.grid.FlexGrid,
            rawGrid = wijmo.Control.getControl(document.getElementById('theRawGrid')) as wijmo.grid.FlexGrid;

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
        return <div>
            <h4>
                Export the results to Excel</h4>
            <p>
                The <b>PivotGrid</b> control extends the <b>FlexGrid</b>, so you can export it to any of
                the formats supported by the extension modules provided with the <b>FlexGrid</b>. The
                list of supported formats includes XLSLX, CSV, and PDF.</p>
            <p>
                For example, the button below creates an Excel file with three sheets: the current view,
                a transposed version of the current view, and the raw data:</p>

            <button
                className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect"
                onClick={ this.exportXlsx } >
                Export to XLSX
            </button>

            <div className="source-card mdl-card mdl-shadow--2dp">
                <div className="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
                    <div className="mdl-tabs__tab-bar">
                        <a href="#html-export" className="mdl-tabs__tab">JSX</a>
                        <a href="#js-export" className="mdl-tabs__tab">JS</a>
                        <a href="#close-export" className="mdl-tabs__tab is-active">X</a>
                    </div>
                    <div className="mdl-tabs__panel" id="html-export">
                        <code className="pane-content">
                            {'<button\n'}
                            {'    className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect"\n'}
                            {'    onClick={ this.exportXlsx } >\n'}
                            {'    Export to XLSX\n'}
                            {'</button>'}
                        </code>
                    </div>
                    <div className="mdl-tabs__panel" id="js-export">
                        <code className="pane-content">
                            {'// export pivot table and raw data to Excel\n'}
                            {'exportXlsx: function () {\n'}
                            {'    var ng = this.props.engine,\n'}
                            {'        pivotGrid = wijmo.Control.getControl(document.getElementById(\'thePivotGrid\')) as wijmo.grid.FlexGrid,\n'}
                            {'        rawGrid = wijmo.Control.getControl(document.getElementById(\'theRawGrid\')) as wijmo.grid.FlexGrid;\n'}
                            {'\n'}
                            {'    // create book with current view\n'}
                            {'    var book = wijmo.grid.xlsx.FlexGridXlsxConverter.save(pivotGrid, {\n'}
                            {'        includeColumnHeaders: true,\n'}
                            {'        includeRowHeaders: true\n'}
                            {'    });\n'}
                            {'    book.sheets[0].name = \'Main View\';\n'}
                            {'    Util.addTitleCell(book.sheets[0], Util.getViewTitle(ng));\n'}
                            {'\n'}
                            {'    // add sheet with transposed view\n'}
                            {'    Util.transposeView(ng);\n'}
                            {'    var transposed = wijmo.grid.xlsx.FlexGridXlsxConverter.save(pivotGrid, {\n'}
                            {'        includeColumnHeaders: true,\n'}
                            {'        includeRowHeaders: true\n'}
                            {'    });\n'}
                            {'    transposed.sheets[0].name = \'Transposed View\';\n'}
                            {'    Util.addTitleCell(transposed.sheets[0], Util.getViewTitle(ng));\n'}
                            {'    book.sheets.push(transposed.sheets[0]);\n'}
                            {'    Util.transposeView(ng);\n'}
                            {'\n'}
                            {'    // add sheet with raw data (unless there\'s too much data)\n'}
                            {'    if (ng.itemsSource.items.length < 20000) {\n'}
                            {'        var raw = wijmo.grid.xlsx.FlexGridXlsxConverter.save(rawGrid, {\n'}
                            {'            includeColumnHeaders: true,\n'}
                            {'            includeRowHeaders: false\n'}
                            {'        });\n'}
                            {'        raw.sheets[0].name = \'Raw Data\';\n'}
                            {'        book.sheets.push(raw.sheets[0]);\n'}
                            {'    }\n'}
                            {'\n'}
                            {'    // save the book\n'}
                            {'    book.save(\'wijmo.olap.xlsx\');\n'}
                            {'}'}
                        </code>
                    </div>
                    <div className="mdl-tabs__panel" id="close-export">
                    </div>
                </div>
            </div>
        </div>;
    }
});
