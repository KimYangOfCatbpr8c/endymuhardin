import * as wjcOdata from 'wijmo/wijmo.odata';
import { DataSvc } from '../services/DataSvc';
export declare class EmployeesCmp {
    employees: wjcOdata.ODataCollectionView;
    images: string[];
    constructor(dataSvc: DataSvc);
}
export declare class EmployeesModule {
}
