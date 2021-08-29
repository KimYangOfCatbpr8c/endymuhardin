import * as wjcOdata from 'wijmo/wijmo.odata';
import { DataSvc } from '../services/DataSvc';
export declare class ProductsByCategoryCmp {
    products: wjcOdata.ODataCollectionView;
    categories: wjcOdata.ODataCollectionView;
    today: Date;
    constructor(dataSvc: DataSvc);
    select(view: any, prop: string, val: string): any[];
}
export declare class ProductsByCategoryModule {
}
