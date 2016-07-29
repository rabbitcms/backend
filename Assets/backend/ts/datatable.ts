/**
 * Created by lnkvisitor on 23.07.16.
 */

import * as $ from "jquery";
import "datatables.net";
import "datatables.net-bt";
import {RabbitCMS} from "rabbitcms/backend";
import * as i18n from "i18n!rabbitcms/nls/datatable";

export interface DataTableOptions {
    dataTable?:DataTables.Settings;
    src?:string|JQuery;
    loadingMessage?:string;
    resetGroupActionInputOnSuccess?:boolean;
    filterApplyAction?:string;
    filterCancelAction?:string;
    onDataLoad?:(dataTable:DataTable) => void;
    onError?:(dataTable:DataTable) => void;
    onSuccess?:(dataTable:DataTable, response:DataTableResponseData) => void;
}

export interface DataTableResponseData {
    raw:number;
    recordsFiltered:number;
    recordsTotal:number;
    customActionMessage?:string;
    customActionStatus?:string;
    data:any[];
}

interface AjaxParams {
    [propName:string]:any;
}
/***
 Wrapper/Helper Class for datagrid based on jQuery Datatable Plugin
 ***/
export class DataTable {

    tableOptions:DataTableOptions; // main options
    dataTable:DataTables.DataTable; // datatable object
    table:JQuery; // actual table jquery object
    tableContainer:JQuery; // actual table container object
    tableWrapper:JQuery; // actual table wrapper jquery object
    tableInitialized:boolean = false;
    private ajaxParams:AjaxParams = {}; // set filter mode

    private countSelectedRecords() {
        var selected = $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', this.table).length;
        if (selected > 0) {
            $('.table-group-actions > span', this.tableWrapper).text(i18n.groupActions.replace('_TOTAL_', selected.toString()));
        } else {
            $('.table-group-actions > span', this.tableWrapper).text("");
        }
    }

    //main function to initiate the module
    constructor(options:DataTableOptions) {
        // default settings
        options = $.extend(true, {
            src: "", // actual table
            filterApplyAction: "filter",
            filterCancelAction: "filter_cancel",
            resetGroupActionInputOnSuccess: true,
            loadingMessage: 'Loading...',
            dataTable: <DataTables.Settings>{
                dom: "<'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r><'table-responsive't><'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'>>", // datatable layout
                pageLength: 10, // default records per page
                language: i18n.dataTable,

                orderCellsTop: true,
                columnDefs: [],

                pagingType: "bootstrap_extended", // pagination type(bootstrap, bootstrap_full_number or bootstrap_extended)
                autoWidth: false, // disable fixed width and enable fluid table
                processing: false, // enable/disable display message box on record load
                serverSide: true, // enable/disable server side ajax loading
                stateSave: true,
                stateLoadParams: (settings:DataTables.SettingsLegacy, data:Object):void => {

                },
                stateSaveParams: (settings:DataTables.SettingsLegacy, data:Object):void => {
                    // data.filters = settings.;
                },
                ajax: (data:Object, callback:Function, settings:DataTables.SettingsLegacy) => {
                    console.log(settings);
                    $.each(this.ajaxParams, (key:string, value:any) => {
                        data[key] = value;
                    });
                    RabbitCMS.ajax({
                        url: this.table.data('link'),
                        method: 'post',
                        timeout: 10000,
                        data: data,
                        dataType: 'json',
                        warningTarget: this.tableContainer,
                        blockTarget: this.tableContainer,
                        blockOptions: {
                            message: this.tableOptions.loadingMessage,
                            overlayColor: 'none',
                            cenrerY: true,
                            boxed: true
                        },
                        success: (res:DataTableResponseData):any => {
                            if (res.customActionMessage) {
                                RabbitCMS.alert({
                                    type: (res.customActionStatus == 'OK' ? 'success' : 'danger'),
                                    icon: (res.customActionStatus == 'OK' ? 'check' : 'warning'),
                                    message: res.customActionMessage,
                                    container: this.tableWrapper,
                                    place: 'prepend'
                                });
                            }

                            if (res.customActionStatus) {
                                if (this.tableOptions.resetGroupActionInputOnSuccess) {
                                    $('.table-group-action-input', this.tableWrapper).val("");
                                }
                            }

                            if ($('.group-checkable', this.table).length === 1) {
                                $('.group-checkable', this.table).prop("checked", false);
                            }

                            if (this.tableOptions.onSuccess) {
                                this.tableOptions.onSuccess.call(undefined, this, res);
                            }
                            callback(res);
                        },
                        error: () => { // handle general connection errors
                            if (this.tableOptions.onError) {
                                this.tableOptions.onError.call(undefined, this);
                            }
                        }
                    });
                },
                // ajax: { // define ajax settings
                //     url: "", // ajax URL
                //     type: "POST", // request type
                //     timeout: 20000,
                //     data: (data:AjaxParams) => { // add request parameters before submit
                //         $.each(this.ajaxParams, (key:string, value:any) => {
                //             data[key] = value;
                //         });
                //         RabbitCMS.blockUI(this.tableContainer, {
                //             message: this.tableOptions.loadingMessage,
                //             overlayColor: 'none',
                //             cenrerY: true,
                //             boxed: true
                //         });
                //     },
                //     dataSrc: (res:DataTableResponseData) => { // Manipulate the data returned from the server
                //         if (res.customActionMessage) {
                //             RabbitCMS.alert({
                //                 type: (res.customActionStatus == 'OK' ? 'success' : 'danger'),
                //                 icon: (res.customActionStatus == 'OK' ? 'check' : 'warning'),
                //                 message: res.customActionMessage,
                //                 container: this.tableWrapper,
                //                 place: 'prepend'
                //             });
                //         }
                //
                //         if (res.customActionStatus) {
                //             if (this.tableOptions.resetGroupActionInputOnSuccess) {
                //                 $('.table-group-action-input', this.tableWrapper).val("");
                //             }
                //         }
                //
                //         if ($('.group-checkable', this.table).length === 1) {
                //             $('.group-checkable', this.table).prop("checked", false);
                //         }
                //
                //         if (this.tableOptions.onSuccess) {
                //             this.tableOptions.onSuccess.call(undefined, this, res);
                //         }
                //
                //         RabbitCMS.unblockUI(this.tableContainer);
                //
                //         return res.data;
                //     },
                //     error: () => { // handle general connection errors
                //         if (this.tableOptions.onError) {
                //             this.tableOptions.onError.call(undefined, this);
                //         }
                //
                //         RabbitCMS.alert({
                //             type: 'danger',
                //             icon: 'warning',
                //             message: i18n.ajaxRequestGeneralError,
                //             container: this.tableWrapper,
                //             place: 'prepend'
                //         });
                //
                //         RabbitCMS.unblockUI(this.tableContainer);
                //     }
                // },

                drawCallback: ()=> { // run some code on table redraw
                    if (this.tableInitialized === false) { // check if table has been initialized
                        this.tableInitialized = true; // set table initialized
                        this.table.show(); // display table
                    }
                    this.countSelectedRecords(); // reset selected records indicator

                    // callback for ajax data load
                    if (this.tableOptions.onDataLoad) {
                        this.tableOptions.onDataLoad.call(undefined, this);
                    }
                }
            }
        }, options);

        this.tableOptions = options;

        // create table's jquery object
        this.table = $(options.src);


        // if ((<DataTables.AjaxSettings>options.dataTable.ajax).url === '' && this.table.data('link')) {
        //     (<DataTables.AjaxSettings>options.dataTable.ajax).url = this.table.data('link');
        // }


        this.tableContainer = this.table.parents(".table-container");

        // apply the special class that used to restyle the default datatable
        var tmp = $.fn.dataTableExt.oStdClasses;

        $.fn.dataTableExt.oStdClasses.sWrapper = $.fn.dataTableExt.oStdClasses.sWrapper + " dataTables_extended_wrapper";
        $.fn.dataTableExt.oStdClasses.sFilterInput = "form-control input-xs input-sm input-inline";
        $.fn.dataTableExt.oStdClasses.sLengthSelect = "form-control input-xs input-sm input-inline";

        // initialize a datatable
        this.dataTable = this.table.DataTable(options.dataTable);

        // revert back to default
        $.fn.dataTableExt.oStdClasses.sWrapper = tmp.sWrapper;
        $.fn.dataTableExt.oStdClasses.sFilterInput = tmp.sFilterInput;
        $.fn.dataTableExt.oStdClasses.sLengthSelect = tmp.sLengthSelect;

        // get table wrapper
        this.tableWrapper = this.table.parents('.dataTables_wrapper');

        // build table group actions panel
        if ($('.table-actions-wrapper', this.tableContainer).length === 1) {
            $('.table-group-actions', this.tableWrapper).html($('.table-actions-wrapper', this.tableContainer).html()); // place the panel inside the wrapper
            $('.table-actions-wrapper', this.tableContainer).remove(); // remove the template container
        }
        // handle group checkboxes check/uncheck
        $('.group-checkable', this.table).change((e) => {
            var set = this.table.find('tbody > tr > td:nth-child(1) input[type="checkbox"]');
            var checked = $(e.target).prop("checked");
            $(set).each(function () {
                $(this).prop("checked", checked);
            });
            this.countSelectedRecords();
        });

        this.table.on('change', '.form-filter', () => {
            this.submitFilter();
        });

        // handle row's checkbox click
        this.table.on('change', 'tbody > tr > td:nth-child(1) input[type="checkbox"]', ()=> {
            this.countSelectedRecords();
        });

        // handle filter submit button click
        this.table.on('click', '.filter-submit', (e)=> {
            e.preventDefault();
            this.submitFilter();
        });

        // handle filter cancel button click
        this.table.on('click', '.filter-cancel', (e)=> {
            e.preventDefault();
            this.resetFilter();
        });
    };

    submitFilter() {
        this.setAjaxParam("action", this.tableOptions.filterApplyAction);

        // get all typeable inputs
        $('textarea.form-filter, select.form-filter, input.form-filter:not([type="radio"],[type="checkbox"])', this.table).each((i, e)=> {
            this.setAjaxParam($(e).attr("name"), $(e).val());
        });

        // get all checkboxes
        $('input.form-filter[type="checkbox"]:checked', this.table).each((i, e)=> {
            this.addAjaxParam($(e).attr("name"), $(e).val());
        });

        // get all radio buttons
        $('input.form-filter[type="radio"]:checked', this.table).each((i, e)=> {
            this.setAjaxParam($(e).attr("name"), $(e).val());
        });

        this.dataTable.ajax.reload();
    }

    resetFilter() {
        $('textarea.form-filter, select.form-filter, input.form-filter', this.table).each(function () {
            $(this).val("");
        });
        $('input.form-filter[type="checkbox"]', this.table).each(function () {
            $(this).prop("checked", false);
        });
        this.clearAjaxParams();
        this.addAjaxParam("action", this.tableOptions.filterCancelAction);
        this.dataTable.ajax.reload();
    }

    getSelectedRowsCount() {
        return $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', this.table).length;
    }

    getSelectedRows() {
        var rows = [];
        $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', this.table).each(function () {
            rows.push($(this).val());
        });

        return rows;
    }

    setAjaxParam(name, value) {
        this.ajaxParams[name] = value;
    }

    addAjaxParam(name, value) {
        if (!this.ajaxParams[name]) {
            this.ajaxParams[name] = [];
        }

        var skip = false;
        for (var i = 0; i < (this.ajaxParams[name]).length; i++) { // check for duplicates
            if (this.ajaxParams[name][i] === value) {
                skip = true;
            }
        }

        if (skip === false) {
            this.ajaxParams[name].push(value);
        }
    }

    clearAjaxParams() {
        this.ajaxParams = {};
    }

    getDataTable() {
        return this.dataTable;
    }

    getTableWrapper() {
        return this.tableWrapper;
    }

    gettableContainer() {
        return this.tableContainer;
    }

    getTable() {
        return this.table;
    }
}
