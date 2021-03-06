/***
 Wrapper/Helper Class for datagrid based on jQuery Datatable Plugin
 ***/
var Datatable = function () {

    var tableOptions; // main options
    var dataTable; // datatable object
    var table; // actual table jquery object
    var tableContainer; // actual table container object
    var tableWrapper; // actual table wrapper jquery object
    var tableInitialized = false;
    var ajaxParams = {}; // set filter mode
    var the;

    var countSelectedRecords = function () {
        var selected = $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', table).size();
        var text = tableOptions.dataTable.language.metronicGroupActions;
        if (selected > 0) {
            $('.table-group-actions > span', tableWrapper).text(text.replace("_TOTAL_", selected));
        } else {
            $('.table-group-actions > span', tableWrapper).text("");
        }
    };

    return {

        //main function to initiate the module
        init: function (options) {

            if (!$().dataTable) {
                return;
            }

            the = this;

            // default settings
            options = $.extend(true, {
                src: "", // actual table
                filterApplyAction: "filter",
                filterCancelAction: "filter_cancel",
                resetGroupActionInputOnSuccess: true,
                loadingMessage: 'Завантаження...',
                dataTable: {
                    "dom": "<'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'<'table-group-actions pull-right'B>>r><'table-scrollable't><'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'>>", // datatable layout
                    "stateSave": true,
                    "buttons": [],
                    "pageLength": 25, // default records per page
                    "lengthMenu": [
                        [25, 50, 100],
                        [25, 50, 100]
                    ],
                    "language": { // language settings
                        // metronic spesific
                        "metronicGroupActions": "_TOTAL_ записів вибрано:  ",
                        "metronicAjaxRequestGeneralError": "Не вдалося виконати запит. Будь ласка, перевірте ваше інтернет з'єднання",

                        // data tables spesific
                        "lengthMenu": "<span class='seperator'>|</span>_MENU_  записів",
                        "info": "<span class='seperator'>|</span>Всього знайдено _TOTAL_ записів",
                        "infoEmpty": "Записи відсутні",
                        "emptyTable": "Дані відсутні в таблиці",
                        "zeroRecords": "Не знайдено жодного запису",
                        "paginate": {
                            "previous": "Попередня",
                            "next": "Наступна",
                            "last": "Остання",
                            "first": "Перша",
                            "page": "Сторінка",
                            "pageOf": "з"
                        },
                        "oAria": {
                            "sSortAscending": ": активувати для сортування стовпців за зростанням",
                            "sSortDescending": ": активувати для сортування стовпців за спаданням"
                        },
                        "sProcessing": " Зачекайте... ",
                        "sLengthMenu": '<span class="seperator">|</span>Показати _MENU_ записів',
                        "sZeroRecords": "Записи відсутні.",
                        "sInfo": '<span class="seperator">|</span>Записи з _START_ по _END_ із _TOTAL_ записів ',
                        "sInfoFiltered": "(відфільтровано з _MAX_ записів)",
                        "sInfoPostFix": "",
                        "sSearch": "Пошук:",
                        "sUrl": ""
                    },

                    "orderCellsTop": true,
                    "columnDefs": [{ // define columns sorting options(by default all columns are sortable extept the first checkbox column)
                        'orderable': false,
                        'targets': ['_all']
                    }],
                    order: [
                        [0, 'desc']
                    ],
                    "pagingType": "bootstrap_extended", // pagination type(bootstrap, bootstrap_full_number or bootstrap_extended)
                    "autoWidth": false, // disable fixed width and enable fluid table
                    "processing": false, // enable/disable display message box on record load
                    "serverSide": true, // enable/disable server side ajax loading

                    "ajax": { // define ajax settings
                        "url": "", // ajax URL
                        "type": "POST", // request type
                        "timeout": 20000,
                        "data": function (data) { // add request parameters before submit
                            $.each(ajaxParams, function (key, value) {
                                data[key] = value;
                            });
                            Metronic.blockUI({
                                message: tableOptions.loadingMessage,
                                target: tableContainer,
                                overlayColor: 'none',
                                cenrerY: true,
                                boxed: true
                            });
                        },
                        "dataSrc": function (res) { // Manipulate the data returned from the server
                            if (res.customActionMessage) {
                                Metronic.alert({
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

                            if ($('.group-checkable', table).size() === 1) {
                                $('.group-checkable', table).attr("checked", false);
                                $.uniform.update($('.group-checkable', table));
                            }

                            if (tableOptions.onSuccess) {
                                tableOptions.onSuccess.call(undefined, the);
                            }

                            Metronic.unblockUI(tableContainer);

                            return res.data;
                        },
                        "error": function () { // handle general connection errors
                            if (tableOptions.onError) {
                                tableOptions.onError.call(undefined, the);
                            }

                            Metronic.alert({
                                type: 'danger',
                                icon: 'warning',
                                message: tableOptions.dataTable.language.metronicAjaxRequestGeneralError,
                                container: tableWrapper,
                                place: 'prepend'
                            });

                            Metronic.unblockUI(tableContainer);
                        }
                    },
                    /* ajax: function (data, callback, settings) {
                        $.each(ajaxParams, function (key, value) {
                            data[key] = value;
                        });
                        RabbitCMS._ajax({
                            url: table.data('link'),
                            method: 'post',
                            timeout: 10000,
                            data: data,
                            dataType: 'json',
                            warningTarget: tableContainer,
                            blockTarget: tableContainer,
                            blockOptions: {
                                message: tableOptions.loadingMessage,
                                overlayColor: 'none',
                                cenrerY: true,
                                boxed: true
                            },
                            success: function (result) {
                                if (result.customActionMessage) {
                                    RabbitCMS.alert({
                                        type: (result.customActionStatus == 'OK' ? 'success' : 'danger'),
                                        icon: (result.customActionStatus == 'OK' ? 'check' : 'warning'),
                                        message: result.customActionMessage,
                                        container: tableWrapper,
                                        place: 'prepend'
                                    });
                                }
                                if (result.customActionStatus) {
                                    if (tableOptions.resetGroupActionInputOnSuccess) {
                                        $('.table-group-action-input', tableWrapper).val("");
                                    }
                                }
                                if ($('.group-checkable', table).length === 1) {
                                    $('.group-checkable', table).prop("checked", false);
                                }
                                if (tableOptions.onSuccess) {
                                    tableOptions.onSuccess.call(undefined, this, res);
                                }
                                callback(res);
                            },
                            error: function () {
                                if (tableOptions.onError) {
                                    tableOptions.onError.call(undefined, this);
                                }
                            }
                        });
                    },*/
                    "drawCallback": function (oSettings) { // run some code on table redraw
                        if (tableInitialized === false) { // check if table has been initialized
                            tableInitialized = true; // set table initialized
                            table.show(); // display table
                        }
                        Metronic.initUniform($('input[type="checkbox"]', table)); // reinitialize uniform checkboxes on each table reload
                        countSelectedRecords(); // reset selected records indicator
                    }
                }
            }, options);

            tableOptions = options;

            // create table's jquery object
            table = $(options.src);

            tableContainer = table.parents(".table-container");

            table.on('preXhr.dt', function (e, settings, data) {
                // get all typeable inputs
                $('textarea.form-filter, select.form-filter, input.form-filter:not([type="radio"],[type="checkbox"])', tableContainer).each(function () {
                    data[$(this).attr("name")] = $(this).val();
                });

                // get all checkboxes
                $('input.form-filter[type="checkbox"]:checked', tableContainer).each(function () {
                    data[$(this).attr("name")] = $(this).val();
                });

                // get all radio buttons
                $('input.form-filter[type="radio"]:checked', tableContainer).each(function () {
                    data[$(this).attr("name")] = $(this).val();
                });
            });

            // apply the special class that used to restyle the default datatable
            var tmp = $.fn.dataTableExt.oStdClasses;

            $.fn.dataTableExt.oStdClasses.sWrapper = $.fn.dataTableExt.oStdClasses.sWrapper + " dataTables_extended_wrapper";
            $.fn.dataTableExt.oStdClasses.sFilterInput = "form-control input-small input-sm input-inline";
            $.fn.dataTableExt.oStdClasses.sLengthSelect = "form-control input-xsmall input-sm input-inline";

            // initialize a datatable
            dataTable = table.DataTable(options.dataTable);

            // revert back to default
            $.fn.dataTableExt.oStdClasses.sWrapper = tmp.sWrapper;
            $.fn.dataTableExt.oStdClasses.sFilterInput = tmp.sFilterInput;
            $.fn.dataTableExt.oStdClasses.sLengthSelect = tmp.sLengthSelect;

            // get table wrapper
            tableWrapper = table.parents('.dataTables_wrapper');

            // build table group actions panel
            if ($('.table-actions-wrapper', tableContainer).size() === 1) {
                $('.table-group-actions', tableWrapper).html($('.table-actions-wrapper', tableContainer).html()); // place the panel inside the wrapper
                $('.table-actions-wrapper', tableContainer).remove(); // remove the template container
            }
            // handle group checkboxes check/uncheck
            $('.group-checkable', table).change(function () {
                var set = $('tbody > tr > td:nth-child(1) input[type="checkbox"]', table);
                var checked = $(this).is(":checked");
                $(set).each(function () {
                    $(this).attr("checked", checked);
                });
                $.uniform.update(set);
                countSelectedRecords();
            });

            // handle row's checkbox click
            table.on('change', 'tbody > tr > td:nth-child(1) input[type="checkbox"]', function () {
                countSelectedRecords();
            });

            // handle filter submit button click
            tableContainer.on('click', '.filter-submit', function (e) {
                e.preventDefault();
                the.submitFilter();
            });

            // handle filter cancel button click
            tableContainer.on('click', '.filter-cancel', function (e) {
                e.preventDefault();
                the.resetFilter();
            });
        },

        submitFilter: async function () {
            the.setAjaxParam("action", tableOptions.filterApplyAction);

            // get all typeable inputs
            $('textarea.form-filter, select.form-filter, input.form-filter:not([type="radio"],[type="checkbox"])', tableContainer).each(function () {
                the.setAjaxParam($(this).attr("name"), $(this).val());
            });

            // get all checkboxes
            $('input.form-filter[type="checkbox"]:checked', tableContainer).each(function () {
                the.addAjaxParam($(this).attr("name"), $(this).val());
            });

            // get all radio buttons
            $('input.form-filter[type="radio"]:checked', tableContainer).each(function () {
                the.setAjaxParam($(this).attr("name"), $(this).val());
            });

            var eventData = the.trigger('beforeSubmitFilter');
            if (eventData) {
                the.setAjaxParam("qBuilder", await eventData.filters);
            } else {
                the.setAjaxParam("qBuilder", {});
            }

            dataTable.ajax.reload();
        },
      
        populateParams: async function (params) {
          params = params || {};
          var eventData = the.trigger('beforeSubmitFilter');
          if (eventData) {
            params['qBuilder'] = await eventData.filters;
          }
          params['_token'] = _TOKEN;
          $('.form-filter', tableContainer).each(function () {
            var self = $(this);
            params[self.attr('name')] = self.val();
          });
          
          return params
        },

        exportHandler: async function (link, params, ajax, method) {
            params = await this.populateParams(params)
          
            if (ajax) {
                RabbitCMS._ajax({url: link, method: method || 'POST', data: params}, function (data) {
                    if (ajax instanceof Function) {
                        ajax(data);
                    }
                });
            } else {
                var form = $('<form/>')
                    .attr('action', link)
                    .attr('target', '_blank')
                    .attr('method', method || 'post')
                    .css({
                      display: 'none'
                    });
                $.each(params, function (name, value) {
                    form.append(
                        $('<input/>').attr('type', 'hidden')
                            .attr('name', name)
                            .attr('value', value)
                    );
                });

                tableContainer.append(form);
                form.submit();
                form.remove();
            }
        },

        trigger: function (eventType) {
            var event = new $.Event(eventType);

            table.triggerHandler(event);

            return event.data;
        },

        resetFilter: function () {
            $('textarea.form-filter,  input.form-filter', tableContainer).each(function () {
                $(this).val("");
            });
            $('select.form-filter', tableContainer).each(function () {
              $(this).val($('option[selected]',this).val());
            });
            $('input.form-filter[type="checkbox"]', tableContainer).each(function () {
                $(this).attr("checked", false);
            });
            the.clearAjaxParams();
            the.setAjaxParam('_token', _TOKEN);
            the.addAjaxParam("action", tableOptions.filterCancelAction);

            the.trigger('beforeResetFilter');

            dataTable.ajax.reload();
        },

        update: function () {
            dataTable.ajax.reload(null, false);
        },

        getSelectedRowsCount: function () {
            return $('tbody > tr > td:nth-child(1) input[type="checkbox"]:checked', table).size();
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

            skip = false;
            for (var i = 0; i < (ajaxParams[name]).length; i++) { // check for duplicates
                if (ajaxParams[name][i] === value) {
                    skip = true;
                }
            }

            if (skip === false) {
                ajaxParams[name].push(value);
            }
        },

        clearAjaxParams: function (name, value) {
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

};
