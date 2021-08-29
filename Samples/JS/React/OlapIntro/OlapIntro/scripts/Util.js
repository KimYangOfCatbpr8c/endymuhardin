var Util;
(function (Util) {
    // gets a random integer between zero and max
    function randomInt(max) {
        return Math.floor(Math.random() * (max + 1));
    }
    // gets a simple data set for basic demos
    function getSimpleDataSet(cnt) {
        var dtOct = new Date(2015, 9, 1), dtDec = new Date(2015, 11, 1), data = [
            { product: 'Wijmo', country: 'USA', sales: 10, downloads: 100, date: dtOct, active: true },
            { product: 'Wijmo', country: 'Japan', sales: 10, downloads: 100, date: dtOct, active: false },
            { product: 'Aoba', country: 'USA', sales: 10, downloads: 100, date: dtDec, active: true },
            { product: 'Aoba', country: 'Japan', sales: 10, downloads: 100, date: dtDec, active: false }
        ];
        for (var i = 0; i < cnt - 4; i++) {
            data.push({
                product: randomInt(1) ? 'Wijmo' : 'Aoba',
                country: randomInt(1) ? 'USA' : 'Japan',
                active: i % 2 == 0,
                date: new Date(2015 + randomInt(2), randomInt(11), randomInt(27) + 1),
                sales: 10 + randomInt(20),
                downloads: 10 + randomInt(190)
            });
        }
        return new wijmo.collections.CollectionView(data);
    }
    Util.getSimpleDataSet = getSimpleDataSet;
    // gets a slightly more complex data set for more advanced demos
    function getDataSet(cnt) {
        var countries = 'US,Germany,UK,Japan,Italy,Greece,Spain,Portugal'.split(','), products = 'Wijmo,Aoba,Xuni,Olap'.split(','), data = [];
        for (var i = 0; i < cnt; i++) {
            data.push({
                id: i,
                product: products[randomInt(products.length - 1)],
                country: countries[randomInt(countries.length - 1)],
                date: new Date(2015 + randomInt(2), randomInt(11), randomInt(27) + 1),
                sales: randomInt(10000),
                downloads: randomInt(10000),
                active: randomInt(1) ? true : false,
                discount: Math.random()
            });
        }
        return new wijmo.collections.CollectionView(data);
    }
    Util.getDataSet = getDataSet;
    // get Northwind data (these are not very good sources for this demo, but are so easy to get...)
    function getNorthwindOrders() {
        var url = 'http://services.odata.org/V4/Northwind/Northwind.svc/';
        return new wijmo.odata.ODataCollectionView(url, 'Order_Details_Extendeds');
    }
    Util.getNorthwindOrders = getNorthwindOrders;
    function getNorthwindSales() {
        var url = 'http://services.odata.org/V4/Northwind/Northwind.svc/';
        return new wijmo.odata.ODataCollectionView(url, 'Product_Sales_for_1997');
    }
    Util.getNorthwindSales = getNorthwindSales;
    // save/load/transpose/export views
    function transposeView(ng) {
        ng.deferUpdate(function () {
            // save row/col fields
            var rows = [], cols = [];
            for (var r = 0; r < ng.rowFields.length; r++) {
                rows.push(ng.rowFields[r].header);
            }
            for (var c = 0; c < ng.columnFields.length; c++) {
                cols.push(ng.columnFields[c].header);
            }
            // clear row/col fields
            ng.rowFields.clear();
            ng.columnFields.clear();
            // restore row/col fields in transposed order
            for (var r = 0; r < rows.length; r++) {
                ng.columnFields.push(rows[r]);
            }
            for (var c = 0; c < cols.length; c++) {
                ng.rowFields.push(cols[c]);
            }
        });
    }
    Util.transposeView = transposeView;
    // build a title for the current view
    function getViewTitle(ng) {
        var title = '';
        for (var i = 0; i < ng.valueFields.length; i++) {
            if (i > 0)
                title += ', ';
            title += ng.valueFields[i].header;
        }
        title += ' by ';
        if (ng.rowFields.length) {
            for (var i = 0; i < ng.rowFields.length; i++) {
                if (i > 0)
                    title += ', ';
                title += ng.rowFields[i].header;
            }
        }
        if (ng.rowFields.length && ng.columnFields.length) {
            title += ' and by ';
        }
        if (ng.columnFields.length) {
            for (var i = 0; i < ng.columnFields.length; i++) {
                if (i > 0)
                    title += ', ';
                title += ng.columnFields[i].header;
            }
        }
        return title;
    }
    Util.getViewTitle = getViewTitle;
    // adds a title cell into an xlxs sheet
    function addTitleCell(sheet, title) {
        // create cell
        var cell = new wijmo.xlsx.WorkbookCell();
        cell.value = title;
        cell.style = new wijmo.xlsx.WorkbookStyle();
        cell.style.font = new wijmo.xlsx.WorkbookFont();
        cell.style.font.bold = true;
        // create row to hold the cell
        var row = new wijmo.xlsx.WorkbookRow();
        row.cells[0] = cell;
        // and add the new row to the sheet
        sheet.rows.splice(0, 0, row);
    }
    Util.addTitleCell = addTitleCell;
    // gets an array with the names of an enumeration
    function getEnumNames(enumClass) {
        var names = [];
        for (var key in enumClass) {
            var val = parseInt(key);
            if (isNaN(val))
                names.push(key);
        }
        return names;
    }
    Util.getEnumNames = getEnumNames;
})(Util || (Util = {}));
//# sourceMappingURL=Util.js.map