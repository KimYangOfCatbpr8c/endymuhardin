declare var React: any;

var GroupPanel = React.createClass({
    getInitialState: function () {
        return {
            view: new wijmo.collections.CollectionView(Util.getData())
        }
    },

    // connect GroupPanel to FlexGrid when the component mounts
    componentDidMount: function () {
        var grid = wijmo.Control.getControl(document.getElementById('theGrid')) as wijmo.grid.FlexGrid;
        var panel = wijmo.Control.getControl(document.getElementById('thePanel')) as wijmo.grid.grouppanel.GroupPanel;
        panel.grid = grid;
    },

    render: function () {
        return <div>
            <h2>
                GroupPanel
            </h2>
            <p>
                Use the <b>Wj.GroupPanel</b> component to implement a UI for drag/drop
                grouping. It provides a drag/drop surface, so users can create and modify
                the groups dynamically:
            </p>
            <div className="row">
                <div className="col-md-6">
                    <ul className="nav nav-tabs" role="tablist">
                        <li className="active"><a href="#gp2Jsx" role="tab" data-toggle="tab">JSX</a></li>
                        <li><a href="#gp2Js" role="tab" data-toggle="tab">JS</a></li>
                    </ul>
                    <div className="tab-content">
                        <div className="tab-pane active pane-content" id="gp2Jsx">
                            {'<Wj.GroupPanel\n'}
                            {'   id="thePanel"\n'}
                            {'   placeholder="Drag columns here to create Groups" />\n'}
                            {'<Wj.FlexGrid\n'}
                            {'   id="theGrid"\n'}
                            {'   itemsSource={this.state.view} />'}
                        </div>
                        <div className="tab-pane pane-content" id="gp2Js">
                            {'var GroupPanel = React.createClass({\n'}
                            {'    getInitialState: function () {\n'}
                            {'        return {\n'}
                            {'            view: new wijmo.collections.CollectionView(Util.getData())\n'}
                            {'        \}\n'}
                            {'    \},\n'}
                            {'\n'}
                            {'    // connect GroupPanel to FlexGrid when the component mounts\n'}
                            {'    componentDidMount: function () {\n'}
                            {'      var grid = wijmo.Control.getControl(document.getElementById(\'theGrid\')) as wijmo.grid.FlexGrid;\n'}
                            {'      var panel = wijmo.Control.getControl(document.getElementById(\'thePanel\')) as wijmo.grid.grouppanel.GroupPanel;\n'}
                            {'      panel.grid = grid;\n'}
                            {'    \}\n'}
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <h4>Result (live):</h4>
                    <Wj.GroupPanel
                        id="thePanel"
                        placeholder="Drag columns here to create Groups"/>
                    <Wj.FlexGrid
                        id="theGrid"
                        itemsSource={ this.state.view }/>
                </div>
            </div>
        </div>;
    }
});
