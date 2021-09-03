module wijmo.olap {
    'use strict';

    /**
     * Represents a collection of @see:PivotField objects.
     */
    export class PivotFieldCollection extends collections.ObservableArray {
        private _ng: PivotEngine;
        private _maxItems: number;

        /**
         * Initializes a new instance of the @see:PivotFieldCollection class.
         *
         * @param engine @see:PivotEngine that owns this @see:PivotFieldCollection.
         */
        constructor(engine: PivotEngine) {
            super();
            this._ng = engine;
        }

        //** object model

        /**
         * Gets or sets the maximum number of fields allowed in this collection.
         *
         * This property is set to null by default, which means any number of items is allowed.
         */
        get maxItems(): number {
            return this._maxItems;
        }
        set maxItems(value: number) {
            this._maxItems = asInt(value, true, true);
        }
        /**
         * Gets a reference to the @see:PivotEngine that owns this @see:PivotFieldCollection.
         */
        get engine(): PivotEngine {
            return this._ng;
        }
        /**
         * Gets a field by header.
         *
         * @param header Header string to look for.
         */
        getField(header: string): PivotField {
            for (var i = 0; i < this.length; i++) {
                if (this[i].header == header) {
                    return this[i];
                }
            }
            return null;
        }
        /**
         * Overridden to allow pushing fields by header.
         *
         * @param ...item One or more @see:PivotField objects to add to the array.
         * @return The new length of the array.
         */
        push(...item: any[]): number {
            var ng = this._ng;

            // loop through items adding them one by one
            for (var i = 0; item && i < item.length; i++) {
                var fld = item[i];

                // add fields by binding
                if (isString(fld)) {
                    fld = this == ng.fields
                        ? new PivotField(ng, fld)
                        : ng.fields.getField(fld);
                }

                // should be a field now...
                assert(fld instanceof PivotField, 'This collection must contain PivotField objects only.');

                // headers must be unique
                if (this.getField(fld.header)) {
                    assert(false, 'field headers must be unique.');
                    return -1;
                }

                // honor maxitems
                if (this._maxItems != null && this.length >= this._maxItems) {
                    break;
                }

                // add to collection
                super.push(fld);
            }

            // done
            return this.length;
        }
    }
}