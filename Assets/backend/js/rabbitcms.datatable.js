define(["require", "exports", "jquery", "rabbitcms.backend", "datatables.net"], function (require, exports, $, rabbitcms_backend_1) {
    "use strict";
    function DataTable() {
        var tableOptions;
        var dataTable;
        var table;
        var tableContainer;
        var tableWrapper;
        var tableInitialized = false;
        var ajaxParams = {};
        var the;
        var countSelectedRecords = function () {
            var selected = $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', table).length;
            var text = tableOptions.dataTable.language.metronicGroupActions;
            if (selected > 0) {
                $('.table-group-actions > span', tableWrapper).text(text.replace("_TOTAL_", selected));
            }
            else {
                $('.table-group-actions > span', tableWrapper).text("");
            }
        };
        return {
            init: function (options) {
                if (!$().dataTable) {
                    return;
                }
                the = this;
                options = $.extend(true, {
                    src: "",
                    filterApplyAction: "filter",
                    filterCancelAction: "filter_cancel",
                    resetGroupActionInputOnSuccess: true,
                    loadingMessage: 'Loading...',
                    dataTable: {
                        "dom": "<'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r><'table-responsive't><'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'>>",
                        "pageLength": 10,
                        "language": {
                            "metronicGroupActions": "_TOTAL_ records selected:  ",
                            "metronicAjaxRequestGeneralError": "Could not complete request. Please check your internet connection",
                            "lengthMenu": "<span class='seperator'>|</span>View _MENU_ records",
                            "info": "<span class='seperator'>|</span>Found total _TOTAL_ records",
                            "infoEmpty": "No records found to show",
                            "emptyTable": "No data available in table",
                            "zeroRecords": "No matching records found",
                            "paginate": {
                                "previous": "Prev",
                                "next": "Next",
                                "last": "Last",
                                "first": "First",
                                "page": "Page",
                                "pageOf": "of"
                            }
                        },
                        "orderCellsTop": true,
                        "columnDefs": [{
                                'orderable': false,
                                'targets': [0]
                            }],
                        "pagingType": "bootstrap_extended",
                        "autoWidth": false,
                        "processing": false,
                        "serverSide": true,
                        "ajax": {
                            "url": "",
                            "type": "POST",
                            "timeout": 20000,
                            "data": function (data) {
                                $.each(ajaxParams, function (key, value) {
                                    data[key] = value;
                                });
                                rabbitcms_backend_1.RabbitCMS.blockUI({
                                    message: tableOptions.loadingMessage,
                                    target: tableContainer,
                                    overlayColor: 'none',
                                    cenrerY: true,
                                    boxed: true
                                });
                            },
                            "dataSrc": function (res) {
                                if (res.customActionMessage) {
                                    rabbitcms_backend_1.RabbitCMS.alert({
                                        type: (res.customActionStatus == 'OK' ? 'success' : 'danger'),
                                        icon: (res.customActionStatus == 'OK' ? 'check' : 'warning'),
                                        message: res.customActionMessage,
                                        container: tableWrapper,
                                        place: 'prepend'
                                    });
                                }
                                if (res.customActionStatus) {
                                    if (tableOptions.resetGroupActionInputOnSuccess) {
                                        $('.table-group-action-input', tableWrapper).val("");
                                    }
                                }
                                if ($('.group-checkable', table).length === 1) {
                                    $('.group-checkable', table).prop("checked", false);
                                }
                                if (tableOptions.onSuccess) {
                                    tableOptions.onSuccess.call(undefined, the, res);
                                }
                                rabbitcms_backend_1.RabbitCMS.unblockUI(tableContainer);
                                return res.data;
                            },
                            "error": function () {
                                if (tableOptions.onError) {
                                    tableOptions.onError.call(undefined, the);
                                }
                                rabbitcms_backend_1.RabbitCMS.alert({
                                    type: 'danger',
                                    icon: 'warning',
                                    message: tableOptions.dataTable.language.metronicAjaxRequestGeneralError,
                                    container: tableWrapper,
                                    place: 'prepend'
                                });
                                rabbitcms_backend_1.RabbitCMS.unblockUI(tableContainer);
                            }
                        },
                        "drawCallback": function () {
                            if (tableInitialized === false) {
                                tableInitialized = true;
                                table.show();
                            }
                            countSelectedRecords();
                            if (tableOptions.onDataLoad) {
                                tableOptions.onDataLoad.call(undefined, the);
                            }
                        }
                    }
                }, options);
                tableOptions = options;
                table = $(options.src);
                tableContainer = table.parents(".table-container");
                var tmp = $.fn.dataTableExt.oStdClasses;
                $.fn.dataTableExt.oStdClasses.sWrapper = $.fn.dataTableExt.oStdClasses.sWrapper + " dataTables_extended_wrapper";
                $.fn.dataTableExt.oStdClasses.sFilterInput = "form-control input-xs input-sm input-inline";
                $.fn.dataTableExt.oStdClasses.sLengthSelect = "form-control input-xs input-sm input-inline";
                dataTable = table.DataTable(options.dataTable);
                $.fn.dataTableExt.oStdClasses.sWrapper = tmp.sWrapper;
                $.fn.dataTableExt.oStdClasses.sFilterInput = tmp.sFilterInput;
                $.fn.dataTableExt.oStdClasses.sLengthSelect = tmp.sLengthSelect;
                tableWrapper = table.parents('.dataTables_wrapper');
                if ($('.table-actions-wrapper', tableContainer).length === 1) {
                    $('.table-group-actions', tableWrapper).html($('.table-actions-wrapper', tableContainer).html());
                    $('.table-actions-wrapper', tableContainer).remove();
                }
                $('.group-checkable', table).change(function () {
                    var set = table.find('tbody > tr > td:nth-child(1) input[type="checkbox"]');
                    var checked = $(this).prop("checked");
                    $(set).each(function () {
                        $(this).prop("checked", checked);
                    });
                    countSelectedRecords();
                });
                table.on('change', 'tbody > tr > td:nth-child(1) input[type="checkbox"]', function () {
                    countSelectedRecords();
                });
                table.on('click', '.filter-submit', function (e) {
                    e.preventDefault();
                    the.submitFilter();
                });
                table.on('click', '.filter-cancel', function (e) {
                    e.preventDefault();
                    the.resetFilter();
                });
            },
            submitFilter: function () {
                the.setAjaxParam("action", tableOptions.filterApplyAction);
                $('textarea.form-filter, select.form-filter, input.form-filter:not([type="radio"],[type="checkbox"])', table).each(function () {
                    the.setAjaxParam($(this).attr("name"), $(this).val());
                });
                $('input.form-filter[type="checkbox"]:checked', table).each(function () {
                    the.addAjaxParam($(this).attr("name"), $(this).val());
                });
                $('input.form-filter[type="radio"]:checked', table).each(function () {
                    the.setAjaxParam($(this).attr("name"), $(this).val());
                });
                dataTable.ajax.reload();
            },
            resetFilter: function () {
                $('textarea.form-filter, select.form-filter, input.form-filter', table).each(function () {
                    $(this).val("");
                });
                $('input.form-filter[type="checkbox"]', table).each(function () {
                    $(this).prop("checked", false);
                });
                the.clearAjaxParams();
                the.setAjaxParam('_token', rabbitcms_backend_1.RabbitCMS.getToken());
                the.addAjaxParam("action", tableOptions.filterCancelAction);
                dataTable.ajax.reload();
            },
            getSelectedRowsCount: function () {
                return $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', table).length;
            },
            getSelectedRows: function () {
                var rows = [];
                $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', table).each(function () {
                    rows.push($(this).val());
                });
                return rows;
            },
            setAjaxParam: function (name, value) {
                ajaxParams[name] = value;
            },
            addAjaxParam: function (name, value) {
                if (!ajaxParams[name]) {
                    ajaxParams[name] = [];
                }
                var skip = false;
                for (var i = 0; i < (ajaxParams[name]).length; i++) {
                    if (ajaxParams[name][i] === value) {
                        skip = true;
                    }
                }
                if (skip === false) {
                    ajaxParams[name].push(value);
                }
            },
            clearAjaxParams: function () {
                ajaxParams = {};
            },
            getDataTable: function () {
                return dataTable;
            },
            getTableWrapper: function () {
                return tableWrapper;
            },
            gettableContainer: function () {
                return tableContainer;
            },
            getTable: function () {
                return table;
            }
        };
    }
    exports.DataTable = DataTable;
});
//# sourceMappingURL=rabbitcms.datatable.js.map