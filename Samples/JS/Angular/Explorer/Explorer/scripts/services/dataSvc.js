'use strict';

// defines functions that can be called from controllers and directives
angular.module('app').factory('dataSvc', function () {

    // data used to generate random items
    var countries = ['US', 'Germany', 'UK', 'Japan', 'Italy', 'Greece'];//, 'France', 'Austria', 'Canada', 'Denmark' ];
    var products = ['Widget', 'Gadget', 'Doohickey'];
    var colors = ['Black', 'White', 'Red', 'Green', 'Blue'];//, 'Yellow', 'Orange', 'Brown'];

    return {

        // get possible values for each field
        getCountries: function() {
            return countries;
        },
        getProducts: function() {
            return products;
        },
        getColors: function() {
            return colors;
        },

        // get matches for a search term
        getData: function (count, unique) {
            var data = [];
            var dt = new Date();

            // if unique items, limit to number of countries
            if (unique == true) {
                count = countries.length;
            }

            // add count items
            for (var i = 0; i < count; i++) {

                // constants used to create data items
                var date = new Date(dt.getFullYear(), i % 12, 25, i % 24, i % 60, i % 60),
                    countryId = unique == true ? i : Math.floor(Math.random() * countries.length),
                    productId = Math.floor(Math.random() * products.length),
                    colorId = Math.floor(Math.random() * colors.length);

                // create the item
                var item = {
                    id: i,
                    start: date,
                    end: date,
                    country: countries[countryId],
                    product: products[productId],
                    color: colors[colorId],
                    countryId: countryId,
                    productId: productId,
                    colorId: colorId,
                    amount: Math.random() * 10000 - 5000,
                    amount2: Math.random() * 10000 - 5000,
                    discount: Math.random() / 4,
                    active: i % 4 == 0,
                };

                // add an array (should not auto-bind)
                item.sales = [];
                for (var j = 0; j < 12; j++) {
                    item.sales.push(50 + 20 * (Math.random() - .5) + j);
                }

                // add an object (should not auto-bind)
                item.someObject = {
                    name: i,
                    value: i
                };

                // add lots of columns to test virtualization
                if (false) {
                    for (var j = 0; j < 400; j++) {
                        item['x' + j] = j;
                    }
                }

                // add the item to the list
                data.push(item);
            }

            // return a CollectionView so multiple controls bound to this source
            // will be updated automatically (TFS 145538)
            return new wijmo.collections.CollectionView(data);
        },
        getHierarchicalData: function() {
            var data = [],
                times = [['Jan', 'Feb', 'Mar'], ['Apr', 'May', 'June'], ['Jul', 'Aug', 'Sep'], ['Oct', 'Nov', 'Dec']],
                years = [], year = new Date().getFullYear(), yearLen, i, quarterAdded = false;

            yearLen = Math.max(Math.round(Math.abs(5 - Math.random() * 10)), 3);
            for (var i = yearLen; i > 0; i--) {
                years.push(year - i);
            }
            // populate itemsSource
            //years.forEach((y, i) => {
            for (var i = 0; i < years.length; i++) {
                var y=years[i],
                    addQuarter = Math.random() > 0.5;
                if (!quarterAdded && i === years.length - 1) {
                    //ensure add at least one quarter.
                    addQuarter = true;
                }
                var year = {
                    year: y.toString(),
                };
                if (addQuarter) {
                    var quarters = [];
                    quarterAdded = true;
                    //times.forEach((q, idx) => {
                    for (var idx = 0; idx < times.length; idx++) {
                            var q = times[idx],
                                addMonth = Math.random() > 0.5,
                            quarter = {
                                quarter: 'Q' + (idx + 1)
                            };

                        if (addMonth) {
                            var months = [];
                            for (var j = 0; j < q.length; j++) {
                                //q.forEach(m => {
                                var m = q[j];
                                months.push({
                                    month: m,
                                    value: Math.round(Math.random() * 100)
                                });
                            };
                            quarter.items = months;
                        } else {
                            quarter.value = Math.round(Math.random() * 400);
                        }
                        quarters.push(quarter);
                    };
                    year.items = quarters;
                } else {
                    year.value = Math.round(Math.random() * 1200)
                }
                data.push(year);
            };

            return data;
        },

        getFbChartData: function () {
        return [
            { "date": "01/05/15", "open": 77.98, "high": 79.25, "low": 76.86, "close": 77.19, "volume": 26452191 },
            { "date": "01/06/15", "open": 77.23, "high": 77.59, "low": 75.36, "close": 76.15, "volume": 27399288 },
            { "date": "01/07/15", "open": 76.76, "high": 77.36, "low": 75.82, "close": 76.15, "volume": 22045333 },
            { "date": "01/08/15", "open": 76.74, "high": 78.23, "low": 76.08, "close": 78.18, "volume": 23960953 },
            { "date": "01/09/15", "open": 78.2, "high": 78.62, "low": 77.2, "close": 77.74, "volume": 21157007 },
            { "date": "01/12/15", "open": 77.84, "high": 78, "low": 76.21, "close": 76.72, "volume": 19190194 },
            { "date": "01/13/15", "open": 77.23, "high": 78.08, "low": 75.85, "close": 76.45, "volume": 25179561 },
            { "date": "01/14/15", "open": 76.42, "high": 77.2, "low": 76.03, "close": 76.28, "volume": 25918564 },
            { "date": "01/15/15", "open": 76.4, "high": 76.57, "low": 73.54, "close": 74.05, "volume": 34133974 },
            { "date": "01/16/15", "open": 74.04, "high": 75.32, "low": 73.84, "close": 75.18, "volume": 21791529 },
            { "date": "01/20/15", "open": 75.72, "high": 76.31, "low": 74.82, "close": 76.24, "volume": 22821614 },
            { "date": "01/21/15", "open": 76.16, "high": 77.3, "low": 75.85, "close": 76.74, "volume": 25096737 },
            { "date": "01/22/15", "open": 77.17, "high": 77.75, "low": 76.68, "close": 77.65, "volume": 19519458 },
            { "date": "01/23/15", "open": 77.65, "high": 78.19, "low": 77.04, "close": 77.83, "volume": 16746503 },
            { "date": "01/26/15", "open": 77.98, "high": 78.47, "low": 77.29, "close": 77.5, "volume": 19260820 },
            { "date": "01/27/15", "open": 76.71, "high": 76.88, "low": 75.63, "close": 75.78, "volume": 20109977 },
            { "date": "01/28/15", "open": 76.9, "high": 77.64, "low": 76, "close": 76.24, "volume": 53306422 },
            { "date": "01/29/15", "open": 76.85, "high": 78.02, "low": 74.21, "close": 78, "volume": 61293468 },
            { "date": "01/30/15", "open": 78, "high": 78.16, "low": 75.75, "close": 75.91, "volume": 42649491 },
            { "date": "02/02/15", "open": 76.11, "high": 76.14, "low": 73.75, "close": 74.99, "volume": 41955258 },
            { "date": "02/03/15", "open": 75.19, "high": 75.58, "low": 73.86, "close": 75.4, "volume": 26957714 },
            { "date": "02/04/15", "open": 75.09, "high": 76.35, "low": 75.01, "close": 75.63, "volume": 20277368 },
            { "date": "02/05/15", "open": 75.71, "high": 75.98, "low": 75.21, "close": 75.62, "volume": 15062573 },
            { "date": "02/06/15", "open": 75.68, "high": 75.7, "low": 74.25, "close": 74.47, "volume": 21210994 },
            { "date": "02/09/15", "open": 74.05, "high": 74.83, "low": 73.45, "close": 74.44, "volume": 16194322 },
            { "date": "02/10/15", "open": 74.85, "high": 75.34, "low": 74.5, "close": 75.19, "volume": 15811344 },
            { "date": "02/11/15", "open": 75.09, "high": 76.75, "low": 75.03, "close": 76.51, "volume": 20877427 },
            { "date": "02/12/15", "open": 76.86, "high": 76.87, "low": 75.89, "close": 76.23, "volume": 17234976 },
            { "date": "02/13/15", "open": 76.46, "high": 76.48, "low": 75.5, "close": 75.74, "volume": 18621860 },
            { "date": "02/17/15", "open": 75.3, "high": 76.91, "low": 75.08, "close": 75.6, "volume": 25254400 },
            { "date": "02/18/15", "open": 75.94, "high": 76.9, "low": 75.45, "close": 76.71, "volume": 22426421 },
            { "date": "02/19/15", "open": 76.99, "high": 79.84, "low": 76.95, "close": 79.42, "volume": 45851177 },
            { "date": "02/20/15", "open": 79.55, "high": 80.34, "low": 79.2, "close": 79.9, "volume": 36931698 },
            { "date": "02/23/15", "open": 79.96, "high": 80.19, "low": 78.38, "close": 78.84, "volume": 24139056 },
            { "date": "02/24/15", "open": 78.5, "high": 79.48, "low": 78.1, "close": 78.45, "volume": 18897133 },
            { "date": "02/25/15", "open": 78.5, "high": 80.2, "low": 78.5, "close": 79.56, "volume": 25593800 },
            { "date": "02/26/15", "open": 79.88, "high": 81.37, "low": 79.72, "close": 80.41, "volume": 31111891 },
            { "date": "02/27/15", "open": 80.68, "high": 81.23, "low": 78.62, "close": 78.97, "volume": 30739197 },
            { "date": "03/02/15", "open": 79, "high": 79.86, "low": 78.52, "close": 79.75, "volume": 21662537 },
            { "date": "03/03/15", "open": 79.61, "high": 79.7, "low": 78.52, "close": 79.6, "volume": 18634973 },
            { "date": "03/04/15", "open": 79.3, "high": 81.15, "low": 78.85, "close": 80.9, "volume": 28126686 },
            { "date": "03/05/15", "open": 81.23, "high": 81.99, "low": 81.05, "close": 81.21, "volume": 27825733 },
            { "date": "03/06/15", "open": 80.9, "high": 81.33, "low": 79.83, "close": 80, "volume": 24488581 },
            { "date": "03/09/15", "open": 79.68, "high": 79.91, "low": 78.63, "close": 79.44, "volume": 18925097 },
            { "date": "03/10/15", "open": 78.5, "high": 79.26, "low": 77.55, "close": 77.55, "volume": 23067057 },
            { "date": "03/11/15", "open": 77.8, "high": 78.43, "low": 77.26, "close": 77.57, "volume": 20215704 },
            { "date": "03/12/15", "open": 78.1, "high": 79.05, "low": 77.91, "close": 78.93, "volume": 16093319 },
            { "date": "03/13/15", "open": 78.6, "high": 79.38, "low": 77.68, "close": 78.05, "volume": 18557296 },
            { "date": "03/16/15", "open": 77.96, "high": 78.12, "low": 77.36, "close": 78.07, "volume": 19305406 },
            { "date": "03/17/15", "open": 78.36, "high": 79.78, "low": 78.34, "close": 79.36, "volume": 22169969 },
            { "date": "03/18/15", "open": 79.25, "high": 81.24, "low": 79.17, "close": 80.91, "volume": 36912446 },
            { "date": "03/19/15", "open": 81.12, "high": 83, "low": 81, "close": 82.75, "volume": 42099523 },
            { "date": "03/20/15", "open": 83.39, "high": 84.6, "low": 83.07, "close": 83.8, "volume": 44466323 },
            { "date": "03/23/15", "open": 83.92, "high": 84.96, "low": 83.3, "close": 84.43, "volume": 27357333 },
            { "date": "03/24/15", "open": 84.71, "high": 86.07, "low": 84.52, "close": 85.31, "volume": 32576522 },
            { "date": "03/25/15", "open": 85.5, "high": 85.52, "low": 82.92, "close": 82.92, "volume": 37436147 },
            { "date": "03/26/15", "open": 82.72, "high": 83.77, "low": 82.14, "close": 83.01, "volume": 32794800 },
            { "date": "03/27/15", "open": 83.38, "high": 83.95, "low": 82.88, "close": 83.3, "volume": 18372582 },
            { "date": "03/30/15", "open": 83.81, "high": 84.34, "low": 82.41, "close": 83.2, "volume": 24527686 },
            { "date": "03/31/15", "open": 82.9, "high": 83.5, "low": 82.21, "close": 82.22, "volume": 19734277 },
            { "date": "04/01/15", "open": 82.5, "high": 82.72, "low": 80.87, "close": 81.66, "volume": 22058167 },
            { "date": "04/02/15", "open": 82.25, "high": 82.56, "low": 81.44, "close": 81.56, "volume": 19664053 },
            { "date": "04/06/15", "open": 80.8, "high": 82.81, "low": 80.8, "close": 82.44, "volume": 19062934 },
            { "date": "04/07/15", "open": 82.65, "high": 83.42, "low": 82.22, "close": 82.32, "volume": 17467042 },
            { "date": "04/08/15", "open": 82.63, "high": 83.1, "low": 81.84, "close": 82.28, "volume": 18966732 },
            { "date": "04/09/15", "open": 82.5, "high": 82.8, "low": 81.71, "close": 82.17, "volume": 15927281 },
            { "date": "04/10/15", "open": 82.21, "high": 82.61, "low": 81.91, "close": 82.04, "volume": 12529738 },
            { "date": "04/13/15", "open": 81.93, "high": 83.94, "low": 81.92, "close": 83.01, "volume": 26883100 },
            { "date": "04/14/15", "open": 83.17, "high": 83.69, "low": 82.44, "close": 83.52, "volume": 19634200 },
            { "date": "04/15/15", "open": 83.55, "high": 83.66, "low": 82.27, "close": 82.71, "volume": 22390900 },
            { "date": "04/16/15", "open": 82.47, "high": 83.07, "low": 82.15, "close": 82.31, "volume": 13769700 },
            { "date": "04/17/15", "open": 81.48, "high": 82.11, "low": 80.37, "close": 80.78, "volume": 24076300 },
            { "date": "04/20/15", "open": 81.54, "high": 83.15, "low": 81.24, "close": 83.09, "volume": 28796800 },
            { "date": "04/21/15", "open": 84, "high": 84.49, "low": 83.54, "close": 83.62, "volume": 27171900 },
            { "date": "04/22/15", "open": 84.32, "high": 84.74, "low": 83.65, "close": 84.63, "volume": 45548000 },
            { "date": "04/23/15", "open": 84.1, "high": 85.59, "low": 82.41, "close": 82.41, "volume": 73728100 },
            { "date": "04/24/15", "open": 82.77, "high": 82.94, "low": 81.48, "close": 81.53, "volume": 29660400 },
            { "date": "04/27/15", "open": 81.87, "high": 82.93, "low": 81.63, "close": 81.91, "volume": 25446000 },
            { "date": "04/28/15", "open": 81.83, "high": 81.9, "low": 80.23, "close": 80.68, "volume": 23775300 }
        ];
    }

    }
});
