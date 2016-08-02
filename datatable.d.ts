import "datatables.net";
import "datatables.net-bt";
export interface DataTableOptions {
    dataTable?: DataTables.Settings;
    src?: string | JQuery;
    loadingMessage?: string;
    resetGroupActionInputOnSuccess?: boolean;
    filterApplyAction?: string;
    filterCancelAction?: string;
    onDataLoad?: (dataTable: DataTable) => void;
    onError?: (dataTable: DataTable) => void;
    onSuccess?: (dataTable: DataTable, response: DataTableResponseData) => void;
}
export interface DataTableResponseData {
    raw: number;
    recordsFiltered: number;
    recordsTotal: number;
    customActionMessage?: string;
    customActionStatus?: string;
    data: any[];
}
export declare class DataTable {
    tableOptions: DataTableOptions;
    dataTable: DataTables.DataTable;
    table: JQuery;
    tableContainer: JQuery;
    tableWrapper: JQuery;
    tableInitialized: boolean;
    private ajaxParams;
    private countSelectedRecords();
    constructor(options: DataTableOptions);
    submitFilter(): void;
    resetFilter(): void;
    getSelectedRowsCount(): number;
    getSelectedRows(): any[];
    setAjaxParam(name: any, value: any): void;
    addAjaxParam(name: any, value: any): void;
    clearAjaxParams(): void;
    getDataTable(): DataTables.DataTable;
    getTableWrapper(): JQuery;
    gettableContainer(): JQuery;
    getTable(): JQuery;
}
