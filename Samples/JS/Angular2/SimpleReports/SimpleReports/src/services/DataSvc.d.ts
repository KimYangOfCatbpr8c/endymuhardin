import * as wjcOdata from 'wijmo/wijmo.odata';
import * as wjcCore from 'wijmo/wijmo';
export declare class DataSvc {
    products: wjcOdata.ODataCollectionView;
    categories: wjcOdata.ODataCollectionView;
    employees: wjcOdata.ODataCollectionView;
    customers: wjcOdata.ODataCollectionView;
    productSales: wjcOdata.ODataCollectionView;
    invoices: wjcOdata.ODataCollectionView;
    reports: wjcCore.CollectionView;
    minInvoiceAmount: number;
    viewsLoaded: number;
    viewsLoadedFun: Function;
    initData(): void;
    viewLoaded(): void;
}
