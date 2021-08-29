import * as wjcGrid from 'wijmo/wijmo.grid';
import { WjFlexGrid } from 'wijmo/wijmo.angular2.grid';
import { SelectionType } from '../cellTemplates/EditableSelectionRenderer';
export declare class InheritedGrid extends WjFlexGrid {
    private _showSelectColumn;
    private _isEditable;
    selectionType: SelectionType;
    created(): void;
    isEditable: boolean;
    onFormatItem(e: wjcGrid.FormatItemEventArgs): void;
}
