import * as wjcGrid from 'wijmo/wijmo.grid';
import { QueryList } from '@angular/core';
import { SelectionType } from '../cellTemplates/EditableSelectionRenderer';
export declare class AggregatedGrid {
    private _isEditable;
    itemsSource: any;
    selectionType: SelectionType;
    SelectionTypeEnum: typeof SelectionType;
    flex: wjcGrid.FlexGrid;
    columns: QueryList<AggregatedGridColumn>;
    onFormatItem: (e: wjcGrid.FormatItemEventArgs) => void;
    constructor();
    isEditable: boolean;
    private _onFormatItem(e);
}
export declare class AggregatedGridColumn {
    header: string;
    binding: string;
    width: number | string;
    cellTemplate: any;
}
