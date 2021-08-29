var Tile = React.createClass({
    remove: function () {
        this.props.remove(this.props.index);
    },
    render: function () {
        return React.createElement("div", {className: "tile", draggable: "true"}, 
            React.createElement("div", {style: { borderBottom: '1px solid #e0e0e0', padding: '4px', display: 'flex', cursor: 'move' }}, 
                React.createElement("div", {style: { flexGrow: 1, color: '#005c9c', fontWeight: 'bold' }}, this.props.header), 
                React.createElement("div", {className: "buttons"}, 
                    React.createElement("span", {className: "glyphicon glyphicon-pencil", title: "Edit Tile"}), 
                    React.createElement("span", {className: "glyphicon glyphicon-remove", title: "Close Tile", onClick: this.remove}))), 
            React.createElement("div", {style: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}, 
                React.createElement("div", null, this.props.content)
            ));
    }
});
//# sourceMappingURL=Tile.js.map