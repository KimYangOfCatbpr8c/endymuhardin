module wijmo.chart
{
    'use strict';

    /**
     * Represents a plot area on the chart.
     *
     * The chart can have multiple plot areas with multiple axes.
     * To assign axis to plot area use <b>Axis.plotArea</b> property. For example:
     * <pre>
     *  // create a plot area
     *  var pa = new wijmo.chart.PlotArea();
     *  pa.row = 1;
     *  chart.plotAreas.push(pa);
     *  // create auxiliary y-axis
     *  var ay2 = new wijmo.chart.Axis(wijmo.chart.Position.Left);
     *  ay2.plotArea = pa; // attach axis to the plot area
     *  chart.axes.push(ay2);
     *  // plot first series along y-axis
     *  chart.series[0].axisY = ay2;
     * </pre>
     */
    export class PlotArea
    {
        private _row: number = 0;
        private _col: number = 0;
        private _width: any;
        private _height: any;
        private _name: string;
        private _style: any;
        private _rect = new Rect(0,0,0,0);

        _chart: FlexChartCore;

        /**
         * Initializes a new instance of the @see:PlotArea class.
         */
        constructor() {
        }

        /**
         * Gets or sets the row number of plot area. 
         * Using <b>row</b> property, you can set horizontal position of the plot area
         * on the chart. 
         */
        get row(): number {
            return this._row;
        }
        set row(value: number) {
            if (value != this._row) {
                this._row = asInt(value, true, true);
                this._invalidate();
            }
        }

        /**
         * Gets or sets the column number of plot area.
         * Using <b>column</b> property, you can set vertical position of the plot
         * area on the chart. 
         */
        get column(): number {
            return this._col;
        }
        set column(value: number) {
            if (value != this._col) {
                this._col = asInt(value, true, true);
                this._invalidate();
            }
        }

        /**
         * Gets or sets the plot area name.
         */
        get name(): string {
            return this._name;
        }
        set name(value: string) {
            if (value != this._name) {
                this._name = asString(value, true);
            }
        }

        /**
         * Gets or sets width of the plot area. 
         *
         * The width can be specified as number(sets the width in pixels) or
         * string in the format '{number}*' (star sizing).
         */
        get width(): any {
            return this._width;
        }
        set width(value: any) {
            if (value != this._width) {
                this._width = value;
                this._invalidate();
            }
        }

        /**
         * Gets or sets height of the plot area. 
         *
         * The height can be specified as number(sets the height in pixels) or
         * string in the format '{number}*' (star sizing).
         */
        get height(): any {
            return this._height;
        }
        set height(value: any) {
            if (value != this._height) {
                this._height = value;
                this._invalidate();
            }
        }

        /**
         * Gets or sets the style of the plot area. 
         *
         * Using <b>style</b> property, you can set appearance of the plot area. 
         * For example:
         * <pre>
         *   pa.style = { fill: 'rgba(0,255,0,0.1)' };
         * </pre>
         */
        get style(): any {
            return this._style;
        }
        set style(value: any) {
            if (value != this._style) {
                this._style = value;
                this._invalidate();
            }
        }

        private _invalidate() {
            if (this._chart) {
                this._chart.invalidate();
            }
        }

        _render(engine: IRenderEngine) {
            engine.drawRect(this._rect.left, this._rect.top, this._rect.width, this._rect.height,
                null, this.style);
        }

        _setPlotX(x:number, w:number){
            this._rect.left = x; this._rect.width = w;
        }

        _setPlotY(y:number, h:number){
             this._rect.top = y; this._rect.height = h;
        }

    }

    /**
     * Represents a collection of @see:PlotArea objects in a @see:FlexChartCore control.
     */
    export class PlotAreaCollection extends wijmo.collections.ObservableArray {

        /**
         * Gets a plot area by name.
         *
         * @param name The name of the plot area to look for.
         * @return The axis object with the specified name, or null if not found.
         */
        getPlotArea(name: string): PlotArea {
            var index = this.indexOf(name);
            return index > -1 ? this[index] : null;
        }
        
        /**
         * Gets the index of a plot area by name.
         *
         * @param name The name of the plot area to look for.
         * @return The index of the plot area with the specified name, or -1 if not found.
         */
        indexOf(name: string): number {
            for (var i = 0; i < this.length; i++) {
                if ((<PlotArea>this[i]).name == name) {
                    return i;
                }
            }
            return -1;
        }

        _getWidth(column: number): any {
            var w;
            for (var i = 0; i < this.length; i++) {
                var pa = <PlotArea>this[i];

                if (pa.column == column && pa.row == 0 /* ? */ ) {
                    return pa.width;
                }
            }

            return w;
        }

        _getHeight(row: number): any {
            var w;
            for (var i = 0; i < this.length; i++) {
                var pa = <PlotArea>this[i];
                if (pa.row == row && pa.column == 0 /* ? */ ) {
                    return pa.height;
                }
            }

            return w;
        }

        _calculateWidths(width: number, ncols:number) : number[] {
            if (ncols <= 0)
                throw("ncols");

            var glens = [];// _GridLength[ncols];
            for (var i = 0; i < ncols; i++)
            {
                var w = this._getWidth(i);
                glens[i] = new _GridLength(w);
            }

            return this._calculateLengths(width, ncols, glens);
        }

        _calculateHeights( height : number, nrows:number) : number[] {
            if (nrows <= 0)
                throw("nrows");

            var glens = [];
            for (var i = 0; i < nrows; i++)
            {
                var h = this._getHeight(i);
                glens[i] = new _GridLength(h);
            }

            return this._calculateLengths(height, nrows, glens);
        }

        private _calculateLengths( width:number, ncols:number, glens : _GridLength[]) : number[] {
            var ws = [ncols];

            var wabs = 0.0;
            var nstars = 0.0;

            for (var i = 0; i < ncols; i++)
            {
                if (glens[i].isAbsolute) {
                    ws[i] = glens[i].value;
                    wabs += ws[i];
                }
                else if (glens[i].isStar)
                    nstars += glens[i].value;
                else if (glens[i].isAuto)
                    nstars++;
            }

            var availw = width - wabs;
            var wstar = availw / nstars;

            for (var i = 0; i < ncols; i++)
            {
                if (glens[i].isStar)
                    ws[i] = wstar * glens[i].value;
                else if (glens[i].isAuto)
                    ws[i] = wstar;

                if (ws[i] < 0)
                    ws[i] = 0;
            }

            return ws;
        }
    }

    enum _GridUnitType {
        Auto,
        Pixel,
        Star
    }

    class _GridLength {
        private _value: number;
        private _unitType = _GridUnitType.Auto;

        constructor(s:any = null) {
            if (s) {
                s = s.toString();

                if (s.indexOf('*') >= 0) {
                    this._unitType = _GridUnitType.Star;
                    s = s.replace('*', '');
                    this._value = parseFloat(s);
                    if (isNaN(this._value)) {
                        this._value = 1;
                    }
                } else {
                    this._unitType = _GridUnitType.Pixel;
                    this._value = parseFloat(s);
                    if (isNaN(this._value)) {
                        this._unitType = _GridUnitType.Auto;
                        this._value = 1;
                    }
                }
            }
        }

        public get value(): number {
            return this._value;
        }
        
        public get isStar(): boolean {
            return this._unitType == _GridUnitType.Star;
        } 

        public get isAbsolute(): boolean {
            return this._unitType == _GridUnitType.Pixel;
        } 

        public get isAuto(): boolean {
            return this._unitType == _GridUnitType.Auto;
        } 
    }
}

