/**
 * Defines the @see:Sunburst chart control and its associated classes.
 */
module wijmo.chart.hierarchical {
    'use strict';

    /**
     * Sunburst chart control.
     */
    export class Sunburst extends FlexPie {

        //conflicts with _bindingName in FlexPie if use _bindingName, so use _bindName instead;
        private _bindName: any;
        private _processedData: any[] = [];
        private _legendLabels: string[] = [];
        private _level: number = 1;
        private _sliceIndex: number = 0;
        private _childItemsPath: any;

        constructor(element: any, options?) {
            super(element, options);

            //add classes to host element
            this._selectionIndex = 0;
            this.applyTemplate('wj-sunburst', null, null);
        }

 /**
         * Gets or sets the name of the property containing name of the data item;
         * it should be an array or a string.
         */
        get bindingName(): any {
            return this._bindName;
        }
        set bindingName(value: any) {
            if (value != this._bindName) {
                assert(value == null || isArray(value) || isString(value), 'bindingName should be an array or a string.');
                this._bindName = value;
                this._bindChart();
            }
        }

        /**
         * Gets or sets the name of the property (or properties) used to generate 
         * child items in hierarchical data.
         *
         * Set this property to a string to specify the name of the property that
         * contains an item's child items (e.g. <code>'items'</code>). 
         * 
         * Set this property to an array containing the names of the properties
         * that contain child items at each level, when the items are child items
         * at different levels with different names 
         * (e.g. <code>[ 'accounts', 'checks', 'earnings' ]</code>).
         */
        get childItemsPath(): any {
            return this._childItemsPath;
        }
        set childItemsPath(value: any) {
            if (value != this._childItemsPath) {
                assert(value == null || isArray(value) || isString(value), 'childItemsPath should be an array or a string.');
                this._childItemsPath = value;
                this._bindChart();
            }
        }

        _initData() {
            super._initData();
            this._processedData = [];
            this._level = 1;
            this._legendLabels = [];
        }

        _performBind() {
            var items, processedData;

            this._initData();

            if (this._cv) {
                //this._selectionIndex = this._cv.currentPosition;
                items = this._cv.items;
                if (items) {
                    this._processedData = HierarchicalUtil.parseDataToHierarchical(items, this.binding, this.bindingName, this.childItemsPath);
                    this._sum = this._calculateValueAndLevel(this._processedData, 1);
                    this._processedData.forEach(v => {
                        this._legendLabels.push(v.name);
                    });
                }
            }
        }

        private _calculateValueAndLevel(arr, level) {
            var sum = 0,
                values = this._values,
                labels = this._labels;

            if (this._level < level) {
                this._level = level;
            }
            arr.forEach(v => {
                var val;
                if (v.items) {
                    val = this._calculateValueAndLevel(v.items, level + 1);
                    v.value = val;
                    values.push(val);
                    labels.push(v.name);
                } else {
                    val = this._getBindData(v, values, labels, 'value', 'name');
                    v.value = val;
                }
                sum += val;
            });
            return sum;
        }

        _renderPie(engine, radius, innerRadius, startAngle, offset) {
            var center = this._getCenter();

            this._sliceIndex = 0;
            this._renderHierarchicalSlices(engine, center.x, center.y, this._processedData, this._sum, radius, innerRadius, startAngle, 2 * Math.PI, offset, 1);
        }

        _renderHierarchicalSlices(engine, cx, cy, values, sum, radius, innerRadius, startAngle, totalSweep, offset, level) {
            var len = values.length,
                angle = startAngle,
                reversed = this.reversed == true,
                r, ir, segment, sweep, value, val, pel, x, y, currentAngle;

            segment = (radius - innerRadius) / this._level;
            r = radius - (this._level - level) * segment;
            ir = innerRadius + (level - 1) * segment;
            for (var i = 0; i < len; i++) {
                x = cx;
                y = cy;
                pel = engine.startGroup('slice-level' + level);
                if (level === 1) {
                    engine.fill = this._getColorLight(i);
                    engine.stroke = this._getColor(i);
                }

                value = values[i];
                val = Math.abs(value.value);
                sweep = Math.abs(val - sum) < 1E-10 ? totalSweep : totalSweep * val / sum;
                currentAngle = reversed ? angle - 0.5 * sweep : angle + 0.5 * sweep;
                if (offset > 0 && sweep < totalSweep) {
                    x += offset * Math.cos(currentAngle);
                    y += offset * Math.sin(currentAngle);
                }

                if (value.items) {
                    this._renderHierarchicalSlices(engine, x, y, value.items, val, radius, innerRadius, angle, sweep, 0, level + 1);
                }
                this._renderSlice(engine, x, y, currentAngle, this._sliceIndex, r, ir, angle, sweep, totalSweep);
                this._sliceIndex++;

                if (reversed) {
                    angle -= sweep;
                } else {
                    angle += sweep;
                }

                engine.endGroup();
                this._pels.push(pel);
            }
        }

        _getLabelsForLegend() {
            return this._legendLabels || [];
        }

        _highlightCurrent() {
            if (this.selectionMode != SelectionMode.None) {
                this._highlight(true, this._selectionIndex);
            }
        }

    }
}