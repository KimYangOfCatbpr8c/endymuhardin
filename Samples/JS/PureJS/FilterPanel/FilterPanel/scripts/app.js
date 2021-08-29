onload = function () {

    // create some data
    var countries = 'Spain,Portugal,England,France,Ireland'.split(',');
    var data = [];
    for (var i = 0; i < 100; i++) {
        data.push({
            id: i,
            active: i % 2 == 0,
            country: countries[i % countries.length],
            name: 'Item ' + i,
            date: new Date(),
        });
    }

    // create the grid
    var grid = new wijmo.grid.FlexGrid('#grid', {
        itemsSource: data
    });

    // create the filter
    var filter = new wijmo.grid.filter.FlexGridFilter(grid);

    // create the filter panel
    var filterPanel = new wijmo.grid.filter.FilterPanel('#filterPanel', {
        filter: filter,
        placeholder: 'Active Filters'
    });
}