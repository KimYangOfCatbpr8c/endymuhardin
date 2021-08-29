// generate some random data
var countries = 'US,Germany,UK,Japan,Italy,Greece'.split(','),
    appData = [], funnelData = [], boxPlotterData = [], sales = 10000;

for (var i = 0; i < countries.length; i++) {
    appData.push({
        country: countries[i],
        downloads: Math.round(Math.random() * 20000),
        sales: Math.random() * 10000,
        expenses: Math.random() * 5000
    });

    funnelData.push({
        country: countries[i],
        sales: sales
    });

    boxPlotterData.push({
        country: countries[i],
        downloads: [getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData()],
        sales: [getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData()],
        expenses: [getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData(), getData()]
    });

    sales = sales - Math.round(Math.random() * 2000);
}

function getData() {
    return Math.round(Math.random() * 100);
}