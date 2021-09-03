var wijmo;
(function (wijmo) {
    var olap;
    (function (olap) {
        'use strict';
        /**
         * Represents a tree of @see:_PivotField objects.
         *
         * This class is used only for optimization. It reduces the number of
         * @see:_PivotKey objects that have to be created while aggregating the
         * data.
         *
         * The optimization cuts the time required to summarize the data
         * to about half.
         */
        var _PivotNode = (function () {
            /**
             * Initializes a new instance of the @see:PivotNode class.
             *
             * @param fields @see:PivotFieldCollection that owns this node.
             * @param fieldCount Number of fields to take into account for this node.
             * @param valueFields @see:PivotFieldCollection that contains the values for this node.
             * @param valueFieldIndex Index of the value to take into account for this node.
             * @param item First data item represented by this node.
             * @param parent Parent @see:_PivotField.
             */
            function _PivotNode(fields, fieldCount, valueFields, valueFieldIndex, item, parent) {
                this._key = new olap._PivotKey(fields, fieldCount, valueFields, valueFieldIndex, item);
                this._nodes = {};
                this._parent = parent;
            }
            /**
             * Gets a child node from a parent node.
             *
             * @param fields @see:PivotFieldCollection that owns this node.
             * @param fieldCount Number of fields to take into account for this node.
             * @param valueFields @see:PivotFieldCollection that contains the values for this node.
             * @param valueFieldIndex Index of the value to take into account for this node.
             * @param item First data item represented by this node.
             */
            _PivotNode.prototype.getNode = function (fields, fieldCount, valueFields, valueFieldIndex, item) {
                var nd = this;
                for (var i = 0; i < fieldCount; i++) {
                    var key = fields[i]._getValue(item, true), child = nd._nodes[key];
                    if (!child) {
                        child = new _PivotNode(fields, i + 1, valueFields, valueFieldIndex, item, nd);
                        nd._nodes[key] = child;
                    }
                    nd = child;
                }
                if (valueFields && valueFieldIndex > -1) {
                    var key = valueFields[valueFieldIndex].header, child = nd._nodes[key];
                    if (!child) {
                        child = new _PivotNode(fields, fieldCount, valueFields, valueFieldIndex, item, nd);
                        nd._nodes[key] = child;
                    }
                    nd = child;
                }
                return nd;
            };
            Object.defineProperty(_PivotNode.prototype, "key", {
                /**
                 * Gets the @see:_PivotKey represented by this @see:_PivotNode.
                 */
                get: function () {
                    return this._key;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PivotNode.prototype, "parent", {
                /**
                 * Gets the parent node of this node.
                 */
                get: function () {
                    return this._parent;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(_PivotNode.prototype, "tree", {
                /**
                 * Gets the child items of this node.
                 */
                get: function () {
                    if (!this._tree) {
                        this._tree = new _PivotNode(null, 0, null, -1, null);
                    }
                    return this._tree;
                },
                enumerable: true,
                configurable: true
            });
            return _PivotNode;
        }());
        olap._PivotNode = _PivotNode;
    })(olap = wijmo.olap || (wijmo.olap = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_PivotNode.js.map