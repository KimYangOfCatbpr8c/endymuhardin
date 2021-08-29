import * as wjcOdata from 'wijmo/wijmo.odata';
import { DataSvc } from '../services/DataSvc';
export declare class AlphabeticalListOfProductsCmp {
    products: wjcOdata.ODataCollectionView;
    categories: wjcOdata.ODataCollectionView;
    today: Date;
    constructor(dataSvc: DataSvc);
    find(view: any, prop: any, val: any): any;
}
export declare class AlphabeticalListOfProductsModule {
}
