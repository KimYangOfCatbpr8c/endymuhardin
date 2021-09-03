var wijmo;
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        /**
         * Represents a property of the items in the wijmo.olap data source.
         */
        var PivotField = (function () {
            /**
             * Initializes a new instance of the @see:PivotField class.
             *
             * @param engine @see:PivotEngine that owns this field.
             * @param binding Property that this field is bound to.
             * @param header Header shown to identify this field (defaults to the binding).
             * @param options JavaScript object containing initialization data for the field.
             */
            function PivotField(engine, binding, header, options) {
                /**
                 * Occurs when the value of a property in this @see:Range changes.
                 */
                this.propertyChanged = new wijmo.Event();
                this._ng = engine;
                this._binding = new wijmo.Binding(binding);
                this._header = header ? header : wijmo.toHeaderCase(binding);
                this._aggregate = wijmo.Aggregate.Sum;
                this._showAs = olap.ShowAs.NoCalculation;
                this._isContentHtml = false;
                this._format = '';
                this._filter = new olap.PivotFilter(this);
                if (options) {
                    wijmo.copy(this, options);
                }
            }
            Object.defineProperty(PivotField.prototype, "binding", {
                // ** object model
                /**
                 * Gets or sets the name of the property the field is bound to.
                 */
                get: function () {
                    return this._binding ? this._binding.path : null;
                },
                set: function (value) {
                    if (value != this.binding) {
                        var oldValue = this.binding, path = wijmo.asString(value);
                        this._binding = path ? new wijmo.Binding(path) : null;
                        if (!this._dataType && this._ng && this._binding) {
                            var cv = this._ng.collectionView;
                            if (cv && cv.sourceCollection && cv.sourceCollection.length) {
                                var item = cv.sourceCollection[0];
                                this._dataType = wijmo.getType(this._binding.getValue(item));
                            }
                        }
                        var e = new wijmo.PropertyChangedEventArgs('binding', oldValue, value);
                        this.onPropertyChanged(e);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "header", {
                /**
                 * Gets or sets a string used to represent this field in the user interface.
                 */
                get: function () {
                    return this._header;
                },
                set: function (value) {
                    value = wijmo.asString(value, false);
                    var fld = this._ng.fields.getField(value);
                    if (!value || (fld && fld != this)) {
                        wijmo.assert(false, 'field headers must be unique and non-empty.');
                    }
                    else {
                        this._setProp('_header', wijmo.asString(value));
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "filter", {
                /**
                 * Gets a reference to the @see:PivotFilter used to filter values for this field.
                 */
                get: function () {
                    return this._filter;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "aggregate", {
                /**
                 * Gets or sets how the field should be summarized.
                 */
                get: function () {
                    return this._aggregate;
                },
                set: function (value) {
                    this._setProp('_aggregate', wijmo.asEnum(value, wijmo.Aggregate));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "showAs", {
                /**
                 * Gets or sets how the field results should be formatted.
                 */
                get: function () {
                    return this._showAs;
                },
                set: function (value) {
                    this._setProp('_showAs', wijmo.asEnum(value, olap.ShowAs));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "weightField", {
                /**
                 * Gets or sets the @see:PivotField used as a weight for calculating
                 * aggregates on this field.
                 *
                 * If this property is set to null, all values are assumed to have weight one.
                 *
                 * This property allows you to calculate weighted averages and totals.
                 * For example, if the data contains a 'Quantity' field and a 'Price' field,
                 * you could use the 'Price' field as a value field and the 'Quantity' field as
                 * a weight. The output would contain a weighted average of the data.
                 */
                get: function () {
                    return this._weightField;
                },
                set: function (value) {
                    this._setProp('_weightField', wijmo.asType(value, PivotField, true));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "dataType", {
                /**
                 * Gets or sets the data type of the field.
                 */
                get: function () {
                    return this._dataType;
                },
                set: function (value) {
                    this._setProp('_dataType', wijmo.asEnum(value, wijmo.DataType));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "format", {
                /**
                 * Gets or sets the format to use when displaying field values.
                 */
                get: function () {
                    return this._format;
                },
                set: function (value) {
                    this._setProp('_format', wijmo.asString(value));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "width", {
                /**
                 * Gets or sets the preferred width to be used for showing this field in the
                 * user interface.
                 */
                get: function () {
                    return this._width;
                },
                set: function (value) {
                    this._setProp('_width', wijmo.asNumber(value, true, true));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "wordWrap", {
                /**
                 * Gets or sets a value that indicates whether the content of this field should
                 * be allowed to wrap within cells.
                 */
                get: function () {
                    return this._wordWrap;
                },
                set: function (value) {
                    this._setProp('_wordWrap', wijmo.asBoolean(value));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "descending", {
                /**
                 * Gets or sets a value that determines whether keys should be sorted
                 * in descending order for this field.
                 */
                get: function () {
                    return this._descending ? true : false;
                },
                set: function (value) {
                    this._setProp('_descending', wijmo.asBoolean(value));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "isContentHtml", {
                /**
                 * Gets or sets a value indicating whether items in this field
                 * contain HTML content rather than plain text.
                 */
                get: function () {
                    return this._isContentHtml;
                },
                set: function (value) {
                    this._setProp('_isContentHtml', wijmo.asBoolean(value));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "engine", {
                /**
                 * Gets a reference to the @see:PivotEngine that owns this @see:PivotField.
                 */
                get: function () {
                    return this._ng;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "collectionView", {
                /**
                 * Gets the @see:ICollectionView bound to this field.
                 */
                get: function () {
                    return this.engine ? this.engine.collectionView : null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "isActive", {
                /**
                 * Gets or sets a value that determines whether this field is
                 * currently being used in the view.
                 *
                 * Setting this property to true causes the field to be added to the
                 * view's @see:PivotEngine.rowFields or @see:PivotEngine.valueFields,
                 * depending on the field's data type.
                 */
                get: function () {
                    if (this._ng) {
                        var lists = this._ng._viewLists;
                        for (var i = 0; i < lists.length; i++) {
                            var list = lists[i];
                            for (var j = 0; j < list.length; j++) {
                                if (list[j].binding == this.binding) {
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                },
                set: function (value) {
                    if (this._ng) {
                        var isActive = this.isActive;
                        value = wijmo.asBoolean(value);
                        if (value != isActive) {
                            if (value) {
                                // add numbers to values, others to row fields
                                if (this.dataType == wijmo.DataType.Number) {
                                    this._ng.valueFields.push(this);
                                }
                                else {
                                    this._ng.rowFields.push(this);
                                }
                            }
                            else {
                                // remove field and copies from all view lists (by binding)
                                var lists = this._ng._viewLists;
                                for (var i = 0; i < lists.length; i++) {
                                    var list = lists[i];
                                    for (var f = 0; f < list.length; f++) {
                                        var fld = list[f];
                                        if (fld == this || fld.parentField == this) {
                                            list.removeAt(f);
                                            f--;
                                        }
                                    }
                                }
                                // remove any copies from main list
                                var list = this._ng.fields;
                                for (var f = list.length - 1; f >= 0; f--) {
                                    var fld = list[f];
                                    if (fld.parentField == this) {
                                        list.removeAt(f);
                                        f--;
                                    }
                                }
                            }
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PivotField.prototype, "parentField", {
                /**
                 * Gets this field's parent field.
                 *
                 * When you drag the same field into the Values list multiple
                 * times, copies of the field are created so you can use the
                 * same binding with different parameters. The copies keep a
                 * reference to their parent fields.
                 */
                get: function () {
                    return this._parent;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Raises the @see:propertyChanged event.
             *
             * @param e @see:PropertyChangedEventArgs that contains the property
             * name, old, and new values.
             */
            PivotField.prototype.onPropertyChanged = function (e) {
                this.propertyChanged.raise(this, e);
                this._ng._fieldPropertyChanged(this, e);
            };
            // ** implementation
            // creates a clone with the same binding/properties and a unique header
            PivotField.prototype._clone = function () {
                // create clone
                var clone = new PivotField(this._ng, this.binding);
                this._ng._copyProps(clone, this, PivotField._props);
                clone._autoGenerated = true;
                clone._parent = this;
                // give it a unique header
                var hdr = this.header.replace(/\d+$/, '');
                for (var i = 2;; i++) {
                    var hdrn = hdr + i.toString();
                    if (this._ng.fields.getField(hdrn) == null) {
                        clone._header = hdrn;
                        break;
                    }
                }
                // done
                return clone;
            };
            // sets property value and notifies about the change
            PivotField.prototype._setProp = function (name, value, member) {
                var oldValue = this[name];
                if (value != oldValue) {
                    this[name] = value;
                    var e = new wijmo.PropertyChangedEventArgs(name.substr(1), oldValue, value);
                    this.onPropertyChanged(e);
                }
            };
            // get field name (used for display)
            PivotField.prototype._getName = function () {
                return this.header || this.binding;
            };
            // get field value
            PivotField.prototype._getValue = function (item, formatted) {
                var value = this._binding._key
                    ? item[this._binding._key] // optimization
                    : this._binding.getValue(item);
                return !formatted || typeof (value) == 'string' // optimization
                    ? value
                    : wijmo.Globalize.format(value, this._format);
            };
            // get field weight
            PivotField.prototype._getWeight = function (item) {
                var value = this._weightField ? this._weightField._getValue(item, false) : null;
                return wijmo.isNumber(value) ? value : null;
            };
            // serializable properties
            PivotField._props = [
                'dataType',
                'format',
                'width',
                'wordWrap',
                'aggregate',
                'showAs',
                'descending',
                'isContentHtml'
            ];
            return PivotField;
        }());
        olap.PivotField = PivotField;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=PivotField.js.map