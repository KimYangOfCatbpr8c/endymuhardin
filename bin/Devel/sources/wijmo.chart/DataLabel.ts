module wijmo.chart
{
    'use strict';

    /**
     * Specifies the position of data labels on the chart.
     */
    export enum LabelPosition {
        /** No data labels appear. */
        None = 0,
        /** The labels appear to the left of the data points. */
        Left = 1,
        /** The labels appear above the data points. */
        Top = 2,
        /** The labels appear to the right of the data points. */
        Right = 3,
        /** The labels appear below the data points. */
        Bottom = 4,
        /** The labels appear centered on the data points. */
        Center = 5
    };

    /**
     * Specifies the position of data labels on the pie chart.
     */
    export enum PieLabelPosition {
        /** No data labels. */
        None = 0,
        /** The label appears inside the pie slice. */
        Inside = 1,
        /** The item appears at the center of the pie slice. */
        Center = 2,
        /** The item appears outside the pie slice. */
        Outside = 3
    };

    /**
     * Provides arguments for @see:DataLabel rendering event.
     */
    export class DataLabelRenderEventArgs extends RenderEventArgs {
        private _ht: HitTestInfo;
        private _pt: Point;
        private _text: string;

        /**
         * Initializes a new instance of the @see:DataLabelRenderEventArgs class.
         *
         * @param engine (@see:IRenderEngine) The rendering engine to use.
         * @param ht The hit test information.
         * @param pt The reference point.
         * @param text The label text.
         */
        constructor(engine: IRenderEngine, ht:HitTestInfo,  pt:Point, text:string) {
            super(engine);
            this._ht = ht;
            this._pt = pt;
            this._text = text;
        }

        /**
         * Gets or sets a value that indicates whether the event should be cancelled.
         */
        cancel = false;

        /**
         * Gets the point associated with the label in control coordinates. 
         */
        get point():Point {
            return this._pt;
        }

        /**
         * Gets or sets the label text.
         */
        get text():string {
            return this._text;
        }

        /**
         * Gets the hit test information.
         */
        get hitTestInfo(): HitTestInfo {
            return this._ht;
        }
    }

    /**
    * Represents the base abstract class for the @see:DataLabel and the @see:PieDataLabel classes.
    */
    export class DataLabelBase {
        private _content: any;
        _chart: FlexChartBase;
        private _bdr: boolean;
        private _line: boolean;
        private _off:number;

        /**
         * Gets or sets the content of data labels.
         * 
         * The content can be specified as a string or as a function that
         * takes @see:HitTestInfo object as a parameter. 
         *
         * When the label content is a string, it can contain any of the following
         * parameters:
         *
         * <ul>
         *  <li><b>seriesName</b>: Name of the series that contains the data point (FlexChart only).</li>
         *  <li><b>pointIndex</b>: Index of the data point.</li>
         *  <li><b>value</b>: <b>Value</b> of the data point.</li>
         *  <li><b>x</b>: <b>x</b>-value of the data point (FlexChart only).</li>
         *  <li><b>y</b>: <b>y</b>-value of the data point (FlexChart only).</li>
         *  <li><b>name</b>: <b>Name</b> of the data point.</li>
         *  <li><b>propertyName</b>: any property of data object.</li>
         * </ul>
         * 
         * The parameter must be enclosed in curly brackets, for example 'x={x}, y={y}'.
         *
         * In the following example, we show the y value of the data point in the labels.
         *
         * <pre> 
         *  // Create a chart and show y data in labels positioned above the data point.
         *  var chart = new wijmo.chart.FlexChart('#theChart');          
         *  chart.initialize({
         *      itemsSource: data,
         *      bindingX: 'country',
         *      series: [
         *          { name: 'Sales', binding: 'sales' },
         *          { name: 'Expenses', binding: 'expenses' },
         *          { name: 'Downloads', binding: 'downloads' }],                            
         *  });
         *  chart.dataLabel.position = "Top";
         *  chart.dataLabel.content = "{country} {seriesName}:{y}";
         * </pre>
         *
         * The next example shows how to set data label content using a function.
         *
         * <pre> 
         *  // Set the data label content 
         *  chart.dataLabel.content = function (ht) {
         *    return ht.name + ":" + ht.value.toFixed();
         *  }
         * </pre>
         *
         */
        get content(): any {
            return this._content;
        }
        set content(value: any) {
            if (value != this._content) {
                this._content = value;
                this._invalidate();
            }
        }
        /**
         * Gets or sets a value indicating whether the data labels have borders.
         */
        get border(): boolean {
            return this._bdr;
        }
        set border(value: boolean) {
            if (value != this._bdr) {
                this._bdr = asBoolean(value, true);
                this._invalidate();
            }
        }

        /**
         * Gets or sets the offset from label to the data point.
         */
        get offset(): number {
            return this._off;
        }
        set offset(value: number) {
            if (value != this._off) {
                this._off = asNumber(value, true);
                this._invalidate();
            }
        }

        /**
         * Gets or sets a value indicating whether to draw lines that connect 
		 * labels to the data points.
         */
        get connectingLine(): boolean {
            return this._line;
        }
        set connectingLine(value: boolean) {
            if (value != this._line) {
                this._line = asBoolean(value, true);
                this._invalidate();
            }
        }

        /**
         * Occurs before the rendering data label.
         */
        rendering = new Event();
        
        /**
         * Raises the @see:rendering event.
         *
         * @param e The @see:DataLabelRenderEventArgs object used to render the label.
         */
        onRendering(e: DataLabelRenderEventArgs) {
            this.rendering.raise(this, e);
            return e.cancel;
        }

        _invalidate() {
            if (this._chart) {
                this._chart.invalidate();
            }
        }
    } 


    /**
     * The point data label for FlexChart.
     */
    export class DataLabel extends DataLabelBase {
        private _pos = LabelPosition.Top;

        /**
         * Gets or sets the position of the data labels.
         */
        get position(): LabelPosition {
            return this._pos;
        }
        set position(value: LabelPosition) {
            if (value != this._pos) {
                this._pos = asEnum(value, LabelPosition);
                this._invalidate();
            }
        }
    } 

    /**
     * The point data label for FlexPie.
     */
    export class PieDataLabel extends DataLabelBase {
        private _pos = PieLabelPosition.Center;

        /**
         * Gets or sets the position of the data labels.
         */
        get position(): PieLabelPosition {
            return this._pos;
        }
        set position(value: PieLabelPosition) {
            if (value != this._pos) {
                this._pos = asEnum(value, PieLabelPosition);
                this._invalidate();
            }
        }
    }
}

