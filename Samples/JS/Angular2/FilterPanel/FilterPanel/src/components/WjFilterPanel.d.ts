import * as wjcGridFilter from 'wijmo/wijmo.grid.filter';
import { FilterPanel } from '../FilterPanel';
import { ElementRef } from '@angular/core';
export declare class WjFilterPanel extends FilterPanel {
    filter: wjcGridFilter.FlexGridFilter;
    placeholder: string;
    constructor(elRef: ElementRef);
}
