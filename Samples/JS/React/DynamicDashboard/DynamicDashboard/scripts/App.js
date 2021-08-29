var App = React.createClass({
    // declare tile types and some random data
    getInitialState: function () {
        // tile names and types
        var tileCatalog = [
            { name: 'Grid', tile: Grid },
            { name: 'Radial Gauge', tile: RadialGauge },
            { name: 'Linear Gauge', tile: LinearGauge },
            { name: 'Bar Chart', tile: BarChart },
            { name: 'Column Chart', tile: ColumnChart },
            { name: 'Line Chart', tile: LineChart },
            { name: 'Bubble Chart', tile: BubbleChart },
            { name: 'Bullet Graph', tile: BulletGraph },
            { name: 'Blank', tile: Blank }
        ];
        // tiles currently in use (start with the first four)
        var tiles = [], key = 0;
        for (var i = 0; i < 4; i++) {
            tiles.push({ name: tileCatalog[i].name, key: key++ });
        }
        // generate some data to show in the tiles
        var data = [], today = new Date();
        for (var i = 0; i < 12; i++) {
            var sales = 100 + Math.random() * 800 + i * 50, expenses = 50 + Math.random() * 300 + i * 5;
            data.push({
                id: i,
                date: wijmo.DateTime.addMonths(today, 12 - i),
                sales: sales,
                expenses: expenses,
                profit: sales - expenses
            });
        }
        ;
        // this is our app state
        return {
            tileCatalog: new wijmo.collections.CollectionView(tileCatalog),
            tiles: tiles,
            key: key,
            data: new wijmo.collections.CollectionView(data) // data shown in the tiles
        };
    },
    // gets a tile content by name
    getTileContent: function (name) {
        var arr = this.state.tileCatalog.items;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].name == name) {
                return React.createElement(arr[i].tile, { data: this.state.data });
            }
        }
        throw '*** tile not found: ' + name;
    },
    // adds a tile to the dashboard
    addTile: function () {
        var tiles = this.state.tiles.slice(), key = this.state.key + 1;
        tiles.push({ name: this.state.tileCatalog.currentItem.name, key: key });
        this.setState({ tiles: tiles, key: key });
    },
    // removes a tile from the dashboard
    removeTile: function (tileIndex) {
        var tiles = this.state.tiles.filter(function (item, index) {
            return index != tileIndex;
        });
        this.setState({ tiles: tiles });
    },
    // initialize component after it has been mounted
    componentDidMount: function () {
        var _this = this;
        // enable tile drag/drop
        var panel = document.querySelector('.dashboard');
        this.enableItemReorder(panel);
        // update all tiles on sort (since last item changes)
        this.state.data.collectionChanged.addHandler(function () {
            _this.forceUpdate();
        });
    },
    componentWillUnmount: function () {
        this.state.data.collectionChanged.removeAllHandlers();
    },
    // allow users to re-order elements within a panel element
    // we work with the DOM elements and update the state when done.
    enableItemReorder: function (panel) {
        var _this = this;
        var dragSource = null, dropTarget = null;
        // add drag/drop event listeners
        panel.addEventListener('dragstart', function (e) {
            var target = wijmo.closest(e.target, '.tile');
            if (target && target.parentElement == panel) {
                dragSource = target;
                wijmo.addClass(dragSource, 'drag-source');
                var dt = e.dataTransfer;
                dt.effectAllowed = 'move';
                dt.setData('text', dragSource.innerHTML);
            }
        });
        panel.addEventListener('dragover', function (e) {
            if (dragSource) {
                var tile = wijmo.closest(e.target, '.tile');
                if (tile == dragSource) {
                    tile = null;
                }
                if (dragSource && tile && tile != dragSource) {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                }
                if (dropTarget != tile) {
                    wijmo.removeClass(dropTarget, 'drag-over');
                    dropTarget = tile;
                    wijmo.addClass(dropTarget, 'drag-over');
                }
            }
        });
        panel.addEventListener('drop', function (e) {
            if (dragSource && dropTarget) {
                // finish drag/drop
                e.stopPropagation();
                e.stopImmediatePropagation();
                e.preventDefault();
                // re-order HTML elements (optional here, we're updating the state later)
                var srcIndex = getIndex(dragSource), dstIndex = getIndex(dropTarget), refChild = srcIndex > dstIndex ? dropTarget : dropTarget.nextElementSibling;
                dragSource.parentElement.insertBefore(dragSource, refChild);
                // focus and view on the tile that was dragged
                dragSource.focus();
                // update state
                var tiles = _this.state.tiles.slice();
                tiles.splice(srcIndex, 1);
                tiles.splice(dstIndex, 0, _this.state.tiles[srcIndex]);
                _this.setState({ tiles: tiles });
            }
        });
        panel.addEventListener('dragend', function (e) {
            wijmo.removeClass(dragSource, 'drag-source');
            wijmo.removeClass(dropTarget, 'drag-over');
            dragSource = dropTarget = null;
        });
        function getIndex(e) {
            var p = e.parentElement;
            for (var i = 0; i < p.children.length; i++) {
                if (p.children[i] == e)
                    return i;
            }
            return -1;
        }
    },
    // render the dashboard
    render: function () {
        var _this = this;
        var data = this.state.data;
        return React.createElement("div", null, 
            React.createElement("div", {className: "header"}, 
                React.createElement("div", {className: "container"}, 
                    React.createElement("img", {src: "resources/wijmo5.png", alt: "Wijmo 5"}), 
                    React.createElement("h1", null, "Dynamic Dashboard (React)"), 
                    React.createElement("p", null, "Create and customize dashboards with Wijmo controls."))
            ), 
            React.createElement("div", {className: "container"}, 
                React.createElement("p", null, "Start by selecting a tile type , then click the button to add the new tile" + ' ' + "to the dashboard."), 
                React.createElement("p", null, "Use the mouse to drag tiles to new positions, or click the close button" + ' ' + "at the top-right corner of each tile to remove the tile from the dashboard."), 
                React.createElement("div", {className: "container row"}, 
                    React.createElement("label", null, 
                        "Select a tile type: ", 
                        ' ', 
                        React.createElement(Wj.ComboBox, {itemsSource: this.state.tileCatalog, displayMemberPath: "name"}), 
                        ' ', 
                        React.createElement("button", {className: "btn btn-primary", onClick: this.addTile}, "Add Tile to Dashboard"))
                ), 
                React.createElement("hr", null), 
                React.createElement("div", {className: "dashboard"}, this.state.tiles.map(function (item, index) {
                    return React.createElement(Tile, {header: item.name, content: _this.getTileContent(item.name), remove: _this.removeTile, index: index, key: item.key});
                }))));
    }
});
//# sourceMappingURL=App.js.map