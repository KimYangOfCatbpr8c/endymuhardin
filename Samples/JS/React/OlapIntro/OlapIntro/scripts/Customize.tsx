declare var React: any;

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
        }
    },

    // customize PivotGrid cell display
    formatItem: function (s, e) {
        if (e.panel == s.cells && e.col % 2 == 1) {
            var value = s.getCellData(e.row, e.col),
                color = '#d8b400',
                glyph = 'circle';
            if (value != null) {
                if (value < 0) { // negative variation
                    color = '#9f0000';
                    glyph = 'down';
                } else if (value > 0.05) { // positive variation
                    color = '#4c8f00';
                    glyph = 'down';
                }
                e.cell.style.color = color;
                e.cell.innerHTML += ' <span style="font-size:120%" class="wj-glyph-' + glyph + '"></span>';
            }
        }
    },

    render: function () {
        return <div>
            <h4>
                Customize the PivotGrid cells</h4>
            <p>
                The <b>PivotGrid</b> control extends the <b>FlexGrid</b>, so you can customize the display
                of the grid cells using the <b>formatItem</b> event and modifying the content of each
                cell with complete flexibility.</p>
            <p>
                For example, the <b>PivotGrid</b> below uses colors and icons similar to the ones in Excel's
                icon sets to show how sales changed from quarter to quarter:</p>

            <Wj.PivotGrid
                itemsSource={ this.state.engine }
                formatItem={ this.formatItem }
                showSelectedHeaders="All"
                style={{ border: 'none' }}>
            </Wj.PivotGrid>

            <div className="source-card mdl-card mdl-shadow--2dp">
                <div className="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
                    <div className="mdl-tabs__tab-bar">
                        <a href="#html-customize" className="mdl-tabs__tab">JSX</a>
                        <a href="#js-customize" className="mdl-tabs__tab">JS</a>
                        <a href="#close-customize" className="mdl-tabs__tab is-active">X</a>
                    </div>
                    <div className="mdl-tabs__panel" id="html-customize">
                        <code className="pane-content">
                            {'<Wj.PivotGrid\n'}
                            {'    itemsSource={ this.state.engine }\n'}
                            {'    formatItem={ this.formatItem }\n'}
                            {'    showSelectedHeaders="All"\n'}
                            {'    style={{ border: \'none\' }}>\n'}
                            {'</Wj.PivotGrid>'}
                        </code>
                    </div>
                    <div className="mdl-tabs__panel" id="js-customize">
                        <code className="pane-content">
                            {'// create custom pivot engine for this component\n'}
                            {'getInitialState: function () {\n'}
                            {'    return {\n'}
                            {'        engine: new wijmo.olap.PivotEngine({\n'}
                            {'            autoGenerateFields: false,\n'}
                            {'            itemsSource: Util.getSimpleDataSet(10000),\n'}
                            {'            showColumnTotals: wijmo.olap.ShowTotals.GrandTotals,\n'}
                            {'            showRowTotals: wijmo.olap.ShowTotals.None,\n'}
                            {'            fields: [\n'}
                            {'                { binding: \'product\', header: \'Product\' },\n'}
                            {'                { binding: \'date\', header: \'Date\', format: \'yyyy \"Q\"q\' },\n'}
                            {'                { binding: \'sales\', header: \'Sales\', format: \'n0\' },\n'}
                            {'                { binding: \'sales\', header: \'Diff\', format: \'p0\', showAs: wijmo.olap.ShowAs.DiffRowPct }\n'}
                            {'            ],\n'}
                            {'            rowFields: [\'Date\'],\n'}
                            {'            columnFields: [\'Product\'],\n'}
                            {'            valueFields: [\'Sales\', \'Diff\']\n'}
                            {'        })\n'}
                            {'    }\n'}
                            {'},\n'}
                            {'\n'}
                            {'// customize PivotGrid cell display\n'}
                            {'formatItem: function (s, e) {\n'}
                            {'    if (e.panel == s.cells && e.col % 2 == 1) {\n'}
                            {'        var value = s.getCellData(e.row, e.col),\n'}
                            {'            color = \'#d8b400\',\n'}
                            {'            glyph = \'circle\';\n'}
                            {'        if (value != null) {\n'}
                            {'            if (value < 0) { // negative variation\n'}
                            {'                color = \'#9f0000\';\n'}
                            {'                glyph = \'down\';\n'}
                            {'            } else if (value > 0.05) { // positive variation\n'}
                            {'                color = \'#4c8f00\';\n'}
                            {'                glyph = \'down\';\n'}
                            {'            }\n'}
                            {'            e.cell.style.color = color;\n'}
                            {'            e.cell.innerHTML += \' <span style="font-size:120%" class="wj-glyph-\' + glyph + \'"></span>\';\n'}
                            {'        }\n'}
                            {'    }\n'}
                            {'}'}
                        </code>
                    </div>
                    <div className="mdl-tabs__panel" id="close-customize">
                    </div>
                </div>
            </div>
        </div>;
    }
});
