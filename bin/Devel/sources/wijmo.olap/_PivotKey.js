var wijmo;
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        /**
         * Represents a combination of @see:PivotField objects and their values.
         *
         * Each row and column on the output view is defined by a unique @see:PivotKey.
         * The values in the output cells represent an aggregation of the value field
         * for all items that match the row and column keys.
         *
         * For example, if a column key is set to 'Country:UK;Customer:Joe' and
         * the row key is set to 'Category:Desserts;Product:Pie', then the corresponding
         * cell contains the aggregate for all items with the following properties:
         *
         * <pre>{ Country: 'UK', Customer: 'Joe' ;Category: 'Desserts' ;Product: 'Pie' };</pre>
         */
        var _PivotKey = (function () {
            /**
             * Initializes a new instance of the @see:PivotKey class.
             *
             * @param fields @see:PivotFieldCollection that owns this key.
             * @param fieldCount Number of fields to take into account for this key.
             * @param valueFields @see:PivotFieldCollection that contains the values for this key.
             * @param valueFieldIndex Index of the value to take into account for this key.
             * @param item First data item represented by this key.
             */
            function _PivotKey(fields, fieldCount, valueFields, valueFieldIndex, item) {
                this._fields = fields;
                this._fieldCount = fieldCount;
                if (fieldCount < 0) {
                    var xx = 123;
                }
                this._valueFields = valueFields;
                this._valueFieldIndex = valueFieldIndex;
                this._item = item;
            }
            Object.defineProperty(_PivotKey.prototype, "fields", {
                /**
                 * Gets the @see:PivotFieldCollection that owns this key.
                 */
                get: function () {
                    return this._fields;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PivotKey.prototype, "valueFields", {
                /**
                 * Gets the @see:PivotFieldCollection that contains the values for this key.
                 */
                get: function () {
                    return this._valueFields;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PivotKey.prototype, "values", {
                /**
                 * Gets an array with the values used to create this key.
                 */
                get: function () {
                    if (this._vals == null) {
                        this._vals = new Array(this._fieldCount);
                        for (var i = 0; i < this._fieldCount; i++) {
                            var fld = this._fields[i];
                            this._vals[i] = fld._getValue(this._item, false);
                        }
                    }
                    return this._vals;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PivotKey.prototype, "aggregate", {
                /**
                 * Gets the type of aggregate represented by this key.
                 */
                get: function () {
                    var vf = this._valueFields, idx = this._valueFieldIndex;
                    wijmo.assert(vf && idx > -1 && idx < vf.length, 'aggregate not available for this key');
                    return vf[idx].aggregate;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Gets the value for this key at a given index.
             *
             * @param index Index of the field to be retrieved.
             * @param formatted Whether to return a formatted string or the raw value.
             */
            _PivotKey.prototype.getValue = function (index, formatted) {
                if (this.values.length == 0) {
                    return wijmo.culture.olap.PivotEngine.grandTotal;
                }
                if (index > this.values.length - 1) {
                    return wijmo.culture.olap.PivotEngine.subTotal;
                }
                var val = this.values[index];
                if (formatted && !wijmo.isString(val)) {
                    val = wijmo.Globalize.format(this.values[index], this.fields[index].format);
                }
                return val;
            };
            /**
             * Comparer function used to sort arrays of @see:_PivotKey objects.
             *
             * @param key @see:_PivotKey to compare to this one.
             */
            _PivotKey.prototype.compareTo = function (key) {
                var cmp = 0;
                if (key != null && key._fields == this._fields) {
                    // compare values
                    var vals = this.values, kvals = key.values, count = Math.min(vals.length, kvals.length);
                    for (var i = 0; i < count; i++) {
                        // get types and value to compare
                        var type = vals[i] != null ? wijmo.getType(vals[i]) : null, ic1 = vals[i], ic2 = kvals[i];
                        // Dates are hard because the format used may affect the sort order: 
                        // for example, 'MMMM' shows only months, so the year should not be taken into account when sorting.
                        if (type == wijmo.DataType.Date) {
                            var fld = this._fields[i], fmt = fld.format;
                            if (fmt && fmt != 'd' && fmt != 'D') {
                                var s1 = fld._getValue(this._item, true), s2 = fld._getValue(key._item, true), d1 = wijmo.Globalize.parseDate(s1, fmt), d2 = wijmo.Globalize.parseDate(s2, fmt);
                                if (d1 && d2) {
                                    ic1 = d1;
                                    ic2 = d2;
                                }
                                else {
                                    ic1 = s1;
                                    ic2 = s2;
                                }
                            }
                        }
                        // different values? we're done! (careful when comparing dates: TFS 190950)
                        var equal = (ic1 == ic2) || wijmo.DateTime.equals(ic1, ic2);
                        if (!equal) {
                            if (ic1 == null)
                                return +1; // can't compare nulls to non-nulls:
                            if (ic2 == null)
                                return -1; // show nulls at the bottom!
                            cmp = ic1 < ic2 ? -1 : +1;
                            return this._fields[i].descending ? -cmp : cmp;
                        }
                    }
                    // compare value fields by index
                    // for example, if this view has two value fields "Sales" and "Downloads",
                    // then order the value fields by their position in the Values list.
                    if (vals.length == kvals.length) {
                        cmp = this._valueFieldIndex - key._valueFieldIndex;
                        if (cmp != 0) {
                            return cmp;
                        }
                    }
                    // all values match, compare key length 
                    // (so subtotals come at the bottom)
                    cmp = kvals.length - vals.length;
                    if (cmp != 0) {
                        return cmp * (this.fields.engine.totalsBeforeData ? -1 : +1);
                    }
                }
                // keys are the same
                return 0;
            };
            /**
             * Gets a value that determines whether a given data object matches
             * this @see:_PivotKey.
             *
             * The match is determined by comparing the formatted values for each
             * @see:PivotField in the key to the formatted values in the given item.
             * Therefore, matches may occur even if the raw values are different.
             *
             * @param item Item to check for a match.
             */
            _PivotKey.prototype.matchesItem = function (item) {
                for (var i = 0; i < this._vals.length; i++) {
                    var s1 = this.getValue(i, true), s2 = this._fields[i]._getValue(item, true);
                    if (s1 != s2) {
                        return false;
                    }
                }
                return true;
            };
            // overridden to return a unique string for the key
            _PivotKey.prototype.toString = function () {
                if (!this._key) {
                    var key = '';
                    // save pivot fields
                    for (var i = 0; i < this._fieldCount; i++) {
                        var pf = this._fields[i];
                        key += pf._getName() + ':' + pf._getValue(this._item, true) + ';';
                    }
                    // save value field
                    if (this._valueFields) {
                        var vf = this._valueFields[this._valueFieldIndex];
                        key += vf._getName() + ':0;';
                    }
                    else {
                        key += '{total}';
                    }
                    // cache the key
                    this._key = key;
                }
                return this._key;
            };
            // name of the output field that contains the row's pivot key
            _PivotKey._ROW_KEY_NAME = '$rowKey';
            return _PivotKey;
        }());
        olap._PivotKey = _PivotKey;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_PivotKey.js.map