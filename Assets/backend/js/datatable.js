define(["require", "exports", "jquery", "jszip", "rabbitcms/backend", "i18n!rabbitcms/nls/datatable", "pdfmake", "pdfmake/vfs_fonts", "datatables.net", "datatables.net-bs", "datatables.net-buttons", "datatables.net-buttons/js/buttons.bootstrap.min", "datatables.net-buttons/js/buttons.colVis.min", "datatables.net-buttons/js/buttons.html5.min", "datatables.net-buttons/js/buttons.print.min", "datatables.net-colReorder", "datatables.net-colReorder", "css!datatables.net-buttons/css/buttons.bootstrap.min.css"], function (require, exports, $, jszip, backend_1, i18n) {
    "use strict";
    window['JSZip'] = jszip;
    var DataTable = (function () {
        function DataTable(options) {
            var _this = this;
            this.tableInitialized = false;
            this.ajaxParams = {};
            var filters = $('.form-filter', options.src);
            options = $.extend(true, {
                src: "",
                filterApplyAction: "filter",
                filterCancelAction: "filter_cancel",
                resetGroupActionInputOnSuccess: true,
                loadingMessage: 'Loading...',
                dataTable: {
                    dom: "<'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'<'table-group-actions pull-right'B>>r><'table-responsive't><'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'>>",
                    pageLength: 10,
                    language: i18n.dataTable,
                    orderCellsTop: true,
                    columnDefs: [],
                    buttons: [],
                    pagingType: "bootstrap_extended",
                    autoWidth: false,
                    processing: false,
                    serverSide: true,
                    stateSave: true,
                    stateLoadParams: function (settings, data) {
                        filters.each(function (index, elem) {
                            var filter = $(elem);
                            var name = $(elem).attr('name');
                            if (data.hasOwnProperty(name))
                                filter.val(data[name]);
                        });
                        _this.submitFilter();
                    },
                    stateSaveParams: function (settings, data) {
                        filters.each(function () {
                            var self = $(this);
                            if (self.attr('name'))
                                data[self.attr('name')] = self.val().replace('"', '"');
                        });
                        return data;
                    },
                    ajax: function (data, callback, settings) {
                        $.each(_this.ajaxParams, function (key, value) {
                            data[key] = value;
                        });
                        backend_1.RabbitCMS.ajax({
                            url: _this.table.data('link'),
                            method: 'post',
                            timeout: 10000,
                            data: data,
                            dataType: 'json',
                            warningTarget: _this.tableContainer,
                            blockTarget: _this.tableContainer,
                            blockOptions: {
                                message: _this.tableOptions.loadingMessage,
                                overlayColor: 'none',
                                cenrerY: true,
                                boxed: true
                            },
                            success: function (res) {
                                if (res.customActionMessage) {
                                    backend_1.RabbitCMS.alert({
                                        type: (res.customActionStatus == 'OK' ? 'success' : 'danger'),
                                        icon: (res.customActionStatus == 'OK' ? 'check' : 'warning'),
                                        message: res.customActionMessage,
                                        container: _this.tableWrapper,
                                        place: 'prepend'
                                    });
                                }
                                if (res.customActionStatus) {
                                    if (_this.tableOptions.resetGroupActionInputOnSuccess) {
                                        $('.table-group-action-input', _this.tableWrapper).val("");
                                    }
                                }
                                if ($('.group-checkable', _this.table).length === 1) {
                                    $('.group-checkable', _this.table).prop("checked", false);
                                }
                                if (_this.tableOptions.onSuccess) {
                                    _this.tableOptions.onSuccess.call(undefined, _this, res);
                                }
                                callback(res);
                            },
                            error: function () {
                                if (_this.tableOptions.onError) {
                                    _this.tableOptions.onError.call(undefined, _this);
                                }
                            }
                        });
                    },
                    drawCallback: function () {
                        if (_this.tableInitialized === false) {
                            _this.tableInitialized = true;
                            _this.table.show();
                        }
                        _this.countSelectedRecords();
                        if (_this.tableOptions.onDataLoad) {
                            _this.tableOptions.onDataLoad.call(undefined, _this);
                        }
                    }
                }
            }, options);
            this.tableOptions = options;
            this.table = $(options.src);
            this.tableContainer = this.table.parents(".table-container");
            var tmp = $.fn.dataTableExt.oStdClasses;
            $.fn.dataTableExt.oStdClasses.sWrapper = $.fn.dataTableExt.oStdClasses.sWrapper + " dataTables_extended_wrapper";
            $.fn.dataTableExt.oStdClasses.sFilterInput = "form-control input-xs input-sm input-inline";
            $.fn.dataTableExt.oStdClasses.sLengthSelect = "form-control input-xs input-sm input-inline";
            this.dataTable = this.table.DataTable(options.dataTable);
            $.fn.dataTableExt.oStdClasses.sWrapper = tmp.sWrapper;
            $.fn.dataTableExt.oStdClasses.sFilterInput = tmp.sFilterInput;
            $.fn.dataTableExt.oStdClasses.sLengthSelect = tmp.sLengthSelect;
            this.tableWrapper = this.table.parents('.dataTables_wrapper');
            if ($('.table-actions-wrapper', this.tableContainer).length === 1) {
                $('.table-group-actions', this.tableWrapper).html($('.table-actions-wrapper', this.tableContainer).html());
                $('.table-actions-wrapper', this.tableContainer).remove();
            }
            $('.group-checkable', this.table).change(function (e) {
                var set = _this.table.find('tbody > tr > td:nth-child(1) input[type="checkbox"]');
                var checked = $(e.target).prop("checked");
                $(set).each(function () {
                    $(this).prop("checked", checked);
                });
                _this.countSelectedRecords();
            });
            this.table.on('change', '.form-filter', function () {
                _this.submitFilter();
            });
            this.table.on('change', 'tbody > tr > td:nth-child(1) input[type="checkbox"]', function () {
                _this.countSelectedRecords();
            });
            this.table.on('click', '.filter-submit', function (e) {
                e.preventDefault();
                _this.submitFilter();
            });
            this.table.on('click', '.filter-cancel', function (e) {
                e.preventDefault();
                _this.resetFilter();
            });
        }
        DataTable.prototype.countSelectedRecords = function () {
            var selected = $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', this.table).length;
            if (selected > 0) {
                $('.table-group-actions > span', this.tableWrapper).text(i18n.groupActions.replace('_TOTAL_', selected.toString()));
            }
            else {
                $('.table-group-actions > span', this.tableWrapper).text("");
            }
        };
        ;
        DataTable.prototype.submitFilter = function () {
            var _this = this;
            this.setAjaxParam("action", this.tableOptions.filterApplyAction);
            $('textarea.form-filter, select.form-filter, input.form-filter:not([type="radio"],[type="checkbox"])', this.table).each(function (i, e) {
                _this.setAjaxParam($(e).attr("name"), $(e).val());
            });
            $('input.form-filter[type="checkbox"]:checked', this.table).each(function (i, e) {
                _this.addAjaxParam($(e).attr("name"), $(e).val());
            });
            $('input.form-filter[type="radio"]:checked', this.table).each(function (i, e) {
                _this.setAjaxParam($(e).attr("name"), $(e).val());
            });
            this.update();
        };
        DataTable.prototype.resetFilter = function () {
            $('textarea.form-filter, select.form-filter, input.form-filter', this.table).each(function () {
                $(this).val("").trigger('change');
            });
            $('input.form-filter[type="checkbox"]', this.table).each(function () {
                $(this).prop("checked", false);
            });
            this.clearAjaxParams();
            this.addAjaxParam("action", this.tableOptions.filterCancelAction);
            this.update();
        };
        DataTable.prototype.update = function () {
            var _this = this;
            clearTimeout(this.timer);
            this.timer = setTimeout(function () {
                _this.dataTable.ajax.reload();
            }, 10);
        };
        DataTable.prototype.getSelectedRowsCount = function () {
            return $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', this.table).length;
        };
        DataTable.prototype.getSelectedRows = function () {
            var rows = [];
            $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', this.table).each(function () {
                rows.push($(this).val());
            });
            return rows;
        };
        DataTable.prototype.setAjaxParam = function (name, value) {
            this.ajaxParams[name] = value;
        };
        DataTable.prototype.addAjaxParam = function (name, value) {
            if (!this.ajaxParams[name]) {
                this.ajaxParams[name] = [];
            }
            var skip = false;
            for (var i = 0; i < (this.ajaxParams[name]).length; i++) {
                if (this.ajaxParams[name][i] === value) {
                    skip = true;
                }
            }
            if (skip === false) {
                this.ajaxParams[name].push(value);
            }
        };
        DataTable.prototype.clearAjaxParams = function () {
            this.ajaxParams = {};
        };
        DataTable.prototype.getDataTable = function () {
            return this.dataTable;
        };
        DataTable.prototype.getTableWrapper = function () {
            return this.tableWrapper;
        };
        DataTable.prototype.getTableContainer = function () {
            return this.tableContainer;
        };
        DataTable.prototype.getTable = function () {
            return this.table;
        };
        return DataTable;
    }());
    exports.DataTable = DataTable;
});
//# sourceMappingURL=datatable.js.map