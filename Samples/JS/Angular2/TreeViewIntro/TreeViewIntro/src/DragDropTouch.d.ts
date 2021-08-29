declare module DragDropTouch {
    /**
     * Object used to hold the data that is being dragged during drag and drop operations.
     *
     * It may hold one or more data items of different types. For more information about
     * drag and drop operations and data transfer objects, see
     * <a href="https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer">HTML Drag and Drop API</a>.
     *
     * This object is created automatically by the @see:DragDropTouch singleton and is
     * accessible through the @see:dataTransfer property of all drag events.
     */
    class DataTransfer {
        private _dropEffect;
        private _effectAllowed;
        private _data;
        /**
         * Gets or sets the type of drag-and-drop operation currently selected.
         * The value must be 'none',  'copy',  'link', or 'move'.
         */
        dropEffect: string;
        /**
         * Gets or sets the types of operations that are possible.
         * Must be one of 'none', 'copy', 'copyLink', 'copyMove', 'link',
         * 'linkMove', 'move', 'all' or 'uninitialized'.
         */
        effectAllowed: string;
        /**
         * Gets an array of strings giving the formats that were set in the @see:dragstart event.
         */
        readonly types: string[];
        /**
         * Removes the data associated with a given type.
         *
         * The type argument is optional. If the type is empty or not specified, the data
         * associated with all types is removed. If data for the specified type does not exist,
         * or the data transfer contains no data, this method will have no effect.
         *
         * @param type Type of data to remove.
         */
        clearData(type?: string): void;
        /**
         * Retrieves the data for a given type, or an empty string if data for that type does
         * not exist or the data transfer contains no data.
         *
         * @param type Type of data to retrieve.
         */
        getData(type: string): string;
        /**
         * Set the data for a given type.
         *
         * For a list of recommended drag types, please see
         * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Recommended_Drag_Types.
         *
         * @param type Type of data to add.
         * @param value Data to add.
         */
        setData(type: string, value: string): void;
        /**
         * Set the image to be used for dragging if a custom one is desired.
         *
         * @param img An image element to use as the drag feedback image.
         * @param offsetX The horizontal offset within the image.
         * @param offsetY The vertical offset within the image.
         */
        setDragImage(img: HTMLElement, offsetX: number, offsetY: number): void;
    }
    /**
     * Defines a class that adds support for touch-based HTML5 drag/drop operations.
     *
     * The @see:DragDropTouch class listens to touch events and raises the
     * appropriate HTML5 drag/drop events as if the events had been caused
     * by mouse actions.
     *
     * The purpose of this class is to enable using existing, standard HTML5
     * drag/drop code on mobile devices running IOS or Android.
     *
     * To use, include the DragDropTouch.js file on the page. The class will
     * automatically start monitoring touch events and will raise the HTML5
     * drag drop events (dragstart, dragenter, dragleave, drop, dragend) which
     * should be handled by the application.
     *
     * For details and examples on HTML drag and drop, see
     * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_operations.
     */
    class DragDropTouch {
        private _dragSource;
        private _img;
        private _ptDown;
        private _lastTouch;
        private _lastTarget;
        private _lastClick;
        private _dataTransfer;
        _imgCustom: HTMLElement;
        _imgOffset: any;
        static _instance: DragDropTouch;
        private static _THRESHOLD;
        private static _OPACITY;
        private static _DBLCLICK;
        private static _CTXMENU;
        /**
         * Initializes the single instance of the @see:DragDropTouch class.
         */
        constructor();
        /**
         * Gets a reference to the @see:DragDropTouch singleton.
         */
        static getInstance(): DragDropTouch;
        _touchstart(e: any): void;
        _touchmove(e: any): void;
        _touchend(e: any): void;
        _shouldHandle(e: TouchEvent): boolean;
        _reset(): void;
        _getPoint(e: any, page?: boolean): any;
        _getDelta(e: any): number;
        _getTarget(e: any): Element;
        _createImage(e: any): void;
        _destroyImage(): void;
        _moveImage(e: any): void;
        _copyProps(dst: any, src: any, props: string[]): void;
        private static _rmvAtts;
        _copyStyle(src: HTMLElement, dst: HTMLElement): void;
        private static _kbdProps;
        private static _ptProps;
        _dispatchEvent(e: any, type: string, target: Element): boolean;
        _closestDraggable(e: HTMLElement): HTMLElement;
    }
}
