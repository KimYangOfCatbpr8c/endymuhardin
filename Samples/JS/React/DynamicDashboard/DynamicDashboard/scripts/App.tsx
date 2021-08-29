declare var React: any;

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
        var tiles = [],
            key = 0;
        for (var i = 0; i < 4; i++) {
            tiles.push({ name: tileCatalog[i].name, key: key++ });
        }

        // generate some data to show in the tiles
        var data = [],
            today = new Date();
        for (var i = 0; i < 12; i++) {
            var sales = 100 + Math.random() * 800 + i * 50,
                expenses = 50 + Math.random() * 300 + i * 5;
            data.push({
                id: i,
                date: wijmo.DateTime.addMonths(today, 12 - i),
                sales: sales,
                expenses: expenses,
                profit: sales - expenses
            });
        };

        // this is our app state
        return {
            tileCatalog: new wijmo.collections.CollectionView(tileCatalog), // tiles types available
            tiles: tiles, // tiles in the dashboard
            key: key, // unique key for the next tile
            data: new wijmo.collections.CollectionView(data) // data shown in the tiles
        }
    },

    // gets a tile content by name
    getTileContent(name: string) {
        var arr = this.state.tileCatalog.items;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].name == name) {
                return React.createElement(arr[i].tile, { data: this.state.data })
            }
        }
        throw '*** tile not found: ' + name;
    },

    // adds a tile to the dashboard
    addTile: function (): void {
        var tiles = this.state.tiles.slice(),
            key = this.state.key + 1;
        tiles.push({ name: this.state.tileCatalog.currentItem.name, key: key });
        this.setState({ tiles: tiles, key: key });
    },

    // removes a tile from the dashboard
    removeTile: function (tileIndex) {
        var tiles = this.state.tiles.filter((item, index) => {
            return index != tileIndex;
        });
        this.setState({ tiles: tiles });
    },

    // initialize component after it has been mounted
    componentDidMount() {

        // enable tile drag/drop
        var panel = document.querySelector('.dashboard');
        this.enableItemReorder(panel);

        // update all tiles on sort (since last item changes)
        this.state.data.collectionChanged.addHandler(() => {
            this.forceUpdate();
        });
    },
    componentWillUnmount() {
        this.state.data.collectionChanged.removeAllHandlers();
    },

    // allow users to re-order elements within a panel element
    // we work with the DOM elements and update the state when done.
    enableItemReorder(panel) {
        var dragSource = null,
            dropTarget = null;

        // add drag/drop event listeners
        panel.addEventListener('dragstart', (e) => {
            var target = wijmo.closest(e.target, '.tile');
            if (target && target.parentElement == panel) {
                dragSource = target;
                wijmo.addClass(dragSource, 'drag-source');
                var dt = e.dataTransfer;
                dt.effectAllowed = 'move';
                dt.setData('text', dragSource.innerHTML);
            }
        });
        panel.addEventListener('dragover', (e) => {
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
        panel.addEventListener('drop', (e) => {
            if (dragSource && dropTarget) {

                // finish drag/drop
                e.stopPropagation();
                e.stopImmediatePropagation();
                e.preventDefault();

                // re-order HTML elements (optional here, we're updating the state later)
                var srcIndex = getIndex(dragSource),
                    dstIndex = getIndex(dropTarget),
                    refChild = srcIndex > dstIndex ? dropTarget : dropTarget.nextElementSibling;
                dragSource.parentElement.insertBefore(dragSource, refChild);

                // focus and view on the tile that was dragged
                dragSource.focus();

                // update state
                var tiles = this.state.tiles.slice();
                tiles.splice(srcIndex, 1);
                tiles.splice(dstIndex, 0, this.state.tiles[srcIndex]);
                this.setState({ tiles: tiles });
            }
        });
        panel.addEventListener('dragend', (e) =>  {
            wijmo.removeClass(dragSource, 'drag-source');
            wijmo.removeClass(dropTarget, 'drag-over');
            dragSource = dropTarget = null;
        });

        function getIndex(e) {
            var p = e.parentElement;
            for (var i = 0; i < p.children.length; i++) {
                if (p.children[i] == e) return i;
            }
            return -1;
        }
    },

    // render the dashboard
    render: function () {
        var data = this.state.data;
        return <div>
            <div className="header">
                <div className="container">
                    <img src="resources/wijmo5.png" alt="Wijmo 5" />
                    <h1>
                        Dynamic Dashboard (React)
                    </h1>
                    <p>
                        Create and customize dashboards with Wijmo controls.
                    </p>
                </div>
            </div>
            <div className="container">

                <p>
                    Start by selecting a tile type , then click the button to add the new tile
                    to the dashboard.</p>
                <p>
                    Use the mouse to drag tiles to new positions, or click the close button
                    at the top-right corner of each tile to remove the tile from the dashboard.</p>

                <div className="container row">
                    <label>
                        Select a tile type: {' '}
                        <Wj.ComboBox
                            itemsSource={this.state.tileCatalog}
                            displayMemberPath="name" />{' '}
                        <button
                            className="btn btn-primary"
                            onClick={this.addTile} >
                            Add Tile to Dashboard
                        </button>
                    </label>
                </div>

                <hr />

                <div className="dashboard">
                    {
                        this.state.tiles.map((item, index) => {
                            return <Tile
                                header={item.name}
                                content={this.getTileContent(item.name)}
                                remove={this.removeTile}
                                index={index}
                                key={item.key} />;
                        })
                    }
                </div>
            </div>
        </div>;
    }
});
