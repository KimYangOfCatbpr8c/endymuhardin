declare var React: any;

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
        return <div>
            <h4>
                Configure the PivotPanel properties</h4>
            <p>
                The <b>PivotPanel</b> control has properties that allow you to customize
                the view. Use the controls below to modify the value of some properties
                and see their effect:</p>

            <dl className="dl-horizontal">
                <dt>Dataset</dt>
                <dd>
                    <Wj.ComboBox
                        itemsSource={ this.props.dataSets }
                        displayMemberPath="name"
                        selectedValuePath="value"
                        textChanged={ this.dataSetChanged }>
                    </Wj.ComboBox>
                </dd>
                <dt>Row totals</dt>
                <dd>
                    <Wj.ComboBox
                        itemsSource={ Util.getEnumNames(wijmo.olap.ShowTotals) }
                        text={ wijmo.olap.ShowTotals[this.props.engine.showRowTotals] }
                        textChanged={ this.showRowTotalsChanged }>
                    </Wj.ComboBox>
                </dd>
                <dt>Column totals</dt>
                <dd>
                    <Wj.ComboBox
                        itemsSource={ Util.getEnumNames(wijmo.olap.ShowTotals) }
                        text={ wijmo.olap.ShowTotals[this.props.engine.showColumnTotals] }
                        textChanged={ this.showColumnTotalsChanged }>
                    </Wj.ComboBox>
                </dd>
                <dt>Show Zeros</dt>
                <dd>
                    <input type="checkbox" onChange={ this.showZerosChanged }/>
                </dd>
                <dt>Totals Before Data</dt>
                <dd>
                    <input type="checkbox" onChange={ this.totalsBeforeDataChanged }/>
                </dd>
            </dl>

            <div className="source-card mdl-card mdl-shadow--2dp">
                <div className="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
                    <div className="mdl-tabs__tab-bar">
                        <a href="#html-panel" className="mdl-tabs__tab">JSX</a>
                        <a href="#js-panel" className="mdl-tabs__tab">JS</a>
                        <a href="#close-panel" className="mdl-tabs__tab is-active">X</a>
                    </div>
                    <div className="mdl-tabs__panel" id="html-panel">
                        <code className="pane-content">
                            {'<dl className="dl-horizontal">\n'}
                            {'    <dt>Dataset</dt>\n'}
                            {'    <dd>\n'}
                            {'        <Wj.ComboBox\n'}
                            {'            itemsSource={ this.props.dataSets }\n'}
                            {'            displayMemberPath="name"\n'}
                            {'            selectedValuePath="value"\n'}
                            {'            textChanged={ this.dataSetChanged }>\n'}
                            {'        </Wj.ComboBox>\n'}
                            {'    </dd>\n'}
                            {'    <dt>Row totals</dt>\n'}
                            {'    <dd>\n'}
                            {'        <Wj.ComboBox\n'}
                            {'            itemsSource={ Util.getEnumNames(wijmo.olap.ShowTotals) }\n'}
                            {'            text={ wijmo.olap.ShowTotals[this.props.engine.showRowTotals] }\n'}
                            {'            textChanged={ this.showRowTotalsChanged }>\n'}
                            {'        </Wj.ComboBox>\n'}
                            {'    </dd>\n'}
                            {'    <dt>Column totals</dt>\n'}
                            {'    <dd>\n'}
                            {'        <Wj.ComboBox\n'}
                            {'            itemsSource={ Util.getEnumNames(wijmo.olap.ShowTotals) }\n'}
                            {'            text={ wijmo.olap.ShowTotals[this.props.engine.showColumnTotals] }\n'}
                            {'            textChanged={ this.showColumnTotalsChanged }>\n'}
                            {'        </Wj.ComboBox>\n'}
                            {'    </dd>\n'}
                            {'    <dt>Show Zeros</dt>\n'}
                            {'    <dd>\n'}
                            {'        <input type="checkbox" onChange={ this.showZerosChanged }/>\n'}
                            {'    </dd>\n'}
                            {'    <dt>Totals Before Data</dt>\n'}
                            {'    <dd>\n'}
                            {'        <input type="checkbox" onChange={ this.totalsBeforeDataChanged }/>\n'}
                            {'    </dd>\n'}
                            {'</dl>'}
                        </code>
                    </div>
                    <div className="mdl-tabs__panel" id="js-panel">
                        <code className="pane-content">
                            {'// event handlers\n'}
                            {'dataSetChanged: function (s, e) {\n'}
                            {'    this.props.engine.itemsSource = s.selectedValue;\n'}
                            {'},\n'}
                            {'showRowTotalsChanged: function (s, e) {\n'}
                            {'    this.props.engine.showRowTotals = s.text;\n'}
                            {'},\n'}
                            {'showColumnTotalsChanged: function (s, e) {\n'}
                            {'    this.props.engine.showColumnTotals = s.text;\n'}
                            {'},\n'}
                            {'totalsBeforeDataChanged: function (e) {\n'}
                            {'    this.props.engine.totalsBeforeData = e.target.checked;\n'}
                            {'},\n'}
                            {'showZerosChanged: function (e) {\n'}
                            {'    this.props.engine.showZeros = e.target.checked;\n'}
                            {'}'}
                        </code>
                    </div>
                    <div className="mdl-tabs__panel" id="close-panel">
                    </div>
                </div>
            </div>
        </div>;
    }
});
