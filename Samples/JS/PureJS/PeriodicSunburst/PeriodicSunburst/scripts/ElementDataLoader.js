'use strict'; // always use strict mode!

/**
* =============================
*      ElementDataLoader.js
* =============================
*
* This file contains a set of functions for
* loading, parsing, and formatting the data stored
* in data/elements.json so that it can be stored in
* a CollectionView and loaded by the Sunburst chart 
* natively.
*
*/

/** 
* These constants will float up to the global scope
* but we only use them in this file so declare them
* here.
*/

// The file path for the element JSON data
var ELEMENT_DATA_FILE_PATH = 'data/elements.json';

// Arrays named by "Group" containing all of the possible "Subgroup" types
var METAL_TYPES = 'Alkali Metal|Alkaline Earth Metal|Transition Metal|Lanthanide|Actinide|Metal'.split('|');
var NON_METAL_TYPES = 'Noble Gas|Halogen|Nonmetal'.split('|');
var OTHER_TYPES = 'Metalloid|Transactinide'.split('|');

// Separate out the titles that will be on the chart as constants so that they can be
// easily changed as options later
var METALS_TITLE = "Metals";
var NON_METALS_TITLE = "Nonmetals";
var OTHERS_TITLE = "Others";

var WijmoPeriodicSunburst = {};
WijmoPeriodicSunburst.ElementDataLoader = {
    generateElementCollectionView: function (callback) {

        // use httpRequest method to load data from JSON file
        wijmo.httpRequest(ELEMENT_DATA_FILE_PATH, {
            success: function (xhr) {

                // parse the loaded JSON into a variable
                var rawElementData = JSON.parse(xhr.responseText);

                // flatten the resulting raw element data array by removing the ID and "un-nesting" the properties object
                var elementData = rawElementData['periodic-table-elements'].map(function (item) {
                    item.properties.value = 1;
                    return item.properties;
                });

                // initialize a new object from the Wijmo CollectionView function using our "cleansed" array
                var elementCv = new wijmo.collections.CollectionView(elementData);

                // Do the first tier of grouping
                // We'll take advantage of the wijmo.collections.PropertyGroupDescription object to sort elements
                // in the collection view based on which constant array contains their type
                elementCv.groupDescriptions.push(new wijmo.collections.PropertyGroupDescription('type', function (item, prop) {
                    if (METAL_TYPES.indexOf(item[prop]) > -1) {
                        return METALS_TITLE;
                    } else if (NON_METAL_TYPES.indexOf(item[prop]) > -1) {
                        return NON_METALS_TITLE;
                    } else {
                        return OTHERS_TITLE;
                    }
                }));

                // Do the second tier of grouping
                // The only consideration we have to make here is that we don't want to duplicate group names. So if
                // we find another "Metal" or "Nonmetal", we need to prefix it with "Other." Finally, we just want to
                // go ahead and add the appropriate plural ending to make things sound more natural
                elementCv.groupDescriptions.push(new wijmo.collections.PropertyGroupDescription('type', function (item, prop) {
                    var value = item[prop],
                        endsWithS = value.length > 0 && value[value.length - 1] == 's';
                    if (value === METAL_TYPES[METAL_TYPES.length - 1] || value === NON_METAL_TYPES[NON_METAL_TYPES.length - 1]) {
                        return 'Other ' + value + (endsWithS ? 'es' : 's');
                    } else {
                        return value + (endsWithS ? 'es' : 's');
                    }
                }));

                // Descriptions of the different subcategories ordered by the type lists above
                // The metal and nonmetal descriptions have one extra item for the "Others" category
                var METAL_DESCRIPTIONS = 'Shiny,Soft,Highly Reactive,Low Melting Point|Ductile,Malleable,Low Density,High Melting Point|Brittle,Poor Metals,Low Melting Point|High Melting Point,High Density|Soluble,Highly Reactive|Radioactive,Paramagnetic'.split('|');
                var NON_METAL_DESCRIPTIONS = 'Volatile,Low Elasticity,Good Insulators|Colorless,Odorless,Low Chemical Reactivity|Toxic,Highly Reactive,Poor Conductors'.split('|');
                var OTHER_DESCRIPTIONS = 'Metallic looking solids,Semiconductors|Radioactive,Synthetic Elements'.split('|');
                var DESCRIPTION_COLLECTION = [NON_METAL_DESCRIPTIONS, METAL_DESCRIPTIONS, OTHER_DESCRIPTIONS]; // create an array containing all of the element description arrays

                // Assign a new object property to each "subgroup" Object in the CollectionView based on the arrays above
                // This property will be stored in the CollectionView items and can be recalled later for display on the chart
                for (var i = 0; i < elementCv.groups.length; i++) {
                    for (var j = 0; j < elementCv.groups[i].groups.length; j++) {
                        elementCv.groups[i].groups[j].elementProperties = DESCRIPTION_COLLECTION[i][j];
                    }
                }

                callback(elementCv);
            }
        });
    }
};