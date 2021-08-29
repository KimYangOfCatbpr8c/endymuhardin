import * as wjcGrid from 'wijmo/wijmo.grid';
import * as wjcCore from 'wijmo/wijmo';
export declare class DataSvc {
    cityMap: wjcGrid.DataMap;
    orders: any[];
    groupedOrders: wjcCore.CollectionView;
    pagedOrders: wjcCore.CollectionView;
    addNewOrders: wjcCore.CollectionView;
    constructor();
    randBetween(min: any, max: any): number;
}
