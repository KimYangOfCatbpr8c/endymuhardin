/**
 * Defines the @see:AnnotationLayer and various annotations for @see:FlexChart and
 * @see:FinancialChart.
 */
var wijmo;
(function (wijmo) {
    var chart;
    (function (chart_1) {
        var annotation;
        (function (annotation_1) {
            'use strict';
            /**
             * Represents an annotation layer for @see:FlexChart and @see:FinancialChart.
             *
             * The AnnotationLayer contains a collection of various annotation elements: texts,
             * lines, images, rectangles etc.
             * To use the @see:AnnotationLayer, create annotations and push them to the layer's
             * items property.
             */
            var AnnotationLayer = (function () {
                /**
                 * Initializes a new instance of the @see:AnnotationLayer class.
                 *
                 * @param chart A chart to which the @see:AnnotationLayer is attached.
                 * @param options A JavaScript object containing initialization data for
                 * @see:AnnotationLayer.
                 */
                function AnnotationLayer(chart, options) {
                    var self = this;
                    self._init(chart);
                    self._renderGroup();
                    self._bindTooltip();
                    if (options && wijmo.isArray(options)) {
                        options.forEach(function (val) {
                            var type = val['type'] || 'Circle', annotation;
                            if (!wijmo.chart.annotation[type]) {
                                return;
                            }
                            annotation = new wijmo.chart.annotation[type](val);
                            self._items.push(annotation);
                        });
                    }
                }
                AnnotationLayer.prototype._init = function (chart) {
                    var self = this;
                    self._items = new wijmo.collections.ObservableArray();
                    self._items.collectionChanged.addHandler(self._itemsChanged, self);
                    self._chart = chart;
                    self._forceTTShowing = false;
                    self._annoTTShowing = false;
                    self._engine = chart._currentRenderEngine;
                    chart.rendered.addHandler(self._renderAnnotations, self);
                    chart.lostFocus.addHandler(self._lostFocus, self);
                };
                AnnotationLayer.prototype._lostFocus = function (evt) {
                    this._toggleTooltip(this._tooltip, evt, this._chart.hostElement);
                };
                Object.defineProperty(AnnotationLayer.prototype, "items", {
                    /**
                     * Gets the collection of annotation elements in the @see:AnnotationLayer.
                     */
                    get: function () {
                        return this._items;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Gets the annotation element by name in the @see:AnnotationLayer.
                 * @param name The annotation's name.
                 */
                AnnotationLayer.prototype.getItem = function (name) {
                    var items = this.getItems(name);
                    if (items.length > 0) {
                        return items[0];
                    }
                    else {
                        return null;
                    }
                };
                /**
                 * Gets the annotation elements by name in the @see:AnnotationLayer.
                 * @param name The annotations' name.
                 */
                AnnotationLayer.prototype.getItems = function (name) {
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
                };
                AnnotationLayer.prototype._bindTooltip = function () {
                    var self = this, ele = self._chart.hostElement, tooltip = self._tooltip, ttHide;
                    if (!tooltip) {
                        tooltip = self._tooltip = new chart_1.ChartTooltip();
                        ttHide = wijmo.Tooltip.prototype.hide;
                        wijmo.Tooltip.prototype.hide = function () {
                            if (self._forceTTShowing) {
                                return;
                            }
                            ttHide.call(tooltip);
                        };
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
                };
                AnnotationLayer.prototype._showTooltip = function () {
                    return !this._chart.isTouching;
                };
                AnnotationLayer.prototype._toggleTooltip = function (tooltip, evt, parentNode) {
                    var self = this, annotation = self._getAnnotation(evt.target, parentNode);
                    if (annotation && annotation.tooltip) {
                        self._forceTTShowing = true;
                        self._annoTTShowing = true;
                        tooltip.show(self._layerEle, annotation.tooltip, new wijmo.Rect(evt.clientX, evt.clientY, 5, 5));
                    }
                    else {
                        if (!self._annoTTShowing) {
                            return;
                        }
                        self._annoTTShowing = false;
                        self._forceTTShowing = false;
                        tooltip.hide();
                    }
                };
                AnnotationLayer.prototype._getAnnotation = function (ele, parentNode) {
                    var node = this._getAnnotationElement(ele, parentNode);
                    if (node == null) {
                        return null;
                    }
                    return node[annotation_1.AnnotationBase._DATA_KEY];
                };
                AnnotationLayer.prototype._getAnnotationElement = function (ele, pNode) {
                    if (!ele || !pNode) {
                        return null;
                    }
                    var parentNode = ele.parentNode;
                    if (wijmo.hasClass(ele, annotation_1.AnnotationBase._CSS_ANNOTATION)) {
                        return ele;
                    }
                    else if (parentNode == null || parentNode === document.body || parentNode === document || parentNode === pNode) {
                        return null;
                    }
                    else {
                        return this._getAnnotationElement(parentNode, pNode);
                    }
                };
                AnnotationLayer.prototype._itemsChanged = function (items, e) {
                    var action = e.action, item = e.item;
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
                };
                AnnotationLayer.prototype._renderAnnotations = function () {
                    var items = this.items, len = items.length, i;
                    this._renderGroup();
                    for (i = 0; i < len; i++) {
                        this._renderAnnotation(items[i]);
                    }
                };
                AnnotationLayer.prototype._renderGroup = function () {
                    var self = this, engine = self._engine, rect = self._chart._plotRect, parent;
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
                };
                AnnotationLayer.prototype._renderAnnotation = function (item) {
                    if (!this._layerEle) {
                        return;
                    }
                    if (item._element && item._element.parentNode == this._layerEle) {
                        this._layerEle.removeChild(item._element);
                    }
                    item.render(this._engine);
                    this._layerEle.appendChild(item._element);
                };
                AnnotationLayer.prototype._destroyAnnotations = function () {
                    var items = this.items, len = items.length, i;
                    for (i = 0; i < len; i++) {
                        this._destroyAnnotation(items[i]);
                    }
                };
                AnnotationLayer.prototype._destroyAnnotation = function (item) {
                    if (this._layerEle) {
                        this._layerEle.removeChild(item._element);
                    }
                    item.destroy();
                };
                AnnotationLayer._CSS_Layer = 'wj-chart-annotationlayer';
                return AnnotationLayer;
            }());
            annotation_1.AnnotationLayer = AnnotationLayer;
        })(annotation = chart_1.annotation || (chart_1.annotation = {}));
    })(chart = wijmo.chart || (wijmo.chart = {}));
})(wijmo || (wijmo = {}));
//# sourceMappingURL=AnnotationLayer.js.map