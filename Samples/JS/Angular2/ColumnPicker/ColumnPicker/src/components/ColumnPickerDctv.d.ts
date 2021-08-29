import * as ngCore from '@angular/core';
import * as WjFlexGrid from 'wijmo/wijmo.angular2.grid';
export declare class ColumnPicker implements ngCore.OnInit, ngCore.OnDestroy {
    private _flex;
    columnPicker: string;
    private _frame;
    private _img;
    constructor(_flex: WjFlexGrid.WjFlexGrid);
    ngOnInit(): void;
    ngOnDestroy(): void;
}
