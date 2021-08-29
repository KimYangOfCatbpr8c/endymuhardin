import { CollectionView, Event, EventArgs, RequestErrorEventArgs, PageChangingEventArgs } from 'wijmo/wijmo';
/**
 * Base class for server-based CollectionView classes.
 *
 * To use it, create a class that extends @see:ServerCollectionViewBase
 * and add overrides for the following methods:
 *
 * <ul>
 *    <li>_getReadUrl</li>
 *    <li>_getWriteUrl</li>
 *    <li>_getReadParameters</li>
 *    <li>_getFilterDefinition</li>
 * </ul>
 */
export declare class ServerCollectionViewBase extends CollectionView {
    _url: string;
    _count: number;
    _toGetData: number;
    _loading: boolean;
    _filterDef: string;
    _requestHeaders: any;
    _sortOnServer: boolean;
    _pageOnServer: boolean;
    _filterOnServer: boolean;
    _changeCount: number;
    /**
     * Initializes a new instance of the @see:ServerCollectionViewBase class.
     *
     * @param url Url of the data service (e.g. 'DataHandler.ashx').
     * @param options JavaScript object containing initialization data (property
     * values and event handlers) for the @see:ServerCollectionView.
     */
    constructor(url: string, options?: any);
    /**
     * Gets or sets a value that determines whether sort operations
     * should be performed on the server or on the client.
     *
     * Use the @see:sortDescriptions property to specify how the
     * data should be sorted.
     */
    sortOnServer: boolean;
    /**
     * Gets or sets a value that determines whether paging should be
     * performed on the server or on the client.
     *
     * Use the @see:pageSize property to enable paging.
     */
    pageOnServer: boolean;
    /**
     * Gets or sets a value that determines whether filtering should be performed on
     * the server or on the client.
     *
     * Use the @see:filter property to perform filtering on the client, and use the
     * @see:filterDefinition property to perform filtering on the server.
     *
     * In some cases it may be desirable to apply independent filters on the client
     * <b>and</b> on the server.
     *
     * You can achieve this by setting (1) the @see:filterOnServer property to false
     * and the @see:filter property to a filter function (to enable client-side filtering)
     * and (2) the @see:filterDefinition property to a filter string (to enable server-side
     * filtering).
     */
    filterOnServer: boolean;
    /**
     * Gets or sets a string containing an OData filter specification to
     * be used for filtering the data on the server.
     */
    filterDefinition: string;
    /**
     * Updates the filter definition based on a known filter provider such as the
     * @see:FlexGridFilter.
     *
     * @param filterProvider Known filter provider, typically an instance of a
     * @see:FlexGridFilter.
     */
    updateFilterDefinition(filterProvider: any): void;
    /**
     * Gets or sets an object containing request headers to be used when sending
     * or requesting data.
     *
     * The most typical use for this property is in scenarios where authentication
     * is required. For example:
     *
     * <pre>var categories = new wijmo.odata.ODataCollectionView(serviceUrl, 'Categories', {
     *   fields: ['Category_ID', 'Category_Name'],
     *   requestHeaders: { Authorization: db.token }
     * });</pre>
     */
    requestHeaders: any;
    /**
     * Gets a value that indicates the @see:ServerCollectionView is
     * currently loading data.
     *
     * This property can be used to provide progress indicators.
     */
    readonly isLoading: boolean;
    /**
     * Occurs when the @see:ServerCollectionView starts loading data.
     */
    loading: Event;
    /**
     * Raises the @see:loading event.
     */
    onLoading(e?: EventArgs): void;
    /**
     * Occurs when the @see:ServerCollectionView finishes loading data.
     */
    loaded: Event;
    /**
     * Raises the @see:loaded event.
     */
    onLoaded(e?: EventArgs): void;
    /**
     * Loads or re-loads the data from the server.
     */
    load(): void;
    /**
     * Occurs when there is an error reading or writing data.
     */
    error: Event;
    /**
     * Raises the @see:error event.
     *
     * By default, errors throw exceptions and trigger a data refresh. If you
     * want to prevent this behavior, set the @see:RequestErrorEventArgs.cancel
     * parameter to true in the event handler.
     *
     * @param e @see:RequestErrorEventArgs that contains information about the error.
     */
    onError(e: RequestErrorEventArgs): boolean;
    /**
     * Gets the total number of items in the view before paging is applied.
     */
    readonly totalItemCount: number;
    /**
     * Gets the total number of pages.
     */
    readonly pageCount: number;
    /**
     * Gets or sets the number of items to display on a page.
     */
    pageSize: number;
    /**
     * Raises the @see:pageChanging event.
     *
     * @param e @see:PageChangingEventArgs that contains the event data.
     */
    onPageChanging(e: PageChangingEventArgs): boolean;
    /**
     * Override @see:commitNew to add the new item to the database.
     */
    commitNew(): void;
    /**
     * Override @see:commitEdit to modify the item in the database.
     */
    commitEdit(): void;
    /**
     * Override @see:remove to remove the item from the database.
     *
     * @param item Item to be removed from the database.
     */
    remove(item: any): void;
    _getPageView(): any[];
    _performRefresh(): void;
    private _getData();
    private _error(xhr);
    _parseJSON(text: string): any;
    _encodeUrl(value: any): any;
    protected _getReadUrl(): string;
    private _getWriteUrl(item?);
    protected _getReadParameters(): any;
    protected _getFilterDefinition(filterProvider: any): string;
}
/**
 * Extends @see: wijmo.collections.ServerCollectionViewBase to retrieve sorted
 * and paginated data from a very simple data service.
 */
export declare class ServerCollectionView extends ServerCollectionViewBase {
    /**
     * Initializes a new instance of the @see:ServerCollectionViewBase class.
     *
     * @param url Url of the data service (e.g. 'DataHandler.ashx').
     * @param options JavaScript object containing initialization data (property
     * values and event handlers) for the @see:ServerCollectionView.
     */
    constructor(url: string, options?: any);
    protected _getReadUrl(): string;
    protected _getReadParameters(): any;
    protected _getFilterDefinition(filter: any): string;
    private _getValueFilterDefinition(vf);
    private _getConditionFilterDefinition(cf);
    private _getConditionDefinition(cf, cond);
    private _encodeFilterValue(val, dataType);
}
