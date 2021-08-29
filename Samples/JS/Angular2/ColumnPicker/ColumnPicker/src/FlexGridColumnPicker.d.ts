import * as wjcGrid from 'wijmo/wijmo.grid';
/**
 * Provides column picker for FlexGrid.
 */
export declare class FlexGridColumnPicker {
    _flex: wjcGrid.FlexGrid;
    columnPicker: string;
    private _frame;
    private _img;
    /**
     * Initializes a new instance of the @see:FlexGridColumnPicker class.
     *
     * @param flex @see:FlexGrid that will receive the column picker.
     */
    constructor(flex: wjcGrid.FlexGrid, columnPicker: string);
    private _createPickerImg();
    private _createPopIframe();
    private _populateFrame();
    private _initMouseDownOnBody();
    private _contains(parent, child);
}
