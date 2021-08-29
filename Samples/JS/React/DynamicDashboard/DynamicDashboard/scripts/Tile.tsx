declare var React: any;

var Tile = React.createClass({
    remove: function () {
        this.props.remove(this.props.index)
    },

    render: function () {
        return <div className="tile" draggable="true">
            <div style={
                { borderBottom: '1px solid #e0e0e0', padding: '4px', display: 'flex', cursor: 'move' }}>
                <div style={{ flexGrow:1, color: '#005c9c', fontWeight: 'bold' }}>
                    { this.props.header }
                </div>
                <div className="buttons">
                    <span className="glyphicon glyphicon-pencil" title="Edit Tile"></span>
                    <span className="glyphicon glyphicon-remove" title="Close Tile" onClick={ this.remove }></span>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
                <div>{ this.props.content }</div>
            </div>
        </div>
    }
});