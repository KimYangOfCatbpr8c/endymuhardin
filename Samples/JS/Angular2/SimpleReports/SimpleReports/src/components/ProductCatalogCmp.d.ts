import * as wjcOdata from 'wijmo/wijmo.odata';
import { DataSvc } from '../services/DataSvc';
export declare class ProductCatalogCmp {
    products: wjcOdata.ODataCollectionView;
    categories: wjcOdata.ODataCollectionView;
    constructor(dataSvc: DataSvc);
    select(view: any, prop: string, val: string): any[];
}
export declare class ProductCatalogModule {
}
