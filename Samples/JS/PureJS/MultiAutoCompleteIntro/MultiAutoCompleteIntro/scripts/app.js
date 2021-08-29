onload = function () {
    'use strict';

    var countries = [
        'Afghanistan', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antigua', 'Argentina', 'Armenia',
        'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize',
        'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bonaire', 'Bosnia', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
        'Cambodia', 'Cameroon', 'Canada', 'Canary Islands', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Channel Islands',
        'Chile', 'China', 'Christmas Island', 'Cocos Island', 'Colombia', 'Comoros', 'Congo', 'Cook Islands', 'Costa Rica', "Cote D'Ivoire",
        'Croatia', 'Cuba', 'Curacao', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador',
        'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland',
        'France', 'French Guiana', 'French Polynesia', 'French Southern Ter', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar',
        'Great Britain', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guinea', 'Guyana', 'Haiti', 'Honduras',
        'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan',
        'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea North', 'Korea South', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho',
        'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malaysia', 'Malawi', 'Maldives',
        'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Midway Islands', 'Moldova', 'Monaco',
        'Mongolia', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar', 'Nambia', 'Nauru', 'Nepal', 'Netherland Antilles', 'Netherlands', 'Nevis',
        'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Norway', 'Oman', 'Pakistan', 'Palau Island',
        'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn Island', 'Poland', 'Portugal', 'Puerto Rico',
        'Qatar', 'Republic of Montenegro', 'Republic of Serbia', 'Reunion', 'Romania', 'Russia', 'Rwanda', 'St Barthelemy', 'St Eustatius',
        'St Helena', 'St Kitts-Nevis', 'St Lucia', 'St Maarten', 'Saipan', 'Samoa', 'Samoa American', 'San Marino', 'Saudi Arabia', 'Scotland',
        'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa',
        'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Tahiti', 'Taiwan', 'Tajikistan', 'Tanzania',
        'Thailand', 'Togo', 'Tokelau', 'Tonga', 'Trinidad Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks & Caicos Is', 'Tuvalu', 'Uganda',
        'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States of America', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City State',
        'Venezuela', 'Vietnam', 'Virgin Islands (British)', 'Virgin Islands (USA)', 'Wake Island', 'Yemen', 'Zaire', 'Zambia', 'Zimbabwe'
    ]

    // MultiAutoComplete with a string array as itemsSource
    var mac1 = new wijmo.input.MultiAutoComplete('#mac1');
    var macSelectedItems1 = document.querySelector('#macSelectedItems1');
    mac1.itemsSource = countries;
    mac1.placeholder = 'Country';
    mac1.selectedItemsChanged.addHandler(function () {
        displaySelectedItems(mac1, macSelectedItems1);
    });
    mac1.maxSelectedItems = 4;
    mac1.selectedItems = ['Belgium', 'Chile'];

    // MultiAutoComplete with a CollectionView as itemsSource
    var items = [];
    for (var i = 0; i < countries.length; i++) {
        var c = countries[i];
        items.push({
            id: i,
            country: c,
            selected: i < 3 // select three first items by default
        });
    }
    items = new wijmo.collections.CollectionView(items);

    var mac2 = new wijmo.input.MultiAutoComplete('#mac2');
    var macSelectedItems2 = document.querySelector('#macSelectedItems2');
    mac2.itemsSource = items;
    mac2.displayMemberPath = 'country';
    mac2.placeholder = 'Country';
    mac2.selectedItemsChanged.addHandler(function () {
        displaySelectedItems(mac2, macSelectedItems2);
    });
    mac2.selectedMemberPath = 'selected';

    // MultiAutoComplete with a custom data source function that
    // retrieves information about fortune 500 companies using a web service
    var cache = {};
    function getCompanies(query, max, callback) {

        // try getting the result from the cache
        var result = cache[query];
        if (result) {
            callback(result);
            return;
        }

        // not in cache, get from server
        var params = { query: query, max: max };
        wijmo.httpRequest('companycatalog.ashx', {
            data: params,
            success: function (xhr) {
                var response = JSON.parse(xhr.responseText)

                // add 'SymbolName' property to result
                var items = [];
                for (var i = 0; i < response.length; i++) {
                    var c = response[i];
                    c.SymbolName = c.Symbol + ': ' + c.Name;
                }

                // store result in cache
                cache[query] = response;

                // and return the result
                callback(response);
            },
            error: function (xhr) {
                console.log('error: ' + xhr.responseText);
                cache[query] = null; // << no point in trying this query again
                callback(null);
            }
        });
    }

    // start service so there's no delay when the user starts typing
    wijmo.httpRequest('companycatalog.ashx', {
        data: { query: 'start', max: 0 }
    });

    var mac3 = new wijmo.input.MultiAutoComplete('#mac3');
    var macSelectedItems3 = document.querySelector('#macSelectedItems3');
    mac3.itemsSourceFunction = getCompanies;
    mac3.displayMemberPath = 'SymbolName';
    mac3.placeholder = 'Company name';
    mac3.selectedItemsChanged.addHandler(function () {
        displaySelectedItems(mac3, macSelectedItems3);
    });

    function displaySelectedItems(multiAutoComplete, macSelectedItems) {
        var displayItems = '';
        if (multiAutoComplete.selectedItems.length > 0) {
            for (var i = 0; i < multiAutoComplete.selectedItems.length; i++) {
                displayItems += '<li>' + JSON.stringify(multiAutoComplete.selectedItems[i]) + '</li>'
            }
            macSelectedItems.innerHTML = displayItems;
        } else {
            macSelectedItems.innerHTML = '';
        }
    }
}