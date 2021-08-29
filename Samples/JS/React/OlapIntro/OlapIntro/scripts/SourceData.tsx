declare var React: any;

var SourceData = React.createClass({

    // add a filter to the grid
    initGrid: function (s, e) {
        var f = new wijmo.grid.filter.FlexGridFilter(s);
    },

    render: function () {
        return <div>
            <h4>
                View and edit the source data</h4>
            <p>
                The pivot view is live.
                If you edit any of
                the { wijmo.Globalize.format(this.props.engine.itemsSource.items.length, 'n0') } items,
                the pivot view will be updated automatically.
                <span
                    className="text-info"
                    style={{ display: this.props.engine.itemsSource.tableName ? '' : 'none' }}>
                    {' '}
                    (This grid is read-only because it is bound to a read-only data source.)
                </span></p>

            <Wj.FlexGrid
                id="theRawGrid"
                style={{ border: 'none' }}
                showSelectedHeaders="All"
                itemsSource={ this.props.engine.itemsSource }
                initialized={ this.initGrid }>
            </Wj.FlexGrid>

            <div className="source-card mdl-card mdl-shadow--2dp">
                <div className="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
                    <div className="mdl-tabs__tab-bar">
                        <a href="#html-data" className="mdl-tabs__tab">JSX</a>
                        <a href="#js-data" className="mdl-tabs__tab">JS</a>
                        <a href="#close-data" className="mdl-tabs__tab is-active">X</a>
                    </div>
                    <div className="mdl-tabs__panel" id="html-data">
                        <code className="pane-content">
                            {'<Wj.FlexGrid\n'}
                            {'    id="theRawGrid"\n'}
                            {'    style={{ border: \'none\' }}\n'}
                            {'    showSelectedHeaders="All"\n'}
                            {'    itemsSource={ this.props.engine.itemsSource }\n'}
                            {'    initialized={ this.initGrid }>\n'}
                            {'</Wj.FlexGrid>'}
                        </code>
                    </div>
                    <div className="mdl-tabs__panel" id="js-data">
                        <code className="pane-content">
                            {'// add a filter to the grid\n'}
                            {'initGrid: function (s, e) {\n'}
                            {'    var f = new wijmo.grid.filter.FlexGridFilter(s);\n'}
                            {'}'}
                        </code>
                    </div>
                    <div className="mdl-tabs__panel" id="close-data">
                    </div>
                </div>
            </div>

        </div>;
    }
});
