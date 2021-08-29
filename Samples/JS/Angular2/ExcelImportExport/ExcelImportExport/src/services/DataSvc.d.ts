export declare class DataSvc {
    private _products;
    private _countries;
    private _colors;
    readonly products: string[];
    readonly countries: string[];
    readonly colors: string[];
    getProductOrders(count: number): any[];
    getExpenseItems(): any[];
    getEmployeesWithExpences(): any[];
}
