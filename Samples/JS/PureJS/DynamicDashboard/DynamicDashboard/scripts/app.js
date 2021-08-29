onload = function() {

    // initialize combo box
    var tileTypes = 'Grid,Radial Gauge,Linear Gauge,Bar Chart,Column Chart,Line Chart,Bubble Chart,Blank'.split(',')
    var theCombo = new wijmo.input.ComboBox('#theCombo', {
        itemsSource: tileTypes
    });

    // some random data to show in tiles
    var data = getData();

    // allow user to reorder items in the dashboard by dragging
    var dashboard = document.querySelector('.dashboard');
    enableItemReorder(dashboard);

    // add some tiles to start with
    for (var i = 0; i < tileTypes.length && i < 4; i++) {
        addTile(tileTypes[i]);
    }

    // add tiles when user clicks the "add tile" button
    document.getElementById('theButton').addEventListener('click', function (e) {
        addTile(theCombo.text);
    });

    // handle tile buttons
    dashboard.addEventListener('click', function (e) {
        if (wijmo.closest(e.target, '.glyphicon-remove') != null) {
            var tile = wijmo.closest(e.target, '.tile');
            if (tile != null) {
                dashboard.removeChild(tile);
            }
        }
        if (wijmo.closest(e.target, '.glyphicon-pencil') != null) {
            var tile = wijmo.closest(e.target, '.tile');
            if (tile != null) {
                alert('edit tile parameters...')
            }
        }
    });

    // add a tile of a given type to the dashboard
    function addTile(tileType) {

        // get the html fragment for a new tile
        var htmlTile = wijmo.httpRequest('./partials/tile.htm', { async: false }).responseText,
            htmlContent = wijmo.httpRequest('./partials/' + tileType.replace(' ', '') + '.htm', { async: false }).responseText;

        // initialize tile header and content
        htmlTile = htmlTile.replace('{{header}}', tileType);
        htmlTile = htmlTile.replace('{{content}}', htmlContent);

        // create tile
        var tile = wijmo.createElement(htmlTile);
        compile(tile);

        // append it to the dashboard
        dashboard.appendChild(tile);
        tile.focus();
    }

    // create controls within the tile 
    // (normally done with a framework/template tool, but we want plain JS here)
    function compile(tile) {
        var hosts = tile.querySelectorAll('[props]');
        for (var i = 0; i < hosts.length; i++) {

            // get host element and initial properties
            var host = hosts[i],
                props = JSON.parse(host.getAttribute('props'));

            // replace templates
            for (var k in props) {
                var val = props[k];
                if (wijmo.isString(val) && val.match(/^\{\{.*?\}\}$/)) {
                    var lastItem = data.items[data.items.length - 1];
                    switch (val.substr(2, val.length - 4)) {
                        case 'data':
                            props[k] = data;
                            break;
                        case 'lastItem.profit':
                            props[k] = lastItem.profit;
                            break;
                        case 'lastItem.sales':
                            props[k] = lastItem.sales;
                            break;
                        case 'lastItem.expenses':
                            props[k] = lastItem.sales;
                            break;
                        default:
                            alert('oops?');
                            break;
                    }
                    
                }
            }

            // set display style since we're using custom tags
            host.style.display = 'block';

            // create and initialize the control
            switch (host.tagName) {
                case 'WJ-FLEX-GRID':
                    new wijmo.grid.FlexGrid(host, props);
                    break;
                case 'WJ-FLEX-CHART':
                    new wijmo.chart.FlexChart(host, props);
                    break;
                case 'WJ-LINEAR-GAUGE':
                    new wijmo.gauge.LinearGauge(host, props);
                    break;
                case 'WJ-RADIAL-GAUGE':
                    new wijmo.gauge.RadialGauge(host, props);
                    break;
            }
        }
    }

    // allow users to re-order elements within a panel element
    function enableItemReorder(panel) {
        var dragSource = null,
            dropTarget = null;

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
                e.stopPropagation();
                e.stopImmediatePropagation();
                e.preventDefault();
                var srcIndex = getIndex(dragSource),
                    dstIndex = getIndex(dropTarget),
                    refChild = srcIndex > dstIndex ? dropTarget : dropTarget.nextElementSibling;
                dragSource.parentElement.insertBefore(dragSource, refChild);

                // focus and view on the tile that was dragged
                dragSource.focus();

                // invalidate Wijmo controls after layout updates
                wijmo.Control.invalidateAll();
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
                if (p.children[i] == e) return i;
            }
            return -1;
        }
    }

    // some random data
    function getData() {
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
        }
        return new wijmo.collections.CollectionView(data);
    }
}
