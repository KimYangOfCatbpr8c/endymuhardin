import * as wjcGrid from 'wijmo/wijmo.grid';
/**
 * Provides flyout menus when the mouse hovers over a FlexGrid's column headers.
 */
export declare class FlexGridFlyout {
    _g: wjcGrid.FlexGrid;
    _flyout: HTMLElement;
    _col: wjcGrid.Column;
    _toUpdate: any;
    static _SHOWDELAY: number;
    static _HIDEDELAY: number;
    /**
     * Initializes a new instance of the @see:FlexGridFlyout class.
     *
     * @param flex @see:FlexGrid that will receive the flyout menus.
     */
    constructor(flex: wjcGrid.FlexGrid);
    /**
     * Gets a reference to the @see:HTMLElement that represents the flyout menu.
     */
    readonly flyout: HTMLElement;
    /**
     * Gets a reference to the @see:Column that owns the flyout menu currently being shown.
     */
    readonly column: wjcGrid.Column;
    _mouseenter(e: MouseEvent): void;
    _mouseleave(e: MouseEvent): void;
    _show(e: MouseEvent): void;
    _hide(e: MouseEvent): void;
}
