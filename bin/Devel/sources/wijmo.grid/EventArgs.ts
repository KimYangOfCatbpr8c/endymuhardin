module wijmo.grid {
    'use strict';

    /**
     * Provides arguments for @see:CellRange events.
     */
    export class CellRangeEventArgs extends CancelEventArgs {
        _p: GridPanel;
        _rng: CellRange;
        _data: any;

        /**
         * Initializes a new instance of the @see:CellRangeEventArgs class.
         *
         * @param p @see:GridPanel that contains the range.
         * @param rng Range of cells affected by the event.
         * @param data Data related to the event.
         */
        constructor(p: GridPanel, rng: CellRange, data?: any) {
            super();
            this._p = asType(p, GridPanel);
            this._rng = asType(rng, CellRange);
            this._data = data;
        }
        /**
         * Gets the @see:GridPanel affected by this event.
         */
        get panel(): GridPanel {
            return this._p;
        }
        /**
         * Gets the @see:CellRange affected by this event.
         */
        get range(): CellRange {
            return this._rng.clone();
        }
        /**
         * Gets the row affected by this event.
         */
        get row(): number {
            return this._rng.row;
        }
        /**
         * Gets the column affected by this event.
         */
        get col(): number {
            return this._rng.col;
        }
        /**
         * Gets or sets the data associated with the event.
         */
        get data(): any {
            return this._data;
        }
        set data(value: any) {
            this._data = value;
        }
    }

    /**
     * Provides arguments for the @see:FlexGrid.formatItem event.
     */
    export class FormatItemEventArgs extends CellRangeEventArgs {
        _cell: HTMLElement;

        /**
        * Initializes a new instance of the @see:FormatItemEventArgs class.
        *
        * @param p @see:GridPanel that contains the range.
        * @param rng Range of cells affected by the event.
        * @param cell Element that represents the grid cell to be formatted.
        */
        constructor(p: GridPanel, rng: CellRange, cell: HTMLElement) {
            super(p, rng);
            this._cell = asType(cell, HTMLElement);
        }
        /**
         * Gets a reference to the element that represents the grid cell to be formatted.
         */
        get cell(): HTMLElement {
            return this._cell;
        }
   }

    /**
     * Provides arguments for the @see:FlexGrid.cellEditEnding event.
     */
    export class CellEditEndingEventArgs extends CellRangeEventArgs {
        _stayInEditMode: boolean;

        /**
         * Gets or sets whether the cell should remain in edit mode instead
         * of finishing the edits.
         */
        get stayInEditMode(): boolean {
            return this._stayInEditMode;
        }
        set stayInEditMode(value: boolean) {
            this._stayInEditMode = asBoolean(value);
        }
    }
}