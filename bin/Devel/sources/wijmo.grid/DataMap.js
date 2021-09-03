var wijmo;
(function (wijmo) {
    var grid;
    (function (grid) {
        'use strict';
        /**
         * Represents a data map for use with a column's @see:Column.dataMap property.
         *
         * Data maps provide the grid with automatic look up capabilities. For example,
         * you may want to display a customer name instead of his ID, or a color name
         * instead of its RGB value.
         *
         * The code below binds a grid to a collection of products, then assigns a
         * @see:DataMap to the grid's 'CategoryID' column so the grid displays the
         * category names rather than the raw IDs.
         *
         * The grid takes advantage of data maps also for editing. If the <b>wijmo.input</b>
         * module is loaded, then when editing data-mapped columns the grid will show
         * a drop-down list containing the values on the map.
         *
         * <pre>
         * // bind grid to products
         * var flex = new wijmo.grid.FlexGrid();
         * flex.itemsSource = products;
         * // map CategoryID column to show category name instead of ID
         * var col = flex.columns.getColumn('CategoryID');
         * col.dataMap = new wijmo.grid.DataMap(categories, 'CategoryID', 'CategoryName');
         * </pre>
         *
         * In general, data maps apply to whole columns. However, there are situations
         * where you may want to restrict the options available for a cell based on a
         * value on a different column. For example, if you have "Country" and "City"
         * columns, you will probably want to restrict the cities based on the current
         * country.
         *
         * There are two ways you can implement these "dynamic" data maps:
         *
         * <ol>
         *   <li>
         *     If the @see:DataMap is just a list of strings, you can change it before
         *     the grid enters edit mode. In this case, the cells contain the string
         *     being displayed, and changing the map won't affect other cells in the
         *     same column.
         *     This fiddle demonstrates:
         *     <a href="http://jsfiddle.net/Wijmo5/8brL80r8/">show me</a>.
         *   </li>
         *   <li>
         *     If the @see:DataMap is a real map (stores key values in the cells, shows
         *     a corresponding string), then you can apply a filter to restrict the
         *     values shown in the drop-down. The @see:DataMap will still contain the
         *     same keys and values, so other cells in the same column won't be disturbed
         *     by the filter.
         *     This fiddle demonstrates:
         *     <a href="http://jsfiddle.net/Wijmo5/xborLd4t/">show me</a>.
         *   </li>
         * </ol>
         */
        var DataMap = (function () {
            /**
             * Initializes a new instance of the @see:DataMap class.
             *
             * @param itemsSource An array or @see:ICollectionView that contains the items to map.
             * @param selectedValuePath The name of the property that contains the keys (data values).
             * @param displayMemberPath The name of the property to use as the visual representation of the items.
             */
            function DataMap(itemsSource, selectedValuePath, displayMemberPath) {
                /**
                 * Occurs when the map data changes.
                 */
                this.mapChanged = new wijmo.Event();
                // turn arrays into real maps
                if (wijmo.isArray(itemsSource) && !selectedValuePath && !displayMemberPath) {
                    var arr = [];
                    for (var i = 0; i < itemsSource.length; i++) {
                        arr.push({ value: itemsSource[i] });
                    }
                    itemsSource = arr;
                    selectedValuePath = displayMemberPath = 'value';
                }
                // initialize map
                this._cv = wijmo.asCollectionView(itemsSource);
                this._keyPath = wijmo.asString(selectedValuePath, false);
                this._displayPath = wijmo.asString(displayMemberPath, false);
                // notify listeners when the map changes
                this._cv.collectionChanged.addHandler(this.onMapChanged, this);
            }
            Object.defineProperty(DataMap.prototype, "sortByDisplayValues", {
                /**
                 * Gets or sets a value that determines whether to use mapped (display)
                 * or raw values when sorting the data.
                 */
                get: function () {
                    return this._sortByKey != true;
                },
                set: function (value) {
                    this._sortByKey = !wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataMap.prototype, "collectionView", {
                /**
                 * Gets the @see:ICollectionView object that contains the map data.
                 */
                get: function () {
                    return this._cv;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataMap.prototype, "selectedValuePath", {
                /**
                 * Gets the name of the property to use as a key for the item (data value).
                 */
                get: function () {
                    return this._keyPath;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataMap.prototype, "displayMemberPath", {
                /**
                 * Gets the name of the property to use as the visual representation of the item.
                 */
                get: function () {
                    return this._displayPath;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Gets the key that corresponds to a given display value.
             *
             * @param displayValue The display value of the item to retrieve.
             */
            DataMap.prototype.getKeyValue = function (displayValue) {
                var index = this._indexOf(displayValue, this._displayPath, false);
                return index > -1 ? this._cv.sourceCollection[index][this._keyPath] : null; //displayValue;
            };
            /**
             * Gets the display value that corresponds to a given key.
             *
             * @param key The key of the item to retrieve.
             */
            DataMap.prototype.getDisplayValue = function (key) {
                var index = this._indexOf(key, this._keyPath, true);
                return index > -1 ? this._cv.sourceCollection[index][this._displayPath] : key;
            };
            /**
             * Gets an array with all of the display values on the map.
             *
             * @param dataItem Data item for which to get the display items.
             * This parameter is optional. If not provided, all possible display
             * values should be returned.
             */
            DataMap.prototype.getDisplayValues = function (dataItem) {
                var values = [];
                if (this._cv && this._displayPath) {
                    var items = this._cv.items; // << list filtered/sorted values
                    for (var i = 0; i < items.length; i++) {
                        values.push(items[i][this._displayPath]);
                    }
                }
                return values;
            };
            /**
             * Gets an array with all of the keys on the map.
             */
            DataMap.prototype.getKeyValues = function () {
                var values = [];
                if (this._cv && this._keyPath) {
                    var items = this._cv.items; // << list filtered/sorted values
                    for (var i = 0; i < items.length; i++) {
                        values.push(items[i][this._keyPath]);
                    }
                }
                return values;
            };
            Object.defineProperty(DataMap.prototype, "isEditable", {
                /**
                 * Gets or sets a value that indicates whether users should be allowed to enter
                 * values that are not present on the @see:DataMap.
                 *
                 * In order for a @see:DataMap to be editable, the @see:selectedValuePath and
                 * @see:displayMemberPath must be set to the same value.
                 */
                get: function () {
                    return this._editable;
                },
                set: function (value) {
                    this._editable = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the @see:mapChanged event.
             */
            DataMap.prototype.onMapChanged = function (e) {
                this.mapChanged.raise(this, e);
            };
            // implementation
            // gets the index of a value in the sourceCollection (not the view)
            DataMap.prototype._indexOf = function (value, path, caseSensitive) {
                if (this._cv && path) {
                    var sval = value != null ? value.toString() : '', lcval = caseSensitive ? sval : sval.toLowerCase();
                    // look for items
                    var items = this._cv.sourceCollection;
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i][path];
                        // straight comparison
                        if (item == value) {
                            return i;
                        }
                        // case-insensitive comparison
                        if (!caseSensitive && item.length == lcval.length && item.toLowerCase() == lcval) {
                            return i;
                        }
                        // string-based comparison (like JS objects) 140577
                        if (item != null && item.toString() == sval) {
                            return i;
                        }
                    }
                }
                return -1;
            };
            return DataMap;
        }());
        grid.DataMap = DataMap;
    })(grid = wijmo.grid || (wijmo.grid = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=DataMap.js.map