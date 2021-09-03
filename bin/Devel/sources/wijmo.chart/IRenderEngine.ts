module wijmo.chart
{
    'use strict';

    /**
     * Represents a rendering engine that performs the basic drawing routines.
     */
    export interface IRenderEngine
    {
        /**
         * Clear the viewport and start the rendering cycle.
         */
        beginRender();

        /**
         * Finish the rendering cycle.
         */
        endRender();

        /**
         * Set the size of the viewport.
         * 
         * @param w Viewport width.
         * @param h Viewport height.
         */
        setViewportSize(w: number, h: number);

        /**
         * Gets the rendered element.
         */
        element: Element;

        /**
         * Gets or sets the color used to fill the element.
         */
        fill: string;

        /**
         * Gets or sets the color used to outline the element.
         */
        stroke: string;

        /**
         * Gets or sets the thickness of the outline.
         */
        strokeWidth: number;

        /**
         * Gets or sets the text color.
         */
        textFill: string;

        /**
         * Gets or sets the font size for the text output.
         */
        fontSize: string;

        /**
         * Gets or sets the font family for the text output.
        */
        fontFamily: string;

        drawEllipse(cx: number, cy: number, rx: number, ry: number, className?: string, style?: any);
        drawRect(x: number, y: number, w: number, h: number, className?: string, style?: any, clipPath?: string);
        drawLine(x1: number, y1: number, x2: number, y2: number, className?: string, style?: any);
        drawLines(xs: number[], ys: number[], className?: string, style?: any, clipPath?: string);
        drawSplines(xs: number[], ys: number[], className?: string, style?: any, clipPath?: string);

        drawPolygon(xs: number[], ys: number[], className?: string, style?: any, clipPath?: string);

        drawPieSegment(cx: number, cy: number, radius: number, startAngle: number, sweepAngle: number,
            className?: string, style?: any, clipPath?: string);
        drawDonutSegment(cx: number, cy: number, radius: number, innerRadius: number, startAngle: number, sweepAngle: number,
            className?: string, style?: any, clipPath?: string);
        
        drawString(s: string, pt: Point, className?: string, style?: any);
        drawStringRotated(label: string, pt: Point, center: Point, angle: number, className?: string, style?: any);
        
        drawImage(imageHref:string, x: number, y: number, w: number, h: number);

        measureString(s: string, className?: string, groupName?: string, style?: any): Size;

        startGroup(className?: string, clipPath?: string, createTransform?:boolean);
        endGroup();
        addClipRect(clipRect: Rect, id: string);
    }
 
}

