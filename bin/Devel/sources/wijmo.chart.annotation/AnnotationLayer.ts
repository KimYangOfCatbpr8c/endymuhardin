/**
 * Defines the @see:AnnotationLayer and various annotations for @see:FlexChart and 
 * @see:FinancialChart.
 */
module wijmo.chart.annotation {
    'use strict';

    /**
     * Represents an annotation layer for @see:FlexChart and @see:FinancialChart.
     *
     * The AnnotationLayer contains a collection of various annotation elements: texts, 
     * lines, images, rectangles etc.
     * To use the @see:AnnotationLayer, create annotations and push them to the layer's 
     * items property.
     */
    export class AnnotationLayer {
        static _CSS_Layer = 'wj-chart-annotationlayer';

        private _items: wijmo.collections.ObservableArray;
        private _engine: IRenderEngine;
        _layerEle: SVGGElement;
        private _plotrectId: string;
        private _tooltip: ChartTooltip;
        //prevent others from closing annotation's tooltip.
        private _forceTTShowing: boolean;
        //prevent annotation from closing others tooltip.
        private _annoTTShowing: boolean;
        _chart: FlexChartCore;

        /**
         * Initializes a new instance of the @see:AnnotationLayer class.
         * 
         * @param chart A chart to which the @see:AnnotationLayer is attached.
         * @param options A JavaScript object containing initialization data for 
         * @see:AnnotationLayer.  
         */
        constructor(chart: FlexChartCore, options?) {
            var self = this;

            self._init(chart);
            self._renderGroup();
            self._bindTooltip();
            if (options && wijmo.isArray(options)) {
                options.forEach( val => {
                    var type = val['type'] || 'Circle',
                        annotation;
                    if (!wijmo.chart.annotation[type]) {
                        return;
                    }
                    annotation = new wijmo.chart.annotation[type](val);
                    self._items.push(annotation);
                });
            }
        }

        _init(chart: FlexChartCore) {
            var self = this;
            self._items = new wijmo.collections.ObservableArray();
            self._items.collectionChanged.addHandler(self._itemsChanged, self);
            self._chart = chart;
            self._forceTTShowing = false;
            self._annoTTShowing = false;
            self._engine = chart._currentRenderEngine;
            chart.rendered.addHandler(self._renderAnnotations, self);
            chart.lostFocus.addHandler(self._lostFocus, self);
        }

        private _lostFocus(evt) {
            this._toggleTooltip(this._tooltip, evt, this._chart.hostElement);
        }

        /**
         * Gets the collection of annotation elements in the @see:AnnotationLayer.
         */
        get items(): wijmo.collections.ObservableArray {
            return this._items;
        }

        /**
         * Gets the annotation element by name in the @see:AnnotationLayer.
         * @param name The annotation's name.
         */
        getItem(name: string): AnnotationBase {
            var items = this.getItems(name);

            if (items.length > 0) {
                return items[0];
            } else {
                return null;
            }
        }

        /**
         * Gets the annotation elements by name in the @see:AnnotationLayer.
         * @param name The annotations' name.
         */
        getItems(name: string): Array<AnnotationBase> {
            var items = [];
            if (this._items.length === 0 || !name || name === '') {
                return items;
            }

            for (var i = 0; i < this._items.length; i++) {
                if (name === this._items[i].name) {
                    items.push(this._items[i]);
                }
            }
            return items;
        }


        private _bindTooltip() {
            var self = this,
                ele = self._chart.hostElement,
                tooltip = self._tooltip,
                ttHide: Function;

            if (!tooltip) {
                tooltip = self._tooltip = new ChartTooltip();
                ttHide = Tooltip.prototype.hide;
                Tooltip.prototype.hide = function () {
                    if (self._forceTTShowing) {
                        return;
                    }
                    ttHide.call(tooltip);
                }
            }

            if (ele) {
                ele.addEventListener('click', function (evt) {
                    self._toggleTooltip(tooltip, evt, ele);
                });
                ele.addEventListener('mousemove', function (evt) {
                    if (self._showTooltip()) {
                        self._toggleTooltip(tooltip, evt, ele);
                    }
                });
            }
        }

        _showTooltip() {
            return !this._chart.isTouching;
        }

        private _toggleTooltip(tooltip, evt, parentNode) {
            var self = this,
                annotation = self._getAnnotation(evt.target, parentNode);
            if (annotation && annotation.tooltip) {
                self._forceTTShowing = true;
                self._annoTTShowing = true;
                tooltip.show(self._layerEle, annotation.tooltip, new wijmo.Rect(evt.clientX, evt.clientY, 5, 5));
            } else {
                if (!self._annoTTShowing) {
                    return;
                }
                self._annoTTShowing = false;
                self._forceTTShowing = false;
                tooltip.hide();
            }
        }

        _getAnnotation(ele, parentNode): AnnotationBase {
            var node = this._getAnnotationElement(ele, parentNode);
            if (node == null) {
                return null;
            }
            return node[AnnotationBase._DATA_KEY];
        }

        private _getAnnotationElement(ele, pNode): SVGGElement {
            if (!ele || !pNode) {
                return null;
            }
            var parentNode = ele.parentNode;
            if (wijmo.hasClass(ele, AnnotationBase._CSS_ANNOTATION)) {
                return ele;
            } else if (parentNode == null || parentNode === document.body || parentNode === document || parentNode === pNode) {
                return null;
            } else {
                return this._getAnnotationElement(parentNode, pNode);
            }
        }

        private _itemsChanged(items, e: wijmo.collections.NotifyCollectionChangedEventArgs) {
            var action = e.action,
                item: AnnotationBase = e.item;

            switch (action) {
                case wijmo.collections.NotifyCollectionChangedAction.Add:
                case wijmo.collections.NotifyCollectionChangedAction.Change:
                    item._layer = this;
                    this._renderAnnotation(item);
                    break;
                case wijmo.collections.NotifyCollectionChangedAction.Remove:
                    this._destroyAnnotation(item);
                    break;
                default:
                    break;
            }
        }

        private _renderAnnotations() {
            var items = this.items,
                len = items.length,
                i;

            this._renderGroup();
            for (i = 0; i < len; i++) {
                this._renderAnnotation(items[i]);
            }
        }

        _renderGroup() {
            var self = this,
                engine = <any>self._engine,
                rect = self._chart._plotRect,
                parent;

            if (!rect) {
                return;
            }

            if (!self._layerEle || self._layerEle.parentNode == null) {

                self._plotrectId = 'plotRect' + (1000000 * Math.random()).toFixed();
                //set rect.left/top to 0 because clippath will translate with g element together.
                engine.addClipRect({
                    left: 0,
                    top: 0,
                    width: rect.width,
                    height: rect.height
                }, self._plotrectId);

                self._layerEle = engine.startGroup(AnnotationLayer._CSS_Layer, self._plotrectId);
                self._layerEle.setAttribute('transform', 'translate(' + rect.left + ', ' + rect.top + ')');
                engine.endGroup();
            }
        }

        _renderAnnotation(item: AnnotationBase) {
            if (!this._layerEle) {
                return;
            }
            if (item._element && item._element.parentNode == this._layerEle) {
                this._layerEle.removeChild(item._element);
            }
            item.render(this._engine);
            this._layerEle.appendChild(item._element);
        }

        private _destroyAnnotations() {
            var items = this.items,
                len = items.length,
                i;

            for (i = 0; i < len; i++) {
                this._destroyAnnotation(items[i]);
            }
        }

        private _destroyAnnotation(item: AnnotationBase) {
            if (this._layerEle) {
                this._layerEle.removeChild(item._element);
            }
            item.destroy();
        }

        //TODO: hitTest method.
        //HitTestInfo in chart is not suitable for this, because annotation is not only x/y data coordinate.
    }
} 