module wijmo.chart {
    'use strict';

    /**
     * Class that represents a data point (with x and y coordinates).
     *
     * X and Y coordinates can be specified as a number or a Date object(time-based data).
     */
    export class DataPoint {
        /**
         * Gets or sets X coordinate value of this @see:DataPoint.
         */
        x: any;
        
        /**
         * Gets or sets Y coordinate value of this @see:DataPoint.
         */
        y: any;

        /**
         * Initializes a new instance of the @see:DataPoint class.
         *
         * @param x X coordinate of the new DataPoint.
         * @param y Y coordinate of the new DataPoint.
         */
        constructor(x: any = 0, y: any = 0) {
            this.x = x;
            this.y = y;
        }
        
    }

    /**
     * Provides arguments for @see:Series events.
     */
    export class RenderEventArgs extends EventArgs {
        _engine: IRenderEngine;

        /**
         * Initializes a new instance of the @see:RenderEventArgs class.
         *
         * @param engine (@see:IRenderEngine) The rendering engine to use.
         */
        constructor(engine: IRenderEngine) {
            super();
            this._engine = engine;
        }

        /**
         * Gets the @see:IRenderEngine object to use for rendering the chart elements.
         */
        get engine(): IRenderEngine {
            return this._engine;
        }
    }

    /**
     * Specifies the format of the image with embed base64-encoded binary data.
     */
    export enum ImageFormat {
        /** Gets the W3C Portable Network Graphics (PNG) image format. */
        Png,
        /** Gets the Joint Photographic Experts Group (JPEG) image format. */
        Jpeg,
        /** Gets the Scalable Vector Graphics(SVG) image format. */
        Svg
    };

    /**
     * The @see:FlexChartBase control from which the FlexChart and FlexPie derive.
     */
    export class FlexChartBase extends Control implements _IPalette {
        static _WIDTH = 300;
        static _HEIGHT = 200;
        static _SELECTION_THRESHOLD = 15;

        // property storage
        _items: any; // any[] or ICollectionView
        _cv: wijmo.collections.ICollectionView;
        private _palette: string[] = null;
        private _selectionMode = SelectionMode.None;
        private _itemFormatter: Function;
        _selectionIndex: number;
        _options: any;
        private _plotMargin: any;
        _header: string;
        _headerStyle: any;
        _footer: string;
        _footerStyle: any;
        _legend: Legend;

        _defPalette = Palettes.standard;// ['#5DA5DA', '#FAA43A', '#60BD68', '#E5126F', '#9D722A'];
        _notifyCurrentChanged: boolean = true;
        _rectFooter: Rect;
        _rectHeader: Rect;
        _rectChart: Rect;
        _rectLegend: Rect;
        _currentRenderEngine: IRenderEngine;

        _legendHost: SVGGElement = null;

        private _needBind = false;
        private _toShow: number;
        private _toHide: number;
        _tooltip: ChartTooltip;

        //--------------------------------------------------------------------------
        // ** object model

        /**
         * Gets or sets the array or @see:ICollectionView object that contains the data used to create the chart.
         */
        get itemsSource(): any {
            return this._items;
        }
        set itemsSource(value: any) {
            if (this._items != value) {

                // unbind current collection view
                if (this._cv) {
                    this._cv.currentChanged.removeHandler(this._cvCurrentChanged, this);
                    this._cv.collectionChanged.removeHandler(this._cvCollectionChanged, this);
                    this._cv = null;
                }

                // save new data source and collection view
                this._items = value;
                this._cv = asCollectionView(value);

                // bind new collection view
                if (this._cv != null) {
                    this._cv.currentChanged.addHandler(this._cvCurrentChanged, this);
                    this._cv.collectionChanged.addHandler(this._cvCollectionChanged, this);
                }

                this._clearCachedValues();

                // bind chart
                this._bindChart();
            }
        }

        /**
         * Gets the @see:ICollectionView object that contains the chart data.
         */
        get collectionView(): wijmo.collections.ICollectionView {
            return this._cv;
        }

        /**
         * Gets or sets an array of default colors to use for displaying each series.
         * 
         * The array contains strings that represents CSS colors. For example:
         * <pre>
         * // use colors specified by name
         * chart.palette = ['red', 'green', 'blue'];
         * // or use colors specified as rgba-values
         * chart.palette = [
         *   'rgba(255,0,0,1)', 
         *   'rgba(255,0,0,0.8)', 
         *   'rgba(255,0,0,0.6)',
         *   'rgba(255,0,0,0.4)'];
         * </pre>
         *
         * There is a set of predefined palettes in the @see:Palettes class that you can use, for example:
         * <pre>
         * chart.palette = wijmo.chart.Palettes.coral;
         * </pre>
         */
        get palette(): string[] {
            return this._palette;
        }
        set palette(value: string[]) {
            if (value != this._palette) {
                this._palette = asArray(value);
                this.invalidate();
            }
        }

        /**
         * Gets or sets the plot margin in pixels.
         *
         * The plot margin represents the area between the edges of the control
         * and the plot area.
         *
         * By default, this value is calculated automatically based on the space 
         * required by the axis labels, but you can override it if you want
         * to control the precise position of the plot area within the control
         * (for example, when aligning multiple chart controls on a page).
         *
         * You may set this property to a numeric value or to a CSS-style
         * margin specification. For example:
         *
         * <pre>
         * // set the plot margin to 20 pixels on all sides
         * chart.plotMargin = 20;
         * // set the plot margin for top, right, bottom, left sides
         * chart.plotMargin = '10 15 20 25';
         * // set the plot margin for top/bottom (10px) and left/right (20px)
         * chart.plotMargin = '10 20';
         * </pre>
         */
        get plotMargin(): any {
            return this._plotMargin;
        }
        set plotMargin(value: any) {
            if (value != this._plotMargin) {
                this._plotMargin = value;
                this.invalidate();
            }
        }

        /**
         * Gets or sets the chart legend.
         */
        get legend(): Legend {
            return this._legend;
        }
        set legend(value:Legend) {
            if (value != this._legend) {
                this._legend = asType(value, Legend);
                if (this._legend != null) {
                    this._legend._chart = this;
                }
            }
        }

        /**
         * Gets or sets the text displayed in the chart header.
         */
        get header(): string {
            return this._header;
        }
        set header(value: string) {
            if (value != this._header) {
                this._header = asString(value, true);
                this.invalidate();
            }
        }

        /**
         * Gets or sets the text displayed in the chart footer.
         */
        get footer(): string {
            return this._footer;
        }
        set footer(value: string) {
            if (value != this._footer) {
                this._footer = asString(value, true);
                this.invalidate();
            }
        }

        /**
         * Gets or sets the style of the chart header.
         */
        get headerStyle(): any {
            return this._headerStyle;
        }
        set headerStyle(value: any) {
            if (value != this._headerStyle) {
                this._headerStyle = value;
                this.invalidate();
            }
        }

        /**
         * Gets or sets the style of the chart footer.
         */
        get footerStyle(): any {
            return this._footerStyle;
        }
        set footerStyle(value: any) {
            if (value != this._footerStyle) {
                this._footerStyle = value;
                this.invalidate();
            }
        }

        /**
         * Gets or sets an enumerated value indicating whether or what is 
         * selected when the user clicks the chart.
         */
        get selectionMode(): SelectionMode {
            return this._selectionMode;
        }
        set selectionMode(value: SelectionMode) {
            if (value != this._selectionMode) {
                this._selectionMode = asEnum(value, SelectionMode);
                this.invalidate();
            }
        }

        /**
         * Gets or sets the item formatter function that allows you to customize 
         * the appearance of data points. See the Explorer sample's <a target="_blank" 
         * href="http://demos.wijmo.com/5/Angular/Explorer/Explorer/#/chart/itemFormatter">
         * Item Formatter</a> for a demonstration.
         */
        get itemFormatter(): Function {
            return this._itemFormatter;
        }
        set itemFormatter(value: Function) {
            if (value != this._itemFormatter) {
                this._itemFormatter = asFunction(value);
                this.invalidate();
            }
        }

        /**
         * Occurs before the chart starts rendering data.
         */
        rendering = new Event();

        /**
         * Occurs after the chart finishes rendering.
         */
        rendered = new Event();

        /**
         * Raises the @see:rendered event.
         *
         * @param e The @see:RenderEventArgs object used to render the chart.
         */
        onRendered(e: RenderEventArgs) {
            this.rendered.raise(this, e);
        }

        /**
         * Raises the @see:rendering event.
         *
         * @param e The @see:RenderEventArgs object used to render the chart.
         */
        onRendering(e: RenderEventArgs) {
            this.rendering.raise(this, e);
        }

        ///**
        // * Exports chart to an image file.
        // * 
        // * @param name The name of the exported image file.
        // * @param extension The filename extension of the exported image file.  Supported types are PNG, JPEG, SVG.
        // */
        //exportToImage(name: string, extension: string) {
        //    var n = name || 'image',
        //        ext = (extension || 'png').toLowerCase();

        //    this._exportToImage(n, ext, function (uri, n, ext) {
        //        ExportHelper.downloadImage(uri, n, ext);
        //    });
        //}

        /**
         * Save chart to an image file.
         * 
         * @param filename The filename for the exported image file including extension. Supported types are PNG, JPEG, SVG.
         */
        saveImageToFile(filename: string): void {
            var name, ext, format, fn;

            if (!filename || filename.length === 0 || filename.indexOf('.') === -1) {
                filename = 'image.png';
            }
            fn = filename.split('.');
            name = fn[0].toLowerCase();
            ext = fn[1].toLowerCase();
            format = ImageFormat[(ext[0].toUpperCase() + ext.substring(1))];

            this.saveImageToDataUrl(format, dataURI => {
                ExportHelper.downloadImage(dataURI, name, ext);
            });
        }
        
        /**
         * Save chart to image data url.
         * 
         * @param format The @see:ImageFormat for the exported image.
         * @param done A function to be called after data url is generated. The function gets passed the data url as its argument. 
         */
        saveImageToDataUrl(format: ImageFormat, done: Function): void {
            var form = asEnum(format, ImageFormat, false),
                f = ImageFormat[form].toLowerCase(),
                dataURI;

            if (f && f.length) {
                this._exportToImage(f, uri => {
                    done.call(done, uri);
                });
            }
        }

        _exportToImage(extension, processDataURI) {
            var image = new Image(),
                ele = this._currentRenderEngine.element,
                dataUrl;

            dataUrl = ExportHelper.getDataUri(ele);
            if (extension === 'svg') {
                processDataURI.call(null, dataUrl);
            } else {
                image.onload = () => {
                    var canvas = document.createElement('canvas'),
                        rect = (<any>wijmo).getElementRect(ele),
                        uri;

                    canvas.width = rect.width;
                    canvas.height = rect.height;
                    var context = canvas.getContext('2d');
                    //fill background
                    context.fillStyle = '#ffffff';
                    context.fillRect(0, 0, rect.width, rect.height);
                    context.drawImage(image, 0, 0);

                    uri = canvas.toDataURL('image/' + extension);
                    processDataURI.call(null, uri);
                    canvas = null;
                }
                image.src = dataUrl;
            }
        }

        /**
         * Refreshes the chart.
         *
         * @param fullUpdate A value indicating whether to update the control layout as well as the content.
         */
        refresh(fullUpdate = true) {

            // call base class to suppress any pending invalidations
            super.refresh(fullUpdate);

            // update the chart
            if (!this.isUpdating) {
                this._refreshChart();
            }
        }

        /**
         * Checks whether this control contains the focused element.
         */
        containsFocus(): boolean {
            var has = super.containsFocus();
            if (!has) {
                var ae = getActiveElement();
                if (ae) {
                    has = ae.parentNode === this.hostElement;
                }
            }

            return has;
        }

        /**
         * Occurs after the selection changes, whether programmatically
         * or when the user clicks the chart. This is useful, for example,
         * when you want to update details in a textbox showing the current
         * selection.
         */
        selectionChanged = new Event();

        /**
         * Raises the @see:selectionChanged event.
         */
        onSelectionChanged(e?: EventArgs) {
            this.selectionChanged.raise(this, e);
        }

        onLostFocus(e?: EventArgs) {
            if (this._tooltip && this._tooltip.isVisible) {
                this._tooltip.hide();
            }
            super.onLostFocus(e);
        }

        //--------------------------------------------------------------------------
        // implementation

        // updates chart to sync with data source
        private _cvCollectionChanged(sender, e) {
            this._clearCachedValues();
            this._bindChart();
        }

        // updates selection to sync with data source
        private _cvCurrentChanged(sender, e) {
            if (this._notifyCurrentChanged) {
                this._bindChart();
            }
        }

        // IPalette 

        /**
        * Gets a color from the palette by index.
        *
        * @param index The index of the color in the palette.
        */
        _getColor(index: number): string {
            var palette = this._defPalette;
            if (this._palette != null && this._palette.length > 0) {
                palette = this._palette;
            }
            return palette[index % palette.length];
        }

        /**
         * Gets a lighter color from the palette by index.
         *
         * @param index The index of the color in the palette.
         */
        _getColorLight(index: number): string {
            var color = this._getColor(index),
                c = new Color(color);
            if (c != null) {
                if (c.a == 1 && color.indexOf('rgba') == -1) {
                c.a *= 0.7;
                }
                color = c.toString();
            }
            return color;
        }

        // abstract

        // binds the chart to the current data source.
        _bindChart() {
            this._needBind = true;
            this.invalidate();
        }

        _clearCachedValues() {
        }

        _render(engine: IRenderEngine) {
        }

        _performBind() {
        }

        // render
        _refreshChart() {
            if (this._needBind) {
                this._needBind = false;
                this._performBind();
            }
            this._render(this._currentRenderEngine);
        }

        _drawTitle(engine: IRenderEngine, rect: Rect, title: string, style: any, isFooter: boolean): Rect {
            var lblClass = FlexChart._CSS_TITLE;
            var groupClass = isFooter ? FlexChart._CSS_FOOTER : FlexChart._CSS_HEADER;

            var tsz: Size = null;
            if (isFooter) {
                this._rectFooter = null;
            }
            else {
                this._rectHeader = null;
            }

            if (title != null) {
                var fontSize = null;
                var fg = null;
                var fontFamily = null;
                var halign = null;

                if (style) {
                    if (style.fontSize) {
                        fontSize = style.fontSize;
                    }
                    if (style.foreground) {
                        fg = style.foreground;
                    }
                    if (style.fill) {
                        fg = style.fill;
                    }
                    if (style.fontFamily) {
                        fontFamily = style.fontFamily;
                    }
                    if (style.halign) {
                        halign = style.halign;
                    }
                }

                engine.fontSize = fontSize;
                engine.fontFamily = fontFamily;

                tsz = engine.measureString(title, lblClass, groupClass, style);
                rect.height -= tsz.height;

                if (!fg) {
                    fg = FlexChart._FG;
                }

                engine.textFill = fg;
                if (isFooter) {

                    if (halign == 'left') {
                        FlexChart._renderText(engine, title, new Point(rect.left, rect.bottom), 0, 0, lblClass, groupClass, style);
                    } else if (halign == 'right') {
                        FlexChart._renderText(engine, title, new Point(rect.left + rect.width, rect.bottom), 2, 0, lblClass, groupClass, style);
                    } else { // default center
                        FlexChart._renderText(engine, title, new Point(rect.left + 0.5 * rect.width, rect.bottom), 1, 0, lblClass, groupClass, style);
                    }

                    this._rectFooter = new Rect(rect.left, rect.bottom, rect.width, tsz.height);
                } else {
                    this._rectHeader = new Rect(rect.left, rect.top, rect.width, tsz.height);

                    rect.top += tsz.height;
                    if (halign == 'left') {
                        FlexChart._renderText(engine, title, new Point(rect.left, 0), 0, 0, lblClass, groupClass, style);
                    } else if (halign == 'right') {
                        FlexChart._renderText(engine, title, new Point(rect.left + rect.width, 0), 2, 0, lblClass, groupClass, style);
                    } else { // default center
                        FlexChart._renderText(engine, title, new Point(rect.left + 0.5 * rect.width, 0), 1, 0, lblClass, groupClass, style);
                    }
                }

                engine.textFill = null;
                engine.fontSize = null;
                engine.fontFamily = null;
            }
            return rect;
        }

        // convert page coordinates to control 
        _toControl(pt: any, y?: number): Point {
            if (isNumber(pt) && isNumber(y)) { // accept hitTest(x, y) as well
                pt = new Point(pt, y);
            } else if (pt instanceof MouseEvent) {
                pt = new Point(pt.pageX, pt.pageY);
            }
            asType(pt, Point);

            // control coords
            var cpt = pt.clone();

            // jQuery
            // var host = $(this.hostElement);
            // var offset = host.offset();
            // cpt.x -= offset.left + parseInt(host.css('padding-left'));
            // cpt.y -= offset.top + parseInt(host.css('padding-top'));

            var offset = this._getHostOffset();
            cpt.x -= offset.x;
            cpt.y -= offset.y;

            var cstyle = this._getHostComputedStyle();
            if (cstyle) {
                var padLeft = parseInt(cstyle.paddingLeft.replace('px', ''));
                if (padLeft && !isNaN(padLeft)) {
                    cpt.x -= padLeft;
                }
                var padTop = parseInt(cstyle.paddingTop.replace('px', ''));
                if (padTop && !isNaN(padTop)) {
                    cpt.y -= padTop;
                }
            }

            return cpt;
        }

        _highlightItems(items, cls, selected: boolean) {
            if (selected) {
                for (var i = 0; i < items.length; i++) {
                    wijmo.addClass(items[i], cls);
                }
            } else {
                for (var i = 0; i < items.length; i++) {
                    wijmo.removeClass(items[i], cls);
                }
            }
        }

        _parseMargin(value: any): any {
            var margins = {};
            if (isNumber(value) && !isNaN(value)) {
                margins['top'] = margins['bottom'] = margins['left'] = margins['right'] = asNumber(value);
            } else if (isString(value)) {

                var s = asString(value);
                var ss = s.split(' ', 4);
                var top = NaN,
                    bottom = NaN,
                    left = NaN,
                    right = NaN;

                if (ss) {
                    if (ss.length == 4) {
                        top = parseFloat(ss[0]);
                        right = parseFloat(ss[1]);
                        bottom = parseFloat(ss[2]);
                        left = parseFloat(ss[3]);
                    } else if (ss.length == 2) {
                        top = bottom = parseFloat(ss[0]);
                        left = right = parseFloat(ss[1]);
                    } else if (ss.length == 1) {
                        top = bottom = left = right = parseFloat(ss[1]);
                    }

                    if (!isNaN(top)) {
                        margins['top'] = top;
                    }
                    if (!isNaN(bottom)) {
                        margins['bottom'] = bottom;
                    }
                    if (!isNaN(left)) {
                        margins['left'] = left;
                    }
                    if (!isNaN(right)) {
                        margins['right'] = right;
                    }
                }
            }

            return margins;
        }

        // shows an automatic tooltip
        _showToolTip(content, rect) {
            var self = this,
                showDelay = this._tooltip.showDelay;
            self._clearTimeouts();
            if (showDelay > 0) {
                self._toShow = setTimeout(function () {
                    self._tooltip.show(self.hostElement, content, rect);
                    if (self._tooltip.hideDelay > 0) {
                        self._toHide = setTimeout(function () {
                            self._tooltip.hide();
                        }, self._tooltip.hideDelay);
                    }
                }, showDelay);
            } else {
                self._tooltip.show(self.hostElement, content, rect);
                if (self._tooltip.hideDelay > 0) {
                    self._toHide = setTimeout(function () {
                        self._tooltip.hide();
                    }, self._tooltip.hideDelay);
                }
            }
        }

        // hides an automatic tooltip
        _hideToolTip() {
            this._clearTimeouts();
            this._tooltip.hide();
        }

        // clears the timeouts used to show and hide automatic tooltips
        private _clearTimeouts() {
            if (this._toShow) {
                clearTimeout(this._toShow);
                this._toShow = null;
            }
            if (this._toHide) {
                clearTimeout(this._toHide);
                this._toHide = null;
            }
        }

        _getHostOffset(): Point {
            var rect = getElementRect(this.hostElement);
            return new Point(rect.left, rect.top);
            
            /*var docElem, win,
                offset = new Point(),
                host = this.hostElement, 
                doc =  host && host.ownerDocument;

            if (!doc) {
                return offset;
            }

            docElem = doc.documentElement;

            // Make sure it's not a disconnected DOM node 
            //if (!jQuery.contains(docElem, elem)) { 
            //	return box; 
            //} 

            var box = host.getBoundingClientRect();
            win = doc.defaultView;// getWindow(doc);
            offset.y = box.top + win.pageYOffset - docElem.clientTop;
            offset.x = box.left + win.pageXOffset - docElem.clientLeft;

            return offset;*/
        }

        _getHostSize(): Size {
            var sz = new Size();

            var host = this.hostElement;

            var cstyle = this._getHostComputedStyle();
            var w = host.offsetWidth,
                h = host.offsetHeight;

            if (cstyle) {
                var padLeft = parseFloat(cstyle.paddingLeft.replace('px', ''));
                var padRight = parseFloat(cstyle.paddingRight.replace('px', ''));
                var padTop = parseFloat(cstyle.paddingTop.replace('px', ''));
                var padBottom = parseFloat(cstyle.paddingBottom.replace('px', ''));

                if (!isNaN(padLeft)) {
                    w -= padLeft;
                }
                if (!isNaN(padRight)) {
                    w -= padRight;
                }

                if (!isNaN(padTop)) {
                    h -= padTop;
                }

                if (!isNaN(padBottom)) {
                    h -= padBottom;
                }

                sz.width = w;
                sz.height = h;
            }

            return sz;
        }

        _getHostComputedStyle(): CSSStyleDeclaration {
            var host = this.hostElement;
            if (host && host.ownerDocument && host.ownerDocument.defaultView) {
                return host.ownerDocument.defaultView.getComputedStyle(this.hostElement);
            }
            return null;
        }

        _find(elem: SVGElement, names: string[]): any[]{
            var found = [];

            for (var i = 0; i < elem.childElementCount; i++) {
                var child = elem.childNodes.item(i);
                if (names.indexOf(child.nodeName) >= 0) {
                    found.push(child);
                } else {
                    var items = this._find(<SVGElement>child, names);
                    if (items.length > 0) {
                        for(var j = 0; j < items.length; j++)
                            found.push(items[j]);
                    }
                }
            }

            return found;
        }
    }

    export interface _IHitArea {
        contains(pt: Point): boolean;
        distance(pt: Point): number;
        tag: any;
    }

    export class _KeyWords {
        private _keys = {};

        constructor() {
            this._keys['seriesName'] = null;
            this._keys['pointIndex'] = null;
            this._keys['x'] = null;
            this._keys['y'] = null;
            this._keys['value'] = null;
            this._keys['name'] = null;
        }

        replace(s: string, ht: HitTestInfo): string {
            var kw = this;
            return wijmo.format(s,
                {// empty data - own get/format function
                },
                function (data, name, fmt, val) {
                    return kw.getValue(name, ht, fmt);
                });
        }

        getValue(key: string, ht: HitTestInfo, fmt?: string): string {

            // handle pre-defined keywords
            switch (key) {
                case 'seriesName':
                    return ht.series ? ht.series.name : '';
                case 'pointIndex':
                    return ht.pointIndex != null ? ht.pointIndex.toFixed() : '';
                case 'x':
                    return fmt ? Globalize.format(ht.x, fmt) : ht._xfmt;
                case 'y':
                    return fmt ? Globalize.format(ht.y, fmt) : ht._yfmt;
                case 'value':
                    return fmt ? Globalize.format(ht.value, fmt) : ht.value;
                case 'name':
                    return ht.name;
            }

            // look for key in data item
            if (ht.item) {
                if (key.indexOf('item.') == 0) { // strip 'item.' from key (to allow 'item.name' for example)
                    key = key.substr(5);
                }
                if (key in ht.item) {
                    return fmt ? Globalize.format(ht.item[key], fmt) : ht.item[key];
                }
            }

            // no match
            return '';
        }
    }

    class ExportHelper {
        static doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
        static xmlns = 'http://www.w3.org/2000/xmlns/';

        static downloadImage(dataUrl, name, ext) {
            var a = document.createElement('a'),
                contentType = 'image/' + ext;
            if (navigator.msSaveOrOpenBlob) {
                dataUrl = dataUrl.substring(dataUrl.indexOf(',') + 1);

                var byteCharacters = atob(dataUrl),
                    byteArrays = [],
                    sliceSize = 512,
                    offset, slice, blob;

                for (offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    slice = byteCharacters.slice(offset, offset + sliceSize);

                    var byteNumbers = new Array(slice.length);
                    for (var i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }

                    var byteArray = new Uint8Array(byteNumbers);

                    byteArrays.push(byteArray);
                }

                blob = new Blob(byteArrays, { type: contentType });
                navigator.msSaveOrOpenBlob(blob, name + '.' + ext);
                //navigator.msSaveOrOpenBlob(canvas.msToBlob(), n + '.' + ext);
            } else {
                (<any>a).download = name + '.' + ext;
                a.href = dataUrl;
                document.body.appendChild(a);
                a.addEventListener("click", function (e) {
                    a.parentNode.removeChild(a);
                });
                a.click();
            }
        }

        static getDataUri(ele) {
            var outer = document.createElement('div'),
                clone = ele.cloneNode(true),
                rect, width, height, viewBoxWidth, viewBoxHeight, box, css, parent, s, defs;

            if (ele.tagName == 'svg') {
                rect = (<any>wijmo).getElementRect(ele);
                width = rect.width || 0;
                height = rect.height || 0;
                viewBoxWidth = ele.viewBox.baseVal && ele.viewBox.baseVal.width !== 0 ? ele.viewBox.baseVal.width : width;
                viewBoxHeight = ele.viewBox.baseVal && ele.viewBox.baseVal.height !== 0 ? ele.viewBox.baseVal.height : height;
            } else {
                box = ele.getBBox();
                width = box.x + box.width;
                height = box.y + box.height;
                clone.setAttribute('transform', clone.getAttribute('transform').replace(/translate\(.*?\)/, ''));
                viewBoxWidth = width;
                viewBoxHeight = height;

                parent = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
                parent.appendChild(clone)
                clone = parent;
            }

            clone.setAttribute('version', '1.1');
            clone.setAttributeNS(ExportHelper.xmlns, 'xmlns', 'http://www.w3.org/2000/svg');
            clone.setAttributeNS(ExportHelper.xmlns, 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
            clone.setAttribute('width', width);
            clone.setAttribute('height', height);
            //clone.setAttribute('width', width * options.scale);
            //clone.setAttribute('height', height * options.scale);
            clone.setAttribute('viewBox', '0 0 ' + viewBoxWidth + ' ' + viewBoxHeight);

            //add FlexChart's class to clone element.
            wijmo.addClass(clone, (ele.parentNode && ele.parentNode.getAttribute('class')) || '');
            outer.appendChild(clone);

            css = ExportHelper.getStyles(ele);
            s = document.createElement('style');
            s.setAttribute('type', 'text/css');
            s.innerHTML = "<![CDATA[\n" + css + "\n]]>";
            defs = document.createElement('defs');
            defs.appendChild(s);
            clone.insertBefore(defs, clone.firstChild);

            // encode then decode to handle `btoa` on Unicode; see MDN for `btoa`.
            return 'data:image/svg+xml;base64,' + window.btoa((<any>window).unescape(encodeURIComponent(ExportHelper.doctype + outer.innerHTML)));
        }

        static getStyles(ele) {
            var css = '',
                styleSheets = document.styleSheets;

            if (styleSheets == null || styleSheets.length === 0) {
                return null;
            }

            [].forEach.call(styleSheets, (sheet => {
                //TODO: href, or other external resources
                var cssRules;
                try {
                    if (sheet.cssRules == null || sheet.cssRules.length === 0) {
                        return true;
                    }
                } 
                //Note that SecurityError exception is specific to Firefox.
                catch (e) {
                    if (e.name == 'SecurityError') {
                        console.log("SecurityError. Can't read: " + sheet.href);
                        return true;
                    }
                }
                cssRules = sheet.cssRules;

                [].forEach.call(cssRules, (rule => {
                    var style = rule.style,
                        match;

                    if (style == null) {
                        return true;
                    }

                    try {
                        match = ele.querySelector(rule.selectorText);
                    } catch (e) {
                        console.warn('Invalid CSS selector "' + rule.selectorText + '"', e);
                    }

                    if (match) {
                        //var selector = selectorRemap ? selectorRemap(rule.selectorText) : rule.selectorText;
                        //css += selector + " { " + rule.style.cssText + " }\n";
                        css += rule.selectorText + " { " + style.cssText + " }\n";
                    } else if (rule.cssText.match(/^@font-face/)) {
                        css += rule.cssText + '\n';
                    }
                }));
            }));
            return css;
        }
    }
}

