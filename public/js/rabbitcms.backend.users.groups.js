define(["jquery"], function ($) {
    "use strict";

    function table(portlet) {
        var dataTable = new Datatable();
        var tableSelector = $('.data-table', portlet);

        dataTable.setAjaxParam('_token', _TOKEN);
        dataTable.init({
            src: tableSelector,
            dataTable: {
                ajax: {
                    url: tableSelector.data('link')
                },
                ordering: false
            }
        });

        tableSelector.on('change', '.form-filter', function () {
            dataTable.submitFilter();
        });

        MicroEvent.bind('groups.updated', function () {
            dataTable.getDataTable().ajax.reload();
        });

        portlet.on('click', '[rel="destroy"]', function () {
            var self = $(this);
            var link = self.attr('href');

            RabbitCMS.Dialogs.onDelete(link, function () {
                dataTable.getDataTable().ajax.reload();
            });

            return false;
        });
    }

    function form(portlet) {
        var form = $('form', portlet);

        form.validate({
            focusInvalid: true,
            rules: {
                "groups[caption]": {
                    required: true
                }
            },
            highlight: function (element) {
                $(element).closest('.form-group').addClass('has-error');
            },
            unhighlight: function (element) {
                $(element).closest('.form-group').removeClass('has-error');
            },
            errorPlacement: function (error, element) {
                return false;
            },
            submitHandler: function (form) {
                RabbitCMS.submitForm(form, function (data) {
                    MicroEvent.trigger('groups.updated');
                });
            }
        });

        portlet.on('change', '.write-rule', function () {
            if ($(this).is(':checked')) {
                $(this).parents('tr').find('.read-rule').prop('checked', true);
                Metronic.updateUniform();
            }
        });

        portlet.on('change', '.read-rule', function () {
            var _write = $(this).parents('tr').find('.write-rule');
            if (_write.is(':checked')) {
                $(this).prop('checked', true);
                Metronic.updateUniform();
            }
        });

        portlet.on('change', '.module-read-rule', function () {
            var _module = $(this).data('module');
            var _write = $(this).parents('tr').find('.module-write-rule');

            if (_write.is(':checked')) {
                $(this).prop('checked', true);
            }

            $('.' + _module + '.read-rule').prop('checked', $(this).prop('checked')).trigger('change');

            Metronic.updateUniform();
        });

        portlet.on('change', '.module-write-rule', function () {
            var _module = $(this).data('module');
            if ($(this).is(':checked')) {
                $(this).parents('tr').find('.module-read-rule').prop('checked', true);
            }

            $('.' + _module + '.write-rule').prop('checked', $(this).prop('checked')).trigger('change');

            Metronic.updateUniform();
        });

        if (form.data('type') == 'update') {
            var dataTable = new Datatable();
            var tableSelector = $('.data-table', portlet);

            dataTable.setAjaxParam('_token', _TOKEN);
            dataTable.init({
                src: tableSelector,
                dataTable: {
                    ajax: {
                        url: tableSelector.data('link')
                    },
                    ordering: false
                }
            });

            portlet.on('click', '[rel="destroy"]', function () {
                var self = $(this);
                var link = self.attr('href');

                RabbitCMS.Dialogs.onDelete(link, function () {
                    dataTable.getDataTable().ajax.reload();
                });

                return false;
            });
        }
    }

    var MicroEvent = new RabbitCMS.MicroEvent({table: table, form: form});

    return MicroEvent;
});