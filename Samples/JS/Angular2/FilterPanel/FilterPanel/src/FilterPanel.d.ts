import * as wjcCore from 'wijmo/wijmo';
import * as wjcGridFilter from 'wijmo/wijmo.grid.filter';
export declare class FilterPanel extends wjcCore.Control {
    _filter: wjcGridFilter.FlexGridFilter;
    _divMarkers: HTMLElement;
    _divPH: HTMLElement;
    _filterChangedBnd: any;
    /**
        * Gets or sets the template used to instantiate @see:FilterPanel controls.
        */
    static controlTemplate: string;
    /**
        * Initializes a new instance of the @see:FilterPanel class.
        */
    constructor(element: any, options?: any);
    /**
        * Gets or sets a string to display in the control when it contains no groups.
        */
    placeholder: string;
    /**
        * Gets or sets the @see:FlexGridFilter that is connected to this @see:FilterPanel.
        */
    filter: wjcGridFilter.FlexGridFilter;
    /**
        * Updates the panel to show the current groups.
        */
    refresh(): void;
    _click(e: MouseEvent): void;
    _filterChanged(): void;
    _isTimeFormat(fmt: string): boolean;
    _createMarker(hdr: string, removeButton: boolean): HTMLElement;
    _createFilterMarker(cf: wjcGridFilter.ColumnFilter): HTMLElement;
    _getFilterHeader(cf: wjcGridFilter.ColumnFilter): string;
    _getConditionFilterHeader(cf: wjcGridFilter.ColumnFilter): string;
    _getConditionHeader(cf: wjcGridFilter.ColumnFilter, c: wjcGridFilter.FilterCondition): string;
    _getValueFilterHeader(cf: wjcGridFilter.ColumnFilter): string;
}
