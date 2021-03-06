"use strict";
/**
 * Represents a publicly traded company.
 * The class contains the company name, ticker symbol, price history,
 * and the color used to represent the company in the UI.
 */
var Company = (function () {
    function Company(symbol) {
        this.prices = [];
        this.events = [];
        this.symbol = symbol;
        this.color = Company._palette[Company._ctr % Company._palette.length];
        Company._ctr++;
    }
    Company._palette = [
        // Google
        '#FFA500', '#FFA500', '#DC3912', '#109618', '#990099', '#3B3EAC', '#0099C6',
        '#DD4477', '#66AA00', '#B82E2E', '#316395', '#994499', '#22AA99', '#AAAA11',
        '#6633CC', '#E67300', '#8B0707', '#329262', '#5574A6', '#3B3EAC', '#000000',
        // Office
        '#FFBE00', '#94D752', '#00B652', '#00B6EF', '#0075C6', '#002263', '#73359C',
        '#B53D9C', '#BD3D6B', '#AD65BD', '#DE6D33', '#FFB638', '#CE6DA5', '#FF8E38',
        '#525D6B', '#FF8633', '#739ADE', '#B52B15', '#F7CF2B', '#ADBAD6', '#737D84',
        '#424452', '#737DA5', '#9CBACE', '#D6DB7B', '#FFDB7B', '#BD8673', '#8C726B',
        '#424C22', '#A5B694', '#F7A642', '#E7BE2B', '#D692A5', '#9C86C6', '#849EC6',
        '#4A2215', '#3892A5', '#FFBA00', '#C62B2B', '#84AA33', '#944200', '#42598C',
        '#383838', '#6BA2B5', '#CEAE00', '#8C8AA5', '#738663', '#9C9273', '#7B868C',
        '#15487B', '#4A82BD', '#C6504A', '#9CBA5A', '#8465A5', '#4AAEC6', '#F79642',
        '#6B656B', '#CEBA63', '#9CB284', '#6BB2CE', '#6386CE', '#7B69CE', '#A578BD',
        '#332E33', '#F77D00', '#382733', '#15597B', '#4A8642', '#63487B', '#C69A5A',
        '#636984', '#D6604A', '#CEB600', '#28AEAD', '#8C7873', '#8CB28C', '#0E924A' // Civic
    ];
    Company._ctr = 0;
    return Company;
}());
exports.Company = Company;
//# sourceMappingURL=Company.js.map