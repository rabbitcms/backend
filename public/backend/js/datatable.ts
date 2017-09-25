/// <reference path="../dt/index.d.ts" />

/**
 * Created by lnkvisitor on 23.07.16.
 */

import * as $ from "jquery";
import * as jszip from "jszip";
import "pdfmake";
import "pdfmake/vfs_fonts";
import "datatables.net";
import "datatables.net-bs";
import "datatables.net-buttons";
import "datatables.net-buttons/js/buttons.bootstrap.min";
import "datatables.net-buttons/js/buttons.colVis.min";
import "datatables.net-buttons/js/buttons.html5.min";
import "datatables.net-buttons/js/buttons.print.min";
import "datatables.net-colReorder";
import "datatables.net-rowReorder";
import {RabbitCMS} from "rabbitcms/backend";
import * as i18n from "i18n!rabbitcms/nls/datatable";
import "css!datatables.net-buttons/css/buttons.bootstrap.min.css";

window['JSZip'] = jszip;

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

    private timer;

    //main function to initiate the module
    constructor(options:DataTableOptions) {
        // default settings
        let filters = $('.form-filter', $(options.src).parents(".table-container"));

        options = $.extend(true, {
            src: "", // actual table
            filterApplyAction: "filter",
            filterCancelAction: "filter_cancel",
            resetGroupActionInputOnSuccess: true,
            loadingMessage: 'Loading...',
            dataTable: <DataTables.Settings>{
                dom: "<'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'<'table-group-actions pull-right'B>>r><'table-responsive't><'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'>>", // datatable layout
                pageLength: 10, // default records per page
                language: i18n.dataTable,

                orderCellsTop: true,
                columnDefs: [],
                buttons: [],

                pagingType: "bootstrap_extended", // pagination type(bootstrap, bootstrap_full_number or bootstrap_extended)
                autoWidth: false, // disable fixed width and enable fluid table
                processing: false, // enable/disable display message box on record load
                serverSide: true, // enable/disable server side ajax loading
                stateSave: true,
                /* deferLoading: 0, */ //TODO: Решыть проблему с лтшним обновлением таблицы
                stateLoadParams: (settings:DataTables.SettingsLegacy, data:Object):void => {
                    if (filters.length) {
                        filters.each((index, elem) => {
                            let filter = $(elem);
                            let name = $(elem).attr('name');

                            if (data.hasOwnProperty(name))
                                filter.val(data[name]);
                        });

                        this.submitFilter();
                    }
                },
                stateSaveParams: (settings:DataTables.SettingsLegacy, data:Object):Object => {
                    filters.each(function() {
                        let self = $(this);
                        if (self.attr('name'))
                            data[self.attr('name')] = self.val().replace('"', '"');
                    });
                    return data;
                },
                ajax: (data:Object, callback:Function, settings:DataTables.SettingsLegacy) => {
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

        this.tableContainer.on('change', '.form-filter', () => {
            this.submitFilter();
        });

        // handle row's checkbox click
        this.table.on('change', 'tbody > tr > td:nth-child(1) input[type="checkbox"]', ()=> {
            this.countSelectedRecords();
        });

        // handle filter submit button click
        this.tableContainer.on('click', '.filter-submit', (e)=> {
            e.preventDefault();
            this.submitFilter();
        });

        // handle filter cancel button click
        this.tableContainer.on('click', '.filter-cancel', (e)=> {
            e.preventDefault();
            this.resetFilter();
        });
    };

    submitFilter() {
        this.setAjaxParam("action", this.tableOptions.filterApplyAction);

        // get all typeable inputs
        $('textarea.form-filter, select.form-filter, input.form-filter:not([type="radio"],[type="checkbox"])', this.tableContainer).each((i, e)=> {
            this.setAjaxParam($(e).attr("name"), $(e).val());
        });

        // get all checkboxes
        $('input.form-filter[type="checkbox"]:checked', this.tableContainer).each((i, e)=> {
            this.addAjaxParam($(e).attr("name"), $(e).val());
        });

        // get all radio buttons
        $('input.form-filter[type="radio"]:checked', this.tableContainer).each((i, e)=> {
            this.setAjaxParam($(e).attr("name"), $(e).val());
        });

        this.update();
    }

    resetFilter() {
        $('textarea.form-filter, select.form-filter, input.form-filter', this.tableContainer).each(function () {
            $(this).val("").trigger('change');
        });
        $('input.form-filter[type="checkbox"]', this.tableContainer).each(function () {
            $(this).prop("checked", false);
        });
        this.clearAjaxParams();
        this.addAjaxParam("action", this.tableOptions.filterCancelAction);

        this.update();
    }

    update() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.dataTable.ajax.reload();
        }, 10);
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

    getTableContainer() {
        return this.tableContainer;
    }

    getTable() {
        return this.table;
    }
}
