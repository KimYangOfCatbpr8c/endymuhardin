declare var React: any;

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
        }
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
        if (def.target) { // load from local storage
            ng.viewDefinition = localStorage['viewDefinition'];
        } else { // apply pre-defined view definition
            ng.itemsSource = this.props.dataSets[3].value;
            ng.viewDefinition = def;
        }
    },

    render: function () {
        return <div>
            <h3>
                Introducing wijmo.olap</h3>
            <p>
                The <b>wijmo.olap</b> module contains controls that allow you to add Excel-like pivot
                table and pivot chart features to your applications.
                To use it, follow these steps:</p>
            <ul>
                <li>
                    Add references to the <b>wijmo</b> and <b>wijmo.olap</b> modules to the page.</li>
                <li>
                    Add a <b>PivotPanel</b> control to the page.</li>
                <li>
                    Add one or more <b>PivotGrid</b> and <b>PivotChart</b> controls to the page,
                    and connect them to the <b>PivotPanel</b> by setting their <b>itemsSource</b>
                    property to the <b>PivotPanel</b> control.</li>
                <li>
                    Set the PivotPanel's <b>itemsSource</b> property to an array containing the
                    raw data you want to analyze.</li>
                <li>
                    Optionally add code to print, export, save and load views and view definitions.</li>
            </ul>
            <p>
                That's all. The <b>PivotPanel</b> will show a list of the fields available, and
                users will be able to drag fields between summary areas to generate data summaries
                (AKA "views").
                Users may also configure the fields by setting their headers, summary functions,
                filters, and formats.</p>
            <p>
                Users may analyze the data and print the results, export the results to XLSX or PDF,
                and save view definitions that can be re-used later.</p>
            <p>
                Here is a simple example:</p>

            <h4>
                Add a PivotPanel and a PivotGrid to the page</h4>
            <p>
                The <b>PivotPanel</b> control is similar to Excel's "field list" window
                that is associated with pivot tables and charts.</p>
            <ul>
                <li>
                    Add fields to the view by dragging or using the checkboxes.</li>
                <li>
                    Remove fields from the view by dragging them back to the top area or by using their
                    context menu.</li>
                <li>
                    Configure fields using their context menu. You may modify their header, summary function,
                    and format. Note that the format is used when grouping the data, so you can group data
                    by day, month, quarter or year by changing the format of the date fields for example.</li>
            </ul>

            <p>
                The <b>PivotGrid</b> control extends the <b>FlexGrid</b> to support pivoting features
                including custom cell merging, hierarchical row and column groups, and a custom
                context menu that allows users to configure the pivot fields and to drill-down
                into the data items that were used in the computation of specific summary cells.</p>

            <div className="mdl-grid" id="theView">
                <div className="mdl-cell mdl-cell--4-col">
                    <Wj.PivotPanel
                        engine={ this.props.engine } >
                    </Wj.PivotPanel>
                </div>
                <div className="mdl-cell mdl-cell--8-col">
                    <Wj.PivotGrid
                        id="thePivotGrid"
                        itemsSource={ this.props.engine } 
                        showSelectedHeaders="All">
                    </Wj.PivotGrid>
                </div>
            </div>

            <div className="source-card mdl-card mdl-shadow--2dp">
                <div className="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
                    <div className="mdl-tabs__tab-bar">
                        <a href="#html-gs1" className="mdl-tabs__tab">JSX</a>
                        <a href="#js-gs1" className="mdl-tabs__tab">JS</a>
                        <a href="#close-gs1" className="mdl-tabs__tab is-active">X</a>
                    </div>
                    <div className="mdl-tabs__panel" id="html-gs1">
                        <code className="pane-content">
                            {'<div className="mdl-cell mdl-cell--4-col">\n'}
                            {'    <Wj.PivotPanel\n'}
                            {'        engine={ this.props.engine } >\n'}
                            {'    </Wj.PivotPanel>\n'}
                            {'</div>\n'}
                            {'<div className="mdl-cell mdl-cell--8-col">\n'}
                            {'    <Wj.PivotGrid\n'}
                            {'        id="thePivotGrid"\n'}
                            {'        itemsSource={ this.props.engine }\n'}
                            {'        showSelectedHeaders="All">\n'}
                            {'    </Wj.PivotGrid>\n'}
                            {'</div>'}
                        </code>
                    </div>
                    <div className="mdl-tabs__panel" id="js-gs1">
                        <code className="pane-content">
                            {'// no code required'}
                        </code>
                    </div>
                    <div className="mdl-tabs__panel" id="close-gs1">
                    </div>
                </div>
            </div>

            <p>
                Use the <b>viewDefinition</b> property to save and restore view definitions. For example:</p>

            <button
                className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect"
                onClick={ this.saveView }>
                Save View
            </button>
            {' '}
            <button
                className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect"
                onClick={ this.loadView }>
                Load View
            </button>

            <p></p>
            <p>
                Or build a list of pre-defined views for the user to pick from. For example:</p>
            <ul>
                {
                    // https://facebook.github.io/react/tips/communicate-between-components.html
                    this.state.viewDefs.map((item, index) => {
                        return <li key={ index }>
                            <a href="#theView" onClick={ this.loadView.bind(this, item.def) }>
                                { item.name }
                            </a>
                        </li>;
                    })
                }
            </ul>

            <div className="source-card mdl-card mdl-shadow--2dp">
                <div className="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
                    <div className="mdl-tabs__tab-bar">
                        <a href="#html-gs2" className="mdl-tabs__tab">JSX</a>
                        <a href="#js-gs2" className="mdl-tabs__tab">JS</a>
                        <a href="#close-gs2" className="mdl-tabs__tab is-active">X</a>
                    </div>
                    <div className="mdl-tabs__panel" id="html-gs2">
                        <code className="pane-content">
                            {'<button\n'}
                            {'    className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect"\n'}
                            {'    onClick={ this.saveView }>\n'}
                            {'    Save View\n'}
                            {'</button>\n'}
                            {'<button\n'}
                            {'    className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect"\n'}
                            {'    onClick={ this.loadView }>\n'}
                            {'    Load View\n'}
                            {'</button>\n'}
                            {'<ul>\n'}
                            {'    {\n'}
                            {'        // https://facebook.github.io/react/tips/communicate-between-components.html\n'}
                            {'        this.state.viewDefs.map((item, index) => {\n'}
                            {'            return <li key={ index }>\n'}
                            {'                <a href="#theView" onClick={ this.loadView.bind(this, item.def) }>\n'}
                            {'                    { item.name }\n'}
                            {'                </a>\n'}
                            {'            </li>;\n'}
                            {'        })\n'}
                            {'    }\n'}
                            {'</ul>'}
                        </code>
                    </div>
                    <div className="mdl-tabs__panel" id="js-gs2">
                        <code className="pane-content">
                            {'getInitialState: function () {\n'}
                            {'    return {\n'}
                            {'        viewDefs: [\n'}
                            {'            {\n'}
                            {'                name: "Sales by Product",\n'}
                            {'                def: "{\"showZeros\":false,\"showColumnTotals\":2,\"showRowTotals\":2,\"defaultFilterType\":3,\"fields\":[{\"binding\":\"id\",\"header\":\"Id\",\"dataType\":2,\"aggregate\":1,\"showAs\":0,\"descending\":false,\"format\":\"n0\",\"isContentHtml\":false},{\"binding\":\"product\",\"header\":\"Product\",\"dataType\":1,\"aggregate\":2,\"showAs\":0,\"descending\":false,\"isContentHtml\":false},{\"binding\":\"country\",\"header\":\"Country\",\"dataType\":1,\"aggregate\":2,\"showAs\":0,\"descending\":false,\"isContentHtml\":false},{\"binding\":\"date\",\"header\":\"Date\",\"dataType\":4,\"aggregate\":2,\"showAs\":0,\"descending\":false,\"format\":\"d\",\"isContentHtml\":false},{\"binding\":\"sales\",\"header\":\"Sales\",\"dataType\":2,\"aggregate\":1,\"showAs\":0,\"descending\":false,\"format\":\"n0\",\"isContentHtml\":false},{\"binding\":\"downloads\",\"header\":\"Downloads\",\"dataType\":2,\"aggregate\":1,\"showAs\":0,\"descending\":false,\"format\":\"n0\",\"isContentHtml\":false},{\"binding\":\"active\",\"header\":\"Active\",\"dataType\":3,\"aggregate\":2,\"showAs\":0,\"descending\":false,\"isContentHtml\":false},{\"binding\":\"discount\",\"header\":\"Discount\",\"dataType\":2,\"aggregate\":1,\"showAs\":0,\"descending\":false,\"format\":\"n0\",\"isContentHtml\":false}],\"rowFields\":{\"items\":[\"Product\"]},\"columnFields\":{\"items\":[]},\"filterFields\":{\"items\":[]},\"valueFields\":{\"items\":[\"Sales\"]}}"\n'}
                            {'            },...\n'}
                            {'        ]\n'}
                            {'    }\n'}
                            {'},\n'}
                            {'\n'}
                            {'// save/restore view definitions\n'}
                            {'saveView: function () {\n'}
                            {'    var ng = this.props.engine;\n'}
                            {'    if (ng.isViewDefined) {\n'}
                            {'        localStorage[\'viewDefinition\'] = ng.viewDefinition;\n'}
                            {'    }\n'}
                            {'},\n'}
                            {'loadView: function (def) {\n'}
                            {'    var ng = this.props.engine;\n'}
                            {'    if (def.target) { // load from local storage\n'}
                            {'        ng.viewDefinition = localStorage[\'viewDefinition\'];\n'}
                            {'    } else { // apply pre-defined view definition\n'}
                            {'        ng.itemsSource = this.props.dataSets[3].value;\n'}
                            {'        ng.viewDefinition = def;\n'}
                            {'    }\n'}
                            {'}'}
                        </code>
                    </div>
                    <div className="mdl-tabs__panel" id="close-gs2">
                    </div>
                </div>
            </div>
        </div>;
    }
});
